'use client';

import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';

/**
 * Switch to `next`. Choosing the theme the OS already uses stores "system"
 * rather than the explicit value, so the site goes back to following the
 * OS instead of pinning a choice that happens to match it today.
 */
function useSwitchTheme() {
  const { resolvedTheme, systemTheme, setTheme } = useTheme();
  const next = resolvedTheme === 'dark' ? 'light' : 'dark';
  const switchTheme = () => setTheme(next === systemTheme ? 'system' : next);
  return { resolvedTheme, next, switchTheme };
}

/** next-themes only knows the resolved theme on the client; false until mount. */
export function useMounted() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return mounted;
}

/**
 * Header icon button. Shows the icon of the theme it switches TO (moon in
 * light, sun in dark). Before mount it renders the same box with an empty
 * 14px slot, so there is no layout shift and no hydration mismatch.
 * `-my-2 py-2 -mx-1 px-1` matches the MENU button's enlarged touch target
 * without making the header taller.
 */
export function ThemeToggle() {
  const { next, switchTheme } = useSwitchTheme();
  const mounted = useMounted();
  const label = mounted ? `Switch to ${next} theme` : 'Switch theme';

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={label}
      title={label}
      className="-mx-1 -my-2 inline-flex items-center px-1 py-2 text-ink-faint transition-colors duration-150 hover:text-lime"
    >
      {!mounted ? (
        <span className="block h-[14px] w-[14px]" />
      ) : next === 'light' ? (
        <Sun size={14} strokeWidth={1.75} aria-hidden="true" />
      ) : (
        <Moon size={14} strokeWidth={1.75} aria-hidden="true" />
      )}
    </button>
  );
}

/** Row for the mobile menu, styled like the menu's section links. */
export function ThemeMenuRow() {
  const { resolvedTheme, next, switchTheme } = useSwitchTheme();
  const mounted = useMounted();
  const current = mounted ? resolvedTheme ?? 'dark' : null;

  return (
    <button
      type="button"
      onClick={switchTheme}
      aria-label={current ? `Theme: ${current}. Switch to ${next} theme` : 'Switch theme'}
      className="flex w-full items-center justify-between py-4 font-mono text-xs tracking-[0.12em] text-ink-muted transition-colors duration-150 hover:text-lime"
    >
      <span>THEME: {current ? current.toUpperCase() : '—'}</span>
      <span className="text-ink-faint" aria-hidden="true">
        {current ? `→ ${next.toUpperCase()}` : ''}
      </span>
    </button>
  );
}
