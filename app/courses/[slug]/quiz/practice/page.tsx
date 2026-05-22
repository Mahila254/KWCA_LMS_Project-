"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  HelpCircle,
  RotateCcw,
  XCircle,
} from "lucide-react";

const questions = [
  {
    question: "What is a wildlife conservancy?",
    options: [
      "A private zoo for tourism",
      "A community or land-based conservation area managed for wildlife and livelihoods",
      "A government office for wildlife permits",
      "A place only used for farming",
    ],
    answer:
      "A community or land-based conservation area managed for wildlife and livelihoods",
    explanation:
      "A conservancy supports both biodiversity protection and community benefits through structured management.",
  },
  {
    question: "Why are conservancies important in Kenya?",
    options: [
      "They only attract tourists",
      "They help protect wildlife, support communities, and improve land management",
      "They replace national parks completely",
      "They are only used for livestock markets",
    ],
    answer:
      "They help protect wildlife, support communities, and improve land management",
    explanation:
      "Conservancies connect conservation, governance, community livelihoods, and sustainable land use.",
  },
  {
    question: "Who should be involved in conservancy leadership?",
    options: [
      "Only external donors",
      "Only tourism companies",
      "Community members, leaders, managers, women, youth, and stakeholders",
      "Only government officials",
    ],
    answer:
      "Community members, leaders, managers, women, youth, and stakeholders",
    explanation:
      "Strong conservancy leadership should include local voices and key stakeholders, especially women and youth.",
  },
];

export default function PracticeQuizPage() {
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

            <p className="font-bold text-[#007F73]">Practice Quiz</p>

            <h1 className="mt-3 text-5xl font-extrabold">
              Check Your Understanding
            </h1>

            <p className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              This practice quiz helps you review the lesson before taking the
              final graded quiz.
            </p>
          </div>
        </section>

        <section className="px-6 py-14">
          <div className="mx-auto max-w-4xl">
            {!showResult ? (
              <div className="rounded-3xl bg-white p-8 shadow-sm">
                <div className="mb-8 flex items-center justify-between gap-4">
                  <div>
                    <p className="font-bold text-[#007F73]">
                      Question {currentQuestion + 1} of {questions.length}
                    </p>

                    <h2 className="mt-3 text-3xl font-bold">
                      {question.question}
                    </h2>
                  </div>

                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                    <HelpCircle size={28} />
                  </div>
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

                {selectedAnswer && (
                  <div
                    className={`mt-6 rounded-2xl p-5 ${
                      selectedAnswer === question.answer
                        ? "bg-green-50 text-green-800"
                        : "bg-orange-50 text-orange-800"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      {selectedAnswer === question.answer ? (
                        <CheckCircle className="mt-1 shrink-0" size={22} />
                      ) : (
                        <XCircle className="mt-1 shrink-0" size={22} />
                      )}

                      <div>
                        <p className="font-bold">
                          {selectedAnswer === question.answer
                            ? "Correct"
                            : "Not quite"}
                        </p>

                        <p className="mt-1">{question.explanation}</p>
                      </div>
                    </div>
                  </div>
                )}

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
                    {isLastQuestion ? "Finish Quiz" : "Next Question"}
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#F2FBF8] text-[#007F73]">
                  <CheckCircle size={42} />
                </div>

                <p className="font-bold text-[#007F73]">
                  Practice Quiz Complete
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
                    Retake Practice Quiz
                  </button>

                  <Link
                    href={`/courses/${slug}/quiz/final`}
                    className="rounded-xl bg-[#007F73] px-6 py-3 font-bold text-white transition hover:bg-[#00665d]"
                  >
                    Continue to Final Quiz
                  </Link>
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