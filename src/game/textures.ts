import * as THREE from 'three';

/**
 * 1998 PS1 / Puppet Combo Digitized Photo-Realistic Texture Engine & Cached TextureLibrary.
 *
 * Pipeline:
 * 1. Paint smooth 256x256 (or 256x128) photographic master artwork using multi-stop linear/radial
 *    gradients, soft shadowBlur, organic bezier shapes, translucent shading overlays, and surface wear.
 * 2. Downsample cleanly to authentic PS1 resolution (128x128 / 128x64 / 64x64).
 * 3. Run a per-pixel photographic film-grain + subtle RGB sensor chroma noise + 4x4 Bayer ordered
 *    15-bit PS1 dither pass (`getImageData` / `putImageData`).
 * 4. Bind with `THREE.NearestFilter`, `generateMipmaps = false`, and `THREE.SRGBColorSpace`.
 */

const BAYER_4X4 = [
  [-0.46875, 0.03125, -0.34375, 0.15625],
  [0.28125, -0.21875, 0.40625, -0.09375],
  [-0.28125, 0.21875, -0.40625, 0.09375],
  [0.46875, -0.03125, 0.34375, -0.15625],
];

function clamp255(v: number): number {
  return v < 0 ? 0 : v > 255 ? 255 : v | 0;
}

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function hash2D(ix: number, iy: number, seed: number): number {
  let h =
    Math.imul(ix | 0, 374761393) ^
    Math.imul(iy | 0, 668265263) ^
    Math.imul((seed * 1024) | 0, 1442695041);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

function smoothNoise2D(x: number, y: number, seed: number): number {
  const ix = Math.floor(x);
  const iy = Math.floor(y);
  const fx = x - ix;
  const fy = y - iy;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash2D(ix, iy, seed);
  const b = hash2D(ix + 1, iy, seed);
  const c = hash2D(ix, iy + 1, seed);
  const d = hash2D(ix + 1, iy + 1, seed);
  return lerp(lerp(a, b, ux), lerp(c, d, ux), uy);
}

function fbm2D(x: number, y: number, seed: number, octaves: number = 3): number {
  let sum = 0;
  let amp = 0.5;
  let freq = 1.0;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += smoothNoise2D(x * freq, y * freq, seed + i * 17.3) * amp;
    norm += amp;
    amp *= 0.5;
    freq *= 2.03;
  }
  return sum / norm;
}

function hexToRgb(color: number | string): [number, number, number] {
  const c = new THREE.Color(
    typeof color === 'string' ? color : `#${color.toString(16).padStart(6, '0')}`
  );
  return [Math.round(c.r * 255), Math.round(c.g * 255), Math.round(c.b * 255)];
}

function toHexColor(color: number | string): string {
  if (typeof color === 'string') return color;
  return `#${color.toString(16).padStart(6, '0')}`;
}

function rgbaStr(r: number, g: number, b: number, a: number = 1): string {
  return `rgba(${clamp255(r)},${clamp255(g)},${clamp255(b)},${a})`;
}

function shadeRgb(rgb: [number, number, number], factor: number, alpha: number = 1): string {
  return rgbaStr(rgb[0] * factor, rgb[1] * factor, rgb[2] * factor, alpha);
}

function shadeHex(hex: string, factor: number, alpha: number = 1): string {
  return shadeRgb(hexToRgb(hex), factor, alpha);
}

/** High-resolution smoothed master canvas (256x256 default) for photographic gradient artwork */
function makePhotoCanvas(
  w: number = 256,
  h: number = 256
): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  return [canvas, ctx];
}

/** Smooth 2D radial soft falloff helper for anatomical skin/makeup/grime shading */
function radialBump(x: number, y: number, cx: number, cy: number, rx: number, ry: number): number {
  const dx = (x - cx) / rx;
  const dy = (y - cy) / ry;
  const d2 = dx * dx + dy * dy;
  if (d2 >= 1) return 0;
  const t = 1 - d2;
  return t * t;
}

interface FilmGrainDitherOptions {
  repeat?: boolean;
  grainStrength?: number;
  chromaNoise?: number;
  ditherStrength?: number;
  quantizeStep?: number;
  seed?: number;
  isColor?: boolean;
  preserveAlpha?: boolean;
  noSmoothing?: boolean;
}

/**
 * Per-pixel photographic film-grain + subtle RGB sensor chroma variation + 15-bit PS1 4x4 Bayer dither.
 * Keeps smooth tonal gradients rich and photographic while giving authentic 1998 PlayStation texture grit.
 */
function applyPhotoFilmGrainAndDither(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  opts: FilmGrainDitherOptions = {}
): void {
  const {
    grainStrength = 10,
    chromaNoise = 5,
    ditherStrength = 5,
    quantizeStep = 4,
    seed = 17.3,
    preserveAlpha = false,
  } = opts;

  const img = ctx.getImageData(0, 0, w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    const row = BAYER_4X4[y & 3];
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const alpha = data[idx + 3];
      if (alpha < 14) continue;

      const bayer = row[x & 3] * ditherStrength;
      const lumGrain = (hash2D(x, y, seed) - 0.5) * grainStrength;
      const rGrain = (hash2D(x, y, seed + 13.7) - 0.5) * chromaNoise;
      const gGrain = (hash2D(x, y, seed + 37.1) - 0.5) * chromaNoise;
      const bGrain = (hash2D(x, y, seed + 71.9) - 0.5) * chromaNoise;

      if (quantizeStep > 1) {
        data[idx] = clamp255(Math.round((data[idx] + lumGrain + rGrain + bayer) / quantizeStep) * quantizeStep);
        data[idx + 1] = clamp255(
          Math.round((data[idx + 1] + lumGrain + gGrain + bayer) / quantizeStep) * quantizeStep
        );
        data[idx + 2] = clamp255(
          Math.round((data[idx + 2] + lumGrain + bGrain + bayer) / quantizeStep) * quantizeStep
        );
      } else {
        data[idx] = clamp255(data[idx] + lumGrain + rGrain + bayer);
        data[idx + 1] = clamp255(data[idx + 1] + lumGrain + gGrain + bayer);
        data[idx + 2] = clamp255(data[idx + 2] + lumGrain + bGrain + bayer);
      }

      if (!preserveAlpha) {
        data[idx + 3] = 255;
      }
    }
  }
  ctx.putImageData(img, 0, 0);
}

/**
 * Downsamples a 256x256 (or 256x128) photographic master canvas down to PS1 target resolution,
 * applies photographic RGB film grain + subtle Bayer dither, and wraps in a NearestFilter CanvasTexture.
 */
function finalizePhotoPS1Texture(
  srcCanvas: HTMLCanvasElement,
  targetW: number = 128,
  targetH: number = 128,
  opts: FilmGrainDitherOptions = {}
): THREE.CanvasTexture {
  const { repeat = false, isColor = true, noSmoothing = false } = opts;

  let outCanvas = srcCanvas;
  if (srcCanvas.width !== targetW || srcCanvas.height !== targetH) {
    const [dst, dstCtx] = makePhotoCanvas(targetW, targetH);
    if (noSmoothing) {
      dstCtx.imageSmoothingEnabled = false;
    }
    dstCtx.drawImage(srcCanvas, 0, 0, targetW, targetH);
    outCanvas = dst;
  }

  const outCtx = outCanvas.getContext('2d');
  if (outCtx) {
    applyPhotoFilmGrainAndDither(outCtx, targetW, targetH, opts);
  }

  const texture = new THREE.CanvasTexture(outCanvas);
  if (isColor) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.wrapS = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  texture.wrapT = repeat ? THREE.RepeatWrapping : THREE.ClampToEdgeWrapping;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Per-pixel procedural photographic field renderer (used for rich organic stone/tile/food/wood/asphalt)
 * rendered at target resolution with continuous organic fbm + radial/linear lighting + film grain + 15-bit PS1 dither.
 */
function renderPhotoPixelField(
  w: number,
  h: number,
  pixelFn: (x: number, y: number, u: number, v: number) => [number, number, number, number?],
  opts: FilmGrainDitherOptions = {}
): THREE.CanvasTexture {
  const [canvas, ctx] = makePhotoCanvas(w, h);
  const img = ctx.createImageData(w, h);
  const data = img.data;
  for (let y = 0; y < h; y++) {
    const v = 1 - y / Math.max(1, h - 1);
    for (let x = 0; x < w; x++) {
      const u = x / w;
      const [r, g, b, a = 255] = pixelFn(x, y, u, v);
      const idx = (y * w + x) * 4;
      data[idx] = clamp255(r);
      data[idx + 1] = clamp255(g);
      data[idx + 2] = clamp255(b);
      data[idx + 3] = clamp255(a);
    }
  }
  ctx.putImageData(img, 0, 0);
  return finalizePhotoPS1Texture(canvas, w, h, {
    grainStrength: 9,
    chromaNoise: 4,
    ditherStrength: 5,
    quantizeStep: 4,
    ...opts,
  });
}

/**
 * Renders an existing virtual-space procedural pixel field natively at 540p (`540x540` or `960x540`)
 * with smooth continuous noise/lighting across all 540p pixels + PS1 NearestFilter film grain.
 */
function renderPhotoPixelField540(
  targetW: number,
  targetH: number,
  designW: number,
  designH: number,
  pixelFn: (sx: number, sy: number, u: number, v: number) => [number, number, number, number?],
  opts: FilmGrainDitherOptions = {}
): THREE.CanvasTexture {
  const scaleX = designW / targetW;
  const scaleY = designH / targetH;
  return renderPhotoPixelField(
    targetW,
    targetH,
    (x, y, u, v) => pixelFn(x * scaleX, y * scaleY, u, v),
    opts
  );
}

/**
 * Paints vector/gradient master artwork scaled crisply onto a native 540p (`540x540` or `960x540`)
 * canvas before applying photographic film grain, 15-bit dither, and NearestFilter.
 */
function paintScaledPhotoCanvas540(
  designW: number,
  designH: number,
  targetW: number,
  targetH: number,
  paintFn: (ctx: CanvasRenderingContext2D) => void,
  opts: FilmGrainDitherOptions = {}
): THREE.CanvasTexture {
  const [canvas, ctx] = makePhotoCanvas(targetW, targetH);
  ctx.save();
  ctx.scale(targetW / designW, targetH / designH);
  paintFn(ctx);
  ctx.restore();
  return finalizePhotoPS1Texture(canvas, targetW, targetH, opts);
}

/**
 * Strictly renders billboard/ad artwork at 360p (360x360 or 640x360) with no DPR upscaling,
 * imageSmoothingEnabled = false, NearestFilter, and generateMipmaps = false.
 */
function paintScaledPhotoCanvas360(
  designW: number,
  designH: number,
  targetW: number,
  targetH: number,
  paintFn: (ctx: CanvasRenderingContext2D) => void,
  opts: FilmGrainDitherOptions = {}
): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = targetW;
  canvas.height = targetH;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  ctx.scale(targetW / designW, targetH / designH);
  paintFn(ctx);
  ctx.restore();
  return finalizePhotoPS1Texture(canvas, targetW, targetH, { ...opts, noSmoothing: true });
}

