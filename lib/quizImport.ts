/**
 * Reads quiz questions pasted as text, the way they usually come out of
 * Claude, Word or a document, into the four-choice questions the quiz uses:
 *
 *   1. Who elects the conservancy board?
 *   A. The county government
 *   B. The members, at the AGM
 *   C. KWS
 *   D. The tourism partner
 *   Answer: B
 *   Explanation: Members elect the board at the annual general meeting.
 *
 * Forgiving about the details: "Q1." or "Question 1:" numbering, a) / (a) /
 * A) choice letters, choices on one line, "Correct answer:" / "Ans:", an
 * answer given as the choice's text, a ✓ or "(correct)" on the right
 * choice, "Hint:" / "Reason:" for the explanation, and **bold** or bullet
 * marks left over from copying.
 */

export type ImportedQuestion = {
  question: string;
  options: string[];
  /** "A".."D", or null if it couldn't be worked out. */
  correctAnswer: "A" | "B" | "C" | "D" | null;
  explanation: string;
  /** The number it was given in the paste ("7." → 7), if any. */
  number: number | null;
  /** From a "Practice Quiz" / "Final Quiz" heading above it, if any. */
  quizType: "PRACTICE" | "FINAL" | null;
  /** Why it can't be added as it is. Empty when it's ready. */
  problems: string[];
};

const LETTERS = ["A", "B", "C", "D"] as const;

const questionStart =
  /^(?:q(?:uestion)?\s*)?(\d{1,3})\s*(?:[.):\-–]\s*|\s+(?=[A-Z]))(.*)$/i;
const questionWordOnly = /^q(?:uestion)?\s*(\d{1,3})\s*[.):\-–]?\s*$/i;
const optionStart = /^\(?([a-d])\s*[.)\]:]\s*(.+)$/i;
const answerLine =
  /^(?:the\s+)?(?:correct\s+(?:answer|option|choice)|answer|ans|correct|key)\s*(?:is)?\s*[:\-–—=]\s*(.+)$/i;
const explanationLine =
  /^(?:explanation|explain|hint|reason|rationale|why|feedback|because)\s*[:\-–—]\s*(.*)$/i;
const correctMark = /\s*(?:✓|✔|✅|\(correct\)|\[correct\]|\*correct\*|←\s*correct|\(answer\))\s*$/i;

// "Practice Quiz (10 questions)", "Final Quiz" … starts a section; the
// questions under it go to that quiz.
const sectionHeading = /^(practice|final)\s+(?:quiz|test|exam|assessment)\b/i;
// "Final quiz answer key (instructor only)" starts an answer key: rows of
// number, letter and an optional reason, filled into that section's
// questions by number.
const answerKeyHeading = /\banswer\s+key\b|^answers\s*:?$/i;
const answerKeyRow = /^#?\s*(\d{1,3})\s*[.):|\-–]?\s*\(?(true|false|[a-dtf])\)?(?=$|[\s.):|\-–])[\s.):|\-–]*(.*)$/i;

// True/False: a "True" or "False" line is a choice, an answer of True/False
// (or T/F) with no choices listed makes the choices True and False, and a
// "(True/False)" tag after the question is dropped.
const trueFalseChoice = /^(?:\(?[ab]\s*[.)\]:]\s*)?(true|false)\.?$/i;
const trueFalseAnswer = /^(true|false|t|f)\b/i;
const trueFalseTag = /\s*[([]\s*(?:true\s*(?:\/|or)\s*false|t\s*\/\s*f)\s*[)\]]\.?\s*$/i;

