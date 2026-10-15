import React, { useEffect, useState, useRef, useCallback } from 'react';
import { DialogueState } from '../types/game';
import { MessageSquare, User, CornerDownLeft, FastForward } from 'lucide-react';
import { soundEngine } from '../audio/SoundEngine';

interface DialogueBoxProps {
  dialogue: DialogueState;
  onAdvance: () => void;
}

export const DialogueBox: React.FC<DialogueBoxProps> = ({ dialogue, onAdvance }) => {
  if (!dialogue.active || !dialogue.lines || dialogue.lines.length === 0) {
    return null;
  }

  const currentLine = dialogue.lines[dialogue.currentIndex] || dialogue.lines[0];
  const isDuck = currentLine.speaker.toUpperCase().includes('DUCK');
  const isLastLine = dialogue.currentIndex >= dialogue.lines.length - 1;

  const [displayedLength, setDisplayedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);

  const fullText = currentLine.text;
  const lastBeepTimeRef = useRef<number>(0);
  const timerRef = useRef<number | null>(null);

  // Reset and start typing when the line changes or dialogue activates
  useEffect(() => {
    setDisplayedLength(0);
    setIsTyping(true);
  }, [dialogue.currentIndex, dialogue.lines]);

  // Typewriter effect ticker with low-pitched beeping sound
  useEffect(() => {
    if (!isTyping) return;

    if (displayedLength >= fullText.length) {
      setIsTyping(false);
      return;
    }

    const nextChar = fullText[displayedLength];
    // Natural slight pause on punctuation
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

        // Play low-pitched electronic beeping sound for non-whitespace characters, throttled ~45ms
        if (char && char.trim() !== '') {
          const now = performance.now();
          if (now - lastBeepTimeRef.current >= 42) {
            soundEngine.playDialogueTypewriterBeep(isDuck);
            lastBeepTimeRef.current = now;
          }
        }

        if (nextLen >= fullText.length) {
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

  // Handle interaction: skip typing if in progress, or advance line if complete
  const handleUserAction = useCallback(() => {
    if (isTyping) {
      // Immediately complete scrolling text
      if (timerRef.current) clearTimeout(timerRef.current);
      setDisplayedLength(fullText.length);
      setIsTyping(false);
      soundEngine.playDialogueTypewriterBeep(isDuck);
    } else {
      // Advance to next line
      onAdvance();
    }
  }, [isTyping, fullText.length, isDuck, onAdvance]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyE' || e.code === 'Space' || e.code === 'Enter') {
        e.preventDefault();
        e.stopPropagation();
        handleUserAction();
      }
    };
    window.addEventListener('keydown', handleKeyDown, true);
    return () => window.removeEventListener('keydown', handleKeyDown, true);
  }, [handleUserAction]);

  const visibleText = fullText.slice(0, displayedLength);

  return (
    <div
      onClick={handleUserAction}
      className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] md:w-[580px] pointer-events-auto cursor-pointer select-none animate-in fade-in zoom-in-95 duration-200"
    >
      <div
        className={`relative p-5 rounded-xl border shadow-2xl backdrop-blur-md transition-colors ${
          isDuck
            ? 'bg-neutral-950/95 border-amber-500/70 shadow-[0_0_30px_rgba(245,158,11,0.18)]'
            : 'bg-neutral-950/95 border-sky-500/70 shadow-[0_0_30px_rgba(14,165,233,0.18)]'
        }`}
      >
        {/* Top Speaker Bar */}
        <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-neutral-800">
          <div className="flex items-center gap-2">
            <div
              className={`p-1 rounded-md ${
                isDuck ? 'bg-amber-500/20 text-amber-400' : 'bg-sky-500/20 text-sky-400'
              }`}
            >
              {isDuck ? <User className="w-4 h-4" /> : <MessageSquare className="w-4 h-4" />}
            </div>
            <span
              className={`text-xs font-black tracking-widest uppercase ${
                isDuck ? 'text-amber-400' : 'text-sky-400'
              }`}
            >
              {currentLine.speaker}
              {dialogue.isMonologue && (
                <span className="ml-2 text-[10px] font-normal text-neutral-400 normal-case tracking-normal">
                  (Internal Monologue)
                </span>
              )}
            </span>
          </div>

          <span className="text-[10px] font-mono text-neutral-500">
            {dialogue.currentIndex + 1} / {dialogue.lines.length}
          </span>
        </div>

        {/* Dialogue Text with Scrolling Typewriter */}
        <div className="min-h-[52px] flex items-center">
          <p className="text-sm md:text-[15px] font-mono text-neutral-100 leading-relaxed tracking-wide">
            “{visibleText}
            {isTyping && (
              <span className={`inline-block w-2 h-4 ml-0.5 align-middle animate-pulse ${
                isDuck ? 'bg-amber-400' : 'bg-sky-400'
              }`} />
            )}”
          </p>
        </div>

        {/* Footer Hint */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400">
          <span className="text-[10px] text-neutral-500">
            {isTyping ? 'Typing transmission...' : 'Transmission received'}
          </span>

          <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
            {isTyping ? (
              <span className="flex items-center gap-1 text-neutral-400 hover:text-amber-300 transition-colors">
                <span>[E] / Click to Skip</span>
                <FastForward className="w-3.5 h-3.5 inline text-amber-400 animate-pulse" />
              </span>
            ) : (
              <span className="animate-pulse flex items-center gap-1 text-amber-300">
                <span>{isLastLine ? 'Press [E] or Click to Continue' : 'Press [E] or Click to Advance'}</span>
                <CornerDownLeft className="w-3.5 h-3.5 inline" />
              </span>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};
