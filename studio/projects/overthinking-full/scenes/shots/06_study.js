// shots/06_study.js — part 2b: the small study, the remembered survival, rumination, digging (t17-t29).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { study, studyGround } from '../sets/study.js';
import { street, streetGround } from '../sets/street.js';
import { bedroom } from '../sets/bedroom.js';
import { thoughtCloud, speechBubble, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, brainIcon, rewindIcon, field, titleBackdrop, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL, ADA, AACC, ACOL, NOLEN, EXTRA } from '../cast.js';

const rimOf = (c, dir = [-0.6, -0.8]) => ({ color: c, dir, w: 4 });
const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);

// t17 — "In one small study, people with generalized anxiety disorder"
registerShot('t17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 120 + 40 * k, studyGround() - 320, 1.12 + 0.05 * k);
  const { M } = study(g, t, cam, {});
  const tp = wt('people', info, 1.3);
  layer(g, cam, 1, (g) => {
    drawChar(g, { x: E.W / 2 - 430, y: studyGround(), s: 1.4, facing: 1, outfit: ADA, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, POSES.pointUp]]), t), expr: 'smile', rim: rimOf(M.rim, [1, -0.4]) }, AACC, ACOL);
    for (let i = 0; i < 3; i++) { const x = E.W / 2 + 60 + i * 150, a = ease.out(prog(t, tp + i * 0.15, tp + 0.4 + i * 0.15)); if (a <= 0) continue;
      g.save(); g.translate(x - 12, 0); FX.chair(g, 0, studyGround(), 1.1, shade(M.wall, -0.7)); g.restore();
      drawChar(g, { x, y: studyGround(), s: 1.1, facing: -1, outfit: EXTRA, pose: breathe(POSES.sit, t, 1, i + 3), expr: 'nervous', alpha: a, rim: rimOf(M.rim, [1, -0.4]) }, [], {}); }
  });
  const b = toScr(cam, E.W / 2 - 460, studyGround() - 560);
  text(g, 'ONE SMALL STUDY', b[0], b[1] - 30, { size: 44, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, glow: 14, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, 0.2, 0.6)) });
  const tg = wt('generalized', info, 1.9);
  text(g, 'GENERALIZED ANXIETY DISORDER', E.W / 2 + 200, V(180, 300), { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tg, tg + 0.3)) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// t18 — "wrote down their worries, then checked what actually happened."
