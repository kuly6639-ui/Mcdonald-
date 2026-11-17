import React from 'react';
import { DoorOpen, PhoneCall } from 'lucide-react';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface Night3CarChoiceModalProps {
  language: Language;
  onChooseExitCar: () => void;
  onChooseHideInCar: () => void;
}

export const Night3CarChoiceModal: React.FC<Night3CarChoiceModalProps> = ({
  language,
  onChooseExitCar,
  onChooseHideInCar,
}) => {
  const t = getTranslations(language).night3CarChoice;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4 font-mono select-none">
      <div className="max-w-md w-full bg-neutral-950 border-2 border-red-700/80 rounded-xl p-6 shadow-[0_0_50px_rgba(185,28,28,0.45)] space-y-5">
        <div className="space-y-1.5 border-b border-neutral-800 pb-3">
          <h2 className="text-base md:text-lg font-black text-red-400 uppercase tracking-wider">
            {t.title}
          </h2>
          <p className="text-xs text-neutral-300 leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="space-y-3">
          <button
            onClick={() => {
              soundEngine.playUICellPop();
              onChooseExitCar();
            }}
            className="w-full text-left p-3.5 rounded-lg bg-red-950/70 hover:bg-red-900/80 border border-red-600/80 text-white transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 text-sm font-black text-red-200">
              <DoorOpen className="w-4 h-4 text-red-400 shrink-0" />
              <span>{t.optionExit}</span>
            </div>
            <p className="text-[11px] text-red-200/80 mt-1 pl-6.5">{t.optionExitSub}</p>
          </button>

          <button
            onClick={() => {
              soundEngine.playUICellPop();
              onChooseHideInCar();
            }}
            className="w-full text-left p-3.5 rounded-lg bg-amber-950/70 hover:bg-amber-900/80 border border-amber-500/80 text-white transition-all cursor-pointer active:scale-[0.98]"
          >
            <div className="flex items-center gap-2.5 text-sm font-black text-amber-200">
              <PhoneCall className="w-4 h-4 text-amber-400 shrink-0" />
              <span>{t.optionHide}</span>
            </div>
            <p className="text-[11px] text-amber-100/80 mt-1 pl-6.5">{t.optionHideSub}</p>
          </button>
        </div>
      </div>
    </div>
  );
};
