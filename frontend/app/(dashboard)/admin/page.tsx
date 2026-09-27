'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  Users,
  BookOpen,
  CreditCard,
  Award,
  TrendingUp,
  Activity,
  ShieldCheck,
  CalendarCheck,
  FileCheck,
  Share2,
  Terminal,
  ArrowUpRight,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

export default function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getAdminSummary(),
      api.getAuditLogs({ limit: 6 }),
    ])
      .then(([summaryData, logsData]) => {
        setMetrics(summaryData);
        setAuditLogs(logsData || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
        <div className="h-64 flex items-center justify-center text-slate-400 font-mono text-xs">
          Loading command center telemetry...
        </div>
      </DashboardLayout>
    );
  }

  const cards = [
    { label: 'Total Students', value: metrics?.totalStudents || 0, icon: Users, change: '+18% this month' },
    { label: 'Monthly Revenue', value: formatCurrency(metrics?.monthlyRevenueNpr || 0), icon: CreditCard, change: 'eSewa & Khalti' },
    { label: 'Active Courses', value: metrics?.activeCourses || 0, icon: BookOpen, change: '100% Published' },
    { label: 'Active Batches', value: metrics?.activeBatches || 0, icon: Users, change: 'Cohort Assigned' },
    { label: 'Avg. Attendance', value: `${metrics?.averageAttendanceRate || 0}%`, icon: CalendarCheck, change: 'Global Cohorts' },
    { label: 'Certificates Issued', value: metrics?.certificatesIssuedCount || 0, icon: Award, change: 'QR Verified' },
  ];

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8">
        {/* Command Center Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/10 pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase">
                Himnova Technologies • Operations Core
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white">
              Executive Command Center
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 rounded-xl bg-alpine-900 border border-white/10 text-xs font-mono text-slate-300 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
              <span>SLA: 99.99% Node Health</span>
            </span>
          </div>
        </div>

        {/* Top 6 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {cards.map((c) => {
            const Icon = c.icon;
            return (
              <div
                key={c.label}
                className="p-4 rounded-2xl bg-alpine-900/90 border border-white/10 space-y-2 shadow-lg"
              >
                <div className="flex items-center justify-between text-slate-400">
                  <span className="text-[11px] font-mono font-bold uppercase">{c.label}</span>
                  <Icon className="h-4 w-4 text-brand-cyan" />
                </div>
                <div className="text-xl font-extrabold font-display text-white">{c.value}</div>
                <p className="text-[10px] text-slate-500 font-mono">{c.change}</p>
              </div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-alpine-900/90 border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold font-display text-white">Monthly Tuition Revenue Trend</h3>
                <p className="text-xs text-slate-400 font-mono">Gross receipts across all enrolled tracks</p>
              </div>
              <span className="px-2.5 py-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 rounded-lg border border-emerald-500/30">
                TOTAL: {formatCurrency(metrics?.totalRevenueNpr || 0)}
              </span>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.revenueByMonth || []}>
                  <defs>
                    <linearGradient id="revenueGlow" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00D9FF" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#00D9FF" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} tickFormatter={(v) => `Rs.${v / 1000}k`} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#070F1E', borderColor: '#334155', borderRadius: '12px' }}
                    formatter={(val: any) => [`Rs. ${Number(val).toLocaleString()}`, 'Revenue']}
                  />
                  <Area type="monotone" dataKey="amount" stroke="#00D9FF" strokeWidth={2} fillOpacity={1} fill="url(#revenueGlow)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Student Enrollments Distribution */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-alpine-900/90 border border-white/10 space-y-4">
            <div>
              <h3 className="text-sm font-bold font-display text-white">Track Popularity</h3>
              <p className="text-xs text-slate-400 font-mono">Enrollments per masterclass</p>
            </div>

            <div className="h-64 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.coursePopularity || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="courseTitle" stroke="#64748b" fontSize={10} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#070F1E', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="students" fill="#38BDF8" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Live Security Audit Log Feed */}
        <div className="p-6 rounded-3xl bg-alpine-900/90 border border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Terminal className="h-4 w-4 text-brand-cyan" />
              <h3 className="text-sm font-bold font-display text-white">Live System Security Audit Feed</h3>
            </div>
            <span className="text-xs font-mono text-slate-400">Zero-Trust Log Stream</span>
          </div>

          <div className="divide-y divide-white/5 overflow-x-auto">
            {auditLogs.map((log) => (
              <div key={log.id} className="py-3 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-brand-cyan">
                    {log.action}
                  </span>
                  <span className="text-slate-300">
                    {log.actorEmail || 'System Process'} on <strong className="text-white">{log.resourceType}</strong>
                  </span>
                </div>
                <div className="flex items-center gap-4 text-slate-500 text-[11px]">
                  <span>IP: {log.ipAddress || '103.10.28.4'}</span>
                  <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
