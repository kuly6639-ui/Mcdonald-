import * as THREE from 'three';
import {
  createStainlessSteelTexture,
  createWarningSignTexture,
  createPOSTouchScreenTexture,
  createCustomerPoleDisplayTexture,
  createTimeAttendanceScreenTexture,
  createComputerCCTVScreenTexture,
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

/** 2. Detailed Procedural Customer Character Model */
export function createCustomerCharacter(
  jacketColor: number = 0x334455,
  archetypeIndex: number = 0
): THREE.Group {
  const group = new THREE.Group();
  group.userData.isCustomer = true;

  // Color palettes per archetype
  let pantsColor = 0x1e272e;
  let hairColor = 0x221811;
  let skinTone = 0xdfb490;
  let shoeColor = 0x111111;
  let hatColor: number | null = null;
  let accentColor = 0x888888;

  if (archetypeIndex === 0) {
    // 0. Nurse Ramirez: medical scrub top (teal), scrub pants, white clinic sneakers, stethoscope
    jacketColor = 0x185a6a;
    pantsColor = 0x144a57;
    hairColor = 0x1b130e;
    skinTone = 0xdfb490;
    shoeColor = 0xeeeeee;
    accentColor = 0x22c55e; // badge / lanyard
  } else if (archetypeIndex === 1) {
    // 1. Tyler (Jittery Teen): red oversized hoodie, dark cargo pants, high-top sneakers, skater cap
    jacketColor = 0xa32222;
    pantsColor = 0x242833;
    hairColor = 0x7a4928;
    skinTone = 0xedd0b8;
    shoeColor = 0x111111;
    hatColor = 0x1e2229; // backwards skater cap
    accentColor = 0xdddddd; // white laces/drawstrings
  } else if (archetypeIndex === 2) {
    // 2. Old Man Silas (Cryptic Regular): heavy wool trenchcoat, vintage knit scarf, grey hair, newsboy cap
    jacketColor = 0x3e322a;
    pantsColor = 0x252321;
    hairColor = 0x9e9e9e;
    skinTone = 0xd0ab8b;
    shoeColor = 0x38241b;
    hatColor = 0x473c33;
    accentColor = 0x8a3a34; // burgundy scarf
  } else if (archetypeIndex === 3) {
    // 3. Big Ray (Highway Long-Hauler): denim vest over red/black flannel, work boots, trucker cap, beard
    jacketColor = 0x2c435c; // denim vest
    pantsColor = 0x1d2e3d;
    hairColor = 0x2e2017;
    skinTone = 0xd4a582;
    shoeColor = 0x6e4928; // tan leather work boots
    hatColor = 0xc2410c; // bright trucker cap
    accentColor = 0x8a2020; // flannel sleeves
  } else if (archetypeIndex === 4) {
    // 4. Maya Lin (All-Nighter College Student): plum hoodie, dark jeans, burgundy beanie, glasses
    jacketColor = 0x4c2857;
    pantsColor = 0x1c2536;
    hairColor = 0x141215;
    skinTone = 0xedd3b8;
    shoeColor = 0xe5e5e5;
    hatColor = 0x7f1d1d; // knit beanie
    accentColor = 0xfbbf24; // backpack/college crest detail
  } else if (archetypeIndex === 5) {
    // 5. EMT Carter (Night-Shift Paramedic): navy EMS jacket, neon-yellow reflective strip, black boots
    jacketColor = 0x142642;
    pantsColor = 0x111827;
    hairColor = 0x3b2618;
    skinTone = 0xc6936c;
    shoeColor = 0x0f0f10;
    hatColor = 0x0f1e36; // EMS cap
    accentColor = 0xd9f99d; // hi-vis reflective stripe
  } else if (archetypeIndex === 7) {
    // 7. Sam (Friends Group Leader): navy/amber varsity jacket, jeans, white sneakers
    jacketColor = 0x1e3a5f;
    pantsColor = 0x1d2c3f;
    hairColor = 0x2a1b12;
    skinTone = 0xe6bc98;
    shoeColor = 0xe5e7eb;
    hatColor = 0xd97706;
    accentColor = 0xfbbf24;
  } else if (archetypeIndex === 701) {
    // 701. Leo (Friend #2): olive streetwear hoodie, dark joggers
    jacketColor = 0x3b5239;
    pantsColor = 0x1f2421;
    hairColor = 0x171412;
    skinTone = 0xc99672;
    shoeColor = 0x222222;
    accentColor = 0xe2e8f0;
  } else if (archetypeIndex === 702) {
    // 702. Mia (Friend #3): burgundy flannel over white tee, dark denim
    jacketColor = 0x6b1d2f;
    pantsColor = 0x1e2538;
    hairColor = 0x3a2015;
    skinTone = 0xf1ccb0;
    shoeColor = 0x262626;
    accentColor = 0xf4f4f5;
  } else if (archetypeIndex === 8) {
    // 8. Arthur Crump (Grumpy Man): sour mustard/brown knit cardigan, dark slacks, grey hair
    jacketColor = 0x5c4628;
    pantsColor = 0x252320;
    hairColor = 0x8e9299;
    skinTone = 0xd6ac8a;
    shoeColor = 0x241913;
    accentColor = 0x362c24;
  } else {
    // 6. Clara Novak (Lost Highway Traveler): camel/mustard raincoat, teal scarf, dark slacks
    jacketColor = 0x9c7228;
    pantsColor = 0x222026;
    hairColor = 0x6b2c1a; // auburn hair
    skinTone = 0xf0cbb1;
    shoeColor = 0x3a241b;
    accentColor = 0x1b5e63; // teal travel scarf
  }

  // Shared Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.65 });
  const jacketMat = new THREE.MeshStandardMaterial({ color: jacketColor, roughness: 0.75 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: shoeColor, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.85 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const eyeColorMat = new THREE.MeshStandardMaterial({ color: 0x2e485e, roughness: 0.3 });
  const accentMat = new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.7 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, metalness: 0.85, roughness: 0.2 });

  // 1. Hips / Pelvis (Center Root)
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.22), pantsMat);
  pelvis.position.set(0, 0.86, 0);
  pelvis.castShadow = true;
  group.add(pelvis);

  // Belt
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.23), rubberMat);
  belt.position.set(0, 0.94, 0);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), metalMat);
  buckle.position.set(0, 0.94, 0.12);
  group.add(belt, buckle);

  // 2. Torso (Spine & Chest)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.96, 0);
  group.add(torsoGroup);

  const abdomen = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.22, 0.24), jacketMat);
  abdomen.position.set(0, 0.11, 0);
  abdomen.castShadow = true;
  torsoGroup.add(abdomen);

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.28), jacketMat);
  chest.position.set(0, 0.36, 0);
  chest.castShadow = true;
  torsoGroup.add(chest);

  // Archetype Garment Details on Torso
  if (archetypeIndex === 0) {
    // Nurse V-neck & ID Badge
    const vNeck = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.14, 0.02), skinMat);
    vNeck.position.set(0, 0.44, 0.142);
    const badgeLanyard = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.11, 0.02), whiteMat);
    badgeLanyard.position.set(-0.11, 0.35, 0.145);
    const badgePhoto = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.01), accentMat);
    badgePhoto.position.set(-0.11, 0.37, 0.156);
    // Stethoscope around neck
    const stethTubing = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.015, 8, 16, Math.PI), rubberMat);
    stethTubing.position.set(0, 0.49, 0.06);
    stethTubing.rotation.x = Math.PI / 2.3;
    const stethHead = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.015, 12), metalMat);
    stethHead.position.set(0.07, 0.32, 0.15);
    stethHead.rotation.x = Math.PI / 2;
    torsoGroup.add(vNeck, badgeLanyard, badgePhoto, stethTubing, stethHead);
  } else if (archetypeIndex === 1) {
    // Tyler Kangaroo Hoodie Pocket & Drawstrings
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.16, 0.06), jacketMat);
    pouch.position.set(0, 0.22, 0.15);
    const stringL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), whiteMat);
    stringL.position.set(-0.06, 0.39, 0.15);
    const stringR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.18, 6), whiteMat);
    stringR.position.set(0.06, 0.39, 0.15);
    // Bunchy hood hanging down back
    const hoodBack = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.12), jacketMat);
    hoodBack.position.set(0, 0.44, -0.16);
    hoodBack.rotation.x = 0.2;
    torsoGroup.add(pouch, stringL, stringR, hoodBack);
  } else if (archetypeIndex === 2) {
    // Silas: Wool Scarf & Coat Buttons
    const scarf = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.16, 0.1, 12), accentMat);
    scarf.position.set(0, 0.52, 0);
    const scarfTail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.26, 0.03), accentMat);
    scarfTail.position.set(0.05, 0.38, 0.155);
    scarfTail.rotation.z = -0.12;
    for (let b = 0; b < 3; b++) {
      const coatBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.01, 8), metalMat);
      coatBtn.rotation.x = Math.PI / 2;
      coatBtn.position.set(0, 0.18 + b * 0.11, 0.145);
      torsoGroup.add(coatBtn);
    }
    torsoGroup.add(scarf, scarfTail);
  } else if (archetypeIndex === 3) {
    // Big Ray: Plaid shirt showing at center and arms, heavy vest body
    const shirtCenter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.36, 0.02), accentMat);
    shirtCenter.position.set(0, 0.35, 0.142);
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.03), jacketMat);
    lapelL.position.set(-0.14, 0.35, 0.145);
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.03), jacketMat);
    lapelR.position.set(0.14, 0.35, 0.145);
    torsoGroup.add(shirtCenter, lapelL, lapelR);
  } else if (archetypeIndex === 4) {
    // Maya Lin: Cozy fleece collar & varsity crest
    const collar = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.25), jacketMat);
    collar.position.set(0, 0.53, 0);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.06, 0.015), accentMat);
    badge.position.set(0.1, 0.4, 0.145);
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.14, 0.05), jacketMat);
    pouch.position.set(0, 0.2, 0.145);
    torsoGroup.add(collar, badge, pouch);
  } else if (archetypeIndex === 5) {
    // EMT Carter: Hi-vis reflective safety strip + radio mic
    const stripeFront = new THREE.Mesh(new THREE.BoxGeometry(0.43, 0.06, 0.29), accentMat);
    stripeFront.position.set(0, 0.28, 0);
    const radioMic = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.08, 0.04), rubberMat);
    radioMic.position.set(-0.14, 0.43, 0.15);
    torsoGroup.add(stripeFront, radioMic);
  } else if (archetypeIndex === 7) {
    // Sam: Varsity stripes & crest
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.425, 0.045, 0.285), accentMat);
    stripe.position.set(0, 0.15, 0);
    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.07, 0.015), accentMat);
    crest.position.set(0.11, 0.4, 0.145);
    torsoGroup.add(stripe, crest);
  } else if (archetypeIndex === 701) {
    // Leo: Hoodie pocket & drawstrings
    const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.15, 0.05), jacketMat);
    pouch.position.set(0, 0.22, 0.145);
    const strL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 6), accentMat);
    strL.position.set(-0.05, 0.39, 0.15);
    const strR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 6), accentMat);
    strR.position.set(0.05, 0.39, 0.15);
    torsoGroup.add(pouch, strL, strR);
  } else if (archetypeIndex === 702) {
    // Mia: Open flannel over inner white shirt
    const tee = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.36, 0.02), accentMat);
    tee.position.set(0, 0.35, 0.142);
    torsoGroup.add(tee);
  } else if (archetypeIndex === 8) {
    // Arthur Crump: Cardigan buttons & undershirt
    const shirtV = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.16, 0.02), accentMat);
    shirtV.position.set(0, 0.43, 0.142);
    torsoGroup.add(shirtV);
    for (let b = 0; b < 3; b++) {
      const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.01, 8), rubberMat);
      btn.rotation.x = Math.PI / 2;
      btn.position.set(0, 0.16 + b * 0.09, 0.146);
      torsoGroup.add(btn);
    }
  } else {
    // Clara Novak: Travel raincoat collar & teal scarf
    const scarf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.09, 12), accentMat);
    scarf.position.set(0, 0.52, 0);
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.025), jacketMat);
    lapelL.position.set(-0.08, 0.34, 0.145);
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.3, 0.025), jacketMat);
    lapelR.position.set(0.08, 0.34, 0.145);
    torsoGroup.add(scarf, lapelL, lapelR);
  }

  // 3. Neck & Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.52, 0);
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 10), skinMat);
  neck.position.set(0, -0.02, 0);
  headGroup.add(neck);

  // Skull & Chin
  const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.24), skinMat);
  cranium.position.set(0, 0.12, 0);
  cranium.castShadow = true;
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.11, 0.18), skinMat);
  jaw.position.set(0, 0.01, 0.03);
  headGroup.add(cranium, jaw);

  // 3D Nose
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.06, 0.05), skinMat);
  nose.position.set(0, 0.08, 0.14);
  headGroup.add(nose);

  // Eyes with Sclera & Pupil
  const eyeGeo = new THREE.PlaneGeometry(0.045, 0.028);
  const pupilGeo = new THREE.PlaneGeometry(0.022, 0.022);

  const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
  eyeL.position.set(-0.06, 0.11, 0.122);
  const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
  eyeR.position.set(0.06, 0.11, 0.122);

  const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
  pupilL.position.set(-0.06, 0.11, 0.124);
  const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
  pupilR.position.set(0.06, 0.11, 0.124);

  // Eyebrows (Grumpy man gets deeply furrowed scowling brows + frowning mouth)
  const browMat =
    archetypeIndex === 2 || archetypeIndex === 8
      ? hairMat
      : new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), browMat);
  browL.position.set(-0.06, 0.145, 0.13);
  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), browMat);
  browR.position.set(0.06, 0.145, 0.13);
  if (archetypeIndex === 8) {
    browL.rotation.z = -0.32;
    browR.rotation.z = 0.32;
    browL.position.y = 0.14;
    browR.position.y = 0.14;
  }

  // Ears
  const earGeo = new THREE.BoxGeometry(0.03, 0.07, 0.05);
  const earL = new THREE.Mesh(earGeo, skinMat);
  earL.position.set(-0.13, 0.1, 0);
  const earR = new THREE.Mesh(earGeo, skinMat);
  earR.position.set(0.13, 0.1, 0);

  headGroup.add(eyeL, eyeR, pupilL, pupilR, browL, browR, earL, earR);

  // Hair & Hats by Archetype
  if (archetypeIndex === 0) {
    // Ramirez Bun
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.26), hairMat);
    hairTop.position.set(0, 0.22, 0);
    const hairBun = new THREE.Mesh(new THREE.SphereGeometry(0.08, 10, 10), hairMat);
    hairBun.position.set(0, 0.18, -0.16);
    headGroup.add(hairTop, hairBun);
  } else if (archetypeIndex === 1) {
    // Tyler Skater Cap (turned backwards)
    const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.14, 0.11, 12), new THREE.MeshStandardMaterial({ color: hatColor! }));
    capCrown.position.set(0, 0.21, -0.01);
    const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.14), new THREE.MeshStandardMaterial({ color: hatColor! }));
    capBrim.position.set(0, 0.17, -0.14); // brim facing backward
    capBrim.rotation.x = -0.15;
    // Messy bangs in front
    const bangs = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.05), hairMat);
    bangs.position.set(0, 0.19, 0.12);
    headGroup.add(capCrown, capBrim, bangs);
  } else if (archetypeIndex === 2) {
    // Silas Newsboy / Flat Cap & Receding Grey Hair
    const newsboy = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.14, 0.07, 12), new THREE.MeshStandardMaterial({ color: hatColor! }));
    newsboy.position.set(0, 0.23, 0.02);
    newsboy.rotation.x = -0.1;
    const brim = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.018, 0.1), new THREE.MeshStandardMaterial({ color: hatColor! }));
    brim.position.set(0, 0.19, 0.13);
    const sideHairL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.14), hairMat);
    sideHairL.position.set(-0.125, 0.09, -0.04);
    const sideHairR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.1, 0.14), hairMat);
    sideHairR.position.set(0.125, 0.09, -0.04);
    headGroup.add(newsboy, brim, sideHairL, sideHairR);
  } else if (archetypeIndex === 3) {
    // Ray Trucker Cap & Beard
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), new THREE.MeshStandardMaterial({ color: hatColor! }));
    cap.position.set(0, 0.22, 0.02);
    const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    capVisor.position.set(0, 0.17, 0.16);
    capVisor.rotation.x = 0.1;
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.12), hairMat);
    beard.position.set(0, -0.02, 0.08);
    headGroup.add(cap, capVisor, beard);
  } else if (archetypeIndex === 4) {
    // Maya Lin: Knit beanie, long dark hair back, & glasses frame
    const beanie = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.145, 0.13, 12), new THREE.MeshStandardMaterial({ color: hatColor! }));
    beanie.position.set(0, 0.22, 0);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.24, 0.08), hairMat);
    hairBack.position.set(0, 0.08, -0.13);
    const glassL = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.055, 0.015), rubberMat);
    glassL.position.set(-0.06, 0.11, 0.132);
    const glassR = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.055, 0.015), rubberMat);
    glassR.position.set(0.06, 0.11, 0.132);
    const bridge = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.012, 0.015), rubberMat);
    bridge.position.set(0, 0.115, 0.132);
    headGroup.add(beanie, hairBack, glassL, glassR, bridge);
  } else if (archetypeIndex === 5) {
    // EMT Carter: Navy paramedic cap with visor & short trimmed hair
    const emsCap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.095, 0.25), new THREE.MeshStandardMaterial({ color: hatColor! }));
    emsCap.position.set(0, 0.22, 0.01);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.12), new THREE.MeshStandardMaterial({ color: 0x111111 }));
    visor.position.set(0, 0.17, 0.155);
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.01), accentMat);
    badge.position.set(0, 0.22, 0.14);
    headGroup.add(emsCap, visor, badge);
  } else if (archetypeIndex === 7) {
    // Sam: Varsity orange/amber snapback cap + short hair
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.095, 0.25), new THREE.MeshStandardMaterial({ color: hatColor! }));
    cap.position.set(0, 0.22, 0);
    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.17, 0.02, 0.12), new THREE.MeshStandardMaterial({ color: 0x1e293b }));
    visor.position.set(0, 0.175, 0.15);
    headGroup.add(cap, visor);
  } else if (archetypeIndex === 701) {
    // Leo: Curly/cropped dark hair
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.12, 0.26), hairMat);
    hairTop.position.set(0, 0.22, 0);
    headGroup.add(hairTop);
  } else if (archetypeIndex === 702) {
    // Mia: Chestnut hair with ponytail
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), hairMat);
    hairTop.position.set(0, 0.22, 0);
    const ponytail = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.22, 0.09), hairMat);
    ponytail.position.set(0, 0.1, -0.16);
    ponytail.rotation.x = 0.18;
    headGroup.add(hairTop, ponytail);
  } else if (archetypeIndex === 8) {
    // Arthur Crump: Greying combed side hair, bushy moustache, deep frown mouth
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.1, 0.16), hairMat);
    sideL.position.set(-0.125, 0.12, -0.02);
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.1, 0.16), hairMat);
    sideR.position.set(0.125, 0.12, -0.02);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.12, 0.06), hairMat);
    hairBack.position.set(0, 0.12, -0.12);
    const moustache = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.03, 0.03), hairMat);
    moustache.position.set(0, 0.035, 0.125);
    const frown = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.015, 0.015), rubberMat);
    frown.position.set(0, -0.01, 0.124);
    headGroup.add(sideL, sideR, hairBack, moustache, frown);
  } else {
    // Clara Novak: Auburn bob-cut hair
    const hairTop = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.1, 0.27), hairMat);
    hairTop.position.set(0, 0.22, 0);
    const hairBack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.08), hairMat);
    hairBack.position.set(0, 0.08, -0.13);
    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.18), hairMat);
    sideL.position.set(-0.13, 0.09, 0.0);
    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.18), hairMat);
    sideR.position.set(0.13, 0.09, 0.0);
    headGroup.add(hairTop, hairBack, sideL, sideR);
  }

  // 4. Arms & Hands (Pivot at Shoulders)
  const armSleeveMat = archetypeIndex === 3 ? accentMat : jacketMat;

  // Left Arm
  const armL = new THREE.Group();
  armL.position.set(-0.25, 1.4, 0);
  group.add(armL);

  const bicepL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.28, 8), armSleeveMat);
  bicepL.position.set(0, -0.14, 0);
  bicepL.castShadow = true;
  armL.add(bicepL);

  const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.24, 8), armSleeveMat);
  forearmL.position.set(0, -0.38, 0.02);
  armL.add(forearmL);

  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), skinMat);
  handL.position.set(0, -0.52, 0.02);
  const thumbL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), skinMat);
  thumbL.position.set(0.04, -0.5, 0.03);
  armL.add(handL, thumbL);

  // Right Arm
  const armR = new THREE.Group();
  armR.position.set(0.25, 1.4, 0);
  group.add(armR);

  const bicepR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.06, 0.28, 8), armSleeveMat);
  bicepR.position.set(0, -0.14, 0);
  bicepR.castShadow = true;
  armR.add(bicepR);

  const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.24, 8), armSleeveMat);
  forearmR.position.set(0, -0.38, 0.02);
  armR.add(forearmR);

  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), skinMat);
  handR.position.set(0, -0.52, 0.02);
  const thumbR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.05, 0.03), skinMat);
  thumbR.position.set(-0.04, -0.5, 0.03);
  armR.add(handR, thumbR);

  // 5. Legs & Shoes (Pivot at Hips)
  // Left Leg
  const legL = new THREE.Group();
  legL.position.set(-0.11, 0.84, 0);
  group.add(legL);

  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8), pantsMat);
  thighL.position.set(0, -0.2, 0);
  thighL.castShadow = true;
  legL.add(thighL);

  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.38, 8), pantsMat);
  calfL.position.set(0, -0.56, 0);
  calfL.castShadow = true;
  legL.add(calfL);

  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), shoeMat);
  footL.position.set(0, -0.78, 0.05);
  footL.castShadow = true;
  const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.28), rubberMat);
  soleL.position.set(0, -0.83, 0.05);
  legL.add(footL, soleL);

  // Right Leg
  const legR = new THREE.Group();
  legR.position.set(0.11, 0.84, 0);
  group.add(legR);

  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8), pantsMat);
  thighR.position.set(0, -0.2, 0);
  thighR.castShadow = true;
  legR.add(thighR);

  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.38, 8), pantsMat);
  calfR.position.set(0, -0.56, 0);
  calfR.castShadow = true;
  legR.add(calfR);

  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), shoeMat);
  footR.position.set(0, -0.78, 0.05);
  footR.castShadow = true;
  const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.28), rubberMat);
  soleR.position.set(0, -0.83, 0.05);
  legR.add(footR, soleR);

  // Store references for dynamic procedural limb animation
  group.userData.limbs = {
    head: headGroup,
    torso: torsoGroup,
    armL,
    armR,
    legL,
    legR,
  };

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

