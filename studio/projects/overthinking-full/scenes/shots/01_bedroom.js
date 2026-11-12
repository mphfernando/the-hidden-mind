// shots/01_bedroom.js — the night loop in YOU's bedroom (s01-s07) and the return (s19-s22).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround, BED, DESK, LAMP, blanket } from '../sets/bedroom.js';
import { thoughtCloud, speechBubble, fearShadow, popIn } from '../sets/motifs.js';
import { YOU, MACC, MCOL } from '../cast.js';
import { drawChar, faceAcc } from '../accessories.js';

const NIGHT = () => mood('night');
const camOn = (px, py, z, o = {}) => ({ z, x: px - E.W / 2, y: py - E.H / 2, ...o });
const WORRY = { brows: 'angry' };   // front-view brows read inverted on bigFace; this gives the worried look
const rimMoon = () => ({ color: NIGHT().rim, dir: [-0.6, -0.8], w: 4 });
const rimLamp = () => ({ color: NIGHT().practical, dir: [1, -0.4], w: 4 });
const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.3) ?? info.shot.start + fb) - info.shot.start;

// YOU lying on the bed on their back (head on the pillow)
function lying(g, t, s = 1, o = {}) {
  const GY = bedGround(), b = BED(), hipX = b.x + 66 + 108 * s, oy = GY - 112 + 100 * s;
  drawChar(g, { x: hipX, y: oy, s, facing: 1, rot: -Math.PI / 2, outfit: YOU, pose: breathe(POSES.lie, t, 0.6, 4), expr: o.expr || 'worried', blink: o.blink ?? ((t % 3.4) > 3.3), rim: rimMoon(), shadow: false, look: o.look }, MACC, MCOL);
  const hipY = oy - 100 * s; const head = [hipX - 108 * s, hipY - 3 * s];
  blanket(g, GY, s);
  return { head, sh: [hipX - 74 * s, hipY] };
}
function phoneHeld(g, t, sh, head, M) {
  const px = head[0] + 18, py = head[1] - 74;
  seg(g, [sh, [sh[0] + 6, sh[1] - 40], [px, py + 14]], 11, S().ink);
  rr(g, px - 16, py - 26, 32, 52, 6); g.fillStyle = '#0a0a12'; g.fill(); rr(g, px - 12, py - 22, 24, 44, 4); g.fillStyle = '#cfe6ff'; g.fill();
  glow(g, px, py, 160, '#9fd0ff', 0.35); FX.lightCone(g, px, py + 10, { angle: Math.PI / 2, spread: 1.0, len: 140, color: '#bfe0ff', a: 0.3 });
  return [px, py];
}

// s01 — "You've replayed that conversation eleven times."
registerShot('s01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(430 - 30 * k, 600, 1.38 + 0.08 * k);
  const { M, GY } = bedroom(g, t, cam, { lamp: 0.35 });
  let head;
  layer(g, cam, 1, (g) => {
    const L = lying(g, t, 1.15, { expr: 'worried', look: [0, -1] }); head = L.head;
    phoneHeld(g, t, L.sh, L.head, M);
    // stacked conversation bubbles rising above the bed, replaying
    for (let i = 0; i < 6; i++) { const at = 0.15 + i * 0.42, p = popIn(t, at, 0.3), side = i % 2 ? -1 : 1;
      const y = head[1] - 160 - i * 62 + (t - at) * -8, x = head[0] + 120 + side * 70;
      speechBubble(g, x, y, 170, 52, { scale: p, a: clamp(1 - (i * 0.1)) * p, side, fill: side > 0 ? S().ui.cream : mix(YOU.color, '#ffffff', 0.55), lines: 2 }); }
  });
  FX.dust(g, t, { count: 30, color: '#cfd8ff', a: 0.25 });
  const te = wt('eleven', info, 2.1); const n = Math.round(lerp(1, 11, ease.out(prog(t, te - 0.9, te + 0.15))));
  UI.badge(g, { str: '×' + n, a: ease.out(prog(t, 0.6, 1.0)), size: V(64, 70), x: E.W - V(150, 90), y: V(220, 260) });
} });

