'use client';

import React from 'react';
import { JourneyEntry, JourneyType } from '@/types';
import { GraduationCap, Award, Briefcase, FileBadge, Code, BookOpen, Calendar, ArrowUpRight } from 'lucide-react';

interface JourneyProps {
  journey: JourneyEntry[];
}

const TYPE_ICONS: Record<JourneyType, React.ReactNode> = {
  'Education': <GraduationCap className="h-4 w-4" />,
  'Project': <Code className="h-4 w-4" />,
  'Achievement': <Award className="h-4 w-4" />,
  'Certification': <FileBadge className="h-4 w-4" />,
  'Internship': <Briefcase className="h-4 w-4" />,
  'Job': <Briefcase className="h-4 w-4" />,
  'Career Milestone': <Briefcase className="h-4 w-4" />,
  'Learning': <BookOpen className="h-4 w-4" />
};

const TYPE_COLOR: Record<JourneyType, string> = {
  'Education': 'border-purple-500 text-purple-600 dark:text-purple-400 bg-purple-500/10',
  'Project': 'border-blue-500 text-blue-600 dark:text-blue-400 bg-blue-500/10',
  'Achievement': 'border-amber-500 text-amber-600 dark:text-amber-400 bg-amber-500/10',
  'Certification': 'border-teal-500 text-teal-600 dark:text-teal-400 bg-teal-500/10',
  'Internship': 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  'Job': 'border-emerald-500 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10',
  'Career Milestone': 'border-pink-500 text-pink-600 dark:text-pink-400 bg-pink-500/10',
  'Learning': 'border-indigo-500 text-indigo-600 dark:text-indigo-400 bg-indigo-500/10'
};

export function Journey({ journey }: JourneyProps) {
  // Sort journey by year descending (newest first)
  const sortedJourney = [...journey].sort((a, b) => b.year.localeCompare(a.year));

  return (
    <section id="journey" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-16">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>My Journey
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        {sortedJourney.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-500 font-mono text-sm">No journey items recorded yet.</p>
        ) : (
          <div className="relative border-l border-zinc-200 dark:border-zinc-800 ml-4 md:ml-32 space-y-12 pb-4">
            {sortedJourney.map((entry) => (
              <div key={entry.id} className="relative pl-8 md:pl-12 group">
                {/* Year Label (Absolute on Desktop, block on mobile) */}
                <div className="md:absolute md:right-full md:mr-8 md:top-1.5 md:w-24 text-left md:text-right">
                  <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300">
                    <Calendar className="h-3 w-3 mr-1" />
                    {entry.year}
                  </span>
                </div>

                {/* Timeline Icon Badge */}
                <div className={`absolute -left-[17px] top-1.5 p-1.5 rounded-full border-2 bg-white dark:bg-zinc-950 transition-transform duration-300 group-hover:scale-115 ${
                  TYPE_COLOR[entry.type] || 'border-zinc-300 text-zinc-500'
                }`}>
                  {TYPE_ICONS[entry.type] || <BookOpen className="h-4 w-4" />}
                </div>

                {/* Card Container */}
                <div className="mt-3 md:mt-0 p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 hover:border-emerald-500/20 transition-all space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50">{entry.title}</h3>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-850 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        {entry.type}
                      </span>
                      {entry.status && (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono text-emerald-700 dark:text-emerald-400">
                          {entry.status}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-sm text-zinc-650 dark:text-zinc-400 leading-relaxed">
                    {entry.description}
                  </p>

                  {/* Technologies or Link */}
                  {(entry.technologies && entry.technologies.length > 0 || entry.link) && (
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-zinc-100 dark:border-zinc-900/60">
                      {/* Technologies */}
                      <div className="flex flex-wrap gap-1.5">
                        {entry.technologies?.map((tech) => (
                          <span
                            key={tech}
                            className="px-2 py-0.5 text-[10px] font-mono rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-400"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      {/* Link */}
                      {entry.link && (
                        <a
                          href={entry.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                        >
                          <span>Explore</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
