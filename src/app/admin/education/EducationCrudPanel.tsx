'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Education } from '@/types';
import { Plus, Edit3, Trash2, ArrowLeft, Save, CheckCircle, GraduationCap } from 'lucide-react';

interface EducationCrudPanelProps {
  initialEducation: Education[];
}

const EMPTY_EDU: Omit<Education, 'id'> = {
  degree: '',
  institution: '',
  location: '',
  startDate: '',
  endDate: '',
  description: '',
  grade: '',
};

export function EducationCrudPanel({ initialEducation }: EducationCrudPanelProps) {
  const [education, setEducation] = useState<Education[]>(initialEducation);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentEdu, setCurrentEdu] = useState<Education | null>(null);
  
  // Form State
  const [formData, setFormData] = useState<Omit<Education, 'id'>>(EMPTY_EDU);
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const router = useRouter();

  const handleAddClick = () => {
    setFormData(EMPTY_EDU);
    setView('add');
  };

  const handleEditClick = (edu: Education) => {
    setCurrentEdu(edu);
    setFormData({
      degree: edu.degree,
      institution: edu.institution,
      location: edu.location,
      startDate: edu.startDate,
      endDate: edu.endDate,
      description: edu.description,
      grade: edu.grade || '',
    });
    setView('edit');
  };

  const handleDelete = (id: string) => {
    if (!confirm('Remove this education entry?')) return;
    setEducation((prev) => prev.filter((e) => e.id !== id));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formattedEdu: Education = {
      ...formData,
      id: view === 'add' ? 'edu-' + Date.now().toString() : currentEdu!.id,
    };

    if (view === 'add') {
      setEducation((prev) => [...prev, formattedEdu]);
    } else {
      setEducation((prev) => prev.map((e) => (e.id === formattedEdu.id ? formattedEdu : e)));
    }
    setView('list');
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/education', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(education),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save education info.');
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
            <span>Academic database files successfully updated!</span>
          </div>
        )}

        <div className="flex justify-between items-center">
          <h2 className="font-bold text-xs font-mono text-zinc-455">Degrees ({education.length})</h2>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer text-xs font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>ADD EDUCATION</span>
          </button>
        </div>

        {education.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20">
            <GraduationCap className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-450 dark:text-zinc-505 font-mono text-xs">No academic nodes recorded yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left font-mono text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">DEGREE</th>
                  <th className="px-4 py-3 font-semibold">INSTITUTION</th>
                  <th className="px-4 py-3 font-semibold">DURATION</th>
                  <th className="px-4 py-3 font-semibold">GRADE</th>
                  <th className="px-4 py-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/10">
                {education.map((edu) => (
                  <tr key={edu.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-955/30 text-zinc-750 dark:text-zinc-350">
                    <td className="px-4 py-3 font-semibold font-sans text-sm text-zinc-900 dark:text-zinc-100">{edu.degree}</td>
                    <td className="px-4 py-3">{edu.institution}</td>
                    <td className="px-4 py-3">{edu.startDate} — {edu.endDate}</td>
                    <td className="px-4 py-3">{edu.grade || '-'}</td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(edu)}
                        className="p-1 text-zinc-500 hover:text-emerald-500 cursor-pointer"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(edu.id)}
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
            <span>{isSaving ? 'UPDATING FILES...' : 'SAVE DATA CHANGES'}</span>
          </button>
        </div>
      </div>
    );
  }

  // Form Panel
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
          {view === 'add' ? 'ADD EDUCATION RECORD' : 'EDIT EDUCATION DETAILS'}
        </h2>
      </div>

      <form onSubmit={handleSubmitForm} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="degree" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Degree Name *</label>
            <input
              type="text"
              id="degree"
              required
              placeholder="e.g. Master of Computer Applications (MCA)"
              value={formData.degree}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="institution" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Institution Name *</label>
            <input
              type="text"
              id="institution"
              required
              value={formData.institution}
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
              placeholder="e.g. 2028-05 or Present"
              value={formData.endDate}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Location *</label>
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
            <label htmlFor="grade" className="text-xs font-mono text-zinc-400 dark:text-zinc-555">Grade / GPA / Status</label>
            <input
              type="text"
              id="grade"
              placeholder="e.g. 8.5 CGPA, Pursuing"
              value={formData.grade}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Description / Focus Areas *</label>
          <textarea
            id="description"
            required
            rows={4}
            value={formData.description}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-955 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer text-xs font-mono font-bold"
          >
            <span>CONFIRM RECORD</span>
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
