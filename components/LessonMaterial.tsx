import Link from "next/link";
import { Download, PlayCircle, ShieldCheck } from "lucide-react";
import FormattedText from "@/components/FormattedText";

/**
 * The parts of a lesson that are premium: video, notes and reading link.
 * Shared by the lesson page (free preview lessons, rendered on the server)
 * and PremiumLessonGate (premium lessons, rendered in the browser only
 * after the material API confirms the learner has paid).
 */

export type LessonMaterialData = {
  content: string | null;
  notes: string | null;
  videoUrl: string | null;
  readingUrl: string | null;
};

function getYoutubeEmbedUrl(videoUrl: string | null) {
  if (!videoUrl) return null;

  if (videoUrl.includes("youtube.com/embed/")) {
    return videoUrl;
  }

  if (videoUrl.includes("youtube.com/watch?v=")) {
    const videoId = videoUrl.split("v=")[1]?.split("&")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
  }

  if (videoUrl.includes("youtu.be/")) {
    const videoId = videoUrl.split("youtu.be/")[1]?.split("?")[0];
    return videoId ? `https://www.youtube.com/embed/${videoId}` : videoUrl;
  }

  return videoUrl;
}

export function LessonVideo({
  title,
  videoUrl,
}: {
  title: string;
  videoUrl: string | null;
}) {
  const videoEmbedUrl = getYoutubeEmbedUrl(videoUrl);

  if (videoEmbedUrl) {
    return (
      <iframe
        src={videoEmbedUrl}
        title={title}
        className="h-full w-full rounded-3xl"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
      />
    );
  }

  return (
    <div className="px-6 text-center">
      <PlayCircle className="mx-auto mb-4" size={72} />

      <p className="text-3xl font-bold">Lesson Video</p>

      <p className="mt-2 text-white/70">
        Video content will be embedded here once added.
      </p>
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
            <ShieldCheck className="text-[#1E1D59]" size={24} />

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
