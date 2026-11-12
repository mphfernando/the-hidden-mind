// shots/07_truth.js — part 2c: the truth, the way out, the CTA (t30-t47).
import { E, V, S, registerShot, mood, layer, blurLayer, veil, backdrop, ease, prog, key, clamp, lerp, talkAmount, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, posesAt, breathe, bigFace, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bedroom, bedGround, BED, DESK } from '../sets/bedroom.js';
import { thoughtCloud, speechBubble, fearShadow, bubbleWheel, popIn } from '../sets/motifs.js';
import { wt, camOn, toScr, voidStage, heartIcon, brainIcon, stamp, flipCard, titleBackdrop, GYv } from '../sets/kit2.js';
import { drawChar, faceAcc } from '../accessories.js';
import { YOU, MACC, MCOL, SAGE, SACC, SCOL, ADA, VEX, JUNO, RAY, PIP } from '../cast.js';

const rimOf = (c, dir = [-0.6, -0.8]) => ({ color: c, dir, w: 4 });
const milo = (g, o) => drawChar(g, { outfit: YOU, ...o }, MACC, MCOL);
const sage = (g, o) => drawChar(g, { outfit: SAGE, ...o }, SACC, SCOL);
const DAWN = 'golden';

// t30 — "So here's the truth about overthinking."
registerShot('t30', { draw(g, t, info) { titleBackdrop(g, t, info, 'dusk'); UI.titleCard(g, t, { lines: ['THE TRUTH ABOUT', 'OVERTHINKING'], dur: info.dur, y: E.H * 0.4 }); } });

// t31 / t32 — not proof
function notProof(g, t, info, kind) {
  UI.blueprint(g); const c = UI.bpStroke(), cx = E.W / 2, cy = E.H * 0.42, z = 1 + 0.04 * t;
  g.save(); g.translate(cx, cy); g.scale(z, z); g.translate(-cx, -cy);
  const p = ease.outBack(prog(t, 0, 0.35)); g.save(); g.translate(cx, cy); g.scale(p, p); g.translate(-cx, -cy);
  if (kind === 'care') heartIcon(g, cx, cy, 150, S().ui.accent, 9); else brainIcon(g, cx, cy, 170, S().ui.gold, 8);
  g.restore(); g.restore();
  text(g, kind === 'care' ? 'CARING TOO MUCH?' : 'BEING SMARTER?', cx, E.H * 0.74, { size: 52, color: S().ui.cream, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.5)) });
  const at = kind === 'care' ? wt('much', info, 1.5) + 0.25 : wt('smarter', info, 1.1) + 0.3;
  stamp(g, t, at, cx + 40, cy + 20, 'NOT PROOF', { size: 72 });
}
registerShot('t31', { draw(g, t, info) { notProof(g, t, info, 'care'); } });
registerShot('t32', { draw(g, t, info) { notProof(g, t, info, 'smart'); } });

// t33 — "Very often, it's a way of not feeling, dressed up as a way of fixing."
registerShot('t33', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 60, GYv() - 330, 1.12 + 0.06 * k); const { GY } = voidStage(g, t, cam, { spotX: E.W / 2 + 140 });
  const tf = wt('feeling', info, 1.4), td = wt('dressed', info, 2.4), tx = wt('fixing', info, 4.0);
  layer(g, cam, 1, (g) => {
    const sx = E.W / 2 + 140, H = 560, hy = GY - H * 0.98, w = H * 0.42;
    milo(g, { x: E.W / 2 - 420, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.stand, t), expr: t < td ? 'scared' : 'confused', look: [1, -0.5], rim: rimOf(S().ui.cream, [0, -1]) });
    fearShadow(g, sx, GY, H, t, { grow: ease.out(prog(t, 0.0, 0.8)) * 0.4 + 0.6, eyes: ease.out(prog(t, tf - 0.1, tf + 0.4)) * (1 - 0.6 * ease.out(prog(t, tx, tx + 0.3))) });
    const hp = ease.outBack(prog(t, td, td + 0.3)); if (hp > 0) { g.save(); g.translate(sx, hy - w * 0.22 - (1 - hp) * 200); g.fillStyle = '#f2c21a'; g.beginPath(); g.arc(0, 0, w * 0.38, Math.PI, Math.PI * 2); g.fill(); rr(g, -w * 0.48, -6, w * 0.96, 16, 6); g.fill(); g.fillStyle = '#d9a90f'; g.fillRect(-5, -w * 0.38, 10, w * 0.38); g.restore(); }
    const wp = ease.outBack(prog(t, td + 0.25, td + 0.55)); if (wp > 0) { g.save(); g.translate(sx + w * 0.55, GY - H * 0.5); g.rotate(-0.6 + Math.sin(t * 4) * 0.08); g.scale(wp, wp); seg(g, [[0, 0], [0, -140]], 18, '#9aa6c8'); ring(g, 0, -150, 24, 14, '#9aa6c8'); g.fillStyle = '#05060c'; g.fillRect(-8, -186, 16, 30); g.restore(); }
    if (t > tx - 0.1) { const p = ease.outBack(prog(t, tx - 0.1, tx + 0.25)); g.save(); g.translate(sx - w * 0.9, GY - H * 0.45); g.rotate(-0.08); g.scale(p, p); rr(g, -120, -40, 240, 80, 10); g.fillStyle = S().ui.cream; g.fill(); text(g, '"FIXING"', 0, 2, { size: 40, color: '#141a2a', font: FONTS.ui, weight: 900 }); g.restore(); }
  });
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
} });

