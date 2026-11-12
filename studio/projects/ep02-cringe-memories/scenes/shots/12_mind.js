// shots/12_mind.js — ep02 explainers: memory + amygdala, negativity bias, why at night, spotlight effect, ending.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { study, studyGround } from '../sets/study.js';
import { stage, stageGround, audience } from '../sets/stage.js';
import { thoughtCloud, speechBubble, fearShadow, popIn } from '../sets/motifs.js';
import { memoryFrame } from '../sets/memory.js';
import { wt, camOn, toScr, voidStage, brainIcon, heartIcon, stamp, titleBackdrop, GYv } from '../sets/kit2.js';
import { drawChar } from '../accessories.js';
import { YOU, MACC, MCOL, ADA, AACC, ACOL, JUNO, SAGE, VEX, RAY, PIP, EXTRA } from '../cast.js';

const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);
const rimOf = (c, dir = [-0.6, -0.8]) => ({ color: c, dir, w: 4 });
const BAUM = { top: 'tshirt', color: '#5a6a7e', head: 'none', face: 'glasses' };
const zoomIn = (g, t, k = 0.05) => { const z = 1 + k * t; g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2); };

// u13 — "The answer starts with how memories are made."
registerShot('u13', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold; g.save(); zoomIn(g, t);
  brainIcon(g, E.W * 0.68, E.H * 0.5, 200, gold, 8); glow(g, E.W * 0.68, E.H * 0.5, 300, gold, 0.15);
  for (let i = 0; i < 4; i++) { const u = ease.inOut(prog(t, 0.2 + i * 0.35, 1.2 + i * 0.35)); const x = lerp(E.W * 0.12, E.W * 0.68, u), y = E.H * (0.3 + i * 0.13) * (1 - u) + E.H * 0.5 * u;
    if (u < 1) { g.save(); g.globalAlpha *= 1 - u * 0.6; rr(g, x - 70, y - 44, 140, 88, 8); g.strokeStyle = c; g.lineWidth = 4; g.stroke(); for (let s = 0; s < 4; s++) { g.fillStyle = c; g.fillRect(x - 60 + s * 36, y - 40, 14, 8); g.fillRect(x - 60 + s * 36, y + 32, 14, 8); } g.restore(); } }
  g.restore(); text(g, 'HOW MEMORIES ARE MADE', E.W / 2, V(120, 260), { size: 50, color: S().ui.cream, spacing: 5, alpha: ease.out(prog(t, 0.2, 0.6)) }); } });
// u14 — "When something stirs up strong emotion, like shame, fear, or a hot rush of embarrassment,"
registerShot('u14', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), acc = S().ui.accent;
  const words = [['SHAME', wt('shame', info, 1.7)], ['FEAR', wt('fear', info, 2.3)], ['EMBARRASSMENT', wt('embarrassment', info, 3.6)]];
  const lvl = 0.15 + 0.85 * ease.inOut(prog(t, words[0][1] - 0.3, words[2][1] + 0.6)); const mx = E.W * 0.2, my = E.H * 0.5;
  rr(g, mx - 50, my - 300, 100, 600, 50); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); rr(g, mx - 38, my + 288 - 576 * lvl, 76, 576 * lvl, 38); g.fillStyle = mix(S().ui.gold, acc, lvl); g.fill(); glow(g, mx, my + 288 - 576 * lvl, 120, acc, 0.4 * lvl);
  text(g, 'EMOTION', mx, my + 360, { size: 32, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  words.forEach(([w, at], i) => { const p = ease.outBack(prog(t, at - 0.1, at + 0.25)); if (p <= 0) return; g.save(); g.translate(E.W * 0.6, E.H * (0.24 + i * 0.18)); g.scale(p, p); g.rotate((i - 1) * 0.05);
    rr(g, -260, -50, 520, 100, 50); g.fillStyle = i === 2 ? acc : alpha(acc, 0.25 + i * 0.2); g.fill(); text(g, w, 0, 4, { size: 48, color: '#ffffff', weight: 700, spacing: 3 }); g.restore(); }); } });
