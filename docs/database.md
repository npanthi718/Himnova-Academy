# Himnova AI Career Launchpad - Database Schema & Data Models

The data layer uses **PostgreSQL** in production (and SQLite `dev.db` for local self-contained execution) managed via **Prisma ORM**.

---

## 1. Relational Entity Overview

```
                      ┌───────────────┐
                      │     User      │
                      └───────┬───────┘
                              │
         ┌────────────────────┼────────────────────┐
         │ 1:N                │ 1:N                │ 1:N
         ▼                    ▼                    ▼
   ┌───────────┐        ┌───────────┐        ┌───────────┐
   │Enrollment │        │Submission │        │Certificate│
   └─────┬─────┘        └─────┬─────┘        └───────────┘
         │ N:1                │ N:1
         ▼                    ▼
   ┌───────────┐        ┌───────────┐
   │  Course   │◄───────┤Assignment │
   └─────┬─────┘ 1:N    └───────────┘
         │ 1:N
         ▼
   ┌───────────┐
   │  Module   │
   └─────┬─────┘
         │ 1:N
         ▼
   ┌───────────┐
   │  Lesson   │
   └───────────┘
```

---

## 2. Core Entities & Attributes

### 2.1 User & Access Control
- `User`: Primary identity (`id`, `email`, `passwordHash`, `fullName`, `role` [`SUPER_ADMIN`, `TRAINER`, `STUDENT`], `isActive`, `referralCode`, `referredById`).
- `AuditLog`: Immutable operations log (`id`, `actorId`, `action`, `resourceType`, `resourceId`, `metadata`, `ipAddress`, `userAgent`).

### 2.2 Academic Curriculum
- `Course`: Program catalog (`id`, `title`, `slug`, `subtitle`, `description`, `thumbnailUrl`, `category`, `level`, `price`, `discountPrice`, `currency`, `isPublished`, `learningOutcomes`, `prerequisites`).
- `CourseModule`: Milestone structure (`id`, `courseId`, `title`, `description`, `sortOrder`).
- `Lesson`: Learning content (`id`, `moduleId`, `title`, `type` [`VIDEO`, `PDF`, `SLIDES`, `QUIZ`, `ASSIGNMENT`, `ARTICLE`], `contentUrl`, `durationMinutes`, `sortOrder`, `isFreePreview`).
- `LessonProgress`: Per-student completion state (`id`, `userId`, `lessonId`, `isCompleted`, `lastPositionSeconds`, `completedAt`).

### 2.3 Cohorts, Live Classes & Attendance
- `Batch`: Class cohorts (`id`, `courseId`, `name`, `code`, `startDate`, `endDate`, `status`, `maxStudents`).
- `BatchStudent`: Enrolled student mapping (`id`, `batchId`, `studentId`, `status`).
- `BatchTrainer`: Assigned instructor mapping (`id`, `batchId`, `trainerId`).
- `LiveClass`: Scheduled video rooms (`id`, `batchId`, `courseId`, `trainerId`, `title`, `startTime`, `endTime`, `meetingUrl`, `provider`, `status`).
- `Attendance`: Cohort attendance register (`id`, `batchId`, `studentId`, `liveClassId`, `date`, `status` [`PRESENT`, `ABSENT`, `LATE`, `EXCUSED`], `notes`).

### 2.4 Assignments & Reviews
- `Assignment`: Engineering projects (`id`, `courseId`, `moduleId`, `title`, `description`, `maxScore`, `dueDate`).
- `AssignmentSubmission`: Student code delivery (`id`, `assignmentId`, `studentId`, `status` [`DRAFT`, `SUBMITTED`, `UNDER_REVIEW`, `REVISION_REQUIRED`, `APPROVED`, `GRADED`], `content`, `githubUrl`, `liveUrl`, `score`, `feedback`, `gradedById`, `gradedAt`).

### 2.5 Payments, Coupons & Referrals
- `PaymentTransaction`: Financial transaction records (`id`, `userId`, `courseId`, `amount`, `currency`, `provider` [`ESEWA`, `KHALTI`, `STRIPE`], `status`, `transactionId`, `orderId`, `payload`).
- `Coupon`: Promotional vouchers (`id`, `code`, `discountType`, `discountValue`, `maxUses`, `usedCount`, `expiresAt`, `isActive`).
- `RewardLedger`: Immutable double-entry referral credits (`id`, `userId`, `referralId`, `amount`, `type` [`CREDIT`, `DEBIT`, `PAYOUT`], `description`).

### 2.6 Verified Credentials & Recruiter Portfolio
- `Certificate`: Tamper-proof certificate (`id`, `certificateNumber`, `userId`, `courseId`, `studentName`, `courseName`, `issueDate`, `verificationUrl`, `qrCodeUrl`, `metadata`).
- `Portfolio`: Recruiter portfolio profiles (`id`, `userId`, `username`, `title`, `bio`, `skills`, `githubUrl`, `linkedinUrl`, `websiteUrl`, `isPublic`).
- `PortfolioProject`: Showcase case studies (`id`, `portfolioId`, `title`, `description`, `technologies`, `githubUrl`, `liveUrl`, `imageUrl`).

---

## 3. Database Indexes & Constraints

- `User(email)`: Unique constraint & B-Tree index.
- `Course(slug)`: Unique constraint & B-Tree index.
- `Certificate(certificateNumber)`: Unique constraint.
- `Portfolio(username)`: Unique constraint.
- `Attendance(batchId, studentId, date)`: Composite index for fast roster rendering.
