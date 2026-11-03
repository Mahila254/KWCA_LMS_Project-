"use client";

import { useId, useRef, useState } from "react";
import { HelpCircle, Plus, Trash2, X } from "lucide-react";
import {
  MAX_CHOICES,
  MAX_VIDEO_QUESTIONS,
  TRUE_FALSE_OPTIONS,
  formatVideoTime,
  parseVideoTime,
  type VideoQuestionInput,
  type VideoQuestionType,
} from "@/lib/videoQuestions";

type Draft = {
  key: number;
  time: string;
  type: VideoQuestionType;
  question: string;
  options: string[];
  correctIndex: number | null;
  explanation: string;
};

function toDraft(question: VideoQuestionInput, key: number): Draft {
  return {
    key,
    time: formatVideoTime(question.timeSeconds),
    type: question.type,
    question: question.question,
    options:
      question.type === "TRUE_FALSE" ? ["", "", ""] : [...question.options],
    correctIndex: question.correctIndex,
    explanation: question.explanation ?? "",
  };
}

function blankDraft(key: number): Draft {
  return {
    key,
    time: "",
    type: "TRUE_FALSE",
    question: "",
    options: ["", "", ""],
    correctIndex: null,
    explanation: "",
  };
}

// What the server action reads (see parseVideoQuestions).
function serialize(drafts: Draft[]) {
  return JSON.stringify(
    drafts.map((draft) => ({
      timeSeconds: parseVideoTime(draft.time),
      type: draft.type,
      question: draft.question,
      options: draft.type === "TRUE_FALSE" ? TRUE_FALSE_OPTIONS : draft.options,
      correctIndex: draft.correctIndex,
      explanation: draft.explanation,
    }))
  );
}

const inputClass =
  "w-full rounded-xl border px-4 py-3 outline-none placeholder:text-gray-400 focus:border-[#1E1D59]";

/**
 * The admin list of questions that pop up during a lesson video. Each one
 * has a time, a true/false or multiple choice question, the right answer
 * and an optional explanation. Sent with the lesson form as JSON in a
 * hidden field named `name`.
 */
