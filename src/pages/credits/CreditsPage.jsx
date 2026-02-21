// src/pages/Credits/CreditsPage.jsx
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import API_URL from "../../../config"; // adjust path based on file location

const PACKAGES = [
  {
    id: "starter",
    name: "Starter",
    credits: 50,
    price: "$4.99",
    priceCents: 499,
    perCredit: "$0.10/image",
    badge: null,
    icon: "⚡",
    color: "border-gray-600 hover:border-yellow-500",
    btnColor: "bg-gray-700 hover:bg-yellow-500 hover:text-gray-900",
    features: ["50 AI image generations", "Basic panel tools", "Draft & publish"],
  },
  {
    id: "creator",
    name: "Creator",
    credits: 150,
    price: "$9.99",
    priceCents: 999,
    perCredit: "$0.07/image",
    badge: "MOST POPULAR",
    icon: "🎨",
    color: "border-yellow-500 shadow-lg shadow-yellow-500/30",
    btnColor: "bg-yellow-500 hover:bg-yellow-400 text-gray-900",
    features: ["150 AI image generations", "All creation tools", "Priority queue", "Publish & share"],
  },
  {
    id: "pro",
    name: "Pro",
    credits: 400,
    price: "$19.99",
    priceCents: 1999,
    perCredit: "$0.05/image",
    badge: "BEST VALUE",
    icon: "🚀",
    color: "border-green-500 hover:border-green-400",
    btnColor: "bg-green-600 hover:bg-green-500 text-white",
    features: ["400 AI image generations", "Advanced tools", "Commercial license", "Analytics dashboard"],
  },
  {
    id: "studio",
    name: "Studio",
    credits: 1000,
    price: "$39.99",
    priceCents: 3999,
    perCredit: "$0.04/image",
    badge: null,
    icon: "🏆",
    color: "border-orange-500 hover:border-orange-400",
    btnColor: "bg-orange-600 hover:bg-orange-500 text-white",
    features: ["1000 AI image generations", "All Pro features", "API access (soon)", "Team collab (soon)"],
  },
];

