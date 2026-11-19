// shots/22_juno.js — ep03 f50–f66: Juno's side (bus, home, split screen), the three steps, "are we good?", ending.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround, DESK } from '../sets/bedroom.js';
import { thoughtCloud, fearShadow, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, voidStage, stamp, titleBackdrop, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { phone, bubble, emoji, pop, bus, busGround, ME, THEM } from '../sets/phone.js';
import { milo, juno, junoHome, sage, rimOf, miloBed, card, stepCard, zoomIn, SIT_PHONE, SIT_SLUMP } from '../sets/ep03kit.js';
import { YOU, MACC, MCOL, JUNO, VEX, ADA, SAGE, RAY, PIP, EXTRA } from '../cast.js';

const LONG = [{ me: true, bars: 4, at: -1, instant: true }, { me: true, bars: 3, at: -1, instant: true, emojis: 2 }];
const phoneBg = (g, t) => { backdrop(g, ['#05080f', '#0b1424', '#101c30']); FX.dust(g, t, { count: 40, color: '#9fd8ff', a: 0.2 }); };
// Juno at her desk at home (same flat-at-night look, desk side, lamp on)
function junoDesk(g, t, cam, o = {}) {
  const { GY, M } = bedroom(g, t, cam, { lamp: 1 }); const d = DESK(), x = d.x + 120, s = 1.3;
  layer(g, cam, 1, (g) => { junoHome(g, { x, y: GY, s, facing: 1, pose: breathe(SIT_PHONE, t, 1, 3), prop: 'phone', expr: o.expr || 'worried', look: [0.6, 0.5], rim: rimOf(M.practical, [1, -0.6]), shadow: false, blink: (t % 3.1) > 3.0 });
    glow(g, x + 44 * s, GY - 138 * s, 90, '#9fd8ff', 0.35); });
  return { GY, M, head: [x + 4 * s, GY - 180 * s] };
}

// f50 — "Which brings us back to Juno."
registerShot('f50', { draw(g, t, info) { phoneBg(g, t); const tj = wt('juno', info, 1.2);
  g.save(); zoomIn(g, t, 0.04); phone(g, t, E.W / 2, E.H * 0.45, V(760, 1150), [...LONG, { me: false, lines: ['ok.'], at: -1, instant: true, w: 0.3 }], { scroll: 0, nameGlow: ease.out(prog(t, tj - 0.1, tj + 0.4)) }); g.restore(); } });
// f51 — "Because Juno wasn't mad."
registerShot('f51', { draw(g, t, info) { const M = mood('night'); backdrop(g, [shade(M.sky[0], -0.2), M.sky[1], M.sky[2]]); FX.dust(g, t, { count: 30, color: '#cfe8ff', a: 0.2 });
  const r = V(270, 300) * (1 + 0.03 * t), fx = E.W * 0.42, fy = E.H * 0.56; bigFace(g, fx, fy, r, { outfit: JUNO, expr: 'smile', look: [0.3, 0.2], rimColor: '#ffd98a', rimSide: -1, blink: (t % 2.4) > 2.3 });
  stamp(g, t, wt('mad', info, 1.3) + 0.05, E.W * 0.74, E.H * 0.38, 'NOT MAD', { size: 72, color: S().ui.good || S().ui.gold }); } });
// f52 — "Juno was on a crowded bus, typing with one thumb."
registerShot('f52', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), GY = busGround(), cam = camOn(E.W / 2 + 40, GY - 320, 1.35 + 0.12 * k); const { M } = bus(g, t, cam); const tt = wt('typing', info, 1.8);
  const sway = Math.sin(t * 1.6) * 0.04;
  layer(g, cam, 1, (g) => { const pas = [[-520, '#4a5066', 'none', 1], [-300, '#6a4a5a', 'curly', -1], [330, '#3a5a6a', 'cap', -1], [560, '#5a5a4a', 'none', 1]];
    pas.forEach(([dx, c, hd, f], i) => drawChar(g, { x: E.W / 2 + dx, y: GY, s: 1.35, rot: sway, facing: f, outfit: { top: i % 2 ? 'hoodie' : 'suit', color: c, head: hd, headColor: '#2a2f3e', legs: '#22283a' }, pose: breathe(i % 2 ? POSES.phone : { ...POSES.stand, eF: [20, -200], hF: [24, -250] }, t, 1, i), prop: i % 2 ? 'phone' : null, expr: 'neutral', dim: 0.35, rim: rimOf('#cfe8ff', [0, -1]) }, [], {}));
    const jx = E.W / 2 + 40; juno(g, { x: jx, y: GY, s: 1.4, rot: sway, facing: 1, pose: breathe({ ...POSES.phone, eB: [-10, -200], hB: [-6, -252] }, t), prop: 'phone', expr: t > tt ? 'smile' : 'neutral', look: [0.6, 0.6], rim: rimOf('#cfe8ff', [0, -1]) });
    glow(g, jx + 40, GY - 166 * 1.4, 80, '#9fd8ff', 0.4); });
  text(g, 'CROWDED BUS', V(110, 80), V(150, 260), { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, align: 'left', alpha: ease.out(prog(t, 0.6, 1.0)) });
  if (t > tt) text(g, 'ONE THUMB', E.W - V(120, 80), V(150, 260), { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, align: 'right', alpha: ease.out(prog(t, tt, tt + 0.3)) });
} });
// f53 — "And right now, Juno is staring at her phone, thinking..."
registerShot('f53', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = camOn(DESK().x + 140, bedGround() - 330, 1.5 + 0.12 * k); junoDesk(g, t, cam, { expr: 'worried' });
  text(g, 'RIGHT NOW', V(110, 80), V(150, 260), { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, align: 'left', alpha: ease.out(prog(t, 0.2, 0.6)) }); } });
