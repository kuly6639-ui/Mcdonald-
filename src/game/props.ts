import * as THREE from 'three';
import {
  createStainlessSteelTexture,
  createWarningSignTexture,
  createPOSTouchScreenTexture,
  createCustomerPoleDisplayTexture,
  createTimeAttendanceScreenTexture,
  createComputerCCTVScreenTexture,
  createNoodlesWaterSignTexture,
  create67SnackSignTexture,
  createPS1NameTagTexture,
  createPS1CRTGreenTexture,
  createRestroomSignTexture,
  createPS1ClownFaceTexture,
  createPS1WelcomeClownFaceTexture,
  createPS1HumanFaceTexture,
  createPS1EmployeeLogoTexture,
  createPS1StoreClerkCapLogoTexture,
  createPS1HairTexture,
  createCrackedCarWindowTexture,
  createBloodyCarWindowStainTexture,
} from './textures';

/**
 * Extreme Super Low Poly / PS1 Retro 3D Models & Props for McDonald's Nightfall.
 * Strict PS1 Rules:
 * - Heads use 14-segment SphereGeometry (14x10) with procedural 64x64 NearestFilter CanvasTextures
 * - Humanoid torsos & limbs use tapered 6-to-8-sided CylinderGeometry with flatShading: true & roughness: 0.9
 * - Crumpled trash bags use deterministic vertex-hashed IcosahedronGeometry(r, 1) with pinched 6-sided knot
 * - Preserves exact original bounding box scales, ground pivots (y = 0), and userData hooks
 */

function ps1Mat(params: THREE.MeshStandardMaterialParameters): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    ...params,
    flatShading: true,
    roughness: 0.9,
  });
}

/**
 * Vertex-sculpted PS1 Low-Poly Human/Clown Head (12 radial facets x 8 height rings, flatShading: true).
 * NOT a round SphereGeometry and NOT a rectangular sticker patch:
 * - Vertically elongated (~1.25x) with narrow sharp V-chin, tapered jawline, gaunt pinched cheeks,
 *   pushed brow ridge & cheekbones, and recessed eye sockets.
 * - Seamlessly UV-wrapped 360 degrees (seam cleanly at back -Z, u=0.5 dead-center front +Z).
 */
export function buildSculptedPS1HeadGeometry(
  radius: number = 0.14,
  variant: 'clown' | 'human' = 'human'
): THREE.BufferGeometry {
  const segs = 12;
  const rings = 8;
  const isClown = variant === 'clown';

  // Ring profiles from bottom chin point (iy=0) to crown apex (iy=8)
  const ringProfile: [number, number, number, number][] = [
    // [rxFactor, rzFactor, yFactor, zOffsetFactor]
    [0.0, 0.0, -1.25, 0.11],    // 0: pointed chin apex
    [0.34, 0.44, -0.94, 0.09],  // 1: narrow V-chin
    [0.54, 0.66, -0.62, 0.04],  // 2: tapered lower jaw
    [0.70, 0.80, -0.26, 0.01],  // 3: pinched mid-cheeks / mouth
    [0.82, 0.88, 0.08, 0.0],    // 4: cheekbones / nose base
    [0.84, 0.88, 0.36, 0.0],    // 5: recessed orbital eye sockets
    [0.86, 0.92, 0.66, 0.03],   // 6: prominent brow ridge / temples
    [0.68, 0.80, 0.96, -0.04],  // 7: upper cranium
    [0.0, 0.0, 1.22, -0.06],    // 8: crown apex
  ];

  const positions: number[] = [];
  const uvs: number[] = [];
  const indices: number[] = [];

  for (let iy = 0; iy <= rings; iy++) {
    const [rxF, rzF, yF, zOffF] = ringProfile[iy];
    const v = iy / rings;

    for (let ix = 0; ix <= segs; ix++) {
      const u = ix / segs;
      const theta = -Math.PI + u * Math.PI * 2; // 0 is +Z front, +-PI is -Z back
      const sinT = Math.sin(theta);
      const cosT = Math.cos(theta);
      const absSin = Math.abs(sinT);

      let x = Math.sin(theta) * rxF * radius;
      let y = yF * radius;
      let z = (Math.cos(theta) * rzF + zOffF) * radius;

      if (iy > 0 && iy < rings) {
        // 1. Pinch cheeks inward on rings 2 & 3 for gaunt, sunken PS1 cheek hollows
        if ((iy === 2 || iy === 3) && cosT > 0.05 && absSin > 0.36) {
          const pinch = isClown ? 0.14 : 0.09;
          x *= isClown ? 0.80 : 0.86;
          z -= radius * pinch * (1 - 0.25 * absSin);
        }

        // 2. Narrow angular V-jawline planes on ring 1 & 2
        if ((iy === 1 || iy === 2) && cosT > 0.15 && absSin > 0.35) {
          x *= 0.88;
        }

        // 3. Push cheekbones forward slightly on ring 4
        if (iy === 4 && cosT > 0.35 && absSin > 0.35 && absSin < 0.86) {
          z += radius * 0.08;
          x *= 1.04;
        }

        // 4. Center nose bridge forward spine on ring 4 (ix === 6)
        if (iy === 4 && cosT > 0.92) {
          z += radius * 0.045;
        }

        // 5. Recess orbital eye sockets beneath the brow ridge on ring 5 (gentle on humans so eyes never turn black)
        if (iy === 5 && cosT > 0.55 && absSin > 0.22 && absSin < 0.72) {
          z -= radius * (isClown ? 0.13 : 0.025);
        }

        // 6. Push prominent brow ridge forward on ring 6
        if (iy === 6 && cosT > 0.40 && absSin < 0.78) {
          z += radius * (isClown ? 0.14 : 0.055);
        }

        // 7. Slightly flatten back of skull for crisp PS1 silhouette
        if (cosT < -0.25) {
          z *= 0.90;
        }
      }

      positions.push(x, y, z);
      uvs.push(u, v);
    }
  }

  const stride = segs + 1;
  for (let iy = 0; iy < rings; iy++) {
    for (let ix = 0; ix < segs; ix++) {
      const a = iy * stride + ix;
      const b = a + 1;
      const c = (iy + 1) * stride + ix;
      const d = c + 1;

      if (iy > 0) {
        indices.push(a, b, d);
      }
      if (iy < rings - 1) {
        indices.push(a, d, c);
      }
    }
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.setIndex(indices);
  geo.computeVertexNormals();
  return geo;
}

/** Unified flat-shaded PS1 head material (seamless 360-degree texture wrap, no sticker seam) */
export function createPS1HeadMaterial(
  texture: THREE.Texture,
  emissiveIntensity: number = 0.26
): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: texture,
    emissiveMap: texture,
    emissive: 0xffffff,
    emissiveIntensity,
    flatShading: true,
    roughness: 0.9,
  });
}

/** Sharp 4-sided low-poly triangular nose cone protruding from center of sculpted face */
export function createPS1NoseMesh(radius: number, material: THREE.Material): THREE.Mesh {
  const noseGeo = new THREE.ConeGeometry(radius * 0.145, radius * 0.24, 4, 1);
  const nose = new THREE.Mesh(noseGeo, material);
  nose.rotation.x = Math.PI / 2 + 0.12;
  nose.position.set(0, -radius * 0.05, radius * 0.89);
  return nose;
}

/** Watertight PS1 Crumpled Black Garbage Bag (vertex-hashed IcosahedronGeometry + pinched 6-sided knot) */
export function createPS1CrumpledTrashBag(radius: number = 0.35, seed: number = 1): THREE.Group {
  const group = new THREE.Group();
  const bagMat = new THREE.MeshStandardMaterial({
    color: 0x15171a,
    flatShading: true,
    roughness: 0.48,
    metalness: 0.14,
  });

  const geo = new THREE.IcosahedronGeometry(radius, 1);
  const pos = geo.attributes.position;

  const hash3 = (ix: number, iy: number, iz: number, salt: number): number => {
    const h = Math.sin(ix * 12.9898 + iy * 78.233 + iz * 37.719 + salt * 53.17) * 43758.5453;
    return (h - Math.floor(h)) * 2 - 1;
  };

  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);
    const kx = Math.round(x * 1000);
    const ky = Math.round(y * 1000);
    const kz = Math.round(z * 1000);

    const n1 = hash3(kx, ky, kz, seed * 3 + 1);
    const n2 = hash3(kx, ky, kz, seed * 3 + 2);
    const n3 = hash3(kx, ky, kz, seed * 3 + 3);

    // Lower belly bulge + top pinch toward knot
    const nyNorm = y / radius;
    const bellyScale = nyNorm < 0 ? 1.12 : 1.0 - nyNorm * 0.22;

    let nx = x * bellyScale + n1 * radius * 0.13;
    let ny = y * 0.88 + n2 * radius * 0.09;
    let nz = z * bellyScale + n3 * radius * 0.13;

    // Flatten underside so bag sits heavily on floor/ground
    if (ny < -radius * 0.54) {
      ny = -radius * 0.54 + n2 * radius * 0.025;
    }

    pos.setXYZ(i, nx, ny, nz);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();

  const body = new THREE.Mesh(geo, bagMat);
  body.position.y = radius * 0.55;
  body.castShadow = true;
  body.receiveShadow = true;

  // Pinched tie neck & flared plastic bag knot
  const neck = new THREE.Mesh(
    new THREE.CylinderGeometry(radius * 0.13, radius * 0.23, radius * 0.15, 6, 1),
    bagMat
  );
  neck.position.set(0, radius * 1.36, 0);

  const knot = new THREE.Mesh(
    new THREE.ConeGeometry(radius * 0.34, radius * 0.36, 6, 1),
    bagMat
  );
  knot.position.set(radius * 0.02, radius * 1.54, 0);
  knot.rotation.set(0.14, 0.35, -0.1);
  knot.scale.set(1.05, 0.85, 0.9);

  group.add(body, neck, knot);
  return group;
}

function createPS1BurgerMesh(): THREE.Group {
  const burger = new THREE.Group();
  const bunMat = ps1Mat({ color: 0xd48b28 });
  const pattyMat = ps1Mat({ color: 0x451a03 });
  const cheeseMat = ps1Mat({ color: 0xfacc15 });
  const lettuceMat = ps1Mat({ color: 0x4d7c0f });

  // 4 stacked 5-sided flat cylinders + square cheese poking out
  const bottomBun = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.05, 0.018, 5, 1), bunMat);
  bottomBun.position.y = 0.009;
  const patty = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.056, 0.018, 5, 1), pattyMat);
  patty.position.y = 0.026;
  const cheese = new THREE.Mesh(new THREE.BoxGeometry(0.095, 0.006, 0.095), cheeseMat);
  cheese.position.y = 0.036;
  cheese.rotation.y = 0.4;
  const lettuce = new THREE.Mesh(new THREE.CylinderGeometry(0.058, 0.054, 0.012, 5, 1), lettuceMat);
  lettuce.position.y = 0.044;
  const topBun = new THREE.Mesh(new THREE.CylinderGeometry(0.042, 0.056, 0.024, 5, 1), bunMat);
  topBun.position.y = 0.06;

  burger.add(bottomBun, patty, cheese, lettuce, topBun);
  return burger;
}

function createPS1FriesMesh(): THREE.Group {
  const fries = new THREE.Group();
  const redBoxMat = ps1Mat({ color: 0xcc1414 });
  const fryMat = ps1Mat({ color: 0xf5b800 });

  // 4-sided red container
  const carton = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.032, 0.088, 4, 1), redBoxMat);
  carton.rotation.y = Math.PI / 4;
  carton.position.y = 0.044;
  fries.add(carton);

  // Jagged rectangular fry sticks poking out
  const offsets: [number, number, number, number][] = [
    [-0.018, 0.092, -0.006, -0.15],
    [-0.006, 0.102, 0.006, 0.08],
    [0.008, 0.098, -0.004, -0.06],
    [0.019, 0.09, 0.008, 0.18],
    [0.0, 0.095, 0.012, 0.02],
  ];
  offsets.forEach(([fx, fy, fz, rz]) => {
    const stick = new THREE.Mesh(new THREE.BoxGeometry(0.01, 0.055, 0.01), fryMat);
    stick.position.set(fx, fy, fz);
    stick.rotation.z = rz;
    fries.add(stick);
  });
  return fries;
}

function createPS1DrinkCupMesh(cupColor: number = 0xb91c1c, lidColor: number = 0xf4f4f5): THREE.Group {
  const drink = new THREE.Group();
  const cupMat = ps1Mat({ color: cupColor });
  const lidMat = ps1Mat({ color: lidColor });
  const strawMat = ps1Mat({ color: 0xef4444 });

  // 5-sided tapered cylinder + lid + thin box straw
  const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.028, 0.12, 5, 1), cupMat);
  cup.position.y = 0.06;
  const lid = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.043, 0.012, 5, 1), lidMat);
  lid.position.y = 0.124;
  const straw = new THREE.Mesh(new THREE.BoxGeometry(0.008, 0.06, 0.008), strawMat);
  straw.position.set(0.008, 0.15, 0);
  straw.rotation.z = -0.14;

  drink.add(cup, lid, straw);
  return drink;
}

function createPS1DrumstickMesh(
  meatMat: THREE.Material,
  batterMat: THREE.Material,
  boneMat: THREE.Material,
  scaleFactor: number = 1.0
): THREE.Group {
  const drum = new THREE.Group();

  // 5-sided tapered meat club oriented along +X (<= 7 faces)
  const meat = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.038, 0.095, 5, 1), meatMat);
  meat.rotation.z = -Math.PI / 2;
  meat.position.x = 0.004;
  meat.castShadow = true;

  // Crispy low-poly batter chunk (8-face Octahedron)
  const crunch = new THREE.Mesh(new THREE.OctahedronGeometry(0.026, 0), batterMat);
  crunch.position.set(-0.018, 0.006, 0);

  // Exposed white 5-sided bone shaft + angular knuckle block
  const boneShaft = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.009, 0.04, 5, 1), boneMat);
  boneShaft.rotation.z = Math.PI / 2;
  boneShaft.position.x = 0.068;

  const knuckle = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.018, 0.024), boneMat);
  knuckle.position.x = 0.09;

  drum.add(meat, crunch, boneShaft, knuckle);
  drum.scale.setScalar(scaleFactor);
  return drum;
}

/**
 * Model 4: createProtagonistCar() (also exported as createDetailedCar)
 * 90s retro boxy sedan built strictly from BoxGeometry and 5-sided CylinderGeometry wheels.
 */
export function createProtagonistCar(
  bodyColor: number = 0x1f3347,
  withVisibleDriver: boolean = false,
  driverVariant: number = 0,
  withRoomyInterior: boolean = false
): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS1_ProtagonistCar';

  const paintMat = ps1Mat({ color: bodyColor });
  const darkTrimMat = ps1Mat({ color: 0x16181c });
  const hasInterior = withVisibleDriver || withRoomyInterior;
  const glassMat = hasInterior
    ? ps1Mat({
        color: 0x1c3140,
        transparent: true,
        opacity: withRoomyInterior ? 0.24 : 0.3,
        depthWrite: false,
        side: THREE.DoubleSide,
      })
    : ps1Mat({ color: 0x101822 });
  const headlightMat = new THREE.MeshBasicMaterial({ color: 0xfff5cc });
  const taillightMat = new THREE.MeshBasicMaterial({ color: 0xcc1111 });
  const rimMat = ps1Mat({ color: 0x9ca3af });
  const tireMat = ps1Mat({ color: 0x18181b });

  // Sharp boxy lower chassis + hood/trunk profile
  const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.58, 4.2), paintMat);
  lowerBody.position.set(0, 0.5, 0);
  lowerBody.castShadow = true;
  group.add(lowerBody);

  if (hasInterior) {
    const seatMat = ps1Mat({ color: 0x262930 });
    const dashMat = ps1Mat({ color: 0x181b20 });
    const roofY = withRoomyInterior ? 1.62 : 1.49;
    const cabinCenterY = withRoomyInterior ? 1.2 : 1.14;
    const glassHeight = withRoomyInterior ? 0.72 : 0.6;

    const interiorDeck = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.06, 2.25), darkTrimMat);
    interiorDeck.position.set(0, 0.78, -0.18);
    group.add(interiorDeck);

    const dash = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.24, 0.36), dashMat);
    dash.position.set(0, 0.9, 0.68);
    const dashGlow = new THREE.Mesh(
      new THREE.PlaneGeometry(0.26, 0.09),
      new THREE.MeshBasicMaterial({ color: withRoomyInterior ? 0xef4444 : 0x22cc88 })
    );
    dashGlow.position.set(0.34, 0.94, 0.495);
    dashGlow.rotation.y = Math.PI;
    group.add(dash, dashGlow);

    // 5-sided steering column + boxy steering wheel
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.038, 0.3, 5, 1), darkTrimMat);
    column.position.set(0.34, 0.97, 0.48);
    column.rotation.x = Math.PI / 3;
    const steeringWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.035, 5, 1), darkTrimMat);
    steeringWheel.position.set(0.34, 1.04, 0.36);
    steeringWheel.rotation.x = Math.PI / 2 - 0.35;
    group.add(column, steeringWheel);

    // Spacious Front Seats
    [0.34, -0.34].forEach((sx) => {
      const cushion = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.1, 0.44), seatMat);
      cushion.position.set(sx, 0.83, -0.04);
      const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.44, 0.1), seatMat);
      backrest.position.set(sx, 1.04, -0.27);
      backrest.rotation.x = -0.15;
      const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.16, 0.09), seatMat);
      headrest.position.set(sx, 1.32, -0.32);
      group.add(cushion, backrest, headrest);
    });

    // Extra spacious rear passenger bench inside Duck's car
    if (withRoomyInterior) {
      const rearSeat = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.12, 0.46), seatMat);
      rearSeat.position.set(0, 0.84, -0.82);
      const rearBack = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.46, 0.1), seatMat);
      rearBack.position.set(0, 1.08, -1.04);
      const mirror = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.03), darkTrimMat);
      mirror.position.set(0, 1.46, 0.56);
      group.add(rearSeat, rearBack, mirror);
    }

    // Window Pillars (BoxGeometry)
    const pillarH = withRoomyInterior ? 0.84 : 0.7;
    const pillarPositions: [number, number, number, number][] = [
      [0.74, 0.76, -0.3, 0.08],
      [-0.74, 0.76, -0.3, 0.08],
      [0.74, -0.2, 0, 0.09],
      [-0.74, -0.2, 0, 0.09],
      [0.74, -1.12, 0.32, 0.12],
      [-0.74, -1.12, 0.32, 0.12],
    ];
    pillarPositions.forEach(([px, pz, rx, tz]) => {
      const post = new THREE.Mesh(new THREE.BoxGeometry(0.06, pillarH, tz), darkTrimMat);
      post.position.set(px, cabinCenterY, pz);
      post.rotation.x = rx;
      group.add(post);
    });

    const windshield = new THREE.Mesh(new THREE.PlaneGeometry(1.44, glassHeight + 0.06), glassMat);
    windshield.position.set(0, cabinCenterY, 0.76);
    windshield.rotation.x = -0.3;
    const rearWindshield = new THREE.Mesh(new THREE.PlaneGeometry(1.44, glassHeight + 0.06), glassMat);
    rearWindshield.position.set(0, cabinCenterY, -1.12);
    rearWindshield.rotation.x = 0.32;
    rearWindshield.rotation.y = Math.PI;
    const passGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, glassHeight, 1.78), glassMat);
    passGlass.position.set(-0.75, cabinCenterY, -0.18);
    const rearDriverGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, glassHeight, 0.82), glassMat);
    rearDriverGlass.position.set(0.75, cabinCenterY, -0.68);
    group.add(windshield, rearWindshield, passGlass, rearDriverGlass);

    if (withRoomyInterior) {
      // Closed transparent driver-side front window + hidden crack texture overlay for Night 3 clown head-bang
      const driverFrontGlass = new THREE.Mesh(new THREE.BoxGeometry(0.03, glassHeight, 0.88), glassMat);
      driverFrontGlass.position.set(0.75, cabinCenterY, 0.24);
      group.add(driverFrontGlass);

      const crackMat = new THREE.MeshBasicMaterial({
        map: createCrackedCarWindowTexture(),
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const crackMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.84, glassHeight - 0.04), crackMat);
      crackMesh.position.set(0.73, cabinCenterY, 0.24);
      crackMesh.rotation.y = Math.PI / 2;
      crackMesh.renderOrder = 2;
      crackMesh.visible = false;
      group.add(crackMesh);
      group.userData.driverWindowCrack = crackMesh;

      const bloodStainMat = new THREE.MeshBasicMaterial({
        map: createBloodyCarWindowStainTexture(),
        transparent: true,
        opacity: 0.94,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const bloodMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.84, glassHeight - 0.04), bloodStainMat);
      bloodMesh.position.set(0.732, cabinCenterY, 0.24);
      bloodMesh.rotation.y = Math.PI / 2;
      bloodMesh.renderOrder = 3;
      bloodMesh.visible = false;
      group.add(bloodMesh);
      group.userData.driverWindowBlood = bloodMesh;

      // Exterior driver-window illumination toggled during Night 3 clown window attack
      const doorAttackLight = new THREE.PointLight(0xffeed0, 0.0, 4.8);
      doorAttackLight.position.set(1.35, 1.55, 0.24);
      group.add(doorAttackLight);
      group.userData.doorAttackLight = doorAttackLight;
    }

    if (withVisibleDriver) {
      // PS1 Low-Poly Seated Drive-Thru Driver
      const variantPalettes = [
        { jacket: 0x263f5e, skin: 0xe3b691, hair: 0x2b190e, hat: 0x1a2c44 as number | null },
        { jacket: 0x6b2135, skin: 0xefd0b8, hair: 0x191412, hat: null as number | null },
        { jacket: 0x7c3322, skin: 0xd8a884, hair: 0x241a14, hat: 0x3f4f2f as number | null },
      ];
      const pal = variantPalettes[driverVariant % variantPalettes.length];

      const driverGroup = new THREE.Group();
      driverGroup.position.set(0.34, 0.78, -0.02);

      const coatMat = ps1Mat({ color: pal.jacket });
      const skinMat = ps1Mat({ color: pal.skin });
      const driverHeadMat = createPS1HeadMaterial(createPS1HumanFaceTexture(pal.skin, 'tired'));
      const hairMat = ps1Mat({ color: pal.hair });

      const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.16, 0.38, 8, 1), coatMat);
      torso.scale.set(1.02, 1.0, 0.72);
      torso.position.set(0, 0.22, -0.04);
      torso.rotation.x = -0.1;
      driverGroup.add(torso);

      [-1, 1].forEach((sideX) => {
        const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.34, 6, 1), coatMat);
        arm.rotation.x = Math.PI / 2;
        arm.position.set(sideX * 0.17, 0.29, 0.14);
        driverGroup.add(arm);
      });

      const headGroup = new THREE.Group();
      headGroup.position.set(0, 0.44, 0.0);

      const cranium = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.136, 'human'), driverHeadMat);
      cranium.position.set(0, 0.12, 0);
      const driverNose = createPS1NoseMesh(0.136, skinMat);
      driverNose.position.y += 0.12;
      const hairTop = new THREE.Mesh(new THREE.CylinderGeometry(0.105, 0.12, 0.07, 6, 1), hairMat);
      hairTop.scale.set(1.0, 1.0, 0.95);
      hairTop.position.set(0, 0.24, -0.015);
      headGroup.add(cranium, driverNose, hairTop);

      if (pal.hat !== null) {
        const capMat = ps1Mat({ color: pal.hat });
        const capDome = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.07, 0.22), capMat);
        capDome.position.set(0, 0.255, 0);
        const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.02, 0.12), capMat);
        capBrim.position.set(0, 0.215, 0.125);
        headGroup.add(capDome, capBrim);
      }

      driverGroup.add(headGroup);
      group.userData.driverHead = headGroup;
      group.add(driverGroup);
    }

    const cabinLight = new THREE.PointLight(0xffdca8, withRoomyInterior ? 0.38 : 0.55, 2.8);
    cabinLight.position.set(0.12, roofY - 0.1, 0.05);
    group.add(cabinLight);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.06, 1.82), paintMat);
    roof.position.set(0, roofY, -0.18);
    group.add(roof);
  } else {
    // Retro boxy cabin with tinted dark windshield & windows
    const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.62, 2.15), glassMat);
    cabin.position.set(0, 1.09, -0.2);
    cabin.castShadow = true;
    group.add(cabin);

    const roof = new THREE.Mesh(new THREE.BoxGeometry(1.48, 0.08, 1.85), paintMat);
    roof.position.set(0, 1.43, -0.2);
    group.add(roof);
  }

  // Sharp boxy bumpers
  const frontBumper = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.22, 0.18), darkTrimMat);
  frontBumper.position.set(0, 0.34, 2.12);
  const rearBumper = new THREE.Mesh(new THREE.BoxGeometry(1.84, 0.22, 0.18), darkTrimMat);
  rearBumper.position.set(0, 0.34, -2.12);
  group.add(frontBumper, rearBumper);

  // Glowing yellowish-white headlights (low-poly planes/boxes) & red taillights
  const headL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.05), headlightMat);
  headL.position.set(-0.64, 0.58, 2.12);
  const headR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.05), headlightMat);
  headR.position.set(0.64, 0.58, 2.12);

  const tailL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.05), taillightMat);
  tailL.position.set(-0.64, 0.58, -2.12);
  const tailR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.14, 0.05), taillightMat);
  tailR.position.set(0.64, 0.58, -2.12);
  group.add(headL, headR, tailL, tailR);

  // 5-sided CylinderGeometry wheels (strictly <= 7 faces)
  const wheelPositions: [number, number, number][] = [
    [-0.95, 0.32, 1.3],
    [0.95, 0.32, 1.3],
    [-0.95, 0.32, -1.3],
    [0.95, 0.32, -1.3],
  ];
  const tireGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.22, 5, 1);
  const rimGeo = new THREE.CylinderGeometry(0.17, 0.17, 0.24, 5, 1);

  wheelPositions.forEach(([wx, wy, wz]) => {
    const tire = new THREE.Mesh(tireGeo, tireMat);
    tire.rotation.z = Math.PI / 2;
    tire.position.set(wx, wy, wz);
    tire.castShadow = true;

    const rim = new THREE.Mesh(rimGeo, rimMat);
    rim.rotation.z = Math.PI / 2;
    rim.position.set(wx, wy, wz);

    group.add(tire, rim);
  });

  return group;
}

