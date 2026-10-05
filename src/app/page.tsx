'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, Calendar, Clock, Laptop, Award, Users, ArrowRight, CheckCircle2, ChevronDown, HelpCircle, ShieldCheck, Zap, Rocket, Terminal, Flame } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import WorkshopRoadmap from '@/components/WorkshopRoadmap';
import GrowthLoopExplainer from '@/components/GrowthLoopExplainer';
import { WORKSHOP_DETAILS, FAQ_ITEMS } from '@/lib/constants';

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [liveStats, setLiveStats] = useState<{ total: number; target: number; percent: number } | null>(null);

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.stats) {
          setLiveStats({
            total: data.stats.totalRegistrations,
            target: data.stats.targetRegistrations,
            percent: data.stats.progressPercentage,
          });
        }
      })
      .catch(() => {});
  }, []);

  return (
    <div className="bg-[#090D16] min-h-screen text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Top Simulation Growth Banner */}
      <div className="bg-gradient-to-r from-blue-900/60 via-slate-900 to-teal-900/60 border-b border-blue-500/20 py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-blue-300">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-semibold text-white">NxtWave Growth Challenge:</span>
            <span>Target: 500 final-year engineers in 7 days (Budget: ₹2,000)</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-xs text-slate-300">
              <span>Progress:</span>
              <span className="text-emerald-400 font-bold">{liveStats ? `${liveStats.total} / ${liveStats.target}` : '328 / 500'}</span>
              <span className="text-slate-400">({liveStats ? `${liveStats.percent}%` : '66%'})</span>
            </div>
            <Link
              href="/admin"
              className="text-[11px] px-2.5 py-0.5 rounded bg-blue-500/20 text-blue-300 hover:text-white hover:bg-blue-500/30 border border-blue-500/30 font-medium transition-colors"
            >
              View Admin Analytics →
            </Link>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section id="workshop" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden bg-grid-pattern">
        {/* Subtle Ambient glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Workshop Pitch */}
            <div className="lg:col-span-7 space-y-6">
              {/* Audience Pill */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Exclusively for Final-Year Engineering Students (Batches 2025 & 2026)</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Build Your First <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-teal-300 to-emerald-400">AI Project</span> in 60 Minutes
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                Tired of generic resume projects? Join senior AI engineers from NxtWave to build and deploy a live <strong>AI Code Review & Vector Copilot</strong> from scratch in one focused masterclass.
              </p>

              {/* Key Value Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Clock className="w-3.5 h-3.5 text-blue-400" />
                    <span>Duration</span>
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">{WORKSHOP_DETAILS.duration}</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Calendar className="w-3.5 h-3.5 text-teal-400" />
                    <span>Live Schedule</span>
                  </div>
                  <div className="font-semibold text-white text-xs sm:text-sm">{WORKSHOP_DETAILS.time}</div>
                </div>

                <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl col-span-2 sm:col-span-1">
                  <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                    <Award className="w-3.5 h-3.5 text-amber-400" />
                    <span>Investment</span>
                  </div>
                  <div className="font-semibold text-emerald-400 text-xs sm:text-sm">100% Free Masterclass</div>
                </div>
              </div>

              {/* Why Final Year Students Love This */}
              <div className="space-y-2.5 pt-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Why you should spend 60 minutes this Sunday:
                </h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Placement Edge:</strong> Walk away with a deployed AI Copilot on your GitHub that directly answers recruiter questions in 2025/2026 tech interviews.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Practical GenAI Stack:</strong> Learn real LLM streaming, prompt engineering, and Vector RAG without theoretical fluff.</span>
                  </div>
                  <div className="flex items-start gap-2.5 text-xs text-slate-200">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span><strong>Student Referral Perks:</strong> Share your unique invite link with college batchmates to unlock 1-on-1 resume teardowns and AI starter kits.</span>
                  </div>
                </div>
              </div>

              {/* Social Proof Bar */}
              <div className="pt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex -space-x-2 overflow-hidden">
                  {['IITM', 'NITK', 'BITS', 'VIT', 'JNTU'].map((col, i) => (
                    <div
                      key={col}
                      className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-slate-800 border-2 border-[#090D16] text-[9px] font-bold text-slate-300 font-mono"
                    >
                      {col}
                    </div>
                  ))}
                </div>
                <div>
                  <span className="text-white font-medium">320+ engineers</span> from top 40+ engineering institutes registered this week.
                </div>
              </div>
            </div>

            {/* Right Column: Registration Form */}
            <div id="register" className="lg:col-span-5 scroll-mt-24">
              <div className="relative">
                {/* Visual badge */}
                <div className="absolute -top-3 right-4 z-10 px-3 py-0.5 rounded-full bg-blue-600 text-white text-[11px] font-semibold uppercase tracking-wider shadow-md">
                  Free Student Pass
                </div>
                <React.Suspense fallback={<div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">Loading registration form...</div>}>
                  <RegistrationForm />
                </React.Suspense>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Curriculum & Roadmap Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <WorkshopRoadmap />
      </section>

      {/* Referral Loop Explainer Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <GrowthLoopExplainer />
      </section>

      {/* Placement & Practical Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 uppercase tracking-wider">
            Career & Placement Impact
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How This Workshop Helps Your Final-Year Placements
          </h2>
          <p className="text-sm text-slate-400">
            Compare what typical college projects provide versus the project you will build in this workshop.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Old way */}
          <div className="bg-slate-950/70 border border-rose-500/20 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-rose-400 uppercase tracking-wider">
                ❌ Typical College Final Year Projects
              </h3>
              <span className="text-xs text-slate-500">Outdated</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Generic E-Commerce or Library Management clones copied from YouTube tutorials.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Recruiters immediately recognize boilerplate templates and skip technical depth.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>Zero real-world AI, LLM streaming, or vector retrieval implementation experience.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-rose-400 font-bold">✕</span>
                <span>No live deployment or active URL on GitHub profile.</span>
              </li>
            </ul>
          </div>

          {/* New way */}
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-4 h-4" />
                <span>What You Build in This 60-Min Workshop</span>
              </h3>
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-mono font-semibold">2025 Placement Ready</span>
            </div>
            <ul className="space-y-3 text-xs text-slate-200">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Modern GenAI Architecture:</strong> Built using LLMs, Semantic Vector Retrieval, and real-time streaming interfaces.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Instant Conversation Starter:</strong> Explaining how you handled token limits and semantic search proves senior-level engineering intuition.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Live GitHub Portfolio:</strong> Deployed on public cloud with clean README architecture diagrams and verified completion certificate.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span><strong>Exclusive Mentorship:</strong> Top student referrers unlock 1-on-1 resume teardowns with NxtWave AI Mentors.</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 border-t border-slate-800/80">
        <div className="text-center mb-8 space-y-2">
          <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 uppercase tracking-wider">
            Frequently Asked Questions
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Got Questions? We’ve Got Answers.
          </h2>
        </div>

        <div className="space-y-3">
          {FAQ_ITEMS.map((faq, index) => {
            const isOpen = openFaq === index;
            return (
              <div
                key={index}
                className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : index)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 text-sm font-semibold text-white hover:text-blue-400 transition-colors"
                >
                  <span className="flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-400 flex-shrink-0" />
                    <span>{faq.question}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 transition-transform flex-shrink-0 ${
                      isOpen ? 'rotate-180 text-blue-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom Sticky/Floating CTA for easy registration */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-gradient-to-r from-blue-900/50 via-slate-900 to-teal-950/50 border border-blue-500/30 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Ready to Build Your First Real AI Project?
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Join 320+ fellow engineering students. Secure your free seat in under 30 seconds and receive your personal referral identity.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <a
                href="#register"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/30 transition-all flex items-center justify-center gap-2"
              >
                <span>Register Now (Free)</span>
                <ArrowRight className="w-4 h-4" />
              </a>
              <Link
                href="/leaderboard"
                className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-4 h-4 text-amber-400" />
                <span>View Campus Leaderboard</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