/** Smooth weathered photo vignette & subtle surface grime overlay on any 256x256 canvas */
function addPhotoSurfaceAtmosphere(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  vignetteAlpha: number = 0.34,
  grimeSeed: number = 11.2,
  scanlineAlpha: number = 0.08
): void {
  // Subtle overhead fluorescent hotspot
  ctx.save();
  const spot = ctx.createRadialGradient(w * 0.5, h * 0.25, w * 0.05, w * 0.5, h * 0.45, Math.max(w, h) * 0.72);
  spot.addColorStop(0, 'rgba(255, 250, 235, 0.14)');
  spot.addColorStop(0.55, 'rgba(255, 255, 255, 0.02)');
  spot.addColorStop(1, `rgba(4, 6, 10, ${vignetteAlpha})`);
  ctx.fillStyle = spot;
  ctx.fillRect(0, 0, w, h);

  // Subtle translucent moisture/dust grime blotches
  for (let i = 0; i < 6; i++) {
    const gx = hash2D(i, 1, grimeSeed) * w;
    const gy = hash2D(i, 2, grimeSeed) * h;
    const gr = (0.16 + hash2D(i, 3, grimeSeed) * 0.22) * Math.min(w, h);
    const gg = ctx.createRadialGradient(gx, gy, 0, gx, gy, gr);
    gg.addColorStop(0, 'rgba(18, 16, 14, 0.12)');
    gg.addColorStop(1, 'rgba(18, 16, 14, 0)');
    ctx.fillStyle = gg;
    ctx.beginPath();
    ctx.arc(gx, gy, gr, 0, Math.PI * 2);
    ctx.fill();
  }

  if (scanlineAlpha > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${scanlineAlpha})`;
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1);
    }
  }
  ctx.restore();
}

/** Curved glowing Golden Arches M (smooth quadratic curves + multi-stop metallic gold gradient, never fillRect) */
function drawPhotographicGoldenArches(
  ctx: CanvasRenderingContext2D,
  cx: number,
  bottomY: number,
  width: number,
  height: number,
  glow: boolean = true
): void {
  ctx.save();
  const grad = ctx.createLinearGradient(cx, bottomY - height, cx, bottomY);
  grad.addColorStop(0, '#fff4a3');
  grad.addColorStop(0.32, '#ffd028');
  grad.addColorStop(0.78, '#eab308');
  grad.addColorStop(1, '#b45309');

  if (glow) {
    ctx.shadowColor = 'rgba(255, 204, 36, 0.72)';
    ctx.shadowBlur = Math.max(4, width * 0.16);
  }
  ctx.strokeStyle = grad;
  ctx.lineWidth = Math.max(2.5, width * 0.15);
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  const halfW = width * 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - halfW, bottomY);
  ctx.quadraticCurveTo(cx - halfW * 0.55, bottomY - height * 1.38, cx, bottomY - height * 0.22);
  ctx.quadraticCurveTo(cx + halfW * 0.55, bottomY - height * 1.38, cx + halfW, bottomY);
  ctx.stroke();

  // Inner subtle highlight sheen along arch crest
  ctx.shadowBlur = 0;
  ctx.strokeStyle = 'rgba(255, 252, 224, 0.55)';
  ctx.lineWidth = Math.max(1, width * 0.045);
  ctx.beginPath();
  ctx.moveTo(cx - halfW * 0.92, bottomY - height * 0.18);
  ctx.quadraticCurveTo(cx - halfW * 0.52, bottomY - height * 1.24, cx, bottomY - height * 0.28);
  ctx.quadraticCurveTo(cx + halfW * 0.52, bottomY - height * 1.24, cx + halfW * 0.92, bottomY - height * 0.18);
  ctx.stroke();
  ctx.restore();
}

export type PS1HumanFaceVariant =
  | 'tired'
  | 'hollow'
  | 'john'
  | 'clerk'
  | 'baocon'
  | 'bigray'
  | 'cust_bags'
  | 'cust_stubble'
  | 'cust_hollow';

export type PS1BillboardAdVariant =
  | 'bigmac'
  | 'fries'
  | 'grimace'
  | 'coffee'
  | 'mart_noodles'
  | 'mart_snacks';

export interface WrappedHumanHeadOptions {
  skinColor: number | string;
  variant?: PS1HumanFaceVariant;
  hairColor?: number | string | null;
  hairStyle?: 'short' | 'spiky' | 'hooded' | 'cap' | 'none';
}

export type WrappedFabricStyle =
  | 'polo'
  | 'hoodie'
  | 'jacket'
  | 'apron'
  | 'pants'
  | 'denim'
  | 'shoes'
  | 'skin_hand'
  | 'backpack'
  | 'hat'
  | 'clown_suit'
  | 'clown_sleeves'
  | 'clown_collar'
  | 'clown_glove'
  | 'purple_fur';

// ============================================================================
// CACHED TEXTURE LIBRARY (256x256 PHOTOGRAPHIC MASTER -> PS1 FILM GRAIN)
// ============================================================================

class PS1TextureLibrary {
  private cache = new Map<string, THREE.CanvasTexture>();

  private cached(key: string, builder: () => THREE.CanvasTexture): THREE.CanvasTexture {
    const existing = this.cache.get(key);
    if (existing) return existing;
    const tex = builder();
    this.cache.set(key, tex);
    return tex;
  }

  /**
   * 256x256 -> 128x128 Digitized Photo-Realistic Killer Clown Face Paint (360° Seamless UV Wrap).
   * Cracked aged white greasepaint, bruised sunken orbital sockets, glossy crimson nose base,
   * jagged blood-smeared grin with curved stained teeth, and film-grain PS1 quantization.
   */
  getClownFaceTexture(): THREE.CanvasTexture {
    return this.cached('clown_face_digitized_v3', () => {
      const W = 256;
      const H = 256;
      const [canvas, ctx] = makePhotoCanvas(W, H);
      const img = ctx.createImageData(W, H);
      const d = img.data;

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const sx = Math.abs(px - 128);
          const wrapAngle = ((px - 128) / 128) * Math.PI;
          const frontness = Math.cos(wrapAngle);

          const grain = fbm2D(px * 0.13, py * 0.13, 11.4, 3);
          const crease = smoothNoise2D(px * 0.24, py * 0.24, 37.9);
          const verticalGrad = 1.0 - Math.max(0, (py - 168) / 88) * 0.28;

          let r = 238 - grain * 22 + frontness * 10;
          let g = 232 - grain * 24 + frontness * 9;
          let b = 220 - grain * 22 + frontness * 5;

          // Creased greasepaint skin folds around eyes & mouth
          const foldLine = Math.abs(crease - 0.5);
          if (foldLine < 0.045 && frontness > 0.05) {
            const fAmt = (1 - foldLine / 0.045) * 0.16;
            r *= 1 - fAmt;
            g *= 1 - fAmt;
            b *= 1 - fAmt * 0.9;
          }

          const cheekSpec = radialBump(sx, py, 32, 124, 22, 24);
          const cheekHollow = radialBump(sx, py, 40, 160, 18, 26);
          const templeShade = radialBump(sx, py, 52, 96, 18, 40);
          const browShade = radialBump(sx, py, 24, 82, 22, 12);

          const shade =
            verticalGrad + cheekSpec * 0.09 - cheekHollow * 0.19 - templeShade * 0.14 - browShade * 0.16;
          r *= shade;
          g *= shade;
          b *= shade;

          // Red nose greasepaint halo behind protruding 3D nose cone
          const noseHalo = radialBump(px, py, 128, 130, 17, 15);
          if (noseHalo > 0.03) {
            const blend = clamp01(noseHalo * 1.45);
            r = lerp(r, 178, blend);
            g = lerp(g, 18, blend);
            b = lerp(b, 20, blend);
          }

          const idx = (py * W + px) * 4;
          d[idx] = clamp255(r);
          d[idx + 1] = clamp255(g);
          d[idx + 2] = clamp255(b);
          d[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      // Deep bruised sunken eye sockets (radial gradients + shadowBlur)
      for (const ex of [105, 151]) {
        const socket = ctx.createRadialGradient(ex, 93, 3, ex, 95, 22);
        socket.addColorStop(0, 'rgba(6, 5, 10, 0.98)');
        socket.addColorStop(0.45, 'rgba(18, 12, 24, 0.92)');
        socket.addColorStop(0.75, 'rgba(52, 28, 46, 0.55)');
        socket.addColorStop(1, 'rgba(90, 65, 75, 0)');
        ctx.fillStyle = socket;
        ctx.beginPath();
        ctx.ellipse(ex, 94, 21, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Piercing dead pale eye staring out from the shadow
        const iris = ctx.createRadialGradient(ex, 93, 0.5, ex, 93, 6.5);
        iris.addColorStop(0, '#070709');
        iris.addColorStop(0.38, '#525b6e');
        iris.addColorStop(0.75, '#cfd8e3');
        iris.addColorStop(1, 'rgba(24, 22, 30, 0.2)');
        ctx.fillStyle = iris;
        ctx.beginPath();
        ctx.ellipse(ex, 93, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();

        // Wet specular pinpoint glint
        ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        ctx.beginPath();
        ctx.arc(ex + 2, 91, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Sinister arched smeared greasepaint eyebrows
      ctx.save();
      ctx.shadowColor = 'rgba(10, 8, 14, 0.75)';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = '#0e0c12';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(86, 74);
      ctx.quadraticCurveTo(104, 54, 120, 72);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(136, 72);
      ctx.quadraticCurveTo(152, 54, 170, 74);
      ctx.stroke();
      ctx.restore();

      // Wide smeared crimson grin & dark mouth cavity
      ctx.save();
      ctx.shadowColor = 'rgba(120, 10, 14, 0.7)';
      ctx.shadowBlur = 6;
      const lipGrad = ctx.createRadialGradient(128, 168, 8, 128, 168, 52);
      lipGrad.addColorStop(0, '#991115');
      lipGrad.addColorStop(0.65, '#7a0c10');
      lipGrad.addColorStop(1, 'rgba(110, 14, 18, 0.35)');
      ctx.fillStyle = lipGrad;
      ctx.beginPath();
      ctx.moveTo(80, 152);
      ctx.quadraticCurveTo(128, 186, 176, 152);
      ctx.quadraticCurveTo(164, 198, 128, 200);
      ctx.quadraticCurveTo(92, 198, 80, 152);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Deep dark mouth opening
      ctx.fillStyle = '#120305';
      ctx.beginPath();
      ctx.moveTo(88, 158);
      ctx.quadraticCurveTo(128, 182, 168, 158);
      ctx.quadraticCurveTo(156, 190, 128, 191);
      ctx.quadraticCurveTo(100, 190, 88, 158);
      ctx.closePath();
      ctx.fill();

      // Organic grimy curved teeth along upper & lower jaw
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(88, 158);
      ctx.quadraticCurveTo(128, 182, 168, 158);
      ctx.quadraticCurveTo(156, 190, 128, 191);
      ctx.quadraticCurveTo(100, 190, 88, 158);
      ctx.clip();
      for (let i = -4; i <= 4; i++) {
        const tx = 128 + i * 9;
        const ty = 166 + (16 - i * i) * 0.45;
        const tGrad = ctx.createLinearGradient(tx, ty - 7, tx, ty + 7);
        tGrad.addColorStop(0, '#cfc3a3');
        tGrad.addColorStop(0.5, '#ede4cb');
        tGrad.addColorStop(1, '#8c7e5d');
        ctx.fillStyle = tGrad;
        ctx.beginPath();
        ctx.ellipse(tx, ty, 3.6, 5.5, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // Organic blood drips & smears from mouth corners
      for (const [dx, dy, len] of [
        [84, 158, 20],
        [172, 158, 22],
        [114, 194, 18],
        [144, 192, 15],
      ]) {
        const drip = ctx.createLinearGradient(dx, dy, dx, dy + len);
        drip.addColorStop(0, 'rgba(130, 10, 14, 0.9)');
        drip.addColorStop(0.75, 'rgba(95, 8, 11, 0.78)');
        drip.addColorStop(1, 'rgba(70, 5, 8, 0)');
        ctx.strokeStyle = drip;
        ctx.lineWidth = 3.2;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(dx, dy);
        ctx.quadraticCurveTo(dx + 1.5, dy + len * 0.5, dx, dy + len);
        ctx.stroke();
      }

      return finalizePhotoPS1Texture(canvas, 128, 128, {
        grainStrength: 10,
        chromaNoise: 5,
        ditherStrength: 6,
        quantizeStep: 4,
        seed: 21.7,
      });
    });
  }

  /**
   * 256x256 -> 128x128 Digitized Photo-Realistic Welcome Clown Statue Face.
   * Glossy fiberglass painted sheen, soft rosy airbrushed blush, friendly arched brows & smile.
   */
  getWelcomeClownFaceTexture(): THREE.CanvasTexture {
    return this.cached('welcome_clown_face_digitized_v3', () => {
      const W = 256;
      const H = 256;
      const [canvas, ctx] = makePhotoCanvas(W, H);

      // Glossy fiberglass base gradient
      const baseGrad = ctx.createRadialGradient(128, 96, 16, 128, 128, 155);
      baseGrad.addColorStop(0, '#fcfaf4');
      baseGrad.addColorStop(0.55, '#ede5d5');
      baseGrad.addColorStop(1, '#c8beae');
      ctx.fillStyle = baseGrad;
      ctx.fillRect(0, 0, W, H);

      // Soft airbrushed rosy mascot cheeks
      for (const cx of [86, 170]) {
        const blush = ctx.createRadialGradient(cx, 128, 2, cx, 128, 28);
        blush.addColorStop(0, 'rgba(244, 114, 126, 0.62)');
        blush.addColorStop(0.6, 'rgba(244, 130, 140, 0.25)');
        blush.addColorStop(1, 'rgba(244, 130, 140, 0)');
        ctx.fillStyle = blush;
        ctx.beginPath();
        ctx.arc(cx, 128, 28, 0, Math.PI * 2);
        ctx.fill();
      }

      // Red painted nose base halo
      const nose = ctx.createRadialGradient(128, 128, 2, 128, 128, 18);
      nose.addColorStop(0, 'rgba(220, 28, 40, 0.96)');
      nose.addColorStop(0.7, 'rgba(200, 28, 38, 0.55)');
      nose.addColorStop(1, 'rgba(200, 28, 38, 0)');
      ctx.fillStyle = nose;
      ctx.beginPath();
      ctx.arc(128, 128, 18, 0, Math.PI * 2);
      ctx.fill();

      // Friendly arched brows
      ctx.strokeStyle = '#2b1b16';
      ctx.lineWidth = 4.5;
      ctx.lineCap = 'round';
      for (const ex of [106, 150]) {
        ctx.beginPath();
        ctx.arc(ex, 78, 16, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
      }

      // Photographic almond mascot eyes (radial sclera, sky-blue iris, gloss catchlight)
      for (const ex of [106, 150]) {
        ctx.save();
        ctx.beginPath();
        ctx.ellipse(ex, 92, 13, 8.5, 0, 0, Math.PI * 2);
        const sclera = ctx.createRadialGradient(ex, 91, 2, ex, 92, 13);
        sclera.addColorStop(0, '#ffffff');
        sclera.addColorStop(0.75, '#eef2f6');
        sclera.addColorStop(1, '#bfc8d4');
        ctx.fillStyle = sclera;
        ctx.fill();
        ctx.clip();

        const iris = ctx.createRadialGradient(ex, 92, 1, ex, 92, 7);
        iris.addColorStop(0, '#1d4ed8');
        iris.addColorStop(0.7, '#3b82f6');
        iris.addColorStop(1, '#1e3a8a');
        ctx.fillStyle = iris;
        ctx.beginPath();
        ctx.arc(ex, 92, 6.8, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#090a10';
        ctx.beginPath();
        ctx.arc(ex, 92, 3.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex + 2.2, 89.5, 1.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Crisp friendly lash outline
        ctx.strokeStyle = '#1e1412';
        ctx.lineWidth = 2.4;
        ctx.beginPath();
        ctx.ellipse(ex, 92, 13, 8.5, 0, Math.PI, Math.PI * 2);
        ctx.stroke();
      }

      // Cheerful glossy painted mascot smile + curved teeth
      const smileGrad = ctx.createLinearGradient(128, 158, 128, 190);
      smileGrad.addColorStop(0, '#ef233c');
      smileGrad.addColorStop(1, '#9b111e');
      ctx.fillStyle = smileGrad;
      ctx.beginPath();
      ctx.ellipse(128, 166, 38, 18, 0, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fbfaf6';
      ctx.beginPath();
      ctx.ellipse(128, 167, 29, 8.5, 0, 0, Math.PI);
      ctx.closePath();
      ctx.fill();

      return finalizePhotoPS1Texture(canvas, 128, 128, {
        grainStrength: 7,
        chromaNoise: 3,
        ditherStrength: 4,
        quantizeStep: 4,
        seed: 41.2,
      });
    });
  }

  /**
   * 256x256 -> 128x128 Seamless Digitized Photo-Realistic Human Head Texture (Face + Wrapped Hair).
   * - Rendered with real-world soft 3D facial lighting gradients, orbital depth, cheekbone & nose-bridge glow,
   *   subsurface cheek warmth, realistic almond eyes with shaded sclera/iris/pupil/catchlight,
   *   curved shaded lips (NO flat fillRect boxes!), and fine skin film grain.
   * - Tyler & Báo Con have 100% smooth clean-shaven young skin (ZERO beard/stubble!).
   * - Báo Con & Big Ray feature a warm, cheerful smiling expression.
   */
  getWrappedHumanHeadTexture(opts: WrappedHumanHeadOptions): THREE.CanvasTexture {
    const skinHex = toHexColor(opts.skinColor);
    const variant = opts.variant ?? 'tired';
    const hairStyle = opts.hairStyle ?? 'none';
    const hairHex =
      opts.hairColor !== null && opts.hairColor !== undefined ? toHexColor(opts.hairColor) : '';
    const cacheKey = `human_head_photo_v4_${skinHex}_${variant}_${hairStyle}_${hairHex}`;

    return this.cached(cacheKey, () => {
      const W = 256;
      const H = 256;
      const [skinR, skinG, skinB] = hexToRgb(skinHex);
      const hasHair = Boolean(hairHex && hairStyle !== 'none');
      const [hairR, hairG, hairB] = hasHair ? hexToRgb(hairHex) : [36, 26, 18];

      const [canvas, ctx] = makePhotoCanvas(W, H);
      const img = ctx.createImageData(W, H);
      const d = img.data;

      const isSmiling = variant === 'baocon' || variant === 'bigray' || variant === 'john';
      const isCheerful = variant === 'baocon' || variant === 'bigray';
      const isWeary = variant === 'clerk' || variant === 'cust_bags' || variant === 'john';

      for (let py = 0; py < H; py++) {
        for (let px = 0; px < W; px++) {
          const sx = Math.abs(px - 128);
          const wrapAngle = ((px - 128) / 128) * Math.PI;
          const frontness = Math.cos(wrapAngle);

          // Fine organic photographic skin texture (pores + subsurface luminance)
          const skinGrain = fbm2D(px * 0.14, py * 0.14, 7.2, 3);
          const poreMicro = (hash2D(px, py, 91.1) - 0.5) * 0.045;

          // Anatomical 3D facial lighting gradients
          const foreheadSpec = radialBump(sx, py, 0, 52, 42, 22) * 0.10;
          const cheekSpec = radialBump(sx, py, 28, 114, 20, 20) * 0.09;
          const noseBridgeSpec = radialBump(px, py, 128, 112, 9, 24) * 0.13;
          const chinHighlight = radialBump(px, py, 128, 198, 18, 14) * 0.06;
          const cheekHollow = radialBump(sx, py, 42, 148, 16, 22) * 0.08;
          const templeShadow = radialBump(sx, py, 54, 92, 16, 36) * 0.10;
          const underNoseShade = radialBump(px, py, 128, 136, 12, 7) * 0.12;
          // Smooth clean-shaven chin & jaw (NO dark stubble or dirty beard mask!)
          const underChinShade = Math.max(0, (py - 208) / 48) * 0.11;
          const sideWrapShade = (1 - Math.max(-0.4, frontness)) * 0.09;
          const cleanChinMask = py > 144 && sx < 54 ? 0.30 : 1.0;

          const light =
            1.0 +
            foreheadSpec +
            cheekSpec +
            noseBridgeSpec +
            chinHighlight -
            cheekHollow -
            templeShadow -
            underNoseShade -
            underChinShade -
            sideWrapShade +
            (skinGrain - 0.5) * 0.07 * cleanChinMask +
            poreMicro * cleanChinMask;

          let r = skinR * light;
          let g = skinG * light;
          let b = skinB * light;

          // Subsurface cheek warmth (keeps skin photographic, alive, and healthy)
          const rosyCheek = radialBump(sx, py, 30, 118, 22, 16) * (isCheerful ? 0.32 : 0.14);
          if (rosyCheek > 0.01) {
            r = lerp(r, Math.min(255, skinR * 1.08 + 28), rosyCheek);
            g = lerp(g, skinG * 0.85, rosyCheek);
            b = lerp(b, skinB * 0.84, rosyCheek);
          }

          // Subtle nose tip & ear warmth
          const noseTipWarmth = radialBump(px, py, 128, 126, 12, 10) * 0.16;
          if (noseTipWarmth > 0.01) {
            r = lerp(r, Math.min(255, skinR * 1.05 + 18), noseTipWarmth);
            g = lerp(g, skinG * 0.9, noseTipWarmth);
            b = lerp(b, skinB * 0.88, noseTipWarmth);
          }

          // Gentle natural orbital socket & tired under-eye tint (never black voids)
          const eyeSocketShade = radialBump(sx, py, 22, 84, 17, 11) * (isWeary ? 0.11 : 0.05);
          if (eyeSocketShade > 0.005) {
            r *= 1 - eyeSocketShade;
            g *= 1 - eyeSocketShade * 1.15;
            b *= 1 - eyeSocketShade * 0.95;
          }
          const underEye = radialBump(sx, py, 24, 98, 13, 5.5);
          if (underEye > 0.04 && isWeary) {
            const tiredAmt = variant === 'clerk' || variant === 'cust_bags' ? 0.15 : 0.09;
            r = lerp(r, skinR * 0.72, underEye * tiredAmt);
            g = lerp(g, skinG * 0.64, underEye * tiredAmt);
            b = lerp(b, skinB * 0.78, underEye * tiredAmt);
          }

          // Seamless photo-shaded wrapped hair across crown, back, temples & sideburns
          if (hasHair) {
            const strandNoise = fbm2D(px * 0.32, py * 0.07, 53.7, 3);
            let hairBoundaryY = 46 + (strandNoise - 0.5) * 9;
            if (sx > 42 && sx <= 62) {
              const t = (sx - 42) / 20;
              hairBoundaryY = lerp(46, 148, t * t) + (strandNoise - 0.5) * 8;
            } else if (sx > 62) {
              const tBack = (sx - 62) / 66;
              hairBoundaryY = lerp(148, 204, Math.min(1, tBack * 1.4)) + (strandNoise - 0.5) * 8;
            }
            if (hairStyle === 'cap' && sx <= 40) {
              hairBoundaryY = Math.min(hairBoundaryY, 36);
            }

            if (py < hairBoundaryY) {
              const edgeSoft = clamp01((hairBoundaryY - py) / 6.5);
              const strandHighlight = fbm2D(px * 0.45, py * 0.06, 19.3, 3);
              const crownSheen = radialBump(px, py, 128, 26, 80, 18) * 0.18;
              const rootShadow = (py < 22 ? 0.84 : 0.72 + strandHighlight * 0.52) + crownSheen;
              r = lerp(r, hairR * rootShadow, edgeSoft);
              g = lerp(g, hairG * rootShadow, edgeSoft);
              b = lerp(b, hairB * rootShadow, edgeSoft);
            } else if (py < hairBoundaryY + 6) {
              const shadowEdge = 1 - (py - hairBoundaryY) / 6;
              r *= 1 - shadowEdge * 0.11;
              g *= 1 - shadowEdge * 0.11;
              b *= 1 - shadowEdge * 0.11;
            }
          }

          const idx = (py * W + px) * 4;
          d[idx] = clamp255(r);
          d[idx + 1] = clamp255(g);
          d[idx + 2] = clamp255(b);
          d[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      // 1. Feathered Photographic Eyebrows (curved Bezier strokes with soft hair shadow)
      const browCol = hasHair ? shadeHex(hairHex, 0.72, 0.9) : 'rgba(42, 29, 21, 0.9)';
      ctx.save();
      ctx.strokeStyle = browCol;
      ctx.shadowColor = shadeHex(skinHex, 0.55, 0.45);
      ctx.shadowBlur = 2.5;
      ctx.lineCap = 'round';
      ctx.lineWidth = 4.2;

      for (const side of [-1, 1]) {
        const innerX = 128 + side * 12;
        const outerX = 128 + side * 34;
        const midX = (innerX + outerX) * 0.5;
        const innerY = variant === 'cust_stubble' ? 66 : variant === 'clerk' ? 67 : 63;
        const midY = variant === 'baocon' || variant === 'bigray' ? 58 : variant === 'clerk' ? 66 : 61;
        const outerY = variant === 'clerk' ? 68 : 65;

        ctx.beginPath();
        ctx.moveTo(innerX, innerY);
        ctx.quadraticCurveTo(midX, midY, outerX, outerY);
        ctx.stroke();
      }
      ctx.restore();

      // 2. Realistic Almond Eyes (Radial shaded sclera + iris limbal ring + pupil + wet catchlight)
      const irisColor =
        variant === 'bigray'
          ? '#2563eb'
          : variant === 'hollow' || variant === 'cust_hollow'
          ? '#475569'
          : variant === 'clerk'
          ? '#3b4a5c'
          : '#543522';
      const irisEdge = shadeHex(irisColor, 0.55);

      for (const ex of [106, 150]) {
        const ey = 85;
        ctx.save();

        // Almond eye clip shape
        ctx.beginPath();
        ctx.moveTo(ex - 12, ey + 1);
        ctx.quadraticCurveTo(ex, ey - 8.5, ex + 12, ey + 1);
        ctx.quadraticCurveTo(ex, ey + 7.5, ex - 12, ey + 1);
        ctx.closePath();

        // Shaded 3D sclera (bright center, realistic subtle corner shadow — NOT a flat white rectangle)
        const scleraGrad = ctx.createRadialGradient(ex, ey - 1, 2, ex, ey, 13);
        scleraGrad.addColorStop(0, '#ffffff');
        scleraGrad.addColorStop(0.65, '#f2f5f8');
        scleraGrad.addColorStop(1, '#c6cdd6');
        ctx.fillStyle = scleraGrad;
        ctx.fill();
        ctx.clip();

        // Upper eyelid ambient shadow across top of eyeball
        const lidShade = ctx.createLinearGradient(ex, ey - 8, ex, ey + 2);
        lidShade.addColorStop(0, 'rgba(30, 22, 20, 0.36)');
        lidShade.addColorStop(1, 'rgba(30, 22, 20, 0)');
        ctx.fillStyle = lidShade;
        ctx.fillRect(ex - 13, ey - 9, 26, 12);

        // Detailed Iris with dark limbal border
        const irisGrad = ctx.createRadialGradient(ex, ey, 1, ex, ey, 5.8);
        irisGrad.addColorStop(0, irisColor);
        irisGrad.addColorStop(0.7, irisColor);
        irisGrad.addColorStop(1, irisEdge);
        ctx.fillStyle = irisGrad;
        ctx.beginPath();
        ctx.arc(ex, ey, 5.8, 0, Math.PI * 2);
        ctx.fill();

        // Pupil
        ctx.fillStyle = '#09090d';
        ctx.beginPath();
        ctx.arc(ex, ey, 2.7, 0, Math.PI * 2);
        ctx.fill();

        // Crisp glossy catchlight + tiny lower reflection
        ctx.fillStyle = 'rgba(255, 255, 255, 0.94)';
        ctx.beginPath();
        ctx.arc(ex + 2.0, ey - 2.0, 1.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Soft upper lash curve & gentle lower eyelid crease
        ctx.save();
        ctx.strokeStyle = 'rgba(34, 22, 18, 0.88)';
        ctx.lineWidth = 2.0;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ex - 12, ey + 1);
        ctx.quadraticCurveTo(ex, ey - 8.5, ex + 12, ey + 1);
        ctx.stroke();

        ctx.strokeStyle = shadeHex(skinHex, 0.78, 0.55);
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(ex - 10, ey + 3);
        ctx.quadraticCurveTo(ex, ey + 8.5, ex + 10, ey + 3);
        ctx.stroke();
        ctx.restore();
      }

      // 3. Soft Nostril Shadows under 3D nose cone
      for (const nx of [122, 134]) {
        const nGrad = ctx.createRadialGradient(nx, 133, 0.5, nx, 133, 4.2);
        nGrad.addColorStop(0, shadeHex(skinHex, 0.52, 0.78));
        nGrad.addColorStop(1, shadeHex(skinHex, 0.8, 0));
        ctx.fillStyle = nGrad;
        ctx.beginPath();
        ctx.ellipse(nx, 133, 4.2, 2.6, 0, 0, Math.PI * 2);
        ctx.fill();
      }

      // 4. Photographic Curved Mouth & Lips (Ring 3: py = 152..168, 100% clean-shaven)
      ctx.save();
      // Subtle philtrum & under-lip cleft shadow
      const cleft = ctx.createRadialGradient(128, 168, 1, 128, 168, 12);
      cleft.addColorStop(0, shadeHex(skinHex, 0.76, 0.55));
      cleft.addColorStop(1, shadeHex(skinHex, 0.9, 0));
      ctx.fillStyle = cleft;
      ctx.beginPath();
      ctx.ellipse(128, 168, 12, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      if (variant === 'baocon' || variant === 'bigray') {
        // Báo Con & Big Ray: Warm, cheerful, genuine smile with curved lips & natural ivory teeth!
        const mouthY = 156;
        // Soft smile dimples/cheeks
        for (const dx of [102, 154]) {
          const dimple = ctx.createRadialGradient(dx, mouthY - 1, 0.5, dx, mouthY - 1, 6);
          dimple.addColorStop(0, shadeHex(skinHex, 0.75, 0.45));
          dimple.addColorStop(1, shadeHex(skinHex, 0.9, 0));
          ctx.fillStyle = dimple;
          ctx.beginPath();
          ctx.arc(dx, mouthY - 1, 6, 0, Math.PI * 2);
          ctx.fill();
        }

        // Open smiling mouth cavity with curved teeth
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(106, mouthY - 2);
        ctx.quadraticCurveTo(128, mouthY + 2, 150, mouthY - 2);
        ctx.quadraticCurveTo(146, mouthY + 13, 128, mouthY + 13);
        ctx.quadraticCurveTo(110, mouthY + 13, 106, mouthY - 2);
        ctx.closePath();

        const cavityGrad = ctx.createLinearGradient(128, mouthY - 2, 128, mouthY + 13);
        cavityGrad.addColorStop(0, '#5a1e1c');
        cavityGrad.addColorStop(1, '#3b1110');
        ctx.fillStyle = cavityGrad;
        ctx.fill();
        ctx.clip();

        // Warm shaded ivory teeth row (rounded gradient, not stark white block)
        const teethGrad = ctx.createLinearGradient(108, mouthY, 148, mouthY);
        teethGrad.addColorStop(0, '#d8d2c6');
        teethGrad.addColorStop(0.5, '#faf7f0');
        teethGrad.addColorStop(1, '#d8d2c6');
        ctx.fillStyle = teethGrad;
        ctx.beginPath();
        ctx.ellipse(128, mouthY + 2.5, 19, 5.2, 0, 0, Math.PI);
        ctx.fill();
        ctx.restore();

        // Smooth natural shaded upper & lower lips framing the smile
        ctx.strokeStyle = '#9c453e';
        ctx.lineWidth = 2.6;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(105, mouthY - 2);
        ctx.quadraticCurveTo(128, mouthY + 2.5, 151, mouthY - 2);
        ctx.stroke();

        ctx.strokeStyle = '#b55b52';
        ctx.lineWidth = 3.0;
        ctx.beginPath();
        ctx.moveTo(110, mouthY + 10);
        ctx.quadraticCurveTo(128, mouthY + 15.5, 146, mouthY + 10);
        ctx.stroke();
      } else if (isSmiling) {
        // John: Warm friendly subtle coworker smile
        const mouthY = 157;
        const lipGrad = ctx.createLinearGradient(128, mouthY - 4, 128, mouthY + 7);
        lipGrad.addColorStop(0, '#9a544c');
        lipGrad.addColorStop(0.5, '#682b27');
        lipGrad.addColorStop(1, '#b86e63');
        ctx.fillStyle = lipGrad;
        ctx.beginPath();
        ctx.moveTo(106, mouthY - 2);
        ctx.quadraticCurveTo(128, mouthY + 2, 150, mouthY - 2);
        ctx.quadraticCurveTo(142, mouthY + 7, 128, mouthY + 7);
        ctx.quadraticCurveTo(114, mouthY + 7, 106, mouthY - 2);
        ctx.fill();

        // Hint of natural teeth
        ctx.fillStyle = 'rgba(245, 240, 232, 0.85)';
        ctx.beginPath();
        ctx.ellipse(128, mouthY + 1, 12, 2.2, 0, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Natural resting human lips (clerk, Tyler, customers — 100% clean-shaven!)
        const mouthY = 158;
        const droop = variant === 'clerk' || variant === 'cust_stubble' ? 2.5 : 0.8;
        // Upper lip
        ctx.fillStyle = shadeRgb([Math.round(skinR * 0.78 + 38), Math.round(skinG * 0.56 + 18), Math.round(skinB * 0.56 + 18)], 1, 0.9);
        ctx.beginPath();
        ctx.moveTo(108, mouthY + droop);
        ctx.quadraticCurveTo(121, mouthY - 4, 128, mouthY - 2.5);
        ctx.quadraticCurveTo(135, mouthY - 4, 148, mouthY + droop);
        ctx.quadraticCurveTo(128, mouthY + 1, 108, mouthY + droop);
        ctx.fill();

        // Lip crease
        ctx.strokeStyle = shadeHex(skinHex, 0.45, 0.85);
        ctx.lineWidth = 1.8;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(107, mouthY + droop);
        ctx.quadraticCurveTo(128, mouthY + 1.2, 149, mouthY + droop);
        ctx.stroke();

        // Soft lower lip highlight
        ctx.fillStyle = shadeRgb([Math.round(skinR * 0.82 + 42), Math.round(skinG * 0.6 + 20), Math.round(skinB * 0.6 + 20)], 1, 0.82);
        ctx.beginPath();
        ctx.ellipse(128, mouthY + 3.5, 14, 2.8, 0, 0, Math.PI);
        ctx.fill();
      }
      ctx.restore();

      return finalizePhotoPS1Texture(canvas, 128, 128, {
        grainStrength: 8,
        chromaNoise: 4,
        ditherStrength: 4,
        quantizeStep: 4,
        seed: 7.2,
      });
    });
  }

  /**
   * 256x256 -> 128x128 Seamless Digitized Photo-Realistic Wrapped Clothing & Skin Textures.
   * Renders rich organic drapery folds, under-arm/collar ambient occlusion, woven cloth texture,
   * and photographic film grain (NO flat solid blocks).
   */
  getWrappedFabricTexture(
    color: number | string,
    style: WrappedFabricStyle,
    seed: number = 1
  ): THREE.CanvasTexture {
    const hex = toHexColor(color);
    const key = `fabric_photo_540_${hex}_${style}_${seed}`;

    return this.cached(key, () => {
      const TARGET = 540;
      const DESIGN = 256;
      const scale = DESIGN / TARGET;

      if (style === 'clown_suit') {
        const [canvas, ctx] = makePhotoCanvas(TARGET, TARGET);
        const img = ctx.createImageData(TARGET, TARGET);
        const d = img.data;
        for (let y = 0; y < TARGET; y++) {
          const sy = y * scale;
          const ao = 0.85 + Math.sin((sy / 256) * Math.PI) * 0.18;
          for (let x = 0; x < TARGET; x++) {
            const sx = x * scale;
            const weave = ((x + y) % 2 === 0 ? 1 : -1) * 3;
            const fold = Math.sin(sx * 0.095 + fbm2D(sx * 0.05, sy * 0.04, 9.2, 3) * 3.4) * 0.14;
            const grime = fbm2D(sx * 0.09, sy * 0.09, 22.7, 3);
            const light = (0.94 + fold - grime * 0.22) * ao;
            const idx = (y * TARGET + x) * 4;
            d[idx] = clamp255(186 * light + weave);
            d[idx + 1] = clamp255(148 * light + weave);
            d[idx + 2] = clamp255(36 * light + weave);
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(img, 0, 0);

        ctx.save();
        ctx.scale(TARGET / DESIGN, TARGET / DESIGN);
        for (const [bx, by, br] of [
          [72, 96, 38],
          [168, 152, 42],
          [112, 196, 32],
          [208, 68, 28],
        ]) {
          const g = ctx.createRadialGradient(bx, by, 3, bx, by, br);
          g.addColorStop(0, 'rgba(92, 8, 11, 0.88)');
          g.addColorStop(0.55, 'rgba(116, 12, 15, 0.56)');
          g.addColorStop(1, 'rgba(120, 14, 16, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.ellipse(bx, by, br, br * 1.25, 0.3, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return finalizePhotoPS1Texture(canvas, TARGET, TARGET, {
          repeat: true,
          grainStrength: 10,
          chromaNoise: 5,
          ditherStrength: 5,
          quantizeStep: 4,
          seed: 22.7,
        });
      }

      if (style === 'clown_sleeves') {
        const [canvas, ctx] = makePhotoCanvas(TARGET, TARGET);
        const img = ctx.createImageData(TARGET, TARGET);
        const d = img.data;
        for (let y = 0; y < TARGET; y++) {
          const sy = y * scale;
          const band = Math.floor(sy / 32) % 2 === 0;
          const [br, bg, bb] = band ? [118, 18, 19] : [224, 218, 204];
          const seam = Math.abs((sy % 32) - 16) > 14 ? 0.85 : 1.0;
          for (let x = 0; x < TARGET; x++) {
            const sx = x * scale;
            const cloth = fbm2D(sx * 0.1, sy * 0.1, 13.5, 3);
            const fold = 0.92 + Math.sin(sx * 0.11 + cloth * 2.8) * 0.13;
            const l = fold * seam - cloth * 0.1;
            const idx = (y * TARGET + x) * 4;
            d[idx] = clamp255(br * l);
            d[idx + 1] = clamp255(bg * l);
            d[idx + 2] = clamp255(bb * l);
            d[idx + 3] = 255;
          }
        }
        ctx.putImageData(img, 0, 0);
        ctx.save();
        ctx.scale(TARGET / DESIGN, TARGET / DESIGN);
        for (const [bx, by, br] of [
          [88, 136, 32],
          [176, 72, 26],
        ]) {
          const g = ctx.createRadialGradient(bx, by, 2, bx, by, br);
          g.addColorStop(0, 'rgba(84, 7, 9, 0.82)');
          g.addColorStop(1, 'rgba(84, 7, 9, 0)');
          ctx.fillStyle = g;
          ctx.beginPath();
          ctx.arc(bx, by, br, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
        return finalizePhotoPS1Texture(canvas, TARGET, TARGET, {
          repeat: true,
          grainStrength: 10,
          chromaNoise: 5,
          ditherStrength: 5,
          quantizeStep: 4,
          seed: 13.5,
        });
      }

      if (style === 'purple_fur') {
        return renderPhotoPixelField540(
          540,
          540,
          128,
          128,
          (x, y) => {
            const plush = fbm2D(x * 0.24, y * 0.24, 77.1, 3);
            const furStreak = fbm2D(x * 0.52, y * 0.11, 31.4, 2);
            const grime = fbm2D(x * 0.08, y * 0.08, 8.8, 2);
            const l = 0.78 + plush * 0.34 + furStreak * 0.16 - grime * 0.18;
            return [74 * l, 28 * l, 102 * l];
          },
          { repeat: true, seed: 77.1 }
        );
      }

      // General clothing & skin wraps painted natively at 540x540
      const [br, bg, bb] = hexToRgb(hex);
      const [canvas, ctx] = makePhotoCanvas(TARGET, TARGET);
      const img = ctx.createImageData(TARGET, TARGET);
      const d = img.data;

      for (let y = 0; y < TARGET; y++) {
        const sy = y * scale;
        for (let x = 0; x < TARGET; x++) {
          const sx = x * scale;
          const grain = fbm2D(sx * 0.14, sy * 0.14, seed * 17.3 + 3.1, 3);
          const weave =
            ((x + (y % 2)) % 2 === 0 ? 1 : -1) *
            (style === 'skin_hand' || style === 'shoes' ? 1.5 : 3.5);
          const foldFreq = style === 'pants' || style === 'denim' ? 0.08 : 0.095;
          const creaseWave = Math.sin(
            sx * foldFreq + fbm2D(sx * 0.05, sy * 0.04, seed * 9.7, 2) * 3.8
          );
          const diagFold =
            style === 'hoodie' || style === 'jacket'
              ? Math.sin((sx + sy * 0.6) * 0.07 + grain * 2.4) * 0.09
              : 0;

          let light = 0.96 + creaseWave * 0.11 + diagFold - grain * 0.13;

          if (style === 'pants' || style === 'denim') {
            const verticalSeam = Math.abs(sx - 64) < 3 || Math.abs(sx - 192) < 3 ? 0.87 : 1.0;
            const kneeWear = radialBump(sx, sy, 128, 144, 52, 40) * 0.14;
            const cuffDirt = Math.max(0, (sy - 208) / 48) * 0.18;
            const twill = (x + y) % 3 === 0 && style === 'denim' ? 5 : 0;
            const s = light * verticalSeam + kneeWear - cuffDirt;
            const idx = (y * TARGET + x) * 4;
            d[idx] = clamp255(br * s + twill);
            d[idx + 1] = clamp255(bg * s + twill);
            d[idx + 2] = clamp255(bb * s + twill);
            d[idx + 3] = 255;
            continue;
          }

          if (style === 'skin_hand') {
            const knuckle = radialBump(sx, sy, 128, 84, 68, 36) * 0.08;
            light = 0.96 + knuckle - grain * 0.07;
          } else if (style === 'shoes') {
            const scuff = fbm2D(sx * 0.18, sy * 0.18, seed + 51, 2);
            const soleBand = sy > 214 ? 1.18 : 1.0;
            light = (0.9 + scuff * 0.22) * soleBand;
          }

          const idx = (y * TARGET + x) * 4;
          d[idx] = clamp255(br * light + weave);
          d[idx + 1] = clamp255(bg * light + weave);
          d[idx + 2] = clamp255(bb * light + weave);
          d[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      if (style === 'polo' || style === 'hoodie' || style === 'jacket' || style === 'apron') {
        ctx.save();
        ctx.scale(TARGET / DESIGN, TARGET / DESIGN);
        const aoTop = ctx.createLinearGradient(0, 0, 0, 56);
        aoTop.addColorStop(0, 'rgba(8, 10, 14, 0.34)');
        aoTop.addColorStop(1, 'rgba(8, 10, 14, 0)');
        ctx.fillStyle = aoTop;
        ctx.fillRect(0, 0, 256, 56);

        const aoBot = ctx.createLinearGradient(0, 200, 0, 256);
        aoBot.addColorStop(0, 'rgba(8, 10, 14, 0)');
        aoBot.addColorStop(1, 'rgba(8, 10, 14, 0.36)');
        ctx.fillStyle = aoBot;
        ctx.fillRect(0, 200, 256, 56);

        for (const ax of [58, 198]) {
          const underArm = ctx.createRadialGradient(ax, 84, 6, ax, 96, 48);
          underArm.addColorStop(0, 'rgba(6, 8, 12, 0.36)');
          underArm.addColorStop(1, 'rgba(6, 8, 12, 0)');
          ctx.fillStyle = underArm;
          ctx.beginPath();
          ctx.ellipse(ax, 92, 38, 52, 0, 0, Math.PI * 2);
          ctx.fill();
        }

        if (style === 'hoodie') {
          ctx.strokeStyle = shadeRgb([br, bg, bb], 0.55, 0.55);
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(82, 162);
          ctx.quadraticCurveTo(128, 156, 174, 162);
          ctx.lineTo(184, 214);
          ctx.quadraticCurveTo(128, 220, 72, 214);
          ctx.closePath();
          ctx.stroke();
        } else if (style === 'polo') {
          const plGrad = ctx.createLinearGradient(120, 32, 136, 32);
          plGrad.addColorStop(0, 'rgba(0,0,0,0.22)');
          plGrad.addColorStop(0.5, 'rgba(255,255,255,0.06)');
          plGrad.addColorStop(1, 'rgba(0,0,0,0.22)');
          ctx.fillStyle = plGrad;
          ctx.fillRect(122, 24, 12, 64);
        }
        ctx.restore();
      }

      return finalizePhotoPS1Texture(canvas, TARGET, TARGET, {
        repeat: true,
        grainStrength: 8,
        chromaNoise: 4,
        ditherStrength: 4,
        quantizeStep: 4,
        seed: seed * 17.3,
      });
    });
  }

  // ---- Architecture, Flooring, Walls, Roofing, Asphalt ----

  getFloorTileTexture(): THREE.CanvasTexture {
    return this.cached('floor_fastfood_tile_540', () => {
      const tileSize = 32;
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const tx = Math.floor(x / tileSize);
          const ty = Math.floor(y / tileSize);
          const lx = x % tileSize;
          const ly = y % tileSize;
          const distEdge = Math.min(lx, tileSize - lx, ly, tileSize - ly);
          const n = fbm2D(x * 0.14, y * 0.14, 12.1, 3);
          const scuff = fbm2D(x * 0.35, y * 0.35, 88.2, 2);
          const grease = Math.max(0, fbm2D(x * 0.08, y * 0.08, 44.3, 2) - 0.56) * 1.4;

          if (distEdge < 0.9) {
            const g = 34 + n * 16;
            return [g + 3, g, g - 3];
          }
          const bevel = distEdge < 1.8 ? 0.84 : distEdge < 2.8 ? 0.93 : 1.0;
          const isRed = (tx + ty) % 2 === 0;
          const [br, bg, bb] = isRed ? [128, 34, 30] : [170, 158, 140];
          const spec = Math.sin((lx / tileSize) * Math.PI) * Math.sin((ly / tileSize) * Math.PI) * 0.08;
          const tone =
            (0.92 + spec + (n - 0.5) * 0.18 - (scuff > 0.68 ? 0.12 : 0) - grease * 0.34) * bevel;
          return [br * tone, bg * tone, bb * tone];
        },
        { repeat: true, grainStrength: 9, chromaNoise: 4, ditherStrength: 5, seed: 12.1 }
      );
    });
  }

  getRestroomTileTexture(): THREE.CanvasTexture {
    return this.cached('floor_restroom_tile_540', () => {
      const ts = 32;
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const lx = x % ts;
          const ly = y % ts;
          const distEdge = Math.min(lx, ts - lx, ly, ts - ly);
          const n = fbm2D(x * 0.16, y * 0.16, 61.3, 3);
          const damp = Math.max(0, fbm2D(x * 0.07, y * 0.07, 14.5, 2) - 0.54) * 0.65;
          if (distEdge < 0.9) return [30, 36, 40];
          const bevel = distEdge < 1.8 ? 0.82 : distEdge < 2.8 ? 0.92 : 1.0;
          const checker = (Math.floor(x / ts) + Math.floor(y / ts)) % 2 === 0 ? 1.05 : 0.93;
          const s = (0.94 + (n - 0.5) * 0.16 - damp) * checker * bevel;
          return [84 * s, 96 * s, 108 * s];
        },
        { repeat: true, seed: 61.3 }
      );
    });
  }

  getMartFloorTexture(): THREE.CanvasTexture {
    return this.cached('floor_mart_tile_540', () => {
      const ts = 32;
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const lx = x % ts;
          const ly = y % ts;
          const distEdge = Math.min(lx, ts - lx, ly, ts - ly);
          const n = fbm2D(x * 0.14, y * 0.14, 33.1, 3);
          const scuff = fbm2D(x * 0.35, y * 0.2, 18.4, 2) > 0.72 ? 0.88 : 1.0;
          if (distEdge < 0.9) return [64, 66, 70];
          const bevel = distEdge < 1.8 ? 0.88 : 1.0;
          const alt = (Math.floor(x / ts) + Math.floor(y / ts)) % 2 === 0 ? 1.03 : 0.97;
          const s = (0.96 + (n - 0.5) * 0.12) * scuff * alt * bevel;
          return [196 * s, 192 * s, 182 * s];
        },
        { repeat: true, seed: 33.1 }
      );
    });
  }

  getFastFoodWallTexture(): THREE.CanvasTexture {
    return this.cached('wall_fastfood_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const stucco = fbm2D(x * 0.24, y * 0.24, 17.8, 3);
          const waterStain = Math.max(0, fbm2D(x * 0.08, y * 0.06, 55.2, 2) - 0.54) * 0.75;
          if (y >= 88 && y <= 93) {
            const trimGrad = 0.85 + Math.sin(((y - 88) / 5) * Math.PI) * 0.25;
            const s = trimGrad * (0.92 + stucco * 0.14);
            return [144 * s, 26 * s, 24 * s];
          }
          if (y > 93) {
            const lx = x % 16;
            const ly = y % 16;
            const dEdge = Math.min(lx, 16 - lx, ly, 16 - ly);
            const grout = dEdge < 0.8 ? 0.78 : dEdge < 1.6 ? 0.9 : 1.0;
            const floorDirt = ((y - 93) / 35) * 0.22;
            const s = (0.94 + (stucco - 0.5) * 0.14 - floorDirt - waterStain * 0.28) * grout;
            return [128 * s, 120 * s, 108 * s];
          }
          const topAo = y < 14 ? 0.82 + (y / 14) * 0.18 : 1.0;
          const s = (0.96 + (stucco - 0.5) * 0.15 - waterStain * 0.36) * topAo;
          return [170 * s, 160 * s, 142 * s];
        },
        { repeat: true, seed: 17.8 }
      );
    });
  }

  getMartWallTexture(): THREE.CanvasTexture {
    return this.cached('wall_mart_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const n = fbm2D(x * 0.14, y * 0.14, 92.4, 3);
          const seam = x % 64 < 0.9 ? 0.86 : 1.0;
          if (y >= 88 && y <= 93) {
            const g = 0.86 + Math.sin(((y - 88) / 5) * Math.PI) * 0.22;
            return [212 * g, 96 * g, 26 * g];
          }
          const floorWear = y > 104 ? ((y - 104) / 24) * 0.16 : 0;
          const s = (0.96 + (n - 0.5) * 0.12 - floorWear) * seam;
          return [228 * s, 226 * s, 218 * s];
        },
        { repeat: true, seed: 92.4 }
      );
    });
  }

  getCeilingTileTexture(): THREE.CanvasTexture {
    return this.cached('ceiling_acoustic_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const lx = x % 32;
          const ly = y % 32;
          const dEdge = Math.min(lx, 32 - lx, ly, 32 - ly);
          if (dEdge < 0.9) return [34, 31, 28];
          const bevel = dEdge < 1.8 ? 0.84 : 1.0;
          const speck = hash2D(Math.floor(x * 1.5), Math.floor(y * 1.5), 12.9) > 0.68 ? 0.85 : 1.0;
          const stain = Math.max(0, fbm2D(x * 0.08, y * 0.08, 41.7, 2) - 0.56) * 0.85;
          const s = speck * (0.92 - stain) * bevel;
          return [70 * s, 65 * s, 58 * s];
        },
        { repeat: true, seed: 41.7 }
      );
    });
  }

  getMansardRoofTexture(): THREE.CanvasTexture {
    return this.cached('roof_mansard_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const rib = Math.sin((x / 128) * Math.PI * 16) * 0.14;
          const grime = fbm2D(x * 0.1, y * 0.1, 28.4, 3) * 0.24;
          const rain = Math.max(0, (y / 128) * 0.14);
          const s = 0.92 + rib - grime - rain;
          return [156 * s, 28 * s, 28 * s];
        },
        { repeat: true, seed: 28.4 }
      );
    });
  }

  getTarRoofTexture(): THREE.CanvasTexture {
    return this.cached('roof_tar_gravel_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const gravel = hash2D(Math.floor(x * 2), Math.floor(y * 2), 71.2) * 0.24;
          const blotch = fbm2D(x * 0.09, y * 0.09, 3.3, 3);
          const s = 0.78 + gravel + (blotch - 0.5) * 0.24;
          return [34 * s, 36 * s, 40 * s];
        },
        { repeat: true, seed: 71.2 }
      );
    });
  }

  getSidewalkTexture(): THREE.CanvasTexture {
    return this.cached('concrete_sidewalk_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const lx = x % 64;
          const ly = y % 64;
          const dEdge = Math.min(lx, 64 - lx, ly, 64 - ly);
          const joint = dEdge < 0.85 ? 0.68 : dEdge < 1.8 ? 0.85 : 1.0;
          const agg = fbm2D(x * 0.2, y * 0.2, 65.1, 3);
          const stain = fbm2D(x * 0.08, y * 0.08, 19.8, 2);
          const s = (0.9 + (agg - 0.5) * 0.22 - Math.max(0, stain - 0.55) * 0.45) * joint;
          return [112 * s, 115 * s, 118 * s];
        },
        { repeat: true, seed: 65.1 }
      );
    });
  }

  getAsphaltTexture(): THREE.CanvasTexture {
    return this.cached('asphalt_wet_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const grit = hash2D(Math.floor(x * 2), Math.floor(y * 2), 99.1) * 0.24;
          const wetPatch = fbm2D(x * 0.08, y * 0.08, 24.6, 3);
          const crack = Math.abs(fbm2D(x * 0.07, y * 0.07, 7.1, 2) - 0.5) < 0.022 ? 0.65 : 1.0;
          const sheen = wetPatch > 0.56 ? 1.26 : 0.92;
          const r = (24 + grit * 24) * sheen * crack;
          const g = (27 + grit * 24) * sheen * crack;
          const b = (32 + grit * 28) * sheen * crack;
          return [r, g, b];
        },
        { repeat: true, seed: 99.1 }
      );
    });
  }

  getRearDoorTexture(): THREE.CanvasTexture {
    return this.cached('rear_service_door_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const dent = fbm2D(x * 0.1, y * 0.1, 43.2, 3);
          const dEdge = Math.min(x, 128 - x, y, 128 - y);
          const bevel = dEdge < 3 ? 0.72 + dEdge * 0.09 : 1.0;
          const rust = y > 96 ? clamp01((y - 96) / 32) * (0.4 + dent * 0.6) : 0;
          const s = (0.92 + (dent - 0.5) * 0.22) * bevel;
          const r = lerp(78 * s, 112, rust);
          const g = lerp(83 * s, 54, rust);
          const b = lerp(87 * s, 32, rust);
          return [r, g, b];
        },
        { seed: 43.2 }
      );
    });
  }

  getGlassSmudgeTexture(): THREE.CanvasTexture {
    return this.cached('glass_smudge_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const streak = fbm2D(x * 0.07, y * 0.22, 31.1, 3);
          const rain = fbm2D(x * 0.24, y * 0.07, 64.9, 2);
          const spec = Math.sin((x + y) * 0.04) * 0.1;
          const s = 0.85 + streak * 0.24 + rain * 0.14 + spec;
          return [128 * s, 165 * s, 185 * s];
        },
        { repeat: true, seed: 31.1 }
      );
    });
  }

  // ---- Kitchen & Store Equipment, Stainless, Freezers, Menu Boards ----

  getStainlessSteelTexture(dirty: boolean = true): THREE.CanvasTexture {
    return this.cached(`stainless_540_${dirty}`, () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const brush = fbm2D(x * 0.05, y * 0.55, 11.2, 2);
          const sheen = Math.sin((x * 0.03 + y * 0.015) * Math.PI) * 0.09;
          const dEdge = Math.min(x, 128 - x, y, 128 - y);
          const panelRim = dEdge < 2 ? 0.8 : 1.0;
          const grease = dirty ? Math.max(0, fbm2D(x * 0.08, y * 0.08, 72.1, 3) - 0.54) * 1.15 : 0;
          const s = (0.9 + brush * 0.24 + sheen) * panelRim;
          const r = lerp(130 * s, 94, grease);
          const g = lerp(136 * s, 84, grease);
          const b = lerp(142 * s, 66, grease);
          return [r, g, b];
        },
        { repeat: true, seed: 11.2 }
      );
    });
  }

  getFryerOilTexture(): THREE.CanvasTexture {
    return this.cached('fryer_oil_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const swirl = fbm2D(x * 0.12, y * 0.12, 5.4, 3);
          const bubble = fbm2D(x * 0.45, y * 0.45, 17.7, 2) > 0.78 ? 1.38 : 1.0;
          const s = (0.78 + swirl * 0.44) * bubble;
          return [116 * s, 74 * s, 18 * s];
        },
        { repeat: true, seed: 5.4 }
      );
    });
  }

  getCoffeeMachineFrontTexture(): THREE.CanvasTexture {
    return this.cached('coffee_machine_front_540', () => {
      const W = 256;
      const H = 256;
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const metal = ctx.createLinearGradient(0, 0, W, H);
          metal.addColorStop(0, '#9ba3ad');
          metal.addColorStop(0.35, '#cbd2da');
          metal.addColorStop(0.65, '#7e8691');
          metal.addColorStop(1, '#586069');
          ctx.fillStyle = metal;
          ctx.fillRect(0, 0, W, H);

          const panel = ctx.createLinearGradient(0, 14, 0, 76);
          panel.addColorStop(0, '#14171c');
          panel.addColorStop(0.5, '#242931');
          panel.addColorStop(1, '#101216');
          ctx.fillStyle = panel;
          ctx.beginPath();
          ctx.roundRect(14, 14, 228, 62, 8);
          ctx.fill();

          ctx.save();
          ctx.shadowColor = 'rgba(56, 189, 248, 0.75)';
          ctx.shadowBlur = 8;
          const lcdGrad = ctx.createLinearGradient(26, 28, 80, 58);
          lcdGrad.addColorStop(0, '#0c4a6e');
          lcdGrad.addColorStop(1, '#38bdf8');
          ctx.fillStyle = lcdGrad;
          ctx.beginPath();
          ctx.roundRect(26, 28, 54, 30, 4);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = '#e0f2fe';
          ctx.font = 'bold 14px monospace';
          ctx.textAlign = 'center';
          ctx.fillText('198F', 53, 48);

          const btnSpecs: [number, string, string][] = [
            [108, '#ef4444', '#7f1d1d'],
            [140, '#22c55e', '#14532d'],
            [172, '#facc15', '#854d0e'],
          ];
          btnSpecs.forEach(([bx, hi, lo]) => {
            ctx.save();
            ctx.shadowColor = hi;
            ctx.shadowBlur = 7;
            const bg = ctx.createRadialGradient(bx - 2, 41, 1, bx, 43, 12);
            bg.addColorStop(0, '#ffffff');
            bg.addColorStop(0.35, hi);
            bg.addColorStop(1, lo);
            ctx.fillStyle = bg;
            ctx.beginPath();
            ctx.arc(bx, 43, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
          });

          const gauge = ctx.createRadialGradient(212, 43, 2, 212, 43, 16);
          gauge.addColorStop(0, '#f8fafc');
          gauge.addColorStop(0.8, '#cbd5e1');
          gauge.addColorStop(1, '#475569');
          ctx.fillStyle = gauge;
          ctx.beginPath();
          ctx.arc(212, 43, 15, 0, Math.PI * 2);
          ctx.fill();
          ctx.strokeStyle = '#dc2626';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(212, 43);
          ctx.lineTo(221, 35);
          ctx.stroke();

          for (const [sx, sy, sr] of [
            [76, 206, 36],
            [178, 198, 40],
            [128, 224, 28],
          ]) {
            const stain = ctx.createRadialGradient(sx, sy, 2, sx, sy, sr);
            stain.addColorStop(0, 'rgba(54, 28, 14, 0.62)');
            stain.addColorStop(0.6, 'rgba(76, 42, 20, 0.3)');
            stain.addColorStop(1, 'rgba(76, 42, 20, 0)');
            ctx.fillStyle = stain;
            ctx.beginPath();
            ctx.ellipse(sx, sy, sr * 0.9, sr * 1.2, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.25, 44.1, 0.04);
        },
        { seed: 44.1 }
      );
    });
  }

  getSodaMarqueeTexture(): THREE.CanvasTexture {
    return this.cached('soda_marquee_960x540', () => {
      const W = 256;
      const H = 128;
      return paintScaledPhotoCanvas540(
        W,
        H,
        960,
        540,
        (ctx) => {
          const bg = ctx.createLinearGradient(0, 0, 0, H);
          bg.addColorStop(0, '#7f1d1d');
          bg.addColorStop(0.25, '#dc2626');
          bg.addColorStop(0.75, '#b91c1c');
          bg.addColorStop(1, '#580d0d');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);

          const glow = ctx.createRadialGradient(128, 64, 12, 128, 64, 130);
          glow.addColorStop(0, 'rgba(255, 240, 180, 0.28)');
          glow.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
          ctx.fillStyle = glow;
          ctx.fillRect(0, 0, W, H);

          ctx.save();
          ctx.shadowColor = 'rgba(253, 224, 71, 0.65)';
          ctx.shadowBlur = 10;
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 34px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('ICE COLD', 128, 44);
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 28px sans-serif';
          ctx.fillText('FOUNTAIN', 128, 88);
          ctx.restore();

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.26, 22.4, 0.06);
        },
        { seed: 22.4 }
      );
    });
  }

  getSodaFlavorTexture(index: number): THREE.CanvasTexture {
    return this.cached(`soda_flavor_540_${index}`, () => {
      const W = 128;
      const H = 128;
      const specs = [
        { hi: '#ef4444', lo: '#7f1d1d', fg: '#ffffff', label: 'COLA' },
        { hi: '#22c55e', lo: '#14532d', fg: '#fef08a', label: 'LIME' },
        { hi: '#fb923c', lo: '#9a3412', fg: '#fef9c3', label: 'ORNG' },
        { hi: '#b45309', lo: '#451a03', fg: '#fde68a', label: 'ROOT' },
      ];
      const sp = specs[index % specs.length];
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const bg = ctx.createRadialGradient(64, 54, 10, 64, 64, 84);
          bg.addColorStop(0, sp.hi);
          bg.addColorStop(1, sp.lo);
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, W, H);

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.lineWidth = 6;
          ctx.beginPath();
          ctx.roundRect(8, 8, 112, 112, 14);
          ctx.stroke();

          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.5)';
          ctx.shadowBlur = 6;
          ctx.fillStyle = sp.fg;
          ctx.font = 'bold 28px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(sp.label, 64, 66);
          ctx.restore();

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.22, index * 9 + 1, 0.04);
        },
        { seed: index * 9 + 1 }
      );
    });
  }

  getFreezerWallTexture(): THREE.CanvasTexture {
    return this.cached('freezer_wall_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const lx = x % 64;
          const ly = y % 64;
          const dEdge = Math.min(lx, 64 - lx, ly, 64 - ly);
          const seam = dEdge < 0.9 ? 0.65 : dEdge < 1.8 ? 0.84 : 1.0;
          const frost = fbm2D(x * 0.14, y * 0.14, 81.2, 3);
          const crystal = hash2D(Math.floor(x * 2), Math.floor(y * 2), 5.1) > 0.86 ? 1.3 : 1.0;
          const s = (0.78 + frost * 0.42) * crystal * seam;
          return [84 * s, 108 * s, 126 * s];
        },
        { repeat: true, seed: 81.2 }
      );
    });
  }

  getMartCoolerBackTexture(): THREE.CanvasTexture {
    return this.cached('mart_cooler_back_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const shelfRow = y % 32 < 3 ? 0.68 : 1.0;
          const n = fbm2D(x * 0.14, y * 0.14, 4.4, 2);
          const glow = 0.85 + Math.sin((y / 128) * Math.PI) * 0.28 - n * 0.1;
          return [195 * glow * shelfRow, 224 * glow * shelfRow, 245 * glow * shelfRow];
        },
        { seed: 4.4 }
      );
    });
  }

  getMartProductBoxTexture(colorHex: number, seed: number = 1): THREE.CanvasTexture {
    const hex = toHexColor(colorHex);
    return this.cached(`mart_product_540_${hex}_${seed}`, () => {
      const W = 128;
      const H = 128;
      const [br, bg, bb] = hexToRgb(hex);
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const boxGrad = ctx.createLinearGradient(0, 0, W, H);
          boxGrad.addColorStop(0, rgbaStr(br * 1.15, bg * 1.15, bb * 1.15));
          boxGrad.addColorStop(0.55, hex);
          boxGrad.addColorStop(1, rgbaStr(br * 0.65, bg * 0.65, bb * 0.65));
          ctx.fillStyle = boxGrad;
          ctx.fillRect(0, 0, W, H);

          const labelGrad = ctx.createLinearGradient(12, 22, 12, 76);
          labelGrad.addColorStop(0, '#ffffff');
          labelGrad.addColorStop(1, '#e2e8f0');
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.38)';
          ctx.shadowBlur = 5;
          ctx.fillStyle = labelGrad;
          ctx.beginPath();
          ctx.roundRect(12, 22, 104, 52, 8);
          ctx.fill();
          ctx.restore();

          ctx.fillStyle = shadeHex(hex, 0.55);
          ctx.beginPath();
          ctx.roundRect(22, 34, 84, 14, 4);
          ctx.fill();

          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.roundRect(22, 54, 62, 8, 3);
          ctx.fill();

          const sheen = ctx.createLinearGradient(0, 0, 128, 128);
          sheen.addColorStop(0.2, 'rgba(255,255,255,0)');
          sheen.addColorStop(0.35, 'rgba(255,255,255,0.22)');
          sheen.addColorStop(0.5, 'rgba(255,255,255,0)');
          ctx.fillStyle = sheen;
          ctx.fillRect(0, 0, W, H);

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.2, seed * 7.1, 0);
        },
        { seed: seed * 7.1 }
      );
    });
  }

  getDriveThruMenuBoardTexture(): THREE.CanvasTexture {
    return this.cached('drivethru_menu_360', () => {
      const W = 256;
      const H = 256;
      return paintScaledPhotoCanvas360(
        W,
        H,
        360,
        360,
        (ctx) => {
          const frameGrad = ctx.createLinearGradient(0, 0, 0, H);
          frameGrad.addColorStop(0, '#1e2026');
          frameGrad.addColorStop(1, '#0e1014');
          ctx.fillStyle = frameGrad;
          ctx.fillRect(0, 0, W, H);

          const hdr = ctx.createLinearGradient(0, 6, 0, 50);
          hdr.addColorStop(0, '#dc2626');
          hdr.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = hdr;
          ctx.beginPath();
          ctx.roundRect(6, 6, 244, 44, 6);
          ctx.fill();

          ctx.save();
          ctx.shadowColor = 'rgba(250, 204, 21, 0.6)';
          ctx.shadowBlur = 8;
          ctx.fillStyle = '#fde047';
          ctx.font = 'bold 21px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('LATE NIGHT MENU', 128, 35);
          ctx.restore();

          const items = [
            { x: 10, y: 58, hi: '#f59e0b', lo: '#78350f', title: '1 BIG MAC', price: '$5.99' },
            { x: 132, y: 58, hi: '#facc15', lo: '#854d0e', title: '2 CHICKEN', price: '$6.49' },
            { x: 10, y: 154, hi: '#a16207', lo: '#451a03', title: '3 McCAFE', price: '$2.49' },
            { x: 132, y: 154, hi: '#22c55e', lo: '#14532d', title: '4 COMBO', price: '$8.99' },
          ];
          items.forEach((it) => {
            const panelGrad = ctx.createRadialGradient(
              it.x + 57,
              it.y + 44,
              6,
              it.x + 57,
              it.y + 44,
              70
            );
            panelGrad.addColorStop(0, '#3f3f46');
            panelGrad.addColorStop(1, '#18181b');
            ctx.fillStyle = panelGrad;
            ctx.beginPath();
            ctx.roundRect(it.x, it.y, 114, 90, 6);
            ctx.fill();

            const thumb = ctx.createRadialGradient(
              it.x + 57,
              it.y + 42,
              4,
              it.x + 57,
              it.y + 45,
              36
            );
            thumb.addColorStop(0, it.hi);
            thumb.addColorStop(1, it.lo);
            ctx.fillStyle = thumb;
            ctx.beginPath();
            ctx.ellipse(it.x + 57, it.y + 44, 34, 20, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillStyle = '#f8fafc';
            ctx.font = 'bold 13px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText(it.title, it.x + 57, it.y + 18);
            ctx.fillStyle = '#fde047';
            ctx.font = 'bold 15px sans-serif';
            ctx.fillText(it.price, it.x + 57, it.y + 82);
          });

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.24, 55.1, 0.05);
        },
        { seed: 55.1 }
      );
    });
  }

  // ---- Food Items (Fried Chicken, Fries, Burger, Wrappers, Buckets, Cups) ----

  getFriedChickenTexture(raw: boolean = false): THREE.CanvasTexture {
    return this.cached(`food_fried_chicken_540_${raw}`, () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const crunch = fbm2D(x * 0.28, y * 0.28, raw ? 3.1 : 19.8, 3);
          const flake = fbm2D(x * 0.58, y * 0.58, 7.2, 2) * 0.24;
          const crisp = crunch * 0.72 + flake;
          const gloss = Math.sin((x / 128) * Math.PI) * 0.1;
          if (raw) {
            return [196 + crisp * 46 + gloss * 20, 138 + crisp * 36, 98 + crisp * 22];
          }
          return [168 + crisp * 78 + gloss * 28, 90 + crisp * 64, 20 + crisp * 24];
        },
        { repeat: true, seed: raw ? 3.1 : 19.8 }
      );
    });
  }

  getPotatoFryTexture(): THREE.CanvasTexture {
    return this.cached('food_potato_fry_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        64,
        64,
        (x, y) => {
          const n = fbm2D(x * 0.24, y * 0.24, 8.9, 3);
          const tip = y < 8 || y > 55 ? 0.78 : 1.0;
          const salt = hash2D(Math.floor(x * 2), Math.floor(y * 2), 3.3) > 0.94 ? 1.2 : 1.0;
          return [
            238 * (0.9 + n * 0.18) * tip * salt,
            190 * (0.88 + n * 0.2) * tip * salt,
            54 * tip * salt,
          ];
        },
        { repeat: true, seed: 8.9 }
      );
    });
  }

  getBurgerBunTexture(): THREE.CanvasTexture {
    return this.cached('food_burger_bun_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const bake = fbm2D(x * 0.14, y * 0.14, 14.2, 3);
          const sesame = radialBump(x % 22, y % 20, 11, 10, 3.2, 2.0);
          if (sesame > 0.45 && hash2D(Math.floor(x / 22), Math.floor(y / 20), 2.5) > 0.42) {
            return [246, 232, 186];
          }
          const glaze = Math.sin((x / 128) * Math.PI) * 0.1;
          const rim = y > 96 ? 0.84 : 1.04;
          const s = (0.88 + bake * 0.24 + glaze) * rim;
          return [214 * s, 140 * s, 48 * s];
        },
        { repeat: true, seed: 14.2 }
      );
    });
  }

  getBurgerPattyTexture(): THREE.CanvasTexture {
    return this.cached('food_burger_patty_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        64,
        64,
        (x, y) => {
          const char = fbm2D(x * 0.28, y * 0.28, 51.3, 3);
          const grill = Math.abs(Math.sin((y / 64) * Math.PI * 5)) < 0.22 ? 0.68 : 1.0;
          const s = (0.74 + char * 0.48) * grill;
          return [82 * s, 34 * s, 14 * s];
        },
        { repeat: true, seed: 51.3 }
      );
    });
  }

  getFryCartonTexture(): THREE.CanvasTexture {
    return this.cached('food_fry_carton_540', () => {
      const W = 128;
      const H = 128;
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const grad = ctx.createLinearGradient(0, 0, W, H);
          grad.addColorStop(0, '#dc2626');
          grad.addColorStop(0.55, '#b91c1c');
          grad.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);

          drawPhotographicGoldenArches(ctx, 64, 88, 56, 46, false);
          addPhotoSurfaceAtmosphere(ctx, W, H, 0.24, 9.1, 0);
        },
        { seed: 9.1 }
      );
    });
  }

  getChickenBucketTexture(): THREE.CanvasTexture {
    return this.cached('food_chicken_bucket_540', () => {
      const W = 256;
      const H = 256;
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const grad = ctx.createLinearGradient(0, 0, W, 0);
          grad.addColorStop(0, '#7f1d1d');
          grad.addColorStop(0.5, '#dc2626');
          grad.addColorStop(1, '#7f1d1d');
          ctx.fillStyle = grad;
          ctx.fillRect(0, 0, W, H);

          const band = ctx.createLinearGradient(0, 82, 0, 166);
          band.addColorStop(0, '#fef08a');
          band.addColorStop(0.5, '#facc15');
          band.addColorStop(1, '#ca8a04');
          ctx.fillStyle = band;
          ctx.fillRect(0, 86, W, 74);

          ctx.fillStyle = '#f8fafc';
          ctx.fillRect(0, 76, W, 10);
          ctx.fillRect(0, 160, W, 10);

          ctx.fillStyle = '#7f1d1d';
          ctx.font = 'bold 34px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('CRISPY', 128, 134);

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.25, 31.4, 0);
        },
        { repeat: true, seed: 31.4 }
      );
    });
  }

  getFoodTrayLinerTexture(): THREE.CanvasTexture {
    return this.cached('food_tray_liner_540', () => {
      const W = 256;
      const H = 256;
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          ctx.fillStyle = '#b91c1c';
          ctx.fillRect(0, 0, W, H);

          const paper = ctx.createRadialGradient(128, 128, 16, 128, 128, 160);
          paper.addColorStop(0, '#faf6ee');
          paper.addColorStop(1, '#dfd6c6');
          ctx.fillStyle = paper;
          ctx.beginPath();
          ctx.roundRect(12, 12, 232, 232, 8);
          ctx.fill();

          const badge = ctx.createRadialGradient(128, 128, 8, 128, 128, 56);
          badge.addColorStop(0, '#fde047');
          badge.addColorStop(1, '#ca8a04');
          ctx.fillStyle = badge;
          ctx.beginPath();
          ctx.arc(128, 128, 52, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#991b1b';
          ctx.font = 'bold 24px sans-serif';
          ctx.textAlign = 'center';
          ctx.fillText('ENJOY!', 128, 136);

          addPhotoSurfaceAtmosphere(ctx, W, H, 0.18, 14.5, 0);
        },
        { seed: 14.5 }
      );
    });
  }

  getDrinkCupTexture(baseColor: number): THREE.CanvasTexture {
    const hex = toHexColor(baseColor);
    return this.cached(`food_drink_cup_540_${hex}`, () => {
      const W = 128;
      const H = 128;
      const [br, bg, bb] = hexToRgb(hex);
      return paintScaledPhotoCanvas540(
        W,
        H,
        540,
        540,
        (ctx) => {
          const cyl = ctx.createLinearGradient(0, 0, W, 0);
          cyl.addColorStop(0, rgbaStr(br * 0.72, bg * 0.72, bb * 0.72));
          cyl.addColorStop(0.5, rgbaStr(br * 1.12, bg * 1.12, bb * 1.12));
          cyl.addColorStop(1, rgbaStr(br * 0.72, bg * 0.72, bb * 0.72));
          ctx.fillStyle = cyl;
          ctx.fillRect(0, 0, W, H);

          const band = ctx.createLinearGradient(0, 38, 0, 86);
          band.addColorStop(0, 'rgba(255,255,255,0.28)');
          band.addColorStop(1, 'rgba(255,255,255,0.08)');
          ctx.fillStyle = band;
          ctx.fillRect(0, 38, W, 48);

          drawPhotographicGoldenArches(ctx, 64, 78, 36, 30, false);
          addPhotoSurfaceAtmosphere(ctx, W, H, 0.16, 18.2, 0);
        },
        { repeat: true, seed: 18.2 }
      );
    });
  }

  // ---- Furniture, Trash, Restroom & Dumpsters ----

  getFormicaTableTexture(): THREE.CanvasTexture {
    return this.cached('formica_table_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const speck = hash2D(Math.floor(x * 2), Math.floor(y * 2), 22.1) > 0.88 ? 0.88 : 1.0;
          const stain = fbm2D(x * 0.08, y * 0.08, 15.6, 3);
          const dEdge = Math.min(x, 128 - x, y, 128 - y);
          const rim = dEdge < 3 ? 0.82 : 1.0;
          const s = (0.94 + (stain - 0.5) * 0.16) * speck * rim;
          return [214 * s, 200 * s, 166 * s];
        },
        { repeat: true, seed: 15.6 }
      );
    });
  }

  getRedVinylBoothTexture(): THREE.CanvasTexture {
    return this.cached('vinyl_booth_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const crease = Math.sin(x * 0.18 + fbm2D(x * 0.06, y * 0.06, 5.2, 2) * 2.4) * 0.1;
          const wear = fbm2D(x * 0.12, y * 0.12, 19.3, 3) * 0.15;
          const modX = x % 32;
          const stitch = modX < 0.7 || modX > 31.3 ? 0.82 : 1.0;
          const sheen = Math.sin((y / 128) * Math.PI) * 0.12;
          const s = (0.94 + crease - wear + sheen) * stitch;
          return [170 * s, 32 * s, 26 * s];
        },
        { repeat: true, seed: 19.3 }
      );
    });
  }

  getWoodGrainTexture(baseColor: number = 0x4a2a22): THREE.CanvasTexture {
    const hex = toHexColor(baseColor);
    return this.cached(`wood_grain_540_${hex}`, () => {
      const [br, bg, bb] = hexToRgb(hex);
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const ring = Math.sin(y * 0.24 + fbm2D(x * 0.03, y * 0.14, 31.1, 3) * 6.5) * 0.16;
          const scratch = hash2D(Math.floor(x) >> 2, Math.floor(y), 8.8) > 0.96 ? 1.14 : 1.0;
          const s = (0.94 + ring) * scratch;
          return [br * s, bg * s, bb * s];
        },
        { repeat: true, seed: 31.1 }
      );
    });
  }

  getCardboardTexture(): THREE.CanvasTexture {
    return this.cached('cardboard_box_540', () => {
      const W = 540;
      const H = 540;
      const [canvas, ctx] = makePhotoCanvas(W, H);
      const img = ctx.createImageData(W, H);
      const d = img.data;
      const scale = 256 / 540;
      for (let y = 0; y < H; y++) {
        const sy = y * scale;
        const rib = Math.sin(sy * 0.42) * 0.045;
        for (let x = 0; x < W; x++) {
          const sx = x * scale;
          const n = fbm2D(sx * 0.11, sy * 0.11, 66.2, 3);
          const s = 0.94 + rib - n * 0.14;
          const idx = (y * W + x) * 4;
          d[idx] = clamp255(148 * s);
          d[idx + 1] = clamp255(106 * s);
          d[idx + 2] = clamp255(66 * s);
          d[idx + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);

      ctx.save();
      ctx.scale(W / 256, H / 256);
      const tapeGrad = ctx.createLinearGradient(0, 106, 0, 146);
      tapeGrad.addColorStop(0, 'rgba(218, 198, 154, 0.72)');
      tapeGrad.addColorStop(0.5, 'rgba(232, 216, 178, 0.82)');
      tapeGrad.addColorStop(1, 'rgba(182, 162, 118, 0.72)');
      ctx.fillStyle = tapeGrad;
      ctx.fillRect(0, 108, 256, 38);

      ctx.fillStyle = 'rgba(74, 50, 27, 0.75)';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('FROZEN GOODS', 24, 48);

      addPhotoSurfaceAtmosphere(ctx, 256, 256, 0.22, 66.2, 0);
      ctx.restore();
      return finalizePhotoPS1Texture(canvas, W, H, { seed: 66.2 });
    });
  }

  getTrashBagTexture(): THREE.CanvasTexture {
    return this.cached('trash_bag_wrinkle_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const crinkle = fbm2D(x * 0.18, y * 0.18, 11.9, 3);
          const ridge = Math.abs(Math.sin(crinkle * 12.0));
          const highlight = ridge > 0.84 ? 1.65 : 0.82 + crinkle * 0.36;
          return [22 * highlight, 24 * highlight, 28 * highlight];
        },
        { repeat: true, seed: 11.9 }
      );
    });
  }

  getDumpsterTexture(rusty: boolean = false): THREE.CanvasTexture {
    return this.cached(`dumpster_540_${rusty}`, () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const wear = fbm2D(x * 0.12, y * 0.12, 91.5, 3);
          const scratch = hash2D(Math.floor(x) >> 2, Math.floor(y), 4.1) > 0.95 ? 1.25 : 1.0;
          const rustAmt = rusty ? 0.5 + wear * 0.5 : Math.max(0, wear - 0.54) * 1.4;
          const rib = x % 32 < 4 ? 0.82 : 1.0;
          const s = (0.88 + wear * 0.24) * scratch * rib;
          return [
            lerp(30 * s, 96, rustAmt),
            lerp(72 * s, 52, rustAmt),
            lerp(40 * s, 28, rustAmt),
          ];
        },
        { repeat: true, seed: 91.5 }
      );
    });
  }

  getPorcelainTexture(): THREE.CanvasTexture {
    return this.cached('porcelain_stained_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const stain = Math.max(0, fbm2D(x * 0.08, y * 0.08, 48.2, 3) - 0.52) * 0.65;
          const drip = y > 72 ? Math.max(0, fbm2D(x * 0.22, y * 0.04, 12.1, 2) - 0.56) * 0.6 : 0;
          const s = 0.98 - stain * 0.28 - drip * 0.24;
          return [234 * s, 236 * s, 228 * s - drip * 22];
        },
        { repeat: true, seed: 48.2 }
      );
    });
  }

  getRestroomMirrorTexture(): THREE.CanvasTexture {
    return this.cached('restroom_mirror_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const diag = Math.sin((x + y) * 0.08) * 0.12;
          const spot = fbm2D(x * 0.15, y * 0.15, 73.1, 3);
          const dEdge = Math.min(x, 128 - x, y, 128 - y);
          const edgeRot = dEdge < 8 ? 0.72 + dEdge * 0.035 : 1.0;
          const s = (0.86 + diag + (spot - 0.5) * 0.18) * edgeRot;
          return [142 * s, 168 * s, 182 * s];
        },
        { seed: 73.1 }
      );
    });
  }

  // ---- Vehicles (Metallic Car Paint, Alloy Rims, Fluted Headlights, Taillights, Grille) ----

  getCarPaintTexture(bodyColor: number): THREE.CanvasTexture {
    const hex = toHexColor(bodyColor);
    return this.cached(`car_paint_540_${hex}`, () => {
      const [br, bg, bb] = hexToRgb(hex);
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const grime = Math.max(0, (y - 88) / 40) * 0.34;
          const rain = fbm2D(x * 0.22, y * 0.05, 23.1, 2) * 0.09;
          const skyRef = Math.sin((y / 128) * Math.PI) * 0.14;
          const seam =
            Math.abs(x - 36) < 0.85 || Math.abs(x - 90) < 0.85 || Math.abs(y - 72) < 0.85
              ? 0.68
              : 1.0;
          const topSheen = y < 32 ? 1.15 : 0.96 + skyRef;
          const s = (topSheen - grime - rain) * seam;
          return [br * s, bg * s, bb * s];
        },
        { seed: 23.1 }
      );
    });
  }

  getCarTireTexture(): THREE.CanvasTexture {
    return this.cached('car_tire_tread_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        64,
        64,
        (x, y) => {
          const tread = y % 8 < 2 || (x % 12 < 2 && y % 4 < 2) ? 0.68 : 1.08;
          const dust = fbm2D(x * 0.18, y * 0.18, 19.2, 2) * 0.22;
          const c = (24 + dust * 22) * tread;
          return [c, c, c + 3];
        },
        { repeat: true, seed: 19.2 }
      );
    });
  }

  getCarRimTexture(): THREE.CanvasTexture {
    return this.cached('car_rim_alloy_540', () => {
      return paintScaledPhotoCanvas540(
        128,
        128,
        540,
        540,
        (ctx) => {
          const disc = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
          disc.addColorStop(0, '#cbd5e1');
          disc.addColorStop(0.45, '#475569');
          disc.addColorStop(0.85, '#94a3b8');
          disc.addColorStop(1, '#334155');
          ctx.fillStyle = disc;
          ctx.fillRect(0, 0, 128, 128);

          ctx.fillStyle = '#1e293b';
          ctx.beginPath();
          ctx.arc(64, 64, 46, 0, Math.PI * 2);
          ctx.fill();

          for (let i = 0; i < 5; i++) {
            const a = (i / 5) * Math.PI * 2;
            ctx.save();
            ctx.translate(64, 64);
            ctx.rotate(a);
            const spGrad = ctx.createLinearGradient(-8, 0, 8, 0);
            spGrad.addColorStop(0, '#64748b');
            spGrad.addColorStop(0.5, '#e2e8f0');
            spGrad.addColorStop(1, '#64748b');
            ctx.fillStyle = spGrad;
            ctx.beginPath();
            ctx.moveTo(-7, 10);
            ctx.lineTo(-10, 48);
            ctx.lineTo(10, 48);
            ctx.lineTo(7, 10);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
          }

          const hub = ctx.createRadialGradient(60, 60, 2, 64, 64, 16);
          hub.addColorStop(0, '#f8fafc');
          hub.addColorStop(1, '#64748b');
          ctx.fillStyle = hub;
          ctx.beginPath();
          ctx.arc(64, 64, 15, 0, Math.PI * 2);
          ctx.fill();
        },
        { seed: 40.1 }
      );
    });
  }

  getCarHeadlightTexture(): THREE.CanvasTexture {
    return this.cached('car_headlight_540', () => {
      return paintScaledPhotoCanvas540(
        128,
        64,
        960,
        540,
        (ctx) => {
          const housing = ctx.createLinearGradient(0, 0, 128, 64);
          housing.addColorStop(0, '#78716c');
          housing.addColorStop(1, '#44403c');
          ctx.fillStyle = housing;
          ctx.fillRect(0, 0, 128, 64);

          const bulb = ctx.createRadialGradient(48, 32, 4, 48, 32, 48);
          bulb.addColorStop(0, '#ffffff');
          bulb.addColorStop(0.45, '#fef3c7');
          bulb.addColorStop(0.85, '#fde68a');
          bulb.addColorStop(1, '#92400e');
          ctx.fillStyle = bulb;
          ctx.beginPath();
          ctx.roundRect(6, 6, 82, 52, 6);
          ctx.fill();

          const amber = ctx.createRadialGradient(106, 32, 2, 106, 32, 22);
          amber.addColorStop(0, '#fbbf24');
          amber.addColorStop(1, '#b45309');
          ctx.fillStyle = amber;
          ctx.beginPath();
          ctx.roundRect(92, 6, 30, 52, 6);
          ctx.fill();

          ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
          ctx.lineWidth = 2;
          for (let x = 14; x < 84; x += 10) {
            ctx.beginPath();
            ctx.moveTo(x, 8);
            ctx.lineTo(x, 56);
            ctx.stroke();
          }
        },
        { seed: 31.7 }
      );
    });
  }

  getCarTaillightTexture(): THREE.CanvasTexture {
    return this.cached('car_taillight_540', () => {
      return paintScaledPhotoCanvas540(
        128,
        64,
        960,
        540,
        (ctx) => {
          ctx.fillStyle = '#271212';
          ctx.fillRect(0, 0, 128, 64);

          const ruby = ctx.createRadialGradient(44, 32, 4, 44, 32, 46);
          ruby.addColorStop(0, '#ff4d4d');
          ruby.addColorStop(0.55, '#dc2626');
          ruby.addColorStop(1, '#690c0c');
          ctx.fillStyle = ruby;
          ctx.beginPath();
          ctx.roundRect(6, 6, 74, 52, 6);
          ctx.fill();

          const blinker = ctx.createRadialGradient(103, 20, 2, 103, 20, 20);
          blinker.addColorStop(0, '#fb923c');
          blinker.addColorStop(1, '#9a3412');
          ctx.fillStyle = blinker;
          ctx.beginPath();
          ctx.roundRect(84, 6, 38, 28, 4);
          ctx.fill();

          const rev = ctx.createLinearGradient(84, 38, 122, 58);
          rev.addColorStop(0, '#f1f5f9');
          rev.addColorStop(1, '#94a3b8');
          ctx.fillStyle = rev;
          ctx.beginPath();
          ctx.roundRect(84, 38, 38, 20, 4);
          ctx.fill();
        },
        { seed: 52.3 }
      );
    });
  }

  getCarGrilleTexture(): THREE.CanvasTexture {
    return this.cached('car_grille_540', () => {
      return paintScaledPhotoCanvas540(
        256,
        64,
        960,
        540,
        (ctx) => {
          const bg = ctx.createLinearGradient(0, 0, 0, 64);
          bg.addColorStop(0, '#090b0f');
          bg.addColorStop(0.5, '#181c22');
          bg.addColorStop(1, '#08090c');
          ctx.fillStyle = bg;
          ctx.fillRect(0, 0, 256, 64);

          ctx.strokeStyle = '#6b7280';
          ctx.lineWidth = 3;
          for (let y = 10; y <= 54; y += 11) {
            ctx.beginPath();
            ctx.moveTo(8, y);
            ctx.lineTo(248, y);
            ctx.stroke();
          }

          const badge = ctx.createRadialGradient(128, 32, 2, 128, 32, 20);
          badge.addColorStop(0, '#f8fafc');
          badge.addColorStop(1, '#4b5563');
          ctx.fillStyle = badge;
          ctx.beginPath();
          ctx.ellipse(128, 32, 18, 11, 0, 0, Math.PI * 2);
          ctx.fill();
        },
        { seed: 61.9 }
      );
    });
  }

  // ---- Forest Environment (Bark, Needles, Forest Ground) ----

  getPineBarkTexture(): THREE.CanvasTexture {
    return this.cached('forest_pine_bark_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const furrow = Math.sin(x * 0.38 + fbm2D(x * 0.08, y * 0.06, 4.4, 2) * 3.2) * 0.25;
          const n = fbm2D(x * 0.16, y * 0.09, 17.1, 3);
          const s = 0.85 + furrow + (n - 0.5) * 0.24;
          return [34 * s, 25 * s, 18 * s];
        },
        { repeat: true, seed: 4.4 }
      );
    });
  }

  getPineNeedlesTexture(): THREE.CanvasTexture {
    return this.cached('forest_pine_needles_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const twig = fbm2D(x * 0.24, y * 0.18, 31.8, 3);
          const needle = hash2D(Math.floor(x * 2), Math.floor(y * 2), 9.2) * 0.24;
          const s = 0.72 + twig * 0.42 + needle;
          return [20 * s, 38 * s, 26 * s];
        },
        { repeat: true, seed: 31.8 }
      );
    });
  }

  getHairTexture(hairColor: number | string = 0x261a12): THREE.CanvasTexture {
    return createPS1HairTexture(hairColor);
  }

  /**
   * 360p PS1 Digitized Photo-Realistic Billboard & Promotional Ad Textures
   * (`360x360` for square posters/signs, `640x360` for widescreen pole billboards).
   * Built with multi-stop studio photography gradients, soft shadowBlur, curved vector food/drinks,
   * backlit fluorescent glow, subtle weather grime & film grain with NearestFilter.
   */
  getBillboardAdTexture(
    variant: PS1BillboardAdVariant = 'bigmac',
    aspect: 'square' | 'wide' = 'square'
  ): THREE.CanvasTexture {
    return this.cached(`ps1_billboard_ad_360_crisp_${aspect}_${variant}`, () => {
      const isWide = aspect === 'wide';
      const W = isWide ? 455 : 256;
      const H = 256;
      const targetW = isWide ? 640 : 360;
      const targetH = 360;
      const designOffsetX = isWide ? (W - 256) * 0.5 : 0;

      return paintScaledPhotoCanvas360(
        W,
        H,
        targetW,
        targetH,
        (ctx) => {
          const palette: Record<
            PS1BillboardAdVariant,
            { top: string; bot: string; spot: string }
          > = {
            bigmac: { top: '#4a0f0f', bot: '#120808', spot: '#d94816' },
            fries: { top: '#9c1616', bot: '#2e0608', spot: '#e68420' },
            grimace: { top: '#44167a', bot: '#14062b', spot: '#a855f7' },
            coffee: { top: '#331e12', bot: '#0e0805', spot: '#b47432' },
            mart_noodles: { top: '#0f2442', bot: '#07101a', spot: '#ea751c' },
            mart_snacks: { top: '#114224', bot: '#091812', spot: '#dc3c28' },
          };
          const pal = palette[variant];

          // Full-frame studio backdrop linear + spotlight radial gradients
          const bgGrad = ctx.createLinearGradient(0, 0, 0, H);
          bgGrad.addColorStop(0, pal.top);
          bgGrad.addColorStop(1, pal.bot);
          ctx.fillStyle = bgGrad;
          ctx.fillRect(0, 0, W, H);

          const spotGrad = ctx.createRadialGradient(
            W * 0.5,
            138,
            14,
            W * 0.5,
            138,
            isWide ? 190 : 125
          );
          spotGrad.addColorStop(0, pal.spot);
          spotGrad.addColorStop(
            0.55,
            rgbaStr(hexToRgb(pal.spot)[0], hexToRgb(pal.spot)[1], hexToRgb(pal.spot)[2], 0.35)
          );
          spotGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
          ctx.fillStyle = spotGrad;
          ctx.fillRect(0, 0, W, H);

          ctx.save();
          if (designOffsetX !== 0) {
            ctx.translate(designOffsetX, 0);
          }

      if (variant === 'bigmac') {
        // Header banner
        const hdr = ctx.createLinearGradient(0, 8, 0, 58);
        hdr.addColorStop(0, '#b91c1c');
        hdr.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = hdr;
        ctx.beginPath();
        ctx.roundRect(10, 8, 236, 50, 8);
        ctx.fill();

        drawPhotographicGoldenArches(ctx, 42, 46, 38, 28, true);

        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 6;
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 28px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('BIG MAC', 154, 43);
        ctx.restore();

        // Soft studio table shadow beneath burger
        const shadow = ctx.createRadialGradient(128, 212, 12, 128, 212, 84);
        shadow.addColorStop(0, 'rgba(0, 0, 0, 0.72)');
        shadow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        ctx.fillStyle = shadow;
        ctx.beginPath();
        ctx.ellipse(128, 212, 84, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        // Bottom bun (curved gradient)
        const botBun = ctx.createLinearGradient(128, 184, 128, 212);
        botBun.addColorStop(0, '#ea8a1d');
        botBun.addColorStop(1, '#85410c');
        ctx.fillStyle = botBun;
        ctx.beginPath();
        ctx.roundRect(62, 186, 132, 24, 10);
        ctx.fill();

        // Bottom charred patty + melted cheddar drape
        const pattyGrad = ctx.createLinearGradient(128, 166, 128, 188);
        pattyGrad.addColorStop(0, '#5c240d');
        pattyGrad.addColorStop(0.5, '#3b1506');
        pattyGrad.addColorStop(1, '#220b03');
        ctx.fillStyle = pattyGrad;
        ctx.beginPath();
        ctx.roundRect(56, 168, 144, 20, 8);
        ctx.fill();

        const cheeseGrad = ctx.createLinearGradient(58, 162, 198, 184);
        cheeseGrad.addColorStop(0, '#fde047');
        cheeseGrad.addColorStop(1, '#f59e0b');
        ctx.fillStyle = cheeseGrad;
        ctx.beginPath();
        ctx.moveTo(56, 166);
        ctx.lineTo(200, 166);
        ctx.lineTo(192, 175);
        ctx.lineTo(138, 173);
        ctx.lineTo(126, 185);
        ctx.lineTo(114, 173);
        ctx.lineTo(62, 176);
        ctx.closePath();
        ctx.fill();

        // Wavy crisp lettuce + club bun
        ctx.fillStyle = '#65a30d';
        ctx.beginPath();
        ctx.moveTo(54, 158);
        for (let lx = 54; lx <= 202; lx += 16) {
          ctx.quadraticCurveTo(lx + 8, 148, lx + 16, 158);
        }
        ctx.lineTo(202, 166);
        ctx.lineTo(54, 166);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#c26919';
        ctx.beginPath();
        ctx.roundRect(64, 138, 128, 16, 7);
        ctx.fill();

        // Top patty + crisp lettuce
        ctx.fillStyle = pattyGrad;
        ctx.beginPath();
        ctx.roundRect(56, 118, 144, 20, 8);
        ctx.fill();

        ctx.fillStyle = '#84cc16';
        ctx.beginPath();
        ctx.moveTo(54, 114);
        for (let lx = 54; lx <= 202; lx += 14) {
          ctx.quadraticCurveTo(lx + 7, 103, lx + 14, 114);
        }
        ctx.lineTo(202, 122);
        ctx.lineTo(54, 122);
        ctx.closePath();
        ctx.fill();

        // Glossy toasted dome sesame crown bun
        const crownGrad = ctx.createRadialGradient(112, 82, 10, 128, 96, 72);
        crownGrad.addColorStop(0, '#fcd34d');
        crownGrad.addColorStop(0.42, '#ea8a1d');
        crownGrad.addColorStop(1, '#92400e');
        ctx.fillStyle = crownGrad;
        ctx.beginPath();
        ctx.moveTo(62, 108);
        ctx.bezierCurveTo(62, 66, 194, 66, 194, 108);
        ctx.closePath();
        ctx.fill();

        // Oval sesame seeds with subtle drop shadow
        for (const [sx, sy, rot] of [
          [86, 90, 0.3],
          [110, 81, -0.2],
          [134, 86, 0.4],
          [158, 82, -0.35],
          [98, 98, -0.25],
          [124, 96, 0.15],
          [148, 99, 0.35],
        ]) {
          ctx.save();
          ctx.translate(sx, sy);
          ctx.rotate(rot);
          ctx.fillStyle = 'rgba(90, 40, 8, 0.45)';
          ctx.beginPath();
          ctx.ellipse(0, 1.5, 4.2, 2.2, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = '#fef3c7';
          ctx.beginPath();
          ctx.ellipse(0, 0, 4.0, 2.1, 0, 0, Math.PI * 2);
          ctx.fill();
          ctx.restore();
        }

        // Price starburst medallion
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 8;
        const badge = ctx.createRadialGradient(204, 204, 4, 204, 204, 34);
        badge.addColorStop(0, '#ef4444');
        badge.addColorStop(1, '#991b1b');
        ctx.fillStyle = badge;
        ctx.beginPath();
        ctx.arc(204, 204, 32, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#ffc72c';
        ctx.lineWidth = 3.5;
        ctx.stroke();
        ctx.restore();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('$5.99', 204, 211);
        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 15px sans-serif';
        ctx.fillText('OPEN 24 HRS', 86, 236);
      } else if (variant === 'fries') {
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.55)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ffc72c';
        ctx.font = 'bold 25px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('WORLD FAMOUS', 128, 36);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 20px sans-serif';
        ctx.fillText('HOT FRIES & CHICKEN', 128, 64);
        ctx.restore();

        // Fanned toasted golden fries with ambient shadow depth
        for (let i = 0; i < 11; i++) {
          const t = i - 5;
          ctx.save();
          ctx.translate(128 + t * 9, 154);
          ctx.rotate(t * 0.055);
          const fh = 68 + (2 - Math.abs(t) % 3) * 14;
          const fg = ctx.createLinearGradient(-5, -fh, 5, 0);
          fg.addColorStop(0, '#fef08a');
          fg.addColorStop(0.35, '#facc15');
          fg.addColorStop(1, '#b45309');
          ctx.shadowColor = 'rgba(0,0,0,0.4)';
          ctx.shadowBlur = 4;
          ctx.fillStyle = fg;
          ctx.beginPath();
          ctx.roundRect(-5, -fh, 10, fh, 3);
          ctx.fill();
          ctx.restore();
        }

        // Curved shaded red fry scoop carton
        const boxGrad = ctx.createLinearGradient(68, 144, 188, 224);
        boxGrad.addColorStop(0, '#ef4444');
        boxGrad.addColorStop(0.5, '#dc2626');
        boxGrad.addColorStop(1, '#7f1d1d');
        ctx.save();
        ctx.shadowColor = 'rgba(0,0,0,0.6)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = boxGrad;
        ctx.beginPath();
        ctx.moveTo(64, 142);
        ctx.quadraticCurveTo(128, 160, 192, 142);
        ctx.lineTo(176, 226);
        ctx.quadraticCurveTo(128, 232, 80, 226);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        drawPhotographicGoldenArches(ctx, 128, 206, 52, 40, false);

        ctx.fillStyle = '#fef3c7';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('FRESH AT MIDNIGHT', 128, 245);
      } else if (variant === 'grimace') {
        ctx.save();
        ctx.shadowColor = 'rgba(192, 132, 252, 0.7)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = '#f472b6';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('GRIMACE', 128, 34);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 19px sans-serif';
        ctx.fillText('NIGHT SHAKE', 128, 58);
        ctx.restore();

        // Striped straw
        ctx.save();
        ctx.translate(148, 84);
        ctx.rotate(0.18);
        const straw = ctx.createLinearGradient(-4, 0, 4, 0);
        straw.addColorStop(0, '#dc2626');
        straw.addColorStop(0.5, '#fca5a5');
        straw.addColorStop(1, '#991b1b');
        ctx.fillStyle = straw;
        ctx.beginPath();
        ctx.roundRect(-4, -36, 8, 56, 3);
        ctx.fill();
        ctx.restore();

        // Tapered translucent milkshake cup with cylindrical purple gradient
        const cupGrad = ctx.createLinearGradient(84, 110, 172, 110);
        cupGrad.addColorStop(0, '#6b21a8');
        cupGrad.addColorStop(0.35, '#c084fc');
        cupGrad.addColorStop(0.65, '#9333ea');
        cupGrad.addColorStop(1, '#4c1d95');
        ctx.fillStyle = cupGrad;
        ctx.beginPath();
        ctx.moveTo(82, 108);
        ctx.lineTo(174, 108);
        ctx.lineTo(162, 222);
        ctx.quadraticCurveTo(128, 228, 94, 222);
        ctx.closePath();
        ctx.fill();

        // Swirled whipped cream dome
        const whip = ctx.createRadialGradient(120, 86, 6, 128, 96, 48);
        whip.addColorStop(0, '#ffffff');
        whip.addColorStop(0.7, '#e2e8f0');
        whip.addColorStop(1, '#94a3b8');
        ctx.fillStyle = whip;
        ctx.beginPath();
        ctx.ellipse(128, 104, 46, 16, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(128, 88, 34, 18, 0, 0, Math.PI * 2);
        ctx.fill();

        drawPhotographicGoldenArches(ctx, 128, 176, 36, 28, false);

        ctx.fillStyle = '#f9a8d4';
        ctx.font = 'bold 16px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LIMITED TIME ONLY', 128, 244);
      } else if (variant === 'coffee') {
        ctx.save();
        ctx.shadowColor = 'rgba(252, 211, 77, 0.5)';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#fcd34d';
        ctx.font = 'bold 26px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('McCAFE 24H', 128, 36);
        ctx.fillStyle = '#e7e5e4';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText('HOT BREW & PIE', 128, 60);
        ctx.restore();

        // Soft curved wisps of hot steam
        ctx.save();
        ctx.strokeStyle = 'rgba(248, 250, 252, 0.42)';
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
        ctx.shadowBlur = 8;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        for (const sx of [108, 134]) {
          ctx.beginPath();
          ctx.moveTo(sx, 96);
          ctx.bezierCurveTo(sx - 12, 82, sx + 14, 72, sx - 4, 58);
          ctx.stroke();
        }
        ctx.restore();

        // Tapered McCafe cup with kraft sleeve
        const cup = ctx.createLinearGradient(86, 114, 170, 114);
        cup.addColorStop(0, '#d6d3d1');
        cup.addColorStop(0.4, '#ffffff');
        cup.addColorStop(1, '#a8a29e');
        ctx.fillStyle = cup;
        ctx.beginPath();
        ctx.moveTo(84, 110);
        ctx.lineTo(172, 110);
        ctx.lineTo(160, 218);
        ctx.quadraticCurveTo(128, 224, 96, 218);
        ctx.closePath();
        ctx.fill();

        const sleeve = ctx.createLinearGradient(86, 136, 170, 136);
        sleeve.addColorStop(0, '#451a03');
        sleeve.addColorStop(0.45, '#92400e');
        sleeve.addColorStop(1, '#451a03');
        ctx.fillStyle = sleeve;
        ctx.beginPath();
        ctx.moveTo(88, 138);
        ctx.lineTo(168, 138);
        ctx.lineTo(164, 188);
        ctx.lineTo(92, 188);
        ctx.closePath();
        ctx.fill();

        // Lid
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.roundRect(80, 96, 96, 16, 6);
        ctx.fill();

        drawPhotographicGoldenArches(ctx, 128, 174, 34, 24, false);

        ctx.fillStyle = '#fde68a';
        ctx.font = 'bold 19px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('ONLY $1.99', 128, 242);
      } else if (variant === 'mart_noodles') {
        const hdr = ctx.createLinearGradient(0, 0, 0, 56);
        hdr.addColorStop(0, '#166534');
        hdr.addColorStop(1, '#14532d');
        ctx.fillStyle = hdr;
        ctx.fillRect(0, 0, W, 54);
        ctx.fillStyle = '#f97316';
        ctx.fillRect(0, 50, W, 6);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('67-ELEVEN 24/7', 128, 36);

        // Cup noodle bowl + steaming soup + angled chopsticks
        const bowl = ctx.createLinearGradient(44, 114, 134, 114);
        bowl.addColorStop(0, '#c2410c');
        bowl.addColorStop(0.4, '#fb923c');
        bowl.addColorStop(1, '#7c2d12');
        ctx.fillStyle = bowl;
        ctx.beginPath();
        ctx.moveTo(44, 112);
        ctx.lineTo(136, 112);
        ctx.lineTo(124, 202);
        ctx.quadraticCurveTo(90, 210, 56, 202);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(90, 108, 44, 14, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(92, 106);
        ctx.lineTo(120, 62);
        ctx.moveTo(104, 108);
        ctx.lineTo(132, 66);
        ctx.stroke();

        // Glossy Red Energy Drink Bottle
        const bottle = ctx.createLinearGradient(156, 94, 214, 94);
        bottle.addColorStop(0, '#7f1d1d');
        bottle.addColorStop(0.35, '#ef4444');
        bottle.addColorStop(0.7, '#dc2626');
        bottle.addColorStop(1, '#7f1d1d');
        ctx.fillStyle = bottle;
        ctx.beginPath();
        ctx.roundRect(158, 92, 54, 110, 12);
        ctx.fill();

        ctx.fillStyle = '#f8fafc';
        ctx.beginPath();
        ctx.roundRect(172, 72, 26, 22, 4);
        ctx.fill();

        ctx.fillStyle = '#facc15';
        ctx.fillRect(160, 128, 50, 34);

        ctx.fillStyle = '#4ade80';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText('HOT NOODLES + ENERGY $10', 128, 236);
      } else {
        const hdr = ctx.createLinearGradient(0, 0, 0, 52);
        hdr.addColorStop(0, '#ef4444');
        hdr.addColorStop(1, '#991b1b');
        ctx.fillStyle = hdr;
        ctx.fillRect(0, 0, W, 52);
        ctx.fillStyle = '#fde047';
        ctx.font = 'bold 24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('NIGHT SNACKS', 128, 35);

        const bags: [string, string][] = [
          ['#ef4444', '#7f1d1d'],
          ['#f97316', '#9a3412'],
          ['#38bdf8', '#075985'],
        ];
        bags.forEach(([hi, lo], i) => {
          const bx = 30 + i * 68;
          const bGrad = ctx.createLinearGradient(bx, 84, bx + 56, 84);
          bGrad.addColorStop(0, lo);
          bGrad.addColorStop(0.38, hi);
          bGrad.addColorStop(1, lo);
          ctx.save();
          ctx.shadowColor = 'rgba(0,0,0,0.48)';
          ctx.shadowBlur = 7;
          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.roundRect(bx, 84, 56, 98, 8);
          ctx.fill();
          ctx.restore();

          // Glossy snack foil highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.22)';
          ctx.beginPath();
          ctx.ellipse(bx + 18, 128, 9, 36, 0.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = '#fde047';
          ctx.beginPath();
          ctx.roundRect(bx + 8, 114, 40, 24, 5);
          ctx.fill();
        });

        ctx.fillStyle = '#86efac';
        ctx.font = 'bold 17px sans-serif';
        ctx.fillText('COLD DRINKS OPEN ALL NIGHT', 128, 226);
      }
      ctx.restore();
      addPhotoSurfaceAtmosphere(ctx, W, H, 0.32, 71.3, 0.08);
    },
        {
          grainStrength: 10,
          chromaNoise: 5,
          ditherStrength: 5,
          quantizeStep: 4,
          seed: 71.3,
        }
      );
    });
  }

  getForestFloorTexture(): THREE.CanvasTexture {
    return this.cached('forest_floor_dirt_540', () => {
      return renderPhotoPixelField540(
        540,
        540,
        128,
        128,
        (x, y) => {
          const mud = fbm2D(x * 0.1, y * 0.1, 63.4, 3);
          const litter = hash2D(Math.floor(x * 2), Math.floor(y * 2), 5.7) > 0.84 ? 1.22 : 0.92;
          const s = (0.76 + mud * 0.44) * litter;
          return [16 * s, 21 * s, 17 * s];
        },
        { repeat: true, seed: 63.4 }
      );
    });
  }
}

export const TextureLibrary = new PS1TextureLibrary();

// ============================================================================
// BACKWARD-COMPATIBLE & UPGRADED EXPORTS FOR EXISTING IMPORTS
// ============================================================================

export function createPS1ClownFaceTexture(): THREE.CanvasTexture {
  return TextureLibrary.getClownFaceTexture();
}

export function createPS1WelcomeClownFaceTexture(): THREE.CanvasTexture {
  return TextureLibrary.getWelcomeClownFaceTexture();
}

export function createPS1ClownSuitTexture(): THREE.CanvasTexture {
  return TextureLibrary.getWrappedFabricTexture(0xb99622, 'clown_suit', 1);
}

export function createPS1ClownStripedSleeveTexture(): THREE.CanvasTexture {
  return TextureLibrary.getWrappedFabricTexture(0x701212, 'clown_sleeves', 1);
}

let cachedBloodyBladeTexture: THREE.CanvasTexture | null = null;

/** 540x540 Digitized PS1 Metallic Steel Butcher Knife Blade with Organic Gore */
export function createPS1BloodyBladeTexture(): THREE.CanvasTexture {
  if (cachedBloodyBladeTexture) {
    return cachedBloodyBladeTexture;
  }
  const W = 540;
  const H = 540;
  const [canvas, ctx] = makePhotoCanvas(W, H);
  const img = ctx.createImageData(W, H);
  const d = img.data;
  const scale = 256 / 540;
  for (let y = 0; y < H; y++) {
    const sy = y * scale;
    for (let x = 0; x < W; x++) {
      const sx = x * scale;
      const brush = fbm2D(sx * 0.06, sy * 0.36, 14.3, 2);
      const edgeHone = sx > 192 ? 1.2 : sx < 24 ? 0.65 : 1.0;
      const s = (0.88 + brush * 0.24) * edgeHone;
      let r = 176 * s;
      let g = 182 * s;
      let b = 188 * s;

      const clot =
        radialBump(sx, sy, 112, 64, 72, 52) +
        radialBump(sx, sy, 160, 128, 64, 64) +
        radialBump(sx, sy, 96, 184, 56, 40);
      const smear = clot * (0.65 + fbm2D(sx * 0.12, sy * 0.12, 29.1, 2) * 0.7);
      if (smear > 0.34) {
        const amt = clamp01((smear - 0.34) * 2.2);
        r = lerp(r, 110, amt);
        g = lerp(g, 9, amt);
        b = lerp(b, 11, amt);
      }
      const idx = (y * W + x) * 4;
      d[idx] = clamp255(r);
      d[idx + 1] = clamp255(g);
      d[idx + 2] = clamp255(b);
      d[idx + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);

  cachedBloodyBladeTexture = finalizePhotoPS1Texture(canvas, W, H, { seed: 14.3 });
  return cachedBloodyBladeTexture;
}

export function createPS1HumanFaceTexture(
  skinColor: number | string = 0xd9c2aa,
  variant: PS1HumanFaceVariant = 'tired',
  hairColor: number | string | null = null,
  hairStyle: 'short' | 'spiky' | 'hooded' | 'cap' | 'none' = 'none'
): THREE.CanvasTexture {
  return TextureLibrary.getWrappedHumanHeadTexture({
    skinColor,
    variant,
    hairColor,
    hairStyle,
  });
}

let cachedNameTagTex: THREE.CanvasTexture | null = null;
/** 540x540 Photographic Plastic Employee Name Tag Texture */
export function createPS1NameTagTexture(): THREE.CanvasTexture {
  if (cachedNameTagTex) return cachedNameTagTex;
  const W = 128;
  const H = 128;
  cachedNameTagTex = paintScaledPhotoCanvas540(
    W,
    H,
    540,
    540,
    (ctx) => {
      const bg = ctx.createLinearGradient(0, 0, W, H);
      bg.addColorStop(0, '#f8fafc');
      bg.addColorStop(1, '#cbd5e1');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      const hdr = ctx.createLinearGradient(0, 0, 0, 42);
      hdr.addColorStop(0, '#166534');
      hdr.addColorStop(1, '#14532d');
      ctx.fillStyle = hdr;
      ctx.fillRect(0, 0, W, 40);

      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 40, W, 10);

      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 6;
      ctx.strokeRect(3, 3, W - 6, H - 6);

      ctx.fillStyle = '#0f172a';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('STAFF', 64, 82);
      ctx.fillStyle = '#475569';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('CREW', 64, 106);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.16, 4.4, 0);
    },
    { seed: 4.4 }
  );
  return cachedNameTagTex;
}

let cachedEmployeeLogoTexture: THREE.CanvasTexture | null = null;
let cachedClerkCapLogoTexture: THREE.CanvasTexture | null = null;

/** 540x540 Embroidered McDonald's-Style Employee Cap/Polo Yellow Arch Emblem */
export function createPS1EmployeeLogoTexture(): THREE.CanvasTexture {
  if (cachedEmployeeLogoTexture) {
    return cachedEmployeeLogoTexture;
  }
  cachedEmployeeLogoTexture = paintScaledPhotoCanvas540(
    128,
    128,
    540,
    540,
    (ctx) => {
      const bg = ctx.createRadialGradient(64, 64, 8, 64, 64, 88);
      bg.addColorStop(0, '#991b1b');
      bg.addColorStop(1, '#5c1111');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 128, 128);

      drawPhotographicGoldenArches(ctx, 64, 96, 80, 62, true);
      addPhotoSurfaceAtmosphere(ctx, 128, 128, 0.2, 8.2, 0);
    },
    { seed: 8.2 }
  );
  return cachedEmployeeLogoTexture;
}

/** 540x540 Embroidered Store Clerk Cap Patch ("67" Night Mart Emblem) */
export function createPS1StoreClerkCapLogoTexture(
  bgHex: number | string = 0x14532d
): THREE.CanvasTexture {
  if (cachedClerkCapLogoTexture) {
    return cachedClerkCapLogoTexture;
  }
  cachedClerkCapLogoTexture = paintScaledPhotoCanvas540(
    128,
    128,
    540,
    540,
    (ctx) => {
      ctx.fillStyle = toHexColor(bgHex);
      ctx.fillRect(0, 0, 128, 128);

      const patch = ctx.createLinearGradient(12, 18, 116, 110);
      patch.addColorStop(0, '#1e293b');
      patch.addColorStop(1, '#090d16');
      ctx.fillStyle = patch;
      ctx.beginPath();
      ctx.roundRect(12, 18, 104, 92, 10);
      ctx.fill();

      ctx.fillStyle = '#f97316';
      ctx.fillRect(16, 22, 96, 12);

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 54px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('67', 64, 76);

      addPhotoSurfaceAtmosphere(ctx, 128, 128, 0.18, 15.1, 0);
    },
    { seed: 15.1 }
  );
  return cachedClerkCapLogoTexture;
}

const cachedHairTextures = new Map<string, THREE.CanvasTexture>();

/**
 * 540x540 Digitized Photo-Realistic PS1 Hair Strand Texture (NearestFilter).
 */
export function createPS1HairTexture(hairColor: number | string = 0x261a12): THREE.CanvasTexture {
  const baseHex = toHexColor(hairColor);
  const key = `hair_540_${baseHex}`;
  const existing = cachedHairTextures.get(key);
  if (existing) {
    return existing;
  }
  const [br, bg, bb] = hexToRgb(baseHex);
  const tex = renderPhotoPixelField540(
    540,
    540,
    128,
    128,
    (x, y) => {
      const strand = fbm2D(x * 0.45, y * 0.08, 17.3, 3);
      const sheen = Math.sin((y / 128) * Math.PI) * 0.24;
      const s = 0.72 + strand * 0.48 + sheen;
      return [br * s, bg * s, bb * s];
    },
    { repeat: true, seed: 17.3 }
  );
  cachedHairTextures.set(key, tex);
  return tex;
}

let cachedNightMartSignTex: THREE.CanvasTexture | null = null;
/** 640x360 Illuminated Backlit Neon "24/7 NIGHT MART" Store Sign Texture */
export function createPS1NightMartSignTexture(): THREE.CanvasTexture {
  if (cachedNightMartSignTex) return cachedNightMartSignTex;
  const W = 256;
  const H = 128;
  cachedNightMartSignTex = paintScaledPhotoCanvas360(
    W,
    H,
    640,
    360,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 10, 128, 64, 145);
      bg.addColorStop(0, '#132036');
      bg.addColorStop(1, '#070b12');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 4, W, 10);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 104, W, 10);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 114, W, 10);

      ctx.save();
      ctx.shadowColor = 'rgba(253, 224, 71, 0.75)';
      ctx.shadowBlur = 12;
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('24/7', 128, 44);

      ctx.shadowColor = 'rgba(74, 222, 128, 0.75)';
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 30px sans-serif';
      ctx.fillText('NIGHT MART', 128, 84);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.24, 3.7, 0.06);
    },
    { seed: 3.7 }
  );
  return cachedNightMartSignTex;
}

let cachedCRTGreenTex: THREE.CanvasTexture | null = null;
/** 540x540 Greenish CRT POS Register Screen Texture */
export function createPS1CRTGreenTexture(): THREE.CanvasTexture {
  if (cachedCRTGreenTex) return cachedCRTGreenTex;
  cachedCRTGreenTex = paintScaledPhotoCanvas540(
    128,
    128,
    540,
    540,
    (ctx) => {
      const bg = ctx.createRadialGradient(64, 64, 8, 64, 64, 86);
      bg.addColorStop(0, '#0c2c16');
      bg.addColorStop(1, '#030d06');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 128, 128);

      ctx.save();
      ctx.shadowColor = 'rgba(74, 222, 128, 0.7)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('POS TERM #01', 12, 24);
      ctx.fillStyle = '#86efac';
      ctx.font = '13px monospace';
      ctx.fillText('ITEM    $10.00', 12, 54);
      ctx.fillText('TAX      $0.80', 12, 74);
      ctx.fillStyle = '#bbf7d0';
      ctx.font = 'bold 16px monospace';
      ctx.fillText('TOTAL   $10.80', 12, 108);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, 128, 128, 0.35, 9.8, 0.18);
    },
    { seed: 9.8 }
  );
  return cachedCRTGreenTex;
}

export function createFloorTileTexture(): THREE.CanvasTexture {
  return TextureLibrary.getFloorTileTexture();
}

export function createStainlessSteelTexture(): THREE.CanvasTexture {
  return TextureLibrary.getStainlessSteelTexture(true);
}

export function createFreezerWallTexture(): THREE.CanvasTexture {
  return TextureLibrary.getFreezerWallTexture();
}

export function createAsphaltTexture(): THREE.CanvasTexture {
  return TextureLibrary.getAsphaltTexture();
}

let cachedMcdTotemSignTex: THREE.CanvasTexture | null = null;
/** 540x540 PS1 Digitized McDonald's Golden Arches Illuminated Totem Sign */
export function createMcDonaldsSignTexture(): THREE.CanvasTexture {
  if (cachedMcdTotemSignTex) return cachedMcdTotemSignTex;
  const W = 256;
  const H = 256;
  cachedMcdTotemSignTex = paintScaledPhotoCanvas540(
    W,
    H,
    540,
    540,
    (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#a81c1a');
      grad.addColorStop(0.55, '#821210');
      grad.addColorStop(1, '#3f0706');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(128, 118, 14, 128, 122, 128);
      glow.addColorStop(0, 'rgba(255, 224, 130, 0.36)');
      glow.addColorStop(0.55, 'rgba(220, 60, 30, 0.16)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0.35)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#320605';
      ctx.lineWidth = 10;
      ctx.strokeRect(5, 5, 246, 246);

      drawPhotographicGoldenArches(ctx, 128, 184, 152, 116, true);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'bold 23px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OPEN 24 HOURS', 128, 228);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.3, 19.4, 0.07);
    },
    { seed: 19.4 }
  );
  return cachedMcdTotemSignTex;
}

const cachedWarningSigns = new Map<string, THREE.CanvasTexture>();
/** 960x540 Emergency Warning / Exit Sign */
export function createWarningSignTexture(text: string = 'EMERGENCY EXIT'): THREE.CanvasTexture {
  const existing = cachedWarningSigns.get(text);
  if (existing) return existing;

  const W = 256;
  const H = 128;
  const isExit = text.includes('EXIT');
  const tex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 10, 128, 64, 140);
      bg.addColorStop(0, isExit ? '#16a34a' : '#b91c1c');
      bg.addColorStop(1, isExit ? '#063d1c' : '#4a0b0b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(10, 10, 236, 108, 8);
      ctx.stroke();

      ctx.save();
      ctx.shadowColor = isExit ? 'rgba(134, 239, 172, 0.7)' : 'rgba(252, 165, 165, 0.7)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 42px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isExit ? 'EXIT' : 'WARNING', 128, 50);
      ctx.restore();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(isExit ? 'EMERGENCY DOOR' : 'AUTHORIZED ONLY', 128, 94);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.25, 27.1, 0.05);
    },
    { seed: 27.1 }
  );
  cachedWarningSigns.set(text, tex);
  return tex;
}

const cachedFuseBoxTex = new Map<number, THREE.CanvasTexture>();
/** 540x540 Fuse Box Circuit Panel Texture */
export function createFuseBoxTexture(fusesInstalled: number): THREE.CanvasTexture {
  const existing = cachedFuseBoxTex.get(fusesInstalled);
  if (existing) return existing;

  const tex = paintScaledPhotoCanvas540(
    128,
    128,
    540,
    540,
    (ctx) => {
      const bg = ctx.createLinearGradient(0, 0, 128, 128);
      bg.addColorStop(0, '#32363b');
      bg.addColorStop(1, '#1a1c1f');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, 128, 128);

      ctx.strokeStyle = '#52575c';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 120, 120);

      ctx.fillStyle = '#d97706';
      ctx.beginPath();
      ctx.roundRect(22, 14, 84, 14, 3);
      ctx.fill();

      for (let i = 0; i < 3; i++) {
        const x = 18 + i * 34;
        ctx.fillStyle = '#0c0e10';
        ctx.beginPath();
        ctx.roundRect(x, 38, 24, 54, 4);
        ctx.fill();

        if (i < fusesInstalled) {
          const fGrad = ctx.createLinearGradient(x + 4, 44, x + 20, 44);
          fGrad.addColorStop(0, '#9a3412');
          fGrad.addColorStop(0.5, '#f97316');
          fGrad.addColorStop(1, '#7c2d12');
          ctx.fillStyle = fGrad;
          ctx.beginPath();
          ctx.roundRect(x + 4, 44, 16, 42, 3);
          ctx.fill();
        }

        ctx.save();
        ctx.shadowColor = i < fusesInstalled ? '#22c55e' : '#ef4444';
        ctx.shadowBlur = 8;
        ctx.fillStyle = i < fusesInstalled ? '#4ade80' : '#ef4444';
        ctx.beginPath();
        ctx.arc(x + 12, 106, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      addPhotoSurfaceAtmosphere(ctx, 128, 128, 0.25, fusesInstalled + 11, 0);
    },
    { seed: fusesInstalled + 11 }
  );
  cachedFuseBoxTex.set(fusesInstalled, tex);
  return tex;
}

const cachedPOSTex = new Map<number, THREE.CanvasTexture>();
/** 960x540 McDonald's POS Register Touchscreen Interface */
export function createPOSTouchScreenTexture(regNum: number = 1): THREE.CanvasTexture {
  const existing = cachedPOSTex.get(regNum);
  if (existing) return existing;

  const W = 256;
  const H = 128;
  const tex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      ctx.fillStyle = '#14171c';
      ctx.fillRect(0, 0, W, H);

      const hdr = ctx.createLinearGradient(0, 0, 0, 22);
      hdr.addColorStop(0, '#dc2626');
      hdr.addColorStop(1, '#7f1d1d');
      ctx.fillStyle = hdr;
      ctx.fillRect(0, 0, W, 22);
      drawPhotographicGoldenArches(ctx, 20, 18, 18, 13, false);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 14px monospace';
      ctx.fillText(`POS REGISTER #${regNum}`, 42, 16);

      ctx.fillStyle = '#0c0e12';
      ctx.beginPath();
      ctx.roundRect(8, 28, 96, 72, 4);
      ctx.fill();
      ctx.fillStyle = '#94a3b8';
      ctx.font = '11px monospace';
      ctx.fillText('1x BIG MAC', 14, 46);
      ctx.fillText('1x FRIES L', 14, 64);
      ctx.fillStyle = '#fbbf24';
      ctx.font = 'bold 13px monospace';
      ctx.fillText('TOTAL $8.49', 14, 88);

      const cols = ['#dc2626', '#ea580c', '#d97706', '#0284c7', '#9333ea', '#16a34a'];
      cols.forEach((c, i) => {
        const bx = 114 + (i % 2) * 68;
        const by = 28 + Math.floor(i / 2) * 24;
        const bg = ctx.createLinearGradient(bx, by, bx, by + 20);
        bg.addColorStop(0, c);
        bg.addColorStop(1, shadeHex(c, 0.55));
        ctx.fillStyle = bg;
        ctx.beginPath();
        ctx.roundRect(bx, by, 62, 20, 4);
        ctx.fill();
      });

      ctx.fillStyle = '#16a34a';
      ctx.beginPath();
      ctx.roundRect(8, 104, 114, 18, 4);
      ctx.fill();
      ctx.fillStyle = '#2563eb';
      ctx.beginPath();
      ctx.roundRect(130, 104, 118, 18, 4);
      ctx.fill();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.25, regNum * 5, 0.12);
    },
    { seed: regNum * 5 }
  );
  cachedPOSTex.set(regNum, tex);
  return tex;
}

