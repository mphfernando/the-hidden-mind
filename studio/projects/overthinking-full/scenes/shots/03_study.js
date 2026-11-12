// shots/03_study.js — the researchers (s10, s13, s15), the finding (s16), the bus stop (s17).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, wordTime, seg, circle, ring, rr, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, posesAt, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { study, studyGround } from '../sets/study.js';
import { street, streetGround } from '../sets/street.js';
import { thoughtCloud } from '../sets/motifs.js';
import { KILL, GIL, EXTRA } from '../cast.js';

const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.3) ?? info.shot.start + fb) - info.shot.start;
const camOn = (px, py, z, o = {}) => ({ z, x: px - E.W / 2, y: py - E.H / 2, ...o });
const rimWin = () => ({ color: mood('dusk').rim, dir: [1, -0.4], w: 4 });

function researchers(g, t, o = {}) {
  const GY = studyGround(), s = V(1.35, 1.5), kx = E.W / 2 - V(420, 260), gx = E.W / 2 - V(40, 60);
  drawFigure(g, { x: kx, y: GY, s, facing: 1, outfit: KILL, pose: breathe(o.kPose || POSES.stand, t, 1, 1), expr: o.kExpr || 'thinking', rim: rimWin(), blink: (t % 3.3) > 3.2 });
  drawFigure(g, { x: gx, y: GY, s, facing: -1, outfit: GIL, pose: breathe(o.gPose || POSES.crossArms, t, 1, 5), expr: o.gExpr || 'neutral', rim: rimWin(), blink: (t % 2.9) > 2.8 });
  return { kx, gx, GY, s };
}

// s10 — "Psychologists have studied this loop for decades."
registerShot('s10', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 160 + 40 * k, studyGround() - 330, 1.12 + 0.06 * k);
  study(g, t, cam, { flip: 3.2 * (1 - ease.out(prog(t, 1.8, 2.4))) });
  layer(g, cam, 1, (g) => researchers(g, t, { kPose: posesAt(t, [[0, POSES.stand], [0.5, POSES.pointUp]]), kExpr: 'explain', gPose: POSES.think, gExpr: 'thinking' }));
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.3 });
} });

// s13 — "In 2010, Harvard researchers Matthew Killingsworth and Daniel Gilbert"
registerShot('s13', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 230, studyGround() - 300, 1.3 + 0.05 * k);
  study(g, t, cam, {});
  const tY = wt('2010', info, 0.3), tH = wt('harvard', info, 0.7), tK = wt('killingsworth', info, 2.2), tG = wt('gilbert', info, 3.5);
  let pos;
  layer(g, cam, 1, (g) => { pos = researchers(g, t, { kPose: posesAt(t, [[0, POSES.stand], [tK, POSES.wave]]), kExpr: t > tK ? 'smile' : 'neutral', gPose: posesAt(t, [[0, POSES.crossArms], [tG, POSES.wave]]), gExpr: t > tG ? 'smile' : 'neutral' }); });
  UI.readout(g, { label: 'YEAR', value: '2010', x: E.W - V(380, 330), y: V(150, 260), a: ease.out(prog(t, tY - 0.1, tY + 0.25)) });
  text(g, 'HARVARD', E.W - V(380, 330), V(210, 320), { size: 30, color: alpha(S().ui.cream, 0.85), font: FONTS.ui, weight: 900, align: 'left', spacing: 4, alpha: ease.out(prog(t, tH - 0.1, tH + 0.25)) });
  // name callouts above each head (screen space: map from character plane)
  const toScr = (x, y) => [(x - E.W / 2 - cam.x) * cam.z + E.W / 2, (y - E.H / 2 - cam.y) * cam.z + E.H / 2];
  const hk = toScr(pos.kx, pos.GY - 230 * pos.s), hg = toScr(pos.gx, pos.GY - 230 * pos.s);
  UI.callout(g, t, { at: hk, to: [hk[0] - 60, hk[1] - 150], str: 'M. KILLINGSWORTH', start: tK - 0.1 });
  UI.callout(g, t, { at: hg, to: [hg[0] + 60, hg[1] - 150], str: 'D. GILBERT', start: tG - 0.1 });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// s15 — "Their finding?"  giant face, researcher leans in
