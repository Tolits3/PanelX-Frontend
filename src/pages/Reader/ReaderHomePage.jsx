// src/pages/Reader/ReaderHomePage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import UserProfileDropdown from "./UserProfileDropdown";
import API_URL from "../../../config"; // adjust path based on file location

export default function ReaderHomePage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();

  const [newSeries, setNewSeries] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("All");

  const GENRES = ["All", "Action", "Fantasy", "Romance", "Sci-Fi", "Horror", "Comedy", "Drama", "Adventure", "Mystery", "Slice of Life"];

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      const [newRes, trendRes] = await Promise.all([
        fetch(`${API_URL}/api/series/all`),
        fetch(`${API_URL}/api/series/trending`),
      ]);
      const newData = await newRes.json();
      const trendData = await trendRes.json();

      if (newData.success) setNewSeries(newData.series);
      if (trendData.success) setTrending(trendData.series);
    } catch (err) {
      console.error("Error fetching series:", err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = newSeries.filter(s => {
    const matchGenre = selectedGenre === "All" || s.genre?.includes(selectedGenre);
    const matchSearch = !search || s.title.toLowerCase().includes(search.toLowerCase());
    return matchGenre && matchSearch;
  });

  const SeriesCard = ({ s, size = "normal" }) => (
    <div
      onClick={() => navigate(`/reader/comic/${s.id}`)}
      className={`group relative bg-gray-900/80 border border-gray-700 hover:border-yellow-500/60 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-yellow-500/10 ${
        size === "large" ? "col-span-2" : ""
      }`}
    >
      {/* Cover */}
      <div className={`relative bg-gray-800 ${size === "large" ? "h-56" : "h-48"} overflow-hidden`}>
        {s.cover_image_url ? (
          <img
            src={s.cover_image_url}
            alt={s.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 opacity-30">
            <span className="text-5xl">📚</span>
            <span className="text-gray-500 text-xs">{s.title}</span>
          </div>
        )}

        {/* Genre tag */}
        {s.genre && (
          <div className="absolute top-3 left-3 bg-yellow-500 text-gray-900 text-xs font-black px-2 py-1 rounded-full">
            {s.genre}
          </div>
        )}

        {/* New badge */}
        {isNew(s.published_at) && (
          <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-black px-2 py-1 rounded-full animate-pulse">
            NEW
          </div>
        )}

        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
          <span className="text-white font-bold text-sm">Read Now →</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-white font-black text-base mb-1 line-clamp-1">{s.title}</h3>
        <p className="text-gray-500 text-xs mb-2 line-clamp-2">{s.description || "No description"}</p>
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>📖 {s.episode_count || 0} episodes</span>
          <span>👁️ {s.view_count || 0} views</span>
        </div>
      </div>
    </div>
  );

  const isNew = (publishedAt) => {
    if (!publishedAt) return false;
    const days = (Date.now() - new Date(publishedAt).getTime()) / (1000 * 60 * 60 * 24);
    return days <= 7;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#0B0B0B]">

      {/* ─── Header ─── */}
      <div className="bg-black/60 border-b border-yellow-500/30 px-6 py-4 flex items-center justify-between sticky top-0 z-20 backdrop-blur-md">
        <span className="text-2xl font-black tracking-widest text-yellow-400">PANELX</span>

        <div className="flex-1 max-w-sm mx-6">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search series..."
            className="w-full px-4 py-2 bg-gray-800 border border-gray-700 focus:border-yellow-500 rounded-xl text-white text-sm outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/reader-dashboard")}
            className="text-gray-400 hover:text-white text-sm transition-colors"
          >
            Dashboard
          </button>
          <UserProfileDropdown />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* ─── Genre Filter ─── */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {GENRES.map(g => (
            <button
              key={g}
              onClick={() => setSelectedGenre(g)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                selectedGenre === g
                  ? "bg-yellow-500 text-gray-900"
                  : "bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700"
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">📚</div>
            <p className="text-gray-400">Loading comics...</p>
          </div>
        ) : newSeries.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎨</p>
            <p className="text-white font-bold text-xl mb-2">No comics yet!</p>
            <p className="text-gray-500">Be the first to publish a comic series</p>
          </div>
        ) : (
          <>
            {/* ─── NEW SERIES SECTION ─── */}
            <section className="mb-12">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-8 bg-yellow-500 rounded-full" />
                  <h2 className="text-2xl font-black text-white">New Series</h2>
                  <span className="bg-yellow-500/20 text-yellow-400 text-xs font-black px-2 py-1 rounded-full border border-yellow-500/30">
                    {filtered.length}
                  </span>
                </div>
                <span className="text-gray-500 text-sm">Latest releases</span>
              </div>

              {filtered.length === 0 ? (
                <div className="text-center py-10 border border-dashed border-gray-700 rounded-2xl">
                  <p className="text-gray-500">No series match your filter</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                  {filtered.map((s, i) => (
                    <SeriesCard key={s.id} s={s} size={i === 0 ? "large" : "normal"} />
                  ))}
                </div>
              )}
            </section>

            {/* ─── TRENDING SECTION ─── */}
            {trending.length > 0 && (
              <section>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-8 bg-orange-500 rounded-full" />
                    <h2 className="text-2xl font-black text-white">Trending</h2>
                    <span className="text-2xl">🔥</span>
                  </div>
                  <span className="text-gray-500 text-sm">Most viewed this week</span>
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {trending.slice(0, 5).map((s, i) => (
                    <div
                      key={s.id}
                      onClick={() => navigate(`/reader/comic/${s.id}`)}
                      className="bg-gray-900/60 border border-gray-700 hover:border-orange-500/50 rounded-xl p-4 flex items-center gap-4 cursor-pointer transition-all hover:bg-gray-900"
                    >
                      {/* Rank */}
                      <span className={`text-3xl font-black w-8 text-center flex-shrink-0 ${
                        i === 0 ? "text-yellow-400" :
                        i === 1 ? "text-gray-400" :
                        i === 2 ? "text-orange-600" : "text-gray-600"
                      }`}>
                        {i + 1}
                      </span>

                      {/* Cover */}
                      <div className="w-14 h-14 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                        {s.cover_image_url ? (
                          <img src={s.cover_image_url} alt={s.title} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl opacity-40">📚</div>
                        )}
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-black truncate">{s.title}</h3>
                        <p className="text-gray-500 text-xs">{s.genre} • {s.episode_count || 0} episodes</p>
                      </div>

                      {/* Stats */}
                      <div className="text-right flex-shrink-0">
                        <p className="text-orange-400 font-black">👁️ {s.view_count || 0}</p>
                        <p className="text-gray-600 text-xs">views</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}