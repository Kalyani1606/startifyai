"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Youtube, Sparkles, TrendingUp, RefreshCw, Layers, Send, 
  Copy, Check, Clock, Eye, AlertCircle, FileText, ChevronRight
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Loader from "../ui/Loader";
import ImageUpload from "../ui/ImageUpload";

interface ShortsWorkspaceProps {
  customApiKey: string;
}

export default function ShortsWorkspace({ customApiKey }: ShortsWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"trends" | "retention" | "series">("trends");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States for outputs
  const [trendsData, setTrendsData] = useState<any>(null);
  const [retentionData, setRetentionData] = useState<any>(null);
  const [seriesData, setSeriesData] = useState<any>(null);

  // Form Inputs
  const [trendsForm, setTrendsForm] = useState({ niche: "", country: "United States" });
  const [retentionForm, setRetentionForm] = useState({ script: "" });
  const [seriesForm, setSeriesForm] = useState({ idea: "" });

  const [imageInput, setImageInput] = useState<{ data: string | null, mimeType: string | null }>({ data: null, mimeType: null });
  const [errorMsg, setErrorMsg] = useState("");

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
          platform: "shorts",
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
      {/* Sub navigation for Shorts features */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: "trends", label: "Shorts Trend Finder", icon: TrendingUp },
          { id: "retention", label: "Retention Optimizer", icon: RefreshCw },
          { id: "series", label: "10-Part Series Planner", icon: Layers },
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
                  layoutId="activeShortsTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-red-500 to-pink-600"
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
          <GlassCard hoverGlow={false} className="border-red-500/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-red-400" />
              Inputs
            </h3>

            {activeTab === "trends" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Content Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Finance hacks, cooking hacks"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50"
                    value={trendsForm.niche}
                    onChange={(e) => setTrendsForm({ ...trendsForm, niche: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Country</label>
                  <input
                    type="text"
                    placeholder="e.g. United States, India"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50"
                    value={trendsForm.country}
                    onChange={(e) => setTrendsForm({ ...trendsForm, country: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <ImageUpload key="trends-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Context Image / Thumbnail reference" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("shortsTrend", trendsForm, setTrendsData, "Searching Shorts Trends...")}
                  className="w-full mt-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Analyze Trends
                </button>
              </div>
            )}

            {activeTab === "retention" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Video Script (Draft)</label>
                  <textarea
                    placeholder="Paste your 30-60 second script here..."
                    rows={8}
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-red-500/50 resize-none"
                    value={retentionForm.script}
                    onChange={(e) => setRetentionForm({ ...retentionForm, script: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <ImageUpload key="retention-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Retention chart screenshot / Video storyboard" />
                </div>
                <button
                  disabled={loading || !retentionForm.script.trim()}
                  onClick={() => handleGenerate("retentionOptimizer", retentionForm, setRetentionData, "Running Retention Optimization...")}
                  className="w-full bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Optimize Retention
                </button>
              </div>
            )}

            {activeTab === "series" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Core Content Idea</label>
                  <input
                    type="text"
                    placeholder="e.g. Learning Python in 10 days"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-red-500/50"
                    value={seriesForm.idea}
                    onChange={(e) => setSeriesForm({ ...seriesForm, idea: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <ImageUpload key="series-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Reference Channel Screenshot / Mindmap" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("seriesPlanner", seriesForm, setSeriesData, "Drafting 10-Part Narrative Arc...")}
                  className="w-full mt-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-red-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Plan Series
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
                <GlassCard hoverGlow={false} className="w-full h-full flex items-center justify-center min-h-[400px] border-red-500/10">
                  <Loader text={loadingMsg} subtext="Gemini is analyzing hook performance and retention signals" />
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
                {/* 1. Shorts Trend Finder Result View */}
                {activeTab === "trends" && (
                  <>
                    {trendsData ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Viral Topics */}
                          <GlassCard hoverGlow={false} className="border-red-500/10">
                            <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                              <Youtube className="w-4 h-4 text-red-500" />
                              Shorts Viral Concepts
                            </h4>
                            <div className="space-y-4">
                              {trendsData.viralTopics?.map((topic: any, idx: number) => (
                                <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                  <div className="flex justify-between items-start mb-1">
                                    <span className="font-semibold text-white text-sm">{topic.title}</span>
                                    <span className="text-[10px] bg-red-500/20 text-red-300 px-2 py-0.5 rounded-full font-bold">
                                      {topic.viralPotential} Viral Potential
                                    </span>
                                  </div>
                                  <p className="text-xs text-gray-400">{topic.explanation}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>

                          {/* Trending Formats */}
                          <GlassCard hoverGlow={false} className="border-red-500/10">
                            <h4 className="text-md font-semibold text-white mb-4 flex items-center gap-2">
                              <Layers className="w-4 h-4 text-pink-400" />
                              High-Retention Formats
                            </h4>
                            <div className="space-y-3">
                              {trendsData.trendingFormats?.map((format: any, idx: number) => (
                                <div key={idx} className="bg-white/5 p-3 rounded-xl border border-white/5">
                                  <span className="font-semibold text-white text-xs block mb-1">{format.name}</span>
                                  <p className="text-xs text-gray-400 mb-2">{format.description}</p>
                                  <span className="text-[10px] text-pink-400 font-bold block uppercase tracking-wide">Vibe: {format.referenceStyle}</span>
                                </div>
                              ))}
                            </div>
                          </GlassCard>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          {trendsData.suggestedThumbnails?.map((thumb: any, idx: number) => (
                            <div key={idx} className="relative group rounded-xl overflow-hidden glass-effect border border-white/5 p-4 flex flex-col justify-between h-40">
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent opacity-90 z-0" />
                              <div className="relative z-10">
                                <span className="text-[9px] bg-red-500/20 text-red-300 font-semibold px-2 py-0.5 rounded-md uppercase">Thumbnail Draft #{idx + 1}</span>
                                <p className="text-[11px] text-gray-400 mt-2">{thumb.description}</p>
                              </div>
                              <div className="relative z-10 border-t border-white/10 pt-2">
                                <span className="text-[9px] text-gray-500 block uppercase font-medium">Text Overlay</span>
                                <p className="text-sm font-black text-amber-300 uppercase tracking-tight font-sans mt-0.5">"{thumb.overlayText}"</p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Upload Schedule */}
                        <GlassCard hoverGlow={false} className="border-red-500/10 flex items-center gap-4">
                          <Clock className="w-8 h-8 text-red-400 shrink-0" />
                          <div>
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Suggested Shorts Posting Windows</h4>
                            <p className="text-xs text-white mt-1 font-medium">{trendsData.bestUploadTime}</p>
                          </div>
                        </GlassCard>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Youtube className="w-12 h-12 text-red-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Shorts Trend Finder</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Define a content niche and country on the left to locate viral YouTube Shorts script setups and layouts.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 2. Retention Optimizer Result View */}
                {activeTab === "retention" && (
                  <>
                    {retentionData ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Improved First 5 Seconds */}
                          <GlassCard hoverGlow={false} className="border-red-500/10">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-red-400" />
                              Optimized Intro (First 5s)
                            </h4>
                            <p className="text-xs text-gray-400 mb-3">Re-engineered verbal hooks and visual queues:</p>
                            <p className="text-sm text-white italic bg-black/25 p-3 rounded-xl border border-white/5 leading-relaxed font-serif">
                              "{retentionData.improvedFirstFiveSeconds}"
                            </p>
                            <button
                              onClick={() => handleCopy(retentionData.improvedFirstFiveSeconds, "intro-opt")}
                              className="mt-4 w-full bg-white/5 border border-white/5 hover:bg-white/10 text-white rounded-lg py-2 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                            >
                              {copiedText === "intro-opt" ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                              Copy Intro Script
                            </button>
                          </GlassCard>

                          {/* Hook Recommendations */}
                          <GlassCard hoverGlow={false} className="border-red-500/10">
                            <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                              <FileText className="w-4 h-4 text-pink-400" />
                              Alternate Scroll-Stoppers
                            </h4>
                            <p className="text-xs text-gray-400 mb-3">Varying hooks depending on audience focus:</p>
                            <p className="text-sm text-gray-300 font-medium whitespace-pre-line bg-black/25 p-3 rounded-xl border border-white/5 italic">
                              {retentionData.betterHook}
                            </p>
                          </GlassCard>
                        </div>

                        {/* Timeline retention updates */}
                        <GlassCard hoverGlow={false} className="border-red-500/10">
                          <h4 className="text-sm font-semibold text-white mb-4">Retention Correction Timeline</h4>
                          <div className="space-y-4">
                            {retentionData.retentionSuggestions?.map((item: any, idx: number) => (
                              <div key={idx} className="flex gap-4 border-b border-white/5 pb-3 last:border-0 last:pb-0 text-xs">
                                <div className="bg-red-500/10 border border-red-500/20 text-red-300 px-3 py-1.5 rounded-lg font-mono font-bold shrink-0 self-start">
                                  {item.timestampRange}
                                </div>
                                <div className="space-y-1">
                                  <p className="text-gray-400">
                                    <strong className="text-gray-300 uppercase text-[9px] block">Potential Retention Drop Reason</strong>
                                    {item.issue}
                                  </p>
                                  <p className="text-emerald-400 font-medium">
                                    <strong className="text-emerald-500 uppercase text-[9px] block">Retention-boosting Edit</strong>
                                    {item.solution}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </GlassCard>

                        {/* Watch Time Checklists */}
                        <GlassCard hoverGlow={false} className="border-red-500/10">
                          <h4 className="text-sm font-semibold text-white mb-3">Engagement Loop & Watch Time Tips</h4>
                          <ul className="space-y-2">
                            {retentionData.watchTimeOptimization?.map((tip: string, idx: number) => (
                              <li key={idx} className="text-xs text-gray-300 flex items-start gap-1.5">
                                <ChevronRight className="w-4 h-4 text-red-400 shrink-0" />
                                <span>{tip}</span>
                              </li>
                            ))}
                          </ul>
                        </GlassCard>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <AlertCircle className="w-12 h-12 text-red-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Retention Optimizer Engine</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Paste your current draft video script on the left. We'll identify areas where viewers drop off and inject hooks and loop designs.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 3. Series Planner Result View */}
                {activeTab === "series" && (
                  <>
                    {seriesData ? (
                      <div className="space-y-6">
                        <GlassCard hoverGlow={false} className="border-red-500/10 bg-gradient-to-r from-red-500/5 to-transparent">
                          <h4 className="text-lg font-bold text-white mb-1">{seriesData.seriesName}</h4>
                          <p className="text-xs text-red-400 font-bold uppercase tracking-wider mb-3">Series Narrative Blueprint</p>
                          <p className="text-xs text-gray-300 leading-relaxed mb-2"><strong>Story Arc Progression:</strong> {seriesData.storyProgression}</p>
                          <p className="text-xs text-gray-400"><strong>Pacing recommendation:</strong> {seriesData.publishingSchedule}</p>
                        </GlassCard>

                        <h4 className="text-sm font-semibold text-white">10 Episodes Sequence</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {seriesData.episodes?.map((ep: any, idx: number) => (
                            <GlassCard key={idx} hoverGlow={false} className="border-red-500/10 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-3">
                                  <span className="text-[10px] bg-red-500/10 border border-red-500/20 text-red-300 px-2 py-0.5 rounded-md font-bold uppercase">
                                    Episode {ep.episodeNumber}
                                  </span>
                                  <button
                                    onClick={() => handleCopy(`Episode ${ep.episodeNumber}: ${ep.title}\nHook: ${ep.hook}\nPlot Points:\n${ep.plotPoints}\nCTA: ${ep.CTA}`, `ep-${idx}`)}
                                    className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                  >
                                    {copiedText === `ep-${idx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                                <h5 className="font-semibold text-white text-sm mb-2">{ep.title}</h5>
                                <div className="space-y-2 text-xs">
                                  <div>
                                    <span className="text-[9px] text-gray-500 block uppercase font-bold">Hook Line</span>
                                    <p className="text-gray-300 italic">"{ep.hook}"</p>
                                  </div>
                                  <div>
                                    <span className="text-[9px] text-gray-500 block uppercase font-bold">Script Beats</span>
                                    <p className="text-gray-400 whitespace-pre-line">{ep.plotPoints}</p>
                                  </div>
                                  <div className="pt-2 border-t border-white/5">
                                    <span className="text-[9px] text-red-400 block uppercase font-bold">Call to Action (CTA)</span>
                                    <p className="text-gray-300 font-medium">{ep.CTA}</p>
                                  </div>
                                </div>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Layers className="w-12 h-12 text-red-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Shorts Series Planner</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Input a single seed topic. We will structure it into a 10-episode YouTube Shorts series narrative with scripts, titles, and hooks.
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