registerShot('t18', { draw(g, t, info) {
  blurLayer(g, 14, (g) => study(g, t, camOn(E.W / 2 + 100, studyGround() - 300, 1.8), {})); veil(g, '#0a0a14', 0.4);
  const tc = wt('checked', info, 1.6), cx = E.W / 2, cy = E.H * 0.5, w = 720, h = 760, z = 1 + 0.04 * t;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.rotate(-0.04);
  rr(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = '#efe9da'; g.fill(); g.fillStyle = '#c94a3a'; g.fillRect(-w / 2 + 70, -h / 2, 3, h);
  for (let l = 0; l < 8; l++) { g.fillStyle = alpha('#3a6ea5', 0.25); g.fillRect(-w / 2, -h / 2 + 90 + l * 80, w, 2); }
  text(g, 'MY WORRIES', -w / 2 + 110, -h / 2 + 50, { size: 34, color: '#2a2436', font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
  for (let l = 0; l < 7; l++) { const p = ease.out(prog(t, 0.1 + l * 0.17, 0.35 + l * 0.17)), lw = (w - 220) * (0.55 + ((l * 37) % 40) / 100) * p, y = -h / 2 + 130 + l * 80;
    rr(g, -w / 2 + 130, y - 8, lw, 14, 7); g.fillStyle = alpha('#2a2436', 0.75); g.fill();
    const ck = prog(t, tc + l * 0.12, tc + 0.2 + l * 0.12); if (ck > 0) { g.strokeStyle = '#2f9e5a'; g.lineWidth = 6; g.beginPath(); g.moveTo(-w / 2 + 84, y); g.lineTo(-w / 2 + 96, y + 12 * ck); g.lineTo(-w / 2 + 96 + 20 * ck, y - 16 * ck); g.stroke(); } }
  g.restore();
  // pen hand
  const pl = Math.min(6, Math.floor((t - 0.1) / 0.17)), py = cy - h / 2 + 130 + Math.max(0, pl) * 80, px = cx + 120 + Math.sin(t * 20) * 30;
  if (t < tc) { seg(g, [[px, py], [px + 120, py + 160]], 10, '#20242e'); seg(g, [[px + 100, py + 140], [E.W + 200, E.H + 200]], 70, S().ink); }
} });

// t19 — "About nine in ten never came true."
registerShot('t19', { draw(g, t, info) {
  const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]); const gold = S().ui.gold, acc = S().ui.accent;
  const tn = wt('nine', info, 0.5), tt = wt('true', info, 2.2);
  for (let i = 0; i < 10; i++) { const x = E.W / 2 + ((i % 5) - 2) * 230, y = E.H * 0.36 + Math.floor(i / 5) * 220, p = popIn(t, 0.05 + i * 0.04, 0.3);
    const keep = i === 6, x9 = !keep && t > tn + (i - (i > 6 ? 1 : 0)) * 0.13;
    thoughtCloud(g, x, y, 170, 100, { scale: p, fill: keep ? acc : x9 ? alpha('#5a6380', 0.6) : S().ui.cream, a: 0.95 });
    if (x9) { const c = ease.out(prog(t, tn + i * 0.13, tn + i * 0.13 + 0.15)); seg(g, [[x - 50 * c, y - 40 * c], [x + 50 * c, y + 40 * c]], 9, gold); seg(g, [[x + 50 * c, y - 40 * c], [x - 50 * c, y + 40 * c]], 9, gold); }
    if (keep) glow(g, x, y, 140, acc, 0.3); }
  text(g, '9 IN 10', E.W / 2, E.H * 0.82, { size: 84, color: gold, font: FONTS.ui, weight: 900, glow: 20, glowColor: alpha(gold, 0.5), alpha: ease.out(prog(t, tn, tn + 0.3)) });
  text(g, 'NEVER CAME TRUE', E.W / 2, E.H * 0.91, { size: 36, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, tt - 0.2, tt + 0.2)) });
  text(g, 'one small study', E.W - 60, E.H - 40, { size: 22, color: alpha(S().ui.cream, 0.5), font: FONTS.ui, weight: 800, align: 'right' });
} });

// t20 — "But the brain doesn't keep score."
registerShot('t20', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, cx = E.W / 2, cy = E.H * 0.5;
  const ts = wt('score', info, 1.4), off = t > ts;
  brainIcon(g, cx - 430, cy, 150, c, 7);
  const gl = off && t < ts + 0.4 ? shake(t, 10, 40)[0] : 0;
  rr(g, cx - 160 + gl, cy - 200, 720, 400, 24); g.fillStyle = '#0d1830'; g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
  text(g, 'SCOREBOARD', cx + 200, cy - 140, { size: 34, color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 5 });
  const rows = [['CAME TRUE', '1', S().ui.accent], ["DIDN'T", '9', gold]];
  rows.forEach(([l, v, col], i) => { const y = cy - 30 + i * 110; text(g, l, cx - 100, y, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', alpha: off ? 0.25 : 1 });
    const flick = off ? (Math.sin(t * 60) > 0.3 && t < ts + 0.5 ? v : '– –') : v; text(g, flick, cx + 480, y, { size: 64, color: off ? alpha(c, 0.4) : col, font: FONTS.ui, weight: 900, align: 'right', glow: off ? 0 : 14, glowColor: alpha(col, 0.5) }); });
  seg(g, [[cx - 280, cy], [cx - 170, cy]], 4, alpha(c, 0.5));
} });

