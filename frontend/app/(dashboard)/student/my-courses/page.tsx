'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import {
  BookOpen,
  Play,
  Clock,
  Award,
  Layers,
  Search,
  CheckCircle2,
  ExternalLink,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export default function StudentMyCoursesPage() {
  const [enrollments, setEnrollments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    async function loadCourses() {
      try {
        const data = await api.getMyEnrollments();
        setEnrollments(data || []);
      } catch (err) {
        console.error('Failed to fetch my courses', err);
      } finally {
        setLoading(false);
      }
    }
    loadCourses();
  }, []);

  const filtered = enrollments.filter((e) =>
    (e.course?.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (e.course?.category || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-brand-cyan" />
              <span>Enrolled Courses & Active Masterclasses</span>
            </h1>
            <p className="text-xs text-slate-400">
              Access your interactive course player, module lessons, video lectures, and syllabus materials.
            </p>
          </div>
          <Link
            href="/courses"
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-alpine-900 border border-brand-cyan/30 text-brand-cyan text-xs font-bold hover:bg-brand-cyan/10 transition-colors shrink-0"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore More Courses</span>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search enrolled courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-alpine-900/80 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan font-mono"
          />
        </div>

        {/* Grid List */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-72 rounded-3xl bg-alpine-900/60 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl border border-white/10 bg-alpine-900/80 space-y-4 shadow-xl">
            <BookOpen className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No enrolled courses found</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              You have not enrolled in any masterclasses yet or your search query did not match any active enrollments.
            </p>
            <Link
              href="/courses"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold shadow-lg"
            >
              <span>Browse Catalog</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((enrollment) => {
              const course = enrollment.course;
              if (!course) return null;
              const progress = enrollment.progressPercentage || 0;

              return (
                <div
                  key={enrollment.id}
                  className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden flex flex-col justify-between shadow-xl group hover:border-brand-cyan/40 transition-all"
                >
                  <div>
                    <div className="relative h-44 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-alpine-950 via-alpine-950/40 to-transparent" />
                      <div className="absolute top-3 left-3">
                        <span className="px-2.5 py-1 rounded-lg bg-alpine-900/90 border border-white/15 text-[10px] font-mono font-bold text-brand-cyan uppercase backdrop-blur-md">
                          {course.category || 'Engineering Track'}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 space-y-3">
                      <h3 className="text-base font-bold font-display text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.subtitle || course.description}
                      </p>

                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-[11px] font-mono">
                          <span className="text-slate-400">Progress</span>
                          <span className="text-brand-cyan font-bold">{progress}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-alpine-950 rounded-full overflow-hidden border border-white/5">
                          <div
                            className="h-full bg-gradient-to-r from-blue-600 to-brand-cyan rounded-full"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 border-t border-white/5 flex items-center justify-between mt-3">
                    <span className="text-[10px] font-mono text-slate-400">
                      {enrollment.batch?.name || 'Active Cohort'}
                    </span>
                    <Link
                      href={`/learn/${course.slug}`}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-md hover:brightness-110 flex items-center gap-1.5 transition-all"
                    >
                      <Play className="w-3.5 h-3.5 fill-white" />
                      <span>Resume Course</span>
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
