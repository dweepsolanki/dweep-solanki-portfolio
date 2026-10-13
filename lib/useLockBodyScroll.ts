'use client';

import { useEffect } from 'react';

// Shared across every caller so overlapping dialogs don't unlock the page
// when only one of them closes.
let lockCount = 0;
let savedOverflow = '';
let savedPaddingRight = '';

/**
 * Stops the page behind a modal from scrolling while `active` is true.
 * Without this, wheel/touch scrolling over a dialog's backdrop scrolled the
 * page underneath (and with it the scroll-driven chapter background).
 * Pads the body by the scrollbar's width so the layout doesn't shift when
 * the scrollbar disappears.
 */
export function useLockBodyScroll(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const html = document.documentElement;
    const body = document.body;
    if (lockCount === 0) {
      const scrollbarWidth = window.innerWidth - html.clientWidth;
      savedOverflow = html.style.overflow;
      savedPaddingRight = body.style.paddingRight;
      html.style.overflow = 'hidden';
      if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    }
    lockCount += 1;

    return () => {
      lockCount -= 1;
      if (lockCount === 0) {
        html.style.overflow = savedOverflow;
        body.style.paddingRight = savedPaddingRight;
      }
    };
  }, [active]);
}
