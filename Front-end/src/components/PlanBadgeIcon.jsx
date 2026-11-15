import React from "react";

export default function PlanBadgeIcon({ level, icon, title = "", size = "lg", className = "" }) {
  const t = (title || "").toLowerCase();
  const ic = (icon || "").toLowerCase();

  // Tentukan Level berdasarkan parameter level atau judul paket
  let lvl = "01";
  let lvlStyle = "bg-slate-100 text-slate-800 border-slate-200";
  let subColor = "text-slate-400";
  let numColor = "text-slate-900";

  if (
    level === 2 || 
    level === "02" || 
    level === "2" || 
    ic.includes("👑") || 
    t.includes("pro") || 
    t.includes("premium")
  ) {
    lvl = "02";
    lvlStyle = "bg-amber-50/80 text-[#7B5E4A] border-[#b38867]/40 shadow-xs";
    subColor = "text-[#b38867]";
    numColor = "text-[#7B5E4A]";
  } else if (
    level === 3 || 
    level === "03" || 
    level === "3" || 
    ic.includes("💎") || 
    t.includes("exclusive") || 
    t.includes("eksklusif") || 
    t.includes("vip")
  ) {
    lvl = "03";
    lvlStyle = "bg-slate-900 text-white border-slate-800 shadow-xs";
    subColor = "text-amber-400";
    numColor = "text-white";
  }

  // Size configurations
  const sizeMap = {
    sm: "w-9 h-9 rounded-xl",
    md: "w-11 h-11 rounded-2xl",
    lg: "w-14 h-14 rounded-2xl",
  };

  const currentSize = sizeMap[size] || sizeMap.lg;

  return (
    <div
      className={`${currentSize} border flex flex-col items-center justify-center shrink-0 ${lvlStyle} ${className}`}
      title={`Level ${lvl}`}
    >
      <span className={`text-[9px] font-black uppercase tracking-widest leading-none ${subColor}`}>
        LVL
      </span>
      <span className={`text-xl font-black font-mono leading-none mt-0.5 ${numColor}`}>
        {lvl}
      </span>
    </div>
  );
}