// u15 — "a small part of your brain called the amygdala gets involved."
registerShot('u15', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), acc = S().ui.accent, ta = wt('amygdala', info, 2.0); g.save(); zoomIn(g, t, 0.06);
  const bx = E.W / 2, by = E.H * 0.48; brainIcon(g, bx, by, 240, c, 7); const on = ease.out(prog(t, ta - 0.3, ta + 0.2));
  g.save(); g.translate(bx + 40, by + 70); g.rotate(0.5); g.fillStyle = mix('#3a4a6a', acc, on); g.beginPath(); g.ellipse(0, 0, 34, 20, 0, 0, Math.PI * 2); g.fill(); g.restore();
  glow(g, bx + 40, by + 70, 160, acc, 0.6 * on); if (on > 0) FX.rings(g, bx + 40, by + 70, t - ta, { count: 3, r0: 30, r1: 200, speed: 1.2, color: acc, a: 0.5 }); g.restore();
  UI.callout(g, t, { at: [bx + 40, by + 70], to: [bx + 330, by + 260], str: 'AMYGDALA', start: ta - 0.1, color: acc }); } });
// u16 — "It helps tag that moment as important."
registerShot('u16', { draw(g, t, info) { UI.blueprint(g); g.save(); zoomIn(g, t, 0.05); memoryFrame(g, E.W / 2, E.H * 0.48, 720, 420, t, { label: false }); g.restore();
  stamp(g, t, wt('important', info, 1.6) + 0.1, E.W / 2 + 120, E.H * 0.62, 'IMPORTANT', { size: 80 }); } });
// u17 — "And emotional moments like these tend to be stored more strongly than calm, everyday ones."
registerShot('u17', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), ts = wt('strongly', info, 2.6), fade = ease.inOut(prog(t, ts - 0.2, ts + 1.2));
  const lx = E.W * 0.28, rx = E.W * 0.72, y = E.H * 0.47;
  g.save(); g.globalAlpha *= 1 - 0.7 * fade; rr(g, lx - 260, y - 160, 520, 320, 14); g.strokeStyle = alpha(c, 0.7); g.lineWidth = 4; g.stroke(); for (let i = 0; i < 4; i++) { g.fillStyle = alpha(c, 0.4); g.fillRect(lx - 200, y - 100 + i * 60, 320 - (i % 2) * 80, 14); } g.restore();
  memoryFrame(g, rx, y, 520, 320, t, { label: false }); if (fade > 0) glow(g, rx, y, 360, '#ffb070', 0.2 * fade);
  text(g, 'CALM, EVERYDAY', lx, y + 220, { size: 36, color: alpha(c, 1 - 0.6 * fade), font: FONTS.ui, weight: 900, spacing: 3 }); text(g, 'EMOTIONAL', rx, y + 220, { size: 36, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3 }); } });
// u18 — "In other words... your brain didn't keep that memory by accident."
registerShot('u18', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2, GYv() - 330, 1.0 + 0.12 * k); const { GY } = voidStage(g, t, cam, { spotC: '#ffb070' });
  layer(g, cam, 0.6, (g) => { for (let r = 0; r < 4; r++) for (let i = 0; i < 16; i++) { const x = E.W / 2 - 1400 + i * 180, y = GY - 650 + r * 150; rr(g, x, y, 120, 80, 6); g.fillStyle = alpha('#2a3450', 0.7); g.fill(); g.strokeStyle = alpha('#4a5a80', 0.5); g.lineWidth = 2; g.stroke(); } });
  layer(g, cam, 1, (g) => { const x = E.W / 2, y = GY - 260; rr(g, x - 70, y + 140, 140, 120, 8); g.fillStyle = '#1a2236'; g.fill(); memoryFrame(g, x, y, 320, 190, t, { label: false });
    rr(g, x - 190, y - 130, 380, 270, 10); g.strokeStyle = alpha('#cfe8ff', 0.6); g.lineWidth = 4; g.stroke(); g.fillStyle = alpha('#cfe8ff', 0.06); g.fill(); });
  const ta = wt('accident', info, 3.1); text(g, 'NOT AN ACCIDENT', E.W / 2, V(140, 280), { size: 56, color: S().ui.gold, weight: 700, spacing: 4, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, ta - 0.1, ta + 0.3)) }); } });
