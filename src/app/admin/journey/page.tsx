import React from 'react';
import { getJourney } from '@/lib/data-service';
import { JourneyCrudPanel } from './JourneyCrudPanel';

export const revalidate = 0; // Fetch fresh data

export default async function AdminJourneyPage() {
  const journey = await getJourney();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Journey Timeline entries
        </h1>
        <p className="text-xs text-zinc-555 dark:text-zinc-400">
          Add or edit events in your dynamic technology career timeline. Types include Education, Jobs, Achievements, and Certifications.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <JourneyCrudPanel initialJourney={journey} />
      </div>
    </div>
  );
}
