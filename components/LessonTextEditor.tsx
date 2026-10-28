"use client";

import { useRef, useState } from "react";
import {
  Bold,
  Eye,
  Heading2,
  ImagePlus,
  List,
  ListOrdered,
  Loader2,
  PenLine,
} from "lucide-react";
import FormattedText from "@/components/FormattedText";

type LessonTextEditorProps = {
  // The form field name the server action reads ("content" or "notes").
  name: string;
  label: string;
  defaultValue?: string;
  placeholder?: string;
  rows?: number;
};

// Screenshots are often 2-5 MB PNGs. Anything big is scaled to at most
// 1800px wide and saved as WebP before uploading, so lessons load fast.
async function shrinkImage(file: File): Promise<File> {
  if (file.type === "image/gif" || file.size < 800 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, 1800 / bitmap.width);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    canvas.getContext("2d")?.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/webp", 0.85)
    );

    return blob && blob.size < file.size
      ? new File([blob], "screenshot.webp", { type: "image/webp" })
      : file;
  } catch {
    return file;
  }
}

/**
 * Textarea for lesson content/notes with a small formatting toolbar and a
 * live preview that matches what learners see (components/FormattedText).
 * Screenshots can be added with the toolbar button, pasted straight in
 * (e.g. after Win+Shift+S), or dragged onto the box; each one is uploaded
 * and inserted as ![Screenshot](url) on its own line.
 *
 * It's still a plain <textarea name=...>, so the existing server actions
 * that save the lesson don't change.
 */
