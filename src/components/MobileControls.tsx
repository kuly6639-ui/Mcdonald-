import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameNight, Language, PlayerStats } from '../types/game';
import {
  Flashlight,
  Pause,
  Hand,
  ChevronDown,
  ChevronUp,
  Flame,
  Smartphone,
} from 'lucide-react';
import { getTranslations } from '../i18n/translations';
import { soundEngine } from '../audio/SoundEngine';

interface MobileControlsProps {
  engine: GameEngine | null;
  stats: PlayerStats;
  night: GameNight;
  onPause: () => void;
  onPhone: () => void;
  isPhoneOpen: boolean;
  showMobileControls: boolean;
  language: Language;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  engine,
  stats,
  night,
  onPause,
  onPhone,
  isPhoneOpen,
  showMobileControls,
  language,
}) => {
  const t = getTranslations(language).mobile;

  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);

  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprintingMobile, setIsSprintingMobile] = useState(false);
  const [poppedBtn, setPoppedBtn] = useState<string | null>(null);
  const popTimerRef = useRef<number | null>(null);
  const actionTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
      if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    };
  }, []);

  const triggerBtnPop = (id: string, cb: () => void, delayMs: number = 0) => {
    soundEngine.playUICellPop();
    setPoppedBtn(id);
    if (popTimerRef.current) window.clearTimeout(popTimerRef.current);
    if (actionTimerRef.current) window.clearTimeout(actionTimerRef.current);
    popTimerRef.current = window.setTimeout(() => setPoppedBtn(null), 240);
    if (delayMs > 0) {
      actionTimerRef.current = window.setTimeout(() => cb(), delayMs);
    } else {
      cb();
    }
  };

  const touchIdRef = useRef<number | null>(null);
  const baseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  useEffect(() => {
    if ((!showMobileControls || night === 3) && engine) {
      engine.setMobileSprint(false);
      setIsSprintingMobile(false);
    }
    if (!showMobileControls && engine) {
      engine.setMobileMove(0, 0);
      setKnobPos({ x: 0, y: 0 });
      setJoystickActive(false);
    }
  }, [showMobileControls, night, engine]);

  const handleJoystickTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (touchIdRef.current !== null) return;

    const touch = e.changedTouches[0];
    touchIdRef.current = touch.identifier;

    if (joystickBaseRef.current) {
      const rect = joystickBaseRef.current.getBoundingClientRect();
      baseCenterRef.current = {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
      };
    }

    setJoystickActive(true);
    handleJoystickTouchMove(e);
  };

  const handleJoystickTouchMove = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (touchIdRef.current === null) return;

      let currentTouch: { clientX: number; clientY: number; identifier: number } | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const touch = e.changedTouches[i];
        if (touch.identifier === touchIdRef.current) {
          currentTouch = { clientX: touch.clientX, clientY: touch.clientY, identifier: touch.identifier };
          break;
        }
      }
      if (!currentTouch) return;

      const maxRadius = 48;
      const dx = currentTouch.clientX - baseCenterRef.current.x;
      const dy = currentTouch.clientY - baseCenterRef.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let clampedX = dx;
      let clampedY = dy;
      if (dist > maxRadius) {
        clampedX = (dx / dist) * maxRadius;
        clampedY = (dy / dist) * maxRadius;
      }

      setKnobPos({ x: clampedX, y: clampedY });

      const normX = clampedX / maxRadius;
      const normY = clampedY / maxRadius;

      if (engine) {
        engine.setMobileMove(normX, normY);
      }
    },
    [engine]
  );

  const handleJoystickTouchEnd = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (touchIdRef.current === null) return;

      for (let i = 0; i < e.changedTouches.length; i++) {
        if (e.changedTouches[i].identifier === touchIdRef.current) {
          touchIdRef.current = null;
          setKnobPos({ x: 0, y: 0 });
          setJoystickActive(false);
          if (engine) {
            engine.setMobileMove(0, 0);
          }
          break;
        }
      }
    },
    [engine]
  );

  const handleLookTouchStart = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    lookTouchIdRef.current = touch.identifier;
    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleLookTouchMove = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current === null || !engine) return;

    let touch: { clientX: number; clientY: number; identifier: number } | null = null;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const item = e.changedTouches[i];
      if (item.identifier === lookTouchIdRef.current) {
        touch = { clientX: item.clientX, clientY: item.clientY, identifier: item.identifier };
        break;
      }
    }
    if (!touch) return;

    const dx = touch.clientX - lastLookPosRef.current.x;
    const dy = touch.clientY - lastLookPosRef.current.y;

    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
    engine.rotateCameraDelta(dx, dy);
  };

  const handleLookTouchEnd = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
        break;
      }
    }
  };

  const handleToggleSprint = () => {
    setIsSprintingMobile((prev) => {
      const next = !prev;
      if (engine) {
        engine.setMobileSprint(next);
      }
      return next;
    });
  };

  return (
    <>
      {/* AUTO-DETECTED FULL-SCREEN TOUCH CONTROLS OVERLAY */}
      {showMobileControls && (
        <div className="fixed inset-0 z-40 pointer-events-none select-none overflow-hidden touch-none">
          {/* RIGHT-SIDE CAMERA LOOK AREA */}
          <div
            className="absolute top-20 right-0 bottom-24 w-1/2 pointer-events-auto touch-none"
            onTouchStart={handleLookTouchStart}
            onTouchMove={handleLookTouchMove}
            onTouchEnd={handleLookTouchEnd}
            onTouchCancel={handleLookTouchEnd}
          />

          {/* LEFT-SIDE VIRTUAL JOYSTICK */}
          <div className="absolute bottom-6 left-6 pointer-events-auto touch-none">
            <div
              ref={joystickBaseRef}
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              onTouchCancel={handleJoystickTouchEnd}
              className={`relative w-32 h-32 rounded-full border-2 flex items-center justify-center transition-colors ${
                joystickActive
                  ? 'border-amber-400/80 bg-neutral-950/60 shadow-[0_0_20px_rgba(245,158,11,0.3)]'
                  : 'border-white/20 bg-neutral-950/40'
              }`}
            >
              <div className="absolute inset-x-4 top-1/2 h-px bg-white/10 pointer-events-none" />
              <div className="absolute inset-y-4 left-1/2 w-px bg-white/10 pointer-events-none" />

              <div
                ref={joystickKnobRef}
                style={{
                  transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
                }}
                className={`w-14 h-14 rounded-full border-2 flex items-center justify-center shadow-lg transition-transform duration-75 pointer-events-none ${
                  joystickActive
                    ? 'border-amber-400 bg-amber-500/80 text-black font-black'
                    : 'border-white/50 bg-white/30 text-white/70'
                }`}
              >
                <span className="text-[10px] font-mono tracking-tighter uppercase">{t.move}</span>
              </div>
            </div>
          </div>

          {/* RIGHT-SIDE ACTION BUTTONS CONTAINER */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5">
              <button
                onClick={() => triggerBtnPop('crouch', () => engine?.toggleCrouch())}
                className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all active:scale-90 ${
                  poppedBtn === 'crouch' ? 'animate-cell-pop' : ''
                } ${
                  stats.isCrouched
                    ? 'bg-amber-500 border-amber-400 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-neutral-900/80 border-neutral-600 text-neutral-300'
                }`}
              >
                {stats.isCrouched ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <span className="text-[8px] font-mono font-bold leading-none">{t.crouch}</span>
              </button>

              <button
                onClick={() => triggerBtnPop('flashlight', () => engine?.toggleFlashlight())}
                className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all active:scale-90 ${
                  poppedBtn === 'flashlight' ? 'animate-cell-pop' : ''
                } ${
                  stats.flashlightOn
                    ? 'bg-amber-400 border-amber-300 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'bg-neutral-900/80 border-neutral-600 text-neutral-400'
                }`}
              >
                <Flashlight className="w-5 h-5" />
                <span className="text-[8px] font-mono font-bold leading-none">{t.light}</span>
              </button>

              <button
                onClick={() => triggerBtnPop('phone', onPhone)}
                className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-all ${
                  poppedBtn === 'phone' ? 'animate-cell-pop' : ''
                } ${
                  isPhoneOpen
                    ? 'bg-amber-500 border-amber-300 text-black font-black'
                    : 'bg-neutral-900/80 border-amber-600/60 text-amber-300'
                }`}
              >
                <Smartphone className="w-4 h-4" />
                <span className="text-[7px] font-mono font-bold leading-none mt-0.5">{t.phone}</span>
              </button>

              <button
                onClick={() => triggerBtnPop('pause', onPause, 130)}
                className={`w-12 h-12 rounded-full border border-neutral-600 bg-neutral-900/80 text-neutral-300 flex flex-col items-center justify-center shadow-lg cursor-pointer active:scale-90 transition-all ${
                  poppedBtn === 'pause' ? 'animate-cell-pop' : ''
                }`}
              >
                <Pause className="w-4 h-4" />
                <span className="text-[8px] font-mono font-bold leading-none">{t.pause}</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              {night !== 3 && (
                <button
                  onClick={() => triggerBtnPop('sprint', handleToggleSprint)}
                  className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl cursor-pointer transition-all active:scale-90 ${
                    poppedBtn === 'sprint' ? 'animate-cell-pop' : ''
                  } ${
                    isSprintingMobile || stats.isSprinting
                      ? 'bg-gradient-to-br from-red-600 to-amber-600 border-amber-300 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] scale-105'
                      : 'bg-neutral-900/85 border-amber-500/50 text-amber-300'
                  }`}
                >
                  <Flame className="w-5 h-5" />
                  <span className="text-[10px] font-mono font-black tracking-wider leading-tight">
                    {isSprintingMobile ? t.running : t.run}
                  </span>
                </button>
              )}

              <button
                onClick={() => triggerBtnPop('action', () => engine?.interact())}
                className={`w-20 h-20 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-600 to-yellow-500 text-black font-black flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95 transition-all ${
                  poppedBtn === 'action' ? 'animate-cell-pop' : ''
                }`}
              >
                <Hand className="w-7 h-7" />
                <span className="text-xs font-mono font-black tracking-wider">{t.action}</span>
                <span className="text-[9px] font-mono opacity-80 leading-none">[E]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
