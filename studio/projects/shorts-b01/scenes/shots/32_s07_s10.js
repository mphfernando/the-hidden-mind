// shots/32_s07_s10.js — Shorts batch 01: S07 the laugh, S08 the order, S09 the typo, S10 "seen" (native 9:16).
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { cafe, cafeGround, cafeTable } from '../sets/cafe.js';
import { bedroom, bedGround, BED } from '../sets/bedroom.js';
import { thoughtCloud, popIn } from '../sets/motifs.js';
import { wt, titleBackdrop, brainIcon } from '../sets/kit2.js';
import { phone, ME, THEM } from '../sets/phone.js';
import { drawChar } from '../accessories.js';
import { JUNO } from '../cast.js';
import { hook, label, pill, say, bigMilo, shareShot, milo, extra, rim, pop, voidStage, camOn, counter, counterTop, TOP, BOT, CY } from '../sets/vkit.js';

const dark = (g, t) => { backdrop(g, ['#05080f', '#0b1424', '#101c30']); FX.dust(g, t, { count: 40, color: '#9fd8ff', a: 0.18 }); };
const LAUGH = { ...POSES.cheer }, HAHA = (g, x, y, t, a = 1) => text(g, 'HA', x, y - ((t * 50) % 40), { size: 44, color: alpha(S().ui.gold, a), weight: 700 });

// ---------- S07 THE LAUGH ----------
function group(g, t, o = {}) { const GY = cafeGround(), cam = camOn(E.W / 2, GY - 330, (o.z || 1.55) + 0.04 * t); const { M } = cafe(g, t, cam);
  const P = [[-330, '#c0563f', 'ponytail'], [-110, null], [110, '#3a8a6a', 'cap'], [330, '#4a5066', 'none']];
  layer(g, cam, 1, (g) => P.forEach(([dx, c, hd], i) => { const x = E.W / 2 + dx, laugh = o.laugh ? o.laugh(i) : false, ex = o.expr ? o.expr(i) : (laugh ? 'joy' : 'smile');
    if (c === null) milo(g, { x, y: GY, s: 1.25, facing: 1, pose: breathe(laugh ? LAUGH : POSES.relaxed, t), expr: ex, rim: rim(M.practical) });
    else extra(g, { x, y: GY, s: 1.25, facing: dx < 0 ? 1 : -1, pose: breathe(i === 0 && o.talk ? POSES.explain : laugh ? LAUGH : POSES.relaxed, t, 1, i), expr: ex, talk: i === 0 && o.talk ? 0.7 : 0, rim: rim(M.practical) }, c, hd);
    if (laugh) HAHA(g, x + 30, GY - 300, t + i * 0.3); })); return { GY }; }
registerShot('g1', { draw(g, t, info) { const tl = wt('laughs', info, 1.9); group(g, t, { talk: t < tl, laugh: (i) => t > tl && i !== 1 }); say(g, t, 0.1, E.W / 2 - 200, 470, '…AND THEN HE SAID…', { size: 40 }); hook(g, info); } });
registerShot('g2', { draw(g, t, info) { const tr = wt('realize', info, 1.8); group(g, t, { z: 1.8, laugh: (i) => i === 1 && t < tr + 0.3, expr: (i) => i === 1 ? (t > tr ? 'nervous' : 'joy') : 'neutral' }); hook(g, info); } });
registerShot('g3', { draw(g, t, info) { group(g, t, { expr: (i) => i === 1 ? 'shocked' : 'sad' }); say(g, t, 0.05, E.W / 2 - 200, 470, '…SO I GOT FIRED.', { size: 44 }); label(g, t, wt('joke', info, 0.9), 'NOT A JOKE', 620, { size: 64, color: S().ui.accent }); hook(g, info); } });
registerShot('g4', { draw(g, t, info) { UI.blueprint(g); const tt = wt('thirty', info, 4.6), ta = wt('alone', info, 7.6);
  label(g, t, 0.1, 'LAUGHTER IS SOCIAL', 440, { size: 60 }); const n = Math.round(30 * ease.out(prog(t, tt - 0.2, tt + 1.0)));
  if (t > tt - 0.2) { text(g, n + '×', E.W / 2, 760, { size: 190, color: S().ui.gold, weight: 700, glow: 24, glowColor: alpha(S().ui.gold, 0.5) }); text(g, 'MORE LIKELY TO LAUGH', E.W / 2, 900, { size: 42, color: S().ui.cream, font: FONTS.ui, weight: 900 }); }
  [[-1, 'WITH OTHERS', 4, tt], [1, 'ALONE', 1, ta]].forEach(([s, l, k, at]) => { if (t < at - 0.2) return; const x = E.W / 2 + s * 240; for (let j = 0; j < k; j++) extra(g, { x: x + (j - (k - 1) / 2) * 70, y: 1320, s: 0.7, facing: 1, pose: k > 1 ? LAUGH : POSES.stand, expr: k > 1 ? 'joy' : 'neutral', rim: rim() });
    text(g, l, x, 1390, { size: 36, color: S().ui.cream, font: FONTS.ui, weight: 900 }); }); hook(g, info); } });
