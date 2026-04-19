import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../config";

export default function CreditsPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(1000);
  const [packages, setPackages] = useState([]);

  useEffect(() => {
    fetchPackages();
    if (user) fetchBalance();
  }, [user]);

  const fetchPackages = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits/packages`);
      const data = await res.json();
      if (data.success) setPackages(data.packages);
    } catch (e) {
      console.error("Error fetching packages:", e);
    }
  };

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits/balance/${user.uid}`);
      const data = await res.json();
      if (data.success) setBalance(data.balance);
    } catch (e) {
      console.error("Error fetching balance:", e);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676]">

      {/* Header */}
      <div className="bg-black/40 border-b border-yellow-500/30 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/creator-dashboard")}
              className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center text-white"
            >
              ←
            </button>
            <h1 className="text-2xl font-black text-yellow-400">⚡ Credits</h1>
          </div>
          <div className="bg-yellow-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl">
            <span className="text-yellow-400 font-black">⚡ {balance} credits</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Beta Banner */}
        <div className="bg-yellow-500/10 border-2 border-yellow-500 rounded-3xl p-8 mb-12 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-4xl font-black text-white mb-4">
            PanelX is in <span className="text-yellow-400">Beta!</span>
          </h2>
          <p className="text-xl text-gray-300 mb-2">
            We're currently in development — use everything for <span className="text-yellow-400 font-black">FREE!</span>
          </p>
          <p className="text-gray-400">
            Paid plans are coming soon. For now, enjoy unlimited access! 🚀
          </p>
        </div>

        {/* Current Balance */}
        <div className="bg-gray-900/60 border border-gray-700 rounded-3xl p-8 mb-12 text-center">
          <p className="text-gray-400 mb-2">Your Current Balance</p>
          <div className="text-7xl font-black text-yellow-400 mb-2">⚡ {balance}</div>
          <p className="text-gray-400">Beta Credits (Free!)</p>
        </div>

        {/* Pricing Plans */}
        <h2 className="text-3xl font-black text-white text-center mb-8">
          Upcoming Plans
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`relative bg-gray-900/60 border-2 rounded-3xl p-8 transition-all
                ${pkg.id === "creator_pro"
                  ? "border-yellow-500 shadow-2xl shadow-yellow-500/20"
                  : "border-gray-700"
                }
              `}
            >
              {pkg.id === "creator_pro" && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-black">
                  🔥 Most Popular
                </div>
              )}

              {/* Badge */}
              <div className="text-center mb-4">
                <span className="text-2xl">{pkg.badge}</span>
              </div>

              {/* Name */}
              <h3 className="text-2xl font-black text-white text-center mb-2">
                {pkg.name}
              </h3>

              {/* Price */}
              <div className="text-center mb-6">
                {pkg.price === 0 ? (
                  <span className="text-5xl font-black text-yellow-400">FREE</span>
                ) : (
                  <div>
                    <span className="text-5xl font-black text-white">${pkg.price}</span>
                    <span className="text-gray-400">/month</span>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {pkg.features.map((f, i) => (
                  <li key={i} className="flex items-center gap-2 text-gray-300">
                    <span className="text-yellow-400">✓</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              {/* Button */}
              <button
                disabled={!pkg.active}
                onClick={() => pkg.active ? navigate("/signup") : null}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all
                  ${pkg.active
                    ? "bg-yellow-500 hover:bg-yellow-400 text-gray-900 transform hover:scale-105"
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }
                `}
              >
                {pkg.active ? "Get Started Free" : "Coming Soon"}
              </button>
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-16 text-center">
          <h3 className="text-2xl font-black text-white mb-4">Questions?</h3>
          <p className="text-gray-400 mb-4">
            PanelX is built by students passionate about comics and AI.
            We're working hard to bring you the best experience!
          </p>
          <a
            href="mailto:support@panelx.app"
            className="text-yellow-400 hover:text-yellow-300 font-bold underline"
          >
            📧 Contact us at support@panelx.app
          </a>
        </div>
      </div>
    </div>
  );
}