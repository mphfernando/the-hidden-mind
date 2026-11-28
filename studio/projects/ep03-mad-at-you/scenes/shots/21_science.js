// shots/21_science.js — ep03 f18–f49: email study, coin flip, filling the blank, the period, rejection sensitivity, the liking gap.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround } from '../sets/bedroom.js';
import { street, streetGround } from '../sets/street.js';
import { study, studyGround } from '../sets/study.js';
import { thoughtCloud, speechBubble, fearShadow, headProfile, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, voidStage, stamp, titleBackdrop, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { phone, bubble, emoji, pop, ME, THEM } from '../sets/phone.js';
import { milo, juno, ada, rimOf, miloBed, researchers, card, zoomIn, WORRY, SIT_PHONE, SIT_SLUMP, R1, R2, R3, R4, R5 } from '../sets/ep03kit.js';
import { YOU, MACC, MCOL, EXTRA } from '../cast.js';

const okBubble = (g, x, y, s = 1, str = 'ok.', col = THEM) => { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -180, -70, 360, 140, 60); g.fillStyle = col; g.fill(); text(g, str, 0, 4, { size: 80, color: '#ffffff', font: FONTS.ui, weight: 900 }); g.restore(); };
function laptop(g, x, y, s, c = '#cfe0ff') { g.save(); g.translate(x, y); g.scale(s, s); rr(g, -90, -110, 180, 115, 8); g.fillStyle = '#1a2236'; g.fill(); rr(g, -80, -100, 160, 95, 4); g.fillStyle = alpha(c, 0.8); g.fill(); rr(g, -110, 4, 220, 12, 4); g.fillStyle = '#2a3450'; g.fill(); g.restore(); }
function envelope(g, x, y, w, c = S().ui.cream) { const h = w * 0.64; rr(g, x - w / 2, y - h / 2, w, h, 8); g.fillStyle = c; g.fill(); seg(g, [[x - w / 2 + 6, y - h / 2 + 6], [x, y + h * 0.08], [x + w / 2 - 6, y - h / 2 + 6]], 5, '#5a6a86'); }

// f18 — "In a well-known study, psychologists Justin Kruger and Nicholas Epley"
registerShot('f18', { draw(g, t, info) {
  researchers(g, t, info, [{ x: E.W / 2 - 440, outfit: R1, name: 'JUSTIN KRUGER', at: wt('justin', info, 2.0), pose: POSES.explain, dx: -40, dy: 230 }, { x: E.W / 2 - 110, outfit: R2, name: 'NICHOLAS EPLEY', at: wt('nicholas', info, 3.0), pose: POSES.holdFront, prop: 'tablet', dx: 120, dy: 120 }]);
  text(g, 'A WELL-KNOWN STUDY', E.W - V(330, 300), V(170, 280), { size: 32, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.3, 0.7)) });
} });
// f19 — "found that people were confident their emails would be read the way they meant them."
registerShot('f19', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 160, studyGround() - 300, 1.4 + 0.05 * k); const { M } = study(g, t, cam, {}); const GY = studyGround();
  const tc = wt('confident', info, 1.3), te = wt('emails', info, 1.9);
  layer(g, cam, 1, (g) => { const x = E.W / 2 - 360; drawChar(g, { x, y: GY, s: 1.4, facing: 1, outfit: EXTRA, pose: breathe(posesAt(t, [[0, POSES.holdFront], [tc, POSES.cheer]]), t), expr: t > tc ? 'happy' : 'smile', rim: rimOf(M.rim, [1, -0.4]) }, [], {});
    rr(g, x + 40, GY - 120, 260, 18, 4); g.fillStyle = shade(M.wall, -0.6); g.fill(); g.fillRect(x + 260, GY - 120, 14, 120); laptop(g, x + 170, GY - 122, 0.9);
    const u = ease.inOut(prog(t, te, te + 1.4)); if (u > 0 && u < 1) envelope(g, lerp(x + 170, x + 900, u), GY - 200 - Math.sin(u * Math.PI) * 220, 90); });
  const mx = E.W - V(520, 330), my = E.H * 0.3, lv = ease.inOut(prog(t, tc - 0.2, tc + 1.0));
  text(g, 'CONFIDENCE', mx, my - 70, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, align: 'left' }); rr(g, mx, my - 30, 380, 50, 25); g.fillStyle = alpha('#ffffff', 0.1); g.fill();
  rr(g, mx, my - 30, Math.max(50, 380 * 0.92 * lv), 50, 25); g.fillStyle = S().ui.good || S().ui.gold; g.fill(); if (lv > 0.9) text(g, 'HIGH', mx + 390, my + 50, { size: 34, color: S().ui.good || S().ui.gold, font: FONTS.ui, weight: 900, align: 'right' });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });
