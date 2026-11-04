/**
 * Light (Cobalt & Lilac) or dark (Evening Wing). The colours themselves
 * are in app/globals.css; this is only how the choice is made and kept.
 */
export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "kwcf-theme";

/** The visitor's own choice from the sun/moon button, if they made one. */
export function savedTheme(): Theme | null {
  try {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved === "light" || saved === "dark" ? saved : null;
  } catch {
    return null;
  }
}

/** Their choice, else whatever the device is set to. */
export function preferredTheme(): Theme {
  return (
    savedTheme() ??
    (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light")
  );
}

/**
 * The same as preferredTheme, as a script for <head> that runs before the
 * page paints, so a dark-mode visitor never sees a flash of the light theme.
 */
export const themeScript = `try{var t=localStorage.getItem(${JSON.stringify(
  THEME_STORAGE_KEY
)});if(t!=="light"&&t!=="dark")t=matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.dataset.theme=t}catch(e){}`;
