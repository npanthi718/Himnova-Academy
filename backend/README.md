# ⚙️ Himnova Academy — Backend REST API & Engine
> **Enterprise NestJS 10 API, Prisma ORM, Supabase PostgreSQL, Authentication & Payment Engine**  
> *Himnova Technologies Private Limited*

---

[![NestJS](https://img.shields.io/badge/NestJS-10-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![PostgreSQL](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Swagger](https://img.shields.io/badge/Documentation-Swagger%20OpenAPI-85EA2D?style=for-the-badge&logo=swagger&logoColor=black)](http://localhost:4000/api/docs)
[![JWT](https://img.shields.io/badge/Auth-JWT%20%2B%20RBAC-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white)](https://jwt.io/)

---

## 🏛️ Architectural Overview

The backend is built with **NestJS 10** following clean domain-driven modular architecture with **Prisma ORM** connecting directly to **Supabase PostgreSQL**.

---

## 📂 Modular Domain Structure

```
backend/
├── src/
│   ├── auth/                     # JWT Authentication, Password Hashing, RBAC Guards
│   ├── users/                    # User Profiles, Schedule Conflict Detection, Roles
│   ├── courses/                  # Course Catalog, Modules, Lessons, Prerequisites
│   ├── batches/                  # Cohort Batches, Enrolled Students, Capacity Management
│   ├── enrollments/              # Course Access, Progress Percentage, Lesson Completion
│   ├── live-classes/             # Live Class Scheduling, Zoom/Meet URLs, Timetables
│   ├── assignments/              # Homework Specifications, Deadlines, Attachments
│   ├── submissions/              # Student Submissions, Gradebook, Faculty Feedback
│   ├── attendance/               # Attendance Registers, Batch Marking, Student History
│   ├── payments/                 # eSewa, Khalti & Manual QR Code Verification Workflows
│   ├── coupons/                  # Discount Codes, Expirations, Usage Tracking
│   ├── referrals/                # Referral Codes, Commission Ledgers, Payouts
│   ├── certificates/             # Credential Issuance, Verification Hashes, Deletion
│   ├── portfolios/               # Public Showcase Projects & Tech Stack Items
│   ├── ai/                       # Google Gemini Pre-Retrieval AI Code Assistant
│   ├── analytics/                # Super Admin, Trainer & Student KPI Telemetry
│   ├── notifications/            # In-App Notification Bell System
│   ├── audit-logs/               # Immutable Security & Transaction Event Logs
│   └── common/                   # Global Guards, Interceptors, Filters, Decorators
│
└── prisma/
    ├── schema.prisma             # 25+ Relational PostgreSQL Database Models
    └── seed.ts                   # Comprehensive Production Database Seeder
```

---

## ⚙️ Environment Configuration

Create a `.env` in the `backend` folder (or configure in your cloud host):

```env
# Database: Supabase PostgreSQL Cloud
DATABASE_URL="postgresql://postgres:LMS%4012himnovatech@db.cdussmemwygcxjcktfme.supabase.co:5432/postgres?schema=public"

# Server Port & CORS
PORT=4000
FRONTEND_URL="http://localhost:3000"

# JWT Security Secrets
JWT_SECRET="himnova_academy_super_secret_jwt_key_2026_dev"
JWT_EXPIRES_IN="7d"

# Payment Gateways (Test credentials preset, swap for live keys before going public)
ESEWA_MERCHANT_CODE="EPAYTEST"
ESEWA_SECRET_KEY="8gBm/:&EnhH.1/q"
ESEWA_VERIFY_URL="https://rc-epay.esewa.com.np/api/epay/main/v2/form"

KHALTI_PUBLIC_KEY="test_public_key_dc74e0fd57cb46cd93832a8150057f7b"
KHALTI_SECRET_KEY="test_secret_key_f59e8b7d18b24b978622308e28583c29"
KHALTI_VERIFY_URL="https://a.khalti.com/api/v2/epayment/lookup/"

# AI Code Companion (Optional for Gemini 2.0 Tutor)
GEMINI_API_KEY=""
```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Sync schema to Supabase Cloud Database
npx prisma db push

# Seed initial courses, trainers, students & batches
npm run prisma:seed

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start:prod
```

---

## 📖 API Documentation (Swagger)

Interactive Swagger API explorer is accessible at:
- **Local**: `http://localhost:4000/api/docs`
- Includes schemas, authentication buttons, and request/response models for all 18 domains.

---

*© 2026 Himnova Technologies Private Limited. All rights reserved.*
