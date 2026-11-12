// shots/10_night.js — ep02 bedroom shots: 2 AM, the replay, why at night, the way out.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, ease, prog, key, clamp, lerp, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround, BED, DESK } from '../sets/bedroom.js';
import { thoughtCloud, fearShadow, popIn } from '../sets/motifs.js';
import { memoryFrame } from '../sets/memory.js';
import { wt, camOn, toScr, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL, SAGE, SACC, SCOL } from '../cast.js';

const NIGHT = () => mood('night');
const rimMoon = () => ({ color: NIGHT().rim, dir: [-0.6, -0.8], w: 4 });
const WORRY = { brows: 'angry' };
const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);
const sage = (g, o) => drawChar(g, { outfit: SAGE, ...o }, SACC, SCOL);

function lying(g, t, s = 1.15, o = {}) {
  const GY = bedGround(), b = BED(), hipX = b.x + 66 + 108 * s, oy = GY - 112 + 100 * s;
  drawChar(g, { x: hipX, y: oy, s, facing: 1, rot: -Math.PI / 2, outfit: YOU, pose: breathe(POSES.lie, t, 0.6, 4), expr: o.expr || 'worried', blink: o.blink ?? ((t % 3.4) > 3.3), rim: rimMoon(), shadow: false, look: o.look }, [], {});
  const hipY = oy - 100 * s; const head = [hipX - 108 * s, hipY - 3 * s];
  const bx = b.x + 120 + 90 * s; rr(g, bx, GY - 118, b.w - 120 - 90 * s, 50, 18); g.fillStyle = shade('#3b3f78', -0.05 + (o.hide ? 0.05 : 0)); g.fill();
  if (o.hide) { g.fillStyle = shade('#3b3f78', 0.02); g.beginPath(); g.ellipse(head[0] + 30, head[1] + 10, 70, 46, 0, 0, Math.PI * 2); g.fill(); }
  return { head };
}
function clock(g, x, y, str = '2:00', a = 1) { rr(g, x - 70, y - 34, 140, 68, 12); g.fillStyle = '#0a0d18'; g.fill(); glow(g, x, y, 120, '#6ff0ff', 0.35 * a);
  text(g, str, x - 6, y + 2, { size: 40, color: alpha('#6ff0ff', a), font: FONTS.ui, weight: 900, glow: 12, glowColor: 'rgba(110,240,255,.7)' }); text(g, 'AM', x + 50, y + 10, { size: 16, color: alpha('#6ff0ff', a), font: FONTS.ui, weight: 900 }); }
const nightstand = (g) => { const GY = bedGround(), x = BED().x + BED().w + 70; rr(g, x - 60, GY - 120, 120, 120, 6); g.fillStyle = shade(NIGHT().wall, -0.65); g.fill(); return [x, GY - 160]; };

// u01 — "It's 2 AM."
registerShot('u01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(560, bedGround() - 330, 1.2 + 0.06 * k);
  bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 1, (g) => { lying(g, t, 1.15, { expr: 'sleepy', blink: true }); const c = nightstand(g); clock(g, c[0], c[1]); });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });
