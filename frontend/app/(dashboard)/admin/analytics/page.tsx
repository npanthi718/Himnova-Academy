'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Users, Award, CalendarCheck, BookOpen, CreditCard } from 'lucide-react';
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
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function AdminAnalyticsPage() {
  const [metrics, setMetrics] = useState<any | null>(null);

  useEffect(() => {
    api.getAdminSummary().then(setMetrics).catch(console.error);
  }, []);

  const attendancePieData = [
    { name: 'Present', value: metrics?.attendanceDistribution?.present || 48, color: '#10B981' },
    { name: 'Late', value: metrics?.attendanceDistribution?.late || 6, color: '#F59E0B' },
    { name: 'Absent', value: metrics?.attendanceDistribution?.absent || 4, color: '#EF4444' },
  ];

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-8">
        <div className="border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold font-display text-white">Global Platform Analytics</h1>
          <p className="text-xs text-slate-400">Deep telemetry on revenue, attendance, retention and cohort progression</p>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Revenue Chart */}
          <div className="lg:col-span-8 p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-display text-white">Revenue Growth Velocity</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics?.revenueByMonth || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#070F1E', borderColor: '#334155', borderRadius: '12px' }} />
                  <Area type="monotone" dataKey="amount" stroke="#00D9FF" fill="#00D9FF" fillOpacity={0.2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Attendance Pie Chart */}
          <div className="lg:col-span-4 p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-display text-white">Attendance Ratio</h3>
            <div className="h-64 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={attendancePieData} dataKey="value" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                    {attendancePieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ backgroundColor: '#070F1E', borderColor: '#334155', borderRadius: '12px' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Enrollments Growth Trend */}
          <div className="lg:col-span-12 p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold font-display text-white">Student Enrollment Cumulative Expansion</h3>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics?.enrollmentsTrend || []}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                  <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} />
                  <Tooltip contentStyle={{ backgroundColor: '#070F1E', borderColor: '#334155', borderRadius: '12px' }} />
                  <Bar dataKey="count" fill="#0066FF" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
