export default function CTA() {
  return (
    <section className="px-6 py-20 bg-white">
      <div className="max-w-7xl mx-auto bg-[#8B2F0B] text-white rounded-3xl p-12 md:p-16">

        <h2 className="text-4xl font-extrabold mb-4">
          Ready to Transform Your Conservancy?
        </h2>

        <p className="text-lg mb-8 max-w-2xl">
          Join conservancy leaders building stronger, more sustainable
          conservation institutions across Kenya.
        </p>

        <div className="flex flex-wrap gap-4">

          <button className="bg-white text-[#8B2F0B] px-7 py-4 rounded-xl font-bold">
            Enroll Now
          </button>

          <button className="border border-white px-7 py-4 rounded-xl font-bold">
            Download Brochure
          </button>

        </div>
      </div>
    </section>
  );
}