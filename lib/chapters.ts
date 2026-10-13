// Single source of truth for the chapter waypoints that drive the
// continuous background interpolation (spec §3.2). Edit colors here only.
//
// `progress` is a fallback (fraction 0–1 of total scroll) used only until
// the page has been measured. At runtime ChapterEnvironment replaces it with
// the measured scroll position of each `sectionId`'s center, because
// section heights differ a lot between desktop and mobile (and the pinned
// Journey timeline adds scroll length on desktop only), so fixed fractions
// drifted up to a full section away from the content they belong to.

export interface ChapterWaypoint {
  id: string;
  label: string; // "01 / INTRODUCTION"
  /** DOM id of the section this tone belongs to. null for the hero, which is always 0. */
  sectionId: string | null;
  progress: number;
  background: string; // hex
  glow: string; // accent glow color at this waypoint
  grain: number; // 0–1 opacity
}

export const chapterWaypoints: ChapterWaypoint[] = [
  { id: 'intro', label: '01 / INTRODUCTION', sectionId: null, progress: 0.0, background: '#0A0A0C', glow: '#C6FF3D', grain: 0.02 },
  { id: 'human', label: '02 / HUMAN', sectionId: 'about', progress: 0.1, background: '#111327', glow: '#C6FF3D', grain: 0.03 },
  { id: 'build', label: '03 / BUILD', sectionId: 'build', progress: 0.22, background: '#0C0D10', glow: '#C6FF3D', grain: 0.03 },
  { id: 'work', label: '04 / SELECTED WORK', sectionId: 'work', progress: 0.32, background: '#0B0B0E', glow: '#C6FF3D', grain: 0.03 },
  { id: 'proof', label: '05 / PROOF', sectionId: 'proof', progress: 0.5, background: '#141110', glow: '#FFB020', grain: 0.05 },
  { id: 'journey', label: '06 / JOURNEY', sectionId: 'journey', progress: 0.62, background: '#12151C', glow: '#C6FF3D', grain: 0.04 },
  { id: 'beyond', label: '06B / EXPLORATION', sectionId: 'beyond', progress: 0.72, background: '#0E0F12', glow: '#C6FF3D', grain: 0.03 },
  { id: 'thinking', label: '07 / THINKING', sectionId: 'thinking', progress: 0.82, background: '#1B1420', glow: '#C084FC', grain: 0.05 },
  { id: 'right-now', label: '07B / CURRENTLY', sectionId: 'right-now', progress: 0.9, background: '#0E0D10', glow: '#C6FF3D', grain: 0.03 },
  { id: 'contact', label: '08 / CONTACT', sectionId: 'contact', progress: 1.0, background: '#0A0A0C', glow: '#C6FF3D', grain: 0.02 },
];

/**
 * Scroll progress (0–1) at which each waypoint's section is centered in the
 * viewport. The first waypoint is pinned to 0 and the last to 1 so the
 * background always starts and ends on the same tone; the result is kept
 * strictly increasing, as useTransform requires.
 */
export function measureWaypointProgress(): number[] | null {
  const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
  if (maxScroll <= 0) return null;

  const last = chapterWaypoints.length - 1;
  const measured = chapterWaypoints.map((w, i) => {
    if (i === 0) return 0;
    if (i === last) return 1;
    const el = w.sectionId ? document.getElementById(w.sectionId) : null;
    if (!el) return w.progress;
    const rect = el.getBoundingClientRect();
    const center = rect.top + window.scrollY + rect.height / 2 - window.innerHeight / 2;
    return Math.min(Math.max(center / maxScroll, 0), 1);
  });

  const EPSILON = 0.001;
  for (let i = 1; i < last; i++) {
    measured[i] = Math.min(Math.max(measured[i]!, measured[i - 1]! + EPSILON), 1 - EPSILON * (last - i));
  }
  return measured;
}
