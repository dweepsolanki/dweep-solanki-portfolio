'use client';

import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';

const STATUS_ITEMS = [
  { label: 'STATUS', value: 'Looking to join a new team' },
  { label: 'EXPLORING', value: 'New opportunities' },
  { label: 'OPEN TO', value: 'Software Engineering · Cybersecurity · Product · AI' },
  { label: 'INTERESTED IN', value: 'Meaningful engineering and product challenges' },
];

export function RightNow() {
  return (
    <section id="right-now" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="07B / CURRENTLY" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          RIGHT NOW
        </Reveal>

        <Stagger className="mt-12 grid gap-5 md:grid-cols-4" staggerDelay={50}>
          {STATUS_ITEMS.map((item) => (
            <StaggerItem key={item.label}>
              <div className="group relative overflow-hidden rounded-xl border border-ink/10 bg-white/[0.02] p-6 transition-all duration-200 ease-utility hover:-translate-y-1 hover:border-lime/20">
                <span className="absolute left-0 top-6 h-6 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100" />
                <p className="font-mono text-[10px] uppercase tracking-wide text-lime">{item.label}</p>
                <p className="mt-3 text-sm text-ink">{item.value}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
