// shots/20_text.js — ep03 f01–f17: the "ok." text, the spiral, old software, texts have no face.
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, shake, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround } from '../sets/bedroom.js';
import { street, streetGround } from '../sets/street.js';
import { study, studyGround } from '../sets/study.js';
import { thoughtCloud, speechBubble, fearShadow, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, voidStage, stamp, titleBackdrop, GYv } from '../sets/kit2.js';
import { faceAcc } from '../accessories.js';
import { phone, bubble, emoji, pop } from '../sets/phone.js';
import { milo, juno, ada, rimOf, miloBed, card, zoomIn, WORRY, SIT_PHONE, SIT_SLUMP } from '../sets/ep03kit.js';
import { YOU, MACC, MCOL, JUNO } from '../cast.js';

const LONG = [{ me: true, bars: 4, at: -1, instant: true }, { me: true, bars: 4, at: -1, instant: true }, { me: true, bars: 3, at: -1, instant: true, emojis: 2 }];
const phoneBg = (g, t) => { const M = mood('night'); backdrop(g, ['#05080f', '#0b1424', '#101c30']); FX.dust(g, t, { count: 40, color: '#9fd8ff', a: 0.2 }); return M; };

// f01 — "You text your friend a long, funny message."
registerShot('f01', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 330 + 40 * k, bedGround() - 300, 1.45 + 0.08 * k);
  miloBed(g, t, cam, { expr: 'happy', extra: (g, GY, M, x, s) => { for (let i = 0; i < 3; i++) { const ph = (t * 0.9 + i / 3) % 1; rr(g, x + 70 + ph * 40, GY - 230 - ph * 160, 46, 30, 8); g.fillStyle = alpha(mix('#8a5ad6', '#ffffff', 0.3), 0.8 * (1 - ph)); g.fill(); } } });
  FX.dust(g, t, { count: 20, color: '#cfd8ff', a: 0.2 });
} });
// f02 — "Three paragraphs. Two emojis."
registerShot('f02', { draw(g, t, info) {
  phoneBg(g, t); const tp = wt('three', info, 0.0), te = wt('two', info, 1.1);
  const msgs = [{ me: true, bars: 4, at: tp - 0.05 }, { me: true, bars: 4, at: tp + 0.25 }, { me: true, bars: 3, at: tp + 0.55, emojis: 2, emojiAt: [te, te + 0.35] }];
  g.save(); zoomIn(g, t, 0.03); phone(g, t, E.W * 0.36, E.H * 0.44, V(740, 1100), msgs, {}); g.restore();
  const n = t < tp ? 0 : Math.min(3, 1 + Math.floor((t - tp) / 0.3));
  if (n) { text(g, String(n), E.W * 0.66, E.H * 0.34, { size: 120, color: S().ui.gold, weight: 700, glow: 20, glowColor: alpha(S().ui.gold, 0.5) }); text(g, 'PARAGRAPHS', E.W * 0.66 + 70, E.H * 0.34 + 6, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 }); }
  if (t > te) { text(g, t > te + 0.35 ? '2' : '1', E.W * 0.66, E.H * 0.56, { size: 120, color: S().ui.gold, weight: 700, glow: 20, glowColor: alpha(S().ui.gold, 0.5) }); text(g, 'EMOJIS', E.W * 0.66 + 70, E.H * 0.56 + 6, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
    emoji(g, E.W * 0.66 + 330, E.H * 0.56, 34 * pop(t, te), 'laugh'); emoji(g, E.W * 0.66 + 410, E.H * 0.56, 34 * pop(t, te + 0.35), 'grin'); }
} });
// f03 — "And she replies:"
registerShot('f03', { draw(g, t, info) {
  phoneBg(g, t); g.save(); zoomIn(g, t, 0.05); phone(g, t, E.W / 2, E.H * 0.45, V(760, 1150), LONG, { typing: [0.15, 9], scroll: 60 }); g.restore();
  text(g, 'JUNO IS TYPING…', E.W * 0.76, E.H * 0.45, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: 0.6 + 0.4 * Math.sin(t * 5) });
} });
// f04 — '"ok."'
registerShot('f04', { draw(g, t, info) {
  phoneBg(g, t); const [sx, sy] = shake(t, 10 * (1 - prog(t, 0.05, 0.4)), 30);
  g.save(); g.translate(sx, sy); zoomIn(g, t, 0.05); phone(g, t, E.W / 2, E.H * 0.45, V(760, 1150), [...LONG, { me: false, lines: ['ok.'], at: 0.02, w: 0.3 }], { scroll: 60 });
  veil(g, '#05080f', 0.35 * pop(t, 0.02)); const p = pop(t, 0.02, 0.25), bx = E.W / 2, by = E.H * 0.44;
  g.save(); g.translate(bx, by); g.scale(p, p); g.rotate(-0.04); glow(g, 0, 0, 380, '#9fd8ff', 0.25); rr(g, -260, -120, 520, 240, 100); g.fillStyle = '#2c3a52'; g.fill(); g.strokeStyle = alpha('#9fd8ff', 0.5); g.lineWidth = 5; g.stroke();
  text(g, 'ok.', 0, 6, { size: 170, color: '#ffffff', font: FONTS.ui, weight: 900 }); g.restore(); g.restore();
  FX.rings(g, bx, by, t, { count: 2, r0: 200, r1: 600, speed: 1.6, color: '#ffffff', a: 0.4 * (1 - prog(t, 0, 0.7)) });
} });
// f05 — "With a period."  extreme zoom into the dot
registerShot('f05', { draw(g, t, info) {
  backdrop(g, ['#05080f', '#0b1424']); const z = lerp(1, 7, ease.in(prog(t, 0.0, info.dur)));
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  rr(g, E.W / 2 - 260, E.H / 2 - 110, 520, 220, 90); g.fillStyle = '#2c3a52'; g.fill();
  text(g, 'ok', E.W / 2 - 50, E.H / 2 + 4, { size: 150, color: '#ffffff', font: FONTS.ui, weight: 900 });
  const dx = E.W / 2 + 85, dy = E.H / 2 + 40; glow(g, dx, dy, 60, S().ui.accent, 0.5 * prog(t, 0.3, 0.9)); circle(g, dx, dy, 16, mix('#ffffff', '#ff6f61', prog(t, 0.3, 0.9)));
  g.restore();
  text(g, 'THE PERIOD', E.W / 2, V(150, 280), { size: 70, color: S().ui.accent, weight: 700, spacing: 6, glow: 22, glowColor: alpha(S().ui.accent, 0.6), alpha: ease.out(prog(t, 0.25, 0.55)) });
} });
// f06 — "And just like that..."  smile drops
registerShot('f06', { draw(g, t, info) {
  blurLayer(g, 14, (g) => bedroom(g, t, camOn(E.W / 2 - 300, bedGround() - 300, 1.8), { lamp: 1 })); veil(g, '#05060f', 0.45);
  const M = mood('night'), r = V(300, 330) * (1 + 0.03 * t), fx = E.W * 0.5, fy = E.H * 0.58, drop = t > 0.55;
  glow(g, fx + 80, fy + 260, 300, '#9fd8ff', 0.25);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: drop ? 'shocked' : 'happy', look: [0.2, 0.6], rimColor: M.rim, rimSide: 1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
} });
// f07 — "your whole evening is gone."
registerShot('f07', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 260, bedGround() - 330, 1.25 - 0.05 * k);
  miloBed(g, t, cam, { pose: SIT_SLUMP, expr: 'sad', lamp: 1 - 0.7 * k, look: [0.3, 0.8], shadow: { h: 560, grow: 0.3 + 0.5 * k, eyes: 0 } });
  text(g, 'EVENING: GONE', E.W - V(360, 280), V(150, 260), { size: 40, color: S().ui.accent, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.8, 1.2)) });
} });
// f08 — "What did I do?"   f09 — "Is she mad at me?"
function spiral(g, t, info, n) {
  const cam = camOn(E.W / 2 - 330, bedGround() - 360, 1.7 + 0.08 * t);
  const B = miloBed(g, t, cam, { pose: SIT_PHONE, expr: 'worried', look: [0.5, 0.6], lamp: 0.4, shadow: { h: 600, grow: n === 1 ? 0.55 : 0.75, eyes: n === 1 ? 0 : 0.5 } });
  const h = toScr(cam, B.head[0], B.head[1]);
  const clouds = [['WHAT DID I DO?', -120, -250, 0.05], ['IS SHE MAD AT ME?', 260, -330, 0.05], ['WAS IT THE JOKE?', -380, -430, 0.6]];
  clouds.slice(0, n === 1 ? 1 : 3).forEach(([s, dx, dy, at], i) => { const a = n === 2 && i === 0 ? 0 : at; thoughtCloud(g, h[0] + dx * 1.2, h[1] + dy * 1.05, 470, 160, { scale: n === 2 && i === 0 ? 1 : popIn(t, a), label: s, labelSize: 38, labelColor: '#1a1420', tail: i === 0 ? h : null, fill: i === 1 ? '#ffd0c8' : S().ui.cream }); });
}
registerShot('f08', { draw(g, t, info) { spiral(g, t, info, 1); } });
registerShot('f09', { draw(g, t, info) { spiral(g, t, info, 2); } });
// f10 — "If your brain does this, you're not broken."
registerShot('f10', { draw(g, t, info) {
  const cam = camOn(E.W / 2, GYv() - 300, 1.15 + 0.04 * t); const { GY, M } = voidStage(g, t, cam, { spotC: '#bfefff' });
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2 - 40, y: GY, s: 1.5, facing: 1, pose: breathe(posesAt(t, [[0, POSES.handsOnHead], [wt('not', info, 1.6), POSES.shrug]]), t), expr: t > wt('not', info, 1.6) ? 'smile' : 'worried', rim: rimOf('#bfefff', [0, -1]) }));
  stamp(g, t, wt('broken', info, 2.0) + 0.1, E.W / 2 + 340, E.H * 0.34, 'NOT BROKEN', { size: 64, color: S().ui.good || S().ui.accent });
} });
// f11 — "You're running very old software."
registerShot('f11', { draw(g, t, info) {
  const cam = camOn(E.W / 2, GYv() - 330, 1.1 + 0.05 * t); const { GY } = voidStage(g, t, cam, { spotC: '#9af2ff' });
  layer(g, cam, 1, (g) => { const cx = E.W / 2, cy = GY - 330; rr(g, cx - 330, cy - 240, 660, 480, 40); g.fillStyle = '#c9c2a8'; g.fill(); rr(g, cx - 280, cy - 200, 560, 380, 30); g.fillStyle = '#0a1a10'; g.fill();
    rr(g, cx - 200, cy + 240, 400, 60, 10); g.fillStyle = '#a8a088'; g.fill(); rr(g, cx - 380, GY - 40, 760, 40, 8); g.fillStyle = '#8f8870'; g.fill();
    const green = '#5fff9a', o = ease.out(prog(t, 0.2, 0.5)); glow(g, cx, cy, 300, green, 0.15 * o);
    text(g, 'THREAT DETECTOR', cx, cy - 110, { size: 44, color: alpha(green, o), font: FONTS.ui, weight: 900, spacing: 3, glow: 10, glowColor: alpha(green, 0.6) });
    text(g, 'VERY OLD SOFTWARE', cx, cy - 40, { size: 30, color: alpha(green, ease.out(prog(t, wt('old', info, 1.0), wt('old', info, 1.0) + 0.3))), font: FONTS.ui, weight: 900, spacing: 3 });
    const lb = ease.inOut(prog(t, 0.6, info.dur)); rr(g, cx - 220, cy + 40, 440, 40, 8); g.strokeStyle = green; g.lineWidth = 4; g.stroke(); g.fillStyle = green; g.fillRect(cx - 212, cy + 48, 424 * lb * 0.35, 24);
    text(g, 'LOADING…', cx, cy + 120, { size: 26, color: alpha(green, 0.5 + 0.5 * Math.sin(t * 6)), font: FONTS.ui, weight: 900, spacing: 4 });
    for (let y = cy - 200; y < cy + 180; y += 8) { g.fillStyle = 'rgba(0,0,0,.18)'; g.fillRect(cx - 280, y, 560, 3); } });
} });
// f12 — "So why does a two-letter text feel like a threat?"
registerShot('f12', { draw(g, t, info) {
  phoneBg(g, t); const tw = wt('two', info, 1.0), tt = wt('threat', info, 2.4);
  g.save(); zoomIn(g, t, 0.03); const cx = E.W * 0.36, cy = E.H * 0.5; rr(g, cx - 220, cy - 100, 440, 200, 80); g.fillStyle = '#2c3a52'; g.fill(); text(g, 'ok.', cx, cy + 4, { size: 120, color: '#ffffff', font: FONTS.ui, weight: 900 }); g.restore();
  card(g, t, tw, E.W * 0.36, E.H * 0.2, 400, 90, '2 LETTERS', { size: 44 });
  const p = popIn(t, tt - 0.1); if (p > 0) { const x = E.W * 0.72, y = E.H * 0.48; g.save(); g.translate(x, y); g.scale(p, p); glow(g, 0, 0, 260, S().ui.accent, 0.35 + 0.15 * Math.sin(t * 12));
    poly(g, [[0, -170], [190, 150], [-190, 150]], S().ui.accent); poly(g, [[0, -120], [140, 118], [-140, 118]], '#1a0a0a'); text(g, '!', 0, 40, { size: 150, color: S().ui.accent, weight: 700 }); g.restore();
    text(g, 'THREAT?', x, y + 230, { size: 56, color: S().ui.accent, weight: 700, spacing: 5, alpha: p }); }
} });
// f13 — "And why are you almost always wrong about it?"
registerShot('f13', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); UI.titleCard(g, t, { lines: ['WHY YOU\'RE', 'ALMOST ALWAYS WRONG'], dur: info.dur, y: E.H * 0.42 }); } });
// f14 — "Here's the first problem."
registerShot('f14', { draw(g, t, info) {
  const cam = camOn(E.W / 2 - 300, studyGround() - 280, 1.6 + 0.06 * t); const { M } = study(g, t, cam, {});
  layer(g, cam, 1, (g) => ada(g, { x: E.W / 2 - 400, y: studyGround(), s: 1.4, facing: 1, pose: breathe(posesAt(t, [[0, POSES.stand], [0.25, POSES.pointUp]]), t), expr: 'smirk', rim: rimOf(M.rim, [1, -0.4]) }));
  UI.badge(g, { str: 'PROBLEM #1', a: ease.out(prog(t, 0.3, 0.6)), size: V(54, 56) }); FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.25 });
} });
// f15 — "A text has no face. No voice. No smile."
registerShot('f15', { draw(g, t, info) {
  voidStage(g, t, { z: 1 }, { spot: false }); const tf = wt('face', info, 0.8), tv = wt('voice', info, 1.9), ts = wt('smile', info, 3.0);
  const cx = E.W / 2, cy = E.H * 0.24; rr(g, cx - 180, cy - 70, 360, 140, 60); g.fillStyle = '#2c3a52'; g.fill(); text(g, 'ok.', cx, cy + 4, { size: 80, color: '#ffffff', font: FONTS.ui, weight: 900 });
  [['FACE', tf, -1], ['VOICE', tv, 0], ['SMILE', ts, 1]].forEach(([s, at, i]) => { const x = cx + i * V(480, 340), y = E.H * 0.56;
    const p = card(g, t, at, x, y, V(380, 300), 300, '', {}); if (p <= 0) return; g.save(); g.translate(x, y - 30); g.scale(p, p); const c = S().ui.gold;
    if (s === 'FACE') { ring(g, 0, 0, 70, 7, c); circle(g, -24, -14, 9, c); circle(g, 24, -14, 9, c); seg(g, [[-26, 26], [26, 26]], 7, c); }
    else if (s === 'VOICE') { for (let k = 0; k < 7; k++) { const hgt = 20 + 60 * Math.abs(Math.sin(k * 1.3 + t * 6)); rr(g, -90 + k * 28, -hgt / 2, 16, hgt, 8); g.fillStyle = c; g.fill(); } }
    else { g.strokeStyle = c; g.lineWidth = 9; g.beginPath(); g.arc(0, -10, 60, 0.3, Math.PI - 0.3); g.stroke(); }
    text(g, 'NO ' + s, 0, 110, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
    const c2 = ease.out(prog(t, at + 0.2, at + 0.5)); if (c2 > 0) seg(g, [[-120, -100], [lerp(-120, 120, c2), lerp(-100, 70, c2)]], 10, S().ui.accent); g.restore(); });
} });
// f16 — "In person, your brain reads tone from a hundred tiny signals."
const SIG = ['brows', 'smile', 'hands', 'voice', 'eyes', 'lean'];
function sigIcon(g, kind, x, y, r, c) { g.strokeStyle = c; g.lineWidth = 5; g.lineCap = 'round';
  if (kind === 'brows') { seg(g, [[x - r, y], [x - r * 0.2, y - r * 0.4]], 5, c); seg(g, [[x + r * 0.2, y - r * 0.4], [x + r, y]], 5, c); }
  else if (kind === 'smile') { g.beginPath(); g.arc(x, y - r * 0.4, r * 0.8, 0.4, Math.PI - 0.4); g.stroke(); }
  else if (kind === 'hands') { ring(g, x, y, r * 0.5, 5, c); for (let k = -2; k <= 1; k++) seg(g, [[x + k * r * 0.25, y - r * 0.4], [x + k * r * 0.3, y - r]], 5, c); }
  else if (kind === 'voice') { for (let k = 1; k <= 3; k++) { g.beginPath(); g.arc(x - r * 0.6, y, r * 0.4 * k, -0.7, 0.7); g.stroke(); } }
  else if (kind === 'eyes') { g.beginPath(); g.ellipse(x, y, r, r * 0.5, 0, 0, 7); g.stroke(); circle(g, x, y, r * 0.25, c); }
  else { seg(g, [[x - r, y + r * 0.6], [x + r * 0.4, y - r * 0.6]], 5, c); circle(g, x + r * 0.5, y - r * 0.8, r * 0.25, c); } }
registerShot('f16', { draw(g, t, info) {
  const GY = streetGround(), cam = camOn(E.W / 2 + 40, GY - 300, 1.45 + 0.05 * t); const { M } = street(g, t, cam);
  const jx = E.W / 2 + 160, mx = E.W / 2 - 120, th = wt('hundred', info, 2.6);
  layer(g, cam, 1, (g) => { juno(g, { x: jx, y: GY, s: 1.35, facing: -1, pose: breathe(posesAt(t, [[0, POSES.talk], [1.4, POSES.explain], [2.6, POSES.wave]]), t), expr: 'happy', talk: talkAmount(info.globalT, info.shot.start, info.shot.start + info.dur) * 0.6, rim: rimOf(M.rim, [-1, -0.4]) });
    milo(g, { x: mx, y: GY, s: 1.35, facing: 1, pose: breathe(POSES.relaxed, t), expr: 'smile', rim: rimOf(M.rim, [1, -0.4]) }); });
  const h = toScr(cam, jx, GY - 230 * 1.35); const n = Math.floor(6 * ease.out(prog(t, 0.4, th + 0.3)));
  for (let i = 0; i < n * 3; i++) { const a = i * 2.4 + t * 0.4, rr2 = 170 + (i % 3) * 70; const x = h[0] + Math.cos(a) * rr2, y = h[1] + 40 + Math.sin(a) * rr2 * 0.6; const c = alpha(i % 2 ? S().ui.gold : S().ui.accent, 0.85);
    circle(g, x, y, 34, alpha('#0a1a26', 0.7)); sigIcon(g, SIG[i % 6], x, y, 20, c); }
  if (t > th - 0.1) { const v = Math.round(100 * ease.out(prog(t, th - 0.1, th + 0.6))); UI.readout(g, { label: 'SIGNALS', value: String(v), x: V(90, 70), y: V(150, 260), size: V(64, 60) }); }
} });
// f17 — "In a message, almost all of them are missing."
registerShot('f17', { draw(g, t, info) {
  voidStage(g, t, { z: 1.0 + 0.03 * t }, { spot: false }); const tm = wt('missing', info, 2.2), fade = ease.inOut(prog(t, 0.3, tm + 0.3));
  const cx = E.W / 2, cy = E.H * 0.45;
  for (let i = 0; i < 18; i++) { const a = i * 2.4, r2 = 220 + (i % 3) * 90, x = cx + Math.cos(a) * r2 * (1 + fade * 0.6), y = cy + Math.sin(a) * r2 * 0.55 * (1 + fade * 0.6), al = (1 - fade) * (i === 7 ? 1 : 0.85);
    if (al <= 0.02) continue; g.save(); g.globalAlpha *= al; circle(g, x, y, 34, alpha('#0a1a26', 0.7)); sigIcon(g, SIG[i % 6], x, y, 20, i % 2 ? S().ui.gold : S().ui.accent); g.restore(); }
  rr(g, cx - 180, cy - 70, 360, 140, 60); g.fillStyle = '#2c3a52'; g.fill(); text(g, 'ok.', cx, cy + 4, { size: 80, color: '#ffffff', font: FONTS.ui, weight: 900 });
  text(g, 'MISSING', cx, E.H * 0.74, { size: 64, color: S().ui.accent, weight: 700, spacing: 6, glow: 18, glowColor: alpha(S().ui.accent, 0.5), alpha: ease.out(prog(t, tm - 0.1, tm + 0.3)) });
} });
