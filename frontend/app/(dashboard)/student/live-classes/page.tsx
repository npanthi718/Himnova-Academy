'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import {
  Video,
  Calendar,
  Clock,
  ExternalLink,
  ShieldCheck,
  AlertCircle,
  UserCheck,
  PlayCircle
} from 'lucide-react';

export default function StudentLiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadClasses() {
      try {
        const data = await api.getMyLiveClasses();
        setClasses(data || []);
      } catch (err) {
        console.error('Failed to load live classes', err);
      } finally {
        setLoading(false);
      }
    }
    loadClasses();
  }, []);

  const upcomingClasses = classes.filter((c) => c.status !== 'COMPLETED');
  const pastClasses = classes.filter((c) => c.status === 'COMPLETED');

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <Video className="w-6 h-6 text-rose-400" />
              <span>Live Interactive Classrooms & Labs</span>
            </h1>
            <p className="text-xs text-slate-400">
              Join live instructor-led video sessions, code reviews, and pair programming labs with industry architects.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl bg-alpine-900 border border-brand-cyan/30 text-xs font-mono text-slate-300">
            Active Cohort Schedule: <strong className="text-brand-cyan">{upcomingClasses.length} Upcoming</strong>
          </span>
        </div>

        {/* Live / Upcoming Classes Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500 animate-ping" />
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-white">Upcoming & Active Sessions</h2>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2].map((n) => (
                <div key={n} className="h-32 rounded-3xl bg-alpine-900/60 border border-white/5 animate-pulse" />
              ))}
            </div>
          ) : upcomingClasses.length === 0 ? (
            <div className="p-8 rounded-3xl border border-white/10 bg-alpine-900/80 text-center space-y-3 shadow-xl">
              <Video className="w-10 h-10 text-slate-500 mx-auto" />
              <h4 className="text-sm font-bold text-white">No upcoming sessions scheduled at this moment</h4>
              <p className="text-xs text-slate-400">Your trainer will broadcast notifications when the next live session is scheduled.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {upcomingClasses.map((cls) => (
                <div
                  key={cls.id}
                  className="p-6 rounded-3xl border border-rose-500/30 bg-gradient-to-r from-alpine-900 via-alpine-900/90 to-rose-950/20 backdrop-blur-xl flex flex-col justify-between shadow-xl space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                        {cls.batch?.name || 'Assigned Cohort'}
                      </span>
                      <span className="text-[10px] font-mono text-emerald-400 font-bold uppercase">
                        ● {cls.status || 'SCHEDULED'}
                      </span>
                    </div>

                    <h3 className="text-base font-bold font-display text-white">
                      {cls.title}
                    </h3>
                    {cls.description && (
                      <p className="text-xs text-slate-300 leading-relaxed line-clamp-2">
                        {cls.description}
                      </p>
                    )}

                    <div className="pt-2 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                        <span>{new Date(cls.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </div>
                      {cls.trainer && (
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Trainer: {cls.trainer.fullName}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {cls.meetingUrl ? (
                    <a
                      href={cls.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-500 to-brand-cyan text-white text-xs font-bold shadow-lg hover:brightness-110 active:scale-98 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Launch Zoom / Video Classroom</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  ) : (
                    <div className="p-3 rounded-xl bg-alpine-850 border border-white/5 text-center text-xs font-mono text-slate-400">
                      Class link will activate 10 minutes prior to start time
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Past Recordings & Archives Section */}
        {pastClasses.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-sm font-bold font-mono uppercase tracking-wider text-slate-400">Past Session Archives</h2>
            <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                  <tr>
                    <th className="p-4">Session Topic</th>
                    <th className="p-4">Cohort</th>
                    <th className="p-4">Date Completed</th>
                    <th className="p-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pastClasses.map((c) => (
                    <tr key={c.id} className="hover:bg-white/5">
                      <td className="p-4 text-white font-semibold">{c.title}</td>
                      <td className="p-4 text-slate-400">{c.batch?.name || 'Cohort'}</td>
                      <td className="p-4 text-slate-400">{new Date(c.startTime).toLocaleDateString()}</td>
                      <td className="p-4 text-slate-500">COMPLETED</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
