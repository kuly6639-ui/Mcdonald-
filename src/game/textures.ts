import * as THREE from 'three';

/**
 * Ultra-Low-Resolution PS1 Retro Canvas Texture Generator for McDonald's Nightfall.
 * Strict PS1 constraints:
 * - Resolution strictly 32x32, 64x32, or 64x64 pixels
 * - magFilter = THREE.NearestFilter & minFilter = THREE.NearestFilter (crisp pixels)
 * - generateMipmaps = false
 */

function finalizePS1Texture(
  canvas: HTMLCanvasElement,
  isColor: boolean = true,
  repeat: boolean = false
): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
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

function makeCanvas(w: number, h: number): [HTMLCanvasElement, CanvasRenderingContext2D] {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  return [canvas, ctx];
}

function toHexColor(color: number | string): string {
  if (typeof color === 'string') return color;
  return `#${color.toString(16).padStart(6, '0')}`;
}

function shadeHex(hex: string, factor: number): string {
  const c = new THREE.Color(hex);
  c.multiplyScalar(factor);
  return `#${c.getHexString()}`;
}

let cachedClownFaceTexture: THREE.CanvasTexture | null = null;

/**
 * 64x64 Seamless Cylindrical-Wrap PS1 Killer Clown Face Paint (NearestFilter).
 * u = 0 & 1 is back (-Z), u = 0.5 (x = 32) is dead-center front (+Z).
 * Zero rectangular edges: pure white greasepaint wraps seamlessly around sides & back,
 * with crisp symmetrical pixel features painted onto the front sculpted facets (x = 21..43).
 */
export function createPS1ClownFaceTexture(): THREE.CanvasTexture {
  if (cachedClownFaceTexture) {
    return cachedClownFaceTexture;
  }
  const [canvas, ctx] = makeCanvas(64, 64);

  // Seamless stark white greasepaint across entire 360° skull
  ctx.fillStyle = '#f2efe8';
  ctx.fillRect(0, 0, 64, 64);

  // Subtle vertical temple & jaw contour shading (wraps smoothly with no hard box edge)
  ctx.fillStyle = '#dfe2ea';
  ctx.fillRect(19, 14, 3, 28);
  ctx.fillRect(42, 14, 3, 28);
  ctx.fillStyle = '#cdd1dc';
  ctx.fillRect(23, 50, 18, 14); // Gaunt under-chin shadow

  // Thick black triangular clown eyebrows (peaking sharply over inner-center brow: py = 13..18)
  ctx.fillStyle = '#07070b';
  // Left triangular eyebrow (px = 23..30)
  ctx.fillRect(23, 17, 7, 2);
  ctx.fillRect(24, 15, 5, 2);
  ctx.fillRect(26, 13, 2, 2);
  // Right triangular eyebrow (px = 34..41)
  ctx.fillRect(34, 17, 7, 2);
  ctx.fillRect(35, 15, 5, 2);
  ctx.fillRect(36, 13, 2, 2);

  // Deep dark hollow eyes under brow (px = 24..30 and 34..40, py = 20..26)
  ctx.fillStyle = '#24232e';
  ctx.fillRect(24, 20, 6, 6);
  ctx.fillRect(34, 20, 6, 6);
  ctx.fillStyle = '#050508';
  ctx.fillRect(25, 21, 4, 4);
  ctx.fillRect(35, 21, 4, 4);
  // Tiny cold dead glint inside sockets
  ctx.fillStyle = '#cfd4de';
  ctx.fillRect(27, 22, 1, 1);
  ctx.fillRect(36, 22, 1, 1);

  // Red nose paint base behind the 4-sided low-poly red nose cone (px = 29..35, py = 30..35)
  ctx.fillStyle = '#960e0e';
  ctx.fillRect(29, 30, 6, 5);
  ctx.fillStyle = '#d11919';
  ctx.fillRect(30, 31, 4, 3);

  // Wide bloody torn red smile stretching across lower jaw & cheek corners (px = 21..43, py = 37..52)
  ctx.fillStyle = '#5c070a';
  ctx.fillRect(22, 40, 20, 9);
  ctx.fillRect(25, 48, 14, 3);
  ctx.fillStyle = '#9c0e13';
  ctx.fillRect(21, 38, 2, 4);
  ctx.fillRect(41, 38, 2, 4);
  ctx.fillRect(23, 39, 18, 2);
  ctx.fillRect(25, 47, 14, 2);
  // Blood drips & torn crimson corner smears
  ctx.fillStyle = '#c4161c';
  ctx.fillRect(20, 37, 2, 3);
  ctx.fillRect(42, 37, 2, 3);
  ctx.fillRect(28, 50, 2, 3);
  ctx.fillRect(36, 49, 1, 3);

  // Dark jagged mouth interior + uneven yellowed teeth
  ctx.fillStyle = '#110204';
  ctx.fillRect(23, 42, 18, 4);
  ctx.fillStyle = '#e6decb';
  for (let tx = 24; tx <= 38; tx += 3) {
    ctx.fillRect(tx, 43, 2, 2);
  }

  cachedClownFaceTexture = finalizePS1Texture(canvas, true, false);
  return cachedClownFaceTexture;
}

let cachedWelcomeClownFaceTexture: THREE.CanvasTexture | null = null;

/**
 * 64x64 Seamless Cylindrical-Wrap PS1 Friendly Welcome Clown Face (NearestFilter).
 * Cheerful Ronald-style mascot statue face: clean white greasepaint, friendly arched brows,
 * bright open eyes with clear white sclera & blue irises, rosy cheeks, and a warm welcoming smile.
 */