/** 4A. Detailed Fast-Food POS Cash Register System */
export function createDetailedCashRegisterModel(regNum: number = 1): THREE.Group {
  const group = new THREE.Group();

  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x1f2327,
    metalness: 0.75,
    roughness: 0.35,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.9,
    roughness: 0.15,
  });
  const blackPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x141618,
    roughness: 0.65,
  });
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xfafafa,
    roughness: 0.9,
  });
  const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x22ee44 });
  const ledRedMat = new THREE.MeshBasicMaterial({ color: 0xee2222 });

  // 1. Heavy Metal Cash Drawer Base
  const cashDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.10, 0.42), darkSteelMat);
  cashDrawer.position.set(0, 0.05, 0);
  cashDrawer.castShadow = true;
  cashDrawer.receiveShadow = true;
  group.add(cashDrawer);

  // Cash drawer front seam & key lock cylinder
  const drawerFront = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.08, 0.02), darkSteelMat);
  drawerFront.position.set(0, 0.05, 0.211);
  const keyLock = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.025, 8), chromeMat);
  keyLock.rotation.x = Math.PI / 2;
  keyLock.position.set(0.14, 0.05, 0.222);
  const keySlit = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.012, 0.005), blackPlasticMat);
  keySlit.position.set(0.14, 0.05, 0.235);
  // Emergency bill drop slot
  const billSlot = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.008, 0.01), blackPlasticMat);
  billSlot.position.set(-0.06, 0.065, 0.221);
  group.add(drawerFront, keyLock, keySlit, billSlot);

  // 2. Heavy Curved Mounting Neck
  const mountBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 0.04, 12), darkSteelMat);
  mountBase.position.set(0, 0.11, -0.05);
  const mountArm = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.035, 0.18, 10), darkSteelMat);
  mountArm.position.set(0, 0.20, -0.05);
  mountArm.rotation.x = 0.18; // Lean slightly forward
  group.add(mountBase, mountArm);

  // 3. Main 15" Fast-Food Touchscreen POS Terminal
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 0.32, -0.03);
  monitorGroup.rotation.x = -Math.PI / 4.8; // Angled ~37 degrees towards cashier
  group.add(monitorGroup);

  // Monitor Housing Bezel
  const monitorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.40, 0.30, 0.045), darkSteelMat);
  monitorBezel.castShadow = true;
  monitorGroup.add(monitorBezel);

  // McDonald's Touchscreen Display
  const posScreenTex = createPOSTouchScreenTexture(regNum);
  const posScreenMat = new THREE.MeshBasicMaterial({ map: posScreenTex });
  const touchScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.26), posScreenMat);
  touchScreen.position.set(0, 0, 0.024);
  monitorGroup.add(touchScreen);

  // Magnetic Stripe Card Reader along right bezel
  const msrReader = new THREE.Mesh(new THREE.BoxGeometry(0.024, 0.26, 0.03), blackPlasticMat);
  msrReader.position.set(0.205, 0, 0.01);
  const msrSlit = new THREE.Mesh(new THREE.BoxGeometry(0.004, 0.24, 0.02), darkSteelMat);
  msrSlit.position.set(0.205, 0, 0.02);
  monitorGroup.add(msrReader, msrSlit);

  // Power LED & branding badge
  const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.005, 6, 6), ledGreenMat);
  powerLed.position.set(0.17, -0.13, 0.025);
  monitorGroup.add(powerLed);

  // 4. Elevated Customer-Facing VFD Pole Display
  const poleGroup = new THREE.Group();
  poleGroup.position.set(-0.14, 0.10, -0.16);
  group.add(poleGroup);

  const vfdPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.38, 8), darkSteelMat);
  vfdPole.position.set(0, 0.19, 0);
  poleGroup.add(vfdPole);

  const vfdHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.045), blackPlasticMat);
  vfdHead.position.set(0, 0.38, 0);
  vfdHead.rotation.x = 0.15; // Angled down towards customer line
  poleGroup.add(vfdHead);

  const poleDisplayTex = createCustomerPoleDisplayTexture();
  const poleDisplayMat = new THREE.MeshBasicMaterial({ map: poleDisplayTex });
  const vfdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.22, 0.055), poleDisplayMat);
  vfdScreen.position.set(0, 0.38, -0.024);
  vfdScreen.rotation.y = Math.PI; // Faces customer (+Z lobby)
  vfdScreen.rotation.x = -0.15;
  poleGroup.add(vfdScreen);

  // 5. Thermal Receipt Printer
  const printerGroup = new THREE.Group();
  printerGroup.position.set(-0.28, 0.10, 0.02);
  group.add(printerGroup);

  const printerBody = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.11, 0.15), darkSteelMat);
  printerBody.position.set(0, 0.055, 0);
  const printerLid = new THREE.Mesh(new THREE.BoxGeometry(0.125, 0.02, 0.11), blackPlasticMat);
  printerLid.position.set(0, 0.115, -0.01);
  const paperSlip = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.002, 0.04), paperMat);
  paperSlip.position.set(0, 0.126, 0.035);
  paperSlip.rotation.x = -0.3;
  const feedBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.005, 6), blackPlasticMat);
  feedBtn.position.set(0.045, 0.115, 0.05);
  const printerLed = new THREE.Mesh(new THREE.SphereGeometry(0.004, 6, 6), ledGreenMat);
  printerLed.position.set(0.045, 0.115, 0.065);
  printerGroup.add(printerBody, printerLid, paperSlip, feedBtn, printerLed);

  // 6. Barcode Scanner in Cradle
  const scannerGroup = new THREE.Group();
  scannerGroup.position.set(0.28, 0.10, 0.06);
  group.add(scannerGroup);

  const cradle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.08), blackPlasticMat);
  cradle.position.set(0, 0.04, 0);
  cradle.rotation.x = 0.25;

  const gunHead = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, 0.08), darkSteelMat);
  gunHead.position.set(0, 0.10, 0.02);
  const gunLens = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.03), ledRedMat);
  gunLens.position.set(0, 0.10, 0.061);
  const gunGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.09, 8), blackPlasticMat);
  gunGrip.position.set(0, 0.05, -0.01);
  gunGrip.rotation.x = -0.4;
  scannerGroup.add(cradle, gunHead, gunLens, gunGrip);

  // 7. Customer Contactless Chip & PIN Terminal (Angled towards customer)
  const pinpadGroup = new THREE.Group();
  pinpadGroup.position.set(0.18, 0.10, 0.24);
  pinpadGroup.rotation.y = Math.PI; // Face customer
  group.add(pinpadGroup);

  const pinpadStand = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.025, 0.06, 8), darkSteelMat);
  pinpadStand.position.set(0, 0.03, 0);
  const pinpadBody = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.035, 0.16), blackPlasticMat);
  pinpadBody.position.set(0, 0.07, 0);
  pinpadBody.rotation.x = -0.35; // Tilted for easy pin entry
  const pinpadScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.05), new THREE.MeshBasicMaterial({ color: 0x113322 }));
  pinpadScreen.position.set(0, 0.085, -0.035);
  pinpadScreen.rotation.x = -0.35;
  const pinpadKeys = new THREE.Mesh(new THREE.PlaneGeometry(0.075, 0.065), darkSteelMat);
  pinpadKeys.position.set(0, 0.073, 0.025);
  pinpadKeys.rotation.x = -0.35;
  pinpadGroup.add(pinpadStand, pinpadBody, pinpadScreen, pinpadKeys);

  return group;
}

/** 4B. Compact Fast-Food Cashier Counter with Multiple Cash Registers */
export function createCompactCashierCounter(): THREE.Group {
  const group = new THREE.Group();

  const woodMat = new THREE.MeshStandardMaterial({ color: 0x4a2a22, roughness: 0.5 });
  const topMat = new THREE.MeshStandardMaterial({ color: 0xd9cca8, roughness: 0.3, metalness: 0.05 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.15 });

  // Main Counter Base & Countertop
  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.05, 0.75), woodMat);
  base.position.set(0, 0.525, 0);
  base.castShadow = true;
  base.receiveShadow = true;
  group.add(base);

  const top = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.06, 0.85), topMat);
  top.position.set(0, 1.08, 0);
  top.receiveShadow = true;
  group.add(top);

  // Front Service Cash Register #1 (Left Counter Lane)
  const reg1 = createDetailedCashRegisterModel(1);
  reg1.position.set(-0.85, 1.08, 0.0);
  group.add(reg1);

  // Front Service Cash Register #2 (Center-Right Counter Lane)
  const reg2 = createDetailedCashRegisterModel(2);
  reg2.position.set(0.65, 1.08, 0.0);
  group.add(reg2);

  // Food Pickup Tray at Register 1
  const trayMat = new THREE.MeshStandardMaterial({ color: 0xcccccc, metalness: 0.9, roughness: 0.2 });
  const pickupTray1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.32), trayMat);
  pickupTray1.position.set(-0.85, 1.09, 0.26);
  group.add(pickupTray1);

  // Food Pickup Tray at Register 2
  const pickupTray2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.32), trayMat);
  pickupTray2.position.set(0.65, 1.09, 0.26);
  group.add(pickupTray2);

  // Center Straws & Napkin Dispenser
  const napkinDisp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.22), chromeMat);
  napkinDisp.position.set(-0.10, 1.18, 0.05);
  const strawDisp = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.22, 12), chromeMat);
  strawDisp.position.set(0.10, 1.19, 0.05);
  group.add(napkinDisp, strawDisp);

  return group;
}

