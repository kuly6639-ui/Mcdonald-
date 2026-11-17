import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Settings as SettingsIcon,
  Info,
  HelpCircle,
  Moon,
  Flame,
} from 'lucide-react';
import { GameNight, GameSettings, GraphicsQuality } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations, LANGUAGE_OPTIONS } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface MainMenuProps {
  onStartNight: (night: GameNight) => void;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  night2Unlocked: boolean;
  night3Unlocked: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNight,
  settings,
  onUpdateSettings,
  night2Unlocked,
  night3Unlocked,
}) => {
  const [modal, setModal] = useState<'none' | 'settings' | 'credits' | 'controls'>('none');
  const [poppedCell, setPoppedCell] = useState<string | null>(null);
  const popTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bundle = getTranslations(settings.language);
  const t = bundle.menu;

  const triggerCellPop = (cellId: string, action?: () => void, delayMs: number = 0) => {
    soundEngine.playUICellPop();
    setPoppedCell(cellId);
    if (popTimerRef.current) {
      window.clearTimeout(popTimerRef.current);
    }
    if (actionTimerRef.current) {
      window.clearTimeout(actionTimerRef.current);
    }
    popTimerRef.current = window.setTimeout(() => {
      setPoppedCell(null);
    }, 250);
    if (action) {
      if (delayMs > 0) {
        actionTimerRef.current = window.setTimeout(() => {
          action();
        }, delayMs);
      } else {
        action();
      }
    }
  };

  useEffect(() => {
    return () => {
      if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
      if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    };
  }, []);

  // Background Music playback for menu atmosphere
  useEffect(() => {
    const audio = new Audio('./assets/aistudio/cold_glass_passage_7ecca980.mp4');
    audio.loop = true;
    audio.volume = Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onFirstInteraction = () => {
          if (audioRef.current) {
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
      audioRef.current.volume = Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    }
  }, [settings.masterVolume]);

  const handleStartNight = (night: GameNight) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    onStartNight(night);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-start p-4 md:p-8 font-mono select-none overflow-hidden bg-gradient-to-r from-black/80 via-black/35 to-transparent">
      {/* Subtle vignette highlighting the outside store in 3D */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_50%,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* CLEAN SIMPLIFIED MENU: TITLE + PLAY + CONTROLS / SETTINGS / CREDITS */}
      <div className="relative z-10 max-w-[315px] w-full flex flex-col gap-5 py-6 px-5 rounded-xl bg-black/75 border border-neutral-800/90 shadow-2xl">
        {/* Game Title & Logo */}
        <div className="flex items-center gap-3.5">
          <McDonaldsLogo size="sm" neon={true} />
          <h1 className="text-xl md:text-2xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            MCDONALD&apos;S
            <br />
            <span className="text-red-600 font-black tracking-widest text-lg md:text-xl">
              NIGHTFALL
            </span>
          </h1>
        </div>

        {/* Play Buttons */}
        <div className="space-y-2">
          <button
            onClick={() => triggerCellPop('play_n1', () => handleStartNight(1))}
            className={`w-full flex items-center justify-between px-4 py-2.5 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs tracking-widest rounded border border-red-500 shadow-[0_0_16px_rgba(220,38,38,0.35)] cursor-pointer transition-all ${
              poppedCell === 'play_n1' ? 'animate-cell-pop' : ''
            }`}
          >
            <span className="flex items-center gap-2">
              <Play className="w-3.5 h-3.5 fill-white" />
              {t.playNight1}
            </span>
          </button>

          <button
            onClick={() => triggerCellPop('play_n2', () => handleStartNight(2))}
            disabled={!night2Unlocked}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded border text-xs font-bold tracking-widest transition-all ${
              poppedCell === 'play_n2' ? 'animate-cell-pop' : ''
            } ${
              night2Unlocked
                ? 'bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-amber-300 border-amber-500/60 cursor-pointer shadow-lg'
                : 'bg-neutral-950/80 text-neutral-600 border-neutral-800 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-3.5 h-3.5" />
              {t.playNight2} {night2Unlocked ? '' : t.locked}
            </span>
          </button>

          <button
            onClick={() => triggerCellPop('play_n3', () => handleStartNight(3))}
            disabled={!night3Unlocked}
            className={`w-full flex items-center justify-between px-4 py-2.5 rounded border text-xs font-bold tracking-widest transition-all ${
              poppedCell === 'play_n3' ? 'animate-cell-pop' : ''
            } ${
              night3Unlocked
                ? 'bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-red-400 border-red-500/60 cursor-pointer shadow-lg'
                : 'bg-neutral-950/80 text-neutral-600 border-neutral-800 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <Flame className="w-3.5 h-3.5" />
              {t.playNight3} {night3Unlocked ? '' : t.locked}
            </span>
          </button>
        </div>

        {/* Controls, Settings & Credits */}
        <div className="grid grid-cols-3 gap-1.5 pt-1 border-t border-neutral-800/80">
          <button
            onClick={() => triggerCellPop('btn_controls', () => setModal('controls'), 170)}
            className={`flex items-center justify-center gap-1 px-2 py-2 bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 border border-neutral-700 rounded text-[10px] text-neutral-300 font-bold cursor-pointer transition-all ${
              poppedCell === 'btn_controls' ? 'animate-cell-pop' : ''
            }`}
          >
            <HelpCircle className="w-3 h-3" />
            {t.controls}
          </button>

          <button
            onClick={() => triggerCellPop('btn_settings', () => setModal('settings'), 170)}
            className={`flex items-center justify-center gap-1 px-2 py-2 bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 border border-neutral-700 rounded text-[10px] text-neutral-300 font-bold cursor-pointer transition-all ${
              poppedCell === 'btn_settings' ? 'animate-cell-pop' : ''
            }`}
          >
            <SettingsIcon className="w-3 h-3" />
            {t.settings}
          </button>

          <button
            onClick={() => triggerCellPop('btn_credits', () => setModal('credits'), 170)}
            className={`flex items-center justify-center gap-1 px-2 py-2 bg-neutral-900 hover:bg-neutral-800 hover:-translate-y-0.5 active:scale-95 border border-neutral-700 rounded text-[10px] text-neutral-300 font-bold cursor-pointer transition-all ${
              poppedCell === 'btn_credits' ? 'animate-cell-pop' : ''
            }`}
          >
            <Info className="w-3 h-3" />
            {t.credits}
          </button>
        </div>

        <div className="flex items-center justify-between text-[10px] text-neutral-400 tracking-wider pt-1 border-t border-neutral-800/60">
          <span>MCDONALD&apos;S NIGHTFALL</span>
          <span className="font-bold text-amber-400/90">{t.versionLabel}</span>
        </div>
      </div>

      {/* MODAL: SETTINGS */}
      {modal === 'settings' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.settingsTitle}
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              {/* Language Selector */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>{bundle.languageLabel}</span>
                  <span className="font-bold text-amber-400">{bundle.languageName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGE_OPTIONS.map((opt) => {
                    const cellId = `modal_lang_${opt.code}`;
                    return (
                      <button
                        key={opt.code}
                        onClick={() => triggerCellPop(cellId, () => onUpdateSettings({ language: opt.code }))}
                        className={`py-1.5 px-2 rounded font-bold text-xs border cursor-pointer transition-all hover:scale-[1.03] active:scale-95 ${
                          poppedCell === cellId ? 'animate-cell-pop' : ''
                        } ${
                          (settings.language || 'en') === opt.code
                            ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                        }`}
                      >
                        {opt.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Graphics Quality */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>{t.graphicsQuality}</span>
                  <span className="font-bold text-amber-400 uppercase">
                    {t.qualityLevels[settings.graphicsQuality]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => {
                    const cellId = `quality_${q}`;
                    return (
                      <button
                        key={q}
                        onClick={() => triggerCellPop(cellId, () => onUpdateSettings({ graphicsQuality: q }))}
                        className={`py-1.5 rounded uppercase font-bold text-xs border cursor-pointer transition-all hover:scale-[1.03] active:scale-95 ${
                          poppedCell === cellId ? 'animate-cell-pop' : ''
                        } ${
                          settings.graphicsQuality === q
                            ? 'bg-amber-600 text-white border-amber-400'
                            : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                        }`}
                      >
                        {t.qualityLevels[q]}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Volume */}
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t.audioVolume}</span>
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
                  <span>{t.mouseSensitivity}</span>
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
                <span>{t.invertLook}</span>
                <button
                  onClick={() => triggerCellPop('invertY', () => onUpdateSettings({ invertY: !settings.invertY }))}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border transition-all active:scale-95 ${
                    poppedCell === 'invertY' ? 'animate-cell-pop' : ''
                  } ${
                    settings.invertY
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.invertY ? t.enabled : t.disabled}
                </button>
              </div>

              {/* CRT Scanline */}
              <div className="flex items-center justify-between pt-2">
                <span>{t.crtFilter}</span>
                <button
                  onClick={() => triggerCellPop('crtFilter', () => onUpdateSettings({ crtFilter: !settings.crtFilter }))}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border transition-all active:scale-95 ${
                    poppedCell === 'crtFilter' ? 'animate-cell-pop' : ''
                  } ${
                    settings.crtFilter
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.crtFilter ? t.enabled : t.disabled}
                </button>
              </div>
            </div>

            <button
              onClick={() => triggerCellPop('close_settings', () => setModal('none'), 160)}
              className={`mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer transition-all ${
                poppedCell === 'close_settings' ? 'animate-cell-pop' : ''
              }`}
            >
              {t.applyClose}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CONTROLS */}
      {modal === 'controls' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.controlsTitle}
            </h2>

            <div className="space-y-3 text-xs text-neutral-300">
              {t.controlsList.map((row, idx) => (
                <div key={idx} className="flex justify-between gap-4 border-b border-neutral-800 pb-1">
                  <span className="text-amber-400 font-bold shrink-0">{row.key}</span>
                  <span className="text-right">{row.desc}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => triggerCellPop('close_controls', () => setModal('none'), 160)}
              className={`mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer transition-all ${
                poppedCell === 'close_controls' ? 'animate-cell-pop' : ''
              }`}
            >
              {t.understood}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREDITS */}
      {modal === 'credits' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.creditsTitle}
            </h2>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p>{t.creditsIntro}</p>
              <div className="border-t border-neutral-800 pt-2 space-y-1">
                {t.creditsDetails.map((d, idx) => (
                  <div key={idx}>
                    <strong>{d.label}:</strong> {d.value}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => triggerCellPop('close_credits', () => setModal('none'), 160)}
              className={`mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer transition-all ${
                poppedCell === 'close_credits' ? 'animate-cell-pop' : ''
              }`}
            >
              {t.returnMenu}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
