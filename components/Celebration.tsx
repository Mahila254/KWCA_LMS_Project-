"use client";

import { useEffect, useState } from "react";

type Piece = {
  left: number;
  delay: number;
  duration: number;
  drift: number;
  spin: number;
  size: number;
  color: string;
  round: boolean;
};

// The roller's colours, so the confetti belongs to the platform.
const COLORS = [
  "var(--chart-1)",
  "var(--secondary)",
  "var(--bright)",
  "var(--highlight)",
  "var(--warm)",
  "var(--bright-soft)",
];

/**
 * A short burst of confetti, for a real achievement (passing the final
 * quiz). Plays once when it appears, then removes itself. Skipped for
 * people who have asked their device to reduce motion.
 */
export default function Celebration({ pieces = 44 }: { pieces?: number }) {
  // Made in the browser only: random positions can't match the server's.
  const [confetti, setConfetti] = useState<Piece[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const start = window.setTimeout(() => {
      setConfetti(
        Array.from({ length: pieces }, (_, index) => ({
          left: Math.random() * 100,
          delay: Math.random() * 0.5,
          duration: 2.2 + Math.random() * 1.6,
          drift: (Math.random() - 0.5) * 220,
          spin: 360 + Math.random() * 720,
          size: 7 + Math.random() * 7,
          color: COLORS[index % COLORS.length],
          round: index % 3 === 0,
        }))
      );
    }, 150);
    const stop = window.setTimeout(() => setConfetti([]), 4600);

    return () => {
      window.clearTimeout(start);
      window.clearTimeout(stop);
    };
  }, [pieces]);

  if (confetti.length === 0) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {confetti.map((piece, index) => (
        <span
          key={index}
          className="confetti-piece absolute top-0 block"
          style={
            {
              left: `${piece.left}%`,
              width: piece.size,
              height: piece.round ? piece.size : piece.size * 0.45,
              borderRadius: piece.round ? "50%" : 2,
              background: piece.color,
              animationDelay: `${piece.delay}s`,
              animationDuration: `${piece.duration}s`,
              "--confetti-drift": `${piece.drift}px`,
              "--confetti-spin": `${piece.spin}deg`,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
