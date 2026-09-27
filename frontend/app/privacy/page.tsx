import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShieldCheck, Lock, Eye, FileText, ArrowLeft } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col justify-between">
      <Navbar />

      <main className="flex-1 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <div className="space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-brand-cyan hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Himnova Home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            Himnova Data Protection
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Privacy Policy & Data Governance
          </h1>
          <p className="text-sm text-slate-400">
            Last updated: September 2026 • Himnova Technologies Pvt. Ltd.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-brand-cyan" />
              1. Information We Collect
            </h2>
            <p>
              Himnova Technologies Pvt. Ltd. collects only the minimum necessary information required to deliver personalized software engineering education, verify student identities for certificate issuance, process payments securely, and maintain academic audit logs.
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li><strong>Account Information:</strong> Name, professional email address, hashed passwords, and contact preferences.</li>
              <li><strong>Academic Records:</strong> Course progress, code lab submissions, attendance logs, and project evaluations.</li>
              <li><strong>Transaction Data:</strong> Payment gateway identifiers (eSewa / Khalti transaction IDs) and coupon redemption logs. We do not store raw banking passwords or credit card numbers.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Eye className="w-5 h-5 text-brand-cyan" />
              2. How We Protect Your Data
            </h2>
            <p>
              We implement defense-in-depth cybersecurity controls across all platform infrastructure:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li>AES-256 encryption at rest and TLS 1.3 encryption in transit for all data transmissions.</li>
              <li>Granular Role-Based Access Control (RBAC) and pre-retrieval authorization filters preventing unauthorized resource discovery.</li>
              <li>Zero-Trust audit logs recording all privileged administrative and financial interactions.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-cyan" />
              3. Student Rights & Data Deletion
            </h2>
            <p>
              Under our privacy governance charter, students retain full ownership of their intellectual property, submitted code repositories, and personal portfolio showcases. You may request full export or permanent erasure of your account data at any time by contacting{" "}
              <a href="mailto:privacy@himnovatech.com" className="text-brand-cyan hover:underline font-semibold">
                privacy@himnovatech.com
              </a>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