/** 5. Detailed Employee Biometric Time Attendance Machine Model */
export function createDetailedTimeAttendanceMachineModel(): THREE.Group {
  const group = new THREE.Group();

  const caseMat = new THREE.MeshStandardMaterial({
    color: 0x272c33, // Industrial dark slate ABS
    metalness: 0.45,
    roughness: 0.4,
  });
  const faceplateMat = new THREE.MeshStandardMaterial({
    color: 0x3d4550,
    metalness: 0.6,
    roughness: 0.3,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.9,
    roughness: 0.15,
  });
  const keyMat = new THREE.MeshStandardMaterial({
    color: 0x181a1d,
    roughness: 0.7,
  });
  const biometricPrismMat = new THREE.MeshStandardMaterial({
    color: 0x00ff88,
    emissive: 0x00ff88,
    emissiveIntensity: 1.2,
    roughness: 0.1,
    transparent: true,
    opacity: 0.9,
  });
  const ledGreenMat = new THREE.MeshBasicMaterial({ color: 0x22ee44 });
  const ledRedMat = new THREE.MeshBasicMaterial({ color: 0xee2222 });
  const ledAmberMat = new THREE.MeshBasicMaterial({ color: 0xffaa22 });

  // 1. Industrial Wall Backplate / Mounting Frame
  const backplate = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.52, 0.02), caseMat);
  backplate.position.set(0, 0, 0);
  group.add(backplate);

  // 2. Main Terminal Housing Unit
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.46, 0.12), faceplateMat);
  body.position.set(0, 0, 0.06);
  body.castShadow = true;
  group.add(body);

  // Beveled header trim
  const headerTrim = new THREE.Mesh(new THREE.BoxGeometry(0.322, 0.05, 0.122), caseMat);
  headerTrim.position.set(0, 0.21, 0.06);
  group.add(headerTrim);

  // 3. Backlit Digital LCD Screen
  const screenTex = createTimeAttendanceScreenTexture();
  const screenMat = new THREE.MeshBasicMaterial({ map: screenTex });
  const lcdScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.13), screenMat);
  lcdScreen.position.set(0, 0.11, 0.122);
  group.add(lcdScreen);

  // 4. Biometric Optical Fingerprint Scanner (Angled 45° cradle)
  const scannerBezel = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.08, 0.04), caseMat);
  scannerBezel.position.set(-0.08, -0.06, 0.13);
  scannerBezel.rotation.x = -0.4;

  const fingerprintPrism = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.025), biometricPrismMat);
  fingerprintPrism.position.set(-0.08, -0.055, 0.145);
  fingerprintPrism.rotation.x = -0.4;
  group.add(scannerBezel, fingerprintPrism);

  // Localized green glow from the fingerprint sensor
  const fingerGlow = new THREE.PointLight(0x00ff88, 0.6, 1.2);
  fingerGlow.position.set(-0.08, -0.05, 0.22);
  group.add(fingerGlow);

  // 5. Tactile Rubber Keypad (3x4 matrix + 4 function buttons)
  const keypadGroup = new THREE.Group();
  keypadGroup.position.set(0.07, -0.08, 0.122);
  group.add(keypadGroup);

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 3; c++) {
      const key = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.016, 0.01), keyMat);
      key.position.set((c - 1) * 0.03, (1.5 - r) * 0.024, 0);
      keypadGroup.add(key);
    }
  }

  // 4 illuminated mode buttons (IN, OUT, BREAK, OT)
  for (let m = 0; m < 4; m++) {
    const modeBtn = new THREE.Mesh(
      new THREE.BoxGeometry(0.05, 0.014, 0.01),
      m === 0 ? ledGreenMat : keyMat
    );
    modeBtn.position.set(-0.08, 0.005 - m * 0.02, 0.125);
    group.add(modeBtn);
  }

  // 6. Time Card Feed Slot with Stainless Steel Throat
  const punchSlot = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.015, 0.06), chromeMat);
  punchSlot.position.set(0, 0.24, 0.06);
  const slotInterior = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.006, 0.05), keyMat);
  slotInterior.position.set(0, 0.24, 0.06);
  group.add(punchSlot, slotInterior);

  // 7. Status Indicator LEDs
  const ledOk = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), ledGreenMat);
  ledOk.position.set(0.12, 0.205, 0.122);
  const ledErr = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), ledRedMat);
  ledErr.position.set(0.09, 0.205, 0.122);
  const ledPwr = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), ledAmberMat);
  ledPwr.position.set(0.06, 0.205, 0.122);
  group.add(ledOk, ledErr, ledPwr);

  // 8. Wall-Mounted Employee Time Card Organizer Rack (Mounted right next to machine)
  const cardRackGroup = new THREE.Group();
  cardRackGroup.position.set(0.32, 0, 0.02);
  group.add(cardRackGroup);

  const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.48, 0.06), caseMat);
  cardRackGroup.add(rackFrame);

  const cardMat = new THREE.MeshStandardMaterial({ color: 0xfffaea, roughness: 0.8 });
  const duckCardMat = new THREE.MeshStandardMaterial({ color: 0xffeedd, roughness: 0.7 });

  // 7 slotted employee punch cards
  for (let s = 0; s < 7; s++) {
    const isDuckCard = s === 3;
    const card = new THREE.Mesh(
      new THREE.BoxGeometry(0.14, 0.06, 0.006),
      isDuckCard ? duckCardMat : cardMat
    );
    // Duck's card is pulled slightly out ready to punch
    const yPos = 0.18 - s * 0.055;
    const zOffset = isDuckCard ? 0.038 : 0.032;
    card.position.set(0, yPos, zOffset);
    card.rotation.x = -0.1;
    cardRackGroup.add(card);

    if (isDuckCard) {
      // Red header on Duck's card
      const duckHeader = new THREE.Mesh(new THREE.BoxGeometry(0.138, 0.015, 0.002), new THREE.MeshBasicMaterial({ color: 0xcc2222 }));
      duckHeader.position.set(0, yPos + 0.02, zOffset + 0.004);
      duckHeader.rotation.x = -0.1;
      cardRackGroup.add(duckHeader);
    }
  }

  return group;
}

/** Legacy wrapper for Time Clock Punch */
export function createTimeClockPunch(): THREE.Group {
  return createDetailedTimeAttendanceMachineModel();
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

/** 9B. Seated Dining Customer Model in Booth (with McCafé Coffee & Fries on Table) */
export function createSeatedCustomerInBooth(archetypeIndex: number = 2): THREE.Group {
  const group = new THREE.Group();

  // Color palettes per archetype
  let coatColor = 0x3e322a;
  let pantsColor = 0x252321;
  let hairColor = 0x9e9e9e;
  let skinTone = 0xd0ab8b;
  let hatColor = 0x473c33;
  let scarfColor = 0x8a3a34;

  const skinMat = new THREE.MeshStandardMaterial({ color: skinTone, roughness: 0.65 });
  const coatMat = new THREE.MeshStandardMaterial({ color: coatColor, roughness: 0.75 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: pantsColor, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x38241b, roughness: 0.6 });
  const hairMat = new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.85 });
  const hatMat = new THREE.MeshStandardMaterial({ color: hatColor, roughness: 0.7 });
  const scarfMat = new THREE.MeshStandardMaterial({ color: scarfColor, roughness: 0.75 });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // 1. Lower Body (Seated on bench: Bench seat surface is at Y: 0.48, Z: 0.65)
  // Pelvis
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.14, 0.22), pantsMat);
  pelvis.position.set(0, 0.54, 0.62);
  pelvis.castShadow = true;
  group.add(pelvis);

  // Thighs (extending forward towards table, from Z: 0.62 to Z: 0.24)
  const thighL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.38), pantsMat);
  thighL.position.set(-0.10, 0.54, 0.43);
  const thighR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, 0.38), pantsMat);
  thighR.position.set(0.10, 0.54, 0.43);
  group.add(thighL, thighR);

  // Calves / Lower Legs (dropping vertically down towards floor from knees at Z: 0.24)
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.44, 8), pantsMat);
  calfL.position.set(-0.10, 0.26, 0.24);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.44, 8), pantsMat);
  calfR.position.set(0.10, 0.26, 0.24);
  group.add(calfL, calfR);

  // Shoes resting on floor
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.22), shoeMat);
  shoeL.position.set(-0.10, 0.05, 0.20);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.22), shoeMat);
  shoeR.position.set(0.10, 0.05, 0.20);
  group.add(shoeL, shoeR);

  // 2. Torso (Leaning slightly forward towards table)
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.61, 0.62);
  torsoGroup.rotation.x = -0.12; // Gentle slouch / forward lean
  group.add(torsoGroup);

  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.40, 0.26), coatMat);
  torso.position.set(0, 0.20, 0);
  torso.castShadow = true;
  torsoGroup.add(torso);

  // Scarf & Neck
  const scarf = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.12, 10), scarfMat);
  scarf.position.set(0, 0.42, 0);
  torsoGroup.add(scarf);

  // Head
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 0.54, 0.02);
  torsoGroup.add(headGroup);

  const head = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.22, 0.22), skinMat);
  head.position.set(0, 0.08, 0);
  head.castShadow = true;
  headGroup.add(head);

  // Newsboy cap
  const capCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.14, 0.08, 12), hatMat);
  capCrown.position.set(0, 0.20, -0.01);
  const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.02, 0.12), hatMat);
  capBrim.position.set(0, 0.16, -0.13); // Brim facing table (-Z)
  capBrim.rotation.x = -0.15;
  headGroup.add(capCrown, capBrim);

  // Eyes (facing forward towards -Z across the table)
  const eyeL = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.02), eyeMat);
  eyeL.position.set(-0.06, 0.08, -0.111);
  eyeL.rotation.y = Math.PI;
  const eyeR = new THREE.Mesh(new THREE.PlaneGeometry(0.03, 0.02), eyeMat);
  eyeR.position.set(0.06, 0.08, -0.111);
  eyeR.rotation.y = Math.PI;
  headGroup.add(eyeL, eyeR);

  // Grey beard
  const beard = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.08, 0.08), hairMat);
  beard.position.set(0, -0.02, -0.08);
  headGroup.add(beard);

  // 3. Arms & Hands resting naturally on table (Table top is at Y: 0.82)
  // Left arm
  const armL = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.36), coatMat);
  armL.position.set(-0.24, 0.78, 0.44);
  armL.rotation.x = 0.4;
  armL.rotation.y = -0.2;
  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.10), skinMat);
  handL.position.set(-0.18, 0.83, 0.24);
  group.add(armL, handL);

  // Right arm holding coffee
  const armR = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.09, 0.36), coatMat);
  armR.position.set(0.24, 0.78, 0.44);
  armR.rotation.x = 0.4;
  armR.rotation.y = 0.2;
  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.10), skinMat);
  handR.position.set(0.18, 0.83, 0.24);
  group.add(armR, handR);

  // 4. Meal on Table in Front of Customer (Table surface: Y: 0.82, Z: 0)
  const mealGroup = new THREE.Group();
  mealGroup.position.set(0, 0.82, 0);
  group.add(mealGroup);

  // McCafé Coffee Cup
  const cupMat = new THREE.MeshStandardMaterial({ color: 0xf5f5f5, roughness: 0.3 });
  const sleeveMat = new THREE.MeshStandardMaterial({ color: 0x8a5a36, roughness: 0.8 });
  const lidMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.4 });

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.032, 0.14, 12), cupMat);
  cup.position.set(0.12, 0.07, 0.14);
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.038, 0.06, 12), sleeveMat);
  sleeve.position.set(0.12, 0.065, 0.14);
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.044, 0.044, 0.015, 12), lidMat);
  lid.position.set(0.12, 0.145, 0.14);
  mealGroup.add(cup, sleeve, lid);

  // McDonald's Red French Fry Carton
  const fryCartonMat = new THREE.MeshStandardMaterial({ color: 0xd92222, roughness: 0.5 });
  const fryMat = new THREE.MeshStandardMaterial({ color: 0xf5b800, roughness: 0.6 });

  const fryBox = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.10, 0.05), fryCartonMat);
  fryBox.position.set(-0.12, 0.05, 0.12);
  fryBox.rotation.y = 0.2;
  mealGroup.add(fryBox);

  // Crispy Fries sticking out of carton
  for (let f = 0; f < 6; f++) {
    const fry = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.08, 0.008), fryMat);
    fry.position.set(
      -0.14 + (f % 3) * 0.02 + (Math.random() - 0.5) * 0.005,
      0.09 + Math.random() * 0.02,
      0.11 + Math.floor(f / 3) * 0.015
    );
    fry.rotation.z = (Math.random() - 0.5) * 0.2;
    mealGroup.add(fry);
  }

  // Wrapped Cheeseburger in Paper Wrap
  const burgerMat = new THREE.MeshStandardMaterial({ color: 0xf5f0e1, roughness: 0.85 });
  const burger = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.045, 10), burgerMat);
  burger.position.set(-0.02, 0.025, 0.02);
  burger.scale.set(1.2, 1, 1);
  mealGroup.add(burger);

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

