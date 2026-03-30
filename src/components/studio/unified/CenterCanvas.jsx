// src/components/studio/unified/CenterCanvas.jsx
import { useRef, useEffect, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import * as fabric from "fabric";

// Individual Panel Component with Fabric.js Canvas
function PanelItem({ panel, isActive, onClick, onDelete, activeTool, toolSettings, onUpdatePanel }) {
  const canvasRef = useRef(null);
  const fabricCanvasRef = useRef(null);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: panel.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: panel.width,
      height: panel.height,
      backgroundColor: panel.background,
    });

    fabricCanvasRef.current = canvas;

    return () => {
      canvas.dispose();
      fabricCanvasRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !isActive) return;

    if (activeTool === "brush" || activeTool === "pencil") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = toolSettings.brushColor;
      canvas.freeDrawingBrush.width = toolSettings.brushSize;
    } else if (activeTool === "eraser") {
      canvas.isDrawingMode = true;
      canvas.freeDrawingBrush.color = panel.background;
      canvas.freeDrawingBrush.width = toolSettings.eraserSize;
    } else {
      canvas.isDrawingMode = false;
    }
  }, [activeTool, toolSettings, isActive]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-white rounded-xl overflow-hidden mb-6 border-4 transition-all ${
        isActive
          ? "border-yellow-500 shadow-2xl shadow-yellow-500/20"
          : "border-gray-300 hover:border-yellow-500/50"
      }`}
    >
      {/* Drag Handle */}
      <div
        {...attributes}
        {...listeners}
        className="absolute top-2 left-2 bg-gray-900/80 text-white px-3 py-1 rounded-lg cursor-move z-10"
      >
        Panel {panel.order}
      </div>

      {/* Delete */}
      <button
        onClick={(e) => {
          e.stopPropagation();
            onDelete(panel.id);
          }}
          className="absolute top-2 right-2 z-10 bg-red-600 text-white px-2 py-1 rounded"
          >
          ✕
          </button>

          {/* Canvas */}
          <div onClick={() => onClick(panel.id)} className="relative">
          <canvas ref={canvasRef} />

          {/* ✅ FIXED PLACE */}
          {(!panel.layers || panel.layers.length === 0) && !isActive && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center text-gray-400">
              <p className="text-6xl mb-2">🎨</p>
              <p className="font-bold">Empty Panel</p>
              <p className="text-sm">Click to select and start drawing</p>
            </div>
            </div>
          )}
          </div>
        </div>
        );
      }

      export default function CenterCanvas({
        panels,
        activePanelId,
        setActivePanelId,
        activeTool,
        toolSettings,
        zoom,
        setZoom,
        gridEnabled,
        snapEnabled,
        onUpdatePanel,
        onReorderPanels
      }) {
        const canvasContainerRef = useRef(null);

        const sensors = useSensors(
        useSensor(PointerSensor, {
          activationConstraint: {
          distance: 8,
          },
        })
        );

        const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      const oldIndex = panels.findIndex(p => p.id === active.id);
      const newIndex = panels.findIndex(p => p.id === over.id);
      
      const newPanels = arrayMove(panels, oldIndex, newIndex);
      onReorderPanels(newPanels);
    }
  };

  const handleDeletePanel = (panelId) => {
    if (panels.length === 1) {
      alert("Cannot delete the last panel!");
      return;
    }
    
    if (window.confirm("Delete this panel?")) {
      const newPanels = panels.filter(p => p.id !== panelId);
      onReorderPanels(newPanels);
    }
  };

  return (
    <div className="flex-1 bg-gray-800 relative overflow-hidden flex flex-col">
      
      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-gray-950/90 backdrop-blur-sm rounded-xl p-2 flex items-center gap-2 z-10">
        <button
          onClick={() => setZoom(Math.max(0.25, zoom - 0.25))}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          −
        </button>
        <span className="text-white font-bold text-sm min-w-[60px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={() => setZoom(Math.min(2, zoom + 0.25))}
          className="w-8 h-8 bg-gray-800 hover:bg-gray-700 text-white rounded-lg flex items-center justify-center transition-colors"
        >
          +
        </button>
        
        <div className="w-px h-6 bg-gray-700 mx-1" />
        
        {/* Grid Toggle */}
        <button
          onClick={() => {}}
          className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
            gridEnabled
              ? "bg-yellow-500 text-gray-900"
              : "bg-gray-800 hover:bg-gray-700 text-white"
          }`}
          title="Toggle Grid"
        >
          Grid
        </button>
      </div>

      {/* Canvas Area */}
      <div
        ref={canvasContainerRef}
        className="flex-1 overflow-auto p-8"
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
        }}
      >
        <div className="max-w-4xl mx-auto">
          
          {/* Info Banner */}
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <p className="text-yellow-400 text-sm">
              💡 <strong>Active Tool:</strong> {activeTool.charAt(0).toUpperCase() + activeTool.slice(1)} | 
              <strong className="ml-2">Panels:</strong> {panels.length} | 
              <strong className="ml-2">Zoom:</strong> {Math.round(zoom * 100)}%
              {(activeTool === "brush" || activeTool === "pencil") && (
                <span className="ml-2">| <strong>Color:</strong> 
                  <span 
                    className="inline-block w-4 h-4 rounded ml-1 align-middle border border-gray-600"
                    style={{ backgroundColor: toolSettings.brushColor }}
                  />
                </span>
              )}
            </p>
          </div>

          {/* Panels - Drag & Drop */}
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={panels.map(p => p.id)}
              strategy={verticalListSortingStrategy}
            >
              {panels.map(panel => (
                <PanelItem
                  key={panel.id}
                  panel={panel}
                  isActive={panel.id === activePanelId}
                  onClick={setActivePanelId}
                  onDelete={handleDeletePanel}
                  activeTool={activeTool}
                  toolSettings={toolSettings}
                  onUpdatePanel={onUpdatePanel}
                />
              ))}
            </SortableContext>
          </DndContext>

          {/* Add Panel Prompt */}
          <div className="text-center py-8">
            <p className="text-gray-500 text-sm mb-4">
              👆 Drag panels to reorder | 🗑️ Click X to delete
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Info Bar */}
      <div className="h-10 bg-gray-950 border-t border-gray-800 flex items-center justify-between px-4 text-xs text-gray-400">
        <span>Active: Panel {panels.find(p => p.id === activePanelId)?.order || 1}</span>
        <span>Total: {panels.length} panels</span>
        <span>Tool: {activeTool}</span>
      </div>
    </div>
  );
}