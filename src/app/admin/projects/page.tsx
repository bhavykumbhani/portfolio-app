import React from 'react';
import { getProjects } from '@/lib/data-service';
import { ProjectsCrudPanel } from './ProjectsCrudPanel';

export const revalidate = 0; // Fresh initial data

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Projects CRUD
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Create, edit, view, or delete project showcases. Published projects will immediately appear on the public site.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <ProjectsCrudPanel initialProjects={projects} />
      </div>
    </div>
  );
}
