# Himnova AI Career Launchpad - REST API Specification

All endpoints are versioned under `/api/v1` and authenticated using standard HTTP Bearer Tokens (`Authorization: Bearer <access_token>`).

Interactive OpenAPI/Swagger documentation is served at `/api/docs`.

---

## 1. Authentication & IAM (`/api/v1/auth`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user with email & password | Public |
| `POST` | `/api/v1/auth/register` | Register new student account | Public |
| `POST` | `/api/v1/auth/refresh` | Rotate expired access token with refresh token | Public |
| `GET` | `/api/v1/auth/me` | Fetch authenticated profile and assigned permissions | Authenticated |

---

## 2. Course Catalog & Player (`/api/v1/courses`, `/api/v1/lessons`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/courses` | List published courses with category and search filters | Public |
| `GET` | `/api/v1/courses/:slug` | Retrieve course details, curriculum syllabus, and pricing | Public |
| `POST` | `/api/v1/courses` | Create new curriculum course | `SUPER_ADMIN` |
| `PATCH` | `/api/v1/courses/:id` | Update course details, pricing, and publish status | `SUPER_ADMIN` |
| `GET` | `/api/v1/lessons/:id` | Fetch lesson content (pre-checks enrollment) | Enrolled / Trainer / Admin |
| `POST` | `/api/v1/lessons/:id/progress` | Update video timestamp and completion percentage | Enrolled Student |

---

## 3. Cohort Batches & Live Classes (`/api/v1/batches`, `/api/v1/live-classes`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/batches` | List batches (filtered by trainer/student assignment) | Authenticated |
| `POST` | `/api/v1/batches` | Create new student cohort batch | `SUPER_ADMIN` |
| `GET` | `/api/v1/live-classes` | List upcoming Zoom/Meet classes for user's batch | Enrolled / Trainer / Admin |
| `POST` | `/api/v1/live-classes` | Schedule new live class session | `SUPER_ADMIN`, `TRAINER` |

---

## 4. Assignments & Reviews (`/api/v1/assignments`, `/api/v1/submissions`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/assignments` | List assignments across enrolled/assigned courses | Authenticated |
| `POST` | `/api/v1/assignments` | Create practical lab assignment | `SUPER_ADMIN`, `TRAINER` |
| `POST` | `/api/v1/submissions` | Submit code solution (GitHub/Live URL/remarks) | Enrolled Student |
| `GET` | `/api/v1/submissions/trainer/pending` | List pending submission grading queue | `SUPER_ADMIN`, `TRAINER` |
| `PATCH` | `/api/v1/submissions/:id/review` | Grade and write code review feedback | `SUPER_ADMIN`, `TRAINER` |

---

## 5. Payments & Financial Transactions (`/api/v1/payments`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/payments/initiate` | Generate signed payment order (eSewa / Khalti) | Authenticated |
| `POST` | `/api/v1/payments/verify` | Server-side verification & course activation | Authenticated |
| `GET` | `/api/v1/payments/admin/all` | List all platform financial transactions | `SUPER_ADMIN` |

---

## 6. Certificates & Portfolio (`/api/v1/certificates`, `/api/v1/portfolios`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/v1/certificates` | List student's earned digital certificates | Enrolled Student |
| `GET` | `/api/v1/certificates/verify/:certId`| Public verification of tamper-proof credential | Public |
| `POST` | `/api/v1/certificates/issue` | Issue new certificate upon graduation signoff | `SUPER_ADMIN`, `TRAINER` |
| `GET` | `/api/v1/portfolios/:username` | Fetch public student recruiter portfolio | Public |
| `POST` | `/api/v1/portfolios/me` | Update student portfolio profile and skills | Enrolled Student |

---

## 7. AI Learning Tutor (`/api/v1/ai`)

| Method | Endpoint | Description | Roles |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/v1/ai/tutor` | Query syllabus-grounded AI learning assistant | Enrolled Student |
| `POST` | `/api/v1/ai/code-review` | Request automated AI code explanation & review | Enrolled Student |
