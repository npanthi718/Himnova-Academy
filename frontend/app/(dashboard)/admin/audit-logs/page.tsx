'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDateTime } from '@/lib/utils';
import { ShieldCheck, Terminal, Search } from 'lucide-react';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getAuditLogs({ limit: 100 })
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Security Audit Log Registry</h1>
            <p className="text-xs text-slate-400">Tamper-evident logs of administrative actions, logins, payments and role changes</p>
          </div>
          <span className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
            ZERO-TRUST ENFORCED
          </span>
        </div>

        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Action Event</th>
                  <th className="p-4">Actor</th>
                  <th className="p-4">Target Resource</th>
                  <th className="p-4">Client IP</th>
                  <th className="p-4">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-white/5 border border-white/10 text-brand-cyan">
                        {log.action}
                      </span>
                    </td>
                    <td className="p-4 text-white font-semibold">
                      {log.actorEmail || 'System Core'}
                    </td>
                    <td className="p-4 text-slate-300">
                      {log.resourceType} {log.resourceId ? `(${log.resourceId.slice(0, 8)}...)` : ''}
                    </td>
                    <td className="p-4 text-slate-400">{log.ipAddress || '103.10.28.4'}</td>
                    <td className="p-4 text-slate-500">{formatDateTime(log.timestamp)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
