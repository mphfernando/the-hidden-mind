// sets/cafe.js — warm café interior (ep02 flashback): window to an evening street, pendant lamps, counter, round tables.
import { E, V, mood, layer, backdrop, rr, seg, circle, poly, linGrad, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const cafeGround = () => E.H * V(0.8, 0.68);
export function cafe(g, t, cam, o = {}) {
  const M = mood('interiorWarm'), GY = cafeGround(), CX = E.W / 2, wall = shade(M.wall, -0.15);
  const wx = CX - 900, wy = GY - 600, ww = 620, wh = 420;
  layer(g, cam, 0.2, (g) => { backdrop(g, mood('dusk').sky); FX.skyline(g, { x: wx - 300, y: wy + wh + 10, w: ww + 600, minH: 60, maxH: 260, color: '#2a2236', windowColor: alpha(M.practical, 0.8), lit: 0.3, seed: 23 }); });
  layer(g, cam, 0.55, (g) => {
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, E.H * 3); g.rect(wx + ww, wy, -ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, -E.H * 0.2, 0, GY, [shade(wall, -0.4), wall, shade(wall, -0.1)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H + 10);
    g.fillStyle = shade(M.wall, -0.35); g.fillRect(-E.W, GY - 220, E.W * 3, 220);                          // wainscot
    for (let x = -E.W; x < E.W * 2; x += 70) { g.fillStyle = alpha('#000', 0.12); g.fillRect(x, GY - 220, 4, 220); }
    g.restore();
    const fc = shade(M.wall, -0.7); g.strokeStyle = fc; g.lineWidth = 14; g.strokeRect(wx, wy, ww, wh); seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 8, fc);
    text(g, 'CAFÉ', wx + ww / 2, wy + 60, { size: 54, color: alpha(M.practical, 0.35), weight: 700, spacing: 10 });
    // menu board + shelves behind the counter
    rr(g, CX + 380, GY - 640, 420, 230, 10); g.fillStyle = '#1f1a1c'; g.fill();
    for (let i = 0; i < 5; i++) { g.fillStyle = alpha('#f2e6d0', 0.55); g.fillRect(CX + 410, GY - 600 + i * 38, 200 + ((i * 37) % 90), 8); g.fillRect(CX + 700, GY - 600 + i * 38, 60, 8); }
    seg(g, [[CX + 360, GY - 360], [CX + 820, GY - 360]], 8, shade(M.wall, -0.55));
    for (let i = 0; i < 8; i++) { rr(g, CX + 380 + i * 54, GY - 410, 34, 50, 6); g.fillStyle = i % 2 ? '#e8e0d0' : '#c9b8a0'; g.fill(); }
    // pendant lamps
    for (const lx of [CX - 420, CX + 10, CX + 440]) { seg(g, [[lx, -E.H], [lx, GY - 560]], 3, '#1a1416'); poly(g, [[lx - 46, GY - 520], [lx + 46, GY - 520], [lx + 22, GY - 562], [lx - 22, GY - 562]], '#2a2024');
      circle(g, lx, GY - 516, 12, '#fff2d6'); glow(g, lx, GY - 500, 260, M.practical, 0.35); FX.lightCone(g, lx, GY - 516, { angle: Math.PI / 2, spread: 0.7, len: 520, color: M.practical, a: 0.12 }); }
  });
  layer(g, cam, 0.85, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    for (let x = -E.W; x < E.W * 2; x += 90) for (let r = 0; r < 6; r++) if ((x / 90 + r) % 2 === 0) { g.fillStyle = alpha('#000', 0.08); g.fillRect(x, GY + r * 60, 90, 60); }
    FX.counter(g, { x: CX + 360, y: GY, w: 520, h: 150, color: shade(M.wall, -0.55), top: shade(M.wall, -0.3), doors: 5 });
    rr(g, CX + 640, GY - 250, 110, 100, 10); g.fillStyle = '#3a3438'; g.fill(); circle(g, CX + 670, GY - 200, 10, '#b8b0a8'); circle(g, CX + 720, GY - 200, 10, '#b8b0a8');   // espresso machine
    for (const lx of [CX - 420, CX + 10, CX + 440]) FX.pool(g, lx, GY + 30, 260, 40, M.practical, 0.22);
    // background tables with silhouettes
    for (const bx of [CX - 1100, CX + 1100]) { seg(g, [[bx, GY - 110], [bx, GY]], 8, '#1a1416'); rr(g, bx - 90, GY - 118, 180, 12, 6); g.fillStyle = '#1a1416'; g.fill(); }
  });
  return { GY, CX, M };
}
export function cafeTable(g, x, GY, o = {}) {
  const top = GY - 130, c = o.color || '#241a1c';
  seg(g, [[x, top], [x, GY - 6]], 10, c); seg(g, [[x - 50, GY - 4], [x + 50, GY - 4]], 8, c);
  rr(g, x - 150, top - 12, 300, 16, 8); g.fillStyle = c; g.fill(); g.fillStyle = 'rgba(255,210,150,.35)'; g.fillRect(x - 144, top - 12, 288, 3);
  if (o.plate !== false) { g.fillStyle = '#efe8dc'; g.beginPath(); g.ellipse(x - 50, top - 16, 46, 9, 0, 0, Math.PI * 2); g.fill(); g.fillStyle = '#c0703a'; g.beginPath(); g.ellipse(x - 50, top - 20, 26, 7, 0, 0, Math.PI * 2); g.fill(); }
  rr(g, x + 50, top - 40, 22, 28, 4); g.fillStyle = '#e8e0d4'; g.fill();
  return { top: top - 12 };
}
// warm "old memory" grade for flashback shots
export function flashbackTint(g, a = 1) { g.save(); g.globalCompositeOperation = 'soft-light'; g.fillStyle = `rgba(255,170,90,${0.35 * a})`; g.fillRect(0, 0, E.W, E.H); g.restore(); }
