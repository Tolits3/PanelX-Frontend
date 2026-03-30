// src/components/studio/unified/RightSidebar.jsx
import { useState } from "react";
import API_URL from "../../../config";

export default function RightSidebar({
  panels,
  activePanelId,
  setActivePanelId,
  onDeletePanel,
  onReorderPanels,
  userUid
}) {
  const [activeTab, setActiveTab] = useState("layers"); // "layers" or "ai"
  const [aiMessage, setAiMessage] = useState("");
  const [aiChat, setAiChat] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!aiMessage.trim() || aiLoading) return;

    const userMsg = aiMessage;
    setAiMessage("");

    // Add user message
    setAiChat([...aiChat, { role: "user", content: userMsg }]);
    setAiLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/chat/message`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsg,
          user_uid: userUid,
          generate_image: false
        })
      });

      const data = await res.json();

      if (data.success) {
        setAiChat(prev => [...prev, { role: "ai", content: data.response }]);
      } else {
        setAiChat(prev => [...prev, { role: "error", content: "Failed to get response" }]);
      }
    } catch (error) {
      console.error("AI chat error:", error);
      setAiChat(prev => [...prev, { role: "error", content: "Error connecting to AI" }]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="w-80 bg-gray-950 border-l border-gray-800 flex flex-col">
      
      {/* Tab Switcher */}
      <div className="h-12 border-b border-gray-800 flex">
        <button
          onClick={() => setActiveTab("layers")}
          className={`flex-1 font-bold text-sm transition-colors ${
            activeTab === "layers"
              ? "bg-gray-900 text-yellow-400 border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          📊 Layers
        </button>
        <button
          onClick={() => setActiveTab("ai")}
          className={`flex-1 font-bold text-sm transition-colors ${
            activeTab === "ai"
              ? "bg-gray-900 text-yellow-400 border-b-2 border-yellow-500"
              : "text-gray-400 hover:text-white"
          }`}
        >
          🤖 AI Chat
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        
        {/* LAYERS TAB */}
        {activeTab === "layers" && (
          <div className="h-full flex flex-col">
            <div className="p-4 border-b border-gray-800">
              <h3 className="text-white font-bold text-sm mb-2">Panel List</h3>
              <p className="text-gray-500 text-xs">
                Click to edit | Drag to reorder
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {panels.map((panel, idx) => (
                <div
                  key={panel.id}
                  onClick={() => setActivePanelId(panel.id)}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all
                    ${panel.id === activePanelId
                      ? "bg-yellow-500/20 border-2 border-yellow-500"
                      : "bg-gray-900 border-2 border-gray-700 hover:border-gray-600"
                    }
                  `}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">⋮⋮</span>
                      <span className="text-white font-bold text-sm">
                        Panel {panel.order}
                      </span>
                    </div>
                    
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (panels.length > 1) {
                          onDeletePanel(panel.id);
                        } else {
                          alert("Cannot delete the last panel!");
                        }
                      }}
                      className="w-6 h-6 bg-red-600 hover:bg-red-500 rounded text-white text-xs transition-colors"
                    >
                      ✕
                    </button>
                  </div>

                  {/* Thumbnail Preview */}
                  <div
                    className="w-full aspect-[2/3] bg-gray-800 rounded border border-gray-700 flex items-center justify-center"
                    style={{ backgroundColor: panel.background }}
                  >
                    {panel.layers.length === 0 ? (
                      <span className="text-gray-600 text-xs">Empty</span>
                    ) : (
                      <span className="text-gray-600 text-xs">{panel.layers.length} layers</span>
                    )}
                  </div>

                  <div className="mt-2 text-gray-500 text-xs">
                    {panel.width}x{panel.height}px
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-800">
              <p className="text-gray-500 text-xs text-center">
                💡 Use the + button to add panels
              </p>
            </div>
          </div>
        )}

        {/* AI CHAT TAB */}
        {activeTab === "ai" && (
          <div className="h-full flex flex-col">
            
            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {aiChat.length === 0 ? (
                <div className="text-center text-gray-500 mt-12">
                  <p className="text-4xl mb-3">🤖</p>
                  <p className="font-bold text-sm mb-1">AI Assistant</p>
                  <p className="text-xs">Ask for ideas, tips, or generate images!</p>
                </div>
              ) : (
                aiChat.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3 rounded-lg ${
                      msg.role === "user"
                        ? "bg-yellow-500/20 ml-4"
                        : msg.role === "error"
                        ? "bg-red-500/20"
                        : "bg-gray-900 mr-4"
                    }`}
                  >
                    <p className={`text-xs font-bold mb-1 ${
                      msg.role === "user" ? "text-yellow-400" : "text-gray-400"
                    }`}>
                      {msg.role === "user" ? "You" : msg.role === "error" ? "Error" : "AI"}
                    </p>
                    <p className="text-white text-sm leading-relaxed">
                      {msg.content}
                    </p>
                  </div>
                ))
              )}

              {aiLoading && (
                <div className="bg-gray-900 p-3 rounded-lg mr-4">
                  <p className="text-gray-400 text-xs font-bold mb-1">AI</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-75" />
                    <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse delay-150" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={aiMessage}
                  onChange={(e) => setAiMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask AI for help..."
                  className="flex-1 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  disabled={aiLoading}
                />
                <button
                  onClick={handleSendMessage}
                  disabled={aiLoading || !aiMessage.trim()}
                  className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-700 disabled:text-gray-500 text-gray-900 font-bold rounded-lg text-sm transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}