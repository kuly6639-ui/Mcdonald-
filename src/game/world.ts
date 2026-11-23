import * as THREE from 'three';
import {
  TextureLibrary,
  createFloorTileTexture,
  createFreezerWallTexture,
  createMcDonaldsSignTexture,
  createAsphaltTexture,
  createMcDonaldsEntranceSignTexture,
  createMcDonaldsAdPosterTexture,
} from './textures';
import { populateSurroundingForest } from './forest';
import {
  createCompactCashierCounter,
  createTimeClockPunch,
  createOutdoorDumpster,
  createRearServiceDoor,
  createSlidingGlassDoors,
  createCardboardBundle,
  createDiningBooth,
  createKitchenCounter,
  createDeepFryer,
  createCommercialCoffeeMachine,
  createSoftDrinkDispenser,
  createFriedChickenVendingMachine,
  createKitchenMicrowave,
  createFoodPrepTableItems,
  createFriedChickenBucket,
  createSecurityOfficeDesk,
  createLocker,
  createFreezerShelves,
  createTableMess,
  createTrashBag,
  createClipboardProp,
  createHallwayPuddle,
  createDetailedCar,
  createMopAndBucket,
  createDriveThruOrderStation,
  createEmployeeJohn,
  createElectricalBox,
  createWelcomingClownStatue,
  createWarehouseSupplyRack,
  createRestroomToiletStall,
  createRestroomSinkAndMirror,
  createRestroomDoorSign,
  createIndoorTrashBin,
  createFreezerChickenTrayPickup,
  createDriveThruExteriorRig,
  createPS1Billboard,
  createPS1WallAdPoster,
} from './props';
import { buildSixtySevenElevenArea } from './store67';
import { InteractiveItem } from '../types/game';

