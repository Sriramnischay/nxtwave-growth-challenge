'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Sparkles, CheckCircle2, Copy, Share2, MessageSquare, Trophy, Award, Users, ArrowRight, ExternalLink, RefreshCw, Calendar, Clock, AlertCircle, ChevronRight, BookOpen } from 'lucide-react';
import MilestonesCard from '@/components/MilestonesCard';
import { WORKSHOP_DETAILS } from '@/lib/constants';

export default function StudentDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const code = params.code as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [data, setData] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [canNativeShare, setCanNativeShare] = useState(false);

  const fetchDashboardData = async () => {
    if (!code) return;
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`/api/student/${encodeURIComponent(code)}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || 'Failed to load student dashboard.');
      }

      setData(json);
    } catch (err: any) {
      setError(err.message || 'Unable to find registration data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    if (typeof navigator !== 'undefined' && !!navigator.share) {
      setCanNativeShare(true);
    }
  }, [code]);

  const getReferralUrl = () => {
    if (!data?.student?.referralCode) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register?ref=${data.student.referralCode}`;
    }
    return `/register?ref=${data.student.referralCode}`;
  };

  const copyReferralUrl = () => {
    const url = getReferralUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const copyReferralCode = () => {
    if (!data?.student?.referralCode) return;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(data.student.referralCode);
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 3000);
    }
  };

  const shareOnWhatsApp = () => {
    const url = getReferralUrl();
    const text = encodeURIComponent(
      `Hey! NxtWave is running a free 60-minute workshop where we can build our first AI project. I just registered. You can join here: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  const handleNativeShare = async () => {
    const url = getReferralUrl();
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Build Your First AI Project in 60 Minutes",
          text: "Hey! NxtWave is running a free 60-minute workshop where we can build our first AI project. I just registered. You can join here:",
          url: url,
        });
      } catch {
        // user cancelled share
      }
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 font-medium">Loading your student dashboard...</p>
      </div>
    );
  }

  // ERROR STATE
  if (error || !data?.student) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center space-y-4 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Student Registration Not Found</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error || `We couldn't find a registration associated with code "${code}".`}
          </p>
          <div className="flex flex-col sm:flex-row gap-2 pt-2">
            <Link
              href="/register"
              className="flex-1 py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors text-center"
            >
              Register Now (Free)
            </Link>
            <Link
              href="/"
              className="flex-1 py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors text-center border border-slate-700"
            >
              Go to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const { student, referrals, rank, milestones, nextMilestone, progressToNext, totalParticipants } = data;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header with greeting and refresh */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>You're registered 🎉</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Welcome, {student.name}!
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                <span><strong>College:</strong> {student.college}</span>
                <span>•</span>
                <span><strong>Branch:</strong> {student.branch}</span>
                <span>•</span>
                <span><strong>Batch:</strong> {student.graduationYear}</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={fetchDashboardData}
                className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition-colors flex items-center gap-1.5"
                title="Refresh dashboard numbers"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-400" />
                <span>Refresh</span>
              </button>
              <Link
                href="/leaderboard"
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 transition-all flex items-center gap-1.5"
              >
                <Trophy className="w-3.5 h-3.5 text-amber-300" />
                <span>Leaderboard</span>
              </Link>
            </div>
          </div>

          {/* Workshop Details Quick Strip */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <Calendar className="w-4 h-4 text-blue-400" />
              <span><strong>Date:</strong> {WORKSHOP_DETAILS.date}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <Clock className="w-4 h-4 text-teal-400" />
              <span><strong>Time:</strong> {WORKSHOP_DETAILS.time}</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-400 font-medium">
              <CheckCircle2 className="w-4 h-4" />
              <span>Live Meeting Pass Active</span>
            </div>
          </div>
        </div>

        {/* 3 Key Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Stat 1: Referrals */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Successful Referrals</span>
              <Users className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-white font-mono">{student.referralCount || 0}</span>
              <span className="text-xs text-slate-400">peers joined</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              {student.referralCount > 0
                ? `${student.referralCount} verified friends registered through your link`
                : 'Share your link below to get your first referral'}
            </div>
          </div>

          {/* Stat 2: Leaderboard Rank */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Campus Rank</span>
              <Trophy className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono">
                {rank ? `#${rank}` : 'Unranked'}
              </span>
              <span className="text-xs text-slate-400">of {totalParticipants}</span>
            </div>
            <div className="mt-3 text-[11px] text-slate-500">
              {rank ? `Top tier referrer on campus!` : 'Get 1 referral to enter the leaderboard'}
            </div>
          </div>

          {/* Stat 3: Next Milestone */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-semibold uppercase tracking-wider">Next Perk Goal</span>
              <Award className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-base font-bold text-white truncate">
                {nextMilestone ? nextMilestone.title : 'All Maxed Out!'}
              </span>
            </div>
            <div className="mt-3 text-[11px] text-slate-400">
              {nextMilestone ? (
                <span className="text-emerald-400 font-medium">
                  {nextMilestone.referralsRequired - (student.referralCount || 0)} more invite needed
                </span>
              ) : (
                <span className="text-emerald-400 font-medium">Champion level reached 🏆</span>
              )}
            </div>
          </div>
        </div>

        {/* Primary Sharing Center */}
        <div className="bg-slate-900 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center gap-2">
                <Share2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg font-bold text-white">Your Personal Student Referral Center</h2>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                Share with batchmates, hostel groups, or WhatsApp study circles to climb the leaderboard
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/10 text-blue-300 text-xs font-mono font-medium border border-blue-500/20 self-start sm:self-auto">
              Attribution Code: {student.referralCode}
            </span>
          </div>

          {/* Code & Link Box */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Referral Code Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Referral Code</span>
              <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5">
                <span className="font-mono font-bold text-lg text-blue-400">{student.referralCode}</span>
                <button
                  onClick={copyReferralCode}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1 border border-slate-700"
                >
                  {copiedCode ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Code</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Direct Referral URL Box */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Direct Invite Link</span>
              <div className="flex items-center justify-between bg-slate-900 border border-slate-700/80 rounded-lg px-3.5 py-2.5 gap-2">
                <span className="font-mono text-xs text-slate-300 truncate">
                  {getReferralUrl()}
                </span>
                <button
                  onClick={copyReferralUrl}
                  className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1 border border-slate-700 flex-shrink-0"
                >
                  {copiedLink ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span>Copy Link</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 1-Click Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <button
              onClick={shareOnWhatsApp}
              className="py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98] shadow-md shadow-emerald-900/30"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Share to WhatsApp Groups</span>
            </button>

            <button
              onClick={copyReferralUrl}
              className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{copiedLink ? 'Link Copied!' : 'Copy Share Message'}</span>
            </button>

            {canNativeShare ? (
              <button
                onClick={handleNativeShare}
                className="py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Native Share Dialog</span>
              </button>
            ) : (
              <Link
                href="/leaderboard"
                className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
              >
                <Trophy className="w-4 h-4 text-amber-400" />
                <span>View Campus Rank</span>
              </Link>
            )}
          </div>

          {/* Pre-crafted Student Message Preview */}
          <div className="p-3.5 bg-slate-950/60 rounded-xl border border-slate-800/80 text-xs text-slate-400 space-y-1">
            <span className="font-semibold text-slate-300 text-[11px] uppercase tracking-wider">WhatsApp Message Preview:</span>
            <p className="italic text-slate-300">
              “Hey! NxtWave is running a free 60-minute workshop where we can build our first AI project. I just registered. You can join here: <span className="font-mono text-blue-400 not-italic">{getReferralUrl()}</span>”
            </p>
          </div>
        </div>

        {/* Milestones & Perks Component */}
        <MilestonesCard referralCount={student.referralCount || 0} />

        {/* Referred Peers List */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-bold text-white">Students Who Registered Via Your Link</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Real-time attribution log for your invites
              </p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 font-mono">
              {referrals.length} {referrals.length === 1 ? 'Referral' : 'Referrals'}
            </span>
          </div>

          {referrals.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-950/60 rounded-xl border border-dashed border-slate-800 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center mx-auto text-slate-400">
                <Users className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-semibold text-white">No referrals yet</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Share your unique link on your college WhatsApp group to earn your first referral and unlock the AI Starter Kit!
              </p>
              <button
                onClick={shareOnWhatsApp}
                className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white text-xs font-semibold transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5 fill-white" />
                <span>Share to WhatsApp Now</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-slate-800/80 overflow-hidden rounded-xl border border-slate-800">
              {referrals.map((ref: any, idx: number) => (
                <div key={ref.id || idx} className="p-4 bg-slate-950/40 hover:bg-slate-800/30 flex items-center justify-between gap-4 text-xs transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center font-bold text-blue-400 font-mono">
                      {idx + 1}
                    </div>
                    <div>
                      <div className="font-semibold text-white">{ref.referredStudentName}</div>
                      <div className="text-slate-400 text-[11px]">{ref.referredStudentCollege}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                      Verified ✅
                    </span>
                    <div className="text-[10px] text-slate-500 mt-1">
                      {new Date(ref.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
