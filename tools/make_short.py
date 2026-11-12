"""tools/make_short.py — cut a ≤60 s vertical Short out of a finished 16:9 episode.

  python3 tools/make_short.py --video studio/projects/<slug>/out/<Title>.mp4 --words studio/projects/<slug>/timeline/words.json \
      --segments "You've replayed|hiding something?" "worry may work like a shield|fear underneath." ... \
      --title1 "WHY YOU CAN'T STOP" --title2 "OVERTHINKING" --out out/short.mp4

Each segment is "first words|last words" of the narration (searched in order). Contiguous segments are merged.
Layout: 1080x1920, blurred copy behind, the episode scaled to 1080x860 in the middle, overlay (tools/overlay.html,
rendered with Playwright) with the channel pill, the 2-line title, "Full video on the channel" and the watermark.
Cuts each piece to its own file first (cutting all at once from a long video runs out of memory).
"""
import argparse, json, os, re, shutil, subprocess, sys, tempfile
HERE = os.path.dirname(os.path.abspath(__file__))
ap = argparse.ArgumentParser()
ap.add_argument("--video", required=True); ap.add_argument("--words", required=True); ap.add_argument("--segments", nargs="+", required=True)
ap.add_argument("--title1", default="WHY YOU CAN'T STOP"); ap.add_argument("--title2", default="OVERTHINKING"); ap.add_argument("--out", required=True)
ap.add_argument("--watermark", default=os.path.join(HERE, "..", "channel", "watermark_150x150.png"))
a = ap.parse_args()
W = json.load(open(a.words))["words"]; n = lambda s: re.sub(r"[^\w']", "", s.lower())
def find(ph, after):
    t = [n(x) for x in ph.split()]
    for i in range(len(W)):
        if W[i]["start"] >= after and all(i + k < len(W) and n(W[i + k]["word"]) == t[k] for k in range(len(t))): return i
    sys.exit("not found: " + ph)
segs, after = [], 0
for s in a.segments:
    x, y = s.split("|"); i = find(x, after); j = find(y, W[i]["start"]) + len(y.split()) - 1
    s0, s1 = max(0, W[i]["start"] - 0.12), W[j]["end"] + 0.35; after = W[j]["end"]
    if segs and s0 - segs[-1][1] < 0.2: segs[-1][1] = s1
    else: segs.append([s0, s1])
tot = sum(b - a_ for a_, b in segs); print(f"{len(segs)} segments, {tot:.1f}s"); tot > 60 and print("WARNING: longer than 60 s")
tmp = tempfile.mkdtemp()
for f in ["overlay.html", "shot.cjs", "fredoka-latin-700-normal.woff2", "nunito-latin-900-normal.woff2"]: shutil.copy(os.path.join(HERE, f), tmp)
shutil.copy(a.watermark, os.path.join(tmp, "wm.png"))
html = open(os.path.join(tmp, "overlay.html")).read().replace("WHY YOU CAN'T STOP", a.title1).replace(">OVERTHINKING<", f">{a.title2}<")
open(os.path.join(tmp, "overlay.html"), "w").write(html)
subprocess.run(["node", "shot.cjs"], cwd=tmp, check=True)
lst = open(os.path.join(tmp, "list.txt"), "w")
for k, (s0, s1) in enumerate(segs):
    d = s1 - s0; p = os.path.join(tmp, f"seg{k}.mp4")
    subprocess.run(["ffmpeg", "-y", "-v", "error", "-ss", f"{s0:.3f}", "-i", a.video, "-t", f"{d:.3f}", "-af", f"afade=t=in:d=0.06,afade=t=out:st={d-0.12:.3f}:d=0.12",
                    "-c:v", "libx264", "-crf", "16", "-preset", "fast", "-r", "24", "-c:a", "aac", "-b:a", "192k", "-ar", "48000", p], check=True)
    lst.write(f"file '{p}'\n")
lst.close(); j = os.path.join(tmp, "joined.mp4")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-f", "concat", "-safe", "0", "-i", lst.name, "-c", "copy", j], check=True)
fc = ("[0:v]split[v1][v2];[v1]scale=-2:1920,crop=1080:1920,boxblur=28:2,eq=brightness=-0.18:saturation=0.8[bg];"
      "[v2]scale=-2:860,crop=1080:860[fg];[bg][fg]overlay=0:520[c];[c][1:v]overlay=0:0,format=yuv420p[out]")
subprocess.run(["ffmpeg", "-y", "-v", "error", "-i", j, "-i", os.path.join(tmp, "overlay.png"), "-filter_complex", fc, "-map", "[out]", "-map", "0:a",
                "-c:v", "libx264", "-crf", "19", "-preset", "medium", "-c:a", "copy", "-movflags", "+faststart", "-threads", "2", a.out], check=True)
print("wrote", a.out)
