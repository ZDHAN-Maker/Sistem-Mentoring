import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  loading = false,
  disabled = false,
  className = "",
  full = false,
}) {
  const base =
    "px-5 py-2 rounded-full font-medium transition-all duration-200 flex items-center justify-center gap-2";

  // Warna tombol sesuai gambar (coklat soft)
  const style = "bg-[#c9ad96] text-black hover:bg-[#b89a84]";

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${style} ${
        full ? "w-full" : ""
      } ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading && (
        <span className="animate-spin border-2 border-black border-t-transparent rounded-full w-4 h-4"></span>
      )}
      {children}
    </button>
  );
}
