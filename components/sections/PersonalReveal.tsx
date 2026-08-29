'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import Image from 'next/image';

const IMAGE_SRC = '/images/personal/dweep-solanki.png';
// Original asset is 1320×1366 — preserved exactly (untouched, unretouched,
// not AI-generated), aspect ratio locked here so the container never
// distorts or crops it.
const ASPECT = '1320 / 1366';

/**
 * A quiet interlude between "Right Now" and "Contact" — the one deliberate
 * moment the portfolio shows the person behind the work, after the visitor
 * has already seen the projects, recognition, and public thinking. No
 * chapter number/heading is added here on purpose: the existing 01–08
 * chapter sequence is protected content, and this is intentionally a
 * pause, not a ninth chapter.
 *
 * Motion treatment: a slow clip-path reveal + grayscale-to-color transition
 * on scroll-in (a restrained "developing photograph" feel), plus a very
 * small continuous parallax drift while the section is in view. Everything
 * collapses to an instant, full-color, static image under
 * prefers-reduced-motion.
 */
export function PersonalReveal() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-3%', '3%']);

  return (
    <section ref={sectionRef} className="relative px-6 py-24 md:px-12 md:py-32">
      <div className="mx-auto flex max-w-6xl flex-col items-center">
        <motion.div
          initial={reduceMotion ? undefined : { clipPath: 'inset(0 0 100% 0)' }}
          whileInView={reduceMotion ? undefined : { clipPath: 'inset(0 0 0% 0)' }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-ink/10 sm:max-w-md"
          style={{ aspectRatio: ASPECT }}
        >
          <motion.div
            initial={reduceMotion ? undefined : { filter: 'grayscale(1) brightness(0.75)', scale: 1.06 }}
            whileInView={reduceMotion ? undefined : { filter: 'grayscale(0) brightness(1)', scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 1.4, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            style={reduceMotion ? undefined : { y: parallaxY }}
            className="absolute inset-0 transition-transform duration-300 ease-utility hover:scale-[1.02]"
          >
            <Image
              src={IMAGE_SRC}
              alt="Dweep Solanki"
              fill
              sizes="(min-width: 640px) 448px, 90vw"
              className="object-cover"
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="mt-6 text-center"
        >
          <p className="font-display text-base font-semibold text-ink">DWEEP SOLANKI</p>
          <p className="mt-1 font-mono text-[11px] uppercase tracking-wide text-ink-faint">The person behind the work.</p>
        </motion.div>
      </div>
    </section>
  );
}
