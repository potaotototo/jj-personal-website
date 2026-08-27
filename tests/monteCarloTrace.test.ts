import { describe, expect, it } from "vitest";
import {
  BLOCK_IDS,
  COMPLETION_ORDERS,
  CRASH_COMMIT_INDEX,
  RANDOMNESS_DEFAULTS,
  TRACE_STEPS,
  WORKER_COUNTS,
} from "../src/components/monte-carlo/traceData";

describe("Monte Carlo visualisation data", () => {
  it("keeps the same canonical block set across worker-count schedules", () => {
    const canonical = [...BLOCK_IDS];

    for (const workers of WORKER_COUNTS) {
      const schedule = [...COMPLETION_ORDERS[workers]];
      expect(schedule).toHaveLength(canonical.length);
      expect(schedule.toSorted((a, b) => a - b)).toEqual(canonical);
    }
  });

  it("walks through randomness, parallelism, reduction and recovery", () => {
    expect(TRACE_STEPS.map((step) => step.id)).toEqual([
      "randomness",
      "parallelism",
      "reduction",
      "recovery",
    ]);
  });

  it("starts the randomness demo from a fixed block request", () => {
    expect(RANDOMNESS_DEFAULTS.seed).toBe(4263);
    expect(RANDOMNESS_DEFAULTS.block).toBe(3);
    expect(RANDOMNESS_DEFAULTS.pathOffset).toBe(17);
    expect(RANDOMNESS_DEFAULTS.compareWorker).toBe(3);
  });

  it("uses a representative crash state with committed and uncommitted blocks", () => {
    expect(CRASH_COMMIT_INDEX).toBeGreaterThanOrEqual(0);
    expect(CRASH_COMMIT_INDEX).toBeLessThan(BLOCK_IDS.length - 1);
  });
});