// t21 — "It just remembers: I worried... and I survived."
registerShot('t21', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold;
  const tw = wt('worried', info, 1.6), ts = wt('survived', info, 2.6), loop = ease.inOut(prog(t, ts + 0.3, ts + 1.1));
  const A = [E.W * 0.32, E.H * 0.56], B = [E.W * 0.68, E.H * 0.56];
  [[A, 'I WORRIED', tw], [B, 'I SURVIVED', ts]].forEach(([[x, y], s, at]) => { const p = ease.outBack(prog(t, at - 0.1, at + 0.25)); if (p <= 0) return;
    g.save(); g.translate(x, y); g.scale(p, p); rr(g, -190, -60, 380, 120, 60); g.fillStyle = '#12203a'; g.fill(); g.strokeStyle = gold; g.lineWidth = 5; g.stroke(); text(g, s, 0, 2, { size: 40, color: gold, font: FONTS.ui, weight: 900, spacing: 2 }); g.restore(); });
  if (t > ts) { seg(g, [[A[0] + 200, A[1]], [lerp(A[0] + 200, B[0] - 200, ease.out(prog(t, ts, ts + 0.3))), A[1]]], 5, c); }
  if (loop > 0) { g.strokeStyle = gold; g.lineWidth = 6; g.beginPath(); const N = 60; for (let i = 0; i <= N * loop; i++) { const u = i / N, an = -u * Math.PI; const x = (A[0] + B[0]) / 2 + Math.cos(an) * (B[0] - A[0]) / 2, y = A[1] - 70 + Math.sin(an) * 210; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
    if (loop >= 1) { poly(g, [[A[0] - 16, A[1] - 90], [A[0] + 16, A[1] - 90], [A[0], A[1] - 64]], gold); const an = -((t * 0.8) % 1) * Math.PI; glow(g, (A[0] + B[0]) / 2 + Math.cos(an) * (B[0] - A[0]) / 2, A[1] - 70 + Math.sin(an) * 210, 50, gold, 0.8); } }
  text(g, 'REMEMBERED', E.W / 2, E.H * 0.22, { size: 34, color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.2, 0.6)) });
} });

// t22 — "And it gets worse when worry turns around and looks backward."
registerShot('t22', { draw(g, t, info) {
  const tt = wt('turns', info, 2.0), stop = tt - 0.3, walkT = Math.min(t, stop), mx = E.W / 2 - 300 + walkT * 140;
  const cam = camOn(mx + 120, streetGround() - 300, 1.4);
  const { M, GY } = street(g, t, cam);
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 6; i++) { const x = mx - 180 - i * 170, y = GY - 330 - Math.sin(t * 1.5 + i) * 10; speechBubble(g, x, y, 130, 46, { a: (0.75 - i * 0.1) * (t > tt ? 1 : 0.5), fill: '#7a84a8', lines: 1 }); }
    const turned = t > tt + 0.2;
    milo(g, { x: mx, y: GY, s: 1.4, facing: turned ? -1 : 1, pose: t < stop ? walkPose(t * 2 * Math.PI * 0.9) : breathe(POSES.stand, t), expr: turned ? 'worried' : 'neutral', look: turned ? [-1, -0.3] : [1, 0], rim: rimOf(M.practical, [1, -0.3]) });
  });
  FX.dust(g, t, { count: 24, color: '#ffd59a', a: 0.25 });
} });

// t23 — "That backward loop has a name: rumination."
registerShot('t23', { draw(g, t, info) {
  titleBackdrop(g, t, info, 'night');
  const tr = wt('rumination', info, 2.0);
  UI.titleCard(g, t, { lines: t < tr - 0.1 ? ['THAT LOOP HAS A NAME'] : ['THAT LOOP HAS A NAME', 'RUMINATION'], dur: info.dur, y: E.H * 0.42 });
  if (t > tr - 0.1) { const p = ease.outBack(prog(t, tr - 0.1, tr + 0.3)); g.save(); g.translate(E.W / 2, E.H * 0.66); g.scale(p, p); g.rotate(-t * 0.8); rewindIcon(g, 0, 0, 46, S().ui.gold, 6); g.restore(); }
} });

