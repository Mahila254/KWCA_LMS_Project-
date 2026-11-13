/**
 * English or Kiswahili. The Kiswahili wording itself is in lib/sw.ts; this
 * is only how the choice is made and kept. The switch (EN / SW) and the
 * part that swaps the wording are in components/Language.tsx.
 */
export type Language = "en" | "sw";

export const LANGUAGE_STORAGE_KEY = "kwcf-language";

/** The visitor's choice from the EN / SW button; English if none. */
export function savedLanguage(): Language {
  try {
    return localStorage.getItem(LANGUAGE_STORAGE_KEY) === "sw" ? "sw" : "en";
  } catch {
    return "en";
  }
}

export function setLanguage(language: Language) {
  if (language === "sw") document.documentElement.dataset.lang = "sw";
  else delete document.documentElement.dataset.lang;

  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
  } catch {}
}

// Runs in <head>, so the choice is known before the page is drawn.
export const languageScript = `try{if(localStorage.getItem(${JSON.stringify(
  LANGUAGE_STORAGE_KEY
)})==="sw")document.documentElement.dataset.lang="sw"}catch(e){}`;
