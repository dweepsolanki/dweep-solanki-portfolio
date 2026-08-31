export interface BeyondCard {
  id: string;
  index: string;
  title: string;
  description: string;
  parallaxFactor: number; // 0.85–1.15, per spec §4.7
  /** Optional external link — only set for cards that should open somewhere
   * (currently just Education / Community). Cards without this remain
   * plain, non-interactive divs exactly as before. */
  href?: string;
}

export const beyondCards: BeyondCard[] = [
  { id: 'hackathons', index: '01 / LIVE PROBLEMS', title: 'Hackathons', description: 'Problems solved under pressure.', parallaxFactor: 0.9 },
  { id: 'ai-experiments', index: '02 / APPLIED AI', title: 'AI Experiments', description: 'Agents, automation and applied AI.', parallaxFactor: 1.1 },
  { id: 'cybersecurity', index: '03 / TRUST', title: 'Cybersecurity', description: 'Labs, security experiments and secure systems.', parallaxFactor: 0.95 },
  {
    id: 'education-community',
    index: '04 / EDUCATION',
    title: "Sweta's Little Elly Ecole Internationale",
    description: 'Board Member · 7+ Years',
    parallaxFactor: 1.05,
    href: 'https://swetaslittleelly.in',
  },
  { id: 'build-in-public', index: '05 / OPEN NOTEBOOK', title: 'Build in Public', description: 'Ideas, experiments and lessons.', parallaxFactor: 1.15 },
  { id: 'product-thinking', index: '06 / WHY BEFORE WHAT', title: 'Product Thinking', description: 'Understanding users before building features.', parallaxFactor: 0.85 },
];
