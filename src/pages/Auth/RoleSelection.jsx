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
    if (!selected) return;

    setLoading(true);
    try {
      // Save role to backend
      const response = await fetch(`${API_URL}/api/users/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          email: user.email,
          role: selected,
          created_at: new Date().toISOString(),
        }),
      });

      if (response.ok) {
        // Navigate based on role
        if (selected === "creator") {
          navigate("/creator-dashboard");
        } else {
          navigate("/reader-home");
        }
      } else {
        alert("Failed to create profile. Please try again.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to create profile. Please try again.");
    } finally {
      setLoading(false);
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
            {/* Icon */}
            <div className="text-6xl mb-4">🎨</div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white mb-3">
              Creator
            </h2>

            {/* Description */}
            <p className="text-gray-400 mb-6">
              Create amazing comics with AI assistance
            </p>

            {/* Features */}
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>AI-powered image generation</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Panel editor & dialogue tools</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Publish your comics</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Creator dashboard</span>
              </li>
            </ul>

            {/* Selected Badge */}
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
            {/* Icon */}
            <div className="text-6xl mb-4">📚</div>

            {/* Title */}
            <h2 className="text-2xl font-black text-white mb-3">
              Reader
            </h2>

            {/* Description */}
            <p className="text-gray-400 mb-6">
              Discover and read amazing comics
            </p>

            {/* Features */}
            <ul className="space-y-2">
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Browse comic library</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Track reading progress</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Bookmark favorites</span>
              </li>
              <li className="flex items-center gap-2 text-yellow-400 text-sm">
                <span>✓</span>
                <span>Personalized recommendations</span>
              </li>
            </ul>

            {/* Selected Badge */}
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