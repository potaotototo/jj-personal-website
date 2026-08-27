"use client";

import { RefObject, useEffect, useRef, useState } from "react";
import { clamp01 } from "@/lib/timeline";

export function useScrollProgress<T extends HTMLElement>(): [RefObject<T | null>, number] {
  const ref = useRef<T>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let raf = 0;
    let last = -1;

    const measure = () => {
      raf = 0;
      const element = ref.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const scrollable = Math.max(1, element.offsetHeight - window.innerHeight);
      const next = clamp01(-rect.top / scrollable);

      // Avoid React work for sub-pixel changes while keeping the timeline deterministic.
      if (Math.abs(next - last) > 0.0005 || next === 0 || next === 1) {
        last = next;
        setProgress(next);
      }
    };

    const requestMeasure = () => {
      if (!raf) raf = window.requestAnimationFrame(measure);
    };

    requestMeasure();
    window.addEventListener("scroll", requestMeasure, { passive: true });
    window.addEventListener("resize", requestMeasure);

    const resizeObserver = new ResizeObserver(requestMeasure);
    if (ref.current) resizeObserver.observe(ref.current);

    return () => {
      if (raf) window.cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", requestMeasure);
      window.removeEventListener("resize", requestMeasure);
    };
  }, []);

  return [ref, progress];
}
