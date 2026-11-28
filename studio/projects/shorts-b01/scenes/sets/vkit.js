// sets/vkit.js — native 9:16 Shorts kit: hook title band, share card, kitchen, counter, video call, voice note, helpers.
import { E, V, S, mood, layer, backdrop, ease, prog, clamp, lerp, rr, seg, circle, ring, poly, glow, alpha, shade, mix, linGrad, text, FONTS } from '/engine/core.js';
import { POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { voidStage, camOn, stamp } from './kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL } from '../cast.js';

export const TOP = 330, BOT = 1420;                 // keep subjects between the hook band and the captions
export const CY = (TOP + BOT) / 2;
export const rim = (c = '#bfefff', dir = [0, -1]) => ({ color: c, dir, w: 4 });
export const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);
export const extra = (g, o, color = '#5a6a7e', head = 'none') => drawChar(g, { outfit: { top: 'tshirt', color, head, headColor: shade(color, -0.4), legs: '#2a2f45' }, ...o }, [], {});
export const pop = (t, at, d = 0.3) => ease.outBack(prog(t, at, at + d));
export const W = () => E.W, H = () => E.H;

// persistent hook title at the top of every shot of a Short
export function hook(g, info) {
  const [a, b] = info.title || ['', '']; g.save();
  g.fillStyle = linGrad(g, 0, 0, 0, 300, ['rgba(4,10,18,.96)', 'rgba(4,10,18,.75)', 'rgba(4,10,18,0)']); g.fillRect(0, 0, E.W, 300);
  text(g, a, E.W / 2, 112, { size: 66, color: '#ffffff', weight: 700, spacing: 2, stroke: 10, strokeColor: 'rgba(0,0,0,.6)' });
  text(g, b, E.W / 2, 196, { size: 66, color: S().ui.gold, weight: 700, spacing: 2, stroke: 10, strokeColor: 'rgba(0,0,0,.6)', glow: 16, glowColor: alpha(S().ui.gold, 0.45) });
  g.restore();
}
// big centred label
export function label(g, t, at, str, y, o = {}) { const p = pop(t, at); if (p <= 0) return; g.save(); g.translate(E.W / 2, y); g.scale(p, p);
  text(g, str, 0, 0, { size: o.size || 68, color: o.color || S().ui.gold, weight: 700, spacing: 3, glow: 18, glowColor: alpha(o.color || S().ui.gold, 0.5), stroke: 8, strokeColor: 'rgba(0,0,0,.5)' }); g.restore(); }
