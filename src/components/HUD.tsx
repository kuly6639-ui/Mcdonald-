import React, { useState, useRef, useEffect } from 'react';
import { ObjectiveStep, PlayerStats, NightState, Language } from '../types/game';
import { CheckCircle2, ChevronRight, Smartphone, Music } from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface HUDProps {
  stats: PlayerStats;
  nightState: NightState;
  activeObjective: ObjectiveStep | null;
  objectiveCompletedNotice: string | null;
  interactionPrompt: string | null;
  onPauseClick: () => void;
  onPhoneClick: () => void;
  isPhoneOpen: boolean;
  language: Language;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  nightState,
  activeObjective,
  objectiveCompletedNotice,
  interactionPrompt,
  onPauseClick,
  onPhoneClick,
  isPhoneOpen,
  language,
}) => {
  const t = getTranslations(language).hud;
  const [pausePopped, setPausePopped] = useState(false);
  const [musicVis, setMusicVis] = useState(() => soundEngine.getMusicVisualizerState(14));
  const popTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    let rafId = 0;
    let lastTick = 0;
    const loop = (now: number) => {
      if (now - lastTick >= 45) {
        lastTick = now;
        setMusicVis(soundEngine.getMusicVisualizerState(14));
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(rafId);
      if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
      if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    };
  }, []);

  const handlePauseClick = () => {
    soundEngine.playUICellPop();
    setPausePopped(true);
    if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    popTimerRef.current = window.setTimeout(() => setPausePopped(false), 240);
    actionTimerRef.current = window.setTimeout(() => onPauseClick(), 130);
  };

  const hourDisplay = nightState.timeHour === 0 ? 12 : nightState.timeHour;
  const minuteDisplay =
    nightState.timeMinute < 10 ? `0${nightState.timeMinute}` : nightState.timeMinute;
  const timeString = `${hourDisplay}:${minuteDisplay} AM`;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-sans text-white">
      {/* Subtle CRT Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* Audio-Reactive Music Edge Glow Effect (Visible on music entry & chase sequences) */}
      {musicVis.active && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            boxShadow:
              musicVis.mode === 'chase'
                ? `inset 0 0 ${70 + musicVis.intensity * 65}px rgba(220, 38, 38, ${
                    0.22 + musicVis.intensity * 0.34
                  })`
                : `inset 0 0 ${48 + musicVis.intensity * 42}px rgba(255, 255, 255, ${
                    (0.05 + musicVis.intensity * 0.1) * Math.max(0.35, musicVis.entryBannerAlpha)
                  })`,
          }}
        />
      )}

      {/* Prominent Soundtrack Entry Banner with Animated Equalizer */}
      {musicVis.active && musicVis.entryBannerAlpha > 0.02 && (
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{
            opacity: musicVis.entryBannerAlpha,
            transform: `translate(-50%, ${(1 - musicVis.entryBannerAlpha) * -10}px)`,
          }}
        >
          <div
            className={`flex items-center gap-3 px-4 py-1.5 border backdrop-blur-[2px] shadow-2xl ${
              musicVis.mode === 'chase'
                ? 'bg-red-950/85 border-red-500/80 text-red-100'
                : 'bg-black/65 border-white/75 text-white'
            }`}
          >
            <Music
              className={`w-3.5 h-3.5 shrink-0 animate-pulse ${
                musicVis.mode === 'chase' ? 'text-red-400' : 'text-white'
              }`}
            />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] whitespace-nowrap">
              {musicVis.trackTitle}
            </span>
            <div className="flex items-end gap-[2px] h-3.5 w-14">
              {musicVis.bars.map((val, idx) => (
                <div
                  key={idx}
                  className={`flex-1 transition-[height] duration-75 ${
                    musicVis.mode === 'chase' ? 'bg-red-400' : 'bg-white/90'
                  }`}
                  style={{ height: `${Math.round(val * 100)}%` }}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TOP BAR: Settings-Harmonized White Cutout-Border Objective & Clock Panels */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
        {/* OBJECTIVE UI — Harmonized with Options/Settings 1px white cutout-border panel */}
        <div className="pointer-events-auto relative border-b border-l border-r border-white/85 bg-black/55 backdrop-blur-[2px] px-3 sm:px-4 pt-3.5 pb-2.5 max-w-[240px] sm:max-w-[295px] w-auto shadow-[0_4px_20px_rgba(0,0,0,0.65)]">
          {/* Top border broken by Objective title + step */}
          <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
            <div className="h-[1px] w-2.5 bg-white/85" />
            <div className="px-2 -translate-y-1/2 flex items-center gap-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.16em] text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
              <ChevronRight className="w-3 h-3 text-white/85 shrink-0" />
              <span className="truncate max-w-[140px]">
                {t.nightShiftEmployee(nightState.night)}
              </span>
              <span className="text-neutral-300 font-semibold">
                · {t.stepLabel(nightState.currentObjectiveIndex + 1)}
              </span>
            </div>
            <div className="h-[1px] flex-1 bg-white/85" />
          </div>

          {activeObjective ? (
            <div className="space-y-0.5">
              <div className="text-[11px] sm:text-xs font-black text-white uppercase tracking-[0.12em] leading-tight">
                {activeObjective.title}
              </div>
              <p className="text-[11px] text-neutral-200/95 leading-snug font-normal">
                {activeObjective.description}
              </p>
            </div>
          ) : (
            <div className="text-[11px] sm:text-xs text-white font-bold uppercase tracking-wider">
              {t.allDutiesDone}
            </div>
          )}
        </div>

        {/* OBJECTIVE COMPLETED BANNER POPUP */}
        {objectiveCompletedNotice && (
          <div className="bg-black/80 border border-white/85 text-white text-[11px] sm:text-xs font-bold px-4 py-2 shadow-2xl flex items-center gap-2 uppercase tracking-[0.14em]">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span>{objectiveCompletedNotice}</span>
          </div>
        )}

        {/* Top Right: Harmonized Clock Panel & Compact Actions */}
        <div className="flex items-start gap-2 shrink-0">
          <div className="relative border-b border-l border-r border-white/85 bg-black/55 backdrop-blur-[2px] px-3.5 sm:px-4 pt-3 pb-1.5 text-right shadow-[0_4px_20px_rgba(0,0,0,0.65)] min-w-[104px] sm:min-w-[122px]">
            {/* Top border broken by Shift Clock label */}
            <div className="pointer-events-none absolute top-0 inset-x-0 flex items-center">
              <div className="h-[1px] flex-1 bg-white/85" />
              <span className="px-2 -translate-y-1/2 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.18em] text-white whitespace-nowrap drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                {t.shiftClock}
              </span>
              <div className="h-[1px] w-2.5 bg-white/85" />
            </div>

            <div className="flex items-center justify-end gap-2">
              {musicVis.active && (
                <div className="flex items-end gap-[2px] h-2.5 w-7 opacity-85">
                  {musicVis.bars.slice(0, 6).map((val, idx) => (
                    <div
                      key={idx}
                      className={`flex-1 ${
                        musicVis.mode === 'chase' ? 'bg-red-400' : 'bg-white/90'
                      }`}
                      style={{ height: `${Math.round(val * 100)}%` }}
                    />
                  ))}
                </div>
              )}
              <div className="text-base sm:text-lg font-black text-white tabular-nums tracking-[0.14em] leading-tight">
                {timeString}
              </div>
            </div>
            <div className="text-[9px] text-neutral-300 uppercase tracking-[0.16em] mt-0.5">
              {nightState.timeHour >= 6 ? t.dawnLabel : t.closingLabel}
            </div>
          </div>

          <button
            onClick={() => {
              soundEngine.playUICellPop();
              onPhoneClick();
            }}
            className={`pointer-events-auto flex items-center gap-1.5 active:scale-95 border text-[11px] px-2.5 py-2 font-bold uppercase tracking-[0.14em] cursor-pointer transition-all shadow-lg whitespace-nowrap ${
              isPhoneOpen
                ? 'bg-white text-black border-white'
                : 'bg-black/55 hover:bg-white/15 text-white border-white/70'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>{t.phoneHint}</span>
          </button>

          <button
            onClick={handlePauseClick}
            className={`pointer-events-auto bg-black/55 hover:bg-white/15 active:scale-95 text-white border border-white/70 text-[11px] px-2.5 py-2 font-bold uppercase tracking-[0.14em] cursor-pointer transition-all shadow-lg whitespace-nowrap ${
              pausePopped ? 'animate-cell-pop' : ''
            }`}
          >
            {t.escPause}
          </button>
        </div>
      </div>

      {/* CENTER INTERACTION CROSSHAIR & PROMPT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-white/80 shadow-[0_0_4px_white]" />

        {interactionPrompt && (
          <div className="mt-4 px-4 py-1.5 bg-black/75 border border-white/80 text-white font-bold text-xs uppercase tracking-[0.14em] shadow-2xl">
            {interactionPrompt}
          </div>
        )}
      </div>

      {/* BOTTOM CENTER: Carried Inventory Item indicator */}
      {(stats.hasTrashInHand ||
        stats.hasCardboardInHand ||
        stats.hasFoodInHand ||
        stats.hasRawFryItemsInHand ||
        stats.hasBigMacInHand ||
        stats.hasCoffeeCupInHand ||
        stats.hasSodaCupInHand ||
        stats.hasMopInHand ||
        stats.hasChickenTrayInHand ||
        stats.hasNoodlesAndDrinkInHand) && (
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center pointer-events-none">
          <div
            className={`px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase shadow-lg text-center border ${
              stats.hasFoodInHand && stats.mustDiscardFood
                ? 'bg-red-950/90 border-red-500 text-red-200'
                : stats.hasNoodlesAndDrinkInHand
                ? 'bg-orange-950/90 border-orange-400 text-orange-100'
                : stats.hasChickenTrayInHand
                ? 'bg-sky-950/90 border-sky-400 text-sky-200'
                : stats.hasCoffeeCupInHand || stats.hasSodaCupInHand
                ? 'bg-emerald-950/90 border-emerald-400 text-emerald-100'
                : stats.hasRawFryItemsInHand || stats.hasBigMacInHand
                ? 'bg-yellow-950/90 border-yellow-400 text-yellow-100'
                : 'bg-amber-950/90 border-amber-500 text-amber-200'
            }`}
          >
            {stats.hasFoodInHand
              ? stats.mustDiscardFood
                ? t.carryingSpoiledFood
                : t.carryingFood
              : stats.hasRawFryItemsInHand
              ? t.carryingRawFry
              : stats.hasBigMacInHand
              ? t.carryingBigMac
              : stats.hasCoffeeCupInHand
              ? t.carryingCoffeeCup
              : stats.hasSodaCupInHand
              ? t.carryingSodaCup
              : stats.hasNoodlesAndDrinkInHand
              ? t.carryingNoodlesAndDrink
              : stats.hasChickenTrayInHand
              ? t.carryingChickenTray
              : stats.hasMopInHand
              ? t.carryingMop
              : stats.hasTrashInHand
              ? t.carryingTrash
              : t.carryingCardboard}
          </div>
        </div>
      )}
    </div>
  );
};

