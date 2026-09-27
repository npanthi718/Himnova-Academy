'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import {
  Users,
  FileCheck,
  Video,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

export default function TrainerDashboardPage() {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getTrainerSummary()
      .then(setMetrics)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase">
              Trainer Command Center
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Instructional Dashboard
            </h1>
          </div>
        </div>

        {/* Top 4 KPI Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-alpine-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase">Assigned Batches</span>
              <Users className="h-4 w-4 text-purple-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">{metrics?.assignedBatchesCount || 0}</div>
            <p className="text-[10px] text-slate-500 font-mono">Active cohort teaching load</p>
          </div>

          <div className="p-5 rounded-3xl bg-alpine-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase">Assigned Students</span>
              <Users className="h-4 w-4 text-brand-cyan" />
            </div>
            <div className="text-2xl font-extrabold font-display text-white">{metrics?.assignedStudentsCount || 0}</div>
            <p className="text-[10px] text-slate-500 font-mono">Active learners under guidance</p>
          </div>

          <div className="p-5 rounded-3xl bg-alpine-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase">Pending Submissions</span>
              <FileCheck className="h-4 w-4 text-amber-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-amber-400">{metrics?.pendingReviewsCount || 0}</div>
            <p className="text-[10px] text-slate-500 font-mono">Awaiting your grading review</p>
          </div>

          <div className="p-5 rounded-3xl bg-alpine-900 border border-white/10 space-y-2">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-mono font-bold uppercase">Upcoming Live Classes</span>
              <Video className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-extrabold font-display text-emerald-400">{metrics?.upcomingClassesCount || 0}</div>
            <p className="text-[10px] text-slate-500 font-mono">Zoom / Google Meet schedule</p>
          </div>
        </div>

        {/* Quick Action Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/trainer/submissions" className="group">
            <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                <FileCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white group-hover:text-purple-400 transition-colors">
                Review Student Submissions
              </h3>
              <p className="text-xs text-slate-400">
                Grade code repos, live demos and provide constructive technical architecture feedback.
              </p>
            </div>
          </Link>

          <Link href="/trainer/attendance" className="group">
            <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <CalendarCheck className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white group-hover:text-emerald-400 transition-colors">
                Mark Batch Attendance
              </h3>
              <p className="text-xs text-slate-400">
                Record attendance status for daily lab sessions and live lecture milestones.
              </p>
            </div>
          </Link>

          <Link href="/trainer/live-classes" className="group">
            <div className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
              <div className="h-10 w-10 rounded-2xl bg-blue-500/20 text-brand-cyan flex items-center justify-center">
                <Video className="h-5 w-5" />
              </div>
              <h3 className="text-base font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                Schedule Live Workshop
              </h3>
              <p className="text-xs text-slate-400">
                Set up Zoom/Meet video sessions with real-time countdown alerts for your cohort.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
