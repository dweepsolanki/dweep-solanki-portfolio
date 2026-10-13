import type { Metadata } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { SITE_URL } from '@/lib/siteConfig';

// Self-hosted at build time by next/font (no runtime request to Google).
// Exposed as CSS variables that globals.css maps onto --font-display /
// --font-body / --font-mono, which Tailwind's font families read.
const inter = Inter({ subsets: ['latin'], display: 'swap', variable: '--font-inter' });
const jetbrainsMono = JetBrains_Mono({ subsets: ['latin'], display: 'swap', variable: '--font-jetbrains-mono' });

const TITLE = 'Dweep Solanki — Software · Security · AI · Product';
const DESCRIPTION =
  'Dweep Solanki builds technology at the intersection of software, security, AI and real-world problems.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    url: '/',
    // og:image comes from app/opengraph-image.tsx (file convention).
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`bg-graphite ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
