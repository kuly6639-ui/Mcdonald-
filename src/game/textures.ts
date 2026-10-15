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

/** McDonald's POS Register Touchscreen Interface */
export function createPOSTouchScreenTexture(regNum: number = 1): THREE.CanvasTexture {
  const width = 512;
  const height = 384;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark slate POS background
  ctx.fillStyle = '#181c20';
  ctx.fillRect(0, 0, width, height);

  // Top header bar (Red McDonald's band)
  ctx.fillStyle = '#b31e1c';
  ctx.fillRect(0, 0, width, 48);

  // Golden arches mini M icon
  ctx.strokeStyle = '#f5b800';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(24, 28, 10, Math.PI, 0, false);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(44, 28, 10, Math.PI, 0, false);
  ctx.stroke();

  // Header Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'left';
  ctx.fillText(`MCDONALD'S POS  |  REG 0${regNum}`, 68, 30);

  // Cashier info & status
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'right';
  ctx.fillStyle = '#fce4a6';
  ctx.fillText('CASHIER: DUCK', width - 80, 24);
  ctx.fillStyle = '#4ade80';
  ctx.fillText('● ONLINE', width - 16, 24);

  // Left Receipt Box (Itemized order ticket)
  ctx.fillStyle = '#0f1214';
  ctx.fillRect(16, 60, 210, 250);
  ctx.strokeStyle = '#333b42';
  ctx.lineWidth = 2;
  ctx.strokeRect(16, 60, 210, 250);

  // Receipt items
  ctx.fillStyle = '#a6b4c2';
  ctx.font = '12px monospace';
  ctx.textAlign = 'left';
  ctx.fillText('ORDER #42 - DINE IN', 24, 82);
  ctx.strokeStyle = '#333b42';
  ctx.beginPath();
  ctx.moveTo(24, 90);
  ctx.lineTo(216, 90);
  ctx.stroke();

  ctx.fillStyle = '#e2e8f0';
  ctx.fillText('1x BIG MAC COMBO', 24, 112);
  ctx.fillText('   $8.99', 156, 112);
  ctx.fillText('1x MED FRIES', 24, 132);
  ctx.fillText('   $2.79', 156, 132);
  ctx.fillText('1x COCA-COLA (L)', 24, 152);
  ctx.fillText('   $1.99', 156, 152);
  ctx.fillText('1x APPLE PIE', 24, 172);
  ctx.fillText('   $1.49', 156, 172);

  ctx.beginPath();
  ctx.moveTo(24, 190);
  ctx.lineTo(216, 190);
  ctx.stroke();

  ctx.fillStyle = '#94a3b8';
  ctx.fillText('SUBTOTAL:      $15.26', 24, 212);
  ctx.fillText('TAX (8.25%):    $1.26', 24, 230);
  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 15px monospace';
  ctx.fillText('TOTAL DUE: $16.52', 24, 260);
  ctx.fillStyle = '#4ade80';
  ctx.font = '12px monospace';
  ctx.fillText('STATUS: AWAITING PAYMENT', 24, 290);

  // Right Side Menu Touch Buttons
  const buttons = [
    { label: 'BURGERS', color: '#dc2626' },
    { label: 'CHICKEN', color: '#ea580c' },
    { label: 'FRIES', color: '#d97706' },
    { label: 'BEVERAGES', color: '#0284c7' },
    { label: 'DESSERT', color: '#9333ea' },
    { label: 'HAPPY MEAL', color: '#16a34a' },
  ];

  buttons.forEach((btn, idx) => {
    const col = idx % 2;
    const row = Math.floor(idx / 2);
    const bx = 240 + col * 128;
    const by = 60 + row * 80;

    // Button background
    ctx.fillStyle = btn.color;
    ctx.fillRect(bx, by, 118, 70);

    // Bevel highlights
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fillRect(bx, by, 118, 4);
    ctx.fillRect(bx, by, 4, 70);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(bx, by + 66, 118, 4);
    ctx.fillRect(bx + 114, by, 4, 70);

    // Label
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 14px monospace';
    ctx.textAlign = 'center';
    ctx.fillText(btn.label, bx + 59, by + 42);
  });

  // Bottom action bar
  ctx.fillStyle = '#22c55e';
  ctx.fillRect(16, 324, 150, 48);
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('EXACT CASH', 91, 354);

  ctx.fillStyle = '#3b82f6';
  ctx.fillRect(180, 324, 150, 48);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('CREDIT / CHIP', 255, 354);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(344, 324, 150, 48);
  ctx.fillStyle = '#ffffff';
  ctx.fillText('STORE #0412', 419, 354);

  return finalizeTexture(canvas, true);
}

