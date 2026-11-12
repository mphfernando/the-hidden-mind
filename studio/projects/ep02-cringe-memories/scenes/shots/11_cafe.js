// shots/11_cafe.js — ep02 café: the "you too" flashback, nobody noticed, fly on the wall.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cafe, cafeGround, cafeTable, flashbackTint } from '../sets/cafe.js';
import { thoughtCloud, speechBubble, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL, SAGE, SACC, SCOL, JUNO, WAITER, WACC, WCOL, EXTRA } from '../cast.js';

const CX = () => E.W / 2, TX = () => E.W / 2 - 40;
const POS = () => ({ milo: E.W / 2 - 290, juno: E.W / 2 + 200, sage: E.W / 2 + 400, waiter: E.W / 2 - 60 });
const rimW = (M) => ({ color: M.practical, dir: [0, -1], w: 4 });
function chair(g, x, GY, f, M) { g.save(); g.translate(x, 0); g.scale(f, 1); FX.chair(g, -18 * 1.35, GY, 1.35, shade(M.wall, -0.7)); g.restore(); }
// the table scene; o: {waiterPose, waiterExpr, waiterTalk, waiterX, miloExpr, miloPose, miloTalk, friends, extra}
function tableScene(g, t, cam, o = {}) {
  const { GY, M } = cafe(g, t, cam); const P = POS(), r = rimW(M);
  layer(g, cam, 0.97, (g) => { if (o.waiter !== false) drawChar(g, { x: o.waiterX ?? P.waiter, y: GY - 30, s: 1.35, facing: o.waiterFacing ?? -1, outfit: WAITER, pose: o.waiterPose || POSES.holdFront, expr: o.waiterExpr || 'smile', talk: o.waiterTalk || 0, rim: r, blink: (t % 3.1) > 3.0 }, WACC, WCOL); });
  layer(g, cam, 1, (g) => {
    chair(g, P.milo, GY, 1, M); if (o.friends !== false) { chair(g, P.juno, GY, -1, M); chair(g, P.sage, GY, -1, M); }
    cafeTable(g, TX(), GY); if (o.friends !== false) cafeTable(g, E.W / 2 + 300, GY, { plate: false });
    drawChar(g, { x: P.milo, y: GY, s: 1.35, facing: 1, outfit: YOU, pose: o.miloPose || breathe(POSES.sit, t, 1, 2), expr: o.miloExpr || 'smile', talk: o.miloTalk || 0, look: o.miloLook, rim: r, shadow: false }, MACC, MCOL);
    if (o.friends !== false) { drawChar(g, { x: P.juno, y: GY, s: 1.35, facing: -1, outfit: JUNO, pose: breathe(POSES.sit, t, 1, 4), expr: o.junoExpr || 'happy', rim: r, shadow: false }, [], {});
      drawChar(g, { x: P.sage, y: GY, s: 1.35, facing: -1, outfit: SAGE, pose: breathe(POSES.sit, t, 1, 6), prop: 'cup', expr: 'smile', rim: r, shadow: false }, SACC, SCOL); }
    o.extra?.(g, GY, M);
  });
  return { GY, M };
}
const headOf = (x, GY, s = 1.35, sit = true) => [x + 4 * s, GY - (sit ? 180 : 208) * s];

