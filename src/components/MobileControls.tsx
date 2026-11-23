import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';
import { GameNight, Language, PlayerStats } from '../types/game';
import { ChevronDown, ChevronUp } from 'lucide-react';
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

/** Weathered/distressed white outer circular border matching Unity-style horror touch controls */
const DistressedCircleRing: React.FC<{ active?: boolean }> = ({ active = false }) => (
  <svg
    viewBox="0 0 100 100"
    className="absolute inset-0 w-full h-full pointer-events-none"
    aria-hidden="true"
  >
    <circle
      cx="50"
      cy="50"
      r="46"
      fill="none"
      stroke={active ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.82)'}
      strokeWidth="3.2"
      strokeDasharray="62 4 28 3 84 5 46 3"
      strokeLinecap="round"
    />
    <circle
      cx="50"
      cy="50"
      r="43.5"
      fill="none"
      stroke="rgba(255,255,255,0.28)"
      strokeWidth="1.2"
      strokeDasharray="18 14 35 19 22 12"
    />
  </svg>
);

export const MobileControls: React.FC<MobileControlsProps> = ({
  engine,
  stats,
  night,
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
    popTimerRef.current = window.setTimeout(() => setPoppedBtn(null), 220);
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

      const maxRadius = 46;
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

          {/* LEFT-SIDE VIRTUAL JOYSTICK (Distressed White Outer Ring + Solid White Knob) */}
          <div className="absolute bottom-5 left-5 sm:bottom-7 sm:left-7 pointer-events-auto touch-none">
            <div
              ref={joystickBaseRef}
              onTouchStart={handleJoystickTouchStart}
              onTouchMove={handleJoystickTouchMove}
              onTouchEnd={handleJoystickTouchEnd}
              onTouchCancel={handleJoystickTouchEnd}
              className={`relative w-28 h-28 sm:w-32 sm:h-32 rounded-full flex items-center justify-center transition-transform ${
                joystickActive ? 'scale-[1.03]' : ''
              }`}
            >
              <DistressedCircleRing active={joystickActive} />

              <div
                ref={joystickKnobRef}
                style={{
                  transform: `translate(${knobPos.x}px, ${knobPos.y}px)`,
                }}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full pointer-events-none transition-transform duration-75 ${
                  joystickActive
                    ? 'bg-white shadow-[0_0_16px_rgba(255,255,255,0.55)]'
                    : 'bg-white/90 shadow-[0_0_10px_rgba(255,255,255,0.28)]'
                }`}
              />
            </div>
          </div>

          {/* RIGHT-SIDE TRIANGLE ACTION BUTTONS (Hand Interact Top, Runner Left, Flashlight Right) */}
          <div className="absolute bottom-5 right-5 sm:bottom-7 sm:right-7 flex items-end gap-3 pointer-events-auto">
            {/* Compact Crouch Utility Circle */}
            <button
              type="button"
              aria-label={t.crouch}
              onClick={() => triggerBtnPop('crouch', () => engine?.toggleCrouch())}
              className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 mb-1 ${
                poppedBtn === 'crouch' ? 'animate-cell-pop' : ''
              } ${stats.isCrouched ? 'bg-white/20' : 'bg-white/[0.04]'}`}
            >
              <DistressedCircleRing active={stats.isCrouched} />
              {stats.isCrouched ? (
                <ChevronUp className="w-5 h-5 text-white drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white/90 drop-shadow-[0_1px_4px_rgba(0,0,0,0.85)]" />
              )}
            </button>

            {/* Primary 3-Button Triangle Cluster matching Reference Sample */}
            <div className="flex flex-col items-center gap-2.5 sm:gap-3">
              {/* TOP CENTER: OPEN HAND INTERACT */}
              <button
                type="button"
                aria-label={t.action}
                onClick={() => triggerBtnPop('action', () => engine?.interact())}
                className={`relative w-16 h-16 sm:w-[74px] sm:h-[74px] rounded-full bg-white/[0.05] hover:bg-white/15 flex items-center justify-center cursor-pointer active:scale-90 transition-all ${
                  poppedBtn === 'action' ? 'animate-cell-pop' : ''
                }`}
              >
                <DistressedCircleRing active={poppedBtn === 'action'} />
                <svg
                  viewBox="0 0 64 64"
                  className="w-9 h-9 sm:w-10 sm:h-10 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M29 10a2.5 2.5 0 0 1 5 0v18h2.5V12.5a2.5 2.5 0 0 1 5 0V29h2.2V17.5a2.4 2.4 0 0 1 4.8 0v19.8c0 9.8-6.4 16.7-15.6 16.7-7.7 0-13.2-4.7-16.5-11.2l-4.5-8.9a2.5 2.5 0 0 1 4.4-2.3l3.9 6.2V16a2.5 2.5 0 0 1 5 0v12h3.8V10Z" />
                </svg>
              </button>

              {/* LOWER ROW: RUNNER WITH SPEED LINES (LEFT) + ANGLED FLASHLIGHT (RIGHT) */}
              <div className="flex items-center gap-4 sm:gap-5 -mt-1">
                {night !== 3 && (
                  <button
                    type="button"
                    aria-label={isSprintingMobile ? t.running : t.run}
                    onClick={() => triggerBtnPop('sprint', handleToggleSprint)}
                    className={`relative w-14 h-14 sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                      poppedBtn === 'sprint' ? 'animate-cell-pop' : ''
                    } ${
                      isSprintingMobile || stats.isSprinting
                        ? 'bg-white/25 shadow-[0_0_18px_rgba(255,255,255,0.4)]'
                        : 'bg-white/[0.04]'
                    }`}
                  >
                    <DistressedCircleRing active={isSprintingMobile || stats.isSprinting} />
                    <svg
                      viewBox="0 0 64 64"
                      className="w-8 h-8 sm:w-9 sm:h-9 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                      fill="currentColor"
                      aria-hidden="true"
                    >
                      {/* Speed streaks */}
                      <rect x="6" y="21" width="16" height="2.6" rx="1.3" />
                      <rect x="9" y="28" width="13" height="2.6" rx="1.3" />
                      <rect x="5" y="35" width="15" height="2.6" rx="1.3" />
                      {/* Runner figure */}
                      <circle cx="40" cy="14" r="4.8" />
                      <path d="M36 21c2.4-1.2 5.4-.4 6.6 1.9l3.3 6.2 5.8 1.5a2.3 2.3 0 0 1-1.2 4.4l-7.2-1.8a2.3 2.3 0 0 1-1.5-1.2l-1.5-2.8-2.9 7.8 6.8 6.4a2.4 2.4 0 0 1 .7 2.2l-1.8 8.9a2.4 2.4 0 0 1-4.7-.9l1.5-7.4-6.4-6-3.9 5.9a2.4 2.4 0 0 1-1.6 1.1l-7.4 1.3a2.4 2.4 0 0 1-.8-4.7l6.2-1.1 5.1-8.1 2.2-6.1-5.1 1.4-2.5 5a2.2 2.2 0 1 1-4-1.9l3.1-6.1a2.3 2.3 0 0 1 1.4-1.2l7-1.9Z" />
                    </svg>
                  </button>
                )}

                <button
                  type="button"
                  aria-label={t.light}
                  onClick={() => triggerBtnPop('flashlight', () => engine?.toggleFlashlight())}
                  className={`relative w-14 h-14 sm:w-[66px] sm:h-[66px] rounded-full flex items-center justify-center cursor-pointer transition-all active:scale-90 ${
                    poppedBtn === 'flashlight' ? 'animate-cell-pop' : ''
                  } ${stats.flashlightOn ? 'bg-white/20' : 'bg-white/[0.04] opacity-75'}`}
                >
                  <DistressedCircleRing active={stats.flashlightOn} />
                  <svg
                    viewBox="0 0 64 64"
                    className="w-8 h-8 sm:w-9 sm:h-9 text-white/95 drop-shadow-[0_2px_4px_rgba(0,0,0,0.7)]"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <g transform="rotate(-42 32 32)">
                      {/* Flashlight head / bezel */}
                      <path d="M40 20h10v24H40l-6-5V25l6-5z" />
                      {/* Flashlight handle */}
                      <rect x="13" y="25.5" width="21" height="13" rx="3" />
                      {/* Power button dot */}
                      <circle cx="30" cy="32" r="2.1" fill="rgba(0,0,0,0.55)" />
                    </g>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