/** 12. Full Detailed 90s Computer Setup (Desktop Unit, CRT Monitor, Keyboard, Mouse, Mousepad) */
export function createDetailedPCModel(cameraScreens: THREE.Mesh[] = []): THREE.Group {
  const pcGroup = new THREE.Group();

  // Retro 90s PC Materials
  const beigeCaseMat = new THREE.MeshStandardMaterial({
    color: 0xd4cebd, // Classic retro off-white / beige PC plastic
    roughness: 0.6,
    metalness: 0.1,
  });
  const driveBayMat = new THREE.MeshStandardMaterial({
    color: 0xc4bea8,
    roughness: 0.55,
  });
  const darkPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x222426,
    roughness: 0.65,
  });
  const metalChassisMat = new THREE.MeshStandardMaterial({
    color: 0x888b8e,
    metalness: 0.8,
    roughness: 0.25,
  });
  const crtScreenMat = new THREE.MeshStandardMaterial({
    color: 0x0c1c10,
    emissive: 0x1f4c28,
    emissiveIntensity: 0.9,
    roughness: 0.15,
  });
  const keycapMat = new THREE.MeshStandardMaterial({
    color: 0xd8d3c2,
    roughness: 0.5,
  });
  const keyDarkMat = new THREE.MeshStandardMaterial({
    color: 0x545759,
    roughness: 0.55,
  });
  const mousePadMat = new THREE.MeshStandardMaterial({
    color: 0x1b2838, // Navy blue neoprene fabric mousepad
    roughness: 0.85,
  });
  const ledGreen = new THREE.MeshBasicMaterial({ color: 0x22ee44 });
  const ledRed = new THREE.MeshBasicMaterial({ color: 0xee2222 });
  const ledAmber = new THREE.MeshBasicMaterial({ color: 0xffaa22 });
  const cableMat = new THREE.MeshStandardMaterial({
    color: 0x282a2d,
    roughness: 0.8,
  });

  // --- A. DESKTOP SYSTEM UNIT (Horizontal PC Case) ---
  const tower = new THREE.Group();
  tower.position.set(0, 0.075, -0.04);
  pcGroup.add(tower);

  // Main beige metal/plastic chassis
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 0.44), beigeCaseMat);
  chassis.castShadow = true;
  chassis.receiveShadow = true;
  tower.add(chassis);

  // Metal rear backplate with power plug & fan cutout
  const rearPlate = new THREE.Mesh(new THREE.PlaneGeometry(0.46, 0.13), metalChassisMat);
  rearPlate.position.set(0, 0, -0.221);
  rearPlate.rotation.y = Math.PI;
  const powerPlug = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.04, 0.03), darkPlasticMat);
  powerPlug.position.set(-0.16, 0.02, -0.23);
  tower.add(rearPlate, powerPlug);

  // Front Bezel Panel
  const frontFace = new THREE.Mesh(new THREE.BoxGeometry(0.47, 0.14, 0.02), beigeCaseMat);
  frontFace.position.set(0, 0, 0.221);
  tower.add(frontFace);

  // 1. Two 5.25" Drive Bays on Right side (Upper: 48x CD-ROM Drive, Lower: Blanking plate)
  const cdDrive = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.042, 0.025), driveBayMat);
  cdDrive.position.set(0.12, 0.035, 0.228);
  const cdTrayLine = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.004, 0.005), darkPlasticMat);
  cdTrayLine.position.set(0.12, 0.038, 0.242);
  const cdEjectBtn = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.012, 0.008), darkPlasticMat);
  cdEjectBtn.position.set(0.19, 0.022, 0.242);
  const cdLed = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.004), ledGreen);
  cdLed.position.set(0.16, 0.022, 0.242);
  tower.add(cdDrive, cdTrayLine, cdEjectBtn, cdLed);

  // Lower 5.25" blank bay
  const blankBay = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.038, 0.02), driveBayMat);
  blankBay.position.set(0.12, -0.015, 0.226);
  tower.add(blankBay);

  // 2. 3.5" Floppy Disk Drive
  const floppyDrive = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.032, 0.02), driveBayMat);
  floppyDrive.position.set(-0.06, 0.035, 0.228);
  const floppySlot = new THREE.Mesh(new THREE.BoxGeometry(0.10, 0.006, 0.005), darkPlasticMat);
  floppySlot.position.set(-0.06, 0.04, 0.24);
  const floppyEject = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.012, 0.008), darkPlasticMat);
  floppyEject.position.set(-0.01, 0.028, 0.24);
  const floppyLed = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.008, 0.004), ledGreen);
  floppyLed.position.set(-0.11, 0.028, 0.24);
  tower.add(floppyDrive, floppySlot, floppyEject, floppyLed);

  // 3. Power Button, Reset Button, and Turbo 7-Segment Speed Display
  const powerBtn = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.015), darkPlasticMat);
  powerBtn.position.set(-0.18, 0.028, 0.235);
  const resetBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.01, 8), darkPlasticMat);
  resetBtn.rotation.x = Math.PI / 2;
  resetBtn.position.set(-0.14, -0.03, 0.235);

  // Turbo LED Digital Display ("66" MHz speed readout)
  const turboPanel = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.03, 0.01), darkPlasticMat);
  turboPanel.position.set(-0.18, -0.03, 0.232);
  const turboDig1 = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.018), ledGreen);
  turboDig1.position.set(-0.19, -0.03, 0.238);
  const turboDig2 = new THREE.Mesh(new THREE.PlaneGeometry(0.012, 0.018), ledGreen);
  turboDig2.position.set(-0.17, -0.03, 0.238);

  // Status LEDs: Power (Green), HDD (Amber/Red)
  const powerLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 6), ledGreen);
  powerLed.position.set(-0.09, -0.02, 0.238);
  const hddLed = new THREE.Mesh(new THREE.SphereGeometry(0.007, 6, 6), ledRed);
  hddLed.position.set(-0.06, -0.02, 0.238);

  // Air Intake Grille Slats on Left
  for (let s = 0; s < 5; s++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.004, 0.005), darkPlasticMat);
    slat.position.set(-0.16, -0.055 + s * 0.009, 0.232);
    tower.add(slat);
  }
  tower.add(powerBtn, resetBtn, turboPanel, turboDig1, turboDig2, powerLed, hddLed);

  // --- B. RETRO CRT COLOR MONITOR (Resting on System Unit) ---
  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 0.15, -0.04);
  pcGroup.add(monitorGroup);

  // 1. Swivel Stand Base & Neck
  const standBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.15, 0.022, 16), beigeCaseMat);
  standBase.position.set(0, 0.011, 0);
  const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.055, 0.045, 12), darkPlasticMat);
  standNeck.position.set(0, 0.045, 0);
  monitorGroup.add(standBase, standNeck);

  // 2. Deep Tapered CRT Housing Case
  const monitorBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.38), beigeCaseMat);
  monitorBody.position.set(0, 0.28, 0);
  monitorBody.castShadow = true;
  monitorGroup.add(monitorBody);

  // Rear Taper Wedge & Heat Ventilation Grilles
  const rearWedge = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.34, 0.12), beigeCaseMat);
  rearWedge.position.set(0, 0.28, -0.22);
  const rearVents = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.2), darkPlasticMat);
  rearVents.position.set(0, 0.3, -0.281);
  rearVents.rotation.y = Math.PI;
  monitorGroup.add(rearWedge, rearVents);

  // 3. Beveled Front Monitor Face Frame
  const monitorBezel = new THREE.Mesh(new THREE.BoxGeometry(0.50, 0.40, 0.04), beigeCaseMat);
  monitorBezel.position.set(0, 0.28, 0.20);
  monitorGroup.add(monitorBezel);

  // 4. Recessed CRT Curved Glass Screen (Surveillance camera feed)
  const cctvScreenTex = createComputerCCTVScreenTexture();
  const cctvScreenMat = new THREE.MeshBasicMaterial({ map: cctvScreenTex });
  const crtScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.30), cctvScreenMat);
  crtScreen.position.set(0, 0.30, 0.222);
  monitorGroup.add(crtScreen);
  cameraScreens.push(crtScreen);

  // Localized CRT screen phosphor glow illuminating the keyboard and desk
  const screenGlow = new THREE.PointLight(0x00ff66, 0.7, 2.2);
  screenGlow.position.set(0, 0.30, 0.40);
  monitorGroup.add(screenGlow);

  // Monitor Brand Emblem
  const emblem = new THREE.Mesh(new THREE.PlaneGeometry(0.04, 0.015), metalChassisMat);
  emblem.position.set(0, 0.46, 0.222);
  monitorGroup.add(emblem);

  // Front Control Dials: Power Rocker, Degauss, Brightness & Contrast Knobs
  const monPowerBtn = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.02, 0.01), darkPlasticMat);
  monPowerBtn.position.set(0.19, 0.125, 0.22);
  const monPowerLed = new THREE.Mesh(new THREE.SphereGeometry(0.006, 6, 6), ledGreen);
  monPowerLed.position.set(0.22, 0.125, 0.225);

  const degaussBtn = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.008, 8), darkPlasticMat);
  degaussBtn.rotation.x = Math.PI / 2;
  degaussBtn.position.set(0.13, 0.125, 0.22);

  const knob1 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.008, 8), darkPlasticMat);
  knob1.rotation.x = Math.PI / 2;
  knob1.position.set(-0.16, 0.125, 0.22);

  const knob2 = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.008, 8), darkPlasticMat);
  knob2.rotation.x = Math.PI / 2;
  knob2.position.set(-0.12, 0.125, 0.22);
  monitorGroup.add(monPowerBtn, monPowerLed, degaussBtn, knob1, knob2);

  // Signal / VGA cable from monitor back to PC case
  const vgaCable = new THREE.Mesh(new THREE.CylinderGeometry(0.01, 0.01, 0.35, 8), cableMat);
  vgaCable.position.set(0.12, 0.14, -0.22);
  vgaCable.rotation.x = 0.5;
  monitorGroup.add(vgaCable);

  // --- C. COMPUTER KEYBOARD ---
  const keyboardGroup = new THREE.Group();
  keyboardGroup.position.set(-0.06, 0.015, 0.28);
  keyboardGroup.rotation.x = 0.08; // Ergonomic 5-degree tilt
  pcGroup.add(keyboardGroup);

  // Beveled beige keyboard case
  const keyBase = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.028, 0.18), beigeCaseMat);
  keyBase.castShadow = true;
  keyboardGroup.add(keyBase);

  // Recessed dark keybed tray
  const keyBed = new THREE.Mesh(new THREE.PlaneGeometry(0.44, 0.16), darkPlasticMat);
  keyBed.position.set(0, 0.015, 0);
  keyBed.rotation.x = -Math.PI / 2;
  keyboardGroup.add(keyBed);

  // Top Function keys bar (F1-F12)
  const fKeyBar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.01, 0.018), keycapMat);
  fKeyBar.position.set(0, 0.02, -0.065);
  keyboardGroup.add(fKeyBar);

  // Main QWERTY typing section (individual clusters)
  const mainKeys = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.012, 0.095), keycapMat);
  mainKeys.position.set(-0.08, 0.02, 0);
  const spaceBar = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.014, 0.022), keycapMat);
  spaceBar.position.set(-0.07, 0.022, 0.065);
  keyboardGroup.add(mainKeys, spaceBar);

  // Inverted-T arrow key cluster
  const arrowKeys = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.012, 0.05), keyDarkMat);
  arrowKeys.position.set(0.095, 0.02, 0.04);
  keyboardGroup.add(arrowKeys);

  // 10-key numeric keypad on right
  const numpad = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.012, 0.11), keycapMat);
  numpad.position.set(0.17, 0.02, 0.01);
  keyboardGroup.add(numpad);

  // Status LEDs (Num, Caps, Scroll Lock)
  for (let l = 0; l < 3; l++) {
    const kLed = new THREE.Mesh(new THREE.PlaneGeometry(0.005, 0.005), ledGreen);
    kLed.position.set(0.15 + l * 0.014, 0.02, -0.065);
    kLed.rotation.x = -Math.PI / 2;
    keyboardGroup.add(kLed);
  }

  // Keyboard coiled wire snaking towards desktop case
  const keyCable = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.005, 0.18, 6), cableMat);
  keyCable.position.set(-0.16, 0.02, 0.14);
  keyCable.rotation.x = Math.PI / 2;
  keyboardGroup.add(keyCable);

  // --- D. COMPUTER MOUSE & MOUSEPAD (Palace) ---
  // Mousepad ("palace")
  const mousePad = new THREE.Mesh(new THREE.BoxGeometry(0.20, 0.005, 0.22), mousePadMat);
  mousePad.position.set(0.32, 0.003, 0.28);
  mousePad.receiveShadow = true;
  pcGroup.add(mousePad);

  // Two-button Contoured Mouse
  const mouseGroup = new THREE.Group();
  mouseGroup.position.set(0.32, 0.022, 0.28);
  mouseGroup.rotation.y = -0.15; // Natural angled hand rest
  pcGroup.add(mouseGroup);

  const mouseBody = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.028, 0.11), beigeCaseMat);
  mouseBody.castShadow = true;
  mouseGroup.add(mouseBody);

  // Left & Right Buttons Split Seam
  const mouseSeam = new THREE.Mesh(new THREE.BoxGeometry(0.003, 0.006, 0.05), darkPlasticMat);
  mouseSeam.position.set(0, 0.015, 0.03);
  mouseGroup.add(mouseSeam);

  // Mouse cable curving backward
  const mouseCable = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.24, 6), cableMat);
  mouseCable.position.set(0, 0, -0.12);
  mouseCable.rotation.x = Math.PI / 2;
  mouseGroup.add(mouseCable);

  return pcGroup;
}

/** 13. Security Office Desk + Complete PC Workstation */
export function createSecurityOfficeDesk(cameraScreens: THREE.Mesh[] = []): THREE.Group {
  const group = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0x3d3027, roughness: 0.7, metalness: 0.1 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.5, metalness: 0.6 });

  // 1. Desk Surface & Legs
  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.95), woodMat);
  deskTop.position.set(0, 0.8, 0);
  deskTop.castShadow = true;
  deskTop.receiveShadow = true;
  group.add(deskTop);

  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.8), metalMat);
  legL.position.set(-0.68, 0.38, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.8), metalMat);
  legR.position.set(0.68, 0.38, 0);
  group.add(legL, legR);

  // 2. Full Detailed Retro PC Workstation Model (Desk Center)
  const computer = createDetailedPCModel(cameraScreens);
  computer.position.set(0, 0.84, -0.06);
  group.add(computer);

  // 3. Ergonomic Office Swivel Chair
  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, 0.58);

  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.46), metalMat);
  chairSeat.position.set(0, 0.5, 0);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.06), metalMat);
  chairBack.position.set(0, 0.76, -0.2);
  const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 8), metalMat);
  chairPole.position.set(0, 0.25, 0);

  // 5-star wheeled base
  for (let c = 0; c < 5; c++) {
    const angle = (c * 2 * Math.PI) / 5;
    const legCaster = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.25), metalMat);
    legCaster.position.set(Math.sin(angle) * 0.12, 0.04, Math.cos(angle) * 0.12);
    legCaster.rotation.y = angle;
    chairGroup.add(legCaster);
  }

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

/** 19. Commercial Janitor Mop & Yellow Bucket */
export function createMopAndBucket(): THREE.Group {
  const group = new THREE.Group();

  const yellowMat = new THREE.MeshStandardMaterial({
    color: 0xdb9d14, // Commercial safety yellow
    roughness: 0.45,
    metalness: 0.1,
  });
  const blackPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x1c1e1f,
    roughness: 0.6,
  });
  const mopStrandMat = new THREE.MeshStandardMaterial({
    color: 0xdedede, // Cotton mop strands
    roughness: 0.9,
  });
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x4a7c59, // Green powder-coated steel mop handle
    metalness: 0.7,
    roughness: 0.3,
  });

  // 1. Yellow Bucket Tub
  const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.32), yellowMat);
  bucket.position.set(0, 0.2, 0);
  group.add(bucket);

  // 2. Black Press Wringer on top
  const wringer = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.26), blackPlasticMat);
  wringer.position.set(0.06, 0.42, 0);
  group.add(wringer);

  // 3. Wringer Handle
  const wringerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 6), blackPlasticMat);
  wringerHandle.position.set(0.18, 0.52, 0);
  wringerHandle.rotation.z = Math.PI / 4;
  group.add(wringerHandle);

  // 4. Caster Wheels
  const casterGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.03, 8);
  const casterPositions = [
    [-0.14, 0.03, -0.12],
    [0.14, 0.03, -0.12],
    [-0.14, 0.03, 0.12],
    [0.14, 0.03, 0.12],
  ];
  casterPositions.forEach(([cx, cy, cz]) => {
    const caster = new THREE.Mesh(casterGeo, blackPlasticMat);
    caster.position.set(cx, cy, cz);
    group.add(caster);
  });

  // 5. String Mop leaning inside bucket (hidden when held by Duck)
  const mopGroup = new THREE.Group();
  const mopHead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.16, 8), mopStrandMat);
  mopHead.position.set(-0.06, 0.24, 0);

  const mopStick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25, 8), handleMat);
  mopStick.position.set(-0.16, 0.72, 0);
  mopStick.rotation.z = 0.22; // Natural lean against bucket rim / wall
  mopGroup.add(mopHead, mopStick);
  group.add(mopGroup);
  group.userData.mopInBucket = mopGroup;

  return group;
}

