import React, { useState, useEffect } from 'react';
import { Eye, Shield, Radio, Sparkles } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';

interface LoadingScreenProps {
  onComplete: () => void;
}

export const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  const messages = [
    'Preparing your night shift…',
    'Checking security cameras…',
    'Calibrating automatic sliding doors…',
    'Initializing walk-in freezer temperature logs…',
    'Opening the restaurant…',
  ];

  useEffect(() => {
    // Rotating loading messages
    const msgInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 900);

    // Realistic progress accumulation (2.4s total load)
    const progInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progInterval);
          clearInterval(msgInterval);
          setTimeout(() => {
            soundEngine.init();
            onComplete();
          }, 350);
          return 100;
        }
        const step = Math.floor(Math.random() * 18) + 12;
        return Math.min(100, prev + step);
      });
    }, 280);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progInterval);
    };
  }, [onComplete]);

  return (
    <div className="absolute inset-0 z-50 bg-[#080a0c] flex flex-col items-center justify-between p-8 md:p-14 font-mono select-none overflow-hidden text-white">
      {/* Background Flickering Ambience & VHS Scanlines */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(160,20,20,0.15)_0%,rgba(4,5,7,0.98)_100%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.3)_50%)] bg-[length:100%_4px] pointer-events-none" />

      {/* TOP BADGE */}
      <div className="relative z-10 flex items-center gap-2 px-3.5 py-1 rounded bg-neutral-900/80 border border-neutral-700/60 text-xs text-neutral-400">
        <Radio className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
        <span className="tracking-widest uppercase">System Initialization</span>
      </div>

      {/* CENTER TITLE & BRANDING */}
      <div className="relative z-10 flex flex-col items-center text-center max-w-lg">
        {/* Glowing Golden Arches Emblem */}
        <div className="w-16 h-16 rounded-full bg-red-900/90 border-2 border-amber-400 flex items-center justify-center shadow-[0_0_30px_rgba(251,191,36,0.4)] mb-4">
          <span className="text-amber-400 text-3xl font-black italic">M</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)] mb-1">
          MCDONALD'S
        </h1>
        <div className="text-2xl md:text-3xl font-black text-red-600 tracking-widest uppercase mb-6">
          NIGHTFALL
        </div>

        <div className="text-xs text-neutral-400 tracking-wider uppercase mb-8">
          2-Night Psychological Horror Demo
        </div>

        {/* PROGRESS BAR & ROTATING MESSAGE */}
        <div className="w-full max-w-sm space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 animate-pulse transition-all">
              {messages[messageIndex]}
            </span>
            <span className="tabular-nums font-bold text-amber-400">{progress}%</span>
          </div>

          <div className="w-full bg-neutral-900 border border-neutral-700/80 h-2.5 rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-amber-400 rounded-full transition-all duration-200"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      {/* FOOTER HINTS */}
      <div className="relative z-10 text-[11px] text-neutral-500 tracking-wider uppercase flex items-center gap-3">
        <span>Automatic Sliding Doors</span>
        <span>·</span>
        <span>Real Customer AI</span>
        <span>·</span>
        <span>Sequential Shifts</span>
      </div>
    </div>
  );
};
