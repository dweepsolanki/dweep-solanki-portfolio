'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { X } from 'lucide-react';
import { useTerminalCommands, type TerminalOutputLine } from './useTerminalCommands';
import { TerminalLine } from './TerminalLine';

const MOBILE_CHIPS = ['whoami', 'ls', 'cat philosophy.txt', 'contact', 'clear'];

interface TerminalProps {
  open: boolean;
  onClose: () => void;
}

/**
 * Interactive terminal easter egg (spec §6). role="dialog" + focus trap +
 * aria-live output region so screen readers get the boot content as a
 * single readable block rather than character-by-character (spec §10).
 */
export function Terminal({ open, onClose }: TerminalProps) {
  const { lines, setLines, submit, autocomplete, navigateHistory, BOOT_SEQUENCE } = useTerminalCommands(onClose);
  const [bootedLines, setBootedLines] = useState<TerminalOutputLine[]>([]);
  const [bootComplete, setBootComplete] = useState(false);
  const [input, setInput] = useState('');
  const reduceMotion = useReducedMotion();

  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const triggerElRef = useRef<Element | null>(null);

  // Boot sequence: types commands in, reveals output instantly (spec §6.2).
  // Skipped entirely under reduced-motion — content appears immediately.
  useEffect(() => {
    if (!open) {
      setBootedLines([]);
      setBootComplete(false);
      setLines([]);
      return;
    }

    triggerElRef.current = document.activeElement;

    if (reduceMotion) {
      setBootedLines(BOOT_SEQUENCE);
      setBootComplete(true);
      return;
    }

    let cancelled = false;
    let idx = 0;

    async function run() {
      for (const line of BOOT_SEQUENCE) {
        if (cancelled) return;
        if (line.type === 'command' && line.text) {
          for (let i = 1; i <= line.text.length; i++) {
            if (cancelled) return;
            setBootedLines((prev) => {
              const withoutLast = prev.slice(0, idx);
              return [...withoutLast, { type: 'command', text: line.text!.slice(0, i) }];
            });
            await new Promise((r) => setTimeout(r, 25));
          }
          idx += 1;
        } else {
          setBootedLines((prev) => [...prev, line]);
          idx += 1;
          await new Promise((r) => setTimeout(r, 300));
        }
      }
      if (!cancelled) setBootComplete(true);
    }

    run();
    return () => {
      cancelled = true;
    };
    // BOOT_SEQUENCE is a stable module-level constant and setLines is a
    // stable state setter — omitted intentionally so this effect only
    // reruns on open/reduceMotion, not on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, reduceMotion]);

  useEffect(() => {
    if (bootComplete && inputRef.current) inputRef.current.focus();
  }, [bootComplete]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [bootedLines, lines]);

  // Escape-to-close + focus trap
  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key === 'Tab' && panelRef.current) {
        const focusable = panelRef.current.querySelectorAll<HTMLElement>('a[href], button, input');
        if (focusable.length === 0) return;
        const first = focusable[0]!;
        const last = focusable[focusable.length - 1]!;
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('keydown', handleKey);
      if (triggerElRef.current instanceof HTMLElement) triggerElRef.current.focus();
    };
  }, [open, onClose]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      submit(input);
      setInput('');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      setInput((prev) => autocomplete(prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const prev = navigateHistory('up');
      if (prev !== null) setInput(prev);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = navigateHistory('down');
      if (next !== null) setInput(next);
    }
  }

  function handleChip(cmd: string) {
    submit(cmd);
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-black/70 p-0 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : 12, scale: reduceMotion ? 1 : 0.98 }}
            transition={{ duration: 0.25 }}
            className="flex h-[100svh] w-full flex-col overflow-hidden border border-ink/10 bg-graphite-deep font-mono text-sm md:h-[70vh] md:max-w-2xl md:rounded-xl"
          >
            <div className="flex items-center justify-between border-b border-ink/10 px-4 py-3">
              <span className="text-ink-faint">~/dweep</span>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close terminal"
                className="rounded-full p-1 text-ink-muted hover:text-lime"
              >
                <X size={16} />
              </button>
            </div>

            <div ref={scrollRef} className="flex-1 space-y-1 overflow-y-auto px-4 py-4" aria-live="polite">
              {bootedLines.map((line, i) => (
                <TerminalLine key={i} line={line} />
              ))}
              {lines.map((line, i) => (
                <TerminalLine key={`post-${i}`} line={line} />
              ))}
              {bootComplete && (
                <div className="flex items-center text-ink">
                  <span className="mr-2 text-ink-faint">$</span>
                  <span>{input}</span>
                  <span className="terminal-caret ml-0.5 inline-block h-4 w-2 bg-lime" />
                </div>
              )}
            </div>

            {bootComplete && (
              <div className="border-t border-ink/10 p-3">
                {/* Real input on desktop */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  aria-label="Terminal command input"
                  className="hidden w-full bg-transparent text-transparent caret-transparent outline-none md:block"
                  autoComplete="off"
                  spellCheck={false}
                />
                {/* Tappable command chips on mobile instead of a fake keyboard (spec §6.4) */}
                <div className="flex flex-wrap gap-2 md:hidden">
                  {MOBILE_CHIPS.map((cmd) => (
                    <button
                      key={cmd}
                      type="button"
                      onClick={() => handleChip(cmd)}
                      className="rounded-full border border-ink/15 px-3 py-2 text-xs text-ink-muted active:border-lime/50 active:text-lime"
                      style={{ minHeight: 44 }}
                    >
                      {cmd}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
