import { useState, useRef, useEffect } from "react";

export default function ChatboxRightPanel({ isOpen, onToggle }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "system",
      text: "Welcome to PanelX! 👋\n\nI'm your AI comic assistant. Try:\n• 'generate: A hero in space'\n• 'generate: A dragon breathing fire'\n• Just describe what you want to see!",
      timestamp: new Date(),
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [backendStatus, setBackendStatus] = useState("checking");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/chat/health");
      if (response.ok) {
        setBackendStatus("connected");
      } else {
        setBackendStatus("error");
      }
    } catch (error) {
      setBackendStatus("disconnected");
    }
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: inputMessage,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const originalMessage = inputMessage;
    setInputMessage("");
    setIsLoading(true);

    try {
      // Check if this is an image generation request
      const isImageGen = 
        originalMessage.toLowerCase().includes("generate:") ||
        originalMessage.toLowerCase().includes("draw:") ||
        originalMessage.toLowerCase().includes("create:");

      if (isImageGen) {
        // ─── IMAGE GENERATION ───
        // Extract prompt (remove trigger words)
        const prompt = originalMessage
          .replace(/generate:/gi, "")
          .replace(/draw:/gi, "")
          .replace(/create:/gi, "")
          .trim();

        const response = await fetch("http://localhost:8000/api/chat/generate-image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            prompt: prompt,
            style: "comic book art"
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const botMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: `✅ Image generated!
          
📝 Prompt: ${prompt}

🎨 Drag to canvas`,
          imageUrl: data.image_url,
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);

      } else {
        // ─── REGULAR CHAT ───
        const response = await fetch("http://localhost:8000/api/chat/message", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            message: originalMessage,
            generate_image: false
          }),
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        const botMessage = {
          id: Date.now() + 1,
          sender: "bot",
          text: data.response || "Got your message!",
          timestamp: new Date(),
        };

        setMessages(prev => [...prev, botMessage]);
      }

    } catch (error) {
      console.error("Error:", error);
      
      const errorMessage = {
        id: Date.now() + 1,
        sender: "system",
        text: `❌ Error: ${error.message}

Make sure:
1. Backend is running (python main_simple.py)
2. Replicate API key is in .env
3. URL is correct: http://localhost:8000`,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        sender: "system",
        text: "Chat cleared! Type 'generate: your idea' to create images.",
        timestamp: new Date(),
      }
    ]);
  };

  const handleDragStart = (e, imageUrl) => {
    e.dataTransfer.setData("image_url", imageUrl);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <>
      {/* Toggle Button */}
      {!isOpen && (
        <button
          onClick={onToggle}
          className="fixed right-0 top-1/2 -translate-y-1/2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 p-3 rounded-l-lg shadow-lg z-50 transition-all animate-pulse"
          title="Open AI Chat"
        >
          <div className="flex flex-col items-center gap-1">
            <span className="text-xl">💬</span>
            <span className="text-xs font-bold">AI</span>
          </div>
        </button>
      )}

      {/* Chat Panel */}
      <div
        className={`fixed right-0 top-0 h-full bg-gradient-to-b from-green-900 to-green-950 border-l-4 border-yellow-500 flex flex-col shadow-2xl z-40 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        style={{ width: "380px" }}
      >
        {/* Header */}
        <div className="flex-none bg-green-800 p-3 border-b-2 border-yellow-500">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-bold text-yellow-400">🤖 AI Assistant</h2>
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-white text-xs rounded transition-colors"
              >
                Clear
              </button>
              <button
                onClick={onToggle}
                className="px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Backend Status */}
          <div className="flex items-center gap-2 text-xs">
            <div
              className={`w-2 h-2 rounded-full ${
                backendStatus === "connected"
                  ? "bg-green-400 animate-pulse"
                  : backendStatus === "checking"
                  ? "bg-yellow-400 animate-pulse"
                  : "bg-red-400"
              }`}
            />
            <span className="text-green-300 text-xs">
              {backendStatus === "connected"
                ? "✅ Connected to Replicate"
                : backendStatus === "checking"
                ? "Checking..."
                : "❌ Disconnected"}
            </span>
            <button
              onClick={checkBackendConnection}
              className="ml-auto text-yellow-400 hover:text-yellow-300 text-xs"
              title="Refresh connection"
            >
              🔄
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 min-h-0">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-2 text-xs ${
                  msg.sender === "user"
                    ? "bg-yellow-500 text-gray-900"
                    : msg.sender === "system"
                    ? "bg-gray-800 text-green-300 border border-yellow-600"
                    : "bg-green-800 text-yellow-400 border border-yellow-600"
                }`}
              >
                {/* Sender */}
                <div className="text-[10px] opacity-75 mb-1 font-semibold">
                  {msg.sender === "user" ? "You" : msg.sender === "system" ? "System" : "AI"}
                </div>

                {/* Text */}
                <p className="text-xs whitespace-pre-line break-words leading-relaxed">
                  {msg.text}
                </p>

                {/* Image (DRAGGABLE!) */}
                {msg.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={msg.imageUrl}
                      alt="Generated comic panel"
                      draggable="true"
                      onDragStart={(e) => handleDragStart(e, msg.imageUrl)}
                      className="max-w-full rounded border-2 border-yellow-500 cursor-grab active:cursor-grabbing hover:scale-105 transition-transform"
                      title="🎨 Drag to canvas!"
                    />
                    <p className="text-[10px] opacity-75 mt-1 text-center bg-yellow-500/20 rounded py-1">
                      ⬆️ Drag image to canvas
                    </p>
                  </div>
                )}

                {/* Timestamp */}
                <div className="text-[10px] opacity-60 mt-1">
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}

          {/* Loading */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-green-800 text-yellow-400 border border-yellow-600 rounded-lg p-2">
                <div className="flex items-center gap-2 text-xs">
                  <div className="animate-spin text-sm">⚙️</div>
                  <span>Generating...</span>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="flex-none p-2 bg-green-900 border-t-2 border-yellow-500">
          <div className="flex gap-1 mb-2">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type: generate: your idea..."
              className="flex-1 px-2 py-1 bg-gray-800 border-2 border-green-600 rounded text-yellow-400 placeholder-gray-500 resize-none focus:outline-none focus:border-yellow-500 text-xs"
              rows={2}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className="px-3 py-1 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 disabled:cursor-not-allowed text-gray-900 font-bold rounded text-xs transition-colors"
            >
              Send
            </button>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => setInputMessage("generate: A superhero flying")}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-yellow-400 text-[10px] rounded transition-colors"
            >
              🦸 Hero
            </button>
            <button
              onClick={() => setInputMessage("generate: A dragon")}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-yellow-400 text-[10px] rounded transition-colors"
            >
              🐉 Dragon
            </button>
            <button
              onClick={() => setInputMessage("generate: Space battle")}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-yellow-400 text-[10px] rounded transition-colors"
            >
              🚀 Space
            </button>
            <button
              onClick={() => setInputMessage("generate: City skyline")}
              className="px-2 py-1 bg-gray-700 hover:bg-gray-600 text-yellow-400 text-[10px] rounded transition-colors"
            >
              🏙️ City
            </button>
          </div>

          {/* Tip */}
          <div className="mt-2 p-1 bg-gray-800/50 rounded text-[10px] text-green-300">
            <p><strong className="text-yellow-400">💡 Tip:</strong> Start with "generate:" then describe your panel!</p>
          </div>
        </div>
      </div>
    </>
  );
}