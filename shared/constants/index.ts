export enum Role {
  SUPER_ADMIN = 'SUPER_ADMIN',
  TRAINER = 'TRAINER',
  STUDENT = 'STUDENT',
}

export enum CourseCategory {
  AI_DATA = 'AI & Generative AI',
  FULL_STACK = 'Full Stack Web Development',
  CLOUD_DEVOPS = 'Cloud & DevOps Automation',
  CYBERSECURITY = 'Cybersecurity & SOC',
  PYTHON_DATA = 'Python & Data Engineering',
  MOBILE = 'Mobile App Engineering',
}

export enum CourseDifficulty {
  BEGINNER = 'BEGINNER',
  INTERMEDIATE = 'INTERMEDIATE',
  ADVANCED = 'ADVANCED',
  ENTERPRISE = 'ENTERPRISE',
}

export enum LessonType {
  VIDEO = 'VIDEO',
  PDF = 'PDF',
  SLIDES = 'SLIDES',
  IMAGE = 'IMAGE',
  DOCUMENT = 'DOCUMENT',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  LIVE = 'LIVE',
}

export enum AssignmentStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  REVISION_REQUIRED = 'REVISION_REQUIRED',
  APPROVED = 'APPROVED',
  GRADED = 'GRADED',
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  EXCUSED = 'EXCUSED',
}

export enum PaymentProviderType {
  ESEWA = 'ESEWA',
  KHALTI = 'KHALTI',
  STRIPE = 'STRIPE',
  BANK_TRANSFER = 'BANK_TRANSFER',
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
}

export enum CouponType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED_AMOUNT = 'FIXED_AMOUNT',
}

export enum ReferralStatus {
  PENDING = 'PENDING',
  QUALIFIED = 'QUALIFIED',
  REWARDED = 'REWARDED',
  EXPIRED = 'EXPIRED',
}

export enum CareerStage {
  LEARN = 'LEARN',
  PRACTICE = 'PRACTICE',
  BUILD = 'BUILD',
  CERTIFY = 'CERTIFY',
  PORTFOLIO = 'PORTFOLIO',
  INTERVIEW = 'INTERVIEW',
  EARN = 'EARN',
}

export enum AuditAction {
  LOGIN_SUCCESS = 'LOGIN_SUCCESS',
  LOGIN_FAILED = 'LOGIN_FAILED',
  LOGOUT = 'LOGOUT',
  COURSE_CREATED = 'COURSE_CREATED',
  COURSE_UPDATED = 'COURSE_UPDATED',
  COURSE_PUBLISHED = 'COURSE_PUBLISHED',
  BATCH_CREATED = 'BATCH_CREATED',
  TRAINER_ASSIGNED = 'TRAINER_ASSIGNED',
  STUDENT_ENROLLED = 'STUDENT_ENROLLED',
  PAYMENT_VERIFIED = 'PAYMENT_VERIFIED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',
  ASSIGNMENT_SUBMITTED = 'ASSIGNMENT_SUBMITTED',
  ASSIGNMENT_GRADED = 'ASSIGNMENT_GRADED',
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  CERTIFICATE_REVOKED = 'CERTIFICATE_REVOKED',
  ROLE_CHANGED = 'ROLE_CHANGED',
  SETTINGS_UPDATED = 'SETTINGS_UPDATED',
}

export const HIMNOVA_BRAND = {
  name: 'Himnova Technologies Pvt. Ltd.',
  brandName: 'Himnova',
  tagline: 'The Next Era of Cloud Intelligence',
  launchpadTitle: 'HIMNOVA AI CAREER LAUNCHPAD',
  launchpadSubtitle: 'Learn. Build. Certify. Launch Your Career.',
  website: 'https://himnovatech.com',
  domain: 'learn.himnovatech.com',
  supportEmail: 'support.himnovatech@gmail.com',
  address: 'Baneshwor-31, Kathmandu, Nepal',
  phone: '+977-9823009467',
  currency: 'NPR',
  currencySymbol: 'Rs. ',
};

export const DEMO_CREDENTIALS = {
  admin: {
    email: 'admin@himnova.com',
    role: Role.SUPER_ADMIN,
    name: 'Himnova Principal Admin',
  },
  trainer: {
    email: 'trainer@himnova.com',
    role: Role.TRAINER,
    name: 'Sushil Panthi (Lead Trainer)',
  },
  student: {
    email: 'student@himnova.com',
    role: Role.STUDENT,
    name: 'Aayush Sharma (AI Fellow)',
  },
};