/** Removes the marks copying leaves behind: **bold**, bullets, ## headings. */
function clean(line: string) {
  return line
    .replace(/\*\*|__|\+\+/g, "")
    .replace(/^\s*(?:[-*•▪◦]|#{1,6})\s+/, "")
    .replace(/[ \t]+/g, " ")
    .trim();
}

function comparable(text: string) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

/** "B", "(b)", "B) The members", or the choice's own words → "B". */
function resolveAnswer(value: string, options: string[]) {
  const letter = value.match(/^\(?([a-d])\)?(?=$|[\s.):,-])/i)?.[1]?.toUpperCase();
  const rest = letter
    ? value.replace(/^\(?[a-d]\)?[.):,]?\s*/i, "")
    : value;

  if (letter) {
    // "B. Because members elect..." → the words after the letter may be
    // the choice again, or a reason.
    const restIsOption =
      rest && comparable(rest) === comparable(options[LETTERS.indexOf(letter as never)] ?? "");
    return { letter, extra: restIsOption ? "" : rest.replace(/^[\s\-–—:]+/, "") };
  }

  const target = comparable(value);
  const exact = options.findIndex((option) => comparable(option) === target);
  if (exact >= 0) return { letter: LETTERS[exact], extra: "" };

  const partial = options.findIndex(
    (option) => target && comparable(option).startsWith(target)
  );
  return { letter: partial >= 0 ? LETTERS[partial] : null, extra: "" };
}

