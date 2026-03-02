// src/pages/Reader/ReaderDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

export default function ReaderDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalRead: 0,
    inProgress: 0,
    bookmarks: 0,
  });
  const [continueReading, setContinueReading] = useState([]);
  const [bookmarkedSeries, setBookmarkedSeries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    if (!user) return;

    try {
      // Fetch reading progress
      const progressRes = await fetch(
        `${API_URL}/api/reading-progress/user/${user.uid}`
      );
      const progressData = await progressRes.json();

      if (progressData.success) {
        const progress = progressData.progress || [];
        
        // Calculate stats
        const completed = progress.filter((p) => p.completed).length;
        const inProgress = progress.filter((p) => !p.completed && p.last_panel_viewed > 0).length;

        setStats({
          totalRead: completed,
          inProgress: inProgress,
          bookmarks: 0, // Will update when we fetch bookmarks
        });

        // Get continue reading (sort by last_read_at)
        const recent = progress
          .filter((p) => !p.completed)
          .sort((a, b) => new Date(b.last_read_at) - new Date(a.last_read_at))
          .slice(0, 5);

        setContinueReading(recent);
      }

      // Fetch bookmarks (if endpoint exists)
      // const bookmarksRes = await fetch(`${API_URL}/api/bookmarks/${user.uid}`);
      // ...

    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400">Loading your library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676]">
      {/* Header */}
      <div className="bg-black/40 border-b border-yellow-500/30 px-6 py-4 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-black text-yellow-400 tracking-wider">
              📚 MY LIBRARY
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/reader-home")}
              className="px-4 py-2 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-bold rounded-lg transition-colors"
            >
              Browse Comics
            </button>
            <button
              onClick={() => {
                // TODO: Add logout or profile menu
                navigate("/");
              }}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-full flex items-center justify-center transition-colors"
              title="Profile"
            >
              <span className="text-xl">👤</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">✓</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Completed</p>
                <p className="text-3xl font-black text-white">{stats.totalRead}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">📖</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">In Progress</p>
                <p className="text-3xl font-black text-white">{stats.inProgress}</p>
              </div>
            </div>
          </div>

          <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-xl flex items-center justify-center">
                <span className="text-2xl">⭐</span>
              </div>
              <div>
                <p className="text-gray-400 text-sm">Bookmarks</p>
                <p className="text-3xl font-black text-white">{stats.bookmarks}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Reading */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-black text-white">Continue Reading</h2>
          </div>

          {continueReading.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {continueReading.map((item) => (
                <div
                  key={item.chapter_id}
                  onClick={() =>
                    navigate(
                      `/reader/comic/${item.comic_id}/chapter/${item.chapter_id}`
                    )
                  }
                  className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all transform hover:scale-105 group"
                >
                  {/* Thumbnail placeholder */}
                  <div className="h-48 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
                    <span className="text-6xl opacity-30">📖</span>
                  </div>

                  <div className="p-4">
                    <p className="text-yellow-400 text-xs font-bold mb-1">
                      Episode {item.page_number || 1}
                    </p>
                    <h3 className="text-white font-bold text-lg mb-2 line-clamp-1">
                      Series Title
                    </h3>

                    {/* Progress bar */}
                    <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                      <div
                        className="h-full bg-yellow-500 rounded-full transition-all"
                        style={{
                          width: `${Math.min(
                            ((item.last_panel_viewed || 0) / 10) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>

                    <p className="text-gray-500 text-xs">
                      {Math.round(
                        ((item.last_panel_viewed || 0) / 10) * 100
                      )}% complete
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-gray-900/40 border-2 border-dashed border-gray-700 rounded-2xl p-12 text-center">
              <p className="text-5xl mb-4">📚</p>
              <p className="text-white font-bold text-xl mb-2">
                No comics in progress
              </p>
              <p className="text-gray-400 mb-6">
                Start reading to see your progress here
              </p>
              <button
                onClick={() => navigate("/reader-home")}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-colors"
              >
                Browse Comics
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            onClick={() => navigate("/reader-home")}
            className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-all group"
          >
            <span className="text-4xl">🔍</span>
            <span className="text-white font-bold group-hover:text-yellow-400 transition-colors">
              Browse
            </span>
          </button>

          <button
            className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-all group opacity-50 cursor-not-allowed"
            title="Coming soon"
          >
            <span className="text-4xl">⭐</span>
            <span className="text-white font-bold">Bookmarks</span>
          </button>

          <button
            className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-all group opacity-50 cursor-not-allowed"
            title="Coming soon"
          >
            <span className="text-4xl">📊</span>
            <span className="text-white font-bold">Stats</span>
          </button>

          <button
            className="bg-gray-900/60 border border-gray-700 hover:border-yellow-500/50 rounded-xl p-6 flex flex-col items-center gap-3 transition-all group opacity-50 cursor-not-allowed"
            title="Coming soon"
          >
            <span className="text-4xl">⚙️</span>
            <span className="text-white font-bold">Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}