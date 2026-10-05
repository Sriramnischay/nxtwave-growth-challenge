'use client';

import React from 'react';
import { Terminal, Cpu, Database, Layout, GitBranch, Sparkles, CheckCircle2 } from 'lucide-react';

export default function WorkshopRoadmap() {
  const roadmap = [
    {
      time: "00:00 - 00:15",
      title: "Foundation & Modern AI Stack Setup",
      focus: "LLM APIs & Prompt Engineering",
      icon: Cpu,
      points: [
        "Connecting to Gemini / OpenAI APIs with streaming responses",
        "Structuring system instructions for code analysis and AST parsing",
        "Understanding token optimization and latency reduction",
      ],
      tag: "Part 1: Engine",
    },
    {
      time: "00:15 - 00:35",
      title: "Vector Embeddings & Retrieval (RAG)",
      focus: "Context Injection & Vector DB",
      icon: Database,
      points: [
        "Chunking source code repositories into semantic vector chunks",
        "Calculating vector embeddings & performing top-k cosine similarity",
        "Building a grounded Copilot that understands custom codebases",
      ],
      tag: "Part 2: Knowledge",
    },
    {
      time: "00:35 - 00:50",
      title: "Interactive Fullstack UI & Copilot Actions",
      focus: "Frontend & Real-time Streaming",
      icon: Layout,
      points: [
        "Crafting a responsive developer cockpit with syntax highlighting",
        "Diff viewer for automated code refactoring & bug fixing",
        "1-click explanation generation for complex algorithms",
      ],
      tag: "Part 3: Interface",
    },
    {
      time: "00:50 - 01:00",
      title: "Deploying to GitHub & Resume Showcase",
      focus: "Portfolio & Placement Impact",
      icon: GitBranch,
      points: [
        "Live deployment via Vercel / Railway with custom README badges",
        "How to articulate this AI Copilot in technical campus interviews",
        "Claiming your official verified NxtWave Certificate of Completion",
      ],
      tag: "Part 4: Launch",
    },
  ];

  return (
    <div id="syllabus" className="py-12 border-t border-slate-800/80">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 border border-teal-500/20 uppercase tracking-wider">
          Curriculum Breakdown
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          What You Will Build in 60 Minutes
        </h2>
        <p className="text-sm text-slate-400">
          No endless slides. We open VS Code and build an end-to-end AI Code Reviewer & Copilot live.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {roadmap.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-colors flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-mono text-blue-400 font-semibold px-2.5 py-0.5 rounded bg-blue-500/10 border border-blue-500/20">
                    ⏱️ {item.time}
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">{item.tag}</span>
                </div>

                <div className="flex items-center gap-2.5 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400 flex-shrink-0">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="text-xs text-slate-400 font-medium">{item.focus}</p>
                  </div>
                </div>

                <ul className="space-y-2 mt-3 pt-3 border-t border-slate-800/80">
                  {item.points.map((pt, pIdx) => (
                    <li key={pIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </div>

      {/* Project Output Showcase Box */}
      <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-teal-950/40 border border-blue-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <Sparkles className="w-4 h-4 text-blue-400" />
            <h4 className="text-sm font-bold text-white">Final Tangible Takeaway</h4>
          </div>
          <p className="text-xs text-slate-300 max-w-xl">
            A deployed, public GitHub repository + live URL of your AI Copilot that you can link on your LinkedIn profile and resume for 2025/2026 software placements.
          </p>
        </div>
        <a
          href="#register"
          className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg whitespace-nowrap transition-colors"
        >
          Claim Your Spot Now
        </a>
      </div>
    </div>
  );
}