// u02 — "You're finally drifting off to sleep."
registerShot('u02', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(400 + 20 * k, bedGround() - 220, 1.9 + 0.1 * k);
  bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { expr: 'sleepy', blink: true }); const c = nightstand(g); clock(g, c[0], c[1]);
    for (let i = 0; i < 3; i++) { const ph = (t * 0.5 + i / 3) % 1; text(g, 'z', L.head[0] + 30 + ph * 60, L.head[1] - 60 - ph * 120, { size: 30 + i * 8, color: alpha('#cfe0ff', 0.7 * (1 - ph)), weight: 700 }); } });
} });
// u03 — "And then, out of nowhere,"  eyes snap open
registerShot('u03', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: -560, y: -220 }, { lamp: 0 })); veil(g, '#05060f', 0.5);
  const M = NIGHT(), snap = wt('nowhere', info, 1.2), r = V(300, 330) * (1 + 0.03 * t), fx = E.W * 0.5, fy = E.H * 0.6;
  const open = t > snap;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: open ? 'shocked' : 'sleepy', look: [0, -0.4], rimColor: M.rim, rimSide: 1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  if (open) FX.rings(g, fx, fy, t - snap, { count: 3, r0: r * 1.05, r1: r * 1.8, speed: 1.8, color: '#ffffff', a: 0.5 * (1 - prog(t, snap, snap + 0.8)) });
} });
// u04 — "your brain plays it."  projector beam to the wall
function projector(g, t, head, p, sx, sy, w, h) {
  if (p <= 0) return;
  g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = alpha('#ffd59a', 0.12 * p); g.beginPath(); g.moveTo(head[0], head[1]); g.lineTo(sx - w / 2, sy + h / 2); g.lineTo(sx + w / 2, sy + h / 2); g.lineTo(sx + w / 2, sy - h / 2); g.lineTo(sx - w / 2, sy - h / 2); g.closePath(); g.fill(); g.restore();
  memoryFrame(g, sx, sy, w, h, t, { a: p });
}
registerShot('u04', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(500, bedGround() - 380, 1.25 + 0.05 * k);
  bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { expr: 'scared', look: [0.4, -1] }); projector(g, t, L.head, ease.out(prog(t, 0.15, 0.7)), L.head[0] + 260, L.head[1] - 360, 420, 240); });
} });
// u11 — "So why does your brain keep hitting replay?"
registerShot('u11', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: -560, y: -220 }, { lamp: 0 })); veil(g, '#05060f', 0.45);
  const M = NIGHT(), r = V(290, 320) * (1 + 0.04 * t), fx = E.W * 0.42, fy = E.H * 0.62, tr = wt('replay', info, 2.0);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'worried', face: WORRY, look: [0.7, -0.6], rimColor: M.rim, rimSide: -1, blink: (t % 2.6) > 2.5 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const p = ease.outBack(prog(t, tr - 0.2, tr + 0.2)); if (p > 0) { g.save(); g.translate(E.W * 0.78, E.H * 0.32); g.scale(p, p); g.rotate(-t * 3); ring(g, 0, 0, 90, 10, '#ff6f61'); poly(g, [[60, -70], [100, -60], [80, -24]], '#ff6f61'); g.restore(); text(g, 'REPLAY', E.W * 0.78, E.H * 0.32 + 140, { size: 40, color: '#ff6f61', font: FONTS.ui, weight: 900, spacing: 4, alpha: p }); }
} });
// u12 — "And why does it always pick the most embarrassing moments, at the worst possible time?"
registerShot('u12', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(520, bedGround() - 360, 1.25 + 0.05 * k);
  bedroom(g, t, cam, { lamp: 0 }); const te = wt('embarrassing', info, 2.3), tw = wt('worst', info, 3.9);
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { hide: true, expr: 'scared' });
    const labels = ['TRIPPED ON STAGE', 'WAVED BACK AT NOBODY', "CALLED TEACHER 'MOM'", 'YOU TOO!'];
    labels.forEach((s, i) => { const p = popIn(t, te - 0.3 + i * 0.35, 0.35); thoughtCloud(g, L.head[0] + 160 + (i % 2) * 280, L.head[1] - 200 - i * 95, 300, 90, { scale: p, label: s, labelColor: '#2a1830', labelSize: 22, fill: i === 3 ? '#ff9a8a' : S().ui.cream }); });
    const c = nightstand(g); clock(g, c[0], c[1], '2:00', 0.6 + 0.4 * ease.out(prog(t, tw, tw + 0.3))); if (t > tw) glow(g, c[0], c[1], 200, '#6ff0ff', 0.3 * ease.out(prog(t, tw, tw + 0.3))); });
} });
// u30 — "But when you lie down in the dark,"
registerShot('u30', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(560, bedGround() - 330, 1.2 + 0.05 * k), off = ease.out(prog(t, 0.5, 0.6));
  bedroom(g, t, cam, { lamp: 1 - off });
  layer(g, cam, 1, (g) => { lying(g, t, 1.15, { expr: 'neutral' }); const c = nightstand(g); clock(g, c[0], c[1], '11:48'); });
} });
// u31 — "all of that goes quiet."  the Shadow sits at the end of the bed
registerShot('u31', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(520, bedGround() - 330, 1.3 + 0.06 * k);
  const { GY } = bedroom(g, t, cam, { lamp: 0 }); const b = BED();
  layer(g, cam, 0.98, (g) => fearShadow(g, b.x + b.w - 40, GY - 60, 380, t, { grow: ease.out(prog(t, 0.2, 1.4)), eyes: ease.out(prog(t, 1.0, 1.6)) }));
  layer(g, cam, 1, (g) => lying(g, t, 1.15, { expr: 'neutral', look: [1, -0.3] }));
} });
// u32 — "And a quiet mind wanders."
registerShot('u32', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(560, bedGround() - 400, 1.15 + 0.05 * k);
  bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { expr: 'thinking', look: [0.6, -1] }); const u = ease.inOut(prog(t, 0.2, info.dur));
    const x = L.head[0] + 120 + u * 520 + Math.sin(t * 2) * 30, y = L.head[1] - 140 - u * 260 + Math.cos(t * 1.6) * 20;
    thoughtCloud(g, x, y, 200, 110, { scale: popIn(t, 0.1), tail: [L.head[0] + 20, L.head[1] - 40] }); });
} });
// u33 — "It drifts back to unfinished business... and embarrassment feels like unfinished business."
registerShot('u33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(800, bedGround() - 470, 1.35 + 0.08 * k);
  bedroom(g, t, cam, { lamp: 0 }); const tu = wt('unfinished', info, 1.2), te = wt('embarrassment', info, 2.9);
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { expr: 'worried', look: [1, -1] });
    const x = L.head[0] + 640, y = L.head[1] - 400; thoughtCloud(g, x, y, 560, 330, { tail: [L.head[0] + 30, L.head[1] - 50] });
    memoryFrame(g, x, y, 330, 190, t, { a: ease.out(prog(t, 0.2, 0.8)), label: false });
    if (t > tu) { const p = ease.out(prog(t, te - 0.1, te + 0.3)); text(g, 'UNFINISHED BUSINESS', x, y + 240, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: Math.max(ease.out(prog(t, tu, tu + 0.3)) * 0.5, p), glow: 12, glowColor: alpha(S().ui.gold, 0.5 * p) }); } });
} });
// u34 — "Being tired can make it worse."
registerShot('u34', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: -560, y: -220 }, { lamp: 0 })); veil(g, '#05060f', 0.45);
  const M = NIGHT(), r = V(270, 300), fx = E.W * 0.4, fy = E.H * 0.62;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'sleepy', face: { eyes: 'dot', brows: 'angry', mouth: 'flat' }, rimColor: M.rim, rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const bx = E.W * 0.74, by = E.H * 0.34, p = popIn(t, 0.2), lvl = lerp(0.35, 0.1, ease.inOut(prog(t, 0.4, 1.6)));
  g.save(); g.translate(bx, by); g.scale(p, p); rr(g, -120, -60, 240, 120, 20); g.strokeStyle = '#ff6f61'; g.lineWidth = 10; g.stroke(); rr(g, 122, -24, 24, 48, 6); g.fillStyle = '#ff6f61'; g.fill();
  rr(g, -104, -44, 208 * lvl, 88, 10); g.fill(); g.restore();
  text(g, 'TIRED', bx, by + 110, { size: 40, color: '#ff6f61', font: FONTS.ui, weight: 900, spacing: 4, alpha: p });
} });
// u48 — "The only person still replaying it... is you."
registerShot('u48', { draw(g, t, info) {
  const ty = wt('you', info, 2.6), push = ease.inOut(prog(t, ty - 0.4, ty + 0.4));
  const cam = camOn(lerp(540, 330, push), bedGround() - lerp(420, 230, push), lerp(1.2, 2.3, push));
  bedroom(g, t, cam, { lamp: 0 });
  layer(g, cam, 1, (g) => { const L = lying(g, t, 1.15, { expr: t > ty ? 'surprised' : 'worried', look: [0.4, -1] }); projector(g, t, L.head, 1, L.head[0] + 260, L.head[1] - 360, 420, 240); });
} });
// u49 / u50 — Sage appears; "Try this."
function sageScene(g, t, info, finger) {
  const GY = bedGround(), b = BED(), k = ease.inOut(t / info.dur), cam = camOn(b.x + b.w + 80, GY - 300, 1.4 + 0.05 * k);
  const { M } = bedroom(g, t, cam, { lamp: 0.6 });
  layer(g, cam, 1, (g) => { const mx = b.x + b.w - 40, sx = mx + 330, a = finger ? 1 : ease.out(prog(t, 0.2, 0.9));
    g.save(); g.translate(sx + 12, 0); g.scale(-1, 1); FX.chair(g, 0, GY, 1.3, shade(M.wall, -0.6)); g.restore();
    milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.sit, t, 1, 2), expr: 'worried', look: [1, 0], rim: rimMoon() });
    sage(g, { x: sx, y: GY, s: 1.3, facing: -1, pose: breathe(finger ? { ...POSES.sit, eF: [20, -150], hF: [24, -196] } : POSES.sit, t, 1, 6), expr: 'smile', alpha: a, rim: { color: M.practical, dir: [1, -0.4], w: 4 }, blink: (t % 3) > 2.9 });
    if (!finger) { glow(g, sx, GY - 150, 260, '#2fb5a8', 0.25 * (1 - a) + 0.08); } });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
}
registerShot('u49', { draw(g, t, info) { sageScene(g, t, info, false); } });
registerShot('u50', { draw(g, t, info) { sageScene(g, t, info, true); } });
// u54 — "And try talking to yourself by name."
registerShot('u54', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), cam = camOn(b.x + b.w - 20, GY - 320, 1.6 + 0.05 * t);
  const { M } = bedroom(g, t, cam, { lamp: 0.6 }); const tn = wt('name', info, 2.2);
  layer(g, cam, 1, (g) => { const mx = b.x + b.w - 40; milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.sit, t, 1, 2), expr: 'thinking', rim: rimMoon() });
    const p = ease.outBack(prog(t, tn - 0.1, tn + 0.3)); if (p > 0) { g.save(); g.translate(mx + 14, GY - 150); g.scale(p, p); g.rotate(-0.06); rr(g, -70, -26, 140, 52, 10); g.fillStyle = '#ffffff'; g.fill(); g.fillStyle = '#d64a33'; g.fillRect(-70, -26, 140, 16); text(g, 'MILO', 0, 10, { size: 26, color: '#1a1420', font: FONTS.ui, weight: 900 }); g.restore(); } });
} });
// u55 — '"Milo, it was one sentence, four years ago."'
registerShot('u55', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, { z: 1.8, x: -380, y: -220 }, { lamp: 0.6 })); veil(g, '#05060f', 0.35);
  const M = NIGHT(), r = V(290, 320) * (1 + 0.03 * t), fx = E.W * 0.45, fy = E.H * 0.6, g0 = info.shot.start;
  bigFace(g, fx, fy, r, { outfit: YOU, expr: t < 1.6 ? 'neutral' : 'smile', talk: talkAmount(info.globalT, g0, g0 + info.dur), rimColor: '#ffcf8f', rimSide: 1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  const t1 = wt('sentence', info, 1.0), t4 = wt('four', info, 1.8);
  UI.readout(g, { label: 'ONE', value: 'SENTENCE', x: E.W * 0.72, y: E.H * 0.3, a: ease.out(prog(t, t1 - 0.2, t1 + 0.1)) });
  UI.readout(g, { label: '', value: '4 YEARS AGO', x: E.W * 0.72, y: E.H * 0.42, a: ease.out(prog(t, t4 - 0.1, t4 + 0.2)), color: S().ui.cream });
} });
// u56 — "It sounds strange, but studies suggest that stepping back like this can make your emotions easier to handle."
registerShot('u56', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), k = ease.inOut(t / info.dur), cam = camOn(b.x + b.w + 80, GY - 300, 1.35 + 0.05 * k);
  const { M } = bedroom(g, t, cam, { lamp: 0.6 }); const te = wt('easier', info, 5.4), drop = ease.inOut(prog(t, te - 1.5, te + 0.4));
  layer(g, cam, 1, (g) => { const mx = b.x + b.w - 40, sx = mx + 330;
    g.save(); g.translate(sx + 12, 0); g.scale(-1, 1); FX.chair(g, 0, GY, 1.3, shade(M.wall, -0.6)); g.restore();
    milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.sit, t, 1, 2), expr: drop > 0.5 ? 'smile' : 'neutral', look: [1, 0], rim: rimMoon() });
    sage(g, { x: sx, y: GY, s: 1.3, facing: -1, pose: breathe(POSES.sit, t, 1, 6), prop: 'cup', expr: 'smile', rim: { color: M.practical, dir: [1, -0.4], w: 4 } }); });
  const x0 = E.W * 0.62, y0 = E.H * 0.2, w = 520; text(g, 'EMOTION', x0, y0 - 40, { size: 28, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, align: 'left' });
  rr(g, x0, y0, w, 40, 20); g.fillStyle = alpha('#ffffff', 0.12); g.fill(); rr(g, x0, y0, w * lerp(0.9, 0.35, drop), 40, 20); g.fillStyle = mix('#ff6f61', '#2fb5a8', drop); g.fill();
  text(g, 'EASIER TO HANDLE', x0, y0 + 80, { size: 32, color: '#2fb5a8', font: FONTS.ui, weight: 900, spacing: 3, align: 'left', alpha: ease.out(prog(t, te, te + 0.3)) });
} });
// u58 — "It just doesn't know the danger is long gone."  dawn; the Shadow fades
registerShot('u58', { draw(g, t, info) {
  const dawn = ease.inOut(prog(t, 0.2, 2.2)), k = ease.inOut(t / info.dur), cam = camOn(700, bedGround() - 340, 1.15 + 0.05 * k);
  bedroom(g, t, cam, { mood: 'golden', lamp: 0 }); veil(g, '#070b1e', 0.62 * (1 - dawn));
  const { GY } = { GY: bedGround() }; const tg = wt('gone', info, 2.4);
  layer(g, cam, 1, (g) => { const b = BED(); drawChar(g, { x: b.x + b.w - 40, y: GY, s: 1.3, facing: 1, outfit: YOU, pose: breathe(POSES.sit, t, 1, 2), expr: dawn > 0.6 ? 'smile' : 'neutral', look: [1, -0.2], rim: { color: '#ffcf8f', dir: [-0.6, -0.8], w: 4 } }, MACC, MCOL);
    g.save(); g.globalAlpha *= 1 - ease.inOut(prog(t, tg - 0.6, tg + 0.6)); fearShadow(g, E.W / 2 + 560, GY, 520, t, { eyes: 0.6, color: 'rgba(4,6,14,.8)' }); g.restore(); });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 * dawn });
} });
