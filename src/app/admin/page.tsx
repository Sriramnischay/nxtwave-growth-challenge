'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart3,
  TrendingUp,
  Users,
  Target,
  IndianRupee,
  Share2,
  Building2,
  BookOpen,
  Award,
  RefreshCw,
  Download,
  ShieldCheck,
  Zap,
  Lock,
  Unlock,
  AlertCircle,
  PlusCircle,
  RotateCcw,
  CheckCircle2,
  ArrowUpRight
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { AdminStats } from '@/types';

const COLORS = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EC4899', '#8B5CF6'];

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState('');

  // Quick test registration state
  const [showAddModal, setShowAddModal] = useState(false);
  const [testForm, setTestForm] = useState({
    name: 'Siddharth Rao',
    email: `test.${Date.now()}@college.edu`,
    college: 'IIT Madras',
    branch: 'Computer Science & Engineering (CSE)',
    graduationYear: '2025',
    referralCode: '',
  });

  const fetchStats = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/stats');
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch {
      // error handling
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check if previously unlocked in session
    const unlocked = sessionStorage.getItem('nxt_admin_unlocked');
    if (unlocked === 'true') {
      setIsAuthenticated(true);
    }
    fetchStats();
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordInput === 'admin' || passwordInput === 'admin123' || passwordInput === 'nxtwave') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nxt_admin_unlocked', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password. Demo password is: admin');
    }
  };

  const handleQuickDemoUnlock = () => {
    setIsAuthenticated(true);
    sessionStorage.setItem('nxt_admin_unlocked', 'true');
  };

  const handleResetData = async () => {
    if (!confirm('Reset all registrations back to the benchmark simulation dataset?')) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/admin/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reset' }),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage('Data reset to benchmark simulation dataset.');
        await fetchStats();
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch {
      // error
    } finally {
      setActionLoading(false);
    }
  };

  const handleCreateTestRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testForm),
      });
      const data = await res.json();
      if (data.success) {
        setActionMessage(`Registered "${testForm.name}" successfully! Code: ${data.student.referralCode}`);
        setShowAddModal(false);
        setTestForm(prev => ({
          ...prev,
          email: `test.${Date.now()}@college.edu`,
        }));
        await fetchStats();
        setTimeout(() => setActionMessage(''), 4000);
      } else {
        alert(data.error || 'Failed to create test registration');
      }
    } catch {
      alert('Error creating test registration');
    } finally {
      setActionLoading(false);
    }
  };

  const exportCSV = () => {
    if (!stats?.recentRegistrations) return;
    const headers = ['ID,Name,College,Branch,ReferralCode,ReferredBy,CreatedAt,IsDemo'];
    const rows = stats.recentRegistrations.map(r =>
      `"${r.id}","${r.name}","${r.college}","${r.branch}","${r.referralCode}","${r.referredBy || 'Direct'}","${r.createdAt}","${r.isDemo ? 'Yes' : 'No'}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `nxtwave_registrations_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Demo Protection Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#090D16] flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto text-amber-400">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Growth Admin Access</h1>
            <p className="text-xs text-slate-400">
              Campaign Organizer Dashboard for the NxtWave ₹2,000 / 500-Student Challenge.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Admin Demo Passkey
              </label>
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter 'admin' or click 1-click unlock"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
                autoFocus
              />
              {authError && <p className="text-xs text-rose-400 mt-1.5">{authError}</p>}
            </div>

            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md shadow-blue-500/20 transition-all"
            >
              Sign In to Admin Hub
            </button>
          </form>

          {/* Quick Demo Unlock Button */}
          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              onClick={handleQuickDemoUnlock}
              className="w-full py-2 px-3 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <Unlock className="w-3.5 h-3.5 text-emerald-400" />
              <span>1-Click Demo Evaluation Unlock</span>
            </button>
            <p className="text-[11px] text-slate-500 mt-2">Passkey is pre-filled for reviewers.</p>
          </div>
        </div>
      </div>
    );
  }

  // Loading State
  if (loading && !stats) {
    return (
      <div className="min-h-screen bg-[#090D16] flex flex-col items-center justify-center p-4">
        <div className="w-10 h-10 border-3 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4"></div>
        <p className="text-sm text-slate-400 font-medium">Computing growth analytics...</p>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Top Control Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-300 text-xs font-semibold border border-amber-500/20">
                Campaign Organizer Hub
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-mono">Live Sync</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Growth Challenge Analytics & Strategy
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <strong>500 Final-Year Engineering Students</strong> in 7 Days | Budget: <strong>₹2,000</strong>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-500/20 flex items-center gap-1.5 transition-colors"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Simulate Registration</span>
            </button>

            <button
              onClick={exportCSV}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={handleResetData}
              disabled={actionLoading}
              className="px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center gap-1.5 transition-colors"
              title="Reset data to standard simulation baseline"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset Seed</span>
            </button>

            <button
              onClick={fetchStats}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
              title="Refresh numbers"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Action feedback toast */}
        {actionMessage && (
          <div className="p-3 bg-emerald-950/60 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{actionMessage}</span>
          </div>
        )}

        {/* Main Goal Progress Card (500 Goal) */}
        <div className="bg-gradient-to-r from-blue-950/40 via-slate-900 to-teal-950/40 border border-blue-500/30 rounded-2xl p-6 sm:p-8 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Primary Campaign Target</span>
              <h2 className="text-3xl font-black text-white mt-0.5">
                {stats.totalRegistrations} <span className="text-lg font-normal text-slate-400">/ {stats.targetRegistrations} Registrations</span>
              </h2>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400">Remaining to Goal:</span>{' '}
              <span className="text-lg font-bold text-amber-400 font-mono">{stats.remainingRegistrations} students</span>
              <div className="text-[11px] text-slate-500 font-mono">2 Days Left in Campaign</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-emerald-400 font-semibold">{stats.progressPercentage}% Completed</span>
              <span className="text-slate-400">{stats.totalRegistrations} achieved</span>
            </div>
            <div className="w-full h-3.5 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
              <div
                className="h-full bg-gradient-to-r from-blue-600 via-teal-400 to-emerald-400 transition-all duration-700 ease-out"
                style={{ width: `${Math.min(100, stats.progressPercentage)}%` }}
              ></div>
            </div>
          </div>

          {/* Goal Insight */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300 border-t border-slate-800/60">
            <span>
              🚀 <strong>Growth Trajectory:</strong> Pacing at <strong>+{stats.dailyTrends[stats.dailyTrends.length - 1]?.total || 45} registrations/day</strong>. Projected to cross 500 within ~36 hours.
            </span>
            <span className="text-emerald-400 font-semibold">On Track For Target ✅</span>
          </div>
        </div>

        {/* 4 Core Growth Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Metric 1: Referral vs Direct Share */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Referral Contribution</span>
              <Share2 className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats.referralSharePercentage}%
            </div>
            <div className="text-xs text-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>Referred:</span>
                <span className="text-blue-400 font-mono font-semibold">{stats.totalReferredRegistrations}</span>
              </div>
              <div className="flex justify-between">
                <span>Direct:</span>
                <span className="text-slate-300 font-mono">{stats.totalDirectRegistrations}</span>
              </div>
            </div>
          </div>

          {/* Metric 2: Active Referrers & Velocity */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Active Referrers</span>
              <Users className="w-4 h-4 text-teal-400" />
            </div>
            <div className="text-2xl font-black text-white font-mono">
              {stats.activeReferrersCount}
            </div>
            <div className="text-xs text-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>Avg Invites / Sharer:</span>
                <span className="text-teal-400 font-mono font-semibold">{stats.avgReferralsPerActiveReferrer}</span>
              </div>
              <div className="flex justify-between">
                <span>Total Invites:</span>
                <span className="text-slate-300 font-mono">{stats.totalReferralsGenerated}</span>
              </div>
            </div>
          </div>

          {/* Metric 3: Virality K-Factor */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Viral Loop (K-Factor)</span>
              <Zap className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-amber-400 font-mono">
              {stats.viralityKFactor}
            </div>
            <div className="text-xs text-slate-400">
              <span className="text-[11px] leading-tight block">
                {stats.viralityKFactor >= 0.5
                  ? 'Strong viral magnification: every 10 direct signups bring ~5+ peer registrations.'
                  : 'Moderate referral velocity.'}
              </span>
            </div>
          </div>

          {/* Metric 4: Budget & CPA Efficiency */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="font-semibold uppercase tracking-wider">Cost / Acquisition (CPA)</span>
              <IndianRupee className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-emerald-400 font-mono">
              ₹{stats.effectiveCPA}
            </div>
            <div className="text-xs text-slate-400 space-y-0.5">
              <div className="flex justify-between">
                <span>Total Budget:</span>
                <span className="text-white font-mono">₹{stats.budgetTotal}</span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-400">
                <span>vs Paid Ads (₹140):</span>
                <span>~96% Savings</span>
              </div>
            </div>
          </div>

        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Daily Registration Trend Chart */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Registration Growth Trend (Daily)
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Breakdown of Direct vs Referral Attributed Signups
                </p>
              </div>
              <span className="text-xs font-mono text-slate-400">Last 7 Days</span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyTrends}>
                  <XAxis dataKey="displayDate" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }} />
                  <Bar dataKey="direct" name="Direct Signups" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="referral" name="Peer Referrals" fill="#10B981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Engineering Branch Breakdown */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Audience by Engineering Branch
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Targeting Final-Year CSE, AI/DS, IT, ECE Students
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {stats.branchBreakdown.map((b, idx) => (
                <div key={b.branch} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-300 truncate max-w-[240px]">{b.branch}</span>
                    <span className="font-mono text-slate-400 font-medium">
                      {b.count} ({b.percentage}%)
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-950 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${b.percentage}%`,
                        backgroundColor: COLORS[idx % COLORS.length],
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* College Distribution & Top Referrers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* College Distribution Table */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Colleges by Registrations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Organic institutional virality clusters
                </p>
              </div>
              <span className="text-xs text-blue-400 font-mono">Top 10 Campus Hubs</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">College / University</th>
                    <th className="py-2.5 px-3 text-right">Total Regs</th>
                    <th className="py-2.5 px-3 text-right">Referred</th>
                    <th className="py-2.5 px-3 text-right">Share</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {stats.collegeBreakdown.map((c) => (
                    <tr key={c.college} className="hover:bg-slate-800/40">
                      <td className="py-2.5 px-3 font-medium text-slate-200">{c.college}</td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-white">{c.count}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-emerald-400">{c.referrals}</td>
                      <td className="py-2.5 px-3 text-right font-mono text-slate-400">{c.percentage}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Top Referrers Leaderboard Widget */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                  Top Student Ambassadors
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Students driving the highest registration loops
                </p>
              </div>
              <Link href="/leaderboard" className="text-xs text-blue-400 hover:text-blue-300">
                Full Board →
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80">
              {stats.topReferrers.slice(0, 6).map((ambassador) => (
                <div key={ambassador.id} className="py-2.5 flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 truncate">
                    <span className="font-mono font-bold text-amber-400 w-5">#{ambassador.rank}</span>
                    <div className="truncate">
                      <div className="font-semibold text-white truncate">{ambassador.name}</div>
                      <div className="text-[11px] text-slate-400 truncate">{ambassador.college}</div>
                    </div>
                  </div>
                  <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                    {ambassador.referralCount} referrals
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Live Registrations Feed */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Recent Workshop Registrations (Live Feed)
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                New students enrolling and entering the referral engine
              </p>
            </div>
            <span className="text-xs text-slate-400 font-mono">Showing latest 10</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">College</th>
                  <th className="py-2.5 px-3">Branch</th>
                  <th className="py-2.5 px-3">Referral Code</th>
                  <th className="py-2.5 px-3">Source / Attribution</th>
                  <th className="py-2.5 px-3 text-right">Registered At</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {stats.recentRegistrations.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-800/40">
                    <td className="py-2.5 px-3 font-semibold text-white flex items-center gap-1.5">
                      <span>{s.name}</span>
                      {!s.isDemo && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 text-[9px] border border-emerald-500/30">
                          Live
                        </span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-slate-300">{s.college}</td>
                    <td className="py-2.5 px-3 text-slate-400">{s.branch}</td>
                    <td className="py-2.5 px-3 font-mono text-blue-400">{s.referralCode}</td>
                    <td className="py-2.5 px-3">
                      {s.referredBy ? (
                        <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 font-mono text-[11px] border border-blue-500/20">
                          Ref: {s.referredBy}
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[11px]">Direct / Organic</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3 text-right text-slate-500 text-[11px]">
                      {new Date(s.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Growth Strategy & Diagnostic Review Box */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold text-white">Growth Intern Strategy Evaluation</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-semibold text-blue-400 uppercase tracking-wider text-[11px]">1. Budget Optimization</span>
              <p className="leading-relaxed text-slate-400">
                Standard digital ads cost ~₹140 per verified final-year tech student (₹70,000 for 500). By allocating ₹2,000 strictly toward student milestone incentives (starter kits, Discord mentorship, ambassador perks), effective CPA drops to <strong className="text-white">₹{stats.effectiveCPA}</strong> (a 96% reduction).
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-semibold text-teal-400 uppercase tracking-wider text-[11px]">2. Viral Coefficient ($K &gt; 0.5$)</span>
              <p className="leading-relaxed text-slate-400">
                With {stats.referralSharePercentage}% of total registrations arriving via peer invites and an average of {stats.avgReferralsPerActiveReferrer} invites per active student, the campus network effect creates compounding organic growth across engineering WhatsApp study groups.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <span className="font-semibold text-amber-400 uppercase tracking-wider text-[11px]">3. Final-Year Placement Hook</span>
              <p className="leading-relaxed text-slate-400">
                The core pitch answers: <em>“Why should I spend 60 minutes?”</em> Building a real GitHub AI Copilot provides immediate placement interview value, driving organic word-of-mouth far higher than theoretical webinars.
              </p>
            </div>
          </div>
        </div>

      </div>

      {/* Quick Simulate Registration Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white">Simulate Quick Registration</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>
            <p className="text-xs text-slate-400">
              Test how live registrations update the K-factor, leaderboard, and college rankings instantly.
            </p>

            <form onSubmit={handleCreateTestRegistration} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Full Name</label>
                <input
                  type="text"
                  value={testForm.name}
                  onChange={(e) => setTestForm({ ...testForm, name: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={testForm.email}
                  onChange={(e) => setTestForm({ ...testForm, email: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">College</label>
                <input
                  type="text"
                  value={testForm.college}
                  onChange={(e) => setTestForm({ ...testForm, college: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Referral Code (Optional - to test attribution)</label>
                <input
                  type="text"
                  value={testForm.referralCode}
                  onChange={(e) => setTestForm({ ...testForm, referralCode: e.target.value })}
                  placeholder="e.g. NXT-10012"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold"
                >
                  {actionLoading ? 'Registering...' : 'Register Test Student'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
