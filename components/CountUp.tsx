"use client";

import { useEffect, useState } from "react";

/**
 * A number that counts up to its value once (a quiz score, a total).
 * Shows the final value straight away for people who prefer less motion,
 * and for screen readers the real value is always what's announced.
 */
export default function CountUp({
  value,
  suffix = "",
  duration = 900,
}: {
  value: number;
  suffix?: string;
  duration?: number;
}) {
  // Starts from zero, unless the device asks for less motion.
  const [shown, setShown] = useState(() =>
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
      ? value
      : 0
  );

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    const started = performance.now();

    const tick = (now: number) => {
      const progress = Math.min(1, (now - started) / duration);
      // Ease out: quick at first, settling on the number.
      setShown(Math.round(value * (1 - Math.pow(1 - progress, 3))));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration]);

  return (
    <>
      <span aria-hidden="true" className="tabular-nums">
        {shown}
        {suffix}
      </span>
      <span className="sr-only">
        {value}
        {suffix}
      </span>
    </>
  );
}
