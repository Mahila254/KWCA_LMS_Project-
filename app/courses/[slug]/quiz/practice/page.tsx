"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  HelpCircle,
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

export default function PracticeQuizPage() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    async function fetchPracticeQuestions() {
      try {
        const response = await fetch(
          `/api/admin/courses/${courseSlug}/quiz-questions`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Something went wrong while loading quiz.");
          return;
        }

        setCourse(data.course);

        const practiceQuestions = (data.quizQuestions || []).filter(
          (item: QuizQuestion) => item.quizType === "PRACTICE"
        );

        setQuestions(practiceQuestions);
      } catch (error) {
        console.error(error);
        alert("Something went wrong while loading the practice quiz.");
      } finally {
        setLoading(false);
      }
    }

    if (courseSlug) {
      fetchPracticeQuestions();
    }
  }, [courseSlug]);

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-24 text-center text-[#07122E]">
          <h1 className="text-3xl font-bold">Loading practice quiz...</h1>
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

              <h1 className="mt-6 text-5xl font-extrabold">Practice Quiz</h1>

              <p className="mt-4 text-lg text-gray-600">
                {course?.title || "Course"}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-16">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <HelpCircle size={32} />
              </div>

              <h2 className="text-3xl font-bold">No practice questions yet</h2>

              <p className="mt-3 text-gray-600">
                Practice quiz questions added by the admin will appear here.
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

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  function handleSelectAnswer(answer: string) {
    if (showFeedback) return;

    setSelectedAnswer(answer);
    setShowFeedback(true);

    if (answer === currentQuestion.correctAnswer) {
      setScore((previousScore) => previousScore + 1);
    }
  }

  function handleNextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((previousIndex) => previousIndex + 1);
      setSelectedAnswer("");
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  }

  function handleRetakeQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setShowFeedback(false);
    setScore(0);
    setCompleted(false);
  }

  if (completed) {
    const percentage = Math.round((score / questions.length) * 100);

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
                Practice Quiz Complete
              </h1>

              <p className="mt-4 text-lg text-gray-600">
                {course?.title || "Course"}
              </p>
            </div>
          </section>

          <section className="mx-auto max-w-3xl px-6 py-16">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                <CheckCircle size={42} />
              </div>

              <h2 className="text-4xl font-bold">Your Score</h2>

              <p className="mt-6 text-6xl font-extrabold text-[#007F73]">
                {percentage}%
              </p>

              <p className="mt-4 text-lg text-gray-600">
                You answered {score} out of {questions.length} questions
                correctly.
              </p>

              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <RotateCcw size={18} />
                  Retake Practice Quiz
                </button>

                <Link
                  href={`/courses/${courseSlug}/quiz/final`}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
                >
                  Continue to Final Quiz
                  <ArrowRight size={18} />
                </Link>
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

            <p className="mt-8 font-bold text-[#007F73]">Practice Quiz</p>

            <h1 className="mt-3 text-5xl font-extrabold">
              {course?.title || "Course"}
            </h1>

            <div className="mt-8">
              <div className="mb-2 flex justify-between text-sm font-bold text-gray-600">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{progressPercent}%</span>
              </div>

              <div className="h-3 rounded-full bg-white">
                <div
                  className="h-3 rounded-full bg-[#007F73]"
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
                const correct = currentQuestion.correctAnswer === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleSelectAnswer(option.label)}
                    className={`rounded-2xl border p-5 text-left font-semibold transition ${
                      showFeedback && correct
                        ? "border-green-500 bg-green-50 text-green-700"
                        : showFeedback && selected && !correct
                        ? "border-red-500 bg-red-50 text-red-700"
                        : selected
                        ? "border-[#007F73] bg-[#F2FBF8]"
                        : "border-gray-200 hover:border-[#007F73] hover:bg-[#F2FBF8]"
                    }`}
                  >
                    <span className="mr-2 font-extrabold">{option.label}.</span>
                    {option.text}
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`mt-8 rounded-2xl p-6 ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-center gap-3">
                  {isCorrect ? (
                    <CheckCircle className="text-green-600" size={26} />
                  ) : (
                    <XCircle className="text-red-600" size={26} />
                  )}

                  <h3
                    className={`text-xl font-bold ${
                      isCorrect ? "text-green-700" : "text-red-700"
                    }`}
                  >
                    {isCorrect ? "Correct answer" : "Not quite"}
                  </h3>
                </div>

                <p className="mt-4 leading-7 text-gray-700">
                  {currentQuestion.explanation ||
                    `The correct answer is ${currentQuestion.correctAnswer}.`}
                </p>
              </div>
            )}

            <div className="mt-8 flex justify-end">
              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!showFeedback}
                className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {currentQuestionIndex === questions.length - 1
                  ? "Finish Quiz"
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