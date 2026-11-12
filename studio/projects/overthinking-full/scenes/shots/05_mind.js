// shots/05_mind.js — part 2a: worry is words, the shield, the trap (t01-t16).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { study, studyGround } from '../sets/study.js';
import { street, streetGround } from '../sets/street.js';
import { bedroom, bedGround, BED } from '../sets/bedroom.js';
import { thoughtCloud, speechBubble, fearShadow, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, voidStage, brainIcon, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL, VEX, VACC, VCOL, BORK } from '../cast.js';

const WORRY = { brows: 'angry' };
const rimOf = (c, dir = [-0.6, -0.8]) => ({ color: c, dir, w: 4 });
const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);

// t01 — "In the late 1980s and '90s,"
registerShot('t01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 200 + 60 * k, studyGround() - 330, 1.08 + 0.05 * k);
  const { M } = study(g, t, cam, { flip: 2.5 });
  layer(g, cam, 1, (g) => drawChar(g, { x: E.W / 2 - 380, y: studyGround(), s: 1.4, facing: 1, outfit: BORK, pose: breathe(POSES.think, t), expr: 'thinking', rim: rimOf(M.rim, [1, -0.4]) }, [], {}));
  UI.readout(g, { label: 'LATE', value: "1980s – '90s", x: E.W - V(560, 400), y: V(160, 260), a: ease.out(prog(t, 0.2, 0.6)) });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });

// t02 — "psychologist Thomas Borkovec noticed something odd about worry."
registerShot('t02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 340, studyGround() - 260, 1.6 + 0.08 * k);
  const { M } = study(g, t, cam, {});
  const tn = wt('thomas', info, 0.4), to = wt('odd', info, 2.3), tw = wt('worry', info, 3.3);
  const hold = { ...POSES.holdFront, hF: [40, -170], eF: [26, -150], hB: [34, -168] };
  layer(g, cam, 1, (g) => {
    drawChar(g, { x: E.W / 2 - 460, y: studyGround(), s: 1.4, facing: 1, outfit: BORK, pose: breathe(posesAt(t, [[0, POSES.stand], [0.6, hold]]), t), prop: t > 0.6 ? 'paper' : null, expr: t > to ? 'surprised' : 'thinking', look: [1, -0.3], rim: rimOf(M.rim, [1, -0.4]) }, [], {});
  });
  const h = toScr(cam, E.W / 2 - 460, studyGround() - 230 * 1.4);
  UI.callout(g, t, { at: h, to: [h[0] - 40, h[1] - 140], str: 'THOMAS BORKOVEC', start: tn - 0.1 });
  if (t > tw - 0.1) UI.callout(g, t, { at: toScr(cam, E.W / 2 - 400, studyGround() - 240), to: toScr(cam, E.W / 2 - 250, studyGround() - 330), str: 'WORRY', start: tw - 0.1, color: S().ui.gold });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// t03 — "It's mostly words."
registerShot('t03', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), cx = E.W / 2, cy = E.H * 0.45, z = 1 + 0.05 * t;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  thoughtCloud(g, cx, cy, 980, 560, { fill: '#14243f', edge: alpha(c, 0.55), a: 1 });
  const chips = ['WHAT IF', 'MAYBE', 'SHOULD I', 'BUT', 'WHAT IF', 'IF ONLY', 'THEY THINK', 'WHY'];
  chips.forEach((s, i) => { const p = popIn(t, 0.1 + i * 0.12, 0.3); if (p <= 0) return; const x = cx - 330 + (i % 4) * 220, y = cy - 90 + Math.floor(i / 4) * 140 + Math.sin(t * 2 + i) * 6;
    g.save(); g.translate(x, y); g.scale(p, p); rr(g, -95, -32, 190, 64, 32); g.fillStyle = i % 3 ? S().ui.cream : S().ui.gold; g.fill(); text(g, s, 0, 2, { size: 28, color: '#141a2a', font: FONTS.ui, weight: 900 }); g.restore(); });
  g.restore();
  text(g, 'WORDS', cx, E.H * 0.86, { size: 54, color: S().ui.gold, spacing: 6, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, 0.6, 1.0)) });
} });

