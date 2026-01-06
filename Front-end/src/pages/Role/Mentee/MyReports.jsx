import React from "react";
import useMyReports from "../../../hooks/mentee/useMyReports";

const MyReports = () => {
  const { reports, loading, error } = useMyReports();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Reports</h1>
          <p className="text-sm text-gray-500">
            Laporan perkembangan yang telah kamu kirimkan.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total Reports:{" "}
          <span className="font-semibold">{reports.length}</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat laporan...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && reports.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada laporan yang dikirim.
          </div>
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="divide-y">
            {reports.map((report, index) => (
              <div
                key={report.id || index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {report.judul}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {report.isi.substring(0, 120)}...
                    </p>

                    <p className="text-xs text-gray-400 mt-1">
                      Dibuat: {new Date(report.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      report.status === "approved"
                        ? "bg-emerald-100 text-emerald-700"
                        : report.status === "reviewed"
                        ? "bg-amber-100 text-amber-700"
                        : report.status === "rejected"
                        ? "bg-rose-100 text-rose-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {report.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyReports;
