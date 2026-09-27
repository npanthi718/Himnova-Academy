'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { HimnovaLogo } from '@/components/brand/HimnovaLogo';
import { OfficialCertificate } from '@/components/certificate/OfficialCertificate';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import {
  Award,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  ExternalLink,
  Printer,
  QrCode,
  AlertTriangle,
  Search,
  Building,
  Check
} from 'lucide-react';

export default function CertificateVerificationPage() {
  const params = useParams();
  const router = useRouter();
  const certId = params?.certificateId as string;
  const [cert, setCert] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchCode, setSearchCode] = useState('');

  useEffect(() => {
    if (certId) {
      setLoading(true);
      setError('');
      api.verifyCertificate(certId)
        .then((data) => setCert(data))
        .catch((err) => setError(err.message || 'Certificate record not found.'))
        .finally(() => setLoading(false));
    }
  }, [certId]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchCode.trim()) {
      router.push(`/verify/${searchCode.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col selection:bg-brand-cyan selection:text-slate-900">
      <Navbar />
      <div className="noise-overlay" />

      <main className="flex-1 pt-28 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-8">
        {/* Verification Banner */}
        <div className="text-center space-y-3 no-print">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs font-mono font-bold uppercase tracking-widest shadow-lg shadow-emerald-500/10">
            <ShieldCheck className="h-4 w-4" />
            <span>Himnova Official Certificate Registry</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-white">
            Credential Authenticity <span className="text-brand-cyan">Verification</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 font-mono">
            Directly verified against the immutable Himnova Technologies database & signature ledger
          </p>
        </div>

        {loading ? (
          <div className="p-16 rounded-3xl bg-alpine-900/60 border border-white/10 text-center space-y-4">
            <div className="h-10 w-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-mono text-slate-400">Verifying credential ID #{certId} against Himnova root ledger...</p>
          </div>
        ) : error || !cert ? (
          <div className="p-10 rounded-3xl bg-red-500/10 border border-red-500/30 text-center space-y-5 max-w-lg mx-auto">
            <AlertTriangle className="h-12 w-12 text-red-400 mx-auto" />
            <h3 className="text-xl font-bold font-display text-white">Certificate Not Found</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              The credential identification code <code className="text-red-300 font-bold">{certId}</code> does not match any valid certificate issued by Himnova Technologies Pvt. Ltd.
            </p>

            <form onSubmit={handleSearch} className="flex gap-2 pt-2">
              <input
                type="text"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                placeholder="e.g. HIM-CERT-2026-XXXX"
                className="flex-1 px-3.5 py-2.5 rounded-xl bg-alpine-900 border border-white/15 text-xs text-white uppercase font-mono focus:outline-none focus:border-brand-cyan"
              />
              <button
                type="submit"
                className="px-4 py-2.5 rounded-xl bg-brand-cyan text-alpine-950 font-bold text-xs hover:brightness-110"
              >
                Search
              </button>
            </form>

            <Link href="/" className="inline-block text-xs text-brand-cyan hover:underline font-mono">
              &larr; Return to Homepage
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Authenticity Verification Callout */}
            <div className="p-5 sm:p-6 rounded-3xl bg-emerald-500/10 border-2 border-emerald-500/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 no-print shadow-xl shadow-emerald-500/10">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
                  <CheckCircle2 className="h-7 w-7" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base sm:text-lg font-bold font-display text-white">
                      100% Verified & Legitimate Credential
                    </h3>
                    <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-mono font-bold uppercase">
                      ACTIVE
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 font-mono mt-0.5">
                    Issued by <strong>Himnova Technologies Pvt. Ltd.</strong> to <strong className="text-white">{cert.recipientName || cert.student?.fullName}</strong>
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right text-xs font-mono text-slate-400">
                <p>Verified: <strong className="text-emerald-400">{formatDate(cert.issueDate)}</strong></p>
                <p className="text-[11px]">Kathmandu, Nepal</p>
              </div>
            </div>

            {/* Official Horizontal A4 Certificate Display */}
            <OfficialCertificate certificate={cert} showActions={true} />

            {/* Verification Metadata Breakdown Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs no-print">
              <div className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Graduate Candidate</div>
                <div className="text-base font-bold font-display text-white">{cert.recipientName || cert.student?.fullName}</div>
                <div className="text-[11px] text-brand-cyan">{cert.student?.email}</div>
              </div>

              <div className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Curriculum & Cohort</div>
                <div className="text-base font-bold font-display text-white truncate">{cert.course?.title}</div>
                <div className="text-[11px] text-slate-400">{cert.course?.durationHours || 75} Hours • Grade: {cert.completionScore || 96}%</div>
              </div>

              <div className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 space-y-2">
                <div className="text-slate-400 font-bold uppercase text-[10px]">Authorizing Signatory</div>
                <div className="text-base font-bold font-display text-white">{cert.signatoryName || 'Sushil Panthi'}</div>
                <div className="text-[11px] text-slate-400">{cert.signatoryTitle || 'Director & Lead AI Architect, Himnova Technologies Pvt. Ltd.'}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
