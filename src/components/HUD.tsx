import React, { useState, useRef, useEffect } from 'react';
import { ObjectiveStep, PlayerStats, NightState, Language } from '../types/game';
import { CheckCircle2, ChevronRight } from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface HUDProps {
  stats: PlayerStats;
  nightState: NightState;
  activeObjective: ObjectiveStep | null;
  objectiveCompletedNotice: string | null;
  interactionPrompt: string | null;
  onPauseClick: () => void;
  language: Language;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  nightState,
  activeObjective,
  objectiveCompletedNotice,
  interactionPrompt,
  onPauseClick,
  language,
}) => {
  const t = getTranslations(language).hud;
  const [pausePopped, setPausePopped] = useState(false);
  const popTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
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
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-mono text-white">
      {/* Subtle CRT Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* TOP BAR: Compact Single Active Sequential Objective & Digital Clock */}
      <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
        {/* COMPACT SINGLE ACTIVE OBJECTIVE CONTAINER */}
        <div className="pointer-events-auto bg-black/85 border border-neutral-700/80 rounded-lg px-2.5 py-2 max-w-[235px] sm:max-w-[275px] w-auto shadow-xl">
          <div className="flex items-center justify-between gap-2 text-[9px] text-amber-500 font-bold uppercase tracking-wider pb-1 border-b border-neutral-800">
            <span className="flex items-center gap-1 truncate">
              <ChevronRight className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">{t.nightShiftEmployee(nightState.night)}</span>
            </span>
            <span className="text-neutral-400 shrink-0">
              {t.stepLabel(nightState.currentObjectiveIndex + 1)}
            </span>
          </div>

          {activeObjective ? (
            <div className="mt-1.5">
              <div className="text-[11px] font-bold text-amber-300 uppercase tracking-wide leading-tight mb-0.5">
                {activeObjective.title}
              </div>
              <p className="text-[11px] text-neutral-200 leading-snug">
                {activeObjective.description}
              </p>
            </div>
          ) : (
            <div className="mt-1.5 text-[11px] text-emerald-400 font-bold">
              {t.allDutiesDone}
            </div>
          )}
        </div>

        {/* OBJECTIVE COMPLETED BANNER POPUP */}
        {objectiveCompletedNotice && (
          <div className="bg-emerald-950/95 border-2 border-emerald-500 text-emerald-200 text-xs font-bold px-4 py-2 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="tracking-wide uppercase font-black">{objectiveCompletedNotice}</span>
          </div>
        )}

        {/* Top Right: Digital Shift Clock & Pause */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-black/85 border border-neutral-700/80 rounded-lg px-3.5 py-1.5 text-right shadow-xl">
            <div className="text-[9px] text-neutral-400 uppercase tracking-widest">{t.shiftClock}</div>
            <div className="text-lg font-black text-amber-400 tabular-nums tracking-wider leading-tight">
              {timeString}
            </div>
            <div className="text-[9px] text-neutral-400 uppercase tracking-wider">
              {nightState.timeHour >= 6 ? t.dawnLabel : t.closingLabel}
            </div>
          </div>

          <button
            onClick={handlePauseClick}
            className={`pointer-events-auto bg-neutral-900/90 hover:bg-neutral-800 active:scale-95 text-neutral-300 border border-neutral-700 text-xs px-3 py-2 rounded-lg font-bold cursor-pointer transition-all shadow-lg whitespace-nowrap ${
              pausePopped ? 'animate-cell-pop' : ''
            }`}
          >
            {t.escPause}
          </button>
        </div>
      </div>

      {/* CENTER INTERACTION CROSSHAIR & PROMPT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_4px_white]" />

        {interactionPrompt && (
          <div className="mt-4 px-3.5 py-1.5 bg-black/95 border border-amber-400 text-amber-300 font-bold text-xs tracking-wider rounded-md shadow-2xl">
            {interactionPrompt}
          </div>
        )}
      </div>

      {/* BOTTOM CENTER: Carried Inventory Item indicator */}
      {(stats.hasTrashInHand || stats.hasCardboardInHand || stats.hasFoodInHand || stats.hasMopInHand) && (
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-center pointer-events-none">
          <div
            className={`px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase shadow-lg text-center border ${
              stats.hasFoodInHand && stats.mustDiscardFood
                ? 'bg-red-950/90 border-red-500 text-red-200'
                : 'bg-amber-950/90 border-amber-500 text-amber-200'
            }`}
          >
            {stats.hasFoodInHand
              ? stats.mustDiscardFood
                ? t.carryingSpoiledFood
                : t.carryingFood
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

