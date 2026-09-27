import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { FileText, ShieldAlert, CheckCircle2, ArrowLeft } from "lucide-react";

export default function TermsOfServicePage() {
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
            <FileText className="w-3.5 h-3.5" />
            Terms & Conditions
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Terms of Service & Academic Charter
          </h1>
          <p className="text-sm text-slate-400">
            Effective Date: September 2026 • Himnova Technologies Pvt. Ltd.
          </p>
        </div>

        <div className="p-8 rounded-2xl border border-slate-800 bg-slate-900/40 backdrop-blur-md space-y-8 text-sm text-slate-300 leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-brand-cyan" />
              1. Platform Enrollment & Code of Conduct
            </h2>
            <p>
              By accessing the Himnova AI Career Launchpad, students and instructors agree to maintain the highest standards of professional academic integrity, collaborative respect, and software engineering ethics. Reverse engineering or unauthorized distribution of proprietary course videos and learning materials is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-brand-cyan" />
              2. Certificate Issuance & Graduation Requirements
            </h2>
            <p>
              Digital certificates issued by Himnova Technologies are verifiable credentials demonstrating individual mastery of stated technologies. Certificates are unlocked exclusively upon completing mandatory curriculum requirements:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-400">
              <li>Minimum 80% attendance in live cohort sessions and interactive labs.</li>
              <li>Satisfactory submission and trainer code review approval of all capstone assignments.</li>
              <li>Verification of non-plagiarized original software development work.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-cyan" />
              3. Career Development & Disclaimer
            </h2>
            <p>
              The Himnova AI Career Launchpad is an intensive technical upskilling and portfolio development program. While Himnova partners with leading technology employers and provides recruitment matchmaking, completion of training does not constitute a guaranteed employment contract or salary guarantee.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
