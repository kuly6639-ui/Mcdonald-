import * as THREE from 'three';
import { InteractiveItem } from '../types/game';
import {
  create247WindowSignTexture,
  create67ElevenSignTexture,
  createAsphaltTexture,
  createFloorTileTexture,
  createPS1NightMartSignTexture,
} from './textures';
import {
  createCompactCashierCounter,
  createConvenienceCoolerStock,
  createConvenienceSnackRack,
  createNoodlesAndWaterStall,
  createProtagonistCar,
  createStoreClerk,
} from './props';

export interface Store67Area {
  group: THREE.Group;
  interactiveItems: InteractiveItem[];
  clerk: THREE.Group;
  duckCar: THREE.Group;
}

function ps1Mat(params: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    ...params,
    flatShading: true,
    roughness: 0.9,
  });
}

/**
 * Model 5: createLateNightMarket() (alias: buildSixtySevenElevenArea)
 * Extreme Super Low Poly / PS1 Retro Convenience Store & Parking Lot (Z: 134..157).
 * - <= 10 polygons per primitive wall/shelf/counter
 * - flatShading: true & roughness: 0.9 on every lit material
 * - Glowing 64x32 NearestFilter neon signs ("24/7 NIGHT MART", "67-ELEVEN", "OPEN 24/7")
 * - POS register with greenish CRT screen (createPS1CRTGreenTexture)
 * - Shelves stocked with single-box colorful snack/drink items + 5-sided bottles
 */
