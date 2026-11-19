import React, { useLayoutEffect } from 'react';
import { AbsoluteFill, Audio, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from 'remotion';
import { ThreeCanvas } from '@remotion/three';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ARCTIC } from '../kit/theme';
import { Milo3D } from '../kit/Milo3D';
import { Captions, wordTime } from '../kit/Captions';
import { Label3D } from '../kit/Label3D';
import { WORDS } from './words';

// Test scene: the first 11 s of episode 1 rebuilt in 3D.
// "You've replayed that conversation eleven times. You've rehearsed the email. Planned for the worst.
//  Run every 'what if.' And it feels like you're working on the problem."

const T = {
  replay: 0.25,
  eleven: wordTime(WORDS, 'eleven'),
  email: wordTime(WORDS, 'rehearsed'),
  worst: wordTime(WORDS, 'planned'),
  whatIf: wordTime(WORDS, 'what'),
  feels: wordTime(WORDS, 'and'),
};

const ease = (t: number, a: number, b: number, from: number, to: number) =>
  interpolate(t, [a, b], [from, to], { extrapolateLeft: 'clamp', extrapolateRight: 'clamp', easing: Easing.inOut(Easing.cubic) });

const CameraRig: React.FC<{ t: number; vertical: boolean }> = ({ t, vertical }) => {
  const { camera } = useThree();
  useLayoutEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    // slow push-in, then a closer move on "it feels like you're working on the problem"
    const push = ease(t, 0, 8.4, 0, 1);
    const close = ease(t, T.feels - 0.15, T.feels + 1.6, 0, 1);
    const from = vertical ? new THREE.Vector3(0.9, 2.0, 6.6) : new THREE.Vector3(1.6, 1.7, 5.6);
    const mid = vertical ? new THREE.Vector3(0.6, 1.9, 5.6) : new THREE.Vector3(1.1, 1.65, 4.6);
    const near = vertical ? new THREE.Vector3(0.35, 1.75, 3.6) : new THREE.Vector3(0.45, 1.8, 4.1);
    const p = from.clone().lerp(mid, push).lerp(near, close);
    p.x += Math.sin(t * 0.7) * 0.03; p.y += Math.sin(t * 0.9) * 0.02; // handheld breathe
    cam.position.copy(p);
    cam.fov = vertical ? 50 : 38;
    cam.updateProjectionMatrix();
    cam.lookAt(new THREE.Vector3(0, 1.55 + close * 0.3, 0).lerp(new THREE.Vector3(0, 1.85, 0), push * (1 - close) * 0.5));
  }, [camera, t, vertical]);
  return null;
};

// A puffy thought cloud that pops in at `at` seconds.
const Cloud: React.FC<{ t: number; at: number; pos: [number, number, number]; size?: number; dark?: boolean; label: string; fps: number; frame: number; squeeze?: number }> = ({ t, at, pos, size = 1, dark, label, fps, frame, squeeze = 1 }) => {
  const s = spring({ frame: frame - at * fps, fps, config: { damping: 11, stiffness: 120 } });
  if (t < at - 0.01) return null;
  const bob = Math.sin((t - at) * 1.7 + pos[0]) * 0.05;
  const color = dark ? '#33475a' : '#e6f6ff';
  const puffs: [number, number, number, number][] = [[0, 0, 0, 0.36], [-0.34, -0.06, 0, 0.27], [0.34, -0.05, 0, 0.28], [-0.15, 0.2, -0.05, 0.26], [0.18, 0.18, -0.05, 0.27], [0, -0.14, 0.1, 0.25]];
  return (
    <group position={[pos[0] * squeeze, pos[1] + bob, pos[2]]} scale={s * size * (squeeze < 1 ? 0.85 : 1)}>
      {puffs.map(([x, y, z, r], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <sphereGeometry args={[r, 24, 18]} />
          <meshStandardMaterial color={color} roughness={0.9} emissive={dark ? '#0a1a26' : '#5fe8ff'} emissiveIntensity={dark ? 0.2 : 0.07} />
        </mesh>
      ))}
      <Label3D text={label} position={[0, 0.02, 0.48]} height={0.2} color={dark ? '#ff9a8a' : ARCTIC.feature} />
    </group>
  );
};

