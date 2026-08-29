'use client';

import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const META_ROWS = [
  { label: 'APPROACH', value: 'UNDERSTAND THE PROBLEM. BUILD THE SYSTEM. MAKE IT USEFUL.' },
  { label: 'BASED IN', value: 'INDIA' },
  { label: 'FOCUS', value: 'SOFTWARE × SECURITY × AI' },
  { label: 'BUILDING SINCE', value: '2024' },
];

export function Human() {
  return (
    <section id="about" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-4xl">
        <ChapterMarker label="02 / HUMAN" className="mb-4 block" />
        <h2 className="font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
          <Reveal variant="mask">THE HUMAN BEHIND THE CODE</Reveal>
        </h2>

        <Reveal delay={0.1} className="mt-8 max-w-2xl">
          <p className="text-xl font-medium text-ink md:text-2xl">
            I don&apos;t just write code. I like figuring out what should be built.
          </p>
        </Reveal>

        <Reveal delay={0.18} className="mt-6 max-w-2xl">
          <p className="text-base leading-relaxed text-ink-muted md:text-lg">
            I started in cybersecurity, moved deeper into software engineering, and found myself
            increasingly interested in the space between technology and the problem it is supposed
            to solve. Today, I work across software engineering, cybersecurity, AI and
            product—turning ambiguous problems into systems people can actually use.
          </p>
        </Reveal>

        <Stagger className="mt-16 grid grid-cols-2 gap-8 border-t border-ink/10 pt-8 md:grid-cols-4" staggerDelay={60}>
          {META_ROWS.map((row) => (
            <StaggerItem key={row.label}>
              <p className="font-mono text-[11px] tracking-[0.12em] text-ink-faint">{row.label}</p>
              <p className="mt-2 text-sm text-ink">{row.value}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
