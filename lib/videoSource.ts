/**
 * Works out what kind of video a lesson link points to. Pop-up questions
 * need a player the page can pause and read the time from, which YouTube
 * links and direct video files have; any other embed link still plays, but
 * without the questions.
 */

export type VideoSource =
  | { kind: "youtube"; videoId: string; start: number }
  | { kind: "file"; src: string }
  | { kind: "embed"; src: string };

const YOUTUBE_ID =
  /(?:youtube(?:-nocookie)?\.com\/(?:embed\/|shorts\/|live\/|v\/|watch\?(?:[^#]*&)?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

const VIDEO_FILE = /\.(mp4|webm|ogv|ogg|mov|m4v)$/i;

/** "90", "90s", "1m30s" → seconds. YouTube links use all three. */
function parseStart(value: string | null) {
  if (!value) return 0;
  const match = value.match(/^(?:(\d+)h)?(?:(\d+)m)?(?:(\d+)s?)?$/);
  if (!match) return 0;
  const [, hours = "0", minutes = "0", seconds = "0"] = match;
  return Number(hours) * 3600 + Number(minutes) * 60 + Number(seconds);
}

export function getVideoSource(videoUrl: string | null): VideoSource | null {
  const url = videoUrl?.trim();
  if (!url) return null;

  const youtubeId = url.match(YOUTUBE_ID)?.[1];
  let parsed: URL | null = null;
  try {
    parsed = new URL(url);
  } catch {
    // Not a full link; fall through and treat it as an embed as before.
  }

  if (youtubeId) {
    const start = parseStart(
      parsed?.searchParams.get("start") ?? parsed?.searchParams.get("t") ?? null
    );
    return { kind: "youtube", videoId: youtubeId, start };
  }

  if (parsed && VIDEO_FILE.test(parsed.pathname)) {
    return { kind: "file", src: url };
  }

  return { kind: "embed", src: url };
}

/** The embed address the platform plays a YouTube video from. */
export function youtubeEmbedUrl(videoId: string, start = 0) {
  return `https://www.youtube.com/embed/${videoId}${start > 0 ? `?start=${start}` : ""}`;
}

/**
 * What to save for a lesson video. Any YouTube link (share link, watch
 * page, Shorts, live, with or without https://) becomes the embed address,
 * keeping a start time if the link had one. Other links are kept as typed.
 */
export function normalizeVideoUrl(videoUrl: string | null) {
  const source = getVideoSource(videoUrl);
  if (!source) return null;
  return source.kind === "youtube"
    ? youtubeEmbedUrl(source.videoId, source.start)
    : source.src;
}
