"use client";

import type { QuestionStatus } from "@/components/quiz/types";

const bubbleStyles: Record<QuestionStatus, string> = {
  unanswered: "bg-gray-200 text-gray-500 hover:bg-gray-300",
  answered: "bg-[#1E1D59] text-white hover:bg-[#14123D]",
  correct: "bg-green-600 text-white hover:bg-green-700",
  incorrect: "bg-red-600 text-white hover:bg-red-700",
};

/**
 * The numbered question bubbles beside a quiz. Grey until a question is
 * answered, then navy (final quiz, where right/wrong is secret until
 * submission) or green/red (practice quiz and review mode). Click a
 * bubble to jump to that question.
 *
 * Phones and tablets get a single swipeable row above the question;
 * desktops get a grid in a sticky side panel.
 */
export default function QuestionNavigator({
  statuses,
  current,
  onSelect,
  summary,
  footer,
}: {
  statuses: QuestionStatus[];
  current: number;
  onSelect: (index: number) => void;
  // Replaces the "3 / 20 answered" count, e.g. "15 / 20 correct".
  summary?: string;
  footer?: React.ReactNode;
}) {
  const answered = statuses.filter((status) => status !== "unanswered").length;
  const showsCorrectness = statuses.some(
    (status) => status === "correct" || status === "incorrect"
  );

  return (
    <aside className="rounded-3xl bg-white p-5 shadow-sm lg:sticky lg:top-28">
      <div className="mb-4 flex items-baseline justify-between gap-3">
        <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-gray-500">
          Questions
        </p>
        <p className="text-sm font-bold text-[#1E1D59]">
          {summary ?? `${answered} / ${statuses.length} answered`}
        </p>
      </div>

      <ol className="no-scrollbar -mx-1 flex gap-2.5 overflow-x-auto px-1 py-1 lg:grid lg:grid-cols-5 lg:overflow-visible">
        {statuses.map((status, index) => {
          const isCurrent = index === current;

          return (
            <li key={index} className="shrink-0">
              <button
                type="button"
                onClick={() => onSelect(index)}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Question ${index + 1}, ${status}`}
                className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-extrabold transition-[background-color,box-shadow,scale] duration-300 ${
                  bubbleStyles[status]
                } ${
                  isCurrent
                    ? "scale-110 ring-2 ring-[#632854] ring-offset-2"
                    : ""
                }`}
              >
                {index + 1}
              </button>
            </li>
          );
        })}
      </ol>

      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2 border-t border-gray-100 pt-4 text-xs font-semibold text-gray-500">
        <li className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded-full bg-gray-200" />
          Not answered
        </li>

        {showsCorrectness ? (
          <>
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-green-600" />
              Correct
            </li>
            <li className="flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-full bg-red-600" />
              Incorrect
            </li>
          </>
        ) : (
          <li className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-[#1E1D59]" />
            Answered
          </li>
        )}
      </ul>

      {footer && <div className="mt-4">{footer}</div>}
    </aside>
  );
}
