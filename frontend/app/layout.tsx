import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { ModalProvider } from '@/lib/modal-context';

export const metadata: Metadata = {
  title: 'Himnova AI Career Launchpad | Official Enterprise LMS & AI Career Platform',
  description:
    'Himnova AI Career Launchpad is the official learning and career progression platform by Himnova Technologies Pvt. Ltd. (himnovatech.com), Kathmandu, Nepal. Master AI Engineering, Full Stack Go/Next.js, Cloud DevOps & Cybersecurity with production-ready live classes, verified QR certificates, and recruiter portfolios.',
  keywords: [
    'Himnova',
    'Himnova Technologies',
    'Himnova Tech',
    'Himnova AI Career Launchpad',
    'AI Engineering Nepal',
    'Full Stack Web Development Kathmandu',
    'Cloud DevOps AWS Kubernetes Nepal',
    'LMS Nepal',
    'IT Career Launchpad',
  ],
  authors: [{ name: 'Himnova Technologies Private Limited', url: 'https://himnovatech.com' }],
  icons: {
    icon: '/logos/Circle Ico.png',
    shortcut: '/logos/Circle Ico.png',
    apple: '/logos/Circle Ico.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Outfit:wght@400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-alpine-950 text-slate-100 font-sans antialiased selection:bg-brand-cyan selection:text-slate-900">
        <AuthProvider>
          <ModalProvider>
            {children}
          </ModalProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

