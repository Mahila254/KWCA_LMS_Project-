export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#F2FBF8] to-white py-28 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-[#101828]">
          Kenya Conservancies Learning HUB
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Empowering Wildlife Conservation Through Education
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          <div className="border border-emerald-200 bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-[#007F73] font-semibold">
              Host Organization
            </p>

            <h3 className="text-xl font-bold mt-2 text-[#101828]">
              Kenya Wildlife Conservancies Foundation
            </h3>
          </div>

          <div className="border border-emerald-200 bg-white rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-[#007F73] font-semibold">
              Partner
            </p>

            <h3 className="text-xl font-bold mt-2 text-[#101828]">
              Kenya Wildlife Conservancies Association
            </h3>
          </div>
        </div>

        <button className="bg-[#007F73] text-white px-8 py-4 rounded-xl text-lg font-bold shadow-lg hover:opacity-90 transition">
          Start Learning
        </button>
      </div>
    </section>
  );
}