// t24 — "Psychologist Susan Nolen-Hoeksema spent years studying it."
registerShot('t24', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 260 + 40 * k, studyGround() - 300, 1.35 + 0.05 * k);
  const { M } = study(g, t, cam, { flip: 3 * (1 - ease.out(prog(t, 2.6, 3.2))) });
  const ts = wt('susan', info, 0.6);
  layer(g, cam, 1, (g) => drawChar(g, { x: E.W / 2 - 330, y: studyGround(), s: 1.4, facing: 1, outfit: NOLEN, pose: breathe(posesAt(t, [[0, POSES.think], [2.4, POSES.explain]]), t), expr: 'thinking', rim: rimOf(M.rim, [1, -0.4]) }, [], {}));
  const h = toScr(cam, E.W / 2 - 330, studyGround() - 230 * 1.4);
  UI.callout(g, t, { at: h, to: [h[0] + 60, h[1] - 150], str: 'SUSAN NOLEN-HOEKSEMA', start: ts - 0.1 });
  const ty = wt('years', info, 2.4); text(g, 'YEARS OF RESEARCH', E.W - V(420, 300), V(170, 280), { size: 30, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, ty, ty + 0.3)) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// t25 / t27 — replaying problems -> chain -> depression risk
function chainBoard(g, t, info, phase) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, acc = S().ui.accent;
  const L = [E.W * 0.24, E.H * 0.5], R = [E.W * 0.76, E.H * 0.5];
  const tr = phase === 1 ? wt('replaying', info, 1.6) : 0, links = phase === 1 ? 0.45 * ease.inOut(prog(t, 0.3, info.dur)) : lerp(0.45, 1, ease.inOut(prog(t, 0, 0.8)));
  g.save(); g.translate(...L); g.rotate(-t * (phase === 1 ? 1.2 : 0.6)); rewindIcon(g, 0, 0, 90, gold, 7); g.restore();
  text(g, 'REPLAYING', L[0], L[1] + 140, { size: 34, color: gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: phase === 2 ? 1 : ease.out(prog(t, tr - 0.1, tr + 0.3)) });
  text(g, 'PROBLEMS', L[0], L[1] + 184, { size: 34, color: gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: phase === 2 ? 1 : ease.out(prog(t, tr + 0.2, tr + 0.5)) });
  const n = 9; for (let i = 0; i < n * links; i++) { const u = (i + 0.5) / n, x = lerp(L[0] + 120, R[0] - 140, u); g.save(); g.translate(x, L[1]); g.strokeStyle = c; g.lineWidth = 7; g.beginPath(); g.ellipse(0, 0, 34, i % 2 ? 10 : 20, 0, 0, 7); g.stroke(); g.restore(); }
  if (phase === 2) { const th = wt('higher', info, 0.3), td = wt('depression', info, 1.1), p = ease.outBack(prog(t, 0.6, 1.0));
    g.save(); g.translate(...R); g.scale(p, p); rr(g, -130, -150, 260, 300, 24); g.strokeStyle = acc; g.lineWidth = 5; g.stroke();
    const lvl = lerp(0.25, 0.75, ease.inOut(prog(t, th, th + 0.8))); rr(g, -60, 110 - 240 * lvl, 120, 240 * lvl, 12); g.fillStyle = acc; g.fill(); glow(g, 0, 110 - 240 * lvl, 120, acc, 0.4);
    poly(g, [[90, -40], [110, -80], [130, -40]], acc); g.restore();
    text(g, 'DEPRESSION RISK', R[0], R[1] + 210, { size: 34, color: acc, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, td - 0.1, td + 0.3)) });
    text(g, 'HIGHER', R[0], R[1] - 210, { size: 40, color: acc, font: FONTS.ui, weight: 900, spacing: 4, glow: 12, glowColor: alpha(acc, 0.5), alpha: ease.out(prog(t, th, th + 0.3)) }); }
  text(g, 'LINKED', E.W / 2, E.H * 0.36, { size: 34, color: alpha(c, 0.9), font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, 0.6, 1.0)) });
}
registerShot('t25', { draw(g, t, info) { chainBoard(g, t, info, 1); } });
registerShot('t27', { draw(g, t, info) { chainBoard(g, t, info, 2); } });

