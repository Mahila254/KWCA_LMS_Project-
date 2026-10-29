import type { CSSProperties } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { modules } from "@/data/modules";
import {
  ArrowRight,
  ArrowUpRight,
  Award,
  ChevronDown,
  Clock,
  Download,
  GraduationCap,
  MessageCircle,
  FileText,
  Target,
  Users,
  Video,
} from "lucide-react";

// Built from scripts/brochure/brochure.html (see build-brochure.mjs there).
const BROCHURE_URL = "/brochure/kwca-learning-hub-brochure.pdf";

const stats = [
  { value: `${modules.length}+`, label: "Learning Modules" },
  { value: "400+", label: "Conservancies in Kenya" },
  { value: "1", label: "Movement" },
];

const aboutPoints = [
  {
    icon: Target,
    title: "Our Mission",
    text: "Empower conservancy leaders with the knowledge and tools to build sustainable, community centred conservation initiatives.",
    tone: "pink",
  },
  {
    icon: Users,
    title: "Community First",
    text: "Place women and youth at the centre of conservation leadership, creating lasting intergenerational impact in conservancy communities.",
    tone: "lavender",
  },
  {
    icon: Award,
    title: "World-Class Standards",
    text: "Meet international Greenlisting criteria and build credible carbon projects that position Kenya as a global conservation leader.",
    tone: "lavender",
  },
];

const platformFeatures = [
  {
    icon: GraduationCap,
    title: "Expert-Led Content",
    text: "Learn from experienced conservancy managers and wildlife conservation professionals.",
    tone: "navy",
  },
  {
    icon: Video,
    title: "Interactive Learning",
    text: "Video tutorials, case studies, and real-world examples from Kenya's conservancies.",
    tone: "burgundy",
  },
  {
    icon: Download,
    title: "Downloadable Resources",
    text: "Templates, guides, and tools ready to implement in your conservancy immediately.",
    tone: "navy",
  },
  {
    icon: MessageCircle,
    title: "Community Network",
    text: "Connect with fellow conservancy leaders and share experiences across Kenya.",
    tone: "burgundy",
  },
];

