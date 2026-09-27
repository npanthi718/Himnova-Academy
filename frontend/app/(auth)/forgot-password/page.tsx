'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api-client';
import { 
  KeyRound, 
  Mail, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<'REQUEST' | 'RESET'>('REQUEST');
  const [email, setEmail] = useState('');
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [resetCompleted, setResetCompleted] = useState(false);

  const handleRequestReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await api.forgotPassword(email.trim());
      setMessage(res.message || 'If an account exists, a password reset token has been dispatched.');
      if (res.debugToken) {
        setToken(res.debugToken);
      }
      setStep('RESET');
    } catch (err: any) {
      setError(err.message || 'Failed to request password reset');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.resetPassword({
        token: token.trim(),
        password: newPassword,
      });
      setResetCompleted(true);
    } catch (err: any) {
      setError(err.message || 'Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-space-950 text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 py-16 relative">
        {/* Glow Effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md space-y-6 relative z-10">
          {/* Brand header */}
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold">
              <KeyRound className="h-3.5 w-3.5" /> Security Recovery Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">
              {resetCompleted ? 'Password Recovered!' : step === 'REQUEST' ? 'Forgot Password?' : 'Enter Recovery Token'}
            </h1>
            <p className="text-xs text-slate-400">
              {resetCompleted
                ? 'Your password has been successfully reset. You can now login.'
                : step === 'REQUEST'
                  ? 'Enter your registered email address to receive a secure password reset token.'
                  : 'Enter the verification token and choose your new password.'}
            </p>
          </div>

          {/* Form Card */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-alpine-900/80 backdrop-blur-2xl shadow-2xl space-y-5">
            {error && (
              <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {message && (
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-start gap-2">
                <CheckCircle2 className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{message}</span>
              </div>
            )}

            {resetCompleted ? (
              <div className="space-y-4 text-center py-4">
                <div className="h-14 w-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <Link
                  href="/login"
                  className="w-full py-3.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs flex items-center justify-center gap-2 hover:brightness-110 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Return to Sign In</span>
                </Link>
              </div>
            ) : step === 'REQUEST' ? (
              <form onSubmit={handleRequestReset} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-mono uppercase font-bold text-slate-300">
                    Account Email
                  </label>
                  <div className="relative">
                    <Mail className="h-4 w-4 text-slate-500 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@himnovatech.com"
                      className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Sending Token...</span>
                    </>
                  ) : (
                    <span>Send Reset Instructions</span>
                  )}
                </button>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4 text-xs font-mono">
                <div className="space-y-1">
                  <label className="text-slate-300 block font-bold">Verification Token *</label>
                  <input
                    type="text"
                    required
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    placeholder="Enter reset token"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none uppercase"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block font-bold">New Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Min 8 characters"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-slate-300 block font-bold">Confirm New Password *</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                    <input
                      type="password"
                      required
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Repeat new password"
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <span>Set New Password & Complete</span>
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 border-t border-white/10 text-center">
              <Link
                href="/login"
                className="text-xs font-mono text-slate-400 hover:text-brand-cyan flex items-center justify-center gap-1.5 transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" /> Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
