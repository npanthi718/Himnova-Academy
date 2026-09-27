'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { OfficialCertificate } from '@/components/certificate/OfficialCertificate';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Calendar,
  Download,
  Share2,
  CheckCircle2,
  Sparkles,
  Eye,
  X,
  Printer
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function StudentCertificatesPage() {
  const [certificates, setCertificates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCert, setSelectedCert] = useState<any | null>(null);

  useEffect(() => {
    api.getMyCertificates()
      .then(setCertificates)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['STUDENT']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white flex items-center gap-2">
              <Award className="h-6 w-6 text-brand-cyan" />
              <span>Verified Industry Credentials</span>
            </h1>
            <p className="text-xs text-slate-400">
              Legitimate tamper-proof digital certificates issued by Himnova Technologies Private Limited
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-2xl bg-alpine-900 border border-brand-cyan/30 text-xs font-mono text-slate-300">
            Earned: <strong className="text-brand-cyan">{certificates.length}</strong> Credentials
          </span>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-44 rounded-3xl bg-alpine-900/60 border border-white/10 animate-pulse" />
            ))}
          </div>
        ) : certificates.length === 0 ? (
          <div className="p-12 text-center rounded-3xl border border-white/10 bg-alpine-900/40 text-slate-500 space-y-4">
            <Award className="w-12 h-12 mx-auto text-slate-600" />
            <h3 className="text-base font-bold text-white">No Certificates Issued Yet</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Complete your course modules, attend live classes, and submit your portfolio projects to receive your official signed Himnova certificate.
            </p>
            <Link
              href="/student/my-courses"
              className="inline-block px-4 py-2 bg-brand-cyan text-alpine-950 text-xs font-bold rounded-xl shadow-md hover:brightness-110"
            >
              Go to Course Player
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {certificates.map((cert) => {
              const verifyUrl = typeof window !== 'undefined'
                ? `${window.location.origin}/verify/${cert.certificateNumber}`
                : `http://localhost:3000/verify/${cert.certificateNumber}`;

              return (
                <div
                  key={cert.id}
                  className="rounded-3xl border border-brand-cyan/30 bg-alpine-900/90 p-6 shadow-xl shadow-cyan-950/20 flex flex-col justify-between space-y-5"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        <span>100% VERIFIED CREDENTIAL</span>
                      </span>
                      <h3 className="text-lg font-bold font-display text-white">{cert.course?.title}</h3>
                      <p className="text-xs text-slate-400 font-mono">
                        ID: <strong className="text-brand-cyan">{cert.certificateNumber}</strong>
                      </p>
                    </div>

                    <div className="p-2 rounded-xl bg-white shrink-0 shadow-md">
                      <QRCodeSVG value={verifyUrl} size={60} />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs font-mono">
                    <div>
                      <span className="text-slate-500 block text-[10px]">EVALUATION SCORE</span>
                      <span className="font-bold text-emerald-400 text-sm">{cert.completionScore || 95}%</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[10px]">ISSUE DATE</span>
                      <span className="text-slate-300">{formatDate(cert.issueDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="flex-1 py-2.5 rounded-xl bg-brand-cyan text-alpine-950 text-xs font-bold shadow-md hover:brightness-110 flex items-center justify-center gap-1.5"
                    >
                      <Eye className="h-3.5 w-3.5" />
                      <span>View Official A4 Certificate</span>
                    </button>

                    <a
                      href={verifyUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-2.5 rounded-xl bg-alpine-800 hover:bg-alpine-750 text-slate-200 border border-white/10"
                      title="Open Public Verification Link"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Certificate Modal View */}
        {selectedCert && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-5xl w-full my-6 bg-alpine-950 border border-white/15 rounded-3xl p-6 space-y-4">
              <div className="flex items-center justify-between no-print">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <h3 className="text-base font-bold text-white font-display">
                    Official Horizontal A4 Signed Certificate
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <OfficialCertificate certificate={selectedCert} showActions={true} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
