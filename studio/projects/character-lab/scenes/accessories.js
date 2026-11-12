// accessories.js — extra character detail layered on top of drawFigure / bigFace.
// drawChar(g, figureOpts, ['headphones'|'neckphones'|'scarf'|'tie'|'lanyard'|'backpack'|'briefcase'|'pocket'], colors)
import { S, circle, ring, rr, seg, poly, alpha, shade, mix } from '/engine/core.js';
import { drawFigure, POSES, headPos } from '/engine/rig2d.js';

export function drawChar(g, o, acc = [], col = {}) {
  const p = o.pose || POSES.stand, s = (o.s ?? 1) * (o.outfit?.kid ? 0.72 : 1), f = o.facing ?? 1;
  const P = (k) => [o.x + p[k][0] * f * s, o.y + p[k][1] * s];
  const [hx, hy, r] = headPos(o), sh = P('sh'), hip = P('hip'), ink = S().ink;
  const at = (u) => [sh[0] + (hip[0] - sh[0]) * u, sh[1] + (hip[1] - sh[1]) * u];
  if (acc.includes('backpack')) { const c = col.backpack || '#3fb950', m = at(0.45); g.save(); g.translate(m[0] - f * 20 * s, m[1]); rr(g, -18 * s, -36 * s, 36 * s, 66 * s, 10 * s); g.fillStyle = shade(c, -0.15); g.fill(); rr(g, -14 * s, 2 * s, 28 * s, 20 * s, 6 * s); g.fillStyle = shade(c, 0.1); g.fill(); g.restore(); }
  drawFigure(g, o);
  if (acc.includes('backpack')) { const c = col.backpack || '#3fb950'; seg(g, [[sh[0] + f * 3 * s, sh[1] + 2 * s], at(0.55)], 5 * s, shade(c, -0.3)); }
  if (acc.includes('scarf')) { const c = col.scarf || '#2fb5a8'; seg(g, [[sh[0] - f * 9 * s, sh[1] - 8 * s], [sh[0] + f * 10 * s, sh[1] - 6 * s]], 13 * s, c);
    seg(g, [[sh[0] + f * 6 * s, sh[1] - 2 * s], [sh[0] + f * 12 * s, sh[1] + 22 * s], [sh[0] + f * 8 * s, sh[1] + 40 * s]], 9 * s, shade(c, -0.12));
    for (let i = 0; i < 3; i++) seg(g, [[sh[0] + f * (4 + i * 3) * s, sh[1] + 42 * s], [sh[0] + f * (4 + i * 3) * s, sh[1] + 48 * s]], 2 * s, shade(c, -0.12)); }
  if (acc.includes('tie')) { const c = col.tie || '#d64a33', a = [sh[0] + f * 5 * s, sh[1] + 4 * s], b = at(0.62); const loose = col.looseTie ? 6 * s : 0;
    poly(g, [[a[0] - 3 * s, a[1]], [a[0] + 3 * s, a[1]], [b[0] + f * (5 * s + loose), b[1]], [b[0] + f * loose, b[1] + 8 * s], [b[0] - f * (5 * s - loose), b[1]]], c); circle(g, a[0], a[1] + 2 * s, 4 * s, shade(c, -0.2)); }
  if (acc.includes('lanyard')) { const c = col.lanyard || '#f2c21a', bd = at(0.42); seg(g, [[sh[0] - f * 4 * s, sh[1]], [bd[0] + f * 6 * s, bd[1] - 8 * s]], 2.5 * s, c); seg(g, [[sh[0] + f * 8 * s, sh[1]], [bd[0] + f * 6 * s, bd[1] - 8 * s]], 2.5 * s, c);
    rr(g, bd[0] + f * 6 * s - 7 * s, bd[1] - 8 * s, 14 * s, 18 * s, 2 * s); g.fillStyle = '#f4f1ea'; g.fill(); g.fillStyle = c; g.fillRect(bd[0] + f * 6 * s - 7 * s, bd[1] - 8 * s, 14 * s, 5 * s); }
  if (acc.includes('pocket')) { const c = col.pocket || '#ff6f61', m = at(0.25); poly(g, [[m[0] + f * 6 * s, m[1]], [m[0] + f * 14 * s, m[1] - 6 * s], [m[0] + f * 16 * s, m[1] + 2 * s]], c); }
  if (acc.includes('neckphones')) { const c = col.phones || '#2a2f45', cc = col.phonesCup || '#8a5ad6'; g.strokeStyle = c; g.lineWidth = 4 * s; g.beginPath(); g.arc(sh[0] + f * 2 * s, sh[1] - 12 * s, 14 * s, 0.15 * Math.PI, 0.85 * Math.PI); g.stroke();
    circle(g, sh[0] + f * 16 * s, sh[1] - 6 * s, 7 * s, c); circle(g, sh[0] + f * 16 * s, sh[1] - 6 * s, 4 * s, cc); }
  if (acc.includes('headphones')) { const c = col.phones || '#2a2f45', cc = col.phonesCup || '#8a5ad6'; g.strokeStyle = c; g.lineWidth = 5 * s; g.beginPath(); g.arc(hx, hy, r * 1.12, Math.PI * 1.12, Math.PI * 1.88); g.stroke();
    g.save(); g.translate(hx - f * r * 0.12, hy + r * 0.05); rr(g, -r * 0.24, -r * 0.36, r * 0.48, r * 0.72, r * 0.22); g.fillStyle = c; g.fill(); rr(g, -r * 0.13, -r * 0.24, r * 0.26, r * 0.48, r * 0.12); g.fillStyle = cc; g.fill(); g.restore(); }
  if (acc.includes('briefcase')) { const c = col.briefcase || '#5a3a2a', h = P('hF'); seg(g, [[h[0] - 6 * s, h[1] + 2 * s], [h[0] - 6 * s, h[1] - 4 * s], [h[0] + 6 * s, h[1] - 4 * s], [h[0] + 6 * s, h[1] + 2 * s]], 2.5 * s, shade(c, -0.3)); rr(g, h[0] - 22 * s, h[1] + 2 * s, 44 * s, 30 * s, 4 * s); g.fillStyle = c; g.fill(); g.fillStyle = shade(c, 0.25); g.fillRect(h[0] - 22 * s, h[1] + 12 * s, 44 * s, 2 * s); }
}
// accessories on a giant close-up (bigFace) — call AFTER bigFace(g, cx, cy, r, ...)
export function faceAcc(g, cx, cy, r, acc = [], col = {}) {
  if (acc.includes('scarf')) { const c = col.scarf || '#2fb5a8'; rr(g, cx - r * 0.95, cy + r * 0.92, r * 1.9, r * 0.38, r * 0.19); g.fillStyle = c; g.fill(); rr(g, cx + r * 0.3, cy + r * 1.1, r * 0.3, r * 0.7, r * 0.1); g.fillStyle = shade(c, -0.12); g.fill(); }
  if (acc.includes('tie')) { const c = col.tie || '#d64a33'; poly(g, [[cx - r * 0.1, cy + r * 1.0], [cx + r * 0.1, cy + r * 1.0], [cx + r * 0.2, cy + r * 1.6], [cx - r * 0.2, cy + r * 1.6]], c); }
  if (acc.includes('lanyard')) { const c = col.lanyard || '#f2c21a'; seg(g, [[cx - r * 0.5, cy + r * 1.0], [cx - r * 0.05, cy + r * 1.6]], r * 0.05, c); seg(g, [[cx + r * 0.5, cy + r * 1.0], [cx + r * 0.05, cy + r * 1.6]], r * 0.05, c); }
  if (acc.includes('neckphones')) { const c = col.phones || '#2a2f45', cc = col.phonesCup || '#8a5ad6'; g.strokeStyle = c; g.lineWidth = r * 0.12; g.beginPath(); g.arc(cx, cy + r * 0.75, r * 0.85, 0.12 * Math.PI, 0.88 * Math.PI); g.stroke(); for (const sx of [-1, 1]) { circle(g, cx + sx * r * 0.82, cy + r * 1.02, r * 0.24, c); circle(g, cx + sx * r * 0.82, cy + r * 1.02, r * 0.13, cc); } }
  if (acc.includes('headphones')) { const c = col.phones || '#2a2f45', cc = col.phonesCup || '#8a5ad6'; g.strokeStyle = c; g.lineWidth = r * 0.14; g.beginPath(); g.arc(cx, cy, r * 1.1, Math.PI * 1.05, Math.PI * 1.95); g.stroke(); for (const sx of [-1, 1]) { rr(g, cx + sx * r * 1.02 - r * 0.15, cy - r * 0.3, r * 0.3, r * 0.6, r * 0.12); g.fillStyle = c; g.fill(); rr(g, cx + sx * r * 1.02 - r * 0.07, cy - r * 0.2, r * 0.14, r * 0.4, r * 0.07); g.fillStyle = cc; g.fill(); } }
}
