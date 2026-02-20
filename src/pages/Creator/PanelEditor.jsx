import React from "react";
import { useNavigate } from "react-router-dom";

const PanelEditor = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="card text-center">
        <h2 className="text-white">Open a panel from Creator Dashboard to edit it.</h2>
        <button onClick={() => navigate("/creator-dashboard")} className="mt-4 bg-indigo-500 px-4 py-2 rounded">Back</button>
      </div>
    </div>
  );
};

export default PanelEditor;
