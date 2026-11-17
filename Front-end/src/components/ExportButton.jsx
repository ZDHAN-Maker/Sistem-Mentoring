// src/components/ExportButton.jsx
import React, { useState, useRef, useEffect } from "react";
import { 
  Download, 
  FileSpreadsheet, 
  FileText, 
  ChevronDown 
} from "lucide-react";

export default function ExportButton({
  onExportExcel,
  onExportPDF,
  label = "Export Laporan",
  disabled = false,
  className = "",
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleExcel = () => {
    setIsOpen(false);
    if (onExportExcel) onExportExcel();
  };

  const handlePDF = () => {
    setIsOpen(false);
    if (onExportPDF) onExportPDF();
  };

  return (
    <div className={`relative inline-block text-left ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        disabled={disabled}
        className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs sm:text-sm font-bold shadow-2xs transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        title="Pilih format unduhan laporan"
      >
        <Download size={15} className="text-[#b38867]" />
        <span>{label}</span>
        <ChevronDown
          size={14}
          className={`text-slate-400 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-200/90 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-3 py-2 border-b border-slate-100">
            <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider">
              Pilih Format Berkas
            </span>
          </div>

          {/* Opsi Excel */}
          <button
            type="button"
            onClick={handleExcel}
            className="w-full px-3.5 py-2.5 text-left hover:bg-emerald-50/70 flex items-center gap-3 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileSpreadsheet size={16} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 group-hover:text-emerald-800">
                Unduh Excel (.xlsx)
              </span>
              <span className="block text-[10px] text-slate-400">
                Format spreadsheet Microsoft Excel
              </span>
            </div>
          </button>

          {/* Opsi PDF */}
          <button
            type="button"
            onClick={handlePDF}
            className="w-full px-3.5 py-2.5 text-left hover:bg-rose-50/70 flex items-center gap-3 transition cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center shrink-0 group-hover:scale-105 transition">
              <FileText size={16} />
            </div>
            <div>
              <span className="block text-xs font-bold text-slate-800 group-hover:text-rose-800">
                Unduh PDF Resmi (.pdf)
              </span>
              <span className="block text-[10px] text-slate-400">
                Format cetak dokumen resmi berlogo
              </span>
            </div>
          </button>
        </div>
      )}
    </div>
  );
}
