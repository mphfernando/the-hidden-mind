// shots/cards.js — one design card per character + a cast lineup.
import { E, S, registerShot, mood, backdrop, ease, prog, clamp, lerp, seg, circle, ring, rr, glow, alpha, shade, mix, text, FONTS } from '/engine/core.js';
import { POSES, breathe, bigFace } from '/engine/rig2d.js';
import * as FX from '/engine/fx2d.js';
import { drawChar, faceAcc } from '../accessories.js';
import { fearShadow } from '../sets/motifs.js';

const WORRY = { brows: 'angry' };
export const CHARS = [
  { id: 'milo', name: 'MILO', role: 'THE OVERTHINKER  ·  "YOU"', sig: '#8a5ad6', sigName: 'Violet hoodie',
    outfit: { top: 'hoodie', color: '#8a5ad6', head: 'none', legs: '#2a2f45' }, acc: ['neckphones'], col: { phonesCup: '#c9b2ff' },
    poses: [[POSES.phone, 'worried', 'phone'], [POSES.handsOnHead, 'scared'], [POSES.think, 'thinking']], face: 'worried', faceOv: WORRY,
    traits: ['Replays every conversation', 'Headphones on = hiding from noise', 'Hood goes up when anxious'], use: 'Main POV in every video' },
  { id: 'vex', name: 'VEX', role: 'THE INNER CRITIC', sig: '#ff6f61', sigName: 'Coral pocket square',
    outfit: { top: 'trench', color: '#1d1b26', head: 'fedora', headColor: '#15131c', face: 'sunglasses' }, acc: ['pocket'], col: { pocket: '#ff6f61' },
    poses: [[POSES.crossArms, 'smirk'], [POSES.point, 'angry'], [POSES.explain, 'smirk']], face: 'smirk',
    traits: ['The voice saying "what if..."', 'Always half in shadow', 'Never raises his voice'], use: 'Negative self-talk, doubt' },
  { id: 'sage', name: 'SAGE', role: 'THE CALM GUIDE', sig: '#2fb5a8', sigName: 'Teal scarf',
    outfit: { top: 'tshirt', color: '#e9e4da', head: 'bun', face: 'glasses', legs: '#3a4256' }, acc: ['scarf'], col: { scarf: '#2fb5a8' },
    poses: [[POSES.holdFront, 'smile', 'cup'], [POSES.explain, 'happy'], [POSES.relaxed, 'smile']], face: 'smile',
    traits: ['Speaks slowly, never rushes', 'Always holding warm tea', 'Turns problems into steps'], use: 'Solutions, the payoff' },
  { id: 'ada', name: 'DR. ADA', role: 'THE RESEARCHER', sig: '#f2c21a', sigName: 'Yellow lanyard',
    outfit: { top: 'labcoat', head: 'curly', face: 'glasses' }, acc: ['lanyard'], col: { lanyard: '#f2c21a' },
    poses: [[POSES.holdFront, 'smile', 'tablet'], [POSES.think, 'thinking'], [POSES.point, 'surprised']], face: 'thinking',
    traits: ['Cites real studies only', 'Points at charts with joy', 'Glasses glint on a reveal'], use: 'Facts, studies, numbers' },
  { id: 'juno', name: 'JUNO', role: 'THE ANXIOUS FRIEND', sig: '#e0a92a', sigName: 'Mustard beanie',
    outfit: { top: 'tshirt', color: '#3a6ea5', head: 'beanie', headColor: '#e0a92a', legs: '#2a2f45' }, acc: ['backpack'], col: { backpack: '#c0563f' },
    poses: [[POSES.phone, 'nervous', 'phone'], [POSES.shrug, 'confused'], [POSES.wave, 'happy']], face: 'nervous', faceOv: WORRY,
    traits: ['Checks the phone every 5 sec', 'Over-apologises', 'Loyal, funny, relatable'], use: 'Examples, social scenes' },
  { id: 'ray', name: 'RAY', role: 'THE BURNOUT', sig: '#d64a33', sigName: 'Loose red tie',
    outfit: { top: 'suit', color: '#4a5066', head: 'spiky', legs: '#2c3040' }, acc: ['tie', 'briefcase'], col: { tie: '#d64a33', looseTie: true },
    poses: [[POSES.sad, 'sleepy'], [POSES.facepalm, 'sad'], [POSES.stand, 'neutral']], face: 'sleepy',
    traits: ['Tie gets looser each scene', 'Coffee is his personality', 'Smiles only at 5 pm'], use: 'Stress, work, exhaustion' },
  { id: 'pip', name: 'PIP', role: 'THE INNER CHILD', sig: '#3fb950', sigName: 'Green backpack + cap',
    outfit: { top: 'tshirt', color: '#f2efe8', head: 'capBack', headColor: '#d64a33', kid: true, legs: '#3a6ea5' }, acc: ['backpack'], col: { backpack: '#3fb950' },
    poses: [[POSES.cheer, 'joy'], [POSES.sad, 'cry'], [POSES.wave, 'happy']], face: 'joy',
    traits: ['Pure curiosity, no filter', 'Appears in memories', 'Glows warmer than the rest'], use: 'Childhood, healing, memory' },
];