// t26 — '"Why did I say that? Why am I like this?"'  Milo says it
registerShot('t26', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.7, x: -360, y: -220 }, { lamp: 0 })); veil(g, '#05060f', 0.45);
  const M = mood('night'), r = V(290, 320) * (1 + 0.04 * t), fx = E.W * 0.48, fy = E.H * 0.6, g0 = info.shot.start;
  const talk = talkAmount(info.globalT, g0, g0 + info.dur);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: t < 1.2 ? 'sad' : 'cry', face: { brows: 'angry' }, talk, rimColor: M.rim, rimSide: 1, tilt: -0.05 + 0.03 * Math.sin(t) }); faceAcc(g, fx, fy, r, MACC, MCOL);
  if (talk > 0) FX.rings(g, fx, fy, t, { count: 3, r0: r * 1.1, r1: r * 1.6, color: '#cfe0ff', a: 0.3 });
} });

// digging (t28, t29)
function digScene(g, t, info, deep) {
  const tilt = deep ? ease.inOut(prog(t, 0.1, info.dur)) : 0, depth = deep ? lerp(160, 900, tilt) : 60 + 100 * ease.inOut(t / info.dur);
  const cam = camOn(E.W / 2 + 40, GYv() - 40 + tilt * 800, deep ? lerp(1.9, 1.15, tilt) : 1.9 + 0.06 * t);
  const { M, GY } = field(g, t, cam);
  layer(g, cam, 1, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 1400, ['#1b1f36', '#0d0f1c', '#05060c']); g.fillRect(-E.W, GY, E.W * 3, E.H * 3);
    for (let l = 1; l < 6; l++) { g.fillStyle = alpha('#2a2f4a', 0.4); g.fillRect(-E.W, GY + l * 180, E.W * 3, 3); }
    const hx = E.W / 2, hw = 220; g.fillStyle = '#020306'; g.fillRect(hx - hw / 2, GY, hw, depth);
    poly(g, [[hx + hw / 2 + 20, GY], [hx + hw / 2 + 120 + depth * 0.15, GY], [hx + hw / 2 + 70, GY - 40 - depth * 0.08]], '#232842');
    const my = GY + Math.max(0, depth - 10), dig = Math.sin(t * 5);
    const pose = { ...POSES.crouch, hF: [40 + dig * 14, -70 + dig * 20], eF: [30, -96], hB: [24 + dig * 14, -40 + dig * 20], eB: [18, -80] };
    milo(g, { x: hx - 20, y: my, s: 1.15, facing: 1, pose, expr: deep ? 'sad' : 'determined', look: [0.6, 0.8], rim: rimOf(M.rim, [0, -1]) });
    const h = [hx - 20 + (40 + dig * 14) * 1.15, my + (-70 + dig * 20) * 1.15];
    seg(g, [[h[0] - 60, h[1] - 90], [h[0] + 50, h[1] + 70]], 8, '#8a6a4a'); poly(g, [[h[0] + 40, h[1] + 60], [h[0] + 86, h[1] + 80], [h[0] + 60, h[1] + 116], [h[0] + 28, h[1] + 96]], '#9aa6c8');
    text(g, 'WHY', h[0] - 4, h[1] - 10, { size: 22, color: S().ui.gold, font: FONTS.ui, weight: 900 });
    for (let i = 0; i < 4; i++) { const ph = (t * 1.3 + i / 4) % 1; circle(g, hx + 80 + ph * 160, my - 60 - Math.sin(ph * Math.PI) * (depth * 0.4 + 80), 8, '#3a3f5a'); }
  });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
}
registerShot('t28', { draw(g, t, info) { digScene(g, t, info, false); } });
registerShot('t29', { draw(g, t, info) { digScene(g, t, info, true); const td = wt('deeper', info, 2.0);
  text(g, 'DEEPER', E.W / 2, E.H * 0.2, { size: 60, color: S().ui.accent, spacing: 8, glow: 16, glowColor: alpha(S().ui.accent, 0.6), alpha: ease.out(prog(t, td, td + 0.3)) }); } });
