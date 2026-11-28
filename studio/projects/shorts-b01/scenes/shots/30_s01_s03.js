// shots/30_s01_s03.js — Shorts batch 01: S01 the wave, S02 the name, S03 the doorway (native 9:16).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, clamp, lerp, shake, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { street, streetGround } from '../sets/street.js';
import { thoughtCloud, popIn } from '../sets/motifs.js';
import { memoryFrame } from '../sets/memory.js';
import { wt, titleBackdrop, brainIcon } from '../sets/kit2.js';
import { hook, label, pill, say, bigMilo, shareShot, kitchen, milo, extra, rim, pop, voidStage, camOn, stamp, TOP, BOT, CY } from '../sets/vkit.js';

const GYs = () => streetGround();
const WAVE = { ...POSES.wave }, HAIR = { ...POSES.stand, eF: [26, -196], hF: [10, -226] };
function streetScene(g, t, z, o = {}) { z *= 1.4; const cam = camOn(E.W / 2 + (o.dx || 0), GYs() - 200, z); const { M } = street(g, t, cam); return { cam, M, GY: GYs() }; }

// ---------- S01 THE WAVE ----------
registerShot('w1', { draw(g, t, info) { const { cam, M, GY } = streetScene(g, t, 1.35 + 0.04 * t); const tb = wt('back', info, 1.3);
  layer(g, cam, 1, (g) => { extra(g, { x: E.W / 2 + 230, y: GY, s: 1.4, facing: -1, pose: breathe(posesAt(t, [[0, POSES.stand], [0.2, WAVE]]), t), expr: 'happy', rim: rim(M.rim, [-1, -0.4]) }, '#3a8a6a', 'cap');
    milo(g, { x: E.W / 2 - 160, y: GY, s: 1.4, facing: 1, pose: breathe(posesAt(t, [[0, POSES.stand], [tb - 0.1, WAVE]]), t), expr: t > tb ? 'happy' : 'surprised', rim: rim(M.rim, [1, -0.4]) }); });
  hook(g, info); } });
registerShot('w2', { draw(g, t, info) { const z = lerp(1.35, 0.95, ease.inOut(prog(t, 0.2, 1.6))); const { cam, M, GY } = streetScene(g, t, z, { dx: -80 }); const tr = wt('behind', info, 2.6);
  layer(g, cam, 1, (g) => { extra(g, { x: E.W / 2 + 230, y: GY, s: 1.4, facing: -1, pose: breathe(WAVE, t), expr: 'happy', rim: rim(M.rim, [-1, -0.4]) }, '#3a8a6a', 'cap');
    extra(g, { x: E.W / 2 - 480, y: GY, s: 1.4, facing: 1, pose: breathe(WAVE, t, 1, 3), expr: 'happy', rim: rim(M.rim, [1, -0.4]) }, '#c0563f', 'ponytail');
    milo(g, { x: E.W / 2 - 160, y: GY, s: 1.4, facing: 1, pose: WAVE, expr: t > tr ? 'shocked' : 'happy', rim: rim(M.rim, [1, -0.4]) }); });
  if (t > tr) { const [sx, sy] = shake(t, 6 * (1 - prog(t, tr, tr + 0.4)), 30); label(g, t, tr, 'NOT YOU.', 470 + sy, { color: S().ui.accent }); }
  hook(g, info); } });
registerShot('w3', { draw(g, t, info) { const { cam, M, GY } = streetScene(g, t, 1.9 + 0.05 * t, { dx: -160 });
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2 - 160, y: GY, s: 1.4, facing: 1, pose: breathe(posesAt(t, [[0, WAVE], [0.4, HAIR]]), t), expr: 'nervous', look: [1, -0.3], rim: rim(M.rim, [1, -0.4]) }));
  pill(g, t, wt('hair', info, 1.4), E.W / 2, 470, '*FIXES HAIR*', { size: 46, line: S().ui.gold }); hook(g, info); } });
registerShot('w4', { draw(g, t, info) { const cam = camOn(E.W / 2, 1180, 1.05 + 0.03 * t); const { GY } = voidStage(g, t, cam, { spotC: '#fff3d6' }); const ts = wt('spotlight', info, 2.3);
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2, y: 1400, s: 1.5, facing: 1, pose: breathe(POSES.crossArms, t), expr: 'scared', look: [Math.sin(t * 2), 0], rim: rim('#fff3d6') }));
  label(g, t, ts, 'SPOTLIGHT', 470); label(g, t, ts + 0.15, 'EFFECT', 560); hook(g, info); } });
