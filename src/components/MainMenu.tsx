import React, { useState, useEffect, useRef } from 'react';
import { GameNight, GameSettings } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';
import { OptionsModal } from './OptionsModal';
import { ControlsModal } from './ControlsModal';

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
    <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-2 sm:p-4 font-mono select-none overflow-hidden">
      {/* Subtle perimeter vignette preserving clear sightlines to left door light & right window clown */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0.12)_28%,rgba(0,0,0,0.72)_100%)] pointer-events-none" />

      {/* Centered dark-room borderless horror layout */}
      <div className="relative z-10 max-h-[100dvh] overflow-y-auto w-full max-w-md flex flex-col items-center justify-center text-center gap-2 sm:gap-3.5 py-1">
        {/* Bold distressed centered horror title */}
        <h1
          className="pointer-events-none font-sans font-black uppercase text-neutral-200 tracking-[0.14em] leading-[0.94] text-xl sm:text-3xl md:text-4xl drop-shadow-[0_4px_14px_rgba(0,0,0,0.95)]"
          style={{
            textShadow: '0 2px 0 rgba(0,0,0,0.95), 0 0 18px rgba(0,0,0,0.9)',
            transform: 'scaleY(1.08)',
          }}
        >
          <span className="block text-neutral-200/95">MCDONALD&apos;S</span>
          <span className="block text-red-700/95 tracking-[0.22em] text-lg sm:text-2xl md:text-3xl mt-0.5">
            NIGHTFALL
          </span>
        </h1>

        {/* Centered borderless vertical menu action stack */}
        <nav
          aria-label="Main Menu"
          className="flex flex-col items-center gap-0.5 sm:gap-1.5 mt-1 sm:mt-2"
        >
          <button
            onClick={() => triggerCellPop('play_n1', () => handleStartNight(1))}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-neutral-100 hover:text-amber-300 focus-visible:outline-none focus-visible:text-amber-300 active:scale-95 cursor-pointer transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'play_n1' ? 'animate-cell-pop text-amber-300' : ''
            }`}
          >
            {t.playNight1}
          </button>

          <button
            onClick={() => triggerCellPop('play_n2', () => handleStartNight(2))}
            disabled={!night2Unlocked}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'play_n2' ? 'animate-cell-pop' : ''
            } ${
              night2Unlocked
                ? 'text-neutral-200 hover:text-amber-300 focus-visible:outline-none focus-visible:text-amber-300 active:scale-95 cursor-pointer'
                : 'text-neutral-500/75 cursor-not-allowed'
            }`}
          >
            {t.playNight2} {night2Unlocked ? '' : t.locked}
          </button>

          <button
            onClick={() => triggerCellPop('play_n3', () => handleStartNight(3))}
            disabled={!night3Unlocked}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'play_n3' ? 'animate-cell-pop' : ''
            } ${
              night3Unlocked
                ? 'text-red-300/95 hover:text-red-400 focus-visible:outline-none focus-visible:text-red-400 active:scale-95 cursor-pointer'
                : 'text-neutral-500/75 cursor-not-allowed'
            }`}
          >
            {t.playNight3} {night3Unlocked ? '' : t.locked}
          </button>

          <button
            onClick={() => triggerCellPop('btn_controls', () => setModal('controls'), 170)}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:text-white active:scale-95 cursor-pointer transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'btn_controls' ? 'animate-cell-pop text-white' : ''
            }`}
          >
            {t.controls}
          </button>

          <button
            onClick={() => triggerCellPop('btn_settings', () => setModal('settings'), 170)}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:text-white active:scale-95 cursor-pointer transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'btn_settings' ? 'animate-cell-pop text-white' : ''
            }`}
          >
            {t.settings}
          </button>

          <button
            onClick={() => triggerCellPop('btn_credits', () => setModal('credits'), 170)}
            className={`bg-transparent border-0 px-3 py-0.5 sm:py-1 text-[11px] sm:text-sm md:text-base font-bold uppercase tracking-[0.22em] text-neutral-300 hover:text-white focus-visible:outline-none focus-visible:text-white active:scale-95 cursor-pointer transition-all whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)] ${
              poppedCell === 'btn_credits' ? 'animate-cell-pop text-white' : ''
            }`}
          >
            {t.credits}
          </button>
        </nav>
      </div>

      {/* Tiny unobtrusive version footer */}
      <div className="pointer-events-none absolute bottom-1.5 right-2.5 z-10 text-[9px] text-neutral-400/75 tracking-widest uppercase">
        {t.versionLabel}
      </div>

      {/* MODAL: OPTIONS / SETTINGS */}
      {modal === 'settings' && (
        <OptionsModal
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onClose={() => setModal('none')}
        />
      )}

      {/* MODAL: CONTROLS */}
      {modal === 'controls' && (
        <ControlsModal
          language={settings.language}
          onClose={() => setModal('none')}
        />
      )}

      {/* MODAL: CREDITS */}
      {modal === 'credits' && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 font-sans select-none"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-[94%] max-w-xl max-h-[90dvh] flex flex-col border-b border-l border-r border-white/85 bg-black/60 backdrop-blur-[2px] px-4 sm:px-10 pt-5 sm:pt-7 pb-4 sm:pb-6">
            <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
              <div className="h-[1px] flex-1 bg-white/85" />
              <h2 className="px-3 sm:px-5 -translate-y-1/2 text-sm sm:text-xl font-black uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
                {t.creditsTitle}
              </h2>
              <div className="h-[1px] flex-1 bg-white/85" />
            </div>

            <div className="flex-1 overflow-y-auto px-1 sm:px-4 py-1 sm:py-2 space-y-2 text-xs sm:text-sm text-neutral-200 leading-snug text-left">
              <p>{t.creditsIntro}</p>
              <div className="border-t border-white/15 pt-2 space-y-1">
                {t.creditsDetails.map((d, idx) => (
                  <div key={idx}>
                    <strong className="text-white">{d.label}:</strong> {d.value}
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 sm:pt-4 flex items-center justify-start">
              <button
                type="button"
                onClick={() => triggerCellPop('close_credits', () => setModal('none'), 120)}
                className={`text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-neutral-300 hover:text-white active:scale-95 cursor-pointer transition-colors py-1 pr-3 ${
                  poppedCell === 'close_credits' ? 'animate-cell-pop' : ''
                }`}
              >
                {t.returnMenu}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
