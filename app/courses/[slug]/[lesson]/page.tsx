import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Quiz from "@/components/Quiz";
import ProgressButton from "@/components/ProgressButton";
import { modules } from "@/data/modules";
import { lessons } from "@/data/lessons";
import { lessonContent } from "@/data/lessonContent";
import { quizzes } from "@/data/quizzes";
import Link from "next/link";

type PageProps = {
  params: Promise<{
    slug: string;
    lesson: string;
  }>;
};

export default async function LessonPage({ params }: PageProps) {
  const { slug, lesson } = await params;

  const course = modules.find((item) => item.slug === slug);
  const courseLessons = lessons[slug as keyof typeof lessons] || [];

  const lessonNumber = Number(lesson.replace("lesson-", ""));
  const lessonTitle = courseLessons[lessonNumber - 1];

  const content =
    lessonContent[slug as keyof typeof lessonContent]?.[
      lesson as keyof (typeof lessonContent)[keyof typeof lessonContent]
    ];

  const lessonQuiz =
    quizzes[slug as keyof typeof quizzes]?.[
      lesson as keyof (typeof quizzes)[keyof typeof quizzes]
    ];

 const previousLesson =
  lessonNumber > 1 ? `/courses/${slug}/lesson-${lessonNumber - 1}` : null;

const nextLesson =
  lessonNumber < courseLessons.length
    ? `/courses/${slug}/lesson-${lessonNumber + 1}`
    : null;

  if (!course || !lessonTitle) {
    return (
      <main>
        <Navbar />
        <section className="py-24 px-6 text-center bg-white">
          <h1 className="text-4xl font-bold text-[#101828] mb-4">
            Lesson not found
          </h1>
          <Link href="/courses" className="text-[#007F73] font-bold">
            Back to courses
          </Link>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main>
      <Navbar />

      <section className="bg-[#F2FBF8] py-16 px-6">
        <div className="max-w-5xl mx-auto">
          <Link href={`/courses/${slug}`} className="text-[#007F73] font-bold">
            ← Back to module
          </Link>

          <p className="mt-6 text-[#007F73] font-bold">
            {course.module} · Lesson {lessonNumber}
          </p>

          <h1 className="text-4xl md:text-5xl font-extrabold mt-3 text-[#101828]">
            {lessonTitle}
          </h1>
        </div>
      </section>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-black rounded-3xl overflow-hidden aspect-video">
              {content?.videoUrl ? (
                <iframe
                  src={content.videoUrl}
                  title={lessonTitle}
                  className="w-full h-full"
                  allowFullScreen
                />
              ) : (
                <div className="h-full flex items-center justify-center text-white">
                  Video Placeholder
                </div>
              )}
            </div>

            <div className="border border-gray-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-5 text-[#101828]">
                Lesson Notes
              </h2>
              <div className="leading-8 text-gray-600 whitespace-pre-line">
                {content?.notes || "Lesson notes will be added here soon."}
              </div>
            </div>

            {lessonQuiz && lessonQuiz.length > 0 && (
              <Quiz questions={lessonQuiz} />
            )}

            <div className="mt-12 flex justify-between">
              {previousLesson ? (
                <Link
                  href={previousLesson}
                  className="rounded-xl border border-gray-300 px-6 py-3 hover:bg-gray-100"
                >
                  ← Previous Lesson
                </Link>
              ) : (
                <span />
              )}

              {nextLesson ? (
                <Link
                  href={nextLesson}
                  className="rounded-xl bg-[#0d8b7f] px-6 py-3 text-white hover:bg-[#0a6d64]"
                >
                  Next Lesson →
                </Link>
              ) : (
                <Link
                  href={`/courses/${slug}`}
                  className="rounded-xl bg-[#8B2F0B] px-6 py-3 text-white"
                >
                  Finish Module
                </Link>
              )}
            </div>
          </div>

          <aside className="bg-gray-50 border border-gray-200 rounded-3xl p-6 h-fit">
            <h3 className="font-bold text-xl mb-5 text-[#101828]">
              Lesson Menu
            </h3>

            <div className="space-y-3">
              {courseLessons.map((item, index) => (
                <Link
                  key={item}
                  href={`/courses/${slug}/lesson-${index + 1}`}
                  className={`block p-4 rounded-xl border transition ${
                    index + 1 === lessonNumber
                      ? "bg-[#007F73] text-white border-[#007F73]"
                      : "bg-white text-gray-700 border-gray-200 hover:border-[#007F73]"
                  }`}
                >
                  <p className="font-bold">Lesson {index + 1}</p>
                  <p className="text-sm">{item}</p>
                </Link>
              ))}
            </div>

            <ProgressButton
              courseSlug={slug}
              lessonSlug={lesson}
              totalLessons={courseLessons.length}
            />
          </aside>
        </div>
      </section>

      <Footer />
    </main>
  );
}