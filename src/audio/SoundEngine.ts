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
  private droneOsc1: OscillatorNode | null = null;
  private droneOsc2: OscillatorNode | null = null;
  private droneFilter: BiquadFilterNode | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.8;
  private tensionLevel: number = 0;

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

  // --- STORE ENTRANCE CHIME ("DING-DONG / KENG!") ---
  public playEntranceChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // First bright bell note: E6 (1318.5 Hz)
    const bell1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    bell1.type = 'sine';
    bell1.frequency.setValueAtTime(1318.5, now);
    gain1.gain.setValueAtTime(0.2, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
    bell1.connect(gain1);
    gain1.connect(this.masterGain);
    bell1.start(now);
    bell1.stop(now + 0.65);

    // Second resonant bell note: B5 (987.77 Hz)
    const bell2 = this.ctx.createOscillator();
    const gain2 = this.ctx.createGain();
    bell2.type = 'sine';
    bell2.frequency.setValueAtTime(987.77, now + 0.14);
    gain2.gain.setValueAtTime(0.18, now + 0.14);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
    bell2.connect(gain2);
    gain2.connect(this.masterGain);
    bell2.start(now + 0.14);
    bell2.stop(now + 0.9);
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

  public playFootstep(isSprinting: boolean = false, isCrouched: boolean = false) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const filter = this.ctx.createBiquadFilter();

    osc.type = 'triangle';
    const baseFreq = isCrouched ? 50 : isSprinting ? 75 : 65;
    osc.frequency.setValueAtTime(baseFreq, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.12);

    filter.type = 'lowpass';
    filter.frequency.value = isCrouched ? 120 : 220;

    const volume = isCrouched ? 0.03 : isSprinting ? 0.14 : 0.07;
    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public playFlashlightClick(turnOn: boolean) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'square';
    osc.frequency.setValueAtTime(turnOn ? 1400 : 900, now);
    osc.frequency.exponentialRampToValueAtTime(350, now + 0.04);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start(now);
    osc.stop(now + 0.06);
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
