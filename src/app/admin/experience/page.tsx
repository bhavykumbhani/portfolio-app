import React from 'react';
import { getExperience } from '@/lib/data-service';
import { ExperienceCrudPanel } from './ExperienceCrudPanel';

export const revalidate = 0; // Fetch fresh data

export default async function AdminExperiencePage() {
  const experiences = await getExperience();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Work Experience Logs
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Create, edit, or delete professional work records. If none exist, the portfolio displays an elegant placeholder.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <ExperienceCrudPanel initialExperiences={experiences} />
      </div>
    </div>
  );
}
