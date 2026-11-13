import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Home, Eye, Lock } from 'lucide-react';
import { GameNight, Language } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations } from '../i18n/translations';

interface VictoryModalProps {
  night: GameNight;
  onProceedToNight2: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  language: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  night,
  onProceedToNight2,
  onPlayAgain,
  onMainMenu,
  language,
}) => {
  const [teaserStage, setTeaserStage] = useState(0);
  const t = getTranslations(language).victory;

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
          <McDonaldsLogo size="sm" neon={true} className="mb-3 mx-auto" />
          <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-1">
            {t.night1Over}
          </div>

          <h1 className="text-4xl font-black text-amber-400 tracking-wider mb-2">
            6:00 AM
          </h1>

          <div className="text-xs text-neutral-400 uppercase tracking-widest mb-6">
            {t.theFirstShift}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-4 rounded mb-6 text-neutral-300 text-xs leading-relaxed text-left space-y-2">
            <p>{t.night1Story1}</p>
            <p className="text-amber-400 italic">{t.night1Story2}</p>
          </div>

          <p className="text-[11px] text-neutral-500 mb-6">
            {t.night1Sub}
          </p>

          <div className="space-y-3">
            <button
              onClick={onProceedToNight2}
              className="w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
            >
              <Play className="w-4 h-4 fill-white" />
              {t.beginNight2}
            </button>

            <button
              onClick={onMainMenu}
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-400 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NIGHT 2 CINEMATIC TEASER REVEAL ---
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none overflow-hidden text-center">
      {teaserStage < 2 && (
        <div className="max-w-xl mx-auto space-y-6">
          <div className="text-2xl md:text-3xl font-black text-neutral-300 tracking-widest uppercase transition-opacity duration-1000">
            {t.teaser1}
          </div>

          {teaserStage >= 1 && (
            <div className="text-3xl md:text-4xl font-black text-red-600 tracking-widest uppercase transition-opacity duration-1000 drop-shadow-[0_0_20px_rgba(220,38,38,0.8)]">
              {t.teaser2}
            </div>
          )}
        </div>
      )}

      {teaserStage === 2 && (
        <div className="relative z-10 max-w-lg w-full bg-neutral-950 border-2 border-red-700/80 rounded-lg p-8 text-center shadow-[0_0_60px_rgba(220,38,38,0.35)] animate-fade-in">
          <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-red-950/80 border border-red-600 flex items-center justify-center text-red-500">
            <Eye className="w-6 h-6 animate-pulse" />
          </div>

          <h2 className="text-xs text-red-500 font-bold uppercase tracking-widest mb-1">
            McDonald's Nightfall
          </h2>

          <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-wider uppercase mb-2">
            {t.demoComplete}
          </h1>

          <div className="text-xs font-bold text-neutral-300 tracking-widest uppercase mb-4">
            {t.nightsSurvived}
          </div>

          <div className="bg-red-950/40 border border-red-900/60 p-4 rounded mb-6 text-red-400 font-black text-sm tracking-widest uppercase flex items-center justify-center gap-2 shadow-inner">
            <Lock className="w-4 h-4 text-red-500" />
            <span>{t.night3Coming}</span>
          </div>

          <p className="text-xs text-neutral-400 mb-8 leading-relaxed">
            {t.teaserDesc}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={onPlayAgain}
              className="flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all"
            >
              <RotateCcw className="w-4 h-4" />
              {t.playAgain}
            </button>

            <button
              onClick={onMainMenu}
              className="flex items-center justify-center gap-2 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-colors"
            >
              <Home className="w-4 h-4" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
