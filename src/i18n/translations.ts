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
    night3Hunt: string;
    fullGameTeaser: string;
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
    teaser1: string;
    teaser2: string;
    demoComplete: string;
    nightsSurvived: string;
    night3Coming: string;
    teaserDesc: string;
    playAgain: string;
  };
  engine: {
    steps: {
      talk_to_john: { title: string; description: string };
      clock_in: { title: string; description: string };
      clean_tables: { title: string; description: (count: number) => string };
      collect_trash: { title: string; description: (count: number) => string };
      dump_trash: { title: string; description: string };
      kitchen_fryers: { title: string; description: string };
      check_cctv: { title: string; description: string };
      finish_shift: { title: string; description: string; ready6am: string };
      n2_clock_in: { title: string; description: string };
      n2_breaker: { title: string; description: string };
      n2_mop_puddle: { title: string; description: string };
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
      powerOutage: string;
      powerRestored: string;
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
      actions: Record<string, string>;
    };
    openingMonologueNight1: DialogueLine[];
    openingMonologueNight2: DialogueLine[];
    johnDialogue: DialogueLine[];
    powerOutageStartDialogue: DialogueLine[];
    powerRestoredDialogue: DialogueLine[];
    warehouseClownReactionDialogue: DialogueLine[];
    thankYouDialogue: (customerName: string, price: string) => DialogueLine[];
    waitingOrderDialogue: (customerName: string, itemText: string) => DialogueLine[];
    customers: CustomerArchetypeTranslation[];
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
      night3Hunt: 'NIGHT 3: THE HUNT',
      fullGameTeaser: 'FULL GAME TEASER',
      bgmLabel: 'BGM: Cold Glass Passage',
      unmute: 'UNMUTE',
      musicOn: 'MUSIC ON',
      controls: 'Controls',
      settings: 'Settings',
      credits: 'Credits',
      storyRuleLabel: 'Story Rule:',
      storyRule:
        'During Nights 1 & 2, the mascot is observing and not hunting. Experience the calm before the storm.',
      shiftMemo: 'Shift Memo',
      employeeRoutine: 'Employee Routine',
      memoItems: [
        'Night 1: Talk to John to take over the shift, clock in, clean tables, collect trash, shutdown kitchen fryers, and serve late guests.',
        'Night 2: Flip maintenance breaker, mop hallway, recycle cardboard, check drive-thru station and CCTV.',
        'Flashlight has unlimited power; maintain situational awareness.',
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
        { key: 'Shift', desc: 'Sprint (Consumes stamina)' },
        { key: 'C', desc: 'Crouch' },
        { key: 'F', desc: 'Toggle Flashlight (Unlimited)' },
        { key: 'E', desc: 'Talk to John / Customers / Complete Tasks' },
        { key: 'ESC', desc: 'Pause Menu / Return from CCTV' },
      ],
      understood: 'Understood',
      creditsTitle: 'Credits & Lore',
      creditsIntro:
        "McDonald's Nightfall — DEMO is a 2-night slow-burn mascot horror prologue.",
      creditsDetails: [
        { label: 'Theme', value: 'Late-night fast-food observation & psychological dread' },
        { label: 'Format', value: '2 Playable Nights + Night 3 Teaser Ending' },
        { label: 'Engine', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Story Direction', value: 'The mascot watches and creeps, preparing for Night 3.' },
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
      teaser1: '“YOU THOUGHT HE WAS JUST WATCHING.”',
      teaser2: '“HE WAS WAITING.”',
      demoComplete: 'DEMO COMPLETE',
      nightsSurvived: '2 NIGHTS SURVIVED',
      night3Coming: 'NIGHT 3: THE HUNT IS COMING…',
      teaserDesc:
        'During Nights 1 and 2, he stood by and observed every routine. On Night 3, the doors lock from the outside, the power cuts completely, and the real hunt begins in the full game.',
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
          title: 'MOP HALLWAY',
          description: 'Mop up the mysterious dark fluid puddle in the back hallway.',
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
        powerOutage: '⚡ 3:00 AM POWER OUTAGE — CHECK THE ELECTRICAL BOX BEHIND THE STORE!',
        powerRestored: '⚡ POWER RESTORED — CIRCUIT BREAKER RESET',
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
        actions: {
          employee_john: 'Talk to John (Take Over Shift)',
          time_clock: 'Punch Employee Time Clock',
          clean_table_1: 'Wipe & Sanitize Table 1',
          clean_table_2: 'Wipe & Sanitize Table 2',
          trash_bag_1: 'Pick Up Dining Trash Bag',
          trash_bag_2: 'Pick Up Dining Trash Bag',
          outdoor_dumpster: 'Dump Trash into Outdoor Dumpster',
          kitchen_switch: 'Shut Down Kitchen Fryers & Heating',
          office_switch: 'Turn On Auxiliary Hallway Lights',
          cctv_monitor: 'Access Security CCTV Monitor',
          front_door_exit: 'Clock Out & Leave Through Front Door',
          hallway_spill: 'Mop & Clean Dark Liquid Puddle',
          cardboard_bundle: 'Pick Up Bundled Cardboard Stack',
          drive_thru_order_station: 'Check Drive-Thru Headset & Terminal',
          electrical_box: 'Inspect Electrical Box & Restore Power',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Another night at this place… standing out here in the cold mist.' },
        { speaker: 'Duck', text: 'Minimum wage, dark woods, and a 6-hour shift. John should still be inside waiting to hand over the shift.' },
        { speaker: 'Duck', text: "Let's head through the sliding doors and talk to John." },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Back for Night 2… The parking lot and forest feel unusually silent tonight.' },
        { speaker: 'Duck', text: 'Head inside through the doors, finish the checklist, and survive until 6:00 AM.' },
        { speaker: 'Duck', text: "Let's get in." },
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
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: "WTF!, what's going on? Did the boss not pay the electricity bill? I don't know I'll go to the back of the store and check.",
        },
      ],
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
      night3Hunt: 'ĐÊM 3: CUỘC ĐI SĂN',
      fullGameTeaser: 'TEASER BẢN ĐẦY ĐỦ',
      bgmLabel: 'Nhạc nền: Cold Glass Passage',
      unmute: 'BẬT NHẠC',
      musicOn: 'ĐANG PHÁT',
      controls: 'Điều khiển',
      settings: 'Cài đặt',
      credits: 'Thông tin',
      storyRuleLabel: 'Quy tắc cốt truyện:',
      storyRule:
        'Trong Đêm 1 & 2, linh vật chú hề chỉ quan sát chứ chưa săn đuổi. Hãy cảm nhận sự bình yên trước cơn bão.',
      shiftMemo: 'Ghi Chú Ca Trực',
      employeeRoutine: 'Quy Trình Nhân Viên',
      memoItems: [
        'Đêm 1: Nói chuyện với John để nhận ca, bấm thẻ giờ, lau bàn, thu gom rác, tắt bếp chiên và phục vụ khách khuya.',
        'Đêm 2: Gạt cầu dao bảo trì, lau vết bẩn hành lang, bỏ thùng carton, kiểm tra quầy drive-thru và CCTV.',
        'Đèn pin dùng không giới hạn; hãy luôn giữ cảnh giác xung quanh.',
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
        { key: 'Shift', desc: 'Chạy nhanh (Tốn thể lực)' },
        { key: 'C', desc: 'Ngồi xuống / Đứng lên' },
        { key: 'F', desc: 'Bật / Tắt Đèn Pin (Vô hạn)' },
        { key: 'E', desc: 'Nói chuyện với John / Khách / Làm nhiệm vụ' },
        { key: 'ESC', desc: 'Tạm dừng / Thoát màn hình CCTV' },
      ],
      understood: 'Đã Hiểu',
      creditsTitle: 'Thông Tin & Cốt Truyện',
      creditsIntro:
        "McDonald's Nightfall — DEMO là phần mở đầu kinh dị tâm lý kéo dài 2 đêm.",
      creditsDetails: [
        { label: 'Chủ đề', value: 'Trực đêm tiệm đồ ăn nhanh & nỗi sợ tâm lý' },
        { label: 'Định dạng', value: '2 Đêm chơi chính + Đoạn kết giới thiệu Đêm 3' },
        { label: 'Công nghệ', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Hướng truyện', value: 'Linh vật âm thầm theo dõi, chuẩn bị cho Đêm 3.' },
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
      teaser1: '“BẠN TƯỞNG HẮN CHỈ ĐỨNG NHÌN THÔI SAO.”',
      teaser2: '“HẮN ĐANG CHỜ ĐỢI ĐẤY.”',
      demoComplete: 'HOÀN THÀNH DEMO',
      nightsSurvived: 'ĐÃ SỐNG SÓT 2 ĐÊM',
      night3Coming: 'ĐÊM 3: CUỘC ĐI SĂN SẮP BẮT ĐẦU…',
      teaserDesc:
        'Trong suốt Đêm 1 và Đêm 2, hắn chỉ đứng đó quan sát mọi thói quen của bạn. Vào Đêm 3, cửa sẽ khóa từ bên ngoài, điện cắt hoàn toàn, và cuộc đi săn thực sự sẽ bắt đầu trong bản đầy đủ.',
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
          title: 'LAU HÀNH LANG',
          description: 'Lau sạch vũng chất lỏng đen kỳ lạ ở hành lang phía sau.',
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
        powerOutage: '⚡ MẤT ĐIỆN LÚC 3:00 SÁNG — KIỂM TRA HỘP ĐIỆN PHÍA SAU CỬA HÀNG!',
        powerRestored: '⚡ ĐÃ CÓ ĐIỆN TRỞ LẠI — ĐÃ BẬT CẦU DAO',
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
        actions: {
          employee_john: 'Nói chuyện với John (Nhận ca)',
          time_clock: 'Bấm Thẻ Chấm Công Nhân Viên',
          clean_table_1: 'Lau & Khử Trùng Bàn Số 1',
          clean_table_2: 'Lau & Khử Trùng Bàn Số 2',
          trash_bag_1: 'Nhặt Túi Rác Bàn Ăn',
          trash_bag_2: 'Nhặt Túi Rác Bàn Ăn',
          outdoor_dumpster: 'Đổ Rác Vào Thùng Rác Ngoài Trời',
          kitchen_switch: 'Tắt Nguồn Bếp Chiên & Thiết Bị Nóng',
          office_switch: 'Bật Đèn Phụ Trợ Hành Lang',
          cctv_monitor: 'Mở Màn Hình An Ninh CCTV',
          front_door_exit: 'Tan Ca & Rời Cửa Hàng Qua Cửa Chính',
          hallway_spill: 'Lau Sạch Vũng Chất Lỏng Đen',
          cardboard_bundle: 'Nhặt Bó Thùng Carton',
          drive_thru_order_station: 'Kiểm Tra Tai Nghe & Máy Drive-Thru',
          electrical_box: 'Kiểm Tra Hộp Điện & Khôi Phục Nguồn',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Lại thêm một đêm ở chỗ này… đứng ngoài trời sương lạnh thế này.' },
        { speaker: 'Duck', text: 'Lương bèo, rừng tối, ca trực 6 tiếng. Hình như John vẫn đang đợi ở trong để bàn giao ca.' },
        { speaker: 'Duck', text: 'Vào qua cửa trượt rồi nói chuyện với John thôi.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Quay lại Đêm 2 rồi… Bãi xe và khu rừng tối nay yên ắng một cách kỳ lạ.' },
        { speaker: 'Duck', text: 'Vào trong hoàn thành danh sách công việc và sống sót tới 6:00 sáng.' },
        { speaker: 'Duck', text: 'Vào thôi.' },
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
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Cái quái gì thế?! Có chuyện gì vậy? Ông chủ quên đóng tiền điện à? Không biết nữa, tôi sẽ ra phía sau cửa hàng kiểm tra xem sao.',
        },
      ],
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
      night3Hunt: 'НОЧЬ 3: ОХОТА',
      fullGameTeaser: 'ТИЗЕР ПОЛНОЙ ВЕРСИИ',
      bgmLabel: 'Музыка: Cold Glass Passage',
      unmute: 'ВКЛ. ЗВУК',
      musicOn: 'МУЗЫКА ВКЛ',
      controls: 'Управление',
      settings: 'Настройки',
      credits: 'Об игре',
      storyRuleLabel: 'Правило сюжета:',
      storyRule:
        'В 1-ю и 2-ю ночи маскот только наблюдает и не охотится. Ощутите затишье перед бурей.',
      shiftMemo: 'Памятка смены',
      employeeRoutine: 'Распорядок сотрудника',
      memoItems: [
        'Ночь 1: Поговорите с Джоном, отметьтесь, протрите столы, соберите мусор, отключите фритюрницы и обслужите поздних гостей.',
        'Ночь 2: Включите рубильник в офисе, вытрите лужу в коридоре, вынесите картон, проверьте автораздачу и камеры.',
        'Фонарик работает без ограничений; сохраняйте бдительность.',
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
        { key: 'Shift', desc: 'Бег (тратит выносливость)' },
        { key: 'C', desc: 'Присесть' },
        { key: 'F', desc: 'Фонарик (без ограничений)' },
        { key: 'E', desc: 'Поговорить с Джоном / гостями / действие' },
        { key: 'ESC', desc: 'Пауза / Выйти из камер CCTV' },
      ],
      understood: 'Понятно',
      creditsTitle: 'Об игре и лор',
      creditsIntro:
        "McDonald's Nightfall — DEMO — это двухночный пролог психологического хоррора с маскотом.",
      creditsDetails: [
        { label: 'Тема', value: 'Ночная смена в фастфуде и нарастающая тревога' },
        { label: 'Формат', value: '2 игровые ночи + тизер 3-й ночи' },
        { label: 'Движок', value: 'Three.js 3D WebGL и Web Audio API' },
        { label: 'Сюжет', value: 'Маскот наблюдает и подкрадывается, готовясь к 3-й ночи.' },
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
      teaser1: '«ТЫ ДУМАЛ, ОН ПРОСТО НАБЛЮДАЛ.»',
      teaser2: '«ОН ЖДАЛ.»',
      demoComplete: 'ДЕМО ПРОЙДЕНО',
      nightsSurvived: 'ВЫ ПРОЖИЛИ 2 НОЧИ',
      night3Coming: 'НОЧЬ 3: ОХОТА НАЧИНАЕТСЯ…',
      teaserDesc:
        'В первую и вторую ночь он лишь стоял в стороне и изучал каждый ваш шаг. В 3-ю ночь двери заблокируются снаружи, свет погаснет, и в полной версии начнётся настоящая охота.',
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
          title: 'ВЫМЫТЬ КОРИДОР',
          description: 'Вытрите странную тёмную лужу в заднем коридоре.',
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
        powerOutage: '⚡ 3:00 — ОТКЛЮЧЕНИЕ СВЕТА! ПРОВЕРЬТЕ ЭЛЕКТРОЩИТОК ЗА МАГАЗИНОМ!',
        powerRestored: '⚡ ЭЛЕКТРИЧЕСТВО ВОССТАНОВЛЕНО — РУБИЛЬНИК ВКЛЮЧЕН',
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
        actions: {
          employee_john: 'Поговорить с Джоном (Принять смену)',
          time_clock: 'Отметиться на табельных часах',
          clean_table_1: 'Протереть стол №1',
          clean_table_2: 'Протереть стол №2',
          trash_bag_1: 'Взять пакет с мусором',
          trash_bag_2: 'Взять пакет с мусором',
          outdoor_dumpster: 'Выбросить мусор в контейнер',
          kitchen_switch: 'Выключить фритюрницы и плиту',
          office_switch: 'Включить свет в коридоре',
          cctv_monitor: 'Открыть монитор камер CCTV',
          front_door_exit: 'Завершить смену и выйти через дверь',
          hallway_spill: 'Вытереть тёмную лужу шваброй',
          cardboard_bundle: 'Взять связку картона',
          drive_thru_order_station: 'Проверить гарнитуру и терминал автозаказов',
          electrical_box: 'Осмотреть электрощиток и вернуть свет',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Очередная ночь в этом месте… стою здесь в холодном тумане.' },
        { speaker: 'Duck', text: 'Минимальная зарплата, тёмный лес и 6-часовая смена. Внутри должен ждать Джон, чтобы передать смену.' },
        { speaker: 'Duck', text: 'Зайдём через раздвижные двери и поговорим с Джоном.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Снова на Ночь 2… Парковка и лес сегодня пугающе тихие.' },
        { speaker: 'Duck', text: 'Заходим внутрь, выполняем список дел и доживаем до 6:00 утра.' },
        { speaker: 'Duck', text: 'Пора заходить.' },
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
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Что за чёрт?! Что происходит? Неужели босс не заплатил за электричество? Не знаю, пойду за заднюю дверь магазина и проверю.',
        },
      ],
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
      night3Hunt: 'MALAM 3: PERBURUAN',
      fullGameTeaser: 'TEASER GAME PENUH',
      bgmLabel: 'Musik Latar: Cold Glass Passage',
      unmute: 'NYALAKAN',
      musicOn: 'MUSIK AKTIF',
      controls: 'Kontrol',
      settings: 'Pengaturan',
      credits: 'Kredit',
      storyRuleLabel: 'Aturan Cerita:',
      storyRule:
        'Selama Malam 1 & 2, maskot hanya mengamati dan belum berburu. Rasakan ketenangan sebelum badai datang.',
      shiftMemo: 'Catatan Shift',
      employeeRoutine: 'Rutinitas Karyawan',
      memoItems: [
        'Malam 1: Bicara dengan John untuk serah terima shift, absen, lap meja, kumpulkan sampah, matikan penggorengan dapur, dan layani tamu malam.',
        'Malam 2: Nyalakan sakelar pemeliharaan, pel lorong, buang kardus, cek stasiun drive-thru dan CCTV.',
        'Senter memiliki daya tak terbatas; tetap jaga kewaspadaan sekitar.',
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
        { key: 'Shift', desc: 'Lari Cepat (Menguras stamina)' },
        { key: 'C', desc: 'Menunduk' },
        { key: 'F', desc: 'Nyalakan/Matikan Senter (Tanpa batas)' },
        { key: 'E', desc: 'Bicara dengan John / Tamu / Selesaikan Tugas' },
        { key: 'ESC', desc: 'Menu Jeda / Keluar dari CCTV' },
      ],
      understood: 'Mengerti',
      creditsTitle: 'Kredit & Cerita',
      creditsIntro:
        "McDonald's Nightfall — DEMO adalah prolog horor maskot 2 malam yang menegangkan.",
      creditsDetails: [
        { label: 'Tema', value: 'Shift malam restoran cepat saji & ketegangan psikologis' },
        { label: 'Format', value: '2 Malam Dimainkan + Ending Teaser Malam 3' },
        { label: 'Mesin', value: 'Three.js 3D WebGL & Web Audio API' },
        { label: 'Arah Cerita', value: 'Maskot mengawasi dan mengintai, bersiap untuk Malam 3.' },
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
      teaser1: '“KAU KIRA DIA HANYA MENGAWASI.”',
      teaser2: '“DIA SEDANG MENUNGGU.”',
      demoComplete: 'DEMO SELESAI',
      nightsSurvived: '2 MALAM BERTAHAN',
      night3Coming: 'MALAM 3: PERBURUAN AKAN DATANG…',
      teaserDesc:
        'Selama Malam 1 dan 2, dia hanya berdiri dan mengamati setiap rutinitasmu. Di Malam 3, pintu terkunci dari luar, listrik padam total, dan perburuan sesungguhnya dimulai di versi penuh.',
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
          title: 'PEL LORONG',
          description: 'Pel genangan cairan hitam misterius di lorong belakang.',
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
        powerOutage: '⚡ MATI LAMPU JAM 3:00 PAGI — PERIKSA KOTAK LISTRIK DI BELAKANG TOKO!',
        powerRestored: '⚡ LISTRIK KEMBALI MENYALA — PEMUTUS ARUS DIAKTIFKAN',
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
        actions: {
          employee_john: 'Bicara dengan John (Ambil Alih Shift)',
          time_clock: 'Absen di Mesin Absen Karyawan',
          clean_table_1: 'Lap & Bersihkan Meja 1',
          clean_table_2: 'Lap & Bersihkan Meja 2',
          trash_bag_1: 'Ambil Kantong Sampah Meja Makan',
          trash_bag_2: 'Ambil Kantong Sampah Meja Makan',
          outdoor_dumpster: 'Buang Sampah ke Bak Sampah Luar',
          kitchen_switch: 'Matikan Penggorengan & Pemanas Dapur',
          office_switch: 'Nyalakan Lampu Tambahan Lorong',
          cctv_monitor: 'Buka Monitor Keamanan CCTV',
          front_door_exit: 'Absen Pulang & Keluar Lewat Pintu Depan',
          hallway_spill: 'Pel & Bersihkan Genangan Cairan Gelap',
          cardboard_bundle: 'Ambil Tumpukan Kardus Terikat',
          drive_thru_order_station: 'Cek Headset & Terminal Drive-Thru',
          electrical_box: 'Periksa Kotak Listrik & Pulihkan Daya',
        },
      },
      openingMonologueNight1: [
        { speaker: 'Duck', text: 'Satu malam lagi di tempat ini… berdiri di luar dalam kabut dingin.' },
        { speaker: 'Duck', text: 'Gaji minimum, hutan gelap, dan shift 6 jam. John seharusnya masih di dalam menunggu untuk serah terima shift.' },
        { speaker: 'Duck', text: 'Ayo masuk lewat pintu geser dan bicara dengan John.' },
      ],
      openingMonologueNight2: [
        { speaker: 'Duck', text: 'Kembali untuk Malam 2… Area parkir dan hutan terasa sangat sunyi malam ini.' },
        { speaker: 'Duck', text: 'Masuk lewat pintu depan, selesaikan daftar tugas, dan bertahan sampai jam 6:00 pagi.' },
        { speaker: 'Duck', text: 'Ayo masuk.' },
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
      powerOutageStartDialogue: [
        {
          speaker: 'Duck',
          text: 'Apaan nih?! Ada apa ini? Apa bos lupa bayar tagihan listrik? Entahlah, aku pergi ke belakang toko untuk mengeceknya.',
        },
      ],
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
