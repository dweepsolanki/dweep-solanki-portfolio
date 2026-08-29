'use client';

import { useCallback, useRef, useState } from 'react';
import { useScroll } from 'framer-motion';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { thinkingPosts } from '@/data/thinkingPosts';
import { ThinkingCard } from './ThinkingCard';
import { ThinkingExpandedPanel } from './ThinkingExpandedPanel';

// Cycling parallax factors for the grid — same restrained range Beyond.tsx
// uses (0.85–1.15), just applied to a 3-up repeating pattern here.
const PARALLAX_FACTORS = [0.92, 1.08, 1.0];

export function Thinking() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activePost = thinkingPosts.find((p) => p.id === openId) ?? null;
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] });

  const handleOpen = useCallback((id: string) => setOpenId(id), []);
  const handleClose = useCallback(() => setOpenId(null), []);

  return (
    <section id="thinking" ref={sectionRef} className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="07 / THINKING" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          THINGS I&apos;VE BEEN THINKING ABOUT.
        </Reveal>
        <Reveal delay={0.1} className="mt-4 max-w-2xl text-ink-muted">
          <p>A structured place for writing and public thinking—drawn from posts written along the way.</p>
        </Reveal>

        <Stagger className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={50}>
          {thinkingPosts.map((post, i) => (
            <StaggerItem key={post.id}>
              <ThinkingCard
                post={post}
                onOpen={handleOpen}
                scrollYProgress={scrollYProgress}
                parallaxFactor={PARALLAX_FACTORS[i % PARALLAX_FACTORS.length]}
              />
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <ThinkingExpandedPanel post={activePost} onClose={handleClose} />
    </section>
  );
}
