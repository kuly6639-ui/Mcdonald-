import React from 'react';
import { Play, RotateCcw, Home, Volume2, Sliders } from 'lucide-react';
import { GameSettings } from '../types/game';

interface PauseMenuProps {
  onResume: () => void;
  onRestartNight: () => void;
  onMainMenu: () => void;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestartNight,
  onMainMenu,
  settings,
  onUpdateSettings,
}) => {
  return (
    <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <h2 className="text-xl font-bold text-amber-400 tracking-wider text-center uppercase border-b border-neutral-800 pb-3 mb-5">
          GAME PAUSED
        </h2>

        {/* Buttons */}
        <div className="space-y-3 mb-6">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            Resume Shift
          </button>

          <button
            onClick={onRestartNight}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            Restart Night
          </button>

          <button
            onClick={onMainMenu}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            Main Menu
          </button>
        </div>

        {/* Quick Audio & Sens Controls */}
        <div className="border-t border-neutral-800 pt-4 space-y-3 text-xs text-neutral-400">
          <div>
            <div className="flex justify-between mb-1">
              <span>Volume</span>
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

          <div>
            <div className="flex justify-between mb-1">
              <span>Sensitivity</span>
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
        </div>
      </div>
    </div>
  );
};
