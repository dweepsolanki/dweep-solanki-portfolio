'use client';

import type { TerminalOutputLine } from './useTerminalCommands';

const LINKS = [
  { label: 'linkedin', href: 'https://www.linkedin.com/in/dweep-solanki/' },
  { label: 'github', href: 'https://github.com/dweepsolanki' },
  { label: 'email', href: 'mailto:shwetdweep@gmail.com' },
];

export function TerminalLine({ line }: { line: TerminalOutputLine }) {
  if (line.type === 'command') {
    return (
      <p className="text-lime">
        <span className="text-ink-faint">$ </span>
        {line.text}
      </p>
    );
  }
  if (line.type === 'error') {
    return <p className="text-amber/80">{line.text}</p>;
  }
  if (line.type === 'links') {
    return (
      <div className="flex flex-col gap-1">
        {LINKS.map((l) => (
          <a
            key={l.label}
            href={l.href}
            target={l.href.startsWith('http') ? '_blank' : undefined}
            rel="noreferrer"
            className="w-fit text-ink-muted underline decoration-ink-faint underline-offset-2 hover:text-lime"
          >
            {l.label}
          </a>
        ))}
      </div>
    );
  }
  return (
    <p className="whitespace-pre-line text-ink-muted">{line.text}</p>
  );
}
