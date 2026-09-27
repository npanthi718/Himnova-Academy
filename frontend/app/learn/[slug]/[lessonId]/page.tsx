'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api-client';
import { HimnovaLogo } from '@/components/brand/HimnovaLogo';
import { AiTutorDrawer } from '@/components/ai/AiTutorDrawer';
import {
  Play,
  Pause,
  Volume2,
  Maximize,
  RotateCcw,
  CheckCircle2,
  Circle,
  FileText,
  Download,
  Bot,
  ArrowLeft,
  ArrowRight,
  Menu,
  X,
  Layers,
  Sparkles,
  HelpCircle,
  Clock,
  BookOpen,
  Share2,
  ExternalLink,
  Presentation,
  Video,
  Paperclip,
  Code2,
  Send,
  Check,
  ChevronDown,
  ChevronRight,
  GraduationCap,
  Award
} from 'lucide-react';

export default function CoursePlayerPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;
  const lessonId = params?.lessonId as string;
  const { user, isAuthenticated, isLoading } = useAuth();

  const [course, setCourse] = useState<any | null>(null);
  const [currentLesson, setCurrentLesson] = useState<any | null>(null);
  const [allLessons, setAllLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCompleted, setIsCompleted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [aiDrawerOpen, setAiDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'NOTES' | 'SLIDES' | 'LAB' | 'RESOURCES' | 'QUIZ'>('NOTES');
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({});

  // Lab / Homework Submission State
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [submittingLab, setSubmittingLab] = useState(false);
  const [labSubmitted, setLabSubmitted] = useState(false);

  // Quiz state
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/login?redirect=/learn/${slug}/${lessonId}`);
    }
  }, [isLoading, isAuthenticated, router, slug, lessonId]);

  useEffect(() => {
    if (slug && lessonId && user) {
      setLoading(true);
      Promise.all([
        api.getCourseBySlug(slug, user.id),
        api.getLesson(lessonId),
      ])
        .then(([courseData, lessonData]) => {
          setCourse(courseData);
          setCurrentLesson(lessonData);
          setIsCompleted(lessonData.userProgress?.isCompleted || false);

          // Default active tab based on what's available
          if (lessonData.contentMarkdown) {
            setActiveTab('NOTES');
          } else if (lessonData.slideUrl) {
            setActiveTab('SLIDES');
          } else {
            setActiveTab('NOTES');
          }

          // Flatten lessons list & auto-expand all modules
          const flat: any[] = [];
          const expandState: Record<string, boolean> = {};
          courseData.modules?.forEach((m: any, idx: number) => {
            expandState[m.id] = true;
            m.lessons?.forEach((l: any) => flat.push({ ...l, moduleTitle: m.title, moduleIndex: idx + 1 }));
          });
          setExpandedModules(expandState);
          setAllLessons(flat);
        })
        .catch((err) => {
          console.error('Failed to load lesson:', err);
          alert(err.message || 'Access restricted to this lesson');
          router.push(`/courses/${slug}`);
        })
        .finally(() => setLoading(false));
    }
  }, [slug, lessonId, user, router]);

  // Video playback speed effect
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = playbackSpeed;
    }
  }, [playbackSpeed]);

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [modId]: !prev[modId],
    }));
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    const nextState = !isCompleted;
    setIsCompleted(nextState);

    try {
      await api.updateLessonProgress(currentLesson.id, {
        isCompleted: nextState,
        lastPositionSeconds: videoRef.current ? Math.floor(videoRef.current.currentTime) : 0,
      });

      // Advance to next lesson smoothly if marked complete
      if (nextState) {
        const currentIndex = allLessons.findIndex((l) => l.id === currentLesson.id);
        if (currentIndex !== -1 && currentIndex < allLessons.length - 1) {
          const nextLesson = allLessons[currentIndex + 1];
          router.push(`/learn/${slug}/${nextLesson.id}`);
        }
      }
    } catch (err) {
      console.error('Progress update error:', err);
    }
  };

  const handleHomeworkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim()) return;
    setSubmittingLab(true);
    try {
      // If course has assignments or direct submission
      const assignmentId = currentLesson.assignments?.[0]?.id || currentLesson.id;
      await api.submitAssignment({
        assignmentId,
        submissionUrl: submissionUrl.trim(),
        submissionText: submissionNotes.trim(),
      });
      setLabSubmitted(true);
      alert('🚀 Homework / Capstone deliverable successfully submitted to trainer for review & grading!');
    } catch (err: any) {
      alert(err.message || 'Submission recorded for your course progress.');
      setLabSubmitted(true);
    } finally {
      setSubmittingLab(false);
    }
  };

  const currentLessonIndex = allLessons.findIndex((l) => l.id === lessonId);
  const prevLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  // Calculate total completed lessons
  const totalCompletedCount = allLessons.filter((l) => l.userProgress?.isCompleted || (l.id === lessonId && isCompleted)).length;
  const progressPercent = allLessons.length > 0 ? Math.round((totalCompletedCount / allLessons.length) * 100) : 0;

  // Universal In-Frame Player (Embeds YouTube, Google Drive, Zoom Recordings, Vimeo & MP4 without tab redirect)
  const renderInFramePlayer = (url: string | null, slideUrl: string | null) => {
    // 1. If Video URL is provided
    if (url) {
      // Google Drive video
      if (url.includes('drive.google.com')) {
        const previewUrl = url.replace(/\/view(\?.*)?$/, '/preview');
        return (
          <div className="relative h-full w-full bg-black flex flex-col items-center justify-center">
            <iframe
              src={previewUrl}
              title={currentLesson?.title}
              className="w-full h-full border-0"
              allow="autoplay; fullscreen; clipboard-write; encrypted-media"
              allowFullScreen
            />
          </div>
        );
      }

      // YouTube embed
      if (url.includes('youtube.com') || url.includes('youtu.be')) {
        let embedUrl = url;
        if (url.includes('watch?v=')) {
          const videoId = url.split('watch?v=')[1]?.split('&')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        } else if (url.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1]?.split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0`;
        }
        return (
          <iframe
            src={embedUrl}
            title={currentLesson?.title}
            className="w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // Vimeo embed
      if (url.includes('vimeo.com')) {
        const vimeoId = url.split('/').filter(Boolean).pop();
        return (
          <iframe
            src={`https://player.vimeo.com/video/${vimeoId}`}
            title={currentLesson?.title}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        );
      }

      // Zoom Cloud Recording or general outsource frame
      if (url.includes('zoom.us')) {
        return (
          <div className="relative h-full w-full bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
            <div className="h-16 w-16 rounded-3xl bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center shadow-xl">
              <Video className="h-8 w-8" />
            </div>
            <div className="space-y-1">
              <span className="px-3 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30 text-xs font-mono font-bold uppercase">
                Official Live Class Cloud Recording
              </span>
              <h4 className="text-lg font-bold font-display text-white mt-1">{currentLesson?.title}</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                High-definition live recording with interactive AI transcripts and code benchmarks.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-brand-cyan/20 hover:opacity-95 transition-all"
              >
                <Play className="h-4 w-4 fill-white" />
                <span>Play Zoom Cloud Recording</span>
                <ExternalLink className="h-3.5 w-3.5 ml-1" />
              </a>
            </div>
          </div>
        );
      }

      // Direct MP4 / WebM / HTML5 Video
      return (
        <video
          ref={videoRef}
          src={url}
          controls
          className="h-full w-full object-contain bg-black"
        />
      );
    }

    // 2. If No Video URL, but Slide URL is present, embed the presentation slide deck
    if (slideUrl) {
      const embedSlideUrl = slideUrl.includes('drive.google.com')
        ? slideUrl.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview')
        : slideUrl;
      return (
        <div className="relative h-full w-full bg-black flex flex-col">
          <iframe
            src={embedSlideUrl}
            title="Presentation Slide Deck"
            className="w-full h-full border-0"
            allowFullScreen
          />
        </div>
      );
    }

    // 3. Fallback: Interactive Concept & Architecture Banner
    return (
      <div className="h-full w-full p-8 flex flex-col items-center justify-center text-center space-y-3 bg-gradient-to-b from-alpine-900 to-alpine-950">
        <div className="h-16 w-16 rounded-3xl bg-brand-cyan/15 border border-brand-cyan/30 text-brand-cyan flex items-center justify-center shadow-xl">
          <BookOpen className="h-8 w-8" />
        </div>
        <h4 className="text-base sm:text-lg font-bold font-display text-white">{currentLesson?.title}</h4>
        <p className="text-xs text-slate-400 max-w-md">
          Explore architectural engineering notes, executable lab specifications, and reference downloads below.
        </p>
      </div>
    );
  };

  if (loading || !currentLesson) {
    return (
      <div className="min-h-screen bg-alpine-950 flex flex-col items-center justify-center text-white space-y-4">
        <div className="h-10 w-10 border-2 border-brand-cyan border-t-transparent rounded-full animate-spin"></div>
        <p className="text-xs font-mono text-slate-400">Loading Himnova Interactive Classroom...</p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-alpine-950 text-slate-100 flex flex-col overflow-hidden select-none font-sans">
      {/* ========================================================================= */}
      {/* TOP CLASSROOM NAVIGATION BAR                                              */}
      {/* ========================================================================= */}
      <header className="h-14 border-b border-white/10 bg-alpine-950/95 px-4 flex items-center justify-between gap-4 shrink-0 z-30 shadow-md">
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/student/my-courses"
            className="p-1.5 rounded-xl border border-white/10 hover:bg-white/5 text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-mono shrink-0"
            title="Back to Student Dashboard"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">My Courses</span>
          </Link>

          <HimnovaLogo size="sm" showSubtitle={false} />

          <div className="hidden md:flex items-center gap-2 text-xs font-mono text-slate-400 pl-3 border-l border-white/10 truncate">
            <span className="text-slate-300 font-bold truncate max-w-[200px]">{course?.title}</span>
            <span className="text-slate-600">/</span>
            <span className="text-brand-cyan truncate max-w-[220px]">{currentLesson.title}</span>
          </div>
        </div>

        {/* Center Progress Bar Indicator */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs text-slate-400">
          <div className="w-36 h-2 bg-alpine-850 rounded-full overflow-hidden border border-white/10">
            <div
              className="h-full bg-gradient-to-r from-brand-cyan to-emerald-400 rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <span className="text-emerald-400 font-bold">{progressPercent}% Completed</span>
        </div>

        {/* Right Tools (AI Tutor & Sidebar Toggle) */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setAiDrawerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-brand-cyan text-white shadow-lg shadow-brand-cyan/20 hover:brightness-110 active:scale-95 transition-all"
          >
            <Bot className="h-3.5 w-3.5" />
            <span>AI Tutor</span>
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-xl border border-white/10 bg-alpine-900 text-slate-300 hover:text-white transition-colors"
            title="Toggle Curriculum Syllabus"
          >
            <Layers className="h-4 w-4" />
          </button>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* MAIN CLASSROOM WORKSPACE                                                 */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* LEFT SYLLABUS / CURRICULUM SIDEBAR */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-88 border-r border-white/10 bg-alpine-900 flex flex-col shrink-0 overflow-hidden z-20">
            {/* Sidebar Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-alpine-950/60">
              <div>
                <h3 className="text-xs font-bold font-mono uppercase text-white tracking-wider flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-brand-cyan" />
                  <span>Course Curriculum</span>
                </h3>
                <p className="text-[10px] font-mono text-slate-400 mt-0.5">
                  {allLessons.length} Total Lessons • {course?.durationHours || 75} Hours
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-slate-400 hover:text-white lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Modules & Lessons Accordion List */}
            <div className="flex-1 overflow-y-auto divide-y divide-white/5">
              {course?.modules?.map((mod: any, mIdx: number) => {
                const isExpanded = expandedModules[mod.id] !== false;
                const completedInModule = mod.lessons?.filter((l: any) => l.userProgress?.isCompleted || (l.id === lessonId && isCompleted)).length || 0;
                const totalInModule = mod.lessons?.length || 0;

                return (
                  <div key={mod.id} className="py-2">
                    {/* Module Header Bar */}
                    <button
                      onClick={() => toggleModuleAccordion(mod.id)}
                      className="w-full px-3.5 py-2 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                    >
                      <div className="space-y-0.5 min-w-0">
                        <span className="text-[10px] font-mono font-extrabold text-brand-cyan uppercase tracking-wider block">
                          Module {mIdx + 1}
                        </span>
                        <h4 className="text-xs font-bold text-white truncate">{mod.title}</h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[9.5px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                          {completedInModule}/{totalInModule}
                        </span>
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Lessons inside Module */}
                    {isExpanded && (
                      <div className="px-2 pt-1 space-y-1">
                        {mod.lessons?.map((les: any, lIdx: number) => {
                          const isActive = les.id === lessonId;
                          const isLesCompleted = les.userProgress?.isCompleted || (les.id === lessonId && isCompleted);

                          return (
                            <Link
                              key={les.id}
                              href={`/learn/${slug}/${les.id}`}
                              className={`flex items-center gap-2.5 p-2 rounded-xl text-xs transition-all ${
                                isActive
                                  ? 'bg-brand-cyan/20 border border-brand-cyan/50 text-white font-bold shadow-md shadow-brand-cyan/10'
                                  : 'hover:bg-white/5 text-slate-300'
                              }`}
                            >
                              {isLesCompleted ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                              ) : isActive ? (
                                <div className="h-4 w-4 rounded-full border-2 border-brand-cyan flex items-center justify-center shrink-0">
                                  <div className="h-1.5 w-1.5 rounded-full bg-brand-cyan" />
                                </div>
                              ) : (
                                <Circle className="h-4 w-4 text-slate-600 shrink-0" />
                              )}

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-xs leading-tight">
                                  {mIdx + 1}.{lIdx + 1} {les.title}
                                </p>
                                <div className="flex items-center gap-2 text-[9px] font-mono text-slate-500 mt-0.5">
                                  {les.videoUrl ? (
                                    <span className="flex items-center gap-0.5 text-blue-400">
                                      <Video className="h-2.5 w-2.5" /> Video
                                    </span>
                                  ) : les.slideUrl ? (
                                    <span className="flex items-center gap-0.5 text-amber-400">
                                      <Presentation className="h-2.5 w-2.5" /> Slides
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-0.5 text-slate-400">
                                      <FileText className="h-2.5 w-2.5" /> Notes
                                    </span>
                                  )}
                                  <span>•</span>
                                  <span>{les.durationMinutes || 45} mins</span>
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </aside>
        )}

        {/* CENTER IN-FRAME PLAYER & LEARNING AREA */}
        <div className="flex-1 flex flex-col min-w-0 bg-alpine-950 overflow-y-auto">
          {/* Main Content Player Container */}
          <div className="relative aspect-video max-h-[62vh] w-full bg-black flex items-center justify-center shadow-2xl border-b border-white/10">
            {renderInFramePlayer(currentLesson.videoUrl, currentLesson.slideUrl)}
          </div>

          {/* Player Controls Bar */}
          <div className="px-4 sm:px-6 py-3 bg-alpine-900 border-b border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
            {/* Speed & Video Controls */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Playback Speed:</span>
              <div className="flex items-center gap-1">
                {[0.75, 1, 1.25, 1.5, 2].map((spd) => (
                  <button
                    key={spd}
                    onClick={() => setPlaybackSpeed(spd)}
                    className={`px-2 py-0.5 rounded-lg text-[11px] font-bold transition-all ${
                      playbackSpeed === spd
                        ? 'bg-brand-cyan text-slate-950 shadow-sm'
                        : 'text-slate-400 hover:text-white bg-white/5'
                    }`}
                  >
                    {spd}x
                  </button>
                ))}
              </div>
            </div>

            {/* Completion & Next Lesson Triggers */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleMarkComplete}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shadow-sm'
                    : 'bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40 hover:bg-brand-cyan/30'
                }`}
              >
                <CheckCircle2 className="h-4 w-4" />
                <span>{isCompleted ? 'Completed ✓' : 'Mark as Complete'}</span>
              </button>
            </div>
          </div>

          {/* Lesson Content Tabs */}
          <div className="p-4 sm:p-6 space-y-6 max-w-5xl mx-auto w-full">
            {/* Tabs Header */}
            <div className="flex items-center gap-2 sm:gap-4 border-b border-white/10 pb-2 overflow-x-auto no-scrollbar font-mono text-xs">
              <button
                onClick={() => setActiveTab('NOTES')}
                className={`pb-2 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                  activeTab === 'NOTES'
                    ? 'text-brand-cyan border-b-2 border-brand-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>Notes & Curriculum</span>
              </button>

              {currentLesson.slideUrl && (
                <button
                  onClick={() => setActiveTab('SLIDES')}
                  className={`pb-2 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                    activeTab === 'SLIDES'
                      ? 'text-amber-400 border-b-2 border-amber-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Presentation className="h-3.5 w-3.5 text-amber-400" />
                  <span>Presentation Slides</span>
                </button>
              )}

              <button
                onClick={() => setActiveTab('LAB')}
                className={`pb-2 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                  activeTab === 'LAB'
                    ? 'text-purple-400 border-b-2 border-purple-400'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="h-3.5 w-3.5 text-purple-400" />
                <span>Homework & Lab Submission</span>
              </button>

              <button
                onClick={() => setActiveTab('RESOURCES')}
                className={`pb-2 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                  activeTab === 'RESOURCES'
                    ? 'text-brand-cyan border-b-2 border-brand-cyan'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Paperclip className="h-3.5 w-3.5" />
                <span>Resources ({currentLesson.resources?.length || 0})</span>
              </button>

              {currentLesson.quizQuestions?.length > 0 && (
                <button
                  onClick={() => setActiveTab('QUIZ')}
                  className={`pb-2 transition-all flex items-center gap-1.5 font-bold whitespace-nowrap ${
                    activeTab === 'QUIZ'
                      ? 'text-emerald-400 border-b-2 border-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <HelpCircle className="h-3.5 w-3.5" />
                  <span>Quiz ({currentLesson.quizQuestions.length})</span>
                </button>
              )}
            </div>

            {/* TAB CONTENT: NOTES */}
            {activeTab === 'NOTES' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold font-display text-white">{currentLesson.title}</h2>
                  <span className="text-xs font-mono text-slate-400">
                    Est. Duration: {currentLesson.durationMinutes || 45} mins
                  </span>
                </div>
                <div className="p-6 rounded-3xl bg-alpine-900/90 border border-white/10 text-xs leading-relaxed text-slate-200 space-y-4 font-sans shadow-lg">
                  <div className="prose prose-invert max-w-none whitespace-pre-line leading-relaxed">
                    {currentLesson.contentMarkdown || currentLesson.description || 'Welcome to this Himnova technical module. Watch the lecture video above and consult your instructor during live office hours for deep-dive reviews.'}
                  </div>
                </div>
              </div>
            )}

            {/* TAB CONTENT: SLIDES */}
            {activeTab === 'SLIDES' && currentLesson.slideUrl && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold font-display text-white">Presentation Slide Deck</h3>
                  <a
                    href={currentLesson.slideUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/30 font-mono"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                    <span>Fullscreen Slide Deck</span>
                  </a>
                </div>
                <div className="aspect-video w-full rounded-3xl border border-white/10 bg-black overflow-hidden shadow-2xl">
                  <iframe
                    src={currentLesson.slideUrl.replace(/\/view(\?.*)?$/, '/preview').replace(/\/edit(\?.*)?$/, '/preview')}
                    title="Slide Presentation"
                    className="w-full h-full border-0"
                    allowFullScreen
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT: HOMEWORK & LAB SUBMISSION */}
            {activeTab === 'LAB' && (
              <div className="space-y-5">
                <div className="p-6 rounded-3xl bg-alpine-900 border border-white/10 space-y-4">
                  <div className="flex items-center gap-2 text-purple-400 font-mono text-xs font-bold">
                    <Code2 className="h-4 w-4" />
                    <span>Hands-On Capstone Assignment & Technical Deliverable</span>
                  </div>
                  <h3 className="text-base font-bold text-white font-display">
                    {currentLesson.title} — Practical Lab Submission
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    Submit your verified GitHub repository link, Google Drive project folder, or Google Colab notebook. Your faculty mentor will evaluate the architecture, code quality, and execution benchmarks.
                  </p>

                  <form onSubmit={handleHomeworkSubmit} className="space-y-3 pt-2 font-mono text-xs">
                    <div>
                      <label className="text-slate-300 block mb-1 font-bold">
                        Repository / Colab / Google Drive URL *
                      </label>
                      <input
                        type="url"
                        required
                        value={submissionUrl}
                        onChange={(e) => setSubmissionUrl(e.target.value)}
                        placeholder="https://github.com/username/project or https://drive.google.com/..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="text-slate-300 block mb-1">
                        Architecture Notes & Implementation Summary (Optional)
                      </label>
                      <textarea
                        rows={3}
                        value={submissionNotes}
                        onChange={(e) => setSubmissionNotes(e.target.value)}
                        placeholder="Key architectural choices, deployed endpoints, performance benchmarks..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-alpine-850 border border-white/10 text-white focus:border-brand-cyan focus:outline-none font-sans"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={submittingLab}
                      className="px-6 py-3 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-brand-cyan text-white font-bold flex items-center gap-2 shadow-lg shadow-purple-500/20 hover:brightness-110 active:scale-95 transition-all"
                    >
                      <Send className="h-4 w-4" />
                      <span>{submittingLab ? 'Submitting to Trainer...' : 'Submit Assignment for Grading'}</span>
                    </button>
                  </form>
                </div>
              </div>
            )}

            {/* TAB CONTENT: RESOURCES */}
            {activeTab === 'RESOURCES' && (
              <div className="space-y-3">
                {(!currentLesson.resources || currentLesson.resources.length === 0) ? (
                  <div className="p-8 rounded-3xl bg-alpine-900 border border-white/10 text-center font-mono text-xs text-slate-400">
                    No downloadable assets attached to this specific lesson.
                  </div>
                ) : (
                  currentLesson.resources.map((res: any) => (
                    <div
                      key={res.id}
                      className="p-4 rounded-2xl bg-alpine-900 border border-white/10 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-brand-cyan/15 text-brand-cyan">
                          <Download className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white">{res.title}</p>
                          <p className="text-[10px] text-slate-500 font-mono">
                            {res.fileType || 'Document'} • {res.fileSizeMb || 1} MB
                          </p>
                        </div>
                      </div>
                      <a
                        href={res.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl bg-white/5 hover:bg-brand-cyan/20 hover:text-brand-cyan text-slate-300 text-xs font-mono font-bold border border-white/10 flex items-center gap-1.5 transition-colors"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span>Download Resource</span>
                      </a>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB CONTENT: QUIZ */}
            {activeTab === 'QUIZ' && (
              <div className="space-y-4">
                {currentLesson.quizQuestions?.map((q: any, qIdx: number) => (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl bg-alpine-900 border border-white/10 space-y-3"
                  >
                    <p className="text-xs font-bold text-white">
                      Q{qIdx + 1}: {q.questionText}
                    </p>
                    <div className="space-y-2">
                      {q.options?.map((opt: string, optIdx: number) => {
                        const isSelected = quizAnswers[qIdx] === optIdx;
                        return (
                          <button
                            key={optIdx}
                            onClick={() => setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx })}
                            className={`w-full p-3 rounded-xl text-left text-xs transition-all flex items-center gap-3 ${
                              isSelected
                                ? 'bg-brand-cyan/20 border border-brand-cyan/50 text-white font-bold'
                                : 'bg-white/5 border border-white/5 text-slate-300 hover:bg-white/10'
                            }`}
                          >
                            <span className="h-5 w-5 rounded-full border border-white/20 flex items-center justify-center text-[10px] font-mono">
                              {String.fromCharCode(65 + optIdx)}
                            </span>
                            <span>{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Bottom Footer Lesson Navigation */}
            <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-4 font-mono text-xs">
              {prevLesson ? (
                <Link
                  href={`/learn/${slug}/${prevLesson.id}`}
                  className="px-4 py-2.5 rounded-2xl bg-alpine-900 hover:bg-alpine-850 border border-white/10 text-slate-300 hover:text-white flex items-center gap-2 transition-colors"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span className="truncate max-w-[150px] sm:max-w-xs">Prev: {prevLesson.title}</span>
                </Link>
              ) : (
                <div />
              )}

              {nextLesson ? (
                <Link
                  href={`/learn/${slug}/${nextLesson.id}`}
                  className="px-4 py-2.5 rounded-2xl bg-brand-cyan text-alpine-950 font-bold hover:brightness-110 flex items-center gap-2 transition-all shadow-lg shadow-brand-cyan/20"
                >
                  <span className="truncate max-w-[150px] sm:max-w-xs">Next: {nextLesson.title}</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              ) : (
                <Link
                  href="/student/certificates"
                  className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20"
                >
                  <span>Claim Credential</span>
                  <Award className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HIMNOVA AI TUTOR SLIDING DRAWER                                           */}
      {/* ========================================================================= */}
      <AiTutorDrawer
        isOpen={aiDrawerOpen}
        onClose={() => setAiDrawerOpen(false)}
        courseId={course?.id}
        lessonId={currentLesson.id}
        courseTitle={course?.title}
      />
    </div>
  );
}
