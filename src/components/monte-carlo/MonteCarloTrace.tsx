"use client";

import { useEffect, useMemo, useState } from "react";
import {
  BLOCK_IDS,
  COMPLETION_ORDERS,
  CRASH_COMMIT_INDEX,
  FIRST_LEVEL_MERGES,
  RANDOMNESS_DEFAULTS,
  SECOND_LEVEL_MERGES,
  TRACE_STEPS,
  WORKER_COUNTS,
  type TraceStepId,
  type WorkerCount,
} from "./traceData";
import styles from "./MonteCarloTrace.module.css";

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(media.matches);
    update();
    media.addEventListener?.("change", update);
    return () => media.removeEventListener?.("change", update);
  }, []);

  return reduced;
}

type RandomnessInputs = {
  seed: number;
  block: number;
  pathOffset: number;
  worker: number;
};

function clampInteger(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function hash32(value: number) {
  let x = value >>> 0;
  x ^= x >>> 16;
  x = Math.imul(x, 0x7feb352d);
  x ^= x >>> 15;
  x = Math.imul(x, 0x846ca68b);
  x ^= x >>> 16;
  return x >>> 0;
}

function philoxLikeValue(seed: number, block: number, pathOffset: number, index: number) {
  const key = hash32(seed ^ Math.imul(block + 1, 0x9e3779b1) ^ Math.imul(pathOffset + index + 1, 0x85ebca6b));
  return ((key + 0.5) / 4294967296).toFixed(4);
}

function statefulValue(seed: number, worker: number, stateAdvance: number, index: number) {
  let x = (seed ^ Math.imul(worker + 1, 1103515245) ^ Math.imul(stateAdvance + 1, 12345)) >>> 0;

  for (let step = 0; step <= index; step += 1) {
    x = (Math.imul(1664525, x) + 1013904223) >>> 0;
  }

  return ((x + 0.5) / 4294967296).toFixed(4);
}

function makePhiloxStream(inputs: RandomnessInputs) {
  return Array.from({ length: 4 }, (_, index) => philoxLikeValue(inputs.seed, inputs.block, inputs.pathOffset, index));
}

function makeStatefulStream(inputs: RandomnessInputs, priorWork: number) {
  const effectiveAdvance = priorWork * 17 + inputs.block * 5 + inputs.pathOffset;
  return Array.from({ length: 4 }, (_, index) => statefulValue(inputs.seed, inputs.worker, effectiveAdvance, index));
}

function arraysEqual(left: readonly string[], right: readonly string[]) {
  return left.length === right.length && left.every((value, index) => value === right[index]);
}

function ModeTabs({ mode, onChange }: { mode: TraceStepId; onChange: (mode: TraceStepId) => void }) {
  return (
    <nav className={styles.modeTabs} aria-label="Visualisation steps">
      {TRACE_STEPS.map((step) => (
        <button
          type="button"
          key={step.id}
          className={mode === step.id ? styles.modeActive : undefined}
          aria-pressed={mode === step.id}
          onClick={() => onChange(step.id)}
        >
          <span>{step.number}</span>
          {step.label}
        </button>
      ))}
    </nav>
  );
}

function StreamValues({ values }: { values: readonly string[] }) {
  return (
    <div className={styles.streamValues}>
      {values.map((value, index) => (
        <span key={`${value}-${index}`}>{value}</span>
      ))}
    </div>
  );
}

function RandomnessScene() {
  const [draft, setDraft] = useState<RandomnessInputs>({
    seed: RANDOMNESS_DEFAULTS.seed,
    block: RANDOMNESS_DEFAULTS.block,
    pathOffset: RANDOMNESS_DEFAULTS.pathOffset,
    worker: RANDOMNESS_DEFAULTS.worker,
  });
  const [applied, setApplied] = useState<RandomnessInputs>(draft);
  const [priorWork, setPriorWork] = useState(0);

  const philoxStream = useMemo(() => makePhiloxStream(applied), [applied]);
  const statefulStream = useMemo(() => makeStatefulStream(applied, priorWork), [applied, priorWork]);
  const comparePhilox = useMemo(
    () => makePhiloxStream({ ...applied, worker: RANDOMNESS_DEFAULTS.compareWorker }),
    [applied],
  );
  const compareStateful = useMemo(
    () => makeStatefulStream({ ...applied, worker: RANDOMNESS_DEFAULTS.compareWorker }, priorWork),
    [applied, priorWork],
  );

  const philoxStable = arraysEqual(philoxStream, comparePhilox);
  const statefulStable = arraysEqual(statefulStream, compareStateful);

  const changeNumber = (field: keyof RandomnessInputs, value: string) => {
    const parsed = Number(value);
    if (Number.isNaN(parsed)) return;

    setDraft((current) => ({
      ...current,
      [field]: field === "worker"
        ? clampInteger(parsed, 0, 7)
        : field === "block"
          ? clampInteger(parsed, 0, 7)
          : clampInteger(parsed, 0, 9999),
    }));
  };

  return (
    <div className={styles.rngScene}>
      <div className={styles.rngControlsCard}>
        <span className={styles.micro}>Request one block stream</span>
        <div className={styles.inputGrid}>
          <label>
            <span>Seed</span>
            <input type="number" value={draft.seed} onChange={(event) => changeNumber("seed", event.target.value)} />
          </label>
          <label>
            <span>Block</span>
            <input type="number" min={0} max={7} value={draft.block} onChange={(event) => changeNumber("block", event.target.value)} />
          </label>
          <label>
            <span>Path offset</span>
            <input type="number" min={0} max={9999} value={draft.pathOffset} onChange={(event) => changeNumber("pathOffset", event.target.value)} />
          </label>
          <label>
            <span>Worker</span>
            <input type="number" min={0} max={7} value={draft.worker} onChange={(event) => changeNumber("worker", event.target.value)} />
          </label>
        </div>
        <div className={styles.rngButtons}>
          <button type="button" onClick={() => setApplied(draft)}>Generate streams</button>
          <button type="button" onClick={() => setPriorWork((value) => value + 1)}>Run another block first</button>
          <button type="button" onClick={() => setPriorWork(0)}>Reset worker state</button>
        </div>
      </div>

      <div className={styles.rngPanels}>
        <div className={styles.rngPanel}>
          <span className={styles.micro}>Traditional worker-local RNG</span>
          <strong>Stateful RNG</strong>
          <p>The values depend on the worker's current RNG state. If the worker handled other work earlier, the next values for this block can change. Suppose a crash happened, this dependency on past values can make the results irrecoverable.</p>
          <StreamValues values={statefulStream} />
          <div className={styles.rngStatusRow}>
            <span>same block on W{applied.worker}</span>
            <strong>{priorWork === 0 ? "fresh state" : `state advanced ×${priorWork}`}</strong>
          </div>
        </div>

        <div className={`${styles.rngPanel} ${styles.rngPanelActive}`}>
          <span className={styles.micro}>Counter-based RNG</span>
          <strong>Philox</strong>
          <p>The values are derived directly as each random draw is a function of (global_seed, scenario_id, time_step, dimension, draw_index), so the stream for this block does not depend on a worker's past state.</p>
          <StreamValues values={philoxStream} />
          <div className={styles.rngStatusRow}>
            <span>request</span>
            <strong>S{applied.seed} · B{applied.block} · P{applied.pathOffset}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

function ParallelismScene({
  workers,
  visibleCount,
  placedCount,
  onWorkers,
  onReplay,
}: {
  workers: WorkerCount;
  visibleCount: number;
  placedCount: number;
  onWorkers: (workers: WorkerCount) => void;
  onReplay: () => void;
}) {
  const completionOrder = COMPLETION_ORDERS[workers];
  const workerAssignments = useMemo(
    () => Array.from({ length: workers }, (_, workerIndex) =>
      completionOrder.filter((_, orderIndex) => orderIndex % workers === workerIndex),
    ),
    [completionOrder, workers],
  );

  const placed = new Set(completionOrder.slice(0, placedCount));

  return (
    <div className={styles.parallelScene}>
      <div className={styles.parallelControls}>
        <span className={styles.micro}>Worker count</span>
        <div className={styles.workerButtons}>
          {WORKER_COUNTS.map((value) => (
            <button
              type="button"
              key={value}
              aria-pressed={workers === value}
              className={workers === value ? styles.controlActive : undefined}
              onClick={() => onWorkers(value)}
            >
              {value}
            </button>
          ))}
        </div>
        <button type="button" className={styles.replayButton} onClick={onReplay}>Replay schedule</button>
      </div>

      <div className={styles.workerLanes} style={{ gridTemplateColumns: `repeat(${workers}, minmax(0, 1fr))` }}>
        {workerAssignments.map((blocks, workerIndex) => (
          <div className={styles.workerLane} key={`${workers}-${workerIndex}`}>
            <span className={styles.workerLaneId}>W{workerIndex}</span>
            <div className={styles.workerLaneBlocks}>
              {blocks.map((block) => {
                const completionIndex = completionOrder.indexOf(block);
                const done = completionIndex < visibleCount;
                return <span className={done ? styles.workerDone : undefined} key={block}>B{block}</span>;
              })}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.flowRows}>
        <div>
          <div className={styles.flowLabel}><span>OBSERVED COMPLETION</span><span>changes with scheduling</span></div>
          <div className={styles.orderStrip}>
            {completionOrder.map((block, index) => (
              <span className={index < visibleCount ? styles.orderVisible : undefined} key={`order-${workers}-${block}`}>B{block}</span>
            ))}
          </div>
        </div>
        <div className={styles.snapArrow} aria-hidden="true">↓</div>
        <div>
          <div className={styles.flowLabel}><span>CANONICAL BLOCK SLOTS</span><span>always B0 … B7 before reduction</span></div>
          <div className={styles.canonicalStrip}>
            {BLOCK_IDS.map((block) => (
              <span className={placed.has(block) ? styles.canonicalPlaced : undefined} key={`canonical-${block}`}>B{block}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TreeNode({
  id,
  className = "",
  active = false,
  onClick,
}: {
  id: string;
  className?: string;
  active?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <span>{id}</span>
      <strong>{id.startsWith("B") ? "n · μ · M₂" : id === "ROOT" ? "aggregate" : "merge"}</strong>
    </>
  );

  if (onClick) {
    return <button type="button" className={`${styles.treeNode} ${className} ${active ? styles.treeNodeActive : ""}`} onClick={onClick}>{content}</button>;
  }

  return <div className={`${styles.treeNode} ${className} ${active ? styles.treeNodeActive : ""}`}>{content}</div>;
}

function ReductionScene({ treeLevel, selectedMerge, onSelectMerge }: { treeLevel: number; selectedMerge: string | null; onSelectMerge: (id: string) => void }) {
  const firstPositions = [13.75, 38.75, 63.75, 88.75];
  const secondPositions = [26.25, 76.25];

  return (
    <div className={styles.reductionScene}>
      <div className={styles.treeCanvas}>
        <svg className={styles.treeSvg} viewBox="0 0 1000 520" aria-hidden="true">
          <g className={`${styles.treeEdges} ${treeLevel >= 1 ? styles.treeEdgesLive : ""}`}>
            <path pathLength="1" d="M70 82 L138 166" />
            <path pathLength="1" d="M180 82 L138 166" />
            <path pathLength="1" d="M320 82 L388 166" />
            <path pathLength="1" d="M430 82 L388 166" />
            <path pathLength="1" d="M570 82 L638 166" />
            <path pathLength="1" d="M680 82 L638 166" />
            <path pathLength="1" d="M820 82 L888 166" />
            <path pathLength="1" d="M930 82 L888 166" />
          </g>
          <g className={`${styles.treeEdges} ${treeLevel >= 2 ? styles.treeEdgesLive : ""}`}>
            <path pathLength="1" d="M138 228 L263 324" />
            <path pathLength="1" d="M388 228 L263 324" />
            <path pathLength="1" d="M638 228 L763 324" />
            <path pathLength="1" d="M888 228 L763 324" />
          </g>
          <g className={`${styles.treeEdges} ${treeLevel >= 3 ? styles.treeEdgesLive : ""}`}>
            <path pathLength="1" d="M263 386 L513 458" />
            <path pathLength="1" d="M763 386 L513 458" />
          </g>
        </svg>

        {BLOCK_IDS.map((block, index) => (
          <div className={styles.treePosition} style={{ left: `${7 + index * 12.5}%`, top: "2%" }} key={`leaf-${block}`}>
            <TreeNode id={`B${block}`} className={styles.treeLeaf} active />
          </div>
        ))}

        {FIRST_LEVEL_MERGES.map((merge, index) => (
          <div className={styles.treePosition} style={{ left: `${firstPositions[index]}%`, top: "26%" }} key={merge.id}>
            <TreeNode id={merge.id} active={treeLevel >= 1 || selectedMerge === merge.id} onClick={() => onSelectMerge(merge.id)} />
          </div>
        ))}

        {SECOND_LEVEL_MERGES.map((merge, index) => (
          <div className={styles.treePosition} style={{ left: `${secondPositions[index]}%`, top: "57%" }} key={merge.id}>
            <TreeNode id={merge.id} active={treeLevel >= 2 || selectedMerge === merge.id} onClick={() => onSelectMerge(merge.id)} />
          </div>
        ))}

        <div className={styles.treePosition} style={{ left: "51.25%", top: "84%" }}>
          <TreeNode id="ROOT" className={styles.treeRoot} active={treeLevel >= 3} />
        </div>
      </div>
      <div className={styles.treeHint}>Click a merge node to inspect the Welford combine step.</div>
    </div>
  );
}

function RecoveryScene({
  crashed,
  recoveredCount,
  onCrash,
  onRecover,
}: {
  crashed: boolean;
  recoveredCount: number;
  onCrash: () => void;
  onRecover: () => void;
}) {
  const recoveredThrough = CRASH_COMMIT_INDEX + recoveredCount;

  return (
    <div className={styles.recoveryScene}>
      <div className={styles.commitPipeline}>
        <div><span>01</span><strong>compute block</strong></div>
        <span>→</span>
        <div><span>02</span><strong>write immutable block</strong></div>
        <span>→</span>
        <div><span>03</span><strong>manifest commit</strong></div>
      </div>

      <div className={styles.recoveryBlocks}>
        {BLOCK_IDS.map((block) => {
          const committedAtCrash = block <= CRASH_COMMIT_INDEX;
          const recovered = crashed && block <= recoveredThrough;
          const state = !crashed || committedAtCrash || recovered ? "committed" : "uncommitted";
          return (
            <div className={state === "committed" ? styles.recoveryCommitted : styles.recoveryUncommitted} key={block}>
              <span>B{block}</span>
              <strong>{state === "committed" ? "COMMITTED" : "RECOMPUTE"}</strong>
            </div>
          );
        })}
      </div>

      <div className={styles.manifestRow}>
        <div>
          <span className={styles.micro}>Last committed manifest</span>
          <strong>{crashed && recoveredCount < 3 ? `B0–B${CRASH_COMMIT_INDEX}` : "B0–B7"}</strong>
          <p>{crashed && recoveredCount < 3 ? "Blocks not referenced by this manifest are recomputed after restart." : "The manifest references every completed immutable block."}</p>
        </div>
        <div className={styles.recoveryActions}>
          {!crashed ? (
            <button type="button" className={styles.crashButton} onClick={onCrash}>Inject crash</button>
          ) : (
            recoveredCount >= 3 ? (
              <button type="button" className={styles.crashButton} onClick={onCrash}>Inject crash again</button>
            ) : (
              <button type="button" className={styles.recoverButton} onClick={onRecover}>Recover missing blocks</button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function TechnicalNote({ mode, workers, selectedMerge, crashed, recoveredCount }: {
  mode: TraceStepId;
  workers: WorkerCount;
  selectedMerge: string | null;
  crashed: boolean;
  recoveredCount: number;
}) {
  if (mode === "randomness") {
    return (
      <aside className={styles.technicalNote}>
        <span className={styles.noteNumber}>01 / RANDOMNESS</span>
        <h2>Compare a worker-local RNG with a counter-based generator.</h2>
        <p>Use the controls to request the stream for one block. Then run another block first or compare the same request on another worker. A worker-local RNG can return different values because its state depends on earlier execution. Philox does not: the block asks for its values directly from the seed, block id and path position.</p>
        <p className={styles.noteDetail}>This is why block execution can move between workers without changing the random inputs for that block.</p>
      </aside>
    );
  }

  if (mode === "parallelism") {
    return (
      <aside className={styles.technicalNote}>
        <span className={styles.noteNumber}>02 / PARALLELISM</span>
        <h2>{workers} worker{workers === 1 ? "" : "s"} can finish blocks in a different order.</h2>
        <p>The completion sequence is allowed to change with scheduling. Each completed result still carries its block id, so the runtime places it into B0…B7 before reduction. The aggregation code never merges blocks in “whatever finished next” order.</p>
        <p className={styles.noteDetail}>Replay the schedule and watch the two steps separately: completion order first, then canonical placement.</p>
      </aside>
    );
  }

  if (mode === "reduction") {
    return (
      <aside className={styles.technicalNote}>
        <span className={styles.noteNumber}>03 / REDUCTION</span>
        <h2>{selectedMerge ? `${selectedMerge} combines one fixed pair of partial aggregates.` : "Each block keeps a local Welford summary."}</h2>
        <p>Each block may simulate many paths, but it only needs to return <strong>(n, μ, M₂)</strong>. That keeps every block compact and lets completed blocks be merged without storing every payoff. The fixed tree then makes the floating-point merge order reproducible.</p>
        <p className={styles.noteDetail}>Why local Welford? It is numerically stable, mergeable, and cheap to store. The runtime can combine two block summaries directly instead of replaying all their samples.</p>
        <div className={styles.formula}>
          <span>δ = μ₂ − μ₁</span>
          <span>n = n₁ + n₂</span>
          <span>μ = μ₁ + δ · n₂ / n</span>
          <span>M₂ = M₂₁ + M₂₂ + δ² · n₁n₂ / n</span>
        </div>
      </aside>
    );
  }

  return (
    <aside className={styles.technicalNote}>
      <span className={styles.noteNumber}>04 / RECOVERY</span>
      <h2>{crashed && recoveredCount < 3 ? "Red blocks are missing from the last committed manifest." : crashed ? "Recovery completed: every block is committed again." : "Immutable block files become recoverable through the manifest."}</h2>
      <p>{crashed && recoveredCount < 3 ? "On restart, B0–B4 can be reused immediately. B5–B7 are recomputed from the same block identifiers and random inputs, then committed again." : crashed ? "The missing blocks were recomputed and the manifest now references the full block set again." : "A completed block is recoverable when the committed manifest references it. This keeps partially written or uncommitted work out of the recovered state."}</p>
      <p className={styles.noteDetail}>The commit/recovery protocol was tested at 9 crash boundaries. {recoveredCount > 0 ? `${recoveredCount} of 3 missing blocks have been recovered in this demonstration.` : ""}</p>
    </aside>
  );
}

export function MonteCarloTrace() {
  const [mode, setMode] = useState<TraceStepId>("randomness");
  const [workers, setWorkers] = useState<WorkerCount>(4);
  const [visibleCount, setVisibleCount] = useState(0);
  const [placedCount, setPlacedCount] = useState(0);
  const [parallelRun, setParallelRun] = useState(0);
  const [treeLevel, setTreeLevel] = useState(0);
  const [selectedMerge, setSelectedMerge] = useState<string | null>(null);
  const [crashed, setCrashed] = useState(false);
  const [recoveredCount, setRecoveredCount] = useState(0);
  const reducedMotion = useReducedMotion();

  const completionOrder = COMPLETION_ORDERS[workers];

  useEffect(() => {
    if (mode !== "parallelism") return;
    setVisibleCount(reducedMotion ? completionOrder.length : 0);
    setPlacedCount(reducedMotion ? completionOrder.length : 0);
    if (reducedMotion) return;

    const timers: number[] = [];
    completionOrder.forEach((_, index) => {
      timers.push(window.setTimeout(() => setVisibleCount(index + 1), 260 + index * 420));
      timers.push(window.setTimeout(() => setPlacedCount(index + 1), 440 + index * 420));
    });
    return () => timers.forEach(window.clearTimeout);
  }, [mode, workers, parallelRun, completionOrder, reducedMotion]);

  useEffect(() => {
    if (mode !== "reduction") return;
    setTreeLevel(reducedMotion ? 3 : 0);
    if (reducedMotion) return;
    const timers = [
      window.setTimeout(() => setTreeLevel(1), 280),
      window.setTimeout(() => setTreeLevel(2), 860),
      window.setTimeout(() => setTreeLevel(3), 1440),
    ];
    return () => timers.forEach(window.clearTimeout);
  }, [mode, reducedMotion]);

  const changeMode = (nextMode: TraceStepId) => {
    setMode(nextMode);
    setSelectedMerge(null);
    if (nextMode === "recovery") {
      setCrashed(false);
      setRecoveredCount(0);
    }
  };

  const recoverMissingBlocks = () => {
    if (!crashed) return;
    if (reducedMotion) {
      setRecoveredCount(3);
      return;
    }
    setRecoveredCount(0);
    [1, 2, 3].forEach((count, index) => {
      window.setTimeout(() => setRecoveredCount(count), 260 + index * 360);
    });
  };

  return (
    <section className={styles.trace} aria-label="Interactive Monte Carlo runtime visualisation">
      <header className={styles.traceHeader}>
        <div className={styles.traceTitle}>
          <span className={styles.micro}>Interactive runtime trace</span>
          <strong>Monte Carlo execution, reduction and recovery</strong>
        </div>
        <ModeTabs mode={mode} onChange={changeMode} />
      </header>

      <div className={styles.traceBody}>
        <div className={styles.visualStage}>
          {mode === "randomness" ? <RandomnessScene /> : null}
          {mode === "parallelism" ? (
            <ParallelismScene
              workers={workers}
              visibleCount={visibleCount}
              placedCount={placedCount}
              onWorkers={(value) => { setWorkers(value); setParallelRun((run) => run + 1); }}
              onReplay={() => setParallelRun((run) => run + 1)}
            />
          ) : null}
          {mode === "reduction" ? <ReductionScene treeLevel={treeLevel} selectedMerge={selectedMerge} onSelectMerge={setSelectedMerge} /> : null}
          {mode === "recovery" ? (
            <RecoveryScene
              crashed={crashed}
              recoveredCount={recoveredCount}
              onCrash={() => { setCrashed(true); setRecoveredCount(0); }}
              onRecover={recoverMissingBlocks}
            />
          ) : null}
        </div>

        <TechnicalNote
          mode={mode}
          workers={workers}
          selectedMerge={selectedMerge}
          crashed={crashed}
          recoveredCount={recoveredCount}
        />
      </div>
    </section>
  );
}
