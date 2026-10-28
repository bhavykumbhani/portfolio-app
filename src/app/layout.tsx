import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import Providers from '@/app/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhavy-kumbhani-portfolio.vercel.app';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    template: '%s | Bhavy Kumbhani',
    default: 'Bhavy Kumbhani | Web Developer & AI/ML Explorer | Official Portfolio',
  },
  description:
    'Official portfolio of Bhavy Kumbhani (Bhavya Kumbhani), a Web Developer based in Ahmedabad, Gujarat. MCA student at GLS University specializing in modern web applications, Next.js, React, AI, Machine Learning, and Data Analytics.',
  keywords: [
    'Bhavy Kumbhani',
    'Bhavya Kumbhani',
    'Bhavya H Kumbhani',
    'Bhavy',
    'bhkumbhani',
    'Bhavy Kumbhani Web Developer',
    'Bhavy Kumbhani Portfolio',
    'Bhavy Kumbhani Ahmedabad',
    'Bhavy Kumbhani GLS University',
    'Web Developer Ahmedabad',
    'MCA Student GLS University',
    'React Developer',
    'Next.js Developer',
    'AI & Machine Learning',
    'Data Analytics',
    'Full Stack Developer India',
  ],
  authors: [{ name: 'Bhavy Kumbhani', url: siteUrl }],
  creator: 'Bhavy Kumbhani',
  publisher: 'Bhavy Kumbhani',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'profile',
    locale: 'en_US',
    url: siteUrl,
    title: 'Bhavy Kumbhani | Web Developer & AI/ML Explorer',
    description:
      'Explore projects, technical skills, and background of Bhavy Kumbhani (Bhavya Kumbhani), Web Developer & MCA Student based in Ahmedabad, India.',
    siteName: 'Bhavy Kumbhani Portfolio',
    images: [
      {
        url: '/images/bhavy-portrait.png',
        width: 800,
        height: 800,
        alt: 'Bhavy Kumbhani - Web Developer & AI/ML Explorer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhavy Kumbhani | Web Developer & AI/ML Explorer',
    description:
      'Explore projects, technical skills, and background of Bhavy Kumbhani (Bhavya Kumbhani), Web Developer & MCA Student based in Ahmedabad, India.',
    creator: '@bhavy_kumbhani',
    images: ['/images/bhavy-portrait.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans min-h-screen selection:bg-amber-500/30 selection:text-amber-200 antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
