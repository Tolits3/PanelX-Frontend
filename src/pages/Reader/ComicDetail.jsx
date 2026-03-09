// src/pages/Reader/ComicDetailPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

export default function ComicDetailPage() {
  const { seriesId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBookmarked, setIsBookmarked] = useState(false);

  useEffect(() => {
    fetchSeriesDetails();
    fetchEpisodes();
  }, [seriesId]);

  const fetchSeriesDetails = async () => {
    try {
      const res = await fetch(`${API_URL}/api/series/${seriesId}`);
      const data = await res.json();
      
      if (data.success) {
        setSeries(data.series);
      }
    } catch (error) {
      console.error("Error fetching series:", error);
    }
  };

  const fetchEpisodes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/series/${seriesId}/episodes`);
      const data = await res.json();
      
      if (data.success) {
        // Sort by episode number descending (latest first)
        const sorted = data.episodes.sort((a, b) => b.episode_number - a.episode_number);
        setEpisodes(sorted);
      }
    } catch (error) {
      console.error("Error fetching episodes:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBookmark = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      const method = isBookmarked ? "DELETE" : "POST";
      const res = await fetch(`${API_URL}/api/bookmarks/${seriesId}`, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_uid: user.uid })
      });

      if (res.ok) {
        setIsBookmarked(!isBookmarked);
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: series?.title,
        text: series?.description,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center">
        <p className="text-white text-xl">Series not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676]">
      
      {/* Header */}
      <div className="bg-black/40 border-b border-yellow-500/30 px-6 py-4 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button
            onClick={() => navigate("/reader-home")}
            className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
          >
            ←
          </button>
          <h1 className="text-xl font-black text-white">Back to Browse</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        
        {/* ═══════════════════════════════════════════
            HERO SECTION - Cover + Info
            ═══════════════════════════════════════════ */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-[300px_1fr] gap-8 p-8">
            
            {/* Cover Image */}
            <div className="relative">
              {series.cover_image_url ? (
                <img
                  src={series.cover_image_url}
                  alt={series.title}
                  className="w-full aspect-[2/3] object-cover rounded-xl shadow-2xl"
                />
              ) : (
                <div className="w-full aspect-[2/3] bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center">
                  <span className="text-6xl opacity-30">📖</span>
                </div>
              )}

              {/* Status Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-xs font-black ${
                  series.status === "completed" 
                    ? "bg-green-500 text-gray-900"
                    : "bg-yellow-500 text-gray-900"
                }`}>
                  {series.status?.toUpperCase() || "ONGOING"}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col">
              
              {/* Title */}
              <h1 className="text-4xl md:text-5xl font-black text-white mb-4 leading-tight">
                {series.title}
              </h1>

              {/* Creator */}
              <p className="text-gray-400 text-lg mb-6">
                by <span className="text-yellow-400 font-bold">{series.creator_name || "Unknown"}</span>
              </p>

              {/* Tags */}
              {series.tags && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {series.tags.split(",").map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-yellow-500/20 border border-yellow-500/30 text-yellow-400 rounded-full text-sm font-bold"
                    >
                      {tag.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Stats */}
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-2xl">⭐</span>
                  <span className="text-white font-bold text-lg">
                    {series.rating || "N/A"}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 text-2xl">👁️</span>
                  <span className="text-white font-bold text-lg">
                    {series.view_count?.toLocaleString() || 0}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-400 text-2xl">❤️</span>
                  <span className="text-white font-bold text-lg">
                    {series.like_count?.toLocaleString() || 0}
                  </span>
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-base leading-relaxed mb-8 flex-1">
                {series.description || "No description available."}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => {
                    const firstEpisode = episodes[episodes.length - 1]; // Get first episode
                    if (firstEpisode) {
                      navigate(`/read/${seriesId}/${firstEpisode.id}`);
                    }
                  }}
                  className="flex-1 min-w-[200px] px-6 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-all transform hover:scale-105 shadow-lg"
                >
                  📖 Start Reading
                </button>
                
                <button
                  onClick={handleBookmark}
                  className={`px-6 py-4 rounded-xl font-bold transition-all ${
                    isBookmarked
                      ? "bg-yellow-500 text-gray-900"
                      : "bg-gray-800 hover:bg-gray-700 text-white"
                  }`}
                >
                  {isBookmarked ? "★ Bookmarked" : "☆ Bookmark"}
                </button>

                <button
                  onClick={handleShare}
                  className="px-6 py-4 bg-gray-800 hover:bg-gray-700 text-white font-bold rounded-xl transition-all"
                >
                  🔗 Share
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            CHAPTERS SECTION
            ═══════════════════════════════════════════ */}
        <div className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-3xl overflow-hidden">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-700 flex items-center justify-between">
            <h2 className="text-2xl font-black text-white">
              📚 Chapters ({episodes.length})
            </h2>
            <div className="flex items-center gap-2">
              <span className="text-gray-400 text-sm">Sort:</span>
              <select className="bg-gray-800 text-white px-3 py-2 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-yellow-500">
                <option>Latest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>

          {/* Chapter List */}
          <div className="divide-y divide-gray-700">
            {episodes.length > 0 ? (
              episodes.map((episode) => (
                <button
                  key={episode.id}
                  onClick={() => navigate(`/read/${seriesId}/${episode.id}`)}
                  className="w-full px-6 py-5 hover:bg-gray-800/50 transition-all group flex items-center gap-4"
                >
                  {/* Thumbnail */}
                  {episode.thumbnail_url ? (
                    <img
                      src={episode.thumbnail_url}
                      alt={episode.title}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📄</span>
                    </div>
                  )}

                  {/* Info */}
                  <div className="flex-1 text-left">
                    <p className="text-yellow-400 text-xs font-bold mb-1">
                      Chapter {episode.episode_number}
                    </p>
                    <h3 className="text-white font-bold text-lg group-hover:text-yellow-400 transition-colors">
                      {episode.title}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      {new Date(episode.published_at || episode.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {/* Arrow */}
                  <div className="text-gray-600 group-hover:text-yellow-400 transition-colors">
                    →
                  </div>
                </button>
              ))
            ) : (
              <div className="p-12 text-center">
                <p className="text-5xl mb-4">📭</p>
                <p className="text-white font-bold text-xl mb-2">No chapters yet</p>
                <p className="text-gray-400">This series hasn't published any chapters</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}