// t04 — "An inner voice."
registerShot('t04', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.7, x: -360, y: -220 }, { lamp: 0.2 })); veil(g, '#05060f', 0.45);
  const M = mood('night'), r = V(290, 320) * (1 + 0.04 * t), fx = E.W * 0.45, fy = E.H * 0.6;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'sleepy', rimColor: M.rim, rimSide: 1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  FX.rings(g, fx, fy - r * 0.3, t, { count: 4, r0: r * 0.3, r1: r * 1.5, speed: 0.8, color: '#cfe0ff', a: 0.4 });
  glow(g, fx, fy - r * 0.3, r * 0.8, '#cfe0ff', 0.25);
} });

// t05 — "What if this... what if that..."  Vex whispers into Milo's ear
registerShot('t05', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), cam = camOn(b.x + b.w - 120, GY - 320, 1.55 + 0.05 * t);
  const { M } = bedroom(g, t, cam, { lamp: 0 });
  const g0 = info.shot.start, talk = talkAmount(info.globalT, g0, g0 + info.dur);
  const tt = wt('this', info, 0.4), ta = wt('that', info, 1.4);
  layer(g, cam, 1, (g) => {
    const mx = b.x + b.w - 40;
    // Vex half in shadow, leaning toward Milo's ear
    const lean = { ...POSES.talk, head: [26, -200], sh: [12, -170], eF: [34, -150], hF: [52, -170] };
    drawChar(g, { x: mx - 170, y: GY, s: 1.3, facing: 1, outfit: VEX, pose: breathe(lean, t, 0.6, 9), expr: 'smirk', talk, rim: rimOf('#ff9a8a', [0.8, -0.5]), dim: true }, VACC, VCOL);
    milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.sit, t, 1, 2), expr: t > tt ? 'nervous' : 'worried', look: [-0.9, 0], rim: rimOf(M.rim) });
    const hx = mx + 4, hy = GY - 234;
    speechBubble(g, hx - 120, hy - 190, 280, 70, { scale: popIn(t, tt - 0.05), lines: 0, fill: alpha('#2a2436', 0.92), side: -1 });
    if (t > tt - 0.05) text(g, 'WHAT IF THIS...', hx - 120, hy - 190, { size: 26, color: '#ff9a8a', font: FONTS.ui, weight: 900, alpha: popIn(t, tt - 0.05) });
    speechBubble(g, hx + 160, hy - 260, 280, 70, { scale: popIn(t, ta - 0.05), lines: 0, fill: alpha('#2a2436', 0.92), side: -1 });
    if (t > ta - 0.05) text(g, 'WHAT IF THAT...', hx + 160, hy - 260, { size: 26, color: '#ff9a8a', font: FONTS.ui, weight: 900, alpha: popIn(t, ta - 0.05) });
  });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });

// t06 — "Very few vivid pictures."
registerShot('t06', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, z = 1 + 0.04 * t;
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const tp = wt('pictures', info, 1.2);
  [[E.W * 0.3, 'WORDS'], [E.W * 0.7, 'PICTURES']].forEach(([x, lab], i) => {
    const w = 560, h = 400, y = E.H * 0.46; rr(g, x - w / 2, y - h / 2, w, h, 20); g.strokeStyle = i ? alpha(c, 0.6) : gold; g.lineWidth = 4; g.stroke();
    text(g, lab, x, y + h / 2 + 56, { size: 44, color: i ? c : gold, font: FONTS.ui, weight: 900, spacing: 4 });
    if (!i) for (let l = 0; l < 7; l++) { const lw = (w - 100) * (0.5 + ((l * 37) % 50) / 100) * ease.out(prog(t, 0.1 + l * 0.08, 0.4 + l * 0.08)); rr(g, x - w / 2 + 50, y - h / 2 + 50 + l * 46, lw, 16, 8); g.fillStyle = alpha(gold, 0.8); g.fill(); }
    else { const a = 0.35 * (1 - ease.inOut(prog(t, tp, tp + 1))); g.save(); g.globalAlpha *= a; poly(g, [[x - 160, y + 110], [x - 40, y - 20], [x + 40, y + 60], [x + 100, y], [x + 200, y + 110]], c); circle(g, x + 120, y - 90, 34, c); g.restore();
      text(g, '?', x, y, { size: 120, color: alpha(c, 0.5 * ease.out(prog(t, tp, tp + 0.6))), weight: 700 }); }
  });
  g.restore();
} });

