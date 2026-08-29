'use client';

import { motion } from 'framer-motion';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';

interface Capability {
  index: string;
  title: string;
  description: string;
  tags: string[];
  personality: 'structural' | 'guarded' | 'responsive';
}

const CAPABILITIES: Capability[] = [
  {
    index: '01 / SOFTWARE',
    title: 'Systems that work.',
    description: 'Backend architecture, APIs, enterprise software, automation and product engineering.',
    tags: ['BACKEND ARCHITECTURE', 'APIs', 'ENTERPRISE SOFTWARE', 'AUTOMATION', 'PRODUCT ENGINEERING'],
    personality: 'structural',
  },
  {
    index: '02 / SECURITY',
    title: 'Systems that deserve trust.',
    description:
      'Cybersecurity, secure software development, IAM, authentication, authorization, privacy and compliance.',
    tags: ['CYBERSECURITY', 'SECURE SOFTWARE', 'IAM', 'AUTHENTICATION', 'AUTHORIZATION', 'PRIVACY'],
    personality: 'guarded',
  },
  {
    index: '03 / AI × PRODUCT',
    title: 'Technology that solves something.',
    description: 'AI systems, agents, product discovery, MVPs, customer problems and business impact.',
    tags: ['AI SYSTEMS', 'AGENTS', 'PRODUCT DISCOVERY', 'MVPs', 'CUSTOMER PROBLEMS', 'BUSINESS IMPACT'],
    personality: 'responsive',
  },
];

export function Build() {
  return (
    <section id="build" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="03 / BUILD" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          WHAT I BUILD
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-xl text-ink-muted">
          <p>Different disciplines. One approach: understand the problem, build the system, make it useful.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {CAPABILITIES.map((cap, i) => (
            <CapabilityCard key={cap.index} cap={cap} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ cap, delay }: { cap: Capability; delay: number }) {
  const isGuarded = cap.personality === 'guarded';
  const isStructural = cap.personality === 'structural';
  const isResponsive = cap.personality === 'responsive';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
      whileHover="hover"
      className="group relative overflow-hidden rounded-xl border border-ink/10 bg-white/[0.02] p-6"
    >
      {/* border trace — corners-in for 'guarded', simple fade for others */}
      <motion.div
        variants={{ hover: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: isGuarded ? 0.22 : 0.15 }}
        className="pointer-events-none absolute inset-0 rounded-xl border border-lime/40"
      />

      {isStructural && (
        <motion.div
          variants={{ hover: { opacity: 0.08 } }}
          initial={{ opacity: 0 }}
          className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(to_bottom,#C6FF3D_0px,#C6FF3D_1px,transparent_1px,transparent_24px)]"
        />
      )}

      <motion.div variants={{ hover: { y: -2 } }} className="relative z-10">
        <p className="font-mono text-[11px] tracking-[0.12em] text-lime">{cap.index}</p>
        <h3 className="mt-3 font-display text-2xl font-semibold text-ink">{cap.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-ink-muted">{cap.description}</p>

        <div className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
          {cap.tags.map((tag, idx) =>
            isResponsive ? (
              <motion.span
                key={tag}
                variants={{ hover: { opacity: 1, scale: 1 } }}
                initial={{ opacity: 0.55, scale: 0.96 }}
                transition={{ duration: 0.25, delay: idx * 0.03, type: 'spring', stiffness: 300, damping: 14 }}
              >
                {tag}
                {idx < cap.tags.length - 1 ? ' ·' : ''}
              </motion.span>
            ) : (
              <span key={tag} className="opacity-55 transition-opacity duration-150 group-hover:opacity-100">
                {tag}
                {idx < cap.tags.length - 1 ? ' ·' : ''}
              </span>
            )
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}
