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

export const metadata: Metadata = {
  title: {
    template: '%s | Bhavy Kumbhani',
    default: 'Bhavy Kumbhani | Web Developer',
  },
  description: 'Bhavy Kumbhani is a web developer building modern web applications and exploring AI, machine learning, and data analytics.',
  keywords: ['Bhavy Kumbhani', 'Web Developer', 'MCA Student', 'AI & Machine Learning', 'Data Analytics', 'Portfolio', 'Software Developer'],
  authors: [{ name: 'Bhavy Kumbhani' }],
  creator: 'Bhavy Kumbhani',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://bhavy.dev',
    title: 'Bhavy Kumbhani | Web Developer',
    description: 'Bhavy Kumbhani is a web developer building modern web applications and exploring AI, machine learning, and data analytics.',
    siteName: 'Bhavy Kumbhani Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bhavy Kumbhani | Web Developer',
    description: 'Bhavy Kumbhani is a web developer building modern web applications and exploring AI, machine learning, and data analytics.',
    creator: '@bhavy_kumbhani',
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
