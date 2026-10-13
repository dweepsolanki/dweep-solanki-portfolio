'use client';

import { useEffect, useState } from 'react';
// eslint-disable-next-line no-restricted-imports -- this file is the one sanctioned wrapper
import { useReducedMotion } from 'framer-motion';

/**
 * Hydration-safe replacement for Framer Motion's useReducedMotion().
 *
 * Framer's hook returns `null` during server rendering but the real
 * preference (`true` for reduced-motion users) on the client's very first
 * render. Any component that renders different markup based on it therefore
 * produces a hydration mismatch (React errors #418/#423), and React throws
 * away the server HTML and re-renders the whole page on the client.
 *
 * This hook reports `false` until after mount — matching what the server
 * rendered — and only then switches to the real preference. Use it
 * everywhere instead of importing useReducedMotion directly (enforced by
 * the no-restricted-imports rule in .eslintrc.json).
 */
export function useReducedMotionSafe(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted ? Boolean(prefersReducedMotion) : false;
}
