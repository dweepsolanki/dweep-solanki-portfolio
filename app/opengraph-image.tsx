import { ImageResponse } from 'next/og';
import { SITE_URL } from '@/lib/siteConfig';

// Social preview card (LinkedIn, X, Slack, iMessage…). Generated at build
// time in the 1200×630 shape those cards expect — the previous preview was
// the 1320×1366 portrait, which every platform center-cropped. Next.js
// emits the og:image (and, by fallback, twitter:image) tags for this file.
export const alt = 'Dweep Solanki — Builder across software, security & AI';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

const LIME = '#C6FF3D';
const INK = '#F5F5F2';
const INK_FAINT = '#6B6B70';

export default function OpengraphImage() {
  const host = new URL(SITE_URL).host;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          backgroundColor: '#0A0A0C',
          backgroundImage: 'radial-gradient(circle at 85% 15%, rgba(198, 255, 61, 0.14), transparent 55%)',
          color: INK,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, fontSize: 24, color: LIME, letterSpacing: 3 }}>
          <div style={{ width: 12, height: 12, borderRadius: 999, backgroundColor: LIME }} />
          ~/dweep
        </div>

        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ fontSize: 120, fontWeight: 700, letterSpacing: -4, lineHeight: 1 }}>DWEEP SOLANKI</div>
          <div style={{ marginTop: 28, fontSize: 44, color: INK }}>Builder across software, security &amp; AI</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 24, letterSpacing: 3 }}>
          <div style={{ color: LIME }}>SOFTWARE · SECURITY · AI · PRODUCT</div>
          <div style={{ color: INK_FAINT, fontSize: 22, letterSpacing: 0 }}>{host}</div>
        </div>
      </div>
    ),
    size
  );
}
