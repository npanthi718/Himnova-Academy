'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { 
  User, 
  Mail, 
  Phone, 
  Lock, 
  ShieldCheck, 
  Save, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle,
  Award,
  CreditCard,
  DollarSign
} from 'lucide-react';

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState<any | null>(null);
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [bio, setBio] = useState('');
  const [specialties, setSpecialties] = useState('');
  const [payoutAccount, setPayoutAccount] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [profileError, setProfileError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  useEffect(() => {
    api.getMe().then((u) => {
      setProfile(u);
      setFullName(u.fullName || '');
      setPhoneNumber(u.phoneNumber || '');
      setBio(u.bio || '');
      setSpecialties(u.specialties || '');
      setPayoutAccount(u.payoutAccount || '');
    }).catch(console.error);
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    setProfileSuccess('');
    setProfileError('');
    try {
      const updated = await api.updateProfile({
        fullName,
        phoneNumber,
        bio,
        specialties,
        payoutAccount,
      });
      setProfile(updated);
      setProfileSuccess('Instructor profile details updated successfully!');
    } catch (err: any) {
      setProfileError(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    setSavingPassword(true);
    setPasswordSuccess('');
    setPasswordError('');
    try {
      await api.changePassword({
        currentPassword,
        newPassword,
      });
      setPasswordSuccess('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setPasswordError(err.message || 'Failed to change password');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['TRAINER']}>
      <div className="max-w-4xl space-y-6">
        {/* Header */}
        <div className="border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold font-display text-white">Faculty Profile & Settings</h1>
          <p className="text-xs text-slate-400">Manage your instructor identity, payout account details, bio, and credentials</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Profile Edit Card */}
          <div className="p-6 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-blue-500/15 border border-blue-500/30 flex items-center justify-center font-bold text-blue-400 text-lg">
                {profile?.fullName?.slice(0, 2).toUpperCase() || 'TR'}
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">{profile?.fullName || 'Faculty Mentor'}</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  Role: Faculty Instructor
                </span>
              </div>
            </div>

            {profileSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono">
                <CheckCircle2 className="h-4 w-4" /> {profileSuccess}
              </p>
            )}
            {profileError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 font-mono">
                <AlertCircle className="h-4 w-4" /> {profileError}
              </p>
            )}

            <form onSubmit={handleUpdateProfile} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Email (Faculty ID)</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    disabled
                    value={profile?.email || ''}
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-950 border border-white/5 text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder="+977-98XXXXXXXX"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Payout Account (eSewa / Bank)</label>
                <div className="relative">
                  <CreditCard className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="e.g. eSewa: 9841XXXXXX or Nabil A/C"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Specialties & Tech Stack</label>
                <input
                  type="text"
                  value={specialties}
                  onChange={(e) => setSpecialties(e.target.value)}
                  placeholder="e.g. LangChain, Qdrant, Next.js, Go"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                />
              </div>

              <div>
                <label className="text-slate-300 block mb-1">Biography & Experience</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Senior AI Engineer with 6+ years in production LLMs..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans"
                />
              </div>

              <button
                type="submit"
                disabled={savingProfile}
                className="w-full py-2.5 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{savingProfile ? 'Saving Details...' : 'Save Profile Changes'}</span>
              </button>
            </form>
          </div>

          {/* Change Password Card */}
          <div className="p-6 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-5">
            <div className="flex items-center gap-2 text-white">
              <KeyRound className="h-5 w-5 text-amber-400" />
              <h3 className="text-base font-bold font-display">Change Password</h3>
            </div>

            {passwordSuccess && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 font-mono">
                <CheckCircle2 className="h-4 w-4" /> {passwordSuccess}
              </p>
            )}
            {passwordError && (
              <p className="text-xs text-red-400 flex items-center gap-1.5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 font-mono">
                <AlertCircle className="h-4 w-4" /> {passwordError}
              </p>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4 text-xs font-mono">
              <div>
                <label className="text-slate-300 block mb-1">Current Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-300 block mb-1">New Password *</label>
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

              <div>
                <label className="text-slate-300 block mb-1">Confirm New Password *</label>
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

              <div className="p-3 rounded-xl bg-alpine-950 text-[11px] text-slate-400 flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Encrypted faculty credential storage.</span>
              </div>

              <button
                type="submit"
                disabled={savingPassword}
                className="w-full py-2.5 rounded-xl bg-amber-500 text-alpine-950 font-bold hover:brightness-110 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                <KeyRound className="h-4 w-4" />
                <span>{savingPassword ? 'Updating Password...' : 'Update Password'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
