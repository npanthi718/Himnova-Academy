'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import {
  FileText,
  Clock,
  CheckCircle2,
  AlertCircle,
  UploadCloud,
  Github,
  ExternalLink,
  MessageSquare,
  Award,
  X,
  Plus
} from 'lucide-react';

export default function StudentAssignmentsPage() {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSubmissionAssignment, setActiveSubmissionAssignment] = useState<any | null>(null);
  
  // Submission Form State
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchAssignments();
  }, []);

  async function fetchAssignments() {
    try {
      const data = await api.getAssignments();
      setAssignments(data || []);
    } catch (err) {
      console.error('Failed to load assignments', err);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeSubmissionAssignment) return;

    setSubmitting(true);
    setSubmitSuccess(null);
    try {
      await api.submitAssignment({
        assignmentId: activeSubmissionAssignment.id,
        githubUrl: githubUrl || undefined,
        liveUrl: liveUrl || undefined,
        content: content || undefined,
      });

      setSubmitSuccess('Project deliverables submitted successfully for mentor evaluation!');
      setTimeout(() => {
        setActiveSubmissionAssignment(null);
        setSubmitSuccess(null);
        setGithubUrl('');
        setLiveUrl('');
        setContent('');
        fetchAssignments();
      }, 2000);
    } catch (err: any) {
      alert(err.message || 'Failed to submit assignment');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <FileText className="w-6 h-6 text-brand-cyan" />
              <span>Assignments, Labs & Capstone Projects</span>
            </h1>
            <p className="text-xs text-slate-400">
              Submit your code repositories and live deployments to receive detailed industry review and graduation grades.
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl bg-alpine-900 border border-brand-cyan/30 text-xs font-mono text-slate-300">
            Total Projects: <strong className="text-brand-cyan">{assignments.length}</strong>
          </span>
        </div>

        {/* Assignments Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((n) => (
              <div key={n} className="h-64 rounded-3xl bg-alpine-900/60 border border-white/5 animate-pulse" />
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-16 p-8 rounded-3xl border border-white/10 bg-alpine-900/80 space-y-4 shadow-xl">
            <FileText className="w-12 h-12 text-slate-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No assignments active yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Your instructor will assign lab tasks and capstone projects as you progress through course modules.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {assignments.map((assignment) => {
              const submission = assignment.submissions && assignment.submissions[0];
              const isSubmitted = !!submission;
              const isGraded = submission?.status === 'GRADED' || submission?.score !== undefined;

              return (
                <div
                  key={assignment.id}
                  className="rounded-3xl border border-white/10 bg-alpine-900/80 p-6 backdrop-blur-md flex flex-col justify-between shadow-xl space-y-4 group hover:border-brand-cyan/30 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                        {assignment.course?.title || 'Technical Capstone'}
                      </span>
                      {isGraded ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" /> Score: {submission.score} / {assignment.maxScore || 100}
                        </span>
                      ) : isSubmitted ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> Under Review
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                          Pending Submission
                        </span>
                      )}
                    </div>

                    <h3 className="text-base font-bold font-display text-white">
                      {assignment.title}
                    </h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {assignment.description}
                    </p>

                    <div className="pt-1 flex items-center gap-4 text-xs font-mono text-slate-400">
                      <span>Max Score: <strong>{assignment.maxScore || 100} pts</strong></span>
                      {assignment.dueDate && (
                        <span>Due: {new Date(assignment.dueDate).toLocaleDateString()}</span>
                      )}
                    </div>

                    {/* Mentor Feedback Display */}
                    {submission?.feedback && (
                      <div className="p-3.5 rounded-2xl bg-alpine-850 border border-white/5 space-y-1">
                        <span className="text-[10px] font-mono font-bold text-amber-400 uppercase tracking-wider block">
                          Mentor Evaluation Feedback
                        </span>
                        <p className="text-xs text-slate-300 italic">
                          &ldquo;{submission.feedback}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="pt-3 border-t border-white/5 flex items-center justify-between">
                    {submission ? (
                      <div className="flex items-center gap-2">
                        {submission.githubUrl && (
                          <a
                            href={submission.githubUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-alpine-850 hover:bg-alpine-800 text-slate-300 hover:text-white border border-white/5 text-xs font-mono flex items-center gap-1.5"
                          >
                            <Github className="w-3.5 h-3.5" /> Code
                          </a>
                        )}
                        {submission.liveUrl && (
                          <a
                            href={submission.liveUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 rounded-xl bg-alpine-850 hover:bg-alpine-800 text-brand-cyan border border-white/5 text-xs font-mono flex items-center gap-1.5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" /> Demo
                          </a>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs font-mono text-slate-500">Not submitted yet</span>
                    )}

                    <button
                      onClick={() => {
                        setActiveSubmissionAssignment(assignment);
                        setGithubUrl(submission?.githubUrl || '');
                        setLiveUrl(submission?.liveUrl || '');
                        setContent(submission?.content || '');
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-1.5"
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{isSubmitted ? 'Resubmit Deliverables' : 'Submit Project'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Submission Drawer / Modal */}
        {activeSubmissionAssignment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-alpine-900 p-6 md:p-8 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-brand-cyan uppercase tracking-wider block">Deliverables Submission</span>
                  <h3 className="text-lg font-bold font-display text-white">{activeSubmissionAssignment.title}</h3>
                </div>
                <button
                  onClick={() => setActiveSubmissionAssignment(null)}
                  className="p-2 rounded-xl bg-alpine-850 hover:bg-alpine-800 text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {submitSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                  <h4 className="text-sm font-bold text-white">Deliverables Submitted!</h4>
                  <p className="text-xs text-slate-300">{submitSuccess}</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <Github className="w-3.5 h-3.5 text-brand-cyan" /> GitHub Repository URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://github.com/username/project-repo"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      required
                      className="w-full px-4 py-2.5 rounded-2xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
                      <ExternalLink className="w-3.5 h-3.5 text-brand-cyan" /> Live Deployment URL (Vercel / Cloud / Demo)
                    </label>
                    <input
                      type="url"
                      placeholder="https://my-app.vercel.app"
                      value={liveUrl}
                      onChange={(e) => setLiveUrl(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Engineering Notes & Implementation Details
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Explain architectural choices, key libraries used, and how to test your implementation..."
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-2xl bg-alpine-850 border border-white/10 text-xs text-white placeholder:text-slate-500 font-mono focus:outline-none focus:border-brand-cyan"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-end gap-3">
                    <button
                      type="button"
                      onClick={() => setActiveSubmissionAssignment(null)}
                      className="px-4 py-2.5 rounded-xl bg-alpine-850 hover:bg-alpine-800 text-xs font-mono text-slate-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold shadow-lg shadow-brand-cyan/25 hover:brightness-110 disabled:opacity-50"
                    >
                      {submitting ? 'Submitting...' : 'Confirm Submission'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
