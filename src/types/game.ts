export type GameNight = 1 | 2 | 3;

export type GameScreen =
  | 'warning'
  | 'menu'
  | 'playing'
  | 'cctv'
  | 'night1_complete'
  | 'night2_complete'
  | 'night3_ending'
  | 'night3_bad_ending'
  | 'credits'
  | 'settings';

export type GraphicsQuality = 'low' | 'medium' | 'high';

export type Language = 'en' | 'vi' | 'ru' | 'id';

export interface ObjectiveStep {
  id: string;
  title: string;
  description: string;
  targetCount?: number;
  currentCount?: number;
}

export interface GameSettings {
  masterVolume: number;
  mouseSensitivity: number;
  touchSensitivity?: number;
  touchControls?: 'auto' | 'always' | 'off';
  invertY: boolean;
  crtFilter: boolean;
  graphicsQuality: GraphicsQuality;
  language: Language;
}

export interface PlayerStats {
  stamina: number;
  isSprinting: boolean;
  isCrouched: boolean;
  flashlightOn: boolean;
  hasTrashInHand: boolean;
  hasCardboardInHand: boolean;
  hasFoodInHand?: boolean;
  hasRawFryItemsInHand?: boolean;
  hasBigMacInHand?: boolean;
  hasCoffeeCupInHand?: boolean;
  hasSodaCupInHand?: boolean;
  hasMopInHand?: boolean;
  hasChickenTrayInHand?: boolean;
  hasNoodlesAndDrinkInHand?: boolean;
  mustDiscardFood?: boolean;
}

export interface CustomerCar {
  id: string;
  meshGroup: any; // THREE.Group
  driverMesh: any; // THREE.Group
  state: 'driving_in' | 'parking' | 'parked' | 'leaving';
  progress: number;
  parkingSpotIndex: number;
  hasSpawnedCustomer: boolean;
  color: number;
}

export type CustomerBehaviorType = 'standard' | 'friends_group' | 'grumpy_man' | 'clown_customer';

export interface CustomerPerson {
  id: string;
  meshGroup: any; // THREE.Group
  targetPos: [number, number, number];
  currentPos: [number, number, number];
  state: 'walking_to_door' | 'inside_counter' | 'seated' | 'leaving';
  walkProgress: number;
  hasTriggeredChime: boolean;
  speed: number;
  archetypeIndex: number;
  archetypeName: string;
  archetypeTitle: string;
  behaviorType?: CustomerBehaviorType;
  companionMeshes?: any[];
}

export interface NightState {
  night: GameNight;
  timeHour: number;
  timeMinute: number;
  timeTotalSeconds: number;
  currentObjectiveIndex: number;
  objectiveCompletedBanner: string | null;
  tablesCleaned: number;
  trashCollected: number;
  trashDumped: boolean;
  kitchenShutDown: boolean;
  storageInspected: boolean;
  clockedIn: boolean;
  freezerLogged: boolean;
  hallwayMopped: boolean;
  puddlesMopped?: number;
  cardboardDumped: boolean;
  driveThruInspected: boolean;
  cctvActiveCam: number;
  slidingDoorOpenAmount: number; // 0 (closed) to 1 (fully open)
  rearDoorOpenAmount: number;
  teaserStep: number;
}

export interface DialogueLine {
  speaker: string;
  text: string;
}

export interface DialogueState {
  active: boolean;
  isMonologue: boolean;
  lines: DialogueLine[];
  currentIndex: number;
  npcId?: string;
}

export interface InteractiveItem {
  id: string;
  type:
    | 'time_clock'
    | 'clean_table'
    | 'trash_item'
    | 'outdoor_dumpster'
    | 'trash_bin'
    | 'kitchen_switch'
    | 'storage_clipboard'
    | 'freezer_temp_gauge'
    | 'freezer_chicken_tray'
    | 'hallway_spill'
    | 'mop_tool'
    | 'cardboard_bundle'
    | 'drive_thru_window'
    | 'drive_thru_order_station'
    | 'cctv_monitor'
    | 'front_door_exit'
    | 'seated_customer'
    | 'kitchen_prep_station'
    | 'fryer_machine'
    | 'kitchen_microwave'
    | 'coffee_machine'
    | 'soda_dispenser'
    | 'serve_table_spot'
    | 'employee_john'
    | 'electrical_box'
    | 'toilet_flush'
    | 'store_67_noodle_stall'
    | 'store_67_cashier'
    | 'store_67_car'
    | 'mcd_duck_car';
  name: string;
  actionText: string;
  position: [number, number, number];
  radius: number;
  completed?: boolean;
}

export type Night3CarPhase =
  | 'none'
  | 'entering_starting'
  | 'clown_attacking'
  | 'clown_walking_away'
  | 'post_attack_dialogue'
  | 'choice'
  | 'bad_ending_caught'
  | 'hiding_using_phone'
  | 'police_dispatched';

export interface Night3EmergencyProgress {
  phase: Night3CarPhase;
  calledPolice: boolean;
  textedJohn: boolean;
}

