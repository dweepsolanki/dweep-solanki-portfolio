'use client';

import { useEffect, useMemo, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/motion/useReducedMotionSafe';
import { chapterWaypoints, measureWaypointProgress } from '@/lib/chapters';

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
  const backgroundOutput = useMemo(() => chapterWaypoints.map((w) => w.background), []);
  const glowOutput = useMemo(() => chapterWaypoints.map((w) => w.glow), []);
  const grainOutput = useMemo(() => chapterWaypoints.map((w) => w.grain), []);

  const background = useTransform(scrollYProgress, progressInput, backgroundOutput);
  const glowColor = useTransform(scrollYProgress, progressInput, glowOutput);
  const grainOpacity = useTransform(scrollYProgress, progressInput, grainOutput);
  const glowY = useTransform(scrollYProgress, [0, 1], ['10%', '90%']);

  if (reduceMotion) {
    // Simplified, accessible fallback: static graphite base, no continuous
    // interpolation, no ambient glow drift. Individual sections may still
    // apply their own flat tint via CSS class in this mode if desired.
    return <div className="fixed inset-0 -z-10 bg-graphite" aria-hidden="true" />;
  }

  return (
    <motion.div className="fixed inset-0 -z-10 overflow-hidden" style={{ backgroundColor: background }} aria-hidden="true">
      <motion.div
        className="absolute h-[60vmax] w-[60vmax] rounded-full blur-[120px] opacity-[0.12]"
        style={{
          backgroundColor: glowColor,
          top: glowY,
          left: '50%',
          x: '-50%',
          y: '-50%',
        }}
      />
      <motion.div className="grain-layer absolute inset-0" style={{ opacity: grainOpacity }} />
      <div className="pointer-events-none absolute inset-0 [box-shadow:inset_0_0_180px_60px_rgba(0,0,0,0.55)]" />
    </motion.div>
  );
}
