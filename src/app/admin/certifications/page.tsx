import React from 'react';
import { getCertifications } from '@/lib/data-service';
import { CertificationsCrudPanel } from './CertificationsCrudPanel';

export const revalidate = 0; // Fetch fresh data

export default async function AdminCertificationsPage() {
  const certifications = await getCertifications();

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; Professional Certifications
        </h1>
        <p className="text-xs text-zinc-555 dark:text-zinc-400">
          Manage your industry credentials and professional badges. If none exist, the portfolio displays an elegant coming soon notice.
        </p>
      </div>

      <div className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30">
        <CertificationsCrudPanel initialCertifications={certifications} />
      </div>
    </div>
  );
}
