"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  TrendingUp, Sparkles, Music, Calendar, Zap, 
  Send, Copy, Check, ChevronDown, ChevronUp, Globe, Target, Briefcase, Languages
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Loader from "../ui/Loader";
import ImageUpload from "../ui/ImageUpload";

interface InstagramWorkspaceProps {
  customApiKey: string;
}

export default function InstagramWorkspace({ customApiKey }: InstagramWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"trends" | "songs" | "strategy" | "optimizer">("trends");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);
  
  // States for outputs
  const [trendData, setTrendData] = useState<any>(null);
  const [songsData, setSongsData] = useState<any>(null);
  const [strategyData, setStrategyData] = useState<any>(null);
  const [optimizerData, setOptimizerData] = useState<any>(null);
  
  // State for Accordion in Suggested Reels
  const [expandedReelIndex, setExpandedReelIndex] = useState<number | null>(null);

  // Form Inputs
  const [trendsForm, setTrendsForm] = useState({ category: "", audience: "", country: "United States" });
  const [songsForm, setSongsForm] = useState({ language: "English", niche: "" });
  const [strategyForm, setStrategyForm] = useState({ businessName: "", businessType: "", goal: "Brand Growth", frequency: "Weekly" });
  const [optimizerForm, setOptimizerForm] = useState({ topic: "", goal: "High Engagement" });

  const [imageInput, setImageInput] = useState<{ data: string | null, mimeType: string | null }>({ data: null, mimeType: null });
  const [errorMsg, setErrorMsg] = useState("");

  const getSpotifyEmbedUrl = (lang: string) => {
    switch (lang.toLowerCase()) {
      case "hindi":
        return "https://open.spotify.com/embed/playlist/1saCqPsl314giXN0GLWgLj?utm_source=generator&si=87c517e0e53d41ff";
      case "english":
        return "https://open.spotify.com/embed/playlist/5muSk2zfQ3LI70S64jbrX7?utm_source=generator&si=43cf912995674df3";
      case "kannada":
        return "https://open.spotify.com/embed/playlist/1LJeGEI2oL4SKIGxxhAUFO?utm_source=generator&si=54426049b95a4e5e";
      default:
        return null;
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const handleGenerate = async (feature: string, inputs: any, setOutput: (data: any) => void, msg: string) => {
    setLoading(true);
    setLoadingMsg(msg);
    setErrorMsg("");
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platform: "instagram",
          feature,
          inputs,
          image: imageInput.data ? imageInput : null,
          customApiKey,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Failed to generate strategy.");
      }
      setOutput(data);
    } catch (err: any) {
      setErrorMsg(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Sub navigation for Instagram features */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: "trends", label: "Trend Predictor", icon: TrendingUp },
          { id: "songs", label: "Trending Songs", icon: Music },
          { id: "strategy", label: "Strategy Planner", icon: Calendar },
          { id: "optimizer", label: "Growth Optimizer", icon: Zap },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setErrorMsg("");
                setImageInput({ data: null, mimeType: null });
              }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-300 relative ${
                isActive ? "text-white" : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
              {isActive && (
                <motion.div
                  layoutId="activeInstaTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-violet-500"
                />
              )}
            </button>
          );
        })}
      </div>

      {errorMsg && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg("")} className="text-xs underline hover:no-underline">Dismiss</button>
        </div>
      )}

      {/* Forms and Results Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-4 space-y-6">
          <GlassCard hoverGlow={false} className="border-pink-500/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-pink-500" />
              Inputs
            </h3>

            {/* Render form based on active tab */}
            {activeTab === "trends" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business Category</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Vegan Bakery, SaaS Tool"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                      value={trendsForm.category}
                      onChange={(e) => setTrendsForm({ ...trendsForm, category: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Audience</label>
                  <div className="relative">
                    <Target className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. Gen-Z foodies, Developers"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                      value={trendsForm.audience}
                      onChange={(e) => setTrendsForm({ ...trendsForm, audience: e.target.value })}
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Country</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <input
                      type="text"
                      placeholder="e.g. United States, India"
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                      value={trendsForm.country}
                      onChange={(e) => setTrendsForm({ ...trendsForm, country: e.target.value })}
                    />
                  </div>
                </div>
                <div className="pt-2">
                  <ImageUpload key="trends-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Context Image / Screenshot" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("trendPredictor", trendsForm, setTrendData, "Analyzing Trends & Competitors...")}
                  className="w-full mt-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Analyze Trends
                </button>
              </div>
            )}

            {activeTab === "songs" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Language</label>
                  <div className="relative">
                    <Languages className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                    <select
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-pink-500/50 appearance-none"
                      value={songsForm.language}
                      onChange={(e) => setSongsForm({ ...songsForm, language: e.target.value })}
                    >
                      <option value="English">English (Global Hits)</option>
                      <option value="Hindi">Hindi (Bollywood Vibe)</option>
                      <option value="Kannada">Kannada (Sandalwood Trends)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Travel, Comedy, Tech, Fitness"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={songsForm.niche}
                    onChange={(e) => setSongsForm({ ...songsForm, niche: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <ImageUpload key="songs-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Audio Context Reference" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("trendingSongs", songsForm, setSongsData, "Scanning Instagram Audio Trends...")}
                  className="w-full mt-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Find Trending Audios
                </button>
              </div>
            )}

            {activeTab === "strategy" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business Name</label>
                  <input
                    type="text"
                    placeholder="e.g. FitLife Coaching"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={strategyForm.businessName}
                    onChange={(e) => setStrategyForm({ ...strategyForm, businessName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Business Type</label>
                  <input
                    type="text"
                    placeholder="e.g. Gym franchise, personal trainer"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={strategyForm.businessType}
                    onChange={(e) => setStrategyForm({ ...strategyForm, businessType: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Primary Goal</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={strategyForm.goal}
                    onChange={(e) => setStrategyForm({ ...strategyForm, goal: e.target.value })}
                  >
                    <option value="Get Clients / Leads">Get Clients / Leads</option>
                    <option value="Brand Awareness">Brand Awareness</option>
                    <option value="Increase Engagement">Increase Engagement</option>
                    <option value="Drive Sales / Traffic">Drive Sales / Traffic</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Posting Frequency</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={strategyForm.frequency}
                    onChange={(e) => setStrategyForm({ ...strategyForm, frequency: e.target.value })}
                  >
                    <option value="Weekly">Weekly (7-Day Plan)</option>
                    <option value="Monthly">Monthly (15-Post Plan)</option>
                  </select>
                </div>
                <div className="pt-2">
                  <ImageUpload key="strategy-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Brand Assets Reference" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("contentStrategy", strategyForm, setStrategyData, "Generating Content Strategy & Pillars...")}
                  className="w-full mt-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Generate Calendar
                </button>
              </div>
            )}

            {activeTab === "optimizer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Topic or Idea</label>
                  <textarea
                    placeholder="e.g. 5 simple breakfast ideas for fat loss in under 10 minutes"
                    rows={4}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-pink-500/50 resize-none"
                    value={optimizerForm.topic}
                    onChange={(e) => setOptimizerForm({ ...optimizerForm, topic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Platform Goal</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-pink-500/50"
                    value={optimizerForm.goal}
                    onChange={(e) => setOptimizerForm({ ...optimizerForm, goal: e.target.value })}
                  >
                    <option value="Viral Reach / Shares">Viral Reach / Shares</option>
                    <option value="Comments / Conversation">Comments / Conversation</option>
                    <option value="Saves / High Value">Saves / High Value</option>
                    <option value="Direct Messages (DMs) Leads">Direct Messages (DMs) Leads</option>
                  </select>
                </div>
                <div className="pt-2">
                  <ImageUpload key="opt-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Reference Post / Creative" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("growthOptimizer", optimizerForm, setOptimizerData, "Crafting Hooks & Copywriting optimization...")}
                  className="w-full mt-2 bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-pink-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Optimize Growth Copy
                </button>
              </div>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Dynamic Output */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loader"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="h-full flex items-center justify-center"
              >
                <GlassCard hoverGlow={false} className="w-full h-full flex items-center justify-center min-h-[400px] border-pink-500/10">
                  <Loader text={loadingMsg} />
                </GlassCard>
              </motion.div>
            ) : (
              <motion.div
                key="output"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                {/* 1. Trend Predictor Result View */}
                {activeTab === "trends" && (
                  <>
                    {trendData ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Trending Topics */}
                          <GlassCard hoverGlow={false} className="border-pink-500/10">
                            <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-pink-500" />
                              Predictive Trending Topics
                            </h4>
                            <div className="space-y-4">
                              {trendData.trendingTopics?.map((topic: any, idx: number) => (
                                <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-medium text-white text-sm">{topic.title}</span>
                                    <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider bg-pink-500/20 text-pink-400">
                                      {topic.relevanceScore} Relevance
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400">{topic.description}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>

                          {/* Viral Opportunities */}
                          <GlassCard hoverGlow={false} className="border-pink-500/10">
                            <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-violet-400" />
                              Viral Opportunities
                            </h4>
                            <div className="space-y-3">
                              {trendData.viralOpportunities?.map((opp: any, idx: number) => (
                                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <div className="flex justify-between items-center mb-1">
                                    <span className="font-semibold text-white text-xs">{opp.angle}</span>
                                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-md font-medium">{opp.type}</span>
                                  </div>
                                  <p className="text-xs text-gray-400">{opp.concept}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </div>

                        {/* Suggested Reels (Accordion style) */}
                        <GlassCard hoverGlow={false} className="border-pink-500/10">
                          <h4 className="text-md font-semibold text-white mb-4">Suggested Reel Script Angles</h4>
                          <div className="space-y-3">
                            {trendData.suggestedReels?.map((reel: any, idx: number) => {
                              const isOpen = expandedReelIndex === idx;
                              return (
                                <div key={idx} className="border border-white/5 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => setExpandedReelIndex(isOpen ? null : idx)}
                                    className="w-full bg-white/5 p-4 flex justify-between items-center text-left hover:bg-white/10 transition-colors"
                                  >
                                    <div>
                                      <h5 className="font-semibold text-white text-sm">{reel.title}</h5>
                                      <p className="text-xs text-pink-400 mt-1">{reel.audioConcept}</p>
                                    </div>
                                    {isOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
                                  </button>
                                  {isOpen && (
                                    <div className="p-4 bg-black/20 border-t border-white/5 space-y-3">
                                      <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Hook</span>
                                        <p className="text-xs text-gray-200 mt-1 italic font-serif">"{reel.hook}"</p>
                                      </div>
                                      <div>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Visual & Verbal Flow</span>
                                        <p className="text-xs text-gray-400 mt-1 whitespace-pre-line">{reel.visualScript}</p>
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </GlassCard>

                        {/* Hashtags and Competitors */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <GlassCard hoverGlow={false} className="border-pink-500/10">
                            <h4 className="text-sm font-semibold text-white mb-3">Trending Hashtags</h4>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {trendData.trendingHashtags?.map((ht: any, idx: number) => (
                                <button
                                  key={idx}
                                  onClick={() => handleCopy(ht.tag, `ht-${idx}`)}
                                  className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-pink-500/20 transition-all cursor-pointer"
                                >
                                  {ht.tag}
                                  {copiedText === `ht-${idx}` ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
                                </button>
                              ))}
                            </div>
                            <div className="text-xs text-gray-400 bg-white/5 p-3 rounded-lg">
                              <strong>Strategy Note:</strong> Mix these 3-5 trending tags with your niche specific tags.
                            </div>
                          </GlassCard>

                          <GlassCard hoverGlow={false} className="border-pink-500/10">
                            <h4 className="text-sm font-semibold text-white mb-3">Competitor Insights & Takeaways</h4>
                            <div className="space-y-3">
                              {trendData.competitorInsights?.map((item: any, idx: number) => (
                                <div key={idx} className="text-xs border-l-2 border-pink-500 pl-3">
                                  <p className="font-semibold text-white">{item.benchmark}</p>
                                  <p className="text-gray-400 mt-0.5">{item.keyTakeaway}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <TrendingUp className="w-12 h-12 text-pink-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Trend Predictor Dashboard</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Configure your category, audience, and country on the left to predict upcoming Instagram trends.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 2. Trending Songs Result View */}
                {activeTab === "songs" && (
                  <>
                    {songsData ? (
                      <div className="space-y-6">
                        {songsData.isAiGeneratedSignal && (
                          <div className="bg-amber-500/10 border border-amber-500/20 text-amber-300 p-4 rounded-xl text-xs">
                            <strong>AI Simulated Trend Feed:</strong> Instagram's live audio APIs are closed. The recommendations below are simulated using current global content patterns, viral signals, and niche-specific growth metrics.
                          </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {(() => {
                            const song = songsData.trendingSongs?.[0];
                            return (
                              <>
                                {/* Spotify Single Track Player Column */}
                                <div className="md:col-span-5 flex flex-col justify-center">
                                  <div className="text-sm text-pink-400 font-bold mb-3 flex flex-col items-center gap-1 md:items-start text-center md:text-left">
                                    <div className="flex items-center gap-1.5">
                                      <Sparkles className="w-4 h-4 animate-pulse text-pink-500" />
                                      <span>This is the best trending song for your niche!</span>
                                    </div>
                                    <span className="text-xs text-gray-300 font-normal mt-1 leading-relaxed">
                                      This is the best trending song: <strong className="text-white">"{song.songName}"</strong> by <strong className="text-white">{song.artist}</strong>.
                                    </span>
                                  </div>
                                  {song?.spotifyTrackId ? (
                                    <div className="h-[352px] rounded-xl overflow-hidden border border-white/5 bg-black/25">
                                      <iframe
                                        data-testid="embed-iframe"
                                        style={{ borderRadius: "12px" }}
                                        src={`https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator&autoplay=1`}
                                        width="100%"
                                        height="352"
                                        frameBorder="0"
                                        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                                        loading="lazy"
                                      ></iframe>
                                    </div>
                                  ) : (
                                    <div className="h-[352px] rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500">
                                      Track Player Unavailable
                                    </div>
                                  )}
                                </div>

                                {/* Recommended Song details card */}
                                <div className="md:col-span-7 flex flex-col">
                                  {song ? (
                                    <GlassCard hoverGlow={true} glowColor="instagram" className="border-pink-500/10 flex flex-col justify-between h-full min-h-[352px]">
                                      <div>
                                        <div className="flex justify-between items-start mb-2">
                                          <div>
                                            <h4 className="font-semibold text-white text-sm">{song.songName}</h4>
                                            <p className="text-xs text-gray-400">{song.artist}</p>
                                          </div>
                                          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                            song.trendStatus === "Viral" ? "bg-red-500/20 text-red-400" : "bg-green-500/20 text-green-400"
                                          }`}>
                                            {song.trendStatus}
                                          </span>
                                        </div>
                                        <div className="mt-4 space-y-2">
                                          <div className="text-xs">
                                            <span className="text-[10px] text-gray-500 block font-semibold">MATCH REASON</span>
                                            <p className="text-gray-300">{song.matchReason}</p>
                                          </div>
                                          <div className="text-xs bg-white/5 p-3 rounded-xl border border-white/5">
                                            <span className="text-[10px] text-pink-400 block font-bold">REEL IDEA</span>
                                            <p className="text-gray-300 mt-1 italic">"{song.reelIdea}"</p>
                                          </div>
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 mt-4">
                                        <button
                                          onClick={() => handleCopy(`${song.songName} by ${song.artist}`, `song-cop`)}
                                          className="bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                        >
                                          {copiedText === `song-cop` ? (
                                            <>
                                              <Check className="w-3.5 h-3.5 text-green-400" /> Copied
                                            </>
                                          ) : (
                                            <>
                                              <Copy className="w-3.5 h-3.5" /> Copy Title
                                            </>
                                          )}
                                        </button>
                                        <button
                                          onClick={() => handleGenerate("trendingSongs", { ...songsForm, exclude: song.songName }, setSongsData, "Finding Next Song...")}
                                          className="bg-pink-500/10 border border-pink-500/20 hover:bg-pink-500/20 text-pink-300 rounded-lg py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                                        >
                                          Next Song ➡️
                                        </button>
                                      </div>
                                    </GlassCard>
                                  ) : (
                                    <div className="h-full min-h-[352px] rounded-xl border border-dashed border-white/10 flex items-center justify-center text-xs text-gray-500">
                                      Recommendation details unavailable
                                    </div>
                                  )}
                                </div>
                              </>
                            );
                          })()}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Music className="w-12 h-12 text-pink-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Trending Audios Feed</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Select a language and target niche on the left to identify viral sounds and matching reel concepts.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 3. Strategy Planner Result View */}
                {activeTab === "strategy" && (
                  <>
                    {strategyData ? (
                      <div className="space-y-6">
                        {/* Pillars */}
                        <GlassCard hoverGlow={false} className="border-pink-500/10">
                          <h4 className="text-md font-semibold text-white mb-4">Core Content Pillars</h4>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {strategyData.contentPillars?.map((pillar: any, idx: number) => (
                              <div key={idx} className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                                <div className="w-8 h-8 rounded-full bg-pink-500/20 text-pink-400 flex items-center justify-center mx-auto mb-2 text-xs font-bold">
                                  {idx + 1}
                                </div>
                                <h5 className="font-semibold text-white text-sm">{pillar.name}</h5>
                                <p className="text-xs text-gray-400 mt-1">{pillar.description}</p>
                              </div>
                            ))}
                          </div>
                        </GlassCard>

                        {/* Calendar */}
                        <h4 className="text-md font-semibold text-white">Interactive Content Calendar</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {strategyData.calendar?.map((post: any, idx: number) => (
                            <GlassCard key={idx} hoverGlow={false} className="border-pink-500/10 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-400 px-2.5 py-1 rounded-md font-medium">
                                    {post.day}
                                  </span>
                                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                                    post.format === "Reel" ? "bg-violet-500/20 text-violet-300" :
                                    post.format === "Carousel" ? "bg-blue-500/20 text-blue-300" : "bg-amber-500/20 text-amber-300"
                                  }`}>
                                    {post.format}
                                  </span>
                                </div>
                                <h5 className="font-semibold text-white text-sm mb-2">{post.topic}</h5>
                                <p className="text-xs text-gray-300 mb-3">{post.concept}</p>
                                <div className="border-t border-white/5 pt-3 mt-3 space-y-2">
                                  <p className="text-xs text-gray-400"><strong>Visual Cue:</strong> {post.visualCue}</p>
                                  <div className="bg-black/20 p-2.5 rounded-lg text-xs text-gray-300 italic">
                                    "{post.captionOutline}"
                                  </div>
                                </div>
                              </div>
                              <button
                                onClick={() => handleCopy(`Topic: ${post.topic}\nFormat: ${post.format}\nConcept: ${post.concept}\nVisual Cue: ${post.visualCue}\nCaption Outline: ${post.captionOutline}`, `post-${idx}`)}
                                className="mt-4 w-full bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                              >
                                {copiedText === `post-${idx}` ? (
                                  <>
                                    <Check className="w-3.5 h-3.5 text-green-400" /> Copied Post details
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3.5 h-3.5" /> Copy Post Plan
                                  </>
                                )}
                              </button>
                            </GlassCard>
                          ))}
                        </div>

                        {/* Best Posting Schedule */}
                        <GlassCard hoverGlow={false} className="border-pink-500/10">
                          <h4 className="text-sm font-semibold text-white mb-2">Suggested Posting Schedule</h4>
                          <p className="text-xs text-gray-400 leading-relaxed">{strategyData.postingSchedule}</p>
                        </GlassCard>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Calendar className="w-12 h-12 text-pink-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Social Calendar Planner</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Specify your brand properties and goal on the left to map out a professional, structured posting calendar.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 4. Growth Optimizer Result View */}
                {activeTab === "optimizer" && (
                  <>
                    {optimizerData ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Left Column: Hook and Caption */}
                          <div className="md:col-span-2 space-y-6">
                            <GlassCard hoverGlow={false} className="border-pink-500/10">
                              <div className="flex justify-between items-center mb-4">
                                <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                                  <Sparkles className="w-4 h-4 text-pink-500" />
                                  Generated Hook & Caption
                                </h4>
                                <button
                                  onClick={() => handleCopy(`${optimizerData.hook}\n\n${optimizerData.caption}\n\n${optimizerData.hashtags?.join(" ")}`, "full-opt")}
                                  className="text-xs bg-pink-500/10 border border-pink-500/20 text-pink-300 px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 hover:bg-pink-500/20 transition-all cursor-pointer"
                                >
                                  {copiedText === "full-opt" ? (
                                    <>
                                      <Check className="w-3 h-3 text-green-400" /> Copied Everything
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" /> Copy Caption
                                    </>
                                  )}
                                </button>
                              </div>
                              
                              <div className="space-y-4 text-sm">
                                <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="text-[10px] text-pink-400 block font-bold uppercase tracking-wider mb-1">Visual Hook Line</span>
                                  <p className="text-white font-medium italic">"{optimizerData.hook}"</p>
                                </div>
                                
                                <div>
                                  <span className="text-[10px] text-gray-500 block font-semibold uppercase tracking-wider mb-1">Full Caption Copy</span>
                                  <div className="bg-black/20 p-4 rounded-xl border border-white/5 text-gray-300 whitespace-pre-wrap leading-relaxed">
                                    {optimizerData.caption}
                                  </div>
                                </div>

                                <div>
                                  <span className="text-[10px] text-gray-500 block font-semibold uppercase tracking-wider mb-1">CTA (Call-to-Action)</span>
                                  <p className="text-violet-300 font-semibold">{optimizerData.cta}</p>
                                </div>
                              </div>
                            </GlassCard>
                          </div>

                          {/* Right Column: Meta details */}
                          <div className="space-y-6">
                            {/* Best Posting Window */}
                            <GlassCard hoverGlow={false} className="border-pink-500/10">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Optimized Posting Window</h4>
                              <p className="text-sm font-semibold text-white">{optimizerData.bestPostingTime}</p>
                            </GlassCard>

                            {/* Hashtags list */}
                            <GlassCard hoverGlow={false} className="border-pink-500/10">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Hashtags Stack</h4>
                              <div className="flex flex-wrap gap-1.5">
                                {optimizerData.hashtags?.map((tag: string, idx: number) => (
                                  <span key={idx} className="text-xs bg-white/5 border border-white/5 text-gray-300 px-2 py-1 rounded-md">
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            </GlassCard>

                            {/* Engagement Tips */}
                            <GlassCard hoverGlow={false} className="border-pink-500/10">
                              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Engagement Strategy</h4>
                              <ul className="space-y-2">
                                {optimizerData.engagementTips?.map((tip: string, idx: number) => (
                                  <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500 mt-1.5 shrink-0" />
                                    <span>{tip}</span>
                                  </li>
                                ))}
                              </ul>
                            </GlassCard>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Zap className="w-12 h-12 text-pink-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Growth Copy Optimizer</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Input your primary topic and click optimize. We'll generate hooks, formatted caption spacing, CTAs, hashtags, and engagement tips.
                        </p>
                      </div>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