// t34 — "The way out isn't thinking harder."
registerShot('t34', { draw(g, t, info) {
  const cam = { z: 1.0 + 0.05 * t, x: 0, y: 30 }; voidStage(g, t, cam, { spot: false });
  const cx = E.W / 2, cy = E.H * 0.47, R = 300, th = wt('harder', info, 1.4);
  layer(g, cam, 1, (g) => { FX.lightCone(g, cx, cy - R * 1.9, { angle: Math.PI / 2, spread: 0.55, len: R * 3.4, color: S().ui.accent, a: 0.18 });
    bubbleWheel(g, cx, cy, R, t * 5.5); milo(g, { x: cx, y: cy + R - 16, s: 1.15, facing: 1, pose: walkPose(t * 2 * Math.PI * 2.6, { run: true }), expr: 'angry', rim: rimOf(S().ui.accent, [0, -1]), shadow: false, trail: { count: 4, dx: -26, a: 0.2 } }); });
  FX.speedLines(g, t, { cx, cy, count: 50, a: 0.2, inner: 380 });
  text(g, 'THINK HARDER', E.W - V(330, 260), V(170, 280), { size: 46, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3, alpha: ease.out(prog(t, 0.2, 0.5)) });
  stamp(g, t, th + 0.15, E.W - V(330, 260), V(170, 280), 'NO', { size: 58 });
} });

// t35 — "It's changing the question."
registerShot('t35', { draw(g, t, info) { const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]);
  flipCard(g, t, wt('changing', info, 0.4), ['WHAT IF?'], ["WHAT'S NEXT?"]); FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.25 }); } });

// dawn bedroom two-shot helper
function dawnRoom(g, t, cam) { return bedroom(g, t, cam, { mood: DAWN, lamp: 0.5 }); }
// t36 — 'Instead of "What if?", ask:'
registerShot('t36', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), k = ease.inOut(t / info.dur), cam = camOn(b.x + b.w + 80, GY - 300, 1.4 + 0.05 * k);
  const { M } = dawnRoom(g, t, cam); const ta = wt('ask', info, 1.8);
  layer(g, cam, 1, (g) => {
    const mx = b.x + b.w - 40, sx = mx + 330;
    g.save(); g.translate(sx + 12, 0); g.scale(-1, 1); FX.chair(g, 0, GY, 1.3, shade(M.wall, -0.6)); g.restore();
    milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(POSES.sit, t, 1, 2), expr: 'thinking', look: [1, 0], rim: rimOf(M.rim, [-0.6, -0.8]) });
    sage(g, { x: sx, y: GY, s: 1.3, facing: -1, pose: breathe(posesAt(t, [[0, POSES.sit], [ta - 0.4, { ...POSES.sit, eF: [24, -136], hF: [46, -150] }]]), t, 1, 6), expr: 'smile', rim: rimOf(M.rim, [-0.6, -0.8]), blink: (t % 3) > 2.9 });
    const fade = 1 - ease.inOut(prog(t, ta - 0.3, ta + 0.3));
    thoughtCloud(g, mx + 30, GY - 430, 210, 100, { a: 0.9 * fade * popIn(t, 0.1), label: 'WHAT IF?', labelColor: '#2a1830', tail: [mx + 10, GY - 260] });
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 }); FX.lensStreak(g, E.W / 2, E.H * 0.3, E.W * 1.2, '#ffe0b0', 0.12);
} });

