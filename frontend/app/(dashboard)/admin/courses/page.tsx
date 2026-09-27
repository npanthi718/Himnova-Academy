'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatCurrency } from '@/lib/utils';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Sparkles,
  ExternalLink,
  X,
  Layers,
  Video,
  FileText,
  Presentation,
  Paperclip,
  Check,
  ChevronDown,
  ChevronRight,
  Play,
  Save,
} from 'lucide-react';

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Course create / edit modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    description: '',
    category: 'AI & Generative AI',
    difficulty: 'INTERMEDIATE',
    durationHours: 60,
    price: 25000,
    discountPrice: 20000,
    thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
    isPublished: true,
  });

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

  const openCurriculumManager = async (courseId: string) => {
    try {
      const course = courses.find((c) => c.id === courseId);
      if (!course) return;
      const fullCourse = await api.getCourseBySlug(course.slug);
      setCurriculumCourse(fullCourse);
      // expand all modules by default
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

  const handleSaveCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCourseId) {
        await api.updateCourse(editingCourseId, formData);
      } else {
        await api.createCourse(formData);
      }
      setIsModalOpen(false);
      setEditingCourseId(null);
      loadCourses();
    } catch (err: any) {
      alert(err.message || 'Failed to save course');
    }
  };

  const handleOpenEditCourse = (c: any) => {
    setEditingCourseId(c.id);
    setFormData({
      title: c.title,
      slug: c.slug,
      subtitle: c.subtitle || '',
      description: c.description || '',
      category: c.category || 'AI & Generative AI',
      difficulty: c.difficulty || 'INTERMEDIATE',
      durationHours: c.durationHours || 60,
      price: c.price || 0,
      discountPrice: c.discountPrice || 0,
      thumbnailUrl: c.thumbnailUrl || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      isPublished: Boolean(c.isPublished),
    });
    setIsModalOpen(true);
  };

  const handleDeleteCourse = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this course and all associated lessons?')) {
      try {
        await api.deleteCourse(id);
        loadCourses();
      } catch (err: any) {
        alert(err.message || 'Failed to delete course');
      }
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

  const handleDeleteModule = async (moduleId: string) => {
    if (confirm('Delete this entire module and all its lessons?')) {
      try {
        await api.deleteModule(moduleId);
        refreshCurriculum();
      } catch (err: any) {
        alert(err.message || 'Failed to delete module');
      }
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
    if (confirm('Delete this lesson?')) {
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
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-xs font-mono font-bold uppercase">
                Academic Operations
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold font-display text-white mt-1">
              Course & Curriculum Architecture
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Omnipotent control over Masterclass tracks, modules, video recordings (Zoom/Google Drive), slide decks, notes & tuition
            </p>
          </div>
          <button
            onClick={() => {
              setEditingCourseId(null);
              setFormData({
                title: '',
                slug: '',
                subtitle: '',
                description: '',
                category: 'AI & Generative AI',
                difficulty: 'INTERMEDIATE',
                durationHours: 60,
                price: 25000,
                discountPrice: 20000,
                thumbnailUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
                isPublished: true,
              });
              setIsModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-cyan/20 hover:opacity-95 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>Create Masterclass Track</span>
          </button>
        </div>

        {/* Courses Table */}
        <div className="rounded-3xl border border-white/10 bg-alpine-900/80 overflow-hidden shadow-2xl backdrop-blur-md">
          <div className="p-4 border-b border-white/10 flex items-center justify-between">
            <span className="text-xs font-mono font-bold text-slate-300 uppercase">
              Registered Tracks ({courses.length})
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Click &quot;Curriculum & Lessons&quot; to manage modules, notes, Zoom recordings and slides
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-alpine-950/80 text-slate-400 uppercase text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-4">Track Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Level & Hours</th>
                  <th className="p-4">Tuition</th>
                  <th className="p-4">Curriculum</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                {courses.map((c) => {
                  const moduleCount = c.modules?.length || 0;
                  let lessonCount = 0;
                  c.modules?.forEach((m: any) => {
                    lessonCount += m.lessons?.length || 0;
                  });

                  return (
                    <tr key={c.id} className="hover:bg-white/5 transition-colors">
                      <td className="p-4 font-bold text-white font-sans flex items-center gap-3">
                        <div className="h-12 w-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-white/10">
                          <img src={c.thumbnailUrl} alt={c.title} className="h-full w-full object-cover" />
                        </div>
                        <div>
                          <p className="line-clamp-1 font-bold text-sm text-white">{c.title}</p>
                          <span className="text-[10px] text-brand-cyan font-mono">{c.slug}</span>
                        </div>
                      </td>
                      <td className="p-4 text-slate-300">{c.category}</td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-brand-cyan font-bold inline-block">
                            {c.difficulty}
                          </span>
                          <p className="text-[10px] text-slate-500 font-mono">{c.durationHours || 60} Total Hours</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-0.5">
                          <span className="text-white font-bold block">{formatCurrency(c.discountPrice || c.price)}</span>
                          {c.discountPrice && c.price > c.discountPrice && (
                            <span className="text-[10px] text-slate-500 line-through block">
                              {formatCurrency(c.price)}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <button
                          onClick={() => openCurriculumManager(c.id)}
                          className="px-3 py-1.5 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 hover:bg-brand-cyan/25 text-xs font-bold flex items-center gap-1.5 transition-all"
                        >
                          <Layers className="h-3.5 w-3.5" />
                          <span>Curriculum ({moduleCount} Mods • {lessonCount} Lessons)</span>
                        </button>
                      </td>
                      <td className="p-4">
                        {c.isPublished ? (
                          <span className="text-emerald-400 flex items-center gap-1 font-bold text-[11px]">
                            <CheckCircle2 className="h-3.5 w-3.5" /> Published
                          </span>
                        ) : (
                          <span className="text-slate-500 flex items-center gap-1 text-[11px]">
                            <XCircle className="h-3.5 w-3.5" /> Draft
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link href={`/courses/${c.slug}`} target="_blank">
                            <button className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white" title="Public Showcase View">
                              <ExternalLink className="h-3.5 w-3.5" />
                            </button>
                          </Link>
                          <button
                            onClick={() => handleOpenEditCourse(c)}
                            className="p-1.5 rounded-lg bg-white/5 text-brand-cyan hover:bg-brand-cyan/20"
                            title="Edit Track Metadata & Pricing"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCourse(c.id)}
                            className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                            title="Delete Course Track"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
                  <div className="h-10 w-10 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center border border-brand-cyan/30">
                    <Layers className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold font-display text-white flex items-center gap-2">
                      <span>Curriculum Builder:</span>
                      <span className="text-brand-cyan">{curriculumCourse.title}</span>
                    </h2>
                    <p className="text-xs text-slate-400 font-mono">
                      Add modules, upload notes, attach Google Drive slides, Zoom Cloud video recordings & resources
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setModuleForm({ id: '', title: '', description: '', orderIndex: (curriculumCourse.modules?.length || 0) + 1 });
                      setIsModuleModalOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-brand-cyan text-slate-950 text-xs font-bold flex items-center gap-1.5 shadow-md shadow-brand-cyan/20 hover:bg-brand-cyan/90 transition-all"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    <span>Add New Module</span>
                  </button>
                  <button onClick={() => setIsCurriculumOpen(false)} className="p-2 rounded-xl text-slate-400 hover:text-white bg-white/5">
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Drawer Body - Module & Lessons Accordion */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {(!curriculumCourse.modules || curriculumCourse.modules.length === 0) ? (
                  <div className="p-12 text-center rounded-3xl border border-dashed border-white/10 space-y-3">
                    <Layers className="h-10 w-10 text-slate-500 mx-auto" />
                    <p className="text-sm font-bold text-white">No modules created yet</p>
                    <p className="text-xs text-slate-400 max-w-md mx-auto">
                      Click &quot;Add New Module&quot; above to begin structuring the 10-week syllabus.
                    </p>
                  </div>
                ) : (
                  curriculumCourse.modules.map((mod: any, mIdx: number) => {
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
                              <ChevronDown className="h-4 w-4 text-brand-cyan" />
                            ) : (
                              <ChevronRight className="h-4 w-4 text-slate-400" />
                            )}
                            <div>
                              <div className="flex items-center gap-2">
                                <span className="px-2 py-0.5 rounded bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 text-[10px] font-mono font-bold">
                                  MODULE {mIdx + 1}
                                </span>
                                <h3 className="text-sm font-bold text-white font-display">{mod.title}</h3>
                              </div>
                              {mod.description && (
                                <p className="text-xs text-slate-400 mt-0.5">{mod.description}</p>
                              )}
                            </div>
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleOpenNewLesson(mod.id)}
                              className="px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan text-slate-300 text-xs font-bold flex items-center gap-1 border border-white/10"
                            >
                              <Plus className="h-3 w-3" />
                              <span>Add Lesson</span>
                            </button>
                            <button
                              onClick={() => {
                                setModuleForm({ id: mod.id, title: mod.title, description: mod.description || '', orderIndex: mod.orderIndex });
                                setIsModuleModalOpen(true);
                              }}
                              className="p-1.5 rounded-lg bg-white/5 text-slate-400 hover:text-white"
                              title="Edit Module Title"
                            >
                              <Edit2 className="h-3.5 w-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteModule(mod.id)}
                              className="p-1.5 rounded-lg bg-red-500/10 text-red-400 hover:bg-red-500/20"
                              title="Delete Module"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        {/* Lessons List under Module */}
                        {isExp && (
                          <div className="p-4 space-y-3">
                            {(!mod.lessons || mod.lessons.length === 0) ? (
                              <p className="text-xs text-slate-500 font-mono italic">
                                No lessons added in this module. Click &quot;Add Lesson&quot; to insert notes, video link, or slides.
                              </p>
                            ) : (
                              mod.lessons.map((les: any, lIdx: number) => (
                                <div
                                  key={les.id}
                                  className="p-4 rounded-xl bg-alpine-900 border border-white/5 space-y-2.5"
                                >
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                                    <div className="flex items-center gap-2.5">
                                      <span className="text-xs font-mono font-bold text-slate-400">
                                        {mIdx + 1}.{lIdx + 1}
                                      </span>
                                      <h4 className="text-xs font-bold text-white font-sans">{les.title}</h4>
                                      <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[9px] font-mono text-brand-cyan uppercase">
                                        {les.type}
                                      </span>
                                      <span className="text-[10px] text-slate-400 font-mono">
                                        {les.durationMinutes} mins
                                      </span>
                                      {les.isFreePreview && (
                                        <span className="px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400 text-[9px] font-bold">
                                          FREE PREVIEW
                                        </span>
                                      )}
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
                                        className="p-1.5 rounded-lg bg-white/5 text-brand-cyan hover:bg-brand-cyan/20"
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
                                        <span>Slide Deck (Google Drive / Canva)</span>
                                      </a>
                                    ) : (
                                      <span className="text-slate-600 flex items-center gap-1">
                                        <Presentation className="h-3 w-3" /> No Slides Link
                                      </span>
                                    )}

                                    {les.contentMarkdown && (
                                      <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center gap-1">
                                        <FileText className="h-3 w-3" />
                                        <span>Rich Notes Included</span>
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
                  })
                )}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* CREATE / EDIT COURSE MODAL                                                */}
        {/* ========================================================================= */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
            <div className="relative w-full max-w-xl rounded-3xl border border-white/15 bg-alpine-900/95 p-6 sm:p-8 shadow-2xl z-10 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-lg font-bold font-display text-white">
                  {editingCourseId ? 'Edit Masterclass Track' : 'Create New Masterclass Track'}
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSaveCourse} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Course Title</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormData({
                        ...formData,
                        title: val,
                        slug: editingCourseId ? formData.slug : val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
                      });
                    }}
                    required
                    placeholder="e.g. Autonomous AI Agent Engineering"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Slug</label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      required
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Category</label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="AI & Generative AI">AI & Generative AI</option>
                      <option value="Full Stack Web Development">Full Stack Web Development</option>
                      <option value="Cloud & DevOps Automation">Cloud & DevOps Automation</option>
                      <option value="Python & Data Engineering">Python & Data Engineering</option>
                      <option value="Cybersecurity & SOC">Cybersecurity & SOC</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Difficulty</label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="BEGINNER">BEGINNER</option>
                      <option value="INTERMEDIATE">INTERMEDIATE</option>
                      <option value="ADVANCED">ADVANCED</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Regular Price (NPR)</label>
                    <input
                      type="number"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Discount Price (NPR)</label>
                    <input
                      type="number"
                      value={formData.discountPrice}
                      onChange={(e) => setFormData({ ...formData, discountPrice: Number(e.target.value) })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Cover Image URL</label>
                  <input
                    type="text"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Description</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                    placeholder="Comprehensive overview of learning outcomes and architectural skills..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="isPublishedCheck"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="h-4 w-4 rounded accent-brand-cyan"
                  />
                  <label htmlFor="isPublishedCheck" className="text-xs text-white font-mono cursor-pointer">
                    Publish Course on Public Catalog Immediately
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white font-bold text-xs shadow-lg shadow-brand-cyan/20"
                >
                  {editingCourseId ? 'Save Changes' : 'Publish Masterclass Track'}
                </button>
              </form>
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
                <h3 className="text-base font-bold font-display text-white">
                  {moduleForm.id ? 'Edit Module' : 'Create New Module'}
                </h3>
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
                    placeholder="e.g. Week 1: Production Multi-Agent Workflows"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">Module Description / Overview</label>
                  <textarea
                    rows={2}
                    value={moduleForm.description}
                    onChange={(e) => setModuleForm({ ...moduleForm, description: e.target.value })}
                    placeholder="Brief description of skills covered..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs shadow-md shadow-brand-cyan/20"
                >
                  Save Module
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* ADD / EDIT LESSON MODAL (With Zoom/Drive Video, Slides, Notes, Homework)   */}
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
                    Embed Zoom Cloud recordings, Google Drive slides, and structured architecture notes
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
                    placeholder="e.g. Session 1: LangGraph State Machine Architecture"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">Lesson Type</label>
                    <select
                      value={lessonForm.type}
                      onChange={(e) => setLessonForm({ ...lessonForm, type: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    >
                      <option value="VIDEO">Video Lecture / Live Class Recording</option>
                      <option value="SLIDES">Slide Presentation</option>
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                {/* Video Recording URL (Zoom Cloud / Google Drive / YouTube) */}
                <div className="space-y-1 p-3 rounded-2xl bg-alpine-950 border border-white/10">
                  <div className="flex items-center gap-2 text-brand-cyan font-bold font-mono">
                    <Video className="h-4 w-4" />
                    <span>Video Recording Link (Zoom Cloud / Google Drive / YouTube)</span>
                  </div>
                  <input
                    type="url"
                    value={lessonForm.videoUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, videoUrl: e.target.value })}
                    placeholder="https://us02web.zoom.us/rec/share/... OR https://drive.google.com/file/d/.../view"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono text-xs"
                  />
                  <p className="text-[10px] text-slate-400">
                    Paste the shared Zoom Cloud Recording URL or Google Drive video preview link. Students will watch directly in the player.
                  </p>
                </div>

                {/* Slide Presentation Link (Google Drive / Canva) */}
                <div className="space-y-1 p-3 rounded-2xl bg-alpine-950 border border-white/10">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Presentation className="h-4 w-4" />
                    <span>Slide Deck / Presentation Link (Google Drive / Canva)</span>
                  </div>
                  <input
                    type="url"
                    value={lessonForm.slideUrl}
                    onChange={(e) => setLessonForm({ ...lessonForm, slideUrl: e.target.value })}
                    placeholder="https://docs.google.com/presentation/d/... OR Canva/Pitch presentation link"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono text-xs"
                  />
                </div>

                {/* Rich Notes / Content Markdown */}
                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">
                    Lesson Architecture Notes & Code Walkthrough (Markdown)
                  </label>
                  <textarea
                    rows={6}
                    value={lessonForm.contentMarkdown}
                    onChange={(e) => setLessonForm({ ...lessonForm, contentMarkdown: e.target.value })}
                    placeholder="### Key Learning Outcomes&#10;- Enterprise multi-agent design patterns&#10;- Redis checkpointer setup&#10;```python&#10;# Example code&#10;```"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isFreePreviewCheck"
                    checked={lessonForm.isFreePreview}
                    onChange={(e) => setLessonForm({ ...lessonForm, isFreePreview: e.target.checked })}
                    className="h-4 w-4 rounded accent-brand-cyan"
                  />
                  <label htmlFor="isFreePreviewCheck" className="text-xs text-white font-mono cursor-pointer">
                    Enable as Free Preview Lesson (Accessible without full enrollment)
                  </label>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white font-bold text-xs shadow-lg shadow-brand-cyan/20 flex items-center justify-center gap-2"
                  >
                    <Save className="h-4 w-4" />
                    <span>Save Lesson Content & Links</span>
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
                    placeholder="e.g. Starter Codebase Repository (GitHub/Drive)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-mono font-bold text-slate-300">File / Google Drive Download URL</label>
                  <input
                    type="url"
                    value={resourceForm.fileUrl}
                    onChange={(e) => setResourceForm({ ...resourceForm, fileUrl: e.target.value })}
                    required
                    placeholder="https://drive.google.com/uc?id=... OR github repo URL"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-mono text-xs"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-mono font-bold text-slate-300">File Type</label>
                    <select
                      value={resourceForm.fileType}
                      onChange={(e) => setResourceForm({ ...resourceForm, fileType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
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
                      className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-brand-cyan text-slate-950 font-bold text-xs shadow-md shadow-brand-cyan/20"
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