export function createPS1WelcomeClownFaceTexture(): THREE.CanvasTexture {
  if (cachedWelcomeClownFaceTexture) {
    return cachedWelcomeClownFaceTexture;
  }
  const [canvas, ctx] = makeCanvas(64, 64);

  // Clean warm white mascot greasepaint
  ctx.fillStyle = '#f7f4ec';
  ctx.fillRect(0, 0, 64, 64);

  // Soft warm contour & chin shadow
  ctx.fillStyle = '#e7e2d8';
  ctx.fillRect(23, 52, 18, 12);

  // Warm rosy cheeks
  ctx.fillStyle = '#f29b9b';
  ctx.fillRect(21, 30, 4, 4);
  ctx.fillRect(39, 30, 4, 4);

  // Friendly, cheerful arched thin eyebrows (py = 14..16)
  ctx.fillStyle = '#1f1715';
  ctx.fillRect(24, 15, 5, 1);
  ctx.fillRect(23, 16, 2, 1);
  ctx.fillRect(28, 16, 2, 1);
  ctx.fillRect(35, 15, 5, 1);
  ctx.fillRect(34, 16, 2, 1);
  ctx.fillRect(39, 16, 2, 1);

  // Bright, friendly open eyes (clear white sclera + sky-blue iris + pupil + catchlight)
  ctx.fillStyle = '#1a1414';
  ctx.fillRect(24, 19, 6, 1);
  ctx.fillRect(34, 19, 6, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(24, 20, 6, 4);
  ctx.fillRect(34, 20, 6, 4);
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(26, 20, 2, 4);
  ctx.fillRect(36, 20, 2, 4);
  ctx.fillStyle = '#09090d';
  ctx.fillRect(26, 21, 2, 2);
  ctx.fillRect(36, 21, 2, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(27, 20, 1, 1);
  ctx.fillRect(37, 20, 1, 1);

  // Bright red nose paint behind the 3D red nose cone
  ctx.fillStyle = '#d91e2a';
  ctx.fillRect(29, 30, 6, 5);

  // Clean, cheerful welcoming bright-red smile with happy white teeth (zero blood/tears)
  ctx.fillStyle = '#d91e2a';
  ctx.fillRect(22, 39, 2, 3);
  ctx.fillRect(40, 39, 2, 3);
  ctx.fillRect(23, 41, 18, 6);
  ctx.fillRect(26, 46, 12, 2);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(25, 42, 14, 3);

  cachedWelcomeClownFaceTexture = finalizePS1Texture(canvas, true, false);
  return cachedWelcomeClownFaceTexture;
}

let cachedClownSuitTexture: THREE.CanvasTexture | null = null;
let cachedClownStripedSleeveTexture: THREE.CanvasTexture | null = null;

/**
 * 64x64 Procedural PS1 Killer Clown Weathered Yellow Jumpsuit Texture (NearestFilter).
 * Matches reference: faded mustard-yellow jumpsuit with grime and dark dried blood splatters.
 */
export function createPS1ClownSuitTexture(): THREE.CanvasTexture {
  if (cachedClownSuitTexture) {
    return cachedClownSuitTexture;
  }
  const [canvas, ctx] = makeCanvas(64, 64);

  // Weathered mustard-yellow jumpsuit base
  ctx.fillStyle = '#b99622';
  ctx.fillRect(0, 0, 64, 64);

  // Subtle vertical fold shading & fabric grain
  for (let x = 0; x < 64; x += 8) {
    ctx.fillStyle = x % 16 === 0 ? '#a8861c' : '#c6a22a';
    ctx.fillRect(x, 0, 4, 64);
  }

  // Horizontal seams & grime speckles
  ctx.fillStyle = '#7c6113';
  for (let y = 18; y < 64; y += 22) {
    for (let x = 0; x < 64; x += 3) {
      ctx.fillRect(x, y, 2, 1);
    }
  }

  // Dried dark crimson blood smears & splatter stains on the killer jumpsuit
  const bloodSpots: [number, number, number, number, string][] = [
    [6, 10, 4, 5, '#590808'],
    [12, 26, 5, 4, '#6e0b0b'],
    [28, 14, 6, 7, '#4f0606'],
    [35, 34, 5, 6, '#640909'],
    [48, 20, 4, 5, '#5c0808'],
    [20, 46, 7, 4, '#4a0505'],
  ];
  for (const [bx, by, bw, bh, col] of bloodSpots) {
    ctx.fillStyle = col;
    ctx.fillRect(bx, by, bw, bh);
  }

  cachedClownSuitTexture = finalizePS1Texture(canvas, true, false);
  return cachedClownSuitTexture;
}

/**
 * 64x64 Procedural PS1 Red-and-White Horizontal Striped Sleeves with Horror Grime (NearestFilter).
 */
export function createPS1ClownStripedSleeveTexture(): THREE.CanvasTexture {
  if (cachedClownStripedSleeveTexture) {
    return cachedClownStripedSleeveTexture;
  }
  const [canvas, ctx] = makeCanvas(64, 64);

  const bandHeight = 8;
  for (let i = 0; i < 8; i++) {
    const isRed = i % 2 === 0;
    ctx.fillStyle = isRed ? '#701212' : '#dedbd2';
    ctx.fillRect(0, i * bandHeight, 64, bandHeight);
    ctx.fillStyle = isRed ? '#520b0b' : '#c4bfb4';
    ctx.fillRect(0, i * bandHeight + bandHeight - 1, 64, 1);
  }

  // Faint dark blood & dirt streaks across sleeves
  ctx.fillStyle = '#470606';
  ctx.fillRect(14, 12, 5, 6);
  ctx.fillRect(38, 30, 6, 5);
  ctx.fillRect(22, 48, 5, 4);

  cachedClownStripedSleeveTexture = finalizePS1Texture(canvas, true, false);
  return cachedClownStripedSleeveTexture;
}

let cachedBloodyBladeTexture: THREE.CanvasTexture | null = null;

/** 64x64 Procedural PS1 Metallic Grey Butcher Knife / Machete Blade with Dark Red Blood Splatters */
export function createPS1BloodyBladeTexture(): THREE.CanvasTexture {
  if (cachedBloodyBladeTexture) {
    return cachedBloodyBladeTexture;
  }
  const [canvas, ctx] = makeCanvas(64, 64);

  // Brushed metallic grey steel base
  ctx.fillStyle = '#b8bec5';
  ctx.fillRect(0, 0, 64, 64);

  // Steel grain & brighter honed cutting edge on right side
  ctx.fillStyle = '#9ca3ab';
  for (let y = 0; y < 64; y += 3) {
    ctx.fillRect(0, y, 48, 1);
  }
  ctx.fillStyle = '#d4d9df';
  ctx.fillRect(48, 0, 16, 64);
  ctx.fillStyle = '#e6eaef';
  ctx.fillRect(58, 0, 6, 64);

  // Dark spine edge on left
  ctx.fillStyle = '#6f767e';
  ctx.fillRect(0, 0, 5, 64);

  // Heavy dark crimson blood smears & splatters matching reference knife
  const clots: [number, number, number, number, string][] = [
    [16, 6, 18, 10, '#6e0707'],
    [22, 10, 26, 12, '#8a0b0b'],
    [34, 4, 16, 14, '#590505'],
    [10, 20, 22, 11, '#7a0909'],
    [28, 18, 28, 15, '#640606'],
    [42, 22, 18, 16, '#8c0c0c'],
    [18, 34, 24, 12, '#6b0707'],
    [36, 36, 22, 14, '#540404'],
    [26, 46, 26, 10, '#780808'],
    [12, 48, 14, 9, '#850a0a'],
  ];
  for (const [bx, by, bw, bh, col] of clots) {
    ctx.fillStyle = col;
    ctx.fillRect(bx, by, bw, bh);
  }

  // Fine scattered pixel droplets & diagonal streak marks
  const drops: [number, number, number, number][] = [
    [8, 8, 3, 2],
    [48, 10, 4, 3],
    [14, 15, 5, 2],
    [52, 18, 3, 4],
    [6, 30, 4, 3],
    [54, 34, 4, 5],
    [12, 40, 6, 2],
    [49, 44, 5, 3],
    [22, 56, 4, 4],
    [42, 56, 6, 3],
    [32, 28, 8, 3],
    [20, 26, 6, 2],
  ];
  ctx.fillStyle = '#4e0404';
  for (const [dx, dy, dw, dh] of drops) {
    ctx.fillRect(dx, dy, dw, dh);
  }

  cachedBloodyBladeTexture = finalizePS1Texture(canvas, true, false);
  return cachedBloodyBladeTexture;
}

const cachedHumanFaceTextures = new Map<string, THREE.CanvasTexture>();

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

/**
 * 64x64 Seamless Cylindrical-Wrap PS1 Pixel-Art Human Face (NearestFilter).
 * Zero rectangular edges: uniform skin tone wraps 360° around the sculpted low-poly head,
 * with distinct symmetrical pixel-art facial features mapped cleanly onto the front facets (x = 21..43).
 */
export function createPS1HumanFaceTexture(
  skinColor: number | string = 0xd9c2aa,
  variant: PS1HumanFaceVariant = 'tired'
): THREE.CanvasTexture {
  const skinHex = toHexColor(skinColor);
  const cacheKey = `${skinHex}_${variant}_v4`;
  const existing = cachedHumanFaceTextures.get(cacheKey);
  if (existing) {
    return existing;
  }

  const [canvas, ctx] = makeCanvas(64, 64);

  // Seamless uniform skin tone around the entire 360° head (no box frame)
  ctx.fillStyle = skinHex;
  ctx.fillRect(0, 0, 64, 64);

  const midShade = shadeHex(skinHex, 0.88);
  const deepShade = shadeHex(skinHex, 0.72);
  const warmCheek = shadeHex(skinHex, 0.93);

  // Subtle under-chin and cheekbone shading aligned to front facial columns
  ctx.fillStyle = deepShade;
  ctx.fillRect(23, 52, 18, 12);
  ctx.fillStyle = midShade;
  ctx.fillRect(20, 30, 3, 10);
  ctx.fillRect(41, 30, 3, 10);

  if (variant === 'john') {
    // John (Shift-Relief Coworker): warm skin, neat eyebrows, clear normal eyes,
    // subtle nose shadow, and a tired half-smile
    ctx.fillStyle = warmCheek;
    ctx.fillRect(22, 32, 4, 4);
    ctx.fillRect(38, 32, 4, 4);

    // Neat, calm eyebrows (py = 16..17)
    ctx.fillStyle = '#2b1b12';
    ctx.fillRect(24, 16, 6, 2);
    ctx.fillRect(34, 16, 6, 2);

    // Subtle shift-tired under-eye shade (kept light so eyes never read dark)
    ctx.fillStyle = shadeHex(skinHex, 0.85);
    ctx.fillRect(25, 24, 5, 1);
    ctx.fillRect(34, 24, 5, 1);

    // Normal friendly eyes (4px crisp white sclera + brown iris + pupil + catchlight)
    ctx.fillStyle = '#261b16';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#3b2416';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#09090d';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    // Subtle nose bridge & nostril shadow
    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    // Tired half-smile (soft upturned corners)
    ctx.fillStyle = '#5e2e28';
    ctx.fillRect(27, 43, 10, 2);
    ctx.fillStyle = '#3b1916';
    ctx.fillRect(26, 42, 2, 1);
    ctx.fillRect(36, 42, 2, 1);
    ctx.fillRect(28, 43, 8, 1);
  } else if (variant === 'clerk') {
    // Store Clerk: pale fluorescent-lit skin, tired brows, clear open eyes, slight deadpan frown
    ctx.fillStyle = midShade;
    ctx.fillRect(21, 28, 3, 12);
    ctx.fillRect(40, 28, 3, 12);

    // Flat, weary straight eyebrows
    ctx.fillStyle = '#26282e';
    ctx.fillRect(24, 17, 6, 1);
    ctx.fillRect(34, 17, 6, 1);
    ctx.fillRect(24, 18, 2, 1);
    ctx.fillRect(38, 18, 2, 1);

    // Light drooping upper lid + soft under-eye crease (no dark blocks)
    ctx.fillStyle = shadeHex(skinHex, 0.84);
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillRect(24, 24, 6, 1);
    ctx.fillRect(34, 24, 6, 1);

    // Clear tired eyes with bright white sclera + dark iris/pupil + catchlight
    ctx.fillStyle = '#1f2026';
    ctx.fillRect(24, 20, 6, 1);
    ctx.fillRect(34, 20, 6, 1);
    ctx.fillStyle = '#f5f4ee';
    ctx.fillRect(24, 21, 6, 3);
    ctx.fillRect(34, 21, 6, 3);
    ctx.fillStyle = '#2b3340';
    ctx.fillRect(26, 21, 2, 3);
    ctx.fillRect(36, 21, 2, 3);
    ctx.fillStyle = '#09090d';
    ctx.fillRect(26, 22, 2, 1);
    ctx.fillRect(36, 22, 2, 1);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 21, 1, 1);
    ctx.fillRect(37, 21, 1, 1);

    // Nose shadow
    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    // Deadpan slight frown
    ctx.fillStyle = '#382a2c';
    ctx.fillRect(27, 42, 10, 1);
    ctx.fillRect(26, 43, 2, 2);
    ctx.fillRect(36, 43, 2, 2);
  } else if (variant === 'baocon') {
    // Báo Con: bright, friendly, clean-shaven young face with lively eyes,
    // slightly raised happy eyebrows, warm cheek blush, and a cheerful smile
    ctx.fillStyle = '#e7a999';
    ctx.fillRect(22, 32, 4, 3);
    ctx.fillRect(38, 32, 4, 3);

    // Slightly raised, upbeat friendly eyebrows (py = 15..17)
    ctx.fillStyle = '#241710';
    ctx.fillRect(25, 15, 4, 2);
    ctx.fillRect(24, 16, 2, 1);
    ctx.fillRect(29, 16, 1, 1);
    ctx.fillRect(35, 15, 4, 2);
    ctx.fillRect(34, 16, 1, 1);
    ctx.fillRect(38, 16, 2, 1);

    // Lively open eyes with crisp white sclera, warm irises, clear pupils & bright catchlights
    ctx.fillStyle = '#1c1310';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#2c1e16';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#08080d';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    // Subtle nose shadow below protruding low-poly nose
    ctx.fillStyle = midShade;
    ctx.fillRect(30, 34, 4, 2);

    // Warm, cheerful pixel-art smile with clean white teeth & upturned corners (py = 41..45)
    ctx.fillStyle = '#8b2f2c';
    ctx.fillRect(26, 41, 2, 2);
    ctx.fillRect(36, 41, 2, 2);
    ctx.fillRect(27, 42, 10, 3);
    ctx.fillStyle = '#f8f4ed';
    ctx.fillRect(28, 42, 8, 2);
    ctx.fillStyle = '#5c1b1a';
    ctx.fillRect(28, 44, 8, 1);
  } else if (variant === 'bigray') {
    // Big Ray: jolly clean-shaven face with cheerful eyes, thick friendly eyebrows & bright smile (zero chin beard/stubble)
    ctx.fillStyle = '#e59f8f';
    ctx.fillRect(21, 32, 4, 4);
    ctx.fillRect(39, 32, 4, 4);

    // Cheerful thick dark-brown eyebrows
    ctx.fillStyle = '#24140b';
    ctx.fillRect(24, 16, 6, 2);
    ctx.fillRect(34, 16, 6, 2);

    // Bright wide friendly eyes with clear sclera, blue/dark irises & white catchlights
    ctx.fillStyle = '#19120e';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#2563eb';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#07070b';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    // Subtle nose shadow
    ctx.fillStyle = midShade;
    ctx.fillRect(30, 34, 4, 2);

    // Warm cheerful smile cleanly below upper-lip mustache line (clean-shaven chin)
    ctx.fillStyle = '#7c2d29';
    ctx.fillRect(27, 42, 10, 3);
    ctx.fillStyle = '#f8f4ed';
    ctx.fillRect(28, 42, 8, 2);
  } else if (variant === 'cust_bags') {
    // Customer Variation 1: Late-night tired face with clear open eyes (bright white sclera + subtle under-eye crease)
    ctx.fillStyle = '#241a16';
    ctx.fillRect(24, 16, 6, 2);
    ctx.fillRect(34, 16, 6, 2);

    // Soft natural skin-toned under-eye crease (no dark black smudges)
    ctx.fillStyle = shadeHex(skinHex, 0.82);
    ctx.fillRect(24, 24, 6, 2);
    ctx.fillRect(34, 24, 6, 2);

    // Crisp open eyes: 1px lash line + 4px bright white sclera + iris + pupil + catchlight
    ctx.fillStyle = '#211815';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#3f2e22';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#09090d';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    // Relaxed neutral late-night mouth
    ctx.fillStyle = deepShade;
    ctx.fillRect(27, 42, 10, 2);
    ctx.fillStyle = '#4a2927';
    ctx.fillRect(26, 43, 12, 2);
  } else if (variant === 'cust_stubble') {
    // Customer Variation 2: Grumpy scowling face with clear open eyes + light stubble
    ctx.fillStyle = '#211813';
    ctx.fillRect(24, 16, 4, 2);
    ctx.fillRect(27, 17, 3, 1);
    ctx.fillRect(36, 16, 4, 2);
    ctx.fillRect(34, 17, 3, 1);

    // Clear open eyes (bright sclera + iris + pupil + catchlight)
    ctx.fillStyle = '#1e1715';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#35261e';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#08080c';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    // Grumpy slight frown
    ctx.fillStyle = '#3b1f1e';
    ctx.fillRect(27, 42, 10, 2);
    ctx.fillRect(25, 43, 2, 2);
    ctx.fillRect(37, 43, 2, 2);
  } else if (variant === 'hollow' || variant === 'cust_hollow') {
    // Customer Variation 3: Quiet late-night regular with clear open eyes (never pitch-black sockets)
    ctx.fillStyle = midShade;
    ctx.fillRect(21, 28, 3, 12);
    ctx.fillRect(40, 28, 3, 12);

    ctx.fillStyle = '#231b18';
    ctx.fillRect(24, 16, 6, 2);
    ctx.fillRect(34, 16, 6, 2);

    // Bright readable eyes with white sclera, blue-grey irises, pupils & catchlights
    ctx.fillStyle = '#1d1614';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#3b4f66';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#09090d';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    ctx.fillStyle = '#472826';
    ctx.fillRect(27, 42, 10, 2);
  } else {
    // Standard 'tired' expression (used by drive-thru drivers, booth customer & customers) with bright readable eyes
    ctx.fillStyle = '#241b18';
    ctx.fillRect(24, 16, 6, 2);
    ctx.fillRect(34, 16, 6, 2);

    ctx.fillStyle = shadeHex(skinHex, 0.85);
    ctx.fillRect(24, 24, 6, 1);
    ctx.fillRect(34, 24, 6, 1);

    // Crisp open eyes: 4px white sclera + brown iris + dark pupil + catchlight
    ctx.fillStyle = '#1f1714';
    ctx.fillRect(24, 19, 6, 1);
    ctx.fillRect(34, 19, 6, 1);
    ctx.fillStyle = '#faf8f2';
    ctx.fillRect(24, 20, 6, 4);
    ctx.fillRect(34, 20, 6, 4);
    ctx.fillStyle = '#3a271c';
    ctx.fillRect(26, 20, 2, 4);
    ctx.fillRect(36, 20, 2, 4);
    ctx.fillStyle = '#07070b';
    ctx.fillRect(26, 21, 2, 2);
    ctx.fillRect(36, 21, 2, 2);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(27, 20, 1, 1);
    ctx.fillRect(37, 20, 1, 1);

    ctx.fillStyle = deepShade;
    ctx.fillRect(30, 34, 4, 2);

    ctx.fillStyle = '#4c2b28';
    ctx.fillRect(27, 42, 10, 2);
    ctx.fillRect(26, 43, 12, 1);
  }

  const tex = finalizePS1Texture(canvas, true, false);
  cachedHumanFaceTextures.set(cacheKey, tex);
  return tex;
}

/** 32x32 Pixelated Employee Name Tag Texture */
export function createPS1NameTagTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#f1f5f9';
  ctx.fillRect(0, 0, 32, 32);

  // Store green/blue header stripe
  ctx.fillStyle = '#14532d';
  ctx.fillRect(0, 0, 32, 10);

  // Orange accent bar
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 10, 32, 3);

  // Pixelated border
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 30, 30);

  // Pixelated text blocks ("CLERK")
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(5, 18, 22, 3);
  ctx.fillStyle = '#475569';
  ctx.fillRect(7, 24, 18, 2);

  return finalizePS1Texture(canvas, true, false);
}

