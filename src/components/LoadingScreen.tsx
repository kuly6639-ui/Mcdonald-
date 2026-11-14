import React, { useState, useEffect } from 'react';
import { Radio } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';

interface LoadingScreenProps {
  onComplete: () => void;
  language: Language;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete, language }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFadingIn, setIsFadingIn] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [lightIntensity, setLightIntensity] = useState<'off' | 'dim' | 'bright'>('off');

  const t = getTranslations(language).loading;

  useEffect(() => {
    soundEngine.init();
    soundEngine.resume();

    const unlockAudio = () => {
      soundEngine.init();
      soundEngine.resume();
    };
    window.addEventListener('pointerdown', unlockAudio, { passive: true });
    window.addEventListener('keydown', unlockAudio, { passive: true });

    // Smooth initial fade-in from pure darkness when intro begins
    const fadeInTimer = setTimeout(() => {
      setIsFadingIn(false);
    }, 60);

    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % t.messages.length);
    }, 1150);

    let lastBuzzAt = 0;
    const triggerFlicker = (intensity: 'off' | 'dim' | 'bright', forceAudio = false) => {
      setLightIntensity(intensity);
      const now = performance.now();
      if (intensity !== 'off' && (forceAudio || now - lastBuzzAt > 240)) {
        lastBuzzAt = now;
        soundEngine.playFluorescentFlickerBuzz();
      }
    };

    // Erratic fluorescent tube flicker pattern revealing "made by Nguyen Duck"
    const flickerInterval = setInterval(() => {
      const r = Math.random();
      if (r < 0.22) {
        triggerFlicker('off');
      } else if (r < 0.52) {
        triggerFlicker('dim');
      } else {
        triggerFlicker('bright');
      }
    }, 110);

    // Initial spark sequence with starter ballast buzz
    const t0 = setTimeout(() => triggerFlicker('dim', true), 260);
    const t1 = setTimeout(() => triggerFlicker('bright', true), 520);
    const t2 = setTimeout(() => triggerFlicker('off'), 690);
    const t3 = setTimeout(() => triggerFlicker('bright', true), 860);

    const startTime = performance.now();
    const targetDurationMs = 5600;

    const progInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / targetDurationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progInterval);
        clearInterval(msgInterval);
        clearInterval(flickerInterval);
        setLightIntensity('bright');

        setIsFadingOut(true);
        setTimeout(() => {
          soundEngine.init();
          onComplete();
        }, 650);
      }
    }, 45);

    return () => {
      clearTimeout(fadeInTimer);
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(msgInterval);
      clearInterval(flickerInterval);
      clearInterval(progInterval);
      window.removeEventListener('pointerdown', unlockAudio);
      window.removeEventListener('keydown', unlockAudio);
    };
  }, [onComplete, t.messages.length]);

  const handleEarlyClick = () => {
    soundEngine.init();
    soundEngine.resume();
    soundEngine.playFluorescentFlickerBuzz();
  };

  const wordGlowClass =
    lightIntensity === 'bright'
      ? 'opacity-100 text-amber-100 drop-shadow-[0_0_24px_rgba(253,230,138,0.85)]'
      : lightIntensity === 'dim'
      ? 'opacity-55 text-amber-200/70 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]'
      : 'opacity-10 text-neutral-700 drop-shadow-none';

  const overheadBeamClass =
    lightIntensity === 'bright'
      ? 'opacity-90'
      : lightIntensity === 'dim'
      ? 'opacity-35'
      : 'opacity-0';

  return (
    <div
      onClick={handleEarlyClick}
      className={`absolute inset-0 z-50 bg-[#030406] flex flex-col items-center justify-between p-8 md:p-14 font-mono select-none overflow-hidden text-white transition-opacity duration-700 ${
        isFadingIn || isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Overhead flickering fluorescent tube housing */}
      <div className="relative z-10 flex flex-col items-center gap-2 w-full">
        <div
          className={`w-64 h-1.5 rounded-full transition-all duration-75 ${
            lightIntensity === 'bright'
              ? 'bg-amber-100 shadow-[0_0_30px_10px_rgba(253,230,138,0.55)]'
              : lightIntensity === 'dim'
              ? 'bg-amber-200/50 shadow-[0_0_12px_4px_rgba(251,191,36,0.2)]'
              : 'bg-neutral-800 shadow-none'
          }`}
        />

        <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-950/90 border border-neutral-800 text-[11px] text-neutral-400 mt-3">
          <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
          <span className="tracking-widest uppercase">{t.badge}</span>
        </div>
      </div>

      {/* Flickering Overhead Light Cone illuminating the dark room */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-75 bg-[radial-gradient(ellipse_55%_48%_at_50%_42%,rgba(253,224,130,0.22)_0%,rgba(120,20,20,0.08)_48%,rgba(2,3,5,0.99)_82%)] ${overheadBeamClass}`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.42)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* CENTER: FLICKERING REVEAL "made by Nguyen Duck" & TITLE */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-xl">
        {/* Flickering reveal text */}
        <div className="mb-8 px-6 py-4">
          <div
            className={`text-2xl sm:text-3xl md:text-4xl font-black tracking-[0.18em] transition-all duration-75 ${wordGlowClass}`}
          >
            made by Nguyen Duck
          </div>
        </div>

        <h1
          className={`text-3xl md:text-4xl font-black tracking-tight leading-none mb-1 transition-opacity duration-75 ${
            lightIntensity === 'off' ? 'text-amber-900/40 opacity-30' : 'text-amber-400 opacity-100'
          }`}
        >
          MCDONALD'S
        </h1>
        <div
          className={`text-xl md:text-2xl font-black tracking-widest uppercase mb-3 transition-opacity duration-75 ${
            lightIntensity === 'off' ? 'text-red-950/50 opacity-30' : 'text-red-600 opacity-100'
          }`}
        >
          NIGHTFALL
        </div>

        <div className="text-xs text-neutral-500 tracking-wider uppercase mb-6">
          {t.subtitle}
        </div>

        {/* PROGRESS BAR & ROTATING MESSAGE */}
        <div className="w-full max-w-sm space-y-2.5 bg-black/75 p-4 rounded-xl border border-neutral-800/80 shadow-2xl">
          <div className="flex items-center justify-between text-xs gap-3">
            <span className="text-neutral-300 font-medium tracking-wide text-left">
              {t.messages[messageIndex]}
            </span>
            <span className="tabular-nums font-bold text-amber-400 text-sm shrink-0">{progress}%</span>
          </div>

          <div className="w-full bg-neutral-900 border border-neutral-700/80 h-2.5 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER HINTS */}
      <div className="relative z-10 text-[11px] text-neutral-500 tracking-wider uppercase flex items-center gap-3">
        <span>{t.footerHints[0]}</span>
        <span>·</span>
        <span>{t.footerHints[1]}</span>
        <span>·</span>
        <span>{t.footerHints[2]}</span>
      </div>
    </div>
  );
};
