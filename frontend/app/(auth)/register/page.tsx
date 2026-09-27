'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { HimnovaLogo } from '@/components/brand/HimnovaLogo';
import {
  User,
  Mail,
  Lock,
  Phone,
  Tag,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

function RegisterForm() {
  const { register } = useAuth();
  const searchParams = useSearchParams();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      setReferralCode(ref);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setErrorMsg('Please complete all required fields.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    try {
      await register({
        fullName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
        referralCode: referralCode || undefined,
      });
    } catch (err: any) {
      setErrorMsg(err.message || 'Registration failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-brand-cyan selection:text-slate-900">
      <div className="noise-overlay" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-cyan/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        <div className="flex flex-col items-center text-center space-y-3">
          <HimnovaLogo size="lg" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Create Student Account
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Join the Himnova AI Career Launchpad cohort
            </p>
          </div>
        </div>

        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-alpine-900/80 backdrop-blur-2xl shadow-2xl space-y-5">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Full Legal Name *
              </label>
              <div className="relative">
                <User className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Bibek Sharma"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="bibek@example.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Password * (min. 8 characters)
              </label>
              <div className="relative">
                <Lock className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-slate-300">
                  Phone (Optional)
                </label>
                <div className="relative">
                  <Phone className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+977-98..."
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono uppercase font-bold text-slate-300">
                  Referral Code
                </label>
                <div className="relative">
                  <Tag className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                  <input
                    type="text"
                    value={referralCode}
                    onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                    placeholder="AAYUSH-AI"
                    className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono uppercase"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 mt-3"
            >
              <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <>
                  <span>Register Free & Launch Dashboard</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
            Already have an account?{' '}
            <Link href="/login" className="text-brand-cyan font-bold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <RegisterForm />
    </Suspense>
  );
}
