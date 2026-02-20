// src/components/CreditBalance.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function CreditBalance({ compact = false }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  const fetchBalance = async () => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/credits/balance/${user.uid}`
      );
      const data = await res.json();
      if (data.success) {
        setBalance(data.balance);
        // Pulse animation if balance is low
        if (data.balance <= 5) setPulse(true);
      }
    } catch (err) {
      console.error("Error fetching balance:", err);
    } finally {
      setLoading(false);
    }
  };

  // Expose refresh function globally so canvas can call it after generation
  useEffect(() => {
    window.refreshCreditBalance = fetchBalance;
    return () => { delete window.refreshCreditBalance; };
  }, [user]);

  if (loading) return null;

  if (compact) {
    return (
      <button
        onClick={() => navigate("/credits")}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-all text-sm ${
          balance <= 5
            ? "border-red-500/60 bg-red-500/10 text-red-400 animate-pulse"
            : "border-yellow-500/40 bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20"
        }`}
        title="Click to buy more credits"
      >
        <span>⚡</span>
        <span className="font-black">{balance}</span>
        {balance <= 5 && <span className="text-xs">Low!</span>}
      </button>
    );
  }

  return (
    <button
      onClick={() => navigate("/credits")}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 transition-all ${
        balance <= 5
          ? "border-red-500 bg-red-500/10 hover:bg-red-500/20"
          : "border-yellow-500/50 bg-yellow-500/10 hover:bg-yellow-500/20"
      }`}
      title="Buy more credits"
    >
      <span className="text-xl">⚡</span>
      <div className="text-left">
        <p className={`font-black text-lg leading-none ${balance <= 5 ? "text-red-400" : "text-yellow-400"}`}>
          {balance}
        </p>
        <p className="text-gray-500 text-xs">credits</p>
      </div>
      <span className="text-gray-500 text-xs ml-1">+</span>
    </button>
  );
}