import Link from "next/link";
import { Download, PlayCircle, ShieldCheck } from "lucide-react";
import FormattedText from "@/components/FormattedText";
import InteractiveVideo from "@/components/InteractiveVideo";
import { getVideoSource } from "@/lib/videoSource";
import type { VideoQuestion } from "@/lib/videoQuestions";

/**
 * The parts of a lesson that are premium: video (with its pop-up
 * questions), notes and reading link.
 * Shared by the lesson page (free preview lessons, rendered on the server)
 * and PremiumLessonGate (premium lessons, rendered in the browser only
 * after the material API confirms the learner has paid).
 */

export type LessonMaterialData = {
  content: string | null;
  notes: string | null;
  videoUrl: string | null;
  readingUrl: string | null;
  videoQuestions: VideoQuestion[];
};

/**
 * The lesson video, in its own 16:9 box. Video files, and YouTube videos
 * with pop-up questions, get the player that can pause for them
 * (components/InteractiveVideo.tsx); anything else is a plain embed.
 */
export function LessonVideo({
  title,
  videoUrl,
  videoQuestions = [],
}: {
  title: string;
  videoUrl: string | null;
  videoQuestions?: VideoQuestion[];
}) {
  const source = getVideoSource(videoUrl);

  if (
    source?.kind === "file" ||
    (source?.kind === "youtube" && videoQuestions.length > 0)
  ) {
    return (
      <InteractiveVideo
        title={title}
        source={source}
        questions={videoQuestions}
      />
    );
  }

  const embedUrl =
    source?.kind === "youtube"
      ? `https://www.youtube.com/embed/${source.videoId}?rel=0${
          source.start ? `&start=${source.start}` : ""
        }`
      : (source?.src ?? null);

  return (
    <div className="flex aspect-video items-center justify-center overflow-hidden rounded-3xl bg-primary text-white">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          title={title}
          className="h-full w-full rounded-3xl"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <div className="px-6 text-center">
          <PlayCircle className="mx-auto mb-4" size={72} />

          <p className="text-3xl font-bold">Lesson Video</p>

          <p className="mt-2 text-white/70">
            Video content will be embedded here once added.
          </p>
        </div>
      )}
    </div>
  );
}

export function LessonNotes({
  content,
  notes,
}: {
  content: string | null;
  notes: string | null;
}) {
  return (
    <>
      {content ? (
        <FormattedText text={content} />
      ) : (
        <p className="text-lg leading-8 text-gray-600">
          Lesson content will appear here once added by the admin.
        </p>
      )}

      {notes && (
        <div className="mt-8 rounded-2xl bg-gray-50 p-6">
          <div className="mb-4 flex items-center gap-3">
            <ShieldCheck className="text-ink" size={24} />

            <h3 className="text-xl font-bold">Key Takeaway</h3>
          </div>

          <FormattedText text={notes} />
        </div>
      )}
    </>
  );
}

export function LessonReadingLink({
  readingUrl,
}: {
  readingUrl: string | null;
}) {
  if (readingUrl) {
    return (
      <Link
        href={readingUrl}
        className="mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-3 font-bold hover:bg-gray-50"
      >
        <Download size={18} />
        Download Reading
      </Link>
    );
  }

  return (
    <button
      type="button"
      className="mt-5 inline-flex items-center gap-2 rounded-full border px-5 py-3 font-bold text-gray-400"
    >
      <Download size={18} />
      Reading Coming Soon
    </button>
  );
}
