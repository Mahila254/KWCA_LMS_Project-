import { Fragment, type ReactNode } from "react";

/**
 * Shows lesson content and notes the way the admin typed them, instead of
 * squashing everything into paragraphs. Understands a small, forgiving
 * set of formatting (the admin editor's toolbar writes these for you):
 *
 *   - item / * item / • item       bullet point (indent 2 spaces to nest)
 *   1. item  /  1) item            numbered list
 *   ## Heading  /  ### Heading     headings
 *   **bold**                       bold text
 *   *italic*                       italic text
 *   ++underline++                  underlined text
 *   [text](https://...)            link (bare https:// links work too;
 *                                  mailto: for email)
 *   ![caption](https://...)        image / screenshot on its own line
 *   | a | b |  then  |---|---|      table (the divider makes row 1 the
 *                                  header); pasted tables arrive like this
 *
 * A blank line starts a new paragraph; a single line break stays a line
 * break (or, with variant="intro", runs on as one flowing paragraph). Bullets pasted from Word or Google Docs (•, ◦, ▪, –) also work.
 * Built from React elements only, never raw HTML, so lesson text can't
 * inject scripts into the page.
 */

// The section names older lessons used as headings ("Key Notes", or
// "Summary:" on a line of its own) still render as headings.
const legacyHeadings = [
  "lesson objective",
  "key notes",
  "important ideas",
  "practical example",
  "summary",
  "key takeaway",
  "key takeaways",
  "reflection",
  "activity",
];

// `number` is the number the admin typed ("3." → 3), so a numbered list
// split up by paragraphs carries on counting instead of restarting at 1.
type ListItem = { level: number; text: string; ordered: boolean; number?: number };

type Block =
  | { kind: "heading"; level: 2 | 3; text: string }
  | { kind: "paragraph"; lines: string[] }
  | { kind: "list"; items: ListItem[] }
  | { kind: "image"; url: string; caption: string }
  | { kind: "table"; rows: string[][]; header: boolean };

// | a | b | lines make a table; a |---|---| line under the first row
// makes that row the header (the format Claude and most editors copy).
const tableRowPattern = /^\|.*\|$/;
const tableDividerPattern = /^\|(\s*:?-{2,}:?\s*\|)+$/;

function tableCells(line: string) {
  return line.slice(1, -1).split("|").map((cell) => cell.trim());
}

const bulletPattern = /^(\s*)(?:[-*+•◦▪▫‣–●○■□➢➤✓✔]|•)\s+(.*)$/;
const numberPattern = /^(\s*)(\d{1,3})[.)]\s+(.*)$/;
const imagePattern = /^!\[([^\]]*)\]\((https?:\/\/[^\s)]+)\)$/;
const headingPattern = /^(#{1,3})\s+(.*)$/;

function indentLevel(whitespace: string) {
  const width = whitespace.replace(/\t/g, "  ").length;
  return Math.min(Math.floor(width / 2), 2);
}

function parseBlocks(source: string): Block[] {
  const blocks: Block[] = [];
  let paragraph: string[] | null = null;
  let list: ListItem[] | null = null;
  let table: { rows: string[][]; header: boolean } | null = null;

  const closeOpenBlocks = () => {
    if (paragraph) blocks.push({ kind: "paragraph", lines: paragraph });
    if (list) blocks.push({ kind: "list", items: list });
    if (table) blocks.push({ kind: "table", ...table });
    paragraph = null;
    list = null;
    table = null;
  };

  for (const rawLine of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeOpenBlocks();
      continue;
    }

    if (tableRowPattern.test(trimmed)) {
      if (!table) {
        closeOpenBlocks();
        table = { rows: [], header: false };
      }
      if (tableDividerPattern.test(trimmed)) {
        if (table.rows.length === 1) table.header = true;
      } else {
        table.rows.push(tableCells(trimmed));
      }
      continue;
    }

    if (table) closeOpenBlocks();

    const image = trimmed.match(imagePattern);
    if (image) {
      closeOpenBlocks();
      blocks.push({ kind: "image", caption: image[1].trim(), url: image[2] });
      continue;
    }

    const heading = trimmed.match(headingPattern);
    const legacy = trimmed.replace(/:$/, "").toLowerCase();
    if (heading || (trimmed.length < 80 && legacyHeadings.includes(legacy))) {
      closeOpenBlocks();
      blocks.push({
        kind: "heading",
        level: heading && heading[1].length === 3 ? 3 : 2,
        text: heading ? heading[2] : trimmed.replace(/:$/, ""),
      });
      continue;
    }

    const bullet = line.match(bulletPattern);
    const numbered = bullet ? null : line.match(numberPattern);
    if (bullet || numbered) {
      const match = (bullet || numbered)!;
      if (paragraph) {
        blocks.push({ kind: "paragraph", lines: paragraph });
        paragraph = null;
      }
      list ??= [];
      list.push({
        level: indentLevel(match[1]),
        text: numbered ? numbered[3] : match[2],
        ordered: Boolean(numbered),
        number: numbered ? Number(numbered[2]) : undefined,
      });
      continue;
    }

    // A wrapped line right under a bullet belongs to that bullet.
    if (list && /^\s+/.test(line)) {
      list[list.length - 1].text += ` ${trimmed}`;
      continue;
    }

    if (list) {
      blocks.push({ kind: "list", items: list });
      list = null;
    }

    paragraph ??= [];
    paragraph.push(trimmed);
  }

  closeOpenBlocks();
  return blocks;
}

