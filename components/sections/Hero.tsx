'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { MagneticButton } from '@/components/motion/MagneticButton';
import { GridDistort } from '@/components/motion/GridDistort';
import { Reveal } from '@/components/motion/Reveal';

const KEYWORDS = ['ENGINEER', 'BUILDER', 'SECURITY', 'AI', 'PRODUCT', 'STARTUPS', 'SYSTEMS'];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start start', 'end start'] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.92]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const heroOpacity = useTransform(scrollYProgress, [0, 1], [1, 0.4]);
  const keywordSpacing = useTransform(scrollYProgress, [0, 1], ['0em', '0.35em']);
  const keywordOpacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  // Cursor-reactive metadata (spec §4.1) — small, rAF-synced via spring, no re-renders.
  const mvX = useMotionValue(0);
  const mvY = useMotionValue(0);
  const springX = useSpring(mvX, { damping: 20, stiffness: 150 });
  const springY = useSpring(mvY, { damping: 20, stiffness: 150 });

  function handlePointerMove(e: React.PointerEvent<HTMLElement>) {
    if (reduceMotion) return;
    const rect = sectionRef.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const relY = (e.clientY - rect.top - rect.height / 2) / rect.height;
    mvX.set(relX * 10);
    mvY.set(relY * 10);
  }

  return (
    <section
      ref={sectionRef}
      onPointerMove={handlePointerMove}
      className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden px-6 pt-28 md:px-12"
    >
      <GridDistort />

      <motion.div
        style={reduceMotion ? undefined : { scale: heroScale, y: heroY, opacity: heroOpacity }}
        className="relative z-10 mx-auto w-full max-w-6xl"
      >
        {/* 1. status + metadata entrance */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          style={reduceMotion ? undefined : { x: springX, y: springY }}
          className="mb-6 flex flex-wrap items-center gap-4 font-mono text-[11px] tracking-[0.12em] text-ink-muted"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-lime/30 bg-lime/5 px-3 py-1 text-lime">
            <span className="status-dot h-1.5 w-1.5 rounded-full bg-lime" />
            CURRENTLY BUILDING
          </span>
          <span>12.9716° N · 77.5946° E · IST</span>
        </motion.div>

        {/* 2. chapter marker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-4"
        >
          <ChapterMarker label="01 / INTRODUCTION" />
        </motion.div>

        {/* 3. masked headline reveal */}
        <h1 className="font-display text-[15vw] font-semibold leading-[0.95] tracking-tight text-ink sm:text-[10vw] md:text-[7.5rem]">
          <Reveal variant="mask">DWEEP SOLANKI</Reveal>
        </h1>

        {/* 4. role / subheading reveal */}
        <div className="mt-6">
          <Reveal delay={0.15}>
            <p className="font-display text-2xl font-medium text-ink md:text-3xl">Software Engineer</p>
          </Reveal>
          <Reveal delay={0.22}>
            <p className="mt-1 font-mono text-xs tracking-[0.15em] text-lime">CYBERSECURITY · AI · PRODUCT</p>
          </Reveal>
        </div>

        {/* 5. body copy reveal */}
        <Reveal delay={0.3} className="mt-6 max-w-xl">
          <p className="text-lg text-ink-muted md:text-xl">
            I build technology at the intersection of software, security, AI and real-world problems.
          </p>
        </Reveal>

        {/* 6. CTA reveal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4, type: 'spring', stiffness: 260, damping: 20 }}
          className="mt-10 flex flex-wrap items-center gap-4"
        >
          <MagneticButton
            as="a"
            href="#work"
            className="rounded-full bg-lime px-6 py-3 text-sm font-semibold text-graphite transition-colors duration-150 hover:bg-lime-dim"
          >
            EXPLORE MY WORK →
          </MagneticButton>
          <MagneticButton
            as="a"
            href="#contact"
            className="rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-150 hover:border-lime/50"
          >
            LET&apos;S TALK
          </MagneticButton>
        </motion.div>

        {/* 7. terminal status block reveal */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.55 }}
          className="mt-14 max-w-md rounded-lg border border-ink/10 bg-white/[0.02] p-5 font-mono text-xs"
        >
          <p className="text-lime">SYSTEM / AVAILABLE</p>
          <p className="mt-1 text-ink-muted">BUILDING IDEAS INTO USEFUL SYSTEMS</p>
          <div className="mt-4 space-y-1 text-ink-faint">
            <TerminalStatusLine delay={0.7} label="MODE" value="PRESENT" />
            <TerminalStatusLine delay={0.82} label="SIGNAL" value="CLEAR" />
            <TerminalStatusLine delay={0.94} label="STATUS" value="BUILDING" />
          </div>
        </motion.div>
      </motion.div>

      {/* Keyword row — no longer an infinite marquee; static until scroll begins,
          then tracks outward and fades as the hero compresses (spec §4.1) */}
      <motion.div
        style={reduceMotion ? undefined : { letterSpacing: keywordSpacing, opacity: keywordOpacity }}
        className="relative z-10 mt-16 flex flex-wrap gap-x-6 gap-y-2 font-mono text-[11px] uppercase text-ink-faint"
      >
        {KEYWORDS.map((word) => (
          <span key={word}>{word}</span>
        ))}
      </motion.div>
    </section>
  );
}

function TerminalStatusLine({ label, value, delay }: { label: string; value: string; delay: number }) {
  return (
    <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay }}>
      {label}: <span className="text-ink-muted">{value}</span>
    </motion.p>
  );
}