registerShot('g5', { draw(g, t, info) { dark(g, t); pill(g, t, 0.05, E.W / 2, 760, 'THE JOKE', { size: 64, cross: prog(t, 0.5, 1.0) }); label(g, t, 0.9, 'NOT REALLY ABOUT', 560, { size: 56, color: S().ui.cream }); hook(g, info); } });
registerShot('g6', { draw(g, t, info) { group(g, t, { z: 1.45, laugh: () => true }); label(g, t, 0.1, 'IT\'S ABOUT THE GROUP', 470, { size: 60 }); hook(g, info); } });
registerShot('g7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'ALWAYS LAUGHS FIRST']); hook(g, info); } });
registerShot('g8', { draw(g, t, info) { group(g, t, { z: 1.8, laugh: (i) => i !== 1, expr: (i) => i === 1 ? 'nervous' : 'joy' }); label(g, t, 0.4, 'LAUGH OR NOT?', 470, { size: 60, color: S().ui.cream }); hook(g, info); } });

// ---------- S08 THE ORDER ----------
function queue(g, t, o = {}) { const cam = camOn(E.W / 2 + 40 + (o.dx || 0), 1150, (o.z || 1.25) * 1.3 + 0.03 * t); const { GY } = counter(g, t, cam);
  layer(g, cam, 1, (g) => { extra(g, { x: E.W / 2 + 250, y: GY - 60, s: 1.25, facing: -1, pose: breathe(POSES.holdFront, t), expr: o.baristaExpr || 'smile', rim: rim('#ffcf8f') }, '#2a2a34', 'none'); counterTop(g, GY);
    milo(g, { x: E.W / 2 - (o.mx ?? 120), y: GY + 40, s: 1.4, facing: 1, pose: breathe(o.pose || POSES.stand, t), expr: o.expr || 'nervous', rim: rim('#ffcf8f', [1, -0.4]) }); }); }
registerShot('o1', { draw(g, t, info) { queue(g, t, { mx: 300, expr: 'thinking' }); const tt = wt('ten', info, 2.6);
  thoughtCloud(g, E.W / 2 - 160, 520, 600, 200, { scale: popIn(t, 0.1), label: 'LARGE OAT LATTE…', labelSize: 44 }); if (t > tt) pill(g, t, tt, E.W / 2 + 260, 720, '× 10', { size: 60, line: S().ui.gold }); hook(g, info); } });
registerShot('o2', { draw(g, t, info) { queue(g, t, { expr: 'smile' }); say(g, t, 0.2, E.W / 2 + 250, 520, 'NEXT!', { side: -1, size: 60 }); say(g, t, wt('can', info, 2.6), E.W / 2 - 150, 700, 'CAN I…', { size: 56 }); hook(g, info); } });
registerShot('o3', { draw(g, t, info) { dark(g, t); bigMilo(g, t, E.W / 2, 1150, 260, 'scared', { face: { brows: 'angry' } });
  [['GET A…', 0.05, -200, 520], ['UH…', 0.5, 220, 600], ['LARGE…', 0.9, -180, 720], ['SMALL…', 1.3, 200, 800]].forEach(([s, at, dx, y]) => say(g, t, at, E.W / 2 + dx, y, s, { size: 46, side: dx > 0 ? -1 : 1 })); hook(g, info); } });
registerShot('o4', { draw(g, t, info) { queue(g, t, { expr: 'shocked', baristaExpr: 'confused', z: 1.4 }); say(g, t, 0.05, E.W / 2 - 150, 480, '…THING?', { size: 64 });
  const tc = wt('choking', info, 1.6); if (t > tc) { label(g, t, tc, 'CHOKING UNDER', 660, { size: 64, color: S().ui.accent }); label(g, t, tc + 0.1, 'PRESSURE', 750, { size: 64, color: S().ui.accent }); } hook(g, info); } });
registerShot('o5', { draw(g, t, info) { dark(g, t); const tf = wt('apart', info, 4.4); milo(g, { x: E.W / 2 - 160, y: 1420, s: 1.35, facing: 1, pose: breathe(POSES.stand, t), expr: 'nervous', rim: rim() });
  g.save(); g.translate(E.W / 2 + 160, 980); g.rotate(-0.5); ring(g, 0, 0, 110, 16, '#c9d2e8'); glow(g, 0, 0, 140, '#bfefff', 0.15); seg(g, [[70, 80], [190, 240]], 26, '#8a9ab0'); g.restore();
  for (let i = 0; i < 3; i++) { const fall = t > tf ? (t - tf) * 900 : 0, x = E.W / 2 - 160 + (i - 1) * 90, y = 640 + fall * (1 + i * 0.2); ring(g, x, y, 34, 12, '#9aa8c0'); for (let k = 0; k < 8; k++) { const a = k * 0.785 + t * (t > tf ? 0 : 2); seg(g, [[x + Math.cos(a) * 34, y + Math.sin(a) * 34], [x + Math.cos(a) * 50, y + Math.sin(a) * 50]], 10, '#9aa8c0'); } }
  label(g, t, 0.1, 'WATCHING YOURSELF', 440, { size: 56, color: S().ui.cream }); if (t > tf) label(g, t, tf, 'AUTOPILOT BREAKS', 530, { size: 60, color: S().ui.accent }); hook(g, info); } });
registerShot('o6', { draw(g, t, info) { UI.blueprint(g); brainIcon(g, E.W / 2, 900, 220, UI.bpStroke(), 7); const tb = wt('breaks', info, 1.8);
  if (t > tb) { const k = ease.out(prog(t, tb, tb + 0.3)); g.strokeStyle = S().ui.accent; g.lineWidth = 8; g.beginPath(); g.moveTo(E.W / 2, 680); [[30, 760], [-20, 840], [40, 920], [-10, 1000], [20, 1100]].slice(0, Math.ceil(k * 5)).forEach(([dx, y]) => g.lineTo(E.W / 2 + dx, y)); g.stroke(); }
  label(g, t, 0.1, 'THINKING TOO HARD', 470, { size: 62 }); label(g, t, tb, 'IS WHAT BREAKS IT', 1300, { size: 56, color: S().ui.accent }); hook(g, info); } });
registerShot('o7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'PRACTICES', 'THEIR ORDER']); hook(g, info); } });
registerShot('o8', { draw(g, t, info) { queue(g, t, { mx: 300, expr: 'thinking' }); thoughtCloud(g, E.W / 2 - 160, 520, 520, 180, { scale: popIn(t, 0.2), label: 'LARGE OAT…', labelSize: 44 }); hook(g, info); } });

// ---------- S09 THE TYPO ----------
const TYPO = ['Can\'t wait to see', 'you tomorow!'];
function typoPhone(g, t, o = {}) { const msgs = o.sent ? [{ me: true, lines: TYPO, at: o.sentAt ?? -1, instant: o.sentAt == null, size: 40, w: 0.8 }] : [];
  const r = phone(g, t, E.W / 2, CY + 110, 960, msgs, { name: 'JUNO', draft: o.sent ? null : TYPO.join(' ') }); return r; }
registerShot('y1', { draw(g, t, info) { dark(g, t); typoPhone(g, t); const n = Math.min(5, 1 + Math.floor(t / 0.35)); pill(g, t, 0.05, E.W / 2, 400, 'READ IT ' + n + '×', { size: 50, line: S().ui.gold }); hook(g, info); } });
registerShot('y2', { draw(g, t, info) { dark(g, t); const ts = wt('send', info, 1.0); typoPhone(g, t, { sent: t > ts, sentAt: ts }); label(g, t, 0.05, 'PERFECT.', 400, { size: 64, color: S().ui.good || S().ui.gold }); hook(g, info); } });
registerShot('y3', { draw(g, t, info) { dark(g, t); const tt = wt('typo', info, 1.2), z = 1 + 0.6 * ease.inOut(prog(t, 0.1, tt)); g.save(); g.translate(E.W / 2, CY); g.scale(z, z); g.translate(-E.W / 2, -CY); typoPhone(g, t, { sent: true }); g.restore();
  if (t > tt) { g.strokeStyle = S().ui.accent; g.lineWidth = 8; g.beginPath(); g.ellipse(E.W / 2 + 90, CY - 300 * z + 160, 170, 60, 0, 0, Math.PI * 2); g.stroke(); label(g, t, tt, 'TYPO.', 400, { size: 80, color: S().ui.accent }); } hook(g, info); } });
registerShot('y4', { draw(g, t, info) { dark(g, t); bigMilo(g, t, E.W / 2, 1100, 280, 'shocked'); label(g, t, 0.2, 'WHY ONLY', 470, { size: 64, color: S().ui.cream }); label(g, t, 0.5, 'AFTER SENDING?', 560, { size: 64 }); hook(g, info); } });
registerShot('y5', { draw(g, t, info) { UI.blueprint(g); brainIcon(g, E.W / 2, 1050, 200, UI.bpStroke(), 7); text(g, 'you tomorow!', E.W / 2, 600, { size: 64, color: S().ui.cream, font: FONTS.ui, weight: 900 });
  label(g, t, wt('own', info, 0.8), 'CHECKING YOUR OWN WORDS', 450, { size: 48, color: S().ui.gold }); hook(g, info); } });
registerShot('y6', { draw(g, t, info) { UI.blueprint(g); const k = ease.inOut(prog(t, 0.4, 1.4)); text(g, 'you tomorow!', E.W / 2, 720, { size: 70, color: alpha(S().ui.cream, 1 - k), font: FONTS.ui, weight: 900 });
  text(g, 'you tomorrow!', E.W / 2, 720, { size: 70, color: alpha(S().ui.good || S().ui.gold, k), font: FONTS.ui, weight: 900 }); brainIcon(g, E.W / 2, 1100, 180, UI.bpStroke(), 7); glow(g, E.W / 2, 1100, 260, S().ui.gold, 0.2 * k);
  label(g, t, wt('meant', info, 2.2), 'IT KNOWS WHAT YOU MEANT', 470, { size: 50 }); hook(g, info); } });
registerShot('y7', { draw(g, t, info) { UI.blueprint(g); const te = wt('expects', info, 1.0), ta = wt('actually', info, 3.2);
  if (t > te - 0.1) { pill(g, t, te, E.W / 2, 620, 'WHAT IT EXPECTS', { size: 42, line: S().ui.gold }); text(g, 'tomorrow', E.W / 2, 760, { size: 80, color: S().ui.gold, font: FONTS.ui, weight: 900 }); }
  if (t > ta - 0.1) { pill(g, t, ta, E.W / 2, 1000, 'WHAT\'S THERE', { size: 42, line: S().ui.accent }); text(g, 'tomorow', E.W / 2, 1140, { size: 80, color: S().ui.accent, font: FONTS.ui, weight: 900 }); } hook(g, info); } });
registerShot('y8', { draw(g, t, info) { dark(g, t); const ts = wt('stranger', info, 2.4); typoPhone(g, t, { sent: true }); if (t > ts) { extra(g, { x: E.W / 2 + 300, y: 1450, s: 1.0, facing: -1, pose: breathe(POSES.think, t), expr: 'confused', rim: rim() }, '#5a5a4a', 'none'); label(g, t, ts, 'LIKE A STRANGER', 400, { size: 64 }); } hook(g, info); } });
registerShot('y9', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'UNSENDS EVERYTHING']); hook(g, info); } });
registerShot('y10', { draw(g, t, info) { dark(g, t); typoPhone(g, t, { sent: true }); label(g, t, 0.3, 'READ IT AGAIN…', 400, { size: 64, color: S().ui.cream }); hook(g, info); } });

