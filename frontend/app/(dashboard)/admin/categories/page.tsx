'use client';

import React, { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/lib/api-client';
import { formatDate } from '@/lib/utils';
import { 
  FolderPlus, 
  Layers, 
  Edit3, 
  Trash2, 
  Plus, 
  X, 
  BookOpen, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';
import Link from 'next/link';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [selectedCategoryForCourses, setSelectedCategoryForCourses] = useState<any | null>(null);
  
  // Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Layers');
  const [submitting, setSubmitting] = useState(false);

  const loadCategories = () => {
    setLoading(true);
    api.getCategories()
      .then(setCategories)
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openCreateModal = () => {
    setEditingCategory(null);
    setName('');
    setSlug('');
    setDescription('');
    setIcon('Layers');
    setIsModalOpen(true);
  };

  const openEditModal = (cat: any) => {
    setEditingCategory(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDescription(cat.description || '');
    setIcon(cat.icon || 'Layers');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string, catName: string) => {
    if (!confirm(`Are you sure you want to delete category "${catName}"?`)) return;
    try {
      await api.deleteCategory(id);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to delete category');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSubmitting(true);
    try {
      const generatedSlug = slug.trim() || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      if (editingCategory) {
        await api.updateCategory(editingCategory.id, {
          name: name.trim(),
          slug: generatedSlug,
          description: description.trim() || undefined,
          icon: icon.trim() || undefined,
        });
      } else {
        await api.createCategory({
          name: name.trim(),
          slug: generatedSlug,
          description: description.trim() || undefined,
          icon: icon.trim() || undefined,
        });
      }
      setIsModalOpen(false);
      loadCategories();
    } catch (err: any) {
      alert(err.message || 'Failed to save category');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardLayout allowedRoles={['SUPER_ADMIN']}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div>
            <h1 className="text-2xl font-bold font-display text-white">Course Categories & Tracks</h1>
            <p className="text-xs text-slate-400">Classify launchpad curriculums into distinct specialization departments</p>
          </div>
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold text-xs shadow-lg shadow-brand-cyan/20 hover:brightness-110 transition-all w-fit"
          >
            <Plus className="h-4 w-4" />
            <span>Add New Category</span>
          </button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {loading ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
              Loading categories from database...
            </div>
          ) : categories.length === 0 ? (
            <div className="col-span-full py-12 text-center text-slate-500 font-mono text-xs">
              No categories defined. Click &quot;Add New Category&quot; to create one.
            </div>
          ) : (
            categories.map((cat) => (
              <div
                key={cat.id}
                onClick={() => setSelectedCategoryForCourses(cat)}
                className="p-5 rounded-3xl bg-alpine-900/80 border border-white/10 hover:border-brand-cyan/40 transition-all flex flex-col justify-between space-y-4 cursor-pointer group hover:bg-alpine-850"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <div className="p-2.5 rounded-xl bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 group-hover:bg-brand-cyan group-hover:text-alpine-950 transition-colors">
                      <Layers className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 group-hover:text-brand-cyan">
                      {cat.courses?.length || 0} Courses (Click to view)
                    </span>
                  </div>
                  <h3 className="text-base font-bold font-display text-white mt-3 group-hover:text-brand-cyan transition-colors">{cat.name}</h3>
                  <p className="text-xs font-mono text-brand-cyan/80 mt-0.5">/{cat.slug}</p>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2">
                    {cat.description || 'No description provided for this track category.'}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setSelectedCategoryForCourses(cat)}
                    className="text-[11px] font-mono text-brand-cyan hover:underline flex items-center gap-1"
                  >
                    <BookOpen className="h-3.5 w-3.5" />
                    <span>View Published Classes</span>
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openEditModal(cat)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 transition-colors"
                      title="Edit Category"
                    >
                      <Edit3 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(cat.id, cat.name)}
                      className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors"
                      title="Delete Category"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* View Related Courses in Category Modal */}
        {selectedCategoryForCourses && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative max-w-2xl w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-brand-cyan/20 text-brand-cyan">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white font-display">
                      Published Classes in &quot;{selectedCategoryForCourses.name}&quot;
                    </h3>
                    <p className="text-xs text-slate-400 font-mono">
                      Category Track: /{selectedCategoryForCourses.slug} • Total {selectedCategoryForCourses.courses?.length || 0} courses
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCategoryForCourses(null)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white bg-white/5"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
                {(!selectedCategoryForCourses.courses || selectedCategoryForCourses.courses.length === 0) ? (
                  <div className="py-8 text-center text-slate-400 font-mono text-xs">
                    No classes published under this category yet.
                  </div>
                ) : (
                  selectedCategoryForCourses.courses.map((course: any) => (
                    <div
                      key={course.id}
                      className="p-4 rounded-2xl bg-alpine-850 border border-white/10 flex items-center justify-between gap-4 hover:border-brand-cyan/30 transition-colors"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-brand-cyan/20 text-brand-cyan">
                            {course.level || 'ALL_LEVELS'}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300">
                            {course.published !== false ? 'PUBLISHED' : 'DRAFT'}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-white">{course.title}</h4>
                        <p className="text-xs text-slate-400 font-mono">
                          Duration: {course.durationHours || 75} Hours • Price: Rs. {course.priceNpr?.toLocaleString() || '21,999'}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <Link
                          href={`/courses/${course.slug || course.id}`}
                          target="_blank"
                          className="px-3 py-1.5 rounded-xl bg-white/10 text-white hover:bg-white/20 text-xs font-mono font-bold flex items-center gap-1"
                        >
                          <span>Public Page</span>
                        </Link>
                        <Link
                          href="/admin/courses"
                          className="px-3 py-1.5 rounded-xl bg-brand-cyan text-alpine-950 hover:brightness-110 text-xs font-mono font-bold flex items-center gap-1"
                        >
                          <span>Manage Curriculum</span>
                        </Link>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Create / Edit Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <div className="relative max-w-md w-full bg-alpine-900 border border-white/15 rounded-3xl p-6 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-white font-display">
                  {editingCategory ? 'Edit Category' : 'Create New Course Category'}
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
                <div>
                  <label className="text-slate-300 block mb-1 font-bold">Category Name *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AI & Generative AI, Cloud & DevOps"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">URL Slug (Optional)</label>
                  <input
                    type="text"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. ai-generative-ai (auto-generated if blank)"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-slate-300 block mb-1">Description</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Brief description of the skills and technologies taught..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans"
                  />
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-alpine-800 text-slate-300 hover:bg-alpine-700 font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-5 py-2 rounded-xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 disabled:opacity-50"
                  >
                    {submitting ? 'Saving...' : editingCategory ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
