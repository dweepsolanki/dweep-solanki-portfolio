'use client';

import { useState, useCallback } from 'react';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { ProjectCard } from './ProjectCard';
import { ProjectExpandedPanel } from './ProjectExpandedPanel';
import { projects } from '@/data/projects';

export function SelectedWork() {
  const [openId, setOpenId] = useState<string | null>(null);
  const activeProject = projects.find((p) => p.id === openId) ?? null;

  const handleOpen = useCallback((id: string) => setOpenId(id), []);
  const handleClose = useCallback(() => setOpenId(null), []);
  const handleNext = useCallback(() => {
    if (!activeProject) return;
    const idx = projects.findIndex((p) => p.id === activeProject.id);
    const next = projects[(idx + 1) % projects.length]!;
    setOpenId(next.id);
  }, [activeProject]);

  return (
    <section id="work" className="relative px-6 py-32 md:px-12">
      <div className="mx-auto max-w-6xl">
        <ChapterMarker label="04 / SELECTED WORK" className="mb-4 block" />
        <Reveal variant="mask" as="h2" className="font-display text-4xl font-semibold text-ink md:text-5xl">
          THINGS I&apos;VE BUILT.
        </Reveal>
        <Reveal delay={0.1} className="mt-2 text-ink-muted">
          <p>Problems I&apos;ve attacked.</p>
        </Reveal>

        <div className="mt-14 grid gap-5 md:grid-cols-2">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} onOpen={handleOpen} />
          ))}
        </div>
      </div>

      <ProjectExpandedPanel project={activeProject} onClose={handleClose} onNext={handleNext} />
    </section>
  );
}
