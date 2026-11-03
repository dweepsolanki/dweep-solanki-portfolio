'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';

/**
 * Light/dark theme via next-themes: follows the OS on first visit, persists
 * the choice in localStorage ("theme"), and injects a blocking script that
 * sets .light/.dark on <html> before first paint, so there is no flash.
 *
 * disableTransitionOnChange suppresses every CSS transition for the one frame
 * of the switch. Without it, the transition-colors / transition-all already
 * on cards and links would tween at different speeds, and elements Framer
 * Motion moves must not get extra CSS transitions anyway (README §5).
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange storageKey="theme">
      {children}
    </NextThemesProvider>
  );
}