// t37 — '"What's one step I can take right now?"'
registerShot('t37', { draw(g, t, info) {
  blurLayer(g, 14, (g) => dawnRoom(g, t, { z: 1.7, x: -300, y: -220 })); veil(g, '#1a0f0a', 0.3);
  const M = mood(DAWN), r = V(290, 320) * (1 + 0.04 * t), fx = E.W * 0.46, fy = E.H * 0.6, g0 = info.shot.start;
  const talk = talkAmount(info.globalT, g0, g0 + info.dur);
  bigFace(g, fx, fy, r, { outfit: YOU, expr: 'determined', face: { brows: null }, talk, rimColor: M.rim, rimSide: 1 }); faceAcc(g, fx, fy, r, MACC, MCOL);
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.35 });
} });

// t38 — "If there is one, take it."
registerShot('t38', { draw(g, t, info) {
  const cam = camOn(E.W / 2 + 60, GYv() - 330, 1.15 + 0.05 * t); const { GY } = voidStage(g, t, cam, { spotC: S().ui.gold, spotX: E.W / 2 + 120 });
  const tk = wt('take', info, 1.1), step = ease.inOut(prog(t, tk - 0.2, tk + 0.5));
  layer(g, cam, 1, (g) => {
    for (let i = 0; i < 5; i++) { const x = E.W / 2 + 40 + i * 150, y = GY - i * 70, lit = i === 0 ? 0.4 + 0.6 * step : 0.12;
      rr(g, x, y - 70, 160, 70 + i * 70, 6); g.fillStyle = mix('#1a2236', S().ui.gold, lit * 0.6); g.fill(); seg(g, [[x, y - 70], [x + 160, y - 70]], 5, alpha(S().ui.gold, lit)); if (i === 0) glow(g, x + 80, y - 70, 200, S().ui.gold, 0.35 * lit); }
    const mx = lerp(E.W / 2 - 160, E.W / 2 + 110, step), my = GY - 70 * step;
    milo(g, { x: mx, y: my, s: 1.4, facing: 1, pose: t < tk + 0.5 && t > tk - 0.2 ? walkPose(t * 2 * Math.PI * 0.9) : breathe(POSES.stand, t), expr: step > 0.6 ? 'happy' : 'determined', rim: rimOf(S().ui.gold, [0.6, -0.8]) });
  });
} });

