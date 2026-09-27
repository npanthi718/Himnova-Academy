# Himnova AI Career Launchpad - Security Architecture & Threat Model

## 1. Zero-Trust Security Model

Security is treated as a first-class citizen across all layers of the Himnova AI Career Launchpad.

---

## 2. Authentication & Credential Handling

- **Argon2id / Bcrypt Hashing**: All passwords in local database storage are hashed using high-work-factor algorithms. No plaintext passwords exist in runtime memory or code.
- **JWT Lifecycles**:
  - Access Token: 15-minute validity with HMAC-SHA256 signature.
  - Refresh Token: 7-day validity stored with cryptographic rotation on every renewal.
- **Role Isolation**: RBAC claims are verified on every incoming backend request using NestJS `JwtAuthGuard` and `RolesGuard`.
- **Environment Confidentiality**: All production keys (`DATABASE_URL`, `JWT_SECRET`, `GEMINI_API_KEY`) are stored in AWS Secrets Manager and never committed to source control.

---

## 3. Resource-Level Authorization Matrix

| Resource Domain | Super Admin | Assigned Trainer | Enrolled Student | Public / Unauth |
| :--- | :---: | :---: | :---: | :---: |
| **System Settings & Audit Logs** | Full Read/Write | Denied | Denied | Denied |
| **Course Creation & Publishing** | Full Read/Write | Denied | Denied | Denied |
| **Assigned Batch Management** | Full Read/Write | Read / Update Assigned | Denied | Denied |
| **Live Classroom Access** | Admin Monitor | Host Assigned | Join Enrolled Batch | Denied |
| **Assignment Submission & Review** | Full Override | Grade Assigned Batch | Submit Own Solution | Denied |
| **Private Lessons & Video Stream** | Full Access | Full Access | Enrolled Courses Only | Denied |
| **AI Tutor Syllabus Context** | Global Query | Assigned Courses | Enrolled Courses Only | Denied |
| **Certificate Verification** | Issue / Revoke | View Assigned | View Own Credential | Public Verify by ID |
| **Recruiter Portfolio** | Full Oversight | Endorse Assigned | Manage Own Profile | Public View by Slug |

---

## 4. Payment Security & Signature Verification

- **Server-Side Verification**: Course activations NEVER trigger based on client-side redirect URLs (`/payment/success`).
- **HMAC-SHA256 Signatures**: eSewa v2 signatures are validated on the backend against `ESEWA_SECRET` before marking payment as `COMPLETED`.
- **Idempotency Guard**: Repeated webhook triggers check for existing `PaymentTransaction` records, ensuring students are never double-charged or issued duplicate enrollments.

---

## 5. Audit Logging

Every privileged administrative, academic, or financial action generates an immutable `AuditLog` entry containing:
- `actorId` & `actorRole`
- `action` (e.g., `PAYMENT_VERIFIED`, `CERTIFICATE_ISSUED`, `ROLE_CHANGED`)
- `resourceType` & `resourceId`
- `metadata` (JSON payload)
- `ipAddress` & `userAgent`
- `createdAt` ISO timestamp
