import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CharacterCreator() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [gender, setGender] = useState("male");
  const [hair, setHair] = useState("short");
  const [eyes, setEyes] = useState("normal");
  const [clothes, setClothes] = useState("casual");
  const [vibe, setVibe] = useState("anime");
  const [style, setStyle] = useState("manga");
  const [loading, setLoading] = useState(false);

  async function handleCreate() {
    if (!name) return alert("Enter a name");

    setLoading(true);

    const payload = {
      name,
      gender,
      hair,
      eyes,
      clothes,
      vibe,
      style,
      background: "transparent", // IMPORTANT
    };

    try {
      const res = await fetch("http://localhost:8000/api/characters/create-character", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      const existing = JSON.parse(localStorage.getItem("characters") || "[]");
      existing.push(data.rig);
      localStorage.setItem("characters", JSON.stringify(existing));

      navigate("/creator-studio"); // AUTO RETURN
    } catch (err) {
      alert("Error creating character");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-[#F2C94C]">Create Your Character</h1>
        <button
          onClick={() => navigate("/creator-studio")}
          className="px-4 py-2 bg-[#00A676]/20 text-[#00A676] rounded"
        >
          ← Back to Studio
        </button>
      </div>

      <div className="grid grid-cols-2 gap-6 max-w-3xl">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <select value={gender} onChange={e => setGender(e.target.value)}>
          <option>male</option><option>female</option>
        </select>
        <select value={hair} onChange={e => setHair(e.target.value)}>
          <option>short</option><option>medium</option><option>long</option>
        </select>
        <select value={eyes} onChange={e => setEyes(e.target.value)}>
          <option>normal</option><option>serious</option>
        </select>
        <select value={clothes} onChange={e => setClothes(e.target.value)}>
          <option>casual</option><option>streetwear</option>
        </select>
        <select value={vibe} onChange={e => setVibe(e.target.value)}>
          <option>anime</option><option>manhwa</option>
        </select>
        <select value={style} onChange={e => setStyle(e.target.value)}>
          <option>manga</option><option>manhwa</option>
        </select>
      </div>

      <button
        onClick={handleCreate}
        disabled={loading}
        className="mt-8 bg-[#00A676] px-6 py-3 rounded"
      >
        {loading ? "Generating..." : "Create Character"}
      </button>
    </div>
  );
}
