import React, { useEffect, useState, useRef, useCallback } from 'react';
import { soundEngine } from '../audio/SoundEngine';
import { CornerDownLeft, FastForward, MessageSquareQuote } from 'lucide-react';
import { Language } from '../types/game';
import { getTranslations } from '../i18n/translations';

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
  speaker = 'Duck (Night Shift)',
  onAdvance,
  isFadedOut = true,
  isMobileLayout = false,
  language,
}) => {
  const t = getTranslations(language).dialogue;
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
      className={`fixed left-1/2 -translate-x-1/2 z-50 w-[84%] max-w-[340px] cursor-pointer select-none font-mono animate-in fade-in slide-in-from-bottom-4 duration-300 transition-all ${
        isMobileLayout ? 'bottom-48' : 'bottom-4'
      } ${isFadedOut ? 'pointer-events-auto' : 'pointer-events-auto'}`}
    >
      <div className="relative overflow-hidden p-2.5 rounded-lg border border-amber-500/80 bg-neutral-950/95 shadow-[0_0_24px_rgba(245,158,11,0.2)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_3px]" />
        {/* Header: Duck Avatar & Name */}
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-amber-500/30">
          <div className="flex items-center gap-1.5">
            {/* Duck Avatar Icon */}
            <div className="w-5 h-5 rounded bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.25)]">
              <span className="text-xs leading-none" role="img" aria-label="Duck">
                🦆
              </span>
            </div>

            <div>
              <div className="text-[10px] font-black text-amber-400 tracking-wider uppercase flex items-center gap-1">
                <span>{speaker}</span>
                <span className="text-[8px] px-1 py-0 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-semibold normal-case">
                  {t.internalThoughts}
                </span>
              </div>
            </div>
          </div>

          <MessageSquareQuote className="w-3.5 h-3.5 text-amber-400/60" />
        </div>

        {/* Text Area */}
        <div className="min-h-[26px] flex items-center px-0.5">
          <p className="text-[11px] sm:text-xs text-neutral-100 leading-snug tracking-wide">
            “{visibleText}
            {isTyping && (
              <span className="inline-block w-1.5 h-3 ml-0.5 bg-amber-400 animate-pulse align-middle" />
            )}”
          </p>
        </div>

        {/* Action Prompt */}
        <div className="mt-1.5 pt-1 border-t border-neutral-800 flex items-center justify-between text-[9px] text-neutral-400">
          <span className="text-neutral-500 text-[8px]">
            {isTyping ? t.scrambled : t.pressHint}
          </span>

          <span className="flex items-center gap-1 text-amber-400 font-bold">
            {isTyping ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playUICellPop();
                  handleSkipScrollingOnly();
                }}
                className="flex items-center gap-0.5 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{t.skipBtn}</span>
                <FastForward className="w-2.5 h-2.5 text-amber-400" />
              </button>
            ) : (
              <span className="flex items-center gap-0.5 animate-pulse">
                <span>{t.continueBtn}</span>
                <CornerDownLeft className="w-2.5 h-2.5" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
