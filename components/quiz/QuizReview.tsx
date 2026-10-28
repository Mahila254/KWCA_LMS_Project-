"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import type { AnswerLetter, ReviewItem } from "@/components/quiz/types";

const letters: AnswerLetter[] = ["A", "B", "C", "D"];

/**
 * Review mode: every question of a finished attempt on one page, showing
 * which option the learner picked, whether it was right, the correct
 * answer and the explanation. The navigator bubbles are green/red and
 * scroll to their question when clicked.
 */
export default function QuizReview({
  results,
  score,
  submittedAt,
  actions,
}: {
  results: ReviewItem[];
  score: number;
  submittedAt?: string;
  actions: React.ReactNode;
}) {
  const [current, setCurrent] = useState(0);
  const correctCount = results.filter((item) => item.isCorrect).length;

  function jumpTo(index: number) {
    setCurrent(index);
    document
      .getElementById(`review-question-${index}`)
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_17rem]">
      <div className="order-2 space-y-5 lg:order-1">
        <div className="flex flex-col gap-4 rounded-3xl bg-[#1E1D59] p-6 text-white sm:flex-row sm:items-center sm:justify-between sm:p-8">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-white/60">
              Review mode
            </p>
            <p className="mt-2 text-2xl font-extrabold">
              {correctCount} of {results.length} correct
              {submittedAt && (
                <span className="block text-sm font-semibold text-white/60">
                  Submitted{" "}
                  {new Date(submittedAt).toLocaleString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "numeric",
                    minute: "2-digit",
                  })}
                </span>
              )}
            </p>
          </div>
          <p className="text-6xl font-extrabold text-[#D9D3EC]">{score}%</p>
        </div>

        {results.map((item, index) => (
          <article
            key={item.questionId}
            id={`review-question-${index}`}
            className="scroll-mt-28 rounded-3xl border border-gray-200 bg-white p-6 sm:p-8"
          >
            <div className="grid gap-4 sm:grid-cols-[7rem_1fr] sm:gap-6">
              <p className="text-sm font-semibold text-gray-500 sm:border-r sm:border-gray-200 sm:pt-1">
                Question {index + 1}
              </p>

              <div>
                <h3 className="text-xl font-semibold leading-8 text-[#1E1D59]">
                  {item.question}
                </h3>

                <ul className="mt-5 space-y-3">
                  {letters.map((letter) => {
                    const picked = item.selectedAnswer === letter;
                    const isAnswer = item.correctAnswer === letter;

                    return (
                      <li
                        key={letter}
                        className={`flex items-start gap-3 rounded-2xl px-3 py-2 ${
                          isAnswer
                            ? "bg-green-50"
                            : picked
                            ? "bg-red-50"
                            : ""
                        }`}
                      >
                        <span
                          className={`mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
                            picked
                              ? isAnswer
                                ? "border-green-600"
                                : "border-red-600"
                              : "border-gray-300 bg-gray-200"
                          }`}
                        >
                          {picked && (
                            <span
                              className={`h-2.5 w-2.5 rounded-full ${
                                isAnswer ? "bg-green-600" : "bg-red-600"
                              }`}
                            />
                          )}
                        </span>

                        <span className="text-lg leading-8 text-gray-700">
                          {item.options[letter]}
                        </span>

                        {isAnswer && (
                          <Check className="ml-auto mt-1.5 shrink-0 text-green-600" size={20} />
                        )}
                        {picked && !isAnswer && (
                          <X className="ml-auto mt-1.5 shrink-0 text-red-600" size={20} />
                        )}
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-5">
                  {item.isCorrect ? (
                    <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <Check className="text-green-600" size={26} strokeWidth={3} />
                      This is correct!
                    </p>
                  ) : (
                    <p className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                      <X className="text-red-600" size={26} strokeWidth={3} />
                      {item.selectedAnswer
                        ? "This is incorrect."
                        : "This question was not answered."}{" "}
                      The correct answer is {item.correctAnswer}.
                    </p>
                  )}

                  {item.explanation && (
                    <p className="mt-2 leading-7 text-gray-600">
                      {item.explanation}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        ))}

        <div className="flex flex-wrap justify-center gap-3 pt-2">{actions}</div>
      </div>

      <div className="order-1 lg:order-2">
        <QuestionNavigator
          statuses={results.map((item) => (item.isCorrect ? "correct" : "incorrect"))}
          current={current}
          onSelect={jumpTo}
          summary={`${correctCount} / ${results.length} correct`}
        />
      </div>
    </div>
  );
}