// t07 — "Why does that matter?"
registerShot('t07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.7, x: -300, y: -240 }, { lamp: 0.3 })); veil(g, '#05060f', 0.45);
  const M = mood('night'), r = V(290, 320) * (1 + 0.05 * t), fx = E.W * 0.52, fy = E.H * 0.6;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'confused', look: [0.5, -0.6], rimColor: M.rim, rimSide: -1, tilt: 0.08 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  text(g, '?', fx + r * 1.25, fy - r * 0.9, { size: 160, color: S().ui.gold, weight: 700, glow: 20, glowColor: alpha(S().ui.gold, 0.6), alpha: popIn(t, 0.2) });
} });

// t08 / t09 — the fear-response board
function fearBoard(g, t, info, phase) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, acc = S().ui.accent;
  const g0 = info.shot.start, draw = phase === 1 ? ease.inOut(prog(t, 0.1, 1.6)) : 1;
  const rows = [[E.H * 0.36, 'WORDS', 'words'], [E.H * 0.64, 'PICTURES', 'pic']];
  const x0 = V(200, 80), xm = V(560, 300), x1 = E.W - V(180, 80);
  text(g, 'FEAR RESPONSE', (xm + x1) / 2, E.H * 0.15, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 5, alpha: draw });
  const tPic = phase === 2 ? wt('picturing', info, 3.4) : 99, tLess = phase === 2 ? wt('less', info, 0.35) : 99;
  rows.forEach(([y, lab, kind], i) => {
    rr(g, x0, y - 60, 220, 120, 16); g.strokeStyle = i ? acc : gold; g.lineWidth = 4; g.stroke();
    if (!i) for (let l = 0; l < 3; l++) { rr(g, x0 + 30, y - 34 + l * 26, 160 - l * 30, 12, 6); g.fillStyle = gold; g.fill(); }
    else { poly(g, [[x0 + 40, y + 40], [x0 + 90, y - 20], [x0 + 130, y + 20], [x0 + 160, y - 5], [x0 + 190, y + 40]], acc); circle(g, x0 + 160, y - 30, 14, acc); }
    text(g, lab, x0 + 110, y + 92, { size: 30, color: i ? acc : gold, font: FONTS.ui, weight: 900, spacing: 3 });
    seg(g, [[x0 + 230, y], [lerp(x0 + 230, xm - 20, draw), y]], 3, alpha(c, 0.6));
    // trace
    const amp = i === 0 ? 14 : 14 + 120 * ease.out(prog(t, tPic, tPic + 0.4)), col = i ? acc : gold;
    g.strokeStyle = col; g.lineWidth = 5; g.beginPath();
    const n = Math.floor(200 * draw);
    for (let s = 0; s <= n; s++) { const u = s / 200, x = lerp(xm, x1, u), ph = t * 6 - u * 14; const beat = Math.pow(Math.max(0, Math.sin(ph)), 12); const v = beat * amp + Math.sin(ph * 3.1) * 4; s ? g.lineTo(x, y - v) : g.moveTo(x, y - v); }
    g.stroke(); if (draw > 0.95) glow(g, x1, y, 60, col, 0.5);
    if (i === 0 && t > tLess) text(g, 'LESS', x1, y - 90, { size: 40, color: gold, font: FONTS.ui, weight: 900, align: 'right', alpha: ease.out(prog(t, tLess, tLess + 0.3)) });
    if (i === 1 && t > tPic) text(g, 'MORE', x1, y - 150, { size: 40, color: acc, font: FONTS.ui, weight: 900, align: 'right', glow: 14, glowColor: alpha(acc, 0.6), alpha: ease.out(prog(t, tPic, tPic + 0.3)) });
  });
}
registerShot('t08', { draw(g, t, info) { fearBoard(g, t, info, 1); } });
registerShot('t09', { draw(g, t, info) { fearBoard(g, t, info, 2); } });