/** 18. Compact Drive-Thru Order Station (Relocated to Counter Corner) */
export function createDriveThruOrderStation(): THREE.Group {
  const group = new THREE.Group();

  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1b2024, metalness: 0.7, roughness: 0.35 });
  const plasticMat = new THREE.MeshStandardMaterial({ color: 0x2d3436, roughness: 0.6 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0x888888, metalness: 0.85, roughness: 0.2 });
  const screenMat = new THREE.MeshBasicMaterial({ color: 0x224433 }); // illuminated green CRT monitor
  const menuScreenMat = new THREE.MeshBasicMaterial({ color: 0x3d3015 }); // amber mini order preview
  const greenLedMat = new THREE.MeshBasicMaterial({ color: 0x22dd55 });
  const redLedMat = new THREE.MeshBasicMaterial({ color: 0xee2222 });

  // 1. Countertop Mounting Stand
  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 12), metalMat);
  stand.position.set(0, 0.125, 0);
  group.add(stand);

  // 2. Main Order Terminal Body
  const terminal = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.24), plasticMat);
  terminal.position.set(0, 0.35, 0);
  terminal.rotation.x = -Math.PI / 10;
  terminal.castShadow = true;
  group.add(terminal);

  // 3. Illuminated Order Display Screen
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.2), screenMat);
  screen.position.set(0, 0.36, 0.125);
  screen.rotation.x = -Math.PI / 10;
  group.add(screen);

  // 4. Intercom Speaker Box
  const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.12), darkMat);
  speaker.position.set(0.24, 0.25, -0.05);
  group.add(speaker);

  const speakerGrill = new THREE.Mesh(new THREE.PlaneGeometry(0.14, 0.12), new THREE.MeshBasicMaterial({ color: 0x111111 }));
  speakerGrill.position.set(0.24, 0.25, 0.015);
  group.add(speakerGrill);

  // 5. Flexible Gooseneck Microphone
  const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.08, 8), metalMat);
  micBase.position.set(-0.2, 0.2, 0.08);
  const micHead = new THREE.Mesh(new THREE.SphereGeometry(0.022, 8, 8), darkMat);
  micHead.position.set(-0.16, 0.36, 0.16);
  group.add(micBase, micHead);

  // 6. Mini Illuminated Menu Status Screen (Order Queue Board)
  const menuBoard = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.22, 0.04), darkMat);
  menuBoard.position.set(-0.24, 0.45, -0.06);
  menuBoard.rotation.y = Math.PI / 8;
  const menuFace = new THREE.Mesh(new THREE.PlaneGeometry(0.23, 0.18), menuScreenMat);
  menuFace.position.set(-0.24, 0.45, -0.038);
  menuFace.rotation.y = Math.PI / 8;
  group.add(menuBoard, menuFace);

  // 7. Sensor Indicator LEDs
  const led1 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), greenLedMat);
  led1.position.set(0.12, 0.48, 0.08);
  const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.012, 6, 6), redLedMat);
  led2.position.set(0.16, 0.48, 0.08);
  group.add(led1, led2);

  return group;
}

/** 17. High-Detail Commercial Coffee & Espresso Machine (Placed on Kitchen Food Prep Table) */
export function createCommercialCoffeeMachine(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const steelMat = new THREE.MeshStandardMaterial({
    color: 0x98a0a8,
    metalness: 0.88,
    roughness: 0.22,
  });
  const darkCaseMat = new THREE.MeshStandardMaterial({
    color: 0x202224,
    metalness: 0.5,
    roughness: 0.5,
  });
  const blackPlasticMat = new THREE.MeshStandardMaterial({
    color: 0x141416,
    roughness: 0.7,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xd8d8d8,
    metalness: 0.95,
    roughness: 0.12,
  });
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.85,
    ior: 1.5,
    transparent: true,
    opacity: 0.6,
  });
  const beanMat = new THREE.MeshStandardMaterial({
    color: 0x3b2219,
    roughness: 0.85,
  });
  const coffeeLiquidMat = new THREE.MeshStandardMaterial({
    color: 0x1a0f0a,
    roughness: 0.2,
  });
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0xdfd4bc,
    roughness: 0.6,
  });
  const cupLidMat = new THREE.MeshStandardMaterial({
    color: 0x1a1a1a,
    roughness: 0.5,
  });
  const ledAmber = new THREE.MeshBasicMaterial({ color: 0xff9900 });
  const ledGreen = new THREE.MeshBasicMaterial({ color: 0x00ff66 });
  const ledRed = new THREE.MeshBasicMaterial({ color: 0xff2222 });

  // 1. Machine Main Chassis Body
  const baseChassis = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.52, 0.44), steelMat);
  baseChassis.position.set(0, 0.26, 0);
  baseChassis.castShadow = true;
  baseChassis.receiveShadow = true;
  group.add(baseChassis);

  // Side decorative dark panels
  const sidePanelL = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.48, 0.42), darkCaseMat);
  sidePanelL.position.set(-0.365, 0.26, 0);
  const sidePanelR = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.48, 0.42), darkCaseMat);
  sidePanelR.position.set(0.365, 0.26, 0);
  group.add(sidePanelL, sidePanelR);

  // 2. Drip Tray and Perforated Stainless Steel Grate
  const dripTray = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 0.22), steelMat);
  dripTray.position.set(0, 0.025, 0.20);
  const dripGrate = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.005, 0.19), darkCaseMat);
  dripGrate.position.set(0, 0.052, 0.20);
  group.add(dripTray, dripGrate);

  // 3. Dual Group Heads with Portafilters & Handles
  const groupHeadL = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 12), chromeMat);
  groupHeadL.position.set(-0.16, 0.32, 0.18);
  const groupHeadR = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.06, 12), chromeMat);
  groupHeadR.position.set(0.16, 0.32, 0.18);

  // Portafilter handles extending outward
  const handleL = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.14, 8), blackPlasticMat);
  handleL.position.set(-0.16, 0.29, 0.26);
  handleL.rotation.x = Math.PI / 2;
  const handleR = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.012, 0.14, 8), blackPlasticMat);
  handleR.position.set(0.16, 0.29, 0.26);
  handleR.rotation.x = Math.PI / 2;
  group.add(groupHeadL, groupHeadR, handleL, handleR);

  // 4. Dual Steam Wands
  const steamWandL = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), chromeMat);
  steamWandL.position.set(-0.28, 0.22, 0.18);
  steamWandL.rotation.z = -0.3;
  const steamWandR = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.16, 8), chromeMat);
  steamWandR.position.set(0.28, 0.22, 0.18);
  steamWandR.rotation.z = 0.3;
  group.add(steamWandL, steamWandR);

  // 5. Front Control Panel: Digital Pressure Gauges & Espresso Dispense Buttons
  const controlPanel = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.12, 0.02), darkCaseMat);
  controlPanel.position.set(0, 0.42, 0.221);
  group.add(controlPanel);

  // Pressure Gauge Dials (Boiler Bar 0-16)
  const gauge1 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12), chromeMat);
  gauge1.rotation.x = Math.PI / 2;
  gauge1.position.set(-0.25, 0.42, 0.23);
  const gaugeFace1 = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), ledAmber);
  gaugeFace1.position.set(-0.25, 0.42, 0.236);
  const gauge2 = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.01, 12), chromeMat);
  gauge2.rotation.x = Math.PI / 2;
  gauge2.position.set(-0.16, 0.42, 0.23);
  const gaugeFace2 = new THREE.Mesh(new THREE.CircleGeometry(0.03, 12), ledGreen);
  gaugeFace2.position.set(-0.16, 0.42, 0.236);
  group.add(gauge1, gaugeFace1, gauge2, gaugeFace2);

  // Push buttons for Single/Double espresso shots
  for (let b = 0; b < 4; b++) {
    const btn = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.01, 8), chromeMat);
    btn.rotation.x = Math.PI / 2;
    btn.position.set(0.02 + b * 0.065, 0.42, 0.23);
    group.add(btn);
  }

  // 6. Overhead Heated Cup Warmer Rack with Stack of McCafé Cups
  const cupRailing = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.04, 0.36), chromeMat);
  cupRailing.position.set(0, 0.54, 0);
  group.add(cupRailing);

  // 4 McCafé paper cups warming on top
  const cupPositions = [
    [-0.22, 0.56, -0.06],
    [-0.10, 0.56, -0.06],
    [-0.22, 0.56, 0.08],
    [-0.10, 0.56, 0.08],
  ];
  cupPositions.forEach(([cx, cy, cz]) => {
    const paperCup = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.028, 0.09, 10), cupMat);
    paperCup.position.set(cx, cy + 0.045, cz);
    const paperLid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.01, 10), cupLidMat);
    paperLid.position.set(cx, cy + 0.095, cz);
    group.add(paperCup, paperLid);
  });

  // 7. Twin Clear Bean Hoppers on Top with Dark Roasted Coffee Beans
  const hopperL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.05, 0.16, 12), glassMat);
  hopperL.position.set(0.12, 0.62, -0.04);
  const beansInsideL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.045, 0.13, 10), beanMat);
  beansInsideL.position.set(0.12, 0.605, -0.04);
  const hopperLidL = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.015, 12), blackPlasticMat);
  hopperLidL.position.set(0.12, 0.705, -0.04);

  const hopperR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.05, 0.16, 12), glassMat);
  hopperR.position.set(0.26, 0.62, -0.04);
  const beansInsideR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.045, 0.13, 10), beanMat);
  beansInsideR.position.set(0.26, 0.605, -0.04);
  const hopperLidR = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.015, 12), blackPlasticMat);
  hopperLidR.position.set(0.26, 0.705, -0.04);

  group.add(hopperL, beansInsideL, hopperLidL, hopperR, beansInsideR, hopperLidR);

  // 8. Drip Coffee Glass Carafe Pot on Left Hot Plate
  const carafeGroup = new THREE.Group();
  carafeGroup.position.set(-0.16, 0.08, 0.20);
  const potGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.07, 0.14, 12), glassMat);
  potGlass.position.y = 0.07;
  const potCoffee = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.09, 10), coffeeLiquidMat);
  potCoffee.position.y = 0.05;
  const potHandle = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 6, 12, Math.PI), blackPlasticMat);
  potHandle.position.set(0.065, 0.08, 0);
  potHandle.rotation.z = -Math.PI / 2;
  const potLid = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.068, 0.015, 12), blackPlasticMat);
  potLid.position.y = 0.145;
  carafeGroup.add(potGlass, potCoffee, potHandle, potLid);
  group.add(carafeGroup);

  return group;
}

/** 18. Fried Chicken Bucket Model with Crispy Golden Drumsticks & Tenders */
export function createFriedChickenBucket(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const bucketMat = new THREE.MeshStandardMaterial({
    color: 0xcc1111, // Fast food red
    roughness: 0.4,
  });
  const yellowStripeMat = new THREE.MeshStandardMaterial({
    color: 0xffbb00, // Golden yellow
    roughness: 0.35,
  });
  const whiteRimMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.5,
  });
  const chickenMat = new THREE.MeshStandardMaterial({
    color: 0xc47b1e, // Golden brown crispy fried crust
    roughness: 0.75,
    metalness: 0.1,
  });
  const boneMat = new THREE.MeshStandardMaterial({
    color: 0xf5f0e1, // Chicken bone tip
    roughness: 0.6,
  });

  // Tapered Bucket Body (tapered cylinder: rTop: 0.12, rBottom: 0.09, h: 0.20)
  const bucketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.20, 16), bucketMat);
  bucketBody.position.y = 0.10;
  bucketBody.castShadow = true;
  group.add(bucketBody);

  // Center golden yellow band
  const yellowBand = new THREE.Mesh(new THREE.CylinderGeometry(0.116, 0.096, 0.07, 16), yellowStripeMat);
  yellowBand.position.y = 0.10;
  group.add(yellowBand);

  // Top rolled rim
  const rim = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.008, 8, 16), whiteRimMat);
  rim.position.y = 0.20;
  rim.rotation.x = Math.PI / 2;
  group.add(rim);

  // Golden Fried Chicken Drumsticks & Pieces filling bucket
  const pieceConfigs = [
    { x: -0.04, z: -0.03, rotX: 0.3, rotZ: -0.3, scale: 1.0 },
    { x: 0.05, z: -0.02, rotX: -0.2, rotZ: 0.35, scale: 0.95 },
    { x: 0.0, z: 0.05, rotX: 0.4, rotZ: 0.1, scale: 1.1 },
    { x: -0.03, z: 0.03, rotX: -0.3, rotZ: -0.2, scale: 0.9 },
    { x: 0.04, z: 0.03, rotX: 0.15, rotZ: 0.4, scale: 1.05 },
  ];

  pieceConfigs.forEach((cfg) => {
    const piece = new THREE.Group();
    piece.position.set(cfg.x, 0.18, cfg.z);
    piece.rotation.set(cfg.rotX, 0, cfg.rotZ);
    piece.scale.setScalar(cfg.scale);

    // Crispy drumstick meat bulb
    const meat = new THREE.Mesh(new THREE.SphereGeometry(0.042, 8, 8), chickenMat);
    meat.scale.set(1.0, 1.45, 0.9);
    meat.position.y = 0.035;

    // Bone tip
    const bone = new THREE.Mesh(new THREE.CylinderGeometry(0.009, 0.011, 0.06, 6), boneMat);
    bone.position.y = -0.025;

    piece.add(meat, bone);
    group.add(piece);
  });

  return group;
}

