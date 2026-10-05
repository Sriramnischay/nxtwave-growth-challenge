'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, CheckCircle2, Copy, Share2, MessageSquare, ArrowRight, AlertCircle, Building2, BookOpen, Calendar, User, Mail, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { POPULAR_COLLEGES, ENGINEERING_BRANCHES, GRADUATION_YEARS } from '@/lib/constants';

interface RegistrationFormProps {
  initialReferralCode?: string;
  onSuccess?: (student: any) => void;
  compact?: boolean;
}

export default function RegistrationForm({ initialReferralCode = '', onSuccess, compact = false }: RegistrationFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    college: 'IIT Madras',
    customCollege: '',
    branch: 'Computer Science & Engineering (CSE)',
    graduationYear: '2025',
    referralCode: initialReferralCode || '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [warningMessage, setWarningMessage] = useState('');
  const [registeredStudent, setRegisteredStudent] = useState<any>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [referrerAttributed, setReferrerAttributed] = useState<any>(null);

  // Check URL param ?ref=...
  useEffect(() => {
    const refParam = searchParams.get('ref');
    if (refParam) {
      setFormData(prev => ({ ...prev, referralCode: refParam.trim().toUpperCase() }));
    }
  }, [searchParams]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errorMessage) setErrorMessage('');
  };

  const handleCollegeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setFormData(prev => ({
      ...prev,
      college: value,
      customCollege: value === 'Other College / Institute' ? prev.customCollege : '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setWarningMessage('');

    // Client-side validations
    if (!formData.name.trim()) {
      setErrorMessage('Please enter your full name.');
      return;
    }
    if (!formData.email.trim()) {
      setErrorMessage('Please enter your email address.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email.trim())) {
      setErrorMessage('Please enter a valid email address (e.g. yourname@gmail.com or college email).');
      return;
    }

    const finalCollege = formData.college === 'Other College / Institute'
      ? (formData.customCollege.trim() || 'Other Institute')
      : formData.college;

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim().toLowerCase(),
          college: finalCollege,
          branch: formData.branch,
          graduationYear: formData.graduationYear,
          referralCode: formData.referralCode ? formData.referralCode.trim().toUpperCase() : null,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Registration failed. Please try again.');
      }

      // Success
      setRegisteredStudent(data.student);
      setReferrerAttributed(data.referrerAttributed);
      if (data.warning) {
        setWarningMessage(data.warning);
      }

      // Trigger Confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#3b82f6', '#10b981', '#6366f1', '#f59e0b'],
        });
      } catch {
        // ignore if canvas-confetti fails
      }

      if (onSuccess) {
        onSuccess(data.student);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Something went wrong. Please check your details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getReferralUrl = () => {
    if (!registeredStudent) return '';
    if (typeof window !== 'undefined') {
      return `${window.location.origin}/register?ref=${registeredStudent.referralCode}`;
    }
    return `/register?ref=${registeredStudent.referralCode}`;
  };

  const copyReferralUrl = () => {
    const url = getReferralUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const shareOnWhatsApp = () => {
    const url = getReferralUrl();
    const text = encodeURIComponent(
      `Hey! NxtWave is running a free 60-minute workshop where we can build our first AI project. I just registered. You can join here: ${url}`
    );
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
  };

  // SUCCESS STATE VIEW
  if (registeredStudent) {
    return (
      <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden animate-fade-in">
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="text-center space-y-3 mb-6">
          <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider border border-emerald-500/20">
            Registration Confirmed
          </span>
          <h3 className="text-2xl font-bold text-white">
            You're In, {registeredStudent.name.split(' ')[0]}! 🎉
          </h3>
          <p className="text-sm text-slate-300 max-w-md mx-auto">
            We've reserved your live seat for <strong>Build Your First AI Project in 60 Minutes</strong>.
          </p>
          
          {referrerAttributed && (
            <div className="p-2.5 rounded-lg bg-blue-950/40 border border-blue-500/20 text-xs text-blue-300 inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>You were referred by <strong>{referrerAttributed.name}</strong> ({referrerAttributed.college}).</span>
            </div>
          )}

          {warningMessage && (
            <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-500/20 text-xs text-amber-300">
              {warningMessage}
            </div>
          )}
        </div>

        {/* Growth Loop Sharing Box */}
        <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-5 space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Your Personal Referral Identity</span>
            <span className="text-xs text-emerald-400 font-medium">Earn Mentorship & Badges</span>
          </div>

          <div className="flex items-center gap-2 bg-slate-900 border border-slate-700/80 rounded-lg p-3">
            <div className="flex-1 font-mono font-bold text-base text-blue-400 tracking-wider">
              {registeredStudent.referralCode}
            </div>
            <button
              onClick={copyReferralUrl}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-md transition-colors flex items-center gap-1.5 border border-slate-600/50"
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

          <p className="text-xs text-slate-400 leading-relaxed">
            Invite your college batchmates. <strong>1 referral</strong> unlocks the AI Starter Repository; <strong>3 referrals</strong> unlocks VIP Mentorship & Resume Review.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={shareOnWhatsApp}
              className="w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-semibold text-xs flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>Share on WhatsApp</span>
            </button>

            <button
              onClick={copyReferralUrl}
              className="w-full py-2.5 px-4 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-xs flex items-center justify-center gap-2 border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 text-slate-400" />
              <span>{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Referral URL'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Link */}
        <div className="text-center">
          <button
            onClick={() => router.push(`/dashboard/${registeredStudent.referralCode}`)}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Open My Referral Dashboard & Leaderboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // REGISTRATION FORM VIEW
  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl relative ${compact ? 'max-w-lg mx-auto' : ''}`}>
      {/* Active referral banner */}
      {formData.referralCode && (
        <div className="mb-5 p-3 rounded-lg bg-blue-950/40 border border-blue-500/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-blue-300">
            <Sparkles className="w-4 h-4 text-blue-400 flex-shrink-0" />
            <span>Referral active: <strong className="font-mono text-white">{formData.referralCode}</strong></span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-medium">
            Bonus Attributed
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {errorMessage && (
          <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Full Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-slate-400" />
            <span>Full Name <span className="text-rose-400">*</span></span>
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Rahul Sharma"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5 text-slate-400" />
            <span>Email Address <span className="text-rose-400">*</span></span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="e.g. rahul.sharma@college.edu or gmail"
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            required
          />
          <p className="text-[11px] text-slate-500 mt-1">Workshop link & certificate credentials will be sent here.</p>
        </div>

        {/* College */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span>College / Institute <span className="text-rose-400">*</span></span>
          </label>
          <select
            name="college"
            value={formData.college}
            onChange={handleCollegeChange}
            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
          >
            {POPULAR_COLLEGES.map((c) => (
              <option key={c} value={c} className="bg-slate-900 text-white">
                {c}
              </option>
            ))}
          </select>

          {formData.college === 'Other College / Institute' && (
            <input
              type="text"
              name="customCollege"
              value={formData.customCollege}
              onChange={handleChange}
              placeholder="Type your college name..."
              className="mt-2 w-full px-3.5 py-2 bg-slate-950 border border-slate-700/80 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              required
            />
          )}
        </div>

        {/* Branch & Graduation Year Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-slate-400" />
              <span>Engineering Branch <span className="text-rose-400">*</span></span>
            </label>
            <select
              name="branch"
              value={formData.branch}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition-colors"
            >
              {ENGINEERING_BRANCHES.map((b) => (
                <option key={b} value={b} className="bg-slate-900 text-white">
                  {b}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>Graduation Year <span className="text-rose-400">*</span></span>
            </label>
            <select
              name="graduationYear"
              value={formData.graduationYear}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700/80 rounded-lg text-xs text-white focus:outline-none focus:border-blue-500 transition-colors font-medium"
            >
              {GRADUATION_YEARS.map((g) => (
                <option key={g.year} value={g.year} className="bg-slate-900 text-white">
                  {g.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Referral Code (Optional if not in URL) */}
        <div>
          <label className="block text-xs font-semibold text-slate-400 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-slate-500" />
              <span>Referral Code (Optional)</span>
            </span>
            <span className="text-[10px] text-slate-500 font-normal">Got a code from a friend?</span>
          </label>
          <input
            type="text"
            name="referralCode"
            value={formData.referralCode}
            onChange={handleChange}
            placeholder="e.g. NXT-A7K92"
            className="w-full px-3.5 py-2 bg-slate-950/60 border border-slate-700/60 rounded-lg text-xs font-mono uppercase text-slate-200 placeholder-slate-600 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Submit CTA */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Securing Your Seat & Generating Link...</span>
              </>
            ) : (
              <>
                <span>Complete Free Registration</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </>
            )}
          </button>
        </div>

        {/* Trust Badges */}
        <div className="flex items-center justify-center gap-4 text-[11px] text-slate-500 pt-2">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            100% Free Workshop
          </span>
          <span>•</span>
          <span>Verified Certificate</span>
          <span>•</span>
          <span>No Spam</span>
        </div>
      </form>
    </div>
  );
}
