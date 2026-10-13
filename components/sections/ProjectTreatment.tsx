'use client';

import { motion } from 'framer-motion';
import type { Project } from '@/data/projects';
import { ProjectDiagram } from './ProjectDiagram';

/**
 * Renders the per-project "extra" visual inside the expanded panel, keyed
 * off Project.treatment (spec §5.2) rather than the project id — keeps the
 * panel reusable if a 7th project is added later.
 */
export function ProjectTreatment({ project }: { project: Project }) {
  switch (project.treatment) {
    case 'diagram':
      // Keyed so "Next case study" remounts it and the draw-in replays.
      return project.diagram ? <ProjectDiagram key={project.id} diagram={project.diagram} /> : null;
    case 'redacted':
      return <Redacted />;
    case 'quiet':
    default:
      return null;
  }
}

function Redacted() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="mt-8 flex items-center gap-3"
    >
      <div className="h-3 w-40 rounded-sm bg-ink/10" />
      <div className="h-3 w-24 rounded-sm bg-ink/10" />
      <span className="font-mono text-[10px] uppercase tracking-wide text-ink-faint">confidential / no client data</span>
    </motion.div>
  );
}
