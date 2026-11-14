import React, { useEffect, useState, useRef } from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { GameNight, Language } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface VictoryModalProps {
  night: GameNight;
  onProceedToNight2: () => void;
  onPlayNight2Again: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  language: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  night,
  onProceedToNight2,
  onPlayNight2Again,
  onPlayAgain,
  onMainMenu,
  language,
}) => {
  const t = getTranslations(language).victory;
  const [visible, setVisible] = useState(false);
  const [poppedBtn, setPoppedBtn] = useState<string | null>(null);
  const popTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setVisible(false);
    const raf = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(raf);
  }, [night]);

  useEffect(() => {
    return () => {
      if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
      if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    };
  }, []);

  const triggerPop = (id: string, cb: () => void) => {
    soundEngine.playUICellPop();
    setPoppedBtn(id);
    if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    popTimerRef.current = window.setTimeout(() => setPoppedBtn(null), 240);
    actionTimerRef.current = window.setTimeout(() => cb(), 150);
  };

  // --- NIGHT 1 SHIFT COMPLETE ---
  if (night === 1) {
    return (
      <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none">
        <div
          className={`max-w-md w-full bg-neutral-950 border border-neutral-700 rounded-lg p-8 text-center shadow-2xl transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
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
              onClick={() => triggerPop('n2_proceed', onProceedToNight2)}
              className={`w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all ${
                poppedBtn === 'n2_proceed' ? 'animate-cell-pop' : ''
              }`}
            >
              <Play className="w-4 h-4 fill-white" />
              {t.beginNight2}
            </button>

            <button
              onClick={() => triggerPop('n1_menu', onMainMenu)}
              className={`w-full flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-400 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n1_menu' ? 'animate-cell-pop' : ''
              }`}
            >
              <Home className="w-4 h-4" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NIGHT 2 SHIFT COMPLETE (NO NIGHT 3 TEASER) ---
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-6 font-mono select-none">
      <div
        className={`max-w-md w-full bg-neutral-950 border border-neutral-700 rounded-lg p-8 text-center shadow-2xl transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        <McDonaldsLogo size="sm" neon={true} className="mb-3 mx-auto" />
        <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-1">
          {t.night2Over}
        </div>

        <h1 className="text-4xl font-black text-amber-400 tracking-wider mb-2">
          6:00 AM
        </h1>

        <div className="text-xs text-neutral-400 uppercase tracking-widest mb-6">
          {t.theSecondShift}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-4 rounded mb-6 text-neutral-300 text-xs leading-relaxed text-left space-y-2">
          <p>{t.night2Story1}</p>
          <p className="text-amber-400 italic">{t.night2Story2}</p>
        </div>

        <p className="text-[11px] text-neutral-500 mb-6">
          {t.night2Sub}
        </p>

        <div className="space-y-3">
          <button
            onClick={() => triggerPop('n2_again', onPlayNight2Again)}
            className={`w-full flex items-center justify-center gap-2 py-3 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-xs uppercase tracking-widest rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all ${
              poppedBtn === 'n2_again' ? 'animate-cell-pop' : ''
            }`}
          >
            <RotateCcw className="w-4 h-4" />
            {t.playNight2Again}
          </button>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => triggerPop('n1_again', onPlayAgain)}
              className={`flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n1_again' ? 'animate-cell-pop' : ''
              }`}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              {t.playAgain}
            </button>

            <button
              onClick={() => triggerPop('n2_menu', onMainMenu)}
              className={`flex items-center justify-center gap-2 py-2.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-300 font-bold text-xs uppercase tracking-widest rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n2_menu' ? 'animate-cell-pop' : ''
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
