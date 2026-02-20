import { useEffect, useState } from "react";

export default function CharacterPanel() {
  const [chars, setChars] = useState([]);

  useEffect(() => {
    setChars(JSON.parse(localStorage.getItem("characters") || "[]"));
  }, []);

  return (
    <div className="absolute left-20 top-0 w-64 h-full bg-[#0F1E17] p-3">
      {chars.map(c => (
        <div
          key={c.character_id}
          draggable
          onDragStart={e =>
            e.dataTransfer.setData("character", JSON.stringify(c))
          }
          className="mb-3"
        >
          <img src={`http://localhost:8000${c.angles.front}`} />
          <p>{c.name}</p>
        </div>
      ))}
    </div>
  );
}
