import * as THREE from 'three';
import {
  createStainlessSteelTexture,
  createWarningSignTexture,
} from './textures';

/**
 * Procedural composite 3-12 part 3D models and props for McDonald's Nightfall.
 * Complies with Three.js skill directives:
 * - Composite multi-part groups
 * - Grounded bottom-center pivots
 * - Varied roughness and metalness
 * - Zero external assets
 */

/** 1. Detailed Procedural Sedan Car */
export function createDetailedCar(bodyColor: number = 0x224477): THREE.Group {
  const group = new THREE.Group();

  const paintMat = new THREE.MeshStandardMaterial({
    color: bodyColor,
    metalness: 0.85,
    roughness: 0.25,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });
  const glassMat = new THREE.MeshStandardMaterial({ color: 0x111c24, metalness: 0.9, roughness: 0.1 });
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xffeedd });
  const taillightMat = new THREE.MeshBasicMaterial({ color: 0xdd1111 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.8 });

  // Chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.6, 4.2), paintMat);
  chassis.position.set(0, 0.5, 0);
  chassis.castShadow = true;
  group.add(chassis);

  // Cabin
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.65, 2.2), glassMat);
  cabin.position.set(0, 1.1, -0.2);
  cabin.castShadow = true;
  group.add(cabin);

  // Roof cap
  const roof = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.06, 1.8), paintMat);
  roof.position.set(0, 1.45, -0.2);
  group.add(roof);

  // Bumpers
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.25, 0.2), darkTrimMat);
  frontBumper.position.set(0, 0.35, 2.12);
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.82, 0.25, 0.2), darkTrimMat);
  rearBumper.position.set(0, 0.35, -2.12);
  group.add(frontBumper, rearBumper);

  // Headlights & Taillights
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), headlightMat);
  headL.position.set(-0.65, 0.6, 2.12);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), headlightMat);
  headR.position.set(0.65, 0.6, 2.12);

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), taillightMat);
  tailL.position.set(-0.65, 0.6, -2.12);
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.15, 0.05), taillightMat);
  tailR.position.set(0.65, 0.6, -2.12);
  group.add(headL, headR, tailL, tailR);

  // Wheels
  const wheelPositions = [
    [-0.95, 0.32, 1.3],
    [0.95, 0.32, 1.3],
    [-0.95, 0.32, -1.3],
    [0.95, 0.32, -1.3],
  ];

  wheelPositions.forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.22, 16), tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    tire.castShadow = true;

    const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.23, 8), chromeMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);

    group.add(tire, rim);
  });

  return group;
}

/** 2. Procedural Customer Character Model */
export function createCustomerCharacter(jacketColor: number = 0x334455): THREE.Group {
  const group = new THREE.Group();

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xd8ad88, roughness: 0.6 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.7 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1e272e, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x2c1d11, roughness: 0.8 });

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 12, 12), skinMat);
  head.position.set(0, 1.62, 0);

  const hair = new THREE.Mesh(new THREE.SphereGeometry(0.17, 10, 10), hairMat);
  hair.position.set(0, 1.68, -0.02);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.65, 0.26), jacketMat);
  torso.position.set(0, 1.15, 0);
  torso.castShadow = true;

  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8), pantsMat);
  legL.position.set(-0.12, 0.45, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.8, 8), pantsMat);
  legR.position.set(0.12, 0.45, 0);

  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
  shoeL.position.set(-0.12, 0.06, 0.04);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 0.26), shoeMat);
  shoeR.position.set(0.12, 0.06, 0.04);

  group.add(head, hair, torso, legL, legR, shoeL, shoeR);
  return group;
}

/** 3. Automatic Front Sliding Glass Doors with Motion Sensor */
export function createSlidingGlassDoors(): {
  group: THREE.Group;
  leftGlass: THREE.Mesh;
  rightGlass: THREE.Mesh;
} {
  const group = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.8, roughness: 0.3 });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x7799aa,
    transmission: 0.85,
    roughness: 0.1,
    ior: 1.5,
    transparent: true,
    opacity: 0.45,
  });
  const sensorMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.5 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x22ee33 });

  const header = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 0.25), frameMat);
  header.position.set(0, 2.65, 0);
  group.add(header);

  const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.15), sensorMat);
  sensorBox.position.set(0, 2.7, 0.15);
  const sensorLed = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), ledMat);
  sensorLed.position.set(0, 2.68, 0.23);
  group.add(sensorBox, sensorLed);

  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.2), frameMat);
  postL.position.set(-1.54, 1.3, 0);
  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.2), frameMat);
  postR.position.set(1.54, 1.3, 0);
  group.add(postL, postR);

  const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.5, 0.05), glassMat);
  leftGlass.position.set(-0.48, 1.25, 0);
  group.add(leftGlass);

  const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.5, 0.05), glassMat);
  rightGlass.position.set(0.48, 1.25, 0);
  group.add(rightGlass);

  return { group, leftGlass, rightGlass };
}

