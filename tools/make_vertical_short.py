"""tools/make_vertical_short.py — FULL-SCREEN 9:16 Short from an episode (re-rendered without captions, reframed per shot).

  python3 tools/make_vertical_short.py --project studio/projects/<slug> --final studio/projects/<slug>/out/<Title>.mp4 \
      --ranges 0-26.2 168.6-175.3 183.5-186.9 --title1 "WHY YOUR BRAIN" --title2 "REPLAYS CRINGE" --out out/short1.mp4

How: a sibling project "<slug>-vertical" (symlinked scenes/timeline/input, story copy with bars "none" + captions off,
config 1440p) renders each range; every shot is cropped to 1080x1440 around shots[].params.vfocus (0..1 of the width,
default 0.5); audio is cut from the finished episode so music/SFX match; big word captions (ASS, Inter) are burned in;
the top band gets the hook title (tools/overlay_v.html via Playwright). Result: 1080x1920, video fills y 240..1680.
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__)); ROOT = os.path.dirname(HERE)
ap = argparse.ArgumentParser()
ap.add_argument('--project', required=True); ap.add_argument('--final', required=True); ap.add_argument('--ranges', nargs='+', required=True)
ap.add_argument('--title1', default=''); ap.add_argument('--title2', default=''); ap.add_argument('--out', required=True); ap.add_argument('--workers', default='3')
a = ap.parse_args()
P = os.path.abspath(a.project); V = P.rstrip('/') + '-vertical'; os.makedirs(os.path.join(V, 'story'), exist_ok=True); os.makedirs(os.path.join(V, 'build'), exist_ok=True)
for d in ['scenes', 'timeline', 'input']:
    l = os.path.join(V, d)
    if not os.path.exists(l): os.symlink(os.path.join(P, d), l)
cfg = json.load(open(os.path.join(P, 'config.json'))); cfg.update({'resolution': '1440p', 'captions': False, 'bars': 'none'}); json.dump(cfg, open(os.path.join(V, 'config.json'), 'w'))
story = json.load(open(os.path.join(P, 'story', 'shots.json')))
for s in story['shots']: s['bars'] = 'none'; s['captions'] = False
json.dump(story, open(os.path.join(V, 'story', 'shots.json'), 'w'))
words = json.load(open(os.path.join(P, 'timeline', 'words.json')))['words']
R = [tuple(map(float, r.split('-'))) for r in a.ranges]
tmp = tempfile.mkdtemp(); pieces = []; t_out = 0.0; caps = []
def run(cmd): subprocess.run(cmd, check=True)
for i, (r0, r1) in enumerate(R):
    rv = os.path.join(tmp, f'range{i}.mp4')
    run(['node', os.path.join(ROOT, 'studio', 'render.mjs'), '--project', V, '--from', str(r0), '--to', str(r1), '--workers', a.workers, '--out', rv])
    ra = os.path.join(tmp, f'range{i}.m4a'); d = r1 - r0
    run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{r0:.3f}', '-i', a.final, '-t', f'{d:.3f}', '-vn', '-af', f'afade=t=in:d=0.05,afade=t=out:st={d-0.1:.3f}:d=0.1', '-c:a', 'aac', '-b:a', '192k', ra])
    # per-shot crops inside this range
    segs = []
    for s in story['shots']:
        a0, a1 = max(r0, s['start']), min(r1, s['end'])
        if a1 - a0 > 0.02: segs.append((a0 - r0, a1 - r0, float(s.get('params', {}).get('vfocus', 0.5))))
    cv = os.path.join(tmp, f'crop{i}.mp4'); parts = []
    for k, (s0, s1, f) in enumerate(segs):
        x = int(max(0, min(2560 - 1080, f * 2560 - 540))); pp = os.path.join(tmp, f'c{i}_{k}.mp4')
        run(['ffmpeg', '-y', '-v', 'error', '-ss', f'{s0:.3f}', '-i', rv, '-t', f'{s1 - s0:.3f}', '-vf', f'crop=1080:1440:{x}:0', '-an', '-c:v', 'libx264', '-crf', '16', '-preset', 'fast', '-r', '24', pp]); parts.append(pp)
    lst = os.path.join(tmp, f'l{i}.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in parts))
    run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', cv])
    pv = os.path.join(tmp, f'piece{i}.mp4'); run(['ffmpeg', '-y', '-v', 'error', '-i', cv, '-i', ra, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-c:a', 'copy', '-shortest', pv]); pieces.append(pv)
    for w in words:
        if r0 <= w['start'] < r1: caps.append((t_out + w['start'] - r0, t_out + min(w['end'], r1) - r0, w['word']))
    t_out += d
print(f'total {t_out:.1f}s'); t_out > 60 and print('WARNING: over 60 s')
lst = os.path.join(tmp, 'all.txt'); open(lst, 'w').write(''.join(f"file '{p}'\n" for p in pieces)); joined = os.path.join(tmp, 'joined.mp4')
run(['ffmpeg', '-y', '-v', 'error', '-f', 'concat', '-safe', '0', '-i', lst, '-c', 'copy', joined])
# captions: groups of up to 3 words, current word highlighted
def ts(x): h = int(x // 3600); m = int(x % 3600 // 60); s = x % 60; return f'{h}:{m:02d}:{s:05.2f}'
ass = ['[Script Info]', 'ScriptType: v4.00+', 'PlayResX: 1080', 'PlayResY: 1920', '', '[V4+ Styles]',
       'Format: Name, Fontname, Fontsize, PrimaryColour, SecondaryColour, OutlineColour, BackColour, Bold, Italic, Underline, StrikeOut, ScaleX, ScaleY, Spacing, Angle, BorderStyle, Outline, Shadow, Alignment, MarginL, MarginR, MarginV, Encoding',
       'Style: Cap,Inter,92,&H00FFFFFF,&H00FFFFFF,&H00140905,&H96000000,1,0,0,0,100,100,0,0,1,9,4,2,60,60,560,1', '', '[Events]', 'Format: Layer, Start, End, Style, Name, MarginL, MarginR, MarginV, Effect, Text']
for gi in range(0, len(caps), 3):
    grp = caps[gi:gi + 3]
    for j, (s0, s1, w) in enumerate(grp):
        e = grp[j + 1][0] if j + 1 < len(grp) else s1 + 0.25
        txt = ' '.join(('{\\c&H4AD8FF&}' + re.sub(r'[{}]', '', x[2]).upper() + '{\\c&HFFFFFF&}') if k == j else re.sub(r'[{}]', '', x[2]).upper() for k, x in enumerate(grp))
        ass.append(f'Dialogue: 0,{ts(s0)},{ts(e)},Cap,,0,0,0,,{txt}')
assf = os.path.join(tmp, 'caps.ass'); open(assf, 'w').write('\n'.join(ass) + '\n')
# top title overlay
for f in ['overlay_v.html', 'shot_v.cjs', 'fredoka-latin-700-normal.woff2', 'nunito-latin-900-normal.woff2']: shutil.copy(os.path.join(HERE, f), tmp)
h = open(os.path.join(tmp, 'overlay_v.html')).read().replace('TITLE1', a.title1).replace('TITLE2', a.title2); open(os.path.join(tmp, 'overlay_v.html'), 'w').write(h)
run(['node', 'shot_v.cjs'], ) if False else subprocess.run(['node', 'shot_v.cjs'], cwd=tmp, check=True)
fc = ("[0:v]split[a][b];[a]scale=1440:1920,crop=1080:1920,boxblur=30:2,eq=brightness=-0.25:saturation=0.8[bg];[bg][b]overlay=0:240[c];"
      f"[c][1:v]overlay=0:0,ass={assf}:fontsdir=/usr/share/fonts/opentype/inter,format=yuv420p[out]")
os.makedirs(os.path.dirname(os.path.abspath(a.out)), exist_ok=True)
run(['ffmpeg', '-y', '-v', 'error', '-i', joined, '-i', os.path.join(tmp, 'overlay.png'), '-filter_complex', fc, '-map', '[out]', '-map', '0:a', '-c:v', 'libx264', '-crf', '19', '-preset', 'medium', '-c:a', 'copy', '-movflags', '+faststart', '-threads', '2', a.out])
print('wrote', a.out)
