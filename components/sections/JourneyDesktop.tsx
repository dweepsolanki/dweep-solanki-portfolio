'use client';

import { useEffect, useRef } from 'react';
import { timeline } from '@/data/timeline';

/**
 * Desktop pinned horizontal timeline (spec §4.6, §7.2). This is the ONE
 * place in the codebase that uses GSAP + ScrollTrigger — justified here
 * because ScrollTrigger's pinning handles resize/scrollbar edge cases far
 * more robustly than a hand-rolled `position: sticky` + Motion approach
 * would at this level of polish. GSAP is dynamically imported so its cost
 * is never paid by users who don't reach this section (spec §8).
 */
export function JourneyDesktop() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx: any;
    let resizeTimer: ReturnType<typeof setTimeout>;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);

      ctx = gsap.context(() => {
        if (!wrapperRef.current || !trackRef.current) return;
        const trackWidth = trackRef.current.scrollWidth - window.innerWidth;

        gsap.to(trackRef.current, {
          x: -trackWidth,
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: () => `+=${trackWidth + window.innerHeight * 1.2}`,
            scrub: 0.4,
            pin: true,
            anticipatePin: 1,
          },
        });

        if (markerRef.current) {
          gsap.to(markerRef.current, {
            xPercent: 100,
            ease: 'none',
            scrollTrigger: {
              trigger: wrapperRef.current,
              start: 'top top',
              end: () => `+=${trackWidth + window.innerHeight * 1.2}`,
              scrub: 0.4,
            },
          });
        }
      }, wrapperRef);

      const handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
      };
      window.addEventListener('resize', handleResize);

      return () => window.removeEventListener('resize', handleResize);
    })();

    return () => {
      ctx?.revert?.();
      clearTimeout(resizeTimer);
    };
  }, []);

  return (
    <div ref={wrapperRef} className="relative h-screen overflow-hidden">
      <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-ink/10" />
      <div ref={markerRef} className="absolute left-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-lime" />

      <div ref={trackRef} className="flex h-full items-center gap-24 pl-[8vw] pr-[40vw]">
        {timeline.map((entry) => (
          <div key={entry.id} className="w-[380px] shrink-0">
            <p className="font-mono text-lg font-semibold text-lime">{entry.year}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{entry.category}</p>
            <h3 className="mt-2 font-display text-4xl font-semibold text-ink">{entry.org}</h3>
            <p className="mt-2 text-base text-ink-muted">{entry.role}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