// f20 — "But readers trying to tell sarcastic messages from serious ones"
registerShot('f20', { draw(g, t, info) {
  const cam = camOn(E.W / 2 - 200, GYv() - 300, 1.3 + 0.05 * t); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 - 300, spotC: '#bfefff' });
  const ts = wt('sarcastic', info, 1.5), tr = wt('serious', info, 2.8);
  layer(g, cam, 1, (g) => { drawChar(g, { x: E.W / 2 - 340, y: GY, s: 1.5, facing: 1, outfit: EXTRA, pose: breathe(POSES.think, t), expr: 'confused', look: [Math.sin(t * 2) * 0.8, -0.3], rim: rimOf('#bfefff', [0, -1]) }, [], {}); });
  envelope(g, E.W / 2 - 60, E.H * 0.3, 150); text(g, '?', E.W / 2 - 60, E.H * 0.3 - 110, { size: 90, color: S().ui.gold, weight: 700, alpha: 0.6 + 0.4 * Math.sin(t * 5) });
  card(g, t, ts, E.W * 0.7, E.H * 0.32, 440, 120, 'SARCASTIC?', { line: S().ui.accent, rot: -0.04 });
  card(g, t, tr, E.W * 0.7, E.H * 0.58, 440, 120, 'SERIOUS?', { rot: 0.03 });
} });
// f21 — "did barely better than a coin flip."
registerShot('f21', { draw(g, t, info) {
  voidStage(g, t, { z: 1 }, { spot: true, spotC: '#e8fbff' }); const tf = wt('flip', info, 1.8);
  const cx = E.W / 2, cy = E.H * 0.4 - Math.sin(clamp(t / 1.6) * Math.PI) * 180, ang = t * 9, sx = Math.abs(Math.cos(ang)) * 0.9 + 0.1;
  glow(g, cx, cy, 220, S().ui.gold, 0.25); g.save(); g.translate(cx, cy); g.scale(sx, 1); circle(g, 0, 0, 110, mix('#e8c25a', '#a07a20', Math.cos(ang) > 0 ? 0 : 0.4)); ring(g, 0, 0, 92, 6, '#fff0b0');
  text(g, Math.cos(ang) > 0 ? 'S' : '?', 0, 6, { size: 100, color: '#6a4a10', weight: 700 }); g.restore();
  text(g, 'BARELY BETTER THAN', cx, E.H * 0.6, { size: 48, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.2, 0.5)) });
  text(g, 'A COIN FLIP', cx, E.H * 0.6 + 70, { size: 76, color: S().ui.gold, weight: 700, spacing: 5, glow: 18, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, tf - 0.2, tf + 0.2)) });
} });
// f22 — "So when the signals go missing... your brain doesn't leave a blank."
function bigBubble(g, t, label, fillTxt, scrib, o = {}) { UI.blueprint(g); g.save(); zoomIn(g, t, 0.04); const cx = E.W / 2, cy = E.H * 0.44;
  speechBubble(g, cx, cy, 760, 330, { lines: 0, fill: o.fill || '#e9f4ff', a: 0.95 });
  if (fillTxt) { const n = fillTxt.length, k = Math.floor(n * clamp(scrib)); text(g, fillTxt.slice(0, k), cx, cy + 6, { size: 70, color: o.ink || '#1a2a40', weight: 700, spacing: 2 }); }
  g.restore(); if (label) text(g, label[0], E.W / 2, V(140, 280), { size: 60, color: label[1] || S().ui.gold, weight: 700, spacing: 6, glow: 16, glowColor: alpha(label[1] || S().ui.gold, 0.5), alpha: ease.out(prog(t, label[2] ?? 0.2, (label[2] ?? 0.2) + 0.3)) }); }
