// shots/brand.js — channel avatar (centre square) and banner (YouTube 2560x1440, safe area = centre 1546x423).
import { E, S, registerShot, mood, backdrop, ease, seg, circle, ring, rr, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawChar, faceAcc } from '../accessories.js';
import { thoughtCloud, fearShadow } from '../sets/motifs.js';
import { YOU, MACC, MCOL, SAGE, SACC, SCOL, ADA, AACC, ACOL, VEX, VACC, VCOL, JUNO, RAY, PIP } from '../cast.js';

const NAME = 'THE HIDDEN MIND';
const TAG = 'PSYCHOLOGY  ·  OVERTHINKING  ·  EMOTIONS';

// AVATAR — Milo close-up with a glowing thought, Shadow eyes behind. Built inside the centre 1080x1080 square.
registerShot('avatar', { draw(g, t) {
  const cx = E.W / 2, cy = E.H / 2;
  backdrop(g, ['#0a1226', '#14244a']);
  glow(g, cx, cy, 620, '#3fb0ff', 0.25);
  FX.stars(g, 0, { count: 70, area: [cx - 540, 0, 1080, 1080], color: '#bfe0ff' });
  // the Shadow peeking over Milo's shoulder, eyes glowing (kept inside the circular crop)
  fearShadow(g, cx + 230, cy + 820, 1060, 0, { w: 520, eyes: 1, eyeColor: S().ui.accent, color: 'rgba(3,6,16,.9)' });
  const r = 250, fx = cx - 70, fy = cy + 170;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'worried', face: { brows: 'angry' }, look: [0.8, -0.6], rimColor: '#7fe0ff', rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
} });

// BANNER — night skyline, the Shadow, the cast at the edges; name + tagline inside the safe area.
registerShot('banner', { draw(g, t) {
  const M = mood('night'), cx = E.W / 2, cy = E.H / 2, GY = cy + 290;
  backdrop(g, M.sky); FX.stars(g, 0, { count: 220, area: [0, 0, E.W, E.H * 0.75] }); FX.moon(g, cx + 720, cy - 330, 40);
  FX.skyline(g, { x: -100, y: GY, w: E.W + 200, minH: 70, maxH: 300, color: '#121733', windowColor: alpha(M.practical, 0.7), lit: 0.16, seed: 17 });
  g.fillStyle = '#0a0d1e'; g.fillRect(0, GY, E.W, E.H - GY);
  fearShadow(g, cx, GY + 10, 640, 0, { w: 560, eyes: 1, eyeColor: S().ui.accent, color: 'rgba(3,5,14,.7)' });
  glow(g, cx, cy, 700, '#3fb0ff', 0.12);
  // thought bubbles drifting up
  [[cx - 780, cy - 180, 140], [cx + 820, cy - 150, 120], [cx - 600, cy - 330, 90], [cx + 500, cy - 250, 80]].forEach(([x, y, w], i) => thoughtCloud(g, x, y, w, w * 0.52, { a: 0.75, label: i % 2 ? '?' : 'WHAT IF', labelColor: '#1a2440', labelSize: w * 0.2 }));
  // cast on the left and right (outside the safe area on phones, visible on desktop/TV)
  const rim = { color: '#9fe0ff', dir: [0, -1], w: 5 };
  drawChar(g, { x: cx - 760, y: GY, s: 1.45, facing: 1, outfit: YOU, pose: POSES.think, expr: 'thinking', rim }, MACC, MCOL);
  drawChar(g, { x: cx - 620, y: GY, s: 1.3, facing: 1, outfit: SAGE, pose: POSES.holdFront, prop: 'cup', expr: 'smile', rim }, SACC, SCOL);
  drawChar(g, { x: cx - 880, y: GY, s: 1.0, facing: 1, outfit: PIP, pose: POSES.wave, expr: 'happy', rim }, [], {});
  drawChar(g, { x: cx + 620, y: GY, s: 1.3, facing: -1, outfit: ADA, pose: POSES.pointUp, expr: 'smile', rim }, AACC, ACOL);
  drawChar(g, { x: cx + 760, y: GY, s: 1.35, facing: -1, outfit: JUNO, pose: POSES.phone, prop: 'phone', expr: 'nervous', rim }, [], {});
  drawChar(g, { x: cx + 890, y: GY, s: 1.4, facing: -1, outfit: VEX, pose: POSES.crossArms, expr: 'smirk', rim, dim: true }, VACC, VCOL);
  // name + tagline (safe area: centre 1160 x 317 logical)
  text(g, NAME, cx, cy - 40, { size: 120, color: S().ui.cream, spacing: 10, glow: 34, glowColor: 'rgba(90,190,255,.75)' });
  seg(g, [[cx - 380, cy + 40], [cx + 380, cy + 40]], 3, alpha('#9fe0ff', 0.6));
  text(g, TAG, cx, cy + 90, { size: 36, color: '#9fe0ff', font: FONTS.ui, weight: 900, spacing: 6 });
} });