let cachedPoleTex: THREE.CanvasTexture | null = null;
/** 960x540 Customer-Facing VFD Pole Display Texture */
export function createCustomerPoleDisplayTexture(): THREE.CanvasTexture {
  if (cachedPoleTex) return cachedPoleTex;
  const W = 256;
  const H = 128;
  cachedPoleTex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 10, 128, 64, 140);
      bg.addColorStop(0, '#0a2612');
      bg.addColorStop(1, '#030a05');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 255, 102, 0.75)';
      ctx.shadowBlur = 10;
      ctx.fillStyle = '#00ff66';
      ctx.font = 'bold 26px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('MCDONALDS', 128, 50);
      ctx.fillStyle = '#6ee7b7';
      ctx.font = 'bold 30px monospace';
      ctx.fillText('$16.52', 128, 96);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.28, 12.6, 0.14);
    },
    { seed: 12.6 }
  );
  return cachedPoleTex;
}

let cachedTimeClockTex: THREE.CanvasTexture | null = null;
/** 960x540 Biometric / Digital Time Attendance Machine LCD Screen */
export function createTimeAttendanceScreenTexture(): THREE.CanvasTexture {
  if (cachedTimeClockTex) return cachedTimeClockTex;
  const W = 256;
  const H = 128;
  cachedTimeClockTex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 12, 128, 64, 140);
      bg.addColorStop(0, '#0f2942');
      bg.addColorStop(1, '#06101b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.shadowColor = 'rgba(56, 189, 248, 0.7)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 20px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('TIME CLOCK', 128, 28);
      ctx.fillStyle = '#2dd4bf';
      ctx.font = 'bold 32px monospace';
      ctx.fillText('00:00 AM', 128, 70);
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('[E] PUNCH IN', 128, 108);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.26, 4.9, 0.12);
    },
    { seed: 4.9 }
  );
  return cachedTimeClockTex;
}