/** 19. Commercial Fried Chicken Vending & Warming Showcase Machine with Pressure Fryer */
export function createFriedChickenVendingMachine(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const stainlessSteelMat = new THREE.MeshStandardMaterial({
    color: 0x9098a0,
    metalness: 0.88,
    roughness: 0.25,
  });
  const darkSteelMat = new THREE.MeshStandardMaterial({
    color: 0x25282c,
    metalness: 0.7,
    roughness: 0.4,
  });
  const warmGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xffeedd,
    metalness: 0.05,
    roughness: 0.08,
    transmission: 0.88,
    ior: 1.5,
    transparent: true,
    opacity: 0.55,
  });
  const wireRackMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 0.92,
    roughness: 0.15,
  });
  const heatLampMat = new THREE.MeshBasicMaterial({
    color: 0xff8800, // Glowing hot infrared amber heating lamp
  });
  const goldenSignMat = new THREE.MeshBasicMaterial({
    color: 0xffbc0d, // Signature McDonald's Golden Yellow
  });
  const redBannerMat = new THREE.MeshStandardMaterial({
    color: 0xbb1111,
    roughness: 0.4,
  });
  const oilMat = new THREE.MeshStandardMaterial({
    color: 0x5a3e10,
    roughness: 0.15,
    metalness: 0.3,
  });
  const chickenMat = new THREE.MeshStandardMaterial({
    color: 0xc47b1e,
    roughness: 0.7,
    metalness: 0.1,
  });
  const handleRedMat = new THREE.MeshStandardMaterial({
    color: 0xcc2222,
    roughness: 0.6,
  });

  // --- LOWER SECTION: COMMERCIAL PRESSURE FRYER BASE (Height: 0 to 0.92) ---
  const fryerBase = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.92, 0.85), stainlessSteelMat);
  fryerBase.position.set(0, 0.46, 0);
  fryerBase.castShadow = true;
  fryerBase.receiveShadow = true;
  group.add(fryerBase);

  // Twin open oil vats
  const vatL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.55), oilMat);
  vatL.position.set(-0.22, 0.88, 0.05);
  const vatR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.55), oilMat);
  vatR.position.set(0.22, 0.88, 0.05);
  group.add(vatL, vatR);

  // Wire fryer baskets with red heat-resistant handles
  const basketL = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.48), wireRackMat);
  basketL.position.set(-0.22, 0.98, 0.05);
  const handleMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), handleRedMat);
  handleMeshL.rotation.x = Math.PI / 4;
  handleMeshL.position.set(-0.22, 1.15, 0.36);

  const basketR = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.48), wireRackMat);
  basketR.position.set(0.22, 0.98, 0.05);
  const handleMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.28, 8), handleRedMat);
  handleMeshR.rotation.x = Math.PI / 4;
  handleMeshR.position.set(0.22, 1.15, 0.36);

  group.add(basketL, handleMeshL, basketR, handleMeshR);

  // Fryer control knobs and digital temperature display
  const tempDisplay = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.08, 0.02), darkSteelMat);
  tempDisplay.position.set(0, 0.75, 0.435);
  const tempLed = new THREE.Mesh(new THREE.PlaneGeometry(0.18, 0.05), new THREE.MeshBasicMaterial({ color: 0x00ff66 }));
  tempLed.position.set(0, 0.75, 0.447);
  group.add(tempDisplay, tempLed);

  for (let k = 0; k < 3; k++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 10), darkSteelMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(-0.3 + k * 0.3, 0.62, 0.435);
    group.add(knob);
  }

  // --- UPPER SECTION: HEATED FRIED CHICKEN DISPLAY WARMER SHOWCASE (Height: 0.92 to 1.78) ---
  const warmerFrame = new THREE.Group();
  warmerFrame.position.set(0, 0.92, -0.05);
  group.add(warmerFrame);

  // Glass showcase enclosure
  const glassFront = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.65), warmGlassMat);
  glassFront.position.set(0, 0.36, 0.42);
  const glassBack = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 0.65), warmGlassMat);
  glassBack.position.set(0, 0.36, -0.42);
  glassBack.rotation.y = Math.PI;
  const glassLeft = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.65), warmGlassMat);
  glassLeft.position.set(-0.44, 0.36, 0);
  glassLeft.rotation.y = Math.PI / 2;
  const glassRight = new THREE.Mesh(new THREE.PlaneGeometry(0.80, 0.65), warmGlassMat);
  glassRight.position.set(0.44, 0.36, 0);
  glassRight.rotation.y = -Math.PI / 2;

  warmerFrame.add(glassFront, glassBack, glassLeft, glassRight);

  // Four corner stainless steel frame posts
  const postCorners = [
    [-0.44, 0.36, 0.41],
    [0.44, 0.36, 0.41],
    [-0.44, 0.36, -0.41],
    [0.44, 0.36, -0.41],
  ];
  postCorners.forEach(([px, py, pz]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.72, 0.035), stainlessSteelMat);
    post.position.set(px, py, pz);
    warmerFrame.add(post);
  });

  // Two tiered stainless steel wire display racks inside warmer
  const rack1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.72), wireRackMat);
  rack1.position.set(0, 0.20, 0);
  const rack2 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.72), wireRackMat);
  rack2.position.set(0, 0.46, 0);
  warmerFrame.add(rack1, rack2);

  // Golden fried chicken pieces arranged on racks
  const chickenPositions = [
    [-0.26, 0.24, -0.15],
    [-0.10, 0.24, -0.12],
    [0.08, 0.24, -0.16],
    [0.24, 0.24, -0.14],
    [-0.20, 0.24, 0.16],
    [0.0, 0.24, 0.18],
    [0.22, 0.24, 0.15],
    [-0.18, 0.50, -0.08],
    [0.02, 0.50, -0.06],
    [0.20, 0.50, -0.10],
  ];

  chickenPositions.forEach(([cx, cy, cz]) => {
    const chickenPiece = new THREE.Mesh(new THREE.SphereGeometry(0.045, 6, 6), chickenMat);
    chickenPiece.scale.set(1.4, 0.9, 1.1);
    chickenPiece.position.set(cx, cy, cz);
    warmerFrame.add(chickenPiece);
  });

  // Fried Chicken Buckets inside display showcase
  const bucket1 = createFriedChickenBucket();
  bucket1.scale.setScalar(0.75);
  bucket1.position.set(-0.25, 0.21, 0.12);
  const bucket2 = createFriedChickenBucket();
  bucket2.scale.setScalar(0.75);
  bucket2.position.set(0.25, 0.21, 0.12);
  warmerFrame.add(bucket1, bucket2);

  // Overhead glowing amber/infrared heat lamps casting warm light on the chicken
  const heatLamp1 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8), heatLampMat);
  heatLamp1.rotation.z = Math.PI / 2;
  heatLamp1.position.set(0, 0.68, -0.18);
  const heatLamp2 = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 8), heatLampMat);
  heatLamp2.rotation.z = Math.PI / 2;
  heatLamp2.position.set(0, 0.68, 0.18);
  warmerFrame.add(heatLamp1, heatLamp2);

  // Top Lightbox Canopy Sign: "CRISPY FRIED CHICKEN"
  const topCanopy = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.86), redBannerMat);
  topCanopy.position.set(0, 0.78, 0);
  const signFaceFront = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.12), goldenSignMat);
  signFaceFront.position.set(0, 0.78, 0.435);
  warmerFrame.add(topCanopy, signFaceFront);

  return group;
}

/** 20. Food Preparation Area Table Items (Condiments, Burger Boxes, Tongs, Wraps, Cups) */
export function createFoodPrepTableItems(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const ketchupMat = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.35 });
  const mustardMat = new THREE.MeshStandardMaterial({ color: 0xf5b800, roughness: 0.35 });
  const mayoMat = new THREE.MeshStandardMaterial({ color: 0xfffaea, roughness: 0.35 });
  const bottleCapMat = new THREE.MeshStandardMaterial({ color: 0xf0f0f0, roughness: 0.5 });
  const boxCardMat = new THREE.MeshStandardMaterial({ color: 0xd45028, roughness: 0.7 });
  const fryCartonMat = new THREE.MeshStandardMaterial({ color: 0xdd1111, roughness: 0.5 });
  const fryGoldMat = new THREE.MeshStandardMaterial({ color: 0xf4bc20, roughness: 0.6 });
  const tongsMat = new THREE.MeshStandardMaterial({ color: 0xd0d0d0, metalness: 0.9, roughness: 0.2 });
  const paperWrapMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.85 });

  // 1. Condiment Squeeze Bottles (Ketchup, Mustard, Mayo)
  const bottles = [
    { mat: ketchupMat, x: -0.55, z: -0.15 },
    { mat: mustardMat, x: -0.45, z: -0.15 },
    { mat: mayoMat, x: -0.35, z: -0.15 },
  ];
  bottles.forEach((b) => {
    const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 12), b.mat);
    bottleBody.position.set(b.x, 0.08, b.z);
    const bottleNeck = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.05, 12), b.mat);
    bottleNeck.position.set(b.x, 0.185, b.z);
    const bottleTip = new THREE.Mesh(new THREE.CylinderGeometry(0.005, 0.008, 0.03, 8), bottleCapMat);
    bottleTip.position.set(b.x, 0.22, b.z);
    group.add(bottleBody, bottleNeck, bottleTip);
  });

  // 2. Stack of Burger Boxes
  for (let s = 0; s < 4; s++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.14), boxCardMat);
    box.position.set(-0.15, 0.025 + s * 0.045, -0.12);
    group.add(box);
  }

  // 3. Stack of French Fry Cartons with golden fries sticking out
  const fryBox = new THREE.Mesh(new THREE.BoxGeometry(0.09, 0.11, 0.05), fryCartonMat);
  fryBox.position.set(0.08, 0.055, -0.12);
  const fries = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.06, 0.04), fryGoldMat);
  fries.position.set(0.08, 0.12, -0.12);
  group.add(fryBox, fries);

  // 4. Stainless Steel Fast-Food Tongs
  const tong1 = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.22), tongsMat);
  tong1.position.set(0.28, 0.006, -0.08);
  tong1.rotation.y = 0.25;
  group.add(tong1);

  // 5. Stack of Fast-Food Wrapping Paper Sheets
  const wrapStack = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.015, 0.26), paperWrapMat);
  wrapStack.position.set(0.48, 0.008, -0.06);
  group.add(wrapStack);

  return group;
}

/** 21. First-Person Viewmodel: Held Meal in Duck's Hands (Tray with Fried Chicken Bucket, Coffee, Fries) */
export function createFirstPersonHeldMeal(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const trayMat = new THREE.MeshStandardMaterial({
    color: 0x1f2124, // Fast food textured black serving tray
    roughness: 0.55,
    metalness: 0.1,
  });
  const trayLinerMat = new THREE.MeshStandardMaterial({
    color: 0xdf382b, // Red paper tray liner
    roughness: 0.8,
  });
  const cupMat = new THREE.MeshStandardMaterial({
    color: 0x4a2a1a, // McCafé dark roasted coffee cup
    roughness: 0.6,
  });
  const cupSleeveMat = new THREE.MeshStandardMaterial({
    color: 0x8a633c, // Corrugated kraft paper heat sleeve
    roughness: 0.85,
  });
  const cupLidMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White sipper lid
    roughness: 0.4,
  });
  const fryCartonMat = new THREE.MeshStandardMaterial({
    color: 0xcc1111,
    roughness: 0.4,
  });
  const fryGoldMat = new THREE.MeshStandardMaterial({
    color: 0xf5b800,
    roughness: 0.6,
  });
  const duckFeatherMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // Duck white feathered wings/hands holding tray
    roughness: 0.75,
  });
  const duckWebMat = new THREE.MeshStandardMaterial({
    color: 0xf09000, // Duck orange bill/foot webbing tone for fingertips
    roughness: 0.6,
  });

  // Fast-Food Serving Tray
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.014, 0.28), trayMat);
  tray.castShadow = true;
  group.add(tray);

  // Paper Liner
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), trayLinerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.008;
  group.add(liner);

  // 1. Fried Chicken Bucket (Left side of tray)
  const bucket = createFriedChickenBucket();
  bucket.scale.setScalar(0.72);
  bucket.position.set(-0.08, 0.007, 0.01);
  group.add(bucket);

  // 2. McCafé Hot Coffee Cup (Right rear of tray)
  const cupGroup = new THREE.Group();
  cupGroup.position.set(0.10, 0.007, -0.05);

  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.028, 0.11, 12), cupMat);
  cup.position.y = 0.055;
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.032, 0.045, 12), cupSleeveMat);
  sleeve.position.y = 0.055;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.012, 12), cupLidMat);
  lid.position.y = 0.115;
  cupGroup.add(cup, sleeve, lid);
  group.add(cupGroup);

  // 3. World Famous French Fries (Right front of tray)
  const fryGroup = new THREE.Group();
  fryGroup.position.set(0.10, 0.007, 0.06);

  const carton = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.08, 0.04), fryCartonMat);
  carton.position.y = 0.04;
  const fryPile = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.05, 0.032), fryGoldMat);
  fryPile.position.y = 0.085;
  fryGroup.add(carton, fryPile);
  group.add(fryGroup);

  // 4. Duck's Hands / Wing Fingertips gripping the sides of the serving tray
  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 0.11), duckFeatherMat);
  handL.position.set(-0.20, 0.008, 0);
  const fingerTipsL = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.016, 0.09), duckWebMat);
  fingerTipsL.position.set(-0.185, 0.015, 0);

  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.025, 0.11), duckFeatherMat);
  handR.position.set(0.20, 0.008, 0);
  const fingerTipsR = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.016, 0.09), duckWebMat);
  fingerTipsR.position.set(0.185, 0.015, 0);

  group.add(handL, fingerTipsL, handR, fingerTipsR);

  return group;
}

/** 21B. First-Person Viewmodel: Held Commercial Mop in Duck's Right Hand */
export function createFirstPersonHeldMop(): THREE.Group {
  const group = new THREE.Group();

  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x4a7c59,
    metalness: 0.65,
    roughness: 0.32,
  });
  const clampMat = new THREE.MeshStandardMaterial({
    color: 0x1c1e1f,
    roughness: 0.55,
  });
  const strandMat = new THREE.MeshStandardMaterial({
    color: 0xe2e2dc,
    roughness: 0.92,
  });
  const duckFeatherMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.75,
  });
  const duckWebMat = new THREE.MeshStandardMaterial({
    color: 0xf09000,
    roughness: 0.6,
  });

  // Pole extends forward-down from Duck's hand toward floor in front of view
  const polePivot = new THREE.Group();
  polePivot.rotation.set(-0.55, 0.12, 0.12);
  group.add(polePivot);

  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.15, 8), handleMat);
  stick.position.set(0, -0.15, 0);
  polePivot.add(stick);

  const gripCap = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 8), clampMat);
  gripCap.position.set(0, 0.42, 0);
  polePivot.add(gripCap);

  // Duck's feathered wing/hand & orange fingers wrapped around mop shaft
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.085, 0.055), duckFeatherMat);
  hand.position.set(0.01, 0.18, 0.01);
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.042, 0.065, 0.025), duckWebMat);
  fingers.position.set(-0.01, 0.18, -0.022);
  polePivot.add(hand, fingers);

  // Mop clamp & thick cotton strands at lower end
  const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.055), clampMat);
  clamp.position.set(0, -0.71, 0);
  polePivot.add(clamp);

  const mopCore = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.095, 0.18, 10), strandMat);
  mopCore.position.set(0, -0.81, 0);
  polePivot.add(mopCore);

  return group;
}

/** Dining Booth Meal Spread for Seated Friends Group (Bucket, 3 Coffee Cups, Fries) */
export function createBoothMealTray(): THREE.Group {
  const group = new THREE.Group();

  const trayMat = new THREE.MeshStandardMaterial({ color: 0x1f2124, roughness: 0.55 });
  const linerMat = new THREE.MeshStandardMaterial({ color: 0xdf382b, roughness: 0.8 });
  const cupMat = new THREE.MeshStandardMaterial({ color: 0x4a2a1a, roughness: 0.6 });
  const lidMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.4 });
  const fryCartonMat = new THREE.MeshStandardMaterial({ color: 0xcc1111, roughness: 0.4 });
  const fryGoldMat = new THREE.MeshStandardMaterial({ color: 0xf5b800, roughness: 0.6 });

  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.016, 0.36), trayMat);
  tray.castShadow = true;
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.009;
  group.add(tray, liner);

  const bucket = createFriedChickenBucket();
  bucket.scale.setScalar(0.8);
  bucket.position.set(0, 0.008, 0);
  group.add(bucket);

  const cupPositions: [number, number][] = [
    [-0.19, 0.08],
    [0.19, 0.08],
    [-0.17, -0.09],
  ];
  for (const [cx, cz] of cupPositions) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.026, 0.11, 10), cupMat);
    cup.position.set(cx, 0.06, cz);
    const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.012, 10), lidMat);
    lid.position.set(cx, 0.118, cz);
    group.add(cup, lid);
  }

  const carton = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.085, 0.045), fryCartonMat);
  carton.position.set(0.18, 0.05, -0.08);
  const fries = new THREE.Mesh(new THREE.BoxGeometry(0.076, 0.05, 0.036), fryGoldMat);
  fries.position.set(0.18, 0.095, -0.08);
  group.add(carton, fries);

  return group;
}