// t39 — "If there isn't, your job isn't to solve it. It's to feel it."
registerShot('t39', { draw(g, t, info) {
  const d = DESK(), GY = bedGround(), k = ease.inOut(t / info.dur), cam = camOn(d.x - 120, GY - 300, 1.45 + 0.06 * k);
  const { M } = dawnRoom(g, t, cam); const ts = wt('solve', info, 1.6), tf = wt('feel', info, 3.3);
  const chest = { ...POSES.stand, eF: [22, -140], hF: [8, -158], eB: [-6, -140], hB: [4, -150] };
  layer(g, cam, 1, (g) => {
    const mx = d.x - 60;
    milo(g, { x: mx, y: GY, s: 1.4, facing: 1, pose: breathe(posesAt(t, [[0, POSES.holdFront], [ts, POSES.relaxed], [tf - 0.2, chest]]), t), prop: t < ts ? 'paper' : null, expr: t < tf ? 'neutral' : 'sleepy', rim: rimOf(M.rim, [-0.6, -0.8]) });
    if (t > ts) for (let i = 0; i < 4; i++) { g.save(); g.translate(d.x + 80 + i * 20, GY - d.h - 4 - i * 4); g.fillStyle = '#ece8f6'; g.fillRect(-50, -4, 100, 5); g.restore(); }
    sage(g, { x: mx - 330, y: GY, s: 1.4, facing: 1, pose: breathe(POSES.crossArms, t, 1, 6), expr: t > tf ? 'smile' : 'neutral', rim: rimOf(M.rim, [-0.6, -0.8]), blink: (t % 2.8) > 2.7 });
    if (t > tf) { glow(g, mx + 10, GY - 160 * 1.4, 160, '#ffcf8f', 0.4 * ease.out(prog(t, tf, tf + 0.6))); FX.rings(g, mx + 10, GY - 160 * 1.4, t - tf, { count: 2, r0: 30, r1: 160, speed: 0.8, color: '#ffe2bd', a: 0.4 }); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// t40 — "Name the fear. Let it sit there. Let it pass."
registerShot('t40', { draw(g, t, info) {
  const GY = bedGround(), b = BED(), k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 - 60, GY - 330, 1.2 + 0.05 * k);
  const { M, wx, wy, ww, wh } = dawnRoom(g, t, cam);
  const tn = wt('name', info, 0.1), tsit = wt('sit', info, 1.4), tp = wt('pass', info, 2.6);
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 - 300;
    milo(g, { x: mx, y: GY, s: 1.4, facing: 1, pose: breathe(POSES.relaxed, t), expr: t > tsit ? 'smile' : 'neutral', look: [1, 0.2], rim: rimOf(M.rim, [-0.6, -0.8]) });
    const shrink = ease.inOut(prog(t, tn + 0.3, tsit + 0.4)), go = ease.inOut(prog(t, tp, tp + 1.2));
    const sx = lerp(mx + 300, wx + ww / 2, go), sy = lerp(GY, wy + wh * 0.7, go), H = lerp(520, 200, shrink) * (1 - 0.5 * go);
    g.save(); g.globalAlpha *= 1 - go * 0.9; fearShadow(g, sx, sy, H, t, { eyes: 1 - 0.5 * shrink, eyeColor: '#ffd59a', color: 'rgba(10,6,12,.75)' });
    const tg = ease.outBack(prog(t, tn, tn + 0.3)); if (tg > 0) { g.save(); g.translate(sx + H * 0.25, sy - H * 0.6); g.rotate(0.15); g.scale(tg, tg); rr(g, -70, -24, 140, 48, 10); g.fillStyle = S().ui.cream; g.fill(); circle(g, -52, 0, 6, '#5a4a3a'); text(g, 'FEAR', 8, 2, { size: 30, color: '#2a1e18', font: FONTS.ui, weight: 900 }); g.restore(); }
    g.restore();
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// t41 — "Some therapists even suggest a set 'worry time' each day, postponing worries until then,"
registerShot('t41', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, cx = E.W * 0.32, cy = E.H * 0.47, R = 220;
  const tw = wt('worry', info, 1.4), te = wt('each', info, 2.3), tpp = wt('postponing', info, 3.4);
  circle(g, cx, cy, R, '#0f1a30'); ring(g, cx, cy, R, 6, c);
  for (let i = 0; i < 12; i++) { const a = (i / 12) * Math.PI * 2; seg(g, [[cx + Math.cos(a) * R * 0.84, cy + Math.sin(a) * R * 0.84], [cx + Math.cos(a) * R * 0.94, cy + Math.sin(a) * R * 0.94]], 5, c); }
  const wedge = ease.inOut(prog(t, tw - 0.1, tw + 0.6)); if (wedge > 0) { g.fillStyle = alpha(gold, 0.45); g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, R * 0.8, -Math.PI / 2, -Math.PI / 2 + Math.PI / 2 * wedge); g.closePath(); g.fill(); glow(g, cx + R * 0.4, cy - R * 0.4, 160, gold, 0.3 * wedge); }
  const ha = t * 0.4; seg(g, [[cx, cy], [cx + Math.cos(ha - Math.PI / 2) * R * 0.5, cy + Math.sin(ha - Math.PI / 2) * R * 0.5]], 9, S().ui.cream); seg(g, [[cx, cy], [cx + Math.cos(t * 3 - Math.PI / 2) * R * 0.72, cy + Math.sin(t * 3 - Math.PI / 2) * R * 0.72]], 5, S().ui.cream); circle(g, cx, cy, 12, S().ui.cream);
  text(g, 'WORRY TIME', cx, cy + R + 60, { size: 46, color: gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: wedge });
  text(g, 'EACH DAY', cx, cy + R + 112, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, te, te + 0.3)) });
  // the LATER box
  const bx = E.W * 0.72, by = E.H * 0.6, bp = ease.outBack(prog(t, tpp - 0.3, tpp)); if (bp > 0) { g.save(); g.translate(bx, by); g.scale(bp, bp); rr(g, -170, -100, 340, 200, 16); g.fillStyle = '#1a2a40'; g.fill(); g.strokeStyle = c; g.lineWidth = 5; g.stroke(); seg(g, [[-190, -100], [-120, -150], [190, -150], [170, -100]], 5, c); text(g, 'LATER', 0, 10, { size: 54, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4 }); g.restore(); }
  for (let i = 0; i < 4; i++) { const st = tpp + i * 0.35, f = ease.inOut(prog(t, st, st + 0.6)); const x0 = E.W * 0.6 + (i % 2) * 180, y0 = E.H * 0.2 + i * 30;
    if (f < 1) thoughtCloud(g, lerp(x0, bx, f), lerp(y0, by - 40, f) - Math.sin(f * Math.PI) * 80, 150, 76, { scale: (1 - f * 0.7) * popIn(t, 0.2 + i * 0.2), label: 'WHAT IF', labelColor: '#2a1830' }); }
} });

// t42 — "and studies have found this can reduce how much people worry."
registerShot('t42', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, acc = S().ui.accent;
  const tr = wt('reduce', info, 1.6), v = lerp(0.85, 0.45, ease.inOut(prog(t, tr - 0.1, tr + 1.0)));
  const x0 = V(380, 120), w = E.W - 2 * x0, y = E.H * 0.5;
  text(g, 'HOW MUCH PEOPLE WORRY', E.W / 2, y - 140, { size: 40, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 4 });
  rr(g, x0, y - 40, w, 80, 40); g.fillStyle = alpha(c, 0.12); g.fill();
  rr(g, x0, y - 40, w * v, 80, 40); g.fillStyle = mix(acc, gold, ease.inOut(prog(t, tr, tr + 1))); g.fill(); glow(g, x0 + w * v, y, 90, gold, 0.5);
  if (t > tr) { poly(g, [[x0 + w * v + 60, y - 20], [x0 + w * v + 100, y - 20], [x0 + w * v + 80, y + 20]], gold); }
  text(g, 'WITH WORRY TIME', E.W / 2, y + 120, { size: 34, color: gold, font: FONTS.ui, weight: 900, spacing: 4, alpha: ease.out(prog(t, tr, tr + 0.4)) });
  text(g, 'STUDIES', E.W / 2, y + 230, { size: 26, color: alpha(S().ui.cream, 0.6), font: FONTS.ui, weight: 900, spacing: 5, alpha: ease.out(prog(t, 0.3, 0.7)) });
} });

