import React, { useState, useEffect } from 'react';
import { Radio, ShieldCheck, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [flicker, setFlicker] = useState(false);

  const messages = [
    'Connecting to restaurant power grid…',
    'Calibrating automatic sliding doors & motion sensors…',
    'Checking security systems & CCTV camera matrix…',
    'Initializing walk-in freezer temperature logs…',
    'Preparing your overnight shift…',
    'Opening the restaurant…',
  ];

  useEffect(() => {
    // Rotating loading messages every 1.0s
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 1050);

    // Subtle fluorescent light flicker tick
    const flickerInterval = setInterval(() => {
      if (Math.random() < 0.28) {
        setFlicker(true);
        setTimeout(() => setFlicker(false), 90 + Math.random() * 80);
      }
    }, 450);

    // Smooth progress bar targeted for approximately 5.2 seconds
    // (5200ms / 50ms interval = 104 ticks -> ~0.95% per tick)
    const startTime = performance.now();
    const targetDurationMs = 5200;

    const progInterval = setInterval(() => {
      const elapsed = performance.now() - startTime;
      const pct = Math.min(100, Math.floor((elapsed / targetDurationMs) * 100));
      setProgress(pct);

      if (pct >= 100) {
        clearInterval(progInterval);
        clearInterval(msgInterval);
        clearInterval(flickerInterval);

        // Smooth fade-out before transitioning
        setIsFadingOut(true);
        setTimeout(() => {
          soundEngine.init();
          onComplete();
        }, 550);
      }
    }, 45);

    return () => {
      clearInterval(msgInterval);
      clearInterval(flickerInterval);
      clearInterval(progInterval);
    };
  }, [onComplete]);

  return (
    <div
      className={`absolute inset-0 z-50 bg-[#07090b] flex flex-col items-center justify-between p-8 md:p-14 font-mono select-none overflow-hidden text-white transition-opacity duration-500 ${
        isFadingOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Background Flickering Ambience & VHS Scanlines */}
      <div
        className={`absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(160,20,20,0.18)_0%,rgba(3,4,6,0.98)_100%)] pointer-events-none transition-opacity duration-75 ${
          flicker ? 'opacity-70' : 'opacity-100'
        }`}
      />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* TOP BADGE */}
      <div className="relative z-10 flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-700/60 text-xs text-neutral-400 shadow-xl">
        <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span className="tracking-widest uppercase">System Initialization Protocol</span>
      </div>

      {/* CENTER TITLE & BRANDING */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Glowing Golden Arches Emblem with Fluorescent Flicker */}
        <div
          className={`w-16 h-16 rounded-full bg-red-900/90 border-2 border-amber-400 flex items-center justify-center mb-5 transition-all duration-75 ${
            flicker
              ? 'shadow-[0_0_10px_rgba(251,191,36,0.2)] opacity-80'
              : 'shadow-[0_0_35px_rgba(251,191,36,0.5)] opacity-100'
          }`}
        >
          <span className="text-amber-400 text-3xl font-black italic">M</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)] mb-1.5">
          MCDONALD'S
        </h1>
        <div className="text-2xl md:text-3xl font-black text-red-600 tracking-widest uppercase mb-4">
          NIGHTFALL
        </div>

        <div className="text-xs text-neutral-400 tracking-wider uppercase mb-8">
          2-Night Psychological Horror Demo
        </div>

        {/* PROGRESS BAR & ROTATING MESSAGE */}
        <div className="w-full max-w-sm space-y-3 bg-black/60 p-4 rounded-xl border border-neutral-800/80 shadow-2xl">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-300 font-medium tracking-wide transition-all duration-200">
              {messages[messageIndex]}
            </span>
            <span className="tabular-nums font-bold text-amber-400 text-sm">{progress}%</span>
          </div>

          <div className="w-full bg-neutral-900 border border-neutral-700/80 h-3 rounded-full overflow-hidden p-0.5 shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full transition-all duration-75"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER HINTS */}
      <div className="relative z-10 text-[11px] text-neutral-500 tracking-wider uppercase flex items-center gap-3">
        <span>Automatic Sliding Doors</span>
        <span>·</span>
        <span>Customer Arrival AI</span>
        <span>·</span>
        <span>Atmospheric Sound</span>
      </div>
    </div>
  );
};
