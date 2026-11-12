// sets/memory.js — the "replay" of the café moment as a little glowing screen (used on walls, in clouds, far away).
import { E, rr, seg, circle, poly, glow, alpha, shade, text, FONTS, linGrad } from '/engine/core.js';
export function memoryFrame(g, x, y, w, h, t, o = {}) {
  const { a = 1, label = true, rot = 0 } = o; if (a <= 0.01) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot);
  glow(g, 0, 0, w * 0.9, '#ffb070', 0.25);
  rr(g, -w / 2, -h / 2, w, h, 14); g.fillStyle = linGrad(g, 0, -h / 2, 0, h / 2, ['#7a4a3a', '#4a2a28', '#2a1820']); g.fill();
  g.save(); rr(g, -w / 2, -h / 2, w, h, 14); g.clip();
  const gy = h * 0.32; g.fillStyle = '#1a1014'; g.fillRect(-w / 2, gy, w, h);
  rr(g, -w * 0.2, gy - h * 0.12, w * 0.4, h * 0.03, 3); g.fill(); seg(g, [[0, gy - h * 0.1], [0, gy]], w * 0.012, '#1a1014');
  const fig = (fx, s, f) => { circle(g, fx, gy - h * 0.38 * s, h * 0.07 * s, '#0c070a'); seg(g, [[fx, gy - h * 0.3 * s], [fx, gy - h * 0.12 * s]], h * 0.05 * s, '#0c070a'); seg(g, [[fx, gy - h * 0.12 * s], [fx + f * h * 0.08 * s, gy]], h * 0.04 * s, '#0c070a'); };
  fig(-w * 0.28, 1.0, 1); fig(w * 0.3, 1.25, -1);
  rr(g, -w * 0.42, -h * 0.44, w * 0.38, h * 0.2, h * 0.1); g.fillStyle = '#fff3e6'; g.fill(); text(g, 'YOU TOO!', -w * 0.23, -h * 0.34, { size: h * 0.1, color: '#2a1820', font: FONTS.ui, weight: 900 });
  g.restore();
  rr(g, -w / 2, -h / 2, w, h, 14); g.strokeStyle = alpha('#ffd59a', 0.8); g.lineWidth = 4; g.stroke();
  if (label) { poly(g, [[w / 2 - 50, -h / 2 + 18], [w / 2 - 50, -h / 2 + 46], [w / 2 - 26, -h / 2 + 32]], '#ff6f61'); text(g, 'REPLAY', w / 2 - 60, -h / 2 + 33, { size: 22, color: '#ff6f61', font: FONTS.ui, weight: 900, align: 'right' }); }
  g.restore();
}
