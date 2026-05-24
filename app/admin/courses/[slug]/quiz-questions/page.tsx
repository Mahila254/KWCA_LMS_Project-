"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  Plus,
  HelpCircle,
  CheckCircle,
  ClipboardList,
} from "lucide-react";

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
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("A");
  const [explanation, setExplanation] = useState("");
  const [order, setOrder] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function fetchQuizQuestions() {
    try {
      const response = await fetch(
        `/api/admin/courses/${courseSlug}/quiz-questions`
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        router.push("/admin/courses");
        return;
      }

      setCourse(data.course);
      setQuizQuestions(data.quizQuestions || []);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while loading quiz questions.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (courseSlug) {
      fetchQuizQuestions();
    }
  }, [courseSlug]);

  async function handleCreateQuestion() {
    if (!question.trim()) {
      alert("Please enter the quiz question.");
      return;
    }

    if (!optionA.trim() || !optionB.trim() || !optionC.trim() || !optionD.trim()) {
      alert("Please fill in all four answer options.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        `/api/admin/courses/${courseSlug}/quiz-questions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            quizType,
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            correctAnswer,
            explanation,
            order,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong.");
        return;
      }

      alert("✅ Quiz question created successfully!");

      setQuestion("");
      setOptionA("");
      setOptionB("");
      setOptionC("");
      setOptionD("");
      setCorrectAnswer("A");
      setExplanation("");
      setOrder("");

      await fetchQuizQuestions();
    } catch (error) {
      console.error(error);
      alert("Something went wrong while creating the quiz question.");
    } finally {
      setSaving(false);
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
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading quiz questions...</h1>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#EDF5F3] py-16">
          <div className="mx-auto max-w-7xl px-6">
            <Link
              href="/admin/courses"
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course Management
            </Link>

            <div className="mt-8">
              <p className="font-bold text-[#007F73]">Quiz Management</p>

              <h1 className="mt-3 text-5xl font-bold">
                {course?.title || "Course Quiz"}
              </h1>

              <p className="mt-4 max-w-3xl text-xl text-gray-600">
                Add practice and final quiz questions for this course.
              </p>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-8 px-6 py-12 lg:grid-cols-3">
          <div className="space-y-8 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <HelpCircle className="text-[#007F73]" size={28} />
                  <p className="text-sm font-bold text-gray-500">
                    Practice Questions
                  </p>
                </div>

                <p className="text-4xl font-bold">
                  {practiceQuestions.length}
                </p>
              </div>

              <div className="rounded-3xl bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <ClipboardList className="text-[#D94A00]" size={28} />
                  <p className="text-sm font-bold text-gray-500">
                    Final Quiz Questions
                  </p>
                </div>

                <p className="text-4xl font-bold">{finalQuestions.length}</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="border-b px-6 py-5">
                <h2 className="text-2xl font-bold">All Quiz Questions</h2>

                <p className="mt-1 text-gray-600">
                  Showing {quizQuestions.length} questions from the database.
                </p>
              </div>

              {quizQuestions.length === 0 ? (
                <div className="p-10 text-center">
                  <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
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
                    <div key={item.id} className="grid gap-6 px-6 py-6 md:grid-cols-[70px_1fr]">
                      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F2FBF8] text-xl font-bold text-[#007F73]">
                        {item.order}
                      </div>

                      <div>
                        <div className="mb-3 flex flex-wrap gap-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              item.quizType === "PRACTICE"
                                ? "bg-green-100 text-green-700"
                                : "bg-orange-100 text-[#D94A00]"
                            }`}
                          >
                            {item.quizType === "PRACTICE"
                              ? "Practice Quiz"
                              : "Final Quiz"}
                          </span>

                          <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700">
                            <CheckCircle size={13} />
                            Correct: {item.correctAnswer}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold">{item.question}</h3>

                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <p className="rounded-xl bg-gray-50 p-3 text-sm">
                            <strong>A:</strong> {item.optionA}
                          </p>
                          <p className="rounded-xl bg-gray-50 p-3 text-sm">
                            <strong>B:</strong> {item.optionB}
                          </p>
                          <p className="rounded-xl bg-gray-50 p-3 text-sm">
                            <strong>C:</strong> {item.optionC}
                          </p>
                          <p className="rounded-xl bg-gray-50 p-3 text-sm">
                            <strong>D:</strong> {item.optionD}
                          </p>
                        </div>

                        {item.explanation && (
                          <p className="mt-4 rounded-xl bg-[#F2FBF8] p-4 text-sm leading-6 text-gray-700">
                            <strong>Explanation:</strong> {item.explanation}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="h-fit rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-bold">Add Quiz Question</h2>

            <p className="mt-2 text-gray-600">
              Create a question for either the practice quiz or final graded
              quiz.
            </p>

            <div className="mt-6 space-y-5">
              <div>
                <label className="mb-2 block font-bold">Quiz Type</label>

                <select
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
                <label className="mb-2 block font-bold">Question Order</label>

                <input
                  type="number"
                  value={order}
                  onChange={(event) => setOrder(event.target.value)}
                  placeholder="1"
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Question</label>

                <textarea
                  rows={4}
                  value={question}
                  onChange={(event) => setQuestion(event.target.value)}
                  placeholder="Write the question here..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Option A</label>
                <input
                  type="text"
                  value={optionA}
                  onChange={(event) => setOptionA(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Option B</label>
                <input
                  type="text"
                  value={optionB}
                  onChange={(event) => setOptionB(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Option C</label>
                <input
                  type="text"
                  value={optionC}
                  onChange={(event) => setOptionC(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Option D</label>
                <input
                  type="text"
                  value={optionD}
                  onChange={(event) => setOptionD(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <div>
                <label className="mb-2 block font-bold">Correct Answer</label>

                <select
                  value={correctAnswer}
                  onChange={(event) => setCorrectAnswer(event.target.value)}
                  className="w-full rounded-xl border px-4 py-3"
                >
                  <option value="A">A</option>
                  <option value="B">B</option>
                  <option value="C">C</option>
                  <option value="D">D</option>
                </select>
              </div>

              <div>
                <label className="mb-2 block font-bold">Explanation</label>

                <textarea
                  rows={4}
                  value={explanation}
                  onChange={(event) => setExplanation(event.target.value)}
                  placeholder="Explain why this answer is correct..."
                  className="w-full rounded-xl border px-4 py-3"
                />
              </div>

              <button
                type="button"
                onClick={handleCreateQuestion}
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Plus size={18} />
                {saving ? "Saving..." : "Add Question"}
              </button>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}