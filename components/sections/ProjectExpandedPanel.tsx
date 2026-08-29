'use client';

import { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { X, ArrowRight, Github } from 'lucide-react';
import type { Project } from '@/data/projects';
import { ProjectTreatment } from './ProjectTreatment';

interface ProjectExpandedPanelProps {
  project: Project | null;
  onClose: () => void;
  onNext: () => void;
}

/**
 * Expanded case-study panel driven by Motion's layoutId shared-layout
 * transition (spec §5.1). Triggered by click (mouse/touch/keyboard-Enter
 * on the card), not hover, so behavior is identical across devices.
 */
export function ProjectExpandedPanel({ project, onClose, onNext }: ProjectExpandedPanelProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerElRef = useRef<Element | null>(null);

  // Focus management: trap focus while open, restore on close (spec §10).
  useEffect(() => {
    if (project) {
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
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project && (
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
            aria-labelledby="project-panel-title"
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-3xl rounded-2xl border border-ink/10 bg-graphite-deep p-6 md:p-10"
            layoutId={`project-container-${project.id}`}
          >
            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close case study"
              className="absolute right-5 top-5 rounded-full border border-ink/10 p-2 text-ink-muted transition-colors duration-150 hover:border-lime/40 hover:text-lime"
            >
              <X size={16} />
            </button>

            <span className="font-mono text-[11px] tracking-[0.12em] text-lime">{project.index} / CASE STUDY</span>

            <motion.h3
              layoutId={`project-title-${project.id}`}
              id="project-panel-title"
              className="mt-4 font-display text-3xl font-semibold text-ink md:text-4xl"
            >
              {project.title.toUpperCase()}
            </motion.h3>
            <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">
              <p className="font-mono text-xs uppercase tracking-wide text-ink-faint">{project.category}</p>
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group/gh inline-flex items-center gap-1 font-mono text-xs uppercase tracking-wide text-ink-faint transition-colors duration-150 hover:text-lime focus-visible:text-lime"
                >
                  <Github size={12} />
                  View on GitHub
                  <span className="transition-transform duration-150 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5">
                    ↗
                  </span>
                </a>
              )}
            </div>

            <motion.div
              layoutId={`project-visual-${project.id}`}
              className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-xl border border-ink/10 bg-graphite-deep"
            >
              <Image
                src={project.image}
                alt={`${project.title} — visual preview`}
                fill
                sizes="(min-width: 768px) 768px, 90vw"
                className="object-cover"
                priority
              />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
                <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{project.footerNote}</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="mt-6 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint"
            >
              {project.tags.map((tag) => (
                <span key={tag}>{tag} ·</span>
              ))}
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="mt-6 max-w-xl text-sm leading-relaxed text-ink-muted"
            >
              {project.description}
            </motion.p>

            <ProjectTreatment project={project} />

            {project.result && (
              <motion.p
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.35, type: 'spring', stiffness: 260, damping: 18 }}
                className="mt-8 inline-block rounded-full border border-amber/30 bg-amber/10 px-4 py-2 font-mono text-xs uppercase tracking-wide text-amber"
              >
                {project.result}
              </motion.p>
            )}

            <div className="mt-10 flex justify-end border-t border-ink/10 pt-6">
              <button
                type="button"
                onClick={onNext}
                className="flex items-center gap-2 font-mono text-xs uppercase tracking-wide text-ink-muted transition-colors duration-150 hover:text-lime"
              >
                Next case study
                <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
