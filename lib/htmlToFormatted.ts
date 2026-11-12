/**
 * Turns copied rich text (the HTML a browser puts on the clipboard when you
 * copy from Claude, Word, Google Docs or a web page) into the simple
 * formatting the lesson editor uses (see components/FormattedText):
 *
 *   headings → ## / ###     bold → **      italic → *      underline → ++
 *   links → [text](url)     lists → - / 1. (nested lists indented)
 *   tables → | a | b | rows  images with a web address → ![Image](url)
 *
 * Everything else (fonts, colours, sizes, Word's hidden markup) is dropped.
 * Browser only: it uses DOMParser.
 */

type Style = { bold: boolean; italic: boolean; underline: boolean };

const BLOCK_TAGS = new Set([
  "P", "DIV", "SECTION", "ARTICLE", "HEADER", "FOOTER", "MAIN", "ASIDE",
  "BLOCKQUOTE", "PRE", "FIGURE", "FIGCAPTION", "H1", "H2", "H3", "H4", "H5",
  "H6", "UL", "OL", "LI", "TABLE", "HR", "DL", "DT", "DD",
]);

const BLOCK_SELECTOR = Array.from(BLOCK_TAGS).join(",").toLowerCase();

const SKIP_TAGS = new Set([
  "STYLE", "SCRIPT", "HEAD", "META", "TITLE", "LINK", "NOSCRIPT", "TEMPLATE",
  "BUTTON", "SVG", "XML",
]);

function safeHref(href: string | null) {
  const value = href?.trim() ?? "";
  if (!/^(https?:\/\/|mailto:)/i.test(value)) return null;
  // Brackets and spaces would end the [text](url) early.
  return value.replace(/\(/g, "%28").replace(/\)/g, "%29").replace(/\s/g, "%20");
}

/** Put markers around words, keeping spaces outside: "**word** ", not "**word **". */
function wrap(marker: string, text: string) {
  const match = text.match(/^(\s*)([\s\S]*?)(\s*)$/);
  if (!match || !match[2]) return text;
  return `${match[1]}${marker}${match[2]}${marker}${match[3]}`;
}

function styleOf(element: HTMLElement, inherited: Style): Style {
  const tag = element.tagName;
  const css = element.getAttribute("style")?.toLowerCase() ?? "";
  const weight = css.match(/font-weight\s*:\s*([a-z0-9]+)/)?.[1];
  const fontStyle = css.match(/font-style\s*:\s*([a-z]+)/)?.[1];
  const decoration = css.match(/text-decoration(?:-line)?\s*:\s*([^;]+)/)?.[1];

  let bold = inherited.bold;
  if (tag === "B" || tag === "STRONG") bold = true;
  if (weight) bold = weight === "bold" || weight === "bolder" || Number(weight) >= 600;

  let italic = inherited.italic;
  if (tag === "I" || tag === "EM") italic = true;
  if (fontStyle) italic = fontStyle === "italic" || fontStyle === "oblique";

  let underline = inherited.underline;
  if (tag === "U" || tag === "INS") underline = true;
  if (decoration) underline = decoration.includes("underline");

  return { bold, italic, underline };
}

/** One line of text with inline formatting, from an element's children. */
function inline(node: Node, style: Style): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replace(/[\s ]+/g, " ");
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return "";

  const element = node as HTMLElement;
  const tag = element.tagName;
  if (SKIP_TAGS.has(tag) || tag.includes(":")) return ""; // Word's <o:p> etc.
  if (tag === "BR") return " ";
  if (tag === "IMG") return "";

  const own = styleOf(element, style);
  let text = Array.from(element.childNodes)
    .map((child) => inline(child, own))
    .join("");

  if (tag === "A") {
    const href = safeHref(element.getAttribute("href"));
    const label = text.trim();
    if (href && label) {
      // Links inside links aren't allowed, so drop any inner link syntax.
      text = text.replace(label, `[${label.replace(/\[|\]/g, "")}](${href})`);
    }
  }

  // Only add markers where the style starts, not on every nested tag.
  if (own.underline && !style.underline) text = wrap("++", text);
  if (own.italic && !style.italic) text = wrap("*", text);
  if (own.bold && !style.bold) text = wrap("**", text);
  return text;
}

const plain: Style = { bold: false, italic: false, underline: false };

function tidy(line: string) {
  return line.replace(/ {2,}/g, " ").trim();
}

/** Lines for a <table>: a pipe table whose first row is the header. */
function tableLines(table: HTMLTableElement): string[] {
  const rows = Array.from(table.rows).map((row) =>
    Array.from(row.cells).map((cell) =>
      tidy(blockText(cell).join(" ")).replace(/\|/g, "/") || " "
    )
  );
  if (rows.length === 0) return [];

  const columns = Math.max(...rows.map((cells) => cells.length));
  const line = (cells: string[]) =>
    `| ${Array.from({ length: columns }, (_, i) => cells[i] ?? " ").join(" | ")} |`;

  return [
    line(rows[0]),
    `| ${Array.from({ length: columns }, () => "---").join(" | ")} |`,
    ...rows.slice(1).map(line),
  ];
}

