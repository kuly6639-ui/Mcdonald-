import * as THREE from 'three';
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';
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
  Night3CarPhase,
  Night3EmergencyProgress,
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
  createFirstPersonHeldRawFryItems,
  createFirstPersonHeldBigMac,
  createFirstPersonHeldCoffeeCup,
  createFirstPersonHeldSodaCup,
  createFirstPersonHeldMop,
  createFirstPersonHeldChickenTray,
  createFirstPersonHeldNoodlesAndDrink,
  createBoothMealTray,
  createFastFoodProps,
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
  onWhiteFlashAlphaUpdate?: (alpha: number) => void;
  onNight3CarPhaseChange?: (progress: Night3EmergencyProgress) => void;
  onPhoneToggleRequested?: () => void;
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
  'n2_drive_thru': ['drive_thru_window'],
  'n2_cctv_final': ['cctv_monitor'],

  // Night 3 (The Final Demo Night - relocated statue & clown customer)
  'n3_clock_in': ['time_clock'],
  'n3_clean_tables': ['clean_table_1', 'clean_table_2'],
  'n3_kitchen_check': ['kitchen_switch'],
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
  // 4. Jolly Plumber (Real-life Mario)
  {
    name: 'Big Ray',
    title: 'Jolly Plumber & Midnight Regular',
    orderItem: 'Super Fried Chicken Bucket & Espresso Power-Up',
    dialogue: [
      { speaker: 'Big Ray', text: "Wahoo! It's-a me, Big Ray! Evening, my feathered friend!" },
      { speaker: 'Duck', text: 'Uh... hey Big Ray. You look like you just hopped straight out of a drainpipe.' },
      { speaker: 'Big Ray', text: "Mamma mia! Fixed three leaky kitchen pipes across town tonight—now my belly needs a Super Star power-up!" },
      { speaker: 'Duck', text: 'Ha, fair enough. What can I cook up for you, Mario?' },
      { speaker: 'Big Ray', text: "Crispy fried chicken bucket, extra mushroom burger, and a piping hot espresso! Let's-a go!" },
      { speaker: 'Duck', text: "Coming right up, Big Ray! Five seconds in the kitchen." },
    ],
  },
];

