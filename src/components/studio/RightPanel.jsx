import { useState } from "react";

export default function RightPanel({ selectedBubble, onUpdateBubble, characters, onAddCharacter }) {
  const [activeTab, setActiveTab] = useState("characters");
  const [aiPrompt, setAiPrompt] = useState("");

  const tabs = [
    { id: "characters", icon: "👥", label: "Characters" },
    { id: "layout", icon: "📐", label: "Layout" },
    { id: "background", icon: "🖼️", label: "Background" },
    { id: "style", icon: "🎨", label: "Style" },
    { id: "effects", icon: "✨", label: "Effects" },
  ];

  const handleDragStart = (e, character) => {
    e.dataTransfer.setData("character", JSON.stringify(character));
  };

  const handleGenerateWithAI = () => {
    if (!aiPrompt.trim()) return;
    alert(`AI Generation: "${aiPrompt}"\n\nThis will call your AI API to generate the entire panel!`);
    // TODO: Connect to your AI generation API
  };

  return (
    <div className="w-80 bg-gradient-to-b from-green-900 to-green-950 border-l-4 border-yellow-500 flex flex-col">
      {/* Tab Navigation */}
      <div className="flex border-b-2 border-yellow-500 overflow-x-auto">
        {tabs.map(({ id, icon, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 min-w-[60px] py-3 flex flex-col items-center justify-center gap-1 transition-colors ${
              activeTab === id
                ? "bg-yellow-500 text-green-900 font-bold"
                : "text-yellow-400 hover:bg-green-800"
            }`}
          >
            <span className="text-lg">{icon}</span>
            <span className="text-[10px]">{label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === "characters" && (
          <div className="space-y-4">
            <h3 className="text-yellow-400 font-bold mb-4">Character Library</h3>
            
            {/* Generate Character Button */}
            <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">🎨</span>
              Generate Character
            </button>

            {/* Upload Character Button */}
            <button className="w-full py-3 bg-green-700 hover:bg-green-600 text-yellow-400 font-semibold rounded-lg transition-colors flex items-center justify-center gap-2 border-2 border-yellow-500">
              <span className="text-xl">📤</span>
              Upload Character
            </button>

            <div className="h-px bg-yellow-500/30 my-4" />

            {/* Character Grid */}
            <div>
              <label className="block text-green-300 text-sm mb-3 font-semibold">
                Your Characters {characters?.length > 0 && `(${characters.length})`}
              </label>
              
              {characters && characters.length > 0 ? (
                <div className="grid grid-cols-2 gap-3">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, char)}
                      className="relative group cursor-move bg-green-800 border-2 border-yellow-600 rounded-lg p-2 hover:border-yellow-400 hover:scale-105 transition-all"
                    >
                      <div className="aspect-square bg-gray-900 rounded overflow-hidden mb-2">
                        {char.imageUrl ? (
                          <img 
                            src={char.imageUrl} 
                            alt={char.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-4xl">
                            👤
                          </div>
                        )}
                      </div>
                      <div className="text-yellow-400 text-xs font-semibold text-center truncate">
                        {char.name || "Character"}
                      </div>
                      
                      {/* Drag hint */}
                      <div className="absolute inset-0 bg-yellow-500/0 group-hover:bg-yellow-500/10 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-yellow-400 text-xs font-bold bg-green-900 px-2 py-1 rounded">
                          Drag to canvas
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 bg-green-800/50 rounded-lg border-2 border-dashed border-yellow-600">
                  <div className="text-4xl mb-2">👤</div>
                  <p className="text-green-300 text-sm">No characters yet</p>
                  <p className="text-green-400 text-xs mt-1">Generate or upload to start</p>
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="mt-6 p-3 bg-green-800/50 rounded-lg border border-yellow-600">
              <div className="text-xs text-green-300 space-y-1">
                <p className="font-semibold text-yellow-400 mb-2">Quick Tips:</p>
                <p>• Generate AI characters with custom prompts</p>
                <p>• Upload your own character images</p>
                <p>• Drag characters onto the canvas</p>
                <p>• Resize and position as needed</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "background" && (
          <div className="space-y-4">
            <h3 className="text-yellow-400 font-bold mb-4">Background</h3>
            
            <button className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold rounded-lg transition-colors flex items-center justify-center gap-2">
              <span className="text-xl">✨</span>
              Generate Background
            </button>

            <div className="mt-6">
              <label className="block text-green-300 text-sm mb-2">Preset Backgrounds</label>
              <div className="grid grid-cols-2 gap-2">
                {["City", "Forest", "Space", "Beach", "Desert", "Snow"].map(bg => (
                  <button
                    key={bg}
                    className="py-2 bg-green-800 hover:bg-green-700 text-yellow-400 rounded border-2 border-yellow-600 transition-colors"
                  >
                    {bg}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <label className="block text-green-300 text-sm mb-2">Background Color</label>
              <input
                type="color"
                className="w-full h-10 rounded cursor-pointer"
                defaultValue="#1a1a1a"
              />
            </div>
          </div>
        )}

        {activeTab === "style" && (
          <div className="space-y-4">
            <h3 className="text-yellow-400 font-bold mb-4">Style Options</h3>

            {selectedBubble ? (
              <>
                <div>
                  <label className="block text-green-300 text-sm mb-2">Font Size</label>
                  <input
                    type="range"
                    min="12"
                    max="32"
                    defaultValue="16"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-green-300 text-sm mb-2">Border Width</label>
                  <input
                    type="range"
                    min="1"
                    max="8"
                    defaultValue="4"
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-green-300 text-sm mb-2">Text Color</label>
                  <input
                    type="color"
                    className="w-full h-10 rounded cursor-pointer"
                    defaultValue="#000000"
                  />
                </div>

                <div>
                  <label className="block text-green-300 text-sm mb-2">Background</label>
                  <input
                    type="color"
                    className="w-full h-10 rounded cursor-pointer"
                    defaultValue="#ffffff"
                  />
                </div>
              </>
            ) : (
              <div className="text-center text-green-400 py-8">
                Select a bubble to edit its style
              </div>
            )}
          </div>
        )}

        {activeTab === "effects" && (
          <div className="space-y-4">
            <h3 className="text-yellow-400 font-bold mb-4">Effects</h3>

            <div className="space-y-3">
              {["Shadow", "Glow", "3D Effect", "Motion Lines", "Speed Lines"].map(effect => (
                <label key={effect} className="flex items-center gap-3 p-3 bg-green-800 rounded border border-yellow-600 cursor-pointer hover:bg-green-700 transition-colors">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="text-yellow-400">{effect}</span>
                </label>
              ))}
            </div>

            <div className="mt-6">
              <label className="block text-green-300 text-sm mb-2">Effect Intensity</label>
              <input
                type="range"
                min="0"
                max="100"
                defaultValue="50"
                className="w-full"
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer Tips */}
      <div className="p-4 border-t-2 border-yellow-500 bg-green-950">
        <div className="text-xs text-green-300 space-y-1">
          {activeTab === "characters" && (
            <>
              <p>💡 <strong className="text-yellow-400">Tip:</strong> Drag characters to canvas</p>
              <p>💡 AI generates transparent backgrounds</p>
            </>
          )}
          {activeTab === "layout" && (
            <>
              <p>💡 <strong className="text-yellow-400">Quick:</strong> Use AI Auto-Generate</p>
              <p>💡 <strong className="text-yellow-400">Control:</strong> Choose manual layouts</p>
            </>
          )}
          {activeTab === "background" && (
            <>
              <p>💡 <strong className="text-yellow-400">Tip:</strong> Generate custom backgrounds</p>
              <p>💡 Use presets for quick setups</p>
            </>
          )}
          {activeTab === "style" && (
            <>
              <p>💡 <strong className="text-yellow-400">Tip:</strong> Select a bubble to edit</p>
              <p>💡 Customize colors and fonts</p>
            </>
          )}
          {activeTab === "effects" && (
            <>
              <p>💡 <strong className="text-yellow-400">Tip:</strong> Stack effects for impact</p>
              <p>💡 Adjust intensity with slider</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}