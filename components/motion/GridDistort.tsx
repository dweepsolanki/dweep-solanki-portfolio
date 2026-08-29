'use client';

import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'framer-motion';

/**
 * Faint background grid in the hero that bends very slightly toward the
 * pointer (spec §4.1). Implemented with a CSS custom property updated via
 * rAF-throttled pointermove — deliberately NOT driving React state/re-renders
 * per pointer event (spec §8 performance note).
 */
export function GridDistort() {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const frame = useRef<number>();

  useEffect(() => {
    if (reduceMotion) return;
    const el = ref.current;
    if (!el) return;

    function handleMove(e: PointerEvent) {
      if (frame.current) cancelAnimationFrame(frame.current);
      frame.current = requestAnimationFrame(() => {
        const rect = el!.getBoundingClientRect();
        const px = ((e.clientX - rect.left) / rect.width) * 100;
        const py = ((e.clientY - rect.top) / rect.height) * 100;
        el!.style.setProperty('--gx', `${px}%`);
        el!.style.setProperty('--gy', `${py}%`);
      });
    }

    window.addEventListener('pointermove', handleMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handleMove);
      if (frame.current) cancelAnimationFrame(frame.current);
    };
  }, [reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.05]"
      style={
        {
          '--gx': '50%',
          '--gy': '50%',
          backgroundImage:
            'linear-gradient(to right, #C6FF3D 1px, transparent 1px), linear-gradient(to bottom, #C6FF3D 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(circle 380px at var(--gx) var(--gy), black 40%, transparent 100%)',
          WebkitMaskImage: 'radial-gradient(circle 380px at var(--gx) var(--gy), black 40%, transparent 100%)',
          transition: 'mask-position 0.1s linear',
        } as React.CSSProperties
      }
    />
  );
}
