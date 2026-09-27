'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  Clock,
  Award,
  Users,
  Layers,
  GraduationCap,
  CheckCircle2,
  Play
} from 'lucide-react';

export default function CoursesCatalogPage() {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.getCourses({ isPublished: true })
      .then((data) => setCourses(data || []))
      .finally(() => setLoading(false));

    if (isAuthenticated) {
      api.getMyEnrollments()
        .then((data) => {
          if (Array.isArray(data)) {
            const ids = new Set<string>(data.map((e: any) => e.courseId || e.course?.id));
            setEnrolledCourseIds(ids);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const categories = [
    { id: 'ALL', label: 'All Tracks' },
    { id: 'AI & Generative AI', label: 'AI & Generative AI' },
    { id: 'Full Stack Web Development', label: 'Full Stack Web' },
    { id: 'Cloud & DevOps Automation', label: 'Cloud & DevOps' },
    { id: 'Python & Data Engineering', label: 'Python & Data' },
    { id: 'Cybersecurity & SOC', label: 'Cybersecurity' },
  ];

  const difficulties = ['ALL', 'BEGINNER', 'INTERMEDIATE', 'ADVANCED'];

  const filteredCourses = courses.filter((c) => {
    const matchesSearch =
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'ALL' || c.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'ALL' || c.difficulty === selectedDifficulty;
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-900">
      <Navbar />
      <div className="noise-overlay" />

      <main className="flex-1 pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-10">
        {/* Catalog Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <span className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-widest font-mono">
            Himnova Academy Curriculum Directory
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
            Himnova Academy <span className="text-brand-cyan">Masterclasses</span>
          </h1>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            Hands-on technical curricula across Artificial Intelligence, Cloud DevOps, Full-Stack Microservices, and Cybersecurity designed for real production impact.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="p-4 rounded-3xl border border-white/10 bg-alpine-900/80 backdrop-blur-xl shadow-xl space-y-4">
          <div className="flex flex-col md:flex-row items-center gap-4">
            {/* Search Input */}
            <div className="relative flex-1 w-full">
              <Search className="h-4 w-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search masterclasses, topics, frameworks (e.g. pgvector, LangGraph, Go)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-alpine-850 border border-white/10 focus:border-brand-cyan focus:outline-none text-xs text-white placeholder:text-slate-500 font-mono"
              />
            </div>

            {/* Difficulty Filter */}
            <div className="flex items-center gap-1.5 self-start md:self-auto overflow-x-auto no-scrollbar">
              <span className="text-[11px] font-mono text-slate-500 mr-1 uppercase">Level:</span>
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => setSelectedDifficulty(diff)}
                  className={`px-3 py-1 text-[11px] font-bold rounded-xl transition-all ${
                    selectedDifficulty === diff
                      ? 'bg-brand-cyan/20 border border-brand-cyan/40 text-brand-cyan'
                      : 'bg-alpine-850 text-slate-400 hover:text-white border border-white/5'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-2 border-t border-white/5">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-1.5 text-xs font-bold rounded-xl whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-600 to-brand-cyan text-white shadow-md shadow-brand-cyan/20'
                    : 'bg-alpine-850 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-96 rounded-3xl bg-alpine-900/60 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="text-center py-16 space-y-3 glass-card rounded-3xl p-8">
            <GraduationCap className="h-12 w-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No courses match your filter criteria</h3>
            <p className="text-xs text-slate-400">Try adjusting your search terms or category selection.</p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('ALL');
                setSelectedDifficulty('ALL');
              }}
              className="px-4 py-2 rounded-xl bg-brand-cyan/20 text-brand-cyan text-xs font-bold border border-brand-cyan/40"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);

              return (
                <div
                  key={course.id}
                  className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    <div className="relative h-48 w-full bg-slate-900 overflow-hidden">
                      <img
                        src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                        alt={course.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-alpine-950 via-alpine-950/40 to-transparent" />

                      <div className="absolute top-4 left-4 flex gap-2">
                        <span className="px-2.5 py-1 rounded-lg bg-alpine-900/90 border border-white/15 text-[10px] font-mono font-bold text-brand-cyan uppercase backdrop-blur-md">
                          {course.difficulty}
                        </span>
                        {isEnrolled ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-[10px] font-bold text-emerald-400 uppercase backdrop-blur-md flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Enrolled
                          </span>
                        ) : course.isFeatured ? (
                          <span className="px-2.5 py-1 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 text-[10px] font-bold text-white uppercase backdrop-blur-md flex items-center gap-1">
                            <Sparkles className="h-3 w-3 text-brand-cyan" /> Featured
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <span className="text-[11px] font-mono text-brand-cyan font-bold uppercase tracking-wider">
                        {course.category}
                      </span>
                      <h3 className="text-lg font-bold font-display text-white group-hover:text-brand-cyan transition-colors line-clamp-2">
                        {course.title}
                      </h3>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {course.subtitle || course.description}
                      </p>

                      <div className="pt-2 flex items-center gap-4 text-xs font-mono text-slate-400">
                        <span>⏱ {course.durationHours} Hours</span>
                        <span>👥 Active Cohort</span>
                        <span>📜 QR Verified</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 border-t border-white/5 flex items-center justify-between mt-4">
                    <div>
                      <span className="text-[10px] text-slate-500 font-mono uppercase block">Tuition</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-lg font-extrabold font-display text-white">
                          {formatCurrency(course.discountPrice || course.price)}
                        </span>
                        {course.discountPrice && (
                          <span className="text-xs text-slate-500 line-through">
                            {formatCurrency(course.price)}
                          </span>
                        )}
                      </div>
                    </div>

                    {isEnrolled ? (
                      <Link href={`/learn/${course.slug}`}>
                        <button className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-brand-cyan text-white shadow-lg shadow-emerald-500/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
                          <Play className="h-3.5 w-3.5 fill-white" />
                          <span>Go to Class</span>
                        </button>
                      </Link>
                    ) : (
                      <Link href={`/courses/${course.slug}`}>
                        <button className="px-4 py-2 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5">
                          <span>Enroll / View Track</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