// Topic names for the slow-scrolling strip under the hero. Listed twice
// in the markup so the loop is seamless.
const topics = Array.from(new Set(modules.map((item) => item.title)));

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#1E1D59]">
        {/* HERO: full-bleed photo, headline anchored bottom-left */}
        <section className="relative isolate flex min-h-[calc(100svh-4.5rem)] flex-col overflow-hidden">
          <div
            className="absolute inset-0 -z-10 animate-ken-burns bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-transparent via-[#1E1D59]/10 to-[#1E1D59]/55" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#1E1D59]/45 via-[#1E1D59]/10 to-transparent" />

          <div className="mx-auto flex w-full max-w-7xl flex-1 flex-col justify-end px-6 pb-10 pt-24 md:pb-14">
            <span
              className="mb-6 inline-flex w-fit animate-fade items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-white/90 backdrop-blur-md"
              style={{ animationDelay: "100ms" }}
            >
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#F0A8C4]" />
              KWCF Learning Platform
            </span>

            <div className="grid items-end gap-8 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
              <h1
                className="text-5xl font-bold leading-[0.98] text-white sm:text-6xl md:text-7xl xl:text-8xl"
                style={{ textShadow: "0 4px 28px rgba(0,0,0,0.35)" }}
              >
                <span className="line-mask">
                  <span style={{ "--line-delay": "150ms" } as CSSProperties}>
                    Conservancies
                  </span>
                </span>
                <span className="line-mask">
                  <span style={{ "--line-delay": "280ms" } as CSSProperties}>
                    <em className="accent text-[#C9C4EE]">Learning Hub</em>
                  </span>
                </span>
              </h1>

              <div className="animate-rise" style={{ animationDelay: "450ms" }}>
                <p
                  className="mb-8 max-w-md text-lg leading-8 text-white/90"
                  style={{ textShadow: "0 2px 16px rgba(0,0,0,0.45)" }}
                >
                  Empowering wildlife conservation leaders with expert led
                  training in conservancy management, governance, and
                  sustainable development.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link
                    href="/courses"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#632854] py-4 pl-7 pr-5 text-base font-bold text-white shadow-[0_14px_30px_-10px_rgba(99,40,84,0.9)] hover:-translate-y-0.5 hover:bg-[#4F2043]"
                  >
                    Start Learning
                    <ArrowRight
                      size={19}
                      className="transition-transform duration-300 group-hover:translate-x-1"
                    />
                  </Link>

                  {/* Swap back to a "Watch Overview" video once one exists. */}
                  <a
                    href={BROCHURE_URL}
                    target="_blank"
                    rel="noopener"
                    className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/5 px-6 py-4 text-base font-bold text-white backdrop-blur-md hover:border-white hover:bg-white/15"
                  >
                    <FileText size={19} />
                    Read the Brochure
                  </a>
                </div>
              </div>
            </div>

            {/* Stats ride along the bottom of the hero */}
            <div
              className="mt-10 grid animate-rise grid-cols-3 divide-x divide-white/15 rounded-3xl border border-white/15 bg-[#1E1D59]/35 py-5 text-white backdrop-blur-md md:mt-12"
              style={{ animationDelay: "650ms" }}
            >
              {stats.map((stat) => (
                <div key={stat.label} className="px-3 text-center sm:px-6">
                  <p className="text-3xl font-bold tracking-tight md:text-5xl">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-xs font-semibold text-white/70 sm:text-sm">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <a
            href="#about"
            aria-label="Scroll to About"
            className="absolute bottom-3 left-1/2 hidden -translate-x-1/2 text-white/70 hover:text-white md:block"
          >
            <ChevronDown size={22} className="animate-float" />
          </a>
        </section>

        {/* TOPIC STRIP */}
        <section
          aria-label="Topics covered"
          className="overflow-hidden bg-gradient-to-r from-[#1E1D59] to-[#302A57] py-5"
        >
          <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
            {[0, 1].map((copy) => (
              <ul
                key={copy}
                aria-hidden={copy === 1}
                className="flex shrink-0 items-center"
              >
                {topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-center gap-6 pr-6 text-lg font-semibold text-white/85 md:text-xl"
                  >
                    {topic}
                    <span className="h-1.5 w-1.5 rounded-full bg-[#F0A8C4]" />
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl items-center gap-10 md:grid-cols-2 lg:gap-14">
            <ScrollReveal>
              <span className="mb-5 inline-block rounded-full bg-[#FBE4EA] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#632854]">
                About the Hub
              </span>

              <h2 className="mb-6 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
                Building Stronger{" "}
                <em className="accent text-[#632854]">
                  Conservancies Across Kenya
                </em>
              </h2>

              <p className="mb-8 text-lg leading-8 text-gray-600">
                The Kenya Conservancies Learning Hub is your comprehensive
                platform for establishing, managing, and growing successful
                wildlife conservancies that benefit both nature and
                communities. Hosted by the Kenya Wildlife Conservancies
                Foundation in partnership with KWCA.
              </p>

              <ol className="divide-y divide-gray-100 border-y border-gray-100">
                {aboutPoints.map((point, index) => (
                  <li key={point.title} className="group flex gap-5 py-5">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-105 ${
                        point.tone === "pink"
                          ? "bg-[#F5DCE6] text-[#632854]"
                          : "bg-[#E4E1F5] text-[#1E1D59]"
                      }`}
                    >
                      <point.icon size={22} />
                    </div>

                    <div>
                      <h3 className="flex items-baseline gap-3 text-lg font-bold">
                        <span className="font-serif text-base font-normal italic text-gray-400">
                          0{index + 1}
                        </span>
                        {point.title}
                      </h3>
                      <p className="mt-1 leading-7 text-gray-600">{point.text}</p>
                    </div>
                  </li>
                ))}
              </ol>

              <Link
                href="/courses"
                className="group mt-8 inline-flex items-center gap-2 font-bold text-[#632854] hover:gap-3"
              >
                Learn more about KWCF
                <ArrowRight size={18} />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="relative" delay={120}>
              <div className="group overflow-hidden rounded-[2rem] shadow-sm">
                <img
                  src="/images/hero-conservancy.jpg"
                  alt="Conservancy landscape"
                  className="h-[380px] w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105 md:h-[500px]"
                />
              </div>

              <div className="absolute -bottom-6 left-6 animate-float rounded-2xl bg-[#1E1D59] px-6 py-4 text-white shadow-xl">
                <p className="text-3xl font-bold">{modules.length}+</p>
                <p className="text-sm font-semibold text-white/70">
                  Learning Modules
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* KEY LEARNING TOPICS: bento grid, lead module gets the big tile */}
        <section id="courses" className="bg-gray-50 px-6 py-16 md:py-20">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-10 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <h2 className="text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
                Key Learning
                <br />
                <em className="accent text-[#632854]">Topics</em>
              </h2>

              <p className="max-w-md text-lg leading-8 text-gray-600">
                Comprehensive, expert-led modules designed to equip you with
                the skills to excel in wildlife conservation management.
              </p>
            </ScrollReveal>

            {/* Phones: a sideways swipe row. md and up: the bento grid. */}
            <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:snap-none md:grid-cols-2 md:gap-6 md:overflow-visible md:px-0 md:pb-0 xl:grid-cols-3">
              {modules.map((item, index) => {
                const lead = index === 0;

                return (
                  <ScrollReveal
                    key={item.slug}
                    delay={(index % 3) * 80}
                    className={`w-[82%] shrink-0 snap-start md:w-auto ${
                      lead ? "md:col-span-2 xl:row-span-2" : ""
                    }`}
                  >
                    {lead ? (
                      <Link
                        href="/courses"
                        className="group relative flex h-full min-h-[420px] flex-col justify-end overflow-hidden rounded-3xl bg-[#1E1D59] p-6 text-white shadow-sm hover:shadow-xl md:p-10"
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#1E1D59] via-[#1E1D59]/40 to-transparent" />

                        <div className="relative">
                          <div className="mb-4 flex items-center gap-2">
                            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold backdrop-blur-md">
                              {item.category}
                            </span>
                            <span className="rounded-full bg-[#632854] px-3 py-1 text-xs font-bold">
                              Start here
                            </span>
                          </div>

                          <h3 className="mb-3 max-w-xl text-3xl font-bold leading-tight md:text-5xl">
                            {item.title}
                          </h3>
                          <p className="mb-6 max-w-lg leading-7 text-white/80">
                            {item.description}
                          </p>

                          <span className="inline-flex items-center gap-2 rounded-full bg-white py-3 pl-5 pr-4 text-sm font-bold text-[#1E1D59] transition-[gap] duration-300 group-hover:gap-3">
                            Start module
                            <ArrowRight size={16} />
                          </span>
                        </div>
                      </Link>
                    ) : (
                      <Link
                        href="/courses"
                        className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-black/[0.03] hover:-translate-y-1.5 hover:shadow-xl"
                      >
                        <div className="relative h-44 overflow-hidden">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="h-full w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                          <span className="absolute left-4 top-4 rounded-full bg-[#1E1D59] px-3 py-1 text-xs font-bold text-white">
                            {item.category}
                          </span>

                          <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#632854] text-xs font-bold text-white">
                            {index + 1}
                          </span>
                        </div>

                        <div className="flex flex-1 flex-col p-6">
                          <h3 className="mb-2 text-xl font-bold leading-snug group-hover:text-[#632854]">
                            {item.title}
                          </h3>

                          <p className="mb-6 line-clamp-3 flex-1 leading-7 text-gray-600">
                            {item.description}
                          </p>

                          <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                            <span className="flex items-center gap-2 text-gray-500">
                              <Clock size={15} />
                              Self-paced
                            </span>

                            <span className="flex items-center gap-1 font-bold text-[#632854]">
                              Start module
                              <ArrowRight
                                size={15}
                                className="transition-transform duration-300 group-hover:translate-x-1"
                              />
                            </span>
                          </div>
                        </div>
                      </Link>
                    )}
                  </ScrollReveal>
                );
              })}
            </div>

            <ScrollReveal className="mt-6">
              <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-[#1E1D59] px-8 py-8 text-white sm:flex-row sm:items-center">
                <div>
                  <h3 className="text-2xl font-bold">
                    More Modules{" "}
                    <em className="accent text-[#C9C4EE]">Coming Soon</em>
                  </h3>
                  <p className="mt-1 text-white/70">
                    We&apos;re expanding the curriculum with new modules, case
                    studies, and resources every quarter.
                  </p>
                </div>

                <Link
                  href="/courses"
                  className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#632854] py-4 pl-6 pr-5 font-bold text-white hover:bg-[#4F2043]"
                >
                  Explore All Modules
                  <ArrowRight
                    size={18}
                    className="transition-transform duration-300 group-hover:translate-x-1"
                  />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* WHY THIS PLATFORM */}
        <section id="why-platform" className="bg-[#F8F4F4] px-6 py-16 md:py-20">
          <div className="mx-auto grid max-w-7xl items-start gap-10 md:grid-cols-2 lg:gap-14">
            <ScrollReveal className="md:sticky md:top-28">
              <span className="mb-5 inline-block rounded-full bg-[#E4E1F5] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-[#1E1D59]">
                Why This Platform
              </span>

              <h2 className="mb-6 text-4xl font-bold leading-[1.05] md:text-5xl lg:text-6xl">
                Built for Kenya&apos;s{" "}
                <em className="accent text-[#632854]">
                  Conservation Landscape
                </em>
              </h2>

              <p className="mb-8 text-lg leading-8 text-gray-600">
                Our platform is specifically designed for Kenya&apos;s
                unique conservation context — offering practical, actionable
                knowledge you can apply directly to your conservancy.
              </p>

              <div className="overflow-hidden rounded-3xl shadow-sm">
                <img
                  src="/images/learning-dashboard.jpg"
                  alt="Kenya conservation landscape"
                  className="h-[300px] w-full object-cover"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/courses"
                  className="rounded-full bg-[#1E1D59] px-7 py-4 font-bold text-white hover:-translate-y-0.5 hover:bg-[#14123D]"
                >
                  Get Started
                </Link>

                <Link
                  href="/#about"
                  className="rounded-full border border-[#1E1D59] px-7 py-4 font-bold text-[#1E1D59] hover:bg-[#1E1D59] hover:text-white"
                >
                  Learn More
                </Link>
              </div>
            </ScrollReveal>

            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
              {platformFeatures.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={(index % 2) * 90}>
                  <div className="group h-full rounded-3xl bg-white p-7 shadow-sm ring-1 ring-black/[0.03] hover:-translate-y-1 hover:shadow-lg lg:min-h-[260px]">
                    <div className="mb-10 flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-2xl text-white transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 ${
                          feature.tone === "navy"
                            ? "bg-[#1E1D59]"
                            : "bg-[#632854]"
                        }`}
                      >
                        <feature.icon size={22} />
                      </div>

                      <span className="font-serif text-2xl italic text-gray-300">
                        0{index + 1}
                      </span>
                    </div>

                    <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                    <p className="leading-7 text-gray-600">{feature.text}</p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-6 py-16 md:py-20">
          <ScrollReveal>
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#1E1D59] to-[#632854] p-8 text-white shadow-xl md:p-12">
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 animate-float rounded-full bg-white/10" />
              <div
                className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 animate-float rounded-full bg-white/10"
                style={{ animationDelay: "-3s" }}
              />

              <div className="relative grid items-end gap-8 lg:grid-cols-[1.5fr_1fr]">
                <div>
                  <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.16em]">
                    Join the Movement
                  </span>

                  <h2 className="mb-4 text-4xl font-bold leading-[1.05] md:text-6xl">
                    Ready to Transform{" "}
                    <em className="accent text-[#F0A8C4]">Your Conservancy?</em>
                  </h2>

                  <p className="max-w-xl text-lg leading-8 text-white/85">
                    Join hundreds of conservancy leaders across Kenya who are
                    building a sustainable future for wildlife and communities.
                  </p>
                </div>

                <div className="flex flex-wrap gap-3 lg:justify-end">
                  <Link
                    href="/courses"
                    className="group inline-flex items-center gap-2 rounded-full bg-[#632854] py-4 pl-7 pr-5 font-bold text-white ring-1 ring-white/20 hover:-translate-y-0.5 hover:bg-[#4F2043]"
                  >
                    Enrol Now
                    <ArrowUpRight
                      size={18}
                      className="transition-transform duration-300 group-hover:rotate-45"
                    />
                  </Link>

                  <a
                    href={BROCHURE_URL}
                    download
                    className="inline-flex items-center gap-2 rounded-full border border-white px-7 py-4 font-bold hover:bg-white hover:text-[#1E1D59]"
                  >
                    <Download size={18} />
                    Download Brochure
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      <Footer />
    </>
  );
}
