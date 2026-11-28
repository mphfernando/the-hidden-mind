import React from 'react';
import { MILO, ARCTIC } from './theme';

// MILO in 3D: violet hoodie, dark legs, lilac neck headphones, pale round head, dot eyes.
// Seated pose (on a bed/chair edge). Units ≈ metres; origin = seat point.
export type MiloPose = {
  headTilt?: number;   // radians, + = look down
  headTurn?: number;   // radians, + = look to his left (screen right)
  slump?: number;      // 0..1, shoulders/torso forward
  handsToHead?: number; // 0..1, raises both hands to the temples
  blink?: number;      // 0..1 (1 = closed)
  brows?: number;      // 0..1, worried: inner ends raised
};

const mat = (color: string, rough = 0.75) => <meshStandardMaterial color={color} roughness={rough} metalness={0} />;

const Limb: React.FC<{ len: number; r: number; color: string; position?: [number, number, number]; rotation?: [number, number, number] }> = ({ len, r, color, position, rotation }) => (
  // capsule hanging from its top end
  <group position={position} rotation={rotation}>
    <mesh position={[0, -len / 2, 0]} castShadow>
      <capsuleGeometry args={[r, len, 6, 14]} />
      {mat(color)}
    </mesh>
  </group>
);

export const Milo3D: React.FC<MiloPose & { position?: [number, number, number]; rotationY?: number }> = ({
  headTilt = 0, headTurn = 0, slump = 0, handsToHead = 0, blink = 0, brows = 0, position = [0, 0, 0], rotationY = 0,
}) => {
  const lean = 0.12 + slump * 0.28;
  // arms: from hanging on knees (0) to hands at temples (1)
  const h = handsToHead;
  const upperArmX = -0.55 * (1 - h) - 0.25 * h;  // resting forward on the knees -> slightly forward
  const upperArmZ = 0.18 + h * 2.01;             // elbows swing out and up
  const foreArmX = -0.54 * (1 - h);
  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* thighs forward, shins down */}
      {[-0.11, 0.11].map((x) => (
        <group key={x} position={[x, 0.02, 0]}>
          <Limb len={0.42} r={0.075} color={MILO.legs} rotation={[-Math.PI / 2, 0, 0]} />
          <Limb len={0.44} r={0.07} color={MILO.legs} position={[0, 0, 0.42]} />
          <mesh position={[0, -0.5, 0.48]} castShadow>
            <boxGeometry args={[0.13, 0.08, 0.24]} />
            {mat('#dfe9f0', 0.6)}
          </mesh>
        </group>
      ))}
      {/* torso pivots at the hips */}
      <group rotation={[lean, 0, 0]}>
        <mesh position={[0, 0.32, 0]} castShadow>
          <capsuleGeometry args={[0.2, 0.36, 8, 20]} />
          {mat(MILO.hoodie, 0.85)}
        </mesh>
        {/* hoodie pocket + drawstrings */}
        <mesh position={[0, 0.2, 0.19]}>
          <boxGeometry args={[0.22, 0.09, 0.02]} />
          {mat('#7a4cc4', 0.9)}
        </mesh>
        {[-0.05, 0.05].map((x) => (
          <mesh key={x} position={[x, 0.5, 0.2]}>
            <cylinderGeometry args={[0.008, 0.008, 0.14]} />
            {mat('#e8e0ff')}
          </mesh>
        ))}
        {/* hood bunched behind the neck */}
        <mesh position={[0, 0.62, -0.1]} rotation={[0.5, 0, 0]} castShadow>
          <torusGeometry args={[0.13, 0.06, 10, 20, Math.PI]} />
          {mat('#7a4cc4', 0.9)}
        </mesh>
        {/* neck headphones */}
        <group position={[0, 0.66, 0.0]} rotation={[Math.PI / 2 + 0.25, 0, 0]}>
          <mesh>
            <torusGeometry args={[0.12, 0.018, 8, 28, Math.PI * 1.25]} />
            {mat('#3a3550', 0.5)}
          </mesh>
        </group>
        {[-0.13, 0.13].map((x) => (
          <mesh key={x} position={[x, 0.66, 0.05]} rotation={[0, 0, Math.PI / 2]} castShadow>
            <cylinderGeometry args={[0.065, 0.065, 0.05, 20]} />
            {mat(MILO.phones, 0.45)}
          </mesh>
        ))}
        {/* arms from the shoulders */}
        {[-1, 1].map((s) => (
          <group key={s} position={[s * 0.25, 0.55, 0]} rotation={[upperArmX, 0, s * upperArmZ]}>
            <Limb len={0.3} r={0.06} color={MILO.hoodie} />
            <group position={[0, -0.3, 0]} rotation={[foreArmX, 0, s * h * 1.65]}>
              <Limb len={0.28} r={0.055} color={MILO.hoodie} />
              <mesh position={[0, -0.32, 0]} castShadow>
                <sphereGeometry args={[0.06, 14, 12]} />
                {mat(MILO.skin, 0.6)}
              </mesh>
            </group>
          </group>
        ))}
        {/* head */}
        <group position={[0, 0.86, 0.02]} rotation={[headTilt - lean * 0.6, headTurn, 0]}>
          <mesh position={[0, 0.17, 0]} castShadow>
            <sphereGeometry args={[0.23, 32, 24]} />
            {mat(MILO.skin, 0.55)}
          </mesh>
          {/* messy fringe */}
          {[-0.12, -0.04, 0.05, 0.13].map((x, i) => (
            <mesh key={x} position={[x, 0.36 - Math.abs(x) * 0.4, 0.07 + (i % 2) * 0.03]} rotation={[0.3, 0, x * 2]}>
              <coneGeometry args={[0.07, 0.16, 8]} />
              {mat('#2b2238', 0.8)}
            </mesh>
          ))}
          <mesh position={[0, 0.3, -0.03]} scale={[1, 0.62, 1]}>
            <sphereGeometry args={[0.235, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
            {mat('#2b2238', 0.8)}
          </mesh>
          {/* eyes (scaleY = blink) */}
          {[-0.075, 0.075].map((x) => (
            <group key={x} position={[x, 0.17, 0.215]}>
              <mesh scale={[1, Math.max(0.08, 1 - blink), 0.6]}>
                <sphereGeometry args={[0.03, 14, 12]} />
                <meshStandardMaterial color={ARCTIC.ink} roughness={0.2} />
              </mesh>
              {/* worried brows: inner ends raised */}
              <mesh position={[0, 0.07 + brows * 0.015, 0.0]} rotation={[0, 0, (x < 0 ? 1 : -1) * (0.1 + brows * 0.32)]}>
                <boxGeometry args={[0.07, 0.014, 0.012]} />
                <meshStandardMaterial color={ARCTIC.ink} />
              </mesh>
            </group>
          ))}
          {/* small flat mouth */}
          <mesh position={[0, 0.06, 0.218]} rotation={[0, 0, 0]}>
            <boxGeometry args={[0.06, 0.01, 0.01]} />
            <meshStandardMaterial color={ARCTIC.ink} />
          </mesh>
        </group>
      </group>
    </group>
  );
};