// ---------- S10 "SEEN" ----------
const SEENMSG = [{ me: true, lines: ['are we ok?'], at: -1, instant: true, size: 44, w: 0.6 }];
registerShot('s1', { draw(g, t, info) { dark(g, t); phone(g, t, E.W / 2, CY + 110, 960, SEENMSG, { name: 'JUNO', seen: 0.05 }); label(g, t, wt('reply', info, 0.8), 'NO REPLY.', 400, { size: 76, color: S().ui.accent }); hook(g, info); } });
function bedMilo(g, t, o = {}) { const cam = camOn(BED().x + BED().w - 80, bedGround() - 380, 1.9 + 0.04 * t); const { GY, M } = bedroom(g, t, cam, { lamp: 0.5 });
  layer(g, cam, 1, (g) => milo(g, { x: BED().x + BED().w - 80, y: GY, s: 1.3, facing: 1, pose: breathe({ ...POSES.sit, eF: [20, -112], hF: [34, -138], eB: [12, -112], hB: [28, -134] }, t), prop: 'phone', expr: o.expr || 'worried', look: [0.6, 0.5], rim: rim(M.rim, [-0.7, -0.7]), shadow: false })); return { cam }; }
function loop(g, x, y, r, gap, col, w = 18) { g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.beginPath(); g.arc(x, y, r, -Math.PI / 2 + gap / 2, Math.PI * 1.5 - gap / 2); g.stroke(); }
registerShot('s2', { draw(g, t, info) { bedMilo(g, t); loop(g, E.W / 2, 560, 130, 0.9, S().ui.gold); glow(g, E.W / 2, 560, 200, S().ui.gold, 0.2); label(g, t, wt('stick', info, 1.6), 'UNFINISHED = STICKY', 820, { size: 56 }); hook(g, info); } });
registerShot('s3', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); const tz = wt('zeigarnik', info, 1.4); label(g, t, 0.1, 'PSYCHOLOGISTS CALL IT', 820, { size: 46, color: S().ui.cream });
  if (t > tz) { label(g, t, tz, 'THE ZEIGARNIK', 960, { size: 84 }); label(g, t, tz + 0.12, 'EFFECT', 1060, { size: 84 }); } hook(g, info); } });
