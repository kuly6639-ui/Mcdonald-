import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Home, Eye, Lock } from 'lucide-react';
import { GameNight } from '../types/game';

interface VictoryModalProps {
  night: GameNight;
  onProceedToNight2: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  night,
  onProceedToNight2,
  onPlayAgain,
  onMainMenu,
}) => {
  // Teaser animation stages for Night 2:
  // stage 0: "YOU THOUGHT HE WAS JUST WATCHING."
  // stage 1: pause then "HE WAS WAITING."
  // stage 2: Cut to black then "DEMO COMPLETE — 2 NIGHTS" / "NIGHT 3 IS COMING..."
  const [teaserStage, setTeaserStage] = useState(0);

  useEffect(() => {
    if (night === 2) {
      const t1 = setTimeout(() => {
        setTeaserStage(1);
      }, 2600);

      const t2 = setTimeout(() => {
        setTeaserStage(2);
      }, 5400);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }
  }, [night]);

  // --- NIGHT 1 SHIFT COMPLETE ---
  if (night === 1) {
    return (
      <div className="absolute inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-6 font-mono select-none">
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-700 rounded-lg p-8 text-center shadow-2xl">
          <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-1">
            Overnight Shift 1 Finished
          </div>

          <h1 className="text-4xl font-black text-amber-400 tracking-wider mb-2">
            6:00 AM
          </h1>

          <div className="text-xs text-neutral-400 uppercase tracking-widest mb-6">
            THE FIRST SHIFT
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded mb-6 text-neutral-300 text-xs leading-relaxed text-left space-y-2">
            <p>
              Duck clocked out and stepped through the automatic sliding doors into the damp morning air.
            </p>
            <p className="text-amber-400 italic">
              When Duck turned around and glanced through the front glass window, the clown mascot was standing in the dark dining room, perfectly still, staring straight toward the exit.
            </p>
          </div>

          <p className="text-[11px] text-neutral-500 mb-6">
            He didn't chase Duck. He didn't move. He just watched.
          </p>

          <div className="space-y-3">
            <button
              onClick={onProceedToNight2}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              Begin Night 2: Something is Wrong
            </button>

            <button
              onClick={onMainMenu}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NIGHT 2 CINEMATIC TEASER REVEAL ---
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none overflow-hidden text-center">
      {/* Stage 0 & 1: The Creepy Monologue on Black Screen */}
      {teaserStage < 2 && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-2xl md:text-3xl font-black text-neutral-300 tracking-widest uppercase transition-opacity duration-1000">
            “YOU THOUGHT HE WAS JUST WATCHING.”
          </div>

          {teaserStage >= 1 && (
            <div className="text-3xl md:text-4xl font-black text-red-600 tracking-widest uppercase transition-opacity duration-1000 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
              “HE WAS WAITING.”
            </div>
          )}
        </div>
      )}

      {/* Stage 2: Official Demo Complete & Night 3 Locked Teaser */}
      {teaserStage === 2 && (
        <div className="relative z-10 max-w-lg w-full bg-neutral-950 border-2 border-red-700/80 rounded-lg p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.35)] animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-950/80 border border-red-600 flex items-center justify-center text-red-500">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-xs text-red-500 font-bold uppercase tracking-widest mb-1">
            McDonald's Nightfall
          </h2>

          <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-wider uppercase mb-2">
            DEMO COMPLETE
          </h1>

          <div className="text-xs font-bold text-neutral-300 tracking-widest uppercase mb-4">
            2 NIGHTS SURVIVED
          </div>

          <div className="bg-red-950/40 border border-red-900/60 p-4 rounded mb-6 text-red-400 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner">
            <Lock className="w-4 h-4 text-red-500" />
            <span>NIGHT 3: THE HUNT IS COMING…</span>
          </div>

          <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
            During Nights 1 and 2, he stood by and observed every routine. On Night 3, the doors lock from the outside, the power cuts completely, and the real hunt begins in the full game.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onPlayAgain}
              className="flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              Play Night 1 Again
            </button>

            <button
              onClick={onMainMenu}
              className="flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              Main Menu
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
