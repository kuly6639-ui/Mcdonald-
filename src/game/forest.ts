import * as THREE from 'three';
import { createPS1CrumpledTrashBag } from './props';

/**
 * Extreme Super Low Poly / PS1 Retro Back-Alley & Forest Generator for McDonald's Nightfall.
 * Strict PS1 Rules:
 * - Every tree/shrub primitive strictly <= 10 polygons/faces
 * - Back-alley garbage bags use watertight vertex-hashed IcosahedronGeometry(0.35, 1) + pinched 6-sided knot
 * - Every material uses flatShading: true and roughness: 0.9
 */

export interface ForestResult {
  group: THREE.Group;
  treeColliders: { minX: number; maxX: number; minZ: number; maxZ: number }[];
}

/** Standalone helper: PS1 Back Trash Area (Dumpster + Crumpled Garbage Bags + Cardboard Boxes) */
export function createBackTrashCluster(): THREE.Group {
  const cluster = new THREE.Group();
  cluster.name = 'PS1_BackTrashArea';

  const dumpsterGreenMat = new THREE.MeshStandardMaterial({
    color: 0x1f4728,
    flatShading: true,
    roughness: 0.9,
  });
  const rustTrimMat = new THREE.MeshStandardMaterial({
    color: 0x4f301e,
    flatShading: true,
    roughness: 0.9,
  });
  const lidMat = new THREE.MeshStandardMaterial({
    color: 0x1a1c1d,
    flatShading: true,
    roughness: 0.9,
  });
  const cardMat = new THREE.MeshStandardMaterial({
    color: 0x8a633c,
    flatShading: true,
    roughness: 0.9,
  });

  // Large blocky green/rusty dumpster
  const tub = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.25, 1.4), dumpsterGreenMat);
  tub.position.set(0, 0.72, 0);
  tub.castShadow = true;
  tub.receiveShadow = true;
  cluster.add(tub);

  const rustBand = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.16, 1.44), rustTrimMat);
  rustBand.position.set(0, 0.35, 0);
  cluster.add(rustBand);

  // Angled open & closed lids (sharp BoxGeometry)
  const lidL = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), lidMat);
  lidL.position.set(-0.62, 1.48, -0.15);
  lidL.rotation.z = 0.24;
  lidL.rotation.x = -0.22;

  const lidR = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), lidMat);
  lidR.position.set(0.6, 1.38, 0);
  lidR.rotation.z = -0.05;
  cluster.add(lidL, lidR);

  // Watertight PS1 crumpled black garbage bags piled beside dumpster
  const bagOffsets: [number, number, number, number][] = [
    [-1.45, 0.35, 1.0, 0.2],
    [-1.18, 0.65, 0.85, 1.5],
    [1.42, 0.3, 0.95, 2.7],
  ];
  bagOffsets.forEach(([bx, bz, s, ry], idx) => {
    const bag = createPS1CrumpledTrashBag(0.35 * s, idx + 1);
    bag.position.set(bx, 0, bz);
    bag.rotation.y = ry;
    cluster.add(bag);
  });

  // Cardboard boxes stacked beside dumpster
  const box1 = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.36, 0.5), cardMat);
  box1.position.set(1.55, 0.18, -0.35);
  box1.rotation.y = 0.2;
  const box2 = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.28, 0.42), cardMat);
  box2.position.set(1.52, 0.5, -0.32);
  box2.rotation.y = -0.15;
  cluster.add(box1, box2);

  return cluster;
}

/**
 * Model 7: createBackAlleyAndForest()
 * Builds the dark PS1 pine forest surrounding the road and restaurant clearing
 * (plus optional standalone back-alley trash cluster).
 */
