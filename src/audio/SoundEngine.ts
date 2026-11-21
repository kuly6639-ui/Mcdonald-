/**
 * Procedural Web Audio Sound Engine.
 * 100% code-synthesized: zero external MP3/WAV files, zero 404s.
 * Includes store entrance chime, car engines, automatic sliding doors,
 * trash dumpster clanking, and late-night restaurant ambiance.
 */

export type RestaurantFloorZone =
  | 'office'
  | 'booths'
  | 'warehouse'
  | 'restroom'
  | 'kitchen'
  | 'lobby'
  | 'outdoor';

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
  private nightBgmAudio: HTMLAudioElement | null = null;
  private currentNightTrack: 1 | 2 | 3 | null = null;
  private isMusicPaused: boolean = false;
  private clownJumpscareAudio: HTMLAudioElement | null = null;
  private night1ClownJumpscareAudio: HTMLAudioElement | null = null;
  private windowClownLaughAudio: HTMLAudioElement | null = null;
  private restaurantClownLaughAudio: HTMLAudioElement | null = null;
  private clownJumpscareBuffer: AudioBuffer | null = null;
  private clownJumpscareStartOffset: number = 0;
  private night1JumpscareBuffer: AudioBuffer | null = null;
  private night1JumpscareStartOffset: number = 6.74;
  private windowClownLaughBuffer: AudioBuffer | null = null;
  private windowClownLaughStartOffset: number = 0.35;
  private restaurantClownLaughBuffer: AudioBuffer | null = null;
  private restaurantClownLaughStartOffset: number = 1.9;
  private activeWindowLaughSource: AudioBufferSourceNode | null = null;
  private activeRestaurantLaughSource: AudioBufferSourceNode | null = null;
  private isRestaurantLaughPlaying: boolean = false;
  private jumpscareBuffersLoading: boolean = false;
  private chaseMusicAudio: HTMLAudioElement | null = null;
  private chaseMusicBuffer: AudioBuffer | null = null;
  private chaseMusicStartOffset: number = 0.28;
  private activeChaseSource: AudioBufferSourceNode | null = null;
  private activeChaseGain: GainNode | null = null;
  private isChasePlaying: boolean = false;
  private chaseFadeRaf: number | null = null;
  private isChasePaused: boolean = false;
  private isChaseFadingOut: boolean = false;
  private creditsMusicAudio: HTMLAudioElement | null = null;
  private creditsFadeRaf: number | null = null;
  private isCreditsMusicPlaying: boolean = false;
  private nightMusicFadeRaf: number | null = null;
  private musicAnalyser: AnalyserNode | null = null;
  private musicAnalyserData: Uint8Array<ArrayBuffer> | null = null;
  private musicEntryStartedAt: number = 0;
  private currentMusicTrackTitle: string = '';
  private lastWoodCreakVariant: number = -1;

  constructor() {}

  private ensureClownJumpscareAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    if (!this.clownJumpscareAudio) {
      const audio = new Audio('./assets/aistudio/jumpscaresound_4d78f6ef.mp4');
      audio.preload = 'auto';
      audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
      this.clownJumpscareAudio = audio;
    }
    return this.clownJumpscareAudio;
  }

  private ensureNight1ClownJumpscareAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    if (!this.night1ClownJumpscareAudio) {
      const audio = new Audio('./assets/aistudio/snaptik.vn_7512942661389618454_2dc3b0a5.mp4');
      audio.preload = 'auto';
      audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
      audio.addEventListener(
        'loadedmetadata',
        () => {
          try {
            if (audio.currentTime < 1.0) {
              audio.currentTime = this.night1JumpscareStartOffset;
            }
          } catch (e) {}
        },
        { once: true }
      );
      this.night1ClownJumpscareAudio = audio;
    }
    return this.night1ClownJumpscareAudio;
  }

  private ensureWindowClownLaughAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    if (!this.windowClownLaughAudio) {
      const audio = new Audio(
        './assets/aistudio/YTDown.com_YouTube_Media_Nd5iM61itKE_Horror-Laughing-Sound-effect_001_1080p_8fabfb1f.mp4'
      );
      audio.preload = 'auto';
      audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.95);
      this.windowClownLaughAudio = audio;
    }
    return this.windowClownLaughAudio;
  }

  private ensureRestaurantClownLaughAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    if (!this.restaurantClownLaughAudio) {
      const audio = new Audio(
        './assets/aistudio/YTDown.com_YouTube_Media_KDy_NTqphlg_Scary-Laugh-Sound-Effect_001_1080p_40736b8b.mp4'
      );
      audio.preload = 'auto';
      audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.92);
      audio.addEventListener('ended', () => {
        this.isRestaurantLaughPlaying = false;
      });
      this.restaurantClownLaughAudio = audio;
    }
    return this.restaurantClownLaughAudio;
  }

  private detectAudioOnsetSec(buffer: AudioBuffer, threshold: number = 0.035): number {
    const channels = buffer.numberOfChannels;
    const len = buffer.length;
    const windowSize = Math.max(1, Math.floor(buffer.sampleRate * 0.04)); // 40ms sustained window ignores micro clicks
    const step = Math.max(1, Math.floor(buffer.sampleRate * 0.01));

    for (let i = 0; i + windowSize < len; i += step) {
      let sumSq = 0;
      let count = 0;
      const sampleStride = Math.max(1, Math.floor(windowSize / 32));
      for (let j = i; j < i + windowSize; j += sampleStride) {
        let chMax = 0;
        for (let c = 0; c < channels; c++) {
          const v = Math.abs(buffer.getChannelData(c)[j]);
          if (v > chMax) chMax = v;
        }
        sumSq += chMax * chMax;
        count++;
      }
      const rms = count > 0 ? Math.sqrt(sumSq / count) : 0;
      if (rms >= threshold) {
        return Math.max(0, i / buffer.sampleRate - 0.02);
      }
    }
    return 0;
  }

  private preloadJumpscareBuffers() {
    if (!this.ctx || this.jumpscareBuffersLoading) return;
    this.jumpscareBuffersLoading = true;

    const loadBuffer = async (
      url: string,
      onDecoded: (buf: AudioBuffer, onsetSec: number) => void
    ) => {
      try {
        if (!this.ctx) return;
        let arr: ArrayBuffer;
        if (url.startsWith('data:')) {
          const commaIdx = url.indexOf(',');
          if (commaIdx === -1) return;
          const b64 = url.slice(commaIdx + 1);
          const bin = atob(b64);
          const bytes = new Uint8Array(bin.length);
          for (let i = 0; i < bin.length; i++) {
            bytes[i] = bin.charCodeAt(i);
          }
          arr = bytes.buffer;
        } else {
          const res = await fetch(url);
          if (!res.ok || !this.ctx) return;
          arr = await res.arrayBuffer();
        }
        const decoded = await this.ctx.decodeAudioData(arr);
        const onsetSec = this.detectAudioOnsetSec(decoded, 0.035);
        onDecoded(decoded, onsetSec);
      } catch (e) {
        // Fallback to HTMLAudioElement cleanly if fetch/decodeAudioData fails
      }
    };

    void loadBuffer('./assets/aistudio/jumpscaresound_4d78f6ef.mp4', (buf, onset) => {
      this.clownJumpscareBuffer = buf;
      this.clownJumpscareStartOffset = onset;
    });
    void loadBuffer(
      './assets/aistudio/snaptik.vn_7512942661389618454_2dc3b0a5.mp4',
      (buf, onset) => {
        this.night1JumpscareBuffer = buf;
        this.night1JumpscareStartOffset = onset > 0.5 ? onset : 6.72;
      }
    );
    void loadBuffer(
      './assets/aistudio/YTDown.com_YouTube_Media_Nd5iM61itKE_Horror-Laughing-Sound-effect_001_1080p_8fabfb1f.mp4',
      (buf, onset) => {
        this.windowClownLaughBuffer = buf;
        this.windowClownLaughStartOffset = Math.max(0, onset);
      }
    );
    void loadBuffer(
      './assets/aistudio/YTDown.com_YouTube_Media_KDy_NTqphlg_Scary-Laugh-Sound-Effect_001_1080p_40736b8b.mp4',
      (buf, onset) => {
        this.restaurantClownLaughBuffer = buf;
        this.restaurantClownLaughStartOffset = Math.max(0, onset);
      }
    );
    void loadBuffer('./assets/aistudio/chasesound_a0aed555.mp4', (buf, onset) => {
      this.chaseMusicBuffer = buf;
      this.chaseMusicStartOffset = onset > 0.05 ? onset : 0.28;
    });
  }

  private ensureChaseMusicAudio(): HTMLAudioElement | null {
    if (typeof Audio === 'undefined') return null;
    if (!this.chaseMusicAudio) {
      const audio = new Audio('./assets/aistudio/chasesound_a0aed555.mp4');
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.85);
      this.chaseMusicAudio = audio;
    }
    return this.chaseMusicAudio;
  }

  public init() {
    this.ensureClownJumpscareAudio();
    this.ensureNight1ClownJumpscareAudio();
    this.ensureWindowClownLaughAudio();
    this.ensureRestaurantClownLaughAudio();
    this.ensureChaseMusicAudio();
    if (this.ctx) {
      this.preloadJumpscareBuffers();
      return;
    }
    try {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtxClass();

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.masterVolume, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.musicAnalyser = this.ctx.createAnalyser();
      this.musicAnalyser.fftSize = 64;
      this.musicAnalyser.smoothingTimeConstant = 0.78;
      this.musicAnalyser.connect(this.masterGain);
      this.musicAnalyserData = new Uint8Array(this.musicAnalyser.frequencyBinCount);

      this.preloadJumpscareBuffers();
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
    if (this.nightBgmAudio && this.nightMusicFadeRaf === null) {
      this.nightBgmAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.66);
    }
    if (this.clownJumpscareAudio) {
      this.clownJumpscareAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
    }
    if (this.night1ClownJumpscareAudio) {
      this.night1ClownJumpscareAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
    }
    if (this.windowClownLaughAudio) {
      this.windowClownLaughAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.95);
    }
    if (this.restaurantClownLaughAudio) {
      this.restaurantClownLaughAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.92);
    }
    if (this.chaseMusicAudio && !this.isChaseFadingOut) {
      this.chaseMusicAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.85);
    }
    if (this.activeChaseGain && this.ctx && !this.isChaseFadingOut) {
      this.activeChaseGain.gain.setTargetAtTime(
        this.isMuted ? 0 : 0.85,
        this.ctx.currentTime,
        0.04
      );
    }
    if (this.creditsMusicAudio && this.creditsFadeRaf === null) {
      this.creditsMusicAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.84);
    }
  }

  private playMusicEntrySwell(variant: 'night' | 'credits') {
    if (!this.ctx || !this.masterGain || this.isMuted) return;
    const now = this.ctx.currentTime;
    const dest = this.musicAnalyser || this.masterGain;
    const freqs = variant === 'credits' ? [110, 164.81, 220, 277.18] : [98, 146.83, 196];
    freqs.forEach((f, idx) => {
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = idx === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f, now);
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(variant === 'credits' ? 540 : 420, now);
      filter.frequency.linearRampToValueAtTime(variant === 'credits' ? 1150 : 780, now + 1.4);

      const peak = variant === 'credits' ? 0.055 : 0.04;
      gain.gain.setValueAtTime(0.0005, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.85);
      gain.gain.exponentialRampToValueAtTime(0.0005, now + 2.8);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(dest);
      osc.start(now);
      osc.stop(now + 2.85);
    });
  }

  public playNightMusic(night: 1 | 2 | 3) {
    const trackSrc =
      night === 1
        ? './assets/aistudio/YTDown.com_YouTube_Media_cRaXl6PPMNM_Cafe-Day-1-The-Closing-Shift-OST_001_720p_38821285.mp4'
        : './assets/aistudio/YTDown.com_YouTube_Media_53q2nB3kXz4_Cafe-Day-3-The-Closing-Shift-OST_001_720p_eb42c5ab.mp4';

    this.stopNightMusic();
    this.currentNightTrack = night;
    this.isMusicPaused = false;
    this.musicEntryStartedAt = performance.now();
    this.currentMusicTrackTitle =
      night === 1
        ? 'NIGHT 1 — THE CLOSING SHIFT OST'
        : `NIGHT ${night} — THE CLOSING SHIFT OST`;

    this.playMusicEntrySwell('night');

    const audio = new Audio(trackSrc);
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    this.nightBgmAudio = audio;

    const fadeStart = performance.now();
    const fadeInStep = (now: number) => {
      if (this.nightBgmAudio !== audio || this.isMusicPaused) {
        this.nightMusicFadeRaf = null;
        return;
      }
      const p = Math.min(1, (now - fadeStart) / 2200);
      const targetVol = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.66);
      audio.volume = targetVol * p;
      if (p < 1) {
        this.nightMusicFadeRaf = requestAnimationFrame(fadeInStep);
      } else {
        this.nightMusicFadeRaf = null;
      }
    };

    const tryPlay = () => {
      if (this.nightBgmAudio !== audio || this.isMusicPaused) return;
      audio
        .play()
        .then(() => {
          this.nightMusicFadeRaf = requestAnimationFrame(fadeInStep);
        })
        .catch(() => {
          const retry = () => {
            window.removeEventListener('pointerdown', retry);
            window.removeEventListener('keydown', retry);
            if (this.nightBgmAudio === audio && !this.isMusicPaused) {
              audio
                .play()
                .then(() => {
                  this.nightMusicFadeRaf = requestAnimationFrame(fadeInStep);
                })
                .catch(() => {});
            }
          };
          window.addEventListener('pointerdown', retry, { once: true });
          window.addEventListener('keydown', retry, { once: true });
        });
    };
    tryPlay();
  }

  public setNightMusicPaused(paused: boolean) {
    this.isMusicPaused = paused;
    if (!this.nightBgmAudio) return;
    if (paused) {
      if (this.nightMusicFadeRaf !== null) {
        cancelAnimationFrame(this.nightMusicFadeRaf);
        this.nightMusicFadeRaf = null;
      }
      this.nightBgmAudio.pause();
    } else {
      this.nightBgmAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.66);
      this.nightBgmAudio.play().catch(() => {});
    }
  }

  public stopNightMusic() {
    if (this.nightMusicFadeRaf !== null) {
      cancelAnimationFrame(this.nightMusicFadeRaf);
      this.nightMusicFadeRaf = null;
    }
    this.currentNightTrack = null;
    this.isMusicPaused = false;
    if (this.nightBgmAudio) {
      try {
        this.nightBgmAudio.pause();
        this.nightBgmAudio.currentTime = 0;
        this.nightBgmAudio.src = '';
      } catch (e) {}
      this.nightBgmAudio = null;
    }
  }

  public playCreditsMusic() {
    this.stopNightMusic();
    this.stopChaseMusic();
    this.stopCreditsMusic();
    this.init();
    this.resume();

    this.isCreditsMusicPlaying = true;
    this.musicEntryStartedAt = performance.now();
    this.currentMusicTrackTitle = 'AFTER THE MACHINE STOPS — CREDITS THEME';
    this.playMusicEntrySwell('credits');

    const audio = new Audio('./assets/aistudio/after_the_machine_stops_ee49b18a.mp3');
    audio.loop = true;
    audio.volume = 0;
    audio.preload = 'auto';
    this.creditsMusicAudio = audio;

    const fadeStart = performance.now();
    const fadeStep = (now: number) => {
      if (this.creditsMusicAudio !== audio || !this.isCreditsMusicPlaying) {
        this.creditsFadeRaf = null;
        return;
      }
      const p = Math.min(1, (now - fadeStart) / 2000);
      const targetVol = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.84);
      audio.volume = targetVol * p;
      if (p < 1) {
        this.creditsFadeRaf = requestAnimationFrame(fadeStep);
      } else {
        this.creditsFadeRaf = null;
      }
    };

    const startAudio = () => {
      if (this.creditsMusicAudio !== audio) return;
      audio
        .play()
        .then(() => {
          this.creditsFadeRaf = requestAnimationFrame(fadeStep);
        })
        .catch(() => {
          const retry = () => {
            window.removeEventListener('pointerdown', retry);
            window.removeEventListener('keydown', retry);
            if (this.creditsMusicAudio === audio && this.isCreditsMusicPlaying) {
              audio
                .play()
                .then(() => {
                  this.creditsFadeRaf = requestAnimationFrame(fadeStep);
                })
                .catch(() => {});
            }
          };
          window.addEventListener('pointerdown', retry, { once: true });
          window.addEventListener('keydown', retry, { once: true });
        });
    };
    startAudio();
  }

  public stopCreditsMusic() {
    if (this.creditsFadeRaf !== null) {
      cancelAnimationFrame(this.creditsFadeRaf);
      this.creditsFadeRaf = null;
    }
    this.isCreditsMusicPlaying = false;
    if (this.creditsMusicAudio) {
      try {
        this.creditsMusicAudio.pause();
        this.creditsMusicAudio.currentTime = 0;
        this.creditsMusicAudio.src = '';
      } catch (e) {}
      this.creditsMusicAudio = null;
    }
  }

  public playChaseMusic() {
    if (this.chaseFadeRaf !== null) {
      cancelAnimationFrame(this.chaseFadeRaf);
      this.chaseFadeRaf = null;
    }
    this.isChaseFadingOut = false;
    this.isChasePaused = false;
    this.isChasePlaying = true;
    this.musicEntryStartedAt = performance.now();
    this.currentMusicTrackTitle = 'CLOWN PURSUIT — RUN!';
    this.init();
    this.resume();

    if (this.ctx && this.masterGain && this.chaseMusicBuffer) {
      try {
        if (this.activeChaseSource) {
          this.activeChaseSource.stop();
          this.activeChaseSource.disconnect();
          this.activeChaseSource = null;
        }
        const now = this.ctx.currentTime;
        const src = this.ctx.createBufferSource();
        const gain = this.ctx.createGain();
        src.buffer = this.chaseMusicBuffer;
        src.loop = true;
        src.loopStart = Math.min(this.chaseMusicStartOffset, Math.max(0, this.chaseMusicBuffer.duration - 0.5));
        src.loopEnd = this.chaseMusicBuffer.duration;
        gain.gain.setValueAtTime(0.01, now);
        gain.gain.linearRampToValueAtTime(this.isMuted ? 0 : 0.88, now + 0.14);
        src.connect(gain);
        gain.connect(this.musicAnalyser || this.masterGain);
        src.start(now, this.chaseMusicStartOffset);
        this.activeChaseSource = src;
        this.activeChaseGain = gain;
        return;
      } catch (e) {}
    }

    const audio = this.ensureChaseMusicAudio();
    if (!audio) return;
    try {
      audio.currentTime = this.chaseMusicStartOffset || 0.28;
    } catch (e) {}
    audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.85);
    audio.play().catch(() => {});
  }

  public setChaseMusicPaused(paused: boolean) {
    this.isChasePaused = paused;
    if (this.activeChaseGain && this.ctx && !this.isChaseFadingOut) {
      this.activeChaseGain.gain.setTargetAtTime(
        paused || this.isMuted ? 0 : 0.88,
        this.ctx.currentTime,
        0.04
      );
    }
    if (!this.chaseMusicAudio) return;
    if (paused) {
      this.chaseMusicAudio.pause();
    } else if (!this.isChaseFadingOut && this.isChasePlaying && !this.activeChaseSource) {
      this.chaseMusicAudio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.85);
      this.chaseMusicAudio.play().catch(() => {});
    }
  }

  public fadeOutChaseMusic(durationSec: number = 2.4) {
    if (this.chaseFadeRaf !== null) {
      cancelAnimationFrame(this.chaseFadeRaf);
      this.chaseFadeRaf = null;
    }
    if (this.activeChaseGain && this.activeChaseSource && this.ctx) {
      this.isChaseFadingOut = true;
      const now = this.ctx.currentTime;
      const dur = Math.max(0.4, durationSec);
      const srcToStop = this.activeChaseSource;
      try {
        this.activeChaseGain.gain.cancelScheduledValues(now);
        this.activeChaseGain.gain.setValueAtTime(this.activeChaseGain.gain.value, now);
        this.activeChaseGain.gain.linearRampToValueAtTime(0.0001, now + dur);
      } catch (e) {}
      window.setTimeout(() => {
        if (this.activeChaseSource === srcToStop) {
          this.stopChaseMusic();
        }
      }, dur * 1000 + 60);
      return;
    }

    const audio = this.chaseMusicAudio;
    if (!audio || audio.paused) {
      this.stopChaseMusic();
      return;
    }
    this.isChaseFadingOut = true;
    const startVol = audio.volume;
    const startTime = performance.now();
    const durationMs = Math.max(400, durationSec * 1000);

    const step = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / durationMs);
      if (this.chaseMusicAudio === audio && this.isChaseFadingOut) {
        audio.volume = Math.max(0, startVol * (1 - t));
      }
      if (t < 1 && this.isChaseFadingOut) {
        this.chaseFadeRaf = requestAnimationFrame(step);
      } else {
        this.chaseFadeRaf = null;
        this.isChaseFadingOut = false;
        this.isChasePlaying = false;
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) {}
      }
    };

    this.chaseFadeRaf = requestAnimationFrame(step);
  }

  public stopChaseMusic() {
    if (this.chaseFadeRaf !== null) {
      cancelAnimationFrame(this.chaseFadeRaf);
      this.chaseFadeRaf = null;
    }
    this.isChaseFadingOut = false;
    this.isChasePaused = false;
    this.isChasePlaying = false;
    if (this.activeChaseSource) {
      try {
        this.activeChaseSource.stop();
        this.activeChaseSource.disconnect();
      } catch (e) {}
      this.activeChaseSource = null;
      this.activeChaseGain = null;
    }
    if (this.chaseMusicAudio) {
      try {
        this.chaseMusicAudio.pause();
        this.chaseMusicAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  public getMusicVisualizerState(barCount: number = 16): {
    active: boolean;
    mode: 'none' | 'night' | 'chase' | 'credits';
    trackTitle: string;
    entryBannerAlpha: number;
    bars: number[];
    intensity: number;
  } {
    const now = performance.now();
    const isNightPlaying =
      !!this.nightBgmAudio && !this.nightBgmAudio.paused && !this.isMusicPaused;
    const isChaseActive =
      this.isChasePlaying &&
      !this.isChasePaused &&
      (!!this.activeChaseSource ||
        (!!this.chaseMusicAudio && !this.chaseMusicAudio.paused));
    const isCreditsActive =
      this.isCreditsMusicPlaying &&
      !!this.creditsMusicAudio &&
      !this.creditsMusicAudio.paused;

    const mode: 'none' | 'night' | 'chase' | 'credits' = isChaseActive
      ? 'chase'
      : isCreditsActive
      ? 'credits'
      : isNightPlaying
      ? 'night'
      : 'none';

    if (mode === 'none' || this.isMuted || this.masterVolume <= 0.01) {
      return {
        active: false,
        mode: 'none',
        trackTitle: '',
        entryBannerAlpha: 0,
        bars: new Array(barCount).fill(0),
        intensity: 0,
      };
    }

    const elapsedSinceEntry = Math.max(0, (now - this.musicEntryStartedAt) / 1000);
    const entryBannerAlpha =
      elapsedSinceEntry < 0.5
        ? elapsedSinceEntry / 0.5
        : elapsedSinceEntry < 5.5
        ? 1
        : elapsedSinceEntry < 7.0
        ? Math.max(0, 1 - (elapsedSinceEntry - 5.5) / 1.5)
        : 0;

    let analyserMax = 0;
    if (this.musicAnalyser && this.musicAnalyserData) {
      this.musicAnalyser.getByteFrequencyData(this.musicAnalyserData);
      for (let i = 0; i < this.musicAnalyserData.length; i++) {
        if (this.musicAnalyserData[i] > analyserMax) {
          analyserMax = this.musicAnalyserData[i];
        }
      }
    }

    const t =
      mode === 'credits' && this.creditsMusicAudio
        ? this.creditsMusicAudio.currentTime
        : mode === 'night' && this.nightBgmAudio
        ? this.nightBgmAudio.currentTime
        : now / 1000;

    const tempo = mode === 'chase' ? 6.2 : mode === 'credits' ? 2.4 : 1.75;
    const bars: number[] = [];
    let sum = 0;
    for (let i = 0; i < barCount; i++) {
      const bandPos = i / Math.max(1, barCount - 1);
      const pulseA = 0.5 + 0.5 * Math.sin(t * tempo * Math.PI + i * 0.72);
      const pulseB = 0.5 + 0.5 * Math.cos(t * (tempo * 1.61) * Math.PI - i * 0.48);
      const subBeat = 0.5 + 0.5 * Math.sin(t * tempo * 0.5 * Math.PI + bandPos * 2.1);
      let v = 0.16 + 0.52 * pulseA * (0.45 + 0.55 * pulseB) + 0.24 * subBeat;

      if (analyserMax > 6 && this.musicAnalyserData) {
        const binIdx = Math.min(
          this.musicAnalyserData.length - 1,
          Math.floor(bandPos * (this.musicAnalyserData.length * 0.7))
        );
        const fftVal = this.musicAnalyserData[binIdx] / 255;
        v = Math.max(v * 0.55, fftVal * 0.95 + 0.12);
      }

      const clamped = Math.max(0.08, Math.min(1, v * (0.6 + 0.4 * this.masterVolume)));
      bars.push(clamped);
      sum += clamped;
    }

    return {
      active: true,
      mode,
      trackTitle: this.currentMusicTrackTitle,
      entryBannerAlpha,
      bars,
      intensity: sum / barCount,
    };
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
   * Randomized wooden-floor creak synthesizer (6 distinct non-repeating profiles).
   * Adapts acoustic pitch, duration, wood-grain stick-slip texture, and stress snaps
   * to both movement speed (creeping crouch vs normal walk vs panic sprint)
   * and interior restaurant location.
   */
  private playRandomizedWoodCreak(
    location: RestaurantFloorZone,
    moveSpeed: number,
    isSprinting: boolean,
    isCrouched: boolean,
    destination: AudioNode,
    now: number
  ) {
    if (!this.ctx || location === 'outdoor') return;

    // Zone-based creak likelihood & resonant character
    const zoneProfile: Record<
      Exclude<RestaurantFloorZone, 'outdoor'>,
      { probWalk: number; probCrouch: number; probSprint: number; pitchMul: number; gainMul: number; resonanceHz: number }
    > = {
      warehouse: { probWalk: 0.65, probCrouch: 0.78, probSprint: 0.92, pitchMul: 0.78, gainMul: 1.25, resonanceHz: 340 },
      booths: { probWalk: 0.52, probCrouch: 0.68, probSprint: 0.82, pitchMul: 0.92, gainMul: 1.05, resonanceHz: 460 },
      office: { probWalk: 0.46, probCrouch: 0.6, probSprint: 0.75, pitchMul: 1.12, gainMul: 0.95, resonanceHz: 560 },
      restroom: { probWalk: 0.38, probCrouch: 0.5, probSprint: 0.68, pitchMul: 0.86, gainMul: 0.9, resonanceHz: 410 },
      lobby: { probWalk: 0.34, probCrouch: 0.45, probSprint: 0.66, pitchMul: 1.0, gainMul: 0.85, resonanceHz: 510 },
      kitchen: { probWalk: 0.18, probCrouch: 0.24, probSprint: 0.42, pitchMul: 0.82, gainMul: 0.65, resonanceHz: 380 },
    };

    const profile = zoneProfile[location];
    const isSlowCreep = isCrouched || moveSpeed < 2.2;
    const isFastStep = isSprinting || moveSpeed >= 3.6;

    const triggerProb = isFastStep
      ? profile.probSprint
      : isSlowCreep
      ? profile.probCrouch
      : profile.probWalk;

    if (Math.random() > triggerProb) return;

    // Pick a creak variant (0..5) guaranteed different from the previous one
    let variant = Math.floor(Math.random() * 6);
    if (variant === this.lastWoodCreakVariant) {
      variant = (variant + 1 + Math.floor(Math.random() * 5)) % 6;
    }
    this.lastWoodCreakVariant = variant;

    const speedRatio = Math.max(0.5, Math.min(2.0, moveSpeed / 2.8));
    const jitter = 0.88 + Math.random() * 0.24;
    const pitchScale = profile.pitchMul * jitter * (isFastStep ? 1.18 : isSlowCreep ? 0.84 : 1.0);
    const volScale =
      profile.gainMul *
      (isFastStep ? 0.085 : isSlowCreep ? 0.048 : 0.058) *
      (0.85 + Math.random() * 0.3);

    // Slow crouch stretches floorboard bend; fast chase shortens into sharp stress groan
    const duration = isFastStep
      ? (0.09 + Math.random() * 0.07)
      : isSlowCreep
      ? (0.28 + Math.random() * 0.22)
      : (0.16 + Math.random() * 0.12);

    const startDelay = isSlowCreep ? 0.015 + Math.random() * 0.035 : Math.random() * 0.012;
    const t0 = now + startDelay;

    const woodFilter = this.ctx.createBiquadFilter();
    woodFilter.type = 'bandpass';
    woodFilter.frequency.setValueAtTime(profile.resonanceHz * pitchScale, t0);
    woodFilter.Q.setValueAtTime(variant === 2 || variant === 5 ? 6.5 : 4.2, t0);

    const creakGain = this.ctx.createGain();
    creakGain.gain.setValueAtTime(0.0001, t0);
    creakGain.gain.linearRampToValueAtTime(volScale, t0 + Math.min(0.035, duration * 0.22));
    creakGain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);

    woodFilter.connect(creakGain);
    creakGain.connect(destination);

    // Wood stick-slip groan oscillator
    const groanOsc = this.ctx.createOscillator();
    const lfoOsc = this.ctx.createOscillator();
    const lfoGain = this.ctx.createGain();

    // 6 distinct wooden floorboard timbres:
    // 0: Long bending joist sag (pitch drops smoothly)
    // 1: High dry plank squeak (upward stick-slip bend)
    // 2: Ratcheting double-creak (two-stage bend & settle)
    // 3: Deep hollow floorboard groan (low resonant sub-wood)
    // 4: Sharp nail-pop & splinter shift (fast pitch whip + micro snap)
    // 5: Tense slow grain-chatter (heavy LFO flutter along board friction)
    groanOsc.type = variant === 1 || variant === 4 ? 'sawtooth' : 'triangle';

    if (variant === 0) {
      const fStart = 185 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.exponentialRampToValueAtTime(Math.max(55, fStart * 0.54), t0 + duration);
      lfoOsc.frequency.setValueAtTime(22 * speedRatio, t0);
      lfoGain.gain.setValueAtTime(18, t0);
    } else if (variant === 1) {
      const fStart = 310 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.exponentialRampToValueAtTime(fStart * 1.38, t0 + duration * 0.55);
      groanOsc.frequency.exponentialRampToValueAtTime(fStart * 0.92, t0 + duration);
      lfoOsc.frequency.setValueAtTime(34, t0);
      lfoGain.gain.setValueAtTime(26, t0);
    } else if (variant === 2) {
      const fStart = 230 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.setValueAtTime(fStart * 1.24, t0 + duration * 0.42);
      groanOsc.frequency.exponentialRampToValueAtTime(Math.max(60, fStart * 0.68), t0 + duration);
      lfoOsc.frequency.setValueAtTime(28, t0);
      lfoGain.gain.setValueAtTime(22, t0);
    } else if (variant === 3) {
      const fStart = 128 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.exponentialRampToValueAtTime(Math.max(42, fStart * 0.58), t0 + duration);
      lfoOsc.frequency.setValueAtTime(16 * speedRatio, t0);
      lfoGain.gain.setValueAtTime(14, t0);
    } else if (variant === 4) {
      const fStart = 420 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.exponentialRampToValueAtTime(135 * pitchScale, t0 + duration);
      lfoOsc.frequency.setValueAtTime(42, t0);
      lfoGain.gain.setValueAtTime(32, t0);
    } else {
      const fStart = 205 * pitchScale;
      groanOsc.frequency.setValueAtTime(fStart, t0);
      groanOsc.frequency.exponentialRampToValueAtTime(fStart * 0.82, t0 + duration);
      lfoOsc.frequency.setValueAtTime(isSlowCreep ? 19 : 36, t0);
      lfoGain.gain.setValueAtTime(38, t0);
    }

    lfoOsc.type = 'sawtooth';
    lfoOsc.connect(lfoGain);
    lfoGain.connect(groanOsc.frequency);
    groanOsc.connect(woodFilter);

    lfoOsc.start(t0);
    groanOsc.start(t0);
    lfoOsc.stop(t0 + duration + 0.02);
    groanOsc.stop(t0 + duration + 0.02);

    // Add a crisp dry wood stress snap when moving fast or on variants 2 / 4
    if (isFastStep || variant === 2 || variant === 4) {
      const snapDelay = isFastStep ? 0.004 : duration * 0.36;
      const tSnap = t0 + snapDelay;
      const snapDur = 0.024;
      const snapBuf = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * snapDur), this.ctx.sampleRate);
      const data = snapBuf.getChannelData(0);
      for (let i = 0; i < data.length; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (data.length * 0.22));
      }
      const snapSrc = this.ctx.createBufferSource();
      snapSrc.buffer = snapBuf;

      const snapFilter = this.ctx.createBiquadFilter();
      snapFilter.type = 'bandpass';
      snapFilter.frequency.setValueAtTime((1150 + Math.random() * 550) * profile.pitchMul, tSnap);
      snapFilter.Q.setValueAtTime(2.6, tSnap);

      const snapGain = this.ctx.createGain();
      snapGain.gain.setValueAtTime(volScale * (isFastStep ? 0.95 : 0.65), tSnap);
      snapGain.gain.exponentialRampToValueAtTime(0.0001, tSnap + snapDur);

      snapSrc.connect(snapFilter);
      snapFilter.connect(snapGain);
      snapGain.connect(destination);
      snapSrc.start(tSnap);
    }
  }

  /**
   * Positional footstep audio trigger with distinctive surface characteristics,
   * speed-adaptive intensity, and randomized interior wooden-floor creak samples:
   * - Tile: Crisp, hard ceramic click and resonant slap (+ subtle subfloor creaks)
   * - Carpet: Muffled, cushioned low-frequency thud (+ booth/office floorboard creaks)
   * - Asphalt / Concrete: Gritty gravel crunch and solid pavement impact
   * - Grass: Soft leafy rustle and organic soil compression
   * With stereo / positional panning between left and right feet.
   */
  public playFootstep(
    surface: 'tile' | 'carpet' | 'asphalt' | 'grass' = 'tile',
    isSprinting: boolean = false,
    isCrouched: boolean = false,
    pan: number = 0,
    location: RestaurantFloorZone = 'outdoor',
    moveSpeed: number = 2.8
  ) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const pitchJitter = 0.9 + Math.random() * 0.2;

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
      const baseFreq = (isCrouched ? 55 : isSprinting ? 80 : 68) * pitchJitter;
      osc.frequency.setValueAtTime(baseFreq, now);
      osc.frequency.exponentialRampToValueAtTime(24, now + 0.16);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140 * pitchJitter, now);

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
      const oscClick = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      const clickFilter = this.ctx.createBiquadFilter();

      oscClick.type = 'triangle';
      oscClick.frequency.setValueAtTime((isSprinting ? 1800 : 1450) * pitchJitter, now);
      oscClick.frequency.exponentialRampToValueAtTime(280, now + 0.035);

      clickFilter.type = 'bandpass';
      clickFilter.frequency.value = 1600 * pitchJitter;
      clickFilter.Q.value = 2.2;

      const clickVol = isCrouched ? 0.025 : isSprinting ? 0.12 : 0.065;
      clickGain.gain.setValueAtTime(clickVol, now);
      clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      oscClick.connect(clickFilter);
      clickFilter.connect(clickGain);
      clickGain.connect(footstepGain);
      oscClick.start(now);
      oscClick.stop(now + 0.05);

      // Body heel thump
      const oscThump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      oscThump.type = 'sine';
      oscThump.frequency.setValueAtTime((isSprinting ? 110 : 92) * pitchJitter, now);
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
      noiseFilter.frequency.value = 750 * pitchJitter;
      noiseFilter.Q.value = 1.4;

      const noiseGain = this.ctx.createGain();
      const gritVol = isCrouched ? 0.03 : isSprinting ? 0.14 : 0.075;
      noiseGain.gain.setValueAtTime(gritVol, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.075);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(footstepGain);
      noise.start(now);

      const osc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(80 * pitchJitter, now);
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
      filter.frequency.value = 600 * pitchJitter;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(isSprinting ? 0.12 : 0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(footstepGain);
      noise.start(now);
    }

    // Trigger randomized wooden-floor creaks when inside the McDonald's building
    if (location !== 'outdoor') {
      const creakDest = panner ?? this.masterGain;
      this.playRandomizedWoodCreak(location, moveSpeed, isSprinting, isCrouched, creakDest, now);
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

  /** Layered plastic trash bag crinkle and rustle when picking up garbage bags */
  public playTrashBagRustle() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const bursts = [
      { offset: 0.0, dur: 0.14, freq: 2400, gain: 0.22 },
      { offset: 0.09, dur: 0.16, freq: 3400, gain: 0.26 },
      { offset: 0.21, dur: 0.19, freq: 2800, gain: 0.19 },
    ];

    bursts.forEach((b) => {
      if (!this.ctx || !this.masterGain) return;
      const start = now + b.offset;
      const len = Math.floor(this.ctx.sampleRate * b.dur);
      const buffer = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);

      let prev = 0;
      for (let i = 0; i < len; i++) {
        const white = Math.random() * 2 - 1;
        // Sharp crackle spikes characteristic of stiff polyethylene trash bag film
        const spike = Math.random() < 0.09 ? (Math.random() * 2 - 1) * 1.9 : white * 0.55;
        const hp = spike - prev * 0.65;
        prev = spike;
        const env = Math.sin((i / len) * Math.PI);
        data[i] = hp * env;
      }

      const src = this.ctx.createBufferSource();
      src.buffer = buffer;

      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.setValueAtTime(b.freq, start);
      bp.frequency.exponentialRampToValueAtTime(b.freq * 0.72, start + b.dur);
      bp.Q.value = 1.35;

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.001, start);
      gain.gain.linearRampToValueAtTime(b.gain, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + b.dur);

      src.connect(bp);
      bp.connect(gain);
      gain.connect(this.masterGain);
      src.start(start);
    });
  }

  /** Crisp tactile pop sound for clicking interactive UI cells */
  public playUICellPop() {
    this.init();
    this.resume();
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(520, now);
    osc.frequency.exponentialRampToValueAtTime(980, now + 0.045);

    gain.gain.setValueAtTime(0.09, now);
    gain.gain.exponentialRampToValueAtTime(0.0008, now + 0.065);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now);
    osc.stop(now + 0.07);
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

  public playPowerOutage() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 0. Sharp electrical bulb/arc POP right as the lights cut out
    const popOsc = this.ctx.createOscillator();
    const popGain = this.ctx.createGain();
    popOsc.type = 'triangle';
    popOsc.frequency.setValueAtTime(1950, now);
    popOsc.frequency.exponentialRampToValueAtTime(160, now + 0.065);
    popGain.gain.setValueAtTime(0.55, now);
    popGain.gain.exponentialRampToValueAtTime(0.001, now + 0.085);
    popOsc.connect(popGain);
    popGain.connect(this.masterGain);
    popOsc.start(now);
    popOsc.stop(now + 0.09);

    // High-frequency spark snap transient for the bulb pop
    const sparkLen = Math.floor(this.ctx.sampleRate * 0.06);
    const sparkBuf = this.ctx.createBuffer(1, sparkLen, this.ctx.sampleRate);
    const sparkData = sparkBuf.getChannelData(0);
    for (let i = 0; i < sparkLen; i++) {
      sparkData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (sparkLen * 0.16));
    }
    const sparkSrc = this.ctx.createBufferSource();
    sparkSrc.buffer = sparkBuf;
    const sparkHp = this.ctx.createBiquadFilter();
    sparkHp.type = 'bandpass';
    sparkHp.frequency.value = 2400;
    sparkHp.Q.value = 1.2;
    const sparkGain = this.ctx.createGain();
    sparkGain.gain.setValueAtTime(0.45, now);
    sparkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    sparkSrc.connect(sparkHp);
    sparkHp.connect(sparkGain);
    sparkGain.connect(this.masterGain);
    sparkSrc.start(now);

    // 1. Heavy main breaker trip clunk
    const noiseLen = Math.floor(this.ctx.sampleRate * 0.14);
    const noiseBuf = this.ctx.createBuffer(1, noiseLen, this.ctx.sampleRate);
    const data = noiseBuf.getChannelData(0);
    for (let i = 0; i < noiseLen; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (noiseLen * 0.28));
    }
    const clunk = this.ctx.createBufferSource();
    clunk.buffer = noiseBuf;
    const clunkFilter = this.ctx.createBiquadFilter();
    clunkFilter.type = 'lowpass';
    clunkFilter.frequency.value = 340;
    const clunkGain = this.ctx.createGain();
    clunkGain.gain.setValueAtTime(0.42, now + 0.03);
    clunkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.19);
    clunk.connect(clunkFilter);
    clunkFilter.connect(clunkGain);
    clunkGain.connect(this.masterGain);
    clunk.start(now + 0.03);

    // 2. Downward power-down electrical transformer whine
    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(240, now + 0.04);
    osc.frequency.exponentialRampToValueAtTime(32, now + 1.38);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.setValueAtTime(600, now + 0.04);
    lp.frequency.exponentialRampToValueAtTime(90, now + 1.38);

    oscGain.gain.setValueAtTime(0.24, now + 0.04);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 1.42);

    osc.connect(lp);
    lp.connect(oscGain);
    oscGain.connect(this.masterGain);
    osc.start(now + 0.04);
    osc.stop(now + 1.48);
  }

  public playToiletFlush() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Chrome handle clink
    const clink = this.ctx.createOscillator();
    const clinkGain = this.ctx.createGain();
    clink.type = 'triangle';
    clink.frequency.setValueAtTime(1150, now);
    clink.frequency.exponentialRampToValueAtTime(420, now + 0.06);
    clinkGain.gain.setValueAtTime(0.16, now);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    clink.connect(clinkGain);
    clinkGain.connect(this.masterGain);
    clink.start(now);
    clink.stop(now + 0.09);

    // Swirling water flush rush (filtered noise)
    const duration = 2.4;
    const len = Math.floor(this.ctx.sampleRate * duration);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = Math.random() * 2 - 1;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(950, now + 0.05);
    bp.frequency.exponentialRampToValueAtTime(320, now + 1.6);
    bp.frequency.exponentialRampToValueAtTime(620, now + 2.3);
    bp.Q.value = 1.1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now + 0.05);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);
    src.start(now + 0.05);
  }

  public playPowerRestore() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Metallic breaker throw snap
    const snap = this.ctx.createOscillator();
    const snapGain = this.ctx.createGain();
    snap.type = 'square';
    snap.frequency.setValueAtTime(380, now);
    snap.frequency.exponentialRampToValueAtTime(140, now + 0.08);
    snapGain.gain.setValueAtTime(0.26, now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
    snap.connect(snapGain);
    snapGain.connect(this.masterGain);
    snap.start(now);
    snap.stop(now + 0.1);

    // 2. Ascending electrical grid hum / ballast startup
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(60, now + 0.06);
    osc.frequency.exponentialRampToValueAtTime(125, now + 0.55);
    gain.gain.setValueAtTime(0.02, now + 0.06);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.25);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.95);

    osc.connect(gain);
    gain.connect(this.masterGain);
    osc.start(now + 0.06);
    osc.stop(now + 1.0);
  }

  public playClownSpottedScare() {
    if (this.ctx && this.masterGain && this.clownJumpscareBuffer) {
      if (this.ctx.state === 'suspended') {
        void this.ctx.resume();
      }
      const src = this.ctx.createBufferSource();
      src.buffer = this.clownJumpscareBuffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 1.15, this.ctx.currentTime);
      src.connect(gain);
      gain.connect(this.masterGain);
      src.start(0, this.clownJumpscareStartOffset);
      return;
    }

    const audio = this.ensureClownJumpscareAudio();
    if (!audio) return;
    audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
    const startPlay = () => {
      try {
        audio.currentTime = this.clownJumpscareStartOffset;
      } catch (e) {}
      audio.play().catch(() => {});
    };
    if (audio.readyState >= 1) {
      startPlay();
    } else {
      audio.addEventListener('loadedmetadata', startPlay, { once: true });
    }
  }

  public playNight1ClownJumpscare() {
    this.resume();
    if (this.ctx && this.masterGain && this.night1JumpscareBuffer) {
      const src = this.ctx.createBufferSource();
      src.buffer = this.night1JumpscareBuffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 1.18, this.ctx.currentTime);
      src.connect(gain);
      gain.connect(this.masterGain);
      src.start(0, this.night1JumpscareStartOffset);
      return;
    }

    const audio = this.ensureNight1ClownJumpscareAudio();
    if (!audio) return;
    audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.98);
    const startPlay = () => {
      try {
        audio.currentTime = this.night1JumpscareStartOffset;
      } catch (e) {}
      audio.play().catch(() => {});
    };
    if (audio.readyState >= 1) {
      startPlay();
    } else {
      audio.addEventListener('loadedmetadata', startPlay, { once: true });
    }
  }

  public stopClownLaughs() {
    this.isRestaurantLaughPlaying = false;
    if (this.activeWindowLaughSource) {
      try {
        this.activeWindowLaughSource.stop();
      } catch (e) {}
      this.activeWindowLaughSource = null;
    }
    if (this.activeRestaurantLaughSource) {
      try {
        this.activeRestaurantLaughSource.stop();
      } catch (e) {}
      this.activeRestaurantLaughSource = null;
    }
    if (this.windowClownLaughAudio) {
      try {
        this.windowClownLaughAudio.pause();
        this.windowClownLaughAudio.currentTime = 0;
      } catch (e) {}
    }
    if (this.restaurantClownLaughAudio) {
      try {
        this.restaurantClownLaughAudio.pause();
        this.restaurantClownLaughAudio.currentTime = 0;
      } catch (e) {}
    }
  }

  /**
   * Second uploaded video: scary clown laugh when the clown starts laughing inside the restaurant on Night 3.
   */
  public playEerieClownLaugh() {
    if (this.isRestaurantLaughPlaying) return;
    this.resume();
    this.isRestaurantLaughPlaying = true;

    if (this.ctx && this.masterGain && this.restaurantClownLaughBuffer) {
      if (this.activeRestaurantLaughSource) {
        try {
          this.activeRestaurantLaughSource.stop();
        } catch (e) {}
      }
      const src = this.ctx.createBufferSource();
      src.buffer = this.restaurantClownLaughBuffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 1.05, this.ctx.currentTime);
      src.connect(gain);
      gain.connect(this.masterGain);
      src.onended = () => {
        if (this.activeRestaurantLaughSource === src) {
          this.activeRestaurantLaughSource = null;
          this.isRestaurantLaughPlaying = false;
        }
      };
      this.activeRestaurantLaughSource = src;
      src.start(0, this.restaurantClownLaughStartOffset);
      return;
    }

    const audio = this.ensureRestaurantClownLaughAudio();
    if (!audio) {
      this.isRestaurantLaughPlaying = false;
      return;
    }
    audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.92);
    const startPlay = () => {
      try {
        audio.currentTime = this.restaurantClownLaughStartOffset;
      } catch (e) {}
      audio.play().catch(() => {
        this.isRestaurantLaughPlaying = false;
      });
    };
    if (audio.readyState >= 1) {
      startPlay();
    } else {
      audio.addEventListener('loadedmetadata', startPlay, { once: true });
    }
  }

  public playBathroomKnock() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // 4 hollow wooden restroom door/stall knocks coming from the left (-0.55 pan)
    const offsets = [0, 0.24, 0.48, 0.78];
    offsets.forEach((offset, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + offset;
      const thump = this.ctx.createOscillator();
      const thumpGain = this.ctx.createGain();
      thump.type = 'triangle';
      const baseFreq = idx === 3 ? 115 : 132 - idx * 4;
      thump.frequency.setValueAtTime(baseFreq, t);
      thump.frequency.exponentialRampToValueAtTime(48, t + 0.14);

      thumpGain.gain.setValueAtTime(0.36, t);
      thumpGain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      // Short woody click transient
      const woodLen = Math.floor(this.ctx.sampleRate * 0.04);
      const woodBuf = this.ctx.createBuffer(1, woodLen, this.ctx.sampleRate);
      const d = woodBuf.getChannelData(0);
      for (let i = 0; i < woodLen; i++) {
        d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (woodLen * 0.25));
      }
      const woodSrc = this.ctx.createBufferSource();
      woodSrc.buffer = woodBuf;
      const bp = this.ctx.createBiquadFilter();
      bp.type = 'bandpass';
      bp.frequency.value = 520;
      bp.Q.value = 2.2;
      const woodGain = this.ctx.createGain();
      woodGain.gain.setValueAtTime(0.28, t);
      woodGain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

      const panner = this.ctx.createStereoPanner();
      panner.pan.value = -0.5;

      thump.connect(thumpGain);
      thumpGain.connect(panner);
      woodSrc.connect(bp);
      bp.connect(woodGain);
      woodGain.connect(panner);
      panner.connect(this.masterGain);

      thump.start(t);
      thump.stop(t + 0.18);
      woodSrc.start(t);
    });
  }

  public playFreezerPickup() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Cold stainless steel tray clink
    const clink = this.ctx.createOscillator();
    const clinkGain = this.ctx.createGain();
    clink.type = 'sine';
    clink.frequency.setValueAtTime(1480, now);
    clink.frequency.exponentialRampToValueAtTime(860, now + 0.12);
    clinkGain.gain.setValueAtTime(0.18, now);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    clink.connect(clinkGain);
    clinkGain.connect(this.masterGain);
    clink.start(now);
    clink.stop(now + 0.16);

    // Brief cold air whoosh from walk-in freezer
    const len = Math.floor(this.ctx.sampleRate * 0.28);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.45));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 1800;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.12, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.26);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.masterGain);
    src.start(now);
  }

  public playDriveThruChime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    // Crisp drive-thru headset arrival chime (2 tones)
    const tones = [987.77, 1318.51];
    tones.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + idx * 0.14;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.18, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.26);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.28);
    });
  }

  public playStore67Chime() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const notes = [1046.5, 1318.51]; // C6 -> E6 bright convenience store entrance chime
    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + idx * 0.16;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.48);
    });
  }

  public playCarDoorAndEngine() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // Solid car door close thud
    const door = this.ctx.createOscillator();
    const doorGain = this.ctx.createGain();
    door.type = 'triangle';
    door.frequency.setValueAtTime(115, now);
    door.frequency.exponentialRampToValueAtTime(34, now + 0.16);
    doorGain.gain.setValueAtTime(0.32, now);
    doorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    door.connect(doorGain);
    doorGain.connect(this.masterGain);
    door.start(now);
    door.stop(now + 0.24);

    // Ignition crank & warm idle purr
    const engine = this.ctx.createOscillator();
    const engGain = this.ctx.createGain();
    engine.type = 'sawtooth';
    engine.frequency.setValueAtTime(48, now + 0.24);
    engine.frequency.linearRampToValueAtTime(86, now + 0.55);
    engine.frequency.exponentialRampToValueAtTime(62, now + 1.15);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 240;

    engGain.gain.setValueAtTime(0.01, now + 0.24);
    engGain.gain.linearRampToValueAtTime(0.16, now + 0.42);
    engGain.gain.exponentialRampToValueAtTime(0.001, now + 1.25);

    engine.connect(lp);
    lp.connect(engGain);
    engGain.connect(this.masterGain);
    engine.start(now + 0.24);
    engine.stop(now + 1.3);
  }

  /** Continuous 5-second hot oil sizzle + crackling pops when frying chicken & potatoes */
  public playFryerSizzle(durationSec: number = 5.0) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * durationSec);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const pop = Math.random() < 0.0045 ? (Math.random() * 2 - 1) * 1.9 : 0;
      const base = (Math.random() * 2 - 1) * 0.55;
      const env = i < len * 0.04 ? i / (len * 0.04) : i > len * 0.9 ? (len - i) / (len * 0.1) : 1;
      d[i] = (base + pop) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.setValueAtTime(3200, now);
    bp.Q.value = 1.1;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.24, now + 0.18);
    gain.gain.setValueAtTime(0.22, now + Math.max(0.2, durationSec - 0.3));
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    src.connect(bp);
    bp.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);
  }

  /** 5-second microwave hum when heating Big Mac, ending with crisp microwave bell ding */
  public playMicrowaveHumAndDing(durationSec: number = 5.0) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    const hum = this.ctx.createOscillator();
    const humSub = this.ctx.createOscillator();
    const humGain = this.ctx.createGain();
    hum.type = 'sawtooth';
    hum.frequency.setValueAtTime(120, now);
    humSub.type = 'sine';
    humSub.frequency.setValueAtTime(60, now);

    const lp = this.ctx.createBiquadFilter();
    lp.type = 'lowpass';
    lp.frequency.value = 280;

    humGain.gain.setValueAtTime(0.001, now);
    humGain.gain.linearRampToValueAtTime(0.14, now + 0.15);
    humGain.gain.setValueAtTime(0.14, now + Math.max(0.2, durationSec - 0.12));
    humGain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    hum.connect(lp);
    humSub.connect(lp);
    lp.connect(humGain);
    humGain.connect(this.masterGain);
    hum.start(now);
    humSub.start(now);
    hum.stop(now + durationSec + 0.05);
    humSub.stop(now + durationSec + 0.05);

    // Door latch click at start
    const click = this.ctx.createOscillator();
    const clickGain = this.ctx.createGain();
    click.type = 'square';
    click.frequency.setValueAtTime(520, now);
    click.frequency.exponentialRampToValueAtTime(140, now + 0.04);
    clickGain.gain.setValueAtTime(0.18, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    click.connect(clickGain);
    clickGain.connect(this.masterGain);
    click.start(now);
    click.stop(now + 0.06);
  }

  public playMicrowaveDing() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const bell = this.ctx.createOscillator();
    const bellGain = this.ctx.createGain();
    bell.type = 'sine';
    bell.frequency.setValueAtTime(2093, now); // crisp microwave C7 ding
    bellGain.gain.setValueAtTime(0.26, now);
    bellGain.gain.exponentialRampToValueAtTime(0.0005, now + 0.95);
    bell.connect(bellGain);
    bellGain.connect(this.masterGain);
    bell.start(now);
    bell.stop(now + 1.0);
  }

  /** 3-second carbonated fountain soda pour + ice clink when dispensing soft drink */
  public playSodaPour(durationSec: number = 3.0) {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * durationSec);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const bubble = Math.random() < 0.008 ? (Math.random() * 2 - 1) * 1.4 : 0;
      const fizz = (Math.random() * 2 - 1) * 0.45;
      const env = i < len * 0.06 ? i / (len * 0.06) : i > len * 0.88 ? (len - i) / (len * 0.12) : 1;
      d[i] = (fizz + bubble) * env;
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'bandpass';
    hp.frequency.setValueAtTime(4800, now);
    hp.frequency.linearRampToValueAtTime(6400, now + durationSec);
    hp.Q.value = 0.85;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.01, now);
    gain.gain.linearRampToValueAtTime(0.22, now + 0.14);
    gain.gain.setValueAtTime(0.2, now + Math.max(0.2, durationSec - 0.25));
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec);

    src.connect(hp);
    hp.connect(gain);
    gain.connect(this.masterGain);
    src.start(now);

    // Subtle ice clink at start of pour
    const clink = this.ctx.createOscillator();
    const clinkGain = this.ctx.createGain();
    clink.type = 'triangle';
    clink.frequency.setValueAtTime(1680, now + 0.08);
    clink.frequency.exponentialRampToValueAtTime(920, now + 0.19);
    clinkGain.gain.setValueAtTime(0.14, now + 0.08);
    clinkGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    clink.connect(clinkGain);
    clinkGain.connect(this.masterGain);
    clink.start(now + 0.08);
    clink.stop(now + 0.23);
  }

  /** Solid car door thud (Duck entering car on Night 3) */
  public playCarDoorClose() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const door = this.ctx.createOscillator();
    const doorGain = this.ctx.createGain();
    door.type = 'triangle';
    door.frequency.setValueAtTime(112, now);
    door.frequency.exponentialRampToValueAtTime(32, now + 0.16);
    doorGain.gain.setValueAtTime(0.34, now);
    doorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);
    door.connect(doorGain);
    doorGain.connect(this.masterGain);
    door.start(now);
    door.stop(now + 0.25);
  }

  /** Failed out-of-gas starter cranking ("chug-chug-chug... stall") */
  public playCarOutOfGasCrank() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const cranks = [0.22, 0.48, 0.74, 1.02, 1.32];
    cranks.forEach((offset, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + offset;
      const starter = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      starter.type = 'sawtooth';
      const pitch = 92 - idx * 5;
      starter.frequency.setValueAtTime(pitch, t);
      starter.frequency.linearRampToValueAtTime(pitch * 1.45, t + 0.1);
      starter.frequency.exponentialRampToValueAtTime(42, t + 0.2);

      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.value = 340;

      gain.gain.setValueAtTime(0.01, t);
      gain.gain.linearRampToValueAtTime(0.22 - idx * 0.02, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.22);

      starter.connect(lp);
      lp.connect(gain);
      gain.connect(this.masterGain);
      starter.start(t);
      starter.stop(t + 0.24);
    });
  }

  /** First uploaded video: horror laughing sound effect when clown starts banging his head against Duck's car window */
  public playHideousClownLaugh() {
    this.resume();
    if (this.activeRestaurantLaughSource) {
      try {
        this.activeRestaurantLaughSource.stop();
      } catch (e) {}
      this.activeRestaurantLaughSource = null;
      this.isRestaurantLaughPlaying = false;
    }
    if (this.restaurantClownLaughAudio) {
      try {
        this.restaurantClownLaughAudio.pause();
        this.restaurantClownLaughAudio.currentTime = 0;
      } catch (e) {}
    }

    if (this.ctx && this.masterGain && this.windowClownLaughBuffer) {
      if (this.activeWindowLaughSource) {
        try {
          this.activeWindowLaughSource.stop();
        } catch (e) {}
      }
      const src = this.ctx.createBufferSource();
      src.buffer = this.windowClownLaughBuffer;
      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(this.isMuted ? 0 : 1.12, this.ctx.currentTime);
      src.connect(gain);
      gain.connect(this.masterGain);
      src.onended = () => {
        if (this.activeWindowLaughSource === src) {
          this.activeWindowLaughSource = null;
        }
      };
      this.activeWindowLaughSource = src;
      src.start(0, this.windowClownLaughStartOffset);
      return;
    }

    const audio = this.ensureWindowClownLaughAudio();
    if (!audio) return;
    audio.volume = this.isMuted ? 0 : Math.min(1, this.masterVolume * 0.95);
    const startPlay = () => {
      try {
        audio.currentTime = this.windowClownLaughStartOffset;
      } catch (e) {}
      audio.play().catch(() => {});
    };
    if (audio.readyState >= 1) {
      startPlay();
    } else {
      audio.addEventListener('loadedmetadata', startPlay, { once: true });
    }
  }

  /** Heavy clown forehead slam + laminated car window cracking sound */
  public playCarWindowCrack() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;

    // 1. Heavy impact thud on glass/door
    const thud = this.ctx.createOscillator();
    const thudGain = this.ctx.createGain();
    thud.type = 'sine';
    thud.frequency.setValueAtTime(140, now);
    thud.frequency.exponentialRampToValueAtTime(28, now + 0.24);
    thudGain.gain.setValueAtTime(0.45, now);
    thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
    thud.connect(thudGain);
    thudGain.connect(this.masterGain);
    thud.start(now);
    thud.stop(now + 0.3);

    // 2. Sharp glass fracture crackle bursts
    const len = Math.floor(this.ctx.sampleRate * 0.42);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      const spike = i < len * 0.08 ? 1.0 : Math.random() < 0.04 ? 0.85 : 0.15;
      d[i] = (Math.random() * 2 - 1) * spike * Math.exp(-i / (len * 0.35));
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buf;

    const hp = this.ctx.createBiquadFilter();
    hp.type = 'highpass';
    hp.frequency.value = 2400;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.42, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.42);

    noise.connect(hp);
    hp.connect(gain);
    gain.connect(this.masterGain);
    noise.start(now);
  }

  public playPhoneRing() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc1.type = 'sine';
    osc2.type = 'sine';
    osc1.frequency.setValueAtTime(440, now);
    osc2.frequency.setValueAtTime(480, now);
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.11, now + 0.04);
    gain.gain.setValueAtTime(0.11, now + 0.45);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.55);
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.masterGain);
    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.58);
    osc2.stop(now + 0.58);
  }

  public playTextMessagePing() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    [880, 1174.66].forEach((freq, idx) => {
      if (!this.ctx || !this.masterGain) return;
      const t = now + idx * 0.08;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(0.14, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.18);
      osc.connect(gain);
      gain.connect(this.masterGain);
      osc.start(t);
      osc.stop(t + 0.2);
    });
  }

  public playCameraShutter() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const len = Math.floor(this.ctx.sampleRate * 0.07);
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) {
      d[i] = (Math.random() * 2 - 1) * Math.exp(-i / (len * 0.3));
    }
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const bp = this.ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 2600;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.24, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.masterGain);
    src.start(now);
  }

  public playPoliceSirens() {
    if (!this.ctx || !this.masterGain) return;
    const now = this.ctx.currentTime;
    const siren = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    siren.type = 'triangle';
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.85;
      siren.frequency.setValueAtTime(640, t);
      siren.frequency.linearRampToValueAtTime(920, t + 0.42);
      siren.frequency.linearRampToValueAtTime(640, t + 0.84);
    }
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.15, now + 0.8);
    gain.gain.setValueAtTime(0.15, now + 2.6);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 3.4);
    siren.connect(gain);
    gain.connect(this.masterGain);
    siren.start(now);
    siren.stop(now + 3.45);
  }

  public dispose() {
    this.stopNightMusic();
    this.stopChaseMusic();
    this.stopCreditsMusic();
    if (this.ctx) {
      try {
        this.ctx.close();
      } catch (e) {}
      this.ctx = null;
    }
  }
}

export const soundEngine = new SoundEngine();