registerShot('w5', { draw(g, t, info) { const { cam, M, GY } = streetScene(g, t, 1.0 + 0.03 * t); const tm = wt('most', info, 1.6);
  layer(g, cam, 1, (g) => { [[-330, '#4a5066', 'phone'], [-120, '#6a4a5a', 'phone'], [120, '#3a5a6a', 'phone'], [330, '#5a5a4a', null]].forEach(([dx, c, pr], i) =>
    extra(g, { x: E.W / 2 + dx, y: GY, s: 1.25, facing: i % 2 ? -1 : 1, pose: breathe(pr ? POSES.phone : POSES.relaxed, t, 1, i), prop: pr, expr: 'neutral', look: [0.5, 0.6], rim: rim(M.rim) }, c));
    if (t < tm) for (let i = 0; i < 4; i++) { const h = [E.W / 2 - 330 + i * 220, GY - 360]; circle(g, h[0], h[1], 26, alpha('#ff6f61', 0.9)); text(g, '!', h[0], h[1] + 2, { size: 34, color: '#fff', weight: 700 }); } });
  label(g, t, 0.05, 'EVERYONE SAW IT?', 470, { size: 56, color: S().ui.cream }); if (t > tm) label(g, t, tm, 'BARELY NOTICED', 570, { size: 64 }); hook(g, info); } });
registerShot('w6', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'WAVES BACK', 'AT EVERYONE']); hook(g, info); } });
registerShot('w7', { draw(g, t, info) { const { cam, M, GY } = streetScene(g, t, 1.45 + 0.04 * t);
  layer(g, cam, 1, (g) => { extra(g, { x: E.W / 2 + 230, y: GY, s: 1.4, facing: -1, pose: breathe(WAVE, t), expr: 'happy', rim: rim(M.rim, [-1, -0.4]) }, '#3a8a6a', 'cap');
    milo(g, { x: E.W / 2 - 160, y: GY, s: 1.4, facing: 1, pose: { ...POSES.stand, eF: [20, -170], hF: [26, -196] }, expr: 'nervous', look: [-1, 0], rim: rim(M.rim, [1, -0.4]) }); });
  label(g, t, 0.4, '…', 470, { size: 120, color: S().ui.cream }); hook(g, info); } });

// ---------- S02 THE NAME ----------
const SARAH = (g, o) => extra(g, o, '#c0563f', 'ponytail');
function meet(g, t, info, o = {}) { const { cam, M, GY } = streetScene(g, t, (o.z || 1.5) + 0.04 * t);
  layer(g, cam, 1, (g) => { SARAH(g, { x: E.W / 2 + 150, y: GY, s: 1.4, facing: -1, pose: breathe(POSES.holdFront, t), expr: 'happy', rim: rim(M.rim, [-1, -0.4]) });
    milo(g, { x: E.W / 2 - 150, y: GY, s: 1.4, facing: 1, pose: breathe(POSES.holdFront, t), expr: o.expr || 'happy', rim: rim(M.rim, [1, -0.4]) }); }); return { cam, GY }; }
registerShot('n1', { draw(g, t, info) { meet(g, t, info); say(g, t, 0.1, E.W / 2 + 160, 470, 'HI, I\'M SARAH!', { side: -1 }); say(g, t, wt('nice', info, 1.3), E.W / 2 - 120, 650, 'NICE TO MEET YOU, I\'M…', { size: 40 }); hook(g, info); } });
registerShot('n2', { draw(g, t, info) { const cam = camOn(E.W / 2, 1100, 1); voidStage(g, t, cam, { spot: false }); const fx = E.W / 2, fy = 1080;
  bigMilo(g, t, fx, fy, 300, 'happy', { look: [0.5, -0.6] });
  const u = ease.in(prog(t, 0.2, 1.8)); g.save(); g.globalAlpha *= 1 - u; text(g, 'SARAH', fx + 40 + u * 260, fy - 360 - u * 300, { size: 80, color: S().ui.gold, weight: 700, spacing: 4 }); g.restore();
  const t2 = wt('two', info, 1.8); if (t > t2) { pill(g, t, t2, E.W / 2, 500, '2 SECONDS', { size: 52, line: S().ui.accent }); } hook(g, info); } });
