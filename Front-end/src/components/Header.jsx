export default function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* === Kiri: Logo + Search === */}
        <div className="flex items-center gap-3">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-10 h-10"
            
          />
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Program"
              className="w-72 h-9 pl-10 pr-3 rounded-md border border-gray-300 text-sm placeholder-gray-400 focus:ring-1 focus:ring-[#b38867] focus:border-[#b38867] outline-none"
            />
            <svg
              className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
            >
              <path
                d="M21 21l-4.35-4.35M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* === Tengah: Menu Navigasi === */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-700">
          <a href="/program" className="hover:text-[#b38867]">Program</a>
          <a href="/Langganan" className="hover:text-[#b38867]">Langganan</a>
          <a href="/E-Learning" className="hover:text-[#b38867]">E-Learning</a>
        </nav>

        {/* === Kanan: Tombol Auth === */}
        <div className="flex gap-3">
          <a
            href="/register"
            className="px-4 h-9 inline-flex items-center justify-center rounded-md border border-[#b38867] text-[#b38867] hover:bg-[#b38867] hover:text-white transition"
          >
            Daftar
          </a>
          <a
            href="/login"
            className="px-4 h-9 inline-flex items-center justify-center rounded-md bg-[#b38867] text-white hover:bg-[#a27355] transition"
          >
            Masuk
          </a>
        </div>
      </div>
    </header>
  );
}
