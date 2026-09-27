'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Layers,
  Video,
  FileText,
  Presentation,
  Paperclip,
  Save,
  X,
  ChevronDown,
  ChevronRight,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

export default function TrainerCurriculumPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Curriculum Management Drawer/Modal
  const [curriculumCourse, setCurriculumCourse] = useState<any | null>(null);
  const [isCurriculumOpen, setIsCurriculumOpen] = useState(false);
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Module modal
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [moduleForm, setModuleForm] = useState({ id: '', title: '', description: '', orderIndex: 0 });

  // Lesson modal
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [lessonForm, setLessonForm] = useState({
    id: '',
    moduleId: '',
    title: '',
    description: '',
    type: 'VIDEO',
    durationMinutes: 20,
    contentMarkdown: '',
    videoUrl: '',
    slideUrl: '',
    pdfUrl: '',
    externalUrl: '',
    isFreePreview: false,
  });

  // Resource modal
  const [isResourceModalOpen, setIsResourceModalOpen] = useState(false);
  const [selectedLessonForResource, setSelectedLessonForResource] = useState<string | null>(null);
  const [resourceForm, setResourceForm] = useState({
    title: '',
    fileUrl: '',
    fileType: 'PDF',
    fileSizeMb: 2.5,
  });

  const loadCourses = async () => {
    setLoading(true);
    try {
      const data = await api.getCourses();
      setCourses(data || []);
    } catch (err) {
      console.error('Failed to load courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCourses();
  }, []);

  const openCurriculumManager = async (course: any) => {
    try {
      const fullCourse = await api.getCourseBySlug(course.slug);
      setCurriculumCourse(fullCourse);
      const exp: Record<string, boolean> = {};
      fullCourse.modules?.forEach((m: any) => {
        exp[m.id] = true;
      });
      setExpandedModules(exp);
      setIsCurriculumOpen(true);
    } catch (err: any) {
      alert(err.message || 'Failed to load course curriculum');
    }
  };

  const refreshCurriculum = async () => {
    if (!curriculumCourse) return;
    try {
      const fullCourse = await api.getCourseBySlug(curriculumCourse.slug);
      setCurriculumCourse(fullCourse);
      loadCourses();
    } catch (err) {
      console.error(err);
    }
  };

  // MODULE HANDLERS
  const handleSaveModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!curriculumCourse) return;
    try {
      if (moduleForm.id) {
        await api.updateModule(moduleForm.id, moduleForm);
      } else {
        await api.createModule(curriculumCourse.id, moduleForm);
      }
      setIsModuleModalOpen(false);
      refreshCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to save module');
    }
  };

  // LESSON HANDLERS
  const handleOpenNewLesson = (moduleId: string) => {
    setLessonForm({
      id: '',
      moduleId,
      title: '',
      description: '',
      type: 'VIDEO',
      durationMinutes: 25,
      contentMarkdown: '',
      videoUrl: '',
      slideUrl: '',
      pdfUrl: '',
      externalUrl: '',
      isFreePreview: false,
    });
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (les: any, moduleId: string) => {
    setLessonForm({
      id: les.id,
      moduleId,
      title: les.title || '',
      description: les.description || '',
      type: les.type || 'VIDEO',
      durationMinutes: les.durationMinutes || 20,
      contentMarkdown: les.contentMarkdown || '',
      videoUrl: les.videoUrl || '',
      slideUrl: les.slideUrl || '',
      pdfUrl: les.pdfUrl || '',
      externalUrl: les.externalUrl || '',
      isFreePreview: Boolean(les.isFreePreview),
    });
    setIsLessonModalOpen(true);
  };

  const handleSaveLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (lessonForm.id) {
        await api.updateLesson(lessonForm.id, lessonForm);
      } else {
        await api.createLesson(lessonForm);
      }
      setIsLessonModalOpen(false);
      refreshCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to save lesson');
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (confirm('Delete this lesson from syllabus?')) {
      try {
        await api.deleteLesson(lessonId);
        refreshCurriculum();
      } catch (err: any) {
        alert(err.message || 'Failed to delete lesson');
      }
    }
  };

  // RESOURCE HANDLERS
  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLessonForResource) return;
    try {
      await api.addLessonResource(selectedLessonForResource, resourceForm);
      setIsResourceModalOpen(false);
      refreshCurriculum();
    } catch (err: any) {
      alert(err.message || 'Failed to attach resource');
    }
  };

  const handleDeleteResource = async (resourceId: string) => {
    if (confirm('Delete this resource attachment?')) {
      try {
        await api.deleteLessonResource(resourceId);
        refreshCurriculum();
      } catch (err: any) {
        alert(err.message || 'Failed to delete resource');
      }
    }
  };

  return (
    <DashboardLayout allowedRoles={['TRAINER', 'SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="px-3 py-1 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 text-xs font-mono font-bold uppercase">
              Instructor Studio
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
              Curriculum, Notes & Media Hub
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Attach Zoom Cloud video recordings, Google Drive slides, homework assignments, and markdown notes for your students
            </p>
          </div>
        </div>

        {/* Courses Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((c) => {
            const moduleCount = c.modules?.length || 0;
            let lessonCount = 0;
            c.modules?.forEach((m: any) => {
              lessonCount += m.lessons?.length || 0;
            });

            return (
              <div
                key={c.id}
                className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4 shadow-xl flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="h-36 w-full rounded-2xl bg-slate-800 overflow-hidden relative">
                    <img src={c.thumbnailUrl} alt={c.title} className="h-full w-full object-cover" />
                    <span className="absolute top-2 right-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-brand-cyan text-[10px] font-mono font-bold">
                      {c.difficulty}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold font-display text-white line-clamp-1">{c.title}</h3>
                    <p className="text-xs text-slate-400 line-clamp-2 mt-1">{c.description}</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3 border-t border-white/5 text-xs font-mono">
                  <div className="flex justify-between text-slate-400">
                    <span>Curriculum Structure:</span>
                    <span className="text-white font-bold">{moduleCount} Modules • {lessonCount} Lessons</span>
                  </div>

                  <button
                    onClick={() => openCurriculumManager(c)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-cyan text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg shadow-purple-500/20 hover:opacity-95 transition-all"
                  >
                    <Layers className="h-4 w-4" />
                    <span>Manage Lessons, Notes & Zoom Links</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================================= */}
        {/* CURRICULUM MANAGEMENT MODAL / DRAWER                                     */}
        {/* ========================================================================= */}
        {isCurriculumOpen && curriculumCourse && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsCurriculumOpen(false)} />
            <div className="relative w-full max-w-5xl max-h-[92vh] rounded-3xl border border-white/15 bg-alpine-900 shadow-2xl z-10 flex flex-col overflow-hidden">
              {/* Drawer Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-alpine-950/80">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-purple-500/15 text-purple-400 flex items-center justify-center border border-purple-500/30">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <span>Instructional Materials:</span>
                      <span className="text-purple-400">{curriculumCourse.title}</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Upload lesson notes, attach Google Drive slides, Zoom Cloud video recording links & assignments
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setModuleForm({ id: '', title: '', description: '', orderIndex: (curriculumCourse.modules?.length || 0) + 1 });
                      setIsModuleModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-purple-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-purple-600/20 hover:bg-purple-500 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add Module</span>
                  </button>
                  <button onClick={() => setIsCurriculumOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body - Module & Lessons Accordion */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {curriculumCourse.modules?.map((mod: any, mIdx: number) => {
                  const isExp = expandedModules[mod.id] ?? true;
                  return (
                    <div key={mod.id} className="rounded-2xl border border-white/10 bg-alpine-950/60 overflow-hidden">
                      {/* Module Header */}
                      <div className="p-4 bg-alpine-950 flex items-center justify-between border-b border-white/10">
                        <button
                          onClick={() => setExpandedModules({ ...expandedModules, [mod.id]: !isExp })}
                          className="flex items-center gap-3 text-left"
                        >
                          {isExp ? (
                            <ChevronDown className="h-4 w-4 text-purple-400" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-slate-400" />
                          )}
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-0.5 rounded bg-purple-500/15 text-purple-400 border border-purple-500/30 text-[10px] font-mono font-bold">
                                MODULE {mIdx + 1}
                              </span>
                              <h3 className="text-sm font-bold text-white font-display">{mod.title}</h3>
                            </div>
                            {mod.description && (
                              <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                            )}
                          </div>
                        </button>

                        <button
                          onClick={() => handleOpenNewLesson(mod.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-purple-500/20 hover:text-purple-300 text-slate-300 text-xs font-bold flex items-center gap-1 border border-white/10"
                        >
                          <Plus className="h-3 w-3" />
                          <span>Add Lesson</span>
                        </button>
                      </div>

                      {/* Lessons List under Module */}
                      {isExp && (
                        <div className="p-4 space-y-3">
                          {(!mod.lessons || mod.lessons.length === 0) ? (
                            <p className="text-xs text-slate-500 font-mono italic">
                              No lessons added yet. Click &quot;Add Lesson&quot; to provide video recording link, slides or notes.
                            </p>
                          ) : (
                            mod.lessons.map((les: any, lIdx: number) => (
                              <div
                                key={les.id}
                                className="p-4 rounded-xl bg-alpine-900 border border-white/5 space-y-2.5"
                              >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                  <div className="flex items-center gap-2.5">
                                    <span className="text-xs font-mono font-bold text-purple-400">
                                      {mIdx + 1}.{lIdx + 1}
                                    </span>
                                    <h4 className="text-xs font-bold text-white font-sans">{les.title}</h4>
                                    <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-purple-300 uppercase">
                                      {les.type}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-mono">
                                      {les.durationMinutes} mins
                                    </span>
                                  </div>

                                  <div className="flex items-center gap-1.5">
                                    <button
                                      onClick={() => {
                                        setSelectedLessonForResource(les.id);
                                        setResourceForm({ title: '', fileUrl: '', fileType: 'PDF', fileSizeMb: 2.5 });
                                        setIsResourceModalOpen(true);
                                      }}
                                      className="px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-slate-300 text-[11px] font-bold flex items-center gap-1 border border-white/10"
                                    >
                                      <Paperclip className="h-3 w-3 text-brand-cyan" />
                                      <span>Attach File</span>
                                    </button>
                                    <button
                                      onClick={() => handleOpenEditLesson(les, mod.id)}
                                      className="p-1.5 rounded-lg bg-white/5 text-purple-400 hover:bg-purple-500/20"
                                      title="Edit Lesson & Media Links"
                                    >
                                      <Edit2 className="h-3 w-3" />
                                    </button>
                                    <button
                                      onClick={() => handleDeleteLesson(les.id)}
                                      className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                      title="Delete Lesson"
                                    >
                                      <Trash2 className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>

                                {/* Attached links summary badge row */}
                                <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-white/5 text-[10px] font-mono">
                                  {les.videoUrl ? (
                                    <a
                                      href={les.videoUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center gap-1 hover:underline"
                                    >
                                      <Video className="h-3 w-3" />
                                      <span>Video Recording (Zoom / Drive)</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-600 flex items-center gap-1">
                                      <Video className="h-3 w-3" /> No Video Link
                                    </span>
                                  )}

                                  {les.slideUrl ? (
                                    <a
                                      href={les.slideUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1 hover:underline"
                                    >
                                      <Presentation className="h-3 w-3" />
                                      <span>Slide Deck (Drive / Canva)</span>
                                    </a>
                                  ) : (
                                    <span className="text-slate-600 flex items-center gap-1">
                                      <Presentation className="h-3 w-3" /> No Slides Link
                                    </span>
                                  )}

                                  {les.contentMarkdown && (
                                    <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                                      <FileText className="h-3 w-3" />
                                      <span>Rich Notes</span>
                                    </span>
                                  )}

                                  {les.resources?.map((r: any) => (
                                    <span
                                      key={r.id}
                                      className="px-2 py-0.5 rounded bg-white/5 text-slate-300 border border-white/10 flex items-center gap-1.5"
                                    >
                                      <Paperclip className="h-3 w-3 text-brand-cyan" />
                                      <span className="truncate max-w-[120px]">{r.title}</span>
                                      <button
                                        onClick={() => handleDeleteResource(r.id)}
                                        className="text-red-400 hover:text-red-300 ml-1"
                                      >
                                        ×
                                      </button>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD / EDIT MODULE MODAL                                                   */}
        {/* ========================================================================= */}
        {isModuleModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModuleModalOpen(false)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-alpine-900 p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold font-display text-white">Create New Module</h3>
                <button onClick={() => setIsModuleModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveModule} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Module Title</label>
                  <input
                    type="text"
                    value={moduleForm.title}
                    onChange={(e) => setModuleForm({ ...moduleForm, title: e.target.value })}
                    required
                    placeholder="e.g. Week 2: Advanced Vector Search & Embeddings"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Description</label>
                  <textarea
                    rows={2}
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    placeholder="Key concepts and deliverables..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/20"
                >
                  Save Module
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD / EDIT LESSON MODAL                                                   */}
        {/* ========================================================================= */}
        {isLessonModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            <div className="fixed inset-0 bg-black/85 backdrop-blur-md" onClick={() => setIsLessonModalOpen(false)} />
            <div className="relative w-full max-w-2xl max-h-[90vh] rounded-3xl border border-white/15 bg-alpine-900 shadow-2xl z-10 flex flex-col overflow-hidden">
              <div className="p-5 border-b border-white/10 flex items-center justify-between shrink-0 bg-alpine-950">
                <div>
                  <h3 className="text-base font-bold font-display text-white">
                    {lessonForm.id ? 'Edit Lesson Materials' : 'Add New Lesson to Module'}
                  </h3>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Embed Zoom Cloud recording links, Google Drive slide decks, and lesson architecture notes
                  </p>
                </div>
                <button onClick={() => setIsLessonModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveLesson} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Lesson Title</label>
                  <input
                    type="text"
                    value={lessonForm.title}
                    onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                    required
                    placeholder="e.g. Session 3: LangGraph Multi-Agent Checkpointing"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Lesson Type</label>
                    <select
                      value={lessonForm.type}
                      onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="VIDEO">Video Lecture / Zoom Cloud Recording</option>
                      <option value="SLIDES">Slide Presentation (Drive / Canva)</option>
                      <option value="ARTICLE">Technical Architecture Notes</option>
                      <option value="PDF">PDF Guide / Manual</option>
                      <option value="ASSIGNMENT">Homework / Project Assignment</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Duration (Minutes)</label>
                    <input
                      type="number"
                      value={lessonForm.durationMinutes}
                      onChange={(e) => setLessonForm({ ...lessonForm, durationMinutes: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                {/* Video Recording URL */}
                <div className="space-y-1 p-3 rounded-2xl bg-alpine-950 border border-white/10">
                  <div className="flex items-center gap-2 text-blue-400 font-bold font-mono">
                    <Video className="h-4 w-4" />
                    <span>Video Recording Link (Zoom Cloud / Google Drive / YouTube)</span>
                  </div>
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://us02web.zoom.us/rec/share/... OR https://drive.google.com/file/d/.../view"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-400">
                    Paste Zoom Cloud recording or Google Drive link for students to watch anytime.
                  </p>
                </div>

                {/* Slide Presentation Link */}
                <div className="space-y-1 p-3 rounded-2xl bg-alpine-950 border border-white/10">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Presentation className="h-4 w-4" />
                    <span>Slide Deck / Presentation Link (Google Drive / Canva)</span>
                  </div>
                  <input
                    type="url"
                    value={lessonForm.slideUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, slideUrl: e.target.value })}
                    placeholder="https://docs.google.com/presentation/d/... OR Canva presentation link"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none font-mono text-xs"
                  />
                </div>

                {/* Rich Notes Markdown */}
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">
                    Lesson Architecture Notes & Instructions (Markdown)
                  </label>
                  <textarea
                    rows={6}
                    value={lessonForm.contentMarkdown}
                    onChange={(e) => setLessonForm({ ...lessonForm, contentMarkdown: e.target.value })}
                    placeholder="### Instructions&#10;1. Clone the repository&#10;2. Configure .env file&#10;```bash&#10;npm install&#10;```"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-brand-cyan text-white font-bold text-xs shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Lesson & Material Links</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ATTACH RESOURCE MODAL                                                     */}
        {/* ========================================================================= */}
        {isResourceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsResourceModalOpen(false)} />
            <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-alpine-900 p-6 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold font-display text-white">Attach Resource / File Link</h3>
                <button onClick={() => setIsResourceModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddResource} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Resource Title</label>
                  <input
                    type="text"
                    value={resourceForm.title}
                    onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })}
                    required
                    placeholder="e.g. Lab Exercise Guide PDF"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Google Drive / Cloud Download URL</label>
                  <input
                    type="url"
                    value={resourceForm.fileUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                    required
                    placeholder="https://drive.google.com/..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">File Type</label>
                    <select
                      value={resourceForm.fileType}
                      onChange={(e) => setResourceForm({ ...resourceForm, fileType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                    >
                      <option value="PDF">PDF Document</option>
                      <option value="ZIP">Zip Archive</option>
                      <option value="CODE">Source Code</option>
                      <option value="SLIDES">Slide Deck</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Approx. Size (MB)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={resourceForm.fileSizeMb}
                      onChange={(e) => setResourceForm({ ...resourceForm, fileSizeMb: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-purple-400 focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-purple-600 text-white font-bold text-xs shadow-md shadow-purple-600/20"
                >
                  Attach Resource to Lesson
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
