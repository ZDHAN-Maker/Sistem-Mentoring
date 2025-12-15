import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useNotifications from "../hooks/useNotifications";
import { FaBell, FaTrash } from "react-icons/fa";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { notifications, markAsRead, deleteNotification } = useNotifications();

  const unreadCount = notifications.filter(n => n.status === "unread").length;
  const [openNotif, setOpenNotif] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md p-4 flex justify-between items-center">

      {/* Logo */}
      <h1 className="text-2xl font-semibold">Aeterna Mentoring</h1>

      {/* Right section */}
      <div className="flex items-center gap-6 relative">

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="text-gray-600 relative"
          >
            <FaBell size={22} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Notifikasi */}
          {openNotif && (
            <div className="absolute right-0 mt-3 w-72 bg-white rounded-lg shadow-lg border z-50 max-h-96 overflow-y-auto">
              <h3 className="px-4 py-2 border-b font-semibold text-gray-700">
                Notifikasi
              </h3>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-4">Tidak ada notifikasi</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`px-4 py-3 border-b hover:bg-gray-50 cursor-pointer ${
                      notif.status === "unread" ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700">{notif.message}</p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="text-gray-400 hover:text-red-500"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <span className="text-xs text-gray-400">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User info */}
        <div className="flex items-center gap-2">
          <span className="text-gray-800 font-medium">
            {user?.username || user?.name || "User"}
          </span>
          <div className="w-10 h-10 bg-[#b38867] rounded-full"></div>
        </div>

        <button className="text-red-500 font-semibold" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
