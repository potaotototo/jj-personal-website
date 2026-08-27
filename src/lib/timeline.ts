export const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

export const smoothstep = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

export const progressBetween = (progress: number, start: number, end: number) => {
  if (end <= start) return progress >= end ? 1 : 0;
  return smoothstep((progress - start) / (end - start));
};

export const lerp = (from: number, to: number, amount: number) =>
  from + (to - from) * amount;

export type RevealMotion = {
  opacity: number;
  translateY: number;
  scale: number;
};

export const revealMotion = (
  progress: number,
  start: number,
  duration: number,
  fromY = 14,
  fromScale = 0.985,
): RevealMotion => {
  const amount = progressBetween(progress, start, start + duration);
  return {
    opacity: amount,
    translateY: lerp(fromY, 0, amount),
    scale: lerp(fromScale, 1, amount),
  };
};

export type IntroNodeMotion = RevealMotion & {
  detailOpacity: number;
  revealed: boolean;
};

export const introNodeMotion = (
  progress: number,
  start: number,
  settleAt: number,
  duration: number,
  options: {
    fromY?: number;
    fromScale?: number;
    settledOpacity?: number;
    settledDetailOpacity?: number;
    settleDuration?: number;
  } = {},
): IntroNodeMotion => {
  const {
    fromY = 12,
    fromScale = 0.985,
    settledOpacity = 0.32,
    settledDetailOpacity = 0.18,
    settleDuration = 0.035,
  } = options;

  const reveal = progressBetween(progress, start, start + duration);
  const settle = progressBetween(progress, settleAt, settleAt + settleDuration);

  return {
    opacity: lerp(reveal, settledOpacity, settle),
    detailOpacity: lerp(reveal, settledDetailOpacity, settle),
    translateY: lerp(fromY, 0, reveal),
    scale: lerp(lerp(fromScale, 1, reveal), 0.992, settle),
    revealed: progress >= start,
  };
};
