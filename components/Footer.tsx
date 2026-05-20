export default function Footer() {
  return (
    <footer className="bg-[#8B2F0B] text-white px-6 py-12">
      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        <div>
          <h3 className="text-2xl font-bold mb-3">
            KWCA Learning HUB
          </h3>

          <p className="text-white/80">
            Empowering wildlife conservation through education and community engagement.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-3">
            Quick Links
          </h4>

          <div className="space-y-2 text-white/80">
            <p>About Us</p>
            <p>All Courses</p>
            <p>Resources</p>
            <p>Contact</p>
          </div>
        </div>

        <div>
          <h4 className="font-bold mb-3">
            Get in Touch
          </h4>

          <div className="space-y-2 text-white/80">
            <p>info@kwcakenya.com</p>
            <p>Nairobi, Kenya</p>
          </div>
        </div>

      </div>
    </footer>
  );
}