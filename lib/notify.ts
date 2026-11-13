/**
 * On-page messages, in place of the browser's alert() and confirm() boxes.
 *
 *   notify("Course saved.")                 a notice that slides in
 *   if (await confirmAction("Delete?")) …   a dialog with two buttons
 *
 * Both hand the message to <Notifications /> (in the root layout), which
 * draws it. A notice stays up across page changes, so it's safe to call
 * notify() and then move the learner to another page.
 */

export type NoticeKind = "success" | "error" | "info";

export type NoticeEvent = { message: string; kind: NoticeKind };

export type ConfirmEvent = {
  message: string;
  confirmLabel: string;
  danger: boolean;
  resolve: (confirmed: boolean) => void;
};

export const NOTICE_EVENT = "kwca:notice";
export const CONFIRM_EVENT = "kwca:confirm";

// Most messages say what they are; this saves labelling every call.
function guessKind(message: string): NoticeKind {
  if (/^✅|success|saved|updated|created|added|deleted|removed|copied|confirmed|welcome/i.test(message)) {
    return "success";
  }
  if (/wrong|error|fail|unable|could ?n[o']t|invalid|required|must|please|not found|expired|denied|too many/i.test(message)) {
    return "error";
  }
  return "info";
}

export function notify(message: string, kind?: NoticeKind) {
  if (typeof window === "undefined") return;

  // Older messages began with an emoji tick; the notice has its own icon.
  const text = message.replace(/^[✅❌⚠️\s]+/u, "").trim();

  window.dispatchEvent(
    new CustomEvent<NoticeEvent>(NOTICE_EVENT, {
      detail: { message: text, kind: kind ?? guessKind(message) },
    })
  );
}

/** Asks a yes/no question. Resolves true only if they press the action. */
export function confirmAction(
  message: string,
  options: { confirmLabel?: string; danger?: boolean } = {}
): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);

  return new Promise((resolve) => {
    window.dispatchEvent(
      new CustomEvent<ConfirmEvent>(CONFIRM_EVENT, {
        detail: {
          message,
          confirmLabel: options.confirmLabel ?? "Yes, continue",
          danger: options.danger ?? /delete|remove|cannot be undone|permanent/i.test(message),
          resolve,
        },
      })
    );
  });
}
