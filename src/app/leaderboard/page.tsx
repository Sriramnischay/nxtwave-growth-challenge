'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Trophy, Medal, Award, Search, Filter, RefreshCw, Sparkles, Building2, Users, ArrowRight, CheckCircle2 } from 'lucide-react';
import { LeaderboardEntry } from '@/types';
import { POPULAR_COLLEGES } from '@/lib/constants';

function LeaderboardContent() {
  const searchParams = useSearchParams();
  const userCode = searchParams.get('user') || '';

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [stats, setStats] = useState<{ totalStudents: number; totalReferrals: number; topReferrerCount: number } | null>(null);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCollege, setSelectedCollege] = useState('ALL');

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const url = userCode
        ? `/api/leaderboard?limit=100&userCode=${encodeURIComponent(userCode)}`
        : `/api/leaderboard?limit=100`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setLeaderboard(data.leaderboard);
        setStats(data.stats);
        if (data.userRank) setUserRank(data.userRank);
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [userCode]);

  // Filtered leaderboard
  const filteredList = leaderboard.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.college.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.branch.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollege = selectedCollege === 'ALL' || item.college === selectedCollege;
    return matchesSearch && matchesCollege;
  });

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
            <Trophy className="w-3.5 h-3.5" />
            <span>Campus Ambassador Leaderboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Top Student Referrers
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineering students driving peer registrations for the AI masterclass. Top performers unlock exclusive mentorship & fast-track internship referrals.
          </p>
        </div>

        {/* Global Stats Ribbon */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Active Participants</span>
              <div className="text-2xl font-black text-white mt-1 font-mono">{stats.totalStudents}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Total Peer Invites</span>
              <div className="text-2xl font-black text-blue-400 mt-1 font-mono">{stats.totalReferrals}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <span className="text-xs text-slate-400 uppercase tracking-wider">Top Referrer Score</span>
              <div className="text-2xl font-black text-amber-400 mt-1 font-mono">{stats.topReferrerCount} referrals</div>
            </div>
          </div>
        )}

        {/* Top 3 Podium Visual */}
        {top3.length >= 3 && selectedCollege === 'ALL' && !searchQuery && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
            {/* Rank 2 (Silver) */}
            <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 text-center space-y-3 relative order-2 md:order-1 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-slate-300/10 border border-slate-300/30 flex items-center justify-center mx-auto text-slate-300 font-bold text-lg font-mono">
                🥈 #2
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{top3[1]?.name}</h3>
                <p className="text-xs text-slate-400">{top3[1]?.college}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{top3[1]?.branch}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xl font-black text-white font-mono">{top3[1]?.referralCount}</span>
                <span className="text-xs text-slate-400 ml-1.5">referrals</span>
              </div>
            </div>

            {/* Rank 1 (Gold) */}
            <div className="bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-900 border border-amber-500/40 rounded-2xl p-6 text-center space-y-3 relative order-1 md:order-2 shadow-2xl scale-105 z-10">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider shadow-md">
                👑 Top Growth Lead
              </div>
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center mx-auto text-amber-300 font-black text-xl font-mono mt-1">
                🥇 #1
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{top3[0]?.name}</h3>
                <p className="text-xs text-amber-200/80 font-medium">{top3[0]?.college}</p>
                <p className="text-[11px] text-slate-400 font-mono mt-0.5">{top3[0]?.branch}</p>
              </div>
              <div className="pt-2 border-t border-amber-500/20">
                <span className="text-2xl font-black text-amber-400 font-mono">{top3[0]?.referralCount}</span>
                <span className="text-xs text-slate-300 ml-1.5 font-medium">referrals</span>
              </div>
            </div>

            {/* Rank 3 (Bronze) */}
            <div className="bg-slate-900/90 border border-amber-900/50 rounded-2xl p-6 text-center space-y-3 relative order-3 md:order-3 shadow-lg">
              <div className="w-12 h-12 rounded-full bg-amber-700/10 border border-amber-700/30 flex items-center justify-center mx-auto text-amber-500 font-bold text-lg font-mono">
                🥉 #3
              </div>
              <div>
                <h3 className="text-base font-bold text-white">{top3[2]?.name}</h3>
                <p className="text-xs text-slate-400">{top3[2]?.college}</p>
                <p className="text-[11px] text-slate-500 font-mono mt-0.5">{top3[2]?.branch}</p>
              </div>
              <div className="pt-2 border-t border-slate-800">
                <span className="text-xl font-black text-white font-mono">{top3[2]?.referralCount}</span>
                <span className="text-xs text-slate-400 ml-1.5">referrals</span>
              </div>
            </div>
          </div>
        )}

        {/* Filter & Search Bar */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student, college, branch..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              value={selectedCollege}
              onChange={(e) => setSelectedCollege(e.target.value)}
              className="w-full sm:w-64 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500"
            >
              <option value="ALL">All Colleges ({leaderboard.length} referrers)</option>
              {POPULAR_COLLEGES.filter(c => c !== 'Other College / Institute').map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            <button
              onClick={fetchLeaderboard}
              className="p-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-slate-300 transition-colors"
              title="Refresh rankings"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
            </button>
          </div>
        </div>

        {/* Rankings Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Campus Rankings ({filteredList.length})
            </h3>
            <span className="text-xs text-slate-400">Updates in real-time</span>
          </div>

          {loading ? (
            <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
              <span>Recalculating leaderboard...</span>
            </div>
          ) : filteredList.length === 0 ? (
            <div className="py-16 text-center text-slate-400 text-xs">
              No students found matching "{searchQuery}".
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="py-3 px-4 w-16 text-center">Rank</th>
                    <th className="py-3 px-4">Student</th>
                    <th className="py-3 px-4">College / Institute</th>
                    <th className="py-3 px-4 hidden md:table-cell">Branch</th>
                    <th className="py-3 px-4 text-right">Referrals</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {filteredList.map((entry) => {
                    const isTop3 = entry.rank <= 3;
                    const isUser = entry.isCurrentUser || entry.referralCode === userCode;

                    return (
                      <tr
                        key={entry.id}
                        className={`transition-colors ${
                          isUser
                            ? 'bg-blue-950/40 font-semibold border-l-4 border-l-blue-500'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        {/* Rank */}
                        <td className="py-3.5 px-4 text-center font-mono font-bold">
                          {entry.rank === 1 && <span className="text-amber-400 text-sm">🥇 1</span>}
                          {entry.rank === 2 && <span className="text-slate-300 text-sm">🥈 2</span>}
                          {entry.rank === 3 && <span className="text-amber-600 text-sm">🥉 3</span>}
                          {entry.rank > 3 && <span className="text-slate-400">#{entry.rank}</span>}
                        </td>

                        {/* Name */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-white font-medium">{entry.name}</span>
                            {isUser && (
                              <span className="px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 text-[10px] border border-blue-500/30">
                                You
                              </span>
                            )}
                          </div>
                          <span className="md:hidden text-[10px] text-slate-500 block">{entry.branch}</span>
                        </td>

                        {/* College */}
                        <td className="py-3.5 px-4 text-slate-300">
                          <div className="flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                            <span>{entry.college}</span>
                          </div>
                        </td>

                        {/* Branch */}
                        <td className="py-3.5 px-4 text-slate-400 hidden md:table-cell">
                          {entry.branch}
                        </td>

                        {/* Referrals */}
                        <td className="py-3.5 px-4 text-right font-mono font-bold">
                          <span className="px-2.5 py-1 rounded-full bg-slate-800 text-blue-400 border border-slate-700">
                            {entry.referralCount} {entry.referralCount === 1 ? 'invite' : 'invites'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* CTA Bar */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <h4 className="text-sm font-bold text-white">Want to see your name on the campus leaderboard?</h4>
            <p className="text-xs text-slate-400">
              Register for the free masterclass, grab your unique referral link, and invite your college friends.
            </p>
          </div>
          <Link
            href="/register"
            className="px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 whitespace-nowrap"
          >
            <span>Register & Get Invite Link</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400 text-xs">Loading leaderboard...</div>}>
      <LeaderboardContent />
    </Suspense>
  );
}