// s02 — "You've rehearsed the email."  phone insert, draft typing / deleting
registerShot('s02', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.9, x: -560, y: -260 }, { lamp: 0.3 })); veil(g, '#05060f', 0.45);
  const z = 1 + 0.05 * t, cx = E.W / 2 + 40, cy = E.H * 0.52, w = V(560, 600) * z, h = V(860, 1000) * z;
  g.save(); g.translate(cx, cy); g.rotate(-0.06);
  glow(g, 0, 0, w * 1.1, '#9fd0ff', 0.25);
  rr(g, -w / 2, -h / 2, w, h, 50); g.fillStyle = '#07070d'; g.fill();
  rr(g, -w / 2 + 22, -h / 2 + 22, w - 44, h - 44, 34); g.fillStyle = '#e9f0fb'; g.fill();
  // header bars (To / Subject)
  const ix = -w / 2 + 60, iw = w - 120; g.fillStyle = '#c3cfe2';
  rr(g, ix, -h / 2 + 90, iw * 0.35, 22, 11); g.fill(); rr(g, ix, -h / 2 + 140, iw * 0.6, 22, 11); g.fill();
  g.fillStyle = '#d6deeb'; g.fillRect(ix, -h / 2 + 185, iw, 3);
  // body lines: type, delete, retype
  const L = [0.92, 0.8, 0.88, 0.55], typed = key(t, [[0, 0.3], [0.55, 2.6], [0.9, 1.2], [1.4, 3.4]], ease.linear);
  let cxr = ix, cyr = -h / 2 + 240;
  for (let i = 0; i < L.length; i++) { const f = clamp(typed - i); if (f <= 0) break; const lw = iw * L[i] * f; rr(g, ix, -h / 2 + 230 + i * 56, lw, 22, 11); g.fillStyle = '#5a6a86'; g.fill(); cxr = ix + lw + 10; cyr = -h / 2 + 230 + i * 56; }
  if ((t * 2.5) % 1 < 0.6) { g.fillStyle = '#3a7bff'; g.fillRect(cxr, cyr - 6, 5, 34); }
  // send button greyed
  rr(g, w / 2 - 60 - 150, h / 2 - 140, 150, 64, 32); g.fillStyle = '#c3cfe2'; g.fill();
  g.restore();
  // thumb
  const th = key(t, [[0, 0], [0.5, 1], [0.9, 0.4], [1.3, 1]]);
  seg(g, [[E.W / 2 + 420, E.H + 80], [E.W / 2 + 180 - th * 20, E.H * 0.78 + th * 10]], 80, S().ink);
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });

// s03 — "Planned for the worst."  giant worried face, storm thought
registerShot('s03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.7, x: -120, y: -200 }, { lamp: 0.3 })); veil(g, '#05060f', 0.4);
  const M = NIGHT(), r = V(300, 330) * (1 + 0.04 * t), fx = E.W * 0.42, fy = E.H * V(0.62, 0.56);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: t < 0.4 ? 'nervous' : 'worried', face: WORRY, look: [0.6, -0.5], rimColor: M.rim, rimSide: 1, blink: (t % 2.7) > 2.6 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const p = ease.out(prog(t, 0.15, 0.7)), sx = E.W * 0.78, sy = E.H * 0.26 + (1 - p) * 40;
  thoughtCloud(g, sx, sy, 420, 220, { fill: '#3a3f5a', a: p, tail: [fx + r * 0.6, fy - r * 0.7], edge: alpha('#8a96c8', 0.4) });
  if (p > 0.5) { g.save(); g.beginPath(); g.rect(sx - 200, sy + 60, 400, 220); g.clip(); FX.rain(g, t, { count: 40, area: [sx - 170, sy + 60, 340, 200], color: '#9fb0e0', a: 0.5 }); g.restore(); }
  const fl = t > 0.45 && t < 0.6 ? 1 : 0; if (fl) { FX.lightning(g, { x: sx + 30, y: sy + 70, len: 160, seed: 3 }); glow(g, sx, sy, 300, '#dfe6ff', 0.4); }
} });

// s04 — "Run every 'what if.'"  sitting on the bed edge, WHAT IF? clouds pop around the head
registerShot('s04', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), cam = camOn(b.x + b.w - 20, GY - 360, 1.32 + 0.05 * t);
  const { M } = bedroom(g, t, cam, { lamp: 0.35 });
  const s = 1.3, x = b.x + b.w - 40;
  const handsHead = { ...POSES.sit, eF: [34, -168], hF: [16, -206], eB: [-26, -168], hB: [-6, -208] };
  layer(g, cam, 1, (g) => {
    drawChar(g, { x, y: GY, s, facing: 1, outfit: YOU, pose: breathe(posesAt(t, [[0, POSES.sit], [1.2, handsHead]]), t, 1, 2), expr: t < 1.2 ? 'nervous' : 'scared', look: [Math.sin(t * 3) * 0.8, -0.5], rim: rimMoon(), shadow: false }, MACC, MCOL);
    const hx = x + 4 * s, hy = GY - 180 * s;
    const spots = [[-230, -150], [210, -190], [-170, -330], [250, -40], [20, -360], [-290, 10]];
    spots.forEach(([dx, dy], i) => { const at = 0.2 + i * 0.27, p = popIn(t, at, 0.35);
      thoughtCloud(g, hx + dx, hy + dy, 210, 100, { scale: p * (1 + 0.03 * Math.sin(t * 4 + i)), tail: [hx, hy - 20], label: 'WHAT IF?', labelColor: '#2a1830' }); });
  });
  FX.dust(g, t, { count: 24, color: '#cfd8ff', a: 0.25 });
} });

