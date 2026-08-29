'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { JourneyMobile } from './JourneyMobile';

// GSAP-backed desktop variant is dynamically imported so its bundle cost
// (and the GSAP dependency itself) is never paid on mobile (spec §8, §9).
const JourneyDesktop = dynamic(() => import('./JourneyDesktop').then((m) => m.JourneyDesktop), {
  ssr: false,
  loading: () => <div className="h-[60vh]" aria-hidden="true" />,
});

export function Journey() {
  const [isDesktop, setIsDesktop] = useState<boolean | null>(null);
  // Once the desktop (GSAP-pinned) variant has been mounted for the first
  // time, it stays mounted permanently and is only ever hidden/shown via
  // CSS from then on — see JourneyDesktop.tsx for why. Pure-mobile visitors
  // who never cross the breakpoint still never pay JourneyDesktop's GSAP
  // bundle cost, since it only mounts the first time isDesktop becomes true.
  const [hasMountedDesktop, setHasMountedDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 900px)');
    setIsDesktop(mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isDesktop) setHasMountedDesktop(true);
  }, [isDesktop]);

  return (
    <section id="journey" className="relative py-32">
      <div className="mx-auto max-w-6xl px-6 md:px-12">
        <ChapterMarker label="06 / JOURNEY" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          WHERE I&apos;VE BEEN BUILDING
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-xl text-ink-muted">
          <p>A chronology of systems, teams and independent experiments—less a résumé, more a record of momentum.</p>
        </Reveal>
      </div>

      <div className="mt-14">
        {isDesktop === null ? null : (
          <>
            {hasMountedDesktop && (
              <div className={isDesktop ? '' : 'hidden'}>
                <JourneyDesktop enabled={isDesktop} />
              </div>
            )}
            {!isDesktop && (
              <div className="px-6 md:px-12">
                <JourneyMobile />
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
