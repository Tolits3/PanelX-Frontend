// src/components/Header.jsx
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Header({ title, actions = [] }) {
  const navigate = useNavigate();

  return (
    <div className="bg-black/40 dark:bg-black/40 light:bg-white/90 border-b border-yellow-500/30 px-6 py-4 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left - Title */}
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-black text-yellow-400 tracking-wider">
            {title || "PANELX"}
          </h1>
        </div>

        {/* Right - Actions + Theme Toggle */}
        <div className="flex items-center gap-3">
          
          {/* Custom Action Buttons */}
          {actions.map((action, idx) => (
            <button
              key={idx}
              onClick={action.onClick}
              className={action.className || "px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"}
            >
              {action.label}
            </button>
          ))}

          {/* Theme Toggle - Always visible */}
          <ThemeToggle />

          {/* Profile/Avatar */}
          <button
            onClick={() => navigate("/profile")}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
            title="Profile"
          >
            <span className="text-xl">👤</span>
          </button>
        </div>
      </div>
    </div>
  );
}