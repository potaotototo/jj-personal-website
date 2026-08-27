import { describe, expect, it } from "vitest";
import { generateStarField, resolveOrbitPoint } from "../src/lib/cinematicField";

describe("cinematic field", () => {
  it("generates a deterministic star field for a fixed seed", () => {
    expect(generateStarField(12, 4261)).toEqual(generateStarField(12, 4261));
    expect(generateStarField(12, 4261)).not.toEqual(generateStarField(12, 4262));
  });

  it("keeps stars within normalized viewport coordinates", () => {
    for (const star of generateStarField(28, 4261)) {
      expect(star.x).toBeGreaterThanOrEqual(0);
      expect(star.x).toBeLessThanOrEqual(1);
      expect(star.y).toBeGreaterThanOrEqual(0);
      expect(star.y).toBeLessThanOrEqual(1);
    }
  });

  it("leaves a quiet elliptical region around the central name", () => {
    for (const star of generateStarField(28, 4261)) {
      const dx = (star.x - 0.5) / 0.31;
      const dy = (star.y - 0.5) / 0.22;
      expect(dx * dx + dy * dy).toBeGreaterThanOrEqual(1);
    }
  });

  it("resolves elliptical polar coordinates around the viewport center", () => {
    expect(resolveOrbitPoint({ radiusX: 0.4, radiusY: 0.3, angleDeg: 0 })).toEqual({
      x: 0.9,
      y: 0.5,
    });
  });
});
