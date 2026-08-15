import React from 'react';
import { getProfile } from '@/lib/data-service';
import { ProfileForm } from './ProfileForm';

export const revalidate = 0; // Fresh initial data

export default async function AdminProfilePage() {
  const profile = await getProfile();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Profile Management
        </h1>
        <p className="text-xs text-zinc-550 dark:text-zinc-400">
          Modify your personal details, developer focus titles, short description summaries, and social media URLs.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <ProfileForm initialProfile={profile} />
      </div>
    </div>
  );
}
