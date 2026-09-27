'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { 
  UserCheck, 
  Plus, 
  Search, 
  Mail, 
  Phone, 
  Layers, 
  DollarSign, 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  X,
  Award,
  History,
  Edit3,
  KeyRound,
  Trash2,
  Video,
  Clock,
  BookOpen
} from 'lucide-react';

export default function AdminTrainersPage() {
  const [trainers, setTrainers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [trainerForHistory, setTrainerForHistory] = useState<any | null>(null);
  const [historyData, setHistoryData] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [trainerForEdit, setTrainerForEdit] = useState<any | null>(null);
  const [trainerForResetPass, setTrainerForResetPass] = useState<any | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('Trainer@123');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [hourlyRate, setHourlyRate] = useState('1500');
  const [payoutAccount, setPayoutAccount] = useState('eSewa ID: 98XXXXXXXX');
  const [specialties, setSpecialties] = useState('LangChain, Python, Next.js');
  const [newAdminPassword, setNewAdminPassword] = useState('HimnovaTrainer@2026!');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getUsers({ role: 'TRAINER' }),
      api.getBatches()
    ]).then(([trainersRes, batchesRes]) => {
      setTrainers(trainersRes);
      setBatches(batchesRes);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const openHistoryModal = async (trainer: any) => {
    setTrainerForHistory(trainer);
    setHistoryLoading(true);
    try {
      const hist = await api.getUserHistory(trainer.id);
      setHistoryData(hist);
    } catch (err: any) {
      alert(err.message || 'Failed to load trainer history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const openEditModal = (trainer: any) => {
    setTrainerForEdit(trainer);
    setFullName(trainer.fullName);
    setEmail(trainer.email);
    setPhoneNumber(trainer.phoneNumber || '');
    setAvatarUrl(trainer.avatarUrl || '');
    setHourlyRate(trainer.hourlyRate ? String(trainer.hourlyRate) : '1500');
    setPayoutAccount(trainer.payoutAccount || '');
    setSpecialties(trainer.specialties || '');
  };

  const openRegisterModal = () => {
    setFullName('');
    setEmail('');
    setPassword('Trainer@123');
    setPhoneNumber('');
    setAvatarUrl('');
    setHourlyRate('1500');
    setPayoutAccount('eSewa ID: 98XXXXXXXX');
    setSpecialties('LangChain, Python, Next.js');
    setIsRegisterModalOpen(true);
  };

  const openResetPassModal = (trainer: any) => {
    setTrainerForResetPass(trainer);
    setNewAdminPassword('HimnovaTrainer@2026!');
  };

  const handleRegisterTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setSubmitting(true);
    try {
      await api.createUser({
        fullName,
        email,
        password,
        phoneNumber: phoneNumber || undefined,
        avatarUrl: avatarUrl || undefined,
        role: 'TRAINER',
        hourlyRate: Number(hourlyRate) || 0,
        payoutAccount: payoutAccount || undefined,
        specialties: specialties || undefined,
      });

      setIsRegisterModalOpen(false);
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setAvatarUrl('');
      loadData();
      alert('Trainer registered successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to register trainer');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminUpdateTrainer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerForEdit) return;
    setSubmitting(true);
    try {
      await api.adminUpdateUser(trainerForEdit.id, {
        fullName,
        email,
        phoneNumber,
        avatarUrl: avatarUrl || undefined,
        hourlyRate: Number(hourlyRate) || 0,
        payoutAccount,
        specialties,
      });
      setTrainerForEdit(null);
      loadData();
      alert('Trainer profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update trainer profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerForResetPass || !newAdminPassword) return;
    setSubmitting(true);
    try {
      await api.adminResetPassword(trainerForResetPass.id, newAdminPassword);
      setTrainerForResetPass(null);
      alert(`Password successfully changed to "${newAdminPassword}" for ${trainerForResetPass.fullName}`);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTrainer = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete instructor "${name}"?`)) return;
    try {
      await api.deleteUser(id);
      loadData();
      alert('Instructor removed from database.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete trainer');
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateUserStatus(id, !currentStatus);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update trainer status');
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Instructors & Mentors Omnipotent Hub</h1>
            <p className="text-xs text-slate-400">Complete faculty control: inspect teaching histories, audit logs, hourly rates, and payout accounts</p>
          </div>
          <button
            onClick={openRegisterModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Register New Instructor</span>
          </button>
        </div>

        {/* Trainers List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
              Loading instructor directory from database...
            </div>
          ) : trainers.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
              No trainers registered yet. Click &quot;Register New Instructor&quot; to add.
            </div>
          ) : (
            trainers.map((trainer) => (
              <div
                key={trainer.id}
                className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 hover:border-brand-cyan/40 transition-all flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-2xl bg-brand-cyan/15 border border-brand-cyan/30 flex items-center justify-center font-bold text-brand-cyan text-base overflow-hidden">
                        {trainer.avatarUrl ? (
                          <img src={trainer.avatarUrl} alt={trainer.fullName} className="h-full w-full object-cover" />
                        ) : (
                          trainer.fullName?.slice(0, 2).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold font-display text-white">{trainer.fullName}</h3>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          Teacher ID: #{trainer.id.slice(0, 8)}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleStatus(trainer.id, trainer.isActive)}
                      className={`p-1.5 rounded-lg border transition-colors ${
                        trainer.isActive
                          ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/25'
                          : 'bg-red-500/15 text-red-400 border-red-500/30 hover:bg-red-500/25'
                      }`}
                      title={trainer.isActive ? 'Active (Click to disable)' : 'Disabled (Click to activate)'}
                    >
                      {trainer.isActive ? <CheckCircle2 className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                    </button>
                  </div>

                  {/* Details */}
                  <div className="mt-4 space-y-2 text-xs font-mono text-slate-300">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3.5 w-3.5 text-slate-500" />
                      <span className="truncate">{trainer.email}</span>
                    </div>
                    {trainer.phoneNumber && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3.5 w-3.5 text-slate-500" />
                        <span>{trainer.phoneNumber}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-emerald-400 font-bold">
                      <DollarSign className="h-3.5 w-3.5" />
                      <span>Compensation: {formatCurrency(trainer.hourlyRate || 1500)} / hr</span>
                    </div>
                    {trainer.payoutAccount && (
                      <div className="flex items-center gap-2 text-brand-cyan">
                        <CreditCard className="h-3.5 w-3.5" />
                        <span className="truncate">{trainer.payoutAccount}</span>
                      </div>
                    )}
                    {trainer.specialties && (
                      <div className="pt-2">
                        <span className="text-[10px] text-slate-500 block mb-1">Tech Specialties:</span>
                        <div className="flex flex-wrap gap-1">
                          {trainer.specialties.split(',').map((s: string, idx: number) => (
                            <span key={idx} className="text-[10px] px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-slate-300">
                              {s.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Omni Action Buttons */}
                <div className="pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">
                    {trainer.assignedBatches?.length || 0} Cohorts
                  </span>
                  <div className="flex items-center gap-1.5">
                    {/* 1. View History */}
                    <button
                      onClick={() => openHistoryModal(trainer)}
                      className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25"
                      title="Inspect Instructor History & Payouts"
                    >
                      <History className="h-3.5 w-3.5" />
                    </button>

                    {/* 2. Edit Profile */}
                    <button
                      onClick={() => openEditModal(trainer)}
                      className="p-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10"
                      title="Edit Instructor Compensation & Account"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>

                    {/* 3. Reset Password */}
                    <button
                      onClick={() => openResetPassModal(trainer)}
                      className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25"
                      title="Set/Reset Password"
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                    </button>

                    {/* 4. Delete Account */}
                    <button
                      onClick={() => handleDeleteTrainer(trainer.id, trainer.fullName)}
                      className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25"
                      title="Delete Instructor"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* MODAL 1: INSTRUCTOR FULL HISTORY */}
        {trainerForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-4xl w-full my-6 bg-alpine-900 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-brand-cyan" />
                    <span>Faculty Teaching & Financial Record: {trainerForHistory.fullName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{trainerForHistory.email}</p>
                </div>
                <button onClick={() => setTrainerForHistory(null)} className="p-2 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              {historyLoading || !historyData ? (
                <div className="py-16 text-center text-slate-400 font-mono text-xs">
                  Loading teaching history and payout statements...
                </div>
              ) : (
                <div className="space-y-6 text-xs font-mono">
                  {/* Assigned Batches */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-brand-cyan flex items-center gap-1.5">
                      <Layers className="h-4 w-4" />
                      <span>Assigned Cohorts & Active Student Count ({historyData.assignedBatches?.length || 0})</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {historyData.assignedBatches?.map((b: any) => (
                        <div key={b.id} className="p-3.5 rounded-xl bg-alpine-900 border border-white/5 space-y-1">
                          <div className="font-bold text-white font-sans text-sm">{b.name}</div>
                          <div className="text-[11px] text-slate-400">Course: {b.course?.title}</div>
                          <div className="text-[11px] text-emerald-400">{b.students?.length || 0} Enrolled Students</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Payout History */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                      <DollarSign className="h-4 w-4" />
                      <span>Disbursed Faculty Payouts ({historyData.trainerPayouts?.length || 0})</span>
                    </h4>
                    <div className="space-y-2">
                      {historyData.trainerPayouts?.length === 0 ? (
                        <p className="text-slate-500">No payout records found.</p>
                      ) : (
                        historyData.trainerPayouts?.map((po: any) => (
                          <div key={po.id} className="p-3 rounded-xl bg-alpine-900 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-white">{po.batch?.name || 'General Instruction'}</span>
                              <span className="text-slate-400 block text-[11px]">{po.hoursTaught} hrs • {po.paymentMethod}</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-emerald-400 text-sm">{formatCurrency(po.amount)}</span>
                              <span className="block text-[10px] text-slate-500">{po.status} ({formatDate(po.createdAt)})</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: REGISTER INSTRUCTOR */}
        {isRegisterModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Register New Instructor</h3>
                <button onClick={() => setIsRegisterModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleRegisterTrainer} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Er. Sushil Panthi"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Work Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="trainer@himnovatech.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Default Password *</label>
                    <input
                      type="text"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+977-98XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Hourly Rate (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      placeholder="1500"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Payout Account (eSewa / Bank)</label>
                  <input
                    type="text"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    placeholder="e.g. eSewa: 9841XXXXXX or Nabil A/C"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Specialties & Tech Stack</label>
                  <input
                    type="text"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    placeholder="e.g. LangChain, Qdrant, Next.js, Cloud DevOps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Profile Photo / Avatar URL (Optional)</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /logos/trainer.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsRegisterModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Registering...' : 'Register Instructor'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: EDIT INSTRUCTOR */}
        {trainerForEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Edit Instructor Profile</h3>
                <button onClick={() => setTrainerForEdit(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdminUpdateTrainer} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Hourly Rate (NPR)</label>
                    <input
                      type="number"
                      value={hourlyRate}
                      onChange={(e) => setHourlyRate(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Payout Account</label>
                  <input
                    type="text"
                    value={payoutAccount}
                    onChange={(e) => setPayoutAccount(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Specialties</label>
                  <input
                    type="text"
                    value={specialties}
                    onChange={(e) => setSpecialties(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Profile Photo / Avatar URL</label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... or /logos/trainer.png"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTrainerForEdit(null)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: RESET PASSWORD */}
        {trainerForResetPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Reset Instructor Password</h3>
                  <p className="text-xs text-slate-400 font-mono">{trainerForResetPass.fullName} ({trainerForResetPass.email})</p>
                </div>
                <button onClick={() => setTrainerForResetPass(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">New Password *</label>
                  <input
                    type="text"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setTrainerForResetPass(null)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Resetting...' : 'Set Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
