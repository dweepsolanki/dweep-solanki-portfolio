'use client';

import { useEffect, useState } from 'react';
import { motion, useTransform, type MotionValue } from 'framer-motion';

interface NavProps {
  onOpenTerminal: () => void;
  scrollY: MotionValue<number>;
}

const LINKS = [
  { label: 'WORK', href: '#work' },
  { label: 'ABOUT', href: '#about' },
  { label: 'PROOF', href: '#proof' },
  { label: 'THINKING', href: '#thinking' },
  { label: 'CONTACT', href: '#contact' },
];

const SECTION_IDS = LINKS.map((l) => l.href.slice(1));

/**
 * Two small, purpose-driven additions on top of the original nav (spec
 * §4.11 called for a nav underline that was never actually wired up):
 *
 * 1. An active-section underline that slides between links via a shared
 *    `layoutId`, driven by a single IntersectionObserver watching the five
 *    sections the nav links point to — gives a genuine "you are here" cue
 *    that was previously missing.
 * 2. A backdrop that fades in only after the person has scrolled past the
 *    hero. The chapter background continuously changes color/brightness
 *    underneath the nav; a fully transparent nav risks poor contrast
 *    against some of those tones, so a subtle blur + tint restores
 *    legibility without the nav feeling like a heavy fixed bar from the
 *    very first frame.
 */
export function Nav({ onOpenTerminal, scrollY }: NavProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const backdropOpacity = useTransform(scrollY, [0, 120], [0, 1]);

  useEffect(() => {
    const sections = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          const top = visible.reduce((a, b) => (a.intersectionRatio > b.intersectionRatio ? a : b));
          setActiveId(top.target.id);
        }
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      style={{
        backgroundColor: useTransform(backdropOpacity, (v) => `rgba(10, 10, 12, ${v * 0.6})`),
        backdropFilter: useTransform(backdropOpacity, (v) => (v > 0.05 ? `blur(${v * 8}px)` : 'none')),
      }}
      className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 md:px-12"
    >
      <a href="#" className="font-mono text-xs font-semibold tracking-[0.12em] text-ink">
        DWEEP SOLANKI
      </a>

      <nav className="hidden items-center gap-6 font-mono text-[11px] tracking-[0.1em] text-ink-muted md:flex">
        {LINKS.map((link) => {
          const id = link.href.slice(1);
          const isActive = activeId === id;
          return (
            <a
              key={link.label}
              href={link.href}
              className={`relative py-1 transition-colors duration-150 hover:text-ink ${isActive ? 'text-ink' : ''}`}
            >
              {link.label}
              {isActive && (
                <motion.span
                  layoutId="nav-active-underline"
                  className="absolute inset-x-0 -bottom-1 h-px bg-lime"
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                />
              )}
            </a>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onOpenTerminal}
        className="font-mono text-[11px] tracking-[0.1em] text-ink-faint transition-colors duration-150 hover:text-lime"
        aria-haspopup="dialog"
      >
        ~/dweep
      </button>
    </motion.header>
  );
}
