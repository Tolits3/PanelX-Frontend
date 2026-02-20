import React from "react";
import { useNavigate } from "react-router-dom";

const CreatorWelcome = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <h2 className="text-2xl font-bold mb-4">Welcome, Creator 🎨</h2>
        <p className="mb-4">Start creating your first chapter.</p>
        <div className="flex gap-3 justify-center">
          <button onClick={() => navigate("/creator-dashboard")} className="bg-indigo-600 px-4 py-2 rounded">Go to Dashboard</button>
        </div>
      </div>
    </div>
  );
};

export default CreatorWelcome;