/** 4. Compact Fast-Food Cashier Counter */
export function createCompactCashierCounter(): THREE.Group {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2a22, roughness: 0.5 });
  const topMat = new THREE.MeshStandardMaterial({ color: 0xd9cca8, roughness: 0.3, metalness: 0.05 });
  const posMat = new THREE.MeshStandardMaterial({ color: 0x1f2427, metalness: 0.6, roughness: 0.3 });
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x224422 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.05, 0.75), woodMat);
  base.position.set(0, 0.525, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const top = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.06, 0.85), topMat);
  top.position.set(0, 1.08, 0);
  group.add(top);

  // Register POS
  const regBody = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.32), posMat);
  regBody.position.set(-0.7, 1.25, 0);
  const regScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.3, 0.2), screenMat);
  regScreen.position.set(-0.7, 1.28, 0.16);
  group.add(regBody, regScreen);

  // Pinpad
  const pinpad = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.06, 0.18), posMat);
  pinpad.rotation.x = -Math.PI / 8;
  pinpad.position.set(-0.25, 1.13, 0.15);
  group.add(pinpad);

  // Pickup tray
  const trayMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const pickupTray = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.02, 0.4), trayMat);
  pickupTray.position.set(0.8, 1.11, 0);
  group.add(pickupTray);

  // Napkin dispenser
  const napkinDisp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.22), chromeMat);
  napkinDisp.position.set(1.4, 1.2, 0);
  group.add(napkinDisp);

  return group;
}

/** 5. Employee Time Clock Punch Machine */
export function createTimeClockPunch(): THREE.Group {
  const group = new THREE.Group();

  const caseMat = new THREE.MeshStandardMaterial({ color: 0x3d474d, metalness: 0.7, roughness: 0.3 });
  const clockFaceMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const slotMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xcc2222, roughness: 0.4 });

  const body = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.45, 0.16), caseMat);
  body.position.set(0, 0, 0);

  const clockFace = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), clockFaceMat);
  clockFace.position.set(0, 0.08, 0.085);

  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 0.05), slotMat);
  slot.position.set(0, -0.12, 0.085);

  const lever = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.18, 8), handleMat);
  lever.position.set(0.16, 0.05, 0);
  lever.rotation.z = -Math.PI / 4;

  group.add(body, clockFace, slot, lever);
  return group;
}

/** 6. Outdoor Heavy Industrial Garbage Dumpster */
export function createOutdoorDumpster(): THREE.Group {
  const group = new THREE.Group();

  const dumpsterMat = new THREE.MeshStandardMaterial({
    color: 0x1f4728,
    metalness: 0.5,
    roughness: 0.55,
  });
  const blackLidMat = new THREE.MeshStandardMaterial({ color: 0x1c1e1d, roughness: 0.7 });
  const casterMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.4 });

  const tub = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.25, 1.4), dumpsterMat);
  tub.position.set(0, 0.75, 0);
  tub.castShadow = true;
  tub.receiveShadow = true;
  group.add(tub);

  const lidL = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), blackLidMat);
  lidL.position.set(-0.6, 1.4, 0);
  lidL.rotation.z = 0.08;

  const lidR = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), blackLidMat);
  lidR.position.set(0.6, 1.4, 0);
  lidR.rotation.z = -0.05;

  group.add(lidL, lidR);

  const casterPos = [
    [-1.0, 0.1, -0.55],
    [1.0, 0.1, -0.55],
    [-1.0, 0.1, 0.55],
    [1.0, 0.1, 0.55],
  ];
  casterPos.forEach(([cx, cy, cz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.08, 10), casterMat);
    wheel.position.set(cx, cy, cz);
    group.add(wheel);
  });

  return group;
}

/** 7. Rear Service Door with Push Bar */
export function createRearServiceDoor(): { group: THREE.Group; doorLeaf: THREE.Mesh } {
  const group = new THREE.Group();

  const frameMat = new THREE.MeshStandardMaterial({ color: 0x242424, roughness: 0.6 });
  const doorMat = new THREE.MeshStandardMaterial({ color: 0x4a4f52, metalness: 0.7, roughness: 0.4 });
  const barMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });

  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 0.2), frameMat);
  frameL.position.set(-0.55, 1.15, 0);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 0.2), frameMat);
  frameR.position.set(0.55, 1.15, 0);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.2), frameMat);
  frameTop.position.set(0, 2.3, 0);
  group.add(frameL, frameR, frameTop);

  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.08), doorMat);
  doorLeaf.position.set(0, 1.1, 0);
  doorLeaf.castShadow = true;

  const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8), barMat);
  pushBar.rotation.z = Math.PI / 2;
  pushBar.position.set(0, 1.05, 0.06);
  doorLeaf.add(pushBar);

  group.add(doorLeaf);
  return { group, doorLeaf };
}

