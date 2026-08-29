'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, Linkedin } from 'lucide-react';
import type { ThinkingPost } from '@/data/thinkingPosts';

interface ThinkingExpandedPanelProps {
  post: ThinkingPost | null;
  onClose: () => void;
}

/**
 * Expanded Thinking in Public panel. Deliberately mirrors
 * ProjectExpandedPanel's structure and behavior (shared-layout transition,
 * focus trap + restoration, Escape/click-outside close) rather than
 * introducing a second interaction architecture for what is, from the
 * visitor's point of view, the same kind of action: click a card, see more,
 * close it. Kept concise per spec — image, title, short context, original
 * link — not a reproduction of the LinkedIn post itself.
 */
export function ThinkingExpandedPanel({ post, onClose }: ThinkingExpandedPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElRef = useRef<Element | null>(null);

  useEffect(() => {
    if (post) {
      triggerElRef.current = document.activeElement;
      closeButtonRef.current?.focus();

      function handleKey(e: KeyboardEvent) {
        if (e.key === 'Escape') {
          onClose();
          return;
        }
        if (e.key === 'Tab' && panelRef.current) {
          const focusable = panelRef.current.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
          );
          if (focusable.length === 0) return;
          const first = focusable[0]!;
          const last = focusable[focusable.length - 1]!;
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }

      document.addEventListener('keydown', handleKey);
      return () => {
        document.removeEventListener('keydown', handleKey);
        if (triggerElRef.current instanceof HTMLElement) triggerElRef.current.focus();
      };
    }
  }, [post, onClose]);

  return (
    <AnimatePresence>
      {post && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/70 p-4 backdrop-blur-sm md:p-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="thinking-panel-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-ink/10 bg-graphite-deep"
            layoutId={`thinking-container-${post.id}`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close post"
              className="absolute right-5 top-5 z-10 rounded-full border border-white/20 bg-black/40 p-2 text-ink-muted backdrop-blur-sm transition-colors duration-150 hover:border-lime/40 hover:text-lime"
            >
              <X size={16} />
            </button>

            <motion.div
              layoutId={`thinking-visual-${post.id}`}
              className="relative aspect-[16/10] w-full overflow-hidden bg-graphite-deep md:aspect-[16/9]"
            >
              {post.image && (
                <Image
                  src={post.image}
                  alt={`${post.title} — LinkedIn post visual`}
                  fill
                  sizes="(min-width: 768px) 672px, 90vw"
                  className="object-cover"
                  priority
                />
              )}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                <span className="font-mono text-[10px] uppercase tracking-wide text-lime">LinkedIn Post</span>
              </div>
            </motion.div>

            <div className="p-6 md:p-8">
              <motion.h3
                layoutId={`thinking-title-${post.id}`}
                id="thinking-panel-title"
                className="font-display text-2xl font-semibold text-ink md:text-3xl"
              >
                {post.title}
              </motion.h3>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint"
              >
                <span>{post.topic}</span>
                {post.date && (
                  <>
                    <span aria-hidden="true">·</span>
                    <span>{post.date}</span>
                  </>
                )}
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.18 }}
                className="mt-4 max-w-xl text-sm leading-relaxed text-ink-muted"
              >
                {post.excerpt}
              </motion.p>

              <motion.a
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.26 }}
                href={post.url}
                target="_blank"
                rel="noreferrer"
                className="group/link mt-8 inline-flex items-center gap-2 rounded-full border border-ink/20 px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-ink transition-colors duration-150 hover:border-lime/50 hover:text-lime"
              >
                <Linkedin size={14} />
                Read Original Post on LinkedIn
                <span className="transition-transform duration-150 group-hover/link:translate-x-0.5">↗</span>
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