let cachedEmployeeLogoTexture: THREE.CanvasTexture | null = null;
let cachedClerkCapLogoTexture: THREE.CanvasTexture | null = null;

/** 32x32 Pixelated McDonald's-Style Employee Cap/Polo Small Yellow Arch Logo */
export function createPS1EmployeeLogoTexture(): THREE.CanvasTexture {
  if (cachedEmployeeLogoTexture) {
    return cachedEmployeeLogoTexture;
  }
  const [canvas, ctx] = makeCanvas(32, 32);

  // Dark red polo/cap base
  ctx.fillStyle = '#7f1d1d';
  ctx.fillRect(0, 0, 32, 32);

  // Crisp small yellow pixel 'M' arch emblem
  ctx.fillStyle = '#facc15';
  // Left & right pillars + center valley
  ctx.fillRect(6, 11, 3, 13);
  ctx.fillRect(14, 12, 4, 10);
  ctx.fillRect(23, 11, 3, 13);
  // Top arch curves
  ctx.fillRect(8, 8, 6, 3);
  ctx.fillRect(18, 8, 6, 3);

  cachedEmployeeLogoTexture = finalizePS1Texture(canvas, true, false);
  return cachedEmployeeLogoTexture;
}

/** 32x32 Pixelated Store Clerk Cap Patch ("67" Night Mart Emblem) */
export function createPS1StoreClerkCapLogoTexture(bgHex: number | string = 0x14532d): THREE.CanvasTexture {
  if (cachedClerkCapLogoTexture) {
    return cachedClerkCapLogoTexture;
  }
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = toHexColor(bgHex);
  ctx.fillRect(0, 0, 32, 32);

  // Dark badge border & orange/yellow "67" pixel emblem
  ctx.fillStyle = '#0f172a';
  ctx.fillRect(3, 5, 26, 22);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(4, 6, 24, 3);
  ctx.fillStyle = '#fde047';
  // Pixel '6'
  ctx.fillRect(7, 12, 6, 2);
  ctx.fillRect(7, 12, 2, 11);
  ctx.fillRect(7, 17, 6, 2);
  ctx.fillRect(11, 17, 2, 6);
  ctx.fillRect(7, 21, 6, 2);
  // Pixel '7'
  ctx.fillRect(18, 12, 7, 2);
  ctx.fillRect(23, 12, 2, 5);
  ctx.fillRect(21, 17, 2, 6);

  cachedClerkCapLogoTexture = finalizePS1Texture(canvas, true, false);
  return cachedClerkCapLogoTexture;
}