// u05 — 'The waiter said, "Enjoy your meal."'
registerShot('u05', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 180 + 30 * k, cafeGround() - 320, 1.5 + 0.05 * k), g0 = info.shot.start, te = wt('enjoy', info, 1.0);
  const serve = { ...POSES.holdFront, eF: [30, -140], hF: [56, -126] };
  tableScene(g, t, cam, { friends: false, waiterPose: serve, waiterTalk: t > te - 0.05 ? talkAmount(info.globalT, g0 + te - 0.05, g0 + info.dur) : 0, miloExpr: 'neutral', miloLook: [1, -0.6],
    extra: (g, GY) => { const h = headOf(POS().waiter, GY - 30, 1.35, false); speechBubble(g, h[0] + 30, h[1] - 120, 330, 80, { scale: popIn(t, te - 0.1), lines: 0, side: -1 }); if (t > te - 0.1) text(g, 'ENJOY YOUR MEAL!', h[0] + 30, h[1] - 120, { size: 28, color: '#2a1820', font: FONTS.ui, weight: 900, alpha: popIn(t, te - 0.1) }); } });
  flashbackTint(g); FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
} });
// u06 — "And you said..."
registerShot('u06', { draw(g, t, info) {
  const cam = camOn(POS().milo + 80, cafeGround() - 280, 2.0 + 0.06 * t);
  tableScene(g, t, cam, { friends: false, miloExpr: 'happy', miloLook: [1, -0.7], waiterPose: POSES.stand });
  flashbackTint(g);
} });
// u07 — '"You too."'
registerShot('u07', { draw(g, t, info) {
  blurLayer(g, 14, (g) => cafe(g, t, camOn(E.W / 2 - 200, cafeGround() - 400, 1.7))); veil(g, '#1a0f0a', 0.3);
  const r = V(290, 320) * (1 + 0.03 * t), fx = E.W * 0.42, fy = E.H * 0.62, g0 = info.shot.start;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'happy', talk: talkAmount(info.globalT, g0, g0 + info.dur), rimColor: '#ffcf8f', rimSide: 1, look: [0.6, -0.5] }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const p = popIn(t, 0.1, 0.25); speechBubble(g, E.W * 0.74, E.H * 0.3, 360, 130, { scale: p, lines: 0, side: -1 }); if (p > 0) text(g, 'YOU TOO!', E.W * 0.74, E.H * 0.3, { size: 60, color: '#d64a33', weight: 700, alpha: p });
  flashbackTint(g);
} });
// u08 — "That was four years ago."  FREEZE
registerShot('u08', { draw(g, t, info) {
  const cam = camOn(E.W / 2 - 120, cafeGround() - 330, 1.35 + 0.03 * t, { r: -0.02 + 0.01 * t }), tf = wt('four', info, 0.5);
  tableScene(g, 0.3, cam, { waiterPose: POSES.stand, waiterExpr: 'surprised', miloExpr: 'happy', junoExpr: 'surprised', miloLook: [1, -0.6] });
  FX.drops(g, t, { count: 30, color: '#d8e4ff', rMax: 8, drift: 3 });
  g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = 'rgba(80,120,255,.4)'; g.fillRect(0, 0, E.W, E.H); g.restore();
  UI.badge(g, { str: '4 YEARS AGO', a: ease.out(prog(t, tf - 0.1, tf + 0.3)), size: V(46, 50) });
  const x0 = V(120, 80), y0 = E.H - V(250, 600); text(g, 'CRINGE', x0, y0 - 34, { size: 28, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, align: 'left', alpha: ease.out(prog(t, 0.2, 0.5)) });
  rr(g, x0, y0, 420, 30, 15); g.fillStyle = alpha('#ffffff', 0.12); g.fill(); rr(g, x0, y0, 420 * ease.out(prog(t, 0.3, 1.0)), 30, 15); g.fillStyle = S().ui.accent; g.fill();
} });
// u09 — "The waiter has forgotten."
registerShot('u09', { draw(g, t, info) {
  const cam = camOn(E.W / 2 + 470, cafeGround() - 320, 1.5 + 0.05 * t);
  const { GY, M } = cafe(g, t, cam);
  layer(g, cam, 1, (g) => { const x = E.W / 2 + 330, wipe = { ...POSES.holdFront, hF: [50 + Math.sin(t * 6) * 16, -140], eF: [30, -146] };
    drawChar(g, { x, y: GY, s: 1.35, facing: 1, outfit: WAITER, pose: breathe(wipe, t), expr: 'neutral', look: [1, 0.3], rim: rimW(M) }, WACC, WCOL);
    thoughtCloud(g, x + 80, GY - 420, 180, 96, { scale: popIn(t, 0.2), label: '...', labelColor: '#2a1820', tail: [x + 20, GY - 300] }); });
  flashbackTint(g, 0.6);
} });
// u10 — "Everyone at the table has forgotten."
registerShot('u10', { draw(g, t, info) {
  const cam = camOn(E.W / 2 + 230, cafeGround() - 320, 1.55 + 0.05 * t);
  tableScene(g, t, cam, { waiter: false, miloExpr: 'neutral', extra: (g, GY) => {
    const lab = [['NEXT WEEK?', POS().juno], ['GOOD TEA', POS().sage]]; lab.forEach(([s, x], i) => { const h = headOf(x, GY); thoughtCloud(g, h[0] - 20, h[1] - 150, 230, 90, { scale: popIn(t, 0.2 + i * 0.3), label: s, labelColor: '#2a1820', labelSize: 24, tail: h }); }); } });
  flashbackTint(g, 0.6);
} });
// u44 — "Which means the moment you can't forget..."
registerShot('u44', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 60, cafeGround() - 340, 1.1 + 0.05 * k);
  tableScene(g, t, cam, { waiterX: E.W / 2 + 560, waiterFacing: 1, waiterPose: POSES.holdFront, miloExpr: 'worried', miloLook: [0, -1], extra: (g, GY) => {
    const h = headOf(POS().milo, GY); glow(g, h[0], h[1] - 170, 160, '#ff9a8a', 0.4); thoughtCloud(g, h[0], h[1] - 170, 210, 110, { fill: '#ff9a8a', label: 'YOU TOO!', labelColor: '#2a1820', labelSize: 30, tail: h }); } });
} });
// u45 — "most people never even noticed."
registerShot('u45', { draw(g, t, info) {
  const cam = camOn(E.W / 2 + 60, cafeGround() - 340, 1.1 + 0.03 * t), tn = wt('noticed', info, 1.3);
  tableScene(g, t, cam, { waiterX: E.W / 2 + 560, waiterFacing: 1, miloExpr: 'surprised', extra: (g, GY) => {
    [[POS().juno, true], [POS().sage, true], [E.W / 2 + 560, false]].forEach(([x, sit], i) => { const h = headOf(x, sit ? GY : GY - 30, 1.35, !sit); const p = popIn(t, 0.4 + i * 0.2);
      if (p > 0) { g.save(); g.translate(h[0], h[1] - 90); g.scale(p, p); circle(g, 0, 0, 34, alpha('#0e1a33', 0.9)); g.strokeStyle = S().ui.cream; g.lineWidth = 5; g.beginPath(); g.arc(0, -4, 16, 0.2, Math.PI - 0.2); g.stroke(); g.restore(); } }); } });
  text(g, 'NOBODY NOTICED', E.W / 2, V(160, 300), { size: 54, color: S().ui.gold, weight: 700, spacing: 4, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, tn - 0.2, tn + 0.2)) });
} });
// u46 — "And the few who did?"
registerShot('u46', { draw(g, t, info) {
  const cam = camOn(E.W / 2 + 480, cafeGround() - 300, 1.8 + 0.05 * t); const { GY, M } = cafe(g, t, cam);
  layer(g, cam, 1, (g) => drawChar(g, { x: E.W / 2 + 480, y: GY, s: 1.35, facing: -1, outfit: WAITER, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, POSES.shrug]]), t), expr: 'confused', rim: rimW(M) }, WACC, WCOL));
} });
// u47 — "They've almost certainly moved on."
registerShot('u47', { draw(g, t, info) {
  const x = E.W / 2 + 300 + t * 180, cam = camOn(x + 60, cafeGround() - 300, 1.5); const { GY, M } = cafe(g, t, cam);
  layer(g, cam, 1, (g) => { drawChar(g, { x, y: GY, s: 1.35, facing: 1, outfit: WAITER, pose: walkPose(t * 2 * Math.PI * 0.9), expr: 'happy', rim: rimW(M) }, WACC, WCOL);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.8 + i / 3) % 1; text(g, '♪', x + 40 + ph * 80, GY - 300 - ph * 120, { size: 40, color: alpha(S().ui.gold, 1 - ph), weight: 700 }); }
    text(g, 'MOVED ON', x + 40, GY - 470, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.8, 1.2)) }); });
} });
// u51 — "Instead of reliving the moment from inside your own eyes, picture it from the outside."
function topDown(g, cx, cy, s, t) {   // café from the ceiling: round table, plates, heads + shoulders from above
  g.save(); g.translate(cx, cy); g.scale(s, s);
  rr(g, -560, -360, 1120, 720, 30); g.fillStyle = '#3a2a2e'; g.fill(); for (let x = -560; x < 560; x += 80) for (let y = -360; y < 360; y += 80) if (((x + y) / 80) % 2 === 0) { g.fillStyle = alpha('#000', 0.1); g.fillRect(x, y, 80, 80); }
  circle(g, 0, 0, 150, '#241a1c'); circle(g, -50, -10, 40, '#efe8dc'); circle(g, -50, -10, 24, '#c0703a'); circle(g, 60, 40, 16, '#e8e0d4');
  const ppl = [[-230, 0, '#8a5ad6'], [200, -110, '#3a6ea5'], [210, 120, '#e9e4da'], [-60, -230, '#1e1e28']];
  for (const [x, y, c] of ppl) { g.fillStyle = c; g.beginPath(); g.ellipse(x, y, 60, 34, Math.atan2(-y, -x) + Math.PI / 2, 0, Math.PI * 2); g.fill(); circle(g, x, y, 30, '#0c0e18'); }
  g.restore();
}
registerShot('u51', { draw(g, t, info) {
  const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]);
  const to = wt('outside', info, 4.2), split = ease.inOut(prog(t, to - 0.6, to + 0.2)), mid = lerp(E.W, E.W / 2, split);
  g.save(); g.beginPath(); g.rect(0, 0, mid, E.H); g.clip();
  g.fillStyle = '#2a1a16'; g.fillRect(0, 0, E.W, E.H); bigFace(g, mid / 2 + 40, E.H * 0.62, 300, { outfit: WAITER, expr: 'surprised', rimColor: '#ffcf8f', rimSide: -1 });
  speechBubble(g, mid / 2 - 120, E.H * 0.2, 340, 100, { lines: 0 }); text(g, 'YOU TOO!', mid / 2 - 120, E.H * 0.2, { size: 46, color: '#d64a33', weight: 700 }); flashbackTint(g);
  text(g, 'INSIDE', 70, 80, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 6, align: 'left' }); g.restore();
  if (split > 0) { g.save(); g.beginPath(); g.rect(mid, 0, E.W - mid, E.H); g.clip(); g.fillStyle = '#0d1530'; g.fillRect(mid, 0, E.W, E.H);
    topDown(g, mid + (E.W - mid) / 2, E.H * 0.52, 0.42, t); text(g, 'OUTSIDE', mid + 60, 80, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 6, align: 'left' }); g.restore();
    seg(g, [[mid, 0], [mid, E.H]], 6, S().ui.cream); }
} });
// u52 — "Like a fly on the wall, watching a stranger."
registerShot('u52', { draw(g, t, info) {
  const M = mood('void'); backdrop(g, ['#0a0d18', '#121a30']); const z = 1.0 + 0.06 * t;
  topDown(g, E.W / 2, E.H * 0.55, z, t); flashbackTint(g, 0.4);
  const fx = E.W * 0.78 + Math.sin(t * 3) * 40, fy = E.H * 0.24 + Math.sin(t * 7) * 14;
  circle(g, fx, fy, 14, '#0c0e18'); g.fillStyle = alpha('#e6f0ff', 0.6); for (const s of [-1, 1]) { g.beginPath(); g.ellipse(fx + s * 12, fy - 10, 9, 18 * Math.abs(Math.sin(t * 60)) + 2, s * 0.5, 0, Math.PI * 2); g.fill(); }
  text(g, 'FLY ON THE WALL', E.W / 2, V(110, 260), { size: 52, color: S().ui.gold, weight: 700, spacing: 4, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, 0.3, 0.7)) });
  const ts = wt('stranger', info, 1.9); if (t > ts - 0.1) UI.callout(g, t, { at: [E.W / 2 - 230 * z, E.H * 0.55], to: [E.W / 2 - 360, E.H * 0.82], str: 'A STRANGER', start: ts - 0.1 });
} });
