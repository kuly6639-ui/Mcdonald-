export type GameNight = 1 | 2;

export type GameScreen =
  | 'loading'
  | 'menu'
  | 'playing'
  | 'cctv'
  | 'night1_complete'
  | 'night2_teaser'
  | 'credits'
  | 'settings';

export type GraphicsQuality = 'low' | 'medium' | 'high';

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
  invertY: boolean;
  crtFilter: boolean;
  graphicsQuality: GraphicsQuality;
}

export interface PlayerStats {
  stamina: number;
  isSprinting: boolean;
  isCrouched: boolean;
  flashlightOn: boolean;
  hasTrashInHand: boolean;
  hasCardboardInHand: boolean;
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

export interface CustomerPerson {
  id: string;
  meshGroup: any; // THREE.Group
  targetPos: [number, number, number];
  currentPos: [number, number, number];
  state: 'walking_to_door' | 'inside_counter' | 'seated' | 'leaving';
  walkProgress: number;
  hasTriggeredChime: boolean;
  speed: number;
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
  cardboardDumped: boolean;
  driveThruInspected: boolean;
  cctvActiveCam: number;
  slidingDoorOpenAmount: number; // 0 (closed) to 1 (fully open)
  rearDoorOpenAmount: number;
  teaserStep: number;
}

export interface InteractiveItem {
  id: string;
  type:
    | 'time_clock'
    | 'clean_table'
    | 'trash_item'
    | 'outdoor_dumpster'
    | 'kitchen_switch'
    | 'storage_clipboard'
    | 'freezer_temp_gauge'
    | 'hallway_spill'
    | 'cardboard_bundle'
    | 'drive_thru_window'
    | 'cctv_monitor'
    | 'front_door_exit';
  name: string;
  actionText: string;
  position: [number, number, number];
  radius: number;
  completed?: boolean;
}
