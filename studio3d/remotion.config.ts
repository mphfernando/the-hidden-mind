import { Config } from '@remotion/cli/config';

// Cloud sessions can't download Remotion's own Chrome: use the pre-installed headless shell.
// On a machine with Chrome, delete this line (or set REMOTION_BROWSER to another binary).
const browser =
  process.env.REMOTION_BROWSER ??
  '/opt/pw-browsers/chromium_headless_shell-1243/chrome-headless-shell-linux64/chrome-headless-shell';
Config.setBrowserExecutable(browser);

// WebGL without a GPU: SwiftShader via ANGLE. With a GPU, use 'angle' (much faster).
Config.setChromiumOpenGlRenderer((process.env.REMOTION_GL as 'angle' | 'swangle') ?? 'swangle');
Config.setVideoImageFormat('jpeg');
Config.setJpegQuality(92);
Config.setConcurrency(Number(process.env.REMOTION_CONCURRENCY ?? 3));
Config.setCodec('h264');
Config.setCrf(18);
