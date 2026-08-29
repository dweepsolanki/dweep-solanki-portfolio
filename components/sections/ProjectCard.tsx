'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import type { KeyboardEvent, MouseEvent } from 'react';
import type { Project } from '@/data/projects';

interface ProjectCardProps {
  project: Project;
  onOpen: (id: string) => void;
}

export function ProjectCard({ project, onOpen }: ProjectCardProps) {
  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return; // let the nested GitHub link handle its own keys
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(project.id);
    }
  }

  function handleGithubClick(e: MouseEvent<HTMLAnchorElement>) {
    e.stopPropagation();
  }

  function handleGithubKeyDown(e: KeyboardEvent<HTMLAnchorElement>) {
    e.stopPropagation();
  }

  return (
    <motion.div
      role="button"
      tabIndex={0}
      onClick={() => onOpen(project.id)}
      onKeyDown={handleKeyDown}
      aria-haspopup="dialog"
      aria-expanded={false}
      className="group relative w-full cursor-pointer overflow-hidden rounded-xl border border-ink/10 bg-white/[0.02] p-6 text-left transition-all duration-200 ease-utility hover:-translate-y-1 hover:border-lime/30 focus-visible:border-lime/50 active:translate-y-0"
    >
      <span className="absolute left-0 top-6 h-8 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100 group-active:scale-y-100" />
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] tracking-[0.12em] text-lime">{project.index} / CASE STUDY</span>
        <span className="text-ink-faint transition-transform duration-150 group-hover:translate-x-1 group-hover:-translate-y-1">
          ↗
        </span>
      </div>

      <motion.h3 layoutId={`project-title-${project.id}`} className="mt-4 font-display text-2xl font-semibold text-ink">
        {project.title.toUpperCase()}
      </motion.h3>
      <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">
        <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{project.category}</p>
        {project.githubUrl && (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer"
            onClick={handleGithubClick}
            onKeyDown={handleGithubKeyDown}
            className="group/gh inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wide text-ink-faint transition-colors duration-150 hover:text-lime focus-visible:text-lime"
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
    </motion.div>
  );
}
