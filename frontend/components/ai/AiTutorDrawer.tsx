'use client';

import React, { useState } from 'react';
import { api } from '@/lib/api-client';
import {
  Bot,
  Send,
  Sparkles,
  BookOpen,
  FileText,
  BrainCircuit,
  Briefcase,
  HelpCircle,
  X,
  Minimize2,
  Maximize2,
  RefreshCw,
} from 'lucide-react';

interface AiTutorDrawerProps {
  courseId?: string;
  lessonId?: string;
  courseTitle?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

export const AiTutorDrawer: React.FC<AiTutorDrawerProps> = ({
  courseId,
  lessonId,
  courseTitle,
  isOpen = true,
  onClose,
}) => {
  const [messages, setMessages] = useState<
    { role: 'user' | 'assistant'; content: string; context?: string }[]
  >([
    {
      role: 'assistant',
      content: `Hello! I am your **Himnova AI Senior Tutor & Career Mentor**. How can I help you master ${courseTitle || 'your curriculum'} today? Ask a technical question, generate a practice quiz, or get a code review.`,
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [contextType, setContextType] = useState<
    'COURSE_TUTOR' | 'NOTES_SUMMARY' | 'QUIZ_GENERATOR' | 'RESUME_REVIEW' | 'INTERVIEW_PREP' | 'CAREER_ROADMAP'
  >('COURSE_TUTOR');

  const handleSend = async (customPrompt?: string) => {
    const textToSend = customPrompt || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg = { role: 'user' as const, content: textToSend, context: contextType };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.askAi({
        courseId,
        lessonId,
        prompt: textToSend,
        contextType,
      });

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: res.answer || 'I could not generate an answer at this moment.',
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `⚠️ **AI Notice**: ${err.message || 'Unable to connect to AI tutor service.'}`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const presetButtons = [
    { label: 'Summarize Lesson', type: 'NOTES_SUMMARY' as const, prompt: 'Summarize key concepts from this lesson in 3 actionable bullet points.' },
    { label: 'Generate Quiz', type: 'QUIZ_GENERATOR' as const, prompt: 'Generate 2 challenging multiple-choice questions on this topic.' },
    { label: 'Career Roadmap', type: 'CAREER_ROADMAP' as const, prompt: 'How does mastering this skill fit into my Himnova 7-stage career progression?' },
    { label: 'Interview Prep', type: 'INTERVIEW_PREP' as const, prompt: 'Give me a senior system design interview question related to this architecture.' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative w-full max-w-md h-full bg-alpine-900 border-l border-white/15 flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-3.5 border-b border-white/10 bg-alpine-950/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-brand-cyan to-blue-600 flex items-center justify-center text-slate-950 shadow-md shadow-brand-cyan/20">
              <Bot className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h4 className="text-xs font-bold text-white font-display">Himnova AI Tutor</h4>
                <span className="px-1.5 py-0.2 text-[8px] font-mono rounded bg-brand-cyan/20 text-brand-cyan border border-brand-cyan/40">
                  PROD
                </span>
              </div>
              <p className="text-[10px] text-slate-400">Context: {courseTitle ? courseTitle.slice(0, 30) + '...' : 'Launchpad Assistant'}</p>
            </div>
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Preset Quick Actions */}
        <div className="p-2 border-b border-white/5 bg-alpine-950/40 flex items-center gap-1.5 overflow-x-auto no-scrollbar shrink-0">
          {presetButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => {
                setContextType(btn.type);
                handleSend(btn.prompt);
              }}
              className="px-2.5 py-1 text-[10px] font-semibold whitespace-nowrap rounded-lg border border-white/10 bg-white/5 hover:border-brand-cyan/40 hover:bg-brand-cyan/10 hover:text-brand-cyan transition-all text-slate-300"
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* Message Chat List */}
        <div className="flex-1 p-3.5 overflow-y-auto space-y-3 font-sans text-xs">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${
                m.role === 'user' ? 'items-end' : 'items-start'
              }`}
            >
              <div
                className={`max-w-[90%] p-3 rounded-2xl ${
                  m.role === 'user'
                    ? 'bg-gradient-to-r from-blue-600 to-sky-600 text-white shadow-md shadow-blue-500/20'
                    : 'bg-alpine-850 border border-white/10 text-slate-200'
                }`}
              >
                <div className="prose prose-invert prose-xs max-w-none space-y-1.5 whitespace-pre-line leading-relaxed">
                  {m.content}
                </div>
              </div>
              <span className="text-[9px] text-slate-500 font-mono mt-1 px-1">
                {m.role === 'user' ? 'You' : 'Himnova AI'}
              </span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-slate-400 p-2 text-xs font-mono">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-brand-cyan" />
              <span>Analyzing curriculum context & synthesizing response...</span>
            </div>
          )}
        </div>

        {/* Input Box */}
        <div className="p-3 border-t border-white/10 bg-alpine-950/90 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask AI Tutor anything about this lesson..."
              disabled={isLoading}
              className="flex-1 px-3.5 py-2 text-xs rounded-xl bg-alpine-900 border border-white/10 focus:border-brand-cyan focus:outline-none text-white placeholder:text-slate-500"
            />
            <button
              type="submit"
              disabled={isLoading || !input.trim()}
              className="p-2 rounded-xl bg-gradient-to-r from-blue-600 to-brand-cyan text-white disabled:opacity-40 hover:brightness-110 active:scale-95 transition-all shadow-md shadow-brand-cyan/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
