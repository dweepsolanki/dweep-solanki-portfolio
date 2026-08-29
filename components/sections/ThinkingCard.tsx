'use client';

import { motion, useTransform, useReducedMotion, type MotionValue } from 'framer-motion';
import Image from 'next/image';
import type { KeyboardEvent } from 'react';
import type { ThinkingPost } from '@/data/thinkingPosts';

interface ThinkingCardProps {
  post: ThinkingPost;
  onOpen: (id: string) => void;
  /** Shared section-level scroll progress, passed down so every card reads
   * from one scroll listener rather than each creating its own (spec §8) —
   * same pattern as BeyondCardItem in Beyond.tsx. */
  scrollYProgress: MotionValue<number>;
  /** 0.85–1.15-ish factor for a restrained per-card scroll drift, mirroring
   * Beyond.tsx's card treatment so this now-image-heavy grid doesn't read
   * as a flat, uniform stack. Applied to the OUTER wrapper only — never to
   * the layoutId'd image/title elements below — so it can't interfere with
   * the shared-layout expand/collapse transition. */
  parallaxFactor?: number;
}

/**
 * Collapsed Thinking in Public card. Image is the dominant element (per the
 * approved card redesign); title and light metadata sit below it. Reuses
 * the exact same shared-layout expand mechanism as the project cards
 * (layoutId on the image and title), so opening a thinking post feels like
 * the same interaction language as opening a case study, not a new pattern.
 */
export function ThinkingCard({ post, onOpen, scrollYProgress, parallaxFactor = 1 }: ThinkingCardProps) {
  const reduceMotion = useReducedMotion();

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(post.id);
    }
  }

  const parallaxY = useTransform(
    scrollYProgress,
    [0, 1],
    [`${(parallaxFactor - 1) * -30}px`, `${(parallaxFactor - 1) * 30}px`]
  );

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(post.id)}
      onKeyDown={handleKeyDown}
      aria-haspopup="dialog"
      aria-expanded={false}
      style={reduceMotion ? undefined : { y: parallaxY }}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-ink/10 bg-white/[0.02] transition-all duration-200 ease-utility hover:-translate-y-1 hover:border-lime/30 focus-visible:border-lime/50 active:translate-y-0"
    >
      <motion.div
        layoutId={`thinking-visual-${post.id}`}
        className="relative aspect-[4/3] w-full overflow-hidden bg-graphite-deep"
      >
        {post.image && (
          <Image
            src={post.image}
            alt={`${post.title} — LinkedIn post visual`}
            fill
            sizes="(min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-300 ease-utility group-hover:scale-[1.03]"
          />
        )}
        <span className="absolute left-0 top-6 h-8 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100 group-active:scale-y-100" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent p-4">
          <span className="font-mono text-[10px] uppercase tracking-wide text-lime opacity-80 transition-opacity duration-200 group-hover:opacity-100">
            LinkedIn Post
          </span>
        </div>
        <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-black/40 text-ink-faint opacity-0 backdrop-blur-sm transition-all duration-200 group-hover:opacity-100 group-hover:text-lime">
          ↗
        </span>
      </motion.div>

      <div className="p-5">
        <motion.h4 layoutId={`thinking-title-${post.id}`} className="font-display text-lg font-semibold text-ink">
          {post.title}
        </motion.h4>
        <div className="mt-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wide">
          <span className="text-ink-faint opacity-70 transition-opacity duration-200 group-hover:opacity-100">
            {post.topic}
          </span>
        </div>
      </div>
    </motion.div>
  );
}
