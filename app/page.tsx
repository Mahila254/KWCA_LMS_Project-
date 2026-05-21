import Link from "next/link";
import {
  BookOpen,
  Users,
  ShieldCheck,
  Leaf,
  DollarSign,
  FileText,
  Award,
  Video,
  Download,
  MessageCircle,
  ArrowRight,
  UserRound,
} from "lucide-react";

const modules = [
  {
    title: "What is a conservancy?",
    icon: BookOpen,
    module: "Module 1",
    href: "/courses/what-is-a-conservancy/lesson-1",
  },
  {
    title: "How to establish a strong Conservancy",
    icon: FileText,
    module: "Module 2",
    href: "/courses",
  },
  {
    title: "Managing a Conservancy effectively",
    icon: ShieldCheck,
    module: "Module 3",
    href: "/courses",
  },
  {
    title: "Creating sustainable revenue",
    icon: DollarSign,
    module: "Module 4",
    href: "/courses",
  },
  {
    title: "Holding a good Annual General Meeting",
    icon: Users,
    module: "Module 5",
    href: "/courses",
  },
  {
    title: "Creating a credible Carbon Project",
    icon: Leaf,
    module: "Module 6",
    href: "/courses",
  },
  {
    title: "Writing a Conservancy Management Plan",
    icon: FileText,
    module: "Module 7",
    href: "/courses",
  },
  {
    title: "Women and youth in conservation",
    icon: Users,
    module: "Module 8",
    href: "/courses",
  },
  {
    title: "How to make your conservancy Greenlisted",
    icon: Award,
    module: "Module 9",
    href: "/courses",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-[#101828]">
      <nav className="sticky top-0 z-10 border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/">
            <div>
              <h1 className="text-xl font-bold text-[#8B3A12]">KWCA</h1>
              <p className="text-xs text-gray-500">
                Living nature, living people
              </p>
            </div>
          </Link>

          <div className="hidden items-center gap-8 font-medium text-gray-700 md:flex">
            <a href="#about">About Us</a>
            <a href="#courses">Courses</a>
            <Link href="/dashboard">Dashboard</Link>
            <a href="#resources">Resources</a>

            <Link
              href="/dashboard"
              className="rounded-xl bg-[#007F73] px-6 py-3 text-white"
            >
              Get Started
            </Link>

            <Link
              href="/dashboard"
              className="flex h-11 w-11 items-center justify-center rounded-full bg-gray-100 text-[#101828] hover:bg-gray-200"
            >
              <UserRound size={22} />
            </Link>
          </div>
        </div>
      </nav>

      <section className="bg-gradient-to-b from-[#F2FBF8] to-white px-6 py-28 text-center">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
            Kenya Conservancies Learning HUB
          </h2>

          <p className="mb-8 text-xl text-gray-600 md:text-2xl">
            Empowering Wildlife Conservation Through Education
          </p>

          <div className="mx-auto mb-10 grid max-w-3xl gap-4 md:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-white p-5">
              <p className="text-sm font-semibold text-[#007F73]">
                Host Organization
              </p>
              <h3 className="mt-2 text-xl font-bold">
                Kenya Wildlife Conservancies Foundation
              </h3>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-white p-5">
              <p className="text-sm font-semibold text-[#007F73]">Partner</p>
              <h3 className="mt-2 text-xl font-bold">
                Kenya Wildlife Conservancies Association
              </h3>
            </div>
          </div>

          <Link
            href="/dashboard"
            className="inline-block rounded-xl bg-[#007F73] px-8 py-4 text-lg font-bold text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#00665d]"
          >
            Start Learning
          </Link>
        </div>
      </section>

      <section id="about" className="bg-white px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div>
            <h2 className="mb-6 text-4xl font-extrabold">
              Building Stronger Conservancies Across Kenya
            </h2>

            <p className="mb-8 text-lg text-gray-600">
              The Kenya Conservancies Learning HUB is a practical learning
              platform for conservancy leaders, managers, board members, and
              community stakeholders.
            </p>

            <div className="space-y-6">
              <InfoItem
                icon={ShieldCheck}
                title="Our Mission"
                text="Empower conservancy leaders with tools to build sustainable and community-centered conservation initiatives."
              />
              <InfoItem
                icon={Users}
                title="Community Focus"
                text="Support women, youth, and local communities to participate meaningfully in conservation leadership."
              />
              <InfoItem
                icon={Award}
                title="Excellence Standards"
                text="Help conservancies meet governance, management, finance, and Greenlisting standards."
              />
            </div>
          </div>

          <div className="flex min-h-[420px] items-center justify-center rounded-3xl bg-[#F4F7F5] shadow-sm">
            <p className="text-gray-500">Add wildlife / conservancy image here</p>
          </div>
        </div>
      </section>

      <section id="courses" className="bg-gray-50 px-6 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="mb-4 text-4xl font-extrabold">
              Explore Learning Modules
            </h2>
            <p className="text-lg text-gray-600">
              Practical courses designed for conservancy establishment,
              governance, management, and sustainability.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {modules.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.title}
                  href={item.href}
                  className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:border-[#D94A00] hover:shadow-xl"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-5">
                      <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-[#D94A00] text-white">
                        <Icon size={28} />
                      </div>

                      <div>
                        <h3 className="mb-3 text-xl font-bold">
                          {item.title}
                        </h3>
                        <p className="flex items-center gap-2 text-gray-500">
                          <BookOpen size={16} />
                          {item.module}
                        </p>
                      </div>
                    </div>

                    <ArrowRight className="text-gray-400 transition group-hover:translate-x-1 group-hover:text-[#D94A00]" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section id="resources" className="bg-[#FFF8E8] px-6 py-24">
        <div className="mx-auto grid max-w-7xl items-center gap-14 md:grid-cols-2">
          <div className="grid gap-6 sm:grid-cols-2">
            <Feature
              icon={BookOpen}
              title="Expert-Led Content"
              text="Learn from conservation professionals and practical field examples."
            />
            <Feature
              icon={Video}
              title="Interactive Learning"
              text="Use videos, case studies, and quizzes to strengthen learning."
            />
            <Feature
              icon={Download}
              title="Downloadable Resources"
              text="Access templates, guides, tools, and reference materials."
            />
            <Feature
              icon={MessageCircle}
              title="Community Support"
              text="Connect learning to real conservancy challenges and peer practice."
            />
          </div>

          <div>
            <h2 className="mb-6 text-4xl font-extrabold">
              Why Choose Our Learning Platform?
            </h2>
            <p className="mb-8 text-lg text-gray-700">
              This platform is designed for Kenya’s conservation landscape,
              offering practical and actionable knowledge that can be applied
              directly to conservancy work.
            </p>

            <div className="flex min-h-[320px] items-center justify-center rounded-3xl bg-white shadow-sm">
              <p className="text-gray-500">Add landscape image here</p>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-3xl bg-[#8B2F0B] p-12 text-white md:p-16">
          <h2 className="mb-4 text-4xl font-extrabold">
            Ready to Transform Your Conservancy?
          </h2>
          <p className="mb-8 max-w-2xl text-lg">
            Join conservancy leaders building stronger, more sustainable
            conservation institutions across Kenya.
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/courses"
              className="rounded-xl bg-white px-7 py-4 font-bold text-[#8B2F0B] transition hover:-translate-y-1 hover:shadow-lg"
            >
              Enroll Now
            </Link>
            <button className="rounded-xl border border-white px-7 py-4 font-bold transition hover:bg-white hover:text-[#8B2F0B]">
              Download Brochure
            </button>
          </div>
        </div>
      </section>

      <footer className="bg-[#8B2F0B] px-6 py-12 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 md:grid-cols-3">
          <div>
            <h3 className="mb-3 text-2xl font-bold">KWCA Learning HUB</h3>
            <p className="text-white/80">
              Empowering wildlife conservation through education and community
              engagement.
            </p>
          </div>

          <div>
            <h4 className="mb-3 font-bold">Quick Links</h4>
            <p>About Us</p>
            <p>All Courses</p>
            <p>Resources</p>
            <p>Contact</p>
          </div>

          <div>
            <h4 className="mb-3 font-bold">Get in Touch</h4>
            <p>info@kwcakenya.com</p>
            <p>Nairobi, Kenya</p>
          </div>
        </div>
      </footer>
    </main>
  );
}

function InfoItem({ icon: Icon, title, text }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100 text-[#D94A00]">
        <Icon size={24} />
      </div>
      <div>
        <h3 className="text-lg font-bold">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  );
}

function Feature({ icon: Icon, title, text }: any) {
  return (
    <div className="rounded-2xl bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-[#D94A00] text-white">
        <Icon size={24} />
      </div>
      <h3 className="mb-3 text-xl font-bold">{title}</h3>
      <p className="text-gray-600">{text}</p>
    </div>
  );
}