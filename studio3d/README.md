# studio3d: 3D episodes (Three.js + Remotion)

Three.js scenes (through `@react-three/fiber` + `@remotion/three`) for the 3D animation; Remotion for
captions, audio, timing and the final MP4. Same channel look as the 2D studio: Arctic palette, the cast,
word captions, 24 fps, 1920×1080 episodes and 1080×1920 Shorts.

## Setup
```bash
cd studio3d && npm install
```
Pinned: remotion / @remotion/cli / @remotion/three 4.0.539, @react-three/fiber 9.8.2, three 0.169.0, react 19.2.0.
In cloud sessions Remotion can't download its own Chrome; `remotion.config.ts` uses the pre-installed
`/opt/pw-browsers` headless shell and SwiftShader WebGL (`swangle`). On a computer with a GPU:
`REMOTION_BROWSER=<chrome path> REMOTION_GL=angle`.

## Use
```bash
npx remotion studio                                        # live preview + timeline scrubbing in the browser
npx remotion still src/index.ts Ep01Demo3D still.png --frame=120 --scale=0.5   # QC one frame
npx remotion render src/index.ts Ep01Demo3D out/ep01-demo-3d-16x9.mp4           # full render (h264 + aac)
```
Speed here (4 CPU, no GPU): ~3 fps at 1080p, i.e. ~8 min per minute of video.

## Layout
- `src/Root.tsx`: compositions (one 16:9 + one 9:16 per scene).
- `src/kit/`: reusable pieces. `theme.ts` (Arctic palette, cast colours), `Milo3D.tsx` (Milo with pose
  controls: headTilt, headTurn, slump, handsToHead, blink, brows), `Captions.tsx` (word captions from
  `timeline/words.json` + `wordTime()`), `Label3D.tsx` (text callouts in 3D space).
- `src/demo/Ep01Demo3D.tsx`: test scene, the first 11 s of episode 1 in 3D (bedroom at night, thought
  clouds pile up, ×11 on "eleven", camera push-in, hands to temples on "working on the problem").

## Episode workflow (3D)
Steps 1–4 of the playbook are unchanged (script, voiceover, `align_to_pauses.py` → `words.json`).
Copy `words.json` into `src/<episode>/words.ts`, put the voiceover in `public/<episode>/`, build the shots
as React components timed with `wordTime()`, wrap each in `<Sequence from={…}>`, QC with `remotion still`, render.
Music/SFX: mix the rendered MP4 with `studio/audio` (or add `<Audio>` tracks in the composition).

Licence note: Remotion is free for individuals and companies of up to 3 people; larger teams need a company licence.