function stage(g, t, sig) {
  const M = mood('interiorCool'), GY = E.H * 0.83;
  backdrop(g, [shade(M.sky[0], -0.45), shade(M.sky[1], -0.5)]);
  g.strokeStyle = alpha(S().ui.blueprint, 0.05); g.lineWidth = 1; for (let x = 0; x < E.W; x += 60) { g.beginPath(); g.moveTo(x, 0); g.lineTo(x, E.H); g.stroke(); } for (let y = 0; y < E.H; y += 60) { g.beginPath(); g.moveTo(0, y); g.lineTo(E.W, y); g.stroke(); }
  g.fillStyle = shade(M.floor, -0.35); g.fillRect(0, GY, E.W, E.H - GY);
  glow(g, 440, GY - 300, 520, sig, 0.12);
  FX.lightCone(g, 440, -40, { angle: Math.PI / 2, spread: 0.45, len: GY + 80, color: M.key, a: 0.12 });
  FX.pool(g, 440, GY + 8, 300, 40, M.key, 0.35); FX.pool(g, 960, GY + 8, 330, 34, M.key, 0.18);
  seg(g, [[1290, 70], [1290, E.H - 70]], 2, alpha(S().ui.blueprint, 0.2));
  return { GY, M };
}
function header(g, c) {
  text(g, c.name, 80, 96, { size: 92, color: S().ui.cream, align: 'left', spacing: 4, glow: 18, glowColor: alpha(c.sig, 0.6) });
  text(g, c.role, 84, 160, { size: 30, color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
  circle(g, 100, 216, 18, c.sig); ring(g, 100, 216, 18, 3, alpha('#ffffff', 0.5));
  text(g, c.sigName.toUpperCase() + '   ' + c.sig.toUpperCase(), 132, 218, { size: 24, color: alpha(S().ui.cream, 0.8), font: FONTS.ui, weight: 900, align: 'left', spacing: 2 });
}
function traits(g, c, x, y) {
  text(g, 'PERSONALITY', x, y, { size: 24, color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
  c.traits.forEach((s, i) => { circle(g, x + 8, y + 52 + i * 46, 6, c.sig); text(g, s, x + 28, y + 54 + i * 46, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 800, align: 'left' }); });
  text(g, 'BEST FOR', x, y + 210, { size: 24, color: S().ui.gold, font: FONTS.ui, weight: 900, align: 'left', spacing: 4 });
  text(g, c.use, x, y + 252, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 800, align: 'left' });
}
CHARS.forEach((c) => registerShot(c.id, { draw(g, t) {
  const { GY, M } = stage(g, t, c.sig), rim = { color: M.rim, dir: [-0.7, -0.6], w: 4 };
  header(g, c);
  const [hp, he, hprop] = c.poses[0];
  drawChar(g, { x: 440, y: GY, s: 2.55, facing: 1, outfit: c.outfit, pose: breathe(hp, t), expr: he, prop: hprop, rim: { ...rim, w: 6 } }, c.acc, c.col);
  c.poses.slice(1).forEach(([p, e, pr], i) => { const x = 860 + i * 250; drawChar(g, { x, y: GY, s: 1.45, facing: i ? -1 : 1, outfit: c.outfit, pose: breathe(p, t, 1, i + 2), expr: e, prop: pr, rim }, c.acc, c.col);
    text(g, e.toUpperCase(), x, GY + 46, { size: 22, color: alpha(S().ui.cream, 0.6), font: FONTS.ui, weight: 900, spacing: 3 }); });
  // close-up
  const fx = 1600, fy = 380, r = 165;
  glow(g, fx, fy, r * 2, c.sig, 0.12);
  g.save(); g.beginPath(); rr(g, fx - 260, fy - 290, 520, 520, 30); g.clip(); g.fillStyle = shade(M.wall, -0.4); g.fillRect(fx - 260, fy - 290, 520, 520);
  bigFace(g, fx, fy, r, { outfit: c.outfit, expr: c.face, face: c.faceOv, rimColor: c.sig, rimSide: -1, look: [0.3, -0.2] }); faceAcc(g, fx, fy, r, c.acc, c.col); g.restore();
  rr(g, fx - 260, fy - 290, 520, 520, 30); g.strokeStyle = alpha(c.sig, 0.6); g.lineWidth = 3; g.stroke();
  text(g, 'CLOSE-UP', fx - 240, fy - 258, { size: 20, color: alpha(S().ui.cream, 0.7), font: FONTS.ui, weight: 900, align: 'left', spacing: 3 });
  traits(g, c, 1345, 700);
  FX.dust(g, t, { count: 30, color: '#cfe0ff', a: 0.25 });
} }));

// the Shadow: a recurring "character" for fear / what overthinking hides
registerShot('shadow', { draw(g, t) {
  const { GY, M } = stage(g, t, '#7fd8ff');
  header(g, { name: 'THE SHADOW', role: 'FEAR  ·  WHAT OVERTHINKING HIDES', sig: '#7fd8ff', sigName: 'Glowing eyes' });
  fearShadow(g, 440, GY, 640, t, { eyes: 1, eyeColor: S().ui.accent, color: 'rgba(2,3,10,.92)' });
  const stages = [[0.45, 0, 'SMALL'], [0.75, 0.4, 'GROWING'], [1, 1, 'AWAKE']];
  stages.forEach(([gr, ey, lab], i) => { const x = 820 + i * 160; fearShadow(g, x, GY, 300, t + i, { grow: gr, eyes: ey, eyeColor: S().ui.accent, color: 'rgba(2,3,10,.9)' }); text(g, lab, x, GY + 46, { size: 22, color: alpha(S().ui.cream, 0.6), font: FONTS.ui, weight: 900, spacing: 3 }); });
  drawChar(g, { x: 1210, y: GY, s: 1.0, facing: -1, outfit: CHARS[0].outfit, pose: POSES.stand, expr: 'scared', rim: { color: M.rim, dir: [-0.7, -0.6] } }, ['neckphones'], CHARS[0].col);
  const fx = 1600, fy = 380; g.save(); g.beginPath(); rr(g, fx - 260, fy - 290, 520, 520, 30); g.clip(); g.fillStyle = '#05060c'; g.fillRect(fx - 260, fy - 290, 520, 520);
  fearShadow(g, fx, fy + 1420, 1500, t, { w: 700, eyes: 1, eyeColor: S().ui.accent, color: 'rgba(0,0,0,1)' }); g.restore();
  rr(g, fx - 260, fy - 290, 520, 520, 30); g.strokeStyle = alpha('#7fd8ff', 0.5); g.lineWidth = 3; g.stroke();
  traits(g, { sig: '#7fd8ff', traits: ['Grows when Milo overthinks', 'Eyes open on big reveals', 'Shrinks when fear is named'], use: 'Twists, cliffhangers, fear' }, 1345, 700);
} });

// lineup of the whole cast
registerShot('lineup', { draw(g, t) {
  const { GY, M } = stage(g, t, '#8fb8e8');
  text(g, 'THE CAST', E.W / 2, 110, { size: 96, color: S().ui.cream, spacing: 8, glow: 24, glowColor: alpha(S().ui.gold, 0.4) });
  fearShadow(g, E.W / 2, GY - 10, 600, t, { w: 460, eyes: 1, eyeColor: S().ui.accent, color: 'rgba(2,3,10,.55)' });
  const n = CHARS.length, gap = 225;
  CHARS.forEach((c, i) => { const x = E.W / 2 + (i - (n - 1) / 2) * gap; const [p, e, pr] = c.poses[0];
    glow(g, x, GY - 200, 200, c.sig, 0.1);
    drawChar(g, { x, y: GY, s: 1.75, facing: i < n / 2 ? 1 : -1, outfit: c.outfit, pose: breathe(p, t, 1, i), expr: e, prop: pr, rim: { color: M.rim, dir: [0, -1], w: 5 } }, c.acc, c.col);
    text(g, c.name, x, GY + 52, { size: 30, color: S().ui.cream, font: FONTS.ui, weight: 900, spacing: 2 }); circle(g, x, GY + 88, 9, c.sig); });
} });
