export type ProjectTreatment = 'diagram' | 'redacted' | 'quiet';

export interface DiagramStep {
  label: string;
  detail: string;
  /** A side path off this step (e.g. an early exit or a fallback). */
  branch?: string;
  /** Tools/models used at this step, as named in the repository. */
  tech?: string[];
}

/**
 * "How it works" diagram shown in the expanded case-study panel. Every step
 * is mapped from the project's public repository — not from marketing copy —
 * so update it when the code changes.
 */
export interface ProjectDiagram {
  title: string;
  steps: DiagramStep[];
}

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
  /** Required when treatment is 'diagram'. */
  diagram?: ProjectDiagram;
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
    treatment: 'diagram',
    // Mapped from pension-pathfinder-Backend: app/api/projection.py and app/engine/.
    diagram: {
      title: 'How the retirement projection works',
      steps: [
        {
          label: 'Profile',
          detail: 'Age, retirement age, salary, monthly contribution and a career mode — conservative, balanced or aggressive.',
          tech: ['FastAPI', 'Pydantic'],
        },
        {
          label: 'Simulate',
          detail: 'Runs year by year: salary grows, contributions follow it, and returns compound with a random market shock sized to the career mode.',
        },
        {
          label: 'Adjust for inflation',
          detail: "Deflates the final corpus at 6% a year so the result is in today's money.",
        },
        {
          label: 'Score confidence',
          detail: 'A 15–95 score from saving rate, years left to retirement, career growth and whether the corpus can sustain retirement.',
        },
        {
          label: 'Picture the future self',
          detail: 'A 4% withdrawal rule turns the corpus into monthly income, mapped to a lifestyle tier — struggle, basic, comfortable or luxury — with a message on what to change.',
        },
      ],
    },
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
    treatment: 'diagram',
    // Mapped from TrackC-Grievance-AI-Backend: app/api/complaint_routes.py,
    // conversation_routes.py and app/services/.
    diagram: {
      title: 'How a complaint moves through the system',
      steps: [
        {
          label: 'Speak or type',
          detail: 'Citizens describe the problem by voice or chat in their own language; speech is transcribed and the language detected.',
          tech: ['Whisper large-v3'],
        },
        {
          label: 'Conversational intake',
          detail: "An LLM asks follow-up questions until the bank's complaint form is complete — transaction type, amount, date, reference ID.",
          tech: ['Llama 3.3 70B', 'Groq'],
        },
        {
          label: 'Triage',
          detail: 'Translated to English, categorised, routed to a department and given a priority score.',
          branch: 'Known issue → instant auto-resolution, no ticket raised.',
        },
        {
          label: 'Deduplicate',
          detail: 'Text similarity against existing complaints clusters repeats of the same problem.',
          tech: ['TF-IDF', 'scikit-learn'],
        },
        {
          label: 'Suggest a resolution',
          detail: 'Retrieves the five most similar past cases from a knowledge base and drafts a resolution from them.',
          tech: ['MiniLM embeddings', 'FAISS', 'Gemini'],
        },
        {
          label: 'Close the loop',
          detail: "Updates are translated back and read aloud in the citizen's language; cases escalate if they pass a 24, 48 or 72-hour limit set by priority.",
          tech: ['Google Cloud TTS'],
        },
      ],
    },
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
    treatment: 'diagram',
    // Mapped from gtm-signal: server.py.
    diagram: {
      title: 'From a company URL to grounded outreach',
      steps: [
        {
          label: 'Brief',
          detail: 'A company URL, the persona to reach, the product being sold and the ideal customer profile.',
        },
        {
          label: 'Fetch safely',
          detail: 'Resolves the URL first and rejects private or loopback addresses before fetching the public page.',
          tech: ['Python standard library'],
        },
        {
          label: 'Extract signals',
          detail: 'Strips scripts, navigation and boilerplate, then matches the remaining prose to three signal types — security, enterprise and product.',
          branch: 'Optional: three targeted web searches add public sources.',
          tech: ['Tavily'],
        },
        {
          label: 'Rank evidence',
          detail: 'Keeps the strongest sentence per signal, favouring specifics and official sources. Every signal keeps its source URL.',
        },
        {
          label: 'Reason & draft',
          detail: 'An LLM writes a pain hypothesis, an angle, an email and a LinkedIn note from the cited evidence only — inference is labelled and given a 0–100 confidence.',
          branch: 'No API key → an evidence-only template, still cited.',
          tech: ['OpenRouter', 'JSON mode'],
        },
      ],
    },
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
    // The repository encrypts with AES-256-CBC and only simulates the Kyber
    // step (server/file-service.ts: kyberMock), so the card says so rather
    // than claiming GCM + real post-quantum key exchange.
    footerNote: 'AES-256-CBC · KYBER768 (SIMULATED)',
    treatment: 'diagram',
    // Mapped from secure-file-sharing: server/routes.ts, server/file-service.ts,
    // server/auth.ts and shared/schema.ts.
    diagram: {
      title: 'How a file is protected and shared',
      steps: [
        {
          label: 'Sign in',
          detail: 'Passwords are hashed with scrypt and checked in constant time; sessions carry a user or admin role.',
          tech: ['Passport', 'scrypt'],
        },
        {
          label: 'Encrypt on upload',
          detail: 'The server encrypts each file with a fresh random 256-bit key and IV, keeps only the encrypted copy and deletes the original upload.',
          tech: ['AES-256-CBC', 'Node crypto'],
        },
        {
          label: 'Wrap the key · simulated',
          detail: 'Designed to wrap each file key with a Kyber768 public key for hybrid post-quantum protection. This prototype simulates that step: Kyber-sized keys are generated, but the file key is stored unwrapped.',
          branch: 'Not real post-quantum protection yet — a production version would use ML-KEM key encapsulation.',
        },
        {
          label: 'Share',
          detail: 'Owners share with a user or email at view or edit permission, with optional re-sharing and an expiry date; recipients are notified live.',
          tech: ['WebSockets'],
        },
        {
          label: 'Download',
          detail: 'Every download checks ownership, share permission and expiry before the file is decrypted.',
        },
        {
          label: 'Audit & rotate',
          detail: 'Uploads, shares, downloads, deletions and key changes are written to an audit log; admins can rotate keys.',
        },
      ],
    },
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
