// A course's learning objectives live in Course.learningOutcomes as plain
// text, one objective per line. The admin form edits them as separate
// fields (components/ObjectivesInput.tsx) and the course page shows them as
// numbered cards; both read and write through these two functions.

export const MAX_OBJECTIVES = 5;

/**
 * Splits saved text into objectives. Copes with older entries typed as a
 * bulleted or numbered list, and drops lead-in lines such as "By the end of
 * this course, you will be able to:".
 */
export function parseObjectives(text: string | null | undefined) {
  if (!text) return [];

  return text
    .replace(/\r\n?/g, "\n")
    .split("\n")
    .map((line) =>
      line
        .trim()
        .replace(/^(?:[-*•▪◦·]|\d{1,2}[.)])\s*/, "")
        .replace(/^\*\*(.*)\*\*$/, "$1")
        .trim()
    )
    .filter((line) => line && !line.endsWith(":"));
}

/** Joins the filled-in fields back into the saved text. */
export function joinObjectives(items: string[]) {
  return items
    .map((item) => item.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join("\n");
}
