"use client";

import { CSSProperties, ReactNode, useEffect, useRef, useState } from "react";

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  // Milliseconds to wait after the block scrolls into view. Give sibling
  // cards 0, 80, 160... for a staggered entrance.
  delay?: number;
};

/**
 * Fades and lifts its children in the first time they scroll into view.
 * The look lives in globals.css (.reveal). Content starts visible and is
 * only hidden after mount, so server HTML and no-JS visitors see it all.
 */
export default function ScrollReveal({
  children,
  className = "",
  delay = 0,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [state, setState] = useState<"idle" | "hidden" | "visible">("idle");

  useEffect(() => {
    const currentElement = ref.current;

    if (!currentElement) return;

    // Already on screen at load (e.g. a page hero): leave it alone so it
    // doesn't flash out and back in.
    const rect = currentElement.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.9) {
      setState("visible");
      return;
    }

    setState("hidden");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("visible");
          observer.unobserve(currentElement);
        }
      },
      {
        // Fire as soon as any part is 40px into the screen. A ratio
        // threshold (e.g. 0.15) never triggers for blocks taller than
        // ~7 screens, such as a long lesson on a phone, leaving them
        // invisible.
        threshold: 0,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    observer.observe(currentElement);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={ref}
      data-state={state}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
      className={`reveal ${className}`}
    >
      {children}
    </div>
  );
}