const Bedroom: React.FC = () => (
  <group>
    {/* floor + walls */}
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial color={ARCTIC.floor} roughness={0.95} />
    </mesh>
    <mesh position={[0, 4, -2.2]} receiveShadow>
      <planeGeometry args={[30, 8]} />
      <meshStandardMaterial color={ARCTIC.wall} roughness={1} />
    </mesh>
    {/* window with night sky + moon */}
    <group position={[-2.1, 2.35, -2.17]}>
      <mesh>
        <planeGeometry args={[1.7, 1.5]} />
        <meshBasicMaterial color={ARCTIC.sky[1]} toneMapped={false} />
      </mesh>
      <mesh position={[0.45, 0.35, 0.01]}>
        <circleGeometry args={[0.16, 32]} />
        <meshBasicMaterial color="#f0fcff" toneMapped={false} />
      </mesh>
      {[[-0.5, 0.5], [-0.2, 0.15], [0.1, 0.55], [-0.6, -0.2], [0.55, -0.3], [0.2, -0.05]].map(([x, y], i) => (
        <mesh key={i} position={[x, y, 0.01]}>
          <circleGeometry args={[0.012, 8]} />
          <meshBasicMaterial color="#cfefff" toneMapped={false} />
        </mesh>
      ))}
      {/* frame */}
      {[[0, 0.78, 1.86, 0.08], [0, -0.78, 1.86, 0.08], [-0.89, 0, 0.08, 1.6], [0.89, 0, 0.08, 1.6], [0, 0, 0.05, 1.5], [0, 0, 1.7, 0.05]].map(([x, y, w, h], i) => (
        <mesh key={i} position={[x, y, 0.03]} castShadow>
          <boxGeometry args={[w, h, 0.06]} />
          <meshStandardMaterial color="#1a2e3a" roughness={0.7} />
        </mesh>
      ))}
    </group>
    {/* bed */}
    <group position={[0.4, 0, -0.75]}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.3, 0.4, 1.9]} />
        <meshStandardMaterial color="#16303e" roughness={0.9} />
      </mesh>
      <mesh position={[0, 0.48, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 0.18, 1.82]} />
        <meshStandardMaterial color="#bcd6e2" roughness={0.95} />
      </mesh>
      <mesh position={[0.15, 0.6, -0.1]} rotation={[0, 0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.12, 1.4]} />
        <meshStandardMaterial color="#4e7a92" roughness={1} />
      </mesh>
      <mesh position={[0, 1.0, -0.98]} castShadow>
        <boxGeometry args={[2.3, 1.1, 0.1]} />
        <meshStandardMaterial color="#16303e" roughness={0.9} />
      </mesh>
      <mesh position={[0.6, 0.66, -0.7]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[0.7, 0.14, 0.38]} />
        <meshStandardMaterial color="#e6f4fa" roughness={1} />
      </mesh>
    </group>
    {/* nightstand + lamp (the practical light) */}
    <group position={[-1.25, 0, -1.2]}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.6, 0.5]} />
        <meshStandardMaterial color="#1a2e3a" roughness={0.8} />
      </mesh>
      <mesh position={[0, 0.72, 0]}>
        <cylinderGeometry args={[0.03, 0.08, 0.25, 16]} />
        <meshStandardMaterial color="#2a4050" />
      </mesh>
      <mesh position={[0, 0.93, 0]}>
        <cylinderGeometry args={[0.1, 0.17, 0.2, 24, 1, true]} />
        <meshStandardMaterial color={ARCTIC.practical} emissive={ARCTIC.practical} emissiveIntensity={0.9} side={THREE.DoubleSide} />
      </mesh>
    </group>
  </group>
);

