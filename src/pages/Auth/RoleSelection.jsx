// src/pages/Auth/RoleSelection.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoleSelection() {
  const [selectedRole, setSelectedRole] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, createUserProfile } = useAuth();

  const handleRoleSelect = async () => {
    if (!selectedRole) {
      alert("Please select a role!");
      return;
    }

    setLoading(true);

    try {
      // Create user profile in backend
      const profile = await createUserProfile(
        user.uid,
        user.email,
        selectedRole
      );

      if (profile) {
        // Navigate based on role
        if (selectedRole === "creator") {
          navigate("/creator-welcome");
        } else {
          navigate("/reader-dashboard");
        }
      } else {
        alert("Failed to create profile. Please try again.");
      }
    } catch (error) {
      console.error("Error selecting role:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Welcome to PanelX! 🎨
          </h1>
          <p className="text-gray-400">Choose your role to continue</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Creator Role */}
          <div
            onClick={() => setSelectedRole("creator")}
            className={`bg-gray-800 rounded-xl p-8 border-4 cursor-pointer transition-all transform hover:scale-105 ${
              selectedRole === "creator"
                ? "border-yellow-500 shadow-xl shadow-yellow-500/50"
                : "border-gray-700 hover:border-yellow-500/50"
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">🎨</div>
              <h2 className="text-2xl font-bold text-white mb-2">Creator</h2>
              <p className="text-gray-400 mb-4">
                Create amazing comics with AI assistance
              </p>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">AI-powered image generation</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Panel editor & dialogue tools</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Publish your comics</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Creator dashboard</span>
                </div>
              </div>
            </div>
          </div>

          {/* Reader Role */}
          <div
            onClick={() => setSelectedRole("reader")}
            className={`bg-gray-800 rounded-xl p-8 border-4 cursor-pointer transition-all transform hover:scale-105 ${
              selectedRole === "reader"
                ? "border-yellow-500 shadow-xl shadow-yellow-500/50"
                : "border-gray-700 hover:border-yellow-500/50"
            }`}
          >
            <div className="text-center">
              <div className="text-6xl mb-4">📚</div>
              <h2 className="text-2xl font-bold text-white mb-2">Reader</h2>
              <p className="text-gray-400 mb-4">
                Discover and read amazing comics
              </p>
              
              <div className="space-y-2 text-left">
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Browse comic library</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Track reading progress</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Bookmark favorites</span>
                </div>
                <div className="flex items-center gap-2 text-yellow-400">
                  <span>✓</span>
                  <span className="text-sm">Personalized recommendations</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-8 text-center">
          <button
            onClick={handleRoleSelect}
            disabled={!selectedRole || loading}
            className="px-8 py-4 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold text-lg rounded-lg transition-all disabled:cursor-not-allowed transform hover:scale-105"
          >
            {loading ? "Setting up..." : "Continue"}
          </button>
          
          {selectedRole && (
            <p className="mt-4 text-gray-400 text-sm">
              You selected: <span className="text-white font-bold">
                {selectedRole === "creator" ? "🎨 Creator" : "📚 Reader"}
              </span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}