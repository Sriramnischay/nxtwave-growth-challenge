'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Sparkles, ArrowLeft, ShieldCheck, Clock, Calendar, CheckCircle2 } from 'lucide-react';
import RegistrationForm from '@/components/RegistrationForm';
import { WORKSHOP_DETAILS } from '@/lib/constants';

function RegisterContent() {
  const searchParams = useSearchParams();
  const refCode = searchParams.get('ref') || '';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Back link */}
      <div className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Workshop Overview</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Workshop Summary */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>NxtWave Live Masterclass</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight leading-snug">
              Register for “Build Your First AI Project in 60 Minutes”
            </h1>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              Complete the 30-second form to reserve your live seat and receive your personal student referral identity.
            </p>
          </div>

          {/* Quick Details Box */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 space-y-3 text-xs">
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Date:</span>
              <span className="text-white font-medium">{WORKSHOP_DETAILS.date}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Time:</span>
              <span className="text-white font-medium">{WORKSHOP_DETAILS.time}</span>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-slate-800/80">
              <span className="text-slate-400">Target:</span>
              <span className="text-blue-300 font-medium">{WORKSHOP_DETAILS.targetAudience}</span>
            </div>
            <div className="flex items-center justify-between py-1">
              <span className="text-slate-400">Cost:</span>
              <span className="text-emerald-400 font-bold">100% Free</span>
            </div>
          </div>

          {/* Included Benefits */}
          <div className="space-y-2">
            <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">What’s Included:</h3>
            <div className="space-y-1.5 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Live guided coding of an AI Copilot</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>GitHub starter repository & prompt templates</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Verified NxtWave Completion Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                <span>Access to peer referral perks & mentorship</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7">
          <RegistrationForm initialReferralCode={refCode} />
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100">
      <Suspense fallback={<div className="p-8 text-center text-slate-400 text-sm">Loading registration...</div>}>
        <RegisterContent />
      </Suspense>
    </div>
  );
}