// t43 / t44 — the throw
function throwScene(g, t, info, calm) {
  const GY = bedGround(), k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 120, GY - 320, 1.25 + 0.05 * k);
  const { M } = dawnRoom(g, t, cam);
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 + 260;
    milo(g, { x: mx, y: GY, s: 1.4, facing: -1, pose: breathe(calm ? POSES.relaxed : posesAt(t, [[0, POSES.stand], [0.5, POSES.reach], [1.2, POSES.handsOnHead]]), t), expr: calm ? 'smile' : 'surprised', look: [-1, -0.2], rim: rimOf(M.rim, [-0.6, -0.8]) });
    for (let i = 0; i < 7; i++) { const speed = calm ? 0.25 : 0.7, ph = (t * speed + i / 7) % 1, y = GY - 200 - (i % 4) * 90 - Math.sin(ph * Math.PI) * (calm ? 30 : 80);
      const x = calm ? lerp(E.W / 2 - 900, mx + 700, ph) + (Math.abs(lerp(E.W / 2 - 900, mx + 700, ph) - mx) < 120 ? 0 : 0) : lerp(E.W / 2 - 900, mx - 60, ph);
      const yy = calm && Math.abs(x - mx) < 160 ? y - 120 : y;
      thoughtCloud(g, x, yy, 140, 70, { a: 0.92 * (calm ? 1 : 1 - Math.max(0, ph - 0.85) * 6), label: i % 2 ? 'WHAT IF' : '?', labelColor: '#2a1830', labelSize: 22 }); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
}
registerShot('t43', { draw(g, t, info) { throwScene(g, t, info, false); } });
registerShot('t44', { draw(g, t, info) { throwScene(g, t, info, true); } });

