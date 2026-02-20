// src/components/studio/Canvas.jsx
import { useState, useRef, useCallback, useEffect } from "react";

const MIN_SIZE = 80;

function PanelItem({ panel, isSelected, onSelect, onUpdate, onDelete, onAddDialogue }) {
  const panelRef = useRef(null);

  // ─── Drag state ───
  const dragging = useRef(false);
  const dragStart = useRef({ mouseX: 0, mouseY: 0, panelX: 0, panelY: 0 });

  // ─── Resize state ───
  const resizing = useRef(false);
  const resizeHandle = useRef(null);
  const resizeStart = useRef({ mouseX: 0, mouseY: 0, w: 0, h: 0, x: 0, y: 0 });

  // ─── Dialogue editing ───
  const [editingDialogueId, setEditingDialogueId] = useState(null);

  // ── DRAG ──
  const onMouseDownPanel = (e) => {
    // Don't drag if clicking a resize handle, dialogue, or button
    if (
      e.target.closest(".resize-handle") ||
      e.target.closest(".dialogue-box") ||
      e.target.closest("button")
    ) return;

    e.preventDefault();
    e.stopPropagation();
    onSelect(panel.id);

    dragging.current = true;
    dragStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      panelX: panel.x,
      panelY: panel.y,
    };

    const onMove = (e) => {
      if (!dragging.current) return;
      const dx = e.clientX - dragStart.current.mouseX;
      const dy = e.clientY - dragStart.current.mouseY;
      onUpdate(panel.id, {
        x: Math.max(0, dragStart.current.panelX + dx),
        y: Math.max(0, dragStart.current.panelY + dy),
      });
    };

    const onUp = () => {
      dragging.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── RESIZE ──
  const onMouseDownResize = (e, handle) => {
    e.preventDefault();
    e.stopPropagation();
    resizing.current = true;
    resizeHandle.current = handle;
    resizeStart.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      w: panel.width,
      h: panel.height,
      x: panel.x,
      y: panel.y,
    };

    const onMove = (e) => {
      if (!resizing.current) return;
      const dx = e.clientX - resizeStart.current.mouseX;
      const dy = e.clientY - resizeStart.current.mouseY;
      const s = resizeStart.current;

      let newW = s.w, newH = s.h, newX = s.x, newY = s.y;

      if (handle.includes("e")) newW = Math.max(MIN_SIZE, s.w + dx);
      if (handle.includes("s")) newH = Math.max(MIN_SIZE, s.h + dy);
      if (handle.includes("w")) {
        newW = Math.max(MIN_SIZE, s.w - dx);
        newX = s.x + (s.w - newW);
      }
      if (handle.includes("n")) {
        newH = Math.max(MIN_SIZE, s.h - dy);
        newY = s.y + (s.h - newH);
      }

      onUpdate(panel.id, { width: newW, height: newH, x: newX, y: newY });
    };

    const onUp = () => {
      resizing.current = false;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  // ── DIALOGUE DRAG ──
  const onDialogueDragStart = (e, dialogueId) => {
    e.stopPropagation();
    const startX = e.clientX;
    const startY = e.clientY;
    const dialogue = panel.dialogues.find(d => d.id === dialogueId);
    const startDX = dialogue.x;
    const startDY = dialogue.y;

    const onMove = (e) => {
      const dx = e.clientX - startX;
      const dy = e.clientY - startY;
      onUpdate(panel.id, {
        dialogues: panel.dialogues.map(d =>
          d.id === dialogueId
            ? { ...d, x: Math.max(0, Math.min(90, startDX + (dx / panel.width) * 100)), y: Math.max(0, Math.min(90, startDY + (dy / panel.height) * 100)) }
            : d
        )
      });
    };

    const onUp = () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  };

  const handles = ["n","s","e","w","ne","nw","se","sw"];
  const handleStyles = {
    n:  { top: -5, left: "50%", transform: "translateX(-50%)", cursor: "n-resize" },
    s:  { bottom: -5, left: "50%", transform: "translateX(-50%)", cursor: "s-resize" },
    e:  { right: -5, top: "50%", transform: "translateY(-50%)", cursor: "e-resize" },
    w:  { left: -5, top: "50%", transform: "translateY(-50%)", cursor: "w-resize" },
    ne: { top: -5, right: -5, cursor: "ne-resize" },
    nw: { top: -5, left: -5, cursor: "nw-resize" },
    se: { bottom: -5, right: -5, cursor: "se-resize" },
    sw: { bottom: -5, left: -5, cursor: "sw-resize" },
  };

  return (
    <div
      ref={panelRef}
      onMouseDown={onMouseDownPanel}
      onClick={() => onSelect(panel.id)}
      style={{
        position: "absolute",
        left: panel.x,
        top: panel.y,
        width: panel.width,
        height: panel.height,
        cursor: "grab",
        userSelect: "none",
        outline: isSelected ? "2px solid #EAB308" : "2px solid transparent",
        boxShadow: isSelected ? "0 0 0 1px #EAB308, 0 4px 24px rgba(0,0,0,0.5)" : "0 4px 12px rgba(0,0,0,0.4)",
        borderRadius: 4,
        overflow: "visible",
        zIndex: isSelected ? 10 : 1,
      }}
    >
      {/* Panel number badge */}
      <div style={{
        position: "absolute", top: -22, left: 0,
        background: "#EAB308", color: "#111", fontSize: 11,
        fontWeight: 900, padding: "1px 6px", borderRadius: 4,
        zIndex: 20, pointerEvents: "none"
      }}>
        #{panel.order + 1}
      </div>

      {/* Image */}
      <img
        src={panel.image_url}
        alt={`Panel ${panel.order + 1}`}
        style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", borderRadius: 4, pointerEvents: "none" }}
        draggable={false}
      />

      {/* Dialogues */}
      {panel.dialogues?.map(dialogue => (
        <div
          key={dialogue.id}
          className="dialogue-box"
          style={{
            position: "absolute",
            left: `${dialogue.x}%`,
            top: `${dialogue.y}%`,
            zIndex: 15,
            cursor: "move",
          }}
          onMouseDown={(e) => {
            e.stopPropagation();
            if (!editingDialogueId) onDialogueDragStart(e, dialogue.id);
          }}
        >
          {editingDialogueId === dialogue.id ? (
            <textarea
              autoFocus
              defaultValue={dialogue.text}
              style={{
                background: "#fff", color: "#000",
                border: "2px solid #EAB308",
                borderRadius: 8, padding: "4px 8px",
                fontSize: dialogue.fontSize || 14,
                fontWeight: 600,
                minWidth: 100, maxWidth: 200,
                resize: "both",
                outline: "none",
              }}
              onBlur={(e) => {
                onUpdate(panel.id, {
                  dialogues: panel.dialogues.map(d =>
                    d.id === dialogue.id ? { ...d, text: e.target.value } : d
                  )
                });
                setEditingDialogueId(null);
              }}
              onKeyDown={(e) => {
                if (e.key === "Escape") setEditingDialogueId(null);
              }}
            />
          ) : (
            <div
              onDoubleClick={() => setEditingDialogueId(dialogue.id)}
              style={{
                background: "#fff",
                border: "2px solid #000",
                borderRadius: 8,
                padding: "4px 8px",
                fontSize: dialogue.fontSize || 14,
                fontWeight: 600,
                color: "#000",
                maxWidth: 200,
                wordBreak: "break-word",
                boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                whiteSpace: "pre-wrap",
              }}
              title="Double-click to edit • Drag to move"
            >
              {dialogue.text}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdate(panel.id, {
                    dialogues: panel.dialogues.filter(d => d.id !== dialogue.id)
                  });
                }}
                style={{
                  position: "absolute", top: -8, right: -8,
                  background: "#ef4444", color: "#fff",
                  border: "none", borderRadius: "50%",
                  width: 16, height: 16, fontSize: 10,
                  cursor: "pointer", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  lineHeight: 1,
                }}
              >✕</button>
            </div>
          )}
        </div>
      ))}

      {/* Selected panel controls */}
      {isSelected && (
        <div style={{
          position: "absolute", top: -36, right: 0,
          display: "flex", gap: 4, zIndex: 20,
        }}>
          <button
            onClick={(e) => { e.stopPropagation(); onAddDialogue(panel.id); }}
            style={{
              background: "#3b82f6", color: "#fff",
              border: "none", borderRadius: 6,
              padding: "3px 8px", fontSize: 11,
              fontWeight: 700, cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            + Dialogue
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(panel.id); }}
            style={{
              background: "#ef4444", color: "#fff",
              border: "none", borderRadius: 6,
              padding: "3px 8px", fontSize: 11,
              fontWeight: 700, cursor: "pointer",
            }}
          >
            🗑
          </button>
        </div>
      )}

      {/* Resize handles (only when selected) */}
      {isSelected && handles.map(handle => (
        <div
          key={handle}
          className="resize-handle"
          onMouseDown={(e) => onMouseDownResize(e, handle)}
          style={{
            position: "absolute",
            width: 10, height: 10,
            background: "#EAB308",
            border: "2px solid #000",
            borderRadius: 2,
            zIndex: 25,
            ...handleStyles[handle],
          }}
        />
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────
// CANVAS
// ─────────────────────────────────────────────────────
export default function Canvas({ onPanelsChange }) {
  const canvasRef = useRef(null);
  const [panels, setPanels] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const nextOrder = useRef(0);

  // Expose panels to parent
  useEffect(() => {
    if (onPanelsChange) onPanelsChange(panels);
  }, [panels]);

  // Deselect when clicking canvas background
  const onCanvasClick = (e) => {
    if (e.target === canvasRef.current) setSelectedId(null);
  };

  // ── Add panel from dropped image ──
  const onDrop = useCallback((e) => {
    e.preventDefault();
    const imageUrl = e.dataTransfer.getData("image_url") || e.dataTransfer.getData("text/plain");
    if (!imageUrl) return;

    const canvasRect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - canvasRect.left - 150;
    const y = e.clientY - canvasRect.top - 200;

    const newPanel = {
      id: `panel_${Date.now()}`,
      image_url: imageUrl,
      x: Math.max(0, x),
      y: Math.max(0, y),
      width: 300,
      height: 400,
      order: nextOrder.current++,
      dialogues: [],
    };

    setPanels(prev => [...prev, newPanel]);
    setSelectedId(newPanel.id);
  }, []);

  const onDragOver = (e) => e.preventDefault();

  // ── Update panel properties ──
  const updatePanel = useCallback((id, changes) => {
    setPanels(prev => prev.map(p => p.id === id ? { ...p, ...changes } : p));
  }, []);

  // ── Delete panel ──
  const deletePanel = useCallback((id) => {
    setPanels(prev => prev.filter(p => p.id !== id));
    setSelectedId(null);
  }, []);

  // ── Add dialogue to panel ──
  const addDialogue = useCallback((panelId) => {
    const text = prompt("Enter dialogue text:");
    if (!text?.trim()) return;

    const newDialogue = {
      id: `dlg_${Date.now()}`,
      text: text.trim(),
      x: 10,
      y: 10,
      fontSize: 14,
    };

    setPanels(prev => prev.map(p =>
      p.id === panelId
        ? { ...p, dialogues: [...(p.dialogues || []), newDialogue] }
        : p
    ));
  }, []);

  const selectedPanel = panels.find(p => p.id === selectedId);

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-950">
      {/* Toolbar */}
      <div className="bg-gray-800 border-b border-gray-700 px-4 py-2 flex items-center gap-3 text-sm text-gray-400 flex-shrink-0">
        <span className="font-bold text-yellow-400">Controls:</span>
        <span>🖱️ Drag image from chat to canvas</span>
        <span>•</span>
        <span>Click to select</span>
        <span>•</span>
        <span>Drag corners to resize</span>
        <span>•</span>
        <span>Double-click dialogue to edit</span>
        {selectedPanel && (
          <span className="ml-auto text-yellow-400 font-bold">
            Panel #{selectedPanel.order + 1} selected •{" "}
            {Math.round(selectedPanel.width)}×{Math.round(selectedPanel.height)}px
          </span>
        )}
      </div>

      {/* Canvas Drop Zone */}
      <div
        ref={canvasRef}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onClick={onCanvasClick}
        style={{
          flex: 1,
          position: "relative",
          overflow: "auto",
          background: "repeating-linear-gradient(0deg, transparent, transparent 39px, #1f2937 39px, #1f2937 40px), repeating-linear-gradient(90deg, transparent, transparent 39px, #1f2937 39px, #1f2937 40px)",
          backgroundColor: "#111827",
          minHeight: 600,
        }}
      >
        {panels.length === 0 && (
          <div style={{
            position: "absolute", inset: 0,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            pointerEvents: "none",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12, opacity: 0.3 }}>🖼️</div>
            <p style={{ color: "#4b5563", fontSize: 16, fontWeight: 600 }}>
              Generate an image in the chat then drag it here
            </p>
            <p style={{ color: "#374151", fontSize: 13, marginTop: 6 }}>
              You can drag, resize, and add dialogues to each panel
            </p>
          </div>
        )}

        {panels
          .sort((a, b) => a.order - b.order)
          .map(panel => (
            <PanelItem
              key={panel.id}
              panel={panel}
              isSelected={selectedId === panel.id}
              onSelect={setSelectedId}
              onUpdate={updatePanel}
              onDelete={deletePanel}
              onAddDialogue={addDialogue}
            />
          ))}
      </div>
    </div>
  );
}