import React, { useMemo } from 'react';
import * as THREE from 'three';
import { continueRender, delayRender } from 'remotion';
import '@fontsource/fredoka/700.css';

// Load the label font once, before the first frame is captured (textures are then drawn synchronously,
// so a label is never missing from the frame it first appears in).
const FONT = '700 96px Fredoka';
if (typeof document !== 'undefined') {
  const h = delayRender('label font');
  document.fonts.load(FONT).then(() => continueRender(h), () => continueRender(h));
}

const cache = new Map<string, { tex: THREE.CanvasTexture; aspect: number }>();
const makeTexture = (text: string, color: string, bg: string) => {
  const key = `${text}|${color}|${bg}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d')!;
  ctx.font = FONT;
  const w = Math.ceil(ctx.measureText(text).width) + 90;
  c.width = w; c.height = 150;
  ctx.font = FONT;
  ctx.fillStyle = bg;
  ctx.beginPath(); ctx.roundRect(4, 4, w - 8, 142, 40); ctx.fill();
  ctx.strokeStyle = 'rgba(160,240,255,.55)'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(text, w / 2, 80);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  const out = { tex, aspect: w / 150 };
  cache.set(key, out);
  return out;
};

// Text in 3D space as a camera-facing sprite (reads like the 2D studio's callouts).
export const Label3D: React.FC<{
  text: string; color?: string; bg?: string; position: [number, number, number]; height?: number; opacity?: number; scale?: number;
}> = ({ text, color = '#e8fbff', bg = 'rgba(10,30,44,.92)', position, height = 0.32, opacity = 1, scale = 1 }) => {
  const { tex, aspect } = useMemo(() => makeTexture(text, color, bg), [text, color, bg]);
  return (
    <sprite position={position} scale={[height * aspect * scale, height * scale, 1]} renderOrder={10}>
      <spriteMaterial map={tex} transparent opacity={opacity} depthTest={false} depthWrite={false} toneMapped={false} />
    </sprite>
  );
};
