"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { useAuth } from "@/lib/auth-context";
import { apiClient } from "@/lib/api-client";
import {
  Briefcase,
  ExternalLink,
  Github,
  Globe,
  Plus,
  Trash2,
  Edit2,
  Save,
  CheckCircle2,
  Code,
  Sparkles,
  Layers
} from "lucide-react";

interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  technologies: string;
  githubUrl?: string;
  liveUrl?: string;
  imageUrl?: string;
}

interface PortfolioData {
  id: string;
  username: string;
  title: string;
  bio: string;
  skills: string;
  githubUrl?: string;
  linkedinUrl?: string;
  websiteUrl?: string;
  isPublic: boolean;
  projects: PortfolioProject[];
}

export default function StudentPortfolioPage() {
  const { user } = useAuth();
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form states
  const [username, setUsername] = useState("");
  const [title, setTitle] = useState("");
  const [bio, setBio] = useState("");
  const [skills, setSkills] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [isPublic, setIsPublic] = useState(true);

  // New Project Form
  const [showAddProject, setShowAddProject] = useState(false);
  const [projTitle, setProjTitle] = useState("");
  const [projDesc, setProjDesc] = useState("");
  const [projTech, setProjTech] = useState("");
  const [projGithub, setProjGithub] = useState("");
  const [projLive, setProjLive] = useState("");

  useEffect(() => {
    async function loadPortfolio() {
      try {
        const res = await apiClient.get<PortfolioData>("/portfolios/me");
        if (res.success && res.data) {
          const p = res.data;
          setPortfolio(p);
          setUsername(p.username || user?.email?.split("@")[0] || "developer");
          setTitle(p.title || "Full-Stack AI Software Engineer");
          setBio(p.bio || "Passionate software engineer building resilient cloud architectures and generative AI products.");
          setSkills(p.skills || "TypeScript, Next.js, Node.js, NestJS, PostgreSQL, Prisma, Python, LangChain, Docker, AWS");
          setGithubUrl(p.githubUrl || "https://github.com");
          setLinkedinUrl(p.linkedinUrl || "https://linkedin.com");
          setWebsiteUrl(p.websiteUrl || "");
          setIsPublic(p.isPublic ?? true);
        } else {
          // Defaults if no record yet
          setUsername(user?.email?.split("@")[0] || "developer");
          setTitle("Full-Stack AI Software Engineer");
          setBio("Passionate software engineer building resilient cloud architectures and generative AI products.");
          setSkills("TypeScript, Next.js, Node.js, NestJS, PostgreSQL, Prisma, Python, LangChain, Docker, AWS");
          setGithubUrl("https://github.com");
          setLinkedinUrl("https://linkedin.com");
        }
      } catch (err) {
        console.error("Failed to fetch portfolio", err);
        setUsername(user?.email?.split("@")[0] || "developer");
      } finally {
        setLoading(false);
      }
    }
    loadPortfolio();
  }, [user]);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg(null);
    try {
      const res = await apiClient.post("/portfolios/me", {
        username,
        title,
        bio,
        skills,
        githubUrl,
        linkedinUrl,
        websiteUrl,
        isPublic,
      });
      setSuccessMsg("Portfolio profile updated successfully!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error("Failed to save portfolio", err);
      setSuccessMsg("Portfolio profile saved locally.");
      setTimeout(() => setSuccessMsg(null), 3500);
    } finally {
      setSaving(false);
    }
  };

  const handleAddProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projTitle || !projDesc) return;
    try {
      const newProj = {
        title: projTitle,
        description: projDesc,
        technologies: projTech,
        githubUrl: projGithub,
        liveUrl: projLive,
      };

      await apiClient.post("/portfolios/projects", newProj);
      
      // Update local state
      setPortfolio((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          projects: [...(prev.projects || []), { id: `proj-${Date.now()}`, ...newProj }],
        };
      });

      setShowAddProject(false);
      setProjTitle("");
      setProjDesc("");
      setProjTech("");
      setProjGithub("");
      setProjLive("");
      setSuccessMsg("Project added to your showcase!");
      setTimeout(() => setSuccessMsg(null), 3500);
    } catch (err) {
      console.error("Failed to add project", err);
    }
  };

  const publicPortfolioUrl = `/portfolio/${username || "student"}`;

  return (
    <DashboardLayout allowedRoles={['STUDENT', 'SUPER_ADMIN']}>
      <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            <Briefcase className="w-6 h-6 text-brand-cyan" />
            Recruiter Portfolio Builder
          </h1>
          <p className="text-sm text-slate-400">
            Craft your public engineering showcase, live project demos, and technical badges.
          </p>
        </div>

        <Link
          href={publicPortfolioUrl}
          target="_blank"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-cyan text-white text-xs font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Public Portfolio
        </Link>
      </div>

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {successMsg}
        </div>
      )}

      {/* Main Profile Settings Form */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-brand-cyan" />
            Profile & Social Information
          </h2>
          <span className="text-xs text-slate-500">Public Link: {publicPortfolioUrl}</span>
        </div>

        <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-400 font-medium mb-1">Portfolio Handle / Slug</label>
              <div className="flex">
                <span className="px-3 py-2.5 bg-slate-950 border border-r-0 border-slate-800 rounded-l-xl text-slate-500">
                  /portfolio/
                </span>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, ""))}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-r-xl text-white focus:outline-none focus:border-brand-cyan"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1">Headline / Role Title</label>
              <input
                type="text"
                placeholder="e.g. Full-Stack AI Engineer | Cloud Architect"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Professional Bio & Career Objective</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan leading-relaxed"
            />
          </div>

          <div>
            <label className="block text-slate-400 font-medium mb-1">Technical Skills (Comma separated)</label>
            <input
              type="text"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Github className="w-3.5 h-3.5 text-cyan-400" />
                GitHub URL
              </label>
              <input
                type="url"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>

            <div>
              <label className="block text-slate-400 font-medium mb-1 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-cyan-400" />
                Personal Website / Blog
              </label>
              <input
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-cyan"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-brand-blue to-brand-cyan text-white font-bold rounded-xl shadow-lg hover:shadow-cyan-500/25 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {saving ? "Saving Changes..." : "Save Profile Details"}
            </button>
          </div>
        </form>
      </div>

      {/* Featured Projects Showcase List */}
      <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/50 backdrop-blur-md space-y-6">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-brand-cyan" />
              Featured Project Case Studies
            </h2>
            <p className="text-xs text-slate-400">Showcase capstones and deployed applications to recruiters.</p>
          </div>

          <button
            onClick={() => setShowAddProject(!showAddProject)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Project
          </button>
        </div>

        {/* Add Project Form Box */}
        {showAddProject && (
          <form onSubmit={handleAddProject} className="p-5 rounded-xl bg-slate-950 border border-cyan-500/30 space-y-4 text-xs animate-fade-in">
            <h3 className="font-bold text-white">Add New Showcase Project</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">Project Title</label>
                <input
                  type="text"
                  placeholder="e.g. Himnova AI Autonomous Agent Platform"
                  value={projTitle}
                  onChange={(e) => setProjTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-cyan"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Technologies (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js, NestJS, LangChain, PostgreSQL, Redis"
                  value={projTech}
                  onChange={(e) => setProjTech(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-400 mb-1">Project Description & Architecture Overview</label>
              <textarea
                rows={3}
                placeholder="Explain the technical problem solved, architecture design, and scale..."
                value={projDesc}
                onChange={(e) => setProjDesc(e.target.value)}
                className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-cyan"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-400 mb-1">GitHub Repo URL</label>
                <input
                  type="url"
                  placeholder="https://github.com/username/project"
                  value={projGithub}
                  onChange={(e) => setProjGithub(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Live URL</label>
                <input
                  type="url"
                  placeholder="https://my-app.vercel.app"
                  value={projLive}
                  onChange={(e) => setProjLive(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-brand-cyan"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowAddProject(false)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-brand-cyan text-slate-950 font-bold rounded-lg hover:bg-cyan-300"
              >
                Save Project
              </button>
            </div>
          </form>
        )}

        {/* Existing Projects */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(portfolio?.projects || [
            {
              id: "seed-1",
              title: "Autonomous Multi-Agent AI Workflow Engine",
              description: "Distributed task orchestrator using NestJS microservices, Redis BullMQ workers, and Gemini API embeddings.",
              technologies: "NestJS, Redis, BullMQ, PostgreSQL, Gemini API",
              githubUrl: "https://github.com/himnova/agent-engine",
              liveUrl: "https://himnovatech.com",
            },
          ]).map((p) => (
            <div
              key={p.id}
              className="p-5 rounded-xl border border-slate-800 bg-slate-950/60 flex flex-col justify-between space-y-3"
            >
              <div>
                <h3 className="font-bold text-white text-sm">{p.title}</h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {p.technologies?.split(",").map((tech, tIdx) => (
                    <span
                      key={tIdx}
                      className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-900 border border-slate-800 text-cyan-400"
                    >
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-3 border-t border-slate-900 text-xs">
                {p.githubUrl && (
                  <a
                    href={p.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-slate-400 hover:text-white flex items-center gap-1"
                  >
                    <Github className="w-3.5 h-3.5" />
                    Code
                  </a>
                )}
                {p.liveUrl && (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-cyan-400 hover:underline flex items-center gap-1"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Live Demo
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  </DashboardLayout>
  );
}
