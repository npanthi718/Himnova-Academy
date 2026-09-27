'use client';

import React, { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { 
  Users, 
  Calendar, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  Save,
  CheckCheck,
  ShieldCheck,
  BookOpen,
  ChevronDown,
  UserCheck,
  Check,
  X
} from 'lucide-react';

export default function TrainerAttendancePage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [selectedBatchId, setSelectedBatchId] = useState<string>('');
  const [selectedBatchData, setSelectedBatchData] = useState<any | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState<Record<string, { status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; notes: string }>>({});
  const [loading, setLoading] = useState(true);
  const [batchLoading, setBatchLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    async function loadInitialBatches() {
      try {
        const data = await api.getBatches();
        setBatches(data || []);
        if (data && data.length > 0) {
          setSelectedBatchId(data[0].id);
        }
      } catch (err) {
        console.error('Failed to load batches', err);
      } finally {
        setLoading(false);
      }
    }
    loadInitialBatches();
  }, []);

  useEffect(() => {
    if (selectedBatchId) {
      setBatchLoading(true);
      api.getBatch(selectedBatchId)
        .then((fullBatch) => {
          setSelectedBatchData(fullBatch);
          const initial: Record<string, { status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'; notes: string }> = {};
          fullBatch.students?.forEach((s: any) => {
            const studentId = s.student?.id || s.studentId || s.id;
            initial[studentId] = { status: 'PRESENT', notes: '' };
          });
          setRecords(initial);
        })
        .catch(console.error)
        .finally(() => setBatchLoading(false));
    }
  }, [selectedBatchId]);

  const handleStatusChange = (studentId: string, status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        status,
      },
    }));
  };

  const handleNoteChange = (studentId: string, notes: string) => {
    setRecords((prev) => ({
      ...prev,
      [studentId]: {
        ...prev[studentId],
        notes,
      },
    }));
  };

  const markAll = (status: 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED') => {
    if (!selectedBatchData) return;
    const updated = { ...records };
    selectedBatchData.students?.forEach((s: any) => {
      const studentId = s.student?.id || s.studentId || s.id;
      updated[studentId] = {
        ...updated[studentId],
        status,
      };
    });
    setRecords(updated);
  };

  const handleSaveAttendance = async () => {
    if (!selectedBatchId || !selectedBatchData) return;
    setSaving(true);
    setSavedSuccess(false);
    try {
      const attendanceList = Object.entries(records).map(([studentId, data]) => ({
        studentId,
        status: data.status,
        notes: data.notes,
      }));

      await api.markBatchAttendance(selectedBatchId, {
        date: selectedDate,
        records: attendanceList,
      });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      alert(err.message || 'Failed to save attendance record');
    } finally {
      setSaving(false);
    }
  };

  const studentsList = selectedBatchData?.students || [];
  const totalStudents = studentsList.length;
  const presentCount = Object.values(records).filter((r) => r.status === 'PRESENT').length;
  const absentCount = Object.values(records).filter((r) => r.status === 'ABSENT').length;
  const lateCount = Object.values(records).filter((r) => r.status === 'LATE').length;

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold uppercase">
                Attendance Management
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Batch Attendance Register
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Log, track, and verify daily student attendance, lab presence, and live session participation
            </p>
          </div>

          <button
            onClick={handleSaveAttendance}
            disabled={saving || totalStudents === 0}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all ${
              savedSuccess
                ? 'bg-emerald-600 text-white shadow-emerald-500/30'
                : 'bg-gradient-to-r from-emerald-600 to-teal-500 hover:opacity-95 text-white shadow-emerald-500/20 disabled:opacity-50'
            }`}
          >
            {savedSuccess ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving...' : savedSuccess ? 'Attendance Saved! ✓' : 'Save Daily Attendance'}</span>
          </button>
        </div>

        {/* Selection Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-5 rounded-3xl bg-alpine-900 border border-white/10 shadow-xl">
          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-300">Select Cohort Batch</label>
            <select
              value={selectedBatchId}
              onChange={(e) => setSelectedBatchId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none text-xs font-mono"
            >
              {batches.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.code} - {b.name} ({b.course?.title})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-mono font-bold text-slate-300">Session Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none text-xs font-mono"
            />
          </div>

          <div className="space-y-1 flex flex-col justify-end">
            <label className="text-xs font-mono font-bold text-slate-300">Quick Actions</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => markAll('PRESENT')}
                className="flex-1 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/30 text-xs font-bold transition-all"
              >
                Mark All Present
              </button>
              <button
                onClick={() => markAll('ABSENT')}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30 text-xs font-bold transition-all"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        {/* Attendance Summary KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-alpine-900 border border-white/10 space-y-1">
            <span className="text-[10px] font-mono uppercase text-slate-400">Total Enrolled</span>
            <div className="text-2xl font-extrabold font-display text-white">{totalStudents}</div>
            <p className="text-[10px] text-slate-500 font-mono">In selected cohort</p>
          </div>
          <div className="p-4 rounded-2xl bg-alpine-900 border border-emerald-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-emerald-400">Present</span>
            <div className="text-2xl font-extrabold font-display text-emerald-400">{presentCount}</div>
            <p className="text-[10px] text-slate-500 font-mono">Attended session</p>
          </div>
          <div className="p-4 rounded-2xl bg-alpine-900 border border-red-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-red-400">Absent</span>
            <div className="text-2xl font-extrabold font-display text-red-400">{absentCount}</div>
            <p className="text-[10px] text-slate-500 font-mono">Did not attend</p>
          </div>
          <div className="p-4 rounded-2xl bg-alpine-900 border border-amber-500/20 space-y-1">
            <span className="text-[10px] font-mono uppercase text-amber-400">Late / Excused</span>
            <div className="text-2xl font-extrabold font-display text-amber-400">{lateCount}</div>
            <p className="text-[10px] text-slate-500 font-mono">Recorded with reason</p>
          </div>
        </div>

        {/* Student Attendance Roster Table */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-alpine-950/60">
            <h3 className="text-xs font-mono font-bold text-white uppercase flex items-center gap-2">
              <Users className="h-4 w-4 text-emerald-400" />
              <span>Student Roster ({selectedBatchData?.name || 'Cohort'})</span>
            </h3>
            <span className="text-[11px] font-mono text-slate-400">
              {totalStudents} registered learners on roster
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">#</th>
                  <th className="p-4">Student Candidate</th>
                  <th className="p-4">Email / Phone</th>
                  <th className="p-4 text-center">Attendance Status</th>
                  <th className="p-4">Session Notes / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {batchLoading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-400">
                      <div className="h-6 w-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                      Loading cohort roster...
                    </td>
                  </tr>
                ) : totalStudents === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-slate-500 space-y-2">
                      <Users className="h-10 w-10 text-slate-600 mx-auto" />
                      <p className="text-sm font-bold text-white">No students enrolled in this batch yet.</p>
                      <p className="text-xs text-slate-400 max-w-md mx-auto">
                        Students enrolled through online checkout or assigned by the Super Admin will automatically appear in this roster.
                      </p>
                    </td>
                  </tr>
                ) : (
                  studentsList.map((st: any, idx: number) => {
                    const studentObj = st.student || st;
                    const studentId = studentObj.id;
                    const currentRec = records[studentId] || { status: 'PRESENT', notes: '' };

                    return (
                      <tr key={studentId} className="hover:bg-white/5 transition-colors">
                        <td className="p-4 text-slate-500">{idx + 1}</td>
                        <td className="p-4 font-sans font-bold text-white flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 font-bold shrink-0">
                            {studentObj.fullName?.charAt(0) || 'S'}
                          </div>
                          <div>
                            <p className="text-sm text-white">{studentObj.fullName}</p>
                            <span className="text-[10px] text-slate-500 font-mono">ID: {studentId.slice(0, 8)}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <div>{studentObj.email}</div>
                          {studentObj.phoneNumber && (
                            <div className="text-[10px] text-brand-cyan">{studentObj.phoneNumber}</div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleStatusChange(studentId, 'PRESENT')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                currentRec.status === 'PRESENT'
                                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              Present
                            </button>
                            <button
                              onClick={() => handleStatusChange(studentId, 'ABSENT')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                currentRec.status === 'ABSENT'
                                  ? 'bg-red-500 text-white shadow-md shadow-red-500/20'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              Absent
                            </button>
                            <button
                              onClick={() => handleStatusChange(studentId, 'LATE')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                currentRec.status === 'LATE'
                                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              Late
                            </button>
                            <button
                              onClick={() => handleStatusChange(studentId, 'EXCUSED')}
                              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                currentRec.status === 'EXCUSED'
                                  ? 'bg-purple-500 text-white shadow-md shadow-purple-500/20'
                                  : 'bg-white/5 text-slate-400 hover:text-white'
                              }`}
                            >
                              Excused
                            </button>
                          </div>
                        </td>
                        <td className="p-4">
                          <input
                            type="text"
                            value={currentRec.notes}
                            onChange={(e) => handleNoteChange(studentId, e.target.value)}
                            placeholder="Optional remark (e.g. Completed lab 4)"
                            className="w-full px-3 py-1.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none text-xs"
                          />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
