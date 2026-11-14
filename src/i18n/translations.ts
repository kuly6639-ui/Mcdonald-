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
    locked: string;
    somethingWrong: string;
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
    carryingSpoiledFood: string;
    carryingMop: string;
    carryingTrash: string;
    carryingCardboard: string;
    heavyWorklight: string;
    unlimited: string;
    status: string;
    beamActive: string;
    beamOff: string;
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
    playNight2Again: string;
    playAgain: string;
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
    };
    dynamicObjectives: {
      preparingTitle: string;
      preparingDesc: (sec: number) => string;
      prepFoodTitle: string;
      prepFoodDesc: (customerName: string) => string;
      serveTitle: string;
      serveDesc: (customerName: string) => string;
      powerOutageTitle: string;
      powerOutageDesc: string;
      powerOutageWithFoodDesc: string;
      discardFoodTitle: string;
      discardFoodDesc: string;
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
    };
    prompts: {
      talkToJohn: string;
      deliverMeal: (name: string) => string;
      talkAwaiting: (name: string) => string;
      takeOrder: (name: string) => string;
      talkSilas: string;
      cookingKitchen: (sec: number) => string;
      cookKitchen: string;
      inspectElectricalBox: string;
      throwFoodInTrash: string;
      pickUpMop: string;
      mopPuddle: string;
      mopRequiredPrompt: string;
      actions: Record<string, string>;
    };
    openingMonologueNight1: DialogueLine[];
    openingMonologueNight2: DialogueLine[];
    johnDialogue: DialogueLine[];
    johnDialogueNight2: DialogueLine[];
    powerOutageStartDialogue: DialogueLine[];
    customerPowerOutageLeave: string;
    powerRestoredDialogue: DialogueLine[];
    warehouseClownReactionDialogue: DialogueLine[];
    thankYouDialogue: (customerName: string, price: string) => DialogueLine[];
    grumpyDeliveredDialogue: (customerName: string, price: string) => DialogueLine[];
    friendsSeatedDialogue: (customerName: string, price: string) => DialogueLine[];
    waitingOrderDialogue: (customerName: string, itemText: string) => DialogueLine[];
    customers: CustomerArchetypeTranslation[];
    customersNight2: CustomerArchetypeTranslation[];
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
      locked: '(LOCKED)',
      somethingWrong: 'Something is Wrong',
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
        '🍗 Carrying Prepared Meal Tray (Fried Chicken Bucket & Hot McCafé Coffee) — Deliver to Guest at Counter',
      carryingSpoiledFood:
        '⚠️ Spoiled Food Tray in Hand (Power went out!) — Throw it into the Trash Bin or Dumpster',
      carryingMop: '🧹 Holding Commercial Mop — Clean all 8 dirty puddles on the floor',
      carryingTrash: '📦 Carrying Dining Trash Bags (Take to rear dumpster)',
      carryingCardboard: '📦 Carrying Cardboard Bundle (Take to rear dumpster)',
      heavyWorklight: 'Heavy Worklight [F]',
      unlimited: 'UNLIMITED',
      status: 'STATUS:',
      beamActive: 'BEAM ACTIVE',
      beamOff: 'BEAM OFF',
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
      playNight2Again: 'Play Night 2 Again',
      playAgain: 'Play Night 1 Again',
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
          title: 'DRIVE-THRU CHECK',
          description: 'Inspect the relocated drive-thru order station at the cashier counter.',
        },
        n2_cctv_final: {
          title: 'CHECK SURVEILLANCE',
          description: 'Inspect the security office cameras before closing up.',
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
        powerOutageTitle: 'CHECK ELECTRICAL BOX (3:00 AM)',
        powerOutageDesc: 'The power suddenly went out! Go outside behind the back of the store and inspect the electrical box.',
        powerOutageWithFoodDesc:
          'Power went out and the guest walked out! Check the electrical box out back and throw the food in the trash.',
        discardFoodTitle: 'THROW FOOD IN TRASH',
        discardFoodDesc:
          'The customer left during the power outage. Throw the leftover food in your hands into the kitchen trash bin or dumpster.',
      },
      notices: {
        completed: (title) => `COMPLETED: ${title}`,
        newTaskPrep: (name) => `NEW TASK: PREPARE FOOD FOR ${name.toUpperCase()}`,
        orderCompleted: (price) => `ORDER COMPLETED: $${price}`,
        prepStarted: 'PREPARING GUEST ORDER... (5s remaining)',
        prepInProgress: (sec) => `Cooking in progress (${sec}s remaining)... Please wait!`,
        mealInHands: 'Meal is already in your hands! Deliver it to the guest at the counter.',
        noPendingOrders: 'No pending orders to cook right now. Wait for a guest to order at the counter.',
        orderReady: 'ORDER READY! Delivered to your hands. Return to front counter.',
        shiftEnds6am: (timeStr) =>
          `Shift ends strictly at 6:00 AM. Current time is ${timeStr}. Please attend to customer orders until dawn.`,
        shiftSkipped6am: 'LAST GUEST SERVED — SHIFT CLOCK SKIPPED TO 6:00 AM!',
        powerOutage: '⚡ 3:00 AM POWER OUTAGE — CHECK THE ELECTRICAL BOX BEHIND THE STORE!',
        powerRestored: '⚡ POWER RESTORED — CIRCUIT BREAKER RESET',
        mopPickedUp: '🧹 PICKED UP MOP — CLEAN ALL 8 DIRTY PUDDLES',
        mopRequired: '⚠️ YOU NEED THE MOP FIRST! Grab it from the Security Office corner.',
        foodDiscarded: '🗑️ LEFTOVER FOOD THROWN IN THE TRASH',
        discardFoodFirst: '⚠️ THROW THE SPOILED FOOD IN YOUR HANDS INTO THE TRASH FIRST!',
      },
      prompts: {
        talkToJohn: '[E] Talk to John (Take Over Shift)',
        deliverMeal: (name) => `[E] Deliver Hot Meal to ${name}`,
        talkAwaiting: (name) => `[E] Talk to ${name} (Awaiting Order)`,
        takeOrder: (name) => `[E] Take Order from ${name}`,
        talkSilas: '[E] Talk to Silas (Regular Customer)',
        cookingKitchen: (sec) => `⏳ Cooking Food in Kitchen (${sec}s remaining)...`,
        cookKitchen: '[E] Cook Food in Kitchen & Brew Coffee (5s)',
        inspectElectricalBox: '[E] Inspect Electrical Box & Flip Circuit Breaker',
        throwFoodInTrash: '[E] Throw Food in Trash',
        pickUpMop: '[E] Pick Up Mop',
        mopPuddle: '[E] Mop Dirty Puddle',
        mopRequiredPrompt: '⚠️ Pick up Mop in Security Office corner first!',
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
          drive_thru_order_station: 'Check Drive-Thru Headset & Terminal',
          electrical_box: 'Inspect Electrical Box & Restore Power',
          toilet_flush: 'Flush Toilet',
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
      johnDialogue: [
        { speaker: 'John', text: 'Yo! New employee! Are you new here?' },
        { speaker: 'Duck', text: 'Yeah, so what?' },
        { speaker: 'John', text: "Haha, easy there! My shift's finally over, so I'm handing everything off to you." },
        { speaker: 'John', text: 'Listen up — here is everything you need to do during the night shift.' },
        { speaker: 'John', text: 'First, punch in at the employee time clock near the counter. Then wipe down the dirty dining tables and bag up the leftover trash.' },
        { speaker: 'John', text: 'Carry the trash bags out the rear kitchen door to the dumpster, shut down the fryers, and check the security office CCTV monitor.' },
        { speaker: 'John', text: 'After midnight, late-night customers will pull in. Take their order at the register, cook fried chicken and brew coffee in the kitchen for 5 seconds, then bring the tray back out to them.' },
        { speaker: 'John', text: "One more warning... if the kitchen lights start flickering while you're cooking, don't panic. And don't stare too long at the clown mascot. See ya at 6 AM!" },
        { speaker: 'Duck', text: "Weird guy... Alright, let's punch the time clock and get through this shift." },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Oh, hey Duck. Glad you actually came back for Night 2.' },
        { speaker: 'Duck', text: 'Yeah, well, bills do not pay themselves. Everything quiet tonight?' },
        { speaker: 'John', text: 'Mostly... except management just posted another notice in the back. Still zero word about the former night-shift guy who vanished last week.' },
        { speaker: 'Duck', text: 'The guy I replaced? Wait—he went missing right here?' },
        { speaker: 'John', text: 'Police found his car near the edge of the trees with his uniform cap still on the dash. Boss told us not to bring it up in front of customers, though everyone around town is talking.' },
        { speaker: 'John', text: 'Anyway, same drill tonight: punch in, flip the office breaker, mop that black puddle in the hallway, haul out the cardboard, test the drive-thru station, check CCTV, and serve guests until 6:00 AM.' },
        { speaker: 'Duck', text: 'Great... a missing former coworker and another midnight shift. See you at dawn, John.' },
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
          text: "Let's grab that empty booth in the corner and eat here for a bit before heading home!",
        },
        {
          speaker: 'Duck',
          text: 'Make yourselves comfortable! Just watch out for the mist outside when you head out.',
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
          title: 'Highway Long-Hauler',
          orderItem: 'Double Quarter Pounder Combo & Large Fries',
          dialogue: [
            { speaker: 'Big Ray', text: 'Evening, chief. Long haul tonight—eight hundred miles till Omaha.' },
            { speaker: 'Duck', text: 'Long drive ahead of you. What can I get you for fuel?' },
            { speaker: 'Big Ray', text: "Double Quarter Pounder meal, extra fries, and a black coffee. Hey, who's the fella in the yellow suit standing out back by the dumpster?" },
            { speaker: 'Duck', text: '...Nobody is supposed to be out back behind the kitchen.' },
            { speaker: 'Big Ray', text: 'Tall guy, bright red hair, yellow jumpsuit. Saw him peering through the window when I swung the rig around.' },
            { speaker: 'Duck', text: "...I just took the trash out back ten minutes ago. I'll keep my guard up. Let me cook your meal right now." },
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
          title: 'Highway Long-Hauler',
          orderItem: 'Fried Chicken Bucket & Hot Coffee',
          dialogue: [
            { speaker: 'Big Ray', text: 'Still holding down the fort, kid? Whole truck stop down the highway is whispering about that missing worker from this branch.' },
            { speaker: 'Duck', text: 'Seems like every customer tonight knew him better than management did.' },
            { speaker: 'Big Ray', text: "I talked to him two days before he vanished. He said someone in a yellow suit kept staring through the sliding doors during his last order." },
            { speaker: 'Duck', text: '...Great. Anything I can cook up for your haul?' },
            { speaker: 'Big Ray', text: 'Fried chicken bucket and a hot coffee. Keep an eye toward the front glass while you cook.' },
            { speaker: 'Duck', text: "Will do. I'll get your order ready right now." },
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
          name: 'Sam, Leo & Mia',
          title: 'Late-Night Group of Friends',
          orderItem: 'Party Fried Chicken Bucket, 3 Coffees & Large Fries',
          dialogue: [
            { speaker: 'Sam', text: 'Hey! Good thing you guys are still open—concert traffic kept us stuck on the highway for two hours.' },
            { speaker: 'Mia', text: 'Wait, is this the forest McDonald’s where that night worker went missing last week? Kinda spooky out here!' },
            { speaker: 'Leo', text: 'Don’t creep everyone out, Mia! We just want hot food and a table to sit and hang out for a minute.' },
            { speaker: 'Duck', text: 'Dining booths are all clean if you guys want to eat inside. What can I get started for the three of you?' },
            { speaker: 'Sam', text: 'One big crispy fried chicken bucket, large fries, and three hot drinks! We will grab that corner booth once it is ready.' },
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
      locked: '(ĐÃ KHÓA)',
      somethingWrong: 'Có Điều Bất Ổn',
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
        '🍗 Đang Bưng Khay Đồ Ăn (Gà Rán & Cà Phê McCafé Nóng) — Giao cho khách tại quầy',
      carryingSpoiledFood:
        '⚠️ Khay Đồ Ăn Bị Hỏng (Mất điện!) — Mang bỏ vào thùng rác trong bếp hoặc ngoài trời',
      carryingMop: '🧹 Đang Cầm Cây Lau Nhà — Lau sạch cả 8 vũng nước bẩn trên sàn',
      carryingTrash: '📦 Đang Xách Túi Rác (Mang ra thùng rác phía sau)',
      carryingCardboard: '📦 Đang Ôm Thùng Carton (Mang ra thùng rác phía sau)',
      heavyWorklight: 'Đèn Pin Công Nghiệp [F]',
      unlimited: 'VÔ HẠN',
      status: 'TRẠNG THÁI:',
      beamActive: 'ĐANG BẬT',
      beamOff: 'ĐÃ TẮT',
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
      playNight2Again: 'Chơi Lại Đêm 2',
      playAgain: 'Chơi Lại Đêm 1',
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
          title: 'KIỂM TRA DRIVE-THRU',
          description: 'Kiểm tra trạm nhận đơn Drive-Thru đặt tại góc quầy thu ngân.',
        },
        n2_cctv_final: {
          title: 'KIỂM TRA CAMERA',
          description: 'Kiểm tra lại hệ thống camera an ninh trước khi đóng cửa.',
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
        powerOutageTitle: 'KIỂM TRA TỦ ĐIỆN (3:00 SÁNG)',
        powerOutageDesc: 'Điện đột ngột tắt ngấm! Hãy ra phía sau cửa hàng kiểm tra hộp cầu dao điện.',
        powerOutageWithFoodDesc:
          'Mất điện và khách đã bỏ đi! Hãy ra kiểm tra tủ điện phía sau và vứt phần đồ ăn thừa vào thùng rác.',
        discardFoodTitle: 'VỨT ĐỒ ĂN VÀO THÙNG RÁC',
        discardFoodDesc:
          'Khách đã rời đi vì mất điện. Hãy vứt khay đồ ăn trên tay vào thùng rác trong bếp hoặc thùng rác ngoài trời.',
      },
      notices: {
        completed: (title) => `HOÀN THÀNH: ${title}`,
        newTaskPrep: (name) => `NHIỆM VỤ MỚI: LÀM ĐỒ ĂN CHO ${name.toUpperCase()}`,
        orderCompleted: (price) => `HOÀN TẤT ĐƠN HÀNG: $${price}`,
        prepStarted: 'ĐANG CHẾ BIẾN ĐỒ ĂN... (còn 5 giây)',
        prepInProgress: (sec) => `Đang chế biến (còn ${sec} giây)... Vui lòng chờ!`,
        mealInHands: 'Bạn đang cầm sẵn đồ ăn trên tay! Hãy mang ra quầy đưa cho khách.',
        noPendingOrders: 'Hiện chưa có đơn hàng nào cần nấu. Hãy đợi khách gọi món tại quầy.',
        orderReady: 'MÓN ĐÃ XONG! Đang cầm trên tay. Hãy quay lại quầy thu ngân.',
        shiftEnds6am: (timeStr) =>
          `Ca trực chỉ kết thúc đúng 6:00 sáng. Hiện tại là ${timeStr}. Hãy tiếp tục phục vụ khách cho tới sáng.`,
        shiftSkipped6am: 'ĐÃ PHỤC VỤ VỊ KHÁCH CUỐI CÙNG — ĐỒNG HỒ CHUYỂN SANG 6:00 SÁNG!',
        powerOutage: '⚡ MẤT ĐIỆN LÚC 3:00 SÁNG — KIỂM TRA HỘP ĐIỆN PHÍA SAU CỬA HÀNG!',
        powerRestored: '⚡ ĐÃ CÓ ĐIỆN TRỞ LẠI — ĐÃ BẬT CẦU DAO',
        mopPickedUp: '🧹 ĐÃ CẦM CÂY LAU NHÀ — LAU SẠCH 8 VŨNG BẨN',
        mopRequired: '⚠️ CẦN CÂY LAU NHÀ TRƯỚC! Hãy lấy cây lau ở góc phòng bảo vệ.',
        foodDiscarded: '🗑️ ĐÃ VỨT ĐỒ ĂN THỪA VÀO THÙNG RÁC',
        discardFoodFirst: '⚠️ HÃY VỨT ĐỒ ĂN BỊ HỎNG TRÊN TAY VÀO THÙNG RÁC TRƯỚC!',
      },
      prompts: {
        talkToJohn: '[E] Nói chuyện với John (Nhận ca)',
        deliverMeal: (name) => `[E] Giao Đồ Ăn Nóng cho ${name}`,
        talkAwaiting: (name) => `[E] Nói chuyện với ${name} (Đang chờ món)`,
        takeOrder: (name) => `[E] Nhận Đơn Hàng từ ${name}`,
        talkSilas: '[E] Nói chuyện với Silas (Khách quen)',
        cookingKitchen: (sec) => `⏳ Đang Nấu Trong Bếp (còn ${sec}s)...`,
        cookKitchen: '[E] Nấu Đồ Ăn & Pha Cà Phê Trong Bếp (5s)',
        inspectElectricalBox: '[E] Kiểm Tra Hộp Điện & Gạt Lại Cầu Dao',
        throwFoodInTrash: '[E] Vứt Đồ Ăn Vào Thùng Rác',
        pickUpMop: '[E] Cầm Cây Lau Nhà',
        mopPuddle: '[E] Lau Vũng Nước Bẩn',
        mopRequiredPrompt: '⚠️ Hãy lấy cây lau nhà ở góc phòng bảo vệ trước!',
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
          drive_thru_order_station: 'Kiểm Tra Tai Nghe & Máy Drive-Thru',
          electrical_box: 'Kiểm Tra Hộp Điện & Khôi Phục Nguồn',
          toilet_flush: 'Xả Nước Bồn Cầu',
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
      johnDialogue: [
        { speaker: 'John', text: 'Ê! Nhân viên mới! Cậu mới vào làm ở đây à?' },
        { speaker: 'Duck', text: 'Ừ, thì sao nào?' },
        { speaker: 'John', text: 'Haha, bình tĩnh nào! Ca của tôi cuối cùng cũng hết rồi, giờ tôi bàn giao lại cho cậu đấy.' },
        { speaker: 'John', text: 'Nghe kỹ đây — đây là tất cả những việc cậu cần làm trong ca đêm này.' },
        { speaker: 'John', text: 'Đầu tiên, ra máy chấm công gần quầy thu ngân để bấm thẻ vào ca. Sau đó lau sạch các bàn ăn bẩn rồi gom hết túi rác lại.' },
        { speaker: 'John', text: 'Mang túi rác ra cửa sau nhà bếp đổ vào thùng rác lớn, tắt bếp chiên đi, rồi vào phòng bảo vệ kiểm tra camera CCTV.' },
        { speaker: 'John', text: 'Qua nửa đêm sẽ có khách khuya ghé vào. Nhận đơn ở quầy, vào bếp chiên gà và pha cà phê mất 5 giây, rồi bưng khay ra phục vụ cho họ.' },
        { speaker: 'John', text: 'Còn một lời khuyên nữa... nếu đèn bếp tự nhiên chớp tắt lúc đang nấu thì đừng hoảng. Và đừng nhìn con ma-nơ-canh chú hề lâu quá. Hẹn gặp lúc 6 giờ sáng!' },
        { speaker: 'Duck', text: 'Tên này nói năng kỳ quặc thật... Thôi kệ, ra bấm thẻ vào ca rồi làm việc vậy.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Ồ, chào Duck. May mà cậu vẫn quay lại làm Đêm 2 đấy.' },
        { speaker: 'Duck', text: 'Ừ, tiền nhà đâu có tự trả được. Đêm nay mọi thứ vẫn ổn chứ?' },
        { speaker: 'John', text: 'Cũng tạm... trừ việc quản lý mới dán thêm thông báo trong phòng. Vẫn chẳng có tin tức gì về cậu nhân viên ca đêm cũ bị mất tích tuần trước.' },
        { speaker: 'Duck', text: 'Người mà tôi thay thế ấy hả? Khoan—anh ta mất tích ngay tại đây luôn sao?' },
        { speaker: 'John', text: 'Cảnh sát tìm thấy xe của cậu ấy đỗ sát bìa rừng, mũ đồng phục vẫn để trên bảng điều khiển. Ông chủ dặn không được nhắc trước mặt khách, nhưng cả thị trấn đang xôn xao hết rồi.' },
        { speaker: 'John', text: 'Thôi thì vẫn quy trình tối nay: bấm thẻ, gạt cầu dao phòng an ninh, lau vũng nước đen ở hành lang, dọn thùng carton, kiểm tra quầy drive-thru, xem CCTV rồi phục vụ khách đến 6:00 sáng.' },
        { speaker: 'Duck', text: 'Tuyệt vời thật... một đồng nghiệp cũ mất tích và thêm một ca trực nửa đêm. Gặp lại lúc sáng nhé, John.' },
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
          text: 'Ra bàn góc kia ngồi ăn tại chỗ khoảng một lát cho ấm bụng rồi hãy về tụi bay ơi!',
        },
        {
          speaker: 'Duck',
          text: 'Cứ ngồi tự nhiên nhé! Lát ra về nhớ để ý sương mù ngoài đường đấy.',
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
          title: 'Tài xế xe tải đường dài',
          orderItem: 'Combo Double Quarter Pounder & Khoai Tây Cỡ Lớn',
          dialogue: [
            { speaker: 'Big Ray', text: 'Chào buổi tối, bạn trẻ. Đêm nay chạy đường dài—tám trăm dặm nữa mới tới Omaha.' },
            { speaker: 'Duck', text: 'Chuyến đi dài đấy anh. Anh muốn ăn gì để nạp năng lượng nào?' },
            { speaker: 'Big Ray', text: 'Một phần Double Quarter Pounder, thêm khoai tây, và một cà phê đen. Mà này, gã mặc bộ đồ vàng đứng sau chỗ thùng rác là ai thế?' },
            { speaker: 'Duck', text: '...Đằng sau khu bếp không được phép có ai đứng ở đó cả.' },
            { speaker: 'Big Ray', text: 'Một gã cao kều, tóc đỏ rực, đồ liền thân màu vàng. Tôi thấy hắn ngó qua cửa sổ lúc tôi quay đầu xe tải.' },
            { speaker: 'Duck', text: '...Tôi mới ra đổ rác đằng sau mười phút trước thôi. Tôi sẽ cảnh giác. Để tôi vào nấu đồ ăn cho anh ngay.' },
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
          title: 'Tài xế xe tải đường dài',
          orderItem: 'Xô Gà Rán & Cà Phê Nóng',
          dialogue: [
            { speaker: 'Big Ray', text: 'Vẫn trụ vững hả cậu trẻ? Cả trạm dừng xe tải ngoài quốc lộ ai cũng bàn tán về người nhân viên mất tích ở chi nhánh này.' },
            { speaker: 'Duck', text: 'Có vẻ vị khách nào tối nay cũng biết về anh ta rõ hơn cả quản lý.' },
            { speaker: 'Big Ray', text: 'Tôi từng nói chuyện với cậu ấy hai hôm trước khi cậu ta biến mất. Cậu ta bảo có ai đó mặc đồ vàng cứ đứng nhìn chằm chằm qua cửa kính trượt lúc cậu phục vụ đơn cuối.' },
            { speaker: 'Duck', text: '...Nghe rợn thật đấy. Anh muốn tôi nấu món gì cho chuyến đi?' },
            { speaker: 'Big Ray', text: 'Một xô gà rán với ly cà phê nóng. Nhớ để mắt ra phía cửa kính trước lúc cậu nấu đấy.' },
            { speaker: 'Duck', text: 'Rõ rồi. Tôi làm món cho anh ngay đây.' },
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
          name: 'Nhóm Sam, Leo & Mia',
          title: 'Nhóm Bạn Thân Đi Chơi Khuya',
          orderItem: 'Xô Gà Rán Cỡ Lớn, 3 Ly Cà Phê & Khoai Chiên',
          dialogue: [
            { speaker: 'Sam', text: 'Ê chào cậu! May quá quán vẫn mở—tụi tôi kẹt xe sau buổi diễn suốt hai tiếng ngoài quốc lộ.' },
            { speaker: 'Mia', text: 'Khoan, đây có phải quán McDonald’s giữa rừng có anh nhân viên mất tích tuần trước không? Nhìn hơi rợn nha!' },
            { speaker: 'Leo', text: 'Đừng dọa nhau nữa Mia! Tụi mình chỉ cần đồ ăn nóng rồi ngồi bàn ăn nghỉ một lát thôi.' },
            { speaker: 'Duck', text: 'Bàn ghế tôi lau sạch hết rồi đấy, các bạn cứ tự nhiên ngồi ăn trong quán. Muốn gọi gì nào?' },
            { speaker: 'Sam', text: 'Cho một xô gà rán giòn cỡ đại, khoai tây chiên và ba ly nước nóng nhé! Xong tụi tôi ra bàn góc ngồi ăn luôn.' },
            { speaker: 'Duck', text: 'Có ngay đây! Đợi tôi 5 giây trong bếp.' },
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
      locked: '(ЗАБЛОКИРОВАНО)',
      somethingWrong: 'Что-то не так',
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
        '🍗 В руках поднос (ведёрко курицы и горячий кофе McCafé) — отнесите гостю на кассу',
      carryingSpoiledFood:
        '⚠️ В руках испорченная еда (отключили свет!) — выбросите её в мусорное ведро или контейнер',
      carryingMop: '🧹 В руках швабра — вымойте все 8 грязных луж на полу',
      carryingTrash: '📦 В руках пакеты с мусором (отнесите в контейнер сзади)',
      carryingCardboard: '📦 В руках стопка картона (отнесите в контейнер сзади)',
      heavyWorklight: 'Фонарь [F]',
      unlimited: 'БЕЗЛИМИТ',
      status: 'СТАТУС:',
      beamActive: 'ВКЛЮЧЁН',
      beamOff: 'ВЫКЛЮЧЕН',
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
      playNight2Again: 'Сыграть Ночь 2 снова',
      playAgain: 'Сыграть Ночь 1 снова',
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
          title: 'ПРОВЕРКА АВТОРАЗДАЧИ',
          description: 'Проверьте перенесённый терминал автозаказов на углу кассовой стойки.',
        },
        n2_cctv_final: {
          title: 'ПРОВЕРИТЬ КАМЕРЫ',
          description: 'Проверьте камеры наблюдения в офисе охраны перед закрытием.',
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
        powerOutageTitle: 'ПРОВЕРИТЬ ЭЛЕКТРОЩИТОК (3:00)',
        powerOutageDesc: 'Внезапно погас свет! Выйдите за заднюю стену магазина и проверьте электрощиток.',
        powerOutageWithFoodDesc:
          'Свет погас и гость ушёл! Проверьте электрощиток сзади и выбросите еду из рук в мусор.',
        discardFoodTitle: 'ВЫБРОСИТЬ ЕДУ В МУСОР',
        discardFoodDesc:
          'Посетитель ушёл во время отключения света. Выбросите оставшуюся в руках еду в мусорное ведро или контейнер.',
      },
      notices: {
        completed: (title) => `ВЫПОЛНЕНО: ${title}`,
        newTaskPrep: (name) => `НОВАЯ ЗАДАЧА: ПРИГОТОВИТЬ ЕДУ ДЛЯ ${name.toUpperCase()}`,
        orderCompleted: (price) => `ЗАКАЗ ВЫПОЛНЕН: $${price}`,
        prepStarted: 'ГОТОВИМ ЗАКАЗ ГОСТЯ... (осталось 5 с)',
        prepInProgress: (sec) => `Готовится (осталось ${sec} с)... Пожалуйста, подождите!`,
        mealInHands: 'Заказ уже у вас в руках! Отнесите его гостю на кассу.',
        noPendingOrders: 'Сейчас нет активных заказов. Дождитесь посетителя у кассы.',
        orderReady: 'ЗАКАЗ ГОТОВ! Он у вас в руках. Возвращайтесь к кассе.',
        shiftEnds6am: (timeStr) =>
          `Смена заканчивается ровно в 6:00 утра. Сейчас ${timeStr}. Продолжайте обслуживать гостей до рассвета.`,
        shiftSkipped6am: 'ПОСЛЕДНИЙ ГОСТЬ ОБСЛУЖЕН — ЧАСЫ ПЕРЕВЕДЕНЫ НА 6:00 УТРА!',
        powerOutage: '⚡ 3:00 — ОТКЛЮЧЕНИЕ СВЕТА! ПРОВЕРЬТЕ ЭЛЕКТРОЩИТОК ЗА МАГАЗИНОМ!',
        powerRestored: '⚡ ЭЛЕКТРИЧЕСТВО ВОССТАНОВЛЕНО — РУБИЛЬНИК ВКЛЮЧЕН',
        mopPickedUp: '🧹 ВЫ ВЗЯЛИ ШВАБРУ — ВЫТРИТЕ ВСЕ 8 ГРЯЗНЫХ ЛУЖ',
        mopRequired: '⚠️ СНАЧАЛА НУЖНА ШВАБРА! Возьмите её в углу офиса охраны.',
        foodDiscarded: '🗑️ ОСТАВШАЯСЯ ЕДА ВЫБРОШЕНА В МУСОР',
        discardFoodFirst: '⚠️ СНАЧАЛА ВЫБРОСИТЕ ИСПОРЧЕННУЮ ЕДУ ИЗ РУК В МУСОР!',
      },
      prompts: {
        talkToJohn: '[E] Поговорить с Джоном (Принять смену)',
        deliverMeal: (name) => `[E] Отдать горячий заказ: ${name}`,
        talkAwaiting: (name) => `[E] Поговорить с ${name} (Ждёт заказ)`,
        takeOrder: (name) => `[E] Принять заказ у ${name}`,
        talkSilas: '[E] Поговорить с Сайласом (Постоянный гость)',
        cookingKitchen: (sec) => `⏳ Готовка на кухне (осталось ${sec} с)...`,
        cookKitchen: '[E] Приготовить еду и кофе на кухне (5 с)',
        inspectElectricalBox: '[E] Осмотреть электрощиток и включить рубильник',
        throwFoodInTrash: '[E] Выбросить еду в мусор',
        pickUpMop: '[E] Взять швабру',
        mopPuddle: '[E] Вытереть грязную лужу',
        mopRequiredPrompt: '⚠️ Сначала возьмите швабру в углу офиса охраны!',
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
          drive_thru_order_station: 'Проверить гарнитуру и терминал автозаказов',
          electrical_box: 'Осмотреть электрощиток и вернуть свет',
          toilet_flush: 'Смыть воду в туалете',
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
      johnDialogue: [
        { speaker: 'John', text: 'Эй! Новенький! Ты тут впервые?' },
        { speaker: 'Duck', text: 'Да, и что с того?' },
        { speaker: 'John', text: 'Ха-ха, полегче! Моя смена наконец-то закончилась, так что передаю дела тебе.' },
        { speaker: 'John', text: 'Слушай внимательно — вот всё, что нужно делать в ночную смену.' },
        { speaker: 'John', text: 'Сначала отметься на табельных часах возле кассы. Потом протри грязные столы в зале и собери пакеты с мусором.' },
        { speaker: 'John', text: 'Вынеси мусор через заднюю дверь кухни в контейнер, выключи фритюрницы и проверь камеры CCTV в офисе охраны.' },
        { speaker: 'John', text: 'Позже начнут заезжать ночные посетители. Прими заказ на кассе, приготовь еду и кофе на кухне за 5 секунд и отнеси поднос гостю.' },
        { speaker: 'John', text: 'И ещё одно… если свет на кухне начнёт мигать во время готовки — не паникуй. И не смотри слишком долго на этого клоуна-маскота. Удачи, увидимся в 6 утра!' },
        { speaker: 'Duck', text: 'Странный тип… Ладно, отметимся на часах и отработаем смену.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'О, привет, Дак. Рад, что ты всё-таки вышел на 2-ю ночь.' },
        { speaker: 'Duck', text: 'Ну да, счета сами себя не оплатят. Сегодня всё спокойно?' },
        { speaker: 'John', text: 'Вроде того… только начальство повесило ещё одно объявление в подсобке. О бывшем ночном сотруднике, который пропал на прошлой неделе, до сих пор ни слуху ни духу.' },
        { speaker: 'Duck', text: 'О том парне, которого я заменил? Погоди — он исчез прямо здесь?' },
        { speaker: 'John', text: 'Полиция нашла его машину у опушки леса, а кепка так и лежала на панели. Босс велел не болтать об этом при клиентах, но весь город уже обсуждает.' },
        { speaker: 'John', text: 'В общем, порядок на сегодня такой: отметься на часах, включи рубильник в офисе, вытри чёрную лужу в коридоре, вынеси картон, проверь терминал автозаказов, камеры CCTV и обслужи гостей до 6:00 утра.' },
        { speaker: 'Duck', text: 'Отлично… пропавший коллега и ещё одна смена до рассвета. До утра, Джон.' },
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
          text: 'Пойдём сядем за тот свободный столик в углу и поедим тут минутку перед дорогой домой!',
        },
        {
          speaker: 'Duck',
          text: 'Устраивайтесь поудобнее! Только будьте осторожны в тумане на обратном пути.',
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
          title: 'Дальнобойщик',
          orderItem: 'Двойной Четвертьфунтовый комбо и большая картошка',
          dialogue: [
            { speaker: 'Большой Рэй', text: 'Добрый вечер, шеф. Длинный рейс сегодня — восемьсот миль до Омахи.' },
            { speaker: 'Duck', text: 'Дальняя дорога. Чем заправимся на ночь?' },
            { speaker: 'Большой Рэй', text: 'Двойной Четвертьфунтовый, большую картошку и чёрный кофе. Слушай, а кто этот парень в жёлтом костюме сзади у контейнера?' },
            { speaker: 'Duck', text: '…За кухней никого не должно быть.' },
            { speaker: 'Большой Рэй', text: 'Высокий такой, ярко-рыжие волосы, жёлтый комбинезон. Видел, как он заглядывал в окно, когда я разворачивал фуру.' },
            { speaker: 'Duck', text: '…Я выносил туда мусор десять минут назад. Буду настороже. Сейчас приготовлю ваш заказ.' },
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
          title: 'Дальнобойщик',
          orderItem: 'Ведёрко жареной курицы и горячий кофе',
          dialogue: [
            { speaker: 'Большой Рэй', text: 'Всё ещё держишь пост, парень? На всей трассе дальнобойщики только и шепчутся о пропавшем работнике из этого ресторана.' },
            { speaker: 'Duck', text: 'Похоже, сегодня каждый гость знает о нём больше, чем начальство.' },
            { speaker: 'Большой Рэй', text: 'Я говорил с ним за два дня до исчезновения. Он жаловался, что кто-то в жёлтом костюме пялился сквозь раздвижные двери во время его последнего заказа.' },
            { speaker: 'Duck', text: '…Весело. Что приготовить тебе в дорогу?' },
            { speaker: 'Большой Рэй', text: 'Ведёрко курицы и горячий кофе. Поглядывай на переднее стекло, пока готовишь.' },
            { speaker: 'Duck', text: 'Хорошо. Сейчас всё сделаю.' },
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
          name: 'Сэм, Лео и Мия',
          title: 'Компания ночных друзей',
          orderItem: 'Большое ведёрко курицы, 3 кофе и большая картошка',
          dialogue: [
            { speaker: 'Сэм', text: 'Привет! Как здорово, что вы открыты — после концерта застряли в пробке на шоссе на целых два часа.' },
            { speaker: 'Мия', text: 'Погодите, это тот самый лесной McDonald’s, где на прошлой неделе исчез ночной работник? Тут как-то жутковато!' },
            { speaker: 'Лео', text: 'Не нагоняй жути, Мия! Мы просто хотим горячей еды и посидеть в тепле за столиком минутку.' },
            { speaker: 'Duck', text: 'Столики в зале чистые, можете спокойно поесть внутри. Что приготовить для вашей компании?' },
            { speaker: 'Сэм', text: 'Большое ведёрко хрустящей курицы, большую картошку и три горячих напитка! Мы займём вон тот угловой столик.' },
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
      locked: '(TERKUNCI)',
      somethingWrong: 'Ada yang Tidak Beres',
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
        '🍗 Membawa Nampan Makanan (Ember Ayam Goreng & Kopi McCafé Panas) — Antar ke Tamu di Kasir',
      carryingSpoiledFood:
        '⚠️ Membawa Makanan Sisa (Listrik Padam!) — Buang ke tempat sampah dapur atau bak sampah luar',
      carryingMop: '🧹 Memegang Kain Pel — Bersihkan semua 8 genangan kotor di lantai',
      carryingTrash: '📦 Membawa Kantong Sampah (Bawa ke tempat sampah belakang)',
      carryingCardboard: '📦 Membawa Tumpukan Kardus (Bawa ke tempat sampah belakang)',
      heavyWorklight: 'Senter Kerja [F]',
      unlimited: 'TAK TERBATAS',
      status: 'STATUS:',
      beamActive: 'LAMPU NYALA',
      beamOff: 'LAMPU MATI',
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
      playNight2Again: 'Main Malam 2 Lagi',
      playAgain: 'Main Malam 1 Lagi',
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
          title: 'CEK DRIVE-THRU',
          description: 'Periksa stasiun pemesanan drive-thru yang dipindahkan ke meja kasir.',
        },
        n2_cctv_final: {
          title: 'PERIKSA PENGAWASAN',
          description: 'Periksa kamera kantor keamanan sebelum tutup.',
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
        powerOutageTitle: 'PERIKSA KOTAK LISTRIK (3:00 AM)',
        powerOutageDesc: 'Listrik tiba-tiba padam! Pergi ke belakang toko dan periksa kotak listrik.',
        powerOutageWithFoodDesc:
          'Listrik padam dan tamu langsung pergi! Cek kotak listrik di belakang dan buang makanan di tangan ke tempat sampah.',
        discardFoodTitle: 'BUANG MAKANAN KE TEMPAT SAMPAH',
        discardFoodDesc:
          'Pelanggan pergi saat listrik padam. Buang makanan sisa di tanganmu ke tempat sampah dapur atau bak sampah luar.',
      },
      notices: {
        completed: (title) => `SELESAI: ${title}`,
        newTaskPrep: (name) => `TUGAS BARU: SIAPKAN MAKANAN UNTUK ${name.toUpperCase()}`,
        orderCompleted: (price) => `PESANAN SELESAI: $${price}`,
        prepStarted: 'MENYIAPKAN PESANAN TAMU... (sisa 5 dtk)',
        prepInProgress: (sec) => `Sedang memasak (sisa ${sec} dtk)... Harap tunggu!`,
        mealInHands: 'Makanan sudah di tanganmu! Antarkan ke tamu di meja kasir.',
        noPendingOrders: 'Belum ada pesanan untuk dimasak saat ini. Tunggu tamu memesan di kasir.',
        orderReady: 'PESANAN SIAP! Sudah di tanganmu. Kembali ke kasir depan.',
        shiftEnds6am: (timeStr) =>
          `Shift berakhir tepat pukul 6:00 AM. Sekarang pukul ${timeStr}. Harap layani pesanan pelanggan hingga fajar.`,
        shiftSkipped6am: 'TAMU TERAKHIR DILAYANI — JAM SHIFT LOMPAT KE 6:00 AM!',
        powerOutage: '⚡ MATI LAMPU JAM 3:00 PAGI — PERIKSA KOTAK LISTRIK DI BELAKANG TOKO!',
        powerRestored: '⚡ LISTRIK KEMBALI MENYALA — PEMUTUS ARUS DIAKTIFKAN',
        mopPickedUp: '🧹 KAIN PEL DIAMBIL — BERSIHKAN SEMUA 8 GENANGAN KOTOR',
        mopRequired: '⚠️ BUTUH KAIN PEL DULU! Ambil di sudut ruang keamanan.',
        foodDiscarded: '🗑️ MAKANAN SISA DIBUANG KE TEMPAT SAMPAH',
        discardFoodFirst: '⚠️ BUANG MAKANAN SISA DI TANGANMU KE TEMPAT SAMPAH TERLEBIH DAHULU!',
      },
      prompts: {
        talkToJohn: '[E] Bicara dengan John (Ambil Alih Shift)',
        deliverMeal: (name) => `[E] Antar Makanan Hangat ke ${name}`,
        talkAwaiting: (name) => `[E] Bicara dengan ${name} (Menunggu Pesanan)`,
        takeOrder: (name) => `[E] Terima Pesanan dari ${name}`,
        talkSilas: '[E] Bicara dengan Silas (Pelanggan Tetap)',
        cookingKitchen: (sec) => `⏳ Memasak di Dapur (sisa ${sec} dtk)...`,
        cookKitchen: '[E] Masak di Dapur & Seduh Kopi (5 dtk)',
        inspectElectricalBox: '[E] Periksa Kotak Listrik & Nyalakan Pemutus Arus',
        throwFoodInTrash: '[E] Buang Makanan ke Tempat Sampah',
        pickUpMop: '[E] Ambil Kain Pel',
        mopPuddle: '[E] Pel Genangan Kotor',
        mopRequiredPrompt: '⚠️ Ambil kain pel di sudut ruang keamanan dulu!',
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
          drive_thru_order_station: 'Cek Headset & Terminal Drive-Thru',
          electrical_box: 'Periksa Kotak Listrik & Pulihkan Daya',
          toilet_flush: 'Siram Toilet',
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
      johnDialogue: [
        { speaker: 'John', text: 'Yo! Karyawan baru! Kamu baru di sini ya?' },
        { speaker: 'Duck', text: 'Iya, memangnya kenapa?' },
        { speaker: 'John', text: 'Haha, santai saja! Shift-ku akhirnya selesai, jadi sekarang aku serahkan semuanya padamu.' },
        { speaker: 'John', text: 'Dengarkan baik-baik — ini semua yang harus kamu lakukan selama shift malam.' },
        { speaker: 'John', text: 'Pertama, absen masuk di mesin absen dekat meja kasir. Setelah itu lap meja makan yang kotor dan kumpulkan kantong sampah.' },
        { speaker: 'John', text: 'Bawa kantong sampah keluar lewat pintu belakang dapur ke bak sampah, matikan penggorengan, lalu cek monitor CCTV di ruang keamanan.' },
        { speaker: 'John', text: 'Lewat tengah malam, pelanggan malam akan datang. Terima pesanan di kasir, masak ayam goreng dan seduh kopi di dapur selama 5 detik, lalu antarkan nampannya kepada mereka.' },
        { speaker: 'John', text: 'Satu peringatan lagi... kalau lampu dapur berkedip saat kamu memasak, jangan panik. Dan jangan menatap maskot badut itu terlalu lama. Sampai jumpa jam 6 pagi!' },
        { speaker: 'Duck', text: 'Orang yang aneh... Baiklah, ayo absen masuk dan selesaikan shift ini.' },
      ],
      johnDialogueNight2: [
        { speaker: 'John', text: 'Oh, hai Duck. Syukurlah kamu benar-benar kembali untuk Malam 2.' },
        { speaker: 'Duck', text: 'Ya, tagihan tidak bisa bayar sendiri. Malam ini tenang kan?' },
        { speaker: 'John', text: 'Lumayan... kecuali manajemen baru menempel pengumuman lagi di belakang. Masih belum ada kabar soal mantan staf shift malam yang menghilang minggu lalu.' },
        { speaker: 'Duck', text: 'Orang yang kugantikan itu? Tunggu—dia hilang di sekitar sini?' },
        { speaker: 'John', text: 'Polisi menemukan mobilnya di tepi hutan dengan topi seragamnya masih di dasbor. Bos melarang kami membahasnya di depan pelanggan, tapi semua orang di kota sudah membicarakannya.' },
        { speaker: 'John', text: 'Pokoknya tugas malam ini: absen masuk, nyalakan pemutus arus kantor, pel genangan hitam di lorong, buang kardus, cek stasiun drive-thru, periksa CCTV, dan layani tamu sampai jam 6:00 pagi.' },
        { speaker: 'Duck', text: 'Hebat sekali... rekan lama yang hilang dan shift tengah malam lagi. Sampai jumpa subuh, John.' },
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
          text: 'Ayo duduk di meja sudut yang kosong itu dan makan sebentar di sini sebelum pulang!',
        },
        {
          speaker: 'Duck',
          text: 'Silakan duduk santai! Hati-hati kabut di luar nanti waktu kalian pulang.',
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
          title: 'Sopir Truk Lintas Jalan Raya',
          orderItem: 'Paket Double Quarter Pounder & Kentang Besar',
          dialogue: [
            { speaker: 'Big Ray', text: 'Selamat malam, bos. Perjalanan jauh malam ini—delapan ratus mil menuju Omaha.' },
            { speaker: 'Duck', text: 'Perjalanan panjang. Mau pesan apa buat bekal di jalan?' },
            { speaker: 'Big Ray', text: 'Paket Double Quarter Pounder, kentang ekstra, dan kopi hitam. Hei, siapa orang berbaju kuning yang berdiri di belakang dekat bak sampah?' },
            { speaker: 'Duck', text: '...Tidak boleh ada siapa-siapa di belakang dapur.' },
            { speaker: 'Big Ray', text: 'Orang tinggi, rambut merah terang, baju terusan kuning. Kulihat dia mengintip lewat jendela waktu aku memutar truk.' },
            { speaker: 'Duck', text: '...Aku baru saja buang sampah ke belakang sepuluh menit lalu. Aku akan waspada. Biar kumasakkan pesananmu sekarang.' },
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
          title: 'Sopir Truk Lintas Jalan Raya',
          orderItem: 'Ember Ayam Goreng & Kopi Panas',
          dialogue: [
            { speaker: 'Big Ray', text: 'Masih bertahan jaga, Nak? Seluruh pangkalan truk di jalan tol membicarakan pekerja cabang ini yang hilang.' },
            { speaker: 'Duck', text: 'Sepertinya setiap pelanggan malam ini lebih mengenalnya daripada pihak manajemen.' },
            { speaker: 'Big Ray', text: 'Aku ngobrol dengannya dua hari sebelum dia menghilang. Dia bilang ada orang berbaju kuning terus menatap lewat pintu kaca geser saat pesanan terakhirnya.' },
            { speaker: 'Duck', text: '...Bikin merinding saja. Mau pesan apa buat bekal jalan?' },
            { speaker: 'Big Ray', text: 'Ember ayam goreng dan kopi panas. Awasi terus kaca depan selagi kamu memasak.' },
            { speaker: 'Duck', text: 'Baik. Akan langsung kusiapkan pesananmu.' },
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
          name: 'Sam, Leo & Mia',
          title: 'Sekelompok Teman Tengah Malam',
          orderItem: 'Ember Ayam Goreng Besar, 3 Kopi & Kentang Besar',
          dialogue: [
            { speaker: 'Sam', text: 'Hei! Untung kalian masih buka—macet sepulang konser bikin kami tertahan di jalan tol dua jam penuh.' },
            { speaker: 'Mia', text: 'Tunggu, ini McDonald’s di tengah hutan tempat karyawan malam menghilang minggu lalu bukan sih? Agak seram ya!' },
            { speaker: 'Leo', text: 'Jangan bikin suasana merinding ah, Mia! Kita cuma mau makan makanan hangat dan duduk sebentar sebelum pulang.' },
            { speaker: 'Duck', text: 'Meja makan sudah bersih semua kok kalau kalian mau makan di sini. Mau pesan apa bertiga?' },
            { speaker: 'Sam', text: 'Satu ember ayam goreng renyah besar, kentang besar, dan tiga minuman hangat! Kami bakal duduk di meja sudut sana nanti.' },
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
    },
  },
};

export function getTranslations(lang?: Language): TranslationBundle {
  if (lang && lang in TRANSLATIONS) {
    return TRANSLATIONS[lang];
  }
  return TRANSLATIONS.en;
}
