import * as THREE from 'three';
import {
  createPS1BloodyBladeTexture,
  createPS1ClownFaceTexture,
  createPS1ClownSuitTexture,
  createPS1ClownStripedSleeveTexture,
} from './textures';
import { buildSculptedPS1HeadGeometry, createPS1HeadMaterial, createPS1NoseMesh } from './props';

/**
 * Extreme Super Low Poly / PS1 Retro Procedural Mascots for McDonald's Nightfall.
 * Strict PS1 Rules:
 * - Killer Clown uses a vertex-sculpted 12x8 faceted low-poly head (elongated gaunt shape, sharp V-jawline,
 *   sunken cheeks, pushed brow ridge & cheekbones, 4-sided low-poly nose cone, seamless 360° UV face paint)
 * - Purple Glutton uses 14-segment SphereGeometry & <=10-poly body parts with flatShading: true and roughness: 0.9
 * - Ground-level pivot (y = 0) & preserved MascotCharacter animation hooks
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
  setPeekPose?: (isPeeking: boolean, time: number, leanDir?: number) => void;
  setWindowBangPose?: (leanForward: number, headPitch: number) => void;
  setHeadBloodied?: (bloodied: boolean) => void;
}

/**
 * Custom faceted low-poly wide butcher knife / machete blade geometry with clipped tip.
 * UV-mapped cleanly on both faces so the 64x64 NearestFilter bloody steel texture spans spine -> cutting edge.
 */
