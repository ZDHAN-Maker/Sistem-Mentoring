import React from "react";

export default function Button({
  children,
  onClick,
  type = "button",
  variant = "primary",
  loading = false,
  disabled = false,
  className = "",
  full = false,
}) {
  const base =
    "px-4 py-2 rounded-md font-medium transition-all duration-200 flex items-center justify-center gap-2";

  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-200 text-gray-700 hover:bg-gray-300",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-400 text-gray-700 hover:bg-gray-100",
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={loading || disabled}
      className={`${base} ${variants[variant]} ${
        full ? "w-full" : ""
      } ${loading ? "opacity-70 cursor-not-allowed" : ""} ${className}`}
    >
      {loading && (
        <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4"></span>
      )}
      {children}
    </button>
  );
}
