import { useState, useEffect } from "react";

export default function TutorialOverlay({ step, onNext }) {
  const steps = {
    create_character: {
      message: "Start by creating your first character! Click the ➕ button.",
      position: { top: "120px", left: "80px" }
    },
    open_panel: {
      message: "Click the 👤 icon to open your character library.",
      position: { top: "200px", left: "80px" }
    },
    drag_character: {
      message: "Drag your character from the panel into the canvas.",
      position: { top: "150px", left: "300px" }
    },
    change_angle: {
      message: "Click the angle buttons to rotate your character!",
      position: { top: "380px", left: "450px" }
    }
  };

  if (!steps[step]) return null;

  return (
    <div 
      className="absolute z-50 bg-[#0B0B0B]/90 text-white p-4 rounded-lg shadow-xl border border-[#00A676]"
      style={{
        top: steps[step].position.top,
        left: steps[step].position.left
      }}
    >
      <p>{steps[step].message}</p>

      <button
        onClick={onNext}
        className="mt-2 bg-[#00A676] px-3 py-1 rounded text-sm"
      >
        Got it
      </button>
    </div>
  );
}
