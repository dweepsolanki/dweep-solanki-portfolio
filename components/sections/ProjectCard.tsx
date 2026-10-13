'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
}

/**
 * The card itself is a plain container. The real control is the <button>
 * wrapping the title, whose ::after overlay stretches over the whole card so
 * a click anywhere still opens the case study (after:z-[1] lifts it above the
 * positioned image container). The GitHub link sits above that overlay
 * (relative z-10), so the two controls are siblings rather
 * than a link nested inside a role="button" (which screen readers and
 * keyboard users handle badly). The card shows the focus ring when its
 * button is focused — see .card-focus-ring in globals.css.
 */
export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  return (
    <div className="card-focus-ring group relative w-full cursor-pointer overflow-hidden rounded-xl border border-ink/10 bg-white/[0.02] p-6 text-left transition-all duration-200 ease-utility hover:-translate-y-1 hover:border-lime/30 active:translate-y-0">
      <span className="absolute left-0 top-6 h-8 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100 group-active:scale-y-100" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.12em] text-lime">{project.index} / CASE STUDY</span>
        <span className="text-ink-faint transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </div>

      <motion.h3 layoutId={`project-title-${project.id}`} className="mt-4 font-display text-2xl font-semibold text-ink">
        <button
          type="button"
          onClick={() => onOpen(project.id)}
          aria-haspopup="dialog"
          className="card-trigger text-left after:absolute after:inset-0 after:z-[1] after:content-['']"
        >
          {project.title.toUpperCase()}
        </button>
      </motion.h3>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{project.category}</p>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            className="group/gh relative z-10 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint transition-colors duration-150 hover:text-lime focus-visible:text-lime"
          >
            View on GitHub
            <span className="transition-transform duration-150 group-hover/gh:translate-x-0.5 group-hover/gh:-translate-y-0.5">
              ↗
            </span>
          </a>
        )}
      </div>

      <p className="mt-4 text-sm leading-relaxed text-ink-muted">{project.description}</p>

      <motion.div
        layoutId={`project-visual-${project.id}`}
        className="relative mt-6 aspect-[16/9] w-full overflow-hidden rounded-lg border border-ink/10 bg-graphite-deep"
      >
        <Image
          src={project.image}
          alt={`${project.title} — visual preview`}
          fill
          sizes="(min-width: 768px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 ease-utility group-hover:scale-[1.03]"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent p-3">
          <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">{project.footerNote}</span>
        </div>
      </motion.div>

      {project.result && (
        <p className="mt-4 font-mono text-[11px] uppercase tracking-wide text-amber">{project.result}</p>
      )}
    </div>
  );
}
