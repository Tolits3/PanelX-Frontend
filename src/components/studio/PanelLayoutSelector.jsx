// src/components/studio/PanelLayoutSelector.jsx
import { useState } from "react";

// Pre-defined panel layout templates
const PANEL_LAYOUTS = [
  {
    id: "single",
    name: "Single Panel",
    icon: "□",
    description: "One full panel",
    panels: [
      { x: 0, y: 0, width: 100, height: 100 }
    ]
  },
  {
    id: "vertical-2",
    name: "Vertical Split",
    icon: "║",
    description: "2 vertical panels",
    panels: [
      { x: 0, y: 0, width: 50, height: 100 },
      { x: 50, y: 0, width: 50, height: 100 }
    ]
  },
  {
    id: "horizontal-2",
    name: "Horizontal Split",
    icon: "═",
    description: "2 horizontal panels",
    panels: [
      { x: 0, y: 0, width: 100, height: 50 },
      { x: 0, y: 50, width: 100, height: 50 }
    ]
  },
  {
    id: "grid-4",
    name: "Grid 4",
    icon: "⊞",
    description: "2x2 grid",
    panels: [
      { x: 0, y: 0, width: 50, height: 50 },
      { x: 50, y: 0, width: 50, height: 50 },
      { x: 0, y: 50, width: 50, height: 50 },
      { x: 50, y: 50, width: 50, height: 50 }
    ]
  },
  {
    id: "vertical-3",
    name: "Vertical 3",
    icon: "⫴",
    description: "3 vertical panels",
    panels: [
      { x: 0, y: 0, width: 33.33, height: 100 },
      { x: 33.33, y: 0, width: 33.33, height: 100 },
      { x: 66.66, y: 0, width: 33.34, height: 100 }
    ]
  },
  {
    id: "manga-standard",
    name: "Manga Standard",
    icon: "⚏",
    description: "Classic manga layout",
    panels: [
      { x: 0, y: 0, width: 100, height: 30 },
      { x: 0, y: 30, width: 50, height: 40 },
      { x: 50, y: 30, width: 50, height: 40 },
      { x: 0, y: 70, width: 100, height: 30 }
    ]
  },
  {
    id: "focus-wide",
    name: "Focus Wide",
    icon: "▭",
    description: "Wide panel + small panels",
    panels: [
      { x: 0, y: 0, width: 100, height: 60 },
      { x: 0, y: 60, width: 33.33, height: 40 },
      { x: 33.33, y: 60, width: 33.33, height: 40 },
      { x: 66.66, y: 60, width: 33.34, height: 40 }
    ]
  },
  {
    id: "dynamic-manga",
    name: "Dynamic Manga",
    icon: "⚡",
    description: "Action-focused layout",
    panels: [
      { x: 0, y: 0, width: 60, height: 50 },
      { x: 60, y: 0, width: 40, height: 30 },
      { x: 60, y: 30, width: 40, height: 20 },
      { x: 0, y: 50, width: 40, height: 50 },
      { x: 40, y: 50, width: 60, height: 50 }
    ]
  },
  {
    id: "spotlight",
    name: "Spotlight",
    icon: "◈",
    description: "Center focus",
    panels: [
      { x: 10, y: 10, width: 80, height: 60 },
      { x: 0, y: 70, width: 50, height: 30 },
      { x: 50, y: 70, width: 50, height: 30 }
    ]
  }
];

export default function PanelLayoutSelector({ isOpen, onClose, onSelectLayout }) {
  const [selectedLayout, setSelectedLayout] = useState(null);

  const handleSelect = (layout) => {
    setSelectedLayout(layout.id);
    onSelectLayout(layout);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border-2 border-yellow-500/30 max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-6 border-b border-gray-700 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-black text-white mb-1">
              📐 Choose Panel Layout
            </h2>
            <p className="text-gray-400 text-sm">
              Select a manga/comic panel template to get started
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Layout Grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PANEL_LAYOUTS.map((layout) => (
              <button
                key={layout.id}
                onClick={() => handleSelect(layout)}
                className={`
                  group relative bg-gray-800 hover:bg-gray-750 rounded-xl p-4 
                  border-2 transition-all
                  ${
                    selectedLayout === layout.id
                      ? "border-yellow-500 shadow-lg shadow-yellow-500/20"
                      : "border-gray-700 hover:border-yellow-500/50"
                  }
                `}
              >
                {/* Preview */}
                <div className="aspect-[3/4] bg-gray-900 rounded-lg mb-3 relative overflow-hidden">
                  {layout.panels.map((panel, idx) => (
                    <div
                      key={idx}
                      className="absolute border border-yellow-500/40 bg-yellow-500/5"
                      style={{
                        left: `${panel.x}%`,
                        top: `${panel.y}%`,
                        width: `${panel.width}%`,
                        height: `${panel.height}%`,
                      }}
                    >
                      <span className="absolute top-1 left-1 text-yellow-400 text-xs font-bold opacity-60">
                        {idx + 1}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Info */}
                <div className="text-left">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-2xl">{layout.icon}</span>
                    <h3 className="text-white font-bold text-sm">
                      {layout.name}
                    </h3>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {layout.description}
                  </p>
                  <p className="text-yellow-400 text-xs mt-1">
                    {layout.panels.length} panel{layout.panels.length > 1 ? "s" : ""}
                  </p>
                </div>

                {/* Selected Badge */}
                {selectedLayout === layout.id && (
                  <div className="absolute top-2 right-2 bg-yellow-500 text-gray-900 rounded-full w-6 h-6 flex items-center justify-center">
                    <span className="text-sm font-black">✓</span>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-700 flex items-center justify-between">
          <p className="text-gray-400 text-sm">
            💡 <strong>Tip:</strong> You can resize and reposition panels after adding them
          </p>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                if (selectedLayout) {
                  const layout = PANEL_LAYOUTS.find(l => l.id === selectedLayout);
                  handleSelect(layout);
                  onClose();
                }
              }}
              disabled={!selectedLayout}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-black rounded-lg transition-colors"
            >
              Apply Layout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}