// t45 — "What's the one thought you replay the most? Tell me in the comments. You're probably not alone."
registerShot('t45', { draw(g, t, info) {
  const M = mood('dusk'); backdrop(g, [shade(M.sky[0], -0.4), shade(M.sky[1], -0.5)]); glow(g, E.W / 2, E.H * 1.0, E.W * 0.5, '#ffb070', 0.25);
  const tc = wt('comments', info, 3.2), ta = wt('alone', info, 4.8);
  text(g, "What's the one thought", E.W / 2, V(150, 360), { size: 66, font: FONTS.serif, weight: 900, italic: true, color: S().ui.cream, alpha: ease.out(prog(t, 0.1, 0.6)) });
  text(g, 'you replay the most?', E.W / 2, V(230, 440), { size: 66, font: FONTS.serif, weight: 900, italic: true, color: S().ui.gold, alpha: ease.out(prog(t, 0.5, 1.0)) });
  const n = t < tc ? 0 : t < ta ? 2 : 2 + Math.floor((t - ta) * 8);
  for (let i = 0; i < Math.min(n, 9); i++) { const col = i % 3, row = Math.floor(i / 3), x = E.W / 2 - 520 + col * 520, y = E.H * 0.46 + row * 150 + (i % 2) * 20, p = popIn(t, (i < 2 ? tc + i * 0.25 : ta + (i - 2) * 0.12), 0.3);
    g.save(); g.translate(x, y); g.scale(p, p); rr(g, -230, -55, 460, 110, 24); g.fillStyle = alpha('#1e1a2e', 0.92); g.fill(); g.strokeStyle = alpha(S().ui.cream, 0.15); g.lineWidth = 2; g.stroke();
    circle(g, -180, 0, 30, ['#8a5ad6', '#2fb5a8', '#e0a92a', '#d64a33', '#3fb950'][i % 5]); rr(g, -132, -22, 260 - (i % 3) * 50, 14, 7); g.fillStyle = alpha(S().ui.cream, 0.7); g.fill(); rr(g, -132, 8, 180 - (i % 2) * 40, 12, 6); g.fillStyle = alpha(S().ui.cream, 0.35); g.fill();
    circle(g, 195, 22, 9, S().ui.accent); g.restore(); }
  if (t > ta) text(g, 'NOT ALONE', E.W / 2, E.H * 0.93, { size: 40, color: S().ui.gold, font: FONTS.ui, weight: 900, spacing: 6, alpha: ease.out(prog(t, ta, ta + 0.3)) });
} });

// t46 — "And if overthinking ever feels overwhelming, talking to a professional is a strong move, not a weak one."
registerShot('t46', { draw(g, t, info) {
  const d = DESK(), GY = bedGround(), k = ease.inOut(t / info.dur), cam = camOn(E.W / 2 + 180, GY - 290, 1.3 + 0.06 * k);
  const { M } = bedroom(g, t, cam, { mood: 'interiorWarm', lamp: 1 });
  const tp = wt('professional', info, 2.6), ts = wt('strong', info, 4.1), g0 = info.shot.start;
  layer(g, cam, 1, (g) => {
    const mx = E.W / 2 - 40, sx = mx + 400;
    g.save(); g.translate(mx - 12, 0); FX.chair(g, 0, GY, 1.3, shade(M.wall, -0.6)); g.restore(); g.save(); g.translate(sx + 12, 0); g.scale(-1, 1); FX.chair(g, 0, GY, 1.3, shade(M.wall, -0.6)); g.restore();
    milo(g, { x: mx, y: GY, s: 1.3, facing: 1, pose: breathe(t < ts ? POSES.sitBack : POSES.sit, t), expr: t < tp ? 'sad' : t < ts ? 'neutral' : 'smile', talk: t > tp && t < ts ? talkAmount(info.globalT, g0 + tp, g0 + ts) * 0.6 : 0, rim: rimOf(M.practical, [1, -0.4]) });
    sage(g, { x: sx, y: GY, s: 1.3, facing: -1, pose: breathe(POSES.sit, t, 1, 5), prop: 'cup', expr: 'smile', rim: rimOf(M.practical, [1, -0.4]), blink: (t % 3.2) > 3.1 });
    if (t > ts) { const p = popIn(t, ts + 0.2); g.save(); g.translate(mx + 200, GY - 420); g.scale(p, p); circle(g, 0, 0, 46, alpha(S().ui.gold, 0.25)); seg(g, [[-20, 2], [-4, 18], [24, -16]], 9, S().ui.gold); g.restore(); }
  });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.35 });
} });

// t47 — "Subscribe for more on the hidden side of your mind."
registerShot('t47', { draw(g, t, info) {
  UI.endScreen(g, t, { question: 'What thought do YOU replay?', cast: [VEX, JUNO, ADA, YOU, SAGE, RAY, PIP], moodColors: ['#0f1424', '#1a1e34', '#2a2238'], rim: '#9fd0ff' });
} });