registerShot('n3', { draw(g, t, info) { const cam = camOn(E.W / 2, 1100, 1); voidStage(g, t, cam, { spot: false }); bigMilo(g, t, E.W / 2, 1080, 300 * (1 + 0.03 * t), 'nervous', { face: { brows: 'angry' }, look: [-0.4, 0.3] });
  thoughtCloud(g, E.W / 2 + 200, 560, 320, 130, { scale: popIn(t, 0.1), label: 'S…SAM?', labelSize: 44 }); hook(g, info); } });
registerShot('n4', { draw(g, t, info) { titleBackdrop(g, t, info, 'night'); const tn = wt('next', info, 1.4);
  label(g, t, 0.1, 'PSYCHOLOGISTS CALL IT', 780, { size: 46, color: S().ui.cream }); if (t > tn) { label(g, t, tn, 'THE', 900, { size: 60 }); label(g, t, tn + 0.1, 'NEXT-IN-LINE', 1000, { size: 92 }); label(g, t, tn + 0.2, 'EFFECT', 1110, { size: 92 }); } hook(g, info); } });
registerShot('n5', { draw(g, t, info) { const { cam, GY } = meet(g, t, info, { z: 1.25, expr: 'thinking' }); const h = [E.W / 2 - 150, 700];
  thoughtCloud(g, E.W / 2 - 60, 560, 600, 220, { scale: popIn(t, 0.1), label: null, tail: [E.W / 2 - 140, 900] });
  ['BE COOL', 'SAY YOUR NAME', 'HANDSHAKE?'].forEach((s, i) => text(g, s, E.W / 2 - 60, 500 + i * 58, { size: 40, color: '#1a1420', font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, 0.4 + i * 0.4, 0.7 + i * 0.4)) }));
  const u = prog(t, 1.2, 2.4); if (u > 0 && u < 1) text(g, 'SARAH', lerp(E.W - 120, E.W / 2 + 200, u) + (u > 0.8 ? (u - 0.8) * 900 : 0), 560 + (u > 0.8 ? -(u - 0.8) * 700 : 0), { size: 50, color: S().ui.gold, weight: 700 });
  label(g, t, wt('planning', info, 2.6), 'PLANNING MODE', 1240 - 820, { size: 50, color: S().ui.accent }); hook(g, info); } });
registerShot('n6', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(); text(g, 'WHAT GETS STORED', E.W / 2, 460, { size: 52, color: S().ui.cream, spacing: 3 });
  const rows = [['"HI…"', 1], ['"I\'M SARAH"', 0.15], ['YOUR TURN', 1]]; rows.forEach(([s, v], i) => { const y = 650 + i * 230, p = pop(t, 0.2 + i * 0.3); if (p <= 0) return;
    g.save(); g.translate(E.W / 2, y); g.scale(p, p); rr(g, -380, -80, 760, 160, 24); g.strokeStyle = i === 1 ? S().ui.accent : c; g.lineWidth = 6; g.stroke(); g.globalAlpha *= i === 1 ? 0.25 + 0.75 * (1 - prog(t, 1.2, 2.0)) : 1;
    text(g, s, 0, 4, { size: 56, color: i === 2 ? S().ui.gold : S().ui.cream, font: FONTS.ui, weight: 900 }); g.restore(); });
  label(g, t, wt('barely', info, 1.6), 'BARELY STORED', 1330, { size: 54, color: S().ui.accent }); hook(g, info); } });
registerShot('n7', { draw(g, t, info) { shareShot(g, t, info, ['THE FRIEND WHO', 'CALLS EVERYONE', '"BUDDY"']); hook(g, info); } });
registerShot('n8', { draw(g, t, info) { meet(g, t, info, { z: 1.6 }); say(g, t, wt('hi', info, 1.2), E.W / 2 + 160, 520, 'HI, I\'M…', { side: -1, size: 56 }); hook(g, info); } });

// ---------- S03 THE DOORWAY ----------
registerShot('d1', { draw(g, t, info) { const cam = camOn(E.W / 2 - 100, 1100, 1.3 + 0.03 * t); const { GY } = kitchen(g, t, cam); const tn = wt('idea', info, 1.6);
  const x = lerp(E.W / 2 - 330, E.W / 2 + 20, ease.out(prog(t, 0, 1.2))); layer(g, cam, 1, (g) => milo(g, { x, y: GY, s: 1.45, facing: 1, pose: t < 1.2 ? walkPose(t * 6) : breathe(POSES.think, t), expr: t > tn ? 'confused' : 'neutral', rim: rim() }));
  if (t > tn) label(g, t, tn, '?', 560, { size: 200, color: S().ui.cream }); hook(g, info); } });
