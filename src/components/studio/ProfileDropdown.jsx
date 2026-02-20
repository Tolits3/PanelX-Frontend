import { useState, useRef, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function UserProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, userProfile, logout } = useAuth();
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Get user initials for avatar fallback
  const getInitials = () => {
    if (userProfile?.username) {
      return userProfile.username.charAt(0).toUpperCase();
    }
    if (user?.email) {
      return user.email.charAt(0).toUpperCase();
    }
    return "U";
  };

  // Get display name
  const getDisplayName = () => {
    return userProfile?.username || user?.email || "User";
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Profile Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
      >
        {/* Avatar */}
        {userProfile?.avatar_url ? (
          <img
            src={userProfile.avatar_url}
            alt="Avatar"
            className="w-8 h-8 rounded-full object-cover border-2 border-yellow-500"
          />
        ) : (
          <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 border-2 border-yellow-500">
            {getInitials()}
          </div>
        )}
        
        {/* Username (hidden on mobile) */}
        <span className="hidden md:block text-sm text-white max-w-[150px] truncate">
          {getDisplayName()}
        </span>
        
        {/* Dropdown arrow */}
        <svg
          className={`w-4 h-4 text-white transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-gray-800 border-2 border-yellow-500 rounded-lg shadow-xl z-50">
          {/* User Info */}
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center gap-3">
              {userProfile?.avatar_url ? (
                <img
                  src={userProfile.avatar_url}
                  alt="Avatar"
                  className="w-12 h-12 rounded-full object-cover border-2 border-yellow-500"
                />
              ) : (
                <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center font-bold text-gray-900 text-xl border-2 border-yellow-500">
                  {getInitials()}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white font-semibold truncate">
                  {getDisplayName()}
                </p>
                <p className="text-gray-400 text-xs">
                  {userProfile?.role === "creator" ? "🎨 Creator" : "📚 Reader"}
                </p>
              </div>
            </div>
            
            {/* Bio */}
            {userProfile?.bio && (
              <p className="mt-2 text-gray-400 text-xs line-clamp-2">
                {userProfile.bio}
              </p>
            )}
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/profile-settings");
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">⚙️</span>
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                navigate(userProfile?.role === "creator" ? "/creator-dashboard" : "/reader-dashboard");
              }}
              className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">🏠</span>
              <span>Dashboard</span>
            </button>

            {userProfile?.role === "creator" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/creator-studio");
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">🎨</span>
                <span>Studio</span>
              </button>
            )}

            {userProfile?.role === "reader" && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  navigate("/reader-home");
                }}
                className="w-full px-4 py-2 text-left text-white hover:bg-gray-700 transition-colors flex items-center gap-3"
              >
                <span className="text-xl">📚</span>
                <span>Library</span>
              </button>
            )}

            <div className="border-t border-gray-700 my-2"></div>

            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-left text-red-400 hover:bg-gray-700 transition-colors flex items-center gap-3"
            >
              <span className="text-xl">🚪</span>
              <span>Logout</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}