import React, { useEffect, useState, useRef } from 'react';
import { Play, RotateCcw, Home } from 'lucide-react';
import { GameNight, Language } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface VictoryModalProps {
  night: GameNight;
  onProceedToNight2: () => void;
  onProceedToNight3: () => void;
  onPlayNight2Again: () => void;
  onPlayAgain: () => void;
  onMainMenu: () => void;
  language: Language;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  night,
  onProceedToNight2,
  onProceedToNight3,
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
      <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-2.5 sm:p-4 font-mono select-none">
        <div
          className={`max-w-xs sm:max-w-sm w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 sm:p-5 text-center shadow-2xl max-h-[calc(100dvh-16px)] overflow-y-auto transition-all duration-700 ease-out ${
            visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
          }`}
        >
          <McDonaldsLogo size="xs" neon={true} className="mb-2 mx-auto" />
          <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-0.5">
            {t.night1Over}
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider mb-1">
            6:00 AM
          </h1>

          <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-3">
            {t.theFirstShift}
          </div>

          <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded mb-3 text-neutral-300 text-[11px] leading-snug text-left space-y-1.5">
            <p>{t.night1Story1}</p>
            <p className="text-amber-400 italic">{t.night1Story2}</p>
          </div>

          <p className="text-[10px] text-neutral-500 mb-3">
            {t.night1Sub}
          </p>

          <div className="space-y-1.5">
            <button
              onClick={() => triggerPop('n2_proceed', onProceedToNight2)}
              className={`w-full flex items-center justify-center gap-1.5 py-2 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-[11px] uppercase tracking-wider rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all ${
                poppedBtn === 'n2_proceed' ? 'animate-cell-pop' : ''
              }`}
            >
              <Play className="w-3.5 h-3.5 fill-white" />
              {t.beginNight2}
            </button>

            <button
              onClick={() => triggerPop('n1_menu', onMainMenu)}
              className={`w-full flex items-center justify-center gap-1.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-400 font-bold text-[11px] uppercase tracking-wider rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n1_menu' ? 'animate-cell-pop' : ''
              }`}
            >
              <Home className="w-3.5 h-3.5" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- NIGHT 2 SHIFT COMPLETE (NO NIGHT 3 TEASER) ---
  return (
    <div className="absolute inset-0 z-50 bg-black flex flex-col items-center justify-center p-2.5 sm:p-4 font-mono select-none">
      <div
        className={`max-w-xs sm:max-w-sm w-full bg-neutral-950 border border-neutral-700 rounded-lg p-4 sm:p-5 text-center shadow-2xl max-h-[calc(100dvh-16px)] overflow-y-auto transition-all duration-700 ease-out ${
          visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'
        }`}
      >
        <McDonaldsLogo size="xs" neon={true} className="mb-2 mx-auto" />
        <div className="text-emerald-500 font-bold text-[10px] uppercase tracking-widest mb-0.5">
          {t.night2Over}
        </div>

        <h1 className="text-2xl sm:text-3xl font-black text-amber-400 tracking-wider mb-1">
          6:00 AM
        </h1>

        <div className="text-[10px] text-neutral-400 uppercase tracking-widest mb-3">
          {t.theSecondShift}
        </div>

        <div className="bg-neutral-900 border border-neutral-800 p-2.5 rounded mb-3 text-neutral-300 text-[11px] leading-snug text-left space-y-1.5">
          <p>{t.night2Story1}</p>
          <p className="text-amber-400 italic">{t.night2Story2}</p>
        </div>

        <p className="text-[10px] text-neutral-500 mb-3">
          {t.night2Sub}
        </p>

        <div className="space-y-1.5">
          <button
            onClick={() => triggerPop('n3_proceed', onProceedToNight3)}
            className={`w-full flex items-center justify-center gap-1.5 py-2 bg-red-700 hover:bg-red-600 active:scale-95 text-white font-bold text-[11px] uppercase tracking-wider rounded border border-red-500 cursor-pointer shadow-[0_0_15px_rgba(220,38,38,0.5)] transition-all ${
              poppedBtn === 'n3_proceed' ? 'animate-cell-pop' : ''
            }`}
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            {t.beginNight3}
          </button>

          <button
            onClick={() => triggerPop('n2_again', onPlayNight2Again)}
            className={`w-full flex items-center justify-center gap-1.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-amber-300 font-bold text-[11px] uppercase tracking-wider rounded border border-amber-500/40 cursor-pointer transition-all ${
              poppedBtn === 'n2_again' ? 'animate-cell-pop' : ''
            }`}
          >
            <RotateCcw className="w-3 h-3" />
            {t.playNight2Again}
          </button>

          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={() => triggerPop('n1_again', onPlayAgain)}
              className={`flex items-center justify-center gap-1.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-300 font-bold text-[11px] uppercase tracking-wider rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n1_again' ? 'animate-cell-pop' : ''
              }`}
            >
              <RotateCcw className="w-3 h-3" />
              {t.playAgain}
            </button>

            <button
              onClick={() => triggerPop('n2_menu', onMainMenu)}
              className={`flex items-center justify-center gap-1.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 active:scale-95 text-neutral-300 font-bold text-[11px] uppercase tracking-wider rounded border border-neutral-700 cursor-pointer transition-all ${
                poppedBtn === 'n2_menu' ? 'animate-cell-pop' : ''
              }`}
            >
              <Home className="w-3 h-3" />
              {t.mainMenu}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