// f54 — '"Was 'ok.' too short?"'
registerShot('f54', { draw(g, t, info) { const cam = camOn(DESK().x + 200, bedGround() - 380, 1.75 + 0.06 * t); const J = junoDesk(g, t, cam, { expr: 'nervous' });
  const h = toScr(cam, J.head[0], J.head[1]); thoughtCloud(g, h[0] + 120, h[1] - 230, 560, 170, { scale: popIn(t, 0.05), label: 'WAS "OK." TOO SHORT?', labelSize: 36, tail: h }); } });
// f55 — '"Is Milo mad at me?"'  split: both of them, worrying about each other
registerShot('f55', { draw(g, t, info) { const mid = E.W / 2, sp = ease.inOut(prog(t, 0, 0.35));
  g.save(); g.beginPath(); g.rect(0, 0, mid, E.H); g.clip(); g.translate(-E.W * 0.25, 0); { const cam = camOn(DESK().x + 150, bedGround() - 330, 1.45 + 0.04 * t); const J = junoDesk(g, t, cam, { expr: 'nervous' }); const h = toScr(cam, J.head[0], J.head[1]);
    thoughtCloud(g, h[0] + 60, h[1] - 200, 420, 140, { label: 'IS MILO MAD AT ME?', labelSize: 32, tail: h }); } g.restore();
  if (sp > 0.02) { g.save(); g.beginPath(); g.rect(mid, 0, E.W - mid, E.H); g.clip(); g.translate(E.W * 0.25 + (1 - sp) * E.W * 0.5, 0); { const cam = camOn(E.W / 2 - 300, bedGround() - 330, 1.45 + 0.04 * t); const B = miloBed(g, t, cam, { expr: 'worried', lamp: 0.5 }); const h = toScr(cam, B.head[0], B.head[1]);
    thoughtCloud(g, h[0] + 60, h[1] - 200, 420, 140, { scale: popIn(t, 0.4), label: 'IS JUNO MAD AT ME?', labelSize: 32, tail: h }); } g.restore(); seg(g, [[mid, 0], [mid, E.H]], 6, S().ui.cream); }
  text(g, 'JUNO', V(60, 50), V(70, 120), { size: 36, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, align: 'left' }); if (sp > 0.5) text(g, 'MILO', mid + V(40, 30), V(70, 120), { size: 36, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, align: 'left' }); } });
