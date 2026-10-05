'use client';

import React from 'react';
import { UserCheck, Share2, Users, Trophy, ArrowRight, Zap, Gift, ShieldAlert } from 'lucide-react';

export default function GrowthLoopExplainer() {
  const steps = [
    {
      step: "01",
      title: "Register & Get Link",
      icon: UserCheck,
      description: "Sign up in 30 seconds. Your unique referral identity (e.g. NXT-A7K92) is generated immediately.",
      color: "text-blue-400",
      bg: "bg-blue-500/10 border-blue-500/20",
    },
    {
      step: "02",
      title: "Share with Batchmates",
      icon: Share2,
      description: "1-click WhatsApp share with pre-crafted, genuine student messages for college study groups.",
      color: "text-teal-400",
      bg: "bg-teal-500/10 border-teal-500/20",
    },
    {
      step: "03",
      title: "Automatic Attribution",
      icon: Users,
      description: "When peers register with your link, your count auto-increments. Self-referrals & duplicates are strictly blocked.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10 border-indigo-500/20",
    },
    {
      step: "04",
      title: "Climb & Unlock Perks",
      icon: Trophy,
      description: "Unlock AI repositories, 1-on-1 resume reviews, and top the campus leaderboard for internship referrals.",
      color: "text-amber-400",
      bg: "bg-amber-500/10 border-amber-500/20",
    },
  ];

  return (
    <div id="referral-loop" className="py-12">
      <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
        <span className="text-xs font-semibold px-2.5 py-1 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase tracking-wider">
          Organic Growth Engine
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
          How The Peer Referral Loop Works
        </h2>
        <p className="text-sm text-slate-400">
          A zero-spam, student-first viral loop powered by collaborative learning and tangible placement perks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
        {steps.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.step}
              className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-black font-mono text-slate-700">{item.step}</span>
                  <div className={`w-9 h-9 rounded-lg ${item.bg} border flex items-center justify-center ${item.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{item.description}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center text-[11px] text-slate-500">
                <span className="font-mono">Phase {idx + 1} of 4</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Anti-abuse & Trust callout */}
      <div className="mt-6 p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span><strong>Built-in Referral Integrity:</strong> Duplicate email checks, verified referral code lookup, and self-referral prevention algorithms active.</span>
        </div>
        <span className="text-emerald-400 font-mono text-[11px] whitespace-nowrap">Fair Play Enforced ✅</span>
      </div>
    </div>
  );
}
