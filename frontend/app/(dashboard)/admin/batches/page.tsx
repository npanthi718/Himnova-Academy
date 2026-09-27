'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { Users, Plus, Calendar, UserCheck, X, Clock, Video, Trash2, Edit2, Sparkles } from 'lucide-react';

export default function AdminBatchesPage() {
  const [batches, setBatches] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [trainers, setTrainers] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    courseId: '',
    trainerId: '',
    startDate: '2026-04-01',
    endDate: '2026-07-30',
    maxStudents: 30,
    status: 'ENROLLING',
    scheduleDays: 'Sunday - Friday',
    classTiming: '07:00 AM - 08:30 AM NPT',
    totalHours: 75,
    meetingUrl: 'https://zoom.us/j/himnova-live-batch',
  });

  const loadData = () => {
    api.getBatches().then(setBatches).catch(console.error);
    api.getCourses().then(setCourses).catch(console.error);
    api.getUsers({ role: 'TRAINER' }).then(setTrainers).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreate = () => {
    setEditingBatchId(null);
    setFormData({
      name: '',
      code: '',
      courseId: courses[0]?.id || '',
      trainerId: trainers[0]?.id || '',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
      maxStudents: 30,
      status: 'ENROLLING',
      scheduleDays: 'Sunday - Friday',
      classTiming: '07:00 AM - 08:30 AM NPT',
      totalHours: 75,
      meetingUrl: 'https://zoom.us/j/himnova-live-batch',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBatchId(b.id);
    setFormData({
      name: b.name,
      code: b.code,
      courseId: b.courseId || b.course?.id || '',
      trainerId: b.trainerId || b.trainer?.id || '',
      startDate: b.startDate ? b.startDate.split('T')[0] : '2026-04-01',
      endDate: b.endDate ? b.endDate.split('T')[0] : '2026-07-30',
      maxStudents: b.maxStudents || 30,
      status: b.status || 'ENROLLING',
      scheduleDays: b.scheduleDays || 'Sunday - Friday',
      classTiming: b.classTiming || '07:00 AM - 08:30 AM NPT',
      totalHours: b.totalHours || 75,
      meetingUrl: b.meetingUrl || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently delete this cohort batch? Associated student memberships will be unlinked.')) return;
    try {
      await api.deleteBatch(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete batch');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBatchId) {
        await api.updateBatch(editingBatchId, formData);
      } else {
        await api.createBatch(formData);
      }
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to save batch');
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Cohort Batches & Live Scheduling</h1>
            <p className="text-xs text-slate-400">Manage cohort batches, live class timings, days schedule, hours and assigned trainers</p>
          </div>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-brand-cyan/20"
          >
            <Plus className="h-4 w-4" />
            <span>Create Cohort Batch</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {batches.map((b) => (
            <div key={b.id} className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded-lg bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-[10px] font-mono font-bold uppercase">
                    {b.code}
                  </span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                    b.status === 'ACTIVE' 
                      ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                      : b.status === 'COMPLETED'
                      ? 'bg-blue-500/15 text-blue-400 border border-blue-500/30'
                      : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                  }`}>
                    ● {b.status || 'ENROLLING'}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold font-display text-white">{b.name}</h3>
                  <p className="text-xs text-brand-cyan/80 mt-0.5">{b.course?.title}</p>
                </div>

                <div className="space-y-2 text-xs font-mono text-slate-300 pt-2 border-t border-white/5">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Instructor:</span>
                    <span className="text-white font-bold">{b.trainer?.fullName || 'Not Assigned'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Class Schedule:</span>
                    <span className="text-amber-300 font-bold">{b.scheduleDays || 'Sunday - Friday'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Class Timing:</span>
                    <span className="text-brand-cyan font-bold">{b.classTiming || '07:00 AM - 08:30 AM'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Total Hours:</span>
                    <span className="text-slate-200">{b.totalHours ? `${b.totalHours} Hours` : '75 Hours'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Duration:</span>
                    <span>{formatDate(b.startDate)} - {formatDate(b.endDate)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Students:</span>
                    <span className="text-emerald-400 font-bold">{b._count?.students || 0} / {b.maxStudents} Enrolled</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/5 flex items-center justify-end gap-2">
                <button
                  onClick={() => handleOpenEdit(b)}
                  className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-brand-cyan/20 text-slate-300 hover:text-brand-cyan border border-white/10 hover:border-brand-cyan/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                  <span>Edit Batch</span>
                </button>
                <button
                  onClick={() => handleDelete(b.id)}
                  className="p-1.5 rounded-xl bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/10 hover:border-red-500/30 transition-all"
                  title="Delete Batch"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Create / Edit Batch Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-lg rounded-3xl border border-white/15 bg-alpine-900/95 p-6 shadow-2xl z-10 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold font-display text-white">
                  {editingBatchId ? 'Edit Cohort Batch & Schedule' : 'Create Cohort Batch & Schedule'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSave} className="space-y-3.5 text-xs font-mono">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Batch Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      placeholder="e.g. AI-02 (Morning Cohort)"
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Batch Code *</label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      required
                      placeholder="e.g. HIM-AI-02-2026"
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Course Track *</label>
                    <select
                      value={formData.courseId}
                      onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans"
                    >
                      <option value="">-- Select Course --</option>
                      {courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Assign Lead Trainer</label>
                    <select
                      value={formData.trainerId}
                      onChange={(e) => setFormData({ ...formData, trainerId: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans"
                    >
                      <option value="">-- Select Trainer --</option>
                      {trainers.map((t) => (
                        <option key={t.id} value={t.id}>{t.fullName} ({t.email})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Live Class Schedule Details */}
                <div className="p-3.5 rounded-2xl bg-alpine-950/70 border border-white/10 space-y-3">
                  <div className="text-[11px] font-bold text-brand-cyan flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5" />
                    <span>Live Class Timing &amp; Working Days</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Schedule Days (Live)</label>
                      <input
                        type="text"
                        value={formData.scheduleDays}
                        onChange={(e) => setFormData({ ...formData, scheduleDays: e.target.value })}
                        placeholder="e.g. Sunday - Friday"
                        className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Class Timing (Hour/Slot)</label>
                      <input
                        type="text"
                        value={formData.classTiming}
                        onChange={(e) => setFormData({ ...formData, classTiming: e.target.value })}
                        placeholder="e.g. 07:00 AM - 08:30 AM"
                        className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1">Total Hours (Optional)</label>
                      <input
                        type="number"
                        value={formData.totalHours}
                        onChange={(e) => setFormData({ ...formData, totalHours: Number(e.target.value) })}
                        placeholder="75"
                        className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1">Batch Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      >
                        <option value="ENROLLING">ENROLLING (Admissions Open)</option>
                        <option value="ACTIVE">ACTIVE (Classes Running)</option>
                        <option value="COMPLETED">COMPLETED (Archived)</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Dedicated Live Meeting Link (Zoom / Meet)</label>
                    <input
                      type="url"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Start Date</label>
                    <input
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">End Date</label>
                    <input
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-bold text-slate-300">Max Capacity</label>
                    <input
                      type="number"
                      value={formData.maxStudents}
                      onChange={(e) => setFormData({ ...formData, maxStudents: Number(e.target.value) })}
                      className="w-full px-3 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white font-bold text-xs shadow-md shadow-brand-cyan/20"
                >
                  {editingBatchId ? 'Save Cohort Batch Changes' : 'Create Cohort Batch'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
