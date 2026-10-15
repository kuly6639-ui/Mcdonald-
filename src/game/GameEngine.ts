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
import { createDetailedCar, createCustomerCharacter } from './props';

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

// Strict mapping of active objective IDs to allowed interactive item IDs
const STEP_ALLOWED_ITEMS: Record<string, string[]> = {
  // Night 1
  'clock_in': ['time_clock'],
  'clean_tables': ['clean_table_1', 'clean_table_2'],
  'collect_trash': ['trash_bag_1', 'trash_bag_2'],
  'dump_trash': ['outdoor_dumpster'],
  'kitchen_fryers': ['kitchen_switch'],
  'storage_log': ['storage_clipboard'],
  'check_cctv': ['cctv_monitor'],
  'finish_shift': ['front_door_exit'],

  // Night 2
  'n2_clock_in': ['time_clock'],
  'n2_breaker': ['office_switch'],
  'n2_freezer': ['freezer_temp_gauge'],
  'n2_mop_puddle': ['hallway_spill'],
  'n2_cardboard': ['cardboard_bundle', 'outdoor_dumpster'],
  'n2_drive_thru': ['drive_thru_order_station'],
  'n2_cctv_final': ['cctv_monitor'],
};

// Customer NPC Archetypes with distinct personalities & Duck's employee dialogues
export interface CustomerArchetype {
  name: string;
  title: string;
  dialogue: DialogueLine[];
}

