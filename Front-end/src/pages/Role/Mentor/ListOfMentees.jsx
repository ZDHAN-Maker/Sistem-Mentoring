import React from "react";
import { useAuth } from "../../../context/useAuth";
import useMentorMentees from "../../../hooks/Mentor/useMentorMentees";
import {
  UsersIcon,
  UserCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/solid";

const ListOfMentees = () => {
  const { user } = useAuth();
  const { mentees, loading, error } = useMentorMentees(user?.id);

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <UsersIcon className="w-8 h-8 text-[#8B5E34]" />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">List of Mentees</h1>
            <p className="text-sm text-gray-500">
              Daftar mentee yang Anda bimbing.
            </p>
          </div>
        </div>

        <div className="text-sm bg-white/60 backdrop-blur-md px-4 py-2 rounded-lg shadow border text-gray-700">
          Total mentee:{" "}
          <span className="font-bold text-[#8B5E34]">{mentees.length}</span>
        </div>
      </div>

      {/* Card */}
      <div className="bg-white/60 backdrop-blur-md rounded-2xl shadow border border-gray-200 overflow-hidden">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat daftar mentee...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && mentees.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada mentee yang terdaftar pada Anda.
          </div>
        )}

        {!loading && !error && mentees.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm backdrop-blur">
              <thead className="bg-gray-100/60">
                <tr>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">
                    No
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">
                    Nama Mentee
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left font-bold text-gray-700">
                    Status Pairing
                  </th>
                </tr>
              </thead>

              <tbody>
                {mentees.map((pair, index) => {
                  const mentee = pair.mentee || pair;

                  return (
                    <tr
                      key={pair.id || index}
                      className="border-t hover:bg-gray-50/60 transition"
                    >
                      <td className="px-6 py-4 font-medium">
                        {index + 1}
                      </td>

                      <td className="px-6 py-4 flex items-center gap-3">
                        <UserCircleIcon className="w-8 h-8 text-[#8B5E34]" />
                        <span className="font-medium text-gray-800">
                          {mentee.name || "-"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-700">
                        {mentee.email || "-"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">
                          <CheckCircleIcon className="w-4 h-4" />
                          {pair.status || "active"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfMentees;
