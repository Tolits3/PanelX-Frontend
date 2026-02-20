export default function CreatorEditor() {
  return (
    <div className="min-h-screen flex bg-[#F7F8FA]">

      {/* LEFT SIDEBAR */}
      <aside className="w-64 bg-white border-r p-4">
        <h2 className="text-xl font-bold text-[#00A676] mb-4">Tools</h2>

        <div className="space-y-4">
          <button className="w-full px-3 py-2 bg-[#ECEEF2] text-left rounded hover:bg-[#00A676]/20">
            + Panel
          </button>
          <button className="w-full px-3 py-2 bg-[#ECEEF2] text-left rounded hover:bg-[#00A676]/20">
            + Speech Bubble
          </button>
          <button className="w-full px-3 py-2 bg-[#ECEEF2] text-left rounded hover:bg-[#00A676]/20">
            + Narration Box
          </button>
          <button className="w-full px-3 py-2 bg-[#ECEEF2] text-left rounded hover:bg-[#00A676]/20">
            + Character Label
          </button>
        </div>
      </aside>

      {/* CANVAS WORKSPACE */}
      <main className="flex-1 flex justify-center items-start p-10">
        <div className="bg-white rounded-xl shadow-lg w-[70%] min-h-[80vh] border border-gray-300 p-6">
          <h3 className="text-xl font-semibold mb-4">Canvas</h3>

          {/* Placeholder for the actual editor */}
          <div className="w-full h-[70vh] bg-[#ECEEF2] rounded-lg flex items-center justify-center text-gray-500">
            Drop panels or elements here
          </div>
        </div>
      </main>

      {/* RIGHT PROPERTIES PANEL */}
      <aside className="w-72 bg-white border-l p-4">
        <h2 className="text-xl font-bold text-[#F2C94C] mb-4">Properties</h2>

        <div className="space-y-4">
          <label className="block">
            <span className="text-gray-700">Position X</span>
            <input type="number" className="w-full mt-1 rounded border px-2 py-1" />
          </label>
          <label className="block">
            <span className="text-gray-700">Position Y</span>
            <input type="number" className="w-full mt-1 rounded border px-2 py-1" />
          </label>
          <label className="block">
            <span className="text-gray-700">Font Size</span>
            <input type="number" className="w-full mt-1 rounded border px-2 py-1" />
          </label>

          <button className="w-full mt-2 px-3 py-2 bg-[#00A676] text-white rounded hover:bg-[#00895F]">
            Apply
          </button>
        </div>
      </aside>

    </div>
  );
}