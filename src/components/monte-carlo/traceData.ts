export const WORKER_COUNTS = [1, 2, 4, 8] as const;
export type WorkerCount = (typeof WORKER_COUNTS)[number];

export const BLOCK_IDS = [0, 1, 2, 3, 4, 5, 6, 7] as const;

export const COMPLETION_ORDERS: Record<WorkerCount, readonly number[]> = {
  1: [0, 1, 2, 3, 4, 5, 6, 7],
  2: [1, 0, 3, 2, 5, 4, 7, 6],
  4: [2, 0, 3, 1, 6, 4, 7, 5],
  8: [6, 1, 4, 0, 7, 2, 5, 3],
};

export const TRACE_STEPS = [
  { id: "randomness", number: "01", label: "RANDOMNESS" },
  { id: "parallelism", number: "02", label: "PARALLELISM" },
  { id: "reduction", number: "03", label: "REDUCTION" },
  { id: "recovery", number: "04", label: "RECOVERY" },
] as const;

export type TraceStepId = (typeof TRACE_STEPS)[number]["id"];

export const RANDOMNESS_DEFAULTS = {
  seed: 4263,
  block: 3,
  pathOffset: 17,
  worker: 0,
  compareWorker: 3,
} as const;

export const CRASH_COMMIT_INDEX = 4;

export const FIRST_LEVEL_MERGES = [
  { id: "M01", left: 0, right: 1 },
  { id: "M23", left: 2, right: 3 },
  { id: "M45", left: 4, right: 5 },
  { id: "M67", left: 6, right: 7 },
] as const;

export const SECOND_LEVEL_MERGES = [
  { id: "M03", left: "M01", right: "M23" },
  { id: "M47", left: "M45", right: "M67" },
] as const;

export const TRACE_COPY = {
  title: "Fault-Tolerant Parallel Monte Carlo",
  routeLabel: "Runtime visualisation",
} as const;