// u19 — "It kept it on purpose."
registerShot('u19', { draw(g, t, info) { const cam = camOn(E.W / 2, GYv() - 330, 1.25 + 0.04 * t); const { GY } = voidStage(g, t, cam, { spotC: '#ffb070' });
  layer(g, cam, 1, (g) => { fearShadow(g, E.W / 2, GY, 620, t, { eyes: 1 }); memoryFrame(g, E.W / 2 + 10, GY - 300, 260, 150, t, { label: false }); });
  stamp(g, t, wt('purpose', info, 0.9) + 0.1, E.W / 2 + 300, E.H * 0.3, 'ON PURPOSE', { size: 64 }); } });
// u20 — "But there's a second reason the cringe hits so hard."  CRINGE gauge
registerShot('u20', { draw(g, t, info) { voidStage(g, t, { z: 1 }, { spot: false }); const cx = E.W / 2, cy = E.H * 0.62, R = 330, th = wt('hard', info, 2.4);
  for (let i = 0; i < 30; i++) { const a = Math.PI + (i / 29) * Math.PI; seg(g, [[cx + Math.cos(a) * (R - 40), cy + Math.sin(a) * (R - 40)], [cx + Math.cos(a) * R, cy + Math.sin(a) * R]], 10, mix('#2fb5a8', '#ff6f61', i / 29)); }
  const v = key(t, [[0, 0.1], [th - 0.4, 0.45], [th, 1.0], [th + 0.15, 0.93], [th + 0.3, 0.98]]); const a = Math.PI + v * Math.PI;
  const [sx, sy] = t > th ? shake(t, 8 * (1 - prog(t, th, th + 0.5)), 30) : [0, 0];
  seg(g, [[cx + sx, cy + sy], [cx + Math.cos(a) * (R - 60) + sx, cy + Math.sin(a) * (R - 60) + sy]], 12, '#ffffff'); circle(g, cx, cy, 26, '#ffffff');
  if (t > th) glow(g, cx + R * 0.8, cy - 60, 260, '#ff6f61', 0.4);
  text(g, 'CRINGE', cx, cy + 90, { size: 70, color: S().ui.cream, weight: 700, spacing: 8 }); } });
// u21 — "Psychologists call it the negativity bias."
registerShot('u21', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); const tn = wt('negativity', info, 1.5);
  UI.titleCard(g, t, { lines: t < tn - 0.1 ? ['PSYCHOLOGISTS CALL IT'] : ['PSYCHOLOGISTS CALL IT', 'NEGATIVITY BIAS'], dur: info.dur, y: E.H * 0.42 }); } });
// u22 — "In a well-known review, researchers led by Roy Baumeister concluded that,"
registerShot('u22', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 260 + 40 * k, studyGround() - 300, 1.35 + 0.05 * k);
  const { M } = study(g, t, cam, {}); const tr = wt('roy', info, 2.0), tv = wt('review', info, 0.6);
  layer(g, cam, 1, (g) => { drawChar(g, { x: E.W / 2 - 360, y: studyGround(), s: 1.4, facing: 1, outfit: BAUM, pose: breathe(posesAt(t, [[0, POSES.stand], [tv, POSES.holdFront]]), t), prop: t > tv ? 'paper' : null, expr: 'thinking', rim: rimOf(M.rim, [1, -0.4]) }, [], {}); });
  const h = toScr(cam, E.W / 2 - 360, studyGround() - 230 * 1.4); UI.callout(g, t, { at: h, to: [h[0] + 60, h[1] - 150], str: 'ROY BAUMEISTER', start: tr - 0.1 });
  text(g, 'A WELL-KNOWN REVIEW', E.W - V(420, 300), V(170, 280), { size: 30, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, tv, tv + 0.3)) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 }); } });
// u23 — "across many areas of life,"
function tileIcon(g, kind, x, y, c) { if (kind === 'WORK') { rr(g, x - 46, y - 30, 92, 60, 6); g.strokeStyle = c; g.lineWidth = 6; g.stroke(); seg(g, [[x - 60, y + 36], [x + 60, y + 36]], 6, c); }
  else if (kind === 'LOVE') heartIcon(g, x, y, 44, c, 6); else if (kind === 'FRIENDS') { ring(g, x - 24, y - 14, 18, 6, c); ring(g, x + 24, y - 14, 18, 6, c); seg(g, [[x - 50, y + 36], [x - 24, y + 12], [x, y + 36]], 6, c); seg(g, [[x, y + 36], [x + 24, y + 12], [x + 50, y + 36]], 6, c); }
  else { seg(g, [[x - 50, y], [x - 20, y], [x - 8, y - 30], [x + 8, y + 30], [x + 20, y], [x + 50, y]], 6, c); } }
