// sets/bedroom.js — YOU's bedroom at night. Moonlit window (key, cool) centre; bed left; desk + warm lamp right.
import { E, V, mood, layer, backdrop, rr, seg, circle, ring, linGrad, radGrad, glow, alpha, shade, mix, clamp } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const bedGround = () => E.H * V(0.8, 0.68);
export const BED = () => ({ x: E.W / 2 - V(820, 440), w: V(560, 520) });              // bed frame left x + width
export const DESK = () => ({ x: E.W / 2 + V(330, 120), w: V(440, 380), h: 150 });      // desk left x, width, height
export const LAMP = () => ({ x: DESK().x + DESK().w - 70, y: bedGround() - DESK().h - 120 });

export function bedroom(g, t, cam, o = {}) {
  const M = mood(o.mood || 'night'), night = !o.mood || o.mood === 'night', GY = bedGround(), CX = E.W / 2, lampOn = o.lamp ?? 1;
  const wall = shade(M.wall, -0.25), wallDark = shade(M.wall, -0.55);
  // window view (far): night sky, moon, skyline
  const wx = CX - V(230, 260), wy = GY - V(650, 980), ww = V(520, 520), wh = V(400, 470);
  layer(g, cam, 0.2, (g) => {
    backdrop(g, M.sky);
    if (night) FX.stars(g, t, { count: 90, area: [wx - 300, wy - 200, ww + 600, wh] });
    if (night) FX.moon(g, wx + ww * 0.72, wy + wh * 0.28, 34); else FX.sun(g, wx + ww * 0.5, wy + wh * 0.82, 40, '#fff3dc', M.key, 4);
    FX.skyline(g, { x: wx - 400, y: wy + wh + 10, w: ww + 800, minH: 60, maxH: wh * 0.55, color: '#141833', windowColor: alpha(M.practical, 0.75), lit: 0.18, seed: 7 });
  });
  // wall with window cut-out
  layer(g, cam, 0.5, (g) => {
    g.save(); g.beginPath(); g.rect(-E.W, -E.H, E.W * 3, E.H * 3); g.rect(wx + ww, wy, -ww, wh); g.clip('evenodd');
    g.fillStyle = linGrad(g, 0, -E.H * 0.2, 0, GY, [shade(wallDark, -0.2), wall, shade(wall, -0.1)]); g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H + 10);
    g.restore();
    // window frame + mullions + sill
    const fc = shade(M.wall, -0.7);
    g.strokeStyle = fc; g.lineWidth = 16; g.strokeRect(wx, wy, ww, wh);
    seg(g, [[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], 9, fc); seg(g, [[wx, wy + wh * 0.45], [wx + ww, wy + wh * 0.45]], 9, fc);
    rr(g, wx - 30, wy + wh + 4, ww + 60, 18, 4); g.fillStyle = shade(M.wall, -0.4); g.fill();
    // moonlight patch on the wall + spill
    glow(g, wx + ww / 2, wy + wh / 2, ww * 0.9, M.key, 0.12);
    // poster + shelf on left wall
    rr(g, CX - V(760, 420), GY - V(560, 900), 150, 200, 6); g.fillStyle = shade(M.wall, -0.45); g.fill();
    rr(g, CX - V(745, 405), GY - V(545, 885), 120, 170, 4); g.fillStyle = alpha(mix(M.practical, M.wall, 0.6), 0.5); g.fill();
    seg(g, [[CX + V(420, 160), GY - V(470, 800)], [CX + V(760, 420), GY - V(470, 800)]], 8, shade(M.wall, -0.5));
    for (let i = 0; i < 6; i++) rr(g, CX + V(440, 180) + i * 22, GY - V(470, 800) - 50 - (i % 3) * 8, 16, 50 + (i % 3) * 8, 3), g.fillStyle = shade(M.wall, -0.3 - (i % 2) * 0.2), g.fill();
    // lamp glow on wall
    if (lampOn > 0) glow(g, LAMP().x, LAMP().y, 420, M.practical, 0.25 * lampOn);
  });
  // floor + furniture
  layer(g, cam, 0.9, (g) => {
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 400, [shade(M.floor, 0.05), shade(M.dark, -0.2)]); g.fillRect(-E.W, GY, E.W * 3, E.H * 2);
    FX.floorLines(g, GY, GY + 600, 'rgba(0,0,0,.25)', 0.08);
    FX.pool(g, wx + ww / 2 - 60, GY + 70, 380, 70, M.key, 0.16);                         // moonlight on floor
    // bed
    const b = BED();
    FX.bed(g, { x: b.x, y: GY, w: b.w, color: shade('#3b3f78', -0.15), frame: shade(M.wall, -0.65), pillow: '#cfd2ee' });
    // desk + chair + lamp
    const d = DESK(), dt = GY - d.h;
    g.fillStyle = shade(M.wall, -0.65); g.fillRect(d.x, dt, d.w, 14); g.fillRect(d.x + 10, dt, 14, d.h); g.fillRect(d.x + d.w - 24, dt, 14, d.h);
    g.fillRect(d.x + d.w - 160, dt + 14, 136, 70);
    const L = LAMP(); seg(g, [[L.x, dt], [L.x - 20, dt - 70], [L.x + 10, L.y]], 7, shade(M.wall, -0.7));
    g.fillStyle = shade(M.wall, -0.7); g.beginPath(); g.moveTo(L.x - 40, L.y + 14); g.lineTo(L.x + 46, L.y + 14); g.lineTo(L.x + 22, L.y - 26); g.lineTo(L.x - 10, L.y - 26); g.closePath(); g.fill();
    if (lampOn > 0) { circle(g, L.x + 3, L.y + 18, 10, alpha('#fff2d0', lampOn)); glow(g, L.x + 3, L.y + 20, 120, M.practical, 0.6 * lampOn); FX.lightCone(g, L.x + 3, L.y + 18, { angle: Math.PI / 2 + 0.2, spread: 0.9, len: 260, color: M.practical, a: 0.28 * lampOn }); FX.pool(g, L.x - 60, dt + 2, 170, 18, M.practical, 0.35 * lampOn); }
    if (o.papers !== false) for (let i = 0; i < 5; i++) { g.save(); g.translate(d.x + 70 + i * 34, dt - 3 - i * 3); g.rotate(-0.12 + i * 0.06); g.fillStyle = mix('#e8e4f4', M.wall, 0.25 + 0.1 * (i % 2)); g.fillRect(-36, -4, 72, 5); g.restore(); }
  });
  return { GY, CX, M, wx, wy, ww, wh, deskTop: GY - DESK().h };
}
// lying figure helper data: hip x on the bed, y so the body rests on the mattress
export const lieSpot = (s = 1) => ({ x: BED().x + 110 + 108 * s, y: bedGround() - 92 + 100 * s - 100 * s });
export function blanket(g, GY, s = 1, M) {
  const b = BED(); rr(g, b.x + 120 + 90 * s, GY - 118, b.w - 120 - 90 * s, 50, 18); g.fillStyle = shade('#3b3f78', -0.05); g.fill();
  g.fillStyle = alpha('#ffffff', 0.06); g.fillRect(b.x + 120 + 90 * s, GY - 118, b.w - 120 - 90 * s, 6);
}
