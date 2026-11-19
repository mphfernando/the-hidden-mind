import React from 'react';
import { Composition } from 'remotion';
import { Ep01Demo3D } from './demo/Ep01Demo3D';

export const FPS = 24;

export const Root: React.FC = () => (
  <>
    {/* 16:9 episode format */}
    <Composition id="Ep01Demo3D" component={Ep01Demo3D} fps={FPS} width={1920} height={1080}
      durationInFrames={Math.ceil(11.2 * FPS)} defaultProps={{ vertical: false }} />
    {/* 9:16 Shorts format: same scene, camera reframed */}
    <Composition id="Ep01Demo3DVertical" component={Ep01Demo3D} fps={FPS} width={1080} height={1920}
      durationInFrames={Math.ceil(11.2 * FPS)} defaultProps={{ vertical: true }} />
  </>
);
