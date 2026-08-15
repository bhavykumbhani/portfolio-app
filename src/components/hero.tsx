'use client';

import React from 'react';
import { Profile } from '@/types';
import { ArrowRight, Download, Terminal as TerminalIcon } from 'lucide-react';
import { Github, Linkedin } from '@/components/icons';

interface HeroProps {
  profile: Profile;
}

export function Hero({ profile }: HeroProps) {
  return (
    <section id="home" className="relative min-h-[calc(100vh-4rem)] flex items-center py-12 md:py-20 overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none opacity-20 dark:opacity-40">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
      </div>

      <div className="max-w-6xl mx-auto px-4 w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative z-10">
        {/* Left: Text & Content */}
        <div className="lg:col-span-7 flex flex-col items-start text-left space-y-6 fade-in">
          {/* Status Indicator */}
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full border border-accent/20 bg-accent/5 text-accent dark:text-accent-hover text-xs font-mono">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent/75 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
            </span>
            <span>{profile.statusText || 'Building • Learning • Exploring'}</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight">
              Hi, I'm <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-500 to-amber-500 dark:from-blue-400 dark:via-indigo-400 dark:to-amber-400">{profile.name}</span>.
            </h1>
            <p className="text-xl sm:text-2xl md:text-3xl font-mono text-zinc-700 dark:text-zinc-300 font-medium">
              {profile.currentRole}
            </p>
            <p className="text-sm sm:text-base font-mono text-zinc-500 dark:text-zinc-400">
              Exploring {profile.exploring}
            </p>
          </div>

          <p className="text-zinc-600 dark:text-zinc-400 max-w-lg text-base sm:text-lg leading-relaxed">
            {profile.shortBio}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a
              href="#projects"
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 font-semibold text-white dark:text-zinc-950 bg-accent hover:opacity-90 rounded-lg shadow-sm hover:shadow transition-all group"
            >
              <span>View Projects</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a
              href={profile.resumeUrl || '#'}
              download
              className="inline-flex items-center justify-center space-x-2 px-6 py-3 font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all"
            >
              <Download className="h-4 w-4 text-zinc-500" />
              <span>Resume</span>
            </a>
          </div>

          {/* Secondary Links */}
          <div className="flex items-center space-x-5 pt-4">
            <a
              href={profile.githubUrl || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent-hover transition-colors font-mono"
            >
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
            <a
              href={profile.linkedinUrl || 'https://linkedin.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-sm text-zinc-500 hover:text-accent dark:text-zinc-400 dark:hover:text-accent-hover transition-colors font-mono"
            >
              <Linkedin className="h-4 w-4" />
              <span>LinkedIn</span>
            </a>
          </div>
        </div>
        {/* Right: Technical Visual (Dynamic Stack: Portrait Top, Terminal Bottom) */}
        <div className="lg:col-span-5 w-full flex flex-col items-center space-y-6 fade-in relative">
          
          {/* Glowing Background Rings */}
          <div className="absolute top-12 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full bg-blue-500/5 blur-[70px] -z-10 pointer-events-none" />
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-48 h-48 rounded-full bg-yellow-500/5 blur-[50px] -z-10 pointer-events-none" />

          {/* Profile Photo (Top) */}
          {profile.avatarUrl && (
            <div className="relative w-48 h-48 sm:w-56 sm:h-56 rounded-full border-4 border-amber-500/40 dark:border-amber-400/40 overflow-hidden shadow-lg dark:shadow-blue-500/5 hover:scale-[1.03] transition-transform duration-300 pointer-events-none z-10">
              <img
                src={profile.avatarUrl}
                alt={profile.name}
                className="w-full h-full object-cover select-none"
              />
            </div>
          )}

          {/* Terminal Panel (Bottom) */}
          <div className="w-full max-w-sm rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/60 shadow-md backdrop-blur-sm overflow-hidden font-mono text-[10px] text-zinc-600 dark:text-zinc-400 select-none z-10">
            {/* Terminal Header */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-100/80 dark:bg-zinc-900/80">
              <div className="flex items-center space-x-1.5">
                <div className="h-2 w-2 rounded-full bg-red-400/80" />
                <div className="h-2 w-2 rounded-full bg-amber-400/80" />
                <div className="h-2 w-2 rounded-full bg-green-400/80" />
              </div>
              <span className="text-[9px] text-zinc-400">bhavy.sh</span>
            </div>
            {/* Terminal Body */}
            <div className="p-4 space-y-2 leading-relaxed">
              <p className="text-zinc-450 dark:text-zinc-500">~/bhavy $ curl -s info.json</p>
              <div className="text-zinc-700 dark:text-zinc-355 space-y-0.5">
                <p>{`{`}</p>
                <p className="pl-3">"name": "{profile.name}",</p>
                <p className="pl-3">"role": "{profile.currentRole}",</p>
                <p className="pl-3">"focus": "{profile.exploring}"</p>
                <p>{`}`}</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
