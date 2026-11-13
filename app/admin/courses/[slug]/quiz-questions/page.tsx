"use client";

import { useEffect, useState } from "react";
import AdminNavbar from "@/components/AdminNavbar";
import Footer from "@/components/Footer";
import QuizPasteImport from "@/components/QuizPasteImport";
import { TRUE_FALSE_CHOICES, quizChoicesProblem } from "@/lib/quizChoices";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  HelpCircle,
  CheckCircle,
  ClipboardList,
  Pencil,
  Trash2,
  XCircle,
  Save,
} from "lucide-react";
import { confirmAction, notify } from "@/lib/notify";

type QuizQuestion = {
  id: string;
  quizType: "PRACTICE" | "FINAL";
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation?: string;
  order: number;
};

// Saved with C and D empty (see lib/quizChoices).
function isTrueFalse(item: QuizQuestion) {
  return !item.optionC?.trim() && !item.optionD?.trim();
}

type Course = {
  title: string;
  slug: string;
};

export default function AdminQuizQuestionsPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();

  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);

  const [quizType, setQuizType] = useState<"PRACTICE" | "FINAL">("PRACTICE");
  // True/False questions are saved as choices A "True" and B "False",
  // with C and D empty.
  const [questionKind, setQuestionKind] = useState<"CHOICE" | "TRUE_FALSE">(
    "CHOICE"
  );
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [order, setOrder] = useState("");

  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchQuizQuestions() {
    try {
      const response = await fetch(
        `/api/admin/courses/${courseSlug}/quiz-questions`
      );

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong.");
        router.push("/admin/courses");
        return;
      }

      setCourse(data.course);
      setQuizQuestions(data.quizQuestions || []);
    } catch (error) {
      console.error(error);
      notify("Something went wrong while loading quiz questions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courseSlug) {
      // Loads this page's data when it opens; the state updates happen
      // after the request returns, not during the effect itself.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchQuizQuestions();
    }
  }, [courseSlug]);

  function clearForm() {
    setQuizType("PRACTICE");
    setQuestionKind("CHOICE");
    setQuestion("");
    setOptionA("");
    setOptionB("");
    setOptionC("");
    setOptionD("");
    setCorrectAnswer("A");
    setExplanation("");
    setOrder("");
    setEditingQuestionId(null);
  }

  function handleEditQuestion(item: QuizQuestion) {
    setEditingQuestionId(item.id);
    setQuizType(item.quizType);
    setQuestionKind(isTrueFalse(item) ? "TRUE_FALSE" : "CHOICE");
    setQuestion(item.question);
    setOptionA(item.optionA);
    setOptionB(item.optionB);
    setOptionC(item.optionC);
    setOptionD(item.optionD);
    setCorrectAnswer(item.correctAnswer);
    setExplanation(item.explanation || "");
    setOrder(String(item.order || ""));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSaveQuestion() {
    if (!question.trim()) {
      notify("Please enter the quiz question.");
      return;
    }

    const choices =
      questionKind === "TRUE_FALSE"
        ? [...TRUE_FALSE_CHOICES, "", ""]
        : [optionA, optionB, optionC, optionD];

    if (questionKind === "CHOICE" && choices.some((choice) => !choice.trim())) {
      notify("Please fill in all four answer options.");
      return;
    }

    const choicesProblem = quizChoicesProblem(choices, correctAnswer);
    if (choicesProblem) {
      notify(choicesProblem);
      return;
    }

    try {
      setSaving(true);

      const url = editingQuestionId
        ? `/api/admin/courses/${courseSlug}/quiz-questions/${editingQuestionId}`
        : `/api/admin/courses/${courseSlug}/quiz-questions`;

      const method = editingQuestionId ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          quizType,
          question,
          optionA: choices[0],
          optionB: choices[1],
          optionC: choices[2],
          optionD: choices[3],
          correctAnswer,
          explanation,
          order,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong.");
        return;
      }

      notify(
        editingQuestionId
          ? "✅ Quiz question updated successfully!"
          : "✅ Quiz question created successfully!"
      );

      clearForm();
      await fetchQuizQuestions();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while saving the quiz question.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteQuestion(item: QuizQuestion) {
    const confirmDelete = await confirmAction(
      `Are you sure you want to delete this quiz question?\n\n"${item.question}"`,
      { confirmLabel: "Delete" }
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `/api/admin/courses/${courseSlug}/quiz-questions/${item.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        notify(data.error || "Something went wrong.");
        return;
      }

      notify("Quiz question deleted successfully.");

      if (editingQuestionId === item.id) {
        clearForm();
      }

      await fetchQuizQuestions();
    } catch (error) {
      console.error(error);
      notify("Something went wrong while deleting the quiz question.");
    }
  }

  const practiceQuestions = quizQuestions.filter(
    (item) => item.quizType === "PRACTICE"
  );

  const finalQuestions = quizQuestions.filter(
    (item) => item.quizType === "FINAL"
  );

  if (loading) {
    return (
      <>
        <AdminNavbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-ink">
          <h1 className="text-3xl font-bold">Loading quiz questions...</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <AdminNavbar />

      <main className="min-h-screen bg-gray-50 text-ink">
        <section className="bg-canvas py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 font-bold text-ink"
            >
              <ArrowLeft size={18} />
              Back to Course Management
            </Link>

            <div className="mt-8">
              <p className="font-bold text-ink">Quiz Management</p>

              <h1 className="mt-3 text-5xl font-bold">
                {course?.title || "Course Quiz"}
              </h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Add, edit, and delete practice and final quiz questions for this
                course.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-surface p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <HelpCircle className="text-ink" size={28} />
                  <p className="text-sm font-bold text-gray-500">
                    Practice Questions
                  </p>
                </div>

                <p className="text-4xl font-bold">
                  {practiceQuestions.length}
                </p>
              </div>

              <div className="rounded-3xl bg-surface p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <ClipboardList className="text-accent" size={28} />
                  <p className="text-sm font-bold text-gray-500">
                    Final Quiz Questions
                  </p>
                </div>

                <p className="text-4xl font-bold">{finalQuestions.length}</p>
              </div>
            </div>

            <QuizPasteImport
              courseSlug={courseSlug}
              onAdded={fetchQuizQuestions}
            />

            <div className="overflow-hidden rounded-3xl bg-surface shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">All Quiz Questions</h2>

                <p className="mt-1 text-gray-600">
                  Showing {quizQuestions.length} questions from the database.
                </p>
              </div>

              {quizQuestions.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-tint text-ink">
                    <HelpCircle size={32} />
                  </div>

                  <h3 className="text-2xl font-bold">No quiz questions yet</h3>

                  <p className="mt-3 text-gray-600">
                    Add your first practice or final quiz question using the
                    form.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {quizQuestions.map((item) => (
                    <div
                      key={item.id}
                      className="grid gap-6 px-6 py-6 md:grid-cols-[70px_1fr]"
                    >
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-tint text-xl font-bold text-ink">
                        {item.order}
                      </div>

                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.quizType === "PRACTICE"
                                ? "bg-green-100 text-green-700"
                                : "bg-lilac-tint text-accent"
                            }`}
                          >
                            {item.quizType === "PRACTICE"
                              ? "Practice Quiz"
                              : "Final Quiz"}
                          </span>

                          {isTrueFalse(item) && (
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              True / False
                            </span>
                          )}

                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            <CheckCircle size={13} />
                            Correct: {item.correctAnswer}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold">{item.question}</h3>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          {(["A", "B", "C", "D"] as const)
                            .map((letter) => [letter, item[`option${letter}`]] as const)
                            .filter(([, text]) => text?.trim())
                            .map(([letter, text]) => (
                              <p key={letter} className="rounded-xl bg-gray-50 p-3 text-sm">
                                <strong>{letter}:</strong> {text}
                              </p>
                            ))}
                        </div>

                        {item.explanation && (
                          <p className="mt-4 rounded-xl bg-tint p-4 text-sm leading-6 text-gray-700">
                            <strong>Explanation:</strong> {item.explanation}
                          </p>
                        )}

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="button"
                            onClick={() => handleEditQuestion(item)}
                            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-3 font-bold text-white hover:bg-primary-hover"
                          >
                            <Pencil size={17} />
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteQuestion(item)}
                            className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-3 font-bold text-red-700 hover:bg-red-50"
                          >
                            <Trash2 size={17} />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-surface p-8 shadow-sm">
            <h2 className="text-2xl font-bold">
              {editingQuestionId ? "Edit Quiz Question" : "Add Quiz Question"}
            </h2>

            <p className="mt-2 text-gray-600">
              {editingQuestionId
                ? "Update the selected quiz question below."
                : "Create a question for either the practice quiz or final graded quiz."}
            </p>

            {editingQuestionId && (
              <div className="mt-5 rounded-2xl bg-lilac-soft p-4 text-sm font-semibold text-accent">
                You are currently editing a saved quiz question.
              </div>
            )}

            <div className="mt-6 space-y-5">
              <div>
                <label htmlFor="field-quiz-type" className="mb-2 block font-bold">Quiz Type</label>

                <select id="field-quiz-type"
                  value={quizType}
                  onChange={(event) =>
                    setQuizType(event.target.value as "PRACTICE" | "FINAL")
                  }
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option value="PRACTICE">Practice Quiz</option>
                  <option value="FINAL">Final Quiz</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">Question Type</label>

                <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-100 p-1 text-sm font-bold">
                  {(
                    [
                      ["CHOICE", "Multiple choice"],
                      ["TRUE_FALSE", "True or False"],
                    ] as const
                  ).map(([kind, label]) => (
                    <button
                      key={kind}
                      type="button"
                      onClick={() => {
                        setQuestionKind(kind);
                        // True/False answers are A or B only.
                        if (kind === "TRUE_FALSE" && !["A", "B"].includes(correctAnswer)) {
                          setCorrectAnswer("A");
                        }
                      }}
                      aria-pressed={questionKind === kind}
                      className={`rounded-lg px-3 py-2 ${
                        questionKind === kind
                          ? "bg-surface text-ink shadow-sm"
                          : "text-gray-500 hover:text-ink"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="field-question-order" className="mb-2 block font-bold">Question Order</label>

                <input id="field-question-order"
                  type="number"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                  placeholder="1"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label htmlFor="field-question" className="mb-2 block font-bold">Question</label>

                <textarea id="field-question"
                  rows={4}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Write the question here..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              {questionKind === "CHOICE" && (
                <>
                  <div>
                    <label htmlFor="field-option-a" className="mb-2 block font-bold">Option A</label>
                    <input id="field-option-a"
                      type="text"
                      value={optionA}
                      onChange={(event) => setOptionA(event.target.value)}
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="field-option-b" className="mb-2 block font-bold">Option B</label>
                    <input id="field-option-b"
                      type="text"
                      value={optionB}
                      onChange={(event) => setOptionB(event.target.value)}
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="field-option-c" className="mb-2 block font-bold">Option C</label>
                    <input id="field-option-c"
                      type="text"
                      value={optionC}
                      onChange={(event) => setOptionC(event.target.value)}
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>

                  <div>
                    <label htmlFor="field-option-d" className="mb-2 block font-bold">Option D</label>
                    <input id="field-option-d"
                      type="text"
                      value={optionD}
                      onChange={(event) => setOptionD(event.target.value)}
                      className="w-full rounded-xl border px-4 py-3"
                    />
                  </div>
                </>
              )}

              <div>
                <label htmlFor="field-correct-answer" className="mb-2 block font-bold">Correct Answer</label>

                {questionKind === "TRUE_FALSE" ? (
                  <div className="grid grid-cols-2 gap-3">
                    {TRUE_FALSE_CHOICES.map((choice, index) => {
                      const letter = index === 0 ? "A" : "B";
                      return (
                        <button
                          key={choice}
                          type="button"
                          onClick={() => setCorrectAnswer(letter)}
                          aria-pressed={correctAnswer === letter}
                          className={`rounded-xl border px-4 py-3 font-bold ${
                            correctAnswer === letter
                              ? "border-green-600 bg-green-50 text-green-700 ring-1 ring-green-600"
                              : "hover:bg-gray-50"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <select id="field-correct-answer"
                    value={correctAnswer}
                    onChange={(event) => setCorrectAnswer(event.target.value)}
                    className="w-full rounded-xl border px-4 py-3"
                  >
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                )}
              </div>

              <div>
                <label htmlFor="field-explanation" className="mb-2 block font-bold">Explanation</label>

                <textarea id="field-explanation"
                  rows={4}
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  placeholder="Explain why this answer is correct..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <button
                type="button"
                onClick={handleSaveQuestion}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-bold text-white hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-60"
              >
                {editingQuestionId ? <Save size={18} /> : <Plus size={18} />}
                {saving
                  ? "Saving..."
                  : editingQuestionId
                  ? "Save Changes"
                  : "Add Question"}
              </button>

              {editingQuestionId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <XCircle size={18} />
                  Cancel Edit
                </button>
              )}
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}