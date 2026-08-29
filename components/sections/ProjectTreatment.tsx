'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import type { Project } from '@/data/projects';

/**
 * Renders the per-project "extra" visual inside the expanded panel, keyed
 * off Project.treatment (spec §5.2) rather than the project id — keeps the
 * panel reusable if a 7th project is added later.
 */
export function ProjectTreatment({ project }: { project: Project }) {
  switch (project.treatment) {
    case 'sequence':
      return <SequenceFlow stages={project.stages ?? []} connected />;
    case 'flow':
      return <SequenceFlow stages={project.stages ?? []} connected arrows />;
    case 'redacted':
      return <Redacted />;
    case 'sparkline':
      return <Sparkline />;
    case 'spec-sheet':
      return <SpecSheet text="AES-256-GCM × KYBER / PQC" />;
    case 'quiet':
    default:
      return null;
  }
}

function SequenceFlow({ stages, arrows = false }: { stages: string[]; connected?: boolean; arrows?: boolean }) {
  return (
    <div className="mt-8 flex flex-wrap items-center gap-2">
      {stages.map((stage, i) => (
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.12 }}
          className="flex items-center gap-2"
        >
          <span className="rounded-full border border-lime/30 bg-lime/5 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wide text-lime">
            {stage}
          </span>
          {i < stages.length - 1 && <span className="text-ink-faint">{arrows ? '→' : '·'}</span>}
        </motion.div>
      ))}
    </div>
  );
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

function Sparkline() {
  const points = '0,20 15,14 30,18 45,8 60,12 75,4 90,9 100,3';
  return (
    <motion.svg
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      viewBox="0 0 100 24"
      className="mt-8 h-10 w-40 text-lime"
      fill="none"
    >
      <motion.polyline
        points={points}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.svg>
  );
}

function SpecSheet({ text }: { text: string }) {
  const [typed, setTyped] = useState('');
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      i += 1;
      setTyped(text.slice(0, i));
      if (i >= text.length) clearInterval(id);
    }, 30);
    return () => clearInterval(id);
  }, [text]);

  return (
    <div className="mt-8 rounded-lg border border-ink/10 bg-black/20 p-3 font-mono text-xs text-lime">
      {typed}
      <span className="terminal-caret">_</span>
    </div>
  );
}