let cachedCCTVTex: THREE.CanvasTexture | null = null;
/** 540x540 CCTV Multi-Camera Surveillance Monitor Screen Texture */
export function createComputerCCTVScreenTexture(): THREE.CanvasTexture {
  if (cachedCCTVTex) return cachedCCTVTex;
  const W = 256;
  const H = 256;
  cachedCCTVTex = paintScaledPhotoCanvas540(
    W,
    H,
    540,
    540,
    (ctx) => {
      for (let q = 0; q < 4; q++) {
        const qx = (q % 2) * 128;
        const qy = Math.floor(q / 2) * 128;
        const g = ctx.createRadialGradient(qx + 64, qy + 64, 8, qx + 64, qy + 64, 82);
        g.addColorStop(0, '#143d22');
        g.addColorStop(1, '#040e07');
        ctx.fillStyle = g;
        ctx.fillRect(qx, qy, 128, 128);
      }

      ctx.fillStyle = '#1f5e35';
      ctx.fillRect(126, 0, 4, 256);
      ctx.fillRect(0, 126, 256, 4);

      ctx.save();
      ctx.shadowColor = 'rgba(0, 255, 102, 0.7)';
      ctx.shadowBlur = 6;
      ctx.fillStyle = '#4ade80';
      ctx.font = 'bold 20px monospace';
      ctx.fillText('CAM 01', 12, 28);
      ctx.fillText('CAM 02', 140, 28);
      ctx.fillText('CAM 03', 12, 156);
      ctx.fillText('CAM 04', 140, 156);
      ctx.restore();

      for (const [rx, ry] of [
        [108, 22],
        [236, 22],
        [108, 150],
        [236, 150],
      ]) {
        ctx.fillStyle = '#ef4444';
        ctx.beginPath();
        ctx.arc(rx, ry, 6, 0, Math.PI * 2);
        ctx.fill();
      }

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.34, 88.3, 0.22);
    },
    { seed: 88.3 }
  );
  return cachedCCTVTex;
}