/** Drop-in alias preserving all existing GameEngine / world / store67 imports */
export const createDetailedCar = createProtagonistCar;

/**
 * Shared PS1 Seamless Shoulder-to-Arm Builder:
 * Creates angular faceted low-poly shoulder blocks directly on torsoGroup that merge
 * seamlessly into 6-sided deltoid shoulder joint caps at the top of armL & armR,
 * eliminating floating limb gaps even while hunched or walking.
 */
function attachPS1ShoulderBlocksAndArms(
  torsoGroup: THREE.Group,
  options: {
    upperArmMat: THREE.Material;
    forearmMat: THREE.Material;
    shoulderMat?: THREE.Material;
    skinMat: THREE.Material;
    torsoHunchX?: number;
    upperArmLength?: number;
    forearmLength?: number;
    shoulderWidthX?: number;
    shoulderHeightY?: number;
  }
): { armL: THREE.Group; armR: THREE.Group } {
  const {
    upperArmMat,
    forearmMat,
    shoulderMat = upperArmMat,
    skinMat,
    torsoHunchX = 0.08,
    upperArmLength = 0.25,
    forearmLength = 0.25,
    shoulderWidthX = 0.255,
    shoulderHeightY = 0.465,
  } = options;

  // Tapered angular deltoid bridge on torsoGroup extending seamlessly into shoulder sockets
  const shoulderBridge = new THREE.Mesh(
    new THREE.CylinderGeometry(0.255, 0.228, 0.115, 8, 1),
    shoulderMat
  );
  shoulderBridge.scale.set(1.12, 1.0, 0.74);
  shoulderBridge.position.set(0, shoulderHeightY + 0.035, 0);
  torsoGroup.add(shoulderBridge);

  const buildSide = (side: -1 | 1): THREE.Group => {
    // Angular faceted shoulder block welded directly onto torso shoulder corner
    const shoulderBlock = new THREE.Mesh(
      new THREE.BoxGeometry(0.135, 0.125, 0.155),
      shoulderMat
    );
    shoulderBlock.position.set(side * (shoulderWidthX - 0.042), shoulderHeightY + 0.02, 0);
    shoulderBlock.rotation.z = side * -0.26;
    shoulderBlock.castShadow = true;
    torsoGroup.add(shoulderBlock);

    // Arm pivot seated directly inside shoulder block so zero gap appears during animation
    const arm = new THREE.Group();
    arm.position.set(side * shoulderWidthX, shoulderHeightY, 0);
    arm.rotation.set(-torsoHunchX * 0.6, 0, side * -0.055);

    // Faceted 6-sided deltoid joint cap interlocking with shoulderBlock
    const jointCap = new THREE.Mesh(
      new THREE.CylinderGeometry(0.078, 0.068, 0.13, 6, 1),
      upperArmMat
    );
    jointCap.position.set(side * -0.012, -0.022, 0);

    const upperArm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.067, 0.055, upperArmLength, 6, 1),
      upperArmMat
    );
    upperArm.position.set(0, -upperArmLength * 0.5 - 0.02, 0);
    upperArm.castShadow = true;

    const forearm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.055, 0.042, forearmLength, 6, 1),
      forearmMat
    );
    forearm.position.set(0, -upperArmLength - forearmLength * 0.5 - 0.015, 0.01);

    const hand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.032, 0.09, 6, 1),
      skinMat
    );
    hand.scale.set(1.0, 1.0, 0.78);
    hand.position.set(0, -upperArmLength - forearmLength - 0.055, 0.016);

    arm.add(jointCap, upperArm, forearm, hand);
    torsoGroup.add(arm);
    return arm;
  };

  return {
    armL: buildSide(-1),
    armR: buildSide(1),
  };
}

/**
 * Shared PS1 Split Torso, Narrow Tapered Waist & Flared Pelvis/Hip Block Builder:
 * Splits the body vertically into:
 * 1) Low-poly flared 8-sided pelvis/hip block + hip sockets where the legs attach
 * 2) Narrower tapered 6-sided waist section + waistband seam
 * 3) Broader faceted 8-sided upper chest/shoulder block (with optional waist hunch pitch)
 */
function createPS1SplitTorsoAndPelvis(
  root: THREE.Group,
  options: {
    chestMat: THREE.Material;
    waistMat?: THREE.Material;
    pelvisMat: THREE.Material;
    beltMat?: THREE.Material;
    waistLeanX?: number;
    upperHunchX?: number;
    waistScaleX?: number;
    chestWidthScaleX?: number;
    hipSocketOffsetX?: number;
  }
): {
  pelvisGroup: THREE.Group;
  torsoGroup: THREE.Group;
  upperChestGroup: THREE.Group;
  headMountY: number;
  headMountZ: number;
} {
  const {
    chestMat,
    waistMat = chestMat,
    pelvisMat,
    beltMat = pelvisMat,
    waistLeanX = 0.06,
    upperHunchX = 0.06,
    waistScaleX = 1.0,
    chestWidthScaleX = 1.06,
    hipSocketOffsetX = 0.11,
  } = options;

  // 1. Flared 8-sided Pelvis / Hip Block + Leg Hip Sockets
  const pelvisGroup = new THREE.Group();
  pelvisGroup.position.set(0, 0.86, 0);
  const pelvisBlock = new THREE.Mesh(
    new THREE.CylinderGeometry(0.156, 0.194, 0.175, 8, 1),
    pelvisMat
  );
  pelvisBlock.scale.set(1.1, 1.0, 0.76);
  const hipCapL = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.088, 0.085, 6, 1),
    pelvisMat
  );
  hipCapL.position.set(-hipSocketOffsetX, -0.025, 0);
  const hipCapR = new THREE.Mesh(
    new THREE.CylinderGeometry(0.088, 0.088, 0.085, 6, 1),
    pelvisMat
  );
  hipCapR.position.set(hipSocketOffsetX, -0.025, 0);
  pelvisGroup.add(pelvisBlock, hipCapL, hipCapR);
  root.add(pelvisGroup);

  // 2. Narrower Tapered 6-sided Waist Section + Waistband Seam
  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.95, 0);
  torsoGroup.rotation.x = waistLeanX;
  root.add(torsoGroup);

  const beltSeam = new THREE.Mesh(
    new THREE.CylinderGeometry(0.138, 0.152, 0.044, 8, 1),
    beltMat
  );
  beltSeam.scale.set(1.06, 1.0, 0.72);
  beltSeam.position.set(0, 0.012, 0);

  const waistMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.166, 0.13, 0.25, 6, 1),
    waistMat
  );
  waistMesh.scale.set(waistScaleX, 1.0, 0.68);
  waistMesh.position.set(0, 0.125, 0);
  waistMesh.castShadow = true;
  torsoGroup.add(beltSeam, waistMesh);

  // 3. Broader Upper Chest & Shoulders Subgroup pivoted cleanly at the waist break (y = 0.23)
  const upperChestGroup = new THREE.Group();
  upperChestGroup.position.set(0, 0.23, 0);
  upperChestGroup.rotation.x = upperHunchX;
  torsoGroup.add(upperChestGroup);

  const chestMesh = new THREE.Mesh(
    new THREE.CylinderGeometry(0.242, 0.164, 0.34, 8, 1),
    chestMat
  );
  chestMesh.scale.set(chestWidthScaleX, 1.0, 0.72);
  chestMesh.position.set(0, 0.17, 0);
  chestMesh.castShadow = true;
  upperChestGroup.add(chestMesh);

  // Compute exact world-space top of the upper chest for flush neck/head connection
  const headMountY =
    0.95 + 0.23 * Math.cos(waistLeanX) + 0.34 * Math.cos(waistLeanX + upperHunchX);
  const headMountZ =
    0.23 * Math.sin(waistLeanX) + 0.34 * Math.sin(waistLeanX + upperHunchX);

  return {
    pelvisGroup,
    torsoGroup,
    upperChestGroup,
    headMountY,
    headMountZ,
  };
}

const CUSTOMER_FACE_VARIANTS = ['cust_bags', 'tired'] as const;

/**
 * Shared Fitted PS1 Low-Poly Peaked Cap Builder:
 * - Faceted 8-sided CylinderGeometry crown sitting snugly on top of the sculpted head (y = 0.19..0.29)
 * - Sharp flat rectangular BoxGeometry visor angled forward cleanly over the brow
 * - Optional tiny flush pixel logo patch centered on the front sloped crown facet
 */
function attachPS1FittedPeakedCap(
  headGroup: THREE.Group,
  capMat: THREE.Material,
  options: {
    logoMat?: THREE.Material;
    headZOffset?: number;
    visorLength?: number;
    backwards?: boolean;
  } = {}
) {
  const { logoMat, headZOffset = 0, visorLength = 0.132, backwards = false } = options;

  // 8-sided faceted crown rotated Math.PI / 8 so a flat facet faces directly forward (+Z)
  const capCrown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.108, 0.136, 0.098, 8, 1),
    capMat
  );
  capCrown.rotation.y = Math.PI / 8;
  capCrown.scale.set(1.0, 1.0, 1.12);
  capCrown.position.set(0, 0.242, headZOffset + 0.004);

  const crownButton = new THREE.Mesh(
    new THREE.CylinderGeometry(0.014, 0.016, 0.01, 6, 1),
    capMat
  );
  crownButton.position.set(0, 0.294, headZOffset + 0.004);

  const dir = backwards ? -1 : 1;
  const capVisor = new THREE.Mesh(
    new THREE.BoxGeometry(0.202, 0.018, visorLength),
    capMat
  );
  capVisor.position.set(0, 0.198, headZOffset + dir * 0.142);
  capVisor.rotation.x = dir * 0.16;

  headGroup.add(capCrown, crownButton, capVisor);

  if (logoMat) {
    // Lies flush along the front sloped facet of the 8-sided crown
    const capLogo = new THREE.Mesh(
      new THREE.BoxGeometry(0.068, 0.05, 0.012),
      logoMat
    );
    capLogo.position.set(0, 0.244, headZOffset + 0.134);
    capLogo.rotation.x = -0.25;
    headGroup.add(capLogo);
  }
}

/**
 * Custom Hollow Open-Front Faceted PS1 Hood Geometry (6 angular arch segments, flatShading: true):
 * - Truly hollow in the front (open +-58 deg arch) so the sculpted head & face sit cleanly inside
 * - Double-walled (outer shell + shadowed inner lining + front opening bevel + closed top crown)
 * - Lower base plugs directly down into the hoodie collar cowl on upperChestGroup
 */
function buildHollowPS1HoodGeometry(headZOffset: number = 0.032): THREE.BufferGeometry {
  const angles = [
    0.32 * Math.PI,
    0.55 * Math.PI,
    0.78 * Math.PI,
    1.0 * Math.PI,
    1.22 * Math.PI,
    1.45 * Math.PI,
    1.68 * Math.PI,
  ];
  const wall = 0.022;
  const rings: { y: number; rx: number; rz: number; zOff: number }[] = [
    { y: -0.045, rx: 0.166, rz: 0.156, zOff: -0.015 },
    { y: 0.08, rx: 0.172, rz: 0.168, zOff: 0.0 },
    { y: 0.215, rx: 0.176, rz: 0.178, zOff: 0.012 },
    { y: 0.292, rx: 0.142, rz: 0.170, zOff: 0.016 },
  ];

  const outer: THREE.Vector3[][] = [];
  const inner: THREE.Vector3[][] = [];

  for (let iy = 0; iy < rings.length; iy++) {
    const r = rings[iy];
    const outRow: THREE.Vector3[] = [];
    const inRow: THREE.Vector3[] = [];
    const inY = iy === rings.length - 1 ? r.y - 0.02 : r.y;

    for (let ix = 0; ix < angles.length; ix++) {
      const a = angles[ix];
      const sa = Math.sin(a);
      const ca = Math.cos(a);
      outRow.push(
        new THREE.Vector3(sa * r.rx, r.y, headZOffset + r.zOff + ca * r.rz)
      );
      inRow.push(
        new THREE.Vector3(
          sa * Math.max(0.08, r.rx - wall),
          inY,
          headZOffset + r.zOff + ca * Math.max(0.08, r.rz - wall)
        )
      );
    }
    outer.push(outRow);
    inner.push(inRow);
  }

  const topIdx = rings.length - 1;
  const outSpineF = new THREE.Vector3(
    0,
    0.30,
    headZOffset + rings[topIdx].zOff + Math.cos(angles[0]) * rings[topIdx].rz
  );
  const outSpineB = new THREE.Vector3(0, 0.312, headZOffset - 0.055);
  const inSpineF = new THREE.Vector3(
    0,
    0.278,
    headZOffset + rings[topIdx].zOff + Math.cos(angles[0]) * (rings[topIdx].rz - wall)
  );
  const inSpineB = new THREE.Vector3(0, 0.288, headZOffset - 0.052);

  const positions: number[] = [];
  const uvs: number[] = [];
  const edgeA = new THREE.Vector3();
  const edgeB = new THREE.Vector3();
  const triNormal = new THREE.Vector3();

  const pushTri = (
    p1: THREE.Vector3,
    p2: THREE.Vector3,
    p3: THREE.Vector3,
    refDir: THREE.Vector3
  ) => {
    edgeA.subVectors(p2, p1);
    edgeB.subVectors(p3, p1);
    triNormal.crossVectors(edgeA, edgeB);
    const flip = triNormal.dot(refDir) < 0;
    const verts = flip ? [p1, p3, p2] : [p1, p2, p3];
    for (const v of verts) {
      positions.push(v.x, v.y, v.z);
      uvs.push(v.x * 2 + 0.5, v.y * 2 + 0.2);
    }
  };

  const pushQuad = (
    p00: THREE.Vector3,
    p10: THREE.Vector3,
    p11: THREE.Vector3,
    p01: THREE.Vector3,
    refDir: THREE.Vector3
  ) => {
    pushTri(p00, p10, p11, refDir);
    pushTri(p00, p11, p01, refDir);
  };

  const up = new THREE.Vector3(0, 1, 0);
  const down = new THREE.Vector3(0, -1, 0);
  const frontOut = new THREE.Vector3(0, 0, 1);

  // 1. Outer & Inner U-arch walls across height rings
  for (let iy = 0; iy < topIdx; iy++) {
    for (let ix = 0; ix < angles.length - 1; ix++) {
      const aMid = 0.5 * (angles[ix] + angles[ix + 1]);
      const outDir = new THREE.Vector3(Math.sin(aMid), 0, Math.cos(aMid));
      const inDir = outDir.clone().negate();

      pushQuad(
        outer[iy][ix],
        outer[iy][ix + 1],
        outer[iy + 1][ix + 1],
        outer[iy + 1][ix],
        outDir
      );
      pushQuad(
        inner[iy][ix],
        inner[iy][ix + 1],
        inner[iy + 1][ix + 1],
        inner[iy + 1][ix],
        inDir
      );
    }

    // Front opening thickness rims (left & right cheek borders)
    pushQuad(
      outer[iy][0],
      inner[iy][0],
      inner[iy + 1][0],
      outer[iy + 1][0],
      frontOut
    );
    const last = angles.length - 1;
    pushQuad(
      outer[iy][last],
      inner[iy][last],
      inner[iy + 1][last],
      outer[iy + 1][last],
      frontOut
    );
  }

  // 2. Closed Top Crown Roof (outer top facing +Y, inner ceiling facing -Y)
  for (let ix = 0; ix < angles.length - 1; ix++) {
    const outAnchor = ix === 0 || ix === angles.length - 2 ? outSpineF : outSpineB;
    const inAnchor = ix === 0 || ix === angles.length - 2 ? inSpineF : inSpineB;
    pushTri(outer[topIdx][ix], outer[topIdx][ix + 1], outAnchor, up);
    pushTri(inner[topIdx][ix], inner[topIdx][ix + 1], inAnchor, down);
  }
  // Connect top bridge fans (front edge ix=1 & ix=angles.length-2 meet outSpineF -> outSpineB)
  pushTri(outer[topIdx][1], outSpineB, outSpineF, up);
  pushTri(outer[topIdx][angles.length - 2], outSpineF, outSpineB, up);
  pushTri(inner[topIdx][1], inSpineB, inSpineF, down);
  pushTri(inner[topIdx][angles.length - 2], inSpineF, inSpineB, down);

  // 3. Top Front Brow Lip Rim (connecting outer brow edge to inner brow edge facing +Z)
  pushQuad(outer[topIdx][0], outSpineF, inSpineF, inner[topIdx][0], frontOut);
  pushQuad(
    outSpineF,
    outer[topIdx][angles.length - 1],
    inner[topIdx][angles.length - 1],
    inSpineF,
    frontOut
  );

  // 4. Bottom Collar Rim (connecting base ring outer -> inner facing -Y)
  for (let ix = 0; ix < angles.length - 1; ix++) {
    pushQuad(outer[0][ix], outer[0][ix + 1], inner[0][ix + 1], inner[0][ix], down);
  }

  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geo.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geo.computeVertexNormals();
  return geo;
}

/**
 * Low-Poly PS1 Hair Helpers (5-8 segments, flatShading: true, 32x32 NearestFilter hair texture).
 * Zero clipping through forehead or eyes.
 */
function createPS1HairMaterial(hairColor: number): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map: createPS1HairTexture(hairColor),
    flatShading: true,
    roughness: 0.9,
  });
}

function attachPS1NeatHairUnderCap(
  headGroup: THREE.Group,
  hairColor: number,
  options: { withFrontPart?: boolean; headZOffset?: number } = {}
) {
  const { withFrontPart = true, headZOffset = 0 } = options;
  const hairMat = createPS1HairMaterial(hairColor);

  // Snug 6-sided nape/back hair tucked cleanly beneath cap rim (y <= 0.194)
  const hairBack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.118, 0.094, 0.125, 6, 1),
    hairMat
  );
  hairBack.scale.set(1.02, 1.0, 0.54);
  hairBack.position.set(0, 0.132, headZOffset - 0.082);

  // Angular temple/sideburn wedges hugging temples under cap rim
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.082, 0.095), hairMat);
  sideL.position.set(-0.112, 0.15, headZOffset - 0.022);
  sideL.rotation.set(0.08, 0, -0.06);

  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.082, 0.095), hairMat);
  sideR.position.set(0.112, 0.15, headZOffset - 0.022);
  sideR.rotation.set(0.08, 0, 0.06);

  headGroup.add(hairBack, sideL, sideR);

  if (withFrontPart) {
    // Neat parted low-poly fringe peeking right beneath cap visor & above eyebrows
    const partL = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.024, 0.044), hairMat);
    partL.position.set(-0.048, 0.194, headZOffset + 0.128);
    partL.rotation.set(0.18, -0.2, 0.24);

    const partR = new THREE.Mesh(new THREE.BoxGeometry(0.068, 0.024, 0.044), hairMat);
    partR.position.set(0.048, 0.194, headZOffset + 0.128);
    partR.rotation.set(0.18, 0.2, -0.24);

    headGroup.add(partL, partR);
  }
}

function attachPS1SpikyHair(
  headGroup: THREE.Group,
  hairColor: number,
  options: { headZOffset?: number; bangsOnly?: boolean } = {}
) {
  const { headZOffset = 0, bangsOnly = false } = options;
  const hairMat = createPS1HairMaterial(hairColor);

  if (!bangsOnly) {
    // Snug 6-sided faceted hair skull cap (sits slightly above sculpted forehead & crown)
    const hairCrown = new THREE.Mesh(
      new THREE.CylinderGeometry(0.104, 0.13, 0.092, 6, 1),
      hairMat
    );
    hairCrown.rotation.y = Math.PI / 6;
    hairCrown.scale.set(1.02, 1.0, 1.06);
    hairCrown.position.set(0, 0.246, headZOffset - 0.008);

    const hairBack = new THREE.Mesh(
      new THREE.CylinderGeometry(0.124, 0.098, 0.145, 6, 1),
      hairMat
    );
    hairBack.scale.set(1.02, 1.0, 0.56);
    hairBack.position.set(0, 0.138, headZOffset - 0.08);

    const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.096, 0.1), hairMat);
    sideL.position.set(-0.118, 0.158, headZOffset - 0.018);
    sideL.rotation.set(0.06, 0, -0.06);

    const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.096, 0.1), hairMat);
    sideR.position.set(0.118, 0.158, headZOffset - 0.018);
    sideR.rotation.set(0.06, 0, 0.06);

    headGroup.add(hairCrown, hairBack, sideL, sideR);

    // Messy spiky low-poly crown & rear clusters (5-sided cones anchored cleanly inside cap)
    const crownSpikes: [number, number, number, number, number, number, number, number][] = [
      // [x, y, z, rx, ry, rz, radius, height]
      [0, 0.31, headZOffset + 0.02, 0.35, 0.2, 0.08, 0.052, 0.105],
      [-0.062, 0.296, headZOffset + 0.01, 0.22, 0.0, 0.58, 0.048, 0.095],
      [0.062, 0.296, headZOffset + 0.01, 0.22, 0.0, -0.58, 0.048, 0.095],
      [-0.045, 0.292, headZOffset - 0.06, -0.52, 0.0, 0.38, 0.05, 0.1],
      [0.045, 0.292, headZOffset - 0.06, -0.52, 0.0, -0.38, 0.05, 0.1],
      [0, 0.265, headZOffset - 0.105, -0.98, 0.0, 0.0, 0.052, 0.1],
      [-0.092, 0.225, headZOffset - 0.06, -0.45, 0.0, 0.95, 0.042, 0.082],
      [0.092, 0.225, headZOffset - 0.06, -0.45, 0.0, -0.95, 0.042, 0.082],
    ];
    for (const [sx, sy, sz, rx, ry, rz, rad, h] of crownSpikes) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(rad, h, 5, 1), hairMat);
      spike.position.set(sx, sy, sz);
      spike.rotation.set(rx, ry, rz);
      headGroup.add(spike);
    }
  }

  // Forward-swept spiky low-poly bangs clearing forehead & eyebrows (y >= 0.214, z forward)
  const frontSpikes: [number, number, number, number, number, number, number, number][] = [
    [0, 0.236, headZOffset + 0.125, 1.88, 0.0, 0.08, 0.032, 0.078],
    [-0.056, 0.232, headZOffset + 0.118, 1.78, 0.18, 0.42, 0.03, 0.072],
    [0.056, 0.232, headZOffset + 0.118, 1.78, -0.18, -0.42, 0.03, 0.072],
  ];
  for (const [fx, fy, fz, rx, ry, rz, rad, h] of frontSpikes) {
    const bang = new THREE.Mesh(new THREE.ConeGeometry(rad, h, 5, 1), hairMat);
    bang.position.set(fx, fy, fz);
    bang.rotation.set(rx, ry, rz);
    headGroup.add(bang);
  }
}

function attachPS1StyledShortHair(
  headGroup: THREE.Group,
  hairColor: number,
  headZOffset: number = 0
) {
  const hairMat = createPS1HairMaterial(hairColor);

  const hairCrown = new THREE.Mesh(
    new THREE.CylinderGeometry(0.104, 0.128, 0.088, 6, 1),
    hairMat
  );
  hairCrown.rotation.y = Math.PI / 6;
  hairCrown.scale.set(1.01, 1.0, 1.04);
  hairCrown.position.set(0, 0.244, headZOffset - 0.01);

  const hairBack = new THREE.Mesh(
    new THREE.CylinderGeometry(0.122, 0.096, 0.145, 6, 1),
    hairMat
  );
  hairBack.scale.set(1.01, 1.0, 0.54);
  hairBack.position.set(0, 0.135, headZOffset - 0.08);

  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.09, 0.09), hairMat);
  sideL.position.set(-0.116, 0.155, headZOffset - 0.02);
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.032, 0.09, 0.09), hairMat);
  sideR.position.set(0.116, 0.155, headZOffset - 0.02);

  // Clean faceted front hairline wedge above brow ridge
  const frontFringe = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.026, 0.045), hairMat);
  frontFringe.position.set(0, 0.222, headZOffset + 0.112);
  frontFringe.rotation.x = 0.22;

  headGroup.add(hairCrown, hairBack, sideL, sideR, frontFringe);
}

/**
 * Shared PS1 Hoodie Collar (Hood Down), Zipper & Backpack Builder:
 * Adds a folded, faceted low-poly hood collar resting behind the neck & upper back
 * for hoodie characters wearing their hood down.
 */
function attachPS1FoldedHoodDownCollar(
  torsoGroup: THREE.Group,
  upperChestGroup: THREE.Group,
  hoodieMat: THREE.Material,
  darkTrimMat: THREE.Material,
  accentMat: THREE.Material,
  options: {
    withBackpack?: boolean;
    backpackColor?: number;
    withZipper?: boolean;
  } = {}
) {
  const { withBackpack = false, backpackColor = 0x2c333f, withZipper = true } = options;

  // 1. Snug 6-sided collar roll around neck opening
  const collarRing = new THREE.Mesh(
    new THREE.CylinderGeometry(0.132, 0.168, 0.075, 6, 1),
    hoodieMat
  );
  collarRing.rotation.y = Math.PI / 6;
  collarRing.scale.set(1.05, 1.0, 0.92);
  collarRing.position.set(0, 0.33, -0.008);
  collarRing.rotation.x = -0.2;

  // 2. Folded faceted back hood bunch resting cleanly behind neck & upper shoulders
  const foldedBunch = new THREE.Mesh(
    new THREE.BoxGeometry(0.248, 0.084, 0.115),
    hoodieMat
  );
  foldedBunch.position.set(0, 0.305, -0.112);
  foldedBunch.rotation.x = 0.42;

  // 3. Flattened 5-sided draped hood tip resting down the upper back
  const foldedTip = new THREE.Mesh(
    new THREE.ConeGeometry(0.138, 0.155, 5, 1),
    hoodieMat
  );
  foldedTip.scale.set(1.05, 1.0, 0.45);
  foldedTip.position.set(0, 0.228, -0.152);
  foldedTip.rotation.set(-2.68, 0, 0);

  // Drawstrings
  const stringL = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.135, 0.014), darkTrimMat);
  stringL.position.set(-0.044, 0.215, 0.162);
  stringL.rotation.z = 0.05;
  const stringR = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.135, 0.014), darkTrimMat);
  stringR.position.set(0.044, 0.215, 0.162);
  stringR.rotation.z = -0.05;

  upperChestGroup.add(collarRing, foldedBunch, foldedTip, stringL, stringR);

  if (withZipper) {
    const chestZipper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.022), darkTrimMat);
    chestZipper.position.set(0, 0.15, 0.158);
    const zipperSlider = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.034, 0.026), accentMat);
    zipperSlider.position.set(0, 0.24, 0.166);
    const waistZipper = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.2, 0.022), darkTrimMat);
    waistZipper.position.set(0, 0.13, 0.118);
    upperChestGroup.add(chestZipper, zipperSlider);
    torsoGroup.add(waistZipper);
  }

  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.125, 0.046), hoodieMat);
  pouch.position.set(0, 0.145, 0.112);
  torsoGroup.add(pouch);

  if (withBackpack) {
    const packMat = ps1Mat({ color: backpackColor });
    const packMain = new THREE.Mesh(new THREE.BoxGeometry(0.275, 0.32, 0.14), packMat);
    packMain.position.set(0, 0.07, -0.195);
    packMain.castShadow = true;

    const packLid = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.08, 0.155), packMat);
    packLid.position.set(0, 0.225, -0.192);
    packLid.rotation.x = 0.16;

    const packPocket = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.14, 0.052), darkTrimMat);
    packPocket.position.set(0, -0.02, -0.272);

    const packBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.036, 0.025), accentMat);
    packBuckle.position.set(0, 0.18, -0.27);

    const strapFrontL = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.28, 0.028), darkTrimMat);
    strapFrontL.position.set(-0.12, 0.165, 0.148);
    const strapFrontR = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.28, 0.028), darkTrimMat);
    strapFrontR.position.set(0.12, 0.165, 0.148);
    const strapTopL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.032, 0.25), darkTrimMat);
    strapTopL.position.set(-0.12, 0.32, -0.015);
    const strapTopR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.032, 0.25), darkTrimMat);
    strapTopR.position.set(0.12, 0.32, -0.015);

    upperChestGroup.add(
      packMain,
      packLid,
      packPocket,
      packBuckle,
      strapFrontL,
      strapFrontR,
      strapTopL,
      strapTopR
    );
  }
}

/**
 * Shared PS1 Hollow Open-Front Faceted Hood & Customer Accessories Builder:
 * - Hollow custom 6-segment open-front hood wrapping cleanly around the back, top, and sides
 *   and connecting directly down into the collar cowl without clipping hair or face
 * - Sharp box-geometry jacket zipper line & drawstrings
 * - Optional blocky low-poly backpack with top flap & shoulder straps
 */
function attachPS1DrapedHoodAndAccessories(
  torsoGroup: THREE.Group,
  upperChestGroup: THREE.Group,
  headGroup: THREE.Group,
  hoodieMat: THREE.Material,
  darkTrimMat: THREE.Material,
  accentMat: THREE.Material,
  options: {
    withBackpack?: boolean;
    backpackColor?: number;
    withZipper?: boolean;
    headZOffset?: number;
  } = {}
) {
  const {
    withBackpack = true,
    backpackColor = 0x2c333f,
    withZipper = true,
    headZOffset = 0.032,
  } = options;

  // 1. Upper-Chest Seamless Collar Cowl & Draped Rear Transition Fold
  const hoodCowl = new THREE.Mesh(
    new THREE.CylinderGeometry(0.166, 0.225, 0.11, 6, 1),
    hoodieMat
  );
  hoodCowl.rotation.y = Math.PI / 6;
  hoodCowl.position.set(0, 0.335, 0.004);

  const hoodBackDrape = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.145, 0.105),
    hoodieMat
  );
  hoodBackDrape.position.set(0, 0.3, -0.115);
  hoodBackDrape.rotation.x = 0.48;

  // Drawstrings hanging down upper chest
  const stringL = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.135, 0.014), darkTrimMat);
  stringL.position.set(-0.044, 0.215, 0.162);
  stringL.rotation.z = 0.05;
  const stringR = new THREE.Mesh(new THREE.BoxGeometry(0.013, 0.135, 0.014), darkTrimMat);
  stringR.position.set(0.044, 0.215, 0.162);
  stringR.rotation.z = -0.05;
  upperChestGroup.add(hoodCowl, hoodBackDrape, stringL, stringR);

  // 2. Hollow Open-Front Faceted Hood Shell + Rear Draped 5-Sided Fold Point
  const hoodShell = new THREE.Mesh(buildHollowPS1HoodGeometry(headZOffset), hoodieMat);
  hoodShell.castShadow = true;

  const hoodRearPoint = new THREE.Mesh(
    new THREE.ConeGeometry(0.128, 0.145, 5, 1),
    hoodieMat
  );
  hoodRearPoint.position.set(0, 0.215, headZOffset - 0.165);
  hoodRearPoint.rotation.set(-1.14, Math.PI, 0);

  headGroup.add(hoodShell, hoodRearPoint);

  // 3. Sharp Box Jacket Zipper Line (upper chest + waist seam) & Front Kangaroo Pouch
  if (withZipper) {
    const chestZipper = new THREE.Mesh(
      new THREE.BoxGeometry(0.02, 0.3, 0.022),
      darkTrimMat
    );
    chestZipper.position.set(0, 0.15, 0.158);
    const zipperSlider = new THREE.Mesh(
      new THREE.BoxGeometry(0.025, 0.034, 0.026),
      accentMat
    );
    zipperSlider.position.set(0, 0.24, 0.166);
    const waistZipper = new THREE.Mesh(
      new THREE.BoxGeometry(0.018, 0.2, 0.022),
      darkTrimMat
    );
    waistZipper.position.set(0, 0.13, 0.118);
    upperChestGroup.add(chestZipper, zipperSlider);
    torsoGroup.add(waistZipper);
  }

  const pouch = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.125, 0.046), hoodieMat);
  pouch.position.set(0, 0.145, 0.112);
  torsoGroup.add(pouch);

  // 4. Optional Blocky Low-Poly Backpack + Shoulder Straps
  if (withBackpack) {
    const packMat = ps1Mat({ color: backpackColor });
    const packMain = new THREE.Mesh(new THREE.BoxGeometry(0.275, 0.34, 0.145), packMat);
    packMain.position.set(0, 0.1, -0.175);
    packMain.castShadow = true;

    const packLid = new THREE.Mesh(new THREE.BoxGeometry(0.29, 0.085, 0.16), packMat);
    packLid.position.set(0, 0.265, -0.172);
    packLid.rotation.x = 0.16;

    const packPocket = new THREE.Mesh(new THREE.BoxGeometry(0.21, 0.15, 0.052), darkTrimMat);
    packPocket.position.set(0, 0.005, -0.254);

    const packBuckle = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.038, 0.025), accentMat);
    packBuckle.position.set(0, 0.215, -0.252);

    // Shoulder straps wrapping cleanly over upper chest shoulders
    const strapFrontL = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.28, 0.028), darkTrimMat);
    strapFrontL.position.set(-0.12, 0.165, 0.148);
    const strapFrontR = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.28, 0.028), darkTrimMat);
    strapFrontR.position.set(0.12, 0.165, 0.148);
    const strapTopL = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.032, 0.25), darkTrimMat);
    strapTopL.position.set(-0.12, 0.32, -0.005);
    const strapTopR = new THREE.Mesh(new THREE.BoxGeometry(0.046, 0.032, 0.25), darkTrimMat);
    strapTopR.position.set(0.12, 0.32, -0.005);

    upperChestGroup.add(
      packMain,
      packLid,
      packPocket,
      packBuckle,
      strapFrontL,
      strapFrontR,
      strapTopL,
      strapTopR
    );
  }
}

/**
 * Model 2: createCustomer()
 * Tired, gaunt hunched posture with split upper chest, narrow tapered waist & flared pelvis/hips,
 * draped 5-sided hoodie + accessories (zipper line, drawstrings, blocky backpack),
 * seamless angular shoulder-to-arm connections, and 64x64 hollow-eyed pixel face.
 */
export function createCustomer(hoodieColor?: number): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS1_Customer';
  group.userData.isCustomer = true;

  const darkHoodiePalette = [0x1d222b, 0x2b1d24, 0x1b2b22, 0x252529, 0x2e221b];
  const chosenHoodie =
    hoodieColor ?? darkHoodiePalette[Math.floor(Math.random() * darkHoodiePalette.length)];

  const skinHex = 0xc5b29e;
  const faceVariant =
    CUSTOMER_FACE_VARIANTS[Math.floor(Math.random() * CUSTOMER_FACE_VARIANTS.length)];
  const hoodieMat = ps1Mat({ color: chosenHoodie });
  const pantsMat = ps1Mat({ color: 0x15171c });
  const skinMat = ps1Mat({ color: skinHex });
  const headMat = createPS1HeadMaterial(createPS1HumanFaceTexture(skinHex, faceVariant));
  const shoeMat = ps1Mat({ color: 0x0e0f12 });
  const darkTrimMat = ps1Mat({ color: 0x111318 });
  const zipperPullMat = ps1Mat({ color: 0x9ca3af });

  // Split Upper Chest + Narrow Tapered Waist (slight forward hunch) + Flared Pelvis/Hip Block
  const waistLean = 0.08;
  const upperHunch = 0.1;
  const { torsoGroup, upperChestGroup, headMountY, headMountZ } =
    createPS1SplitTorsoAndPelvis(group, {
      chestMat: hoodieMat,
      waistMat: hoodieMat,
      pelvisMat: pantsMat,
      beltMat: darkTrimMat,
      waistLeanX: waistLean,
      upperHunchX: upperHunch,
      waistScaleX: 0.98,
      chestWidthScaleX: 1.06,
      hipSocketOffsetX: 0.11,
    });

  // Sculpted Faceted PS1 Head inside Open-Front Framing Hood + 4-Sided Nose
  const headGroup = new THREE.Group();
  headGroup.position.set(0, headMountY + 0.01, headMountZ);
  headGroup.rotation.x = 0.1;
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.07, 0.1, 6, 1), skinMat);
  neck.position.set(0, -0.01, 0);
  const headZOffset = 0.032;
  const headMesh = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.135, 'human'), headMat);
  headMesh.position.set(0, 0.11, headZOffset);
  const noseMesh = createPS1NoseMesh(0.135, skinMat);
  noseMesh.position.y += 0.11;
  noseMesh.position.z += headZOffset;
  headGroup.add(neck, headMesh, noseMesh);

  // Open-Front Faceted Hood, Zipper Line, Kangaroo Pouch & Blocky Low-Poly Backpack
  attachPS1DrapedHoodAndAccessories(
    torsoGroup,
    upperChestGroup,
    headGroup,
    hoodieMat,
    darkTrimMat,
    zipperPullMat,
    {
      withBackpack: true,
      backpackColor: 0x262d38,
      withZipper: true,
      headZOffset,
    }
  );

  // Seamless Angular Shoulder Blocks + Tapered 6-sided Arms (mounted to upperChestGroup)
  const { armL, armR } = attachPS1ShoulderBlocksAndArms(upperChestGroup, {
    upperArmMat: hoodieMat,
    forearmMat: hoodieMat,
    skinMat,
    torsoHunchX: waistLean + upperHunch,
    upperArmLength: 0.25,
    forearmLength: 0.25,
    shoulderWidthX: 0.255,
    shoulderHeightY: 0.245,
  });

  // Tapered 6-sided Legs + Shoes (Ground-level y = 0, attaching into pelvis hip sockets)
  const legL = new THREE.Group();
  legL.position.set(-0.11, 0.84, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.072, 0.38, 6, 1), pantsMat);
  thighL.position.set(0, -0.19, 0);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.38, 6, 1), pantsMat);
  calfL.position.set(0, -0.56, 0);
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.25), shoeMat);
  footL.position.set(0, -0.79, 0.04);
  legL.add(thighL, calfL, footL);
  group.add(legL);

  const legR = new THREE.Group();
  legR.position.set(0.11, 0.84, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.072, 0.38, 6, 1), pantsMat);
  thighR.position.set(0, -0.19, 0);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.38, 6, 1), pantsMat);
  calfR.position.set(0, -0.56, 0);
  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.25), shoeMat);
  footR.position.set(0, -0.79, 0.04);
  legR.add(thighR, calfR, footR);
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

/** 2B. Detailed PS1 Customer Character Builder (preserves archetype costumes/hats in <=10-poly PS1 style) */
export function createCustomerCharacter(
  jacketColor: number = 0x334455,
  archetypeIndex: number = 0
): THREE.Group {
  // Unmapped / generic late-night visitor uses the signature PS1 hunched hoodie silhouette
  if (archetypeIndex < 0) {
    return createCustomer(jacketColor);
  }

  const group = new THREE.Group();
  group.userData.isCustomer = true;

  let pantsColor = 0x1e272e;
  let hairColor = 0x221811;
  let skinTone = 0xdfb490;
  let shoeColor = 0x111111;
  let hatColor: number | null = null;
  let accentColor = 0x888888;
  let isHooded = false;
  let hasHoodDown = false;
  let isBaoCon = false;
  let isSpikyHair = false;

  if (archetypeIndex === 0) {
    jacketColor = 0x185a6a;
    pantsColor = 0x144a57;
    hairColor = 0x1b130e;
    skinTone = 0xdfb490;
    shoeColor = 0xeeeeee;
    accentColor = 0x22c55e;
  } else if (archetypeIndex === 1) {
    // Tyler: Red hoodie with folded hood-down collar & messy spiky low-poly brown hair
    jacketColor = 0xa32222;
    pantsColor = 0x242833;
    hairColor = 0x6b3e22;
    skinTone = 0xedd0b8;
    shoeColor = 0x111111;
    accentColor = 0xdddddd;
    hasHoodDown = true;
    isSpikyHair = true;
  } else if (archetypeIndex === 2) {
    jacketColor = 0x3e322a;
    pantsColor = 0x252321;
    hairColor = 0x9e9e9e;
    skinTone = 0xd0ab8b;
    shoeColor = 0x38241b;
    hatColor = 0x473c33;
    accentColor = 0x8a3a34;
  } else if (archetypeIndex === 3) {
    jacketColor = 0x1d4ed8;
    pantsColor = 0x1e40af;
    hairColor = 0x2b180d;
    skinTone = 0xe8ba96;
    shoeColor = 0x5c361a;
    hatColor = 0xd92323;
    accentColor = 0xd92323;
  } else if (archetypeIndex === 4) {
    jacketColor = 0x4c2857;
    pantsColor = 0x1c2536;
    hairColor = 0x141215;
    skinTone = 0xedd3b8;
    shoeColor = 0xe5e5e5;
    hatColor = 0x7f1d1d;
    accentColor = 0xfbbf24;
    isHooded = true;
  } else if (archetypeIndex === 5) {
    jacketColor = 0x142642;
    pantsColor = 0x111827;
    hairColor = 0x3b2618;
    skinTone = 0xc6936c;
    shoeColor = 0x0f0f10;
    hatColor = 0x0f1e36;
    accentColor = 0xd9f99d;
  } else if (archetypeIndex === 7) {
    // Báo Con (Baby Leopards - Leo): Cheerful face, messy spiky hair & hood-down streetwear hoodie
    jacketColor = 0x1e3a5f;
    pantsColor = 0x1d2c3f;
    hairColor = 0x241710;
    skinTone = 0xefd0b5;
    shoeColor = 0xe5e7eb;
    accentColor = 0xfbbf24;
    hasHoodDown = true;
    isBaoCon = true;
    isSpikyHair = true;
  } else if (archetypeIndex === 701) {
    // Báo Con (Baby Leopards - Sam): Cheerful face, hollow hood UP & front spiky bangs
    jacketColor = 0x3b5239;
    pantsColor = 0x1f2421;
    hairColor = 0x1c1512;
    skinTone = 0xe8c4a4;
    shoeColor = 0x222222;
    accentColor = 0xe2e8f0;
    isHooded = true;
    isBaoCon = true;
    isSpikyHair = true;
  } else if (archetypeIndex === 702) {
    // Báo Con (Baby Leopards - Mia): Cheerful face, spiky/layered hair & hood-down maroon hoodie
    jacketColor = 0x6b1d2f;
    pantsColor = 0x1e2538;
    hairColor = 0x3a2015;
    skinTone = 0xf2cfb6;
    shoeColor = 0x262626;
    accentColor = 0xf4f4f5;
    hasHoodDown = true;
    isBaoCon = true;
    isSpikyHair = true;
  } else if (archetypeIndex === 8) {
    jacketColor = 0x5c4628;
    pantsColor = 0x252320;
    hairColor = 0x8e9299;
    skinTone = 0xd6ac8a;
    shoeColor = 0x241913;
    accentColor = 0x362c24;
  } else if (archetypeIndex === 202) {
    jacketColor = 0xc2a678;
    pantsColor = 0x2b3424;
    hairColor = 0x24160e;
    skinTone = 0xe4b895;
    shoeColor = 0x121214;
    hatColor = 0x4b412c;
    accentColor = 0xd4af37;
  } else if (archetypeIndex === 9) {
    jacketColor = 0x1f2d42;
    pantsColor = 0x171b22;
    hairColor = 0x241913;
    skinTone = 0xdfb38f;
    shoeColor = 0x141212;
    accentColor = 0xeab308;
  } else if (archetypeIndex === 10) {
    jacketColor = 0x695e30;
    pantsColor = 0x1d232b;
    hairColor = 0x1b120e;
    skinTone = 0xf0c9ab;
    shoeColor = 0x261f1b;
    accentColor = 0x38bdf8;
  } else {
    jacketColor = 0x232833;
    pantsColor = 0x1c1d22;
    hairColor = 0x6b2c1a;
    skinTone = 0xe6c3a8;
    shoeColor = 0x221a16;
    accentColor = 0x1b5e63;
    isHooded = true;
  }

  const faceVariant = isBaoCon
    ? 'baocon'
    : archetypeIndex === 3
    ? 'bigray'
    : CUSTOMER_FACE_VARIANTS[Math.floor(Math.random() * CUSTOMER_FACE_VARIANTS.length)];
  const skinMat = ps1Mat({ color: skinTone });
  const headMat = createPS1HeadMaterial(
    createPS1HumanFaceTexture(skinTone, faceVariant)
  );
  const jacketMat = ps1Mat({ color: jacketColor });
  const pantsMat = ps1Mat({ color: pantsColor });
  const shoeMat = ps1Mat({ color: shoeColor });
  const whiteMat = ps1Mat({ color: 0xeaeaea });
  const accentMat = ps1Mat({ color: accentColor });
  const darkMat = ps1Mat({ color: 0x18181b });

  // Split Upper Chest + Narrow Tapered Waist (slight waist hunch for customers) + Flared Pelvis/Hip Block
  const waistLean = archetypeIndex === 202 ? 0.02 : isHooded ? 0.07 : 0.05;
  const upperHunch = archetypeIndex === 202 ? 0.02 : isHooded ? 0.09 : 0.07;
  const chestMaterial = archetypeIndex === 3 ? accentMat : jacketMat;
  const { torsoGroup, upperChestGroup, headMountY, headMountZ } =
    createPS1SplitTorsoAndPelvis(group, {
      chestMat: chestMaterial,
      waistMat: jacketMat,
      pelvisMat: pantsMat,
      beltMat: archetypeIndex === 3 ? jacketMat : darkMat,
      waistLeanX: waistLean,
      upperHunchX: upperHunch,
      waistScaleX: 0.99,
      chestWidthScaleX: 1.05,
      hipSocketOffsetX: 0.11,
    });

  // Sculpted Angular PS1 Head + 4-Sided Protruding Nose
  const headGroup = new THREE.Group();
  headGroup.position.set(0, headMountY + 0.01, headMountZ);
  headGroup.rotation.x = isHooded ? 0.08 : 0.03;
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.07, 0.11, 6, 1), skinMat);
  neck.position.set(0, -0.015, 0);
  const headZOffset = isHooded ? 0.025 : 0;
  const cranium = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.14, 'human'), headMat);
  cranium.position.set(0, 0.11, headZOffset);
  const nose = createPS1NoseMesh(0.14, skinMat);
  nose.position.y += 0.11;
  nose.position.z += headZOffset;
  headGroup.add(neck, cranium, nose);

  // Archetype distinct torso details, zipper lines, draped hoods & accessories
  if (archetypeIndex === 0) {
    const badge = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.1, 0.02), accentMat);
    badge.position.set(-0.11, 0.15, 0.162);
    const chestZipper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.022), darkMat);
    chestZipper.position.set(0, 0.15, 0.158);
    const waistZipper = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.2, 0.022), darkMat);
    waistZipper.position.set(0, 0.13, 0.118);
    upperChestGroup.add(badge, chestZipper);
    torsoGroup.add(waistZipper);
  } else if (archetypeIndex === 3) {
    // Denim overalls bib & straps over red shirt chest
    const bib = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.03), jacketMat);
    bib.position.set(0, 0.1, 0.145);
    const strapL = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.29), jacketMat);
    strapL.position.set(-0.1, 0.24, 0);
    const strapR = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.16, 0.29), jacketMat);
    strapR.position.set(0.1, 0.24, 0);
    upperChestGroup.add(bib, strapL, strapR);
  } else if (archetypeIndex === 202) {
    // Deputy Sheriff Vance distinct uniform tie, badge, and belt holster
    const tie = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.24, 0.025), pantsMat);
    tie.position.set(0, 0.16, 0.16);
    const starBadge = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.036, 0.014, 5, 1), accentMat);
    starBadge.rotation.x = Math.PI / 2;
    starBadge.position.set(-0.11, 0.22, 0.162);
    const holsterR = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.14, 0.08), darkMat);
    holsterR.position.set(0.18, 0.02, 0.02);
    upperChestGroup.add(tie, starBadge);
    torsoGroup.add(holsterR);
  } else if (archetypeIndex === 9) {
    const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.3, 0.025), whiteMat);
    shirt.position.set(0, 0.15, 0.155);
    const shield = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.015, 5, 1), accentMat);
    shield.rotation.x = Math.PI / 2;
    shield.position.set(0.09, 0.16, 0.166);
    upperChestGroup.add(shirt, shield);
  } else if (archetypeIndex === 10) {
    const pass = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.09, 0.02), accentMat);
    pass.position.set(-0.09, 0.15, 0.162);
    const cam = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.07, 0.07), darkMat);
    cam.position.set(0.06, 0.04, 0.168);
    const chestZipper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.022), darkMat);
    chestZipper.position.set(0, 0.15, 0.158);
    upperChestGroup.add(pass, cam, chestZipper);
  } else if (isHooded) {
    attachPS1DrapedHoodAndAccessories(
      torsoGroup,
      upperChestGroup,
      headGroup,
      jacketMat,
      darkMat,
      accentMat,
      {
        withBackpack: archetypeIndex === 701,
        backpackColor: 0x2a2520,
        withZipper: true,
        headZOffset,
      }
    );
  } else if (hasHoodDown) {
    attachPS1FoldedHoodDownCollar(
      torsoGroup,
      upperChestGroup,
      jacketMat,
      darkMat,
      accentMat,
      {
        withBackpack: archetypeIndex === 1,
        backpackColor: 0x1c222d,
        withZipper: true,
      }
    );
  } else {
    // Jacket zipper line spanning chest & waist for non-hooded casual jacket customers
    const chestZipper = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.022), darkMat);
    chestZipper.position.set(0, 0.15, 0.158);
    const waistZipper = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.2, 0.022), darkMat);
    waistZipper.position.set(0, 0.13, 0.118);
    upperChestGroup.add(chestZipper);
    torsoGroup.add(waistZipper);
  }

  // Low-poly Hats & Hair per archetype
  if (archetypeIndex === 202) {
    // Deputy Sheriff Vance: Campaign Hat + neat short hair underneath
    attachPS1NeatHairUnderCap(headGroup, hairColor, { withFrontPart: false, headZOffset });
    const hatMat = ps1Mat({ color: hatColor! });
    const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 6, 1), hatMat);
    brim.position.set(0, 0.23, 0);
    const crown = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.14, 4, 1), hatMat);
    crown.rotation.y = Math.PI / 4;
    crown.position.set(0, 0.3, 0);
    const band = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.135, 0.025, 6, 1), accentMat);
    band.position.set(0, 0.245, 0);
    headGroup.add(brim, crown, band);
  } else if (hatColor !== null && !isHooded) {
    attachPS1NeatHairUnderCap(headGroup, hairColor, { withFrontPart: false, headZOffset });
    const capMat = ps1Mat({ color: hatColor });
    attachPS1FittedPeakedCap(headGroup, capMat, { headZOffset });
    if (archetypeIndex === 3) {
      // Big Ray's crisp upper-lip plumber mustache seated right beneath the nose & cleanly above the smile
      const mustacheMat = createPS1HairMaterial(hairColor);
      const stacheL = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.018, 0.022), mustacheMat);
      stacheL.position.set(-0.026, 0.088, 0.123);
      stacheL.rotation.z = 0.14;
      const stacheR = new THREE.Mesh(new THREE.BoxGeometry(0.056, 0.018, 0.022), mustacheMat);
      stacheR.position.set(0.026, 0.088, 0.123);
      stacheR.rotation.z = -0.14;
      headGroup.add(stacheL, stacheR);
    }
  } else if (isHooded) {
    if (isSpikyHair) {
      // Spiky front bangs peeking cleanly out of the hollow hood opening
      attachPS1SpikyHair(headGroup, hairColor, { headZOffset, bangsOnly: true });
    }
    if (hatColor !== null) {
      // Cap visor peeking cleanly under the hood opening without clipping face or hood shell
      const capMat = ps1Mat({ color: hatColor });
      const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.018, 0.115), capMat);
      capBrim.position.set(0, 0.214, headZOffset + 0.145);
      capBrim.rotation.x = 0.14;
      headGroup.add(capBrim);
    }
  } else if (isSpikyHair) {
    attachPS1SpikyHair(headGroup, hairColor, { headZOffset, bangsOnly: false });
  } else {
    attachPS1StyledShortHair(headGroup, hairColor, headZOffset);
  }

  // Seamless Angular Shoulder Blocks + Tapered 6-sided Arms (welded to upperChestGroup)
  const armMat = archetypeIndex === 3 ? accentMat : jacketMat;
  const shoulderCollarMat = archetypeIndex === 3 ? accentMat : jacketMat;
  const { armL, armR } = attachPS1ShoulderBlocksAndArms(upperChestGroup, {
    upperArmMat: armMat,
    forearmMat: armMat,
    shoulderMat: shoulderCollarMat,
    skinMat,
    torsoHunchX: waistLean + upperHunch,
    upperArmLength: 0.25,
    forearmLength: 0.25,
    shoulderWidthX: 0.255,
    shoulderHeightY: 0.245,
  });

  // Tapered 6-sided Legs + Shoes
  const legL = new THREE.Group();
  legL.position.set(-0.11, 0.84, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.072, 0.38, 6, 1), pantsMat);
  thighL.position.set(0, -0.19, 0);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.38, 6, 1), pantsMat);
  calfL.position.set(0, -0.56, 0);
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.25), shoeMat);
  footL.position.set(0, -0.79, 0.04);
  legL.add(thighL, calfL, footL);
  group.add(legL);

  const legR = new THREE.Group();
  legR.position.set(0.11, 0.84, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.072, 0.38, 6, 1), pantsMat);
  thighR.position.set(0, -0.19, 0);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.052, 0.38, 6, 1), pantsMat);
  calfR.position.set(0, -0.56, 0);
  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.1, 0.25), shoeMat);
  footR.position.set(0, -0.79, 0.04);
  legR.add(thighR, calfR, footR);
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

/**
 * Model 3: createStoreClerk()
 * Exhausted, slouched posture, tapered 8-sided uniform vest/apron torso with 32x32 pixelated name tag,
 * peaked cap from two sharp boxes, and 64x64 procedural pale/tired human face on 14-segment head.
 */
export function createStoreClerk(uniformColor: number = 0x14532d): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS1_StoreClerk';

  const skinHex = 0xcdd3d8;
  const vestMat = ps1Mat({ color: uniformColor });
  const shirtMat = ps1Mat({ color: 0x262b33 });
  const pantsMat = ps1Mat({ color: 0x16181e });
  const skinMat = ps1Mat({ color: skinHex });
  const headMat = createPS1HeadMaterial(createPS1HumanFaceTexture(skinHex, 'clerk'));
  const shoeMat = ps1Mat({ color: 0x101113 });
  const nameTagMat = new THREE.MeshStandardMaterial({
    map: createPS1NameTagTexture(),
    flatShading: true,
    roughness: 0.9,
  });
  const capLogoMat = new THREE.MeshStandardMaterial({
    map: createPS1StoreClerkCapLogoTexture(uniformColor),
    flatShading: true,
    roughness: 0.9,
  });

  // Split Upper Chest + Narrow Tapered Waist (tired slouch) + Flared Pelvis/Hip Block
  const waistLean = 0.08;
  const upperHunch = 0.06;
  const { torsoGroup, upperChestGroup, headMountY, headMountZ } =
    createPS1SplitTorsoAndPelvis(group, {
      chestMat: vestMat,
      waistMat: vestMat,
      pelvisMat: pantsMat,
      beltMat: shirtMat,
      waistLeanX: waistLean,
      upperHunchX: upperHunch,
      waistScaleX: 0.98,
      chestWidthScaleX: 1.04,
      hipSocketOffsetX: 0.105,
    });

  const apronWaist = new THREE.Mesh(new THREE.BoxGeometry(0.27, 0.22, 0.03), vestMat);
  apronWaist.position.set(0, 0.1, 0.115);

  // 32x32 Pixelated Name Tag on upper chest
  const nameTag = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.06, 0.015), nameTagMat);
  nameTag.position.set(-0.11, 0.19, 0.155);

  torsoGroup.add(apronWaist);
  upperChestGroup.add(nameTag);

  // Sculpted Angular PS1 Head + Fitted Low-Poly Peaked Cap + 4-Sided Nose
  const headGroup = new THREE.Group();
  headGroup.position.set(0, headMountY + 0.01, headMountZ);
  headGroup.rotation.x = 0.1;
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.07, 0.1, 6, 1), skinMat);
  const cranium = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.138, 'human'), headMat);
  cranium.position.set(0, 0.11, 0);
  const clerkNose = createPS1NoseMesh(0.138, skinMat);
  clerkNose.position.y += 0.11;

  headGroup.add(neck, cranium, clerkNose);
  attachPS1NeatHairUnderCap(headGroup, 0x1e1916, { withFrontPart: false });
  attachPS1FittedPeakedCap(headGroup, vestMat, { logoMat: capLogoMat });

  // Seamless Angular Shoulder Blocks + Tapered 6-sided Arms (mounted to upperChestGroup)
  const { armL, armR } = attachPS1ShoulderBlocksAndArms(upperChestGroup, {
    upperArmMat: shirtMat,
    forearmMat: shirtMat,
    shoulderMat: shirtMat,
    skinMat,
    torsoHunchX: waistLean + upperHunch,
    upperArmLength: 0.24,
    forearmLength: 0.24,
    shoulderWidthX: 0.25,
    shoulderHeightY: 0.24,
  });

  // Tapered 6-sided Legs + Shoes (Ground-level y = 0)
  const legL = new THREE.Group();
  legL.position.set(-0.105, 0.84, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.37, 6, 1), pantsMat);
  thighL.position.set(0, -0.185, 0);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.05, 0.37, 6, 1), pantsMat);
  calfL.position.set(0, -0.555, 0);
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.1, 0.25), shoeMat);
  footL.position.set(0, -0.79, 0.04);
  legL.add(thighL, calfL, footL);
  group.add(legL);

  const legR = new THREE.Group();
  legR.position.set(0.105, 0.84, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.37, 6, 1), pantsMat);
  thighR.position.set(0, -0.185, 0);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.05, 0.37, 6, 1), pantsMat);
  calfR.position.set(0, -0.555, 0);
  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.1, 0.25), shoeMat);
  footR.position.set(0, -0.79, 0.04);
  legR.add(thighR, calfR, footR);
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

/**
 * Model 3B: createJohn()
 * Outgoing night-shift coworker John (completely separate normal human character, no clown makeup/weapons):
 * - Normal human proportions wearing a McDonald's-style dark red polo shirt & dark pants
 * - Matching dark red visor cap & chest emblem featuring a small yellow pixel arch logo
 * - Sculpted angular PS1 human head (no round spheres) with tired pixel face, 4-sided nose,
 *   and short brown/black low-poly hair visible around temples and nape beneath the cap
 */
export function createJohn(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS1_EmployeeJohn';

  const skinHex = 0xdbb594;
  const poloMat = ps1Mat({ color: 0x7f1d1d });
  const collarMat = ps1Mat({ color: 0x5c1111 });
  const pantsMat = ps1Mat({ color: 0x16181e });
  const skinMat = ps1Mat({ color: skinHex });
  const headMat = createPS1HeadMaterial(createPS1HumanFaceTexture(skinHex, 'john'));
  const shoeMat = ps1Mat({ color: 0x0f1013 });
  const nameTagMat = new THREE.MeshStandardMaterial({
    map: createPS1NameTagTexture(),
    flatShading: true,
    roughness: 0.9,
  });
  const logoBadgeMat = new THREE.MeshStandardMaterial({
    map: createPS1EmployeeLogoTexture(),
    flatShading: true,
    roughness: 0.9,
  });

  // Split Upper Chest + Narrow Tapered Polo Waist + Flared Pelvis/Hip Block (normal upright proportions)
  const beltMat = ps1Mat({ color: 0x0b0c10 });
  const waistLean = 0.03;
  const upperHunch = 0.01;
  const { upperChestGroup, torsoGroup, headMountY, headMountZ } =
    createPS1SplitTorsoAndPelvis(group, {
      chestMat: poloMat,
      waistMat: poloMat,
      pelvisMat: pantsMat,
      beltMat,
      waistLeanX: waistLean,
      upperHunchX: upperHunch,
      waistScaleX: 1.0,
      chestWidthScaleX: 1.05,
      hipSocketOffsetX: 0.105,
    });

  // Polo collar trim + placket
  const poloCollar = new THREE.Mesh(new THREE.CylinderGeometry(0.088, 0.105, 0.055, 6, 1), collarMat);
  poloCollar.position.set(0, 0.34, 0.01);
  const placket = new THREE.Mesh(new THREE.BoxGeometry(0.036, 0.16, 0.018), collarMat);
  placket.position.set(0, 0.23, 0.155);

  // Left-chest small yellow pixel arch emblem + right-chest pixelated name tag
  const chestLogo = new THREE.Mesh(new THREE.BoxGeometry(0.078, 0.078, 0.015), logoBadgeMat);
  chestLogo.position.set(0.115, 0.19, 0.158);
  const nameTag = new THREE.Mesh(new THREE.BoxGeometry(0.105, 0.056, 0.015), nameTagMat);
  nameTag.position.set(-0.115, 0.19, 0.158);

  upperChestGroup.add(poloCollar, placket, chestLogo, nameTag);

  // Sculpted Angular PS1 Human Head + Short Brown/Black Hair + Fitted Low-Poly Peaked Cap with Yellow Arch Logo
  const headGroup = new THREE.Group();
  headGroup.position.set(0, headMountY + 0.01, headMountZ);
  headGroup.rotation.x = 0.04;
  group.add(headGroup);

  const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.056, 0.068, 0.1, 6, 1), skinMat);
  const cranium = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.136, 'human'), headMat);
  cranium.position.set(0, 0.11, 0);
  const johnNose = createPS1NoseMesh(0.136, skinMat);
  johnNose.position.y += 0.11;

  headGroup.add(neck, cranium, johnNose);
  attachPS1NeatHairUnderCap(headGroup, 0x261a12, { withFrontPart: true });
  attachPS1FittedPeakedCap(headGroup, poloMat, { logoMat: logoBadgeMat });

  // Seamless Angular Shoulder Blocks + Short-sleeved Polo Arms (welded to upperChestGroup)
  const { armL, armR } = attachPS1ShoulderBlocksAndArms(upperChestGroup, {
    upperArmMat: poloMat,
    forearmMat: skinMat,
    shoulderMat: poloMat,
    skinMat,
    torsoHunchX: waistLean + upperHunch,
    upperArmLength: 0.2,
    forearmLength: 0.26,
    shoulderWidthX: 0.25,
    shoulderHeightY: 0.24,
  });

  // Tapered 6-sided Dark Pants & Work Shoes (Ground-level y = 0)
  const legL = new THREE.Group();
  legL.position.set(-0.105, 0.84, 0);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.37, 6, 1), pantsMat);
  thighL.position.set(0, -0.185, 0);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.05, 0.37, 6, 1), pantsMat);
  calfL.position.set(0, -0.555, 0);
  const footL = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.1, 0.25), shoeMat);
  footL.position.set(0, -0.79, 0.04);
  legL.add(thighL, calfL, footL);
  group.add(legL);

  const legR = new THREE.Group();
  legR.position.set(0.105, 0.84, 0);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.37, 6, 1), pantsMat);
  thighR.position.set(0, -0.185, 0);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.05, 0.37, 6, 1), pantsMat);
  calfR.position.set(0, -0.555, 0);
  const footR = new THREE.Mesh(new THREE.BoxGeometry(0.115, 0.1, 0.25), shoeMat);
  footR.position.set(0, -0.79, 0.04);
  legR.add(thighR, calfR, footR);
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

/** Convenience Store & McDonald's Staff Preserved Exports */
export function create67ElevenEmployee(): THREE.Group {
  return createStoreClerk(0x14532d);
}

export const createEmployeeJohn = createJohn;

/**
 * Model 6: createFastFoodProps()
 * PS1 Fast-Food Combo: Burger (4 stacked 5-sided flat cylinders + square cheese),
 * Fries (4-sided red container + jagged rectangular fry sticks), Drink Cup (5-sided tapered cylinder + thin box straw).
 */
export function createFastFoodProps(): THREE.Group {
  const group = new THREE.Group();
  group.name = 'PS1_FastFoodProps';

  const trayMat = ps1Mat({ color: 0x1f2124 });
  const linerMat = ps1Mat({ color: 0xc8231d });
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.3), trayMat);
  tray.position.y = 0.0075;
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.016;
  group.add(tray, liner);

  const burger = createPS1BurgerMesh();
  burger.position.set(-0.1, 0.016, 0.03);

  const fries = createPS1FriesMesh();
  fries.position.set(0.09, 0.016, 0.05);

  const drink = createPS1DrinkCupMesh(0xb91c1c, 0xf1f5f9);
  drink.position.set(0.09, 0.016, -0.06);

  group.add(burger, fries, drink);
  return group;
}

/** 3. Automatic Front Sliding Glass Doors (PS1 Low-Poly) */
export function createSlidingGlassDoors(): {
  group: THREE.Group;
  leftGlass: THREE.Mesh;
  rightGlass: THREE.Mesh;
} {
  const group = new THREE.Group();
  const frameMat = ps1Mat({ color: 0x333333 });
  const glassMat = ps1Mat({ color: 0x7799aa, transparent: true, opacity: 0.45 });
  const sensorMat = ps1Mat({ color: 0x111111 });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x22ee33 });

  const header = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.3, 0.25), frameMat);
  header.position.set(0, 2.65, 0);
  const sensorBox = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.12, 0.15), sensorMat);
  sensorBox.position.set(0, 2.7, 0.15);
  const sensorLed = new THREE.Mesh(new THREE.BoxGeometry(0.035, 0.035, 0.02), ledMat);
  sensorLed.position.set(0, 2.68, 0.23);
  const postL = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.2), frameMat);
  postL.position.set(-1.54, 1.3, 0);
  const postR = new THREE.Mesh(new THREE.BoxGeometry(0.12, 2.6, 0.2), frameMat);
  postR.position.set(1.54, 1.3, 0);

  const leftGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.5, 0.05), glassMat);
  leftGlass.position.set(-0.48, 1.25, 0);
  const rightGlass = new THREE.Mesh(new THREE.BoxGeometry(0.95, 2.5, 0.05), glassMat);
  rightGlass.position.set(0.48, 1.25, 0);

  group.add(header, sensorBox, sensorLed, postL, postR, leftGlass, rightGlass);
  return { group, leftGlass, rightGlass };
}

/** 4A. PS1 POS Cash Register (greenish CRT option + <=10-poly primitives) */
export function createDetailedCashRegisterModel(
  regNum: number = 1,
  useGreenCRT: boolean = false
): THREE.Group {
  const group = new THREE.Group();

  const darkSteelMat = ps1Mat({ color: 0x1f2327 });
  const chromeMat = ps1Mat({ color: 0xc2c6ca });
  const blackMat = ps1Mat({ color: 0x141618 });
  const paperMat = ps1Mat({ color: 0xebebdf });
  const ledGreen = new THREE.MeshBasicMaterial({ color: 0x22ee44 });

  const cashDrawer = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.1, 0.42), darkSteelMat);
  cashDrawer.position.set(0, 0.05, 0);
  const keyLock = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.025, 5, 1), chromeMat);
  keyLock.rotation.x = Math.PI / 2;
  keyLock.position.set(0.14, 0.05, 0.22);

  const mountArm = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.04, 0.2, 5, 1), darkSteelMat);
  mountArm.position.set(0, 0.19, -0.05);

  const monitorGroup = new THREE.Group();
  monitorGroup.position.set(0, 0.32, -0.03);
  monitorGroup.rotation.x = -Math.PI / 4.8;

  const bezel = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.3, 0.06), darkSteelMat);
  const screenTex = useGreenCRT ? createPS1CRTGreenTexture() : createPOSTouchScreenTexture(regNum);
  const screen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.25),
    new THREE.MeshBasicMaterial({ map: screenTex })
  );
  screen.position.z = 0.032;
  const powerLed = new THREE.Mesh(new THREE.BoxGeometry(0.012, 0.012, 0.01), ledGreen);
  powerLed.position.set(0.16, -0.13, 0.032);
  monitorGroup.add(bezel, screen, powerLed);

  // Customer Pole Display
  const vfdPole = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.36, 5, 1), darkSteelMat);
  vfdPole.position.set(-0.14, 0.28, -0.16);
  const vfdHead = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.07, 0.045), blackMat);
  vfdHead.position.set(-0.14, 0.48, -0.16);
  const vfdScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.22, 0.055),
    new THREE.MeshBasicMaterial({ map: createCustomerPoleDisplayTexture() })
  );
  vfdScreen.position.set(-0.14, 0.48, -0.184);
  vfdScreen.rotation.y = Math.PI;

  // Receipt Printer + Pinpad
  const printer = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.11, 0.15), darkSteelMat);
  printer.position.set(-0.28, 0.155, 0.02);
  const paper = new THREE.Mesh(new THREE.BoxGeometry(0.075, 0.03, 0.015), paperMat);
  paper.position.set(-0.28, 0.22, 0.05);
  const pinpad = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.15), blackMat);
  pinpad.position.set(0.18, 0.17, 0.22);

  group.add(cashDrawer, keyLock, mountArm, monitorGroup, vfdPole, vfdHead, vfdScreen, printer, paper, pinpad);
  return group;
}

/** 4B. Compact Fast-Food Cashier Counter */
export function createCompactCashierCounter(useGreenCRT: boolean = false): THREE.Group {
  const group = new THREE.Group();
  const woodMat = ps1Mat({ color: 0x4a2a22 });
  const topMat = ps1Mat({ color: 0xd9cca8 });
  const trayMat = ps1Mat({ color: 0xb0b5ba });

  const base = new THREE.Mesh(new THREE.BoxGeometry(3.6, 1.05, 0.75), woodMat);
  base.position.set(0, 0.525, 0);
  const top = new THREE.Mesh(new THREE.BoxGeometry(3.7, 0.06, 0.85), topMat);
  top.position.set(0, 1.08, 0);
  group.add(base, top);

  const reg1 = createDetailedCashRegisterModel(1, useGreenCRT);
  reg1.position.set(-0.85, 1.08, 0.0);
  const reg2 = createDetailedCashRegisterModel(2, useGreenCRT);
  reg2.position.set(0.65, 1.08, 0.0);
  group.add(reg1, reg2);

  const pickupTray1 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.32), trayMat);
  pickupTray1.position.set(-0.85, 1.09, 0.26);
  const pickupTray2 = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.015, 0.32), trayMat);
  pickupTray2.position.set(0.65, 1.09, 0.26);
  const napkinDisp = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.18, 0.22), trayMat);
  napkinDisp.position.set(-0.1, 1.18, 0.15);
  group.add(pickupTray1, pickupTray2, napkinDisp);

  return group;
}

/** 5. Time Attendance Punch Clock */
export function createDetailedTimeAttendanceMachineModel(): THREE.Group {
  const group = new THREE.Group();
  const bodyMat = ps1Mat({ color: 0x22262b });
  const bezelMat = ps1Mat({ color: 0x131619 });
  const badgeMat = ps1Mat({ color: 0xfacc15 });
  const screenMat = new THREE.MeshBasicMaterial({ map: createTimeAttendanceScreenTexture() });

  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.48, 0.14), bodyMat);
  const frontFace = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.44, 0.02), bezelMat);
  frontFace.position.z = 0.072;
  const lcd = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.18), screenMat);
  lcd.position.set(0, 0.08, 0.085);
  const keypad = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.12, 0.02), bodyMat);
  keypad.position.set(0, -0.09, 0.082);
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.02, 0.02), badgeMat);
  slot.position.set(0, -0.19, 0.082);

  group.add(chassis, frontFace, lcd, keypad, slot);
  return group;
}

export function createTimeClockPunch(): THREE.Group {
  return createDetailedTimeAttendanceMachineModel();
}

/** 6. Outdoor Blocky Green/Rusty Metal Dumpster with Angled Lids (Model 7 Back Trash Area) */
export function createOutdoorDumpster(): THREE.Group {
  const group = new THREE.Group();
  const dumpsterMat = ps1Mat({ color: 0x1f4728 });
  const rustMat = ps1Mat({ color: 0x4f301e });
  const lidMat = ps1Mat({ color: 0x1a1c1d });
  const casterMat = ps1Mat({ color: 0x111111 });

  const tub = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.25, 1.4), dumpsterMat);
  tub.position.set(0, 0.72, 0);
  tub.castShadow = true;
  tub.receiveShadow = true;
  group.add(tub);

  const rustBand = new THREE.Mesh(new THREE.BoxGeometry(2.44, 0.16, 1.44), rustMat);
  rustBand.position.set(0, 0.35, 0);
  group.add(rustBand);

  const lidL = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), lidMat);
  lidL.position.set(-0.62, 1.48, -0.12);
  lidL.rotation.z = 0.24;
  lidL.rotation.x = -0.2;

  const lidR = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.08, 1.45), lidMat);
  lidR.position.set(0.6, 1.39, 0);
  lidR.rotation.z = -0.05;
  group.add(lidL, lidR);

  const casterGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.08, 5, 1);
  [
    [-1.0, 0.1, -0.55],
    [1.0, 0.1, -0.55],
    [-1.0, 0.1, 0.55],
    [1.0, 0.1, 0.55],
  ].forEach(([cx, cy, cz]) => {
    const wheel = new THREE.Mesh(casterGeo, casterMat);
    wheel.position.set(cx, cy, cz);
    group.add(wheel);
  });

  return group;
}

/** 7. Rear Service Door */
export function createRearServiceDoor(): { group: THREE.Group; doorLeaf: THREE.Mesh } {
  const group = new THREE.Group();
  const frameMat = ps1Mat({ color: 0x242424 });
  const doorMat = ps1Mat({ color: 0x4a4f52 });
  const barMat = ps1Mat({ color: 0xcccccc });

  const frameL = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 0.2), frameMat);
  frameL.position.set(-0.55, 1.15, 0);
  const frameR = new THREE.Mesh(new THREE.BoxGeometry(0.1, 2.3, 0.2), frameMat);
  frameR.position.set(0.55, 1.15, 0);
  const frameTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.1, 0.2), frameMat);
  frameTop.position.set(0, 2.3, 0);
  group.add(frameL, frameR, frameTop);

  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(1.0, 2.2, 0.08), doorMat);
  doorLeaf.position.set(0, 1.1, 0);
  const pushBar = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.8, 5, 1), barMat);
  pushBar.rotation.z = Math.PI / 2;
  pushBar.position.set(0, 1.05, 0.06);
  doorLeaf.add(pushBar);

  group.add(doorLeaf);
  return { group, doorLeaf };
}

/** 8. Cardboard Waste Bundle */
export function createCardboardBundle(): THREE.Group {
  const group = new THREE.Group();
  const cardMat = ps1Mat({ color: 0x8a633c });
  const twineMat = ps1Mat({ color: 0xe0d7b6 });

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
  const vinylMat = ps1Mat({ color: 0xa8201a });
  const yellowMat = ps1Mat({ color: 0xdf9a14 });
  const topMat = ps1Mat({ color: 0xd9cca8 });
  const chromeMat = ps1Mat({ color: 0xc4c4c4 });
  const metalMat = ps1Mat({ color: 0x222222 });

  const tableBase = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.04, 5, 1), metalMat);
  tableBase.position.set(0, 0.02, 0);
  const tablePole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 5, 1), chromeMat);
  tablePole.position.set(0, 0.42, 0);
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.05, 0.8), topMat);
  tableTop.position.set(0, 0.82, 0);
  group.add(tableBase, tablePole, tableTop);

  [
    { z: 0.65, ry: 0 },
    { z: -0.65, ry: Math.PI },
  ].forEach(({ z, ry }) => {
    const bench = new THREE.Group();
    bench.position.set(0, 0, z);
    bench.rotation.y = ry;
    const leg1 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 5, 1), metalMat);
    leg1.position.set(-0.55, 0.225, 0);
    const leg2 = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.45, 5, 1), metalMat);
    leg2.position.set(0.55, 0.225, 0);
    const seat = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.12, 0.45), vinylMat);
    seat.position.set(0, 0.48, 0);
    const back = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.6, 0.1), vinylMat);
    back.position.set(0, 0.78, 0.22);
    const stripe = new THREE.Mesh(new THREE.BoxGeometry(1.32, 0.08, 0.11), yellowMat);
    stripe.position.set(0, 0.82, 0.22);
    bench.add(leg1, leg2, seat, back, stripe);
    group.add(bench);
  });

  return group;
}

/** 9B. Seated Dining Customer Model in Booth */
export function createSeatedCustomerInBooth(_archetypeIndex: number = 2): THREE.Group {
  const group = new THREE.Group();
  const skinHex = 0xd0ab8b;
  const skinMat = ps1Mat({ color: skinHex });
  const headMat = createPS1HeadMaterial(createPS1HumanFaceTexture(skinHex, 'tired'));
  const coatMat = ps1Mat({ color: 0x3e322a });
  const pantsMat = ps1Mat({ color: 0x252321 });
  const shoeMat = ps1Mat({ color: 0x38241b });
  const hatMat = ps1Mat({ color: 0x473c33 });
  const scarfMat = ps1Mat({ color: 0x8a3a34 });

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.155, 0.175, 0.15, 8, 1), pantsMat);
  pelvis.scale.set(1.06, 1.0, 0.74);
  pelvis.position.set(0, 0.54, 0.62);
  const thighL = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.062, 0.38, 6, 1), pantsMat);
  thighL.rotation.x = Math.PI / 2;
  thighL.position.set(-0.1, 0.54, 0.43);
  const thighR = new THREE.Mesh(new THREE.CylinderGeometry(0.072, 0.062, 0.38, 6, 1), pantsMat);
  thighR.rotation.x = Math.PI / 2;
  thighR.position.set(0.1, 0.54, 0.43);
  const calfL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.048, 0.44, 6, 1), pantsMat);
  calfL.position.set(-0.1, 0.26, 0.24);
  const calfR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.048, 0.44, 6, 1), pantsMat);
  calfR.position.set(0.1, 0.26, 0.24);
  const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.22), shoeMat);
  shoeL.position.set(-0.1, 0.05, 0.2);
  const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.09, 0.22), shoeMat);
  shoeR.position.set(0.1, 0.05, 0.2);
  group.add(pelvis, thighL, thighR, calfL, calfR, shoeL, shoeR);

  const torsoGroup = new THREE.Group();
  torsoGroup.position.set(0, 0.61, 0.62);
  torsoGroup.rotation.x = -0.12;
  const torso = new THREE.Mesh(new THREE.CylinderGeometry(0.215, 0.165, 0.44, 8, 1), coatMat);
  torso.scale.set(1.04, 1.0, 0.72);
  torso.position.set(0, 0.22, 0);
  const scarf = new THREE.Mesh(new THREE.CylinderGeometry(0.135, 0.15, 0.12, 6, 1), scarfMat);
  scarf.position.set(0, 0.43, 0);

  // Rotate sculpted head + nose 180° on Y so it looks toward the table (-Z)
  const headPivot = new THREE.Group();
  headPivot.position.set(0, 0.58, 0.02);
  headPivot.rotation.y = Math.PI;
  const head = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.135, 'human'), headMat);
  const boothNose = createPS1NoseMesh(0.135, skinMat);
  headPivot.add(head, boothNose);

  const capCrown = new THREE.Mesh(new THREE.BoxGeometry(0.215, 0.08, 0.215), hatMat);
  capCrown.position.set(0, 0.73, 0.01);
  const capBrim = new THREE.Mesh(new THREE.BoxGeometry(0.175, 0.02, 0.12), hatMat);
  capBrim.position.set(0, 0.69, -0.11);
  const shoulderL = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.13), coatMat);
  shoulderL.position.set(-0.2, 0.39, 0);
  shoulderL.rotation.z = 0.24;
  const shoulderR = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.1, 0.13), coatMat);
  shoulderR.position.set(0.2, 0.39, 0);
  shoulderR.rotation.z = -0.24;

  const armL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.046, 0.38, 6, 1), coatMat);
  armL.rotation.x = Math.PI / 2 + 0.25;
  armL.position.set(-0.225, 0.3, -0.17);
  const armR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.046, 0.38, 6, 1), coatMat);
  armR.rotation.x = Math.PI / 2 + 0.25;
  armR.position.set(0.225, 0.3, -0.17);

  torsoGroup.add(torso, shoulderL, shoulderR, armL, armR, scarf, headPivot, capCrown, capBrim);
  group.add(torsoGroup);

  // PS1 Fast-food burger, 4-sided fries & 5-sided cup on booth table
  const mealGroup = new THREE.Group();
  mealGroup.position.set(0, 0.82, 0.05);
  const burger = createPS1BurgerMesh();
  burger.position.set(-0.02, 0, -0.02);
  const fries = createPS1FriesMesh();
  fries.position.set(-0.15, 0, 0.06);
  const cup = createPS1DrinkCupMesh(0xf1f5f9, 0x222222);
  cup.position.set(0.14, 0, 0.08);
  mealGroup.add(burger, fries, cup);
  group.add(mealGroup);

  return group;
}

/** 10. Kitchen Counter */
export function createKitchenCounter(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = ps1Mat({ map: createStainlessSteelTexture() });
  const darkMat = ps1Mat({ color: 0x333333 });

  const top = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.08, 0.85), steelMat);
  top.position.set(0, 0.92, 0);
  group.add(top);

  const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.88, 5, 1);
  [
    [-1.0, 0.44, -0.35],
    [1.0, 0.44, -0.35],
    [-1.0, 0.44, 0.35],
    [1.0, 0.44, 0.35],
  ].forEach(([x, y, z]) => {
    const leg = new THREE.Mesh(legGeo, darkMat);
    leg.position.set(x, y, z);
    group.add(leg);
  });

  return group;
}

/** 11. Deep Fryer */
export function createDeepFryer(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = ps1Mat({ color: 0x8a9299 });
  const oilMat = ps1Mat({ color: 0x6e4e10 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(0.85, 0.95, 0.75), steelMat);
  base.position.set(0, 0.475, 0);
  const oil = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.05, 0.45), oilMat);
  oil.position.set(0, 0.9, 0.05);
  group.add(base, oil);
  return group;
}

/** 12. Full PS1 90s Computer Workstation */
export function createDetailedPCModel(cameraScreens: THREE.Mesh[] = []): THREE.Group {
  const pcGroup = new THREE.Group();
  const beigeMat = ps1Mat({ color: 0xd4cebd });
  const darkMat = ps1Mat({ color: 0x222426 });
  const mousePadMat = ps1Mat({ color: 0x1b2838 });
  const ledGreen = new THREE.MeshBasicMaterial({ color: 0x22ee44 });

  // Horizontal PC case
  const chassis = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.15, 0.44), beigeMat);
  chassis.position.set(0, 0.075, -0.04);
  const cdDrive = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.04, 0.02), darkMat);
  cdDrive.position.set(0.12, 0.11, 0.185);
  const powerLed = new THREE.Mesh(new THREE.BoxGeometry(0.015, 0.015, 0.01), ledGreen);
  powerLed.position.set(-0.09, 0.06, 0.185);
  pcGroup.add(chassis, cdDrive, powerLed);

  // CRT Monitor
  const standNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.09, 0.06, 5, 1), darkMat);
  standNeck.position.set(0, 0.18, -0.04);
  const monBody = new THREE.Mesh(new THREE.BoxGeometry(0.52, 0.42, 0.38), beigeMat);
  monBody.position.set(0, 0.43, -0.04);
  const rearWedge = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.32, 0.12), beigeMat);
  rearWedge.position.set(0, 0.43, -0.26);

  const crtScreen = new THREE.Mesh(
    new THREE.PlaneGeometry(0.42, 0.3),
    new THREE.MeshBasicMaterial({ map: createComputerCCTVScreenTexture() })
  );
  crtScreen.position.set(0, 0.45, 0.155);
  cameraScreens.push(crtScreen);

  const screenGlow = new THREE.PointLight(0x00ff66, 0.7, 2.2);
  screenGlow.position.set(0, 0.45, 0.36);
  pcGroup.add(standNeck, monBody, rearWedge, crtScreen, screenGlow);

  // Keyboard & Mouse
  const keyboard = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.03, 0.18), beigeMat);
  keyboard.position.set(-0.06, 0.015, 0.28);
  const mousePad = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.006, 0.22), mousePadMat);
  mousePad.position.set(0.32, 0.003, 0.28);
  const mouse = new THREE.Mesh(new THREE.BoxGeometry(0.065, 0.028, 0.11), beigeMat);
  mouse.position.set(0.32, 0.02, 0.28);
  pcGroup.add(keyboard, mousePad, mouse);

  return pcGroup;
}

