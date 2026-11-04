export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-tint to-surface py-28 px-6 text-center">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-ink">
          Kenya Conservancies Learning HUB
        </h2>

        <p className="text-xl md:text-2xl text-gray-600 mb-8">
          Empowering Wildlife Conservation Through Education
        </p>

        <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto mb-10">
          <div className="border border-line bg-surface rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-ink font-semibold">
              Host Organization
            </p>

            <h3 className="text-xl font-bold mt-2 text-ink">
              Kenya Wildlife Conservancies Foundation
            </h3>
          </div>

          <div className="border border-line bg-surface rounded-2xl p-5 shadow-sm">
            <p className="text-sm text-ink font-semibold">
              Partner
            </p>

            <h3 className="text-xl font-bold mt-2 text-ink">
              Kenya Wildlife Conservancies Association
            </h3>
          </div>
        </div>

        <button className="bg-primary text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:opacity-90 transition">
          Start Learning
        </button>
      </div>
    </section>
  );
}