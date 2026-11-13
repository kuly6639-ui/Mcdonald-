import React from 'react';
import { Play, RotateCcw, Home, Globe } from 'lucide-react';
import { GameSettings } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations, LANGUAGE_OPTIONS } from '../i18n/translations';

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
  const bundle = getTranslations(settings.language);
  const t = bundle.pause;

  return (
    <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4 font-mono select-none">
      <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-sm w-full shadow-2xl">
        <div className="flex flex-col items-center mb-3">
          <McDonaldsLogo size="sm" neon={true} className="mb-2" />
          <h2 className="text-xl font-bold text-amber-400 tracking-wider text-center uppercase border-b border-neutral-800 pb-2 w-full">
            {t.title}
          </h2>
        </div>

        {/* Buttons */}
        <div className="space-y-3 mb-5">
          <button
            onClick={onResume}
            className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
            {t.resume}
          </button>

          <button
            onClick={onRestartNight}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            {t.restartNight}
          </button>

          <button
            onClick={onMainMenu}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
          >
            <Home className="w-4 h-4" />
            {t.mainMenu}
          </button>
        </div>

        {/* Language Quick Selector */}
        <div className="border-t border-neutral-800 pt-3 pb-3">
          <div className="flex items-center justify-between text-xs text-neutral-400 mb-2">
            <span className="flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              {bundle.languageLabel}
            </span>
            <span className="text-amber-400 font-bold">{bundle.languageName}</span>
          </div>
          <div className="grid grid-cols-4 gap-1.5">
            {LANGUAGE_OPTIONS.map((opt) => (
              <button
                key={opt.code}
                onClick={() => onUpdateSettings({ language: opt.code })}
                title={opt.label}
                className={`py-1 rounded text-[11px] font-bold border cursor-pointer transition-colors ${
                  (settings.language || 'en') === opt.code
                    ? 'bg-amber-600 text-white border-amber-400'
                    : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                }`}
              >
                {opt.short}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Audio & Sens Controls */}
        <div className="border-t border-neutral-800 pt-3 space-y-3 text-xs text-neutral-400">
          <div>
            <div className="flex justify-between mb-1">
              <span>{t.volume}</span>
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
              <span>{t.sensitivity}</span>
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
