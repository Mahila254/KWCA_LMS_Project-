"use client";

import { useLayoutEffect, useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import {
  THEME_STORAGE_KEY,
  preferredTheme,
  savedTheme,
  type Theme,
} from "@/lib/theme";

// The theme lives on <html data-theme>, set before paint by the script in
// app/layout.tsx. This button reads it from there and flips it.
function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-theme"],
  });

  // Until someone picks a theme, follow the device as it changes.
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const followDevice = () => {
    if (!savedTheme()) document.documentElement.dataset.theme = preferredTheme();
  };
  media.addEventListener("change", followDevice);

  return () => {
    observer.disconnect();
    media.removeEventListener("change", followDevice);
  };
}

function getTheme(): Theme {
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle({ className = "" }: { className?: string }) {
  // null on the server: the real theme is only known in the browser.
  const theme = useSyncExternalStore(subscribe, getTheme, () => null);
  const next: Theme = theme === "dark" ? "light" : "dark";

  // In development React remounts once and wipes attributes it didn't set
  // on <html>, including data-theme. Put it back before paint. (Nothing to
  // do in production, where the layout's script has already set it.)
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.theme) root.dataset.theme = preferredTheme();
  }, []);

  function toggle() {
    document.documentElement.dataset.theme = next;
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={`Switch to ${next} mode`}
      title={`Switch to ${next} mode`}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white/75 hover:bg-white/10 hover:text-white ${className}`}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
