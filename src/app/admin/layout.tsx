// src/app/admin/layout.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  Terminal,
  User,
  FolderOpen,
  Wrench,
  Briefcase,
  History,
  GraduationCap,
  Award,
  LogOut,
  ExternalLink,
  Menu,
  X,
} from 'lucide-react';

const SIDEBAR_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: <Terminal className="h-4 w-4" /> },
  { label: 'Profile Management', href: '/admin/profile', icon: <User className="h-4 w-4" /> },
  { label: 'Projects CRUD', href: '/admin/projects', icon: <FolderOpen className="h-4 w-4" /> },
  { label: 'Skills Stack', href: '/admin/skills', icon: <Wrench className="h-4 w-4" /> },
  { label: 'Experience Logs', href: '/admin/experience', icon: <Briefcase className="h-4 w-4" /> },
  { label: 'Journey Timeline', href: '/admin/journey', icon: <History className="h-4 w-4" /> },
  { label: 'Education Data', href: '/admin/education', icon: <GraduationCap className="h-4 w-4" /> },
  { label: 'Certifications', href: '/admin/certifications', icon: <Award className="h-4 w-4" /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const { data: session, status } = useSession();

  // Redirect unauthenticated users to login
  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.replace('/admin/login');
    }
  }, [status, pathname, router]);

  const handleLogout = async () => {
    await signOut({ callbackUrl: '/admin/login' });
  };

  // Suppress layout rendering for the login page
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-zinc-150 dark:bg-zinc-950 font-sans">
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-zinc-900 border-b border-zinc-800 text-white">
        <Link href="/admin" className="flex items-center space-x-2 font-mono font-bold text-xs tracking-tight">
          <Terminal className="h-4.5 w-4.5 text-emerald-500" />
          <span>CONSOLE // ADMIN</span>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-1 rounded text-zinc-400 hover:text-white hover:bg-zinc-800 cursor-pointer"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-zinc-900 border-b border-zinc-800 py-3 px-4 space-y-2 text-sm text-zinc-300">
          <nav className="flex flex-col px-4 py-4 space-y-4">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center space-x-2 px-3 py-2 rounded transition-colors ${
                  pathname === item.href
                    ? 'bg-emerald-600/20 text-emerald-400 border-l-2 border-emerald-500 font-medium'
                    : 'hover:bg-zinc-800 text-zinc-300'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="pt-2 border-t border-zinc-800 flex flex-col space-y-2 text-xs">
            <Link href="/" target="_blank" className="flex items-center space-x-2 px-3 py-2 hover:bg-zinc-850 rounded">
              <ExternalLink className="h-3.5 w-3.5" />
              <span>Live Website</span>
            </Link>
            <button
              onClick={() => {
                setMobileOpen(false);
                handleLogout();
              }}
              className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:bg-zinc-850 rounded text-left cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      {/* Desktop Left Sidebar */}
      <aside className="hidden md:flex flex-col justify-between w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300">
        <div className="p-6 space-y-8">
          {/* Brand header */}
          <Link href="/admin" className="flex items-center space-x-2 font-mono font-bold text-xs tracking-wider text-zinc-900 dark:text-zinc-50">
            <Terminal className="h-5 w-5 text-emerald-600 dark:text-emerald-500" />
            <span>CONSOLE // ADMIN</span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex flex-col space-y-1.5 text-sm">
            {SIDEBAR_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-2.5 px-3 py-2 rounded-lg transition-all ${
                  pathname === item.href
                    ? 'bg-emerald-500/10 border-l-3 border-emerald-500 text-emerald-700 dark:text-emerald-400 font-semibold'
                    : 'hover:bg-zinc-100 dark:hover:bg-zinc-950/40 text-zinc-500 dark:text-zinc-400'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4 text-xs font-mono">
          <Link
            href="/"
            target="_blank"
            className="flex items-center space-x-2 text-zinc-550 hover:text-emerald-500 dark:text-zinc-400 dark:hover:text-emerald-400 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
            <span>Live Portfolio</span>
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-red-500 hover:text-red-400 transition-colors w-full text-left cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Admin Workspace Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="max-w-4xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