export default function CreditsPage() {
  const { user, userProfile } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingBalance, setLoadingBalance] = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [tab, setTab] = useState("buy"); // "buy" | "history"
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchHistory();
    }
  }, [user]);

  const fetchBalance = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits/balance/${user.uid}`);
      const data = await res.json();
      if (data.success) setBalance(data.balance);
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoadingBalance(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_URL}/api/credits/history/${user.uid}`);
      const data = await res.json();
      if (data.success) setTransactions(data.transactions);
    } catch (err) {
      console.error("Error fetching history:", err);
    }
  };

  const handlePurchase = async (pkg) => {
    setProcessingId(pkg.id);
    try {
      // TODO: Replace with real Stripe checkout
      // For now, simulate purchase for testing
      const res = await fetch(`${API_URL}/api/credits/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uid: user.uid,
          amount: pkg.credits,
          description: `Purchased ${pkg.name} Pack - ${pkg.credits} credits`,
          payment_id: `test_${Date.now()}`,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBalance(data.new_balance);
        setShowSuccess(true);
        fetchHistory();
        setTimeout(() => setShowSuccess(false), 4000);
      }
    } catch (err) {
      console.error("Purchase error:", err);
      alert("Purchase failed. Please try again.");
    } finally {
      setProcessingId(null);
    }
  };

  const getTransactionIcon = (type) => {
    if (type === "purchase") return "💳";
    if (type === "usage") return "⚡";
    if (type === "free") return "🎁";
    if (type === "refund") return "↩️";
    return "•";
  };

  return (
    <div
      className="min-h-screen text-white"
      style={{
        background: "linear-gradient(135deg, #0B0B0B 0%, #0F2F26 50%, #0B0B0B 100%)",
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      {/* ─── Header ─── */}
      <div
        className="border-b border-yellow-500/30 px-6 py-4 flex items-center justify-between"
        style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(12px)" }}
      >
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/creator-dashboard")}
            className="text-gray-400 hover:text-yellow-400 transition-colors text-sm flex items-center gap-1"
          >
            ← Back
          </button>
          <span className="text-gray-600">|</span>
          <span className="text-xl font-black tracking-widest text-yellow-400">
            PANELX
          </span>
          <span className="text-gray-400 text-sm">/ Credits</span>
        </div>

        {/* Balance Badge */}
        <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/40 rounded-full px-4 py-2">
          <span className="text-yellow-400 text-lg">⚡</span>
          <span className="text-white font-bold text-lg">
            {loadingBalance ? "..." : balance}
          </span>
          <span className="text-gray-400 text-sm">credits</span>
        </div>
      </div>

      {/* ─── Success Toast ─── */}
      {showSuccess && (
        <div
          className="fixed top-6 right-6 z-50 bg-green-600 border border-green-400 rounded-xl px-6 py-4 shadow-xl flex items-center gap-3"
          style={{ animation: "slideIn 0.3s ease" }}
        >
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-bold">Credits Added!</p>
            <p className="text-green-200 text-sm">Your balance has been updated</p>
          </div>
        </div>
      )}

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* ─── Hero ─── */}
        <div className="text-center mb-12">
          <h1
            className="text-5xl font-black mb-3 tracking-tight"
            style={{
              background: "linear-gradient(90deg, #FFD700, #FFA500, #FFD700)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Power Up Your Comics
          </h1>
          <p className="text-gray-400 text-lg max-w-xl mx-auto">
            Each credit generates one AI panel image. No subscriptions, no surprises — just credits you control.
          </p>

          {/* Current balance card */}
          <div className="inline-flex items-center gap-4 mt-6 bg-gray-900/60 border border-yellow-500/30 rounded-2xl px-8 py-4">
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Your Balance</p>
              <p className="text-4xl font-black text-yellow-400">
                {loadingBalance ? "—" : balance}
              </p>
              <p className="text-gray-500 text-xs">credits remaining</p>
            </div>
            <div className="w-px h-12 bg-gray-700" />
            <div className="text-center">
              <p className="text-gray-500 text-xs uppercase tracking-widest mb-1">Used This Month</p>
              <p className="text-4xl font-black text-white">
                {transactions.filter(t => t.type === "usage").length}
              </p>
              <p className="text-gray-500 text-xs">images generated</p>
            </div>
          </div>
        </div>

        {/* ─── Tabs ─── */}
        <div className="flex gap-2 mb-8 border-b border-gray-800">
          <button
            onClick={() => setTab("buy")}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${
              tab === "buy"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Buy Credits
          </button>
          <button
            onClick={() => setTab("history")}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 -mb-px ${
              tab === "history"
                ? "border-yellow-500 text-yellow-400"
                : "border-transparent text-gray-500 hover:text-white"
            }`}
          >
            Transaction History
            {transactions.length > 0 && (
              <span className="ml-2 bg-yellow-500 text-gray-900 text-xs font-black rounded-full px-2 py-0.5">
                {transactions.length}
              </span>
            )}
          </button>
        </div>

        {/* ─── BUY TAB ─── */}
        {tab === "buy" && (
          <>
            {/* Packages Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  className={`relative bg-gray-900/80 border-2 rounded-2xl p-6 flex flex-col transition-all duration-300 ${pkg.color}`}
                >
                  {/* Badge */}
                  {pkg.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 text-xs font-black px-3 py-1 rounded-full tracking-widest whitespace-nowrap">
                      {pkg.badge}
                    </div>
                  )}

                  {/* Icon & Name */}
                  <div className="text-4xl mb-2">{pkg.icon}</div>
                  <h3 className="text-xl font-black text-white mb-1">{pkg.name}</h3>
                  <p className="text-gray-500 text-xs mb-4">{pkg.perCredit}</p>

                  {/* Price */}
                  <div className="mb-4">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                  </div>

                  {/* Credits */}
                  <div className="bg-black/30 rounded-xl p-3 mb-5 text-center">
                    <span className="text-yellow-400 font-black text-2xl">{pkg.credits}</span>
                    <span className="text-gray-400 text-sm ml-1">credits</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 mb-6 flex-1">
                    {pkg.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                        <span className="text-yellow-400 mt-0.5">✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Buy Button */}
                  <button
                    onClick={() => handlePurchase(pkg)}
                    disabled={processingId === pkg.id}
                    className={`w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all ${pkg.btnColor} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    {processingId === pkg.id ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        Processing...
                      </span>
                    ) : (
                      `Buy ${pkg.name}`
                    )}
                  </button>
                </div>
              ))}
            </div>

            {/* What's 1 Credit */}
            <div className="bg-gray-900/60 border border-gray-700 rounded-2xl p-6">
              <h3 className="text-white font-black mb-4 text-lg">🤔 What can I do with 1 credit?</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center bg-black/30 rounded-xl p-4">
                  <p className="text-3xl mb-2">🖼️</p>
                  <p className="text-white font-bold text-sm">Generate 1 Panel</p>
                  <p className="text-gray-500 text-xs mt-1">Full AI art</p>
                </div>
                <div className="text-center bg-black/30 rounded-xl p-4">
                  <p className="text-3xl mb-2">🎭</p>
                  <p className="text-white font-bold text-sm">Create a Scene</p>
                  <p className="text-gray-500 text-xs mt-1">Characters + BG</p>
                </div>
                <div className="text-center bg-black/30 rounded-xl p-4">
                  <p className="text-3xl mb-2">🌄</p>
                  <p className="text-white font-bold text-sm">Build a World</p>
                  <p className="text-gray-500 text-xs mt-1">Environment art</p>
                </div>
                <div className="text-center bg-black/30 rounded-xl p-4">
                  <p className="text-3xl mb-2">⚡</p>
                  <p className="text-white font-bold text-sm">Action Shot</p>
                  <p className="text-gray-500 text-xs mt-1">Dynamic poses</p>
                </div>
              </div>
            </div>
          </>
        )}

        {/* ─── HISTORY TAB ─── */}
        {tab === "history" && (
          <div className="bg-gray-900/60 border border-gray-800 rounded-2xl overflow-hidden">
            {transactions.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-5xl mb-4">📋</p>
                <p className="text-gray-400">No transactions yet</p>
                <button
                  onClick={() => setTab("buy")}
                  className="mt-4 text-yellow-400 hover:text-yellow-300 text-sm"
                >
                  Buy your first credits →
                </button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-800">
                    <th className="text-left px-6 py-4 text-gray-500 text-xs uppercase tracking-widest">Type</th>
                    <th className="text-left px-6 py-4 text-gray-500 text-xs uppercase tracking-widest">Description</th>
                    <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-widest">Amount</th>
                    <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-widest">Balance</th>
                    <th className="text-right px-6 py-4 text-gray-500 text-xs uppercase tracking-widest">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, i) => (
                    <tr
                      key={tx.id}
                      className="border-b border-gray-800/50 hover:bg-gray-800/30 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <span className="text-xl">{getTransactionIcon(tx.type)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-white text-sm">{tx.description}</p>
                        <p className="text-gray-600 text-xs capitalize">{tx.type}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-black ${
                            tx.amount > 0 ? "text-green-400" : "text-red-400"
                          }`}
                        >
                          {tx.amount > 0 ? "+" : ""}{tx.amount}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-yellow-400 font-bold">{tx.balance_after}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className="text-gray-500 text-xs">
                          {new Date(tx.created_at).toLocaleDateString()}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* ─── Footer note ─── */}
        <p className="text-center text-gray-600 text-xs mt-8">
          Credits never expire • Secure payments via Stripe •{" "}
          <Link to="/terms" className="text-yellow-600 hover:text-yellow-400">Terms</Link>
          {" "}•{" "}
          <Link to="/privacy" className="text-yellow-600 hover:text-yellow-400">Privacy</Link>
        </p>
      </div>

      <style>{`
        @keyframes slideIn {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}