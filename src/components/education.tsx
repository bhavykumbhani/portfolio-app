'use client';

import React from 'react';
import { Education as EducationType } from '@/types';
import { GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

interface EducationProps {
  education: EducationType[];
}

export function Education({ education }: EducationProps) {
  return (
    <section id="education" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Education
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        {education.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-500 font-mono text-sm">No education history recorded yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/10 hover:border-emerald-500/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  {/* Top line: Icon and GPA */}
                  <div className="flex items-center justify-between">
                    <div className="p-2 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400">
                      <GraduationCap className="h-5 w-5" />
                    </div>
                    {edu.grade && (
                      <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-850 text-xs font-mono text-zinc-650 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-800">
                        <Award className="h-3.5 w-3.5 text-purple-650 dark:text-purple-400" />
                        <span>{edu.grade}</span>
                      </span>
                    )}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50">{edu.degree}</h3>
                    <p className="font-mono text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                      {edu.institution}
                    </p>
                  </div>

                  <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {edu.description}
                  </p>
                </div>

                {/* Details Footer */}
                <div className="flex items-center justify-between text-xs font-mono text-zinc-500 dark:text-zinc-400 pt-3 border-t border-zinc-100 dark:border-zinc-900">
                  <span className="flex items-center space-x-1">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>
                      {edu.startDate} — {edu.endDate}
                    </span>
                  </span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="h-3.5 w-3.5" />
                    <span>{edu.location}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
