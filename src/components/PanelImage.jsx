// frontend/src/components/PanelImage.jsx
import React, { useRef, useEffect, useState } from "react";

export default function PanelImage({ panel, children, onUpdate }) {
  const containerRef = useRef();
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      setNatural({ w: img.naturalWidth, h: img.naturalHeight });
      // set a default height based on ratio
      if (!panel.height) onUpdate({ height: Math.round((img.naturalHeight / img.naturalWidth) * 600) });
    };
    img.src = panel.url;
  }, [panel.url]);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: panel.height || 600 }}>
      <img
        src={panel.url}
        alt="panel"
        className="object-contain w-full h-full rounded"
        style={{ display: "block", objectFit: "cover", borderRadius: 8 }}
      />
      {/* children are bubbles — absolutely positioned relative to container */}
      <div style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%" }}>
        {children}
      </div>
    </div>
  );
}
