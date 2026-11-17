// src/utils/exportReport.js
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

/**
 * Ekspor data ke format file Excel (.xlsx)
 * @param {Object} options
 * @param {string} options.fileName - Nama file tanpa ekstensi
 * @param {string} options.sheetName - Nama sheet
 * @param {Array<string>} options.headers - Daftar label kolom header
 * @param {Array<Array<any>>} options.rows - Baris data sesuai urutan header
 * @param {string} options.title - Judul laporan di atas tabel
 */
export function exportToExcel({
  fileName = "laporan-mentoring",
  sheetName = "Laporan",
  headers = [],
  rows = [],
  title = "Laporan Sistem Aeterna Mentoring",
}) {
  const wb = XLSX.utils.book_new();

  // Susun data dengan banner judul dan tanggal
  const worksheetData = [
    [title.toUpperCase()],
    [`Di-generate pada: ${new Date().toLocaleString("id-ID")}`],
    [], // Baris kosong pemisah
    headers,
    ...rows,
  ];

  const ws = XLSX.utils.aoa_to_sheet(worksheetData);

  // Atur lebar kolom otomatis berdasarkan panjang teks
  const colWidths = headers.map((header, colIdx) => {
    let maxLen = header ? header.toString().length : 10;
    rows.forEach((row) => {
      const cellVal = row[colIdx] ? row[colIdx].toString() : "";
      if (cellVal.length > maxLen) {
        maxLen = Math.min(cellVal.length, 50); // Maksimal 50 karakter agar tidak terlalu lebar
      }
    });
    return { wch: Math.max(maxLen + 3, 12) };
  });

  ws["!cols"] = colWidths;

  XLSX.utils.book_append_sheet(wb, ws, sheetName);
  XLSX.writeFile(wb, `${fileName}.xlsx`);
}

/**
 * Ekspor data ke format dokumen resmi PDF (.pdf)
 * @param {Object} options
 * @param {string} options.title - Judul utama dokumen
 * @param {string} options.subTitle - Sub-judul laporan
 * @param {string} options.fileName - Nama file tanpa ekstensi
 * @param {Array<string>} options.headers - Header tabel
 * @param {Array<Array<any>>} options.rows - Baris isi tabel
 * @param {Object} options.metadata - Data tambahan (e.g. Total Data, Pencetak)
 * @param {string} options.orientation - 'portrait' | 'landscape' (default: 'portrait')
 */
export function exportToPDF({
  title = "AETERNA MENTORING - LAPORAN RESMI",
  subTitle = "Rekapitulasi Evaluasi & Perkembangan Pembelajaran",
  fileName = "laporan-mentoring",
  headers = [],
  rows = [],
  metadata = {},
  orientation = "portrait",
}) {
  const doc = new jsPDF({
    orientation,
    unit: "mm",
    format: "a4",
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // 1. Header Dokumen Resmi
  doc.setFillColor(179, 136, 103); // #b38867
  doc.rect(0, 0, pageWidth, 5, "F"); // Top accent bar

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.text(title, 14, 16);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139); // slate-500
  doc.text(subTitle, 14, 22);

  // Informasi tanggal & metadata
  const printDate = new Date().toLocaleString("id-ID", {
    dateStyle: "full",
    timeStyle: "short",
  });
  doc.setFontSize(8);
  doc.text(`Waktu Cetak: ${printDate}`, 14, 28);

  // Metadata Chips / Keterangan Ringkas
  let currentY = 32;
  const metaKeys = Object.keys(metadata);
  if (metaKeys.length > 0) {
    doc.setDrawColor(226, 232, 240); // slate-200
    doc.setFillColor(250, 248, 245); // #FAF8F5
    doc.roundedRect(14, currentY, pageWidth - 28, 12, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(123, 94, 74); // #7B5E4A

    const metaText = metaKeys.map((k) => `${k}: ${metadata[k]}`).join("   |   ");
    doc.text(metaText, 18, currentY + 7.5);
    currentY += 16;
  } else {
    currentY += 4;
  }

  // 2. Render Tabel Menggunakan AutoTable
  autoTable(doc, {
    startY: currentY,
    head: [headers],
    body: rows,
    theme: "striped",
    headStyles: {
      fillColor: [179, 136, 103], // #b38867
      textColor: [255, 255, 255],
      fontStyle: "bold",
      fontSize: 8.5,
      halign: "left",
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 3,
    },
    alternateRowStyles: {
      fillColor: [253, 251, 249],
    },
    styles: {
      overflow: "linebreak",
      lineWidth: 0.1,
      lineColor: [226, 232, 240],
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: function (data) {
      // 3. Footer di setiap halaman
      doc.setFontSize(7.5);
      doc.setTextColor(148, 163, 184); // slate-400

      // Garis pemisah footer
      doc.setDrawColor(226, 232, 240);
      doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

      // Teks footer
      doc.text(
        "Dokumen resmi Aeterna Mentoring Platform. Bersifat rahasia & sah.",
        14,
        pageHeight - 7
      );

      const pageNumber = doc.internal.getNumberOfPages();
      doc.text(
        `Halaman ${data.pageNumber} dari ${pageNumber}`,
        pageWidth - 14,
        pageHeight - 7,
        { align: "right" }
      );
    },
  });

  // Simpan dokumen PDF
  doc.save(`${fileName}.pdf`);
}