const ChromaticAberrationShader = {
  uniforms: {
    tDiffuse: { value: null },
    uAmount: { value: 0.0058 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float uAmount;
    varying vec2 vUv;
    void main() {
      vec2 dir = vUv - 0.5;
      float dist = length(dir);
      vec2 offset = vec2(dir.x * 1.35 + 0.12 * sign(dir.x + 0.0001), dir.y * 0.95) * uAmount * (0.55 + dist * 1.9);
      float r = texture2D(tDiffuse, clamp(vUv + offset, 0.001, 0.999)).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, clamp(vUv - offset, 0.001, 0.999)).b;
      gl_FragColor = vec4(r, g, b, 1.0);
    }
  `,
};

export class GameEngine {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private composer: EffectComposer;
  private renderPass: RenderPass;
  private chromaticPass: ShaderPass;
  private chromaticStrength: number = 0.0058;
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
    hasRawFryItemsInHand: false,
    hasBigMacInHand: false,
    hasCoffeeCupInHand: false,
    hasSodaCupInHand: false,
    hasMopInHand: false,
    hasChickenTrayInHand: false,
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
    { id: 'n2_drive_thru', title: 'DRIVE-THRU WINDOW CHECK', description: 'Inspect the transparent drive-thru service window along the east wall.' },
    { id: 'n2_cctv_final', title: 'CHECK SURVEILLANCE', description: 'Inspect the security office cameras before closing up.' },
    { id: 'finish_shift', title: 'SURVIVE UNTIL 6:00 AM', description: 'Preparation complete. Customers are arriving. Attend to customer orders and survive until 6:00 AM.' },
  ];

  private night3Steps: ObjectiveStep[] = [];

  private currentSteps: ObjectiveStep[] = [];

  // Outgoing Employee John NPC State (Night 1 & Night 2 shift handover)
  private johnState: 'waiting' | 'leaving' | 'gone' = 'waiting';
  private johnPos: [number, number, number] = [0.8, 0, 2.8];
  private johnWalkProgress: number = 0;

  // Customer Food Order & Preparation State
  private activeCustomerOrder: {
    customerName: string;
    customerId: string;
    itemText: string;
    orderSource?: 'lobby' | 'drive_thru';
    needsCoffee?: boolean;
    needsSoda?: boolean;
  } | null = null;
  private orderPhase: 'none' | 'preparing' | 'ready_to_serve' = 'none';
  private cookingStep:
    | 'none'
    | 'need_pickup_fry'
    | 'need_fryer'
    | 'frying'
    | 'need_pickup_burger'
    | 'need_microwave'
    | 'microwaving'
    | 'need_pickup_coffee_cup'
    | 'need_coffee'
    | 'brewing_coffee'
    | 'need_pickup_soda_cup'
    | 'need_soda'
    | 'pouring_soda'
    | 'need_wrap'
    | 'wrapping'
    | 'need_pickup_finished' = 'none';
  private pendingThankYouDialogue: boolean = false;
  private currentDialogueCustomer: CustomerPerson | null = null;
  private prepCountdown: number = 0;
  private isPreparingFood: boolean = false;
  private prepAudioTimer: number = 0;
  private flickerBuzzTimer: number = 0;
  private heldMealMesh: THREE.Group | null = null;
  private heldRawFryMesh: THREE.Group | null = null;
  private heldBigMacMesh: THREE.Group | null = null;
  private heldCoffeeCupMesh: THREE.Group | null = null;
  private heldSodaCupMesh: THREE.Group | null = null;
  private heldMopMesh: THREE.Group | null = null;
  private heldChickenTrayMesh: THREE.Group | null = null;
  private heldNoodlesDrinkMesh: THREE.Group | null = null;
  private kitchenFinishedDishMesh: THREE.Group | null = null;
  private servedCounterDishMesh: THREE.Group | null = null;
  private dtServedDishMesh: THREE.Group | null = null;
  private mopSwingTimer: number = 0;

  // Post-customer Hunger Event & 67-Eleven Convenience Store Ending Sequence
  private store67Stage:
    | 'none'
    | 'waiting_departures'
    | 'hunger_dialogue'
    | 'fading_to_67'
    | 'at_67_noodle_stall'
    | 'at_67_cashier'
    | 'at_67_car' = 'none';
  private store67FadePhase: 'none' | 'out' | 'in' = 'none';

  // 3-Guest Food Depletion & Walk-In Freezer Restock State
  private foodOutOfStock: boolean = false;
  private restockCompletedThisNight: boolean = false;
  private pendingOutOfFoodDialogue: boolean = false;

  // Night 2 3:33 AM Bathroom Knocking Event State
  private n2BathroomKnockTriggered: boolean = false;
  private n2BathroomCheckPending: boolean = false;
  private pendingBathroomKnockDialogue: boolean = false;

  // McDonald's Interior-Only Background Music State
  private nightMusicStartedInside: boolean = false;
  private nightMusicCutByOutage: boolean = false;
  private nightMusicInsideActive: boolean = false;

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
  private clownJumpscarePlayedThisNight: boolean = false;
  private n2PeekingJumpscarePlayed: boolean = false;
  private warehouseReactionTriggered: boolean = false;
  private _clownRaycaster = new THREE.Raycaster();

  // Night 1, 2 & 3 Sequential Guest Arrival State (2 regular, 1 drive-thru, 1 regular, 1 drive-thru, ...)
  private nightArrivalIndex: number = 0;
  private night1RegularSpawned: number = 0;
  private night3RegularSpawned: number = 0;
  private night1GuestsServed: number = 0;
  private night2GuestsCount: number = 0;
  private night2GuestsServed: number = 0;
  private driveThruServedThisNight: number = 0;
  private driveThruSpawnedThisNight: number = 0;
  private activeDriveThruCar: {
    id: string;
    meshGroup: THREE.Group;
    state: 'entering' | 'waiting_window' | 'leaving';
    progress: number;
    customerIndex: number;
  } | null = null;
  private readonly night1QueueIndices = [0, 1, 2, 3, 4];
  private readonly night2QueueIndices = [0, 7, 2, 8, 3];
  private readonly night3QueueIndices = [0, 1, 2, 3];
  private readonly night1ArrivalQueue: ('regular' | 'drive_thru')[] = [
    'regular',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'regular',
  ];
  private readonly night2ArrivalQueue: ('regular' | 'drive_thru')[] = [
    'regular',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'regular',
  ];
  private readonly night3ArrivalQueue: ('regular' | 'drive_thru' | 'clown')[] = [
    'regular',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'regular',
    'drive_thru',
    'clown',
  ];
  private n2LastGuestTriggered: boolean = false;
  private n2LastGuestClownPeeking: boolean = false;

  // Night 3 State (Disappeared Statue, Clown Chicken Customer, 2s Door Chase, Car Out of Gas Climax, Catch Jumpscare)
  private night3RegularServed: number = 0;
  private night3ClownSpawned: boolean = false;
  private night3ClownServed: boolean = false;
  private night3ClownWatchingFromShop: boolean = false;
  private night3ClownChaseStarted: boolean = false;
  private night3ClownChaseTimer: number = 0;
  private night3ClownLaughTimer: number = 0;
  private night3CaughtScareTimer: number = 0;
  private night3CarPhase: Night3CarPhase = 'none';
  private night3CarPhaseTimer: number = 0;
  private night3ClownAttackStruck: boolean = false;
  private night3ClownAttackStrikeCount: number = 0;
  private night3CarCrackShake: number = 0;
  private night3CalledPolice: boolean = false;
  private night3TextedJohn: boolean = false;
  private phoneOpen: boolean = false;
  private night3ClownDisappearedFromShop: boolean = false;
  private night3ClownOutOfSightTimer: number = 0;
  private night3WindowLaughStarted: boolean = false;
  private night3HeadBloodTimer: number = 0;
  private night3HeadBloodDripAccum: number = 0;
  private night3BloodDroplets: {
    mesh: THREE.Mesh;
    vel: THREE.Vector3;
    life: number;
    maxLife: number;
    active: boolean;
  }[] = [];
  private night3BloodDropletMat: THREE.MeshStandardMaterial | null = null;
  private _tmpHeadBloodPos = new THREE.Vector3();
  private _tmpHeadForward = new THREE.Vector3();

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
  private whiteFlashAlpha: number = 0;
  private closingShiftTargetScreen:
    | 'night1_complete'
    | 'night2_complete'
    | 'night3_ending'
    | 'night3_bad_ending'
    | null = null;
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

    // 1. WebGL Renderer (capped to 720p max framebuffer for smooth gameplay)
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
    });
    const initW = Math.max(1, container.clientWidth);
    const initH = Math.max(1, container.clientHeight);
    const cappedInit = this.getCappedRenderSize(initW, initH);
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(cappedInit.width, cappedInit.height, false);
    this.renderer.domElement.style.width = '100%';
    this.renderer.domElement.style.height = '100%';
    this.renderer.domElement.style.display = 'block';
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 0.92;
    this.applyGraphicsQuality(this.settings.graphicsQuality);
    container.appendChild(this.renderer.domElement);

    // 2. Scene & PS1 Limited View-Distance Fog (matching environment background)
    const ps1HorizonColor = 0x040507;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(ps1HorizonColor);
    this.scene.fog = new THREE.Fog(ps1HorizonColor, 4.5, 25);

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
      initW / initH,
      0.1,
      80
    );
    this.cctvCamera = new THREE.PerspectiveCamera(65, 1.33, 0.2, 50);

    // 3B. Post-Processing Pipeline (Chromatic Aberration + ACES Filmic Output at <= 720p)
    this.composer = new EffectComposer(this.renderer);
    this.composer.setPixelRatio(1);
    this.composer.setSize(cappedInit.width, cappedInit.height);
    this.renderPass = new RenderPass(this.scene, this.camera);
    this.composer.addPass(this.renderPass);
    this.chromaticPass = new ShaderPass(ChromaticAberrationShader);
    this.composer.addPass(this.chromaticPass);
    this.composer.addPass(new OutputPass());

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

    // 4B-3. First-Person Viewmodel: Held Freezer Chicken Tray in Duck's Hands
    this.heldChickenTrayMesh = createFirstPersonHeldChickenTray();
    this.heldChickenTrayMesh.position.set(0.24, -0.22, -0.44);
    this.heldChickenTrayMesh.rotation.set(0.10, -0.10, 0.03);
    this.heldChickenTrayMesh.visible = false;
    this.camera.add(this.heldChickenTrayMesh);

    // 4B-4. First-Person Viewmodel: Held Cup Noodles & Red Energy Drink (from 67-Eleven)
    this.heldNoodlesDrinkMesh = createFirstPersonHeldNoodlesAndDrink();
    this.heldNoodlesDrinkMesh.position.set(0.23, -0.21, -0.42);
    this.heldNoodlesDrinkMesh.rotation.set(0.12, -0.14, 0.04);
    this.heldNoodlesDrinkMesh.visible = false;
    this.camera.add(this.heldNoodlesDrinkMesh);

    // 4B-5. First-Person Viewmodel: Held Raw Chicken & Potatoes (Before Fryer)
    this.heldRawFryMesh = createFirstPersonHeldRawFryItems();
    this.heldRawFryMesh.position.set(0.23, -0.22, -0.43);
    this.heldRawFryMesh.rotation.set(0.11, -0.14, 0.04);
    this.heldRawFryMesh.visible = false;
    this.camera.add(this.heldRawFryMesh);

    // 4B-6. First-Person Viewmodel: Held Big Mac Burger (Before Microwave)
    this.heldBigMacMesh = createFirstPersonHeldBigMac();
    this.heldBigMacMesh.position.set(0.22, -0.21, -0.40);
    this.heldBigMacMesh.rotation.set(0.14, -0.16, 0.04);
    this.heldBigMacMesh.visible = false;
    this.camera.add(this.heldBigMacMesh);

    // 4B-6b. First-Person Viewmodel: Held Coffee Cup (Before Coffee Machine)
    this.heldCoffeeCupMesh = createFirstPersonHeldCoffeeCup();
    this.heldCoffeeCupMesh.position.set(0.22, -0.22, -0.40);
    this.heldCoffeeCupMesh.rotation.set(0.12, -0.14, 0.04);
    this.heldCoffeeCupMesh.visible = false;
    this.camera.add(this.heldCoffeeCupMesh);

    // 4B-6c. First-Person Viewmodel: Held Soft Drink Cup (Before Soda Dispenser)
    this.heldSodaCupMesh = createFirstPersonHeldSodaCup();
    this.heldSodaCupMesh.position.set(0.22, -0.22, -0.40);
    this.heldSodaCupMesh.rotation.set(0.12, -0.14, 0.04);
    this.heldSodaCupMesh.visible = false;
    this.camera.add(this.heldSodaCupMesh);

    // 4B-7. Scene Table Dish Props (Kitchen Prep Table, Serving Counter Table, Drive-Thru Ledge)
    this.kitchenFinishedDishMesh = createFastFoodProps();
    this.kitchenFinishedDishMesh.position.set(3.5, 0.96, -2.18);
    this.kitchenFinishedDishMesh.visible = false;
    this.scene.add(this.kitchenFinishedDishMesh);

    this.servedCounterDishMesh = createFastFoodProps();
    this.servedCounterDishMesh.position.set(4.05, 1.11, 0.76);
    this.servedCounterDishMesh.rotation.y = Math.PI;
    this.servedCounterDishMesh.visible = false;
    this.scene.add(this.servedCounterDishMesh);

    this.dtServedDishMesh = createFastFoodProps();
    this.dtServedDishMesh.position.set(8.05, 0.88, 0.15);
    this.dtServedDishMesh.visible = false;
    this.scene.add(this.dtServedDishMesh);

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

  private getCappedRenderSize(w: number, h: number): { width: number; height: number } {
    const safeW = Math.max(1, w);
    const safeH = Math.max(1, h);
    const scale = Math.min(1, 1280 / safeW, 720 / safeH);
    return {
      width: Math.max(1, Math.floor(safeW * scale)),
      height: Math.max(1, Math.floor(safeH * scale)),
    };
  }

  public applyGraphicsQuality(quality: 'low' | 'medium' | 'high') {
    this.renderer.setPixelRatio(1.0);
    if (this.composer) {
      this.composer.setPixelRatio(1.0);
    }
    if (quality === 'low') {
      this.renderer.shadowMap.enabled = false;
      if (this.scene && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 3.5;
        this.scene.fog.far = 22;
      }
    } else if (quality === 'medium') {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      if (this.scene && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 4.0;
        this.scene.fog.far = 24;
      }
    } else {
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      if (this.scene && this.scene.fog instanceof THREE.Fog) {
        this.scene.fog.near = 4.5;
        this.scene.fog.far = 26;
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
      if (
        this.currentScreen === 'playing' &&
        !this.isPaused &&
        !this.phoneOpen &&
        this.night3CarPhase !== 'choice'
      ) {
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
      const res = this.renderer.domElement.requestPointerLock?.() as unknown as Promise<void> | undefined;
      if (res && typeof res.catch === 'function') {
        res.catch(() => {});
      }
      soundEngine.resume();
    } catch (e) {}
  }

  private exitPointerLock() {
    try {
      if (document.exitPointerLock && document.pointerLockElement) {
        document.exitPointerLock();
      }
    } catch (e) {}
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

    if (code === 'KeyP' && this.currentScreen === 'playing' && !this.isPaused) {
      if (
        !this.dialogueState.active &&
        !this.closingShiftTargetScreen &&
        this.night3CaughtScareTimer <= 0 &&
        this.night3CarPhase !== 'choice'
      ) {
        this.callbacks.onPhoneToggleRequested?.();
      }
      return;
    }

    if (code === 'KeyC' && this.currentScreen === 'playing' && !this.isPaused) {
      if (this.night3CarPhase !== 'none') return;
      this.stats.isCrouched = !this.stats.isCrouched;
      this.targetHeight = this.stats.isCrouched ? 0.95 : 1.65;
      this.emitStatsIfChanged();
    }

    if (code === 'KeyE' && this.currentScreen === 'playing' && !this.isPaused && !this.phoneOpen) {
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
      if (this.phoneOpen && this.night3CarPhase !== 'hiding_using_phone') {
        this.callbacks.onPhoneToggleRequested?.();
        return;
      }
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

  private detectOrderBeverages(
    itemText: string,
    isClown: boolean = false
  ): { needsCoffee: boolean; needsSoda: boolean } {
    if (isClown) return { needsCoffee: false, needsSoda: false };
    const needsCoffee = /coffee|espresso|mocha|latte|mccaf|cà phê|кофе|эспрессо|латте|мокк|kopi/i.test(
      itemText
    );
    const needsSoda = /sprite|soda|cola|coca|pepsi|fanta|nước ngọt|газиров|спрайт|содов/i.test(
      itemText
    );
    return { needsCoffee, needsSoda };
  }

  private emitStatsIfChanged(force: boolean = false) {
    const key = `${this.stats.isSprinting ? 1 : 0}|${this.stats.isCrouched ? 1 : 0}|${this.stats.flashlightOn ? 1 : 0}|${this.stats.hasTrashInHand ? 1 : 0}|${this.stats.hasCardboardInHand ? 1 : 0}|${this.stats.hasFoodInHand ? 1 : 0}|${this.stats.hasRawFryItemsInHand ? 1 : 0}|${this.stats.hasBigMacInHand ? 1 : 0}|${this.stats.hasCoffeeCupInHand ? 1 : 0}|${this.stats.hasSodaCupInHand ? 1 : 0}|${this.stats.hasMopInHand ? 1 : 0}|${this.stats.hasChickenTrayInHand ? 1 : 0}|${this.stats.hasNoodlesAndDrinkInHand ? 1 : 0}|${this.stats.mustDiscardFood ? 1 : 0}`;
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

    this.night3Steps = [
      { id: 'talk_to_john', title: t.steps.talk_to_john.title, description: t.steps.talk_to_john.description },
      { id: 'n3_clock_in', title: t.steps.n3_clock_in.title, description: t.steps.n3_clock_in.description },
      {
        id: 'n3_clean_tables',
        title: t.steps.n3_clean_tables.title,
        description: t.steps.n3_clean_tables.description(tablesCount),
        targetCount: 2,
        currentCount: tablesCount,
      },
      { id: 'n3_kitchen_check', title: t.steps.n3_kitchen_check.title, description: t.steps.n3_kitchen_check.description },
      {
        id: 'finish_shift',
        title: t.steps.finish_shift.title,
        description: is6Am ? t.steps.finish_shift.ready6am : t.steps.finish_shift.description,
      },
    ];

    this.currentSteps =
      this.nightState.night === 1
        ? [...this.night1Steps]
        : this.nightState.night === 2
        ? [...this.night2Steps]
        : [...this.night3Steps];
  }

  private closeDialogue() {
    const finishedNpcId = this.dialogueState.npcId;
    this.dialogueState.active = false;
    this.callbacks.onDialogueUpdate({ ...this.dialogueState });

    const t = getTranslations(this.settings.language).engine;

    // -3B. Night 3 Car Out-of-Gas dialogue closed -> Clown charges to the driver window & cracks glass
    if (finishedNpcId === 'night3_car_no_gas') {
      this.night3CarPhase = 'clown_attacking';
      this.night3CarPhaseTimer = 0;
      this.night3ClownAttackStruck = false;
      this.night3ClownAttackStrikeCount = 0;
      this.night3WindowLaughStarted = false;
      this.night3HeadBloodTimer = 0;
      this.night3HeadBloodDripAccum = 0;
      this.night3ClownChaseStarted = false;
      this.night3ClownChaseTimer = 0;
      if (this.world.duckCar?.userData?.doorAttackLight) {
        (this.world.duckCar.userData.doorAttackLight as THREE.PointLight).intensity = 1.95;
      }
      if (this.clownActor) {
        this.clownActor.setPeekPose?.(false, 0);
        this.clownActor.setHeadBloodied?.(false);
        this.clownActor.head.rotation.set(0, 0, 0);
        this.clownActor.group.visible = true;
        this.clownActor.group.position.set(-6.2, 0, 15.4);
        this.clownActor.group.rotation.y = Math.atan2(-9.68 - -6.2, 13.24 - 15.4);
      }
      this.emitNight3CarProgress();
      this.notifyActiveObjective();
      return;
    }

    // -3C. Night 3 Car Post-Attack dialogue closed -> Display 2-choice Escape/Hide modal
    if (finishedNpcId === 'night3_car_post_attack') {
      this.night3CarPhase = 'choice';
      this.keys = {};
      this.mobileSprint = false;
      this.exitPointerLock();
      this.emitNight3CarProgress();
      this.notifyActiveObjective();
      return;
    }

    // -3. Hunger monologue closed -> begin smooth fade out to 67-Eleven
    if (finishedNpcId === 'hunger_monologue') {
      this.store67Stage = 'fading_to_67';
      this.store67FadePhase = 'out';
      this.notifyActiveObjective();
      return;
    }

    // -2C. 3:33 AM Bathroom Check / 3:00 AM Power Outage or Warehouse Reaction closed -> check if all customers already finished
    if (
      finishedNpcId === 'bathroom_empty' ||
      finishedNpcId === 'warehouse_reaction' ||
      finishedNpcId === 'power_restored'
    ) {
      if (this.handleAllCustomersServedProgression()) {
        return;
      }
      this.notifyActiveObjective();
      return;
    }

    // -2B. 67-Eleven employee confirmed $10 payment -> Noodles & Red Energy Drink Bottle visibly appear in Duck's hand!
    if (finishedNpcId === 'store_67_cashier') {
      soundEngine.playCashRegisterSale();
      soundEngine.playObjectiveComplete();
      this.stats.hasNoodlesAndDrinkInHand = true;
      this.emitStatsIfChanged();
      const cashierItem = this.world.interactiveItems.find((it) => it.id === 'store_67_cashier');
      if (cashierItem) cashierItem.completed = true;
      this.store67Stage = 'at_67_car';
      this.callbacks.onObjectiveCompletedNotice(t.notices.paidAt67Eleven);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      this.notifyActiveObjective();
      return;
    }

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

      if (this.nightState.night === 3) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.statueMoved);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4500);
      }

      const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
      if (currentStep && currentStep.id === 'talk_to_john') {
        this.advanceObjective();
      } else {
        this.notifyActiveObjective();
      }
      return;
    }

    // 1. If Duck just served the food (lobby OR drive-thru) and customer finished closing dialogue
    if (this.pendingThankYouDialogue) {
      this.pendingThankYouDialogue = false;
      const wasDriveThru = finishedNpcId === 'drive_thru_customer';
      const wasClownCustomer = this.activeCustomerPerson?.behaviorType === 'clown_customer';
      this.orderPhase = 'none';
      this.activeCustomerOrder = null;
      this.isPreparingFood = false;
      this.prepCountdown = 0;

      // Night 3 Clown Customer served -> Clown stays inside standing by the front glass watching & laughing eerily as Duck goes to his car!
      if (this.nightState.night === 3 && wasClownCustomer) {
        if (this.activeCustomerPerson) {
          this.scene.remove(this.activeCustomerPerson.meshGroup);
          this.activeCustomerPerson = null;
        }
        this.nearbyCustomer = null;
        this.night3ClownServed = true;
        this.night3ClownWatchingFromShop = true;
        this.night3ClownChaseStarted = false;
        this.night3ClownChaseTimer = 0;
        this.night3ClownLaughTimer = 4.2;

        if (this.clownActor) {
          this.clownActor.setPeekPose?.(false, 0);
          this.clownActor.group.position.set(0.55, 0, 4.1);
          this.clownActor.group.rotation.y = Math.atan2(
            this.playerPos.x - 0.55,
            this.playerPos.z - 4.1
          );
          this.clownActor.group.visible = true;
        }

        soundEngine.playEerieClownLaugh();
        this.callbacks.onObjectiveCompletedNotice(t.notices.clownWatchingCar);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 5000);
        this.notifyActiveObjective();
        this.startDialogue(t.clownWatchingCarMonologue, true, 'clown_watching_car');
        return;
      }

      if (wasDriveThru) {
        if (this.activeDriveThruCar) {
          this.activeDriveThruCar.state = 'leaving';
          this.activeDriveThruCar.progress = 0;
        }
        this.driveThruServedThisNight += 1;
        if (this.nightState.night === 3) {
          this.customerSpawnTimer = 4.5;
        }
      } else {
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
        } else if (this.nightState.night === 2) {
          this.night2GuestsServed += 1;
        } else {
          this.night3RegularServed += 1;
          this.customerSpawnTimer = 4.5;
        }
      }

      const totalServed =
        (this.nightState.night === 1
          ? this.night1GuestsServed
          : this.nightState.night === 2
          ? this.night2GuestsServed
          : this.night3RegularServed) +
        this.driveThruServedThisNight;

      // After serving 3 guests on each night, kitchen chicken runs out -> fetch Chicken Tray from Walk-In Freezer!
      if (!this.restockCompletedThisNight && totalServed >= 3 && !this.foodOutOfStock) {
        this.foodOutOfStock = true;
        this.pendingOutOfFoodDialogue = true;
        this.callbacks.onObjectiveCompletedNotice(t.notices.outOfFood);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      }

      if (this.nightState.night === 3) {
        if (this.pendingOutOfFoodDialogue) {
          this.pendingOutOfFoodDialogue = false;
          this.notifyActiveObjective();
          this.startDialogue(t.outOfFoodDialogue, true, 'out_of_food');
          return;
        }
        this.notifyActiveObjective();
        return;
      }

      // After serving 3 guests on either night, kitchen chicken runs out -> fetch Chicken Tray from Walk-In Freezer!
      if (!this.restockCompletedThisNight && totalServed >= 3 && !this.foodOutOfStock) {
        this.foodOutOfStock = true;
        this.pendingOutOfFoodDialogue = true;
        this.callbacks.onObjectiveCompletedNotice(t.notices.outOfFood);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      }

      if (this.handleAllCustomersServedProgression()) {
        return;
      }

      if (this.pendingOutOfFoodDialogue) {
        this.pendingOutOfFoodDialogue = false;
        this.notifyActiveObjective();
        this.startDialogue(t.outOfFoodDialogue, true, 'out_of_food');
        return;
      }

      if (this.pendingBathroomKnockDialogue) {
        this.pendingBathroomKnockDialogue = false;
        this.notifyActiveObjective();
        this.startDialogue([{ speaker: 'Duck', text: t.bathroomKnockDialogue }], true, 'bathroom_knock');
        return;
      }

      this.notifyActiveObjective();
      return;
    }

    // 1B. If Drive-Thru driver just finished placing their order -> AUTOMATICALLY ADD PREPARE FOOD TASK
    if (
      finishedNpcId === 'drive_thru_customer' &&
      this.orderPhase === 'none' &&
      this.activeDriveThruCar &&
      this.activeDriveThruCar.state === 'waiting_window' &&
      !this.powerOutageActive &&
      !this.mustDiscardFood &&
      !this.foodOutOfStock
    ) {
      const dtCust = t.driveThruCustomers[this.activeDriveThruCar.customerIndex % t.driveThruCustomers.length];
      const dtBev = this.detectOrderBeverages(dtCust.orderItem, false);
      this.activeCustomerOrder = {
        customerName: dtCust.name,
        customerId: 'drive_thru_customer',
        itemText: dtCust.orderItem,
        orderSource: 'drive_thru',
        needsCoffee: dtBev.needsCoffee,
        needsSoda: dtBev.needsSoda,
      };
      this.orderPhase = 'preparing';
      this.cookingStep = 'need_pickup_fry';
      this.stats.hasRawFryItemsInHand = false;
      this.stats.hasBigMacInHand = false;
      this.stats.hasCoffeeCupInHand = false;
      this.stats.hasSodaCupInHand = false;
      this.emitStatsIfChanged();
      if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
      if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
      if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
      this.isPreparingFood = false;
      this.prepCountdown = 0;

      // Night 2 last-order clown peek also triggers if final shift order starts at window
      if (
        this.nightState.night === 2 &&
        !this.n2LastGuestTriggered &&
        this.nightArrivalIndex >= this.night2ArrivalQueue.length
      ) {
        this.n2LastGuestTriggered = true;
        this.n2LastGuestClownPeeking = true;
        this.clownActor.group.position.set(-1.42, 0, 6.28);
        this.clownActor.group.rotation.y = Math.atan2(0.8 - -1.42, 2.0 - 6.28);
        this.clownActor.group.visible = true;
        this.clownActor.setPeekPose?.(true, performance.now() / 1000, 1);
      }

      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.newTaskPrep(dtCust.name));
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
      this.notifyActiveObjective();
      return;
    }

    // 2. If lobby customer just finished ordering their meal -> AUTOMATICALLY ADD PREPARE FOOD TASK
    const customer = this.nearbyCustomer || this.currentDialogueCustomer;
    if (
      this.orderPhase === 'none' &&
      customer &&
      finishedNpcId === customer.id &&
      !this.powerOutageActive &&
      !this.mustDiscardFood &&
      !this.foodOutOfStock
    ) {
      if (customer.behaviorType === 'clown_customer') {
        this.activeCustomerOrder = {
          customerName: t.clownCustomerName,
          customerId: customer.id,
          itemText: t.clownCustomerOrderItem,
          orderSource: 'lobby',
          needsCoffee: false,
          needsSoda: false,
        };
        this.orderPhase = 'preparing';
        this.cookingStep = 'need_pickup_fry';
        this.stats.hasRawFryItemsInHand = false;
        this.stats.hasBigMacInHand = false;
        this.stats.hasCoffeeCupInHand = false;
        this.stats.hasSodaCupInHand = false;
        this.emitStatsIfChanged();
        if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
        if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
        if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
        this.isPreparingFood = false;
        this.prepCountdown = 0;
        this.currentDialogueCustomer = null;

        soundEngine.playObjectiveComplete();
        this.callbacks.onObjectiveCompletedNotice(t.notices.newTaskPrep(t.clownCustomerName));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
        this.notifyActiveObjective();
        return;
      }

      const custList =
        this.nightState.night === 3
          ? t.customersNight3
          : this.nightState.night === 2
          ? t.customersNight2
          : t.customers;
      const archIdx = customer.archetypeIndex ?? 0;
      const archetype = custList[archIdx % custList.length];
      const bev = this.detectOrderBeverages(archetype.orderItem, false);
      this.activeCustomerOrder = {
        customerName: archetype.name,
        customerId: customer.id,
        itemText: archetype.orderItem,
        orderSource: 'lobby',
        needsCoffee: bev.needsCoffee,
        needsSoda: bev.needsSoda,
      };
      this.orderPhase = 'preparing';
      this.cookingStep = 'need_pickup_fry';
      this.stats.hasRawFryItemsInHand = false;
      this.stats.hasBigMacInHand = false;
      this.stats.hasCoffeeCupInHand = false;
      this.stats.hasSodaCupInHand = false;
      this.emitStatsIfChanged();
      if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
      if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
      if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
      this.isPreparingFood = false;
      this.prepCountdown = 0;
      this.currentDialogueCustomer = null;

      // Night 2 last guest event: clown peeks out from the front glass door while Duck prepares food!
      if (
        this.nightState.night === 2 &&
        !this.n2LastGuestTriggered &&
        this.nightArrivalIndex >= this.night2ArrivalQueue.length
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
    this.currentDialogueCustomer = null;

    // -1. Queued monologues after dialogue closes
    if (this.pendingPowerOutageDialogue) {
      this.pendingPowerOutageDialogue = false;
      this.startDialogue(t.powerOutageStartDialogue, true, 'power_outage_start');
      return;
    }
    if (this.pendingOutOfFoodDialogue) {
      this.pendingOutOfFoodDialogue = false;
      this.notifyActiveObjective();
      this.startDialogue(t.outOfFoodDialogue, true, 'out_of_food');
      return;
    }
    if (this.pendingBathroomKnockDialogue) {
      this.pendingBathroomKnockDialogue = false;
      this.notifyActiveObjective();
      this.startDialogue([{ speaker: 'Duck', text: t.bathroomKnockDialogue }], true, 'bathroom_knock');
      return;
    }

    this.notifyActiveObjective();
  }

  private areAllNightCustomersServed(): boolean {
    if (this.nightState.night === 3) {
      return this.night3ClownServed;
    }
    const driveThruQuota = 3;
    const lobbyQuota = 5;
    const lobbyDone =
      this.nightState.night === 1
        ? this.night1GuestsServed >= lobbyQuota
        : this.night2GuestsServed >= lobbyQuota;
    const driveThruDone = this.driveThruServedThisNight >= driveThruQuota;
    return lobbyDone && driveThruDone;
  }

  private handleAllCustomersServedProgression(): boolean {
    if (this.nightState.night === 3) return false;
    if (!this.areAllNightCustomersServed()) return false;

    // Night 1: Must always experience and check the 3:00 AM power outage + clown event before skipping to 6:00 AM
    if (this.nightState.night === 1) {
      if (!this.powerOutageTriggered) {
        this.nightState.timeTotalSeconds = 360; // 3:00 AM (180/360 * 720s)
        this.nightState.timeHour = 3;
        this.nightState.timeMinute = 0;
        this.callbacks.onNightStateUpdate({ ...this.nightState });
        this.notifyActiveObjective();
        return true;
      }
      if (
        this.powerOutageActive ||
        this.mustDiscardFood ||
        this.pendingPowerOutageDialogue ||
        this.clownState === 'watching' ||
        this.clownState === 'running_away'
      ) {
        this.notifyActiveObjective();
        return true;
      }
    }

    // Night 2: Must always trigger and inspect the 3:33 AM bathroom knocking event even if only the last customer remained
    if (this.nightState.night === 2) {
      if (!this.n2BathroomKnockTriggered) {
        this.nightState.timeTotalSeconds = 426; // 3:33 AM (213/360 * 720s)
        this.nightState.timeHour = 3;
        this.nightState.timeMinute = 33;
        this.callbacks.onNightStateUpdate({ ...this.nightState });
        this.notifyActiveObjective();
        return true;
      }
      if (this.n2BathroomCheckPending || this.pendingBathroomKnockDialogue) {
        this.notifyActiveObjective();
        return true;
      }
    }

    if (this.eatingFriendsGroup && this.eatingFriendsGroup.eatTimer > 6) {
      this.eatingFriendsGroup.eatTimer = 6;
    }
    if (this.store67Stage === 'none') {
      this.store67Stage = 'waiting_departures';
    }
    if (this.nightState.timeHour < 6) {
      this.skipClockTo6AM();
      return true;
    }
    return false;
  }

  private isInsideMcDonaldsInterior(): boolean {
    return (
      this.playerPos.x >= -11.9 &&
      this.playerPos.x <= 7.9 &&
      this.playerPos.z >= -5.9 &&
      this.playerPos.z <= 5.9
    );
  }

  private skipClockTo6AM() {
    if (this.nightState.timeHour >= 6) return;
    if (
      this.powerOutageActive ||
      this.n2BathroomCheckPending ||
      (this.nightState.night === 1 && !this.powerOutageTriggered) ||
      (this.nightState.night === 2 && !this.n2BathroomKnockTriggered)
    ) {
      return;
    }
    const t = getTranslations(this.settings.language).engine;
    this.nightState.timeTotalSeconds = 720;
    this.nightState.timeHour = 6;
    this.nightState.timeMinute = 0;

    const steps =
      this.nightState.night === 1
        ? this.night1Steps
        : this.nightState.night === 2
        ? this.night2Steps
        : this.night3Steps;
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
    if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
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

  private serveLobbyOrderOnTable(customer: CustomerPerson) {
    if (!this.activeCustomerOrder) return;
    const t = getTranslations(this.settings.language).engine;
    soundEngine.playFoodPackaging();
    soundEngine.playCashRegisterSale();
    this.stats.hasFoodInHand = false;
    if (this.servedCounterDishMesh) {
      this.servedCounterDishMesh.visible = true;
    }
    this.emitStatsIfChanged();

    if (customer.behaviorType === 'clown_customer') {
      const randomPrice = (Math.random() * 5.0 + 7.5).toFixed(2);
      this.pendingThankYouDialogue = true;
      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.orderCompleted(randomPrice));
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
      this.startDialogue(t.clownChickenDeliveredDialogue(randomPrice), false, customer.id);
      return;
    }

    // Night 2 last guest: as soon as Duck places the dish on the table, the door-peeking clown disappears!
    if (this.n2LastGuestClownPeeking) {
      this.n2LastGuestClownPeeking = false;
      this.clownActor.setPeekPose?.(false, performance.now() / 1000);
      this.clownActor.group.visible = false;
    }

    const randomPrice = (Math.random() * 9.0 + 5.5).toFixed(2);
    let deliveryLines: DialogueLine[];
    if (customer.behaviorType === 'grumpy_man') {
      deliveryLines = t.grumpyDeliveredDialogue(this.activeCustomerOrder.customerName, randomPrice);
    } else if (customer.behaviorType === 'friends_group') {
      deliveryLines = t.friendsSeatedDialogue(this.activeCustomerOrder.customerName, randomPrice);
    } else {
      deliveryLines = t.thankYouDialogue(this.activeCustomerOrder.customerName, randomPrice);
    }

    this.pendingThankYouDialogue = true;
    soundEngine.playObjectiveComplete();
    this.callbacks.onObjectiveCompletedNotice(t.notices.orderCompleted(randomPrice));
    window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);

    this.startDialogue(deliveryLines, false, customer.id);
  }

  private startCustomerDialogue() {
    if (!this.nearbyCustomer) return;
    const t = getTranslations(this.settings.language).engine;
    const custList =
      this.nightState.night === 3
        ? t.customersNight3
        : this.nightState.night === 2
        ? t.customersNight2
        : t.customers;

    // Special Night 3 Clown Customer buying chicken
    if (this.nearbyCustomer.behaviorType === 'clown_customer') {
      if (
        this.orderPhase === 'ready_to_serve' &&
        this.stats.hasFoodInHand &&
        this.activeCustomerOrder &&
        this.activeCustomerOrder.orderSource !== 'drive_thru'
      ) {
        this.serveLobbyOrderOnTable(this.nearbyCustomer);
        return;
      }

      if (
        (this.orderPhase === 'preparing' ||
          (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
        this.activeCustomerOrder &&
        this.activeCustomerOrder.orderSource !== 'drive_thru'
      ) {
        this.startDialogue(
          t.waitingOrderDialogue(t.clownCustomerName, t.clownCustomerOrderItem),
          false,
          this.nearbyCustomer.id
        );
        return;
      }

      this.currentDialogueCustomer = this.nearbyCustomer;
      this.startDialogue(t.clownBuyChickenDialogue, false, this.nearbyCustomer.id);
      return;
    }

    // A. Food is ready in Duck's hands for a lobby guest: Place the dish on the table!
    if (
      this.orderPhase === 'ready_to_serve' &&
      this.stats.hasFoodInHand &&
      this.activeCustomerOrder &&
      this.activeCustomerOrder.orderSource !== 'drive_thru'
    ) {
      this.serveLobbyOrderOnTable(this.nearbyCustomer);
      return;
    }

    // B. Player already took the lobby order, but hasn't finished prepping/picking it up yet
    if (
      (this.orderPhase === 'preparing' ||
        (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
      this.activeCustomerOrder &&
      this.activeCustomerOrder.orderSource !== 'drive_thru'
    ) {
      const waitingLines = t.waitingOrderDialogue(
        this.activeCustomerOrder.customerName,
        this.activeCustomerOrder.itemText
      );
      this.startDialogue(waitingLines, false, this.nearbyCustomer.id);
      return;
    }

    // B2. Already busy preparing or holding an active Drive-Thru order -> finish Drive-Thru first
    if (this.orderPhase !== 'none' && this.activeCustomerOrder?.orderSource === 'drive_thru') {
      this.callbacks.onObjectiveCompletedNotice(
        this.stats.hasFoodInHand
          ? t.notices.mealInHands
          : t.notices.newTaskPrep(this.activeCustomerOrder.customerName)
      );
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      return;
    }

    // C. Initial arrival: customer places order (or asks Duck to restock first if chicken ran out)
    const custName = custList[(this.nearbyCustomer.archetypeIndex ?? 0) % custList.length]?.name || this.nearbyCustomer.archetypeName;
    if (this.foodOutOfStock) {
      this.startDialogue(t.waitRestockDialogue(custName), false, this.nearbyCustomer.id);
      return;
    }
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
    const w = Math.max(1, this.container.clientWidth);
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    const capped = this.getCappedRenderSize(w, h);
    this.renderer.setPixelRatio(1);
    this.renderer.setSize(capped.width, capped.height, false);
    if (this.composer) {
      this.composer.setPixelRatio(1);
      this.composer.setSize(capped.width, capped.height);
    }
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

    this.mobileSprint = false;
    this.stats.isSprinting = false;
    this.stats.stamina = 100;
    this.stats.flashlightOn = true;
    this.stats.hasTrashInHand = false;
    this.stats.hasCardboardInHand = false;
    this.stats.hasFoodInHand = false;
    this.stats.hasRawFryItemsInHand = false;
    this.stats.hasBigMacInHand = false;
    this.stats.hasCoffeeCupInHand = false;
    this.stats.hasSodaCupInHand = false;
    this.stats.hasMopInHand = false;
    this.stats.hasChickenTrayInHand = false;
    this.stats.hasNoodlesAndDrinkInHand = false;
    this.stats.mustDiscardFood = false;

    // Reset customer food order state
    this.activeCustomerOrder = null;
    this.orderPhase = 'none';
    this.cookingStep = 'none';
    this.pendingThankYouDialogue = false;
    this.currentDialogueCustomer = null;
    this.isPreparingFood = false;
    this.prepCountdown = 0;
    this.lastPrepSecLeft = -1;
    this.mopSwingTimer = 0;
    this.mustDiscardFood = false;
    this.foodOutOfStock = false;
    this.restockCompletedThisNight = false;
    this.pendingOutOfFoodDialogue = false;
    this.n2BathroomKnockTriggered = false;
    this.n2BathroomCheckPending = false;
    this.pendingBathroomKnockDialogue = false;
    this.store67Stage = 'none';
    this.store67FadePhase = 'none';
    if (this.world?.store67Group) this.world.store67Group.visible = false;
    if (this.world?.rainSystem) this.world.rainSystem.visible = true;
    if (this.scene?.fog instanceof THREE.Fog) {
      if (this.scene.background instanceof THREE.Color) {
        this.scene.fog.color.copy(this.scene.background);
      }
      this.scene.fog.near = 4.5;
      this.scene.fog.far = 25;
    }
    if (this.heldMealMesh) this.heldMealMesh.visible = false;
    if (this.heldRawFryMesh) this.heldRawFryMesh.visible = false;
    if (this.heldBigMacMesh) this.heldBigMacMesh.visible = false;
    if (this.heldCoffeeCupMesh) this.heldCoffeeCupMesh.visible = false;
    if (this.heldSodaCupMesh) this.heldSodaCupMesh.visible = false;
    if (this.heldMopMesh) this.heldMopMesh.visible = false;
    if (this.heldChickenTrayMesh) this.heldChickenTrayMesh.visible = false;
    if (this.heldNoodlesDrinkMesh) this.heldNoodlesDrinkMesh.visible = false;
    if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
    if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
    if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
    if (this.world.mopInBucket) this.world.mopInBucket.visible = night !== 3;
    this.resetKitchenAppliancesVisuals();

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
    this.clownJumpscarePlayedThisNight = false;
    this.n2PeekingJumpscarePlayed = false;
    this.warehouseReactionTriggered = false;
    this.nightArrivalIndex = 0;
    this.night1RegularSpawned = 0;
    this.night3RegularSpawned = 0;
    this.night1GuestsServed = 0;
    this.night2GuestsCount = 0;
    this.night2GuestsServed = 0;
    this.driveThruServedThisNight = 0;
    this.driveThruSpawnedThisNight = 0;
    if (this.activeDriveThruCar) {
      this.scene.remove(this.activeDriveThruCar.meshGroup);
      this.activeDriveThruCar = null;
    }
    this.n2LastGuestTriggered = false;
    this.n2LastGuestClownPeeking = false;
    this.night3RegularServed = 0;
    this.night3ClownSpawned = false;
    this.night3ClownServed = false;
    this.night3ClownWatchingFromShop = false;
    this.night3ClownChaseStarted = false;
    this.night3ClownChaseTimer = 0;
    this.night3ClownLaughTimer = 0;
    this.night3CaughtScareTimer = 0;
    this.night3CarPhase = 'none';
    this.night3CarPhaseTimer = 0;
    this.night3ClownAttackStruck = false;
    this.night3ClownAttackStrikeCount = 0;
    this.night3CarCrackShake = 0;
    this.night3CalledPolice = false;
    this.night3TextedJohn = false;
    this.phoneOpen = false;
    this.night3ClownDisappearedFromShop = false;
    this.night3ClownOutOfSightTimer = 0;
    this.night3WindowLaughStarted = false;
    this.night3HeadBloodTimer = 0;
    this.night3HeadBloodDripAccum = 0;
    for (const drop of this.night3BloodDroplets) {
      drop.active = false;
      drop.mesh.visible = false;
    }
    if (this.world.duckCar?.userData?.driverWindowCrack) {
      this.world.duckCar.userData.driverWindowCrack.visible = false;
    }
    if (this.world.duckCar?.userData?.driverWindowBlood) {
      const bloodMesh = this.world.duckCar.userData.driverWindowBlood as THREE.Mesh;
      bloodMesh.visible = false;
      (bloodMesh.material as THREE.MeshBasicMaterial).opacity = 0.94;
    }
    if (this.world.duckCar?.userData?.doorAttackLight) {
      (this.world.duckCar.userData.doorAttackLight as THREE.PointLight).intensity = 0;
    }
    this.emitNight3CarProgress();
    this.customerConvoIndex = 0;
    this.closingShiftTargetScreen = null;
    this.whiteFlashAlpha = 0;
    this.callbacks.onWhiteFlashAlphaUpdate?.(0);
    if (this.clownActor) {
      this.clownActor.setPeekPose?.(false, 0);
      this.clownActor.setHeadBloodied?.(false);
      this.clownActor.head.rotation.set(0, 0, 0);
      this.clownActor.group.position.y = 0;
      this.clownActor.group.rotation.set(0, 0, 0);
      this.clownActor.updateAnimation(0, 0, false);
      this.clownActor.group.visible = false;
    }

    // Background music starts ONLY once Duck walks inside McDonald's (silent outdoors & at 67-Eleven)
    this.nightMusicStartedInside = false;
    this.nightMusicCutByOutage = false;
    this.nightMusicInsideActive = false;
    soundEngine.stopNightMusic();
    soundEngine.stopChaseMusic();
    soundEngine.stopClownLaughs();
    soundEngine.stopCreditsMusic();

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

    // Clown Statue placement: Visible near counter on Nights 1-2, completely disappeared on Night 3
    if (this.world.clownStatue) {
      this.world.clownStatue.visible = night !== 3;
      this.world.clownStatue.position.set(1.15, 0, 1.15);
      this.world.clownStatue.rotation.y = 0.28;
    }
    for (const box of this.world.collisionBoxes) {
      if (box.id === 'clown_statue') {
        box.enabled = night !== 3;
      } else if (box.id === 'clown_statue_night3') {
        box.enabled = false;
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

    // Reset world mesh states & interactive item completion flags (hide unused night props cleanly)
    this.world.interactiveMeshes.forEach((mesh, id) => {
      let visible = true;
      if ((id === 'trash_bag_1' || id === 'trash_bag_2') && night !== 1) visible = false;
      if (id === 'cardboard_bundle' && night !== 2) visible = false;
      if (PUDDLE_IDS.includes(id) && night === 3) visible = false;
      if ((id === 'clean_table_1' || id === 'clean_table_2') && night === 2) visible = false;
      mesh.visible = visible;
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
      night === 1
        ? t.openingMonologueNight1
        : night === 2
        ? t.openingMonologueNight2
        : t.openingMonologueNight3;

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
    if (this.store67Stage === 'hunger_dialogue' || this.store67Stage === 'fading_to_67') {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'store67_hunger',
        title: t.dynamicObjectives.hungerFadeTitle,
        description: t.dynamicObjectives.hungerFadeDesc,
      });
    } else if (this.store67Stage === 'at_67_noodle_stall') {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'store67_noodles',
        title: t.dynamicObjectives.store67NoodlesTitle,
        description: t.dynamicObjectives.store67NoodlesDesc,
      });
    } else if (this.store67Stage === 'at_67_cashier') {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'store67_cashier',
        title: t.dynamicObjectives.store67CashierTitle,
        description: t.dynamicObjectives.store67CashierDesc,
      });
    } else if (this.store67Stage === 'at_67_car') {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'store67_car',
        title: t.dynamicObjectives.store67CarTitle,
        description: t.dynamicObjectives.store67CarDesc,
      });
    } else if (
      this.night3CarPhase === 'hiding_using_phone' ||
      this.night3CarPhase === 'police_dispatched'
    ) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'night3_car_emergency',
        title: t.dynamicObjectives.night3CarEmergencyTitle,
        description: t.dynamicObjectives.night3CarEmergencyDesc,
      });
    } else if (this.nightState.night === 3 && this.night3ClownWatchingFromShop) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'mcd_duck_car',
        title: t.dynamicObjectives.goToMcdCarTitle,
        description: t.dynamicObjectives.goToMcdCarDesc,
      });
    } else if (this.powerOutageActive) {
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
    } else if (this.n2BathroomCheckPending) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'check_bathroom',
        title: t.dynamicObjectives.checkBathroomTitle,
        description: t.dynamicObjectives.checkBathroomDesc,
      });
    } else if (this.foodOutOfStock && !this.stats.hasChickenTrayInHand) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'freezer_restock',
        title: t.dynamicObjectives.restockFreezerTitle,
        description: t.dynamicObjectives.restockFreezerDesc,
      });
    } else if (this.foodOutOfStock && this.stats.hasChickenTrayInHand) {
      this.callbacks.onActiveObjectiveUpdate({
        id: 'kitchen_restock',
        title: t.dynamicObjectives.restockKitchenTitle,
        description: t.dynamicObjectives.restockKitchenDesc,
      });
    } else if (this.isPreparingFood && this.activeCustomerOrder) {
      const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
      if (this.cookingStep === 'frying') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.fryingProgressTitle,
          description: t.dynamicObjectives.fryingProgressDesc(secLeft),
        });
      } else if (this.cookingStep === 'microwaving') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.microwavingProgressTitle,
          description: t.dynamicObjectives.microwavingProgressDesc(secLeft),
        });
      } else if (this.cookingStep === 'brewing_coffee') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.brewingCoffeeProgressTitle,
          description: t.dynamicObjectives.brewingCoffeeProgressDesc(secLeft),
        });
      } else if (this.cookingStep === 'pouring_soda') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pouringSodaProgressTitle,
          description: t.dynamicObjectives.pouringSodaProgressDesc(secLeft),
        });
      } else {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.wrappingProgressTitle,
          description: t.dynamicObjectives.wrappingProgressDesc(secLeft),
        });
      }
    } else if (this.orderPhase === 'preparing' && this.activeCustomerOrder) {
      if (this.cookingStep === 'need_pickup_fry') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pickupFryTitle,
          description: t.dynamicObjectives.pickupFryDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_fryer') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.fryChickenTitle,
          description: t.dynamicObjectives.fryChickenDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_pickup_burger') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pickupBurgerTitle,
          description: t.dynamicObjectives.pickupBurgerDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_microwave') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.microwaveTitle,
          description: t.dynamicObjectives.microwaveDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_pickup_coffee_cup') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pickupCoffeeCupTitle,
          description: t.dynamicObjectives.pickupCoffeeCupDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_coffee') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.coffeeMachineTitle,
          description: t.dynamicObjectives.coffeeMachineDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_pickup_soda_cup') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pickupSodaCupTitle,
          description: t.dynamicObjectives.pickupSodaCupDesc(this.activeCustomerOrder.customerName),
        });
      } else if (this.cookingStep === 'need_soda') {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.sodaDispenserTitle,
          description: t.dynamicObjectives.sodaDispenserDesc(this.activeCustomerOrder.customerName),
        });
      } else {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.wrapFoodTitle,
          description: t.dynamicObjectives.wrapFoodDesc(this.activeCustomerOrder.customerName),
        });
      }
    } else if (this.orderPhase === 'ready_to_serve' && this.activeCustomerOrder) {
      if (this.cookingStep === 'need_pickup_finished' && !this.stats.hasFoodInHand) {
        this.callbacks.onActiveObjectiveUpdate({
          id: 'prep_order',
          title: t.dynamicObjectives.pickupFinishedTitle,
          description: t.dynamicObjectives.pickupFinishedDesc(this.activeCustomerOrder.customerName),
        });
      } else {
        const serveDesc =
          this.activeCustomerOrder.orderSource === 'drive_thru'
            ? t.dynamicObjectives.serveDriveThruDesc(this.activeCustomerOrder.customerName)
            : t.dynamicObjectives.serveDesc(this.activeCustomerOrder.customerName);
        this.callbacks.onActiveObjectiveUpdate({
          id: 'serve_order',
          title: t.dynamicObjectives.serveTitle,
          description: serveDesc,
        });
      }
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
      this.customerSpawnTimer = 3.0; // First customer arrives cleanly in 3 seconds
    }
  }

  public setScreen(screen: GameScreen) {
    this.currentScreen = screen;
    this.callbacks.onScreenChange(screen);

    if (screen === 'playing') {
      this.requestPointerLock();
    } else {
      this.whiteFlashAlpha = 0;
      this.callbacks.onWhiteFlashAlphaUpdate?.(0);
      this.exitPointerLock();
      if (
        screen === 'menu' ||
        screen === 'night1_complete' ||
        screen === 'night2_complete' ||
        screen === 'night3_ending' ||
        screen === 'night3_bad_ending' ||
        screen === 'credits'
      ) {
        soundEngine.stopNightMusic();
        soundEngine.stopClownLaughs();
      }
      if (screen === 'menu') {
        soundEngine.stopChaseMusic();
        soundEngine.stopCreditsMusic();
      }
    }
  }

  public togglePause() {
    this.isPaused = !this.isPaused;
    if (this.isPaused) {
      soundEngine.setNightMusicPaused(true);
      soundEngine.setChaseMusicPaused(true);
      this.keys = {};
      this.mobileSprint = false;
      this.exitPointerLock();
    } else {
      const allowMusic =
        this.nightMusicStartedInside &&
        !this.nightMusicCutByOutage &&
        !this.powerOutageActive &&
        this.store67Stage === 'none' &&
        !this.night3ClownChaseStarted &&
        this.isInsideMcDonaldsInterior();
      soundEngine.setNightMusicPaused(!allowMusic);
      this.nightMusicInsideActive = allowMusic;
      if (this.night3ClownChaseStarted && !this.closingShiftTargetScreen) {
        soundEngine.setChaseMusicPaused(false);
      }
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
      // Route through UI dialogue box so first press only finishes scrolling text and never skips to next chat
      window.dispatchEvent(new CustomEvent('mcd-dialogue-action'));
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
      this.nightMusicCutByOutage = false;
      this.nightMusicStartedInside = false;
      this.nightMusicInsideActive = false;
      this.setStorePower(true);
      soundEngine.playPowerRestore();
      if (this.isInsideMcDonaldsInterior()) {
        this.nightMusicStartedInside = true;
        this.nightMusicInsideActive = true;
        soundEngine.playNightMusic(this.nightState.night);
      }
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
      this.clownSightGraceTimer = 0;
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

    // 67-Eleven Sequence Interactions: Stall -> Employee ($10) -> Duck's Car (Auto-End Night)
    if (item.type === 'store_67_noodle_stall' && this.store67Stage === 'at_67_noodle_stall') {
      soundEngine.playFoodPackaging();
      soundEngine.playObjectiveComplete();
      item.completed = true;
      this.store67Stage = 'at_67_cashier';
      this.callbacks.onObjectiveCompletedNotice(t.notices.pickedUpNoodlesDrink);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      this.notifyActiveObjective();
      return;
    }

    if (item.type === 'store_67_cashier' && this.store67Stage === 'at_67_cashier') {
      this.startDialogue(t.clerk67Dialogue, false, 'store_67_cashier');
      return;
    }

    if (item.type === 'store_67_car' && this.store67Stage === 'at_67_car') {
      if (!this.closingShiftTargetScreen) {
        soundEngine.playCarDoorAndEngine();
        this.closingShiftTargetScreen =
          this.nightState.night === 1 ? 'night1_complete' : 'night2_complete';
        this.fadeAlpha = Math.max(this.fadeAlpha, 0.01);
        this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      }
      return;
    }

    // Night 3 Climax: Duck gets into his spacious car outside McDonald's -> out of gas -> Clown attacks window
    if (
      item.type === 'mcd_duck_car' &&
      this.nightState.night === 3 &&
      this.night3ClownWatchingFromShop &&
      this.night3CarPhase === 'none' &&
      !this.closingShiftTargetScreen
    ) {
      this.startNight3CarSequence();
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

    // Pick up Chicken Tray from Walk-In Freezer when kitchen chicken stock runs out
    if (item.type === 'freezer_chicken_tray' && this.foodOutOfStock && !this.stats.hasChickenTrayInHand) {
      soundEngine.playFreezerPickup();
      this.stats.hasChickenTrayInHand = true;
      const mesh = this.world.interactiveMeshes.get(item.id);
      if (mesh) mesh.visible = false;
      this.emitStatsIfChanged();
      this.callbacks.onObjectiveCompletedNotice(t.notices.chickenTrayPickedUp);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
      this.notifyActiveObjective();
      return;
    }

    // Place Finished Dish on Counter Serving Table for Lobby Customer
    if (
      item.type === 'serve_table_spot' &&
      this.orderPhase === 'ready_to_serve' &&
      this.stats.hasFoodInHand &&
      !this.mustDiscardFood &&
      this.activeCustomerOrder?.orderSource !== 'drive_thru' &&
      this.activeCustomerPerson &&
      this.activeCustomerPerson.state !== 'leaving'
    ) {
      this.serveLobbyOrderOnTable(this.activeCustomerPerson);
      return;
    }

    // Drive-Thru Window Customer Interaction (while car is waiting at transparent East window)
    if (
      item.type === 'drive_thru_window' &&
      this.isCustomerArrivalUnlocked() &&
      this.activeDriveThruCar?.state === 'waiting_window' &&
      !this.powerOutageActive
    ) {
      const dtCust = t.driveThruCustomers[this.activeDriveThruCar.customerIndex % t.driveThruCustomers.length];

      // A. Place finished meal on Drive-Thru ledge & hand to driver
      if (
        this.orderPhase === 'ready_to_serve' &&
        this.stats.hasFoodInHand &&
        this.activeCustomerOrder?.orderSource === 'drive_thru' &&
        !this.mustDiscardFood
      ) {
        soundEngine.playFoodPackaging();
        soundEngine.playCashRegisterSale();
        this.stats.hasFoodInHand = false;
        if (this.dtServedDishMesh) {
          this.dtServedDishMesh.visible = true;
        }
        this.emitStatsIfChanged();

        if (this.n2LastGuestClownPeeking) {
          this.n2LastGuestClownPeeking = false;
          this.clownActor.setPeekPose?.(false, performance.now() / 1000);
          this.clownActor.group.visible = false;
        }

        const randomPrice = (Math.random() * 9.0 + 5.5).toFixed(2);
        this.pendingThankYouDialogue = true;
        soundEngine.playObjectiveComplete();
        this.callbacks.onObjectiveCompletedNotice(t.notices.orderCompleted(randomPrice));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
        this.startDialogue(t.thankYouDialogue(dtCust.name, randomPrice), false, 'drive_thru_customer');
        return;
      }

      // B. Waiting on current Drive-Thru order to finish cooking/pickup
      if (
        (this.orderPhase === 'preparing' ||
          (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
        this.activeCustomerOrder?.orderSource === 'drive_thru'
      ) {
        this.startDialogue(
          t.waitingOrderDialogue(this.activeCustomerOrder.customerName, this.activeCustomerOrder.itemText),
          false,
          'drive_thru_customer'
        );
        return;
      }

      // C. Already busy with a lobby order -> ask player to finish current lobby order first
      if (this.orderPhase !== 'none' && this.activeCustomerOrder) {
        this.callbacks.onObjectiveCompletedNotice(
          this.stats.hasFoodInHand
            ? t.notices.mealInHands
            : t.notices.newTaskPrep(this.activeCustomerOrder.customerName)
        );
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
        return;
      }

      // D. Out of food stock -> tell Drive-Thru driver Duck is grabbing Chicken Tray from Freezer first
      if (this.foodOutOfStock) {
        this.startDialogue(t.waitRestockDialogue(dtCust.name), false, 'drive_thru_customer');
        return;
      }

      // E. Take Drive-Thru driver's order!
      this.startDialogue(dtCust.dialogue, false, 'drive_thru_customer');
      return;
    }

    // Step 2: Fried Chicken & Potatoes Machine (must hold raw items first, 5s sizzle + smoke)
    if (item.type === 'fryer_machine') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.foodOutOfStock) {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.restockFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_pickup_fry') {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.needRawFryInHand);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_fryer') {
        if (!this.stats.hasRawFryItemsInHand) {
          soundEngine.playDialogueBlip();
          this.callbacks.onObjectiveCompletedNotice(t.notices.needRawFryInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
          return;
        }
        this.stats.hasRawFryItemsInHand = false;
        this.emitStatsIfChanged();
        this.cookingStep = 'frying';
        this.isPreparingFood = true;
        this.prepCountdown = 5.0;
        this.lastPrepSecLeft = 5;
        this.prepAudioTimer = 0;
        this.flickerBuzzTimer = 0;
        if (this.world?.fryerMachine) {
          const basket = this.world.fryerMachine.userData.fryBasket as THREE.Object3D | undefined;
          const fLight = this.world.fryerMachine.userData.fryLight as THREE.PointLight | undefined;
          if (basket) basket.visible = true;
          if (fLight) fLight.intensity = 1.4;
        }
        soundEngine.playFryerSizzle(5.0);
        soundEngine.playFluorescentFlickerBuzz();
        this.callbacks.onObjectiveCompletedNotice(t.notices.fryStarted);
        this.notifyActiveObjective();
      } else if (this.cookingStep === 'frying') {
        const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
        this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
      } else {
        this.callbacks.onObjectiveCompletedNotice(t.notices.noPendingOrders);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      }
      return;
    }

    // Step 4: Kitchen Microwave (must hold Big Mac in hand first, 5s heating + hum + ding)
    if (item.type === 'kitchen_microwave') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_pickup_burger') {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.needBigMacInHand);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_microwave') {
        if (!this.stats.hasBigMacInHand) {
          soundEngine.playDialogueBlip();
          this.callbacks.onObjectiveCompletedNotice(t.notices.needBigMacInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
          return;
        }
        this.stats.hasBigMacInHand = false;
        this.emitStatsIfChanged();
        this.cookingStep = 'microwaving';
        this.isPreparingFood = true;
        this.prepCountdown = 5.0;
        this.lastPrepSecLeft = 5;
        this.prepAudioTimer = 0;
        this.flickerBuzzTimer = 0;
        if (this.world?.kitchenMicrowave) {
          const mLight = this.world.kitchenMicrowave.userData.microwaveLight as THREE.PointLight | undefined;
          const mBurger = this.world.kitchenMicrowave.userData.microwaveBurger as THREE.Object3D | undefined;
          if (mLight) mLight.intensity = 1.5;
          if (mBurger) mBurger.visible = true;
        }
        soundEngine.playMicrowaveHumAndDing(5.0);
        this.callbacks.onObjectiveCompletedNotice(t.notices.microwaveStarted);
        this.notifyActiveObjective();
      } else if (this.cookingStep === 'microwaving') {
        const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
        this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
      } else {
        this.callbacks.onObjectiveCompletedNotice(t.notices.noPendingOrders);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      }
      return;
    }

    // Step 5 (Order-based): Commercial Coffee Machine (hold coffee cup in hand, 3s brew + steam)
    if (item.type === 'coffee_machine') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.foodOutOfStock) {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.restockFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_pickup_coffee_cup') {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.needCoffeeCupInHand);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_coffee') {
        if (!this.stats.hasCoffeeCupInHand) {
          soundEngine.playDialogueBlip();
          this.callbacks.onObjectiveCompletedNotice(t.notices.needCoffeeCupInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
          return;
        }
        this.stats.hasCoffeeCupInHand = false;
        this.emitStatsIfChanged();
        this.cookingStep = 'brewing_coffee';
        this.isPreparingFood = true;
        this.prepCountdown = 3.0;
        this.lastPrepSecLeft = 3;
        this.prepAudioTimer = 0;
        this.flickerBuzzTimer = 0;
        if (this.world?.coffeeMachine) {
          const cup = this.world.coffeeMachine.userData.brewingCup as THREE.Object3D | undefined;
          const stream = this.world.coffeeMachine.userData.coffeeStream as THREE.Object3D | undefined;
          const cLight = this.world.coffeeMachine.userData.coffeeLight as THREE.PointLight | undefined;
          const puffs = this.world.coffeeMachine.userData.steamPuffs as THREE.Mesh[] | undefined;
          if (cup) cup.visible = true;
          if (stream) stream.visible = true;
          if (cLight) cLight.intensity = 1.4;
          if (puffs) puffs.forEach((p) => (p.visible = true));
        }
        soundEngine.playCoffeeBrewSteam();
        this.callbacks.onObjectiveCompletedNotice(t.notices.coffeeStarted);
        this.notifyActiveObjective();
      } else if (this.cookingStep === 'brewing_coffee') {
        const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
        this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
      } else {
        this.callbacks.onObjectiveCompletedNotice(t.notices.noPendingOrders);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      }
      return;
    }

    // Step 6 (Order-based): Soft Drink Dispenser (hold soda cup in hand, 3s carbonated pour)
    if (item.type === 'soda_dispenser') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.foodOutOfStock) {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.restockFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_pickup_soda_cup') {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.needSodaCupInHand);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder && this.cookingStep === 'need_soda') {
        if (!this.stats.hasSodaCupInHand) {
          soundEngine.playDialogueBlip();
          this.callbacks.onObjectiveCompletedNotice(t.notices.needSodaCupInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2800);
          return;
        }
        this.stats.hasSodaCupInHand = false;
        this.emitStatsIfChanged();
        this.cookingStep = 'pouring_soda';
        this.isPreparingFood = true;
        this.prepCountdown = 3.0;
        this.lastPrepSecLeft = 3;
        this.prepAudioTimer = 0;
        this.flickerBuzzTimer = 0;
        if (this.world?.sodaDispenser) {
          const cup = this.world.sodaDispenser.userData.fillingCup as THREE.Object3D | undefined;
          const stream = this.world.sodaDispenser.userData.sodaStream as THREE.Object3D | undefined;
          const sLight = this.world.sodaDispenser.userData.sodaLight as THREE.PointLight | undefined;
          if (cup) cup.visible = true;
          if (stream) stream.visible = true;
          if (sLight) sLight.intensity = 1.4;
        }
        soundEngine.playSodaPour(3.0);
        this.callbacks.onObjectiveCompletedNotice(t.notices.sodaStarted);
        this.notifyActiveObjective();
      } else if (this.cookingStep === 'pouring_soda') {
        const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
        this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
      } else {
        this.callbacks.onObjectiveCompletedNotice(t.notices.noPendingOrders);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2500);
      }
      return;
    }

    // Kitchen Prep Table: Take Raw Fry -> Take Big Mac -> Take Coffee/Soda Cups -> Wrap Everything Up (2s) -> Pick Up Finished Dish & Restock
    if (item.type === 'kitchen_prep_station') {
      if (this.mustDiscardFood && this.stats.hasFoodInHand) {
        this.callbacks.onObjectiveCompletedNotice(t.notices.discardFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.stats.hasChickenTrayInHand) {
        soundEngine.playFoodPackaging();
        soundEngine.playObjectiveComplete();
        this.stats.hasChickenTrayInHand = false;
        this.foodOutOfStock = false;
        this.restockCompletedThisNight = true;
        this.emitStatsIfChanged();
        this.callbacks.onObjectiveCompletedNotice(t.notices.kitchenRestocked);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
        this.notifyActiveObjective();
        return;
      }
      if (this.foodOutOfStock) {
        soundEngine.playDialogueBlip();
        this.callbacks.onObjectiveCompletedNotice(t.notices.restockFoodFirst);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        return;
      }
      if (this.orderPhase === 'preparing' && this.activeCustomerOrder) {
        if (this.cookingStep === 'need_pickup_fry') {
          this.stats.hasRawFryItemsInHand = true;
          this.cookingStep = 'need_fryer';
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          this.callbacks.onObjectiveCompletedNotice(t.notices.rawFryInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3200);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'need_pickup_burger') {
          this.stats.hasBigMacInHand = true;
          this.cookingStep = 'need_microwave';
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          this.callbacks.onObjectiveCompletedNotice(t.notices.bigMacInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3200);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'need_pickup_coffee_cup') {
          this.stats.hasCoffeeCupInHand = true;
          this.cookingStep = 'need_coffee';
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          this.callbacks.onObjectiveCompletedNotice(t.notices.coffeeCupInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3200);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'need_pickup_soda_cup') {
          this.stats.hasSodaCupInHand = true;
          this.cookingStep = 'need_soda';
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          this.callbacks.onObjectiveCompletedNotice(t.notices.sodaCupInHand);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3200);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'need_wrap' && !this.isPreparingFood) {
          this.cookingStep = 'wrapping';
          this.isPreparingFood = true;
          this.prepCountdown = 2.0;
          this.lastPrepSecLeft = 2;
          this.prepAudioTimer = 0;
          this.flickerBuzzTimer = 0;
          soundEngine.playFoodPackaging();
          this.callbacks.onObjectiveCompletedNotice(t.notices.wrapStarted);
          this.notifyActiveObjective();
        } else if (this.isPreparingFood) {
          const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
          this.callbacks.onObjectiveCompletedNotice(t.notices.prepInProgress(secLeft));
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2000);
        } else if (this.cookingStep === 'need_fryer') {
          this.callbacks.onObjectiveCompletedNotice(t.prompts.useFryer);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2400);
        } else if (this.cookingStep === 'need_microwave') {
          this.callbacks.onObjectiveCompletedNotice(t.prompts.useMicrowave);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2400);
        } else if (this.cookingStep === 'need_coffee') {
          this.callbacks.onObjectiveCompletedNotice(t.prompts.useCoffeeMachine);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2400);
        } else if (this.cookingStep === 'need_soda') {
          this.callbacks.onObjectiveCompletedNotice(t.prompts.useSodaDispenser);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 2400);
        }
      } else if (this.orderPhase === 'ready_to_serve') {
        if (this.cookingStep === 'need_pickup_finished' && !this.stats.hasFoodInHand) {
          this.cookingStep = 'none';
          this.stats.hasFoodInHand = true;
          if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.orderReady);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3800);
          this.notifyActiveObjective();
        } else {
          this.callbacks.onObjectiveCompletedNotice(t.notices.mealInHands);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        }
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

      // Step 8: At 6:00 AM after customers, hunger & 67-Eleven ending runs instead of direct exit
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour >= 6) {
          if (this.store67Stage === 'none') {
            this.store67Stage = 'waiting_departures';
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

      // Step 7: At 6:00 AM after customers, hunger & 67-Eleven ending runs instead of direct exit
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour >= 6) {
          if (this.store67Stage === 'none') {
            this.store67Stage = 'waiting_departures';
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

    // --- NIGHT 3 INTERACTIONS ---
    if (this.nightState.night === 3) {
      if (currentStep.id === 'talk_to_john' && item.type === 'employee_john') {
        this.startDialogue(t.johnDialogueNight3, false, 'employee_john');
        return;
      }

      if (currentStep.id === 'n3_clock_in' && item.type === 'time_clock') {
        soundEngine.playTimeClockPunch();
        this.nightState.clockedIn = true;
        this.advanceObjective();
        return;
      }

      if (currentStep.id === 'n3_clean_tables' && item.type === 'clean_table') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;

        this.nightState.tablesCleaned += 1;
        currentStep.currentCount = this.nightState.tablesCleaned;
        currentStep.description = t.steps.n3_clean_tables.description(this.nightState.tablesCleaned);

        if (this.nightState.tablesCleaned >= 2) {
          this.advanceObjective();
        } else {
          this.notifyActiveObjective();
        }
        return;
      }

      if (currentStep.id === 'n3_kitchen_check' && item.type === 'kitchen_switch') {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.nightState.kitchenShutDown = true;
        this.advanceObjective();
        return;
      }

      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        const hr = this.nightState.timeHour === 0 ? 12 : this.nightState.timeHour;
        const mn = this.nightState.timeMinute < 10 ? `0${this.nightState.timeMinute}` : this.nightState.timeMinute;
        this.callbacks.onObjectiveCompletedNotice(t.notices.shiftEnds6am(`${hr}:${mn} AM`));
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
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

    // Dynamic Chromatic Aberration intensity modulated by horror tension & camera mode
    let targetChromatic = 0.0058;
    if (this.night3CaughtScareTimer > 0 || this.closingShiftTargetScreen === 'night3_bad_ending') {
      targetChromatic = 0.036;
    } else if (this.currentScreen === 'cctv') {
      targetChromatic = 0.012;
    } else if (this.night3ClownChaseStarted && this.night3ClownChaseTimer > 0) {
      targetChromatic = 0.0175;
    } else if (this.night3ClownWatchingFromShop || this.clownState === 'watching' || this.clownState === 'running_away') {
      targetChromatic = 0.0125;
    } else if (this.powerOutageActive) {
      targetChromatic = 0.0105;
    }
    this.chromaticStrength = THREE.MathUtils.damp(this.chromaticStrength, targetChromatic, 10, dt);
    this.chromaticPass.uniforms.uAmount.value = this.chromaticStrength;

    // Render Scene via 720p EffectComposer with Chromatic Aberration
    if (this.currentScreen === 'cctv') {
      const camConfig = this.world.cctvCameras[this.nightState.cctvActiveCam - 1];
      this.cctvCamera.position.copy(camConfig.position);
      this.cctvCamera.lookAt(camConfig.lookAt);
      this.renderPass.camera = this.cctvCamera;
    } else {
      this.renderPass.camera = this.camera;
    }
    this.composer.render();
  }

  private updateSimulation(dt: number, clockDt: number) {
    // Active Night 3 Caught Jumpscare sequence: lock movement, snap/shake camera onto Clown's face, then cut to Bad Ending
    if (this.night3CaughtScareTimer > 0) {
      this.night3CaughtScareTimer = Math.max(0, this.night3CaughtScareTimer - dt);
      const scareNorm = Math.min(1, this.night3CaughtScareTimer / 0.85);
      this.whiteFlashAlpha = Math.max(0, this.whiteFlashAlpha - dt * 2.4);
      this.callbacks.onWhiteFlashAlphaUpdate?.(this.whiteFlashAlpha);
      this.playerVel.set(0, 0, 0);
      if (this.clownActor) {
        const timeSec = performance.now() / 1000;
        this.clownActor.group.visible = true;
        const lookYaw = Math.atan2(
          this.playerPos.x - this.clownActor.group.position.x,
          this.playerPos.z - this.clownActor.group.position.z
        );
        this.clownActor.group.rotation.y = lookYaw;
        this.clownActor.updateAnimation(timeSec, 6.0, true);

        const dx = this.clownActor.group.position.x - this.playerPos.x;
        const dy = 2.16 - this.playerPos.y;
        const dz = this.clownActor.group.position.z - this.playerPos.z;
        const horiz = Math.max(0.1, Math.hypot(dx, dz));
        const targetYaw = Math.atan2(-dx, -dz);
        const targetPitch = THREE.MathUtils.clamp(Math.atan2(dy, horiz), -Math.PI / 2.2, Math.PI / 2.2);
        this.yaw = this.dampAngle(this.yaw, targetYaw, 24, dt);
        this.pitch = THREE.MathUtils.damp(this.pitch, targetPitch, 24, dt);

        const amp = 0.35 + scareNorm * 0.65;
        const shakeX = (Math.sin(timeSec * 58) * 0.6 + (Math.random() - 0.5) * 0.8) * 0.042 * amp;
        const shakeY = (Math.cos(timeSec * 67) * 0.6 + (Math.random() - 0.5) * 0.8) * 0.042 * amp;
        const shakeRoll = (Math.sin(timeSec * 49) * 0.022 + (Math.random() - 0.5) * 0.018) * amp;
        this.camera.position.set(this.playerPos.x + shakeX, this.playerPos.y + shakeY, this.playerPos.z);
        this._tmpLookTarget
          .copy(this.camera.position)
          .add(
            this._tmpCamDir.set(
              Math.cos(this.pitch) * -Math.sin(this.yaw),
              Math.sin(this.pitch),
              Math.cos(this.pitch) * -Math.cos(this.yaw)
            )
          );
        this.camera.lookAt(this._tmpLookTarget);
        this.camera.rotateZ(shakeRoll);
        this.flashlight.visible = true;
        this.flashlight.position.copy(this.camera.position);
        this.flashlightTarget.position.copy(this.camera.position).addScaledVector(this._tmpCamDir, 10);
        this.playerDimLight.position.copy(this.camera.position);
      }

      if (this.night3CaughtScareTimer <= 0) {
        this.whiteFlashAlpha = 0;
        this.callbacks.onWhiteFlashAlphaUpdate?.(0);
        this.closingShiftTargetScreen = 'night3_bad_ending';
        this.fadeAlpha = Math.max(this.fadeAlpha, 0.08);
        this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      }
      return;
    }

    // Smooth fade transition when ending shift (entering Duck's car or caught by Clown Bad Ending)
    if (this.closingShiftTargetScreen) {
      this.playerVel.set(0, 0, 0);
      const fadeDuration = this.closingShiftTargetScreen === 'night3_bad_ending' ? 0.35 : 1.0;
      this.fadeAlpha = Math.min(1.0, this.fadeAlpha + dt / fadeDuration);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      if (this.fadeAlpha >= 1.0) {
        const target = this.closingShiftTargetScreen;
        this.closingShiftTargetScreen = null;
        this.setScreen(target);
      }
      return;
    }

    // Smooth fade out -> teleport Duck to 67-Eleven -> fade back in
    if (this.store67FadePhase === 'out') {
      this.playerVel.set(0, 0, 0);
      this.fadeAlpha = Math.min(1.0, this.fadeAlpha + dt / 1.1);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      if (this.fadeAlpha >= 1.0) {
        // Cleanly clear any leftover McDonald's hand items & switch scene zone to 67-Eleven
        this.stats.hasFoodInHand = false;
        this.stats.hasRawFryItemsInHand = false;
        this.stats.hasBigMacInHand = false;
        this.stats.hasCoffeeCupInHand = false;
        this.stats.hasSodaCupInHand = false;
        this.stats.hasMopInHand = false;
        this.stats.hasTrashInHand = false;
        this.stats.hasCardboardInHand = false;
        this.stats.hasChickenTrayInHand = false;
        this.stats.mustDiscardFood = false;
        this.stats.hasNoodlesAndDrinkInHand = false;
        this.mustDiscardFood = false;
        if (this.heldMealMesh) this.heldMealMesh.visible = false;
        if (this.heldRawFryMesh) this.heldRawFryMesh.visible = false;
        if (this.heldBigMacMesh) this.heldBigMacMesh.visible = false;
        if (this.heldCoffeeCupMesh) this.heldCoffeeCupMesh.visible = false;
        if (this.heldSodaCupMesh) this.heldSodaCupMesh.visible = false;
        if (this.heldMopMesh) this.heldMopMesh.visible = false;
        if (this.heldChickenTrayMesh) this.heldChickenTrayMesh.visible = false;
        if (this.heldNoodlesDrinkMesh) this.heldNoodlesDrinkMesh.visible = false;
        if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
        if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
        if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
        this.emitStatsIfChanged();

        if (this.world?.store67Group) this.world.store67Group.visible = true;
        if (this.world?.rainSystem) this.world.rainSystem.visible = false;
        if (this.scene?.fog instanceof THREE.Fog) {
          if (this.scene.background instanceof THREE.Color) {
            this.scene.fog.color.copy(this.scene.background);
          }
          this.scene.fog.near = 6.0;
          this.scene.fog.far = 34;
        }
        this.playerPos.set(0, 1.65, 147.8);
        this.playerVel.set(0, 0, 0);
        this.yaw = 0; // Facing -Z straight toward 67-ELEVEN sign & open sliding glass entrance
        this.pitch = 0;
        this.targetHeight = 1.65;
        this.playerHeight = 1.65;

        // Ensure McDonald's BGM is completely stopped once leaving McDonald's for 67-Eleven
        this.nightMusicStartedInside = false;
        this.nightMusicInsideActive = false;
        soundEngine.stopNightMusic();

        soundEngine.playStore67Chime();
        this.store67Stage = 'at_67_noodle_stall';
        this.store67FadePhase = 'in';
        const t = getTranslations(this.settings.language).engine;
        this.callbacks.onObjectiveCompletedNotice(t.notices.arrived67Eleven);
        window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
        this.notifyActiveObjective();
      }
      return;
    }

    if (this.store67FadePhase === 'in') {
      this.fadeAlpha = Math.max(0.0, this.fadeAlpha - dt / 1.1);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      if (this.fadeAlpha <= 0) {
        this.store67FadePhase = 'none';
      }
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
        // Unlock front exit on shift end
        const t = getTranslations(this.settings.language).engine;
        const steps =
          this.nightState.night === 1
            ? this.night1Steps
            : this.nightState.night === 2
            ? this.night2Steps
            : this.night3Steps;
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

    // Night 2 3:33 AM Bathroom Knocking Event (totalMinutes >= 213 out of 360)
    if (
      this.nightState.night === 2 &&
      totalMinutes >= 213 &&
      newHour < 6 &&
      !this.n2BathroomKnockTriggered
    ) {
      const t = getTranslations(this.settings.language).engine;
      this.n2BathroomKnockTriggered = true;
      this.n2BathroomCheckPending = true;
      soundEngine.playBathroomKnock();
      this.callbacks.onObjectiveCompletedNotice(t.notices.bathroomKnock);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4500);
      this.notifyActiveObjective();

      if (!this.dialogueState.active) {
        this.startDialogue([{ speaker: 'Duck', text: t.bathroomKnockDialogue }], true, 'bathroom_knock');
      } else {
        this.pendingBathroomKnockDialogue = true;
      }
    }

    // Night 2 Bathroom Check: Entering the restroom finds nothing there -> "Nothing checked"
    if (
      this.n2BathroomCheckPending &&
      !this.dialogueState.active &&
      this.playerPos.x <= -8.6 &&
      this.playerPos.z >= 0.4 &&
      this.playerPos.z <= 5.6
    ) {
      const t = getTranslations(this.settings.language).engine;
      this.n2BathroomCheckPending = false;
      this.pendingBathroomKnockDialogue = false;
      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(t.notices.bathroomNothingHere);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      this.startDialogue([{ speaker: 'Duck', text: t.bathroomEmptyDialogue }], true, 'bathroom_empty');
      this.notifyActiveObjective();
    }

    // 3:00 AM Power Outage Event (Night 1)
    if (newHour >= 3 && newHour < 6 && !this.powerOutageTriggered && this.nightState.night === 1) {
      const t = getTranslations(this.settings.language).engine;
      this.powerOutageTriggered = true;
      this.powerOutageActive = true;
      this.nightMusicCutByOutage = true;
      this.nightMusicInsideActive = false;
      soundEngine.stopNightMusic();
      this.setStorePower(false);
      soundEngine.playPowerOutage();

      if (this.stats.hasFoodInHand) {
        this.mustDiscardFood = true;
        this.stats.mustDiscardFood = true;
      }
      this.stats.hasRawFryItemsInHand = false;
      this.stats.hasBigMacInHand = false;
      this.stats.hasCoffeeCupInHand = false;
      this.stats.hasSodaCupInHand = false;
      if (this.heldRawFryMesh) this.heldRawFryMesh.visible = false;
      if (this.heldBigMacMesh) this.heldBigMacMesh.visible = false;
      if (this.heldCoffeeCupMesh) this.heldCoffeeCupMesh.visible = false;
      if (this.heldSodaCupMesh) this.heldSodaCupMesh.visible = false;
      if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = false;
      if (this.servedCounterDishMesh) this.servedCounterDishMesh.visible = false;
      if (this.dtServedDishMesh) this.dtServedDishMesh.visible = false;
      this.emitStatsIfChanged();

      // Cancel active cooking/order since power is out and customer refuses service
      this.isPreparingFood = false;
      this.prepCountdown = 0;
      this.lastPrepSecLeft = -1;
      this.cookingStep = 'none';
      this.resetKitchenAppliancesVisuals();
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
        // Rewind arrival counter for unserved walkout guest so all 4 regular + 2 drive-thru can complete after power returns
        this.nightArrivalIndex = Math.max(0, this.nightArrivalIndex - 1);
        this.night1RegularSpawned = Math.max(0, this.night1RegularSpawned - 1);
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

    // McDonald's Interior-Only Background Music Control (never plays outside, at 67-Eleven, during chase, or after Night 1 blackout)
    if (
      this.store67Stage === 'none' &&
      this.playerPos.z < 100 &&
      !this.nightMusicCutByOutage &&
      !this.powerOutageActive &&
      !this.night3ClownChaseStarted
    ) {
      const insideMcD = this.isInsideMcDonaldsInterior();
      if (!this.nightMusicStartedInside) {
        if (insideMcD) {
          this.nightMusicStartedInside = true;
          this.nightMusicInsideActive = true;
          soundEngine.playNightMusic(this.nightState.night);
        }
      } else if (insideMcD !== this.nightMusicInsideActive) {
        this.nightMusicInsideActive = insideMcD;
        soundEngine.setNightMusicPaused(!insideMcD);
      }
    } else if (this.nightMusicInsideActive) {
      this.nightMusicInsideActive = false;
      soundEngine.setNightMusicPaused(true);
    }

    // Smooth visual fade-in from black upon night start (when not in 67-Eleven fade)
    if (this.store67FadePhase === 'none' && this.fadeAlpha > 0) {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - dt / 1.8);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
    }

    // If all customers finished early and a mandatory 3:00 AM / 3:33 AM event just finished after last dialogue, advance to 6 AM
    if (
      this.store67Stage === 'none' &&
      !this.dialogueState.active &&
      !this.isPreparingFood &&
      this.areAllNightCustomersServed() &&
      !this.powerOutageActive &&
      !this.n2BathroomCheckPending &&
      !this.pendingPowerOutageDialogue &&
      !this.pendingOutOfFoodDialogue &&
      !this.pendingBathroomKnockDialogue &&
      this.clownState !== 'watching' &&
      this.clownState !== 'running_away' &&
      !(this.nightState.night === 1 && !this.powerOutageTriggered) &&
      !(this.nightState.night === 2 && !this.n2BathroomKnockTriggered)
    ) {
      this.handleAllCustomersServedProgression();
    }

    // Trigger post-customer Hunger Event as soon as all customers are gone (Night 1 & Night 2 ONLY; Night 3 goes straight to Duck's car)
    const storeClearOfCustomers =
      this.nightState.night !== 3 &&
      !this.activeCustomerPerson &&
      !this.activeCustomerCar &&
      !this.activeDriveThruCar &&
      !this.eatingFriendsGroup &&
      this.orderPhase === 'none' &&
      !this.dialogueState.active &&
      !this.foodOutOfStock &&
      !this.mustDiscardFood &&
      !this.n2BathroomCheckPending &&
      !this.powerOutageActive &&
      !this.pendingPowerOutageDialogue &&
      !this.pendingOutOfFoodDialogue &&
      !this.pendingBathroomKnockDialogue &&
      this.clownState !== 'watching' &&
      this.clownState !== 'running_away' &&
      !(this.nightState.night === 1 && !this.powerOutageTriggered) &&
      !(this.nightState.night === 2 && !this.n2BathroomKnockTriggered);

    if (
      this.nightState.night !== 3 &&
      (this.store67Stage === 'waiting_departures' ||
        (this.store67Stage === 'none' && newHour >= 6)) &&
      storeClearOfCustomers
    ) {
      const t = getTranslations(this.settings.language).engine;
      this.store67Stage = 'hunger_dialogue';
      this.callbacks.onObjectiveCompletedNotice(t.notices.duckHungry);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      this.notifyActiveObjective();
      this.startDialogue(t.duckHungerDialogue, true, 'hunger_monologue');
    }

    // Night 3 Finale: Clown stands inside watching Duck, chases out the door for 2s with chase music as Duck runs to his car, disappears when out of sight, then charges the car window to head-bang & gush blood!
    if (this.nightState.night === 3 && this.night3ClownWatchingFromShop && this.clownActor) {
      const timeSec = performance.now() / 1000;
      this.updateNight3BloodDroplets(dt);

      // Once inside the car, updateNight3CarSequence owns Clown animation & camera exclusively
      if (this.night3CarPhase !== 'none') {
        this.updateNight3CarSequence(dt, timeSec);
        return;
      }

      if (!this.night3ClownDisappearedFromShop) {
        this.clownActor.group.visible = true;

        // As Duck exits toward the front door, Clown ALWAYS sprints after him with chase music (never kills/jumpscares before car)
        if (!this.night3ClownChaseStarted && !this.dialogueState.active && this.playerPos.z >= 4.8) {
          this.night3ClownChaseStarted = true;
          this.night3ClownChaseTimer = 2.6;
          this.nightMusicInsideActive = false;
          soundEngine.stopClownLaughs();
          soundEngine.stopNightMusic();
          soundEngine.playChaseMusic();
        }

        if (this.night3ClownChaseStarted && this.night3ClownChaseTimer > 0) {
          this.night3ClownChaseTimer = Math.max(0, this.night3ClownChaseTimer - dt);
          const cx = this.clownActor.group.position.x;
          const cz = this.clownActor.group.position.z;
          const dx = this.playerPos.x - cx;
          const dz = this.playerPos.z - cz;
          const dist = Math.hypot(dx, dz);
          const lookYaw = Math.atan2(dx, dz);
          this.clownActor.group.rotation.y = this.dampAngle(this.clownActor.group.rotation.y, lookYaw, 10, dt);

          const chaseSpeed = 3.25;
          if (dist > 2.35) {
            this.clownActor.group.position.x = cx + (dx / dist) * chaseSpeed * dt;
            this.clownActor.group.position.z = cz + (dz / dist) * chaseSpeed * dt;
            this.clownActor.updateAnimation(timeSec, chaseSpeed, true);
          } else {
            this.clownActor.updateAnimation(timeSec, 0, false);
          }
          this.night3ClownOutOfSightTimer = 0;
        } else {
          const cx = this.clownActor.group.position.x;
          const cz = this.clownActor.group.position.z;
          const lookYaw = Math.atan2(this.playerPos.x - cx, this.playerPos.z - cz);
          this.clownActor.group.rotation.y = this.dampAngle(this.clownActor.group.rotation.y, lookYaw, 6, dt);
          this.clownActor.updateAnimation(timeSec, 0, false);

          // After the chase finishes, clown disappears once out of Duck's sight
          if (this.night3ClownChaseStarted && !this.dialogueState.active && !this.isLookingAtClown(26, 0.16)) {
            this.night3ClownOutOfSightTimer += dt;
            if (this.night3ClownOutOfSightTimer >= 0.18) {
              this.night3ClownDisappearedFromShop = true;
              this.clownActor.group.visible = false;
              soundEngine.stopClownLaughs();
            }
          } else {
            this.night3ClownOutOfSightTimer = 0;
            this.night3ClownLaughTimer -= dt;
            if (this.night3ClownLaughTimer <= 0) {
              this.night3ClownLaughTimer = 4.6;
              soundEngine.playEerieClownLaugh();
            }
          }
        }
      } else {
        this.clownActor.group.visible = false;
      }

      if (!this.closingShiftTargetScreen && this.night3CaughtScareTimer <= 0 && !this.dialogueState.active) {
        // Duck's car at (-11.0, 0, 13.0) with box [-12.0, -10.0, 11.0, 15.0]
        const carDx = Math.max(-12.0 - this.playerPos.x, 0, this.playerPos.x - -10.0);
        const carDz = Math.max(11.0 - this.playerPos.z, 0, this.playerPos.z - 15.0);
        if (Math.hypot(carDx, carDz) <= 0.95) {
          this.startNight3CarSequence();
          return;
        }
      }
    }

    // Automatic Night Completion once Duck holds Noodles + Red Energy Drink & walks up to any side of his car at 67-Eleven
    if (
      this.store67Stage === 'at_67_car' &&
      !this.closingShiftTargetScreen &&
      !this.dialogueState.active
    ) {
      const carDx = Math.max(2.6 - this.playerPos.x, 0, this.playerPos.x - 5.0);
      const carDz = Math.max(147.8 - this.playerPos.z, 0, this.playerPos.z - 152.6);
      if (Math.hypot(carDx, carDz) <= 0.75) {
        soundEngine.playCarDoorAndEngine();
        this.closingShiftTargetScreen =
          this.nightState.night === 1 ? 'night1_complete' : 'night2_complete';
        this.fadeAlpha = Math.max(this.fadeAlpha, 0.01);
        this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
        return;
      }
    }
    if (this.isPreparingFood && !this.powerOutageActive) {
      const t = getTranslations(this.settings.language).engine;
      this.prepCountdown = Math.max(0, this.prepCountdown - dt);
      this.prepAudioTimer += dt;
      this.flickerBuzzTimer += dt;

      if (this.cookingStep === 'frying') {
        // Animate 3D smoke puffs rising above the fryer machine
        const puffs = this.world?.fryerMachine?.userData?.smokePuffs as THREE.Mesh[] | undefined;
        if (puffs) {
          const nowT = performance.now() * 0.0022;
          puffs.forEach((puff, idx) => {
            puff.visible = true;
            const cycle = (nowT + idx * 0.37) % 1.0;
            puff.position.y = 1.18 + cycle * 0.68;
            puff.position.x = -0.14 + Math.sin(nowT * 2.1 + idx) * 0.08;
            puff.position.z = 0.1 + Math.cos(nowT * 1.8 + idx) * 0.06;
            const sc = 0.65 + cycle * 0.9;
            puff.scale.set(sc, sc * 0.85, sc);
            const mat = puff.material as THREE.MeshStandardMaterial;
            mat.opacity = Math.max(0.05, (1.0 - cycle) * 0.58);
          });
        }
        const fLight = this.world?.fryerMachine?.userData?.fryLight as THREE.PointLight | undefined;
        if (fLight) {
          fLight.intensity = 1.2 + Math.sin(performance.now() * 0.025) * 0.25;
        }
      } else if (this.cookingStep === 'microwaving') {
        // Spin Big Mac inside microwave & pulse warm interior light
        const burger = this.world?.kitchenMicrowave?.userData?.microwaveBurger as THREE.Object3D | undefined;
        if (burger) {
          burger.rotation.y += dt * 3.6;
        }
      } else if (this.cookingStep === 'brewing_coffee') {
        const puffs = this.world?.coffeeMachine?.userData?.steamPuffs as THREE.Mesh[] | undefined;
        if (puffs) {
          const nowT = performance.now() * 0.0026;
          puffs.forEach((puff, idx) => {
            puff.visible = true;
            const cycle = (nowT + idx * 0.28) % 1.0;
            puff.position.y = 0.22 + cycle * 0.36;
            puff.position.x = 0.16 + Math.sin(nowT * 2.4 + idx) * 0.03;
            puff.position.z = 0.2 + Math.cos(nowT * 2.0 + idx) * 0.03;
            const sc = 0.7 + cycle * 0.8;
            puff.scale.set(sc, sc, sc);
            const mat = puff.material as THREE.MeshStandardMaterial;
            mat.opacity = Math.max(0.05, (1.0 - cycle) * 0.5);
          });
        }
        const cLight = this.world?.coffeeMachine?.userData?.coffeeLight as THREE.PointLight | undefined;
        if (cLight) {
          cLight.intensity = 1.2 + Math.sin(performance.now() * 0.025) * 0.25;
        }
      } else if (this.cookingStep === 'pouring_soda') {
        const stream = this.world?.sodaDispenser?.userData?.sodaStream as THREE.Object3D | undefined;
        if (stream) {
          const pulse = 0.85 + Math.sin(performance.now() * 0.045) * 0.2;
          stream.scale.set(pulse, 1, pulse);
        }
        const sLight = this.world?.sodaDispenser?.userData?.sodaLight as THREE.PointLight | undefined;
        if (sLight) {
          sLight.intensity = 1.25 + Math.sin(performance.now() * 0.03) * 0.25;
        }
      }

      // Environmental horror flickering effect on kitchen light while food is being prepared!
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

        if (this.cookingStep === 'frying') {
          this.resetKitchenAppliancesVisuals();
          this.cookingStep = 'need_pickup_burger';
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.fryDone);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'microwaving') {
          this.resetKitchenAppliancesVisuals();
          if (this.activeCustomerOrder?.needsCoffee) {
            this.cookingStep = 'need_pickup_coffee_cup';
          } else if (this.activeCustomerOrder?.needsSoda) {
            this.cookingStep = 'need_pickup_soda_cup';
          } else {
            this.cookingStep = 'need_wrap';
          }
          soundEngine.playMicrowaveDing();
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.microwaveDone);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'brewing_coffee') {
          this.resetKitchenAppliancesVisuals();
          if (this.activeCustomerOrder?.needsSoda) {
            this.cookingStep = 'need_pickup_soda_cup';
          } else {
            this.cookingStep = 'need_wrap';
          }
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.coffeeDone);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
          this.notifyActiveObjective();
        } else if (this.cookingStep === 'pouring_soda') {
          this.resetKitchenAppliancesVisuals();
          this.cookingStep = 'need_wrap';
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.sodaDone);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
          this.notifyActiveObjective();
        } else {
          this.cookingStep = 'need_pickup_finished';
          this.orderPhase = 'ready_to_serve';
          this.stats.hasFoodInHand = false;
          if (this.kitchenFinishedDishMesh) this.kitchenFinishedDishMesh.visible = true;
          this.emitStatsIfChanged();
          soundEngine.playFoodPackaging();
          soundEngine.playObjectiveComplete();
          this.callbacks.onObjectiveCompletedNotice(t.notices.dishOnKitchenTable);
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4200);
          this.notifyActiveObjective();
        }
      }
    }

    // Animate outgoing employee John NPC, 3 AM Secretive Clown, & seated Friends Group
    this.updateJohnNPC(dt);
    this.updatePowerOutageClown(dt, performance.now() / 1000);
    this.updateEatingFriendsGroup(dt, performance.now() / 1000);

    // Positional / area-faded cricket ambience behind the restaurant (silent at 67-Eleven)
    let cricketVol = 0.0;
    if (this.playerPos.z >= 100) {
      cricketVol = 0.0;
    } else if (this.playerPos.z < -6.0) {
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
   * - Tile: lobby, cashier counter, kitchen, rear hallway, 67-Eleven interior
   * - Carpet: dining booth seating areas, security office
   * - Asphalt: outdoor parking lot, sidewalk, rear dumpster pad, 67-Eleven lot
   * - Grass: surrounding forest edges
   */
  private getSurfaceAtPosition(x: number, z: number): 'tile' | 'carpet' | 'asphalt' | 'grass' {
    // 67-Eleven Convenience Store Zone (Z >= 100)
    if (z >= 100) {
      if (x >= -6.0 && x <= 6.0 && z >= 134.0 && z <= 144.0) {
        return 'tile';
      }
      return 'asphalt';
    }
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

  private getRestaurantZone(
    x: number,
    z: number
  ): 'office' | 'booths' | 'warehouse' | 'restroom' | 'kitchen' | 'lobby' | 'outdoor' {
    // 67-Eleven exterior / separate store or outside McDonald's building bounds
    if (z >= 100 || x < -12.0 || x > 8.0 || z < -6.0 || z > 6.0) {
      return 'outdoor';
    }
    if (x >= -6.8 && x <= -3.0 && z >= -2.8 && z <= -0.5) {
      return 'office';
    }
    if ((x <= -3.8 && x >= -6.8 && z >= 0.8 && z <= 5.4) || (x >= 3.8 && x <= 6.8 && z >= 0.8 && z <= 5.4)) {
      return 'booths';
    }
    if (x <= -8.0 && z >= 0.0) {
      return 'restroom';
    }
    if (x <= -6.8 && z < 0.0) {
      return 'warehouse';
    }
    if (x >= -3.0 && z <= 0.4) {
      return 'kitchen';
    }
    return 'lobby';
  }

  private dampAngle(current: number, target: number, lambda: number, dt: number): number {
    const diff = Math.atan2(Math.sin(target - current), Math.cos(target - current));
    return current + diff * (1 - Math.exp(-lambda * dt));
  }

  private getDialogueNpcFaceTarget(): { x: number; y: number; z: number } | null {
    if (!this.dialogueState.active || this.dialogueState.isMonologue) return null;
    if (this.dialogueState.npcId === 'store_67_cashier') {
      return { x: -3.55, y: 1.62, z: 139.2 };
    }
    if (this.dialogueState.npcId === 'employee_john' && this.johnState !== 'gone') {
      return { x: this.johnPos[0], y: 1.62, z: this.johnPos[2] };
    }
    if (this.dialogueState.npcId === 'drive_thru_customer' && this.activeDriveThruCar) {
      return { x: 9.51, y: 1.30, z: -0.13 };
    }
    if (this.activeCustomerPerson && this.dialogueState.npcId === this.activeCustomerPerson.id) {
      return {
        x: this.activeCustomerPerson.currentPos[0],
        y: this.activeCustomerPerson.behaviorType === 'clown_customer' ? 2.15 : 1.62,
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

    const isNight3Chase = this.nightState.night === 3 && this.night3ClownChaseStarted;
    const wantsSprint =
      (this.nightState.night !== 3 || isNight3Chase) &&
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
    const isChasePanicRun = isNight3Chase && !this.stats.isCrouched;
    if (isMoving) {
      this._tmpMoveDir.normalize();
      const speed = this.stats.isCrouched
        ? 1.6
        : isNight3Chase
        ? this.stats.isSprinting
          ? 4.35
          : 3.95
        : this.stats.isSprinting
        ? 5.2
        : 2.8;
      this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, this._tmpMoveDir.x * speed, 14, dt);
      this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, this._tmpMoveDir.z * speed, 14, dt);

      this.footstepTimer += dt;
      const stepInterval = this.stats.isSprinting
        ? 0.28
        : isChasePanicRun
        ? 0.33
        : this.stats.isCrouched
        ? 0.58
        : 0.42;
      if (this.footstepTimer > stepInterval) {
        this.footstepTimer = 0;
        this.isLeftFoot = !this.isLeftFoot;
        const pan = this.isLeftFoot ? -0.28 : 0.28;
        const surface = this.getSurfaceAtPosition(this.playerPos.x, this.playerPos.z);
        const zone = this.getRestaurantZone(this.playerPos.x, this.playerPos.z);
        soundEngine.playFootstep(
          surface,
          this.stats.isSprinting || isChasePanicRun,
          this.stats.isCrouched,
          pan,
          zone,
          speed
        );
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
      const bobCycle = performance.now() * 0.012 * (this.stats.isSprinting ? 1.4 : isChasePanicRun ? 1.25 : 1.0);
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

    // Visible Held Meal Viewmodel (Finished Dish Tray)
    if (this.heldMealMesh) {
      this.heldMealMesh.visible =
        !!this.stats.hasFoodInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasRawFryItemsInHand &&
        !this.stats.hasBigMacInHand &&
        !this.stats.hasCoffeeCupInHand &&
        !this.stats.hasSodaCupInHand;
      if (this.heldMealMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.025 : 0.015) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldMealMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldMealMesh.position.x = 0.24 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Raw Chicken & Potatoes Viewmodel (Before Fryer)
    if (this.heldRawFryMesh) {
      this.heldRawFryMesh.visible =
        !!this.stats.hasRawFryItemsInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasFoodInHand;
      if (this.heldRawFryMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.024 : 0.014) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldRawFryMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldRawFryMesh.position.x = 0.23 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Big Mac Viewmodel (Before Microwave)
    if (this.heldBigMacMesh) {
      this.heldBigMacMesh.visible =
        !!this.stats.hasBigMacInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasFoodInHand;
      if (this.heldBigMacMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.024 : 0.014) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldBigMacMesh.position.y = -0.21 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldBigMacMesh.position.x = 0.22 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Coffee Cup Viewmodel (Before Coffee Machine)
    if (this.heldCoffeeCupMesh) {
      this.heldCoffeeCupMesh.visible =
        !!this.stats.hasCoffeeCupInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasFoodInHand;
      if (this.heldCoffeeCupMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.024 : 0.014) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldCoffeeCupMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldCoffeeCupMesh.position.x = 0.22 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Soft Drink Cup Viewmodel (Before Soda Dispenser)
    if (this.heldSodaCupMesh) {
      this.heldSodaCupMesh.visible =
        !!this.stats.hasSodaCupInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasFoodInHand;
      if (this.heldSodaCupMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.024 : 0.014) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldSodaCupMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldSodaCupMesh.position.x = 0.22 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Chicken Tray Viewmodel (Raw chilled chicken tray from Walk-In Freezer)
    if (this.heldChickenTrayMesh) {
      this.heldChickenTrayMesh.visible = !!this.stats.hasChickenTrayInHand;
      if (this.heldChickenTrayMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.024 : 0.014) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldChickenTrayMesh.position.y = -0.22 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldChickenTrayMesh.position.x = 0.24 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
      }
    }

    // Visible Held Mop Viewmodel + Mopping Sweep Animation
    if (this.mopSwingTimer > 0) {
      this.mopSwingTimer = Math.max(0, this.mopSwingTimer - dt);
    }
    if (this.heldMopMesh) {
      this.heldMopMesh.visible =
        !!this.stats.hasMopInHand &&
        !this.stats.hasFoodInHand &&
        !this.stats.hasRawFryItemsInHand &&
        !this.stats.hasBigMacInHand &&
        !this.stats.hasCoffeeCupInHand &&
        !this.stats.hasSodaCupInHand &&
        !this.stats.hasChickenTrayInHand &&
        !this.stats.hasNoodlesAndDrinkInHand;
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

    // Visible Held Noodles & Red Energy Drink Viewmodel (from 67-Eleven purchase)
    if (this.heldNoodlesDrinkMesh) {
      this.heldNoodlesDrinkMesh.visible = !!this.stats.hasNoodlesAndDrinkInHand;
      if (this.heldNoodlesDrinkMesh.visible) {
        const bobAmount = isMoving ? (this.stats.isSprinting ? 0.022 : 0.013) : 0.003;
        const bobSpeed = isMoving ? 14 : 2;
        this.heldNoodlesDrinkMesh.position.y = -0.21 + Math.sin(nowTime * bobSpeed) * bobAmount;
        this.heldNoodlesDrinkMesh.position.x = 0.23 + Math.cos(nowTime * bobSpeed * 0.5) * (bobAmount * 0.5);
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

  private isLookingAtClown(maxDist: number = 24, minDot: number = 0.72): boolean {
    if (!this.clownActor || !this.clownActor.group.visible) return false;
    this.camera.getWorldDirection(this._tmpCamDir);
    const cp = this.clownActor.group.position;
    this._tmpClownEye.set(cp.x, 1.55, cp.z);
    this._tmpToClown.subVectors(this._tmpClownEye, this.camera.position);
    const dist = this._tmpToClown.length();
    if (dist <= 0.01 || dist >= maxDist) return false;
    this._tmpToClown.divideScalar(dist);
    const dot = this._tmpCamDir.dot(this._tmpToClown);
    if (dot <= minDot) return false;
    this._clownRaycaster.set(this.camera.position, this._tmpToClown);
    this._clownRaycaster.far = dist;
    const wallHits = this._clownRaycaster.intersectObjects(this.world.wallMeshes, false);
    const blockedByWall = wallHits.length > 0 && wallHits[0].distance < dist - 0.35;
    return !blockedByWall;
  }

  private updatePowerOutageClown(dt: number, timeSec: number) {
    if (!this.clownActor) return;

    // Night 2 last-guest door-peeking event (visual only — no jumpscare sound!)
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

      this.camera.getWorldDirection(this._tmpCamDir);
      this.clownActor.head.getWorldPosition(this._tmpClownEye);
      this._tmpToClown.subVectors(this._tmpClownEye, this.camera.position);
      const dist = this._tmpToClown.length();
      if (dist > 0.01) {
        this._tmpToClown.divideScalar(dist);
        const dot = this._tmpCamDir.dot(this._tmpToClown);
        if (dot > 0.54 && dist < 28) {
          this._clownRaycaster.set(this.camera.position, this._tmpToClown);
          this._clownRaycaster.far = dist;
          const wallHits = this._clownRaycaster.intersectObjects(this.world.wallMeshes, false);
          const blockedByWall = wallHits.length > 0 && wallHits[0].distance < dist - 0.35;

          if (!blockedByWall) {
            // Night 1 event ONLY: play Night 1 jumpscare sound immediately when looking at the clown!
            if (!this.clownJumpscarePlayedThisNight && this.nightState.night === 1) {
              this.clownJumpscarePlayedThisNight = true;
              soundEngine.playNight1ClownJumpscare();
            }

            if (!this.dialogueState.active) {
              if (this.clownSightGraceTimer > 0) {
                this.clownSightGraceTimer = Math.max(0, this.clownSightGraceTimer - dt);
              } else if (dot > 0.78 && dist < 22) {
                this.clownSpotLookTimer += dt;
                if (this.clownSpotLookTimer >= 0.30) {
                  // Clown sees Duck directly looking -> panic flee into the dark woods!
                  this.clownState = 'running_away';
                  this.clownSpottedByDuck = true;
                  this.clownActor.setPeekPose?.(false, timeSec);
                }
              }
            }
          } else {
            this.clownSpotLookTimer = 0;
          }
        } else {
          this.clownSpotLookTimer = Math.max(0, this.clownSpotLookTimer - dt * 0.5);
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

    let distClownChase = Infinity;
    if (this.night3ClownWatchingFromShop && this.night3ClownChaseStarted && this.night3ClownChaseTimer > 0 && this.clownActor) {
      distClownChase = this.clownActor.group.position.distanceTo(doorPos);
    }

    const isNearDoor =
      distPlayer < 2.8 ||
      distCustomer < 2.8 ||
      distJohn < 2.8 ||
      distFriends < 2.8 ||
      distClownChase < 2.8;
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

    // Do NOT allow customers to spawn or enter McDonald's during Night 2 3:33 AM bathroom check or Night 1 power outage
    const eventBlockingCustomers =
      this.n2BathroomCheckPending ||
      this.pendingBathroomKnockDialogue ||
      this.dialogueState.npcId === 'bathroom_knock' ||
      this.powerOutageActive;

    // 2. Strict Sequential Guest Arrival Spawner: 2 Regular, 1 Drive-Thru, 1 Regular, 1 Drive-Thru, ... (Night 3 ends with Clown)
    const activeQueue =
      this.nightState.night === 1
        ? this.night1ArrivalQueue
        : this.nightState.night === 2
        ? this.night2ArrivalQueue
        : this.night3ArrivalQueue;

    if (
      !eventBlockingCustomers &&
      !this.activeCustomerCar &&
      !this.activeCustomerPerson &&
      !this.activeDriveThruCar &&
      this.nightState.timeHour < 6 &&
      this.nightArrivalIndex < activeQueue.length
    ) {
      const nextType = activeQueue[this.nightArrivalIndex];
      const waitingForNight3Restock =
        nextType === 'clown' &&
        (this.foodOutOfStock || this.pendingOutOfFoodDialogue || this.night3ClownSpawned);

      if (!waitingForNight3Restock) {
        this.customerSpawnTimer -= dt;
        if (this.customerSpawnTimer <= 0) {
          this.nightArrivalIndex += 1;
          if (nextType === 'drive_thru') {
            this.spawnDriveThruCar();
            this.customerSpawnTimer = 6.5;
          } else if (nextType === 'clown') {
            this.spawnNight3ClownCustomer();
            this.customerSpawnTimer = 6.5;
          } else {
            this.spawnCustomerCar();
            this.customerSpawnTimer =
              this.nightState.night === 2 ? 9 + Math.random() * 4 : 10 + Math.random() * 4;
          }
        }
      }
    }

    // 2C. Animate active Drive-Thru vehicle & seated driver head along dedicated asphalt lane & turnaround pad
    if (this.activeDriveThruCar) {
      const dtCar = this.activeDriveThruCar;
      const driverHead = dtCar.meshGroup.userData.driverHead as THREE.Object3D | undefined;
      if (driverHead) {
        const targetHeadYaw = dtCar.state === 'waiting_window' ? 1.15 : 0;
        driverHead.rotation.y = this.dampAngle(driverHead.rotation.y, targetHeadYaw, 7, dt);
      }

      if (dtCar.state === 'entering' && !eventBlockingCustomers) {
        dtCar.progress += dt * 0.45;
        const p = dtCar.progress;
        if (p < 1) {
          const x = THREE.MathUtils.lerp(26, 10.2, p);
          const z = THREE.MathUtils.lerp(22.5, 18.2, p);
          dtCar.meshGroup.position.set(x, 0, z);
          dtCar.meshGroup.rotation.y = -Math.PI / 2;
        } else if (p < 2) {
          const tPhase = p - 1;
          const x = THREE.MathUtils.lerp(10.2, 9.85, tPhase);
          const z = THREE.MathUtils.lerp(18.2, 11.0, tPhase);
          dtCar.meshGroup.position.set(x, 0, z);
          dtCar.meshGroup.rotation.y = THREE.MathUtils.lerp(-Math.PI / 2, -Math.PI, tPhase);
        } else {
          const tPhase = Math.min(1, p - 2);
          const z = THREE.MathUtils.lerp(11.0, -0.15, tPhase);
          dtCar.meshGroup.position.set(9.85, 0, z);
          dtCar.meshGroup.rotation.y = Math.PI;
          if (p >= 3.0) {
            dtCar.state = 'waiting_window';
            dtCar.progress = 0;
            soundEngine.playDriveThruChime();
            const engT = getTranslations(this.settings.language).engine;
            this.callbacks.onObjectiveCompletedNotice(engT.notices.driveThruArrived);
            window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
          }
        }
      } else if (dtCar.state === 'waiting_window') {
        dtCar.meshGroup.position.set(9.85, 0, -0.15);
        dtCar.meshGroup.rotation.y = Math.PI;
      } else if (dtCar.state === 'leaving') {
        dtCar.progress += dt * 0.48;
        const p = dtCar.progress;
        if (p < 1) {
          const x = THREE.MathUtils.lerp(9.85, 10.4, p);
          const z = THREE.MathUtils.lerp(-0.15, -11.8, p);
          dtCar.meshGroup.position.set(x, 0, z);
          dtCar.meshGroup.rotation.y = Math.PI;
        } else if (p < 2) {
          const tPhase = p - 1;
          const x = THREE.MathUtils.lerp(10.4, 13.0, tPhase);
          const z = -11.8 - Math.sin(tPhase * Math.PI) * 1.1;
          dtCar.meshGroup.position.set(x, 0, z);
          dtCar.meshGroup.rotation.y = THREE.MathUtils.lerp(Math.PI, 0, tPhase);
        } else {
          const tPhase = Math.min(1, p - 2);
          const x = THREE.MathUtils.lerp(13.0, 13.2, tPhase);
          const z = THREE.MathUtils.lerp(-11.8, 24.5, tPhase);
          dtCar.meshGroup.position.set(x, 0, z);
          dtCar.meshGroup.rotation.y = 0;
          if (p >= 3.0) {
            this.scene.remove(dtCar.meshGroup);
            this.activeDriveThruCar = null;
            if (this.dtServedDishMesh) {
              this.dtServedDishMesh.visible = false;
            }
          }
        }
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

        if (car.progress >= 1.0 && !eventBlockingCustomers) {
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

        // If 3:33 AM bathroom event (or outage) arrives while customer is still outside, prevent them from entering!
        if (eventBlockingCustomers && person.currentPos[2] > 6.2) {
          if (limbs) {
            limbs.legL.rotation.x = THREE.MathUtils.damp(limbs.legL.rotation.x, 0, 10, dt);
            limbs.legR.rotation.x = THREE.MathUtils.damp(limbs.legR.rotation.x, 0, 10, dt);
            limbs.armL.rotation.x = THREE.MathUtils.damp(limbs.armL.rotation.x, 0, 10, dt);
            limbs.armR.rotation.x = THREE.MathUtils.damp(limbs.armR.rotation.x, 0, 10, dt);
            person.meshGroup.position.y = THREE.MathUtils.damp(person.meshGroup.position.y, 0, 10, dt);
          }
        } else {
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
          if (this.servedCounterDishMesh) {
            this.servedCounterDishMesh.visible = false;
          }
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
    if (this.nightState.night === 1) {
      this.night1RegularSpawned += 1;
    } else if (this.nightState.night === 2) {
      this.night2GuestsCount += 1;
    } else {
      this.night3RegularSpawned += 1;
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

  private spawnDriveThruCar() {
    const dtColors = [0x1e40af, 0x7c2d12, 0xeab308, 0x374151];
    const customerIdx = this.driveThruSpawnedThisNight;
    const chosenColor = dtColors[customerIdx % dtColors.length];
    this.driveThruSpawnedThisNight += 1;

    const carMesh = createDetailedCar(chosenColor, true, customerIdx % 3);
    carMesh.position.set(26, 0, 22.5);
    carMesh.rotation.y = -Math.PI / 2;
    this.scene.add(carMesh);

    this.activeDriveThruCar = {
      id: `dt_car_${Date.now()}`,
      meshGroup: carMesh,
      state: 'entering',
      progress: 0,
      customerIndex: customerIdx,
    };
  }

  private spawnCustomerFromCar(carX: number, carZ: number) {
    const t = getTranslations(this.settings.language).engine;
    const isNight2 = this.nightState.night === 2;
    const isNight3 = this.nightState.night === 3;
    const custList = isNight3 ? t.customersNight3 : isNight2 ? t.customersNight2 : t.customers;

    let archetypeIndex: number;
    if (isNight2) {
      const qIdx = Math.max(0, this.night2GuestsCount - 1) % this.night2QueueIndices.length;
      archetypeIndex = this.night2QueueIndices[qIdx];
    } else if (isNight3) {
      const qIdx = Math.max(0, this.night3RegularSpawned - 1) % this.night3QueueIndices.length;
      archetypeIndex = this.night3QueueIndices[qIdx];
    } else {
      const qIdx = Math.max(0, this.night1RegularSpawned - 1) % this.night1QueueIndices.length;
      archetypeIndex = this.night1QueueIndices[qIdx];
    }

    let modelArchetypeIndex = archetypeIndex;
    if (isNight2 && archetypeIndex === 2) {
      modelArchetypeIndex = 202; // Deputy Sheriff Vance distinct model (not Old Man Silas)
    } else if (isNight3) {
      const night3ModelMap: Record<number, number> = {
        0: 9,   // Detective Hall
        1: 10,  // Reporter Zoe
        2: 202, // Deputy Sheriff Vance
        3: 3,   // Big Ray
        4: 7,   // Baby Leopards
      };
      modelArchetypeIndex = night3ModelMap[archetypeIndex] ?? 9;
    }

    const archetype = custList[archetypeIndex % custList.length];
    const personMesh = createCustomerCharacter(0x334455, modelArchetypeIndex);
    personMesh.position.set(carX, 0, carZ);
    this.scene.add(personMesh);

    const isFriendsGroup =
      (!isNight3 && archetypeIndex === 7) || (isNight3 && archetypeIndex === 4);
    const isGrumpyMan = !isNight3 && archetypeIndex === 8;
    const behaviorType = isFriendsGroup
      ? 'friends_group'
      : isGrumpyMan
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

  private spawnNight3ClownCustomer() {
    const t = getTranslations(this.settings.language).engine;
    this.night3ClownSpawned = true;

    const jester = createSmilingJester();
    jester.group.userData.limbs = {
      head: jester.head,
      armL: jester.leftArm,
      armR: jester.rightArm,
      legL: jester.leftLeg,
      legR: jester.rightLeg,
    };
    jester.group.position.set(0, 0, 14.5);
    jester.group.rotation.y = Math.PI;
    this.scene.add(jester.group);

    this.frontChimePlayedForCurrentCustomer = false;
    this.activeCustomerPerson = {
      id: `clown_customer_${Date.now()}`,
      meshGroup: jester.group,
      targetPos: [0, 0, 5.0],
      currentPos: [0, 0, 14.5],
      state: 'walking_to_door',
      walkProgress: 0,
      hasTriggeredChime: false,
      speed: 1.65,
      archetypeIndex: -1,
      archetypeName: t.clownCustomerName,
      archetypeTitle: t.clownCustomerTitle,
      behaviorType: 'clown_customer',
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

    // 0. 67-Eleven Convenience Store Ending Sequence Prompts
    if (this.store67Stage === 'at_67_noodle_stall') {
      const stallItem = this.world.interactiveItems.find((it) => it.id === 'store_67_noodle_stall');
      if (stallItem) {
        this._tmpItemPos.set(stallItem.position[0], stallItem.position[1], stallItem.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= stallItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.22) {
          this.activeItemNearby = stallItem;
          this.callbacks.onInteractionPrompt(t.prompts.takeNoodlesAndDrink);
          return;
        }
      }
      this.activeItemNearby = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    if (this.store67Stage === 'at_67_cashier') {
      const cashierItem = this.world.interactiveItems.find((it) => it.id === 'store_67_cashier');
      if (cashierItem) {
        this._tmpItemPos.set(cashierItem.position[0], cashierItem.position[1], cashierItem.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= cashierItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.22) {
          this.activeItemNearby = cashierItem;
          this.callbacks.onInteractionPrompt(t.prompts.talkCashier67);
          return;
        }
      }
      this.activeItemNearby = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    if (this.store67Stage === 'at_67_car') {
      const carItem = this.world.interactiveItems.find((it) => it.id === 'store_67_car');
      if (carItem) {
        this._tmpItemPos.set(carItem.position[0], carItem.position[1], carItem.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= carItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.2) {
          this.activeItemNearby = carItem;
          this.callbacks.onInteractionPrompt(t.prompts.enterDuckCar);
          return;
        }
      }
      this.activeItemNearby = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    // 0B. Night 3 Duck's Car Outside McDonald's while Clown watches & laughs from storefront
    if (this.nightState.night === 3 && this.night3ClownWatchingFromShop) {
      const mcdCarItem = this.world.interactiveItems.find((it) => it.id === 'mcd_duck_car');
      if (mcdCarItem) {
        this._tmpItemPos.set(mcdCarItem.position[0], mcdCarItem.position[1], mcdCarItem.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= mcdCarItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.15) {
          this.activeItemNearby = mcdCarItem;
          this.callbacks.onInteractionPrompt(t.prompts.enterMcdDuckCar);
          return;
        }
      }
    }

    // 1. Check Customer NPC conversation / food order delivery (disabled while customer is leaving)
    if (this.activeCustomerPerson && this.activeCustomerPerson.state !== 'leaving') {
      const p = this.activeCustomerPerson;
      if (p.state === 'inside_counter' || p.state === 'seated' || p.currentPos[2] < 5.8) {
        this._tmpItemPos.set(p.currentPos[0], p.behaviorType === 'clown_customer' ? 1.85 : 1.35, p.currentPos[2]);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position);
        const distToCustomer = this._tmpToItem.length();
        this._tmpToItem.normalize();
        const dot = this._tmpCamDir.dot(this._tmpToItem);

        const custList =
          this.nightState.night === 3
            ? t.customersNight3
            : this.nightState.night === 2
            ? t.customersNight2
            : t.customers;
        const custArch =
          p.behaviorType === 'clown_customer'
            ? null
            : custList[(p.archetypeIndex ?? 0) % custList.length];
        const customerName =
          p.behaviorType === 'clown_customer'
            ? t.clownCustomerName
            : custArch?.name || p.archetypeName;

        if (distToCustomer <= 3.3 && dot > 0.3) {
          this.nearbyCustomer = p;
          this.activeItemNearby = null;
          if (
            this.orderPhase === 'ready_to_serve' &&
            this.stats.hasFoodInHand &&
            this.activeCustomerOrder?.orderSource !== 'drive_thru' &&
            !this.mustDiscardFood
          ) {
            this.callbacks.onInteractionPrompt(t.prompts.placeDishOnTable);
          } else if (
            (this.orderPhase === 'preparing' ||
              (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
            this.activeCustomerOrder?.orderSource !== 'drive_thru'
          ) {
            this.callbacks.onInteractionPrompt(t.prompts.talkAwaiting(customerName));
          } else {
            this.callbacks.onInteractionPrompt(t.prompts.takeOrder(customerName));
          }
          return;
        }
      }
    }
    this.nearbyCustomer = null;

    // 1A-2. Place Finished Dish on Counter Serving Table Priority Check
    if (
      this.orderPhase === 'ready_to_serve' &&
      this.stats.hasFoodInHand &&
      !this.mustDiscardFood &&
      !this.powerOutageActive &&
      this.activeCustomerOrder?.orderSource !== 'drive_thru' &&
      this.activeCustomerPerson &&
      this.activeCustomerPerson.state !== 'leaving'
    ) {
      const serveSpot = this.world.interactiveItems.find((it) => it.id === 'serve_table_spot');
      if (serveSpot) {
        this._tmpItemPos.set(serveSpot.position[0], serveSpot.position[1], serveSpot.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= serveSpot.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.25) {
          this.activeItemNearby = serveSpot;
          this.callbacks.onInteractionPrompt(t.prompts.placeDishOnTable);
          return;
        }
      }
    }

    // 1B. Drive-Thru Window Customer Priority Check (when car is waiting outside transparent window)
    if (
      this.isCustomerArrivalUnlocked() &&
      this.activeDriveThruCar?.state === 'waiting_window' &&
      !this.powerOutageActive
    ) {
      const dtWindow = this.world.interactiveItems.find((it) => it.id === 'drive_thru_window');
      if (dtWindow) {
        this._tmpItemPos.set(dtWindow.position[0], dtWindow.position[1], dtWindow.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= dtWindow.radius + 0.25 && this._tmpCamDir.dot(this._tmpToItem) > 0.28) {
          this.activeItemNearby = dtWindow;
          const dtCust =
            t.driveThruCustomers[this.activeDriveThruCar.customerIndex % t.driveThruCustomers.length];
          if (
            this.orderPhase === 'ready_to_serve' &&
            this.stats.hasFoodInHand &&
            this.activeCustomerOrder?.orderSource === 'drive_thru' &&
            !this.mustDiscardFood
          ) {
            this.callbacks.onInteractionPrompt(t.prompts.driveThruDeliverMeal(dtCust.name));
          } else if (
            (this.orderPhase === 'preparing' ||
              (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
            this.activeCustomerOrder?.orderSource === 'drive_thru'
          ) {
            this.callbacks.onInteractionPrompt(t.prompts.talkAwaiting(dtCust.name));
          } else {
            this.callbacks.onInteractionPrompt(t.prompts.driveThruTakeOrder(dtCust.name));
          }
          return;
        }
      }
    }

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

    // Walk-In Freezer Chicken Tray Pickup Priority Check (after 3 guests when kitchen stock runs out)
    if (this.foodOutOfStock && !this.stats.hasChickenTrayInHand && !this.powerOutageActive) {
      const freezerTray = this.world.interactiveItems.find((it) => it.id === 'freezer_chicken_tray');
      if (freezerTray) {
        this._tmpItemPos.set(freezerTray.position[0], freezerTray.position[1], freezerTray.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= freezerTray.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.3) {
          this.activeItemNearby = freezerTray;
          this.callbacks.onInteractionPrompt(t.prompts.pickUpChickenTray);
          return;
        }
      }
    }

    // Kitchen Chicken Tray Restock OR 6-Step Food Preparation (Hold Raw -> Fryer -> Hold Big Mac -> Microwave -> Wrap -> Pick Up Finished Dish)
    if (
      (this.stats.hasChickenTrayInHand ||
        this.orderPhase === 'preparing' ||
        (this.orderPhase === 'ready_to_serve' && this.cookingStep === 'need_pickup_finished')) &&
      !this.mustDiscardFood &&
      !this.powerOutageActive
    ) {
      if (!this.stats.hasChickenTrayInHand && !this.foodOutOfStock) {
        if (this.cookingStep === 'need_fryer' || this.cookingStep === 'frying') {
          const fryerItem = this.world.interactiveItems.find((it) => it.id === 'fryer_machine');
          if (fryerItem) {
            this._tmpItemPos.set(fryerItem.position[0], fryerItem.position[1], fryerItem.position[2]);
            const d = this.playerPos.distanceTo(this._tmpItemPos);
            this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
            if (d <= fryerItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.25) {
              this.activeItemNearby = fryerItem;
              if (this.cookingStep === 'frying') {
                const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
                this.callbacks.onInteractionPrompt(t.prompts.fryingNow(secLeft));
              } else {
                this.callbacks.onInteractionPrompt(t.prompts.useFryer);
              }
              return;
            }
          }
        }

        if (this.cookingStep === 'need_microwave' || this.cookingStep === 'microwaving') {
          const microItem = this.world.interactiveItems.find((it) => it.id === 'kitchen_microwave');
          if (microItem) {
            this._tmpItemPos.set(microItem.position[0], microItem.position[1], microItem.position[2]);
            const d = this.playerPos.distanceTo(this._tmpItemPos);
            this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
            if (d <= microItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.25) {
              this.activeItemNearby = microItem;
              if (this.cookingStep === 'microwaving') {
                const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
                this.callbacks.onInteractionPrompt(t.prompts.microwavingNow(secLeft));
              } else {
                this.callbacks.onInteractionPrompt(t.prompts.useMicrowave);
              }
              return;
            }
          }
        }

        if (this.cookingStep === 'need_coffee' || this.cookingStep === 'brewing_coffee') {
          const coffeeItem = this.world.interactiveItems.find((it) => it.id === 'coffee_machine');
          if (coffeeItem) {
            this._tmpItemPos.set(coffeeItem.position[0], coffeeItem.position[1], coffeeItem.position[2]);
            const d = this.playerPos.distanceTo(this._tmpItemPos);
            this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
            if (d <= coffeeItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.22) {
              this.activeItemNearby = coffeeItem;
              if (this.cookingStep === 'brewing_coffee') {
                const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
                this.callbacks.onInteractionPrompt(t.prompts.brewingCoffeeNow(secLeft));
              } else {
                this.callbacks.onInteractionPrompt(t.prompts.useCoffeeMachine);
              }
              return;
            }
          }
        }

        if (this.cookingStep === 'need_soda' || this.cookingStep === 'pouring_soda') {
          const sodaItem = this.world.interactiveItems.find((it) => it.id === 'soda_dispenser');
          if (sodaItem) {
            this._tmpItemPos.set(sodaItem.position[0], sodaItem.position[1], sodaItem.position[2]);
            const d = this.playerPos.distanceTo(this._tmpItemPos);
            this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
            if (d <= sodaItem.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.22) {
              this.activeItemNearby = sodaItem;
              if (this.cookingStep === 'pouring_soda') {
                const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
                this.callbacks.onInteractionPrompt(t.prompts.pouringSodaNow(secLeft));
              } else {
                this.callbacks.onInteractionPrompt(t.prompts.useSodaDispenser);
              }
              return;
            }
          }
        }
      }

      const prepStation = this.world.interactiveItems.find((it) => it.id === 'kitchen_prep_station');
      if (prepStation) {
        this._tmpItemPos.set(prepStation.position[0], prepStation.position[1], prepStation.position[2]);
        const d = this.playerPos.distanceTo(this._tmpItemPos);
        this._tmpToItem.subVectors(this._tmpItemPos, this.camera.position).normalize();
        if (d <= prepStation.radius && this._tmpCamDir.dot(this._tmpToItem) > 0.3) {
          this.activeItemNearby = prepStation;
          if (this.stats.hasChickenTrayInHand) {
            this.callbacks.onInteractionPrompt(t.prompts.restockChickenTray);
          } else if (this.cookingStep === 'need_pickup_fry') {
            this.callbacks.onInteractionPrompt(t.prompts.takeRawFry);
          } else if (this.cookingStep === 'need_pickup_burger') {
            this.callbacks.onInteractionPrompt(t.prompts.takeBigMac);
          } else if (this.cookingStep === 'need_pickup_coffee_cup') {
            this.callbacks.onInteractionPrompt(t.prompts.takeCoffeeCup);
          } else if (this.cookingStep === 'need_pickup_soda_cup') {
            this.callbacks.onInteractionPrompt(t.prompts.takeSodaCup);
          } else if (this.cookingStep === 'wrapping') {
            const secLeft = Math.max(1, Math.ceil(this.prepCountdown));
            this.callbacks.onInteractionPrompt(t.prompts.wrappingNow(secLeft));
          } else if (this.cookingStep === 'need_wrap') {
            this.callbacks.onInteractionPrompt(t.prompts.wrapFoodCounter);
          } else if (this.cookingStep === 'need_pickup_finished') {
            this.callbacks.onInteractionPrompt(t.prompts.takeFinishedDish);
          } else if (this.cookingStep === 'need_fryer' || this.cookingStep === 'frying') {
            this.callbacks.onInteractionPrompt(t.prompts.useFryer);
          } else if (this.cookingStep === 'need_microwave' || this.cookingStep === 'microwaving') {
            this.callbacks.onInteractionPrompt(t.prompts.useMicrowave);
          } else if (this.cookingStep === 'need_coffee' || this.cookingStep === 'brewing_coffee') {
            this.callbacks.onInteractionPrompt(t.prompts.useCoffeeMachine);
          } else if (this.cookingStep === 'need_soda' || this.cookingStep === 'pouring_soda') {
            this.callbacks.onInteractionPrompt(t.prompts.useSodaDispenser);
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
      // Front door exit does not bypass the post-shift 67-Eleven ending sequence
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour < 6 || this.store67Stage !== 'none') {
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
    soundEngine.stopNightMusic();
    soundEngine.stopChaseMusic();
    soundEngine.stopClownLaughs();
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('blur', this.handleWindowBlur);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.composer?.dispose();
    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }

  // --- PHONE INTERFACE & NIGHT 3 ROOMY CAR CLIMAX HELPERS ---

  public setPhoneOpen(isOpen: boolean) {
    this.phoneOpen = isOpen;
    if (isOpen) {
      this.keys = {};
      this.mobileSprint = false;
      this.exitPointerLock();
    } else if (
      this.currentScreen === 'playing' &&
      !this.isPaused &&
      this.night3CarPhase !== 'choice'
    ) {
      this.requestPointerLock();
    }
  }

  public capturePhoneSnapshot(): string | null {
    if (!this.renderer || !this.composer || !this.camera) return null;
    try {
      this.renderPass.camera = this.camera;
      this.composer.render();
      soundEngine.playCameraShutter();
      return this.renderer.domElement.toDataURL('image/jpeg', 0.85);
    } catch (e) {
      return null;
    }
  }

  public getNight3EmergencyProgress(): Night3EmergencyProgress {
    return {
      phase: this.night3CarPhase,
      calledPolice: this.night3CalledPolice,
      textedJohn: this.night3TextedJohn,
    };
  }

  private emitNight3CarProgress() {
    this.callbacks.onNight3CarPhaseChange?.(this.getNight3EmergencyProgress());
  }

  private resetKitchenAppliancesVisuals() {
    if (this.world?.fryerMachine) {
      const basket = this.world.fryerMachine.userData.fryBasket as THREE.Object3D | undefined;
      const puffs = this.world.fryerMachine.userData.smokePuffs as THREE.Mesh[] | undefined;
      const fLight = this.world.fryerMachine.userData.fryLight as THREE.PointLight | undefined;
      if (basket) basket.visible = false;
      if (fLight) fLight.intensity = 0;
      if (puffs) puffs.forEach((p) => (p.visible = false));
    }
    if (this.world?.kitchenMicrowave) {
      const mLight = this.world.kitchenMicrowave.userData.microwaveLight as THREE.PointLight | undefined;
      const mBurger = this.world.kitchenMicrowave.userData.microwaveBurger as THREE.Object3D | undefined;
      if (mLight) mLight.intensity = 0;
      if (mBurger) mBurger.visible = false;
    }
    if (this.world?.coffeeMachine) {
      const cup = this.world.coffeeMachine.userData.brewingCup as THREE.Object3D | undefined;
      const stream = this.world.coffeeMachine.userData.coffeeStream as THREE.Object3D | undefined;
      const puffs = this.world.coffeeMachine.userData.steamPuffs as THREE.Mesh[] | undefined;
      const cLight = this.world.coffeeMachine.userData.coffeeLight as THREE.PointLight | undefined;
      if (cup) cup.visible = false;
      if (stream) stream.visible = false;
      if (cLight) cLight.intensity = 0;
      if (puffs) puffs.forEach((p) => (p.visible = false));
    }
    if (this.world?.sodaDispenser) {
      const cup = this.world.sodaDispenser.userData.fillingCup as THREE.Object3D | undefined;
      const stream = this.world.sodaDispenser.userData.sodaStream as THREE.Object3D | undefined;
      const sLight = this.world.sodaDispenser.userData.sodaLight as THREE.PointLight | undefined;
      if (cup) cup.visible = false;
      if (stream) stream.visible = false;
      if (sLight) sLight.intensity = 0;
    }
  }

  private ensureNight3BloodDropletPool() {
    if (this.night3BloodDroplets.length > 0) return;
    if (!this.night3BloodDropletMat) {
      this.night3BloodDropletMat = new THREE.MeshStandardMaterial({
        color: 0x990609,
        emissive: 0x260000,
        roughness: 0.35,
        metalness: 0.05,
        flatShading: true,
      });
    }
    const geo = new THREE.BoxGeometry(0.036, 0.048, 0.036);
    for (let i = 0; i < 42; i++) {
      const mesh = new THREE.Mesh(geo, this.night3BloodDropletMat);
      mesh.visible = false;
      this.scene.add(mesh);
      this.night3BloodDroplets.push({
        mesh,
        vel: new THREE.Vector3(),
        life: 0,
        maxLife: 1.0,
        active: false,
      });
    }
  }

  private spawnNight3HeadBloodGush(count: number, sprayTowardCar: boolean) {
    if (!this.clownActor) return;
    this.ensureNight3BloodDropletPool();
    this.clownActor.group.updateMatrixWorld(true);
    this.clownActor.head.getWorldPosition(this._tmpHeadBloodPos);
    this._tmpHeadForward.set(0, 0, 1).applyQuaternion(this.clownActor.head.getWorldQuaternion(new THREE.Quaternion()));
    this._tmpHeadBloodPos.addScaledVector(this._tmpHeadForward, 0.14);
    this._tmpHeadBloodPos.y += 0.09;

    let spawned = 0;
    for (const drop of this.night3BloodDroplets) {
      if (drop.active) continue;
      drop.active = true;
      drop.life = 0;
      drop.maxLife = sprayTowardCar ? 1.15 + Math.random() * 0.55 : 0.8 + Math.random() * 0.4;
      drop.mesh.visible = true;
      drop.mesh.position.set(
        this._tmpHeadBloodPos.x + (Math.random() - 0.5) * 0.12,
        this._tmpHeadBloodPos.y + (Math.random() - 0.5) * 0.1,
        this._tmpHeadBloodPos.z + (Math.random() - 0.5) * 0.14
      );
      const sc = sprayTowardCar ? 0.75 + Math.random() * 0.85 : 0.55 + Math.random() * 0.45;
      drop.mesh.scale.set(sc, sc * 1.3, sc);
      drop.mesh.rotation.set(Math.random() * 3, Math.random() * 3, Math.random() * 3);

      if (sprayTowardCar) {
        drop.vel.set(
          -0.65 - Math.random() * 1.45,
          0.65 + Math.random() * 1.65,
          (Math.random() - 0.5) * 2.1
        );
      } else {
        drop.vel.set(
          (Math.random() - 0.5) * 0.5,
          -0.25 + Math.random() * 0.4,
          (Math.random() - 0.5) * 0.5
        );
      }
      spawned += 1;
      if (spawned >= count) break;
    }
  }

  private updateNight3BloodDroplets(dt: number) {
    if (this.night3HeadBloodTimer > 0 && this.clownActor?.group.visible) {
      this.night3HeadBloodTimer = Math.max(0, this.night3HeadBloodTimer - dt);
      this.night3HeadBloodDripAccum += dt;
      if (this.night3HeadBloodDripAccum >= 0.085) {
        this.night3HeadBloodDripAccum = 0;
        this.spawnNight3HeadBloodGush(2, false);
      }
    }

    for (const drop of this.night3BloodDroplets) {
      if (!drop.active) continue;
      drop.life += dt;
      if (drop.life >= drop.maxLife) {
        drop.active = false;
        drop.mesh.visible = false;
        continue;
      }
      drop.vel.y -= 7.8 * dt;
      drop.mesh.position.addScaledVector(drop.vel, dt);
      if (drop.mesh.position.y <= 0.025) {
        drop.mesh.position.y = 0.025;
        drop.vel.set(drop.vel.x * 0.35, 0, drop.vel.z * 0.35);
      }
    }
  }

  private startNight3CarSequence() {
    const t = getTranslations(this.settings.language).engine;
    this.night3CarPhase = 'entering_starting';
    this.night3CarPhaseTimer = 0;
    this.night3ClownAttackStruck = false;
    this.night3ClownAttackStrikeCount = 0;
    this.night3WindowLaughStarted = false;
    this.night3HeadBloodTimer = 0;
    this.night3HeadBloodDripAccum = 0;
    this.night3CarCrackShake = 0;
    this.night3CalledPolice = false;
    this.night3TextedJohn = false;
    this.night3ClownChaseStarted = false;
    this.night3ClownChaseTimer = 0;
    this.activeItemNearby = null;
    this.callbacks.onInteractionPrompt(null);

    if (this.heldMealMesh) this.heldMealMesh.visible = false;
    if (this.heldRawFryMesh) this.heldRawFryMesh.visible = false;
    if (this.heldBigMacMesh) this.heldBigMacMesh.visible = false;
    if (this.heldCoffeeCupMesh) this.heldCoffeeCupMesh.visible = false;
    if (this.heldSodaCupMesh) this.heldSodaCupMesh.visible = false;
    if (this.heldMopMesh) this.heldMopMesh.visible = false;
    if (this.heldChickenTrayMesh) this.heldChickenTrayMesh.visible = false;
    if (this.heldNoodlesDrinkMesh) this.heldNoodlesDrinkMesh.visible = false;

    if (this.clownActor) {
      this.clownActor.setPeekPose?.(false, 0);
      this.clownActor.setHeadBloodied?.(false);
      this.clownActor.head.rotation.set(0, 0, 0);
      this.clownActor.group.visible = false;
      this.clownActor.group.position.set(-6.2, 0, 15.4);
      this.clownActor.group.rotation.y = Math.atan2(-9.68 - -6.2, 13.24 - 15.4);
      this.clownActor.updateAnimation(0, 0, false);
    }

    if (this.world.duckCar?.userData?.driverWindowCrack) {
      this.world.duckCar.userData.driverWindowCrack.visible = false;
    }
    if (this.world.duckCar?.userData?.driverWindowBlood) {
      this.world.duckCar.userData.driverWindowBlood.visible = false;
    }
    if (this.world.duckCar?.userData?.doorAttackLight) {
      (this.world.duckCar.userData.doorAttackLight as THREE.PointLight).intensity = 0;
    }

    soundEngine.stopNightMusic();
    soundEngine.stopClownLaughs();
    soundEngine.fadeOutChaseMusic(2.2);
    soundEngine.playCarDoorClose();
    soundEngine.playCarOutOfGasCrank();

    // Seat Duck comfortably inside the roomy car interior driver seat facing windshield (+Z)
    this.playerPos.set(-10.66, 1.32, 12.92);
    this.playerVel.set(0, 0, 0);
    this.playerHeight = 1.32;
    this.targetHeight = 1.32;
    this.yaw = Math.PI;
    this.pitch = -0.05;

    this.callbacks.onObjectiveCompletedNotice(t.notices.night3CarNoGas);
    window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
    this.emitNight3CarProgress();
    this.startDialogue(t.night3CarNoGasDialogue, true, 'night3_car_no_gas');
  }

  private updateNight3CarSequence(dt: number, timeSec: number) {
    const t = getTranslations(this.settings.language).engine;
    this.night3CarPhaseTimer += dt;
    this.playerVel.set(0, 0, 0);
    this.updateNight3BloodDroplets(dt);

    // Keep Duck seated (or ducked low while hiding) inside the roomy car cabin
    const targetCarY =
      this.night3CarPhase === 'hiding_using_phone' || this.night3CarPhase === 'police_dispatched'
        ? 0.94
        : 1.32;
    this.playerHeight = THREE.MathUtils.damp(this.playerHeight, targetCarY, 10, dt);
    this.playerPos.set(-10.66, this.playerHeight, 12.92);

    if (this.night3CarCrackShake > 0) {
      this.night3CarCrackShake = Math.max(0, this.night3CarCrackShake - dt);
    }

    // Steer camera directly out driver front window (-10.25, 1.24, 13.24) while clown charges and slams head repeatedly (8x)
    if (this.night3CarPhase === 'clown_attacking' && !this.dialogueState.active) {
      const targetWindowYaw = Math.atan2(-0.41, -0.32); // -2.234 rad, looking straight out driver front glass
      this.yaw = this.dampAngle(this.yaw, targetWindowYaw, 7.5, dt);
      this.pitch = THREE.MathUtils.damp(this.pitch, -0.02, 7.5, dt);

      if (this.clownActor) {
        this.clownActor.group.visible = true;
        if (this.night3CarPhaseTimer < 0.85) {
          const p = this.night3CarPhaseTimer / 0.85;
          const cx = THREE.MathUtils.lerp(-6.2, -9.68, p);
          const cz = THREE.MathUtils.lerp(15.4, 13.24, p);
          this.clownActor.group.position.set(cx, 0, cz);
          this.clownActor.group.rotation.y = Math.atan2(-9.68 - -6.2, 13.24 - 15.4);
          this.clownActor.updateAnimation(timeSec, 6.5, true);
        } else {
          // Play the first horror-laugh track right as the clown starts banging his head against the window
          if (!this.night3WindowLaughStarted) {
            this.night3WindowLaughStarted = true;
            soundEngine.playHideousClownLaugh();
          }

          // Drop into hunched window-height stance outside driver window and slam head 8 times (0.48s/bang)
          const attackT = this.night3CarPhaseTimer - 0.85;
          this.clownActor.group.rotation.y = -Math.PI / 2;

          if (attackT < 3.84) {
            const cycleIdx = Math.min(7, Math.floor(attackT / 0.48));
            const localT = attackT - cycleIdx * 0.48;
            let lean = 0.14;
            let headPitch = -0.25;
            let cx = -9.64;

            if (localT < 0.19) {
              const wind = localT / 0.19;
              lean = THREE.MathUtils.lerp(0.18, 0.06, wind);
              headPitch = THREE.MathUtils.lerp(-0.1, -0.38, wind);
              cx = -9.62;
            } else if (localT < 0.34) {
              const slam = (localT - 0.19) / 0.15;
              lean = THREE.MathUtils.lerp(0.06, 0.64, slam);
              headPitch = THREE.MathUtils.lerp(-0.38, 0.70, slam);
              cx = THREE.MathUtils.lerp(-9.62, -9.97, slam);

              if (slam >= 0.72 && this.night3ClownAttackStrikeCount <= cycleIdx) {
                this.night3ClownAttackStrikeCount = cycleIdx + 1;
                this.night3ClownAttackStruck = true;
                soundEngine.playCarWindowCrack();
                this.night3CarCrackShake = 0.65;
                this.chromaticStrength = 0.03;
                this.chromaticPass.uniforms.uAmount.value = 0.03;

                // Blood gushes from the clown's split forehead & stains the cracked driver window
                this.clownActor.setHeadBloodied?.(true);
                this.night3HeadBloodTimer = 4.0;
                this.spawnNight3HeadBloodGush(18, true);

                const bloodMesh = this.world.duckCar?.userData?.driverWindowBlood as THREE.Mesh | undefined;
                if (bloodMesh) {
                  bloodMesh.visible = true;
                  const mat = bloodMesh.material as THREE.MeshBasicMaterial;
                  mat.opacity = Math.min(1.0, 0.44 + cycleIdx * 0.08);
                }

                if (cycleIdx === 0) {
                  if (this.world.duckCar?.userData?.driverWindowCrack) {
                    this.world.duckCar.userData.driverWindowCrack.visible = true;
                  }
                  this.callbacks.onObjectiveCompletedNotice(t.notices.night3WindowCracked);
                  window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3500);
                }
              }
            } else {
              const rebound = (localT - 0.34) / 0.14;
              lean = THREE.MathUtils.lerp(0.64, 0.16, rebound);
              headPitch = THREE.MathUtils.lerp(0.70, -0.14, rebound);
              cx = THREE.MathUtils.lerp(-9.97, -9.64, rebound);
            }

            this.clownActor.group.position.set(cx, -0.82, 13.24);
            this.clownActor.setWindowBangPose?.(lean, headPitch);
          } else {
            this.clownActor.group.position.set(-9.60, THREE.MathUtils.damp(this.clownActor.group.position.y, 0, 10, dt), 13.24);
            this.clownActor.setWindowBangPose?.(0.1, 0);
          }
        }

        if (this.night3CarPhaseTimer >= 4.95) {
          this.clownActor.group.position.y = 0;
          this.clownActor.head.rotation.set(0, 0, 0);
          this.clownActor.updateAnimation(timeSec, 0, false);
          this.night3CarPhase = 'clown_walking_away';
          this.night3CarPhaseTimer = 0;
          this.emitNight3CarProgress();
        }
      }
    } else if (this.night3CarPhase === 'clown_walking_away') {
      if (this.clownActor) {
        const walkP = Math.min(1, this.night3CarPhaseTimer / 2.75);
        const cx = THREE.MathUtils.lerp(-9.55, 2.2, walkP);
        const cz = THREE.MathUtils.lerp(13.24, 17.8, walkP);
        this.clownActor.group.position.set(cx, 0, cz);
        this.clownActor.group.rotation.y = Math.atan2(2.2 - -9.55, 17.8 - 13.24);
        this.clownActor.updateAnimation(timeSec, 2.5, true);
      }

      const outOfSight =
        this.night3CarPhaseTimer >= 0.45 && !this.isLookingAtClown(18, 0.22);

      if (outOfSight || this.night3CarPhaseTimer >= 2.75) {
        if (this.clownActor) {
          this.clownActor.group.visible = false;
        }
        if (this.world.duckCar?.userData?.doorAttackLight) {
          (this.world.duckCar.userData.doorAttackLight as THREE.PointLight).intensity = 0;
        }
        this.night3CarPhase = 'post_attack_dialogue';
        this.emitNight3CarProgress();
        this.startDialogue(t.night3CarPostAttackDialogue, true, 'night3_car_post_attack');
      }
    } else if (this.night3CarPhase === 'police_dispatched') {
      if (this.night3CarPhaseTimer >= 3.2 && !this.closingShiftTargetScreen) {
        this.phoneOpen = false;
        this.closingShiftTargetScreen = 'night3_ending';
        this.fadeAlpha = Math.max(this.fadeAlpha, 0.01);
        this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
      }
    }

    // Apply camera transform inside roomy car cabin (+ impact shake during window slam)
    const shakeMag = this.night3CarCrackShake > 0 ? this.night3CarCrackShake * 0.06 : 0;
    this.camera.position.set(
      this.playerPos.x + (Math.random() - 0.5) * shakeMag,
      this.playerPos.y + (Math.random() - 0.5) * shakeMag,
      this.playerPos.z
    );
    this._tmpLookTarget
      .copy(this.camera.position)
      .add(
        this._tmpCamDir.set(
          Math.cos(this.pitch) * -Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * -Math.cos(this.yaw)
        )
      );
    this.camera.lookAt(this._tmpLookTarget);

    this.flashlight.visible = this.stats.flashlightOn;
    this.flashlight.position.copy(this.camera.position);
    this.flashlightTarget.position.copy(this.camera.position).addScaledVector(this._tmpCamDir, 10);
    this.playerDimLight.position.copy(this.camera.position);
  }

  public chooseNight3CarExit() {
    if (this.night3CarPhase !== 'choice') return;
    this.night3CarPhase = 'bad_ending_caught';
    this.night3CarPhaseTimer = 0;
    this.phoneOpen = false;
    if (this.world.duckCar?.userData?.doorAttackLight) {
      (this.world.duckCar.userData.doorAttackLight as THREE.PointLight).intensity = 0;
    }
    this.emitNight3CarProgress();

    // Duck steps out of the car into the dark parking lot -> Clown ambushes & kills Duck!
    this.playerPos.set(-9.4, 1.65, 13.25);
    this.playerHeight = 1.65;
    this.targetHeight = 1.65;

    if (this.clownActor) {
      this.clownActor.group.visible = true;
      this.clownActor.head.rotation.set(0, 0, 0);
      this.clownActor.group.position.set(-8.45, 0, 13.25);
      this.clownActor.group.rotation.y = -Math.PI / 2;
      this.clownActor.updateAnimation(0, 0, false);
    }

    soundEngine.playClownSpottedScare();
    this.whiteFlashAlpha = 0.92;
    this.callbacks.onWhiteFlashAlphaUpdate?.(this.whiteFlashAlpha);
    this.chromaticStrength = 0.036;
    this.chromaticPass.uniforms.uAmount.value = 0.036;
    this.night3CaughtScareTimer = 0.9;
  }

  public chooseNight3CarHideAndCallHelp() {
    if (this.night3CarPhase !== 'choice') return;
    this.night3CarPhase = 'hiding_using_phone';
    this.night3CarPhaseTimer = 0;
    this.targetHeight = 0.94;
    soundEngine.playCarDoorClose();
    this.emitNight3CarProgress();
    this.notifyActiveObjective();
    this.callbacks.onPhoneToggleRequested?.();
  }

  public completeNight3EmergencyAction(action: 'police' | 'john') {
    if (action === 'police') {
      this.night3CalledPolice = true;
    } else {
      this.night3TextedJohn = true;
    }
    this.emitNight3CarProgress();

    if (
      this.night3CarPhase === 'hiding_using_phone' &&
      this.night3CalledPolice &&
      this.night3TextedJohn
    ) {
      const t = getTranslations(this.settings.language).engine;
      this.night3CarPhase = 'police_dispatched';
      this.night3CarPhaseTimer = 0;
      soundEngine.playPoliceSirens();
      this.callbacks.onObjectiveCompletedNotice(t.notices.night3PoliceOnWay);
      window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 4000);
      this.emitNight3CarProgress();
      this.notifyActiveObjective();
    }
  }
}
