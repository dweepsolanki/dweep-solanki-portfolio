'use client';

import { useEffect, useRef, useState } from 'react';
import { useInView, useReducedMotion, animate } from 'framer-motion';

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
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (!inView || reduceMotion) return;
    const controls = animate(0, value, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduceMotion, value, duration]);

  return (
    <span ref={ref} className={className}>
      {display.toLocaleString()}
      {suffix}
    </span>
  );
}
