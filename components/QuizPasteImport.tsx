"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, CheckCircle2, ClipboardPaste, Loader2, Plus } from "lucide-react";
import { htmlToFormattedText } from "@/lib/htmlToFormatted";
import { parseQuizText } from "@/lib/quizImport";

const LETTERS = ["A", "B", "C", "D"];

const example = `1. Who elects the conservancy board?
A. The county government
B. The members, at the AGM
C. KWS
D. The tourism partner
Answer: B
Explanation: Members elect the board at the annual general meeting.`;

const trueFalseExample = `2. A conservancy must hold an AGM every year. (True/False)
Answer: True
Explanation: The constitution requires a yearly AGM.`;

/**
 * Paste a numbered list of questions (from Claude, Word or a document) and
 * add them all at once. Each question is read into its four choices, the
 * correct answer and the explanation (lib/quizImport), with a preview so
 * mistakes are caught before anything is saved.
 */
export default function QuizPasteImport({
  courseSlug,
  onAdded,
}: {
  courseSlug: string;
  onAdded?: () => void | Promise<void>;
}) {
  const [text, setText] = useState("");
  const [quizType, setQuizType] = useState<"PRACTICE" | "FINAL">("PRACTICE");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ kind: "done" | "error"; message: string } | null>(null);

  const questions = useMemo(() => parseQuizText(text), [text]);
  const ready = questions.filter((item) => item.problems.length === 0);
  const needFixing = questions.length - ready.length;
  // A "Practice Quiz" / "Final Quiz" heading in the paste decides; the
  // dropdown covers questions without one.
  const typeOf = (item: (typeof questions)[number]) => item.quizType ?? quizType;
  const readyFinal = ready.filter((item) => typeOf(item) === "FINAL").length;
  const readyPractice = ready.length - readyFinal;
  const hasSections = questions.some((item) => item.quizType !== null);
  const destination =
    readyPractice && readyFinal
      ? `(${readyPractice} practice, ${readyFinal} final)`
      : `to the ${readyFinal ? "final" : "practice"} quiz`;

  async function addQuestions() {
    setSaving(true);
    setStatus(null);

    try {
      const response = await fetch(
        `/api/admin/courses/${courseSlug}/quiz-questions/bulk`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quizType,
            questions: ready.map((item) => ({
              quizType: typeOf(item),
              question: item.question,
              optionA: item.options[0],
              optionB: item.options[1],
              optionC: item.options[2] ?? "",
              optionD: item.options[3] ?? "",
              correctAnswer: item.correctAnswer,
              explanation: item.explanation,
            })),
          }),
        }
      );
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: "error", message: data.error || "The questions couldn't be added." });
        return;
      }

      setStatus({
        kind: "done",
        message:
          needFixing > 0
            ? `${data.count} questions added ${destination}. The ${needFixing} that need fixing are still in the box.`
            : `${data.count} questions added ${destination}.`,
      });
      // Keep only what still needs fixing, so it can be corrected and added.
      setText(needFixing > 0 ? keepUnfinished(text) : "");
      await onAdded?.();
    } catch {
      setStatus({ kind: "error", message: "The questions couldn't be added. Check your connection and try again." });
    } finally {
      setSaving(false);
    }
  }

  // Rebuilds the box from the questions that weren't added.
  function keepUnfinished(source: string) {
    return parseQuizText(source)
      .filter((item) => item.problems.length > 0)
      .map((item, index) =>
        [
          `${index + 1}. ${item.question}`,
          ...item.options.map((option, i) => `${LETTERS[i] ?? "?"}. ${option}`),
          item.correctAnswer ? `Answer: ${item.correctAnswer}` : "",
          item.explanation ? `Explanation: ${item.explanation}` : "",
        ]
          .filter(Boolean)
          .join("\n")
      )
      .join("\n\n");
  }

  return (
    <div className="rounded-3xl bg-surface p-6 shadow-sm md:p-8">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold">
            <ClipboardPaste size={24} className="text-accent" />
            Paste Questions
          </h2>
          <p className="mt-1 max-w-2xl text-gray-600">
            Paste a numbered list of questions with their choices, answers and
            explanations, and they&apos;re added together.
          </p>
        </div>

        <label className="text-sm font-bold">
          {hasSections ? "Questions without a heading go to" : "Add to"}
          <select
            value={quizType}
            onChange={(event) => setQuizType(event.target.value as "PRACTICE" | "FINAL")}
            className="ml-2 rounded-xl border px-3 py-2 font-semibold"
          >
            <option value="PRACTICE">Practice Quiz</option>
            <option value="FINAL">Final Quiz</option>
          </select>
        </label>
      </div>

      <details className="mt-4 rounded-2xl bg-gray-50 px-4 py-3 text-sm">
        <summary className="cursor-pointer font-bold text-ink">
          How to lay out the questions
        </summary>
        <pre className="mt-3 whitespace-pre-wrap font-sans leading-6 text-gray-700">{example}</pre>
        <p className="mt-3 font-bold text-ink">True or False questions</p>
        <pre className="mt-1 whitespace-pre-wrap font-sans leading-6 text-gray-700">{trueFalseExample}</pre>
        <p className="mt-1 leading-6 text-gray-600">
          Just give the answer as True or False (or T / F). Listing
          &ldquo;A. True&rdquo; and &ldquo;B. False&rdquo; as choices works
          too.
        </p>
        <p className="mt-3 leading-6 text-gray-600">
          Leave a gap between questions if you like. Choices can be a) or (a),
          the answer can be the letter or the choice&apos;s words, and
          &ldquo;Hint:&rdquo; or &ldquo;Why:&rdquo; works instead of
          &ldquo;Explanation:&rdquo;. A ✓ after a choice also marks it as the
          answer. Put &ldquo;Practice Quiz&rdquo; and &ldquo;Final Quiz&rdquo;
          headings above each set to add both at once, and an &ldquo;Answer
          key&rdquo; at the end (number, letter, reason) works too.
        </p>
      </details>

      <textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setStatus(null);
        }}
        onPaste={(event) => {
          // Copied lists can lose their numbers as plain text; read the
          // formatted copy instead when there is one.
          const html = event.clipboardData.getData("text/html");
          const converted = html ? htmlToFormattedText(html) : "";
          if (converted) {
            event.preventDefault();
            const target = event.currentTarget;
            const next =
              text.slice(0, target.selectionStart) + converted + text.slice(target.selectionEnd);
            setText(next);
            setStatus(null);
          }
        }}
        rows={10}
        placeholder={example}
        aria-label="Questions to add"
        className="mt-4 w-full rounded-xl border px-4 py-3 leading-7 outline-none placeholder:text-gray-400 focus:border-primary"
      />

      {status && (
        <p
          role="status"
          className={`mt-3 flex items-center gap-2 text-sm font-semibold ${
            status.kind === "done" ? "text-green-700" : "text-red-700"
          }`}
        >
          {status.kind === "done" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}
          {status.message}
        </p>
      )}

      {questions.length > 0 && (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm font-bold text-gray-600">
              {ready.length} ready
              {needFixing > 0 && (
                <span className="text-red-700"> · {needFixing} need fixing (won&apos;t be added)</span>
              )}
            </p>

            <button
              type="button"
              onClick={addQuestions}
              disabled={saving || ready.length === 0}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Plus size={18} />}
              {saving
                ? "Adding..."
                : `Add ${ready.length} question${ready.length === 1 ? "" : "s"} ${destination}`}
            </button>
          </div>

          <ol className="mt-4 space-y-4">
            {questions.map((item, index) => {
              const problem = item.problems.length > 0;

              return (
                <li
                  key={index}
                  className={`rounded-2xl border p-5 ${
                    problem ? "border-red-200 bg-red-50" : "border-gray-200"
                  }`}
                >
                  {(hasSections || item.options.length === 2) && (
                    <div className="mb-2 flex flex-wrap gap-2">
                      {hasSections && (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-bold ${
                            typeOf(item) === "FINAL"
                              ? "bg-lilac-tint text-lilac-text"
                              : "bg-green-100 text-green-700"
                          }`}
                        >
                          {typeOf(item) === "FINAL" ? "Final quiz" : "Practice quiz"}
                          {item.number !== null && ` · Q${item.number}`}
                        </span>
                      )}
                      {item.options.length === 2 && (
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                          True / False
                        </span>
                      )}
                    </div>
                  )}
                  <p className="font-bold">
                    <span className="mr-2 text-accent">{index + 1}.</span>
                    {item.question || <em className="font-normal text-gray-500">No question text</em>}
                  </p>

                  {item.options.length > 0 && (
                    <ul className="mt-3 grid gap-2 md:grid-cols-2">
                      {item.options.map((option, optionIndex) => {
                        const correct = LETTERS[optionIndex] === item.correctAnswer;
                        return (
                          <li
                            key={optionIndex}
                            className={`rounded-xl px-3 py-2 text-sm ${
                              correct
                                ? "bg-green-100 font-semibold text-green-800"
                                : "bg-gray-50 text-gray-700"
                            }`}
                          >
                            <strong>{LETTERS[optionIndex] ?? "?"}:</strong> {option}
                            {correct && <CheckCircle2 size={14} className="ml-1.5 inline -translate-y-px" />}
                          </li>
                        );
                      })}
                    </ul>
                  )}

                  {item.explanation && (
                    <p className="mt-3 rounded-xl bg-tint p-3 text-sm leading-6 text-gray-700">
                      <strong>Explanation:</strong> {item.explanation}
                    </p>
                  )}

                  {problem && (
                    <ul className="mt-3 space-y-1 text-sm font-semibold text-red-700">
                      {item.problems.map((message) => (
                        <li key={message} className="flex items-start gap-1.5">
                          <AlertTriangle size={15} className="mt-0.5 shrink-0" />
                          {message}
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ol>
        </div>
      )}
    </div>
  );
}
