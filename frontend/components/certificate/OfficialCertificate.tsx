'use client';

import React from 'react';
import { formatDate } from '@/lib/utils';
import { ShieldCheck, Printer, ExternalLink, Award, CheckCircle2 } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface OfficialCertificateProps {
  certificate: {
    certificateNumber: string;
    student?: { fullName: string; email?: string };
    studentName?: string;
    recipientName?: string;
    course?: { title: string; durationHours?: number; category?: string };
    courseName?: string;
    customTitle?: string;
    customDescription?: string;
    customSkills?: string;
    customHonor?: string;
    issueDate: string | Date;
    completionScore?: number;
    verificationUrl?: string;
    qrCodeUrl?: string;
    signatoryName?: string;
    signatoryTitle?: string;
  };
  showActions?: boolean;
}

export const OfficialCertificate: React.FC<OfficialCertificateProps> = ({
  certificate,
  showActions = true,
}) => {
  const studentName = certificate.recipientName || certificate.student?.fullName || certificate.studentName || 'Distinguished Graduate';
  const courseTitle = certificate.course?.title || certificate.courseName || 'Autonomous AI Agent & Full Stack Engineering';
  const durationHours = certificate.course?.durationHours || 75;
  const certNumber = certificate.certificateNumber;
  const score = certificate.completionScore || 96;
  const issueDateFormatted = formatDate(certificate.issueDate || new Date());
  const customTitle = certificate.customTitle || 'Certificate of Professional Engineering Excellence';
  const customHonor = certificate.customHonor || 'Graduated with Highest Distinction & Capstone Excellence';
  const signatoryName = certificate.signatoryName || 'Sushil Panthi';
  const signatoryTitle = certificate.signatoryTitle || 'Director & Lead AI Architect, Himnova Technologies Pvt. Ltd.';

  const defaultDescription = `for successfully demonstrating verified architectural competence, engineering rigor, and technical mastery in the intensive 10-Week Industry Career Launchpad (${durationHours} Hours) in ${courseTitle}. Demonstrating hands-on production deployment of Autonomous Multi-Agent AI Systems, Enterprise Vector Retrieval (RAG), Scalable Full Stack Microservices, and Verified Capstone Deliverables evaluated with a score of ${score}%.`;

  const descriptionText = certificate.customDescription || defaultDescription;

  // Dynamic text size calculation based on description length
  const descriptionLength = descriptionText.length;
  const dynamicBodyTextClass = descriptionLength > 280 
    ? 'text-[10.5px] sm:text-[11.5px] leading-relaxed' 
    : descriptionLength > 180 
      ? 'text-[12px] sm:text-[13px] leading-relaxed' 
      : 'text-[13.5px] sm:text-[14.5px] leading-relaxed font-medium';

  const defaultSkills = ['Autonomous AI Agents', 'Multi-Agent LangGraph', 'Vector DB & Hybrid RAG', 'Full Stack Next.js & NestJS', 'Docker & Cloud Deployment'];
  const skillsList = certificate.customSkills 
    ? certificate.customSkills.split(',').map((s) => s.trim()).filter(Boolean)
    : defaultSkills;

  const verifyUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/verify/${certNumber}`
    : (certificate.verificationUrl || `http://localhost:3000/verify/${certNumber}`);

  // Dedicated isolated print handler to guarantee 100% clean landscape print with ZERO background leak
  const handlePrint = () => {
    const certElement = document.getElementById('himnova-official-certificate');
    if (!certElement) {
      window.print();
      return;
    }

    const existingFrame = document.getElementById('himnova-print-frame');
    if (existingFrame && document.body.contains(existingFrame)) {
      document.body.removeChild(existingFrame);
    }

    const iframe = document.createElement('iframe');
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.id = 'himnova-print-frame';
    document.body.appendChild(iframe);

    const doc = iframe.contentWindow?.document;
    if (!doc) {
      window.print();
      return;
    }

    // Clone clean certificate HTML
    const certClone = certElement.cloneNode(true) as HTMLElement;
    certClone.id = 'print-cert-root';
    certClone.style.width = '283mm';
    certClone.style.height = '196mm';
    certClone.style.maxWidth = '283mm';
    certClone.style.maxHeight = '196mm';
    certClone.style.aspectRatio = 'auto';
    certClone.style.margin = '0 auto';
    certClone.style.position = 'relative';

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Himnova Academy - ${certNumber} - ${studentName}</title>
          <link rel="preconnect" href="https://fonts.googleapis.com">
          <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
          <link href="https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700;800;900&family=Inter:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&family=Outfit:wght@500;600;700;800;900&family=Playfair+Display:ital,wght@0,600;0,700;0,800;0,900;1,600;1,700&display=swap" rel="stylesheet">
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: 297mm 210mm landscape;
              margin: 6mm;
            }
            *, *::before, *::after {
              box-sizing: border-box !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0;
              padding: 0;
              background: #faf8f5 !important;
              color: #0a192f !important;
              font-family: 'Outfit', 'Inter', system-ui, sans-serif;
              overflow: hidden;
            }
            .print-wrapper {
              width: 100%;
              height: 100%;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #faf8f5;
            }
          </style>
        </head>
        <body>
          <div class="print-wrapper">
            ${certClone.outerHTML}
          </div>
        </body>
      </html>
    `;

    doc.open();
    doc.write(htmlContent);
    doc.close();

    setTimeout(() => {
      iframe.contentWindow?.focus();
      iframe.contentWindow?.print();
      setTimeout(() => {
        if (document.body.contains(iframe)) {
          document.body.removeChild(iframe);
        }
      }, 5000);
    }, 450);
  };

  return (
    <div className="w-full space-y-4">
      {/* Top Action Bar */}
      {showActions && (
        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-alpine-900 border border-white/10 text-xs font-mono no-print shadow-xl">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Official Credential ID: <strong className="text-brand-cyan">{certNumber}</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <a
              href={verifyUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-xl bg-alpine-850 text-brand-cyan hover:bg-alpine-800 border border-white/10 font-bold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Public Registry Link</span>
            </a>
            <button
              onClick={handlePrint}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-slate-950 font-bold flex items-center gap-2 shadow-lg shadow-amber-500/20 hover:brightness-105 active:scale-98 transition-all"
            >
              <Printer className="h-4 w-4" />
              <span>Print A4 Landscape PDF</span>
            </button>
          </div>
        </div>
      )}

      {/* Horizontal A4 Certificate Canvas - Elegant Ivory & Royal Gold Theme */}
      <div className="certificate-print-wrapper overflow-x-auto p-1 sm:p-3 flex justify-center bg-slate-950/40 rounded-3xl border border-white/5">
        <div
          id="himnova-official-certificate"
          className="relative mx-auto bg-[#faf8f5] text-[#0a192f] shadow-2xl overflow-hidden select-none certificate-a4-landscape"
          style={{
            width: '100%',
            maxWidth: '1040px',
            aspectRatio: '1.414 / 1', // Exact Horizontal A4 Landscape ratio (297mm x 210mm)
            padding: '24px 36px',
            boxSizing: 'border-box',
            fontFamily: 'var(--font-sans, system-ui, -apple-system, sans-serif)',
          }}
        >
          {/* ========================================================================= */}
          {/* ROYAL GOLD & NAVY DUAL CONTINUOUS BORDER (CLEAN, NO LOOSE CORNER LINES)     */}
          {/* ========================================================================= */}
          {/* Outer Heavy Gold Frame */}
          <div className="absolute inset-2.5 rounded-xl border-[4px] border-[#b48325] pointer-events-none" />
          {/* Middle Fine Gold Accent Line */}
          <div className="absolute inset-4 rounded-lg border-[1.5px] border-[#d4af37]/75 pointer-events-none" />
          {/* Inner Navy Precision Line */}
          <div className="absolute inset-5.5 rounded-md border-[1px] border-[#0a192f]/30 pointer-events-none" />

          {/* Authentic Watermark Centerpiece */}
          <div className="absolute inset-0 flex items-center justify-center opacity-[0.035] pointer-events-none">
            <img
              src="/logos/Circle Ico.png"
              alt=""
              className="w-[450px] h-[450px] object-contain rounded-full"
            />
          </div>

          {/* ========================================================================= */}
          {/* MAIN CERTIFICATE CONTENT CONTAINER (ALL KEPT FULLY INSIDE THE FRAME)      */}
          {/* ========================================================================= */}
          <div className="relative z-10 h-full flex flex-col justify-between py-1">
            {/* Top Row: Organization Header & Security Clearance Badge */}
            <div className="flex items-center justify-between border-b-[1.5px] border-[#b48325]/30 pb-2.5 px-1">
              <div className="flex items-center gap-3.5">
                {/* Large Clean Circular Logo */}
                <div className="h-16 w-16 sm:h-18 sm:w-18 flex items-center justify-center shrink-0">
                  <img
                    src="/logos/Circle Ico.png"
                    alt="Himnova Academy"
                    className="h-15 w-15 sm:h-17 sm:w-17 object-contain rounded-full filter drop-shadow-md"
                  />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-black tracking-widest text-[#0a192f] uppercase font-mono leading-tight">
                    Himnova Academy
                  </h3>
                  <p className="text-[9.5px] sm:text-[10.5px] font-mono text-[#334155] mt-0.5 font-bold">
                    Himnova Technologies Pvt. Ltd. • Govt. Regd. 342152/080/081 • Kathmandu, Nepal
                  </p>
                </div>
              </div>

              {/* Verified Badge (Ivory & Gold Frame) */}
              <div className="text-right flex items-center gap-2">
                <div className="text-right space-y-0.5">
                  <span className="px-3.5 py-1 rounded-full bg-amber-500/15 text-[#0a192f] border border-[#b48325] text-[10px] font-mono font-extrabold uppercase tracking-wider inline-flex items-center gap-1.5 shadow-sm">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
                    <span>Verified Credential</span>
                  </span>
                  <p className="text-[10px] font-mono text-[#b48325] font-extrabold tracking-wide">
                    ID: {certNumber}
                  </p>
                </div>
              </div>
            </div>

            {/* Certificate Title & Honors Header */}
            <div className="text-center my-auto py-2 space-y-1.5">
              <div className="inline-flex items-center gap-2 text-xs sm:text-sm font-mono font-extrabold tracking-[0.25em] uppercase text-[#b48325]">
                <Award className="h-4 w-4 text-[#b48325]" />
                <span>{customTitle}</span>
                <Award className="h-4 w-4 text-[#b48325]" />
              </div>

              <p className="text-xs sm:text-[13px] font-serif italic text-[#475569] tracking-wide">
                This official credential of excellence is proudly conferred upon
              </p>

              {/* Recipient Full Name */}
              <div className="py-0.5">
                <h1 className="text-3xl sm:text-4xl md:text-[38px] font-extrabold text-[#0a192f] font-serif tracking-tight leading-none">
                  {studentName}
                </h1>
                <div className="w-56 h-0.5 bg-gradient-to-r from-transparent via-[#b48325] to-transparent mx-auto mt-1.5"></div>
              </div>

              {/* Distinction / Honor Badge */}
              <div className="inline-block px-4 py-0.5 rounded-full bg-amber-100/90 border border-amber-300 text-[10px] sm:text-[11px] font-mono font-bold text-[#854d0e] shadow-sm">
                ★ {customHonor} ★
              </div>

              {/* Main Commendation Body Text (Dynamic Font Scaling) */}
              <p className={`${dynamicBodyTextClass} text-[#1e293b] max-w-3xl mx-auto font-sans px-4`}>
                {descriptionText}
              </p>

              {/* Key Skills Pill Row */}
              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1 max-w-2xl mx-auto">
                {skillsList.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-0.5 rounded-md bg-[#0a192f]/5 border border-[#0a192f]/20 text-[#0a192f] text-[9px] sm:text-[10px] font-mono font-bold"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Row: Verifiable QR Code, Corporate Seal & Director Signature */}
            <div className="pt-2.5 border-t-[1.5px] border-[#b48325]/30 grid grid-cols-3 items-end gap-3 px-1">
              {/* Left Column: Live Scannable QR Code */}
              <div className="flex items-center gap-2.5">
                <div className="p-1.5 rounded-xl bg-white border border-[#b48325]/50 shadow-sm shrink-0">
                  <QRCodeSVG
                    value={verifyUrl}
                    size={56}
                    level="H"
                    includeMargin={false}
                    fgColor="#0a192f"
                    bgColor="#ffffff"
                  />
                </div>
                <div className="text-left font-mono space-y-0.5">
                  <span className="text-[9.5px] font-bold text-[#b48325] uppercase tracking-wider block">
                    Issue Date: {issueDateFormatted}
                  </span>
                  <span className="text-[8.5px] text-[#475569] block font-medium leading-tight">
                    Scan QR to authenticate
                  </span>
                  <span className="text-[8.5px] text-[#0a192f] font-bold block">
                    learn.himnovatech.com
                  </span>
                </div>
              </div>

              {/* Center Column: Official Corporate Seal / Stamp */}
              <div className="flex flex-col items-center justify-center text-center">
                <div className="relative h-18 w-18 flex items-center justify-center">
                  <img
                    src="/logos/Himnova Academy Stamp.png"
                    alt="Himnova Academy Official Seal"
                    className="h-16 w-16 object-contain filter contrast-125 drop-shadow-sm"
                  />
                </div>
                <span className="text-[8px] font-mono font-extrabold uppercase tracking-wider text-[#b48325] mt-0.5">
                  Himnova Academy Official Seal
                </span>
              </div>

              {/* Right Column: Executive Director Signature (Centered above the signature line) */}
              <div className="flex flex-col items-end text-right">
                <div className="relative w-52 flex flex-col items-center">
                  <img
                    src="/logos/SIGN.png"
                    alt="Executive Signature"
                    className="h-10 sm:h-11 object-contain -mb-2 z-10"
                  />
                  <div className="w-full border-t-[1.5px] border-[#0a192f] pt-1 text-center">
                    <p className="text-[11.5px] sm:text-xs font-serif font-bold text-[#0a192f] leading-none">
                      {signatoryName}
                    </p>
                    <p className="text-[8px] sm:text-[8.5px] font-mono text-[#475569] mt-0.5 leading-tight font-semibold">
                      {signatoryTitle}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Global Print Fallback Stylesheet */}
      <style jsx global>{`
        @media print {
          @page {
            size: 297mm 210mm landscape;
            margin: 6mm !important;
          }
          *, *::before, *::after {
            box-sizing: border-box !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            width: 100% !important;
            height: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            overflow: hidden !important;
            background: #faf8f5 !important;
            color: #0a192f !important;
          }
          .no-print, header, nav, aside, footer {
            display: none !important;
          }
          div[class*="backdrop-blur"],
          div[class*="bg-black"],
          div[class*="bg-alpine"],
          div[class*="fixed inset-0"] {
            background: transparent !important;
            backdrop-filter: none !important;
            -webkit-backdrop-filter: none !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .certificate-print-wrapper {
            padding: 0 !important;
            margin: 0 !important;
            background: transparent !important;
            border: none !important;
            display: flex !important;
            align-items: center !important;
            justify-content: center !important;
            width: 100% !important;
            height: 100% !important;
          }
          #himnova-official-certificate {
            position: relative !important;
            width: 283mm !important;
            height: 196mm !important;
            max-width: 283mm !important;
            max-height: 196mm !important;
            aspect-ratio: auto !important;
            margin: 0 auto !important;
            padding: 22px 34px !important;
            border-radius: 6px !important;
            box-shadow: none !important;
            page-break-inside: avoid !important;
            overflow: hidden !important;
            background: #faf8f5 !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
          }
        }
      `}</style>
    </div>
  );
};
