import React from 'react';
import { getSkills } from '@/lib/data-service';
import { SkillsCrudPanel } from './SkillsCrudPanel';

export const revalidate = 0; // Fetch fresh data

export default async function AdminSkillsPage() {
  const skills = await getSkills();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Skills &amp; Tech Stack
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Manage your programming languages, frameworks, developer tools, and AI/ML competencies. Mark learning topics accordingly.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <SkillsCrudPanel initialSkills={skills} />
      </div>
    </div>
  );
}
