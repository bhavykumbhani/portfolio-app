'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { JourneyEntry, JourneyType } from '@/types';
import { Plus, Edit3, Trash2, ArrowLeft, Save, CheckCircle, History } from 'lucide-react';

interface JourneyCrudPanelProps {
  initialJourney: JourneyEntry[];
}

const TYPES: JourneyType[] = ['Education', 'Project', 'Achievement', 'Certification', 'Internship', 'Job', 'Career Milestone', 'Learning'];

const EMPTY_ENTRY: Omit<JourneyEntry, 'id'> = {
  year: '',
  title: '',
  description: '',
  type: 'Learning',
  technologies: [],
  link: '',
  status: 'Completed',
};

export function JourneyCrudPanel({ initialJourney }: JourneyCrudPanelProps) {
  const [journey, setJourney] = useState<JourneyEntry[]>(initialJourney);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentEntry, setCurrentEntry] = useState<JourneyEntry | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Omit<JourneyEntry, 'id'>>(EMPTY_ENTRY);
  const [techInput, setTechInput] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      handleAddClick();
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setFormData(EMPTY_ENTRY);
    setTechInput('');
    setView('add');
  };

  const handleEditClick = (entry: JourneyEntry) => {
    setCurrentEntry(entry);
    setFormData({
      year: entry.year,
      title: entry.title,
      description: entry.description,
      type: entry.type,
      technologies: entry.technologies || [],
      link: entry.link || '',
      status: entry.status || '',
    });
    setTechInput((entry.technologies || []).join(', '));
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this journey timeline event?')) return;
    setJourney((prev) => prev.filter((j) => j.id !== id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedEntry: JourneyEntry = {
      ...formData,
      id: view === 'add' ? 'journey-' + Date.now().toString() : currentEntry!.id,
      technologies: techInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (view === 'add') {
      setJourney((prev) => [...prev, formattedEntry]);
    } else {
      setJourney((prev) => prev.map((j) => (j.id === formattedEntry.id ? formattedEntry : j)));
    }
    setView('list');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/journey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(journey),
      });

      if (res.ok) {
        const sorted = await res.json();
        setJourney(sorted);
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save timeline entries.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 text-sm">
      {saveSuccess && (
        <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2 font-mono text-xs">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
          <span>Timeline sequence written and verified in data storage!</span>
        </div>
      )}

      {view === 'list' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-xs font-mono text-zinc-450">Active Milestones ({journey.length})</h2>
            <button
              onClick={handleAddClick}
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer text-xs font-mono"
            >
              <Plus className="h-4 w-4" />
              <span>ADD EVENT</span>
            </button>
          </div>

          {journey.length === 0 ? (
            <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20">
              <History className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
              <p className="text-zinc-450 dark:text-zinc-500 font-mono text-xs">No career journey logs. Click Add Event to configure timeline milestones.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
              <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left font-mono text-xs">
                <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                  <tr>
                    <th className="px-4 py-3 font-semibold">YEAR</th>
                    <th className="px-4 py-3 font-semibold">TITLE</th>
                    <th className="px-4 py-3 font-semibold">TYPE</th>
                    <th className="px-4 py-3 font-semibold">STATUS</th>
                    <th className="px-4 py-3 font-semibold text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/10">
                  {journey.map((entry) => (
                    <tr key={entry.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/30 text-zinc-750 dark:text-zinc-350">
                      <td className="px-4 py-3 font-bold text-zinc-900 dark:text-zinc-150">{entry.year}</td>
                      <td className="px-4 py-3 font-semibold font-sans text-sm text-zinc-900 dark:text-zinc-150">{entry.title}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 text-[10px] border border-zinc-200 dark:border-zinc-800 text-zinc-500 dark:text-zinc-400">
                          {entry.type}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {entry.status ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-[10px] text-emerald-400">
                            {entry.status}
                          </span>
                        ) : (
                          <span className="text-zinc-550">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => handleEditClick(entry)}
                          className="p-1 text-zinc-500 hover:text-emerald-500 cursor-pointer"
                        >
                          <Edit3 className="h-4.5 w-4.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(entry.id)}
                          className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="inline-flex items-center space-x-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg transition-all disabled:opacity-50 cursor-pointer text-xs font-mono"
            >
              <Save className="h-4 w-4" />
              <span>{isSaving ? 'SYNCING DATABASE...' : 'SAVE JOURNEY TIMELINE'}</span>
            </button>
          </div>
        </div>
      ) : (
        /* Form View */
        <form onSubmit={handleSubmitForm} className="space-y-6">
          <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <button
              type="button"
              onClick={() => setView('list')}
              className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded text-zinc-500 cursor-pointer"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h2 className="font-bold text-sm font-mono tracking-tight text-zinc-850 dark:text-zinc-205">
              {view === 'add' ? 'ADD JOURNEY EVENT' : 'EDIT TIMELINE MILESTONE'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="year" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Event Year *</label>
              <input
                type="text"
                id="year"
                required
                placeholder="e.g. 2026"
                value={formData.year}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="type" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Classification Type *</label>
              <select
                id="type"
                value={formData.type}
                onChange={handleFormChange}
                className="w-full px-2 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
              >
                {TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="status" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Status</label>
              <input
                type="text"
                id="status"
                placeholder="e.g. Completed, In Progress"
                value={formData.status || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Event Heading *</label>
            <input
              type="text"
              id="title"
              required
              placeholder="e.g. Pursuing MCA Sem-1"
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Detailed Description *</label>
            <textarea
              id="description"
              required
              rows={3}
              placeholder="Provide a short write-up regarding the career or educational event..."
              value={formData.description}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
              <label htmlFor="link" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Milestone External link</label>
              <input
                type="url"
                id="link"
                placeholder="e.g. URL to certificate or project"
                value={formData.link || ''}
                onChange={handleFormChange}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="technologies" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">
                Technologies Stack (Comma-separated)
              </label>
              <input
                type="text"
                id="technologies"
                placeholder="e.g. Next.js, Python"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              className="inline-flex items-center space-x-2 px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold"
            >
              <span>CONFIRM EVENT</span>
            </button>
            <button
              type="button"
              onClick={() => setView('list')}
              className="inline-flex items-center space-x-2 px-5 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg transition-all cursor-pointer text-xs font-mono text-zinc-500"
            >
              <span>CANCEL</span>
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
