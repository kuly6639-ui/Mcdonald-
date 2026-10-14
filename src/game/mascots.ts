import * as THREE from 'three';

/**
 * Original Procedural Mascots for McDonald's Nightfall.
 * Complies with original mascot directive:
 * - Mascot 1: "The Smiling Jester" (Lanky fast-food clown with elongated limbs, ragged yellow jumpsuit, stitched grin)
 * - Mascot 2: "The Purple Glutton" (Hulking shadow creature with glowing eyes and gaping jaw)
 * Built as multi-part composite groups with articulated joints for procedural walking/twitching animations.
 */

export interface MascotCharacter {
  group: THREE.Group;
  type: 'clown' | 'purple_glutton';
  head: THREE.Group;
  leftArm: THREE.Group;
  rightArm: THREE.Group;
  leftLeg: THREE.Group;
  rightLeg: THREE.Group;
  eyeLights?: THREE.PointLight[];
  updateAnimation: (time: number, speed: number, isChasing: boolean) => void;
}

/** 1. Create Mascot 1: The Smiling Jester */
export function createSmilingJester(): MascotCharacter {
  const root = new THREE.Group();

  // Materials
  const suitYellowMat = new THREE.MeshStandardMaterial({
    color: 0xcc9900,
    roughness: 0.65,
    metalness: 0.05,
  });
  const suitRedMat = new THREE.MeshStandardMaterial({
    color: 0x8f1917,
    roughness: 0.6,
    metalness: 0.05,
  });
  const faceMat = new THREE.MeshStandardMaterial({
    color: 0xe6e4db, // Pale porcelain
    roughness: 0.2,
    metalness: 0.1,
  });
  const redAccentsMat = new THREE.MeshStandardMaterial({
    color: 0xb51212,
    roughness: 0.3,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x9c110f, // Red clown shoes
    roughness: 0.4,
    metalness: 0.15,
  });
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xdedede,
    roughness: 0.7,
  });
  const eyeGlowMat = new THREE.MeshBasicMaterial({
    color: 0xffffff,
  });

  // Pelvis / Waist
  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.25, 10), suitRedMat);
  pelvis.position.set(0, 1.25, 0);
  root.add(pelvis);

  // Torso / Chest (Elongated torso)
  const torso = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.75, 0.32), suitYellowMat);
  torso.position.set(0, 1.7, 0);
  torso.castShadow = true;
  root.add(torso);

  // Yellow/Red front zipper & big buttons
  const buttonGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.03, 8);
  const btn1 = new THREE.Mesh(buttonGeo, redAccentsMat);
  btn1.rotation.x = Math.PI / 2;
  btn1.position.set(0, 1.85, 0.17);
  const btn2 = new THREE.Mesh(buttonGeo, redAccentsMat);
  btn2.rotation.x = Math.PI / 2;
  btn2.position.set(0, 1.6, 0.17);
  root.add(btn1, btn2);

  // Clown Neck Ruffle
  const collarMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.8 });
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.08, 8, 16), collarMat);
  collar.rotation.x = Math.PI / 2;
  collar.position.set(0, 2.1, 0);
  root.add(collar);

  // Head Group (Attached to neck)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.3, 0);

  // Head Base
  const headMesh = new THREE.Mesh(new THREE.SphereGeometry(0.22, 16, 16), faceMat);
  headGroup.add(headMesh);

  // Red clown nose
  const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 12, 12), redAccentsMat);
  nose.position.set(0, 0, 0.22);
  headGroup.add(nose);

  // Hollow eye sockets with glowing pinprick eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeGlowMat);
  eyeL.position.set(-0.08, 0.06, 0.2);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.025, 8, 8), eyeGlowMat);
  eyeR.position.set(0.08, 0.06, 0.2);
  headGroup.add(eyeL, eyeR);

  // Eye socket darkness
  const socketMat = new THREE.MeshBasicMaterial({ color: 0x050505 });
  const sockL = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), socketMat);
  sockL.position.set(-0.08, 0.06, 0.18);
  const sockR = new THREE.Mesh(new THREE.SphereGeometry(0.045, 8, 8), socketMat);
  sockR.position.set(0.08, 0.06, 0.18);
  headGroup.add(sockL, sockR);

  // Eerie wide carved red smile
  const smileMat = new THREE.MeshBasicMaterial({ color: 0x8a0d0d });
  const smile = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.025, 8, 16, Math.PI), smileMat);
  smile.rotation.x = Math.PI;
  smile.position.set(0, -0.07, 0.18);
  headGroup.add(smile);

  // Red tufted clown hair on sides
  const hairL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), redAccentsMat);
  hairL.position.set(-0.24, 0.08, -0.05);
  const hairR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 10, 10), redAccentsMat);
  hairR.position.set(0.24, 0.08, -0.05);
  headGroup.add(hairL, hairR);

  // Tiny ominous glowing point lights for eyes
  const eyeLight = new THREE.PointLight(0xffeedd, 0.8, 4.0);
  eyeLight.position.set(0, 0.06, 0.35);
  headGroup.add(eyeLight);

  root.add(headGroup);

  // Left Arm
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.32, 2.0, 0);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.85, 8), suitYellowMat);
  armL.position.set(0, -0.4, 0);
  const handL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), gloveMat);
  handL.position.set(0, -0.85, 0);
  leftArm.add(armL, handL);
  root.add(leftArm);

  // Right Arm
  const rightArm = new THREE.Group();
  rightArm.position.set(0.32, 2.0, 0);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.05, 0.85, 8), suitYellowMat);
  armR.position.set(0, -0.4, 0);
  const handR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), gloveMat);
  handR.position.set(0, -0.85, 0);
  rightArm.add(armR, handR);
  root.add(rightArm);

  // Left Leg
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.16, 1.15, 0);
  const legMeshL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 1.05, 8), suitYellowMat);
  legMeshL.position.set(0, -0.5, 0);
  // Oversized red shoe
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.38), shoeMat);
  shoeL.position.set(0, -1.02, 0.08);
  leftLeg.add(legMeshL, shoeL);
  root.add(leftLeg);

  // Right Leg
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.16, 1.15, 0);
  const legMeshR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 1.05, 8), suitYellowMat);
  legMeshR.position.set(0, -0.5, 0);
  // Oversized red shoe
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.38), shoeMat);
  shoeR.position.set(0, -1.02, 0.08);
  rightLeg.add(legMeshR, shoeR);
  root.add(rightLeg);

  const updateAnimation = (time: number, speed: number, isChasing: boolean) => {
    const cycle = time * (isChasing ? 9.0 : 4.5);
    const amp = isChasing ? 0.65 : 0.38;

    // Legs swing back and forth
    leftLeg.rotation.x = Math.sin(cycle) * amp;
    rightLeg.rotation.x = -Math.sin(cycle) * amp;

    // Arms swing with unnatural twitch
    leftArm.rotation.x = -Math.sin(cycle) * (amp * 1.2);
    rightArm.rotation.x = Math.sin(cycle) * (amp * 1.2);

    // Eerie head tilt and twitch
    const twitch = Math.sin(time * 14) > 0.85 ? (Math.random() - 0.5) * 0.4 : 0;
    headGroup.rotation.z = Math.sin(time * 2.2) * 0.15 + twitch;
    headGroup.rotation.y = Math.cos(time * 1.8) * 0.2;
    headGroup.rotation.x = isChasing ? 0.25 : Math.sin(time * 3) * 0.08;

    // Subtle bob
    root.position.y = Math.abs(Math.sin(cycle * 2)) * 0.08;
  };

  return {
    group: root,
    type: 'clown',
    head: headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    eyeLights: [eyeLight],
    updateAnimation,
  };
}