// the word-shield
function wordShield(g, cx, cy, R, t, o = {}) { const { a = 1, falling = 0, seed = 1 } = o; if (a <= 0.01) return;
  g.save(); g.globalAlpha *= a; glow(g, cx, cy, R * 1.6, S().ui.cream, 0.15); circle(g, cx, cy, R, alpha('#1a2236', 0.85)); ring(g, cx, cy, R, 8, S().ui.cream);
  for (let i = 0; i < 14; i++) { const an = (i / 14) * Math.PI * 2 + 0.2; const life = falling ? ((t * 0.7 + i * 0.37) % 1) : 1;
    const drop = falling ? Math.max(0, (life - 0.75) * 4) : 0, sc = falling ? Math.min(1, life * 6) : 1;
    speechBubble(g, cx + Math.cos(an) * R * 0.62, cy + Math.sin(an) * R * 0.62 + drop * 260, R * 0.5, R * 0.22, { scale: sc, a: 1 - drop, lines: 1 }); }
  speechBubble(g, cx, cy, R * 0.7, R * 0.32, { lines: 2 }); g.restore(); }
function shieldScene(g, t, info, o) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + (o.camX || 0), GYv() - 330, (o.z || 1.15) + 0.05 * k);
  const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 - 200 });
  layer(g, cam, 0.95, (g) => o.behind?.(g, GY));
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 - 260, s = 1.5;
    milo(g, { x: mx, y: GY, s, facing: 1, pose: breathe(o.pose || POSES.holdFront, t), expr: o.expr || 'determined', talk: o.talk || 0, rim: rimOf(S().ui.cream, [0, -1]) });
    wordShield(g, mx + 110, GY - 160 * s, 150, t, { a: o.shield ?? 1, falling: o.falling });
    o.front?.(g, GY, mx, s);
  });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
}
// t10 — "In other words... worry may work like a shield."
registerShot('t10', { draw(g, t, info) { const ts = wt('shield', info, 1.6);
  shieldScene(g, t, info, { shield: ease.outBack(prog(t, ts - 0.25, ts + 0.1)), pose: posesAt(t, [[0, POSES.stand], [ts - 0.35, POSES.holdFront]]), expr: t > ts ? 'determined' : 'nervous' });
  if (t > ts && t < ts + 0.6) FX.rings(g, E.W / 2 - 150, E.H * 0.45, t - ts, { count: 2, r0: 100, r1: 420, speed: 1.6, color: '#ffffff', a: 0.5 }); } });
// t11 — "It keeps you busy talking about the danger, so you never fully feel the fear underneath."
registerShot('t11', { draw(g, t, info) { const tu = wt('underneath', info, 4.8), g0 = info.shot.start;
  shieldScene(g, t, info, { z: 1.0, camX: 80, talk: talkAmount(info.globalT, g0, g0 + wt('danger', info, 2.2) + 0.5), expr: 'nervous',
    behind: (g, GY) => fearShadow(g, E.W / 2 + 330, GY, 560, t, { grow: lerp(0.8, 1, ease.inOut(t / info.dur)), eyes: ease.out(prog(t, tu - 0.1, tu + 0.5)) }),
    front: (g, GY, mx, s) => { for (let i = 0; i < 4; i++) { const ph = (t * 0.5 + i / 4) % 1; speechBubble(g, mx + 40 + ph * 120, GY - 330 - ph * 260, 120, 44, { a: 1 - ph, scale: 0.7 + ph * 0.3, lines: 1 }); } } });
} });
// t12 — "So if worry is a shield... why does it never seem to run out?"
registerShot('t12', { draw(g, t, info) { const tr = wt('run', info, 3.4);
  shieldScene(g, t, info, { z: 1.25, camX: -160, falling: 1, expr: 'worried' });
  text(g, '∞', E.W - V(160, 120), V(190, 300), { size: 120, color: S().ui.gold, weight: 700, glow: 20, glowColor: alpha(S().ui.gold, 0.6), alpha: ease.out(prog(t, tr - 0.2, tr + 0.2)) }); } });

