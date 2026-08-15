'use client';

import React from 'react';
import { Certification } from '@/types';
import { FileBadge, Calendar, ExternalLink, Award } from 'lucide-react';

interface CertificationsProps {
  certifications: Certification[];
}

export function Certifications({ certifications }: CertificationsProps) {
  return (
    <section id="certifications" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col items-start space-y-3 mb-12">
          <h2 className="text-3xl font-bold tracking-tight font-mono">
            <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Certifications
          </h2>
          <div className="h-1 w-12 bg-emerald-500 rounded" />
        </div>

        {certifications.length === 0 ? (
          /* Certifications coming soon */
          <div className="p-8 md:p-12 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/10 max-w-xl text-center">
            <Award className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <h3 className="text-base font-bold text-zinc-800 dark:text-zinc-200 mb-1">Certifications coming soon</h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              I am actively preparing for professional cloud, software engineering, and AI/ML credentials. 
              Once earned, they will appear here dynamically.
            </p>
          </div>
        ) : (
          /* Certifications List */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/40 hover:border-emerald-500/20 transition-all flex flex-col justify-between space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded bg-teal-500/10 text-teal-600 dark:text-teal-400">
                      <FileBadge className="h-5 w-5" />
                    </div>
                    <div className="flex items-center space-x-1 text-xs text-zinc-500 font-mono">
                      <Calendar className="h-3 w-3" />
                      <span>{cert.date}</span>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-bold text-base text-zinc-900 dark:text-zinc-50 leading-tight">
                      {cert.name}
                    </h3>
                    <p className="text-xs font-mono text-zinc-500 dark:text-zinc-400 mt-1">
                      {cert.issuingOrganization}
                    </p>
                  </div>

                  {cert.credentialId && (
                    <div className="text-[10px] font-mono text-zinc-400 dark:text-zinc-500 truncate">
                      ID: {cert.credentialId}
                    </div>
                  )}
                </div>

                {cert.credentialUrl && (
                  <div className="pt-3 border-t border-zinc-100 dark:border-zinc-900">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-1 text-xs font-mono text-emerald-600 dark:text-emerald-400 hover:underline"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
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
