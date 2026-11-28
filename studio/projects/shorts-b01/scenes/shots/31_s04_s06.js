// shots/31_s04_s06.js — Shorts batch 01: S04 your voice, S05 "love you, bye", S06 "we need to talk" (native 9:16).
import { E, V, S, registerShot, mood, layer, veil, backdrop, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { study, studyGround } from '../sets/study.js';
import { thoughtCloud, speechBubble, fearShadow, headProfile, popIn } from '../sets/motifs.js';
import { wt, titleBackdrop, brainIcon } from '../sets/kit2.js';
import { phone } from '../sets/phone.js';
import { drawChar } from '../accessories.js';
import { RAY } from '../cast.js';
import { hook, label, pill, say, bigMilo, shareShot, milo, extra, rim, pop, voidStage, camOn, stamp, videoCall, voiceNote, TOP, BOT, CY } from '../sets/vkit.js';

const dark = (g, t) => { backdrop(g, ['#05080f', '#0b1424', '#101c30']); FX.dust(g, t, { count: 40, color: '#9fd8ff', a: 0.18 }); };
const wave = (g, x, y, w, amp, t, col, k = 1) => { g.strokeStyle = col; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 60; i++) { const u = i / 60; g.lineTo(x + u * w, y + Math.sin(u * 14 * k + t * 6) * amp * Math.sin(u * Math.PI)); } g.stroke(); };

// ---------- S04 YOUR VOICE ----------
registerShot('v1', { draw(g, t, info) { dark(g, t); const p = clamp(t / info.dur);
  voiceNote(g, t, E.W / 2, 560, 860, p); bigMilo(g, t, E.W / 2, 1110, 270, t > 1.0 ? 'shocked' : 'neutral', { look: [0, -0.8] }); hook(g, info); } });
registerShot('v2', { draw(g, t, info) { dark(g, t); bigMilo(g, t, E.W / 2, 1080, 290 * (1 + 0.04 * t), 'scared', { face: { brows: 'angry' } });
  label(g, t, wt('not', info, 1.0), 'THAT\'S NOT ME', 500, { size: 78, color: S().ui.accent }); hook(g, info); } });
registerShot('v3', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), ta = wt('air', info, 2.4), tb = wt('bones', info, 4.0);
  const hx = E.W / 2 - 60, hy = 1300; headProfile(g, hx, hy, 0.75, { stroke: c, w: 6 }); label(g, t, 0.05, 'BUT IT IS.', 430, { size: 64 });
  const mouth = [hx + 300, hy - 250], ear = [hx - 20, hy - 420];
  if (t > ta) { for (let i = 0; i < 4; i++) { const r = ((t - ta) * 160 + i * 60) % 240; g.strokeStyle = alpha(S().ui.gold, 1 - r / 240); g.lineWidth = 5; g.beginPath(); g.arc(mouth[0], mouth[1], 40 + r, -1.4, 0.4); g.stroke(); }
    pill(g, t, ta, E.W - 230, 700, 'AIR', { size: 44, line: S().ui.gold }); }
  if (t > tb) { const u = ease.inOut(prog(t, tb, tb + 0.8)); g.setLineDash([12, 10]); seg(g, [mouth, [lerp(mouth[0], ear[0], u), lerp(mouth[1], ear[1], u)]], 8, S().ui.accent); g.setLineDash([]);
    glow(g, ear[0], ear[1], 120, S().ui.accent, 0.4 * u); pill(g, t, tb, E.W / 2 - 60, 620, 'BONE', { size: 44 }); }
  hook(g, info); } });
registerShot('v4', { draw(g, t, info) { UI.blueprint(g); text(g, 'WHAT YOU HEAR', E.W / 2, 520, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900 });
  wave(g, 120, 680, E.W - 240, 90, t, S().ui.accent, 0.6); text(g, 'RECORDING', E.W / 2, 950, { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900 }); wave(g, 120, 1100, E.W - 240, 50, t, S().ui.gold, 1.4);
  label(g, t, wt('deeper', info, 1.2), 'DEEPER TO YOU', 1320, { size: 60, color: S().ui.accent }); hook(g, info); } });
