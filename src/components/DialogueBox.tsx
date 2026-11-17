import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DialogueState, Language } from '../types/game';
import { MessageSquare, User, CornerDownLeft, FastForward } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';
import { getTranslations } from '../i18n/translations';

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
  language,
}) => {
  if (!dialogue.active || !dialogue.lines || dialogue.lines.length === 0) {
    return null;
  }

  const t = getTranslations(language).dialogue;
  const currentLine = dialogue.lines[dialogue.currentIndex] || dialogue.lines[0];
  const isDuck = currentLine.speaker.toUpperCase().includes('DUCK');
  const isLastLine = dialogue.currentIndex >= dialogue.lines.length - 1;

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
      className={`absolute left-1/2 -translate-x-1/2 z-40 max-w-[300px] sm:max-w-[330px] w-[84%] pointer-events-auto cursor-pointer select-none animate-in fade-in zoom-in-95 duration-200 transition-all ${
        isMobileLayout ? 'bottom-48' : 'bottom-12'
      }`}
    >
      <div
        className={`relative overflow-hidden p-2.5 rounded-lg border shadow-xl transition-colors ${
          isDuck
            ? 'bg-neutral-950/95 border-amber-500/70 shadow-[0_0_16px_rgba(245,158,11,0.16)]'
            : 'bg-neutral-950/95 border-sky-500/70 shadow-[0_0_16px_rgba(14,165,233,0.16)]'
        }`}
      >
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_50%,rgba(0,0,0,0.22)_50%)] bg-[length:100%_3px]" />
        {/* Top Speaker Bar */}
        <div className="flex items-center justify-between pb-1 mb-1 border-b border-neutral-800">
          <div className="flex items-center gap-1.5">
            <div
              className={`p-0.5 rounded ${
                isDuck ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {isDuck ? <User className="w-3 h-3" /> : <MessageSquare className="w-3 h-3" />}
            </div>
            <span
              className={`text-[10px] font-black tracking-wider uppercase ${
                isDuck ? 'text-amber-400' : 'text-sky-400'
              }`}
            >
              {currentLine.speaker}
              {dialogue.isMonologue && (
                <span className="ml-1 text-[8px] font-normal text-neutral-400 normal-case tracking-normal">
                  {t.internal}
                </span>
              )}
            </span>
          </div>

          <span className="text-[9px] font-mono text-neutral-500">
            {dialogue.currentIndex + 1}/{dialogue.lines.length}
          </span>
        </div>

        {/* Dialogue Text with Scrolling Typewriter */}
        <div className="min-h-[26px] flex items-center">
          <p className="text-[11px] sm:text-xs font-mono text-neutral-100 leading-snug tracking-wide">
            “{visibleText}
            {isTyping && (
              <span
                className={`inline-block w-1.5 h-3 ml-0.5 align-middle animate-pulse ${
                  isDuck ? 'bg-amber-400' : 'bg-sky-400'
                }`}
              />
            )}
            ”
          </p>
        </div>

        {/* Footer Hint */}
        <div className="mt-1.5 pt-1 border-t border-neutral-900 flex items-center justify-between text-[9px] font-mono text-neutral-400">
          <span className="text-[8px] text-neutral-500">
            {isTyping ? t.transmitting : t.received}
          </span>

          <span className="flex items-center gap-1 text-amber-300 font-semibold">
            {isTyping ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  soundEngine.playUICellPop();
                  handleSkipScrollingOnly();
                }}
                className="flex items-center gap-0.5 text-neutral-400 hover:text-amber-300 transition-colors cursor-pointer"
              >
                <span>{t.skip}</span>
                <FastForward className="w-2.5 h-2.5 inline text-amber-400" />
              </button>
            ) : (
              <span className="animate-pulse flex items-center gap-0.5 text-amber-300">
                <span>{isLastLine ? t.close : t.next}</span>
                <CornerDownLeft className="w-2.5 h-2.5 inline" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