/** Outgoing McDonald's Crew Employee: John (Shift Handover NPC) */
export function createEmployeeJohn(): THREE.Group {
  const group = new THREE.Group();

  // Materials
  const skinMat = new THREE.MeshStandardMaterial({ color: 0xe2b794, roughness: 0.65 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x262930, roughness: 0.72 });
  const shirtTrimMat = new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.55 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xffc72c, roughness: 0.35, metalness: 0.25 });
  const apronMat = new THREE.MeshStandardMaterial({ color: 0x15171c, roughness: 0.85 });
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1a1c22, roughness: 0.8 });
  const shoeMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.55 });
  const rubberMat = new THREE.MeshStandardMaterial({ color: 0x222222, roughness: 0.45 });
  const hairMat = new THREE.MeshStandardMaterial({ color: 0x3b2618, roughness: 0.85 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf4f4f4, roughness: 0.4 });
  const pupilMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
  const metalMat = new THREE.MeshStandardMaterial({ color: 0xc0c4c9, metalness: 0.85, roughness: 0.25 });

  // 1. Pelvis & Belt
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.16, 0.22), pantsMat);
  pelvis.position.set(0, 0.86, 0);
  pelvis.castShadow = true;
  const belt = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.04, 0.23), rubberMat);
  belt.position.set(0, 0.94, 0);
  const buckle = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.05, 0.02), metalMat);
  buckle.position.set(0, 0.94, 0.12);
  group.add(pelvis, belt, buckle);

  // 2. Torso & McDonald's Uniform Details
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.96, 0);
  group.add(torsoGroup);

  const abdomen = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.24), shirtMat);
  abdomen.position.set(0, 0.11, 0);
  abdomen.castShadow = true;
  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.41, 0.34, 0.27), shirtMat);
  chest.position.set(0, 0.36, 0);
  chest.castShadow = true;

  // Red polo shoulder stripes & collar
  const collar = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.06, 0.2), shirtTrimMat);
  collar.position.set(0, 0.53, 0.01);
  const stripeL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.28), shirtTrimMat);
  stripeL.position.set(-0.15, 0.52, 0);
  const stripeR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.03, 0.28), shirtTrimMat);
  stripeR.position.set(0.15, 0.52, 0);

  // Crew Apron (front)
  const apron = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.38, 0.02), apronMat);
  apron.position.set(0, 0.08, 0.135);

  // Golden Nameplate & Embroidered Golden M Badge
  const nameBadge = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.032, 0.014), goldMat);
  nameBadge.position.set(0.1, 0.42, 0.145);
  const crest = new THREE.Mesh(new THREE.BoxGeometry(0.045, 0.04, 0.014), goldMat);
  crest.position.set(-0.1, 0.42, 0.145);

  torsoGroup.add(abdomen, chest, collar, stripeL, stripeR, apron, nameBadge, crest);

  // 3. Neck, Head & McDonald's Crew Cap
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.52, 0);
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.08, 0.12, 10), skinMat);
  neck.position.set(0, -0.02, 0);
  const cranium = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.22, 0.24), skinMat);
  cranium.position.set(0, 0.12, 0);
  cranium.castShadow = true;
  const jaw = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.11, 0.18), skinMat);
  jaw.position.set(0, 0.01, 0.03);
  const nose = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.055, 0.048), skinMat);
  nose.position.set(0, 0.08, 0.14);

  const eyeGeo = new THREE.PlaneGeometry(0.045, 0.028);
  const pupilGeo = new THREE.PlaneGeometry(0.022, 0.022);
  const eyeL = new THREE.Mesh(eyeGeo, whiteMat);
  eyeL.position.set(-0.06, 0.11, 0.122);
  const eyeR = new THREE.Mesh(eyeGeo, whiteMat);
  eyeR.position.set(0.06, 0.11, 0.122);
  const pupilL = new THREE.Mesh(pupilGeo, pupilMat);
  pupilL.position.set(-0.06, 0.11, 0.124);
  const pupilR = new THREE.Mesh(pupilGeo, pupilMat);
  pupilR.position.set(0.06, 0.11, 0.124);

  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), hairMat);
  browL.position.set(-0.06, 0.145, 0.13);
  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), hairMat);
  browR.position.set(0.06, 0.145, 0.13);

  const earGeo = new THREE.BoxGeometry(0.03, 0.07, 0.05);
  const earL = new THREE.Mesh(earGeo, skinMat);
  earL.position.set(-0.13, 0.1, 0);
  const earR = new THREE.Mesh(earGeo, skinMat);
  earR.position.set(0.13, 0.1, 0);

  // Side hair & McDonald's Crew Cap
  const sideHair = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.09, 0.25), hairMat);
  sideHair.position.set(0, 0.15, -0.02);

  const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.255, 0.1, 0.26), shirtTrimMat);
  capCrown.position.set(0, 0.22, 0);
  const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.02, 0.13), apronMat);
  capVisor.position.set(0, 0.175, 0.16);
  capVisor.rotation.x = 0.12;
  const capEmblem = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.04, 0.012), goldMat);
  capEmblem.position.set(0, 0.215, 0.132);

  headGroup.add(
    neck,
    cranium,
    jaw,
    nose,
    eyeL,
    eyeR,
    pupilL,
    pupilR,
    browL,
    browR,
    earL,
    earR,
    sideHair,
    capCrown,
    capVisor,
    capEmblem
  );

  // 4. Arms & Hands
  const armL = new THREE.Group();
  armL.position.set(-0.25, 1.4, 0);
  const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.22, 8), shirtMat);
  sleeveL.position.set(0, -0.11, 0);
  sleeveL.castShadow = true;
  const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.046, 0.28, 8), skinMat);
  forearmL.position.set(0, -0.34, 0.02);
  const handL = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), skinMat);
  handL.position.set(0, -0.5, 0.02);
  armL.add(sleeveL, forearmL, handL);
  group.add(armL);

  const armR = new THREE.Group();
  armR.position.set(0.25, 1.4, 0);
  const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.22, 8), shirtMat);
  sleeveR.position.set(0, -0.11, 0);
  sleeveR.castShadow = true;
  const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.046, 0.28, 8), skinMat);
  forearmR.position.set(0, -0.34, 0.02);
  const handR = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.04), skinMat);
  handR.position.set(0, -0.5, 0.02);
  armR.add(sleeveR, forearmR, handR);
  group.add(armR);

  // 5. Legs & Work Shoes
  const legL = new THREE.Group();
  legL.position.set(-0.11, 0.84, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8), pantsMat);
  thighL.position.set(0, -0.2, 0);
  thighL.castShadow = true;
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.38, 8), pantsMat);
  calfL.position.set(0, -0.56, 0);
  calfL.castShadow = true;
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), shoeMat);
  footL.position.set(0, -0.78, 0.05);
  footL.castShadow = true;
  const soleL = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.28), rubberMat);
  soleL.position.set(0, -0.83, 0.05);
  legL.add(thighL, calfL, footL, soleL);
  group.add(legL);

  const legR = new THREE.Group();
  legR.position.set(0.11, 0.84, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.07, 0.4, 8), pantsMat);
  thighR.position.set(0, -0.2, 0);
  thighR.castShadow = true;
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.062, 0.38, 8), pantsMat);
  calfR.position.set(0, -0.56, 0);
  calfR.castShadow = true;
  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.26), shoeMat);
  footR.position.set(0, -0.78, 0.05);
  footR.castShadow = true;
  const soleR = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.03, 0.28), rubberMat);
  soleR.position.set(0, -0.83, 0.05);
  legR.add(thighR, calfR, footR, soleR);
  group.add(legR);

  group.userData.limbs = {
    head: headGroup,
    torso: torsoGroup,
    armL,
    armR,
    legL,
    legR,
  };

  return group;
}

/** Exterior Main Electrical Circuit Breaker Box (Mounted behind the store) */
export function createElectricalBox(): {
  group: THREE.Group;
  lever: THREE.Group;
  statusLedMat: THREE.MeshBasicMaterial;
  beaconLight: THREE.PointLight;
} {
  const group = new THREE.Group();

  const cabinetMat = new THREE.MeshStandardMaterial({
    color: 0x4b535b,
    metalness: 0.78,
    roughness: 0.38,
  });
  const doorMat = new THREE.MeshStandardMaterial({
    color: 0x5c656e,
    metalness: 0.7,
    roughness: 0.35,
  });
  const conduitMat = new THREE.MeshStandardMaterial({
    color: 0x7e8790,
    metalness: 0.9,
    roughness: 0.22,
  });
  const darkTrimMat = new THREE.MeshStandardMaterial({
    color: 0x1b1e22,
    metalness: 0.3,
    roughness: 0.75,
  });
  const leverHandleMat = new THREE.MeshStandardMaterial({
    color: 0xd92626,
    metalness: 0.25,
    roughness: 0.42,
  });
  const hazardMat = new THREE.MeshStandardMaterial({
    map: createWarningSignTexture(),
    roughness: 0.6,
  });

  // Grounded conduit junction plinth at Y = 0
  const floorBoot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.18), darkTrimMat);
  floorBoot.position.set(0, 0.07, 0.04);
  floorBoot.castShadow = true;
  floorBoot.receiveShadow = true;
  group.add(floorBoot);

  // Twin vertical galvanized steel conduit pipes up into the box
  const conduitL = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.12, 10), conduitMat);
  conduitL.position.set(-0.14, 0.56, 0.03);
  conduitL.castShadow = true;
  const conduitR = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.12, 10), conduitMat);
  conduitR.position.set(0.14, 0.56, 0.03);
  conduitR.castShadow = true;
  // Upper weatherhead conduit exiting top
  const upperConduit = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 1.05, 10), conduitMat);
  upperConduit.position.set(0, 2.25, 0.03);
  group.add(conduitL, conduitR, upperConduit);

  // Main NEMA Steel Enclosure Box
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.24), cabinetMat);
  cabinet.position.set(0, 1.38, 0.08);
  cabinet.castShadow = true;
  cabinet.receiveShadow = true;
  group.add(cabinet);

  // Hinged Front Access Door Panel
  const frontDoor = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.64, 0.035), doorMat);
  frontDoor.position.set(0, 1.38, 0.21);
  frontDoor.castShadow = true;
  group.add(frontDoor);

  // Latch & Hinge Blocks
  const latch = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.09, 0.03), darkTrimMat);
  latch.position.set(-0.21, 1.38, 0.23);
  const hingeTop = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.03), darkTrimMat);
  hingeTop.position.set(0.24, 1.58, 0.21);
  const hingeBot = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.07, 0.03), darkTrimMat);
  hingeBot.position.set(0.24, 1.18, 0.21);
  group.add(latch, hingeTop, hingeBot);

  // High-Voltage Warning Sign on Front Door
  const warnSticker = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.18), hazardMat);
  warnSticker.position.set(0, 1.48, 0.229);
  group.add(warnSticker);

  // Status Indicator LED & Bezel
  const ledBezel = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.02, 10), darkTrimMat);
  ledBezel.rotation.x = Math.PI / 2;
  ledBezel.position.set(0.15, 1.62, 0.225);
  const statusLedMat = new THREE.MeshBasicMaterial({ color: 0x22ee55 });
  const statusLed = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 8), statusLedMat);
  statusLed.position.set(0.15, 1.62, 0.237);
  group.add(ledBezel, statusLed);

  // Pivoted Heavy-Duty Side Breaker Throw Lever (ON = tilted up, TRIPPED = tilted down)
  const lever = new THREE.Group();
  lever.position.set(0.29, 1.44, 0.08);
  const leverHub = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 10), darkTrimMat);
  leverHub.rotation.z = Math.PI / 2;
  const leverArm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.18, 8), conduitMat);
  leverArm.position.set(0.03, 0.09, 0);
  const leverGrip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.09, 10), leverHandleMat);
  leverGrip.rotation.z = Math.PI / 2;
  leverGrip.position.set(0.06, 0.18, 0);
  lever.add(leverHub, leverArm, leverGrip);
  lever.rotation.x = 0.55; // Default ON position (pulled up)
  group.add(lever);

  // Subtle beacon light so tripped red LED is visible in the dark rear yard
  const beaconLight = new THREE.PointLight(0xff2222, 0.0, 2.8);
  beaconLight.position.set(0.15, 1.62, 0.35);
  group.add(beaconLight);

  return { group, lever, statusLedMat, beaconLight };
}

/** Fiberglass Waving Clown Mascot Statue (Placed near cash register in welcoming pose) */
export function createWelcomingClownStatue(): THREE.Group {
  const group = new THREE.Group();

  // Materials (painted fiberglass sheen contrasted with matte pedestal & shoes)
  const plinthRedMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.55, metalness: 0.15 });
  const goldTrimMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3, metalness: 0.55 });
  const suitYellowMat = new THREE.MeshStandardMaterial({ color: 0xf5b800, roughness: 0.28, metalness: 0.05 });
  const redStripeMat = new THREE.MeshStandardMaterial({ color: 0xc8102e, roughness: 0.32, metalness: 0.05 });
  const whitePaintMat = new THREE.MeshStandardMaterial({ color: 0xf6f6f2, roughness: 0.24, metalness: 0.05 });
  const blackMat = new THREE.MeshStandardMaterial({ color: 0x151518, roughness: 0.65 });
  const smileMat = new THREE.MeshBasicMaterial({ color: 0xb91c1c });
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x111111 });

  // 1. Stepped McDonald's Display Pedestal Base (Bottom grounded at Y = 0)
  const baseLower = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.14, 18), plinthRedMat);
  baseLower.position.y = 0.07;
  baseLower.castShadow = true;
  baseLower.receiveShadow = true;

  const goldRing = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.03, 18), goldTrimMat);
  goldRing.position.y = 0.155;

  const baseUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.39, 0.05, 18), whitePaintMat);
  baseUpper.position.y = 0.195;
  baseUpper.receiveShadow = true;
  group.add(baseLower, goldRing, baseUpper);

  // Statue body anchor perched cleanly at pedestal top (Y = 0.22)
  const statue = new THREE.Group();
  statue.position.y = 0.22;
  group.add(statue);

  // 2. Oversized Clown Shoes & Striped Legs
  const shoeGeo = new THREE.BoxGeometry(0.16, 0.11, 0.36);
  const shoeL = new THREE.Mesh(shoeGeo, redStripeMat);
  shoeL.position.set(-0.14, 0.055, 0.07);
  shoeL.rotation.y = 0.12;
  shoeL.castShadow = true;

  const shoeR = new THREE.Mesh(shoeGeo, redStripeMat);
  shoeR.position.set(0.14, 0.055, 0.07);
  shoeR.rotation.y = -0.12;
  shoeR.castShadow = true;

  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.68, 12), suitYellowMat);
  legL.position.set(-0.13, 0.44, 0);
  legL.castShadow = true;
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.075, 0.68, 12), suitYellowMat);
  legR.position.set(0.13, 0.44, 0);
  legR.castShadow = true;
  statue.add(shoeL, shoeR, legL, legR);

  // Red striped socks/cuffs at ankles
  const cuffL = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.09, 12), redStripeMat);
  cuffL.position.set(-0.13, 0.15, 0);
  const cuffR = new THREE.Mesh(new THREE.CylinderGeometry(0.082, 0.082, 0.09, 12), redStripeMat);
  cuffR.position.set(0.13, 0.15, 0);
  statue.add(cuffL, cuffR);

  // 3. Jumpsuit Torso & Red Vest/Buttons
  const pelvis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.2, 0.24), suitYellowMat);
  pelvis.position.set(0, 0.84, 0);
  pelvis.castShadow = true;

  const chest = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.28), suitYellowMat);
  chest.position.set(0, 1.15, 0);
  chest.castShadow = true;

  // Front Red Vertical Bib & Big Pom-Pom Buttons
  const bib = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.44, 0.03), redStripeMat);
  bib.position.set(0, 1.16, 0.142);

  for (let b = 0; b < 3; b++) {
    const pom = new THREE.Mesh(new THREE.SphereGeometry(0.032, 10, 10), suitYellowMat);
    pom.position.set(0, 1.03 + b * 0.12, 0.165);
    statue.add(pom);
  }

  // Ruffled Clown Neck Collar
  const ruffCollar = new THREE.Mesh(new THREE.TorusGeometry(0.13, 0.045, 8, 16), whitePaintMat);
  ruffCollar.rotation.x = Math.PI / 2;
  ruffCollar.position.set(0, 1.41, 0);

  statue.add(pelvis, chest, bib, ruffCollar);

  // 4. Painted Head, Red Wig Tufts & Welcoming Grin
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.56, 0.02);
  headGroup.rotation.z = -0.05; // Friendly welcoming head tilt
  statue.add(headGroup);

  const head = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), whitePaintMat);
  head.scale.set(0.95, 1.1, 0.98);
  head.castShadow = true;
  headGroup.add(head);

  // Bulbous Red Clown Nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.042, 12, 12), redStripeMat);
  nose.position.set(0, 0.0, 0.165);
  headGroup.add(nose);

  // Wide Painted Smile + Arched Eyebrows + Eyes
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.072, 0.016, 8, 14, Math.PI), smileMat);
  smile.rotation.z = Math.PI;
  smile.position.set(0, -0.035, 0.142);
  headGroup.add(smile);

  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eyeMat);
  eyeL.position.set(-0.055, 0.055, 0.14);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.018, 8, 8), eyeMat);
  eyeR.position.set(0.055, 0.055, 0.14);
  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.012), redStripeMat);
  browL.position.set(-0.055, 0.092, 0.142);
  browL.rotation.z = 0.18;
  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.012, 0.012), redStripeMat);
  browR.position.set(0.055, 0.092, 0.142);
  browR.rotation.z = -0.18;
  headGroup.add(eyeL, eyeR, browL, browR);

  // Fluffy Bright Red Hair Tufts (Left, Right, Back Crown)
  const hairL = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), redStripeMat);
  hairL.position.set(-0.15, 0.06, -0.02);
  const hairR = new THREE.Mesh(new THREE.SphereGeometry(0.095, 12, 12), redStripeMat);
  hairR.position.set(0.15, 0.06, -0.02);
  const hairTop = new THREE.Mesh(new THREE.SphereGeometry(0.105, 12, 12), redStripeMat);
  hairTop.position.set(0, 0.13, -0.06);
  headGroup.add(hairL, hairR, hairTop);

  // Yellow Clown Bowler Hat tilted jauntily
  const hatBrim = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.015, 14), blackMat);
  hatBrim.position.set(0, 0.175, 0);
  const hatCrown = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.085, 0.07, 14), suitYellowMat);
  hatCrown.position.set(0, 0.215, 0);
  headGroup.add(hatBrim, hatCrown);

  // 5. Left Arm (Relaxed welcoming gesture at side with white glove)
  const armL = new THREE.Group();
  armL.position.set(-0.26, 1.32, 0);
  armL.rotation.z = 0.22;
  armL.rotation.x = -0.18;
  const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.28, 10), redStripeMat);
  sleeveL.position.y = -0.14;
  const forearmL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.24, 10), suitYellowMat);
  forearmL.position.set(0, -0.36, 0.05);
  forearmL.rotation.x = -0.35;
  const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.065, 10, 10), whitePaintMat);
  gloveL.position.set(0, -0.46, 0.12);
  armL.add(sleeveL, forearmL, gloveL);
  statue.add(armL);

  // 6. Right Arm RAISED HIGH IN WELCOMING WAVING POSE
  const armR = new THREE.Group();
  armR.position.set(0.26, 1.34, 0.02);
  // Raise upper arm out and up
  armR.rotation.z = 2.15;
  armR.rotation.x = -0.22;

  const upperArmR = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.055, 0.26, 10), redStripeMat);
  upperArmR.position.y = -0.13;
  upperArmR.castShadow = true;
  armR.add(upperArmR);

  // Elbow bend pointing hand upward in friendly wave
  const elbowR = new THREE.Group();
  elbowR.position.set(0, -0.26, 0);
  elbowR.rotation.z = -0.58;
  armR.add(elbowR);

  const forearmR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.045, 0.24, 10), suitYellowMat);
  forearmR.position.y = -0.12;
  elbowR.add(forearmR);

  // Open White-Gloved Waving Palm & Fingers
  const palmR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.12, 0.045), whitePaintMat);
  palmR.position.set(0, -0.28, 0);
  const thumbR = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.065, 0.035), whitePaintMat);
  thumbR.position.set(-0.068, -0.26, 0);
  thumbR.rotation.z = 0.4;
  elbowR.add(palmR, thumbR);

  statue.add(armR);

  return group;
}