registerShot('s15', { draw(g, t, info) {
  blurLayer(g, 14, (g) => study(g, t, camOn(E.W / 2 + 200, studyGround() - 500, 1.7), {})); veil(g, '#120a10', 0.35);
  const M = mood('dusk'), r = V(290, 320) * (1 + 0.06 * t);
  bigFace(g, E.W / 2 - V(120, 0), E.H * V(0.62, 0.56), r, { outfit: KILL, expr: 'thinking', look: [0.5, -0.2], rimColor: M.rim, rimSide: 1, tilt: 0.05 * t });
} });

// s16 — "People's minds were wandering almost half the time."  ring fills to 47%
registerShot('s16', { draw(g, t, info) {
  const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]);
  const tw = wt('wandering', info, 1.3), th = wt('half', info, 2.25);
  const p = ease.inOut(prog(t, tw - 0.2, th + 0.3)), v = 46.9 * p;
  const cx = E.W / 2, cy = E.H * 0.47, R = V(250, 280), gold = S().ui.gold;
  const z = 1 + 0.04 * t; g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  ring(g, cx, cy, R, 34, alpha(S().ui.blueprint, 0.15));
  g.strokeStyle = gold; g.lineWidth = 34; g.lineCap = 'round'; g.beginPath(); g.arc(cx, cy, R, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * (v / 100)); g.stroke();
  const ea = -Math.PI / 2 + Math.PI * 2 * (v / 100); glow(g, cx + Math.cos(ea) * R, cy + Math.sin(ea) * R, 90, gold, 0.6 * clamp(p * 4));
  text(g, Math.round(v) + '%', cx, cy - 10, { size: V(150, 160), color: gold, font: FONTS.ui, weight: 900, glow: 24, glowColor: alpha(gold, 0.5) });
  text(g, 'OF THE TIME', cx, cy + 90, { size: 32, color: alpha(S().ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 4 });
  g.restore();
  text(g, 'MINDS WANDERING', cx, V(120, 300), { size: V(54, 60), color: S().ui.cream, spacing: 4, alpha: ease.out(prog(t, 0.1, 0.5)) });
  // a tiny figure with a drifting thought cloud
  thoughtCloud(g, cx + R + V(220, 0), cy - 120 + Math.sin(t * 2) * 10, 160, 80, { a: 0.85 * ease.out(prog(t, 0.5, 0.9)), tail: [cx + R + V(170, 0), cy + 40] });
  drawFigure(g, { x: cx + R + V(150, 0), y: cy + 190, s: 0.8, facing: -1, outfit: EXTRA, pose: POSES.relaxed, expr: 'thinking', rim: { color: gold, dir: [-1, -0.5] }, alpha: ease.out(prog(t, 0.4, 0.8)) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });

// s17 — "And when their minds wandered, they tended to be less happy."  bus stop
registerShot('s17', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 20 * k, streetGround() - 290, 1.32 + 0.06 * k);
  const { M, GY } = street(g, t, cam);
  const tw = wt('wandered', info, 1.2), tl = wt('less', info, 2.6);
  const people = [[E.W / 2 - 230, 1, 'phone', 2], [E.W / 2 - 20, 1, 'relaxed', 7], [E.W / 2 + 190, -1, 'crossArms', 11]];
  layer(g, cam, 1, (g) => {
    people.forEach(([x, f, p, seed], i) => {
      const sad = ease.inOut(prog(t, tl + i * 0.12, tl + 0.4 + i * 0.12));
      drawFigure(g, { x, y: GY, s: 1.25, facing: f, outfit: EXTRA, pose: breathe(sad > 0.5 ? POSES.sad : POSES[p], t, 1, seed), prop: p === 'phone' ? 'phone' : null, expr: sad > 0.5 ? 'sad' : 'smile', rim: { color: M.practical, dir: [1, -0.3], w: 4 }, blink: (t % (2.7 + i * 0.4)) > 2.6 + i * 0.4 });
      const cp = ease.out(prog(t, tw - 0.3 + i * 0.15, tw + 0.3 + i * 0.15)), dark = ease.inOut(prog(t, tl - 0.2, tl + 0.5));
      thoughtCloud(g, x + f * 50, GY - 360 - cp * 40 - Math.sin(t * 2 + i) * 6, 150, 76, { a: 0.85 * cp, scale: cp, fill: mix(S().ui.cream, '#5a5f78', dark), tail: [x + f * 10, GY - 300] });
    });
  });
  FX.dust(g, t, { count: 30, color: '#ffd59a', a: 0.25 });
} });
