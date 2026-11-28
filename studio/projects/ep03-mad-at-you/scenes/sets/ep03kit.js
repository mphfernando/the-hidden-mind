// sets/ep03kit.js — ep03 helpers: cast wrappers, Milo on the bed with his phone, researchers, cards, step cards.
import { E, V, S, mood, layer, ease, prog, clamp, lerp, rr, seg, circle, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, breathe, posesAt } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { drawChar } from '../accessories.js';
import { bedroom, bedGround, BED } from './bedroom.js';
import { study, studyGround } from './study.js';
import { camOn, toScr } from './kit2.js';
import { fearShadow } from './motifs.js';
import { YOU, MACC, MCOL, JUNO, SAGE, SACC, SCOL, ADA, AACC, ACOL } from '../cast.js';

export const rimOf = (c, dir = [-0.6, -0.8]) => ({ color: c, dir, w: 4 });
export const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);
export const juno = (g, o) => drawChar(g, { outfit: JUNO, ...o }, ['backpack'], { backpack: '#c0563f' });
export const junoHome = (g, o) => drawChar(g, { outfit: JUNO, ...o }, [], {});
export const sage = (g, o) => drawChar(g, { outfit: SAGE, ...o }, SACC, SCOL);
export const ada = (g, o) => drawChar(g, { outfit: ADA, ...o }, AACC, ACOL);
export const WORRY = { brows: 'angry' };
// sitting with the phone held up at chest height
export const SIT_PHONE = { ...POSES.sit, eF: [20, -112], hF: [34, -138], eB: [12, -112], hB: [28, -134] };
export const SIT_SLUMP = { ...POSES.sit, head: [12, -168], sh: [6, -140], eF: [22, -104], hF: [40, -86], eB: [14, -104], hB: [34, -86] };
// generic researchers (no likeness), named only by callouts
export const R1 = { top: 'labcoat', head: 'none', face: 'glasses' };
export const R2 = { top: 'suit', color: '#4a5a6e', head: 'spiky', legs: '#2c3040' };
export const R3 = { top: 'labcoat', head: 'bun' };
export const R4 = { top: 'tshirt', color: '#5a6a7e', head: 'none', face: 'glasses', legs: '#2c3040' };
export const R5 = { top: 'suit', color: '#6a5a7e', head: 'ponytail', legs: '#2c3040' };

