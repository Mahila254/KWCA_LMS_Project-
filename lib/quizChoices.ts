/**
 * A course quiz question has either four choices (A to D) or two (a
 * True/False question: A and B, with C and D left empty). Shared by the
 * admin quiz APIs and the admin forms.
 */

export const TRUE_FALSE_CHOICES = ["True", "False"] as const;

/** null when the choices and answer are fine, otherwise what's wrong. */
export function quizChoicesProblem(
  options: (string | null | undefined)[],
  correctAnswer: string | null | undefined
) {
  const [a, b, c, d] = options.map((option) => (option ?? "").trim());

  if (!a || !b) return "Choices A and B are required.";
  if (Boolean(c) !== Boolean(d)) {
    return "Fill in both C and D, or leave both empty for a True/False question.";
  }

  const answer = (correctAnswer ?? "").trim().toUpperCase();
  const available = c ? ["A", "B", "C", "D"] : ["A", "B"];
  if (!available.includes(answer)) {
    return c
      ? "The correct answer must be A, B, C or D."
      : "The correct answer must be A or B for a two-choice question.";
  }

  return null;
}
