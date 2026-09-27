import { z } from 'zod';
import { Role, CourseCategory, CourseDifficulty, LessonType, PaymentProviderType, CouponType } from '../constants';

export const LoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional().default(false),
});

export const RegisterSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters with letters & numbers'),
  phoneNumber: z.string().optional(),
  referralCode: z.string().optional(),
});

export const CreateCourseSchema = z.object({
  title: z.string().min(3, 'Course title is required'),
  slug: z.string().min(3, 'Slug is required'),
  subtitle: z.string().optional(),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.nativeEnum(CourseCategory),
  difficulty: z.nativeEnum(CourseDifficulty),
  durationHours: z.number().positive(),
  price: z.number().min(0),
  discountPrice: z.number().min(0).optional(),
  currency: z.string().default('NPR'),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  prerequisites: z.array(z.string()).default([]),
  learningOutcomes: z.array(z.string()).default([]),
  isPublished: z.boolean().default(false),
  isFeatured: z.boolean().default(false),
});

export const CreateModuleSchema = z.object({
  courseId: z.string().min(1),
  title: z.string().min(2, 'Module title is required'),
  description: z.string().optional(),
  orderIndex: z.number().int().default(0),
});

export const CreateLessonSchema = z.object({
  moduleId: z.string().min(1),
  title: z.string().min(2, 'Lesson title is required'),
  description: z.string().optional(),
  type: z.nativeEnum(LessonType),
  durationMinutes: z.number().int().positive(),
  videoUrl: z.string().optional(),
  pdfUrl: z.string().optional(),
  slideUrl: z.string().optional(),
  contentMarkdown: z.string().optional(),
  isFreePreview: z.boolean().default(false),
  orderIndex: z.number().int().default(0),
});

export const CreateAssignmentSchema = z.object({
  lessonId: z.string().min(1),
  batchId: z.string().optional(),
  title: z.string().min(3, 'Assignment title is required'),
  instructions: z.string().min(10, 'Detailed instructions are required'),
  dueDate: z.string().datetime().or(z.string()),
  maxScore: z.number().positive().default(100),
  rubricCriteria: z.array(z.string()).optional(),
});

export const SubmitAssignmentSchema = z.object({
  assignmentId: z.string().min(1),
  submissionText: z.string().optional(),
  fileUrl: z.string().optional(),
  githubUrl: z.string().url('Must be a valid GitHub URL').optional().or(z.literal('')),
  liveDemoUrl: z.string().url('Must be a valid Live Demo URL').optional().or(z.literal('')),
});

export const GradeAssignmentSchema = z.object({
  submissionId: z.string().min(1),
  score: z.number().min(0).max(100),
  feedback: z.string().min(2, 'Feedback comment is required'),
  status: z.enum(['APPROVED', 'REVISION_REQUIRED', 'GRADED']),
});

export const CreateBatchSchema = z.object({
  courseId: z.string().min(1),
  trainerId: z.string().min(1),
  name: z.string().min(2, 'Batch name is required'),
  code: z.string().min(2, 'Batch code is required'),
  startDate: z.string(),
  endDate: z.string(),
  maxStudents: z.number().int().positive().default(30),
});

export const MarkAttendanceSchema = z.object({
  batchId: z.string().min(1),
  date: z.string(),
  records: z.array(
    z.object({
      studentId: z.string().min(1),
      status: z.enum(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED']),
      notes: z.string().optional(),
    })
  ),
});

export const CreateCouponSchema = z.object({
  code: z.string().min(3, 'Coupon code must be at least 3 characters').toUpperCase(),
  type: z.nativeEnum(CouponType),
  value: z.number().positive(),
  minPurchaseAmount: z.number().min(0).optional(),
  maxDiscountAmount: z.number().positive().optional(),
  expiryDate: z.string(),
  usageLimit: z.number().int().positive().default(100),
  applicableCourseId: z.string().optional(),
});

export const CreatePortfolioProjectSchema = z.object({
  title: z.string().min(3, 'Project title is required'),
  description: z.string().min(10, 'Project description is required'),
  technologies: z.array(z.string()).min(1, 'Add at least one technology tag'),
  githubUrl: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  videoDemoUrl: z.string().url().optional().or(z.literal('')),
  thumbnailUrl: z.string().url().optional().or(z.literal('')),
  courseId: z.string().optional(),
  isPublished: z.boolean().default(true),
});

export const InitiatePaymentSchema = z.object({
  courseId: z.string().min(1),
  provider: z.nativeEnum(PaymentProviderType),
  couponCode: z.string().optional(),
});

export const VerifyPaymentSchema = z.object({
  orderId: z.string().min(1),
  provider: z.nativeEnum(PaymentProviderType),
  payload: z.record(z.any()),
});

export const AiPromptSchema = z.object({
  courseId: z.string().optional(),
  lessonId: z.string().optional(),
  prompt: z.string().min(1, 'Prompt is required'),
  context: z.enum(['COURSE_TUTOR', 'NOTES_SUMMARY', 'QUIZ_GENERATOR', 'RESUME_REVIEW', 'INTERVIEW_PREP', 'CAREER_ROADMAP']).default('COURSE_TUTOR'),
});
