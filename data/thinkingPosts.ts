export interface ThinkingPost {
  id: string;
  title: string;
  excerpt: string;
  date: string; // ISO date (YYYY-MM-DD), or empty if unknown
  topic: string;
  url: string;
  image?: string;
}

// Real LinkedIn posts. The first four were selected as the strongest of
// five original candidates (relevance, credibility, topic diversity, and
// usefulness to a recruiter/founder/collaborator) — CySecK and FedEx x IIT
// Madras are both already represented in Proof of Work (data/recognitions.ts),
// so the original selection kept CySecK (reinforces the cybersecurity
// pillar) and left FedEx out to avoid redundancy. FedEx has since been
// explicitly added back in as a 5th post per a later content update, and a
// 6th (Google) was requested alongside it.
//
// IMPORTANT: LinkedIn's robots.txt blocks automated fetching of individual
// post pages, and these URLs are not indexed with their body text by search
// engines either — so the exact wording and publish date of each post
// could not be verified programmatically. Every excerpt/title below is a
// deliberately conservative summary built only from facts explicitly
// supplied for that post, not quoted or paraphrased from content that was
// actually read.
//
// `date` is not guessed: LinkedIn activity IDs embed their creation time
// (the ID's top 41 bits are a millisecond Unix timestamp), so each date is
// decoded from the activity ID in that post's own URL:
//   new Date(Number(BigInt(activityId) >> 22n))
export const thinkingPosts: ThinkingPost[] = [
  {
    id: 'pfrda-iit-kanpur',
    title: 'Innovate4NPS at IIT Kanpur — 2nd Place',
    excerpt:
      'On the Innovate4NPS journey with PFRDA and IIT Kanpur — a project that placed 2nd nationally, built around how first-time NPS users onboard and plan for retirement.',
    date: '2026-03-19',
    topic: 'PFRDA · National Pension System',
    url: 'https://www.linkedin.com/posts/dweep-solanki_pfrda-nps-npszarurihai-activity-7440422967563505664-pWMg',
    image: '/images/thinking/pfrda-iit-kanpur.png',
  },
  {
    id: 'rbi-harbinger',
    title: 'The RBI HaRBInger Journey',
    excerpt:
      'On building HaRBInger for the RBI innovation track — an AI-powered grievance resolution concept — and what the journey from idea to pitch looked like.',
    date: '2026-04-19',
    topic: 'RBI HaRBInger · AI Grievance Resolution',
    url: 'https://www.linkedin.com/posts/dweep-solanki_harbinger-publicspeaking-startupjourney-activity-7451658434761895936-1WPl',
    image: '/images/thinking/rbi-harbinger.png',
  },
  {
    id: 'uidai-sitaa',
    title: "Working on UIDAI's SITAA Initiative",
    excerpt:
      "Notes from working on SITAA — UIDAI's contactless fingerprint initiative for Aadhaar — and what it's like building at the intersection of identity infrastructure and security.",
    date: '2026-05-08',
    topic: 'UIDAI · Aadhaar · Contactless Fingerprint',
    url: 'https://www.linkedin.com/posts/dweep-solanki_sitaa-uidai-aadhaar-activity-7458547099652001792-aFOm',
    image: '/images/thinking/uidai-sitaa.png',
  },
  {
    id: 'cyseck',
    title: 'Selected for CySecK Cohort-5',
    excerpt:
      'On being selected for CySecK Cohort-5 at IISc Bangalore — a cybersecurity innovation and startup acceleration program.',
    date: '2026-03-18',
    topic: 'CySecK · IISc Bangalore · Cybersecurity',
    url: 'https://www.linkedin.com/posts/dweep-solanki_cybersecurity-iisc-cyseck-activity-7440071532762157056-uzVm',
    image: '/images/thinking/cyseck.png',
  },
  {
    id: 'fedex-iit-madras',
    title: 'FedEx × IIT Madras Startup Cohort',
    excerpt:
      'On being part of the FedEx SMART startup cohort at IIT Madras, representing YellowSense in the program.',
    date: '2026-05-28',
    topic: 'FedEx · IIT Madras · Startup Ecosystem',
    url: 'https://www.linkedin.com/posts/dweep-solanki_fedex-iitmadras-startup-activity-7465805907784994818-TRN6',
    image: '/images/thinking/fedex-iit-madras.png',
  },
  {
    id: 'google',
    title: 'Google · Google Cloud · Google DeepMind',
    excerpt:
      'A post on AI, Google Cloud and Google DeepMind — read the original on LinkedIn for the full note.',
    date: '2026-08-12',
    topic: 'Google · Google Cloud · Google DeepMind',
    url: 'https://www.linkedin.com/posts/dweep-solanki_ai-googlecloud-googledeepmind-activity-7493154357706665984-q5Jj',
    image: '/images/thinking/google.png',
  },
];
