// src/components/studio/unified/LeftSidebar.jsx
export default function LeftSidebar({
  activeTool,
  setActiveTool,
  toolSettings,
  setToolSettings,
  onAddPanel
}) {
  
  const TOOLS = [
    { id: "select", icon: "↖️", name: "Select" },
    { id: "brush", icon: "🖌️", name: "Brush" },
    { id: "pencil", icon: "✏️", name: "Pencil" },
    { id: "eraser", icon: "🧹", name: "Eraser" },
    { id: "text", icon: "📝", name: "Text" },
    { id: "shape", icon: "🔲", name: "Shape" },
    { id: "image", icon: "🖼️", name: "Image" },
    { id: "ai", icon: "🤖", name: "AI Generate" }
  ];

  const COLORS = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
  ];

  return (
    <div className="w-20 bg-gray-950 border-r border-gray-800 flex flex-col items-center py-4 gap-4 overflow-y-auto">
      
      {/* Tools */}
      <div className="space-y-2">
        <p className="text-gray-500 text-xs font-bold text-center mb-2">TOOLS</p>
        
        {TOOLS.map(tool => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id)}
            className={`
              w-14 h-14 rounded-xl flex flex-col items-center justify-center
              transition-all transform hover:scale-110
              ${activeTool === tool.id
                ? "bg-yellow-500 text-gray-900 shadow-lg"
                : "bg-gray-800 text-white hover:bg-gray-700"
              }
            `}
            title={tool.name}
          >
            <span className="text-2xl">{tool.icon}</span>
          </button>
        ))}
      </div>

      <div className="w-12 h-px bg-gray-700" />

      {/* Colors (only show if brush/pencil/text selected) */}
      {["brush", "pencil", "text"].includes(activeTool) && (
        <div className="space-y-2">
          <p className="text-gray-500 text-xs font-bold text-center mb-2">COLOR</p>
          
          {COLORS.map(color => (
            <button
              key={color}
              onClick={() => setToolSettings({ ...toolSettings, brushColor: color, textColor: color })}
              className={`
                w-12 h-12 rounded-lg transition-all
                ${(toolSettings.brushColor === color || toolSettings.textColor === color)
                  ? "ring-2 ring-yellow-500 scale-110"
                  : "hover:scale-110"
                }
              `}
              style={{ backgroundColor: color, border: "2px solid #374151" }}
            />
          ))}

          {/* Custom Color */}
          <input
            type="color"
            value={toolSettings.brushColor}
            onChange={(e) => setToolSettings({ 
              ...toolSettings, 
              brushColor: e.target.value,
              textColor: e.target.value 
            })}
            className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
          />
        </div>
      )}

      {/* Brush Size (only show if brush/eraser selected) */}
      {["brush", "pencil", "eraser"].includes(activeTool) && (
        <div className="space-y-2">
          <p className="text-gray-500 text-xs font-bold text-center mb-2">SIZE</p>
          
          {[2, 5, 10, 20, 40].map(size => (
            <button
              key={size}
              onClick={() => {
                if (activeTool === "eraser") {
                  setToolSettings({ ...toolSettings, eraserSize: size });
                } else {
                  setToolSettings({ ...toolSettings, brushSize: size });
                }
              }}
              className={`
                w-12 h-12 bg-gray-800 hover:bg-gray-700 rounded-lg
                flex items-center justify-center transition-all
                ${(toolSettings.brushSize === size || toolSettings.eraserSize === size)
                  ? "ring-2 ring-yellow-500"
                  : ""
                }
              `}
            >
              <div
                className="rounded-full bg-white"
                style={{ width: size, height: size }}
              />
            </button>
          ))}
        </div>
      )}

      <div className="flex-1" />

      {/* Add Panel Button */}
      <button
        onClick={onAddPanel}
        className="w-14 h-14 bg-yellow-500 hover:bg-yellow-400 text-gray-900 rounded-xl font-black text-2xl transition-all transform hover:scale-110 shadow-lg"
        title="Add Panel"
      >
        +
      </button>
    </div>
  );
}