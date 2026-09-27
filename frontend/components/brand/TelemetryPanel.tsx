import React from 'react';
import { Terminal, Activity, CheckCircle2, Shield, Cloud, Cpu, Sparkles } from 'lucide-react';

export const TelemetryPanel: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`relative rounded-2xl border border-white/10 bg-alpine-900/90 p-5 shadow-2xl shadow-brand-cyan/10 backdrop-blur-xl overflow-hidden group hover:border-brand-cyan/40 transition-all duration-500 ${className}`}>
      <div className="pointer-events-none absolute -top-20 -right-16 h-40 w-40 rounded-full bg-brand-cyan/20 blur-3xl opacity-60 group-hover:opacity-100 transition-opacity"></div>
      
      {/* Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/80"></div>
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-500/80"></div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <Terminal className="h-3.5 w-3.5 text-brand-cyan" />
          <span>himnova-launchpad-telemetry</span>
        </div>
      </div>

      {/* Terminal CLI */}
      <div className="py-3 px-3 rounded-xl bg-alpine-950 text-slate-100 font-mono text-xs space-y-1.5 border border-slate-800/80 my-3 shadow-inner">
        <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1.5">
          <span>LIVE CLOUD TELEMETRY</span>
          <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
            <Activity className="h-3 w-3 animate-pulse" /> 14ms LATENCY
          </span>
        </div>
        <p className="text-slate-300 font-semibold truncate pt-1">
          $ himnova-ai verify --node prod-kathmandu --rag qdrant
        </p>
        <div className="font-bold text-emerald-400 flex items-center gap-2 pt-0.5">
          <CheckCircle2 className="h-3.5 w-3.5" />
          <span>✔ AI PIPELINE ACTIVE (99.99% SLA)</span>
        </div>
      </div>

      {/* Metrics list */}
      <div className="space-y-2.5 font-mono text-xs">
        <div className="flex items-center justify-between p-2.5 rounded-xl bg-alpine-850/80 border border-white/5">
          <div className="flex items-center gap-2.5">
            <Cloud className="h-4 w-4 text-brand-cyan" />
            <div>
              <p className="font-semibold text-white">Kubernetes Autoscaler</p>
              <p className="text-[10px] text-slate-400">Kathmandu & Mumbai Nodes</p>
            </div>
          </div>
          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">
            ONLINE
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-alpine-850/80 border border-white/5">
          <div className="flex items-center gap-2.5">
            <Cpu className="h-4 w-4 text-purple-400" />
            <div>
              <p className="font-semibold text-white">LangGraph Agent Engine</p>
              <p className="text-[10px] text-slate-400">Vector Search (pgvector)</p>
            </div>
          </div>
          <span className="text-brand-cyan font-semibold px-2 py-0.5 rounded bg-brand-cyan/10 border border-brand-cyan/30 text-[10px]">
            98.4% ACC
          </span>
        </div>

        <div className="flex items-center justify-between p-2.5 rounded-xl bg-alpine-850/80 border border-white/5">
          <div className="flex items-center gap-2.5">
            <Shield className="h-4 w-4 text-cyan-400" />
            <div>
              <p className="font-semibold text-white">Zero-Trust RBAC Audit</p>
              <p className="text-[10px] text-slate-400">Cryptographic QR Verification</p>
            </div>
          </div>
          <span className="text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/30 text-[10px]">
            ENFORCED
          </span>
        </div>
      </div>

      <div className="mt-3 p-2.5 rounded-xl bg-gradient-to-r from-brand-cyan/15 to-brand-teal/10 border border-brand-cyan/30 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-200">Global Software Export Hub</span>
        <span className="text-[10px] font-bold text-brand-cyan tracking-wider uppercase">Kathmandu, Nepal</span>
      </div>
    </div>
  );
};
