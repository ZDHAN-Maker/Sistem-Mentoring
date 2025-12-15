import React from "react";
import useMyTasks from "../../../hooks/mentee/useMyTasks";

const MyTasks = () => {
  const { tasks, loading, error } = useMyTasks();

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-emerald-100 text-emerald-700";
      case "on going":
      case "ongoing":
        return "bg-amber-100 text-amber-700";
      case "not completed":
      default:
        return "bg-rose-100 text-rose-700";
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">My Tasks</h1>
          <p className="text-sm text-gray-500">
            Daftar tugas yang perlu kamu selesaikan.
          </p>
        </div>

        <div className="text-sm text-gray-600">
          Total tasks:{" "}
          <span className="font-semibold">{tasks.length}</span>
        </div>
      </div>

      {/* Card utama */}
      <div className="bg-white rounded-2xl shadow">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat daftar tugas...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada tugas yang tersedia.
          </div>
        )}

        {!loading && !error && tasks.length > 0 && (
          <div className="divide-y">
            {tasks.map((task, index) => (
              <div
                key={task.id || index}
                className="p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">
                      {task.title || task.name || "Untitled Task"}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {task.description || "No description"}
                    </p>

                    {task.deadline && (
                      <p className="text-xs text-gray-400 mt-1">
                        Deadline:{" "}
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  <div className="ml-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusClass(
                        task.status
                      )}`}
                    >
                      {task.status || "Not Started"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyTasks;
