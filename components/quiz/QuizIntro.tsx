"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import type { QuizAttempt, QuizLink } from "@/components/quiz/types";

function formatSubmitted(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/**
 * The "what to expect" screen shown before a quiz starts: the rules as a
 * bullet list, a Start button, the learner's earlier attempts (with a
 * Review button on practice attempts) and links to the previous and next
 * steps of the course.
 */
export default function QuizIntro({
  rules,
  startLabel,
  onStart,
  attempts,
  attemptsLoading,
  signedIn,
  loginHref,
  onReview,
  reviewingId,
  notice,
  previous,
  next,
}: {
  rules: React.ReactNode[];
  startLabel: string;
  onStart: () => void;
  attempts: QuizAttempt[];
  attemptsLoading: boolean;
  signedIn: boolean;
  loginHref: string;
  // Practice quiz only. Final attempts show Passed / Not passed instead.
  onReview?: (attemptId: string) => void;
  reviewingId?: string | null;
  // Anything to show above the rules, e.g. "You've already passed".
  notice?: React.ReactNode;
  previous?: QuizLink | null;
  next?: QuizLink | null;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm sm:p-10">
      {notice}

      <ul className="space-y-3 pl-5 text-lg leading-8 text-gray-700 marker:text-[#632854] [list-style-type:disc]">
        {rules.map((rule, index) => (
          <li key={index} className="pl-1">
            {rule}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="button"
          onClick={onStart}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1E1D59] py-4 pl-6 pr-7 font-bold text-white shadow-[0_12px_26px_-12px_rgba(30,29,89,0.8)] hover:-translate-y-0.5 hover:bg-[#14123D]"
        >
          <Play
            size={18}
            className="fill-current transition-transform duration-300 group-hover:scale-110"
          />
          {startLabel}
        </button>

        {!signedIn && (
          <p className="text-sm text-gray-500">
            <Link href={loginHref} className="font-bold text-[#632854] underline">
              Log in
            </Link>{" "}
            {onReview
              ? "to save your attempts and come back to them later."
              : "first — you need to be logged in to submit a graded quiz."}
          </p>
        )}
      </div>

      {signedIn && (
        <div className="mt-10 overflow-hidden rounded-2xl border border-gray-200">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-sm font-bold text-[#1E1D59]">
              <tr>
                <th className="px-4 py-3 sm:px-5">Submitted</th>
                <th className="px-4 py-3 sm:px-5">Grade</th>
                <th className="px-4 py-3 sm:px-5">
                  {onReview ? "Review" : "Result"}
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {attemptsLoading ? (
                <tr>
                  <td colSpan={3} className="px-5 py-5 text-gray-500">
                    Loading your attempts...
                  </td>
                </tr>
              ) : attempts.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-5 py-5 text-gray-500">
                    No attempts yet. Your results will be listed here.
                  </td>
                </tr>
              ) : (
                attempts.map((attempt) => (
                  <tr key={attempt.id} className="transition-colors hover:bg-gray-50/70">
                    <td className="px-4 py-4 text-sm sm:px-5 sm:text-base">
                      {formatSubmitted(attempt.createdAt)}
                    </td>
                    <td className="px-4 py-4 font-bold sm:px-5">
                      {attempt.score}%
                    </td>
                    <td className="px-4 py-4 sm:px-5">
                      {onReview ? (
                        attempt.canReview ? (
                          <button
                            type="button"
                            onClick={() => onReview(attempt.id)}
                            disabled={reviewingId === attempt.id}
                            className="rounded-full bg-[#1E1D59] px-4 py-2 text-xs font-bold uppercase tracking-wide text-white hover:bg-[#14123D] disabled:opacity-60"
                          >
                            {reviewingId === attempt.id ? "Opening..." : "Review"}
                          </button>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Not available
                          </span>
                        )
                      ) : (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            attempt.passed
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {attempt.passed ? "Passed" : "Not passed"}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {(previous || next) && (
        <nav className="mt-10 flex flex-col gap-3 border-t border-gray-100 pt-6 sm:flex-row sm:items-center sm:justify-between">
          {previous ? (
            <Link
              href={previous.href}
              className="group inline-flex items-center gap-2 text-lg text-gray-700 hover:text-[#1E1D59]"
            >
              <ChevronLeft
                size={24}
                className="shrink-0 transition-transform duration-300 group-hover:-translate-x-1"
              />
              {previous.label}
            </Link>
          ) : (
            <span />
          )}

          {next && (
            <Link
              href={next.href}
              className="group inline-flex items-center gap-2 self-end text-lg text-gray-700 hover:text-[#1E1D59] sm:self-auto"
            >
              {next.label}
              <ChevronRight
                size={24}
                className="shrink-0 transition-transform duration-300 group-hover:translate-x-1"
              />
            </Link>
          )}
        </nav>
      )}
    </div>
  );
}
