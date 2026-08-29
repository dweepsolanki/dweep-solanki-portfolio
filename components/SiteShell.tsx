'use client';

import { useState } from 'react';
import { useScroll } from 'framer-motion';
import { ChapterEnvironment } from '@/components/chapter/ChapterEnvironment';
import { ScrollProgressBar } from '@/components/chapter/ScrollProgressBar';
import { Nav } from '@/components/nav/Nav';
import { Terminal } from '@/components/terminal/Terminal';
import { Hero } from '@/components/sections/Hero';
import { Human } from '@/components/sections/Human';
import { Build } from '@/components/sections/Build';
import { SelectedWork } from '@/components/sections/SelectedWork';
import { Proof } from '@/components/sections/Proof';
import { Journey } from '@/components/sections/Journey';
import { Beyond } from '@/components/sections/Beyond';
import { Thinking } from '@/components/sections/Thinking';
import { RightNow } from '@/components/sections/RightNow';
import { PersonalReveal } from '@/components/sections/PersonalReveal';
import { Contact } from '@/components/sections/Contact';

export function SiteShell() {
  const [terminalOpen, setTerminalOpen] = useState(false);

  // One shared scroll source for the whole page (spec §8's "single scroll
  // listener, not twelve") — ChapterEnvironment, ScrollProgressBar, and Nav
  // all derive their scroll-linked values from this single useScroll() call
  // rather than each creating their own.
  const { scrollYProgress, scrollY } = useScroll();

  return (
    <>
      <ChapterEnvironment scrollYProgress={scrollYProgress} />
      <ScrollProgressBar scrollYProgress={scrollYProgress} />
      <Nav onOpenTerminal={() => setTerminalOpen(true)} scrollY={scrollY} />

      <main>
        <Hero />
        <Human />
        <Build />
        <SelectedWork />
        <Proof />
        <Journey />
        <Beyond />
        <Thinking />
        <RightNow />
        <PersonalReveal />
        <Contact />
      </main>

      <Terminal open={terminalOpen} onClose={() => setTerminalOpen(false)} />
    </>
  );
}
