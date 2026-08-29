'use client';

import { useEffect, useRef } from 'react';
import { timeline } from '@/data/timeline';

interface JourneyDesktopProps {
  /** Whether the desktop pinned experience is currently the active one.
   * Journey.tsx now keeps this component permanently mounted and toggles
   * visibility via CSS instead of conditionally rendering it in/out of the
   * tree — see the effect below for why. */
  enabled: boolean;
}

/**
 * Desktop pinned horizontal timeline (spec §4.6, §7.2). This is the ONE
 * place in the codebase that uses GSAP + ScrollTrigger — justified here
 * because ScrollTrigger's pinning handles resize/scrollbar edge cases far
 * more robustly than a hand-rolled `position: sticky` + Motion approach
 * would at this level of polish. GSAP is dynamically imported so its cost
 * is never paid by users who don't reach this section (spec §8).
 *
 * Lifecycle note (fixes a reproduced runtime bug — see JourneyDesktop's
 * effect below and Journey.tsx): GSAP's ScrollTrigger `pin` restructures
 * the DOM around `wrapperRef` with its own "pin-spacer" wrapper element.
 * If React unmounts this component (which it previously did every time the
 * viewport crossed the desktop/mobile breakpoint) while that restructuring
 * is in effect, React's own reconciler and GSAP's manual DOM manipulation
 * end up disagreeing about the DOM tree shape, producing a NotFoundError
 * ("Failed to execute 'removeChild' on 'Node': the node to be removed is
 * not a child of this node"). This was verified by isolating the two
 * systems: repeatedly mounting/unmounting this component with the GSAP
 * logic stripped out never errors; with GSAP's pin active, it reliably
 * does. The fix is to never let React unmount/remount this component
 * across the breakpoint at all — Journey.tsx now keeps it permanently
 * mounted and toggles visibility with CSS, and this effect instead keys
 * off the `enabled` prop to create/tear down the ScrollTrigger pin. This
 * keeps the exact same pin/scrub/marker behavior and the exact same GSAP
 * usage — only *what triggers* setup and teardown has changed.
 */
export function JourneyDesktop({ enabled }: JourneyDesktopProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!enabled) return;

    // Guards against a race: if `enabled` flips back to false (or this
    // component unmounts for any other reason) before the dynamic imports
    // below resolve, the effect's cleanup would run while `ctx` is still
    // undefined — skip creating the ScrollTrigger entirely in that case
    // rather than setting one up after the fact.
    let cancelled = false;
    let ctx: gsap.Context | undefined;
    let ScrollTriggerRef: typeof import('gsap/ScrollTrigger').ScrollTrigger | undefined;
    let resizeTimer: ReturnType<typeof setTimeout>;
    let handleResize: (() => void) | undefined;
    // Captured now rather than read from the ref inside cleanup, since the
    // ref's `.current` could have changed by the time cleanup runs.
    const wrapperEl = wrapperRef.current;

    (async () => {
      const gsap = (await import('gsap')).default;
      const { ScrollTrigger } = await import('gsap/ScrollTrigger');
      gsap.registerPlugin(ScrollTrigger);
      ScrollTriggerRef = ScrollTrigger;

      if (cancelled) return;

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

      // Previously this listener's cleanup was returned from this inner
      // async function, which nothing ever consumed — it leaked a
      // duplicate 'resize' listener on every mount. Now registered and
      // removed via the outer effect's real cleanup below.
      handleResize = () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => ScrollTrigger.refresh(), 150);
      };
      window.addEventListener('resize', handleResize);
    })();

    return () => {
      cancelled = true;
      ctx?.revert();
      // Defensive: explicitly kill any ScrollTrigger still targeting this
      // wrapper in addition to ctx.revert() (harmless if revert already
      // handled it — kept as a belt-and-braces safety net).
      ScrollTriggerRef?.getAll().forEach((st) => {
        if (st.trigger === wrapperEl) st.kill();
      });
      clearTimeout(resizeTimer);
      if (handleResize) window.removeEventListener('resize', handleResize);
    };
  }, [enabled]);

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
