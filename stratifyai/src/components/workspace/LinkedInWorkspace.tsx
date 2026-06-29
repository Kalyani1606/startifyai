"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Briefcase, Sparkles, Award, Compass, Send, 
  Copy, Check, FileText, ChevronRight, CheckSquare, Square, Share2
} from "lucide-react";
import GlassCard from "../ui/GlassCard";
import Loader from "../ui/Loader";
import ImageUpload from "../ui/ImageUpload";

interface LinkedInWorkspaceProps {
  customApiKey: string;
}

export default function LinkedInWorkspace({ customApiKey }: LinkedInWorkspaceProps) {
  const [activeTab, setActiveTab] = useState<"thought" | "hooks" | "brand">("thought");
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState("");
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // States for outputs
  const [thoughtData, setThoughtData] = useState<any>(null);
  const [hooksData, setHooksData] = useState<any>(null);
  const [roadmapData, setRoadmapData] = useState<any>(null);
  
  // State to track completed roadmap tasks
  const [completedTasks, setCompletedTasks] = useState<Record<string, boolean>>({});

  // Form Inputs
  const [thoughtForm, setThoughtForm] = useState({ niche: "", audience: "", goal: "Authority Building" });
  const [hooksForm, setHooksForm] = useState({ topic: "", audience: "" });
  const [roadmapForm, setRoadmapForm] = useState({ industry: "", focus: "", goal: "Get inbound clients" });

  const [imageInput, setImageInput] = useState<{ data: string | null, mimeType: string | null }>({ data: null, mimeType: null });
  const [errorMsg, setErrorMsg] = useState("");

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(id);
    setTimeout(() => setCopiedText(null), 2000);
  };

  const toggleTask = (taskId: string) => {
    setCompletedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId]
    }));
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
          platform: "linkedin",
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
      {/* Sub navigation for LinkedIn features */}
      <div className="flex flex-wrap gap-2 border-b border-white/5 pb-4">
        {[
          { id: "thought", label: "Thought Leadership", icon: Award },
          { id: "hooks", label: "Hook Generator", icon: FileText },
          { id: "brand", label: "Brand Roadmap", icon: Compass },
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
                  layoutId="activeLinkedInTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-sky-400 to-blue-500"
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
          <GlassCard hoverGlow={false} className="border-sky-500/10">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" />
              Inputs
            </h3>

            {activeTab === "thought" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Industry / Niche</label>
                  <input
                    type="text"
                    placeholder="e.g. Artificial Intelligence, B2B SaaS"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={thoughtForm.niche}
                    onChange={(e) => setThoughtForm({ ...thoughtForm, niche: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. CTOs, Founders, Product Managers"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={thoughtForm.audience}
                    onChange={(e) => setThoughtForm({ ...thoughtForm, audience: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Primary Goal</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={thoughtForm.goal}
                    onChange={(e) => setThoughtForm({ ...thoughtForm, goal: e.target.value })}
                  >
                    <option value="Authority & Trust Building">Authority & Trust Building</option>
                    <option value="B2B Lead Generation">B2B Lead Generation</option>
                    <option value="Talent Acquisition / Hiring">Talent Acquisition / Hiring</option>
                    <option value="Personal Brand Elevation">Personal Brand Elevation</option>
                  </select>
                </div>
                <div className="pt-2">
                  <ImageUpload key="thought-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Brand visual guidelines / References" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("thoughtLeadership", thoughtForm, setThoughtData, "Analyzing Industry Insights...")}
                  className="w-full mt-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Plan Thought Leadership
                </button>
              </div>
            )}

            {activeTab === "hooks" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Post Topic</label>
                  <input
                    type="text"
                    placeholder="e.g. Why we failed our first launch, coding tips"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={hooksForm.topic}
                    onChange={(e) => setHooksForm({ ...hooksForm, topic: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Target Audience</label>
                  <input
                    type="text"
                    placeholder="e.g. B2B Sales Reps, Entrepreneurs"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={hooksForm.audience}
                    onChange={(e) => setHooksForm({ ...hooksForm, audience: e.target.value })}
                  />
                </div>
                <div className="pt-2">
                  <ImageUpload key="hooks-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Post drafts / References" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("hookGenerator", hooksForm, setHooksData, "Engineering Copywriting Hooks...")}
                  className="w-full mt-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Generate 10 Hooks
                </button>
              </div>
            )}

            {activeTab === "brand" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Industry Focus</label>
                  <input
                    type="text"
                    placeholder="e.g. Product Management, Growth Marketing"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={roadmapForm.industry}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, industry: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Niche Focus Area</label>
                  <input
                    type="text"
                    placeholder="e.g. AI-driven Product Roadmaps"
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={roadmapForm.focus}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, focus: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brand Goal</label>
                  <select
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 px-4 text-sm text-white focus:outline-none focus:border-sky-500/50"
                    value={roadmapForm.goal}
                    onChange={(e) => setRoadmapForm({ ...roadmapForm, goal: e.target.value })}
                  >
                    <option value="Get Inbound Freelance/Consulting Leads">Get Consulting Leads</option>
                    <option value="Double Connection Count & Network">Double Connections</option>
                    <option value="Establish Expert Positioning in Industry">Expert Positioning</option>
                    <option value="Prepare for public speaking/writing">Speaking Gigs</option>
                  </select>
                </div>
                <div className="pt-2">
                  <ImageUpload key="brand-img" onImageSelected={(data, mime) => setImageInput({ data, mimeType: mime })} label="Resume / Current profile screenshots" />
                </div>
                <button
                  disabled={loading}
                  onClick={() => handleGenerate("brandRoadmap", roadmapForm, setRoadmapData, "Creating 30-Day Brand Roadmap...")}
                  className="w-full mt-2 bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white font-medium py-3 px-4 rounded-xl text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-sky-500/10 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  Map Out Brand
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
                className="h-full flex items-center justify-center animate-pulse"
              >
                <GlassCard hoverGlow={false} className="w-full h-full flex items-center justify-center min-h-[400px] border-sky-500/10">
                  <Loader text={loadingMsg} subtext="Gemini is tailoring strategies to stand out on LinkedIn" />
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
                {/* 1. Thought Leadership Result View */}
                {activeTab === "thought" && (
                  <>
                    {thoughtData ? (
                      <div className="space-y-6">
                        <h4 className="text-md font-semibold text-white">Weekly Content Planner</h4>
                        <div className="space-y-4">
                          {thoughtData.weeklyPostIdeas?.map((post: any, idx: number) => (
                            <GlassCard key={idx} hoverGlow={false} className="border-sky-500/10">
                              <div className="flex justify-between items-center mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-400 px-2.5 py-1 rounded-md font-bold">
                                    {post.day}
                                  </span>
                                  <span className="text-[10px] text-gray-400 uppercase tracking-wide">
                                    {post.type}
                                  </span>
                                </div>
                                <button
                                  onClick={() => handleCopy(`Title: ${post.title}\nFormat: ${post.type}\nContent Outline:\n${post.contentOutline}`, `thought-${idx}`)}
                                  className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                                  title="Copy outline"
                                >
                                  {copiedText === `thought-${idx}` ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                                </button>
                              </div>
                              <h5 className="font-semibold text-white text-sm mb-2">{post.title}</h5>
                              <p className="text-xs text-gray-300 whitespace-pre-line leading-relaxed bg-black/25 p-3 rounded-lg border border-white/5">
                                {post.contentOutline}
                              </p>
                            </GlassCard>
                          ))}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Educational Frameworks */}
                          <GlassCard hoverGlow={false} className="border-sky-500/10">
                            <h4 className="text-sm font-semibold text-white mb-3">Educational Frameworks</h4>
                            <div className="space-y-4">
                              {thoughtData.educationalContent?.map((item: any, idx: number) => (
                                <div key={idx} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                  <span className="font-medium text-white text-xs block mb-1">{item.topic}</span>
                                  <p className="text-xs text-gray-400 leading-relaxed">{item.framework}</p>
                                </div>
                              ))}
                            </div>
                          </GlassCard>

                          {/* Industry Insights & Story Starters */}
                          <div className="space-y-6">
                            <GlassCard hoverGlow={false} className="border-sky-500/10">
                              <h4 className="text-sm font-semibold text-white mb-3">Industry Trends to Capture</h4>
                              <div className="space-y-3">
                                {thoughtData.industryInsights?.map((item: any, idx: number) => (
                                  <div key={idx} className="text-xs bg-white/5 p-3 rounded-lg">
                                    <span className="font-bold text-white block mb-1">{item.trend}</span>
                                    <p className="text-gray-400">{item.expertTake}</p>
                                  </div>
                                ))}
                              </div>
                            </GlassCard>

                            <GlassCard hoverGlow={false} className="border-sky-500/10">
                              <h4 className="text-sm font-semibold text-white mb-3">Personal Story Starters</h4>
                              <div className="space-y-3">
                                {thoughtData.personalStoryIdeas?.map((item: any, idx: number) => (
                                  <div key={idx} className="text-xs border-l-2 border-sky-400 pl-3">
                                    <span className="text-gray-400 block">Hook Event:</span>
                                    <p className="font-medium text-white italic">"{item.hookEvent}"</p>
                                    <p className="text-[10px] text-sky-400 mt-1 uppercase font-bold tracking-wider">Lesson: {item.businessLesson}</p>
                                  </div>
                                ))}
                              </div>
                            </GlassCard>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Award className="w-12 h-12 text-sky-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Thought Leadership Roadmap</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Input your professional field details to map out a structured authority positioning planner.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 2. Hooks Result View */}
                {activeTab === "hooks" && (
                  <>
                    {hooksData ? (
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <h4 className="text-md font-semibold text-white">10 Professional Hooks</h4>
                          <span className="text-xs text-gray-400">Click copy on any hook you wish to use</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {hooksData.hooks?.map((hook: any, idx: number) => (
                            <GlassCard key={idx} hoverGlow={true} glowColor="linkedin" className="border-sky-500/10 flex flex-col justify-between">
                              <div>
                                <div className="flex justify-between items-center mb-2">
                                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                                    hook.category === "Curiosity" ? "bg-purple-500/20 text-purple-300" :
                                    hook.category === "Story" ? "bg-amber-500/20 text-amber-300" :
                                    hook.category === "Data-driven" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"
                                  }`}>
                                    {hook.category}
                                  </span>
                                  <span className="text-[10px] text-gray-500">Hook #{idx + 1}</span>
                                </div>
                                <p className="text-sm text-white font-medium leading-relaxed my-3 italic">
                                  "{hook.text}"
                                </p>
                              </div>
                              <div className="border-t border-white/5 pt-3 mt-auto flex items-center justify-between">
                                <span className="text-[10px] text-gray-400 italic">💡 {hook.tip}</span>
                                <button
                                  onClick={() => handleCopy(hook.text, `hook-${idx}`)}
                                  className="text-xs bg-white/5 hover:bg-white/10 text-white rounded p-1.5 transition-colors cursor-pointer"
                                >
                                  {copiedText === `hook-${idx}` ? <Check className="w-3.5 h-3.5 text-green-400" /> : <Copy className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            </GlassCard>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <FileText className="w-12 h-12 text-sky-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">Professional LinkedIn Hooks</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Input a topic and click generate to craft high-performing scroll-stoppers.
                        </p>
                      </div>
                    )}
                  </>
                )}

                {/* 3. Brand Roadmap Result View */}
                {activeTab === "brand" && (
                  <>
                    {roadmapData ? (
                      <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                          {/* 30 Day Milestones */}
                          <div className="md:col-span-4">
                            <GlassCard hoverGlow={false} className="border-sky-500/10 h-full">
                              <h4 className="text-sm font-semibold text-white mb-4">30-Day Milestones</h4>
                              <div className="relative border-l border-white/10 ml-2 pl-4 space-y-6">
                                {roadmapData.roadmap30Days?.map((milestone: any, idx: number) => (
                                  <div key={idx} className="relative">
                                    <div className="absolute -left-[21px] top-1.5 w-2 h-2 rounded-full bg-sky-400" />
                                    <span className="text-[10px] font-bold text-sky-400 block uppercase tracking-wider">{milestone.dayRange}</span>
                                    <p className="text-xs text-white font-medium mt-0.5">{milestone.focus}</p>
                                  </div>
                                ))}
                              </div>
                            </GlassCard>
                          </div>

                          {/* Weekly Tasks Checklist */}
                          <div className="md:col-span-8">
                            <GlassCard hoverGlow={false} className="border-sky-500/10">
                              <h4 className="text-sm font-semibold text-white mb-4">Actionable Growth Checklist</h4>
                              <div className="space-y-6">
                                {roadmapData.weeklyObjectives?.map((weekObj: any, wIdx: number) => (
                                  <div key={wIdx} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <h5 className="text-xs font-bold text-sky-300 uppercase tracking-wider mb-2">Week {weekObj.week}: {weekObj.goal}</h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {weekObj.tasks?.map((task: string, tIdx: number) => {
                                        const taskId = `w${weekObj.week}-t${tIdx}`;
                                        const isDone = !!completedTasks[taskId];
                                        return (
                                          <button
                                            key={tIdx}
                                            onClick={() => toggleTask(taskId)}
                                            className="flex items-start gap-2.5 p-2 rounded-lg bg-white/5 border border-white/5 hover:bg-white/10 transition-colors text-left w-full cursor-pointer"
                                          >
                                            {isDone ? (
                                              <CheckSquare className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                                            ) : (
                                              <Square className="w-4 h-4 text-gray-500 shrink-0 mt-0.5" />
                                            )}
                                            <span className={`text-xs ${isDone ? "line-through text-gray-500" : "text-gray-300"}`}>{task}</span>
                                          </button>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </GlassCard>
                          </div>
                        </div>

                        {/* Stacks for branding elements */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                          <GlassCard hoverGlow={false} className="border-sky-500/10">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Suggested Content Themes</h4>
                            <div className="flex flex-wrap gap-1.5">
                              {roadmapData.contentThemes?.map((theme: string, idx: number) => (
                                <span key={idx} className="text-xs bg-sky-500/10 border border-sky-500/20 text-sky-300 px-2 py-1 rounded-md">
                                  {theme}
                                </span>
                              ))}
                            </div>
                          </GlassCard>

                          <GlassCard hoverGlow={false} className="border-sky-500/10">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Networking Strategy</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              {roadmapData.networkingStrategy?.map((strat: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                                  <span>{strat}</span>
                                </li>
                              ))}
                            </ul>
                          </GlassCard>

                          <GlassCard hoverGlow={false} className="border-sky-500/10">
                            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Engagement Strategy</h4>
                            <ul className="space-y-2 text-xs text-gray-300">
                              {roadmapData.engagementStrategy?.map((strat: string, idx: number) => (
                                <li key={idx} className="flex items-start gap-1.5">
                                  <ChevronRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                                  <span>{strat}</span>
                                </li>
                              ))}
                            </ul>
                          </GlassCard>
                        </div>
                      </div>
                    ) : (
                      <div className="h-full min-h-[400px] border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8">
                        <Compass className="w-12 h-12 text-sky-500/40 mb-4" />
                        <h3 className="text-lg font-medium text-white">LinkedIn Personal Brand Architect</h3>
                        <p className="text-sm text-gray-400 max-w-sm mt-2">
                          Specify your professional goals to formulate a tailored 30-day personal branding roadmap.
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
