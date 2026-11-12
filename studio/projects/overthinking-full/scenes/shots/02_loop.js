// shots/02_loop.js — the loop (s08, s09), the flip (s11), the mind that can't switch off (s12), the brain that never idles (s18).
import { E, V, S, registerShot, mood, layer, backdrop, ease, prog, key, clamp, lerp, wordTime, seg, circle, ring, rr, poly, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { drawFigure, POSES, walkPose } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import * as UI from '/engine/ui2d.js';
import { bubbleWheel, headProfile } from '../sets/motifs.js';
import { YOU, MACC, MCOL } from '../cast.js';
import { drawChar, faceAcc } from '../accessories.js';

const wt = (w, info, fb) => (wordTime(w, info.shot.start - 0.3) ?? info.shot.start + fb) - info.shot.start;
const WC = () => [E.W / 2, E.H * 0.47], WR = 300;

function voidStage(g, t, cam) {
  const M = mood('void');
  layer(g, cam, 0.3, (g) => { backdrop(g, [shade(M.sky[0], -0.2), M.sky[1]]); FX.stars(g, t, { count: 60, color: '#8fa6d8', area: [-400, -300, E.W + 800, E.H + 300] }); });
  return M;
}
// the runner in the wheel (shared by s08/s09)
function wheelRunner(g, t, cam, M) {
  const [cx, cy] = WC(), ang = t * 2.4;
  layer(g, cam, 0.9, (g) => { FX.pool(g, cx, cy + WR * 1.25 + 6, 520, 70, S().ui.gold, 0.25); });
  layer(g, cam, 1, (g) => {
    FX.lightCone(g, cx, cy - WR * 1.9, { angle: Math.PI / 2, spread: 0.55, len: WR * 3.4, color: S().ui.gold, a: 0.2 });
    bubbleWheel(g, cx, cy, WR, ang);
    const s = 1.15, fy = cy + WR - 16;
    drawChar(g, { x: cx, y: fy, s, facing: 1, outfit: YOU, pose: walkPose(t * 2 * Math.PI * 1.6, { run: true }), expr: 'determined', rim: { color: S().ui.gold, dir: [0, -1], w: 4 }, shadow: false, trail: { count: 3, dx: -30, a: 0.18 } }, MACC, MCOL);
    // START flag under the wheel
    const fx = cx - 40, base = cy + WR * 1.25;
    seg(g, [[fx, base], [fx, base - 70]], 4, S().ui.cream); poly(g, [[fx, base - 70], [fx + 46, base - 58], [fx, base - 46]], S().ui.accent);
    text(g, 'START', fx + 4, base + 34, { size: 26, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 3 });
  });
}

// s08 — "Have you ever noticed that overthinking feels productive,"
registerShot('s08', { draw(g, t, info) {
  const k = ease.inOut(t / info.dur), cam = { z: 0.98 + 0.08 * k, x: -20 * k, y: 30 };
  const M = voidStage(g, t, cam);
  wheelRunner(g, t, cam, M);
  FX.speedLines(g, t, { cx: E.W / 2, cy: E.H * 0.5, count: 30, a: 0.12, inner: 420 });
  FX.dust(g, t, { count: 30, color: '#ffe2bd', a: 0.3 });
  const tp = wt('productive', info, 2.4);
  UI.readout(g, { label: 'EFFORT', value: Math.round(lerp(0, 100, ease.out(prog(t, 0.3, tp + 0.4)))) + '%', x: V(120, 90), y: V(170, 300), a: ease.out(prog(t, 0.2, 0.6)) });
} });

// s09 — "but you end up exactly where you started?"  pull out: the wheel is inside a head
registerShot('s09', { draw(g, t, info) {
  const k = ease.inOut(prog(t, 0.1, info.dur - 0.2)), [cx, cy] = WC();
  const cam = { z: lerp(1.02, 0.42, k), x: 0, y: lerp(30, -60, k) };
  const M = voidStage(g, t + 2.95, cam);
  layer(g, cam, 0.98, (g) => { headProfile(g, cx - 120, cy + WR * 1.25 + 520, 1.25, { fill: alpha('#05070d', 0.55), stroke: alpha(S().ui.blueprint, 0.6 * k), w: 8 }); glow(g, cx, cy, 900, S().ui.gold, 0.08); });
  wheelRunner(g, t + 2.95, cam, M);
  const te = wt('started', info, 1.9);
  UI.readout(g, { label: 'DISTANCE', value: '0 m', x: V(120, 90), y: V(170, 300), a: ease.out(prog(t, te - 0.3, te + 0.1)), color: S().ui.accent });
} });

// s11 — "And what they found flips the way most of us think about worry."  card flip
registerShot('s11', { draw(g, t, info) {
  const M = mood('void'); backdrop(g, [shade(M.sky[0], -0.3), M.sky[1]]);
  const tf = wt('flips', info, 1.25), tw = wt('worry', info, 3.3);
  const fl = ease.inOut(prog(t, tf - 0.05, tf + 0.55)), sx = Math.cos(fl * Math.PI), front = sx > 0;
  const cx = E.W / 2, cy = E.H * 0.46 + Math.sin(t * 1.4) * 6, w = V(1000, 860), h = V(380, 420);
  glow(g, cx, cy, w * 0.8, front ? S().ui.cream : S().ui.gold, 0.12 + 0.1 * (1 - Math.abs(sx)));
  g.save(); g.translate(cx, cy); g.rotate(-0.02 + 0.04 * fl); g.scale(Math.max(0.02, Math.abs(sx)) * (1 + 0.02 * t), 1 + 0.02 * t);
  rr(g, -w / 2, -h / 2, w, h, 36); g.fillStyle = front ? '#16203a' : '#241a10'; g.fill(); g.strokeStyle = front ? alpha(S().ui.blueprint, 0.6) : S().ui.gold; g.lineWidth = 4; g.stroke();
  if (front) { text(g, 'WORRY', -w * 0.22, 0, { size: 96, color: S().ui.cream, weight: 700, spacing: 4 }); text(g, '=', w * 0.04, 0, { size: 96, color: alpha(S().ui.cream, 0.7) }); text(g, 'FIXING', w * 0.26, 0, { size: 96, color: S().ui.gold, weight: 700, spacing: 4, glow: 20, glowColor: alpha(S().ui.gold, 0.5) }); }
  else { text(g, 'WORRY', -w * 0.22, 0, { size: 96, color: S().ui.cream, weight: 700, spacing: 4 }); text(g, '=', w * 0.04, 0, { size: 96, color: alpha(S().ui.cream, 0.7) }); text(g, '?', w * 0.26, 4, { size: 170, color: S().ui.accent, weight: 700, glow: 30, glowColor: alpha(S().ui.accent, 0.7) }); }
  g.restore();
  if (t > tw) FX.rings(g, cx, cy, t - tw, { count: 2, r0: 200, r1: 700, speed: 0.8, color: S().ui.gold, a: 0.25 * (1 - prog(t, tw, tw + 1.2)) });
  FX.dust(g, t, { count: 40, color: '#ffe2bd', a: 0.25 });
} });

// s12 — "To see it, we need to look at what your mind does when it can't switch off."
registerShot('s12', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, acc = S().ui.accent;
  const z = 1 + 0.06 * ease.inOut(t / info.dur);
  g.save(); g.translate(E.W / 2, E.H / 2); g.scale(z, z); g.translate(-E.W / 2, -E.H / 2);
  const draw = ease.inOut(prog(t, 0, 1.2));
  g.save(); g.setLineDash([2400 * draw, 4000]); headProfile(g, E.W / 2 - 60, E.H + 80, 0.95, { stroke: c, w: 5 }); g.restore();
  // brain zone glow + scanning ring
  const bx = E.W / 2 + 10, by = E.H * 0.42;
  const tm = wt('mind', info, 2.3); if (t > tm - 0.2) { ring(g, bx, by, 150 + 14 * Math.sin(t * 4), 3, alpha(gold, 0.7 * ease.out(prog(t, tm - 0.2, tm + 0.3)))); glow(g, bx, by, 260, gold, 0.18 * ease.out(prog(t, tm - 0.2, tm + 0.3))); }
  // the switch
  const ts = wt('switch', info, 3.55), sw = key(t, [[0, 0], [ts - 0.05, 0], [ts + 0.15, 1], [ts + 0.45, 1], [ts + 0.65, 0]]);
  const ax = bx, ay = by, a = ease.out(prog(t, 0.9, 1.4));
  g.save(); g.globalAlpha *= a; rr(g, ax - 70, ay - 110, 140, 220, 26); g.strokeStyle = c; g.lineWidth = 5; g.stroke();
  rr(g, ax - 34, ay - 74, 68, 148, 34); g.fillStyle = alpha(c, 0.15); g.fill();
  const ky = lerp(ay - 38, ay + 38, sw); circle(g, ax, ky, 30, sw > 0.5 ? acc : gold); glow(g, ax, ky, 90, sw > 0.5 ? acc : gold, 0.5);
  text(g, 'ON', ax + 110, ay - 40, { size: 40, color: sw < 0.5 ? gold : alpha(c, 0.5), font: FONTS.ui, weight: 900, align: 'left' });
  text(g, 'OFF', ax + 110, ay + 40, { size: 40, color: sw > 0.5 ? acc : alpha(c, 0.5), font: FONTS.ui, weight: 900, align: 'left' });
  g.restore();
  if (t > ts + 0.6) FX.rings(g, ax, ay - 38, t - ts - 0.6, { count: 2, r0: 40, r1: 220, speed: 1.5, color: gold, a: 0.5 * (1 - prog(t, ts + 0.6, ts + 1.4)) });
  g.restore();
} });

