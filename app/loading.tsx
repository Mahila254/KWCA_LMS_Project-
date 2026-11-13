// Shown while a page's data loads, so a slow connection sees progress
// rather than a frozen screen. The top bar's height is held so the page
// doesn't jump when the real one arrives.
export default function Loading() {
  return (
    <div className="min-h-screen bg-gray-50" aria-busy="true" aria-live="polite">
      <div className="h-16 bg-deep" />

      <div className="mx-auto max-w-7xl px-6 py-16">
        <span className="sr-only">Loading…</span>

        <div className="h-4 w-40 animate-pulse rounded-full bg-tint-strong" />
        <div className="mt-6 h-12 w-3/4 max-w-xl animate-pulse rounded-2xl bg-tint-strong" />
        <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-tint" />
        <div className="mt-3 h-5 w-2/3 max-w-xl animate-pulse rounded-full bg-tint" />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[0, 1, 2].map((card) => (
            <div key={card} className="h-56 animate-pulse rounded-3xl bg-surface shadow-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}
