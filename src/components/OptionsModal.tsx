import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { GameSettings, GraphicsQuality, Language } from '../types/game';
import { getTranslations, LANGUAGE_OPTIONS } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

type OptionsTab = 'audio' | 'video' | 'controls' | 'gameplay';

interface OptionsModalProps {
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  onClose: () => void;
  backLabel?: string;
}

const TAB_LABELS: Record<Language, Record<OptionsTab, string> & { title: string; back: string }> = {
  en: {
    title: 'OPTIONS',
    audio: 'AUDIO',
    video: 'VIDEO',
    controls: 'CONTROLS',
    gameplay: 'GAMEPLAY',
    back: 'BACK',
  },
  vi: {
    title: 'TÙY CHỈNH',
    audio: 'ÂM THANH',
    video: 'ĐỒ HỌA',
    controls: 'ĐIỀU KHIỂN',
    gameplay: 'TRÒ CHƠI',
    back: 'QUAY LẠI',
  },
  ru: {
    title: 'НАСТРОЙКИ',
    audio: 'ЗВУК',
    video: 'ВИДЕО',
    controls: 'УПРАВЛЕНИЕ',
    gameplay: 'ИГРА',
    back: 'НАЗАД',
  },
  id: {
    title: 'OPSI',
    audio: 'AUDIO',
    video: 'VIDEO',
    controls: 'KONTROL',
    gameplay: 'GAMEPLAY',
    back: 'KEMBALI',
  },
};

