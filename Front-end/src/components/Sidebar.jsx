import React from 'react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
    const navigate = useNavigate();

    const handleNavigation = (path) => {
        navigate(path);
    };

    return (
        <aside className="w-64 bg-white shadow-md p-6 flex flex-col justify-between">
            <div>
                {/* Logo Section */}
                <div className="flex flex-col items-center mb-8">
                    <img
                        src="/assets/Logo Sistem Mentoring.png"
                        alt="Logo"
                        className="w-20 h-20 object-contain mb-2"
                    />
                    <h2 className="text-lg font-semibold text-gray-700">Mentor Panel</h2>
                </div>

                {/* Learning Section */}
                <div className="text-gray-500 text-xs uppercase mb-2">Learning</div>
                <ul>
                    <li
                        className="bg-[#b38867] text-white rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/dashboard')}
                    >
                        Dashboard
                    </li>

                    <li
                        className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/mentees')}
                    >
                        List of Mentees
                    </li>

                    <li
                        className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/mentoring-schedule')}
                    >
                        Mentoring Schedule
                    </li>

                    <li
                        className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/mentee-progress')}
                    >
                        Mentee Progress Report
                    </li>

                    <li
                        className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/export-report')}
                    >
                        Export Report
                    </li>

                    <li
                        className="text-gray-700 hover:bg-gray-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/announcements')}
                    >
                        Announcement
                    </li>
                </ul>

                {/* Logout Section */}
                <div className="text-gray-500 text-xs uppercase mt-4 mb-2">Account</div>
                <ul>
                    <li
                        className="text-gray-700 hover:bg-red-100 rounded-md px-3 py-2 mb-2 cursor-pointer"
                        onClick={() => handleNavigation('/logout')}
                    >
                        Logout
                    </li>
                </ul>
            </div>
        </aside>
    );
};

export default Sidebar;
