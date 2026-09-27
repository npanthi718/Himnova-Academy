# 🌐 Himnova Academy — Frontend Web Application
> **Modern Next.js 14 LMS User Interface, Video Classroom & Certification Engine**  
> *Himnova Technologies Private Limited*

---

[![Next.js](https://img.shields.io/badge/Next.js-14.2%20(App%20Router)-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Lucide Icons](https://img.shields.io/badge/Icons-Lucide%20React-F97316?style=for-the-badge)](https://lucide.dev/)

---

## 🎨 Overview

The frontend is a responsive, high-performance web application constructed with **Next.js 14 App Router**, **TailwindCSS**, and **TypeScript**. It features a modern deep-space navy aesthetic (`#070F1E`, `#0B132B`, `#00D9FF`) tailored for engineering workflows, interactive classrooms, and cryptographic credential verification.

---

## 📂 Directory Structure

```
frontend/
├── app/
│   ├── (auth)/                   # Login, Register, Forgot Password
│   ├── (dashboard)/
│   │   ├── admin/                # Super Admin: Courses, Batches, Payments, Certificates, Users, Coupons
│   │   ├── trainer/              # Trainer: Assigned Cohorts, Attendance, Gradebook, Live Classes
│   │   └── student/              # Student: My Courses, Live Classes, Assignments, Attendance, Referrals, Billing
│   ├── courses/                  # Public Course Catalog & Curriculum Outlines
│   ├── learn/[slug]/             # Universal In-Frame Classroom Player & Syllabus
│   ├── verify/[certificateId]/   # Public Cryptographic Certificate Lookup
│   ├── portfolio/[username]/     # Student Public Engineering Portfolio
│   ├── layout.tsx                # Root layout, Fonts & Global Providers
│   └── page.tsx                  # Public Landing Page & Course Explorer
│
├── components/
│   ├── brand/                    # HimnovaLogo, Official Academy Seals
│   ├── certificate/              # OfficialCertificate (A4 Landscape Print Engine)
│   ├── layout/                   # DashboardLayout, Sidebar, Navbar, Mobile Navigation
│   ├── payment/                  # PaymentModal (eSewa, Khalti, QR Code Verification)
│   └── ai/                       # AiTutorDrawer (Google Gemini Code Companion)
│
├── lib/
│   ├── api-client.ts             # Type-safe Axios/Fetch API client
│   ├── auth-context.tsx          # JWT Authentication & Role-Based Access Context
│   ├── modal-context.tsx         # Centered Confirmation & Alert Dialog System
│   └── utils.ts                  # Formatters, Date helpers & Styling utilities
│
└── public/
    └── logos/                    # Official Himnova Academy vectors, QR codes, stamps, and signatures
```

---

## ⚙️ Environment Configuration

Create a `.env.local` or set these in your **Vercel Project Settings**:

```env
# Backend NestJS API Endpoint
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1

# Brand and Platform Metadata
NEXT_PUBLIC_APP_NAME=Himnova Academy
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **For Production (Vercel)**:  
> Change `NEXT_PUBLIC_API_URL` to your live deployed backend URL (e.g. `https://api.learn.himnovatech.com/api/v1` or Render URL).

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build production bundle
npm run build

# Start production server
npm run start
```

---

## 🖨️ Certificate Print Engine

The certificate renderer ([`OfficialCertificate.tsx`](./components/certificate/OfficialCertificate.tsx)) includes an isolated iframe print system:
- **Paper Size**: Exact A4 Landscape (`297mm × 210mm`).
- **Typography**: Dynamic font scaling based on student name and commendation text length.
- **Authenticity**: Includes live scannable QR verification code, official circular academy logo, embossed seal, and transparent executive signature.

---

*© 2026 Himnova Technologies Private Limited. All rights reserved.*