registerShot('f22', { draw(g, t, info) { bigBubble(g, t, ['BLANK', S().ui.cream, wt('blank', info, 3.0) - 0.1], null, 0); } });
// f23 — "It fills it in."
registerShot('f23', { draw(g, t, info) { const k = ease.inOut(prog(t, 0.1, info.dur - 0.1)); bigBubble(g, t, ['IT FILLS IT IN', S().ui.gold, 0.1], 'she\'s probably…', k);
  const px = E.W / 2 - 300 + 620 * k, py = E.H * 0.44 + Math.sin(t * 30) * 8; g.save(); g.translate(px, py); g.rotate(-0.6); rr(g, -12, -150, 24, 150, 6); g.fillStyle = '#f2c21a'; g.fill(); poly(g, [[-12, 0], [12, 0], [0, 30]], '#e8d0a0'); g.restore(); } });
// f24 — "And a worried brain fills it in with the worst version."
registerShot('f24', { draw(g, t, info) {
  voidStage(g, t, { z: 1 + 0.03 * t }, { spot: false }); const tw = wt('worst', info, 2.6), k = ease.inOut(prog(t, 0.4, tw + 0.4));
  fearShadow(g, E.W * 0.22, E.H * 0.95, 760, t, { eyes: 1, grow: 0.8 + 0.2 * k });
  const cx = E.W * 0.58, cy = E.H * 0.42; speechBubble(g, cx, cy, 820, 300, { lines: 0, fill: '#ffe6e0', a: 0.95 });
  const s = "SHE'S MAD AT YOU"; text(g, s.slice(0, Math.floor(s.length * k)), cx, cy + 6, { size: 66, color: '#b02a20', weight: 700, spacing: 2 });
  text(g, 'THE WORST VERSION', cx, E.H * 0.74, { size: 48, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tw - 0.1, tw + 0.3)) });
} });
// f25 — "Even the period isn't neutral."
registerShot('f25', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), tn = wt('neutral', info, 1.3), tip = ease.outBack(prog(t, tn - 0.3, tn + 0.3)) * 0.22;
  const cx = E.W / 2, cy = E.H * 0.42; poly(g, [[cx - 60, E.H * 0.8], [cx + 60, E.H * 0.8], [cx, cy]], alpha(c, 0.5)); g.save(); g.translate(cx, cy); g.rotate(tip);
  seg(g, [[-420, 0], [420, 0]], 10, c); for (const s of [-1, 1]) { seg(g, [[s * 420, 0], [s * 420 - 90, 140], [s * 420 + 90, 140], [s * 420, 0]], 3, c); } g.restore();
  const ex = (s) => [cx + Math.cos(tip) * 420 * s, cy + Math.sin(tip) * 420 * s];
  const [lx, ly] = ex(-1), [rx, ry] = ex(1); okBubble(g, lx, ly + 90, 0.45, 'ok'); circle(g, rx, ry + 105, 30, S().ui.accent); glow(g, rx, ry + 105, 90, S().ui.accent, 0.4);
  stamp(g, t, tn + 0.1, E.W / 2, E.H * 0.2, 'NOT NEUTRAL', { size: 60 }); } });
// f26 — "In one small study, one-word text replies"
registerShot('f26', { draw(g, t, info) { backdrop(g, ['#05080f', '#0b1424', '#101c30']); const tw = wt('one', info, 1.2, 0.6);
  [[-1, 'yeah'], [1, 'yeah.']].forEach(([s, str], i) => { g.save(); g.translate(s * V(330, 240), 0); phone(g, t, E.W / 2, E.H * 0.46, V(640, 900), [{ me: false, lines: [str], at: 0.3 + i * 0.3, size: 44, w: 0.5 }], {}); g.restore(); });
  card(g, t, 0.1, E.W / 2, V(110, 200), 460, 90, 'ONE SMALL STUDY', { size: 38, line: S().ui.accent });
  text(g, 'ONE-WORD REPLIES', E.W / 2, E.H * 0.83 - 60, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tw, tw + 0.3)) }); } });