export interface CollisionBox {
  id?: string;
  enabled?: boolean;
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export interface FlickeringLight {
  light: THREE.PointLight;
  baseIntensity: number;
  flickerRate: number;
}

export interface StoreLightEntry {
  light: THREE.PointLight;
  baseIntensity: number;
}

export interface StoreSignMaterialEntry {
  mat: THREE.MeshBasicMaterial;
  onColor: number;
}

export interface ParkingSpot {
  index: number;
  position: THREE.Vector3;
  rotationY: number;
  isOccupied: boolean;
}

export interface RestaurantWorld {
  scene: THREE.Group;
  collisionBoxes: CollisionBox[];
  interactiveItems: InteractiveItem[];
  interactiveMeshes: Map<string, THREE.Object3D>;
  flickeringLights: FlickeringLight[];
  storeLights: StoreLightEntry[];
  storeSignMaterials: StoreSignMaterialEntry[];
  hemiLight: THREE.HemisphereLight;
  electricalBox: {
    group: THREE.Group;
    lever: THREE.Group;
    statusLedMat: THREE.MeshBasicMaterial;
    beaconLight: THREE.PointLight;
  };
  cctvCameras: { id: number; name: string; position: THREE.Vector3; lookAt: THREE.Vector3 }[];
  cameraScreens: THREE.Mesh[];
  rainSystem: THREE.Points;
  parkingSpots: ParkingSpot[];
  slidingDoors: {
    group: THREE.Group;
    leftGlass: THREE.Mesh;
    rightGlass: THREE.Mesh;
  };
  rearDoor: {
    group: THREE.Group;
    doorLeaf: THREE.Mesh;
  };
  kitchenLight: THREE.PointLight;
  employeeJohn: THREE.Group;
  clownStatue: THREE.Group;
  fryerMachine: THREE.Group;
  kitchenMicrowave: THREE.Group;
  coffeeMachine: THREE.Group;
  sodaDispenser: THREE.Group;
  duckCar: THREE.Group;
  wallMeshes: THREE.Mesh[];
  mopInBucket: THREE.Object3D | null;
  store67Group: THREE.Group;
  store67Clerk: THREE.Group;
}

export function buildCompactRestaurantWorld(): RestaurantWorld {
  const root = new THREE.Group();
  const collisionBoxes: CollisionBox[] = [];
  const interactiveItems: InteractiveItem[] = [];
  const interactiveMeshes = new Map<string, THREE.Object3D>();
  const flickeringLights: FlickeringLight[] = [];
  const storeLights: StoreLightEntry[] = [];
  const storeSignMaterials: StoreSignMaterialEntry[] = [];
  const cameraScreens: THREE.Mesh[] = [];
  const wallMeshes: THREE.Mesh[] = [];

  const addCollision = (
    minX: number,
    maxX: number,
    minZ: number,
    maxZ: number,
    id?: string
  ) => {
    collisionBoxes.push({
      id,
      enabled: true,
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
    });
  };

  // --- TEXTURES & MATERIALS ---
  const floorTex = createFloorTileTexture().clone();
  floorTex.repeat.set(6, 4);
  floorTex.needsUpdate = true;
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.05,
  });

  const wallTex = TextureLibrary.getFastFoodWallTexture().clone();
  wallTex.repeat.set(3, 1);
  wallTex.needsUpdate = true;
  const wallMat = new THREE.MeshStandardMaterial({
    map: wallTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
  });

  const ceilingTex = TextureLibrary.getCeilingTileTexture().clone();
  ceilingTex.repeat.set(7, 4);
  ceilingTex.needsUpdate = true;
  const ceilingMat = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    flatShading: true,
    roughness: 0.9,
  });

  const asphaltTex = createAsphaltTexture().clone();
  asphaltTex.repeat.set(14, 9);
  asphaltTex.needsUpdate = true;
  const asphaltMat = new THREE.MeshStandardMaterial({
    map: asphaltTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.1,
  });

  const sidewalkTex = TextureLibrary.getSidewalkTexture().clone();
  sidewalkTex.repeat.set(9, 3);
  sidewalkTex.needsUpdate = true;
  const sidewalkMat = new THREE.MeshStandardMaterial({
    map: sidewalkTex,
    flatShading: true,
    roughness: 0.9,
  });

  const glassMat = new THREE.MeshStandardMaterial({
    map: TextureLibrary.getGlassSmudgeTexture(),
    color: 0x7090a0,
    flatShading: true,
    roughness: 0.85,
    transparent: true,
    opacity: 0.45,
  });

  // Helper for solid walls with collision
  const createWall = (
    w: number,
    h: number,
    d: number,
    x: number,
    y: number,
    z: number,
    mat: THREE.Material = wallMat,
    hasCollision: boolean = true
  ) => {
    const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), mat);
    mesh.position.set(x, y, z);
    mesh.castShadow = false;
    mesh.receiveShadow = false;
    mesh.updateMatrix();
    mesh.matrixAutoUpdate = false;
    root.add(mesh);
    if (h >= 2.5) {
      wallMeshes.push(mesh);
    }
    if (hasCollision) {
      addCollision(x - w / 2 - 0.2, x + w / 2 + 0.2, z - d / 2 - 0.2, z + d / 2 + 0.2);
    }
    return mesh;
  };

  // --- 1. EXPANDED BUILDING (20m wide: X: -12 to +8, 12m deep: Z: -6 to +6) ---
  // Floor: X: -12 to 8 (centered at X = -2)
  floorTex.repeat.set(7.5, 5);
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(-2, 0, 0);
  floorMesh.receiveShadow = false;
  root.add(floorMesh);

  // Cool Slate Restroom Tile Overlay (X: -12 to -8, Z: 0 to 6)
  const restroomTileTex = TextureLibrary.getRestroomTileTexture().clone();
  restroomTileTex.repeat.set(3, 4);
  restroomTileTex.needsUpdate = true;
  const restroomTileMat = new THREE.MeshStandardMaterial({
    map: restroomTileTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.05,
  });
  const restroomFloor = new THREE.Mesh(new THREE.PlaneGeometry(4, 6), restroomTileMat);
  restroomFloor.rotation.x = -Math.PI / 2;
  restroomFloor.position.set(-10, 0.004, 3);
  restroomFloor.receiveShadow = false;
  root.add(restroomFloor);

  // --- 1. BUILDING STRUCTURE & EXTERIOR ROOF ---
  // Interior Ceiling
  const ceilingMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 12), ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(-2, 3.2, 0);
  root.add(ceilingMesh);

  // Exterior Tar & Gravel Roof Deck Slab (20.6m wide x 12.6m deep)
  const tarRoofTex = TextureLibrary.getTarRoofTexture().clone();
  tarRoofTex.repeat.set(8, 5);
  tarRoofTex.needsUpdate = true;
  const roofDeckMat = new THREE.MeshStandardMaterial({
    map: tarRoofTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.05,
  });
  const roofDeck = new THREE.Mesh(new THREE.BoxGeometry(20.6, 0.28, 12.6), roofDeckMat);
  roofDeck.position.set(-2, 3.34, 0);
  roofDeck.receiveShadow = false;
  root.add(roofDeck);

  // Roof Parapet Walls & Metal Coping
  const parapetMat = new THREE.MeshStandardMaterial({
    map: TextureLibrary.getStainlessSteelTexture(false),
    color: 0x383e45,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.15,
  });
  const parapetN = new THREE.Mesh(new THREE.BoxGeometry(20.6, 0.45, 0.32), parapetMat);
  parapetN.position.set(-2, 3.65, 6.16);
  const parapetS = new THREE.Mesh(new THREE.BoxGeometry(20.6, 0.45, 0.32), parapetMat);
  parapetS.position.set(-2, 3.65, -6.16);
  const parapetW = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 12.6), parapetMat);
  parapetW.position.set(-12.16, 3.65, 0);
  const parapetE = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 12.6), parapetMat);
  parapetE.position.set(8.16, 3.65, 0);
  root.add(parapetN, parapetS, parapetW, parapetE);

  // Classic McDonald's Crimson Mansard Roof Facade Overhang (Angled front roof canopy)
  const mansardTex = TextureLibrary.getMansardRoofTexture().clone();
  mansardTex.repeat.set(8, 1);
  mansardTex.needsUpdate = true;
  const mansardMat = new THREE.MeshStandardMaterial({
    map: mansardTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.1,
  });
  const frontMansard = new THREE.Mesh(new THREE.BoxGeometry(20.8, 0.95, 0.45), mansardMat);
  frontMansard.position.set(-2, 3.9, 6.25);
  frontMansard.rotation.x = 0.25; // Sloped down towards street
  root.add(frontMansard);

  // Front Entrance Protective Canopy Marquee over sliding doors
  const canopyMat = new THREE.MeshStandardMaterial({
    color: 0x1f2327,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.25,
  });
  const entranceCanopy = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.18, 1.8), canopyMat);
  entranceCanopy.position.set(0, 3.12, 6.9);
  root.add(entranceCanopy);

  // Canopy Steel Diagonal Support Struts (5-sided <= 7 faces)
  const strutMat = new THREE.MeshStandardMaterial({
    color: 0x111111,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.3,
  });
  const strutL = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 5, 1), strutMat);
  strutL.position.set(-2.4, 3.65, 6.8);
  strutL.rotation.x = 0.55;
  const strutR = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 1.6, 5, 1), strutMat);
  strutR.position.set(2.4, 3.65, 6.8);
  strutR.rotation.x = 0.55;
  root.add(strutL, strutR);

  // Commercial Industrial Rooftop HVAC Unit (Steel condenser unit on roof deck)
  const hvacGroup = new THREE.Group();
  hvacGroup.position.set(2.5, 3.48, -1.5);
  const hvacMat = new THREE.MeshStandardMaterial({
    map: TextureLibrary.getStainlessSteelTexture(true),
    flatShading: true,
    roughness: 0.9,
    metalness: 0.3,
  });
  const hvacBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 1.8), hvacMat);
  hvacBody.position.y = 0.68;
  hvacGroup.add(hvacBody);

  // Dual Rooftop Fans (5-sided <= 7 faces)
  const fanMat = new THREE.MeshStandardMaterial({
    color: 0x222222,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.35,
  });
  const fan1 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.15, 5, 1), fanMat);
  fan1.position.set(-0.6, 1.42, 0);
  const fan2 = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.45, 0.15, 5, 1), fanMat);
  fan2.position.set(0.6, 1.42, 0);
  hvacGroup.add(fan1, fan2);

  // HVAC Exhaust Vent Pipe (5-sided <= 7 faces)
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 1.8, 5, 1), hvacMat);
  pipe.position.set(-1.4, 0.9, 0.5);
  pipe.rotation.z = 0.2;
  hvacGroup.add(pipe);
  root.add(hvacGroup);

  // --- ILLUMINATED McDONALD'S SIGNBOARD OUTSIDE THE FRONT DOOR ---
  const signMat = new THREE.MeshBasicMaterial({
    map: createMcDonaldsEntranceSignTexture(),
  });
  storeSignMaterials.push({ mat: signMat, onColor: 0xffffff });
  const entranceSign = new THREE.Mesh(new THREE.BoxGeometry(7.6, 1.35, 0.18), signMat);
  entranceSign.position.set(0, 3.75, 6.42);
  root.add(entranceSign);

  // Warm Golden Entrance Neon Light casting glow onto the sidewalk and doors
  const entranceSignLight = new THREE.PointLight(0xffbe26, 1.75, 13);
  entranceSignLight.position.set(0, 3.3, 7.2);
  root.add(entranceSignLight);
  flickeringLights.push({ light: entranceSignLight, baseIntensity: 1.75, flickerRate: 0.05 });
  storeLights.push({ light: entranceSignLight, baseIntensity: 1.75 });

  // --- OUTDOOR McDONALD'S ADVERTISEMENTS FLANKING THE STOREFRONT PIERS ---
  // 1. Big Mac Promotional Lightbox Poster (Mounted on solid West front pier)
  const adBigMacMat = new THREE.MeshBasicMaterial({
    map: createMcDonaldsAdPosterTexture('bigmac'),
  });
  storeSignMaterials.push({ mat: adBigMacMat, onColor: 0xffffff });
  const adBigMacFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.25, 1.85, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x18181b, flatShading: true, roughness: 0.9 })
  );
  adBigMacFrame.position.set(-7.65, 1.75, 6.18);
  const adBigMacFace = new THREE.Mesh(new THREE.PlaneGeometry(1.15, 1.75), adBigMacMat);
  adBigMacFace.position.set(-7.65, 1.75, 6.23);
  root.add(adBigMacFrame, adBigMacFace);

  const adLightL = new THREE.PointLight(0xfff5e0, 0.65, 4.2);
  adLightL.position.set(-7.65, 2.5, 6.55);
  root.add(adLightL);
  storeLights.push({ light: adLightL, baseIntensity: 0.65 });

  // 2. World Famous Fries Promotional Lightbox Poster (Mounted on solid East front pier)
  const adFriesMat = new THREE.MeshBasicMaterial({
    map: createMcDonaldsAdPosterTexture('fries'),
  });
  storeSignMaterials.push({ mat: adFriesMat, onColor: 0xffffff });
  const adFriesFrame = new THREE.Mesh(
    new THREE.BoxGeometry(0.98, 1.65, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x18181b, flatShading: true, roughness: 0.9 })
  );
  adFriesFrame.position.set(7.44, 1.75, 6.18);
  const adFriesFace = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 1.55), adFriesMat);
  adFriesFace.position.set(7.44, 1.75, 6.23);
  root.add(adFriesFrame, adFriesFace);

  const adLightR = new THREE.PointLight(0xfff5e0, 0.65, 4.2);
  adLightR.position.set(7.44, 2.5, 6.55);
  root.add(adLightR);
  storeLights.push({ light: adLightR, baseIntensity: 0.65 });

  // 3. Freestanding Promotional Sidewalk A-Frame Sign (Grimace Shake Promo)
  const aFrameGroup = new THREE.Group();
  aFrameGroup.position.set(-3.6, 0, 7.6);
  aFrameGroup.rotation.y = 0.25;
  const adGrimaceMat = new THREE.MeshBasicMaterial({
    map: createMcDonaldsAdPosterTexture('grimace'),
  });
  storeSignMaterials.push({ mat: adGrimaceMat, onColor: 0xffffff });
  const aFrameBoard1 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.04), adGrimaceMat);
  aFrameBoard1.position.set(0, 0.58, 0.12);
  aFrameBoard1.rotation.x = -0.18;
  const aFrameBoard2 = new THREE.Mesh(new THREE.BoxGeometry(0.75, 1.1, 0.04), adGrimaceMat);
  aFrameBoard2.position.set(0, 0.58, -0.12);
  aFrameBoard2.rotation.x = 0.18;
  aFrameGroup.add(aFrameBoard1, aFrameBoard2);
  root.add(aFrameGroup);
  addCollision(-4.1, -3.1, 7.1, 8.1);

  // Exterior West Wall (Expanded to X = -12 to house Restroom wing + frosted exterior transom window)
  createWall(0.3, 3.2, 8.1, -12, 1.6, -1.95); // South-to-restroom section (Z: -6 to +2.1)
  createWall(0.3, 3.2, 2.1, -12, 1.6, 4.95); // North restroom corner section (Z: +3.9 to +6)
  createWall(0.3, 1.85, 1.8, -12, 0.925, 3.0); // Wall below frosted restroom window
  createWall(0.3, 0.65, 1.8, -12, 2.875, 3.0, wallMat, false); // Wall above frosted restroom window

  const restroomFrostGlass = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.7, 1.72),
    new THREE.MeshStandardMaterial({
      map: TextureLibrary.getGlassSmudgeTexture(),
      color: 0xc2d8e4,
      transparent: true,
      opacity: 0.48,
      flatShading: true,
      roughness: 0.9,
      depthWrite: false,
    })
  );
  restroomFrostGlass.position.set(-12, 2.2, 3.0);
  const restroomWinFrameMat = new THREE.MeshStandardMaterial({
    color: 0x1b1e22,
    flatShading: true,
    roughness: 0.9,
  });
  const rwTop = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.06, 1.84), restroomWinFrameMat);
  rwTop.position.set(-12, 2.55, 3.0);
  const rwBot = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 1.84), restroomWinFrameMat);
  rwBot.position.set(-12, 1.85, 3.0);
  const rwJambN = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.72, 0.07), restroomWinFrameMat);
  rwJambN.position.set(-12, 2.2, 3.88);
  const rwJambS = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.72, 0.07), restroomWinFrameMat);
  rwJambS.position.set(-12, 2.2, 2.12);
  root.add(restroomFrostGlass, rwTop, rwBot, rwJambN, rwJambS);

  // Exterior East Wall (X = 8, with Drive-Thru Service Window)
  createWall(0.3, 3.2, 5.0, 8, 1.6, 3.5); // East front segment
  createWall(0.3, 3.2, 5.0, 8, 1.6, -3.5); // East rear segment
  createWall(0.3, 0.8, 2.0, 8, 0.4, 0); // Wall under drive-thru window
  createWall(0.3, 0.8, 2.0, 8, 2.8, 0); // Wall above drive-thru window

  // --- TRANSPARENT DRIVE-THRU SERVICE WINDOW (X = 8.0, Z = 0) ---
  const dtWindowFrameMat = new THREE.MeshStandardMaterial({
    color: 0x1f2328,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.25,
  });
  const dtClearGlassMat = new THREE.MeshStandardMaterial({
    color: 0xaad4e6,
    transparent: true,
    opacity: 0.20,
    flatShading: true,
    roughness: 0.9,
    depthWrite: false,
  });

  // 4-sided perimeter aluminum frame (leaves center genuinely open & see-through)
  const dtTopBar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 2.04), dtWindowFrameMat);
  dtTopBar.position.set(8.0, 2.38, 0);
  const dtBotBar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 2.04), dtWindowFrameMat);
  dtBotBar.position.set(8.0, 0.82, 0);
  const dtJambN = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.64, 0.08), dtWindowFrameMat);
  dtJambN.position.set(8.0, 1.6, 0.98);
  const dtJambS = new THREE.Mesh(new THREE.BoxGeometry(0.34, 1.64, 0.08), dtWindowFrameMat);
  dtJambS.position.set(8.0, 1.6, -0.98);
  const dtCenterMullion = new THREE.Mesh(new THREE.BoxGeometry(0.08, 1.52, 0.05), dtWindowFrameMat);
  dtCenterMullion.position.set(8.0, 1.6, 0.0);

  // Transparent glass pane (left half closed glass, right half clear service pass-through)
  const dtGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.48, 0.96), dtClearGlassMat);
  dtGlass.position.set(8.0, 1.6, -0.48);
  const dtSlideGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, 1.48, 0.96), dtClearGlassMat);
  dtSlideGlass.position.set(7.96, 1.6, 0.25);

  // Stainless steel customer service ledge (inside & outside pass-through counter)
  const dtLedge = new THREE.Mesh(
    new THREE.BoxGeometry(0.88, 0.07, 1.88),
    new THREE.MeshStandardMaterial({
      map: TextureLibrary.getStainlessSteelTexture(false),
      flatShading: true,
      roughness: 0.9,
      metalness: 0.25,
    })
  );
  dtLedge.position.set(8.08, 0.84, 0);
  root.add(dtTopBar, dtBotBar, dtJambN, dtJambS, dtCenterMullion, dtGlass, dtSlideGlass, dtLedge);

  // Exterior Drive-Thru Canopy, Menu Board & Overhead Window Light
  const dtExteriorRig = createDriveThruExteriorRig();
  dtExteriorRig.position.set(8.0, 0, 0);
  root.add(dtExteriorRig);

  const dtWindowLightOut = new THREE.PointLight(0xfff0cc, 0.9, 6.5);
  dtWindowLightOut.position.set(9.1, 2.55, 0);
  root.add(dtWindowLightOut);
  storeLights.push({ light: dtWindowLightOut, baseIntensity: 0.9 });

  const dtWindowLightIn = new THREE.PointLight(0xfff5e0, 0.52, 4.5);
  dtWindowLightIn.position.set(7.35, 2.35, 0);
  root.add(dtWindowLightIn);
  storeLights.push({ light: dtWindowLightIn, baseIntensity: 0.52 });

  interactiveItems.push({
    id: 'drive_thru_window',
    type: 'drive_thru_window',
    name: 'Drive-Thru Service Window',
    actionText: 'Inspect Drive-Thru Service Window',
    position: [7.4, 1.35, 0],
    radius: 2.1,
  });

  // Exterior South Wall (Z = -6, extending from X = -12 to +8 with doorway at X = 4.0)
  createWall(15.4, 3.2, 0.3, -4.3, 1.6, -6); // X: -12.0 to +3.4
  createWall(3.4, 3.2, 0.3, 6.3, 1.6, -6); // X: +4.6 to +8.0
  createWall(1.2, 0.85, 0.3, 4.0, 2.775, -6, wallMat, false); // Wall header above rear service door

  // Exterior North Wall (Z = 6, extending from X = -12 to +8 with full open Storefront Windows + Sliding Doors at X = 0)
  createWall(5.15, 3.2, 0.3, -9.425, 1.6, 6); // West corner pier (X: -12.0 to -6.85)
  createWall(4.7, 0.4, 0.3, -4.5, 0.2, 6, wallMat, true); // Sill wall below West storefront window
  createWall(4.7, 0.5, 0.3, -4.5, 2.95, 6, wallMat, false); // Header wall above West storefront window
  addCollision(-6.85, -2.15, 5.7, 6.3, 'window_l_glass');

  createWall(0.65, 3.2, 0.3, -1.825, 1.6, 6); // Left entrance pier (X: -2.15 to -1.5)
  createWall(3.0, 0.45, 0.3, 0, 2.975, 6, wallMat, false); // Doorway header above front sliding doors
  createWall(0.65, 3.2, 0.3, 1.825, 1.6, 6); // Right entrance pier (X: 1.5 to 2.15)

  createWall(4.7, 0.4, 0.3, 4.5, 0.2, 6, wallMat, true); // Sill wall below East storefront window
  createWall(4.7, 0.5, 0.3, 4.5, 2.95, 6, wallMat, false); // Header wall above East storefront window
  addCollision(2.15, 6.85, 5.7, 6.3, 'window_r_glass');

  createWall(1.15, 3.2, 0.3, 7.425, 1.6, 6); // East corner pier (X: 6.85 to 8.0)

  // --- LARGE ARCHITECTURAL STOREFRONT WINDOWS WITH ALUMINUM FRAMES & SILLS ---
  const windowFrameMat = new THREE.MeshStandardMaterial({
    color: 0x1b1e22,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.25,
  });

  const createWindowAssembly = (xCenter: number) => {
    const wGroup = new THREE.Group();
    wGroup.position.set(xCenter, 1.55, 6.0);

    // Main clear see-through glass panel (matching exterior storefront opening Y: 0.4..2.7)
    const winGlassMat = new THREE.MeshStandardMaterial({
      map: TextureLibrary.getGlassSmudgeTexture(),
      color: 0x9fc4d8,
      transparent: true,
      opacity: 0.22,
      flatShading: true,
      roughness: 0.9,
      depthWrite: false,
      side: THREE.DoubleSide,
    });
    const glassPane = new THREE.Mesh(new THREE.BoxGeometry(4.7, 2.3, 0.05), winGlassMat);
    wGroup.add(glassPane);

    // Exterior aluminum surrounding frame
    const topBar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.09, 0.28), windowFrameMat);
    topBar.position.y = 1.15;
    const bottomBar = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.09, 0.28), windowFrameMat);
    bottomBar.position.y = -1.15;
    const leftPost = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.3, 0.28), windowFrameMat);
    leftPost.position.x = -2.35;
    const rightPost = new THREE.Mesh(new THREE.BoxGeometry(0.09, 2.3, 0.28), windowFrameMat);
    rightPost.position.x = 2.35;

    // Horizontal Transom Divider
    const transom = new THREE.Mesh(new THREE.BoxGeometry(4.7, 0.07, 0.14), windowFrameMat);
    transom.position.y = 0.45;

    // Vertical Mullions (dividing into 3 large storefront glass panes)
    const mullion1 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.3, 0.14), windowFrameMat);
    mullion1.position.x = -0.78;
    const mullion2 = new THREE.Mesh(new THREE.BoxGeometry(0.07, 2.3, 0.14), windowFrameMat);
    mullion2.position.x = 0.78;

    // Exterior & interior window sill ledge
    const sill = new THREE.Mesh(
      new THREE.BoxGeometry(4.9, 0.12, 0.36),
      new THREE.MeshStandardMaterial({ color: 0x474d54, flatShading: true, roughness: 0.9 })
    );
    sill.position.set(0, -1.16, 0.06);

    wGroup.add(topBar, bottomBar, leftPost, rightPost, transom, mullion1, mullion2, sill);
    return wGroup;
  };

  const windowL = createWindowAssembly(-4.5);
  const windowR = createWindowAssembly(4.5);
  root.add(windowL, windowR);

  // Interior Entrance Wall Fixture Light (just above-right of front door inside lobby)
  const lobbyDoorLampHousing = new THREE.Mesh(
    new THREE.BoxGeometry(0.16, 0.16, 0.08),
    new THREE.MeshStandardMaterial({ color: 0x22262b, flatShading: true, roughness: 0.9 })
  );
  lobbyDoorLampHousing.position.set(1.62, 2.48, 5.82);
  const lobbyDoorLampBulb = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, 0.1, 0.04),
    new THREE.MeshBasicMaterial({ color: 0xe6f6ff })
  );
  lobbyDoorLampBulb.position.set(1.62, 2.48, 5.77);
  root.add(lobbyDoorLampHousing, lobbyDoorLampBulb);

  const lobbyDoorWallLight = new THREE.PointLight(0xd9f2ff, 0.55, 5.0);
  lobbyDoorWallLight.position.set(1.62, 2.45, 5.5);
  root.add(lobbyDoorWallLight);
  storeLights.push({ light: lobbyDoorWallLight, baseIntensity: 0.55 });

  // --- AUTOMATIC FRONT SLIDING GLASS DOORS (X = 0, Z = 6) ---
  const slidingDoors = createSlidingGlassDoors();
  slidingDoors.group.position.set(0, 0, 6.0);
  root.add(slidingDoors.group);

  // Front door interaction point for 6:00 AM shift clockout
  interactiveItems.push({
    id: 'front_door_exit',
    type: 'front_door_exit',
    name: 'Front Exit Doors',
    actionText: 'Clock Out & Exit Restaurant (Available at 6:00 AM)',
    position: [0, 1.2, 5.2],
    radius: 2.2,
  });

  // --- REAR SERVICE DOOR (X = 4, Z = -6) ---
  const rearDoor = createRearServiceDoor();
  rearDoor.group.position.set(4, 0, -6.0);
  root.add(rearDoor.group);

  // --- 2. OUTDOOR REAR TRASH & SERVICE AREA (South: Z = -6 to -14, X: -12 to +8) ---
  const rearPadMesh = new THREE.Mesh(new THREE.PlaneGeometry(20, 8), sidewalkMat);
  rearPadMesh.rotation.x = -Math.PI / 2;
  rearPadMesh.position.set(-2, -0.01, -10);
  rearPadMesh.receiveShadow = false;
  root.add(rearPadMesh);

  // Rear boundary wall/fence (leave dark back-west corner service gap at Z: -11.4 to -14 for clown escape)
  createWall(20, 2.8, 0.3, -2, 1.4, -14);
  createWall(0.3, 2.8, 5.4, -12, 1.4, -8.7);
  addCollision(-12.35, -11.65, -14.2, -11.2); // Invisible boundary keeping player in yard while clown can bolt through gap
  createWall(0.3, 2.8, 8, 8, 1.4, -10);

  // Exterior Main Electrical Circuit Breaker Box (mounted on back wall behind the shop)
  const electricalBox = createElectricalBox();
  electricalBox.group.position.set(1.6, 0, -6.16);
  electricalBox.group.rotation.y = Math.PI;
  root.add(electricalBox.group);
  addCollision(1.1, 2.1, -6.5, -6.0);

  interactiveItems.push({
    id: 'electrical_box',
    type: 'electrical_box',
    name: 'Exterior Electrical Breaker Box',
    actionText: 'Inspect Electrical Box & Restore Power',
    position: [1.6, 1.35, -6.4],
    radius: 2.3,
  });

  // Outdoor Heavy Green Dumpster at X = 4, Z = -9.5
  const dumpster = createOutdoorDumpster();
  dumpster.position.set(4, 0, -9.5);
  root.add(dumpster);
  addCollision(2.6, 5.4, -10.4, -8.6);

  interactiveItems.push({
    id: 'outdoor_dumpster',
    type: 'outdoor_dumpster',
    name: 'Outdoor Garbage Dumpster',
    actionText: 'Deposit Trash Bags Into Dumpster',
    position: [4, 1.0, -8.2],
    radius: 2.2,
  });

  // Outdoor Wall-Mounted Security Floodlight above rear door
  const rearFloodlight = new THREE.PointLight(0xffeedd, 0.85, 11);
  rearFloodlight.position.set(4, 2.8, -6.6);
  root.add(rearFloodlight);
  storeLights.push({ light: rearFloodlight, baseIntensity: 0.85 });

  // Bundled Cardboard Recycling Box by back wall
  const cardboardBundle = createCardboardBundle();
  cardboardBundle.position.set(6.5, 0, -8.5);
  root.add(cardboardBundle);
  interactiveMeshes.set('cardboard_bundle', cardboardBundle);

  interactiveItems.push({
    id: 'cardboard_bundle',
    type: 'cardboard_bundle',
    name: 'Cardboard Waste Bundle',
    actionText: 'Pick Up Cardboard Recycling',
    position: [6.5, 0.4, -8.5],
    radius: 1.8,
  });

  // --- 3. OUTDOOR PARKING LOT, DEDICATED DRIVE-THRU SERVICE LANE & ROAD ---
  // Concrete Sidewalk (Z: 6 to 9, X: -22 to 8.3 — stops cleanly before the Drive-Thru lane)
  const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(30.3, 3), sidewalkMat);
  sidewalk.rotation.x = -Math.PI / 2;
  sidewalk.position.set(-6.85, 0.02, 7.5);
  sidewalk.receiveShadow = false;
  root.add(sidewalk);

  // Parking Lot Surface (Z: 9 to 19, X: -24 to 24)
  const parkingLot = new THREE.Mesh(new THREE.PlaneGeometry(48, 10), asphaltMat);
  parkingLot.rotation.x = -Math.PI / 2;
  parkingLot.position.set(0, -0.01, 14);
  parkingLot.receiveShadow = false;
  root.add(parkingLot);

  // Separate Asphalt Drive-Thru Service Lane running outside East wall (X: 8.6 to 14.4, Z: -14.5 to 19.5)
  const dtLaneAsphalt = new THREE.Mesh(new THREE.PlaneGeometry(5.8, 34), asphaltMat);
  dtLaneAsphalt.rotation.x = -Math.PI / 2;
  dtLaneAsphalt.position.set(11.5, -0.005, 2.5);
  dtLaneAsphalt.receiveShadow = false;
  root.add(dtLaneAsphalt);

  // Drive-Thru Rear Turnaround Pad (Z: -14.5 to -9.0, X: 8.5 to 15.0)
  const dtTurnPad = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 6.5), asphaltMat);
  dtTurnPad.rotation.x = -Math.PI / 2;
  dtTurnPad.position.set(11.8, -0.006, -12.2);
  dtTurnPad.receiveShadow = false;
  root.add(dtTurnPad);

  // Drive-Thru Yellow Edge Lines & Window Stopping Box Markings
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xccaa11 });
  const dtWhiteLineMat = new THREE.MeshBasicMaterial({ color: 0xd4d4d8 });
  const dtLineInner = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 30), lineMat);
  dtLineInner.rotation.x = -Math.PI / 2;
  dtLineInner.position.set(8.85, 0.012, 3.0);
  const dtLineOuter = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 30), lineMat);
  dtLineOuter.rotation.x = -Math.PI / 2;
  dtLineOuter.position.set(14.1, 0.012, 3.0);
  const dtStopBar = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 0.18), dtWhiteLineMat);
  dtStopBar.rotation.x = -Math.PI / 2;
  dtStopBar.position.set(10.3, 0.013, -1.8);
  root.add(dtLineInner, dtLineOuter, dtStopBar);

  // Concrete Curb Divider separating main parking lot from Drive-Thru entry lane (X = 8.45, Z: 6.2 to 16.5)
  const dtCurbMat = new THREE.MeshStandardMaterial({
    map: TextureLibrary.getSidewalkTexture(),
    flatShading: true,
    roughness: 0.9,
  });
  const dtCurb = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.16, 10.2), dtCurbMat);
  dtCurb.position.set(8.45, 0.08, 11.4);
  root.add(dtCurb);
  addCollision(8.2, 8.7, 6.2, 16.5);

  // Protective Yellow Bollard Posts outside Drive-Thru Window corners (5-sided <= 7 faces)
  const bollardMat = new THREE.MeshStandardMaterial({
    map: TextureLibrary.getWrappedFabricTexture(0xeab308, 'shoes', 9),
    flatShading: true,
    roughness: 0.9,
    metalness: 0.1,
  });
  [-1.35, 1.35].forEach((bz) => {
    const bollard = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.95, 5, 1), bollardMat);
    bollard.position.set(8.52, 0.475, bz);
    root.add(bollard);
  });

  // Parking Spaces & Yellow Stall Lines (Shifted cleanly West so X >= 8.5 belongs exclusively to Drive-Thru lane)
  const parkingSpots: ParkingSpot[] = [
    { index: 0, position: new THREE.Vector3(-11, 0, 13), rotationY: 0, isOccupied: true }, // Parked Blue Car
    { index: 1, position: new THREE.Vector3(-6.5, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 1
    { index: 2, position: new THREE.Vector3(-2, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 2
    { index: 3, position: new THREE.Vector3(2.5, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 3
    { index: 4, position: new THREE.Vector3(6.8, 0, 13), rotationY: 0, isOccupied: true }, // Parked Red Car
  ];

  // Draw Yellow Stall Lines
  for (let s = -13.25; s <= 9.25; s += 4.5) {
    const stallLine = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 5.0), lineMat);
    stallLine.rotation.x = -Math.PI / 2;
    stallLine.position.set(s, 0.01, 13.5);
    root.add(stallLine);
  }

  // Pre-parked Cars (spot 0 is Duck's personal roomy blue car; spot 4 is neighboring staff/overflow car)
  const parkedCar1 = createDetailedCar(0x1e3f66, false, 0, true); // Duck's Roomy Dark Blue Car
  parkedCar1.position.copy(parkingSpots[0].position);
  root.add(parkedCar1);
  addCollision(-12.0, -10.0, 11.0, 15.0);

  interactiveItems.push({
    id: 'mcd_duck_car',
    type: 'mcd_duck_car',
    name: "Duck's Car",
    actionText: 'Get in Car & Drive Straight Home',
    position: [-11.0, 1.0, 13.0],
    radius: 3.6,
  });

  const parkedCar2 = createDetailedCar(0x7a221f); // Dark red
  parkedCar2.position.copy(parkingSpots[4].position);
  root.add(parkedCar2);
  addCollision(5.8, 7.8, 11.0, 15.0);

  // Two-Lane Road (Z: 19 to 29, X: -35 to 35)
  const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(70, 10), asphaltMat);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.position.set(0, -0.01, 24);
  roadMesh.receiveShadow = false;
  root.add(roadMesh);

  // Center Dashed Yellow Line on Road
  for (let rx = -30; rx <= 30; rx += 4) {
    const roadLine = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.2), lineMat);
    roadLine.rotation.x = -Math.PI / 2;
    roadLine.position.set(rx, 0.01, 24);
    root.add(roadLine);
  }

  // Roadside McDonald's "M" Neon Pole Sign (5-sided pole + sharp blocky Golden Arches)
  const signPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 8, 5, 1),
    new THREE.MeshStandardMaterial({ color: 0x333333, flatShading: true, roughness: 0.9, metalness: 0.25 })
  );
  signPole.position.set(-14, 4, 18);
  root.add(signPole);

  const totemBoardMat = new THREE.MeshBasicMaterial({ map: createMcDonaldsSignTexture() });
  storeSignMaterials.push({ mat: totemBoardMat, onColor: 0xffffff });
  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.5, 0.4),
    totemBoardMat
  );
  signBoard.position.set(-14, 7.5, 18);
  root.add(signBoard);

  // 3D Glowing PS1 Blocky Golden Arches ("M") atop the roadside totem (BoxGeometry <= 6 faces each)
  const archMat = new THREE.MeshBasicMaterial({ color: 0xffba00 });
  storeSignMaterials.push({ mat: archMat, onColor: 0xffba00 });
  const archLeftLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.18), archMat);
  archLeftLeg.position.set(-14.96, 9.08, 18);
  const archCenterLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.65, 0.18), archMat);
  archCenterLeg.position.set(-14.0, 9.05, 18);
  const archRightLeg = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.72, 0.18), archMat);
  archRightLeg.position.set(-13.04, 9.08, 18);
  const archLeftTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.18), archMat);
  archLeftTop.position.set(-14.48, 9.44, 18);
  const archRightTop = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.18), archMat);
  archRightTop.position.set(-13.52, 9.44, 18);
  root.add(archLeftLeg, archCenterLeg, archRightLeg, archLeftTop, archRightTop);

  const signLight = new THREE.PointLight(0xffbb00, 2.0, 18);
  signLight.position.set(-14, 7.5, 16.5);
  root.add(signLight);
  flickeringLights.push({ light: signLight, baseIntensity: 2.0, flickerRate: 0.08 });
  storeLights.push({ light: signLight, baseIntensity: 2.0 });

  // --- OUTDOOR POLE-MOUNTED 3D BILLBOARDS (128x128 PS1 Digitized Ads) ---
  const billboardEast = createPS1Billboard({
    variant: 'bigmac',
    boardWidth: 4.4,
    boardHeight: 2.7,
    poleHeight: 3.1,
    doubleSided: true,
    lightColor: 0xffe8b0,
    lightIntensity: 1.5,
  });
  billboardEast.position.set(16.0, 0, 16.0);
  billboardEast.rotation.y = Math.PI + 0.42;
  root.add(billboardEast);
  addCollision(14.5, 17.5, 15.2, 16.8, 'billboard_east');
  if (billboardEast.userData.adMaterial) {
    storeSignMaterials.push({ mat: billboardEast.userData.adMaterial, onColor: 0xffffff });
  }
  if (billboardEast.userData.billboardLight) {
    storeLights.push({ light: billboardEast.userData.billboardLight, baseIntensity: 1.5 });
  }

  const billboardWest = createPS1Billboard({
    variant: 'fries',
    boardWidth: 4.2,
    boardHeight: 2.6,
    poleHeight: 2.9,
    doubleSided: true,
    lightColor: 0xffd2a0,
    lightIntensity: 1.45,
  });
  billboardWest.position.set(-6.5, 0, 18.4);
  billboardWest.rotation.y = Math.PI - 0.14;
  root.add(billboardWest);
  addCollision(-8.0, -5.0, 17.8, 19.0, 'billboard_west');
  if (billboardWest.userData.adMaterial) {
    storeSignMaterials.push({ mat: billboardWest.userData.adMaterial, onColor: 0xffffff });
  }
  if (billboardWest.userData.billboardLight) {
    storeLights.push({ light: billboardWest.userData.billboardLight, baseIntensity: 1.45 });
  }

  // Streetlamps along road
  const streetLight1 = new THREE.PointLight(0xffa834, 1.3, 22);
  streetLight1.position.set(-8, 5.5, 23);
  root.add(streetLight1);

  const streetLight2 = new THREE.PointLight(0xffa834, 1.3, 22);
  streetLight2.position.set(10, 5.5, 23);
  root.add(streetLight2);

  // --- PROCEDURAL HORROR FOREST PERIMETER ---
  // Dense varied conifer, twisted dead tree, and shrub foliage
  const forest = populateSurroundingForest(addCollision);
  root.add(forest.group);

  // --- 4. INTERIOR ROOM PARTITIONS & FURNISHINGS ---
  // Wall separating Dining Area (Z: 0 to 6) from Kitchen & Office (Z: -6 to 0)
  // Generous, clear hallway opening into security office between X: -5.6 and -2.7 (2.9m wide)
  createWall(2.4, 3.2, 0.3, -6.8, 1.6, 0); // Wall left of security hallway
  createWall(4.2, 3.2, 0.3, -0.6, 1.6, 0); // Wall between hallway and cashier counter
  createWall(1.0, 3.2, 0.3, 7.5, 1.6, 0); // Short East stub (leaves wide 1.7m passage to Drive-Thru Window!)

  // Framed Office Entrance Trim (X: -5.6 to -2.7, Z = 0)
  const officeFrameMat = new THREE.MeshStandardMaterial({
    color: 0x262a30,
    flatShading: true,
    roughness: 0.9,
  });
  const offJambL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.55, 0.34), officeFrameMat);
  offJambL.position.set(-5.56, 1.275, 0);
  const offJambR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.55, 0.34), officeFrameMat);
  offJambR.position.set(-2.74, 1.275, 0);
  const offHeader = new THREE.Mesh(new THREE.BoxGeometry(2.92, 0.1, 0.34), officeFrameMat);
  offHeader.position.set(-4.15, 2.55, 0);
  root.add(offJambL, offJambR, offHeader);

  // Divider between Security Office (X: -8..-1, Z: -3..0) and Kitchen (X: -1..8)
  createWall(0.3, 3.2, 3.0, -1.0, 1.6, -1.5);

  // Divider between Kitchen and Walk-In Freezer (X = -1, Z: -6..-3) with open 1.6m Freezer Doorway (Z: -5.3..-3.7)
  createWall(0.3, 3.2, 0.7, -1.0, 1.6, -3.35);
  createWall(0.3, 3.2, 0.7, -1.0, 1.6, -5.65);
  createWall(0.3, 0.85, 1.6, -1.0, 2.775, -4.5, wallMat, false);

  // Walk-In Freezer Steel Door Frame & Frost Strip Curtains (pass-through visual)
  const freezerFrameMat = new THREE.MeshStandardMaterial({
    color: 0xb0bec5,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.25,
  });
  const fPostN = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.35, 0.08), freezerFrameMat);
  fPostN.position.set(-1.0, 1.175, -5.28);
  const fPostS = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.35, 0.08), freezerFrameMat);
  fPostS.position.set(-1.0, 1.175, -3.72);
  const fHeader = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.1, 1.64), freezerFrameMat);
  fHeader.position.set(-1.0, 2.35, -4.5);
  root.add(fPostN, fPostS, fHeader);

  const stripMat = new THREE.MeshStandardMaterial({
    color: 0xbbe8ff,
    transparent: true,
    opacity: 0.26,
    flatShading: true,
    roughness: 0.9,
    depthWrite: false,
  });
  for (let s = 0; s < 5; s++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.02, 2.25, 0.26), stripMat);
    strip.position.set(-1.0, 1.15, -5.12 + s * 0.31);
    root.add(strip);
  }

  // Walk-In Freezer Frosted Floor & Interior Wall Cladding (X: -8..-1, Z: -6..-3)
  const freezerWallTex = createFreezerWallTexture().clone();
  freezerWallTex.repeat.set(3, 1);
  freezerWallTex.needsUpdate = true;
  const freezerWallMat = new THREE.MeshStandardMaterial({
    map: freezerWallTex,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.15,
  });
  const freezerFloorMat = new THREE.MeshStandardMaterial({
    map: freezerWallTex,
    color: 0xb9ccd8,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.1,
  });
  const freezerFloor = new THREE.Mesh(new THREE.PlaneGeometry(7.0, 3.0), freezerFloorMat);
  freezerFloor.rotation.x = -Math.PI / 2;
  freezerFloor.position.set(-4.5, 0.005, -4.5);
  freezerFloor.receiveShadow = false;
  const freezerBackPanel = new THREE.Mesh(new THREE.PlaneGeometry(6.8, 3.1), freezerWallMat);
  freezerBackPanel.position.set(-4.5, 1.6, -5.84);
  root.add(freezerFloor, freezerBackPanel);

  // Freezer Shelving & Chilled Chicken Tray Crate Pickup
  const fShelf1 = createFreezerShelves();
  fShelf1.position.set(-6.9, 0, -5.25);
  fShelf1.rotation.y = Math.PI / 2;
  const fShelf2 = createFreezerShelves();
  fShelf2.position.set(-6.9, 0, -3.75);
  fShelf2.rotation.y = Math.PI / 2;
  root.add(fShelf1, fShelf2);
  addCollision(-7.3, -6.4, -5.85, -3.15);

  const freezerChickenCrate = createFreezerChickenTrayPickup();
  freezerChickenCrate.position.set(-4.2, 0, -4.5);
  root.add(freezerChickenCrate);
  addCollision(-4.7, -3.7, -4.85, -4.15);
  interactiveMeshes.set('freezer_chicken_tray', freezerChickenCrate);

  interactiveItems.push({
    id: 'freezer_chicken_tray',
    type: 'freezer_chicken_tray',
    name: 'Walk-In Freezer Chicken Tray',
    actionText: 'Retrieve Chicken Tray from Freezer',
    position: [-4.2, 0.95, -4.5],
    radius: 2.2,
  });

  // Divider between Security Office (Z: -3 to 0) and Freezer (Z: -6 to -3)
  createWall(7.0, 3.2, 0.3, -4.5, 1.6, -3.0);

  // West Wall of Security Office / Walk-In Freezer at X = -8 (closes off back half behind restroom)
  createWall(0.3, 3.2, 6.0, -8.0, 1.6, -3.0);

  // --- RESTROOM / TOILET WING (X: -12 to -8, Z: 0 to +6) ---
  // Restroom South Wall separating Restroom from rear void (Z = 0, X: -12 to -8)
  createWall(4.0, 3.2, 0.3, -10.0, 1.6, 0);

  // Partition Wall between Dining Area and Restroom (X = -8, Z: 0 to 6) with Framed Doorway & Ajar Door (Z: 1.0 to 2.6)
  createWall(0.3, 3.2, 1.0, -8.0, 1.6, 0.5);
  createWall(0.3, 3.2, 3.4, -8.0, 1.6, 4.3);
  createWall(0.3, 0.85, 1.6, -8.0, 2.775, 1.8, wallMat, false); // Doorway header

  const restroomDoorFrameMat = new THREE.MeshStandardMaterial({
    color: 0x24282e,
    flatShading: true,
    roughness: 0.9,
  });
  const rrJambS = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.35, 0.08), restroomDoorFrameMat);
  rrJambS.position.set(-8.0, 1.175, 1.04);
  const rrJambN = new THREE.Mesh(new THREE.BoxGeometry(0.34, 2.35, 0.08), restroomDoorFrameMat);
  rrJambN.position.set(-8.0, 1.175, 2.56);
  const rrHeaderBar = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.08, 1.6), restroomDoorFrameMat);
  rrHeaderBar.position.set(-8.0, 2.35, 1.8);
  root.add(rrJambS, rrJambN, rrHeaderBar);

  // Propped-open wooden restroom door leaf hinged cleanly inward (keeps doorway 100% passable)
  const rrDoorPivot = new THREE.Group();
  rrDoorPivot.position.set(-8.06, 0, 2.52);
  rrDoorPivot.rotation.y = 1.38;
  const rrDoorLeaf = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 2.26, 1.02),
    new THREE.MeshStandardMaterial({
      map: TextureLibrary.getWoodGrainTexture(0x4b2f24),
      flatShading: true,
      roughness: 0.88,
    })
  );
  rrDoorLeaf.position.set(0, 1.13, -0.52);
  const rrHandle = new THREE.Mesh(
    new THREE.BoxGeometry(0.14, 0.04, 0.14),
    new THREE.MeshStandardMaterial({ color: 0xc8ced4, flatShading: true, roughness: 0.6 })
  );
  rrHandle.position.set(0, 1.02, -0.92);
  rrDoorPivot.add(rrDoorLeaf, rrHandle);
  root.add(rrDoorPivot);

  // Restroom Wall Sign mounted above doorway facing dining room (+X)
  const restroomSign = createRestroomDoorSign();
  restroomSign.position.set(-7.83, 2.58, 1.8);
  restroomSign.rotation.y = Math.PI / 2;
  root.add(restroomSign);

  // Restroom Porcelain Toilet Stall (Northwest corner X: -11.0, Z: 4.7)
  const toiletStall = createRestroomToiletStall();
  toiletStall.position.set(-11.0, 0, 4.7);
  root.add(toiletStall);
  addCollision(-11.85, -10.15, 3.88, 4.08); // Stall partition divider
  addCollision(-11.85, -10.75, 4.25, 5.15); // Porcelain toilet fixture

  interactiveItems.push({
    id: 'toilet_flush',
    type: 'toilet_flush',
    name: 'Restroom Toilet',
    actionText: 'Flush Toilet',
    position: [-11.1, 0.9, 4.75],
    radius: 1.9,
  });

  // Restroom Vanity Sink, Mirror & Paper Towel Dispenser along South Wall (Z = 0.16)
  const restroomSink = createRestroomSinkAndMirror();
  restroomSink.position.set(-10.0, 0, 0.16);
  root.add(restroomSink);
  addCollision(-10.8, -9.2, 0.1, 0.78);

  // --- COMPACT CASHIER COUNTER (X: 3.4, Z: 0.5) ---
  const cashierCounter = createCompactCashierCounter();
  cashierCounter.position.set(3.4, 0, 0.5);
  root.add(cashierCounter);
  addCollision(1.6, 5.2, 0.1, 0.9);

  interactiveItems.push({
    id: 'serve_table_spot',
    type: 'serve_table_spot',
    name: 'Serving Counter Table',
    actionText: 'Place Finished Dish on Table',
    position: [4.05, 1.12, 0.76],
    radius: 2.5,
  });

  // --- WAVING CLOWN MASCOT STATUE NEAR CASH REGISTER (Welcoming Pose) ---
  const clownStatue = createWelcomingClownStatue();
  clownStatue.position.set(1.15, 0, 1.15);
  clownStatue.rotation.y = 0.28;
  root.add(clownStatue);
  addCollision(0.75, 1.55, 0.75, 1.55, 'clown_statue');
  // Relocated West Dining / Restroom Corner collider toggled on during Night 3
  addCollision(-7.55, -6.75, 4.75, 5.55, 'clown_statue_night3');
  const n3Box = collisionBoxes.find((b) => b.id === 'clown_statue_night3');
  if (n3Box) n3Box.enabled = false;

  // --- DRIVE-THRU ORDER STATION (Counter terminal prop near cashier & drive-thru window) ---
  const driveThruStation = createDriveThruOrderStation();
  driveThruStation.position.set(4.8, 1.08, 0.5);
  root.add(driveThruStation);
  interactiveMeshes.set('drive_thru_order_station', driveThruStation);

  // --- INTERIOR PROMO AD POSTERS & OVERHEAD COUNTER BILLBOARD BOARDS ---
  const railMat = new THREE.MeshStandardMaterial({
    color: 0x1b1e24,
    flatShading: true,
    roughness: 0.9,
  });
  const counterHeaderBeam = new THREE.Mesh(new THREE.BoxGeometry(4.2, 0.08, 0.1), railMat);
  counterHeaderBeam.position.set(3.4, 3.02, 0.42);
  root.add(counterHeaderBeam);
  [1.9, 4.9].forEach((rx) => {
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.24, 5, 1), railMat);
    rod.position.set(rx, 3.1, 0.42);
    root.add(rod);
  });

  const overheadAds: { variant: 'bigmac' | 'fries' | 'coffee'; x: number }[] = [
    { variant: 'bigmac', x: 2.1 },
    { variant: 'fries', x: 3.4 },
    { variant: 'coffee', x: 4.7 },
  ];
  overheadAds.forEach(({ variant, x }) => {
    const board = createPS1WallAdPoster(variant, 1.15, 0.92);
    board.position.set(x, 2.54, 0.42);
    root.add(board);
    if (board.userData.adMaterial) {
      storeSignMaterials.push({ mat: board.userData.adMaterial, onColor: 0xffffff });
    }
  });

  const wallAdSpecs: {
    variant: 'bigmac' | 'fries' | 'grimace' | 'coffee';
    pos: [number, number, number];
    rotY: number;
    w: number;
    h: number;
  }[] = [
    { variant: 'bigmac', pos: [-0.6, 1.85, 0.18], rotY: 0, w: 1.1, h: 1.1 },
    { variant: 'fries', pos: [0.75, 1.85, 0.18], rotY: 0, w: 1.1, h: 1.1 },
    { variant: 'grimace', pos: [-7.82, 1.85, 4.2], rotY: Math.PI / 2, w: 1.32, h: 1.32 },
    { variant: 'coffee', pos: [7.82, 1.85, 3.8], rotY: -Math.PI / 2, w: 1.32, h: 1.32 },
  ];
  wallAdSpecs.forEach((spec) => {
    const poster = createPS1WallAdPoster(spec.variant, spec.w, spec.h);
    poster.position.set(spec.pos[0], spec.pos[1], spec.pos[2]);
    poster.rotation.y = spec.rotY;
    root.add(poster);
    if (poster.userData.adMaterial) {
      storeSignMaterials.push({ mat: poster.userData.adMaterial, onColor: 0xffffff });
    }
  });

  // Employee Time Clock Punch Station
  // Placed in employee-only area beside wall (X: -1.5, Z: 0.18), away from cashier entrance
  const timeClock = createTimeClockPunch();
  timeClock.position.set(-1.5, 1.5, 0.18);
  root.add(timeClock);

  interactiveItems.push({
    id: 'time_clock',
    type: 'time_clock',
    name: 'Employee Time Clock',
    actionText: 'Punch Time Card & Clock In',
    position: [-1.5, 1.5, 0.6],
    radius: 1.8,
  });

  // --- DINING AREA BOOTHS (4 cozy booths) ---
  const boothPositions = [
    [-5.0, 4.2],
    [-5.0, 1.8],
    [5.0, 4.2],
    [5.0, 1.8],
  ];
  boothPositions.forEach(([bx, bz]) => {
    const booth = createDiningBooth();
    booth.position.set(bx, 0, bz);
    root.add(booth);
    addCollision(bx - 0.9, bx + 0.9, bz - 0.7, bz + 0.7);
  });

  // Table Mess Tasks (Tables to clean)
  const mess1 = createTableMess();
  mess1.position.set(-5.0, 0.83, 4.2);
  root.add(mess1);
  interactiveMeshes.set('clean_table_1', mess1);
  interactiveItems.push({
    id: 'clean_table_1',
    type: 'clean_table',
    name: 'Dirty Table #1',
    actionText: 'Wipe & Sanitize Dining Table',
    position: [-5.0, 0.85, 4.2],
    radius: 1.6,
  });

  const mess2 = createTableMess();
  mess2.position.set(5.0, 0.83, 1.8);
  root.add(mess2);
  interactiveMeshes.set('clean_table_2', mess2);
  interactiveItems.push({
    id: 'clean_table_2',
    type: 'clean_table',
    name: 'Dirty Table #2',
    actionText: 'Wipe & Sanitize Dining Table',
    position: [5.0, 0.85, 1.8],
    radius: 1.6,
  });

  // Trash Bags to collect inside dining area
  const bag1 = createTrashBag();
  bag1.position.set(-5.0, 0.83, 1.8);
  root.add(bag1);
  interactiveMeshes.set('trash_bag_1', bag1);
  interactiveItems.push({
    id: 'trash_bag_1',
    type: 'trash_item',
    name: 'Full Trash Bag',
    actionText: 'Collect Trash Bag',
    position: [-5.0, 0.85, 1.8],
    radius: 1.6,
  });

  const bag2 = createTrashBag();
  bag2.position.set(2.0, 0.2, 3.5);
  root.add(bag2);
  interactiveMeshes.set('trash_bag_2', bag2);
  interactiveItems.push({
    id: 'trash_bag_2',
    type: 'trash_item',
    name: 'Discarded Food Debris',
    actionText: 'Collect Trash Bag',
    position: [2.0, 0.2, 3.5],
    radius: 1.6,
  });

  // --- KITCHEN PROPS (Stainless prep table, coffee machine, prep items, fried chicken warmer) ---
  const kitchenCounter = createKitchenCounter();
  kitchenCounter.position.set(3.5, 0, -2.5);
  root.add(kitchenCounter);
  addCollision(2.3, 4.7, -3.0, -2.0);

  // High-Detail Commercial Coffee & Espresso Machine on the Food Prep Table
  const coffeeMachine = createCommercialCoffeeMachine();
  coffeeMachine.position.set(2.7, 0.95, -2.5);
  root.add(coffeeMachine);
  interactiveMeshes.set('coffee_machine', coffeeMachine);

  interactiveItems.push({
    id: 'coffee_machine',
    type: 'coffee_machine',
    name: 'Commercial Coffee Machine',
    actionText: 'Brew Coffee in Coffee Machine (3s)',
    position: [2.7, 1.25, -2.38],
    radius: 1.55,
  });

  // Commercial Soft Drink Dispenser along the rear kitchen wall
  const sodaDispenser = createSoftDrinkDispenser();
  sodaDispenser.position.set(5.45, 0, -5.42);
  root.add(sodaDispenser);
  addCollision(5.03, 5.87, -5.74, -5.1);
  interactiveMeshes.set('soda_dispenser', sodaDispenser);

  interactiveItems.push({
    id: 'soda_dispenser',
    type: 'soda_dispenser',
    name: 'Soft Drink Dispenser',
    actionText: 'Pour Soda in Dispenser (3s)',
    position: [5.45, 1.25, -5.15],
    radius: 1.65,
  });

  // Food Preparation Area Items (Condiment bottles, burger boxes, fry cartons, tongs, wrappers)
  const prepItems = createFoodPrepTableItems();
  prepItems.position.set(3.8, 0.95, -2.5);
  root.add(prepItems);

  // Fried Chicken Bucket on Food Prep Table
  const prepChickenBucket = createFriedChickenBucket();
  prepChickenBucket.scale.setScalar(0.85);
  prepChickenBucket.position.set(4.35, 0.95, -2.4);
  root.add(prepChickenBucket);

  // Commercial Fried Chicken & Potatoes Fryer Machine
  const fryer = createFriedChickenVendingMachine();
  fryer.position.set(6.8, 0, -3.5);
  root.add(fryer);
  addCollision(6.2, 7.4, -4.1, -2.9);
  interactiveMeshes.set('fryer_machine', fryer);

  interactiveItems.push({
    id: 'fryer_machine',
    type: 'fryer_machine',
    name: 'Fried Chicken & Fries Machine',
    actionText: 'Fry Chicken & Potatoes (5s)',
    position: [6.8, 1.0, -3.5],
    radius: 1.55,
  });

  // Countertop Commercial Microwave Station (left of prep counter)
  const microwave = createKitchenMicrowave();
  microwave.position.set(1.55, 0, -2.5);
  root.add(microwave);
  addCollision(1.1, 2.0, -2.95, -2.05);
  interactiveMeshes.set('kitchen_microwave', microwave);

  interactiveItems.push({
    id: 'kitchen_microwave',
    type: 'kitchen_microwave',
    name: 'Kitchen Microwave',
    actionText: 'Heat Big Mac in Microwave (5s)',
    position: [1.55, 1.15, -2.5],
    radius: 1.45,
  });

  // Back-of-House Warehouse Supply Shelving Rack beside rear door corridor (keeps freezer doorway clear)
  const warehouseRack = createWarehouseSupplyRack();
  warehouseRack.position.set(0.85, 0, -5.3);
  root.add(warehouseRack);
  addCollision(0.0, 1.7, -5.65, -4.95);

  // Fryer & Grill power switch
  const switchBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.35, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xcc2222, flatShading: true, roughness: 0.9 })
  );
  switchBox.position.set(7.85, 1.5, -4.5);
  root.add(switchBox);

  interactiveItems.push({
    id: 'kitchen_switch',
    type: 'kitchen_switch',
    name: 'Kitchen Fryer & Grill Master Controls',
    actionText: 'Power Down Kitchen Equipment',
    position: [7.4, 1.5, -4.5],
    radius: 1.8,
  });

  // --- SECURITY OFFICE (X: -8 to -1, Z: -3 to 0) ---
  // --- SECURITY OFFICE (X: -8 to -1, Z: -3 to 0) ---
  const officeDesk = createSecurityOfficeDesk(cameraScreens);
  officeDesk.position.set(-4.5, 0, -2.35);
  officeDesk.rotation.y = 0; // Screen and keyboard face room entrance
  root.add(officeDesk);
  addCollision(-5.5, -3.5, -2.85, -1.8);

  interactiveMeshes.set('cctv_monitor', officeDesk);

  interactiveItems.push({
    id: 'cctv_monitor',
    type: 'cctv_monitor',
    name: 'Security Surveillance Computer (CCTV)',
    actionText: 'Inspect Security Surveillance Cameras',
    position: [-4.5, 1.2, -1.8],
    radius: 2.2,
  });

  // Mop and Yellow Bucket (Placed in unused corner against west wall, far from doorway)
  const mopAndBucket = createMopAndBucket();
  mopAndBucket.position.set(-7.3, 0, -0.5);
  root.add(mopAndBucket);
  addCollision(-7.6, -7.0, -0.7, -0.3);
  const mopInBucket: THREE.Object3D | null = mopAndBucket.userData.mopInBucket || null;

  interactiveItems.push({
    id: 'mop_tool',
    type: 'mop_tool',
    name: 'Janitor Mop & Bucket',
    actionText: 'Pick Up Mop',
    position: [-7.3, 0.7, -0.5],
    radius: 2.0,
  });

  // Indoor Kitchen/Service Trash Bin beside food prep table (used to discard spoiled food)
  const indoorTrashBin = createIndoorTrashBin();
  indoorTrashBin.position.set(5.25, 0, -2.4);
  root.add(indoorTrashBin);
  addCollision(4.95, 5.55, -2.7, -2.1);

  interactiveItems.push({
    id: 'trash_bin',
    type: 'trash_bin',
    name: 'Kitchen Trash Bin',
    actionText: 'Throw Spoiled Food in Trash',
    position: [5.25, 0.7, -2.4],
    radius: 2.0,
  });

  // Office auxiliary light breaker switch (Night 2)
  const officeSwitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.25, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xcc2222, flatShading: true, roughness: 0.9 })
  );
  officeSwitch.position.set(-7.85, 1.5, -1.5);
  root.add(officeSwitch);

  interactiveItems.push({
    id: 'office_switch',
    type: 'kitchen_switch',
    name: 'Night Maintenance Power Switch',
    actionText: 'Turn On Auxiliary Hallway Lights',
    position: [-7.4, 1.5, -1.5],
    radius: 1.8,
  });

  // Locker
  const locker = createLocker();
  locker.position.set(-7.5, 0, -2.5);
  locker.rotation.y = Math.PI / 2;
  root.add(locker);

  // --- KITCHEN FOOD PREPARATION COUNTER (Active during customer ordering phase) ---
  interactiveItems.push({
    id: 'kitchen_prep_station',
    type: 'kitchen_prep_station',
    name: 'Kitchen Food Prep & Assembly Counter',
    actionText: 'Prepare & Bag Customer Food Order',
    position: [3.5, 1.0, -2.5],
    radius: 1.6,
  });

  // 8 Dirty Puddles across Office, Restroom Entrance, Dining Area, Cashier & Kitchen (require Mop in hand)
  const puddleSpecs: { id: string; pos: [number, number, number]; rot: number; scale: number }[] = [
    { id: 'hallway_spill', pos: [-6.3, 0.01, -0.8], rot: 0.2, scale: 1.0 },
    { id: 'dirty_puddle_2', pos: [-4.1, 0.01, -0.2], rot: 1.1, scale: 0.92 },
    { id: 'dirty_puddle_3', pos: [-7.0, 0.01, 2.0], rot: 0.7, scale: 0.95 },
    { id: 'dirty_puddle_4', pos: [-3.0, 0.01, 3.2], rot: 2.2, scale: 1.05 },
    { id: 'dirty_puddle_5', pos: [0.2, 0.01, 3.8], rot: 0.4, scale: 1.08 },
    { id: 'dirty_puddle_6', pos: [3.1, 0.01, 2.2], rot: 1.6, scale: 0.96 },
    { id: 'dirty_puddle_7', pos: [5.75, 0.01, -0.8], rot: 2.6, scale: 0.9 },
    { id: 'dirty_puddle_8', pos: [2.0, 0.01, -3.8], rot: 0.9, scale: 1.0 },
  ];

  puddleSpecs.forEach((ps, idx) => {
    const puddle = createHallwayPuddle();
    puddle.position.set(ps.pos[0], ps.pos[1], ps.pos[2]);
    puddle.rotation.y = ps.rot;
    puddle.scale.setScalar(ps.scale);
    root.add(puddle);
    interactiveMeshes.set(ps.id, puddle);

    interactiveItems.push({
      id: ps.id,
      type: 'hallway_spill',
      name: `Dirty Puddle #${idx + 1}`,
      actionText: 'Mop & Clean Dirty Puddle',
      position: [ps.pos[0], 0.2, ps.pos[2]],
      radius: 1.85,
    });
  });

  // --- OUTGOING NIGHT SHIFT EMPLOYEE: JOHN (Lobby Handover NPC) ---
  const employeeJohn = createEmployeeJohn();
  employeeJohn.position.set(0.8, 0, 2.8);
  employeeJohn.rotation.y = -0.25;
  root.add(employeeJohn);
  interactiveMeshes.set('employee_john', employeeJohn);

  interactiveItems.push({
    id: 'employee_john',
    type: 'employee_john',
    name: 'John (Outgoing Employee)',
    actionText: 'Talk to John (Take Over Shift)',
    position: [0.8, 1.35, 2.8],
    radius: 2.8,
  });

  // --- LIGHTING (Dimly lit late-night horror mood) ---
  const hemiLight = new THREE.HemisphereLight(0x223040, 0x0a0f16, 0.18);
  root.add(hemiLight);

  // Dining lights
  const diningLight1 = new THREE.PointLight(0xfff3d6, 0.58, 10);
  diningLight1.position.set(-3.5, 2.9, 3.5);
  root.add(diningLight1);
  flickeringLights.push({ light: diningLight1, baseIntensity: 0.58, flickerRate: 0.04 });
  storeLights.push({ light: diningLight1, baseIntensity: 0.58 });

  const diningLight2 = new THREE.PointLight(0xfff3d6, 0.55, 10);
  diningLight2.position.set(3.5, 2.9, 3.5);
  root.add(diningLight2);
  flickeringLights.push({ light: diningLight2, baseIntensity: 0.55, flickerRate: 0.06 });
  storeLights.push({ light: diningLight2, baseIntensity: 0.55 });

  // Restroom fluorescent light
  const toiletLight = new THREE.PointLight(0xdff4ff, 0.48, 7.5);
  toiletLight.position.set(-10.0, 2.9, 3.0);
  root.add(toiletLight);
  flickeringLights.push({ light: toiletLight, baseIntensity: 0.48, flickerRate: 0.07 });
  storeLights.push({ light: toiletLight, baseIntensity: 0.48 });

  // Kitchen light
  const kitchenLight = new THREE.PointLight(0xe8f0f5, 0.54, 9.5);
  kitchenLight.position.set(3.5, 2.9, -3.0);
  root.add(kitchenLight);
  flickeringLights.push({ light: kitchenLight, baseIntensity: 0.54, flickerRate: 0.05 });
  storeLights.push({ light: kitchenLight, baseIntensity: 0.54 });

  // Office light
  const officeLight = new THREE.PointLight(0xffd59e, 0.46, 7.5);
  officeLight.position.set(-4.5, 2.9, -1.5);
  root.add(officeLight);
  flickeringLights.push({ light: officeLight, baseIntensity: 0.46, flickerRate: 0.02 });
  storeLights.push({ light: officeLight, baseIntensity: 0.46 });

  // Back hallway / Freezer light
  const freezerLight = new THREE.PointLight(0x99ddff, 0.36, 7.5);
  freezerLight.position.set(-4.5, 2.9, -4.5);
  root.add(freezerLight);
  flickeringLights.push({ light: freezerLight, baseIntensity: 0.36, flickerRate: 0.02 });
  storeLights.push({ light: freezerLight, baseIntensity: 0.36 });

  // --- RANDOMIZED OUTDOOR RAIN PARTICLE SYSTEM ---
  const rainCount = 1600;
  const rainGeo = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  const rainSpeeds = new Float32Array(rainCount);
  const rainVx = new Float32Array(rainCount);
  const rainVz = new Float32Array(rainCount);

  const pickOutdoorRainXZ = (): [number, number] => {
    for (let attempt = 0; attempt < 8; attempt++) {
      const rx = -28 + Math.random() * 56;
      const rz = -22 + Math.random() * 54;
      if (rx < -12.4 || rx > 8.4 || rz < -6.4 || rz > 6.4) {
        return [rx, rz];
      }
    }
    return [-26 + Math.random() * 52, 8 + Math.random() * 22];
  };

  for (let i = 0; i < rainCount; i++) {
    const [rx, rz] = pickOutdoorRainXZ();
    rainPositions[i * 3] = rx;
    rainPositions[i * 3 + 1] = Math.random() * 16;
    rainPositions[i * 3 + 2] = rz;
    rainSpeeds[i] = 13.5 + Math.random() * 11.5;
    rainVx[i] = (Math.random() - 0.35) * 3.8;
    rainVz[i] = (Math.random() - 0.5) * 2.4;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMat = new THREE.PointsMaterial({
    color: 0x88bbdd,
    size: 0.065,
    transparent: true,
    opacity: 0.52,
  });
  const rainSystem = new THREE.Points(rainGeo, rainMat);
  rainSystem.userData.speeds = rainSpeeds;
  rainSystem.userData.vx = rainVx;
  rainSystem.userData.vz = rainVz;
  root.add(rainSystem);

  // --- CCTV CAMERAS ---
  const cctvCameras = [
    {
      id: 1,
      name: 'CAM 01 - DINING AREA',
      position: new THREE.Vector3(7.2, 2.8, 5.2),
      lookAt: new THREE.Vector3(0, 0.8, 2.5),
    },
    {
      id: 2,
      name: 'CAM 02 - CASHIER COUNTER',
      position: new THREE.Vector3(-3.8, 2.75, 4.6),
      lookAt: new THREE.Vector3(3.1, 1.15, 1.0),
    },
    {
      id: 3,
      name: 'CAM 03 - KITCHEN PREP',
      position: new THREE.Vector3(7.2, 2.8, -5.2),
      lookAt: new THREE.Vector3(2.5, 0.8, -2.5),
    },
    {
      id: 4,
      name: 'CAM 04 - REAR TRASH DUMPSTER',
      position: new THREE.Vector3(-2.0, 2.8, -13.0),
      lookAt: new THREE.Vector3(4.0, 0.8, -9.5),
    },
    {
      id: 5,
      name: 'CAM 05 - PARKING LOT & ROAD',
      position: new THREE.Vector3(-12.0, 5.0, 16.0),
      lookAt: new THREE.Vector3(0, 0.5, 14.0),
    },
  ];

  // --- ISOLATED 67-ELEVEN CONVENIENCE STORE AREA (Z = 140, visible post-shift) ---
  const store67 = buildSixtySevenElevenArea(addCollision);
  root.add(store67.group);
  interactiveItems.push(...store67.interactiveItems);

  return {
    scene: root,
    collisionBoxes,
    interactiveItems,
    interactiveMeshes,
    flickeringLights,
    storeLights,
    storeSignMaterials,
    hemiLight,
    electricalBox,
    cctvCameras,
    cameraScreens,
    rainSystem,
    parkingSpots,
    slidingDoors,
    rearDoor,
    kitchenLight,
    employeeJohn,
    clownStatue,
    fryerMachine: fryer,
    kitchenMicrowave: microwave,
    coffeeMachine,
    sodaDispenser,
    duckCar: parkedCar1,
    wallMeshes,
    mopInBucket,
    store67Group: store67.group,
    store67Clerk: store67.clerk,
  };
}
