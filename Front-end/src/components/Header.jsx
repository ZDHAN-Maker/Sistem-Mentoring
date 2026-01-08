export default function Header() {
  return (
    <header className="w-full backdrop-blur-xl bg-white/70 border-b border-[#e4d9cd] shadow-sm">
      <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
        
        {/* === Kiri: Logo + Search === */}
        <div className="flex items-center gap-4">
          <img
            src="/assets/Logo Sistem Mentoring.png"
            alt="Logo"
            className="w-12 h-12 hover:scale-105 transition-transform"
          />

          {/* Search Input */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari Program..."
              className="w-72 h-10 pl-10 pr-3 rounded-lg border border-[#c7b39f] bg-white/60 backdrop-blur-sm 
              text-sm placeholder-gray-400 focus:ring-2 focus:ring-[#b38867] focus:border-[#b38867] outline-none
              transition shadow-sm"
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
        <nav className="hidden md:flex items-center gap-10 text-[15px] font-semibold text-gray-700">
          <a
            href="/program"
            className="relative hover:text-[#b38867] transition group"
          >
            Program
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#b38867] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>

          <a
            href="/langganan"
            className="relative hover:text-[#b38867] transition group"
          >
            Langganan
            <span className="absolute left-0 -bottom-1 w-full h-[2px] bg-[#b38867] scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
          </a>
        </nav>

        {/* === Kanan: Auth Buttons === */}
        <div className="flex gap-4">

          {/* Button Daftar */}
          <a
            href="/register"
            className="px-5 h-10 inline-flex items-center justify-center rounded-lg border border-[#b38867] text-[#b38867] 
            font-semibold bg-white/60 backdrop-blur-md shadow-sm
            hover:bg-[#b38867] hover:text-white hover:shadow-lg hover:scale-105 transition-all"
          >
            Daftar
          </a>

          {/* Button Masuk */}
          <a
            href="/login"
            className="px-5 h-10 inline-flex items-center justify-center rounded-lg 
            bg-gradient-to-r from-[#b38867] to-[#a0704c] text-white 
            font-semibold shadow-md hover:shadow-xl hover:scale-105 hover:brightness-110 transition-all"
          >
            Masuk
          </a>
        </div>
      </div>
    </header>
  );
}