registerShot('u23', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke();
  ['WORK', 'LOVE', 'FRIENDS', 'HEALTH'].forEach((s, i) => { const x = E.W * (0.2 + i * 0.2), y = E.H * 0.45, p = popIn(t, 0.1 + i * 0.25, 0.3); if (p <= 0) return; g.save(); g.translate(x, y); g.scale(p, p);
    rr(g, -130, -130, 260, 260, 24); g.strokeStyle = c; g.lineWidth = 4; g.stroke(); tileIcon(g, s, 0, -20, S().ui.gold); text(g, s, 0, 90, { size: 32, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }); } });
// u24 — "bad tends to be stronger than good."
registerShot('u24', { draw(g, t, info) { UI.blueprint(g); const tb = wt('bad', info, 0.2), ts = wt('stronger', info, 1.1), p = ease.outBack(prog(t, tb, tb + 0.3));
  g.save(); g.translate(E.W / 2, E.H * 0.46); g.scale(p, p); text(g, 'BAD', -260, 0, { size: 150, color: S().ui.accent, weight: 700, glow: 30, glowColor: alpha(S().ui.accent, 0.6) }); text(g, '>', 0, 0, { size: 150, color: S().ui.cream, weight: 700 }); text(g, 'GOOD', 280, 0, { size: 110, color: alpha(S().ui.cream, 0.7), weight: 700 }); g.restore();
  stamp(g, t, ts + 0.2, E.W / 2, E.H * 0.74, 'STRONGER', { size: 56, rot: -0.06 }); } });
// u25 / u26 — the balance scale
function scale(g, t, info, phase) { voidStage(g, t, { z: 1.0 }, { spot: false });
  const cx = E.W / 2, cy = E.H * 0.42, L = 520, tA = phase === 2 ? wt('awkward', info, 1.0) : 99, tTen = phase === 1 ? wt('ten', info, 0.6) : 0;
  const n = phase === 1 ? Math.min(10, Math.floor(ease.inOut(prog(t, 0.2, tTen + 0.8)) * 10.99)) : 10, drop = ease.in(prog(t, tA - 0.5, tA)), tip = phase === 2 ? ease.outBack(prog(t, tA, tA + 0.5)) : 0;
  const ang = lerp(-0.18 * (n / 10), 0.32, tip);
  poly(g, [[cx - 70, E.H * 0.86], [cx + 70, E.H * 0.86], [cx, cy]], '#3a4260'); circle(g, cx, cy, 16, '#cfd8ff');
  const end = (s) => [cx + Math.cos(ang) * L * s, cy + Math.sin(ang) * L * s * (s > 0 ? 1 : 1)];
  seg(g, [end(-1), end(1)], 12, '#cfd8ff');
  [[-1, 'COMPLIMENTS'], [1, 'AWKWARD']].forEach(([s, lab]) => { const [x, y] = end(s); seg(g, [[x, y], [x - 120, y + 160]], 3, '#cfd8ff'); seg(g, [[x, y], [x + 120, y + 160]], 3, '#cfd8ff'); rr(g, x - 150, y + 160, 300, 18, 9); g.fillStyle = '#cfd8ff'; g.fill();
    text(g, lab, x, y + 230, { size: 30, color: s < 0 ? S().ui.gold : S().ui.accent, font: FONTS.ui, weight: 900, spacing: 3 });
    if (s < 0) for (let i = 0; i < n; i++) { const bx = x - 110 + (i % 5) * 55, by = y + 130 - Math.floor(i / 5) * 50; heartIcon(g, bx, by, 18, S().ui.gold, 5); }
    else { const yy = phase === 2 ? lerp(-200, y + 110, drop) : -400; if (phase === 2) thoughtCloud(g, x, yy, 170, 90, { fill: S().ui.accent, label: 'AWKWARD', labelColor: '#ffffff', labelSize: 24 }); } });
  text(g, String(n), end(-1)[0], end(-1)[1] - 80, { size: 70, color: S().ui.gold, font: FONTS.ui, weight: 900 });
  if (phase === 2 && t > tA) { text(g, '1', end(1)[0], end(1)[1] - 80, { size: 70, color: S().ui.accent, font: FONTS.ui, weight: 900 }); FX.rings(g, end(1)[0], end(1)[1] + 110, t - tA, { count: 2, r0: 40, r1: 260, speed: 1.6, color: '#ffffff', a: 0.5 * (1 - prog(t, tA, tA + 0.8)) }); }
}
registerShot('u25', { draw(g, t, info) { scale(g, t, info, 1); } });
registerShot('u26', { draw(g, t, info) { scale(g, t, info, 2); } });
// u27 — "So why at night?"
registerShot('u27', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); UI.bigLine(g, t, { str: 'WHY AT NIGHT?', dur: info.dur + 0.3, y: E.H * 0.42, size: V(110, 90) }); } });
// u28 — "During the day, your mind is busy."
registerShot('u28', { draw(g, t, info) { const cam = camOn(E.W / 2 - 220, studyGround() - 300, 1.5 + 0.06 * t); const { M } = study(g, t, cam, {});
  layer(g, cam, 1, (g) => { const x = E.W / 2 - 300; milo(g, { x, y: studyGround(), s: 1.4, facing: 1, pose: breathe(POSES.phone, t), prop: 'phone', expr: 'nervous', rim: rimOf(M.rim, [1, -0.4]) });
    for (let i = 0; i < 4; i++) { const p = popIn(t, 0.2 + i * 0.4, 0.25); rr(g, x + 120 + (i % 2) * 40, studyGround() - 420 - i * 70, 220 * p, 50 * p, 14); g.fillStyle = alpha('#e9f0fb', 0.92 * p); g.fill(); if (p > 0.8) { circle(g, x + 150 + (i % 2) * 40, studyGround() - 395 - i * 70, 12, ['#ff6f61', '#2fb5a8', '#e0a92a', '#8a5ad6'][i]); g.fillStyle = '#5a6a86'; g.fillRect(x + 175 + (i % 2) * 40, studyGround() - 402 - i * 70, 120, 10); } } });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 }); } });
