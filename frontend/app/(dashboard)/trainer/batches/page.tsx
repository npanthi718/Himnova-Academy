'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { Users, BookOpen, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function TrainerBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getBatches()
      .then(setBatches)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold font-display text-white">My Assigned Batches</h1>
          <p className="text-xs text-slate-400">Cohort batches you are actively leading and mentoring</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {batches.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase">
                  {b.code}
                </span>
                <span className="text-xs text-emerald-400 font-mono font-bold">● ACTIVE</span>
              </div>

              <div>
                <h3 className="text-lg font-bold font-display text-white">{b.name}</h3>
                <p className="text-xs text-brand-cyan mt-0.5">{b.course?.title}</p>
              </div>

              <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Timeline:</span>
                  <span>{formatDate(b.startDate)} - {formatDate(b.endDate)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Enrolled Students:</span>
                  <span className="text-white font-bold">{b._count?.students || 0} Learners</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Live Classes:</span>
                  <span className="text-brand-cyan font-bold">{b._count?.liveClasses || 0} Scheduled</span>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-2">
                <Link href={`/trainer/attendance`} className="flex-1">
                  <button className="w-full py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10">
                    Mark Attendance
                  </button>
                </Link>
                <Link href={`/trainer/submissions`} className="flex-1">
                  <button className="w-full py-2 rounded-xl bg-purple-600/30 text-purple-300 hover:bg-purple-600/40 text-xs font-bold border border-purple-500/30">
                    Submissions
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
