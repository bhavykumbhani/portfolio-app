'use client';

import React from 'react';
import { Profile, Education } from '@/types';
import { Briefcase, Code, GraduationCap, MapPin } from 'lucide-react';

interface AboutProps {
  profile: Profile;
  education: Education[];
}

export function About({ profile, education }: AboutProps) {
  // Find MCA education entry dynamically
  const mcaEntry = education.find(
    (edu) => edu.degree.toLowerCase().includes('mca') || edu.id === 'mca'
  );
  
  const mcaInstitution = mcaEntry ? mcaEntry.institution : 'University (Placeholder)';

  return (
    <section id="about" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-accent-yellow dark:text-accent mr-2">&gt;</span>About Me
          </h2>
          <div className="h-1 w-12 bg-accent rounded" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left: Bio Description */}
          <div className="lg:col-span-7 space-y-6 text-zinc-600 dark:text-zinc-400 leading-relaxed text-base">
            <p className="font-semibold text-zinc-800 dark:text-zinc-200">
              I am a web developer with a keen interest in building functional digital applications.
            </p>
            <p>
              My journey in software development revolves around continuous learning. While my core strength lies in 
              building web experiences using modern technologies, I am actively expanding my horizon into data-driven disciplines.
            </p>
            <p>
              I believe in learning through building. Developing hands-on prototypes is my preferred method to master new systems, 
              ranging from responsive websites to machine learning algorithms and analytics dashboards.
            </p>
            <p>
              Currently, I am pursuing my Master of Computer Applications (MCA) degree, which helps solidify my knowledge of 
              software engineering fundamentals and advanced database theory.
            </p>

            <div className="flex flex-wrap items-center gap-4 text-xs font-mono pt-4 text-zinc-500 dark:text-zinc-400">
              <span className="flex items-center space-x-1">
                <MapPin className="h-3.5 w-3.5 text-accent" />
                <span>{profile.location}</span>
              </span>
              <span>•</span>
              <span>Available for collaboration</span>
            </div>
          </div>

          {/* Right: Info Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 w-full">
            {/* Card 1: Current Role */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-accent/30 transition-all flex flex-col items-start space-y-3">
              <div className="p-2 rounded bg-accent/10 text-accent dark:text-accent-hover">
                <Briefcase className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Current Role</h3>
                <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">{profile.currentRole}</p>
              </div>
            </div>

            {/* Card 2: Exploring */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-accent/30 transition-all flex flex-col items-start space-y-3">
              <div className="p-2 rounded bg-accent/10 text-accent dark:text-accent-hover">
                <Code className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Exploring</h3>
                <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">{profile.exploring}</p>
              </div>
            </div>

            {/* Card 3: Education */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-accent/30 transition-all flex flex-col items-start space-y-3">
              <div className="p-2 rounded bg-accent/10 text-accent dark:text-accent-hover">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Education</h3>
                <p className="font-semibold text-sm text-zinc-800 dark:text-zinc-100">MCA</p>
                <p className="text-xs text-zinc-500 dark:text-zinc-500 truncate max-w-[220px]" title={mcaInstitution}>
                  {mcaInstitution}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
