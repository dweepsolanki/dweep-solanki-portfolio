'use client';

import { useCallback, useState } from 'react';
import { useTheme } from 'next-themes';
import { projects } from '@/data/projects';

export interface TerminalOutputLine {
  type: 'command' | 'output' | 'error' | 'links';
  text?: string;
}

const COMMANDS = ['help', 'whoami', 'ls', 'cat philosophy.txt', 'contact', 'projects', 'theme', 'clear', 'exit'];
const THEMES = ['light', 'dark', 'system'];

// Shared by the boot sequence and the interactive commands so the two
// can never drift apart.
const WHOAMI = 'Dweep Solanki\nBuilder across software, security & AI\nCustomers · Product · Engineering';
const LS = 'projects/\nsecurity/\nai/\nhackathons/';
const PHILOSOPHY = 'Build things.\nBreak assumptions.\nSecure what matters.\nShip what works.';

const BOOT_SEQUENCE: TerminalOutputLine[] = [
  { type: 'command', text: 'whoami' },
  { type: 'output', text: WHOAMI },
  { type: 'command', text: 'ls' },
  { type: 'output', text: LS },
  { type: 'command', text: 'cat philosophy.txt' },
  { type: 'output', text: PHILOSOPHY },
];

function runCommand(input: string): TerminalOutputLine[] {
  const cmd = input.trim().toLowerCase();
  switch (cmd) {
    case 'help':
      return [{ type: 'output', text: `Available commands:\n${COMMANDS.join(', ')}` }];
    case 'whoami':
      return [{ type: 'output', text: WHOAMI }];
    case 'ls':
      return [{ type: 'output', text: LS }];
    case 'cat philosophy.txt':
      return [{ type: 'output', text: PHILOSOPHY }];
    case 'projects':
      return [{ type: 'output', text: projects.map((p) => p.title).join(', ') }];
    case 'contact':
      return [{ type: 'links' }];
    case 'clear':
      return [];
    case 'exit':
      return [{ type: 'output', text: 'Closing terminal…' }];
    default:
      return [
        { type: 'error', text: `command not found: ${input}` },
        { type: 'error', text: "try 'help'" },
      ];
  }
}

export function useTerminalCommands(onExit: () => void) {
  const [lines, setLines] = useState<TerminalOutputLine[]>([]);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number | null>(null);
  const { theme, resolvedTheme, setTheme } = useTheme();

  const submit = useCallback(
    (input: string) => {
      if (!input.trim()) return;
      const cmd = input.trim().toLowerCase();

      if (cmd === 'clear') {
        setLines([]);
        setHistory((h) => [...h, input]);
        setHistoryIndex(null);
        return;
      }
      if (cmd === 'exit') {
        setLines((prev) => [...prev, { type: 'command', text: input }, ...runCommand(input)]);
        setHistory((h) => [...h, input]);
        setHistoryIndex(null);
        setTimeout(onExit, 400);
        return;
      }

      // `theme` needs next-themes, so it is handled here rather than in the
      // pure runCommand. The terminal itself stays dark; this changes the page.
      if (cmd === 'theme' || cmd.startsWith('theme ')) {
        const arg = cmd.slice('theme'.length).trim();
        let output: TerminalOutputLine[];
        if (!arg) {
          const current = theme === 'system' ? `system (${resolvedTheme})` : theme;
          output = [{ type: 'output', text: `theme: ${current}\nusage: theme light | dark | system` }];
        } else if (THEMES.includes(arg)) {
          setTheme(arg);
          output = [{ type: 'output', text: `theme set to ${arg}` }];
        } else {
          output = [{ type: 'error', text: `unknown theme: ${arg}` }, { type: 'error', text: 'usage: theme light | dark | system' }];
        }
        setLines((prev) => [...prev, { type: 'command', text: input }, ...output]);
        setHistory((h) => [...h, input]);
        setHistoryIndex(null);
        return;
      }

      setLines((prev) => [...prev, { type: 'command', text: input }, ...runCommand(input)]);
      setHistory((h) => [...h, input]);
      setHistoryIndex(null);
    },
    [onExit, theme, resolvedTheme, setTheme]
  );

  const autocomplete = useCallback((partial: string) => {
    const match = COMMANDS.find((c) => c.startsWith(partial.toLowerCase()) && partial.length > 0);
    return match ?? partial;
  }, []);

  const navigateHistory = useCallback(
    (direction: 'up' | 'down'): string | null => {
      if (history.length === 0) return null;
      let nextIndex: number;
      if (historyIndex === null) {
        nextIndex = direction === 'up' ? history.length - 1 : history.length - 1;
      } else {
        nextIndex = direction === 'up' ? Math.max(0, historyIndex - 1) : Math.min(history.length - 1, historyIndex + 1);
      }
      setHistoryIndex(nextIndex);
      return history[nextIndex] ?? null;
    },
    [history, historyIndex]
  );

  return { lines, setLines, submit, autocomplete, navigateHistory, BOOT_SEQUENCE, COMMANDS };
}
