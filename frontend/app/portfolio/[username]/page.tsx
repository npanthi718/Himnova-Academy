'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { api } from '@/lib/api-client';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Award,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Mail,
  User,
  Terminal,
  Video,
} from 'lucide-react';

export default function PublicPortfolioPage() {
  const params = useParams();
  const username = params?.username as string;
  const [profile, setProfile] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (username) {
      setLoading(true);
      setError('');
      api.getPublicPortfolio(username)
        .then((data) => setProfile(data))
        .catch((err) => setError(err.message || 'Portfolio not found.'))
        .finally(() => setLoading(false));
    }
  }, [username]);

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-900">
      <Navbar />
      <div className="noise-overlay" />

      <main className="flex-1 pt-28 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-12">
        {loading ? (
          <div className="p-16 glass-card rounded-3xl text-center space-y-3">
            <div className="h-10 w-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-slate-400">Loading candidate engineering portfolio...</p>
          </div>
        ) : error || !profile ? (
          <div className="p-8 rounded-3xl bg-red-500/10 border border-red-500/30 text-center space-y-4">
            <h3 className="text-lg font-bold text-white">Portfolio Profile Not Found</h3>
            <p className="text-xs text-slate-400">{error || 'Unable to locate student portfolio.'}</p>
            <Link href="/">
              <button className="px-4 py-2 rounded-xl bg-white/10 text-white text-xs font-bold">
                Return to Launchpad
              </button>
            </Link>
          </div>
        ) : (
          <>
            {/* Candidate Header Profile Box */}
            <div className="glass-card p-8 sm:p-10 rounded-3xl border-brand-cyan/30 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
                <div className="h-24 w-24 sm:h-28 sm:w-28 rounded-3xl bg-gradient-to-br from-blue-600 to-brand-cyan p-1 shrink-0 shadow-xl shadow-brand-cyan/25 overflow-hidden">
                  <img
                    src={profile.avatarUrl || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200'}
                    alt={profile.fullName}
                    className="h-full w-full object-cover rounded-[22px]"
                  />
                </div>

                <div className="space-y-3 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-xs font-mono font-bold uppercase flex items-center gap-1.5">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Himnova Verified Fellow</span>
                    </span>
                    <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-mono">
                      Ref #{profile.referralCode}
                    </span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
                    {profile.fullName}
                  </h1>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                    {profile.bio || 'AI Engineer & Full-Stack Systems builder trained through Himnova AI Career Launchpad.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Deployed Projects Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <FolderGit2 className="h-5 w-5 text-brand-cyan" />
                  <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                    Deployed Engineering Projects ({profile.portfolioProjects?.length || 0})
                  </h2>
                </div>
                <span className="text-xs font-mono text-slate-400">Production-Ready Demos</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {profile.portfolioProjects?.map((proj: any) => (
                  <div
                    key={proj.id}
                    className="glass-card glass-card-hover p-6 rounded-3xl space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-3">
                      {proj.thumbnailUrl && (
                        <div className="h-44 w-full rounded-2xl overflow-hidden bg-slate-900 border border-white/10">
                          <img src={proj.thumbnailUrl} alt={proj.title} className="h-full w-full object-cover" />
                        </div>
                      )}

                      <h3 className="text-lg font-bold font-display text-white">{proj.title}</h3>
                      <p className="text-xs text-slate-300 leading-relaxed">{proj.description}</p>

                      {/* Tech Stack Badges */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {proj.technologies?.map((tech: string, idx: number) => (
                          <span
                            key={idx}
                            className="px-2.5 py-0.5 rounded-lg bg-white/5 text-[11px] font-mono font-bold text-brand-cyan border border-brand-cyan/30"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Trainer Review Feedback */}
                      {proj.trainerFeedback && (
                        <div className="p-3 rounded-xl bg-alpine-850/90 border border-purple-500/30 text-xs text-slate-300 space-y-1">
                          <span className="text-[10px] font-mono text-purple-400 font-bold uppercase block">
                            Instructor Evaluation Note
                          </span>
                          <p className="italic">“{proj.trainerFeedback}”</p>
                        </div>
                      )}
                    </div>

                    {/* Project Links */}
                    <div className="pt-4 border-t border-white/5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                          >
                            <Github className="h-3.5 w-3.5" />
                            <span>GitHub</span>
                          </a>
                        )}
                        {proj.videoDemoUrl && (
                          <a
                            href={proj.videoDemoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-white text-xs font-semibold flex items-center gap-1.5 border border-white/10"
                          >
                            <Video className="h-3.5 w-3.5 text-purple-400" />
                            <span>Video</span>
                          </a>
                        )}
                      </div>

                      {proj.liveUrl && (
                        <a
                          href={proj.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20"
                        >
                          <span>Live Demo</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verified Certificates Section */}
            {profile.certificates?.length > 0 && (
              <div className="space-y-4 pt-6 border-t border-white/10">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-brand-cyan" />
                  <h2 className="text-xl font-bold font-display text-white">Verified Himnova Credentials</h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {profile.certificates.map((c: any) => (
                    <div
                      key={c.id}
                      className="p-4 rounded-2xl bg-alpine-900 border border-white/10 flex items-center justify-between"
                    >
                      <div className="space-y-1">
                        <h4 className="text-sm font-bold text-white">{c.course?.title}</h4>
                        <p className="text-[10px] font-mono text-slate-400">
                          CERT #{c.certificateNumber} • Score: <strong className="text-emerald-400">{c.completionScore}%</strong>
                        </p>
                      </div>
                      <Link href={`/verify/${c.certificateNumber}`}>
                        <button className="px-3 py-1.5 rounded-xl bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 text-xs font-bold hover:bg-brand-cyan/30">
                          Verify
                        </button>
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