let cachedMcdEntranceSignTex: THREE.CanvasTexture | null = null;
/** 960x540 Illuminated PS1 Digitized McDonald's Entrance Signboard */
export function createMcDonaldsEntranceSignTexture(): THREE.CanvasTexture {
  if (cachedMcdEntranceSignTex) return cachedMcdEntranceSignTex;
  const W = 256;
  const H = 128;
  cachedMcdEntranceSignTex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const grad = ctx.createLinearGradient(0, 0, 0, H);
      grad.addColorStop(0, '#c4211e');
      grad.addColorStop(0.55, '#8f1614');
      grad.addColorStop(1, '#540c0b');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      const glow = ctx.createRadialGradient(128, 64, 14, 128, 64, 145);
      glow.addColorStop(0, 'rgba(255, 220, 120, 0.26)');
      glow.addColorStop(1, 'rgba(0, 0, 0, 0.3)');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, W, H);

      ctx.strokeStyle = '#f5b800';
      ctx.lineWidth = 6;
      ctx.strokeRect(4, 4, 248, 120);

      drawPhotographicGoldenArches(ctx, 48, 96, 62, 54, true);

      ctx.save();
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.shadowBlur = 7;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText("McDonald's", 92, 56);
      ctx.fillStyle = '#ffc72c';
      ctx.font = 'bold 21px sans-serif';
      ctx.fillText('DRIVE-THRU 24H', 92, 94);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.28, 16.5, 0.06);
    },
    { seed: 16.5 }
  );
  return cachedMcdEntranceSignTex;
}

