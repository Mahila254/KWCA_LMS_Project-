"use client";

import { useEffect, useRef, useState } from "react";
import { AlertTriangle, CheckCircle2, Info, X } from "lucide-react";
import {
  CONFIRM_EVENT,
  NOTICE_EVENT,
  type ConfirmEvent,
  type NoticeEvent,
  type NoticeKind,
} from "@/lib/notify";

type Notice = NoticeEvent & { id: number };

const icons: Record<NoticeKind, React.ReactNode> = {
  success: <CheckCircle2 size={20} className="shrink-0 text-green-700" />,
  error: <AlertTriangle size={20} className="shrink-0 text-red-700" />,
  info: <Info size={20} className="shrink-0 text-accent" />,
};

// Long enough to read; errors stay a little longer.
const SECONDS: Record<NoticeKind, number> = { success: 5, info: 6, error: 9 };

/**
 * Draws the messages sent by notify() and confirmAction() (lib/notify).
 * Mounted once, in the root layout.
 */
export default function Notifications() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [question, setQuestion] = useState<ConfirmEvent | null>(null);
  const nextId = useRef(1);
  const confirmButton = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    function onNotice(event: Event) {
      const detail = (event as CustomEvent<NoticeEvent>).detail;
      const id = nextId.current++;

      // The same message twice in a row (a double click) shows once.
      setNotices((current) =>
        current.some((notice) => notice.message === detail.message)
          ? current
          : [...current.slice(-3), { ...detail, id }]
      );

      window.setTimeout(
        () => setNotices((current) => current.filter((notice) => notice.id !== id)),
        SECONDS[detail.kind] * 1000
      );
    }

    function onConfirm(event: Event) {
      setQuestion((event as CustomEvent<ConfirmEvent>).detail);
    }

    window.addEventListener(NOTICE_EVENT, onNotice);
    window.addEventListener(CONFIRM_EVENT, onConfirm);
    return () => {
      window.removeEventListener(NOTICE_EVENT, onNotice);
      window.removeEventListener(CONFIRM_EVENT, onConfirm);
    };
  }, []);

  // Focus goes to the action, and Escape cancels.
  useEffect(() => {
    if (!question) return;
    confirmButton.current?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") answer(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [question]);

  function answer(confirmed: boolean) {
    question?.resolve(confirmed);
    setQuestion(null);
  }

  return (
    <>
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-20 z-[70] flex flex-col items-center gap-2 px-4 sm:items-end sm:px-6"
      >
        {notices.map((notice) => (
          <div
            key={notice.id}
            role={notice.kind === "error" ? "alert" : "status"}
            className="pointer-events-auto flex w-full max-w-sm animate-rise items-start gap-3 rounded-2xl border border-line bg-surface p-4 text-ink shadow-[0_18px_40px_-18px_rgb(var(--shadow-tint)/0.55)]"
            style={{ animationDuration: "0.35s" }}
          >
            {icons[notice.kind]}
            <p className="min-w-0 flex-1 whitespace-pre-line text-sm font-semibold leading-6">
              {notice.message}
            </p>
            <button
              type="button"
              onClick={() =>
                setNotices((current) => current.filter((item) => item.id !== notice.id))
              }
              aria-label="Dismiss message"
              className="-m-1 rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-ink"
            >
              <X size={16} />
            </button>
          </div>
        ))}
      </div>

      {question && (
        <div
          className="fixed inset-0 z-[80] flex items-center justify-center bg-deep/60 p-4 backdrop-blur-sm"
          onClick={() => answer(false)}
        >
          <div
            role="alertdialog"
            aria-modal="true"
            aria-describedby="confirm-message"
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md animate-rise rounded-3xl bg-surface p-6 text-ink shadow-2xl sm:p-8"
            style={{ animationDuration: "0.3s" }}
          >
            <p
              id="confirm-message"
              className="whitespace-pre-line text-lg font-semibold leading-8"
            >
              {question.message}
            </p>

            <div className="mt-6 flex flex-wrap justify-end gap-3">
              <button
                type="button"
                onClick={() => answer(false)}
                className="rounded-full border border-line px-5 py-3 font-bold hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                ref={confirmButton}
                type="button"
                onClick={() => answer(true)}
                className={`rounded-full px-5 py-3 font-bold text-white ${
                  question.danger
                    ? "bg-red-600 hover:brightness-90"
                    : "bg-primary hover:bg-primary-hover"
                }`}
              >
                {question.confirmLabel}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
