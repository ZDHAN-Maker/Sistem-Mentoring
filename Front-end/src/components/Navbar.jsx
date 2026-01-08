import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import useNotifications from "../hooks/useNotifications";
import { FaBell, FaTrash } from "react-icons/fa";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserCircle } from "@fortawesome/free-solid-svg-icons";

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
    <header className="backdrop-blur-xl bg-[#f7f1e9]/70 shadow-lg px-8 py-4 flex justify-between items-center border-b border-[#d3c7b8]/50">
      
      {/* Logo */}
      <h1 className="text-3xl font-extrabold text-[#5a4635] tracking-wide drop-shadow-sm">
        Aeterna Mentoring
      </h1>

      {/* Right section */}
      <div className="flex items-center gap-8 relative">

        {/* Notification Icon */}
        <div className="relative">
          <button
            onClick={() => setOpenNotif(!openNotif)}
            className="text-[#5a4635] hover:text-[#3a2f23] transition relative"
          >
            <FaBell size={24} />

            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full shadow-md font-semibold">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown Notifications */}
          {openNotif && (
            <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-[#d6c4ac]/40 z-50 max-h-96 overflow-y-auto animate-fadeIn backdrop-blur-md">
              <h3 className="px-5 py-3 border-b font-semibold text-[#5a4635] bg-[#f0e7dd]/60 rounded-t-2xl">
                Notifikasi
              </h3>

              {notifications.length === 0 ? (
                <p className="text-center text-gray-500 py-6">Tidak ada notifikasi</p>
              ) : (
                notifications.map(notif => (
                  <div
                    key={notif.id}
                    className={`px-4 py-4 border-b border-gray-100 hover:bg-[#f9f3eb] transition cursor-pointer ${
                      notif.status === "unread" ? "bg-[#f3ecdf]" : ""
                    }`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className="flex justify-between items-start">
                      <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNotification(notif.id);
                        }}
                        className="text-gray-400 hover:text-red-500 transition ml-2"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>

                    <span className="text-xs text-gray-400 mt-1 block">
                      {new Date(notif.created_at).toLocaleString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* User Info */}
        <div className="flex items-center gap-3 bg-[#f0e7dd]/70 px-4 py-2 rounded-full shadow-sm border border-[#cbb9a7]/40 backdrop-blur-sm">
          <FontAwesomeIcon
            icon={faUserCircle}
            size="2x"
            className="text-[#5a4635]"
          />
          <span className="text-[#3a2f23] font-semibold tracking-wide">
            {user?.username || user?.name || "User"}
          </span>
        </div>

        {/* Logout */}
        <button
          className="text-red-500 font-semibold hover:text-red-600 transition tracking-wide"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