// u29 — "Messages. Noise. Work. People."
registerShot('u29', { draw(g, t, info) { const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.2), M.sky[1]]);
  const items = [['MESSAGES', 'messages'], ['NOISE', 'noise'], ['WORK', 'work'], ['PEOPLE', 'people']];
  items.forEach(([lab, w], i) => { const at = wt(w, info, 0.1 + i * 0.7), p = ease.outBack(prog(t, at - 0.1, at + 0.2)); if (p <= 0) return; const x = E.W * (0.14 + i * 0.24), y = E.H * 0.46;
    g.save(); g.translate(x, y); g.scale(p, p); g.rotate((i % 2 ? 1 : -1) * 0.04); rr(g, -190, -200, 380, 400, 26); g.fillStyle = '#16203a'; g.fill(); g.strokeStyle = S().ui.gold; g.lineWidth = 5; g.stroke();
    const c = S().ui.gold; if (i === 0) { rr(g, -50, -110, 100, 170, 14); g.strokeStyle = c; g.lineWidth = 7; g.stroke(); circle(g, 40, -110, 22, S().ui.accent); }
    else if (i === 1) { poly(g, [[-60, -60], [-20, -60], [20, -100], [20, 20], [-20, -20], [-60, -20]], c); for (let k = 1; k <= 3; k++) { g.strokeStyle = c; g.lineWidth = 6; g.beginPath(); g.arc(30, -40, 30 * k, -0.7, 0.7); g.stroke(); } }
    else if (i === 2) { tileIcon(g, 'WORK', 0, -40, c); } else { tileIcon(g, 'FRIENDS', 0, -40, c); }
    text(g, lab, 0, 130, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 }); g.restore(); }); } });
