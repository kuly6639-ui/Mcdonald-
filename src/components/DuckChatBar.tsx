import React, { useEffect, useState, useRef, useCallback } from 'react';
import { soundEngine } from '../audio/SoundEngine';
import { Language } from '../types/game';

interface DuckChatBarProps {
  text: string;
  speaker?: string;
  onAdvance?: () => void;
  isFadedOut?: boolean;
  isMobileLayout?: boolean;
  language: Language;
}

export const DuckChatBar: React.FC<DuckChatBarProps> = ({
  text,
  speaker = 'Duck',
  onAdvance,
  isMobileLayout = false,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const lastBeepRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);
  const isTypingRef = useRef<boolean>(true);
  const skipGuardUntilRef = useRef<number>(0);
  const activeTextRef = useRef<string>(text);

  if (activeTextRef.current !== text) {
    activeTextRef.current = text;
    isTypingRef.current = true;
    skipGuardUntilRef.current = performance.now() + 180;
  }

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    isTypingRef.current = true;
    setDisplayedLength(0);
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping) {
      isTypingRef.current = false;
      return;
    }

    if (displayedLength >= text.length) {
      isTypingRef.current = false;
      setIsTyping(false);
      return;
    }

    const nextChar = text[displayedLength];
    let delay = 32;
    if (nextChar === '.' || nextChar === '?' || nextChar === '!') {
      delay = 180;
    } else if (nextChar === ',' || nextChar === ';') {
      delay = 100;
    }

    timerRef.current = window.setTimeout(() => {
      setDisplayedLength((prev) => {
        const next = prev + 1;
        const char = text[prev];
        if (char && char.trim() !== '') {
          const now = performance.now();
          if (now - lastBeepRef.current >= 45) {
            soundEngine.playDialogueTypewriterBeep(true);
            lastBeepRef.current = now;
          }
        }
        if (next >= text.length) {
          isTypingRef.current = false;
          skipGuardUntilRef.current = Math.max(skipGuardUntilRef.current, performance.now() + 260);
          setIsTyping(false);
        }
        return next;
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayedLength, isTyping, text]);

  // Skip button strictly reveals the scrolling text and NEVER skips to another chat
  const handleSkipScrollingOnly = useCallback(() => {
    if (!isTypingRef.current && !isTyping) return;
    if (timerRef.current) clearTimeout(timerRef.current);
    isTypingRef.current = false;
    skipGuardUntilRef.current = performance.now() + 300;
    setDisplayedLength(text.length);
    setIsTyping(false);
    soundEngine.playDialogueTypewriterBeep(true);
  }, [isTyping, text.length]);

  const handleAction = useCallback(() => {
    if (isTypingRef.current || isTyping) {
      handleSkipScrollingOnly();
      return;
    }
    if (performance.now() < skipGuardUntilRef.current) {
      return;
    }
    if (onAdvance) {
      onAdvance();
    }
  }, [isTyping, handleSkipScrollingOnly, onAdvance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        if (e.repeat) return;
        handleAction();
      }
    };
    const handleCustomAction = () => {
      handleAction();
    };
    window.addEventListener('keydown', handleKeyDown, true);
    window.addEventListener('mcd-dialogue-action', handleCustomAction);
    return () => {
      window.removeEventListener('keydown', handleKeyDown, true);
      window.removeEventListener('mcd-dialogue-action', handleCustomAction);
    };
  }, [handleAction]);

  const visibleText = text.slice(0, displayedLength);

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        soundEngine.playUICellPop();
        handleAction();
      }}
      className={`fixed left-1/2 -translate-x-1/2 z-[60] w-[88%] max-w-lg cursor-pointer select-none px-4 py-3 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0.78)_0%,rgba(0,0,0,0.48)_62%,transparent_94%)] pointer-events-auto transition-all ${
        isMobileLayout ? 'bottom-3 sm:bottom-7' : 'bottom-5 sm:bottom-8'
      }`}
    >
      {/* Left-aligned speaker label with colon */}
      <div className="text-left text-xs sm:text-sm font-sans font-normal text-neutral-300/95 tracking-wide mb-1.5 drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
        {speaker}:
      </div>

      {/* Centered text */}
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