/** 2. Create Mascot 2: The Purple Glutton (Night 2 hulking stalker) */
export function createPurpleGlutton(): MascotCharacter {
  const root = new THREE.Group();

  const purpleMat = new THREE.MeshStandardMaterial({
    color: 0x3d1754, // Deep monstrous violet/grape
    roughness: 0.85,
    metalness: 0.1,
  });
  const darkMouthMat = new THREE.MeshBasicMaterial({
    color: 0x0a0310,
  });
  const yellowEyeMat = new THREE.MeshBasicMaterial({
    color: 0xffd000, // Piercing yellow eye
  });

  // Massive pear-shaped body
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.95, 1.9, 12), purpleMat);
  body.position.set(0, 1.1, 0);
  body.castShadow = true;
  root.add(body);

  // Big dome head directly on shoulders
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.1, 0);

  const headDome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 14), purpleMat);
  headGroup.add(headDome);

  // Gaping cavernous maw
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.12, 10), darkMouthMat);
  mouth.rotation.x = Math.PI / 2;
  mouth.position.set(0, -0.15, 0.45);
  headGroup.add(mouth);

  // Glowing yellow eyes
  const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), yellowEyeMat);
  eyeL.position.set(-0.2, 0.12, 0.48);
  const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), yellowEyeMat);
  eyeR.position.set(0.2, 0.12, 0.48);
  headGroup.add(eyeL, eyeR);

  const eyeLight = new THREE.PointLight(0xffaa00, 0.6, 5.0);
  eyeLight.position.set(0, 0.12, 0.65);
  headGroup.add(eyeLight);

  root.add(headGroup);

  // Heavy, thick arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.7, 1.7, 0);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 8), purpleMat);
  armL.position.set(0, -0.5, 0);
  leftArm.add(armL);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.7, 1.7, 0);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 8), purpleMat);
  armR.position.set(0, -0.5, 0);
  rightArm.add(armR);
  root.add(rightArm);

  // Stubby heavy legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.35, 0.5, 0);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.6, 8), purpleMat);
  legL.position.set(0, -0.25, 0);
  leftLeg.add(legL);
  root.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.35, 0.5, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.6, 8), purpleMat);
  legR.position.set(0, -0.25, 0);
  rightLeg.add(legR);
  root.add(rightLeg);

  const updateAnimation = (time: number, speed: number, isChasing: boolean) => {
    const cycle = time * (isChasing ? 6.0 : 3.0);
    const amp = isChasing ? 0.45 : 0.25;

    leftLeg.rotation.x = Math.sin(cycle) * amp;
    rightLeg.rotation.x = -Math.sin(cycle) * amp;

    leftArm.rotation.x = -Math.sin(cycle) * amp * 1.1;
    rightArm.rotation.x = Math.sin(cycle) * amp * 1.1;

    headGroup.rotation.y = Math.sin(time * 1.5) * 0.25;
    root.position.y = Math.abs(Math.sin(cycle * 2)) * 0.05;
  };

  return {
    group: root,
    type: 'purple_glutton',
    head: headGroup,
    leftArm,
    rightArm,
    leftLeg,
    rightLeg,
    eyeLights: [eyeLight],
    updateAnimation,
  };
}
