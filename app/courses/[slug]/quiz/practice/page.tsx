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
  ClipboardList,
  BookOpen,
  Target,
  Trophy,
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
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
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

        <main className="min-h-screen bg-gray-50 px-6 py-20 text-center text-[#07122E]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
              <ClipboardList size={32} />
            </div>

            <h1 className="text-3xl font-bold">Loading practice quiz...</h1>

            <p className="mt-3 text-gray-600">
              Preparing your questions and learning activity.
            </p>
          </div>
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
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz"
            subtitle="Test your understanding before moving to the final quiz."
          />

          <section className="mx-auto max-w-3xl px-6 py-10">
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
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white hover:bg-[#00665d]"
              >
                Back to Course
                <ArrowRight size={18} />
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
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz Complete"
            subtitle="You have completed the practice quiz. You can now continue to the final graded quiz."
          />

          <section className="mx-auto max-w-4xl px-6 py-10">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="bg-[#07122E] px-8 py-10 text-center text-white">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Trophy size={42} />
                </div>

                <h2 className="text-4xl font-extrabold">Your Score</h2>

                <p className="mt-6 text-7xl font-extrabold text-[#9DE0D2]">
                  {percentage}%
                </p>

                <p className="mt-4 text-lg text-white/75">
                  You answered {score} out of {questions.length} questions
                  correctly.
                </p>
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-3">
                <ResultStat label="Questions" value={questions.length} />
                <ResultStat label="Correct" value={score} />
                <ResultStat
                  label="Review Needed"
                  value={questions.length - score}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-4 border-t p-8">
                <button
                  type="button"
                  onClick={handleRetakeQuiz}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <RotateCcw size={18} />
                  Retake Quiz
                </button>

                <Link
                  href={`/courses/${courseSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  Back to Course
                  <BookOpen size={18} />
                </Link>

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
        <QuizHero
          courseTitle={course?.title || "Course"}
          courseSlug={courseSlug}
          title="Practice Quiz"
          subtitle="Answer each question and get instant feedback to strengthen your understanding."
        />

        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-6 grid gap-6 md:grid-cols-3">
            <QuizStat
              icon={<ClipboardList size={24} />}
              label="Question"
              value={`${currentQuestionIndex + 1} / ${questions.length}`}
            />

            <QuizStat
              icon={<Target size={24} />}
              label="Progress"
              value={`${progressPercent}%`}
            />

            <QuizStat
              icon={<CheckCircle size={24} />}
              label="Current Score"
              value={`${score}`}
            />
          </div>

          <div className="rounded-3xl bg-white p-8 shadow-sm">
            <div className="mb-8">
              <div className="mb-3 flex justify-between text-sm font-bold text-gray-600">
                <span>
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span>{progressPercent}%</span>
              </div>

              <div className="h-3 rounded-full bg-gray-100">
                <div
                  className="h-3 rounded-full bg-[#007F73]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#F2FBF8] p-8">
              <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#007F73]">
                Practice Question
              </p>

              <h2 className="text-3xl font-extrabold leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-8 grid gap-4">
              {answerOptions.map((option) => {
                const selected = selectedAnswer === option.label;
                const correct = currentQuestion.correctAnswer === option.label;

                let optionClass =
                  "border-gray-200 bg-white hover:border-[#007F73] hover:bg-[#F2FBF8]";

                if (showFeedback && correct) {
                  optionClass = "border-green-500 bg-green-50";
                }

                if (showFeedback && selected && !correct) {
                  optionClass = "border-red-500 bg-red-50";
                }

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleSelectAnswer(option.label)}
                    className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${optionClass}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold ${
                        showFeedback && correct
                          ? "bg-green-600 text-white"
                          : showFeedback && selected && !correct
                          ? "bg-red-600 text-white"
                          : "bg-[#F2FBF8] text-[#007F73]"
                      }`}
                    >
                      {option.label}
                    </span>

                    <span className="pt-2 text-lg font-semibold leading-7">
                      {option.text}
                    </span>

                    <span className="ml-auto pt-2">
                      {showFeedback && correct && (
                        <CheckCircle className="text-green-600" size={24} />
                      )}

                      {showFeedback && selected && !correct && (
                        <XCircle className="text-red-600" size={24} />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>

            {showFeedback && (
              <div
                className={`mt-8 rounded-3xl p-6 ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="mt-1 text-green-600" size={28} />
                  ) : (
                    <XCircle className="mt-1 text-red-600" size={28} />
                  )}

                  <div>
                    <h3
                      className={`text-2xl font-bold ${
                        isCorrect ? "text-green-700" : "text-red-700"
                      }`}
                    >
                      {isCorrect ? "Correct answer!" : "Not quite."}
                    </h3>

                    <p className="mt-2 leading-7 text-gray-700">
                      {currentQuestion.explanation ||
                        "Review the lesson notes and try to understand why this answer is correct."}
                    </p>

                    {!isCorrect && (
                      <p className="mt-3 font-bold text-gray-800">
                        Correct answer: {currentQuestion.correctAnswer}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <Link
                href={`/courses/${courseSlug}`}
                className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold hover:bg-gray-50"
              >
                <ArrowLeft size={18} />
                Back to Course
              </Link>

              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!showFeedback}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold ${
                  showFeedback
                    ? "bg-[#007F73] text-white hover:bg-[#00665d]"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : "Finish Quiz"}
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

function QuizHero({
  courseTitle,
  courseSlug,
  title,
  subtitle,
}: {
  courseTitle: string;
  courseSlug: string;
  title: string;
  subtitle: string;
}) {
  return (
    <section className="relative overflow-hidden px-6 py-10">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/course-hero-background.jpg')",
        }}
      />

      <div className="absolute inset-0 bg-white/70" />

      <div className="absolute inset-0 bg-gradient-to-b from-[#F2FBF8]/90 via-white/80 to-gray-50" />

      <div className="relative mx-auto max-w-5xl">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 font-bold text-[#007F73]"
        >
          <ArrowLeft size={18} />
          Back to Course
        </Link>

        <div className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#007F73] shadow-sm">
            <BookOpen size={15} />
            {courseTitle}
          </span>

          <h1 className="mt-4 text-5xl font-extrabold leading-tight md:text-6xl">
            {title}
          </h1>

          <p className="mt-4 max-w-3xl text-xl leading-8 text-gray-600">
            {subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}

function QuizStat({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-3xl bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3 text-[#007F73]">
        {icon}
        <p className="text-sm font-bold text-gray-500">{label}</p>
      </div>

      <p className="text-3xl font-extrabold">{value}</p>
    </div>
  );
}

function ResultStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 text-center">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-2 text-4xl font-extrabold text-[#007F73]">{value}</p>
    </div>
  );
}