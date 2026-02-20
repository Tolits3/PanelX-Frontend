import React from "react";
import CreatorPanel from "../Creator/CreatorPanel";

export default function CreatorDashboardV2() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-gray-900 to-gray-800 text-white">
      <header className="flex justify-between items-center p-6 border-b border-gray-800">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          🎨 Creator Dashboard
        </h1>
      </header>

      <main className="flex justify-center py-10">
        <CreatorPanel />
      </main>
    </div>
  );
}