export function createBackAlleyAndForest(
  addCollision?: (minX: number, maxX: number, minZ: number, maxZ: number) => void,
  includeBackTrashCluster: boolean = true
): ForestResult {
  const group = new THREE.Group();
  group.name = 'HorrorForestPerimeter';
  const treeColliders: { minX: number; maxX: number; minZ: number; maxZ: number }[] = [];

  const registerCollision = (minX: number, maxX: number, minZ: number, maxZ: number) => {
    treeColliders.push({ minX, maxX, minZ, maxZ });
    if (addCollision) {
      addCollision(minX, maxX, minZ, maxZ);
    }
  };

  if (includeBackTrashCluster) {
    const backTrash = createBackTrashCluster();
    backTrash.position.set(4, 0, -9.5);
    group.add(backTrash);
  }

  // --- REUSABLE PS1 FLAT-SHADED ROUGH MATERIALS ---
  const pineTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x1b140f,
    flatShading: true,
    roughness: 0.9,
  });

  const deadBarkMat = new THREE.MeshStandardMaterial({
    color: 0x121214,
    flatShading: true,
    roughness: 0.9,
  });

  // Dark desaturated pine green shades (#142419 primary + subtle variations)
  const pineNeedleMat1 = new THREE.MeshStandardMaterial({
    color: 0x142419,
    flatShading: true,
    roughness: 0.9,
  });
  const pineNeedleMat2 = new THREE.MeshStandardMaterial({
    color: 0x101e15,
    flatShading: true,
    roughness: 0.9,
  });
  const pineNeedleMat3 = new THREE.MeshStandardMaterial({
    color: 0x182b1e,
    flatShading: true,
    roughness: 0.9,
  });
  const pineMats = [pineNeedleMat1, pineNeedleMat2, pineNeedleMat3];

  const shrubMat = new THREE.MeshStandardMaterial({
    color: 0x142419,
    flatShading: true,
    roughness: 0.9,
  });
  const deadBushMat = new THREE.MeshStandardMaterial({
    color: 0x221a14,
    flatShading: true,
    roughness: 0.9,
  });

  // --- REUSABLE <=10-POLYGON GEOMETRIES ---
  // 5-sided skinny trunk cylinder (<= 7 faces)
  const trunkGeo = new THREE.CylinderGeometry(0.14, 0.28, 11, 5, 1);
  const deadTrunkGeo = new THREE.CylinderGeometry(0.1, 0.26, 8, 5, 1);
  const branchGeo = new THREE.CylinderGeometry(0.035, 0.08, 3.0, 5, 1);

  // 2-3 stacked 5-sided cones (6 faces each)
  const pineConeGeo1 = new THREE.ConeGeometry(2.4, 4.0, 5, 1);
  const pineConeGeo2 = new THREE.ConeGeometry(1.8, 3.4, 5, 1);
  const pineConeGeo3 = new THREE.ConeGeometry(1.2, 2.8, 5, 1);

  // Detail-0 Octahedron (strictly 8 faces <= 10)
  const bushGeo = new THREE.OctahedronGeometry(0.75, 0);
  const rockGeo = new THREE.OctahedronGeometry(0.65, 0);

  // Helper: Tall PS1 creepy pine tree (1 skinny 5-sided trunk + 3 stacked 5-sided cones)
  const createPineTree = (scale = 1.0, matIndex = 0): THREE.Group => {
    const tree = new THREE.Group();

    const trunk = new THREE.Mesh(trunkGeo, pineTrunkMat);
    trunk.position.y = 5.5;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const needleMat = pineMats[matIndex % pineMats.length];

    const cone1 = new THREE.Mesh(pineConeGeo1, needleMat);
    cone1.position.y = 5.8;
    tree.add(cone1);

    const cone2 = new THREE.Mesh(pineConeGeo2, needleMat);
    cone2.position.y = 8.0;
    cone2.rotation.y = 0.6;
    tree.add(cone2);

    const cone3 = new THREE.Mesh(pineConeGeo3, needleMat);
    cone3.position.y = 10.0;
    cone3.rotation.y = 1.2;
    tree.add(cone3);

    tree.scale.setScalar(scale);
    return tree;
  };

  // Helper: Twisted bare PS1 dead tree (5-sided trunk + 5-sided branches)
  const createTwistedDeadTree = (scale = 1.0): THREE.Group => {
    const tree = new THREE.Group();

    const mainTrunk = new THREE.Mesh(deadTrunkGeo, deadBarkMat);
    mainTrunk.position.y = 4.0;
    mainTrunk.rotation.z = (Math.random() - 0.5) * 0.18;
    tree.add(mainTrunk);

    const branchCount = 3 + Math.floor(Math.random() * 2);
    for (let b = 0; b < branchCount; b++) {
      const branch = new THREE.Mesh(branchGeo, deadBarkMat);
      const angle = (b / branchCount) * Math.PI * 2 + Math.random() * 0.4;
      const height = 4.0 + Math.random() * 2.8;
      branch.position.set(Math.cos(angle) * 0.3, height, Math.sin(angle) * 0.3);
      branch.rotation.x = Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
      branch.rotation.z = Math.cos(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
      branch.rotation.y = angle;
      tree.add(branch);
    }

    tree.scale.setScalar(scale);
    return tree;
  };

  // Helper: Low-poly underbrush cluster
  const createUnderbrush = (): THREE.Group => {
    const cluster = new THREE.Group();
    const count = 2 + Math.floor(Math.random() * 2);
    for (let i = 0; i < count; i++) {
      const isDead = Math.random() > 0.6;
      const bush = new THREE.Mesh(bushGeo, isDead ? deadBushMat : shrubMat);
      const bx = (Math.random() - 0.5) * 1.8;
      const bz = (Math.random() - 0.5) * 1.8;
      const bScale = 0.5 + Math.random() * 0.7;
      bush.scale.set(bScale, bScale * (0.6 + Math.random() * 0.5), bScale);
      bush.position.set(bx, bScale * 0.4, bz);
      bush.rotation.y = Math.random() * Math.PI * 2;
      cluster.add(bush);
    }

    if (Math.random() > 0.5) {
      const rock = new THREE.Mesh(rockGeo, deadBarkMat);
      rock.scale.set(0.6 + Math.random() * 0.5, 0.4 + Math.random() * 0.3, 0.6 + Math.random() * 0.5);
      rock.position.set((Math.random() - 0.5) * 1.5, 0.2, (Math.random() - 0.5) * 1.5);
      cluster.add(rock);
    }

    return cluster;
  };

  // --- EXTENDED FOREST TERRAIN FLOOR ---
  const forestFloorMat = new THREE.MeshStandardMaterial({
    color: 0x090e0c,
    flatShading: true,
    roughness: 0.9,
  });

  const rearFloor = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), forestFloorMat);
  rearFloor.rotation.x = -Math.PI / 2;
  rearFloor.position.set(0, -0.05, -36);
  rearFloor.receiveShadow = true;
  group.add(rearFloor);

  const westFloor = new THREE.Mesh(new THREE.PlaneGeometry(55, 90), forestFloorMat);
  westFloor.rotation.x = -Math.PI / 2;
  westFloor.position.set(-37, -0.05, 5);
  westFloor.receiveShadow = true;
  group.add(westFloor);

  const eastFloor = new THREE.Mesh(new THREE.PlaneGeometry(55, 90), forestFloorMat);
  eastFloor.rotation.x = -Math.PI / 2;
  eastFloor.position.set(37, -0.05, 5);
  eastFloor.receiveShadow = true;
  group.add(eastFloor);

  const southFloor = new THREE.Mesh(new THREE.PlaneGeometry(120, 40), forestFloorMat);
  southFloor.rotation.x = -Math.PI / 2;
  southFloor.position.set(0, -0.05, 48);
  southFloor.receiveShadow = true;
  group.add(southFloor);

  // --- DETERMINISTIC SEEDED FOREST LAYOUT ---
  let seed = 48271;
  const pseudoRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const spawnTreeAt = (x: number, z: number, scaleVariation = 1.0) => {
    const isDeadTree = pseudoRandom() < 0.22;
    const treeScale = (0.8 + pseudoRandom() * 0.55) * scaleVariation;
    const rotY = pseudoRandom() * Math.PI * 2;

    const tree = isDeadTree
      ? createTwistedDeadTree(treeScale)
      : createPineTree(treeScale, Math.floor(pseudoRandom() * 3));

    tree.position.set(x, 0, z);
    tree.rotation.y = rotY;
    group.add(tree);

    if (pseudoRandom() < 0.65) {
      const underbrush = createUnderbrush();
      underbrush.position.set(x + (pseudoRandom() - 0.5) * 1.5, 0, z + (pseudoRandom() - 0.5) * 1.5);
      group.add(underbrush);
    }
  };

  // 1. NORTH / REAR FOREST PERIMETER
  for (let row = 0; row < 7; row++) {
    const baseZ = -10.5 - row * 5.5;
    const count = 24 + row * 2;
    for (let c = 0; c < count; c++) {
      const x = -48 + (c / count) * 96 + (pseudoRandom() - 0.5) * 2.8;
      const z = baseZ + (pseudoRandom() - 0.5) * 2.5;
      if (x > 1.5 && x < 6.0 && z > -9.5) continue;
      spawnTreeAt(x, z, 1.0 + row * 0.08);
    }
  }
  registerCollision(-50, 50, -52, -10.5);

  // 2. WEST FOREST PERIMETER
  for (let col = 0; col < 6; col++) {
    const baseX = -18.5 - col * 6.0;
    const count = 18;
    for (let r = 0; r < count; r++) {
      const z = -28 + (r / count) * 56 + (pseudoRandom() - 0.5) * 2.8;
      const x = baseX + (pseudoRandom() - 0.5) * 2.6;
      if (x > -15.5 && z > -15.5 && z < 19.0) continue;
      spawnTreeAt(x, z, 1.0 + col * 0.08);
    }
  }
  registerCollision(-55, -18.0, -30, 28);

  // 3. EAST FOREST PERIMETER
  for (let col = 0; col < 6; col++) {
    const baseX = 16.5 + col * 6.0;
    const count = 18;
    for (let r = 0; r < count; r++) {
      const z = -28 + (r / count) * 56 + (pseudoRandom() - 0.5) * 2.8;
      const x = baseX + (pseudoRandom() - 0.5) * 2.4;
      if (x < 15.5) continue;
      spawnTreeAt(x, z, 1.0 + col * 0.08);
    }
  }
  registerCollision(16.0, 54, -30, 28);

  // 4. SOUTH FOREST PERIMETER
  for (let row = 0; row < 5; row++) {
    const baseZ = 30.5 + row * 5.5;
    const count = 26;
    for (let c = 0; c < count; c++) {
      const x = -50 + (c / count) * 100 + (pseudoRandom() - 0.5) * 3.0;
      const z = baseZ + (pseudoRandom() - 0.5) * 2.5;
      spawnTreeAt(x, z, 1.0 + row * 0.1);
    }
  }
  registerCollision(-50, 50, 30.5, 58);

  // 5. ATMOSPHERIC LOW-POLY FOREST MIST PLANES
  const mistMat = new THREE.MeshBasicMaterial({
    color: 0x1e2d33,
    transparent: true,
    opacity: 0.12,
    depthWrite: false,
    side: THREE.DoubleSide,
  });

  const mistPlanes = [
    { pos: [0, 1.2, -18], size: [60, 4.0] },
    { pos: [-24, 1.2, 0], size: [40, 4.0] },
    { pos: [24, 1.2, 0], size: [40, 4.0] },
    { pos: [0, 1.2, 38], size: [70, 4.0] },
  ];

  mistPlanes.forEach((mp) => {
    const plane = new THREE.Mesh(new THREE.PlaneGeometry(mp.size[0], mp.size[1]), mistMat);
    plane.position.set(mp.pos[0], mp.pos[1], mp.pos[2]);
    group.add(plane);
  });

  return { group, treeColliders };
}

/** Compatibility export used by world.ts (without duplicating interactive dumpster) */
export function populateSurroundingForest(
  addCollision?: (minX: number, maxX: number, minZ: number, maxZ: number) => void
): ForestResult {
  return createBackAlleyAndForest(addCollision, false);
}
