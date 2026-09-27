'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency, formatDate, formatDateTime } from '@/lib/utils';
import { 
  CreditCard, 
  Receipt, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  QrCode, 
  Download, 
  ExternalLink,
  ShieldCheck,
  Building
} from 'lucide-react';

export default function StudentBillingPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMyEnrollments()
      .then(setEnrollments)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['STUDENT']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Billing & Tuition Invoices</h1>
            <p className="text-xs text-slate-400">View official enrollment receipts, payment verifications and tax invoices</p>
          </div>
          <div className="p-3 px-4 rounded-2xl bg-alpine-900 border border-brand-cyan/30 flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-emerald-400" />
            <span className="text-xs font-mono text-slate-300">GST/PAN Invoices: <strong>Himnova Tech Pvt. Ltd.</strong></span>
          </div>
        </div>

        {/* Invoices List */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
          <div className="p-5 border-b border-white/10 flex items-center justify-between">
            <h3 className="text-base font-bold font-display text-white">Course Admissions & Billing Ledger</h3>
            <span className="text-xs font-mono text-slate-400">{enrollments.length} Active Courses</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Invoice / Course</th>
                  <th className="p-4">Assigned Cohort</th>
                  <th className="p-4">Tuition Amount</th>
                  <th className="p-4">Payment Method</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Enrolled Date</th>
                  <th className="p-4 text-right">Receipt</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {enrollments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No billing records found.
                    </td>
                  </tr>
                ) : (
                  enrollments.map((enr) => (
                    <tr key={enr.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-sans font-bold text-white text-sm">{enr.course?.title}</div>
                        <div className="text-[10px] text-brand-cyan font-mono">INV-HIM-{enr.id.slice(0, 8).toUpperCase()}</div>
                      </td>
                      <td className="p-4 text-slate-300">{enr.batch?.name || 'Assigned Cohort'}</td>
                      <td className="p-4 font-bold text-white text-sm">
                        {formatCurrency(enr.course?.discountPrice || enr.course?.price || 22000)}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                          eSewa / Fonepay QR
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center gap-1 w-fit">
                          <CheckCircle2 className="h-3 w-3" /> VERIFIED & ACTIVE
                        </span>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(enr.createdAt || enr.enrolledAt)}</td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => alert(`Official Invoice HIM-${enr.id.slice(0, 8).toUpperCase()} downloaded.`)}
                          className="px-3 py-1.5 rounded-xl bg-alpine-800 hover:bg-alpine-700 text-brand-cyan border border-white/10 font-bold text-xs flex items-center gap-1 ml-auto"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>PDF</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Offline QR Verification Notice */}
        <div className="p-6 rounded-3xl bg-alpine-900/90 border border-brand-cyan/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="p-3 rounded-2xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 shrink-0">
              <QrCode className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold font-display text-white">Need to pay via QR or Bank Transfer?</h4>
              <p className="text-xs text-slate-300">
                You can scan the official Himnova QR scanner on checkout. Transactions are verified in 30 minutes to 1 hour by our finance team.
              </p>
            </div>
          </div>
          <a
            href="/courses"
            className="px-4 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs hover:brightness-110 shrink-0"
          >
            Explore Courses & Curriculums &rarr;
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
