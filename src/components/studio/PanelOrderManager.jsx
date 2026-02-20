// src/components/studio/PanelOrderManager.jsx
import { useState, useRef } from "react";

export default function PanelOrderManager({ panels, onReorder, onClose, episodeId }) {
  const [orderedPanels, setOrderedPanels] = useState([...panels]);
  const [dragIndex, setDragIndex] = useState(null);
  const [dragOverIndex, setDragOverIndex] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const dragItem = useRef(null);

  // ─── Drag handlers ───
  const handleDragStart = (e, index) => {
    dragItem.current = index;
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverIndex(index);
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    const fromIndex = dragItem.current;
    if (fromIndex === dropIndex) return;

    const updated = [...orderedPanels];
    const [moved] = updated.splice(fromIndex, 1);
    updated.splice(dropIndex, 0, moved);

    // Re-assign panel_order
    const reordered = updated.map((p, i) => ({ ...p, panel_order: i }));
    setOrderedPanels(reordered);
    setDragIndex(null);
    setDragOverIndex(null);
    dragItem.current = null;
  };

  const handleDragEnd = () => {
    setDragIndex(null);
    setDragOverIndex(null);
  };

  // ─── Move buttons (alternative to drag) ───
  const moveUp = (index) => {
    if (index === 0) return;
    const updated = [...orderedPanels];
    [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
    setOrderedPanels(updated.map((p, i) => ({ ...p, panel_order: i })));
  };

  const moveDown = (index) => {
    if (index === orderedPanels.length - 1) return;
    const updated = [...orderedPanels];
    [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
    setOrderedPanels(updated.map((p, i) => ({ ...p, panel_order: i })));
  };

  // ─── Save order ───
  const handleSave = async () => {
    setSaving(true);
    try {
      if (episodeId) {
        await fetch(`http://localhost:8000/api/series/episode/${episodeId}/panels/save`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            episode_id: episodeId,
            creator_uid: "current_user",
            panels: orderedPanels,
          }),
        });
      }

      onReorder(orderedPanels);
      setSaved(true);
      setTimeout(() => {
        setSaved(false);
        onClose();
      }, 1200);
    } catch (err) {
      alert("Failed to save order");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        className="bg-gray-900 border-2 border-yellow-500/40 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl"
        style={{ fontFamily: "'Segoe UI', sans-serif" }}
      >
        {/* ─── Header ─── */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800">
          <div>
            <h2 className="text-xl font-black text-white">🎬 Panel Order</h2>
            <p className="text-gray-500 text-xs mt-0.5">
              Drag & drop or use arrows to reorder • Changes save to episode
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-white transition-colors text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* ─── Panel Count Info ─── */}
        <div className="px-6 py-3 bg-yellow-500/5 border-b border-yellow-500/10 flex items-center gap-4 text-sm">
          <span className="text-yellow-400 font-bold">{orderedPanels.length} panels</span>
          <span className="text-gray-600">•</span>
          <span className="text-gray-400">Drag panels to rearrange reading order</span>
          <span className="ml-auto text-gray-600 text-xs">💡 Tip: Use arrows on mobile</span>
        </div>

        {/* ─── Panel List ─── */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {orderedPanels.length === 0 ? (
            <div className="text-center py-16 text-gray-600">
              <p className="text-4xl mb-3">🖼️</p>
              <p>No panels yet. Generate panels in the studio first.</p>
            </div>
          ) : (
            orderedPanels.map((panel, index) => (
              <div
                key={panel.id || index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`flex items-center gap-3 p-3 rounded-xl border-2 transition-all cursor-grab active:cursor-grabbing select-none ${
                  dragIndex === index
                    ? "opacity-40 scale-95 border-yellow-500 bg-yellow-500/10"
                    : dragOverIndex === index
                    ? "border-yellow-400 bg-yellow-400/10 scale-[1.02] shadow-lg shadow-yellow-500/20"
                    : "border-gray-700 bg-gray-800/60 hover:border-gray-600"
                }`}
              >
                {/* Drag Handle */}
                <div className="text-gray-600 hover:text-gray-400 transition-colors flex-shrink-0 select-none">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="5" cy="4" r="1.5"/>
                    <circle cx="11" cy="4" r="1.5"/>
                    <circle cx="5" cy="8" r="1.5"/>
                    <circle cx="11" cy="8" r="1.5"/>
                    <circle cx="5" cy="12" r="1.5"/>
                    <circle cx="11" cy="12" r="1.5"/>
                  </svg>
                </div>

                {/* Order Number */}
                <div className="w-8 h-8 bg-yellow-500/20 border border-yellow-500/40 rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-yellow-400 font-black text-sm">{index + 1}</span>
                </div>

                {/* Panel Thumbnail */}
                <div className="w-16 h-16 bg-gray-700 rounded-lg overflow-hidden flex-shrink-0 border border-gray-600">
                  {panel.image_url ? (
                    <img
                      src={panel.image_url}
                      alt={`Panel ${index + 1}`}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">
                      🖼️
                    </div>
                  )}
                </div>

                {/* Panel Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-white font-bold text-sm">Panel {index + 1}</p>
                  <p className="text-gray-500 text-xs truncate">
                    {panel.dialogues?.length > 0
                      ? `${panel.dialogues.length} dialogue(s): "${panel.dialogues[0]?.text?.slice(0, 30)}..."`
                      : "No dialogue"}
                  </p>
                </div>

                {/* Arrow Buttons (mobile friendly) */}
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => moveUp(index)}
                    disabled={index === 0}
                    className="w-7 h-7 bg-gray-700 hover:bg-gray-600 disabled:opacity-20 text-white rounded-lg text-xs flex items-center justify-center transition-colors"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveDown(index)}
                    disabled={index === orderedPanels.length - 1}
                    className="w-7 h-7 bg-gray-700 hover:bg-gray-600 disabled:opacity-20 text-white rounded-lg text-xs flex items-center justify-center transition-colors"
                  >
                    ↓
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ─── Footer ─── */}
        <div className="px-6 py-4 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={() => setOrderedPanels([...panels])}
            className="px-4 py-2 text-gray-400 hover:text-white text-sm transition-colors"
          >
            ↩ Reset Order
          </button>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-xl font-bold text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || saved}
              className={`px-6 py-2 rounded-xl font-black text-sm transition-all ${
                saved
                  ? "bg-green-600 text-white"
                  : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
              } disabled:opacity-70`}
            >
              {saved ? "✅ Saved!" : saving ? "Saving..." : "Save Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}