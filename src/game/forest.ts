import * as THREE from 'three';

/**
 * Procedural Horror Forest Generator for McDonald's Nightfall.
 * Generates dense, eerie woodlands surrounding the restaurant clearing:
 * - Tall horror pines / conifers with textured trunks and needle canopies
 * - Gnarled, leafless twisted dead trees with horror silhouettes
 * - Atmospheric dark broadleaf weeping trees
 * - Dense underbrush, ferns, shrubs, and mossy rocks along the forest fringe
 * 
 * Uses shared geometry & materials for high-efficiency rendering.
 */

export interface ForestResult {
  group: THREE.Group;
  treeColliders: { minX: number; maxX: number; minZ: number; maxZ: number }[];
}

export function populateSurroundingForest(
  addCollision?: (minX: number, maxX: number, minZ: number, maxZ: number) => void
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

  // --- REUSABLE MATERIALS ---
  // Dark wet pine bark
  const pineTrunkMat = new THREE.MeshStandardMaterial({
    color: 0x1b140f,
    roughness: 0.95,
    metalness: 0.05,
  });

  // Gnarled dead tree charcoal bark
  const deadBarkMat = new THREE.MeshStandardMaterial({
    color: 0x121214,
    roughness: 0.9,
    metalness: 0.1,
  });

  // Deep horror pine needle shades (3 subtle dark misty variations)
  const pineNeedleMat1 = new THREE.MeshStandardMaterial({
    color: 0x0d1f14,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });
  const pineNeedleMat2 = new THREE.MeshStandardMaterial({
    color: 0x122619,
    roughness: 0.85,
    metalness: 0.05,
    flatShading: true,
  });
  const pineNeedleMat3 = new THREE.MeshStandardMaterial({
    color: 0x1a2e22,
    roughness: 0.8,
    metalness: 0.05,
    flatShading: true,
  });
  const pineMats = [pineNeedleMat1, pineNeedleMat2, pineNeedleMat3];

  // Underbrush and shrub materials
  const shrubMat = new THREE.MeshStandardMaterial({
    color: 0x0f2016,
    roughness: 0.9,
    metalness: 0.05,
  });
  const deadBushMat = new THREE.MeshStandardMaterial({
    color: 0x221a14,
    roughness: 0.95,
  });

  // --- REUSABLE GEOMETRIES ---
  const trunkGeo = new THREE.CylinderGeometry(0.18, 0.35, 11, 7);
  const deadTrunkGeo = new THREE.CylinderGeometry(0.12, 0.32, 8, 6);
  const branchGeo = new THREE.CylinderGeometry(0.04, 0.1, 3.2, 5);

  const pineConeGeo1 = new THREE.ConeGeometry(2.4, 4.0, 7);
  const pineConeGeo2 = new THREE.ConeGeometry(1.8, 3.4, 7);
  const pineConeGeo3 = new THREE.ConeGeometry(1.2, 2.8, 6);

  const bushGeo = new THREE.DodecahedronGeometry(0.8, 1);
  const rockGeo = new THREE.DodecahedronGeometry(0.65, 0);

  // Helper: Create a tall creepy pine tree
  const createPineTree = (scale = 1.0, matIndex = 0): THREE.Group => {
    const tree = new THREE.Group();

    // Trunk
    const trunk = new THREE.Mesh(trunkGeo, pineTrunkMat);
    trunk.position.y = 5.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    tree.add(trunk);

    const needleMat = pineMats[matIndex % pineMats.length];

    // Tier 1 (Lowest)
    const cone1 = new THREE.Mesh(pineConeGeo1, needleMat);
    cone1.position.y = 5.8;
    cone1.castShadow = true;
    tree.add(cone1);

    // Tier 2
    const cone2 = new THREE.Mesh(pineConeGeo2, needleMat);
    cone2.position.y = 8.0;
    cone2.castShadow = true;
    tree.add(cone2);

    // Tier 3 (Crown)
    const cone3 = new THREE.Mesh(pineConeGeo3, needleMat);
    cone3.position.y = 10.0;
    cone3.castShadow = true;
    tree.add(cone3);

    tree.scale.setScalar(scale);
    return tree;
  };

  // Helper: Create a twisted bare horror tree
  const createTwistedDeadTree = (scale = 1.0): THREE.Group => {
    const tree = new THREE.Group();

    const mainTrunk = new THREE.Mesh(deadTrunkGeo, deadBarkMat);
    mainTrunk.position.y = 4.0;
    mainTrunk.rotation.z = (Math.random() - 0.5) * 0.18;
    tree.add(mainTrunk);

    // 3 to 4 twisted branches
    const branchCount = 3 + Math.floor(Math.random() * 2);
    for (let b = 0; b < branchCount; b++) {
      const branch = new THREE.Mesh(branchGeo, deadBarkMat);
      const angle = (b / branchCount) * Math.PI * 2 + Math.random() * 0.4;
      const height = 4.0 + Math.random() * 2.8;
      branch.position.set(
        Math.cos(angle) * 0.3,
        height,
        Math.sin(angle) * 0.3
      );
      branch.rotation.x = Math.sin(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
      branch.rotation.z = Math.cos(angle) * 0.8 + (Math.random() - 0.5) * 0.4;
      branch.rotation.y = angle;
      tree.add(branch);
    }

    tree.scale.setScalar(scale);
    return tree;
  };

  // Helper: Create underbrush cluster (ferns, bushes, rocks)
  const createUnderbrush = (): THREE.Group => {
    const cluster = new THREE.Group();
    const count = 2 + Math.floor(Math.random() * 3);
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

    // Occasional mossy rock
    if (Math.random() > 0.5) {
      const rock = new THREE.Mesh(rockGeo, deadBarkMat);
      rock.scale.set(0.6 + Math.random() * 0.5, 0.4 + Math.random() * 0.3, 0.6 + Math.random() * 0.5);
      rock.position.set((Math.random() - 0.5) * 1.5, 0.2, (Math.random() - 0.5) * 1.5);
      cluster.add(rock);
    }

    return cluster;
  };

  // --- EXTENDED FOREST TERRAIN FLOOR ---
  // Dark mossy forest soil surrounding the entire plot
  const forestFloorMat = new THREE.MeshStandardMaterial({
    color: 0x090e0c,
    roughness: 0.98,
    metalness: 0.02,
  });

  // Rear Forest Floor (Z: -6 to -60, X: -60 to 60)
  const rearFloor = new THREE.Mesh(new THREE.PlaneGeometry(120, 60), forestFloorMat);
  rearFloor.rotation.x = -Math.PI / 2;
  rearFloor.position.set(0, -0.05, -36);
  rearFloor.receiveShadow = true;
  group.add(rearFloor);

  // West Forest Floor (X: -10 to -65, Z: -30 to 45)
  const westFloor = new THREE.Mesh(new THREE.PlaneGeometry(55, 90), forestFloorMat);
  westFloor.rotation.x = -Math.PI / 2;
  westFloor.position.set(-37, -0.05, 5);
  westFloor.receiveShadow = true;
  group.add(westFloor);

  // East Forest Floor (X: 10 to 65, Z: -30 to 45)
  const eastFloor = new THREE.Mesh(new THREE.PlaneGeometry(55, 90), forestFloorMat);
  eastFloor.rotation.x = -Math.PI / 2;
  eastFloor.position.set(37, -0.05, 5);
  eastFloor.receiveShadow = true;
  group.add(eastFloor);

  // Far South Forest Floor (Across the highway: Z: 29 to 65, X: -60 to 60)
  const southFloor = new THREE.Mesh(new THREE.PlaneGeometry(120, 40), forestFloorMat);
  southFloor.rotation.x = -Math.PI / 2;
  southFloor.position.set(0, -0.05, 48);
  southFloor.receiveShadow = true;
  group.add(southFloor);

  // --- PROCEDURAL SEED GENERATOR ---
  // Deterministic pseudo-random number generator for consistent forest layout
  let seed = 48271;
  const pseudoRandom = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const spawnTreeAt = (x: number, z: number, scaleVariation = 1.0) => {
    const isDeadTree = pseudoRandom() < 0.22;
    const treeScale = (0.8 + pseudoRandom() * 0.55) * scaleVariation;
    const rotY = pseudoRandom() * Math.PI * 2;

    let tree: THREE.Group;
    if (isDeadTree) {
      tree = createTwistedDeadTree(treeScale);
    } else {
      const matIdx = Math.floor(pseudoRandom() * 3);
      tree = createPineTree(treeScale, matIdx);
    }

    tree.position.set(x, 0, z);
    tree.rotation.y = rotY;
    group.add(tree);

    // Add foliage underbrush near base
    if (pseudoRandom() < 0.65) {
      const underbrush = createUnderbrush();
      underbrush.position.set(x + (pseudoRandom() - 0.5) * 1.5, 0, z + (pseudoRandom() - 0.5) * 1.5);
      group.add(underbrush);
    }
  };

  // 1. NORTH / REAR FOREST PERIMETER (Behind Dumpster & Gravel)
  // Z ranges from -10 to -52, X ranges from -50 to 50
  for (let row = 0; row < 7; row++) {
    const baseZ = -10.5 - row * 5.5;
    const count = 24 + row * 2;
    for (let c = 0; c < count; c++) {
      const x = -48 + (c / count) * 96 + (pseudoRandom() - 0.5) * 2.8;
      const z = baseZ + (pseudoRandom() - 0.5) * 2.5;

      // Avoid clipping through rear door / dumpster gravel path (X: 2.0 to 5.5, Z: -6.0 to -9.0)
      if (x > 1.5 && x < 6.0 && z > -9.5) continue;

      spawnTreeAt(x, z, 1.0 + row * 0.08);
    }
  }

  // Rear perimeter collision barrier to keep player safely inside the horror boundaries
  registerCollision(-50, 50, -52, -10.5);

  // 2. WEST FOREST PERIMETER (Left side of restaurant & parking lot)
  // X ranges from -15 to -52, Z ranges from -30 to 28
  for (let col = 0; col < 6; col++) {
    const baseX = -14.5 - col * 6.0;
    const count = 18;
    for (let r = 0; r < count; r++) {
      const z = -28 + (r / count) * 56 + (pseudoRandom() - 0.5) * 2.8;
      const x = baseX + (pseudoRandom() - 0.5) * 2.6;

      // Avoid clipping the west wall of restaurant or parking spot
      if (x > -11.0 && z > -7.0 && z < 18.0) continue;

      spawnTreeAt(x, z, 1.0 + col * 0.08);
    }
  }
  registerCollision(-52, -14.5, -30, 28);

  // 3. EAST FOREST PERIMETER (Right side of restaurant & drive-thru/road)
  // X ranges from 14.5 to 52, Z ranges from -30 to 28
  for (let col = 0; col < 6; col++) {
    const baseX = 14.5 + col * 6.0;
    const count = 18;
    for (let r = 0; r < count; r++) {
      const z = -28 + (r / count) * 56 + (pseudoRandom() - 0.5) * 2.8;
      const x = baseX + (pseudoRandom() - 0.5) * 2.6;

      // Avoid clipping east wall of restaurant
      if (x < 11.5 && z > -7.0 && z < 10.0) continue;

      spawnTreeAt(x, z, 1.0 + col * 0.08);
    }
  }
  registerCollision(14.5, 52, -30, 28);

  // 4. SOUTH FOREST PERIMETER (Across the two-lane highway: Z: 30 to 58)
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

  // 5. ATMOSPHERIC FOREST MIST / FOG SHEETS
  // Soft low-lying fog layers floating between the trees for extra dread
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
