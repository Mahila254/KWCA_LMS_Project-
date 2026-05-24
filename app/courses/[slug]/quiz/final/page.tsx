"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  ClipboardList,
  Award,
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

type SupabaseLearner = {
  id: string;
  email?: string;
  user_metadata?: {
    full_name?: string;
  };
};

export default function FinalQuizPage() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const [resultSaved, setResultSaved] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  useEffect(() => {
    async function fetchFinalQuestions() {
      try {
        const response = await fetch(
          `/api/admin/courses/${courseSlug}/quiz-questions`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Something went wrong while loading final quiz.");
          return;
        }

        setCourse(data.course);

        const finalQuestions = (data.quizQuestions || []).filter(
          (item: QuizQuestion) => item.quizType === "FINAL"
        );

        setQuestions(finalQuestions);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading the final quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (courseSlug) {
      fetchFinalQuestions();
    }
  }, [courseSlug]);

  async function saveQuizResult(score: number, passed: boolean) {
    try {
      setSavingResult(true);

      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        alert("Please login before submitting your final quiz result.");
        return;
      }

      const learner = user as SupabaseLearner;

      if (!learner.email) {
        alert("Your account email could not be found. Please login again.");
        return;
      }

      const learnerName =
        learner.user_metadata?.full_name || learner.email || "Learner";

      const response = await fetch(`/api/courses/${courseSlug}/quiz-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: learner.id,
          email: learner.email,
          name: learnerName,
          quizType: "FINAL",
          score,
          passed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while saving quiz result.");
        return;
      }

      setResultSaved(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your quiz result.");
    } finally {
      setSavingResult(false);
    }
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading final quiz...</h1>
        </main>

        <Footer />
      </>
    );
  }

  if (questions.length === 0) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#07122E]">
          <section className="bg-[#F2FBF8] px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <Link
                href={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 font-bold text-[#007F73]"
              >
                <ArrowLeft size={18} />
                Back to Course
              </Link>

              <h1 className="mt-6 text-5xl font-extrabold">Final Quiz</h1>

              <p className="mt-4 text-lg text-gray-600">
                {course?.title || "Course"}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-16">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-orange-100 text-[#D94A00]">
                <ClipboardList size={32} />
              </div>

              <h2 className="text-3xl font-bold">No final quiz questions yet</h2>

              <p className="mt-3 text-gray-600">
                Final quiz questions added by the admin will appear here.
              </p>

              <Link
                href={`/courses/${courseSlug}`}
                className="mt-6 inline-block rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Back to Course
              </Link>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  const answerOptions = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
  ];

  const progressPercent = Math.round(
    ((currentQuestionIndex + 1) / questions.length) * 100
  );

  function calculateScore(finalAnswers: string[]) {
    return questions.reduce((total, question, index) => {
      return finalAnswers[index] === question.correctAnswer ? total + 1 : total;
    }, 0);
  }

  async function handleNextQuestion() {
    if (!selectedAnswer) {
      alert("Please select an answer before continuing.");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setSelectedAnswer(updatedAnswers[currentQuestionIndex + 1] || "");
    } else {
      const score = calculateScore(updatedAnswers);
      const percentage = Math.round((score / questions.length) * 100);
      const passed = percentage >= 70;

      setCompleted(true);

      await saveQuizResult(percentage, passed);
    }
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex > 0) {
      const updatedAnswers = [...answers];
      updatedAnswers[currentQuestionIndex] = selectedAnswer;
      setAnswers(updatedAnswers);

      setCurrentQuestionIndex((previousIndex) => previousIndex - 1);
      setSelectedAnswer(updatedAnswers[currentQuestionIndex - 1] || "");
    }
  }

  function handleRetakeQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setCompleted(false);
    setResultSaved(false);
    setSavingResult(false);
  }

  if (completed) {
    const finalAnswers = [...answers];
    finalAnswers[currentQuestionIndex] = selectedAnswer;

    const correctCount = calculateScore(finalAnswers);
    const percentage = Math.round((correctCount / questions.length) * 100);
    const passed = percentage >= 70;

    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#07122E]">
          <section className="bg-[#F2FBF8] px-6 py-16">
            <div className="mx-auto max-w-4xl">
              <Link
                href={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 font-bold text-[#007F73]"
              >
                <ArrowLeft size={18} />
                Back to Course
              </Link>

              <h1 className="mt-6 text-5xl font-extrabold">
                Final Quiz Results
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                {course?.title || "Course"}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-4xl px-6 py-16">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div
                className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                  passed
                    ? "bg-[#F2FBF8] text-[#007F73]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {passed ? <Award size={42} /> : <XCircle size={42} />}
              </div>

              <h2 className="text-4xl font-bold">
                {passed ? "Congratulations, you passed!" : "Not passed yet"}
              </h2>

              <p
                className={`mt-6 text-6xl font-extrabold ${
                  passed ? "text-[#007F73]" : "text-red-600"
                }`}
              >
                {percentage}%
              </p>

              <p className="mt-4 text-lg text-gray-600">
                You answered {correctCount} out of {questions.length} questions
                correctly. Passing score is 70%.
              </p>

              <div
                className={`mx-auto mt-6 max-w-xl rounded-2xl p-4 text-sm font-bold ${
                  resultSaved
                    ? "bg-green-50 text-green-700"
                    : savingResult
                    ? "bg-orange-50 text-[#D94A00]"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {resultSaved
                  ? "Quiz result saved to your learner profile."
                  : savingResult
                  ? "Saving quiz result..."
                  : "Quiz result was not saved. Please check your login session."}
              </div>

              <div className="mt-10 rounded-2xl bg-gray-50 p-6 text-left">
                <h3 className="text-2xl font-bold">Review Answers</h3>

                <div className="mt-6 space-y-5">
                  {questions.map((question, index) => {
                    const userAnswer = finalAnswers[index];
                    const correct = userAnswer === question.correctAnswer;

                    return (
                      <div
                        key={question.id}
                        className="rounded-2xl bg-white p-5"
                      >
                        <div className="flex items-start gap-3">
                          {correct ? (
                            <CheckCircle
                              className="mt-1 shrink-0 text-green-600"
                              size={22}
                            />
                          ) : (
                            <XCircle
                              className="mt-1 shrink-0 text-red-600"
                              size={22}
                            />
                          )}

                          <div>
                            <p className="font-bold">
                              {index + 1}. {question.question}
                            </p>

                            <p className="mt-2 text-sm text-gray-600">
                              Your answer:{" "}
                              <span className="font-bold">
                                {userAnswer || "No answer"}
                              </span>
                            </p>

                            <p className="mt-1 text-sm text-gray-600">
                              Correct answer:{" "}
                              <span className="font-bold">
                                {question.correctAnswer}
                              </span>
                            </p>

                            {question.explanation && (
                              <p className="mt-3 text-sm leading-6 text-gray-600">
                                {question.explanation}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <RotateCcw size={18} />
                  Retake Final Quiz
                </button>

                {passed ? (
                  <Link
                    href={`/courses/${courseSlug}/certificate`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    Generate Certificate
                    <Award size={18} />
                  </Link>
                ) : (
                  <Link
                    href={`/courses/${courseSlug}/quiz/practice`}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                  >
                    Review Practice Quiz
                    <ArrowRight size={18} />
                  </Link>
                )}
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-16">
          <div className="mx-auto max-w-4xl">
            <Link
              href={`/courses/${courseSlug}`}
              className="inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Course
            </Link>

            <p className="mt-8 font-bold text-[#D94A00]">Final Graded Quiz</p>

            <h1 className="mt-3 text-5xl font-extrabold">
              {course?.title || "Course"}
            </h1>

            <p className="mt-4 text-gray-600">
              Answer all questions carefully. Passing score is 70%.
            </p>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{progressPercent}%</span>
              </div>

              <div className="h-3 rounded-full bg-white">
                <div
                  className="h-3 rounded-full bg-[#D94A00]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-4xl px-6 py-12">
          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <h2 className="text-3xl font-bold leading-snug">
              {currentQuestion.question}
            </h2>

            <div className="mt-8 grid gap-4">
              {answerOptions.map((option) => {
                const selected = selectedAnswer === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedAnswer(option.label)}
                    className={`rounded-2xl border p-5 text-left font-semibold transition ${
                      selected
                        ? "border-[#D94A00] bg-orange-50 text-[#D94A00]"
                        : "border-gray-200 hover:border-[#D94A00] hover:bg-orange-50"
                    }`}
                  >
                    <span className="mr-2 font-extrabold">{option.label}.</span>
                    {option.text}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-wrap justify-between gap-4">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                className="inline-flex items-center gap-2 rounded-xl bg-[#D94A00] px-6 py-3 font-bold text-white hover:bg-[#b83f00]"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Submit Quiz"
                  : "Next Question"}
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}