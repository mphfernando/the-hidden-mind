// sets/phone.js — ep03: chat-app phone screen (bubbles with real text, typing dots, "Seen"), emoji faces, night bus interior.
import { E, V, S, mood, layer, backdrop, ease, prog, clamp, lerp, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, text, measure, FONTS } from '/engine/core.js';
import * as FX from '/engine/fx2d.js';

export const ME = '#8a5ad6', THEM = '#2c3a52';
export const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at, at + d));

// simple emoji face: 'laugh' | 'smile' | 'grin'
export function emoji(g, x, y, r, kind = 'laugh', a = 1) {
  if (r <= 0.5 || a <= 0) return; g.save(); g.globalAlpha *= a;
  circle(g, x, y, r, '#ffcf3a'); circle(g, x - r * 0.25, y - r * 0.3, r * 0.5, alpha('#ffffff', 0.18));
  g.strokeStyle = '#5a3a10'; g.lineWidth = Math.max(2, r * 0.12); g.lineCap = 'round';
  if (kind === 'laugh') { for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * r * 0.5, y - r * 0.32); g.lineTo(x + s * r * 0.25, y - r * 0.2); g.lineTo(x + s * r * 0.5, y - r * 0.08); g.stroke(); }
    g.fillStyle = '#5a3a10'; g.beginPath(); g.moveTo(x - r * 0.55, y + r * 0.1); g.quadraticCurveTo(x, y + r * 0.95, x + r * 0.55, y + r * 0.1); g.closePath(); g.fill(); }
  else { for (const s of [-1, 1]) circle(g, x + s * r * 0.33, y - r * 0.2, r * 0.11, '#5a3a10'); g.beginPath(); g.arc(x, y + r * 0.05, r * 0.45, 0.25, Math.PI - 0.25); g.stroke(); }
  g.restore();
}
// chat bubble with real text (lines: array of strings) or placeholder bars (bars: n). Returns its height.
export function bubble(g, x, y, w, o = {}) {
  const { me = true, lines = null, bars = 0, size = 30, sc = 1, a = 1, color = null, textColor = '#ffffff', emojis = 0, emojiAt = [], t = 0 } = o;
  const nL = lines ? lines.length : bars, h = Math.max(size * 1.9, nL * size * 1.35 + size * 0.9) + (emojis ? size * 1.2 : 0);
  if (sc <= 0.01 || a <= 0.01) return h;
  g.save(); g.globalAlpha *= a; const ax = me ? x + w : x; g.translate(ax, y); g.scale(sc, sc); g.translate(-ax, -y);
  rr(g, x, y, w, h, size * 0.8); g.fillStyle = color || (me ? ME : THEM); g.fill();
  poly(g, me ? [[x + w - 26, y + h - 2], [x + w + 14, y + h + 10], [x + w - 4, y + h - 26]] : [[x + 26, y + h - 2], [x - 14, y + h + 10], [x + 4, y + h - 26]], color || (me ? ME : THEM));
  if (lines) lines.forEach((s, i) => text(g, s, x + size * 0.7, y + size * 0.95 + i * size * 1.35, { size, color: textColor, font: FONTS.ui, weight: 900, align: 'left' }));
  else for (let i = 0; i < bars; i++) { rr(g, x + size * 0.7, y + size * 0.7 + i * size * 1.35, (w - size * 1.4) * (i === bars - 1 ? 0.6 : 1 - 0.08 * (i % 3)), size * 0.5, size * 0.25); g.fillStyle = alpha('#ffffff', 0.55); g.fill(); }
  for (let k = 0; k < emojis; k++) emoji(g, x + size * 1.3 + k * size * 1.5, y + h - size * 0.95, size * 0.62 * pop(t, emojiAt[k] ?? 0, 0.35), k ? 'grin' : 'laugh');
  g.restore(); return h;
}
// the phone. cx, cy = centre; H = height. msgs: [{me, lines|bars, at, size, emojis, emojiAt}], o: {name, typing:[from,to], seen, tilt, zoom}
export function phone(g, t, cx, cy, H, msgs = [], o = {}) {
  const W = H * 0.5, x = cx - W / 2, y = cy - H / 2, ui = S().ui;
  g.save(); if (o.tilt) { g.translate(cx, cy); g.rotate(o.tilt); g.translate(-cx, -cy); }
  glow(g, cx, cy, H * 0.75, '#7fd0ff', 0.14);
  rr(g, x - 16, y - 16, W + 32, H + 32, 56); g.fillStyle = '#0b0d16'; g.fill(); g.strokeStyle = alpha('#9fc8ff', 0.35); g.lineWidth = 3; g.stroke();
  rr(g, x, y, W, H, 44); g.fillStyle = linGrad(g, 0, y, 0, y + H, ['#121a2c', '#0d1322']); g.fill();
  g.save(); rr(g, x, y, W, H, 44); g.clip();
  // header: avatar (beanie) + name
  const hh = H * 0.11; g.fillStyle = '#18233a'; g.fillRect(x, y, W, hh);
  const ax = x + W * 0.16, ay = y + hh * 0.58; circle(g, ax, ay, hh * 0.3, '#0c0e18'); g.fillStyle = '#e0a92a'; g.beginPath(); g.arc(ax, ay - 2, hh * 0.3, Math.PI, 0); g.fill();
  text(g, o.name || 'JUNO', x + W * 0.3, ay + 2, { size: hh * 0.32, color: o.nameGlow ? mix(ui.cream, ui.gold, o.nameGlow) : ui.cream, font: FONTS.ui, weight: 900, align: 'left', glow: o.nameGlow ? 18 * o.nameGlow : 0, glowColor: alpha(ui.gold, 0.7) });
  // messages
  let yy = y + hh + H * 0.04 - (o.scroll || 0); const pad = W * 0.06, bw = W * 0.74;
  for (const m of msgs) { const sz = m.size || H * 0.034, at = m.at ?? -1, sc = m.instant ? (t >= at ? 1 : 0) : pop(t, at, 0.3); if (t < at) { continue; }
    const w = m.w ? m.w * W : bw; const bx = m.me ? x + W - pad - w : x + pad;
    const h = bubble(g, bx, yy, w, { me: m.me, lines: m.lines, bars: m.bars, size: sz, sc, emojis: m.emojis, emojiAt: m.emojiAt, t, color: m.color });
    if (m.me && o.seen && m === msgs.filter((q) => q.me).slice(-1)[0] && t > o.seen) text(g, 'Seen', x + W - pad, yy + h + sz * 0.9, { size: sz * 0.7, color: alpha(ui.cream, 0.6), font: FONTS.ui, weight: 900, align: 'right' });
    yy += h + sz * (m.me && o.seen ? 1.8 : 0.9); }
  if (o.typing && t > o.typing[0] && t < o.typing[1]) { const by = yy + 10; rr(g, x + pad, by, W * 0.26, H * 0.06, H * 0.03); g.fillStyle = THEM; g.fill();
    for (let i = 0; i < 3; i++) circle(g, x + pad + W * 0.07 + i * W * 0.06, by + H * 0.03 - Math.max(0, Math.sin(t * 9 - i * 0.9)) * H * 0.01, H * 0.009, alpha('#ffffff', 0.8)); }
  // input bar
  const iy = y + H - H * 0.09; rr(g, x + pad, iy, W - pad * 2, H * 0.06, H * 0.03); g.fillStyle = '#1c2840'; g.fill();
  if (o.draft) text(g, o.draft, x + pad * 2, iy + H * 0.031, { size: H * 0.028, color: ui.cream, font: FONTS.ui, weight: 900, align: 'left' });
  g.restore(); g.restore();
  return { x, y, W, H };
}
// ---- night bus interior (Juno's commute) ----
export const busGround = () => E.H * V(0.84, 0.7);
export function bus(g, t, cam, o = {}) {
  const M = mood('night'), GY = busGround(), CX = E.W / 2;
  layer(g, cam, 0.25, (g) => { backdrop(g, ['#05080f', '#0b1424', '#122036']);
    for (let i = 0; i < 18; i++) { const x = ((i * 241 - t * 900) % 3600 + 3600) % 3600 - 900, y = GY - 560 + (i % 4) * 40; glow(g, x, y, 60 + (i % 3) * 30, i % 3 ? M.practical : '#ff9a6a', 0.35); }
    FX.skyline(g, { x: -E.W - ((t * 300) % 400), y: GY - 380, w: E.W * 4, minH: 80, maxH: 260, color: '#0c1222', windowColor: alpha(M.practical, 0.6), lit: 0.25, seed: 44 }); });
  layer(g, cam, 0.7, (g) => {
    const wall = '#1a2436'; g.fillStyle = wall; g.fillRect(-E.W, -E.H, E.W * 3, GY - 640 + E.H); g.fillRect(-E.W, GY - 300, E.W * 3, 300 + E.H);
    for (let i = -3; i < 6; i++) { const wx = CX - 1500 + i * 520; g.fillStyle = wall; g.fillRect(wx + 440, GY - 660, 80, 380); }
    seg(g, [[-E.W, GY - 640], [E.W * 2, GY - 640]], 14, '#2a3650');
    for (let i = -3; i < 7; i++) { const sx = CX - 1500 + i * 300 + Math.sin(t * 2 + i) * 6; seg(g, [[sx, GY - 640], [sx + 4, GY - 560]], 4, '#3a4660'); ring(g, sx + 4, GY - 545, 16, 5, '#c9d2e8'); }
    for (let i = -2; i < 5; i++) { const px = CX - 1200 + i * 640; seg(g, [[px, GY - 650], [px, GY]], 12, '#c9b46a'); }
    g.fillStyle = linGrad(g, 0, GY, 0, GY + 200, ['#202838', '#0c1018']); g.fillRect(-E.W, GY, E.W * 3, E.H);
    glow(g, CX, GY - 680, 900, '#cfe8ff', 0.12); });
  return { GY, M };
}