registerShot('v5', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(); const mx = E.W / 2, my = 980;
  rr(g, mx - 70, my - 200, 140, 260, 70); g.strokeStyle = c; g.lineWidth = 7; g.stroke(); seg(g, [[mx, my + 60], [mx, my + 220]], 8, c); seg(g, [[mx - 110, my + 220], [mx + 110, my + 220]], 8, c);
  for (let i = 0; i < 4; i++) { const r = ((t * 200 + i * 70) % 280); g.strokeStyle = alpha(S().ui.gold, 1 - r / 280); g.lineWidth = 5; g.beginPath(); g.arc(mx, my - 70, 120 + r, Math.PI * 0.75, Math.PI * 1.25); g.stroke(); g.beginPath(); g.arc(mx, my - 70, 120 + r, -Math.PI * 0.25, Math.PI * 0.25); g.stroke(); }
  label(g, t, wt('only', info, 0.8), 'ONLY THE AIR', 520, { size: 70 }); hook(g, info); } });
registerShot('v6', { draw(g, t, info) { dark(g, t); const tn = wt('never', info, 2.6);
  [[-300, '#3a8a6a', 'cap'], [0, '#c0563f', 'ponytail'], [300, '#4a5066', 'none']].forEach(([dx, c, hd], i) => { extra(g, { x: E.W / 2 + dx, y: 1080, s: 1.1, facing: dx > 0 ? -1 : 1, pose: breathe(POSES.relaxed, t, 1, i), expr: 'smile', rim: rim() }, c, hd);
    text(g, '♪', E.W / 2 + dx + 40, 760 - ((t * 60 + i * 30) % 80), { size: 54, color: S().ui.gold, weight: 700 }); });
  label(g, t, 0.1, 'THE VOICE EVERYONE KNOWS', 470, { size: 50, color: S().ui.cream });
  if (t > tn) { bigMilo(g, t, E.W / 2, 1300, 170 * pop(t, tn), 'surprised'); label(g, t, tn, 'YOU\'VE NEVER HEARD IT', 570, { size: 56 }); } hook(g, info); } });
registerShot('v7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'HATES VOICE NOTES']); hook(g, info); } });
registerShot('v8', { draw(g, t, info) { dark(g, t); const tp = wt('play', info, 0.4); voiceNote(g, t, E.W / 2, 760, 860, clamp((t - tp) / 2));
  if (t > tp) FX.rings(g, E.W / 2 - 350, 760, t - tp, { count: 2, r0: 50, r1: 220, speed: 1.6, color: '#ffffff', a: 0.5 }); bigMilo(g, t, E.W / 2, 1220, 180, 'nervous', { look: [0, -1] }); hook(g, info); } });

// ---------- S05 "LOVE YOU, BYE" ----------
const ray = (g, x, y, s) => drawChar(g, { x, y, s, facing: 1, outfit: RAY, pose: POSES.stand, expr: 'neutral', rim: rim() }, ['tie'], { tie: '#c0392b' });
function desk(g, t, o = {}) { const cam = camOn(E.W / 2, studyGround() - 380, 1.55 + 0.04 * t); const { M } = study(g, t, cam, {}); const GY = studyGround();
  layer(g, cam, 1, (g) => { rr(g, E.W / 2 - 320, GY - 150, 640, 22, 6); g.fillStyle = shade(M.wall, -0.6); g.fill(); g.fillRect(E.W / 2 - 300, GY - 150, 16, 150); g.fillRect(E.W / 2 + 284, GY - 150, 16, 150);
    milo(g, { x: E.W / 2 - 140, y: GY, s: 1.35, facing: 1, pose: breathe(POSES.sit, t), expr: o.expr || 'smile', talk: o.talk || 0, rim: rim(M.rim, [1, -0.4]), shadow: false }); });
  const sc = [E.W / 2 + 130, 560]; videoCall(g, t, sc[0], sc[1], 420, (g, x, y, s) => { drawChar(g, { x, y, s: 1.0 * s, facing: -1, outfit: RAY, pose: POSES.stand, expr: o.rayExpr || 'neutral', rim: rim() }, ['tie'], { tie: '#c0392b' }); }, { ended: o.ended });
  return { GY }; }
registerShot('l1', { draw(g, t, info) { desk(g, t, { expr: 'smile' }); pill(g, t, wt('ends', info, 1.0), E.W / 2, 900, 'BOSS: "OK, THANKS ALL"', { size: 38, line: S().ui.gold }); hook(g, info); } });
registerShot('l2', { draw(g, t, info) { dark(g, t); bigMilo(g, t, E.W / 2, 1140, 260, 'happy'); say(g, t, wt('okay', info, 0.6), E.W / 2, 600, 'OKAY, LOVE YOU, BYE!', { size: 56 }); hook(g, info); } });
registerShot('l3', { draw(g, t, info) { desk(g, t, { expr: 'shocked', rayExpr: 'surprised' }); const ta = wt('action', info, 2.6);
  label(g, t, 0.1, '…silence…', 900, { size: 54, color: S().ui.cream }); if (t > ta) { label(g, t, ta, 'ACTION', 1060, { size: 90 }); label(g, t, ta + 0.12, 'SLIP', 1160, { size: 90 }); } hook(g, info); } });
registerShot('l4', { draw(g, t, info) { UI.blueprint(g); brainIcon(g, E.W / 2, 900, 220, UI.bpStroke(), 7); const on = ease.out(prog(t, wt('autopilot', info, 2.4) - 0.2, wt('autopilot', info, 2.4) + 0.2));
  rr(g, E.W / 2 - 150, 1200, 300, 90, 45); g.fillStyle = mix('#33405a', S().ui.good || S().ui.gold, on); g.fill(); circle(g, lerp(E.W / 2 - 105, E.W / 2 + 105, on), 1245, 38, '#ffffff');
  text(g, 'AUTOPILOT', E.W / 2, 1360, { size: 44, color: S().ui.cream, font: FONTS.ui, weight: 900 });
  ['LOVE YOU, BYE', 'LOVE YOU, BYE', 'LOVE YOU, BYE'].forEach((s, i) => text(g, s, E.W / 2 + (i - 1) * 40, 470 + i * 70, { size: 40, color: alpha(S().ui.gold, 0.9 - i * 0.25), font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.2 + i * 0.25, 0.5 + i * 0.25)) }));
  hook(g, info); } });