/** Customer-Facing VFD Pole Display Texture */
export function createCustomerPoleDisplayTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 128;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Deep dark vacuum fluorescent display glass
  ctx.fillStyle = '#061309';
  ctx.fillRect(0, 0, width, height);

  // Outer bezel frame
  ctx.strokeStyle = '#0e2413';
  ctx.lineWidth = 6;
  ctx.strokeRect(6, 6, width - 12, height - 12);

  // Fluorescent green VFD glow text
  ctx.fillStyle = '#00ff66';
  ctx.shadowColor = '#00ff66';
  ctx.shadowBlur = 10;
  ctx.font = 'bold 32px "Courier New", monospace';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('WELCOME TO McDONALD\'S', width / 2, 42);

  ctx.font = 'bold 28px "Courier New", monospace';
  ctx.fillStyle = '#33ff88';
  ctx.fillText('TOTAL DUE:     $16.52', width / 2, 88);

  return finalizeTexture(canvas, true);
}

/** Biometric / Digital Time Attendance Machine LCD Screen */
export function createTimeAttendanceScreenTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 256;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // High contrast backlit terminal glass
  ctx.fillStyle = '#0a1622';
  ctx.fillRect(0, 0, width, height);

  // Subtle grid raster lines
  ctx.strokeStyle = 'rgba(0, 200, 255, 0.08)';
  ctx.lineWidth = 1;
  for (let y = 0; y < height; y += 8) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.stroke();
  }

  // Header banner
  ctx.fillStyle = '#0f2942';
  ctx.fillRect(0, 0, width, 44);
  ctx.fillStyle = '#38bdf8';
  ctx.font = 'bold 18px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('MCDONALD\'S TIME & ATTENDANCE SYSTEM', width / 2, 28);

  // Digital clock
  ctx.fillStyle = '#00ffcc';
  ctx.shadowColor = '#00ffcc';
  ctx.shadowBlur = 8;
  ctx.font = 'bold 44px "Courier New", monospace';
  ctx.fillText('00:00:00 AM', width / 2, 98);
  ctx.shadowBlur = 0;

  // Active shift & Employee badge info
  ctx.fillStyle = '#e2e8f0';
  ctx.font = 'bold 20px monospace';
  ctx.fillText('OVERNIGHT CLOSING SHIFT', width / 2, 136);

  ctx.fillStyle = '#fbbf24';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('EMP: DUCK  (ID #0412)', width / 2, 172);

  // Interaction prompt
  ctx.fillStyle = '#4ade80';
  ctx.font = 'bold 18px monospace';
  ctx.fillText('>> PRESS [E] TO CLOCK IN <<', width / 2, 214);

  // Status footer
  ctx.fillStyle = '#64748b';
  ctx.font = '12px monospace';
  ctx.fillText('READER: READY  |  BIOMETRIC SCANNER: ACTIVE', width / 2, 242);

  return finalizeTexture(canvas, true);
}

/** CCTV Multi-Camera Surveillance Monitor Screen Texture */
export function createComputerCCTVScreenTexture(): THREE.CanvasTexture {
  const width = 512;
  const height = 384;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // Dark surveillance CRT green
  ctx.fillStyle = '#06160b';
  ctx.fillRect(0, 0, width, height);

  // 4 camera quadrant grid lines
  ctx.strokeStyle = '#1a4f2b';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(width / 2, 0);
  ctx.lineTo(width / 2, height);
  ctx.moveTo(0, height / 2);
  ctx.lineTo(width, height / 2);
  ctx.stroke();

  // CRT scanlines
  for (let y = 0; y < height; y += 4) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
    ctx.fillRect(0, y, width, 2);
  }

  // Camera feeds labels
  const cams = [
    { name: 'CAM 01: FRONT ENTRANCE', x: 16, y: 32 },
    { name: 'CAM 02: CASHIER LOBBY', x: 272, y: 32 },
    { name: 'CAM 03: DRIVE-THRU', x: 16, y: 224 },
    { name: 'CAM 04: BACK DUMPSTER', x: 272, y: 224 },
  ];

  cams.forEach((cam) => {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(cam.x - 6, cam.y - 18, 220, 24);

    ctx.fillStyle = '#00ff66';
    ctx.font = 'bold 13px monospace';
    ctx.textAlign = 'left';
    ctx.fillText(cam.name, cam.x, cam.y);

    // Blinking REC dot
    ctx.fillStyle = '#ff2222';
    ctx.beginPath();
    ctx.arc(cam.x + 195, cam.y - 4, 4, 0, Math.PI * 2);
    ctx.fill();
  });

  // Center console watermark
  ctx.fillStyle = '#00ff66';
  ctx.font = 'bold 14px monospace';
  ctx.textAlign = 'center';
  ctx.fillText('SECURITY MONITORING CONSOLE - LIVE FEED', width / 2, height / 2 + 6);

  return finalizeTexture(canvas, true);
}