export const MILO_X = () => BED().x + BED().w - 80;
// bedroom with Milo sitting on the bed edge. o: {pose, expr, phone, shadow:{h, eyes, grow, x}, lamp}
export function miloBed(g, t, cam, o = {}) {
  const { GY, M } = bedroom(g, t, cam, { lamp: o.lamp ?? 1 });
  const x = MILO_X(), s = 1.3;
  layer(g, cam, 0.95, (g) => { if (o.shadow) fearShadow(g, o.shadow.x ?? x + 260, GY, o.shadow.h ?? 620, t, { eyes: o.shadow.eyes ?? 0, grow: o.shadow.grow ?? 1 }); });
  layer(g, cam, 1, (g) => { milo(g, { x, y: GY, s, facing: o.facing ?? 1, pose: breathe(o.pose || SIT_PHONE, t, 1, 2), prop: o.phone === false ? null : 'phone', expr: o.expr || 'happy', face: o.face, look: o.look ?? [0.6, 0.5], rim: rimOf(M.rim, [-0.7, -0.7]), shadow: false, blink: (t % 3.3) > 3.2 });
    if (o.phone !== false) glow(g, x + 44 * s, GY - 138 * s, 90, '#9fd8ff', 0.35); o.extra?.(g, GY, M, x, s); });
  return { GY, M, head: [x + 4 * s, GY - 180 * s], x, s };
}
// researchers in the study with name callouts at their spoken names
export function researchers(g, t, info, people, o = {}) {
  const k = ease.inOut(t / info.dur), GY = studyGround(), cam = camOn(E.W / 2 - 120 + 40 * k, GY - 300, (o.z || 1.3) + 0.05 * k);
  const { M } = study(g, t, cam, {});
  layer(g, cam, 1, (g) => people.forEach((p, i) => drawChar(g, { x: p.x, y: GY, s: 1.4, facing: p.facing ?? (i ? -1 : 1), outfit: p.outfit, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3 + i * 0.4, p.pose || POSES.explain]]), t, 1, i * 3), prop: p.prop, expr: p.expr || 'smile', rim: rimOf(M.rim, [1, -0.4]) }, [], {})));
  people.forEach((p, i) => { const h = toScr(cam, p.x, GY - 236 * 1.4); nameTag(g, t, p.at - 0.1, h, [h[0] + (p.dx ?? 0), h[1] - (p.dy ?? 150)], p.name); });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
  return { cam, M };
}
// dark pill name tag on a leader line (readable over bright sets)
export function nameTag(g, t, at, from, to, str) { const p = ease.out(prog(t, at, at + 0.4)); if (p <= 0) return; const ui = S().ui;
  circle(g, from[0], from[1], 6, ui.cream); seg(g, [from, [lerp(from[0], to[0], p), lerp(from[1], to[1] + 30, p)]], 3, alpha(ui.cream, 0.8));
  const w = str.length * 22 + 60; g.save(); g.globalAlpha *= clamp((p - 0.4) / 0.6); rr(g, to[0] - w / 2, to[1] - 30, w, 60, 30); g.fillStyle = 'rgba(8,20,30,.92)'; g.fill(); g.strokeStyle = alpha(ui.accent, 0.7); g.lineWidth = 3; g.stroke();
  text(g, str, to[0], to[1] + 2, { size: 34, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 1.5 }); g.restore(); }
// a rounded label card that pops in
export function card(g, t, at, x, y, w, h, str, o = {}) {
  const p = ease.outBack(prog(t, at - 0.05, at + 0.25)); if (p <= 0) return 0;
  const { fill = '#16203a', line = S().ui.gold, color = S().ui.cream, size = 44, rot = 0, cross = 0, sub = null } = o;
  g.save(); g.translate(x, y); g.scale(p, p); g.rotate(rot);
  rr(g, -w / 2, -h / 2, w, h, 26); g.fillStyle = fill; g.fill(); g.strokeStyle = line; g.lineWidth = 5; g.stroke();
  text(g, str, 0, sub ? -size * 0.35 : 4, { size, color, font: FONTS.ui, weight: 900, spacing: 3 });
  if (sub) text(g, sub, 0, size * 0.75, { size: size * 0.55, color: alpha(color, 0.75), font: FONTS.ui, weight: 900, spacing: 2 });
  if (cross > 0) { const c = ease.out(cross); seg(g, [[-w * 0.42, -h * 0.3], [lerp(-w * 0.42, w * 0.42, c), lerp(-h * 0.3, h * 0.3, c)]], 10, S().ui.accent); }
  g.restore(); return p;
}
// numbered step header ("1  NOTICE THE MOVE")
export function stepCard(g, t, n, str, o = {}) { const X = o.x ?? E.W / 2;
  const p = ease.outBack(prog(t, o.at ?? 0.05, (o.at ?? 0.05) + 0.3)); if (p <= 0) return;
  const y = o.y ?? V(170, 300), ui = S().ui; g.save(); g.translate(X, y); g.scale(p, p);
  const w = Math.max(560, str.length * 34 + 220); rr(g, -w / 2, -64, w, 128, 64); g.fillStyle = 'rgba(10,30,44,.92)'; g.fill(); g.strokeStyle = alpha(ui.accent, 0.6); g.lineWidth = 4; g.stroke();
  circle(g, -w / 2 + 64, 0, 44, ui.accent); text(g, String(n), -w / 2 + 64, 4, { size: 58, color: '#06121a', font: FONTS.ui, weight: 900 });
  text(g, str, 30, 4, { size: 52, color: ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore();
}
export const zoomIn = (g, t, k = 0.05) => { const z = 1 + k * t; g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };
