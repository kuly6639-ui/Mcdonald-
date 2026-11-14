import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { soundEngine } from '../audio/SoundEngine';
import {
  GameNight,
  GameScreen,
  GameSettings,
  ObjectiveStep,
  PlayerStats,
  NightState,
  InteractiveItem,
  CustomerCar,
  CustomerPerson,
  DialogueLine,
  DialogueState,
} from '../types/game';
import {
  buildCompactRestaurantWorld,
  RestaurantWorld,
  ParkingSpot,
} from './world';
import {
  createDetailedCar,
  createCustomerCharacter,
  createFirstPersonHeldMeal,
  createFirstPersonHeldMop,
  createBoothMealTray,
} from './props';
import { createSmilingJester, MascotCharacter } from './mascots';
import { populateSurroundingForest } from './forest';
import { getTranslations } from '../i18n/translations';

export interface GameEngineCallbacks {
  onScreenChange: (screen: GameScreen) => void;
  onActiveObjectiveUpdate: (step: ObjectiveStep | null) => void;
  onObjectiveCompletedNotice: (title: string | null) => void;
  onPlayerStatsUpdate: (stats: PlayerStats) => void;
  onNightStateUpdate: (state: NightState) => void;
  onInteractionPrompt: (prompt: string | null) => void;
  onDialogueUpdate: (dialogue: DialogueState) => void;
  onFadeAlphaUpdate: (alpha: number) => void;
}

const PUDDLE_IDS = [
  'hallway_spill',
  'dirty_puddle_2',
  'dirty_puddle_3',
  'dirty_puddle_4',
  'dirty_puddle_5',
  'dirty_puddle_6',
  'dirty_puddle_7',
  'dirty_puddle_8',
];

// Strict mapping of active objective IDs to allowed interactive item IDs
const STEP_ALLOWED_ITEMS: Record<string, string[]> = {
  // Night 1 (Starts with talking to John to take over the shift; cold storage removed)
  'talk_to_john': ['employee_john'],
  'clock_in': ['time_clock'],
  'clean_tables': ['clean_table_1', 'clean_table_2'],
  'mop_puddles': ['mop_tool', ...PUDDLE_IDS],
  'collect_trash': ['trash_bag_1', 'trash_bag_2'],
  'dump_trash': ['outdoor_dumpster'],
  'kitchen_fryers': ['kitchen_switch'],
  'check_cctv': ['cctv_monitor'],
  'finish_shift': ['front_door_exit', 'kitchen_prep_station'],
  'prep_order': ['kitchen_prep_station'],

  // Night 2 (John handover -> tasks -> finish shift at 6:00 AM)
  'n2_clock_in': ['time_clock'],
  'n2_breaker': ['office_switch'],
  'n2_mop_puddle': ['mop_tool', ...PUDDLE_IDS],
  'n2_cardboard': ['cardboard_bundle', 'outdoor_dumpster'],
  'n2_drive_thru': ['drive_thru_order_station'],
  'n2_cctv_final': ['cctv_monitor'],
};

// Customer NPC Archetypes with distinct personalities, orders & Duck's employee dialogues
export interface CustomerArchetype {
  name: string;
  title: string;
  orderItem: string;
  dialogue: DialogueLine[];
}

export const CUSTOMER_ARCHETYPES: CustomerArchetype[] = [
  // 1. Exhausted Night-Shift Worker
  {
    name: 'Nurse Ramirez',
    title: 'Exhausted Night-Shift Worker',
    orderItem: 'Big Mac Meal with Hot McCafé Coffee & Fries',
    dialogue: [
      { speaker: 'Nurse Ramirez', text: 'Hey... please tell me the coffee pot is still hot. Just wrapped a brutal 14-hour ER shift.' },
      { speaker: 'Duck', text: 'Freshly brewed five minutes ago. Night shifts really drain your soul, don\'t they?' },
      { speaker: 'Nurse Ramirez', text: 'You have no idea. But honestly... it feels quieter than a morgue in here tonight. The road outside was dead empty.' },
      { speaker: 'Duck', text: 'Yeah, usually I get rowdy kids. Tonight it\'s just me, the fryers, and that creepy clown mascot sitting by the booths.' },
      { speaker: 'Nurse Ramirez', text: 'Keep the front doors locked if you can, kid. Something in the air out there feels completely off.' },
      { speaker: 'Duck', text: 'Corporate policy says 24/7 lobby access. Even if a ghost clown attacks, management would dock my pay.' },
      { speaker: 'Nurse Ramirez', text: 'Anyway, can I get a Big Mac meal with hot coffee and fries? I am completely starving.' },
      { speaker: 'Duck', text: 'Coming right up! I\'ll prepare that for you back in the kitchen.' },
    ],
  },
  // 2. Nervous Teenager
  {
    name: 'Tyler',
    title: 'Jittery Teenager',
    orderItem: '10-Piece Chicken McNuggets with Fries & Sprite',
    dialogue: [
      { speaker: 'Tyler', text: 'Yo... bro. Bro! Did you see that?! Did that Ronald clown statue over in the dining booth just turn its head?!' },
      { speaker: 'Duck', text: 'It\'s hollow plastic and fiberglass bolted into the linoleum. It doesn\'t move, Tyler.' },
      { speaker: 'Tyler', text: 'I swear on my life it was facing the window when I parked my car! Now its head is tilted straight toward the register!' },
      { speaker: 'Duck', text: 'I make eight bucks an hour. Even if that clown comes to life, I don\'t get paid enough to run.' },
      { speaker: 'Tyler', text: 'I\'m grabbing my food to go. Can I get a 10-piece McNuggets combo with BBQ sauce and a large Sprite?' },
      { speaker: 'Duck', text: 'Right on it. I\'ll get your nuggets and fries cooking right away in the kitchen.' },
    ],
  },
  // 3. Cryptic / Unsettling Regular
  {
    name: 'Old Man Silas',
    title: 'Cryptic Regular',
    orderItem: 'Hot Black Tea & Baked Apple Pie',
    dialogue: [
      { speaker: 'Old Man Silas', text: 'He doesn\'t care for the fluorescent buzz, young man. He only listens when the tubes start to flicker.' },
      { speaker: 'Duck', text: 'Sir, if you\'re ordering food, I\'m ready at the register.' },
      { speaker: 'Old Man Silas', text: 'Forty years ago, this ground belonged to the woods. The painted smiles in greasepaint never really wash away.' },
      { speaker: 'Duck', text: 'Right. Look, Silas, the burgers are beef and the clown is resin. What can I get started for you?' },
      { speaker: 'Old Man Silas', text: 'A hot black tea and a warm baked apple pie, young duck. Keep the tea piping hot.' },
      { speaker: 'Duck', text: 'Understood. Heading into the kitchen to prepare your tea and apple pie now.' },
    ],
  },
  // 4. Highway Long-Hauler Trucker
  {
    name: 'Big Ray',
    title: 'Highway Long-Hauler',
    orderItem: 'Double Quarter Pounder Combo & Large Fries',
    dialogue: [
      { speaker: 'Big Ray', text: 'Evening, chief. Long haul tonight—eight hundred miles till Omaha.' },
      { speaker: 'Duck', text: 'Long drive ahead of you. What can I get you for fuel?' },
      { speaker: 'Big Ray', text: 'Double Quarter Pounder meal, extra fries, and a black coffee. Hey, who\'s the fella in the yellow suit standing out back by the dumpster?' },
      { speaker: 'Duck', text: '...Nobody is supposed to be out back behind the kitchen.' },
      { speaker: 'Big Ray', text: 'Tall guy, bright red hair, yellow jumpsuit. Saw him peering through the window when I swung the rig around.' },
      { speaker: 'Duck', text: '...I just took the trash out back ten minutes ago. I\'ll keep my guard up. Let me cook your meal right now.' },
    ],
  },
];

export class GameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cctvCamera: THREE.PerspectiveCamera;

  private world: RestaurantWorld;

  // Player state: Spawns outside the front entrance doors on the sidewalk, looking at the illuminated McDonald's facade
  private playerPos = new THREE.Vector3(0, 1.65, 8.5);
  private playerVel = new THREE.Vector3();
  private pitch: number = 0;
  private yaw: number = Math.PI; // Facing towards doors (Z = 6.0)
  private playerHeight: number = 1.65;
  private targetHeight: number = 1.65;
  private isPointerLocked: boolean = false;
  private isLeftFoot: boolean = false; // Alternating stereo footstep panning

  private stats: PlayerStats = {
    stamina: 100,
    isSprinting: false,
    isCrouched: false,
    flashlightOn: true,
    hasTrashInHand: false,
    hasCardboardInHand: false,
    hasFoodInHand: false,
    hasMopInHand: false,
    mustDiscardFood: false,
  };

  private nightState: NightState = {
    night: 1,
    timeHour: 0,
    timeMinute: 0,
    timeTotalSeconds: 0,
    currentObjectiveIndex: 0,
    objectiveCompletedBanner: null,
    tablesCleaned: 0,
    puddlesMopped: 0,
    trashCollected: 0,
    trashDumped: false,
    kitchenShutDown: false,
    storageInspected: false,
    clockedIn: false,
    freezerLogged: false,
    hallwayMopped: false,
    cardboardDumped: false,
    driveThruInspected: false,
    cctvActiveCam: 1,
    slidingDoorOpenAmount: 0,
    rearDoorOpenAmount: 0,
    teaserStep: 0,
  };

  // Sequential Objectives for Night 1 & Night 2 (Cold storage and non-area tasks deleted)
  private night1Steps: ObjectiveStep[] = [
    { id: 'talk_to_john', title: 'TALK TO JOHN', description: 'Head inside through the sliding doors and talk to outgoing employee John to take over the night shift.' },
    { id: 'clock_in', title: 'CLOCK IN', description: 'Walk to the employee time clock near the counter and punch in for your shift.' },
    { id: 'clean_tables', title: 'CLEAN TABLES', description: 'Wipe down and sanitize the dirty dining tables (0/2).', targetCount: 2, currentCount: 0 },
    { id: 'collect_trash', title: 'COLLECT TRASH', description: 'Collect fast-food trash bags from the dining area (0/2).', targetCount: 2, currentCount: 0 },
    { id: 'dump_trash', title: 'TAKE TRASH OUTSIDE', description: 'Take the trash outside through the rear kitchen door to the dumpster.' },
    { id: 'kitchen_fryers', title: 'CHECK KITCHEN', description: 'Power down the kitchen fryers and heating equipment.' },
    { id: 'check_cctv', title: 'INSPECT SECURITY', description: 'Inspect the security office CCTV surveillance console.' },
    { id: 'finish_shift', title: 'SURVIVE UNTIL 6:00 AM', description: 'Preparation complete. Customers are arriving. Attend to customer orders and survive until 6:00 AM.' },
  ];

  private night2Steps: ObjectiveStep[] = [
    { id: 'talk_to_john', title: 'TALK TO JOHN', description: 'Head inside through the sliding doors and talk to outgoing employee John to take over the night shift.' },
    { id: 'n2_clock_in', title: 'CLOCK IN', description: 'Clock in for Night 2 shift at the employee time clock.' },
    { id: 'n2_breaker', title: 'MAINTENANCE BREAKER', description: 'Flip the auxiliary maintenance breaker in the security office.' },
    { id: 'n2_mop_puddle', title: 'MOP HALLWAY', description: 'Mop up the mysterious dark fluid puddle in the back hallway.' },
    { id: 'n2_cardboard', title: 'RECYCLE CARDBOARD', description: 'Take bundled cardboard boxes outside to the rear dumpster.' },
    { id: 'n2_drive_thru', title: 'DRIVE-THRU CHECK', description: 'Inspect the relocated drive-thru order station at the cashier counter.' },
    { id: 'n2_cctv_final', title: 'CHECK SURVEILLANCE', description: 'Inspect the security office cameras before closing up.' },
    { id: 'finish_shift', title: 'SURVIVE UNTIL 6:00 AM', description: 'Preparation complete. Customers are arriving. Attend to customer orders and survive until 6:00 AM.' },
  ];

  private currentSteps: ObjectiveStep[] = [];

  // Outgoing Employee John NPC State (Night 1 & Night 2 shift handover)
  private johnState: 'waiting' | 'leaving' | 'gone' = 'waiting';
  private johnPos: [number, number, number] = [0.8, 0, 2.8];
  private johnWalkProgress: number = 0;

  // Customer Food Order & Preparation State
  private activeCustomerOrder: { customerName: string; customerId: string; itemText: string } | null = null;
  private orderPhase: 'none' | 'preparing' | 'ready_to_serve' = 'none';
  private pendingThankYouDialogue: boolean = false;
  private currentDialogueCustomer: CustomerPerson | null = null;
  private prepCountdown: number = 0;
  private isPreparingFood: boolean = false;
  private prepAudioTimer: number = 0;
  private flickerBuzzTimer: number = 0;
  private heldMealMesh: THREE.Group | null = null;
  private heldMopMesh: THREE.Group | null = null;
  private mopSwingTimer: number = 0;

  // 3:00 AM Power Outage, Electrical Box, Secretive Clown & Warehouse Reaction State
  private powerOutageTriggered: boolean = false;
  private powerOutageActive: boolean = false;
  private pendingPowerOutageDialogue: boolean = false;
  private pendingPowerOutageCustomerLeave: boolean = false;
  private mustDiscardFood: boolean = false;
  private clownActor: MascotCharacter;
  private clownState: 'hidden' | 'watching' | 'running_away' | 'fled' = 'hidden';
  private clownPos = new THREE.Vector3(-11.25, 0, -11.55);
  private clownSpotLookTimer: number = 0;
  private clownSightGraceTimer: number = 0;
  private clownSpottedByDuck: boolean = false;
  private warehouseReactionTriggered: boolean = false;
  private _clownRaycaster = new THREE.Raycaster();

  // Night 1 & Night 2 Guest Counters, Curated Lineups, and Door-Peeking Clown Event State
  private night1GuestsServed: number = 0;
  private night2GuestsCount: number = 0;
  private night2GuestsServed: number = 0;
  private readonly night1QueueIndices = [0, 1, 2, 3];
  private readonly night2QueueIndices = [0, 7, 2, 8, 3];
  private n2LastGuestTriggered: boolean = false;
  private n2LastGuestClownPeeking: boolean = false;

  // Seated Friends Group dining at corner booth [5.0, 4.2] for ~60 seconds
  private eatingFriendsGroup: {
    members: {
      mesh: THREE.Group;
      pos: [number, number, number];
      seatPos: [number, number, number];
      seatRotY: number;
    }[];
    car: CustomerCar | null;
    trayMesh: THREE.Group | null;
    state: 'to_aisle' | 'to_seats' | 'eating' | 'to_aisle_exit' | 'to_door' | 'to_car';
    eatTimer: number;
    walkProgress: number;
  } | null = null;

  // Pre-allocated scratch vectors for zero-GC gaze checks, movement & camera focus
  private _tmpCamDir = new THREE.Vector3();
  private _tmpToClown = new THREE.Vector3();
  private _tmpClownEye = new THREE.Vector3();
  private _tmpLookTarget = new THREE.Vector3();
  private _tmpForward = new THREE.Vector3();
  private _tmpRight = new THREE.Vector3();
  private _tmpMoveDir = new THREE.Vector3();
  private _tmpItemPos = new THREE.Vector3();
  private _tmpToItem = new THREE.Vector3();
  private _tmpDoorPos = new THREE.Vector3(0, 0, 6.0);
  private _tmpCheckPos = new THREE.Vector3();
  private lastSentStatsKey: string = '';
  private lastPrepSecLeft: number = -1;

  private settings: GameSettings = {
    masterVolume: 0.8,
    mouseSensitivity: 1.2,
    invertY: false,
    crtFilter: true,
    graphicsQuality: 'high',
    language: 'en',
  };

  // Dialogue & Monologue state for Duck and Customers
  private dialogueState: DialogueState = {
    active: false,
    isMonologue: false,
    lines: [],
    currentIndex: 0,
  };
  private fadeAlpha: number = 0;
  private closingShiftTargetScreen: 'night1_complete' | 'night2_complete' | null = null;
  private nearbyCustomer: CustomerPerson | null = null;
  private customerConvoIndex: number = 0;

  // Flashlight (Unlimited battery)
  private flashlight: THREE.SpotLight;
  private flashlightTarget: THREE.Object3D;
  private playerDimLight: THREE.PointLight;

  // Controls & Mobile Touch Input
  private keys: Record<string, boolean> = {};
  private mobileMoveInput: THREE.Vector2 = new THREE.Vector2(0, 0);
  private mobileSprint: boolean = false;
  private activeItemNearby: InteractiveItem | null = null;
  private isPaused: boolean = false;
  private currentScreen: GameScreen = 'loading';
  private callbacks: GameEngineCallbacks;

  // Customer & Vehicle AI state
  private activeCustomerCar: CustomerCar | null = null;
  private activeCustomerPerson: CustomerPerson | null = null;
  private customerSpawnTimer: number = 8; // Spawns customer car after 8s
  private frontChimePlayedForCurrentCustomer: boolean = false;
  private backgroundTrafficCars: { mesh: THREE.Group; speed: number; direction: number; laneZ: number }[] = [];

  private reqId: number | null = null;
  private lastTime: number = 0;
  private footstepTimer: number = 0;

  constructor(container: HTMLElement, callbacks: GameEngineCallbacks) {
    this.container = container;
    this.callbacks = callbacks;

    // 1. WebGL Renderer
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.applyGraphicsQuality(this.settings.graphicsQuality);
    container.appendChild(this.renderer.domElement);

    // 2. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040507);
    this.scene.fog = new THREE.FogExp2(0x05070a, 0.045);

    // Subtle Studio Environment Reflections (kept low for dark horror ambience)
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.scene.environmentIntensity = 0.22;
    pmremGenerator.dispose();

    // Spawn 2 Moving Background Highway Cars (Both Directions)
    const traffic1 = createDetailedCar(0x2a3b4c);
    traffic1.position.set(16, 0, 22.5); // Westbound lane
    traffic1.rotation.y = -Math.PI / 2;
    this.scene.add(traffic1);
    this.backgroundTrafficCars.push({ mesh: traffic1, speed: 11.5, direction: -1, laneZ: 22.5 });

    const traffic2 = createDetailedCar(0x522320);
    traffic2.position.set(-18, 0, 25.5); // Eastbound lane
    traffic2.rotation.y = Math.PI / 2;
    this.scene.add(traffic2);
    this.backgroundTrafficCars.push({ mesh: traffic2, speed: 13.0, direction: 1, laneZ: 25.5 });

    // 3. Cameras
    this.camera = new THREE.PerspectiveCamera(
      75,
      container.clientWidth / container.clientHeight,
      0.1,
      80
    );
    this.cctvCamera = new THREE.PerspectiveCamera(65, 1.33, 0.2, 50);

    // 4. Compact Restaurant World
    this.world = buildCompactRestaurantWorld();
    this.scene.add(this.world.scene);

    // 4B. First-Person Viewmodel: Held Meal in Duck's Hands
    this.heldMealMesh = createFirstPersonHeldMeal();
    this.heldMealMesh.position.set(0.24, -0.22, -0.42);
    this.heldMealMesh.rotation.set(0.12, -0.15, 0.05);
    this.heldMealMesh.visible = false;
    this.camera.add(this.heldMealMesh);

    // 4B-2. First-Person Viewmodel: Held Mop in Duck's Hand
    this.heldMopMesh = createFirstPersonHeldMop();
    this.heldMopMesh.position.set(0.28, -0.25, -0.45);
    this.heldMopMesh.rotation.set(0.08, -0.1, 0.04);
    this.heldMopMesh.visible = false;
    this.camera.add(this.heldMopMesh);

    this.scene.add(this.camera);

    // 4C. Secretive Clown Entity (Appears behind store after breaker inspection)
    this.clownActor = createSmilingJester();
    this.clownActor.group.visible = false;
    this.scene.add(this.clownActor.group);

    // 5. Flashlight (Unlimited battery)
    this.flashlight = new THREE.SpotLight(0xffeedd, 3.2, 22, Math.PI / 6, 0.45, 1.2);
    this.flashlight.castShadow = true;
    this.flashlight.shadow.mapSize.width = 1024;
    this.flashlight.shadow.mapSize.height = 1024;
    this.flashlight.shadow.bias = -0.0005;

    this.flashlightTarget = new THREE.Object3D();
    this.scene.add(this.flashlightTarget);
    this.flashlight.target = this.flashlightTarget;
    this.scene.add(this.flashlight);

    this.playerDimLight = new THREE.PointLight(0xffecd0, 0.08, 2.8);
    this.scene.add(this.playerDimLight);

    // 6. Bind Events
    this.bindEvents();

    // Loop
    this.lastTime = performance.now();
    this.tick = this.tick.bind(this);
    this.reqId = requestAnimationFrame(this.tick);
  }

  public applyGraphicsQuality(quality: 'low' | 'medium' | 'high') {
    if (quality === 'low') {
      this.renderer.setPixelRatio(1.0);
      this.renderer.shadowMap.enabled = false;
      if (this.scene && this.scene.fog && 'density' in this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).density = 0.03;
      }
    } else if (quality === 'medium') {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      if (this.scene && this.scene.fog && 'density' in this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).density = 0.04;
      }
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (this.scene && this.scene.fog && 'density' in this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).density = 0.045;
      }
    }
  }

  private bindEvents() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('blur', this.handleWindowBlur);
    window.addEventListener('resize', this.handleResize);

    const canvas = this.renderer.domElement;
    canvas.addEventListener('click', () => {
      if (this.currentScreen === 'playing' && !this.isPaused) {
        this.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.isPointerLocked = document.pointerLockElement === this.renderer.domElement;
    });

    document.addEventListener('mousemove', this.handleMouseMove);
  }

  private handleWindowBlur = () => {
    this.keys = {};
    this.mobileSprint = false;
  };

  private requestPointerLock() {
    try {
      this.renderer.domElement.requestPointerLock();
      soundEngine.resume();
    } catch (e) {}
  }

  private exitPointerLock() {
    if (document.exitPointerLock) {
      document.exitPointerLock();
    }
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    soundEngine.init();
    soundEngine.resume();

    const code = e.code;
    this.keys[code] = true;
    if (e.key === 'Shift' || e.shiftKey) {
      this.keys['Shift'] = true;
    }

    if (code === 'KeyF' && this.currentScreen === 'playing' && !this.isPaused) {
      this.stats.flashlightOn = !this.stats.flashlightOn;
      soundEngine.playFlashlightClick(this.stats.flashlightOn);
      this.emitStatsIfChanged();
    }

    if (code === 'KeyC' && this.currentScreen === 'playing' && !this.isPaused) {
      this.stats.isCrouched = !this.stats.isCrouched;
      this.targetHeight = this.stats.isCrouched ? 0.95 : 1.65;
      this.emitStatsIfChanged();
    }

    if (code === 'KeyE' && this.currentScreen === 'playing' && !this.isPaused) {
      if (this.dialogueState.active) {
        // DialogueBox handles typewriter skip and line advance
        return;
      }
      if (this.nearbyCustomer) {
        this.startCustomerDialogue();
        return;
      }
      this.triggerInteraction();
    }

    if (code === 'Space' && this.currentScreen === 'playing' && !this.isPaused && this.dialogueState.active) {
      // DialogueBox handles typewriter skip and line advance
      return;
    }

    if (code === 'Escape') {
      if (this.currentScreen === 'cctv') {
        this.exitCCTV();
      } else if (this.currentScreen === 'playing') {
        this.togglePause();
      }
    }
  };

  public advanceDialogue() {
    if (!this.dialogueState.active) return;
    soundEngine.playDialogueBlip();

    if (this.dialogueState.currentIndex < this.dialogueState.lines.length - 1) {
      this.dialogueState.currentIndex += 1;
      this.callbacks.onDialogueUpdate({ ...this.dialogueState });
    } else {
      this.closeDialogue();
    }
  }

  private startDialogue(lines: DialogueLine[], isMonologue: boolean, npcId?: string) {
    this.dialogueState = {
      active: true,
      isMonologue,
      lines,
      currentIndex: 0,
      npcId,
    };
    this.playerVel.set(0, 0, 0);
    this.callbacks.onDialogueUpdate({ ...this.dialogueState });
  }

  private emitStatsIfChanged(force: boolean = false) {
    const key = `${this.stats.isSprinting ? 1 : 0}|${this.stats.isCrouched ? 1 : 0}|${this.stats.flashlightOn ? 1 : 0}|${this.stats.hasTrashInHand ? 1 : 0}|${this.stats.hasCardboardInHand ? 1 : 0}|${this.stats.hasFoodInHand ? 1 : 0}|${this.stats.hasMopInHand ? 1 : 0}|${this.stats.mustDiscardFood ? 1 : 0}`;
    if (force || key !== this.lastSentStatsKey) {
      this.lastSentStatsKey = key;
      this.callbacks.onPlayerStatsUpdate({ ...this.stats });
    }
  }

  private syncLocalizedSteps() {
    const t = getTranslations(this.settings.language).engine;
    const is6Am = this.nightState.timeHour >= 6;
    const tablesCount = this.nightState.tablesCleaned || 0;
    const puddlesCount = this.nightState.puddlesMopped || 0;
    const trashCount = this.nightState.trashCollected || 0;

    this.night1Steps = [
      { id: 'talk_to_john', title: t.steps.talk_to_john.title, description: t.steps.talk_to_john.description },
      { id: 'clock_in', title: t.steps.clock_in.title, description: t.steps.clock_in.description },
      {
        id: 'clean_tables',
        title: t.steps.clean_tables.title,
        description: t.steps.clean_tables.description(tablesCount),
        targetCount: 2,
        currentCount: tablesCount,
      },
      {
        id: 'mop_puddles',
        title: t.steps.mop_puddles.title,
        description: t.steps.mop_puddles.description(puddlesCount),
        targetCount: 8,
        currentCount: puddlesCount,
      },
      {
        id: 'collect_trash',
        title: t.steps.collect_trash.title,
        description: t.steps.collect_trash.description(trashCount),
        targetCount: 2,
        currentCount: trashCount,
      },
      { id: 'dump_trash', title: t.steps.dump_trash.title, description: t.steps.dump_trash.description },
      { id: 'kitchen_fryers', title: t.steps.kitchen_fryers.title, description: t.steps.kitchen_fryers.description },
      { id: 'check_cctv', title: t.steps.check_cctv.title, description: t.steps.check_cctv.description },
      {
        id: 'finish_shift',
        title: t.steps.finish_shift.title,
        description: is6Am ? t.steps.finish_shift.ready6am : t.steps.finish_shift.description,
      },
    ];

    this.night2Steps = [
      { id: 'talk_to_john', title: t.steps.talk_to_john.title, description: t.steps.talk_to_john.description },
      { id: 'n2_clock_in', title: t.steps.n2_clock_in.title, description: t.steps.n2_clock_in.description },
      { id: 'n2_breaker', title: t.steps.n2_breaker.title, description: t.steps.n2_breaker.description },
      {
        id: 'n2_mop_puddle',
        title: t.steps.n2_mop_puddle.title,
        description: t.steps.n2_mop_puddle.description(puddlesCount),
        targetCount: 8,
        currentCount: puddlesCount,
      },
      {
        id: 'n2_cardboard',
        title: t.steps.n2_cardboard.title,
        description: this.stats.hasCardboardInHand ? t.steps.n2_cardboard.carryDesc : t.steps.n2_cardboard.description,
      },
      { id: 'n2_drive_thru', title: t.steps.n2_drive_thru.title, description: t.steps.n2_drive_thru.description },
      { id: 'n2_cctv_final', title: t.steps.n2_cctv_final.title, description: t.steps.n2_cctv_final.description },
      {
        id: 'finish_shift',
        title: t.steps.finish_shift.title,
        description: is6Am ? t.steps.finish_shift.ready6am : t.steps.finish_shift.description,
      },
    ];

    this.currentSteps = this.nightState.night === 1 ? [...this.night1Steps] : [...this.night2Steps];
  }

  private closeDialogue() {
    const finishedNpcId = this.dialogueState.npcId;
    this.dialogueState.active = false;
    this.callbacks.onDialogueUpdate({ ...this.dialogueState });

    const t = getTranslations(this.settings.language).engine;

    // -2. Customer 3:00 AM power outage walkout reaction -> customer leaves store immediately
    if (this.pendingPowerOutageCustomerLeave) {
      this.pendingPowerOutageCustomerLeave = false;
      if (this.activeCustomerPerson) {
        this.activeCustomerPerson.state = 'leaving';
        this.activeCustomerPerson.walkProgress = 0;
      }
      if (this.pendingPowerOutageDialogue) {
        this.pendingPowerOutageDialogue = false;
        this.startDialogue(t.powerOutageStartDialogue, true, 'power_outage_start');
        return;
      }
      this.notifyActiveObjective();
      return;
    }

    // 0. If Duck just finished talking to outgoing employee John -> John leaves and advance to clock_in
    if (finishedNpcId === 'employee_john') {
      const johnItem = this.world.interactiveItems.find((it) => it.id === 'employee_john');
      if (johnItem) johnItem.completed = true;
      this.johnState = 'leaving';
      this.johnWalkProgress = 0;

      const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
      if (currentStep && currentStep.id === 'talk_to_john') {
        this.advanceObjective();
      } else {
        this.notifyActiveObjective();
      }
      return;
    }

    // 1. If Duck just served the food and customer finished closing dialogue
    if (this.pendingThankYouDialogue) {
      this.pendingThankYouDialogue = false;
      this.orderPhase = 'none';
      this.activeCustomerOrder = null;
      this.isPreparingFood = false;
      this.prepCountdown = 0;

      if (this.activeCustomerPerson) {
        if (this.activeCustomerPerson.behaviorType === 'friends_group') {
          this.startFriendsBoothDining();
        } else {
          this.activeCustomerPerson.state = 'leaving';
          this.activeCustomerPerson.walkProgress = 0;
        }
      }

      if (this.nightState.night === 1) {
        this.night1GuestsServed += 1;
        if (
          this.nightState.timeHour < 6 &&
          (this.night1GuestsServed >= this.night1QueueIndices.length || this.nightState.timeHour >= 4)
        ) {
          this.skipClockTo6AM();
          return;
        }
      } else {
        this.night2GuestsServed += 1;
        if (
          this.nightState.timeHour < 6 &&
          (this.n2LastGuestTriggered ||
            this.night2GuestsServed >= this.night2QueueIndices.length ||
            this.nightState.timeHour >= 4)
        ) {
          this.skipClockTo6AM();
          return;
        }
      }

      this.notifyActiveObjective();
      return;
    }

    // 2. If customer just finished ordering their meal -> AUTOMATICALLY ADD PREPARE FOOD TASK
    const customer = this.nearbyCustomer || this.currentDialogueCustomer;
    if (this.orderPhase === 'none' && customer && !this.powerOutageActive && !this.mustDiscardFood) {
      const custList = this.nightState.night === 2 ? t.customersNight2 : t.customers;
      const archIdx = customer.archetypeIndex ?? 0;
      const archetype = custList[archIdx % custList.length];
      this.activeCustomerOrder = {
        customerName: archetype.name,
        customerId: customer.id,
        itemText: archetype.orderItem,
      };
      this.orderPhase = 'preparing';
      this.isPreparingFood = false;
      this.prepCountdown = 0;
      this.currentDialogueCustomer = null;

      // Night 2 last guest event: clown peeks out from the front glass door while Duck prepares food!
      if (
        this.nightState.night === 2 &&
        !this.n2LastGuestTriggered &&
        (this.night2GuestsCount >= this.night2QueueIndices.length || this.nightState.timeHour >= 4)
      ) {
        this.n2LastGuestTriggered = true;
        this.n2LastGuestClownPeeking = true;
        this.clownActor.group.position.set(-1.42, 0, 6.28);
        this.clownActor.group.rotation.y = Math.atan2(0.8 - -1.42, 2.0 - 6.28);
        this.clownActor.group.visible = true;
        this.clownActor.setPeekPose?.(true, performance.now() / 1000, 1);
      }

      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.newTaskPrep(archetype.name));
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
      this.notifyActiveObjective();
      return;
    }

    // -1. If a 3 AM power outage monologue was queued behind another dialogue, trigger it now
    if (this.pendingPowerOutageDialogue) {
      this.pendingPowerOutageDialogue = false;
      this.startDialogue(t.powerOutageStartDialogue, true, 'power_outage_start');
      return;
    }

    this.notifyActiveObjective();
  }

  private skipClockTo6AM() {
    if (this.nightState.timeHour >= 6) return;
    const t = getTranslations(this.settings.language).engine;
    this.powerOutageTriggered = true;
    if (this.powerOutageActive) {
      this.powerOutageActive = false;
      this.setStorePower(true);
    }
    this.nightState.timeTotalSeconds = 720;
    this.nightState.timeHour = 6;
    this.nightState.timeMinute = 0;

    const steps = this.nightState.night === 1 ? this.night1Steps : this.night2Steps;
    const lastStep = steps[steps.length - 1];
    if (lastStep) lastStep.description = t.steps.finish_shift.ready6am;
    const curLast = this.currentSteps[this.currentSteps.length - 1];
    if (curLast) curLast.description = t.steps.finish_shift.ready6am;

    soundEngine.playHourBell();
    this.callbacks.onNightStateUpdate({ ...this.nightState });
    this.notifyActiveObjective();
    this.callbacks.onObjectiveCompletedNotice(t.notices.shiftSkipped6am);
    window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4500);
  }

  private startFriendsBoothDining() {
    if (!this.activeCustomerPerson) return;
    const leader = this.activeCustomerPerson;
    const companions = leader.companionMeshes || [];

    const trayMesh = createBoothMealTray();
    trayMesh.position.set(5.0, 0.845, 4.2);
    this.scene.add(trayMesh);

    const m0Pos: [number, number, number] = [leader.currentPos[0], 0, leader.currentPos[2]];
    const m1Pos: [number, number, number] = companions[0]
      ? [companions[0].position.x, 0, companions[0].position.z]
      : [leader.currentPos[0] - 0.6, 0, leader.currentPos[2] + 0.35];
    const m2Pos: [number, number, number] = companions[1]
      ? [companions[1].position.x, 0, companions[1].position.z]
      : [leader.currentPos[0] + 0.6, 0, leader.currentPos[2] + 0.35];

    const members: {
      mesh: THREE.Group;
      pos: [number, number, number];
      seatPos: [number, number, number];
      seatRotY: number;
    }[] = [
      { mesh: leader.meshGroup, pos: m0Pos, seatPos: [4.68, 0, 4.82], seatRotY: Math.PI },
    ];
    if (companions[0]) {
      members.push({ mesh: companions[0], pos: m1Pos, seatPos: [5.32, 0, 4.82], seatRotY: Math.PI });
    }
    if (companions[1]) {
      members.push({ mesh: companions[1], pos: m2Pos, seatPos: [5.0, 0, 3.58], seatRotY: 0 });
    }

    this.eatingFriendsGroup = {
      members,
      car: this.activeCustomerCar,
      trayMesh,
      state: 'to_aisle',
      eatTimer: 60, // Dine in at the booth for ~60 seconds before leaving
      walkProgress: 0,
    };

    // Free counter & main car spawner so subsequent guests can arrive while they eat
    this.activeCustomerPerson = null;
    this.activeCustomerCar = null;
    this.nearbyCustomer = null;
  }

  private startCustomerDialogue() {
    if (!this.nearbyCustomer) return;
    const t = getTranslations(this.settings.language).engine;
    const custList = this.nightState.night === 2 ? t.customersNight2 : t.customers;

    // A. Food is ready in Duck's hands: Hand over the meal to the customer!
    if (this.orderPhase === 'ready_to_serve' && this.activeCustomerOrder) {
      soundEngine.playCashRegisterSale();
      this.stats.hasFoodInHand = false;
      this.emitStatsIfChanged();

      // Night 2 last guest: as soon as Duck delivers the food, the door-peeking clown disappears!
      if (this.n2LastGuestClownPeeking) {
        this.n2LastGuestClownPeeking = false;
        this.clownActor.setPeekPose?.(false, performance.now() / 1000);
        this.clownActor.group.visible = false;
      }

      // Generate a random price strictly limited to $15 ($5.50 - $14.50)
      const randomPrice = (Math.random() * 9.0 + 5.5).toFixed(2);
      let deliveryLines: DialogueLine[];
      if (this.nearbyCustomer.behaviorType === 'grumpy_man') {
        deliveryLines = t.grumpyDeliveredDialogue(this.activeCustomerOrder.customerName, randomPrice);
      } else if (this.nearbyCustomer.behaviorType === 'friends_group') {
        deliveryLines = t.friendsSeatedDialogue(this.activeCustomerOrder.customerName, randomPrice);
      } else {
        deliveryLines = t.thankYouDialogue(this.activeCustomerOrder.customerName, randomPrice);
      }

      this.pendingThankYouDialogue = true;
      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.orderCompleted(randomPrice));
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);

      this.startDialogue(deliveryLines, false, this.nearbyCustomer.id);
      return;
    }

    // B. Player already took the order, but hasn't cooked it yet in the kitchen
    if (this.orderPhase === 'preparing' && this.activeCustomerOrder) {
      const waitingLines = t.waitingOrderDialogue(
        this.activeCustomerOrder.customerName,
        this.activeCustomerOrder.itemText
      );
      this.startDialogue(waitingLines, false, this.nearbyCustomer.id);
      return;
    }

    // C. Initial arrival: customer places order
    this.currentDialogueCustomer = this.nearbyCustomer;
    const archIdx = this.nearbyCustomer.archetypeIndex ?? (this.customerConvoIndex % custList.length);
    const archetype = custList[archIdx % custList.length];
    this.customerConvoIndex += 1;
    this.startDialogue(archetype.dialogue, false, this.nearbyCustomer.id);
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
    if (e.key === 'Shift' || !e.shiftKey) {
      this.keys['Shift'] = false;
    }
  };

  private handleMouseMove = (e: MouseEvent) => {
    if (!this.isPointerLocked || this.isPaused || this.currentScreen !== 'playing') return;

    const sens = 0.0022 * this.settings.mouseSensitivity;
    this.yaw -= e.movementX * sens;

    const pitchFactor = this.settings.invertY ? 1 : -1;
    this.pitch += e.movementY * sens * pitchFactor;
    this.pitch = Math.max(-Math.PI / 2.1, Math.min(Math.PI / 2.1, this.pitch));
  };

  private handleResize = () => {
    if (!this.container) return;
    const w = this.container.clientWidth;
    const h = this.container.clientHeight;
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  };

  // --- START NIGHT & SEQUENTIAL OBJECTIVES ---

  public startNight(night: GameNight) {
    soundEngine.init();
    soundEngine.resume();

    this.nightState.night = night;
    this.nightState.timeHour = 0; // 12 AM
    this.nightState.timeMinute = 0;
    this.nightState.timeTotalSeconds = 0;
    this.nightState.currentObjectiveIndex = 0;
    this.nightState.objectiveCompletedBanner = null;
    this.nightState.tablesCleaned = 0;
    this.nightState.puddlesMopped = 0;
    this.nightState.trashCollected = 0;
    this.nightState.trashDumped = false;
    this.nightState.kitchenShutDown = false;
    this.nightState.storageInspected = false;
    this.nightState.clockedIn = false;
    this.nightState.freezerLogged = false;
    this.nightState.hallwayMopped = false;
    this.nightState.cardboardDumped = false;
    this.nightState.driveThruInspected = false;
    this.nightState.cctvActiveCam = 1;
    this.nightState.teaserStep = 0;

    this.stats.stamina = 100;
    this.stats.flashlightOn = true;
    this.stats.hasTrashInHand = false;
    this.stats.hasCardboardInHand = false;
    this.stats.hasFoodInHand = false;
    this.stats.hasMopInHand = false;
    this.stats.mustDiscardFood = false;

    // Reset customer food order state
    this.activeCustomerOrder = null;
    this.orderPhase = 'none';
    this.pendingThankYouDialogue = false;
    this.currentDialogueCustomer = null;
    this.isPreparingFood = false;
    this.prepCountdown = 0;
    this.lastPrepSecLeft = -1;
    this.mopSwingTimer = 0;
    this.mustDiscardFood = false;
    if (this.heldMealMesh) this.heldMealMesh.visible = false;
    if (this.heldMopMesh) this.heldMopMesh.visible = false;
    if (this.world.mopInBucket) this.world.mopInBucket.visible = true;

    // Reset 3:00 AM Power Outage & Clown encounter state
    this.powerOutageTriggered = false;
    this.powerOutageActive = false;
    this.pendingPowerOutageDialogue = false;
    this.pendingPowerOutageCustomerLeave = false;
    this.setStorePower(true);
    this.clownState = 'hidden';
    this.clownPos.set(-11.25, 0, -11.55);
    this.clownSpotLookTimer = 0;
    this.clownSightGraceTimer = 0;
    this.clownSpottedByDuck = false;
    this.warehouseReactionTriggered = false;
    this.night1GuestsServed = 0;
    this.night2GuestsCount = 0;
    this.night2GuestsServed = 0;
    this.n2LastGuestTriggered = false;
    this.n2LastGuestClownPeeking = false;
    this.customerConvoIndex = 0;
    this.closingShiftTargetScreen = null;
    if (this.clownActor) {
      this.clownActor.setPeekPose?.(false, 0);
      this.clownActor.group.visible = false;
    }

    this.emitStatsIfChanged(true);

    // Cleanup any active seated friends dining group
    if (this.eatingFriendsGroup) {
      for (const m of this.eatingFriendsGroup.members) {
        this.scene.remove(m.mesh);
      }
      if (this.eatingFriendsGroup.trayMesh) {
        this.scene.remove(this.eatingFriendsGroup.trayMesh);
      }
      if (this.eatingFriendsGroup.car) {
        this.scene.remove(this.eatingFriendsGroup.car.meshGroup);
      }
      this.eatingFriendsGroup = null;
    }

    // Restore Clown Statue near counter on shift start
    if (this.world.clownStatue) {
      this.world.clownStatue.visible = true;
    }
    for (const box of this.world.collisionBoxes) {
      if (box.id === 'clown_statue') {
        box.enabled = true;
      }
    }

    // Main character Duck starts outside the front entrance doors on the sidewalk!
    this.playerPos.set(0, 1.65, 8.5);
    this.playerVel.set(0, 0, 0);
    this.yaw = Math.PI; // Facing towards the doors, illuminated sign, ads, and windows
    this.pitch = 0;
    this.targetHeight = 1.65;

    // Smooth fade-in from black
    this.fadeAlpha = 1.0;
    this.callbacks.onFadeAlphaUpdate(1.0);

    // Reset world mesh states & interactive item completion flags
    this.world.interactiveMeshes.forEach((mesh) => {
      mesh.visible = true;
    });
    this.world.interactiveItems.forEach((item) => {
      item.completed = false;
    });

    // Reset John NPC state (waiting in lobby on both Night 1 & Night 2)
    this.johnState = 'waiting';
    this.johnPos = [0.8, 0, 2.8];
    this.johnWalkProgress = 0;
    this.world.employeeJohn.visible = true;
    this.world.employeeJohn.position.set(0.8, 0, 2.8);
    this.world.employeeJohn.rotation.y = -0.25;
    const jLimbs = this.world.employeeJohn.userData.limbs;
    if (jLimbs) {
      jLimbs.legL.rotation.x = 0;
      jLimbs.legR.rotation.x = 0;
      jLimbs.armL.rotation.x = 0;
      jLimbs.armR.rotation.x = 0;
      jLimbs.head.rotation.y = 0;
    }

    // Reset customer state
    if (this.activeCustomerCar) {
      this.scene.remove(this.activeCustomerCar.meshGroup);
      this.activeCustomerCar = null;
    }
    if (this.activeCustomerPerson) {
      if (this.activeCustomerPerson.companionMeshes) {
        this.activeCustomerPerson.companionMeshes.forEach((cm) => this.scene.remove(cm));
      }
      this.scene.remove(this.activeCustomerPerson.meshGroup);
      this.activeCustomerPerson = null;
    }
    this.customerSpawnTimer = 6;
    this.frontChimePlayedForCurrentCustomer = false;

    // Load localized active steps
    this.syncLocalizedSteps();
    this.notifyActiveObjective();

    // Opening Monologue from Duck
    const t = getTranslations(this.settings.language).engine;
    const monologueLines: DialogueLine[] =
      night === 1 ? t.openingMonologueNight1 : t.openingMonologueNight2;

    this.startDialogue(monologueLines, true);

    this.isPaused = false;
    this.setScreen('playing');
    this.requestPointerLock();

    soundEngine.playHourBell();
  }

  private setStorePower(isOn: boolean) {
    if (!this.world) return;
    this.world.storeLights.forEach((sl) => {
      sl.light.intensity = isOn ? sl.baseIntensity : 0;
    });
    this.world.hemiLight.intensity = isOn ? 0.18 : 0.015;
    if (this.scene) {
      this.scene.environmentIntensity = isOn ? 0.22 : 0.015;
    }
    if (this.playerDimLight) {
      this.playerDimLight.intensity = isOn ? 0.08 : 0.025;
    }
    this.world.storeSignMaterials.forEach((entry) => {
      entry.mat.color.setHex(isOn ? entry.onColor : 0x141518);
    });
    if (this.world.electricalBox) {
      this.world.electricalBox.lever.rotation.x = isOn ? 0.55 : -0.65;
      this.world.electricalBox.statusLedMat.color.setHex(isOn ? 0x22ee55 : 0xff2222);
      this.world.electricalBox.beaconLight.intensity = isOn ? 0.0 : 1.15;
    }
  }

  private notifyActiveObjective() {
    const t = getTranslations(this.settings.language).engine;
    if (this.powerOutageActive) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'electrical_box_check',
        title: t.dynamicObjectives.powerOutageTitle,
        description: this.mustDiscardFood
          ? t.dynamicObjectives.powerOutageWithFoodDesc
          : t.dynamicObjectives.powerOutageDesc,
      });
    } else if (this.mustDiscardFood && this.stats.hasFoodInHand) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'discard_food',
        title: t.dynamicObjectives.discardFoodTitle,
        description: t.dynamicObjectives.discardFoodDesc,
      });
    } else if (this.isPreparingFood && this.activeCustomerOrder) {
      const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
      this.callbacks.onActiveObjectiveUpdate({
        id: 'prep_order',
        title: t.dynamicObjectives.preparingTitle,
        description: t.dynamicObjectives.preparingDesc(secLeft),
      });
    } else if (this.orderPhase === 'preparing' && this.activeCustomerOrder) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'prep_order',
        title: t.dynamicObjectives.prepFoodTitle,
        description: t.dynamicObjectives.prepFoodDesc(this.activeCustomerOrder.customerName),
      });
    } else if (this.orderPhase === 'ready_to_serve' && this.activeCustomerOrder) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'serve_order',
        title: t.dynamicObjectives.serveTitle,
        description: t.dynamicObjectives.serveDesc(this.activeCustomerOrder.customerName),
      });
    } else {
      const active = this.currentSteps[this.nightState.currentObjectiveIndex] || null;
      this.callbacks.onActiveObjectiveUpdate(active);
    }
    this.callbacks.onNightStateUpdate({ ...this.nightState });
  }

  public isCustomerArrivalUnlocked(): boolean {
    const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    return currentStep?.id === 'finish_shift';
  }

  private advanceObjective() {
    const t = getTranslations(this.settings.language).engine;
    const completedStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (completedStep) {
      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.completed(completedStep.title));

      window.setTimeout(() => {
        this.callbacks.onObjectiveCompletedNotice(null);
      }, 3500);
    }

    this.nightState.currentObjectiveIndex += 1;
    this.notifyActiveObjective();

    // Check if transition to customer phase just occurred
    const nextStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (nextStep && nextStep.id === 'finish_shift') {
      this.customerSpawnTimer = 3.0; // Arrival begins in 3 seconds!
    }
  }

  public setScreen(screen: GameScreen) {
    this.currentScreen = screen;
    this.callbacks.onScreenChange(screen);

    if (screen === 'playing') {
      this.requestPointerLock();
    } else {
      this.exitPointerLock();
    }
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      this.keys = {};
      this.mobileSprint = false;
      this.exitPointerLock();
    } else {
      this.requestPointerLock();
    }
  }

  public updateSettings(newSettings: Partial<GameSettings>) {
    const prevLang = this.settings.language;
    this.settings = { ...this.settings, ...newSettings };
    soundEngine.setMasterVolume(this.settings.masterVolume);
    if (newSettings.graphicsQuality) {
      this.applyGraphicsQuality(newSettings.graphicsQuality);
    }
    if (newSettings.language && newSettings.language !== prevLang) {
      this.syncLocalizedSteps();
      this.notifyActiveObjective();
    }
  }

  /**
   * Populates the exterior surroundings with procedurally generated forest assets,
   * including varied conifers, twisted bare horror trees, and dense shrub foliage.
   */
  public populateExteriorForest() {
    const forest = populateSurroundingForest((minX, maxX, minZ, maxZ) => {
      this.world.collisionBoxes.push({ minX, maxX, minZ, maxZ });
    });
    this.scene.add(forest.group);
  }

  // --- MOBILE VIRTUAL CONTROLS API ---
  public setMobileMove(x: number, y: number) {
    this.mobileMoveInput.set(x, y);
  }

  public setMobileSprint(sprint: boolean) {
    this.mobileSprint = sprint;
  }

  public rotateCameraDelta(deltaX: number, deltaY: number) {
    const sens = (this.settings.touchSensitivity || 1.2) * 0.0035;
    this.yaw -= deltaX * sens;
    const invert = this.settings.invertY ? -1 : 1;
    this.pitch -= deltaY * sens * invert;
    this.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, this.pitch));
  }

  public toggleFlashlight() {
    this.stats.flashlightOn = !this.stats.flashlightOn;
    soundEngine.playFlashlightClick(this.stats.flashlightOn);
    this.emitStatsIfChanged();
  }

  public toggleCrouch() {
    this.stats.isCrouched = !this.stats.isCrouched;
    this.targetHeight = this.stats.isCrouched ? 0.95 : 1.65;
    this.emitStatsIfChanged();
  }

  public interact() {
    if (this.dialogueState.active) {
      this.advanceDialogue();
      return;
    }
    if (this.nearbyCustomer) {
      this.startCustomerDialogue();
      return;
    }
    this.triggerInteraction();
  }

  // --- INTERACTION LOGIC (STRICT SEQUENTIAL ORDER) ---

  private triggerInteraction() {
    if (!this.activeItemNearby) return;
    const item = this.activeItemNearby;
    const t = getTranslations(this.settings.language).engine;

    // 3:00 AM Electrical Box Inspection (Restore Power, Hide Clown Statue & Spawn Leaning Clown)
    if (item.type === 'electrical_box' && this.powerOutageActive) {
      this.powerOutageActive = false;
      this.setStorePower(true);
      soundEngine.playPowerRestore();
      this.callbacks.onObjectiveCompletedNotice(t.notices.powerRestored);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);

      // Night 1 event: clown statue near cash register disappears once electricity is fixed
      if (this.world.clownStatue) {
        this.world.clownStatue.visible = false;
      }
      for (const box of this.world.collisionBoxes) {
        if (box.id === 'clown_statue') {
          box.enabled = false;
        }
      }

      // Clown appears secretly behind the rear-west corner leaning over to watch Duck
      this.clownState = 'watching';
      this.clownPos.set(-11.25, 0, -11.55);
      this.clownSpotLookTimer = 0;
      this.clownSightGraceTimer = 0.45;
      this.clownActor.group.position.copy(this.clownPos);
      this.clownActor.group.rotation.y = Math.atan2(
        this.playerPos.x - this.clownPos.x,
        this.playerPos.z - this.clownPos.z
      );
      this.clownActor.group.visible = true;
      this.clownActor.setPeekPose?.(true, performance.now() / 1000, 1);

      this.startDialogue(t.powerRestoredDialogue, true, 'power_restored');
      this.notifyActiveObjective();
      return;
    }

    // Restroom Toilet Flush (Ambient interaction)
    if (item.type === 'toilet_flush') {
      soundEngine.playToiletFlush();
      return;
    }

    // Throwing spoiled food into the indoor trash bin or outdoor dumpster after power outage
    if (
      (item.type === 'trash_bin' || item.type === 'outdoor_dumpster') &&
      this.mustDiscardFood &&
      this.stats.hasFoodInHand
    ) {
      if (item.type === 'outdoor_dumpster') {
        soundEngine.playOutdoorDumpsterDump();
      } else {
        soundEngine.playTrashBagRustle();
      }
      this.mustDiscardFood = false;
      this.stats.mustDiscardFood = false;
      this.stats.hasFoodInHand = false;
      this.emitStatsIfChanged();
      this.callbacks.onObjectiveCompletedNotice(t.notices.foodDiscarded);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
      this.notifyActiveObjective();
      return;
    }

    // Pick up Janitor Mop (required before cleaning puddles)
    if (item.type === 'mop_tool' && !this.stats.hasMopInHand) {
      soundEngine.playCleaningWipe();
      this.stats.hasMopInHand = true;
      if (this.world.mopInBucket) {
        this.world.mopInBucket.visible = false;
      }
      this.emitStatsIfChanged();
      this.callbacks.onObjectiveCompletedNotice(t.notices.mopPickedUp);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
      this.notifyActiveObjective();
      return;
    }

    // Customer food preparation at kitchen counter (5-second cook method)
    if (item.type === 'kitchen_prep_station') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder) {
        if (!this.isPreparingFood) {
          this.isPreparingFood = true;
          this.prepCountdown = 5.0;
          this.lastPrepSecLeft = 5;
          this.prepAudioTimer = 0;
          this.flickerBuzzTimer = 0;
          soundEngine.playFoodPreparation();
          soundEngine.playCoffeeBrewSteam();
          soundEngine.playFluorescentFlickerBuzz();
          this.callbacks.onObjectiveCompletedNotice(t.notices.prepStarted);
          this.notifyActiveObjective();
        } else {
          const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
          this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
        }
      } else if (this.orderPhase === 'ready_to_serve') {
        this.callbacks.onObjectiveCompletedNotice(t.notices.mealInHands);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
      } else {
        this.callbacks.onObjectiveCompletedNotice(t.notices.noPendingOrders);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      }
      return;
    }

    const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (!currentStep) return;

    // Shared 8-puddle mopping mechanic (requires visible mop in hand)
    if ((currentStep.id === 'mop_puddles' || currentStep.id === 'n2_mop_puddle') && item.type === 'hallway_spill') {
      if (!this.stats.hasMopInHand) {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.mopRequired);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      soundEngine.playCleaningWipe();
      this.mopSwingTimer = 0.35;
      item.completed = true;
      const mesh = this.world.interactiveMeshes.get(item.id);
      if (mesh) mesh.visible = false;

      this.nightState.puddlesMopped = (this.nightState.puddlesMopped || 0) + 1;
      currentStep.currentCount = this.nightState.puddlesMopped;
      currentStep.description =
        currentStep.id === 'mop_puddles'
          ? t.steps.mop_puddles.description(this.nightState.puddlesMopped)
          : t.steps.n2_mop_puddle.description(this.nightState.puddlesMopped);

      if (this.nightState.puddlesMopped >= 8) {
        this.nightState.hallwayMopped = true;
        this.stats.hasMopInHand = false;
        if (this.world.mopInBucket) {
          this.world.mopInBucket.visible = true;
        }
        this.emitStatsIfChanged();
        this.advanceObjective();
      } else {
        this.notifyActiveObjective();
      }
      return;
    }

    // --- NIGHT 1 INTERACTIONS ---
    if (this.nightState.night === 1) {
      // Step 0: Talk to outgoing employee John to take over the shift
      if (currentStep.id === 'talk_to_john' && item.type === 'employee_john') {
        this.startDialogue(t.johnDialogue, false, 'employee_john');
        return;
      }

      // Step 1: Clock in
      if (currentStep.id === 'clock_in' && item.type === 'time_clock') {
        soundEngine.playTimeClockPunch();
        this.nightState.clockedIn = true;
        this.advanceObjective();
        return;
      }

      // Step 2: Clean Tables (must clean 2 tables)
      if (currentStep.id === 'clean_tables' && item.type === 'clean_table') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;

        this.nightState.tablesCleaned += 1;
        currentStep.currentCount = this.nightState.tablesCleaned;
        currentStep.description = t.steps.clean_tables.description(this.nightState.tablesCleaned);

        if (this.nightState.tablesCleaned >= 2) {
          this.advanceObjective();
        } else {
          this.notifyActiveObjective();
        }
        return;
      }

      // Step 4: Collect Trash (must pick up 2 trash items)
      if (currentStep.id === 'collect_trash' && item.type === 'trash_item') {
        soundEngine.playTrashBagRustle();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;

        this.nightState.trashCollected += 1;
        this.stats.hasTrashInHand = true;
        currentStep.currentCount = this.nightState.trashCollected;
        currentStep.description = t.steps.collect_trash.description(this.nightState.trashCollected);

        if (this.nightState.trashCollected >= 2) {
          this.advanceObjective();
        } else {
          this.notifyActiveObjective();
        }
        this.emitStatsIfChanged();
        return;
      }

      // Step 5: Dump Trash outside in rear dumpster
      if (currentStep.id === 'dump_trash' && item.type === 'outdoor_dumpster') {
        soundEngine.playOutdoorDumpsterDump();
        this.nightState.trashDumped = true;
        this.stats.hasTrashInHand = false;
        this.emitStatsIfChanged();
        this.advanceObjective();
        return;
      }

      // Step 6: Check Kitchen Fryers & Grills
      if (currentStep.id === 'kitchen_fryers' && item.type === 'kitchen_switch') {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.nightState.kitchenShutDown = true;
        this.advanceObjective();
        return;
      }

      // Step 7: Security CCTV console
      if (currentStep.id === 'check_cctv' && item.type === 'cctv_monitor') {
        soundEngine.playCCTVSwitch();
        this.advanceObjective();
        this.setScreen('cctv');
        return;
      }

      // Step 8: Finish Shift STRICTLY at 6:00 AM (shift only ends when clock shows 6:00 AM)
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour >= 6) {
          if (!this.closingShiftTargetScreen) {
            soundEngine.playDoor(true);
            this.closingShiftTargetScreen = 'night1_complete';
            this.fadeAlpha = Math.max(this.fadeAlpha, 0.01);
            this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
          }
        } else {
          const hr = this.nightState.timeHour === 0 ? 12 : this.nightState.timeHour;
          const mn = this.nightState.timeMinute < 10 ? `0${this.nightState.timeMinute}` : this.nightState.timeMinute;
          this.callbacks.onObjectiveCompletedNotice(t.notices.shiftEnds6am(`${hr}:${mn} AM`));
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
        }
        return;
      }
    }

    // --- NIGHT 2 INTERACTIONS ---
    if (this.nightState.night === 2) {
      // Step 0: Talk to outgoing employee John (discusses missing former staff member)
      if (currentStep.id === 'talk_to_john' && item.type === 'employee_john') {
        this.startDialogue(t.johnDialogueNight2, false, 'employee_john');
        return;
      }

      // Step 1: Clock in
      if (currentStep.id === 'n2_clock_in' && item.type === 'time_clock') {
        soundEngine.playTimeClockPunch();
        this.advanceObjective();
        return;
      }

      // Step 2: Auxiliary breaker switch
      if (currentStep.id === 'n2_breaker' && item.id === 'office_switch') {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.advanceObjective();
        return;
      }

      // Step 4: Dump bundled cardboard outside
      if (currentStep.id === 'n2_cardboard') {
        if (item.type === 'cardboard_bundle') {
          soundEngine.playCleaningWipe();
          item.completed = true;
          const mesh = this.world.interactiveMeshes.get(item.id);
          if (mesh) mesh.visible = false;
          this.stats.hasCardboardInHand = true;
          this.emitStatsIfChanged();
          currentStep.description = t.steps.n2_cardboard.carryDesc;
          this.notifyActiveObjective();
          return;
        } else if (item.type === 'outdoor_dumpster' && this.stats.hasCardboardInHand) {
          soundEngine.playOutdoorDumpsterDump();
          this.stats.hasCardboardInHand = false;
          this.emitStatsIfChanged();
          this.advanceObjective();
          return;
        }
      }

      // Step 5: Relocated drive-thru order station check at cashier counter corner
      if (
        currentStep.id === 'n2_drive_thru' &&
        (item.type === 'drive_thru_order_station' || item.id === 'drive_thru_order_station' || item.type === 'drive_thru_window')
      ) {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.nightState.driveThruInspected = true;
        this.advanceObjective();
        return;
      }

      // Step 6: CCTV surveillance check -> advances to finish_shift (customers until 6:00 AM)
      if (currentStep.id === 'n2_cctv_final' && item.type === 'cctv_monitor') {
        soundEngine.playCCTVSwitch();
        this.advanceObjective();
        this.setScreen('cctv');
        return;
      }

      // Step 7: Finish Night 2 Shift STRICTLY at 6:00 AM
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour >= 6) {
          if (!this.closingShiftTargetScreen) {
            soundEngine.playDoor(true);
            this.closingShiftTargetScreen = 'night2_complete';
            this.fadeAlpha = Math.max(this.fadeAlpha, 0.01);
            this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
          }
        } else {
          const hr = this.nightState.timeHour === 0 ? 12 : this.nightState.timeHour;
          const mn = this.nightState.timeMinute < 10 ? `0${this.nightState.timeMinute}` : this.nightState.timeMinute;
          this.callbacks.onObjectiveCompletedNotice(t.notices.shiftEnds6am(`${hr}:${mn} AM`));
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
        }
        return;
      }
    }
  }

  // --- CCTV CAMERA SWITCHING ---

  public switchCCTV(camId: number) {
    if (camId >= 1 && camId <= 5) {
      soundEngine.playCCTVSwitch();
      this.nightState.cctvActiveCam = camId;
      this.callbacks.onNightStateUpdate({ ...this.nightState });
    }
  }

  public exitCCTV() {
    this.setScreen('playing');
  }

  // --- COLLISION RESOLUTION ---

  private checkCollision(x: number, z: number, radius: number = 0.35): { x: number; z: number } {
    let resX = x;
    let resZ = z;

    for (const box of this.world.collisionBoxes) {
      if (box.enabled === false) continue;
      const clampedX = Math.max(box.minX, Math.min(resX, box.maxX));
      const clampedZ = Math.max(box.minZ, Math.min(resZ, box.maxZ));

      const dx = resX - clampedX;
      const dz = resZ - clampedZ;
      const distSq = dx * dx + dz * dz;

      if (distSq < radius * radius && distSq > 0.00001) {
        const dist = Math.sqrt(distSq);
        const overlap = radius - dist;
        resX += (dx / dist) * overlap;
        resZ += (dz / dist) * overlap;
      }
    }

    return { x: resX, z: resZ };
  }

  // --- MAIN TICK LOOP ---

  private tick(now: number) {
    this.reqId = requestAnimationFrame(this.tick);

    const rawDt = (now - this.lastTime) / 1000;
    this.lastTime = now;
    const dt = Math.min(rawDt, 0.05);
    const clockDt = Math.min(Math.max(rawDt, 0), 1.0);

    if (this.currentScreen === 'playing' && !this.isPaused) {
      this.updateSimulation(dt, clockDt);
    } else if (this.currentScreen === 'menu') {
      // Outside-of-the-door cinematic view: camera faces the illuminated front entrance, McDonald's sign, ads, windows, and roof
      const t = now * 0.0004;
      const cx = Math.sin(t) * 1.8;
      const cz = 11.5 + Math.cos(t * 0.7) * 1.0;
      const cy = 2.4 + Math.sin(t * 0.5) * 0.2;
      this.camera.position.set(cx, cy, cz);
      this.camera.lookAt(0, 2.4, 6.0);
    }

    // Always update customer traffic, automatic sliding doors, and rain
    this.updateAutomaticSlidingDoors(dt);
    this.updateCustomerAI(dt);
    this.updateAtmosphere(dt, now / 1000);

    // Render Scene
    if (this.currentScreen === 'cctv') {
      const camConfig = this.world.cctvCameras[this.nightState.cctvActiveCam - 1];
      this.cctvCamera.position.copy(camConfig.position);
      this.cctvCamera.lookAt(camConfig.lookAt);
      this.renderer.render(this.scene, this.cctvCamera);
    } else {
      this.renderer.render(this.scene, this.camera);
    }
  }

  private updateSimulation(dt: number, clockDt: number) {
    // Smooth fade transition when exiting at 6:00 AM closing time
    if (this.closingShiftTargetScreen) {
      this.playerVel.set(0, 0, 0);
      this.fadeAlpha = Math.min(1.0, this.fadeAlpha + dt / 1.0);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      if (this.fadeAlpha >= 1.0) {
        const target = this.closingShiftTargetScreen;
        this.closingShiftTargetScreen = null;
        this.setScreen(target);
      }
      return;
    }

    // In-game Clock: Strictly 12 real-time minutes (720s) = 6 in-game hours (12:00 AM -> 6:00 AM)
    this.nightState.timeTotalSeconds += clockDt;
    const totalMinutes = Math.min(360, Math.floor((this.nightState.timeTotalSeconds / 720) * 360));
    const newHour = Math.min(6, Math.floor(totalMinutes / 60));
    const newMinute = newHour >= 6 ? 0 : totalMinutes % 60;

    const hourChanged = newHour !== this.nightState.timeHour;
    const minuteChanged = newMinute !== this.nightState.timeMinute;

    if (hourChanged) {
      soundEngine.playHourBell();
      if (newHour >= 6) {
        // Unlock front exit on both Night 1 & Night 2
        const t = getTranslations(this.settings.language).engine;
        const steps = this.nightState.night === 1 ? this.night1Steps : this.night2Steps;
        const lastStep = steps[steps.length - 1];
        if (lastStep) lastStep.description = t.steps.finish_shift.ready6am;
        const curLast = this.currentSteps[this.currentSteps.length - 1];
        if (curLast) curLast.description = t.steps.finish_shift.ready6am;
        this.nightState.timeHour = newHour;
        this.nightState.timeMinute = newMinute;
        this.notifyActiveObjective();
        this.callbacks.onObjectiveCompletedNotice(t.steps.finish_shift.ready6am);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4500);
      }
    }
    this.nightState.timeHour = newHour;
    this.nightState.timeMinute = newMinute;
    if (minuteChanged || hourChanged) {
      this.callbacks.onNightStateUpdate({ ...this.nightState });
    }

    // 3:00 AM Power Outage Event (Night 1)
    if (newHour >= 3 && newHour < 6 && !this.powerOutageTriggered && this.nightState.night === 1) {
      const t = getTranslations(this.settings.language).engine;
      this.powerOutageTriggered = true;
      this.powerOutageActive = true;
      this.setStorePower(false);
      soundEngine.playPowerOutage();

      if (this.stats.hasFoodInHand) {
        this.mustDiscardFood = true;
        this.stats.mustDiscardFood = true;
        this.emitStatsIfChanged();
      }

      // Cancel active cooking/order since power is out and customer refuses service
      this.isPreparingFood = false;
      this.prepCountdown = 0;
      this.lastPrepSecLeft = -1;
      this.orderPhase = 'none';
      this.activeCustomerOrder = null;
      this.pendingThankYouDialogue = false;
      this.currentDialogueCustomer = null;

      this.callbacks.onObjectiveCompletedNotice(t.notices.powerOutage);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4500);
      this.notifyActiveObjective();

      if (this.activeCustomerPerson && this.activeCustomerPerson.state !== 'leaving') {
        const custList = t.customers;
        const archIdx = this.activeCustomerPerson.archetypeIndex ?? 0;
        const custName = custList[archIdx % custList.length]?.name || this.activeCustomerPerson.archetypeName;
        this.pendingPowerOutageCustomerLeave = true;
        this.pendingPowerOutageDialogue = true;
        this.startDialogue(
          [{ speaker: custName, text: t.customerPowerOutageLeave }],
          false,
          this.activeCustomerPerson.id
        );
      } else if (!this.dialogueState.active) {
        this.startDialogue(t.powerOutageStartDialogue, true, 'power_outage_start');
      } else {
        this.pendingPowerOutageDialogue = true;
      }
    }

    // Smooth visual fade-in from black upon night start
    if (this.fadeAlpha > 0) {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - dt / 1.8);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
    }
    if (this.isPreparingFood && !this.powerOutageActive) {
      const t = getTranslations(this.settings.language).engine;
      this.prepCountdown = Math.max(0, this.prepCountdown - dt);
      this.prepAudioTimer += dt;
      this.flickerBuzzTimer += dt;

      // Periodic cooking sizzle and coffee machine steam
      if (this.prepAudioTimer >= 2.4) {
        this.prepAudioTimer = 0;
        soundEngine.playFoodPreparation();
        soundEngine.playCoffeeBrewSteam();
      }

      // Environmental horror flickering effect on kitchen light while food is being prepared!
      // Erratically flickers between blackout (0.03) and sharp surges (1.6 - 2.1)
      if (this.world && this.world.kitchenLight) {
        if (Math.random() < 0.32) {
          const isBlackout = Math.random() < 0.45;
          this.world.kitchenLight.intensity = isBlackout ? 0.03 : 1.55 + Math.random() * 0.45;
          if (isBlackout && this.flickerBuzzTimer >= 0.5) {
            this.flickerBuzzTimer = 0;
            soundEngine.playFluorescentFlickerBuzz();
          }
        } else {
          this.world.kitchenLight.intensity = 0.54 + (Math.random() - 0.5) * 0.18;
        }
      }

      // Refresh HUD objective description only when integer second changes
      const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
      if (secLeft !== this.lastPrepSecLeft) {
        this.lastPrepSecLeft = secLeft;
        this.notifyActiveObjective();
      }

      if (this.prepCountdown <= 0) {
        this.isPreparingFood = false;
        this.lastPrepSecLeft = -1;
        if (this.world && this.world.kitchenLight) {
          this.world.kitchenLight.intensity = 0.54; // restore dimly lit baseline
        }
        this.orderPhase = 'ready_to_serve';
        this.stats.hasFoodInHand = true;
        this.emitStatsIfChanged();
        soundEngine.playFoodPackaging();
        soundEngine.playObjectiveComplete();
        this.callbacks.onObjectiveCompletedNotice(t.notices.orderReady);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
        this.notifyActiveObjective();
      }
    }

    // Animate outgoing employee John NPC, 3 AM Secretive Clown, & seated Friends Group
    this.updateJohnNPC(dt);
    this.updatePowerOutageClown(dt, performance.now() / 1000);
    this.updateEatingFriendsGroup(dt, performance.now() / 1000);

    // Positional / area-faded cricket ambience behind the restaurant
    let cricketVol = 0.0;
    if (this.playerPos.z < -6.0) {
      // Outdoor rear garbage disposal & dumpster area
      cricketVol = 0.22;
    } else if (this.playerPos.z >= -6.0 && this.playerPos.z <= -3.0 && this.playerPos.x > 1.2) {
      // Inside near rear service door (faint distant chirping)
      cricketVol = 0.04;
    } else {
      // Inside dining room, kitchen, or security office
      cricketVol = 0.0;
    }
    soundEngine.setCricketVolume(cricketVol);

    // Movement & Controls
    this.updatePlayerMovement(dt);

    // Unlimited Flashlight (zero allocations)
    this.flashlight.visible = this.stats.flashlightOn;
    this.flashlight.position.copy(this.camera.position);
    this.camera.getWorldDirection(this._tmpCamDir);
    this.flashlightTarget.position.copy(this.camera.position).addScaledVector(this._tmpCamDir, 10);
    this.playerDimLight.position.copy(this.camera.position);

    // Proximity to interactive items
    this.updateInteractions();
  }

  /**
   * Surface acoustics detection based on player position:
   * - Tile: lobby, cashier counter, kitchen, rear hallway
   * - Carpet: dining booth seating areas, security office
   * - Asphalt: outdoor parking lot, sidewalk, rear dumpster pad
   * - Grass: surrounding forest edges
   */
  private getSurfaceAtPosition(x: number, z: number): 'tile' | 'carpet' | 'asphalt' | 'grass' {
    if (z > 6.0 || z < -6.0) {
      if (x < -22 || x > 22 || z > 28) return 'grass';
      return 'asphalt';
    }
    // Carpeted dining booth seating bays
    const inBoothLeft = x <= -3.8 && x >= -6.8 && z >= 0.8 && z <= 5.4;
    const inBoothRight = x >= 3.8 && x <= 6.8 && z >= 0.8 && z <= 5.4;
    // Security office floor mat
    const inOffice = x <= -3.0 && x >= -6.8 && z >= -2.8 && z <= -0.5;
    if (inBoothLeft || inBoothRight || inOffice) {
      return 'carpet';
    }
    // Polished ceramic fast food tiles
    return 'tile';
  }

  private dampAngle(current: number, target: number, lambda: number, dt: number): number {
    const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + diff * (1 - Math.exp(-lambda * dt));
  }

  private getDialogueNpcFaceTarget(): { x: number; y: number; z: number } | null {
    if (!this.dialogueState.active || this.dialogueState.isMonologue) return null;
    if (this.dialogueState.npcId === 'employee_john' && this.johnState !== 'gone') {
      return { x: this.johnPos[0], y: 1.62, z: this.johnPos[2] };
    }
    if (this.activeCustomerPerson && this.dialogueState.npcId === this.activeCustomerPerson.id) {
      return {
        x: this.activeCustomerPerson.currentPos[0],
        y: 1.62,
        z: this.activeCustomerPerson.currentPos[2],
      };
    }
    return null;
  }

  private updatePlayerMovement(dt: number) {
    this.playerHeight = THREE.MathUtils.damp(this.playerHeight, this.targetHeight, 10, dt);

    // Lock player walking movement while dialogue or monologue is open & focus camera on speaker's face
    if (this.dialogueState.active) {
      this.playerVel.set(0, 0, 0);
      this.playerPos.y = this.playerHeight;
      this.camera.position.copy(this.playerPos);

      const faceTarget = this.getDialogueNpcFaceTarget();
      if (faceTarget) {
        const dx = faceTarget.x - this.playerPos.x;
        const dy = faceTarget.y - this.playerPos.y;
        const dz = faceTarget.z - this.playerPos.z;
        const horizDist = Math.hypot(dx, dz);
        if (horizDist > 0.05) {
          const targetYaw = Math.atan2(-dx, -dz);
          const targetPitch = THREE.MathUtils.clamp(
            Math.atan2(dy, horizDist),
            -Math.PI / 2.2,
            Math.PI / 2.2
          );
          this.yaw = this.dampAngle(this.yaw, targetYaw, 10, dt);
          this.pitch = THREE.MathUtils.damp(this.pitch, targetPitch, 10, dt);
        }
      }

      this._tmpLookTarget
        .copy(this.playerPos)
        .add(
          this._tmpCamDir.set(
            Math.cos(this.pitch) * -Math.sin(this.yaw),
            Math.sin(this.pitch),
            Math.cos(this.pitch) * -Math.cos(this.yaw)
          )
        );
      this.camera.lookAt(this._tmpLookTarget);
      return;
    }

    const wantsSprint =
      (this.keys['ShiftLeft'] ||
        this.keys['ShiftRight'] ||
        this.keys['Shift'] ||
        this.mobileSprint) &&
      !this.stats.isCrouched;
    this.stats.isSprinting = wantsSprint;
    this.stats.stamina = 100;

    this._tmpForward.set(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    this._tmpRight.set(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    this._tmpMoveDir.set(0, 0, 0);
    if (this.keys['KeyW']) this._tmpMoveDir.add(this._tmpForward);
    if (this.keys['KeyS']) this._tmpMoveDir.sub(this._tmpForward);
    if (this.keys['KeyA']) this._tmpMoveDir.sub(this._tmpRight);
    if (this.keys['KeyD']) this._tmpMoveDir.add(this._tmpRight);

    // Apply mobile virtual joystick movement input
    if (this.mobileMoveInput.lengthSq() > 0.001) {
      this._tmpMoveDir.addScaledVector(this._tmpRight, this.mobileMoveInput.x);
      this._tmpMoveDir.addScaledVector(this._tmpForward, -this.mobileMoveInput.y);
    }

    const isMoving = this._tmpMoveDir.lengthSq() > 0.001;
    if (isMoving) {
      this._tmpMoveDir.normalize();
      const speed = this.stats.isCrouched ? 1.6 : this.stats.isSprinting ? 5.2 : 2.8;
      this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, this._tmpMoveDir.x * speed, 14, dt);
      this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, this._tmpMoveDir.z * speed, 14, dt);

      this.footstepTimer += dt;
      const stepInterval = this.stats.isSprinting ? 0.28 : this.stats.isCrouched ? 0.58 : 0.42;
      if (this.footstepTimer > stepInterval) {
        this.footstepTimer = 0;
        this.isLeftFoot = !this.isLeftFoot;
        const pan = this.isLeftFoot ? -0.28 : 0.28;
        const surface = this.getSurfaceAtPosition(this.playerPos.x, this.playerPos.z);
        soundEngine.playFootstep(surface, this.stats.isSprinting, this.stats.isCrouched, pan);
      }
    } else {
      this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, 0, 16, dt);
      this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, 0, 16, dt);
    }

    const nextX = this.playerPos.x + this.playerVel.x * dt;
    const nextZ = this.playerPos.z + this.playerVel.z * dt;
    const resolved = this.checkCollision(nextX, nextZ);

    this.playerPos.x = resolved.x;
    this.playerPos.z = resolved.z;
    this.playerPos.y = this.playerHeight;

    this.camera.position.copy(this.playerPos);
    if (isMoving) {
      const bobCycle = performance.now() * 0.012 * (this.stats.isSprinting ? 1.4 : 1.0);
      this.camera.position.y += Math.sin(bobCycle) * 0.03;
    }

    this._tmpLookTarget
      .copy(this.playerPos)
      .add(
        this._tmpCamDir.set(
          Math.cos(this.pitch) * -Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * -Math.cos(this.yaw)
        )
      );
    this.camera.lookAt(this._tmpLookTarget);

    const nowTime = performance.now() * 0.003;

    // Visible Held Meal Viewmodel (Tray with Chicken Bucket, Coffee, Fries)
    if (this.heldMealMesh) {
      this.heldMealMesh.visible = !!this.stats.hasFoodInHand;
      if (this.heldMealMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.025 : 0.015) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldMealMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldMealMesh.position.x = 0.24 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Mop Viewmodel + Mopping Sweep Animation
    if (this.mopSwingTimer > 0) {
      this.mopSwingTimer = Math.max(0, this.mopSwingTimer - dt);
    }
    if (this.heldMopMesh) {
      this.heldMopMesh.visible = !!this.stats.hasMopInHand && !this.stats.hasFoodInHand;
      if (this.heldMopMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.022 : 0.013) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        const swingPhase = this.mopSwingTimer > 0 ? Math.sin((1 - this.mopSwingTimer / 0.35) * Math.PI * 2) : 0;
        this.heldMopMesh.position.x = 0.28 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5) + swingPhase * 0.14;
        this.heldMopMesh.position.y = -0.25 + Math.sin(nowTime * bobSpeed) * bobAmount - Math.abs(swingPhase) * 0.06;
        this.heldMopMesh.rotation.z = 0.04 + swingPhase * 0.35;
        this.heldMopMesh.rotation.x = 0.08 - Math.abs(swingPhase) * 0.22;
      }
    }

    this.emitStatsIfChanged();
  }

  private updateJohnNPC(dt: number) {
    const john = this.world?.employeeJohn;
    if (!john || this.johnState === 'gone') return;
    const limbs = john.userData.limbs;

    if (this.johnState === 'waiting') {
      const isTalkingToDuck = this.dialogueState.active && this.dialogueState.npcId === 'employee_john';
      if (isTalkingToDuck) {
        const targetYaw = Math.atan2(
          this.playerPos.x - this.johnPos[0],
          this.playerPos.z - this.johnPos[2]
        );
        john.rotation.y = this.dampAngle(john.rotation.y, targetYaw, 8, dt);
        if (limbs) {
          limbs.head.rotation.y = THREE.MathUtils.damp(limbs.head.rotation.y, 0, 10, dt);
          limbs.armR.rotation.x = THREE.MathUtils.damp(limbs.armR.rotation.x, 0, 10, dt);
        }
      } else {
        // Gentle idle breathing/glance towards front doors
        this.johnWalkProgress += dt * 1.8;
        john.rotation.y = this.dampAngle(john.rotation.y, -0.25, 5, dt);
        if (limbs) {
          limbs.head.rotation.y = Math.sin(this.johnWalkProgress * 0.6) * 0.08;
          limbs.armR.rotation.x = Math.sin(this.johnWalkProgress) * 0.04;
        }
      }
      return;
    }

    if (this.johnState === 'leaving') {
      // Phase 1: walk cleanly up to doorway threshold Z=5.6 (well past 5.2), then Phase 2: walk out to parking lot Z=15.0
      const targetX = 0;
      const targetZ = this.johnPos[2] < 5.2 ? 5.6 : 15.0;
      const dx = targetX - this.johnPos[0];
      const dz = targetZ - this.johnPos[2];
      const dist = Math.sqrt(dx * dx + dz * dz);

      if (dist > 0.25) {
        const speed = 2.0;
        this.johnPos[0] += (dx / dist) * speed * dt;
        this.johnPos[2] += (dz / dist) * speed * dt;
        john.position.set(this.johnPos[0], 0, this.johnPos[2]);
        john.rotation.y = Math.atan2(dx, dz);

        this.johnWalkProgress += dt * 6.0;
        if (limbs) {
          const swing = Math.sin(this.johnWalkProgress);
          limbs.legL.rotation.x = swing * 0.5;
          limbs.legR.rotation.x = -swing * 0.5;
          limbs.armL.rotation.x = -swing * 0.4;
          limbs.armR.rotation.x = swing * 0.4;
          limbs.head.rotation.y = 0;
          john.position.y = Math.abs(swing) * 0.03;
        }
      } else if (this.johnPos[2] >= 14.2) {
        john.visible = false;
        this.johnState = 'gone';
      }
    }
  }

  private updatePowerOutageClown(dt: number, timeSec: number) {
    if (!this.clownActor) return;

    // Night 2 last-guest door-peeking event (leans around the front sliding door glass opening)
    if (this.n2LastGuestClownPeeking) {
      this.clownActor.group.visible = true;
      this.clownActor.group.position.set(-1.42, 0, 6.28);
      this.clownActor.group.rotation.y = Math.atan2(
        this.playerPos.x - -1.42,
        this.playerPos.z - 6.28
      );
      this.clownActor.updateAnimation(timeSec, 0, false);
      this.clownActor.setPeekPose?.(true, timeSec, 1);
      return;
    }

    if (this.clownState === 'watching') {
      // Lean over sideways around rear-west corner while silently watching Duck
      const targetYaw = Math.atan2(
        this.playerPos.x - this.clownPos.x,
        this.playerPos.z - this.clownPos.z
      );
      this.clownActor.group.rotation.y = targetYaw;
      this.clownActor.updateAnimation(timeSec, 0, false);
      this.clownActor.setPeekPose?.(true, timeSec, 1);

      // Once Duck finishes saying only the circuit breaker was tripped, require Duck to directly see the clown (unobstructed by walls) before it flees
      if (!this.dialogueState.active) {
        if (this.clownSightGraceTimer > 0) {
          this.clownSightGraceTimer = Math.max(0, this.clownSightGraceTimer - dt);
        } else {
          this.camera.getWorldDirection(this._tmpCamDir);
          this._tmpClownEye.set(this.clownPos.x, 1.55, this.clownPos.z);
          this._tmpToClown.subVectors(this._tmpClownEye, this.camera.position);
          const dist = this._tmpToClown.length();
          if (dist > 0.01) {
            this._tmpToClown.divideScalar(dist);
            const dot = this._tmpCamDir.dot(this._tmpToClown);
            if (dot > 0.82 && dist < 22) {
              this._clownRaycaster.set(this.camera.position, this._tmpToClown);
              this._clownRaycaster.far = dist;
              const wallHits = this._clownRaycaster.intersectObjects(this.world.wallMeshes, false);
              const blockedByWall = wallHits.length > 0 && wallHits[0].distance < dist - 0.35;

              if (!blockedByWall) {
                this.clownSpotLookTimer += dt;
                if (this.clownSpotLookTimer >= 0.30) {
                  // Clown sees Duck directly looking -> panic flee into the dark woods!
                  this.clownState = 'running_away';
                  this.clownSpottedByDuck = true;
                  this.clownActor.setPeekPose?.(false, timeSec);
                  soundEngine.playClownSpottedScare();
                }
              } else {
                this.clownSpotLookTimer = 0;
              }
            } else {
              this.clownSpotLookTimer = Math.max(0, this.clownSpotLookTimer - dt * 0.5);
            }
          }
        }
      }
    } else if (this.clownState === 'running_away') {
      // Sprint out through the dark rear-west corner gap (-12.6, -12.6) -> woods (-18.5, -13.4)
      const waypointX = this.clownPos.x > -12.2 ? -12.6 : -18.5;
      const waypointZ = this.clownPos.x > -12.2 ? -12.6 : -13.4;
      const dx = waypointX - this.clownPos.x;
      const dz = waypointZ - this.clownPos.z;
      const dist = Math.sqrt(dx * dx + dz * dz);

      const speed = 6.2;
      if (dist > 0.25) {
        this.clownPos.x += (dx / dist) * speed * dt;
        this.clownPos.z += (dz / dist) * speed * dt;
        this.clownActor.group.position.copy(this.clownPos);
        this.clownActor.group.rotation.y = Math.atan2(dx, dz);
        this.clownActor.updateAnimation(timeSec, speed, true);
      } else if (this.clownPos.x <= -17.8 || (waypointX === -18.5 && dist <= 0.35)) {
        this.clownActor.group.visible = false;
        this.clownState = 'fled';
      }
    }

    // Trigger warehouse monologue when Duck enters the back-of-house warehouse/kitchen after spotting the clown
    if (
      this.clownSpottedByDuck &&
      !this.warehouseReactionTriggered &&
      !this.dialogueState.active &&
      this.playerPos.z >= -5.7 &&
      this.playerPos.z <= 0.1 &&
      this.playerPos.x >= -1.0 &&
      this.playerPos.x <= 8.0
    ) {
      this.warehouseReactionTriggered = true;
      const t = getTranslations(this.settings.language).engine;
      this.startDialogue(t.warehouseClownReactionDialogue, true, 'warehouse_reaction');
    }
  }

  // --- AUTOMATIC SLIDING GLASS DOORS WITH ENTRANCE CHIME ---

  private updateAutomaticSlidingDoors(dt: number) {
    // Check if player, customer, or leaving John is near front entrance (X = 0, Z = 6.0)
    const doorPos = this._tmpDoorPos.set(0, 0, 6.0);
    const distPlayer = this.playerPos.distanceTo(doorPos);
    let distCustomer = Infinity;
    let distJohn = Infinity;

    if (this.activeCustomerPerson) {
      const cp = this.activeCustomerPerson.currentPos;
      distCustomer = this._tmpCheckPos.set(cp[0], cp[1], cp[2]).distanceTo(doorPos);
    }

    if (this.johnState === 'leaving') {
      distJohn = this._tmpCheckPos.set(this.johnPos[0], this.johnPos[1], this.johnPos[2]).distanceTo(doorPos);
    }

    let distFriends = Infinity;
    if (this.eatingFriendsGroup && this.eatingFriendsGroup.members[0]) {
      const fPos = this.eatingFriendsGroup.members[0].pos;
      distFriends = this._tmpCheckPos.set(fPos[0], 0, fPos[2]).distanceTo(doorPos);
    }

    const isNearDoor = distPlayer < 2.8 || distCustomer < 2.8 || distJohn < 2.8 || distFriends < 2.8;
    const targetOpen = isNearDoor ? 1.0 : 0.0;

    const prevOpen = this.nightState.slidingDoorOpenAmount;
    this.nightState.slidingDoorOpenAmount = THREE.MathUtils.damp(
      this.nightState.slidingDoorOpenAmount,
      targetOpen,
      6.0,
      dt
    );

    // Motor sound when opening starts
    if (prevOpen < 0.05 && this.nightState.slidingDoorOpenAmount >= 0.05) {
      soundEngine.playSlidingDoorMotor();
    }

    // Animate sliding glass panels
    // Left panel slides left from -0.48 to -1.35
    // Right panel slides right from 0.48 to 1.35
    const slideOffset = this.nightState.slidingDoorOpenAmount * 0.85;
    this.world.slidingDoors.leftGlass.position.x = -0.48 - slideOffset;
    this.world.slidingDoors.rightGlass.position.x = 0.48 + slideOffset;

    // Check customer passing through doorway threshold (crossing Z = 6.0 into restaurant)
    if (this.activeCustomerPerson) {
      const cz = this.activeCustomerPerson.currentPos[2];
      const cx = this.activeCustomerPerson.currentPos[0];
      if (
        !this.frontChimePlayedForCurrentCustomer &&
        cz <= 5.8 &&
        cz >= 4.0 &&
        Math.abs(cx) < 2.0
      ) {
        this.frontChimePlayedForCurrentCustomer = true;
        soundEngine.playEntranceChime(); // Short, clear "ding-dong!" entrance chime!
      }
    }
  }

  // --- CUSTOMER VEHICLE & WALK-IN AI ---

  private updateCustomerAI(dt: number) {
    // 1. Customer Arrival Gate:
    // Customers must NOT enter the restaurant before Duck finishes opening preparation tasks!
    if (!this.isCustomerArrivalUnlocked()) {
      return;
    }

    // 2. Spawning arriving customer car (cap Night 1 & Night 2 after last guest or at 6 AM)
    if (!this.activeCustomerCar && !this.activeCustomerPerson) {
      if (this.nightState.timeHour >= 6) {
        return;
      }
      if (
        this.nightState.night === 1 &&
        this.night1GuestsServed >= this.night1QueueIndices.length
      ) {
        return;
      }
      if (
        this.nightState.night === 2 &&
        (this.n2LastGuestTriggered ||
          this.night2GuestsCount >= this.night2QueueIndices.length ||
          this.nightState.timeHour >= 5)
      ) {
        return;
      }
      this.customerSpawnTimer -= dt;
      if (this.customerSpawnTimer <= 0) {
        this.customerSpawnTimer =
          this.nightState.night === 2 ? 15 + Math.random() * 6 : 20 + Math.random() * 10;
        this.spawnCustomerCar();
      }
    }

    // 3. Animate arriving car
    if (this.activeCustomerCar) {
      const car = this.activeCustomerCar;
      if (car.state === 'driving_in') {
        car.progress += dt * 0.4; // 2.5s travel
        const startX = 25;
        const endX = this.world.parkingSpots[car.parkingSpotIndex].position.x;
        const currentX = THREE.MathUtils.lerp(startX, endX, Math.min(1, car.progress));
        const currentZ = THREE.MathUtils.lerp(24, 18, Math.min(1, car.progress));

        car.meshGroup.position.set(currentX, 0, currentZ);
        car.meshGroup.rotation.y = Math.PI / 2;

        if (car.progress >= 1.0) {
          car.state = 'parking';
          car.progress = 0;
          soundEngine.playCarArrival();
        }
      } else if (car.state === 'parking') {
        car.progress += dt * 0.5;
        const spotPos = this.world.parkingSpots[car.parkingSpotIndex].position;
        const startZ = 18;
        const currentZ = THREE.MathUtils.lerp(startZ, spotPos.z, Math.min(1, car.progress));

        car.meshGroup.position.set(spotPos.x, 0, currentZ);
        car.meshGroup.rotation.y = 0; // Parked straight in stall

        if (car.progress >= 1.0) {
          car.state = 'parked';
          // Customer steps out of car!
          this.spawnCustomerFromCar(spotPos.x, spotPos.z);
        }
      }
    }

    // 4. Animate customer person walking to restaurant front entrance
    if (this.activeCustomerPerson) {
      const person = this.activeCustomerPerson;
      const limbs = person.meshGroup.userData.limbs;
      const companions = person.companionMeshes || [];
      const compOffsets: [number, number][] = [
        [-0.62, 0.38],
        [0.62, 0.38],
      ];

      const syncCompanionsWalking = (swing: number, facingY: number, strideYaw: number) => {
        companions.forEach((cm, idx) => {
          const off = compOffsets[idx] || [0, 0];
          const cosR = Math.cos(facingY);
          const sinR = Math.sin(facingY);
          const wx = person.currentPos[0] + off[0] * cosR + off[1] * sinR;
          const wz = person.currentPos[2] - off[0] * sinR + off[1] * cosR;
          cm.position.set(wx, Math.abs(swing) * 0.035, wz);
          cm.rotation.y = facingY;
          const cLimbs = cm.userData.limbs;
          if (cLimbs) {
            const phase = idx === 0 ? swing : -swing;
            cLimbs.legL.rotation.x = phase * 0.52;
            cLimbs.legR.rotation.x = -phase * 0.52;
            cLimbs.armL.rotation.x = -phase * 0.42;
            cLimbs.armR.rotation.x = phase * 0.42;
            cLimbs.head.rotation.y = strideYaw;
          }
        });
      };

      if (person.state === 'walking_to_door') {
        const targetX = 0;
        const targetZ = 5.0;

        const dx = targetX - person.currentPos[0];
        const dz = targetZ - person.currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.15) {
          person.currentPos[0] += (dx / dist) * person.speed * dt;
          person.currentPos[2] += (dz / dist) * person.speed * dt;
          const facing = Math.atan2(dx, dz);
          person.meshGroup.position.set(person.currentPos[0], 0, person.currentPos[2]);
          person.meshGroup.rotation.y = facing;

          person.walkProgress += dt * 6.2;
          const swing = Math.sin(person.walkProgress);
          const headYaw = Math.sin(person.walkProgress * 0.5) * 0.08;
          if (limbs) {
            limbs.legL.rotation.x = swing * 0.52;
            limbs.legR.rotation.x = -swing * 0.52;
            limbs.armL.rotation.x = -swing * 0.42;
            limbs.armR.rotation.x = swing * 0.42;
            limbs.head.rotation.y = headYaw;
            person.meshGroup.position.y = Math.abs(swing) * 0.035;
          }
          syncCompanionsWalking(swing, facing, headYaw);
        } else {
          person.state = 'inside_counter';
          person.walkProgress = 0;
        }
      } else if (person.state === 'inside_counter') {
        const targetX = 3.3;
        const targetZ = 1.52;

        const dx = targetX - person.currentPos[0];
        const dz = targetZ - person.currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.1) {
          person.currentPos[0] += (dx / dist) * person.speed * dt;
          person.currentPos[2] += (dz / dist) * person.speed * dt;
          const facing = Math.atan2(dx, dz);
          person.meshGroup.position.set(person.currentPos[0], 0, person.currentPos[2]);
          person.meshGroup.rotation.y = facing;

          person.walkProgress += dt * 6.2;
          const swing = Math.sin(person.walkProgress);
          const headYaw = Math.sin(person.walkProgress * 0.5) * 0.08;
          if (limbs) {
            limbs.legL.rotation.x = swing * 0.52;
            limbs.legR.rotation.x = -swing * 0.52;
            limbs.armL.rotation.x = -swing * 0.42;
            limbs.armR.rotation.x = swing * 0.42;
            limbs.head.rotation.y = headYaw;
            person.meshGroup.position.y = Math.abs(swing) * 0.035;
          }
          syncCompanionsWalking(swing, facing, headYaw);
        } else {
          person.state = 'seated';
          person.walkProgress = 0;
          person.meshGroup.rotation.y = Math.PI;
        }
      } else if (person.state === 'seated') {
        const dxToDuck = this.playerPos.x - person.currentPos[0];
        const dzToDuck = this.playerPos.z - person.currentPos[2];
        const distToDuck = Math.hypot(dxToDuck, dzToDuck);
        const isTalkingToDuck = this.dialogueState.active && this.dialogueState.npcId === person.id;
        const desiredRot =
          isTalkingToDuck || distToDuck < 3.4 ? Math.atan2(dxToDuck, dzToDuck) : Math.PI;
        person.meshGroup.rotation.y = this.dampAngle(person.meshGroup.rotation.y, desiredRot, 8, dt);

        if (limbs) {
          limbs.legL.rotation.x = THREE.MathUtils.damp(limbs.legL.rotation.x, 0, 10, dt);
          limbs.legR.rotation.x = THREE.MathUtils.damp(limbs.legR.rotation.x, 0, 10, dt);
          limbs.armL.rotation.x = THREE.MathUtils.damp(limbs.armL.rotation.x, 0, 10, dt);
          limbs.armR.rotation.x = THREE.MathUtils.damp(limbs.armR.rotation.x, 0, 10, dt);
          limbs.head.rotation.y = THREE.MathUtils.damp(limbs.head.rotation.y, 0, 10, dt);
          person.meshGroup.position.y = THREE.MathUtils.damp(person.meshGroup.position.y, 0, 10, dt);
        }

        // Keep companions standing neatly behind the leader facing Duck/counter
        const standOffsets: [number, number][] = [
          [-0.58, 0.52],
          [0.58, 0.52],
        ];
        companions.forEach((cm, idx) => {
          const off = standOffsets[idx] || [0, 0.5];
          const tx = person.currentPos[0] + off[0];
          const tz = person.currentPos[2] + off[1];
          cm.position.x = THREE.MathUtils.damp(cm.position.x, tx, 6, dt);
          cm.position.z = THREE.MathUtils.damp(cm.position.z, tz, 6, dt);
          cm.position.y = THREE.MathUtils.damp(cm.position.y, 0, 10, dt);
          const cRot = Math.atan2(this.playerPos.x - cm.position.x, this.playerPos.z - cm.position.z);
          cm.rotation.y = this.dampAngle(cm.rotation.y, distToDuck < 4.0 ? cRot : Math.PI, 6, dt);
          const cLimbs = cm.userData.limbs;
          if (cLimbs) {
            cLimbs.legL.rotation.x = THREE.MathUtils.damp(cLimbs.legL.rotation.x, 0, 10, dt);
            cLimbs.legR.rotation.x = THREE.MathUtils.damp(cLimbs.legR.rotation.x, 0, 10, dt);
            cLimbs.armL.rotation.x = THREE.MathUtils.damp(cLimbs.armL.rotation.x, 0, 10, dt);
            cLimbs.armR.rotation.x = THREE.MathUtils.damp(cLimbs.armR.rotation.x, 0, 10, dt);
          }
        });

        if (!this.dialogueState.active || this.dialogueState.npcId !== person.id) {
          person.walkProgress += dt;
        }
        if (person.walkProgress >= 45 && this.orderPhase === 'none') {
          person.state = 'leaving';
          person.walkProgress = 0;
        }
      } else if (person.state === 'leaving') {
        let targetX = 0;
        let targetZ = 6.2;
        const spotPos = this.activeCustomerCar
          ? this.world.parkingSpots[this.activeCustomerCar.parkingSpotIndex]?.position
          : null;

        if (person.currentPos[2] >= 5.8 && spotPos) {
          targetX = spotPos.x;
          targetZ = spotPos.z;
        }

        const dx = targetX - person.currentPos[0];
        const dz = targetZ - person.currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.25) {
          person.currentPos[0] += (dx / dist) * person.speed * dt;
          person.currentPos[2] += (dz / dist) * person.speed * dt;
          const facing = Math.atan2(dx, dz);
          person.meshGroup.position.set(person.currentPos[0], 0, person.currentPos[2]);
          person.meshGroup.rotation.y = facing;

          person.walkProgress += dt * 6.2;
          const swing = Math.sin(person.walkProgress);
          if (limbs) {
            limbs.legL.rotation.x = swing * 0.52;
            limbs.legR.rotation.x = -swing * 0.52;
            limbs.armL.rotation.x = -swing * 0.42;
            limbs.armR.rotation.x = swing * 0.42;
            person.meshGroup.position.y = Math.abs(swing) * 0.035;
          }
          syncCompanionsWalking(swing, facing, 0);
        } else if (person.currentPos[2] >= 5.8) {
          companions.forEach((cm) => this.scene.remove(cm));
          this.scene.remove(person.meshGroup);
          this.activeCustomerPerson = null;
          if (this.activeCustomerCar) {
            this.scene.remove(this.activeCustomerCar.meshGroup);
            this.activeCustomerCar = null;
          }
        }
      }
    }
  }

  private updateEatingFriendsGroup(dt: number, timeSec: number) {
    const fg = this.eatingFriendsGroup;
    if (!fg) return;

    const walkSpeed = 1.75;
    const aisleWaypoints: [number, number][] = [
      [3.15, 4.1],
      [3.35, 4.4],
      [3.25, 3.65],
    ];

    const moveToward = (
      m: { mesh: THREE.Group; pos: [number, number, number]; seatPos: [number, number, number]; seatRotY: number },
      tx: number,
      tz: number,
      idx: number
    ): boolean => {
      const dx = tx - m.pos[0];
      const dz = tz - m.pos[2];
      const d = Math.hypot(dx, dz);
      const limbs = m.mesh.userData.limbs;
      if (d <= 0.14) {
        if (limbs) {
          limbs.legL.rotation.x = 0;
          limbs.legR.rotation.x = 0;
          limbs.armL.rotation.x = 0;
          limbs.armR.rotation.x = 0;
        }
        m.mesh.position.y = 0;
        return true;
      }
      m.pos[0] += (dx / d) * walkSpeed * dt;
      m.pos[2] += (dz / d) * walkSpeed * dt;
      m.mesh.position.set(m.pos[0], 0, m.pos[2]);
      m.mesh.rotation.y = Math.atan2(dx, dz);
      const swing = Math.sin(fg.walkProgress + idx * 0.9);
      if (limbs) {
        limbs.legL.rotation.x = swing * 0.5;
        limbs.legR.rotation.x = -swing * 0.5;
        limbs.armL.rotation.x = -swing * 0.38;
        limbs.armR.rotation.x = swing * 0.38;
        m.mesh.position.y = Math.abs(swing) * 0.03;
      }
      return false;
    };

    if (fg.state === 'to_aisle') {
      fg.walkProgress += dt * 6.0;
      let allArrived = true;
      fg.members.forEach((m, idx) => {
        const wp = aisleWaypoints[idx] || [3.2, 4.2];
        if (!moveToward(m, wp[0], wp[1], idx)) allArrived = false;
      });
      if (allArrived) {
        fg.state = 'to_seats';
      }
    } else if (fg.state === 'to_seats') {
      fg.walkProgress += dt * 5.2;
      let allSeated = true;
      fg.members.forEach((m, idx) => {
        if (!moveToward(m, m.seatPos[0], m.seatPos[2], idx)) {
          allSeated = false;
        }
      });
      if (allSeated) {
        fg.state = 'eating';
      }
    } else if (fg.state === 'eating') {
      fg.eatTimer -= dt;
      fg.members.forEach((m, idx) => {
        m.mesh.position.x = m.seatPos[0];
        m.mesh.position.z = m.seatPos[2];
        m.mesh.position.y = THREE.MathUtils.damp(m.mesh.position.y, -0.32, 10, dt);
        m.mesh.rotation.y = this.dampAngle(m.mesh.rotation.y, m.seatRotY, 8, dt);
        const limbs = m.mesh.userData.limbs;
        if (limbs) {
          limbs.legL.rotation.x = THREE.MathUtils.damp(limbs.legL.rotation.x, -Math.PI / 2, 10, dt);
          limbs.legR.rotation.x = THREE.MathUtils.damp(limbs.legR.rotation.x, -Math.PI / 2, 10, dt);
          limbs.armL.rotation.x = THREE.MathUtils.damp(limbs.armL.rotation.x, -0.45, 8, dt);
          limbs.armR.rotation.x = -0.68 + Math.sin(timeSec * 2.6 + idx * 1.4) * 0.22;
          limbs.head.rotation.y = Math.sin(timeSec * 1.4 + idx * 1.7) * 0.18;
          limbs.head.rotation.x = Math.sin(timeSec * 2.2 + idx) * 0.06 + 0.08;
        }
      });

      if (fg.eatTimer <= 0) {
        if (fg.trayMesh) {
          this.scene.remove(fg.trayMesh);
          fg.trayMesh = null;
        }
        fg.members.forEach((m) => {
          m.mesh.position.y = 0;
          const limbs = m.mesh.userData.limbs;
          if (limbs) {
            limbs.legL.rotation.x = 0;
            limbs.legR.rotation.x = 0;
            limbs.armL.rotation.x = 0;
            limbs.armR.rotation.x = 0;
            limbs.head.rotation.y = 0;
            limbs.head.rotation.x = 0;
          }
        });
        fg.state = 'to_aisle_exit';
      }
    } else if (fg.state === 'to_aisle_exit') {
      fg.walkProgress += dt * 6.0;
      let allAtAisle = true;
      fg.members.forEach((m, idx) => {
        const wp = aisleWaypoints[idx] || [3.2, 4.2];
        if (!moveToward(m, wp[0], wp[1], idx)) allAtAisle = false;
      });
      if (allAtAisle) {
        fg.state = 'to_door';
      }
    } else if (fg.state === 'to_door') {
      fg.walkProgress += dt * 6.2;
      let allAtDoor = true;
      fg.members.forEach((m, idx) => {
        const spreadX = (idx - 1) * 0.45;
        if (!moveToward(m, spreadX, 6.2, idx)) allAtDoor = false;
      });
      if (allAtDoor) {
        fg.state = 'to_car';
      }
    } else if (fg.state === 'to_car') {
      fg.walkProgress += dt * 6.2;
      const spotPos = fg.car
        ? this.world.parkingSpots[fg.car.parkingSpotIndex]?.position
        : null;
      const tx = spotPos ? spotPos.x : 0;
      const tz = spotPos ? spotPos.z : 14;
      let allAtCar = true;
      fg.members.forEach((m, idx) => {
        if (!moveToward(m, tx + (idx - 1) * 0.4, tz, idx)) allAtCar = false;
      });
      if (allAtCar) {
        fg.members.forEach((m) => this.scene.remove(m.mesh));
        if (fg.car) this.scene.remove(fg.car.meshGroup);
        this.eatingFriendsGroup = null;
      }
    }
  }

  private spawnCustomerCar() {
    if (this.nightState.night === 2) {
      this.night2GuestsCount += 1;
    }

    // Pick unoccupied parking spot (avoid spot held by eating friends group)
    const occupiedSpot = this.eatingFriendsGroup?.car?.parkingSpotIndex;
    const availableSpots = [1, 2, 3].filter((idx) => idx !== occupiedSpot);
    const spotIdx = availableSpots[Math.floor(Math.random() * availableSpots.length)];

    const colors = [0x224477, 0x5a5d61, 0x1a452a, 0x6e5229];
    const chosenColor = colors[Math.floor(Math.random() * colors.length)];

    const carMesh = createDetailedCar(chosenColor);
    carMesh.position.set(25, 0, 24);
    this.scene.add(carMesh);

    this.activeCustomerCar = {
      id: `car_${Date.now()}`,
      meshGroup: carMesh,
      driverMesh: null,
      state: 'driving_in',
      progress: 0,
      parkingSpotIndex: spotIdx,
      hasSpawnedCustomer: false,
      color: chosenColor,
    };
  }

  private spawnCustomerFromCar(carX: number, carZ: number) {
    const t = getTranslations(this.settings.language).engine;
    const isNight2 = this.nightState.night === 2;
    const custList = isNight2 ? t.customersNight2 : t.customers;

    let archetypeIndex: number;
    if (isNight2) {
      const qIdx = Math.max(0, this.night2GuestsCount - 1) % this.night2QueueIndices.length;
      archetypeIndex = this.night2QueueIndices[qIdx];
    } else {
      archetypeIndex = this.night1QueueIndices[this.customerConvoIndex % this.night1QueueIndices.length];
    }

    const archetype = custList[archetypeIndex % custList.length];
    const personMesh = createCustomerCharacter(0x334455, archetypeIndex);
    personMesh.position.set(carX, 0, carZ);
    this.scene.add(personMesh);

    const behaviorType =
      archetypeIndex === 7
        ? 'friends_group'
        : archetypeIndex === 8
        ? 'grumpy_man'
        : 'standard';

    const companionMeshes: THREE.Group[] = [];
    if (behaviorType === 'friends_group') {
      const friend2 = createCustomerCharacter(0x3b5239, 701);
      friend2.position.set(carX - 0.62, 0, carZ + 0.38);
      const friend3 = createCustomerCharacter(0x6b1d2f, 702);
      friend3.position.set(carX + 0.62, 0, carZ + 0.38);
      this.scene.add(friend2, friend3);
      companionMeshes.push(friend2, friend3);
    }

    this.frontChimePlayedForCurrentCustomer = false;
    this.activeCustomerPerson = {
      id: `person_${Date.now()}`,
      meshGroup: personMesh,
      targetPos: [0, 0, 5.0],
      currentPos: [carX, 0, carZ],
      state: 'walking_to_door',
      walkProgress: 0,
      hasTriggeredChime: false,
      speed: 1.8,
      archetypeIndex,
      archetypeName: archetype.name,
      archetypeTitle: archetype.title,
      behaviorType,
      companionMeshes,
    };
  }

  private updateInteractions() {
    if (this.dialogueState.active) {
      this.activeItemNearby = null;
      this.nearbyCustomer = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    const t = getTranslations(this.settings.language).engine;
    this.camera.getWorldDirection(this._tmpCamDir);

    // 1. Check Customer NPC conversation / food order delivery (disabled while customer is leaving)
    if (this.activeCustomerPerson && this.activeCustomerPerson.state !== 'leaving') {
      const p = this.activeCustomerPerson;
      if (p.state === 'inside_counter' || p.state === 'seated' || p.currentPos[2] < 5.8) {
        this._tmpItemPos.set(p.currentPos[0], 1.35, p.currentPos[2]);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position);
        const distToCustomer = this._tmpToItem.length();
        this._tmpToItem.normalize();
        const dot = this._tmpCamDir.dot(this._tmpToItem);

        const custList = this.nightState.night === 2 ? t.customersNight2 : t.customers;
        const custArch = custList[(p.archetypeIndex ?? 0) % custList.length];
        const customerName = custArch?.name || p.archetypeName;

        if (distToCustomer <= 3.3 && dot > 0.3) {
          this.nearbyCustomer = p;
          this.activeItemNearby = null;
          if (this.orderPhase === 'ready_to_serve' && !this.mustDiscardFood) {
            this.callbacks.onInteractionPrompt(t.prompts.deliverMeal(customerName));
          } else if (this.orderPhase === 'preparing') {
            this.callbacks.onInteractionPrompt(t.prompts.talkAwaiting(customerName));
          } else {
            this.callbacks.onInteractionPrompt(t.prompts.takeOrder(customerName));
          }
          return;
        }
      }
    }
    this.nearbyCustomer = null;

    // Restroom Toilet Flush ambient interaction
    const toiletItem = this.world.interactiveItems.find((it) => it.id === 'toilet_flush');
    if (toiletItem) {
      this._tmpItemPos.set(toiletItem.position[0], toiletItem.position[1], toiletItem.position[2]);
      this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position);
      const distToToilet = this._tmpToItem.length();
      this._tmpToItem.normalize();
      if (distToToilet <= toiletItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.45) {
        this.activeItemNearby = toiletItem;
        const flushLabel = t.prompts.actions.toilet_flush || toiletItem.actionText;
        this.callbacks.onInteractionPrompt(`E — ${flushLabel}`);
        return;
      }
    }

    // Spoiled Food Trash Disposal Priority Check (indoor kitchen trash bin or outdoor dumpster)
    if (this.mustDiscardFood && this.stats.hasFoodInHand) {
      for (const trashId of ['trash_bin', 'outdoor_dumpster']) {
        const trashItem = this.world.interactiveItems.find((it) => it.id === trashId);
        if (trashItem) {
          this._tmpItemPos.set(trashItem.position[0], trashItem.position[1], trashItem.position[2]);
          const d = this.playerPos.distanceTo(this._tmpItemPos);
          this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
          if (d <= trashItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.3) {
            this.activeItemNearby = trashItem;
            this.callbacks.onInteractionPrompt(t.prompts.throwFoodInTrash);
            return;
          }
        }
      }
    }

    // 3:00 AM Electrical Box Inspection Priority Check (available whenever powerOutageActive is true)
    if (this.powerOutageActive) {
      const boxItem = this.world.interactiveItems.find((it) => it.id === 'electrical_box');
      if (boxItem) {
        this._tmpItemPos.set(boxItem.position[0], boxItem.position[1], boxItem.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= boxItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.28) {
          this.activeItemNearby = boxItem;
          this.callbacks.onInteractionPrompt(t.prompts.inspectElectricalBox);
          return;
        }
      }
    }

    // Special Kitchen Food Preparation Counter Check (5s prep)
    if (this.orderPhase === 'preparing' && !this.mustDiscardFood && !this.powerOutageActive) {
      const prepStation = this.world.interactiveItems.find((it) => it.id === 'kitchen_prep_station');
      if (prepStation) {
        this._tmpItemPos.set(prepStation.position[0], prepStation.position[1], prepStation.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= prepStation.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.3) {
          this.activeItemNearby = prepStation;
          if (this.isPreparingFood) {
            const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
            this.callbacks.onInteractionPrompt(t.prompts.cookingKitchen(secLeft));
          } else {
            this.callbacks.onInteractionPrompt(t.prompts.cookKitchen);
          }
          return;
        }
      }
    }

    // 2. Strict Sequential Objective Task Prompts (Only UNLOCKED active tasks can show prompts)
    const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (!currentStep) {
      this.activeItemNearby = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    const allowedIds = STEP_ALLOWED_ITEMS[currentStep.id] || [];

    let closestItem: InteractiveItem | null = null;
    let minDist = Infinity;

    for (const item of this.world.interactiveItems) {
      if (item.completed) continue;
      if (!allowedIds.includes(item.id)) continue;

      if (item.type === 'mop_tool' && this.stats.hasMopInHand) continue;

      // Special contextual conditions
      if (currentStep.id === 'dump_trash' && !this.stats.hasTrashInHand && item.type === 'outdoor_dumpster') {
        continue;
      }
      if (currentStep.id === 'n2_cardboard') {
        if (this.stats.hasCardboardInHand && item.type !== 'outdoor_dumpster') continue;
        if (!this.stats.hasCardboardInHand && item.type !== 'cardboard_bundle') continue;
      }
      // Front door exit shift completion: STRICTLY restricted until clock shows 6:00 AM!
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour < 6) {
          continue;
        }
      }

      this._tmpItemPos.set(item.position[0], item.position[1], item.position[2]);
      const d = this.playerPos.distanceTo(this._tmpItemPos);
      if (d < item.radius && d < minDist) {
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        const dot = this._tmpCamDir.dot(this._tmpToItem);
        if (dot > 0.35) {
          minDist = d;
          closestItem = item;
        }
      }
    }

    this.activeItemNearby = closestItem;
    if (closestItem) {
      if (closestItem.type === 'mop_tool') {
        this.callbacks.onInteractionPrompt(t.prompts.pickUpMop);
      } else if (closestItem.type === 'hallway_spill') {
        this.callbacks.onInteractionPrompt(
          this.stats.hasMopInHand ? t.prompts.mopPuddle : t.prompts.mopRequiredPrompt
        );
      } else {
        const actionLabel = t.prompts.actions[closestItem.id] || closestItem.actionText;
        this.callbacks.onInteractionPrompt(`E — ${actionLabel}`);
      }
    } else {
      this.callbacks.onInteractionPrompt(null);
    }
  }

  private updateAtmosphere(dt: number, timeSec: number) {
    // Moving Background Traffic in both highway directions
    for (const car of this.backgroundTrafficCars) {
      car.mesh.position.x += car.direction * car.speed * dt;
      if (car.direction === -1 && car.mesh.position.x < -36) {
        car.mesh.position.x = 36;
      } else if (car.direction === 1 && car.mesh.position.x > 36) {
        car.mesh.position.x = -36;
      }
    }

    // Rain particle animation
    const rain = this.world.rainSystem;
    const posAttr = rain.geometry.getAttribute('position') as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    for (let i = 0; i < arr.length; i += 3) {
      arr[i + 1] -= dt * 18;
      if (arr[i + 1] < 0) {
        arr[i + 1] = 14;
      }
    }
    posAttr.needsUpdate = true;

    // Flickering lights (keep all store lights OFF during 3 AM power outage, and preserve horror flicker override on kitchenLight while preparing food)
    this.world.flickeringLights.forEach((fl) => {
      if (this.powerOutageActive) {
        fl.light.intensity = 0;
        return;
      }
      if (this.isPreparingFood && fl.light === this.world.kitchenLight) {
        return;
      }
      const flicker = Math.sin(timeSec * 20 + fl.flickerRate * 100) > 0.88 ? 0.4 : 1.0;
      const noise = (Math.random() - 0.5) * 0.1;
      fl.light.intensity = fl.baseIntensity * flicker + noise;
    });
  }

  public dispose() {
    if (this.reqId) cancelAnimationFrame(this.reqId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
