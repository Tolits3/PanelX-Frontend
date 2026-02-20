// src/pages/Creator/CreatorPanel.jsx
import React, { useState } from "react";
import ImageUpload from "./ImageUpload";

const CreatorPanel = () => {
  const [referenceImage, setReferenceImage] = useState(null);
  const [generationType, setGenerationType] = useState("image");
  const [style, setStyle] = useState("manhwa");
  const [genre, setGenre] = useState("modern");
  const [clothes, setClothes] = useState("casual");
  const [accessory, setAccessory] = useState("none");
  const [background, setBackground] = useState("city");
  const [pose, setPose] = useState("standing");
  const [emotion, setEmotion] = useState("neutral");
  const [customPrompt, setCustomPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [resultUrl, setResultUrl] = useState(null);

  const handleImageSelect = (file) => setReferenceImage(file);

  const handleGenerate = async () => {
    if (!customPrompt.trim()) {
      alert("Please describe your scene!");
      return;
    }

    setLoading(true);
    setResultUrl(null);

    const formData = new FormData();
    if (referenceImage) formData.append("image", referenceImage);
    formData.append("prompt", customPrompt);
    formData.append("style", style);
    formData.append("genre", genre);
    formData.append("body", pose);
    formData.append("outfit", clothes);
    formData.append("hair", emotion);
    formData.append("beard", accessory);

    const endpoint =
      generationType === "video"
        ? "http://localhost:8000/generate-video"
        : "http://localhost:8000/generate-image";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (json.image_url) setResultUrl(json.image_url);
      else if (json.video_url) setResultUrl(json.video_url);
      else alert("No output returned, check backend logs.");
    } catch (err) {
      console.error(err);
      alert("Error generating content.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl bg-gray-900/70 backdrop-blur-xl border border-gray-700 rounded-2xl shadow-2xl p-8 space-y-8">
      <h1 className="text-3xl font-bold text-center text-white tracking-wide">
        ✨ Create AI Comic Panels
      </h1>

      <ImageUpload onImageSelect={handleImageSelect} />

      {/* Dropdown Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Setting label="Generation Type" value={generationType} setValue={setGenerationType} options={[
          { value: "image", label: "AI Image" },
          { value: "video", label: "AI Video" },
        ]}/>
        <Setting label="Art Style" value={style} setValue={setStyle} options={[
          { value: "manga", label: "Manga" },
          { value: "manhwa", label: "Manhwa" },
          { value: "american", label: "American Comic" },
          { value: "veo3", label: "Veo 3" },
          { value: "realistic", label: "Realistic" },
          { value: "controlnet", label: "ControlNet" },
        ]}/>
        <Setting label="Genre" value={genre} setValue={setGenre} options={[
          { value: "modern", label: "Modern" },
          { value: "fantasy", label: "Fantasy" },
          { value: "sci-fi", label: "Sci-Fi" },
          { value: "apocalypse", label: "Apocalypse" },
        ]}/>
        <Setting label="Clothing" value={clothes} setValue={setClothes} options={[
          { value: "casual", label: "Casual" },
          { value: "battle-armor", label: "Battle Armor" },
          { value: "school-uniform", label: "School Uniform" },
        ]}/>
        <Setting label="Accessory" value={accessory} setValue={setAccessory} options={[
          { value: "none", label: "None" },
          { value: "sword", label: "Sword" },
          { value: "mask", label: "Mask" },
          { value: "glasses", label: "Glasses" },
        ]}/>
        <Setting label="Background" value={background} setValue={setBackground} options={[
          { value: "city", label: "City" },
          { value: "forest", label: "Forest" },
          { value: "mountain", label: "Mountain" },
          { value: "castle", label: "Fantasy Castle" },
        ]}/>
        <Setting label="Pose" value={pose} setValue={setPose} options={[
          { value: "standing", label: "Standing" },
          { value: "running", label: "Running" },
          { value: "fighting", label: "Fighting" },
        ]}/>
        <Setting label="Emotion" value={emotion} setValue={setEmotion} options={[
          { value: "neutral", label: "Neutral" },
          { value: "happy", label: "Happy" },
          { value: "angry", label: "Angry" },
        ]}/>
      </div>

      {/* Prompt */}
      <div className="flex flex-col space-y-2">
        <label className="font-semibold text-gray-300">Scene Description</label>
        <textarea
          value={customPrompt}
          onChange={(e) => setCustomPrompt(e.target.value)}
          placeholder="Describe your scene..."
          className="bg-gray-800 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:ring-2 focus:ring-purple-600"
          rows={3}
        />
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg text-lg font-semibold shadow-md transition-all duration-300"
      >
        {loading ? "Generating..." : "Generate"}
      </button>

      {/* Output */}
      {resultUrl && (
        <div className="mt-8 text-center">
          <h3 className="text-lg font-semibold text-gray-200 mb-3">Generated Output:</h3>
          {generationType === "image" ? (
            <img
              src={resultUrl}
              alt="Generated result"
              className="w-full max-w-lg mx-auto rounded-xl border border-gray-700 shadow-lg"
            />
          ) : (
            <video
              src={resultUrl}
              controls
              className="w-full max-w-lg mx-auto rounded-xl border border-gray-700 shadow-lg"
            />
          )}
        </div>
      )}
    </div>
  );
};

const Setting = ({ label, value, setValue, options }) => (
  <div className="flex flex-col space-y-2">
    <label className="font-semibold text-gray-300">{label}</label>
    <select
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="bg-gray-800 border border-gray-700 rounded-lg p-2 text-white focus:ring-2 focus:ring-purple-600 transition-all duration-200"
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

export default CreatorPanel;
