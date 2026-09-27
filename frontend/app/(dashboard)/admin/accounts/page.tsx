'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Plus, 
  CreditCard, 
  Receipt, 
  UserCheck, 
  Layers, 
  Trash2, 
  CheckCircle2, 
  Clock, 
  X,
  PieChart,
  Calendar
} from 'lucide-react';

export default function AdminAccountsPage() {
  const [overview, setOverview] = useState<any | null>(null);
  const [expenses, setExpenses] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Tab
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'EXPENSES' | 'PAYOUTS' | 'REFERRALS'>('OVERVIEW');

  // Expense Modal
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseTitle, setExpenseTitle] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('INFRASTRUCTURE');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expensePaymentMethod, setExpensePaymentMethod] = useState('BANK_TRANSFER');
  const [expenseDescription, setExpenseDescription] = useState('');

  // Payout Modal
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);
  const [selectedTrainerId, setSelectedTrainerId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutHours, setPayoutHours] = useState('20');
  const [payoutMethod, setPayoutMethod] = useState('ESEWA');
  const [payoutRef, setPayoutRef] = useState('');
  const [payoutNotes, setPayoutNotes] = useState('');

  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getFinancialOverview(),
      api.getExpenses(),
      api.getTrainerPayouts(),
      api.getAllReferrals().catch(() => []),
      api.getUsers({ role: 'TRAINER' }),
      api.getBatches(),
    ]).then(([overviewRes, expensesRes, payoutsRes, referralsRes, trainersRes, batchesRes]) => {
      setOverview(overviewRes);
      setExpenses(expensesRes);
      setPayouts(payoutsRes);
      setReferrals(referralsRes || []);
      setTrainers(trainersRes);
      setBatches(batchesRes);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateExpense = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseTitle || !expenseAmount) return;
    setSubmitting(true);
    try {
      await api.createExpense({
        title: expenseTitle,
        category: expenseCategory,
        amount: Number(expenseAmount),
        vendor: expenseVendor || undefined,
        paymentMethod: expensePaymentMethod,
        description: expenseDescription || undefined,
      });

      setIsExpenseModalOpen(false);
      setExpenseTitle('');
      setExpenseAmount('');
      setExpenseVendor('');
      setExpenseDescription('');
      loadData();
      alert('Expense recorded successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to record expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteExpense = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense record?')) return;
    try {
      await api.deleteExpense(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete expense');
    }
  };

  const handleCreatePayout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTrainerId || !payoutAmount) return;
    setSubmitting(true);
    try {
      await api.createTrainerPayout({
        trainerId: selectedTrainerId,
        batchId: selectedBatchId || undefined,
        amount: Number(payoutAmount),
        hoursTaught: Number(payoutHours) || 0,
        paymentMethod: payoutMethod,
        transactionRef: payoutRef || undefined,
        notes: payoutNotes || undefined,
      });

      setIsPayoutModalOpen(false);
      setSelectedTrainerId('');
      setSelectedBatchId('');
      setPayoutAmount('');
      setPayoutRef('');
      setPayoutNotes('');
      loadData();
      alert('Trainer payout recorded successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to disburse payout');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdatePayoutStatus = async (id: string, status: 'PAID' | 'CANCELLED') => {
    try {
      await api.updatePayoutStatus(id, { status, transactionRef: `TXN-PO-${Date.now()}` });
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  const handleDeletePayout = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trainer payout record?')) return;
    try {
      await api.deleteTrainerPayout(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete payout record');
    }
  };

  const handleUpdateReferralStatus = async (id: string, status: string) => {
    try {
      await api.updateReferralStatus(id, { status });
      loadData();
      alert(`Referral reward status updated to ${status}!`);
    } catch (err: any) {
      alert(err.message || 'Failed to update referral status');
    }
  };

  const handleDeleteReferral = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student referral record?')) return;
    try {
      await api.deleteReferral(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete referral record');
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Accounts & Financial Ledger</h1>
            <p className="text-xs text-slate-400">Track company revenue, operating expenditures, and instructor compensation payouts</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsExpenseModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-red-500/20 text-red-300 border border-red-500/30 hover:bg-red-500/30 font-bold text-xs transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Record Expense</span>
            </button>
            <button
              onClick={() => setIsPayoutModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Disburse Trainer Payout</span>
            </button>
          </div>
        </div>

        {/* Top Financial Stats Cards */}
        {overview && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-mono font-bold uppercase">Total Revenue</span>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {formatCurrency(overview.totalRevenue)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Verified admissions & payments
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-red-500/30 space-y-2">
              <div className="flex items-center justify-between text-red-400">
                <span className="text-xs font-mono font-bold uppercase">Total Expenses</span>
                <TrendingDown className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {formatCurrency(overview.totalExpenses)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Operations, servers & marketing
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs font-mono font-bold uppercase">Trainer Payouts</span>
                <UserCheck className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {formatCurrency(overview.totalTrainerPayouts)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                Disbursed to faculty mentors
              </div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-brand-cyan/30 space-y-2">
              <div className="flex items-center justify-between text-brand-cyan">
                <span className="text-xs font-mono font-bold uppercase">Net Profit Margin</span>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className={`text-2xl font-bold font-display ${overview.netProfit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {formatCurrency(overview.netProfit)}
              </div>
              <div className="text-[11px] font-mono text-brand-cyan">
                Margin: {overview.profitMarginPercentage}%
              </div>
            </div>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setActiveTab('OVERVIEW')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'OVERVIEW'
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Overview & Breakdown
          </button>
          <button
            onClick={() => setActiveTab('EXPENSES')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'EXPENSES'
                ? 'bg-red-500/20 text-red-300 border border-red-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Operating Expenses ({expenses.length})
          </button>
          <button
            onClick={() => setActiveTab('PAYOUTS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'PAYOUTS'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Trainer Payouts ({payouts.length})
          </button>
          <button
            onClick={() => setActiveTab('REFERRALS')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'REFERRALS'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Student Referral Rewards &amp; Giveaways ({referrals.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === 'OVERVIEW' && overview && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Expense Categories */}
            <div className="p-6 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-4">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <PieChart className="h-5 w-5 text-brand-cyan" />
                <span>Expenditure by Category</span>
              </h3>
              <div className="space-y-3">
                {overview.expensesByCategory && overview.expensesByCategory.length > 0 ? (
                  overview.expensesByCategory.map((cat: any, idx: number) => (
                    <div key={idx} className="space-y-1">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-300">{cat.category}</span>
                        <span className="text-white font-bold">{formatCurrency(cat._sum?.amount || 0)}</span>
                      </div>
                      <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-red-400 h-full rounded-full"
                          style={{
                            width: `${overview.totalExpenses > 0 ? ((cat._sum?.amount || 0) / overview.totalExpenses) * 100 : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-mono">No categorized expenditures recorded.</p>
                )}
              </div>
            </div>

            {/* Quick Summary Card */}
            <div className="p-6 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-4 font-mono text-xs">
              <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                <Receipt className="h-5 w-5 text-emerald-400" />
                <span>Executive Financial Health</span>
              </h3>
              <div className="p-4 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-2">
                <div className="flex justify-between text-slate-400">
                  <span>Gross Cohort Admissions:</span>
                  <span className="text-white">{overview.grossIncomeCount} Students</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Total Gross Inflow:</span>
                  <span className="text-emerald-400 font-bold">{formatCurrency(overview.totalRevenue)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Faculty & Mentor Costs:</span>
                  <span className="text-blue-400 font-bold">-{formatCurrency(overview.totalTrainerPayouts)}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Infrastructure & Cloud SLA:</span>
                  <span className="text-red-400 font-bold">-{formatCurrency(overview.totalExpenses)}</span>
                </div>
                <div className="pt-2 border-t border-white/10 flex justify-between text-sm font-bold">
                  <span className="text-white">Himnova Net Cashflow:</span>
                  <span className="text-brand-cyan">{formatCurrency(overview.netProfit)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: EXPENSES TABLE */}
        {activeTab === 'EXPENSES' && (
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-4">Expense Title</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Vendor</th>
                    <th className="p-4">Payment Method</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No expenses recorded yet.
                      </td>
                    </tr>
                  ) : (
                    expenses.map((exp) => (
                      <tr key={exp.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-sans font-semibold text-white">{exp.title}</td>
                        <td className="p-4">
                          <span className="px-2 py-0.5 rounded-full bg-red-500/15 text-red-300 border border-red-500/30 text-[10px]">
                            {exp.category}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{exp.vendor || 'N/A'}</td>
                        <td className="p-4 text-slate-400">{exp.paymentMethod}</td>
                        <td className="p-4 font-bold text-red-400">-{formatCurrency(exp.amount)}</td>
                        <td className="p-4 text-slate-500">{formatDate(exp.date)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDeleteExpense(exp.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400"
                            title="Delete Record"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: PAYOUTS TABLE */}
        {activeTab === 'PAYOUTS' && (
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-4">Trainer & Payout Account</th>
                    <th className="p-4">Batch / Cohort</th>
                    <th className="p-4">Hours Taught</th>
                    <th className="p-4">Amount</th>
                    <th className="p-4">Method & Ref</th>
                    <th className="p-4">Status</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {payouts.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
                        No trainer payouts recorded yet.
                      </td>
                    </tr>
                  ) : (
                    payouts.map((po) => (
                      <tr key={po.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-sans font-bold text-white">{po.trainer?.fullName}</div>
                          <div className="text-[10px] text-slate-400">{po.trainer?.payoutAccount || po.trainer?.email}</div>
                        </td>
                        <td className="p-4 text-slate-300">{po.batch?.name || 'General Faculty'}</td>
                        <td className="p-4 text-slate-300">{po.hoursTaught} hrs</td>
                        <td className="p-4 font-bold text-emerald-400">{formatCurrency(po.amount)}</td>
                        <td className="p-4">
                          <div>{po.paymentMethod}</div>
                          <div className="text-[10px] text-slate-500">{po.transactionRef || 'N/A'}</div>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            po.status === 'PAID'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {po.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {po.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdatePayoutStatus(po.id, 'PAID')}
                                className="px-2.5 py-1 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[11px] font-bold hover:bg-emerald-500/30"
                              >
                                Mark as Paid
                              </button>
                            )}
                            <button
                              onClick={() => handleDeletePayout(po.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                              title="Delete Payout Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STUDENT REFERRAL REWARDS & GIVEAWAYS */}
        {activeTab === 'REFERRALS' && (
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl space-y-4">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold font-display text-white flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-emerald-400" />
                  <span>Student Referral Program &amp; Cash Giveaway Ledger</span>
                </h3>
                <p className="text-xs text-slate-400">Review student-referred admissions, verify reward entitlements, and disburse cash rewards.</p>
              </div>
              <span className="text-xs font-mono text-emerald-400 font-bold">{referrals.length} Total Referrals</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-4">Referrer Student</th>
                    <th className="p-4">Referred New Student</th>
                    <th className="p-4">Reward Amount</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-slate-300">
                  {referrals.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        No student referral records found yet.
                      </td>
                    </tr>
                  ) : (
                    referrals.map((ref) => (
                      <tr key={ref.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-sans font-bold text-white">{ref.referrer?.fullName || 'Student'}</div>
                          <div className="text-[10px] text-slate-400">{ref.referrer?.email}</div>
                          {ref.referrer?.phoneNumber && (
                            <div className="text-[10px] text-brand-cyan">{ref.referrer.phoneNumber}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="font-sans font-bold text-slate-200">{ref.referee?.fullName || 'Enrolled Peer'}</div>
                          <div className="text-[10px] text-slate-400">{ref.referee?.email}</div>
                        </td>
                        <td className="p-4 font-bold text-emerald-400">
                          {formatCurrency(ref.rewardAmount || 1000)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            ref.status === 'DISBURSED' || ref.status === 'PAID'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : ref.status === 'REWARDED' || ref.status === 'QUALIFIED'
                              ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                              : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {ref.status || 'QUALIFIED'}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">
                          {new Date(ref.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {ref.status !== 'DISBURSED' && ref.status !== 'PAID' ? (
                              <button
                                onClick={() => handleUpdateReferralStatus(ref.id, 'DISBURSED')}
                                className="px-3 py-1 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-[11px] font-bold shadow-md hover:brightness-110 active:scale-95 transition-all"
                              >
                                Disburse Giveaway
                              </button>
                            ) : (
                              <span className="text-[10px] text-emerald-400 font-bold">✔ Disbursed</span>
                            )}
                            <button
                              onClick={() => handleDeleteReferral(ref.id)}
                              className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-colors"
                              title="Delete Referral Record"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Record Expense */}
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Record Operating Expense</h3>
                <button
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateExpense} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Expense Title *</label>
                  <input
                    type="text"
                    required
                    value={expenseTitle}
                    onChange={(e) => setExpenseTitle(e.target.value)}
                    placeholder="e.g. AWS Cloud Cluster & Qdrant Hosting"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Amount (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={expenseAmount}
                      onChange={(e) => setExpenseAmount(e.target.value)}
                      placeholder="12000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Category</label>
                    <select
                      value={expenseCategory}
                      onChange={(e) => setExpenseCategory(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="INFRASTRUCTURE">Infrastructure & Cloud</option>
                      <option value="MARKETING">Marketing & Ads</option>
                      <option value="SOFTWARE_LICENSES">Software Licenses</option>
                      <option value="OFFICE_SUPPLIES">Office & Operations</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Vendor</label>
                    <input
                      type="text"
                      value={expenseVendor}
                      onChange={(e) => setExpenseVendor(e.target.value)}
                      placeholder="e.g. Amazon Web Services"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Payment Method</label>
                    <input
                      type="text"
                      value={expensePaymentMethod}
                      onChange={(e) => setExpensePaymentMethod(e.target.value)}
                      placeholder="e.g. Corporate Card, Bank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-red-500 text-white font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Recording...' : 'Record Expense'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Trainer Payout */}
        {isPayoutModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Disburse Trainer Payout</h3>
                <button
                  onClick={() => setIsPayoutModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreatePayout} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Select Trainer *</label>
                  <select
                    required
                    value={selectedTrainerId}
                    onChange={(e) => setSelectedTrainerId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- Choose Instructor --</option>
                    {trainers.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.fullName} ({t.payoutAccount || t.email}) - Rate: NPR {t.hourlyRate || 1500}/hr
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Batch / Cohort</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- General / Multiple Batches --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Payout Amount (NPR) *</label>
                    <input
                      type="number"
                      required
                      value={payoutAmount}
                      onChange={(e) => setPayoutAmount(e.target.value)}
                      placeholder="30000"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Hours Taught</label>
                    <input
                      type="number"
                      value={payoutHours}
                      onChange={(e) => setPayoutHours(e.target.value)}
                      placeholder="20"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1">Disbursement Method</label>
                    <input
                      type="text"
                      value={payoutMethod}
                      onChange={(e) => setPayoutMethod(e.target.value)}
                      placeholder="eSewa, Khalti, Bank"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Transaction Ref Code</label>
                    <input
                      type="text"
                      value={payoutRef}
                      onChange={(e) => setPayoutRef(e.target.value)}
                      placeholder="TXN987654"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsPayoutModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Disbursing...' : 'Disburse Payout'}
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
