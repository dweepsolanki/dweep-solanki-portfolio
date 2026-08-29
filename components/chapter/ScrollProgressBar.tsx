'use client';

import { motion, useReducedMotion, type MotionValue } from 'framer-motion';

interface ScrollProgressBarProps {
  scrollYProgress: MotionValue<number>;
}

/**
 * Thin lime progress line at the very top edge of the viewport, reflecting
 * how far through the whole page the person has scrolled. Reuses the same
 * shared scrollYProgress the ChapterEnvironment is already driven by (no
 * second scroll listener), so this is effectively free — one extra
 * `useTransform`-free `style={{ scaleX }}` binding on a single div.
 *
 * Justification: the chapter system already communicates "the world is
 * changing as you scroll," but gives no explicit sense of *how much is
 * left*. A thin, quiet progress line is a well-established, non-gimmicky
 * pattern for exactly that, and costs nothing extra to wire up here.
 * Hidden under reduced-motion, consistent with other ambient/ decorative
 * scroll-linked elements.
 */
export function ScrollProgressBar({ scrollYProgress }: ScrollProgressBarProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX: scrollYProgress }}
      className="fixed inset-x-0 top-0 z-50 h-[2px] origin-left bg-lime/60"
    />
  );
}
