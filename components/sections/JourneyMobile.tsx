'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { timeline } from '@/data/timeline';

export function JourneyMobile() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ['start end', 'end start'] });
  const markerY = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);

  return (
    <div ref={containerRef} className="relative pl-8">
      <div className="absolute left-2 top-0 h-full w-px bg-ink/10" />
      <motion.div className="absolute left-2 h-3 w-3 -translate-x-1/2 rounded-full bg-lime" style={{ top: markerY }} />

      <div className="space-y-14">
        {timeline.map((entry, i) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: i * 0.05, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="font-mono text-sm font-semibold text-lime">{entry.year}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{entry.category}</p>
            <h3 className="mt-1 font-display text-xl font-semibold text-ink">{entry.org}</h3>
            <p className="mt-1 text-sm text-ink-muted">{entry.role}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