// f27 — "that ended with a period were rated as less sincere than the same word without one."
registerShot('f27', { draw(g, t, info) { UI.blueprint(g); const tl = wt('less', info, 2.0), k = ease.inOut(prog(t, tl - 0.3, tl + 0.6));
  const x0 = V(560, 200), w = V(900, 700); text(g, 'HOW SINCERE?', E.W / 2, V(150, 280), { size: 48, color: S().ui.cream, spacing: 3 });
  [['yeah', 0.8, 0.8, S().ui.gold], ['yeah.', 0.8, 0.45, S().ui.accent]].forEach(([s, a, b, col], i) => { const y = E.H * (0.4 + i * 0.22), v = lerp(a, b, k);
    okBubble(g, x0 - 200, y, 0.5, s); rr(g, x0, y - 30, w, 60, 30); g.fillStyle = alpha('#ffffff', 0.08); g.fill(); rr(g, x0, y - 30, w * v * ease.out(prog(t, 0.2 + i * 0.2, 0.8 + i * 0.2)), 60, 30); g.fillStyle = col; g.fill(); });
  text(g, 'LESS SINCERE', x0 + w * 0.45 + 40, E.H * 0.62 + 90, { size: 44, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 3, align: 'left', alpha: ease.out(prog(t, tl, tl + 0.3)) }); } });
// f28 — "So your friend typed two letters and a dot."
registerShot('f28', { draw(g, t, info) { backdrop(g, ['#05080f', '#0b1424', '#101c30']); const tt = wt('two', info, 1.0), td = wt('dot', info, 2.2);
  const keys = [['O', tt - 0.1], ['K', tt + 0.35], ['.', td - 0.05]]; keys.forEach(([k, at], i) => { const x = E.W / 2 + (i - 1) * 260, y = E.H * 0.48, pr = prog(t, at, at + 0.15) * (1 - prog(t, at + 0.2, at + 0.4));
    rr(g, x - 110, y - 110 + pr * 14, 220, 220, 30); g.fillStyle = t > at ? '#2a3a58' : '#1a2438'; g.fill(); g.strokeStyle = t > at ? S().ui.accent : alpha('#9fc8ff', 0.4); g.lineWidth = 5; g.stroke();
    text(g, k, x, y + pr * 14 + 6, { size: 110, color: S().ui.cream, font: FONTS.ui, weight: 900 }); if (t > at) glow(g, x, y, 160, S().ui.accent, 0.2); });
  text(g, '2 LETTERS + A DOT', E.W / 2, V(170, 300), { size: 56, color: S().ui.gold, weight: 700, spacing: 4, alpha: ease.out(prog(t, td, td + 0.3)) });
  const ax = E.W / 2 + lerp(-260, 260, clamp((t - tt) / (td - tt))), ay = E.H * 0.48 + 200; g.fillStyle = '#e8c8a8'; g.beginPath(); g.ellipse(ax, ay + 40 - Math.abs(Math.sin(t * 8)) * 20, 50, 80, 0.3, 0, 7); g.fill(); } });
// f29 — "And your brain wrote a whole story."
registerShot('f29', { draw(g, t, info) {
  const cam = camOn(E.W / 2 - 300, bedGround() - 400, 1.35 + 0.05 * t); const B = miloBed(g, t, cam, { expr: 'worried', lamp: 0.5, look: [0.4, -0.6] });
  const h = toScr(cam, B.head[0], B.head[1]), u = ease.out(prog(t, 0.2, 1.6)), W = 760 * u, x0 = h[0] + 80, y0 = h[1] - 360;
  if (u > 0) { rr(g, x0, y0, W, 380, 10); g.fillStyle = '#efe6cf'; g.fill(); circle(g, x0 + W, y0 + 190, 30, '#d8cba8');
    ['CH. 1: SHE\'S MAD', 'CH. 2: IT WAS THE JOKE', 'CH. 3: SHE\'S DONE WITH ME'].forEach((s, i) => { const a = ease.out(prog(t, 0.6 + i * 0.5, 0.9 + i * 0.5)); text(g, s, x0 + 40, y0 + 80 + i * 100, { size: 36, color: alpha('#3a2a1a', a), font: FONTS.ui, weight: 900, align: 'left' }); }); }
  text(g, 'A WHOLE STORY', E.W - V(360, 260), V(120, 230), { size: 46, color: S().ui.gold, weight: 700, spacing: 4, alpha: ease.out(prog(t, wt('story', info, 1.4) - 0.1, wt('story', info, 1.4) + 0.3)) });
} });
// f30 — "Now here's where it gets personal."
registerShot('f30', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 160, bedGround() - 380, 1.3 + 0.18 * k);
  miloBed(g, t, cam, { expr: 'nervous', pose: SIT_SLUMP, phone: false, lamp: 0.3, look: [0.6, 0.2], shadow: { x: E.W / 2 - 60, h: 700, grow: 1, eyes: ease.out(prog(t, 0.4, 1.0)) } });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });
