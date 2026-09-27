'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import {
  FileCheck,
  Github,
  ExternalLink,
  CheckCircle2,
  Clock,
  X,
  Star,
  Award,
} from 'lucide-react';

export default function TrainerSubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [selectedSub, setSelectedSub] = useState<any | null>(null);
  const [score, setScore] = useState<number>(90);
  const [feedback, setFeedback] = useState('');
  const [status, setStatus] = useState('APPROVED');
  const [loading, setLoading] = useState(true);

  const loadSubmissions = () => {
    setLoading(true);
    api.getTrainerSubmissions()
      .then(setSubmissions)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadSubmissions();
  }, []);

  const handleGrade = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSub) return;
    try {
      await api.gradeSubmission(selectedSub.id, {
        score: Number(score),
        feedback,
        status,
      });
      setSelectedSub(null);
      loadSubmissions();
    } catch (err: any) {
      alert(err.message || 'Failed to submit grade');
    }
  };

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="border-b border-white/10 pb-4">
          <h1 className="text-2xl font-bold font-display text-white">Student Assignment Submissions</h1>
          <p className="text-xs text-slate-400">Review student technical deliverables, GitHub repos and assign grades</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="p-6 rounded-3xl bg-alpine-900 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-slate-800 overflow-hidden shrink-0">
                    <img src={sub.student?.avatarUrl} alt={sub.student?.fullName} className="h-full w-full object-cover" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{sub.student?.fullName}</h3>
                    <p className="text-[11px] text-slate-400 font-mono">{sub.assignment?.title}</p>
                  </div>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed max-w-2xl bg-alpine-950/60 p-3 rounded-xl border border-white/5 font-sans">
                  {sub.submissionText || 'No text summary provided.'}
                </p>

                <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
                  {sub.githubUrl && (
                    <a
                      href={sub.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-brand-cyan hover:underline"
                    >
                      <Github className="h-3.5 w-3.5" />
                      <span>Repository</span>
                    </a>
                  )}
                  {sub.liveDemoUrl && (
                    <a
                      href={sub.liveDemoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-emerald-400 hover:underline"
                    >
                      <ExternalLink className="h-3.5 w-3.5" />
                      <span>Live Demo</span>
                    </a>
                  )}
                  <span>Submitted: {formatDate(sub.submittedAt)}</span>
                </div>
              </div>

              {/* Status & Action */}
              <div className="flex flex-col md:items-end gap-2 shrink-0">
                <span className={`px-3 py-1 rounded-full text-[11px] font-mono font-bold uppercase ${
                  sub.status === 'APPROVED'
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}>
                  {sub.status} {sub.score !== null && sub.score !== undefined ? `(${sub.score}/100)` : ''}
                </span>

                <button
                  onClick={() => {
                    setSelectedSub(sub);
                    setScore(sub.score || 90);
                    setFeedback(sub.trainerFeedback || '');
                    setStatus(sub.status === 'SUBMITTED' ? 'APPROVED' : sub.status);
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold shadow-md shadow-brand-cyan/20"
                >
                  {sub.status === 'APPROVED' ? 'Edit Grade' : 'Review & Grade'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Grade Modal */}
        {selectedSub && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedSub(null)} />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-alpine-900/95 p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    Grade Submission: {selectedSub.student?.fullName}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">{selectedSub.assignment?.title}</p>
                </div>
                <button onClick={() => setSelectedSub(null)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleGrade} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Score (Out of 100)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={score}
                      onChange={(e) => setScore(Number(e.target.value))}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white font-mono focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Status</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="APPROVED">APPROVED</option>
                      <option value="REVISION_REQUIRED">REVISION REQUIRED</option>
                      <option value="GRADED">GRADED</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Instructor Technical Feedback</label>
                  <textarea
                    rows={4}
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    required
                    placeholder="Provide constructive feedback on architecture, efficiency, testing, and implementation..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white font-bold text-xs shadow-md shadow-brand-cyan/20"
                >
                  Save Grade & Dispatch Notification
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
