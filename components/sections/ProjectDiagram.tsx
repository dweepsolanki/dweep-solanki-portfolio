'use client';

import { motion } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/motion/useReducedMotionSafe';
import type { ProjectDiagram as Diagram } from '@/data/projects';

const easeEditorial = [0.16, 1, 0.3, 1] as const;
const STEP_STAGGER = 0.12;
const START_DELAY = 0.25;

/**
 * "How it works" pipeline inside the expanded case-study panel. Each step
 * settles in and then draws the connector down to the next one, so the line
 * travels in the order the system actually runs and stops at the last step.
 * Vertical so it reads the same at 390px and at full panel width. Under
 * reduced motion everything renders in its final state.
 */
export function ProjectDiagram({ diagram }: { diagram: Diagram }) {
  const reduceMotion = useReducedMotionSafe();

  return (
    <figure className="mt-8 rounded-xl border border-ink/10 bg-black/20 p-5 md:p-6">
      <figcaption className="font-mono text-[10px] uppercase tracking-[0.12em] text-ink-faint">
        How it works · {diagram.title}
      </figcaption>

      <ol className="mt-5">
        {diagram.steps.map((step, i) => (
          <motion.li
            key={step.label}
            className="relative pb-6 pl-8 last:pb-0"
            initial={reduceMotion ? false : { opacity: 0, x: -6 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: START_DELAY + i * STEP_STAGGER, ease: easeEditorial }}
          >
            {i < diagram.steps.length - 1 && (
              // Connector from this step's dot down to the next step's dot.
              <motion.span
                aria-hidden="true"
                className="absolute bottom-0 left-[7px] top-[17px] w-px origin-top bg-lime/30"
                initial={reduceMotion ? false : { scaleY: 0 }}
                animate={{ scaleY: 1 }}
                transition={{ duration: STEP_STAGGER + 0.1, delay: START_DELAY + (i + 0.5) * STEP_STAGGER, ease: 'linear' }}
              />
            )}
            <span
              aria-hidden="true"
              className="absolute left-0 top-0.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-lime/50 bg-graphite-deep"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-lime" />
            </span>

            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-lime">
              <span className="mr-2 text-ink-faint">{String(i + 1).padStart(2, '0')}</span>
              {step.label}
            </p>
            <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ink-muted">{step.detail}</p>

            {step.branch && (
              <p className="mt-2 max-w-xl border-l border-amber/40 pl-3 text-xs leading-relaxed text-amber/90">
                <span aria-hidden="true">↳ </span>
                {step.branch}
              </p>
            )}

            {step.tech && (
              <p className="mt-2 font-mono text-[10px] uppercase tracking-wide text-ink-faint">
                {step.tech.join(' · ')}
              </p>
            )}
          </motion.li>
        ))}
      </ol>
    </figure>
  );
}
