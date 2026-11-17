import { DialogueLine, GraphicsQuality, Language } from '../types/game';

export interface CustomerArchetypeTranslation {
  name: string;
  title: string;
  orderItem: string;
  dialogue: DialogueLine[];
}

export interface TranslationBundle {
  languageName: string;
  languageLabel: string;
  loading: {
    badge: string;
    subtitle: string;
    messages: string[];
    footerHints: [string, string, string];
  };
  menu: {
    est: string;
    nightShift: string;
    survivalHorror: string;
    outsideClearing: string;
    storeActive: string;
    description: string;
    tipBefore: string;
    tipRun: string;
    tipMobile: string;
    playNight1: string;
    firstShift: string;
    playNight2: string;
    playNight3: string;
    locked: string;
    somethingWrong: string;
    theFinalDemoNight: string;
    bgmLabel: string;
    unmute: string;
    musicOn: string;
    controls: string;
    settings: string;
    credits: string;
    storyRuleLabel: string;
    storyRule: string;
    shiftMemo: string;
    employeeRoutine: string;
    memoItems: string[];
    settingsTitle: string;
    graphicsQuality: string;
    qualityLevels: Record<GraphicsQuality, string>;
    audioVolume: string;
    mouseSensitivity: string;
    invertLook: string;
    crtFilter: string;
    enabled: string;
    disabled: string;
    applyClose: string;
    controlsTitle: string;
    controlsList: { key: string; desc: string }[];
    understood: string;
    creditsTitle: string;
    creditsIntro: string;
    creditsDetails: { label: string; value: string }[];
    returnMenu: string;
    versionLabel: string;
  };
  hud: {
    nightShiftEmployee: (night: number) => string;
    stepLabel: (step: number) => string;
    allDutiesDone: string;
    shiftClock: string;
    dawnLabel: string;
    closingLabel: string;
    escPause: string;
    stamina: string;
    stance: string;
    crouched: string;
    standing: string;
    carryingFood: string;
    carryingRawFry: string;
    carryingBigMac: string;
    carryingCoffeeCup: string;
    carryingSodaCup: string;
    carryingSpoiledFood: string;
    carryingChickenTray: string;
    carryingNoodlesAndDrink: string;
    carryingMop: string;
    carryingTrash: string;
    carryingCardboard: string;
    heavyWorklight: string;
    unlimited: string;
    status: string;
    beamActive: string;
    beamOff: string;
    phoneHint: string;
  };
  pause: {
    title: string;
    resume: string;
    restartNight: string;
    mainMenu: string;
    volume: string;
    sensitivity: string;
  };
  dialogue: {
    internal: string;
    internalThoughts: string;
    transmitting: string;
    received: string;
    scrambled: string;
    pressHint: string;
    skip: string;
    skipBtn: string;
    next: string;
    close: string;
    continueBtn: string;
  };
  cctv: {
    rec: string;
    header: string;
    live: string;
    exitOffice: string;
    anomalies: string;
    signal: string;
    matrixTitle: string;
    switchHint: string;
    cameras: { id: number; name: string; label: string }[];
  };
  mobile: {
    touchOn: string;
    pcControls: string;
    move: string;
    crouch: string;
    light: string;
    pause: string;
    run: string;
    running: string;
    action: string;
    phone: string;
  };
  phone: {
    title: string;
    carrier: string;
    back: string;
    close: string;
    apps: { calls: string; messages: string; camera: string };
    emergencyBanner: string;
    emergencyDone: string;
    contacts: { mom: string; landlord: string; john: string; police: string };
    callsTab: {
      callBtn: string;
      callingStatus: (name: string) => string;
      connectedStatus: (name: string) => string;
      momLine: string;
      landlordLine: string;
      policeReady: string;
      policeIdle: string;
      calledPoliceBadge: string;
    };
    messagesTab: {
      sendEmergencyJohn: string;
      sentToJohnBadge: string;
      momThread: { from: string; time: string; text: string }[];
      landlordThread: { from: string; time: string; text: string }[];
      johnThread: { from: string; time: string; text: string }[];
      johnHelpOutgoing: string;
      johnHelpReply: string;
    };
    cameraTab: {
      takePhoto: string;
      retake: string;
      emptyGallery: string;
      savedCount: (n: number) => string;
    };
  };
  night3CarChoice: {
    title: string;
    subtitle: string;
    optionExit: string;
    optionExitSub: string;
    optionHide: string;
    optionHideSub: string;
  };
  victory: {
    night1Over: string;
    theFirstShift: string;
    night1Story1: string;
    night1Story2: string;
    night1Sub: string;
    beginNight2: string;
    mainMenu: string;
    night2Over: string;
    theSecondShift: string;
    night2Story1: string;
    night2Story2: string;
    night2Sub: string;
    beginNight3: string;
    playNight2Again: string;
    playAgain: string;
  };
  night3Ending: {
    scrollingMessage: string;
    badEndingTitle: string;
    badEndingMessage: string;
    pressToFinishTyping: string;
    continueToCredits: string;
    demoOverTitle: string;
    demoOverSubtitle: string;
    creditsHeading: string;
    creditRows: { role: string; name: string }[];
    thankYouNote: string;
    returnToMenu: string;
  };
  engine: {
    steps: {
      talk_to_john: { title: string; description: string };
      clock_in: { title: string; description: string };
      clean_tables: { title: string; description: (count: number) => string };
      mop_puddles: { title: string; description: (count: number) => string };
      collect_trash: { title: string; description: (count: number) => string };
      dump_trash: { title: string; description: string };
      kitchen_fryers: { title: string; description: string };
      check_cctv: { title: string; description: string };
      finish_shift: { title: string; description: string; ready6am: string };
      n2_clock_in: { title: string; description: string };
      n2_breaker: { title: string; description: string };
      n2_mop_puddle: { title: string; description: (count: number) => string };
      n2_cardboard: { title: string; description: string; carryDesc: string };
      n2_drive_thru: { title: string; description: string };
      n2_cctv_final: { title: string; description: string };
      n3_clock_in: { title: string; description: string };
      n3_clean_tables: { title: string; description: (count: number) => string };
      n3_kitchen_check: { title: string; description: string };
    };
    dynamicObjectives: {
      preparingTitle: string;
      preparingDesc: (sec: number) => string;
      prepFoodTitle: string;
      prepFoodDesc: (customerName: string) => string;
      serveTitle: string;
      serveDesc: (customerName: string) => string;
      serveDriveThruDesc: (customerName: string) => string;
      restockFreezerTitle: string;
      restockFreezerDesc: string;
      restockKitchenTitle: string;
      restockKitchenDesc: string;
      checkBathroomTitle: string;
      checkBathroomDesc: string;
      powerOutageTitle: string;
      powerOutageDesc: string;
      powerOutageWithFoodDesc: string;
      discardFoodTitle: string;
      discardFoodDesc: string;
      hungerFadeTitle: string;
      hungerFadeDesc: string;
      store67NoodlesTitle: string;
      store67NoodlesDesc: string;
      store67CashierTitle: string;
      store67CashierDesc: string;
      store67CarTitle: string;
      store67CarDesc: string;
      goToMcdCarTitle: string;
      goToMcdCarDesc: string;
      fryChickenTitle: string;
      fryChickenDesc: (name: string) => string;
      pickupFryTitle: string;
      pickupFryDesc: (name: string) => string;
      fryingProgressTitle: string;
      fryingProgressDesc: (sec: number) => string;
      pickupBurgerTitle: string;
      pickupBurgerDesc: (name: string) => string;
      microwaveTitle: string;
      microwaveDesc: (name: string) => string;
      microwavingProgressTitle: string;
      microwavingProgressDesc: (sec: number) => string;
      pickupCoffeeCupTitle: string;
      pickupCoffeeCupDesc: (name: string) => string;
      coffeeMachineTitle: string;
      coffeeMachineDesc: (name: string) => string;
      brewingCoffeeProgressTitle: string;
      brewingCoffeeProgressDesc: (sec: number) => string;
      pickupSodaCupTitle: string;
      pickupSodaCupDesc: (name: string) => string;
      sodaDispenserTitle: string;
      sodaDispenserDesc: (name: string) => string;
      pouringSodaProgressTitle: string;
      pouringSodaProgressDesc: (sec: number) => string;
      wrapFoodTitle: string;
      wrapFoodDesc: (name: string) => string;
      wrappingProgressTitle: string;
      wrappingProgressDesc: (sec: number) => string;
      pickupFinishedTitle: string;
      pickupFinishedDesc: (name: string) => string;
      night3CarEmergencyTitle: string;
      night3CarEmergencyDesc: string;
    };
    notices: {
      completed: (title: string) => string;
      newTaskPrep: (customerName: string) => string;
      orderCompleted: (price: string) => string;
      prepStarted: string;
      prepInProgress: (sec: number) => string;
      mealInHands: string;
      noPendingOrders: string;
      orderReady: string;
      shiftEnds6am: (timeStr: string) => string;
      shiftSkipped6am: string;
      powerOutage: string;
      powerRestored: string;
      mopPickedUp: string;
      mopRequired: string;
      foodDiscarded: string;
      discardFoodFirst: string;
      outOfFood: string;
      chickenTrayPickedUp: string;
      kitchenRestocked: string;
      restockFoodFirst: string;
      bathroomKnock: string;
      bathroomNothingHere: string;
      driveThruArrived: string;
      duckHungry: string;
      arrived67Eleven: string;
      pickedUpNoodlesDrink: string;
      paidAt67Eleven: string;
      statueMoved: string;
      clownWatchingCar: string;
      fryStarted: string;
      fryDone: string;
      rawFryInHand: string;
      bigMacInHand: string;
      needRawFryInHand: string;
      needBigMacInHand: string;
      coffeeCupInHand: string;
      needCoffeeCupInHand: string;
      coffeeStarted: string;
      coffeeDone: string;
      sodaCupInHand: string;
      needSodaCupInHand: string;
      sodaStarted: string;
      sodaDone: string;
      dishOnKitchenTable: string;
      microwaveStarted: string;
      microwaveDone: string;
      wrapStarted: string;
      night3CarNoGas: string;
      night3WindowCracked: string;
      night3PoliceOnWay: string;
    };
    prompts: {
      talkToJohn: string;
      deliverMeal: (name: string) => string;
      talkAwaiting: (name: string) => string;
      takeOrder: (name: string) => string;
      driveThruTakeOrder: (name: string) => string;
      driveThruDeliverMeal: (name: string) => string;
      talkSilas: string;
      cookingKitchen: (sec: number) => string;
      cookKitchen: string;
      pickUpChickenTray: string;
      restockChickenTray: string;
      inspectElectricalBox: string;
      throwFoodInTrash: string;
      pickUpMop: string;
      mopPuddle: string;
      mopRequiredPrompt: string;
      takeNoodlesAndDrink: string;
      talkCashier67: string;
      enterDuckCar: string;
      enterMcdDuckCar: string;
      takeRawFry: string;
      takeBigMac: string;
      takeCoffeeCup: string;
      takeSodaCup: string;
      takeFinishedDish: string;
      placeDishOnTable: string;
      useFryer: string;
      fryingNow: (sec: number) => string;
      useMicrowave: string;
      microwavingNow: (sec: number) => string;
      useCoffeeMachine: string;
      brewingCoffeeNow: (sec: number) => string;
      useSodaDispenser: string;
      pouringSodaNow: (sec: number) => string;
      wrapFoodCounter: string;
      wrappingNow: (sec: number) => string;
      actions: Record<string, string>;
    };
    openingMonologueNight1: DialogueLine[];
    openingMonologueNight2: DialogueLine[];
    openingMonologueNight3: DialogueLine[];
    johnDialogue: DialogueLine[];
    johnDialogueNight2: DialogueLine[];
    johnDialogueNight3: DialogueLine[];
    powerOutageStartDialogue: DialogueLine[];
    customerPowerOutageLeave: string;
    powerRestoredDialogue: DialogueLine[];
    warehouseClownReactionDialogue: DialogueLine[];
    outOfFoodDialogue: DialogueLine[];
    bathroomKnockDialogue: string;
    bathroomEmptyDialogue: string;
    duckHungerDialogue: DialogueLine[];
    clerk67Dialogue: DialogueLine[];
    clownCustomerName: string;
    clownCustomerTitle: string;
    clownCustomerOrderItem: string;
    clownBuyChickenDialogue: DialogueLine[];
    clownChickenDeliveredDialogue: (price: string) => DialogueLine[];
    clownWatchingCarMonologue: DialogueLine[];
    night3CarNoGasDialogue: DialogueLine[];
    night3CarPostAttackDialogue: DialogueLine[];
    waitRestockDialogue: (customerName: string) => DialogueLine[];
    thankYouDialogue: (customerName: string, price: string) => DialogueLine[];
    grumpyDeliveredDialogue: (customerName: string, price: string) => DialogueLine[];
    friendsSeatedDialogue: (customerName: string, price: string) => DialogueLine[];
    waitingOrderDialogue: (customerName: string, itemText: string) => DialogueLine[];
    customers: CustomerArchetypeTranslation[];
    customersNight2: CustomerArchetypeTranslation[];
    customersNight3: CustomerArchetypeTranslation[];
    driveThruCustomers: CustomerArchetypeTranslation[];
  };
}

export const LANGUAGE_OPTIONS: { code: Language; label: string; short: string }[] = [
  { code: 'en', label: 'English', short: 'EN' },
  { code: 'vi', label: 'Tiếng Việt', short: 'VI' },
  { code: 'ru', label: 'Русский', short: 'RU' },
  { code: 'id', label: 'Bahasa Indonesia', short: 'ID' },
];

