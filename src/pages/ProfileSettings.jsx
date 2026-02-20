// src/pages/ProfileSettings.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProfileSettings() {
  const { user, userProfile, updateProfile, uploadAvatar, logout } = useAuth();
  const navigate = useNavigate();
  
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (userProfile) {
      setUsername(userProfile.username || "");
      setBio(userProfile.bio || "");
      setAvatarPreview(userProfile.avatar_url || null);
    }
  }, [userProfile]);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadAvatar = async () => {
    if (!selectedFile) return;

    setUploadingAvatar(true);
    try {
      await uploadAvatar(selectedFile);
      setMessage("Avatar updated successfully!");
      setSelectedFile(null);
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to upload avatar");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      await updateProfile({
        username: username.trim(),
        bio: bio.trim(),
      });
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage("Failed to update profile");
      setTimeout(() => setMessage(""), 3000);
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const getInitials = () => {
    if (!userProfile?.username) return user?.email?.charAt(0).toUpperCase() || "U";
    return userProfile.username.charAt(0).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800">
      {/* Header */}
      <div className="bg-gray-800 border-b-2 border-green-500 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(userProfile?.role === "creator" ? "/creator-dashboard" : "/reader-dashboard")}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-green-400">⚙️ Profile Settings</h1>
          <div className="w-32"></div> {/* Spacer */}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {message && (
          <div className="mb-6 p-4 bg-green-600 text-white rounded-lg text-center">
            {message}
          </div>
        )}

        <div className="bg-gray-800 rounded-xl border-2 border-gray-700 p-8">
          {/* Avatar Section */}
          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-white mb-4">Profile Picture</h2>
            
            <div className="flex flex-col items-center gap-4">
              {/* Avatar Display */}
              <div className="relative">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="w-32 h-32 rounded-full object-cover border-4 border-green-500"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-yellow-500 flex items-center justify-center text-4xl font-bold text-gray-900 border-4 border-green-500">
                    {getInitials()}
                  </div>
                )}
                
                {/* Upload Button Overlay */}
                <label
                  htmlFor="avatar-upload"
                  className="absolute bottom-0 right-0 w-10 h-10 bg-green-600 hover:bg-green-500 rounded-full flex items-center justify-center cursor-pointer transition-colors"
                >
                  <span className="text-white text-xl">📷</span>
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />
              </div>

              {/* Upload Button (if new file selected) */}
              {selectedFile && (
                <button
                  onClick={handleUploadAvatar}
                  disabled={uploadingAvatar}
                  className="px-6 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white rounded-lg transition-colors"
                >
                  {uploadingAvatar ? "Uploading..." : "Save Avatar"}
                </button>
              )}
            </div>
          </div>

          {/* User Info */}
          <div className="space-y-6">
            {/* Email (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Email</label>
              <input
                type="email"
                value={user?.email || ""}
                disabled
                className="w-full px-4 py-3 bg-gray-700 text-gray-500 rounded-lg border-2 border-gray-600 cursor-not-allowed"
              />
            </div>

            {/* Role (read-only) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Role</label>
              <div className="flex items-center gap-2">
                <span className="text-2xl">
                  {userProfile?.role === "creator" ? "🎨" : "📚"}
                </span>
                <input
                  type="text"
                  value={userProfile?.role === "creator" ? "Creator" : "Reader"}
                  disabled
                  className="flex-1 px-4 py-3 bg-gray-700 text-gray-500 rounded-lg border-2 border-gray-600 cursor-not-allowed"
                />
              </div>
            </div>

            {/* Username (editable) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-green-500 focus:outline-none"
              />
            </div>

            {/* Bio (editable) */}
            <div>
              <label className="block text-gray-400 text-sm mb-2">Bio</label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                placeholder="Tell us about yourself..."
                rows={4}
                className="w-full px-4 py-3 bg-gray-700 text-white rounded-lg border-2 border-gray-600 focus:border-green-500 focus:outline-none resize-none"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSaveProfile}
              disabled={saving}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-500 disabled:bg-gray-600 text-white font-bold rounded-lg transition-colors"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>

          {/* Danger Zone */}
          <div className="mt-8 pt-8 border-t-2 border-gray-700">
            <h3 className="text-red-400 font-bold mb-4">Danger Zone</h3>
            <button
              onClick={handleLogout}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}