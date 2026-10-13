'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, animate } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/motion/useReducedMotionSafe';

interface CountUpProps {
  value: number;
  suffix?: string;
  duration?: number;
  className?: string;
}

/**
 * Numeral count-up used exactly once, for the "5,000+ TEAMS" figure in
 * Proof of Work (spec §4.5) — an earned, specific use of the effect, not a
 * decorative default applied to every number on the site.
 */
export function CountUp({ value, suffix = '', duration = 0.9, className = '' }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduceMotion = useReducedMotionSafe();
  // Server HTML (and link previews / no-JS readers) gets the real figure;
  // the client drops to 0 while the number is off-screen, then counts up
  // once it scrolls into view.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    if (!inView) {
      setDisplay(0);
      return;
    }
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      {/* Fixed locale so server and client format identically (no hydration mismatch). */}
      {display.toLocaleString('en-US')}
      {suffix}
    </span>
  );
}
