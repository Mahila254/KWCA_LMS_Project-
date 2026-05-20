import { Award, ShieldCheck, Users } from "lucide-react";

function InfoItem({ icon: Icon, title, text }: any) {
  return (
    <div className="flex gap-4">
      <div className="w-12 h-12 rounded-xl bg-orange-100 text-[#D94A00] flex items-center justify-center">
        <Icon size={24} />
      </div>

      <div>
        <h3 className="font-bold text-lg text-[#101828]">
          {title}
        </h3>

        <p className="text-gray-600">
          {text}
        </p>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-14 items-center">
        
        <div>
          <h2 className="text-4xl font-extrabold mb-6 text-[#101828]">
            Building Stronger Conservancies Across Kenya
          </h2>

          <p className="text-lg text-gray-600 mb-8">
            The Kenya Conservancies Learning HUB is a practical learning platform
            for conservancy leaders, managers, board members, and community stakeholders.
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

        <div className="rounded-3xl bg-[#F4F7F5] min-h-[420px] flex items-center justify-center shadow-sm">
          <p className="text-gray-500">
            Image will go here later
          </p>
        </div>

      </div>
    </section>
  );
}