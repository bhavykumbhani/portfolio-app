'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Profile } from '@/types';
import { Save, CheckCircle } from 'lucide-react';

interface ProfileFormProps {
  initialProfile: Profile;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
  const [profile, setProfile] = useState<Profile>(initialProfile);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const router = useRouter();

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save profile information.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setProfile((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 text-sm">
      {saveSuccess && (
        <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2 font-mono text-xs">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
          <span>Profile configuration updated and saved successfully!</span>
        </div>
      )}

      {/* Grid: Name & Titles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="name" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Name</label>
          <input
            type="text"
            id="name"
            required
            value={profile.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="statusText" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Status Text</label>
          <input
            type="text"
            id="statusText"
            value={profile.statusText || ''}
            onChange={handleChange}
            placeholder="e.g. Building • Learning • Exploring"
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="currentRole" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Primary Role / Title</label>
          <input
            type="text"
            id="currentRole"
            required
            value={profile.currentRole}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="exploring" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Exploring / Learning Techs</label>
          <input
            type="text"
            id="exploring"
            required
            value={profile.exploring}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Grid: Contact & Locations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Email Address</label>
          <input
            type="email"
            id="email"
            required
            value={profile.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="location" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Location</label>
          <input
            type="text"
            id="location"
            required
            value={profile.location}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="githubUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">GitHub URL</label>
          <input
            type="url"
            id="githubUrl"
            required
            value={profile.githubUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="linkedinUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">LinkedIn URL</label>
          <input
            type="url"
            id="linkedinUrl"
            required
            value={profile.linkedinUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="resumeUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Resume Link / Path</label>
          <input
            type="text"
            id="resumeUrl"
            required
            value={profile.resumeUrl}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* Bios */}
      <div className="space-y-1.5">
        <label htmlFor="shortBio" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Short Bio Description</label>
        <textarea
          id="shortBio"
          required
          rows={2}
          value={profile.shortBio}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <div className="space-y-1.5">
        <label htmlFor="longBio" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Long Professional Biography</label>
        <textarea
          id="longBio"
          required
          rows={5}
          value={profile.longBio}
          onChange={handleChange}
          className="w-full px-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSaving}
        className="inline-flex items-center space-x-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg transition-all disabled:opacity-50 cursor-pointer text-xs font-mono"
      >
        <Save className="h-4 w-4" />
        <span>{isSaving ? 'UPDATING FILES...' : 'SAVE CONFIGURATION'}</span>
      </button>
    </form>
  );
}
