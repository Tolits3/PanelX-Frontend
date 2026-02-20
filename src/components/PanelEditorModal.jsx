import React, { useState } from "react";

const PanelEditorModal = ({ panel, onClose }) => {
  const [speechText, setSpeechText] = useState("");
  const [bubbles, setBubbles] = useState([]);

  const addBubble = () => {
    if (!speechText.trim()) return alert("Type bubble text");
    const id = Date.now();
    setBubbles(b => [...b, { id, text: speechText, x: 20, y: 20 }]);
    setSpeechText("");
  };

  const savePanel = () => {
    // In a real app you'd persist bubble positions & text to database or panel meta
    alert("Saved speech bubbles: " + JSON.stringify(bubbles));
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white/6 backdrop-blur-lg p-6 rounded-lg w-11/12 max-w-3xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-bold">Panel Editor</h3>
          <button onClick={onClose} className="text-white">Close</button>
        </div>

        <div className="mb-4">
          <div className="mb-2">
            <input value={speechText} onChange={e=>setSpeechText(e.target.value)} placeholder="Bubble text..." className="w-full p-2 rounded" />
          </div>
          <div className="flex gap-2">
            <button onClick={addBubble} className="bg-blue-600 text-white py-1 px-3 rounded">Add Speech Bubble</button>
            <button onClick={savePanel} className="bg-green-600 text-white py-1 px-3 rounded">Save & Close</button>
          </div>
        </div>

        <div className="bg-black/20 p-3 rounded">
          <p className="text-white mb-2">Preview (not draggable in this basic demo):</p>
          <div className="relative bg-white rounded">
            <img src={panel.url} alt="preview" className="w-full rounded" />
            {bubbles.map(b => (
              <div key={b.id} style={{ position: "absolute", left: b.x, top: b.y, transform: "translate(-50%,-50%)" }} className="bg-white/90 text-black px-3 py-1 rounded-full border">
                {b.text}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PanelEditorModal;
