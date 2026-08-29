import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dweep Solanki — Software, Security, AI & Product',
  description:
    'Dweep Solanki builds technology at the intersection of software, security, AI and real-world problems.',
  openGraph: {
    title: 'Dweep Solanki — Software, Security, AI & Product',
    description:
      'Dweep Solanki builds technology at the intersection of software, security, AI and real-world problems.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dweep Solanki — Software, Security, AI & Product',
    description:
      'Dweep Solanki builds technology at the intersection of software, security, AI and real-world problems.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="bg-graphite">
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
