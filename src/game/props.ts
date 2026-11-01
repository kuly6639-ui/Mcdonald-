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
  } else {
    // 3. Big Ray (Highway Long-Hauler): denim vest over red/black flannel, work boots, trucker cap, beard
    jacketColor = 0x2c435c; // denim vest
    pantsColor = 0x1d2e3d;
    hairColor = 0x2e2017;
    skinTone = 0xd4a582;
    shoeColor = 0x6e4928; // tan leather work boots
    hatColor = 0xc2410c; // bright trucker cap
    accentColor = 0x8a2020; // flannel sleeves
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
  } else {
    // Big Ray: Plaid shirt showing at center and arms, heavy vest body
    const shirtCenter = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.36, 0.02), accentMat);
    shirtCenter.position.set(0, 0.35, 0.142);
    // Vest lapels
    const lapelL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.03), jacketMat);
    lapelL.position.set(-0.14, 0.35, 0.145);
    const lapelR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.36, 0.03), jacketMat);
    lapelR.position.set(0.14, 0.35, 0.145);
    torsoGroup.add(shirtCenter, lapelL, lapelR);
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

  // Eyebrows
  const browMat = archetypeIndex === 2 ? hairMat : new THREE.MeshStandardMaterial({ color: hairColor, roughness: 0.9 });
  const browL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), browMat);
  browL.position.set(-0.06, 0.145, 0.13);
  const browR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.018, 0.02), browMat);
  browR.position.set(0.06, 0.145, 0.13);

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
  } else {
    // Ray Trucker Cap & Beard
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 0.26), new THREE.MeshStandardMaterial({ color: hatColor! }));
    cap.position.set(0, 0.22, 0.02);
    const capVisor = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.02, 0.12), new THREE.MeshStandardMaterial({ color: 0x222222 }));
    capVisor.position.set(0, 0.17, 0.16);
    capVisor.rotation.x = 0.1;
    // Beard
    const beard = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.1, 0.12), hairMat);
    beard.position.set(0, -0.02, 0.08);
    headGroup.add(cap, capVisor, beard);
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
  bucket.castShadow = true;
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

  // 5. String Mop leaning inside bucket
  const mopHead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.16, 8), mopStrandMat);
  mopHead.position.set(-0.06, 0.24, 0);

  const mopStick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25, 8), handleMat);
  mopStick.position.set(-0.16, 0.72, 0);
  mopStick.rotation.z = 0.22; // Natural lean against bucket rim / wall
  group.add(mopHead, mopStick);

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
