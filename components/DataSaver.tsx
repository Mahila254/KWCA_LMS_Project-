"use client";

import { useState, useSyncExternalStore } from "react";
import { PlayCircle, Signal, SignalLow } from "lucide-react";
import { setDataSaver } from "@/lib/dataSaver";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-saver"],
  });
  return () => observer.disconnect();
}

/** Whether low-data mode is on (false on the server and until loaded). */
export function useDataSaver() {
  return useSyncExternalStore(
    subscribe,
    () => document.documentElement.dataset.saver === "on",
    () => false
  );
}

/** The on/off switch for low-data mode, shown in the footer. */
export function DataSaverToggle() {
  const on = useDataSaver();

  return (
    <button
      type="button"
      onClick={() => setDataSaver(!on)}
      aria-pressed={on}
      title="Low-data mode: videos wait for a tap, and large photos are skipped"
      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${
        on
          ? "border-white/40 bg-white/15 text-white"
          : "border-white/15 text-white/75 hover:border-white/40 hover:text-white"
      }`}
    >
      {on ? <SignalLow size={16} /> : <Signal size={16} />}
      Low-data mode: {on ? "On" : "Off"}
    </button>
  );
}

/**
 * Wraps a lesson video. In low-data mode the video isn't loaded until the
 * learner asks for it, so opening a lesson to read the notes costs almost
 * nothing.
 */
export function VideoDataGate({ children }: { children: React.ReactNode }) {
  const saver = useDataSaver();
  const [load, setLoad] = useState(false);

  if (!saver || load) return <>{children}</>;

  return (
    <div className="flex aspect-video flex-col items-center justify-center gap-4 rounded-3xl bg-deep px-6 text-center text-white">
      <SignalLow size={40} className="text-highlight" />

      <div>
        <p className="text-xl font-bold">Low-data mode is on</p>
        <p className="mx-auto mt-1 max-w-sm text-sm leading-6 text-white/75">
          The video isn&apos;t loaded yet, to save your data. The lesson notes
          below are ready to read.
        </p>
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => setLoad(true)}
          className="inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 font-bold text-white hover:bg-secondary-hover"
        >
          <PlayCircle size={18} />
          Load the video
        </button>

        <button
          type="button"
          onClick={() => setDataSaver(false)}
          className="rounded-full border border-white/30 px-5 py-3 text-sm font-semibold hover:bg-white/10"
        >
          Turn off low-data mode
        </button>
      </div>
    </div>
  );
}