export const OptionsModal: React.FC<OptionsModalProps> = ({
  settings,
  onUpdateSettings,
  onClose,
  backLabel,
}) => {
  const [activeTab, setActiveTab] = useState<OptionsTab>('video');
  const lang: Language = settings.language || 'en';
  const bundle = getTranslations(lang);
  const t = bundle.menu;
  const labels = TAB_LABELS[lang] || TAB_LABELS.en;

  const qualityOrder: GraphicsQuality[] = ['low', 'medium', 'high'];

  const stepQuality = (dir: -1 | 1) => {
    soundEngine.playUICellPop();
    const idx = qualityOrder.indexOf(settings.graphicsQuality);
    const nextIdx = (idx + dir + qualityOrder.length) % qualityOrder.length;
    onUpdateSettings({ graphicsQuality: qualityOrder[nextIdx] });
  };

  const stepVolume = (dir: -1 | 1) => {
    soundEngine.playUICellPop();
    const next = Math.max(0, Math.min(1, Math.round((settings.masterVolume + dir * 0.05) * 100) / 100));
    onUpdateSettings({ masterVolume: next });
  };

  const stepSensitivity = (dir: -1 | 1) => {
    soundEngine.playUICellPop();
    const next = Math.max(0.4, Math.min(3.0, Math.round((settings.mouseSensitivity + dir * 0.2) * 10) / 10));
    onUpdateSettings({ mouseSensitivity: next });
  };

  const stepLanguage = (dir: -1 | 1) => {
    soundEngine.playUICellPop();
    const idx = Math.max(
      0,
      LANGUAGE_OPTIONS.findIndex((o) => o.code === lang)
    );
    const nextIdx = (idx + dir + LANGUAGE_OPTIONS.length) % LANGUAGE_OPTIONS.length;
    onUpdateSettings({ language: LANGUAGE_OPTIONS[nextIdx].code });
  };

  const toggleInvertY = () => {
    soundEngine.playUICellPop();
    onUpdateSettings({ invertY: !settings.invertY });
  };

  const toggleCRT = () => {
    soundEngine.playUICellPop();
    onUpdateSettings({ crtFilter: !settings.crtFilter });
  };

  const renderStepperRow = (
    label: string,
    valueText: string,
    onPrev: () => void,
    onNext: () => void
  ) => (
    <div className="grid grid-cols-[1fr_auto] items-center gap-4 py-1.5 sm:py-2">
      <span className="text-xs sm:text-sm font-semibold text-white tracking-wide text-left">
        {label}
      </span>
      <div className="flex items-center justify-end gap-2 sm:gap-4 min-w-[140px] sm:min-w-[190px]">
        <button
          type="button"
          onClick={onPrev}
          aria-label={`Decrease ${label}`}
          className="p-1 text-neutral-400 hover:text-white active:scale-90 cursor-pointer transition-colors"
        >
          <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
        <span className="flex-1 text-center text-xs sm:text-sm text-neutral-200 font-medium tabular-nums whitespace-nowrap">
          {valueText}
        </span>
        <button
          type="button"
          onClick={onNext}
          aria-label={`Increase ${label}`}
          className="p-1 text-neutral-400 hover:text-white active:scale-90 cursor-pointer transition-colors"
        >
          <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-3 sm:p-6 font-sans select-none"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="relative w-[94%] max-w-2xl max-h-[90dvh] flex flex-col border-b border-l border-r border-white/85 bg-black/55 backdrop-blur-[2px] px-4 sm:px-10 pt-5 sm:pt-7 pb-4 sm:pb-6">
        {/* Top border with centered OPTIONS title breaking the line */}
        <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
          <div className="h-[1px] flex-1 bg-white/85" />
          <h2 className="px-3 sm:px-5 -translate-y-1/2 text-sm sm:text-xl font-black uppercase tracking-[0.2em] text-white whitespace-nowrap drop-shadow-[0_2px_6px_rgba(0,0,0,0.95)]">
            {labels.title}
          </h2>
          <div className="h-[1px] flex-1 bg-white/85" />
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-center gap-4 sm:gap-9 pb-3 sm:pb-5 overflow-x-auto">
          {(['audio', 'video', 'controls', 'gameplay'] as OptionsTab[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => {
                  soundEngine.playUICellPop();
                  setActiveTab(tab);
                }}
                className={`text-[11px] sm:text-sm uppercase tracking-[0.18em] cursor-pointer transition-colors whitespace-nowrap py-0.5 ${
                  isActive
                    ? 'text-white font-black'
                    : 'text-neutral-400/85 hover:text-neutral-200 font-semibold'
                }`}
              >
                {labels[tab]}
              </button>
            );
          })}
        </div>

        {/* Active Category Settings List */}
        <div className="flex-1 overflow-y-auto px-1 sm:px-8 py-1 sm:py-2 min-h-[110px] sm:min-h-[155px] flex flex-col justify-center">
          {activeTab === 'audio' && (
            <div className="space-y-1">
              {renderStepperRow(
                t.audioVolume,
                `${Math.round(settings.masterVolume * 100)}%`,
                () => stepVolume(-1),
                () => stepVolume(1)
              )}
            </div>
          )}

          {activeTab === 'video' && (
            <div className="space-y-1">
              {renderStepperRow(
                t.graphicsQuality,
                t.qualityLevels[settings.graphicsQuality],
                () => stepQuality(-1),
                () => stepQuality(1)
              )}
              {renderStepperRow(
                t.crtFilter,
                settings.crtFilter ? t.enabled : t.disabled,
                toggleCRT,
                toggleCRT
              )}
            </div>
          )}

          {activeTab === 'controls' && (
            <div className="space-y-1">
              {renderStepperRow(
                t.mouseSensitivity,
                `${settings.mouseSensitivity.toFixed(1)}x`,
                () => stepSensitivity(-1),
                () => stepSensitivity(1)
              )}
              {renderStepperRow(
                t.invertLook,
                settings.invertY ? t.enabled : t.disabled,
                toggleInvertY,
                toggleInvertY
              )}
            </div>
          )}

          {activeTab === 'gameplay' && (
            <div className="space-y-1">
              {renderStepperRow(
                bundle.languageLabel,
                bundle.languageName,
                () => stepLanguage(-1),
                () => stepLanguage(1)
              )}
            </div>
          )}
        </div>

        {/* Bottom-left BACK action */}
        <div className="pt-3 sm:pt-5 flex items-center justify-start">
          <button
            type="button"
            onClick={() => {
              soundEngine.playUICellPop();
              onClose();
            }}
            className="text-xs sm:text-sm font-bold uppercase tracking-[0.18em] text-neutral-300 hover:text-white active:scale-95 cursor-pointer transition-colors py-1 pr-3"
          >
            {backLabel || labels.back}
          </button>
        </div>
      </div>
    </div>
  );
};