/** 8. Bundled Cardboard Recycling Box */
export function createCardboardBundle(): THREE.Group {
  const group = new THREE.Group();
  const cardMat = new THREE.MeshStandardMaterial({ color: 0x8a633c, roughness: 0.85 });
  const twineMat = new THREE.MeshStandardMaterial({ color: 0xe0d7b6, roughness: 0.9 });

  const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.35, 0.5), cardMat);
  box1.position.set(0, 0.175, 0);

  const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.25, 0.45), cardMat);
  box2.position.set(0.02, 0.475, -0.02);

  const twine = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.55, 0.02), twineMat);
  twine.position.set(0, 0.32, 0);

  group.add(box1, box2, twine);
  return group;
}

/** 9. Compact Dining Booth */
export function createDiningBooth(): THREE.Group {
  const group = new THREE.Group();

  const vinylMat = new THREE.MeshStandardMaterial({ color: 0xa8201a, roughness: 0.35, metalness: 0.1 });
  const yellowVinylMat = new THREE.MeshStandardMaterial({ color: 0xdf9a14, roughness: 0.35, metalness: 0.1 });
  const tableTopMat = new THREE.MeshStandardMaterial({ color: 0xd9cca8, roughness: 0.25, metalness: 0.05 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, roughness: 0.15, metalness: 0.85 });
  const metalFrameMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.6, metalness: 0.5 });

  const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 16), metalFrameMat);
  tableBase.position.set(0, 0.02, 0);
  group.add(tableBase);

  const tablePole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 12), chromeMat);
  tablePole.position.set(0, 0.42, 0);
  group.add(tablePole);

  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), tableTopMat);
  tableTop.position.set(0, 0.82, 0);
  tableTop.castShadow = true;
  tableTop.receiveShadow = true;
  group.add(tableTop);

  const createBench = (zOffset: number, rotationY: number) => {
    const benchGroup = new THREE.Group();
    benchGroup.position.set(0, 0, zOffset);
    benchGroup.rotation.y = rotationY;

    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), metalFrameMat);
    leg1.position.set(-0.55, 0.225, 0);
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 8), metalFrameMat);
    leg2.position.set(0.55, 0.225, 0);
    benchGroup.add(leg1, leg2);

    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 0.45), vinylMat);
    seat.position.set(0, 0.48, 0);
    seat.castShadow = true;
    benchGroup.add(seat);

    const back = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 0.1), vinylMat);
    back.position.set(0, 0.78, 0.22);
    back.castShadow = true;
    benchGroup.add(back);

    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.08, 0.11), yellowVinylMat);
    stripe.position.set(0, 0.82, 0.22);
    benchGroup.add(stripe);

    return benchGroup;
  };

  group.add(createBench(0.65, 0));
  group.add(createBench(-0.65, Math.PI));
  return group;
}

/** 10. Commercial Kitchen Counter */
export function createKitchenCounter(): THREE.Group {
  const group = new THREE.Group();
  const steelTex = createStainlessSteelTexture();

  const steelMat = new THREE.MeshStandardMaterial({ map: steelTex, metalness: 0.88, roughness: 0.25 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.7, roughness: 0.4 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.85), steelMat);
  top.position.set(0, 0.92, 0);
  top.castShadow = true;
  group.add(top);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.88, 8);
  const legPositions = [
    [-1.0, 0.44, -0.35],
    [1.0, 0.44, -0.35],
    [-1.0, 0.44, 0.35],
    [1.0, 0.44, 0.35],
  ];
  legPositions.forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, darkMetalMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
}

/** 11. Commercial Deep Fryer */
export function createDeepFryer(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = new THREE.MeshStandardMaterial({ color: 0x8a9299, metalness: 0.85, roughness: 0.3 });
  const oilMat = new THREE.MeshStandardMaterial({ color: 0x6e4e10, roughness: 0.1, metalness: 0.2 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.75), steelMat);
  base.position.set(0, 0.475, 0);
  base.castShadow = true;
  group.add(base);

  const oil = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.45), oilMat);
  oil.position.set(0, 0.9, 0.05);
  group.add(oil);

  return group;
}

