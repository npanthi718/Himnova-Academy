'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { HimnovaLogo } from '@/components/brand/HimnovaLogo';
import { formatCurrency } from '@/lib/utils';
import {
  BookOpen,
  Video,
  Layers,
  Sparkles,
  Clock,
  GraduationCap,
  CheckCircle2,
  Circle,
  ArrowLeft,
  Play,
  Users,
  Calendar,
  Award,
  HelpCircle,
  Bot,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Zap,
  Radio,
  FileText
} from 'lucide-react';

export default function CourseLearnHubPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();

  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push(`/login?redirect=/learn/${slug}`);
      return;
    }

    if (slug) {
      setLoading(true);
      api.getCourseBySlug(slug, user?.id)
        .then((data) => {
          setCourse(data);

          // If course has lessons, find first incomplete lesson and auto-redirect
          const allLessons: any[] = [];
          data.modules?.forEach((m: any) => {
            m.lessons?.forEach((l: any) => allLessons.push(l));
          });

          const firstLesson = allLessons[0];
          if (firstLesson) {
            // Find first uncompleted or fallback to first
            const uncompleted = allLessons.find((l) => !l.userProgress?.isCompleted);
            const targetLesson = uncompleted || firstLesson;
            router.replace(`/learn/${slug}/${targetLesson.id}`);
            return;
          }

          // If no lessons yet, keep loading = false to show the Live Cohort Curriculum Hub
          setLoading(false);
        })
        .catch((err) => {
          console.error('Failed to load course curriculum:', err);
          setError(err.message || 'Course curriculum could not be loaded.');
          setLoading(false);
        });
    }
  }, [slug, user, isAuthenticated, authLoading, router]);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col items-center justify-center text-white space-y-4 font-sans select-none">
        <div className="relative">
          <div className="h-14 w-14 border-2 border-brand-cyan/20 border-t-brand-cyan rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-brand-cyan" />
          </div>
        </div>
        <div className="text-center space-y-1">
          <h3 className="text-sm font-bold font-display text-white">Opening Himnova Classroom Hub</h3>
          <p className="text-xs font-mono text-slate-400">Loading curriculum modules and live sessions...</p>
        </div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col items-center justify-center p-6 text-white text-center space-y-4 font-sans">
        <div className="h-16 w-16 rounded-3xl bg-red-500/20 text-red-400 border border-red-500/30 flex items-center justify-center shadow-xl">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">Curriculum Not Found</h2>
        <p className="text-xs text-slate-400 max-w-md">
          {error || 'The requested course curriculum is currently being prepared by the faculty.'}
        </p>
        <Link
          href="/student"
          className="px-6 py-2.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-mono font-bold text-white transition-all flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Return to Student Portal</span>
        </Link>
      </div>
    );
  }

  const assignedBatch = course.batches?.[0];
  const totalModulesCount = course.modules?.length || 0;
  const totalLessonsCount = course.modules?.reduce((sum: number, m: any) => sum + (m.lessons?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col font-sans select-none">
      {/* Top Classroom Bar */}
      <header className="h-16 border-b border-white/10 bg-alpine-950/95 px-4 sm:px-6 flex items-center justify-between gap-4 sticky top-0 z-30 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <Link
            href="/student"
            className="p-2 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono"
            title="Return to Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Student Dashboard</span>
          </Link>

          <HimnovaLogo size="sm" showSubtitle={false} />
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/student/live-classes"
            className="px-3.5 py-1.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-mono font-bold flex items-center gap-1.5 animate-pulse"
          >
            <Radio className="h-3.5 w-3.5" />
            <span>Live Class Schedule</span>
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto p-4 sm:p-8 space-y-8">
        {/* Course Header Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-alpine-900 via-alpine-850 to-alpine-900 border border-white/10 p-6 sm:p-8 shadow-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-cyan/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/30 text-[10px] font-mono font-extrabold uppercase">
                {course.category}
              </span>
              <span className="px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-mono font-bold uppercase">
                {course.difficulty} Track
              </span>
              <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <ShieldCheck className="h-3 w-3" /> Enrolled & Verified
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-extrabold font-display text-white tracking-tight">
                {course.title}
              </h1>
              {course.subtitle && (
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
                  {course.subtitle}
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 sm:gap-6 pt-2 text-xs font-mono text-slate-400">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="h-4 w-4 text-brand-cyan" />
                <span>{course.durationHours || 70} Total Hours</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>{totalModulesCount} Modules</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Video className="h-4 w-4 text-amber-400" />
                <span>{totalLessonsCount} Recorded Lessons</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Cohort Status & Active Batch Card */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Cohort Batch Info */}
          <div className="md:col-span-2 rounded-3xl bg-alpine-900 border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-emerald-400 animate-ping" />
                <h3 className="text-sm font-bold font-display text-white">Active Cohort Batch</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                {assignedBatch ? assignedBatch.code || assignedBatch.name : 'Morning Alpha Batch'}
              </span>
            </div>

            <div className="space-y-2">
              <h4 className="text-base font-bold text-white">
                {assignedBatch?.name || 'Batch 01 — Full Stack Engineering Alpha Cohort'}
              </h4>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                This course is conducted in high-engagement live cohort mode. Live classes, code reviews, and architecture walkthroughs are scheduled daily with your faculty mentors.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-alpine-850 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Schedule & Timings</span>
                <p className="font-bold text-white">Sun – Fri • 7:00 AM – 8:30 AM NPT</p>
              </div>
              <div className="p-3 rounded-2xl bg-alpine-850 border border-white/10 space-y-1">
                <span className="text-slate-500 text-[10px] uppercase">Classroom Platform</span>
                <p className="font-bold text-brand-cyan flex items-center gap-1">
                  <Video className="h-3.5 w-3.5" /> Google Meet / Zoom Cloud
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/student/live-classes"
                className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-95 transition-all"
              >
                <Radio className="h-4 w-4" />
                <span>Enter Live Interactive Classroom</span>
                <ChevronRight className="h-4 w-4 ml-auto" />
              </Link>
            </div>
          </div>

          {/* Quick Mentorship & Tools */}
          <div className="rounded-3xl bg-alpine-900 border border-white/10 p-6 space-y-4 shadow-xl flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-bold">
                <Bot className="h-4 w-4" />
                <span>24/7 AI Code Companion</span>
              </div>
              <h3 className="text-sm font-bold text-white font-display">Need Instant Help?</h3>
              <p className="text-xs text-slate-300 font-sans leading-relaxed">
                Use your dedicated Himnova AI Tutor to explain complex Go concurrency, React 19 architecture, or debug SQL queries.
              </p>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10 font-mono text-xs">
              <Link
                href="/student/assignments"
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-3.5 w-3.5 text-purple-400" />
                  <span>Lab Assignments</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
              <Link
                href="/student/attendance"
                className="w-full p-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-between text-slate-300 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-emerald-400" />
                  <span>Attendance Ledger</span>
                </div>
                <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
              </Link>
            </div>
          </div>
        </div>

        {/* Curriculum Syllabus Modules Section */}
        <div className="rounded-3xl bg-alpine-900 border border-white/10 p-6 sm:p-8 space-y-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-brand-cyan" />
                <h2 className="text-lg sm:text-xl font-bold font-display text-white">
                  Curriculum Modules & Technical Roadmap
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                {totalModulesCount > 0
                  ? `${totalModulesCount} Structured modules with hands-on lab milestones`
                  : 'Faculty is publishing interactive modules for this cohort track'}
              </p>
            </div>
          </div>

          {totalModulesCount === 0 ? (
            <div className="p-8 rounded-2xl bg-alpine-850/60 border border-white/10 text-center space-y-3">
              <div className="h-12 w-12 rounded-2xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center mx-auto">
                <BookOpen className="h-6 w-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Live Cohort in Session</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All daily live lectures are delivered in real-time. Video recordings, architecture slide decks, and code starter files will be indexed here automatically after each live session.
              </p>
              <Link
                href="/student/live-classes"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-xs font-mono font-bold hover:bg-brand-cyan/30 transition-all mt-2"
              >
                <Radio className="h-3.5 w-3.5" />
                <span>View Daily Live Class Timetable</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {course.modules.map((mod: any, idx: number) => (
                <div
                  key={mod.id}
                  className="rounded-2xl bg-alpine-850/80 border border-white/10 p-5 space-y-3 hover:border-brand-cyan/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono font-extrabold text-brand-cyan uppercase tracking-wider">
                        Module {idx + 1}
                      </span>
                      <h4 className="text-sm sm:text-base font-bold text-white">{mod.title}</h4>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2.5 py-1 rounded-full border border-white/10">
                      {mod.lessons?.length || 0} Lessons
                    </span>
                  </div>

                  {mod.description && (
                    <p className="text-xs text-slate-300 font-sans leading-relaxed">
                      {mod.description}
                    </p>
                  )}

                  {mod.lessons && mod.lessons.length > 0 && (
                    <div className="pt-2 space-y-1.5 border-t border-white/5">
                      {mod.lessons.map((les: any, lIdx: number) => (
                        <Link
                          key={les.id}
                          href={`/learn/${slug}/${les.id}`}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-brand-cyan/15 hover:border-brand-cyan/40 border border-transparent text-xs font-mono text-slate-300 hover:text-white transition-all group"
                        >
                          <div className="flex items-center gap-2.5 truncate">
                            <Play className="h-3.5 w-3.5 text-brand-cyan shrink-0 group-hover:scale-110 transition-transform" />
                            <span className="truncate">
                              {idx + 1}.{lIdx + 1} {les.title}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 shrink-0 ml-2">
                            {les.durationMinutes || 45}m
                          </span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Learning Outcomes & Prerequisites */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Learning Outcomes */}
          <div className="rounded-3xl bg-alpine-900 border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
              <Award className="h-4 w-4" />
              <span>Competencies You Will Master</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">Target Learning Outcomes</h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              {(course.learningOutcomes || [
                'Architect scalable enterprise full-stack platforms',
                'Write high-concurrency microservices and APIs',
                'Deploy production databases with indexing and pooling',
                'Integrate fintech payment gateways and secure authentication',
              ]).map((outcome: string, oIdx: number) => (
                <li key={oIdx} className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{outcome}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Prerequisites */}
          <div className="rounded-3xl bg-alpine-900 border border-white/10 p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
              <Zap className="h-4 w-4" />
              <span>Recommended Background</span>
            </div>
            <h3 className="text-base font-bold text-white font-display">Prerequisites & Tooling</h3>
            <ul className="space-y-2.5 text-xs text-slate-300 font-sans">
              {(course.prerequisites || [
                'Basic computer programming logic & Git fundamentals',
                'Familiarity with web technologies (HTML, CSS, JavaScript)',
                'Computer with at least 8GB RAM and stable internet',
              ]).map((req: string, rIdx: number) => (
                <li key={rIdx} className="flex items-start gap-2">
                  <ChevronRight className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
}
