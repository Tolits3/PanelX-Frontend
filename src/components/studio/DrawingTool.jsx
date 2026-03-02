// src/components/studio/DrawingTool.jsx
import { useRef, useState, useEffect } from "react";

export default function DrawingTool({ isOpen, onClose, onSave }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("brush"); // brush, eraser
  const [history, setHistory] = useState([]);
  const [historyStep, setHistoryStep] = useState(-1);

  const COLORS = [
    "#000000", "#FFFFFF", "#FF0000", "#00FF00", "#0000FF",
    "#FFFF00", "#FF00FF", "#00FFFF", "#FFA500", "#800080"
  ];

  useEffect(() => {
    if (isOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      
      // Set canvas size
      canvas.width = 800;
      canvas.height = 1000;
      
      // Fill with white background
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Save initial state
      saveToHistory();
    }
  }, [isOpen]);

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const dataUrl = canvas.toDataURL();
    const newHistory = history.slice(0, historyStep + 1);
    newHistory.push(dataUrl);
    setHistory(newHistory);
    setHistoryStep(newHistory.length - 1);
  };

  const undo = () => {
    if (historyStep > 0) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      
      setHistoryStep(historyStep - 1);
      img.src = history[historyStep - 1];
    }
  };

  const redo = () => {
    if (historyStep < history.length - 1) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      const img = new Image();
      
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      
      setHistoryStep(historyStep + 1);
      img.src = history[historyStep + 1];
    }
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveToHistory();
  };

  const getMousePos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    };
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getMousePos(e);
    
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getMousePos(e);
    
    ctx.strokeStyle = tool === "eraser" ? "#FFFFFF" : color;
    ctx.lineWidth = brushSize;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      saveToHistory();
    }
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    const dataUrl = canvas.toDataURL("image/png");
    
    // Convert to blob and call parent save function
    canvas.toBlob((blob) => {
      onSave(blob, dataUrl);
      onClose();
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl shadow-2xl border-2 border-yellow-500/30 max-w-6xl w-full max-h-[95vh] overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-black text-white">
              🎨 Drawing Studio
            </h2>
            
            {/* Tools */}
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={() => setTool("brush")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  tool === "brush"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                🖌️ Brush
              </button>
              <button
                onClick={() => setTool("eraser")}
                className={`px-4 py-2 rounded-lg font-bold transition-all ${
                  tool === "eraser"
                    ? "bg-yellow-500 text-gray-900"
                    : "bg-gray-800 text-white hover:bg-gray-700"
                }`}
              >
                🧹 Eraser
              </button>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-800 hover:bg-gray-700 flex items-center justify-center text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          
          {/* Left Toolbar */}
          <div className="w-20 bg-gray-800 border-r border-gray-700 p-4 flex flex-col gap-4 overflow-y-auto">
            
            {/* Color Palette */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-bold mb-2">Colors</p>
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-12 h-12 rounded-lg transition-all ${
                    color === c ? "ring-2 ring-yellow-500 scale-110" : ""
                  }`}
                  style={{ backgroundColor: c, border: "2px solid #374151" }}
                />
              ))}
              
              {/* Custom Color Picker */}
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-12 h-12 rounded-lg cursor-pointer border-2 border-gray-700"
              />
            </div>

            {/* Brush Size */}
            <div className="space-y-2">
              <p className="text-xs text-gray-400 font-bold mb-2">Size</p>
              {[2, 5, 10, 20, 40].map((size) => (
                <button
                  key={size}
                  onClick={() => setBrushSize(size)}
                  className={`w-12 h-12 bg-gray-700 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all ${
                    brushSize === size ? "ring-2 ring-yellow-500" : ""
                  }`}
                >
                  <div
                    className="rounded-full bg-white"
                    style={{ width: size, height: size }}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 flex items-center justify-center p-8 bg-gray-800/50 overflow-auto">
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              className="border-4 border-gray-700 rounded-lg cursor-crosshair shadow-2xl"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>
        </div>

        {/* Bottom Toolbar */}
        <div className="p-4 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={undo}
              disabled={historyStep <= 0}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600 text-white font-bold rounded-lg transition-all"
            >
              ↶ Undo
            </button>
            <button
              onClick={redo}
              disabled={historyStep >= history.length - 1}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-800/50 disabled:text-gray-600 text-white font-bold rounded-lg transition-all"
            >
              ↷ Redo
            </button>
            <button
              onClick={clearCanvas}
              className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-all"
            >
              🗑️ Clear
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-lg transition-all"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-lg transition-all"
            >
              💾 Save Drawing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}