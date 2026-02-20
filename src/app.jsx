// src/App.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Public / Auth
import Landing from "./pages/LandingPage";
import LogIn from "./pages/Auth/LogInPage";
import Signup from "./pages/Auth/SignUpPage";
import RoleSelection from "./pages/Auth/RoleSelection";

// Reader
import ReaderHome from "./pages/Reader/ReaderHomePage";
import ComicDetail from "./pages/Reader/ComicDetail";
import ReadingPage from "./pages/Reader/ReadingPage";

// Creator
import CreatorWelcome from "./pages/Creator/CreatorWelcome";
import CreatorDashboard from "./pages/Creator/CreatorDashboard";
import CreatorStudio from "./pages/Creator/CreatorStudio";
import CharacterCreator from "./pages/Creator/CharacterCreator";

// Editor
import PanelEditor from "./components/PanelEditor";

// Legal
import TermsOfService from "./pages/Auth/TermsOfService";
import PrivacyPolicy from "./pages/Auth/PrivacyPolicy";

// Credits
import CreditsPage from "./pages/Credits/CreditsPage";

// ─────────────────────────────────────────
// Protected Route — redirects to /login if not logged in
// Shows a loading spinner while auth is initializing
// ─────────────────────────────────────────
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0B0B0B] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

// ─────────────────────────────────────────
// App — NO AuthProvider here!
// AuthProvider lives in main.jsx only
// ─────────────────────────────────────────
function App() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] text-white">
      <Routes>

        {/* ===== PUBLIC (no auth needed) ===== */}
        <Route path="/"        element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/login"   element={<LogIn />} />
        <Route path="/signup"  element={<Signup />} />
        <Route path="/terms"   element={<TermsOfService />} />
        <Route path="/privacy" element={<PrivacyPolicy />} />

        {/* ===== ROLE SELECTION ===== */}
        <Route
          path="/role-selection"
          element={
            <ProtectedRoute>
              <RoleSelection />
            </ProtectedRoute>
          }
        />

        {/* ===== CREATOR FLOW ===== */}
        <Route
          path="/creator-welcome"
          element={
            <ProtectedRoute>
              <CreatorWelcome />
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator-dashboard"
          element={
            <ProtectedRoute>
              <CreatorDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/creator-studio"
          element={
            <ProtectedRoute>
              <CreatorStudio />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-character"
          element={
            <ProtectedRoute>
              <CharacterCreator />
            </ProtectedRoute>
          }
        />

        <Route
          path="/credits"
          element={
            <ProtectedRoute>
              <CreditsPage />
            </ProtectedRoute>
          }
        />

        {/* ===== READER FLOW ===== */}

        <Route
          path="/reader-home"
          element={
            <ProtectedRoute>
              <ReaderHome />
            </ProtectedRoute>
          }
        />

        {/* Series detail page — shows all episodes */}
        <Route
          path="/reader/comic/:comicId"
          element={
            <ProtectedRoute>
              <ComicDetail />
            </ProtectedRoute>
          }
        />

        {/* Reading page — scroll view for one episode */}
        <Route
          path="/reader/comic/:comicId/chapter/:chapterId"
          element={
            <ProtectedRoute>
              <ReadingPage />
            </ProtectedRoute>
          }
        />

        {/* ===== PANEL EDITOR ===== */}
        <Route
          path="/panel-editor"
          element={
            <ProtectedRoute>
              <PanelEditor />
            </ProtectedRoute>
          }
        />

        {/* ===== FALLBACK ===== */}
        {/* Catch-all → landing instead of infinite redirect loop */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </div>
  );
}

export default App;