registerShot('l5', { draw(g, t, info) { dark(g, t); const tg = wt('grabs', info, 2.4); const cx = E.W / 2, cy = 900;
  ring(g, cx, cy, 230, 34, '#c9d2e8'); for (let i = 0; i < 3; i++) { const a = -Math.PI / 2 + i * 2.09; seg(g, [[cx, cy], [cx + Math.cos(a) * 210, cy + Math.sin(a) * 210]], 24, '#c9d2e8'); } circle(g, cx, cy, 50, '#8a9ab0');
  const u = ease.out(prog(t, tg - 0.4, tg + 0.3)); g.save(); g.translate(lerp(E.W + 200, cx + 200, u), cy - 160); rr(g, -60, -40, 260, 80, 30); g.fillStyle = '#5a6a86'; g.fill(); circle(g, -60, 0, 56, '#9aa8c0'); g.restore();
  label(g, t, 0.1, 'NOT PAYING ATTENTION?', 470, { size: 52, color: S().ui.cream }); if (t > tg) label(g, t, tg, 'AUTOPILOT TAKES OVER', 1300, { size: 56, color: S().ui.accent }); hook(g, info); } });
registerShot('l6', { draw(g, t, info) { dark(g, t); const th = wt('habit', info, 1.8);
  pill(g, t, 0.1, E.W / 2, 620, 'A SECRET FEELING', { size: 50, cross: prog(t, 0.6, 1.0) }); if (t > th) { label(g, t, th, 'A HABIT', 880, { size: 96 }); label(g, t, th + 0.15, 'IN THE WRONG PLACE', 990, { size: 56, color: S().ui.cream }); }
  milo(g, { x: E.W / 2, y: 1420, s: 1.2, facing: 1, pose: breathe(POSES.shrug, t), expr: 'smile', rim: rim() }); hook(g, info); } });
registerShot('l7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO SAID', '"YOU TOO"', 'TO A WAITER']); hook(g, info); } });
registerShot('l8', { draw(g, t, info) { desk(g, t, { expr: 'nervous' }); pill(g, t, wt('end', info, 0.9), E.W / 2, 900, 'NEXT CALL…', { size: 46, line: S().ui.accent }); hook(g, info); } });

// ---------- S06 "WE NEED TO TALK" ----------
const MSG = [{ me: false, lines: ['Hey.'], at: 0.05, size: 46, w: 0.4 }, { me: false, lines: ['We need to talk.'], at: 0.45, size: 46, w: 0.78 }];
registerShot('t1', { draw(g, t, info) { dark(g, t); phone(g, t, E.W / 2, CY + 90, 960, MSG.map((m, i) => ({ ...m, at: i ? wt('need', info, 0.6) - 0.05 : 0.05 })), { name: 'JUNO' });
  if (t > wt('context', info, 1.9)) pill(g, t, wt('context', info, 1.9), E.W / 2, 1300, 'NO CONTEXT.', { size: 52, line: S().ui.accent }); hook(g, info); } });
