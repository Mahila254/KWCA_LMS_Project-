"use client";

import { useState } from "react";
import { AlertTriangle, CheckCircle2, Film, Link2 } from "lucide-react";
import { formatVideoTime } from "@/lib/videoQuestions";
import { getVideoSource, normalizeVideoUrl } from "@/lib/videoSource";

/**
 * The lesson video field. Paste any YouTube link straight from YouTube
 * (Share button, the address bar, Shorts) and it's turned into the embed
 * address the lesson player uses, with a thumbnail to confirm it's the
 * right video. The server actions normalise it again on save, so a link
 * typed without leaving the box still saves correctly.
 */
export default function VideoUrlInput({
  name,
  defaultValue = "",
}: {
  name: string;
  defaultValue?: string;
}) {
  const [value, setValue] = useState(defaultValue);
  const source = getVideoSource(value);
  const looksLikeLink = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(value.trim());

  function convert() {
    if (source?.kind === "youtube") setValue(normalizeVideoUrl(value) ?? value);
  }

  return (
    <div>
      <label htmlFor={`video-${name}`} className="mb-2 block font-bold">
        Lesson Video URL
      </label>

      <input
        id={`video-${name}`}
        name={name}
        type="text"
        inputMode="url"
        autoComplete="off"
        spellCheck={false}
        value={value}
        onChange={(event) => setValue(event.target.value)}
        onBlur={convert}
        placeholder="Paste a YouTube link, e.g. https://youtu.be/Ia9FnT_KFtw"
        className="w-full rounded-xl border px-5 py-4 text-lg outline-none focus:border-primary"
      />

      {source?.kind === "youtube" ? (
        <div className="mt-3 flex items-center gap-4 rounded-xl bg-green-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://i.ytimg.com/vi/${source.videoId}/mqdefault.jpg`}
            alt="Thumbnail of this YouTube video"
            className="h-16 w-28 shrink-0 rounded-lg bg-gray-200 object-cover"
          />
          <div className="min-w-0 text-sm">
            <p className="flex items-center gap-1.5 font-bold text-green-700">
              <CheckCircle2 size={16} />
              YouTube video found
            </p>
            <p className="mt-1 break-all text-gray-600">
              Saved as{" "}
              <span className="font-semibold text-ink">
                {normalizeVideoUrl(value)}
              </span>
              {source.start > 0 && ` (starts at ${formatVideoTime(source.start)})`}
            </p>
          </div>
        </div>
      ) : source?.kind === "file" ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-green-700">
          <Film size={16} />
          Video file link. It plays in the lesson player, pop-up questions
          included.
        </p>
      ) : source && looksLikeLink ? (
        <p className="mt-2 flex items-start gap-1.5 text-sm text-gray-600">
          <Link2 size={16} className="mt-0.5 shrink-0" />
          Not a YouTube link, so it&apos;s saved as typed and shown as an
          embedded player. Pop-up questions only work with YouTube links and
          video files.
        </p>
      ) : source ? (
        <p className="mt-2 flex items-center gap-1.5 text-sm font-semibold text-red-700">
          <AlertTriangle size={16} />
          This doesn&apos;t look like a link. Copy the address from YouTube&apos;s
          Share button or the address bar.
        </p>
      ) : (
        <p className="mt-2 text-sm text-gray-500">
          Paste any YouTube link: the Share link, the address from the video
          page, or a Shorts link. It&apos;s converted to the right format
          automatically.
        </p>
      )}
    </div>
  );
}
