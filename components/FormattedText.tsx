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
 *   [text](https://...)            link (bare https:// links work too)
 *   ![caption](https://...)        image / screenshot on its own line
 *
 * A blank line starts a new paragraph; a single line break stays a line
 * break. Bullets pasted from Word or Google Docs (•, ◦, ▪, –) also work.
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
  | { kind: "image"; url: string; caption: string };

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

  const closeOpenBlocks = () => {
    if (paragraph) blocks.push({ kind: "paragraph", lines: paragraph });
    if (list) blocks.push({ kind: "list", items: list });
    paragraph = null;
    list = null;
  };

  for (const rawLine of source.replace(/\r\n?/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeOpenBlocks();
      continue;
    }

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

// **bold**, [text](url) and bare https:// links.
const inlinePattern =
  /(\*\*([^*]+)\*\*)|(\[([^\]]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s<]+[^\s<.,;:!?)\]'"])/g;

function renderInline(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(inlinePattern)) {
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));

    if (match[1]) {
      parts.push(
        <strong key={index} className="font-bold text-[#1E1D59]">
          {match[2]}
        </strong>
      );
    } else {
      const href = match[5] ?? match[6];
      parts.push(
        <a
          key={index}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[#632854] underline decoration-[#632854]/30 underline-offset-4 hover:decoration-[#632854]"
        >
          {match[4] ?? href}
        </a>
      );
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

  const className = `space-y-2 pl-6 marker:text-[#632854] ${
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

export default function FormattedText({ text }: { text: string }) {
  const blocks = parseBlocks(text);

  return (
    <div className="space-y-5 text-lg leading-8 text-gray-700">
      {blocks.map((block, index) => {
        switch (block.kind) {
          case "heading":
            return block.level === 2 ? (
              <h3
                key={index}
                className="pt-3 text-2xl font-extrabold text-[#1E1D59] first:pt-0"
              >
                {renderInline(block.text)}
              </h3>
            ) : (
              <h4 key={index} className="pt-2 text-xl font-bold text-[#1E1D59]">
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
                  className="flex items-baseline gap-3 pt-3 text-2xl font-extrabold text-[#1E1D59] first:pt-0"
                >
                  <span className="font-serif text-3xl font-normal italic text-[#632854]">
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
