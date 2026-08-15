'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Menu, X, Sun, Moon, Terminal } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';
import { useSession } from 'next-auth/react';

const NAV_ITEMS = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Journey', href: '#journey' },
  { label: 'Contact', href: '#contact' },
];

export function Navbar({
  profileName,
  githubUrl,
  linkedinUrl,
}: {
  profileName: string;
  githubUrl: string;
  linkedinUrl: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => setTheme(theme === 'dark' ? 'light' : 'dark');

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'bg-white/80 dark:bg-[#09090b]/80 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo/Name */}
        <Link href="/" className="flex items-center space-x-2 text-zinc-900 dark:text-zinc-50 hover:opacity-80 transition-opacity">
          <Terminal className="h-5 w-5 text-accent-blue dark:text-accent-yellow" />
          <span className="font-mono font-bold tracking-tight text-lg">{profileName}</span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex space-x-8 text-sm font-medium">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent-hover transition-colors"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Desktop Socials & Theme Toggle */}
        <div className="hidden md:flex items-center space-x-4">
          <a
            href={githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent-hover transition-colors"
            aria-label="GitHub Profile"
          >
            <Github className="h-5 w-5" />
          </a>
          <a
            href={linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent-hover transition-colors"
            aria-label="LinkedIn Profile"
          >
            <Linkedin className="h-5 w-5" />
          </a>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-all cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>
          {/* Console link visible only for authenticated users */}
          {session?.user && (
            <Link
              href="/admin"
              className="px-3.5 py-1.5 text-xs font-mono rounded border border-accent/30 text-accent dark:text-accent-hover hover:bg-accent/10 transition-all"
            >
              Console
            </Link>
          )}
        </div>

        {/* Mobile controls */}
        <div className="flex md:hidden items-center space-x-3">
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />)}
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-300 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#09090b]">
          <nav className="flex flex-col px-4 py-4 space-y-4 text-base font-medium">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className="text-zinc-600 dark:text-zinc-300 hover:text-accent dark:hover:text-accent-hover transition-colors"
              >
                {item.label}
              </a>
            ))}
            <div className="flex items-center space-x-6 pt-4 border-t border-zinc-200 dark:border-zinc-800">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-300"
              >
                <Github className="h-5 w-5" />
                <span className="text-sm font-mono">GitHub</span>
              </a>
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center space-x-2 text-zinc-600 dark:text-zinc-300"
              >
                <Linkedin className="h-5 w-5" />
                <span className="text-sm font-mono">LinkedIn</span>
              </a>
              {session?.user && (
                <Link
                  href="/admin"
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-accent dark:text-accent-hover font-mono text-sm"
                >
                  Admin Console
                </Link>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
