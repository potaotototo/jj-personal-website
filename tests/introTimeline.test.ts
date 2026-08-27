import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { INTRO_TIMELINE, ORBIT_RINGS, STAR_FIELD } from "../src/config/introTimeline";
import { resolveOrbitPoint } from "../src/lib/cinematicField";

const EXPECTED_IDS = [
  "education",
  "experience",
  "practice",
  "project-0",
  "project-1",
  "project-2",
] as const;

describe("intro timeline", () => {
  it("contains exactly the six meaningful intro objects in reveal order", () => {
    expect(INTRO_TIMELINE.map((item) => item.id)).toEqual(EXPECTED_IDS);
  });

  it("uses non-overlapping reveal windows in display order", () => {
    for (let index = 1; index < INTRO_TIMELINE.length; index += 1) {
      const previous = INTRO_TIMELINE[index - 1];
      const current = INTRO_TIMELINE[index];
      expect(previous.at + previous.duration).toBeLessThanOrEqual(current.at);
    }
  });

  it("keeps every resolved orbital point inside the viewport", () => {
    for (const item of INTRO_TIMELINE) {
      const point = resolveOrbitPoint(item.orbit);
      expect(point.x).toBeGreaterThanOrEqual(0);
      expect(point.x).toBeLessThanOrEqual(1);
      expect(point.y).toBeGreaterThanOrEqual(0);
      expect(point.y).toBeLessThanOrEqual(1);
    }
  });


  it("keeps the first two experience/education nodes clear of the central name", () => {
    for (const item of INTRO_TIMELINE.slice(0, 2)) {
      const point = resolveOrbitPoint(item.orbit);
      expect(Math.abs(point.y - 0.5)).toBeGreaterThanOrEqual(0.25);
    }
  });

  it("uses full ellipse rings rather than clipped arc fragments", () => {
    const css = readFileSync(
      new URL("../src/components/CinematicIntro.module.css", import.meta.url),
      "utf8",
    );
    expect(css).not.toContain("clip-path");
  });

  it("uses three full responsive orbit ellipses", () => {
    expect(ORBIT_RINGS).toHaveLength(3);
    for (const ring of ORBIT_RINGS) {
      expect(ring.width).toBeGreaterThan(0);
      expect(ring.height).toBeGreaterThan(0);
      expect(ring.revealEnd).toBeGreaterThan(ring.revealStart);
    }
  });

  it("uses a sparse star field", () => {
    expect(STAR_FIELD.count).toBe(28);
  });
});
