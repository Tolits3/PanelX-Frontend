export default function Sidebar({ onAddBubble }) {
  const bubbleTypes = [
    { type: "speech", icon: "💬", label: "Speech", color: "bg-yellow-400" },
    { type: "thought", icon: "💭", label: "Thought", color: "bg-blue-400" },
    { type: "shout", icon: "📢", label: "Shout", color: "bg-red-400" },
    { type: "whisper", icon: "🤫", label: "Whisper", color: "bg-purple-400" },
    { type: "narration", icon: "📝", label: "Narration", color: "bg-green-600" },
  ];

  const addBubble = (type) => {
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 50;
    
    onAddBubble({
      id: crypto.randomUUID(),
      text: getDefaultText(type),
      type: type,
      x: centerX + Math.random() * 100,
      y: centerY + Math.random() * 100,
      width: 200,
      height: 100,
      fontSize: type === "narration" ? "14px" : "16px",
    });
  };

  const getDefaultText = (type) => {
    const texts = {
      speech: "Say something...",
      thought: "I wonder...",
      shout: "HEY!",
      whisper: "psst...",
      narration: "Meanwhile...",
    };
    return texts[type] || "Text here";
  };

  return (
    <div className="w-16 h-full bg-gradient-to-b from-green-900 to-green-950 border-r-4 border-yellow-500 flex flex-col items-center py-4 gap-3 overflow-y-auto">
      {/* Logo/Title */}
      <div className="text-yellow-400 font-bold text-[10px] text-center mb-2">
        BUBBLES
      </div>

      {/* Bubble Type Buttons */}
      {bubbleTypes.map(({ type, icon, label, color }) => (
        <button
          key={type}
          onClick={() => addBubble(type)}
          className={`w-12 h-12 ${color} hover:scale-110 transition-transform rounded-lg flex flex-col items-center justify-center group relative shadow-lg hover:shadow-yellow-500/50`}
          title={label}
        >
          <span className="text-xl">{icon}</span>
          
          {/* Tooltip */}
          <span className="absolute left-full ml-2 bg-yellow-400 text-black px-2 py-1 rounded text-[10px] font-bold whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
            {label}
          </span>
        </button>
      ))}

      {/* Divider */}
      <div className="w-10 h-px bg-yellow-500 rounded-full my-1" />

      {/* Future Tools */}
      <button
        className="w-12 h-12 bg-gray-700 hover:bg-gray-600 transition-colors rounded-lg flex items-center justify-center opacity-50"
        title="More coming soon"
        disabled
      >
        <span className="text-xl">+</span>
      </button>

      {/* Info */}
      <div className="mt-auto text-center">
        <div className="text-yellow-400 text-[10px] opacity-60">
          Click<br/>to add
        </div>
      </div>
    </div>
  );
}