const cachedHairTextures = new Map<string, THREE.CanvasTexture>();

/**
 * 32x32 Pixelated PS1 Hair Strand Texture (NearestFilter).
 * Adds crisp vertical retro hair highlights and dark root/tip pixel streaks.
 */
export function createPS1HairTexture(hairColor: number | string = 0x261a12): THREE.CanvasTexture {
  const baseHex = toHexColor(hairColor);
  const key = `hair_${baseHex}_v1`;
  const existing = cachedHairTextures.get(key);
  if (existing) {
    return existing;
  }

  const [canvas, ctx] = makeCanvas(32, 32);
  ctx.fillStyle = baseHex;
  ctx.fillRect(0, 0, 32, 32);

  const darkStrand = shadeHex(baseHex, 0.68);
  const midShade = shadeHex(baseHex, 0.84);
  const highlight = shadeHex(baseHex, 1.24);

  // Pixelated vertical strand bands
  for (let x = 0; x < 32; x += 2) {
    ctx.fillStyle = x % 4 === 0 ? darkStrand : midShade;
    ctx.fillRect(x, 0, 1, 32);
    if (x % 6 === 0) {
      ctx.fillStyle = highlight;
      ctx.fillRect(x + 1, 4, 1, 18);
    }
  }
  // Darker root/nape gradient pixels along bottom edge
  ctx.fillStyle = darkStrand;
  ctx.fillRect(0, 27, 32, 5);

  const tex = finalizePS1Texture(canvas, true, true);
  cachedHairTextures.set(key, tex);
  return tex;
}

