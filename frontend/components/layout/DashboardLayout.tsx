'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { HimnovaLogo } from '../brand/HimnovaLogo';
import { api } from '@/lib/api-client';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  UserCheck,
  CalendarCheck,
  FileCheck,
  Award,
  Share2,
  TrendingUp,
  CreditCard,
  Tag,
  ShieldCheck,
  Bell,
  LogOut,
  ChevronRight,
  Menu,
  X,
  Sparkles,
  Video,
  FolderGit2,
  Terminal,
  Activity,
  CheckCircle2,
  User,
  Settings,
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  allowedRoles?: ('SUPER_ADMIN' | 'TRAINER' | 'STUDENT')[];
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, isAuthenticated, isLoading, logout, quickDemoLogin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api.getMyNotifications()
        .then((data) => setNotifications(data || []))
        .catch(() => {});
    }
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="relative h-12 w-12 animate-pulse">
          <div className="absolute inset-0 rounded-full bg-brand-cyan/20 blur-xl"></div>
          <div className="h-12 w-12 rounded-full border-2 border-brand-cyan border-t-transparent animate-spin"></div>
        </div>
        <p className="text-sm font-mono text-slate-400">Authenticating Launchpad session...</p>
      </div>
    );
  }

  if (!user) return null;

  // Verify role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col items-center justify-center text-white p-6 text-center space-y-4">
        <ShieldCheck className="h-16 w-16 text-red-400" />
        <h2 className="text-2xl font-bold font-display">Access Restricted</h2>
        <p className="text-slate-400 max-w-md text-sm">
          Your current account ({user.role}) does not have permission to view this section.
        </p>
        <button
          onClick={() => {
            if (user.role === 'SUPER_ADMIN') router.push('/admin');
            else if (user.role === 'TRAINER') router.push('/trainer');
            else router.push('/student');
          }}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold"
        >
          Return to My Dashboard
        </button>
      </div>
    );
  }

  // Sidebar navigation items based on role
  const getNavItems = () => {
    if (user.role === 'SUPER_ADMIN') {
      return [
        { label: 'Command Center', href: '/admin', icon: LayoutDashboard },
        { label: 'Course Management', href: '/admin/courses', icon: BookOpen },
        { label: 'Course Categories', href: '/admin/categories', icon: Tag },
        { label: 'Cohort Batches', href: '/admin/batches', icon: Users },
        { label: 'Trainers Directory', href: '/admin/trainers', icon: UserCheck },
        { label: 'Students Directory', href: '/admin/students', icon: Users },
        { label: 'Accounts & Expenses', href: '/admin/accounts', icon: CreditCard },
        { label: 'Payments & QR Claims', href: '/admin/payments', icon: FileCheck },
        { label: 'Coupons & Discounts', href: '/admin/coupons', icon: Tag },
        { label: 'Issued Certificates', href: '/admin/certificates', icon: Award },
        { label: 'Global Analytics', href: '/admin/analytics', icon: TrendingUp },
        { label: 'Security Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
        { label: 'Academy Settings', href: '/admin/settings', icon: Settings },
        { label: 'Admin Profile', href: '/admin/profile', icon: User },
      ];
    }

    if (user.role === 'TRAINER') {
      return [
        { label: 'Trainer Hub', href: '/trainer', icon: LayoutDashboard },
        { label: 'Curriculum & Media', href: '/trainer/curriculum', icon: BookOpen },
        { label: 'My Batches', href: '/trainer/batches', icon: Users },
        { label: 'Assignments & Grading', href: '/trainer/submissions', icon: FileCheck },
        { label: 'Live Classes', href: '/trainer/live-classes', icon: Video },
        { label: 'Batch Attendance', href: '/trainer/attendance', icon: CalendarCheck },
        { label: 'Earnings & Payouts', href: '/trainer/earnings', icon: CreditCard },
        { label: 'Trainer Profile', href: '/trainer/profile', icon: User },
      ];
    }

    // Student
    return [
      { label: 'Learning Dashboard', href: '/student', icon: LayoutDashboard },
      { label: 'My Courses', href: '/student/my-courses', icon: BookOpen },
      { label: 'Live Classes', href: '/student/live-classes', icon: Video },
      { label: 'Assignments', href: '/student/assignments', icon: FileCheck },
      { label: '7-Stage Earn Plan', href: '/student/earn-plan', icon: TrendingUp },
      { label: 'My Certificates', href: '/student/certificates', icon: Award },
      { label: 'My Portfolio', href: '/student/portfolio', icon: FolderGit2 },
      { label: 'Attendance Record', href: '/student/attendance', icon: CalendarCheck },
      { label: 'Referrals & Earnings', href: '/student/referrals', icon: Share2 },
      { label: 'Billing & Invoices', href: '/student/billing', icon: CreditCard },
      { label: 'My Profile', href: '/student/profile', icon: User },
    ];
  };

  const navItems = getNavItems();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationRead = async (id: string) => {
    await api.markNotificationRead(id).catch(() => {});
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
  };

  const profileLink = user.role === 'SUPER_ADMIN' ? '/admin/profile' : user.role === 'TRAINER' ? '/trainer/profile' : '/student/profile';

  return (
    <div className="min-h-screen bg-alpine-950 text-slate-100 flex flex-col">
      {/* Noise background */}
      <div className="noise-overlay" />

      <div className="flex flex-1">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:flex flex-col w-64 border-r border-white/10 bg-alpine-900/90 backdrop-blur-xl p-4 shrink-0 justify-between">
          <div className="space-y-6">
            <div className="px-2 pt-2">
              <HimnovaLogo size="sm" />
            </div>

            {/* Role Header Badge */}
            <div className="px-3 py-2 rounded-xl bg-alpine-850/80 border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-brand-cyan animate-pulse"></div>
                <span className="text-[11px] font-mono font-bold text-slate-300">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-brand-cyan border border-brand-cyan/30">
                v2.6
              </span>
            </div>

            {/* Nav links */}
            <nav className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600/30 to-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 shadow-sm shadow-brand-cyan/10'
                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon className={`h-4 w-4 shrink-0 ${isActive ? 'text-brand-cyan' : 'text-slate-400'}`} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Bottom telemetry snippet & user profile */}
          <div className="pt-4 border-t border-white/10 space-y-3">
            <div className="p-2.5 rounded-xl bg-alpine-950/80 border border-slate-800 text-[11px] font-mono text-slate-400 space-y-1">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-slate-500">CLOUD NODE</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <Activity className="h-2.5 w-2.5 animate-pulse" /> 99.99%
                </span>
              </div>
              <p className="text-slate-300 font-semibold truncate text-[10px]">$ himnova-kathmandu-01</p>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-white/5">
              <Link href={profileLink} className="flex items-center gap-2 overflow-hidden hover:opacity-80 transition-opacity">
                <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-600 to-brand-cyan flex items-center justify-center font-bold text-white text-xs shrink-0">
                  {user.fullName.slice(0, 2).toUpperCase()}
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                </div>
              </Link>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-400 hover:text-red-400 transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Topbar */}
          <header className="sticky top-0 z-40 h-16 border-b border-white/10 bg-alpine-950/85 backdrop-blur-xl px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="lg:hidden p-2 rounded-xl border border-white/10 text-slate-300 hover:text-white"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-400">
                <span className="text-slate-600">launchpad</span>
                <ChevronRight className="h-3 w-3 text-slate-600" />
                <span className="text-brand-cyan uppercase font-bold">{user.role}</span>
              </div>
            </div>

            {/* Profile + Notifications in Topbar */}
            <div className="flex items-center gap-3">
              <Link
                href={profileLink}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/10 bg-alpine-900 hover:border-brand-cyan/40 text-xs text-slate-200 transition-colors"
              >
                <div className="h-5 w-5 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center font-bold text-[10px]">
                  {user.fullName.charAt(0)}
                </div>
                <span className="font-semibold hidden sm:inline">{user.fullName}</span>
              </Link>

              {/* Notification Bell */}
              <div className="relative">
                <button
                  onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
                  className="relative p-2.5 rounded-xl border border-white/10 bg-alpine-900 hover:border-brand-cyan/40 text-slate-300 hover:text-white transition-colors"
                >
                  <Bell className="h-4 w-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-cyan animate-ping"></span>
                  )}
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-brand-cyan"></span>
                  )}
                </button>

                {/* Notifications Dropdown */}
                {notifDrawerOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl border border-white/10 bg-alpine-900/95 p-4 shadow-2xl backdrop-blur-2xl z-50">
                    <div className="flex items-center justify-between pb-3 border-b border-white/10">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-brand-cyan" />
                        <h4 className="text-xs font-bold font-mono uppercase text-white">
                          Notifications ({unreadCount})
                        </h4>
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            api.markAllNotificationsRead();
                            setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
                          }}
                          className="text-[10px] text-brand-cyan hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-white/5 mt-2 space-y-1">
                      {notifications.length === 0 ? (
                        <p className="text-xs text-slate-500 py-6 text-center">No notifications yet.</p>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => markNotificationRead(n.id)}
                            className={`p-2.5 rounded-xl text-xs space-y-1 transition-colors cursor-pointer ${
                              n.isRead ? 'opacity-60 hover:opacity-100 hover:bg-white/5' : 'bg-brand-cyan/10 border border-brand-cyan/20'
                            }`}
                          >
                            <p className="font-bold text-white">{n.title}</p>
                            <p className="text-slate-300 text-[11px] leading-relaxed">{n.message}</p>
                            <span className="text-[9px] text-slate-500 font-mono">
                              {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Public Portal Link */}
              <Link href="/">
                <button className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl border border-white/10 bg-alpine-900 hover:border-brand-cyan/40 text-slate-300">
                  <Sparkles className="h-3.5 w-3.5 text-brand-cyan" />
                  <span>Public Site</span>
                </button>
              </Link>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
            {children}
          </main>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="relative flex flex-col w-72 max-w-[80vw] bg-alpine-950 border-r border-white/10 p-5 z-10 justify-between">
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <HimnovaLogo size="sm" />
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10">
              <button
                onClick={() => {
                  logout();
                  setMobileSidebarOpen(false);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs font-bold text-red-400 rounded-lg hover:bg-red-500/10"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
