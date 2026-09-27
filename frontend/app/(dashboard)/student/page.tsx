'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import {
  Sparkles,
  BookOpen,
  Play,
  Video,
  Clock,
  CheckCircle2,
  Award,
  ArrowRight,
  TrendingUp,
  FileText,
  Briefcase,
  Layers,
  ChevronRight,
  ExternalLink,
  Bot,
  ShieldCheck,
  CalendarCheck,
  Share2
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user } = useAuth();
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [liveClasses, setLiveClasses] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStudentData() {
      try {
        const [enrollRes, classRes, assignRes] = await Promise.all([
          api.getMyEnrollments().catch(() => []),
          api.getMyLiveClasses().catch(() => []),
          api.getAssignments().catch(() => []),
        ]);

        setEnrollments(enrollRes || []);
        setLiveClasses(classRes || []);
        setAssignments(assignRes || []);
      } catch (err) {
        console.error('Failed to load student dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadStudentData();
  }, []);

  const primaryEnrollment = enrollments[0];
  const upcomingClass = liveClasses.find((c) => c.status !== 'COMPLETED') || liveClasses[0];

  const totalCourses = enrollments.length;
  const avgProgress = totalCourses > 0 
    ? Math.round(enrollments.reduce((acc, c) => acc + (c.progressPercentage || 0), 0) / totalCourses) 
    : 0;

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-8">
        {/* Top Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl border border-brand-cyan/30 bg-gradient-to-r from-alpine-900 via-alpine-900/90 to-blue-950/40 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold font-mono uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                Himnova AI Learning OS
              </div>
              <h1 className="text-2xl md:text-3xl font-extrabold font-display text-white tracking-tight">
                Welcome back, <span className="bg-gradient-to-r from-white via-cyan-200 to-brand-cyan bg-clip-text text-transparent">{user?.fullName || 'Student'}</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 max-w-xl">
                Accelerate your engineering journey. Complete your current module, submit projects, and unlock verified industry credentials.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              {primaryEnrollment ? (
                <Link
                  href={`/learn/${primaryEnrollment.course?.slug || ''}`}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Resume Learning</span>
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>Browse Catalog</span>
                </Link>
              )}
              <Link
                href="/student/earn-plan"
                className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-alpine-850/90 border border-white/10 text-slate-200 text-xs font-bold hover:border-brand-cyan/40 transition-colors"
              >
                <Briefcase className="w-4 h-4 text-brand-cyan" />
                <span>Career Roadmap</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Grid: Continue Learning & Upcoming Live Class */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning Card */}
          <div className="lg:col-span-2 rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md relative overflow-hidden flex flex-col justify-between shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Continue Learning</span>
              </span>
              <Link
                href="/student/my-courses"
                className="text-xs font-mono text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                View All Courses ({enrollments.length})
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {primaryEnrollment ? (
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="w-full sm:w-36 h-24 rounded-2xl overflow-hidden bg-slate-900 shrink-0 border border-white/10 relative">
                    <img
                      src={primaryEnrollment.course?.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                      alt={primaryEnrollment.course?.title || ''}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                      {primaryEnrollment.course?.category || 'Technical Track'}
                    </span>
                    <h3 className="text-base font-bold font-display text-white">
                      {primaryEnrollment.course?.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 font-mono">
                      Batch: {primaryEnrollment.batch?.name || 'Active Enrolled Cohort'}
                    </p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2 pt-3 border-t border-white/5">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-400">Curriculum Progress</span>
                    <span className="text-brand-cyan font-bold">{primaryEnrollment.progressPercentage || 0}% Completed</span>
                  </div>
                  <div className="h-2 w-full bg-alpine-950 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-blue-600 to-brand-cyan rounded-full transition-all duration-500"
                      style={{ width: `${primaryEnrollment.progressPercentage || 0}%` }}
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-end">
                  <Link
                    href={`/learn/${primaryEnrollment.course?.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-cyan hover:underline font-mono"
                  >
                    <span>Enter Course Player</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <div className="text-center py-10 space-y-4">
                <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
                <div>
                  <h4 className="text-base font-bold text-white">You have not enrolled in any courses yet</h4>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                    Explore our industry-verified masterclasses in AI, Full Stack, and Cloud Engineering.
                  </p>
                </div>
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold shadow-lg"
                >
                  <span>Browse Himnova Catalog</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            )}
          </div>

          {/* Upcoming Live Classroom */}
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500 animate-ping" />
                  Live Classroom
                </span>
                <span className="text-[11px] font-mono text-slate-500">Zoom / Cloud</span>
              </div>

              {upcomingClass ? (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-alpine-850/80 border border-white/5 space-y-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/15 text-purple-400 border border-purple-500/30">
                      {upcomingClass.batch?.name || 'Live Cohort'}
                    </span>
                    <h4 className="text-sm font-bold text-white font-display leading-snug">
                      {upcomingClass.title}
                    </h4>
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-400 pt-1">
                      <Clock className="w-3.5 h-3.5 text-brand-cyan" />
                      <span>{new Date(upcomingClass.startTime).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                    </div>
                  </div>

                  {upcomingClass.meetingUrl && (
                    <a
                      href={upcomingClass.meetingUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-xs font-bold shadow-lg hover:brightness-110 transition-all"
                    >
                      <Video className="w-4 h-4" />
                      <span>Join Live Session</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 space-y-3">
                  <Video className="w-10 h-10 text-slate-500 mx-auto" />
                  <p className="text-xs text-slate-400">No live sessions scheduled right now. Your trainer will notify you when a class is launched.</p>
                </div>
              )}
            </div>

            <Link
              href="/student/live-classes"
              className="pt-4 mt-4 border-t border-white/5 text-xs font-mono text-slate-400 hover:text-brand-cyan flex items-center justify-between transition-colors"
            >
              <span>View Full Schedule</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 7-Stage Career Launch Progression Roadmap */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 md:p-8 backdrop-blur-md shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-brand-cyan" />
                <h3 className="text-base font-bold font-display text-white">Himnova 7-Stage Career Launch Progression</h3>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Your systemic pathway from foundational learning to portfolio verification and job placement.
              </p>
            </div>
            <Link
              href="/student/earn-plan"
              className="text-xs font-mono font-bold text-brand-cyan hover:underline flex items-center gap-1"
            >
              <span>Open Roadmap Details</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {[
              { num: '01', title: 'Learn', subtitle: 'Core Theory', active: true, done: true },
              { num: '02', title: 'Practice', subtitle: 'Lab Exercises', active: true, done: true },
              { num: '03', title: 'Build', subtitle: 'Full Stack App', active: true, done: false },
              { num: '04', title: 'Certify', subtitle: 'QR Credential', active: false, done: false },
              { num: '05', title: 'Portfolio', subtitle: 'Live Showcase', active: false, done: false },
              { num: '06', title: 'Interview', subtitle: 'Mock Sessions', active: false, done: false },
              { num: '07', title: 'Earn', subtitle: 'Placement/Freelance', active: false, done: false },
            ].map((st, i) => (
              <div
                key={i}
                className={`p-3.5 rounded-2xl border text-left transition-all ${
                  st.done
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                    : st.active
                    ? 'bg-brand-cyan/15 border-brand-cyan/50 text-white shadow-lg shadow-brand-cyan/10'
                    : 'bg-alpine-850/60 border-white/5 text-slate-500'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold">{st.num}</span>
                  {st.done ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  ) : st.active ? (
                    <span className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse" />
                  ) : null}
                </div>
                <h4 className="text-xs font-bold mt-1 text-white font-display">{st.title}</h4>
                <p className="text-[10px] text-slate-400 font-mono mt-0.5 truncate">{st.subtitle}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Hub: Assignments, Certificates & Referrals */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Assignments */}
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-brand-cyan flex items-center gap-1.5">
                  <FileText className="w-4 h-4" />
                  Assignments
                </span>
                <span className="text-xs font-mono text-slate-400">{assignments.length} Total</span>
              </div>
              <p className="text-xs text-slate-300">
                Submit your project code, GitHub links, and live demos to receive mentor grading and feedback.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Link
                href="/student/assignments"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-xs font-bold text-slate-200 hover:border-brand-cyan/40 hover:text-white transition-colors"
              >
                <span>Open Assignments Hub</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Verified Certificates */}
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Award className="w-4 h-4" />
                  My Certificates
                </span>
                <span className="text-xs font-mono text-emerald-400">QR Verified</span>
              </div>
              <p className="text-xs text-slate-300">
                View, download, and print your luxury A4 institutional graduation certificates with digital QR authentication.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Link
                href="/student/certificates"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-xs font-bold text-slate-200 hover:border-amber-400/40 hover:text-white transition-colors"
              >
                <span>View Credentials</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Referrals & Cash Rewards */}
          <div className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold font-mono uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <Share2 className="w-4 h-4" />
                  Referral Rewards
                </span>
                <span className="text-xs font-mono text-brand-cyan">NPR 1,000 / Ref</span>
              </div>
              <p className="text-xs text-slate-300">
                Share your unique student code. Earn cash rewards and tuition credits on every successful cohort enrollment.
              </p>
            </div>
            <div className="pt-4 border-t border-white/5">
              <Link
                href="/student/referrals"
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-xs font-bold text-slate-200 hover:border-emerald-400/40 hover:text-white transition-colors"
              >
                <span>Referral Dashboard</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