/** 13. Security Office Desk + PC */
export function createSecurityOfficeDesk(cameraScreens: THREE.Mesh[] = []): THREE.Group {
  const group = new THREE.Group();
  const woodMat = ps1Mat({ color: 0x3d3027 });
  const metalMat = ps1Mat({ color: 0x222222 });

  const deskTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.08, 0.95), woodMat);
  deskTop.position.set(0, 0.8, 0);
  const legL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.8), metalMat);
  legL.position.set(-0.68, 0.38, 0);
  const legR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.76, 0.8), metalMat);
  legR.position.set(0.68, 0.38, 0);
  group.add(deskTop, legL, legR);

  const computer = createDetailedPCModel(cameraScreens);
  computer.position.set(0, 0.84, -0.06);
  group.add(computer);

  const chairGroup = new THREE.Group();
  chairGroup.position.set(0, 0, 0.58);
  const chairSeat = new THREE.Mesh(new THREE.BoxGeometry(0.48, 0.08, 0.46), metalMat);
  chairSeat.position.set(0, 0.5, 0);
  const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.44, 0.48, 0.06), metalMat);
  chairBack.position.set(0, 0.76, -0.2);
  const chairPole = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 5, 1), metalMat);
  chairPole.position.set(0, 0.25, 0);
  for (let c = 0; c < 5; c++) {
    const angle = (c * 2 * Math.PI) / 5;
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.04, 0.25), metalMat);
    leg.position.set(Math.sin(angle) * 0.12, 0.04, Math.cos(angle) * 0.12);
    leg.rotation.y = angle;
    chairGroup.add(leg);
  }
  chairGroup.add(chairSeat, chairBack, chairPole);
  group.add(chairGroup);

  return group;
}

/** 14. Locker, Freezer Shelves, Table Mess, Trash Bag, Clipboard, Puddle, Mop */
export function createLocker(): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.6, 2.0, 0.6), ps1Mat({ color: 0x3f4e56 }));
  body.position.set(0, 1.0, 0);
  group.add(body);
  return group;
}

export function createFreezerShelves(): THREE.Group {
  const group = new THREE.Group();
  const wireMat = ps1Mat({ color: 0x8a9296 });
  const boxMat = ps1Mat({ color: 0x825936 });

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

export function createTableMess(): THREE.Group {
  const group = new THREE.Group();
  const stain = new THREE.Mesh(
    new THREE.PlaneGeometry(0.35, 0.25),
    new THREE.MeshBasicMaterial({ color: 0x7a1111 })
  );
  stain.rotation.x = -Math.PI / 2;
  stain.position.y = 0.01;
  const foil = new THREE.Mesh(new THREE.OctahedronGeometry(0.09, 0), ps1Mat({ color: 0xd9d9d9 }));
  foil.position.set(0.05, 0.09, 0.02);
  group.add(stain, foil);
  return group;
}

export function createTrashBag(): THREE.Group {
  return createPS1CrumpledTrashBag(0.28, 7);
}

export function createClipboardProp(_label: string = 'CHECKLIST'): THREE.Group {
  const group = new THREE.Group();
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.45, 0.02), ps1Mat({ color: 0x8a603c }));
  const paper = new THREE.Mesh(new THREE.PlaneGeometry(0.28, 0.38), new THREE.MeshBasicMaterial({ color: 0xededdb }));
  paper.position.set(0, -0.01, 0.015);
  const clip = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.04, 0.03), ps1Mat({ color: 0xaaaaaa }));
  clip.position.set(0, 0.2, 0.02);
  group.add(board, paper, clip);
  return group;
}

export function createHallwayPuddle(): THREE.Group {
  const group = new THREE.Group();
  const puddle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.65, 0.01, 5, 1),
    ps1Mat({ color: 0x4a0d0d })
  );
  puddle.scale.set(1.2, 1, 0.8);
  group.add(puddle);
  return group;
}

export function createMopAndBucket(): THREE.Group {
  const group = new THREE.Group();
  const yellowMat = ps1Mat({ color: 0xdb9d14 });
  const blackMat = ps1Mat({ color: 0x1c1e1f });
  const strandMat = ps1Mat({ color: 0xdedede });
  const handleMat = ps1Mat({ color: 0x4a7c59 });

  const bucket = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.32, 0.32), yellowMat);
  bucket.position.set(0, 0.2, 0);
  const wringer = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.18, 0.26), blackMat);
  wringer.position.set(0.06, 0.42, 0);
  const wringerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.25, 5, 1), blackMat);
  wringerHandle.position.set(0.18, 0.52, 0);
  wringerHandle.rotation.z = Math.PI / 4;
  group.add(bucket, wringer, wringerHandle);

  const casterGeo = new THREE.CylinderGeometry(0.03, 0.03, 0.03, 5, 1);
  [
    [-0.14, 0.03, -0.12],
    [0.14, 0.03, -0.12],
    [-0.14, 0.03, 0.12],
    [0.14, 0.03, 0.12],
  ].forEach(([cx, cy, cz]) => {
    const c = new THREE.Mesh(casterGeo, blackMat);
    c.position.set(cx, cy, cz);
    group.add(c);
  });

  const mopGroup = new THREE.Group();
  const mopHead = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.08, 0.16, 5, 1), strandMat);
  mopHead.position.set(-0.06, 0.24, 0);
  const mopStick = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 1.25, 5, 1), handleMat);
  mopStick.position.set(-0.16, 0.72, 0);
  mopStick.rotation.z = 0.22;
  mopGroup.add(mopHead, mopStick);
  group.add(mopGroup);
  group.userData.mopInBucket = mopGroup;

  return group;
}

/** 18. Drive-Thru Order Station */
export function createDriveThruOrderStation(): THREE.Group {
  const group = new THREE.Group();
  const darkMat = ps1Mat({ color: 0x1b2024 });
  const plasticMat = ps1Mat({ color: 0x2d3436 });
  const metalMat = ps1Mat({ color: 0x888888 });
  const screenMat = new THREE.MeshBasicMaterial({ map: createPS1CRTGreenTexture() });

  const stand = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.25, 5, 1), metalMat);
  stand.position.set(0, 0.125, 0);
  const terminal = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.28, 0.24), plasticMat);
  terminal.position.set(0, 0.35, 0);
  terminal.rotation.x = -Math.PI / 10;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.32, 0.2), screenMat);
  screen.position.set(0, 0.36, 0.125);
  screen.rotation.x = -Math.PI / 10;
  const speaker = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.16, 0.12), darkMat);
  speaker.position.set(0.24, 0.25, -0.05);
  const micBase = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.14, 5, 1), metalMat);
  micBase.position.set(-0.2, 0.23, 0.08);
  const micHead = new THREE.Mesh(new THREE.OctahedronGeometry(0.025, 0), darkMat);
  micHead.position.set(-0.18, 0.32, 0.12);

  group.add(stand, terminal, screen, speaker, micBase, micHead);
  return group;
}

/** 17. Commercial Coffee & Espresso Machine */
export function createCommercialCoffeeMachine(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = ps1Mat({ color: 0x98a0a8 });
  const darkMat = ps1Mat({ color: 0x202224 });
  const chromeMat = ps1Mat({ color: 0xcfd4d9 });
  const glassMat = ps1Mat({ color: 0xdbeafe, transparent: true, opacity: 0.55 });
  const beanMat = ps1Mat({ color: 0x3b2219 });
  const cupMat = ps1Mat({ color: 0xdfd4bc });
  const lidMat = ps1Mat({ color: 0x1a1a1a });

  const baseChassis = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.52, 0.44), steelMat);
  baseChassis.position.set(0, 0.26, 0);
  const dripTray = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.05, 0.22), darkMat);
  dripTray.position.set(0, 0.025, 0.2);
  group.add(baseChassis, dripTray);

  [-0.16, 0.16].forEach((gx) => {
    const head = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.06, 5, 1), chromeMat);
    head.position.set(gx, 0.32, 0.18);
    const handle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.025, 0.14), darkMat);
    handle.position.set(gx, 0.29, 0.26);
    group.add(head, handle);
  });

  // Hoppers on top (5-sided)
  [0.12, 0.26].forEach((hx) => {
    const hopper = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.05, 0.16, 5, 1), glassMat);
    hopper.position.set(hx, 0.6, -0.04);
    const beans = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.045, 0.11, 5, 1), beanMat);
    beans.position.set(hx, 0.58, -0.04);
    group.add(hopper, beans);
  });

  // Cups warming on top
  [
    [-0.22, -0.06],
    [-0.1, -0.06],
  ].forEach(([cx, cz]) => {
    const c = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.026, 0.09, 5, 1), cupMat);
    c.position.set(cx, 0.565, cz);
    const l = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.012, 5, 1), lidMat);
    l.position.set(cx, 0.615, cz);
    group.add(c, l);
  });

  // Coffee carafe pot (5-sided + box handle)
  const potGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.065, 0.13, 5, 1), glassMat);
  potGlass.position.set(-0.16, 0.145, 0.2);
  const potHandle = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.09, 0.04), darkMat);
  potHandle.position.set(-0.09, 0.15, 0.2);
  group.add(potGlass, potHandle);

  // Interactive McCafe cup placed under right group head while brewing coffee (hidden until Duck puts cup in)
  const brewingCup = createPS1DrinkCupMesh(0xdfd4bc, 0x1a1a1a);
  brewingCup.position.set(0.16, 0.055, 0.2);
  brewingCup.visible = false;
  group.add(brewingCup);

  const espressoMat = ps1Mat({ color: 0x3b1f0e });
  const coffeeStream = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.004, 0.16, 5, 1), espressoMat);
  coffeeStream.position.set(0.16, 0.21, 0.2);
  coffeeStream.visible = false;
  group.add(coffeeStream);

  const steamMat = ps1Mat({ color: 0xf1f5f9, transparent: true, opacity: 0.45, depthWrite: false });
  const steamPuffs: THREE.Mesh[] = [];
  for (let s = 0; s < 4; s++) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.036 + s * 0.008, 0), steamMat.clone());
    puff.position.set(0.16, 0.22 + s * 0.09, 0.2);
    puff.visible = false;
    group.add(puff);
    steamPuffs.push(puff);
  }

  const coffeeLight = new THREE.PointLight(0xffaa44, 0.0, 2.4);
  coffeeLight.position.set(0.16, 0.28, 0.28);
  group.add(coffeeLight);

  group.userData.brewingCup = brewingCup;
  group.userData.coffeeStream = coffeeStream;
  group.userData.steamPuffs = steamPuffs;
  group.userData.coffeeLight = coffeeLight;

  return group;
}

/** 17B. Commercial Fast-Food Soft Drink Dispenser (Fountain Soda Station with 4 nozzles & active cup pour) */
export function createSoftDrinkDispenser(): THREE.Group {
  const group = new THREE.Group();
  const standMat = ps1Mat({ color: 0x7c848c });
  const darkMat = ps1Mat({ color: 0x1c1f24 });
  const steelMat = ps1Mat({ color: 0xb0b8c0 });
  const trayMat = ps1Mat({ color: 0x262930 });

  // Stainless steel base cabinet
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.92, 0.6), standMat);
  cabinet.position.set(0, 0.46, 0);
  const cabinetDoor = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.78, 0.03), steelMat);
  cabinetDoor.position.set(0, 0.44, 0.305);
  group.add(cabinet, cabinetDoor);

  // Fountain Dispenser Tower Unit on top
  const tower = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.68, 0.46), darkMat);
  tower.position.set(0, 1.26, -0.04);
  const sidePanelL = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.48), steelMat);
  sidePanelL.position.set(-0.38, 1.26, -0.04);
  const sidePanelR = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.7, 0.48), steelMat);
  sidePanelR.position.set(0.38, 1.26, -0.04);
  const headerMarquee = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 0.16, 0.04),
    new THREE.MeshBasicMaterial({ color: 0xef4444 })
  );
  headerMarquee.position.set(0, 1.5, 0.195);
  group.add(tower, sidePanelL, sidePanelR, headerMarquee);

  // Drip tray & grate shelf
  const dripTray = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.22), trayMat);
  dripTray.position.set(0, 0.95, 0.22);
  const dripGrate = new THREE.Mesh(new THREE.BoxGeometry(0.66, 0.015, 0.16), steelMat);
  dripGrate.position.set(0, 0.985, 0.22);
  group.add(dripTray, dripGrate);

  // 4 Backlit Soda Flavor Nozzles (Cola Red, Sprite Green, Fanta Orange, Root Beer Amber)
  const flavorColors = [0xdc2626, 0x16a34a, 0xf97316, 0x92400e];
  [-0.24, -0.08, 0.08, 0.24].forEach((nx, idx) => {
    const label = new THREE.Mesh(
      new THREE.BoxGeometry(0.11, 0.1, 0.025),
      new THREE.MeshBasicMaterial({ color: flavorColors[idx] })
    );
    label.position.set(nx, 1.32, 0.195);
    const nozzle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.016, 0.07, 5, 1), darkMat);
    nozzle.position.set(nx, 1.2, 0.23);
    const lever = new THREE.Mesh(new THREE.BoxGeometry(0.055, 0.08, 0.015), steelMat);
    lever.position.set(nx, 1.17, 0.19);
    group.add(label, nozzle, lever);
  });

  // Interactive Soda Cup under Sprite/Cola valve (hidden until Duck puts cup in)
  const fillingCup = createPS1DrinkCupMesh(0xdc2626, 0xf4f4f5);
  fillingCup.position.set(-0.08, 0.995, 0.23);
  fillingCup.visible = false;
  group.add(fillingCup);

  const sodaStreamMat = new THREE.MeshBasicMaterial({ color: 0x86efac });
  const sodaStream = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.006, 0.14, 5, 1), sodaStreamMat);
  sodaStream.position.set(-0.08, 1.13, 0.23);
  sodaStream.visible = false;
  group.add(sodaStream);

  const sodaLight = new THREE.PointLight(0x67e8f9, 0.0, 2.5);
  sodaLight.position.set(0, 1.25, 0.34);
  group.add(sodaLight);

  group.userData.fillingCup = fillingCup;
  group.userData.sodaStream = sodaStream;
  group.userData.sodaLight = sodaLight;
  return group;
}

/** 18. PS1 Fried Chicken Bucket (5-sided bucket + crispy PS1 drumsticks) */
export function createFriedChickenBucket(): THREE.Group {
  const group = new THREE.Group();
  const bucketMat = ps1Mat({ color: 0xcc1111 });
  const yellowMat = ps1Mat({ color: 0xffbb00 });
  const rimMat = ps1Mat({ color: 0xf1f5f9 });
  const meatMat = ps1Mat({ color: 0xc47b1e });
  const batterMat = ps1Mat({ color: 0xdc8d3e });
  const boneMat = ps1Mat({ color: 0xf5f0e1 });

  const bucketBody = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.09, 0.2, 5, 1), bucketMat);
  bucketBody.position.y = 0.1;
  const yellowBand = new THREE.Mesh(new THREE.CylinderGeometry(0.116, 0.096, 0.07, 5, 1), yellowMat);
  yellowBand.position.y = 0.1;
  const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.126, 0.126, 0.016, 5, 1), rimMat);
  rim.position.y = 0.2;
  group.add(bucketBody, yellowBand, rim);

  [
    { x: -0.04, z: -0.03, rz: 0.9 },
    { x: 0.04, z: -0.02, rz: 1.2 },
    { x: 0.0, z: 0.04, rz: 1.05 },
  ].forEach((cfg) => {
    const drum = createPS1DrumstickMesh(meatMat, batterMat, boneMat, 0.85);
    drum.position.set(cfg.x, 0.21, cfg.z);
    drum.rotation.z = cfg.rz;
    group.add(drum);
  });

  return group;
}

/** 19. Fried Chicken & Potatoes Fryer Machine (With interactive basket & 3D smoke puffs) */
export function createFriedChickenVendingMachine(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = ps1Mat({ color: 0x9098a0 });
  const darkMat = ps1Mat({ color: 0x25282c });
  const wireMat = ps1Mat({ color: 0xc4c9ce });
  const glassMat = ps1Mat({ color: 0xffeedd, transparent: true, opacity: 0.5 });
  const redMat = ps1Mat({ color: 0xbb1111 });
  const goldMat = new THREE.MeshBasicMaterial({ color: 0xffbc0d });
  const oilMat = ps1Mat({ color: 0x5a3e10 });
  const chickenMat = ps1Mat({ color: 0xc47b1e });
  const potatoMat = ps1Mat({ color: 0xeab308 });
  const heatLampMat = new THREE.MeshBasicMaterial({ color: 0xff8800 });

  const fryerBase = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.92, 0.85), steelMat);
  fryerBase.position.set(0, 0.46, 0);
  const vatL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.55), oilMat);
  vatL.position.set(-0.22, 0.88, 0.05);
  const vatR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.04, 0.55), oilMat);
  vatR.position.set(0.22, 0.88, 0.05);
  group.add(fryerBase, vatL, vatR);

  // Interactive stainless wire basket containing chicken + sliced potatoes
  const fryBasket = new THREE.Group();
  fryBasket.position.set(0, 0.98, 0.14);
  const basketCageL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.34), wireMat);
  basketCageL.position.set(-0.2, 0, 0);
  const basketCageR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.1, 0.34), wireMat);
  basketCageR.position.set(0.2, 0, 0);
  const handleL = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.24), redMat);
  handleL.position.set(-0.2, 0.06, 0.26);
  const handleR = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.24), redMat);
  handleR.position.set(0.2, 0.06, 0.26);
  fryBasket.add(basketCageL, basketCageR, handleL, handleR);

  // Raw/Frying Chicken Pieces in left basket
  [
    [-0.25, 0.02, -0.05],
    [-0.15, 0.03, 0.04],
    [-0.22, 0.02, 0.08],
  ].forEach(([cx, cy, cz]) => {
    const ch = new THREE.Mesh(new THREE.OctahedronGeometry(0.048, 0), chickenMat);
    ch.position.set(cx, cy, cz);
    fryBasket.add(ch);
  });

  // Potato fries in right basket
  for (let p = 0; p < 6; p++) {
    const fry = new THREE.Mesh(new THREE.BoxGeometry(0.022, 0.09, 0.022), potatoMat);
    fry.position.set(0.14 + (p % 3) * 0.055, 0.03, -0.06 + Math.floor(p / 3) * 0.1);
    fry.rotation.z = ((p % 3) - 1) * 0.22;
    fry.rotation.x = 0.25;
    fryBasket.add(fry);
  }
  fryBasket.visible = false;
  group.add(fryBasket);
  group.userData.fryBasket = fryBasket;

  // 8 Low-Poly Rising 3D Smoke Puffs (shown & animated during 5s fry)
  const smokeMat = ps1Mat({ color: 0xe2e8f0, transparent: true, opacity: 0.52, depthWrite: false });
  const smokePuffs: THREE.Mesh[] = [];
  for (let s = 0; s < 8; s++) {
    const puff = new THREE.Mesh(new THREE.IcosahedronGeometry(0.11 + (s % 3) * 0.035, 0), smokeMat.clone());
    puff.position.set(((s % 4) - 1.5) * 0.14, 1.05 + (s % 4) * 0.16, 0.08);
    puff.visible = false;
    group.add(puff);
    smokePuffs.push(puff);
  }
  group.userData.smokePuffs = smokePuffs;

  const fryLight = new THREE.PointLight(0xff9922, 0.0, 3.2);
  fryLight.position.set(0, 1.15, 0.18);
  group.add(fryLight);
  group.userData.fryLight = fryLight;

  const warmerGroup = new THREE.Group();
  warmerGroup.position.set(0, 0.92, -0.05);
  const glassBox = new THREE.Mesh(new THREE.BoxGeometry(0.88, 0.65, 0.82), glassMat);
  glassBox.position.set(0, 0.36, 0);
  const rack1 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.72), wireMat);
  rack1.position.set(0, 0.2, 0);
  const rack2 = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.02, 0.72), wireMat);
  rack2.position.set(0, 0.46, 0);
  const canopy = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.18, 0.86), redMat);
  canopy.position.set(0, 0.78, 0);
  const signFace = new THREE.Mesh(new THREE.PlaneGeometry(0.86, 0.12), goldMat);
  signFace.position.set(0, 0.78, 0.435);
  const lamp = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.75, 5, 1), heatLampMat);
  lamp.rotation.z = Math.PI / 2;
  lamp.position.set(0, 0.66, 0);

  const bucket1 = createFriedChickenBucket();
  bucket1.scale.setScalar(0.72);
  bucket1.position.set(-0.24, 0.21, 0.1);
  const bucket2 = createFriedChickenBucket();
  bucket2.scale.setScalar(0.72);
  bucket2.position.set(0.24, 0.21, 0.1);

  [
    [-0.2, 0.5, -0.08],
    [0.0, 0.5, -0.06],
    [0.2, 0.5, -0.1],
  ].forEach(([cx, cy, cz]) => {
    const piece = new THREE.Mesh(new THREE.OctahedronGeometry(0.05, 0), chickenMat);
    piece.position.set(cx, cy, cz);
    warmerGroup.add(piece);
  });

  // Control knobs (5-sided)
  for (let k = 0; k < 3; k++) {
    const knob = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.02, 5, 1), darkMat);
    knob.rotation.x = Math.PI / 2;
    knob.position.set(-0.3 + k * 0.3, 0.62, 0.435);
    group.add(knob);
  }

  warmerGroup.add(glassBox, rack1, rack2, canopy, signFace, lamp, bucket1, bucket2);
  group.add(warmerGroup);
  return group;
}