/** 64x32 Pixelated Neon "24/7 MART" Store Sign Texture */
export function createPS1NightMartSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#0c121e';
  ctx.fillRect(0, 0, 64, 32);

  // Orange/Green/Red convenience strips
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 1, 64, 3);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 26, 64, 2);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 28, 64, 3);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 11px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('24/7', 32, 11);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 9px monospace';
  ctx.fillText('NIGHT MART', 32, 21);

  return finalizePS1Texture(canvas, true, false);
}

/** 32x32 Greenish CRT POS Register Screen Texture */
export function createPS1CRTGreenTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#071b0d';
  ctx.fillRect(0, 0, 32, 32);

  // Phosphor green scanlines & numeric bars
  ctx.fillStyle = '#14532d';
  for (let y = 0; y < 32; y += 2) {
    ctx.fillRect(0, y, 32, 1);
  }
  ctx.fillStyle = '#4ade80';
  ctx.fillRect(3, 4, 26, 3);
  ctx.fillRect(3, 10, 18, 2);
  ctx.fillRect(3, 14, 22, 2);
  ctx.fillRect(3, 18, 15, 2);
  ctx.fillStyle = '#86efac';
  ctx.fillRect(3, 24, 24, 4);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x64 Checkered / greasy retro fast-food floor tile */