// f56 — 'So next time your brain says, "They're mad at you," try this.'
registerShot('f56', { draw(g, t, info) {
  const cam = camOn(E.W / 2, GYv() - 300, 1.15 + 0.04 * t); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 + 200, spotC: '#bfefff' }); const tm = wt('mad', info, 1.8), tt = wt('try', info, 3.2);
  layer(g, cam, 1, (g) => { fearShadow(g, E.W / 2 - 380, GY, 640, t, { eyes: 1, grow: 1 - 0.25 * ease.inOut(prog(t, tt, tt + 0.6)) });
    sage(g, { x: E.W / 2 + 220, y: GY, s: 1.5, facing: -1, pose: breathe(posesAt(t, [[0, POSES.holdFront], [tt - 0.1, POSES.pointUp]]), t), prop: t < tt ? 'cup' : null, expr: 'smile', rim: rimOf('#bfefff', [0, -1]) }); });
  text(g, '"THEY\'RE MAD AT YOU"', E.W / 2 - 380, E.H * 0.2, { size: 40, color: alpha('#b0bccc', 0.9), font: FONTS.ui, weight: 900, spacing: 2, alpha: ease.out(prog(t, tm - 0.4, tm)) * (1 - 0.5 * prog(t, tt, tt + 0.4)) });
  card(g, t, tt, E.W / 2 + 300, E.H * 0.2, 380, 100, 'TRY THIS', { line: S().ui.accent, size: 48 });
} });
// f57 — "Notice the move."
registerShot('f57', { draw(g, t, info) { const cam = camOn(E.W / 2, GYv() - 300, 1.2 + 0.05 * t); const { GY } = voidStage(g, t, cam, { spotC: '#bfefff' });
  layer(g, cam, 1, (g) => { fearShadow(g, E.W / 2 + 260, GY, 560, t, { eyes: 1, grow: 0.8 }); milo(g, { x: E.W / 2 - 160, y: GY, s: 1.5, facing: 1, pose: breathe(posesAt(t, [[0, POSES.stand], [0.4, POSES.point]]), t), expr: 'determined', rim: rimOf('#bfefff', [0, -1]) }); });
  stepCard(g, t, 1, 'NOTICE THE MOVE'); } });
// f58 — "That's called mind reading, and your brain is guessing, not knowing."
registerShot('f58', { draw(g, t, info) { const cam = camOn(E.W / 2 - 100, GYv() - 300, 1.2 + 0.04 * t); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 - 200, spotC: '#c9b2ff' });
  const tm = wt('mind', info, 0.5), tg = wt('guessing', info, 2.4), tk = wt('knowing', info, 3.3);
  layer(g, cam, 1, (g) => { const x = E.W / 2 - 260; milo(g, { x, y: GY, s: 1.5, facing: 1, pose: breathe({ ...POSES.holdFront, hF: [44, -140], hB: [38, -142] }, t), expr: 'thinking', rim: rimOf('#c9b2ff', [0, -1]) });
    const bx = x + 110, by = GY - 300; glow(g, bx, by, 160, '#c9b2ff', 0.4 + 0.15 * Math.sin(t * 4)); circle(g, bx, by, 70, alpha('#c9b2ff', 0.55)); circle(g, bx - 20, by - 22, 18, alpha('#ffffff', 0.6)); rr(g, bx - 40, by + 66, 80, 22, 8); g.fillStyle = '#3a3550'; g.fill();
    text(g, '?', bx, by + 8, { size: 70, color: '#ffffff', weight: 700, alpha: 0.7 }); });
  text(g, 'MIND READING', E.W - V(480, 290), E.H * 0.24, { size: 60, color: '#c9b2ff', weight: 700, spacing: 4, glow: 16, glowColor: 'rgba(201,178,255,.5)', alpha: ease.out(prog(t, tm - 0.1, tm + 0.3)) });
  card(g, t, tg, E.W - V(560, 330), E.H * 0.46, 330, 96, 'GUESSING', { line: S().ui.accent, color: S().ui.accent, size: 40 });
  card(g, t, tk, E.W - V(220, 120), E.H * 0.46, 330, 96, 'KNOWING', { size: 40, cross: prog(t, tk + 0.2, tk + 0.6) }); } });
// f59 — "Then come up with three other reasons for the reply."
registerShot('f59', { draw(g, t, info) { voidStage(g, t, { z: 1 + 0.03 * t }, { spot: true, spotC: '#bfefff' }); stepCard(g, t, 2, '3 OTHER REASONS', { at: wt('three', info, 0.9) - 0.1 });
  for (let i = 0; i < 3; i++) { const p = popIn(t, wt('three', info, 0.9) + 0.2 + i * 0.2); rr(g, E.W * (0.3 + i * 0.2) - 110 * p, E.H * 0.5 - 130 * p, 220 * p, 260 * p, 20); g.fillStyle = alpha('#16203a', 0.9); g.fill(); if (p > 0.5) text(g, '?', E.W * (0.3 + i * 0.2), E.H * 0.5 + 6, { size: 100, color: S().ui.gold, weight: 700 }); } } });
