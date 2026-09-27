'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import {
  TrendingUp,
  CheckCircle2,
  Circle,
  Briefcase,
  Layers,
  Code,
  Award,
  Globe,
  Users,
  DollarSign,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  ChevronRight
} from 'lucide-react';

interface Stage {
  id: number;
  title: string;
  tagline: string;
  desc: string;
  status: 'COMPLETED' | 'CURRENT' | 'LOCKED';
  milestones: { text: string; done: boolean }[];
  actionLink?: { text: string; href: string };
}

export default function StudentEarnPlanPage() {
  const [stages, setStages] = useState<Stage[]>([
    {
      id: 1,
      title: 'LEARN: Core Engineering Foundations',
      tagline: 'Absorb syllabus theory, architecture paradigms, and cloud primitives.',
      desc: 'Complete your assigned module lessons, interactive quizzes, and architecture reading materials.',
      status: 'COMPLETED',
      milestones: [
        { text: 'Complete 100% of Module 1 Fundamentals', done: true },
        { text: 'Pass weekly concept checkpoint quiz', done: true },
        { text: 'Participate in 2+ live Q&A sessions', done: true },
      ],
      actionLink: { text: 'Review Course Modules', href: '/student/my-courses' },
    },
    {
      id: 2,
      title: 'PRACTICE: Hands-on Lab Mastery',
      tagline: 'Write production-ready code in guided sandbox environments.',
      desc: 'Execute rigorous lab exercises covering agentic orchestration, hybrid vector retrieval, and NestJS microservices.',
      status: 'COMPLETED',
      milestones: [
        { text: 'Implement LangGraph multi-agent loop', done: true },
        { text: 'Deploy pgvector semantic search service', done: true },
        { text: 'Benchmark API latency <200ms', done: true },
      ],
      actionLink: { text: 'Open Assignments Hub', href: '/student/assignments' },
    },
    {
      id: 3,
      title: 'BUILD: Capstone Industry System',
      tagline: 'Architect and deploy an end-to-end full-stack AI application.',
      desc: 'Deliver a complete production application meeting Himnova architectural criteria, authenticated with zero-trust RBAC and cloud infrastructure.',
      status: 'CURRENT',
      milestones: [
        { text: 'Complete production capstone repository', done: false },
        { text: 'Deploy public live demo on cloud (Vercel/AWS)', done: false },
        { text: 'Achieve passing review grade from Lead AI Architect', done: false },
      ],
      actionLink: { text: 'Submit Capstone Code', href: '/student/assignments' },
    },
    {
      id: 4,
      title: 'CERTIFY: Tamper-proof Credential Signoff',
      tagline: 'Unlock your official signed digital credential with live QR validation.',
      desc: 'Pass technical evaluation and attendance thresholds (>80%) to generate an official Himnova Certificate of Professional Engineering Excellence.',
      status: 'LOCKED',
      milestones: [
        { text: 'Maintain >80% live cohort attendance', done: false },
        { text: 'Earn cumulative grade score >85%', done: false },
        { text: 'Obtain Director signoff on graduation ledger', done: false },
      ],
      actionLink: { text: 'View Certificates', href: '/student/certificates' },
    },
    {
      id: 5,
      title: 'PORTFOLIO: Verified Public Engineering Profile',
      tagline: 'Showcase your live production projects to enterprise hiring partners.',
      desc: 'Publish your personalized Himnova engineering portfolio with live demo links, verified code repositories, and skill badges.',
      status: 'LOCKED',
      milestones: [
        { text: 'Publish public portfolio page', done: false },
        { text: 'Feature 2+ enterprise projects', done: false },
        { text: 'Link verified certificate credential', done: false },
      ],
      actionLink: { text: 'Configure Portfolio', href: '/student/portfolio' },
    },
    {
      id: 6,
      title: 'INTERVIEW: High-Impact Technical Simulation',
      tagline: 'Ace architectural interviews with 1-on-1 mock evaluations.',
      desc: 'Conduct simulated system design interviews and live coding assessments with senior engineering leaders.',
      status: 'LOCKED',
      milestones: [
        { text: 'Complete 1-on-1 mock system design review', done: false },
        { text: 'Pass technical behavioral screening', done: false },
        { text: 'Refine CV with Himnova verified credentials', done: false },
      ],
      actionLink: { text: 'Book Live Mock Interview', href: '/student/live-classes' },
    },
    {
      id: 7,
      title: 'EARN: Placement, Consulting & Referral Payouts',
      tagline: 'Monetize your technical engineering expertise.',
      desc: 'Access hiring pipelines, freelance contracts, and referral cash rewards of NPR 1,000+ per student enrollment.',
      status: 'LOCKED',
      milestones: [
        { text: 'Receive enterprise interview invitations', done: false },
        { text: 'Earn referral cash rewards on peer enrollments', done: false },
        { text: 'Transition to full-time engineering or client contracts', done: false },
      ],
      actionLink: { text: 'Referral Rewards Ledger', href: '/student/referrals' },
    },
  ]);

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <TrendingUp className="w-6 h-6 text-brand-cyan" />
              <span>Himnova 7-Stage Career Launch Progression</span>
            </h1>
            <p className="text-xs text-slate-400">
              A structured progression framework turning foundational learning into verified credentials and career monetization.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl bg-alpine-900 border border-brand-cyan/30 text-xs font-mono text-brand-cyan">
            Current Stage: <strong>03 • BUILD</strong>
          </span>
        </div>

        {/* Stage Timeline */}
        <div className="space-y-6">
          {stages.map((stage) => {
            const isDone = stage.status === 'COMPLETED';
            const isCurrent = stage.status === 'CURRENT';

            return (
              <div
                key={stage.id}
                className={`rounded-3xl border p-6 md:p-8 backdrop-blur-xl shadow-xl transition-all ${
                  isCurrent
                    ? 'border-brand-cyan/50 bg-gradient-to-r from-alpine-900 via-alpine-900/95 to-blue-950/30 shadow-brand-cyan/15'
                    : isDone
                    ? 'border-emerald-500/30 bg-alpine-900/80'
                    : 'border-white/5 bg-alpine-900/40 opacity-70'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="space-y-3 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        isDone
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : isCurrent
                          ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 animate-pulse'
                          : 'bg-white/5 text-slate-500 border border-white/10'
                      }`}>
                        Stage 0{stage.id} • {stage.status}
                      </span>
                    </div>

                    <h3 className="text-lg md:text-xl font-bold font-display text-white">
                      {stage.title}
                    </h3>
                    <p className="text-xs text-brand-cyan font-mono">{stage.tagline}</p>
                    <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">{stage.desc}</p>

                    {/* Milestones Checklist */}
                    <div className="pt-2 space-y-2">
                      <span className="text-[10px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                        Stage Milestones & Requirements
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                        {stage.milestones.map((m, idx) => (
                          <div
                            key={idx}
                            className={`p-2.5 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                              m.done
                                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300'
                                : 'bg-alpine-850/60 border-white/5 text-slate-400'
                            }`}
                          >
                            {m.done ? (
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Circle className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                            )}
                            <span className="line-clamp-1">{m.text}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {stage.actionLink && (
                    <div className="shrink-0 self-start md:self-center">
                      <Link
                        href={stage.actionLink.href}
                        className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl text-xs font-bold transition-all shadow-md ${
                          isCurrent
                            ? 'bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-brand-cyan/25 hover:brightness-110'
                            : 'bg-alpine-850 hover:bg-alpine-800 text-slate-300 border border-white/10'
                        }`}
                      >
                        <span>{stage.actionLink.text}</span>
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
