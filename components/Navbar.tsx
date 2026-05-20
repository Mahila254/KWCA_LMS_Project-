export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#8B3A12]">
            KWCA
          </h1>

          <p className="text-xs text-gray-500">
            Living nature, living people
          </p>
        </div>

        <div className="hidden md:flex items-center gap-8 font-medium text-gray-700">
          <a href="#about">About Us</a>
          <a href="#courses">Courses</a>
          <a href="#resources">Resources</a>

          <button className="bg-[#007F73] text-white px-6 py-3 rounded-xl">
            Get Started
          </button>
        </div>
      </div>
    </nav>
  );
}