// f60 — "They're busy. They're tired. They just text like that."
registerShot('f60', { draw(g, t, info) { voidStage(g, t, { z: 1 + 0.03 * t }, { spot: true, spotC: '#bfefff' }); stepCard(g, t, 2, '3 OTHER REASONS', { at: -1 });
  const items = [['BUSY', wt('busy', info, 0.3)], ['TIRED', wt('tired', info, 1.2)], ['JUST TEXTS', wt('just', info, 2.2), 'LIKE THAT']];
  items.forEach(([s, at, sub], i) => { const x = E.W * (0.3 + i * 0.2), y = E.H * 0.5, p = ease.outBack(prog(t, at - 0.1, at + 0.25)), fl = Math.cos(Math.PI * (1 - clamp(p))), front = fl > 0;
    g.save(); g.translate(x, y); g.scale(Math.max(0.05, Math.abs(fl)), 1); rr(g, -150, -150, 300, 300, 22); g.fillStyle = front ? '#1c2a26' : '#16203a'; g.fill(); g.strokeStyle = front ? (S().ui.good || S().ui.gold) : alpha(S().ui.gold, 0.4); g.lineWidth = 5; g.stroke();
    if (front) { const c = S().ui.good || S().ui.gold; if (i === 0) { ring(g, 0, -40, 50, 7, c); seg(g, [[0, -40], [0, -72]], 6, c); seg(g, [[0, -40], [24, -30]], 6, c); }
      else if (i === 1) { text(g, 'z z', 0, -40, { size: 70, color: c, weight: 700 }); } else { rr(g, -34, -100, 68, 110, 12); g.strokeStyle = c; g.lineWidth = 6; g.stroke(); text(g, 'k', 0, -44, { size: 40, color: c, font: FONTS.ui, weight: 900 }); }
      text(g, s, 0, sub ? 50 : 70, { size: sub ? 36 : 46, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); if (sub) text(g, sub, 0, 96, { size: 36, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); }
    else text(g, '?', 0, 6, { size: 100, color: S().ui.gold, weight: 700 }); g.restore(); }); } });
// f61 — "And if it still bothers you..."
registerShot('f61', { draw(g, t, info) { const cam = camOn(E.W / 2 - 300, bedGround() - 330, 1.45 + 0.05 * t); miloBed(g, t, cam, { expr: 'worried', lamp: 0.6, shadow: { x: E.W / 2 + 120, h: 360, grow: 1, eyes: 0.6 } }); } });
// f62 — 'ask. One honest "Hey, are we good?"'
registerShot('f62', { draw(g, t, info) { phoneBg(g, t); const th = wt('hey', info, 1.4), msg = 'Hey, are we good?', n = Math.floor(msg.length * clamp((t - th + 0.1) / 1.1));
  g.save(); zoomIn(g, t, 0.03); phone(g, t, E.W * 0.7, E.H * 0.45, V(720, 1050), [...LONG, { me: false, lines: ['ok.'], at: -1, instant: true, w: 0.3 }], { draft: n > 0 ? msg.slice(0, n) + (t % 0.6 < 0.3 ? '|' : '') : (t % 0.6 < 0.3 ? '|' : '') }); g.restore();
  stepCard(g, t, 3, 'ASK', { x: E.W * 0.28, y: E.H * 0.36, at: 0.02 });
  text(g, 'ONE HONEST QUESTION', E.W * 0.28, E.H * 0.52, { size: 38, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, th - 0.6, th - 0.2)) }); } });
// f63 — "can end a whole night of guessing."
registerShot('f63', { draw(g, t, info) { const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 330, bedGround() - 360, 1.6 - 0.1 * k);
  const B = miloBed(g, t, cam, { expr: t > 0.6 ? 'smile' : 'nervous', lamp: 0.6 + 0.4 * k, shadow: { x: E.W / 2 + 120, h: 360, grow: 1 - ease.inOut(prog(t, 0.6, 2.0)) * 0.85, eyes: 1 - prog(t, 0.6, 1.4) } }); const h = toScr(cam, B.head[0], B.head[1]);
  ['WHAT DID I DO?', 'IS SHE MAD?', 'WAS IT THE JOKE?'].forEach((s, i) => { const at = 0.5 + i * 0.35, gone = prog(t, at, at + 0.2); if (gone >= 1) { FX.sparkle(g, h[0] + (i - 1) * 300, h[1] - 260 - (i % 2) * 80, 40 * (1 - prog(t, at + 0.2, at + 0.6)), S().ui.cream); return; }
    thoughtCloud(g, h[0] + (i - 1) * 300, h[1] - 260 - (i % 2) * 80, 380, 130, { scale: 1 + gone * 0.3, a: 1 - gone, label: s, labelSize: 30 }); });
  const sent = ease.out(prog(t, 0.05, 0.6)); if (sent < 1) { const p0 = toScr(cam, B.x + 50, B.head[1] + 50); rr(g, lerp(p0[0], E.W + 200, sent), lerp(p0[1], -100, sent), 140, 50, 20); g.fillStyle = ME; g.fill(); } } });
// f64 — 'Most of the time, the answer is: "Of course. Why?"'
registerShot('f64', { draw(g, t, info) { phoneBg(g, t); const to = wt('course', info, 2.5) - 0.3;
  g.save(); zoomIn(g, t, 0.03); phone(g, t, E.W * 0.38, E.H * 0.46, V(760, 1100), [{ me: false, lines: ['ok.'], at: -1, instant: true, w: 0.3 }, { me: true, lines: ['Hey, are we good?'], at: -1, instant: true, w: 0.7 }, { me: false, lines: ['Of course. Why?'], at: to, w: 0.66, emojis: 1, emojiAt: [to + 0.6] }], { typing: [0.2, to] }); g.restore();
  const p = popIn(t, to + 0.3); if (p > 0) { const fx = E.W * 0.76, fy = E.H * 0.5, r = 190 * p; glow(g, fx, fy, r * 2, '#ffd98a', 0.25); bigFace(g, fx, fy, r, { outfit: YOU, expr: 'joy', rimColor: '#ffd98a', rimSide: -1 }); faceAcc(g, fx, fy, r, MACC, MCOL); }
  text(g, 'MOST OF THE TIME', E.W * 0.76, V(150, 260), { size: 38, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, 0.1, 0.5)) }); } });
// f65 — "So, what's the text that sent your brain spiraling?"
registerShot('f65', { draw(g, t, info) { phoneBg(g, t); const cx = E.W * 0.32, cy = E.H * 0.46;
  for (let i = 0; i < 120; i++) { const a = i * 0.28 + t * 1.4, r = 8 + i * 2.6; circle(g, cx + Math.cos(a) * r, cy + Math.sin(a) * r, 5, alpha(i % 2 ? S().ui.accent : '#c9b2ff', 0.8 * (1 - i / 130))); }
  rr(g, cx - 140, cy - 60, 280, 120, 50); g.fillStyle = THEM; g.fill(); text(g, 'ok.', cx, cy + 4, { size: 70, color: '#ffffff', font: FONTS.ui, weight: 900 });
  text(g, 'WHAT TEXT SENT', E.W * 0.68, E.H * 0.38, { size: 56, color: S().ui.cream, weight: 700, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.6)) });
  text(g, 'YOU SPIRALING?', E.W * 0.68, E.H * 0.38 + 80, { size: 64, color: S().ui.gold, weight: 700, spacing: 3, glow: 16, glowColor: alpha(S().ui.gold, 0.5), alpha: ease.out(prog(t, 0.6, 1.0)) });
  text(g, 'TELL ME IN THE COMMENTS ↓', E.W * 0.68, E.H * 0.62, { size: 34, color: alpha(S().ui.cream, 0.8), font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 1.4, 1.8)) }); } });
// f66 — end screen
registerShot('f66', { draw(g, t, info) { UI.endScreen(g, t, { question: 'What text sent YOU spiraling?', cast: [VEX, JUNO, ADA, YOU, SAGE, RAY, PIP], moodColors: ['#0f1424', '#1a1e34', '#2a2238'], rim: '#9fd0ff' }); } });
