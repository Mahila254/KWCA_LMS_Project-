"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import QuizHero from "@/components/quiz/QuizHero";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuizReview from "@/components/quiz/QuizReview";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import type {
  AnswerLetter,
  QuestionStatus,
  QuizAttempt,
  ReviewItem,
} from "@/components/quiz/types";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  XCircle,
  RotateCcw,
  HelpCircle,
  ClipboardList,
  BookOpen,
  Eye,
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

type LessonLink = {
  title: string;
  slug: string;
  order: number;
};

// intro: "what to expect" + past attempts. quiz: answering. results: the
// score card. review: every question with right/wrong marked.
type Stage = "intro" | "quiz" | "results" | "review";

type Review = {
  results: ReviewItem[];
  score: number;
  submittedAt?: string;
};

function toReviewItems(questions: QuizQuestion[], answers: string[]): ReviewItem[] {
  return questions.map((question, index) => {
    const selectedAnswer = answers[index] || null;

    return {
      questionId: question.id,
      question: question.question,
      options: {
        A: question.optionA,
        B: question.optionB,
        C: question.optionC,
        D: question.optionD,
      },
      selectedAnswer,
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      isCorrect: selectedAnswer === question.correctAnswer,
    };
  });
}

export default function PracticeQuizPage() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<LessonLink[]>([]);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  const [signedIn, setSignedIn] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState<string | null>(null);

  const [stage, setStage] = useState<Stage>("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // One entry per question: "A".."D", or "" while unanswered. A practice
  // answer is final once picked, because feedback shows straight away.
  const [answers, setAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [review, setReview] = useState<Review | null>(null);

  useEffect(() => {
    async function fetchPracticeQuestions() {
      try {
        const response = await fetch(
          `/api/courses/${courseSlug}/quiz-questions?type=PRACTICE`
        );

        const data = await response.json();

        if (!response.ok) {
          alert(data.error || "Something went wrong while loading quiz.");
          return;
        }

        setCourse(data.course);
        setLessons(data.lessons || []);

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

  // Bumped after a submission to reload the attempts list.
  const [attemptsVersion, setAttemptsVersion] = useState(0);

  useEffect(() => {
    async function loadAttempts() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setSignedIn(Boolean(user));

        if (!user) return;

        const response = await authFetch(
          `/api/courses/${courseSlug}/quiz-results?type=PRACTICE`
        );
        const data = await response.json();

        if (response.ok) {
          setAttempts(data.attempts || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setAttemptsLoading(false);
      }
    }

    if (courseSlug) {
      loadAttempts();
    }
  }, [courseSlug, attemptsVersion]);

  function startQuiz() {
    setAnswers(questions.map(() => ""));
    setCurrentQuestionIndex(0);
    setReview(null);
    setStage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function openSavedReview(attemptId: string) {
    try {
      setReviewingId(attemptId);

      const response = await authFetch(
        `/api/courses/${courseSlug}/quiz-results/${attemptId}`
      );
      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "This attempt can't be reviewed.");
        return;
      }

      setReview({
        results: data.attempt.results,
        score: data.attempt.score,
        submittedAt: data.attempt.createdAt,
      });
      setStage("review");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      console.error(error);
      alert("Something went wrong while opening this review.");
    } finally {
      setReviewingId(null);
    }
  }

  // Grades locally (practice questions come with their answers), then
  // saves the attempt for signed-in learners so it shows in the attempts
  // table and can be reviewed later. Not being signed in only skips the
  // save; the learner still gets their score and review.
  async function finishQuiz() {
    const unanswered = answers.filter((answer) => !answer).length;

    if (
      unanswered > 0 &&
      !window.confirm(
        `You have ${unanswered} unanswered question${
          unanswered === 1 ? "" : "s"
        }. Finish anyway?`
      )
    ) {
      return;
    }

    const results = toReviewItems(questions, answers);
    const correct = results.filter((item) => item.isCorrect).length;
    const score = Math.round((correct / questions.length) * 100);

    setReview({ results, score });
    setStage("results");
    window.scrollTo({ top: 0, behavior: "smooth" });

    if (!signedIn) return;

    try {
      setSaving(true);

      const response = await authFetch(`/api/courses/${courseSlug}/quiz-results`, {
        method: "POST",
        body: JSON.stringify({
          quizType: "PRACTICE",
          answers: questions.map((question, index) => ({
            questionId: question.id,
            selectedAnswer: answers[index] || null,
          })),
        }),
      });

      if (response.ok) {
        const data = await response.json();

        // Prefer the server's grading, in case the questions changed
        // while the learner was taking the quiz.
        if (Array.isArray(data.results)) {
          setReview({ results: data.results, score: data.score });
        }

        setAttemptsVersion((version) => version + 1);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  }

  const lastLesson = lessons[lessons.length - 1];
  const previousLink = lastLesson
    ? {
        href: `/courses/${courseSlug}/${lastLesson.slug}`,
        label: lastLesson.title,
      }
    : null;
  const nextLink = {
    href: `/courses/${courseSlug}/quiz/final`,
    label: "Final Quiz",
  };

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-20 text-center text-[#1E1D59]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#F1F0FA] text-[#1E1D59]">
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

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz"
            subtitle="Test your understanding before moving to the final quiz."
          />

          <section className="mx-auto max-w-3xl px-6 py-10">
            <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F1F0FA] text-[#1E1D59]">
                <HelpCircle size={32} />
              </div>

              <h2 className="text-3xl font-bold">No practice questions yet</h2>

              <p className="mt-3 text-gray-600">
                Practice quiz questions added by the admin will appear here.
              </p>

              <Link
                href={`/courses/${courseSlug}`}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
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

  if (stage === "intro") {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz"
            subtitle="Check your understanding before the final graded quiz."
          />

          <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
            <QuizIntro
              rules={[
                "This ungraded practice quiz has been designed to help you prepare for the final graded quiz.",
                <>
                  There {questions.length === 1 ? "is" : "are"}{" "}
                  <strong>{questions.length}</strong> question
                  {questions.length === 1 ? "" : "s"}. You&apos;ll see whether
                  each answer is right straight away, with an explanation.
                </>,
                "There is no time limit, and you can take it as many times as you like.",
                "When you finish, use Review to go through every question and see which ones you passed and which ones to revisit.",
              ]}
              startLabel={attempts.length > 0 ? "Start a New Attempt" : "Start Quiz"}
              onStart={startQuiz}
              attempts={attempts}
              attemptsLoading={attemptsLoading}
              signedIn={signedIn}
              loginHref="/login"
              onReview={openSavedReview}
              reviewingId={reviewingId}
              previous={previousLink}
              next={nextLink}
            />
          </section>
        </main>

        <Footer />
      </>
    );
  }

  if (stage === "review" && review) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz Review"
            subtitle="See which questions you got right, which ones you missed, and why."
          />

          <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
            <QuizReview
              results={review.results}
              score={review.score}
              submittedAt={review.submittedAt}
              actions={
                <>
                  <button
                    type="button"
                    onClick={() => setStage("intro")}
                    className="inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <ArrowLeft size={18} />
                    Back to Quiz Overview
                  </button>

                  <button
                    type="button"
                    onClick={startQuiz}
                    className="inline-flex items-center gap-2 rounded-full border bg-white px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <RotateCcw size={18} />
                    Retake Quiz
                  </button>

                  <Link
                    href={nextLink.href}
                    className="inline-flex items-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
                  >
                    Continue to Final Quiz
                    <ArrowRight size={18} />
                  </Link>
                </>
              }
            />
          </section>
        </main>

        <Footer />
      </>
    );
  }

  if (stage === "results" && review) {
    const correct = review.results.filter((item) => item.isCorrect).length;

    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
          <QuizHero
            courseTitle={course?.title || "Course"}
            courseSlug={courseSlug}
            title="Practice Quiz Complete"
            subtitle="You have completed the practice quiz. Review your answers, or continue to the final graded quiz."
          />

          <section className="mx-auto max-w-4xl px-6 pb-16 pt-4">
            <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
              <div className="bg-[#1E1D59] px-8 py-10 text-center text-white">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white/10">
                  <Trophy size={42} />
                </div>

                <h2 className="text-4xl font-extrabold">Your Score</h2>

                <p className="mt-6 text-7xl font-extrabold text-[#D9D3EC]">
                  {review.score}%
                </p>

                <p className="mt-4 text-lg text-white/75">
                  You answered {correct} out of {review.results.length}{" "}
                  questions correctly.
                </p>

                <p className="mt-3 text-sm font-semibold text-white/60">
                  {!signedIn
                    ? "Log in next time to save your attempts."
                    : saving
                    ? "Saving your attempt..."
                    : "Saved — you can review this attempt any time."}
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 p-8 sm:gap-6">
                <ResultStat label="Questions" value={review.results.length} />
                <ResultStat label="Correct" value={correct} />
                <ResultStat
                  label="Review Needed"
                  value={review.results.length - correct}
                />
              </div>

              <div className="flex flex-wrap justify-center gap-3 border-t p-8">
                <button
                  type="button"
                  onClick={() => {
                    setStage("review");
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-[#632854] px-6 py-3 font-bold text-white hover:bg-[#4F2043]"
                >
                  <Eye size={18} />
                  Review Answers
                </button>

                <button
                  type="button"
                  onClick={startQuiz}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  <RotateCcw size={18} />
                  Retake Quiz
                </button>

                <Link
                  href={`/courses/${courseSlug}`}
                  className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                >
                  Back to Course
                  <BookOpen size={18} />
                </Link>

                <Link
                  href={nextLink.href}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
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

  // stage === "quiz"
  const currentQuestion = questions[currentQuestionIndex];
  const selectedAnswer = answers[currentQuestionIndex] || "";
  const showFeedback = Boolean(selectedAnswer);
  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
  const isLast = currentQuestionIndex === questions.length - 1;

  const answerOptions: { label: AnswerLetter; text: string }[] = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
  ];

  const statuses: QuestionStatus[] = questions.map((question, index) => {
    if (!answers[index]) return "unanswered";
    return answers[index] === question.correctAnswer ? "correct" : "incorrect";
  });

  const score = statuses.filter((status) => status === "correct").length;

  function handleSelectAnswer(answer: string) {
    if (showFeedback) return;

    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  }

  function goTo(index: number) {
    setCurrentQuestionIndex(index);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <QuizHero
          courseTitle={course?.title || "Course"}
          courseSlug={courseSlug}
          title="Practice Quiz"
          subtitle="Answer each question and get instant feedback to strengthen your understanding."
        />

        <section className="mx-auto grid max-w-6xl items-start gap-6 px-6 pb-16 pt-4 lg:grid-cols-[1fr_17rem]">
          <div className="lg:order-2">
            <QuestionNavigator
              statuses={statuses}
              current={currentQuestionIndex}
              onSelect={goTo}
              footer={
                <p className="text-sm font-semibold text-gray-500">
                  Score so far:{" "}
                  <span className="text-[#1E1D59]">
                    {score} / {questions.length}
                  </span>
                </p>
              }
            />
          </div>

          <div
            key={currentQuestionIndex}
            className="animate-page-enter rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:order-1"
          >
            <div className="rounded-3xl bg-[#F1F0FA] p-6 sm:p-8">
              <p className="mb-3 text-sm font-extrabold uppercase tracking-wide text-[#1E1D59]">
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>

              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="mt-8 grid gap-4">
              {answerOptions.map((option) => {
                const selected = selectedAnswer === option.label;
                const correct = currentQuestion.correctAnswer === option.label;

                let optionClass =
                  "border-gray-200 bg-white hover:border-[#1E1D59] hover:bg-[#F1F0FA]";

                if (showFeedback && correct) {
                  optionClass = "border-green-500 bg-green-50";
                } else if (showFeedback && selected && !correct) {
                  optionClass = "border-red-500 bg-red-50";
                } else if (showFeedback) {
                  optionClass = "border-gray-200 bg-white opacity-70";
                }

                return (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => handleSelectAnswer(option.label)}
                    disabled={showFeedback}
                    className={`flex items-start gap-4 rounded-2xl border p-5 text-left transition ${optionClass}`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-extrabold ${
                        showFeedback && correct
                          ? "bg-green-600 text-white"
                          : showFeedback && selected && !correct
                          ? "bg-red-600 text-white"
                          : "bg-[#F1F0FA] text-[#1E1D59]"
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
                className={`mt-8 animate-page-enter rounded-3xl p-6 ${
                  isCorrect ? "bg-green-50" : "bg-red-50"
                }`}
              >
                <div className="flex items-start gap-3">
                  {isCorrect ? (
                    <CheckCircle className="mt-1 shrink-0 text-green-600" size={28} />
                  ) : (
                    <XCircle className="mt-1 shrink-0 text-red-600" size={28} />
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
              <button
                type="button"
                onClick={() => goTo(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                <ArrowLeft size={18} />
                Previous
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={finishQuiz}
                  className="inline-flex items-center gap-2 rounded-full bg-[#632854] px-6 py-3 font-bold text-white hover:bg-[#4F2043]"
                >
                  Finish Quiz
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => goTo(currentQuestionIndex + 1)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
                >
                  Next Question
                  <ArrowRight size={18} />
                </button>
              )}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}

function ResultStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-gray-50 p-4 text-center sm:p-6">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-2 text-4xl font-extrabold text-[#1E1D59]">{value}</p>
    </div>
  );
}