export function createLateNightMarket(
  addCollision?: (minX: number, maxX: number, minZ: number, maxZ: number, id?: string) => void
): Store67Area {
  const registerCollision = addCollision ?? (() => {});
  const group = new THREE.Group();
  group.name = 'PS1_LateNightMarket';
  // Kept hidden until Duck teleports here after customers finish to save GPU cost during McDonald's shift
  group.visible = false;

  const interactiveItems: InteractiveItem[] = [];

  // Shared PS1 Flat-Shaded Rough Materials
  const tileMat = ps1Mat({ map: createFloorTileTexture(), metalness: 0.05 });
  const asphaltMat = ps1Mat({ map: createAsphaltTexture() });
  const sidewalkMat = ps1Mat({ color: 0x646a72 });
  const wallExtMat = ps1Mat({ color: 0xe6e4dc });
  const wallIntMat = ps1Mat({ color: 0xf4f3ef });
  const roofMat = ps1Mat({ color: 0x1e293b });
  const glassMat = ps1Mat({
    color: 0xa5d8ff,
    transparent: true,
    opacity: 0.34,
  });
  const greenBandMat = ps1Mat({ color: 0x15803d });
  const orangeBandMat = ps1Mat({ color: 0xf97316 });
  const redBandMat = ps1Mat({ color: 0xdc2626 });
  const frameDarkMat = ps1Mat({ color: 0x1f2937 });

  // 1. Exterior Asphalt Parking Lot & Sidewalk Apron (Z: 144..158)
  const asphaltPad = new THREE.Mesh(new THREE.PlaneGeometry(34, 24), asphaltMat);
  asphaltPad.rotation.x = -Math.PI / 2;
  asphaltPad.position.set(0, -0.02, 148);
  asphaltPad.receiveShadow = true;
  group.add(asphaltPad);

  const sidewalk = new THREE.Mesh(new THREE.BoxGeometry(14, 0.08, 3.2), sidewalkMat);
  sidewalk.position.set(0, 0.03, 145.6);
  sidewalk.receiveShadow = true;
  group.add(sidewalk);

  // Parking bay white painted stripes around Duck's car
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xe2e8f0 });
  for (const lx of [2.1, 5.5]) {
    const stripe = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 4.8), lineMat);
    stripe.rotation.x = -Math.PI / 2;
    stripe.position.set(lx, 0.005, 150.2);
    group.add(stripe);
  }

  // 2. Convenience Store Interior Floor & Ceiling (X: -6..6, Z: 134..144)
  const storeFloor = new THREE.Mesh(new THREE.PlaneGeometry(12, 10), tileMat);
  storeFloor.rotation.x = -Math.PI / 2;
  storeFloor.position.set(0, 0.01, 139);
  storeFloor.receiveShadow = true;
  group.add(storeFloor);

  const ceiling = new THREE.Mesh(new THREE.BoxGeometry(12.4, 0.25, 10.4), roofMat);
  ceiling.position.set(0, 3.35, 139);
  group.add(ceiling);

  // 3. Exterior & Interior Walls (X: -6..6, Z: 134..144)
  const backWall = new THREE.Mesh(new THREE.BoxGeometry(12.2, 3.3, 0.22), wallIntMat);
  backWall.position.set(0, 1.65, 134);
  group.add(backWall);

  const leftWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.3, 10.2), wallIntMat);
  leftWall.position.set(-6, 1.65, 139);
  group.add(leftWall);

  const rightWall = new THREE.Mesh(new THREE.BoxGeometry(0.22, 3.3, 10.2), wallIntMat);
  rightWall.position.set(6, 1.65, 139);
  group.add(rightWall);

  // Front Wall Segments & Glass Storefront Windows (Z = 144, open center doorway X: -1.4..1.4)
  const frontLeftWall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.05, 0.2), wallExtMat);
  frontLeftWall.position.set(-3.7, 0.525, 144);
  const frontLeftGlass = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.9, 0.08), glassMat);
  frontLeftGlass.position.set(-3.7, 2.0, 144);
  const frontLeftTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.35, 0.22), wallExtMat);
  frontLeftTop.position.set(-3.7, 3.12, 144);

  const frontRightWall = new THREE.Mesh(new THREE.BoxGeometry(4.6, 1.05, 0.2), wallExtMat);
  frontRightWall.position.set(3.7, 0.525, 144);
  const frontRightGlass = new THREE.Mesh(new THREE.BoxGeometry(4.4, 1.9, 0.08), glassMat);
  frontRightGlass.position.set(3.7, 2.0, 144);
  const frontRightTop = new THREE.Mesh(new THREE.BoxGeometry(4.6, 0.35, 0.22), wallExtMat);
  frontRightTop.position.set(3.7, 3.12, 144);

  const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(2.8, 0.9, 0.24), frameDarkMat);
  doorHeader.position.set(0, 2.85, 144);

  // Open automatic sliding glass panels slid aside so Duck walks freely inside/out
  const openDoorL = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.35, 0.06), glassMat);
  openDoorL.position.set(-1.95, 1.2, 143.92);
  const openDoorR = new THREE.Mesh(new THREE.BoxGeometry(1.15, 2.35, 0.06), glassMat);
  openDoorR.position.set(1.95, 1.2, 143.92);

  // Illuminated "OPEN 24/7" window neon sign hung inside right storefront glass
  const neon247Mat = new THREE.MeshBasicMaterial({ map: create247WindowSignTexture() });
  const neon247Back = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.68, 0.05), frameDarkMat);
  neon247Back.position.set(3.65, 2.05, 143.84);
  const neon247FrontFace = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.6), neon247Mat);
  neon247FrontFace.position.set(3.65, 2.05, 143.875);
  const neon247InsideFace = new THREE.Mesh(new THREE.PlaneGeometry(1.34, 0.6), neon247Mat);
  neon247InsideFace.position.set(3.65, 2.05, 143.805);
  neon247InsideFace.rotation.y = Math.PI;

  // Illuminated "24/7 NIGHT MART" 64x32 pixelated neon marquee hung inside left storefront glass
  const nightMartMat = new THREE.MeshBasicMaterial({ map: createPS1NightMartSignTexture() });
  const nightMartBack = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.78, 0.05), frameDarkMat);
  nightMartBack.position.set(-3.65, 2.05, 143.84);
  const nightMartFront = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 0.7), nightMartMat);
  nightMartFront.position.set(-3.65, 2.05, 143.875);
  const nightMartInside = new THREE.Mesh(new THREE.PlaneGeometry(1.64, 0.7), nightMartMat);
  nightMartInside.position.set(-3.65, 2.05, 143.805);
  nightMartInside.rotation.y = Math.PI;

  group.add(
    frontLeftWall,
    frontLeftGlass,
    frontLeftTop,
    frontRightWall,
    frontRightGlass,
    frontRightTop,
    doorHeader,
    openDoorL,
    openDoorR,
    neon247Back,
    neon247FrontFace,
    neon247InsideFace,
    nightMartBack,
    nightMartFront,
    nightMartInside
  );

  // 4. Illuminated 67-ELEVEN & 24/7 NIGHT MART Rooftop Fascia Sign
  const fasciaGreen = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.28, 0.38), greenBandMat);
  fasciaGreen.position.set(0, 3.52, 144.08);
  const fasciaOrange = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.16, 0.4), orangeBandMat);
  fasciaOrange.position.set(0, 3.74, 144.08);
  const fasciaRed = new THREE.Mesh(new THREE.BoxGeometry(12.5, 0.14, 0.4), redBandMat);
  fasciaRed.position.set(0, 3.89, 144.08);

  const signFaceMat = new THREE.MeshBasicMaterial({ map: create67ElevenSignTexture() });
  const signBox = new THREE.Mesh(new THREE.BoxGeometry(6.2, 1.38, 0.28), frameDarkMat);
  signBox.position.set(0, 4.45, 144.15);
  const signPlaque = new THREE.Mesh(new THREE.PlaneGeometry(5.95, 1.24), signFaceMat);
  signPlaque.position.set(0, 4.45, 144.31);

  const signGlowLight = new THREE.PointLight(0xfff1d6, 1.3, 14);
  signGlowLight.position.set(0, 4.2, 146.5);
  group.add(fasciaGreen, fasciaOrange, fasciaRed, signBox, signPlaque, signGlowLight);

  // 5. Interior Convenience Lighting
  const storeLights: [number, number, number, number][] = [
    [-2.5, 3.05, 139.0, 0.95],
    [2.5, 3.05, 139.0, 0.95],
    [0.0, 3.05, 136.0, 0.85],
    [3.5, 3.8, 150.2, 0.75],
  ];
  storeLights.forEach(([lx, ly, lz, intensity]) => {
    const pt = new THREE.PointLight(0xf8fafc, intensity, 12);
    pt.position.set(lx, ly, lz);
    group.add(pt);
  });

  // Back wall cold beverage cooler display stocked with water & energy drink bottles
  const coolerFrame = new THREE.Mesh(new THREE.BoxGeometry(7.2, 2.35, 0.75), frameDarkMat);
  coolerFrame.position.set(1.2, 1.18, 134.48);
  const coolerBack = new THREE.Mesh(
    new THREE.PlaneGeometry(6.8, 2.05),
    new THREE.MeshBasicMaterial({ color: 0xdbeafe })
  );
  coolerBack.position.set(1.2, 1.2, 134.34);
  const coolerStock = createConvenienceCoolerStock();
  coolerStock.position.set(1.2, 0, 134.62);
  const coolerGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 2.05), glassMat);
  coolerGlass.position.set(1.2, 1.2, 134.92);
  group.add(coolerFrame, coolerBack, coolerStock, coolerGlass);

  // Store Colliders (Walls + Counter + Stalls + Car; world is isolated at Z: 133..157)
  registerCollision(-6.3, -5.7, 133.7, 144.3, 'store67_wall_l');
  registerCollision(5.7, 6.3, 133.7, 144.3, 'store67_wall_r');
  registerCollision(-6.3, 6.3, 133.7, 134.3, 'store67_wall_b');
  registerCollision(-6.3, -1.4, 143.7, 144.3, 'store67_wall_fl');
  registerCollision(1.4, 6.3, 143.7, 144.3, 'store67_wall_fr');
  registerCollision(-9.5, 9.5, 156.2, 157.0, 'store67_lot_south');
  registerCollision(-9.5, -8.8, 143.5, 157.0, 'store67_lot_west');
  registerCollision(8.8, 9.5, 143.5, 157.0, 'store67_lot_east');

  // 6. Checkout Counter (with greenish CRT POS screen) & Store Clerk
  const counter = createCompactCashierCounter(true);
  counter.rotation.y = Math.PI / 2;
  counter.position.set(-2.95, 0, 139.2);
  group.add(counter);
  registerCollision(-4.4, -2.55, 137.4, 141.1, 'store67_counter');

  const clerk = createStoreClerk(0x14532d);
  clerk.position.set(-3.55, 0, 139.2);
  clerk.rotation.y = Math.PI / 2;
  group.add(clerk);

  interactiveItems.push({
    id: 'store_67_cashier',
    type: 'store_67_cashier',
    name: '67-Eleven Employee',
    actionText: 'Pay at Counter ($10)',
    position: [-2.85, 1.35, 139.2],
    radius: 2.9,
  });

  // 7. Row 1 (Target): Noodles, Water & Red Energy Drink Stall
  const noodleStall = createNoodlesAndWaterStall();
  noodleStall.position.set(2.5, 0, 137.6);
  group.add(noodleStall);
  registerCollision(1.35, 3.65, 137.15, 138.05, 'store67_noodle_stall');

  interactiveItems.push({
    id: 'store_67_noodle_stall',
    type: 'store_67_noodle_stall',
    name: 'Noodles & Water Stall',
    actionText: 'Grab Noodles & Red Energy Bottle',
    position: [2.5, 1.15, 137.6],
    radius: 2.7,
  });

  // 7B. Additional Realistic 67-Eleven Convenience Store Merchandise Rows
  const snackRow2 = createConvenienceSnackRack(true);
  snackRow2.position.set(2.5, 0, 140.7);
  group.add(snackRow2);
  registerCollision(1.35, 3.65, 140.25, 141.15, 'store67_snack_row_2');

  const snackRow3 = createConvenienceSnackRack(true);
  snackRow3.rotation.y = Math.PI / 2;
  snackRow3.position.set(5.32, 0, 139.2);
  group.add(snackRow3);
  registerCollision(4.88, 5.76, 138.05, 140.35, 'store67_snack_row_3');

  const snackRow4 = createConvenienceSnackRack(false);
  snackRow4.position.set(-3.8, 0, 142.85);
  group.add(snackRow4);
  registerCollision(-4.95, -2.65, 142.4, 143.3, 'store67_snack_row_4');

  const snackRow5 = createConvenienceSnackRack(false);
  snackRow5.rotation.y = Math.PI / 2;
  snackRow5.position.set(-5.32, 0, 135.9);
  group.add(snackRow5);
  registerCollision(-5.76, -4.88, 134.75, 137.05, 'store67_snack_row_5');

  // 8. Duck's Parked Car outside Late-Night Market
  const duckCar = createProtagonistCar(0x1f4e78);
  duckCar.position.set(3.8, 0, 150.2);
  duckCar.rotation.y = Math.PI;
  group.add(duckCar);
  registerCollision(2.6, 5.0, 147.8, 152.6, 'store67_duck_car');

  interactiveItems.push({
    id: 'store_67_car',
    type: 'store_67_car',
    name: "Duck's Car",
    actionText: 'Get in Car & Drive Home',
    position: [3.8, 1.0, 150.2],
    radius: 3.6,
  });

  return {
    group,
    interactiveItems,
    clerk,
    duckCar,
  };
}

/** Compatibility export for existing world.ts calls */
export const buildSixtySevenElevenArea = createLateNightMarket;
