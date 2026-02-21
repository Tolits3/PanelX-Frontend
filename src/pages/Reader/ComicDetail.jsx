// src/pages/Reader/ComicDetail.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../../config"; // adjust path based on file location

export default function ComicDetail() {
  const { comicId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSeries();
  }, [comicId]);

  const fetchSeries = async () => {
    setLoading(true);
    try {
      // Fetch series + episodes
      const res = await fetch(`${API_URL}/api/series/${comicId}`);
      const data = await res.json();

      if (data.success) {
        setSeries(data.series);
        // Only show published episodes, sorted by episode number
        const published = (data.series.episodes || [])
          .filter(e => e.is_published)
          .sort((a, b) => a.episode_number - b.episode_number);
        setEpisodes(published);
      }

      // Fetch reading progress for this user
      if (user) {
        try {
          const progRes = await fetch(
            `${API_URL}/api/reading-progress/user/${user.uid}/comic/${comicId}`
          );
          const progData = await progRes.json();
          if (progData.success) {
            // Map episode_id → progress object
            const map = {};
            (progData.progress || []).forEach(p => {
              map[p.chapter_id] = p;
            });
            setProgress(map);
          }
        } catch (_) {}
      }
    } catch (err) {
      console.error("Failed to load series:", err);
    } finally {
      setLoading(false);
    }
  };

  const getLastReadEpisode = () => {
    // Find most recently read episode
    const readEps = Object.entries(progress)
      .filter(([_, p]) => p.last_read)
      .sort((a, b) => new Date(b[1].last_read) - new Date(a[1].last_read));
    return readEps[0]?.[0] || null;
  };

  const handleContinue = () => {
    const lastEpId = getLastReadEpisode();
    if (lastEpId) {
      navigate(`/reader/comic/${comicId}/chapter/${lastEpId}`);
    } else if (episodes.length > 0) {
      navigate(`/reader/comic/${comicId}/chapter/${episodes[0].id}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#0B0B0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading series...</p>
        </div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex flex-col items-center justify-center gap-4">
        <p className="text-5xl">😕</p>
        <p className="text-white font-bold text-xl">Series not found</p>
        <button
          onClick={() => navigate("/reader-home")}
          className="px-6 py-3 bg-yellow-500 text-gray-900 font-black rounded-xl"
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  const lastReadEpId = getLastReadEpisode();
  const hasProgress = Object.keys(progress).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#0B0B0B]">

      {/* ─── Header ─── */}
      <div className="bg-black/60 border-b border-yellow-500/30 px-6 py-4 flex items-center gap-4 sticky top-0 z-20 backdrop-blur-md">
        <button
          onClick={() => navigate("/reader-home")}
          className="text-gray-400 hover:text-yellow-400 transition-colors font-bold"
        >
          ← Back
        </button>
        <span className="text-yellow-400 font-black text-xl tracking-widest">PANELX</span>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* ─── Series Hero ─── */}
        <div className="flex gap-6 mb-8">
          {/* Cover */}
          <div className="w-36 h-48 bg-gray-800 rounded-xl overflow-hidden flex-shrink-0 border border-gray-700">
            {series.cover_image_url ? (
              <img
                src={series.cover_image_url}
                alt={series.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl opacity-30">📚</div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              {series.genre && (
                <span className="bg-yellow-500 text-gray-900 text-xs font-black px-2 py-1 rounded-full">
                  {series.genre}
                </span>
              )}
              <span className="bg-green-500/20 text-green-400 border border-green-500/30 text-xs font-bold px-2 py-1 rounded-full">
                {series.status || "Ongoing"}
              </span>
            </div>

            <h1 className="text-3xl font-black text-white mb-2">{series.title}</h1>
            <p className="text-gray-400 text-sm mb-4 line-clamp-3">
              {series.description || "No description provided."}
            </p>

            <div className="flex items-center gap-4 text-sm text-gray-500 mb-5">
              <span>📖 {episodes.length} episodes</span>
              <span>👁️ {series.view_count || 0} views</span>
              <span>❤️ {series.like_count || 0} likes</span>
            </div>

            {/* CTA Button */}
            {episodes.length > 0 && (
              <button
                onClick={handleContinue}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-all transform hover:scale-105"
              >
                {hasProgress ? "▶ Continue Reading" : "▶ Start Reading"}
              </button>
            )}
          </div>
        </div>

        {/* ─── Episodes List ─── */}
        <div>
          <h2 className="text-xl font-black text-white mb-4 flex items-center gap-2">
            <span className="w-1 h-6 bg-yellow-500 rounded-full inline-block" />
            Episodes
            <span className="text-gray-500 font-normal text-sm">({episodes.length})</span>
          </h2>

          {episodes.length === 0 ? (
            <div className="text-center py-12 border border-dashed border-gray-700 rounded-2xl">
              <p className="text-5xl mb-3">📭</p>
              <p className="text-gray-400">No episodes published yet</p>
              <p className="text-gray-600 text-sm mt-1">Check back later!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {episodes.map((ep) => {
                const epProgress = progress[ep.id];
                const isRead = epProgress?.completed;
                const isLastRead = ep.id === lastReadEpId;

                return (
                  <div
                    key={ep.id}
                    onClick={() => navigate(`/reader/comic/${comicId}/chapter/${ep.id}`)}
                    className="flex items-center gap-4 bg-gray-900/60 hover:bg-gray-800/80 border border-gray-700 hover:border-yellow-500/40 rounded-xl p-4 cursor-pointer transition-all group"
                  >
                    {/* Thumbnail */}
                    <div className="w-16 h-16 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                      {ep.thumbnail_url ? (
                        <img
                          src={ep.thumbnail_url}
                          alt={ep.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-2xl opacity-30">📖</div>
                      )}
                    </div>

                    {/* Episode Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-yellow-400 font-black text-xs">
                          EP {ep.episode_number}
                        </span>
                        {isLastRead && (
                          <span className="bg-blue-500/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full font-bold">
                            Last Read
                          </span>
                        )}
                        {isRead && (
                          <span className="text-green-400 text-xs font-bold">✓ Read</span>
                        )}
                      </div>
                      <p className="text-white font-bold truncate">{ep.title}</p>
                      <p className="text-gray-500 text-xs mt-0.5">
                        {ep.published_at
                          ? new Date(ep.published_at).toLocaleDateString("en-US", {
                              month: "short", day: "numeric", year: "numeric"
                            })
                          : "Recently published"}
                      </p>
                    </div>

                    {/* Read progress bar */}
                    {epProgress && !isRead && (
                      <div className="flex-shrink-0 w-16">
                        <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-yellow-500 rounded-full"
                            style={{ width: `${Math.min((epProgress.page_number || 0) * 10, 100)}%` }}
                          />
                        </div>
                        <p className="text-gray-600 text-xs mt-1 text-center">In progress</p>
                      </div>
                    )}

                    {/* Arrow */}
                    <span className="text-gray-600 group-hover:text-yellow-400 transition-colors flex-shrink-0 text-lg">
                      →
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}