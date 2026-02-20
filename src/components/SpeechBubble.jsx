import React, { useRef, useEffect, useState } from "react";
import Draggable from "react-draggable";

const SpeechBubble = ({ bubble, onChange, onDelete }) => {
  const nodeRef = useRef(null);
  const [text, setText] = useState(bubble.text || "");

  useEffect(() => setText(bubble.text || ""), [bubble.text]);

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: bubble.x || 20, y: bubble.y || 20 }}
      onStop={(e, data) => onChange({ ...bubble, x: data.x, y: data.y, text })}
    >
      <div ref={nodeRef} style={{ position: "absolute", zIndex: 60 }}>
        <div className="speech-bubble" style={{ width: bubble.width || 180 }}>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); onChange({ ...bubble, text: e.target.value }); }}
            className="bg-transparent outline-none resize-none w-full"
            rows={2}
          />
          <button
            onClick={() => onDelete(bubble.id)}
            style={{
              position: "absolute",
              top: -10,
              right: -10,
              background: "#ff4d4f",
              color: "#fff",
              borderRadius: 12,
              width: 22,
              height: 22,
              border: "none",
            }}
          >
            ✕
          </button>
        </div>
      </div>
    </Draggable>
  );
};

export default SpeechBubble;
