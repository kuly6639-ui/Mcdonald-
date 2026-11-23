import React from 'react';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface ControlsModalProps {
  language: Language;
  onClose: () => void;
  backLabel?: string;
}

export const ControlsModal: React.FC<ControlsModalProps> = ({
  language,
  onClose,
  backLabel,
}) => {
  const t = getTranslations(language).menu;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 font-sans select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-[94%] max-w-xl max-h-[90dvh] flex flex-col border-b border-l border-r border-white/85 bg-black/60 backdrop-blur-[2px] px-4 sm:px-10 pt-5 sm:pt-7 pb-4 sm:pb-6">
        <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
          <div className="h-[1px] flex-1 bg-white/85" />
          <h2 className="px-3 sm:px-5 -translate-y-1/2 text-sm sm:text-xl font-black uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            {t.controlsTitle}
          </h2>
          <div className="h-[1px] flex-1 bg-white/85" />
        </div>

        <div className="flex-1 overflow-y-auto px-1 sm:px-6 py-1 sm:py-2 space-y-1.5 sm:space-y-2">
          {t.controlsList.map((row, idx) => (
            <div
              key={idx}
              className="grid grid-cols-[auto_1fr] items-center gap-4 border-b border-white/10 pb-1 text-xs sm:text-sm"
            >
              <span className="text-amber-300 font-bold tracking-wider uppercase whitespace-nowrap">
                {row.key}
              </span>
              <span className="text-right text-neutral-200">{row.desc}</span>
            </div>
          ))}
        </div>

        <div className="pt-3 sm:pt-4 flex items-center justify-start">
          <button
            type="button"
            onClick={() => {
              soundEngine.playUICellPop();
              onClose();
            }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-neutral-300 hover:text-white active:scale-95 cursor-pointer transition-colors py-1 pr-3"
          >
            {backLabel || t.understood}
          </button>
        </div>
      </div>
    </div>
  );
};
