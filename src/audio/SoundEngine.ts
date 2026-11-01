/**
 * Procedural Web Audio Sound Engine.
 * 100% code-synthesized: zero external MP3/WAV files, zero 404s.
 * Includes store entrance chime, car engines, automatic sliding doors,
 * trash dumpster clanking, and late-night restaurant ambiance.
 */

export class SoundEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private ambientGain: GainNode | null = null;
  private rainGain: GainNode | null = null;
  private cricketsGain: GainNode | null = null;
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private tensionLevel: number = 0;
  private lastChimeTime: number = 0;

  constructor() {}

  public init() {
    if (this.ctx) return;
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.startRainAndDrone();
      this.startCricketAmbience();
    } catch (e) {
      console.warn('AudioContext initialization deferred until user interaction');
    }
  }

  public resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMasterVolume(vol: number) {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.masterVolume, this.ctx.currentTime);
    }
  }

  public setTensionLevel(level: number) {
    this.tensionLevel = Math.max(0, Math.min(1, level));
    if (this.droneFilter && this.ctx) {
      const targetFreq = 45 + this.tensionLevel * 120;
      this.droneFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.6);
    }
    if (this.ambientGain && this.ctx) {
      const targetGain = 0.12 + this.tensionLevel * 0.15;
      this.ambientGain.gain.setTargetAtTime(targetGain, this.ctx.currentTime, 0.5);
    }
  }

  public setCricketVolume(targetGain: number) {
    if (!this.cricketsGain || !this.ctx) return;
    const clamped = Math.max(0, Math.min(0.28, targetGain));
    this.cricketsGain.gain.setTargetAtTime(clamped, this.ctx.currentTime, 0.35);
  }

  private startCricketAmbience() {
    if (!this.ctx || !this.masterGain) return;

    // Procedural synthesis of nighttime crickets chirping
    // Crickets chirp in bursts at ~4600Hz - 5000Hz
    const sampleRate = this.ctx.sampleRate;
    const duration = 2.5; // 2.5s looping buffer
    const frameCount = Math.floor(sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, frameCount, sampleRate);
    const data = buffer.getChannelData(0);

    // Create 3 chirp clusters per loop
    const chirpStarts = [0.15, 0.95, 1.75];
    for (const startSec of chirpStarts) {
      const pulses = 4; // 4 rapid wing rubs per chirp cluster
      const pulseDuration = 0.024;
      const pulseInterval = 0.038;

      for (let p = 0; p < pulses; p++) {
        const pulseStart = Math.floor((startSec + p * pulseInterval) * sampleRate);
        const pulseLength = Math.floor(pulseDuration * sampleRate);

        for (let i = 0; i < pulseLength; i++) {
          const t = i / sampleRate;
          const sampleIdx = pulseStart + i;
          if (sampleIdx < frameCount) {
            // Amplitude envelope: fast rise, exponential decay
            const env = Math.sin((i / pulseLength) * Math.PI);
            // Carrier frequency ~4850Hz with harmonics
            const wave =
              Math.sin(2 * Math.PI * 4850 * t) * 0.7 +
              Math.sin(2 * Math.PI * 5200 * t) * 0.3;
            // Modulated noise for realistic insect texture
            const noise = (Math.random() * 2 - 1) * 0.25;
            data[sampleIdx] += (wave + noise) * env * 0.35;
          }
        }
      }
    }

    const cricketSrc = this.ctx.createBufferSource();
    cricketSrc.buffer = buffer;
    cricketSrc.loop = true;

    const cricketFilter = this.ctx.createBiquadFilter();
    cricketFilter.type = 'bandpass';
    cricketFilter.frequency.value = 4900;
    cricketFilter.Q.value = 3.5;

    this.cricketsGain = this.ctx.createGain();
    this.cricketsGain.gain.value = 0.0; // starts silent inside restaurant

    cricketSrc.connect(cricketFilter);
    cricketFilter.connect(this.cricketsGain);
    this.cricketsGain.connect(this.masterGain);

    cricketSrc.start();
  }

  private startRainAndDrone() {
    if (!this.ctx || !this.masterGain) return;

    // 1. Soft outdoor rain ambience
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const rainFilter = this.ctx.createBiquadFilter();
    rainFilter.type = 'lowpass';
    rainFilter.frequency.value = 850;

    this.rainGain = this.ctx.createGain();
    this.rainGain.gain.value = 0.06;

    whiteNoise.connect(rainFilter);
    rainFilter.connect(this.rainGain);
    this.rainGain.connect(this.masterGain);
    whiteNoise.start();

    // 2. Late night restaurant ambient hum (subtle ventilation / tape drone)
    this.droneOsc1 = this.ctx.createOscillator();
    this.droneOsc1.type = 'sawtooth';
    this.droneOsc1.frequency.value = 46.25;

    this.droneOsc2 = this.ctx.createOscillator();
    this.droneOsc2.type = 'sine';
    this.droneOsc2.frequency.value = 45.85;

    this.droneFilter = this.ctx.createBiquadFilter();
    this.droneFilter.type = 'lowpass';
    this.droneFilter.frequency.value = 70;
    this.droneFilter.Q.value = 2.5;

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.value = 0.12;

    this.droneOsc1.connect(this.droneFilter);
    this.droneOsc2.connect(this.droneFilter);
    this.droneFilter.connect(this.ambientGain);
    this.ambientGain.connect(this.masterGain);

    this.droneOsc1.start();
    this.droneOsc2.start();
  }

  // --- EXTENDED STORE ENTRANCE CHIME (0.8–1.2s resonant electronic chime) ---
  public playEntranceChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Prevent overlapping chimes within 2.5 seconds
    if (now - this.lastChimeTime < 2.5) return;
    this.lastChimeTime = now;

    // Tone 1: High bell - E6 (1318.5 Hz) with crisp attack and smooth body
    const bell1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(1318.5, now);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.22, now + 0.015); // Clear crisp attack
    gain1.gain.exponentialRampToValueAtTime(0.04, now + 0.35); // Body
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.75); // Fade

    bell1.connect(gain1);
    gain1.connect(this.masterGain);
    bell1.start(now);
    bell1.stop(now + 0.8);

    // Tone 2: Resolving lower bell - B5 (987.77 Hz) starting at +0.26s with long resonant tail
    const bell2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(987.77, now + 0.26);

    gain2.gain.setValueAtTime(0, now + 0.26);
    gain2.gain.linearRampToValueAtTime(0.24, now + 0.28); // Clear attack
    gain2.gain.exponentialRampToValueAtTime(0.06, now + 0.65); // Warm resonant body
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 1.15); // Long gentle tail (~1.15s total)

    bell2.connect(gain2);
    gain2.connect(this.masterGain);
    bell2.start(now + 0.26);
    bell2.stop(now + 1.2);
  }

  // --- AUTOMATIC SLIDING DOOR SOUND ---
  public playSlidingDoorMotor() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(190, now + 0.25);
    osc.frequency.linearRampToValueAtTime(120, now + 0.5);

    filter.type = 'bandpass';
    filter.frequency.value = 350;

    gain.gain.setValueAtTime(0.07, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.6);
  }

  // --- CAR ENGINE RUMBLE & PARKING SQUEAK ---
  public playCarArrival() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Low engine idle rumble
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(55, now);
    osc.frequency.linearRampToValueAtTime(35, now + 1.2);
    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 1.5);

    // Subtle brake squeak
    const squeak = this.ctx.createOscillator();
    const squeakGain = this.ctx.createGain();
    squeak.type = 'sine';
    squeak.frequency.setValueAtTime(2400, now + 0.4);
    squeak.frequency.exponentialRampToValueAtTime(1800, now + 0.65);
    squeakGain.gain.setValueAtTime(0.03, now + 0.4);
    squeakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    squeak.connect(squeakGain);
    squeakGain.connect(this.masterGain);
    squeak.start(now + 0.4);
    squeak.stop(now + 0.75);
  }

  // --- TIME CLOCK PUNCH SOUND ---
  public playTimeClockPunch() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Mechanical punch clack
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.12);

    // Register bell ring
    const bell = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(1760, now + 0.06); // A6
    bellGain.gain.setValueAtTime(0.18, now + 0.06);
    bellGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    bell.connect(bellGain);
    bellGain.connect(this.masterGain);
    bell.start(now + 0.06);
    bell.stop(now + 0.75);
  }

  // --- OUTDOOR DUMPSTER LID & TRASH DISPOSAL ---
  public playOutdoorDumpsterDump() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Heavy steel lid opening clang
    const oscLid = this.ctx.createOscillator();
    const gainLid = this.ctx.createGain();
    oscLid.type = 'sawtooth';
    oscLid.frequency.setValueAtTime(140, now);
    oscLid.frequency.exponentialRampToValueAtTime(40, now + 0.22);
    gainLid.gain.setValueAtTime(0.25, now);
    gainLid.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    oscLid.connect(gainLid);
    gainLid.connect(this.masterGain);
    oscLid.start(now);
    oscLid.stop(now + 0.38);

    // Heavy bag impact thud
    const oscThud = this.ctx.createOscillator();
    const gainThud = this.ctx.createGain();
    oscThud.type = 'sine';
    oscThud.frequency.setValueAtTime(80, now + 0.2);
    oscThud.frequency.exponentialRampToValueAtTime(25, now + 0.45);
    gainThud.gain.setValueAtTime(0.28, now + 0.2);
    gainThud.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    oscThud.connect(gainThud);
    gainThud.connect(this.masterGain);
    oscThud.start(now + 0.2);
    oscThud.stop(now + 0.6);
  }

  /**
   * Positional footstep audio trigger with distinctive surface characteristics:
   * - Tile: Crisp, hard ceramic click and resonant slap
   * - Carpet: Muffled, cushioned low-frequency thud with softened transient
   * - Asphalt / Concrete: Gritty gravel crunch and solid pavement impact
   * - Grass: Soft leafy rustle and organic soil compression
   * With stereo / positional panning between left and right feet.
   */
  public playFootstep(
    surface: 'tile' | 'carpet' | 'asphalt' | 'grass' = 'tile',
    isSprinting: boolean = false,
    isCrouched: boolean = false,
    pan: number = 0
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Create Stereo Panner if supported
    let panner: StereoPannerNode | null = null;
    try {
      if (this.ctx.createStereoPanner) {
        panner = this.ctx.createStereoPanner();
        panner.pan.setValueAtTime(Math.max(-1, Math.min(1, pan)), now);
      }
    } catch (e) {
      // Fallback
    }

    const footstepGain = this.ctx.createGain();
    if (panner) {
      footstepGain.connect(panner);
      panner.connect(this.masterGain);
    } else {
      footstepGain.connect(this.masterGain);
    }

    if (surface === 'carpet') {
      // CARPET: Muffled, padded thud. No high-frequency click.
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      osc.type = 'sine';
      const baseFreq = isCrouched ? 55 : isSprinting ? 80 : 68;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);

      const vol = isCrouched ? 0.04 : isSprinting ? 0.16 : 0.08;
      footstepGain.gain.setValueAtTime(0.001, now);
      footstepGain.gain.linearRampToValueAtTime(vol, now + 0.015);
      footstepGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      osc.connect(filter);
      filter.connect(footstepGain);
      osc.start(now);
      osc.stop(now + 0.2);
    } else if (surface === 'tile') {
      // TILE: Crisp hard linoleum tap + sharp high transient click
      // 1. High transient click (shoe heel on linoleum)
      const oscClick = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      const clickFilter = this.ctx.createBiquadFilter();

      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime(isSprinting ? 1800 : 1450, now);
      oscClick.frequency.exponentialRampToValueAtTime(280, now + 0.035);

      clickFilter.type = 'bandpass';
      clickFilter.frequency.value = 1600;
      clickFilter.Q.value = 2.2;

      const clickVol = isCrouched ? 0.025 : isSprinting ? 0.12 : 0.065;
      clickGain.gain.setValueAtTime(clickVol, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscClick.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(footstepGain);
      oscClick.start(now);
      oscClick.stop(now + 0.05);

      // 2. Body heel thump
      const oscThump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      oscThump.type = 'sine';
      oscThump.frequency.setValueAtTime(isSprinting ? 110 : 92, now);
      oscThump.frequency.exponentialRampToValueAtTime(32, now + 0.09);

      const thumpVol = isCrouched ? 0.04 : isSprinting ? 0.18 : 0.09;
      thumpGain.gain.setValueAtTime(thumpVol, now);
      thumpGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11);

      oscThump.connect(thumpGain);
      thumpGain.connect(footstepGain);
      oscThump.start(now);
      oscThump.stop(now + 0.12);
    } else if (surface === 'asphalt') {
      // ASPHALT / CONCRETE: Gritty crunch of outdoor aggregate pavement
      // Noise burst for grit
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.08);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.25));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 750;
      noiseFilter.Q.value = 1.4;

      const noiseGain = this.ctx.createGain();
      const gritVol = isCrouched ? 0.03 : isSprinting ? 0.14 : 0.075;
      noiseGain.gain.setValueAtTime(gritVol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(footstepGain);
      noise.start(now);

      // Pavement thud
      const osc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80, now);
      osc.frequency.exponentialRampToValueAtTime(30, now + 0.1);
      thudGain.gain.setValueAtTime(isSprinting ? 0.15 : 0.08, now);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(thudGain);
      thudGain.connect(footstepGain);
      osc.start(now);
      osc.stop(now + 0.11);
    } else {
      // GRASS: Soft leafy rustle & organic damp step
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.1);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.35));
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 600;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isSprinting ? 0.12 : 0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(footstepGain);
      noise.start(now);
    }
  }

  /** Cooking fryers, grill sizzle, and food prep sound */
  public playFoodPreparation() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Sizzling noise
    const duration = 1.2;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Random sizzling amplitude
      const sizzle = (Math.random() * 2 - 1) * (0.8 + 0.2 * Math.sin(i * 0.05));
      data[i] = sizzle * (1 - i / bufferSize);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(2600, now);
    filter.frequency.linearRampToValueAtTime(1800, now + duration);
    filter.Q.value = 1.8;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);

    // Spatula stainless steel clink
    const oscClink = this.ctx.createOscillator();
    const clinkGain = this.ctx.createGain();
    oscClink.type = 'sine';
    oscClink.frequency.setValueAtTime(1920, now + 0.2);
    oscClink.frequency.exponentialRampToValueAtTime(740, now + 0.35);
    clinkGain.gain.setValueAtTime(0.18, now + 0.2);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

    oscClink.connect(clinkGain);
    clinkGain.connect(this.masterGain);
    oscClink.start(now + 0.2);
    oscClink.stop(now + 0.46);
  }

  /** Commercial Espresso & Drip Coffee machine brewing steam hiss & gurgle */
  public playCoffeeBrewSteam() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const duration = 1.2;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(3200, now);
    filter.frequency.exponentialRampToValueAtTime(1400, now + duration);
    filter.Q.value = 2.5;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.18, now + 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  /** Ominous electrical buzz and tube pop for violently flickering kitchen fluorescent tube */
  public playFluorescentFlickerBuzz() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 60Hz AC mains ballast buzz
    const oscBuzz = this.ctx.createOscillator();
    const gainBuzz = this.ctx.createGain();
    oscBuzz.type = 'sawtooth';
    oscBuzz.frequency.setValueAtTime(120, now);
    oscBuzz.frequency.setValueAtTime(60, now + 0.08);

    gainBuzz.gain.setValueAtTime(0.12, now);
    gainBuzz.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    oscBuzz.connect(gainBuzz);
    gainBuzz.connect(this.masterGain);
    oscBuzz.start(now);
    oscBuzz.stop(now + 0.25);

    // Static spark pop
    const oscPop = this.ctx.createOscillator();
    const gainPop = this.ctx.createGain();
    oscPop.type = 'square';
    oscPop.frequency.setValueAtTime(980, now);
    gainPop.gain.setValueAtTime(0.08, now);
    gainPop.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
    oscPop.connect(gainPop);
    gainPop.connect(this.masterGain);
    oscPop.start(now);
    oscPop.stop(now + 0.05);
  }

  /** Paper food bag packaging rustle */
  public playFoodPackaging() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const duration = 0.5;
    const bufferSize = Math.floor(this.ctx.sampleRate * duration);
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * (0.5 + 0.5 * Math.sin(i * 0.1));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1200;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  /** Cash register sale completion chime & drawer clink */
  public playCashRegisterSale() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Dual bright bell "cha-ching"
    const bell1 = this.ctx.createOscillator();
    const bellGain1 = this.ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(1760, now); // A6
    bellGain1.gain.setValueAtTime(0.25, now);
    bellGain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    bell1.connect(bellGain1);
    bellGain1.connect(this.masterGain);
    bell1.start(now);
    bell1.stop(now + 0.65);

    const bell2 = this.ctx.createOscillator();
    const bellGain2 = this.ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(2640, now + 0.08); // E7
    bellGain2.gain.setValueAtTime(0.3, now + 0.08);
    bellGain2.gain.exponentialRampToValueAtTime(0.001, now + 0.75);
    bell2.connect(bellGain2);
    bellGain2.connect(this.masterGain);
    bell2.start(now + 0.08);
    bell2.stop(now + 0.8);

    // Cash drawer slide thud
    const oscDrawer = this.ctx.createOscillator();
    const drawerGain = this.ctx.createGain();
    oscDrawer.type = 'triangle';
    oscDrawer.frequency.setValueAtTime(95, now + 0.12);
    oscDrawer.frequency.exponentialRampToValueAtTime(35, now + 0.35);
    drawerGain.gain.setValueAtTime(0.2, now + 0.12);
    drawerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    oscDrawer.connect(drawerGain);
    drawerGain.connect(this.masterGain);
    oscDrawer.start(now + 0.12);
    oscDrawer.stop(now + 0.42);
  }

  public playFlashlightClick(turnOn: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    if (turnOn) {
      // Crisp mechanical switch ON: high sharp latch snap
      const oscPrimary = this.ctx.createOscillator();
      const gainPrimary = this.ctx.createGain();
      oscPrimary.type = 'square';
      oscPrimary.frequency.setValueAtTime(1750, now);
      oscPrimary.frequency.exponentialRampToValueAtTime(650, now + 0.025);

      gainPrimary.gain.setValueAtTime(0.12, now);
      gainPrimary.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscPrimary.connect(gainPrimary);
      gainPrimary.connect(this.masterGain);
      oscPrimary.start(now);
      oscPrimary.stop(now + 0.05);

      // Micro metallic ping
      const oscPing = this.ctx.createOscillator();
      const gainPing = this.ctx.createGain();
      oscPing.type = 'sine';
      oscPing.frequency.setValueAtTime(2400, now + 0.008);
      gainPing.gain.setValueAtTime(0.05, now + 0.008);
      gainPing.gain.exponentialRampToValueAtTime(0.0001, now + 0.038);

      oscPing.connect(gainPing);
      gainPing.connect(this.masterGain);
      oscPing.start(now + 0.008);
      oscPing.stop(now + 0.04);
    } else {
      // Lower, duller mechanical switch OFF: thumb release clack
      const oscOff = this.ctx.createOscillator();
      const gainOff = this.ctx.createGain();
      oscOff.type = 'triangle';
      oscOff.frequency.setValueAtTime(950, now);
      oscOff.frequency.exponentialRampToValueAtTime(220, now + 0.032);

      gainOff.gain.setValueAtTime(0.11, now);
      gainOff.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscOff.connect(gainOff);
      gainOff.connect(this.masterGain);
      oscOff.start(now);
      oscOff.stop(now + 0.05);
    }
  }

  public playDialogueBlip() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(450, now + 0.018);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.022);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  /**
   * Low-pitched retro electronic beeping sound accompanying scrolling typewriter dialogue text.
   * Duck has a deeper, dry monotone (140-160Hz), while customer NPCs have slightly distinct tones.
   */
  public playDialogueTypewriterBeep(isDuck: boolean = true) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    // Low-pitched fundamental frequency with subtle variation for organic retro feel
    const baseFreq = isDuck ? 150 : 185;
    const jitter = (Math.random() - 0.5) * 14;
    const startFreq = baseFreq + jitter;

    osc.type = isDuck ? 'triangle' : 'sawtooth';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq * 0.88, now + 0.032);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(isDuck ? 420 : 540, now);

    // Warm, muted click/beep envelope
    gain.gain.setValueAtTime(0.048, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.036);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  public playCleaningWipe() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.linearRampToValueAtTime(380, now + 0.12);
    osc.frequency.linearRampToValueAtTime(200, now + 0.28);

    filter.type = 'bandpass';
    filter.frequency.value = 550;
    filter.Q.value = 2.0;

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.32);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.35);
  }

  public playSwitchToggle() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(220, now + 0.05);

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.14);
  }

  public playObjectiveComplete() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Harmonic two-tone success chord
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(523.25, now); // C5
    osc1.frequency.setValueAtTime(659.25, now + 0.12); // E5

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(783.99, now + 0.12); // G5

    gain.gain.setValueAtTime(0.14, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);

    osc1.start(now);
    osc2.start(now + 0.12);
    osc1.stop(now + 0.6);
    osc2.stop(now + 0.6);
  }

  public playCCTVSwitch() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(900, now);
    osc.frequency.setValueAtTime(450, now + 0.04);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.09);
  }

  public playHourBell() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(440, now);
    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.8);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 1.9);
  }

  public playDoor(open: boolean = true) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(open ? 120 : 260, now);
    osc.frequency.exponentialRampToValueAtTime(open ? 220 : 70, now + 0.22);

    filter.type = 'lowpass';
    filter.frequency.value = 350;

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.28);
  }

  public playCameraGlitchAndBoom() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const oscStatic = this.ctx.createOscillator();
    const gainStatic = this.ctx.createGain();

    oscStatic.type = 'square';
    oscStatic.frequency.setValueAtTime(140, now);
    oscStatic.frequency.linearRampToValueAtTime(80, now + 0.5);

    gainStatic.gain.setValueAtTime(0.25, now);
    gainStatic.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

    oscStatic.connect(gainStatic);
    gainStatic.connect(this.masterGain);
    oscStatic.start(now);
    oscStatic.stop(now + 0.65);

    const oscSub = this.ctx.createOscillator();
    const gainSub = this.ctx.createGain();

    oscSub.type = 'sine';
    oscSub.frequency.setValueAtTime(75, now);
    oscSub.frequency.exponentialRampToValueAtTime(20, now + 2.0);

    gainSub.gain.setValueAtTime(0.5, now);
    gainSub.gain.exponentialRampToValueAtTime(0.001, now + 2.2);

    oscSub.connect(gainSub);
    gainSub.connect(this.masterGain);
    oscSub.start(now);
    oscSub.stop(now + 2.3);
  }

  public dispose() {
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

export const soundEngine = new SoundEngine();
