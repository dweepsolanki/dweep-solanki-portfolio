'use client';

interface ChapterMarkerProps {
  label: string; // e.g. "02 / HUMAN"
  className?: string;
}

/**
 * Small, always-visible chapter label. Deliberately marked up as a span
 * next to the real heading, not as the heading itself (spec §10 — screen
 * readers should see clean semantic headings, not "02 / HUMAN Human").
 */
export function ChapterMarker({ label, className = '' }: ChapterMarkerProps) {
  return (
    <span className={`chapter-label text-lime/80 ${className}`} aria-hidden="true">
      {label}
    </span>
  );
}
