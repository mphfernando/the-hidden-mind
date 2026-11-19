// sets/motifs.js — recurring visual devices: thought bubbles, speech bubbles, the shadow, the wheel, head outline.
import { E, S, V, circle, ring, rr, seg, poly, glow, alpha, shade, mix, text, FONTS, clamp, ease, prog, noise } from '/engine/core.js';

// cloud-shaped thought bubble centred at x,y (w x h) with a trail of small circles toward tail [x,y]
export function thoughtCloud(g, x, y, w, h, o = {}) {
  const { fill = S().ui.cream, a = 0.92, tail = null, scale = 1, label = null, labelColor = '#1a1420', labelSize = null, edge = null } = o;
  if (scale <= 0.01 || a <= 0.01) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(scale, scale);
  const n = 7;
  if (edge) { for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2; circle(g, Math.cos(an) * w * 0.36, Math.sin(an) * h * 0.3, h * 0.36 + 4, edge); } circle(g, 0, 0, Math.min(w, h) * 0.45 + 4, edge); }
  for (let i = 0; i < n; i++) { const an = (i / n) * Math.PI * 2; circle(g, Math.cos(an) * w * 0.36, Math.sin(an) * h * 0.3, h * 0.36, fill); }
  rr(g, -w * 0.4, -h * 0.32, w * 0.8, h * 0.64, h * 0.3); g.fillStyle = fill; g.fill();
  if (tail) { const tx = (tail[0] - x) / scale, ty = (tail[1] - y) / scale; for (let k = 1; k <= 3; k++) { const u = 0.45 + k * 0.17; circle(g, tx * u, ty * u, h * (0.16 - k * 0.035), fill); } }
  if (label) text(g, label, 0, 2, { size: labelSize || h * 0.34, color: labelColor, font: FONTS.ui, weight: 900, spacing: 1 });
  g.restore();
}
// rounded speech bubble with "text lines" (bars, no words)
export function speechBubble(g, x, y, w, h, o = {}) {
  const { fill = S().ui.cream, a = 0.9, lines = 2, side = 1, lineColor = null, scale = 1 } = o;
  if (scale <= 0.01 || a <= 0.01) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.scale(scale, scale);
  rr(g, -w / 2, -h / 2, w, h, h * 0.35); g.fillStyle = fill; g.fill();
  poly(g, [[side * w * 0.18, h / 2 - 2], [side * w * 0.34, h / 2 + h * 0.35], [side * w * 0.02, h / 2 - 2]], fill);
  const lc = lineColor || alpha('#2a2030', 0.55);
  for (let i = 0; i < lines; i++) { const ly = -h / 2 + h * (i + 1) / (lines + 1), lw = w * (i === lines - 1 ? 0.45 : 0.72); rr(g, -w * 0.36, ly - h * 0.06, lw, h * 0.12, h * 0.06); g.fillStyle = lc; g.fill(); }
  g.restore();
}
// THE SHADOW: a tall soft-edged dark shape cast on the wall, growing upward; two glowing eyes open (eyes 0..1)
export function fearShadow(g, x, y, h, t, o = {}) {
  const { w = h * 0.42, color = 'rgba(4,4,12,.78)', eyes = 0, eyeColor = S().ui.accent, grow = 1 } = o;
  if (grow <= 0.01) return;
  const H = h * grow;
  g.save(); g.fillStyle = color; g.beginPath(); g.moveTo(x - w * 0.6, y);
  const N = 28;
  for (let i = 0; i <= N; i++) { const u = i / N, an = Math.PI * u; const wob = 1 + 0.06 * noise(t * 0.8 + u * 5, 3);
    const px = x - Math.cos(an) * w * 0.5 * wob * (0.7 + 0.3 * Math.sin(an)), py = y - Math.sin(an) * 0 - H * (0.55 + 0.45 * Math.sin(an)) * (u > 0.02 && u < 0.98 ? 1 : 0.3);
    g.lineTo(px, py); }
  g.lineTo(x + w * 0.6, y); g.closePath(); g.fill();
  // head bump
  g.beginPath(); g.ellipse(x, y - H * 0.98, w * 0.34, w * 0.36, 0, 0, Math.PI * 2); g.fill();
  if (eyes > 0.01) { const ey = y - H * 0.98, ex = w * 0.13, eh = w * 0.07 * eyes;
    for (const sx of [-1, 1]) { glow(g, x + sx * ex, ey, w * 0.22, eyeColor, 0.55 * eyes); g.fillStyle = mix(eyeColor, '#ffffff', 0.35); g.beginPath(); g.ellipse(x + sx * ex, ey, w * 0.06, Math.max(0.5, eh), sx * 0.25, 0, Math.PI * 2); g.fill(); } }
  g.restore();
}
// hamster wheel whose rim is made of thought bubbles; ang = rotation
export function bubbleWheel(g, cx, cy, r, ang, o = {}) {
  const { rim = S().ui.cream, frame = '#3a3550', glowC = S().ui.gold } = o;
  glow(g, cx, cy, r * 1.5, glowC, 0.12);
  seg(g, [[cx, cy], [cx - r * 0.5, cy + r * 1.25]], 10, frame); seg(g, [[cx, cy], [cx + r * 0.5, cy + r * 1.25]], 10, frame);
  seg(g, [[cx - r * 0.75, cy + r * 1.25], [cx + r * 0.75, cy + r * 1.25]], 12, frame);
  ring(g, cx, cy, r, 6, alpha(rim, 0.5));
  for (let i = 0; i < 6; i++) { const a = ang + (i / 6) * Math.PI * 2; seg(g, [[cx, cy], [cx + Math.cos(a) * r, cy + Math.sin(a) * r]], 3, alpha(rim, 0.25)); }
  for (let i = 0; i < 18; i++) { const a = ang + (i / 18) * Math.PI * 2; const bx = cx + Math.cos(a) * r, by = cy + Math.sin(a) * r; circle(g, bx, by, r * 0.11, rim); circle(g, bx - r * 0.03, by - r * 0.03, r * 0.035, alpha('#ffffff', 0.7)); }
  circle(g, cx, cy, 14, frame);
}
// head silhouette in profile (facing right), height ~ s*1000, origin = base of the neck
export function headProfile(g, x, y, s, o = {}) {
  const { fill = null, stroke = null, w = 6 } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  g.beginPath(); g.moveTo(-170, 0); g.lineTo(-170, -160);
  g.bezierCurveTo(-330, -260, -360, -560, -230, -760); g.bezierCurveTo(-120, -930, 160, -960, 300, -800);
  g.bezierCurveTo(380, -700, 400, -600, 390, -520); g.lineTo(450, -400); g.lineTo(395, -380); g.lineTo(405, -300);
  g.lineTo(385, -275); g.lineTo(400, -230); g.bezierCurveTo(400, -150, 330, -140, 250, -150); g.lineTo(240, 0); g.closePath();
  g.restore();
  if (fill) { g.fillStyle = fill; g.fill(); }
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = w; g.stroke(); }
}
export const popIn = (t, at, d = 0.3) => ease.outBack(prog(t, at, at + d));
