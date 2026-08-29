// Single source of truth for the chapter waypoints that drive the
// continuous background interpolation (spec §3.2). Progress values are
// fractions (0–1) of total scroll height. Keep this array in one place so
// ChapterEnvironment and ChapterMarker / nav scroll-spy never drift apart.

export interface ChapterWaypoint {
  id: string;
  label: string; // "01 / INTRODUCTION"
  progress: number;
  background: string; // hex
  glow: string; // accent glow color at this waypoint
  grain: number; // 0–1 opacity
}

export const chapterWaypoints: ChapterWaypoint[] = [
  { id: 'intro', label: '01 / INTRODUCTION', progress: 0.0, background: '#0A0A0C', glow: '#C6FF3D', grain: 0.02 },
  { id: 'human', label: '02 / HUMAN', progress: 0.1, background: '#111327', glow: '#C6FF3D', grain: 0.03 },
  { id: 'build', label: '03 / BUILD', progress: 0.22, background: '#0C0D10', glow: '#C6FF3D', grain: 0.03 },
  { id: 'work', label: '04 / SELECTED WORK', progress: 0.32, background: '#0B0B0E', glow: '#C6FF3D', grain: 0.03 },
  { id: 'proof', label: '05 / PROOF', progress: 0.5, background: '#141110', glow: '#FFB020', grain: 0.05 },
  { id: 'journey', label: '06 / JOURNEY', progress: 0.62, background: '#12151C', glow: '#C6FF3D', grain: 0.04 },
  { id: 'beyond', label: '06B / EXPLORATION', progress: 0.72, background: '#0E0F12', glow: '#C6FF3D', grain: 0.03 },
  { id: 'thinking', label: '07 / THINKING', progress: 0.82, background: '#1B1420', glow: '#C084FC', grain: 0.05 },
  { id: 'right-now', label: '07B / CURRENTLY', progress: 0.9, background: '#0E0D10', glow: '#C6FF3D', grain: 0.03 },
  { id: 'contact', label: '08 / CONTACT', progress: 1.0, background: '#0A0A0C', glow: '#C6FF3D', grain: 0.02 },
];

export const chapterIds = chapterWaypoints.map((w) => w.id);
