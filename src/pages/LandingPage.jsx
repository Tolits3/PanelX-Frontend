// src/pages/LandingPage.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0B0B0B] via-[#0F2F26] to-[#00A676] overflow-x-hidden">
      
      {/* ═══════════════════════════════════════════
          HERO SECTION - Parallax Effect
          ═══════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`,
            transition: "transform 0.1s ease-out"
          }}
        >
          <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-500 rounded-full blur-[120px]" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-green-500 rounded-full blur-[150px]" />
        </div>

        {/* Hero Content */}
          <div
            className="relative z-10 text-center px-6 max-w-5xl mx-auto"
            style={{
              transform: `translateY(${scrollY * 0.3}px)`,
              opacity: Math.max(0, 1 - scrollY / 500)
            }}
          >
            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-tight">
              PanelX is the Ultimate Comic Creation Platform with Ai
              <br />
              <span className="text-yellow-400">PanelX is still in development so there might be unavailable features</span>
            </h1>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/signup")}
                className="px-8 py-4 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black text-lg rounded-xl transition-all transform hover:scale-105 shadow-2xl"
              >
                Start Creating Free
              </button>
              <button
                onClick={() => navigate("/login")}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white font-bold text-lg rounded-xl transition-all border-2 border-white/30"
              >
                Sign In
              </button>
            </div>
          </div>

          {/* Scroll Indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <div className="w-1 h-3 bg-white rounded-full" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          FEATURES SECTION - Scroll Reveal Cards
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-black text-white text-center mb-20"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 300) / 200)),
              transform: `translateY(${Math.max(0, 50 - (scrollY - 300) / 5)}px)`
            }}
          >
            Why <span className="text-yellow-400">PanelX</span>?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "🤖",
                title: "AI-Powered",
                description: "Generate stunning comic panels with advanced AI technology",
                delay: 0
              },
              {
                icon: "🎨",
                title: "Intuitive Editor",
                description: "Drag, drop, and customize panels with our easy-to-use studio",
                delay: 100
              },
              {
                icon: "📚",
                title: "Share & Read",
                description: "Publish your comics and discover amazing stories from creators worldwide",
                delay: 200
              }
            ].map((feature, idx) => (
              <div
                key={idx}
                className="bg-gray-900/60 backdrop-blur-sm border border-gray-700 hover:border-yellow-500/50 rounded-2xl p-8 transition-all transform hover:-translate-y-2 hover:shadow-2xl"
                style={{
                  opacity: Math.min(1, Math.max(0, (scrollY - 500 - feature.delay) / 300)),
                  transform: `translateY(${Math.max(0, 100 - (scrollY - 500 - feature.delay) / 3)}px)`
                }}
              >
                <div className="text-6xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-black text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          PRICING SECTION - Floating Cards
          ═══════════════════════════════════════════ */}
      <section className="py-32 px-6 relative">
        <div className="max-w-7xl mx-auto">
          <h2
            className="text-5xl md:text-6xl font-black text-white text-center mb-8"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 1000) / 200))
            }}
          >
            Simple <span className="text-yellow-400">Pricing</span>
          </h2>
          <p
            className="text-xl text-gray-400 text-center mb-20 max-w-2xl mx-auto"
            style={{
              opacity: Math.min(1, Math.max(0, (scrollY - 1100) / 200))
            }}
          >
            Free during beta! All features unlocked. No credit card required.
          </p>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {[
              {
                name: "Free Beta",
                price: "$0",
                period: "forever",
                features: [
                  "✨ 1000 free credits",
                  "🤖 AI chat assistant",
                  "🎨 Full studio access",
                  "📚 Unlimited reading",
                  "💾 Cloud storage"
                ],
                cta: "Start Creating",
                highlighted: false,
                delay: 0
              },
              {
                name: "Creator Pro",
                price: "$9.99",
                period: "/month",
                features: [
                  "🚀 Everything in Free",
                  "⚡ 5000 credits/month",
                  "🎯 Priority generation",
                  "📊 Advanced analytics",
                  "🎨 Premium templates",
                  "⭐ Creator badge"
                ],
                cta: "Coming Soon",
                highlighted: true,
                delay: 100
              },
              {
                name: "Studio",
                price: "$29.99",
                period: "/month",
                features: [
                  "💎 Everything in Pro",
                  "♾️ Unlimited credits",
                  "👥 Team collaboration",
                  "🔧 API access",
                  "📈 White-label options",
                  "🎓 1-on-1 support"
                ],
                cta: "Coming Soon",
                highlighted: false,
                delay: 200
              }
            ].map((plan, idx) => (
              <div
                key={idx}
                className={`
                  relative bg-gray-900/80 backdrop-blur-sm rounded-3xl p-8 
                  border-2 transition-all duration-500 transform hover:scale-105
                  ${plan.highlighted 
                    ? "border-yellow-500 shadow-2xl shadow-yellow-500/20 -translate-y-4" 
                    : "border-gray-700 hover:border-yellow-500/50"
                  }
                `}
                style={{
                  opacity: Math.min(1, Math.max(0, (scrollY - 1200 - plan.delay) / 300)),
                  transform: `translateY(${Math.max(0, 100 - (scrollY - 1200 - plan.delay) / 3)}px) ${plan.highlighted ? 'translateY(-16px)' : ''}`
                }}
              >
                {plan.highlighted && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-500 text-gray-900 px-6 py-2 rounded-full text-sm font-black">
                    🔥 Most Popular
                  </div>
                )}

                <h3 className="text-2xl font-black text-white mb-2">{plan.name}</h3>
                <div className="mb-6">
                  <span className="text-5xl font-black text-white">{plan.price}</span>
                  <span className="text-gray-400 text-lg">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="text-gray-300 flex items-start gap-2">
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => plan.price === "$0" ? navigate("/signup") : null}
                  disabled={plan.price !== "$0"}
                  className={`
                    w-full py-4 rounded-xl font-black text-lg transition-all
                    ${plan.highlighted
                      ? "bg-yellow-500 hover:bg-yellow-400 text-gray-900"
                      : "bg-white/10 hover:bg-white/20 text-white"
                    }
                    ${plan.price !== "$0" ? "opacity-50 cursor-not-allowed" : ""}
                  `}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CONTACT SECTION - Footer
          ═══════════════════════════════════════════ */}
      <section className="py-20 px-6 bg-black/40 backdrop-blur-sm border-t border-gray-700">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 mb-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-3xl font-black text-white mb-6">Get in Touch</h3>
              <p className="text-gray-400 mb-8">
                Have questions or need support? We're here to help!
              </p>

              <div className="space-y-4">
                <a
                  href="mailto:support@panelx.app"
                  className="flex items-center gap-4 p-4 bg-gray-900/60 hover:bg-gray-800/80 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📧</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="text-white font-bold">support@panelx.app</p>
                  </div>
                </a>

                <a
                  href="tel:+1234567890"
                  className="flex items-center gap-4 p-4 bg-gray-900/60 hover:bg-gray-800/80 rounded-xl transition-all group"
                >
                  <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                    <span className="text-2xl">📞</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="text-white font-bold">+1 (234) 567-890</p>
                  </div>
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <div>
              <h3 className="text-3xl font-black text-white mb-6">Send a Message</h3>
              <form className="space-y-4" onSubmit={(e) => {
                e.preventDefault();
                alert("Message sent! We'll get back to you soon.");
              }}>
                <input
                  type="email"
                  placeholder="Your email"
                  required
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors"
                />
                <textarea
                  placeholder="Your message"
                  required
                  rows={4}
                  className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500 transition-colors resize-none"
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-yellow-500 hover:bg-yellow-400 text-gray-900 font-black rounded-xl transition-all transform hover:scale-105"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-gray-700 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🎨</span>
              <span className="text-white font-black text-xl">PanelX</span>
            </div>

            <p className="text-gray-500 text-sm">
              © 2026 PanelX. Created by Lolito Ruiz. All rights reserved.
            </p>

            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Privacy
              </a>
              <a href="#" className="text-gray-400 hover:text-yellow-400 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}