/** 19B. Kitchen Microwave Station for Heating Big Macs (Stand + PS1 Microwave Oven) */
export function createKitchenMicrowave(): THREE.Group {
  const group = new THREE.Group();
  const standMat = ps1Mat({ color: 0x7c848c });
  const bodyMat = ps1Mat({ color: 0xdbe0e6 });
  const darkMat = ps1Mat({ color: 0x1c1f24 });
  const glassMat = ps1Mat({ color: 0x2a3542, transparent: true, opacity: 0.48, depthWrite: false });
  const ledMat = new THREE.MeshBasicMaterial({ color: 0x22ee55 });

  // Stainless steel pedestal stand
  const tableTop = new THREE.Mesh(new THREE.BoxGeometry(0.84, 0.06, 0.64), standMat);
  tableTop.position.set(0, 0.92, 0);
  group.add(tableTop);
  [
    [-0.36, -0.26],
    [0.36, -0.26],
    [-0.36, 0.26],
    [0.36, 0.26],
  ].forEach(([lx, lz]) => {
    const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.9, 5, 1), darkMat);
    leg.position.set(lx, 0.45, lz);
    group.add(leg);
  });

  // Microwave Chassis on top of stand
  const mwGroup = new THREE.Group();
  mwGroup.position.set(0, 0.95, 0);
  const outerShell = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.38, 0.46), bodyMat);
  outerShell.position.set(0, 0.19, 0);
  const cavity = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.28, 0.36), darkMat);
  cavity.position.set(-0.08, 0.19, 0.055);
  const doorFrame = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.32, 0.03), darkMat);
  doorFrame.position.set(-0.08, 0.19, 0.235);
  const doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.36, 0.22), glassMat);
  doorGlass.position.set(-0.08, 0.19, 0.252);
  const doorHandle = new THREE.Mesh(new THREE.BoxGeometry(0.025, 0.22, 0.03), standMat);
  doorHandle.position.set(0.125, 0.19, 0.262);

  // Keypad & glowing 7-seg green digital timer display
  const panel = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.32, 0.03), darkMat);
  panel.position.set(0.24, 0.19, 0.235);
  const timerLed = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.05), ledMat);
  timerLed.position.set(0.24, 0.29, 0.252);
  const startBtn = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.04, 0.015), ps1Mat({ color: 0x22c55e }));
  startBtn.position.set(0.24, 0.08, 0.252);

  // Big Mac Burger sitting on turntable inside microwave window (hidden until Duck puts it in)
  const turntable = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.13, 0.015, 6, 1), bodyMat);
  turntable.position.set(-0.08, 0.06, 0.08);
  const bigMac = createPS1BurgerMesh();
  bigMac.scale.setScalar(0.95);
  bigMac.position.set(-0.08, 0.07, 0.08);
  bigMac.visible = false;

  const mwLight = new THREE.PointLight(0xffaa33, 0.0, 2.5);
  mwLight.position.set(-0.08, 0.22, 0.28);

  mwGroup.add(outerShell, cavity, doorFrame, doorGlass, doorHandle, panel, timerLed, startBtn, turntable, bigMac, mwLight);
  group.add(mwGroup);

  group.userData.microwaveBurger = bigMac;
  group.userData.microwaveLight = mwLight;
  return group;
}

/** 20. Food Preparation Table Items */
export function createFoodPrepTableItems(): THREE.Group {
  const group = new THREE.Group();
  const ketchupMat = ps1Mat({ color: 0xcc1111 });
  const mustardMat = ps1Mat({ color: 0xf5b800 });
  const mayoMat = ps1Mat({ color: 0xfff8e7 });
  const capMat = ps1Mat({ color: 0xf0f0f0 });
  const boxMat = ps1Mat({ color: 0xd45028 });
  const tongsMat = ps1Mat({ color: 0xcfd4d8 });
  const paperMat = ps1Mat({ color: 0xffffff });

  [
    { mat: ketchupMat, x: -0.55 },
    { mat: mustardMat, x: -0.45 },
    { mat: mayoMat, x: -0.35 },
  ].forEach((b) => {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.16, 5, 1), b.mat);
    body.position.set(b.x, 0.08, -0.15);
    const neck = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.05, 5, 1), b.mat);
    neck.position.set(b.x, 0.185, -0.15);
    const tip = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.008, 0.025, 5, 1), capMat);
    tip.position.set(b.x, 0.22, -0.15);
    group.add(body, neck, tip);
  });

  for (let s = 0; s < 3; s++) {
    const box = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.045, 0.14), boxMat);
    box.position.set(-0.15, 0.025 + s * 0.045, -0.12);
    group.add(box);
  }

  const fries = createPS1FriesMesh();
  fries.position.set(0.08, 0, -0.12);
  const burger = createPS1BurgerMesh();
  burger.position.set(0.24, 0, -0.06);
  const tongs = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.008, 0.22), tongsMat);
  tongs.position.set(0.38, 0.006, -0.08);
  const wrapStack = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.015, 0.24), paperMat);
  wrapStack.position.set(0.54, 0.008, -0.06);

  group.add(fries, burger, tongs, wrapStack);
  return group;
}

/** Shared PS1 Low-Poly Human Hand Builder for First-Person Held Viewmodels */
function createPS1HumanHeldHand(side: 'left' | 'right'): THREE.Group {
  const g = new THREE.Group();
  const skinMat = ps1Mat({ color: 0xdfb18a });
  const fingerShadowMat = ps1Mat({ color: 0xc9966e });
  const cuffMat = ps1Mat({ color: 0x7f1d1d });

  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.032, 0.065, 6, 1), cuffMat);
  cuff.rotation.x = Math.PI / 2;
  cuff.position.set(0, -0.004, 0.058);

  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.026, 0.072), skinMat);
  palm.position.set(0, 0, 0);

  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.02, 0.036), fingerShadowMat);
  fingers.position.set(0, 0.006, -0.048);

  const thumb = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.016, 0.032), skinMat);
  thumb.position.set(side === 'left' ? 0.024 : -0.024, 0.01, -0.014);

  g.add(cuff, palm, fingers, thumb);
  return g;
}

/** 21. First-Person Held Meal (Uses Model 6 PS1 Burger, Fries, Drink + Bucket & Human Hands) */
export function createFirstPersonHeldMeal(): THREE.Group {
  const group = new THREE.Group();
  const trayMat = ps1Mat({ color: 0x1f2124 });
  const linerMat = ps1Mat({ color: 0xdf382b });

  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.014, 0.28), trayMat);
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.24), linerMat);
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.008;
  group.add(tray, liner);

  const bucket = createFriedChickenBucket();
  bucket.scale.setScalar(0.68);
  bucket.position.set(-0.09, 0.007, 0.01);

  const burger = createPS1BurgerMesh();
  burger.scale.setScalar(0.85);
  burger.position.set(0.01, 0.008, 0.06);

  const cup = createPS1DrinkCupMesh(0x4a2a1a, 0xffffff);
  cup.position.set(0.11, 0.007, -0.05);

  const fries = createPS1FriesMesh();
  fries.scale.setScalar(0.9);
  fries.position.set(0.11, 0.007, 0.06);

  const handL = createPS1HumanHeldHand('left');
  handL.position.set(-0.205, 0.005, 0.015);
  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.205, 0.005, 0.015);

  group.add(bucket, burger, cup, fries, handL, handR);
  return group;
}

/** 21A-2. First-Person Held Raw Chicken & Potatoes Basket (Held Before Fryer) */
export function createFirstPersonHeldRawFryItems(): THREE.Group {
  const group = new THREE.Group();
  const trayMat = ps1Mat({ color: 0xc8d0d8 });
  const wireMat = ps1Mat({ color: 0x9aa2aa });
  const rawChickenMat = ps1Mat({ color: 0xdca57a });
  const batterMat = ps1Mat({ color: 0xe6b87c });
  const potatoMat = ps1Mat({ color: 0xebd167 });

  const pan = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.024, 0.26), trayMat);
  const rim = new THREE.Mesh(new THREE.BoxGeometry(0.37, 0.012, 0.27), wireMat);
  rim.position.y = 0.014;
  group.add(pan, rim);

  // Raw chicken pieces on left side
  [
    [-0.085, 0.036, -0.04],
    [-0.115, 0.038, 0.045],
    [-0.045, 0.036, 0.03],
  ].forEach(([cx, cy, cz], idx) => {
    const ch = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.038, 0),
      idx % 2 === 0 ? rawChickenMat : batterMat
    );
    ch.scale.set(1.2, 0.72, 0.9);
    ch.position.set(cx, cy, cz);
    group.add(ch);
  });

  // Cut potato strips on right side
  for (let p = 0; p < 7; p++) {
    const strip = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.016, 0.095), potatoMat);
    strip.position.set(0.035 + (p % 4) * 0.032, 0.028 + Math.floor(p / 4) * 0.016, -0.02 + (p % 2) * 0.04);
    strip.rotation.y = (p - 3) * 0.14;
    group.add(strip);
  }

  const handL = createPS1HumanHeldHand('left');
  handL.position.set(-0.195, 0.004, 0.015);
  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.195, 0.004, 0.015);
  group.add(handL, handR);
  return group;
}

/** 21A-3. First-Person Held Big Mac Burger (Held Before Microwave) */
export function createFirstPersonHeldBigMac(): THREE.Group {
  const group = new THREE.Group();
  const wrapperMat = ps1Mat({ color: 0xf7efe0 });
  const sheet = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.008, 0.22), wrapperMat);
  sheet.position.y = 0.004;
  group.add(sheet);

  const burger = createPS1BurgerMesh();
  burger.scale.setScalar(1.22);
  burger.position.set(0, 0.008, 0);
  group.add(burger);

  const handL = createPS1HumanHeldHand('left');
  handL.position.set(-0.135, 0.008, 0.015);
  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.135, 0.008, 0.015);
  group.add(handL, handR);
  return group;
}

/** 21A-4. First-Person Held McCafé Coffee Cup (Held Before Coffee Machine) */
export function createFirstPersonHeldCoffeeCup(): THREE.Group {
  const group = new THREE.Group();
  const cup = createPS1DrinkCupMesh(0xdfd4bc, 0x1a1a1a);
  cup.scale.setScalar(1.28);
  cup.position.set(0, -0.04, 0);
  const sleeveMat = ps1Mat({ color: 0x5c341f });
  const sleeve = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.04, 0.055, 5, 1), sleeveMat);
  sleeve.position.set(0, 0.02, 0);
  group.add(cup, sleeve);

  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.055, 0.01, 0.015);
  handR.rotation.z = 0.25;
  group.add(handR);
  return group;
}

/** 21A-5. First-Person Held Soda Cup (Held Before Soft Drink Dispenser) */
export function createFirstPersonHeldSodaCup(): THREE.Group {
  const group = new THREE.Group();
  const cup = createPS1DrinkCupMesh(0xdc2626, 0xf4f4f5);
  cup.scale.setScalar(1.28);
  cup.position.set(0, -0.04, 0);
  const stripeMat = ps1Mat({ color: 0xfacc15 });
  const stripe = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.041, 0.036, 5, 1), stripeMat);
  stripe.position.set(0, 0.03, 0);
  group.add(cup, stripe);

  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.055, 0.01, 0.015);
  handR.rotation.z = 0.25;
  group.add(handR);
  return group;
}

/** 21B. First-Person Held Commercial Mop (Human Hand Grip) */
export function createFirstPersonHeldMop(): THREE.Group {
  const group = new THREE.Group();
  const handleMat = ps1Mat({ color: 0x4a7c59 });
  const clampMat = ps1Mat({ color: 0x1c1e1f });
  const strandMat = ps1Mat({ color: 0xe2e2dc });
  const skinMat = ps1Mat({ color: 0xdfb18a });
  const fingerShadowMat = ps1Mat({ color: 0xc9966e });
  const cuffMat = ps1Mat({ color: 0x7f1d1d });

  const polePivot = new THREE.Group();
  polePivot.rotation.set(-0.55, 0.12, 0.12);
  const stick = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 1.15, 5, 1), handleMat);
  stick.position.y = -0.15;
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.1, 5, 1), clampMat);
  grip.position.y = 0.42;

  const cuff = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.03, 0.06, 6, 1), cuffMat);
  cuff.position.set(0.02, 0.11, 0.025);
  const hand = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.075, 0.048), skinMat);
  hand.position.set(0.01, 0.17, 0.01);
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.044, 0.06, 0.024), fingerShadowMat);
  fingers.position.set(-0.012, 0.17, -0.022);

  const clamp = new THREE.Mesh(new THREE.BoxGeometry(0.11, 0.05, 0.055), clampMat);
  clamp.position.y = -0.71;
  const mopCore = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.095, 0.18, 5, 1), strandMat);
  mopCore.position.y = -0.81;

  polePivot.add(stick, grip, cuff, hand, fingers, clamp, mopCore);
  group.add(polePivot);
  return group;
}

/** Dining Booth Meal Spread */
export function createBoothMealTray(): THREE.Group {
  const group = new THREE.Group();
  const tray = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.016, 0.36), ps1Mat({ color: 0x1f2124 }));
  const liner = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.3), ps1Mat({ color: 0xdf382b }));
  liner.rotation.x = -Math.PI / 2;
  liner.position.y = 0.009;
  group.add(tray, liner);

  const bucket = createFriedChickenBucket();
  bucket.scale.setScalar(0.8);
  bucket.position.set(0, 0.008, 0);
  group.add(bucket);

  [
    [-0.19, 0.08],
    [0.19, 0.08],
    [-0.17, -0.09],
  ].forEach(([cx, cz]) => {
    const cup = createPS1DrinkCupMesh(0x4a2a1a, 0xffffff);
    cup.position.set(cx, 0.008, cz);
    group.add(cup);
  });

  const fries = createPS1FriesMesh();
  fries.position.set(0.18, 0.008, -0.08);
  group.add(fries);
  return group;
}

/** Exterior Main Electrical Breaker Box */
export function createElectricalBox(): {
  group: THREE.Group;
  lever: THREE.Group;
  statusLedMat: THREE.MeshBasicMaterial;
  beaconLight: THREE.PointLight;
} {
  const group = new THREE.Group();
  const cabinetMat = ps1Mat({ color: 0x4b535b });
  const doorMat = ps1Mat({ color: 0x5c656e });
  const conduitMat = ps1Mat({ color: 0x7e8790 });
  const darkMat = ps1Mat({ color: 0x1b1e22 });
  const leverMat = ps1Mat({ color: 0xd92626 });
  const hazardMat = ps1Mat({ map: createWarningSignTexture('WARNING') });

  const boot = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.14, 0.18), darkMat);
  boot.position.set(0, 0.07, 0.04);
  const condL = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.12, 5, 1), conduitMat);
  condL.position.set(-0.14, 0.56, 0.03);
  const condR = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.028, 1.12, 5, 1), conduitMat);
  condR.position.set(0.14, 0.56, 0.03);
  const condUp = new THREE.Mesh(new THREE.CylinderGeometry(0.034, 0.034, 1.05, 5, 1), conduitMat);
  condUp.position.set(0, 2.25, 0.03);
  const cabinet = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.72, 0.24), cabinetMat);
  cabinet.position.set(0, 1.38, 0.08);
  const door = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.64, 0.035), doorMat);
  door.position.set(0, 1.38, 0.21);
  const warnSticker = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.18), hazardMat);
  warnSticker.position.set(0, 1.48, 0.229);

  const statusLedMat = new THREE.MeshBasicMaterial({ color: 0x22ee55 });
  const statusLed = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.02), statusLedMat);
  statusLed.position.set(0.15, 1.62, 0.235);

  const lever = new THREE.Group();
  lever.position.set(0.29, 1.44, 0.08);
  const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.032, 0.032, 0.04, 5, 1), darkMat);
  hub.rotation.z = Math.PI / 2;
  const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.18, 5, 1), conduitMat);
  arm.position.set(0.03, 0.09, 0);
  const grip = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 0.09, 5, 1), leverMat);
  grip.rotation.z = Math.PI / 2;
  grip.position.set(0.06, 0.18, 0);
  lever.add(hub, arm, grip);
  lever.rotation.x = 0.55;

  const beaconLight = new THREE.PointLight(0xff2222, 0.0, 2.8);
  beaconLight.position.set(0.15, 1.62, 0.35);

  group.add(boot, condL, condR, condUp, cabinet, door, warnSticker, statusLed, lever, beaconLight);
  return { group, lever, statusLedMat, beaconLight };
}

/** Fiberglass Waving Clown Statue (Cheerful Welcome Face + PS1 tapered limbs) */
export function createWelcomingClownStatue(): THREE.Group {
  const group = new THREE.Group();
  const plinthRedMat = ps1Mat({ color: 0x991b1b });
  const goldMat = ps1Mat({ color: 0xfacc15 });
  const suitYellowMat = ps1Mat({ color: 0xf5b800 });
  const redMat = ps1Mat({ color: 0xc8102e });
  const whiteMat = ps1Mat({ color: 0xf5f2e9 });
  const blackMat = ps1Mat({ color: 0x151518 });
  const hairMat = ps1Mat({ color: 0xb91c1c });
  const clownHeadMat = createPS1HeadMaterial(createPS1WelcomeClownFaceTexture(), 0.28);

  // 6-sided pedestal
  const baseLower = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.45, 0.14, 6, 1), plinthRedMat);
  baseLower.position.y = 0.07;
  const goldRing = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.03, 6, 1), goldMat);
  goldRing.position.y = 0.155;
  const baseUpper = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.39, 0.05, 6, 1), whiteMat);
  baseUpper.position.y = 0.195;
  group.add(baseLower, goldRing, baseUpper);

  const statue = new THREE.Group();
  statue.position.y = 0.22;
  group.add(statue);

  const shoeGeo = new THREE.BoxGeometry(0.16, 0.11, 0.36);
  const shoeL = new THREE.Mesh(shoeGeo, redMat);
  shoeL.position.set(-0.14, 0.055, 0.07);
  shoeL.rotation.y = 0.12;
  const shoeR = new THREE.Mesh(shoeGeo, redMat);
  shoeR.position.set(0.14, 0.055, 0.07);
  shoeR.rotation.y = -0.12;
  const legL = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.068, 0.68, 6, 1), suitYellowMat);
  legL.position.set(-0.13, 0.44, 0);
  const legR = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.068, 0.68, 6, 1), suitYellowMat);
  legR.position.set(0.13, 0.44, 0);
  statue.add(shoeL, shoeR, legL, legR);

  const pelvis = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.2, 8, 1), suitYellowMat);
  pelvis.scale.set(1.06, 1.0, 0.72);
  pelvis.position.set(0, 0.84, 0);
  const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.175, 0.5, 8, 1), suitYellowMat);
  chest.scale.set(1.06, 1.0, 0.74);
  chest.position.set(0, 1.15, 0);
  const bib = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.44, 0.03), redMat);
  bib.position.set(0, 1.16, 0.16);
  const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.15, 0.08, 8, 1), whiteMat);
  collar.position.set(0, 1.42, 0);
  statue.add(pelvis, chest, bib, collar);

  // Sculpted Low-Poly Clown Head + 4-Sided Red Nose + Spiky Temple Hair Clusters
  const headGroup = new THREE.Group();
  headGroup.position.set(0, 1.60, 0.02);
  headGroup.rotation.z = -0.05;
  const head = new THREE.Mesh(buildSculptedPS1HeadGeometry(0.175, 'clown'), clownHeadMat);
  const statueNose = createPS1NoseMesh(0.175, redMat);

  const hairL = new THREE.Mesh(new THREE.IcosahedronGeometry(0.105, 0), hairMat);
  hairL.scale.set(0.88, 1.22, 1.02);
  hairL.rotation.z = 0.22;
  hairL.position.set(-0.16, 0.07, -0.02);
  const hairR = new THREE.Mesh(new THREE.IcosahedronGeometry(0.105, 0), hairMat);
  hairR.scale.set(0.88, 1.22, 1.02);
  hairR.rotation.z = -0.22;
  hairR.position.set(0.16, 0.07, -0.02);
  const hatBrim = new THREE.Mesh(new THREE.BoxGeometry(0.19, 0.02, 0.19), blackMat);
  hatBrim.position.set(0, 0.215, -0.01);
  const hatCrown = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.065, 0.13), suitYellowMat);
  hatCrown.position.set(0, 0.25, -0.01);
  headGroup.add(head, statueNose, hairL, hairR, hatBrim, hatCrown);
  statue.add(headGroup);

  // Tapered 6-sided Arms (Right raised waving)
  const armL = new THREE.Group();
  armL.position.set(-0.27, 1.33, 0);
  armL.rotation.z = 0.22;
  const sleeveL = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.048, 0.5, 6, 1), redMat);
  sleeveL.position.y = -0.25;
  const gloveL = new THREE.Mesh(new THREE.CylinderGeometry(0.048, 0.038, 0.11, 6, 1), whiteMat);
  gloveL.position.y = -0.52;
  armL.add(sleeveL, gloveL);

  const armR = new THREE.Group();
  armR.position.set(0.27, 1.35, 0.02);
  armR.rotation.z = 2.05;
  armR.rotation.x = -0.2;
  const sleeveR = new THREE.Mesh(new THREE.CylinderGeometry(0.068, 0.048, 0.5, 6, 1), suitYellowMat);
  sleeveR.position.y = -0.25;
  const palmR = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.042, 0.12, 6, 1), whiteMat);
  palmR.position.y = -0.52;
  armR.add(sleeveR, palmR);

  statue.add(armL, armR);
  return group;
}

