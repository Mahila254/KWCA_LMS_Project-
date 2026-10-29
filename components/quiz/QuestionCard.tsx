"use client";

import { ArrowLeft, ArrowRight, Check, Lock, X } from "lucide-react";

type Option = {
  label: string;
  text: string;
};

/**
 * One quiz question, laid out compactly so the question, all four
 * options, the feedback line and the Previous/Next buttons fit on one
 * laptop screen next to the question panel: "Question 1 of 3" sits in a
 * narrow left column, options are tight rows rather than tall cards.
 *
 * Practice quiz: pass `correctAnswer` once answered to colour the options
 * green/red and show the explanation. Final quiz: leave it out, so only
 * the learner's pick is highlighted.
 */
export default function QuestionCard({
  index,
  total,
  question,
  options,
  selected,
  onSelect,
  locked = false,
  correctAnswer,
  explanation,
  graded = false,
  onPrevious,
  onNext,
  nextLabel,
  nextAccent = false,
  nextDisabled = false,
}: {
  index: number;
  total: number;
  question: string;
  options: Option[];
  selected: string;
  onSelect: (label: string) => void;
  // Options can't be changed (practice answers are final once picked).
  locked?: boolean;
  // Practice only: reveals right/wrong once the learner has answered.
  correctAnswer?: string;
  explanation?: string | null;
  // Final quiz: shows a small lock badge next to the question number.
  graded?: boolean;
  onPrevious: () => void;
  onNext: () => void;
  nextLabel: string;
  // Burgundy instead of navy, for Finish / Submit on the last question.
  nextAccent?: boolean;
  nextDisabled?: boolean;
}) {
  const revealed = Boolean(correctAnswer && selected);
  const isCorrect = revealed && selected === correctAnswer;

  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm sm:p-7">
      <div className="grid gap-2 sm:grid-cols-[6.5rem_1fr] sm:gap-6">
        <div className="flex items-center gap-1.5 text-sm font-semibold text-gray-500 sm:block sm:border-r sm:border-gray-200 sm:pt-1">
          <span className="flex items-center gap-1.5">
            {graded && <Lock size={13} />}
            Question {index + 1}
          </span>
          <span className="text-gray-400 sm:block sm:text-xs">of {total}</span>
        </div>

        <div key={index} className="animate-page-enter">
          <h2 className="text-lg font-bold leading-7 sm:text-xl sm:leading-8">
            {question}
          </h2>

          <ul className="mt-3 space-y-1 sm:mt-4 sm:space-y-1.5">
            {options.map((option) => {
              const picked = selected === option.label;
              const isAnswer = revealed && correctAnswer === option.label;
              const wrongPick = revealed && picked && !isAnswer;

              let row = "border-transparent hover:border-gray-200 hover:bg-gray-50";
              let bubble = "bg-[#F1F0FA] text-[#1E1D59]";

              if (isAnswer) {
                row = "border-green-500 bg-green-50";
                bubble = "bg-green-600 text-white";
              } else if (wrongPick) {
                row = "border-red-500 bg-red-50";
                bubble = "bg-red-600 text-white";
              } else if (revealed) {
                row = "border-transparent opacity-60";
              } else if (picked) {
                row = "border-[#1E1D59] bg-[#F1F0FA]";
                bubble = "bg-[#1E1D59] text-white";
              }

              return (
                <li key={option.label}>
                  <button
                    type="button"
                    onClick={() => onSelect(option.label)}
                    disabled={locked}
                    aria-pressed={picked}
                    className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2 text-left disabled:cursor-default sm:py-2.5 ${row}`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-extrabold transition-colors ${bubble}`}
                    >
                      {option.label}
                    </span>

                    <span className="pt-0.5 text-base leading-6 text-gray-800">
                      {option.text}
                    </span>

                    {isAnswer && (
                      <Check className="ml-auto mt-0.5 shrink-0 text-green-600" size={20} />
                    )}
                    {wrongPick && (
                      <X className="ml-auto mt-0.5 shrink-0 text-red-600" size={20} />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>

          {revealed && (
            <div className="mt-3 animate-page-enter px-1">
              <p className="flex items-center gap-2 font-semibold text-gray-800">
                {isCorrect ? (
                  <Check className="text-green-600" size={22} strokeWidth={3} />
                ) : (
                  <X className="text-red-600" size={22} strokeWidth={3} />
                )}
                {isCorrect
                  ? "This is correct!"
                  : `Not quite. The correct answer is ${correctAnswer}.`}
              </p>

              {explanation && (
                <p className="mt-1 pl-[30px] text-sm leading-6 text-gray-600">
                  {explanation}
                </p>
              )}
            </div>
          )}

          <div className="mt-4 flex items-center justify-between gap-3 border-t border-gray-100 pt-3 sm:mt-5 sm:pt-4">
            <button
              type="button"
              onClick={onPrevious}
              disabled={index === 0}
              className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-sm font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-300 disabled:hover:bg-transparent"
            >
              <ArrowLeft size={16} />
              Previous
            </button>

            <button
              type="button"
              onClick={onNext}
              disabled={nextDisabled}
              className={`inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60 ${
                nextAccent
                  ? "bg-[#632854] hover:bg-[#4F2043]"
                  : "bg-[#1E1D59] hover:bg-[#14123D]"
              }`}
            >
              {nextLabel}
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
