import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";
import { modules } from "@/data/modules";
import {
  ArrowRight,
  Award,
  Clock,
  Download,
  GraduationCap,
  MessageCircle,
  PlayCircle,
  Target,
  Users,
  Video,
} from "lucide-react";

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

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-white text-[#1E1D59]">
        {/* HERO */}
        <section className="relative overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/images/hero-background.jpg')" }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#1E1D59]/10 to-[#1E1D59]/55" />

          <ScrollReveal className="relative mx-auto max-w-5xl px-6 py-28 text-center">
            <div className="mb-8">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white/90 backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-[#F0A8C4]" />
                KWCF Learning Platform
              </span>
            </div>

            <h1
              className="mb-6 text-5xl font-extrabold leading-[1.05] tracking-tight text-white md:text-7xl"
              style={{ textShadow: "0 4px 28px rgba(0,0,0,0.55)" }}
            >
              Conservancies
              <br />
              <span className="text-[#C9C4EE]">Learning Hub</span>
            </h1>

            <p
              className="mx-auto mb-10 max-w-2xl text-lg leading-8 text-white/90 md:text-xl"
              style={{ textShadow: "0 2px 16px rgba(0,0,0,0.55)" }}
            >
              Empowering wildlife conservation leaders with expert led
              training in conservancy management, governance, and
              sustainable development.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                href="/courses"
                className="inline-flex items-center gap-2 rounded-xl bg-[#632854] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#4F2043]"
              >
                Start Learning
                <ArrowRight size={20} />
              </Link>

              <Link
                href="/#about"
                className="inline-flex items-center gap-2 rounded-xl border border-white bg-black/10 px-8 py-4 text-lg font-bold text-white backdrop-blur-sm transition hover:bg-white/10"
              >
                <PlayCircle size={20} />
                Watch Overview
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* STATS BAR */}
        <section className="bg-gradient-to-r from-[#1E1D59] to-[#302A57]">
          <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-white/10 px-6 py-10 text-center sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            {stats.map((stat) => (
              <div key={stat.label} className="px-4 py-4 sm:py-0">
                <p className="text-4xl font-extrabold text-white md:text-5xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm font-semibold text-white/70">
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ABOUT */}
        <section id="about" className="bg-white px-6 py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
            <ScrollReveal>
              <span className="mb-5 inline-block rounded-full bg-[#FBE4EA] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#632854]">
                About the Hub
              </span>

              <h2 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
                Building Stronger{" "}
                <span className="text-[#632854]">
                  Conservancies Across Kenya
                </span>
              </h2>

              <p className="mb-8 text-lg leading-8 text-gray-600">
                The Kenya Conservancies Learning Hub is your comprehensive
                platform for establishing, managing, and growing successful
                wildlife conservancies that benefit both nature and
                communities. Hosted by the Kenya Wildlife Conservancies
                Foundation in partnership with KWCA.
              </p>

              <div className="space-y-6">
                {aboutPoints.map((point) => (
                  <div key={point.title} className="flex gap-4">
                    <div
                      className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                        point.tone === "pink"
                          ? "bg-[#F5DCE6] text-[#632854]"
                          : "bg-[#E4E1F5] text-[#1E1D59]"
                      }`}
                    >
                      <point.icon size={22} />
                    </div>

                    <div>
                      <h3 className="text-lg font-bold">{point.title}</h3>
                      <p className="leading-7 text-gray-600">{point.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/courses"
                className="mt-8 inline-flex items-center gap-2 font-bold text-[#632854] hover:gap-3"
              >
                Learn more about KWCF
                <ArrowRight size={18} />
              </Link>
            </ScrollReveal>

            <ScrollReveal className="relative">
              <div className="overflow-hidden rounded-3xl shadow-sm">
                <img
                  src="/images/hero-conservancy.jpg"
                  alt="Conservancy landscape"
                  className="h-[440px] w-full object-cover"
                />
              </div>

              <div className="absolute -bottom-6 left-6 rounded-2xl bg-[#1E1D59] px-6 py-4 text-white shadow-xl">
                <p className="text-3xl font-extrabold">{modules.length}+</p>
                <p className="text-sm font-semibold text-white/70">
                  Learning Modules
                </p>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* KEY LEARNING TOPICS */}
        <section id="courses" className="bg-gray-50 px-6 py-24">
          <div className="mx-auto max-w-7xl">
            <ScrollReveal className="mb-14 flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <h2 className="text-4xl font-extrabold leading-tight md:text-5xl">
                Key Learning
                <br />
                <span className="text-[#632854]">Topics</span>
              </h2>

              <p className="max-w-md text-lg text-gray-600">
                Comprehensive, expert-led modules designed to equip you with
                the skills to excel in wildlife conservation management.
              </p>
            </ScrollReveal>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {modules.map((item, index) => (
                <ScrollReveal key={item.slug}>
                  <Link
                    href="/courses"
                    className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                  >
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />

                      <span className="absolute left-4 top-4 rounded-full bg-[#1E1D59] px-3 py-1 text-xs font-extrabold text-white">
                        {item.category}
                      </span>

                      <span className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-[#632854] text-xs font-extrabold text-white">
                        {index + 1}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="mb-3 text-xl font-bold leading-snug group-hover:text-[#632854]">
                        {item.title}
                      </h3>

                      <p className="mb-6 flex-1 leading-7 text-gray-600">
                        {item.description}
                      </p>

                      <div className="mt-auto flex items-center justify-between border-t pt-4 text-sm">
                        <span className="flex items-center gap-2 text-gray-500">
                          <Clock size={15} />
                          Self-paced
                        </span>

                        <span className="flex items-center gap-1 font-bold text-[#632854]">
                          Start module
                          <ArrowRight
                            size={15}
                            className="transition group-hover:translate-x-1"
                          />
                        </span>
                      </div>
                    </div>
                  </Link>
                </ScrollReveal>
              ))}
            </div>

            <ScrollReveal className="mt-8">
              <div className="flex flex-col items-center justify-between gap-6 rounded-3xl bg-[#1E1D59] px-8 py-8 text-white sm:flex-row">
                <div>
                  <h3 className="text-2xl font-extrabold">
                    More Modules Coming Soon
                  </h3>
                  <p className="mt-1 text-white/70">
                    We&apos;re expanding the curriculum with new modules, case
                    studies, and resources every quarter.
                  </p>
                </div>

                <Link
                  href="/courses"
                  className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-[#632854] px-6 py-4 font-bold text-white transition hover:bg-[#4F2043]"
                >
                  Explore All Modules
                  <ArrowRight size={18} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* WHY THIS PLATFORM */}
        <section id="why-platform" className="bg-[#F8F4F4] px-6 py-24">
          <div className="mx-auto grid max-w-7xl items-start gap-14 md:grid-cols-2">
            <ScrollReveal>
              <span className="mb-5 inline-block rounded-full bg-[#E4E1F5] px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-[#1E1D59]">
                Why This Platform
              </span>

              <h2 className="mb-6 text-4xl font-extrabold leading-tight md:text-5xl">
                Built for Kenya&apos;s{" "}
                <span className="text-[#632854]">
                  Conservation Landscape
                </span>
              </h2>

              <p className="mb-10 text-lg leading-8 text-gray-600">
                Our platform is specifically designed for Kenya&apos;s
                unique conservation context — offering practical, actionable
                knowledge you can apply directly to your conservancy.
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                {platformFeatures.map((feature) => (
                  <div key={feature.title}>
                    <div
                      className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl text-white ${
                        feature.tone === "navy"
                          ? "bg-[#1E1D59]"
                          : "bg-[#632854]"
                      }`}
                    >
                      <feature.icon size={22} />
                    </div>

                    <h3 className="mb-2 font-bold">{feature.title}</h3>
                    <p className="text-sm leading-6 text-gray-600">
                      {feature.text}
                    </p>
                  </div>
                ))}
              </div>
            </ScrollReveal>

            <ScrollReveal>
              <div className="overflow-hidden rounded-3xl shadow-sm">
                <img
                  src="/images/learning-dashboard.jpg"
                  alt="Kenya conservation landscape"
                  className="h-[340px] w-full object-cover"
                />
              </div>

              <div className="mt-6 flex flex-wrap gap-4">
                <Link
                  href="/courses"
                  className="rounded-xl bg-[#1E1D59] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#14123D]"
                >
                  Get Started
                </Link>

                <Link
                  href="/#about"
                  className="rounded-xl border border-[#1E1D59] px-7 py-4 font-bold text-[#1E1D59] transition hover:bg-[#1E1D59] hover:text-white"
                >
                  Learn More
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-white px-6 py-20">
          <ScrollReveal>
            <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-gradient-to-br from-[#1E1D59] to-[#632854] p-12 text-white shadow-xl md:p-16">
              <div className="pointer-events-none absolute -right-10 -top-16 h-56 w-56 rounded-full bg-white/10" />
              <div className="pointer-events-none absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-white/10" />

              <div className="relative max-w-2xl">
                <span className="mb-5 inline-block rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-extrabold uppercase tracking-wide">
                  Join the Movement
                </span>

                <h2 className="mb-4 text-4xl font-extrabold leading-tight md:text-5xl">
                  Ready to Transform Your Conservancy?
                </h2>

                <p className="mb-8 max-w-xl text-lg leading-8 text-white/85">
                  Join hundreds of conservancy leaders across Kenya who are
                  building a sustainable future for wildlife and communities.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 rounded-xl bg-[#632854] px-7 py-4 font-bold text-white transition hover:-translate-y-1 hover:bg-[#4F2043]"
                  >
                    Enrol Now
                    <ArrowRight size={18} />
                  </Link>

                  <button
                    type="button"
                    className="inline-flex items-center gap-2 rounded-xl border border-white px-7 py-4 font-bold transition hover:bg-white hover:text-[#1E1D59]"
                  >
                    <Download size={18} />
                    Download Brochure
                  </button>
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