// u35 — "Sleep research suggests that when we're short on sleep, the brain's emotional reactions can run hotter than usual."
registerShot('u35', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), acc = S().ui.accent, ts = wt('short', info, 1.9), th = wt('hotter', info, 5.3);
  brainIcon(g, E.W * 0.38, E.H * 0.5, 220, c, 7); const heat = ease.inOut(prog(t, ts, th + 0.4)); glow(g, E.W * 0.38, E.H * 0.5, 320, acc, 0.35 * heat);
  const tx = E.W * 0.72, ty = E.H * 0.5; rr(g, tx - 34, ty - 260, 68, 420, 34); g.strokeStyle = S().ui.cream; g.lineWidth = 6; g.stroke(); circle(g, tx, ty + 190, 60, mix(S().ui.gold, acc, heat));
  rr(g, tx - 18, ty + 150 - 380 * (0.2 + 0.75 * heat), 36, 380 * (0.2 + 0.75 * heat) + 20, 18); g.fillStyle = mix(S().ui.gold, acc, heat); g.fill();
  text(g, 'SHORT ON SLEEP', E.W * 0.38, E.H * 0.16, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, ts - 0.1, ts + 0.3)) });
  text(g, 'EMOTIONAL REACTIONS', E.W * 0.38, E.H * 0.76, { size: 34, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 2.6, 3.0)) });
  text(g, 'HOTTER', tx + 70, ty - 230, { size: 44, color: acc, font: FONTS.ui, weight: 900, align: 'left', glow: 14, glowColor: alpha(acc, 0.6), alpha: ease.out(prog(t, th - 0.1, th + 0.2)) }); } });
// u36 — "Now here's the part almost nobody knows."
registerShot('u36', { draw(g, t, info) { const cam = camOn(E.W / 2 - 300, studyGround() - 280, 1.6 + 0.06 * t); const { M } = study(g, t, cam, {});
  layer(g, cam, 1, (g) => drawChar(g, { x: E.W / 2 - 400, y: studyGround(), s: 1.4, facing: 1, outfit: ADA, pose: breathe(posesAt(t, [[0, POSES.stand], [0.3, POSES.pointUp]]), t), expr: 'smirk', rim: rimOf(M.rim, [1, -0.4]) }, AACC, ACOL));
  const h = toScr(cam, E.W / 2 - 400 + 30, studyGround() - 340 * 1.4); if (t > 0.5) FX.sparkle(g, h[0], h[1], 30 + 6 * Math.sin(t * 8), S().ui.gold);
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 }); } });
// u37 — "In a famous study at Cornell, students were asked to wear an embarrassing T-shirt into a room full of people."
registerShot('u37', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 40, studyGround() - 300, 1.2 + 0.05 * k); const { M } = study(g, t, cam, {});
  const tc = wt('cornell', info, 1.2), tt = wt('shirt', info, 3.6), tw = wt('wear', info, 2.6); const jx = lerp(E.W / 2 - 900, E.W / 2 - 260, ease.out(prog(t, tw - 0.6, tw + 1.2)));
  layer(g, cam, 1, (g) => {
    [[E.W / 2 + 60, -1, 1], [E.W / 2 + 230, -1, 2], [E.W / 2 + 400, 1, 3], [E.W / 2 + 560, -1, 4]].forEach(([x, f, s]) => drawChar(g, { x, y: studyGround(), s: 1.25, facing: f, outfit: EXTRA, pose: breathe(s % 2 ? POSES.relaxed : POSES.phone, t, 1, s), prop: s % 2 ? null : 'phone', expr: 'neutral', rim: rimOf(M.rim, [1, -0.4]) }, [], {}));
    const walking = t > tw - 0.6 && t < tw + 1.2; drawChar(g, { x: jx, y: studyGround(), s: 1.35, facing: 1, outfit: { ...JUNO, color: '#f2c21a' }, pose: walking ? walkPose(t * 2 * Math.PI * 0.9) : breathe(POSES.stand, t), expr: t > tt ? 'nervous' : 'neutral', rim: rimOf(M.rim, [1, -0.4]) }, ['backpack'], { backpack: '#c0563f' });
    const ch = [jx + 6, studyGround() - 150 * 1.35]; heartIcon(g, ch[0], ch[1], 16, '#d64a33', 6);
    if (t > tt) UI.callout(g, t, { at: ch, to: [ch[0] - 120, ch[1] - 230], str: 'EMBARRASSING T-SHIRT', start: tt, color: S().ui.accent }); });
  text(g, 'CORNELL', V(140, 90), V(150, 260), { size: 44, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 5, align: 'left', alpha: ease.out(prog(t, tc - 0.1, tc + 0.3)) });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 }); } });