// f31 — "Psychologists Geraldine Downey and Scott Feldman"
registerShot('f31', { draw(g, t, info) { researchers(g, t, info, [{ x: E.W / 2 - 440, outfit: R3, name: 'GERALDINE DOWNEY', at: wt('geraldine', info, 0.8), pose: POSES.explain, dx: -40, dy: 230 }, { x: E.W / 2 - 110, outfit: R4, name: 'SCOTT FELDMAN', at: wt('scott', info, 2.1), pose: POSES.crossArms, dx: 120, dy: 120 }]); } });
// f32 — "described something called rejection sensitivity."
registerShot('f32', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); const tr = wt('rejection', info, 1.6); UI.titleCard(g, t, { lines: t < tr - 0.1 ? ['SOMETHING CALLED'] : ['SOMETHING CALLED', 'REJECTION SENSITIVITY'], dur: info.dur, y: E.H * 0.42 }); } });
// f33 — "Some of us anxiously expect rejection."   f34 — radar blips
function radarHead(g, t, cam, GY, o = {}) {
  layer(g, cam, 1, (g) => { const x = E.W / 2 - 260, s = 1.5; milo(g, { x, y: GY, s, facing: 1, pose: breathe(POSES.stand, t), expr: 'nervous', look: [Math.sin(t * 2.4), -0.3], rim: rimOf('#bfefff', [0, -1]) });
    const hx = x + 4 * s, hy = GY - 232 * s; seg(g, [[hx, hy], [hx, hy - 60]], 8, '#9aa8c0'); const a = Math.sin(t * 2.4) * 0.6;
    g.save(); g.translate(hx, hy - 60); g.rotate(a); g.fillStyle = '#c9d2e8'; g.beginPath(); g.ellipse(0, -20, 70, 26, 0, Math.PI, 0); g.fill(); seg(g, [[0, -20], [0, -70]], 5, '#c9d2e8'); circle(g, 0, -74, 8, S().ui.accent); g.restore();
    FX.rings(g, hx, hy - 120, t, { count: 3, r0: 30, r1: 260, speed: 0.9, color: S().ui.accent, a: 0.35 }); });
}
registerShot('f33', { draw(g, t, info) { const cam = camOn(E.W / 2 - 100, GYv() - 300, 1.15 + 0.04 * t); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 - 260, spotC: '#bfefff' }); radarHead(g, t, cam, GY);
  const te = wt('expect', info, 1.4); text(g, 'EXPECTING REJECTION', E.W - V(500, 300), E.H * 0.3, { size: 46, color: S().ui.accent, weight: 700, spacing: 4, alpha: ease.out(prog(t, te - 0.1, te + 0.3)) }); } });
registerShot('f34', { draw(g, t, info) { UI.blueprint(g); const cx = E.W / 2, cy = E.H * 0.46, R = 330, c = UI.bpStroke();
  for (let i = 1; i <= 3; i++) ring(g, cx, cy, R * i / 3, 3, alpha(c, 0.5)); seg(g, [[cx - R, cy], [cx + R, cy]], 2, alpha(c, 0.4)); seg(g, [[cx, cy - R], [cx, cy + R]], 2, alpha(c, 0.4));
  const a = t * 2.2; g.save(); g.globalAlpha *= 0.3; g.fillStyle = c; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R, a - 0.5, a); g.closePath(); g.fill(); g.restore(); seg(g, [[cx, cy], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 4, c);
  const blips = [[0.6, -0.4], [-0.5, 0.3], [0.2, 0.7], [-0.7, -0.5], [0.8, 0.3], [-0.2, -0.8], [0.4, 0.1]];
  blips.forEach(([u, v], i) => { const at = 0.3 + i * 0.5, p = prog(t, at, at + 0.3); if (p <= 0) return; const red = prog(t, at + 0.4, at + 0.8); circle(g, cx + u * R, cy + v * R, 14, mix(S().ui.gold, S().ui.accent, red)); glow(g, cx + u * R, cy + v * R, 50, mix(S().ui.gold, S().ui.accent, red), 0.5); });
  text(g, 'REJECTION?', cx + R + 40, cy - R + 40, { size: 40, color: S().ui.accent, font: FONTS.ui, weight: 900, align: 'left', alpha: ease.out(prog(t, 1.2, 1.6)) }); } });
