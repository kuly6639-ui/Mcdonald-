import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Settings as SettingsIcon,
  Info,
  HelpCircle,
  Lock,
  Moon,
  Flame,
  Volume2,
  VolumeX,
  Music,
  Globe,
} from 'lucide-react';
import { GameNight, GameSettings, GraphicsQuality } from '../types/game';
import { McDonaldsLogo } from './McDonaldsLogo';
import { getTranslations, LANGUAGE_OPTIONS } from '../i18n/translations';

interface MainMenuProps {
  onStartNight: (night: GameNight) => void;
  settings: GameSettings;
  onUpdateSettings: (s: Partial<GameSettings>) => void;
  night2Unlocked: boolean;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartNight,
  settings,
  onUpdateSettings,
  night2Unlocked,
}) => {
  const [modal, setModal] = useState<'none' | 'settings' | 'credits' | 'controls'>('none');
  const [bgmMuted, setBgmMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const bundle = getTranslations(settings.language);
  const t = bundle.menu;

  // Background Music playback for user's attached soundtrack
  useEffect(() => {
    const audio = new Audio('/assets/aistudio/cold_glass_passage_7ecca980.mp4');
    audio.loop = true;
    audio.volume = bgmMuted ? 0 : Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    audioRef.current = audio;

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const onFirstInteraction = () => {
          if (audioRef.current && !bgmMuted) {
            audioRef.current.play().catch(() => {});
          }
          window.removeEventListener('click', onFirstInteraction);
          window.removeEventListener('keydown', onFirstInteraction);
        };
        window.addEventListener('click', onFirstInteraction);
        window.addEventListener('keydown', onFirstInteraction);
      });
    }

    return () => {
      audio.pause();
      audio.src = '';
      audioRef.current = null;
    };
  }, []);

  // Sync volume with settings
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = bgmMuted ? 0 : Math.max(0, Math.min(1, settings.masterVolume * 0.75));
    }
  }, [settings.masterVolume, bgmMuted]);

  const handleStartNight = (night: GameNight) => {
    if (audioRef.current) {
      try {
        audioRef.current.pause();
      } catch (e) {}
    }
    onStartNight(night);
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-between p-4 md:p-12 font-mono select-none overflow-hidden bg-gradient-to-r from-black/85 via-black/50 to-transparent">
      {/* Subtle vignette highlighting the outside store in 3D */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_50%,transparent_30%,rgba(0,0,0,0.65)_100%)] pointer-events-none" />

      {/* LEFT COLUMN: TITLE & ACTION BUTTONS */}
      <div className="relative z-10 max-w-md w-full flex flex-col justify-between h-full max-h-[94vh] py-4 px-6 rounded-2xl bg-black/75 border border-neutral-800/90 shadow-2xl overflow-y-auto">
        <div>
          {/* Language Quick Switcher */}
          <div className="flex items-center justify-between gap-2 pb-2.5 mb-3 border-b border-neutral-800/90">
            <span className="flex items-center gap-1.5 text-[10px] text-neutral-400 uppercase tracking-wider font-bold">
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              {bundle.languageLabel}
            </span>
            <div className="flex items-center gap-1">
              {LANGUAGE_OPTIONS.map((opt) => {
                const active = (settings.language || 'en') === opt.code;
                return (
                  <button
                    key={opt.code}
                    onClick={() => onUpdateSettings({ language: opt.code })}
                    title={opt.label}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold border cursor-pointer transition-colors ${
                      active
                        ? 'bg-amber-600 text-white border-amber-400'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800 hover:text-neutral-200'
                    }`}
                  >
                    {opt.short}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Header with authentic McDonald's Logo */}
          <div className="flex items-center gap-3.5 mb-3">
            <McDonaldsLogo size="md" neon={true} />
            <div>
              <div className="text-red-500 font-black text-[11px] uppercase tracking-widest flex items-center gap-1.5">
                <span>{t.est}</span>
                <span className="text-neutral-500">•</span>
                <span className="text-amber-400">{t.nightShift}</span>
              </div>
              <div className="text-[10px] text-neutral-400 font-semibold tracking-wider uppercase">
                {t.survivalHorror}
              </div>
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-black text-amber-400 tracking-tight leading-none drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)]">
            MCDONALD'S<br />
            <span className="text-red-600 font-black tracking-widest text-2xl md:text-3xl">
              NIGHTFALL
            </span>
          </h1>

          <div className="mt-2 inline-flex items-center gap-2">
            <span className="px-2 py-0.5 bg-neutral-900 border border-amber-500/40 text-amber-300 text-[10px] font-bold uppercase tracking-widest rounded">
              {t.outsideClearing}
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {t.storeActive}
            </span>
          </div>

          <p className="mt-3 text-[11px] text-neutral-300 max-w-sm leading-relaxed">
            {t.description}
          </p>

          <div className="mt-2.5 px-2.5 py-1.5 rounded bg-amber-500/10 border border-amber-500/30 text-[10px] text-amber-300 flex items-center gap-1.5">
            <Flame className="w-3.5 h-3.5 text-red-400 shrink-0" />
            <span>
              <strong>{t.tipBefore}</strong>{' '}
              <kbd className="px-1 py-0.5 rounded bg-neutral-900 border border-neutral-700 text-white font-bold">
                Shift
              </kbd>{' '}
              {t.tipRun} <strong className="text-white">{bundle.mobile.run}</strong> {t.tipMobile}
            </span>
          </div>
        </div>

        {/* Buttons List */}
        <div className="space-y-2.5 my-5">
          <button
            onClick={() => handleStartNight(1)}
            className="w-full flex items-center justify-between px-6 py-3.5 bg-red-700 hover:bg-red-600 active:scale-98 text-white font-bold text-sm tracking-widest rounded border border-red-500 shadow-[0_0_20px_rgba(220,38,38,0.4)] cursor-pointer transition-all"
          >
            <span className="flex items-center gap-2">
              <Play className="w-4 h-4 fill-white" />
              {t.playNight1}
            </span>
            <span className="text-xs text-amber-300">{t.firstShift}</span>
          </button>

          <button
            onClick={() => handleStartNight(2)}
            disabled={!night2Unlocked}
            className={`w-full flex items-center justify-between px-6 py-3.5 rounded border text-sm font-bold tracking-widest transition-all ${
              night2Unlocked
                ? 'bg-neutral-900 hover:bg-neutral-800 text-amber-300 border-amber-500/60 cursor-pointer shadow-lg'
                : 'bg-neutral-950/80 text-neutral-600 border-neutral-800 cursor-not-allowed'
            }`}
          >
            <span className="flex items-center gap-2">
              <Moon className="w-4 h-4" />
              {t.playNight2} {night2Unlocked ? '' : t.locked}
            </span>
            <span className="text-xs text-neutral-500">{t.somethingWrong}</span>
          </button>

          {/* Locked Night 3 Teaser Button */}
          <div className="w-full flex items-center justify-between px-6 py-3 rounded border border-neutral-800 bg-neutral-950/50 text-neutral-600 text-xs font-bold tracking-widest opacity-80 cursor-not-allowed">
            <span className="flex items-center gap-2">
              <Lock className="w-3.5 h-3.5" />
              {t.night3Hunt}
            </span>
            <span className="text-[10px] text-red-500/80 uppercase font-black">
              {t.fullGameTeaser}
            </span>
          </div>

          {/* Soundtrack BGM status & toggle */}
          <div className="flex items-center justify-between px-2.5 py-1.5 bg-neutral-950/80 border border-neutral-800 rounded text-[10px] text-neutral-400">
            <span className="flex items-center gap-1.5 text-amber-300 font-semibold truncate">
              <Music className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
              <span className="truncate">{t.bgmLabel}</span>
            </span>
            <button
              onClick={() => setBgmMuted(!bgmMuted)}
              className="flex items-center gap-1 px-2 py-0.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-[10px] text-neutral-200 font-bold cursor-pointer shrink-0 transition-colors"
            >
              {bgmMuted ? (
                <>
                  <VolumeX className="w-3 h-3 text-red-400" />
                  <span>{t.unmute}</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3 h-3 text-emerald-400" />
                  <span>{t.musicOn}</span>
                </>
              )}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2">
            <button
              onClick={() => setModal('controls')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              {t.controls}
            </button>

            <button
              onClick={() => setModal('settings')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
              {t.settings}
            </button>

            <button
              onClick={() => setModal('credits')}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded text-xs text-neutral-300 font-bold cursor-pointer transition-colors"
            >
              <Info className="w-3.5 h-3.5" />
              {t.credits}
            </button>
          </div>
        </div>

        {/* Story Directive Badge */}
        <div className="bg-neutral-950/90 border border-neutral-800 rounded p-2.5 text-[11px] text-neutral-400 leading-snug">
          <strong className="text-amber-400">{t.storyRuleLabel}</strong> {t.storyRule}
        </div>
      </div>

      {/* RIGHT COLUMN: SHIFT OVERVIEW */}
      <div className="hidden lg:flex flex-col gap-4 max-w-sm relative z-10">
        <div className="bg-neutral-950/90 border border-neutral-800 rounded-lg p-5 shadow-2xl">
          <div className="text-xs text-amber-400 font-bold uppercase tracking-wider mb-2">{t.shiftMemo}</div>
          <h3 className="text-sm font-bold text-neutral-200 mb-2">{t.employeeRoutine}</h3>
          <ul className="text-xs text-neutral-400 space-y-2 list-disc list-inside">
            {t.memoItems.map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* MODAL: SETTINGS */}
      {modal === 'settings' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.settingsTitle}
            </h2>

            <div className="space-y-4 text-xs text-neutral-300">
              {/* Language Selector */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>{bundle.languageLabel}</span>
                  <span className="font-bold text-amber-400">{bundle.languageName}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {LANGUAGE_OPTIONS.map((opt) => (
                    <button
                      key={opt.code}
                      onClick={() => onUpdateSettings({ language: opt.code })}
                      className={`py-1.5 px-2 rounded font-bold text-xs border cursor-pointer transition-colors ${
                        (settings.language || 'en') === opt.code
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Graphics Quality */}
              <div>
                <div className="flex justify-between mb-1.5">
                  <span>{t.graphicsQuality}</span>
                  <span className="font-bold text-amber-400 uppercase">
                    {t.qualityLevels[settings.graphicsQuality]}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['low', 'medium', 'high'] as GraphicsQuality[]).map((q) => (
                    <button
                      key={q}
                      onClick={() => onUpdateSettings({ graphicsQuality: q })}
                      className={`py-1.5 rounded uppercase font-bold text-xs border cursor-pointer ${
                        settings.graphicsQuality === q
                          ? 'bg-amber-600 text-white border-amber-400'
                          : 'bg-neutral-900 text-neutral-400 border-neutral-700 hover:bg-neutral-800'
                      }`}
                    >
                      {t.qualityLevels[q]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Volume */}
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t.audioVolume}</span>
                  <span className="tabular-nums">{Math.round(settings.masterVolume * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={settings.masterVolume}
                  onChange={(e) => onUpdateSettings({ masterVolume: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Mouse Sensitivity */}
              <div>
                <div className="flex justify-between mb-1">
                  <span>{t.mouseSensitivity}</span>
                  <span className="tabular-nums">{settings.mouseSensitivity.toFixed(1)}x</span>
                </div>
                <input
                  type="range"
                  min="0.4"
                  max="3.0"
                  step="0.1"
                  value={settings.mouseSensitivity}
                  onChange={(e) => onUpdateSettings({ mouseSensitivity: parseFloat(e.target.value) })}
                  className="w-full accent-amber-500"
                />
              </div>

              {/* Invert Look */}
              <div className="flex items-center justify-between pt-2">
                <span>{t.invertLook}</span>
                <button
                  onClick={() => onUpdateSettings({ invertY: !settings.invertY })}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border ${
                    settings.invertY
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.invertY ? t.enabled : t.disabled}
                </button>
              </div>

              {/* CRT Scanline */}
              <div className="flex items-center justify-between pt-2">
                <span>{t.crtFilter}</span>
                <button
                  onClick={() => onUpdateSettings({ crtFilter: !settings.crtFilter })}
                  className={`px-3 py-1 rounded text-xs font-bold cursor-pointer border ${
                    settings.crtFilter
                      ? 'bg-amber-600 text-white border-amber-400'
                      : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                  }`}
                >
                  {settings.crtFilter ? t.enabled : t.disabled}
                </button>
              </div>
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              {t.applyClose}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CONTROLS */}
      {modal === 'controls' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.controlsTitle}
            </h2>

            <div className="space-y-3 text-xs text-neutral-300">
              {t.controlsList.map((row, idx) => (
                <div key={idx} className="flex justify-between gap-4 border-b border-neutral-800 pb-1">
                  <span className="text-amber-400 font-bold shrink-0">{row.key}</span>
                  <span className="text-right">{row.desc}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              {t.understood}
            </button>
          </div>
        </div>
      )}

      {/* MODAL: CREDITS */}
      {modal === 'credits' && (
        <div className="absolute inset-0 z-50 bg-black/85 flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-700 rounded-lg p-6 max-w-md w-full shadow-2xl">
            <h2 className="text-lg font-bold text-amber-400 uppercase tracking-wider mb-4 border-b border-neutral-800 pb-2">
              {t.creditsTitle}
            </h2>

            <div className="space-y-3 text-xs text-neutral-300 leading-relaxed">
              <p>{t.creditsIntro}</p>
              <div className="border-t border-neutral-800 pt-2 space-y-1">
                {t.creditsDetails.map((d, idx) => (
                  <div key={idx}>
                    <strong>{d.label}:</strong> {d.value}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => setModal('none')}
              className="mt-6 w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded border border-neutral-600 cursor-pointer"
            >
              {t.returnMenu}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
