'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { beyondCards } from '@/data/beyondCards';

export function Beyond() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  return (
    <section id="beyond" ref={sectionRef} className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="06B / EXPLORATION" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          THERE&apos;S MORE TO ME THAN MY JOB TITLE.
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {beyondCards.map((card) => (
            <BeyondCardItem key={card.id} card={card} scrollYProgress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  );
}

function BeyondCardItem({
  card,
  scrollYProgress,
}: {
  card: (typeof beyondCards)[number];
  scrollYProgress: ReturnType<typeof useScroll>['scrollYProgress'];
}) {
  const reduceMotion = useReducedMotion();
  // Restrained scroll-linked depth (spec §4.7) — collapses to a shared,
  // simpler factor on mobile per §9; desktop gets per-card variation.
  const depthY = useTransform(scrollYProgress, [0, 1], [`${(card.parallaxFactor - 1) * -40}px`, `${(card.parallaxFactor - 1) * 40}px`]);

  const content = (
    <>
      <div className="absolute left-0 top-6 h-8 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100" />
      <div className="flex items-start justify-between gap-3">
        <p className="font-mono text-[10px] uppercase tracking-wide text-ink-faint transition-colors duration-150 group-hover:text-lime">
          {card.index}
        </p>
        {card.href && (
          <span className="text-ink-faint transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
            ↗
          </span>
        )}
      </div>
      <h3 className="mt-3 font-display text-xl font-semibold text-ink">{card.title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{card.description}</p>
    </>
  );

  const sharedProps = {
    style: reduceMotion ? undefined : { y: depthY },
    whileHover: reduceMotion ? undefined : { rotate: 1.2, scale: 1.02 },
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as const },
    className: 'group relative block rounded-xl border border-ink/10 bg-white/[0.02] p-6',
  };

  if (card.href) {
    return (
      <motion.a href={card.href} target="_blank" rel="noreferrer" {...sharedProps}>
        {content}
      </motion.a>
    );
  }

  return <motion.div {...sharedProps}>{content}</motion.div>;
}