export const TRANSLATIONS: Record<Language, TranslationBundle> = {
  en: {
    languageName: 'English',
    languageLabel: 'Language',
    loading: {
      badge: 'System Initialization Protocol',
      subtitle: '2-Night Psychological Horror Demo',
      messages: [
        'Connecting to restaurant power grid…',
        'Calibrating automatic sliding doors & motion sensors…',
        'Checking security systems & CCTV camera matrix…',
        'Initializing late-night shift handover logs…',
        'Preparing your overnight shift…',
        'Opening the restaurant…',
      ],
      footerHints: ['Automatic Sliding Doors', 'Customer Arrival AI', 'Atmospheric Sound'],
    },
    menu: {
      est: 'EST. 1955',
      nightShift: 'Night Shift',
      survivalHorror: 'Survival Horror Experience',
      outsideClearing: 'Outside Clearing',
      storeActive: '● Store Active',
      description:
        "Step into the shoes of Duck on the midnight shift at a lonely McDonald's carved out of a dense horror forest. Take over from John, prepare customer orders, survive until 6:00 AM, and watch the shadows outside.",
      tipBefore: 'Tip: Press',
      tipRun: 'to run on PC, or tap',
      tipMobile: 'on mobile!',
      playNight1: 'PLAY NIGHT 1',
      firstShift: 'The First Shift',
      playNight2: 'PLAY NIGHT 2',
      playNight3: 'PLAY NIGHT 3',
      locked: '(LOCKED)',
      somethingWrong: 'Something is Wrong',
      theFinalDemoNight: 'The Statue Moved',
      bgmLabel: 'BGM: Cold Glass Passage',
      unmute: 'UNMUTE',
      musicOn: 'MUSIC ON',
      controls: 'Controls',
      settings: 'Settings',
      credits: 'Credits',
      storyRuleLabel: 'Story Rule:',
      storyRule:
        'Work both 6-hour overnight shifts until 6:00 AM, uncover the rumors of the missing former employee, and stay alert when someone watches from the shadows.',
      shiftMemo: 'Shift Memo',
      employeeRoutine: 'Employee Routine',
      memoItems: [
        'Night 1: Talk to John to take over the shift, clock in, clean tables, collect trash, shutdown kitchen fryers, and serve late guests.',
        'Night 2: Talk to John about the missing staff member, flip maintenance breaker, mop hallway, recycle cardboard, check drive-thru, CCTV, and serve guests.',
        'Flashlight has unlimited power; check the new restroom west of the dining lobby if needed.',
        'If kitchen lights flicker while cooking, finish the 5-second prep calmly.',
      ],
      settingsTitle: 'Game Settings',
      graphicsQuality: 'Graphics Quality',
      qualityLevels: { low: 'LOW', medium: 'MEDIUM', high: 'HIGH' },
      audioVolume: 'Audio Volume',
      mouseSensitivity: 'Mouse Sensitivity',
      invertLook: 'Invert Look (Y-Axis)',
      crtFilter: 'Retro CRT Filter',
      enabled: 'ENABLED',
      disabled: 'DISABLED',
      applyClose: 'Apply & Close',
      controlsTitle: 'Controls',
      controlsList: [
        { key: 'W, A, S, D', desc: 'Walk / Move' },
        { key: 'Mouse Look', desc: 'Aim & Pan Camera' },
        { key: 'Shift', desc: 'Sprint / Run' },
        { key: 'C', desc: 'Crouch' },
        { key: 'F', desc: 'Toggle Flashlight (Unlimited)' },
        { key: 'E', desc: 'Talk to John / Customers / Complete Tasks' },
        { key: 'ESC', desc: 'Pause Menu / Return from CCTV' },
      ],
      understood: 'Understood',
      creditsTitle: 'Credits & Lore',
      creditsIntro:
        "McDonald's Nightfall is a 2-night slow-burn mascot horror experience.",
      creditsDetails: [
        { label: 'Theme', value: 'Late-night fast-food observation & psychological dread' },
        { label: 'Format', value: '2 Full Playable Nights (12:00 AM – 6:00 AM)' },
        { label: 'Engine', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Story Direction', value: 'Uncover what happened to the missing former night-shift worker.' },
      ],
      returnMenu: 'Return to Menu',
      versionLabel: 'Version 1.4.0',
    },
    hud: {
      nightShiftEmployee: (night) => `Night ${night} Shift — Employee: Duck`,
      stepLabel: (step) => `Step ${step}`,
      allDutiesDone: 'All duties completed for this shift!',
      shiftClock: 'Shift Clock',
      dawnLabel: 'DAWN (6:00 AM)',
      closingLabel: 'CLOSING AT 6:00 AM',
      escPause: 'ESC / PAUSE',
      stamina: 'Stamina',
      stance: 'STANCE:',
      crouched: '[C] CROUCHED',
      standing: '[C] STANDING',
      carryingFood:
        '🍗 Carrying Finished Dish Tray — Place on the Serving Counter Table for the Guest',
      carryingRawFry:
        '🥩 Holding Raw Chicken & Potatoes — Put into the Fryer Machine (5s)',
      carryingBigMac:
        '🍔 Holding Big Mac — Put into the Kitchen Microwave (5s)',
      carryingCoffeeCup:
        '☕ Holding Coffee Cup — Put into the Coffee Machine on Counter (3s)',
      carryingSodaCup:
        '🥤 Holding Soda Cup — Put into the Soft Drink Dispenser (3s)',
      carryingSpoiledFood:
        '⚠️ Spoiled Food Tray in Hand (Power went out!) — Throw it into the Trash Bin or Dumpster',
      carryingChickenTray:
        '❄️ Carrying Chicken Tray from Freezer — Restock at Kitchen Prep Counter',
      carryingNoodlesAndDrink:
        '🍜 Carrying Cup Noodles & Red Energy Drink — Head to Duck’s Car outside',
      carryingMop: '🧹 Holding Commercial Mop — Clean all 8 dirty puddles on the floor',
      carryingTrash: '📦 Carrying Dining Trash Bags (Take to rear dumpster)',
      carryingCardboard: '📦 Carrying Cardboard Bundle (Take to rear dumpster)',
      heavyWorklight: 'Heavy Worklight [F]',
      unlimited: 'UNLIMITED',
      status: 'STATUS:',
      beamActive: 'BEAM ACTIVE',
      beamOff: 'BEAM OFF',
      phoneHint: 'PHONE [P]',
    },
    pause: {
      title: 'GAME PAUSED',
      resume: 'Resume Shift',
      restartNight: 'Restart Night',
      mainMenu: 'Main Menu',
      volume: 'Volume',
      sensitivity: 'Sensitivity',
    },
    dialogue: {
      internal: '(Internal)',
      internalThoughts: 'Internal Thoughts',
      transmitting: 'Transmitting...',
      received: 'Received',
      scrambled: 'Scrambled transmission...',
      pressHint: 'Press [E], Space, or Click',
      skip: '[E] Skip',
      skipBtn: 'Skip',
      next: '[E] Next',
      close: '[E] Close',
      continueBtn: 'Continue',
    },
    cctv: {
      rec: 'REC',
      header: "MCDONALD'S SECURITY SURVEILLANCE FEED",
      live: 'LIVE',
      exitOffice: 'EXIT TO OFFICE [ESC]',
      anomalies: '⚠️ MULTIPLE MOTION ANOMALIES DETECTED',
      signal: 'SIGNAL INTEGRITY: 94%',
      matrixTitle: 'Camera Terminal Matrix',
      switchHint: 'Keys [1] - [5] to switch',
      cameras: [
        { id: 1, name: 'CAM 01', label: 'MAIN DINING AREA' },
        { id: 2, name: 'CAM 02', label: 'CASHIER COUNTER' },
        { id: 3, name: 'CAM 03', label: 'KITCHEN PREP' },
        { id: 4, name: 'CAM 04', label: 'REAR TRASH DUMPSTER' },
        { id: 5, name: 'CAM 05', label: 'PARKING LOT & ROAD' },
      ],
    },
    mobile: {
      touchOn: '🎮 TOUCH ON',
      pcControls: '⌨️ PC CONTROLS',
      move: 'MOVE',
      crouch: 'CROUCH',
      light: 'LIGHT',
      pause: 'PAUSE',
      run: 'RUN',
      running: 'RUNNING',
      action: 'ACTION',
      phone: 'PHONE',
    },
    phone: {
      title: 'DUCK PHONE',
      carrier: 'NIGHTCALL 4G',
      back: 'Back',
      close: 'Close [P]',
      apps: { calls: 'Calls', messages: 'Messages', camera: 'Camera' },
      emergencyBanner: 'TRAPPED IN CAR — CALL 911 & TEXT JOHN FOR HELP!',
      emergencyDone: '911 & John alerted! Stay low inside the car...',
      contacts: {
        mom: 'Mom',
        landlord: 'Mr. Henderson (Landlord)',
        john: 'John (Coworker)',
        police: '911 Emergency Dispatch',
      },
      callsTab: {
        callBtn: 'Call',
        callingStatus: (name) => `Dialing ${name}...`,
        connectedStatus: (name) => `Connected — ${name}`,
        momLine:
          "Duckie? Calling during the graveyard shift? Keep the doors locked and come straight home once you're off!",
        landlordLine:
          "Rent is overdue, Duck. Don't make me leave another eviction notice on your door Friday morning.",
        policeReady:
          "911 Emergency: Stay locked inside your car and keep your head down—units are racing to Highway 9 McDonald's now!",
        policeIdle: '911 Emergency Dispatch. Use only for an active emergency.',
        calledPoliceBadge: '911 Called',
      },
      messagesTab: {
        sendEmergencyJohn: 'Text John: SOS! Killer Clown Outside My Car!',
        sentToJohnBadge: 'Sent to John',
        momThread: [
          { from: 'Mom', time: '11:42 PM', text: 'Did you bring your warm jacket? Forecast said heavy fog near Highway 9.' },
          { from: 'Duck', time: '11:45 PM', text: 'Yeah Mom, just got to work. Love you.' },
        ],
        landlordThread: [
          { from: 'Landlord', time: '6:15 PM', text: 'Reminder: $850 rent is still unpaid. Have it by tomorrow afternoon.' },
        ],
        johnThread: [
          { from: 'John', time: '12:08 AM', text: 'Watch the side glass if the lobby lights flicker. Text me if anything sketchy happens.' },
        ],
        johnHelpOutgoing:
          'JOHN HELP!! That killer clown chased me to my car, the tank is empty and he just cracked my window!! Calling 911 right now!',
        johnHelpReply:
          'HOLD ON DUCK!! Lock the doors and duck down below the windows—I already called the sheriff and I am driving back with help right now!',
      },
      cameraTab: {
        takePhoto: 'Take Photo',
        retake: 'Capture New Shot',
        emptyGallery: 'No photos saved yet. Frame your view and tap Take Photo.',
        savedCount: (n) => `${n} saved photo(s)`,
      },
    },
    night3CarChoice: {
      title: 'WINDOW CRACKED — WHAT DO YOU DO?',
      subtitle: 'The car is out of gas. The clown laughed and walked back toward the shadows.',
      optionExit: 'Get out of the car',
      optionExitSub: 'Step back out into the parking lot on foot',
      optionHide: 'Hide in the car & call Police + text John',
      optionHideSub: 'Duck down inside the cabin and call for rescue on your phone',
    },
    victory: {
      night1Over: 'Overnight Shift 1 Finished',
      theFirstShift: 'THE FIRST SHIFT',
      night1Story1:
        'Duck clocked out and stepped through the automatic sliding doors into the damp morning air.',
      night1Story2:
        'When Duck turned around and glanced through the front glass window, the clown mascot was standing in the dark dining room, perfectly still, staring straight toward the exit.',
      night1Sub: "He didn't chase Duck. He didn't move. He just watched.",
      beginNight2: 'Begin Night 2: Something is Wrong',
      mainMenu: 'Main Menu',
      night2Over: 'Overnight Shift 2 Finished',
      theSecondShift: 'THE SECOND SHIFT',
      night2Story1:
        'At 6:00 AM, Duck handed off the morning ledger and hurried out past the empty booths toward the damp parking lot.',
      night2Story2:
        'Yet he could not shake the face peeking through the front glass door during the final order—or the whispers about the former employee who never clocked out.',
      night2Sub: 'By the time Duck turned back toward the counter, the figure by the door was already gone.',
      beginNight3: 'Continue to Night 3',
      playNight2Again: 'Play Night 2 Again',
      playAgain: 'Play Night 1 Again',
    },
    night3Ending: {
      scrollingMessage:
        "Note: When the police arrived, they still couldn't catch that clown, only to find me terrified in the car, and the car window was cracked and stained with his blood.\n\nI made it home just in time, who was that clown? Could that clown have noticed me? I can't quit my job because I haven't paid my rent yet. If I quit, I'll be homeless. Oh well, never mind...",
      badEndingTitle: 'ENDING BAD',
      badEndingMessage:
        'Ending Bad. You were caught by that clown and turned into fried chicken, a favorite dish among customers. Actually, the clown statue was the clown himself, standing motionless like a statue for two nights as if nothing had happened.',
      pressToFinishTyping: 'Click or press Space / E to reveal message',
      continueToCredits: 'Continue',
      demoOverTitle: 'DEMO OVER',
      demoOverSubtitle: "THE DEMO IS OVER — MCDONALD'S NIGHTFALL",
      creditsHeading: 'CREDITS',
      creditRows: [
        { role: 'Created & Directed By', name: 'Nguyen Duck' },
        { role: '3D World & Engine', name: 'Three.js WebGL Architecture' },
        { role: 'Audio & Horror Ambience', name: 'Web Audio Synthesis & Shift OST' },
        { role: 'Character Cast', name: 'Duck, John, Nurse Ramirez, Big Ray, Baby Leopards & The Clown' },
      ],
      thankYouNote: 'Thank you for playing the McDonald’s Nightfall Demo. Full shifts coming soon.',
      returnToMenu: 'Return to Main Menu',
    },
    engine: {
      steps: {
        talk_to_john: {
          title: 'TALK TO JOHN',
          description: 'Head inside through the sliding doors and talk to outgoing employee John to take over the night shift.',
        },
        clock_in: {
          title: 'CLOCK IN',
          description: 'Walk to the employee time clock near the counter and punch in for your shift.',
        },
        clean_tables: {
          title: 'CLEAN TABLES',
          description: (count) => `Wipe down and sanitize the dirty dining tables (${count}/2).`,
        },
        mop_puddles: {
          title: 'MOP DIRTY PUDDLES',
          description: (count) =>
            `Pick up the mop from the Security Office corner and mop all dirty puddles (${count}/8).`,
        },
        collect_trash: {
          title: 'COLLECT TRASH',
          description: (count) => `Collect fast-food trash bags from the dining area (${count}/2).`,
        },
        dump_trash: {
          title: 'TAKE TRASH OUTSIDE',
          description: 'Take the trash outside through the rear kitchen door to the dumpster.',
        },
        kitchen_fryers: {
          title: 'CHECK KITCHEN',
          description: 'Power down the kitchen fryers and heating equipment.',
        },
        check_cctv: {
          title: 'INSPECT SECURITY',
          description: 'Inspect the security office CCTV surveillance console.',
        },
        finish_shift: {
          title: 'SURVIVE UNTIL 6:00 AM',
          description: 'Preparation complete. Customers are arriving. Attend to customer orders and survive until 6:00 AM.',
          ready6am: 'It is 6:00 AM! Clock out and exit through the front doors.',
        },
        n2_clock_in: {
          title: 'CLOCK IN',
          description: 'Clock in for Night 2 shift at the employee time clock.',
        },
        n2_breaker: {
          title: 'MAINTENANCE BREAKER',
          description: 'Flip the auxiliary maintenance breaker in the security office.',
        },
        n2_mop_puddle: {
          title: 'MOP DIRTY PUDDLES',
          description: (count) =>
            `Grab the mop from the Security Office corner and clean all 8 dirty puddles (${count}/8).`,
        },
        n2_cardboard: {
          title: 'RECYCLE CARDBOARD',
          description: 'Take bundled cardboard boxes outside to the rear dumpster.',
          carryDesc: 'Toss cardboard waste into outdoor dumpster.',
        },
        n2_drive_thru: {
          title: 'DRIVE-THRU WINDOW CHECK',
          description: 'Inspect the transparent drive-thru service window along the east wall.',
        },
        n2_cctv_final: {
          title: 'CHECK SURVEILLANCE',
          description: 'Inspect the security office cameras before closing up.',
        },
        n3_clock_in: {
          title: 'CLOCK IN',
          description: 'Punch your employee time card near the counter for Night 3.',
        },
        n3_clean_tables: {
          title: 'WIPE DINING TABLES',
          description: (count) => `Clean the smudged dining booths (${count}/2). Strange that the clown statue vanished.`,
        },
        n3_kitchen_check: {
          title: 'PREPARE KITCHEN FRYERS',
          description: 'Flip the kitchen fryer switch to get the chicken station ready.',
        },
      },
      dynamicObjectives: {
        preparingTitle: 'PREPARING GUEST ORDER...',
        preparingDesc: (sec) => `Cooking & brewing in kitchen (${sec}s remaining). Lights flickering!`,
        prepFoodTitle: 'PREPARE GUEST FOOD',
        prepFoodDesc: (name) =>
          `Go to kitchen, cook food & brew coffee for ${name} (wait 5 seconds).`,
        serveTitle: 'SERVE GUEST ORDER',
        serveDesc: (name) => `Deliver the hot meal tray in hand to ${name} at the front counter.`,
        serveDriveThruDesc: (name) =>
          `Bring the hot meal tray to ${name} waiting at the Drive-Thru window.`,
        restockFreezerTitle: 'GET CHICKEN TRAY FROM FREEZER',
        restockFreezerDesc:
          'Kitchen is out of chicken! Enter the Walk-In Freezer (behind kitchen) and grab a Chicken Tray.',
        restockKitchenTitle: 'RESTOCK KITCHEN FOOD',
        restockKitchenDesc:
          'Carry the Chicken Tray in your hands back to the kitchen prep counter to restock.',
        checkBathroomTitle: 'CHECK THE BATHROOM',
        checkBathroomDesc:
          'A strange knocking sound came from the bathroom! Go inside and check who is there.',
        powerOutageTitle: 'CHECK ELECTRICAL BOX (3:00 AM)',
        powerOutageDesc: 'The power suddenly went out! Go outside behind the back of the store and inspect the electrical box.',
        powerOutageWithFoodDesc:
          'Power went out and the guest walked out! Check the electrical box out back and throw the food in the trash.',
        discardFoodTitle: 'THROW FOOD IN TRASH',
        discardFoodDesc:
          'The customer left during the power outage. Throw the leftover food in your hands into the kitchen trash bin or dumpster.',
        hungerFadeTitle: 'HUNGRY AFTER SHIFT',
        hungerFadeDesc: 'Heading over to 67-Eleven to grab something to eat before going home...',
        store67NoodlesTitle: 'GO TO NOODLES & WATER STALL',
        store67NoodlesDesc:
          'Walk inside 67-Eleven to the NOODLES & WATER aisle and grab noodles and a red energy drink.',
        store67CashierTitle: 'PAY AT 67-ELEVEN COUNTER',
        store67CashierDesc: 'Bring your noodles and red energy drink to the 67-Eleven employee to pay.',
        store67CarTitle: 'RETURN TO DUCK’S CAR',
        store67CarDesc: 'Walk outside 67-Eleven to your parked blue car to end the night shift.',
        goToMcdCarTitle: 'GET IN DUCK’S CAR & DRIVE HOME',
        goToMcdCarDesc: 'The clown is standing inside watching you and laughing! Hurry outside to your dark blue car and drive straight home.',
        pickupFryTitle: 'STEP 1: PICK UP RAW CHICKEN & POTATOES',
        pickupFryDesc: (name) =>
          `Grab raw chicken and potatoes in your hands at the kitchen prep table for ${name}.`,
        fryChickenTitle: 'STEP 2: PUT IN FRYER MACHINE',
        fryChickenDesc: (name) =>
          `Put the chicken and potatoes from your hands into the Fryer Machine for ${name} (5s).`,
        fryingProgressTitle: 'FRYING CHICKEN & FRIES...',
        fryingProgressDesc: (sec) => `Sizzling & smoking in the fryer (${sec}s left)...`,
        pickupBurgerTitle: 'STEP 3: PICK UP BIG MAC',
        pickupBurgerDesc: (name) =>
          `Pick up the Big Mac from the kitchen prep counter for ${name}.`,
        microwaveTitle: 'STEP 4: PUT BIG MAC IN MICROWAVE',
        microwaveDesc: (name) =>
          `Put the Big Mac from your hands into the Microwave for ${name} (5s).`,
        microwavingProgressTitle: 'MICROWAVING BIG MAC...',
        microwavingProgressDesc: (sec) => `Heating Big Mac inside microwave (${sec}s left)...`,
        pickupCoffeeCupTitle: 'DRINK STEP: TAKE COFFEE CUP',
        pickupCoffeeCupDesc: (name) =>
          `Grab an empty coffee cup in your hand at the kitchen prep table for ${name}.`,
        coffeeMachineTitle: 'MAKE COFFEE AT COFFEE MACHINE',
        coffeeMachineDesc: (name) =>
          `Put the coffee cup into the Coffee Machine for ${name} and wait 3 seconds.`,
        brewingCoffeeProgressTitle: 'BREWING COFFEE...',
        brewingCoffeeProgressDesc: (sec) => `Brewing hot McCafé coffee (${sec}s left)...`,
        pickupSodaCupTitle: 'DRINK STEP: TAKE SODA CUP',
        pickupSodaCupDesc: (name) =>
          `Grab an empty soda cup in your hand at the kitchen prep table for ${name}.`,
        sodaDispenserTitle: 'POUR SODA AT SOFT DRINK DISPENSER',
        sodaDispenserDesc: (name) =>
          `Put the cup into the Soft Drink Dispenser for ${name} and wait 3 seconds.`,
        pouringSodaProgressTitle: 'POURING SOFT DRINK...',
        pouringSodaProgressDesc: (sec) => `Filling cup at soft drink dispenser (${sec}s left)...`,
        wrapFoodTitle: 'BRING EVERYTHING TO KITCHEN TABLE & WRAP UP',
        wrapFoodDesc: (name) =>
          `Bring all food & drinks back to the kitchen prep table and wrap the order up properly for ${name} (2s).`,
        wrappingProgressTitle: 'WRAPPING ORDER...',
        wrappingProgressDesc: (sec) => `Wrapping food & drinks neatly at the kitchen table (${sec}s left)...`,
        pickupFinishedTitle: 'TAKE FINISHED DISH FROM KITCHEN TABLE',
        pickupFinishedDesc: (name) =>
          `Pick up the finished dish from the kitchen table and place it on the counter table for ${name}.`,
        night3CarEmergencyTitle: 'HIDE & CALL FOR HELP',
        night3CarEmergencyDesc:
          'Stay hidden inside your car! Open Phone [P] to call Police (911) and text John for help.',
      },
      notices: {
        completed: (title) => `COMPLETED: ${title}`,
        newTaskPrep: (name) => `NEW TASK: PREPARE FOOD FOR ${name.toUpperCase()}`,
        orderCompleted: (price) => `ORDER COMPLETED: $${price}`,
        prepStarted: 'PREPARING GUEST ORDER... (5s remaining)',
        prepInProgress: (sec) => `Cooking in progress (${sec}s remaining)... Please wait!`,
        mealInHands: 'Meal is already in your hands! Deliver it to the guest.',
        noPendingOrders: 'No pending orders to cook right now. Wait for a guest to order.',
        orderReady: 'ORDER READY! Delivered to your hands. Bring it to the guest.',
        shiftEnds6am: (timeStr) =>
          `Shift ends strictly at 6:00 AM. Current time is ${timeStr}. Please attend to customer orders until dawn.`,
        shiftSkipped6am: 'LAST GUEST SERVED — SHIFT CLOCK SKIPPED TO 6:00 AM!',
        powerOutage: '⚡ 3:00 AM POWER OUTAGE — CHECK THE ELECTRICAL BOX BEHIND THE STORE!',
        powerRestored: '⚡ POWER RESTORED — CIRCUIT BREAKER RESET',
        mopPickedUp: '🧹 PICKED UP MOP — CLEAN ALL 8 DIRTY PUDDLES',
        mopRequired: '⚠️ YOU NEED THE MOP FIRST! Grab it from the Security Office corner.',
        foodDiscarded: '🗑️ LEFTOVER FOOD THROWN IN THE TRASH',
        discardFoodFirst: '⚠️ THROW THE SPOILED FOOD IN YOUR HANDS INTO THE TRASH FIRST!',
        outOfFood: '❄️ KITCHEN OUT OF CHICKEN! GO TO THE WALK-IN FREEZER!',
        chickenTrayPickedUp: '🍗 PICKED UP CHICKEN TRAY — BRING IT TO THE KITCHEN COUNTER!',
        kitchenRestocked: '✅ KITCHEN RESTOCKED WITH FRESH CHICKEN!',
        restockFoodFirst: '⚠️ OUT OF FOOD! Grab a Chicken Tray from the Walk-In Freezer first.',
        bathroomKnock: '🚪 KNOCKING SOUND FROM THE BATHROOM! GO CHECK!',
        bathroomNothingHere: 'Nothing checked — the bathroom is empty.',
        driveThruArrived: '🚗 A DRIVER PULLED UP TO THE DRIVE-THRU WINDOW!',
        duckHungry: '🍜 DUCK IS HUNGRY — HEADING TO 67-ELEVEN!',
        arrived67Eleven: '🏪 ARRIVED AT 67-ELEVEN — CHECK THE NOODLES & WATER STALL',
        pickedUpNoodlesDrink: '🥤 GRABBED NOODLES & RED ENERGY DRINK — PAY AT THE COUNTER',
        paidAt67Eleven: '💵 PAID $10 — HEAD TO DUCK’S CAR TO END THE NIGHT',
        statueMoved: '🤡 THE CLOWN STATUE VANISHED... JOHN HAS NO IDEA WHERE IT WENT.',
        clownWatchingCar: '🤡 THE CLOWN IS WATCHING FROM INSIDE THE SHOP! HURRY TO DUCK’S CAR!',
        rawFryInHand: '🥩 HOLDING RAW CHICKEN & POTATOES — PUT THEM INTO THE FRYER MACHINE!',
        needRawFryInHand: '⚠️ TAKE RAW CHICKEN & POTATOES IN YOUR HANDS FROM THE KITCHEN COUNTER FIRST!',
        fryStarted: '🍟 PUT IN FRYER! FRYING CHICKEN & POTATOES... (5s)',
        fryDone: '✅ FRIES & CHICKEN DONE! TAKE THE BIG MAC FROM THE KITCHEN COUNTER!',
        bigMacInHand: '🍔 HOLDING BIG MAC — PUT IT INTO THE MICROWAVE!',
        needBigMacInHand: '⚠️ TAKE THE BIG MAC IN YOUR HANDS FROM THE KITCHEN COUNTER FIRST!',
        coffeeCupInHand: '☕ HOLDING COFFEE CUP — PUT IT IN THE COFFEE MACHINE (3s)!',
        needCoffeeCupInHand: '⚠️ TAKE A COFFEE CUP IN YOUR HAND FROM THE KITCHEN COUNTER FIRST!',
        coffeeStarted: '☕ BREWING COFFEE AT COFFEE MACHINE... (3s)',
        coffeeDone: '✅ COFFEE READY! PROCEED TO THE NEXT KITCHEN STEP!',
        sodaCupInHand: '🥤 HOLDING SODA CUP — PUT IT IN THE SOFT DRINK DISPENSER (3s)!',
        needSodaCupInHand: '⚠️ TAKE A SODA CUP IN YOUR HAND FROM THE KITCHEN COUNTER FIRST!',
        sodaStarted: '🥤 POURING SODA AT SOFT DRINK DISPENSER... (3s)',
        sodaDone: '✅ SODA POURED! BRING EVERYTHING BACK TO THE KITCHEN TABLE TO WRAP!',
        microwaveStarted: '📡 PUT BIG MAC IN MICROWAVE... HEATING (5s)',
        microwaveDone: '🔔 MICROWAVE DING! CHECK THE NEXT STEP AT THE KITCHEN TABLE!',
        wrapStarted: '📦 WRAPPING EVERYTHING AT KITCHEN TABLE... (2s)',
        dishOnKitchenTable: '🍽️ DISH FINISHED ON KITCHEN TABLE! PICK IT UP AND PLACE ON COUNTER TABLE!',
        night3CarNoGas: '⛽ OUT OF GAS! THE ENGINE REFUSES TO START!',
        night3WindowCracked: '💥 THE DRIVER WINDOW CRACKED FROM HIS IMPACT!',
        night3PoliceOnWay: '🚓 911 & JOHN ALERTED — POLICE SIRENS INCOMING!',
      },
      prompts: {
        talkToJohn: '[E] Talk to John (Take Over Shift)',
        deliverMeal: (name) => `[E] Deliver Hot Meal to ${name}`,
        talkAwaiting: (name) => `[E] Talk to ${name} (Awaiting Order)`,
        takeOrder: (name) => `[E] Take Order from ${name}`,
        driveThruTakeOrder: (name) => `[E] Take Drive-Thru Order (${name})`,
        driveThruDeliverMeal: (name) => `[E] Hand Meal Through Drive-Thru Window (${name})`,
        talkSilas: '[E] Talk to Silas (Regular Customer)',
        cookingKitchen: (sec) => `⏳ Cooking Food in Kitchen (${sec}s remaining)...`,
        cookKitchen: '[E] Cook Food in Kitchen & Brew Coffee (5s)',
        pickUpChickenTray: '[E] Pick Up Chicken Tray from Freezer',
        restockChickenTray: '[E] Restock Kitchen with Chicken Tray',
        inspectElectricalBox: '[E] Inspect Electrical Box & Flip Circuit Breaker',
        throwFoodInTrash: '[E] Throw Food in Trash',
        pickUpMop: '[E] Pick Up Mop',
        mopPuddle: '[E] Mop Dirty Puddle',
        mopRequiredPrompt: '⚠️ Pick up Mop in Security Office corner first!',
        takeNoodlesAndDrink: '[E] Take Cup Noodles & Red Energy Drink (Noodles & Water Stall)',
        talkCashier67: '[E] Pay 67-Eleven Employee ($10)',
        enterDuckCar: "[E] Get in Duck's Car (End Night Shift)",
        enterMcdDuckCar: "[E] Get in Duck's Car & Drive Straight Home",
        takeRawFry: '[E] Take Raw Chicken & Potatoes in Hand',
        takeBigMac: '[E] Take Big Mac in Hand',
        takeCoffeeCup: '[E] Take Coffee Cup in Hand',
        takeSodaCup: '[E] Take Soda Cup in Hand',
        takeFinishedDish: '[E] Pick Up Finished Dish from Kitchen Table',
        placeDishOnTable: '[E] Place Finished Dish on Serving Table',
        useFryer: '[E] Put Chicken & Potatoes into Fryer Machine (5s)',
        fryingNow: (sec) => `🍟 Frying Chicken & Potatoes (${sec}s)...`,
        useMicrowave: '[E] Put Big Mac into Microwave (5s)',
        microwavingNow: (sec) => `📡 Microwaving Big Mac (${sec}s)...`,
        useCoffeeMachine: '[E] Put Cup in Coffee Machine (3s)',
        brewingCoffeeNow: (sec) => `☕ Brewing Coffee (${sec}s)...`,
        useSodaDispenser: '[E] Put Cup in Soft Drink Dispenser (3s)',
        pouringSodaNow: (sec) => `🥤 Pouring Soda (${sec}s)...`,
        wrapFoodCounter: '[E] Bring Everything Back & Wrap Order Properly (2s)',
        wrappingNow: (sec) => `📦 Wrapping Food (${sec}s)...`,
        actions: {
          employee_john: 'Talk to John (Take Over Shift)',
          time_clock: 'Punch Employee Time Clock',
          clean_table_1: 'Wipe & Sanitize Table 1',
          clean_table_2: 'Wipe & Sanitize Table 2',
          trash_bag_1: 'Pick Up Dining Trash Bag',
          trash_bag_2: 'Pick Up Dining Trash Bag',
          outdoor_dumpster: 'Dump Trash into Outdoor Dumpster',
          trash_bin: 'Throw Food in Trash',
          kitchen_switch: 'Shut Down Kitchen Fryers & Heating',
          office_switch: 'Turn On Auxiliary Hallway Lights',
          cctv_monitor: 'Access Security CCTV Monitor',
          front_door_exit: 'Clock Out & Leave Through Front Door',
          mop_tool: 'Pick Up Mop',
          hallway_spill: 'Mop & Clean Dirty Puddle',
          cardboard_bundle: 'Pick Up Bundled Cardboard Stack',
          drive_thru_window: 'Inspect Drive-Thru Service Window',
          drive_thru_order_station: 'Check Drive-Thru Headset & Terminal',
          freezer_chicken_tray: 'Pick Up Chicken Tray from Freezer',
          fryer_machine: 'Fry Chicken & Potatoes in Fryer',
          kitchen_microwave: 'Heat Big Mac in Microwave',
          coffee_machine: 'Brew Coffee in Coffee Machine',
          soda_dispenser: 'Pour Soda in Soft Drink Dispenser',
          serve_table_spot: 'Place Finished Dish on Serving Table',
          electrical_box: 'Inspect Electrical Box & Restore Power',
          toilet_flush: 'Flush Toilet',
          store_67_noodle_stall: 'Take Noodles & Red Energy Drink',
          store_67_cashier: 'Pay 67-Eleven Employee ($10)',
          store_67_car: "Get into Duck's Car",
          mcd_duck_car: "Get into Duck's Car & Drive Home",
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Another night at this place… standing out here in the cold mist.' },
        { speaker: 'Duck', text: 'Minimum wage, dark woods, and a 6-hour shift. John should still be inside waiting to hand over the shift.' },
        { speaker: 'Duck', text: "Let's head through the sliding doors and talk to John." },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Back for Night 2… The parking lot and forest feel unusually silent tonight.' },
        { speaker: 'Duck', text: "John is still inside by the counter. Let's head through the sliding doors and talk to him." },
      ],
      openingMonologueNight3: [
        { speaker: 'Duck', text: 'Another night of work… Why do I keep coming back to this place?' },
        { speaker: 'Duck', text: "Rent is due this week, so I don't have a choice. Let's go inside and talk to John." },
      ],
      johnDialogue: [
        { speaker: 'John', text: 'Yo! New employee! Are you new here?' },
        { speaker: 'Duck', text: 'Yeah, so what?' },
        { speaker: 'John', text: "Haha, easy there! My shift's finally over, so I'm handing everything off to you." },
        { speaker: 'John', text: 'Listen up — here is everything you need to do during the night shift.' },
        { speaker: 'John', text: 'First, punch in at the employee time clock near the counter. Then wipe down the dirty dining tables and bag up the leftover trash.' },
        { speaker: 'John', text: 'Carry the trash bags out the rear kitchen door to the dumpster, shut down the fryers, and check the security office CCTV monitor.' },
        { speaker: 'John', text: 'After midnight, guests will visit both the counter and the Drive-Thru window. Take their order, cook in the kitchen for 5 seconds, and serve them. If chicken runs low, grab a tray from the walk-in freezer behind the kitchen!' },
        { speaker: 'John', text: "One more warning... if the kitchen lights start flickering while you're cooking, don't panic. And don't stare too long at the clown mascot. See ya at 6 AM!" },
        { speaker: 'Duck', text: "Weird guy... Alright, let's punch the time clock and get through this shift." },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Oh, hey Duck. Glad you actually came back for Night 2.' },
        { speaker: 'Duck', text: 'Yeah, well, bills do not pay themselves. Everything quiet tonight?' },
        { speaker: 'John', text: 'Mostly... except management just posted another notice in the back. Still zero word about the former night-shift guy who vanished last week.' },
        { speaker: 'Duck', text: 'The guy I replaced? Wait—he went missing right here?' },
        { speaker: 'John', text: 'Police found his car near the edge of the trees with his uniform cap still on the dash. Boss told us not to bring it up in front of customers, though everyone around town is talking.' },
        { speaker: 'John', text: 'Anyway, same drill tonight: punch in, flip the office breaker, mop those puddles, haul out the cardboard, inspect the drive-thru window, check CCTV, and serve both lobby and drive-thru guests until 6:00 AM.' },
        { speaker: 'Duck', text: 'Great... a missing former coworker and another midnight shift. See you at dawn, John.' },
      ],
      johnDialogueNight3: [
        { speaker: 'John', text: 'Hey Duck… glad you made it in for another night.' },
        { speaker: 'Duck', text: 'Wait a second, John. Where did the clown statue near the cash register go?' },
        { speaker: 'John', text: 'Beats me—that freaked me out too. It was already completely gone before I even unlocked the doors tonight.' },
        { speaker: 'Duck', text: 'Gone? Nobody took it for repairs or moved it to storage?' },
        { speaker: 'John', text: 'I honestly have no idea where it went. No work order, no maintenance crew, nobody on the security log.' },
        { speaker: 'John', text: "Just punch in, wipe down the front tables, switch on the kitchen fryers, and keep an eye on whoever walks in tonight. Don't stay a second past closing." },
        { speaker: 'Duck', text: 'A giant fiberglass statue just vanishes out of a locked building… Okay. Goodnight, John.' },
      ],
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: "WTF!, what's going on? Did the boss not pay the electricity bill? I don't know I'll go to the back of the store and check.",
        },
      ],
      customerPowerOutageLeave:
        "Oh my god, what the hell? This won't do, I'm not buying food anymore, I'm leaving.",
      powerRestoredDialogue: [
        {
          speaker: 'Duck',
          text: "Huh, someone switched off the circuit breaker, it wasn't a power outage.",
        },
      ],
      warehouseClownReactionDialogue: [
        {
          speaker: 'Duck',
          text: 'Who was that guy who just looked at me? Oh well, the electricity is fixed now anyway.',
        },
      ],
      outOfFoodDialogue: [
        {
          speaker: 'Duck',
          text: "Hold on—we just ran completely out of chicken at the prep table! Let me head into the walk-in freezer behind the kitchen and grab a fresh chicken tray.",
        },
      ],
      bathroomKnockDialogue:
        "What's that sound in the bathroom? Nobody's here at this hour, I have to go check.",
      bathroomEmptyDialogue:
        'Nothing checked... completely empty. Could have sworn someone was knocking on that stall door.',
      duckHungerDialogue: [
        {
          speaker: 'Duck',
          text: "Ah, I'm so hungry! I should buy something before my shift ends.",
        },
      ],
      clerk67Dialogue: [
        {
          speaker: '67-Eleven Employee',
          text: 'Your total is $10, thank you.',
        },
      ],
      clownCustomerName: 'The Clown',
      clownCustomerTitle: 'Uninvited Midnight Guest',
      clownCustomerOrderItem: 'Crispy Fried Chicken',
      clownBuyChickenDialogue: [
        {
          speaker: 'The Clown',
          text: 'Heh… heh… good evening, little yellow feather behind the glass.',
        },
        {
          speaker: 'Duck',
          text: 'Uh… can I help you, sir? Why are you dressed like—wait, do I know you?',
        },
        {
          speaker: 'The Clown',
          text: 'So noisy when the fryers hiss, so quiet when the bulbs die out. I came to buy your fried chicken… crisp… warm… golden skin.',
        },
        {
          speaker: 'Duck',
          text: 'Right… one order of crispy fried chicken. Give me five seconds in the kitchen…',
        },
        {
          speaker: 'The Clown',
          text: 'Take all the time you need, Duck. I never hurry when I am watching.',
        },
      ],
      clownChickenDeliveredDialogue: (price) => [
        {
          speaker: 'Duck',
          text: `Here is your fried chicken… that will be $${price}.`,
        },
        {
          speaker: 'The Clown',
          text: 'Heh heh heh… smelled it all the way from the dark trees. Do not worry about the statue in the corner… it prefers a better view of the counter.',
        },
        {
          speaker: 'The Clown',
          text: 'Drive safe going home, little employee. I will stand right here inside and watch you walk to your car.',
        },
      ],
      clownWatchingCarMonologue: [
        {
          speaker: 'Duck',
          text: 'He is just standing inside the glass doors staring at me and laughing… I need to get to my car and drive straight home right now!',
        },
      ],
      night3CarNoGasDialogue: [
        {
          speaker: 'Duck',
          text: 'Damn, why did the car out of gas right now!',
        },
      ],
      night3CarPostAttackDialogue: [
        {
          speaker: 'Duck',
          text: "Mf! He's crazy, does he really want to kill me?",
        },
      ],
      waitRestockDialogue: (customerName) => [
        {
          speaker: 'Duck',
          text: `Give me just one minute, ${customerName}! We just ran out of chicken up front—I'm grabbing a fresh tray from the freezer right now.`,
        },
      ],
      thankYouDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Thank you so much, Duck! Here's $${price} for the food. Keep the change!`,
        },
        {
          speaker: 'Duck',
          text: 'Thank you! Enjoy your meal and stay safe out there tonight.',
        },
      ],
      grumpyDeliveredDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `About time! Took you forever back there. Here's $${price}—don't expect a tip or a smile at 3 in the morning.`,
        },
        {
          speaker: 'Duck',
          text: '...Right. Not even a thank you. Have a nice night anyway, sir.',
        },
      ],
      friendsSeatedDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Awesome, looks piping hot! Here's $${price}, Duck. Thanks a ton!`,
        },
        {
          speaker: 'Leo',
          text: "Let's grab that corner booth and eat fast before heading straight to the internet cafe!",
        },
        {
          speaker: 'Duck',
          text: 'Enjoy the snacks, Baby Leopards! Try not to let your moms catch you sneaking back in.',
        },
      ],
      waitingOrderDialogue: (customerName, itemText) => [
        {
          speaker: customerName,
          text: `Still waiting on my ${itemText}, please! Smells good back there.`,
        },
        {
          speaker: 'Duck',
          text: "Cooking it at the kitchen prep counter right now! It'll only take 5 seconds.",
        },
      ],
      customers: [
        {
          name: 'Nurse Ramirez',
          title: 'Exhausted Night-Shift Worker',
          orderItem: 'Big Mac Meal with Hot McCafé Coffee & Fries',
          dialogue: [
            { speaker: 'Nurse Ramirez', text: 'Hey... please tell me the coffee pot is still hot. Just wrapped a brutal 14-hour ER shift.' },
            { speaker: 'Duck', text: "Freshly brewed five minutes ago. Night shifts really drain your soul, don't they?" },
            { speaker: 'Nurse Ramirez', text: 'You have no idea. Honestly... it feels quieter than a morgue in here tonight. The road outside was dead empty.' },
            { speaker: 'Duck', text: "Yeah, usually I get rowdy kids. Tonight it's just me, the fryers, and that creepy clown mascot sitting by the booths." },
            { speaker: 'Nurse Ramirez', text: 'Keep the front doors locked if you can, kid. Something in the air out there feels completely off.' },
            { speaker: 'Duck', text: 'Corporate policy says 24/7 lobby access. Even if a ghost clown attacks, management would dock my pay.' },
            { speaker: 'Nurse Ramirez', text: 'Anyway, can I get a Big Mac meal with hot coffee and fries? I am completely starving.' },
            { speaker: 'Duck', text: "Coming right up! I'll prepare that for you back in the kitchen." },
          ],
        },
        {
          name: 'Tyler',
          title: 'Jittery Teenager',
          orderItem: '10-Piece Chicken McNuggets with Fries & Sprite',
          dialogue: [
            { speaker: 'Tyler', text: 'Yo... bro. Bro! Did you see that?! Did that Ronald clown statue over in the dining booth just turn its head?!' },
            { speaker: 'Duck', text: "It's hollow plastic and fiberglass bolted into the linoleum. It doesn't move, Tyler." },
            { speaker: 'Tyler', text: 'I swear on my life it was facing the window when I parked my car! Now its head is tilted straight toward the register!' },
            { speaker: 'Duck', text: "I make eight bucks an hour. Even if that clown comes to life, I don't get paid enough to run." },
            { speaker: 'Tyler', text: "I'm grabbing my food to go. Can I get a 10-piece McNuggets combo with BBQ sauce and a large Sprite?" },
            { speaker: 'Duck', text: "Right on it. I'll get your nuggets and fries cooking right away in the kitchen." },
          ],
        },
        {
          name: 'Old Man Silas',
          title: 'Cryptic Regular',
          orderItem: 'Hot Black Tea & Baked Apple Pie',
          dialogue: [
            { speaker: 'Old Man Silas', text: "He doesn't care for the fluorescent buzz, young man. He only listens when the tubes start to flicker." },
            { speaker: 'Duck', text: "Sir, if you're ordering food, I'm ready at the register." },
            { speaker: 'Old Man Silas', text: 'Forty years ago, this ground belonged to the woods. The painted smiles in greasepaint never really wash away.' },
            { speaker: 'Duck', text: 'Right. Look, Silas, the burgers are beef and the clown is resin. What can I get started for you?' },
            { speaker: 'Old Man Silas', text: 'A hot black tea and a warm baked apple pie, young duck. Keep the tea piping hot.' },
            { speaker: 'Duck', text: 'Understood. Heading into the kitchen to prepare your tea and apple pie now.' },
          ],
        },
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
        {
          name: 'Maya Lin',
          title: 'Insomniac College Student',
          orderItem: 'Iced McCafé Mocha & Spicy Crispy Chicken Sandwich',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Hey... tell me you guys still have espresso shots running? Cramming a thesis paper at 2 AM was a terrible idea.' },
            { speaker: 'Duck', text: 'McCafé machine is hot and loud. Rough night for finals?' },
            { speaker: 'Maya Lin', text: 'Worse—my headlights clipped something tall by the pine trees turning into the lot, then my phone dropped straight to zero bars.' },
            { speaker: 'Duck', text: 'Lots of wildlife near this clearing. Deer, raccoons... hopefully not clowns.' },
            { speaker: 'Maya Lin', text: 'Wait, what? Anyway, let me get an iced mocha and a spicy crispy chicken sandwich to keep me awake.' },
            { speaker: 'Duck', text: "On it! I'll fry the chicken and pour the espresso in the kitchen." },
          ],
        },
        {
          name: 'EMT Carter',
          title: 'Night-Shift Paramedic',
          orderItem: 'Fried Chicken Bucket & Double Espresso',
          dialogue: [
            { speaker: 'EMT Carter', text: 'Quiet night at Station 4, figured I would swing by on patrol. Just you holding down the register?' },
            { speaker: 'Duck', text: 'Just me and the grease traps until 6 AM. Anything crazy on the ambulance radio tonight?' },
            { speaker: 'EMT Carter', text: 'Three false 911 static calls pinging from payphones along this highway stretch—nobody talking, just breathing and a carnival horn.' },
            { speaker: 'Duck', text: 'Okay, that definitely beats screaming customers for creep factor.' },
            { speaker: 'EMT Carter', text: 'Keep your doors well lit, kid. Can I grab a crispy fried chicken bucket and a double coffee?' },
            { speaker: 'Duck', text: 'Coming right up! Five seconds at the kitchen station.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Lost Highway Traveler',
          orderItem: 'Hot Caramel Latte & Apple Pie',
          dialogue: [
            { speaker: 'Clara Novak', text: 'Excuse me... my GPS completely lost satellite lock ten miles back. Is this still Highway 9?' },
            { speaker: 'Duck', text: 'Yes ma’am, dead stretch of Highway 9. The forest blocks most signals out here at night.' },
            { speaker: 'Clara Novak', text: 'I swear I drove past your red sign twice already, like the road loops back into these woods.' },
            { speaker: 'Duck', text: 'Deep fog plays tricks on drivers around here. Want something warm before getting back on the road?' },
            { speaker: 'Clara Novak', text: 'A hot caramel latte and a warm apple pie sounds wonderful. Thank you.' },
            { speaker: 'Duck', text: "Brewing it right now—I'll bring your tray out shortly." },
          ],
        },
      ],
      customersNight2: [
        {
          name: 'Nurse Ramirez',
          title: 'Exhausted Night-Shift Worker',
          orderItem: 'Hot McCafé Coffee & Crispy Chicken Bucket',
          dialogue: [
            { speaker: 'Nurse Ramirez', text: "Evening, kid. Wait—you're covering nights alone now? I kept expecting to see Marcus behind the counter." },
            { speaker: 'Duck', text: "Marcus? That's the former night-shift guy everyone's talking about, right?" },
            { speaker: 'Nurse Ramirez', text: 'Yeah. He came into the ER two weeks ago looking pale, swearing somebody kept tapping on the restroom mirror after 3 AM. Then he just vanished.' },
            { speaker: 'Duck', text: 'Nobody told me about that when I signed the paperwork...' },
            { speaker: 'Nurse Ramirez', text: 'Be careful tonight. Can I get a hot McCafé coffee and crispy chicken? I need to stay awake on the drive home.' },
            { speaker: 'Duck', text: "Right away. I'll cook it in the kitchen now." },
          ],
        },
        {
          name: 'Tyler',
          title: 'Jittery Teenager',
          orderItem: '10-Piece McNuggets & Large Fries',
          dialogue: [
            { speaker: 'Tyler', text: 'Bro, did you hear the local news on the radio? They are STILL searching the woods behind this McDonald’s for the missing night employee!' },
            { speaker: 'Duck', text: 'Yeah, John just mentioned his uniform cap turned up near the trees.' },
            { speaker: 'Tyler', text: "My cousin used to hang out here late. He swears the missing guy saw a tall red-haired clown outside the glass doors right before his shift ended." },
            { speaker: 'Duck', text: 'Okay, stop trying to freak me out while I am stuck here until 6 AM. What are you ordering?' },
            { speaker: 'Tyler', text: '10-piece McNuggets and large fries to go—I am not staying inside for one extra second!' },
            { speaker: 'Duck', text: 'Got it. Five seconds in the kitchen, hang tight.' },
          ],
        },
        {
          name: 'Deputy Vance',
          title: 'Late-Night Patrol Officer',
          orderItem: 'Black Coffee & Quarter Pounder Meal',
          dialogue: [
            { speaker: 'Deputy Vance', text: "Slow patrol tonight. Mind if I grab a black coffee? Checking on this place since it's the last spot Marcus clocked into before he disappeared." },
            { speaker: 'Duck', text: 'You guys still do not have any leads on what happened to him?' },
            { speaker: 'Deputy Vance', text: 'The security logs from his final night were corrupted after 3 AM, and the manager refused to hand over the spare keys to the woods trail. Stay sharp.' },
            { speaker: 'Duck', text: "I'll keep my eyes on the doors and cameras. Want anything else with the coffee?" },
            { speaker: 'Deputy Vance', text: 'Throw in a Quarter Pounder meal. Keep watching that front entrance, alright?' },
            { speaker: 'Duck', text: 'On it. Heading back to the kitchen to prepare your meal.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Jolly Plumber & Midnight Regular',
          orderItem: 'Fried Chicken Bucket & Hot Espresso',
          dialogue: [
            { speaker: 'Big Ray', text: "Mamma mia! Back again, my favorite night-shift duck! Wahoo!" },
            { speaker: 'Duck', text: 'Hey Big Ray! Late emergency pipe job again tonight?' },
            { speaker: 'Big Ray', text: "You betcha! Unclogged a giant green sink over on Main Street—just watch your own bathroom pipes tonight, okie-dokie?" },
            { speaker: 'Duck', text: 'Thanks for the heads-up. Same super order as usual?' },
            { speaker: 'Big Ray', text: "Sì! One big fried chicken bucket and a piping hot espresso! Let's-a go!" },
            { speaker: 'Duck', text: "Right on it, Big Ray! Five seconds in the kitchen." },
          ],
        },
        {
          name: 'Maya Lin',
          title: 'Insomniac College Student',
          orderItem: 'Hot McCafé Mocha & McNuggets',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Wait—you are new, right? There was a flyer taped to the campus bulletin board looking for the employee who disappeared here.' },
            { speaker: 'Duck', text: 'Yeah... Marcus. Every single customer tonight seems to know more about him than our manager.' },
            { speaker: 'Maya Lin', text: 'A friend who studies late here told me Marcus stopped coming to class the exact morning his car turned up near the pine line.' },
            { speaker: 'Duck', text: 'I really wish John had mentioned that before handing me the apron.' },
            { speaker: 'Maya Lin', text: 'Stay near the register lights. Can I get a hot mocha and McNuggets to go?' },
            { speaker: 'Duck', text: 'Right away. Five seconds in the kitchen.' },
          ],
        },
        {
          name: 'EMT Carter',
          title: 'Night-Shift Paramedic',
          orderItem: 'Spicy Chicken Meal & Black Coffee',
          dialogue: [
            { speaker: 'EMT Carter', text: 'Still on solo night duty? Dispatch just circulated an updated missing-person bulletin for Marcus from this address.' },
            { speaker: 'Duck', text: 'They found anything else besides his car and hat?' },
            { speaker: 'EMT Carter', text: 'A flashlight battery rolling outside the back service door and footprints deeper in the mud—nothing else.' },
            { speaker: 'Duck', text: 'Great. And I still have to take trash bags back there.' },
            { speaker: 'EMT Carter', text: 'Keep your head on a swivel tonight. Hook me up with a spicy chicken meal and black coffee.' },
            { speaker: 'Duck', text: 'Cooking it now—sit tight.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Lost Highway Traveler',
          orderItem: 'Hot Tea & Crispy Chicken Bucket',
          dialogue: [
            { speaker: 'Clara Novak', text: 'I stopped at the gas station two miles east and the clerk warned me nobody should be inside this McDonald’s after 2 AM.' },
            { speaker: 'Duck', text: 'Let me guess—because of the guy who vanished on the night shift?' },
            { speaker: 'Clara Novak', text: 'He said the clerk before you kept complaining someone in greasepaint was watching him through the front glass doors.' },
            { speaker: 'Duck', text: '...Just what I needed to hear before clock-out. What can I prepare for you?' },
            { speaker: 'Clara Novak', text: 'Just hot tea and a crispy chicken bucket so I can get back on the highway fast.' },
            { speaker: 'Duck', text: 'Coming right out from the kitchen.' },
          ],
        },
        {
          name: 'Baby Leopards',
          title: 'Late-Night Friends Group',
          orderItem: 'Party Fried Chicken Bucket, 3 Iced Coffees & Large Fries',
          dialogue: [
            { speaker: 'Sam', text: 'Shhh! Keep your voices down—I barely climbed out my bedroom window without my mom waking up!' },
            { speaker: 'Mia', text: 'Haha, worth it! If my mom finds out we snuck out past midnight again, we are totally grounded for a month!' },
            { speaker: 'Leo', text: "Relax, we're the Baby Leopards! Let's grab late-night snacks here fast, then hit the internet cafe until sunrise!" },
            { speaker: 'Duck', text: 'Sounds like a wild night, guys. Want to eat here before heading to the internet cafe?' },
            { speaker: 'Sam', text: 'Yep! One huge fried chicken bucket, extra fries, and three coffees—we will eat quick at the corner booth!' },
            { speaker: 'Duck', text: 'Coming right up! Give me five seconds in the kitchen.' },
          ],
        },
        {
          name: 'Arthur Crump',
          title: 'Grumpy Late-Night Customer',
          orderItem: 'Black Coffee & Plain Burger',
          dialogue: [
            { speaker: 'Arthur Crump', text: 'Hmph. Finally somebody behind the register. Do you know how freezing that parking lot is?' },
            { speaker: 'Duck', text: 'Sorry about the weather, sir. What can I get for you tonight?' },
            { speaker: 'Arthur Crump', text: 'Spare me the small talk. Everybody around town yapping about some missing clerk and haunted forest... nonsense.' },
            { speaker: 'Duck', text: 'Got it. Just food then—what would you like?' },
            { speaker: 'Arthur Crump', text: 'Strong black coffee and a plain burger. Make it hot and don’t waste my time.' },
            { speaker: 'Duck', text: '...Sure thing. Five seconds in the kitchen.' },
          ],
        },
      ],
      customersNight3: [
        {
          name: 'Detective Hall',
          title: 'Homicide & Missing Persons Detective',
          orderItem: 'Black Coffee & Crispy Fried Chicken Meal',
          dialogue: [
            { speaker: 'Detective Hall', text: 'Evening, Duck. After last night’s patrol reports, Marcus’s disappearance here is officially an open county case on our desk.' },
            { speaker: 'Duck', text: 'Wait—officially? So management finally stopped sweeping what happened to Marcus under the rug?' },
            { speaker: 'Detective Hall', text: 'Couldn’t hide it anymore once his torn apron turned up behind the dumpster. By the way… wasn’t there a life-size clown statue bolted near your register?' },
            { speaker: 'Duck', text: 'Yeah! It completely vanished before John even opened tonight. Nobody knows who moved it.' },
            { speaker: 'Detective Hall', text: 'A missing employee and a missing six-foot mascot out of a locked building… Watch those glass doors. Give me a black coffee and crispy fried chicken.' },
            { speaker: 'Duck', text: 'Right away, Detective. Five seconds in the kitchen.' },
          ],
        },
        {
          name: 'Reporter Zoe',
          title: 'Late-Night Investigative Journalist',
          orderItem: 'Spiced Iced Latte & 10-Piece McNuggets',
          dialogue: [
            { speaker: 'Reporter Zoe', text: 'Hey—you must be Duck. Ever since people started talking openly about Marcus last night, my tip line has been blowing up about this place.' },
            { speaker: 'Duck', text: 'Everyone keeps asking about Marcus, and now the giant clown statue by our counter is straight-up gone too.' },
            { speaker: 'Reporter Zoe', text: 'Wait, the clown mascot is missing?! Marcus wrote in his last notebook entry that the statue looked taller every time the bulbs flickered at 3 AM.' },
            { speaker: 'Duck', text: 'Please tell me you’re kidding… I’m still here alone until closing.' },
            { speaker: 'Reporter Zoe', text: 'Stay near the lights and keep your phone charged. Can I get an iced latte and 10-piece McNuggets before I drive down the highway?' },
            { speaker: 'Duck', text: 'Coming right up. Five seconds at the prep counter.' },
          ],
        },
        {
          name: 'Deputy Vance',
          title: 'County Sheriff Deputy',
          orderItem: 'Black Coffee & Spicy Chicken Sandwich',
          dialogue: [
            { speaker: 'Deputy Vance', text: 'Checking back in after Night 2, Duck. Forensics finally pulled prints off Marcus’s car—and they aren’t his.' },
            { speaker: 'Duck', text: 'Whose prints were on Marcus’s car?!' },
            { speaker: 'Deputy Vance', text: 'Thick greasepaint residue mixed with fryer oil. Lock the back door right after trash duty and stay out of the trees.' },
            { speaker: 'Duck', text: 'Got it, Deputy. Want your usual black coffee and something hot?' },
            { speaker: 'Deputy Vance', text: 'Black coffee and a spicy chicken sandwich. Make it quick so I can sweep the highway perimeter.' },
            { speaker: 'Duck', text: 'On it right now—five seconds in the kitchen.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Jolly Plumber & Midnight Regular',
          orderItem: 'Crispy Fried Chicken Bucket & Double Espresso',
          dialogue: [
            { speaker: 'Big Ray', text: "Wahoo! Night three and Duck is still standing tall! Wait a second—where did that tall red-haired clown statue go?!" },
            { speaker: 'Duck', text: 'Honestly, Big Ray, it disappeared before I clocked in tonight. Nobody knows who took it.' },
            { speaker: 'Big Ray', text: "Mamma mia! Maybe it jumped down a giant green warp pipe like a Goomba! Still, creepy empty corner you got now!" },
            { speaker: 'Duck', text: 'Yeah, the lobby feels way too quiet without it. Same super order tonight?' },
            { speaker: 'Big Ray', text: "You know it! One crispy fried chicken bucket and a super-hot double espresso! Let's-a go!" },
            { speaker: 'Duck', text: 'Coming right up, Big Ray! Five seconds in the kitchen.' },
          ],
        },
        {
          name: 'Baby Leopards',
          title: 'Late-Night Friends Group',
          orderItem: 'Party Fried Chicken Bucket, 3 Sodas & Large Fries',
          dialogue: [
            { speaker: 'Sam', text: 'Whoa, check out the corner—that creepy giant clown statue is totally gone tonight!' },
            { speaker: 'Mia', text: 'Good! That thing gave me nightmares every time we snuck out here past midnight!' },
            { speaker: 'Leo', text: 'Forget the statue, Baby Leopards need fuel before a full-night tournament at the internet cafe!' },
            { speaker: 'Duck', text: 'You guys never sleep, huh? Same big snack bucket?' },
            { speaker: 'Sam', text: 'Yep! Crispy chicken bucket, large fries, and three cold sodas!' },
            { speaker: 'Duck', text: 'Five seconds in the kitchen—hang tight!' },
          ],
        },
      ],
      driveThruCustomers: [
        {
          name: 'Driver Mike',
          title: 'Drive-Thru Commuter',
          orderItem: 'Crispy Chicken Combo & Black Coffee',
          dialogue: [
            { speaker: 'Driver Mike', text: 'Hey! Good thing your drive-thru window is still open at this hour.' },
            { speaker: 'Duck', text: 'Welcome to the drive-thru! What can I get started for you tonight?' },
            { speaker: 'Driver Mike', text: 'One crispy chicken combo and a hot black coffee—long night shift down at the rail yard.' },
            { speaker: 'Duck', text: "Got it! Pull tight at the window, I'll cook it in 5 seconds." },
          ],
        },
        {
          name: 'Courier Hana',
          title: 'Late-Night Delivery Driver',
          orderItem: 'Fried Chicken Bucket & Iced Mocha',
          dialogue: [
            { speaker: 'Courier Hana', text: 'Evening! Thought I spotted someone standing near your trash fence while pulling into the drive-thru lane...' },
            { speaker: 'Duck', text: 'Probably just shadows from the pines. What are you ordering tonight?' },
            { speaker: 'Courier Hana', text: 'A fried chicken bucket and hot coffee to stay awake on my last parcel run!' },
            { speaker: 'Duck', text: 'Coming right up! Give me five seconds in the kitchen.' },
          ],
        },
        {
          name: 'Taxi Driver Ben',
          title: 'Midnight Cab Driver',
          orderItem: 'Double Cheeseburger & McCafé Latte',
          dialogue: [
            { speaker: 'Taxi Driver Ben', text: 'Whew, fog on Highway 9 is thicker than pea soup! Mind passing dinner through the window?' },
            { speaker: 'Duck', text: 'Not at all! What can I whip up for you?' },
            { speaker: 'Taxi Driver Ben', text: 'Crispy chicken meal and a hot latte so I make it home in one piece.' },
            { speaker: 'Duck', text: 'Five seconds at the fryer and espresso machine—be right back!' },
          ],
        },
      ],
    },
  },

  vi: {
    languageName: 'Tiếng Việt',
    languageLabel: 'Ngôn ngữ',
    loading: {
      badge: 'Giao thức khởi động hệ thống',
      subtitle: 'Bản Demo Kinh Dị Tâm Lý 2 Đêm',
      messages: [
        'Đang kết nối lưới điện cửa hàng…',
        'Đang hiệu chỉnh cửa kính trượt tự động & cảm biến…',
        'Đang kiểm tra hệ thống an ninh & ma trận camera CCTV…',
        'Đang khởi tạo nhật ký bàn giao ca đêm…',
        'Đang chuẩn bị ca trực đêm của bạn…',
        'Đang mở cửa nhà hàng…',
      ],
      footerHints: ['Cửa trượt tự động', 'AI Khách hàng ghé thăm', 'Âm thanh môi trường'],
    },
    menu: {
      est: 'TỪ 1955',
      nightShift: 'Ca Trực Đêm',
      survivalHorror: 'Trải Nghiệm Kinh Dị Sinh Tồn',
      outsideClearing: 'Bãi Đỗ Xe Ngoài Trời',
      storeActive: '● Cửa Hàng Đang Mở',
      description:
        "Vào vai Vịt (Duck) trong ca trực nửa đêm tại một cửa hàng McDonald's cô độc giữa khu rừng rậm u ám. Nhận bàn giao từ John, chuẩn bị đồ ăn cho khách, sống sót đến 6:00 sáng và cảnh giác với những bóng đen bên ngoài.",
      tipBefore: 'Mẹo: Nhấn',
      tipRun: 'để chạy trên PC, hoặc chạm',
      tipMobile: 'trên điện thoại!',
      playNight1: 'CHƠI ĐÊM 1',
      firstShift: 'Ca Trực Đầu Tiên',
      playNight2: 'CHƠI ĐÊM 2',
      playNight3: 'CHƠI ĐÊM 3',
      locked: '(ĐÃ KHÓA)',
      somethingWrong: 'Có Điều Bất Ổn',
      theFinalDemoNight: 'Tượng Đã Di Chuyển',
      bgmLabel: 'Nhạc nền: Cold Glass Passage',
      unmute: 'BẬT NHẠC',
      musicOn: 'ĐANG PHÁT',
      controls: 'Điều khiển',
      settings: 'Cài đặt',
      credits: 'Thông tin',
      storyRuleLabel: 'Quy tắc cốt truyện:',
      storyRule:
        'Hoàn thành cả 2 ca trực 6 tiếng đến 6:00 sáng, lần theo tin đồn về cựu nhân viên mất tích và cảnh giác với bóng người rình rập ngoài cửa.',
      shiftMemo: 'Ghi Chú Ca Trực',
      employeeRoutine: 'Quy Trình Nhân Viên',
      memoItems: [
        'Đêm 1: Nói chuyện với John để nhận ca, bấm thẻ giờ, lau bàn, thu gom rác, tắt bếp chiên và phục vụ khách khuya.',
        'Đêm 2: Nói chuyện với John về nhân viên mất tích, gạt cầu dao bảo trì, lau vết bẩn hành lang, bỏ thùng carton, kiểm tra drive-thru, CCTV và phục vụ khách.',
        'Đèn pin dùng không giới hạn; bạn có thể ghé nhà vệ sinh mới ở phía tây sảnh ăn.',
        'Nếu đèn bếp nhấp nháy lúc nấu đồ ăn, hãy bình tĩnh chờ hết 5 giây.',
      ],
      settingsTitle: 'Cài Đặt Trò Chơi',
      graphicsQuality: 'Chất Lượng Đồ Họa',
      qualityLevels: { low: 'THẤP', medium: 'TRUNG BÌNH', high: 'CAO' },
      audioVolume: 'Âm Lượng',
      mouseSensitivity: 'Độ Nhạy Chuột',
      invertLook: 'Đảo Ngược Trục Y',
      crtFilter: 'Bộ Lọc CRT Cổ Điển',
      enabled: 'BẬT',
      disabled: 'TẮT',
      applyClose: 'Áp Dụng & Đóng',
      controlsTitle: 'Phím Điều Khiển',
      controlsList: [
        { key: 'W, A, S, D', desc: 'Di chuyển' },
        { key: 'Chuột', desc: 'Xoay góc nhìn' },
        { key: 'Shift', desc: 'Chạy nhanh' },
        { key: 'C', desc: 'Ngồi xuống / Đứng lên' },
        { key: 'F', desc: 'Bật / Tắt Đèn Pin (Vô hạn)' },
        { key: 'E', desc: 'Nói chuyện với John / Khách / Làm nhiệm vụ' },
        { key: 'ESC', desc: 'Tạm dừng / Thoát màn hình CCTV' },
      ],
      understood: 'Đã Hiểu',
      creditsTitle: 'Thông Tin & Cốt Truyện',
      creditsIntro:
        "McDonald's Nightfall là trải nghiệm kinh dị tâm lý 2 đêm trực ca muộn.",
      creditsDetails: [
        { label: 'Chủ đề', value: 'Trực đêm tiệm đồ ăn nhanh & nỗi sợ tâm lý' },
        { label: 'Định dạng', value: '2 Đêm chơi đầy đủ (12:00 AM – 6:00 AM)' },
        { label: 'Công nghệ', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Hướng truyện', value: 'Tìm hiểu chuyện đã xảy ra với cựu nhân viên ca đêm mất tích.' },
      ],
      returnMenu: 'Quay Lại Menu',
      versionLabel: 'Phiên bản 1.4.0',
    },
    hud: {
      nightShiftEmployee: (night) => `Ca Đêm ${night} — Nhân viên: Duck`,
      stepLabel: (step) => `Bước ${step}`,
      allDutiesDone: 'Đã hoàn thành mọi nhiệm vụ trong ca trực!',
      shiftClock: 'Đồng Hồ Ca Trực',
      dawnLabel: 'BÌNH MINH (6:00 SÁNG)',
      closingLabel: 'TAN CA LÚC 6:00 SÁNG',
      escPause: 'ESC / TẠM DỪNG',
      stamina: 'Thể Lực',
      stance: 'TƯ THẾ:',
      crouched: '[C] ĐANG NGỒI',
      standing: '[C] ĐANG ĐỨNG',
      carryingFood:
        '🍗 Đang Bưng Đĩa Đồ Ăn Hoàn Thành — Đặt lên Bàn Quầy Phục Vụ cho khách',
      carryingRawFry:
        '🥩 Đang Cầm Gà Sống & Khoai Tây — Bỏ vào Máy Chiên (5 giây)',
      carryingBigMac:
        '🍔 Đang Cầm Bánh Big Mac — Bỏ vào Lò Vi Sóng (5 giây)',
      carryingCoffeeCup:
        '☕ Đang Cầm Ly Cà Phê — Đặt vào Máy Pha Cà Phê trên quầy (3 giây)',
      carryingSodaCup:
        '🥤 Đang Cầm Ly Nước Ngọt — Đặt vào Máy Rót Nước Ngọt (3 giây)',
      carryingSpoiledFood:
        '⚠️ Khay Đồ Ăn Bị Hỏng (Mất điện!) — Mang bỏ vào thùng rác trong bếp hoặc ngoài trời',
      carryingChickenTray:
        '❄️ Đang Bưng Khay Thịt Gà Từ Tủ Đông — Mang ra quầy bếp bổ sung',
      carryingNoodlesAndDrink:
        '🍜 Đang Cầm Mì Ly & Nước Tăng Lực Đỏ — Đi ra xe của Duck bên ngoài',
      carryingMop: '🧹 Đang Cầm Cây Lau Nhà — Lau sạch cả 8 vũng nước bẩn trên sàn',
      carryingTrash: '📦 Đang Xách Túi Rác (Mang ra thùng rác phía sau)',
      carryingCardboard: '📦 Đang Ôm Thùng Carton (Mang ra thùng rác phía sau)',
      heavyWorklight: 'Đèn Pin Công Nghiệp [F]',
      unlimited: 'VÔ HẠN',
      status: 'TRẠNG THÁI:',
      beamActive: 'ĐANG BẬT',
      beamOff: 'ĐÃ TẮT',
      phoneHint: 'ĐIỆN THOẠI [P]',
    },
    pause: {
      title: 'TẠM DỪNG',
      resume: 'Tiếp Tục Ca Trực',
      restartNight: 'Chơi Lại Đêm Này',
      mainMenu: 'Menu Chính',
      volume: 'Âm Lượng',
      sensitivity: 'Độ Nhạy',
    },
    dialogue: {
      internal: '(Suy nghĩ)',
      internalThoughts: 'Suy Nghĩ Nội Tâm',
      transmitting: 'Đang phát...',
      received: 'Hoàn tất',
      scrambled: 'Tín hiệu nhiễu...',
      pressHint: 'Nhấn [E], Space hoặc Chạm',
      skip: '[E] Bỏ qua',
      skipBtn: 'Bỏ qua',
      next: '[E] Tiếp',
      close: '[E] Đóng',
      continueBtn: 'Tiếp tục',
    },
    cctv: {
      rec: 'GHI',
      header: "HỆ THỐNG GIÁM SÁT AN NINH MCDONALD'S",
      live: 'TRỰC TIẾP',
      exitOffice: 'QUAY LẠI PHÒNG [ESC]',
      anomalies: '⚠️ PHÁT HIỆN NHIỀU CHUYỂN ĐỘNG BẤT THƯỜNG',
      signal: 'TÍN HIỆU ỔN ĐỊNH: 94%',
      matrixTitle: 'Bảng Chọn Camera',
      switchHint: 'Phím [1] - [5] để chuyển',
      cameras: [
        { id: 1, name: 'CAM 01', label: 'KHU ĂN UỐNG CHÍNH' },
        { id: 2, name: 'CAM 02', label: 'QUẦY THU NGÂN' },
        { id: 3, name: 'CAM 03', label: 'KHU CHẾ BIẾN BẾP' },
        { id: 4, name: 'CAM 04', label: 'THÙNG RÁC PHÍA SAU' },
        { id: 5, name: 'CAM 05', label: 'BÃI XE & ĐƯỜNG LỚN' },
      ],
    },
    mobile: {
      touchOn: '🎮 CẢM ỨNG BẬT',
      pcControls: '⌨️ CHẾ ĐỘ PC',
      move: 'DI CHUYỂN',
      crouch: 'NGỒI',
      light: 'ĐÈN',
      pause: 'DỪNG',
      run: 'CHẠY',
      running: 'ĐANG CHẠY',
      action: 'TƯƠNG TÁC',
      phone: 'ĐIỆN THOẠI',
    },
    phone: {
      title: 'ĐIỆN THOẠI CỦA DUCK',
      carrier: 'NIGHTCALL 4G',
      back: 'Quay lại',
      close: 'Đóng [P]',
      apps: { calls: 'Cuộc gọi', messages: 'Tin nhắn', camera: 'Máy ảnh' },
      emergencyBanner: 'ĐANG MẮC KẸT TRONG XE — GỌI CẢNH SÁT (911) & NHẮN JOHN CỨU!',
      emergencyDone: 'Đã báo Cảnh sát & John! Hãy cúi thấp người trốn trong xe...',
      contacts: {
        mom: 'Mẹ',
        landlord: 'Ông Henderson (Chủ trọ)',
        john: 'John (Đồng nghiệp)',
        police: 'Tổng đài Cảnh sát 911',
      },
      callsTab: {
        callBtn: 'Gọi',
        callingStatus: (name) => `Đang gọi ${name}...`,
        connectedStatus: (name) => `Đã kết nối — ${name}`,
        momLine: 'Duck à? Sao giờ này còn gọi cho mẹ? Khóa chặt cửa rồi tan ca về thẳng nhà nhé con!',
        landlordLine: 'Tiền phòng quá hạn rồi đấy cậu nhóc. Đừng để tôi phải chốt khóa cửa trước thứ Sáu.',
        policeReady: 'Tổng đài 911: Hãy chốt chặt cửa ở yên trong xe và cúi thấp xuống—xe tuần tra đang lao tới McDonald’s Quốc lộ 9 ngay!',
        policeIdle: 'Đường dây khẩn cấp 911. Chỉ gọi khi gặp nguy hiểm tính mạng thực sự.',
        calledPoliceBadge: 'Đã gọi 911',
      },
      messagesTab: {
        sendEmergencyJohn: 'Nhắn John: CỨU VỚI! Chú hề sát nhân ngoài xe!',
        sentToJohnBadge: 'Đã nhắn John',
        momThread: [
          { from: 'Mẹ', time: '11:42 PM', text: 'Con mang áo khoác ấm chưa? Đêm nay ngoài đường sương mù lạnh lắm.' },
          { from: 'Duck', time: '11:45 PM', text: 'Con mang rồi mẹ, con vừa tới chỗ làm.' },
        ],
        landlordThread: [
          { from: 'Chủ trọ', time: '6:15 PM', text: 'Nhắc nhẹ: $850 tiền nhà quá hạn rồi. Chiều mai thu đủ nhé.' },
        ],
        johnThread: [
          { from: 'John', time: '12:08 AM', text: 'Nhớ để ý cửa kính nếu đèn sảnh chớp tắt nhé. Có gì lạ cứ nhắn tin cho tôi.' },
        ],
        johnHelpOutgoing:
          'JOHN CỨU TÔI!! Tên chú hề điên đuổi theo tôi ra tận xe, xe lại hết sạch xăng và hắn vừa đập nứt kính cửa rồi!! Tôi đang gọi cảnh sát!',
        johnHelpReply:
          'GIỮ BÌNH TĨNH DUCK!! Khóa chặt cửa cúi thấp xuống dưới cửa kính—tôi đã báo cảnh sát trưởng và đang phóng xe quay lại cứu cậu ngay!',
      },
      cameraTab: {
        takePhoto: 'Chụp Ảnh',
        retake: 'Chụp Ảnh Mới',
        emptyGallery: 'Chưa có ảnh nào. Hãy xoay góc nhìn và bấm Chụp Ảnh.',
        savedCount: (n) => `Đã lưu ${n} ảnh`,
      },
    },
    night3CarChoice: {
      title: 'KÍNH XE ĐÃ NỨT — BẠN SẼ LÀM GÌ?',
      subtitle: 'Xe đã hết sạch xăng. Gã chú hề vừa cười man rợ vừa lùi lại vào bóng tối.',
      optionExit: 'Ra khỏi xe bỏ chạy',
      optionExitSub: 'Mạo hiểm mở cửa chạy bộ qua bãi đỗ xe',
      optionHide: 'Trốn trong xe, gọi Cảnh sát & nhắn tin John',
      optionHideSub: 'Cúi thấp trốn trong khoang xe và dùng điện thoại gọi cứu viện',
    },
    victory: {
      night1Over: 'Kết Thúc Ca Trực Đêm 1',
      theFirstShift: 'CA TRỰC ĐẦU TIÊN',
      night1Story1:
        'Duck bấm thẻ tan ca và bước qua cửa kính trượt tự động ra ngoài không khí buổi sáng ẩm ướt.',
      night1Story2:
        'Khi Duck ngoái lại nhìn qua ô cửa kính phía trước, linh vật chú hề đang đứng trong khu vực ăn uống tối om, bất động hoàn toàn, nhìn chằm chằm thẳng về phía lối ra.',
      night1Sub: 'Hắn không đuổi theo Duck. Hắn không nhúc nhích. Hắn chỉ đứng nhìn.',
      beginNight2: 'Bắt Đầu Đêm 2: Có Điều Bất Ổn',
      mainMenu: 'Menu Chính',
      night2Over: 'Kết Thúc Ca Trực Đêm 2',
      theSecondShift: 'CA TRỰC THỨ HAI',
      night2Story1:
        'Đúng 6:00 sáng, Duck ghi sổ bàn giao ca sáng và vội vã bước qua những dãy bàn trống ra bãi đỗ xe ẩm ướt.',
      night2Story2:
        'Nhưng cậu vẫn không thể quên khuôn mặt lén thò đầu nhìn vào từ cửa kính chính lúc phục vụ vị khách cuối cùng — cũng như lời bàn tán về cựu nhân viên chưa từng bấm thẻ tan ca.',
      night2Sub: 'Khi Duck giao xong đồ ăn và ngoái nhìn ra cửa, bóng dáng kia đã biến mất không dấu vết.',
      beginNight3: 'Tiếp Tục Sang Đêm 3',
      playNight2Again: 'Chơi Lại Đêm 2',
      playAgain: 'Chơi Lại Đêm 1',
    },
    night3Ending: {
      scrollingMessage:
        'Ghi chú: Khi cảnh sát tới nơi, họ vẫn không thể bắt được gã hề đó, chỉ tìm thấy tôi đang hoảng loạn trong xe, còn kính xe thì bị nứt toác và dính đầy máu của hắn.\n\nCuối cùng mình cũng về kịp tới nhà, gã chú hề đó là ai vậy? Liệu gã chú hề đó có để ý thấy mình không? Mình không thể nghỉ việc được vì mình vẫn chưa trả tiền thuê nhà. Nếu nghỉ việc, mình sẽ thành kẻ vô gia cư mất. Thôi kệ vậy, đừng nghĩ nữa...',
      badEndingTitle: 'KẾT THÚC XẤU (ENDING BAD)',
      badEndingMessage:
        'Kết thúc xấu. Bạn đã bị gã chú hề đó bắt được và biến thành gà rán — món ăn khoái khẩu của các thực khách. Thực ra, bức tượng chú hề chính là bản thân gã chú hề đó, suốt hai đêm qua hắn đã đứng bất động như một pho tượng như thể chưa hề có chuyện gì xảy ra.',
      pressToFinishTyping: 'Nhấn chuột hoặc Space / E để hiện hết dòng chữ',
      continueToCredits: 'Tiếp tục',
      demoOverTitle: 'HẾT BẢN DEMO',
      demoOverSubtitle: "BẢN DEMO ĐÃ KẾT THÚC — MCDONALD'S NIGHTFALL",
      creditsHeading: 'DANH SÁCH THỰC HIỆN',
      creditRows: [
        { role: 'Sáng Tạo & Đạo Diễn', name: 'Nguyen Duck' },
        { role: 'Thế Giới 3D & Engine', name: 'Three.js WebGL Architecture' },
        { role: 'Âm Thanh & Nhạc Nền', name: 'Web Audio Synthesis & Shift OST' },
        { role: 'Nhân Vật Trong Game', name: 'Duck, John, Y tá Ramirez, Big Ray, Hội Báo Con & Chú Hề' },
      ],
      thankYouNote: 'Cảm ơn bạn đã trải nghiệm bản Demo McDonald’s Nightfall.',
      returnToMenu: 'Quay Lại Menu Chính',
    },
    engine: {
      steps: {
        talk_to_john: {
          title: 'NÓI CHUYỆN VỚI JOHN',
          description: 'Đi vào qua cửa kính trượt và nói chuyện với nhân viên John để nhận bàn giao ca đêm.',
        },
        clock_in: {
          title: 'BẤM THẺ VÀO CA',
          description: 'Đi tới máy chấm công gần quầy thu ngân và bấm thẻ bắt đầu ca làm việc.',
        },
        clean_tables: {
          title: 'LAU DỌN BÀN',
          description: (count) => `Lau sạch và khử trùng các bàn ăn bị bẩn (${count}/2).`,
        },
        mop_puddles: {
          title: 'LAU CÁC VŨNG BẨN',
          description: (count) =>
            `Lấy cây lau nhà ở góc phòng bảo vệ và lau sạch tất cả vũng bẩn (${count}/8).`,
        },
        collect_trash: {
          title: 'THU GOM RÁC',
          description: (count) => `Thu gom các túi rác đồ ăn nhanh ở khu vực bàn ăn (${count}/2).`,
        },
        dump_trash: {
          title: 'ĐỔ RÁC RA NGOÀI',
          description: 'Mang túi rác ra ngoài qua cửa sau nhà bếp để bỏ vào thùng rác lớn.',
        },
        kitchen_fryers: {
          title: 'KIỂM TRA NHÀ BẾP',
          description: 'Tắt nguồn bếp chiên rán và thiết bị gia nhiệt trong bếp.',
        },
        check_cctv: {
          title: 'KIỂM TRA AN NINH',
          description: 'Kiểm tra màn hình camera giám sát CCTV trong phòng bảo vệ.',
        },
        finish_shift: {
          title: 'SỐNG SÓT ĐẾN 6:00 SÁNG',
          description: 'Chuẩn bị hoàn tất. Khách đang tới. Hãy phục vụ đồ ăn cho khách và trụ lại đến 6:00 sáng.',
          ready6am: 'Đã 6:00 sáng! Hãy tan ca và rời khỏi cửa hàng qua cửa chính.',
        },
        n2_clock_in: {
          title: 'BẤM THẺ VÀO CA',
          description: 'Bấm thẻ bắt đầu ca Đêm 2 tại máy chấm công nhân viên.',
        },
        n2_breaker: {
          title: 'CẦU DAO BẢO TRÌ',
          description: 'Gạt công tắc cầu dao phụ trợ trong phòng an ninh.',
        },
        n2_mop_puddle: {
          title: 'LAU CÁC VŨNG BẨN',
          description: (count) =>
            `Cầm cây lau nhà ở góc phòng an ninh và lau sạch 8 vũng bẩn khắp quán (${count}/8).`,
        },
        n2_cardboard: {
          title: 'DỌN THÙNG CARTON',
          description: 'Mang chồng thùng carton đã bó ra thùng rác phía sau nhà hàng.',
          carryDesc: 'Bỏ bó bìa carton vào thùng rác ngoài trời.',
        },
        n2_drive_thru: {
          title: 'KIỂM TRA CỬA SỔ DRIVE-THRU',
          description: 'Kiểm tra cửa sổ phục vụ Drive-Thru trong suốt ở bức tường phía đông.',
        },
        n2_cctv_final: {
          title: 'KIỂM TRA CAMERA',
          description: 'Kiểm tra lại hệ thống camera an ninh trước khi đóng cửa.',
        },
        n3_clock_in: {
          title: 'BẤM THẺ VÀO CA',
          description: 'Bấm thẻ bắt đầu ca Đêm 3 tại máy chấm công nhân viên.',
        },
        n3_clean_tables: {
          title: 'LAU DỌN BÀN ĂN',
          description: (count) => `Lau sạch các bàn ăn (${count}/2). Lạ thật, bức tượng chú hề biến mất tăm rồi.`,
        },
        n3_kitchen_check: {
          title: 'BẬT BẾP CHIÊN GÀ',
          description: 'Kiểm tra công tắc bếp chiên rán để sẵn sàng phục vụ khách đêm.',
        },
      },
      dynamicObjectives: {
        preparingTitle: 'ĐANG CHẾ BIẾN MÓN...',
        preparingDesc: (sec) => `Đang chiên gà & pha cà phê trong bếp (còn ${sec} giây). Đèn đang nhấp nháy!`,
        prepFoodTitle: 'CHUẨN BỊ ĐỒ ĂN CHO KHÁCH',
        prepFoodDesc: (name) =>
          `Vào khu bếp, nấu đồ ăn & pha cà phê cho ${name} (chờ 5 giây).`,
        serveTitle: 'PHỤC VỤ ĐƠN HÀNG',
        serveDesc: (name) => `Mang khay đồ ăn nóng trên tay ra quầy đưa cho ${name}.`,
        serveDriveThruDesc: (name) =>
          `Mang khay đồ ăn nóng ra cửa sổ Drive-Thru giao cho ${name}.`,
        restockFreezerTitle: 'LẤY KHAY GÀ TRONG TỦ ĐÔNG',
        restockFreezerDesc:
          'Bếp đã hết sạch gà! Vào phòng tủ đông phía sau bếp để lấy khay thịt gà.',
        restockKitchenTitle: 'BỔ SUNG GÀ CHO QUẦY BẾP',
        restockKitchenDesc:
          'Bưng khay thịt gà trên tay quay lại quầy chế biến trong bếp để nạp hàng.',
        checkBathroomTitle: 'KIỂM TRA NHÀ VỆ SINH',
        checkBathroomDesc:
          'Có tiếng gõ cửa phát ra từ nhà vệ sinh! Hãy đi vào kiểm tra xem có ai ở đó không.',
        powerOutageTitle: 'KIỂM TRA TỦ ĐIỆN (3:00 SÁNG)',
        powerOutageDesc: 'Điện đột ngột tắt ngấm! Hãy ra phía sau cửa hàng kiểm tra hộp cầu dao điện.',
        powerOutageWithFoodDesc:
          'Mất điện và khách đã bỏ đi! Hãy ra kiểm tra tủ điện phía sau và vứt phần đồ ăn thừa vào thùng rác.',
        discardFoodTitle: 'VỨT ĐỒ ĂN VÀO THÙNG RÁC',
        discardFoodDesc:
          'Khách đã rời đi vì mất điện. Hãy vứt khay đồ ăn trên tay vào thùng rác trong bếp hoặc thùng rác ngoài trời.',
        hungerFadeTitle: 'ĐÓI BỤNG CUỐI CA',
        hungerFadeDesc: 'Đang di chuyển sang cửa hàng 67-Eleven để mua đồ ăn trước khi tan ca...',
        store67NoodlesTitle: 'ĐẾN QUẦY MÌ & NƯỚC (NOODLES & WATER)',
        store67NoodlesDesc:
          'Bước vào cửa hàng 67-Eleven, đi tới gian hàng Mì & Nước để lấy mì ly và nước tăng lực đỏ.',
        store67CashierTitle: 'THANH TOÁN TẠI QUẦY 67-ELEVEN',
        store67CashierDesc: 'Mang mì và nước tăng lực đỏ ra quầy nhân viên 67-Eleven để tính tiền.',
        store67CarTitle: 'QUAY VỀ XE CỦA DUCK',
        store67CarDesc: 'Đi ra ngoài cửa hàng 67-Eleven tới chiếc xe của bạn để kết thúc ca đêm.',
        goToMcdCarTitle: 'LÊN XE CỦA DUCK VÀ LÁI THẲNG VỀ NHÀ',
        goToMcdCarDesc: 'Gã chú hề đang đứng trong quán nhìn theo và cười rợn người! Mau chạy ra xe hơi xanh đậm ngoài bãi đỗ để lái thẳng về nhà.',
        pickupFryTitle: 'BƯỚC 1: LẤY GÀ & KHOAI TÂY TRÊN TAY',
        pickupFryDesc: (name) =>
          `Lấy thịt gà sống và khoai tây trên tay tại quầy chuẩn bị bếp cho ${name}.`,
        fryChickenTitle: 'BƯỚC 2: BỎ VÀO MÁY CHIÊN',
        fryChickenDesc: (name) =>
          `Bỏ gà và khoai tây đang cầm trên tay vào máy chiên cho ${name} (5 giây).`,
        fryingProgressTitle: 'ĐANG CHIÊN GÀ & KHOAI TÂY...',
        fryingProgressDesc: (sec) => `Đang xèo xèo & bốc khói trong máy chiên (còn ${sec}s)...`,
        pickupBurgerTitle: 'BƯỚC 3: LẤY BÁNH BIG MAC TRÊN TAY',
        pickupBurgerDesc: (name) =>
          `Lấy bánh Big Mac trên tay tại quầy bếp cho ${name}.`,
        microwaveTitle: 'BƯỚC 4: CHO BIG MAC VÀO LÒ VI SÓNG',
        microwaveDesc: (name) =>
          `Bỏ bánh Big Mac đang cầm trên tay vào Lò Vi Sóng hâm nóng cho ${name} (5 giây).`,
        microwavingProgressTitle: 'ĐANG HÂM BIG MAC...',
        microwavingProgressDesc: (sec) => `Đang quay Big Mac trong lò vi sóng (còn ${sec}s)...`,
        pickupCoffeeCupTitle: 'PHA ĐỒ UỐNG: LẤY LY CÀ PHÊ',
        pickupCoffeeCupDesc: (name) =>
          `Cầm ly cà phê trên tay tại bàn chuẩn bị bếp cho ${name}.`,
        coffeeMachineTitle: 'PHA CÀ PHÊ TẠI MÁY CÀ PHÊ',
        coffeeMachineDesc: (name) =>
          `Đặt ly cà phê vào Máy Pha Cà Phê cho ${name} và đợi 3 giây.`,
        brewingCoffeeProgressTitle: 'ĐANG PHA CÀ PHÊ...',
        brewingCoffeeProgressDesc: (sec) => `Đang pha cà phê McCafé nóng (còn ${sec}s)...`,
        pickupSodaCupTitle: 'PHA ĐỒ UỐNG: LẤY LY NƯỚC NGỌT',
        pickupSodaCupDesc: (name) =>
          `Cầm ly nước ngọt trên tay tại bàn chuẩn bị bếp cho ${name}.`,
        sodaDispenserTitle: 'RÓT NƯỚC NGỌT TẠI MÁY NƯỚC NGỌT',
        sodaDispenserDesc: (name) =>
          `Đặt ly vào Máy Rót Nước Ngọt cho ${name} và đợi 3 giây.`,
        pouringSodaProgressTitle: 'ĐANG RÓT NƯỚC NGỌT...',
        pouringSodaProgressDesc: (sec) => `Đang rót nước ngọt có ga (còn ${sec}s)...`,
        wrapFoodTitle: 'MANG TẤT CẢ VỀ BÀN BẾP & GÓI ĐỒ ĂN',
        wrapFoodDesc: (name) =>
          `Mang mọi món ăn & đồ uống về lại bàn bếp để gói gọn gàng cho ${name} (2 giây).`,
        wrappingProgressTitle: 'ĐANG GÓI ĐỒ ĂN...',
        wrappingProgressDesc: (sec) => `Đang đóng gói phần ăn cẩn thận tại bàn bếp (còn ${sec}s)...`,
        pickupFinishedTitle: 'LẤY MÓN ĐÃ XONG ĐẶT LÊN BÀN PHỤC VỤ',
        pickupFinishedDesc: (name) =>
          `Lấy đĩa đồ ăn đã xong trên bàn bếp và đặt lên bàn quầy phục vụ cho ${name}.`,
        night3CarEmergencyTitle: 'TRỐN TRONG XE & GỌI CỨU VIỆN',
        night3CarEmergencyDesc:
          'Hãy trốn kỹ trong xe! Mở Điện Thoại [P] để gọi Cảnh sát (911) và nhắn tin John cầu cứu.',
      },
      notices: {
        completed: (title) => `HOÀN THÀNH: ${title}`,
        newTaskPrep: (name) => `NHIỆM VỤ MỚI: LÀM ĐỒ ĂN CHO ${name.toUpperCase()}`,
        orderCompleted: (price) => `HOÀN TẤT ĐƠN HÀNG: $${price}`,
        prepStarted: 'ĐANG CHẾ BIẾN ĐỒ ĂN... (còn 5 giây)',
        prepInProgress: (sec) => `Đang chế biến (còn ${sec} giây)... Vui lòng chờ!`,
        mealInHands: 'Bạn đang cầm sẵn đồ ăn trên tay! Hãy mang ra giao cho khách.',
        noPendingOrders: 'Hiện chưa có đơn hàng nào cần nấu. Hãy đợi khách gọi món.',
        orderReady: 'MÓN ĐÃ XONG! Đang cầm trên tay. Hãy mang ra giao cho khách.',
        shiftEnds6am: (timeStr) =>
          `Ca trực chỉ kết thúc đúng 6:00 sáng. Hiện tại là ${timeStr}. Hãy tiếp tục phục vụ khách cho tới sáng.`,
        shiftSkipped6am: 'ĐÃ PHỤC VỤ VỊ KHÁCH CUỐI CÙNG — ĐỒNG HỒ CHUYỂN SANG 6:00 SÁNG!',
        powerOutage: '⚡ MẤT ĐIỆN LÚC 3:00 SÁNG — KIỂM TRA HỘP ĐIỆN PHÍA SAU CỬA HÀNG!',
        powerRestored: '⚡ ĐÃ CÓ ĐIỆN TRỞ LẠI — ĐÃ BẬT CẦU DAO',
        mopPickedUp: '🧹 ĐÃ CẦM CÂY LAU NHÀ — LAU SẠCH 8 VŨNG BẨN',
        mopRequired: '⚠️ CẦN CÂY LAU NHÀ TRƯỚC! Hãy lấy cây lau ở góc phòng bảo vệ.',
        foodDiscarded: '🗑️ ĐÃ VỨT ĐỒ ĂN THỪA VÀO THÙNG RÁC',
        discardFoodFirst: '⚠️ HÃY VỨT ĐỒ ĂN BỊ HỎNG TRÊN TAY VÀO THÙNG RÁC TRƯỚC!',
        outOfFood: '❄️ HẾT ĐỒ ĂN TRONG BẾP! HÃY VÀO TỦ ĐÔNG LẤY KHAY GÀ!',
        chickenTrayPickedUp: '🍗 ĐÃ LẤY KHAY GÀ — MANG RA QUẦY BẾP BỔ SUNG!',
        kitchenRestocked: '✅ ĐÃ BỔ SUNG ĐẦY ĐỦ GÀ TƯƠI CHO BẾP!',
        restockFoodFirst: '⚠️ ĐÃ HẾT GÀ! Hãy vào tủ đông lấy khay gà ra quầy bếp trước.',
        bathroomKnock: '🚪 CÓ TIẾNG GÕ CỬA TRONG NHÀ VỆ SINH! MAU RA KIỂM TRA!',
        bathroomNothingHere: 'Không có gì cả — nhà vệ sinh hoàn toàn trống rỗng.',
        driveThruArrived: '🚗 CÓ XE KHÁCH ĐỖ VÀO CỬA SỔ DRIVE-THRU!',
        duckHungry: '🍜 DUCK ĐANG ĐÓI — DI CHUYỂN SANG 67-ELEVEN!',
        arrived67Eleven: '🏪 ĐÃ ĐẾN 67-ELEVEN — HÃY TỚI QUẦY MÌ & NƯỚC',
        pickedUpNoodlesDrink: '🥤 ĐÃ LẤY MÌ & NƯỚC TĂNG LỰC ĐỎ — RA QUẦY TÍNH TIỀN',
        paidAt67Eleven: '💵 ĐÃ TRẢ $10 — RA XE CỦA DUCK ĐỂ KẾT THÚC ĐÊM',
        statueMoved: '🤡 BỨC TƯỢNG CHÚ HỀ ĐÃ BIẾN MẤT... JOHN KHÔNG HỀ BIẾT NÓ ĐÂU RỒI.',
        clownWatchingCar: '🤡 CHÚ HỀ ĐANG ĐỨNG TRONG QUÁN NHÌN THEO VÀ CƯỜI RỢN NGƯỜI! MAU RA XE!',
        rawFryInHand: '🥩 ĐANG CẦM GÀ & KHOAI TÂY — BỎ VÀO MÁY CHIÊN!',
        needRawFryInHand: '⚠️ HÃY CẦM GÀ & KHOAI TÂY TẠI QUẦY BẾP TRƯỚC!',
        fryStarted: '🍟 ĐÃ BỎ VÀO MÁY CHIÊN! ĐANG CHIÊN GÀ & KHOAI TÂY... (5 giây)',
        fryDone: '✅ CHIÊN XONG! HÃY LẤY BIG MAC TẠI QUẦY BẾP!',
        bigMacInHand: '🍔 ĐANG CẦM BIG MAC — CHO VÀO LÒ VI SÓNG!',
        needBigMacInHand: '⚠️ HÃY CẦM BÁNH BIG MAC TẠI QUẦY BẾP TRƯỚC!',
        coffeeCupInHand: '☕ ĐANG CẦM LY CÀ PHÊ — ĐẶT VÀO MÁY PHA CÀ PHÊ (3 giây)!',
        needCoffeeCupInHand: '⚠️ HÃY CẦM LY CÀ PHÊ TẠI QUẦY BẾP TRƯỚC!',
        coffeeStarted: '☕ ĐANG PHA CÀ PHÊ TẠI MÁY... (3 giây)',
        coffeeDone: '✅ ĐÃ PHA CÀ PHÊ XONG! HÃY LÀM BƯỚC TIẾP THEO!',
        sodaCupInHand: '🥤 ĐANG CẦM LY NƯỚC NGỌT — ĐẶT VÀO MÁY RÓT NƯỚC NGỌT (3 giây)!',
        needSodaCupInHand: '⚠️ HÃY CẦM LY NƯỚC NGỌT TẠI QUẦY BẾP TRƯỚC!',
        sodaStarted: '🥤 ĐANG RÓT NƯỚC NGỌT TẠI MÁY... (3 giây)',
        sodaDone: '✅ ĐÃ RÓT NƯỚC NGỌT XONG! MANG VỀ BÀN BẾP ĐỂ GÓI!',
        microwaveStarted: '📡 ĐÃ CHO BIG MAC VÀO LÒ VI SÓNG... (5 giây)',
        microwaveDone: '🔔 TING! HÃY KIỂM TRA BƯỚC TIẾP THEO TẠI BÀN BẾP!',
        wrapStarted: '📦 ĐANG MANG VỀ BÀN BẾP VÀ ĐÓNG GÓI... (2 giây)',
        dishOnKitchenTable: '🍽️ MÓN ĐÃ XONG TRÊN BÀN BẾP! LẤY VÀ ĐẶT LÊN BÀN PHỤC VỤ!',
        night3CarNoGas: '⛽ HẾT XĂNG RỒI! ĐỘNG CƠ KHÔNG THỂ KHỞI ĐỘNG!',
        night3WindowCracked: '💥 KÍNH CỬA LÁI ĐÃ NỨT TOÁC VÌ CÚ ĐẬP ĐẦU!',
        night3PoliceOnWay: '🚓 ĐÃ GỌI CẢNH SÁT & JOHN — CÒI HÚ ĐANG TỚI GẦN!',
      },
      prompts: {
        talkToJohn: '[E] Nói chuyện với John (Nhận ca)',
        deliverMeal: (name) => `[E] Giao Đồ Ăn Nóng cho ${name}`,
        talkAwaiting: (name) => `[E] Nói chuyện với ${name} (Đang chờ món)`,
        takeOrder: (name) => `[E] Nhận Đơn Hàng từ ${name}`,
        driveThruTakeOrder: (name) => `[E] Nhận Đơn Drive-Thru (${name})`,
        driveThruDeliverMeal: (name) => `[E] Đưa Đồ Ăn Qua Cửa Sổ Drive-Thru (${name})`,
        talkSilas: '[E] Nói chuyện với Silas (Khách quen)',
        cookingKitchen: (sec) => `⏳ Đang Nấu Trong Bếp (còn ${sec}s)...`,
        cookKitchen: '[E] Nấu Đồ Ăn & Pha Cà Phê Trong Bếp (5s)',
        pickUpChickenTray: '[E] Lấy Khay Thịt Gà Trong Tủ Đông',
        restockChickenTray: '[E] Bổ Sung Khay Gà Vào Quầy Bếp',
        inspectElectricalBox: '[E] Kiểm Tra Hộp Điện & Gạt Lại Cầu Dao',
        throwFoodInTrash: '[E] Vứt Đồ Ăn Vào Thùng Rác',
        pickUpMop: '[E] Cầm Cây Lau Nhà',
        mopPuddle: '[E] Lau Vũng Nước Bẩn',
        mopRequiredPrompt: '⚠️ Hãy lấy cây lau nhà ở góc phòng bảo vệ trước!',
        takeNoodlesAndDrink: '[E] Lấy Mì Ly & Nước Tăng Lực Đỏ (Quầy Mì & Nước)',
        talkCashier67: '[E] Tính Tiền Với Nhân Viên 67-Eleven ($10)',
        enterDuckCar: '[E] Lên Xe Của Duck (Kết Thúc Ca Đêm)',
        enterMcdDuckCar: '[E] Lên Xe Của Duck & Lái Thẳng Về Nhà',
        takeRawFry: '[E] Lấy Gà & Khoai Tây Cầm Trên Tay',
        takeBigMac: '[E] Lấy Bánh Big Mac Cầm Trên Tay',
        takeCoffeeCup: '[E] Cầm Ly Cà Phê Trên Tay',
        takeSodaCup: '[E] Cầm Ly Nước Ngọt Trên Tay',
        takeFinishedDish: '[E] Lấy Đĩa Đồ Ăn Đã Xong Trên Bàn Bếp',
        placeDishOnTable: '[E] Đặt Món Đã Xong Lên Bàn Phục Vụ',
        useFryer: '[E] Bỏ Gà & Khoai Tây Vào Máy Chiên (5 giây)',
        fryingNow: (sec) => `🍟 Đang Chiên Gà & Khoai Tây (${sec}s)...`,
        useMicrowave: '[E] Bỏ Big Mac Vào Lò Vi Sóng (5 giây)',
        microwavingNow: (sec) => `📡 Đang Hâm Big Mac (${sec}s)...`,
        useCoffeeMachine: '[E] Đặt Ly Vào Máy Pha Cà Phê (3 giây)',
        brewingCoffeeNow: (sec) => `☕ Đang Pha Cà Phê (${sec}s)...`,
        useSodaDispenser: '[E] Đặt Ly Vào Máy Rót Nước Ngọt (3 giây)',
        pouringSodaNow: (sec) => `🥤 Đang Rót Nước Ngọt (${sec}s)...`,
        wrapFoodCounter: '[E] Mang Tất Cả Về Bàn Bếp & Gói Lại (2 giây)',
        wrappingNow: (sec) => `📦 Đang Gói Đồ Ăn (${sec}s)...`,
        actions: {
          employee_john: 'Nói chuyện với John (Nhận ca)',
          time_clock: 'Bấm Thẻ Chấm Công Nhân Viên',
          clean_table_1: 'Lau & Khử Trùng Bàn Số 1',
          clean_table_2: 'Lau & Khử Trùng Bàn Số 2',
          trash_bag_1: 'Nhặt Túi Rác Bàn Ăn',
          trash_bag_2: 'Nhặt Túi Rác Bàn Ăn',
          outdoor_dumpster: 'Đổ Rác Vào Thùng Rác Ngoài Trời',
          trash_bin: 'Vứt Đồ Ăn Vào Thùng Rác',
          kitchen_switch: 'Tắt Nguồn Bếp Chiên & Thiết Bị Nóng',
          office_switch: 'Bật Đèn Phụ Trợ Hành Lang',
          cctv_monitor: 'Mở Màn Hình An Ninh CCTV',
          front_door_exit: 'Tan Ca & Rời Cửa Hàng Qua Cửa Chính',
          mop_tool: 'Cầm Cây Lau Nhà',
          hallway_spill: 'Lau Sạch Vũng Nước Bẩn',
          cardboard_bundle: 'Nhặt Bó Thùng Carton',
          drive_thru_window: 'Kiểm Tra Cửa Sổ Phục Vụ Drive-Thru',
          drive_thru_order_station: 'Kiểm Tra Tai Nghe & Máy Drive-Thru',
          freezer_chicken_tray: 'Lấy Khay Thịt Gà Từ Tủ Đông',
          fryer_machine: 'Chiên Gà & Khoai Tây Trong Máy Chiên',
          kitchen_microwave: 'Hâm Nóng Big Mac Trong Lò Vi Sóng',
          coffee_machine: 'Pha Cà Phê Tại Máy Pha Cà Phê',
          soda_dispenser: 'Rót Nước Ngọt Tại Máy Rót Nước Ngọt',
          serve_table_spot: 'Đặt Món Đã Xong Lên Bàn Phục Vụ',
          electrical_box: 'Kiểm Tra Hộp Điện & Khôi Phục Nguồn',
          toilet_flush: 'Xả Nước Bồn Cầu',
          store_67_noodle_stall: 'Lấy Mì & Nước Tăng Lực Đỏ',
          store_67_cashier: 'Thanh Toán Với Nhân Viên 67-Eleven ($10)',
          store_67_car: 'Lên Xe Của Duck',
          mcd_duck_car: 'Lên Xe Của Duck & Lái Thẳng Về Nhà',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Lại thêm một đêm ở chỗ này… đứng ngoài trời sương lạnh thế này.' },
        { speaker: 'Duck', text: 'Lương bèo, rừng tối, ca trực 6 tiếng. Hình như John vẫn đang đợi ở trong để bàn giao ca.' },
        { speaker: 'Duck', text: 'Vào qua cửa trượt rồi nói chuyện với John thôi.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Quay lại Đêm 2 rồi… Bãi xe và khu rừng tối nay yên ắng một cách kỳ lạ.' },
        { speaker: 'Duck', text: 'John vẫn đang đứng đợi gần quầy. Vào qua cửa trượt để nói chuyện với anh ta thôi.' },
      ],
      openingMonologueNight3: [
        { speaker: 'Duck', text: 'Lại một đêm đi làm nữa… Sao mình cứ phải quay lại cái quán này vậy trời?' },
        { speaker: 'Duck', text: 'Chưa đóng tiền trọ nên đâu còn lựa chọn nào khác. Vào trong nói chuyện với John thôi.' },
      ],
      johnDialogue: [
        { speaker: 'John', text: 'Ê! Nhân viên mới! Cậu mới vào làm ở đây à?' },
        { speaker: 'Duck', text: 'Ừ, thì sao nào?' },
        { speaker: 'John', text: 'Haha, bình tĩnh nào! Ca của tôi cuối cùng cũng hết rồi, giờ tôi bàn giao lại cho cậu đấy.' },
        { speaker: 'John', text: 'Nghe kỹ đây — đây là tất cả những việc cậu cần làm trong ca đêm này.' },
        { speaker: 'John', text: 'Đầu tiên, ra máy chấm công gần quầy thu ngân để bấm thẻ vào ca. Sau đó lau sạch các bàn ăn bẩn rồi gom hết túi rác lại.' },
        { speaker: 'John', text: 'Mang túi rác ra cửa sau nhà bếp đổ vào thùng rác lớn, tắt bếp chiên đi, rồi vào phòng bảo vệ kiểm tra camera CCTV.' },
        { speaker: 'John', text: 'Qua nửa đêm sẽ có khách ghé cả quầy lẫn cửa sổ Drive-Thru. Nhận đơn, vào bếp chiên gà pha cà phê 5 giây rồi bưng ra. Nếu bếp hết gà thì vào tủ đông sau bếp lấy khay gà nhé!' },
        { speaker: 'John', text: 'Còn một lời khuyên nữa... nếu đèn bếp tự nhiên chớp tắt lúc đang nấu thì đừng hoảng. Và đừng nhìn con ma-nơ-canh chú hề lâu quá. Hẹn gặp lúc 6 giờ sáng!' },
        { speaker: 'Duck', text: 'Tên này nói năng kỳ quặc thật... Thôi kệ, ra bấm thẻ vào ca rồi làm việc vậy.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Ồ, chào Duck. May mà cậu vẫn quay lại làm Đêm 2 đấy.' },
        { speaker: 'Duck', text: 'Ừ, tiền nhà đâu có tự trả được. Đêm nay mọi thứ vẫn ổn chứ?' },
        { speaker: 'John', text: 'Cũng tạm... trừ việc quản lý mới dán thêm thông báo trong phòng. Vẫn chẳng có tin tức gì về cậu nhân viên ca đêm cũ bị mất tích tuần trước.' },
        { speaker: 'Duck', text: 'Người mà tôi thay thế ấy hả? Khoan—anh ta mất tích ngay tại đây luôn sao?' },
        { speaker: 'John', text: 'Cảnh sát tìm thấy xe của cậu ấy đỗ sát bìa rừng, mũ đồng phục vẫn để trên bảng điều khiển. Ông chủ dặn không được nhắc trước mặt khách, nhưng cả thị trấn đang xôn xao hết rồi.' },
        { speaker: 'John', text: 'Thôi thì vẫn quy trình tối nay: bấm thẻ, gạt cầu dao phòng an ninh, lau các vũng nước bẩn, dọn thùng carton, kiểm tra cửa sổ drive-thru, xem CCTV rồi phục vụ khách ở quầy và drive-thru đến 6:00 sáng.' },
        { speaker: 'Duck', text: 'Tuyệt vời thật... một đồng nghiệp cũ mất tích và thêm một ca trực nửa đêm. Gặp lại lúc sáng nhé, John.' },
      ],
      johnDialogueNight3: [
        { speaker: 'John', text: 'Chào Duck… may mà đêm nay cậu vẫn đi làm.' },
        { speaker: 'Duck', text: 'Khoan đã, John. Bức tượng chú hề đứng cạnh quầy thu ngân đâu mất tiêu rồi?' },
        { speaker: 'John', text: 'Chịu luôn, tôi cũng sởn gai ốc vụ đó đây. Lúc tôi tới mở cửa tối nay thì nó đã biến mất hoàn toàn rồi.' },
        { speaker: 'Duck', text: 'Biến mất á? Không phải bên sửa chữa dời vào kho hay mang đi sao?' },
        { speaker: 'John', text: 'Tôi thực sự không biết nó đi đâu nữa. Chẳng có lịch bảo trì hay thợ nào ghé, camera cũng chẳng ghi được gì.' },
        { speaker: 'John', text: 'Cứ bấm thẻ, lau qua bàn ăn, kiểm tra bếp chiên rồi trực quầy nhé. Nếu xong việc thì nhớ ra thẳng xe mà về.' },
        { speaker: 'Duck', text: 'Cửa hàng khóa kín mà cả bức tượng lớn biến mất không dấu vết… Thôi kệ, ngủ ngon nhé John.' },
      ],
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Cái quái gì thế?! Có chuyện gì vậy? Ông chủ quên đóng tiền điện à? Không biết nữa, tôi sẽ ra phía sau cửa hàng kiểm tra xem sao.',
        },
      ],
      customerPowerOutageLeave:
        'Ôi trời ơi, cái quái gì vậy? Thế này không được rồi, tôi không mua đồ ăn nữa, tôi đi đây.',
      powerRestoredDialogue: [
        {
          speaker: 'Duck',
          text: 'Hả, có ai đó đã gạt tắt cầu dao điện chứ không phải bị cúp điện.',
        },
      ],
      warehouseClownReactionDialogue: [
        {
          speaker: 'Duck',
          text: 'Gã nào vừa đứng nhìn mình thế nhỉ? Thôi kệ đi, dù sao điện cũng sửa xong rồi.',
        },
      ],
      outOfFoodDialogue: [
        {
          speaker: 'Duck',
          text: 'Khoan đã—trong bếp hết sạch thịt gà rồi! Phải vào phòng tủ đông phía sau bếp lấy thêm một khay thịt gà mới ra thôi.',
        },
      ],
      bathroomKnockDialogue:
        'Tiếng gì trong nhà vệ sinh vậy? Giờ này đâu còn ai ở đây nữa, mình phải ra kiểm tra mới được.',
      bathroomEmptyDialogue:
        'Không có gì hết... hoàn toàn trống không. Rõ ràng lúc nãy mình nghe thấy tiếng gõ trong nhà vệ sinh mà.',
      duckHungerDialogue: [
        {
          speaker: 'Duck',
          text: 'Á, đói bụng quá! Mình nên ghé mua chút gì đó trước khi kết thúc ca.',
        },
      ],
      clerk67Dialogue: [
        {
          speaker: 'Nhân viên 67-Eleven',
          text: 'Tổng cộng của bạn là $10, cảm ơn.',
        },
      ],
      clownCustomerName: 'Gã Chú Hề',
      clownCustomerTitle: 'Vị Khách Không Mời Lúc Nửa Đêm',
      clownCustomerOrderItem: 'Gà Rán Giòn',
      clownBuyChickenDialogue: [
        {
          speaker: 'Gã Chú Hề',
          text: 'Hì… hì… chào buổi tối, chú vịt nhỏ lông vàng đứng sau quầy kính.',
        },
        {
          speaker: 'Duck',
          text: 'À… tôi giúp gì được cho ông? Sao ông lại ăn mặc y hệt—khoan, mình gặp nhau chưa nhỉ?',
        },
        {
          speaker: 'Gã Chú Hề',
          text: 'Ồn ào khi chảo dầu sôi xèo xèo, im ắng khi bóng đèn vụt tắt. Ta tới mua gà rán của ngươi… giòn tan… nóng hổi… vàng ươm.',
        },
        {
          speaker: 'Duck',
          text: 'Rồi… một phần gà rán giòn. Đợi tôi 5 giây trong bếp…',
        },
        {
          speaker: 'Gã Chú Hề',
          text: 'Cứ từ từ mà làm, Duck. Khi ta đang đứng ngắm, ta không bao giờ vội.',
        },
      ],
      clownChickenDeliveredDialogue: (price) => [
        {
          speaker: 'Duck',
          text: `Gà rán của ông đây… tổng cộng là $${price}.`,
        },
        {
          speaker: 'Gã Chú Hề',
          text: 'Hì hì hì… ta ngửi thấy mùi gà từ tận ngoài bìa rừng tối kia. Đừng bận tâm bức tượng ở góc phòng… nó thích đứng chỗ đó để nhìn rõ quầy hơn thôi.',
        },
        {
          speaker: 'Gã Chú Hề',
          text: 'Lái xe về cẩn thận nhé, cậu nhân viên nhỏ. Ta sẽ đứng ngay đây trong quán ngắm cậu bước ra xe.',
        },
      ],
      clownWatchingCarMonologue: [
        {
          speaker: 'Duck',
          text: 'Hắn cứ đứng lỳ trong cửa kính nhìn chằm chằm theo mình rồi cười ghê rợn quá… Phải chạy nhanh ra xe lái thẳng về nhà ngay thôi!',
        },
      ],
      night3CarNoGasDialogue: [
        {
          speaker: 'Duck',
          text: 'Chết tiệt, sao xe lại hết sạch xăng ngay lúc này chứ!',
        },
      ],
      night3CarPostAttackDialogue: [
        {
          speaker: 'Duck',
          text: 'Khốn kiếp! Hắn điên rồi, hắn thực sự muốn giết mình sao?',
        },
      ],
      waitRestockDialogue: (customerName) => [
        {
          speaker: 'Duck',
          text: `Đợi tôi một chút nhé, ${customerName}! Quầy bếp vừa hết thịt gà—tôi vào tủ đông lấy khay mới ra ngay đây.`,
        },
      ],
      thankYouDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Cảm ơn bạn nhiều lắm, Duck! Đây là $${price} tiền đồ ăn nhé. Khỏi trả lại tiền thừa đâu!`,
        },
        {
          speaker: 'Duck',
          text: 'Cảm ơn quý khách! Chúc ngon miệng và đi đường cẩn thận đêm nay nhé.',
        },
      ],
      grumpyDeliveredDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Lâu lắc thế! Làm mỗi phần ăn mà mất cả buổi. Cầm lấy $${price} đây—đừng mơ có tiền bo hay lời khen vào lúc nửa đêm.`,
        },
        {
          speaker: 'Duck',
          text: '...Ừ. Thậm chí còn chẳng thèm nói cảm ơn một câu. Chúc ông về bình an vậy.',
        },
      ],
      friendsSeatedDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Tuyệt vời, nóng hổi thơm phức luôn! Của cậu $${price} nhé Duck. Cảm ơn nhiều!`,
        },
        {
          speaker: 'Leo',
          text: 'Ra bàn góc ngồi chén lẹ cho ấm bụng rồi mình phóng thẳng ra quán nét tụi bay ơi!',
        },
        {
          speaker: 'Duck',
          text: 'Ăn ngon miệng nhé hội Báo Con! Lát về nhớ lẻn khéo kẻo mẹ phát hiện đấy.',
        },
      ],
      waitingOrderDialogue: (customerName, itemText) => [
        {
          speaker: customerName,
          text: `Tôi vẫn đang đợi phần ${itemText} nhé! Trong bếp có vẻ thơm rồi đấy.`,
        },
        {
          speaker: 'Duck',
          text: 'Tôi đang làm ở quầy bếp ngay đây! Chỉ mất 5 giây thôi.',
        },
      ],
      customers: [
        {
          name: 'Y tá Ramirez',
          title: 'Nhân viên trực đêm kiệt sức',
          orderItem: 'Phần Big Mac kèm Cà phê McCafé nóng & Khoai tây chiên',
          dialogue: [
            { speaker: 'Y tá Ramirez', text: 'Này... làm ơn nói với tôi là bình cà phê vẫn còn nóng đi. Tôi vừa xong ca cấp cứu 14 tiếng kinh khủng.' },
            { speaker: 'Duck', text: 'Vừa mới pha năm phút trước thôi. Ca đêm đúng là vắt kiệt sức người thật nhỉ?' },
            { speaker: 'Y tá Ramirez', text: 'Cậu không tưởng tượng nổi đâu. Nhưng thật lòng... tối nay ở đây yên tĩnh hơn cả nhà xác. Ngoài đường không một bóng xe.' },
            { speaker: 'Duck', text: 'Ừ, bình thường còn có mấy đứa nhóc ồn ào. Đêm nay chỉ có tôi, mấy cái bếp chiên và bức tượng chú hề kỳ quái kia.' },
            { speaker: 'Y tá Ramirez', text: 'Nhớ khóa cửa chính lại nếu được nhé cậu bé. Không khí ngoài kia có cảm giác rất không ổn.' },
            { speaker: 'Duck', text: 'Quy định công ty bắt mở sảnh 24/7. Kể cả ma chú hề có tấn công thì quản lý vẫn trừ lương tôi như thường.' },
            { speaker: 'Y tá Ramirez', text: 'Dù sao thì cho tôi một phần Big Mac với cà phê nóng và khoai tây chiên nhé. Tôi đói lả rồi.' },
            { speaker: 'Duck', text: 'Có ngay đây! Tôi vào bếp làm cho chị liền.' },
          ],
        },
        {
          name: 'Tyler',
          title: 'Thiếu niên bồn chồn',
          orderItem: '10 miếng Gà McNuggets kèm Khoai chiên & Sprite',
          dialogue: [
            { speaker: 'Tyler', text: 'Ê... anh bạn. Anh bạn ơi! Thấy gì không?! Con tượng chú hề Ronald bên bàn ăn vừa quay đầu phải không?!' },
            { speaker: 'Duck', text: 'Nó làm bằng nhựa rỗng và sợi thủy tinh bắt vít xuống sàn. Nó không cử động được đâu, Tyler.' },
            { speaker: 'Tyler', text: 'Tôi thề sống thề chết lúc tôi đỗ xe nó vẫn quay mặt ra cửa sổ! Giờ đầu nó ngoẹo thẳng về phía quầy thu ngân rồi!' },
            { speaker: 'Duck', text: 'Lương tôi có tám đô một tiếng. Dù chú hề có sống dậy thì tiền lương cũng chẳng đủ để tôi chạy.' },
            { speaker: 'Tyler', text: 'Tôi mua mang về thôi. Cho một phần 10 miếng McNuggets sốt BBQ với ly Sprite lớn nhé!' },
            { speaker: 'Duck', text: 'Ok ngay. Tôi vào bếp chiên gà và khoai ngay đây.' },
          ],
        },
        {
          name: 'Ông lão Silas',
          title: 'Khách quen bí ẩn',
          orderItem: 'Trà Đen Nóng & Bánh Táo Nướng',
          dialogue: [
            { speaker: 'Ông lão Silas', text: 'Hắn không thích tiếng rè của đèn huỳnh quang đâu, chàng trai trẻ. Hắn chỉ lắng nghe khi bóng đèn bắt đầu nhấp nháy.' },
            { speaker: 'Duck', text: 'Thưa ông, nếu ông muốn gọi món thì cháu đang đứng ở quầy đây ạ.' },
            { speaker: 'Ông lão Silas', text: 'Bốn mươi năm trước, mảnh đất này thuộc về khu rừng. Những nụ cười vẽ bằng sơn dầu không bao giờ rửa sạch hẳn được.' },
            { speaker: 'Duck', text: 'Vâng. Ông Silas này, bánh mì là thịt bò thật còn chú hề làm bằng nhựa tổng hợp. Ông muốn dùng món gì ạ?' },
            { speaker: 'Ông lão Silas', text: 'Một ly trà đen nóng và một cái bánh táo nướng ấm, chú vịt trẻ ạ. Nhớ giữ trà thật nóng.' },
            { speaker: 'Duck', text: 'Cháu rõ rồi. Cháu vào bếp chuẩn bị trà và bánh táo cho ông ngay.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Thợ sửa ống nước vui tính (Mario đời thực)',
          orderItem: 'Xô Gà Rán Siêu Hạng & Espresso Tăng Lực',
          dialogue: [
            { speaker: 'Big Ray', text: 'Wahoo! Là tôi đây, Big Ray! Chào buổi tối nhé anh bạn vịt dễ thương!' },
            { speaker: 'Duck', text: 'Ủa... chào anh Big Ray. Nhìn anh y hệt như vừa nhảy ra từ đường ống nước luôn vậy.' },
            { speaker: 'Big Ray', text: 'Mamma mia! Tối nay tôi vừa sửa ba cái ống nước rỉ khắp thị trấn—giờ bụng đói cần ăn lấy sức như ăn Sao Vàng đây!' },
            { speaker: 'Duck', text: 'Haha, nghe chất đấy. Hôm nay anh Mario muốn gọi món gì nào?' },
            { speaker: 'Big Ray', text: 'Cho một xô gà rán giòn, thêm burger nấm và một ly espresso thật nóng! Let’s-a go!' },
            { speaker: 'Duck', text: 'Có ngay đây anh Big Ray! Đợi tôi 5 giây trong bếp.' },
          ],
        },
        {
          name: 'Maya Lin',
          title: 'Sinh viên thức trắng đêm',
          orderItem: 'McCafé Mocha Đá & Bánh Gà Giòn Cay',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Này... nói với tôi là máy pha espresso vẫn còn chạy đi? Viết luận văn lúc 2 giờ sáng đúng là quyết định tồi tệ.' },
            { speaker: 'Duck', text: 'Máy cà phê vẫn nóng hổi và chạy ầm ầm đây. Thi cử căng lắm à?' },
            { speaker: 'Maya Lin', text: 'Tệ hơn thế—đèn pha xe tôi vừa quét trúng thứ gì đó cao lêu nghêu cạnh rặng thông lúc rẽ vào bãi xe, rồi điện thoại mất sạch sóng luôn.' },
            { speaker: 'Duck', text: 'Quanh bãi đất này nhiều thú rừng lắm. Nai, gấu trúc... mong là không phải chú hề.' },
            { speaker: 'Maya Lin', text: 'Khoan, gì cơ? Thôi cho tôi một ly mocha đá với bánh gà giòn cay cho tỉnh táo nhé.' },
            { speaker: 'Duck', text: 'Có ngay! Tôi vào bếp chiên gà và pha cà phê liền.' },
          ],
        },
        {
          name: 'Nhân viên Cấp cứu Carter',
          title: 'Y tế trực đêm',
          orderItem: 'Xô Gà Rán & Espresso Đôi',
          dialogue: [
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Trạm 4 đêm nay khá yên nên tôi ghé ngang qua chút. Chỉ có một mình cậu trực quầy thôi à?' },
            { speaker: 'Duck', text: 'Chỉ có mình tôi với đám chảo dầu tới 6 giờ sáng thôi. Trên bộ đàm cứu thương đêm nay có gì lạ không?' },
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Có ba cuộc gọi 911 nhiễu sóng phát ra từ bốt điện thoại dọc quốc lộ này—không ai nói gì, chỉ có tiếng thở và tiếng còi rạp xiếc.' },
            { speaker: 'Duck', text: 'Chà, nghe còn rợn hơn cả mấy vị khách khó tính nữa.' },
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Nhớ bật sáng đèn cửa ra vào nhé. Lấy giúp tôi một xô gà rán giòn và ly cà phê đậm.' },
            { speaker: 'Duck', text: 'Có ngay đây! Đợi 5 giây ở bếp nhé.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Du khách lạc đường',
          orderItem: 'Latte Caramel Nóng & Bánh Táo',
          dialogue: [
            { speaker: 'Clara Novak', text: 'Xin lỗi... GPS của tôi mất tín hiệu hoàn toàn từ mười dặm trước rồi. Đây vẫn là Quốc lộ 9 chứ?' },
            { speaker: 'Duck', text: 'Đúng rồi cô ơi, đoạn vắng của Quốc lộ 9. Ban đêm rừng rậm chắn hết sóng ở khu này.' },
            { speaker: 'Clara Novak', text: 'Tôi thề mình đã lái xe ngang qua biển hiệu đỏ của quán hai lần rồi, cứ như con đường tự vòng ngược lại vào rừng.' },
            { speaker: 'Duck', text: 'Sương dày dễ làm tài xế mất phương hướng lắm. Cô dùng chút đồ nóng trước khi đi tiếp nhé?' },
            { speaker: 'Clara Novak', text: 'Một ly latte caramel nóng và bánh táo ấm thì tuyệt quá. Cảm ơn cậu.' },
            { speaker: 'Duck', text: 'Tôi pha ngay đây—lát nữa tôi bưng khay ra liền.' },
          ],
        },
      ],
      customersNight2: [
        {
          name: 'Y tá Ramirez',
          title: 'Nhân viên trực đêm kiệt sức',
          orderItem: 'Cà phê McCafé nóng & Gà Rán Giòn',
          dialogue: [
            { speaker: 'Y tá Ramirez', text: 'Chào buổi tối. Khoan đã—cậu phải trực đêm một mình thật sao? Tôi cứ tưởng tối nay vẫn thấy cậu Marcus đứng quầy chứ.' },
            { speaker: 'Duck', text: 'Marcus hả? Đó là anh nhân viên ca đêm trước mà mọi người hay nhắc tới phải không?' },
            { speaker: 'Y tá Ramirez', text: 'Phải. Hai tuần trước cậu ấy từng ghé phòng cấp cứu trong bộ dạng tái mét, thề rằng có kẻ gõ lên gương nhà vệ sinh sau 3 giờ sáng. Rồi cậu ấy bặt vô âm tín.' },
            { speaker: 'Duck', text: 'Lúc tôi ký hợp đồng chẳng ai nói với tôi chuyện đó cả...' },
            { speaker: 'Y tá Ramirez', text: 'Đêm nay nhớ cẩn thận nhé. Cho tôi một ly cà phê McCafé nóng với phần gà rán giòn để tỉnh táo lái xe về.' },
            { speaker: 'Duck', text: 'Có ngay đây. Tôi vào bếp làm ngay cho chị.' },
          ],
        },
        {
          name: 'Tyler',
          title: 'Thiếu niên bồn chồn',
          orderItem: '10 miếng McNuggets & Khoai Tây Cỡ Lớn',
          dialogue: [
            { speaker: 'Tyler', text: 'Anh bạn ơi, nghe tin tức trên đài chưa? Cảnh sát VẪN đang tìm kiếm quanh khu rừng sau quán McDonald’s này để tìm nhân viên ca đêm bị mất tích đấy!' },
            { speaker: 'Duck', text: 'Ừ, John mới kể với tôi người ta tìm thấy mũ đồng phục của anh ta gần bìa rừng.' },
            { speaker: 'Tyler', text: 'Anh họ tôi hay ghé đây khuya kể lại rằng người mất tích từng thấy một gã chú hề cao lêu nghêu tóc đỏ đứng ngoài cửa kính ngay trước khi hết ca.' },
            { speaker: 'Duck', text: 'Thôi đừng dọa nhau nữa, tôi còn phải kẹt ở đây tới 6 giờ sáng đấy. Cậu gọi món gì?' },
            { speaker: 'Tyler', text: '10 miếng McNuggets với khoai tây lớn mang đi — tôi không dám ở lại thêm một giây nào đâu!' },
            { speaker: 'Duck', text: 'Rồi, chờ 5 giây trong bếp nhé.' },
          ],
        },
        {
          name: 'Phó Cảnh Sát Vance',
          title: 'Cảnh sát tuần tra đêm',
          orderItem: 'Cà phê Đen & Phần Quarter Pounder',
          dialogue: [
            { speaker: 'Phó Cảnh Sát Vance', text: 'Đêm nay tuần tra vắng vẻ. Cho tôi ly cà phê đen nhé? Tôi ghé kiểm tra quán vì đây là nơi cuối cùng Marcus bấm thẻ trước khi mất tích.' },
            { speaker: 'Duck', text: 'Bên cảnh sát vẫn chưa có manh mối nào về chuyện xảy ra với anh ấy ạ?' },
            { speaker: 'Phó Cảnh Sát Vance', text: 'Dữ liệu camera đêm cuối cùng của cậu ấy bị hỏng sau 3 giờ sáng, còn quản lý từ chối giao chìa khóa dự phòng ra lối mòn trong rừng. Hãy giữ cảnh giác.' },
            { speaker: 'Duck', text: 'Cháu sẽ để mắt tới cửa ra vào và camera. Chú có muốn gọi thêm món gì với cà phê không?' },
            { speaker: 'Phó Cảnh Sát Vance', text: 'Lấy thêm một phần Quarter Pounder. Nhớ trông chừng cửa kính phía trước đấy nhé.' },
            { speaker: 'Duck', text: 'Vâng. Cháu vào bếp chuẩn bị đồ ăn ngay đây.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Thợ sửa ống nước vui tính (Mario đời thực)',
          orderItem: 'Xô Gà Rán & Espresso Nóng',
          dialogue: [
            { speaker: 'Big Ray', text: 'Mamma mia! Lại gặp lại cậu vịt trực đêm rồi! Wahoo!' },
            { speaker: 'Duck', text: 'Chào anh Big Ray! Đêm nay anh lại đi thông cống sửa ống nước khuya nữa à?' },
            { speaker: 'Big Ray', text: 'Chuẩn luôn! Tôi vừa sửa xong cái bồn rửa xanh khổng lồ ngoài phố chính—à, tối nay nhớ để ý đường ống nhà vệ sinh quán cậu nhé, okie-dokie!' },
            { speaker: 'Duck', text: 'Cảm ơn anh đã nhắc. Vẫn combo tăng lực như mọi khi chứ ạ?' },
            { speaker: 'Big Ray', text: 'Sì! Một xô gà rán giòn với một ly espresso nóng bỏng tay! Let’s-a go!' },
            { speaker: 'Duck', text: 'Có ngay đây Big Ray! Chờ 5 giây trong bếp.' },
          ],
        },
        {
          name: 'Maya Lin',
          title: 'Sinh viên thức trắng đêm',
          orderItem: 'McCafé Mocha Nóng & Gà McNuggets',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Khoan—cậu là nhân viên mới à? Trên bảng tin trường đại học có dán tờ rơi tìm người nhân viên đã biến mất ngay tại quán này.' },
            { speaker: 'Duck', text: 'Ừ... Marcus. Đêm nay vị khách nào ghé qua dường như cũng biết về anh ta rõ hơn quản lý quán.' },
            { speaker: 'Maya Lin', text: 'Bạn tôi hay ghé đây ôn bài khuya kể Marcus nghỉ học đúng buổi sáng xe cậu ấy được tìm thấy cạnh hàng thông.' },
            { speaker: 'Duck', text: 'Giá như John kể chuyện đó trước khi đưa tạp dề cho tôi.' },
            { speaker: 'Maya Lin', text: 'Nhớ đứng gần ánh đèn quầy thu ngân nhé. Cho tôi một mocha nóng với phần McNuggets mang về.' },
            { speaker: 'Duck', text: 'Có ngay. Chờ 5 giây trong bếp.' },
          ],
        },
        {
          name: 'Nhân viên Cấp cứu Carter',
          title: 'Y tế trực đêm',
          orderItem: 'Phần Gà Cay & Cà Phê Đen',
          dialogue: [
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Vẫn trực đêm một mình à? Trung tâm điều phối vừa phát lại thông báo tìm người mất tích tên Marcus ngay tại địa chỉ này.' },
            { speaker: 'Duck', text: 'Họ có tìm thấy thêm manh mối nào ngoài chiếc xe với cái mũ không?' },
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Chỉ thấy cục pin đèn pin lăn bên ngoài cửa hậu và dấu chân lún sâu vào bùn đất—chẳng còn gì khác.' },
            { speaker: 'Duck', text: 'Tuyệt vời. Vậy mà tôi vẫn phải mang túi rác ra đằng sau đó.' },
            { speaker: 'Nhân viên Cấp cứu Carter', text: 'Đêm nay nhớ cảnh giác bốn phía đấy. Làm giúp tôi suất gà cay và ly cà phê đen.' },
            { speaker: 'Duck', text: 'Tôi đang nấu ngay—đợi một chút nhé.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Du khách lạc đường',
          orderItem: 'Trà Nóng & Xô Gà Rán Giòn',
          dialogue: [
            { speaker: 'Clara Novak', text: 'Tôi vừa ghé trạm xăng cách đây hai dặm phía đông và nhân viên ở đó cảnh báo đừng ai vào quán McDonald’s này sau 2 giờ sáng.' },
            { speaker: 'Duck', text: 'Để tôi đoán—vì chuyện anh nhân viên ca đêm bị mất tích phải không?' },
            { speaker: 'Clara Novak', text: 'Cậu ấy kể người trực trước cậu cứ than có kẻ mặt bôi phấn trắng đứng nhìn mình chằm chằm qua cửa kính trước.' },
            { speaker: 'Duck', text: '...Đúng thứ tôi cần nghe trước giờ tan ca đấy. Cô muốn gọi món gì ạ?' },
            { speaker: 'Clara Novak', text: 'Chỉ cần trà nóng và một xô gà giòn để tôi còn nhanh chóng quay lại đường lớn.' },
            { speaker: 'Duck', text: 'Tôi làm ở bếp mang ra ngay.' },
          ],
        },
        {
          name: 'Báo Con',
          title: 'Nhóm Bạn Trốn Mẹ Đi Chơi Khuya',
          orderItem: 'Xô Gà Rán Cỡ Lớn, 3 Ly Cà Phê & Khoai Chiên',
          dialogue: [
            { speaker: 'Sam', text: 'Suỵt! Nói nhỏ thôi—tao vừa trèo cửa sổ trốn mẹ ra đây mà tim vẫn đập thình thịch nè!' },
            { speaker: 'Mia', text: 'Haha, đáng đồng tiền bát gạo! Mẹ tao mà biết tụi mình trốn đi ăn đêm giờ này là ăn chổi nguyên tháng luôn!' },
            { speaker: 'Leo', text: 'Sợ gì, tụi mình là hội Báo Con mà! Nạp lẹ đồ ăn đêm ở đây rồi kéo nhau ra quán nét chiến game tới sáng!' },
            { speaker: 'Duck', text: 'Nghe khét thế mấy đứa. Muốn ngồi bàn ăn lẹ luôn trước khi ra quán nét không?' },
            { speaker: 'Sam', text: 'Có chứ! Cho tụi em xô gà rán đại, khoai tây chiên với ba ly nước nóng—làm xong tụi em ngồi bàn góc ăn lẹ rồi đi nét!' },
            { speaker: 'Duck', text: 'Ok hội Báo Con! Đợi tôi 5 giây trong bếp.' },
          ],
        },
        {
          name: 'Ông Arthur Crump',
          title: 'Vị Khách Cáu Kỉnh',
          orderItem: 'Cà Phê Đen & Burger Thường',
          dialogue: [
            { speaker: 'Ông Arthur Crump', text: 'Hừ. Cuối cùng cũng có người đứng quầy. Cậu biết ngoài bãi xe lạnh cóng thế nào không hả?' },
            { speaker: 'Duck', text: 'Xin lỗi ông vì thời tiết ngoài đó. Ông muốn dùng món gì tối nay ạ?' },
            { speaker: 'Ông Arthur Crump', text: 'Miễn chào hỏi rườm rà đi. Cả thị trấn cứ xì xào chuyện nhân viên mất tích với rừng ma... toàn chuyện nhảm nhí.' },
            { speaker: 'Duck', text: 'Vâng. Vậy chỉ gọi món thôi ạ—ông muốn ăn gì?' },
            { speaker: 'Ông Arthur Crump', text: 'Một ly cà phê đen đặc và một cái burger thường. Làm nhanh và nóng lên, đừng làm mất thời gian của tôi.' },
            { speaker: 'Duck', text: '...Vâng. Chờ 5 giây trong bếp.' },
          ],
        },
      ],
      customersNight3: [
        {
          name: 'Thám tử Hall',
          title: 'Thám tử Điều tra Mất tích',
          orderItem: 'Cà Phê Đen & Suất Gà Rán Giòn',
          dialogue: [
            { speaker: 'Thám tử Hall', text: 'Chào cậu, Duck. Sau các báo cáo từ đêm qua, hồ sơ mất tích của Marcus tại quán này đã chính thức được đưa lên bàn điều tra cấp hạt.' },
            { speaker: 'Duck', text: 'Khoan—chính thức rồi ạ? Vậy là quản lý cuối cùng không thể giấu nhẹm chuyện của Marcus nữa sao?' },
            { speaker: 'Thám tử Hall', text: 'Không giấu nổi nữa khi người ta tìm thấy mảnh tạp dề rách của cậu ấy sau thùng rác. À mà… chẳng phải trước đây có bức tượng chú hề bắt vít gần quầy thu ngân sao?' },
            { speaker: 'Duck', text: 'Đúng rồi! Nhưng nó biến mất hoàn toàn trước khi anh John mở cửa tối nay. Chẳng ai biết ai đã mang nó đi.' },
            { speaker: 'Thám tử Hall', text: 'Một nhân viên mất tích và một bức tượng cao gần hai mét bốc hơi khỏi cửa hàng khóa kín… Nhớ trông chừng cửa kính. Cho tôi một cà phê đen và suất gà rán giòn.' },
            { speaker: 'Duck', text: 'Có ngay đây thưa thám tử. Đợi 5 giây trong bếp nhé.' },
          ],
        },
        {
          name: 'Phóng viên Zoe',
          title: 'Nhà báo Điều tra Đêm Khuya',
          orderItem: 'Latte Đá Gia Vị & 10 Miếng McNuggets',
          dialogue: [
            { speaker: 'Phóng viên Zoe', text: 'Chào cậu—chắc cậu là Duck. Từ lúc mọi người bắt đầu nói công khai về vụ mất tích của Marcus đêm qua, đường dây tin của tôi nổ máy liên tục về quán này.' },
            { speaker: 'Duck', text: 'Ai cũng hỏi về Marcus, còn bức tượng chú hề khổng lồ cạnh quầy cũng tự dưng biến mất luôn rồi.' },
            { speaker: 'Phóng viên Zoe', text: 'Khoan, tượng chú hề biến mất thật á?! Trong cuốn sổ cuối cùng, Marcus từng viết rằng bức tượng trông cao lớn hơn mỗi lần đèn nhấp nháy lúc 3 giờ sáng.' },
            { speaker: 'Duck', text: 'Làm ơn nói là chị đang đùa đi… Tôi vẫn phải trực một mình tới lúc đóng cửa đấy.' },
            { speaker: 'Phóng viên Zoe', text: 'Đứng gần chỗ sáng và giữ điện thoại đầy pin nhé. Lấy giúp tôi một ly latte đá và 10 miếng McNuggets trước khi tôi chạy tiếp dọc quốc lộ.' },
            { speaker: 'Duck', text: 'Có ngay. Đợi 5 giây ở quầy bếp.' },
          ],
        },
        {
          name: 'Phó Cảnh Sát Vance',
          title: 'Phó Cảnh Sát Trưởng Hạt',
          orderItem: 'Cà Phê Đen & Burger Gà Cay',
          dialogue: [
            { speaker: 'Phó Cảnh Sát Vance', text: 'Tôi quay lại kiểm tra sau Đêm 2 đây, Duck. Pháp y vừa thu được dấu vân tay trên xe của Marcus—và không phải của cậu ấy.' },
            { speaker: 'Duck', text: 'Dấu vân tay của ai trên xe anh Marcus vậy chú?!' },
            { speaker: 'Phó Cảnh Sát Vance', text: 'Là vết phấn hóa trang dày trộn lẫn dầu chiên gà. Khóa chặt cửa sau và tuyệt đối đừng bén mảng lại gần rặng cây.' },
            { speaker: 'Duck', text: 'Cháu rõ rồi. Chú vẫn dùng cà phê đen và gọi thêm món nóng chứ ạ?' },
            { speaker: 'Phó Cảnh Sát Vance', text: 'Một cà phê đen và burger gà cay. Làm nhanh để tôi còn tuần tra tiếp tuyến quốc lộ.' },
            { speaker: 'Duck', text: 'Cháu làm ngay đây—5 giây trong bếp.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Thợ sửa ống nước vui tính',
          orderItem: 'Xô Gà Rán Giòn & Espresso Đôi',
          dialogue: [
            { speaker: 'Big Ray', text: 'Wahoo! Đêm thứ ba rồi mà Duck vẫn trụ vững quá nha! Khoan đã—bức tượng chú hề tóc đỏ cao nghều đâu mất tiêu rồi?!' },
            { speaker: 'Duck', text: 'Thật lòng thì trước khi tôi vào ca nó đã biến mất rồi anh Big Ray ạ. Không ai biết ai dời đi.' },
            { speaker: 'Big Ray', text: 'Mamma mia! Biết đâu nó chui tọt xuống ống cống xanh khổng lồ như con Goomba rồi! Trống góc đó nhìn cũng ớn thật!' },
            { speaker: 'Duck', text: 'Ừ, vắng nó nhìn sảnh quán cứ rờn rợn sao ấy. Vẫn combo tăng lực như mọi khi chứ ạ?' },
            { speaker: 'Big Ray', text: 'Chuẩn bài! Một xô gà rán giòn rụm và một ly espresso đôi nóng bỏng! Let’s-a go!' },
            { speaker: 'Duck', text: 'Có ngay đây Big Ray! Đợi 5 giây trong bếp.' },
          ],
        },
        {
          name: 'Báo Con',
          title: 'Nhóm Bạn Trốn Mẹ Đi Chơi Khuya',
          orderItem: 'Xô Gà Rán Đại, 3 Nước Ngọt & Khoai Chiên Lớn',
          dialogue: [
            { speaker: 'Sam', text: 'Ồ, nhìn góc quán kìa—bức tượng chú hề rợn người biến mất tiêu luôn rồi!' },
            { speaker: 'Mia', text: 'Càng tốt! Lần nào tụi mình trốn ra đây ăn đêm tao cũng thấy nó rình rập phát khiếp!' },
            { speaker: 'Leo', text: 'Kệ cái tượng đi, hội Báo Con cần nạp năng lượng chiến giải game xuyên đêm ngoài quán nét!' },
            { speaker: 'Duck', text: 'Mấy đứa chẳng bao giờ chịu ngủ à? Vẫn xô đồ ăn vặt như cũ nhé?' },
            { speaker: 'Sam', text: 'Dạ! Xô gà giòn, khoai chiên lớn với ba ly nước ngọt lạnh nhé!' },
            { speaker: 'Duck', text: 'Đợi năm giây trong bếp nhé!' },
          ],
        },
      ],
      driveThruCustomers: [
        {
          name: 'Tài xế Mike',
          title: 'Khách Drive-Thru',
          orderItem: 'Combo Gà Giòn & Cà Phê Đen',
          dialogue: [
            { speaker: 'Tài xế Mike', text: 'Chào cậu! May quá cửa sổ Drive-Thru giờ này vẫn còn mở.' },
            { speaker: 'Duck', text: 'Chào anh ghé Drive-Thru! Anh muốn gọi món gì tối nay?' },
            { speaker: 'Tài xế Mike', text: 'Cho một combo gà giòn với ly cà phê đen nóng—vừa xong ca đêm ngoài ga tàu.' },
            { speaker: 'Duck', text: 'Rõ rồi! Đợi ngay cửa sổ, tôi nấu trong bếp 5 giây là có ngay.' },
          ],
        },
        {
          name: 'Shipper Hana',
          title: 'Tài xế giao hàng khuya',
          orderItem: 'Xô Gà Rán & Cà Phê Mocha',
          dialogue: [
            { speaker: 'Shipper Hana', text: 'Chào nhé! Nãy rẽ vào làn Drive-Thru tôi thoáng thấy bóng ai đứng gần hàng rào sau...' },
            { speaker: 'Duck', text: 'Chắc chỉ là bóng rặng thông thôi chị. Tối nay chị gọi món gì?' },
            { speaker: 'Shipper Hana', text: 'Một xô gà rán với cà phê nóng cho tỉnh táo nốt chuyến giao hàng cuối!' },
            { speaker: 'Duck', text: 'Có ngay đây! Chờ tôi 5 giây trong bếp nhé.' },
          ],
        },
        {
          name: 'Tài xế Taxi Ben',
          title: 'Tài xế Taxi nửa đêm',
          orderItem: 'Burger Phô Mai Đôi & Latte McCafé',
          dialogue: [
            { speaker: 'Tài xế Taxi Ben', text: 'Phù, sương mù ngoài Quốc lộ 9 dày đặc luôn! Cho tôi gọi phần ăn qua cửa sổ nhé?' },
            { speaker: 'Duck', text: 'Được luôn chú ơi! Chú muốn dùng món gì ạ?' },
            { speaker: 'Tài xế Taxi Ben', text: 'Phần gà rán giòn với ly latte nóng để còn tỉnh táo lái xe về nhà.' },
            { speaker: 'Duck', text: '5 giây trong bếp là xong ngay—chú chờ chút nhé!' },
          ],
        },
      ],
    },
  },

  ru: {
    languageName: 'Русский',
    languageLabel: 'Язык',
    loading: {
      badge: 'Протокол инициализации системы',
      subtitle: 'Психологический хоррор: Демо на 2 ночи',
      messages: [
        'Подключение к электросети ресторана…',
        'Калибровка раздвижных дверей и датчиков движения…',
        'Проверка систем безопасности и камер видеонаблюдения…',
        'Инициализация журнала передачи ночной смены…',
        'Подготовка к вашей ночной смене…',
        'Открытие ресторана…',
      ],
      footerHints: ['Автоматические двери', 'ИИ посетителей', 'Атмосферный звук'],
    },
    menu: {
      est: 'ОСН. 1955',
      nightShift: 'Ночная смена',
      survivalHorror: 'Хоррор на выживание',
      outsideClearing: 'Поляна снаружи',
      storeActive: '● Ресторан открыт',
      description:
        "Примерьте роль Дака в ночную смену в одиноком ресторане McDonald's посреди мрачного леса. Примите смену у Джона, готовьте заказы для гостей, доживите до 6:00 утра и следите за тенями снаружи.",
      tipBefore: 'Совет: Нажмите',
      tipRun: 'для бега на ПК или',
      tipMobile: 'на телефоне!',
      playNight1: 'ИГРАТЬ: НОЧЬ 1',
      firstShift: 'Первая смена',
      playNight2: 'ИГРАТЬ: НОЧЬ 2',
      playNight3: 'ИГРАТЬ: НОЧЬ 3',
      locked: '(ЗАБЛОКИРОВАНО)',
      somethingWrong: 'Что-то не так',
      theFinalDemoNight: 'Статуя сдвинулась',
      bgmLabel: 'Музыка: Cold Glass Passage',
      unmute: 'ВКЛ. ЗВУК',
      musicOn: 'МУЗЫКА ВКЛ',
      controls: 'Управление',
      settings: 'Настройки',
      credits: 'Об игре',
      storyRuleLabel: 'Правило сюжета:',
      storyRule:
        'Отработайте обе 6-часовые ночные смены до 6:00 утра, раскройте слухи о пропавшем бывшем сотруднике и будьте начеку, когда кто-то следит из темноты.',
      shiftMemo: 'Памятка смены',
      employeeRoutine: 'Распорядок сотрудника',
      memoItems: [
        'Ночь 1: Поговорите с Джоном, отметьтесь, протрите столы, соберите мусор, отключите фритюрницы и обслужите поздних гостей.',
        'Ночь 2: Поговорите с Джоном о пропавшем сотруднике, включите рубильник, вытрите лужу, вынесите картон, проверьте автораздачу, камеры и гостей.',
        'Фонарик работает без ограничений; при необходимости загляните в новый туалет к западу от зала.',
        'Если во время готовки замигает свет на кухне, спокойно дождитесь конца 5 секунд.',
      ],
      settingsTitle: 'Настройки игры',
      graphicsQuality: 'Качество графики',
      qualityLevels: { low: 'НИЗКОЕ', medium: 'СРЕДНЕЕ', high: 'ВЫСОКОЕ' },
      audioVolume: 'Громкость звука',
      mouseSensitivity: 'Чувствительность мыши',
      invertLook: 'Инверсия оси Y',
      crtFilter: 'Ретро ЭЛТ-фильтр',
      enabled: 'ВКЛ',
      disabled: 'ВЫКЛ',
      applyClose: 'Применить и закрыть',
      controlsTitle: 'Управление',
      controlsList: [
        { key: 'W, A, S, D', desc: 'Ходьба / Движение' },
        { key: 'Мышь', desc: 'Осмотр и поворот камеры' },
        { key: 'Shift', desc: 'Бег' },
        { key: 'C', desc: 'Присесть' },
        { key: 'F', desc: 'Фонарик (без ограничений)' },
        { key: 'E', desc: 'Поговорить с Джоном / гостями / действие' },
        { key: 'ESC', desc: 'Пауза / Выйти из камер CCTV' },
      ],
      understood: 'Понятно',
      creditsTitle: 'Об игре и лор',
      creditsIntro:
        "McDonald's Nightfall — двухночный психологический хоррор о работе в ночную смену.",
      creditsDetails: [
        { label: 'Тема', value: 'Ночная смена в фастфуде и нарастающая тревога' },
        { label: 'Формат', value: '2 полноценные ночи (00:00 – 6:00 утра)' },
        { label: 'Движок', value: 'Three.js 3D WebGL и Web Audio API' },
        { label: 'Сюжет', value: 'Узнайте, что случилось с пропавшим бывшим сотрудником ночной смены.' },
      ],
      returnMenu: 'Назад в меню',
      versionLabel: 'Версия 1.4.0',
    },
    hud: {
      nightShiftEmployee: (night) => `Ночь ${night} — Сотрудник: Дак`,
      stepLabel: (step) => `Шаг ${step}`,
      allDutiesDone: 'Все обязанности на эту смену выполнены!',
      shiftClock: 'Время смены',
      dawnLabel: 'РАССВЕТ (6:00 УТРА)',
      closingLabel: 'КОНЕЦ СМЕНЫ В 6:00',
      escPause: 'ESC / ПАУЗА',
      stamina: 'Выносливость',
      stance: 'ПОЗА:',
      crouched: '[C] ПРИСЕД',
      standing: '[C] СТОЯ',
      carryingFood:
        '🍗 В руках готовое блюдо — поставьте поднос на стол выдачи перед гостем',
      carryingRawFry:
        '🥩 В руках сырая курица и картошка — положите во фритюрницу (5 с)',
      carryingBigMac:
        '🍔 В руках Биг Мак — положите в микроволновку (5 с)',
      carryingCoffeeCup:
        '☕ В руках стакан для кофе — поставьте в кофемашину (3 с)',
      carryingSodaCup:
        '🥤 В руках стакан для газировки — поставьте в автомат газировки (3 с)',
      carryingSpoiledFood:
        '⚠️ В руках испорченная еда (отключили свет!) — выбросите её в мусорное ведро или контейнер',
      carryingChickenTray:
        '❄️ В руках лоток с курицей из морозилки — пополните запас на кухонном столе',
      carryingNoodlesAndDrink:
        '🍜 В руках лапша и красный энергетик — идите к машине Дака снаружи',
      carryingMop: '🧹 В руках швабра — вымойте все 8 грязных луж на полу',
      carryingTrash: '📦 В руках пакеты с мусором (отнесите в контейнер сзади)',
      carryingCardboard: '📦 В руках стопка картона (отнесите в контейнер сзади)',
      heavyWorklight: 'Фонарь [F]',
      unlimited: 'БЕЗЛИМИТ',
      status: 'СТАТУС:',
      beamActive: 'ВКЛЮЧЁН',
      beamOff: 'ВЫКЛЮЧЕН',
      phoneHint: 'ТЕЛЕФОН [P]',
    },
    pause: {
      title: 'ПАУЗА',
      resume: 'Продолжить смену',
      restartNight: 'Начать ночь заново',
      mainMenu: 'Главное меню',
      volume: 'Громкость',
      sensitivity: 'Чувствительность',
    },
    dialogue: {
      internal: '(Мысли)',
      internalThoughts: 'Внутренние мысли',
      transmitting: 'Передача...',
      received: 'Получено',
      scrambled: 'Помехи сигнала...',
      pressHint: 'Нажмите [E], Пробел или кликните',
      skip: '[E] Пропустить',
      skipBtn: 'Пропустить',
      next: '[E] Далее',
      close: '[E] Закрыть',
      continueBtn: 'Продолжить',
    },
    cctv: {
      rec: 'ЗАП',
      header: "СИСТЕМА ВИДЕОНАБЛЮДЕНИЯ MCDONALD'S",
      live: 'ЭФИР',
      exitOffice: 'ВЫЙТИ В ОФИС [ESC]',
      anomalies: '⚠️ ОБНАРУЖЕНЫ МНОЖЕСТВЕННЫЕ АНОМАЛИИ ДВИЖЕНИЯ',
      signal: 'КАЧЕСТВО СИГНАЛА: 94%',
      matrixTitle: 'Терминал камер',
      switchHint: 'Клавиши [1] - [5] для переключения',
      cameras: [
        { id: 1, name: 'КАМ 01', label: 'ОСНОВНОЙ ЗАЛ' },
        { id: 2, name: 'КАМ 02', label: 'КАССА' },
        { id: 3, name: 'КАМ 03', label: 'КУХНЯ' },
        { id: 4, name: 'КАМ 04', label: 'МУСОРНЫЙ КОНТЕЙНЕР' },
        { id: 5, name: 'КАМ 05', label: 'ПАРКОВКА И ДОРОГА' },
      ],
    },
    mobile: {
      touchOn: '🎮 СЕНСОР ВКЛ',
      pcControls: '⌨️ УПРАВЛЕНИЕ ПК',
      move: 'ХОДЬБА',
      crouch: 'ПРИСЕД',
      light: 'СВЕТ',
      pause: 'ПАУЗА',
      run: 'БЕГ',
      running: 'БЕЖИТ',
      action: 'ДЕЙСТВИЕ',
      phone: 'ТЕЛЕФОН',
    },
    phone: {
      title: 'ТЕЛЕФОН ДАКА',
      carrier: 'NIGHTCALL 4G',
      back: 'Назад',
      close: 'Закрыть [P]',
      apps: { calls: 'Звонки', messages: 'Сообщения', camera: 'Камера' },
      emergencyBanner: 'ВЫ ЗАПЕРТЫ В МАШИНЕ — ПОЗВОНИТЕ 911 И НАПИШИТЕ ДЖОНУ!',
      emergencyDone: 'Полиция и Джон предупреждены! Пригнитесь в салоне...',
      contacts: {
        mom: 'Мама',
        landlord: 'Мистер Хендерсон (Хозяин)',
        john: 'Джон (Коллега)',
        police: 'Служба спасения 911',
      },
      callsTab: {
        callBtn: 'Позвонить',
        callingStatus: (name) => `Вызов ${name}...`,
        connectedStatus: (name) => `На связи — ${name}`,
        momLine: 'Даки? Почему звонишь так поздно? Запри двери и сразу езжай домой после смены!',
        landlordLine: 'Аренда уже просрочена. Если не принесёшь деньги к пятнице, я сменю замки.',
        policeReady: '911: Оставайтесь в запертой машине и не высовывайтесь — патруль уже мчится к McDonald’s на 9-м шоссе!',
        policeIdle: 'Линия 911. Звоните только при реальной угрозе жизни.',
        calledPoliceBadge: 'Вызов в 911',
      },
      messagesTab: {
        sendEmergencyJohn: 'Написать Джону: SOS! Клоун у моей машины!',
        sentToJohnBadge: 'Отправлено Джону',
        momThread: [
          { from: 'Мама', time: '23:42', text: 'Ты взял тёплую куртку? На 9-м шоссе сильный туман.' },
          { from: 'Duck', time: '23:45', text: 'Да, мам, я уже на месте.' },
        ],
        landlordThread: [
          { from: 'Хозяин', time: '18:15', text: 'Напоминаю: долг за аренду $850. Жду оплату завтра.' },
        ],
        johnThread: [
          { from: 'Джон', time: '00:08', text: 'Не своди глаз с двери, если свет начнёт мигать. Пиши, если будет что-то странное.' },
        ],
        johnHelpOutgoing:
          'ДЖОН ПОМОГИ!! Убийца-клоун гнался за мной до машины, бензин кончился и он только что треснул стекло!! Звоню в полицию!',
        johnHelpReply:
          'ДЕРЖИСЬ ДАК!! Не открывай двери и пригнись ниже стёкол — я уже вызвал шерифа и мчусь обратно!',
      },
      cameraTab: {
        takePhoto: 'Сделать фото',
        retake: 'Снять ещё',
        emptyGallery: 'Снимков пока нет. Наведите камеру и нажмите Сделать фото.',
        savedCount: (n) => `Сохранено фото: ${n}`,
      },
    },
    night3CarChoice: {
      title: 'СТЕКЛО ТРЕСНУЛО — ЧТО ДЕЛАТЬ?',
      subtitle: 'В машине нет бензина. Клоун захохотал и отошёл в темноту.',
      optionExit: 'Выйти из машины',
      optionExitSub: 'Попытаться убежать пешком по парковке',
      optionHide: 'Спрятаться в машине, вызвать полицию и написать Джону',
      optionHideSub: 'Пригнуться в салоне и вызвать помощь по телефону',
    },
    victory: {
      night1Over: 'Ночная смена 1 завершена',
      theFirstShift: 'ПЕРВАЯ СМЕНА',
      night1Story1:
        'Дак отметил окончание смены и вышел через автоматические раздвижные двери в сырой утренний воздух.',
      night1Story2:
        'Оглянувшись сквозь переднее стекло, Дак увидел клоуна-маскота посреди тёмного зала: тот стоял совершенно неподвижно и смотрел прямо на выход.',
      night1Sub: 'Он не погнался за Даком. Он даже не шелохнулся. Он просто смотрел.',
      beginNight2: 'Начать Ночь 2: Что-то не так',
      mainMenu: 'Главное меню',
      night2Over: 'Ночная смена 2 завершена',
      theSecondShift: 'ВТОРАЯ СМЕНА',
      night2Story1:
        'Ровно в 6:00 утра Дак сдал утренний журнал и поспешил мимо пустых столиков на сырую парковку.',
      night2Story2:
        'Но он не мог выбросить из головы лицо, заглядывавшее в стеклянную дверь во время последнего заказа, и шёпот о бывшем сотруднике, который так и не закрыл смену.',
      night2Sub: 'Когда Дак отдал еду и снова оглянулся на вход, фигура за дверью уже исчезла.',
      beginNight3: 'Продолжить: Ночь 3',
      playNight2Again: 'Сыграть Ночь 2 снова',
      playAgain: 'Сыграть Ночь 1 снова',
    },
    night3Ending: {
      scrollingMessage:
        'Примечание: Когда приехала полиция, им так и не удалось поймать того клоуна — они лишь нашли меня в ужасе сидящим в машине, а стекло автомобиля было треснутым и заляпанным его кровью.\n\nЯ успел добраться домой вовремя… кто был этот клоун? Неужели он меня заметил? Я не могу уволиться с работы, потому что ещё не заплатил за аренду. Если уйду — окажусь на улице. Эх, ладно, не важно…',
      badEndingTitle: 'ПЛОХАЯ КОНЦОВКА (ENDING BAD)',
      badEndingMessage:
        'Плохая концовка. Вас поймал этот клоун и превратил в жареную курицу — любимое блюдо посетителей. На самом деле статуя клоуна была самим клоуном: две ночи подряд он стоял неподвижно, как изваяние, словно ничего не происходило.',
      pressToFinishTyping: 'Кликните или нажмите Space / E, чтобы показать весь текст',
      continueToCredits: 'Продолжить',
      demoOverTitle: 'ДЕМО ЗАВЕРШЕНО',
      demoOverSubtitle: "ДЕМОНСТРАЦИЯ ОКОНЧЕНА — MCDONALD'S NIGHTFALL",
      creditsHeading: 'ТИТРЫ',
      creditRows: [
        { role: 'Автор и режиссёр', name: 'Nguyen Duck' },
        { role: '3D-мир и движок', name: 'Three.js WebGL Architecture' },
        { role: 'Звук и музыка', name: 'Web Audio Synthesis & Shift OST' },
        { role: 'Персонажи', name: 'Дак, Джон, Медсестра Рамирес, Большой Рэй, Детёныши леопарда и Клоун' },
      ],
      thankYouNote: 'Спасибо за игру в демо-версию McDonald’s Nightfall.',
      returnToMenu: 'В главное меню',
    },
    engine: {
      steps: {
        talk_to_john: {
          title: 'ПОГОВОРИТЬ С ДЖОНОМ',
          description: 'Зайдите внутрь через раздвижные двери и поговорите с Джоном, чтобы принять ночную смену.',
        },
        clock_in: {
          title: 'ОТМЕТИТЬСЯ НА СМЕНЕ',
          description: 'Подойдите к табельным часам возле кассы и отметьте начало смены.',
        },
        clean_tables: {
          title: 'УБРАТЬ СТОЛЫ',
          description: (count) => `Протрите и продезинфицируйте грязные столы в зале (${count}/2).`,
        },
        mop_puddles: {
          title: 'ВЫМЫТЬ ГРЯЗНЫЕ ЛУЖИ',
          description: (count) =>
            `Возьмите швабру в углу офиса охраны и вытрите все грязные лужи (${count}/8).`,
        },
        collect_trash: {
          title: 'СОБРАТЬ МУСОР',
          description: (count) => `Соберите пакеты с мусором из зала (${count}/2).`,
        },
        dump_trash: {
          title: 'ВЫНЕСТИ МУСОР',
          description: 'Вынесите мусор через заднюю дверь кухни в уличный контейнер.',
        },
        kitchen_fryers: {
          title: 'ПРОВЕРИТЬ КУХНЮ',
          description: 'Отключите кухонные фритюрницы и нагревательное оборудование.',
        },
        check_cctv: {
          title: 'ПРОВЕРИТЬ КАМЕРЫ',
          description: 'Осмотрите монитор видеонаблюдения в комнате охраны.',
        },
        finish_shift: {
          title: 'ДОЖИТЬ ДО 6:00 УТРА',
          description: 'Подготовка завершена. Посетители уже едут. Обслуживайте заказы и продержитесь до 6:00 утра.',
          ready6am: 'Наступило 6:00 утра! Завершите смену и выйдите через главный вход.',
        },
        n2_clock_in: {
          title: 'ОТМЕТИТЬСЯ НА СМЕНЕ',
          description: 'Отметьте начало 2-й смены на табельных часах.',
        },
        n2_breaker: {
          title: 'РУБИЛЬНИК ПИТАНИЯ',
          description: 'Включите резервный рубильник обслуживания в офисе охраны.',
        },
        n2_mop_puddle: {
          title: 'ВЫМЫТЬ ГРЯЗНЫЕ ЛУЖИ',
          description: (count) =>
            `Возьмите швабру в углу офиса охраны и вытрите все 8 грязных луж (${count}/8).`,
        },
        n2_cardboard: {
          title: 'СДАТЬ КАРТОН',
          description: 'Вынесите связку картона в уличный мусорный контейнер.',
          carryDesc: 'Выбросите картон в уличный контейнер.',
        },
        n2_drive_thru: {
          title: 'ПРОВЕРКА ОКНА АВТОРАЗДАЧИ',
          description: 'Осмотрите прозрачное окно обслуживания авто-раздачи на восточной стене.',
        },
        n2_cctv_final: {
          title: 'ПРОВЕРИТЬ КАМЕРЫ',
          description: 'Проверьте камеры наблюдения в офисе охраны перед закрытием.',
        },
        n3_clock_in: {
          title: 'ОТМЕТИТЬСЯ НА СМЕНЕ',
          description: 'Отметьте начало 3-й смены на табельных часах у кассы.',
        },
        n3_clean_tables: {
          title: 'ПРОТЕРЕТЬ СТОЛЫ',
          description: (count) => `Протрите столики (${count}/2). Странно, что статуя клоуна бесследно исчезла.`,
        },
        n3_kitchen_check: {
          title: 'ВКЛЮЧИТЬ ФРИТЮРНИЦУ',
          description: 'Проверьте выключатель фритюрницы на кухне перед приходом ночных гостей.',
        },
      },
      dynamicObjectives: {
        preparingTitle: 'ПРИГОТОВЛЕНИЕ ЗАКАЗА...',
        preparingDesc: (sec) => `Готовка и варка кофе на кухне (осталось ${sec} с). Свет мигает!`,
        prepFoodTitle: 'ПРИГОТОВИТЬ ЗАКАЗ ГОСТЯ',
        prepFoodDesc: (name) =>
          `Идите на кухню, приготовьте еду и кофе для ${name} (подождите 5 секунд).`,
        serveTitle: 'ОТДАТЬ ЗАКАЗ ГОСТЮ',
        serveDesc: (name) => `Отнесите горячий поднос из рук гостю ${name} на кассу.`,
        serveDriveThruDesc: (name) =>
          `Передайте горячий поднос гостю ${name} через окно авто-раздачи.`,
        restockFreezerTitle: 'ВЗЯТЬ КУРИЦУ В МОРОЗИЛКЕ',
        restockFreezerDesc:
          'На кухне закончилась курица! Зайдите в морозильную камеру за кухней и возьмите лоток с курицей.',
        restockKitchenTitle: 'ПОПОЛНИТЬ ЗАПАС НА КУХНЕ',
        restockKitchenDesc:
          'Отнесите лоток с курицей в руках на рабочий стол кухни, чтобы пополнить запас.',
        checkBathroomTitle: 'ПРОВЕРИТЬ ТУАЛЕТ',
        checkBathroomDesc:
          'Из туалета донёсся странный стук! Зайдите внутрь и проверьте, кто там.',
        powerOutageTitle: 'ПРОВЕРИТЬ ЭЛЕКТРОЩИТОК (3:00)',
        powerOutageDesc: 'Внезапно погас свет! Выйдите за заднюю стену магазина и проверьте электрощиток.',
        powerOutageWithFoodDesc:
          'Свет погас и гость ушёл! Проверьте электрощиток сзади и выбросите еду из рук в мусор.',
        discardFoodTitle: 'ВЫБРОСИТЬ ЕДУ В МУСОР',
        discardFoodDesc:
          'Посетитель ушёл во время отключения света. Выбросите оставшуюся в руках еду в мусорное ведро или контейнер.',
        hungerFadeTitle: 'ГОЛОД ПОСЛЕ СМЕНЫ',
        hungerFadeDesc: 'Дак направляется в 67-Eleven, чтобы купить перекус перед концом смены...',
        store67NoodlesTitle: 'ПОДОЙТИ К СТЕЛЛАЖУ NOODLES & WATER',
        store67NoodlesDesc:
          'Зайдите в 67-Eleven к полке лапши и воды и возьмите лапшу с красным энергетиком.',
        store67CashierTitle: 'ОПЛАТИТЬ НА КАССЕ 67-ELEVEN',
        store67CashierDesc: 'Подойдите к сотруднику 67-Eleven за кассой, чтобы оплатить покупки.',
        store67CarTitle: 'ВЕРНУТЬСЯ К МАШИНЕ ДАКА',
        store67CarDesc: 'Выйдите из 67-Eleven к припаркованной синей машине, чтобы завершить смену.',
        goToMcdCarTitle: 'СЕСТЬ В МАШИНУ И УЕХАТЬ ДОМОЙ',
        goToMcdCarDesc: 'Клоун стоит внутри ресторана, смотрит на вас и жутко смеётся! Бегите к своей синей машине и поезжайте прямо домой.',
        pickupFryTitle: 'ШАГ 1: ВЗЯТЬ КУРИЦУ И КАРТОШКУ В РУКИ',
        pickupFryDesc: (name) =>
          `Возьмите сырую курицу и картошку на столе кухни для ${name}.`,
        fryChickenTitle: 'ШАГ 2: ПОЛОЖИТЬ ВО ФРИТЮРНИЦУ',
        fryChickenDesc: (name) =>
          `Положите курицу и картошку из рук во фритюрницу для ${name} (5 с).`,
        fryingProgressTitle: 'ЖАРКА КУРИЦЫ И КАРТОШКИ...',
        fryingProgressDesc: (sec) => `Шкварчит и дымит во фритюрнице (осталось ${sec} с)...`,
        pickupBurgerTitle: 'ШАГ 3: ВЗЯТЬ БИГ МАК В РУКИ',
        pickupBurgerDesc: (name) =>
          `Возьмите Биг Мак на кухонном столе для ${name}.`,
        microwaveTitle: 'ШАГ 4: ПОЛОЖИТЬ БИГ МАК В МИКРОВОЛНОВКУ',
        microwaveDesc: (name) =>
          `Положите Биг Мак из рук в микроволновку для ${name} (5 с).`,
        microwavingProgressTitle: 'РАЗОГРЕВ БИГ МАКА...',
        microwavingProgressDesc: (sec) => `Греется в микроволновке (осталось ${sec} с)...`,
        pickupCoffeeCupTitle: 'НАПИТОК: ВЗЯТЬ СТАКАН ДЛЯ КОФЕ',
        pickupCoffeeCupDesc: (name) =>
          `Возьмите пустой кофейный стакан со стола кухни для ${name}.`,
        coffeeMachineTitle: 'СВАРИТЬ КОФЕ В КОФЕМАШИНЕ',
        coffeeMachineDesc: (name) =>
          `Поставьте стакан в кофемашину для ${name} и подождите 3 секунды.`,
        brewingCoffeeProgressTitle: 'ВАРИМ КОФЕ...',
        brewingCoffeeProgressDesc: (sec) => `Кофемашина наливает горячий кофе (осталось ${sec} с)...`,
        pickupSodaCupTitle: 'НАПИТОК: ВЗЯТЬ СТАКАН ДЛЯ ГАЗИРОВКИ',
        pickupSodaCupDesc: (name) =>
          `Возьмите пустой стакан для напитка со стола кухни для ${name}.`,
        sodaDispenserTitle: 'НАЛИТЬ ГАЗИРОВКУ В АВТОМАТЕ',
        sodaDispenserDesc: (name) =>
          `Поставьте стакан в автомат с газировкой для ${name} и подождите 3 секунды.`,
        pouringSodaProgressTitle: 'НАЛИВАЕМ ГАЗИРОВКУ...',
        pouringSodaProgressDesc: (sec) => `Наливается газировка со льдом (осталось ${sec} с)...`,
        wrapFoodTitle: 'ПРИНЕСТИ ВСЁ НА СТОЛ КУХНИ И УПАКОВАТЬ',
        wrapFoodDesc: (name) =>
          `Принесите всю еду и напитки обратно на стол кухни и аккуратно упакуйте для ${name} (2 с).`,
        wrappingProgressTitle: 'УПАКОВКА ЗАКАЗА...',
        wrappingProgressDesc: (sec) => `Упаковываем еду и напитки на кухне (осталось ${sec} с)...`,
        pickupFinishedTitle: 'ВЗЯТЬ ГОТОВОЕ БЛЮДО СО СТОЛА КУХНИ',
        pickupFinishedDesc: (name) =>
          `Возьмите готовое блюдо со стола кухни и поставьте на стол выдачи для ${name}.`,
        night3CarEmergencyTitle: 'СПРЯТАТЬСЯ И ВЫЗВАТЬ ПОМОЩЬ',
        night3CarEmergencyDesc:
          'Пригнитесь в машине! Откройте Телефон [P], позвоните в полицию (911) и напишите Джону.',
      },
      notices: {
        completed: (title) => `ВЫПОЛНЕНО: ${title}`,
        newTaskPrep: (name) => `НОВАЯ ЗАДАЧА: ПРИГОТОВИТЬ ЕДУ ДЛЯ ${name.toUpperCase()}`,
        orderCompleted: (price) => `ЗАКАЗ ВЫПОЛНЕН: $${price}`,
        prepStarted: 'ГОТОВИМ ЗАКАЗ ГОСТЯ... (осталось 5 с)',
        prepInProgress: (sec) => `Готовится (осталось ${sec} с)... Пожалуйста, подождите!`,
        mealInHands: 'Заказ уже у вас в руках! Отдайте его гостю.',
        noPendingOrders: 'Сейчас нет активных заказов. Дождитесь посетителя.',
        orderReady: 'ЗАКАЗ ГОТОВ! Он у вас в руках. Отнесите его гостю.',
        shiftEnds6am: (timeStr) =>
          `Смена заканчивается ровно в 6:00 утра. Сейчас ${timeStr}. Продолжайте обслуживать гостей до рассвета.`,
        shiftSkipped6am: 'ПОСЛЕДНИЙ ГОСТЬ ОБСЛУЖЕН — ЧАСЫ ПЕРЕВЕДЕНЫ НА 6:00 УТРА!',
        powerOutage: '⚡ 3:00 — ОТКЛЮЧЕНИЕ СВЕТА! ПРОВЕРЬТЕ ЭЛЕКТРОЩИТОК ЗА МАГАЗИНОМ!',
        powerRestored: '⚡ ЭЛЕКТРИЧЕСТВО ВОССТАНОВЛЕНО — РУБИЛЬНИК ВКЛЮЧЕН',
        mopPickedUp: '🧹 ВЫ ВЗЯЛИ ШВАБРУ — ВЫТРИТЕ ВСЕ 8 ГРЯЗНЫХ ЛУЖ',
        mopRequired: '⚠️ СНАЧАЛА НУЖНА ШВАБРА! Возьмите её в углу офиса охраны.',
        foodDiscarded: '🗑️ ОСТАВШАЯСЯ ЕДА ВЫБРОШЕНА В МУСОР',
        discardFoodFirst: '⚠️ СНАЧАЛА ВЫБРОСИТЕ ИСПОРЧЕННУЮ ЕДУ ИЗ РУК В МУСОР!',
        outOfFood: '❄️ НА КУХНЕ ЗАКОНЧИЛАСЬ КУРИЦА! ЗАЙДИТЕ В МОРОЗИЛЬНУЮ КАМЕРУ!',
        chickenTrayPickedUp: '🍗 ЛОТОК С КУРИЦЕЙ В РУКАХ — ОТНЕСИТЕ НА КУХНЮ!',
        kitchenRestocked: '✅ ЗАПАС КУРИЦЫ НА КУХНЕ ПОПОЛНЕН!',
        restockFoodFirst: '⚠️ ЗАПАС ЗАКОНЧИЛСЯ! Сначала возьмите лоток с курицей в морозильной камере.',
        bathroomKnock: '🚪 СТРАННЫЙ СТУК ИЗ ТУАЛЕТА! ПРОВЕРЬТЕ!',
        bathroomNothingHere: 'Ничего не обнаружено — в туалете пусто.',
        driveThruArrived: '🚗 К ОКНУ АВТОРАЗДАЧИ ПОДЪЕХАЛА МАШИНА!',
        duckHungry: '🍜 ДАК ПРОГОЛОДАЛСЯ — ОТПРАВЛЯЕМСЯ В 67-ELEVEN!',
        arrived67Eleven: '🏪 ВЫ В 67-ELEVEN — ПОДОЙДИТЕ К СТЕЛЛАЖУ С ЛАПШОЙ И ВОДОЙ',
        pickedUpNoodlesDrink: '🥤 ЛАПША И КРАСНЫЙ ЭНЕРГЕТИК ВЗЯТЫ — ОПЛАТИТЕ НА КАССЕ',
        paidAt67Eleven: '💵 ОПЛАЧЕНО $10 — ИДИТЕ К МАШИНЕ ДАКА, ЧТОБЫ ЗАВЕРШИТЬ НОЧЬ',
        statueMoved: '🤡 СТАТУЯ КЛОУНА ИСЧЕЗЛА... ДЖОН НЕ ЗНАЕТ, КУДА ОНА ДЕЛАСЬ.',
        clownWatchingCar: '🤡 КЛОУН СТОИТ В МАГАЗИНЕ И ЖУТКО СМЕЁТСЯ! БЕГИТЕ К МАШИНЕ!',
        rawFryInHand: '🥩 КУРИЦА И КАРТОШКА В РУКАХ — ПОЛОЖИТЕ ВО ФРИТЮРНИЦУ!',
        needRawFryInHand: '⚠️ СНАЧАЛА ВОЗЬМИТЕ КУРИЦУ И КАРТОШКУ НА СТОЛЕ КУХНИ!',
        fryStarted: '🍟 ЗАГРУЖЕНО ВО ФРИТЮР! ЖАРИМ... (5 с)',
        fryDone: '✅ ГОТОВО! ВОЗЬМИТЕ БИГ МАК НА СТОЛЕ КУХНИ!',
        bigMacInHand: '🍔 БИГ МАК В РУКАХ — ПОЛОЖИТЕ В МИКРОВОЛНОВКУ!',
        needBigMacInHand: '⚠️ СНАЧАЛА ВОЗЬМИТЕ БИГ МАК НА СТОЛЕ КУХНИ!',
        coffeeCupInHand: '☕ СТАКАН ДЛЯ КОФЕ В РУКАХ — ПОСТАВЬТЕ В КОФЕМАШИНУ (3 с)!',
        needCoffeeCupInHand: '⚠️ СНАЧАЛА ВОЗЬМИТЕ СТАКАН ДЛЯ КОФЕ НА СТОЛЕ КУХНИ!',
        coffeeStarted: '☕ КОФЕМАШИНА ВАРИТ КОФЕ... (3 с)',
        coffeeDone: '✅ КОФЕ ГОТОВ! ПЕРЕХОДИТЕ К СЛЕДУЮЩЕМУ ШАГУ!',
        sodaCupInHand: '🥤 СТАКАН В РУКАХ — ПОСТАВЬТЕ В АВТОМАТ ГАЗИРОВКИ (3 с)!',
        needSodaCupInHand: '⚠️ СНАЧАЛА ВОЗЬМИТЕ СТАКАН ДЛЯ ГАЗИРОВКИ НА СТОЛЕ КУХНИ!',
        sodaStarted: '🥤 НАЛИВАЕМ ГАЗИРОВКУ В АВТОМАТЕ... (3 с)',
        sodaDone: '✅ ГАЗИРОВКА ГОТОВА! ВЕРНИТЕСЬ НА СТОЛ КУХНИ ДЛЯ УПАКОВКИ!',
        microwaveStarted: '📡 БИГ МАК В МИКРОВОЛНОВКЕ... ГРЕЕМ (5 с)',
        microwaveDone: '🔔 ДИНЬ! ПЕРЕХОДИТЕ К СЛЕДУЮЩЕМУ ШАГУ НА КУХНЕ!',
        wrapStarted: '📦 УПАКОВЫВАЕМ ВСЁ НА СТОЛЕ КУХНИ... (2 с)',
        dishOnKitchenTable: '🍽️ БЛЮДО ГОТОВО НА СТОЛЕ! ВОЗЬМИТЕ ЕГО И ПОСТАВЬТЕ НА СТОЛ ВЫДАЧИ!',
        night3CarNoGas: '⛽ НЕТ БЕНЗИНА! ДВИГАТЕЛЬ НЕ ЗАВОДИТСЯ!',
        night3WindowCracked: '💥 СТЕКЛО ВОДИТЕЛЯ ТРЕСНУЛО ОТ УДАРА!',
        night3PoliceOnWay: '🚓 911 И ДЖОН ПРЕДУПРЕЖДЕНЫ — СЛЫШНЫ СИРЕНЫ!',
      },
      prompts: {
        talkToJohn: '[E] Поговорить с Джоном (Принять смену)',
        deliverMeal: (name) => `[E] Отдать горячий заказ: ${name}`,
        talkAwaiting: (name) => `[E] Поговорить с ${name} (Ждёт заказ)`,
        takeOrder: (name) => `[E] Принять заказ у ${name}`,
        driveThruTakeOrder: (name) => `[E] Принять заказ в окне авто-раздачи (${name})`,
        driveThruDeliverMeal: (name) => `[E] Передать еду через окно авто-раздачи (${name})`,
        talkSilas: '[E] Поговорить с Сайласом (Постоянный гость)',
        cookingKitchen: (sec) => `⏳ Готовка на кухне (осталось ${sec} с)...`,
        cookKitchen: '[E] Приготовить еду и кофе на кухне (5 с)',
        pickUpChickenTray: '[E] Взять лоток с курицей из морозилки',
        restockChickenTray: '[E] Пополнить кухню лотком с курицей',
        inspectElectricalBox: '[E] Осмотреть электрощиток и включить рубильник',
        throwFoodInTrash: '[E] Выбросить еду в мусор',
        pickUpMop: '[E] Взять швабру',
        mopPuddle: '[E] Вытереть грязную лужу',
        mopRequiredPrompt: '⚠️ Сначала возьмите швабру в углу офиса охраны!',
        takeNoodlesAndDrink: '[E] Взять лапшу и красный энергетик (Полка лапши и воды)',
        talkCashier67: '[E] Оплатить сотруднику 67-Eleven ($10)',
        enterDuckCar: '[E] Сесть в машину Дака (Завершить ночь)',
        enterMcdDuckCar: '[E] Сесть в машину Дака и уехать домой',
        takeRawFry: '[E] Взять сырую курицу и картошку в руки',
        takeBigMac: '[E] Взять Биг Мак в руки',
        takeCoffeeCup: '[E] Взять стакан для кофе в руки',
        takeSodaCup: '[E] Взять стакан для газировки в руки',
        takeFinishedDish: '[E] Взять готовое блюдо со стола кухни',
        placeDishOnTable: '[E] Поставить готовое блюдо на стол выдачи',
        useFryer: '[E] Положить курицу и картошку во фритюрницу (5 с)',
        fryingNow: (sec) => `🍟 Жарка курицы и картошки (${sec} с)...`,
        useMicrowave: '[E] Положить Биг Мак в микроволновку (5 с)',
        microwavingNow: (sec) => `📡 Микроволновка работает (${sec} с)...`,
        useCoffeeMachine: '[E] Поставить стакан в кофемашину (3 с)',
        brewingCoffeeNow: (sec) => `☕ Варим кофе (${sec} с)...`,
        useSodaDispenser: '[E] Поставить стакан в автомат газировки (3 с)',
        pouringSodaNow: (sec) => `🥤 Наливаем газировку (${sec} с)...`,
        wrapFoodCounter: '[E] Принести всё на стол кухни и упаковать (2 с)',
        wrappingNow: (sec) => `📦 Упаковка заказа (${sec} с)...`,
        actions: {
          employee_john: 'Поговорить с Джоном (Принять смену)',
          time_clock: 'Отметиться на табельных часах',
          clean_table_1: 'Протереть стол №1',
          clean_table_2: 'Протереть стол №2',
          trash_bag_1: 'Взять пакет с мусором',
          trash_bag_2: 'Взять пакет с мусором',
          outdoor_dumpster: 'Выбросить мусор в контейнер',
          trash_bin: 'Выбросить еду в мусор',
          kitchen_switch: 'Выключить фритюрницы и плиту',
          office_switch: 'Включить свет в коридоре',
          cctv_monitor: 'Открыть монитор камер CCTV',
          front_door_exit: 'Завершить смену и выйти через дверь',
          mop_tool: 'Взять швабру',
          hallway_spill: 'Вытереть грязную лужу шваброй',
          cardboard_bundle: 'Взять связку картона',
          drive_thru_window: 'Осмотреть окно авто-раздачи',
          drive_thru_order_station: 'Проверить гарнитуру и терминал автозаказов',
          freezer_chicken_tray: 'Взять лоток с курицей из морозилки',
          fryer_machine: 'Пожарить курицу и картошку во фритюре',
          kitchen_microwave: 'Разогреть Биг Мак в микроволновке',
          coffee_machine: 'Сварить кофе в кофемашине',
          soda_dispenser: 'Налить газировку в автомате',
          serve_table_spot: 'Поставить готовое блюдо на стол выдачи',
          electrical_box: 'Осмотреть электрощиток и вернуть свет',
          toilet_flush: 'Смыть воду в туалете',
          store_67_noodle_stall: 'Взять лапшу и красный энергетик',
          store_67_cashier: 'Оплатить сотруднику 67-Eleven ($10)',
          store_67_car: 'Сесть в машину Дака',
          mcd_duck_car: 'Сесть в машину Дака и уехать домой',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Очередная ночь в этом месте… стою здесь в холодном тумане.' },
        { speaker: 'Duck', text: 'Минимальная зарплата, тёмный лес и 6-часовая смена. Внутри должен ждать Джон, чтобы передать смену.' },
        { speaker: 'Duck', text: 'Зайдём через раздвижные двери и поговорим с Джоном.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Снова на Ночь 2… Парковка и лес сегодня пугающе тихие.' },
        { speaker: 'Duck', text: 'Джон всё ещё ждёт внутри у стойки. Зайдём через раздвижные двери и поговорим с ним.' },
      ],
      openingMonologueNight3: [
        { speaker: 'Duck', text: 'И снова ночная работа… Почему я всё ещё возвращаюсь сюда?' },
        { speaker: 'Duck', text: 'За аренду ещё не заплачено, так что выбора нет. Зайдём внутрь и поговорим с Джоном.' },
      ],
      johnDialogue: [
        { speaker: 'John', text: 'Эй! Новенький! Ты тут впервые?' },
        { speaker: 'Duck', text: 'Да, и что с того?' },
        { speaker: 'John', text: 'Ха-ха, полегче! Моя смена наконец-то закончилась, так что передаю дела тебе.' },
        { speaker: 'John', text: 'Слушай внимательно — вот всё, что нужно делать в ночную смену.' },
        { speaker: 'John', text: 'Сначала отметься на табельных часах возле кассы. Потом протри грязные столы в зале и собери пакеты с мусором.' },
        { speaker: 'John', text: 'Вынеси мусор через заднюю дверь кухни в контейнер, выключи фритюрницы и проверь камеры CCTV в офисе охраны.' },
        { speaker: 'John', text: 'Позже начнут заезжать ночные посетители — и на кассу, и в окно авто-раздачи. Прими заказ, приготовь на кухне за 5 секунд и выдай еду. Если курица закончится, возьми лоток в морозильной камере за кухней!' },
        { speaker: 'John', text: 'И ещё одно… если свет на кухне начнёт мигать во время готовки — не паникуй. И не смотри слишком долго на этого клоуна-маскота. Удачи, увидимся в 6 утра!' },
        { speaker: 'Duck', text: 'Странный тип… Ладно, отметимся на часах и отработаем смену.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'О, привет, Дак. Рад, что ты всё-таки вышел на 2-ю ночь.' },
        { speaker: 'Duck', text: 'Ну да, счета сами себя не оплатят. Сегодня всё спокойно?' },
        { speaker: 'John', text: 'Вроде того… только начальство повесило ещё одно объявление в подсобке. О бывшем ночном сотруднике, который пропал на прошлой неделе, до сих пор ни слуху ни духу.' },
        { speaker: 'Duck', text: 'О том парне, которого я заменил? Погоди — он исчез прямо здесь?' },
        { speaker: 'John', text: 'Полиция нашла его машину у опушки леса, а кепка так и лежала на панели. Босс велел не болтать об этом при клиентах, но весь город уже обсуждает.' },
        { speaker: 'John', text: 'В общем, порядок на сегодня такой: отметься на часах, включи рубильник в офисе, вытри все лужи, вынеси картон, проверь окно авто-раздачи, камеры CCTV и обслуживай гостей в зале и в авто-раздаче до 6:00 утра.' },
        { speaker: 'Duck', text: 'Отлично… пропавший коллега и ещё одна смена до рассвета. До утра, Джон.' },
      ],
      johnDialogueNight3: [
        { speaker: 'John', text: 'Привет, Дак… рад, что ты вышел ещё на одну смену.' },
        { speaker: 'Duck', text: 'Погоди-ка, Джон. А куда пропала статуя клоуна, которая стояла возле кассы?' },
        { speaker: 'John', text: 'Понятия не имею — я сам вздрогнул, когда зашёл. Она уже полностью исчезла до того, как я открыл двери.' },
        { speaker: 'Duck', text: 'Исчезла? Её не убирали на склад или в ремонт?' },
        { speaker: 'John', text: 'Я правда не знаю, куда она делась. Ни заявок на ремонт, ни грузчиков, на входе ни следа.' },
        { speaker: 'John', text: 'Отметься на часах, протри столы, включи фритюрницы и отработай заказы. Закончишь — сразу иди к машине.' },
        { speaker: 'Duck', text: 'В запертом ресторане бесследно пропадает огромная статуя… Ладно. Пока, Джон.' },
      ],
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Что за чёрт?! Что происходит? Неужели босс не заплатил за электричество? Не знаю, пойду за заднюю дверь магазина и проверю.',
        },
      ],
      customerPowerOutageLeave:
        'О боже, что за чёрт? Так не пойдёт, я больше не покупаю здесь еду, я ухожу.',
      powerRestoredDialogue: [
        {
          speaker: 'Duck',
          text: 'Ага, кто-то сам вырубил рубильник, это не было отключение света.',
        },
      ],
      warehouseClownReactionDialogue: [
        {
          speaker: 'Duck',
          text: 'Кто это сейчас на меня смотрел? Ладно, в любом случае электричество уже починили.',
        },
      ],
      outOfFoodDialogue: [
        {
          speaker: 'Duck',
          text: 'Погодите-ка — на кухне только что полностью закончилась курица! Надо зайти в морозильную камеру за кухней и принести свежий лоток.',
        },
      ],
      bathroomKnockDialogue:
        'Что это за звук в туалете? В такой час здесь никого нет, я должен пойти и проверить.',
      bathroomEmptyDialogue:
        'Никого… в туалете совершенно пусто. Но я готов поклясться, что кто-то стучал по двери кабинки.',
      duckHungerDialogue: [
        {
          speaker: 'Duck',
          text: 'Ах, я так проголодался! Надо купить что-нибудь поесть, пока смена не закончилась.',
        },
      ],
      clerk67Dialogue: [
        {
          speaker: 'Сотрудник 67-Eleven',
          text: 'С вас $10, спасибо.',
        },
      ],
      clownCustomerName: 'Клоун',
      clownCustomerTitle: 'Незваный полуночный гость',
      clownCustomerOrderItem: 'Хрустящая жареная курица',
      clownBuyChickenDialogue: [
        {
          speaker: 'Клоун',
          text: 'Хе… хе… добрый вечер, маленькая жёлтая птичка за стойкой.',
        },
        {
          speaker: 'Duck',
          text: 'Эм… чем могу помочь, сэр? Почему вы так одеты—погодите, мы знакомы?',
        },
        {
          speaker: 'Клоун',
          text: 'Так шумно, когда шипит масло, и так тихо, когда гаснет свет. Я пришёл купить твою жареную курицу… хрустящую… тёплую… золотистую.',
        },
        {
          speaker: 'Duck',
          text: 'Хорошо… одна порция хрустящей курицы. Подождите пять секунд на кухне…',
        },
        {
          speaker: 'Клоун',
          text: 'Не торопись, Дак. Когда я наблюдаю, я никогда не спешу.',
        },
      ],
      clownChickenDeliveredDialogue: (price) => [
        {
          speaker: 'Duck',
          text: `Вот ваша жареная курица… с вас $${price}.`,
        },
        {
          speaker: 'Клоун',
          text: 'Хе-хе-хе… я чуял её запах ещё от тёмных сосен. Не переживай из-за статуи в углу… ей оттуда просто лучше видно кассу.',
        },
        {
          speaker: 'Клоун',
          text: 'Осторожнее за рулём по дороге домой, маленький сотрудник. Я постою прямо здесь внутри и посмотрю, как ты пойдёшь к машине.',
        },
      ],
      clownWatchingCarMonologue: [
        {
          speaker: 'Duck',
          text: 'Он просто стоит за стеклянной дверью, смотрит на меня и жутко смеётся… Надо бежать к машине и ехать прямо домой!',
        },
      ],
      night3CarNoGasDialogue: [
        {
          speaker: 'Duck',
          text: 'Чёрт, почему бензин закончился именно сейчас?!',
        },
      ],
      night3CarPostAttackDialogue: [
        {
          speaker: 'Duck',
          text: 'Ублюдок! Он совсем спятил, он правда хочет меня убить?!',
        },
      ],
      waitRestockDialogue: (customerName) => [
        {
          speaker: 'Duck',
          text: `Секундочку, ${customerName}! У нас закончилась курица — сейчас сбегаю в морозилку за свежим лотком.`,
        },
      ],
      thankYouDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Огромное спасибо, Дак! Вот $${price} за еду. Сдачи не надо!`,
        },
        {
          speaker: 'Duck',
          text: 'Спасибо! Приятного аппетита и берегите себя этой ночью.',
        },
      ],
      grumpyDeliveredDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Наконец-то! Целую вечность возился. Вот твои $${price} — и не жди чаевых или любезностей в три часа ночи.`,
        },
        {
          speaker: 'Duck',
          text: '…Ладно. Даже «спасибо» не сказал. Всё равно спокойной ночи, сэр.',
        },
      ],
      friendsSeatedDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Супер, всё горячее! Держи $${price}, Дак. Огромное спасибо!`,
        },
        {
          speaker: 'Лео',
          text: 'Пойдём сядем за тот угловой столик, быстро перекусим и сразу рванём в компьютерный клуб!',
        },
        {
          speaker: 'Duck',
          text: 'Приятного перекуса, Детёныши леопарда! Постарайтесь не попасться мамам по дороге назад.',
        },
      ],
      waitingOrderDialogue: (customerName, itemText) => [
        {
          speaker: customerName,
          text: `Я всё ещё жду свой заказ (${itemText})! С кухни вкусно пахнет.`,
        },
        {
          speaker: 'Duck',
          text: 'Уже готовлю на кухне! Это займёт всего 5 секунд.',
        },
      ],
      customers: [
        {
          name: 'Медсестра Рамирес',
          title: 'Измотанная сотрудница ночной смены',
          orderItem: 'Биг Мак, горячий кофе McCafé и картофель фри',
          dialogue: [
            { speaker: 'Медсестра Рамирес', text: 'Привет… скажи, пожалуйста, что кофе ещё горячий. Только что закончила адскую 14-часовую смену в приёмном покое.' },
            { speaker: 'Duck', text: 'Сварили пять минут назад. Ночные смены выжимают все соки, правда?' },
            { speaker: 'Медсестра Рамирес', text: 'Ты и не представляешь. Но честно… тут сегодня тише, чем в морге. На дороге вообще ни души.' },
            { speaker: 'Duck', text: 'Да, обычно заходят шумные подростки. А сегодня только я, фритюрницы и этот жуткий клоун в зале.' },
            { speaker: 'Медсестра Рамирес', text: 'Держи двери запертыми, если можешь. Снаружи в воздухе витает что-то неладное.' },
            { speaker: 'Duck', text: 'Правила компании требуют открытый зал 24/7. Даже если нападёт призрак клоуна, начальство всё равно оштрафует.' },
            { speaker: 'Медсестра Рамирес', text: 'Ладно, можно мне Биг Мак с горячим кофе и фри? Я умираю с голоду.' },
            { speaker: 'Duck', text: 'Сейчас будет! Пойду приготовлю на кухне.' },
          ],
        },
        {
          name: 'Тайлер',
          title: 'Нервный подросток',
          orderItem: '10 Чикен Макнаггетс, фри и Спрайт',
          dialogue: [
            { speaker: 'Тайлер', text: 'Эй… бро. Бро! Ты это видел?! Статуя клоуна Рональда у столиков только что повернула голову?!' },
            { speaker: 'Duck', text: 'Это полый пластик и стекловолокно, прикрученные к полу. Он не двигается, Тайлер.' },
            { speaker: 'Тайлер', text: 'Клянусь жизнью, когда я парковался, он смотрел в окно! А теперь его голова повёрнута прямо к кассе!' },
            { speaker: 'Duck', text: 'Я получаю восемь баксов в час. Даже если этот клоун оживёт, мне мало платят, чтобы убегать.' },
            { speaker: 'Тайлер', text: 'Я заберу еду с собой. Можно 10 Макнаггетсов с соусом барбекю и большой Спрайт?' },
            { speaker: 'Duck', text: 'Принято. Сейчас пожарю наггетсы и картошку на кухне.' },
          ],
        },
        {
          name: 'Старик Сайлас',
          title: 'Загадочный постоянный гость',
          orderItem: 'Горячий чёрный чай и яблочный пирожок',
          dialogue: [
            { speaker: 'Старик Сайлас', text: 'Ему не по нраву гул люминесцентных ламп, юноша. Он слушает лишь тогда, когда трубки начинают мерцать.' },
            { speaker: 'Duck', text: 'Сэр, если вы хотите сделать заказ, я готов принять его на кассе.' },
            { speaker: 'Старик Сайлас', text: 'Сорок лет назад эта земля принадлежала лесу. Нарисованные гримом улыбки никогда не смываются до конца.' },
            { speaker: 'Duck', text: 'Понятно. Послушайте, Сайлас, бургеры из говядины, а клоун из смолы. Что вам приготовить?' },
            { speaker: 'Старик Сайлас', text: 'Горячий чёрный чай и тёплый яблочный пирожок, молодой Дак. Пусть чай будет обжигающим.' },
            { speaker: 'Duck', text: 'Хорошо. Иду на кухню заваривать чай и греть пирожок.' },
          ],
        },
        {
          name: 'Большой Рэй',
          title: 'Весёлый сантехник и ночной завсегдатай',
          orderItem: 'Супер-ведёрко жареной курицы и эспрессо-бонуc',
          dialogue: [
            { speaker: 'Большой Рэй', text: 'Ваху! Это же я, Большой Рэй! Доброй ночи, пернатый приятель!' },
            { speaker: 'Duck', text: 'Эм… привет, Большой Рэй. Выглядишь так, будто только что выпрыгнул прямо из водосточной трубы.' },
            { speaker: 'Большой Рэй', text: 'Мамма мия! Починил сегодня три протекающие трубы в городе — теперь моему животу нужен Супер-Звёздный заряд!' },
            { speaker: 'Duck', text: 'Ха-ха, справедливо. Что приготовить тебе, Марио?' },
            { speaker: 'Большой Рэй', text: 'Ведёрко хрустящей курицы, бургер с грибами и обжигающий эспрессо! Погнали (Let’s-a go)!' },
            { speaker: 'Duck', text: 'Уже бегу, Большой Рэй! Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Майя Лин',
          title: 'Неспящая студентка',
          orderItem: 'Айс Мокка McCafé и острый куриный бургер',
          dialogue: [
            { speaker: 'Майя Лин', text: 'Привет… скажи, кофемашина ещё работает? Писать диплом в два часа ночи было ужасной идеей.' },
            { speaker: 'Duck', text: 'Аппарат McCafé горячий и шумит. Тяжёлая ночь перед защитой?' },
            { speaker: 'Майя Лин', text: 'Хуже — мои фары на въезде выхватили кого-то очень высокого у сосен, а потом телефон сразу потерял сеть.' },
            { speaker: 'Duck', text: 'Вокруг поляны полно лесного зверья. Олени, еноты… надеюсь, не клоуны.' },
            { speaker: 'Майя Лин', text: 'Чего? Ладно, можно мне айс-мокку и острый хрустящий чикенбургер, чтобы не уснуть.' },
            { speaker: 'Duck', text: 'Уже бегу на кухню жарить курицу и варить эспрессо.' },
          ],
        },
        {
          name: 'Фельдшер Картер',
          title: 'Ночной парамедик',
          orderItem: 'Ведёрко жареной курицы и двойной эспрессо',
          dialogue: [
            { speaker: 'Фельдшер Картер', text: 'На 4-й станции тихо, решил заскочить по пути. Ты сегодня один на кассе?' },
            { speaker: 'Duck', text: 'Только я и фритюрницы до 6 утра. На волне скорой ничего странного за ночь не было?' },
            { speaker: 'Фельдшер Картер', text: 'Три ложных вызова с таксофонов вдоль этой трассы — одни помехи, тяжёлое дыхание и гудок циркового рожка.' },
            { speaker: 'Duck', text: 'Окей, это даже жутче, чем буйные посетители.' },
            { speaker: 'Фельдшер Картер', text: 'Держи двери освещёнными, парень. Собери ведёрко хрустящей курицы и двойной кофе.' },
            { speaker: 'Duck', text: 'Сейчас будет! Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Клара Новак',
          title: 'Заблудившаяся путешественница',
          orderItem: 'Горячий карамельный латте и яблочный пирожок',
          dialogue: [
            { speaker: 'Клара Новак', text: 'Простите… мой навигатор потерял спутники десять миль назад. Это всё ещё 9-е шоссе?' },
            { speaker: 'Duck', text: 'Да, мэм, глухой участок 9-го шоссе. Ночью лес глушит здесь почти весь сигнал.' },
            { speaker: 'Клара Новак', text: 'Клянусь, я уже дважды проезжала мимо вашей красной вывески, будто дорога ведёт по кругу в чащу.' },
            { speaker: 'Duck', text: 'Густой туман часто сбивает водителей с толку. Согреетесь чем-нибудь перед дорогой?' },
            { speaker: 'Клара Новак', text: 'Горячий карамельный латте и тёплый яблочный пирожок — было бы чудесно. Спасибо.' },
            { speaker: 'Duck', text: 'Уже готовлю — скоро вынесу поднос.' },
          ],
        },
      ],
      customersNight2: [
        {
          name: 'Медсестра Рамирес',
          title: 'Измотанная сотрудница ночной смены',
          orderItem: 'Горячий кофе McCafé и ведёрко хрустящей курицы',
          dialogue: [
            { speaker: 'Медсестра Рамирес', text: 'Привет… подожди, ты теперь один в ночь? Я думала увидеть на кассе Маркуса.' },
            { speaker: 'Duck', text: 'Маркуса? Это тот бывший ночной сотрудник, о котором все говорят?' },
            { speaker: 'Медсестра Рамирес', text: 'Да. Две недели назад он зашёл в приёмный покой бледный как мел — клялся, что после 3 ночи кто-то стучит в зеркало туалета. А потом просто исчез.' },
            { speaker: 'Duck', text: 'При найме мне об этом ничего не сказали…' },
            { speaker: 'Медсестра Рамирес', text: 'Береги себя. Можно горячий кофе McCafé и хрустящую курицу? Надо не уснуть за рулём.' },
            { speaker: 'Duck', text: 'Сейчас приготовлю на кухне.' },
          ],
        },
        {
          name: 'Тайлер',
          title: 'Нервный подросток',
          orderItem: '10 Макнаггетсов и большая картошка',
          dialogue: [
            { speaker: 'Тайлер', text: 'Бро, ты слышал новости по радио?! Лес за этим McDonald’s ВСЁ ЕЩЁ прочёсывают в поисках пропавшего ночного работника!' },
            { speaker: 'Duck', text: 'Да, Джон только что рассказал про его кепку у деревьев.' },
            { speaker: 'Тайлер', text: 'Мой брат часто заезжал сюда ночью. Говорит, тот парень видел высокого рыжего клоуна за стеклом прямо перед концом смены.' },
            { speaker: 'Duck', text: 'Хватит меня пугать, мне тут торчать до 6 утра. Что будешь заказывать?' },
            { speaker: 'Тайлер', text: '10 Макнаггетсов и большую картошку с собой — я тут ни секунды лишней не задержусь!' },
            { speaker: 'Duck', text: 'Принято. 5 секунд на кухне, жди.' },
          ],
        },
        {
          name: 'Помощник шерифа Вэнс',
          title: 'Ночной патрульный',
          orderItem: 'Чёрный кофе и комбо Четвертьфунтовый',
          dialogue: [
            { speaker: 'Помощник шерифа Вэнс', text: 'Тихое дежурство. Нальёшь чёрного кофе? Заехал проверить — это последнее место, где Маркус отметился перед исчезновением.' },
            { speaker: 'Duck', text: 'У вас до сих пор нет зацепок, что с ним случилось?' },
            { speaker: 'Помощник шерифа Вэнс', text: 'Записи камер с его последней ночи повредились после 3:00, а управляющий отказался дать ключи от тропы в лес. Смотри в оба.' },
            { speaker: 'Duck', text: 'Буду следить за дверью и камерами. Ещё что-нибудь к кофе?' },
            { speaker: 'Помощник шерифа Вэнс', text: 'Добавь Четвертьфунтовый комбо. И не спускай глаз со входной двери.' },
            { speaker: 'Duck', text: 'Понял, иду на кухню готовить.' },
          ],
        },
        {
          name: 'Большой Рэй',
          title: 'Весёлый сантехник и ночной завсегдатай',
          orderItem: 'Ведёрко жареной курицы и горячий эспрессо',
          dialogue: [
            { speaker: 'Большой Рэй', text: 'Мамма мия! Снова в деле, мой любимый ночной утёнок! Ваху!' },
            { speaker: 'Duck', text: 'Привет, Большой Рэй! Снова ночной срочный вызов по трубам?' },
            { speaker: 'Большой Рэй', text: 'А то! Прочистил огромную зелёную трубу на Главной улице — и ты приглядывай за трубами у себя в туалете этой ночью, окей-докей?' },
            { speaker: 'Duck', text: 'Спасибо за совет. Как обычно, твой супер-заказ?' },
            { speaker: 'Большой Рэй', text: 'Си! Одно большое ведёрко жареной курицы и горячий эспрессо! Погнали (Let’s-a go)!' },
            { speaker: 'Duck', text: 'Уже делаю, Большой Рэй! Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Майя Лин',
          title: 'Неспящая студентка',
          orderItem: 'Горячий Мокка McCafé и Макнаггетс',
          dialogue: [
            { speaker: 'Майя Лин', text: 'Погоди — ты новенький, да? На доске объявлений в кампусе висит листовка о пропавшем здесь сотруднике.' },
            { speaker: 'Duck', text: 'Да… Маркус. Похоже, каждый гость знает о нём больше нашего управляющего.' },
            { speaker: 'Майя Лин', text: 'Подруга, которая часто заезжала сюда ночью, сказала, что Маркус исчез именно в то утро, когда его машину нашли у сосен.' },
            { speaker: 'Duck', text: 'Лучше бы Джон рассказал об этом до того, как вручил мне фартук.' },
            { speaker: 'Майя Лин', text: 'Держись ближе к свету над кассой. Мне горячий мокка и Макнаггетсы с собой.' },
            { speaker: 'Duck', text: 'Сейчас. Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Фельдшер Картер',
          title: 'Ночной парамедик',
          orderItem: 'Острый куриный комбо и чёрный кофе',
          dialogue: [
            { speaker: 'Фельдшер Картер', text: 'Всё ещё дежуришь один? Диспетчерская обновила ориентировку на пропавшего Маркуса с этого адреса.' },
            { speaker: 'Duck', text: 'Нашли ещё что-нибудь, кроме машины и кепки?' },
            { speaker: 'Фельдшер Картер', text: 'Батарейку от фонарика у задней двери и следы, уходящие глубоко в грязь — больше ничего.' },
            { speaker: 'Duck', text: 'Прекрасно. А мне ведь ещё мусор туда выносить.' },
            { speaker: 'Фельдшер Картер', text: 'Смотри по сторонам сегодня. Сделай острый куриный комбо и чёрный кофе.' },
            { speaker: 'Duck', text: 'Уже готовлю — пару секунд.' },
          ],
        },
        {
          name: 'Клара Новак',
          title: 'Заблудившаяся путешественница',
          orderItem: 'Горячий чай и ведёрко хрустящей курицы',
          dialogue: [
            { speaker: 'Клара Новак', text: 'На заправке в двух милях к востоку кассир предупредил меня, что в этот McDonald’s лучше не заходить после двух ночи.' },
            { speaker: 'Duck', text: 'Дай угадаю — из-за парня, который пропал в ночную смену?' },
            { speaker: 'Клара Новак', text: 'Он сказал, что твой предшественник жаловался, будто кто-то в белом гриме наблюдал за ним через переднюю стеклянную дверь.' },
            { speaker: 'Duck', text: '…Именно то, что хочется услышать до конца смены. Что вам приготовить?' },
            { speaker: 'Клара Новак', text: 'Просто горячий чай и ведёрко курицы, чтобы я поскорее уехала по трассе.' },
            { speaker: 'Duck', text: 'Сейчас вынесу с кухни.' },
          ],
        },
        {
          name: 'Детёныши леопарда',
          title: 'Компания друзей в самоволке',
          orderItem: 'Большое ведёрко курицы, 3 кофе и большая картошка',
          dialogue: [
            { speaker: 'Сэм', text: 'Тсс! Говорите тише — я еле вылез из окна своей комнаты, чтобы мама не проснулась!' },
            { speaker: 'Мия', text: 'Ха-ха, оно того стоит! Если мама узнает, что мы сбежали из дома перекусить ночью, мне конец на целый месяц!' },
            { speaker: 'Лео', text: 'Да ладно, мы же Детёныши леопарда! Быстро перекусим здесь ночной едой и рванём в компьютерный клуб до самого рассвета!' },
            { speaker: 'Duck', text: 'Весёлая ночка намечается, ребята. Поедите тут за столиком перед компьютерным клубом?' },
            { speaker: 'Сэм', text: 'Ага! Большое ведёрко хрустящей курицы, большую картошку и три кофе — быстро слопаем за угловым столиком!' },
            { speaker: 'Duck', text: 'Сейчас будет! Подождите пять секунд на кухне.' },
          ],
        },
        {
          name: 'Артур Крамп',
          title: 'Ворчливый ночной посетитель',
          orderItem: 'Чёрный кофе и обычный бургер',
          dialogue: [
            { speaker: 'Артур Крамп', text: 'Хмф. Наконец-то хоть кто-то за кассой. Вы вообще знаете, какой холод на этой парковке?' },
            { speaker: 'Duck', text: 'Извините за непогоду, сэр. Что вам приготовить сегодня?' },
            { speaker: 'Артур Крамп', text: 'Обойдёмся без любезностей. Весь город треплется про пропавшего кассира и проклятый лес… чушь собачья.' },
            { speaker: 'Duck', text: 'Понял. Тогда только заказ — что желаете?' },
            { speaker: 'Артур Крамп', text: 'Крепкий чёрный кофе и обычный бургер. Чтобы всё было горячим и без задержек.' },
            { speaker: 'Duck', text: '…Хорошо. Пять секунд на кухне.' },
          ],
        },
      ],
      customersNight3: [
        {
          name: 'Детектив Холл',
          title: 'Детектив отдела по пропавшим без вести',
          orderItem: 'Чёрный кофе и комбо с хрустящей курицей',
          dialogue: [
            { speaker: 'Детектив Холл', text: 'Добрый вечер, Дак. После вчерашних рапортов дело об исчезновении Маркуса официально легло к нам на стол в окружном отделе.' },
            { speaker: 'Duck', text: 'Подождите — официально? То есть руководство наконец перестало замалчивать то, что случилось с Маркусом?' },
            { speaker: 'Детектив Холл', text: 'Скрывать больше нельзя — за мусорным баком нашли его разорванный фартук. Кстати… разве у кассы раньше не стояла прикрученная статуя клоуна в полный рост?' },
            { speaker: 'Duck', text: 'Стояла! Но она бесследно исчезла ещё до того, как Джон открыл смену сегодня. Никто не знает, куда она делась.' },
            { speaker: 'Детектив Холл', text: 'Пропавший сотрудник и исчезнувший двухметровый маскот из запертого здания… Не спускай глаз со стеклянных дверей. Налей чёрного кофе и приготовь хрустящую курицу.' },
            { speaker: 'Duck', text: 'Сейчас будет, детектив. Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Репортёр Зои',
          title: 'Ночная журналистка-расследователь',
          orderItem: 'Пряный айс-латте и 10 Макнаггетсов',
          dialogue: [
            { speaker: 'Репортёр Зои', text: 'Привет — ты, должно быть, Дак. С тех пор как вчера вечером все заговорили об исчезновении Маркуса, моя горячая линия буквально разрывается от слухов об этом месте.' },
            { speaker: 'Duck', text: 'Все спрашивают про Маркуса, а теперь ещё и огромная статуя клоуна у прилавка куда-то исчезла.' },
            { speaker: 'Репортёр Зои', text: 'Стоп, маскот-клоун реально пропал?! В своей последней записи Маркус писал, что статуя казалась выше каждый раз, когда в 3 ночи мигали лампы.' },
            { speaker: 'Duck', text: 'Скажите, что вы шутите… Я тут один до самого закрытия.' },
            { speaker: 'Репортёр Зои', text: 'Держись ближе к свету и не разряжай телефон. Сделай айс-латте и 10 наггетсов, пока я еду дальше по шоссе.' },
            { speaker: 'Duck', text: 'Уже готовлю. Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Помощник шерифа Вэнс',
          title: 'Помощник шерифа округа',
          orderItem: 'Чёрный кофе и острый куриный бургер',
          dialogue: [
            { speaker: 'Помощник шерифа Вэнс', text: 'Заехал проверить после прошлой ночи, Дак. Криминалисты сняли отпечатки с машины Маркуса — и они не его.' },
            { speaker: 'Duck', text: 'Чьи же отпечатки были на машине Маркуса?!' },
            { speaker: 'Помощник шерифа Вэнс', text: 'Густой слой грима вперемешку с фритюрным маслом. Запирай заднюю дверь сразу после мусора и не подходи к деревьям.' },
            { speaker: 'Duck', text: 'Понял, помощник шерифа. Как обычно чёрный кофе и что-то горячее?' },
            { speaker: 'Помощник шерифа Вэнс', text: 'Чёрный кофе и острый куриный бургер. Поторопись, мне ещё прочёсывать трассу.' },
            { speaker: 'Duck', text: 'Уже бегу на кухню — пять секунд.' },
          ],
        },
        {
          name: 'Большой Рэй',
          title: 'Весёлый сантехник и ночной завсегдатай',
          orderItem: 'Ведёрко хрустящей курицы и двойной эспрессо',
          dialogue: [
            { speaker: 'Большой Рэй', text: 'Ваху! Третья ночь, а Дак всё ещё в строю! Погоди-ка — куда делась та высокая рыжая статуя клоуна?!' },
            { speaker: 'Duck', text: 'Честно, Большой Рэй, она пропала ещё до начала моей смены. Никто не знает, кто её унёс.' },
            { speaker: 'Большой Рэй', text: 'Мамма мия! Может, она прыгнула в гигантскую зелёную трубу, как Гумба! Без неё в углу как-то жутковато!' },
            { speaker: 'Duck', text: 'Да уж, без неё в зале непривычно тихо. Сегодня твой обычный супер-заказ?' },
            { speaker: 'Большой Рэй', text: 'А то! Ведёрко хрустящей жареной курицы и обжигающий двойной эспрессо! Let’s-a go!' },
            { speaker: 'Duck', text: 'Сейчас будет, Большой Рэй! Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Детёныши леопарда',
          title: 'Компания друзей в самоволке',
          orderItem: 'Большое ведёрко курицы, 3 газировки и большая картошка',
          dialogue: [
            { speaker: 'Сэм', text: 'Ого, глянь в угол — эта жуткая гигантская статуя клоуна сегодня реально исчезла!' },
            { speaker: 'Мия', text: 'И слава богу! От неё мурашки по коже были каждый раз, когда мы сбегали сюда за полночь!' },
            { speaker: 'Лео', text: 'Забей на статую, Детёнышам леопарда нужна заправка перед ночным турниром в компьютерном клубе!' },
            { speaker: 'Duck', text: 'Ребята, вы вообще спите? Как обычно — большое ведёрко перекусить?' },
            { speaker: 'Сэм', text: 'Ага! Хрустящую курицу, большую картошку и три холодные газировки!' },
            { speaker: 'Duck', text: 'Пять секунд на кухне — подождите!' },
          ],
        },
      ],
      driveThruCustomers: [
        {
          name: 'Водитель Майк',
          title: 'Посетитель авто-раздачи',
          orderItem: 'Комбо с хрустящей курицей и чёрный кофе',
          dialogue: [
            { speaker: 'Водитель Майк', text: 'Привет! Хорошо, что окно авто-раздачи ещё открыто в такой час.' },
            { speaker: 'Duck', text: 'Добро пожаловать на авто-раздачу! Что желаете заказать?' },
            { speaker: 'Водитель Майк', text: 'Комбо с хрустящей курицей и горячий чёрный кофе — только закончил смену на станции.' },
            { speaker: 'Duck', text: 'Принято! Ждите у окна, приготовлю за 5 секунд.' },
          ],
        },
        {
          name: 'Курьер Хана',
          title: 'Ночная доставка',
          orderItem: 'Ведёрко жареной курицы и мокка',
          dialogue: [
            { speaker: 'Курьер Хана', text: 'Добрый вечер! Показалось, кто-то стоял у забора с мусором, когда я заезжала на полосу авто-раздачи…' },
            { speaker: 'Duck', text: 'Наверное, просто тени от сосен. Что будете заказывать?' },
            { speaker: 'Курьер Хана', text: 'Ведёрко жареной курицы и горячий кофе, чтобы не уснуть на последнем рейсе!' },
            { speaker: 'Duck', text: 'Сейчас будет! Пять секунд на кухне.' },
          ],
        },
        {
          name: 'Таксист Бен',
          title: 'Полуночный таксист',
          orderItem: 'Двойной чизбургер и латте McCafé',
          dialogue: [
            { speaker: 'Таксист Бен', text: 'Ух, туман на 9-м шоссе хоть ножом режь! Передашь ужин прямо в окно?' },
            { speaker: 'Duck', text: 'Конечно! Что для вас приготовить?' },
            { speaker: 'Таксист Бен', text: 'Хрустящую курицу и горячий латте, чтобы спокойно доехать до дома.' },
            { speaker: 'Duck', text: 'Пять секунд у фритюрницы и кофемашины — скоро вернусь!' },
          ],
        },
      ],
    },
  },

  id: {
    languageName: 'Bahasa Indonesia',
    languageLabel: 'Bahasa',
    loading: {
      badge: 'Protokol Inisialisasi Sistem',
      subtitle: 'Demo Horor Psikologis 2 Malam',
      messages: [
        'Menghubungkan ke jaringan listrik restoran…',
        'Mengkalibrasi pintu geser otomatis & sensor gerak…',
        'Memeriksa sistem keamanan & matriks kamera CCTV…',
        'Menyiapkan catatan serah terima shift malam…',
        'Menyiapkan shift malam Anda…',
        'Membuka restoran…',
      ],
      footerHints: ['Pintu Geser Otomatis', 'AI Pelanggan Datang', 'Audio Atmosferik'],
    },
    menu: {
      est: 'SEJAK 1955',
      nightShift: 'Shift Malam',
      survivalHorror: 'Pengalaman Survival Horor',
      outsideClearing: 'Halaman Luar',
      storeActive: '● Restoran Aktif',
      description:
        "Jadilah Duck di shift tengah malam pada restoran McDonald's terpencil di tengah hutan horor. Ambil alih shift dari John, siapkan pesanan pelanggan, bertahan hingga pukul 06.00 pagi, dan waspadai bayangan di luar.",
      tipBefore: 'Tips: Tekan',
      tipRun: 'untuk berlari di PC, atau ketuk',
      tipMobile: 'di ponsel!',
      playNight1: 'MAIN MALAM 1',
      firstShift: 'Shift Pertama',
      playNight2: 'MAIN MALAM 2',
      playNight3: 'MAIN MALAM 3',
      locked: '(TERKUNCI)',
      somethingWrong: 'Ada yang Tidak Beres',
      theFinalDemoNight: 'Patung Itu Berpindah',
      bgmLabel: 'Musik Latar: Cold Glass Passage',
      unmute: 'NYALAKAN',
      musicOn: 'MUSIK AKTIF',
      controls: 'Kontrol',
      settings: 'Pengaturan',
      credits: 'Kredit',
      storyRuleLabel: 'Aturan Cerita:',
      storyRule:
        'Jalani kedua shift malam 6 jam hingga pukul 6:00 pagi, ungkap rumor mantan karyawan yang hilang, dan tetap waspada saat ada yang mengintip dari balik bayangan.',
      shiftMemo: 'Catatan Shift',
      employeeRoutine: 'Rutinitas Karyawan',
      memoItems: [
        'Malam 1: Bicara dengan John untuk serah terima shift, absen, lap meja, kumpulkan sampah, matikan penggorengan dapur, dan layani tamu malam.',
        'Malam 2: Bicara dengan John soal staf yang hilang, nyalakan sakelar, pel lorong, buang kardus, cek drive-thru, CCTV, dan layani tamu.',
        'Senter memiliki daya tak terbatas; periksa juga toilet baru di sisi barat ruang makan bila perlu.',
        'Jika lampu dapur berkedip saat memasak, selesaikan persiapan 5 detik dengan tenang.',
      ],
      settingsTitle: 'Pengaturan Game',
      graphicsQuality: 'Kualitas Grafis',
      qualityLevels: { low: 'RENDAH', medium: 'SEDANG', high: 'TINGGI' },
      audioVolume: 'Volume Audio',
      mouseSensitivity: 'Sensitivitas Mouse',
      invertLook: 'Balikkan Arah Lihat (Sumbu Y)',
      crtFilter: 'Filter CRT Retro',
      enabled: 'AKTIF',
      disabled: 'NONAKTIF',
      applyClose: 'Terapkan & Tutup',
      controlsTitle: 'Kontrol',
      controlsList: [
        { key: 'W, A, S, D', desc: 'Jalan / Bergerak' },
        { key: 'Mouse', desc: 'Arahkan & Putar Kamera' },
        { key: 'Shift', desc: 'Lari Cepat' },
        { key: 'C', desc: 'Menunduk' },
        { key: 'F', desc: 'Nyalakan/Matikan Senter (Tanpa batas)' },
        { key: 'E', desc: 'Bicara dengan John / Tamu / Selesaikan Tugas' },
        { key: 'ESC', desc: 'Menu Jeda / Keluar dari CCTV' },
      ],
      understood: 'Mengerti',
      creditsTitle: 'Kredit & Cerita',
      creditsIntro:
        "McDonald's Nightfall adalah game horor psikologis shift malam berdurasi 2 malam penuh.",
      creditsDetails: [
        { label: 'Tema', value: 'Shift malam restoran cepat saji & ketegangan psikologis' },
        { label: 'Format', value: '2 Malam Penuh Dimainkan (12:00 AM – 6:00 AM)' },
        { label: 'Mesin', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Arah Cerita', value: 'Ungkap apa yang terjadi pada mantan pekerja shift malam yang hilang.' },
      ],
      returnMenu: 'Kembali ke Menu',
      versionLabel: 'Versi 1.4.0',
    },
    hud: {
      nightShiftEmployee: (night) => `Shift Malam ${night} — Karyawan: Duck`,
      stepLabel: (step) => `Langkah ${step}`,
      allDutiesDone: 'Semua tugas untuk shift ini telah selesai!',
      shiftClock: 'Jam Shift',
      dawnLabel: 'FAJAR (6:00 AM)',
      closingLabel: 'TUTUP JAM 6:00 AM',
      escPause: 'ESC / JEDA',
      stamina: 'Stamina',
      stance: 'POSISI:',
      crouched: '[C] MENUNDUK',
      standing: '[C] BERDIRI',
      carryingFood:
        '🍗 Membawa Hidangan Jadi — Letakkan di Meja Saji Kasir untuk Tamu',
      carryingRawFry:
        '🥩 Memegang Ayam & Kentang Mentah — Masukkan ke Mesin Penggorengan (5 dtk)',
      carryingBigMac:
        '🍔 Memegang Big Mac — Masukkan ke Microwave Dapur (5 dtk)',
      carryingCoffeeCup:
        '☕ Memegang Gelas Kopi — Masukkan ke Mesin Kopi di Meja (3 dtk)',
      carryingSodaCup:
        '🥤 Memegang Gelas Soda — Masukkan ke Dispenser Minuman Soda (3 dtk)',
      carryingSpoiledFood:
        '⚠️ Membawa Makanan Sisa (Listrik Padam!) — Buang ke tempat sampah dapur atau bak sampah luar',
      carryingChickenTray:
        '❄️ Membawa Nampan Ayam dari Freezer — Isi ulang stok di Meja Dapur',
      carryingNoodlesAndDrink:
        '🍜 Memegang Mi Cup & Minuman Energi Merah — Menuju Mobil Duck di luar',
      carryingMop: '🧹 Memegang Kain Pel — Bersihkan semua 8 genangan kotor di lantai',
      carryingTrash: '📦 Membawa Kantong Sampah (Bawa ke tempat sampah belakang)',
      carryingCardboard: '📦 Membawa Tumpukan Kardus (Bawa ke tempat sampah belakang)',
      heavyWorklight: 'Senter Kerja [F]',
      unlimited: 'TAK TERBATAS',
      status: 'STATUS:',
      beamActive: 'LAMPU NYALA',
      beamOff: 'LAMPU MATI',
      phoneHint: 'PONSEL [P]',
    },
    pause: {
      title: 'GAME DIJEDA',
      resume: 'Lanjutkan Shift',
      restartNight: 'Ulangi Malam Ini',
      mainMenu: 'Menu Utama',
      volume: 'Volume',
      sensitivity: 'Sensitivitas',
    },
    dialogue: {
      internal: '(Batin)',
      internalThoughts: 'Pikiran Batin',
      transmitting: 'Mengirim...',
      received: 'Diterima',
      scrambled: 'Transmisi terganggu...',
      pressHint: 'Tekan [E], Spasi, atau Klik',
      skip: '[E] Lewati',
      skipBtn: 'Lewati',
      next: '[E] Lanjut',
      close: '[E] Tutup',
      continueBtn: 'Lanjut',
    },
    cctv: {
      rec: 'REKAM',
      header: "SIARAN PENGAWASAN KEAMANAN MCDONALD'S",
      live: 'LANGSUNG',
      exitOffice: 'KEMBALI KE KANTOR [ESC]',
      anomalies: '⚠️ TERDETEKSI BEBERAPA ANOMALI GERAKAN',
      signal: 'INTEGRITAS SINYAL: 94%',
      matrixTitle: 'Matriks Terminal Kamera',
      switchHint: 'Tombol [1] - [5] untuk ganti',
      cameras: [
        { id: 1, name: 'CAM 01', label: 'AREA MAKAN UTAMA' },
        { id: 2, name: 'CAM 02', label: 'MEJA KASIR' },
        { id: 3, name: 'CAM 03', label: 'DAPUR PERSIAPAN' },
        { id: 4, name: 'CAM 04', label: 'TEMPAT SAMPAH BELAKANG' },
        { id: 5, name: 'CAM 05', label: 'PARKIRAN & JALAN' },
      ],
    },
    mobile: {
      touchOn: '🎮 SENTUH AKTIF',
      pcControls: '⌨️ KONTROL PC',
      move: 'GERAK',
      crouch: 'NUNDUK',
      light: 'SENTER',
      pause: 'JEDA',
      run: 'LARI',
      running: 'BERLARI',
      action: 'AKSI',
      phone: 'PONSEL',
    },
    phone: {
      title: 'PONSEL DUCK',
      carrier: 'NIGHTCALL 4G',
      back: 'Kembali',
      close: 'Tutup [P]',
      apps: { calls: 'Panggilan', messages: 'Pesan', camera: 'Kamera' },
      emergencyBanner: 'TERJEBAK DI MOBIL — TELEPON 911 & SMS JOHN!',
      emergencyDone: 'Bantuan dalam perjalanan! Tetap merunduk di dalam mobil...',
      contacts: {
        mom: 'Ibu',
        landlord: 'Pak Henderson (Pemilik Kos)',
        john: 'John (Rekan Kerja)',
        police: 'Polisi Darurat 911',
      },
      callsTab: {
        callBtn: 'Telepon',
        callingStatus: (name) => `Menghubungi ${name}...`,
        connectedStatus: (name) => `Terhubung — ${name}`,
        momLine: 'Duck? Kenapa menelepon jam segini? Kunci pintu dan langsung pulang kalau shift sudah selesai!',
        landlordLine: 'Uang sewa sudah telat, nak. Pastikan lunas besok atau kunci kamar diganti.',
        policeReady: '911 Darurat: Tetap terkunci di dalam mobil dan merunduk—unit patroli sedang melaju ke McDonald’s Jalan Raya 9!',
        policeIdle: 'Layanan Darurat 911. Gunakan hanya dalam keadaan darurat nyata.',
        calledPoliceBadge: '911 Dihubungi',
      },
      messagesTab: {
        sendEmergencyJohn: 'SMS John: SOS! Badut Pembunuh di Luar Mobilku!',
        sentToJohnBadge: 'Terkirim ke John',
        momThread: [
          { from: 'Ibu', time: '23:42', text: 'Sudah bawa jaket hangat? Malam ini kabutnya tebal.' },
          { from: 'Duck', time: '23:45', text: 'Sudah Bu, baru sampai di tempat kerja.' },
        ],
        landlordThread: [
          { from: 'Pemilik Kos', time: '18:15', text: 'Pengingat: Sewa $850 belum dibayar. Lunasi sebelum besok sore.' },
        ],
        johnThread: [
          { from: 'John', time: '00:08', text: 'Awasi pintu kaca kalau lampu mulai berkedip. SMS aku kalau ada yang aneh.' },
        ],
        johnHelpOutgoing:
          'JOHN TOLONG!! Badut pembunuh itu mengejarku ke mobil, bensinnya habis dan dia baru saja meretakkan kaca mobilku!! Aku sedang telepon polisi!',
        johnHelpReply:
          'BERTAHANLAH DUCK!! Kunci pintu dan merunduk di bawah kaca—aku sudah menelepon sheriff dan segera meluncur ke sana!',
      },
      cameraTab: {
        takePhoto: 'Ambil Foto',
        retake: 'Ambil Lagi',
        emptyGallery: 'Belum ada foto tersimpan. Arahkan pandangan dan tekan Ambil Foto.',
        savedCount: (n) => `${n} foto tersimpan`,
      },
    },
    night3CarChoice: {
      title: 'KACA MOBIL RETAK — APA YANG AKAN KAU LAKUKAN?',
      subtitle: 'Bensin mobil habis total. Badut itu tertawa menyeramkan lalu menjauh ke kegelapan.',
      optionExit: 'Keluar dari mobil',
      optionExitSub: 'Nejat keluar mobil dan lari melintasi parkiran',
      optionHide: 'Sembunyi di mobil, telepon Polisi & SMS John',
      optionHideSub: 'Merunduk di kabin mobil dan gunakan ponselmu untuk minta tolong',
    },
    victory: {
      night1Over: 'Shift Malam 1 Selesai',
      theFirstShift: 'SHIFT PERTAMA',
      night1Story1:
        'Duck melakukan absen pulang dan melangkah keluar melalui pintu kaca geser otomatis menuju udara pagi yang lembap.',
      night1Story2:
        'Ketika Duck menoleh kembali melalui jendela kaca depan, maskot badut itu berdiri di ruang makan yang gelap, diam sempurna, menatap lurus ke arah pintu keluar.',
      night1Sub: 'Dia tidak mengejar Duck. Dia tidak bergerak. Dia hanya mengawasi.',
      beginNight2: 'Mulai Malam 2: Ada yang Tidak Beres',
      mainMenu: 'Menu Utama',
      night2Over: 'Shift Malam 2 Selesai',
      theSecondShift: 'SHIFT KEDUA',
      night2Story1:
        'Tepat pukul 6:00 pagi, Duck menyerahkan buku catatan shift dan bergegas melewati kursi kosong menuju parkiran yang lembap.',
      night2Story2:
        'Namun ia tidak bisa melupakan wajah yang mengintip lewat pintu kaca depan saat pesanan terakhir—maupun bisik-bisik tentang mantan karyawan yang tidak pernah absen pulang.',
      night2Sub: 'Saat Duck menyerahkan makanan dan menoleh ke pintu lagi, sosok itu sudah menghilang.',
      beginNight3: 'Lanjut ke Malam 3',
      playNight2Again: 'Main Malam 2 Lagi',
      playAgain: 'Main Malam 1 Lagi',
    },
    night3Ending: {
      scrollingMessage:
        'Catatan: Saat polisi tiba, mereka tetap tidak berhasil menangkap badut itu, dan hanya menemukanku ketakutan di dalam mobil dengan kaca jendela yang retak dan berlumuran darahnya.\n\nAku berhasil sampai rumah tepat waktu, siapa badut itu? Apakah badut itu memperhatikanku? Aku tidak bisa berhenti bekerja karena aku belum membayar uang sewa. Kalau aku berhenti, aku akan jadi tunawisma. Ah sudahlah, lupakan saja...',
      badEndingTitle: 'ENDING BURUK (ENDING BAD)',
      badEndingMessage:
        'Ending Buruk. Kamu tertangkap oleh badut itu dan diubah menjadi ayam goreng, hidangan favorit para pelanggan. Sebenarnya, patung badut itu adalah badut itu sendiri, yang berdiri mematung tak bergerak selama dua malam seolah tidak terjadi apa-apa.',
      pressToFinishTyping: 'Klik atau tekan Spasi / E untuk menampilkan semua pesan',
      continueToCredits: 'Lanjutkan',
      demoOverTitle: 'DEMO SELESAI',
      demoOverSubtitle: "DEMO BERAKHIR — MCDONALD'S NIGHTFALL",
      creditsHeading: 'KREDIT',
      creditRows: [
        { role: 'Dibuat & Disutradarai Oleh', name: 'Nguyen Duck' },
        { role: 'Dunia 3D & Mesin', name: 'Three.js WebGL Architecture' },
        { role: 'Audio & Musik Horor', name: 'Web Audio Synthesis & Shift OST' },
        { role: 'Pemeran Karakter', name: 'Duck, John, Perawat Ramirez, Big Ray, Macan Muda & Sang Badut' },
      ],
      thankYouNote: 'Terima kasih sudah memainkan Demo McDonald’s Nightfall.',
      returnToMenu: 'Kembali ke Menu Utama',
    },
    engine: {
      steps: {
        talk_to_john: {
          title: 'BICARA DENGAN JOHN',
          description: 'Masuk lewat pintu geser dan bicara dengan karyawan John untuk mengambil alih shift malam.',
        },
        clock_in: {
          title: 'ABSEN MASUK',
          description: 'Berjalan ke mesin absen karyawan dekat kasir dan catat waktu mulai shift.',
        },
        clean_tables: {
          title: 'BERSIHKAN MEJA',
          description: (count) => `Lap dan bersihkan meja makan yang kotor (${count}/2).`,
        },
        mop_puddles: {
          title: 'PEL GENANGAN KOTOR',
          description: (count) =>
            `Ambil kain pel di sudut ruang keamanan dan bersihkan semua genangan kotor (${count}/8).`,
        },
        collect_trash: {
          title: 'KUMPULKAN SAMPAH',
          description: (count) => `Kumpulkan kantong sampah makanan dari area makan (${count}/2).`,
        },
        dump_trash: {
          title: 'BUANG SAMPAH KE LUAR',
          description: 'Bawa sampah keluar melalui pintu belakang dapur ke bak sampah.',
        },
        kitchen_fryers: {
          title: 'PERIKSA DAPUR',
          description: 'Matikan penggorengan dapur dan peralatan pemanas.',
        },
        check_cctv: {
          title: 'PERIKSA KEAMANAN',
          description: 'Periksa konsol pengawasan CCTV di ruang keamanan.',
        },
        finish_shift: {
          title: 'BERTAHAN HINGGA 6:00 AM',
          description: 'Persiapan selesai. Pelanggan mulai berdatangan. Layani pesanan mereka dan bertahan sampai pukul 6:00 pagi.',
          ready6am: 'Sudah pukul 6:00 AM! Absen keluar dan tinggalkan toko lewat pintu depan.',
        },
        n2_clock_in: {
          title: 'ABSEN MASUK',
          description: 'Absen masuk untuk shift Malam 2 di mesin absen karyawan.',
        },
        n2_breaker: {
          title: 'SAKELAR PEMELIHARAAN',
          description: 'Nyalakan sakelar pemeliharaan tambahan di kantor keamanan.',
        },
        n2_mop_puddle: {
          title: 'PEL GENANGAN KOTOR',
          description: (count) =>
            `Ambil kain pel di sudut ruang keamanan dan bersihkan semua 8 genangan kotor (${count}/8).`,
        },
        n2_cardboard: {
          title: 'DAUR ULANG KARDUS',
          description: 'Bawa tumpukan kardus terikat keluar ke bak sampah belakang.',
          carryDesc: 'Buang limbah kardus ke bak sampah luar ruangan.',
        },
        n2_drive_thru: {
          title: 'CEK JENDELA DRIVE-THRU',
          description: 'Periksa jendela layanan drive-thru yang transparan di dinding timur.',
        },
        n2_cctv_final: {
          title: 'PERIKSA PENGAWASAN',
          description: 'Periksa kamera kantor keamanan sebelum tutup.',
        },
        n3_clock_in: {
          title: 'ABSEN MASUK',
          description: 'Absen masuk untuk shift Malam 3 di mesin absen karyawan.',
        },
        n3_clean_tables: {
          title: 'LAP MEJA MAKAN',
          description: (count) => `Bersihkan meja makan (${count}/2). Aneh sekali patung badut itu menghilang begitu saja.`,
        },
        n3_kitchen_check: {
          title: 'NYALAKAN PENGGORENGAN',
          description: 'Periksa sakelar penggorengan dapur untuk menyiapkan pesanan ayam malam ini.',
        },
      },
      dynamicObjectives: {
        preparingTitle: 'MENYIAPKAN PESANAN TAMU...',
        preparingDesc: (sec) => `Memasak & menyeduh kopi di dapur (sisa ${sec} dtk). Lampu berkedip!`,
        prepFoodTitle: 'SIAPKAN MAKANAN TAMU',
        prepFoodDesc: (name) =>
          `Pergi ke dapur, masak makanan & seduh kopi untuk ${name} (tunggu 5 detik).`,
        serveTitle: 'ANTAR PESANAN TAMU',
        serveDesc: (name) => `Antarkan nampan makanan hangat di tangan ke ${name} di kasir depan.`,
        serveDriveThruDesc: (name) =>
          `Antarkan nampan makanan hangat ke ${name} yang menunggu di Jendela Drive-Thru.`,
        restockFreezerTitle: 'AMBIL NAMPAN AYAM DI FREEZER',
        restockFreezerDesc:
          'Stok ayam di dapur habis! Masuk ke Ruang Freezer (belakang dapur) dan ambil Nampan Ayam.',
        restockKitchenTitle: 'ISI ULANG STOK DAPUR',
        restockKitchenDesc:
          'Bawa Nampan Ayam di tanganmu kembali ke meja persiapan dapur untuk mengisi ulang stok.',
        checkBathroomTitle: 'PERIKSA TOILET',
        checkBathroomDesc:
          'Ada suara ketukan aneh dari toilet! Masuk ke dalam dan periksa siapa di sana.',
        powerOutageTitle: 'PERIKSA KOTAK LISTRIK (3:00 AM)',
        powerOutageDesc: 'Listrik tiba-tiba padam! Pergi ke belakang toko dan periksa kotak listrik.',
        powerOutageWithFoodDesc:
          'Listrik padam dan tamu langsung pergi! Cek kotak listrik di belakang dan buang makanan di tangan ke tempat sampah.',
        discardFoodTitle: 'BUANG MAKANAN KE TEMPAT SAMPAH',
        discardFoodDesc:
          'Pelanggan pergi saat listrik padam. Buang makanan sisa di tanganmu ke tempat sampah dapur atau bak sampah luar.',
        hungerFadeTitle: 'LAPAR SETELAH SHIFT',
        hungerFadeDesc: 'Menuju ke 67-Eleven untuk membeli makanan sebelum pulang...',
        store67NoodlesTitle: 'PERGI KE RAK MI & AIR',
        store67NoodlesDesc:
          'Masuk ke 67-Eleven menuju rak NOODLES & WATER untuk mengambil mi cup dan minuman energi merah.',
        store67CashierTitle: 'BAYAR DI KASIR 67-ELEVEN',
        store67CashierDesc: 'Bawa mi dan minuman energi merahmu ke karyawan 67-Eleven untuk membayar.',
        store67CarTitle: 'KEMBALI KE MOBIL DUCK',
        store67CarDesc: 'Keluar dari 67-Eleven menuju mobil birumu untuk mengakhiri shift malam.',
        goToMcdCarTitle: 'MASUK KE MOBIL DUCK & PULANG',
        goToMcdCarDesc: 'Badut itu berdiri di dalam mengawasi dan tertawa seram! Cepat masuk ke mobil biru tua milikmu dan langsung pulang.',
        pickupFryTitle: 'LANGKAH 1: AMBIL AYAM & KENTANG DI TANGAN',
        pickupFryDesc: (name) =>
          `Ambil ayam dan kentang mentah di meja dapur untuk pesanan ${name}.`,
        fryChickenTitle: 'LANGKAH 2: MASUKKAN KE PENGGORENGAN',
        fryChickenDesc: (name) =>
          `Masukkan ayam dan kentang dari tanganmu ke Mesin Penggorengan untuk ${name} (5 dtk).`,
        fryingProgressTitle: 'MENGGORENG AYAM & KENTANG...',
        fryingProgressDesc: (sec) => `Mendesis & berasap di penggorengan (sisa ${sec} dtk)...`,
        pickupBurgerTitle: 'LANGKAH 3: AMBIL BIG MAC DI TANGAN',
        pickupBurgerDesc: (name) =>
          `Ambil Big Mac di meja dapur untuk pesanan ${name}.`,
        microwaveTitle: 'LANGKAH 4: MASUKKAN BIG MAC KE MICROWAVE',
        microwaveDesc: (name) =>
          `Masukkan Big Mac dari tanganmu ke Microwave dapur untuk ${name} (5 dtk).`,
        microwavingProgressTitle: 'MEMANASKAN BIG MAC...',
        microwavingProgressDesc: (sec) => `Memanaskan Big Mac di microwave (sisa ${sec} dtk)...`,
        pickupCoffeeCupTitle: 'MINUMAN: AMBIL GELAS KOPI',
        pickupCoffeeCupDesc: (name) =>
          `Ambil gelas kopi kosong di tanganmu dari meja dapur untuk ${name}.`,
        coffeeMachineTitle: 'BUAT KOPI DI MESIN KOPI',
        coffeeMachineDesc: (name) =>
          `Masukkan gelas ke Mesin Kopi untuk ${name} dan tunggu 3 detik.`,
        brewingCoffeeProgressTitle: 'MENYEDUH KOPI...',
        brewingCoffeeProgressDesc: (sec) => `Menyeduh kopi McCafé panas (sisa ${sec} dtk)...`,
        pickupSodaCupTitle: 'MINUMAN: AMBIL GELAS SODA',
        pickupSodaCupDesc: (name) =>
          `Ambil gelas soda kosong di tanganmu dari meja dapur untuk ${name}.`,
        sodaDispenserTitle: 'TUANG SODA DI DISPENSER',
        sodaDispenserDesc: (name) =>
          `Masukkan gelas ke Dispenser Minuman Soda untuk ${name} dan tunggu 3 detik.`,
        pouringSodaProgressTitle: 'MENUANG MINUMAN SODA...',
        pouringSodaProgressDesc: (sec) => `Mengisi minuman soda di dispenser (sisa ${sec} dtk)...`,
        wrapFoodTitle: 'BAWA SEMUA KE MEJA DAPUR & BUNGKUS RAPI',
        wrapFoodDesc: (name) =>
          `Bawa semua makanan & minuman kembali ke meja dapur dan bungkus rapi untuk ${name} (2 dtk).`,
        wrappingProgressTitle: 'MEMBUNGKUS PESANAN...',
        wrappingProgressDesc: (sec) => `Membungkus makanan & minuman di meja dapur (sisa ${sec} dtk)...`,
        pickupFinishedTitle: 'AMBIL HIDANGAN JADI DARI MEJA DAPUR',
        pickupFinishedDesc: (name) =>
          `Ambil hidangan jadi dari meja dapur dan letakkan di meja saji kasir untuk ${name}.`,
        night3CarEmergencyTitle: 'SEMBUNYI & MINTA TOLONG',
        night3CarEmergencyDesc:
          'Tetap bersembunyi di dalam mobil! Buka Ponsel [P] untuk telepon Polisi (911) & SMS John.',
      },
      notices: {
        completed: (title) => `SELESAI: ${title}`,
        newTaskPrep: (name) => `TUGAS BARU: SIAPKAN MAKANAN UNTUK ${name.toUpperCase()}`,
        orderCompleted: (price) => `PESANAN SELESAI: $${price}`,
        prepStarted: 'MENYIAPKAN PESANAN TAMU... (sisa 5 dtk)',
        prepInProgress: (sec) => `Sedang memasak (sisa ${sec} dtk)... Harap tunggu!`,
        mealInHands: 'Makanan sudah di tanganmu! Antarkan ke tamu.',
        noPendingOrders: 'Belum ada pesanan untuk dimasak saat ini. Tunggu tamu memesan.',
        orderReady: 'PESANAN SIAP! Sudah di tanganmu. Antarkan ke tamu.',
        shiftEnds6am: (timeStr) =>
          `Shift berakhir tepat pukul 6:00 AM. Sekarang pukul ${timeStr}. Harap layani pesanan pelanggan hingga fajar.`,
        shiftSkipped6am: 'TAMU TERAKHIR DILAYANI — JAM SHIFT LOMPAT KE 6:00 AM!',
        powerOutage: '⚡ MATI LAMPU JAM 3:00 PAGI — PERIKSA KOTAK LISTRIK DI BELAKANG TOKO!',
        powerRestored: '⚡ LISTRIK KEMBALI MENYALA — PEMUTUS ARUS DIAKTIFKAN',
        mopPickedUp: '🧹 KAIN PEL DIAMBIL — BERSIHKAN SEMUA 8 GENANGAN KOTOR',
        mopRequired: '⚠️ BUTUH KAIN PEL DULU! Ambil di sudut ruang keamanan.',
        foodDiscarded: '🗑️ MAKANAN SISA DIBUANG KE TEMPAT SAMPAH',
        discardFoodFirst: '⚠️ BUANG MAKANAN SISA DI TANGANMU KE TEMPAT SAMPAH TERLEBIH DAHULU!',
        outOfFood: '❄️ STOK AYAM DAPUR HABIS! PERGI KE RUANG FREEZER!',
        chickenTrayPickedUp: '🍗 NAMPAN AYAM DIAMBIL — BAWA KE MEJA DAPUR!',
        kitchenRestocked: '✅ STOK AYAM SEGAR DAPUR BERHASIL DIISI ULANG!',
        restockFoodFirst: '⚠️ MAKANAN HABIS! Ambil Nampan Ayam dari Ruang Freezer terlebih dahulu.',
        bathroomKnock: '🚪 SUARA KETUKAN DARI TOILET! PERIKSA SEKARANG!',
        bathroomNothingHere: 'Tidak ada apa-apa — toilet kosong.',
        driveThruArrived: '🚗 MOBIL PELANGGAN TIBA DI JENDELA DRIVE-THRU!',
        duckHungry: '🍜 DUCK LAPAR — MENUJU KE 67-ELEVEN!',
        arrived67Eleven: '🏪 TIBA DI 67-ELEVEN — CARI RAK MI & AIR',
        pickedUpNoodlesDrink: '🥤 MI & MINUMAN ENERGI MERAH DIAMBIL — BAYAR DI KASIR',
        paidAt67Eleven: '💵 SUDAH BAYAR $10 — MENUJU MOBIL DUCK UNTUK AKHIRI MALAM',
        statueMoved: '🤡 PATUNG BADUT MENGHILANG... JOHN TIDAK TAHU KE MANA PERGINYA.',
        clownWatchingCar: '🤡 BADUT ITU BERDIRI DI DALAM MENGAWASI & TERTAWA SERAM! CEPAT KE MOBIL!',
        rawFryInHand: '🥩 MEMEGANG AYAM & KENTANG — MASUKKAN KE MESIN PENGGORENGAN!',
        needRawFryInHand: '⚠️ AMBIL AYAM & KENTANG DI MEJA DAPUR TERLEBIH DAHULU!',
        fryStarted: '🍟 DIMASUKKAN KE PENGGORENGAN! MENGGORENG... (5 dtk)',
        fryDone: '✅ MATANG! AMBIL BIG MAC DI MEJA DAPUR!',
        bigMacInHand: '🍔 MEMEGANG BIG MAC — MASUKKAN KE MICROWAVE!',
        needBigMacInHand: '⚠️ AMBIL BIG MAC DI MEJA DAPUR TERLEBIH DAHULU!',
        coffeeCupInHand: '☕ MEMEGANG GELAS KOPI — MASUKKAN KE MESIN KOPI (3 dtk)!',
        needCoffeeCupInHand: '⚠️ AMBIL GELAS KOPI DI MEJA DAPUR TERLEBIH DAHULU!',
        coffeeStarted: '☕ MENYEDUH KOPI DI MESIN KOPI... (3 dtk)',
        coffeeDone: '✅ KOPI SIAP! LANJUTKAN KE LANGKAH BERIKUTNYA!',
        sodaCupInHand: '🥤 MEMEGANG GELAS SODA — MASUKKAN KE DISPENSER SODA (3 dtk)!',
        needSodaCupInHand: '⚠️ AMBIL GELAS SODA DI MEJA DAPUR TERLEBIH DAHULU!',
        sodaStarted: '🥤 MENUANG SODA DI DISPENSER... (3 dtk)',
        sodaDone: '✅ SODA SELESAI! BAWA KEMBALI KE MEJA DAPUR UNTUK DIBUNGKUS!',
        microwaveStarted: '📡 BIG MAC DI MICROWAVE... MEMANASKAN (5 dtk)',
        microwaveDone: '🔔 TING! LANJUTKAN LANGKAH BERIKUTNYA DI MEJA DAPUR!',
        wrapStarted: '📦 MEMBUNGKUS SEMUA DI MEJA DAPUR... (2 dtk)',
        dishOnKitchenTable: '🍽️ HIDANGAN SELESAI DI MEJA DAPUR! AMBIL & TARUH DI MEJA SAJI!',
        night3CarNoGas: '⛽ BENSIN HABIS! MESIN TIDAK MAU MENYALA!',
        night3WindowCracked: '💥 KACA PINTU PENGEMUDI RETAK TERKENA BENTURAN!',
        night3PoliceOnWay: '🚓 911 & JOHN DIHUBUNGI — SIRINE POLISI MENDEKAT!',
      },
      prompts: {
        talkToJohn: '[E] Bicara dengan John (Ambil Alih Shift)',
        deliverMeal: (name) => `[E] Antar Makanan Hangat ke ${name}`,
        talkAwaiting: (name) => `[E] Bicara dengan ${name} (Menunggu Pesanan)`,
        takeOrder: (name) => `[E] Terima Pesanan dari ${name}`,
        driveThruTakeOrder: (name) => `[E] Terima Pesanan Drive-Thru (${name})`,
        driveThruDeliverMeal: (name) => `[E] Serahkan Makanan Lewat Jendela Drive-Thru (${name})`,
        talkSilas: '[E] Bicara dengan Silas (Pelanggan Tetap)',
        cookingKitchen: (sec) => `⏳ Memasak di Dapur (sisa ${sec} dtk)...`,
        cookKitchen: '[E] Masak di Dapur & Seduh Kopi (5 dtk)',
        pickUpChickenTray: '[E] Ambil Nampan Ayam dari Freezer',
        restockChickenTray: '[E] Isi Ulang Dapur dengan Nampan Ayam',
        inspectElectricalBox: '[E] Periksa Kotak Listrik & Nyalakan Pemutus Arus',
        throwFoodInTrash: '[E] Buang Makanan ke Tempat Sampah',
        pickUpMop: '[E] Ambil Kain Pel',
        mopPuddle: '[E] Pel Genangan Kotor',
        mopRequiredPrompt: '⚠️ Ambil kain pel di sudut ruang keamanan dulu!',
        takeNoodlesAndDrink: '[E] Ambil Mi Cup & Minuman Energi Merah (Rak Mi & Air)',
        talkCashier67: '[E] Bayar ke Karyawan 67-Eleven ($10)',
        enterDuckCar: '[E] Masuk ke Mobil Duck (Akhiri Shift Malam)',
        enterMcdDuckCar: '[E] Masuk ke Mobil Duck & Langsung Pulang',
        takeRawFry: '[E] Ambil Ayam & Kentang di Tangan',
        takeBigMac: '[E] Ambil Big Mac di Tangan',
        takeCoffeeCup: '[E] Ambil Gelas Kopi di Tangan',
        takeSodaCup: '[E] Ambil Gelas Soda di Tangan',
        takeFinishedDish: '[E] Ambil Hidangan Jadi dari Meja Dapur',
        placeDishOnTable: '[E] Letakkan Hidangan di Meja Saji',
        useFryer: '[E] Masukkan Ayam & Kentang ke Penggorengan (5 dtk)',
        fryingNow: (sec) => `🍟 Menggoreng Ayam & Kentang (${sec} dtk)...`,
        useMicrowave: '[E] Masukkan Big Mac ke Microwave (5 dtk)',
        microwavingNow: (sec) => `📡 Memanaskan Big Mac (${sec} dtk)...`,
        useCoffeeMachine: '[E] Masukkan Gelas ke Mesin Kopi (3 dtk)',
        brewingCoffeeNow: (sec) => `☕ Menyeduh Kopi (${sec} dtk)...`,
        useSodaDispenser: '[E] Masukkan Gelas ke Dispenser Soda (3 dtk)',
        pouringSodaNow: (sec) => `🥤 Menuang Soda (${sec} dtk)...`,
        wrapFoodCounter: '[E] Bawa Semua ke Meja Dapur & Bungkus Rapi (2 dtk)',
        wrappingNow: (sec) => `📦 Membungkus Makanan (${sec} dtk)...`,
        actions: {
          employee_john: 'Bicara dengan John (Ambil Alih Shift)',
          time_clock: 'Absen di Mesin Absen Karyawan',
          clean_table_1: 'Lap & Bersihkan Meja 1',
          clean_table_2: 'Lap & Bersihkan Meja 2',
          trash_bag_1: 'Ambil Kantong Sampah Meja Makan',
          trash_bag_2: 'Ambil Kantong Sampah Meja Makan',
          outdoor_dumpster: 'Buang Sampah ke Bak Sampah Luar',
          trash_bin: 'Buang Makanan ke Tempat Sampah',
          kitchen_switch: 'Matikan Penggorengan & Pemanas Dapur',
          office_switch: 'Nyalakan Lampu Tambahan Lorong',
          cctv_monitor: 'Buka Monitor Keamanan CCTV',
          front_door_exit: 'Absen Pulang & Keluar Lewat Pintu Depan',
          mop_tool: 'Ambil Kain Pel',
          hallway_spill: 'Pel & Bersihkan Genangan Kotor',
          cardboard_bundle: 'Ambil Tumpukan Kardus Terikat',
          drive_thru_window: 'Periksa Jendela Layanan Drive-Thru',
          drive_thru_order_station: 'Cek Headset & Terminal Drive-Thru',
          freezer_chicken_tray: 'Ambil Nampan Ayam dari Freezer',
          fryer_machine: 'Goreng Ayam & Kentang di Penggorengan',
          kitchen_microwave: 'Panaskan Big Mac di Microwave',
          coffee_machine: 'Seduh Kopi di Mesin Kopi',
          soda_dispenser: 'Tuang Soda di Dispenser Soda',
          serve_table_spot: 'Letakkan Hidangan Jadi di Meja Saji',
          electrical_box: 'Periksa Kotak Listrik & Pulihkan Daya',
          toilet_flush: 'Siram Toilet',
          store_67_noodle_stall: 'Ambil Mi & Minuman Energi Merah',
          store_67_cashier: 'Bayar ke Karyawan 67-Eleven ($10)',
          store_67_car: 'Masuk ke Mobil Duck',
          mcd_duck_car: 'Masuk ke Mobil Duck & Langsung Pulang',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Satu malam lagi di tempat ini… berdiri di luar dalam kabut dingin.' },
        { speaker: 'Duck', text: 'Gaji minimum, hutan gelap, dan shift 6 jam. John seharusnya masih di dalam menunggu untuk serah terima shift.' },
        { speaker: 'Duck', text: 'Ayo masuk lewat pintu geser dan bicara dengan John.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Kembali untuk Malam 2… Area parkir dan hutan terasa sangat sunyi malam ini.' },
        { speaker: 'Duck', text: 'John masih menunggu di dalam dekat kasir. Ayo masuk lewat pintu geser dan bicara dengannya.' },
      ],
      openingMonologueNight3: [
        { speaker: 'Duck', text: 'Satu malam kerja lagi… Kenapa aku terus kembali ke tempat ini?' },
        { speaker: 'Duck', text: 'Uang sewa belum kubayar, jadi aku tidak punya pilihan. Ayo masuk dan bicara dengan John.' },
      ],
      johnDialogue: [
        { speaker: 'John', text: 'Yo! Karyawan baru! Kamu baru di sini ya?' },
        { speaker: 'Duck', text: 'Iya, memangnya kenapa?' },
        { speaker: 'John', text: 'Haha, santai saja! Shift-ku akhirnya selesai, jadi sekarang aku serahkan semuanya padamu.' },
        { speaker: 'John', text: 'Dengarkan baik-baik — ini semua yang harus kamu lakukan selama shift malam.' },
        { speaker: 'John', text: 'Pertama, absen masuk di mesin absen dekat meja kasir. Setelah itu lap meja makan yang kotor dan kumpulkan kantong sampah.' },
        { speaker: 'John', text: 'Bawa kantong sampah keluar lewat pintu belakang dapur ke bak sampah, matikan penggorengan, lalu cek monitor CCTV di ruang keamanan.' },
        { speaker: 'John', text: 'Lewat tengah malam, tamu akan datang lewat lobi maupun jendela Drive-Thru. Terima pesanan, masak di dapur selama 5 detik, lalu sajikan. Kalau ayam habis, ambil nampan baru dari ruang freezer di belakang dapur!' },
        { speaker: 'John', text: 'Satu peringatan lagi... kalau lampu dapur berkedip saat kamu memasak, jangan panik. Dan jangan menatap maskot badut itu terlalu lama. Sampai jumpa jam 6 pagi!' },
        { speaker: 'Duck', text: 'Orang yang aneh... Baiklah, ayo absen masuk dan selesaikan shift ini.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Oh, hai Duck. Syukurlah kamu benar-benar kembali untuk Malam 2.' },
        { speaker: 'Duck', text: 'Ya, tagihan tidak bisa bayar sendiri. Malam ini tenang kan?' },
        { speaker: 'John', text: 'Lumayan... kecuali manajemen baru menempel pengumuman lagi di belakang. Masih belum ada kabar soal mantan staf shift malam yang menghilang minggu lalu.' },
        { speaker: 'Duck', text: 'Orang yang kugantikan itu? Tunggu—dia hilang di sekitar sini?' },
        { speaker: 'John', text: 'Polisi menemukan mobilnya di tepi hutan dengan topi seragamnya masih di dasbor. Bos melarang kami membahasnya di depan pelanggan, tapi semua orang di kota sudah membicarakannya.' },
        { speaker: 'John', text: 'Pokoknya tugas malam ini: absen masuk, nyalakan pemutus arus kantor, pel semua genangan di lantai, buang kardus, periksa jendela drive-thru, cek CCTV, dan layani tamu lobi maupun drive-thru sampai jam 6:00 pagi.' },
        { speaker: 'Duck', text: 'Hebat sekali... rekan lama yang hilang dan shift tengah malam lagi. Sampai jumpa subuh, John.' },
      ],
      johnDialogueNight3: [
        { speaker: 'John', text: 'Hai Duck… syukurlah kamu masuk kerja lagi malam ini.' },
        { speaker: 'Duck', text: 'Tunggu sebentar, John. Ke mana perginya patung badut yang biasa berdiri di dekat meja kasir?' },
        { speaker: 'John', text: 'Entahlah—aku juga merinding melihatnya. Patung itu sudah benar-benar hilang sebelum aku membuka pintu malam ini.' },
        { speaker: 'Duck', text: 'Hilang? Tidak dibawa ke gudang atau diperbaiki?' },
        { speaker: 'John', text: 'Aku benar-benar tidak tahu ke mana perginya. Tidak ada laporan perawatan atau kru yang datang sama sekali.' },
        { speaker: 'John', text: 'Absen masuk saja, lap meja, nyalakan penggorengan dapur, dan layani tamu yang datang. Selesai shift langsung pulang ya.' },
        { speaker: 'Duck', text: 'Patung besar bisa menghilang di toko terkunci dan tak ada yang tahu… Baiklah. Selamat malam, John.' },
      ],
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Apaan nih?! Ada apa ini? Apa bos lupa bayar tagihan listrik? Entahlah, aku pergi ke belakang toko untuk mengeceknya.',
        },
      ],
      customerPowerOutageLeave:
        'Ya Tuhan, apa-apaan ini? Begini tidak bisa dibiarkan, aku tidak jadi beli makanan, aku pergi.',
      powerRestoredDialogue: [
        {
          speaker: 'Duck',
          text: 'Hah, seseorang mematikan pemutus arus listriknya, ini bukan pemadaman listrik.',
        },
      ],
      warehouseClownReactionDialogue: [
        {
          speaker: 'Duck',
          text: 'Siapa orang tadi yang menatapku? Sudahlah, yang penting listriknya sudah menyala lagi.',
        },
      ],
      outOfFoodDialogue: [
        {
          speaker: 'Duck',
          text: 'Tunggu sebentar—ayam di meja dapur barusan habis total! Aku harus masuk ke ruang freezer di belakang dapur untuk mengambil nampan ayam baru.',
        },
      ],
      bathroomKnockDialogue:
        'Suara apa itu dari kamar mandi? Jam segini tidak ada siapa-siapa di sini, aku harus mengeceknya.',
      bathroomEmptyDialogue:
        'Tidak ada apa-apa... kosong melompong. Padahal rasanya tadi jelas sekali ada yang mengetuk pintu bilik.',
      duckHungerDialogue: [
        {
          speaker: 'Duck',
          text: 'Ah, aku lapar sekali! Aku harus beli sesuatu sebelum shift-ku berakhir.',
        },
      ],
      clerk67Dialogue: [
        {
          speaker: 'Karyawan 67-Eleven',
          text: 'Totalnya $10, terima kasih.',
        },
      ],
      clownCustomerName: 'Sang Badut',
      clownCustomerTitle: 'Tamu Tengah Malam Tak Diundang',
      clownCustomerOrderItem: 'Ayam Goreng Renyah',
      clownBuyChickenDialogue: [
        {
          speaker: 'Sang Badut',
          text: 'Heh… heh… selamat malam, si kecil berbulu kuning di balik kaca.',
        },
        {
          speaker: 'Duck',
          text: 'Eh… ada yang bisa saya bantu, Pak? Kenapa pakaian Anda—tunggu, apakah kita saling kenal?',
        },
        {
          speaker: 'Sang Badut',
          text: 'Begitu bising saat penggorengan mendesis, begitu sunyi saat lampu padam. Aku datang untuk membeli ayam gorengmu… renyah… hangat… keemasan.',
        },
        {
          speaker: 'Duck',
          text: 'Baiklah… satu porsi ayam goreng renyah. Tunggu lima detik di dapur…',
        },
        {
          speaker: 'Sang Badut',
          text: 'Ambil saja waktumu, Duck. Saat aku mengawasi, aku tidak pernah terburu-buru.',
        },
      ],
      clownChickenDeliveredDialogue: (price) => [
        {
          speaker: 'Duck',
          text: `Ini ayam goreng Anda… totalnya $${price}.`,
        },
        {
          speaker: 'Sang Badut',
          text: 'Heh heh heh… baunya tercium sampai ke pepohonan gelap di luar sana. Jangan khawatirkan patung di pojok itu… dia hanya lebih suka pemandangan ke arah kasir.',
        },
        {
          speaker: 'Sang Badut',
          text: 'Hati-hati menyetir pulang, karyawan kecil. Aku akan berdiri di dalam sini dan mengawasimu berjalan ke mobil.',
        },
      ],
      clownWatchingCarMonologue: [
        {
          speaker: 'Duck',
          text: 'Dia hanya berdiri di dalam pintu kaca sambil menatapku dan tertawa menyeramkan… Aku harus cepat ke mobil dan langsung pulang!',
        },
      ],
      night3CarNoGasDialogue: [
        {
          speaker: 'Duck',
          text: 'Sial, kenapa mobilnya kehabisan bensin sekarang sih!',
        },
      ],
      night3CarPostAttackDialogue: [
        {
          speaker: 'Duck',
          text: 'Brengsek! Dia gila, apa dia benar-benar mau membunuhku?',
        },
      ],
      waitRestockDialogue: (customerName) => [
        {
          speaker: 'Duck',
          text: `Tunggu sebentar ya, ${customerName}! Stok ayam kami baru saja habis—aku ambilkan nampan segar dari freezer dulu.`,
        },
      ],
      thankYouDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Terima kasih banyak, Duck! Ini $${price} untuk makanannya. Ambil saja kembaliannya!`,
        },
        {
          speaker: 'Duck',
          text: 'Terima kasih! Selamat menikmati makanan Anda dan hati-hati di luar malam ini.',
        },
      ],
      grumpyDeliveredDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Lama sekali! Bikin pesanan segini saja berjam-jam. Ini $${price}—jangan harap dapat tip atau senyuman jam 3 pagi begini.`,
        },
        {
          speaker: 'Duck',
          text: '...Baiklah. Bahkan bilang terima kasih pun tidak. Tetap hati-hati di jalan, Pak.',
        },
      ],
      friendsSeatedDialogue: (customerName, price) => [
        {
          speaker: customerName,
          text: `Mantap, masih panas mengepul! Ini $${price}, Duck. Terima kasih banyak ya!`,
        },
        {
          speaker: 'Leo',
          text: 'Ayo duduk di meja sudut itu, makan cepat sebelum kita langsung cabut ke warnet!',
        },
        {
          speaker: 'Duck',
          text: 'Selamat makan, Macan Muda! Hati-hati jangan sampai ketahuan ibu kalian pas menyelinap pulang nanti.',
        },
      ],
      waitingOrderDialogue: (customerName, itemText) => [
        {
          speaker: customerName,
          text: `Saya masih menunggu pesanan ${itemText} saya ya! Aromanya enak dari belakang.`,
        },
        {
          speaker: 'Duck',
          text: 'Sedang dimasak di meja dapur sekarang! Cuma butuh 5 detik.',
        },
      ],
      customers: [
        {
          name: 'Perawat Ramirez',
          title: 'Pekerja Shift Malam yang Kelelahan',
          orderItem: 'Paket Big Mac dengan Kopi McCafé Panas & Kentang Goreng',
          dialogue: [
            { speaker: 'Perawat Ramirez', text: 'Hei... tolong bilang teko kopinya masih panas. Baru selesai shift IGD 14 jam yang melelahkan.' },
            { speaker: 'Duck', text: 'Baru diseduh lima menit lalu. Shift malam memang menguras tenaga ya?' },
            { speaker: 'Perawat Ramirez', text: 'Kamu tidak tahu betapa lelahnya. Tapi jujur... di sini terasa lebih sunyi dari kamar mayat malam ini. Jalanan di luar kosong melompong.' },
            { speaker: 'Duck', text: 'Ya, biasanya ada anak-anak berisik. Malam ini cuma ada aku, penggorengan, dan maskot badut seram yang duduk di sana.' },
            { speaker: 'Perawat Ramirez', text: 'Kunci pintu depan kalau bisa, Nak. Suasana di luar terasa sangat janggal malam ini.' },
            { speaker: 'Duck', text: 'Aturan perusahaan mewajibkan lobi buka 24/7. Biar pun badut hantu menyerang, manajer tetap memotong gajiku.' },
            { speaker: 'Perawat Ramirez', text: 'Pokoknya, pesan satu paket Big Mac dengan kopi panas dan kentang goreng ya. Aku sangat lapar.' },
            { speaker: 'Duck', text: 'Siap! Akan langsung kusiapkan di dapur.' },
          ],
        },
        {
          name: 'Tyler',
          title: 'Remaja Gelisah',
          orderItem: '10 Potong Chicken McNuggets dengan Kentang & Sprite',
          dialogue: [
            { speaker: 'Tyler', text: 'Yo... bro. Bro! Kamu lihat itu?! Apa patung badut Ronald di kursi makan tadi menolehkan kepalanya?!' },
            { speaker: 'Duck', text: 'Itu plastik kosong dan fiberglass yang dibaut ke lantai. Dia tidak bisa bergerak, Tyler.' },
            { speaker: 'Tyler', text: 'Aku berani sumpah tadi menghadap jendela waktu aku parkir! Sekarang kepalanya miring lurus ke arah kasir!' },
            { speaker: 'Duck', text: 'Gajiku delapan dolar per jam. Kalaupun badut itu hidup, bayaranku tidak cukup untuk lari.' },
            { speaker: 'Tyler', text: 'Aku bungkus bawa pulang saja. Pesan paket 10 McNuggets saus BBQ dan Sprite ukuran besar!' },
            { speaker: 'Duck', text: 'Siap laksanakan. Kugoreng nugget dan kentangnya di dapur sekarang.' },
          ],
        },
        {
          name: 'Kakek Silas',
          title: 'Pelanggan Tetap Misterius',
          orderItem: 'Teh Hitam Panas & Pai Apel Panggang',
          dialogue: [
            { speaker: 'Kakek Silas', text: 'Dia tidak suka dengungan lampu neon, anak muda. Dia hanya mendengarkan saat tabungnya mulai berkedip.' },
            { speaker: 'Duck', text: 'Pak, kalau mau memesan makanan, saya siap di meja kasir.' },
            { speaker: 'Kakek Silas', text: 'Empat puluh tahun lalu, tanah ini milik hutan. Senyum yang dilukis dengan cat minyak tak pernah benar-benar terhapus.' },
            { speaker: 'Duck', text: 'Baiklah. Begini Silas, burgernya daging sapi dan badutnya dari resin. Mau pesan apa?' },
            { speaker: 'Kakek Silas', text: 'Teh hitam panas dan pai apel panggang hangat, bebek muda. Pastikan tehnya tetap panas.' },
            { speaker: 'Duck', text: 'Dimengerti. Saya ke dapur menyiapkan teh dan pai apelnya sekarang.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Tukang Ledeng Ceria & Pelanggan Tengah Malam',
          orderItem: 'Ember Ayam Goreng Super & Espresso Power-Up',
          dialogue: [
            { speaker: 'Big Ray', text: "Wahoo! It's-a me, Big Ray! Selamat malam, teman kecilku!" },
            { speaker: 'Duck', text: 'Eh... hai Big Ray. Penampilanmu seperti baru melompat keluar dari pipa hijau.' },
            { speaker: 'Big Ray', text: 'Mamma mia! Baru saja memperbaiki tiga pipa bocor malam ini—sekarang perutku butuh tenaga Super Star!' },
            { speaker: 'Duck', text: 'Haha, masuk akal. Mau kumasakkan apa untukmu, Mario?' },
            { speaker: 'Big Ray', text: "Ember ayam goreng renyah, burger jamur ekstra, dan espresso panas! Let's-a go!" },
            { speaker: 'Duck', text: 'Siap, Big Ray! Lima detik di dapur.' },
          ],
        },
        {
          name: 'Maya Lin',
          title: 'Mahasiswi Begadang',
          orderItem: 'McCafé Mocha Dingin & Burger Ayam Renyah Pedas',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Hei... bilang dong mesin espressonya masih nyala? Ngerjain skripsi jam 2 pagi ternyata ide yang buruk.' },
            { speaker: 'Duck', text: 'Mesin McCafé masih panas dan berdengung. Lagi kejar deadline ujian ya?' },
            { speaker: 'Maya Lin', text: 'Lebih parah—lampu mobilku sempat menyorot sosok jangkung dekat pohon pinus pas belok masuk parkiran, lalu sinyal HP langsung mati total.' },
            { speaker: 'Duck', text: 'Di sekitar hutan ini memang banyak satwa liar. Rusa, rakun... semoga bukan badut.' },
            { speaker: 'Maya Lin', text: 'Tunggu, apa? Pokoknya pesan iced mocha dan burger ayam renyah pedas biar aku tetap melek.' },
            { speaker: 'Duck', text: 'Siap! Kugoreng ayam dan kuseduh kopinya di dapur sekarang.' },
          ],
        },
        {
          name: 'Paramedis Carter',
          title: 'Petugas Medis Shift Malam',
          orderItem: 'Ember Ayam Goreng & Espresso Ganda',
          dialogue: [
            { speaker: 'Paramedis Carter', text: 'Pos 4 lagi sepi, sekalian mampir saat patroli. Cuma kamu sendiri yang jaga kasir malam ini?' },
            { speaker: 'Duck', text: 'Cuma aku dan penggorengan sampai jam 6 pagi. Ada kejadian aneh di radio ambulans malam ini?' },
            { speaker: 'Paramedis Carter', text: 'Tiga panggilan 911 palsu berisi suara statis dari telepon umum sepanjang jalan raya ini—tidak ada yang bicara, cuma suara napas dan klakson karnaval.' },
            { speaker: 'Duck', text: 'Oke, itu jauh lebih menyeramkan daripada pelanggan yang rewel.' },
            { speaker: 'Paramedis Carter', text: 'Pastikan lampu pintu tetap terang, Nak. Pesan ember ayam goreng renyah dan kopi ganda.' },
            { speaker: 'Duck', text: 'Siap meluncur! Lima detik di dapur.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Pelancong Jalan Tol yang Tersesat',
          orderItem: 'Caramel Latte Panas & Pai Apel',
          dialogue: [
            { speaker: 'Clara Novak', text: 'Permisi... GPS saya kehilangan sinyal satelit sejak sepuluh mil lalu. Ini masih Jalur 9 kan?' },
            { speaker: 'Duck', text: 'Betul Bu, ruas sepi Jalur 9. Hutan memblokir hampir semua sinyal saat malam hari.' },
            { speaker: 'Clara Novak', text: 'Saya berani sumpah sudah dua kali melewati papan merah toko ini, seolah jalannya memutar kembali masuk ke hutan.' },
            { speaker: 'Duck', text: 'Kabut tebal sering mengecoh pengemudi di sekitar sini. Mau minum sesuatu yang hangat sebelum melanjutkan perjalanan?' },
            { speaker: 'Clara Novak', text: 'Caramel latte panas dan pai apel hangat terdengar sangat pas. Terima kasih.' },
            { speaker: 'Duck', text: 'Langsung kubuatkan—sebentar lagi kuantar nampannya.' },
          ],
        },
      ],
      customersNight2: [
        {
          name: 'Perawat Ramirez',
          title: 'Pekerja Shift Malam yang Kelelahan',
          orderItem: 'Kopi McCafé Panas & Ember Ayam Goreng Renyah',
          dialogue: [
            { speaker: 'Perawat Ramirez', text: 'Selamat malam. Tunggu—kamu jaga malam sendirian sekarang? Kukira malam ini aku masih bakal lihat Marcus di kasir.' },
            { speaker: 'Duck', text: 'Marcus? Itu mantan karyawan shift malam yang lagi dibicarakan semua orang ya?' },
            { speaker: 'Perawat Ramirez', text: 'Iya. Dua minggu lalu dia datang ke IGD dengan wajah pucat pasi, bersumpah ada yang terus mengetuk cermin toilet lewat jam 3 pagi. Setelah itu dia menghilang.' },
            { speaker: 'Duck', text: 'Tidak ada yang bilang soal itu waktu aku tanda tangan kontrak...' },
            { speaker: 'Perawat Ramirez', text: 'Hati-hati malam ini. Pesan satu kopi McCafé panas dan ayam goreng renyah ya, biar aku tetap melek di jalan pulang.' },
            { speaker: 'Duck', text: 'Siap, langsung kumasak di dapur.' },
          ],
        },
        {
          name: 'Tyler',
          title: 'Remaja Gelisah',
          orderItem: '10 Potong McNuggets & Kentang Besar',
          dialogue: [
            { speaker: 'Tyler', text: 'Bro, dengar berita di radio nggak?! Polisi MASIH menyisir hutan di belakang McDonald’s ini buat mencari karyawan malam yang hilang!' },
            { speaker: 'Duck', text: 'Ya, John barusan cerita topi seragamnya ditemukan dekat pepohonan.' },
            { speaker: 'Tyler', text: 'Sepupuku sering mampir malam ke sini. Katanya pekerja yang hilang itu sempat melihat badut tinggi berambut merah di luar pintu kaca tepat sebelum shift-nya selesai.' },
            { speaker: 'Duck', text: 'Sudah, jangan menakut-nakutiku selagi aku harus jaga sampai jam 6 pagi. Mau pesan apa?' },
            { speaker: 'Tyler', text: '10 potong McNuggets dan kentang besar dibungkus — aku nggak mau berlama-lama di dalam!' },
            { speaker: 'Duck', text: 'Siap. 5 detik di dapur, tunggu sebentar.' },
          ],
        },
        {
          name: 'Wakil Sheriff Vance',
          title: 'Petugas Patroli Malam',
          orderItem: 'Kopi Hitam & Paket Quarter Pounder',
          dialogue: [
            { speaker: 'Wakil Sheriff Vance', text: 'Patroli sepi malam ini. Boleh minta kopi hitam? Sekalian mengecek tempat ini karena ini lokasi terakhir Marcus absen sebelum hilang.' },
            { speaker: 'Duck', text: 'Kalian masih belum punya petunjuk soal apa yang terjadi padanya?' },
            { speaker: 'Wakil Sheriff Vance', text: 'Rekaman keamanan malam terakhirnya rusak setelah jam 3 pagi, dan manajer menolak memberi kunci cadangan ke jalur hutan. Tetap waspada.' },
            { speaker: 'Duck', text: 'Saya akan terus mengawasi pintu dan kamera. Ada tambahan pesanan lagi?' },
            { speaker: 'Wakil Sheriff Vance', text: 'Tambahkan paket Quarter Pounder. Terus awasi pintu depan itu, ya.' },
            { speaker: 'Duck', text: 'Siap, Pak. Saya ke dapur menyiapkan pesanan Anda.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Tukang Ledeng Ceria & Pelanggan Tengah Malam',
          orderItem: 'Ember Ayam Goreng & Espresso Panas',
          dialogue: [
            { speaker: 'Big Ray', text: 'Mamma mia! Kembali lagi, bebek shift malam favoritku! Wahoo!' },
            { speaker: 'Duck', text: 'Hai Big Ray! Panggilan darurat pipa bocor lagi malam ini?' },
            { speaker: 'Big Ray', text: 'Tentu saja! Baru melancarkan pipa hijau besar di Jalan Utama—awasi juga pipa toiletmu malam ini ya, okie-dokie?' },
            { speaker: 'Duck', text: 'Siap, terima kasih infonya. Pesanan super seperti biasa?' },
            { speaker: 'Big Ray', text: "Si! Satu ember besar ayam goreng dan espresso panas mengepul! Let's-a go!" },
            { speaker: 'Duck', text: 'Langsung kuproses, Big Ray! Lima detik di dapur.' },
          ],
        },
        {
          name: 'Maya Lin',
          title: 'Mahasiswi Begadang',
          orderItem: 'McCafé Mocha Panas & McNuggets',
          dialogue: [
            { speaker: 'Maya Lin', text: 'Tunggu—kamu karyawan baru ya? Di papan pengumuman kampus ditempel poster orang hilang soal karyawan yang lenyap di sini.' },
            { speaker: 'Duck', text: 'Iya... Marcus. Sepertinya semua pelanggan malam ini lebih tahu tentang dia daripada manajer kami.' },
            { speaker: 'Maya Lin', text: 'Temanku yang sering belajar larut malam di sini bilang Marcus berhenti masuk kuliah tepat di pagi mobilnya ditemukan dekat barisan pinus.' },
            { speaker: 'Duck', text: 'Andai John menceritakan itu sebelum menyerahkan celemek padaku.' },
            { speaker: 'Maya Lin', text: 'Tetap dekat lampu kasir ya. Pesan mocha panas dan McNuggets dibungkus.' },
            { speaker: 'Duck', text: 'Siap. Lima detik di dapur.' },
          ],
        },
        {
          name: 'Paramedis Carter',
          title: 'Petugas Medis Shift Malam',
          orderItem: 'Paket Ayam Pedas & Kopi Hitam',
          dialogue: [
            { speaker: 'Paramedis Carter', text: 'Masih jaga sendirian malam ini? Pusat kendali baru menyebarkan ulang buletin orang hilang atas nama Marcus dari alamat ini.' },
            { speaker: 'Duck', text: 'Mereka menemukan petunjuk lain selain mobil dan topinya?' },
            { speaker: 'Paramedis Carter', text: 'Baterai senter yang menggelinding di luar pintu belakang dan jejak kaki masuk ke lumpur—itu saja.' },
            { speaker: 'Duck', text: 'Bagus sekali. Padahal aku masih harus membuang sampah ke belakang.' },
            { speaker: 'Paramedis Carter', text: 'Tetap waspada sekelilingmu malam ini. Buatkan saya paket ayam pedas dan kopi hitam.' },
            { speaker: 'Duck', text: 'Sedang dimasak—tunggu sebentar.' },
          ],
        },
        {
          name: 'Clara Novak',
          title: 'Pelancong Jalan Tol yang Tersesat',
          orderItem: 'Teh Panas & Ember Ayam Goreng Renyah',
          dialogue: [
            { speaker: 'Clara Novak', text: 'Saya berhenti di pom bensin dua mil ke timur dan kasirnya memperingatkan agar jangan masuk ke McDonald’s ini lewat jam 2 pagi.' },
            { speaker: 'Duck', text: 'Biar kutebak—gara-gara karyawan yang menghilang di shift malam?' },
            { speaker: 'Clara Novak', text: 'Katanya pekerja sebelum kamu sering mengeluh ada seseorang berias cat wajah terus mengawasinya lewat pintu kaca depan.' },
            { speaker: 'Duck', text: '...Pas sekali didengar sebelum jam pulang. Mau pesan apa, Bu?' },
            { speaker: 'Clara Novak', text: 'Cukup teh panas dan satu ember ayam renyah supaya saya bisa cepat kembali ke jalan raya.' },
            { speaker: 'Duck', text: 'Segera kuambilkan dari dapur.' },
          ],
        },
        {
          name: 'Macan Muda',
          title: 'Geng Teman Kabur Tengah Malam',
          orderItem: 'Ember Ayam Goreng Besar, 3 Kopi & Kentang Besar',
          dialogue: [
            { speaker: 'Sam', text: 'Ssst! Pelankan suaramu—aku baru saja manjat keluar jendela kamar biar ibuku nggak bangun!' },
            { speaker: 'Mia', text: 'Haha, seru banget! Kalau ibuku tahu kita menyelinap keluar buat jajan tengah malam lagi, habislah kita sebulan penuh!' },
            { speaker: 'Leo', text: 'Santai saja, kita kan geng Macan Muda! Ayo beli camilan malam di sini cepat, habis itu kita gas ke warnet sampai pagi!' },
            { speaker: 'Duck', text: 'Seru juga malam kalian. Mau makan cepat di sini dulu sebelum ke warnet?' },
            { speaker: 'Sam', text: 'Iya! Satu ember besar ayam goreng renyah, kentang besar, dan tiga kopi—kita makan cepat di meja sudut sana!' },
            { speaker: 'Duck', text: 'Siap! Tunggu lima detik di dapur ya.' },
          ],
        },
        {
          name: 'Arthur Crump',
          title: 'Pelanggan Pemarah Tengah Malam',
          orderItem: 'Kopi Hitam & Burger Polos',
          dialogue: [
            { speaker: 'Arthur Crump', text: 'Hmph. Akhirnya ada juga orang di balik kasir. Kamu tahu betapa dinginnya area parkir di luar sana?' },
            { speaker: 'Duck', text: 'Maaf soal cuacanya, Pak. Bisa saya bantu pesanannya malam ini?' },
            { speaker: 'Arthur Crump', text: 'Tidak usah basa-basi. Semua orang di kota sibuk bergosip soal kasir hilang dan hutan berhantu... omong kosong semua.' },
            { speaker: 'Duck', text: 'Baik. Langsung pesan makanan saja—Bapak mau pesan apa?' },
            { speaker: 'Arthur Crump', text: 'Kopi hitam kental dan satu burger polos. Pastikan panas dan jangan buang-buang waktuku.' },
            { speaker: 'Duck', text: '...Baiklah. Lima detik di dapur.' },
          ],
        },
      ],
      customersNight3: [
        {
          name: 'Detektif Hall',
          title: 'Detektif Kasus Orang Hilang',
          orderItem: 'Kopi Hitam & Paket Ayam Goreng Renyah',
          dialogue: [
            { speaker: 'Detektif Hall', text: 'Selamat malam, Duck. Setelah laporan patroli semalam, kasus hilangnya Marcus di sini resmi masuk meja penyelidikan kami.' },
            { speaker: 'Duck', text: 'Tunggu—resmi? Jadi pihak manajemen akhirnya tidak bisa lagi menutupi apa yang terjadi pada Marcus?' },
            { speaker: 'Detektif Hall', text: 'Sudah tidak bisa disembunyikan sejak celemek sobeknya ditemukan di balik bak sampah. Ngomong-ngomong… bukankah dulu ada patung badut seukuran manusia di dekat kasir?' },
            { speaker: 'Duck', text: 'Iya! Tapi patung itu lenyap sebelum John sempat membuka pintu malam ini. Tidak ada yang tahu siapa yang memindahkannya.' },
            { speaker: 'Detektif Hall', text: 'Karyawan hilang dan maskot dua meter lenyap dari bangunan terkunci… Awasi terus pintu kaca itu. Buatkan saya kopi hitam dan ayam goreng renyah.' },
            { speaker: 'Duck', text: 'Siap, Detektif. Lima detik di dapur.' },
          ],
        },
        {
          name: 'Reporter Zoe',
          title: 'Jurnalis Investigasi Malam',
          orderItem: 'Es Latte Rempah & 10 Potong McNuggets',
          dialogue: [
            { speaker: 'Reporter Zoe', text: 'Hei—kamu pasti Duck. Sejak orang-orang mulai membahas kasus Marcus secara terbuka semalam, saluran informasiku dibanjiri kabar soal restoran ini.' },
            { speaker: 'Duck', text: 'Semua orang terus menanyakan Marcus, dan sekarang patung badut raksasa di dekat kasir juga ikut menghilang.' },
            { speaker: 'Reporter Zoe', text: 'Tunggu, maskot badutnya hilang?! Di catatan terakhirnya, Marcus sempat menulis patung itu tampak lebih tinggi setiap kali lampu berkedip jam 3 pagi.' },
            { speaker: 'Duck', text: 'Tolong bilang kamu cuma bercanda… Aku masih sendirian di sini sampai tutup.' },
            { speaker: 'Reporter Zoe', text: 'Tetap di dekat lampu terang dan jaga baterai HP-mu. Pesan satu es latte dan 10 potong McNuggets sebelum aku lanjut menyusuri jalan raya.' },
            { speaker: 'Duck', text: 'Segera kubuatkan. Lima detik di dapur.' },
          ],
        },
        {
          name: 'Wakil Sheriff Vance',
          title: 'Wakil Sheriff Daerah',
          orderItem: 'Kopi Hitam & Burger Ayam Pedas',
          dialogue: [
            { speaker: 'Wakil Sheriff Vance', text: 'Mampir mengecek lagi setelah Malam 2, Duck. Tim forensik akhirnya menemukan sidik jari di mobil Marcus—dan itu bukan miliknya.' },
            { speaker: 'Duck', text: 'Sidik jari siapa yang ada di mobil Marcus, Pak?!' },
            { speaker: 'Wakil Sheriff Vance', text: 'Sisa cat wajah tebal bercampur minyak goreng. Kunci pintu belakang setelah buang sampah dan jauhi pepohonan.' },
            { speaker: 'Duck', text: 'Siap, Pak. Mau kopi hitam seperti biasa dan makanan hangat?' },
            { speaker: 'Wakil Sheriff Vance', text: 'Kopi hitam dan burger ayam pedas. Cepat sedikit supaya saya bisa menyisir jalur tol lagi.' },
            { speaker: 'Duck', text: 'Siap sekarang juga—lima detik di dapur.' },
          ],
        },
        {
          name: 'Big Ray',
          title: 'Tukang Ledeng Ceria & Pelanggan Tengah Malam',
          orderItem: 'Ember Ayam Goreng Renyah & Espresso Ganda',
          dialogue: [
            { speaker: 'Big Ray', text: 'Wahoo! Malam ketiga dan Duck masih bertahan gagah! Tunggu sebentar—ke mana perginya patung badut tinggi berambut merah itu?!' },
            { speaker: 'Duck', text: 'Jujur saja, Big Ray, patung itu sudah menghilang sebelum aku masuk kerja malam ini. Tidak ada yang tahu siapa yang membawanya.' },
            { speaker: 'Big Ray', text: 'Mamma mia! Jangan-jangan dia melompat masuk ke pipa hijau raksasa seperti Goomba! Sudut ruangan jadi terasa seram juga tanpa dia!' },
            { speaker: 'Duck', text: 'Benar, lobi jadi terasa terlalu sepi tanpanya. Pesanan super seperti biasa malam ini?' },
            { speaker: 'Big Ray', text: "Tentu saja! Satu ember ayam goreng renyah dan espresso ganda super panas! Let's-a go!" },
            { speaker: 'Duck', text: 'Langsung meluncur, Big Ray! Lima detik di dapur.' },
          ],
        },
        {
          name: 'Macan Muda',
          title: 'Geng Teman Kabur Tengah Malam',
          orderItem: 'Ember Ayam Goreng Besar, 3 Soda & Kentang Besar',
          dialogue: [
            { speaker: 'Sam', text: 'Wah, lihat pojokan itu—patung badut raksasa yang menyeramkan benar-benar hilang malam ini!' },
            { speaker: 'Mia', text: 'Baguslah! Patung itu bikin aku merinding tiap kali kita menyelinap keluar lewat tengah malam!' },
            { speaker: 'Leo', text: 'Lupakan patungnya, geng Macan Muda butuh asupan sebelum turnamen semalaman di warnet!' },
            { speaker: 'Duck', text: 'Kalian nggak pernah tidur ya? Paket camilan besar seperti biasa?' },
            { speaker: 'Sam', text: 'Iya! Ember ayam goreng renyah, kentang besar, dan tiga soda dingin!' },
            { speaker: 'Duck', text: 'Lima detik di dapur—tunggu sebentar ya!' },
          ],
        },
      ],
      driveThruCustomers: [
        {
          name: 'Pengemudi Mike',
          title: 'Pelanggan Drive-Thru',
          orderItem: 'Paket Ayam Renyah & Kopi Hitam',
          dialogue: [
            { speaker: 'Pengemudi Mike', text: 'Hei! Untung jendela drive-thru masih buka jam segini.' },
            { speaker: 'Duck', text: 'Selamat datang di drive-thru! Mau pesan apa malam ini?' },
            { speaker: 'Pengemudi Mike', text: 'Satu paket ayam renyah dan kopi hitam panas—baru selesai shift malam di stasiun.' },
            { speaker: 'Duck', text: 'Siap! Tunggu di jendela ya, kumasak 5 detik.' },
          ],
        },
        {
          name: 'Kurir Hana',
          title: 'Kurir Pengantar Malam',
          orderItem: 'Ember Ayam Goreng & Mocha Dingin',
          dialogue: [
            { speaker: 'Kurir Hana', text: 'Selamat malam! Tadi waktu masuk jalur drive-thru rasanya aku melihat seseorang berdiri dekat pagar bak sampah...' },
            { speaker: 'Duck', text: 'Mungkin cuma bayangan pohon pinus, Kak. Mau pesan apa malam ini?' },
            { speaker: 'Kurir Hana', text: 'Satu ember ayam goreng dan kopi panas biar tetap melek di pengiriman terakhir!' },
            { speaker: 'Duck', text: 'Siap meluncur! Lima detik di dapur.' },
          ],
        },
        {
          name: 'Sopir Taksi Ben',
          title: 'Sopir Taksi Tengah Malam',
          orderItem: 'Double Cheeseburger & McCafé Latte',
          dialogue: [
            { speaker: 'Sopir Taksi Ben', text: 'Huh, kabut di Jalur 9 tebal sekali! Boleh pesan makan malam lewat jendela?' },
            { speaker: 'Duck', text: 'Tentu saja, Pak! Mau pesan apa?' },
            { speaker: 'Sopir Taksi Ben', text: 'Ayam goreng renyah dan latte panas supaya bisa pulang dengan selamat.' },
            { speaker: 'Duck', text: 'Lima detik di dapur—segera kembali!' },
          ],
        },
      ],
    },
  },
};

export function getTranslations(lang?: Language): TranslationBundle {
  if (lang && lang in TRANSLATIONS) {
    return TRANSLATIONS[lang];
  }
  return TRANSLATIONS.en;
}
