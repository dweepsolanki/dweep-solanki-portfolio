'use client';

import { motion } from 'framer-motion';
import { Linkedin, Github, Mail } from 'lucide-react';
import { ChapterMarker } from '@/components/chapter/ChapterMarker';
import { Reveal } from '@/components/motion/Reveal';
import { Stagger, StaggerItem } from '@/components/motion/Stagger';
import { MagneticButton } from '@/components/motion/MagneticButton';

const LINKS = [
  { label: 'LINKEDIN', href: 'https://www.linkedin.com/in/dweep-solanki/', icon: Linkedin },
  { label: 'GITHUB', href: 'https://github.com/dweepsolanki', icon: Github },
  { label: 'EMAIL', href: 'mailto:shwetdweep@gmail.com', icon: Mail },
];

// Contact deliberately slows down and thins out (spec §4.10) — longer
// durations, smaller stagger groups than the rest of the site.
export function Contact() {
  return (
    <section id="contact" className="relative px-6 py-40 md:px-12">
      <div className="mx-auto max-w-4xl">
        <ChapterMarker label="08 / CONTACT" className="mb-6 block" />

        <h2 className="font-display text-4xl font-semibold leading-tight text-ink md:text-6xl">
          <Reveal variant="mask">HAVE A HARD PROBLEM?</Reveal>
        </h2>
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-4xl font-semibold leading-tight text-lime md:text-6xl"
        >
          LET&apos;S BUILD SOMETHING.
        </motion.h2>

        <Reveal delay={0.5} className="mt-8 max-w-xl">
          <p className="text-lg text-ink-muted">
            Interested in ambitious problems across software, cybersecurity, AI and product.
          </p>
        </Reveal>

        <Stagger className="mt-12 flex flex-wrap gap-4" staggerDelay={120}>
          {LINKS.map((link) => (
            <StaggerItem key={link.label}>
              <MagneticButton
                as="a"
                href={link.href}
                target={link.href.startsWith('http') ? '_blank' : undefined}
                rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                title={link.label === 'EMAIL' ? 'Email shwetdweep@gmail.com' : undefined}
                className="group inline-flex items-center gap-2 rounded-full border border-ink/20 px-6 py-3 text-sm font-semibold text-ink transition-colors duration-150 hover:border-lime/50 hover:text-lime"
              >
                <link.icon size={15} className="transition-transform duration-150 group-hover:translate-x-0.5" />
                {link.label}
              </MagneticButton>
            </StaggerItem>
          ))}
        </Stagger>
      </div>

      <footer className="mx-auto mt-32 max-w-4xl border-t border-ink/10 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-ink-faint">
          <div>
            <p className="font-display text-base font-semibold text-ink">DWEEP SOLANKI</p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-wide">SOFTWARE × SECURITY × AI</p>
            <p className="mt-1">Built with curiosity.</p>
          </div>
          <p>© 2026</p>
        </div>
      </footer>
    </section>
  );
}
