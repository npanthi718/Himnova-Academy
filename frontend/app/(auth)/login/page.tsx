'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { HimnovaLogo } from '@/components/brand/HimnovaLogo';
import {
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  RefreshCw,
  Terminal,
} from 'lucide-react';

export default function LoginPage() {
  const { login, quickDemoLogin, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setErrorMsg('');
    setSubmitting(true);
    try {
      await login({ email, password, rememberMe });
    } catch (err: any) {
      setErrorMsg(err.message || 'Authentication failed. Please verify your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillDemo = (role: 'admin' | 'trainer' | 'student') => {
    if (role === 'admin') {
      setEmail('admin@himnova.com');
      setPassword('Admin@123');
    } else if (role === 'trainer') {
      setEmail('trainer@himnova.com');
      setPassword('Trainer@123');
    } else {
      setEmail('student@himnova.com');
      setPassword('Student@123');
    }
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative selection:bg-brand-cyan selection:text-slate-900">
      {/* Noise */}
      <div className="noise-overlay" />

      {/* Cyber Glowing Orbs */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-cyan/15 rounded-full blur-[160px] pointer-events-none" />

      <div className="w-full max-w-md space-y-6 relative z-10">
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center text-center space-y-3">
          <HimnovaLogo size="lg" />
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Launchpad Sign In
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Enter your credentials to access your courses, live classes and portfolios
            </p>
          </div>
        </div>

        {/* Demo Accounts Quick-Fill Box */}
        <div className="p-4 rounded-2xl bg-alpine-900/90 border border-brand-cyan/30 shadow-lg shadow-brand-cyan/10 backdrop-blur-xl space-y-2.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-bold text-brand-cyan flex items-center gap-1.5 uppercase">
              <Terminal className="h-3.5 w-3.5" /> Instant Demo Sign-In
            </span>
            <span className="text-[10px] text-slate-400 font-mono">1-Click Access</span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => fillDemo('admin')}
              className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-400 text-xs font-bold transition-all text-center"
            >
              Super Admin
            </button>
            <button
              type="button"
              onClick={() => fillDemo('trainer')}
              className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/30 hover:bg-purple-500/20 text-purple-400 text-xs font-bold transition-all text-center"
            >
              Lead Trainer
            </button>
            <button
              type="button"
              onClick={() => fillDemo('student')}
              className="p-2 rounded-xl bg-brand-cyan/10 border border-brand-cyan/30 hover:bg-brand-cyan/20 text-brand-cyan text-xs font-bold transition-all text-center"
            >
              AI Student
            </button>
          </div>
        </div>

        {/* Login Card */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-alpine-900/80 backdrop-blur-2xl shadow-2xl space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
              <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-mono uppercase font-bold text-slate-300">
                Email Address
              </label>
              <div className="relative">
                <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@himnova.com"
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-mono uppercase font-bold text-slate-300">
                  Password
                </label>
                <Link href="/forgot-password" className="text-[11px] text-brand-cyan hover:underline">
                  Forgot?
                </Link>
              </div>
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

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-800 text-brand-cyan focus:ring-brand-cyan"
                />
                <span>Remember session for 7 days</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all disabled:opacity-50 mt-2"
            >
              <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
              {submitting ? (
                <>
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Launchpad</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-center text-xs text-slate-400 border-t border-white/5">
            Don&apos;t have a student account yet?{' '}
            <Link href="/register" className="text-brand-cyan font-bold hover:underline">
              Create Free Account
            </Link>
          </div>
        </div>

        <div className="text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-slate-300 transition-colors">
            ← Return to Himnova Launchpad Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
