import Bubble from "./Bubble";

export default function Panel({ panel, updateBubble, panelIndex }) {
  return (
    <div className="w-full flex flex-col mb-10">
      {/* IMAGE */}
      {panel.image && (
        <img
          src={panel.image}
          alt="panel"
          className="w-full rounded-md shadow-lg"
        />
      )}

      {/* BUBBLES */}
      <div className="relative w-full h-full">
        {panel.bubbles.map((b) => (
          <Bubble
            key={b.id}
            bubble={b}
            onUpdate={(u) => updateBubble(panelIndex, b.id, u)}
          />
        ))}
      </div>

      {/* GAP BELOW PANEL */}
      <div className="w-full h-10 bg-white opacity-70"></div>
    </div>
  );
}
