'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import { Video, Plus, ExternalLink, Calendar, X } from 'lucide-react';

export default function TrainerLiveClassesPage() {
  const [classes, setClasses] = useState<any[]>([]);
  const [batches, setBatches] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    batchId: '',
    title: '',
    description: '',
    provider: 'ZOOM',
    meetingUrl: '',
    meetingId: '',
    meetingPassword: '',
    startTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    endTime: new Date(Date.now() + 26 * 60 * 60 * 1000).toISOString().slice(0, 16),
  });

  const loadData = () => {
    api.getMyLiveClasses().then(setClasses).catch(console.error);
    api.getBatches().then(setBatches).catch(console.error);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.scheduleLiveClass({
        ...formData,
        startTime: new Date(formData.startTime).toISOString(),
        endTime: new Date(formData.endTime).toISOString(),
      });
      setIsModalOpen(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to schedule class');
    }
  };

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Live Classes & Workshops</h1>
            <p className="text-xs text-slate-400">Schedule and launch real-time video lectures via Zoom or Google Meet</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-brand-cyan/20"
          >
            <Plus className="h-4 w-4" />
            <span>Schedule Live Class</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map((c) => (
            <div key={c.id} className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-brand-cyan border border-brand-cyan/30 text-[10px] font-mono font-bold uppercase">
                  {c.provider} LIVE
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {c.isCompleted ? 'COMPLETED' : 'UPCOMING'}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold font-display text-white">{c.title}</h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">{c.description || 'Hands-on live session.'}</p>
              </div>

              <div className="space-y-1.5 text-xs font-mono text-slate-300 pt-3 border-t border-white/5">
                <p className="text-slate-400">Starts: <strong className="text-white">{formatDateTime(c.startTime)}</strong></p>
                <p className="text-slate-400">Batch: <span className="text-brand-cyan">{c.batch?.name}</span></p>
                {c.meetingId && <p className="text-slate-500 text-[11px]">Meeting ID: {c.meetingId}</p>}
              </div>

              <a href={c.meetingUrl} target="_blank" rel="noopener noreferrer">
                <button className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-brand-cyan/20 hover:brightness-110">
                  <Video className="h-4 w-4" />
                  <span>Launch Trainer Meeting Room</span>
                  <ExternalLink className="h-3 w-3" />
                </button>
              </a>
            </div>
          ))}
        </div>

        {/* Schedule Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-alpine-900/95 p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold font-display text-white">Schedule Live Workshop</h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSchedule} className="space-y-3 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Target Cohort Batch</label>
                  <select
                    value={formData.batchId}
                    onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
                    required
                    className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="">-- Select Batch --</option>
                    {batches.map((b) => (
                      <option key={b.id} value={b.id}>{b.name} ({b.code})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Class Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                    placeholder="e.g. Fine-Tuning Open Weight Models on AWS"
                    className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Provider</label>
                    <select
                      value={formData.provider}
                      onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="ZOOM">ZOOM</option>
                      <option value="GOOGLE_MEET">GOOGLE MEET</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Meeting Link</label>
                    <input
                      type="url"
                      value={formData.meetingUrl}
                      onChange={(e) => setFormData({ ...formData, meetingUrl: e.target.value })}
                      required
                      placeholder="https://zoom.us/j/..."
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Start Time</label>
                    <input
                      type="datetime-local"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">End Time</label>
                    <input
                      type="datetime-local"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                      required
                      className="w-full px-3.5 py-2 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white font-bold text-xs shadow-md shadow-brand-cyan/20"
                >
                  Schedule Live Class
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
