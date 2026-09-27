# Himnova AI Career Launchpad - Quality Assurance & Test Report

## 1. Test Suite Coverage & Verification Matrix

The test framework encompasses unit, integration, RBAC security, and end-to-end browser workflows.

---

## 2. Automated & Manual Test Cases

| Test Case ID | Scope | Expected Behavior | Status |
| :--- | :--- | :--- | :---: |
| **TC-AUTH-01** | IAM & JWT | Valid credentials issue access + refresh JWT pair | **PASSED** |
| **TC-AUTH-02** | Security | Invalid passwords return HTTP 401 with standard error DTO | **PASSED** |
| **TC-RBAC-01** | Authorization | Student attempting admin routes (`/api/v1/users`) receives HTTP 403 | **PASSED** |
| **TC-RBAC-02** | Multi-Tenancy | Trainer A cannot modify Trainer B's batch assignments | **PASSED** |
| **TC-CRS-01** | Content Delivery | Enrolled student can fetch lesson video & PDFs | **PASSED** |
| **TC-CRS-02** | Resource Auth | Unenrolled student cannot access private lesson player | **PASSED** |
| **TC-PAY-01** | Financial Engine | eSewa HMAC signature verification triggers enrollment creation | **PASSED** |
| **TC-PAY-02** | Idempotency | Duplicate payment callbacks do not duplicate enrollments | **PASSED** |
| **TC-CERT-01** | Credentialing | Generated certificate ID is publicly resolvable via `/verify/:id` | **PASSED** |
| **TC-PORT-01** | Showcase | Student portfolio profile is publicly accessible via `/portfolio/:user` | **PASSED** |
| **TC-AI-01** | AI Pre-Retrieval | AI Tutor enforces enrollment check before injecting syllabus context | **PASSED** |
| **TC-AUD-01** | Compliance | Administrative and financial operations generate immutable `AuditLog` | **PASSED** |

---

## 3. End-to-End User Verification

### 3.1 Demo Credentials
- **Super Admin**: `admin@himnova.com` / `Admin@123`
- **Lead Trainer**: `trainer@himnova.com` / `Trainer@123`
- **Enrolled Student**: `student@himnova.com` / `Student@123`

### 3.2 Quick Demo Switcher
A 1-click **Demo Role Switcher** dropdown is integrated into the top navigation bar, enabling instant role simulation and token injection for review.
