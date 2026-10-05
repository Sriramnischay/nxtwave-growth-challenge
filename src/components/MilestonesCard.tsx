'use client';

import React from 'react';
import { Award, CheckCircle2, Lock, Gift, Star, ArrowRight } from 'lucide-react';
import { MILESTONES } from '@/lib/constants';

interface MilestonesCardProps {
  referralCount: number;
}

export default function MilestonesCard({ referralCount }: MilestonesCardProps) {
  const nextTarget = MILESTONES.find(m => referralCount < m.referralsRequired);
  const highestTarget = MILESTONES[MILESTONES.length - 1].referralsRequired;
  const progressPercent = Math.min(100, Math.round((referralCount / highestTarget) * 100));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold text-white">Referral Milestones & Perks</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Every batchmate you invite brings you closer to exclusive mentorship rewards
          </p>
        </div>
        <div className="text-left sm:text-right">
          <span className="text-xs text-slate-400">Total Referrals:</span>{' '}
          <span className="text-sm font-bold text-blue-400 font-mono">{referralCount}</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2 mb-6">
        <div className="flex justify-between text-xs">
          <span className="text-slate-400">
            {nextTarget ? (
              <>
                <strong className="text-blue-400 font-mono">{nextTarget.referralsRequired - referralCount}</strong> more referral{nextTarget.referralsRequired - referralCount > 1 ? 's' : ''} to unlock <strong className="text-white">{nextTarget.title}</strong>
              </>
            ) : (
              <span className="text-emerald-400 font-semibold">🎉 All Elite Milestones Unlocked!</span>
            )}
          </span>
          <span className="font-mono text-slate-400 text-[11px]">{progressPercent}%</span>
        </div>
        <div className="w-full h-2.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-400 transition-all duration-700 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>
      </div>

      {/* Milestone Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {MILESTONES.map((m) => {
          const isUnlocked = referralCount >= m.referralsRequired;
          return (
            <div
              key={m.id}
              className={`p-4 rounded-xl border transition-all ${
                isUnlocked
                  ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-950/60 border-slate-800 text-slate-400'
              }`}
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-base">{m.badge.split(' ')[0]}</span>
                  <div>
                    <h4 className={`text-xs font-bold ${isUnlocked ? 'text-white' : 'text-slate-300'}`}>
                      {m.title}
                    </h4>
                    <span className="text-[10px] text-slate-500 font-mono">
                      {m.referralsRequired} {m.referralsRequired === 1 ? 'Referral' : 'Referrals'} Required
                    </span>
                  </div>
                </div>
                {isUnlocked ? (
                  <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-semibold flex items-center gap-1 border border-emerald-500/30">
                    <CheckCircle2 className="w-3 h-3" />
                    Unlocked
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-500 text-[10px] font-medium flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Locked
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-300 font-medium leading-relaxed mb-1">
                {m.perk}
              </p>
              <p className="text-[10px] text-slate-400 leading-normal">
                {m.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
