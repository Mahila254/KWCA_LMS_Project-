"use client";

import { useEffect, useLayoutEffect, useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { Languages } from "lucide-react";
import { savedLanguage, setLanguage, type Language } from "@/lib/language";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["data-lang"],
  });
  return () => observer.disconnect();
}

/** The language in use ("en" on the server and until loaded). */
export function useLanguage(): Language {
  return useSyncExternalStore(
    subscribe,
    () => (document.documentElement.dataset.lang === "sw" ? "sw" : "en"),
    () => "en"
  );
}

/** The EN / SW button in the top bar. */
export function LanguageToggle({ className = "" }: { className?: string }) {
  const language = useLanguage();
  const next: Language = language === "sw" ? "en" : "sw";

  // In development React remounts once and wipes attributes it didn't set
  // on <html>. Put the choice back before paint (see ThemeToggle).
  useLayoutEffect(() => {
    if (savedLanguage() === "sw") document.documentElement.dataset.lang = "sw";
  }, []);

  const label =
    next === "sw" ? "Badilisha lugha kuwa Kiswahili" : "Switch to English";

  return (
    <button
      type="button"
      translate="no"
      onClick={() => setLanguage(next)}
      aria-label={label}
      title={label}
      className={`flex h-10 items-center gap-1.5 rounded-full px-3 text-xs font-bold tracking-wide text-white/50 hover:bg-white/10 ${className}`}
    >
      <Languages size={16} className="text-white/75" />
      <span className={language === "en" ? "text-white" : ""}>EN</span>
      <span aria-hidden="true">/</span>
      <span className={language === "sw" ? "text-white" : ""}>SW</span>
    </button>
  );
}

// ---------------------------------------------------------------------
// Swapping the wording. Each piece of text on the page is looked up in
// lib/sw.ts; if it's there, the Kiswahili is shown, and the English is
// remembered so switching back is instant. Text that isn't listed, and
// anything inside translate="no", is left alone.
// ---------------------------------------------------------------------

type Lookup = (text: string) => string | null;
type Swap = { en: string; sw: string };

const ATTRIBUTES = ["placeholder", "aria-label", "title", "alt"];
const LEAVE_ALONE =
  'script, style, noscript, textarea, code, pre, [translate="no"], [contenteditable="true"]';

const textSwaps = new WeakMap<Text, Swap>();
const attributeSwaps = new WeakMap<Element, Record<string, Swap>>();

// A page arrives from the server as plain HTML, and React then "takes
// over" each part in turn. Changing words before React has taken a part
// over makes it throw that part away and draw it again, so wording is only
// swapped on parts React already owns (it marks those with a __reactFiber
// property). Anything not ready yet is picked up by a later pass.
const ready = (node: Node | null) =>
  !!node && Object.keys(node).some((key) => key.startsWith("__reactFiber$"));

let somethingNotReady = false;

function translateText(node: Text, lookup: Lookup) {
  const value = node.nodeValue ?? "";
  const known = textSwaps.get(node);
  if (known && known.sw === value) return; // already done

  if (!node.parentElement || node.parentElement.closest(LEAVE_ALONE)) return;

  const kiswahili = lookup(value);
  if (!kiswahili) {
    textSwaps.delete(node);
    return;
  }

  if (!ready(node) && !ready(node.parentElement)) {
    somethingNotReady = true;
    return;
  }

  // Keep the spaces around the words, so sentences don't run together.
  const sw =
    (value.match(/^\s*/)?.[0] ?? "") + kiswahili + (value.match(/\s*$/)?.[0] ?? "");
  textSwaps.set(node, { en: value, sw });
  node.nodeValue = sw;
}

function translateAttribute(element: Element, name: string, lookup: Lookup) {
  const value = element.getAttribute(name);
  if (!value) return;

  const known = attributeSwaps.get(element)?.[name];
  if (known && known.sw === value) return;
  if (element.closest(LEAVE_ALONE)) return;

  const sw = lookup(value);
  if (!sw) return;

  if (!ready(element)) {
    somethingNotReady = true;
    return;
  }

  attributeSwaps.set(element, {
    ...attributeSwaps.get(element),
    [name]: { en: value, sw },
  });
  element.setAttribute(name, sw);
}

function translateTree(root: Node, lookup: Lookup) {
  if (root.nodeType === Node.TEXT_NODE) {
    translateText(root as Text, lookup);
    return;
  }
  if (root.nodeType !== Node.ELEMENT_NODE) return;

  const element = root as Element;
  const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
  const texts: Text[] = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    texts.push(node as Text);
  }
  texts.forEach((text) => translateText(text, lookup));

  const selector = ATTRIBUTES.map((name) => `[${name}]`).join(",");
  const withAttributes = [
    ...(element.matches(selector) ? [element] : []),
    ...element.querySelectorAll(selector),
  ];
  for (const item of withAttributes) {
    for (const name of ATTRIBUTES) translateAttribute(item, name, lookup);
  }
}

/** Puts the English back everywhere it was swapped. */
function restoreEnglish(root: Element) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const swap = textSwaps.get(node as Text);
    if (swap && node.nodeValue === swap.sw) node.nodeValue = swap.en;
    textSwaps.delete(node as Text);
  }

  const selector = ATTRIBUTES.map((name) => `[${name}]`).join(",");
  for (const element of root.querySelectorAll(selector)) {
    const swaps = attributeSwaps.get(element);
    if (!swaps) continue;
    for (const [name, swap] of Object.entries(swaps)) {
      if (element.getAttribute(name) === swap.sw) element.setAttribute(name, swap.en);
    }
    attributeSwaps.delete(element);
  }
}

/**
 * Shows the learner side in Kiswahili when SW is chosen. The admin area
 * always stays in English. Mounted once, in app/layout.tsx.
 */
export function Translator() {
  const language = useLanguage();
  const pathname = usePathname();
  const active = language === "sw" && !pathname.startsWith("/admin");

  useEffect(() => {
    document.documentElement.lang = active ? "sw" : "en";
    if (!active) return;

    let observer: MutationObserver | null = null;
    let stopped = false;
    let retry = 0;
    let retries = 0;

    // The wording is only downloaded by people who choose Kiswahili.
    import("@/lib/sw").then(({ toKiswahili }) => {
      if (stopped) return;

      // Looks again shortly if part of the page wasn't ready (see "ready").
      const lookAgainIfNeeded = () => {
        if (!somethingNotReady) {
          retries = 0;
          return;
        }
        if (retry || retries >= 80) return;

        retry = window.setTimeout(() => {
          retry = 0;
          retries++;
          somethingNotReady = false;
          translateTree(document.body, toKiswahili);
          lookAgainIfNeeded();
        }, 250);
      };

      somethingNotReady = false;
      translateTree(document.body, toKiswahili);
      lookAgainIfNeeded();

      // Pages change as people use them (new pages, messages, results),
      // so anything added or rewritten later is translated too.
      observer = new MutationObserver((changes) => {
        for (const change of changes) {
          if (change.type === "characterData") {
            translateTree(change.target, toKiswahili);
          } else if (change.type === "attributes" && change.attributeName) {
            translateAttribute(
              change.target as Element,
              change.attributeName,
              toKiswahili
            );
          } else {
            change.addedNodes.forEach((node) => translateTree(node, toKiswahili));
          }
        }
        lookAgainIfNeeded();
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true,
        characterData: true,
        attributes: true,
        attributeFilter: ATTRIBUTES,
      });
    });

    return () => {
      stopped = true;
      window.clearTimeout(retry);
      observer?.disconnect();
      restoreEnglish(document.body);
    };
  }, [active]);

  return null;
}
