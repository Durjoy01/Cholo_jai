import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignOutAlt, FaUser, FaHistory } from "react-icons/fa";
import { useUserContext } from "./UserContext";

const Sidebar = () => {
  const { user, logout } = useUserContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();          // Clear user data
    navigate("/login"); // Redirect to login page
  };

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-6">
      <Link to="/" className="flex items-center mb-10">
        <img src="/whitelogo.png" alt="Logo" className="h-10 mr-2" />
      </Link>

      <div className="flex flex-col items-center mb-10">
        <img
          src={user?.profileImage || "/default-profile.png"}
          alt="Profile"
          className="h-16 w-16 rounded-full mb-2 border border-gray-500"
        />
        <span className="text-lg font-semibold">{user?.name}</span>
      </div>

      <nav className="space-y-6">
        <Link to="/profile" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
          <FaUser className="mr-3" />
          Profile
        </Link>
        <Link to="/profile/purchase-history" className="flex items-center text-gray-300 hover:text-white transition-colors duration-200">
          <FaHistory className="mr-3" />
          Purchase History
        </Link>
        <button
          className="flex items-center text-gray-300 hover:text-white transition-colors duration-200"
          onClick={handleLogout}
        >
          <FaSignOutAlt className="mr-3" />
          Logout
        </button>
      </nav>
    </aside>
  );
};

export default Sidebar;
