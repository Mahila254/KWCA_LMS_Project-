import {
  BookOpen,
  Download,
  MessageCircle,
  Video,
} from "lucide-react";

function Feature({ icon: Icon, title, text }: any) {
  return (
    <div className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100">
      <div className="w-12 h-12 rounded-xl bg-[#D94A00] text-white flex items-center justify-center mb-6">
        <Icon size={24} />
      </div>

      <h3 className="text-xl font-bold mb-3 text-[#101828]">
        {title}
      </h3>

      <p className="text-gray-600">
        {text}
      </p>
    </div>
  );
}

export default function Features() {
  return (
    <section
      id="resources"
      className="py-24 px-6 bg-[#FFF8E8]"
    >
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">

        <div className="grid sm:grid-cols-2 gap-6">

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
          <h2 className="text-4xl font-extrabold mb-6 text-[#101828]">
            Why Choose Our Learning Platform?
          </h2>

          <p className="text-lg text-gray-700 mb-8">
            This platform is designed for Kenya’s conservation landscape,
            offering practical and actionable knowledge that can be applied
            directly to conservancy work.
          </p>

          <div className="rounded-3xl bg-white min-h-[320px] flex items-center justify-center shadow-sm">
            <p className="text-gray-500">
              Landscape image goes here later
            </p>
          </div>
        </div>

      </div>
    </section>
  );
}