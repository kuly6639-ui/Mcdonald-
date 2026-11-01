import React, { useEffect, useState, useRef, useCallback } from 'react';
import { soundEngine } from '../audio/SoundEngine';
import { CornerDownLeft, FastForward, MessageSquareQuote } from 'lucide-react';

interface DuckChatBarProps {
  text: string;
  speaker?: string;
  onAdvance?: () => void;
  isFadedOut?: boolean;
}

export const DuckChatBar: React.FC<DuckChatBarProps> = ({
  text,
  speaker = 'Duck (Night Shift)',
  onAdvance,
  isFadedOut = true,
}) => {
  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const lastBeepRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    setDisplayedLength(0);
    setIsTyping(true);
  }, [text]);

  useEffect(() => {
    if (!isTyping) return;

    if (displayedLength >= text.length) {
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
          setIsTyping(false);
        }
        return next;
      });
    }, delay);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [displayedLength, isTyping, text]);

  const handleAction = useCallback(() => {
    if (isTyping) {
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedLength(text.length);
      setIsTyping(false);
      soundEngine.playDialogueTypewriterBeep(true);
    } else if (onAdvance) {
      onAdvance();
    }
  }, [isTyping, text.length, onAdvance]);

  const visibleText = text.slice(0, displayedLength);

  return (
    <div
      onClick={handleAction}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-[94%] max-w-lg cursor-pointer select-none font-mono animate-in fade-in slide-in-from-bottom-4 duration-300 ${
        isFadedOut ? 'pointer-events-auto' : 'pointer-events-auto'
      }`}
    >
      <div className="relative p-3.5 md:p-4 rounded-xl border border-amber-500/80 bg-neutral-950/95 shadow-[0_0_35px_rgba(245,158,11,0.25)] backdrop-blur-md">
        {/* Header: Duck Avatar & Name */}
        <div className="flex items-center justify-between pb-2 mb-2 border-b border-amber-500/30">
          <div className="flex items-center gap-2.5">
            {/* Duck Avatar Icon */}
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.3)]">
              <span className="text-base leading-none" role="img" aria-label="Duck">
                🦆
              </span>
            </div>

            <div>
              <div className="text-xs font-black text-amber-400 tracking-wider uppercase flex items-center gap-1.5">
                <span>{speaker}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950/80 border border-amber-600/40 text-amber-300 font-semibold normal-case">
                  Internal Thoughts
                </span>
              </div>
            </div>
          </div>

          <MessageSquareQuote className="w-4 h-4 text-amber-400/60" />
        </div>

        {/* Text Area */}
        <div className="min-h-[44px] flex items-center px-1">
          <p className="text-xs md:text-sm text-neutral-100 leading-relaxed tracking-wide">
            “{visibleText}
            {isTyping && (
              <span className="inline-block w-2 h-3.5 ml-1 bg-amber-400 animate-pulse align-middle" />
            )}”
          </p>
        </div>

        {/* Action Prompt */}
        <div className="mt-2.5 pt-2 border-t border-neutral-800 flex items-center justify-between text-[10px] text-neutral-400">
          <span className="text-neutral-500">
            {isTyping ? 'Scrambled transmission...' : 'Press [E], Space, or Click'}
          </span>

          <span className="flex items-center gap-1 text-amber-400 font-bold">
            {isTyping ? (
              <span className="flex items-center gap-1 hover:text-amber-300 transition-colors">
                <span>Skip</span>
                <FastForward className="w-3 h-3 text-amber-400" />
              </span>
            ) : (
              <span className="flex items-center gap-1 animate-pulse">
                <span>Continue</span>
                <CornerDownLeft className="w-3 h-3" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
