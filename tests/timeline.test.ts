import { describe, expect, it } from "vitest";
import {
  clamp01,
  introNodeMotion,
  progressBetween,
  revealMotion,
} from "../src/lib/timeline";

describe("timeline math", () => {
  it("clamps progress to the inclusive 0..1 interval", () => {
    expect(clamp01(-0.4)).toBe(0);
    expect(clamp01(0.45)).toBe(0.45);
    expect(clamp01(1.9)).toBe(1);
  });

  it("keeps a reveal hidden before its threshold and fully visible after its window", () => {
    expect(progressBetween(0.2, 0.3, 0.4)).toBe(0);
    expect(progressBetween(0.5, 0.3, 0.4)).toBe(1);
  });

  it("settles translation and scale exactly at the end of a reveal", () => {
    expect(revealMotion(0.2, 0.25, 0.05)).toEqual({
      opacity: 0,
      translateY: 14,
      scale: 0.985,
    });

    expect(revealMotion(0.3, 0.25, 0.05)).toEqual({
      opacity: 1,
      translateY: 0,
      scale: 1,
    });
  });

  it("keeps the active node dominant and settles it after the next reveal begins", () => {
    const active = introNodeMotion(0.4, 0.3, 0.5, 0.04);
    expect(active.opacity).toBe(1);
    expect(active.detailOpacity).toBe(1);

    const settled = introNodeMotion(0.56, 0.3, 0.5, 0.04);
    expect(settled.opacity).toBeCloseTo(0.32, 5);
    expect(settled.detailOpacity).toBeCloseTo(0.18, 5);
  });
});
