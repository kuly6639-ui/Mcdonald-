import React, { useState } from 'react';
import { Play, Settings as SettingsIcon, Info, HelpCircle, Lock, Moon, Sliders, Shield } from 'lucide-react';
import { GameNight, GameSettings, GraphicsQuality } from '../types/game';

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

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-between p-8 md:p-16 font-mono select-none overflow-hidden bg-black/60">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_50%,rgba(15,8,8,0.7)_0%,rgba(0,0,0,0.96)_100%)] pointer-events-none" />

      {/* LEFT COLUMN: TITLE & ACTION BUTTONS */}
      <div className="relative z-10 max-w-lg flex flex-col justify-between h-full py-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-9 h-9 rounded-full bg-red-800 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(251,191,36,0.5)]">
              <span className="text-amber-400 text-xl font-black italic">M</span>
            </div>
            <span className="text-red-500 font-bold text-xs uppercase tracking-widest">
              Psychological Horror Experience
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            MCDONALD'S<br />
            <span className="text-red-600 font-black tracking-widest text-3xl md:text-4xl">
              NIGHTFALL
            </span>
          </h1>

          <div className="mt-2.5 inline-block px-2.5 py-0.5 bg-neutral-900 border border-neutral-700 text-neutral-300 text-xs font-bold uppercase tracking-widest rounded">
            2-NIGHT DEMO
          </div>

          <p className="mt-4 text-xs text-neutral-400 max-w-sm leading-relaxed">
            Take on the overnight shift at an eerie 24-hour fast-food restaurant. Complete routine duties while a strange mascot observes from the shadows.
          </p>
        </div>

        {/* Buttons List */}
        <div className="space-y-2.5 my-6">
          <button
            onClick={() => onStartNight(1)}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-sm tracking-widest rounded border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer transition-all"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-white" />
              PLAY NIGHT 1
            </span>
            <span className="text-xs text-amber-300">The First Shift</span>
          </button>

          <button
            onClick={() => onStartNight(2)}
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
                <span>Interact (Wipe Tables, Collect Trash, Switches)</span>
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
