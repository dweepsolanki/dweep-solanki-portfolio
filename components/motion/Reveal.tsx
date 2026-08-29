'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  /** 'mask' for the premium clip-path headline wipe, 'fade' for standard translate+opacity */
  variant?: 'mask' | 'fade';
  as?: 'div' | 'h1' | 'h2' | 'h3' | 'p' | 'span';
  amount?: number;
}

const easeEditorial = [0.16, 1, 0.3, 1] as const;

/**
 * Shared viewport-triggered reveal primitive (spec §2.2). Every entrance
 * animation on the site should go through this component (or <Stagger>)
 * so reduced-motion behavior only needs to be implemented once.
 */
export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'fade',
  as = 'div',
  amount = 0.2,
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    return <MotionTag className={className}>{children}</MotionTag>;
  }

  if (variant === 'mask') {
    // IMPORTANT: whileInView must be observed on this OUTER wrapper, which
    // stays in its normal, untransformed layout position. The inner child
    // starts translated 110% downward (out of the masked window) — if the
    // observer watched the child directly, it would be looking at an
    // element that's rendered off-screen at rest and would never report
    // it "in view", so the reveal would never fire (a real bug found
    // during validation). Instead, the outer wrapper's own in-view state
    // propagates to the child via shared Motion variants.
    return (
      <motion.span
        className={`relative inline-block overflow-hidden ${className}`}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount }}
      >
        <motion.span
          className="inline-block"
          variants={{ hidden: { y: '110%' }, show: { y: '0%' } }}
          transition={{ duration: 0.7, delay, ease: easeEditorial }}
        >
          {children}
        </motion.span>
      </motion.span>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration: 0.6, delay, ease: easeEditorial }}
    >
      {children}
    </MotionTag>
  );
}
