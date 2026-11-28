import React from 'react';
import { useCurrentFrame, useVideoConfig, interpolate } from 'remotion';
import '@fontsource/nunito/900.css';
import { ARCTIC } from './theme';

export type Word = { word: string; start: number; end: number };

// Group words into 2–4 word phrases, breaking at punctuation and pauses (≥ 0.3 s).
export const phrases = (words: readonly Word[], maxWords = 4): Word[][] => {
  const out: Word[][] = [];
  let cur: Word[] = [];
  words.forEach((w, i) => {
    cur.push(w);
    const next = words[i + 1];
    const punct = /[.,!?;:"”]$/.test(w.word);
    const gap = next ? next.start - w.end : 99;
    if (cur.length >= maxWords || punct || gap > 0.3) {
      out.push(cur);
      cur = [];
    }
  });
  if (cur.length) out.push(cur);
  return out;
};

// Word captions, same look as the 2D studio: current phrase, active word in accent cyan.
export const Captions: React.FC<{ words: readonly Word[]; bottom?: number; size?: number }> = ({ words, bottom = 0.11, size = 64 }) => {
  const frame = useCurrentFrame();
  const { fps, height } = useVideoConfig();
  const t = frame / fps;
  const groups = phrases(words);
  const g = groups.find((p, i) => t >= p[0].start - 0.05 && t < (groups[i + 1]?.[0].start ?? p[p.length - 1].end + 0.6) - 0.05);
  if (!g) return null;
  const pop = interpolate(t - g[0].start, [-0.05, 0.08], [0.9, 1], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' });
  return (
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: bottom * height, display: 'flex', justifyContent: 'center' }}>
      <div style={{
        transform: `scale(${pop})`, fontFamily: 'Nunito', fontWeight: 900, fontSize: size, letterSpacing: 0.5,
        padding: '10px 28px', borderRadius: 22, background: 'rgba(4,14,22,.55)', textTransform: 'uppercase',
        maxWidth: '86%', textAlign: 'center', lineHeight: 1.15,
      }}>
        {g.map((w, i) => {
          const active = t >= w.start - 0.03 && t < w.end + 0.15;
          return (
            <span key={i} style={{
              color: active ? ARCTIC.ui.accent : ARCTIC.feature, marginRight: i < g.length - 1 ? '0.3em' : 0,
              textShadow: active ? `0 0 18px ${ARCTIC.ui.accent}88, 0 4px 0 #000a` : '0 4px 0 #000a',
            }}>{w.word.replace(/^["“]|["”]$/g, '')}</span>
          );
        })}
      </div>
    </div>
  );
};

// Look up when a spoken word starts (the 2D studio's wordTime): every number/name spoken appears on screen at that moment.
export const wordTime = (words: readonly Word[], needle: string, nth = 0) => {
  const hits = words.filter((w) => w.word.toLowerCase().replace(/[^a-z0-9']/g, '') === needle.toLowerCase());
  return hits[nth]?.start ?? 0;
};
