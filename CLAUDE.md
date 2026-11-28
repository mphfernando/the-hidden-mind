# The Hidden Mind — production playbook

YouTube channel **The Hidden Mind**: animated psychology for overthinkers. Cinematic stick-figure videos made with the
GrowKaz Stickman studio (code-rendered 2D + Three.js, headless Chromium → ffmpeg). Style **arctic**, 16:9 1080p 24 fps,
word captions ON, generated music + SFX. Narrator: ElevenLabs "Roger – Laid-Back Casual Resonant" (owner sends the MP3).

## Repository map
- `studio/` — the studio (engine, renderer, audio, tools). `studio/projects/overthinking-full/` = episode 1, the reference
  for every later episode: `scenes/cast.js` (the cast), `scenes/accessories.js` (headphones, scarf, tie, …),
  `scenes/sets/` (bedroom [night/dawn via `{mood}`], study, street, motifs.js [thought clouds, the Shadow, wheel, head],
  kit2.js [wt/camOn/toScr/voidStage/icons/stamp/flipCard/field/titleBackdrop]), `scenes/shots/*.js` (69 shots).
- `studio3d/` — 3D pipeline: Three.js scenes (react-three-fiber + @remotion/three) with Remotion for captions, audio and
  rendering. `src/kit/` (Milo3D, Captions, Label3D, theme), `src/demo/Ep01Demo3D.tsx` (test: ep01's first 11 s in 3D).
  See `studio3d/README.md`. Renders ~3 fps here (no GPU) with the /opt/pw-browsers headless shell.
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

## Episode workflow (owner's standing instructions)
1. Claude writes the next episode: topic chosen for search demand + curiosity, a scene plan and the exact voiceover text
   (ScriptForge style: hook <15 s, 3–5 escalating beats, twist, payoff, CTA "subscribe for more on the hidden side of your
   mind"; 450–600 words; real, cautiously phrased science; sources listed). Save to `scripts/` and `episodes/epNN-*/plan.md`.
2. The owner records it in ElevenLabs and sends the MP3 with "make episode N".
3. Claude does everything else (steps below): build, render, thumbnail, 5–8 full-screen 9:16 Shorts, metadata, private
   upload, push to this repo. Growth notes: searchable titles, thumbnail ≤ 4 words, Shorts full-screen 9:16 (not letterboxed).

## Publishing schedule (owner's standing instruction — Sri Lanka time, UTC+5:30)
Target audience: USA. US Eastern is UTC−5 until 8 Mar 2027 (then UTC−4: make every Sri Lanka time 1 hour earlier).
- **(Owner decision 22 Nov 2026, starts with ep04) Episodes: TWICE a week, Tuesday 12:30 AM and Friday 12:30 AM Sri Lanka**
  (= US Monday / Thursday 2 PM ET; 19:00 UTC the day before).
- **Shorts: THREE a day, 8 h apart: 6:30 AM, 2:30 PM, 10:30 PM Sri Lanka** (= 01:00, 09:00, 17:00 UTC = US 8 PM, 4 AM,
  12 PM ET; 2:30 PM SL also hits evening Philippines/Indonesia/Malaysia, morning UK). Never two Shorts closer than 8 h.
- Weekly supply = 21 Shorts: 7 cut from each of the 2 episodes (full-screen 9:16, `tools/make_vertical_short.py`) + 7
  standalone Shorts written as Shorts (hook-first "ok."-model, ~60 words, share line, loop ending). The owner records the
  2 episode scripts + one batch of 7 Short scripts per week. Each episode's first Short goes out at the next 6:30 AM slot.
- Uploads: ~23/week; the Playground project allows ~5 uploads/day, so upload daily with a fresh token (credential card)
  or the owner schedules the week in YouTube Studio.
- The owner asks Claude to create each batch when needed ("make the shorts"); Claude also proposes Short ideas from
  existing episodes so the daily queue never runs dry.
- Scheduling: set `status.publishAt` (with privacy private) on upload when the API allows; otherwise give the owner the
  exact Sri Lanka date/time for each video to set in YouTube Studio (Visibility → Schedule).
- API note: the OAuth Playground's shared quota often runs out (403 quotaExceeded) — stop after one failed retry and hand
  the remaining steps to the owner. Long-term fix: owner's own Google Cloud project + YouTube API audit (Option A).

- **Cross-post** every Short to TikTok + Facebook/Instagram Reels (owner posts manually, same 6:30 AM slot) and the full
  episode to the Facebook Page; write platform captions in `episodes/epNN-*/social_captions.txt` (no #shorts, no links on TikTok).

### Upload log
| Video | ID | Planned (Sri Lanka) |
|---|---|---|
| ep01 The Truth About Overthinking (retitled "Why You Can't Stop Overthinking (Psychology Explained)") | ez-lXPY79pU | published 12 Nov 2026 |
| ep01 Short "Why you can't stop overthinking" | CmJgWzDrGxo | published 12 Nov 2026 |
| ep02 Why Your Brain Replays Embarrassing Memories at Night | fN20EY-EMLk | Fri 13 Nov 2026, 12:30 AM |
| ep02 Short 1 Why your brain replays cringe moments | unze8yiX1uU | Fri 13 Nov 2026, 6:30 AM |
| ep02 Short 2 Nobody noticed | WtietaE1DD4 | Sat 14 Nov 2026, 6:30 AM |
| ep02 Short 3 Try this at 2 AM | wwhTZaRkRz8 | Sun 15 Nov 2026, 6:30 AM |
| ep01 Short 2 retitled "Your worries are lying to you" | ZiM_ea1T5xg | went public 13 Nov 2026, 3:16 AM |
| ep02 Short 4 "Why one awkward moment beats 10 compliments" | mXcAfMOrTeQ | uploaded private Sat 14 Nov 2026 ~9:55 AM (missed the 6:30 AM slot; owner publishes) |
| ep02 Short 5 "Why cringe memories only hit at night" | c-Ae7PGNXmE | uploaded private; owner schedules Sun 15 Nov 2026, 6:30 AM |
| ep01 Short 3 "You replayed it 11 times" | IKzRkeshi0I | uploaded private; owner schedules Mon 16 Nov 2026, 6:30 AM |
| ep02 Short 6 "Your brain marked that cringe IMPORTANT" | _1hVJ1mmYlY | uploaded private; owner schedules Tue 17 Nov 2026, 6:30 AM |
| ep01 Short 4 "Why did I say that? There's a name for it" | vX0lh9xvc84 | uploaded private; owner schedules Wed 18 Nov 2026, 6:30 AM |
| ep02 Short 7 "Everyone forgot that moment. Except you." | — | built 19 Nov; API upload blocked (429 daily upload limit on the Playground project) → owner uploads via Studio, publish Thu 19 Nov ASAP (6:30 AM slot was missed) |
| ep03 Why You Always Think Someone Is Mad at You | 1nVuUlwU6Vk | uploaded private + scheduled (publishAt) Fri 20 Nov 2026, 12:30 AM; thumbnail set |
| ep03 Short 1 She replied "ok." with a period 😬 | 3RyCOFgfty8 | uploaded private + scheduled Fri 20 Nov 2026, 6:30 AM |
| ep03 Short 2 People like you more than you think 💛 | Cg_zgNi_Pmo | uploaded private + scheduled Sat 21 Nov 2026, 6:30 AM |
| ep03 Short 3 Why "ok." with a period feels rude 😶 | AYujhmEOqr4 | uploaded private + scheduled Sun 22 Nov 2026, 6:30 AM |
| ep03 Short 4 Your texts don't sound the way you think 🪙 | pQxAMbkN50E | uploaded private + scheduled Mon 23 Nov 2026, 6:30 AM |
| ep03 Short 5 A late reply. A "seen". Your brain panics. | gQZVBF9chMQ | uploaded private + scheduled Tue 24 Nov 2026, 6:30 AM |
| ep03 Short 6 Think someone is mad at you? Try this 🧠 | 2e4f_dUdxVc | uploaded private + scheduled Wed 25 Nov 2026, 6:30 AM |
| ep03 Short 7 Why a 2-letter text feels like a threat ⚠️ | sRzFe3NITfI | uploaded private + scheduled Thu 26 Nov 2026, 6:30 AM |
| ep03 Short 8 She said "ok." Your brain heard "I hate you" 😬 | Y4HZn3IHPLs | uploaded private + scheduled Mon 23 Nov 2026, 2:30 PM |
| ep02 Short 8 Said "you too" to the waiter? Try this tonight 🌙 | 5W7lxaOiDaw | uploaded private + scheduled Mon 23 Nov 2026, 10:30 PM |
| ep03 extra Short Plot twist: she thinks YOU'RE mad 😅 | Se5fvuRhOHg | uploaded private + scheduled Sat 28 Nov 2026, 6:30 AM |
| ep03 extra Short Short reply? 3 reasons it's NOT about you 💬 | vd7o1LdiCq0 | uploaded private + scheduled Sat 28 Nov 2026, 2:30 PM |
| ep02 extra Short Said "you too" to the waiter? Nobody noticed 🔦 | LTFN1TVZfyU | uploaded private + scheduled Sat 28 Nov 2026, 10:30 PM |
| ep01 extra Short Can't stop overthinking? Try "worry time" 🕰️ | 0jmwjAwbiKU | uploaded private + scheduled Sun 29 Nov 2026, 6:30 AM |
| ep01 extra Short Overthinking isn't you caring too much 🛡️ | MbzqJTDHlgk | uploaded private + scheduled Sun 29 Nov 2026, 2:30 PM |
| ep01 extra Short Your mind wanders almost half the time 🧠 | qHFYnpohAfs | uploaded private + scheduled Sun 29 Nov 2026, 10:30 PM |
| (gap) | — | Fri 27 Nov 2026: no Shorts went out (planned Tue–Thu extras missed their slots; rescheduled to Sat/Sun) |
| next Shorts needed from | — | Mon 30 Nov 2026, 6:30 AM; 3 Shorts/day (6:30 AM, 2:30 PM, 10:30 PM) + ep04 still to be written/recorded |

### Performance lessons (update as data comes in)
- 13 Nov 2026 (day 1–2): ep02 Short 1 "you too to a waiter" = 1,417 views / 32 likes in 18 h (best). ep01 Short = 585.
  ep02 Shorts 2 & 3 posted 1–2 min after Short 1 → 5 and 2 views: NEVER post two Shorts close together (1 per day).
  "9 in 10 worries" (opened on "Here's the trap", went live 3:16 AM SL) = 0 views in 10 h → retitled "Your worries are lying to you".
- What works: a relatable, specific mini-story in the first 2 seconds (an awkward moment everyone has had). Open Shorts on
  the most surprising/relatable line, not a scene's first line; aim 20–35 s; end on a line that loops.
- Vertical Shorts: captions are 2-word groups at 80px (3 words wrapped to 2 lines and collided with on-screen labels).
  When a shot draws its own label low in frame, pass `--capy 410` so captions sit below it. Tokens expire in 1 h, so
  BUILD the Short first, then ask for the token right before uploading.
- Token troubleshooting: a 401 authError means the token is expired/wrong; a 403 quotaExceeded means the token IS valid
  and only the shared Playground quota is spent. Uploads often still succeed while reads return 403, so after a 403 try
  the upload once anyway. Several saved secrets for the same host can also make an old one win.
- 17 Nov 2026 view rates (views/hour since publish): "why cringe hits at night" (6:00 AM SL = Sat 19:30 ET) 28.4 — best;
  "awkward beats 10 compliments" (09:57 SL) 19.9; "you too to a waiter" (20:03 SL) 14.4; "you replayed it 11 times"
  (10:23 SL) only 3.6. Publish time matters less than the hook: ep02 (cringe/embarrassment) material far outperforms
  ep01 (general overthinking). Keep the 6:30 AM SL slot and keep hooks on a specific, visual, embarrassing moment.
- 19 Nov 2026: tokens edited in the environment settings do NOT reach a running session: use the credential card.
  `youtube_upload.py` now sends `publishAt` from the metadata JSON (UTC) so uploads are scheduled automatically.
- 19 Nov 2026: the Playground project also has a DAILY UPLOAD limit (429 rateLimitExceeded, "Video Uploads per day"),
  separate from the read quota; it is not a fixed reset time: 429 at 18:55 UTC 22 Nov, uploads worked again by 19:20 UTC (hit again 19 Nov after 5 uploads in a row: episode + 4 Shorts). When it hits, upload the rest the next
  day after 08:00 UTC with a fresh token, or the owner uploads in YouTube Studio with the metadata JSON text.
- 22 Nov 2026 ANALYTICS (12–19 Nov, `tools/youtube_stats.py`, saved in channel/analytics/): ~9,000 views, 13 subs.
  96% of views come from the Shorts feed; 99.6% of viewers are not subscribed. Every Short plateaus at ~1,000–1,450 views
  (YouTube's first test pool) and none broke out. Best retention: ep03 Short 1 "ok." with a period = 87.6% avg viewed,
  25 s, 3 subs. Weakest: "awkward beats 10 compliments" 41% (9 s avg) despite 1,246 views. SHARES = 4 in 9,000 views and
  comments = 2: the missing signal. 18 Nov (no fresh Short live) = 9 views: never leave a day without a new Short.
  Episodes: 3–14 views each. Countries: US 13%, then PH, IN, CA, GB, AU, ID, MY. Subs per 1,000 views ≈ 1.4.
  Rules from this: model every Short on the "ok." Short (specific moment in second 1, ≤25 s, loop); add a share line
  ("send this to the friend who…"); post 2 Shorts/day ~12 h apart; Shorts first, episodes second.
- 28 Nov 2026 ANALYTICS (12–25 Nov, channel/analytics/2026-11-28.json): 15 subs, ~15,000 views. Views FELL after 23 Nov:
  the 4th–7th Shorts cut from ep03 got 707, 203, 198, 117, 320 views (vs 1,100–1,755 for the first three). Same story and
  same footage again ("ok." text, Juno, phone) = viewer fatigue: "Your brain heard 'I hate you'" had 87% retention but only
  203 views. Advice/abstract openers ("Try this…", "A text has no face", a card) retain 55–68%. A DIFFERENT episode's cut
  the same day ("you too" waiter, 10:30 PM) got 1,354, so the slot time and 3/day are not the problem; repetition is.
  Best ever: "Why 'ok.' with a period feels rude" 1,755 views, 94.9% avg viewed. RULES: max ~3 Shorts per episode story;
  every Short needs a NEW specific moment in second 1; no advice-first openers; fresh standalone Short scripts beat re-cuts;
  fewer fresh Shorts > more recycled ones.
- The Analytics API (host youtubeanalytics.googleapis.com, scope yt-analytics.readonly) has its own quota: it worked on
  22 Nov while the Data API (www.googleapis.com) was 403 quotaExceeded. Save the same token for both hosts.
- Long episodes get few views on a new channel; Shorts drive discovery. Check numbers with the Data API after 08:00 UTC
  (quota reset = midnight Pacific = 1:30 PM Sri Lanka).

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
- Remotion's Chrome download is blocked → `studio3d/remotion.config.ts` points Remotion at the /opt/pw-browsers headless shell
  (SwiftShader WebGL). Remotion itself installs fine from npm.
- Memory: never ffmpeg-trim many ranges from a long video in one filter graph (OOM) — cut pieces separately.