/** 360p Digitized PS1 Photo-Realistic Promotional Posters & Ads */
export function createMcDonaldsAdPosterTexture(
  variant: 'bigmac' | 'fries' | 'grimace' | 'coffee' = 'bigmac',
  aspect: 'square' | 'wide' = 'square'
): THREE.CanvasTexture {
  return TextureLibrary.getBillboardAdTexture(variant, aspect);
}

let cached67ElevenSignTex: THREE.CanvasTexture | null = null;
/** 960x540 Illuminated 67-Eleven / 24/7 MART Convenience Fascia Sign */
export function create67ElevenSignTexture(): THREE.CanvasTexture {
  if (cached67ElevenSignTex) return cached67ElevenSignTex;
  const W = 256;
  const H = 128;
  cached67ElevenSignTex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#ffffff');
      bg.addColorStop(1, '#d8e0e8');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 4, W, 16);
      ctx.fillStyle = '#15803d';
      ctx.fillRect(0, 98, W, 14);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 112, W, 12);

      const plate = ctx.createLinearGradient(56, 26, 200, 92);
      plate.addColorStop(0, '#0f172a');
      plate.addColorStop(1, '#1e293b');
      ctx.fillStyle = plate;
      ctx.beginPath();
      ctx.roundRect(54, 26, 148, 66, 8);
      ctx.fill();

      ctx.save();
      ctx.shadowColor = 'rgba(249, 115, 22, 0.65)';
      ctx.shadowBlur = 8;
      ctx.fillStyle = '#f97316';
      ctx.font = 'bold 27px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('67-ELEVEN', 128, 60);
      ctx.restore();

      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(6, 30, 42, 56, 6);
      ctx.fill();
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.roundRect(208, 30, 42, 56, 6);
      ctx.fill();

      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 16px sans-serif';
      ctx.fillText('24/7', 27, 58);
      ctx.fillText('24/7', 229, 58);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.22, 67.1, 0.05);
    },
    { seed: 67.1 }
  );
  return cached67ElevenSignTex;
}

