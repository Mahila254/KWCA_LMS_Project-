/**
 * Questions that pop up part-way through a lesson video. The admin picks
 * the time; the player pauses there, the learner answers, sees the answer
 * and carries on. Nothing is marked or saved about the answer.
 *
 * Shared by the admin editor, the server actions that save it, and the
 * player, so nothing here touches the database.
 */

export type VideoQuestionType = "TRUE_FALSE" | "MULTIPLE_CHOICE";

export type VideoQuestion = {
  id: string;
  timeSeconds: number;
  type: VideoQuestionType;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
};

export type VideoQuestionInput = Omit<VideoQuestion, "id">;

export const MAX_VIDEO_QUESTIONS = 20;
export const MAX_CHOICES = 4;
export const TRUE_FALSE_OPTIONS = ["True", "False"];

// Six hours: longer than any lesson video, short enough to catch typos.
const MAX_TIME_SECONDS = 6 * 60 * 60;

/** "1:30" → 90, "1:02:03" → 3723, "45" → 45. null if it isn't a time. */
export function parseVideoTime(value: string): number | null {
  const text = value.trim();
  if (!/^\d+(:\d{1,2}){0,2}$/.test(text)) return null;

  const parts = text.split(":").map(Number);
  if (parts.slice(1).some((part) => part > 59)) return null;

  const seconds = parts.reduce((total, part) => total * 60 + part, 0);
  return seconds <= MAX_TIME_SECONDS ? seconds : null;
}

/** 90 → "1:30", 3723 → "1:02:03". */
export function formatVideoTime(totalSeconds: number) {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const rest = String(seconds % 60).padStart(2, "0");

  return hours > 0
    ? `${hours}:${String(minutes).padStart(2, "0")}:${rest}`
    : `${minutes}:${rest}`;
}

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

/**
 * Reads the admin editor's JSON. Questions that aren't finished (no
 * question, a missing choice, no correct answer) are dropped rather than
 * failing the whole lesson save; the editor's required fields stop that
 * happening in practice. Comes back sorted by time.
 */
export function parseVideoQuestions(json: unknown): VideoQuestionInput[] {
  let raw: unknown;
  try {
    raw = typeof json === "string" && json ? JSON.parse(json) : [];
  } catch {
    return [];
  }
  if (!Array.isArray(raw)) return [];

  const questions: VideoQuestionInput[] = [];

  for (const item of raw.slice(0, MAX_VIDEO_QUESTIONS)) {
    if (!item || typeof item !== "object") continue;

    // Number(null) is 0, so a blank time must not get that far.
    const timeSeconds =
      typeof item.timeSeconds === "number" ? item.timeSeconds : NaN;
    const type: VideoQuestionType =
      item.type === "MULTIPLE_CHOICE" ? "MULTIPLE_CHOICE" : "TRUE_FALSE";
    const question = cleanText(item.question, 500);
    const options =
      type === "TRUE_FALSE"
        ? TRUE_FALSE_OPTIONS
        : (Array.isArray(item.options) ? item.options : [])
            .slice(0, MAX_CHOICES)
            .map((option: unknown) => cleanText(option, 200));
    const correctIndex =
      typeof item.correctIndex === "number" ? item.correctIndex : NaN;

    if (
      !Number.isInteger(timeSeconds) ||
      timeSeconds < 0 ||
      timeSeconds > MAX_TIME_SECONDS ||
      !question ||
      options.length < 2 ||
      options.some((option: string) => !option) ||
      !Number.isInteger(correctIndex) ||
      correctIndex < 0 ||
      correctIndex >= options.length
    ) {
      continue;
    }

    questions.push({
      timeSeconds,
      type,
      question,
      options,
      correctIndex,
      explanation: cleanText(item.explanation, 1000) || null,
    });
  }

  return questions.sort((a, b) => a.timeSeconds - b.timeSeconds);
}
