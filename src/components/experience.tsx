'use client';

import React from 'react';
import { Experience as ExperienceType } from '@/types';
import { Briefcase, Calendar, MapPin, Globe } from 'lucide-react';

interface ExperienceProps {
  experience: ExperienceType[];
}

export function Experience({ experience }: ExperienceProps) {
  return (
    <section id="experience" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Professional Experience
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        {experience.length === 0 ? (
          /* Placeholder state */
          <div className="p-8 md:p-12 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 max-w-2xl">
            <div className="flex items-start space-x-4">
              <div className="p-2.5 rounded bg-zinc-200/50 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400">
                <Briefcase className="h-5 w-5" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200">Building &amp; Learning</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">
                  No professional experience logged yet. I am currently focused on academic foundations, self-driven 
                  practical projects, and continuous learning of modern technical stacks.
                </p>
                <div className="pt-2">
                  <span className="inline-flex px-2 py-0.5 rounded bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-mono font-medium text-emerald-700 dark:text-emerald-400">
                    Open for Internships &amp; Collaborations
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Experience Listing */
          <div className="space-y-8 max-w-3xl">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800 space-y-3 group"
              >
                {/* Timeline node */}
                <div className="absolute -left-[5.5px] top-1.5 h-2.5 w-2.5 rounded-full bg-zinc-300 dark:bg-zinc-700 group-hover:bg-emerald-500 transition-colors" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                  <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{exp.role}</h3>
                  <div className="flex items-center space-x-1.5 text-xs text-zinc-500 dark:text-zinc-400 font-mono">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {exp.startDate} — {exp.endDate}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-500 dark:text-zinc-400">
                  <span className="font-semibold text-zinc-700 dark:text-zinc-300">{exp.company}</span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3 w-3" />
                    <span>{exp.location}</span>
                  </span>
                  {exp.website && (
                    <>
                      <span>•</span>
                      <a
                        href={exp.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        <Globe className="h-3 w-3" />
                        <span>Website</span>
                      </a>
                    </>
                  )}
                </div>

                <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                  {exp.description}
                </p>

                {/* Tech tags */}
                {exp.technologies && exp.technologies.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {exp.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