let cachedNoodlesSignTex: THREE.CanvasTexture | null = null;
/** 640x360 Convenience Store Stall Header Sign: NOODLES & WATER */
export function createNoodlesWaterSignTexture(): THREE.CanvasTexture {
  if (cachedNoodlesSignTex) return cachedNoodlesSignTex;
  const W = 256;
  const H = 128;
  cachedNoodlesSignTex = paintScaledPhotoCanvas360(
    W,
    H,
    640,
    360,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 12, 128, 64, 140);
      bg.addColorStop(0, '#1e293b');
      bg.addColorStop(1, '#0b111c');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 0, W, 14);
      ctx.fillStyle = '#16a34a';
      ctx.fillRect(0, 114, W, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('NOODLES', 128, 52);
      ctx.fillStyle = '#fde047';
      ctx.fillText('& WATER', 128, 92);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.24, 33.4, 0.04);
    },
    { seed: 33.4 }
  );
  return cachedNoodlesSignTex;
}

let cached247WindowTex: THREE.CanvasTexture | null = null;
/** 640x360 Illuminated Neon Window Sign: OPEN 24/7 */
export function create247WindowSignTexture(): THREE.CanvasTexture {
  if (cached247WindowTex) return cached247WindowTex;
  const W = 256;
  const H = 128;
  cached247WindowTex = paintScaledPhotoCanvas360(
    W,
    H,
    640,
    360,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 10, 128, 64, 140);
      bg.addColorStop(0, '#111827');
      bg.addColorStop(1, '#05070b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);

      ctx.save();
      ctx.shadowColor = 'rgba(239, 68, 68, 0.85)';
      ctx.shadowBlur = 10;
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(10, 10, 236, 108, 12);
      ctx.stroke();

      ctx.shadowColor = 'rgba(56, 189, 248, 0.85)';
      ctx.fillStyle = '#38bdf8';
      ctx.font = 'bold 26px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('OPEN', 128, 46);

      ctx.shadowColor = 'rgba(253, 224, 71, 0.85)';
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 44px sans-serif';
      ctx.fillText('24/7', 128, 96);
      ctx.restore();

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.26, 24.7, 0.05);
    },
    { seed: 24.7 }
  );
  return cached247WindowTex;
}