// u38 – u40 — guessed vs actual
function chart(g, t, info, phase) { const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]); const gold = S().ui.gold, acc = S().ui.accent;
  const x0 = V(560, 120), w = E.W - x0 - V(260, 120), rows = [[E.H * 0.4, 'THEY GUESSED', 0.5, '≈ HALF', acc], [E.H * 0.62, 'ACTUALLY NOTICED', 0.25, '≈ A QUARTER', gold]];
  text(g, 'WHO NOTICED THE T-SHIRT?', E.W / 2, V(150, 300), { size: 46, color: S().ui.cream, spacing: 3 });
  rows.forEach(([y, lab, v, s, col], i) => { text(g, lab, x0 - 40, y, { size: 32, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'right', spacing: 2 }); rr(g, x0, y - 34, w, 68, 34); g.fillStyle = alpha('#ffffff', 0.08); g.fill();
    let f = 0; if (i === 0) f = phase === 1 ? ease.inOut(prog(t, 0.3, wt('half', info, 1.9) + 0.3)) : 1; else f = phase === 3 ? ease.inOut(prog(t, 0.0, wt('quarter', info, 0.5) + 0.3)) : 0;
    if (f > 0) { rr(g, x0, y - 34, Math.max(68, w * v * f), 68, 34); g.fillStyle = col; g.fill(); text(g, s, x0 + w * v * f + 30, y + 2, { size: 42, color: col, font: FONTS.ui, weight: 900, align: 'left', alpha: clamp(f * 2 - 1) }); }
    if (i === 1 && phase === 2) text(g, '?', x0 + 60, y + 4, { size: 90, color: gold, weight: 700, alpha: ease.out(prog(t, 0.1, 0.4)) }); });
  text(g, 'Gilovich, Medvec & Savitsky (2000)', E.W - 50, E.H - 40, { size: 22, color: alpha(S().ui.cream, 0.5), font: FONTS.ui, weight: 800, align: 'right' }); }
registerShot('u38', { draw(g, t, info) { chart(g, t, info, 1); } });
registerShot('u39', { draw(g, t, info) { chart(g, t, info, 2); } });
registerShot('u40', { draw(g, t, info) { chart(g, t, info, 3); } });
// u41 – u43 — the spotlight effect on stage
function stageShot(g, t, info, o) { const cam = camOn(E.W / 2, stageGround() - 260, (o.z || 1.15) + 0.04 * t); const { GY } = stage(g, t, cam, { lights: o.lights || 0, spot: o.spot ?? 1 });
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2, y: GY, s: 1.5, facing: o.facing || 1, pose: breathe(o.pose || POSES.stand, t), expr: o.expr || 'nervous', look: o.look, rim: rimOf('#fff3d6', [0, -1]) }));
  audience(g, t, { eyes: o.eyes || 0, phones: o.phones || 0, lights: o.lights || 0 }); }
registerShot('u41', { draw(g, t, info) { stageShot(g, t, info, { expr: 'scared', pose: POSES.crossArms }); const ts = wt('spotlight', info, 1.5);
  text(g, 'SPOTLIGHT EFFECT', E.W / 2, V(140, 280), { size: 64, color: S().ui.gold, weight: 700, spacing: 5, glow: 22, glowColor: alpha(S().ui.gold, 0.6), alpha: ease.out(prog(t, ts - 0.1, ts + 0.3)) }); } });
registerShot('u42', { draw(g, t, info) { stageShot(g, t, info, { z: 1.3, expr: 'scared', look: [Math.sin(t * 2.5), 0.2], eyes: ease.out(prog(t, 0.3, 1.0)), facing: Math.sin(t * 2.5) > 0 ? 1 : -1 }); } });
registerShot('u43', { draw(g, t, info) { const tb = wt('busy', info, 0.9), up = ease.inOut(prog(t, tb - 0.3, tb + 0.5));
  stageShot(g, t, info, { lights: up, spot: 1 - 0.6 * up, phones: up, expr: up > 0.6 ? 'surprised' : 'scared', pose: up > 0.6 ? POSES.shrug : POSES.crossArms }); } });
// u53 — "Research on this kind of self-distancing suggests it can take some of the sting out of painful memories."
registerShot('u53', { draw(g, t, info) { const { GY } = voidStage(g, t, { z: 1 }, { spot: false }); const tsd = wt('self', info, 1.4), tst = wt('sting', info, 3.6), shrink = ease.inOut(prog(t, tsd, tst + 0.6));
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2; seg(g, [[E.W / 2, E.H * 0.45], [E.W / 2 + Math.cos(a) * 1400, E.H * 0.45 + Math.sin(a) * 1400]], 2, alpha('#4a5a80', 0.25)); }
  memoryFrame(g, E.W / 2, E.H * 0.45, lerp(900, 220, shrink), lerp(520, 127, shrink), t, { label: shrink < 0.5 });
  g.save(); g.globalAlpha *= 0.9; fearShadow(g, E.W * 0.82, GY + 40, lerp(620, 220, shrink), t, { eyes: 1 - 0.6 * shrink }); g.restore();
  text(g, 'SELF-DISTANCING', E.W / 2, V(110, 260), { size: 54, color: S().ui.gold, weight: 700, spacing: 4, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, tsd - 0.1, tsd + 0.3)) });
  text(g, 'LESS STING', E.W / 2, E.H * 0.82, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tst, tst + 0.3)) }); } });
