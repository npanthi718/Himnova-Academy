'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { OfficialCertificate } from '@/components/certificate/OfficialCertificate';
import { useAppModal } from '@/lib/modal-context';
import { 
  Award, 
  ShieldCheck, 
  ExternalLink, 
  Plus, 
  CheckCircle2, 
  Trash2, 
  Eye, 
  X, 
  User, 
  BookOpen, 
  RefreshCw,
  Edit3,
  Sparkles,
  Save
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCertificatesPage() {
  const { showAlert, showConfirm } = useAppModal();
  const [certs, setCerts] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal states
  const [isIssueModalOpen, setIsIssueModalOpen] = useState(false);
  const [selectedCertForView, setSelectedCertForView] = useState<any | null>(null);
  
  // Issue form state with rich customizations
  const [studentId, setStudentId] = useState('');
  const [courseId, setCourseId] = useState('');
  const [batchId, setBatchId] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [customTitle, setCustomTitle] = useState('Certificate of Professional Engineering Excellence');
  const [customDescription, setCustomDescription] = useState('');
  const [customSkills, setCustomSkills] = useState('Autonomous AI Agents, Multi-Agent LangGraph, Vector DB & Hybrid RAG, Full Stack Next.js & NestJS, Docker & Cloud Deployment');
  const [customHonor, setCustomHonor] = useState('Graduated with Highest Distinction & Capstone Excellence');
  const [score, setScore] = useState('96');
  const [issueDate, setIssueDate] = useState(new Date().toISOString().split('T')[0]);
  const [signatoryName, setSignatoryName] = useState('Sushil Panthi');
  const [signatoryTitle, setSignatoryTitle] = useState('Director & Lead AI Architect, Himnova Technologies Private Limited');
  const [submitting, setSubmitting] = useState(false);

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getAllCertificates(),
      api.getUsers({ role: 'STUDENT' }),
      api.getCourses(),
      api.getBatches(),
    ]).then(([certsRes, studentsRes, coursesRes, batchesRes]) => {
      setCerts(certsRes || []);
      setStudents(studentsRes || []);
      setCourses(coursesRes || []);
      setBatches(batchesRes || []);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateDescriptionText = (name?: string, courseTitle?: string, currentScore?: string) => {
    const cTitle = courseTitle || 'Autonomous AI Agent & Full Stack Engineering';
    const sScore = currentScore || '96';
    setCustomDescription(
      `for successfully demonstrating verified architectural competence, engineering rigor, and technical mastery in the intensive 10-Week Industry Career Launchpad (75 Hours) in ${cTitle}. Demonstrating hands-on production deployment of Autonomous Multi-Agent AI Systems, Enterprise Vector Retrieval (RAG), Scalable Full Stack Microservices, and Verified Capstone Deliverables evaluated with a score of ${sScore}%.`
    );
  };

  // Update default text when student or course changes
  const handleStudentSelect = (selectedId: string) => {
    setStudentId(selectedId);
    const stu = students.find((s) => s.id === selectedId);
    if (stu) {
      setRecipientName(stu.fullName);
    }
    const crs = courses.find((c) => c.id === courseId);
    updateDescriptionText(stu?.fullName || recipientName, crs?.title, score);
  };

  const handleCourseSelect = (selectedId: string) => {
    setCourseId(selectedId);
    const crs = courses.find((c) => c.id === selectedId);
    updateDescriptionText(recipientName, crs?.title, score);
  };

  const handleOpenIssueModal = () => {
    const defaultStudent = students[0];
    const defaultCourse = courses[0];
    setStudentId(defaultStudent?.id || '');
    setRecipientName(defaultStudent?.fullName || '');
    setCourseId(defaultCourse?.id || '');
    setBatchId(batches[0]?.id || '');
    setScore('96');
    setCustomTitle('Certificate of Professional Engineering Excellence');
    setCustomHonor('Graduated with Highest Distinction & Capstone Excellence');
    setCustomSkills('Autonomous AI Agents, Multi-Agent LangGraph, Vector DB & Hybrid RAG, Full Stack Next.js & NestJS, Docker & Cloud Deployment');
    setSignatoryName('Sushil Panthi');
    setSignatoryTitle('Director & Lead AI Architect, Himnova Technologies Private Limited');
    setIssueDate(new Date().toISOString().split('T')[0]);
    updateDescriptionText(defaultStudent?.fullName, defaultCourse?.title, '96');
    setIsIssueModalOpen(true);
  };

  const handleIssueCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentId || !courseId) return;
    setSubmitting(true);
    try {
      await api.issueCertificate({
        studentId,
        courseId,
        batchId: batchId || undefined,
        recipientName: recipientName.trim(),
        customTitle: customTitle.trim(),
        customDescription: customDescription.trim(),
        customSkills: customSkills.trim(),
        customHonor: customHonor.trim(),
        score: Number(score) || 95,
        issueDate,
        signatoryName: signatoryName.trim(),
        signatoryTitle: signatoryTitle.trim(),
      });

      setIsIssueModalOpen(false);
      loadData();
      await showAlert({
        title: 'Certificate Issued Successfully',
        message: `Official Verified Certificate for ${recipientName} has been permanently issued, hashed, and recorded into the Himnova registry.`,
        type: 'success',
      });
    } catch (err: any) {
      await showAlert({
        title: 'Certificate Issuance Error',
        message: err.message || 'Failed to issue certificate. Please verify required fields.',
        type: 'error',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteCertificate = async (id: string, certNum: string) => {
    const confirmed = await showConfirm({
      title: 'Revoke Certificate',
      message: `Are you sure you want to revoke and permanently delete certificate #${certNum}? This action cannot be undone.`,
      confirmText: 'Yes, Revoke Certificate',
      type: 'danger',
    });
    if (!confirmed) return;
    try {
      await api.deleteCertificate(id);
      loadData();
      await showAlert({
        title: 'Certificate Revoked',
        message: `Certificate #${certNum} has been permanently revoked and removed from the public ledger.`,
        type: 'success',
      });
    } catch (err: any) {
      await showAlert({
        title: 'Revocation Failed',
        message: err.message || 'Failed to revoke certificate',
        type: 'error',
      });
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-mono font-bold uppercase">

                Accreditation Registry
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Issued Credentials Registry & Management
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Issue permanent, tamper-proof credentials signed by Director Sushil Panthi with custom descriptions and live scannable QR verification
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenIssueModal}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-105 transition-all"
            >
              <Plus className="h-4 w-4" />
              <span>Issue New Certificate</span>
            </button>
            <button
              onClick={loadData}
              className="p-2.5 rounded-2xl bg-alpine-900 border border-white/10 text-slate-300 hover:text-white transition-colors"
            >
              <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Certificate Table */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Certificate ID</th>
                  <th className="p-4">Student Name & Email</th>
                  <th className="p-4">Course Specialization</th>
                  <th className="p-4">Grade Score</th>
                  <th className="p-4">Issue Date</th>
                  <th className="p-4">Verification Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {certs.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-10 text-center text-slate-500">
                      No certificates issued yet. Click &quot;Issue New Certificate&quot; above to create one.
                    </td>
                  </tr>
                ) : (
                  certs.map((c) => {
                    const studentName = c.recipientName || c.student?.fullName || 'N/A';
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 font-bold text-amber-300">{c.certificateNumber}</td>
                        <td className="p-4 font-sans">
                          <div className="font-bold text-white text-sm">{studentName}</div>
                          <div className="text-[11px] text-slate-400 font-mono">{c.student?.email}</div>
                        </td>
                        <td className="p-4 text-slate-300 max-w-xs font-sans">
                          <p className="line-clamp-1 font-bold text-white">{c.course?.title}</p>
                          <span className="text-[10px] text-slate-500 font-mono">{c.course?.durationHours || 75} Hours</span>
                        </td>
                        <td className="p-4 font-bold text-emerald-400 text-sm">{c.completionScore || 95}%</td>
                        <td className="p-4 text-slate-400">{formatDate(c.issueDate)}</td>
                        <td className="p-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold flex items-center gap-1 w-fit">
                            <CheckCircle2 className="h-3 w-3" />
                            <span>100% Valid & Authenticated</span>
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => setSelectedCertForView(c)}
                              className="px-2.5 py-1.5 rounded-xl bg-white/5 text-slate-300 hover:text-white border border-white/10 text-xs font-bold flex items-center gap-1"
                              title="Preview A4 Certificate"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              <span>View Certificate</span>
                            </button>
                            <Link href={`/verify/${c.certificateNumber}`} target="_blank">
                              <button
                                className="p-1.5 rounded-xl bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 border border-amber-500/30"
                                title="Public Registry Link"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </button>
                            </Link>
                            <button
                              onClick={() => handleDeleteCertificate(c.id, c.certificateNumber)}
                              className="p-1.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                              title="Revoke Certificate"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* ISSUE NEW CERTIFICATE MODAL (WITH FULL CUSTOM EDITABLE TEXT)              */}
        {/* ========================================================================= */}
        {/* ISSUE NEW CERTIFICATE MODAL WITH LIVE REAL-TIME PREVIEW                   */}
        {/* ========================================================================= */}
        {isIssueModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsIssueModalOpen(false)} />
            <div className="relative w-full max-w-7xl max-h-[94vh] rounded-3xl border border-white/15 bg-alpine-900 shadow-2xl z-10 flex flex-col overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-alpine-950">
                <div className="flex items-center gap-2.5 text-white font-bold">
                  <Award className="h-5 w-5 text-amber-400" />
                  <div>
                    <h3 className="text-base font-bold font-display text-white">Issue Official Verified Certificate</h3>
                    <p className="text-[11px] text-slate-400 font-mono">
                      Real-time side-by-side certificate preview with customized text, seal, and director signature before issuance
                    </p>
                  </div>
                </div>
                <button onClick={() => setIsIssueModalOpen(false)} className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left Column: Form Controls */}
                  <form onSubmit={handleIssueCertificate} className="lg:col-span-5 space-y-4 text-xs">
                    <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] flex items-center gap-2">
                      <Sparkles className="h-4 w-4 shrink-0" />
                      <span>Changes in the form instantly update the live certificate preview on the right!</span>
                    </div>

                    {/* Select Student and Course */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Select Student</label>
                        <select
                          value={studentId}
                          onChange={(e) => handleStudentSelect(e.target.value)}
                          required
                          className="w-full px-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none font-sans text-xs"
                        >
                          <option value="">-- Choose Student --</option>
                          {students.map((s) => (
                            <option key={s.id} value={s.id}>
                              {s.fullName} ({s.email})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Select Course Track</label>
                        <select
                          value={courseId}
                          onChange={(e) => handleCourseSelect(e.target.value)}
                          required
                          className="w-full px-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none font-sans text-xs"
                        >
                          <option value="">-- Choose Track --</option>
                          {courses.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.title}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Recipient Custom Name & Certificate Title */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Recipient Name (On Certificate)</label>
                        <input
                          type="text"
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          required
                          placeholder="e.g. Harish Nepal"
                          className="w-full px-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none font-bold"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Certificate Title Heading</label>
                        <input
                          type="text"
                          value={customTitle}
                          onChange={(e) => setCustomTitle(e.target.value)}
                          required
                          placeholder="e.g. Certificate of Professional Engineering Excellence"
                          className="w-full px-3 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Editable Commendation Paragraph */}
                    <div className="space-y-1">
                      <label className="font-mono font-bold text-slate-300 flex items-center justify-between">
                        <span>Commendation Paragraph (Editable)</span>
                        <span className="text-[10px] text-amber-300/80 font-normal">Live formatted</span>
                      </label>
                      <textarea
                        rows={4}
                        value={customDescription}
                        onChange={(e) => setCustomDescription(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none font-sans text-xs leading-relaxed"
                      />
                    </div>

                    {/* Skills Highlight & Honor Distinction */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Key Skills Badges</label>
                        <input
                          type="text"
                          value={customSkills}
                          onChange={(e) => setCustomSkills(e.target.value)}
                          placeholder="AI Agents, RAG, Next.js"
                          className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Honor / Distinction Badge</label>
                        <input
                          type="text"
                          value={customHonor}
                          onChange={(e) => setCustomHonor(e.target.value)}
                          placeholder="Graduated with Distinction"
                          className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none text-amber-300 font-bold text-[11px]"
                        />
                      </div>
                    </div>

                    {/* Grade Score, Issue Date & Signatory */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Grade (%)</label>
                        <input
                          type="number"
                          step="0.1"
                          value={score}
                          onChange={(e) => setScore(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none text-emerald-400 font-bold font-mono"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Issue Date</label>
                        <input
                          type="date"
                          value={issueDate}
                          onChange={(e) => setIssueDate(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none font-mono text-[11px]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="font-mono font-bold text-slate-300">Signatory</label>
                        <input
                          type="text"
                          value={signatoryName}
                          onChange={(e) => setSignatoryName(e.target.value)}
                          className="w-full px-2.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-amber-400 focus:outline-none text-[11px]"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-bold text-xs shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        <span>{submitting ? 'Issuing Permanent Certificate...' : 'Issue Official Permanent Certificate'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Right Column: Live Side-by-Side Certificate Preview */}
                  <div className="lg:col-span-7 space-y-2">
                    <div className="flex items-center justify-between px-2 text-xs font-mono text-slate-300">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-amber-400" />
                        <span className="font-bold text-white">Live Certificate Final Preview</span>
                      </div>
                      <span className="text-[10px] text-emerald-400 font-bold uppercase">● Real-time sync</span>
                    </div>

                    <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-2 sm:p-3 overflow-x-auto shadow-inner">
                      <OfficialCertificate
                        showActions={false}
                        certificate={{
                          certificateNumber: 'HIM-PREVIEW-2026',
                          recipientName: recipientName || 'Student Full Name',
                          customTitle: customTitle || 'Certificate of Professional Engineering Excellence',
                          customDescription: customDescription,
                          customSkills: customSkills,
                          customHonor: customHonor,
                          completionScore: Number(score) || 96,
                          issueDate: issueDate || new Date(),
                          signatoryName: signatoryName || 'Sushil Panthi',
                          signatoryTitle: signatoryTitle || 'Director & Lead AI Architect, Himnova Technologies Private Limited',
                          course: {
                            title: courses.find((c) => c.id === courseId)?.title || 'AI Career Launchpad',
                            durationHours: 75,
                          },
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* View Certificate Full Preview Modal */}
        {selectedCertForView && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-5xl w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl overflow-y-auto max-h-[95vh]">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Award className="h-5 w-5 text-amber-400" />
                  <span>Credential Preview: {selectedCertForView.certificateNumber}</span>
                </div>
                <button
                  onClick={() => setSelectedCertForView(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <OfficialCertificate certificate={selectedCertForView} />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
