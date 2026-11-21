import React, { useState, useEffect, useRef } from 'react';
import { Home, ChevronRight, Music } from 'lucide-react';
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
  const [musicVis, setMusicVis] = useState(() => soundEngine.getMusicVisualizerState(28));

  const typingCompletedAtRef = useRef<number>(0);
  const autoAdvanceTimerRef = useRef<number | null>(null);
  const creditsScrollRef = useRef<HTMLDivElement | null>(null);
  const userScrolledRef = useRef<boolean>(false);

  // Smooth typewriter scrolling message on pure black screen
  useEffect(() => {
    setPhase('message');
    setDisplayedCount(0);
    setMessageDone(false);
    setCreditsVisible(false);
    userScrolledRef.current = false;
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

  // Smoothly auto-transition to Credits after finishing the scrolling message
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

  // Fade in credits, play uploaded credits music, auto-scroll slowly downward, & animate live audio visualizer
  useEffect(() => {
    if (phase !== 'credits') return;

    soundEngine.playCreditsMusic();
    userScrolledRef.current = false;

    const rafFade = requestAnimationFrame(() => {
      setCreditsVisible(true);
      if (creditsScrollRef.current) {
        creditsScrollRef.current.scrollTop = 0;
      }
    });

    let rafLoop = 0;
    let lastTime = performance.now();
    let lastVisTick = 0;
    let exactScrollTop = 0;

    const tick = (now: number) => {
      const dt = Math.min(0.08, (now - lastTime) / 1000);
      lastTime = now;

      if (creditsScrollRef.current && !userScrolledRef.current) {
        const el = creditsScrollRef.current;
        const maxScroll = Math.max(0, el.scrollHeight - el.clientHeight);
        if (maxScroll > 2 && exactScrollTop < maxScroll) {
          exactScrollTop = Math.min(maxScroll, exactScrollTop + dt * 24);
          el.scrollTop = exactScrollTop;
        }
      }

      if (now - lastVisTick >= 40) {
        lastVisTick = now;
        setMusicVis(soundEngine.getMusicVisualizerState(28));
      }
      rafLoop = requestAnimationFrame(tick);
    };
    rafLoop = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafFade);
      cancelAnimationFrame(rafLoop);
      soundEngine.stopCreditsMusic();
    };
  }, [phase]);

  const handleMessageAdvance = () => {
    if (phase !== 'message') return;
    if (!messageDone) {
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
    soundEngine.stopCreditsMusic();
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
    <div className="absolute inset-0 z-50 bg-black font-mono select-none overflow-hidden">
      {/* Audio-Reactive Ambient Glow on Pure Black Background */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-700"
        style={{
          background: `radial-gradient(circle at 50% 34%, rgba(220,38,38,${
            0.09 + musicVis.intensity * 0.16
          }) 0%, rgba(245,158,11,${0.04 + musicVis.intensity * 0.08}) 26%, rgba(0,0,0,1) 70%)`,
          opacity: creditsVisible ? 1 : 0,
        }}
      />

      {/* Audio-Reactive Bottom Equalizer Spectrum Bars (Makes Credits Music Visually Alive) */}
      <div
        className={`absolute bottom-0 left-0 right-0 h-20 flex items-end justify-center gap-1 px-4 sm:px-12 pb-2 pointer-events-none transition-opacity duration-1000 ${
          creditsVisible ? 'opacity-70' : 'opacity-0'
        }`}
      >
        {musicVis.bars.map((val, idx) => (
          <div
            key={idx}
            className="flex-1 max-w-[14px] rounded-t-sm bg-gradient-to-t from-red-800/80 via-amber-500/75 to-amber-200/90 transition-[height] duration-75"
            style={{
              height: `${Math.max(8, Math.round(val * 100))}%`,
              boxShadow:
                val > 0.55 ? '0 0 12px rgba(245, 158, 11, 0.45)' : 'none',
            }}
          />
        ))}
      </div>

      {/* Top Fade & Track Badge */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black to-transparent z-20 pointer-events-none flex items-start justify-center pt-4">
        {musicVis.active && (
          <div
            className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/80 border border-amber-500/35 text-[10px] uppercase tracking-[0.22em] text-amber-300/90 shadow-[0_0_16px_rgba(245,158,11,0.2)]"
            style={{ opacity: Math.max(0.55, musicVis.entryBannerAlpha) }}
          >
            <Music className="w-3 h-3 text-amber-400 animate-pulse" />
            <span>{musicVis.trackTitle || 'AFTER THE MACHINE STOPS'}</span>
          </div>
        )}
      </div>

      {/* Slow Downward-Scrolling Pure Black Credits Container */}
      <div
        ref={creditsScrollRef}
        onWheel={() => {
          userScrolledRef.current = true;
        }}
        onTouchStart={() => {
          userScrolledRef.current = true;
        }}
        className={`relative z-10 w-full h-full overflow-y-auto px-6 py-24 flex flex-col items-center transition-opacity duration-1000 ${
          creditsVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="max-w-xl w-full flex flex-col items-center text-center">
          {/* McDonald's Nightfall Logo & Title */}
          <div
            className="mb-4 transition-transform duration-300"
            style={{
              transform: `scale(${1 + musicVis.intensity * 0.045})`,
              filter: `drop-shadow(0 0 ${14 + musicVis.intensity * 22}px rgba(245,158,11,0.45))`,
            }}
          >
            <McDonaldsLogo size="md" neon={true} className="mx-auto" />
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none mb-2 text-amber-400 drop-shadow-[0_0_24px_rgba(245,158,11,0.35)]">
            MCDONALD&apos;S{' '}
            <span className="text-red-600 tracking-widest">NIGHTFALL</span>
          </h1>

          <div className="text-red-500/90 font-bold text-xs sm:text-sm uppercase tracking-[0.34em] mb-10">
            {t.demoOverSubtitle}
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-amber-500/60 to-transparent mb-10" />

          <h2 className="text-xl sm:text-2xl font-black text-amber-300 tracking-[0.28em] uppercase mb-10">
            — {t.creditsHeading} —
          </h2>

          {/* Spacious Scrolling Credit Rows */}
          <div className="w-full space-y-9 mb-16">
            {t.creditRows.map((row, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="text-[11px] uppercase tracking-[0.3em] text-neutral-500">
                  {row.role}
                </div>
                <div className="text-base sm:text-lg font-bold text-neutral-100 tracking-wide">
                  {row.name}
                </div>
              </div>
            ))}
          </div>

          <div className="w-24 h-px bg-gradient-to-r from-transparent via-red-600/60 to-transparent my-8" />

          {/* Final Line */}
          <p className="text-lg sm:text-2xl font-bold text-amber-200 italic tracking-wide mt-6 mb-10 drop-shadow-[0_0_18px_rgba(245,158,11,0.3)]">
            {t.thankYouNote}
          </p>

          <button
            onClick={handleMenuReturn}
            className={`inline-flex items-center justify-center gap-2 px-7 py-3 mb-24 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_20px_rgba(220,38,38,0.5)] transition-all ${
              poppedBtn === 'menu' ? 'animate-cell-pop' : ''
            }`}
          >
            <Home className="w-4 h-4" />
            {t.returnToMenu}
          </button>
        </div>
      </div>

      {/* Subtle corner return button so players can exit early anytime */}
      <button
        onClick={handleMenuReturn}
        className="absolute bottom-5 right-5 z-30 flex items-center gap-1.5 px-3.5 py-2 rounded bg-neutral-950/85 hover:bg-neutral-900 border border-neutral-800 text-[10px] font-bold uppercase tracking-widest text-neutral-300 hover:text-white cursor-pointer transition-all"
      >
        <Home className="w-3.5 h-3.5 text-red-400" />
        <span>{t.returnToMenu}</span>
      </button>
    </div>
  );
};
