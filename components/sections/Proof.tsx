'use client';

import { motion } from 'framer-motion';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { CountUp } from '@/components/motion/CountUp';
import { recognitions } from '@/data/recognitions';

export function Proof() {
  const primary = recognitions.find((r) => r.primary);
  const secondary = recognitions.filter((r) => !r.primary);

  return (
    <section id="proof" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="05 / PROOF" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          BUILT. TESTED. RECOGNIZED.
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-xl text-ink-muted">
          <p>An archive of work made visible through outcomes, selections and rooms where the ideas had to stand up.</p>
        </Reveal>

        {primary && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-14 rounded-2xl border border-amber/20 bg-gradient-to-br from-amber/[0.06] to-transparent p-8 md:p-12"
          >
            <p className="font-mono text-[11px] tracking-[0.12em] text-amber">{primary.index} / RECOGNITION</p>
            <div className="mt-4 flex items-center gap-4">
              <motion.span
                initial={{ scale: 0.6, rotate: -8, opacity: 0 }}
                whileInView={{ scale: 1, rotate: 0, opacity: 1 }}
                viewport={{ once: true, amount: 0.6 }}
                transition={{ duration: 0.6, type: 'spring', stiffness: 200, damping: 16 }}
                className="text-5xl"
              >
                {primary.emoji}
              </motion.span>
              <h3 className="font-display text-3xl font-bold text-ink md:text-5xl">{primary.title}</h3>
            </div>
            <p className="mt-4 font-display text-lg text-ink md:text-xl">{primary.org}</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-wide text-ink-faint">{primary.subOrg}</p>
            <p className="mt-4 text-ink-muted">
              Final result across{' '}
              {primary.countUpValue ? (
                <CountUp value={primary.countUpValue} suffix={primary.countUpSuffix} className="font-semibold text-amber" />
              ) : null}{' '}
              teams.
            </p>
          </motion.div>
        )}

        <Stagger className="mt-8 grid gap-5 md:grid-cols-3" staggerDelay={60}>
          {secondary.map((r) => (
            <StaggerItem key={r.id}>
              <div className="h-full rounded-xl border border-ink/10 bg-white/[0.02] p-6">
                <p className="font-mono text-[11px] tracking-[0.12em] text-lime">{r.index} / RECOGNITION</p>
                <h4 className="mt-3 font-display text-xl font-semibold text-ink">{r.title}</h4>
                <p className="mt-1 text-sm text-ink-muted">{r.org}</p>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">{r.subOrg}</p>
                <p className="mt-3 text-sm text-ink-muted">{r.description}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
