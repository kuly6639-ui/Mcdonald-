import React, { useRef, useState, useEffect, useCallback } from 'react';
import { GameEngine } from '../game/GameEngine';
import { PlayerStats } from '../types/game';
import {
  Flashlight,
  Pause,
  Hand,
  ChevronDown,
  ChevronUp,
  Flame,
} from 'lucide-react';

interface MobileControlsProps {
  engine: GameEngine | null;
  stats: PlayerStats;
  onPause: () => void;
  showMobileControls: boolean;
  onToggleControls: () => void;
}

export const MobileControls: React.FC<MobileControlsProps> = ({
  engine,
  stats,
  onPause,
  showMobileControls,
  onToggleControls,
}) => {
  const joystickBaseRef = useRef<HTMLDivElement>(null);
  const joystickKnobRef = useRef<HTMLDivElement>(null);

  const [joystickActive, setJoystickActive] = useState(false);
  const [knobPos, setKnobPos] = useState({ x: 0, y: 0 });
  const [isSprintingMobile, setIsSprintingMobile] = useState(false);

  const touchIdRef = useRef<number | null>(null);
  const baseCenterRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Camera look touch tracking
  const lookTouchIdRef = useRef<number | null>(null);
  const lastLookPosRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Reset joystick when touch controls become hidden
  useEffect(() => {
    if (!showMobileControls && engine) {
      engine.setMobileMove(0, 0);
      engine.setMobileSprint(false);
      setKnobPos({ x: 0, y: 0 });
      setJoystickActive(false);
      setIsSprintingMobile(false);
    }
  }, [showMobileControls, engine]);

  // Handle Joystick Touch Start
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

  // Handle Joystick Touch Move
  const handleJoystickTouchMove = useCallback(
    (e: React.TouchEvent | TouchEvent) => {
      if (touchIdRef.current === null) return;

      let currentTouch: { clientX: number; clientY: number; identifier: number } | null = null;
      for (let i = 0; i < e.changedTouches.length; i++) {
        const t = e.changedTouches[i];
        if (t.identifier === touchIdRef.current) {
          currentTouch = { clientX: t.clientX, clientY: t.clientY, identifier: t.identifier };
          break;
        }
      }
      if (!currentTouch) return;

      const maxRadius = 48; // Max thumbstick movement distance in pixels
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

      // Normalized values between -1 and 1
      const normX = clampedX / maxRadius;
      const normY = clampedY / maxRadius;

      if (engine) {
        engine.setMobileMove(normX, normY);
      }
    },
    [engine]
  );

  // Handle Joystick Touch End
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

  // Handle Look Zone Touch Start
  const handleLookTouchStart = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current !== null) return;
    const touch = e.changedTouches[0];
    lookTouchIdRef.current = touch.identifier;
    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
  };

  // Handle Look Zone Touch Move
  const handleLookTouchMove = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current === null || !engine) return;

    let touch: { clientX: number; clientY: number; identifier: number } | null = null;
    for (let i = 0; i < e.changedTouches.length; i++) {
      const t = e.changedTouches[i];
      if (t.identifier === lookTouchIdRef.current) {
        touch = { clientX: t.clientX, clientY: t.clientY, identifier: t.identifier };
        break;
      }
    }
    if (!touch) return;

    const dx = touch.clientX - lastLookPosRef.current.x;
    const dy = touch.clientY - lastLookPosRef.current.y;

    lastLookPosRef.current = { x: touch.clientX, y: touch.clientY };
    engine.rotateCameraDelta(dx, dy);
  };

  // Handle Look Zone Touch End
  const handleLookTouchEnd = (e: React.TouchEvent) => {
    if (lookTouchIdRef.current === null) return;
    for (let i = 0; i < e.changedTouches.length; i++) {
      if (e.changedTouches[i].identifier === lookTouchIdRef.current) {
        lookTouchIdRef.current = null;
        break;
      }
    }
  };

  // Toggle Sprint Mobile
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
      {/* PERSISTENT FLOATING CONTROLS TOGGLE BUTTON (TOP RIGHT) */}
      <button
        onClick={onToggleControls}
        className="fixed top-4 right-28 z-50 pointer-events-auto flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-900/90 hover:bg-neutral-800 border border-neutral-700/80 text-neutral-300 text-[11px] font-mono font-bold shadow-xl backdrop-blur-sm cursor-pointer transition-all active:scale-95"
        title="Toggle between Mobile Touch and Keyboard/Mouse Controls"
      >
        <span className={showMobileControls ? 'text-amber-400' : 'text-neutral-500'}>
          {showMobileControls ? '🎮 TOUCH ON' : '⌨️ PC CONTROLS'}
        </span>
      </button>

      {/* FULL-SCREEN TOUCH CONTROLS OVERLAY */}
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
              {/* Center Crosshair Guides */}
              <div className="absolute inset-x-4 top-1/2 h-px bg-white/10 pointer-events-none" />
              <div className="absolute inset-y-4 left-1/2 w-px bg-white/10 pointer-events-none" />

              {/* Thumb Knob */}
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
                <span className="text-[10px] font-mono tracking-tighter uppercase">MOVE</span>
              </div>
            </div>
          </div>

          {/* RIGHT-SIDE ACTION BUTTONS CONTAINER */}
          <div className="absolute bottom-6 right-6 flex flex-col items-end gap-3 pointer-events-auto">
            {/* Top Row: Flashlight & Crouch */}
            <div className="flex items-center gap-2.5">
              {/* Crouch Button */}
              <button
                onClick={() => engine?.toggleCrouch()}
                className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all active:scale-90 ${
                  stats.isCrouched
                    ? 'bg-amber-500 border-amber-400 text-black font-black shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                    : 'bg-neutral-900/80 border-neutral-600 text-neutral-300'
                }`}
                title="Crouch / Stand (C)"
              >
                {stats.isCrouched ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                <span className="text-[8px] font-mono font-bold leading-none">CROUCH</span>
              </button>

              {/* Flashlight Button */}
              <button
                onClick={() => engine?.toggleFlashlight()}
                className={`w-12 h-12 rounded-full border flex flex-col items-center justify-center shadow-lg cursor-pointer transition-all active:scale-90 ${
                  stats.flashlightOn
                    ? 'bg-amber-400 border-amber-300 text-black font-bold shadow-[0_0_15px_rgba(251,191,36,0.5)]'
                    : 'bg-neutral-900/80 border-neutral-600 text-neutral-400'
                }`}
                title="Toggle Flashlight (F)"
              >
                <Flashlight className="w-5 h-5" />
                <span className="text-[8px] font-mono font-bold leading-none">LIGHT</span>
              </button>

              {/* Pause Button */}
              <button
                onClick={onPause}
                className="w-12 h-12 rounded-full border border-neutral-600 bg-neutral-900/80 text-neutral-300 flex flex-col items-center justify-center shadow-lg cursor-pointer active:scale-90"
                title="Pause Menu"
              >
                <Pause className="w-4 h-4" />
                <span className="text-[8px] font-mono font-bold leading-none">PAUSE</span>
              </button>
            </div>

            {/* Bottom Row: RUN (Sprint) & INTERACT (E) */}
            <div className="flex items-center gap-3">
              {/* RUN / SPRINT BUTTON */}
              <button
                onClick={handleToggleSprint}
                className={`w-16 h-16 rounded-full border-2 flex flex-col items-center justify-center shadow-2xl cursor-pointer transition-all active:scale-90 ${
                  isSprintingMobile || stats.isSprinting
                    ? 'bg-gradient-to-br from-red-600 to-amber-600 border-amber-300 text-white shadow-[0_0_25px_rgba(239,68,68,0.6)] animate-pulse'
                    : 'bg-neutral-900/85 border-amber-500/50 text-amber-300'
                }`}
                title="Sprint / Run (Shift on PC)"
              >
                <Flame className="w-5 h-5" />
                <span className="text-[10px] font-mono font-black tracking-wider leading-tight">
                  {isSprintingMobile ? 'RUNNING' : 'RUN'}
                </span>
              </button>

              {/* BIG INTERACT BUTTON (E) */}
              <button
                onClick={() => engine?.interact()}
                className="w-20 h-20 rounded-full border-2 border-amber-400 bg-gradient-to-tr from-amber-600 to-yellow-500 text-black font-black flex flex-col items-center justify-center shadow-[0_0_30px_rgba(245,158,11,0.5)] cursor-pointer active:scale-95 transition-all"
                title="Interact / Talk / Action (E)"
              >
                <Hand className="w-7 h-7" />
                <span className="text-xs font-mono font-black tracking-wider">ACTION</span>
                <span className="text-[9px] font-mono opacity-80 leading-none">[E]</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
