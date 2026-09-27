'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate, formatDateTime, formatCurrency } from '@/lib/utils';
import { 
  Users, 
  Search, 
  CheckCircle2, 
  XCircle, 
  ShieldCheck, 
  ExternalLink,
  Plus,
  X,
  BookOpen,
  UserPlus,
  History,
  Edit3,
  KeyRound,
  ArrowRightLeft,
  Trash2,
  Calendar,
  Check,
  Award,
  CreditCard,
  Clock,
  Layers,
  FileCheck
} from 'lucide-react';
import Link from 'next/link';

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedStudentForHistory, setSelectedStudentForHistory] = useState<any | null>(null);
  const [studentHistoryData, setStudentHistoryData] = useState<any | null>(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const [studentForEdit, setStudentForEdit] = useState<any | null>(null);
  const [studentForShift, setStudentForShift] = useState<any | null>(null);
  const [studentForResetPass, setStudentForResetPass] = useState<any | null>(null);

  // Forms
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('Student@123');
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedBatchId, setSelectedBatchId] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Shift Course Form
  const [targetCourseId, setTargetCourseId] = useState('');
  const [targetBatchId, setTargetBatchId] = useState('');
  const [replaceOldEnrollment, setReplaceOldEnrollment] = useState(false);
  const [shiftReason, setShiftReason] = useState('');
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);

  // Password Reset Form
  const [newAdminPassword, setNewAdminPassword] = useState('Student@2026!');

  const loadStudents = (searchTerm?: string) => {
    setLoading(true);
    api.getUsers({ role: 'STUDENT', search: searchTerm })
      .then(setStudents)
      .finally(() => setLoading(false));
  };

  const loadMeta = () => {
    api.getCourses().then(setCourses).catch(console.error);
    api.getBatches().then(setBatches).catch(console.error);
  };

  useEffect(() => {
    loadStudents();
    loadMeta();
  }, []);

  const openHistoryModal = async (student: any) => {
    setSelectedStudentForHistory(student);
    setHistoryLoading(true);
    try {
      const history = await api.getUserHistory(student.id);
      setStudentHistoryData(history);
    } catch (err: any) {
      alert(err.message || 'Failed to load student history');
    } finally {
      setHistoryLoading(false);
    }
  };

  const openEditModal = (student: any) => {
    setStudentForEdit(student);
    setFullName(student.fullName);
    setEmail(student.email);
    setPhoneNumber(student.phoneNumber || '');
  };

  const openShiftModal = (student: any) => {
    setStudentForShift(student);
    setTargetCourseId(courses[0]?.id || '');
    setTargetBatchId('');
    setReplaceOldEnrollment(false);
    setShiftReason('Batch rescheduling upon student request');
    setConflictWarning(null);
  };

  const checkBatchConflict = async (batchId: string) => {
    setTargetBatchId(batchId);
    if (!studentForShift?.id || !batchId) {
      setConflictWarning(null);
      return;
    }
    try {
      const res = await api.checkScheduleConflict(studentForShift.id, batchId);
      if (res && res.hasConflict) {
        setConflictWarning(res.message || '⚠️ Schedule timing conflict detected with student’s existing active class!');
      } else {
        setConflictWarning(null);
      }
    } catch (err) {
      setConflictWarning(null);
    }
  };

  const openResetPassModal = (student: any) => {
    setStudentForResetPass(student);
    setNewAdminPassword('HimnovaStudent@2026');
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      await api.updateUserStatus(id, !currentStatus);
      loadStudents(search);
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleCreateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email) return;
    setSubmitting(true);
    try {
      await api.createUser({
        fullName,
        email,
        phoneNumber,
        password,
        role: 'STUDENT',
        courseId: selectedCourseId || undefined,
        batchId: selectedBatchId || undefined,
      });

      setIsCreateModalOpen(false);
      setFullName('');
      setEmail('');
      setPhoneNumber('');
      setSelectedCourseId('');
      setSelectedBatchId('');
      loadStudents();
      alert('Student created and admitted successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to create student');
    } finally {
      setSubmitting(false);
    }
  };

  const handleAdminUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForEdit) return;
    setSubmitting(true);
    try {
      await api.adminUpdateUser(studentForEdit.id, {
        fullName,
        email,
        phoneNumber,
      });
      setStudentForEdit(null);
      loadStudents(search);
      alert('Student profile updated successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to update student profile');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShiftCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForShift || !targetCourseId) return;
    setSubmitting(true);
    try {
      const oldCourse = studentForShift.enrollments?.[0]?.courseId;
      await api.shiftStudentCourseBatch(studentForShift.id, {
        targetCourseId,
        targetBatchId: targetBatchId || undefined,
        oldCourseId: oldCourse,
        replaceOldEnrollment,
        reason: shiftReason,
      });
      setStudentForShift(null);
      loadStudents(search);
      alert('Student course/batch shift completed successfully!');
    } catch (err: any) {
      alert(err.message || 'Failed to shift course');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentForResetPass || !newAdminPassword) return;
    setSubmitting(true);
    try {
      await api.adminResetPassword(studentForResetPass.id, newAdminPassword);
      setStudentForResetPass(null);
      alert(`Password successfully changed to "${newAdminPassword}" for ${studentForResetPass.fullName}`);
    } catch (err: any) {
      alert(err.message || 'Failed to reset password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteUser = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to completely delete student "${name}" and all associated enrollment/submission data?`)) return;
    try {
      await api.deleteUser(id);
      loadStudents(search);
      alert('Student account removed from system.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete user');
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Students Master Directory & Omni-Control</h1>
            <p className="text-xs text-slate-400">Complete control over student accounts: inspect histories, shift courses/batches, reset passwords, edit profiles</p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all w-fit"
          >
            <UserPlus className="h-4 w-4" />
            <span>Direct Student Admission</span>
          </button>
        </div>

        {/* Search Bar */}
        <div className="flex gap-2 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                loadStudents(e.target.value);
              }}
              placeholder="Search by student name, email, phone..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-alpine-900 border border-white/10 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-brand-cyan"
            />
          </div>
        </div>

        {/* Students Table */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Student Name & Contact</th>
                  <th className="p-4">Enrolled Course(s)</th>
                  <th className="p-4">Assigned Cohort</th>
                  <th className="p-4">Submissions</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Joined Date</th>
                  <th className="p-4 text-right">Omni-Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      Loading student records from database...
                    </td>
                  </tr>
                ) : students.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No students found matching query.
                    </td>
                  </tr>
                ) : (
                  students.map((st) => (
                    <tr key={st.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4">
                        <div className="font-sans font-semibold text-white text-sm">{st.fullName}</div>
                        <div className="text-[11px] text-slate-400">{st.email}</div>
                        {st.phoneNumber && (
                          <div className="text-[10px] text-brand-cyan">{st.phoneNumber}</div>
                        )}
                      </td>
                      <td className="p-4">
                        {st.enrollments?.length > 0 ? (
                          st.enrollments.map((e: any) => (
                            <span key={e.id} className="block font-sans text-xs text-slate-200">
                              {e.course?.title}
                            </span>
                          ))
                        ) : (
                          <span className="text-slate-500 text-[11px]">No active enrollment</span>
                        )}
                      </td>
                      <td className="p-4">
                        {st.enrollments?.[0]?.batch?.name || (
                          <span className="text-slate-500 text-[11px]">Unassigned</span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-[10px] font-bold">
                          {st._count?.submissions || 0} Submissions
                        </span>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => toggleStatus(st.id, st.isActive)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                            st.isActive
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-red-500/15 text-red-400 border border-red-500/30'
                          }`}
                        >
                          {st.isActive ? <CheckCircle2 className="h-3 w-3" /> : <XCircle className="h-3 w-3" />}
                          <span>{st.isActive ? 'Active' : 'Suspended'}</span>
                        </button>
                      </td>
                      <td className="p-4 text-slate-500">{formatDate(st.createdAt)}</td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* 1. Full History */}
                          <button
                            onClick={() => openHistoryModal(st)}
                            className="p-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/30 hover:bg-blue-500/25 transition-colors"
                            title="Inspect Complete Student History"
                          >
                            <History className="h-3.5 w-3.5" />
                          </button>

                          {/* 2. Edit Profile */}
                          <button
                            onClick={() => openEditModal(st)}
                            className="p-1.5 rounded-lg bg-white/5 text-slate-300 border border-white/10 hover:bg-white/10 transition-colors"
                            title="Edit Student Profile Details"
                          >
                            <Edit3 className="h-3.5 w-3.5" />
                          </button>

                          {/* 3. Shift Course/Batch */}
                          <button
                            onClick={() => openShiftModal(st)}
                            className="p-1.5 rounded-lg bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 transition-colors"
                            title="Shift Student Course or Batch Cohort"
                          >
                            <ArrowRightLeft className="h-3.5 w-3.5" />
                          </button>

                          {/* 4. Reset Password */}
                          <button
                            onClick={() => openResetPassModal(st)}
                            className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400 border border-amber-500/30 hover:bg-amber-500/25 transition-colors"
                            title="Set/Reset Password"
                          >
                            <KeyRound className="h-3.5 w-3.5" />
                          </button>

                          {/* 5. Delete Account */}
                          <button
                            onClick={() => handleDeleteUser(st.id, st.fullName)}
                            className="p-1.5 rounded-lg bg-red-500/15 text-red-400 border border-red-500/30 hover:bg-red-500/25 transition-colors"
                            title="Delete Student Account"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MODAL 1: FULL STUDENT HISTORY */}
        {selectedStudentForHistory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
            <div className="relative max-w-4xl w-full my-6 bg-alpine-900 border border-white/15 rounded-3xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
                    <History className="h-5 w-5 text-brand-cyan" />
                    <span>Comprehensive Student History: {selectedStudentForHistory.fullName}</span>
                  </h3>
                  <p className="text-xs text-slate-400 font-mono">{selectedStudentForHistory.email}</p>
                </div>
                <button
                  onClick={() => setSelectedStudentForHistory(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {historyLoading || !studentHistoryData ? (
                <div className="py-16 text-center text-slate-400 font-mono text-xs">
                  Loading complete audit trail and submission logs...
                </div>
              ) : (
                <div className="space-y-6 text-xs font-mono">
                  {/* Course Enrollments */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-brand-cyan flex items-center gap-1.5">
                      <BookOpen className="h-4 w-4" />
                      <span>Course Enrollments & Progress</span>
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {studentHistoryData.enrollments?.map((e: any) => (
                        <div key={e.id} className="p-3.5 rounded-xl bg-alpine-900 border border-white/5 space-y-1.5">
                          <div className="font-bold text-white text-sm font-sans">{e.course?.title}</div>
                          <div className="text-[11px] text-slate-400">Cohort: {e.batch?.name || 'Self-Paced / Open'}</div>
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">Progress:</span>
                            <span className="text-emerald-400 font-bold">{e.progressPercentage}% ({e.completedLessonsCount}/{e.totalLessonsCount} lessons)</span>
                          </div>
                          <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden">
                            <div className="bg-brand-cyan h-full" style={{ width: `${e.progressPercentage}%` }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Submissions & Marks */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-blue-400 flex items-center gap-1.5">
                      <FileCheck className="h-4 w-4" />
                      <span>Assignment Submissions & Marks ({studentHistoryData.submissions?.length || 0})</span>
                    </h4>
                    <div className="space-y-2">
                      {studentHistoryData.submissions?.length === 0 ? (
                        <p className="text-slate-500">No assignment submissions recorded.</p>
                      ) : (
                        studentHistoryData.submissions?.map((sub: any) => (
                          <div key={sub.id} className="p-3 rounded-xl bg-alpine-900 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div>
                              <p className="font-bold text-white font-sans">{sub.assignment?.title}</p>
                              <p className="text-[11px] text-slate-400">Attempt #{sub.attemptNumber} • Submitted {formatDateTime(sub.submittedAt)}</p>
                              {sub.trainerFeedback && (
                                <p className="text-[11px] text-slate-300 mt-1 italic">&quot;{sub.trainerFeedback}&quot;</p>
                              )}
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-emerald-400 font-bold text-sm">{sub.score !== null ? `${sub.score}/100` : 'Pending Review'}</span>
                              <span className="block text-[10px] text-slate-500">{sub.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Payment Invoices */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                      <CreditCard className="h-4 w-4" />
                      <span>Payment Transactions & Receipts</span>
                    </h4>
                    <div className="space-y-2">
                      {studentHistoryData.payments?.length === 0 ? (
                        <p className="text-slate-500">No payment transactions found.</p>
                      ) : (
                        studentHistoryData.payments?.map((p: any) => (
                          <div key={p.id} className="p-3 rounded-xl bg-alpine-900 border border-white/5 flex items-center justify-between">
                            <div>
                              <span className="font-bold text-brand-cyan">{p.orderId}</span>
                              <span className="text-slate-400 block text-[11px]">{p.course?.title} ({p.provider})</span>
                            </div>
                            <div className="text-right">
                              <span className="font-bold text-white text-sm">{formatCurrency(p.amount)}</span>
                              <span className="block text-[10px] text-emerald-400">{p.status}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  {/* Audit Logs */}
                  <div className="p-5 rounded-2xl bg-alpine-950/80 border border-white/10 space-y-3">
                    <h4 className="text-xs font-bold uppercase text-slate-400 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-brand-cyan" />
                      <span>Account Security Audit Log (Last 50 Actions)</span>
                    </h4>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {studentHistoryData.auditLogs?.map((log: any) => (
                        <div key={log.id} className="p-2 rounded-lg bg-white/5 text-[11px] flex justify-between text-slate-300">
                          <span>{log.action} on {log.resourceType}</span>
                          <span className="text-slate-500">{formatDateTime(log.timestamp)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: DIRECT ADMISSION / CREATE */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Direct Student Admission & Enrollment</h3>
                <button onClick={() => setIsCreateModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleCreateStudent} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Student Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Subash Adhikari"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="student@example.com"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-slate-300 block mb-1">Phone Number</label>
                    <input
                      type="text"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="98XXXXXXXX"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Course Track Admission</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- No Direct Course (General Student) --</option>
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Assign to Cohort Batch</label>
                  <select
                    value={selectedBatchId}
                    onChange={(e) => setSelectedBatchId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- Auto-assign or None --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Admitting...' : 'Admit Student'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: SHIFT COURSE / BATCH */}
        {studentForShift && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-lg w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Shift Course or Batch</h3>
                  <p className="text-xs text-slate-400 font-mono">{studentForShift.fullName}</p>
                </div>
                <button onClick={() => setStudentForShift(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleShiftCourseSubmit} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Target Course *</label>
                  <select
                    required
                    value={targetCourseId}
                    onChange={(e) => setTargetCourseId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    {courses.map((c) => (
                      <option key={c.id} value={c.id}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Target Batch</label>
                  <select
                    value={targetBatchId}
                    onChange={(e) => checkBatchConflict(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- Auto-select Default Active Batch --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>
                        {b.name} ({b.code}) - {b.classTiming || 'No set time'}
                      </option>
                    ))}
                  </select>
                </div>

                {conflictWarning && (
                  <div className="p-3 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-300 text-xs font-mono space-y-1">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span>⚠️ Schedule Timing Warning</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-amber-200/90">{conflictWarning}</p>
                    <p className="text-[10px] text-slate-400">
                      If the previous course is finished or you check "Replace & remove previous course enrollment", the conflict will be resolved.
                    </p>
                  </div>
                )}

                <div className="p-3 rounded-xl bg-alpine-950 border border-white/10 flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="replaceOld"
                    checked={replaceOldEnrollment}
                    onChange={(e) => setReplaceOldEnrollment(e.target.checked)}
                    className="h-4 w-4 rounded bg-alpine-800 border-white/20 text-brand-cyan"
                  />
                  <label htmlFor="replaceOld" className="text-slate-300 text-xs cursor-pointer">
                    Replace & remove previous course enrollment (Shift/Transfer)
                  </label>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Shift Reason (Audit Logged) *</label>
                  <input
                    type="text"
                    required
                    value={shiftReason}
                    onChange={(e) => setShiftReason(e.target.value)}
                    placeholder="e.g. Schedule conflict / track upgrade"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentForShift(null)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Migrating...' : 'Complete Shift'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 4: EDIT PROFILE */}
        {studentForEdit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">Edit Student Profile</h3>
                <button onClick={() => setStudentForEdit(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAdminUpdateStudent} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentForEdit(null)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 5: DIRECT PASSWORD RESET */}
        {studentForResetPass && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Reset Student Password</h3>
                  <p className="text-xs text-slate-400 font-mono">{studentForResetPass.fullName} ({studentForResetPass.email})</p>
                </div>
                <button onClick={() => setStudentForResetPass(null)} className="p-1.5 text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleResetPasswordSubmit} className="space-y-3.5 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">New Password *</label>
                  <input
                    type="text"
                    required
                    value={newAdminPassword}
                    onChange={(e) => setNewAdminPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setStudentForResetPass(null)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-amber-500 text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Resetting...' : 'Set Password'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
