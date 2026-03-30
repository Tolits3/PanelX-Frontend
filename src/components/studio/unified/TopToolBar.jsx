// src/components/studio/unified/TopToolbar.jsx
import { useState } from "react";
import { useTheme } from "../../../context/ThemeContext";
import ThemeToggle from "../../ThemeToggle";

export default function TopToolbar({
  projectName,
  setProjectName,
  isSaving,
  lastSaved,
  onSave,
  onPublish,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onBack
}) {
  const [isEditingName, setIsEditingName] = useState(false);

  const formatLastSaved = () => {
    if (!lastSaved) return "Not saved";
    const seconds = Math.floor((Date.now() - lastSaved.getTime()) / 1000);
    if (seconds < 60) return "Saved just now";
    const minutes = Math.floor(seconds / 60);
    return `Saved ${minutes}m ago`;
  };

  return (
    <div className="h-16 bg-gray-950 border-b border-gray-800 flex items-center justify-between px-6">
      
      {/* Left - Back + Project Name */}
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white transition-colors"
          title="Back to Dashboard"
        >
          ←
        </button>

        {isEditingName ? (
          <input
            type="text"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyPress={(e) => e.key === 'Enter' && setIsEditingName(false)}
            className="bg-gray-800 text-white px-3 py-2 rounded-lg font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500"
            autoFocus
          />
        ) : (
          <button
            onClick={() => setIsEditingName(true)}
            className="text-white font-bold text-lg hover:text-yellow-400 transition-colors"
          >
            {projectName} ✏️
          </button>
        )}

        <span className="text-gray-500 text-sm">
          {isSaving ? "💾 Saving..." : formatLastSaved()}
        </span>
      </div>

      {/* Center - Main Actions */}
      <div className="flex items-center gap-2">
        
        {/* Undo */}
        <button
          onClick={onUndo}
          disabled={!canUndo}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600 text-white font-bold rounded-lg transition-all"
          title="Undo (Ctrl+Z)"
        >
          ↶
        </button>

        {/* Redo */}
        <button
          onClick={onRedo}
          disabled={!canRedo}
          className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600 text-white font-bold rounded-lg transition-all"
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷
        </button>

        <div className="w-px h-8 bg-gray-700 mx-2" />

        {/* Save */}
        <button
          onClick={onSave}
          disabled={isSaving}
          className="px-6 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 text-white font-bold rounded-lg transition-all"
          title="Save (Ctrl+S)"
        >
          💾 Save
        </button>

        {/* Publish */}
        <button
          onClick={onPublish}
          className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-lg transition-all transform hover:scale-105"
        >
          🚀 Publish
        </button>
      </div>

      {/* Right - Theme + User */}
      <div className="flex items-center gap-3">
        <ThemeToggle />
        
        <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center">
          <span className="text-xl">👤</span>
        </div>
      </div>
    </div>
  );
}