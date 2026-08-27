import type { IntroNodeId } from "@/content/portfolio";
import type { OrbitSpec } from "@/lib/cinematicField";

export const INTRO_SCROLL_VH = 690;
export const INTRO_CINEMATIC_QUERY = "(min-width: 721px)";
export const PROJECT_RAIL_QUERY = "(min-width: 961px)";

export const STAR_FIELD = {
  count: 46,
  seed: 4261,
} as const;

// Full responsive ellipses, matching the original V4 spatial language.
// Geometry is expressed as percentages of the viewport rather than pixels.
export const ORBIT_RINGS = [
  {
    id: "inner",
    left: 24,
    top: 27,
    width: 52,
    height: 45,
    rotationDeg: -8,
    revealStart: 0.07,
    revealEnd: 0.18,
    opacity: 0.86,
    color: "rgba(246, 247, 248, 0.13)",
  },
  {
    id: "middle",
    left: 10,
    top: 14,
    width: 80,
    height: 72,
    rotationDeg: 11,
    revealStart: 0.11,
    revealEnd: 0.23,
    opacity: 0.68,
    color: "rgba(111, 150, 232, 0.12)",
  },
  {
    id: "outer",
    left: -1,
    top: 4,
    width: 101,
    height: 91,
    rotationDeg: -11,
    revealStart: 0.16,
    revealEnd: 0.30,
    opacity: 0.48,
    color: "rgba(246, 247, 248, 0.085)",
  },
] as const;

export const CAMERA = {
  // Structural ellipses move only slightly. Keeping text off this layer avoids
  // rasterisation glitches while preserving the sense of a widening field.
  orbitStartScale: 1.08,
  orbitEndScale: 1,
  orbitZoomEnd: 0.42,

  // The name carries the cinematic pull-back.
  nameStartScale: 1.52,
  nameEndScale: 0.56,
  nameZoomEnd: 0.3,

  // After the final project has had its turn, the whole field settles into a
  // quiet index before the next section enters.
  finalSettleAt: 0.965,
} as const;

export const NODE_MOTION = {
  settledOpacity: 0.32,
  settledDetailOpacity: 0.18,
  settleDuration: 0.035,
} as const;

export type IntroAnchor = "start" | "center" | "end";

type OrbitPlacement = OrbitSpec & {
  width: string;
  anchor?: IntroAnchor;
};

export type IntroNodeLayout = {
  id: IntroNodeId;
  at: number;
  duration: number;
  orbit: OrbitPlacement;
  variant?: "education" | "experience" | "project";
  fromY?: number;
  fromScale?: number;
};

// The composition uses irregular elliptical coordinates around the name rather
// than rows or fixed pixel positions. Each node gets a clear turn as the active
// object, then recedes once the next object is introduced.
export const INTRO_TIMELINE: readonly IntroNodeLayout[] = [
  {
    id: "education",
    at: 0.18,
    duration: 0.04,
    orbit: {
      radiusX: 0.42,
      radiusY: 0.43,
      angleDeg: 225,
      width: "clamp(240px, 21vw, 350px)",
    },
    variant: "education",
    fromY: 12,
  },
  {
    id: "experience",
    at: 0.34,
    duration: 0.04,
    orbit: {
      radiusX: 0.42,
      radiusY: 0.39,
      angleDeg: 315,
      width: "clamp(245px, 21vw, 355px)",
      anchor: "end",
    },
    variant: "experience",
    fromY: 12,
  },
  {
    id: "practice",
    at: 0.49,
    duration: 0.04,
    orbit: {
      radiusX: 0.36,
      radiusY: 0.28,
      angleDeg: 160,
      width: "clamp(235px, 20vw, 340px)",
    },
    variant: "experience",
    fromY: 12,
  },
  {
    id: "project-0",
    at: 0.64,
    duration: 0.04,
    orbit: {
      radiusX: 0.39,
      radiusY: 0.35,
      angleDeg: 125,
      width: "clamp(245px, 21vw, 355px)",
    },
    variant: "project",
    fromY: 10,
  },
  {
    id: "project-1",
    at: 0.76,
    duration: 0.04,
    orbit: {
      radiusX: 0.36,
      radiusY: 0.34,
      angleDeg: 78,
      width: "clamp(220px, 18vw, 310px)",
      anchor: "center",
    },
    variant: "project",
    fromY: 10,
  },
  {
    id: "project-2",
    at: 0.88,
    duration: 0.04,
    orbit: {
      radiusX: 0.40,
      radiusY: 0.33,
      angleDeg: 35,
      width: "clamp(235px, 20vw, 340px)",
      anchor: "end",
    },
    variant: "project",
    fromY: 10,
  },
] as const;
