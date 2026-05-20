import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { modules } from "@/data/modules";

export default function Courses() {
  return (
    <section id="courses" className="py-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="text-center mb-14">
          <h2 className="text-4xl font-extrabold mb-4 text-[#101828]">
            Explore Learning Modules
          </h2>

          <p className="text-lg text-gray-600">
            Practical courses designed for conservancy establishment,
            governance, management, and sustainability.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {modules.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.slug}
                href={`/courses/${item.slug}`}
                className="bg-white rounded-2xl p-7 border border-gray-200 shadow-sm hover:shadow-md transition group block"
              >
                <div className="flex items-start justify-between gap-4">

                  <div className="flex gap-5">
                    <div className="w-14 h-14 rounded-xl bg-[#D94A00] text-white flex items-center justify-center">
                      <Icon size={28} />
                    </div>

                    <div>
                      <h3 className="text-xl font-bold mb-3 text-[#101828]">
                        {item.title}
                      </h3>

                      <p className="text-gray-500 flex items-center gap-2">
                        <BookOpen size={16} />
                        {item.module}
                      </p>
                    </div>
                  </div>

                  <ArrowRight className="text-gray-400 group-hover:text-[#D94A00]" />

                </div>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}