"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

const questions = [
  {
    question: "What is the main purpose of a wildlife conservancy?",
    options: [
      "To protect wildlife only without community involvement",
      "To support conservation, governance, land management, and community livelihoods",
      "To replace all national parks",
      "To operate only as a tourism business",
    ],
    answer:
      "To support conservation, governance, land management, and community livelihoods",
  },
  {
    question: "Which group should be included in strong conservancy governance?",
    options: [
      "Only external consultants",
      "Only tourism investors",
      "Community leaders, women, youth, managers, and stakeholders",
      "Only government officials",
    ],
    answer: "Community leaders, women, youth, managers, and stakeholders",
  },
  {
    question: "Why are conservancies important for communities?",
    options: [
      "They remove communities from land",
      "They create opportunities for participation, livelihoods, and local conservation leadership",
      "They only focus on animals",
      "They stop all economic activities",
    ],
    answer:
      "They create opportunities for participation, livelihoods, and local conservation leadership",
  },
  {
    question: "What does effective conservancy management require?",
    options: [
      "Clear governance, planning, accountability, and community participation",
      "No leadership structure",
      "Only donor funding",
      "Only tourism marketing",
    ],
    answer:
      "Clear governance, planning, accountability, and community participation",
  },
];

export default function FinalQuizPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [answers, setAnswers] = useState<string[]>([]);
  const [showResult, setShowResult] = useState(false);

  const question = questions[currentQuestion];
  const isLastQuestion = currentQuestion === questions.length - 1;

  const score = answers.filter(
    (answer, index) => answer === questions[index].answer
  ).length;

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  function handleNext() {
    if (!selectedAnswer) {
      alert("Please select an answer before continuing.");
      return;
    }

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selectedAnswer;
    setAnswers(updatedAnswers);

    if (isLastQuestion) {
      setShowResult(true);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(updatedAnswers[currentQuestion + 1] || "");
    }
  }

  function handlePrevious() {
    if (currentQuestion === 0) return;

    const updatedAnswers = [...answers];
    updatedAnswers[currentQuestion] = selectedAnswer;
    setAnswers(updatedAnswers);

    setCurrentQuestion(currentQuestion - 1);
    setSelectedAnswer(updatedAnswers[currentQuestion - 1] || "");
  }

  function restartQuiz() {
    setCurrentQuestion(0);
    setSelectedAnswer("");
    setAnswers([]);
    setShowResult(false);
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#07122E]">
        <section className="bg-[#F2FBF8] px-6 py-12">
          <div className="mx-auto max-w-5xl">
            <Link
              href={`/courses/${slug}/lesson-1`}
              className="mb-6 inline-flex items-center gap-2 font-bold text-[#007F73]"
            >
              <ArrowLeft size={18} />
              Back to Lesson
            </Link>

            <p className="font-bold text-[#007F73]">Final Graded Quiz</p>

            <h1 className="mt-3 text-5xl font-extrabold">
              Complete the Course Assessment
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              This is the final quiz for the course. A score of 70% or above
              unlocks the certificate.
            </p>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-4xl">
            {!showResult ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8">
                  <p className="font-bold text-[#007F73]">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>

                  <h2 className="mt-3 text-3xl font-bold">
                    {question.question}
                  </h2>
                </div>

                <div className="space-y-4">
                  {question.options.map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => setSelectedAnswer(option)}
                      className={`w-full rounded-2xl border p-5 text-left font-semibold transition-all duration-300 hover:border-[#007F73] hover:bg-[#F2FBF8] ${
                        selectedAnswer === option
                          ? "border-[#007F73] bg-[#F2FBF8]"
                          : "border-gray-200 bg-white"
                      }`}
                    >
                      {option}
                    </button>
                  ))}
                </div>

                <div className="mt-8 flex flex-wrap justify-between gap-4">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentQuestion === 0}
                    className="rounded-xl border px-6 py-3 font-bold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white transition hover:bg-[#00665d]"
                  >
                    {isLastQuestion ? "Submit Final Quiz" : "Next Question"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <div
                  className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
                    passed
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {passed ? <Award size={42} /> : <XCircle size={42} />}
                </div>

                <p
                  className={`font-bold ${
                    passed ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {passed ? "Final Quiz Passed" : "Final Quiz Not Passed"}
                </p>

                <h2 className="mt-3 text-5xl font-extrabold">
                  Your Score: {percentage}%
                </h2>

                <p className="mt-4 text-lg text-gray-600">
                  You answered {score} out of {questions.length} questions
                  correctly.
                </p>

                <div className="mt-8 rounded-2xl bg-gray-50 p-6 text-left">
                  <h3 className="text-xl font-bold">Review</h3>

                  <div className="mt-5 space-y-4">
                    {questions.map((item, index) => {
                      const correct = answers[index] === item.answer;

                      return (
                        <div
                          key={item.question}
                          className="rounded-xl bg-white p-5"
                        >
                          <div className="flex items-start gap-3">
                            {correct ? (
                              <CheckCircle
                                className="mt-1 shrink-0 text-green-600"
                                size={20}
                              />
                            ) : (
                              <XCircle
                                className="mt-1 shrink-0 text-red-600"
                                size={20}
                              />
                            )}

                            <div>
                              <p className="font-bold">
                                {index + 1}. {item.question}
                              </p>

                              <p className="mt-2 text-sm text-gray-600">
                                Your answer: {answers[index]}
                              </p>

                              {!correct && (
                                <p className="mt-1 text-sm font-semibold text-green-700">
                                  Correct answer: {item.answer}
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
                    onClick={restartQuiz}
                    className="inline-flex items-center gap-2 rounded-xl border px-6 py-3 font-bold transition hover:bg-gray-50"
                  >
                    <RotateCcw size={18} />
                    Retake Final Quiz
                  </button>

                  {passed ? (
                    <Link
                      href={`/courses/${slug}/certificate`}
                      className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white transition hover:bg-[#00665d]"
                    >
                      Generate Certificate
                    </Link>
                  ) : (
                    <Link
                      href={`/courses/${slug}/quiz/practice`}
                      className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white transition hover:bg-[#00665d]"
                    >
                      Review Practice Quiz
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}