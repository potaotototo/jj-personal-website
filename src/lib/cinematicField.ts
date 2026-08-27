export type OrbitSpec = {
  radiusX: number;
  radiusY: number;
  angleDeg: number;
};

export type NormalizedPoint = {
  x: number;
  y: number;
};

export type StarPoint = NormalizedPoint & {
  id: number;
  size: number;
  opacity: number;
};

function mulberry32(seed: number) {
  let value = seed >>> 0;

  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function resolveOrbitPoint(spec: OrbitSpec): NormalizedPoint {
  const angle = (spec.angleDeg * Math.PI) / 180;

  return {
    x: 0.5 + spec.radiusX * Math.cos(angle),
    y: 0.5 + spec.radiusY * Math.sin(angle),
  };
}

function outsideQuietCenter(x: number, y: number) {
  const dx = (x - 0.5) / 0.31;
  const dy = (y - 0.5) / 0.22;
  return dx * dx + dy * dy >= 1;
}

export function generateStarField(count: number, seed: number): readonly StarPoint[] {
  const random = mulberry32(seed);

  return Array.from({ length: count }, (_, id) => {
    let x = 0;
    let y = 0;

    // Rejection sampling preserves a calm central field around the name while
    // keeping the distribution deterministic for SSR and hydration.
    for (let attempt = 0; attempt < 24; attempt += 1) {
      x = random();
      y = random();
      if (outsideQuietCenter(x, y)) break;
    }

    const bright = id % 8 === 0;

    return {
      id,
      x,
      y,
      size: bright ? 1.7 + random() * 0.8 : 0.95 + random() * 0.75,
      opacity: bright ? 0.68 + random() * 0.20 : 0.20 + random() * 0.18,
    };
  });
}