export default function LessonTextEditor({
  name,
  label,
  defaultValue = "",
  placeholder,
  rows = 12,
}: LessonTextEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState(defaultValue);
  const [mode, setMode] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Replace the current selection (or insert at the cursor), then put the
  // cursor at the end of what was inserted.
  function replaceSelection(build: (selected: string) => string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const { selectionStart, selectionEnd } = textarea;
    const selected = value.slice(selectionStart, selectionEnd);
    const inserted = build(selected);
    const nextValue =
      value.slice(0, selectionStart) + inserted + value.slice(selectionEnd);

    setValue(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      const cursor = selectionStart + inserted.length;
      textarea.setSelectionRange(cursor, cursor);
    });
  }

  // Add a prefix ("- ", "1. ", "## ") to every line the selection touches.
  function prefixLines(prefix: (index: number) => string) {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const lineStart = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
    const nextBreak = value.indexOf("\n", textarea.selectionEnd);
    const lineEnd = nextBreak === -1 ? value.length : nextBreak;

    const lines = value.slice(lineStart, lineEnd).split("\n");
    const updated = lines
      .map((line, index) => (line.trim() ? `${prefix(index)}${line.replace(/^\s*([-*•]|\d+[.)]|#{1,3})\s+/, "")}` : line))
      .join("\n");

    const nextValue = value.slice(0, lineStart) + updated + value.slice(lineEnd);
    setValue(nextValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(lineStart, lineStart + updated.length);
    });
  }

  // Pressing Enter on a bullet/numbered line starts the next item; Enter
  // on an empty item ends the list.
  function handleKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;

    const textarea = event.currentTarget;
    const lineStart = value.lastIndexOf("\n", textarea.selectionStart - 1) + 1;
    const line = value.slice(lineStart, textarea.selectionStart);
    const match = line.match(/^(\s*)([-*•]|(\d+)[.)])\s+(.*)$/);

    if (!match) return;

    event.preventDefault();

    if (!match[4].trim()) {
      // Empty item: remove the marker instead of adding another one.
      const nextValue = value.slice(0, lineStart) + value.slice(textarea.selectionStart);
      setValue(nextValue);
      requestAnimationFrame(() => textarea.setSelectionRange(lineStart, lineStart));
      return;
    }

    const marker = match[3] ? `${Number(match[3]) + 1}.` : match[2];
    replaceSelection(() => `\n${match[1]}${marker} `);
  }

  async function uploadImages(files: File[]) {
    const images = files.filter((file) => file.type.startsWith("image/"));
    if (images.length === 0) return;

    setError(null);
    setUploading(true);

    try {
      const markdown: string[] = [];

      for (const image of images) {
        const body = new FormData();
        body.append("file", await shrinkImage(image));

        const response = await fetch("/api/admin/uploads", {
          method: "POST",
          body,
        });
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Upload failed.");
        }

        markdown.push(`![Screenshot](${data.url})`);
      }

      replaceSelection(() => `\n${markdown.join("\n\n")}\n`);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error ? uploadError.message : "Upload failed."
      );
    } finally {
      setUploading(false);
    }
  }

  const toolbarButton =
    "flex h-9 items-center gap-1.5 rounded-full px-3 text-sm font-semibold text-gray-600 hover:bg-white hover:text-[#1E1D59] disabled:opacity-50";

  return (
    <div>
      <div className="mb-2 flex flex-wrap items-end justify-between gap-2">
        <label htmlFor={`editor-${name}`} className="block font-bold">
          {label}
        </label>

        <div className="flex rounded-full bg-gray-100 p-1 text-sm font-semibold">
          {(["write", "preview"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setMode(option)}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 ${
                mode === option
                  ? "bg-white text-[#1E1D59] shadow-sm"
                  : "text-gray-500 hover:text-[#1E1D59]"
              }`}
            >
              {option === "write" ? <PenLine size={14} /> : <Eye size={14} />}
              {option === "write" ? "Write" : "Preview"}
            </button>
          ))}
        </div>
      </div>

      <div
        className={`overflow-hidden rounded-xl border transition-colors focus-within:border-[#1E1D59] ${
          dragging ? "border-dashed border-[#632854] bg-[#FBEFF4]" : ""
        }`}
      >
        {mode === "write" && (
          <div className="flex flex-wrap items-center gap-1 border-b bg-gray-50 px-2 py-1.5">
            <button type="button" className={toolbarButton} onClick={() => prefixLines(() => "- ")} title="Bullet list">
              <List size={16} />
              <span className="hidden sm:inline">Bullets</span>
            </button>
            <button type="button" className={toolbarButton} onClick={() => prefixLines((index) => `${index + 1}. `)} title="Numbered list">
              <ListOrdered size={16} />
              <span className="hidden sm:inline">Numbers</span>
            </button>
            <button type="button" className={toolbarButton} onClick={() => prefixLines(() => "## ")} title="Heading">
              <Heading2 size={16} />
              <span className="hidden sm:inline">Heading</span>
            </button>
            <button
              type="button"
              className={toolbarButton}
              onClick={() => replaceSelection((selected) => `**${selected || "bold text"}**`)}
              title="Bold"
            >
              <Bold size={16} />
              <span className="hidden sm:inline">Bold</span>
            </button>

            <span className="mx-1 h-5 w-px bg-gray-200" />

            <button
              type="button"
              className={toolbarButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              title="Add a screenshot or image"
            >
              {uploading ? <Loader2 size={16} className="animate-spin" /> : <ImagePlus size={16} />}
              {uploading ? "Uploading..." : "Add Screenshot"}
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              multiple
              className="hidden"
              onChange={(event) => {
                uploadImages(Array.from(event.target.files || []));
                event.target.value = "";
              }}
            />
          </div>
        )}

        {/* Stays mounted in preview mode so the form still submits it. */}
        <textarea
          ref={textareaRef}
          id={`editor-${name}`}
          name={name}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(event) => setValue(event.target.value)}
          onKeyDown={handleKeyDown}
          onPaste={(event) => {
            const files = Array.from(event.clipboardData.files);
            if (files.some((file) => file.type.startsWith("image/"))) {
              event.preventDefault();
              uploadImages(files);
            }
          }}
          onDragOver={(event) => {
            if (event.dataTransfer.types.includes("Files")) {
              event.preventDefault();
              setDragging(true);
            }
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(event) => {
            if (event.dataTransfer.files.length > 0) {
              event.preventDefault();
              setDragging(false);
              uploadImages(Array.from(event.dataTransfer.files));
            }
          }}
          className={`w-full bg-transparent px-5 py-4 text-lg leading-8 outline-none ${
            mode === "preview" ? "hidden" : ""
          }`}
        />

        {mode === "preview" && (
          <div className="min-h-48 bg-white px-5 py-5">
            {value.trim() ? (
              <FormattedText text={value} />
            ) : (
              <p className="text-gray-400">Nothing to preview yet.</p>
            )}
          </div>
        )}
      </div>

      {error ? (
        <p className="mt-2 text-sm font-semibold text-red-600">{error}</p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          Start a line with <code className="rounded bg-gray-100 px-1">-</code> for a
          bullet, <code className="rounded bg-gray-100 px-1">1.</code> for a numbered
          list or <code className="rounded bg-gray-100 px-1">##</code> for a heading.
          Paste or drag a screenshot straight into the box. Learners see it
          exactly like the Preview.
        </p>
      )}
    </div>
  );
}
