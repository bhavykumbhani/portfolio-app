'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Experience } from '@/types';
import { Plus, Edit3, Trash2, ArrowLeft, Save, CheckCircle, Briefcase } from 'lucide-react';

interface ExperienceCrudPanelProps {
  initialExperiences: Experience[];
}

const EMPTY_EXP: Omit<Experience, 'id'> = {
  company: '',
  role: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  technologies: [],
  website: '',
  logo: '',
};

export function ExperienceCrudPanel({ initialExperiences }: ExperienceCrudPanelProps) {
  const [experiences, setExperiences] = useState<Experience[]>(initialExperiences);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentExp, setCurrentExp] = useState<Experience | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Omit<Experience, 'id'>>(EMPTY_EXP);
  const [techInput, setTechInput] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add') {
      handleAddClick();
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setFormData(EMPTY_EXP);
    setTechInput('');
    setView('add');
  };

  const handleEditClick = (exp: Experience) => {
    setCurrentExp(exp);
    setFormData({
      company: exp.company,
      role: exp.role,
      location: exp.location,
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description,
      technologies: exp.technologies || [],
      website: exp.website || '',
      logo: exp.logo || '',
    });
    setTechInput((exp.technologies || []).join(', '));
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this experience entry?')) return;
    setExperiences((prev) => prev.filter((e) => e.id !== id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedExp: Experience = {
      ...formData,
      id: view === 'add' ? 'exp-' + Date.now().toString() : currentExp!.id,
      technologies: techInput.split(',').map((s) => s.trim()).filter(Boolean),
    };

    if (view === 'add') {
      setExperiences((prev) => [...prev, formattedExp]);
    } else {
      setExperiences((prev) => prev.map((e) => (e.id === formattedExp.id ? formattedExp : e)));
    }
    setView('list');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/experience', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(experiences),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save experience information.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    } finally {
      setIsSaving(false);
    }
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 text-sm">
        {saveSuccess && (
          <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2 font-mono text-xs">
            <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
            <span>Experiences list successfully written to local database!</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xs font-mono text-zinc-450">Active Logs ({experiences.length})</h2>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer text-xs font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>ADD EXPERIENCE</span>
          </button>
        </div>

        {experiences.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20">
            <Briefcase className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-455 dark:text-zinc-500 font-mono text-xs">No experience logs found. Under display placeholder.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left font-mono text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">ROLE</th>
                  <th className="px-4 py-3 font-semibold">COMPANY</th>
                  <th className="px-4 py-3 font-semibold">DURATION</th>
                  <th className="px-4 py-3 font-semibold">LOCATION</th>
                  <th className="px-4 py-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/10">
                {experiences.map((exp) => (
                  <tr key={exp.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/30 text-zinc-750 dark:text-zinc-350">
                    <td className="px-4 py-3 font-semibold font-sans text-sm text-zinc-900 dark:text-zinc-100">{exp.role}</td>
                    <td className="px-4 py-3">{exp.company}</td>
                    <td className="px-4 py-3">{exp.startDate} — {exp.endDate}</td>
                    <td className="px-4 py-3">{exp.location}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(exp)}
                        className="p-1 text-zinc-500 hover:text-emerald-500 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(exp.id)}
                        className="p-1 text-zinc-500 hover:text-red-500 cursor-pointer"
                      >
                        <Trash2 className="h-4 w-4" />
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
            <span>{isSaving ? 'PERSISTING DATA...' : 'SAVE DATA CHANGES'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Add / Edit Form Panel
  return (
    <div className="space-y-6 text-sm">
      <div className="flex items-center space-x-2 border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <button
          onClick={() => setView('list')}
          className="p-1 hover:bg-zinc-100 dark:hover:bg-zinc-850 rounded text-zinc-500 cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <h2 className="font-bold text-sm font-mono tracking-tight text-zinc-850 dark:text-zinc-205">
          {view === 'add' ? 'ADD EXPERIENCE ENTRY' : 'EDIT EXPERIENCE DETAILS'}
        </h2>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="role" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Role / Title *</label>
            <input
              type="text"
              id="role"
              required
              placeholder="e.g. Intern Developer"
              value={formData.role}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="company" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Company / Organization Name *</label>
            <input
              type="text"
              id="company"
              required
              value={formData.company}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="startDate" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Start Date (YYYY-MM) *</label>
            <input
              type="text"
              id="startDate"
              required
              placeholder="e.g. 2026-06"
              value={formData.startDate}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="endDate" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">End Date (YYYY-MM or "Present") *</label>
            <input
              type="text"
              id="endDate"
              required
              placeholder="e.g. 2026-08 or Present"
              value={formData.endDate}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Location *</label>
            <input
              type="text"
              id="location"
              required
              placeholder="e.g. Gujarat, India"
              value={formData.location}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="website" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Company Website</label>
            <input
              type="url"
              id="website"
              value={formData.website}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Role Description *</label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="technologies" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">
            Technologies Utilized (Comma-separated)
          </label>
          <input
            type="text"
            id="technologies"
            placeholder="e.g. Next.js, Node.js, Python"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold"
          >
            <span>CONFIRM ENTRY</span>
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
    </div>
  );
}
