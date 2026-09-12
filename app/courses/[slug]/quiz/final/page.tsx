"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  Lock,
  RotateCcw,
  ShieldCheck,
  Target,
  Trophy,
  XCircle,
} from "lucide-react";

// Note: no correctAnswer field here — the final quiz is graded server-side,
// so the browser never receives the answers before submitting.
type QuizQuestion = {
  id: string;
  quizType: "PRACTICE" | "FINAL";
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  order: number;
};

type Course = {
  id: string;
  title: string;
  slug: string;
  description?: string | null;
  imageUrl?: string | null;
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

  const [finalScore, setFinalScore] = useState(0);
  const [finalPercentage, setFinalPercentage] = useState(0);
  const [passed, setPassed] = useState(false);

  const [resultSaved, setResultSaved] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const QUIZ_DURATION_SECONDS = 30 * 60;
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const autoSubmittedRef = useRef(false);

  useEffect(() => {
    async function fetchFinalQuestions() {
      try {
        const response = await fetch(
          `/api/courses/${courseSlug}/quiz-questions?type=FINAL`
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

  // Ticks the 30-minute quiz timer down once the questions have loaded.
  // Stops automatically once the quiz is completed (submitted).
  useEffect(() => {
    if (loading || questions.length === 0 || completed) return;

    const interval = setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [loading, questions.length, completed]);

  // Auto-submits whatever has been answered so far the moment the timer
  // hits zero, so a learner who runs out of time still gets a graded
  // result instead of losing their progress.
  useEffect(() => {
    if (timeLeft > 0 || completed || autoSubmittedRef.current) return;

    autoSubmittedRef.current = true;

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);

    submitFinalQuiz(updatedAnswers);
  }, [timeLeft, completed]);

  // Submits the learner's picked answers (never the score) and lets the
  // server grade the quiz and decide pass/fail. This is the only source
  // of truth for the saved result — nothing computed in the browser is
  // trusted.
  async function submitFinalQuiz(finalAnswers: string[]) {
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

      const payload = {
        quizType: "FINAL",
        answers: questions.map((question, index) => ({
          questionId: question.id,
          selectedAnswer: finalAnswers[index] || null,
        })),
      };

      const response = await authFetch(`/api/courses/${courseSlug}/quiz-results`, {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while saving quiz result.");
        return;
      }

      setFinalScore(data.correctCount ?? 0);
      setFinalPercentage(data.score ?? 0);
      setPassed(Boolean(data.passed));
      setCompleted(true);
      setResultSaved(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your quiz result.");
    } finally {
      setSavingResult(false);
    }
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
      const nextIndex = currentQuestionIndex + 1;
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(updatedAnswers[nextIndex] || "");
      return;
    }

    await submitFinalQuiz(updatedAnswers);
  }

  function handlePreviousQuestion() {
    if (currentQuestionIndex === 0) return;

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestionIndex] = selectedAnswer;
    setAnswers(updatedAnswers);

    const previousIndex = currentQuestionIndex - 1;
    setCurrentQuestionIndex(previousIndex);
    setSelectedAnswer(updatedAnswers[previousIndex] || "");
  }

  function handleRetakeQuiz() {
    setCurrentQuestionIndex(0);
    setSelectedAnswer("");
    setAnswers([]);
    setCompleted(false);
    setFinalScore(0);
    setFinalPercentage(0);
    setPassed(false);
    setResultSaved(false);
    setSavingResult(false);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    autoSubmittedRef.current = false;
  }

  function formatTimeLeft(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-20 text-center text-[#1E1D59]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5DCE6] text-[#632854]">
              <ClipboardList size={32} />
            </div>

            <h1 className="text-3xl font-bold">Loading final quiz...</h1>

            <p className="mt-3 text-gray-600">
              Preparing your graded assessment.
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

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Final Quiz"
            subtitle="Complete the final graded quiz to qualify for your certificate."
          />

          <section className="mx-auto max-w-3xl px-6 py-10">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5DCE6] text-[#632854]">
                <ClipboardList size={32} />
              </div>

              <h2 className="text-3xl font-bold">No final quiz questions yet</h2>

              <p className="mt-3 text-gray-600">
                Final quiz questions added by the admin will appear here.
              </p>

              <Link
                href={`/courses/${courseSlug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
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

  if (completed) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Final Quiz Complete"
            subtitle="Your final quiz has been submitted. Review your result below."
          />

          <section className="mx-auto max-w-5xl px-6 py-10">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div
                className={`px-8 py-12 text-center text-white ${
                  passed ? "bg-[#1E1D59]" : "bg-[#5C1A2E]"
                }`}
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  {passed ? <Trophy size={42} /> : <XCircle size={42} />}
                </div>

                <p className="font-bold text-white/70">
                  Final Assessment Result
                </p>

                <h2 className="mt-3 text-4xl font-extrabold">
                  {passed ? "Congratulations, you passed!" : "Not passed yet"}
                </h2>

                <p
                  className={`mt-6 text-7xl font-extrabold ${
                    passed ? "text-[#D9D3EC]" : "text-red-200"
                  }`}
                >
                  {finalPercentage}%
                </p>

                <p className="mt-4 text-lg text-white/75">
                  You answered {finalScore} out of {questions.length} questions
                  correctly. Passing score is 70%.
                </p>

                {savingResult && (
                  <p className="mt-4 font-bold text-white/80">
                    Saving your result...
                  </p>
                )}

                {!savingResult && resultSaved && (
                  <p className="mt-4 font-bold text-[#D9D3EC]">
                    Your result has been saved to your learner profile.
                  </p>
                )}
              </div>

              <div className="grid gap-6 p-8 md:grid-cols-4">
                <ResultStat label="Questions" value={questions.length} />
                <ResultStat label="Correct" value={finalScore} />
                <ResultStat
                  label="Incorrect"
                  value={questions.length - finalScore}
                />
                <ResultStat label="Pass Mark" value={70} suffix="%" />
              </div>

              <div className="border-t p-8">
                <div className="rounded-3xl bg-gray-50 p-6">
                  <div className="flex items-start gap-4">
                    {passed ? (
                      <CheckCircle
                        className="mt-1 shrink-0 text-green-600"
                        size={30}
                      />
                    ) : (
                      <XCircle
                        className="mt-1 shrink-0 text-red-600"
                        size={30}
                      />
                    )}

                    <div>
                      <h3 className="text-2xl font-bold">
                        {passed
                          ? "You are eligible for a certificate"
                          : "Review the lesson notes and try again"}
                      </h3>

                      <p className="mt-2 leading-8 text-gray-600">
                        {passed
                          ? "You have passed the final quiz. You can now proceed to generate your course certificate."
                          : "You need at least 70% to pass the final quiz. You can retake the quiz after reviewing the course lessons."}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap justify-center gap-4">
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
                    <BookOpen size={18} />
                    Back to Course
                  </Link>

                  {passed && (
                    <Link
                      href={`/courses/${courseSlug}/certificate`}
                      className="inline-flex items-center gap-2 rounded-xl bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
                    >
                      Generate Certificate
                      <Award size={18} />
                    </Link>
                  )}
                </div>
              </div>
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

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <QuizHero
          courseTitle={course?.title || "Course"}
          courseSlug={courseSlug}
          title="Final Quiz"
          subtitle="This is a graded quiz. Select your answers carefully before submitting."
        />

        <section className="mx-auto max-w-5xl px-6 py-8">
          <div className="mb-6 grid gap-6 md:grid-cols-4">
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
              icon={<ShieldCheck size={24} />}
              label="Pass Mark"
              value="70%"
            />

            <QuizStat
              icon={<Clock size={24} />}
              label="Time Remaining"
              value={formatTimeLeft(timeLeft)}
              warning={timeLeft <= 300}
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
                  className="h-3 rounded-full bg-[#1E1D59]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <div className="rounded-3xl bg-[#F1F0FA] p-8">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[#1E1D59]">
                <Lock size={15} />
                Final Graded Question
              </p>

              <h2 className="text-3xl font-extrabold leading-tight">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-8 grid gap-4">
              {answerOptions.map((option) => {
                const selected = selectedAnswer === option.label;

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSelectedAnswer(option.label)}
                    className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${
                      selected
                        ? "border-[#1E1D59] bg-[#F1F0FA]"
                        : "border-gray-200 bg-white hover:border-[#1E1D59] hover:bg-[#F1F0FA]"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold ${
                        selected
                          ? "bg-[#1E1D59] text-white"
                          : "bg-[#F1F0FA] text-[#1E1D59]"
                      }`}
                    >
                      {option.label}
                    </span>

                    <span className="pt-2 text-lg font-semibold leading-7">
                      {option.text}
                    </span>

                    {selected && (
                      <CheckCircle
                        className="ml-auto mt-2 shrink-0 text-[#1E1D59]"
                        size={24}
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 rounded-3xl bg-[#FBEFF4] p-6">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-1 text-[#632854]" size={26} />

                <div>
                  <h3 className="text-xl font-bold text-[#632854]">
                    Final quiz reminder
                  </h3>

                  <p className="mt-2 leading-7 text-gray-700">
                    This quiz is graded and timed. You have 30 minutes to
                    complete it — if time runs out, whatever you&apos;ve
                    answered so far is submitted automatically. Your final
                    score will be saved to your learner profile after
                    submission.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                className={`inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold ${
                  currentQuestionIndex === 0
                    ? "cursor-not-allowed text-gray-400"
                    : "hover:bg-gray-50"
                }`}
              >
                <ArrowLeft size={18} />
                Previous
              </button>

              <button
                type="button"
                onClick={handleNextQuestion}
                disabled={!selectedAnswer || savingResult}
                className={`inline-flex items-center gap-2 rounded-xl px-6 py-3 font-bold ${
                  selectedAnswer && !savingResult
                    ? "bg-[#1E1D59] text-white hover:bg-[#14123D]"
                    : "cursor-not-allowed bg-gray-200 text-gray-500"
                }`}
              >
                {currentQuestionIndex < questions.length - 1
                  ? "Next Question"
                  : savingResult
                  ? "Submitting..."
                  : "Submit Final Quiz"}
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

      <div className="absolute inset-0 bg-gradient-to-b from-[#F1F0FA]/90 via-white/80 to-gray-50" />

      <div className="relative mx-auto max-w-5xl">
        <Link
          href={`/courses/${courseSlug}`}
          className="inline-flex items-center gap-2 font-bold text-[#1E1D59]"
        >
          <ArrowLeft size={18} />
          Back to Course
        </Link>

        <div className="mt-5">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-[#1E1D59] shadow-sm">
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
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  warning?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl p-6 shadow-sm ${
        warning ? "bg-red-50" : "bg-white"
      }`}
    >
      <div
        className={`mb-4 flex items-center gap-3 ${
          warning ? "text-red-600" : "text-[#1E1D59]"
        }`}
      >
        {icon}
        <p
          className={`text-sm font-bold ${
            warning ? "text-red-500" : "text-gray-500"
          }`}
        >
          {label}
        </p>
      </div>

      <p
        className={`text-3xl font-extrabold ${
          warning ? "text-red-600" : "text-[#1E1D59]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ResultStat({
  label,
  value,
  suffix = "",
}: {
  label: string;
  value: number;
  suffix?: string;
}) {
  return (
    <div className="rounded-2xl bg-gray-50 p-6 text-center">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-2 text-4xl font-extrabold text-[#1E1D59]">
        {value}
        {suffix}
      </p>
    </div>
  );
}