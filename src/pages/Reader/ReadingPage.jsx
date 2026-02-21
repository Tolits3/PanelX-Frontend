// src/pages/Reader/ReadingPage.jsx
import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../../config"; // adjust path based on file location

export default function ReadingPage() {
  const { comicId, chapterId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [episode, setEpisode]       = useState(null);
  const [panels, setPanels]         = useState([]);
  const [series, setSeries]         = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(null);
  const [showUI, setShowUI]         = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [currentPanel, setCurrentPanel]     = useState(0);
  const [nextEpisode, setNextEpisode]       = useState(null);
  const [finished, setFinished]     = useState(false);

  const containerRef  = useRef(null);
  const panelRefs     = useRef([]);
  const hideUITimer   = useRef(null);

  // ─── Load episode + real panels ───
  useEffect(() => {
    fetchEpisode();
  }, [chapterId]);

  const fetchEpisode = async () => {
    setLoading(true);
    setError(null);
    setPanels([]);

    try {
      const res  = await fetch(`${API_URL}/api/series/episode/${chapterId}`);
      const data = await res.json();

      if (!data.success) {
        setError("Episode not found.");
        setLoading(false);
        return;
      }

      setEpisode(data.episode);

      // ── Real panels only ──
      const realPanels = (data.episode.panels || [])
        .filter(p => p.image_url && p.image_url.trim() !== "")
        .sort((a, b) => (a.panel_order ?? 0) - (b.panel_order ?? 0));

      setPanels(realPanels);

      if (realPanels.length === 0) {
        setError("This episode has no panels yet. The creator hasn't added any images.");
      }

      // ── Fetch series for title + next episode ──
      const serRes  = await fetch(`${API_URL}/api/series/${comicId}`);
      const serData = await serRes.json();
      if (serData.success) {
        setSeries(serData.series);

        const eps     = (serData.series.episodes || [])
          .filter(e => e.is_published)
          .sort((a, b) => a.episode_number - b.episode_number);
        const currIdx = eps.findIndex(e => e.id === chapterId);
        if (currIdx !== -1 && currIdx < eps.length - 1) {
          setNextEpisode(eps[currIdx + 1]);
        }
      }

    } catch (err) {
      console.error("Error loading episode:", err);
      setError("Failed to load episode. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ─── Save reading progress ───
  const saveProgress = useCallback(async (panelIndex, completed = false) => {
    if (!user) return;
    try {
      await fetch(`${API_URL}/api/reading-progress/update`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id:    user.uid,
          comic_id:   comicId,
          chapter_id: chapterId,
          page_number: panelIndex + 1,
          completed,
          last_read:  new Date().toISOString(),
        }),
      });
    } catch (_) {}
  }, [user, comicId, chapterId]);

  // ─── Scroll tracking ───
  useEffect(() => {
    const container = containerRef.current;
    if (!container || panels.length === 0) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const total    = scrollHeight - clientHeight;
      const progress = total > 0 ? (scrollTop / total) * 100 : 0;
      setScrollProgress(Math.min(progress, 100));

      // Which panel is in view
      panelRefs.current.forEach((ref, i) => {
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        if (rect.top >= 0 && rect.top <= clientHeight * 0.5) {
          setCurrentPanel(i);
          saveProgress(i);
        }
      });

      // Finished?
      if (progress >= 98) {
        setFinished(true);
        saveProgress(panels.length - 1, true);
      }

      // Auto-hide UI
      setShowUI(true);
      clearTimeout(hideUITimer.current);
      hideUITimer.current = setTimeout(() => setShowUI(false), 2500);
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      container.removeEventListener("scroll", handleScroll);
      clearTimeout(hideUITimer.current);
    };
  }, [panels, saveProgress]);

  const handleTap = () => {
    setShowUI(true);
    clearTimeout(hideUITimer.current);
    hideUITimer.current = setTimeout(() => setShowUI(false), 2500);
  };

  // ─── Loading ───
  if (loading) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-gray-400 text-sm">Loading episode...</p>
      </div>
    );
  }

  // ─── Error / No panels ───
  if (error || panels.length === 0) {
    return (
      <div className="h-screen bg-black flex flex-col items-center justify-center gap-5 px-6">
        <p className="text-5xl">😕</p>
        <p className="text-white font-black text-xl text-center">
          {error || "No panels found for this episode."}
        </p>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          The creator needs to generate images in the Studio, save them to this episode, then publish.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={() => navigate(`/reader/comic/${comicId}`)}
            className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl border border-gray-700 transition-colors"
          >
            ← Back to Episodes
          </button>
          <button
            onClick={() => navigate("/reader-home")}
            className="px-5 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-colors"
          >
            Browse Comics
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="h-screen bg-black overflow-hidden relative"
      style={{ fontFamily: "'Segoe UI', sans-serif" }}
    >
      {/* ─── Top Progress Bar ─── */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-900 z-50">
        <div
          className="h-full bg-yellow-500 transition-all duration-150"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ─── Top UI ─── */}
      <div className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        showUI ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full"
      }`}>
        <div className="bg-gradient-to-b from-black to-transparent px-4 pt-3 pb-8">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(`/reader/comic/${comicId}`)}
              className="flex items-center gap-2 bg-black/60 hover:bg-black/80 backdrop-blur-sm text-white px-3 py-2 rounded-xl text-sm font-bold transition-colors"
            >
              ← Back
            </button>

            <div className="text-center">
              <p className="text-white font-black text-sm line-clamp-1 max-w-[200px]">
                {series?.title || "Comic"}
              </p>
              <p className="text-yellow-400 text-xs">
                EP {episode?.episode_number} · {episode?.title}
              </p>
            </div>

            <div className="bg-black/60 backdrop-blur-sm text-gray-300 px-3 py-2 rounded-xl text-xs font-bold">
              {currentPanel + 1} / {panels.length}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Scroll Reading Area ─── */}
      <div
        ref={containerRef}
        className="h-full overflow-y-auto"
        onClick={handleTap}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style>{`div::-webkit-scrollbar { display: none; }`}</style>

        {/* Spacer for top UI */}
        <div className="h-14" />

        {/* ─── Real Panels ─── */}
        <div className="flex flex-col items-center">
          {panels.map((panel, index) => (
            <div
              key={panel.id || index}
              ref={el => panelRefs.current[index] = el}
              className="w-full max-w-2xl relative"
            >
              <img
                src={panel.image_url}
                alt={`Panel ${index + 1}`}
                className="w-full block"
                loading={index < 3 ? "eager" : "lazy"}
                onError={(e) => {
                  // If image fails to load, show a placeholder with error message
                  e.target.style.display = "none";
                  e.target.nextSibling.style.display = "flex";
                }}
              />
              {/* Image load error fallback */}
              <div
                className="w-full bg-gray-900 border border-gray-700 flex-col items-center justify-center py-16 gap-2"
                style={{ display: "none" }}
              >
                <p className="text-4xl">🖼️</p>
                <p className="text-gray-500 text-sm">Image failed to load</p>
              </div>

              {/* Dialogues overlay */}
              {panel.dialogues && panel.dialogues.length > 0 && (
                <div className="absolute inset-0 pointer-events-none">
                  {panel.dialogues.map((dialogue, di) => (
                    <div
                      key={di}
                      className="absolute"
                      style={{
                        left:     `${dialogue.x || 10}%`,
                        top:      `${dialogue.y || 10}%`,
                        maxWidth: "60%",
                      }}
                    >
                      <div
                        className="px-3 py-2 rounded-xl font-bold shadow-lg border-2 border-black"
                        style={{
                          backgroundColor: dialogue.bgColor   || "#ffffff",
                          color:           dialogue.color     || "#000000",
                          fontSize:        `${dialogue.fontSize || 14}px`,
                        }}
                      >
                        {dialogue.text}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ─── End of Episode ─── */}
        <div className="flex flex-col items-center py-16 px-6">
          {finished && (
            <div className="text-center mb-8">
              <div className="text-5xl mb-3">🎉</div>
              <p className="text-white font-black text-xl">Episode Complete!</p>
              <p className="text-gray-500 text-sm mt-1">
                You finished {episode?.title}
              </p>
            </div>
          )}

          <div className="w-full max-w-sm space-y-3">
            {nextEpisode ? (
              <button
                onClick={() => {
                  setFinished(false);
                  setScrollProgress(0);
                  setCurrentPanel(0);
                  navigate(`/reader/comic/${comicId}/chapter/${nextEpisode.id}`);
                }}
                className="w-full py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-2xl transition-all transform hover:scale-105 text-lg"
              >
                Next Episode → EP {nextEpisode.episode_number}
              </button>
            ) : (
              <div className="w-full py-4 bg-gray-800 border border-gray-700 text-gray-400 font-bold rounded-2xl text-center text-sm">
                🔔 You're up to date! Check back later.
              </div>
            )}

            <button
              onClick={() => navigate(`/reader/comic/${comicId}`)}
              className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-2xl transition-colors border border-gray-700"
            >
              ← Back to Episodes
            </button>
          </div>
        </div>

        <div className="h-16" />
      </div>

      {/* ─── Bottom UI ─── */}
      <div className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-300 ${
        showUI ? "opacity-100 translate-y-0" : "opacity-0 translate-y-full"
      }`}>
        <div className="bg-gradient-to-t from-black to-transparent px-4 pb-4 pt-8">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            <span className="text-gray-400 text-xs">{Math.round(scrollProgress)}% read</span>

            {/* Panel dots */}
            <div className="flex gap-1 items-center">
              {panels.slice(0, 12).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-full transition-all ${
                    i === currentPanel
                      ? "w-4 h-2 bg-yellow-500"
                      : i < currentPanel
                      ? "w-2 h-2 bg-yellow-500/40"
                      : "w-2 h-2 bg-gray-700"
                  }`}
                />
              ))}
              {panels.length > 12 && (
                <span className="text-gray-600 text-xs ml-1">+{panels.length - 12}</span>
              )}
            </div>

            <button className="flex items-center gap-1 bg-gray-800/80 backdrop-blur-sm text-gray-400 hover:text-red-400 px-3 py-1.5 rounded-xl text-xs font-bold transition-colors">
              ♥ Like
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}