/** Warehouse Rack, Restroom Stall/Sink/Sign, Indoor Trash Bin */
export function createWarehouseSupplyRack(): THREE.Group {
  const group = new THREE.Group();
  const steelMat = ps1Mat({ color: 0x5c636a });
  const boxMat = ps1Mat({ color: 0x9b7247 });
  const redMat = ps1Mat({ color: 0xdc2626 });

  [
    [-0.75, -0.24],
    [0.75, -0.24],
    [-0.75, 0.24],
    [0.75, 0.24],
  ].forEach(([px, pz]) => {
    const p = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.9, 0.04), steelMat);
    p.position.set(px, 0.95, pz);
    group.add(p);
  });

  [0.18, 0.88, 1.56].forEach((sy) => {
    const s = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.035, 0.52), steelMat);
    s.position.set(0, sy, 0);
    group.add(s);
  });

  const b1 = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.42, 0.42), boxMat);
  b1.position.set(-0.4, 0.41, 0);
  const b2 = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.38, 0.42), boxMat);
  b2.position.set(0.32, 0.39, 0);
  const b3 = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.36, 0.42), boxMat);
  b3.position.set(-0.32, 1.08, 0);
  const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.63, 0.06, 0.43), redMat);
  stripe.position.set(-0.32, 1.12, 0);
  group.add(b1, b2, b3, stripe);
  return group;
}

export function createRestroomToiletStall(): THREE.Group {
  const group = new THREE.Group();
  const partMat = ps1Mat({ color: 0x3b444e });
  const hwMat = ps1Mat({ color: 0xcbd5e1 });
  const porcMat = ps1Mat({ color: 0xe9eef2 });
  const seatMat = ps1Mat({ color: 0xd8dee4 });
  const waterMat = ps1Mat({ color: 0x2c6e85 });

  const sidePanel = new THREE.Mesh(new THREE.BoxGeometry(1.55, 1.85, 0.055), partMat);
  sidePanel.position.set(0.05, 1.12, -0.72);
  const pilaster = new THREE.Mesh(new THREE.BoxGeometry(0.08, 2.05, 0.18), partMat);
  pilaster.position.set(0.82, 1.025, -0.66);
  const doorPivot = new THREE.Group();
  doorPivot.position.set(0.82, 0.22, -0.58);
  doorPivot.rotation.y = 0.55;
  const doorLeaf = new THREE.Mesh(new THREE.BoxGeometry(0.045, 1.8, 0.85), partMat);
  doorLeaf.position.set(0, 0.9, 0.425);
  doorPivot.add(doorLeaf);
  group.add(sidePanel, pilaster, doorPivot);

  const toilet = new THREE.Group();
  toilet.position.set(-0.22, 0, 0.05);
  const plinth = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.21, 0.16, 5, 1), porcMat);
  plinth.position.y = 0.08;
  const bowl = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.16, 0.28, 5, 1), porcMat);
  bowl.position.set(0.06, 0.3, 0);
  const water = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.12, 0.02, 5, 1), waterMat);
  water.position.set(0.06, 0.43, 0);
  const seat = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.03, 0.38), seatMat);
  seat.position.set(0.06, 0.45, 0);
  const tank = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.42, 0.46), porcMat);
  tank.position.set(-0.26, 0.68, 0);
  const handle = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.025, 0.025), hwMat);
  handle.position.set(-0.18, 0.83, 0.25);
  toilet.add(plinth, bowl, water, seat, tank, handle);
  group.add(toilet);

  return group;
}

export function createRestroomSinkAndMirror(): THREE.Group {
  const group = new THREE.Group();
  const counterMat = ps1Mat({ color: 0x5d646b });
  const porcMat = ps1Mat({ color: 0xedf2f5 });
  const chromeMat = ps1Mat({ color: 0xd8dee6 });
  const mirrorMat = ps1Mat({ color: 0x9fb8c9 });
  const darkMat = ps1Mat({ color: 0x1e2226 });

  const slab = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.08, 0.56), counterMat);
  slab.position.set(0, 0.86, 0.28);
  const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 0.76, 5, 1), chromeMat);
  pipe.position.set(0, 0.38, 0.22);
  const basin = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.18, 0.14, 5, 1), porcMat);
  basin.position.set(0, 0.84, 0.3);
  const faucet = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.16, 0.12), chromeMat);
  faucet.position.set(0, 0.98, 0.15);
  const mirrorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.95, 0.04), darkMat);
  mirrorFrame.position.set(0, 1.58, 0.02);
  const mirrorGlass = new THREE.Mesh(new THREE.PlaneGeometry(1.18, 0.88), mirrorMat);
  mirrorGlass.position.set(0, 1.58, 0.042);
  group.add(slab, pipe, basin, faucet, mirrorFrame, mirrorGlass);
  return group;
}

export function createRestroomDoorSign(): THREE.Group {
  const group = new THREE.Group();
  const frame = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.22, 0.04), ps1Mat({ color: 0x162438 }));
  const face = new THREE.Mesh(
    new THREE.PlaneGeometry(0.5, 0.19),
    new THREE.MeshBasicMaterial({ map: createRestroomSignTexture() })
  );
  face.position.z = 0.022;
  group.add(frame, face);
  return group;
}

export function createIndoorTrashBin(): THREE.Group {
  const group = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.78, 0.48), ps1Mat({ color: 0x26292e }));
  body.position.y = 0.39;
  const hood = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.28, 0.5), ps1Mat({ color: 0x991b1b }));
  hood.position.y = 0.92;
  const flap = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.04), ps1Mat({ color: 0x15171a }));
  flap.position.set(0, 0.9, 0.24);
  group.add(body, hood, flap);
  return group;
}

/** Freezer Chicken Drumstick Tray Pickup & Held Viewmodel */
export function createFreezerChickenTrayPickup(): THREE.Group {
  const group = new THREE.Group();
  const rackMat = ps1Mat({ color: 0x94a3b8 });
  const trayMat = ps1Mat({ color: 0xdbeafe });
  const meatMat = ps1Mat({ color: 0xc9762e });
  const batterMat = ps1Mat({ color: 0xdc8d3e });
  const boneMat = ps1Mat({ color: 0xf5efe2 });
  const frostMat = ps1Mat({ color: 0xe0f2fe, emissive: 0x0284c7, emissiveIntensity: 0.25 });
  const tagMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

  const cartTop = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.65), rackMat);
  cartTop.position.y = 0.82;
  group.add(cartTop);

  const legGeo = new THREE.CylinderGeometry(0.028, 0.028, 0.82, 5, 1);
  [
    [-0.38, 0.41, -0.25],
    [0.38, 0.41, -0.25],
    [-0.38, 0.41, 0.25],
    [0.38, 0.41, 0.25],
  ].forEach(([lx, ly, lz]) => {
    const leg = new THREE.Mesh(legGeo, rackMat);
    leg.position.set(lx, ly, lz);
    group.add(leg);
  });

  const trayBase = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.09, 0.44), trayMat);
  trayBase.position.y = 0.89;
  const frostSheet = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.02, 0.4), frostMat);
  frostSheet.position.y = 0.94;
  group.add(trayBase, frostSheet);

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const drumstick = createPS1DrumstickMesh(meatMat, batterMat, boneMat, 1.05);
      drumstick.position.set(-0.2 + col * 0.132, 0.985, -0.095 + row * 0.185);
      drumstick.rotation.y = row === 0 ? -Math.PI / 2 + 0.15 : Math.PI / 2 - 0.15;
      group.add(drumstick);
    }
  }

  const tag = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.04, 0.02), tagMat);
  tag.position.set(0, 0.89, 0.23);
  const beacon = new THREE.PointLight(0x38bdf8, 0.65, 3.0);
  beacon.position.set(0, 1.35, 0);
  group.add(tag, beacon);

  return group;
}

export function createFirstPersonHeldChickenTray(): THREE.Group {
  const group = new THREE.Group();
  const trayMat = ps1Mat({ color: 0xdce6f2 });
  const frostMat = ps1Mat({ color: 0xe0f2fe, emissive: 0x0ea5e9, emissiveIntensity: 0.18 });
  const meatMat = ps1Mat({ color: 0xc9762e });
  const batterMat = ps1Mat({ color: 0xdf9444 });
  const boneMat = ps1Mat({ color: 0xf5efe2 });

  const trayBottom = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.028, 0.3), trayMat);
  const frostLiner = new THREE.Mesh(new THREE.PlaneGeometry(0.38, 0.26), frostMat);
  frostLiner.rotation.x = -Math.PI / 2;
  frostLiner.position.y = 0.016;
  group.add(trayBottom, frostLiner);

  for (let row = 0; row < 2; row++) {
    for (let col = 0; col < 4; col++) {
      const drumstick = createPS1DrumstickMesh(meatMat, batterMat, boneMat, 0.72);
      drumstick.position.set(-0.128 + col * 0.085, 0.042, -0.058 + row * 0.116);
      drumstick.rotation.y = row === 0 ? -Math.PI / 2 + 0.2 : Math.PI / 2 - 0.2;
      group.add(drumstick);
    }
  }

  const handL = createPS1HumanHeldHand('left');
  handL.position.set(-0.228, 0.01, 0.015);
  const handR = createPS1HumanHeldHand('right');
  handR.position.set(0.228, 0.01, 0.015);
  group.add(handL, handR);

  return group;
}

/** 28. Drive-Thru Exterior Canopy & Menu Post */
export function createDriveThruExteriorRig(): THREE.Group {
  const group = new THREE.Group();
  const postMat = ps1Mat({ color: 0x1e2226 });
  const redMat = ps1Mat({ color: 0xa61c1c });
  const yellowMat = new THREE.MeshBasicMaterial({ color: 0xffc312 });
  const menuMat = new THREE.MeshBasicMaterial({ color: 0x111827 });

  const awningRoof = new THREE.Mesh(new THREE.BoxGeometry(1.7, 0.12, 2.8), redMat);
  awningRoof.position.set(0.85, 2.85, 0);
  awningRoof.rotation.z = -0.14;
  const awningTrim = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.14, 2.82), yellowMat);
  awningTrim.position.set(1.68, 2.74, 0);
  group.add(awningRoof, awningTrim);

  const speakerPost = new THREE.Group();
  speakerPost.position.set(0.65, 0, 6.2);
  const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.07, 1.45, 5, 1), postMat);
  pole.position.y = 0.725;
  const board = new THREE.Mesh(new THREE.BoxGeometry(0.14, 1.35, 1.05), postMat);
  board.position.set(0, 1.45, 0);
  const menuGlow = new THREE.Mesh(new THREE.PlaneGeometry(0.9, 1.15), menuMat);
  menuGlow.position.set(0.08, 1.45, 0);
  menuGlow.rotation.y = Math.PI / 2;
  const banner = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.22, 1.08), redMat);
  banner.position.set(0, 2.02, 0);
  const menuLight = new THREE.PointLight(0xfff0c2, 0.65, 5.5);
  menuLight.position.set(0.65, 1.7, 0);
  speakerPost.add(pole, board, menuGlow, banner, menuLight);
  group.add(speakerPost);

  return group;
}

/** 30. Convenience Store Noodles, Water & Red Energy Drink Bottle Stall (All 5-sided / Box <=10 faces) */
export function createNoodlesAndWaterStall(): THREE.Group {
  const group = new THREE.Group();
  const frameMat = ps1Mat({ color: 0xe5e7eb });
  const shelfMat = ps1Mat({ color: 0xf8fafc });
  const greenMat = ps1Mat({ color: 0x15803d });
  const orangeMat = ps1Mat({ color: 0xf97316 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.72), greenMat);
  base.position.set(0, 0.09, 0);
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.9, 0.06), frameMat);
  backPanel.position.set(0, 1.04, 0);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.72), frameMat);
  sideL.position.set(-1.05, 1.0, 0);
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 2.0, 0.72), frameMat);
  sideR.position.set(1.05, 1.0, 0);
  group.add(base, backPanel, sideL, sideR);

  const signFaceMat = new THREE.MeshBasicMaterial({ map: createNoodlesWaterSignTexture() });
  const headerBox = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.42, 0.14), greenMat);
  headerBox.position.set(0, 2.15, 0);
  const signFront = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 0.36), signFaceMat);
  signFront.position.set(0, 2.15, 0.075);
  const signBack = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 0.36), signFaceMat);
  signBack.position.set(0, 2.15, -0.075);
  signBack.rotation.y = Math.PI;
  group.add(headerBox, signFront, signBack);

  [0.42, 0.86, 1.3, 1.72].forEach((y) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.68), shelfMat);
    shelf.position.set(0, y, 0);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.03, 0.7), orangeMat);
    lip.position.set(0, y - 0.015, 0);
    group.add(shelf, lip);
  });

  const waterMat = ps1Mat({ color: 0xbfe9ff, transparent: true, opacity: 0.85 });
  const waterCapMat = ps1Mat({ color: 0x0369a1 });
  const energyBottleMat = ps1Mat({ color: 0xdc2626 });
  const energyCapMat = ps1Mat({ color: 0xfef08a });
  const cupBodyMat = ps1Mat({ color: 0xfff8ed });
  const cupRedMat = ps1Mat({ color: 0xdc2626 });
  const cupGoldMat = ps1Mat({ color: 0xf59e0b });

  // 5-sided Noodle Cups
  for (const sy of [1.32, 1.74]) {
    for (let x = -0.84; x <= -0.3; x += 0.21) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.04, 0.125, 5, 1), cupBodyMat);
      cup.position.set(x, sy + 0.065, 0.18);
      const band = new THREE.Mesh(
        new THREE.CylinderGeometry(0.053, 0.047, 0.045, 5, 1),
        Math.abs(Math.round(x * 10)) % 2 === 0 ? cupGoldMat : cupRedMat
      );
      band.position.set(x, sy + 0.072, 0.18);
      group.add(cup, band);
    }
  }

  // 5-sided Water Bottles
  for (const sy of [0.44, 0.88, 1.32, 1.74]) {
    for (let x = -0.14; x <= 0.24; x += 0.18) {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.13, 5, 1), waterMat);
      body.position.set(x, sy + 0.065, 0.18);
      const neck = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.045, 5, 1), waterMat);
      neck.position.set(x, sy + 0.15, 0.18);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.017, 0.017, 0.022, 5, 1), waterCapMat);
      cap.position.set(x, sy + 0.18, 0.18);
      group.add(body, neck, cap);
    }
  }

  // 5-sided Red Energy Drink Bottles (distinct bottle shape)
  for (const sy of [0.44, 0.88, 1.32, 1.74]) {
    for (let x = 0.4; x <= 0.88; x += 0.16) {
      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.037, 0.12, 5, 1), energyBottleMat);
      body.position.set(x, sy + 0.06, 0.18);
      const neck = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.045, 5, 1), energyBottleMat);
      neck.position.set(x, sy + 0.142, 0.18);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.022, 5, 1), energyCapMat);
      cap.position.set(x, sy + 0.172, 0.18);
      group.add(body, neck, cap);
    }
  }

  const stallLight = new THREE.PointLight(0xfffbeb, 0.72, 5.5);
  stallLight.position.set(0, 2.5, 0.35);
  group.add(stallLight);
  return group;
}

/** 31. First-Person Viewmodel: Cup Noodles + Red Energy Drink Bottle (Human Hands) */
export function createFirstPersonHeldNoodlesAndDrink(): THREE.Group {
  const group = new THREE.Group();
  const skinMat = ps1Mat({ color: 0xdfb18a });
  const fingerMat = ps1Mat({ color: 0xc9966e });
  const cuffMat = ps1Mat({ color: 0x7f1d1d });
  const cupBodyMat = ps1Mat({ color: 0xfff8ed });
  const cupBandMat = ps1Mat({ color: 0xdc2626 });
  const cupLidMat = ps1Mat({ color: 0xf59e0b });
  const bottleRedMat = ps1Mat({ color: 0xdc2626 });
  const bottleCapMat = ps1Mat({ color: 0xfef08a });
  const bottleBandMat = ps1Mat({ color: 0x18181b });

  const cupGroup = new THREE.Group();
  cupGroup.position.set(-0.065, 0.02, 0.01);
  const cupBody = new THREE.Mesh(new THREE.CylinderGeometry(0.052, 0.039, 0.115, 5, 1), cupBodyMat);
  const cupBand = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.045, 0.045, 5, 1), cupBandMat);
  cupBand.position.y = 0.006;
  const cupLid = new THREE.Mesh(new THREE.CylinderGeometry(0.054, 0.054, 0.012, 5, 1), cupLidMat);
  cupLid.position.y = 0.062;
  cupGroup.add(cupBody, cupBand, cupLid);
  group.add(cupGroup);

  const bottleGroup = new THREE.Group();
  bottleGroup.position.set(0.058, 0.018, -0.01);
  const bottleBody = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.037, 0.108, 5, 1), bottleRedMat);
  const bottleShoulder = new THREE.Mesh(new THREE.ConeGeometry(0.035, 0.044, 5, 1), bottleRedMat);
  bottleShoulder.position.y = 0.076;
  const bottleCap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.024, 5, 1), bottleCapMat);
  bottleCap.position.y = 0.106;
  const bottleBand = new THREE.Mesh(new THREE.CylinderGeometry(0.038, 0.038, 0.04, 5, 1), bottleBandMat);
  bottleBand.position.y = 0.012;
  bottleGroup.add(bottleBody, bottleShoulder, bottleCap, bottleBand);
  group.add(bottleGroup);

  const cuff = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.03, 0.055), cuffMat);
  cuff.position.set(-0.005, -0.058, 0.06);
  const palm = new THREE.Mesh(new THREE.BoxGeometry(0.155, 0.026, 0.085), skinMat);
  palm.position.set(-0.005, -0.05, 0.004);
  const fingers = new THREE.Mesh(new THREE.BoxGeometry(0.145, 0.022, 0.036), fingerMat);
  fingers.position.set(-0.005, -0.036, -0.044);
  group.add(cuff, palm, fingers);
  return group;
}

/** 32. 67-Eleven Convenience Store Snack Rack (Single-Box Colorful Snack & Drink Items) */
export function createConvenienceSnackRack(withHeader: boolean = true): THREE.Group {
  const group = new THREE.Group();
  const frameMat = ps1Mat({ color: 0xe5e7eb });
  const shelfMat = ps1Mat({ color: 0xf8fafc });
  const greenMat = ps1Mat({ color: 0x15803d });
  const redMat = ps1Mat({ color: 0xdc2626 });

  const base = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.18, 0.72), greenMat);
  base.position.set(0, 0.09, 0);
  const backPanel = new THREE.Mesh(new THREE.BoxGeometry(2.05, 1.85, 0.06), frameMat);
  backPanel.position.set(0, 1.02, 0);
  const sideL = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.95, 0.72), frameMat);
  sideL.position.set(-1.05, 0.98, 0);
  const sideR = new THREE.Mesh(new THREE.BoxGeometry(0.06, 1.95, 0.72), frameMat);
  sideR.position.set(1.05, 0.98, 0);
  group.add(base, backPanel, sideL, sideR);

  if (withHeader) {
    const signFaceMat = new THREE.MeshBasicMaterial({ map: create67SnackSignTexture() });
    const headerBox = new THREE.Mesh(new THREE.BoxGeometry(2.14, 0.38, 0.14), redMat);
    headerBox.position.set(0, 2.08, 0);
    const signFront = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 0.32), signFaceMat);
    signFront.position.set(0, 2.08, 0.075);
    const signBack = new THREE.Mesh(new THREE.PlaneGeometry(2.02, 0.32), signFaceMat);
    signBack.position.set(0, 2.08, -0.075);
    signBack.rotation.y = Math.PI;
    group.add(headerBox, signFront, signBack);
  }

  const shelfHeights = [0.42, 0.86, 1.3, 1.7];
  shelfHeights.forEach((y) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.04, 0.68), shelfMat);
    shelf.position.set(0, y, 0);
    const lip = new THREE.Mesh(new THREE.BoxGeometry(2.0, 0.03, 0.7), redMat);
    lip.position.set(0, y - 0.015, 0);
    group.add(shelf, lip);
  });

  const itemMats = [0xef4444, 0xf59e0b, 0x22c55e, 0x3b82f6, 0xa855f7, 0xec4899].map((c) =>
    ps1Mat({ color: c })
  );

  // Single-box colorful snack & drink items
  for (let sIdx = 0; sIdx < shelfHeights.length; sIdx++) {
    const sy = shelfHeights[sIdx] + 0.02;
    for (let i = 0; i < 8; i++) {
      const x = -0.82 + i * 0.235;
      for (const zOff of [-0.18, 0.18]) {
        const mat = itemMats[(sIdx * 3 + i) % itemMats.length];
        const box = new THREE.Mesh(new THREE.BoxGeometry(0.14, sIdx === 0 ? 0.22 : 0.16, 0.1), mat);
        box.position.set(x, sy + (sIdx === 0 ? 0.11 : 0.08), zOff);
        group.add(box);
      }
    }
  }

  return group;
}

/** 33. Back Wall Beverage Cooler Stock (5-sided bottles) */
export function createConvenienceCoolerStock(): THREE.Group {
  const group = new THREE.Group();
  const shelfMat = ps1Mat({ color: 0xe2e8f0 });
  const waterMat = ps1Mat({ color: 0x93c5fd, transparent: true, opacity: 0.85 });
  const blueCapMat = ps1Mat({ color: 0x0284c7 });
  const redMat = ps1Mat({ color: 0xdc2626 });
  const greenMat = ps1Mat({ color: 0x16a34a });
  const goldCapMat = ps1Mat({ color: 0xfef08a });

  [0.45, 0.92, 1.38, 1.82].forEach((sy) => {
    const rack = new THREE.Mesh(new THREE.BoxGeometry(6.6, 0.03, 0.45), shelfMat);
    rack.position.set(0, sy, 0);
    group.add(rack);

    for (let x = -3.0; x <= 3.0; x += 0.28) {
      const isWater = x < -0.7;
      const isRed = x >= -0.7 && x <= 1.5;
      const bMat = isWater ? waterMat : isRed ? redMat : greenMat;
      const cMat = isWater ? blueCapMat : goldCapMat;

      const body = new THREE.Mesh(new THREE.CylinderGeometry(0.036, 0.038, 0.14, 5, 1), bMat);
      body.position.set(x, sy + 0.085, 0);
      const shoulder = new THREE.Mesh(new THREE.ConeGeometry(0.036, 0.04, 5, 1), bMat);
      shoulder.position.set(x, sy + 0.175, 0);
      const cap = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, 0.02, 5, 1), cMat);
      cap.position.set(x, sy + 0.205, 0);
      group.add(body, shoulder, cap);
    }
  });

  return group;
}
