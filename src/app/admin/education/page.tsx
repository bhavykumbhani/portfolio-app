import React from 'react';
import { getEducation } from '@/lib/data-service';
import { EducationCrudPanel } from './EducationCrudPanel';

export const revalidate = 0; // Fetch fresh data

export default async function AdminEducationPage() {
  const education = await getEducation();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Education Data
        </h1>
        <p className="text-xs text-zinc-555 dark:text-zinc-400">
          Manage your academic degrees and educational timeline milestones.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <EducationCrudPanel initialEducation={education} />
      </div>
    </div>
  );
}
