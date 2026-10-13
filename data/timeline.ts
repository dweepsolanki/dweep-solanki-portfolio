export interface TimelineEntry {
  id: string;
  year: string;
  org: string;
  role: string;
  category: string;
}

export const timeline: TimelineEntry[] = [
  { id: 'accenture', year: '2024', org: 'Accenture', role: 'Developer Intern', category: '01 / SYSTEMS' },
  { id: 'tata', year: '2025', org: 'Tata Group', role: 'SOC Analyst Intern', category: '02 / SECURITY' },
  {
    id: 'yellowsense',
    year: '2025 → 2026',
    org: 'YellowSense Technologies',
    role: 'Founding Team / Product Manager',
    category: '03 / ENTERPRISE',
  },
  {
    id: 'elevatoz',
    year: '2026 → PRESENT',
    org: 'Elevatoz Loyalty',
    role: 'Customer Success Manager',
    category: '04 / CUSTOMER SUCCESS',
  },
];
