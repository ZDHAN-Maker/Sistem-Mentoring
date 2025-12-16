import React from "react";
import useMyReports from "../../../hooks/mentee/useMyReports";

const MyReports = () => {
  const { reports, loading, error } = useMyReports();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Reports</h1>

      <div className="bg-white rounded-2xl shadow">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat laporan progres...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada laporan progres.
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="divide-y">
            {reports.map((report, index) => (
              <div
                key={report.id || index}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">
                  {report.title || "Progress Report"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {report.description || "Tidak ada deskripsi"}
                </p>

                {report.created_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    Dibuat pada:{" "}
                    {new Date(report.created_at).toLocaleDateString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
