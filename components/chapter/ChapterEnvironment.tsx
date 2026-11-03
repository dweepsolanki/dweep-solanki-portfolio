'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/motion/useReducedMotionSafe';
import { chapterWaypoints, measureWaypointProgress, type ChapterWaypoint } from '@/lib/chapters';

interface ChapterEnvironmentProps {
  scrollYProgress: MotionValue<number>;
}

/**
 * Renders the single, continuous, scroll-driven background for the entire
 * page (spec §3). This is deliberately the ONLY place page background color
 * is set — individual sections stay transparent so there is never a hard
 * cut between them, only continuous interpolation driven by one scroll
 * progress value.
 *
 * `scrollYProgress` is passed in from SiteShell (one shared `useScroll()`
 * call for the whole page — spec §8's "single scroll listener, not twelve")
 * rather than each scroll-aware component creating its own.
 *
 * With prefers-reduced-motion, falls back to flat per-waypoint colors with
 * a simple opacity cross-fade instead of continuous interpolation, per §3.6.
 *
 * Light and dark each have their own waypoint tones (lib/chapters.ts); see
 * the comment above the return for how the active one is chosen.
 */
export function ChapterEnvironment({ scrollYProgress }: ChapterEnvironmentProps) {
  const reduceMotion = useReducedMotionSafe();

  // Starts from the fallback fractions in lib/chapters.ts, then switches to
  // each section's measured position. Re-measured whenever the page height
  // changes — e.g. fonts/images loading, or JourneyDesktop's GSAP pin
  // spacer being inserted after its dynamic import resolves.
  const [progressInput, setProgressInput] = useState(() => chapterWaypoints.map((w) => w.progress));

  useEffect(() => {
    let frameId = 0;
    function measure() {
      cancelAnimationFrame(frameId);
      frameId = requestAnimationFrame(() => {
        const next = measureWaypointProgress();
        if (!next) return;
        setProgressInput((prev) => (prev.every((p, i) => Math.abs(p - next[i]!) < 0.001) ? prev : next));
      });
    }
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(document.body);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(frameId);
      observer.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  if (reduceMotion) {
    // Simplified, accessible fallback: static base tone (bg-graphite is
    // var-backed, so it follows the theme), no continuous interpolation, no
    // ambient glow drift.
    return <div className="fixed inset-0 -z-10 bg-graphite" aria-hidden="true" />;
  }

  // Both theme layers are always rendered and CSS shows the active one, so
  // the server output never depends on the theme (no hydration mismatch, no
  // flash before next-themes resolves) and both share one measurement.
  return (
    <>
      <EnvironmentLayer
        className="hidden dark:block"
        tones={chapterWaypoints}
        progressInput={progressInput}
        scrollYProgress={scrollYProgress}
      />
      <EnvironmentLayer
        className="dark:hidden"
        tones={LIGHT_TONES}
        progressInput={progressInput}
        scrollYProgress={scrollYProgress}
      />
    </>
  );
}

type Tone = Pick<ChapterWaypoint, 'background' | 'glow' | 'grain'>;

const LIGHT_TONES: Tone[] = chapterWaypoints.map((w) => w.light);

interface EnvironmentLayerProps {
  className: string;
  tones: Tone[];
  progressInput: number[];
  scrollYProgress: MotionValue<number>;
}

function EnvironmentLayer({ className, tones, progressInput, scrollYProgress }: EnvironmentLayerProps) {
  const backgroundOutput = useMemo(() => tones.map((w) => w.background), [tones]);
  const glowOutput = useMemo(() => tones.map((w) => w.glow), [tones]);
  const grainOutput = useMemo(() => tones.map((w) => w.grain), [tones]);

  const background = useTransform(scrollYProgress, progressInput, backgroundOutput);
  const glowColor = useTransform(scrollYProgress, progressInput, glowOutput);
  const grainOpacity = useTransform(scrollYProgress, progressInput, grainOutput);
  const glowY = useTransform(scrollYProgress, [0, 1], ['10%', '90%']);

  // Glow opacity, grain blend mode and vignette strength come from CSS
  // variables in globals.css (lighter in light mode).
  return (
    <motion.div
      className={`fixed inset-0 -z-10 overflow-hidden ${className}`}
      style={{ backgroundColor: background }}
      aria-hidden="true"
    >
      <motion.div
        className="absolute h-[60vmax] w-[60vmax] rounded-full blur-[120px] [opacity:var(--env-glow-opacity)]"
        style={{
          backgroundColor: glowColor,
          top: glowY,
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
      />
      <motion.div className="grain-layer absolute inset-0" style={{ opacity: grainOpacity }} />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_180px_60px_var(--env-vignette)]" />
    </motion.div>
  );
}