// WATERMARK — round badge (cut out with a circular alpha mask afterwards): Milo + Shadow eyes on navy.
registerShot('wm', { draw(g, t) {
  const cx = E.W / 2, cy = E.H / 2, R = 420;
  g.fillStyle = '#000'; g.fillRect(0, 0, E.W, E.H);
  g.save(); g.beginPath(); g.arc(cx, cy, R, 0, Math.PI * 2); g.clip();
  g.fillStyle = '#0e1a33'; g.fillRect(cx - R, cy - R, 2 * R, 2 * R); glow(g, cx, cy - 60, R * 1.1, '#3fb0ff', 0.28);
  fearShadow(g, cx + 170, cy + 700, 900, 0, { w: 420, eyes: 1, eyeColor: S().ui.accent, color: 'rgba(3,6,16,.95)' });
  const r = 210, fx = cx - 40, fy = cy + 110;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'worried', face: { brows: 'angry' }, look: [0.8, -0.6], rimColor: '#7fe0ff', rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  g.restore();
  ring(g, cx, cy, R - 14, 28, '#7fe0ff');
} });

// THUMBNAIL — worried Milo, the giant Shadow with glowing eyes, big hook text (keep bottom-right clear for the timestamp).
registerShot('thumb', { draw(g, t) {
  const M = mood('night');
  backdrop(g, ['#050914', '#0c1630', '#132449']); FX.stars(g, 0, { count: 90, area: [0, 0, E.W, E.H * 0.7] });
  glow(g, E.W * 0.33, E.H * 0.42, 700, '#3fb0ff', 0.22);
  // the Shadow towering behind Milo
  fearShadow(g, E.W * 0.36, E.H + 380, 1350, 0, { w: 640, eyes: 1, eyeColor: '#6ff0ff', color: 'rgba(2,4,12,.96)' });
  glow(g, E.W * 0.36, E.H * 0.17, 330, '#6ff0ff', 0.25);
  const r = 250, fx = E.W * 0.2, fy = E.H * 0.74;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'scared', face: { brows: 'angry' }, look: [0.7, -0.9], rimColor: '#7fe0ff', rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  // sweat drop + shock lines
  g.fillStyle = '#9fe0ff'; g.beginPath(); g.moveTo(fx + r * 0.95, fy - r * 0.55); g.quadraticCurveTo(fx + r * 1.12, fy - r * 0.2, fx + r * 0.95, fy - r * 0.12); g.quadraticCurveTo(fx + r * 0.8, fy - r * 0.2, fx + r * 0.95, fy - r * 0.55); g.fill();
  for (let i = 0; i < 3; i++) { const a = -2.1 + i * 0.35; seg(g, [[fx + Math.cos(a) * r * 1.2, fy + Math.sin(a) * r * 1.2], [fx + Math.cos(a) * r * 1.45, fy + Math.sin(a) * r * 1.45]], 12, '#ffffff'); }
  // hook text
  const tx = E.W * 0.765;
  text(g, "IT'S", tx, E.H * 0.22, { size: 120, color: '#ffffff', stroke: 22, strokeColor: '#050914', spacing: 4 });
  text(g, 'HIDING', tx, E.H * 0.4, { size: 165, color: '#ffffff', stroke: 26, strokeColor: '#050914', spacing: 4 });
  text(g, 'SOMETHING', tx, E.H * 0.58, { size: 128, color: '#ffd84a', stroke: 24, strokeColor: '#050914', spacing: 3, glow: 40, glowColor: 'rgba(255,200,60,.6)' });
  // small thought bubble "what if" trail from Milo
  thoughtCloud(g, E.W * 0.52, E.H * 0.8, 240, 120, { label: 'WHAT IF?', labelColor: '#1a2440', tail: [fx + r * 0.7, fy - r * 0.3] });
} });
