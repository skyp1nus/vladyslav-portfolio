"use client";

import { useEffect, useRef, useState } from "react";
import { formatNumber } from "../lib/contributions";

/* easeInOutCubic — eases in and out; easeOutExpo lurched off the line */
const ease = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export function CountUp({
  value,
  duration = 2200,
  start = true,
  className = "",
}: {
  value: number;
  duration?: number;
  start?: boolean;
  className?: string;
}) {
  const [shown, setShown] = useState(0);
  const rafRef = useRef(0);

  useEffect(() => {
    if (!start) return;

    const ms =
      value <= 0 ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? 0
        : duration;

    let t0 = 0;
    const tick = (now: number) => {
      if (!t0) t0 = now;
      const p = ms > 0 ? Math.min(1, (now - t0) / ms) : 1;
      setShown(Math.round(ease(p) * value));
      if (p < 1) rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);

    // rAF is throttled to zero in a background tab — land on the real number anyway.
    const settle = setTimeout(() => setShown(value), ms + 400);

    return () => {
      cancelAnimationFrame(rafRef.current);
      clearTimeout(settle);
    };
  }, [value, duration, start]);

  return (
    <span className={`tabular-nums ${className}`}>{formatNumber(shown)}</span>
  );
}