export function createFloorTileTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);

  ctx.fillStyle = '#a69989';
  ctx.fillRect(0, 0, 64, 64);

  const tileSize = 16;
  for (let y = 0; y < 64; y += tileSize) {
    for (let x = 0; x < 64; x += tileSize) {
      const isRedTile = (x / tileSize + y / tileSize) % 2 === 0;
      ctx.fillStyle = isRedTile ? '#7a1f1d' : '#a69989';
      ctx.fillRect(x + 1, y + 1, tileSize - 2, tileSize - 2);
      ctx.fillStyle = '#3d332a';
      ctx.fillRect(x + 3, y + 5, 2, 2);
      ctx.fillRect(x + 10, y + 11, 2, 1);
    }
  }

  ctx.fillStyle = '#261e18';
  for (let i = 0; i < 64; i += tileSize) {
    ctx.fillRect(0, i, 64, 1);
    ctx.fillRect(i, 0, 1, 64);
  }

  return finalizePS1Texture(canvas, true, true);
}

/** 32x32 Kitchen stainless steel with grease streaks */
export function createStainlessSteelTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#6e7378';
  ctx.fillRect(0, 0, 32, 32);

  for (let y = 0; y < 32; y += 2) {
    ctx.fillStyle = y % 4 === 0 ? '#848a90' : '#5e6368';
    ctx.fillRect(0, y, 32, 1);
  }
  ctx.fillStyle = '#3b372c';
  ctx.fillRect(6, 8, 5, 4);
  ctx.fillRect(19, 20, 6, 3);

  return finalizePS1Texture(canvas, true, true);
}

/** 32x32 Freezer frosted wall with steel seams */
export function createFreezerWallTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#4f616d';
  ctx.fillRect(0, 0, 32, 32);

  ctx.fillStyle = '#a3c4d9';
  for (let i = 0; i < 40; i++) {
    ctx.fillRect((i * 7) % 30 + 1, (i * 11) % 30 + 1, 1, 1);
  }

  ctx.strokeStyle = '#2b3842';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 30, 30);

  return finalizePS1Texture(canvas, true, true);
}

/** 64x64 McDonald's Golden Arches Retro Poster / Totem Sign */
export function createMcDonaldsSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);

  ctx.fillStyle = '#9e1b19';
  ctx.fillRect(0, 0, 64, 64);

  ctx.strokeStyle = '#420807';
  ctx.lineWidth = 3;
  ctx.strokeRect(2, 2, 60, 60);

  // Pixelated Golden Arches 'M'
  ctx.fillStyle = '#f5b800';
  // Left leg, center leg, right leg
  ctx.fillRect(10, 20, 6, 26);
  ctx.fillRect(29, 20, 6, 26);
  ctx.fillRect(48, 20, 6, 26);
  // Tops
  ctx.fillRect(12, 14, 19, 6);
  ctx.fillRect(33, 14, 19, 6);

  // Pixel smudge & text bar
  ctx.fillStyle = '#fce4a6';
  ctx.fillRect(12, 52, 40, 4);
  ctx.fillStyle = '#3b0909';
  ctx.fillRect(36, 28, 8, 6);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Emergency Warning / Exit Sign */
export function createWarningSignTexture(text: string = 'EMERGENCY EXIT'): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  const isExit = text.includes('EXIT');
  ctx.fillStyle = isExit ? '#0d5c2e' : '#781515';
  ctx.fillRect(0, 0, 64, 32);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 60, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(isExit ? 'EXIT' : 'WARN', 32, 12);
  ctx.fillStyle = '#fde047';
  ctx.fillRect(12, 20, 40, 4);

  return finalizePS1Texture(canvas, true, false);
}

/** 32x32 Fuse Box Circuit Panel Texture */
export function createFuseBoxTexture(fusesInstalled: number): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#26292b';
  ctx.fillRect(0, 0, 32, 32);
  ctx.strokeStyle = '#4d5154';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 30, 30);

  ctx.fillStyle = '#e0a020';
  ctx.fillRect(6, 4, 20, 3);

  for (let i = 0; i < 3; i++) {
    const x = 5 + i * 9;
    ctx.fillStyle = '#111314';
    ctx.fillRect(x, 10, 6, 13);
    if (i < fusesInstalled) {
      ctx.fillStyle = '#d96818';
      ctx.fillRect(x + 1, 12, 4, 9);
      ctx.fillStyle = '#33ff33';
      ctx.fillRect(x + 2, 25, 2, 2);
    } else {
      ctx.fillStyle = '#ff2222';
      ctx.fillRect(x + 2, 25, 2, 2);
    }
  }

  return finalizePS1Texture(canvas, true, false);
}

/** 32x32 Wet dark outdoor asphalt */
export function createAsphaltTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(32, 32);

  ctx.fillStyle = '#14171a';
  ctx.fillRect(0, 0, 32, 32);

  for (let i = 0; i < 70; i++) {
    const x = (i * 13) % 32;
    const y = (i * 29) % 32;
    ctx.fillStyle = i % 2 === 0 ? '#24292e' : '#1b2025';
    ctx.fillRect(x, y, 1, 1);
  }

  ctx.fillStyle = '#b89d18';
  ctx.fillRect(6, 0, 2, 32);

  return finalizePS1Texture(canvas, true, true);
}

/** 64x32 McDonald's POS Register Touchscreen Interface */
export function createPOSTouchScreenTexture(regNum: number = 1): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#181c20';
  ctx.fillRect(0, 0, 64, 32);

  ctx.fillStyle = '#b31e1c';
  ctx.fillRect(0, 0, 64, 5);
  ctx.fillStyle = '#f5b800';
  ctx.fillRect(2, 1, 6, 3);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 5px monospace';
  ctx.fillText(`POS${regNum}`, 10, 4);

  // Ticket pane
  ctx.fillStyle = '#0f1214';
  ctx.fillRect(2, 7, 24, 18);
  ctx.fillStyle = '#a6b4c2';
  ctx.fillRect(4, 10, 18, 2);
  ctx.fillRect(4, 14, 14, 2);
  ctx.fillStyle = '#fbbf24';
  ctx.fillRect(4, 20, 20, 3);

  // Colored buttons grid
  const cols = ['#dc2626', '#ea580c', '#d97706', '#0284c7', '#9333ea', '#16a34a'];
  cols.forEach((c, i) => {
    const bx = 29 + (i % 2) * 16;
    const by = 7 + Math.floor(i / 2) * 6;
    ctx.fillStyle = c;
    ctx.fillRect(bx, by, 14, 5);
  });

  ctx.fillStyle = '#22c55e';
  ctx.fillRect(2, 26, 28, 4);
  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(32, 26, 30, 4);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Customer-Facing VFD Pole Display Texture */
export function createCustomerPoleDisplayTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#061309';
  ctx.fillRect(0, 0, 64, 32);
  ctx.strokeStyle = '#0e2413';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 62, 30);

  ctx.fillStyle = '#00ff66';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MCDONALDS', 32, 12);
  ctx.fillStyle = '#33ff88';
  ctx.fillText('$16.52', 32, 24);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Biometric / Digital Time Attendance Machine LCD Screen */
export function createTimeAttendanceScreenTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#0a1622';
  ctx.fillRect(0, 0, 64, 32);

  ctx.fillStyle = '#0f2942';
  ctx.fillRect(0, 0, 64, 7);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 6px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('TIME CLOCK', 32, 5);

  ctx.fillStyle = '#00ffcc';
  ctx.font = 'bold 8px monospace';
  ctx.fillText('00:00 AM', 32, 15);

  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 6px monospace';
  ctx.fillText('[E] PUNCH', 32, 26);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x64 CCTV Multi-Camera Surveillance Monitor Screen Texture */
export function createComputerCCTVScreenTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);

  ctx.fillStyle = '#06160b';
  ctx.fillRect(0, 0, 64, 64);

  // Quadrant lines
  ctx.fillStyle = '#1a4f2b';
  ctx.fillRect(31, 0, 2, 64);
  ctx.fillRect(0, 31, 64, 2);

  // Scanlines
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  for (let y = 0; y < 64; y += 2) {
    ctx.fillRect(0, y, 64, 1);
  }

  // Camera labels & red REC dots
  ctx.fillStyle = '#00ff66';
  ctx.font = 'bold 6px monospace';
  ctx.fillText('C1', 4, 9);
  ctx.fillText('C2', 36, 9);
  ctx.fillText('C3', 4, 41);
  ctx.fillText('C4', 36, 41);

  ctx.fillStyle = '#ff2222';
  ctx.fillRect(24, 5, 3, 3);
  ctx.fillRect(56, 5, 3, 3);
  ctx.fillRect(24, 37, 3, 3);
  ctx.fillRect(56, 37, 3, 3);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Illuminated McDonald's Entrance Signboard */
export function createMcDonaldsEntranceSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#b31e1c';
  ctx.fillRect(0, 0, 64, 32);
  ctx.strokeStyle = '#f5b800';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 62, 30);

  // Mini Golden Arches
  ctx.fillStyle = '#ffc72c';
  ctx.fillRect(4, 10, 3, 14);
  ctx.fillRect(10, 10, 3, 14);
  ctx.fillRect(16, 10, 3, 14);
  ctx.fillRect(4, 8, 15, 3);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('McDonald', 22, 14);
  ctx.fillStyle = '#ffc72c';
  ctx.font = 'bold 6px monospace';
  ctx.fillText('OPEN 24H', 22, 24);

  return finalizePS1Texture(canvas, true, false);
}

/** 32x64 / 64x64 Outdoor Promotional Ad Posters */
export function createMcDonaldsAdPosterTexture(
  variant: 'bigmac' | 'fries' | 'grimace' = 'bigmac'
): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);

  if (variant === 'bigmac') {
    ctx.fillStyle = '#1e1b18';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#b31e1c';
    ctx.fillRect(0, 0, 64, 14);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 8px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BIG MAC', 32, 10);

    // Pixel burger
    ctx.fillStyle = '#d97706';
    ctx.fillRect(18, 22, 28, 7);
    ctx.fillStyle = '#84cc16';
    ctx.fillRect(16, 29, 32, 3);
    ctx.fillStyle = '#451a03';
    ctx.fillRect(17, 32, 30, 5);
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(16, 37, 32, 3);
    ctx.fillStyle = '#b45309';
    ctx.fillRect(18, 40, 28, 6);

    ctx.fillStyle = '#dc2626';
    ctx.fillRect(42, 46, 18, 12);
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 7px monospace';
    ctx.fillText('$5.99', 51, 55);
  } else if (variant === 'fries') {
    ctx.fillStyle = '#b31e1c';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#ffc72c';
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('FRIES', 32, 12);

    // Pixel fries
    for (let i = 0; i < 6; i++) {
      ctx.fillStyle = i % 2 === 0 ? '#facc15' : '#eab308';
      ctx.fillRect(20 + i * 4, 18 + (i % 2) * 3, 3, 18);
    }
    ctx.fillStyle = '#7f1d1d';
    ctx.fillRect(18, 34, 28, 20);
    ctx.fillStyle = '#ffc72c';
    ctx.fillRect(26, 40, 12, 6);
  } else {
    ctx.fillStyle = '#3b0764';
    ctx.fillRect(0, 0, 64, 64);
    ctx.fillStyle = '#f472b6';
    ctx.font = 'bold 7px monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GRIMACE', 32, 12);
    ctx.fillStyle = '#a855f7';
    ctx.fillRect(22, 24, 20, 26);
    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(24, 18, 16, 6);
    ctx.fillStyle = '#dc2626';
    ctx.fillRect(34, 12, 3, 10);
  }

  ctx.strokeStyle = '#27272a';
  ctx.lineWidth = 2;
  ctx.strokeRect(1, 1, 62, 62);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Illuminated 67-Eleven / 24/7 MART Convenience Fascia Sign */
export function create67ElevenSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#f8fafc';
  ctx.fillRect(0, 0, 64, 32);

  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 1, 64, 4);
  ctx.fillStyle = '#15803d';
  ctx.fillRect(0, 25, 64, 3);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 28, 64, 3);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(14, 7, 36, 16);

  ctx.fillStyle = '#f97316';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('67-ELEVEN', 32, 15);

  // Left & Right 24/7 badges
  ctx.fillStyle = '#15803d';
  ctx.fillRect(1, 8, 12, 14);
  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 5px monospace';
  ctx.fillText('24/7', 7, 15);

  ctx.fillStyle = '#dc2626';
  ctx.fillRect(51, 8, 12, 14);
  ctx.fillStyle = '#fde047';
  ctx.fillText('24/7', 57, 15);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Convenience Store Stall Header Sign: NOODLES & WATER */
export function createNoodlesWaterSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#0f172a';
  ctx.fillRect(0, 0, 64, 32);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 0, 64, 4);
  ctx.fillStyle = '#16a34a';
  ctx.fillRect(0, 28, 64, 4);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('NOODLES', 32, 13);
  ctx.fillStyle = '#fde047';
  ctx.fillText('& WATER', 32, 23);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Illuminated Neon Window Sign: OPEN 24/7 */