export const Ep01Demo3D: React.FC<{ vertical: boolean }> = ({ vertical }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const t = frame / fps;

  const slump = ease(t, T.worst, T.worst + 1.2, 0, 0.6);
  const hands = ease(t, T.feels + 0.2, T.feels + 1.2, 0, 1);
  const blinkPhase = [1.6, 4.4, 7.1, 9.9].some((b) => t > b && t < b + 0.12) ? 1 : 0;
  const sq = vertical ? 0.55 : 1; // pull clouds toward the centre for 9:16
  const elevenPop = spring({ frame: frame - T.eleven * fps, fps, config: { damping: 9 } });

  return (
    <AbsoluteFill style={{ background: ARCTIC.sky[0] }}>
      <ThreeCanvas width={width} height={height} shadows gl={{ antialias: true, preserveDrawingBuffer: true }}
        camera={{ fov: 38, near: 0.1, far: 60, position: [1.6, 1.7, 5.6] }}>
        <color attach="background" args={[ARCTIC.sky[0]]} />
        <fog attach="fog" args={[ARCTIC.fog, 7, 18]} />
        <CameraRig t={t} vertical={vertical} />
        <hemisphereLight args={['#8ab8c8', ARCTIC.dark, 0.55]} />
        {/* moonlight through the window: cool key with shadows */}
        <directionalLight position={[-4, 5, 3]} intensity={1.6} color={ARCTIC.key} castShadow
          shadow-mapSize-width={2048} shadow-mapSize-height={2048} shadow-camera-left={-4} shadow-camera-right={4}
          shadow-camera-top={4} shadow-camera-bottom={-4} shadow-bias={-0.0004} />
        {/* cyan rim from behind */}
        <directionalLight position={[2.5, 3, -4]} intensity={2.2} color={ARCTIC.rim} />
        {/* bedside lamp */}
        <pointLight position={[-1.25, 1.0, -1.2]} intensity={3.2} distance={5} decay={1.6} color={ARCTIC.practical} />
        <Bedroom />
        <Milo3D position={[0, 0.58, 0.05]} rotationY={0.2} slump={slump} handsToHead={hands} blink={blinkPhase}
          headTilt={ease(t, 0, 2, -0.15, 0.05) + slump * 0.2} headTurn={ease(t, T.whatIf, T.whatIf + 1, 0, -0.2)} brows={ease(t, 0, 3, 0.3, 1)} />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.replay} pos={[-1.15, 2.3, 0.35]} label="REPLAY" />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.email} pos={[0.2, 2.75, 0.1]} label="THE EMAIL" size={0.9} />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.worst} pos={[1.4, 2.2, 0.4]} label="WORST CASE" dark />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.whatIf} pos={[-0.5, 3.15, -0.2]} label="WHAT IF?" size={0.75} />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.whatIf + 0.35} pos={[1.0, 3.1, -0.3]} label="WHAT IF?" size={0.65} />
        <Cloud t={t} frame={frame} fps={fps} squeeze={sq} at={T.whatIf + 0.7} pos={[-1.8, 2.95, -0.4]} label="WHAT IF?" size={0.6} />
        {/* "eleven times" → ×11 stamped on the replay cloud */}
        {t >= T.eleven && (
          <Label3D text="×11" position={[-0.7 * sq, 2.68, 0.85]} height={0.3} scale={elevenPop} color={ARCTIC.ui.accent} />
        )}
      </ThreeCanvas>
      {/* grade: vignette, as in the 2D style */}
      <AbsoluteFill style={{ background: 'radial-gradient(ellipse at 50% 45%, transparent 55%, rgba(2,8,12,.55) 100%)' }} />
      <Captions words={WORDS} bottom={vertical ? 0.2 : 0.07} size={vertical ? 70 : 60} />
      <Audio src={staticFile('ep01-demo/vo.mp3')} />
    </AbsoluteFill>
  );
};
