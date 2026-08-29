'use client';

import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';

const easeEditorial = [0.16, 1, 0.3, 1] as const;

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** ms between children, spec default 40-70ms */
  staggerDelay?: number;
  amount?: number;
}

const container = (staggerDelay: number) => ({
  hidden: {},
  show: {
    transition: { staggerChildren: staggerDelay / 1000 },
  },
});

export function Stagger({ children, className = '', staggerDelay = 60, amount = 0.2 }: StaggerProps) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount }}
      variants={container(staggerDelay)}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps {
  children: ReactNode;
  className?: string;
}

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeEditorial } },
};

export function StaggerItem({ children, className = '' }: StaggerItemProps) {
  const reduceMotion = useReducedMotion();
  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div className={className} variants={item}>
      {children}
    </motion.div>
  );
}