/** Back-of-House Warehouse Storage Shelving Rack with Stacked Supply Crates */
export function createWarehouseSupplyRack(): THREE.Group {
  const group = new THREE.Group();

  const steelMat = new THREE.MeshStandardMaterial({ color: 0x5c636a, metalness: 0.85, roughness: 0.3 });
  const boxMat = new THREE.MeshStandardMaterial({ color: 0x9b7247, roughness: 0.88 });
  const labelMat = new THREE.MeshStandardMaterial({ color: 0xdc2626, roughness: 0.65 });
  const jugMat = new THREE.MeshStandardMaterial({ color: 0xeab308, roughness: 0.35 });

  // 4 Vertical Steel Posts
  const postCoords = [
    [-0.75, -0.24],
    [0.75, -0.24],
    [-0.75, 0.24],
    [0.75, 0.24],
  ];
  postCoords.forEach(([px, pz]) => {
    const post = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.9, 0.04), steelMat);
    post.position.set(px, 0.95, pz);
    post.castShadow = true;
    group.add(post);
  });

  // 3 Wire/Steel Shelves
  [0.18, 0.88, 1.56].forEach((sy) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.035, 0.52), steelMat);
    shelf.position.set(0, sy, 0);
    shelf.receiveShadow = true;
    group.add(shelf);
  });

  // Stacked Inventory Supply Boxes on Shelves
  const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.42), boxMat);
  box1.position.set(-0.4, 0.41, 0);
  const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.38, 0.42), boxMat);
  box2.position.set(0.32, 0.39, 0);
  const box3 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.42), boxMat);
  box3.position.set(-0.32, 1.08, 0);
  const redStripe = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.06, 0.43), labelMat);
  redStripe.position.set(-0.32, 1.12, 0);
  const jug1 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.22), jugMat);
  jug1.position.set(0.32, 1.06, 0);
  const jug2 = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.32, 0.22), jugMat);
  jug2.position.set(0.55, 1.06, 0);
  const boxTop = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.3, 0.42), boxMat);
  boxTop.position.set(0.1, 1.73, 0);

  group.add(box1, box2, box3, redStripe, jug1, jug2, boxTop);
  return group;
}

/** Porcelain Toilet Stall Enclosure (Partition walls, ajar stall door, bowl, tank, chrome handle, TP dispenser) */
export function createRestroomToiletStall(): THREE.Group {
  const group = new THREE.Group();

  const partitionMat = new THREE.MeshStandardMaterial({
    color: 0x3b444e,
    roughness: 0.55,
    metalness: 0.35,
  });
  const hardwareMat = new THREE.MeshStandardMaterial({
    color: 0xcbd5e1,
    metalness: 0.9,
    roughness: 0.18,
  });
  const porcelainMat = new THREE.MeshStandardMaterial({
    color: 0xe9eef2,
    roughness: 0.18,
    metalness: 0.08,
  });
  const seatMat = new THREE.MeshStandardMaterial({
    color: 0xd8dee4,
    roughness: 0.32,
    metalness: 0.05,
  });
  const waterMat = new THREE.MeshStandardMaterial({
    color: 0x2c6e85,
    roughness: 0.12,
    metalness: 0.25,
  });
  const paperMat = new THREE.MeshStandardMaterial({
    color: 0xf4f4f0,
    roughness: 0.9,
  });

  // 1. Stall Partition Side Panel (Z-axis side divider, elevated on chrome feet)
  const sidePanel = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.85, 0.055), partitionMat);
  sidePanel.position.set(0.05, 1.12, -0.72);
  sidePanel.castShadow = true;
  sidePanel.receiveShadow = true;
  group.add(sidePanel);

  // Stainless support legs under side panel
  [-0.55, 0.65].forEach((lx) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.22, 8), hardwareMat);
    leg.position.set(lx, 0.11, -0.72);
    group.add(leg);
  });

  // Front Pilaster Post & Slightly Ajar Stall Door
  const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.05, 0.18), partitionMat);
  pilaster.position.set(0.82, 1.025, -0.66);
  group.add(pilaster);

  const doorPivot = new THREE.Group();
  doorPivot.position.set(0.82, 0.22, -0.58);
  doorPivot.rotation.y = 0.55; // Swung partially open so toilet is clearly visible inside
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.8, 0.85), partitionMat);
  doorLeaf.position.set(0, 0.9, 0.425);
  doorLeaf.castShadow = true;
  const doorLatch = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.09), hardwareMat);
  doorLatch.position.set(0, 0.92, 0.78);
  doorPivot.add(doorLeaf, doorLatch);
  group.add(doorPivot);

  // 2. Porcelain Toilet Assembly (Centered inside stall, grounded at Y = 0, facing +X)
  const toiletGroup = new THREE.Group();
  toiletGroup.position.set(-0.22, 0, 0.05);
  group.add(toiletGroup);

  // Pedestal Base & Footing
  const basePlinth = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.12, 14), porcelainMat);
  basePlinth.position.y = 0.06;
  basePlinth.receiveShadow = true;
  const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 0.24, 14), porcelainMat);
  stem.position.set(-0.04, 0.22, 0);
  toiletGroup.add(basePlinth, stem);

  // Bowl Basin & Water Inside
  const bowlOuter = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.17, 0.22, 16), porcelainMat);
  bowlOuter.scale.set(1.18, 1.0, 0.95);
  bowlOuter.position.set(0.08, 0.36, 0);
  bowlOuter.castShadow = true;
  const waterPool = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.12, 0.02, 14), waterMat);
  waterPool.position.set(0.09, 0.43, 0);
  toiletGroup.add(bowlOuter, waterPool);

  // Toilet Seat Ring & Open/Upright Lid
  const seatRing = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.036, 10, 18), seatMat);
  seatRing.rotation.x = Math.PI / 2;
  seatRing.scale.set(1.18, 0.92, 1.0);
  seatRing.position.set(0.08, 0.48, 0);

  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.21, 0.21, 0.024, 16), seatMat);
  lid.scale.set(1.0, 1.0, 1.15);
  lid.rotation.z = Math.PI / 2 - 0.12;
  lid.position.set(-0.14, 0.70, 0);
  toiletGroup.add(seatRing, lid);

  // Rear Porcelain Cistern / Water Tank & Chrome Flush Handle
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.46), porcelainMat);
  tank.position.set(-0.26, 0.68, 0);
  tank.castShadow = true;
  const tankCap = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.04, 0.49), porcelainMat);
  tankCap.position.set(-0.26, 0.91, 0);
  const flushStem = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.02, 0.06), hardwareMat);
  flushStem.position.set(-0.22, 0.83, 0.25);
  const flushHandle = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.022, 0.025), hardwareMat);
  flushHandle.position.set(-0.18, 0.83, 0.27);
  toiletGroup.add(tank, tankCap, flushStem, flushHandle);

  // 3. Wall-Mounted Toilet Paper Roll Holder on Partition
  const tpHolder = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.08), hardwareMat);
  tpHolder.position.set(0.18, 0.74, -0.65);
  const tpRoll = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 0.11, 12), paperMat);
  tpRoll.rotation.z = Math.PI / 2;
  tpRoll.position.set(0.18, 0.73, -0.63);
  group.add(tpHolder, tpRoll);

  return group;
}

/** Commercial Restroom Vanity Sink, Chrome Faucet, Mirror & Paper Towel Dispenser */
export function createRestroomSinkAndMirror(): THREE.Group {
  const group = new THREE.Group();

  const counterMat = new THREE.MeshStandardMaterial({ color: 0x5d646b, roughness: 0.35, metalness: 0.25 });
  const porcelainMat = new THREE.MeshStandardMaterial({ color: 0xedf2f5, roughness: 0.18, metalness: 0.08 });
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xd8dee6, metalness: 0.92, roughness: 0.14 });
  const mirrorMat = new THREE.MeshStandardMaterial({ color: 0x9fb8c9, metalness: 0.96, roughness: 0.06 });
  const darkMetalMat = new THREE.MeshStandardMaterial({ color: 0x1e2226, metalness: 0.65, roughness: 0.4 });
  const soapMat = new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.3, transparent: true, opacity: 0.85 });

  // Counter Slab & Apron Bracket
  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.56), counterMat);
  slab.position.set(0, 0.86, 0.28);
  slab.castShadow = true;
  slab.receiveShadow = true;
  const apron = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.16, 0.06), counterMat);
  apron.position.set(0, 0.75, 0.52);
  group.add(slab, apron);

  // Under-sink P-trap Pipes (grounded to floor)
  const drainPipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.76, 8), chromeMat);
  drainPipe.position.set(0, 0.38, 0.22);
  const supplyL = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6), chromeMat);
  supplyL.position.set(-0.18, 0.4, 0.14);
  const supplyR = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.8, 6), chromeMat);
  supplyR.position.set(0.18, 0.4, 0.14);
  group.add(drainPipe, supplyL, supplyR);

  // Recessed Ceramic Sink Basin & Gooseneck Faucet
  const basinRim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.14, 16), porcelainMat);
  basinRim.scale.set(1.25, 1.0, 0.95);
  basinRim.position.set(0, 0.84, 0.3);
  const drainCap = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.01, 10), chromeMat);
  drainCap.position.set(0, 0.78, 0.3);

  const faucetBase = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.025, 0.05), chromeMat);
  faucetBase.position.set(0, 0.91, 0.12);
  const faucetNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.018, 0.16, 8), chromeMat);
  faucetNeck.position.set(0, 0.99, 0.12);
  const faucetSpout = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.12), chromeMat);
  faucetSpout.position.set(0, 1.06, 0.17);
  group.add(basinRim, drainCap, faucetBase, faucetNeck, faucetSpout);

  // Wall Mirror & Steel Frame
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 0.04), darkMetalMat);
  mirrorFrame.position.set(0, 1.58, 0.02);
  const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.88), mirrorMat);
  mirrorGlass.position.set(0, 1.58, 0.042);
  group.add(mirrorFrame, mirrorGlass);

  // Soap Dispenser (Left of sink) & Paper Towel Dispenser (Right wall)
  const soapBody = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.2, 0.09), darkMetalMat);
  soapBody.position.set(-0.52, 1.24, 0.05);
  const soapWindow = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.08, 0.02), soapMat);
  soapWindow.position.set(-0.52, 1.24, 0.092);
  const towelBox = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.34, 0.14), chromeMat);
  towelBox.position.set(0.86, 1.38, 0.07);
  group.add(soapBody, soapWindow, towelBox);

  return group;
}

/** Illuminated Wall Plaque for Restroom Doorway */
export function createRestroomDoorSign(): THREE.Group {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(
    new THREE.BoxGeometry(0.54, 0.22, 0.04),
    new THREE.MeshStandardMaterial({ color: 0x162438, metalness: 0.4, roughness: 0.4 })
  );
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 104;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = '#0f2744';
  ctx.fillRect(0, 0, 256, 104);
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 6;
  ctx.strokeRect(5, 5, 246, 94);
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 34px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('RESTROOM', 128, 52);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.19),
    new THREE.MeshBasicMaterial({ map: tex })
  );
  face.position.z = 0.022;
  group.add(frame, face);
  return group;
}

/** Indoor Fast-Food Swing-Flap Trash Bin (For discarding spoiled food) */
export function createIndoorTrashBin(): THREE.Group {
  const group = new THREE.Group();

  const bodyMat = new THREE.MeshStandardMaterial({ color: 0x26292e, roughness: 0.72, metalness: 0.15 });
  const redHoodMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.5 });
  const flapMat = new THREE.MeshStandardMaterial({ color: 0x15171a, roughness: 0.4, metalness: 0.3 });
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x9aa0a6, metalness: 0.8, roughness: 0.25 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.78, 0.48), bodyMat);
  base.position.y = 0.39;
  base.receiveShadow = true;

  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 0.50), redHoodMat);
  hood.position.y = 0.92;

  const flapSlot = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.04), flapMat);
  flapSlot.position.set(0, 0.90, 0.24);
  flapSlot.rotation.x = 0.15;

  const trim = new THREE.Mesh(new THREE.BoxGeometry(0.57, 0.03, 0.51), trimMat);
  trim.position.y = 0.78;

  group.add(base, hood, flapSlot, trim);
  return group;
}

