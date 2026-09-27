'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { 
  DollarSign, 
  TrendingUp, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  Calendar, 
  Layers, 
  Building 
} from 'lucide-react';

export default function TrainerEarningsPage() {
  const [earningsData, setEarningsData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyTrainerEarnings()
      .then(setEarningsData)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['TRAINER']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Faculty Earnings & Payout Ledger</h1>
            <p className="text-xs text-slate-400">Track your verified teaching hours, disbursement history, and bank account status</p>
          </div>
          {earningsData && (
            <div className="p-3 px-4 rounded-2xl bg-alpine-900 border border-emerald-500/30 flex items-center gap-3">
              <span className="text-xs font-mono text-slate-400">Total Lifetime Disbursed:</span>
              <span className="text-lg font-extrabold font-display text-emerald-400">
                {formatCurrency(earningsData.totalPaid)}
              </span>
            </div>
          )}
        </div>

        {/* Stats Cards */}
        {earningsData && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-2">
              <div className="flex items-center justify-between text-brand-cyan">
                <span className="text-xs font-mono font-bold uppercase">Contract Hourly Rate</span>
                <DollarSign className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {formatCurrency(earningsData.hourlyRate)} / hr
              </div>
              <div className="text-[11px] font-mono text-slate-400">Base compensation tier</div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-blue-500/30 space-y-2">
              <div className="flex items-center justify-between text-blue-400">
                <span className="text-xs font-mono font-bold uppercase">Teaching Hours</span>
                <Clock className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-white">
                {earningsData.totalHoursTaught} hrs
              </div>
              <div className="text-[11px] font-mono text-slate-400">Live lecture time logged</div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-emerald-500/30 space-y-2">
              <div className="flex items-center justify-between text-emerald-400">
                <span className="text-xs font-mono font-bold uppercase">Paid Out</span>
                <CheckCircle2 className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-emerald-400">
                {formatCurrency(earningsData.totalPaid)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Transferred to your account</div>
            </div>

            <div className="p-5 rounded-3xl bg-alpine-900/80 border border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between text-amber-300">
                <span className="text-xs font-mono font-bold uppercase">Pending Settlement</span>
                <TrendingUp className="h-5 w-5" />
              </div>
              <div className="text-2xl font-bold font-display text-amber-300">
                {formatCurrency(earningsData.pendingPayout)}
              </div>
              <div className="text-[11px] font-mono text-slate-400">Scheduled for disbursement</div>
            </div>
          </div>
        )}

        {/* Payout Account Info Box */}
        {earningsData?.payoutAccount && (
          <div className="p-4 rounded-2xl bg-alpine-900/90 border border-brand-cyan/20 flex items-center justify-between text-xs font-mono">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                <CreditCard className="h-4 w-4" />
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Registered Disbursement Destination:</span>
                <span className="text-white font-bold">{earningsData.payoutAccount}</span>
              </div>
            </div>
            <a
              href="/trainer/profile"
              className="text-brand-cyan hover:underline font-bold"
            >
              Edit Account Info &rarr;
            </a>
          </div>
        )}

        {/* Payout History Table */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl space-y-3">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">Disbursement Statements & Receipts</h3>
            <span className="text-xs font-mono text-slate-400">
              {earningsData?.payouts?.length || 0} Transactions
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Batch / Purpose</th>
                  <th className="p-4">Hours Logged</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Method & Ref</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Disbursed Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {!earningsData?.payouts || earningsData.payouts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No payout records found yet.
                    </td>
                  </tr>
                ) : (
                  earningsData.payouts.map((p: any) => (
                    <tr key={p.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-sans font-semibold text-white">
                        {p.batch?.name || 'Curriculum Delivery'}
                      </td>
                      <td className="p-4 text-slate-300">{p.hoursTaught} hrs</td>
                      <td className="p-4 font-bold text-emerald-400">{formatCurrency(p.amount)}</td>
                      <td className="p-4">
                        <div className="text-white">{p.paymentMethod}</div>
                        <div className="text-[10px] text-slate-500">{p.transactionRef || 'N/A'}</div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.status === 'PAID'
                            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                            : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(p.createdAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