// s18 — "Your brain doesn't idle in silence."  activity line tries to go flat, then spikes back
function brainIcon(g, x, y, r, c, w = 6) { g.strokeStyle = c; g.lineWidth = w; g.lineCap = 'round';
  for (const dx of [-0.34, 0.34]) { g.beginPath(); g.ellipse(x + dx * r, y, r * 0.44, r * 0.62, 0, 0, 7); g.stroke(); }
  for (const s of [-1, 1]) { g.beginPath(); g.moveTo(x + s * r * 0.15, y - r * 0.35); g.quadraticCurveTo(x + s * r * 0.55, y - r * 0.2, x + s * r * 0.25, y + r * 0.05); g.quadraticCurveTo(x + s * r * 0.6, y + r * 0.25, x + s * r * 0.3, y + r * 0.45); g.stroke(); } }
registerShot('s18', { draw(g, t, info) {
  UI.blueprint(g); const c = UI.bpStroke(), gold = S().ui.gold, acc = S().ui.accent;
  const ti = wt('idle', info, 1.3), ts = wt('silence', info, 1.8);
  const flat = ease.inOut(prog(t, ti - 0.3, ts)) * (1 - ease.out(prog(t, ts + 0.1, ts + 0.35)));
  const bx = E.W / 2, by = E.H * 0.33, R = V(170, 200);
  brainIcon(g, bx, by, R * (1 + 0.02 * Math.sin(t * 6)), flat > 0.6 ? alpha(c, 0.6) : gold, 7);
  glow(g, bx, by, R * 2, gold, 0.25 * (1 - flat));
  // activity trace
  const x0 = V(220, 90), x1 = E.W - V(220, 90), y0 = E.H * 0.7, amp = 90;
  g.strokeStyle = flat > 0.6 ? c : gold; g.lineWidth = 5; g.lineJoin = 'round'; g.beginPath();
  for (let i = 0; i <= 240; i++) { const u = i / 240, x = lerp(x0, x1, u), tt = t * 3 - (1 - u) * 2.2; const tl = t - (1 - u) * 0.7;
    const fl = ease.inOut(prog(tl, ti - 0.3, ts)) * (1 - ease.out(prog(tl, ts + 0.1, ts + 0.35)));
    const spike = tl > ts + 0.1 ? Math.exp(-(tl - ts - 0.1) * 2) * 1.6 : 0;
    const v = (Math.sin(tt * 9) * 0.5 + Math.sin(tt * 23 + 1) * 0.3 + Math.sin(tt * 4.3) * 0.4) * (1 - fl * 0.95) * (1 + spike);
    i ? g.lineTo(x, y0 - v * amp) : g.moveTo(x, y0 - v * amp); }
  g.stroke(); glow(g, x1, y0, 70, gold, 0.6);
  text(g, 'ACTIVITY', x0, y0 - amp - 60, { size: 30, color: alpha(c, 0.9), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  if (t > ti - 0.2 && t < ts + 0.2) text(g, 'IDLE?', x1, y0 - amp - 60, { size: 40, color: c, font: FONTS.ui, weight: 900, align: 'right', alpha: ease.out(prog(t, ti - 0.2, ti + 0.1)) });
  if (t > ts + 0.1) text(g, 'NEVER', x1, y0 - amp - 60, { size: 44, color: acc, font: FONTS.ui, weight: 900, align: 'right', glow: 16, glowColor: alpha(acc, 0.6), alpha: ease.out(prog(t, ts + 0.1, ts + 0.3)) });
} });
