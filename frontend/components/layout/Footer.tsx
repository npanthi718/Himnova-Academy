import React from 'react';
import Link from 'next/link';
import { HimnovaLogo } from '../brand/HimnovaLogo';
import { MapPin, Phone, Mail, Globe, Shield, Terminal, ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-white/10 bg-alpine-950 text-slate-400 text-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Company Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <HimnovaLogo size="lg" />
            <p className="text-slate-400 text-xs sm:text-sm max-w-sm leading-relaxed">
              Himnova Technologies Pvt. Ltd. delivers custom software, cloud DevOps, agentic AI pipelines, and enterprise systems from Kathmandu to the world.
            </p>
            <div className="space-y-2 text-xs text-slate-300 font-mono">
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-brand-cyan" />
                <span>Baneshwor-31, Kathmandu, 44600, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-3.5 w-3.5 text-brand-cyan" />
                <span>+977-9823009467</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-brand-cyan" />
                <span>support.himnovatech@gmail.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-3.5 w-3.5 text-brand-cyan" />
                <a
                  href="https://himnovatech.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-cyan flex items-center gap-1"
                >
                  <span>himnovatech.com</span>
                  <ArrowUpRight className="h-3 w-3" />
                </a>
              </div>
            </div>
          </div>

          {/* Platform Columns */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Launchpad
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses" className="hover:text-brand-cyan transition-colors">
                  All Courses
                </Link>
              </li>
              <li>
                <Link href="/#pathway" className="hover:text-brand-cyan transition-colors">
                  7-Stage Career Pathway
                </Link>
              </li>
              <li>
                <Link href="/verify/HIM-CERT-2026-AI-8942" className="hover:text-brand-cyan transition-colors">
                  Certificate Verification
                </Link>
              </li>
              <li>
                <Link href="/portfolio/AAYUSH-AI" className="hover:text-brand-cyan transition-colors">
                  Student Portfolios
                </Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-brand-cyan transition-colors">
                  Learning Portal Login
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Curriculum Tracks
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/courses/ai-generative-ai-engineering" className="hover:text-brand-cyan transition-colors">
                  AI & Generative AI
                </Link>
              </li>
              <li>
                <Link href="/courses/full-stack-web-engineering-nextjs-go" className="hover:text-brand-cyan transition-colors">
                  Full Stack Next.js & Go
                </Link>
              </li>
              <li>
                <Link href="/courses/cloud-architecture-devops-automation" className="hover:text-brand-cyan transition-colors">
                  AWS & Kubernetes DevOps
                </Link>
              </li>
              <li>
                <Link href="/courses/python-data-engineering-analytics" className="hover:text-brand-cyan transition-colors">
                  Python Data Engineering
                </Link>
              </li>
              <li>
                <Link href="/courses/cybersecurity-ethical-hacking-soc" className="hover:text-brand-cyan transition-colors">
                  Cybersecurity & SOC
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold font-mono uppercase text-white tracking-wider">
              Security & Trust
            </h4>
            <div className="p-3 rounded-xl bg-alpine-900 border border-white/10 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <Shield className="h-4 w-4" />
                <span>Zero-Trust Architecture</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                All certificates are cryptographically verified with QR validation.
              </p>
              <div className="text-[10px] font-mono text-slate-500 pt-1 border-t border-white/5">
                SLA: 99.99% Cloud Uptime
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Himnova Technologies Private Limited. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-slate-300 transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-slate-300 transition-colors">
              Terms of Service
            </Link>
            <span className="font-mono text-brand-cyan">learn.himnovatech.com</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
