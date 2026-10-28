export type AnswerLetter = "A" | "B" | "C" | "D";

/** One row in the attempts table on the quiz intro screen. */
export type QuizAttempt = {
  id: string;
  score: number;
  passed: boolean;
  createdAt: string;
  canReview?: boolean;
};

/** One question of a graded attempt, as saved by quiz-results/route.ts. */
export type ReviewItem = {
  questionId: string;
  question: string;
  options: Record<AnswerLetter, string>;
  selectedAnswer: string | null;
  correctAnswer: string;
  explanation?: string | null;
  isCorrect: boolean;
};

/** How a question's bubble looks in the question navigator. */
export type QuestionStatus = "unanswered" | "answered" | "correct" | "incorrect";

export type QuizLink = {
  href: string;
  label: string;
};