// u57 — "Your brain replays these moments because it's trying to protect you."
registerShot('u57', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, tp = wt('protect', info, 2.9); g.save(); zoomIn(g, t, 0.05);
  brainIcon(g, E.W * 0.42, E.H * 0.48, 200, c, 7); const p = ease.outBack(prog(t, tp - 0.3, tp + 0.1));
  if (p > 0) { g.save(); g.translate(E.W * 0.62, E.H * 0.52); g.scale(p, p); g.fillStyle = alpha(gold, 0.18); g.strokeStyle = gold; g.lineWidth = 8; g.beginPath(); g.moveTo(0, -150); g.lineTo(120, -100); g.quadraticCurveTo(120, 80, 0, 160); g.quadraticCurveTo(-120, 80, -120, -100); g.closePath(); g.fill(); g.stroke(); seg(g, [[-40, 0], [-6, 36], [50, -40]], 12, gold); g.restore(); glow(g, E.W * 0.62, E.H * 0.52, 260, gold, 0.25 * p); }
  g.restore(); text(g, 'TRYING TO PROTECT YOU', E.W / 2, E.H * 0.86, { size: 44, color: gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tp, tp + 0.3)) }); } });
// u59 — the comment prompt
registerShot('u59', { draw(g, t, info) { const M = mood('dusk'); backdrop(g, [shade(M.sky[0], -0.4), shade(M.sky[1], -0.5)]); glow(g, E.W / 2, E.H, E.W * 0.5, '#ffb070', 0.25);
  const tc = wt('comments', info, 5.0), to = wt('only', info, 6.6);
  text(g, "What's the cringe memory", E.W / 2, V(150, 360), { size: 66, font: FONTS.serif, weight: 900, italic: true, color: S().ui.cream, alpha: ease.out(prog(t, 0.3, 0.8)) });
  text(g, 'your brain loves to replay?', E.W / 2, V(230, 440), { size: 66, font: FONTS.serif, weight: 900, italic: true, color: S().ui.gold, alpha: ease.out(prog(t, 0.9, 1.4)) });
  const said = ['YOU TOO!', 'WAVED BACK AT NOBODY', "CALLED TEACHER 'MOM'", 'PUSHED A PULL DOOR', 'LAUGHED AT THE WRONG TIME', 'SAID GOODBYE TWICE'];
  const n = t < tc ? 0 : t < to ? 2 : 2 + Math.floor((t - to) * 6);
  for (let i = 0; i < Math.min(n, 6); i++) { const x = E.W / 2 + (i % 2 ? 300 : -300), y = E.H * 0.42 + Math.floor(i / 2) * 150, p = popIn(t, i < 2 ? tc + i * 0.3 : to + (i - 2) * 0.16, 0.3);
    g.save(); g.translate(x, y); g.scale(p, p); rr(g, -270, -55, 540, 110, 24); g.fillStyle = alpha('#1e1a2e', 0.92); g.fill(); circle(g, -215, 0, 30, ['#8a5ad6', '#2fb5a8', '#e0a92a', '#d64a33', '#3fb950', '#3a6ea5'][i]);
    text(g, said[i], -170, 2, { size: 28, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left' }); g.restore(); }
  if (t > to) text(g, "YOU'RE NOT THE ONLY ONE", E.W / 2, E.H * 0.93, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, to, to + 0.3)) }); } });
// u60 — end screen
registerShot('u60', { draw(g, t, info) { UI.endScreen(g, t, { question: "What's YOUR cringe memory?", cast: [VEX, JUNO, ADA, YOU, SAGE, RAY, PIP], moodColors: ['#0f1424', '#1a1e34', '#2a2238'], rim: '#9fd0ff' }); } });
