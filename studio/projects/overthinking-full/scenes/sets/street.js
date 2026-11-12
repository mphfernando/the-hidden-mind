// sets/street.js — night street with a lit bus shelter (key light), lamp post, facades with warm windows.
import { E, V, mood, layer, backdrop, rr, seg, circle, linGrad, glow, alpha, shade, mix } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const streetGround = () => E.H * V(0.8, 0.68);
export function street(g, t, cam, o = {}) {
  const M = mood('night'), GY = streetGround(), CX = E.W / 2;
  layer(g, cam, 0.15, (g) => { backdrop(g, M.sky); FX.stars(g, t, { count: 80, area: [-200, 0, E.W + 400, E.H * 0.4] }); FX.moon(g, CX - 520, GY - 760, 30); });
  layer(g, cam, 0.35, (g) => FX.skyline(g, { x: -E.W, y: GY - 120, w: E.W * 3, minH: 120, maxH: 420, color: '#161a36', windowColor: alpha(M.practical, 0.7), lit: 0.2, seed: 31 }));
  layer(g, cam, 0.6, (g) => {
    for (let i = -2; i < 4; i++) FX.facade(g, { x: CX - 1200 + i * 460, y: GY - 60, w: 440, h: 420 + (i % 2) * 80, color: shade(M.wall, -0.35 - (i % 2) * 0.1), win: shade(M.practical, -0.25), dark: shade(M.wall, -0.6), cols: 5, rows: 4, lit: 0.3, seed: 40 + i });
    g.fillStyle = shade(M.road, -0.2); g.fillRect(-E.W, GY - 60, E.W * 3, 60);
  });
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    seg(g, [[-E.W, GY + 4], [E.W * 2, GY + 4]], 6, shade(M.floor, 0.15));
    // bus shelter with glowing ad panel
    const sx = CX - 330, sw = 660, sh = 330, roof = GY - sh;
    g.fillStyle = alpha('#9fc6ff', 0.06); g.fillRect(sx, roof, sw, sh);
    seg(g, [[sx, GY], [sx, roof]], 10, '#10131f'); seg(g, [[sx + sw, GY], [sx + sw, roof]], 10, '#10131f');
    rr(g, sx - 30, roof - 22, sw + 60, 26, 6); g.fillStyle = '#10131f'; g.fill();
    const ax = sx + sw - 170, ay = roof + 40; rr(g, ax, ay, 150, 230, 6); g.fillStyle = mix('#ffe6b8', M.practical, 0.4); g.fill(); glow(g, ax + 75, ay + 115, 320, M.practical, 0.35);
    rr(g, sx + 40, GY - 90, 360, 14, 6); g.fillStyle = '#10131f'; g.fill(); seg(g, [[sx + 70, GY - 80], [sx + 70, GY]], 6, '#10131f'); seg(g, [[sx + 370, GY - 80], [sx + 370, GY]], 6, '#10131f');
    FX.pool(g, ax + 40, GY + 30, 360, 60, M.practical, 0.25);
    FX.lampPost(g, CX + 560, GY, 380, { light: M.practical });
    FX.pool(g, CX + 590, GY + 30, 200, 36, M.practical, 0.25);
    FX.tree(g, CX - 700, GY, 1.6, '#0d1020');
  });
  return { GY, CX, M };
}
