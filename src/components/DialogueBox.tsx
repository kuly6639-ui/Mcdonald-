import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DialogueState, Language } from '../types/game';
import { soundEngine } from '../audio/SoundEngine';

interface DialogueBoxProps {
  dialogue: DialogueState;
  onAdvance: () => void;
  isMobileLayout?: boolean;
  language: Language;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({
  dialogue,
  onAdvance,
  isMobileLayout = false,
}) => {
  if (!dialogue.active || !dialogue.lines || dialogue.lines.length === 0) {
    return null;
  }

  const currentLine = dialogue.lines[dialogue.currentIndex] || dialogue.lines[0];
  const isDuck = currentLine.speaker.toUpperCase().includes('DUCK');

  const fullText = currentLine.text;
  const lineKey = `${dialogue.npcId ?? ''}:${dialogue.currentIndex}:${fullText}`;

  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const lastBeepTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const isTypingRef = useRef<boolean>(true);
  const skipGuardUntilRef = useRef<number>(0);
  const activeLineKeyRef = useRef<string>(lineKey);

  // Synchronously mark new line as actively typing before effects commit
  if (activeLineKeyRef.current !== lineKey) {
    activeLineKeyRef.current = lineKey;
    isTypingRef.current = true;
    skipGuardUntilRef.current = performance.now() + 180;
  }

  // Reset and start typing when the line changes or dialogue activates
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isTypingRef.current = true;
    setDisplayedLength(0);
    setIsTyping(true);
  }, [lineKey]);

  // Typewriter effect ticker with low-pitched beeping sound
  useEffect(() => {
    if (!isTyping) {
      isTypingRef.current = false;
      return;
    }

    if (displayedLength >= fullText.length) {
      isTypingRef.current = false;
      setIsTyping(false);
      return;
    }

    const nextChar = fullText[displayedLength];
    let charDelay = 28;
    if (nextChar === '.' || nextChar === '!' || nextChar === '?') {
      charDelay = 140;
    } else if (nextChar === ',' || nextChar === ';' || nextChar === '—') {
      charDelay = 90;
    }

    timerRef.current = window.setTimeout(() => {
      setDisplayedLength((prev) => {
        const nextLen = prev + 1;
        const char = fullText[prev];

        if (char && char.trim() !== '') {
          const now = performance.now();
          if (now - lastBeepTimeRef.current >= 42) {
            soundEngine.playDialogueTypewriterBeep(isDuck);
            lastBeepTimeRef.current = now;
          }
        }

        if (nextLen >= fullText.length) {
          isTypingRef.current = false;
          skipGuardUntilRef.current = Math.max(skipGuardUntilRef.current, performance.now() + 260);
          setIsTyping(false);
        }
        return nextLen;
      });
    }, charDelay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [displayedLength, isTyping, fullText, isDuck]);

  // Skip button strictly finishes scrolling text and NEVER advances to another chat
  const handleSkipScrollingOnly = useCallback(() => {
    if (!isTypingRef.current && !isTyping) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isTypingRef.current = false;
    skipGuardUntilRef.current = performance.now() + 300;
    setDisplayedLength(fullText.length);
    setIsTyping(false);
    soundEngine.playDialogueTypewriterBeep(isDuck);
  }, [isTyping, fullText.length, isDuck]);

  // Handle user advance: first reveal full scrolling text; only advance on a subsequent action
  const handleUserAction = useCallback(() => {
    if (isTypingRef.current || isTyping) {
      handleSkipScrollingOnly();
      return;
    }
    if (performance.now() < skipGuardUntilRef.current) {
      return;
    }
    onAdvance();
  }, [isTyping, handleSkipScrollingOnly, onAdvance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return;
        handleUserAction();
      }
    };
    const handleCustomAction = () => {
      handleUserAction();
    };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('mcd-dialogue-action', handleCustomAction);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('mcd-dialogue-action', handleCustomAction);
    };
  }, [handleUserAction]);

  const visibleText = fullText.slice(0, displayedLength);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playUICellPop();
        handleUserAction();
      }}
      className={`fixed left-1/2 -translate-x-1/2 z-[60] w-[88%] max-w-lg pointer-events-auto cursor-pointer select-none px-4 py-3 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.48)_62%,transparent_94%)] transition-all ${
        isMobileLayout ? 'bottom-3 sm:bottom-7' : 'bottom-5 sm:bottom-8'
      }`}
    >
      {/* Left-aligned speaker label with colon */}
      <div className="text-left text-xs sm:text-sm font-sans font-normal text-neutral-300/95 tracking-wide mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
        {currentLine.speaker}:
      </div>

      {/* Centered dialogue text */}
      <div className="min-h-[28px] flex items-center justify-center px-2">
        <p className="text-center text-sm sm:text-base font-sans font-normal text-white leading-snug tracking-wide drop-shadow-[0_2px_6px_rgba(0,0,0,0.98)]">
          {visibleText}
          {isTyping && (
            <span className="inline-block w-1.5 h-3.5 ml-1 bg-white/80 align-middle animate-pulse" />
          )}
        </p>
      </div>

      {/* Centered downward triangle indicator */}
      <div className="mt-2 flex items-center justify-center">
        <span
          aria-hidden="true"
          className={`text-[11px] sm:text-xs text-white/95 leading-none drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] ${
            !isTyping ? 'animate-bounce' : 'opacity-65'
          }`}
        >
          ▼
        </span>
      </div>
    </div>
  );
};