// t13 — "Here's the trap."
registerShot('t13', { draw(g, t, info) {
  const snap = wt('trap', info, 0.45) + 0.1, [sx, sy] = t > snap ? shake(t, 14 * (1 - prog(t, snap, snap + 0.5)), 30) : [0, 0];
  const cam = camOn(E.W / 2 + sx, GYv() - 200 + sy, 1.6 + 0.04 * t); const { GY } = voidStage(g, t, cam, { spotC: S().ui.accent });
  layer(g, cam, 1, (g) => { const cx = E.W / 2, y = GY - 4, R = 170, close = ease.in(prog(t, snap - 0.12, snap));
    rr(g, cx - 220, y - 14, 440, 18, 9); g.fillStyle = '#2a3048'; g.fill(); circle(g, cx, y - 6, 22, '#3a4260');
    for (const s of [-1, 1]) { const a = lerp(s * 1.25, s * 0.02, close); g.save(); g.translate(cx + s * 4, y - 6); g.rotate(a);
      g.strokeStyle = '#8f9ab8'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, R, Math.PI, Math.PI * 2); g.stroke();
      for (let i = 1; i < 9; i++) { const an = Math.PI + (i / 9) * Math.PI; poly(g, [[Math.cos(an - 0.05) * R, Math.sin(an - 0.05) * R], [Math.cos(an + 0.05) * R, Math.sin(an + 0.05) * R], [Math.cos(an) * (R - 30), Math.sin(an) * (R - 30)]], '#c9d2ea'); }
      g.restore(); }
    if (t < snap) thoughtCloud(g, cx, y - 110, 150, 80, { label: 'WORRY', labelColor: '#141a2a', a: 0.95 });
    if (t > snap) { FX.rings(g, cx, y - 80, t - snap, { count: 3, r0: 60, r1: 420, speed: 1.6, color: '#ffffff', a: 0.6 * (1 - prog(t, snap, snap + 0.8)) }); FX.speedLines(g, t, { cx, cy: y - 80, count: 36, a: 0.3 * (1 - prog(t, snap, snap + 0.5)) }); }
  });
} });

// t14 — "You worry about something. It doesn't happen."
registerShot('t14', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 80 + 30 * k, streetGround() - 320, 1.5 + 0.05 * k);
  const { M, GY } = street(g, t, cam);
  const tw = wt('worry', info, 0.3), th = wt('happen', info, 1.9), gone = ease.inOut(prog(t, th - 0.1, th + 0.6));
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 - 80;
    milo(g, { x: mx, y: GY, s: 1.4, facing: 1, pose: breathe(t < th ? POSES.crossArms : POSES.shrug, t), expr: t < th ? 'worried' : 'surprised', look: [0, -1], rim: rimOf(M.practical, [1, -0.3]) });
    const cx = mx + 10, cy = GY - 520, p = ease.out(prog(t, tw - 0.1, tw + 0.4));
    if (gone < 1) { thoughtCloud(g, cx, cy, 380, 180, { fill: '#3a3f5a', a: p * (1 - gone), scale: 1 + gone * 0.3, edge: alpha('#8a96c8', 0.4 * (1 - gone)) });
      if (gone < 0.2 && p > 0.5) { g.save(); g.beginPath(); g.rect(cx - 160, cy + 50, 320, 140); g.clip(); FX.rain(g, t, { count: 20, area: [cx - 140, cy + 50, 280, 0], color: '#9fb0e0', a: 0.0 }); g.restore(); } }
    if (gone > 0) for (let i = 0; i < 14; i++) { const an = i * 0.45, d = gone * 260; circle(g, cx + Math.cos(an) * d, cy + Math.sin(an) * d * 0.5, 10 * (1 - gone), alpha('#8a96c8', 0.6 * (1 - gone))); }
  });
  FX.dust(g, t, { count: 24, color: '#ffd59a', a: 0.25 });
} });

