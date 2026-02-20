// frontend/src/components/Bubble.jsx
import React, { useRef, useEffect, useState } from "react";

export default function Bubble({ panel, bubble, onChange }) {
  const ref = useRef();
  const [pos, setPos] = useState({ x: bubble.x, y: bubble.y });
  const [dragging, setDragging] = useState(false);
  useEffect(() => setPos({ x: bubble.x, y: bubble.y }), [bubble.x, bubble.y]);

  function onMouseDown(e) {
    setDragging(true);
    ref.current.start = { sx: e.clientX, sy: e.clientY, ox: pos.x, oy: pos.y };
  }
  function onMouseMove(e) {
    if (!dragging) return;
    const { sx, sy, ox, oy } = ref.current.start;
    const dx = e.clientX - sx, dy = e.clientY - sy;
    const nx = ox + dx, ny = oy + dy;
    setPos({ x: nx, y: ny });
  }
  function onMouseUp() {
    if (!dragging) return;
    setDragging(false);
    onChange({ ...bubble, x: pos.x, y: pos.y });
  }

  useEffect(() => {
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  });

  const style = {
    position: "absolute",
    left: `${pos.x}px`,
    top: `${pos.y}px`,
    width: bubble.width || 220,
    cursor: "grab",
    userSelect: "none",
    transform: "translate(-50%, -50%)",
  };

  return (
    <div
      ref={ref}
      onMouseDown={onMouseDown}
      style={style}
      className={`p-2 rounded-lg shadow ${bubble.kind === "speech" ? "bg-white text-black" : "bg-yellow-200 text-black"}`}
      contentEditable
      suppressContentEditableWarning
      onBlur={(e) => onChange({ ...bubble, text: e.target.innerText })}
      dangerouslySetInnerHTML={{ __html: bubble.text }}
    />
  );
}
