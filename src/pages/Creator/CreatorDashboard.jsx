// src/pages/Creator/CreatorDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfileDropdown from "../../components/studio/ProfileDropdown";

export default function CreatorDashboard() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [tab, setTab] = useState("series");
  const [series, setSeries] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewSeries, setShowNewSeries] = useState(false);
  const [newSeriesData, setNewSeriesData] = useState({
    title: "", description: "", genre: "", tags: ""
  });
  const [creating, setCreating] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  const GENRES = ["Action", "Fantasy", "Romance", "Sci-Fi", "Horror", "Comedy", "Drama", "Adventure", "Mystery", "Slice of Life"];

  useEffect(() => {
    if (user) {
      fetchSeries();
      fetchEpisodes();
    }
  }, [user]);

  const fetchSeries = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/series/creator/${user.uid}`);
      const data = await res.json();
      if (data.success) setSeries(data.series);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/series/episode/creator/${user.uid}`);
      const data = await res.json();
      if (data.success) setEpisodes(data.episodes);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateSeries = async () => {
    if (!newSeriesData.title.trim()) return alert("Series needs a title!");
    setCreating(true);
    try {
      const res = await fetch("http://localhost:8000/api/series/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ creator_uid: user.uid, ...newSeriesData }),
      });
      const data = await res.json();
      if (data.success) {
        setSeries(prev => [data.series, ...prev]);
        setShowNewSeries(false);
        setNewSeriesData({ title: "", description: "", genre: "", tags: "" });
      }
    } catch (err) {
      alert("Failed to create series");
    } finally {
      setCreating(false);
    }
  };

  const handleTogglePublish = async (type, id) => {
    setTogglingId(id);
    try {
      const endpoint = type === "series"
        ? `http://localhost:8000/api/series/${id}/publish`
        : `http://localhost:8000/api/series/episode/${id}/publish`;

      const res = await fetch(endpoint, { method: "POST" });
      const data = await res.json();

      if (data.success) {
        if (type === "series") {
          setSeries(prev => prev.map(s =>
            s.id === id ? { ...s, is_published: data.is_published } : s
          ));
        } else {
          setEpisodes(prev => prev.map(e =>
            e.id === id ? { ...e, is_published: data.is_published } : e
          ));
        }
      }
    } catch (err) {
      alert("Failed to toggle publish");
    } finally {
      setTogglingId(null);
    }
  };

  const handleNewEpisode = async (seriesId) => {
    const title = prompt("Episode title:");
    if (!title) return;

    try {
      const res = await fetch("http://localhost:8000/api/series/episode/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          series_id: seriesId,
          creator_uid: user.uid,
          title,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchEpisodes();
        // Navigate to studio with episode context
        navigate(`/creator-studio?episode=${data.episode.id}&series=${seriesId}`);
      }
    } catch (err) {
      alert("Failed to create episode");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#0B0B0B]">

      {/* ─── Header ─── */}
      <div className="bg-black/60 border-b border-yellow-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-widest text-yellow-400">PANELX</span>
          <span className="text-gray-600">/</span>
          <span className="text-gray-400 text-sm">Creator Dashboard</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/creator-studio")}
            className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-lg text-sm transition-all"
          >
            🎨 Open Studio
          </button>
          <button
            onClick={() => navigate("/credits")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 border border-yellow-500/40 text-yellow-400 rounded-lg text-sm transition-all"
          >
            ⚡ Credits
          </button>
          <UserProfileDropdown />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── Welcome Banner ─── */}
        <div className="mb-8 bg-gradient-to-r from-yellow-500/10 to-transparent border border-yellow-500/20 rounded-2xl p-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-black text-white mb-1">
              Welcome back, <span className="text-yellow-400">{userProfile?.username || "Creator"}</span> 👋
            </h1>
            <p className="text-gray-400">Manage your series, episodes, and publish your work</p>
          </div>
          <button
            onClick={() => setShowNewSeries(true)}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-all transform hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">+</span> New Series
          </button>
        </div>

        {/* ─── Stats Row ─── */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Total Series", value: series.length, icon: "📚" },
            { label: "Published", value: series.filter(s => s.is_published).length, icon: "🌍" },
            { label: "Drafts", value: series.filter(s => !s.is_published).length, icon: "📝" },
            { label: "Total Episodes", value: episodes.length, icon: "📖" },
          ].map((stat, i) => (
            <div key={i} className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 text-center">
              <p className="text-3xl mb-1">{stat.icon}</p>
              <p className="text-2xl font-black text-white">{stat.value}</p>
              <p className="text-gray-500 text-xs uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-2 border-b border-gray-800 mb-6">
          {["series", "episodes"].map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 font-black text-sm capitalize border-b-2 -mb-px transition-all ${
                tab === t
                  ? "border-yellow-500 text-yellow-400"
                  : "border-transparent text-gray-500 hover:text-white"
              }`}
            >
              {t === "series" ? "📚 My Series" : "📖 My Episodes"}
            </button>
          ))}
        </div>

        {/* ─── SERIES TAB ─── */}
        {tab === "series" && (
          <div>
            {loading ? (
              <div className="text-center py-20 text-gray-500">Loading...</div>
            ) : series.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">🎨</p>
                <p className="text-white font-bold text-xl mb-2">No series yet!</p>
                <p className="text-gray-500 mb-6">Create your first comic series to get started</p>
                <button
                  onClick={() => setShowNewSeries(true)}
                  className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl"
                >
                  + Create First Series
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {series.map(s => (
                  <div key={s.id} className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-2xl overflow-hidden transition-all group">
                    {/* Cover */}
                    <div className="relative h-40 bg-gray-800 flex items-center justify-center">
                      {s.cover_image_url ? (
                        <img src={s.cover_image_url} alt={s.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-6xl opacity-30">📚</div>
                      )}

                      {/* Status badge */}
                      <div className={`absolute top-3 left-3 px-2 py-1 rounded-full text-xs font-black ${
                        s.is_published
                          ? "bg-green-500 text-white"
                          : "bg-gray-600 text-gray-300"
                      }`}>
                        {s.is_published ? "🌍 LIVE" : "📝 DRAFT"}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <h3 className="text-white font-black text-lg mb-1 truncate">{s.title}</h3>
                      <p className="text-gray-500 text-sm mb-1">{s.genre || "No genre"}</p>
                      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{s.description || "No description"}</p>

                      <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                        <span>📖 {s.published_episodes || 0}/{s.total_episodes || 0} episodes</span>
                        <span>•</span>
                        <span>👁️ {s.view_count || 0} views</span>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleNewEpisode(s.id)}
                          className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          + Episode
                        </button>

                        {/* PUBLISH TOGGLE */}
                        <button
                          onClick={() => handleTogglePublish("series", s.id)}
                          disabled={togglingId === s.id}
                          className={`flex-1 py-2 text-xs font-black rounded-lg transition-all ${
                            s.is_published
                              ? "bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40"
                              : "bg-green-600 hover:bg-green-500 text-white"
                          } disabled:opacity-50`}
                        >
                          {togglingId === s.id
                            ? "..."
                            : s.is_published
                            ? "Unpublish"
                            : "🚀 Publish"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── EPISODES TAB ─── */}
        {tab === "episodes" && (
          <div>
            {episodes.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-white font-bold text-xl mb-2">No episodes yet!</p>
                <p className="text-gray-500">Create a series first, then add episodes</p>
              </div>
            ) : (
              <div className="space-y-3">
                {episodes.map(ep => (
                  <div key={ep.id} className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/30 rounded-xl p-4 flex items-center gap-4 transition-all">
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                      {ep.thumbnail_url ? (
                        <img src={ep.thumbnail_url} alt={ep.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-40">📖</div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 text-xs font-black">EP {ep.episode_number}</span>
                        <span className="text-gray-600">•</span>
                        <span className="text-gray-400 text-xs truncate">{ep.series_title}</span>
                      </div>
                      <h3 className="text-white font-bold truncate">{ep.title}</h3>
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(ep.created_at).toLocaleDateString()}
                        {ep.is_published && ep.published_at && (
                          <span className="ml-2 text-green-500">
                            • Published {new Date(ep.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </p>
                    </div>

                    {/* Status */}
                    <div className={`px-3 py-1 rounded-full text-xs font-black flex-shrink-0 ${
                      ep.is_published
                        ? "bg-green-500/20 text-green-400 border border-green-500/40"
                        : "bg-gray-700 text-gray-400"
                    }`}>
                      {ep.is_published ? "🌍 LIVE" : "📝 DRAFT"}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => navigate(`/creator-studio?episode=${ep.id}&series=${ep.series_id}`)}
                        className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold rounded-lg transition-colors"
                      >
                        ✏️ Edit
                      </button>

                      {/* EPISODE PUBLISH TOGGLE */}
                      <button
                        onClick={() => handleTogglePublish("episode", ep.id)}
                        disabled={togglingId === ep.id}
                        className={`px-3 py-2 text-xs font-black rounded-lg transition-all ${
                          ep.is_published
                            ? "bg-red-600/20 hover:bg-red-600/40 text-red-400 border border-red-500/40"
                            : "bg-green-600 hover:bg-green-500 text-white"
                        } disabled:opacity-50`}
                      >
                        {togglingId === ep.id
                          ? "..."
                          : ep.is_published
                          ? "Unpublish"
                          : "🚀 Publish"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ─── NEW SERIES MODAL ─── */}
      {showNewSeries && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border-2 border-yellow-500/50 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-2xl font-black text-white mb-6">
              📚 Create New Series
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-gray-400 text-sm mb-1 block">Title *</label>
                <input
                  type="text"
                  value={newSeriesData.title}
                  onChange={e => setNewSeriesData(p => ({ ...p, title: e.target.value }))}
                  placeholder="My Awesome Comic"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 focus:border-yellow-500 rounded-xl text-white outline-none transition-colors"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Description</label>
                <textarea
                  value={newSeriesData.description}
                  onChange={e => setNewSeriesData(p => ({ ...p, description: e.target.value }))}
                  placeholder="What's your comic about?"
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 focus:border-yellow-500 rounded-xl text-white outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Genre</label>
                <select
                  value={newSeriesData.genre}
                  onChange={e => setNewSeriesData(p => ({ ...p, genre: e.target.value }))}
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 focus:border-yellow-500 rounded-xl text-white outline-none transition-colors"
                >
                  <option value="">Select genre...</option>
                  {GENRES.map(g => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-400 text-sm mb-1 block">Tags</label>
                <input
                  type="text"
                  value={newSeriesData.tags}
                  onChange={e => setNewSeriesData(p => ({ ...p, tags: e.target.value }))}
                  placeholder="action, magic, school (comma separated)"
                  className="w-full px-4 py-3 bg-gray-800 border-2 border-gray-700 focus:border-yellow-500 rounded-xl text-white outline-none transition-colors"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowNewSeries(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateSeries}
                disabled={creating || !newSeriesData.title.trim()}
                className="flex-1 py-3 bg-yellow-500 hover:bg-yellow-400 disabled:bg-gray-600 text-gray-900 font-black rounded-xl transition-colors"
              >
                {creating ? "Creating..." : "Create Series"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}