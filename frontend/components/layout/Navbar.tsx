'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { HimnovaLogo } from '../brand/HimnovaLogo';
import {
  LayoutDashboard,
  LogOut,
  User,
  GraduationCap,
  Sparkles,
  Award,
  Briefcase,
  Menu,
  X,
  ChevronDown,
  Terminal,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, logout, quickDemoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [demoDropdownOpen, setDemoDropdownOpen] = useState(false);

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'SUPER_ADMIN') return '/admin';
    if (user.role === 'TRAINER') return '/trainer';
    return '/student';
  };

  const getRoleBadge = (role: string) => {
    if (role === 'SUPER_ADMIN') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-red-500/20 text-red-400 border border-red-500/40">
          SUPER ADMIN
        </span>
      );
    }
    if (role === 'TRAINER') {
      return (
        <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/40">
          TRAINER
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
        STUDENT
      </span>
    );
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav transition-all duration-300 py-3.5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Logo */}
          <HimnovaLogo size="md" />

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 rounded-full border border-white/10 bg-alpine-900/60 px-4 py-1.5 backdrop-blur-md shadow-inner">
            <Link
              href="/"
              className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors rounded-full text-brand-cyan hover:text-white"
            >
              Overview
            </Link>
            <Link
              href="/courses"
              className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors rounded-full text-slate-300 hover:text-brand-cyan"
            >
              Courses
            </Link>
            <Link
              href="/#pathway"
              className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors rounded-full text-slate-300 hover:text-brand-cyan"
            >
              Career Pathway
            </Link>
            <Link
              href="/verify/HIM-CERT-2026-AI-8942"
              className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors rounded-full text-slate-300 hover:text-brand-cyan"
            >
              Verify Certificate
            </Link>
            <Link
              href="/portfolio/AAYUSH-AI"
              className="px-3.5 py-1 text-xs font-bold tracking-wider uppercase transition-colors rounded-full text-slate-300 hover:text-brand-cyan"
            >
              Recruiter Showcase
            </Link>
          </nav>

          {/* Right Action buttons */}
          <div className="hidden sm:flex items-center gap-3">

            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link href={getDashboardLink()}>
                  <button className="flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-95 transition-all">
                    <LayoutDashboard className="h-3.5 w-3.5" />
                    <span>Open Dashboard</span>
                  </button>
                </Link>
                <div className="flex items-center gap-2 pl-2 border-l border-white/10">
                  <div className="flex flex-col text-right">
                    <span className="text-xs font-bold text-white leading-tight">{user.fullName}</span>
                    {getRoleBadge(user.role)}
                  </div>
                  <button
                    onClick={logout}
                    className="p-2 rounded-xl bg-white/5 hover:bg-red-500/20 hover:text-red-400 text-slate-400 border border-white/5 transition-all"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <button className="px-4 py-2 text-xs font-semibold rounded-xl border border-white/10 bg-alpine-850 hover:bg-alpine-800 text-slate-200 transition-all">
                    Login
                  </button>
                </Link>
                <Link href="/courses">
                  <button className="relative overflow-hidden inline-flex items-center justify-center font-semibold rounded-xl px-4 py-2 text-xs gap-1.5 bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-lg shadow-brand-cyan/25 hover:brightness-110 active:scale-95 transition-all">
                    <span className="pointer-events-none absolute inset-0 btn-shine" aria-hidden="true"></span>
                    <Sparkles className="h-3.5 w-3.5" />
                    <span>Explore Courses</span>
                  </button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-xl border border-white/10 p-2 text-slate-200 hover:text-white focus:outline-none"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden mt-3 pt-3 border-t border-white/10 space-y-2 pb-2">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-200 hover:bg-white/5"
            >
              Overview
            </Link>
            <Link
              href="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-200 hover:bg-white/5"
            >
              Courses Catalog
            </Link>
            <Link
              href="/verify/HIM-CERT-2026-AI-8942"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-200 hover:bg-white/5"
            >
              Verify Certificate
            </Link>
            <Link
              href="/portfolio/AAYUSH-AI"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 text-sm font-semibold rounded-lg text-slate-200 hover:bg-white/5"
            >
              Recruiter Showcase
            </Link>

            {isAuthenticated ? (
              <div className="pt-2 border-t border-white/10 space-y-2">
                <Link
                  href={getDashboardLink()}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-3 py-2 text-sm font-semibold rounded-lg bg-brand-cyan/20 text-brand-cyan"
                >
                  Go to Dashboard ({user?.role})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
                <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 text-center text-sm font-semibold rounded-xl border border-white/10 bg-alpine-850 text-white">
                    Login
                  </button>
                </Link>
                <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                  <button className="w-full py-2.5 text-center text-sm font-semibold rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white">
                    Register Free
                  </button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
