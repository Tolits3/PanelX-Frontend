// src/pages/Creator/CreatorStudio.jsx
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Canvas from "../../components/studio/Canvas";
import ChatboxRightPanel from "../../components/studio/ChatboxRightPanel";
import PanelOrderManager from "../../components/studio/PanelOrderManager";
import UserProfileDropdown from "../../components/studio/ProfileDropdown";

export default function CreatorStudio() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // URL params — set when coming from dashboard
  const episodeId = searchParams.get("episode");
  const seriesId  = searchParams.get("series");

  // UI state
  const [isChatOpen,      setIsChatOpen]      = useState(false);
  const [showPanelOrder,  setShowPanelOrder]  = useState(false);
  const [panels,          setPanels]          = useState([]);

  // Publish state
  const [publishing,      setPublishing]      = useState(false);
  const [published,       setPublished]       = useState(false);
  const [episodeStatus,   setEpisodeStatus]   = useState(null); // null | 'draft' | 'live'
  const [showPublishMenu, setShowPublishMenu] = useState(false);

  // Fetch current episode status on load
  useEffect(() => {
    if (episodeId) fetchEpisodeStatus();
  }, [episodeId]);

  const fetchEpisodeStatus = async () => {
    try {
      const res  = await fetch(`http://localhost:8000/api/series/episode/${episodeId}`);
      const data = await res.json();
      if (data.success) {
        setEpisodeStatus(data.episode.is_published ? "live" : "draft");
        setPanels(data.episode.panels || []);
      }
    } catch (err) {
      console.error("Failed to fetch episode status", err);
    }
  };

  // ─── Publish / Unpublish episode ───
  const handlePublishToggle = async () => {
    if (!episodeId) {
      alert("No episode selected. Go to Dashboard → create a series → add an episode → open Studio from there.");
      return;
    }

    setPublishing(true);
    setShowPublishMenu(false);

    try {
      const res  = await fetch(
        `http://localhost:8000/api/series/episode/${episodeId}/publish`,
        { method: "POST" }
      );
      const data = await res.json();

      if (data.success) {
        const nowLive = data.is_published;
        setEpisodeStatus(nowLive ? "live" : "draft");
        setPublished(nowLive);

        if (nowLive) {
          // Brief success flash then offer to go to dashboard
          setTimeout(() => setPublished(false), 3000);
        }
      }
    } catch (err) {
      alert("Failed to toggle publish. Is the backend running?");
    } finally {
      setPublishing(false);
    }
  };

  // ─── Publish series too ───
  const handlePublishSeries = async () => {
    if (!seriesId) return;
    setShowPublishMenu(false);
    try {
      await fetch(`http://localhost:8000/api/series/${seriesId}/publish`, { method: "POST" });
      alert("Series published! It will now appear on the Reader Home.");
    } catch (err) {
      alert("Failed to publish series.");
    }
  };

  // ─── Save panels ───
  const handleSavePanels = async (updatedPanels) => {
    setPanels(updatedPanels);
    if (!episodeId) return;
    try {
      await fetch(`http://localhost:8000/api/series/episode/${episodeId}/panels/save`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          episode_id: episodeId,
          creator_uid: user?.uid,
          panels: updatedPanels,
        }),
      });
    } catch (err) {
      console.error("Panel save failed", err);
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gray-900 flex relative">

      {/* ─── Left Sidebar Tools ─── */}
      <div className="w-16 bg-gray-800 border-r-2 border-yellow-500 flex flex-col items-center py-4 gap-3">
        {[
          { icon: "💬", label: "Speech", color: "bg-yellow-500 text-gray-900" },
          { icon: "💭", label: "Thought", color: "bg-blue-600 text-white" },
          { icon: "⚡", label: "Action",  color: "bg-red-600 text-white" },
          { icon: "😊", label: "Emoji",   color: "bg-purple-600 text-white" },
          { icon: "🖼️", label: "Panel",   color: "bg-green-600 text-white" },
        ].map((tool) => (
          <button
            key={tool.label}
            className={`w-12 h-12 rounded-lg flex items-center justify-center transition-colors ${tool.color} hover:opacity-80`}
            title={tool.label}
          >
            <span className="text-2xl">{tool.icon}</span>
          </button>
        ))}

        <div className="flex-1" />

        {/* Chat Toggle */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className={`w-12 h-12 rounded-lg flex flex-col items-center justify-center transition-all ${
            isChatOpen
              ? "bg-green-600 hover:bg-green-500"
              : "bg-yellow-500 hover:bg-yellow-400 animate-pulse"
          }`}
          title={isChatOpen ? "Close Chat" : "Open AI Chat"}
        >
          <span className="text-xl">💬</span>
          <span className="text-[8px] font-bold">{isChatOpen ? "Close" : "Chat"}</span>
        </button>
      </div>

      {/* ─── Main Area ─── */}
      <div className="flex-1 flex flex-col min-w-0">

        {/* ─── Top Toolbar ─── */}
        <div className="bg-gray-800 border-b-2 border-yellow-500 px-4 py-2 flex items-center justify-between gap-2 flex-shrink-0">

          {/* Left: Title */}
          <div className="flex items-center gap-3 min-w-0">
            <h1 className="text-xl font-bold text-yellow-400 whitespace-nowrap">🎨 GOAT Studio</h1>

            {/* Episode context badge */}
            {episodeId ? (
              <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-gray-700 rounded-full text-xs text-gray-300 max-w-[200px] truncate">
                📖 {episodeId.slice(0, 14)}...
              </span>
            ) : (
              <span className="hidden sm:flex items-center gap-1 px-2 py-1 bg-orange-500/20 border border-orange-500/40 rounded-full text-xs text-orange-400">
                ⚠️ No episode selected
              </span>
            )}
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors hidden sm:flex items-center gap-1">
              ↶ Undo
            </button>
            <button className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors hidden sm:flex items-center gap-1">
              ↷ Redo
            </button>

            {/* Panel Order Button */}
            <button
              onClick={() => setShowPanelOrder(true)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex items-center gap-1"
              title="Reorder panels"
            >
              🎬 <span className="hidden sm:inline">Order</span>
            </button>

            {/* Save Button */}
            <button
              onClick={() => handleSavePanels(panels)}
              className="px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded text-sm transition-colors flex items-center gap-1"
            >
              💾 <span className="hidden sm:inline">Save</span>
            </button>

            {/* ─── PUBLISH BUTTON ─── */}
            <div className="relative">
              <button
                onClick={() => setShowPublishMenu(!showPublishMenu)}
                disabled={publishing}
                className={`px-4 py-1.5 rounded text-sm font-black flex items-center gap-2 transition-all ${
                  published
                    ? "bg-green-600 hover:bg-green-500 text-white"
                    : episodeStatus === "live"
                    ? "bg-red-600/80 hover:bg-red-600 text-white border border-red-500"
                    : "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
                } disabled:opacity-60`}
              >
                {publishing ? (
                  <>
                    <span className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Publishing...
                  </>
                ) : published ? (
                  <>✅ Published!</>
                ) : episodeStatus === "live" ? (
                  <>🔴 Unpublish</>
                ) : (
                  <>🚀 Publish</>
                )}
              </button>

              {/* Publish dropdown menu */}
              {showPublishMenu && (
                <div className="absolute right-0 top-full mt-1 w-56 bg-gray-800 border border-yellow-500/40 rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-3 py-2 border-b border-gray-700">
                    <p className="text-gray-400 text-xs">Publish options</p>
                  </div>

                  <button
                    onClick={handlePublishToggle}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3"
                  >
                    <span className="text-xl mt-0.5">📖</span>
                    <div>
                      <p className="text-white font-bold text-sm">
                        {episodeStatus === "live" ? "Unpublish Episode" : "Publish Episode"}
                      </p>
                      <p className="text-gray-500 text-xs">
                        {episodeStatus === "live"
                          ? "Take this episode offline"
                          : "Make this episode readable"}
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={handlePublishSeries}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3 border-t border-gray-700"
                  >
                    <span className="text-xl mt-0.5">📚</span>
                    <div>
                      <p className="text-white font-bold text-sm">Publish Series</p>
                      <p className="text-gray-500 text-xs">
                        Show series on Reader Home
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => navigate("/creator-dashboard")}
                    className="w-full px-4 py-3 text-left hover:bg-gray-700 transition-colors flex items-start gap-3 border-t border-gray-700"
                  >
                    <span className="text-xl mt-0.5">📊</span>
                    <div>
                      <p className="text-white font-bold text-sm">Go to Dashboard</p>
                      <p className="text-gray-500 text-xs">Manage all series & episodes</p>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <UserProfileDropdown />
          </div>
        </div>

        {/* ─── Canvas ─── */}
        <Canvas />

        {/* ─── Bottom Panel Bar ─── */}
        <div className="bg-gray-800 border-t-2 border-yellow-500 p-2 flex items-center gap-2 overflow-x-auto flex-shrink-0">
          {["Panel 1", "Panel 2", "Panel 3", "Panel 4", "Panel 5"].map((p, i) => (
            <button
              key={p}
              className={`px-4 py-2 rounded whitespace-nowrap text-sm transition-colors ${
                i === 0
                  ? "bg-yellow-500 text-gray-900 font-bold"
                  : "bg-gray-700 hover:bg-gray-600 text-white"
              }`}
            >
              {p}
            </button>
          ))}
          <button className="px-4 py-2 border-2 border-dashed border-yellow-500 text-yellow-400 hover:bg-gray-700 rounded whitespace-nowrap text-sm transition-colors">
            + Add Panel
          </button>
        </div>
      </div>

      {/* ─── AI Chat Panel ─── */}
      <ChatboxRightPanel
        isOpen={isChatOpen}
        onToggle={() => setIsChatOpen(!isChatOpen)}
      />

      {/* ─── Panel Order Manager Modal ─── */}
      {showPanelOrder && (
        <PanelOrderManager
          panels={panels}
          onReorder={handleSavePanels}
          onClose={() => setShowPanelOrder(false)}
          episodeId={episodeId}
        />
      )}

      {/* ─── Click outside to close publish menu ─── */}
      {showPublishMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowPublishMenu(false)}
        />
      )}

      {/* ─── No episode warning banner ─── */}
      {!episodeId && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-30 bg-orange-500/90 backdrop-blur-sm text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-3 text-sm">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-black">No episode selected</p>
            <p className="text-orange-100 text-xs">
              Go to Dashboard → Create Series → Add Episode → Open Studio
            </p>
          </div>
          <button
            onClick={() => navigate("/creator-dashboard")}
            className="ml-2 bg-white text-orange-600 font-black px-3 py-1 rounded-lg text-xs hover:bg-orange-100 transition-colors"
          >
            Dashboard →
          </button>
        </div>
      )}
    </div>
  );
}