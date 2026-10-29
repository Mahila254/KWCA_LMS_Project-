import type { ReactNode } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Mail,
  MapPin,
  MessageSquareWarning,
  Phone,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export type LegalSection = {
  id: string;
  title: string;
  content: ReactNode;
};

/**
 * Shared layout for the Privacy Policy and Terms pages: a title band,
 * a contents list (sticky on desktop, a fold-out on phones) and numbered
 * sections. Body copy is styled here so the pages only write plain
 * <p>, <ul> and <strong>.
 */
export default function LegalPage({
  eyebrow,
  title,
  accent,
  intro,
  updated,
  sections,
  related,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  intro: ReactNode;
  updated: string;
  sections: LegalSection[];
  related: { href: string; label: string };
}) {
  const contents = (
    <ol className="space-y-1 text-sm">
      {sections.map((section, index) => (
        <li key={section.id}>
          <a
            href={`#${section.id}`}
            className="flex gap-3 rounded-lg px-3 py-1.5 text-gray-600 hover:bg-[#F1F0FA] hover:text-[#1E1D59]"
          >
            <span className="w-5 shrink-0 tabular-nums text-gray-400">
              {index + 1}.
            </span>
            {section.title}
          </a>
        </li>
      ))}
    </ol>
  );

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-gray-50 text-[#1E1D59]">
        <section className="bg-[#F8F4F4] py-12 md:py-16">
          <div className="mx-auto max-w-6xl px-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#632854]">
              {eyebrow}
            </p>

            <h1 className="mt-3 text-4xl font-bold md:text-5xl">
              {title} <em className="accent text-[#632854]">{accent}</em>
            </h1>

            <div className="mt-4 max-w-3xl text-lg leading-8 text-gray-600">
              {intro}
            </div>

            <p className="mt-5 text-sm font-semibold text-gray-500">
              Last updated: {updated}
            </p>
          </div>
        </section>

        <section className="mx-auto grid max-w-6xl gap-8 px-6 py-10 md:py-14 lg:grid-cols-[260px_1fr] lg:gap-12">
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <details className="group rounded-2xl bg-white p-4 shadow-sm lg:hidden">
              <summary className="flex cursor-pointer list-none items-center justify-between font-bold">
                Contents
                <ChevronDown
                  size={18}
                  className="transition-transform duration-300 group-open:rotate-180"
                />
              </summary>
              <div className="mt-3">{contents}</div>
            </details>

            <div className="hidden lg:block">
              <p className="mb-3 px-3 text-xs font-bold uppercase tracking-[0.18em] text-gray-400">
                Contents
              </p>
              {contents}
            </div>
          </aside>

          <div className="min-w-0 space-y-6">
            {sections.map((section, index) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28 rounded-3xl bg-white p-6 shadow-sm md:p-8"
              >
                <h2 className="flex gap-3 text-2xl font-bold">
                  <span className="text-[#632854]">{index + 1}.</span>
                  {section.title}
                </h2>

                <div className="mt-4 space-y-3 leading-7 text-gray-700 [&_h3]:pt-2 [&_h3]:font-bold [&_h3]:text-[#1E1D59] [&_li]:pl-1 [&_strong]:text-[#1E1D59] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5 [&_ul_ul]:mt-2 [&_ul_ul]:list-[circle] [&_a]:font-semibold [&_a]:text-[#632854] [&_a]:underline [&_a]:underline-offset-2">
                  {section.content}
                </div>
              </article>
            ))}

            <div
              id="contact"
              className="scroll-mt-28 rounded-3xl bg-[#1E1D59] p-6 text-white md:p-8"
            >
              <h2 className="text-2xl font-bold">Contact us</h2>

              <a
                href="mailto:complaints@kwcakenya.com"
                className="group mt-5 flex items-start gap-4 rounded-2xl bg-white p-5 text-[#1E1D59] hover:bg-[#FBEFF4]"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#FBEFF4] text-[#632854] group-hover:bg-white">
                  <MessageSquareWarning size={20} />
                </span>
                <span className="min-w-0">
                  <span className="block font-bold">
                    Complaints and data requests
                  </span>
                  <span className="mt-1 block text-sm leading-6 text-gray-600">
                    To raise a complaint, or to ask for a copy, correction or
                    deletion of your data, email us from the address on your
                    account.
                  </span>
                  <span className="mt-2 block break-words font-bold text-[#632854]">
                    complaints@kwcakenya.com
                  </span>
                </span>
              </a>

              <p className="mt-6 text-sm font-bold text-white/60">
                General enquiries
              </p>

              <ul className="mt-3 grid gap-3 text-sm sm:grid-cols-2">
                {[
                  { icon: Mail, text: "info@kwcakenya.com", href: "mailto:info@kwcakenya.com" },
                  { icon: Phone, text: "+254 708 418 522 (mobile)", href: "tel:+254708418522" },
                  { icon: Phone, text: "+254 (20) 251 8211 (landline)", href: "tel:+254202518211" },
                ].map((item) => (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      className="flex h-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 hover:bg-white/15"
                    >
                      <item.icon size={16} className="shrink-0" />
                      {item.text}
                    </a>
                  </li>
                ))}
                <li className="flex h-full items-center gap-3 rounded-2xl bg-white/10 px-4 py-3">
                  <MapPin size={16} className="shrink-0" />
                  <span>
                    Seminary Road, off Magadi Road, Karen
                    <span className="block text-white/60">
                      P.O. Box 1038 – 00517, Nairobi
                    </span>
                  </span>
                </li>
              </ul>

              <p className="mt-5 text-sm text-white/60">
                See also our{" "}
                <Link href={related.href} className="font-semibold text-white underline underline-offset-2">
                  {related.label}
                </Link>
                .
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