export function parseQuizText(text: string): ImportedQuestion[] {
  const questions: ImportedQuestion[] = [];
  let current: ImportedQuestion | null = null;
  let answerText: string | null = null;
  let inExplanation = false;
  // True while the current question had no number of its own.
  let provisional = false;
  let section: ImportedQuestion["quizType"] = null;
  // Set while reading an answer key, to the section it answers.
  let answerKeyFor: ImportedQuestion["quizType"] | "none" | undefined;

  const finish = () => {
    if (!current) return;

    if (current.options.length === 0 && answerText && trueFalseAnswer.test(answerText)) {
      current.options = ["True", "False"];
    }

    if (answerText !== null) {
      const { letter, extra } = resolveAnswer(answerText, current.options);
      if (letter) current.correctAnswer = letter as ImportedQuestion["correctAnswer"];
      if (extra && !current.explanation) current.explanation = extra;
    }

    current.question = current.question.replace(trueFalseTag, "").trim();
    current.explanation = current.explanation.trim();

    questions.push(current);
    current = null;
    answerText = null;
    inExplanation = false;
  };

  const start = (questionText: string, number: number | null = null) => {
    finish();
    current = {
      question: questionText,
      options: [],
      correctAnswer: null,
      explanation: "",
      number,
      quizType: section,
      problems: [],
    };
  };

  const handle = (line: string) => {
    // A heading, not a sentence that mentions the key ("The answer key is
    // at the end.").
    if (answerKeyHeading.test(line) && line.length <= 60 && !/[.!?]$/.test(line)) {
      finish();
      const named = line.match(/\b(practice|final)\b/i)?.[1];
      answerKeyFor = named ? (named.toUpperCase() as "PRACTICE" | "FINAL") : (section ?? "none");
      return;
    }

    const heading = line.match(sectionHeading);
    if (heading) {
      finish();
      section = heading[1].toUpperCase() as "PRACTICE" | "FINAL";
      answerKeyFor = undefined;
      provisional = false;
      return;
    }

    if (answerKeyFor !== undefined) {
      const row = line.match(answerKeyRow);
      if (row) {
        const target = questions.find(
          (item) =>
            item.number === Number(row[1]) &&
            (answerKeyFor === "none" || item.quizType === answerKeyFor)
        );
        if (target) {
          if (target.options.length === 0 && trueFalseAnswer.test(row[2])) {
            target.options = ["True", "False"];
          }
          target.correctAnswer ??= resolveAnswer(row[2], target.options)
            .letter as ImportedQuestion["correctAnswer"];
          if (!target.explanation && row[3]) target.explanation = row[3].trim();
        }
      }
      // Header rows ("# Answer Why") and anything else in the key are skipped.
      return;
    }

    const answer = line.match(answerLine);
    if (answer && current) {
      answerText = answer[1].trim();
      inExplanation = false;
      return;
    }

    const explanation = line.match(explanationLine);
    if (explanation && current) {
      current.explanation += `${current.explanation ? " " : ""}${explanation[1]}`;
      inExplanation = true;
      return;
    }

    // "True" / "False" written as the choices, with or without A. B.
    const tfChoice = line.match(trueFalseChoice);
    if (tfChoice && current && current.question && !inExplanation && current.options.length < 2) {
      current.options.push(tfChoice[1][0].toUpperCase() + tfChoice[1].slice(1).toLowerCase());
      return;
    }

    const option = line.match(optionStart);
    if (option && current && current.question && !inExplanation) {
      let optionText = option[2].trim();
      if (correctMark.test(optionText)) {
        optionText = optionText.replace(correctMark, "").trim();
        current.correctAnswer = LETTERS[current.options.length] ?? null;
      }
      current.options.push(optionText);
      return;
    }

    if (questionWordOnly.test(line)) {
      if (provisional && current && current.options.length === 0) current = null;
      start("");
      provisional = false;
      return;
    }

    const numbered = line.match(questionStart);
    // A numbered line starts the next question, unless the current one is
    // still mid-sentence (a question can wrap onto a line starting with a
    // number). A finished sentence with no choices yet is a True/False
    // question whose answer may come later, in an answer key.
    const currentLooksFinished =
      current !== null &&
      (/[?.!…]$/.test(current.question.trim()) || trueFalseTag.test(current.question));
    if (
      numbered &&
      (!current ||
        provisional ||
        current.options.length > 0 ||
        answerText !== null ||
        currentLooksFinished)
    ) {
      // A title read as a question ("Quiz: What is a conservancy?") is
      // dropped once a numbered question with no choices of its own follows.
      if (provisional && current && current.options.length === 0) current = null;
      start(numbered[2].trim(), Number(numbered[1]));
      provisional = false;
      return;
    }

    if (!current) {
      // Text before the first numbered question (a title or intro) is
      // skipped, unless it reads like an unnumbered question.
      if (/\?$/.test(line)) {
        start(line);
        provisional = true;
      }
      return;
    }

    if (inExplanation) {
      current.explanation += ` ${line}`;
    } else if (current.options.length === 0) {
      current.question += `${current.question ? " " : ""}${line}`;
    } else if (answerText === null && current.options.length < 4) {
      current.options[current.options.length - 1] += ` ${line}`;
    } else {
      current.explanation += `${current.explanation ? " " : ""}${line}`;
      inExplanation = true;
    }
  };

  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const line = clean(rawLine);
    if (!line) continue;

    // "A. x   B. y   C. z   D. w" on one line → one choice each.
    if (optionStart.test(line) && /\s\(?[b-d]\s*[.)]\s+\S/i.test(line)) {
      line.split(/\s+(?=\(?[b-d]\s*[.)]\s+\S)/i).forEach(handle);
    } else {
      handle(line);
    }
  }

  finish();

  // Checked last, because an answer key at the end can fill in answers.
  for (const item of questions) {
    if (!item.question) item.problems.push("No question text.");
    if (item.options.length === 0) {
      item.problems.push(
        "No choices found. List choices A to D, or give an answer of True or False for a True/False question."
      );
    } else if (item.options.length !== 2 && item.options.length < 4) {
      item.problems.push(
        `Has ${item.options.length} choice${item.options.length === 1 ? "" : "s"}; the quiz needs 4 (A to D), or 2 for True/False.`
      );
    }
    if (item.options.length > 4) {
      item.problems.push("Has more than 4 choices; the quiz takes A to D.");
    }
    if (!item.correctAnswer) {
      item.problems.push('No correct answer found. Add a line like "Answer: B" or "Answer: True".');
    } else if (item.options.length > 0 && LETTERS.indexOf(item.correctAnswer) >= item.options.length) {
      item.problems.push(`The answer is ${item.correctAnswer}, but there's no choice ${item.correctAnswer}.`);
    }
  }

  return questions;
}
