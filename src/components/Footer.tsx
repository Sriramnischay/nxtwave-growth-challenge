import React from 'react';
import Link from 'next/link';
import { Sparkles, Terminal, ShieldCheck, Heart, ArrowUpRight } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-[#070A12] text-slate-400 text-xs mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white font-bold">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-semibold text-white text-sm">NxtWave AI Workshop Growth Loop</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed text-xs">
              Designed for the <strong>NxtWave Growth Intern Challenge</strong>. Simulated 7-day organic referral engine designed to acquire 500 final-year engineering students on a ₹2,000 budget with a viral coefficient &gt; 1.0.
            </p>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[11px] font-mono border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                Simulation Mode Active
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono text-[11px]">Next.js 14 + Tailwind + TypeScript</span>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Navigation</h4>
            <ul className="space-y-1.5">
              <li>
                <Link href="/#workshop" className="hover:text-blue-400 transition-colors">Workshop Overview</Link>
              </li>
              <li>
                <Link href="/#syllabus" className="hover:text-blue-400 transition-colors">60-Min Curriculum</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-blue-400 transition-colors">Student Registration</Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-blue-400 transition-colors">Campus Leaderboard</Link>
              </li>
              <li>
                <Link href="/admin" className="text-amber-400/90 hover:text-amber-300 transition-colors flex items-center gap-1">
                  <span>Growth Admin Hub</span>
                  <ArrowUpRight className="w-3 h-3" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Challenge Details */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200">Campaign Blueprint</h4>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-lg space-y-1.5 text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Target Audience:</span>
                <span className="text-slate-200 font-medium">Final Year B.Tech</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Goal:</span>
                <span className="text-slate-200 font-medium">500 Registrations</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Budget:</span>
                <span className="text-slate-200 font-medium">₹2,000 Total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Strategy:</span>
                <span className="text-emerald-400 font-medium">Peer Referral Loop</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-slate-500 text-[11px]">
            © {new Date().getFullYear()} NxtWave Growth Intern Submission. Built for high-conversion student onboarding.
          </p>
          <div className="flex items-center gap-4 text-slate-500 text-[11px]">
            <span>100% Privacy Protected</span>
            <span>•</span>
            <span>Simulated Peer Attribution</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
