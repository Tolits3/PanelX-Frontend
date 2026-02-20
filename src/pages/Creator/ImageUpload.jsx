// src/pages/Creator/ImageUpload.jsx
import React from "react";

export default function ImageUpload({ onImageSelect }) {
  return (
    <div className="flex flex-col items-center justify-center bg-gray-800/70 border border-gray-700 rounded-lg p-6 text-center">
      <label className="text-gray-300 font-semibold mb-3">
        Upload Reference Image (optional)
      </label>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => onImageSelect(e.target.files[0])}
        className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-purple-600 file:text-white hover:file:bg-purple-700 cursor-pointer"
      />
    </div>
  );
}
