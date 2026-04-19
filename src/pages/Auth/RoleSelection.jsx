// src/pages/Auth/RoleSelection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

export default function RoleSelection() {
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleContinue = async () => {
    if (!selected || !user) return; // ← was "selectedRole", now "selected"

    setLoading(true);
    try {
      const response = await fetch(`${API_URL}/api/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          username: user.email.split("@")[0],
          role: selected, // ← was "selectedRole"
          avatar_url: user.photoURL || "",
          bio: "",
        }),
      });

      const data = await response.json();
      console.log("✅ Backend response:", data);

    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Always navigate - happens even if API errors
      setLoading(false);
      if (selected === "creator") { // ← was "selectedRole"
        navigate("/creator-dashboard");
      } else {
        navigate("/reader-dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white mb-2">
            Welcome to PanelX! 🎨
          </h1>
          <p className="text-gray-400 text-lg">
            Choose your role to continue
          </p>
        </div>

        {/* Role Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Creator Card */}
          <button
            onClick={() => setSelected("creator")}
            className={`relative p-8 rounded-2xl border-4 transition-all transform hover:scale-105 text-left ${
              selected === "creator"
                ? "border-yellow-500 bg-yellow-500/10 shadow-xl shadow-yellow-500/20"
                : "border-gray-700 bg-gray-900/60 hover:border-yellow-500/50"
            }`}
          >
            <div className="text-6xl mb-4">🎨</div>
            <h2 className="text-2xl font-black text-white mb-3">Creator</h2>
            <p className="text-gray-400 mb-6">Create amazing comics with AI assistance</p>
            <ul className="space-y-2">
              {["AI-powered image generation", "Panel editor & dialogue tools", "Publish your comics", "Creator dashboard"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-yellow-400 text-sm">
                  <span>✓</span><span>{f}</span>
                </li>
              ))}
            </ul>
            {selected === "creator" && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-black">
                SELECTED
              </div>
            )}
          </button>

          {/* Reader Card */}
          <button
            onClick={() => setSelected("reader")}
            className={`relative p-8 rounded-2xl border-4 transition-all transform hover:scale-105 text-left ${
              selected === "reader"
                ? "border-yellow-500 bg-yellow-500/10 shadow-xl shadow-yellow-500/20"
                : "border-gray-700 bg-gray-900/60 hover:border-yellow-500/50"
            }`}
          >
            <div className="text-6xl mb-4">📚</div>
            <h2 className="text-2xl font-black text-white mb-3">Reader</h2>
            <p className="text-gray-400 mb-6">Discover and read amazing comics</p>
            <ul className="space-y-2">
              {["Browse comic library", "Track reading progress", "Bookmark favorites", "Personalized recommendations"].map((f) => (
                <li key={f} className="flex items-center gap-2 text-yellow-400 text-sm">
                  <span>✓</span><span>{f}</span>
                </li>
              ))}
            </ul>
            {selected === "reader" && (
              <div className="absolute top-4 right-4 bg-yellow-500 text-gray-900 px-3 py-1 rounded-full text-xs font-black">
                SELECTED
              </div>
            )}
          </button>
        </div>

        {/* Continue Button */}
        <div className="text-center">
          <button
            onClick={handleContinue}
            disabled={!selected || loading}
            className={`px-12 py-4 rounded-xl font-black text-lg transition-all transform ${
              selected && !loading
                ? "bg-yellow-500 text-gray-900 hover:bg-yellow-400 hover:scale-105 shadow-lg"
                : "bg-gray-700 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                Setting up...
              </span>
            ) : (
              `Continue as ${selected === "creator" ? "Creator" : selected === "reader" ? "Reader" : "..."}`
            )}
          </button>

          {selected && (
            <p className="text-gray-500 text-sm mt-3">
              You selected: {selected === "creator" ? "🎨 Creator" : "📚 Reader"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}