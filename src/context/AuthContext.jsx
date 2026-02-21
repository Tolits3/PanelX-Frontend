// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "firebase/auth";
import { auth } from "../firebase/firebase";
import API_URL from "../../config"; // adjust path based on file location

fetch(`${API_URL}/api/series/all`)

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from backend
  const fetchUserProfile = async (uid) => {
    try {
      const response = await fetch(`${API_URL}/api/users/${uid}`);
      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  // Create user profile in backend
  const createUserProfile = async (uid, email, role) => {
    try {
      const response = await fetch("http://localhost:8000/api/users/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          uid,
          email,
          role,
          created_at: new Date().toISOString(),
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Error creating user profile:", error);
      return null;
    }
  };

  // Sign up - FIXED: ensure email and password are strings
  const signup = async (email, password) => {
    try {
      // Ensure inputs are strings
      const emailStr = String(email).trim();
      const passwordStr = String(password).trim();
      
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        emailStr, 
        passwordStr
      );
      return userCredential.user;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  // Login - FIXED: ensure email and password are strings
  const login = async (email, password) => {
    try {
      // Ensure inputs are strings
      const emailStr = String(email).trim();
      const passwordStr = String(password).trim();
      
      console.log("Login attempt:", { email: emailStr, passwordType: typeof passwordStr });
      
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailStr,
        passwordStr
      );
      return userCredential.user;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
      throw error;
    }
  };

  // Update profile
  const updateProfile = async (updates) => {
    if (!user) return null;

    try {
      const response = await fetch(`http://localhost:8000/api/users/${user.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updates),
      });

      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Error updating profile:", error);
      return null;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    if (!user) return null;

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(`http://localhost:8000/api/users/${user.uid}/avatar`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      
      if (data.success) {
        setUserProfile(data.user);
        return data.user;
      }
      return null;
    } catch (error) {
      console.error("Error uploading avatar:", error);
      return null;
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser ? "User logged in" : "No user");
      
      if (firebaseUser) {
        setUser(firebaseUser);
        
        // Fetch user profile from backend
        const profile = await fetchUserProfile(firebaseUser.uid);
        
        if (!profile) {
          console.log("No profile found - user needs to select role");
        }
      } else {
        setUser(null);
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    user,
    userProfile,
    loading,
    signup,
    login,
    logout,
    createUserProfile,
    fetchUserProfile,
    updateProfile,
    uploadAvatar,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}