let cached67SnackSignTex: THREE.CanvasTexture | null = null;
/** 640x360 Convenience Store Aisle Sign: SNACKS & DRINKS */
export function create67SnackSignTexture(): THREE.CanvasTexture {
  if (cached67SnackSignTex) return cached67SnackSignTex;
  const W = 256;
  const H = 128;
  cached67SnackSignTex = paintScaledPhotoCanvas360(
    W,
    H,
    640,
    360,
    (ctx) => {
      const bg = ctx.createRadialGradient(128, 64, 10, 128, 64, 140);
      bg.addColorStop(0, '#273549');
      bg.addColorStop(1, '#0f172a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.fillStyle = '#dc2626';
      ctx.fillRect(0, 0, W, 14);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(0, 114, W, 14);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 28px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('SNACKS', 128, 52);
      ctx.fillStyle = '#86efac';
      ctx.fillText('DRINKS 24/7', 128, 92);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.24, 67.2, 0.04);
    },
    { seed: 67.2 }
  );
  return cached67SnackSignTex;
}

let cachedRestroomSignTex: THREE.CanvasTexture | null = null;
/** 960x540 Restroom Sign Plaque Texture */
export function createRestroomSignTexture(): THREE.CanvasTexture {
  if (cachedRestroomSignTex) return cachedRestroomSignTex;
  const W = 256;
  const H = 128;
  cachedRestroomSignTex = paintScaledPhotoCanvas540(
    W,
    H,
    960,
    540,
    (ctx) => {
      const bg = ctx.createLinearGradient(0, 0, 0, H);
      bg.addColorStop(0, '#14355e');
      bg.addColorStop(1, '#08172b');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, W, H);
      ctx.strokeStyle = '#e2e8f0';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.roundRect(10, 10, 236, 108, 8);
      ctx.stroke();

      ctx.fillStyle = '#f8fafc';
      ctx.font = 'bold 34px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('RESTROOM', 128, 66);

      addPhotoSurfaceAtmosphere(ctx, W, H, 0.22, 11.1, 0);
    },
    { seed: 11.1 }
  );
  return cachedRestroomSignTex;
}

let cachedCrackedWindowTex: THREE.CanvasTexture | null = null;
/** 540x540 Transparent Cracked Car Window Spiderweb Overlay */
export function createCrackedCarWindowTexture(): THREE.CanvasTexture {
  if (cachedCrackedWindowTex) return cachedCrackedWindowTex;
  const W = 256;
  const H = 256;
  cachedCrackedWindowTex = paintScaledPhotoCanvas540(
    W,
    H,
    540,
    540,
    (ctx) => {
      ctx.clearRect(0, 0, W, H);

      const cx = 128;
      const cy = 112;

      const halo = ctx.createRadialGradient(cx, cy, 4, cx, cy, 48);
      halo.addColorStop(0, 'rgba(255, 255, 255, 0.65)');
      halo.addColorStop(0.45, 'rgba(220, 238, 250, 0.28)');
      halo.addColorStop(1, 'rgba(220, 238, 250, 0)');
      ctx.fillStyle = halo;
      ctx.beginPath();
      ctx.arc(cx, cy, 48, 0, Math.PI * 2);
      ctx.fill();

      const rays: [number, number][] = [
        [40, 32],
        [88, 16],
        [140, 12],
        [208, 36],
        [236, 96],
        [228, 168],
        [192, 224],
        [124, 240],
        [56, 216],
        [20, 152],
        [24, 84],
      ];

      ctx.save();
      ctx.shadowColor = 'rgba(210, 240, 255, 0.7)';
      ctx.shadowBlur = 3;
      ctx.strokeStyle = 'rgba(235, 248, 255, 0.92)';
      ctx.lineWidth = 2.2;
      rays.forEach(([tx, ty]) => {
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        const midX = (cx + tx) * 0.5 + (tx > cx ? -8 : 8);
        const midY = (cy + ty) * 0.5 + (ty > cy ? 8 : -8);
        ctx.lineTo(midX, midY);
        ctx.lineTo(tx, ty);
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(210, 236, 252, 0.72)';
      ctx.lineWidth = 1.6;
      [36, 68, 100].forEach((r) => {
        ctx.beginPath();
        for (let i = 0; i <= 10; i++) {
          const ang = (i / 10) * Math.PI * 2;
          const rr = r + ((i % 2) * 8 - 4);
          const px = cx + Math.cos(ang) * rr;
          const py = cy + Math.sin(ang) * rr * 0.88;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.stroke();
      });
      ctx.restore();

      const bloodHit = ctx.createRadialGradient(cx, cy, 3, cx, cy, 24);
      bloodHit.addColorStop(0, 'rgba(138, 12, 16, 0.92)');
      bloodHit.addColorStop(0.6, 'rgba(185, 22, 24, 0.65)');
      bloodHit.addColorStop(1, 'rgba(185, 22, 24, 0)');
      ctx.fillStyle = bloodHit;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      for (const [dx, len] of [
        [cx - 4, 42],
        [cx - 14, 28],
        [cx + 12, 34],
      ]) {
        const dg = ctx.createLinearGradient(dx, cy, dx, cy + len);
        dg.addColorStop(0, 'rgba(170, 18, 22, 0.85)');
        dg.addColorStop(1, 'rgba(120, 10, 14, 0)');
        ctx.strokeStyle = dg;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(dx, cy);
        ctx.lineTo(dx, cy + len);
        ctx.stroke();
      }
    },
    {
      grainStrength: 0,
      chromaNoise: 0,
      ditherStrength: 0,
      quantizeStep: 0,
      preserveAlpha: true,
    }
  );
  return cachedCrackedWindowTex;
}

let cachedBloodyWindowTex: THREE.CanvasTexture | null = null;
/** 540x540 PS1 Blood Splatter & Dripping Stain Overlay for Duck's Cracked Car Window */
export function createBloodyCarWindowStainTexture(): THREE.CanvasTexture {
  if (cachedBloodyWindowTex) return cachedBloodyWindowTex;
  const W = 256;
  const H = 256;
  cachedBloodyWindowTex = paintScaledPhotoCanvas540(
    W,
    H,
    540,
    540,
    (ctx) => {
      ctx.clearRect(0, 0, W, H);

      const cx = 128;
      const cy = 112;

      const core = ctx.createRadialGradient(cx, cy, 6, cx, cy, 46);
      core.addColorStop(0, 'rgba(195, 22, 26, 0.92)');
      core.addColorStop(0.55, 'rgba(130, 12, 16, 0.86)');
      core.addColorStop(1, 'rgba(90, 8, 10, 0)');
      ctx.fillStyle = core;
      ctx.beginPath();
      ctx.ellipse(cx, cy, 44, 34, 0.15, 0, Math.PI * 2);
      ctx.fill();

      const droplets: [number, number, number][] = [
        [cx - 48, cy - 36, 12],
        [cx + 36, cy - 40, 11],
        [cx - 60, cy + 8, 14],
        [cx + 48, cy - 8, 15],
        [cx - 32, cy - 52, 9],
        [cx + 24, cy + 32, 13],
        [cx - 40, cy + 40, 14],
        [cx + 60, cy + 24, 10],
      ];
      droplets.forEach(([x, y, r]) => {
        const dg = ctx.createRadialGradient(x, y, 1, x, y, r);
        dg.addColorStop(0, 'rgba(155, 14, 18, 0.88)');
        dg.addColorStop(1, 'rgba(110, 10, 14, 0)');
        ctx.fillStyle = dg;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      const drips: [number, number, number, number][] = [
        [cx - 20, cy + 16, 7, 96],
        [cx - 4, cy + 20, 9, 112],
        [cx + 14, cy + 16, 7, 88],
        [cx + 28, cy + 12, 6, 64],
        [cx - 36, cy + 12, 5, 72],
        [cx + 44, cy + 8, 5, 48],
      ];
      drips.forEach(([x, y, w, h]) => {
        const lg = ctx.createLinearGradient(x, y, x, y + h);
        lg.addColorStop(0, 'rgba(128, 10, 14, 0.9)');
        lg.addColorStop(0.75, 'rgba(175, 18, 22, 0.85)');
        lg.addColorStop(1, 'rgba(140, 12, 16, 0)');
        ctx.strokeStyle = lg;
        ctx.lineWidth = w;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x, y + h);
        ctx.stroke();
      });
    },
    {
      grainStrength: 0,
      chromaNoise: 0,
      ditherStrength: 0,
      quantizeStep: 0,
      preserveAlpha: true,
    }
  );
  return cachedBloodyWindowTex;
}
