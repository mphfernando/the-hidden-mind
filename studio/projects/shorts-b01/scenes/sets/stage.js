// sets/stage.js — a dark theatre stage with a giant spotlight and an audience in the foreground (spotlight effect).
import { E, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const stageGround = () => E.H * 0.72;
export function stage(g, t, cam, o = {}) {
  const M = mood('void'), GY = stageGround(), CX = E.W / 2, lights = o.lights ?? 0, spot = o.spot ?? 1;
  layer(g, cam, 0.4, (g) => { backdrop(g, ['#05060c', '#0b1020']);
    for (const s of [-1, 1]) for (let i = 0; i < 9; i++) { const x = CX + s * (620 + i * 70); g.fillStyle = shade('#3a1420', -0.2 - (i % 2) * 0.15); g.fillRect(x - 40, -E.H, 80, GY + E.H); }
    if (lights > 0) { g.fillStyle = alpha('#ffd59a', 0.12 * lights); g.fillRect(-E.W, -E.H, E.W * 3, E.H * 3); } });
  layer(g, cam, 0.8, (g) => { g.fillStyle = linGrad(g, 0, GY, 0, GY + 120, ['#2a2230', '#120e18']); g.fillRect(-E.W, GY, E.W * 3, 120); g.fillStyle = '#05060a'; g.fillRect(-E.W, GY + 120, E.W * 3, E.H);
    if (spot > 0) { FX.lightCone(g, CX, -80, { angle: Math.PI / 2, spread: 0.32, len: GY + 160, color: '#fff3d6', a: 0.32 * spot }); FX.pool(g, CX, GY + 10, 260, 40, '#fff3d6', 0.6 * spot); } });
  return { GY, CX, M };
}
// audience heads + shoulders in the foreground; o.phones: 0..1 lights their phone screens, o.eyes: 0..1 eyes glow
export function audience(g, t, o = {}) {
  const { phones = 0, eyes = 0, lights = 0, seed = 5 } = o; const y0 = E.H * 0.86;
  for (let row = 0; row < 2; row++) for (let i = 0; i < 13; i++) { const x = i * 160 + (row ? 80 : 0) - 20, y = y0 + row * 110, r = 46 + row * 8;
    const ink = row ? '#04050a' : '#0a0c16';
    g.fillStyle = ink; g.beginPath(); g.ellipse(x, y + r * 1.6, r * 1.6, r * 0.95, 0, Math.PI, Math.PI * 2); g.fill(); circle(g, x, y, r, ink);
    if (lights > 0) { g.strokeStyle = alpha('#ffd59a', 0.5 * lights); g.lineWidth = 3; g.beginPath(); g.arc(x, y, r, Math.PI * 1.1, Math.PI * 1.9); g.stroke(); }
    if (eyes > 0 && phones < 0.5) for (const dx of [-12, 12]) { circle(g, x + dx, y - 6, 7 * eyes, alpha('#e8f4ff', 0.9 * eyes)); }
    if (phones > 0) { rr(g, x - 16, y + 20, 32, 46, 5); g.fillStyle = alpha('#9fd0ff', phones); g.fill(); glow(g, x, y + 30, 70, '#9fd0ff', 0.35 * phones); } }
}
