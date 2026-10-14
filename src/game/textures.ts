import * as THREE from 'three';

/**
 * Procedural Canvas Texture generator for McDonald's Nightfall.
 * Enforces zero-404 directive by generating all textures directly in HTML5 Canvas.
 */

// Helper to set color space & sharpness
function finalizeTexture(canvas: HTMLCanvasElement, isColor: boolean = true): THREE.CanvasTexture {
  const texture = new THREE.CanvasTexture(canvas);
  if (isColor) {
    texture.colorSpace = THREE.SRGBColorSpace;
  }
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

/** Checkered / greasy retro fast-food floor tile */
export function createFloorTileTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Base off-white tile with dark grime
  ctx.fillStyle = '#b8aa9a';
  ctx.fillRect(0, 0, size, size);

  const tileSize = 64;
  for (let y = 0; y < size; y += tileSize) {
    for (let x = 0; x < size; x += tileSize) {
      const isRedTile = ((x / tileSize) + (y / tileSize)) % 2 === 0;
      if (isRedTile) {
        ctx.fillStyle = '#7a1f1d'; // Muted dark McDonald's crimson tile
      } else {
        ctx.fillStyle = '#a69989'; // Dirty beige tile
      }
      ctx.fillRect(x + 2, y + 2, tileSize - 4, tileSize - 4);

      // Add dirt spots and scratches
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      for (let s = 0; s < 4; s++) {
        const spotX = x + Math.random() * tileSize;
        const spotY = y + Math.random() * tileSize;
        ctx.fillRect(spotX, spotY, 2 + Math.random() * 4, 2 + Math.random() * 3);
      }
    }
  }

  // Grout lines
  ctx.strokeStyle = '#2d251e';
  ctx.lineWidth = 3;
  for (let i = 0; i <= size; i += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, i);
    ctx.lineTo(size, i);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(i, 0);
    ctx.lineTo(i, size);
    ctx.stroke();
  }

  return finalizeTexture(canvas, true);
}