// f35 — "unclear."
registerShot('f35', { draw(g, t, info) { backdrop(g, ['#05080f', '#0b1424']); okBubble(g, E.W / 2, E.H * 0.44, 1.2, '…');
  for (let i = 0; i < 14; i++) { const x = (i * 157 + t * 120) % (E.W + 400) - 200, y = E.H * (0.3 + (i % 5) * 0.08); glow(g, x, y, 220, '#9fb8d8', 0.18 * ease.out(prog(t, 0, 0.5))); }
  text(g, 'UNCLEAR', E.W / 2, E.H * 0.72, { size: 80, color: S().ui.cream, weight: 700, spacing: 10, alpha: 0.4 + 0.6 * ease.out(prog(t, 0.1, 0.5)) }); } });
// f36–f38 — the three gaps
function gapCard(g, t, info, n) { backdrop(g, ['#05080f', '#0b1424', '#101c30']); FX.dust(g, t, { count: 30, color: '#9fd8ff', a: 0.15 });
  const labels = ['SHORT REPLY', 'LATE REPLY', '"SEEN"'];
  labels.forEach((s, i) => { if (i > n) return; const x = E.W * (0.2 + i * 0.3), y = E.H * 0.46, cur = i === n, p = cur ? popIn(t, 0.05) : 1; if (p <= 0) return;
    g.save(); g.translate(x, y); g.scale(p * (cur ? 1.05 : 0.92), p * (cur ? 1.05 : 0.92)); g.globalAlpha *= cur ? 1 : 0.55;
    rr(g, -230, -230, 460, 460, 30); g.fillStyle = '#16203a'; g.fill(); g.strokeStyle = cur ? S().ui.accent : alpha(S().ui.gold, 0.5); g.lineWidth = 5; g.stroke();
    if (i === 0) okBubble(g, 0, -40, 0.7, 'k');
    else if (i === 1) { ring(g, 0, -40, 90, 8, S().ui.gold); const a = t * (cur ? 9 : 0) - 1.2; seg(g, [[0, -40], [Math.cos(a) * 70, -40 + Math.sin(a) * 70]], 7, S().ui.gold); seg(g, [[0, -40], [Math.cos(a / 12) * 45, -40 + Math.sin(a / 12) * 45]], 9, S().ui.gold); }
    else { rr(g, -170, -110, 340, 90, 40); g.fillStyle = ME; g.fill(); text(g, 'are we ok?', 0, -64, { size: 36, color: '#ffffff', font: FONTS.ui, weight: 900 }); text(g, 'Seen', 160, 0, { size: 30, color: alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, align: 'right' }); }
    text(g, s, 0, 150, { size: 42, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }); }
registerShot('f36', { draw(g, t, info) { gapCard(g, t, info, 0); } });
registerShot('f37', { draw(g, t, info) { gapCard(g, t, info, 1); } });
registerShot('f38', { draw(g, t, info) { gapCard(g, t, info, 2); } });
// f39 — "The Shadow doesn't need evidence. It just needs a gap."
registerShot('f39', { draw(g, t, info) {
  const cam = camOn(E.W / 2 - 200, bedGround() - 380, 1.15 + 0.04 * t), tg = wt('gap', info, 2.8), te = wt('evidence', info, 1.0);
  miloBed(g, t, cam, { pose: SIT_SLUMP, expr: 'scared', phone: false, lamp: 0.2, look: [0.8, -0.4], shadow: { x: E.W / 2 - 40, h: 760, grow: 0.8 + 0.3 * ease.inOut(prog(t, tg - 0.3, tg + 0.6)), eyes: 1 } });
  card(g, t, te, E.W * 0.76, E.H * 0.24, 420, 100, 'EVIDENCE', { cross: prog(t, te + 0.3, te + 0.7), size: 42 });
  card(g, t, tg, E.W * 0.76, E.H * 0.44, 420, 100, 'A GAP', { line: S().ui.accent, color: S().ui.accent, size: 50 });
} });
// f40 — "And here's the twist."
registerShot('f40', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); UI.bigLine(g, t, { str: 'THE TWIST', dur: info.dur + 0.3, y: E.H * 0.42, size: V(130, 100) }); } });
// f41 — "In 2018, researchers led by Erica Boothby"
registerShot('f41', { draw(g, t, info) { researchers(g, t, info, [{ x: E.W / 2 - 300, outfit: R5, name: 'ERICA BOOTHBY', at: wt('erica', info, 2.0), pose: POSES.explain }], { z: 1.4 });
  UI.badge(g, { str: '2018', a: ease.out(prog(t, wt('2018', info, 0.3) - 0.1, wt('2018', info, 0.3) + 0.3)), size: V(70, 70) }); } });
