'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useTransform, type MotionValue } from 'framer-motion';
import { useReducedMotionSafe } from '@/components/motion/useReducedMotionSafe';

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
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const reduceMotion = useReducedMotionSafe();
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

  // Mobile menu: close on Escape (returning focus to the toggle) or on a
  // tap anywhere outside the menu and its toggle.
  useEffect(() => {
    if (!menuOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    }
    function handlePointerDown(e: PointerEvent) {
      const target = e.target as Node;
      if (menuRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return;
      setMenuOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('keydown', handleKey);
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [menuOpen]);

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

      <div className="flex items-center gap-5">
        <button
          type="button"
          onClick={onOpenTerminal}
          className="font-mono text-[11px] tracking-[0.1em] text-ink-faint transition-colors duration-150 hover:text-lime"
          aria-haspopup="dialog"
        >
          ~/dweep
        </button>
        <button
          ref={menuButtonRef}
          type="button"
          onClick={() => setMenuOpen((open) => !open)}
          aria-expanded={menuOpen}
          aria-controls="mobile-nav"
          className="-my-2 py-2 font-mono text-[11px] tracking-[0.1em] text-ink transition-colors duration-150 hover:text-lime md:hidden"
        >
          {menuOpen ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {/* Mobile menu — the desktop link row above is hidden below md, so
          without this, phone visitors had no way to jump between sections. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.nav
            id="mobile-nav"
            ref={menuRef}
            aria-label="Sections"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-x-0 top-full border-b border-ink/10 bg-graphite/95 px-6 pb-6 pt-2 backdrop-blur-md md:hidden"
          >
            <ul className="flex flex-col">
              {LINKS.map((link) => {
                const isActive = activeId === link.href.slice(1);
                return (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={() => setMenuOpen(false)}
                      aria-current={isActive ? 'location' : undefined}
                      className={`flex items-center justify-between border-b border-ink/5 py-4 font-mono text-xs tracking-[0.12em] transition-colors duration-150 hover:text-lime ${
                        isActive ? 'text-lime' : 'text-ink'
                      }`}
                    >
                      {link.label}
                      <span className="text-ink-faint" aria-hidden="true">
                        →
                      </span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
