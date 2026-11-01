import React, { useState, useEffect, useRef } from 'react';
import { Play, Settings as SettingsIcon, Info, HelpCircle, Lock, Moon, Sliders, Shield, Flame, Volume2, VolumeX, Music } from 'lucide-react';
import { GameNight, GameSettings, GraphicsQuality } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';

interface MainMenuProps {
  onStartNight: (night: GameNight) => void;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  night2Unlocked: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNight,
  settings,
  onUpdateSettings,
  night2Unlocked,
}) => {
  const [modal, setModal] = useState<'none' | 'settings' | 'credits' | 'controls'>('none');
  const [bgmMuted, setBgmMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Background Music playback for user's attached soundtrack
  useEffect(() => {
    const audio = new Audio('/assets/aistudio/cold_glass_passage_7ecca980.mp4');
    audio.loop = true;
    audio.volume = bgmMuted ? 0 : Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Autoplay may be restricted until user interacts with document
        const onFirstInteraction = () => {
          if (audioRef.current && !bgmMuted) {
            audioRef.current.play().catch(() => {});
          }
          window.removeEventListener('click', onFirstInteraction);
          window.removeEventListener('keydown', onFirstInteraction);
        };
        window.addEventListener('click', onFirstInteraction);
        window.addEventListener('keydown', onFirstInteraction);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync volume with settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmMuted ? 0 : Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    }
  }, [settings.masterVolume, bgmMuted]);

  const handleStartNight = (night: GameNight) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    onStartNight(night);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-between p-4 md:p-12 font-mono select-none overflow-hidden bg-gradient-to-r from-black/85 via-black/50 to-transparent">
      {/* Subtle vignette highlighting the outside store in 3D */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* LEFT COLUMN: TITLE & ACTION BUTTONS WITH FROSTED BACKDROP */}
      <div className="relative z-10 max-w-md w-full flex flex-col justify-between h-full max-h-[92vh] py-4 px-6 rounded-2xl bg-black/60 backdrop-blur-md border border-neutral-800/90 shadow-2xl overflow-y-auto">
        <div>
          {/* Header with authentic McDonald's Logo */}
          <div className="flex items-center gap-3.5 mb-3">
            <McDonaldsLogo size="md" neon={true} />
            <div>
              <div className="text-red-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                <span>EST. 1955</span>
                <span className="text-neutral-500">•</span>
                <span className="text-amber-400">Night Shift</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
                Survival Horror Experience
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            MCDONALD'S<br />
            <span className="text-red-600 font-black tracking-widest text-2xl md:text-3xl">
              NIGHTFALL
            </span>
          </h1>

          <div className="mt-2 inline-flex items-center gap-2">
            <span className="px-2 py-0.5 bg-neutral-900 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded">
              Outside Clearing
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              ● Store Active
            </span>
          </div>

          <p className="mt-3 text-[11px] text-neutral-300 max-w-sm leading-relaxed">
            Step into the shoes of Duck on the midnight shift at a lonely McDonald's carved out of a dense horror forest. Prepare customer orders, survive until 6:00 AM, and maintain awareness of the shadows outside.
          </p>

          <div className="mt-2.5 px-2.5 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span><strong>Tip:</strong> Press <kbd className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white font-bold">Shift</kbd> to run on PC, or tap <strong className="text-white">RUN</strong> on mobile!</span>
          </div>
        </div>

        {/* Buttons List */}
        <div className="space-y-2.5 my-6">
          <button
            onClick={() => handleStartNight(1)}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-sm tracking-widest rounded border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer transition-all"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-white" />
              PLAY NIGHT 1
            </span>
            <span className="text-xs text-amber-300">The First Shift</span>
          </button>

          <button
            onClick={() => handleStartNight(2)}
            disabled={!night2Unlocked}
            className={`w-full flex items-center justify-between px-6 py-3.5 rounded border text-sm font-bold tracking-widest transition-all ${
              night2Unlocked
                ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-amber-500/60 cursor-pointer shadow-lg'
                : 'bg-neutral-950/80 text-neutral-600 border-neutral-800 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              PLAY NIGHT 2 {night2Unlocked ? '' : '(LOCKED)'}
            </span>
            <span className="text-xs text-neutral-500">Something is Wrong</span>
          </button>

          {/* Locked Night 3 Teaser Button */}
          <div className="w-full flex items-center justify-between px-6 py-3 rounded border border-neutral-800 bg-neutral-950/50 text-neutral-600 text-xs font-bold tracking-widest opacity-80 cursor-not-allowed">
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              NIGHT 3: THE HUNT
            </span>
            <span className="text-[10px] text-red-500/80 uppercase font-black">
              FULL GAME TEASER
            </span>
          </div>

          {/* Soundtrack BGM status & toggle */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded text-[10px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold truncate">
              <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="truncate">BGM: Cold Glass Passage</span>
            </span>
            <button
              onClick={() => setBgmMuted(!bgmMuted)}
              className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-200 font-bold cursor-pointer shrink-0 transition-colors"
            >
              {bgmMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-red-400" />
                  <span>UNMUTE</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>MUSIC ON</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => setModal('controls')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              Controls
            </button>

            <button
              onClick={() => setModal('settings')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              Settings
            </button>

            <button
              onClick={() => setModal('credits')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              Credits
            </button>
          </div>
        </div>

        {/* Story Directive Badge */}
        <div className="bg-neutral-950/90 border border-neutral-800 rounded p-2.5 text-[11px] text-neutral-400 leading-snug">
          <strong className="text-amber-400">Story Rule:</strong> During Nights 1 & 2, the mascot is observing and not hunting. Experience the calm before the storm.
        </div>
      </div>

      {/* RIGHT COLUMN: SHIFT OVERVIEW */}
      <div className="hidden lg:flex flex-col gap-4 max-w-sm relative z-10">
        <div className="bg-neutral-950/85 border border-neutral-800 rounded-lg p-5 shadow-2xl">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">Shift Memo</div>
          <h3 className="text-sm font-bold text-neutral-200 mb-2">Employee Routine</h3>
          <ul className="text-xs text-neutral-400 space-y-2 list-disc list-inside">
            <li>Night 1: Clean dining tables, collect trash, shutdown kitchen fryers, sign inventory.</li>
            <li>Night 2: Record freezer temperature log, mop hallway, check drive-thru window and CCTV.</li>
            <li>Flashlight has unlimited power; maintain situational awareness.</li>
            <li>If you notice the mascot looking at you, continue your tasks calmly.</li>
          </ul>
        </div>
      </div>

      {/* MODAL: SETTINGS (with Low/Medium/High graphics quality) */}
      {modal === 'settings' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Game Settings
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              {/* Graphics Quality */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>Graphics Quality</span>
                  <span className="font-bold text-amber-400 uppercase">{settings.graphicsQuality}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => onUpdateSettings({ graphicsQuality: q })}
                      className={`py-1.5 rounded uppercase font-bold text-xs border cursor-pointer ${
                        settings.graphicsQuality === q
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <div className="flex justify-between mb-1">
                  <span>Audio Volume</span>
                  <span className="tabular-nums">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => onUpdateSettings({ masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Mouse Sensitivity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span>Mouse Sensitivity</span>
                  <span className="tabular-nums">{settings.mouseSensitivity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.1"
                  value={settings.mouseSensitivity}
                  onChange={(e) => onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Invert Look */}
              <div className="flex items-center justify-between pt-2">
                <span>Invert Look (Y-Axis)</span>
                <button
                  onClick={() => onUpdateSettings({ invertY: !settings.invertY })}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border ${
                    settings.invertY
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.invertY ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>

              {/* CRT Scanline */}
              <div className="flex items-center justify-between pt-2">
                <span>Retro CRT Filter</span>
                <button
                  onClick={() => onUpdateSettings({ crtFilter: !settings.crtFilter })}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border ${
                    settings.crtFilter
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.crtFilter ? 'ENABLED' : 'DISABLED'}
                </button>
              </div>
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              Apply & Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CONTROLS */}
      {modal === 'controls' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Controls
            </h2>

            <div className="space-y-3 text-xs text-neutral-300">
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">W, A, S, D</span>
                <span>Walk / Move</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">Mouse Look</span>
                <span>Aim & Pan Camera</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">Shift</span>
                <span>Sprint (Consumes stamina)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">C</span>
                <span>Crouch</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">F</span>
                <span>Toggle Flashlight (Unlimited)</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">E</span>
                <span>Talk to Customers / Complete Tasks</span>
              </div>
              <div className="flex justify-between border-b border-neutral-800 pb-1">
                <span className="text-amber-400 font-bold">ESC</span>
                <span>Pause Menu / Return from CCTV</span>
              </div>
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREDITS */}
      {modal === 'credits' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              Credits & Lore
            </h2>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p>
                <strong>McDonald's Nightfall — DEMO</strong> is a 2-night slow-burn mascot horror prologue.
              </p>
              <div className="border-t border-neutral-800 pt-2 space-y-1">
                <div><strong>Theme:</strong> Late-night fast-food observation & psychological dread</div>
                <div><strong>Format:</strong> 2 Playable Nights + Night 3 Teaser Ending</div>
                <div><strong>Engine:</strong> Three.js 3D WebGL & Web Audio API</div>
                <div><strong>Story Direction:</strong> The mascot watches and creeps, preparing for Night 3.</div>
              </div>
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              Return to Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
