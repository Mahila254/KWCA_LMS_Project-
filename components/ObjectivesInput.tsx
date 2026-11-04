"use client";

import { useState } from "react";
import { MAX_OBJECTIVES, joinObjectives, parseObjectives } from "@/lib/objectives";

const EXAMPLES = [
  "Explain what a conservancy is and why it matters.",
  "Describe the main governance structures in a conservancy.",
  "Apply practical steps to run inclusive meetings.",
  "Check whether benefits are shared fairly, and plan improvements.",
  "Respond safely when problems are reported.",
];

function toSlots(value: string) {
  const items = parseObjectives(value);
  // Older courses may have more than five; keep them all rather than
  // silently dropping any when the course is saved.
  const count = Math.max(MAX_OBJECTIVES, items.length);
  return Array.from({ length: count }, (_, index) => items[index] ?? "");
}

/**
 * Five numbered fields for a course's learning objectives, saved as one
 * objective per line (see lib/objectives.ts). Empty fields are skipped.
 */
export default function ObjectivesInput({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const [slots, setSlots] = useState(() => toSlots(value));

  // The edit page loads the course after this first renders; pick up that
  // value, but not our own typing coming back round.
  const [lastValue, setLastValue] = useState(value);
  if (value !== lastValue) {
    setLastValue(value);
    if (value !== joinObjectives(slots)) {
      setSlots(toSlots(value));
    }
  }

  function update(index: number, text: string) {
    const next = slots.map((item, i) => (i === index ? text : item));
    const joined = joinObjectives(next);
    setSlots(next);
    setLastValue(joined);
    onChange(joined);
  }

  const filled = slots.filter((item) => item.trim()).length;

  return (
    <fieldset>
      <legend className="mb-1 font-bold">Learning Objectives</legend>

      <p className="mb-4 text-sm leading-6 text-gray-500">
        What learners will be able to do by the end of the course, one per
        field. Start each with an action word such as Explain, Describe or
        Apply. Up to {MAX_OBJECTIVES}; leave any you don&rsquo;t need empty.
      </p>

      <ol className="space-y-3">
        {slots.map((item, index) => (
          <li key={index} className="flex items-center gap-3">
            <span
              aria-hidden
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-extrabold ${
                item.trim()
                  ? "bg-secondary text-white"
                  : "bg-tint text-ink/60"
              }`}
            >
              {index + 1}
            </span>

            <input
              type="text"
              value={item}
              onChange={(event) => update(index, event.target.value)}
              maxLength={220}
              aria-label={`Learning objective ${index + 1}`}
              placeholder={`e.g. ${EXAMPLES[index % EXAMPLES.length]}`}
              className="w-full rounded-xl border px-4 py-3 placeholder:text-gray-400"
            />
          </li>
        ))}
      </ol>

      <p className="mt-3 text-sm font-semibold text-gray-500">
        {filled} of {slots.length} filled in
      </p>
    </fieldset>
  );
}
