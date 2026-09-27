import {
  Role,
  CourseCategory,
  CourseDifficulty,
  LessonType,
  AssignmentStatus,
  AttendanceStatus,
  PaymentProviderType,
  PaymentStatus,
  CouponType,
  ReferralStatus,
  CareerStage,
  AuditAction,
} from '../constants';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  avatarUrl?: string | null;
  phoneNumber?: string | null;
  bio?: string | null;
  referralCode: string;
  referredById?: string | null;
  isMfaEnabled: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn: number;
  user: User;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  subtitle?: string | null;
  description: string;
  thumbnailUrl?: string | null;
  category: CourseCategory;
  difficulty: CourseDifficulty;
  durationHours: number;
  price: number;
  discountPrice?: number | null;
  currency: string;
  isPublished: boolean;
  isFeatured: boolean;
  prerequisites: string[];
  learningOutcomes: string[];
  syllabus?: string | null;
  modules?: CourseModule[];
  createdAt: string;
  updatedAt: string;
}

export interface CourseModule {
  id: string;
  courseId: string;
  title: string;
  description?: string | null;
  orderIndex: number;
  lessons?: Lesson[];
  createdAt: string;
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description?: string | null;
  type: LessonType;
  orderIndex: number;
  durationMinutes: number;
  videoUrl?: string | null;
  pdfUrl?: string | null;
  slideUrl?: string | null;
  contentMarkdown?: string | null;
  isFreePreview: boolean;
  resources?: LessonResource[];
  quizQuestions?: QuizQuestion[];
  assignment?: Assignment | null;
  createdAt: string;
}

export interface LessonResource {
  id: string;
  lessonId: string;
  title: string;
  fileType: string;
  fileSize: number;
  fileUrl: string;
  isDownloadable: boolean;
}

export interface QuizQuestion {
  id: string;
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation?: string;
}

export interface Batch {
  id: string;
  courseId: string;
  course?: Course;
  name: string;
  code: string;
  startDate: string;
  endDate: string;
  maxStudents: number;
  isActive: boolean;
  trainerId: string;
  trainer?: User;
  studentsCount?: number;
  createdAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  user?: User;
  courseId: string;
  course?: Course;
  batchId?: string | null;
  batch?: Batch | null;
  progressPercentage: number;
  completedLessonsCount: number;
  totalLessonsCount: number;
  isCompleted: boolean;
  completedAt?: string | null;
  createdAt: string;
}

export interface LessonProgress {
  id: string;
  userId: string;
  lessonId: string;
  isCompleted: boolean;
  lastPositionSeconds: number;
  completedAt?: string | null;
  updatedAt: string;
}

export interface Assignment {
  id: string;
  lessonId: string;
  batchId?: string | null;
  title: string;
  instructions: string;
  dueDate: string;
  maxScore: number;
  rubricCriteria?: string[];
  submissions?: AssignmentSubmission[];
  createdAt: string;
}

export interface AssignmentSubmission {
  id: string;
  assignmentId: string;
  assignment?: Assignment;
  studentId: string;
  student?: User;
  submissionText?: string | null;
  fileUrl?: string | null;
  githubUrl?: string | null;
  liveDemoUrl?: string | null;
  status: AssignmentStatus;
  score?: number | null;
  trainerFeedback?: string | null;
  attemptNumber: number;
  submittedAt: string;
  reviewedAt?: string | null;
  reviewedById?: string | null;
  reviewedBy?: User | null;
}

export interface AttendanceRecord {
  id: string;
  batchId: string;
  studentId: string;
  student?: User;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  notes?: string | null;
}

export interface LiveClass {
  id: string;
  batchId: string;
  batch?: Batch;
  trainerId: string;
  trainer?: User;
  title: string;
  description?: string | null;
  provider: 'ZOOM' | 'GOOGLE_MEET' | 'CUSTOM';
  meetingUrl: string;
  meetingPassword?: string | null;
  startTime: string;
  endTime: string;
  isCompleted: boolean;
}

export interface PaymentTransaction {
  id: string;
  orderId: string;
  userId: string;
  user?: User;
  courseId: string;
  course?: Course;
  amount: number;
  currency: string;
  provider: PaymentProviderType;
  providerTransactionId?: string | null;
  status: PaymentStatus;
  couponCode?: string | null;
  discountAmount?: number | null;
  rawCallbackPayload?: string | null;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  type: CouponType;
  value: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  expiryDate: string;
  usageLimit: number;
  usageCount: number;
  isActive: boolean;
  applicableCourseId?: string | null;
}

export interface ReferralRecord {
  id: string;
  referrerId: string;
  referrer?: User;
  refereeId: string;
  referee?: User;
  status: ReferralStatus;
  rewardAmount: number;
  currency: string;
  courseId: string;
  course?: Course;
  createdAt: string;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  studentId: string;
  student?: User;
  courseId: string;
  course?: Course;
  batchId?: string | null;
  issueDate: string;
  completionScore?: number | null;
  qrCodeUrl: string;
  verificationUrl: string;
  signatoryName: string;
  signatoryTitle: string;
  isValid: boolean;
}

export interface PortfolioProject {
  id: string;
  studentId: string;
  title: string;
  slug: string;
  description: string;
  technologies: string[];
  thumbnailUrl?: string | null;
  githubUrl?: string | null;
  liveUrl?: string | null;
  videoDemoUrl?: string | null;
  courseId?: string | null;
  course?: Course | null;
  trainerFeedback?: string | null;
  isPublished: boolean;
  createdAt: string;
}

export interface CareerMilestone {
  stage: CareerStage;
  title: string;
  description: string;
  isUnlocked: boolean;
  isCompleted: boolean;
  progressPercentage: number;
  actionUrl: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'INFO' | 'SUCCESS' | 'WARNING' | 'ALERT';
  isRead: boolean;
  linkUrl?: string | null;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  actorId?: string | null;
  actorEmail?: string | null;
  actorRole?: Role | null;
  action: AuditAction;
  resourceType: string;
  resourceId?: string | null;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
}

export interface AdminAnalyticsSummary {
  totalStudents: number;
  activeStudents: number;
  activeCourses: number;
  activeBatches: number;
  monthlyRevenueNpr: number;
  totalRevenueNpr: number;
  pendingPaymentsCount: number;
  averageAttendanceRate: number;
  courseCompletionRate: number;
  assignmentCompletionRate: number;
  certificatesIssuedCount: number;
  activeReferralsCount: number;
  revenueByMonth: { month: string; amount: number }[];
  enrollmentsTrend: { month: string; count: number }[];
  coursePopularity: { courseTitle: string; students: number }[];
  attendanceDistribution: { present: number; absent: number; late: number };
}
