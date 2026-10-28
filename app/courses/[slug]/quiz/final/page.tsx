"use client";

import { useEffect, useRef, useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { authFetch } from "@/lib/authFetch";
import QuizHero from "@/components/quiz/QuizHero";
import QuizIntro from "@/components/quiz/QuizIntro";
import QuestionNavigator from "@/components/quiz/QuestionNavigator";
import type { QuestionStatus, QuizAttempt } from "@/components/quiz/types";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  BookOpen,
  CheckCircle,
  ClipboardList,
  Clock,
  Lock,
  MessageSquare,
  RotateCcw,
  ShieldCheck,
  Star,
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

type ExistingFinalResult = {
  score: number;
  createdAt: string;
};

const QUIZ_DURATION_SECONDS = 30 * 60;
const PASS_MARK = 70;

export default function FinalQuizPage() {
  const params = useParams<{ slug: string }>();
  const courseSlug = params.slug;

  const [course, setCourse] = useState<Course | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [loading, setLoading] = useState(true);

  // A learner who already passed this final quiz on an earlier visit sees
  // that on the intro screen (with their certificate link) instead of
  // being dropped into a blank quiz — that's how duplicate "final quiz"
  // attempts used to pile up. A new attempt only starts when they choose.
  const [existingResult, setExistingResult] =
    useState<ExistingFinalResult | null>(null);
  const [checkingExistingResult, setCheckingExistingResult] = useState(true);

  const [signedIn, setSignedIn] = useState(false);
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [attemptsLoading, setAttemptsLoading] = useState(true);

  // "intro" shows the rules and past attempts; the timer only starts once
  // the learner clicks Start and the stage becomes "quiz".
  const [stage, setStage] = useState<"intro" | "quiz">("intro");

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  // One entry per question: "A".."D", or "" while unanswered. Answers can
  // be changed freely until the quiz is submitted.
  const [answers, setAnswers] = useState<string[]>([]);
  const [completed, setCompleted] = useState(false);

  const [finalScore, setFinalScore] = useState(0);
  const [finalPercentage, setFinalPercentage] = useState(0);
  const [passed, setPassed] = useState(false);

  const [resultSaved, setResultSaved] = useState(false);
  const [savingResult, setSavingResult] = useState(false);

  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const autoSubmittedRef = useRef(false);

  const [feedbackRating, setFeedbackRating] = useState(0);
  const [feedbackComment, setFeedbackComment] = useState("");
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedbackSkipped, setFeedbackSkipped] = useState(false);
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

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

  // Loads whether this learner already passed (for the intro notice and
  // certificate link) and their list of earlier attempts. Bumping
  // attemptsVersion after a submission reloads them.
  const [attemptsVersion, setAttemptsVersion] = useState(0);

  useEffect(() => {
    async function loadLearnerResults() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        setSignedIn(Boolean(user));

        if (!user) {
          return;
        }

        const [statusResponse, attemptsResponse] = await Promise.all([
          authFetch(`/api/courses/${courseSlug}/learner-status`),
          authFetch(`/api/courses/${courseSlug}/quiz-results?type=FINAL`),
        ]);

        const status = await statusResponse.json();

        if (statusResponse.ok && status?.finalQuizResult) {
          setExistingResult({
            score: status.finalQuizResult.score,
            createdAt: status.finalQuizResult.createdAt,
          });
        }

        const attemptData = await attemptsResponse.json();

        if (attemptsResponse.ok) {
          setAttempts(attemptData.attempts || []);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setCheckingExistingResult(false);
        setAttemptsLoading(false);
      }
    }

    if (courseSlug) {
      loadLearnerResults();
    }
  }, [courseSlug, attemptsVersion]);

  // Ticks the 30-minute quiz timer down while the quiz is being taken.
  // Stops automatically once the quiz is completed (submitted).
  useEffect(() => {
    if (stage !== "quiz" || completed) return;

    const interval = setInterval(() => {
      setTimeLeft((current) => (current > 0 ? current - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [stage, completed]);

  // Auto-submits whatever has been answered so far the moment the timer
  // hits zero, so a learner who runs out of time still gets a graded
  // result instead of losing their progress.
  useEffect(() => {
    if (stage !== "quiz") return;
    if (timeLeft > 0 || completed || autoSubmittedRef.current) return;

    autoSubmittedRef.current = true;
    submitFinalQuiz(answers);
  }, [timeLeft, completed, stage]);

  function startQuiz() {
    setCurrentQuestionIndex(0);
    setAnswers(questions.map(() => ""));
    setCompleted(false);
    setFinalScore(0);
    setFinalPercentage(0);
    setPassed(false);
    setResultSaved(false);
    setSavingResult(false);
    setTimeLeft(QUIZ_DURATION_SECONDS);
    autoSubmittedRef.current = false;
    setFeedbackRating(0);
    setFeedbackComment("");
    setFeedbackSubmitted(false);
    setFeedbackSkipped(false);
    setStage("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
      window.scrollTo({ top: 0, behavior: "smooth" });

      setAttemptsVersion((version) => version + 1);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your quiz result.");
    } finally {
      setSavingResult(false);
    }
  }

  async function submitCourseFeedback() {
    if (feedbackRating < 1) {
      alert("Please select a star rating before submitting.");
      return;
    }

    try {
      setSubmittingFeedback(true);

      const response = await authFetch(`/api/courses/${courseSlug}/feedback`, {
        method: "POST",
        body: JSON.stringify({
          rating: feedbackRating,
          comment: feedbackComment,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || "Something went wrong while saving your feedback.");
        return;
      }

      setFeedbackSubmitted(true);
    } catch (error) {
      console.error(error);
      alert("Something went wrong while saving your feedback.");
    } finally {
      setSubmittingFeedback(false);
    }
  }

  // Submit from the last question or the navigator panel. Unanswered
  // questions are allowed but count as wrong, so ask first.
  async function handleSubmit() {
    const unanswered = answers.filter((answer) => !answer).length;

    const message =
      unanswered > 0
        ? `You have ${unanswered} unanswered question${
            unanswered === 1 ? "" : "s"
          }. They will be marked wrong. Submit anyway?`
        : "Submit your final quiz? You can't change your answers afterwards.";

    if (!window.confirm(message)) return;

    await submitFinalQuiz(answers);
  }

  function handleRetakeQuiz() {
    startQuiz();
  }

  function formatTimeLeft(totalSeconds: number) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  }

  if (loading || checkingExistingResult) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-gray-50 px-6 py-20 text-center text-[#1E1D59]">
          <div className="mx-auto max-w-2xl rounded-3xl bg-white p-10 shadow-sm">
            <div className="mx-auto mb-6 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-[#F5DCE6] text-[#632854]">
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

  if (stage === "intro" && !completed) {
    const passedOn = existingResult
      ? new Date(existingResult.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : null;

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

          <section className="mx-auto max-w-6xl px-6 pb-16 pt-4">
            <QuizIntro
              notice={
                existingResult && (
                  <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-[#1E1D59] p-6 text-white sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/10">
                        <Trophy size={24} />
                      </span>
                      <div>
                        <p className="font-bold">
                          You&apos;ve already passed this quiz with{" "}
                          {existingResult.score}%
                        </p>
                        <p className="text-sm text-white/70">
                          Completed on {passedOn}. No need to take it again —
                          your certificate is ready.
                        </p>
                      </div>
                    </div>

                    <Link
                      href={`/courses/${courseSlug}/certificate`}
                      className="inline-flex shrink-0 items-center gap-2 self-start rounded-full bg-white px-5 py-3 text-sm font-bold text-[#1E1D59] hover:bg-gray-100 sm:self-auto"
                    >
                      <Award size={17} />
                      View Certificate
                    </Link>
                  </div>
                )
              }
              rules={[
                "This is the graded final quiz. Your score is saved to your learner profile and decides whether you receive the course certificate.",
                <>
                  There {questions.length === 1 ? "is" : "are"}{" "}
                  <strong>{questions.length}</strong> question
                  {questions.length === 1 ? "" : "s"} and you have{" "}
                  <strong>30 minutes</strong>. The timer starts when you click
                  Start, and whatever you&apos;ve answered is submitted
                  automatically when time runs out.
                </>,
                <>
                  You need <strong>{PASS_MARK}%</strong> or higher to pass.
                  You can retake the quiz if you don&apos;t pass.
                </>,
                "Use the question panel to move between questions and change your answers until you submit.",
                "Before you click Start, make sure you have enough time to finish the quiz in one sitting.",
              ]}
              startLabel={
                existingResult
                  ? "Retake Quiz"
                  : attempts.length > 0
                  ? "Start a New Attempt"
                  : "Start Quiz"
              }
              onStart={startQuiz}
              attempts={attempts}
              attemptsLoading={attemptsLoading}
              signedIn={signedIn}
              loginHref="/login"
              previous={{
                href: `/courses/${courseSlug}/quiz/practice`,
                label: "Practice Quiz",
              }}
              next={
                existingResult
                  ? {
                      href: `/courses/${courseSlug}/certificate`,
                      label: "Course Certificate",
                    }
                  : {
                      href: `/courses/${courseSlug}`,
                      label: "Back to Course",
                    }
              }
            />
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

              <div className="grid grid-cols-2 gap-3 p-8 sm:gap-6 md:grid-cols-4">
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

                {!feedbackSkipped && (
                  <div className="mt-8 rounded-3xl bg-gray-50 p-6">
                    {feedbackSubmitted ? (
                      <div className="flex items-start gap-4">
                        <CheckCircle
                          className="mt-1 shrink-0 text-green-600"
                          size={28}
                        />
                        <div>
                          <h3 className="text-xl font-bold">
                            Thanks for your feedback!
                          </h3>
                          <p className="mt-2 leading-7 text-gray-600">
                            It helps KWCA improve this course for future
                            learners.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start gap-4">
                          <MessageSquare
                            className="mt-1 shrink-0 text-[#632854]"
                            size={28}
                          />
                          <div>
                            <h3 className="text-xl font-bold">
                              How was this course?
                            </h3>
                            <p className="mt-2 leading-7 text-gray-600">
                              Rate your experience and, if you&apos;d like,
                              tell us more. This is optional.
                            </p>
                          </div>
                        </div>

                        <div className="mt-5 flex items-center justify-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setFeedbackRating(star)}
                              aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                              className="transition hover:scale-110"
                            >
                              <Star
                                size={36}
                                className={
                                  star <= feedbackRating
                                    ? "fill-[#632854] text-[#632854]"
                                    : "fill-transparent text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>

                        <textarea
                          value={feedbackComment}
                          onChange={(event) =>
                            setFeedbackComment(event.target.value)
                          }
                          placeholder="Share any feedback about this course (optional)..."
                          rows={4}
                          maxLength={2000}
                          className="mt-5 w-full rounded-2xl border bg-white p-4 outline-none focus:border-[#1E1D59]"
                        />

                        <div className="mt-4 flex flex-wrap justify-center gap-3">
                          <button
                            type="button"
                            onClick={() => setFeedbackSkipped(true)}
                            className="rounded-full border px-6 py-3 font-bold hover:bg-white"
                          >
                            Skip
                          </button>

                          <button
                            type="button"
                            onClick={submitCourseFeedback}
                            disabled={submittingFeedback || feedbackRating < 1}
                            className={`rounded-full px-6 py-3 font-bold ${
                              submittingFeedback || feedbackRating < 1
                                ? "cursor-not-allowed bg-gray-200 text-gray-500"
                                : "bg-[#632854] text-white hover:bg-[#4F2043]"
                            }`}
                          >
                            {submittingFeedback
                              ? "Submitting..."
                              : "Submit Feedback"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}

                <div className="mt-8 flex flex-wrap justify-center gap-4">
                  <button
                    type="button"
                    onClick={handleRetakeQuiz}
                    className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <RotateCcw size={18} />
                    Retake Quiz
                  </button>

                  <Link
                    href={`/courses/${courseSlug}`}
                    className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50"
                  >
                    <BookOpen size={18} />
                    Back to Course
                  </Link>

                  {passed && (
                    <Link
                      href={`/courses/${courseSlug}/certificate`}
                      className="inline-flex items-center gap-2 rounded-full bg-[#1E1D59] px-6 py-3 font-bold text-white hover:bg-[#14123D]"
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
  const selectedAnswer = answers[currentQuestionIndex] || "";
  const isLast = currentQuestionIndex === questions.length - 1;

  const answerOptions = [
    { label: "A", text: currentQuestion.optionA },
    { label: "B", text: currentQuestion.optionB },
    { label: "C", text: currentQuestion.optionC },
    { label: "D", text: currentQuestion.optionD },
  ];

  const statuses: QuestionStatus[] = questions.map((_, index) =>
    answers[index] ? "answered" : "unanswered"
  );

  function selectAnswer(answer: string) {
    setAnswers((previous) => {
      const updated = [...previous];
      updated[currentQuestionIndex] = answer;
      return updated;
    });
  }

  const timer = (
    <div
      className={`flex items-center justify-between rounded-2xl px-4 py-3 ${
        timeLeft <= 300 ? "bg-red-50 text-red-600" : "bg-gray-50 text-[#1E1D59]"
      }`}
    >
      <span className="flex items-center gap-2 text-sm font-bold">
        <Clock size={17} />
        Time left
      </span>
      <span className="text-xl font-extrabold tabular-nums">
        {formatTimeLeft(timeLeft)}
      </span>
    </div>
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

        <section className="mx-auto grid max-w-6xl items-start gap-6 px-6 pb-16 pt-4 lg:grid-cols-[1fr_17rem]">
          <div className="lg:order-2">
            <QuestionNavigator
              statuses={statuses}
              current={currentQuestionIndex}
              onSelect={setCurrentQuestionIndex}
              footer={
                <div className="space-y-3">
                  {timer}

                  <p className="flex items-center gap-2 text-sm font-semibold text-gray-500">
                    <ShieldCheck size={16} className="text-[#632854]" />
                    Pass mark: {PASS_MARK}%
                  </p>

                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={savingResult}
                    className="w-full rounded-full bg-[#632854] px-5 py-3 text-sm font-bold text-white hover:bg-[#4F2043] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {savingResult ? "Submitting..." : "Submit Quiz"}
                  </button>
                </div>
              }
            />
          </div>

          <div
            key={currentQuestionIndex}
            className="animate-page-enter rounded-3xl bg-white p-6 shadow-sm sm:p-8 lg:order-1"
          >
            <div className="rounded-3xl bg-[#F1F0FA] p-6 sm:p-8">
              <p className="mb-3 inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-[#1E1D59]">
                <Lock size={15} />
                Question {currentQuestionIndex + 1} of {questions.length}
              </p>

              <h2 className="text-2xl font-extrabold leading-tight sm:text-3xl">
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
                    onClick={() => selectAnswer(option.label)}
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

            <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                disabled={currentQuestionIndex === 0}
                className="inline-flex items-center gap-2 rounded-full border px-6 py-3 font-bold hover:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-400 disabled:hover:bg-transparent"
              >
                <ArrowLeft size={18} />
                Previous
              </button>

              {isLast ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={savingResult}
                  className="inline-flex items-center gap-2 rounded-full bg-[#632854] px-6 py-3 font-bold text-white hover:bg-[#4F2043] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {savingResult ? "Submitting..." : "Submit Final Quiz"}
                  <ArrowRight size={18} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
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
    <div className="rounded-2xl bg-gray-50 p-4 text-center sm:p-6">
      <p className="text-sm font-bold text-gray-500">{label}</p>

      <p className="mt-2 text-4xl font-extrabold text-[#1E1D59]">
        {value}
        {suffix}
      </p>
    </div>
  );
}
