// src/pages/Creator/UnifiedStudio.jsx
import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

// Sub-components (we'll create these next)
import TopToolbar from "../../components/studio/unified/TopToolBar";
import LeftSidebar from "../../components/studio/unified/LeftSideBar";
import CenterCanvas from "../../components/studio/unified/CenterCanvas";
import RightSidebar from "../../components/studio/unified/RightSideBar";

export default function UnifiedStudio() {
  const { episodeId, seriesId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  // ═══════════════════════════════════════════
  // STATE MANAGEMENT
  // ═══════════════════════════════════════════
  
  // Project Info
  const [projectName, setProjectName] = useState("Untitled Comic");
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);

  // Panels State
  const [panels, setPanels] = useState([]);
  const [activePanelId, setActivePanelId] = useState(null);

  // History for Undo/Redo
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Tool State
  const [activeTool, setActiveTool] = useState("select"); // select, brush, text, eraser, etc.
  const [toolSettings, setToolSettings] = useState({
    brushSize: 5,
    brushColor: "#000000",
    eraserSize: 20,
    fontSize: 16,
    fontFamily: "Arial",
    textColor: "#000000"
  });

  // Canvas State
  const [zoom, setZoom] = useState(1);
  const [gridEnabled, setGridEnabled] = useState(false);
  const [snapEnabled, setSnapEnabled] = useState(false);

  // ═══════════════════════════════════════════
  // LOAD PROJECT
  // ═══════════════════════════════════════════
  
  useEffect(() => {
    if (episodeId) {
      loadProject();
    } else {
      // New project - create initial panel
      createInitialPanel();
    }

    // Auto-save every 30 seconds
    const autoSaveInterval = setInterval(() => {
      if (panels.length > 0) {
        saveProject();
      }
    }, 30000);

    return () => clearInterval(autoSaveInterval);
  }, [episodeId]);

  const loadProject = async () => {
    try {
      const res = await fetch(`${API_URL}/api/studio/${episodeId}`);
      const data = await res.json();

      if (data.success && data.project) {
        setProjectName(data.project.title || "Untitled");
        setPanels(data.project.panels_data || []);
        // Load other saved state
      }
    } catch (error) {
      console.error("Error loading project:", error);
      createInitialPanel();
    }
  };

  const createInitialPanel = () => {
    const initialPanel = {
      id: `panel_${Date.now()}`,
      order: 1,
      width: 800,
      height: 1200,
      x: 50,
      y: 50,
      layers: [],
      background: "#FFFFFF"
    };
    
    setPanels([initialPanel]);
    setActivePanelId(initialPanel.id);
    saveToHistory([initialPanel]);
  };

  // ═══════════════════════════════════════════
  // SAVE & PUBLISH
  // ═══════════════════════════════════════════
  
  const saveProject = async () => {
    if (!user) return;

    setIsSaving(true);
    try {
      const projectData = {
        title: projectName,
        panels_data: panels,
        user_uid: user.uid,
        series_id: seriesId,
        episode_id: episodeId,
        updated_at: new Date().toISOString()
      };

      const url = episodeId 
        ? `${API_URL}/api/studio/${episodeId}/save`
        : `${API_URL}/api/studio/create`;

      const res = await fetch(url, {
        method: episodeId ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(projectData)
      });

      const data = await res.json();

      if (data.success) {
        setLastSaved(new Date());
        console.log("✅ Project saved");
      }
    } catch (error) {
      console.error("Error saving project:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    // TODO: Open publish modal
    console.log("Publishing...", panels);
  };

  // ═══════════════════════════════════════════
  // HISTORY MANAGEMENT (Undo/Redo)
  // ═══════════════════════════════════════════
  
  const saveToHistory = (newPanels) => {
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newPanels)));
    
    // Limit history to 50 steps
    if (newHistory.length > 50) {
      newHistory.shift();
    }
    
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setPanels(JSON.parse(JSON.stringify(history[newIndex])));
      setHistoryIndex(newIndex);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setPanels(JSON.parse(JSON.stringify(history[newIndex])));
      setHistoryIndex(newIndex);
    }
  };

  // ═══════════════════════════════════════════
  // PANEL MANAGEMENT
  // ═══════════════════════════════════════════
  
  const addPanel = () => {
    const newPanel = {
      id: `panel_${Date.now()}`,
      order: panels.length + 1,
      width: 800,
      height: 1200,
      x: 50,
      y: 50 + (panels.length * 100),
      layers: [],
      background: "#FFFFFF"
    };
    
    const newPanels = [...panels, newPanel];
    setPanels(newPanels);
    setActivePanelId(newPanel.id);
    saveToHistory(newPanels);
  };

  const deletePanel = (panelId) => {
    if (panels.length === 1) {
      alert("Cannot delete the last panel!");
      return;
    }

    const newPanels = panels.filter(p => p.id !== panelId);
    // Reorder
    newPanels.forEach((p, idx) => p.order = idx + 1);
    
    setPanels(newPanels);
    setActivePanelId(newPanels[0]?.id);
    saveToHistory(newPanels);
  };

  const reorderPanels = (newPanels) => {
    // Update order property
    newPanels.forEach((p, idx) => p.order = idx + 1);
    setPanels(newPanels);
    saveToHistory(newPanels);
  };

  const updatePanel = (panelId, updates) => {
    const newPanels = panels.map(p => 
      p.id === panelId ? { ...p, ...updates } : p
    );
    setPanels(newPanels);
    saveToHistory(newPanels);
  };

  // ═══════════════════════════════════════════
  // KEYBOARD SHORTCUTS
  // ═══════════════════════════════════════════
  
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Ctrl/Cmd + Z = Undo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      // Ctrl/Cmd + Shift + Z = Redo
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      // Ctrl/Cmd + S = Save
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [history, historyIndex, panels]);

  // ═══════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════
  
  return (
    <div className="h-screen flex flex-col bg-gray-900 overflow-hidden">
      
      {/* Top Toolbar */}
      <TopToolbar
        projectName={projectName}
        setProjectName={setProjectName}
        isSaving={isSaving}
        lastSaved={lastSaved}
        onSave={saveProject}
        onPublish={handlePublish}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={undo}
        onRedo={redo}
        onBack={() => navigate("/creator-dashboard")}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar - Drawing Tools */}
        <LeftSidebar
          activeTool={activeTool}
          setActiveTool={setActiveTool}
          toolSettings={toolSettings}
          setToolSettings={setToolSettings}
          onAddPanel={addPanel}
        />

        {/* Center Canvas - Main Workspace */}
        <CenterCanvas
          panels={panels}
          activePanelId={activePanelId}
          setActivePanelId={setActivePanelId}
          activeTool={activeTool}
          toolSettings={toolSettings}
          zoom={zoom}
          setZoom={setZoom}
          gridEnabled={gridEnabled}
          snapEnabled={snapEnabled}
          onUpdatePanel={updatePanel}
          onReorderPanels={reorderPanels}
        />

        {/* Right Sidebar - Layers & AI */}
        <RightSidebar
          panels={panels}
          activePanelId={activePanelId}
          setActivePanelId={setActivePanelId}
          onDeletePanel={deletePanel}
          onReorderPanels={reorderPanels}
          userUid={user?.uid}
        />
      </div>
    </div>
  );
}