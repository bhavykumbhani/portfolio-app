'use client';

import React from 'react';
import { Profile } from '@/types';
import { Mail, Heart } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';

interface FooterProps {
  profile: Profile;
}

export function Footer({ profile }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-[#0b0b0d] py-12 text-zinc-500 dark:text-zinc-400">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        {/* Left Column: Role Details */}
        <div className="space-y-2.5 text-center md:text-left">
          <div className="font-mono font-bold text-zinc-900 dark:text-zinc-50">
            {profile.name}
          </div>
          <p className="text-xs sm:text-sm">
            {profile.currentRole} • Exploring {profile.exploring}
          </p>
          <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 flex items-center justify-center md:justify-start space-x-1">
            <span>© {currentYear} {profile.name}. All rights reserved.</span>
            <span>•</span>
            <span>Built with Next.js &amp; Tailwind CSS</span>
          </div>
        </div>

        {/* Right Column: Social Links */}
        <div className="flex flex-col items-center md:items-end space-y-4">
          <div className="flex items-center space-x-4">
            <a
              href={`mailto:${profile.email}`}
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all cursor-pointer"
              title="Send Email"
              aria-label="Email Address"
            >
              <Mail className="h-4.5 w-4.5" />
            </a>
            <a
              href={profile.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all cursor-pointer"
              title="GitHub Profile"
              aria-label="GitHub Profile"
            >
              <Github className="h-4.5 w-4.5" />
            </a>
            <a
              href={profile.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg border border-zinc-200 dark:border-zinc-800 text-zinc-500 hover:text-emerald-500 dark:hover:text-emerald-400 hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all cursor-pointer"
              title="LinkedIn Profile"
              aria-label="LinkedIn Profile"
            >
              <Linkedin className="h-4.5 w-4.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