// [text](url), **bold**, ++underline++, *italic* and bare https:// links.
// They can sit inside each other: [**bold link**](url), ++*both*++.
// Links only go to web pages or email (https://, http://, mailto:).
const inlinePattern =
  /(\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\))|(\*\*(.+?)\*\*)|(\+\+(.+?)\+\+)|((?<![*\w])\*(?![\s*])(.+?)(?<![\s*])\*(?![*\w]))|(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

function renderInline(text: string, keyPrefix = ""): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    const key = `${keyPrefix}${index}`;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));

    if (match[1] || match[10]) {
      const href = match[3] ?? match[10];
      parts.push(
        <a
          key={key}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-accent underline decoration-accent/30 underline-offset-4 hover:decoration-accent"
        >
          {match[2] ? renderInline(match[2], `${key}-`) : href}
        </a>
      );
    } else if (match[4]) {
      parts.push(
        <strong key={key} className="font-bold text-ink">
          {renderInline(match[5], `${key}-`)}
        </strong>
      );
    } else if (match[6]) {
      parts.push(
        <u key={key} className="underline decoration-1 underline-offset-4">
          {renderInline(match[7], `${key}-`)}
        </u>
      );
    } else {
      parts.push(<em key={key}>{renderInline(match[9], `${key}-`)}</em>);
    }

    lastIndex = index + match[0].length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return parts;
}

// Turns a flat list of (level, text) items into nested <ul>/<ol>s.
function renderList(items: ListItem[], start: number, level: number): [ReactNode, number] {
  const ordered = items[start].ordered;
  const children: ReactNode[] = [];
  let index = start;

  while (index < items.length && items[index].level >= level) {
    const item = items[index];

    if (item.level > level) {
      const [nested, nextIndex] = renderList(items, index, item.level);
      children.push(<Fragment key={`n${index}`}>{nested}</Fragment>);
      index = nextIndex;
      continue;
    }

    let nested: ReactNode = null;
    index += 1;

    if (index < items.length && items[index].level > level) {
      const [child, nextIndex] = renderList(items, index, items[index].level);
      nested = child;
      index = nextIndex;
    }

    children.push(
      <li key={index} className="pl-1.5">
        {renderInline(item.text)}
        {nested}
      </li>
    );
  }

  const className = `space-y-2 pl-6 marker:text-accent ${
    level > 0 ? "mt-2" : ""
  } ${ordered ? "list-decimal marker:font-bold" : level > 0 ? "list-[circle]" : "list-disc"}`;

  const list = ordered ? (
    <ol className={className} start={items[start].number}>
      {children}
    </ol>
  ) : (
    <ul className={className}>{children}</ul>
  );

  return [list, index];
}

/**
 * The same text as one plain line, for previews that can't show lists
 * (course cards, admin tables): bullet markers, images, heading marks,
 * bold stars and link syntax are removed, and list items are joined
 * with "; " so they still read as separate points. Pair with line-clamp.
 */
export function toPlainText(
  text: string,
  // Leave out headings, for a summary that starts with the actual text
  // ("Definition. Under Kenya's...") rather than "Lesson 1: ...".
  { skipHeadings = false }: { skipHeadings?: boolean } = {}
) {
  let plain = "";

  for (const rawLine of text.replace(/\r\n?/g, "\n").split("\n")) {
    const rawTrimmed = rawLine.trim();
    if (tableDividerPattern.test(rawTrimmed)) continue;
    if (skipHeadings && headingPattern.test(rawTrimmed)) continue;
    // A table row reads as its cells, comma separated.
    const trimmed = tableRowPattern.test(rawTrimmed)
      ? tableCells(rawTrimmed).filter(Boolean).join(", ")
      : rawTrimmed;
    const isListItem = bulletPattern.test(trimmed) || numberPattern.test(trimmed);
    const line = trimmed
      .replace(imagePattern, "")
      .replace(/^#{1,3}\s+/, "")
      .replace(/^(?:[-*+•◦▪▫‣–●○■□➢➤✓✔]|\d{1,3}[.)])\s+/, "")
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|mailto:)[^\s)]+)\)/g, "$1")
      .replace(/\*\*(.+?)\*\*/g, "$1")
      .replace(/\+\+(.+?)\+\+/g, "$1")
      .replace(/(?<![*\w])\*(?![\s*])(.+?)(?<![\s*])\*(?![*\w])/g, "$1");

    if (!line) continue;

    if (!plain) {
      plain = line;
    } else if (isListItem && !/[:;.!?]$/.test(plain)) {
      plain += `; ${line}`;
    } else {
      plain += ` ${line}`;
    }
  }

  return plain;
}

