/**
 * Single, isolated source of truth for the site's production URL and
 * shared social-preview image.
 *
 * `SITE_URL` defaults to the real deployed production URL
 * (https://dweep-solanki-portfolio.vercel.app). It's still overridable via
 * `NEXT_PUBLIC_SITE_URL` with no code changes needed — e.g. if a custom
 * domain is added later, just set that env var in the Vercel project and
 * this fallback stops being used.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://dweep-solanki-portfolio.vercel.app';

// Existing personal photo, already used in the site's PersonalReveal
// section — reused as-is (same file, unaltered) for the social preview
// image rather than generating a new asset.
export const SOCIAL_IMAGE_PATH = '/images/personal/dweep-solanki.png';
