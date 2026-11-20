// sets/study.js — the researchers' office at dusk: big window (key), whiteboard with a loop diagram, calendar, shelves.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, poly, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const studyGround = () => E.H * V(0.8, 0.68);
export function study(g, t, cam, o = {}) {
  const M = mood('dusk'), GY = studyGround(), CX = E.W / 2;
  const wall = shade(M.wall, -0.3), wx = CX + V(120, 60), wy = GY - V(620, 980), ww = V(560, 440), wh = V(420, 480);
  layer(g, cam, 0.2, (g) => { backdrop(g, M.sky); FX.sun(g, wx + ww * 0.55, wy + wh * 0.7, 44, '#fff3dc', M.key, 4);
    FX.skyline(g, { x: wx - 300, y: wy + wh, w: ww + 600, minH: 50, maxH: wh * 0.5, color: mix(M.sky[1], '#120d18', 0.75), windowColor: alpha(M.practical, 0.6), lit: 0.2, seed: 13 }); });
  layer(g, cam, 0.5, (g) => {
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, E.H * 3); g.rect(wx + ww, wy, -ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, -E.H * 0.2, 0, GY, [shade(wall, -0.35), wall, shade(wall, -0.15)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H + 10); g.restore();
    const fc = shade(M.wall, -0.7); g.strokeStyle = fc; g.lineWidth = 14; g.strokeRect(wx, wy, ww, wh);
    for (const f of [1 / 3, 2 / 3]) seg(g, [[wx + ww * f, wy], [wx + ww * f, wy + wh]], 8, fc);
    for (let i = 0; i < 7; i++) { g.fillStyle = alpha(fc, 0.55); g.fillRect(wx, wy + 10 + i * 22, ww, 6); }               // half-raised blinds
    FX.godRays(g, wx + ww * 0.55, wy + wh * 0.7, { count: 6, angle: Math.PI * 0.8, spread: 0.6, len: 900, color: M.key, a: 0.05, t });
    // whiteboard with loop diagram
    const bx = CX - V(760, 470), by = GY - V(560, 960), bw = V(600, 520), bh = V(320, 300);
    rr(g, bx - 10, by - 10, bw + 20, bh + 20, 8); g.fillStyle = shade(M.wall, -0.6); g.fill();
    rr(g, bx, by, bw, bh, 4); g.fillStyle = mix('#e9e4ea', M.wall, 0.3); g.fill();
    const lc = mix('#3a4a8a', M.wall, 0.2), lx = bx + bw * 0.33, ly = by + bh * 0.5, lr = bh * 0.3;
    g.strokeStyle = lc; g.lineWidth = 5; g.beginPath(); g.arc(lx, ly, lr, -0.3, Math.PI * 1.75); g.stroke();
    poly(g, [[lx + lr * Math.cos(-0.3) + 14, ly + lr * Math.sin(-0.3) - 4], [lx + lr * Math.cos(-0.3) - 10, ly + lr * Math.sin(-0.3) - 16], [lx + lr * Math.cos(-0.3) - 4, ly + lr * Math.sin(-0.3) + 14]], lc);
    for (let i = 0; i < 3; i++) { g.fillStyle = alpha(lc, 0.5); g.fillRect(bx + bw * 0.6, by + 60 + i * 50, bw * (0.3 - i * 0.05), 8); }
    glow(g, bx + bw / 2, by + bh / 2, bw * 0.7, M.key, 0.08);
    // wall calendar (pages flip when o.flip > 0)
    const cx = CX - V(80, 320), cy = GY - V(560, 1150);
    rr(g, cx, cy, 120, 150, 6); g.fillStyle = '#e8e2e6'; g.fill(); g.fillStyle = mix('#c94a3a', M.wall, 0.2); g.fillRect(cx, cy, 120, 32);
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) { g.fillStyle = alpha('#3a3040', 0.35); g.fillRect(cx + 14 + c * 25, cy + 48 + r * 24, 14, 10); }
    if (o.flip) { const n = 4; for (let k = 0; k < n; k++) { const ph = (t * o.flip + k / n) % 1; g.save(); g.translate(cx + 60, cy); g.scale(1, Math.cos(ph * Math.PI)); g.fillStyle = alpha('#f4eff2', 0.9 * (1 - ph)); g.fillRect(-60, 0, 120, 150 * (ph < 0.5 ? 1 : 0.6)); g.restore(); } }
    // shelf with books
    const sx = CX + V(720, 320), sy = GY - V(330, 620);
    seg(g, [[sx - 40, sy], [sx + 300, sy]], 8, shade(M.wall, -0.6));
    for (let i = 0; i < 9; i++) { rr(g, sx - 30 + i * 30, sy - 70 - (i % 3) * 10, 24, 70 + (i % 3) * 10, 3); g.fillStyle = shade(i % 2 ? '#6a4a5a' : '#4a3a5a', -0.25); g.fill(); }
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, -0.05), shade(M.dark, -0.25)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww * 0.3, GY + 60, 420, 70, M.key, 0.2);
    FX.counter(g, { x: CX + V(330, 160), y: GY, w: V(520, 400), h: 110, color: shade(M.wall, -0.6), top: shade(M.wall, -0.4), doors: 4 });
    FX.screen(g, { x: CX + V(560, 300), y: GY - 230, w: 150, h: 96, glowC: '#ffd59a', a: 0.15 }, (g, x, y, w, h) => { for (let i = 0; i < 5; i++) { g.fillStyle = alpha('#ffd59a', 0.5); g.fillRect(x + 12, y + 14 + i * 15, w * (0.3 + ((i * 37) % 50) / 100), 6); } });
  });
  return { GY, CX, M };
}
