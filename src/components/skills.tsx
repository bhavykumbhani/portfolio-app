'use client';

import React from 'react';
import { Skill, SkillCategory, SkillStatus } from '@/types';
import { Brain, Code, Cpu, Database, Wrench } from 'lucide-react';

interface SkillsProps {
  skills: Skill[];
}

const CATEGORY_ICONS: Record<SkillCategory, React.ReactNode> = {
  'Web Development': <Code className="h-4.5 w-4.5" />,
  'Programming': <Cpu className="h-4.5 w-4.5" />,
  'AI / ML': <Brain className="h-4.5 w-4.5" />,
  'Data Analytics': <Database className="h-4.5 w-4.5" />,
  'Tools': <Wrench className="h-4.5 w-4.5" />
};

export function Skills({ skills }: SkillsProps) {
  // Extract all unique categories present in skills
  const categories: SkillCategory[] = ['Web Development', 'Programming', 'AI / ML', 'Data Analytics', 'Tools'];

  // Helper to get styling for status badges
  const getStatusBadgeStyle = (status: SkillStatus) => {
    switch (status) {
      case 'Advanced':
        return 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-400';
      case 'Building With':
        return 'bg-blue-500/10 border-blue-500/30 text-blue-700 dark:text-blue-400';
      case 'Familiar':
        return 'bg-zinc-500/10 border-zinc-500/30 text-zinc-700 dark:text-zinc-400';
      case 'Learning':
      default:
        return 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-400 animate-pulse';
    }
  };

  return (
    <section id="skills" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-white dark:bg-[#09090b]">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Skills &amp; Tech Stack
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {categories.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div
                key={category}
                className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 hover:shadow-sm transition-all"
              >
                {/* Category Header */}
                <div className="flex items-center space-x-2.5 mb-5 text-zinc-800 dark:text-zinc-100">
                  <div className="p-1.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500">
                    {CATEGORY_ICONS[category] || <Code className="h-4.5 w-4.5" />}
                  </div>
                  <h3 className="font-mono font-bold text-sm tracking-tight">{category}</h3>
                </div>

                {/* Skill List */}
                <div className="flex flex-wrap gap-2.5">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="inline-flex items-center justify-between px-3 py-1.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-xs font-mono text-zinc-700 dark:text-zinc-300 w-full"
                    >
                      <span className="font-medium">{skill.name}</span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-sans border tracking-wide font-medium ${getStatusBadgeStyle(
                          skill.status
                        )}`}
                      >
                        {skill.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