/** Kitchen stainless steel with grease and streaks */
export function createStainlessSteelTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#6e7378';
  ctx.fillRect(0, 0, size, size);

  // Brushed metal lines
  for (let i = 0; i < 400; i++) {
    const y = Math.random() * size;
    ctx.strokeStyle = `rgba(${130 + Math.random() * 60}, ${130 + Math.random() * 60}, ${140 + Math.random() * 60}, 0.25)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(size, y);
    ctx.stroke();
  }

  // Grease stains
  for (let i = 0; i < 15; i++) {
    const gx = Math.random() * size;
    const gy = Math.random() * size;
    const grad = ctx.createRadialGradient(gx, gy, 2, gx, gy, 20 + Math.random() * 40);
    grad.addColorStop(0, 'rgba(40, 35, 20, 0.45)');
    grad.addColorStop(1, 'rgba(40, 35, 20, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(gx, gy, 50, 0, Math.PI * 2);
    ctx.fill();
  }

  return finalizeTexture(canvas, true);
}

/** Freezer frosted wall with icicles and steel panels */
export function createFreezerWallTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  // Cold pale steel
  ctx.fillStyle = '#4f616d';
  ctx.fillRect(0, 0, size, size);

  // Frost crystal noise
  for (let i = 0; i < 2000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const r = Math.random() * 3;
    ctx.fillStyle = 'rgba(215, 235, 255, 0.35)';
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Panel rivets & seams
  ctx.strokeStyle = '#2b3842';
  ctx.lineWidth = 4;
  ctx.strokeRect(4, 4, size - 8, size - 8);

  return finalizeTexture(canvas, true);
}

/** McDonald's Golden Arches Retro Poster / Neon Wall Sign */
export function createMcDonaldsSignTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 512;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Red background
  ctx.fillStyle = '#9e1b19';
  ctx.fillRect(0, 0, width, height);

  // Distressed dark border
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#420807';
  ctx.strokeRect(8, 8, width - 16, height - 16);

  // Draw Golden Arches 'M'
  ctx.lineWidth = 36;
  ctx.strokeStyle = '#f5b800';
  ctx.lineCap = 'round';

  ctx.beginPath();
  // Left arch
  ctx.arc(175, 260, 90, Math.PI, 0, false);
  ctx.stroke();

  // Right arch
  ctx.beginPath();
  ctx.arc(335, 260, 90, Math.PI, 0, false);
  ctx.stroke();

  // Golden arch bases
  ctx.fillStyle = '#f5b800';
  ctx.fillRect(80, 260, 36, 110);
  ctx.fillRect(240, 260, 36, 110);
  ctx.fillRect(395, 260, 36, 110);

  // Unsettling creepy text overlay
  ctx.fillStyle = '#fce4a6';
  ctx.font = 'bold 36px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.fillText("OVER 99 BILLION SERVED", width / 2, 420);

  // Dirty bloody smudge
  ctx.fillStyle = 'rgba(50, 0, 0, 0.4)';
  ctx.beginPath();
  ctx.arc(280, 220, 45, 0, Math.PI * 2);
  ctx.fill();

  return finalizeTexture(canvas, true);
}

/** Drive-Thru / Emergency Warning Sign */
export function createWarningSignTexture(text: string = 'EMERGENCY EXIT'): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Green emergency or red warning
  const isExit = text.includes('EXIT');
  ctx.fillStyle = isExit ? '#0d5c2e' : '#781515';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, width - 24, height - 24);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, width / 2, height / 2 - 10);

  ctx.font = 'bold 20px monospace';
  ctx.fillText('ALARM WILL SOUND WHEN OPENED', width / 2, height / 2 + 40);

  return finalizeTexture(canvas, true);
}

/** Fuse Box Circuit Panel Texture */
export function createFuseBoxTexture(fusesInstalled: number): THREE.CanvasTexture {
  const width = 256;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#26292b';
  ctx.fillRect(0, 0, width, height);

  ctx.strokeStyle = '#4d5154';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  ctx.fillStyle = '#e0a020';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MAIN 480V BREAKER', width / 2, 35);

  // 3 Fuse slots
  for (let i = 0; i < 3; i++) {
    const x = 50 + i * 78;
    const y = 80;
    // Slot holder
    ctx.fillStyle = '#111314';
    ctx.fillRect(x - 20, y, 40, 110);
    ctx.strokeStyle = '#666';
    ctx.lineWidth = 2;
    ctx.strokeRect(x - 20, y, 40, 110);

    if (i < fusesInstalled) {
      // Installed cylindrical fuse
      ctx.fillStyle = '#d96818'; // Glass/amber ceramic fuse
      ctx.fillRect(x - 14, y + 15, 28, 80);

      // Brass caps
      ctx.fillStyle = '#e6bf55';
      ctx.fillRect(x - 16, y + 5, 32, 16);
      ctx.fillRect(x - 16, y + 89, 32, 16);

      // Glowing active status led
      ctx.fillStyle = '#33ff33';
      ctx.beginPath();
      ctx.arc(x, y + 125, 6, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Empty slot with red led
      ctx.fillStyle = '#ff2222';
      ctx.beginPath();
      ctx.arc(x, y + 125, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return finalizeTexture(canvas, true);
}

/** Wet dark outdoor asphalt */
export function createAsphaltTexture(): THREE.CanvasTexture {
  const size = 512;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#14171a';
  ctx.fillRect(0, 0, size, size);

  // Puddle gloss and gravel noise
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * size;
    const y = Math.random() * size;
    const b = Math.random() > 0.5 ? 40 : 25;
    ctx.fillStyle = `rgba(${b}, ${b + 5}, ${b + 10}, 0.25)`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Yellow parking stall line
  ctx.fillStyle = '#b89d18';
  ctx.fillRect(100, 0, 24, size);

  return finalizeTexture(canvas, true);
}
