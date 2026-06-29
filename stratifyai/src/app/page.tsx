"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Instagram, Linkedin, Youtube, Settings, ArrowLeft, 
  Sparkles, Lock, Key, ShieldAlert, ArrowRight, Zap, RefreshCw, Layers
} from "lucide-react";
import GlassCard from "../components/ui/GlassCard";
import InstagramWorkspace from "../components/workspace/InstagramWorkspace";
import LinkedInWorkspace from "../components/workspace/LinkedInWorkspace";
import ShortsWorkspace from "../components/workspace/ShortsWorkspace";

export default function Page() {
  const [activeWorkspace, setActiveWorkspace] = useState<"landing" | "instagram" | "linkedin" | "shorts">("landing");
  const [customApiKey, setCustomApiKey] = useState("");
  const [hasServerKey, setHasServerKey] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [inputKey, setInputKey] = useState("");
  const [showSplash, setShowSplash] = useState(true);

  // Load API Key from LocalStorage on mount and check server config
  useEffect(() => {
    const savedKey = localStorage.getItem("gemini_api_key");
    if (savedKey) {
      setCustomApiKey(savedKey);
      setInputKey(savedKey);
    }
    
    // Check server key configuration
    fetch("/api/config")
      .then((res) => res.json())
      .then((data) => {
        if (data && typeof data.hasApiKey === "boolean") {
          setHasServerKey(data.hasApiKey);
        }
      })
      .catch((err) => console.error("Error loading server api status", err));

    // Hide splash screen after 2.2 seconds
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const handleSaveKey = () => {
    localStorage.setItem("gemini_api_key", inputKey);
    setCustomApiKey(inputKey);
    setShowSettings(false);
  };

  const handleClearKey = () => {
    localStorage.removeItem("gemini_api_key");
    setCustomApiKey("");
    setInputKey("");
    setShowSettings(false);
  };

  // Background glow colors depending on active workspace
  const getGlowColors = () => {
    switch (activeWorkspace) {
      case "instagram":
        return ["from-pink-500/20", "to-violet-500/20"];
      case "linkedin":
        return ["from-sky-400/20", "to-blue-600/20"];
      case "shorts":
        return ["from-red-500/20", "to-pink-600/20"];
      default:
        return ["from-violet-500/10", "to-fuchsia-500/10"];
    }
  };

  const glowColors = getGlowColors();

  return (
    <main className="relative min-h-screen bg-[#030712] text-gray-100 overflow-hidden flex flex-col font-sans">
      {/* Cinematic Splash Screen */}
      <AnimatePresence>
        {showSplash && (
          <motion.div
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ 
              opacity: 0,
              transition: { duration: 0.8, ease: "easeInOut" }
            }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#030712] overflow-hidden"
          >
            {/* Ambient Background Glow behind logo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 0.15, scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute w-[400px] h-[400px] rounded-full bg-gradient-to-br from-violet-500 to-pink-500 blur-[80px]"
            />

            <div className="relative flex flex-col items-center gap-6">
              <motion.img
                src="/logo.png"
                alt="Stratify AI Logo"
                initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ 
                  scale: 3.5, 
                  opacity: 0,
                  filter: "blur(15px)",
                  transition: { duration: 0.8, ease: "easeInOut" }
                }}
                transition={{ duration: 1.2, ease: "easeOut" }}
                className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-[0_0_30px_rgba(139,92,246,0.4)]"
              />

              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ 
                  opacity: 0, 
                  y: -20,
                  transition: { duration: 0.5 } 
                }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="text-2xl md:text-3xl font-extrabold tracking-widest uppercase bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent"
              >
                Stratify AI
              </motion.h1>

              {/* Loader bar */}
              <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden mt-2 relative">
                <motion.div
                  initial={{ left: "-100%" }}
                  animate={{ left: "100%" }}
                  transition={{ duration: 1.8, ease: "easeInOut", repeat: 0 }}
                  className="absolute top-0 bottom-0 w-1/2 bg-gradient-to-r from-transparent via-violet-500 to-transparent"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Website Wrapper */}
      <motion.div
        animate={{ 
          opacity: showSplash ? 0 : 1, 
          scale: showSplash ? 0.95 : 1,
          filter: showSplash ? "blur(5px)" : "blur(0px)"
        }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex-grow flex flex-col min-h-screen relative w-full"
      >
        {/* Background radial blobs */}
        <div className={`glow-spot w-[600px] h-[600px] -top-80 -left-60 bg-gradient-to-br ${glowColors[0]} ${glowColors[1]} transition-all duration-1000`} />
        <div className={`glow-spot w-[500px] h-[500px] -bottom-60 -right-40 bg-gradient-to-br ${glowColors[1]} ${glowColors[0]} transition-all duration-1000`} />

        {/* Global Navbar */}
        <header className="relative z-10 w-full border-b border-white/5 bg-black/20 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <div 
              onClick={() => setActiveWorkspace("landing")} 
              className="flex items-center gap-2.5 cursor-pointer group"
            >
              <img 
                src="/logo.png" 
                alt="Stratify AI Logo" 
                className="w-8 h-8 object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-[0_0_8px_rgba(139,92,246,0.3)]"
              />
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent group-hover:text-white transition-colors duration-300">
                Stratify AI
              </span>
            </div>

          <div className="flex items-center gap-4">
            {/* Custom API Key Badge Status */}
            <button
              onClick={() => setShowSettings(true)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                customApiKey || hasServerKey 
                  ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                  : "bg-amber-500/10 border-amber-500/30 text-amber-400 hover:bg-amber-500/20"
              }`}
            >
              {customApiKey || hasServerKey ? (
                <>
                  <Lock className="w-3.5 h-3.5" /> API Key Configured {hasServerKey && !customApiKey && "(Server)"}
                </>
              ) : (
                <>
                  <Key className="w-3.5 h-3.5" /> Enter API Key
                </>
              )}
            </button>

            <button
              onClick={() => setShowSettings(true)}
              className="p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Body */}
      <section className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          
          {/* Landing Workspace Screen */}
          {activeWorkspace === "landing" && (
            <motion.div
              key="landing-screen"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.4 }}
              className="space-y-16"
            >
              {/* Hero Header */}
              <div className="text-center max-w-3xl mx-auto space-y-6">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/5 px-3 py-1.5 rounded-full text-xs text-violet-400 font-semibold"
                >
                  <Sparkles className="w-3.5 h-3.5 text-violet-400 animate-pulse" />
                  Your AI Social Media Strategist
                </motion.div>
                
                <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none bg-gradient-to-b from-white via-gray-100 to-gray-500 bg-clip-text text-transparent">
                  Stratify AI
                </h1>
                
                <p className="text-lg md:text-xl text-gray-400 max-w-xl mx-auto font-light leading-relaxed">
                  Your personal AI strategist for social media growth. Let our specialized agents analyze trends, optimize scripts, and schedule viral content calendars.
                </p>
              </div>

              {/* API Key missing notice if not set */}
              {!customApiKey && !hasServerKey && (
                <div className="max-w-md mx-auto bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl text-xs text-center flex items-center justify-center gap-2">
                  <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>
                    No Gemini API Key found. To call the AI agent, click the{" "}
                    <button onClick={() => setShowSettings(true)} className="underline hover:no-underline font-bold">
                      Enter API Key
                    </button>{" "}
                    button to add your key.
                  </span>
                </div>
              )}

              {/* Platform selection Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                
                {/* Instagram Platform Card */}
                <GlassCard
                  onClick={() => setActiveWorkspace("instagram")}
                  glowColor="instagram"
                  className="group relative border-pink-500/10 hover:border-pink-500/30 overflow-hidden flex flex-col justify-between h-[360px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-pink-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Instagram className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">Instagram Workspace</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
                      Deploy trend predictors, search viral reels audio niche signals, map out monthly content strategies, and build caption hooks.
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="text-xs text-pink-400 font-bold uppercase tracking-wider">4 Specialized Agents</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-pink-500/10 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
                    </div>
                  </div>
                </GlassCard>

                {/* LinkedIn Platform Card */}
                <GlassCard
                  onClick={() => setActiveWorkspace("linkedin")}
                  glowColor="linkedin"
                  className="group relative border-sky-500/10 hover:border-sky-500/30 overflow-hidden flex flex-col justify-between h-[360px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow-lg shadow-sky-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Linkedin className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">LinkedIn Workspace</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
                      Elevate authority with structured thought leadership, generate professional curiosity hook variants, and map out 30-day personal branding timelines.
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="text-xs text-sky-400 font-bold uppercase tracking-wider">3 Specialized Agents</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-sky-500/10 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-sky-400 transition-colors" />
                    </div>
                  </div>
                </GlassCard>

                {/* YouTube Shorts Platform Card */}
                <GlassCard
                  onClick={() => setActiveWorkspace("shorts")}
                  glowColor="shorts"
                  className="group relative border-red-500/10 hover:border-red-500/30 overflow-hidden flex flex-col justify-between h-[360px]"
                >
                  <div>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center shadow-lg shadow-red-500/20 mb-6 group-hover:scale-110 transition-transform duration-300">
                      <Youtube className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">YouTube Shorts</h3>
                    <p className="text-sm text-gray-400 leading-relaxed font-light mb-6">
                      Find rising layout formats, rewrite first 5 seconds scripts using high-retention loop patterns, and unpack single concepts into 10-part episodic lists.
                    </p>
                  </div>

                  <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-auto">
                    <span className="text-xs text-red-400 font-bold uppercase tracking-wider">3 Specialized Agents</span>
                    <div className="w-8 h-8 rounded-full bg-white/5 group-hover:bg-red-500/10 flex items-center justify-center transition-colors">
                      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                    </div>
                  </div>
                </GlassCard>

              </div>
            </motion.div>
          )}

          {/* Active Workspace View */}
          {activeWorkspace !== "landing" && (
            <motion.div
              key="workspace-view"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-8"
            >
              {/* Back to landing nav header */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveWorkspace("landing")}
                  className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors cursor-pointer group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                  Back to Hub
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Active Zone:</span>
                  <span className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${
                    activeWorkspace === "instagram" ? "bg-pink-500/10 text-pink-400 border border-pink-500/20" :
                    activeWorkspace === "linkedin" ? "bg-sky-500/10 text-sky-400 border border-sky-500/20" :
                    "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {activeWorkspace}
                  </span>
                </div>
              </div>

              {/* Render corresponding workspace */}
              {activeWorkspace === "instagram" && (
                <InstagramWorkspace customApiKey={customApiKey} />
              )}
              {activeWorkspace === "linkedin" && (
                <LinkedInWorkspace customApiKey={customApiKey} />
              )}
              {activeWorkspace === "shorts" && (
                <ShortsWorkspace customApiKey={customApiKey} />
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </section>

      {/* Settings Modal (Custom API Key entry) */}
      <AnimatePresence>
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md overflow-hidden glass-effect rounded-2xl p-6 border-white/10"
            >
              <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
                <Settings className="w-5 h-5 text-violet-400" />
                Gemini API Configuration
              </h3>
              <p className="text-xs text-gray-400 mb-6">
                Your API key is cached locally in your browser’s localStorage. It is only passed to Next.js API routes to trigger strategies and never saved on external servers.
              </p>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Gemini API Key</label>
                  <input
                    type="password"
                    placeholder="AIzaSy..."
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-violet-500/50"
                    value={inputKey}
                    onChange={(e) => setInputKey(e.target.value)}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={handleSaveKey}
                    className="flex-1 bg-gradient-to-r from-violet-500 to-pink-500 hover:from-violet-600 hover:to-pink-600 text-white font-semibold py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Save API Key
                  </button>
                  {customApiKey && (
                    <button
                      onClick={handleClearKey}
                      className="bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 text-red-400 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                    >
                      Clear
                    </button>
                  )}
                  <button
                    onClick={() => setShowSettings(false)}
                    className="bg-white/5 border border-white/5 hover:bg-white/10 text-gray-300 font-semibold px-4 py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

        {/* Premium Footer */}
        <footer className="relative z-10 w-full border-t border-white/5 bg-black/10 py-6 text-center text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Stratify AI. Built for premium B2B growth execution.</p>
        </footer>
      </motion.div>
    </main>
  );
}
