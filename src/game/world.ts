import * as THREE from 'three';
import {
  createFloorTileTexture,
  createFreezerWallTexture,
  createMcDonaldsSignTexture,
  createAsphaltTexture,
} from './textures';
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
  createSecurityOfficeDesk,
  createLocker,
  createFreezerShelves,
  createTableMess,
  createTrashBag,
  createClipboardProp,
  createHallwayPuddle,
  createDetailedCar,
} from './props';
import { InteractiveItem } from '../types/game';

export interface CollisionBox {
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
}

export function buildCompactRestaurantWorld(): RestaurantWorld {
  const root = new THREE.Group();
  const collisionBoxes: CollisionBox[] = [];
  const interactiveItems: InteractiveItem[] = [];
  const interactiveMeshes = new Map<string, THREE.Object3D>();
  const flickeringLights: FlickeringLight[] = [];
  const cameraScreens: THREE.Mesh[] = [];

  const addCollision = (minX: number, maxX: number, minZ: number, maxZ: number) => {
    collisionBoxes.push({
      minX: Math.min(minX, maxX),
      maxX: Math.max(minX, maxX),
      minZ: Math.min(minZ, maxZ),
      maxZ: Math.max(minZ, maxZ),
    });
  };

  // --- TEXTURES & MATERIALS ---
  const floorTex = createFloorTileTexture();
  floorTex.repeat.set(6, 5);
  const floorMat = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: 0.35,
    metalness: 0.1,
  });

  const wallMat = new THREE.MeshStandardMaterial({
    color: 0x969087,
    roughness: 0.85,
    metalness: 0.05,
  });

  const ceilingMat = new THREE.MeshStandardMaterial({
    color: 0x33302d,
    roughness: 0.9,
  });

  const asphaltTex = createAsphaltTexture();
  asphaltTex.repeat.set(10, 8);
  const asphaltMat = new THREE.MeshStandardMaterial({
    map: asphaltTex,
    roughness: 0.2,
    metalness: 0.4,
  });

  const sidewalkMat = new THREE.MeshStandardMaterial({
    color: 0x6e7378,
    roughness: 0.75,
  });

  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x7090a0,
    transmission: 0.85,
    roughness: 0.12,
    ior: 1.5,
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
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    root.add(mesh);
    if (hasCollision) {
      addCollision(x - w / 2 - 0.2, x + w / 2 + 0.2, z - d / 2 - 0.2, z + d / 2 + 0.2);
    }
    return mesh;
  };

  // --- 1. COMPACT BUILDING (16m wide x 12m deep) ---
  // Floor: X: -8 to 8, Z: -6 to 6
  const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), floorMat);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.position.set(0, 0, 0);
  floorMesh.receiveShadow = true;
  root.add(floorMesh);

  // Ceiling
  const ceilingMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 12), ceilingMat);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.position.set(0, 3.2, 0);
  root.add(ceilingMesh);

  // Exterior West Wall (X = -8)
  createWall(0.3, 3.2, 12, -8, 1.6, 0);
  // Exterior East Wall (X = 8, with drive-thru window opening at Z = -3)
  createWall(0.3, 3.2, 4.5, 8, 1.6, 3.75);
  createWall(0.3, 3.2, 4.5, 8, 1.6, -3.75);
  // Drive-Thru glass window
  const dtWindow = new THREE.Mesh(new THREE.BoxGeometry(0.1, 1.4, 1.6), glassMat);
  dtWindow.position.set(8, 1.5, 0);
  root.add(dtWindow);
  addCollision(7.8, 8.2, -1.0, 1.0);

  interactiveItems.push({
    id: 'drive_thru_window',
    type: 'drive_thru_window',
    name: 'Drive-Thru Window',
    actionText: 'Inspect Drive-Thru Window',
    position: [7.2, 1.4, 0],
    radius: 1.8,
  });

  // Exterior South Wall (Z = -6, with doorway for rear service door at X = 4)
  createWall(11.5, 3.2, 0.3, -2.25, 1.6, -6);
  createWall(3.3, 3.2, 0.3, 6.35, 1.6, -6);
  // Opening for rear service door at X = 4, Z = -6

  // Exterior North Wall (Z = 6, Front Facade with Automatic Sliding Doors at X = 0)
  createWall(6.5, 3.2, 0.3, -4.75, 1.6, 6);
  createWall(6.5, 3.2, 0.3, 4.75, 1.6, 6);
  // Large storefront glass windows on left & right of sliding door
  const windowL = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.4, 0.1), glassMat);
  windowL.position.set(-4.5, 1.5, 6.0);
  const windowR = new THREE.Mesh(new THREE.BoxGeometry(4.8, 2.4, 0.1), glassMat);
  windowR.position.set(4.5, 1.5, 6.0);
  root.add(windowL, windowR);

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

  // --- 2. OUTDOOR REAR TRASH & SERVICE AREA (South: Z = -6 to -14) ---
  const rearPadMesh = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), sidewalkMat);
  rearPadMesh.rotation.x = -Math.PI / 2;
  rearPadMesh.position.set(0, -0.01, -10);
  rearPadMesh.receiveShadow = true;
  root.add(rearPadMesh);

  // Rear boundary wall/fence
  createWall(16, 2.8, 0.3, 0, 1.4, -14);
  createWall(0.3, 2.8, 8, -8, 1.4, -10);
  createWall(0.3, 2.8, 8, 8, 1.4, -10);

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
  const rearFloodlight = new THREE.PointLight(0xffeedd, 1.2, 12);
  rearFloodlight.position.set(4, 2.8, -6.6);
  root.add(rearFloodlight);

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

  // --- 3. OUTDOOR PARKING LOT & ROAD (North: Z = 6 to 28) ---
  // Concrete Sidewalk (Z: 6 to 9, X: -22 to 22)
  const sidewalk = new THREE.Mesh(new THREE.PlaneGeometry(44, 3), sidewalkMat);
  sidewalk.rotation.x = -Math.PI / 2;
  sidewalk.position.set(0, 0.02, 7.5);
  sidewalk.receiveShadow = true;
  root.add(sidewalk);

  // Parking Lot Surface (Z: 9 to 19, X: -24 to 24)
  const parkingLot = new THREE.Mesh(new THREE.PlaneGeometry(48, 10), asphaltMat);
  parkingLot.rotation.x = -Math.PI / 2;
  parkingLot.position.set(0, -0.01, 14);
  parkingLot.receiveShadow = true;
  root.add(parkingLot);

  // Parking Spaces & Yellow Stall Lines
  const parkingSpots: ParkingSpot[] = [
    { index: 0, position: new THREE.Vector3(-9, 0, 13), rotationY: 0, isOccupied: true }, // Parked Blue Car
    { index: 1, position: new THREE.Vector3(-4.5, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 1
    { index: 2, position: new THREE.Vector3(0, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 2
    { index: 3, position: new THREE.Vector3(4.5, 0, 13), rotationY: 0, isOccupied: false }, // Customer Spot 3
    { index: 4, position: new THREE.Vector3(9, 0, 13), rotationY: 0, isOccupied: true }, // Parked Red Car
  ];

  // Draw Yellow Stall Lines
  const lineMat = new THREE.MeshBasicMaterial({ color: 0xccaa11 });
  for (let s = -11.25; s <= 11.25; s += 4.5) {
    const stallLine = new THREE.Mesh(new THREE.PlaneGeometry(0.15, 5.0), lineMat);
    stallLine.rotation.x = -Math.PI / 2;
    stallLine.position.set(s, 0.01, 13.5);
    root.add(stallLine);
  }

  // Pre-parked Cars (already in spots 0 and 4)
  const parkedCar1 = createDetailedCar(0x1e3f66); // Dark blue
  parkedCar1.position.copy(parkingSpots[0].position);
  root.add(parkedCar1);
  addCollision(-10.0, -8.0, 11.0, 15.0);

  const parkedCar2 = createDetailedCar(0x7a221f); // Dark red
  parkedCar2.position.copy(parkingSpots[4].position);
  root.add(parkedCar2);
  addCollision(8.0, 10.0, 11.0, 15.0);

  // Two-Lane Road (Z: 19 to 29, X: -35 to 35)
  const roadMesh = new THREE.Mesh(new THREE.PlaneGeometry(70, 10), asphaltMat);
  roadMesh.rotation.x = -Math.PI / 2;
  roadMesh.position.set(0, -0.01, 24);
  roadMesh.receiveShadow = true;
  root.add(roadMesh);

  // Center Dashed Yellow Line on Road
  for (let rx = -30; rx <= 30; rx += 4) {
    const roadLine = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 0.2), lineMat);
    roadLine.rotation.x = -Math.PI / 2;
    roadLine.position.set(rx, 0.01, 24);
    root.add(roadLine);
  }

  // Roadside McDonald's "M" Neon Pole Sign
  const signPole = new THREE.Mesh(
    new THREE.CylinderGeometry(0.18, 0.22, 8, 12),
    new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 })
  );
  signPole.position.set(-14, 4, 18);
  root.add(signPole);

  const signBoard = new THREE.Mesh(
    new THREE.BoxGeometry(3.2, 2.5, 0.4),
    new THREE.MeshBasicMaterial({ map: createMcDonaldsSignTexture() })
  );
  signBoard.position.set(-14, 7.5, 18);
  root.add(signBoard);

  const signLight = new THREE.PointLight(0xffbb00, 1.8, 16);
  signLight.position.set(-14, 7, 16.5);
  root.add(signLight);
  flickeringLights.push({ light: signLight, baseIntensity: 1.8, flickerRate: 0.08 });

  // Streetlamps along road
  const streetLight1 = new THREE.PointLight(0xffa834, 1.2, 20);
  streetLight1.position.set(-8, 5.5, 23);
  root.add(streetLight1);

  const streetLight2 = new THREE.PointLight(0xffa834, 1.2, 20);
  streetLight2.position.set(10, 5.5, 23);
  root.add(streetLight2);

  // --- 4. INTERIOR ROOM PARTITIONS & FURNISHINGS ---
  // Wall separating Dining Area (Z: 0 to 6) from Kitchen & Office (Z: -6 to 0)
  // Hallway opening between X: -4.5 and -3.0
  // Counter sits at X: 1.5, Z: 0.5
  createWall(3.5, 3.2, 0.3, -6.25, 1.6, 0); // Wall left of hallway
  createWall(4.0, 3.2, 0.3, -1.0, 1.6, 0); // Wall between hallway and kitchen counter
  createWall(3.0, 3.2, 0.3, 6.5, 1.6, 0); // Wall right of counter

  // Divider between Kitchen (X: -1 to 8) and Office/Freezer (X: -8 to -1)
  createWall(0.3, 3.2, 6.0, -1.0, 1.6, -3.0);

  // Divider between Security Office (Z: -3 to 0) and Freezer (Z: -6 to -3)
  createWall(7.0, 3.2, 0.3, -4.5, 1.6, -3.0);

  // --- COMPACT CASHIER COUNTER (X: 2.2, Z: 0.5) ---
  const cashierCounter = createCompactCashierCounter();
  cashierCounter.position.set(2.4, 0, 0.4);
  root.add(cashierCounter);
  addCollision(0.4, 4.4, 0.0, 0.8);

  // Employee Time Clock Punch Machine mounted on wall near counter (X: 4.8, Z: 0.2)
  const timeClock = createTimeClockPunch();
  timeClock.position.set(4.8, 1.5, 0.18);
  root.add(timeClock);

  interactiveItems.push({
    id: 'time_clock',
    type: 'time_clock',
    name: 'Employee Time Clock',
    actionText: 'Punch Time Card & Clock In',
    position: [4.8, 1.5, 0.6],
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

  // --- KITCHEN PROPS (Stainless prep table, fryers) ---
  const kitchenCounter = createKitchenCounter();
  kitchenCounter.position.set(3.5, 0, -2.5);
  root.add(kitchenCounter);
  addCollision(2.3, 4.7, -3.0, -2.0);

  const fryer = createDeepFryer();
  fryer.position.set(6.8, 0, -3.5);
  root.add(fryer);
  addCollision(6.3, 7.3, -4.0, -3.0);

  // Fryer & Grill power switch
  const switchBox = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.35, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xcc2222 })
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
  const officeDesk = createSecurityOfficeDesk(cameraScreens);
  officeDesk.position.set(-4.5, 0, -1.2);
  officeDesk.rotation.y = Math.PI;
  root.add(officeDesk);
  addCollision(-5.5, -3.5, -1.7, -0.7);

  interactiveItems.push({
    id: 'cctv_monitor',
    type: 'cctv_monitor',
    name: 'Security Camera Console',
    actionText: 'Inspect Security Surveillance Cameras',
    position: [-4.5, 1.2, -1.5],
    radius: 2.0,
  });

  // Office auxiliary light breaker switch (Night 2)
  const officeSwitch = new THREE.Mesh(
    new THREE.BoxGeometry(0.15, 0.25, 0.08),
    new THREE.MeshStandardMaterial({ color: 0xcc2222 })
  );
  officeSwitch.position.set(-7.85, 1.5, -0.8);
  root.add(officeSwitch);

  interactiveItems.push({
    id: 'office_switch',
    type: 'kitchen_switch',
    name: 'Night Maintenance Power Switch',
    actionText: 'Turn On Auxiliary Hallway Lights',
    position: [-7.4, 1.5, -0.8],
    radius: 1.8,
  });

  // Locker
  const locker = createLocker();
  locker.position.set(-7.5, 0, -2.5);
  locker.rotation.y = Math.PI / 2;
  root.add(locker);

  // --- WALK-IN FREEZER (X: -8 to -1, Z: -6 to -3) ---
  const freezerShelf = createFreezerShelves();
  freezerShelf.position.set(-4.5, 0, -5.4);
  root.add(freezerShelf);
  addCollision(-5.5, -3.5, -5.8, -5.0);

  // Temperature log clipboard inside freezer
  const freezerClip = createClipboardProp('TEMP LOG');
  freezerClip.position.set(-7.85, 1.4, -4.5);
  freezerClip.rotation.y = Math.PI / 2;
  root.add(freezerClip);
  interactiveMeshes.set('freezer_temp_gauge', freezerClip);

  interactiveItems.push({
    id: 'freezer_temp_gauge',
    type: 'freezer_temp_gauge',
    name: 'Freezer Temp Monitor (-18°C)',
    actionText: 'Record Walk-in Freezer Temperature',
    position: [-7.3, 1.4, -4.5],
    radius: 1.8,
  });

  // Hallway Spill (Night 2)
  const puddle = createHallwayPuddle();
  puddle.position.set(-3.5, 0.01, -0.5);
  root.add(puddle);
  interactiveMeshes.set('hallway_spill', puddle);

  interactiveItems.push({
    id: 'hallway_spill',
    type: 'hallway_spill',
    name: 'Unidentified Fluid Spill',
    actionText: 'Mop & Clean Dark Liquid Puddle',
    position: [-3.5, 0.2, -0.5],
    radius: 1.8,
  });

  // Storage room inventory checklist
  const storageClip = createClipboardProp('SUPPLY LOG');
  storageClip.position.set(-1.15, 1.4, -1.8);
  storageClip.rotation.y = -Math.PI / 2;
  root.add(storageClip);
  interactiveMeshes.set('storage_clipboard', storageClip);

  interactiveItems.push({
    id: 'storage_clipboard',
    type: 'storage_clipboard',
    name: 'Supply Inventory Checklist',
    actionText: 'Sign & Inspect Storage Inventory Log',
    position: [-1.8, 1.4, -1.8],
    radius: 1.8,
  });

  // --- LIGHTING ---
  const hemiLight = new THREE.HemisphereLight(0x223040, 0x0a0f16, 0.35);
  root.add(hemiLight);

  // Dining lights
  const diningLight1 = new THREE.PointLight(0xfff3d6, 0.95, 11);
  diningLight1.position.set(-3.5, 2.9, 3.5);
  root.add(diningLight1);
  flickeringLights.push({ light: diningLight1, baseIntensity: 0.95, flickerRate: 0.04 });

  const diningLight2 = new THREE.PointLight(0xfff3d6, 0.9, 11);
  diningLight2.position.set(3.5, 2.9, 3.5);
  root.add(diningLight2);
  flickeringLights.push({ light: diningLight2, baseIntensity: 0.9, flickerRate: 0.06 });

  // Kitchen light
  const kitchenLight = new THREE.PointLight(0xe8f0f5, 0.85, 10);
  kitchenLight.position.set(3.5, 2.9, -3.0);
  root.add(kitchenLight);
  flickeringLights.push({ light: kitchenLight, baseIntensity: 0.85, flickerRate: 0.05 });

  // Office light
  const officeLight = new THREE.PointLight(0xffd59e, 0.8, 8);
  officeLight.position.set(-4.5, 2.9, -1.5);
  root.add(officeLight);
  flickeringLights.push({ light: officeLight, baseIntensity: 0.8, flickerRate: 0.02 });

  // Freezer light
  const freezerLight = new THREE.PointLight(0x99ddff, 0.65, 8);
  freezerLight.position.set(-4.5, 2.9, -4.5);
  root.add(freezerLight);
  flickeringLights.push({ light: freezerLight, baseIntensity: 0.65, flickerRate: 0.02 });

  // --- RAIN PARTICLE SYSTEM ---
  const rainCount = 1000;
  const rainGeo = new THREE.BufferGeometry();
  const rainPositions = new Float32Array(rainCount * 3);
  for (let i = 0; i < rainCount; i++) {
    rainPositions[i * 3] = (Math.random() - 0.5) * 44;
    rainPositions[i * 3 + 1] = Math.random() * 14;
    rainPositions[i * 3 + 2] = 6 + Math.random() * 22;
  }
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMat = new THREE.PointsMaterial({
    color: 0x88bbdd,
    size: 0.06,
    transparent: true,
    opacity: 0.5,
  });
  const rainSystem = new THREE.Points(rainGeo, rainMat);
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
      position: new THREE.Vector3(-4.0, 2.8, 4.5),
      lookAt: new THREE.Vector3(2.4, 1.0, 0.5),
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

  return {
    scene: root,
    collisionBoxes,
    interactiveItems,
    interactiveMeshes,
    flickeringLights,
    cctvCameras,
    cameraScreens,
    rainSystem,
    parkingSpots,
    slidingDoors,
    rearDoor,
  };
}