function buildBloodyButcherKnifeGeometry(): THREE.BufferGeometry {
  const t = 0.007; // half-thickness
  // Profile points: [x (spine - -> edge +), y (hilt 0 -> tip 0.38), u]
  // Spine (u = 0) on left (-X), Honed blood-stained cutting edge (u = 1) on right (+X)
  const positions: number[] = [
    // Front (+Z) vertices 0..6
    -0.038, 0.00, t,   // 0: spine base
     0.038, 0.00, t,   // 1: edge base
    -0.042, 0.24, t,   // 2: spine mid
     0.054, 0.21, t,   // 3: edge wide belly
    -0.026, 0.32, t,   // 4: spine clipped shoulder
     0.034, 0.31, t,   // 5: edge upper curve
     0.004, 0.385, t,  // 6: sharp point tip

    // Back (-Z) vertices 7..13
    -0.038, 0.00, -t,  // 7
     0.038, 0.00, -t,  // 8
    -0.042, 0.24, -t,  // 9
     0.054, 0.21, -t,  // 10
    -0.026, 0.32, -t,  // 11
     0.034, 0.31, -t,  // 12
     0.004, 0.385, -t, // 13
  ];

  const uvs: number[] = [
    // Front
    0.0, 0.0,
    1.0, 0.0,
    0.0, 0.62,
    1.0, 0.56,
    0.15, 0.84,
    0.92, 0.82,
    0.55, 1.0,
    // Back
    0.0, 0.0,
    1.0, 0.0,
    0.0, 0.62,
    1.0, 0.56,
    0.15, 0.84,
    0.92, 0.82,
    0.55, 1.0,
  ];

  const indices: number[] = [
    // Front face (+Z)
    0, 1, 3,
    0, 3, 2,
    2, 3, 5,
    2, 5, 4,
    4, 5, 6,
    // Back face (-Z)
    7, 10, 8,
    7, 9, 10,
    9, 12, 10,
    9, 11, 12,
    11, 13, 12,
    // Spine rim (-X)
    0, 2, 9,
    0, 9, 7,
    2, 4, 11,
    2, 11, 9,
    4, 6, 13,
    4, 13, 11,
    // Cutting edge rim (+X)
    1, 8, 10,
    1, 10, 3,
    3, 10, 12,
    3, 12, 5,
    5, 12, 13,
    5, 13, 6,
    // Base rim
    0, 7, 8,
    0, 8, 1,
  ];

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Model 1: createKillerClown() — Vertex-Sculpted PS1 Killer Clown with Bloody Machete */
export function createKillerClown(): MascotCharacter {
  const root = new THREE.Group();
  root.name = 'PS1_KillerClown';

  // Strict PS1 flat-shaded rough materials matching the reference killer clown palette
  const suitPatchworkMat = new THREE.MeshStandardMaterial({
    map: createPS1ClownSuitTexture(), // Weathered mustard-yellow jumpsuit with dried blood splatters
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
  });
  const suitYellowMat = new THREE.MeshStandardMaterial({
    color: 0xb99622, // Faded mustard yellow jumpsuit
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
  });
  const suitDarkRedMat = new THREE.MeshStandardMaterial({
    color: 0x701212, // Crimson red tie/bib, shoulder trim & clown shoes
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
  });
  const suitStripedSleeveMat = new THREE.MeshStandardMaterial({
    map: createPS1ClownStripedSleeveTexture(), // Alternating dark red & off-white horizontal sleeve rings
    flatShading: true,
    roughness: 0.9,
    metalness: 0.0,
  });
  const suitSleeveWhiteMat = new THREE.MeshStandardMaterial({
    color: 0xdedbd2, // Off-white sleeve stripes matching reference arms
    flatShading: true,
    roughness: 0.9,
  });
  const hairMat = new THREE.MeshStandardMaterial({
    color: 0x7a1212, // Chunky crimson red Ronald clown wig (crown, back & sides)
    flatShading: true,
    roughness: 0.9,
  });
  const whiteSkinMat = new THREE.MeshStandardMaterial({
    color: 0xf2efe8, // White greasepaint matching 64x64 face CanvasTexture
    flatShading: true,
    roughness: 0.9,
  });
  const noseMat = new THREE.MeshStandardMaterial({
    color: 0xb81414, // Low-poly 3D crimson clown nose
    flatShading: true,
    roughness: 0.9,
  });
  const faceMat = createPS1HeadMaterial(createPS1ClownFaceTexture(), 0.24);
  const gloveMat = new THREE.MeshStandardMaterial({
    color: 0xd4d0c5,
    flatShading: true,
    roughness: 0.9,
  });
  const collarMat = new THREE.MeshStandardMaterial({
    color: 0xebe8df, // Crisp folded white collar lapels
    flatShading: true,
    roughness: 0.9,
  });
  const shoeMat = new THREE.MeshStandardMaterial({
    color: 0x5c1010,
    flatShading: true,
    roughness: 0.9,
  });
  const bladeTex = createPS1BloodyBladeTexture();
  const bladeMat = new THREE.MeshStandardMaterial({
    map: bladeTex,
    emissiveMap: bladeTex,
    emissive: 0x2a1414,
    emissiveIntensity: 0.14,
    flatShading: true,
    roughness: 0.55,
    metalness: 0.42,
  });
  const handleMat = new THREE.MeshStandardMaterial({
    color: 0x1c1714, // Dark riveted butcher knife handle
    flatShading: true,
    roughness: 0.9,
  });
  const rivetMat = new THREE.MeshStandardMaterial({
    color: 0xa2a8ae,
    flatShading: true,
    roughness: 0.5,
    metalness: 0.6,
  });

  // Distinct Low-Poly Pelvis / Flared Hip Block + Hip Leg Sockets
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, 1.20, 0);
  const pelvis = new THREE.Mesh(
    new THREE.CylinderGeometry(0.118, 0.205, 0.21, 8, 1),
    suitPatchworkMat
  );
  pelvis.scale.set(1.12, 1.0, 0.76);
  const hipSocketL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.092, 0.10, 6, 1),
    suitYellowMat
  );
  hipSocketL.position.set(-0.15, -0.05, 0);
  const hipSocketR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.095, 0.092, 0.10, 6, 1),
    suitDarkRedMat
  );
  hipSocketR.position.set(0.15, -0.05, 0);
  pelvisGroup.add(pelvis, hipSocketL, hipSocketR);
  root.add(pelvisGroup);

  // Waist-pivoted upperBody group for corner-peeking lean
  const upperBody = new THREE.Group();
  upperBody.position.set(0, 1.30, 0);
  root.add(upperBody);

  // Extra-Gaunt, Narrow Tapered 6-Sided Waist + Dark Waistband Seam
  const waistBelt = new THREE.Mesh(
    new THREE.CylinderGeometry(0.118, 0.125, 0.048, 6, 1),
    suitDarkRedMat
  );
  waistBelt.scale.set(1.08, 1.0, 0.72);
  waistBelt.position.set(0, 0.015, 0);

  const gauntWaist = new THREE.Mesh(
    new THREE.CylinderGeometry(0.172, 0.102, 0.34, 6, 1),
    suitPatchworkMat
  );
  gauntWaist.scale.set(1.06, 1.0, 0.68);
  gauntWaist.position.set(0, 0.17, 0);
  gauntWaist.castShadow = true;

  // Broader Upper Chest / Ribcage tapering cleanly into the pinched gaunt waist
  const upperChest = new THREE.Mesh(
    new THREE.CylinderGeometry(0.292, 0.17, 0.44, 8, 1),
    suitPatchworkMat
  );
  upperChest.scale.set(1.16, 1.0, 0.72);
  upperChest.position.set(0, 0.51, 0);
  upperChest.castShadow = true;

  const shoulderYoke = new THREE.Mesh(
    new THREE.CylinderGeometry(0.20, 0.288, 0.12, 8, 1),
    suitPatchworkMat
  );
  shoulderYoke.scale.set(1.18, 1.0, 0.72);
  shoulderYoke.position.set(0, 0.78, 0);
  shoulderYoke.castShadow = true;

  // Angular faceted low-poly shoulder blocks welding torso directly into striped upper sleeve caps
  const shoulderBlockL = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.135, 0.175), suitStripedSleeveMat);
  shoulderBlockL.position.set(-0.295, 0.725, 0);
  shoulderBlockL.rotation.z = 0.24;
  shoulderBlockL.castShadow = true;
  const shoulderBlockR = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.135, 0.175), suitStripedSleeveMat);
  shoulderBlockR.position.set(0.295, 0.725, 0);
  shoulderBlockR.rotation.z = -0.24;
  shoulderBlockR.castShadow = true;

  // Signature central crimson red vertical tie/bib strip down the yellow jumpsuit chest & waist (matches reference)
  const chestRedTie = new THREE.Mesh(new THREE.BoxGeometry(0.135, 0.5, 0.042), suitDarkRedMat);
  chestRedTie.position.set(0, 0.52, 0.172);
  chestRedTie.rotation.x = -0.22;
  const waistRedTie = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.31, 0.042), suitDarkRedMat);
  waistRedTie.position.set(0, 0.17, 0.118);
  waistRedTie.rotation.x = -0.14;

  upperBody.add(
    waistBelt,
    gauntWaist,
    upperChest,
    shoulderYoke,
    shoulderBlockL,
    shoulderBlockR,
    chestRedTie,
    waistRedTie
  );

  // Crisp folded white shirt collar lapels around neck
  const collarBase = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.19, 0.07, 8, 1), collarMat);
  collarBase.scale.set(1.06, 1.0, 0.88);
  collarBase.position.set(0, 0.84, 0.0);
  const collarLapelL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.065, 0.10), collarMat);
  collarLapelL.position.set(-0.09, 0.81, 0.11);
  collarLapelL.rotation.set(0.32, 0.22, -0.34);
  const collarLapelR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.065, 0.10), collarMat);
  collarLapelR.position.set(0.09, 0.81, 0.11);
  collarLapelR.rotation.set(0.32, -0.22, 0.34);
  upperBody.add(collarBase, collarLapelL, collarLapelR);

  // Vertex-Sculpted Gaunt PS1 Head Group + 4-sided red nose + full dark-red Ronald clown wig (crown, back & sides)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.08, 0);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.076, 0.18, 6, 1), whiteSkinMat);
  neck.position.set(0, -0.22, 0);
  headGroup.add(neck);

  const headRadius = 0.23;
  const headGeo = buildSculptedPS1HeadGeometry(headRadius, 'clown');
  const cranium = new THREE.Mesh(headGeo, faceMat);
  headGroup.add(cranium);

  // Sharp 4-sided low-poly triangular red nose protruding from center of sculpted face
  const clownNose = createPS1NoseMesh(headRadius, noseMat);
  headGroup.add(clownNose);

  // Full low-poly dark crimson clown wig arching over top crown, back, and puffy sides (matches reference silhouette)
  const wigCrown = new THREE.Mesh(new THREE.IcosahedronGeometry(0.22, 0), hairMat);
  wigCrown.scale.set(1.16, 0.72, 1.05);
  wigCrown.position.set(0, 0.235, -0.045);
  const wigBack = new THREE.Mesh(new THREE.IcosahedronGeometry(0.205, 0), hairMat);
  wigBack.scale.set(1.12, 1.05, 0.72);
  wigBack.position.set(0, 0.06, -0.15);

  const hairConeGeoMain = new THREE.IcosahedronGeometry(0.125, 0);
  const hairConeGeoLower = new THREE.IcosahedronGeometry(0.105, 0);

  const hairL1 = new THREE.Mesh(hairConeGeoMain, hairMat);
  hairL1.scale.set(0.95, 1.25, 1.08);
  hairL1.position.set(-0.21, 0.15, -0.025);
  hairL1.rotation.z = 0.22;
  const hairL2 = new THREE.Mesh(hairConeGeoLower, hairMat);
  hairL2.scale.set(0.92, 1.15, 1.02);
  hairL2.position.set(-0.215, 0.0, -0.04);
  hairL2.rotation.z = 0.12;

  const hairR1 = new THREE.Mesh(hairConeGeoMain, hairMat);
  hairR1.scale.set(0.95, 1.25, 1.08);
  hairR1.position.set(0.21, 0.15, -0.025);
  hairR1.rotation.z = -0.22;
  const hairR2 = new THREE.Mesh(hairConeGeoLower, hairMat);
  hairR2.scale.set(0.92, 1.15, 1.02);
  hairR2.position.set(0.215, 0.0, -0.04);
  hairR2.rotation.z = -0.12;

  headGroup.add(wigCrown, wigBack, hairL1, hairL2, hairR1, hairR2);

  // Forehead head-slam wound & dripping blood streaks (toggled on Night 3 car window impacts)
  const headBloodGroup = new THREE.Group();
  headBloodGroup.visible = false;
  const freshBloodMat = new THREE.MeshStandardMaterial({
    color: 0x990c0c,
    emissive: 0x3b0303,
    emissiveIntensity: 0.25,
    flatShading: true,
    roughness: 0.45,
  });
  const darkBloodMat = new THREE.MeshStandardMaterial({
    color: 0x5c0606,
    flatShading: true,
    roughness: 0.55,
  });
  const foreheadGash = new THREE.Mesh(new THREE.BoxGeometry(0.085, 0.032, 0.025), darkBloodMat);
  foreheadGash.position.set(0.0, 0.135, 0.188);
  foreheadGash.rotation.z = 0.14;
  const foreheadSmear = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.055, 0.018), freshBloodMat);
  foreheadSmear.position.set(0.0, 0.125, 0.185);
  const dripCenter = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.16, 0.018), freshBloodMat);
  dripCenter.position.set(-0.01, 0.04, 0.194);
  const dripLeft = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.14, 0.018), freshBloodMat);
  dripLeft.position.set(-0.055, 0.03, 0.184);
  const dripRight = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.12, 0.018), darkBloodMat);
  dripRight.position.set(0.052, 0.04, 0.184);
  headBloodGroup.add(foreheadGash, foreheadSmear, dripCenter, dripLeft, dripRight);
  headGroup.add(headBloodGroup);

  // Subtle ominous eye glow for horror silhouettes
  const eyeLight = new THREE.PointLight(0xffdddd, 0.75, 4.0);
  eyeLight.position.set(0, 0.06, 0.35);
  headGroup.add(eyeLight);
  upperBody.add(headGroup);

  // Left Arm (Faceted red-and-white horizontal striped PS1 sleeves matching reference)
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.34, 0.715, 0);
  const shoulderCapL = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.096, 0.15, 6, 1), suitDarkRedMat);
  shoulderCapL.position.set(0.012, -0.035, 0);
  const upperBandL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.094, 0.22, 6, 1), suitSleeveWhiteMat);
  upperBandL1.position.set(0, -0.22, 0);
  const upperBandL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.082, 0.22, 6, 1), suitDarkRedMat);
  upperBandL2.position.set(0, -0.44, 0);
  const forearmL1 = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.064, 0.22, 6, 1), suitSleeveWhiteMat);
  forearmL1.position.set(0, -0.66, 0.015);
  const forearmL2 = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.048, 0.20, 6, 1), suitDarkRedMat);
  forearmL2.position.set(0, -0.85, 0.025);
  const handL = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.14, 6, 1), gloveMat);
  handL.scale.set(1.0, 1.0, 0.78);
  handL.position.set(0, -0.99, 0.03);
  leftArm.add(shoulderCapL, upperBandL1, upperBandL2, forearmL1, forearmL2, handL);
  upperBody.add(leftArm);

  // Right Arm + Parented Hand Group Holding Blood-Stained Machete / Butcher Knife
  const rightArm = new THREE.Group();
  rightArm.position.set(0.34, 0.715, 0);
  const shoulderCapR = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.096, 0.15, 6, 1), suitDarkRedMat);
  shoulderCapR.position.set(-0.012, -0.035, 0);
  const upperBandR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.094, 0.22, 6, 1), suitSleeveWhiteMat);
  upperBandR1.position.set(0, -0.22, 0);
  const upperBandR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.092, 0.082, 0.22, 6, 1), suitDarkRedMat);
  upperBandR2.position.set(0, -0.44, 0);
  const forearmR1 = new THREE.Mesh(new THREE.CylinderGeometry(0.078, 0.064, 0.22, 6, 1), suitSleeveWhiteMat);
  forearmR1.position.set(0, -0.66, 0.015);
  const forearmR2 = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.048, 0.20, 6, 1), suitDarkRedMat);
  forearmR2.position.set(0, -0.85, 0.025);

  const rightHandGroup = new THREE.Group();
  rightHandGroup.position.set(0, -0.99, 0.03);
  const handR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.14, 6, 1), gloveMat);
  handR.scale.set(1.0, 1.0, 0.78);
  rightHandGroup.add(handR);

  // Sculpted Blood-Stained Butcher Knife / Machete parented directly inside rightHandGroup
  const cleaverGroup = new THREE.Group();
  cleaverGroup.position.set(-0.01, -0.04, 0.09);
  cleaverGroup.rotation.set(Math.PI / 2.5, 0.15, -0.08);

  const knifeHandle = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.14, 0.048), handleMat);
  knifeHandle.position.set(0, -0.06, 0);
  const rivet1 = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.014, 0.014), rivetMat);
  rivet1.position.set(0, -0.03, 0);
  const rivet2 = new THREE.Mesh(new THREE.BoxGeometry(0.038, 0.014, 0.014), rivetMat);
  rivet2.position.set(0, -0.09, 0);

  const knifeBlade = new THREE.Mesh(buildBloodyButcherKnifeGeometry(), bladeMat);
  knifeBlade.position.set(0, 0.005, 0);
  knifeBlade.rotation.y = Math.PI / 2; // Orient flat wide blade face vertically like a held butcher knife
  cleaverGroup.add(knifeHandle, rivet1, rivet2, knifeBlade);

  rightHandGroup.add(cleaverGroup);
  rightArm.add(shoulderCapR, upperBandR1, upperBandR2, forearmR1, forearmR2, rightHandGroup);
  upperBody.add(rightArm);

  // Left Leg (Weathered yellow baggy trouser leg + blocky crimson clown shoe)
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.15, 1.15, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.116, 0.52, 6, 1), suitPatchworkMat);
  thighL.position.set(0, -0.25, 0);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.06, 0.52, 6, 1), suitYellowMat);
  calfL.position.set(0, -0.75, 0);
  const shoeL = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.36, 6, 1), shoeMat);
  shoeL.rotation.x = Math.PI / 2;
  shoeL.scale.set(1.0, 1.0, 0.68);
  shoeL.position.set(0, -1.08, 0.09);
  leftLeg.add(thighL, calfL, shoeL);
  root.add(leftLeg);

  // Right Leg (Weathered yellow baggy trouser leg + crimson clown shoe)
  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.15, 1.15, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.094, 0.116, 0.52, 6, 1), suitPatchworkMat);
  thighR.position.set(0, -0.25, 0);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.112, 0.06, 0.52, 6, 1), suitYellowMat);
  calfR.position.set(0, -0.75, 0);
  const shoeR = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.095, 0.36, 6, 1), shoeMat);
  shoeR.rotation.x = Math.PI / 2;
  shoeR.scale.set(1.0, 1.0, 0.68);
  shoeR.position.set(0, -1.08, 0.09);
  rightLeg.add(thighR, calfR, shoeR);
  root.add(rightLeg);

  const setPeekPose = (isPeeking: boolean, time: number, leanDir: number = 1) => {
    if (!isPeeking) {
      upperBody.rotation.set(0, 0, 0);
      leftArm.rotation.set(0, 0, 0);
      rightArm.rotation.set(0, 0, 0);
      return;
    }

    upperBody.rotation.z = leanDir * (0.46 + Math.sin(time * 2.1) * 0.035);
    upperBody.rotation.x = 0.22;
    upperBody.rotation.y = 0;

    headGroup.rotation.z = -leanDir * 0.18 + Math.sin(time * 3.0) * 0.05;
    headGroup.rotation.x = -0.16;
    headGroup.rotation.y = Math.sin(time * 1.4) * 0.06;

    leftArm.rotation.x = -0.55;
    leftArm.rotation.z = 0.22;
    rightArm.rotation.x = -0.45;
    rightArm.rotation.z = -0.18;

    leftLeg.rotation.x = 0;
    rightLeg.rotation.x = 0;
    root.position.y = 0;
  };

  const updateAnimation = (time: number, speed: number, isChasing: boolean) => {
    upperBody.rotation.x = isChasing ? 0.16 : 0.05;
    upperBody.rotation.z = 0;
    leftArm.rotation.z = 0;
    rightArm.rotation.z = 0;

    const cycle = time * (isChasing ? 9.0 : 4.5);
    const amp = speed <= 0.05 ? 0.04 : isChasing ? 0.65 : 0.38;

    leftLeg.rotation.x = Math.sin(cycle) * amp;
    rightLeg.rotation.x = -Math.sin(cycle) * amp;

    leftArm.rotation.x = -Math.sin(cycle) * (amp * 1.2);
    // Raise knife arm forward menacingly while chasing
    rightArm.rotation.x = isChasing ? -0.9 + Math.sin(cycle) * 0.35 : Math.sin(cycle) * (amp * 1.2);

    const twitch = Math.sin(time * 14) > 0.85 ? (Math.random() - 0.5) * 0.4 : 0;
    headGroup.rotation.z = Math.sin(time * 2.2) * 0.15 + twitch;
    headGroup.rotation.y = Math.cos(time * 1.8) * 0.2;
    headGroup.rotation.x = isChasing ? 0.25 : Math.sin(time * 3) * 0.08;

    root.position.y = speed <= 0.05 ? 0 : Math.abs(Math.sin(cycle * 2)) * 0.08;
  };

  const setWindowBangPose = (leanForward: number, headPitch: number) => {
    upperBody.rotation.set(leanForward, 0, 0);
    headGroup.rotation.set(headPitch, 0, 0);
    leftArm.rotation.set(-1.15, 0, 0.24);
    rightArm.rotation.set(-1.15, 0, -0.24);
    leftLeg.rotation.set(-0.55, 0, 0);
    rightLeg.rotation.set(-0.55, 0, 0);
  };

  const setHeadBloodied = (bloodied: boolean) => {
    headBloodGroup.visible = bloodied;
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
    setPeekPose,
    setWindowBangPose,
    setHeadBloodied,
  };
}

