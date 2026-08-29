export type ProjectTreatment =
  | 'flow'
  | 'sequence'
  | 'redacted'
  | 'sparkline'
  | 'spec-sheet'
  | 'quiet';

export interface Project {
  id: string;
  index: string; // "01" etc, matches site copy
  title: string;
  category: string;
  description: string;
  tags: string[];
  result?: string;
  footerNote: string;
  treatment: ProjectTreatment;
  /** Ordered stage labels for projects using the 'sequence' or 'flow' treatment */
  stages?: string[];
  /** Path under /public to the project's visual asset */
  image: string;
  /** Repository URL, when one exists. Omitted (not fabricated) for projects
   * still under development — e.g. Project Mactus. */
  githubUrl?: string;
}

// Content sourced verbatim from the live Framer site — nothing invented.
export const projects: Project[] = [
  {
    id: 'pension-pathfinder',
    index: '01',
    title: 'Pension Pathfinder',
    category: 'PFRDA National Innovation Initiative',
    description:
      'A digital pension onboarding platform designed to simplify retirement planning and improve financial literacy for first-time National Pension System users.',
    tags: ['GUIDED ONBOARDING', 'RETIREMENT PROJECTIONS', 'PERSONALIZED DASHBOARDS', 'FINANCIAL LITERACY'],
    result: '2ND PLACE · 5,000+ TEAMS',
    footerNote: 'EDITORIAL PRODUCT STUDY',
    treatment: 'sequence',
    stages: ['GUIDED ONBOARDING', 'RETIREMENT PROJECTIONS', 'PERSONALIZED DASHBOARDS', 'FINANCIAL LITERACY'],
    image: '/images/projects/pension-pathfinder.png',
    githubUrl: 'https://github.com/dweepsolanki/pension-pathfinder-Backend',
  },
  {
    id: 'rbi-harbinger',
    index: '02',
    title: 'RBI HaRBInger',
    category: 'AI-Powered Grievance Resolution',
    description:
      'An AI-powered grievance resolution platform addressing scam reporting, payment disputes and financial fraud awareness for underserved communities.',
    tags: ['AI', 'FINTECH', 'VOICE', 'FRAUD', 'GRIEVANCES', 'REGTECH'],
    footerNote: 'EDITORIAL PRODUCT STUDY',
    treatment: 'flow',
    stages: ['PROBLEM', 'AI', 'ROUTING', 'RESOLUTION'],
    image: '/images/projects/rbi-harbinger.png',
    githubUrl: 'https://github.com/dweepsolanki/TrackC-Grievance-AI-Backend',
  },
  {
    id: 'yellowsense',
    index: '03',
    title: 'YellowSense',
    category: 'Enterprise Technology',
    description:
      'Building secure B2B enterprise solutions across fintech, compliance, digital identity and logistics.',
    tags: [
      'PRODUCT DISCOVERY',
      'CUSTOMER FEEDBACK',
      'REGULATORY REQUIREMENTS',
      'SECURE ARCHITECTURE',
      'AUTHORIZATION',
      'MVP DEVELOPMENT',
    ],
    footerNote: 'CONFIDENTIAL / NO CLIENT DATA',
    treatment: 'redacted',
    image: '/images/projects/yellowsense.png',
    githubUrl: 'https://github.com/dweepsolanki/maritime-port-intelligence-platform',
  },
  {
    id: 'gtm-signal',
    index: '04',
    title: 'GTM Signal',
    category: 'AI × Sales Intelligence',
    description:
      'An evidence-first AI SDR copilot designed to turn market signals into actionable, grounded outreach.',
    tags: ['SIGNALS', 'EVIDENCE', 'REASONING', 'OUTREACH'],
    footerNote: 'DATA-DRIVEN EDITORIAL INTERFACE',
    treatment: 'sparkline',
    image: '/images/projects/gtm-signal.png',
    githubUrl: 'https://github.com/dweepsolanki/gtm-signal',
  },
  {
    id: 'secureshare-vault',
    index: '05',
    title: 'SecureShareVault',
    category: 'Post-Quantum Secure File Sharing',
    description:
      'A secure file sharing concept built around hybrid encryption, post-quantum cryptography and secure key exchange.',
    tags: ['HYBRID ENCRYPTION', 'POST-QUANTUM CRYPTOGRAPHY', 'SECURE KEY EXCHANGE', 'FILE SECURITY'],
    footerNote: 'AES-256-GCM × KYBER / PQC',
    treatment: 'spec-sheet',
    image: '/images/projects/secureshare-vault.png',
    githubUrl: 'https://github.com/dweepsolanki/secure-file-sharing',
  },
  {
    id: 'project-mactus',
    index: '06',
    title: 'Project Mactus',
    category: 'A Mac Utility Built From Scratch',
    description:
      'A macOS utility combining cleaning, application removal and system management into a single product.',
    tags: ['CLEAN', 'UNINSTALL', 'MANAGE', 'INDEPENDENT PRODUCT BUILD'],
    footerNote: 'CLEAN · UNINSTALL · MANAGE',
    treatment: 'quiet',
    image: '/images/projects/project-mactus.png',
    // No githubUrl: Mactus is still under development — no repository invented.
  },
];
