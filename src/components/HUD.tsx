import React from 'react';
import { ObjectiveStep, PlayerStats, NightState } from '../types/game';
import { Flashlight, CheckCircle2, ChevronRight } from 'lucide-react';

interface HUDProps {
  stats: PlayerStats;
  nightState: NightState;
  activeObjective: ObjectiveStep | null;
  objectiveCompletedNotice: string | null;
  interactionPrompt: string | null;
  onPauseClick: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  stats,
  nightState,
  activeObjective,
  objectiveCompletedNotice,
  interactionPrompt,
  onPauseClick,
}) => {
  const hourDisplay = nightState.timeHour === 0 ? 12 : nightState.timeHour;
  const minuteDisplay =
    nightState.timeMinute < 10 ? `0${nightState.timeMinute}` : nightState.timeMinute;
  const timeString = `${hourDisplay}:${minuteDisplay} AM`;

  return (
    <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-mono text-white">
      {/* Subtle CRT Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_45%,rgba(0,0,0,0.7)_100%)] pointer-events-none" />

      {/* TOP BAR: Single Active Sequential Objective & Digital Clock */}
      <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
        {/* SINGLE ACTIVE OBJECTIVE CONTAINER */}
        <div className="pointer-events-auto bg-black/90 border border-neutral-700/80 rounded-lg p-3.5 max-w-md w-full shadow-2xl backdrop-blur-none">
          <div className="flex items-center justify-between text-[10px] text-amber-500 font-bold uppercase tracking-widest pb-1 border-b border-neutral-800">
            <span className="flex items-center gap-1.5">
              <ChevronRight className="w-3.5 h-3.5 text-amber-400" />
              Night {nightState.night} Shift — Employee: Duck
            </span>
            <span className="text-neutral-400">Step {nightState.currentObjectiveIndex + 1}</span>
          </div>

          {/* Active Task (Only ONE displayed at a time) */}
          {activeObjective ? (
            <div className="mt-2.5 transition-all duration-300">
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wide mb-1">
                {activeObjective.title}
              </div>
              <p className="text-xs text-neutral-200 leading-relaxed">
                {activeObjective.description}
              </p>
            </div>
          ) : (
            <div className="mt-2 text-xs text-emerald-400 font-bold">
              All duties completed for this shift!
            </div>
          )}
        </div>

        {/* OBJECTIVE COMPLETED BANNER POPUP */}
        {objectiveCompletedNotice && (
          <div className="bg-emerald-950/95 border-2 border-emerald-500 text-emerald-200 text-xs font-bold px-6 py-2.5 rounded-lg shadow-[0_0_25px_rgba(16,185,129,0.4)] flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span className="tracking-wide uppercase font-black">{objectiveCompletedNotice}</span>
          </div>
        )}

        {/* Top Right: Digital Shift Clock & Pause */}
        <div className="flex items-center gap-3">
          <div className="bg-black/85 border border-neutral-700/80 rounded-lg px-4 py-2 text-right shadow-2xl">
            <div className="text-[10px] text-neutral-400 uppercase tracking-widest">Shift Clock</div>
            <div className="text-xl font-black text-amber-400 tabular-nums tracking-wider">{timeString}</div>
            <div className="text-[10px] text-neutral-400 uppercase tracking-wider">
              {nightState.timeHour >= 6 ? 'DAWN (6:00 AM)' : 'CLOSING AT 6:00 AM'}
            </div>
          </div>

          <button
            onClick={onPauseClick}
            className="pointer-events-auto bg-neutral-900/90 hover:bg-neutral-800 text-neutral-300 border border-neutral-700 text-xs px-3.5 py-2.5 rounded-lg font-bold cursor-pointer transition-colors shadow-lg"
          >
            ESC / PAUSE
          </button>
        </div>
      </div>

      {/* CENTER INTERACTION CROSSHAIR & PROMPT */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-[0_0_4px_white]" />

        {interactionPrompt && (
          <div className="mt-4 px-4 py-2 bg-black/95 border border-amber-400 text-amber-300 font-bold text-xs tracking-wider rounded-md shadow-2xl animate-pulse">
            {interactionPrompt}
          </div>
        )}
      </div>

      {/* BOTTOM STATUS BAR (Stamina & Unlimited Flashlight & Carried Items) */}
      <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
        {/* Left: Stamina */}
        <div className="bg-black/85 border border-neutral-700/80 rounded-lg p-3 min-w-[210px] shadow-2xl">
          <div className="flex justify-between items-center text-[10px] uppercase text-neutral-400 mb-1">
            <span>Stamina</span>
            <span className="tabular-nums text-neutral-300">{Math.round(stats.stamina)}%</span>
          </div>
          <div className="w-full bg-neutral-800 h-2 rounded overflow-hidden">
            <div
              className={`h-full transition-all duration-75 ${
                stats.stamina < 25 ? 'bg-red-600' : stats.stamina < 60 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${stats.stamina}%` }}
            />
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-neutral-400">STANCE:</span>
            <span className={`font-bold ${stats.isCrouched ? 'text-amber-400' : 'text-neutral-300'}`}>
              {stats.isCrouched ? '[C] CROUCHED' : '[C] STANDING'}
            </span>
          </div>
        </div>

        {/* Center: Carried Inventory Item indicator */}
        {(stats.hasTrashInHand || stats.hasCardboardInHand) && (
          <div className="bg-amber-950/90 border border-amber-500 text-amber-200 px-4 py-1.5 rounded text-xs font-bold tracking-wider uppercase animate-pulse">
            {stats.hasTrashInHand
              ? '📦 Carrying Dining Trash Bags (Take to rear dumpster)'
              : '📦 Carrying Cardboard Bundle (Take to rear dumpster)'}
          </div>
        )}

        {/* Right: Flashlight Status */}
        <div className="bg-black/85 border border-neutral-700/80 rounded-lg p-3 min-w-[210px] shadow-2xl text-right">
          <div className="flex justify-between items-center text-[10px] uppercase text-neutral-400 mb-1">
            <span className="flex items-center gap-1.5">
              <Flashlight className="w-3.5 h-3.5 text-amber-400" />
              Heavy Worklight [F]
            </span>
            <span className="text-emerald-400 font-bold">UNLIMITED</span>
          </div>

          <div className="mt-2 flex items-center justify-between text-[10px]">
            <span className="text-neutral-400">STATUS:</span>
            <span className={`font-bold ${stats.flashlightOn ? 'text-emerald-400' : 'text-neutral-500'}`}>
              {stats.flashlightOn ? 'BEAM ACTIVE' : 'BEAM OFF'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
