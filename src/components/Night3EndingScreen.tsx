import React, { useState, useEffect, useRef } from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';
import { McDonaldsLogo } from './McDonaldsLogo';

interface Night3EndingScreenProps {
  onReturnToMenu: () => void;
  language: Language;
  variant?: 'good' | 'bad';
}

export const Night3EndingScreen: React.FC<Night3EndingScreenProps> = ({
  onReturnToMenu,
  language,
  variant = 'good',
}) => {
  const t = getTranslations(language).night3Ending;
  const fullMessage = variant === 'bad' ? t.badEndingMessage : t.scrollingMessage;

  const [phase, setPhase] = useState<'message' | 'credits'>('message');
  const [displayedCount, setDisplayedCount] = useState(0);
  const [messageDone, setMessageDone] = useState(false);
  const [creditsVisible, setCreditsVisible] = useState(false);
  const [poppedBtn, setPoppedBtn] = useState<string | null>(null);

  const typingCompletedAtRef = useRef<number>(0);
  const autoAdvanceTimerRef = useRef<number | null>(null);

  // Smooth typewriter scrolling message on pure black screen
  useEffect(() => {
    setPhase('message');
    setDisplayedCount(0);
    setMessageDone(false);
    setCreditsVisible(false);
  }, [fullMessage]);

  useEffect(() => {
    if (phase !== 'message' || messageDone) return;

    if (displayedCount >= fullMessage.length) {
      setMessageDone(true);
      typingCompletedAtRef.current = performance.now();
      return;
    }

    const ch = fullMessage[displayedCount];
    // Cinematic typewriter pace (~54ms/char), slightly slower (~76ms/char) on final line
    const progress = fullMessage.length > 0 ? displayedCount / fullMessage.length : 0;
    let delay = progress > 0.76 ? 76 : 54;
    if (ch === '.' || ch === '?' || ch === '!' || ch === '…') {
      delay = 280;
    } else if (ch === ',' || ch === ';') {
      delay = 160;
    } else if (ch === '\n') {
      delay = 220;
    }

    const timer = window.setTimeout(() => {
      setDisplayedCount((prev) => {
        const next = prev + 1;
        const typedChar = fullMessage[prev];
        if (next % 2 === 1 && typedChar && typedChar.trim().length > 0) {
          soundEngine.playDialogueTypewriterBeep(true);
        }
        if (next >= fullMessage.length) {
          setMessageDone(true);
          typingCompletedAtRef.current = performance.now();
        }
        return next;
      });
    }, delay);

    return () => window.clearTimeout(timer);
  }, [phase, messageDone, displayedCount, fullMessage]);

  // Smoothly auto-transition to "THE DEMO IS OVER" + Credits after finishing the scrolling message
  useEffect(() => {
    if (phase !== 'message' || !messageDone) return;
    autoAdvanceTimerRef.current = window.setTimeout(() => {
      setPhase('credits');
    }, 4500);

    return () => {
      if (autoAdvanceTimerRef.current) {
        window.clearTimeout(autoAdvanceTimerRef.current);
      }
    };
  }, [phase, messageDone]);

  // Fade in credits smoothly on black screen
  useEffect(() => {
    if (phase !== 'credits') return;
    const raf = requestAnimationFrame(() => {
      setCreditsVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [phase]);

  const handleMessageAdvance = () => {
    if (phase !== 'message') return;
    if (!messageDone) {
      // Only finish the scrolling text cleanly without skipping to credits prematurely
      setDisplayedCount(fullMessage.length);
      setMessageDone(true);
      typingCompletedAtRef.current = performance.now();
      return;
    }
    if (performance.now() - typingCompletedAtRef.current < 350) return;
    if (autoAdvanceTimerRef.current) {
      window.clearTimeout(autoAdvanceTimerRef.current);
    }
    soundEngine.playUICellPop();
    setPhase('credits');
  };

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (phase !== 'message') return;
      if (e.code === 'Space' || e.code === 'Enter' || e.code === 'KeyE') {
        e.preventDefault();
        handleMessageAdvance();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  });

  const handleMenuReturn = () => {
    soundEngine.playUICellPop();
    setPoppedBtn('menu');
    window.setTimeout(() => {
      onReturnToMenu();
    }, 180);
  };

  if (phase === 'message') {
    const shownText = fullMessage.slice(0, displayedCount);
    return (
      <div
        onClick={handleMessageAdvance}
        className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 md:p-12 font-mono select-none cursor-pointer"
      >
        <div className="max-w-2xl w-full text-center space-y-6">
          {variant === 'bad' && (
            <div className="text-red-500 font-black text-xl sm:text-2xl uppercase tracking-[0.35em] drop-shadow-[0_0_16px_rgba(239,68,68,0.5)]">
              {t.badEndingTitle}
            </div>
          )}

          <div className="min-h-[140px] flex items-center justify-center">
            <p
              className={`whitespace-pre-line text-base sm:text-lg md:text-xl leading-relaxed tracking-wide font-medium ${
                variant === 'bad'
                  ? 'text-red-100 drop-shadow-[0_0_14px_rgba(220,38,38,0.3)]'
                  : 'text-neutral-100 drop-shadow-[0_0_12px_rgba(255,255,255,0.12)]'
              }`}
            >
              {shownText}
              {!messageDone && (
                <span
                  className={`inline-block w-2.5 h-5 ml-1 align-middle animate-pulse ${
                    variant === 'bad' ? 'bg-red-500' : 'bg-amber-400'
                  }`}
                />
              )}
            </p>
          </div>

          <div className="h-10 flex items-center justify-center">
            {!messageDone ? (
              <span className="text-[11px] text-neutral-600 uppercase tracking-widest">
                {t.pressToFinishTyping}
              </span>
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleMessageAdvance();
                }}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700 text-xs font-bold uppercase tracking-widest text-amber-400 transition-all animate-pulse cursor-pointer"
              >
                <span>{t.continueToCredits}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none overflow-y-auto">
      <div
        className={`max-w-lg w-full bg-neutral-950/90 border border-neutral-800 rounded-xl p-7 md:p-9 text-center shadow-2xl transition-all duration-1000 ease-out ${
          creditsVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-5 scale-95'
        }`}
      >
        <McDonaldsLogo size="sm" neon={true} className="mb-3 mx-auto" />

        <div className="text-red-500 font-black text-xs uppercase tracking-[0.28em] mb-1">
          {t.demoOverSubtitle}
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-wider uppercase mb-5">
          {t.demoOverTitle}
        </h1>

        <div className="border-t border-b border-neutral-800 py-5 mb-5 space-y-3 text-left">
          <div className="text-center text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400 mb-3">
            — {t.creditsHeading} —
          </div>

          {t.creditRows.map((row, idx) => (
            <div
              key={idx}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 text-xs border-b border-neutral-900 pb-2 last:border-b-0 last:pb-0"
            >
              <span className="text-neutral-500 uppercase tracking-wider text-[10px]">
                {row.role}
              </span>
              <span className="text-neutral-200 font-bold">{row.name}</span>
            </div>
          ))}
        </div>

        <p className="text-xs text-neutral-400 italic mb-6 leading-relaxed">
          {t.thankYouNote}
        </p>

        <button
          onClick={handleMenuReturn}
          className={`w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_16px_rgba(220,38,38,0.45)] transition-all ${
            poppedBtn === 'menu' ? 'animate-cell-pop' : ''
          }`}
        >
          <Home className="w-4 h-4" />
          {t.returnToMenu}
        </button>
      </div>
    </div>
  );
};