export const CUSTOMER_ARCHETYPES: CustomerArchetype[] = [
  // 1. Exhausted Night-Shift Worker
  {
    name: 'Nurse Ramirez',
    title: 'Exhausted Night-Shift Worker',
    dialogue: [
      { speaker: 'Nurse Ramirez', text: 'Hey... please tell me the coffee pot is still hot. Just wrapped a brutal 14-hour ER shift.' },
      { speaker: 'Duck', text: 'Freshly brewed five minutes ago. Night shifts really drain your soul, don\'t they?' },
      { speaker: 'Nurse Ramirez', text: 'You have no idea. But honestly... it feels quieter than a morgue in here tonight. The road outside was dead empty.' },
      { speaker: 'Duck', text: 'Yeah, usually I get rowdy kids. Tonight it\'s just me, the fryers, and that creepy clown mascot sitting by the booths.' },
      { speaker: 'Nurse Ramirez', text: 'Keep the front doors locked if you can, kid. Something in the air out there feels completely off.' },
      { speaker: 'Duck', text: 'Corporate policy says 24/7 lobby access. Even if a ghost clown attacks, management would dock my pay.' },
    ],
  },
  // 2. Nervous Teenager
  {
    name: 'Tyler',
    title: 'Jittery Teenager',
    dialogue: [
      { speaker: 'Tyler', text: 'Yo... bro. Bro! Did you see that?! Did that Ronald clown statue over in the dining booth just turn its head?!' },
      { speaker: 'Duck', text: 'It\'s hollow plastic and fiberglass bolted into the linoleum. It doesn\'t move, Tyler.' },
      { speaker: 'Tyler', text: 'I swear on my life it was facing the window when I parked my car! Now its head is tilted straight toward the register!' },
      { speaker: 'Duck', text: 'I make eight bucks an hour. Even if that clown comes to life, I don\'t get paid enough to run.' },
      { speaker: 'Tyler', text: 'I\'m grabbing my fries to go. You are insane for working here alone in the dark, man.' },
      { speaker: 'Duck', text: 'Have a wonderful night. Don\'t forget to leave five stars on the customer survey.' },
    ],
  },
  // 3. Cryptic / Unsettling Regular
  {
    name: 'Old Man Silas',
    title: 'Cryptic Regular',
    dialogue: [
      { speaker: 'Old Man Silas', text: 'He doesn\'t care for the fluorescent buzz, young man. He only listens when the tubes start to flicker.' },
      { speaker: 'Duck', text: 'Sir, if you\'re not ordering food, company guidelines say you can\'t stand around whispering ominously.' },
      { speaker: 'Old Man Silas', text: 'Forty years ago, this ground belonged to the woods. The painted smiles in greasepaint never really wash away.' },
      { speaker: 'Duck', text: 'Right. Look, Silas, the burgers are beef and the clown is resin. Take your hot tea and have a seat.' },
      { speaker: 'Old Man Silas', text: 'When the bells chime six, check the glass. He is always watching who walks out the front door.' },
      { speaker: 'Duck', text: '...Great. Another lovely bedtime story for my shift.' },
    ],
  },
  // 4. Highway Long-Hauler Trucker
  {
    name: 'Big Ray',
    title: 'Highway Long-Hauler',
    dialogue: [
      { speaker: 'Big Ray', text: 'Evening, chief. Big Mac meal and a black coffee to keep my eyes glued open till Omaha.' },
      { speaker: 'Duck', text: 'Coming right up. Long drive ahead of you tonight?' },
      { speaker: 'Big Ray', text: 'Eight hundred miles. Hey, who\'s the fella in the yellow suit standing out back by the dumpster?' },
      { speaker: 'Duck', text: '...Excuse me? Nobody is allowed out back behind the kitchen.' },
      { speaker: 'Big Ray', text: 'Tall guy, bright red hair, yellow jumpsuit. Saw him peering through the storeroom window when I swung the rig around.' },
      { speaker: 'Duck', text: '...I just took the trash out back ten minutes ago. There wasn\'t anyone out there.' },
      { speaker: 'Big Ray', text: 'Well, somebody\'s out there now, kid. You keep your guard up.' },
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

  // Player state
  private playerPos = new THREE.Vector3(0, 1.65, 5.2); // Starts at front entrance facing inside
  private playerVel = new THREE.Vector3();
  private pitch: number = 0;
  private yaw: number = 0;
  private playerHeight: number = 1.65;
  private targetHeight: number = 1.65;
  private isPointerLocked: boolean = false;

  private stats: PlayerStats = {
    stamina: 100,
    isSprinting: false,
    isCrouched: false,
    flashlightOn: true,
    hasTrashInHand: false,
    hasCardboardInHand: false,
  };

  private nightState: NightState = {
    night: 1,
    timeHour: 0,
    timeMinute: 0,
    timeTotalSeconds: 0,
    currentObjectiveIndex: 0,
    objectiveCompletedBanner: null,
    tablesCleaned: 0,
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

  // Sequential Objectives for Night 1 & Night 2
  private night1Steps: ObjectiveStep[] = [
    { id: 'clock_in', title: 'CLOCK IN', description: 'Clock in for your night shift using the employee time clock near the counter.' },
    { id: 'clean_tables', title: 'CLEAN TABLES', description: 'Wipe down and sanitize the dirty dining tables (0/2).', targetCount: 2, currentCount: 0 },
    { id: 'collect_trash', title: 'COLLECT TRASH', description: 'Collect fast-food trash bags from the dining area (0/2).', targetCount: 2, currentCount: 0 },
    { id: 'dump_trash', title: 'TAKE TRASH OUTSIDE', description: 'Take the trash outside through the rear kitchen door to the dumpster.' },
    { id: 'kitchen_fryers', title: 'CHECK KITCHEN', description: 'Power down the kitchen fryers and heating equipment.' },
    { id: 'storage_log', title: 'INSPECT STORAGE', description: 'Check and sign the supply inventory checklist in the storage room.' },
    { id: 'check_cctv', title: 'INSPECT SECURITY', description: 'Inspect the security office CCTV surveillance console.' },
    { id: 'finish_shift', title: 'SURVIVE UNTIL 6:00 AM', description: 'Opening preparation complete. Customer service is active. Attend to customers and survive until 6:00 AM.' },
  ];

  private night2Steps: ObjectiveStep[] = [
    { id: 'n2_clock_in', title: 'CLOCK IN', description: 'Clock in for Night 2 shift at the employee time clock.' },
    { id: 'n2_breaker', title: 'MAINTENANCE BREAKER', description: 'Flip the auxiliary maintenance breaker in the security office.' },
    { id: 'n2_freezer', title: 'FREEZER TEMPERATURE', description: 'Record the walk-in freezer temperature log.' },
    { id: 'n2_mop_puddle', title: 'MOP HALLWAY', description: 'Mop up the mysterious dark fluid puddle in the back hallway.' },
    { id: 'n2_cardboard', title: 'RECYCLE CARDBOARD', description: 'Take bundled cardboard boxes outside to the rear dumpster.' },
    { id: 'n2_drive_thru', title: 'DRIVE-THRU CHECK', description: 'Inspect the relocated drive-thru order station at the cashier counter.' },
    { id: 'n2_cctv_final', title: 'CHECK SURVEILLANCE', description: 'Inspect the security office cameras before closing up.' },
  ];

  private currentSteps: ObjectiveStep[] = [];

  private settings: GameSettings = {
    masterVolume: 0.8,
    mouseSensitivity: 1.2,
    invertY: false,
    crtFilter: true,
    graphicsQuality: 'high',
  };

  // Dialogue & Monologue state for Duck and Customers
  private dialogueState: DialogueState = {
    active: false,
    isMonologue: false,
    lines: [],
    currentIndex: 0,
  };
  private fadeAlpha: number = 0;
  private nearbyCustomer: CustomerPerson | null = null;
  private customerConvoIndex: number = 0;

  // Flashlight (Unlimited battery)
  private flashlight: THREE.SpotLight;
  private flashlightTarget: THREE.Object3D;
  private playerDimLight: THREE.PointLight;

  // Controls
  private keys: Record<string, boolean> = {};
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
    this.renderer.toneMappingExposure = 1.05;
    this.applyGraphicsQuality(this.settings.graphicsQuality);
    container.appendChild(this.renderer.domElement);

    // 2. Scene & Fog
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x040507);
    this.scene.fog = new THREE.FogExp2(0x05070a, 0.045);

    // Studio Environment Reflections
    const pmremGenerator = new THREE.PMREMGenerator(this.renderer);
    this.scene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
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

    this.playerDimLight = new THREE.PointLight(0xffecd0, 0.15, 3.0);
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
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      if (this.scene && this.scene.fog && 'density' in this.scene.fog) {
        (this.scene.fog as THREE.FogExp2).density = 0.04;
      }
    } else {
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));
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

    if (code === 'KeyF' && this.currentScreen === 'playing' && !this.isPaused) {
      this.stats.flashlightOn = !this.stats.flashlightOn;
      soundEngine.playFlashlightClick(this.stats.flashlightOn);
      this.callbacks.onPlayerStatsUpdate({ ...this.stats });
    }

    if (code === 'KeyC' && this.currentScreen === 'playing' && !this.isPaused) {
      this.stats.isCrouched = !this.stats.isCrouched;
      this.targetHeight = this.stats.isCrouched ? 0.95 : 1.65;
      this.callbacks.onPlayerStatsUpdate({ ...this.stats });
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

  private closeDialogue() {
    this.dialogueState.active = false;
    this.callbacks.onDialogueUpdate({ ...this.dialogueState });
    this.notifyActiveObjective();
  }

  private startCustomerDialogue() {
    if (!this.nearbyCustomer) return;
    const archIdx = this.nearbyCustomer.archetypeIndex ?? (this.customerConvoIndex % CUSTOMER_ARCHETYPES.length);
    const archetype = CUSTOMER_ARCHETYPES[archIdx % CUSTOMER_ARCHETYPES.length];
    this.customerConvoIndex += 1;
    this.startDialogue(archetype.dialogue, false, this.nearbyCustomer.id);
  }

  private handleKeyUp = (e: KeyboardEvent) => {
    this.keys[e.code] = false;
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

    // Main character Duck starts at the front entrance of the restaurant, facing inside!
    this.playerPos.set(0, 1.65, 5.2);
    this.playerVel.set(0, 0, 0);
    this.yaw = 0; // Facing into the restaurant towards the counter
    this.pitch = 0;
    this.targetHeight = 1.65;

    // Smooth fade-in from black
    this.fadeAlpha = 1.0;
    this.callbacks.onFadeAlphaUpdate(1.0);

    // Reset world mesh states
    this.world.interactiveMeshes.forEach((mesh) => {
      mesh.visible = true;
    });

    // Reset customer state
    if (this.activeCustomerCar) {
      this.scene.remove(this.activeCustomerCar.meshGroup);
      this.activeCustomerCar = null;
    }
    if (this.activeCustomerPerson) {
      this.scene.remove(this.activeCustomerPerson.meshGroup);
      this.activeCustomerPerson = null;
    }
    this.customerSpawnTimer = 6;
    this.frontChimePlayedForCurrentCustomer = false;

    // Load active steps
    this.currentSteps = night === 1 ? [...this.night1Steps] : [...this.night2Steps];

    // Opening Monologue from Duck
    const monologueLines: DialogueLine[] =
      night === 1
        ? [
            { speaker: 'Duck', text: 'Another night at this place… seriously?' },
            { speaker: 'Duck', text: 'Minimum wage, creepy customers, and a whole shift ahead of me. Great.' },
            { speaker: 'Duck', text: 'Whatever. Let\'s just get this over with.' },
          ]
        : [
            { speaker: 'Duck', text: 'Back again for Night 2… The air feels even colder tonight.' },
            { speaker: 'Duck', text: 'Just focus on the checklist, get through the shift, and get out of here.' },
            { speaker: 'Duck', text: 'Whatever. Let\'s clock in.' },
          ];

    this.startDialogue(monologueLines, true);

    this.isPaused = false;
    this.setScreen('playing');
    this.requestPointerLock();

    soundEngine.playHourBell();
  }

  private notifyActiveObjective() {
    const active = this.currentSteps[this.nightState.currentObjectiveIndex] || null;
    this.callbacks.onActiveObjectiveUpdate(active);
    this.callbacks.onNightStateUpdate({ ...this.nightState });
  }

  public isCustomerArrivalUnlocked(): boolean {
    if (this.nightState.night === 1) {
      const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
      return currentStep?.id === 'finish_shift';
    }
    if (this.nightState.night === 2) {
      return this.nightState.currentObjectiveIndex >= 5;
    }
    return false;
  }

  private advanceObjective() {
    const completedStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (completedStep) {
      soundEngine.playObjectiveComplete();
      this.callbacks.onObjectiveCompletedNotice(`COMPLETED: ${completedStep.title}`);

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
      this.exitPointerLock();
    } else {
      this.requestPointerLock();
    }
  }

  public updateSettings(newSettings: Partial<GameSettings>) {
    this.settings = { ...this.settings, ...newSettings };
    soundEngine.setMasterVolume(this.settings.masterVolume);
    if (newSettings.graphicsQuality) {
      this.applyGraphicsQuality(newSettings.graphicsQuality);
    }
  }

  // --- INTERACTION LOGIC (STRICT SEQUENTIAL ORDER) ---

  private triggerInteraction() {
    if (!this.activeItemNearby) return;
    const item = this.activeItemNearby;

    // Optional conversation with seated customer (Silas)
    if (item.id === 'seated_customer') {
      const arch = CUSTOMER_ARCHETYPES[2]; // Silas (Cryptic Regular)
      this.startDialogue(arch.dialogue, false, 'seated_customer');
      return;
    }

    const currentStep = this.currentSteps[this.nightState.currentObjectiveIndex];
    if (!currentStep) return;

    // --- NIGHT 1 INTERACTIONS ---
    if (this.nightState.night === 1) {
      // Step 0: Clock in
      if (currentStep.id === 'clock_in' && item.type === 'time_clock') {
        soundEngine.playTimeClockPunch();
        this.nightState.clockedIn = true;
        this.advanceObjective();
        return;
      }

      // Step 1: Clean Tables (must clean 2 tables)
      if (currentStep.id === 'clean_tables' && item.type === 'clean_table') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;

        this.nightState.tablesCleaned += 1;
        currentStep.currentCount = this.nightState.tablesCleaned;
        currentStep.description = `Wipe down and sanitize the dirty dining tables (${this.nightState.tablesCleaned}/2).`;

        if (this.nightState.tablesCleaned >= 2) {
          this.advanceObjective();
        } else {
          this.notifyActiveObjective();
        }
        return;
      }

      // Step 2: Collect Trash (must pick up 2 trash items)
      if (currentStep.id === 'collect_trash' && item.type === 'trash_item') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;

        this.nightState.trashCollected += 1;
        this.stats.hasTrashInHand = true;
        currentStep.currentCount = this.nightState.trashCollected;
        currentStep.description = `Collect fast-food trash bags from the dining area (${this.nightState.trashCollected}/2).`;

        if (this.nightState.trashCollected >= 2) {
          this.advanceObjective();
        } else {
          this.notifyActiveObjective();
        }
        this.callbacks.onPlayerStatsUpdate({ ...this.stats });
        return;
      }

      // Step 3: Dump Trash outside in rear dumpster
      if (currentStep.id === 'dump_trash' && item.type === 'outdoor_dumpster') {
        soundEngine.playOutdoorDumpsterDump();
        this.nightState.trashDumped = true;
        this.stats.hasTrashInHand = false;
        this.callbacks.onPlayerStatsUpdate({ ...this.stats });
        this.advanceObjective();
        return;
      }

      // Step 4: Check Kitchen Fryers & Grills
      if (currentStep.id === 'kitchen_fryers' && item.type === 'kitchen_switch') {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.nightState.kitchenShutDown = true;
        this.advanceObjective();
        return;
      }

      // Step 5: Storage Inventory Log
      if (currentStep.id === 'storage_log' && item.type === 'storage_clipboard') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        this.nightState.storageInspected = true;
        this.advanceObjective();
        return;
      }

      // Step 6: Security CCTV console
      if (currentStep.id === 'check_cctv' && item.type === 'cctv_monitor') {
        soundEngine.playCCTVSwitch();
        this.advanceObjective();
        this.setScreen('cctv');
        return;
      }

      // Step 7: Finish Shift at 6:00 AM
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour >= 6 || this.nightState.timeTotalSeconds >= 180) {
          soundEngine.playDoor(true);
          this.setScreen('night1_complete');
        } else {
          this.callbacks.onObjectiveCompletedNotice('Shift ends at 6:00 AM. Please wait until dawn.');
          window.setTimeout(() => this.callbacks.onObjectiveCompletedNotice(null), 3000);
        }
        return;
      }
    }

    // --- NIGHT 2 INTERACTIONS ---
    if (this.nightState.night === 2) {
      // Step 0: Clock in
      if (currentStep.id === 'n2_clock_in' && item.type === 'time_clock') {
        soundEngine.playTimeClockPunch();
        this.advanceObjective();
        return;
      }

      // Step 1: Auxiliary breaker switch
      if (currentStep.id === 'n2_breaker' && item.id === 'office_switch') {
        soundEngine.playSwitchToggle();
        item.completed = true;
        this.advanceObjective();
        return;
      }

      // Step 2: Freezer temperature log
      if (currentStep.id === 'n2_freezer' && item.type === 'freezer_temp_gauge') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        this.nightState.freezerLogged = true;
        this.advanceObjective();
        return;
      }

      // Step 3: Mop hallway spill
      if (currentStep.id === 'n2_mop_puddle' && item.type === 'hallway_spill') {
        soundEngine.playCleaningWipe();
        item.completed = true;
        const mesh = this.world.interactiveMeshes.get(item.id);
        if (mesh) mesh.visible = false;
        this.nightState.hallwayMopped = true;
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
          this.callbacks.onPlayerStatsUpdate({ ...this.stats });
          currentStep.description = 'Toss cardboard waste into outdoor dumpster.';
          this.notifyActiveObjective();
          return;
        } else if (item.type === 'outdoor_dumpster' && this.stats.hasCardboardInHand) {
          soundEngine.playOutdoorDumpsterDump();
          this.stats.hasCardboardInHand = false;
          this.callbacks.onPlayerStatsUpdate({ ...this.stats });
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

      // Step 6: Final CCTV surveillance check -> Triggers the Teaser!
      if (currentStep.id === 'n2_cctv_final' && item.type === 'cctv_monitor') {
        soundEngine.playCCTVSwitch();
        this.nightState.teaserStep = 1;
        this.setScreen('cctv');
        return;
      }
    }
  }

  // --- CCTV CAMERA SWITCHING & NIGHT 2 TEASER ---

  public switchCCTV(camId: number) {
    if (camId >= 1 && camId <= 5) {
      soundEngine.playCCTVSwitch();
      const prevCam = this.nightState.cctvActiveCam;
      this.nightState.cctvActiveCam = camId;

      if (this.nightState.night === 2 && this.nightState.teaserStep >= 1) {
        if (prevCam === 1 && camId !== 1 && this.nightState.teaserStep === 1) {
          this.nightState.teaserStep = 2;
        } else if (this.nightState.teaserStep === 2 && camId === 1) {
          // Final Teaser reveal
          this.nightState.teaserStep = 3;
          soundEngine.playCameraGlitchAndBoom();
          window.setTimeout(() => {
            this.setScreen('night2_teaser');
          }, 2400);
        }
      }

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

    if (this.currentScreen === 'playing' && !this.isPaused) {
      this.updateSimulation(dt);
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

  private updateSimulation(dt: number) {
    // In-game Clock: 1 in-game minute per 0.8s
    this.nightState.timeTotalSeconds += dt;
    const totalMinutes = Math.floor(this.nightState.timeTotalSeconds * 1.25);
    const newHour = Math.floor(totalMinutes / 60);
    const newMinute = totalMinutes % 60;

    if (newHour !== this.nightState.timeHour) {
      soundEngine.playHourBell();
      if (newHour >= 6 && this.nightState.night === 1) {
        // Unlock front exit
        const lastStep = this.night1Steps[this.night1Steps.length - 1];
        lastStep.description = 'It is 6:00 AM! Clock out and exit through the front doors.';
        this.notifyActiveObjective();
      }
    }
    this.nightState.timeHour = newHour;
    this.nightState.timeMinute = newMinute;

    // Smooth visual fade-in from black
    if (this.fadeAlpha > 0) {
      this.fadeAlpha = Math.max(0, this.fadeAlpha - dt / 1.8);
      this.callbacks.onFadeAlphaUpdate(this.fadeAlpha);
    }

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

    // Unlimited Flashlight
    this.flashlight.visible = this.stats.flashlightOn;
    this.flashlight.position.copy(this.camera.position);
    const fwd = new THREE.Vector3();
    this.camera.getWorldDirection(fwd);
    this.flashlightTarget.position.copy(this.camera.position).add(fwd.multiplyScalar(10));
    this.playerDimLight.position.copy(this.camera.position);

    // Proximity to interactive items
    this.updateInteractions();
  }

  private updatePlayerMovement(dt: number) {
    this.playerHeight = THREE.MathUtils.damp(this.playerHeight, this.targetHeight, 10, dt);

    // Lock player walking movement while dialogue or monologue is open
    if (this.dialogueState.active) {
      this.playerVel.set(0, 0, 0);
      this.camera.position.copy(this.playerPos);
      const lookTarget = new THREE.Vector3()
        .copy(this.playerPos)
        .add(
          new THREE.Vector3(
            Math.cos(this.pitch) * -Math.sin(this.yaw),
            Math.sin(this.pitch),
            Math.cos(this.pitch) * -Math.cos(this.yaw)
          )
        );
      this.camera.lookAt(lookTarget);
      return;
    }

    const wantsSprint =
      (this.keys['ShiftLeft'] || this.keys['ShiftRight']) &&
      !this.stats.isCrouched &&
      this.stats.stamina > 5;
    this.stats.isSprinting = wantsSprint;

    if (this.stats.isSprinting) {
      this.stats.stamina = Math.max(0, this.stats.stamina - dt * 25);
    } else {
      this.stats.stamina = Math.min(100, this.stats.stamina + dt * 20);
    }

    const forward = new THREE.Vector3(-Math.sin(this.yaw), 0, -Math.cos(this.yaw));
    const right = new THREE.Vector3(Math.cos(this.yaw), 0, -Math.sin(this.yaw));

    const moveDir = new THREE.Vector3();
    if (this.keys['KeyW']) moveDir.add(forward);
    if (this.keys['KeyS']) moveDir.sub(forward);
    if (this.keys['KeyA']) moveDir.sub(right);
    if (this.keys['KeyD']) moveDir.add(right);

    const isMoving = moveDir.lengthSq() > 0.001;
    if (isMoving) {
      moveDir.normalize();
      const speed = this.stats.isCrouched ? 1.6 : this.stats.isSprinting ? 4.8 : 2.8;
      this.playerVel.x = THREE.MathUtils.damp(this.playerVel.x, moveDir.x * speed, 14, dt);
      this.playerVel.z = THREE.MathUtils.damp(this.playerVel.z, moveDir.z * speed, 14, dt);

      this.footstepTimer += dt;
      const stepInterval = this.stats.isSprinting ? 0.3 : this.stats.isCrouched ? 0.6 : 0.45;
      if (this.footstepTimer > stepInterval) {
        this.footstepTimer = 0;
        soundEngine.playFootstep(this.stats.isSprinting, this.stats.isCrouched);
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

    const lookTarget = new THREE.Vector3()
      .copy(this.playerPos)
      .add(
        new THREE.Vector3(
          Math.cos(this.pitch) * -Math.sin(this.yaw),
          Math.sin(this.pitch),
          Math.cos(this.pitch) * -Math.cos(this.yaw)
        )
      );
    this.camera.lookAt(lookTarget);

    this.callbacks.onPlayerStatsUpdate({ ...this.stats });
  }

  // --- AUTOMATIC SLIDING GLASS DOORS WITH ENTRANCE CHIME ---

  private updateAutomaticSlidingDoors(dt: number) {
    // Check if player or customer is near front entrance (X = 0, Z = 6.0)
    const doorPos = new THREE.Vector3(0, 0, 6.0);
    const distPlayer = this.playerPos.distanceTo(doorPos);
    let distCustomer = Infinity;

    if (this.activeCustomerPerson) {
      const cPos = new THREE.Vector3(...this.activeCustomerPerson.currentPos);
      distCustomer = cPos.distanceTo(doorPos);
    }

    const isNearDoor = distPlayer < 2.8 || distCustomer < 2.8;
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

    // 2. Spawning arriving customer car
    if (!this.activeCustomerCar && !this.activeCustomerPerson) {
      this.customerSpawnTimer -= dt;
      if (this.customerSpawnTimer <= 0) {
        this.customerSpawnTimer = 35 + Math.random() * 20; // Next arrival in 35-55s
        this.spawnCustomerCar();
      }
    }

    // 3. Animate arriving car
    if (this.activeCustomerCar) {
      const car = this.activeCustomerCar;
      if (car.state === 'driving_in') {
        car.progress += dt * 0.4; // 2.5s travel
        // Drive in from east road [25, 0, 24] to parking entrance [0, 0, 20]
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

      if (person.state === 'walking_to_door') {
        // Walk from parked car [carX, 0, carZ] to front entrance [0, 0, 5.0]
        const targetX = 0;
        const targetZ = 5.0;

        const dx = targetX - person.currentPos[0];
        const dz = targetZ - person.currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.15) {
          person.currentPos[0] += (dx / dist) * person.speed * dt;
          person.currentPos[2] += (dz / dist) * person.speed * dt;
          person.meshGroup.position.set(person.currentPos[0], 0, person.currentPos[2]);
          person.meshGroup.rotation.y = Math.atan2(dx, dz);

          // Animate walking limbs
          person.walkProgress += dt * 6.2;
          if (limbs) {
            const swing = Math.sin(person.walkProgress);
            limbs.legL.rotation.x = swing * 0.52;
            limbs.legR.rotation.x = -swing * 0.52;
            limbs.armL.rotation.x = -swing * 0.42;
            limbs.armR.rotation.x = swing * 0.42;
            limbs.head.rotation.y = Math.sin(person.walkProgress * 0.5) * 0.08;
            person.meshGroup.position.y = Math.abs(swing) * 0.035;
          }
        } else {
          // Inside dining area: walk to cashier counter
          person.state = 'inside_counter';
          person.walkProgress = 0;
        }
      } else if (person.state === 'inside_counter') {
        // Walk from entrance to counter [2.4, 0, 1.8]
        const targetX = 2.4;
        const targetZ = 1.8;

        const dx = targetX - person.currentPos[0];
        const dz = targetZ - person.currentPos[2];
        const dist = Math.sqrt(dx * dx + dz * dz);

        if (dist > 0.1) {
          person.currentPos[0] += (dx / dist) * person.speed * dt;
          person.currentPos[2] += (dz / dist) * person.speed * dt;
          person.meshGroup.position.set(person.currentPos[0], 0, person.currentPos[2]);
          person.meshGroup.rotation.y = Math.atan2(dx, dz);

          // Animate walking limbs
          person.walkProgress += dt * 6.2;
          if (limbs) {
            const swing = Math.sin(person.walkProgress);
            limbs.legL.rotation.x = swing * 0.52;
            limbs.legR.rotation.x = -swing * 0.52;
            limbs.armL.rotation.x = -swing * 0.42;
            limbs.armR.rotation.x = swing * 0.42;
            limbs.head.rotation.y = Math.sin(person.walkProgress * 0.5) * 0.08;
            person.meshGroup.position.y = Math.abs(swing) * 0.035;
          }
        } else {
          // Standing at counter browsing menu or waiting for order
          person.state = 'seated';
          person.walkProgress = 0;
          person.meshGroup.rotation.y = -Math.PI / 2; // Facing register
        }
      } else if (person.state === 'seated') {
        // Smoothly settle limbs into idle stance
        if (limbs) {
          limbs.legL.rotation.x = THREE.MathUtils.damp(limbs.legL.rotation.x, 0, 10, dt);
          limbs.legR.rotation.x = THREE.MathUtils.damp(limbs.legR.rotation.x, 0, 10, dt);
          limbs.armL.rotation.x = THREE.MathUtils.damp(limbs.armL.rotation.x, 0, 10, dt);
          limbs.armR.rotation.x = THREE.MathUtils.damp(limbs.armR.rotation.x, 0, 10, dt);
          limbs.head.rotation.y = THREE.MathUtils.damp(limbs.head.rotation.y, 0, 10, dt);
          person.meshGroup.position.y = THREE.MathUtils.damp(person.meshGroup.position.y, 0, 10, dt);
        }

        // Do not advance departure timer while Duck is talking to customer!
        if (!this.dialogueState.active || this.dialogueState.npcId !== person.id) {
          person.walkProgress += dt;
        }
        if (person.walkProgress >= 30) {
          // Leaves restaurant
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

  private spawnCustomerCar() {
    // Pick unoccupied parking spot (spot 1, 2, or 3)
    const availableSpots = [1, 2, 3];
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
    const archetypeIndex = this.customerConvoIndex % CUSTOMER_ARCHETYPES.length;
    const archetype = CUSTOMER_ARCHETYPES[archetypeIndex];

    const personMesh = createCustomerCharacter(0x334455, archetypeIndex);
    personMesh.position.set(carX, 0, carZ);
    this.scene.add(personMesh);

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
    };
  }

  private updateInteractions() {
    if (this.dialogueState.active) {
      this.activeItemNearby = null;
      this.nearbyCustomer = null;
      this.callbacks.onInteractionPrompt(null);
      return;
    }

    // 1. Check Customer NPC conversation (High priority contextual prompt: "[E] Talk to Customer")
    if (this.activeCustomerPerson) {
      const p = this.activeCustomerPerson;
      if (p.state === 'inside_counter' || p.state === 'seated' || p.currentPos[2] < 5.8) {
        const cPos = new THREE.Vector3(p.currentPos[0], 1.35, p.currentPos[2]);
        const toCustomer = new THREE.Vector3().subVectors(cPos, this.camera.position);
        const distToCustomer = toCustomer.length();
        toCustomer.normalize();
        const camDir = new THREE.Vector3();
        this.camera.getWorldDirection(camDir);
        const dot = camDir.dot(toCustomer);

        if (distToCustomer <= 2.8 && dot > 0.4) {
          this.nearbyCustomer = p;
          this.activeItemNearby = null;
          this.callbacks.onInteractionPrompt(`[E] Talk to ${p.archetypeName || 'Customer'}`);
          return;
        }
      }
    }
    this.nearbyCustomer = null;

    // Seated regular customer in dining booth (Silas)
    const seatedItem = this.world.interactiveItems.find((it) => it.id === 'seated_customer');
    if (seatedItem) {
      const sPos = new THREE.Vector3(...seatedItem.position);
      const toSeated = new THREE.Vector3().subVectors(sPos, this.camera.position);
      const distToSeated = toSeated.length();
      toSeated.normalize();
      const camDir = new THREE.Vector3();
      this.camera.getWorldDirection(camDir);
      const dot = camDir.dot(toSeated);

      if (distToSeated <= 2.6 && dot > 0.42) {
        this.activeItemNearby = seatedItem;
        this.callbacks.onInteractionPrompt('[E] Talk to Silas (Regular Customer)');
        return;
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
    const camDir = new THREE.Vector3();
    this.camera.getWorldDirection(camDir);

    let closestItem: InteractiveItem | null = null;
    let minDist = Infinity;

    for (const item of this.world.interactiveItems) {
      if (item.completed) continue;
      // Tasks that have not been unlocked MUST NOT display interaction buttons or prompts
      if (!allowedIds.includes(item.id)) continue;

      // Special contextual conditions
      if (currentStep.id === 'dump_trash' && !this.stats.hasTrashInHand && item.type === 'outdoor_dumpster') {
        continue;
      }
      if (currentStep.id === 'n2_cardboard') {
        if (this.stats.hasCardboardInHand && item.type !== 'outdoor_dumpster') continue;
        if (!this.stats.hasCardboardInHand && item.type !== 'cardboard_bundle') continue;
      }
      if (currentStep.id === 'finish_shift' && item.type === 'front_door_exit') {
        if (this.nightState.timeHour < 6 && this.nightState.timeTotalSeconds < 180) {
          continue;
        }
      }

      const itemPos = new THREE.Vector3(...item.position);
      const d = this.playerPos.distanceTo(itemPos);
      if (d < item.radius && d < minDist) {
        // Player must be looking towards the interactable object (not looking away or behind)
        const toItem = new THREE.Vector3().subVectors(itemPos, this.camera.position).normalize();
        const dot = camDir.dot(toItem);
        if (dot > 0.35) {
          minDist = d;
          closestItem = item;
        }
      }
    }

    this.activeItemNearby = closestItem;
    if (closestItem) {
      this.callbacks.onInteractionPrompt(`E — ${closestItem.actionText}`);
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

    // Flickering lights
    this.world.flickeringLights.forEach((fl) => {
      const flicker = Math.sin(timeSec * 20 + fl.flickerRate * 100) > 0.88 ? 0.4 : 1.0;
      const noise = (Math.random() - 0.5) * 0.1;
      fl.light.intensity = fl.baseIntensity * flicker + noise;
    });
  }

  public dispose() {
    if (this.reqId) cancelAnimationFrame(this.reqId);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
    document.removeEventListener('mousemove', this.handleMouseMove);

    this.renderer.dispose();
    if (this.container && this.renderer.domElement) {
      this.container.removeChild(this.renderer.domElement);
    }
  }
}
