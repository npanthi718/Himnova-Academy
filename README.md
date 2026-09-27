# 🚀 HIMNOVA ACADEMY — Enterprise LMS & AI Career Launchpad
> **Next-Generation Full-Stack LMS, Live Cohorts, AI Code Companion, Cryptographic Credentialing & Career Pipeline**  
> *Developed under Himnova Technologies Private Limited (Govt. Regd. 342152/080/081 • Kathmandu, Nepal)* • [himnovatech.com](https://himnovatech.com)

---

[![Next.js](https://img.shields.io/badge/Frontend-Next.js%2014%20App%20Router-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![NestJS](https://img.shields.io/badge/Backend-NestJS%2010-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![PostgreSQL](https://img.shields.io/badge/Database-Supabase%20PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/ORM-Prisma%205-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![TailwindCSS](https://img.shields.io/badge/Styling-TailwindCSS%203-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 🌟 Executive Summary

**Himnova Academy** is a modern, enterprise-grade Learning Management System (LMS) and technical career launchpad designed for high-concurrency education, interactive live cohorts, AI tutoring, verified certification, and student portfolio showcase.

Built around the signature **Himnova 7-Stage Career Launch Progression**:
```
  [1. LEARN] ──► [2. PRACTICE] ──► [3. BUILD] ──► [4. CERTIFY] ──► [5. PORTFOLIO] ──► [6. INTERVIEW] ──► [7. EARN]
  Live Cohorts    Code Labs &      Capstone        Cryptographic     Recruiter-Ready    Mock Tech       Freelancing &
  & Lectures      Quizzes          Projects        QR Verification   Showcase Showcase  Rounds          Job Placement
```

---

## 🏛️ Monorepo Architecture

```
himnova-ai-career-launchpad/
│
├── frontend/                     # Next.js 14 (App Router, React 18, Tailwind CSS)
│   ├── app/                      # 30+ dynamic routes (Landing, Classroom Player, Hubs, Admin/Trainer/Student)
│   ├── components/               # Brand vectors (HimnovaLogo), Certificates, Telemetry UI, Modals
│   ├── lib/                      # Auth Context, Modal Context, API Client, Utils
│   └── public/logos/             # High-res logos, official seals, and signatures
│
├── backend/                      # NestJS 10 (TypeScript, Prisma ORM, Swagger, JWT, RBAC)
│   ├── src/                      # 18 Modular domains (Auth, Courses, Batches, Live Classes, AI, Payments)
│   ├── prisma/                   # Schema with 25+ relational models & comprehensive seed scripts
│   └── scripts/                  # Cloud database helpers and test utilities
│
├── shared/                       # @himnova/shared: Shared domain types, contracts & validation schemas
├── infrastructure/               # Docker Compose, Nginx configurations, AWS templates
└── docs/                         # Architecture, API endpoints, Database schema, Security & Deployment guides
```

---

## ⚡ Core Features & Capabilities

### 1. 🎓 Interactive Video & Live Cohort Classroom (`/learn/[slug]`)
- **Universal Player**: Embedded video lectures (speed controls 0.75x–2.0x), Google Drive previews, Zoom cloud recordings, and presentation slide decks.
- **Capstone Lab Submissions**: Direct repository/Colab link submission with real-time grading from faculty mentors.
- **AI Code Companion**: Embedded 24/7 AI tutor powered by Google Gemini for debugging and architectural assistance.

### 2. 🛡️ Role-Based Access Control (RBAC)
- **`SUPER_ADMIN`**: Full platform control, student admissions, manual QR payment verification, coupon codes, and audit logs.
- **`TRAINER`**: Cohort batch rosters, live class scheduling, daily attendance marking, and assignment reviews.
- **`STUDENT`**: Interactive classroom, progress tracker, assignment submissions, live class schedule, referral rewards, and billing invoices.

### 3. 📜 Verifiable Certificates & Official Registry (`/verify/[certificateNumber]`)
- Cryptographically verifiable digital credentials with dynamic QR codes.
- Isolated A4 Landscape vector printing layout with official corporate seal and transparent executive signature.

### 4. 💳 Multi-Channel Payment Engine
- Support for **eSewa** (`HMAC-SHA256` signature verification), **Khalti**, and **Manual QR Payment Verification**.
- Multi-tier referral system with commission payouts and coupon discounts.

---

## 🔑 Demo Access Credentials

| Role | Email | Password | Access Level |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@himnova.com` | `Admin@123` | Full Administrative & Financial Authority |
| **Lead Trainer** | `trainer@himnova.com` | `Trainer@123` | Cohorts, Attendance, Gradebook, Live Classes |
| **Student** | `student@himnova.com` | `Student@123` | Classroom, Assignments, Billing, Certificates |

> 💡 *Quick Role Switching is also available from the navigation bar in demo mode.*

---

## 🛠️ Local Development Setup

### 1. Prerequisites
- **Node.js**: v18.0+ or v20 LTS
- **npm**: v9.0+
- **Database**: Supabase PostgreSQL cloud database (already pre-configured)

### 2. Installation & Bootstrap
```bash
# Clone the repository
git clone https://github.com/your-username/himnova-academy.git
cd himnova-academy

# Install dependencies across monorepo
npm run bootstrap

# Build shared contracts
npm run build:shared

# Generate Prisma Client & Sync Database
npm run prisma:generate --prefix backend
npm run prisma:seed --prefix backend

# Launch both Backend (Port 4000) and Frontend (Port 3000)
npm run dev
```

### 3. Service Ports
- **Frontend App**: `http://localhost:3000`
- **Backend API**: `http://localhost:4000/api/v1`
- **Swagger Documentation**: `http://localhost:4000/api/docs`
- **Health Check**: `http://localhost:4000/api/v1/health`

---

## 🌐 Production Deployment Guide

### A. Deploy Frontend on Vercel
1. Import this repository into **[Vercel](https://vercel.com/)**.
2. Select **Root Directory**: `frontend`.
3. Framework Preset: `Next.js`.
4. Configure Environment Variables:
   - `NEXT_PUBLIC_API_URL` = `https://<YOUR_BACKEND_URL>/api/v1`
   - `NEXT_PUBLIC_APP_NAME` = `Himnova Academy`
   - `NEXT_PUBLIC_APP_URL` = `https://learn.himnovatech.com`
5. Click **Deploy**.

### B. Deploy Backend (Render, Railway, VPS, or Docker)
1. Point your service to the `backend` directory.
2. **Build Command**:
   ```bash
   npm install && npx prisma generate && npm run build
   ```
3. **Start Command**:
   ```bash
   npm run start:prod
   ```
4. Configure Environment Variables (from `backend/.env.production`):
   - `DATABASE_URL` = `postgresql://postgres:LMS%4012himnovatech@db.cdussmemwygcxjcktfme.supabase.co:5432/postgres?schema=public`
   - `JWT_SECRET` = `himnova_academy_prod_jwt_secret_2026_secure`
   - `FRONTEND_URL` = `https://learn.himnovatech.com` (or your Vercel URL)

---

## 🔒 Security & Best Practices

- **Zero-Trust Token Management**: Short-lived access JWTs with refresh rotation.
- **Strict Pre-Retrieval Checks**: API endpoints verify user enrollment before granting access to lessons, attachments, or AI queries.
- **OWASP Compliant**: Helmet security headers, CORS origin whitelisting, input sanitation via `class-validator`, and SQL injection protection via Prisma ORM parameterized queries.

---

## 📄 License & Intellectual Property

*© 2026 Himnova Technologies Private Limited. All rights reserved.*  
*Unauthorized copying, modification, or distribution of this software is strictly prohibited.*
