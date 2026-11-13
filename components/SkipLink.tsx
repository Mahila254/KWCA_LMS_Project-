"use client";

/**
 * "Skip to content" for keyboard and screen-reader users: hidden until
 * focused with Tab, then jumps past the top bar to the page's <main>.
 * Every page has its own <main>, so it's found when the link is used
 * rather than by a fixed id.
 */
export default function SkipLink() {
  return (
    <a
      href="#main"
      onClick={(event) => {
        const main = document.querySelector("main");
        if (!main) return;
        event.preventDefault();
        main.setAttribute("tabindex", "-1");
        main.focus({ preventScroll: true });
        main.scrollIntoView();
      }}
      className="fixed left-4 top-4 z-[90] -translate-y-24 rounded-full bg-surface px-5 py-3 font-bold text-ink shadow-lg focus:translate-y-0"
    >
      Skip to content
    </a>
  );
}