// t15 — "And your brain quietly takes the credit."
registerShot('t15', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, cx = E.W / 2, cy = E.H * 0.52;
  const tc = wt('credit', info, 1.9), drop = ease.outBack(prog(t, tc - 0.5, tc));
  brainIcon(g, cx, cy, 190 * (1 + 0.02 * Math.sin(t * 5)), t > tc ? gold : c, 8);
  // smug face on the brain
  seg(g, [[cx - 60, cy - 10], [cx - 20, cy - 4]], 7, t > tc ? gold : c); seg(g, [[cx + 20, cy - 4], [cx + 60, cy - 10]], 7, t > tc ? gold : c);
  g.strokeStyle = t > tc ? gold : c; g.lineWidth = 7; g.beginPath(); g.moveTo(cx - 30, cy + 50); g.quadraticCurveTo(cx + 10, cy + 70, cx + 50, cy + 40); g.stroke();
  // trophy
  const ty = lerp(-200, cy - 300, drop), tx = cx;
  g.save(); g.translate(tx, ty); g.fillStyle = gold; g.beginPath(); g.moveTo(-70, -60); g.lineTo(70, -60); g.quadraticCurveTo(66, 30, 0, 44); g.quadraticCurveTo(-66, 30, -70, -60); g.fill();
  g.strokeStyle = gold; g.lineWidth = 12; for (const s of [-1, 1]) { g.beginPath(); g.arc(s * 74, -24, 26, s > 0 ? -Math.PI / 2 : Math.PI / 2, s > 0 ? Math.PI / 2 : Math.PI * 1.5); g.stroke(); }
  g.fillRect(-12, 40, 24, 40); rr(g, -50, 78, 100, 22, 6); g.fill(); g.restore();
  if (t > tc) { glow(g, tx, cy - 300, 260, gold, 0.4 * (1 - prog(t, tc, tc + 1.5)) + 0.15); for (let i = 0; i < 4; i++) FX.sparkle(g, tx + [-140, 130, -90, 160][i], cy - 300 + [-80, -60, 80, 60][i], 24 * (0.6 + 0.4 * Math.sin(t * 6 + i)), gold); }
  text(g, 'CREDIT', cx, E.H * 0.88, { size: 48, color: gold, spacing: 6, glow: 14, glowColor: alpha(gold, 0.5), alpha: ease.out(prog(t, tc, tc + 0.3)) });
} });

// t16 — "Worry gets rewarded for stopping disasters that were never coming."
registerShot('t16', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 80, GYv() - 360, 1.0 + 0.05 * k); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 - 300 });
  const tn = wt('never', info, 3.3), pass = prog(t, 0.2, 3.0);
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 - 300, s = 1.45, sign = { ...POSES.cheer, hF: [24, -270], hB: [-10, -270], eF: [20, -226], eB: [-10, -226] };
    milo(g, { x: mx, y: GY, s, facing: 1, pose: breathe(sign, t), expr: t > 2.6 ? 'smirk' : 'scared', look: [1, -1], rim: rimOf(S().ui.cream, [0, -1]) });
    rr(g, mx - 110, GY - 300 * s - 80, 220, 90, 10); g.fillStyle = S().ui.cream; g.fill(); text(g, 'WORRY', mx, GY - 300 * s - 35, { size: 44, color: '#141a2a', font: FONTS.ui, weight: 900 });
    // meteor path: far to the right, never aimed at Milo
    const P = (u) => [lerp(E.W * 0.3, E.W + 400, u), lerp(-300, GY - 40, u)];
    const [x, y] = P(ease.inOut(pass));
    if (t > tn - 0.2) { g.save(); g.setLineDash([14, 16]); g.strokeStyle = alpha(S().ui.gold, 0.7 * ease.out(prog(t, tn - 0.2, tn + 0.3))); g.lineWidth = 4; g.beginPath(); g.moveTo(...P(0)); g.lineTo(...P(1)); g.stroke(); g.restore();
      text(g, 'NEVER COMING', P(0.62)[0] + 30, P(0.62)[1] - 40, { size: 34, color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'left', alpha: ease.out(prog(t, tn, tn + 0.3)) }); }
    if (pass < 1) { for (let i = 1; i < 10; i++) { const [tx, ty] = P(ease.inOut(Math.max(0, pass - i * 0.012))); circle(g, tx, ty, 30 - i * 2.5, alpha(S().ui.accent, 0.5 - i * 0.05)); } circle(g, x, y, 34, '#3a2a30'); glow(g, x, y, 120, S().ui.accent, 0.6); }
  });
} });