/** Compatibility export for existing GameEngine calls */
export const createSmilingJester = createKillerClown;

/** Mascot 2: The Purple Glutton (Night 2 hulking stalker in strict <=10-poly PS1 style) */
export function createPurpleGlutton(): MascotCharacter {
  const root = new THREE.Group();

  const purpleMat = new THREE.MeshStandardMaterial({
    color: 0x3d1754,
    flatShading: true,
    roughness: 0.9,
    metalness: 0.05,
  });
  const darkMouthMat = new THREE.MeshBasicMaterial({ color: 0x0a0310 });
  const yellowEyeMat = new THREE.MeshBasicMaterial({ color: 0xffd000 });

  // Chunky 5-sided pear-shaped body (<= 7 faces)
  const body = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.95, 1.9, 5, 1), purpleMat);
  body.position.set(0, 1.1, 0);
  body.castShadow = true;
  root.add(body);

  // 14-segment SphereGeometry head (widthSegments: 14, heightSegments: 10, flatShading: true)
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 2.1, 0);

  const headDome = new THREE.Mesh(new THREE.SphereGeometry(0.55, 14, 10), purpleMat);
  headGroup.add(headDome);

  // Cavernous low-poly maw (5-sided disc)
  const mouth = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.12, 5, 1), darkMouthMat);
  mouth.rotation.x = Math.PI / 2;
  mouth.position.set(0, -0.14, 0.46);
  headGroup.add(mouth);

  // Glowing yellow eyes
  const eyeGeo = new THREE.BoxGeometry(0.1, 0.1, 0.08);
  const eyeL = new THREE.Mesh(eyeGeo, yellowEyeMat);
  eyeL.position.set(-0.18, 0.12, 0.49);
  const eyeR = new THREE.Mesh(eyeGeo, yellowEyeMat);
  eyeR.position.set(0.18, 0.12, 0.49);
  headGroup.add(eyeL, eyeR);

  const eyeLight = new THREE.PointLight(0xffaa00, 0.6, 5.0);
  eyeLight.position.set(0, 0.12, 0.65);
  headGroup.add(eyeLight);

  root.add(headGroup);

  // Heavy 5-sided arms
  const leftArm = new THREE.Group();
  leftArm.position.set(-0.7, 1.7, 0);
  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 5, 1), purpleMat);
  armL.position.set(0, -0.5, 0);
  leftArm.add(armL);
  root.add(leftArm);

  const rightArm = new THREE.Group();
  rightArm.position.set(0.7, 1.7, 0);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.16, 1.1, 5, 1), purpleMat);
  armR.position.set(0, -0.5, 0);
  rightArm.add(armR);
  root.add(rightArm);

  // Stubby 5-sided legs
  const leftLeg = new THREE.Group();
  leftLeg.position.set(-0.35, 0.5, 0);
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.6, 5, 1), purpleMat);
  legL.position.set(0, -0.25, 0);
  leftLeg.add(legL);
  root.add(leftLeg);

  const rightLeg = new THREE.Group();
  rightLeg.position.set(0.35, 0.5, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.22, 0.6, 5, 1), purpleMat);
  legR.position.set(0, -0.25, 0);
  rightLeg.add(legR);
  root.add(rightLeg);

  const updateAnimation = (time: number, _speed: number, isChasing: boolean) => {
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