// f42 — "had strangers talk to each other, then asked two questions."
registerShot('f42', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2, GYv() - 300, 1.25 + 0.05 * k); const { GY } = voidStage(g, t, cam, { spotC: '#e8fbff' }); const tq = wt('two', info, 3.0), tk = wt('talk', info, 0.7);
  const tA = talkAmount(info.globalT, info.shot.start + tk, info.shot.start + tq - 0.4);
  layer(g, cam, 1, (g) => { milo(g, { x: E.W / 2 - 200, y: GY, s: 1.4, facing: 1, pose: breathe(posesAt(t, [[0, POSES.relaxed], [1.0, POSES.talk]]), t), expr: 'smile', talk: tA * (Math.sin(t * 3) > 0 ? 1 : 0), rim: rimOf('#e8fbff', [0, -1]) });
    drawChar(g, { x: E.W / 2 + 200, y: GY, s: 1.4, facing: -1, outfit: { top: 'tshirt', color: '#3a8a6a', head: 'cap', headColor: '#2a5a4a', legs: '#2a2f45' }, pose: breathe(posesAt(t, [[0, POSES.relaxed], [1.4, POSES.explain]]), t), expr: 'happy', talk: tA * (Math.sin(t * 3) <= 0 ? 1 : 0), rim: rimOf('#e8fbff', [0, -1]) }, [], {}); });
  text(g, 'STRANGERS', E.W / 2, V(140, 260), { size: 44, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.2, 0.5)) * (1 - prog(t, tq - 0.3, tq)) });
  card(g, t, tq, E.W / 2, V(150, 270), 520, 100, '2 QUESTIONS', { size: 48, line: S().ui.accent });
} });
// f43 / f44 — the two questions with sliders
function question(g, t, info, n) { UI.blueprint(g); const qs = ['HOW MUCH DID YOU LIKE THEM?', 'HOW MUCH DID THEY LIKE YOU?'];
  qs.forEach((q, i) => { if (i > n) return; const y = E.H * (0.3 + i * 0.28), cur = i === n, a = cur ? ease.out(prog(t, 0.05, 0.35)) : 0.5; g.save(); g.globalAlpha *= a;
    text(g, (i + 1) + '. ' + q, E.W / 2, y - 50, { size: 50, color: cur ? S().ui.cream : alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, spacing: 2 });
    const x0 = E.W / 2 - 420; rr(g, x0, y + 10, 840, 16, 8); g.fillStyle = alpha('#ffffff', 0.15); g.fill(); const v = i === 0 ? 0.75 : (cur ? 0.75 - 0.25 * ease.inOut(prog(t, 0.6, 1.6)) : 0.5);
    rr(g, x0, y + 10, 840 * v, 16, 8); g.fillStyle = i ? S().ui.accent : S().ui.gold; g.fill(); circle(g, x0 + 840 * v, y + 18, 26, i ? S().ui.accent : S().ui.gold); g.restore(); }); }