// desk scene shared by s05 / s06 / s07: YOU sits at the desk facing right, writing
function deskScene(g, t, o) {
  const GY = bedGround(), d = DESK(), cam = o.cam;
  const { M } = bedroom(g, o.bgT ?? t, cam, { lamp: 1, papers: false });
  const s = 1.25, x = d.x - 70;
  layer(g, cam, 1, (g) => {
    g.save(); g.translate(x - 12, 0); FX.chair(g, 0, GY, s, shade(M.wall, -0.7)); g.restore();
    o.under?.(g, GY, x, s, M);
    drawChar(g, { x, y: GY, s, facing: o.facing ?? 1, outfit: YOU, pose: o.pose, expr: o.expr, look: o.look, rim: rimLamp(), shadow: false, blink: (t % 3.1) > 3.0 }, MACC, MCOL);
    o.over?.(g, GY, x, s, M);
  });
  return { GY, M, d, x, s };
}
const writePose = (t, k = 1) => ({ ...POSES.sit, head: [10, -178], eF: [40, -126], hF: [74 + Math.sin(t * 18) * 6 * k, -116 + Math.abs(Math.sin(t * 9)) * 3 * k], eB: [30, -124], hB: [60, -114] });
function paperStack(g, d, GY, n, M) { for (let i = 0; i < n; i++) { g.save(); g.translate(d.x + 120 + (i % 3) * 6, GY - d.h - 3 - i * 4); g.rotate(((i * 37) % 10 - 5) * 0.02); g.fillStyle = mix('#ece8f6', M.wall, 0.15 + (i % 2) * 0.1); g.fillRect(-60, -4, 120, 5); g.restore(); } }

// s05 — "And it feels like you're working on the problem."
registerShot('s05', { draw(g, t, info) {
  const d = DESK(), k = ease.inOut(t / info.dur);
  const cam = camOn(d.x + 120 + 30 * k, bedGround() - 230, 1.55 + 0.1 * k);
  deskScene(g, t, { cam, pose: writePose(t), expr: 'determined', look: [0.6, 0.6],
    under: (g, GY, x, s, M) => paperStack(g, d, GY, Math.floor(3 + t * 6), M),
    over: (g, GY, x, s, M) => { for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; const px = d.x + 140 + ph * 160, py = GY - d.h - 40 - Math.sin(ph * Math.PI) * 140; g.save(); g.translate(px, py); g.rotate(ph * 4 + i); g.fillStyle = alpha('#ece8f6', 1 - ph); g.fillRect(-26, -34, 52, 68); g.restore(); } } });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });

// s06 — "But what if overthinking isn't solving anything..."  FREEZE
registerShot('s06', { draw(g, t, info) {
  const d = DESK(), frozen = 0.4;
  const cam = camOn(d.x + 130, bedGround() - 260, 1.6 + 0.04 * t, { r: -0.02 + 0.01 * t });
  deskScene(g, frozen, { cam, bgT: frozen, pose: writePose(frozen, 0), expr: 'determined', look: [0.6, 0.6],
    under: (g, GY, x, s, M) => paperStack(g, d, GY, 9, M),
    over: (g, GY, x, s, M) => { for (let i = 0; i < 9; i++) { const px = d.x + 40 + ((i * 97) % 380), py = GY - d.h - 120 - ((i * 53) % 260) + Math.sin(t * 0.6 + i) * 4; g.save(); g.translate(px, py); g.rotate(i * 0.7 + t * 0.05); g.fillStyle = '#ece8f6'; g.fillRect(-26, -34, 52, 68); g.fillStyle = alpha('#5a6a86', 0.6); for (let l = 0; l < 4; l++) g.fillRect(-18, -24 + l * 14, 36 - (l % 2) * 10, 4); g.restore(); } } });
  FX.drops(g, t, { count: 40, color: '#d8e4ff', rMax: 9, drift: 3 });
  FX.rings(g, E.W / 2, E.H * 0.45, t, { count: 3, r0: 120, r1: 560, speed: 0.35, color: '#e8f0ff', a: 0.3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  const tz = wt('anything', info, 2.4);
  UI.readout(g, { label: 'PROBLEMS SOLVED', value: '0', x: V(140, 90), y: E.H - V(190, 620), a: ease.out(prog(t, tz - 0.2, tz + 0.2)), color: S().ui.accent });
} });

// s07 — "What if it's hiding something?"  the shadow on the wall grows and opens its eyes
registerShot('s07', { draw(g, t, info) {
  const d = DESK(), k = ease.inOut(t / info.dur);
  const cam = camOn(d.x - 170, bedGround() - 300, 1.2 + 0.08 * k);
  const te = wt('hiding', info, 0.8);
  const look = { ...POSES.sitBack, head: [-14, -178] };
  deskScene(g, t, { cam, pose: breathe(posesAt(t, [[0, writePose(t, 0)], [te - 0.2, look]]), t), facing: 1, expr: t < te ? 'neutral' : 'scared', look: t < te ? [0.6, 0.6] : [-1, -0.3],
    under: (g, GY, x, s, M) => { paperStack(g, d, GY, 9, M);
      // shadow cast leftward from the lamp onto the wall behind
      fearShadow(g, x - 260, GY - 6, 560, t, { grow: lerp(0.45, 1, ease.inOut(prog(t, 0.2, te + 0.6))), eyes: ease.out(prog(t, te + 0.3, te + 0.8)) }); } });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// s19 — "Give it a quiet moment, and it fills the gap."
registerShot('s19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(500, bedGround() - 330, 1.25 + 0.06 * k);
  const lampOff = ease.out(prog(t, 0.25, 0.35));
  const { M } = bedroom(g, t, cam, { lamp: 1 - lampOff });
  const tf = wt('fills', info, 1.8);
  layer(g, cam, 1, (g) => {
    const L = lying(g, t, 1.15, { expr: t < tf ? 'sleepy' : 'worried', look: [0, -1], blink: t < tf ? true : (t % 3) > 2.9 });
    const spots = [[60, -230], [-110, -330], [200, -360], [40, -470], [-220, -470], [300, -500], [150, -600], [-60, -620]];
    spots.forEach(([dx, dy], i) => { const at = tf - 0.25 + i * 0.12, p = popIn(t, at, 0.35);
      thoughtCloud(g, L.head[0] + 120 + dx, L.head[1] + dy, 150 - (i % 3) * 20, 80 - (i % 3) * 8, { scale: p, a: 0.9, tail: i === 0 ? L.head : null }); });
  });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });

// s20 — "Often with problems."  giant face, bubbles turn into problems
registerShot('s20', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.7, x: -500, y: -220 }, { lamp: 0 })); veil(g, '#05060f', 0.45);
  const M = NIGHT(), r = V(270, 300) * (1 + 0.04 * t), fx = E.W / 2, fy = E.H * V(0.64, 0.58);
  const tp = wt('problems', info, 0.8);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: t < tp ? 'worried' : 'scared', face: WORRY, look: [Math.sin(t * 5) * 0.7, -0.4], rimColor: M.rim, rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const ring6 = [[-520, -260], [520, -230], [-640, 60], [640, 90], [-330, -430], [330, -430]];
  ring6.forEach(([dx, dy], i) => { const turn = ease.out(prog(t, tp + i * 0.06, tp + 0.25 + i * 0.06));
    const fill = mix(S().ui.cream, S().ui.accent, turn); const bob = Math.sin(t * 3 + i) * 8;
    thoughtCloud(g, fx + dx, fy + dy + bob, 230, 120, { fill, scale: 1 + 0.15 * turn, label: turn > 0.4 ? '!' : null, labelColor: '#ffffff', labelSize: 70, edge: turn > 0.2 ? alpha(S().ui.accent, 0.4 * turn) : null });
    if (turn > 0.2) glow(g, fx + dx, fy + dy, 160, S().ui.accent, 0.25 * turn); });
} });

// s21 — "But why problems?"
registerShot('s21', { draw(g, t, info) {
  blurLayer(g, 16, (g) => bedroom(g, t, { z: 1.3 + 0.03 * t, x: -200, y: -100 }, { lamp: 0 })); veil(g, '#03040a', 0.55);
  FX.dust(g, t, { count: 40, color: '#cfd8ff', a: 0.3 });
  UI.bigLine(g, t, { str: 'WHY PROBLEMS?', dur: info.dur + 0.4, y: E.H * 0.45, size: V(110, 90) });
} });

// s22 — "That's where things get strange."  the shadow above the sleeping bed opens its eyes
registerShot('s22', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), b = BED();
  const cam = camOn(470 - 20 * k, bedGround() - 330 - 30 * k, 1.15 + 0.2 * k);
  const ts = wt('strange', info, 1.6);
  const { M, GY } = bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 0.55, (g) => fearShadow(g, b.x + 230, GY - 70, 600, t, { grow: lerp(0.7, 1, k), eyes: ease.out(prog(t, ts - 0.1, ts + 0.5)), color: 'rgba(2,2,8,.7)' }));
  layer(g, cam, 1, (g) => { lying(g, t, 1.15, { expr: 'sleepy', blink: true }); });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });
