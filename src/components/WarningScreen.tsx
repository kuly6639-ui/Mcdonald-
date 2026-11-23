import React, { useState, useEffect, useCallback } from 'react';
import { AlertTriangle } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';

interface WarningScreenProps {
  onComplete: () => void;
  language: Language;
}

export const WarningScreen: React.FC<WarningScreenProps> = ({ onComplete, language }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(6);

  const t = getTranslations(language).warning;

  const proceed = useCallback(() => {
    if (isFadingOut) return;
    soundEngine.init();
    soundEngine.resume();
    soundEngine.playUICellPop();
    setIsFadingOut(true);
    window.setTimeout(() => {
      onComplete();
    }, 350);
  }, [isFadingOut, onComplete]);

  useEffect(() => {
    const fadeInTimer = window.setTimeout(() => setIsVisible(true), 40);

    const countdownInterval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    const autoTimer = window.setTimeout(() => {
      setIsFadingOut(true);
      window.setTimeout(() => {
        soundEngine.init();
        onComplete();
      }, 350);
    }, 6200);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE' || e.code === 'Escape') {
        e.preventDefault();
        proceed();
      }
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.clearTimeout(fadeInTimer);
      window.clearInterval(countdownInterval);
      window.clearTimeout(autoTimer);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onComplete, proceed]);

  return (
    <div
      onClick={proceed}
      className={`absolute inset-0 z-50 bg-[#040406] flex flex-col items-center justify-center p-4 sm:p-8 font-sans select-none overflow-hidden text-white cursor-pointer transition-opacity duration-350 ${
        !isVisible || isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Subtle CRT vignette */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,rgba(120,15,15,0.08)_0%,rgba(0,0,0,0.94)_78%)]" />

      {/* Centered white rectangular cutout-border frame matching Options/Settings UI */}
      <div className="relative z-10 w-[94%] max-w-xl max-h-[90dvh] flex flex-col items-center text-center border-b border-l border-r border-white/85 bg-black/75 px-5 sm:px-10 pt-6 sm:pt-8 pb-5 sm:pb-7">
        {/* Top border broken by centered WARNING title */}
        <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
          <div className="h-[1px] flex-1 bg-white/85" />
          <div className="px-3 sm:px-5 -translate-y-1/2 flex items-center gap-2 whitespace-nowrap">
            <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
            <h1 className="text-sm sm:text-xl font-black uppercase tracking-[0.22em] text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
              {t.title}
            </h1>
          </div>
          <div className="h-[1px] flex-1 bg-white/85" />
        </div>

        <div className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.22em] text-red-400/95 mb-3">
          {t.badge}
        </div>

        <p className="text-xs sm:text-base font-semibold text-white leading-relaxed tracking-wide mb-3">
          {t.body}
        </p>

        <p className="text-[11px] sm:text-xs text-neutral-300 leading-relaxed mb-3">
          {t.subNote}
        </p>

        {language !== 'vi' && (
          <div className="w-full border-t border-white/15 pt-2.5 mt-1 mb-3 text-[11px] sm:text-xs text-neutral-300 leading-snug">
            {t.viSummary}
          </div>
        )}

        <div className="mt-2 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              proceed();
            }}
            className="border border-white/80 bg-white/10 hover:bg-white/20 active:scale-95 px-5 py-2 text-[11px] sm:text-xs font-black uppercase tracking-[0.18em] text-white cursor-pointer transition-all"
          >
            {t.continueBtn}
          </button>
          <span className="text-[10px] sm:text-[11px] text-neutral-400 tracking-wider">
            {t.autoTimerHint(secondsLeft)}
          </span>
        </div>
      </div>
    </div>
  );
};
