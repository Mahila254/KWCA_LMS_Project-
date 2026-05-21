"use client";

import { useState } from "react";

type QuizQuestion = {
  question: string;
  options: string[];
  answer: string;
};

export default function Quiz({ questions }: { questions: QuizQuestion[] }) {
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>(
    {}
  );
  const [submitted, setSubmitted] = useState(false);

  const score = questions.reduce((total, question, index) => {
    return selectedAnswers[index] === question.answer ? total + 1 : total;
  }, 0);

  function handleSelect(questionIndex: number, option: string) {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  return (
    <div className="border rounded-3xl p-8">
      <h2 className="text-2xl font-bold mb-6 text-[#101828]">
        Lesson Quiz
      </h2>

      <div className="space-y-8">
        {questions.map((quiz, index) => {
          const selected = selectedAnswers[index];
          const isCorrect = selected === quiz.answer;

          return (
            <div key={quiz.question} className="border-b pb-6">
              <h3 className="font-bold mb-4 text-[#101828]">
                {index + 1}. {quiz.question}
              </h3>

              <div className="space-y-3">
                {quiz.options.map((option) => {
                  const isSelected = selected === option;
                  const isAnswer = quiz.answer === option;

                  let feedbackClass =
                    "border-gray-200 hover:bg-gray-50";

                  if (submitted && isSelected && isCorrect) {
                    feedbackClass =
                      "border-green-500 bg-green-50";
                  }

                  if (submitted && isSelected && !isCorrect) {
                    feedbackClass =
                      "border-red-500 bg-red-50";
                  }

                  if (submitted && isAnswer) {
                    feedbackClass =
                      "border-green-500 bg-green-50";
                  }

                  return (
                    <label
                      key={option}
                      className={`flex gap-3 border p-4 rounded-xl cursor-pointer ${feedbackClass}`}
                    >
                      <input
                        type="radio"
                        name={`question-${index}`}
                        checked={isSelected}
                        onChange={() => handleSelect(index, option)}
                        disabled={submitted}
                      />

                      <span className="text-gray-700">
                        {option}
                      </span>
                    </label>
                  );
                })}
              </div>

              {submitted && (
                <p
                  className={`mt-4 font-bold ${
                    isCorrect ? "text-green-700" : "text-red-700"
                  }`}
                >
                  {isCorrect
                    ? "Correct"
                    : `Incorrect. Correct answer: ${quiz.answer}`}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-6 bg-[#007F73] text-white px-6 py-3 rounded-xl font-bold"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6 rounded-xl bg-[#F2FBF8] p-5">
          <p className="font-bold text-[#101828]">
            Your Score: {score} / {questions.length}
          </p>
        </div>
      )}
    </div>
  );
}