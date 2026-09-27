# Himnova AI Career Launchpad - Architecture & System Design

## 1. Executive Summary

The **Himnova AI Career Launchpad** is an enterprise-grade technical learning, project execution, verified credentialing, and career progression platform engineered for **Himnova Technologies Pvt. Ltd.** (`https://himnovatech.com`).

The platform bridges foundational academic theory with real-world engineering through a 7-stage learning-to-placement pipeline (**LEARN → PRACTICE → BUILD → CERTIFY → PORTFOLIO → INTERVIEW → EARN**).

---

## 2. High-Level Monorepo Topology

```
himnova-career-launchpad/
├── frontend/                   # Next.js 14 (App Router, React 18, TypeScript, TailwindCSS)
│   ├── app/                    # Modern route groups: (auth), (dashboard), courses, learn, verify, portfolio
│   ├── components/             # Reusable UI tokens: Navbar, Footer, TelemetryPanel, AiTutorDrawer, PaymentModal
│   ├── lib/                    # AuthContext with 1-click Role Switcher, Axios apiClient with bearer interceptor
│   └── public/logos/           # Official Himnova brand vectors & raster assets
├── backend/                    # NestJS 10 (Modular TypeScript backend, Prisma ORM, JWT, Swagger)
│   ├── src/                    # 18 Domain modules (Auth, Users, Courses, Batches, AI, Payments, Attendance, etc.)
│   └── prisma/                 # 25 Prisma models, indexes, relational foreign keys, dev & prod seeds
├── shared/                     # @himnova/shared library with common schemas, enums, DTOs
├── infrastructure/             # Docker Compose, Nginx reverse proxy, AWS ECS Fargate definitions
└── docs/                       # Comprehensive engineering, security, API & deployment documentation
```

---

## 3. Core Architectural Pillars

### 3.1 Separation of Concerns & Zero-Trust Backend
- **Frontend Statelessness**: Next.js communicates strictly via authenticated REST APIs (`/api/v1/*`). No direct database access occurs in frontend components.
- **Authentication & Authorization**: Multi-tiered security model combining:
  1. JWT access tokens with short TTLs and secure refresh token rotation.
  2. Granular Role-Based Access Control (RBAC) across `SUPER_ADMIN`, `TRAINER`, and `STUDENT`.
  3. Pre-retrieval resource authorization (e.g., student course access filters, trainer assigned batch validation).

### 3.2 AI Architecture & RAG Pipeline
- **Provider-Agnostic AI Adapter**: Supports Google Gemini (`gemini-1.5-flash`), Anthropic Claude, OpenAI, and local LLM fallbacks.
- **Pre-Retrieval Authorization**: Before querying embeddings or course syllabus context, the AI module strictly validates that the requesting user possesses an active, paid enrollment in the target course.

### 3.3 Media & Secure Resource Delivery
- **Direct S3 Upload Pipeline**: Heavy media (video lectures, screen recordings) bypass application servers via presigned S3 URLs (`/api/v1/uploads/presign`).
- **Time-Limited Signed URLs**: Course PDFs, slides, and protected assets are served exclusively via short-lived cryptographic signed URLs following student authorization verification.

### 3.4 Double-Entry Financial & Referral Ledger
- **Idempotent Payment Webhooks**: Handles eSewa v2 signature hashes (`HMAC-SHA256`) and Khalti API verification server-side.
- **Immutable Ledger**: Student referral rewards and transaction histories are written to an immutable `RewardLedger` rather than simple mutable counter fields.

---

## 4. Subdomain & DNS Architecture

| Domain / Subdomain | Target Service | Purpose |
| :--- | :--- | :--- |
| `himnovatech.com` | Himnova Corporate Site | Official company landing & marketing portal (untouched) |
| `learn.himnovatech.com` | Next.js Frontend | AI Career Launchpad Web App |
| `api.himnovatech.com` | NestJS Backend API | Core REST API, Webhooks, Swagger at `/api/docs` |
| `cdn.himnovatech.com` | AWS CloudFront / S3 | HLS Video streaming, PDFs, assets |
