import React, { useState, useRef, useEffect } from 'react';
import { GameSettings } from '../types/game';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';
import { OptionsModal } from './OptionsModal';
import { ControlsModal } from './ControlsModal';

interface PauseMenuProps {
  onResume: () => void;
  onRestartNight: () => void;
  onMainMenu: () => void;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
}

export const PauseMenu: React.FC<PauseMenuProps> = ({
  onResume,
  onRestartNight,
  onMainMenu,
  settings,
  onUpdateSettings,
}) => {
  const bundle = getTranslations(settings.language);
  const t = bundle.pause;
  const menuT = bundle.menu;

  const [subModal, setSubModal] = useState<'none' | 'options' | 'controls'>('none');
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [poppedCell, setPoppedCell] = useState<string | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, []);

  const triggerPop = (id: string, cb: () => void) => {
    soundEngine.playUICellPop();
    setPoppedCell(id);
    if (timerRef.current) window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setPoppedCell(null), 240);
    cb();
  };

  const items: { id: string; label: string; onClick: () => void }[] = [
    { id: 'resume', label: t.resume, onClick: onResume },
    { id: 'options', label: menuT.settings, onClick: () => setSubModal('options') },
    { id: 'controls', label: menuT.controls, onClick: () => setSubModal('controls') },
    { id: 'restart', label: t.restartNight, onClick: onRestartNight },
    { id: 'exit', label: t.mainMenu, onClick: onMainMenu },
  ];

  return (
    <div className="absolute inset-0 z-50 bg-black/75 flex flex-col items-center justify-center p-3 font-sans select-none">
      {subModal === 'none' && (
        <nav
          aria-label={t.title}
          className="w-full max-w-sm flex flex-col items-center justify-center gap-1 sm:gap-2 max-h-[92dvh] overflow-y-auto py-2"
        >
          {items.map((item, idx) => {
            const isHighlighted = activeIdx === idx;
            return (
              <button
                key={item.id}
                type="button"
                onMouseEnter={() => setActiveIdx(idx)}
                onFocus={() => setActiveIdx(idx)}
                onClick={() => triggerPop(item.id, item.onClick)}
                className={`w-full max-w-[300px] sm:max-w-[340px] py-1.5 sm:py-2 px-6 text-center text-xs sm:text-base uppercase tracking-[0.2em] cursor-pointer transition-all whitespace-nowrap ${
                  poppedCell === item.id ? 'animate-cell-pop' : ''
                } ${
                  isHighlighted
                    ? 'bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.26)_50%,transparent_100%)] text-white font-black drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]'
                    : 'bg-transparent text-neutral-300/75 hover:text-white font-semibold'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}

      {subModal === 'options' && (
        <OptionsModal
          settings={settings}
          onUpdateSettings={onUpdateSettings}
          onClose={() => setSubModal('none')}
        />
      )}

      {subModal === 'controls' && (
        <ControlsModal
          language={settings.language}
          onClose={() => setSubModal('none')}
        />
      )}
    </div>
  );
};
