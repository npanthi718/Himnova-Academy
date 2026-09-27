'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { PaymentModal } from '@/components/payment/PaymentModal';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import { OfficialCertificate } from '@/components/certificate/OfficialCertificate';
import {
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Award,
  BookOpen,
  PlayCircle,
  FileText,
  ShieldCheck,
  Users,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ExternalLink,
  Lock,
  Eye,
  Check,
} from 'lucide-react';

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const { user, isAuthenticated } = useAuth();
  const [course, setCourse] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>({});
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [showCertificateModal, setShowCertificateModal] = useState(false);


  useEffect(() => {
    if (slug) {
      setLoading(true);
      api.getCourseBySlug(slug, user?.id)
        .then((data) => {
          setCourse(data);
          // Open first module by default
          if (data.modules && data.modules.length > 0) {
            setOpenModules({ [data.modules[0].id]: true });
          }
        })
        .finally(() => setLoading(false));
    }
  }, [slug, user?.id]);

  const toggleModule = (modId: string) => {
    setOpenModules((prev) => ({ ...prev, [modId]: !prev[modId] }));
  };

  const handleEnrollClick = () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/courses/${slug}`);
      return;
    }
    if (course?.isEnrolled) {
      router.push(`/learn/${course.slug}`);
      return;
    }
    setPaymentModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col justify-center items-center text-white">
        <Navbar />
        <div className="h-10 w-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col justify-center items-center text-white space-y-4">
        <Navbar />
        <h2 className="text-2xl font-bold">Course Not Found</h2>
        <Link href="/courses" className="text-brand-cyan hover:underline">
          ← Return to Courses
        </Link>
      </div>
    );
  }

  const activeBatch = course.batches && course.batches[0];

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-900">
      <Navbar />
      <div className="noise-overlay" />

      {/* Hero Course Header */}
      <section className="pt-28 pb-16 bg-gradient-to-b from-alpine-900/90 via-alpine-950 to-alpine-950 border-b border-white/10 relative">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Info */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold uppercase">
                  {course.category}
                </span>
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono font-bold uppercase">
                  {course.difficulty} Level
                </span>
                {course.isEnrolled && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-bold flex items-center gap-1">
                    <CheckCircle2 className="h-3.5 w-3.5" /> Enrolled
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold font-display text-white leading-tight">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-3xl">
                {course.subtitle || course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 pt-2 text-xs sm:text-sm font-mono text-slate-300">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-brand-cyan" />
                  <span>{course.durationHours} Total Hours</span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-brand-cyan" />
                  <span>{course.modules?.length || 0} Modules</span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="h-4 w-4 text-brand-cyan" />
                  <span>Verified QR Certificate</span>
                </div>
              </div>
            </div>

            {/* Right Card / Checkout Box */}
            <div className="lg:col-span-4">
              <div className="glass-card p-6 sm:p-8 rounded-3xl space-y-6 shadow-2xl shadow-brand-cyan/15 border-brand-cyan/30">
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                  <img
                    src={course.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800'}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button
                      onClick={handleEnrollClick}
                      className="h-12 w-12 rounded-full bg-brand-cyan/90 text-slate-950 flex items-center justify-center shadow-lg shadow-brand-cyan/40 hover:scale-110 transition-transform"
                    >
                      <PlayCircle className="h-6 w-6 ml-0.5" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <span className="text-xs text-slate-400 font-mono uppercase block">Masterclass Tuition</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold font-display text-white">
                      {formatCurrency(course.discountPrice || course.price)}
                    </span>
                    {course.discountPrice && (
                      <span className="text-base text-slate-500 line-through">
                        {formatCurrency(course.price)}
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-emerald-400 font-mono">
                    ✔ Inclusive of Live Classes, LMS Player, Mentorship & Certificate
                  </p>
                </div>

                <button
                  onClick={handleEnrollClick}
                  className="w-full relative overflow-hidden flex items-center justify-center gap-2 py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-sm font-bold shadow-xl shadow-brand-cyan/25 hover:brightness-110 active:scale-98 transition-all"
                >
                  <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                  {course.isEnrolled ? (
                    <>
                      <span>Continue Learning</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  ) : (
                    <>
                      <span>Enroll in Cohort (eSewa / Khalti)</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>

                {activeBatch && (
                  <div className="p-3 rounded-xl bg-alpine-850/80 border border-white/5 text-xs font-mono text-slate-400 space-y-1">
                    <p className="text-white font-semibold">Active Cohort: {activeBatch.name}</p>
                    <p className="text-[11px] text-brand-cyan">Code: {activeBatch.code}</p>
                    {activeBatch.trainer && (
                      <p className="text-[11px] text-slate-300">Instructor: {activeBatch.trainer.fullName}</p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Details Body */}
      <main className="flex-1 py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Learning Outcomes */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-cyan" />
                <span>What You Will Build & Master</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {course.learningOutcomes?.map((outcome: string, idx: number) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-alpine-900/60 border border-white/5 flex items-start gap-3"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs text-slate-300 leading-relaxed">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Curriculum Accordion */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-brand-cyan" />
                  <span>Curriculum & Lessons</span>
                </h3>
                <span className="text-xs font-mono text-slate-400">
                  {course.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)} Total Lessons
                </span>
              </div>

              <div className="space-y-3">
                {course.modules?.map((mod: any, idx: number) => {
                  const isOpen = openModules[mod.id];
                  return (
                    <div
                      key={mod.id}
                      className="rounded-2xl border border-white/10 bg-alpine-900/80 overflow-hidden"
                    >
                      <button
                        onClick={() => toggleModule(mod.id)}
                        className="w-full p-4 sm:p-5 flex items-center justify-between hover:bg-white/5 transition-colors text-left"
                      >
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold text-brand-cyan uppercase">
                            Module {idx + 1}
                          </span>
                          <h4 className="text-sm sm:text-base font-bold text-white font-display">
                            {mod.title}
                          </h4>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-xs font-mono text-slate-400">
                            {mod.lessons?.length || 0} Lessons
                          </span>
                          {isOpen ? (
                            <ChevronUp className="h-4 w-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="h-4 w-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {isOpen && (
                        <div className="border-t border-white/5 divide-y divide-white/5 bg-alpine-950/60">
                          {mod.lessons?.map((les: any) => (
                            <div
                              key={les.id}
                              className="p-3.5 sm:px-5 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-3">
                                {les.type === 'VIDEO' ? (
                                  <PlayCircle className="h-4 w-4 text-brand-cyan shrink-0" />
                                ) : (
                                  <FileText className="h-4 w-4 text-purple-400 shrink-0" />
                                )}
                                <div>
                                  <p className="font-semibold text-slate-200">{les.title}</p>
                                  <p className="text-[10px] text-slate-500 font-mono">
                                    {les.durationMinutes} mins • {les.type}
                                  </p>
                                </div>
                              </div>

                              {les.isFreePreview || course.isEnrolled ? (
                                <Link href={`/learn/${course.slug}/${les.id}`}>
                                  <button className="px-3 py-1 text-[11px] font-bold rounded-lg bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25">
                                    {les.isFreePreview ? 'Preview' : 'Watch'}
                                  </button>
                                </Link>
                              ) : (
                                <Lock className="h-4 w-4 text-slate-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Official Industry-Recognized Certificate Showcase */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
                    <Award className="h-3.5 w-3.5 text-amber-400" />
                    <span>Official Industry Credential</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Verified Certificate of Engineering Mastery
                  </h3>
                </div>
                <button
                  onClick={() => setShowCertificateModal(true)}
                  className="px-4 py-2 rounded-xl bg-alpine-850 hover:bg-alpine-800 text-brand-cyan border border-white/10 font-bold text-xs flex items-center gap-1.5 transition-colors self-start sm:self-auto"
                >
                  <Eye className="h-4 w-4" />
                  <span>View Full Sample Certificate</span>
                </button>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-sans">
                Every graduate completing the live lab deliverables and capstone evaluation is awarded an official, tamper-proof credential issued by <strong>Himnova Technologies Pvt. Ltd.</strong>, featuring an immutable ID, digital signature ledger, and scannable public registry QR authentication.
              </p>

              {/* Sample Certificate Embedded Card */}
              <div className="relative rounded-3xl border border-amber-500/30 bg-slate-950/60 p-3 sm:p-5 overflow-hidden shadow-2xl">
                <div className="scale-95 sm:scale-100 transform-origin-top">
                  <OfficialCertificate
                    showActions={false}
                    certificate={{
                      certificateNumber: 'HIM-ACADEMY-SAMPLE-2026',
                      recipientName: 'Aayush Maharjan',
                      course: {
                        title: course.title,
                        durationHours: course.durationHours || 75,
                      },
                      customTitle: 'Certificate of Professional Engineering Excellence',
                      customHonor: 'Graduated with Highest Distinction & Capstone Excellence',
                      customDescription: `for successfully demonstrating verified architectural competence, engineering rigor, and technical mastery in the intensive 10-Week Industry Career Launchpad (${course.durationHours || 75} Hours) in ${course.title}. Demonstrating hands-on production deployment of Autonomous Multi-Agent AI Systems, Enterprise Vector Retrieval (RAG), Scalable Full Stack Microservices, and Verified Capstone Deliverables evaluated with a score of 98%.`,
                      customSkills: 'Autonomous AI Agents, Multi-Agent LangGraph, Vector DB & Hybrid RAG, Full Stack Next.js & NestJS, Docker & Cloud Deployment',
                      completionScore: 98,
                      issueDate: new Date(),
                      signatoryName: 'Sushil Panthi',
                      signatoryTitle: 'Director & Lead AI Architect, Himnova Technologies Private Limited',
                    }}
                  />
                </div>

                {/* Features Pills Underneath */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-white/10 mt-3 text-[11px] font-mono text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Instant Online Verification</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>A4 PDF High-Res Print</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>LinkedIn Credential Sync</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>Director Authorized Seal</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Prerequisites */}
            {course.prerequisites?.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-base font-bold font-display text-white">Prerequisites</h3>
                <ul className="space-y-2 text-xs text-slate-300">
                  {course.prerequisites.map((prereq: string, idx: number) => (
                    <li key={idx} className="flex items-center gap-2">
                      <div className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>


          {/* Right Sidebar Details */}
          <div className="lg:col-span-4 space-y-6">
            {/* Instructor Bio Box */}
            {activeBatch?.trainer && (
              <div className="glass-card p-6 rounded-3xl space-y-4">
                <span className="text-[10px] font-mono uppercase font-bold text-brand-cyan">Lead Instructor</span>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-600 to-brand-cyan flex items-center justify-center text-white font-bold text-base overflow-hidden">
                    {activeBatch.trainer.avatarUrl ? (
                      <img src={activeBatch.trainer.avatarUrl} alt={activeBatch.trainer.fullName} className="h-full w-full object-cover" />
                    ) : (
                      activeBatch.trainer.fullName.slice(0, 2).toUpperCase()
                    )}
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{activeBatch.trainer.fullName}</h4>
                    <p className="text-[11px] text-slate-400">Himnova Senior Architect</p>
                  </div>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{activeBatch.trainer.bio}</p>
              </div>
            )}

            {/* Organization Trust Badge */}
            <div className="p-6 rounded-3xl border border-white/10 bg-alpine-900/60 space-y-3 text-xs text-slate-400">
              <div className="flex items-center gap-2 text-white font-bold">
                <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                <span>Himnova Engineering Quality</span>
              </div>
              <p className="leading-relaxed">
                Curriculum built on active production pipelines from Himnova Technologies Pvt. Ltd., Kathmandu.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Payment Checkout Modal */}
      <PaymentModal
        course={course}
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        onSuccess={() => {
          setPaymentModalOpen(false);
          setCourse((prev: any) => ({ ...prev, isEnrolled: true }));
        }}
      />

      {/* Full Sample Certificate Preview Modal */}
      {showCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
          <div className="relative max-w-5xl w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[95vh]">
            <div className="flex items-center justify-between pb-2 border-b border-white/10">
              <div className="flex items-center gap-2 text-white font-bold">
                <Award className="h-5 w-5 text-amber-400" />
                <span>Official Course Credential Preview: {course.title}</span>
              </div>
              <button
                onClick={() => setShowCertificateModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
              >
                ✕
              </button>
            </div>

            <OfficialCertificate
              showActions={true}
              certificate={{
                certificateNumber: 'HIM-ACADEMY-SAMPLE-2026',
                recipientName: 'Aayush Maharjan',
                course: {
                  title: course.title,
                  durationHours: course.durationHours || 75,
                },
                customTitle: 'Certificate of Professional Engineering Excellence',
                customHonor: 'Graduated with Highest Distinction & Capstone Excellence',
                customDescription: `for successfully demonstrating verified architectural competence, engineering rigor, and technical mastery in the intensive 10-Week Industry Career Launchpad (${course.durationHours || 75} Hours) in ${course.title}. Demonstrating hands-on production deployment of Autonomous Multi-Agent AI Systems, Enterprise Vector Retrieval (RAG), Scalable Full Stack Microservices, and Verified Capstone Deliverables evaluated with a score of 98%.`,
                customSkills: 'Autonomous AI Agents, Multi-Agent LangGraph, Vector DB & Hybrid RAG, Full Stack Next.js & NestJS, Docker & Cloud Deployment',
                completionScore: 98,
                issueDate: new Date(),
                signatoryName: 'Sushil Panthi',
                signatoryTitle: 'Director & Lead AI Architect, Himnova Technologies Private Limited',
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

