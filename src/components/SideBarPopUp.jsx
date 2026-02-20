import React from "react";
import { FiX, FiUser, FiDollarSign, FiShoppingCart, FiLogOut, FiBookOpen, FiPenTool, FiMoon } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const SidebarPopUp = ({ isOpen, onClose, toggleDarkMode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-gray-900/95 backdrop-blur-md text-white shadow-xl transform transition-transform duration-300 z-50 ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      {/* Header */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold tracking-wide">Menu</h2>
        <button onClick={onClose} className="hover:text-red-400">
          <FiX size={22} />
        </button>
      </div>

      {/* Menu List */}
      <ul className="p-4 space-y-4 text-sm">
        <li>
          <button
            onClick={() => {
              navigate("/reader-dashboard");
              onClose();
            }}
            className="flex items-center space-x-2 hover:text-purple-400 transition"
          >
            <FiBookOpen /> <span>Be a Reader</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              navigate("/creator-dashboard");
              onClose();
            }}
            className="flex items-center space-x-2 hover:text-purple-400 transition"
          >
            <FiPenTool /> <span>Be a Creator</span>
          </button>
        </li>

        <li>
          <button className="flex items-center space-x-2 hover:text-purple-400 transition">
            <FiUser /> <span>Profile</span>
          </button>
        </li>

        <li>
          <button className="flex items-center space-x-2 hover:text-purple-400 transition">
            <FiDollarSign /> <span>Monetization</span>
          </button>
        </li>

        <li>
          <button className="flex items-center space-x-2 hover:text-purple-400 transition">
            <FiShoppingCart /> <span>Shop</span>
          </button>
        </li>

        <li>
          <button
            onClick={toggleDarkMode}
            className="flex items-center space-x-2 hover:text-purple-400 transition"
          >
            <FiMoon /> <span>Toggle Dark Mode</span>
          </button>
        </li>

        <li>
          <button
            onClick={() => {
              logout();
              navigate("/");
              onClose();
            }}
            className="flex items-center space-x-2 text-red-400 hover:text-red-500 transition"
          >
            <FiLogOut /> <span>Log Out</span>
          </button>
        </li>
      </ul>
    </div>
  );
};

export default SidebarPopUp;
