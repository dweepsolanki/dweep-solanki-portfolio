'use client';

import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';
import type { ReactNode, MouseEvent } from 'react';

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  href?: string;
  as?: 'button' | 'a';
  target?: string;
  rel?: string;
  title?: string;
}

/**
 * Pointer-attraction wrapper for primary CTAs (spec §2.2, §4.1). No-ops
 * cleanly on touch devices (no persistent cursor to attract toward) and
 * under prefers-reduced-motion — falls back to a simple active-press scale.
 */
export function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  as = 'button',
  target,
  rel,
  title,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { damping: 20, stiffness: 150 });
  const springY = useSpring(y, { damping: 20, stiffness: 150 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const relX = e.clientX - (rect.left + rect.width / 2);
    const relY = e.clientY - (rect.top + rect.height / 2);
    x.set(relX * 0.25);
    y.set(relY * 0.25);
  }

  function handleMouseLeave() {
    x.set(0);
    y.set(0);
  }

  const Tag = as === 'a' ? motion.a : motion.button;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      <Tag
        href={href}
        target={target}
        rel={rel}
        title={title}
        onClick={onClick}
        whileTap={{ scale: 0.97 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className={className}
      >
        {children}
      </Tag>
    </motion.div>
  );
}
