// shots/04_city3d.js — s14: 3D night plaza; phone pings pop above random people (the experience-sampling app).
import { E, V, S, registerShot, mood, ease, prog, clamp, rng } from '/engine/core.js';
import { POSES } from '/engine/rig2d.js';
import { YOU, EXTRA } from '../cast.js';

registerShot('s14', {
  kind: '3d',
  init(T) {
    const M = mood('night'), { THREE } = T;
    const st = T.stage({ mood: 'night', fov: 38, fog: [16, 60], keyPos: [6, 12, 8], keyIntensity: 2.4, ambient: 1.9, bloom: 0.7 });
    st.add(T.ground(120, 120, M.floor, T.tiles(M.floor, 12, [14, 14])));
    // ring of buildings around the plaza
    const r = rng(9);
    for (let i = 0; i < 16; i++) { const a = (i / 16) * Math.PI * 2, d = 22 + r() * 4, h = 8 + r() * 14, w = 5 + r() * 4;
      const b = T.building(w, h, 5, { color: '#20243e', win: M.practical, lit: 0.45, seed: 30 + i }); b.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); b.lookAt(0, 0, 0); st.add(b); }
    // lamp posts with warm light
    for (const [x, z] of [[-7, -5], [7, 5], [-6, 7], [8, -6]]) { st.add(T.cyl(0.07, 0.09, 4.2, '#15121c', x, 2.1, z)); const lamp = T.sphere(0.25, T.basic(M.practical), x, 4.3, z); st.add(lamp); const pl = new THREE.PointLight(new THREE.Color(M.practical), 18, 12, 1.6); pl.position.set(x, 4, z); st.add(pl); }
    // people
    const people = [], pings = [];
    for (let i = 0; i < 34; i++) { const a = r() * Math.PI * 2, d = 1.2 + r() * 9.5;
      const outfit = i === 0 ? YOU : EXTRA;
      const f = T.figure3D(outfit, { rim: M.rim, pose: r() < 0.4 ? POSES.phone : POSES.stand, s: 1 }); f.position.set(Math.cos(a) * d, 0, Math.sin(a) * d); f.rotation.y = r() * Math.PI * 2; st.add(f); people.push(f);
      const ping = new THREE.Group(); const dot = T.sphere(0.13, T.basic(S().ui.gold)); const halo = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.025, 8, 32), T.basic(S().ui.gold, { transparent: true, opacity: 0.7 }));
      ping.add(dot, halo); ping.position.set(f.position.x, 2.35, f.position.z); ping.scale.setScalar(0.001); st.add(ping);
      pings.push({ ping, halo, at: 0.3 + r() * 4.2 }); }
    return { stage: st, pings };
  },
  draw(s, t, info, T) {
    for (const p of s.pings) { const k = prog(t, p.at, p.at + 0.25), out = prog(t, p.at + 1.2, p.at + 1.6); const sc = ease.outBack(k) * (1 - out);
      p.ping.scale.setScalar(Math.max(0.001, sc)); p.halo.scale.setScalar(1 + 1.5 * prog(t, p.at, p.at + 1.0)); p.halo.material.opacity = 0.7 * (1 - prog(t, p.at, p.at + 1.0)); p.ping.lookAt(s.stage.camera.position); }
    T.orbit(s.stage.camera, t, { target: [0, 2.2, 0], radius: [16, 13], height: [6, 3.6], from: -0.5, to: 0.35, dur: info.dur });
  },
  overlay(g, t, info) {
    const a = ease.out(prog(t, 2.0, 2.4)) * clamp((info.dur - t) / 0.3);
    if (a > 0) { const n = Math.round(2000 + 3000 * ease.out(prog(t, 2.0, 3.6))); }
  },
});