registerShot('d2', { draw(g, t, info) { UI.blueprint(g); const c = UI.bpStroke(), tr = wt('researchers', info, 1.4), td = wt('doorway', info, 3.4), ts = wt('same', info, 5.8);
  label(g, t, tr, 'RESEARCHERS FOUND', 440, { size: 48, color: S().ui.cream });
  [[620, 'THROUGH A DOORWAY', 0.55, td, S().ui.accent], [960, 'SAME ROOM', 0.25, ts, S().ui.gold]].forEach(([y, s, v, at, col]) => { if (t < at - 0.1) return;
    rr(g, 140, y, 360, 230, 10); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); if (s !== 'SAME ROOM') { seg(g, [[500, y + 60], [500, y + 170]], 12, '#0a1622'); rr(g, 500, y, 360, 230, 10); g.stroke(); }
    text(g, s, E.W / 2, y + 280, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900 }); const f = ease.out(prog(t, at, at + 0.8)); rr(g, 140, y + 320, 720 * v * f, 30, 15); g.fillStyle = col; g.fill(); });
  text(g, 'FORGETTING', E.W / 2, 1370, { size: 40, color: alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, alpha: ease.out(prog(t, ts, ts + 0.3)) }); hook(g, info); } });
registerShot('d3', { draw(g, t, info) { const cam = camOn(E.W / 2 - 330, 1060, 1.5 + 0.05 * t); const { GY } = kitchen(g, t, cam, { doorGlow: ease.out(prog(t, 0.2, 0.8)) });
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2 - 330, y: GY, s: 1.45, facing: 1, pose: walkPose(t * 5), expr: 'neutral', rim: rim(S().ui.accent) }));
  label(g, t, wt('event', info, 0.9), 'EVENT BOUNDARY', 470, { size: 64, color: S().ui.accent }); hook(g, info); } });
registerShot('d4', { draw(g, t, info) { UI.blueprint(g); const tf = wt('files', info, 0.9), tn = wt('new', info, 2.6);
  rr(g, E.W / 2 - 260, 1050, 520, 300, 20); g.fillStyle = '#16203a'; g.fill(); g.strokeStyle = UI.bpStroke(); g.lineWidth = 5; g.stroke(); text(g, 'FILED', E.W / 2, 1300, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900 });
  const u = ease.inOut(prog(t, tf, tf + 0.9)); memoryFrame(g, E.W / 2, lerp(620, 1150, u), lerp(560, 300, u), lerp(340, 180, u), t, { label: false, a: 1 - 0.6 * u });
  if (t > tn) { const p = pop(t, tn); g.save(); g.translate(E.W / 2, 620); g.scale(p, p); rr(g, -280, -170, 560, 340, 14); g.strokeStyle = S().ui.gold; g.lineWidth = 6; g.stroke(); text(g, 'NEW SCENE', 0, 4, { size: 56, color: S().ui.gold, weight: 700 }); g.restore(); }
  hook(g, info); } });
registerShot('d5', { draw(g, t, info) { const cam = camOn(E.W / 2 + 200, 1060, 1.35); const { GY } = kitchen(g, t, cam, { fridgeOpen: true });
  layer(g, cam, 1, (g) => milo(g, { x: E.W / 2 + 120, y: GY, s: 1.45, facing: 1, pose: breathe(POSES.think, t), expr: 'confused', rim: rim('#fff3c8', [1, -0.2]) }));
  g.fillStyle = 'rgba(4,10,18,.55)'; g.fillRect(0, 380, E.W, 470); pill(g, t, 0.1, E.W / 2, 460, 'SEND THIS TO', { size: 42, line: S().ui.gold });
  ['THE FRIEND WHO STANDS', 'AT THE OPEN FRIDGE'].forEach((s, i) => text(g, s, E.W / 2, 600 + i * 84, { size: 58, color: i ? S().ui.gold : S().ui.cream, weight: 700, alpha: ease.out(prog(t, 0.3 + i * 0.15, 0.6 + i * 0.15)) })); hook(g, info); } });
registerShot('d6', { draw(g, t, info) { const cam = camOn(E.W / 2, 1100, 1); voidStage(g, t, cam, { spot: false }); bigMilo(g, t, E.W / 2, 1100, 290, 'confused', { look: [0.3, -0.7] });
  label(g, t, wt('why', info, 0.8), 'WAIT… WHY DID I', 470, { size: 58, color: S().ui.cream }); label(g, t, wt('video', info, 1.6), 'OPEN THIS VIDEO?', 560, { size: 64 }); hook(g, info); } });
