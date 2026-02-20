import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();  // ✅ FIXED

  return (
    <div className="relative min-h-screen bg-[#0B0B0B] text-white overflow-hidden">

      {/* Glow Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-[10%] left-[20%] w-[400px] h-[400px] bg-green-400/20 blur-[160px]"></div>
        <div className="absolute bottom-[15%] right-[10%] w-[400px] h-[400px] bg-yellow-300/20 blur-[180px]"></div>
        <div className="absolute inset-0 bg-white/5 backdrop-blur-3xl"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex justify-between items-center px-12 py-6">
        <h1 className="text-2xl font-bold text-[#F2C94C]">PanelX</h1>
        <div className="space-x-8 text-gray-300">
          <a href="#" className="hover:text-[#F2C94C] transition">Features</a>
          <a href="#" className="hover:text-[#F2C94C] transition">Pricing</a>
          <a href="#" className="hover:text-[#F2C94C] transition">Creators</a>
        </div>

        <button
          onClick={() => navigate("/login")}
          className="px-5 py-2 rounded-full border border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black transition"
        >
          Login
        </button>
      </nav>

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center text-center mt-32 px-4">
        <h2 className="text-5xl md:text-7xl font-semibold leading-tight">
          Create Stunning Comics, <br />
          Effortlessly Powered by AI
        </h2>

        <p className="mt-6 max-w-2xl text-gray-300 text-lg">
          Transform your ideas into beautiful manga, manhwa, or western-style panels with one click.
        </p>

        <div className="mt-10 space-x-4">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-3 rounded-full bg-[#00A676] hover:bg-[#00895F] transition text-black font-semibold"
          >
            Start Creating
          </button>

          <button className="px-8 py-3 rounded-full border border-[#F2C94C] text-[#F2C94C] hover:bg-[#F2C94C] hover:text-black transition font-semibold">
            Learn More
          </button>
        </div>
      </div>

    </div>
  );
}