/** Lines for a <ul>/<ol>, nested lists indented two spaces per level. */
function listLines(list: HTMLElement, depth: number): string[] {
  const ordered = list.tagName === "OL";
  let number = Number(list.getAttribute("start")) || 1;
  const lines: string[] = [];
  // a. b. c. lists (quiz choices, mostly) keep their letters.
  const listType = `${list.getAttribute("type") ?? ""} ${list.getAttribute("style") ?? ""}`;
  const letters = /\b[aA]\b|alpha|latin/.test(listType)
    ? /upper|\bA\b/.test(listType)
      ? "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      : "abcdefghijklmnopqrstuvwxyz"
    : null;

  for (const child of Array.from(list.children)) {
    if (child.tagName === "UL" || child.tagName === "OL") {
      lines.push(...listLines(child as HTMLElement, depth + 1));
      continue;
    }
    if (child.tagName !== "LI") continue;

    const nested: string[] = [];
    let text = "";
    for (const part of Array.from(child.childNodes)) {
      const tag = (part as HTMLElement).tagName;
      if (tag === "UL" || tag === "OL") {
        nested.push(...listLines(part as HTMLElement, depth + 1));
      } else if (tag && BLOCK_TAGS.has(tag)) {
        text += ` ${blockText(part as HTMLElement).join(" ")}`;
      } else {
        text += inline(part, plain);
      }
    }

    const marker = !ordered
      ? "-"
      : letters
        ? `${letters[(number++ - 1) % letters.length]}.`
        : `${number++}.`;
    lines.push(`${"  ".repeat(depth)}${marker} ${tidy(text)}`);
    lines.push(...nested);
  }

  return lines;
}

/**
 * The blocks inside an element, each as a string. Paragraphs, headings and
 * other blocks become separate entries; lists and tables become one entry
 * of several lines.
 */
function blockText(root: HTMLElement): string[] {
  const blocks: string[] = [];
  let line = "";

  const flush = () => {
    const text = tidy(line);
    if (text) blocks.push(text);
    line = "";
  };

  for (const node of Array.from(root.childNodes)) {
    if (node.nodeType !== Node.ELEMENT_NODE) {
      line += inline(node, plain);
      continue;
    }

    const element = node as HTMLElement;
    const tag = element.tagName;

    if (SKIP_TAGS.has(tag) || tag.includes(":")) continue;

    if (tag === "BR") {
      flush();
      continue;
    }

    if (tag === "IMG") {
      const src = safeHref(element.getAttribute("src"));
      if (src && !src.startsWith("mailto:")) {
        flush();
        blocks.push(`![${tidy(element.getAttribute("alt") ?? "") || "Image"}](${src})`);
      }
      continue;
    }

    // Google Docs wraps the whole copy in one <b style="font-weight:normal">,
    // so an inline tag holding paragraphs or lists is just a container.
    if (!BLOCK_TAGS.has(tag)) {
      if (element.querySelector(BLOCK_SELECTOR)) {
        flush();
        blocks.push(...blockText(element));
      } else {
        line += inline(element, plain);
      }
      continue;
    }

    flush();

    if (tag === "UL" || tag === "OL") {
      const lines = listLines(element, 0);
      if (lines.length) blocks.push(lines.join("\n"));
    } else if (tag === "TABLE") {
      const lines = tableLines(element as HTMLTableElement);
      if (lines.length) blocks.push(lines.join("\n"));
    } else if (/^H[1-6]$/.test(tag)) {
      // Headings are bold already; drop extra bold markers inside them.
      const text = tidy(inline(element, plain)).replace(/\*\*/g, "");
      if (text) blocks.push(`${tag <= "H2" ? "##" : "###"} ${text}`);
    } else if (tag === "HR") {
      continue;
    } else {
      blocks.push(...blockText(element));
    }
  }

  flush();
  return blocks;
}

const listLine = /^\s*(?:-|\d{1,3}\.)\s/;

export function htmlToFormattedText(html: string): string {
  const doc = new DOMParser().parseFromString(html, "text/html");

  const blocks = blockText(doc.body).map((block) =>
    // Word writes bullets as "·" or "§" characters rather than a list.
    block.replace(/^[·§•▪◦]\s+/gm, "- ")
  );

  // Word puts each list item in its own paragraph. Keep the items of one
  // list together, or a lone "1. ..." line would show as a heading.
  const merged: string[] = [];
  for (const block of blocks) {
    const previous = merged[merged.length - 1];
    const isList = block.split("\n").every((line) => listLine.test(line));
    const previousIsList =
      previous !== undefined &&
      previous.split("\n").every((line) => listLine.test(line));

    if (isList && previousIsList) merged[merged.length - 1] = `${previous}\n${block}`;
    else merged.push(block);
  }

  return merged.join("\n\n").replace(/\n{3,}/g, "\n\n").trim();
}
