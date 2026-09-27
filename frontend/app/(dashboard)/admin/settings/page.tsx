'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Settings, 
  ShieldCheck, 
  Building2, 
  Sliders, 
  CreditCard, 
  Bot, 
  Bell, 
  Save, 
  CheckCircle2, 
  UserCheck, 
  Lock, 
  Globe, 
  Mail, 
  Phone, 
  MapPin, 
  Award, 
  Layers, 
  Eye, 
  AlertTriangle,
  RefreshCw,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';

export default function AdminSettingsPage() {
  const [activeTab, setActiveTab] = useState<'GENERAL' | 'PERMISSIONS' | 'COURSES' | 'PAYMENTS' | 'AI_TUTOR' | 'SECURITY'>('GENERAL');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // General Academy Settings
  const [academyName, setAcademyName] = useState('Himnova Academy');
  const [tagline, setTagline] = useState('Official Advanced Multi-Disciplinary LMS & Tech Career Launchpad');
  const [parentCompany, setParentCompany] = useState('Himnova Technologies Private Limited');
  const [regNumber, setRegNumber] = useState('Govt. Regd. 342152/080/081');
  const [supportEmail, setSupportEmail] = useState('support@himnovatech.com');
  const [supportPhone, setSupportPhone] = useState('+977 9823609467');
  const [officeAddress, setOfficeAddress] = useState('Kathmandu, Nepal');
  const [registrationOpen, setRegistrationOpen] = useState(true);
  const [announcementBanner, setAnnouncementBanner] = useState('🚀 Admissions Open: Master AI, Full Stack & Cloud DevOps with Verified QR Certificates!');
  const [showAnnouncement, setShowAnnouncement] = useState(true);

  // Role Permissions Matrix
  const [trainerCanSchedule, setTrainerCanSchedule] = useState(true);
  const [trainerCanIssueCert, setTrainerCanIssueCert] = useState(false);
  const [trainerCanGrade, setTrainerCanGrade] = useState(true);
  const [trainerCanEditCurriculum, setTrainerCanEditCurriculum] = useState(true);
  const [trainerCanViewContacts, setTrainerCanViewContacts] = useState(true);
  
  const [studentMultiEnroll, setStudentMultiEnroll] = useState(true);
  const [studentReferralActive, setStudentReferralActive] = useState(true);
  const [studentConflictCheck, setStudentConflictCheck] = useState(true);
  const [studentPublicPortfolio, setStudentPublicPortfolio] = useState(true);

  // Course Policies
  const [defaultCurrency, setDefaultCurrency] = useState('NPR');
  const [minPassGrade, setMinPassGrade] = useState('80');
  const [defaultDurationHours, setDefaultDurationHours] = useState('75');
  const [allowGuestPreview, setAllowGuestPreview] = useState(true);

  // Payment Gateway Settings
  const [esewaEnabled, setEsewaEnabled] = useState(true);
  const [khaltiEnabled, setKhaltiEnabled] = useState(true);
  const [fonepayQrEnabled, setFonepayQrEnabled] = useState(true);
  const [bankWireEnabled, setBankWireEnabled] = useState(true);
  const [trainerPayoutCommission, setTrainerPayoutCommission] = useState('70'); // 70% to trainer

  // AI Tutor Configuration
  const [aiModel, setAiModel] = useState('Gemini 1.5 Pro (Multimodal)');
  const [aiDailyQuota, setAiDailyQuota] = useState('50');
  const [aiCodeExecution, setAiCodeExecution] = useState(true);
  const [aiTutorPersona, setAiTutorPersona] = useState('Himnova Senior AI Architect & Faculty Mentor');

  // Security Policies
  const [auditLogRetention, setAuditLogRetention] = useState('365');
  const [enforceStrongPassword, setEnforceStrongPassword] = useState(true);
  const [maintenanceMode, setMaintenanceMode] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 600);
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold uppercase">
                System Governance & Access
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Himnova Academy System Settings & Permissions
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Configure multi-course LMS architecture, role permission matrix, payment gateways, and platform policies
            </p>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-brand-cyan to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-98 transition-all w-fit"
          >
            {saving ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            <span>{saving ? 'Saving System Changes...' : 'Save System Settings'}</span>
          </button>
        </div>

        {saveSuccess && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs font-mono flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            <span>Himnova Academy settings and role permissions saved successfully!</span>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar font-mono text-xs">
          <button
            onClick={() => setActiveTab('GENERAL')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'GENERAL'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Building2 className="h-4 w-4" />
            <span>Academy Identity & Contact</span>
          </button>

          <button
            onClick={() => setActiveTab('PERMISSIONS')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'PERMISSIONS'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <UserCheck className="h-4 w-4" />
            <span>Role Permissions Matrix</span>
          </button>

          <button
            onClick={() => setActiveTab('COURSES')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'COURSES'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Layers className="h-4 w-4" />
            <span>Course & Certification Policies</span>
          </button>

          <button
            onClick={() => setActiveTab('PAYMENTS')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'PAYMENTS'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <CreditCard className="h-4 w-4" />
            <span>Payment & Payout Gateways</span>
          </button>

          <button
            onClick={() => setActiveTab('AI_TUTOR')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'AI_TUTOR'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Bot className="h-4 w-4" />
            <span>AI Tutor Engine</span>
          </button>

          <button
            onClick={() => setActiveTab('SECURITY')}
            className={`px-3.5 py-2 rounded-xl transition-all flex items-center gap-2 font-bold whitespace-nowrap ${
              activeTab === 'SECURITY'
                ? 'bg-brand-cyan text-slate-950 shadow-md shadow-brand-cyan/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <ShieldCheck className="h-4 w-4" />
            <span>Security & Maintenance</span>
          </button>
        </div>

        {/* Content Container */}
        <form onSubmit={handleSaveSettings} className="space-y-6">
          {/* TAB 1: GENERAL ACADEMY IDENTITY */}
          {activeTab === 'GENERAL' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-bold">
                  <Building2 className="h-4 w-4" />
                  <span>Academy Platform Profile</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Academy Name</label>
                    <input
                      type="text"
                      value={academyName}
                      onChange={(e) => setAcademyName(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Platform Tagline / Slogan</label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Parent Corporation Name</label>
                    <input
                      type="text"
                      value={parentCompany}
                      onChange={(e) => setParentCompany(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1">Company Registration Number</label>
                    <input
                      type="text"
                      value={regNumber}
                      onChange={(e) => setRegNumber(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-brand-cyan font-mono text-xs font-bold">
                  <Globe className="h-4 w-4" />
                  <span>Contact & Global Notice Banner</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Support Email</label>
                      <input
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">Support Phone</label>
                      <input
                        type="text"
                        value={supportPhone}
                        onChange={(e) => setSupportPhone(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-slate-300 block mb-1 font-bold">Corporate Office Location</label>
                    <input
                      type="text"
                      value={officeAddress}
                      onChange={(e) => setOfficeAddress(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="p-3.5 rounded-2xl bg-alpine-850 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-200 font-bold">Global Academy Announcement Banner</span>
                      <button
                        type="button"
                        onClick={() => setShowAnnouncement(!showAnnouncement)}
                        className={`text-xs font-bold px-2.5 py-1 rounded-lg ${
                          showAnnouncement ? 'bg-emerald-500/20 text-emerald-300' : 'bg-white/10 text-slate-400'
                        }`}
                      >
                        {showAnnouncement ? 'Active' : 'Disabled'}
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={announcementBanner}
                      onChange={(e) => setAnnouncementBanner(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-alpine-900 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ROLE PERMISSIONS MATRIX */}
          {activeTab === 'PERMISSIONS' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Faculty Trainer Permissions */}
              <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-blue-400 font-mono text-xs font-bold">
                  <UserCheck className="h-4 w-4" />
                  <span>Faculty Trainer Role Access & Rights</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Schedule Live Classes & Video Rooms</p>
                      <p className="text-[11px] text-slate-400">Can create Zoom/Google Meet sessions for assigned batches</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trainerCanSchedule}
                      onChange={(e) => setTrainerCanSchedule(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Grade Student Assignments & Code</p>
                      <p className="text-[11px] text-slate-400">Can evaluate submissions, assign scores, and give feedback</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trainerCanGrade}
                      onChange={(e) => setTrainerCanGrade(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Manage Curriculum Slides & Notes</p>
                      <p className="text-[11px] text-slate-400">Can attach slide links, Google Drive resources, and lesson notes</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trainerCanEditCurriculum}
                      onChange={(e) => setTrainerCanEditCurriculum(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Issue Official Certificates Directly</p>
                      <p className="text-[11px] text-slate-400">Allows trainer to issue signed credentials (Super Admin only by default)</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={trainerCanIssueCert}
                      onChange={(e) => setTrainerCanIssueCert(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                </div>
              </div>

              {/* Student Role Permissions */}
              <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
                <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                  <Award className="h-4 w-4" />
                  <span>Student Learner Policies & Features</span>
                </div>

                <div className="space-y-3 text-xs font-mono">
                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Multi-Course Simultaneous Enrollment</p>
                      <p className="text-[11px] text-slate-400">Students can enroll in multiple live or self-paced courses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={studentMultiEnroll}
                      onChange={(e) => setStudentMultiEnroll(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Active Schedule Conflict Warnings</p>
                      <p className="text-[11px] text-slate-400">Alerts admin and student if batch timings overlap in active courses</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={studentConflictCheck}
                      onChange={(e) => setStudentConflictCheck(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Student Referral Program & Rewards</p>
                      <p className="text-[11px] text-slate-400">Students earn cashback / referral bonuses when friends enroll</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={studentReferralActive}
                      onChange={(e) => setStudentReferralActive(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 rounded-2xl bg-alpine-850 border border-white/5">
                    <div>
                      <p className="text-white font-bold">Public Recruiter Showcase Portfolio</p>
                      <p className="text-[11px] text-slate-400">Enable shareable public portfolio at learn.himnovatech.com/portfolio/username</p>
                    </div>
                    <input
                      type="checkbox"
                      checked={studentPublicPortfolio}
                      onChange={(e) => setStudentPublicPortfolio(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: COURSE & CERTIFICATE POLICIES */}
          {activeTab === 'COURSES' && (
            <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-bold">
                <Layers className="h-4 w-4" />
                <span>Academic Standards & Certificate Accreditation Rules</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Default Tuition Currency</label>
                  <select
                    value={defaultCurrency}
                    onChange={(e) => setDefaultCurrency(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="NPR">Nepalese Rupee (NPR - Rs.)</option>
                    <option value="USD">US Dollar (USD - $)</option>
                    <option value="INR">Indian Rupee (INR - ₹)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Minimum Passing Grade for Certificate (%)</label>
                  <input
                    type="number"
                    value={minPassGrade}
                    onChange={(e) => setMinPassGrade(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none text-emerald-400 font-bold font-mono"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Standard Launchpad Duration (Hours)</label>
                  <input
                    type="number"
                    value={defaultDurationHours}
                    onChange={(e) => setDefaultDurationHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: PAYMENTS & PAYOUTS */}
          {activeTab === 'PAYMENTS' && (
            <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
                <CreditCard className="h-4 w-4" />
                <span>Payment Gateways & Revenue Distribution</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
                <div className="p-4 rounded-2xl bg-alpine-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">eSewa Nepal</span>
                    <input
                      type="checkbox"
                      checked={esewaEnabled}
                      onChange={(e) => setEsewaEnabled(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Direct wallet redirect & transaction hash verification</p>
                </div>

                <div className="p-4 rounded-2xl bg-alpine-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Khalti Wallet</span>
                    <input
                      type="checkbox"
                      checked={khaltiEnabled}
                      onChange={(e) => setKhaltiEnabled(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Khalti SDK & dynamic payment initiation</p>
                </div>

                <div className="p-4 rounded-2xl bg-alpine-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Fonepay & QR Claims</span>
                    <input
                      type="checkbox"
                      checked={fonepayQrEnabled}
                      onChange={(e) => setFonepayQrEnabled(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Offline QR slip upload and admin inspection hub</p>
                </div>

                <div className="p-4 rounded-2xl bg-alpine-850 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">Bank Wire Transfer</span>
                    <input
                      type="checkbox"
                      checked={bankWireEnabled}
                      onChange={(e) => setBankWireEnabled(e.target.checked)}
                      className="h-4 w-4 rounded bg-alpine-800 text-brand-cyan"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400">Direct account deposit with manual transaction review</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: AI TUTOR ENGINE */}
          {activeTab === 'AI_TUTOR' && (
            <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                <Bot className="h-4 w-4" />
                <span>Himnova AI Senior Tutor & Career Mentor Intelligence</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">AI Foundation Model</label>
                  <select
                    value={aiModel}
                    onChange={(e) => setAiModel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  >
                    <option value="Gemini 1.5 Pro (Multimodal)">Gemini 1.5 Pro (Multimodal & Fast RAG)</option>
                    <option value="Claude 3.5 Sonnet">Claude 3.5 Sonnet (Advanced Reasoning & Coding)</option>
                    <option value="GPT-4o">GPT-4o (Omni Architecture)</option>
                  </select>
                </div>

                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Daily Prompt Limit Per Student</label>
                  <input
                    type="number"
                    value={aiDailyQuota}
                    onChange={(e) => setAiDailyQuota(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SECURITY & MAINTENANCE */}
          {activeTab === 'SECURITY' && (
            <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
              <div className="flex items-center gap-2 text-red-400 font-mono text-xs font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>Enterprise Security & Audit Policies</span>
              </div>

              <div className="space-y-3 text-xs font-mono">
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-alpine-850 border border-white/5">
                  <div>
                    <p className="text-white font-bold">Platform Maintenance Mode</p>
                    <p className="text-[11px] text-slate-400">Locks student portal for scheduled core database maintenance</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setMaintenanceMode(!maintenanceMode)}
                    className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                      maintenanceMode ? 'bg-red-500 text-white' : 'bg-white/10 text-slate-300'
                    }`}
                  >
                    {maintenanceMode ? 'Maintenance Active' : 'Normal Operation'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Bottom Save Bar */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono text-slate-400">
              Himnova Technologies Pvt. Ltd. • Academy Version 2.8 Enterprise
            </span>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-brand-cyan via-sky-500 to-blue-600 text-slate-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-98 transition-all flex items-center gap-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Applying System Configuration...' : 'Save All Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