registerShot('f43', { draw(g, t, info) { question(g, t, info, 0); } });
registerShot('f44', { draw(g, t, info) { question(g, t, info, 1); } });
// f45 — "Again and again, people underestimated how much they were liked."
registerShot('f45', { draw(g, t, info) { UI.blueprint(g); const tu = wt('underestimated', info, 1.6), x0 = V(620, 220), w = V(880, 700);
  const rows = [[E.H * 0.38, 'HOW MUCH THEY LIKED YOU', 0.82, S().ui.gold, 0.2], [E.H * 0.58, 'HOW MUCH YOU THOUGHT', 0.55, S().ui.accent, tu - 0.2]];
  rows.forEach(([y, lab, v, col, at]) => { text(g, lab, x0 - 40, y, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'right', spacing: 2 }); rr(g, x0, y - 32, w, 64, 32); g.fillStyle = alpha('#ffffff', 0.08); g.fill();
    const f = ease.inOut(prog(t, at, at + 0.8)); if (f > 0) { rr(g, x0, y - 32, Math.max(64, w * v * f), 64, 32); g.fillStyle = col; g.fill(); } });
  const gp = ease.out(prog(t, tu + 0.5, tu + 1.0)); if (gp > 0) { const gx1 = x0 + w * 0.55, gx2 = x0 + w * 0.82, gy = E.H * 0.7; seg(g, [[gx1, gy], [gx1 + (gx2 - gx1) * gp, gy]], 6, S().ui.cream); poly(g, [[gx2, gy], [gx2 - 24, gy - 14], [gx2 - 24, gy + 14]], alpha(S().ui.cream, gp));
    text(g, 'UNDERESTIMATED', (gx1 + gx2) / 2, gy + 50, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: gp }); }
  text(g, 'AGAIN AND AGAIN', E.W / 2, V(130, 260), { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.1, 0.4)) }); } });
// f46 — "The researchers called it the liking gap."
registerShot('f46', { draw(g, t, info) { titleBackdrop(g, t, info, 'dusk'); const tl = wt('liking', info, 1.6); UI.titleCard(g, t, { lines: t < tl - 0.1 ? ['THEY CALLED IT'] : ['THEY CALLED IT', 'THE LIKING GAP'], dur: info.dur, y: E.H * 0.42 }); } });
// f47–f49 — walking away from the conversation
const STR = { top: 'tshirt', color: '#3a8a6a', head: 'cap', headColor: '#2a5a4a', legs: '#2a2f45' };
registerShot('f47', { draw(g, t, info) {
  const GY = streetGround(), x = E.W / 2 - 100 - t * 150, cam = camOn(x + 60, GY - 320, 1.45); const { M } = street(g, t, cam);
  layer(g, cam, 1, (g) => { milo(g, { x, y: GY, s: 1.35, facing: -1, pose: walkPose(t * 2 * Math.PI * 0.8), expr: 'worried', rim: rimOf(M.rim, [1, -0.4]) }); });
  const h = toScr(cam, x, GY - 230 * 1.35), tw = wt('weird', info, 2.4); thoughtCloud(g, h[0] + 60, h[1] - 170, 520, 160, { scale: popIn(t, tw - 0.6), label: 'I SAID SOMETHING WEIRD', labelSize: 32, tail: h });
} });
registerShot('f48', { draw(g, t, info) {
  const GY = streetGround(), x = E.W / 2 + 100 + t * 150, cam = camOn(x - 60, GY - 320, 1.45); const { M } = street(g, t, cam);
  layer(g, cam, 1, (g) => drawChar(g, { x, y: GY, s: 1.35, facing: 1, outfit: STR, pose: walkPose(t * 2 * Math.PI * 0.8), expr: 'happy', rim: rimOf(M.rim, [-1, -0.4]) }, [], {}));
} });
registerShot('f49', { draw(g, t, info) {
  const GY = streetGround(), x = E.W / 2 + 430 + t * 120, cam = camOn(x - 60, GY - 330, 1.6); const { M } = street(g, t, cam);
  layer(g, cam, 1, (g) => drawChar(g, { x, y: GY, s: 1.35, facing: 1, outfit: STR, pose: walkPose(t * 2 * Math.PI * 0.8), expr: 'happy', rim: rimOf(M.rim, [-1, -0.4]) }, [], {}));
  const h = toScr(cam, x, GY - 230 * 1.35); glow(g, h[0] - 40, h[1] - 170, 260, S().ui.gold, 0.3); thoughtCloud(g, h[0] - 40, h[1] - 170, 440, 150, { scale: popIn(t, 0.05), fill: '#fff1c8', label: 'THAT WAS NICE :)', labelSize: 34, tail: h });
} });