/**
 * A short plain-text summary for lesson and course cards: no formatting
 * marks or headings, cut at a word near `maxLength`. Only this much goes
 * into the page, so a card never carries a whole (possibly premium) lesson.
 */
export function toSummary(text: string, maxLength = 220) {
  const plain = toPlainText(text, { skipHeadings: true }) || toPlainText(text);
  if (plain.length <= maxLength) return plain;
  const cut = plain.slice(0, maxLength);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : maxLength).replace(/[\s,;:.–-]+$/, "")}…`;
}

export default function FormattedText({
  text,
  size = "lg",
  tone = "default",
  variant = "default",
}: {
  text: string;
  // "base" is a little smaller and tighter, for course headers and
  // summaries; "lg" is the reading size used in lessons.
  size?: "base" | "lg";
  // "onDark" lightens every colour for text over a dark photo or navy
  // band (the rules are in globals.css, .formatted-on-dark).
  tone?: "default" | "onDark";
  // "intro" is for a course's About text: lines typed one under another run
  // together into a single paragraph (an empty line still starts a new one),
  // and the first paragraph is a little larger, as a lead.
  variant?: "default" | "intro";
}) {
  const blocks = parseBlocks(text);
  const intro = variant === "intro";
  const sizeClass = intro
    ? "space-y-4 text-base leading-7 md:text-lg md:leading-8"
    : size === "lg"
      ? "space-y-5 text-lg leading-8"
      : "space-y-3 text-base leading-7 md:text-lg md:leading-8";

  return (
    <div
      className={`${sizeClass} ${
        tone === "onDark" ? "formatted-on-dark text-white/85" : "text-gray-700"
      }`}
    >
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h3
                key={index}
                className="pt-3 text-2xl font-extrabold text-ink first:pt-0"
              >
                {renderInline(block.text)}
              </h3>
            ) : (
              <h4 key={index} className="pt-2 text-xl font-bold text-ink">
                {renderInline(block.text)}
              </h4>
            );

          case "list": {
            // A numbered line on its own ("2. Who is in charge?") followed
            // by bullets is a section title, so show it as a heading.
            const only = block.items.length === 1 ? block.items[0] : null;
            if (only?.ordered && only.level === 0 && only.text.length < 100) {
              return (
                <h3
                  key={index}
                  className="flex items-baseline gap-3 pt-3 text-2xl font-extrabold text-ink first:pt-0"
                >
                  <span className="font-serif text-3xl font-normal italic text-accent">
                    {only.number}.
                  </span>
                  <span>{renderInline(only.text)}</span>
                </h3>
              );
            }

            return (
              <Fragment key={index}>
                {
                  renderList(
                    block.items,
                    0,
                    Math.min(...block.items.map((item) => item.level))
                  )[0]
                }
              </Fragment>
            );
          }

          case "table": {
            const [first, ...rest] = block.rows;
            const head = block.header ? first : null;
            const body = block.header ? rest : block.rows;
            const columns = Math.max(...block.rows.map((row) => row.length));
            const cells = (row: string[]) =>
              Array.from({ length: columns }, (_, i) => row[i] ?? "");

            return (
              <div
                key={index}
                className="overflow-x-auto rounded-2xl border border-gray-200"
              >
                <table className="w-full border-collapse text-left text-base leading-7">
                  {head && (
                    <thead className="bg-tint text-ink">
                      <tr>
                        {cells(head).map((cell, i) => (
                          <th key={i} scope="col" className="px-4 py-3 font-bold">
                            {renderInline(cell)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody>
                    {body.map((row, rowIndex) => (
                      <tr key={rowIndex} className="border-t border-gray-200 align-top">
                        {cells(row).map((cell, i) => (
                          <td key={i} className="px-4 py-3">
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }

          case "image":
            return (
              <figure key={index} className="my-2">
                <a href={block.url} target="_blank" rel="noopener noreferrer">
                  <img
                    src={block.url}
                    alt={block.caption || "Lesson image"}
                    loading="lazy"
                    className="w-full rounded-2xl border border-gray-200 bg-gray-50 object-contain shadow-sm transition-shadow hover:shadow-md"
                  />
                </a>
                {block.caption && !/^(image|screenshot)$/i.test(block.caption) && (
                  <figcaption className="mt-2 text-center text-sm text-gray-500">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          default:
            if (intro) {
              const lead = index === 0;

              return (
                <p
                  key={index}
                  className={`text-pretty ${
                    lead
                      ? `text-lg leading-8 md:text-xl md:leading-9 ${
                          tone === "onDark" ? "text-white" : "text-gray-800"
                        }`
                      : ""
                  }`}
                >
                  {renderInline(block.lines.join(" "))}
                </p>
              );
            }

            return (
              <p key={index}>
                {block.lines.map((line, lineIndex) => (
                  <Fragment key={lineIndex}>
                    {lineIndex > 0 && <br />}
                    {renderInline(line)}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
