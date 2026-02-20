import { useState } from "react";

export default function Timeline({ chatOpen, setChatOpen }) {
  const panels = [1, 2, 3, 4, 5];
  const currentPanel = 1;
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleSendMessage = () => {
    if (!inputMessage.trim() && !uploadedImage) return;
    
    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      image: uploadedImage,
      sender: "user",
      timestamp: new Date(),
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    // Simulate AI response
    setTimeout(() => {
      const aiResponse = {
        id: Date.now() + 1,
        text: uploadedImage 
          ? "I can see your reference image! How can I help you use it in your comic?"
          : "I'm here to help! Try asking me about:\n• Character placement tips\n• Speech bubble positioning\n• Layout suggestions\n• Color schemes",
        sender: "ai",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
    }, 1000);
    
    setInputMessage("");
    setUploadedImage(null);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative">
      {/* AI Chat Assistant */}
      {chatOpen && (
        <div className="absolute bottom-full left-0 right-0 bg-gradient-to-b from-green-900 to-green-950 border-t-4 border-yellow-500 shadow-2xl">
          <div className="flex flex-col h-80">
            {/* Chat Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-green-800 border-b-2 border-yellow-500">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🤖</span>
                <div>
                  <h3 className="text-yellow-400 font-bold">AI Assistant</h3>
                  <p className="text-green-300 text-xs">Ask me anything about your comic!</p>
                </div>
              </div>
              <button
                onClick={() => setChatOpen(false)}
                className="text-yellow-400 hover:text-yellow-300 text-xl font-bold"
              >
                ✕
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-2">👋</div>
                  <p className="text-green-300 text-sm">Hi! I'm your AI assistant.</p>
                  <p className="text-green-400 text-xs mt-1">Upload a reference or ask me anything!</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        msg.sender === "user"
                          ? "bg-yellow-500 text-green-900"
                          : "bg-green-800 text-yellow-400 border border-yellow-600"
                      }`}
                    >
                      {msg.image && (
                        <img
                          src={msg.image}
                          alt="Uploaded reference"
                          className="rounded mb-2 max-h-32 w-auto"
                        />
                      )}
                      <p className="text-sm whitespace-pre-line">{msg.text}</p>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Image Preview */}
            {uploadedImage && (
              <div className="px-4 py-2 bg-green-800/50 border-t border-yellow-600">
                <div className="flex items-center gap-2">
                  <img
                    src={uploadedImage}
                    alt="Preview"
                    className="h-16 w-16 object-cover rounded border-2 border-yellow-500"
                  />
                  <span className="text-green-300 text-xs flex-1">Reference image ready</span>
                  <button
                    onClick={() => setUploadedImage(null)}
                    className="text-red-400 hover:text-red-300 text-sm font-bold"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 bg-green-900 border-t-2 border-yellow-500">
              <div className="flex gap-2">
                <label className="flex items-center justify-center w-10 h-10 bg-green-700 hover:bg-green-600 rounded-lg cursor-pointer transition-colors border-2 border-yellow-600">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <span className="text-yellow-400 text-xl">📷</span>
                </label>
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  placeholder="Ask AI for help... (upload reference images too!)"
                  className="flex-1 px-4 py-2 bg-green-800 border-2 border-yellow-600 rounded-lg text-yellow-400 placeholder-green-500 focus:outline-none focus:border-yellow-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-green-900 font-bold rounded-lg transition-colors"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline */}
      <div className="h-32 bg-gradient-to-r from-green-950 via-green-900 to-green-950 border-t-4 border-yellow-500 flex items-center px-4 gap-4">
        {/* AI Chat Toggle */}
        <button
          onClick={() => setChatOpen(!chatOpen)}
          className={`w-12 h-12 rounded-lg flex items-center justify-center transition-all ${
            chatOpen
              ? "bg-yellow-500 text-green-900 scale-110"
              : "bg-green-700 hover:bg-green-600 text-yellow-400"
          }`}
          title="AI Assistant"
        >
          <span className="text-2xl">🤖</span>
        </button>

        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-yellow-500 hover:bg-yellow-400 text-green-900 rounded-lg flex items-center justify-center transition-colors font-bold text-xl">
            ▶
          </button>
        </div>

        <div className="h-16 w-px bg-yellow-500" />

        {/* Panel Timeline */}
        <div className="flex-1 flex items-center gap-3 overflow-x-auto">
          {panels.map((panel) => (
            <div
              key={panel}
              className={`min-w-[100px] h-20 rounded-lg border-4 transition-all cursor-pointer ${
                currentPanel === panel
                  ? "border-yellow-400 bg-green-800 scale-105"
                  : "border-yellow-600 bg-green-900 hover:bg-green-800"
              }`}
            >
              <div className="w-full h-full flex items-center justify-center">
                <span className="text-yellow-400 font-bold">Panel {panel}</span>
              </div>
            </div>
          ))}

          {/* Add Panel Button */}
          <button className="min-w-[100px] h-20 border-4 border-dashed border-yellow-600 rounded-lg bg-green-900/50 hover:bg-green-800 transition-colors flex items-center justify-center gap-2 text-yellow-400">
            <span className="text-xl">+</span>
            <span className="text-sm font-semibold">Add Panel</span>
          </button>
        </div>

        {/* Timeline Info */}
        <div className="text-right">
          <div className="text-yellow-400 text-sm font-bold">
            Panel {currentPanel} / {panels.length}
          </div>
          <div className="text-green-300 text-xs">
            Click to switch
          </div>
        </div>
      </div>
    </div>
  );
}