"use client";

import {
  useEffect,
  useEffectEvent,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import {
  CheckCircle2,
  HelpCircle,
  Maximize,
  Minimize,
  Play,
  XCircle,
} from "lucide-react";
import { loadYouTubeIframeApi, type YouTubePlayer } from "@/lib/youtubeIframeApi";
import { formatVideoTime, type VideoQuestion } from "@/lib/videoQuestions";
import type { VideoSource } from "@/lib/videoSource";

type Controls = {
  play(): void;
  pause(): void;
  time(): number;
};

// iPhone Safari plays <video> fullscreen through its own controls, outside
// anything the page can draw on.
type WebKitVideo = HTMLVideoElement & {
  webkitDisplayingFullscreen?: boolean;
  webkitExitFullscreen?: () => void;
};

const subscribeNever = () => () => {};

/**
 * A lesson video that pauses at set times for a quick question (see
 * lib/videoQuestions.ts). The learner picks an answer, sees whether it was
 * right and the correct answer underneath, then carries on from the same
 * spot. Right or wrong makes no difference and nothing is saved.
 *
 * Works with YouTube links (through YouTube's player API) and direct video
 * files. Questions the learner skips past by jumping ahead still come up,
 * one after another. On phones the question sits under the paused video,
 * which is too small to hold it; on larger screens and in full screen it
 * covers the video.
 */
export default function InteractiveVideo({
  title,
  source,
  questions,
}: {
  title: string;
  source: Extract<VideoSource, { kind: "youtube" | "file" }>;
  questions: VideoQuestion[];
}) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const youtubeHostRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<WebKitVideo>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const controlsRef = useRef<Controls | null>(null);
  const answeredRef = useRef(new Set<string>());

  const [active, setActive] = useState<VideoQuestion | null>(null);
  const [choice, setChoice] = useState<number | null>(null);
  const [fullscreen, setFullscreen] = useState(false);
  const [youtubeFailed, setYoutubeFailed] = useState(false);

  const canFullscreen = useSyncExternalStore(
    subscribeNever,
    () => document.fullscreenEnabled,
    () => false
  );

  const youtubeId = source.kind === "youtube" ? source.videoId : null;
  const youtubeStart = source.kind === "youtube" ? source.start : 0;

  // Called as the video plays: stop at the first question that's due.
  const checkForQuestion = useEffectEvent(() => {
    const controls = controlsRef.current;
    if (!controls || active) return;

    const now = controls.time();
    const due = questions.find(
      (question) =>
        !answeredRef.current.has(question.id) && question.timeSeconds <= now
    );
    if (!due) return;

    controls.pause();

    // Full screen on the video alone would hide the question.
    if (document.fullscreenElement && document.fullscreenElement !== wrapperRef.current) {
      document.exitFullscreen().catch(() => {});
    }
    if (videoRef.current?.webkitDisplayingFullscreen) {
      videoRef.current.webkitExitFullscreen?.();
    }

    setChoice(null);
    setActive(due);
  });

  // Keep the video still while a question is open, even if play is pressed.
  const holdIfAsking = useEffectEvent(() => {
    if (active) controlsRef.current?.pause();
    else checkForQuestion();
  });

  useEffect(() => {
    const host = youtubeHostRef.current;
    if (!youtubeId || !host) return;

    let player: YouTubePlayer | null = null;
    let timer: number | undefined;
    let cancelled = false;

    loadYouTubeIframeApi()
      .then((YT) => {
        if (cancelled) return;

        // YouTube swaps this element for its iframe, so React mustn't own it.
        const target = document.createElement("div");
        host.appendChild(target);

        const created = new YT.Player(target, {
          videoId: youtubeId,
          width: "100%",
          height: "100%",
          playerVars: {
            start: youtubeStart,
            rel: 0,
            playsinline: 1,
            // YouTube's own full screen would hide the questions; the
            // button under the video goes full screen with them instead.
            fs: 0,
            origin: window.location.origin,
          },
          events: {
            onReady: () => {
              controlsRef.current = {
                play: () => created.playVideo(),
                pause: () => created.pauseVideo(),
                time: () => created.getCurrentTime(),
              };
            },
            onStateChange: (event) => {
              if (event.data === YT.PlayerState.PLAYING) holdIfAsking();
            },
          },
        });
        player = created;

        timer = window.setInterval(() => {
          if (created.getPlayerState?.() === YT.PlayerState.PLAYING) {
            checkForQuestion();
          }
        }, 250);
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setYoutubeFailed(true);
      });

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      controlsRef.current = null;
      player?.destroy();
      host.replaceChildren();
    };
  }, [youtubeId, youtubeStart]);

  useEffect(() => {
    const video = videoRef.current;
    if (source.kind !== "file" || !video) return;

    controlsRef.current = {
      play: () => {
        video.play().catch(() => {});
      },
      pause: () => video.pause(),
      time: () => video.currentTime,
    };

    const check = () => checkForQuestion();
    const hold = () => holdIfAsking();
    video.addEventListener("timeupdate", check);
    video.addEventListener("seeked", check);
    video.addEventListener("play", hold);

    return () => {
      video.removeEventListener("timeupdate", check);
      video.removeEventListener("seeked", check);
      video.removeEventListener("play", hold);
      controlsRef.current = null;
    };
  }, [source.kind]);

  useEffect(() => {
    function onChange() {
      setFullscreen(document.fullscreenElement === wrapperRef.current);
    }
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  // Move focus to the question so keyboard and screen reader users get it.
  useEffect(() => {
    if (active) cardRef.current?.focus();
  }, [active]);

  function toggleFullscreen() {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      wrapperRef.current?.requestFullscreen().catch(() => {});
    }
  }

  function continueVideo() {
    if (!active) return;
    answeredRef.current.add(active.id);
    setActive(null);
    setChoice(null);
    controlsRef.current?.play();
  }

  const answered = choice !== null;
  const correct = active !== null && choice === active.correctIndex;
  const asking = active !== null && !youtubeFailed;
  const count = questions.length;

  return (
    <div
      ref={wrapperRef}
      className={fullscreen ? "flex h-full w-full flex-col bg-black" : ""}
    >
      <div className={fullscreen ? "relative flex-1" : "relative"}>
        <div
          className={`relative overflow-hidden bg-primary text-white ${
            fullscreen ? "h-full" : "aspect-video rounded-3xl"
          }`}
        >
          {source.kind === "youtube" ? (
            youtubeFailed ? (
              <iframe
                src={`https://www.youtube.com/embed/${source.videoId}?rel=0${
                  source.start ? `&start=${source.start}` : ""
                }`}
                title={title}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            ) : (
              <div
                ref={youtubeHostRef}
                title={title}
                className="h-full w-full [&>iframe]:h-full [&>iframe]:w-full"
              />
            )
          ) : (
            <video
              ref={videoRef}
              src={source.src}
              title={title}
              controls
              playsInline
              preload="metadata"
              controlsList={count > 0 ? "nofullscreen" : undefined}
              disablePictureInPicture={count > 0}
              className="h-full w-full bg-black"
            />
          )}

          {asking && (
            // Covers the video so it can't be played until they answer.
            <div className="absolute inset-0 flex items-end justify-center bg-deep/85 p-4 backdrop-blur-sm">
              <p
                className={`text-sm font-bold text-white/80 ${
                  fullscreen ? "hidden" : "md:hidden"
                }`}
              >
                Video paused &middot; answer the question below
              </p>
            </div>
          )}
        </div>

        {asking && active && (
          <div
            className={
              fullscreen
                ? "absolute inset-0 flex overflow-y-auto p-6"
                : "mt-4 md:absolute md:inset-0 md:mt-0 md:flex md:overflow-y-auto md:p-8"
            }
          >
            <div
              ref={cardRef}
              tabIndex={-1}
              role="dialog"
              aria-modal="false"
              aria-labelledby="video-question-text"
              className="m-auto w-full max-w-xl rounded-3xl bg-surface p-5 text-ink shadow-xl outline-none ring-1 ring-primary/10 md:p-7 md:shadow-2xl"
            >
              <p className="inline-flex items-center gap-2 rounded-full bg-lilac-tint px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-accent">
                <HelpCircle size={14} />
                Quick question &middot; {formatVideoTime(active.timeSeconds)}
              </p>

              <h3
                id="video-question-text"
                className="mt-3 text-lg font-extrabold leading-snug md:text-xl"
              >
                {active.question}
              </h3>

              <div
                className={`mt-4 grid gap-2 ${
                  active.options.length === 2 ? "grid-cols-2" : "sm:grid-cols-2"
                }`}
              >
                {active.options.map((option, index) => {
                  const isAnswer = index === active.correctIndex;
                  const isChoice = index === choice;

                  let style =
                    "border-gray-200 hover:border-primary hover:bg-tint";
                  if (answered && isAnswer) {
                    style = "border-green-600 bg-green-50 text-green-800";
                  } else if (answered && isChoice) {
                    style = "border-red-500 bg-red-50 text-red-800";
                  } else if (answered) {
                    style = "border-gray-200 text-gray-400";
                  }

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={answered}
                      onClick={() => setChoice(index)}
                      aria-pressed={isChoice}
                      className={`flex items-center justify-between gap-2 rounded-2xl border-2 px-4 py-3 text-left font-bold transition-colors ${style}`}
                    >
                      <span>{option}</span>
                      {answered && isAnswer && (
                        <CheckCircle2 size={18} className="shrink-0" />
                      )}
                      {answered && isChoice && !isAnswer && (
                        <XCircle size={18} className="shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div aria-live="polite">
                {answered ? (
                  <div className="mt-4 border-t pt-4">
                    <p
                      className={`flex items-center gap-2 font-extrabold ${
                        correct ? "text-green-700" : "text-accent"
                      }`}
                    >
                      {correct ? (
                        <CheckCircle2 size={20} />
                      ) : (
                        <XCircle size={20} />
                      )}
                      {correct ? "Correct!" : "Not quite."}
                    </p>

                    <p className="mt-1 text-gray-700">
                      The answer is{" "}
                      <strong className="text-ink">
                        {active.options[active.correctIndex]}
                      </strong>
                      .
                    </p>

                    {active.explanation && (
                      <p className="mt-2 text-sm leading-6 text-gray-600">
                        {active.explanation}
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={continueVideo}
                      className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-5 py-3 font-bold text-white hover:bg-secondary-hover"
                    >
                      <Play size={16} />
                      Continue video
                    </button>
                  </div>
                ) : (
                  <p className="mt-3 text-sm text-gray-500">
                    Pick an answer to carry on with the video.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {!youtubeFailed && count > 0 && (
        <div
          className={`flex flex-wrap items-center justify-between gap-3 text-sm ${
            fullscreen ? "px-4 py-3 text-white/80" : "mt-4 text-gray-600"
          }`}
        >
          <p className="inline-flex items-center gap-2 font-semibold">
            <HelpCircle size={16} className="shrink-0 text-accent" />
            {count} quick {count === 1 ? "question" : "questions"} in this
            video. It pauses so you can answer.
          </p>

          {canFullscreen && (
            <button
              type="button"
              onClick={toggleFullscreen}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-bold ${
                fullscreen
                  ? "border-white/30 text-white hover:bg-white/10"
                  : "hover:bg-gray-50"
              }`}
            >
              {fullscreen ? <Minimize size={16} /> : <Maximize size={16} />}
              {fullscreen ? "Exit full screen" : "Full screen"}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
