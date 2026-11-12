# The Hidden Mind — production playbook

YouTube channel **The Hidden Mind**: animated psychology for overthinkers. Cinematic stick-figure videos made with the
GrowKaz Stickman studio (code-rendered 2D + Three.js, headless Chromium → ffmpeg). Style **arctic**, 16:9 1080p 24 fps,
word captions ON, generated music + SFX. Narrator: ElevenLabs "Roger – Laid-Back Casual Resonant" (owner sends the MP3).

## Repository map
- `studio/` — the studio (engine, renderer, audio, tools). `studio/projects/overthinking-full/` = episode 1, the reference
  for every later episode: `scenes/cast.js` (the cast), `scenes/accessories.js` (headphones, scarf, tie, …),
  `scenes/sets/` (bedroom [night/dawn via `{mood}`], study, street, motifs.js [thought clouds, the Shadow, wheel, head],
  kit2.js [wt/camOn/toScr/voidStage/icons/stamp/flipCard/field/titleBackdrop]), `scenes/shots/*.js` (69 shots).
- `studio/projects/character-lab/` — character design cards; `studio/projects/branding/` — avatar, banner, watermark, thumbnail.
- `plugin/` — the GrowKaz Stickman plugin (skills + references: style bible, engine API, render QC, sound design). READ
  `plugin/skills/make-2d-video/SKILL.md` and its `references/` before building shots.
- `tools/` — `setup.sh`, `align_to_pauses.py`, `make_short.py` (+ overlay.html/shot.cjs/fonts), `youtube_upload.py`.
- `channel/` — profile, banner, watermark, ep01 thumbnail, character design cards. `scripts/` — narration scripts.
- `episodes/epNN-slug/` — metadata.json (title/description/tags), description.txt, short.json, thumbnail notes.

## The cast (keep identical every episode)
MILO (YOU) violet hoodie #8a5ad6 + neck headphones = "you" · VEX inner critic (trench, fedora, sunglasses, coral pocket square)
· SAGE calm guide (teal scarf, bun, glasses, tea) · DR. ADA channel researcher (lab coat, curly hair, glasses, yellow lanyard)
· JUNO anxious friend (mustard beanie, blue tee, backpack) · RAY burnout (grey suit, loose red tie, briefcase) · PIP inner child
· THE SHADOW = fear (tall shape, glowing eyes; grows when Milo overthinks, shrinks when fear is named).
Real researchers named in a script are drawn as GENERIC figures (no likeness) with a name callout.

## Trigger: "make / upload the next video" (the owner attaches the voiceover MP3 file(s))
Do ALL of it, in order, without stopping unless blocked:
1. **Setup**: `bash tools/setup.sh` (from repo root). Chromium: the pre-installed one at /opt/pw-browsers is used by Playwright 1.63.
2. **Script**: the narration text must be in `scripts/epNN-*.txt` exactly as spoken. If the owner only sent audio and no
   script exists, ask for the script (or transcribe if huggingface.co is reachable: `studio/tools/transcribe.py`).
3. **Project**: copy `studio/projects/overthinking-full` → `studio/projects/epNN-slug`; delete its `scenes/shots/*`,
   `story/shots.json`, `timeline/*`, `input/*`; keep cast/sets/accessories/kit2/motifs. Join voiceover parts with
   ffmpeg (≈0.85 s gap) into `input/voiceover.wav`; update `config.json` (title, duration, voiceover).
4. **Timeline**: `python3 -I tools/align_to_pauses.py <voiceover> <script.txt> <project>/timeline/words.json`
   (matches pauses to sentence/comma breaks; check every printed chunk reads naturally).
5. **Story**: write `story/bible.md` and `story/shots.json` (15–25 shots/min, cut 0.15 s before phrases, median 2–3.5 s,
   music sections, sfx/amb cues, captions:false on title/end/number cards). Invent NEW visuals for the new script with
   the same cast/style. Every number/name spoken appears on screen via wordTime(). Never invent facts.
6. **Build + QC**: write `scenes/shots/*.js`; `node studio/render.mjs --project studio/projects/<slug> --sheet --scale 0.4`;
   open every sheet PNG, fix framing (camOn), clipping, missing shots. Notes: front-view bigFace brows look inverted →
   pass `face: { brows: 'angry' }` for a worried look; keep subjects above the caption band (bottom ~15%).
7. **Render**: `node studio/render.mjs --project studio/projects/<slug> --workers 3` (background; ~2.7 fps → ~9 min per
   minute of video), then `python3 studio/audio/mix.py --project studio/projects/<slug>` → `out/<Title>.mp4`.
   QC: duration, audio stream, 1 frame / 10 s contact sheet.
8. **Packaging**: thumbnail (add a `thumb_epNN` shot in `studio/projects/branding/scenes/shots/brand.js`, render at
   1440p, scale to 1280×720, keep bottom-right clear); Short with `tools/make_short.py` (≤ 60 s, hook → 2–3 key beats →
   payoff → "Subscribe…"); title (≤ 60 chars, don't repeat thumbnail text), description with chapters (first 0:00, each
   ≥ 10 s), real sources (verify), disclaimer, 3 hashtags; tags. Save in `episodes/epNN-slug/`.
9. **Upload** (YouTube Data API v3): needs a fresh OAuth access token saved as a network secret for host
   `www.googleapis.com` (Authorization: Bearer). Ask for it with the credential form (never in chat). First time:
   `python3 tools/youtube_upload.py --test`. Then upload the episode (+ thumbnail) and the Short, **always PRIVATE**;
   give the owner the Studio links to review and publish. Never publish publicly yourself.
10. **Deliver + save**: send the MP4s/thumbnail to the owner; commit the new episode (no build/out/wav) and push.

## Getting the YouTube access token (owner, ~1 minute, valid 1 hour)
1. Open https://developers.google.com/oauthplayground
2. Step 1: find "YouTube Data API v3" → tick `https://www.googleapis.com/auth/youtube.upload` → Authorize APIs → sign in
   with the channel's Google account → Allow.
3. Step 2: "Exchange authorization code for tokens" → copy the **Access token**.
4. Paste it into the secure credential card Claude shows (host www.googleapis.com). Never into the chat.
If uploads stay locked as private ("unverified API project"), the owner publishes manually or uploads via YouTube Studio.

## Known environment limits (cloud sessions)
- huggingface.co blocked → no Whisper; use align_to_pauses.py with the exact script.
- Remotion/Chrome downloads blocked → use /opt/pw-browsers Chromium.
- Memory: never ffmpeg-trim many ranges from a long video in one filter graph (OOM) — cut pieces separately.