// pill card with text
export function pill(g, t, at, x, y, str, o = {}) { const p = pop(t, at); if (p <= 0) return 0; const sz = o.size || 44, w = o.w || Math.max(260, str.length * sz * 0.62 + 80);
  g.save(); g.translate(x, y); g.scale(p, p); g.rotate(o.rot || 0); rr(g, -w / 2, -sz, w, sz * 2, sz); g.fillStyle = o.fill || 'rgba(10,30,44,.94)'; g.fill(); g.strokeStyle = o.line || S().ui.accent; g.lineWidth = 5; g.stroke();
  text(g, str, 0, 3, { size: sz, color: o.color || S().ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); if (o.cross) { const c = ease.out(clamp(o.cross)); seg(g, [[-w * 0.45, -sz * 0.6], [lerp(-w * 0.45, w * 0.45, c), lerp(-sz * 0.6, sz * 0.6, c)]], 9, S().ui.accent); } g.restore(); return p; }
// speech bubble with words
export function say(g, t, at, x, y, str, o = {}) { const p = pop(t, at, 0.25); if (p <= 0) return; const sz = o.size || 48, w = o.w || Math.max(220, str.length * sz * 0.6 + 70), h = sz * 2.1, side = o.side || 1;
  g.save(); g.translate(x, y); g.scale(p, p); rr(g, -w / 2, -h / 2, w, h, h * 0.4); g.fillStyle = o.fill || S().ui.cream; g.fill();
  poly(g, [[side * w * 0.12, h / 2 - 2], [side * w * 0.3, h / 2 + h * 0.4], [side * w * -0.02, h / 2 - 2]], o.fill || S().ui.cream);
  text(g, str, 0, 3, { size: sz, color: o.color || '#1a1420', font: FONTS.ui, weight: 900 }); g.restore(); }
export function bigMilo(g, t, x, y, r, expr, o = {}) { bigFace(g, x, y, r, { outfit: YOU, expr, look: o.look || [0, 0], rimColor: o.rim || mood('night').rim, rimSide: o.side || 1, face: o.face, blink: (t % 3) > 2.9 }); faceAcc(g, x, y, r, MACC, MCOL); }
// the shared "send this to the friend who…" shot
export function shareShot(g, t, info, lines) {
  const { GY } = voidStage(g, t, camOn(E.W / 2, 1200, 1.0 + 0.03 * t), { spotC: '#ffd98a' });
  const u = ease.inOut(prog(t, 0.1, 1.4)), px = lerp(E.W * 0.22, E.W * 0.82, u), py = lerp(1180, 520, u) - Math.sin(u * Math.PI) * 120;
  g.save(); g.translate(px, py); g.rotate(-0.5 + 0.3 * u); poly(g, [[-60, 30], [80, -20], [-40, -40]], '#ffffff'); poly(g, [[-40, -40], [80, -20], [-20, 0]], '#cfe0ff'); g.restore();
  for (let i = 1; i < 6; i++) { const v = clamp(u - i * 0.04); if (v <= 0) continue; circle(g, lerp(E.W * 0.22, E.W * 0.82, v), lerp(1180, 520, v) - Math.sin(v * Math.PI) * 120, 5, alpha('#ffffff', 0.5 - i * 0.07)); }
  pill(g, t, 0.15, E.W / 2, 720, 'SEND THIS TO', { size: 46, line: S().ui.gold });
  lines.forEach((s, i) => text(g, s, E.W / 2, 860 + i * 92, { size: 62, color: i === lines.length - 1 ? S().ui.gold : S().ui.cream, weight: 700, spacing: 2, alpha: ease.out(prog(t, 0.35 + i * 0.15, 0.6 + i * 0.15)) }));
  milo(g, { x: E.W / 2, y: 1400, s: 1.2, facing: 1, pose: breathe(POSES.point, t), expr: 'happy', rim: rim('#ffd98a') });
}
// kitchen: wall, doorway (left), fridge (right), counter
export function kitchen(g, t, cam, o = {}) {
  const M = mood('night'), GY = 1400;
  layer(g, cam, 0.5, (g) => { backdrop(g, ['#141c2e', '#1c2a40']); g.fillStyle = '#1a2436'; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    const dx = E.W / 2 - 330; rr(g, dx - 130, GY - 620, 260, 620, 6); g.fillStyle = '#0a0f1a'; g.fill(); g.strokeStyle = o.doorGlow ? S().ui.accent : '#3a4660'; g.lineWidth = o.doorGlow ? 14 : 18; g.strokeRect(dx - 130, GY - 620, 260, 620);
    if (o.doorGlow) glow(g, dx, GY - 310, 420, S().ui.accent, 0.35 * o.doorGlow);
    const fx = E.W / 2 + 290; rr(g, fx - 120, GY - 560, 240, 560, 18); g.fillStyle = '#c9d6e6'; g.fill(); seg(g, [[fx - 120, GY - 360], [fx + 120, GY - 360]], 5, '#8a9ab0'); seg(g, [[fx + 90, GY - 520], [fx + 90, GY - 420]], 8, '#8a9ab0');
    if (o.fridgeOpen) { rr(g, fx - 120, GY - 560, 240, 560, 18); g.fillStyle = '#fff6dc'; g.fill(); glow(g, fx, GY - 300, 500, '#fff3c8', 0.5); for (let k = 0; k < 4; k++) seg(g, [[fx - 100, GY - 460 + k * 110], [fx + 100, GY - 460 + k * 110]], 5, '#d8cba8'); }
    g.fillStyle = '#0e1626'; g.fillRect(-E.W, GY, E.W * 3, E.H); });
  return { GY, M };
}
// café counter with a barista
export function counter(g, t, cam, o = {}) {
  const GY = 1400; layer(g, cam, 0.5, (g) => { backdrop(g, ['#1a1420', '#2a1c26']); g.fillStyle = '#2a1e26'; g.fillRect(-E.W, -E.H, E.W * 3, GY + E.H);
    rr(g, E.W / 2 - 420, GY - 900, 840, 220, 16); g.fillStyle = '#120c12'; g.fill(); ['LATTE', 'MOCHA', 'FLAT WHITE'].forEach((s, i) => text(g, s, E.W / 2 - 300 + i * 300, GY - 790, { size: 34, color: '#f2d7a6', font: FONTS.ui, weight: 900 }));
    for (let i = 0; i < 3; i++) { FX.lightCone(g, E.W / 2 - 300 + i * 300, GY - 1000, { angle: Math.PI / 2, spread: 0.4, len: 600, color: '#ffcf8f', a: 0.08 }); circle(g, E.W / 2 - 300 + i * 300, GY - 1000, 16, '#ffcf8f'); } });
  return { GY };
}
export function counterTop(g, GY) { rr(g, -100, GY - 300, E.W + 200, 60, 10); g.fillStyle = '#5a3a2a'; g.fill(); g.fillStyle = '#3a2418'; g.fillRect(-100, GY - 240, E.W + 200, 240); }
// laptop video call with someone on screen
export function videoCall(g, t, x, y, w, who, o = {}) { const h = w * 0.62; rr(g, x - w / 2 - 16, y - h / 2 - 16, w + 32, h + 32, 16); g.fillStyle = '#0c0f18'; g.fill();
  g.save(); rr(g, x - w / 2, y - h / 2, w, h, 8); g.clip(); g.fillStyle = '#26344a'; g.fillRect(x - w / 2, y - h / 2, w, h); who(g, x, y + h * 0.42, w / 460); g.restore();
  rr(g, x - w * 0.6, y + h / 2 + 16, w * 1.2, 28, 8); g.fillStyle = '#1a2032'; g.fill();
  if (o.ended) { g.fillStyle = 'rgba(0,0,0,.6)'; g.fillRect(x - w / 2, y - h / 2, w, h); text(g, 'CALL ENDED', x, y, { size: w * 0.09, color: '#ff8a7a', font: FONTS.ui, weight: 900 }); } }
// voice-note player bubble with waveform; p = playhead 0..1
export function voiceNote(g, t, x, y, w, p, o = {}) { const h = 150; rr(g, x - w / 2, y - h / 2, w, h, 70); g.fillStyle = o.fill || '#8a5ad6'; g.fill();
  circle(g, x - w / 2 + 80, y, 46, '#ffffff'); poly(g, [[x - w / 2 + 66, y - 24], [x - w / 2 + 66, y + 24], [x - w / 2 + 102, y]], o.fill || '#8a5ad6');
  for (let i = 0; i < 26; i++) { const bx = x - w / 2 + 160 + i * ((w - 220) / 26), bh = 16 + 70 * Math.abs(Math.sin(i * 1.7 + 0.5)) * (o.low ? 0.6 : 1); rr(g, bx, y - bh / 2, 10, bh, 5); g.fillStyle = i / 26 < p ? '#ffffff' : alpha('#ffffff', 0.45); g.fill(); } }
export { stamp, voidStage, camOn };