export default function VideoQuestionsInput({
  name,
  defaultValue = [],
}: {
  name: string;
  defaultValue?: VideoQuestionInput[];
}) {
  // Keys only need to be unique within this list, and the same on the
  // server and in the browser, so they count up from the saved questions.
  const [drafts, setDrafts] = useState(() => defaultValue.map(toDraft));
  const nextKey = useRef(defaultValue.length);
  const radioGroup = useId();

  function update(key: number, change: Partial<Draft>) {
    setDrafts((current) =>
      current.map((draft) =>
        draft.key === key ? { ...draft, ...change } : draft
      )
    );
  }

  function setType(draft: Draft, type: VideoQuestionType) {
    // A true/false answer doesn't carry over to choices, or back.
    update(draft.key, { type, correctIndex: null });
  }

  function setOption(draft: Draft, index: number, text: string) {
    update(draft.key, {
      options: draft.options.map((option, i) => (i === index ? text : option)),
    });
  }

  function removeOption(draft: Draft, index: number) {
    const correct = draft.correctIndex;
    update(draft.key, {
      options: draft.options.filter((_, i) => i !== index),
      correctIndex:
        correct === null || correct === index
          ? null
          : correct > index
            ? correct - 1
            : correct,
    });
  }

  return (
    <fieldset>
      <input type="hidden" name={name} value={serialize(drafts)} />

      <legend className="mb-1 font-bold">Pop-up Video Questions</legend>

      <p className="mb-4 text-sm leading-6 text-gray-500">
        The video pauses at the time you choose and the question pops up.
        Learners pick an answer, see the correct one, then carry on watching.
        Answers aren&rsquo;t marked. Works with YouTube links and links to a
        video file (.mp4); other video links play without the questions.
      </p>

      {drafts.length === 0 && (
        <div className="rounded-2xl border border-dashed p-6 text-center text-gray-500">
          <HelpCircle className="mx-auto mb-2 text-[#632854]" size={28} />
          No pop-up questions yet.
        </div>
      )}

      <ol className="space-y-4">
        {drafts.map((draft, number) => {
          const timeInvalid =
            draft.time.trim() !== "" && parseVideoTime(draft.time) === null;
          const choices =
            draft.type === "TRUE_FALSE" ? TRUE_FALSE_OPTIONS : draft.options;

          return (
            <li
              key={draft.key}
              className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
            >
              <div className="flex flex-wrap items-end gap-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#632854] text-sm font-extrabold text-white">
                  {number + 1}
                </span>

                <label className="block w-32">
                  <span className="mb-1 block text-sm font-bold">
                    Pops up at
                  </span>
                  <input
                    type="text"
                    inputMode="numeric"
                    required
                    value={draft.time}
                    onChange={(event) =>
                      update(draft.key, { time: event.target.value })
                    }
                    pattern="\d+(:\d{1,2}){0,2}"
                    placeholder="1:30"
                    aria-invalid={timeInvalid}
                    title="Minutes and seconds, e.g. 1:30 (or 1:02:30 for hours)"
                    className={`${inputClass} bg-white ${
                      timeInvalid ? "border-red-500" : ""
                    }`}
                  />
                </label>

                <label className="block min-w-48 flex-1">
                  <span className="mb-1 block text-sm font-bold">Type</span>
                  <select
                    value={draft.type}
                    onChange={(event) =>
                      setType(draft, event.target.value as VideoQuestionType)
                    }
                    className={`${inputClass} bg-white`}
                  >
                    <option value="TRUE_FALSE">True or False</option>
                    <option value="MULTIPLE_CHOICE">Multiple choice</option>
                  </select>
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setDrafts((current) =>
                      current.filter((item) => item.key !== draft.key)
                    )
                  }
                  className="inline-flex items-center gap-2 rounded-full border bg-white px-4 py-3 text-sm font-bold text-red-600 hover:bg-red-50"
                >
                  <Trash2 size={16} />
                  Remove
                </button>
              </div>

              {timeInvalid && (
                <p className="mt-2 text-sm font-semibold text-red-600">
                  Write the time as minutes:seconds, e.g. 1:30.
                </p>
              )}

              <label className="mt-4 block">
                <span className="mb-1 block text-sm font-bold">Question</span>
                <textarea
                  required
                  rows={2}
                  maxLength={500}
                  value={draft.question}
                  onChange={(event) =>
                    update(draft.key, { question: event.target.value })
                  }
                  placeholder={
                    draft.type === "TRUE_FALSE"
                      ? "e.g. A conservancy must hold an AGM every year."
                      : "e.g. Who elects the conservancy board?"
                  }
                  className={`${inputClass} bg-white`}
                />
              </label>

              <div className="mt-4">
                <p className="mb-2 text-sm font-bold">
                  {draft.type === "TRUE_FALSE"
                    ? "Correct answer"
                    : "Choices (tick the correct one)"}
                </p>

                <div
                  className={`grid gap-2 ${
                    draft.type === "TRUE_FALSE" ? "grid-cols-2" : ""
                  }`}
                >
                  {choices.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <label
                        className={`flex flex-1 items-center gap-3 rounded-xl border bg-white px-4 py-3 ${
                          draft.correctIndex === index
                            ? "border-green-600 ring-1 ring-green-600"
                            : ""
                        }`}
                      >
                        <input
                          type="radio"
                          name={`${radioGroup}-${draft.key}`}
                          required
                          checked={draft.correctIndex === index}
                          onChange={() =>
                            update(draft.key, { correctIndex: index })
                          }
                          aria-label={`Mark choice ${index + 1} as correct`}
                          className="h-4 w-4 accent-green-700"
                        />

                        {draft.type === "TRUE_FALSE" ? (
                          <span className="font-bold">{option}</span>
                        ) : (
                          <input
                            type="text"
                            required
                            maxLength={200}
                            value={option}
                            onChange={(event) =>
                              setOption(draft, index, event.target.value)
                            }
                            placeholder={`Choice ${index + 1}`}
                            className="w-full outline-none placeholder:text-gray-400"
                          />
                        )}
                      </label>

                      {draft.type === "MULTIPLE_CHOICE" &&
                        draft.options.length > 2 && (
                          <button
                            type="button"
                            onClick={() => removeOption(draft, index)}
                            aria-label={`Remove choice ${index + 1}`}
                            className="rounded-full p-2 text-gray-400 hover:bg-white hover:text-red-600"
                          >
                            <X size={18} />
                          </button>
                        )}
                    </div>
                  ))}
                </div>

                {draft.type === "MULTIPLE_CHOICE" &&
                  draft.options.length < MAX_CHOICES && (
                    <button
                      type="button"
                      onClick={() =>
                        update(draft.key, {
                          options: [...draft.options, ""],
                        })
                      }
                      className="mt-2 inline-flex items-center gap-1 text-sm font-bold text-[#632854] hover:underline"
                    >
                      <Plus size={16} />
                      Add a choice
                    </button>
                  )}
              </div>

              <label className="mt-4 block">
                <span className="mb-1 block text-sm font-bold">
                  Explanation{" "}
                  <span className="font-normal text-gray-500">
                    (optional, shown after they answer)
                  </span>
                </span>
                <input
                  type="text"
                  maxLength={1000}
                  value={draft.explanation}
                  onChange={(event) =>
                    update(draft.key, { explanation: event.target.value })
                  }
                  placeholder="e.g. The constitution requires a yearly AGM so members can hold the board to account."
                  className={`${inputClass} bg-white`}
                />
              </label>
            </li>
          );
        })}
      </ol>

      {drafts.length < MAX_VIDEO_QUESTIONS && (
        <button
          type="button"
          onClick={() => {
            const draft = blankDraft(nextKey.current++);
            setDrafts((current) => [...current, draft]);
          }}
          className="mt-4 inline-flex items-center gap-2 rounded-full border-2 border-[#632854] px-5 py-3 font-bold text-[#632854] hover:bg-[#F5DCE6]"
        >
          <Plus size={18} />
          Add a question
        </button>
      )}
    </fieldset>
  );
}
