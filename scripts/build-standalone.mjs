import { execFileSync, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as esbuild from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const outDir = path.join(rootDir, 'standalone');
const tmpAudioDir = path.join('/tmp', 'mcd_nightfall_itch_audio');

fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(tmpAudioDir, { recursive: true });

// 1. Compile Tailwind + app CSS cleanly using Vite build
console.log('1/4 Compiling Tailwind CSS via Vite...');
execSync('npx vite build', { cwd: rootDir, stdio: 'inherit' });

const distAssetsDir = path.join(rootDir, 'dist', 'assets');
const cssFiles = fs.readdirSync(distAssetsDir).filter((f) => f.endsWith('.css'));
if (cssFiles.length === 0) {
  throw new Error('No compiled CSS file found in dist/assets');
}
const compiledCss = cssFiles
  .map((f) => fs.readFileSync(path.join(distAssetsDir, f), 'utf8'))
  .join('\n')
  .replace(/<\/style/gi, '<\\/style');

// 2. Transcode all referenced MP4 audio tracks into compact MP3 base64 data URIs
console.log('2/4 Extracting & encoding audio assets to base64 MP3 data URIs...');
const audioTracks = [
  {
    ref: './assets/aistudio/cold_glass_passage_7ecca980.mp4',
    bitrate: '40k',
    channels: '1',
    rate: '24000',
  },
  {
    ref: './assets/aistudio/jumpscaresound_4d78f6ef.mp4',
    bitrate: '64k',
    channels: '1',
    rate: '44100',
  },
  {
    ref: './assets/aistudio/snaptik.vn_7512942661389618454_2dc3b0a5.mp4',
    bitrate: '64k',
    channels: '1',
    rate: '44100',
  },
  {
    ref: './assets/aistudio/YTDown.com_YouTube_Media_Nd5iM61itKE_Horror-Laughing-Sound-effect_001_1080p_8fabfb1f.mp4',
    bitrate: '64k',
    channels: '1',
    rate: '44100',
  },
  {
    ref: './assets/aistudio/YTDown.com_YouTube_Media_KDy_NTqphlg_Scary-Laugh-Sound-Effect_001_1080p_40736b8b.mp4',
    bitrate: '64k',
    channels: '1',
    rate: '44100',
  },
  {
    ref: './assets/aistudio/chasesound_a0aed555.mp4',
    bitrate: '56k',
    channels: '1',
    rate: '32000',
  },
  {
    ref: './assets/aistudio/YTDown.com_YouTube_Media_cRaXl6PPMNM_Cafe-Day-1-The-Closing-Shift-OST_001_720p_38821285.mp4',
    bitrate: '32k',
    channels: '1',
    rate: '22050',
  },
  {
    ref: './assets/aistudio/YTDown.com_YouTube_Media_53q2nB3kXz4_Cafe-Day-3-The-Closing-Shift-OST_001_720p_eb42c5ab.mp4',
    bitrate: '32k',
    channels: '1',
    rate: '22050',
  },
  {
    ref: './assets/aistudio/after_the_machine_stops_ee49b18a.mp3',
    bitrate: '40k',
    channels: '1',
    rate: '24000',
  },
];

const shortKeyByRef = {};
const shortAssetDataUriMap = {};
audioTracks.forEach((track, idx) => {
  const srcPath = path.join(rootDir, 'public', track.ref.replace(/^\.\//, ''));
  if (!fs.existsSync(srcPath)) {
    throw new Error(`Missing asset file: ${srcPath}`);
  }
  const baseName = path.basename(srcPath, path.extname(srcPath));
  const outMp3 = path.join(tmpAudioDir, `${baseName}.mp3`);

  execFileSync(
    'ffmpeg',
    [
      '-y',
      '-v',
      'error',
      '-i',
      srcPath,
      '-vn',
      '-acodec',
      'libmp3lame',
      '-ac',
      track.channels,
      '-ar',
      track.rate,
      '-b:a',
      track.bitrate,
      outMp3,
    ],
    { stdio: 'inherit' }
  );

  const mp3Buf = fs.readFileSync(outMp3);
  const shortKey = `a${idx}`;
  shortKeyByRef[track.ref] = shortKey;
  shortAssetDataUriMap[shortKey] = `data:audio/mpeg;base64,${mp3Buf.toString('base64')}`;
  console.log(
    `   - [${shortKey}] ${baseName}.mp3 (${(mp3Buf.length / 1024).toFixed(1)} KB)`
  );
});

// 3. Bundle all TypeScript/React game modules into one ES module via esbuild,
// keeping Three.js external so it loads cleanly from the HTML <script type="importmap"> CDN.
console.log('3/4 Bundling all TypeScript/React/GameEngine modules into single ES module...');
const result = await esbuild.build({
  entryPoints: [path.join(rootDir, 'src', 'main.tsx')],
  bundle: true,
  write: false,
  format: 'esm',
  platform: 'browser',
  target: ['es2022'],
  minify: true,
  jsx: 'automatic',
  tsconfig: path.join(rootDir, 'tsconfig.json'),
  external: ['three', 'three/*'],
  define: {
    'process.env.NODE_ENV': '"production"',
  },
  plugins: [
    {
      name: 'skip-css-imports',
      setup(build) {
        build.onResolve({ filter: /\.css$/ }, () => ({
          path: 'virtual-empty-css',
          namespace: 'skip-css',
        }));
        build.onLoad({ filter: /.*/, namespace: 'skip-css' }, () => ({
          contents: '',
          loader: 'js',
        }));
      },
    },
  ],
});

let bundledJs = result.outputFiles[0].text;

// Replace every './assets/aistudio/...' literal with short key lookup into __EMBEDDED_AUDIO_ASSETS__
for (const [ref, shortKey] of Object.entries(shortKeyByRef)) {
  const doubleQuoted = JSON.stringify(ref);
  const singleQuoted = `'${ref}'`;
  const replacement = `__EMBEDDED_AUDIO_ASSETS__.${shortKey}`;
  bundledJs = bundledJs.split(doubleQuoted).join(replacement);
  bundledJs = bundledJs.split(singleQuoted).join(replacement);
}

// Verify zero leftover un-inlined ./assets/ references remain
if (bundledJs.includes('./assets/aistudio/') || bundledJs.includes('assets/aistudio/')) {
  throw new Error('Found un-inlined assets/aistudio/ reference in bundled JS!');
}

// Place __EMBEDDED_AUDIO_ASSETS__ right after leading ES module import statements
const leadingImportRegex =
  /^(?:\s*import\s+(?:(?:\*\s+as\s+[\w$]+|\{[^}]*\}|[\w$]+(?:\s*,\s*(?:\{[^}]*\}|\*\s+as\s+[\w$]+))?)\s+from\s+)?["'][^"']+["']\s*;?)+/;
const importMatch = bundledJs.match(leadingImportRegex);
const importPrefix = importMatch ? `${importMatch[0]}\n` : '';
const bodyWithoutImports = importMatch ? bundledJs.slice(importMatch[0].length) : bundledJs;

// Escape literal </script inside JS strings/comments so inline <script type="module"> cannot terminate early
const safeInlineJs = `${importPrefix}const __EMBEDDED_AUDIO_ASSETS__=${JSON.stringify(
  shortAssetDataUriMap
)};\n${bodyWithoutImports}`.replace(/<\/script/gi, '<\\/script');

// 4. Assemble final standalone single-file HTML
console.log('4/4 Writing standalone/index.html...');
const threePkg = JSON.parse(
  fs.readFileSync(path.join(rootDir, 'node_modules', 'three', 'package.json'), 'utf8')
);
const threeVer = threePkg.version;

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
    <meta name="apple-mobile-web-app-capable" content="yes" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    <meta name="theme-color" content="#040507" />
    <title>McDonald's Nightfall — DEMO</title>
    <meta name="description" content="Playable first-person survival horror game set in an abandoned McDonald's restaurant during late-night shifts." />
    <script type="importmap">
      {
        "imports": {
          "three": "https://cdn.jsdelivr.net/npm/three@${threeVer}/build/three.module.js",
          "three/addons/": "https://cdn.jsdelivr.net/npm/three@${threeVer}/examples/jsm/",
          "three/examples/jsm/": "https://cdn.jsdelivr.net/npm/three@${threeVer}/examples/jsm/"
        }
      }
    </script>
    <style>${compiledCss}</style>
  </head>
  <body>
    <div id="root"></div>
    <script type="module">
${safeInlineJs}
    </script>
  </body>
</html>
`;

const outHtmlPath = path.join(outDir, 'index.html');
fs.writeFileSync(outHtmlPath, html, 'utf8');
const totalMb = (Buffer.byteLength(html, 'utf8') / (1024 * 1024)).toFixed(2);
console.log(`Done! Built standalone single-file HTML: ${outHtmlPath} (${totalMb} MB)`);
