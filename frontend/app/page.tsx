'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { TelemetryPanel } from '@/components/brand/TelemetryPanel';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Cloud,
  Cpu,
  GraduationCap,
  Code2,
  Award,
  Briefcase,
  CheckCircle2,
  Terminal,
  Activity,
  Layers,
  Search,
  ExternalLink,
  ChevronRight,
  Play,
} from 'lucide-react';

export default function LandingPage() {
  const { isAuthenticated } = useAuth();
  const [courses, setCourses] = useState<any[]>([]);
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  useEffect(() => {
    api.getCourses({ isPublished: true })
      .then((data) => setCourses(data || []))
      .catch(() => {});

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

  const careerStages = [
    {
      step: '01',
      title: 'LEARN',
      subtitle: 'Deep Technical Foundations',
      desc: 'Master enterprise-grade engineering principles directly taught by Himnova senior architects and practitioners.',
      icon: BookOpenIcon,
    },
    {
      step: '02',
      title: 'PRACTICE',
      subtitle: 'Hands-on Labs & Coding',
      desc: 'Work in realistic cloud and code environments with instant automated test validation and lint analysis.',
      icon: Code2,
    },
    {
      step: '03',
      title: 'BUILD',
      subtitle: 'Production Client Software',
      desc: 'Architect full-scale RAG systems, microservices, and Kubernetes deployment pipelines from scratch.',
      icon: Layers,
    },
    {
      step: '04',
      title: 'CERTIFY',
      subtitle: 'Verified QR Credentials',
      desc: 'Earn tamper-proof certificates with public QR code validation and cryptographically signed achievements.',
      icon: Award,
    },
    {
      step: '05',
      title: 'PORTFOLIO',
      subtitle: 'Recruiter Showcase URL',
      desc: 'Publish your deployed projects, live URLs, GitHub repositories, and performance benchmarks on your custom profile.',
      icon: ExternalLink,
    },
    {
      step: '06',
      title: 'INTERVIEW',
      subtitle: 'Mock System Design Rounds',
      desc: 'Simulate high-concurrency technical interviews, concurrency bottlenecks, and architecture defense sessions.',
      icon: Terminal,
    },
    {
      step: '07',
      title: 'EARN',
      subtitle: 'Global Career Placements',
      desc: 'Transition smoothly into engineering positions, global freelancing contracts, or Himnova client teams.',
      icon: Briefcase,
    },
  ];

  const categories = [
    { id: 'ALL', name: 'All Masterclasses' },
    { id: 'AI & Generative AI', name: 'AI & Generative AI' },
    { id: 'Full Stack Web Development', name: 'Full Stack Web' },
    { id: 'Cloud & DevOps Automation', name: 'Cloud & DevOps' },
    { id: 'Cybersecurity & SOC', name: 'Cybersecurity' },
  ];

  const filteredCourses =
    selectedCategory === 'ALL'
      ? courses
      : courses.filter((c) => c.category === selectedCategory);

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-900">
      <Navbar />

      {/* Noise background */}
      <div className="noise-overlay" />

      {/* HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center pt-28 pb-20 sm:pb-24 overflow-hidden">
        {/* Glowing Orb Accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-brand-cyan/15 rounded-full blur-[160px] pointer-events-none animate-cyber-pulse" />
        <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-brand-teal/10 rounded-full blur-[130px] pointer-events-none" />
        <div className="absolute inset-0 bg-cyber-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-8 text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide backdrop-blur-md bg-brand-cyan/15 text-brand-cyan border-brand-cyan/40 shadow-lg shadow-brand-cyan/10">
                <Sparkles className="h-3.5 w-3.5 text-brand-cyan animate-pulse" />
                <span>Himnova Technologies Official Academy & LMS</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-white leading-[1.1]">
                <span className="block text-lg sm:text-2xl font-semibold tracking-wide text-slate-300 mb-2 font-mono">
                  HIMNOVA ACADEMY
                </span>
                ADVANCED <br />
                <span className="bg-gradient-to-r from-brand-cyan via-teal-400 to-sky-500 bg-clip-text text-transparent text-glow">
                  LMS & CAREER HUB
                </span>
              </h1>

              {/* Subtitle */}
              <p className="text-base sm:text-lg lg:text-xl text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                <strong className="text-brand-cyan">Learn. Build. Certify. Launch Your Career.</strong> An enterprise learning management system by Himnova Technologies delivering multi-disciplinary masterclasses in AI, Full Stack Engineering, Cloud DevOps, Cybersecurity, and Software Architecture.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link href="#courses" className="w-full sm:w-auto">
                  <button className="relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-xl px-7 py-3.5 text-sm gap-2.5 bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-xl shadow-brand-cyan/25 hover:brightness-110 active:scale-95 transition-all w-full sm:w-auto">
                    <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                    <span>Explore Academy Courses</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </Link>

                <Link href="/login" className="w-full sm:w-auto">
                  <button className="inline-flex items-center justify-center font-semibold rounded-xl px-7 py-3.5 text-sm gap-2 bg-alpine-850 text-slate-100 border border-white/10 hover:bg-alpine-800 transition-all w-full sm:w-auto">
                    <span>Enter Student Portal</span>
                    <ChevronRight className="h-4 w-4 text-slate-400" />
                  </button>
                </Link>
              </div>

              {/* Enterprise Stack Badges */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 pt-3">
                <span className="text-xs font-mono font-bold text-slate-500 uppercase mr-2">
                  Academy Tracks:
                </span>
                {['Artificial Intelligence', 'Full Stack Next.js & Go', 'AWS Cloud & Kubernetes', 'Cybersecurity SOC', 'Python & Data Engineering', 'Mobile Flutter'].map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 text-[11px] font-bold rounded-lg bg-white/5 border border-white/10 text-slate-300 shadow-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Stats Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-white/10 text-left">
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">99.99%</div>
                  <div className="text-xs text-slate-400">Cloud Uptime <span className="text-brand-cyan font-bold">(SLA)</span></div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">Multi-Track</div>
                  <div className="text-xs text-slate-400">AI, Cloud, Web & SOC</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">100%</div>
                  <div className="text-xs text-slate-400">Verified QR Certificates</div>
                </div>
                <div className="space-y-0.5">
                  <div className="text-2xl sm:text-3xl font-extrabold font-display text-white">7 Stages</div>
                  <div className="text-xs text-slate-400">From Learn to Earn</div>
                </div>
              </div>
            </div>

            {/* Right Telemetry Column with Academy Banner */}
            <div className="lg:col-span-5 relative space-y-4">
              <div className="rounded-3xl overflow-hidden border border-white/15 shadow-2xl bg-alpine-900 group">
                <img
                  src="/logos/Himnova Academy Banner.png"
                  alt="Himnova Academy Banner"
                  className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <TelemetryPanel />
            </div>
          </div>
        </div>
      </section>

      {/* 7-STAGE CAREER PROGRESSION SECTION */}
      <section id="pathway" className="py-20 bg-alpine-900/60 border-y border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Himnova Career Pathway</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white">
              The 7-Stage <span className="text-brand-cyan">Career Launch</span> Framework
            </h2>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              We do not simply offer video tutorials. We engineer full technical career progressions with real feedback, client-grade projects, and recruiter visibility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerStages.map((stage, idx) => {
              const Icon = stage.icon;
              return (
                <div
                  key={stage.step}
                  className="glass-card glass-card-hover p-6 rounded-3xl space-y-4 relative group"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-extrabold px-2.5 py-1 rounded-lg bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                      STAGE {stage.step}
                    </span>
                    <Icon className="h-5 w-5 text-slate-400 group-hover:text-brand-cyan transition-colors" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold font-display text-white group-hover:text-brand-cyan transition-colors">
                      {stage.title}
                    </h3>
                    <p className="text-xs font-semibold text-brand-cyan/90 mt-0.5">{stage.subtitle}</p>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{stage.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FEATURED COURSES SECTION */}
      <section id="courses" className="py-24 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="space-y-3">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-widest font-mono">
                Industry Curriculum
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                Featured Career Masterclasses
              </h2>
              <p className="text-slate-400 text-sm max-w-xl">
                Taught by practicing senior engineers with cohort live classes, hands-on reviews, and verifiable credentials.
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-blue-600 to-brand-cyan text-white shadow-md shadow-brand-cyan/20'
                      : 'bg-alpine-900 border border-white/10 text-slate-400 hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.map((course) => {
              const isEnrolled = enrolledCourseIds.has(course.id);

              return (
                <div
                  key={course.id}
                  className="glass-card glass-card-hover rounded-3xl overflow-hidden flex flex-col justify-between group"
                >
                  <div>
                    {/* Thumbnail / Header */}
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

                    {/* Body Details */}
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

                  {/* Footer Pricing & CTA */}
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
        </div>
      </section>

      {/* RECRUITER PORTFOLIO & CERTIFICATE TRUST SECTION */}
      <section className="py-20 bg-alpine-900/70 border-t border-white/10 relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-bold uppercase tracking-widest font-mono">
                <Award className="h-3.5 w-3.5" />
                <span>Recruiter-Ready Credentials</span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
                Certificates Built for <span className="text-brand-cyan">Global Verification</span>
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Every graduate is issued an immutable certificate bearing their official Himnova ID, verified completion score, and a scannable QR code linking to their public portfolio and code deliverables.
              </p>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Cryptographically Verified Verification URL</p>
                    <p className="text-xs text-slate-400">Recruiters can instantly verify authenticity via <code className="text-brand-cyan">/verify/[certificateId]</code>.</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-bold text-white">Live Project Showcase & GitHub Code Review</p>
                    <p className="text-xs text-slate-400">Directly link real deployed applications, WebRTC voice agents, and Kubernetes monitoring dashboards.</p>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link href="/verify/HIM-CERT-2026-AI-8942">
                  <button className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>View Sample Certificate</span>
                  </button>
                </Link>
                <Link href="/portfolio/AAYUSH-AI">
                  <button className="px-5 py-2.5 rounded-xl bg-alpine-850 text-slate-200 border border-white/10 hover:bg-alpine-800 text-xs font-bold flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>View Recruiter Portfolio</span>
                  </button>
                </Link>
              </div>
            </div>

            {/* Certificate Preview Card */}
            <div className="relative p-6 rounded-3xl border border-brand-cyan/40 bg-alpine-950/90 shadow-2xl shadow-brand-cyan/20 backdrop-blur-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-lg bg-brand-cyan/20 border border-brand-cyan/40 flex items-center justify-center text-brand-cyan">
                    <Award className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white font-display">Official Himnova Credential</p>
                    <p className="text-[10px] font-mono text-emerald-400">VERIFIED STATUS: ACTIVE</p>
                  </div>
                </div>
                <span className="text-xs font-mono text-slate-400">ID: HIM-CERT-2026-AI-8942</span>
              </div>

              <div className="space-y-2 text-center py-4 bg-white/5 rounded-2xl border border-white/5">
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">This certifies that</span>
                <h4 className="text-xl font-extrabold text-white font-display">Aayush Sharma</h4>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Has successfully mastered the rigorous requirements of the <span className="text-brand-cyan font-bold">AI & Generative AI Engineering Masterclass</span>.
                </p>
                <div className="pt-2 text-[11px] font-mono text-slate-400">
                  Grade Score: <strong className="text-emerald-400 font-bold">96.5%</strong> | Issued: Kathmandu, Nepal
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 relative text-center">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-cyan/15 border border-brand-cyan/40 text-brand-cyan text-xs font-bold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5" /> Launch Your Technical Future
          </div>
          <h2 className="text-4xl sm:text-6xl font-extrabold font-display text-white leading-tight">
            Ready to Build Real Systems with Himnova?
          </h2>
          <p className="text-slate-300 text-base max-w-2xl mx-auto leading-relaxed">
            Join hundreds of motivated learners transforming their career with industry-proven AI, cloud, and full-stack software tracks.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/register">
              <button className="relative overflow-hidden inline-flex items-center justify-center font-bold rounded-xl px-8 py-4 text-sm gap-2.5 bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-2xl shadow-brand-cyan/30 hover:brightness-110 active:scale-95 transition-all">
                <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                <span>Get Started Now (Free Registration)</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </Link>
            <Link href="/courses">
              <button className="px-7 py-4 text-sm font-bold rounded-xl bg-alpine-900 text-slate-200 border border-white/10 hover:bg-alpine-850 transition-all">
                Browse All Masterclasses
              </button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function BookOpenIcon(props: any) {
  return <GraduationCap {...props} />;
}
