export default function Topbar() {
  return (
    <div className="h-14 bg-gradient-to-r from-green-900 via-green-800 to-green-900 border-b-4 border-yellow-500 flex items-center justify-between px-4 shadow-lg">
      {/* Left: Logo/Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-bold text-yellow-400">
          GOAT Studio
        </h1>
        <span className="text-green-300 text-xs">
          AI Comic Generator
        </span>
      </div>

      {/* Center: Quick Actions */}
      <div className="flex items-center gap-2">
        <button className="p-1.5 hover:bg-green-700 rounded-lg transition-colors text-yellow-400 text-lg" title="Undo (Ctrl+Z)">
          ↶
        </button>
        <button className="p-1.5 hover:bg-green-700 rounded-lg transition-colors text-yellow-400 text-lg" title="Redo (Ctrl+Y)">
          ↷
        </button>
        <button className="p-1.5 hover:bg-green-700 rounded-lg transition-colors text-yellow-400 text-lg" title="Save (Ctrl+S)">
          💾
        </button>
      </div>

      {/* Right: Main Actions */}
      <div className="flex items-center gap-2">
        <button className="px-3 py-1.5 bg-green-700 hover:bg-green-600 text-yellow-400 font-semibold rounded-lg transition-colors flex items-center gap-1 border-2 border-yellow-500 text-sm">
          👁️ Preview
        </button>
        <button className="px-3 py-1.5 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold rounded-lg transition-colors flex items-center gap-1 shadow-lg shadow-yellow-500/50 text-sm">
          💾 Export
        </button>
      </div>
    </div>
  );
}