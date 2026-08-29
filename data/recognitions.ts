export interface Recognition {
  id: string;
  index: string;
  emoji?: string;
  title: string;
  org: string;
  subOrg?: string;
  description: string;
  primary?: boolean;
  countUpValue?: number;
  countUpSuffix?: string;
}

// Verbatim from the live site. Ranking preserved exactly — Second Place stays dominant.
export const recognitions: Recognition[] = [
  {
    id: 'second-place',
    index: '01',
    emoji: '🥈',
    title: 'SECOND PLACE',
    org: 'RBI × PFRDA National Innovation Hackathon',
    subOrg: 'PFRDA × SIIC IIT Kanpur',
    description: 'Final result across 5,000+ teams.',
    primary: true,
    countUpValue: 5000,
    countUpSuffix: '+',
  },
  {
    id: 'top-20',
    index: '02',
    title: 'TOP 20',
    org: 'Build AI Innovation Challenge',
    subOrg: 'IIT Madras',
    description: 'AI-driven solution with real-world impact.',
  },
  {
    id: 'cyseck',
    index: '03',
    title: 'SELECTED',
    org: 'CySecK Cohort-5',
    subOrg: 'IISc Bangalore',
    description: 'Cybersecurity innovation and startup acceleration.',
  },
  {
    id: 'fedex-cohort',
    index: '04',
    title: 'STARTUP COHORT',
    org: 'FedEx × IIT Madras',
    subOrg: 'YellowSense Technologies',
    description:
      'Represented YellowSense and presented enterprise product solutions to mentors, ecosystem partners and industry experts.',
  },
];
