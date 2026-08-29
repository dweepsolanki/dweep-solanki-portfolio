import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/siteConfig';

// The site currently has one public page (the portfolio itself) — no
// additional routes are invented here.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}