registerShot('t2', { draw(g, t, info) { dark(g, t); bigMilo(g, t, E.W / 2, 1150, 250, 'scared', { face: { brows: 'angry' } });
  g.strokeStyle = S().ui.accent; g.lineWidth = 8; g.beginPath(); for (let i = 0; i <= 120; i++) { const x = i / 120 * E.W, ph = (i / 120 * 6 - t * 3) % 1, y = 620 - (ph > 0.45 && ph < 0.55 ? Math.sin((ph - 0.45) * 31.4) * 160 : 0); g.lineTo(x, y); } g.stroke();
  label(g, t, 0.2, 'HEART: RACING', 470, { size: 56, color: S().ui.accent }); hook(g, info); } });
registerShot('t3', { draw(g, t, info) { dark(g, t); const tb = wt('bad', info, 2.0);
  [[-1, 'BAD NEWS', S().ui.gold, tb], [1, '???', S().ui.accent, 0.4]].forEach(([s, l, c, at]) => { const x = E.W / 2 + s * 230, p = pop(t, at); if (p <= 0) return; g.save(); g.translate(x, 900); g.scale(p, p);
    rr(g, -170, -300, 340, 600, 16); g.fillStyle = '#16203a'; g.fill(); g.strokeStyle = c; g.lineWidth = 7; g.stroke(); circle(g, 120, 0, 16, c); text(g, l, 0, -380, { size: 52, color: c, weight: 700 }); g.restore(); });
  label(g, t, 0.1, 'WHICH IS WORSE?', 470, { size: 58, color: S().ui.cream }); hook(g, info); } });
registerShot('t4', { draw(g, t, info) { UI.blueprint(g); const tc = wt('couldn\'t', info, 2.6), tk = wt('knew', info, 5.0);
  pill(g, t, 0.1, E.W / 2, 450, 'ONE STUDY', { size: 44, line: S().ui.gold });
  [[700, 'SHOCK: CAN\'T PREDICT', 0.9, tc, S().ui.accent], [1060, 'SHOCK: KNOWN', 0.45, tk, S().ui.gold]].forEach(([y, l, v, at, c]) => { if (t < at - 0.1) return;
    text(g, l, E.W / 2, y, { size: 42, color: S().ui.cream, font: FONTS.ui, weight: 900 }); rr(g, 140, y + 60, 800, 50, 25); g.fillStyle = alpha('#ffffff', 0.1); g.fill();
    rr(g, 140, y + 60, 800 * v * ease.out(prog(t, at, at + 0.8)), 50, 25); g.fillStyle = c; g.fill(); text(g, 'STRESS', 150, y + 160, { size: 32, color: alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, align: 'left' }); });
  hook(g, info); } });
registerShot('t5', { draw(g, t, info) { dark(g, t); thoughtCloud(g, E.W / 2, 760, 520, 300, { scale: popIn(t, 0.05), label: '?', labelSize: 220, labelColor: S().ui.accent });
  milo(g, { x: E.W / 2, y: 1420, s: 1.3, facing: 1, pose: breathe(POSES.handsOnHead, t), expr: 'scared', rim: rim() }); label(g, t, wt('stressful', info, 1.2), 'UNCERTAINTY = STRESS', 470, { size: 58, color: S().ui.accent }); hook(g, info); } });
registerShot('t6', { draw(g, t, info) { dark(g, t); const tw = wt('worst', info, 2.2), k = ease.inOut(prog(t, 0.3, tw + 0.4)); fearShadow(g, E.W / 2 - 220, 1450, 900, t, { eyes: 1 });
  speechBubble(g, E.W / 2 + 120, 640, 760, 260, { lines: 0, fill: '#ffe6e0' }); const s = 'YOU\'RE IN TROUBLE'; text(g, s.slice(0, Math.floor(s.length * k)), E.W / 2 + 120, 646, { size: 56, color: '#b02a20', weight: 700 });
  label(g, t, tw, 'THE WORST VERSION', 1320, { size: 56, color: S().ui.accent }); hook(g, info); } });
registerShot('t7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO TEXTS', '"WE NEED TO TALK"']); hook(g, info); } });
registerShot('t8', { draw(g, t, info) { dark(g, t); phone(g, t, E.W / 2, CY + 90, 960, MSG.map(m => ({ ...m, at: -1, instant: true })), { name: 'JUNO', typing: [0.1, 99] });
  label(g, t, 0.3, 'JUNO IS TYPING…', 1330, { size: 50, color: S().ui.cream }); hook(g, info); } });
