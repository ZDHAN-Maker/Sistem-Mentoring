import React from "react";
import { Package, Crown, Gem, Zap, Award, Sparkles } from "lucide-react";

export default function PlanBadgeIcon({ icon, title = "", size = "md", className = "" }) {
  const t = (title || "").toLowerCase();
  const ic = (icon || "").toLowerCase();

  // Determine icon type
  let type = "package";
  if (ic.includes("👑") || ic.includes("crown") || t.includes("pro") || t.includes("premium")) {
    type = "crown";
  } else if (ic.includes("💎") || ic.includes("gem") || t.includes("exclusive") || t.includes("eksklusif") || t.includes("vip")) {
    type = "gem";
  } else if (ic.includes("⚡") || ic.includes("zap") || t.includes("intensif") || t.includes("fast")) {
    type = "zap";
  } else if (ic.includes("🏆") || ic.includes("award") || t.includes("master") || t.includes("karir")) {
    type = "award";
  } else if (ic.includes("✨") || ic.includes("sparkles")) {
    type = "sparkles";
  }

  // Size configurations
  const sizeMap = {
    sm: { box: "w-8 h-8 rounded-lg", icon: 16 },
    md: { box: "w-11 h-11 rounded-2xl", icon: 20 },
    lg: { box: "w-14 h-14 rounded-2xl", icon: 26 },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  // Color theme mapping
  switch (type) {
    case "crown":
      return (
        <div className={`${currentSize.box} bg-amber-50 text-[#b38867] border border-amber-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Crown size={currentSize.icon} className="text-[#b38867]" />
        </div>
      );
    case "gem":
      return (
        <div className={`${currentSize.box} bg-purple-50 text-purple-600 border border-purple-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Gem size={currentSize.icon} className="text-purple-600" />
        </div>
      );
    case "zap":
      return (
        <div className={`${currentSize.box} bg-amber-50 text-amber-600 border border-amber-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Zap size={currentSize.icon} className="text-amber-600" />
        </div>
      );
    case "award":
      return (
        <div className={`${currentSize.box} bg-rose-50 text-rose-600 border border-rose-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Award size={currentSize.icon} className="text-rose-600" />
        </div>
      );
    case "sparkles":
      return (
        <div className={`${currentSize.box} bg-indigo-50 text-indigo-600 border border-indigo-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Sparkles size={currentSize.icon} className="text-indigo-600" />
        </div>
      );
    default:
      return (
        <div className={`${currentSize.box} bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center shrink-0 shadow-xs ${className}`}>
          <Package size={currentSize.icon} className="text-blue-600" />
        </div>
      );
  }
}
