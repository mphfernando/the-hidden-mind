// sets/kit2.js — shared helpers for part 2: timing, camera, void stage, icons, stamps, card flip, field, title backdrop.
import { E, V, S, mood, layer, backdrop, ease, prog, clamp, lerp, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS, linGrad } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const wt = (w, info, fb, after = -0.3) => (wordTime(w, info.shot.start + after) ?? info.shot.start + fb) - info.shot.start;
export const camOn = (px, py, z, o = {}) => ({ z, x: px - E.W / 2, y: py - E.H / 2, ...o });
export const toScr = (cam, x, y) => [(x - E.W / 2 - cam.x) * cam.z + E.W / 2, (y - E.H / 2 - cam.y) * cam.z + E.H / 2];
export const GYv = () => E.H * 0.8;
export function voidStage(g, t, cam, o = {}) {
  const M = mood('void'), GY = GYv();
  layer(g, cam, 0.3, (g) => { backdrop(g, [shade(M.sky[0], -0.2), M.sky[1]]); FX.stars(g, t, { count: 60, color: '#8fa6d8', area: [-400, -300, E.W + 800, E.H + 300] }); });
  layer(g, cam, 0.9, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 300, [shade(M.floor, 0.1), M.dark]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    if (o.spot !== false) { FX.lightCone(g, o.spotX ?? E.W / 2, -60, { angle: Math.PI / 2, spread: 0.5, len: GY + 120, color: o.spotC || M.key, a: 0.13 }); FX.pool(g, o.spotX ?? E.W / 2, GY + 10, 420, 60, o.spotC || M.key, 0.3); } });
  return { M, GY };
}
export function heartIcon(g, x, y, r, c, w = 6) { g.strokeStyle = c; g.lineWidth = w; g.lineJoin = 'round'; g.beginPath(); g.moveTo(x, y + r * 0.8);
  g.bezierCurveTo(x - r * 1.3, y - r * 0.1, x - r * 0.7, y - r * 1.1, x, y - r * 0.45); g.bezierCurveTo(x + r * 0.7, y - r * 1.1, x + r * 1.3, y - r * 0.1, x, y + r * 0.8); g.stroke(); }
export function brainIcon(g, x, y, r, c, w = 6) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round';
  for (const dx of [-0.34, 0.34]) { g.beginPath(); g.ellipse(x + dx * r, y, r * 0.44, r * 0.62, 0, 0, 7); g.stroke(); }
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * r * 0.15, y - r * 0.35); g.quadraticCurveTo(x + s * r * 0.55, y - r * 0.2, x + s * r * 0.25, y + r * 0.05); g.quadraticCurveTo(x + s * r * 0.6, y + r * 0.25, x + s * r * 0.3, y + r * 0.45); g.stroke(); } }
export function rewindIcon(g, x, y, r, c, w = 6) { ring(g, x, y, r, w, c); poly(g, [[x - r * 0.05, y - r * 0.4], [x - r * 0.05, y + r * 0.4], [x - r * 0.5, y]], c); poly(g, [[x + r * 0.42, y - r * 0.4], [x + r * 0.42, y + r * 0.4], [x - r * 0.03, y]], c); }
// rubber stamp that slams in at `at`
export function stamp(g, t, at, x, y, str, o = {}) { const { color = S().ui.accent, size = 64, rot = -0.14 } = o; const k = prog(t, at, at + 0.18); if (k <= 0) return;
  const sc = lerp(1.8, 1, ease.out(k)); g.save(); g.translate(x, y); g.rotate(rot); g.scale(sc, sc); g.globalAlpha *= ease.out(k);
  const w = Math.max(200, str.length * size * 0.62 + 60), h = size * 1.6; rr(g, -w / 2, -h / 2, w, h, 12); g.strokeStyle = color; g.lineWidth = 8; g.stroke();
  text(g, str, 0, 4, { size, color, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
// card that flips on `at` from front to back strings
export function flipCard(g, t, at, front, back, o = {}) {
  const fl = ease.inOut(prog(t, at - 0.05, at + 0.5)), sx = Math.cos(fl * Math.PI), isFront = sx > 0;
  const cx = E.W / 2, cy = (o.y ?? E.H * 0.46) + Math.sin(t * 1.4) * 6, w = V(1000, 860), h = V(360, 420), [l1, l2] = isFront ? front : back;
  glow(g, cx, cy, w * 0.8, isFront ? S().ui.cream : S().ui.gold, 0.12 + 0.1 * (1 - Math.abs(sx)));
  g.save(); g.translate(cx, cy); g.rotate(-0.02 + 0.04 * fl); g.scale(Math.max(0.02, Math.abs(sx)) * (1 + 0.02 * t), 1 + 0.02 * t);
  rr(g, -w / 2, -h / 2, w, h, 36); g.fillStyle = isFront ? '#16203a' : '#1c2a26'; g.fill(); g.strokeStyle = isFront ? alpha(S().ui.blueprint, 0.6) : S().ui.gold; g.lineWidth = 4; g.stroke();
  text(g, l1, 0, l2 ? -40 : 0, { size: 96, color: isFront ? S().ui.cream : S().ui.gold, weight: 700, spacing: 4, glow: isFront ? 0 : 22, glowColor: alpha(S().ui.gold, 0.5) });
  if (l2) text(g, l2, 0, 60, { size: 44, color: alpha(S().ui.cream, 0.75), font: FONTS.ui, weight: 900, spacing: 4 });
  g.restore();
}
// night field (for digging)
export function field(g, t, cam) {
  const M = mood('night'), GY = GYv();
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 120, area: [-600, -400, E.W + 1200, E.H * 0.7] }); FX.moon(g, E.W / 2 + 520, GY - 640, 40); });
  layer(g, cam, 0.35, (g) => FX.hills(g, { y: GY - 80, amp: 60, color: '#141a36', seed: 4 }));
  layer(g, cam, 0.6, (g) => { FX.hills(g, { y: GY - 20, amp: 30, color: '#10142a', seed: 9 }); FX.tree(g, E.W / 2 - 640, GY - 10, 1.5, '#0a0d1e'); FX.tree(g, E.W / 2 + 760, GY - 10, 1.2, '#0a0d1e'); });
  return { M, GY };
}
export function titleBackdrop(g, t, info, moodName = 'dusk') {
  const M = mood(moodName), cam = { z: 1.06 - 0.06 * ease.inOut(t / info.dur), y: -20 * t };
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.sun(g, E.W / 2, E.H * 0.64, 90, '#fff3dc', M.key, 5); FX.godRays(g, E.W / 2, E.H * 0.64, { count: 14, angle: -Math.PI / 2, spread: Math.PI * 1.6, len: 1800, a: 0.06, t }); });
  layer(g, cam, 0.5, (g) => FX.skyline(g, { x: -200, y: E.H * 0.76, w: E.W + 400, maxH: 300, color: '#1e2236', windowColor: alpha(M.practical, 0.8), seed: 21 }));
  layer(g, cam, 0.8, (g) => { g.fillStyle = '#10121e'; g.fillRect(-E.W, E.H * 0.76, E.W * 3, E.H); FX.skyline(g, { x: -200, y: E.H * 0.82, w: E.W + 400, minH: 60, maxH: 160, color: '#0c0e18', windowColor: alpha(M.practical, 0.9), lit: 0.25, seed: 5 }); });
  FX.dust(g, t, { count: 30, color: '#ffd9b0', a: 0.4 });
}