registerShot('s4', { draw(g, t, info) { dark(g, t); const tc = wt('closed', info, 4.4), gap = 0.9 * (1 - ease.inOut(prog(t, tc - 0.2, tc + 0.4)));
  loop(g, E.W / 2, 820, 240, Math.max(0.001, gap), gap > 0.05 ? S().ui.accent : S().ui.good || S().ui.gold, 26);
  for (let i = 0; i < 6; i++) { const a = t * 1.5 + i * 1.05; if (gap > 0.05) circle(g, E.W / 2 + Math.cos(a) * 340, 820 + Math.sin(a) * 340, 10, alpha(S().ui.cream, 0.5)); }
  label(g, t, 0.1, 'AN OPEN LOOP', 440, { size: 66, color: S().ui.accent }); label(g, t, wt('pulling', info, 1.2), 'PULLS YOUR ATTENTION', 1250, { size: 52, color: S().ui.cream }); if (t > tc) label(g, t, tc, 'UNTIL IT CLOSES', 1340, { size: 56 }); hook(g, info); } });
registerShot('s5', { draw(g, t, info) { dark(g, t); phone(g, t, E.W / 2, CY + 110, 960, SEENMSG, { name: 'JUNO', seen: 0.001 }); loop(g, E.W / 2, CY - 180, 380, 0.7, alpha(S().ui.accent, 0.8), 14);
  label(g, t, 0.3, 'NO REPLY = OPEN LOOP', 400, { size: 58, color: S().ui.accent }); hook(g, info); } });
registerShot('s6', { draw(g, t, info) { bedMilo(g, t, { expr: 'nervous' }); const n = 1 + Math.floor(t / 0.6); pill(g, t, 0.05, E.W / 2, 560, 'CHECKED ' + Math.min(n, 9) + '×', { size: 54, line: S().ui.accent }); hook(g, info); } });
registerShot('s7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'REPLIES', '3 DAYS LATER']); hook(g, info); } });
registerShot('s8', { draw(g, t, info) { dark(g, t); phone(g, t, E.W / 2, CY + 110, 960, SEENMSG, { name: 'JUNO', seen: 0.001 }); FX.rings(g, E.W / 2, CY - 300, t, { count: 2, r0: 40, r1: 300, speed: 1.4, color: '#ffffff', a: 0.35 });
  label(g, t, 0.2, 'CHECK YOUR PHONE…', 400, { size: 62, color: S().ui.cream }); hook(g, info); } });
