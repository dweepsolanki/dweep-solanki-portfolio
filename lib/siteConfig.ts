/**
 * Single, isolated source of truth for the site's production URL and
 * shared social-preview image.
 *
 * IMPORTANT — production URL placeholder:
 * The final deployment URL (Vercel default domain or custom domain) was
 * not present anywhere in the repository at the time this was added, and
 * none was invented. `SITE_URL` falls back to an intentionally-fake
 * `.example` domain (a TLD reserved by RFC 2606 for exactly this purpose —
 * it can never resolve to a real site) so it's impossible to mistake for a
 * real, working URL if this is deployed before being configured.
 *
 * Before launch: set the `NEXT_PUBLIC_SITE_URL` environment variable in
 * the Vercel project (or wherever this is deployed) to the real
 * production URL — no code changes needed once that's set.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '') || 'https://dweep-solanki-portfolio.example';

// Existing personal photo, already used in the site's PersonalReveal
// section — reused as-is (same file, unaltered) for the social preview
// image rather than generating a new asset.
export const SOCIAL_IMAGE_PATH = '/images/personal/dweep-solanki.png';