export function create247WindowSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#090d14';
  ctx.fillRect(0, 0, 64, 32);

  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 60, 28);
  ctx.strokeStyle = '#22c55e';
  ctx.lineWidth = 1;
  ctx.strokeRect(5, 5, 54, 22);

  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('OPEN', 32, 12);

  ctx.fillStyle = '#fde047';
  ctx.font = 'bold 11px monospace';
  ctx.fillText('24/7', 32, 24);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Convenience Store Aisle Sign: SNACKS & DRINKS */
export function create67SnackSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, 64, 32);
  ctx.fillStyle = '#dc2626';
  ctx.fillRect(0, 0, 64, 4);
  ctx.fillStyle = '#f97316';
  ctx.fillRect(0, 28, 64, 4);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 7px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SNACKS', 32, 13);
  ctx.fillStyle = '#86efac';
  ctx.fillText('DRINKS 24/7', 32, 23);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x32 Restroom Sign Plaque Texture */
export function createRestroomSignTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 32);

  ctx.fillStyle = '#0f2744';
  ctx.fillRect(0, 0, 64, 32);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 2;
  ctx.strokeRect(2, 2, 60, 28);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 8px monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESTROOM', 32, 16);

  return finalizePS1Texture(canvas, true, false);
}

/** 64x64 Transparent Cracked Car Window Spiderweb Overlay */
export function createCrackedCarWindowTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);
  ctx.clearRect(0, 0, 64, 64);

  const cx = 32;
  const cy = 28;

  // Faint milky impact smudge around head impact site
  ctx.fillStyle = 'rgba(220, 238, 250, 0.24)';
  ctx.fillRect(cx - 5, cy - 5, 10, 10);
  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  ctx.fillRect(cx - 2, cy - 2, 4, 4);

  // Radial jagged spiderweb fracture lines
  const rays: [number, number][] = [
    [10, 8],
    [22, 4],
    [35, 3],
    [52, 9],
    [59, 24],
    [57, 42],
    [48, 56],
    [31, 60],
    [14, 54],
    [5, 38],
    [6, 21],
  ];

  ctx.strokeStyle = 'rgba(235, 248, 255, 0.92)';
  ctx.lineWidth = 1;
  rays.forEach(([tx, ty]) => {
    ctx.beginPath();
    ctx.moveTo(cx, cy);
    const midX = Math.round((cx + tx) * 0.5 + (tx > cx ? -2 : 2));
    const midY = Math.round((cy + ty) * 0.5 + (ty > cy ? 2 : -2));
    ctx.lineTo(midX, midY);
    ctx.lineTo(tx, ty);
    ctx.stroke();
  });

  // Concentric spiderweb rings around impact
  ctx.strokeStyle = 'rgba(210, 236, 252, 0.72)';
  [9, 17, 25].forEach((r) => {
    ctx.beginPath();
    for (let i = 0; i <= 10; i++) {
      const ang = (i / 10) * Math.PI * 2;
      const rr = r + ((i % 2) * 2 - 1);
      const px = Math.round(cx + Math.cos(ang) * rr);
      const py = Math.round(cy + Math.sin(ang) * rr * 0.88);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });

  // Crimson blood smear right at impact center and seeping along fractures
  ctx.fillStyle = 'rgba(138, 12, 16, 0.88)';
  ctx.fillRect(cx - 4, cy - 3, 8, 6);
  ctx.fillStyle = 'rgba(185, 22, 24, 0.82)';
  ctx.fillRect(cx - 2, cy - 2, 5, 4);
  ctx.fillRect(cx - 1, cy + 3, 2, 11);
  ctx.fillRect(cx - 4, cy + 2, 2, 7);
  ctx.fillRect(cx + 3, cy + 1, 2, 9);

  const tex = finalizePS1Texture(canvas, true, false);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}

/** 64x64 PS1 Blood Splatter & Dripping Stain Overlay for Duck's Cracked Car Window */
export function createBloodyCarWindowStainTexture(): THREE.CanvasTexture {
  const [canvas, ctx] = makeCanvas(64, 64);
  ctx.clearRect(0, 0, 64, 64);

  const cx = 32;
  const cy = 28;

  // Heavy dark crimson forehead impact smear
  ctx.fillStyle = 'rgba(110, 8, 12, 0.92)';
  ctx.fillRect(cx - 7, cy - 5, 14, 10);
  ctx.fillStyle = 'rgba(165, 16, 20, 0.88)';
  ctx.fillRect(cx - 5, cy - 4, 10, 8);
  ctx.fillStyle = 'rgba(205, 24, 28, 0.78)';
  ctx.fillRect(cx - 3, cy - 2, 6, 5);

  // Splatter droplets radiating outward from head strike
  const droplets: [number, number, number, number][] = [
    [cx - 12, cy - 9, 3, 3],
    [cx + 9, cy - 10, 3, 2],
    [cx - 15, cy + 2, 3, 4],
    [cx + 12, cy - 2, 4, 3],
    [cx - 8, cy - 13, 2, 2],
    [cx + 6, cy + 8, 3, 3],
    [cx - 10, cy + 10, 3, 4],
    [cx + 15, cy + 6, 2, 3],
    [cx - 18, cy - 4, 2, 2],
    [cx + 18, cy - 6, 2, 2],
  ];
  droplets.forEach(([x, y, w, h]) => {
    ctx.fillStyle = 'rgba(145, 14, 18, 0.86)';
    ctx.fillRect(x, y, w, h);
  });

  // Thick vertical dripping blood rivulets down the window glass
  const drips: [number, number, number, number][] = [
    [cx - 5, cy + 4, 2, 24],
    [cx - 1, cy + 5, 3, 28],
    [cx + 3, cy + 4, 2, 22],
    [cx + 7, cy + 3, 2, 16],
    [cx - 9, cy + 3, 1, 18],
    [cx + 11, cy + 2, 1, 12],
  ];
  drips.forEach(([x, y, w, h]) => {
    ctx.fillStyle = 'rgba(130, 10, 14, 0.88)';
    ctx.fillRect(x, y, w, h);
    ctx.fillStyle = 'rgba(190, 22, 26, 0.82)';
    ctx.fillRect(x, y + Math.floor(h * 0.65), w, Math.max(2, Math.floor(h * 0.35)));
  });

  const tex = finalizePS1Texture(canvas, true, false);
  tex.wrapS = THREE.ClampToEdgeWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  return tex;
}