/** 12. Security Office Desk + CRT Monitors */
export function createSecurityOfficeDesk(cameraScreens: THREE.Mesh[] = []): THREE.Group {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d3027, roughness: 0.7, metalness: 0.1 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });
  const crtCaseMat = new THREE.MeshStandardMaterial({ color: 0x474945, roughness: 0.6, metalness: 0.2 });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.9), woodMat);
  deskTop.position.set(0, 0.8, 0);
  deskTop.castShadow = true;
  group.add(deskTop);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.75), metalMat);
  legL.position.set(-0.65, 0.38, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.75), metalMat);
  legR.position.set(0.65, 0.38, 0);
  group.add(legL, legR);

  // Monitor 1
  const crtBody = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.5, 0.45), crtCaseMat);
  crtBody.position.set(0, 1.15, -0.15);
  group.add(crtBody);

  const crtScreenMat = new THREE.MeshStandardMaterial({
    color: 0x112211,
    emissive: 0x1d4722,
    emissiveIntensity: 0.85,
    roughness: 0.2,
  });
  const crtScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.55, 0.38), crtScreenMat);
  crtScreen.position.set(0, 1.15, 0.08);
  group.add(crtScreen);
  cameraScreens.push(crtScreen);

  // Swivel Chair
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, 0.55);
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.08, 0.45), metalMat);
  chairSeat.position.set(0, 0.5, 0);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.45, 0.06), metalMat);
  chairBack.position.set(0, 0.75, -0.2);
  const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), metalMat);
  chairPole.position.set(0, 0.25, 0);
  chairGroup.add(chairSeat, chairBack, chairPole);
  group.add(chairGroup);

  return group;
}

/** 13. Tall Steel Locker */
export function createLocker(): THREE.Group {
  const group = new THREE.Group();
  const lockerMat = new THREE.MeshStandardMaterial({ color: 0x3f4e56, metalness: 0.7, roughness: 0.45 });
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.0, 0.6), lockerMat);
  body.position.set(0, 1.0, 0);
  body.castShadow = true;
  group.add(body);
  return group;
}

/** 14. Freezer Industrial Wire Shelves */
export function createFreezerShelves(): THREE.Group {
  const group = new THREE.Group();
  const wireMat = new THREE.MeshStandardMaterial({ color: 0x8a9296, metalness: 0.85, roughness: 0.3 });
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x825936, roughness: 0.8 });

  for (let i = 0; i < 3; i++) {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.04, 0.6), wireMat);
    shelf.position.set(0, 0.4 + i * 0.55, 0);
    group.add(shelf);

    if (i > 0) {
      const box = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.28, 0.38), boxMat);
      box.position.set(-0.25 + (i % 2) * 0.5, 0.4 + i * 0.55 + 0.16, 0);
      group.add(box);
    }
  }
  return group;
}

/** 15. Table Mess */
export function createTableMess(): THREE.Group {
  const group = new THREE.Group();
  const wrapperMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.9 });
  const stainMat = new THREE.MeshBasicMaterial({ color: 0x7a1111 });

  const stain = new THREE.Mesh(new THREE.PlaneGeometry(0.35, 0.25), stainMat);
  stain.rotation.x = -Math.PI / 2;
  stain.position.set(0, 0.01, 0);

  const foil = new THREE.Mesh(new THREE.DodecahedronGeometry(0.09, 0), wrapperMat);
  foil.position.set(0.05, 0.09, 0.02);

  group.add(stain, foil);
  return group;
}

/** 16. Fast-Food Trash Bag Item */
export function createTrashBag(): THREE.Group {
  const group = new THREE.Group();
  const bagMat = new THREE.MeshStandardMaterial({ color: 0x181818, roughness: 0.25, metalness: 0.1 });

  const base = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), bagMat);
  base.scale.set(1.1, 0.8, 1.0);
  base.position.set(0, 0.18, 0);

  const knot = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.1, 6), bagMat);
  knot.position.set(0, 0.36, 0);

  group.add(base, knot);
  return group;
}

/** 17. Inspection Clipboard */
export function createClipboardProp(label: string = 'CHECKLIST'): THREE.Group {
  const group = new THREE.Group();
  const boardMat = new THREE.MeshStandardMaterial({ color: 0x8a603c, roughness: 0.8 });
  const paperMat = new THREE.MeshBasicMaterial({ color: 0xededdb });
  const clipMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.9, roughness: 0.2 });

  const board = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.02), boardMat);
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38), paperMat);
  paper.position.set(0, -0.01, 0.015);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.03), clipMat);
  clip.position.set(0, 0.2, 0.02);

  group.add(board, paper, clip);
  return group;
}

/** 18. Hallway Fluid Spill */
export function createHallwayPuddle(): THREE.Group {
  const group = new THREE.Group();
  const puddleMat = new THREE.MeshStandardMaterial({ color: 0x4a0d0d, roughness: 0.1, metalness: 0.2 });

  const puddle = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.65, 0.01, 14), puddleMat);
  puddle.scale.set(1.2, 1, 0.8);
  group.add(puddle);
  return group;
}
