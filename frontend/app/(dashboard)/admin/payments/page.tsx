'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency, formatDateTime } from '@/lib/utils';
import { useAppModal } from '@/lib/modal-context';
import { 
  CreditCard, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  QrCode, 
  Clock, 
  Check, 
  X, 
  ExternalLink,
  Eye,
  Filter,
  ShieldCheck,
  UserCheck,
  Sparkles,
  Trash2
} from 'lucide-react';

export default function AdminPaymentsPage() {
  const { showAlert, showConfirm } = useAppModal();
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'PENDING_QR' | 'COMPLETED' | 'ALL'>('PENDING_QR');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);
  const [inspectingPayment, setInspectingPayment] = useState<any | null>(null);

  const loadData = () => {
    setLoading(true);
    api.getAdminTransactions()
      .then(setPayments)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const isPendingStatus = (status: string) => {
    return ['PENDING', 'PENDING_VERIFICATION', 'CLAIMED'].includes(status);
  };

  const handleDeletePayment = async (id: string) => {
    const confirmed = await showConfirm({
      title: 'Delete Payment Record',
      message: 'Are you sure you want to permanently delete this payment transaction record from the database? This action cannot be undone.',
      confirmText: 'Yes, Delete Record',
      type: 'danger',
    });
    if (!confirmed) return;
    setActionLoading(id);
    try {
      await api.deletePayment(id);
      loadData();
      await showAlert({
        title: 'Payment Record Deleted',
        message: 'The transaction record was permanently deleted from the ledger.',
        type: 'success',
      });
    } catch (err: any) {
      await showAlert({
        title: 'Deletion Failed',
        message: err.message || 'Failed to delete payment record',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleVerifyClaim = async (orderId: string, status: 'COMPLETED' | 'FAILED') => {
    const isApproved = status === 'COMPLETED';
    const reason = status === 'FAILED' ? 'Rejected by finance administrator' : 'Verified & Activated by Super Admin';
    setActionLoading(orderId);
    try {
      const res = await api.verifyManualClaim(orderId, {
        status,
        isApproved,
        adminNotes: reason,
      });

      if (res && res.success === false && isApproved) {
        throw new Error(res.message || 'Backend rejected verification');
      }

      await showAlert({
        title: isApproved ? 'Transaction Approved & Verified' : 'Claim Rejected',
        message: isApproved 
          ? 'Transaction Verified! Student has been granted full course access and assigned to active cohort batch.' 
          : 'Payment claim marked as rejected.',
        type: isApproved ? 'success' : 'warning',
      });
      if (inspectingPayment?.orderId === orderId) {
        setInspectingPayment(null);
      }
      loadData();
    } catch (err: any) {
      await showAlert({
        title: 'Verification Failed',
        message: err.message || 'Failed to process verification',
        type: 'error',
      });
    } finally {
      setActionLoading(null);
    }
  };


  const pendingClaims = payments.filter((p) => isPendingStatus(p.status));
  const completedPayments = payments.filter((p) => p.status === 'COMPLETED');
  const totalRevenue = completedPayments.reduce((sum, p) => sum + p.amount, 0);

  const displayedList = tab === 'PENDING_QR' 
    ? pendingClaims 
    : tab === 'COMPLETED' 
      ? completedPayments 
      : payments;

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold uppercase">
                Financial Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Payments & QR Verification Hub
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Review offline bank & wallet QR claims, inspect transaction slips, approve admissions, and manage the student revenue ledger
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-3 px-4 rounded-2xl bg-alpine-900 border border-white/10 flex items-center gap-3 shadow-lg">
              <span className="text-xs font-mono text-slate-400">Total Net Revenue:</span>
              <span className="text-lg font-extrabold font-display text-emerald-400">{formatCurrency(totalRevenue)}</span>
            </div>
            <button
              onClick={loadData}
              className="p-3 rounded-2xl bg-alpine-850 hover:bg-alpine-800 text-slate-300 border border-white/10 transition-colors shadow-lg"
              title="Refresh Data"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2">
          <button
            onClick={() => setTab('PENDING_QR')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'PENDING_QR'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-md shadow-amber-500/10'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="h-4 w-4" />
            <span>Pending QR Claims ({pendingClaims.length})</span>
            {pendingClaims.length > 0 && (
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-ping"></span>
            )}
          </button>
          <button
            onClick={() => setTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'COMPLETED'
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <CheckCircle2 className="h-4 w-4" />
            <span>Completed Payments ({completedPayments.length})</span>
          </button>
          <button
            onClick={() => setTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              tab === 'ALL'
                ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Filter className="h-4 w-4" />
            <span>All Transactions ({payments.length})</span>
          </button>
        </div>

        {/* Table / List */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Order ID & Date</th>
                  <th className="p-4">Student & Contact</th>
                  <th className="p-4">Course Track</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Txn Code & Slip</th>
                  <th className="p-4">Tuition Amount</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {displayedList.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-500">
                      No records found in this category.
                    </td>
                  </tr>
                ) : (
                  displayedList.map((p) => {
                    const isPending = isPendingStatus(p.status);

                    return (
                      <tr key={p.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4">
                          <div className="font-bold text-brand-cyan">{p.orderId}</div>
                          <div className="text-[10px] text-slate-500">{formatDateTime(p.createdAt)}</div>
                        </td>
                        <td className="p-4 font-sans">
                          <div className="font-semibold text-white">{p.user?.fullName || 'N/A'}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{p.user?.email}</div>
                          {p.senderPhone && (
                            <div className="text-[10px] text-brand-cyan font-mono mt-0.5">{p.senderPhone}</div>
                          )}
                        </td>
                        <td className="p-4 text-slate-300 max-w-xs font-sans">
                          <p className="line-clamp-1 font-bold text-white">{p.course?.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{p.course?.slug}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-xl text-[10px] font-bold inline-block ${
                            p.provider === 'OFFLINE_QR' || p.provider === 'MANUAL_QR' || p.provider === 'QR_PAYMENT'
                              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                              : p.provider === 'ESEWA'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                          }`}>
                            {p.bankWalletName ? `${p.provider} (${p.bankWalletName})` : p.provider}
                          </span>
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-white font-mono">{p.providerTransactionId || p.orderId}</div>
                          {p.senderName && (
                            <div className="text-[10px] text-slate-400">Sender: {p.senderName}</div>
                          )}
                          {p.receiptScreenshotUrl && (
                            <button
                              onClick={() => setSelectedScreenshot(p.receiptScreenshotUrl)}
                              className="text-[10px] text-brand-cyan hover:underline flex items-center gap-1 mt-1 font-bold"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Slip Screenshot
                            </button>
                          )}
                        </td>
                        <td className="p-4 font-bold text-white text-sm">{formatCurrency(p.amount)}</td>
                        <td className="p-4">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 w-fit ${
                            p.status === 'COMPLETED'
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : isPending
                                ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 animate-pulse'
                                : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}>
                            {p.status === 'COMPLETED' ? (
                              <CheckCircle2 className="h-3 w-3" />
                            ) : isPending ? (
                              <Clock className="h-3 w-3" />
                            ) : (
                              <X className="h-3 w-3" />
                            )}
                            {p.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          {isPending ? (
                            <div className="flex items-center justify-end gap-2">
                              {p.receiptScreenshotUrl && (
                                <button
                                  onClick={() => setSelectedScreenshot(p.receiptScreenshotUrl)}
                                  className="p-1.5 rounded-lg bg-white/5 text-slate-300 hover:text-white border border-white/10"
                                  title="Inspect Proof Slip"
                                >
                                  <Eye className="h-3.5 w-3.5" />
                                </button>
                              )}
                              <button
                                onClick={() => handleVerifyClaim(p.orderId, 'COMPLETED')}
                                disabled={actionLoading === p.orderId}
                                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
                                title="Approve Payment & Grant Full Course Access"
                              >
                                <Check className="h-3.5 w-3.5" />
                                <span>Approve</span>
                              </button>
                              <button
                                onClick={() => handleVerifyClaim(p.orderId, 'FAILED')}
                                disabled={actionLoading === p.orderId}
                                className="p-1.5 rounded-xl bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-400 font-bold text-xs flex items-center gap-1 disabled:opacity-50"
                                title="Reject Claim"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeletePayment(p.id)}
                                disabled={actionLoading === p.id}
                                className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"
                                title="Delete Record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end gap-2">
                              {p.receiptScreenshotUrl && (
                                <button
                                  onClick={() => setSelectedScreenshot(p.receiptScreenshotUrl)}
                                  className="p-1 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                                  title="View Proof Slip"
                                >
                                  <Eye className="h-3 w-3" />
                                </button>
                              )}
                              <span className="text-emerald-400 text-[11px] font-bold flex items-center gap-1 mr-1">
                                <UserCheck className="h-3.5 w-3.5" /> Enrolled
                              </span>
                              <button
                                onClick={() => handleDeletePayment(p.id)}
                                disabled={actionLoading === p.id}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/40 text-slate-400 hover:text-red-400 transition-colors"
                                title="Delete Payment Record"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Screenshot / Slip Proof Inspection Modal */}
        {selectedScreenshot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-2xl w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Eye className="h-5 w-5 text-brand-cyan" />
                  <span>Payment Receipt / QR Claim Slip</span>
                </div>
                <button
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[70vh] overflow-auto rounded-2xl border border-white/10 bg-black/60 p-3 flex items-center justify-center">
                <img
                  src={selectedScreenshot}
                  alt="Payment Receipt Slip"
                  className="max-h-full max-w-full object-contain rounded-xl shadow-lg"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] font-mono text-slate-400">
                  Verify transaction code, sender name, and amount against bank statement
                </span>
                <a
                  href={selectedScreenshot}
                  target="_blank"
                  rel="noreferrer"
                  className="px-4 py-2 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-xs font-bold hover:bg-brand-cyan/30 flex items-center gap-1.5"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  <span>Open Fullscreen</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
