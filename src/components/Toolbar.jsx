export default function Toolbar({ addBubble, exportManhwa }) {
  return (
    <div className="flex gap-4 bg-white/10 backdrop-blur-lg px-6 py-3 rounded-xl shadow-lg">
      
      <button
        onClick={() => addBubble("speech")}
        className="px-4 py-2 bg-white text-black rounded-lg"
      >
        Speech Bubble
      </button>

      <button
        onClick={() => addBubble("narration")}
        className="px-4 py-2 bg-yellow-300 text-black rounded-lg"
      >
        Narration Box
      </button>

      <button
        onClick={exportManhwa}
        className="px-4 py-2 bg-green-500 text-white rounded-lg"
      >
        Export Page
      </button>
    </div>
  );
}
