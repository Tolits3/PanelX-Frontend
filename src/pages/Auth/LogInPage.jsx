// TEMPORARY DEBUG VERSION - Replace LogInPage.jsx with this temporarily

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function LogInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  
  const { login, fetchUserProfile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setDebugInfo("");
      setLoading(true);
      
      setDebugInfo("Step 1: Attempting Firebase login...");
      
      // Login with Firebase
      const firebaseUser = await login(email, password);
      
      setDebugInfo("Step 2: Firebase login successful! UID: " + firebaseUser.uid);
      console.log("Firebase login successful:", firebaseUser.uid);
      
      setDebugInfo("Step 3: Fetching user profile...");
      
      // Fetch user profile to determine role
      const profile = await fetchUserProfile(firebaseUser.uid);
      
      setDebugInfo("Step 4: Profile fetched: " + JSON.stringify(profile));
      
      if (profile) {
        setDebugInfo("Step 5: Navigating based on role: " + profile.role);
        
        // Navigate based on role
        if (profile.role === "creator") {
          navigate("/creator-dashboard");
        } else if (profile.role === "reader") {
          navigate("/reader-home");
        } else {
          navigate("/");
        }
      } else {
        setDebugInfo("Step 5: No profile found, going to role selection");
        navigate("/role-selection");
      }
      
    } catch (error) {
      console.error("Login error FULL:", error);
      setDebugInfo("ERROR: " + error.code + " - " + error.message);
      
      // Handle Firebase errors
      if (error.code === "auth/user-not-found") {
        setError("No account found with this email");
      } else if (error.code === "auth/wrong-password") {
        setError("Incorrect password");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address");
      } else if (error.code === "auth/user-disabled") {
        setError("This account has been disabled");
      } else if (error.code === "auth/invalid-credential") {
        setError("Invalid email or password");
      } else {
        setError(`Failed to log in: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-2">📚 PanelX</h1>
          <p className="text-gray-400">Welcome back!</p>
        </div>

        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-8 shadow-xl">
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          {debugInfo && (
            <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-lg text-blue-400 text-xs">
              DEBUG: {debugInfo}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label className="block text-gray-400 text-sm mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-yellow-500 focus:outline-none"
                placeholder="••••••••"
              />
            </div>

            <div className="text-right">
              <a href="#" className="text-yellow-400 hover:text-yellow-300 text-sm">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 disabled:from-gray-600 disabled:to-gray-700 text-gray-900 font-bold rounded-lg transition-all disabled:cursor-not-allowed"
            >
              {loading ? "Logging In..." : "Log In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-400 text-sm">
              Don't have an account?{" "}
              <Link to="/signup" className="text-yellow-400 hover:text-yellow-300 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>

        <div className="text-center mt-6">
          <Link to="/" className="text-gray-400 hover:text-white text-sm transition-colors">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}