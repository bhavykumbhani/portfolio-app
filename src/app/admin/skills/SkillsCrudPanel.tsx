'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Skill, SkillCategory, SkillStatus } from '@/types';
import { Plus, Trash2, Save, CheckCircle, ArrowRight } from 'lucide-react';

interface SkillsCrudPanelProps {
  initialSkills: Skill[];
}

const CATEGORIES: SkillCategory[] = ['Web Development', 'Programming', 'AI / ML', 'Data Analytics', 'Tools'];
const STATUSES: SkillStatus[] = ['Learning', 'Familiar', 'Building With', 'Advanced'];

export function SkillsCrudPanel({ initialSkills }: SkillsCrudPanelProps) {
  const [skills, setSkills] = useState<Skill[]>(initialSkills);
  
  // New Skill Form
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState<SkillCategory>('Web Development');
  const [newSkillStatus, setNewSkillStatus] = useState<SkillStatus>('Learning');
  
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const nameInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Listen to quick parameter actions
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'add' && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [searchParams]);

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    const id = newSkillName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    
    // Check duplication
    if (skills.some((s) => s.id === id)) {
      alert('A skill with this name already exists.');
      return;
    }

    const newSkill: Skill = {
      id,
      name: newSkillName.trim(),
      category: newSkillCategory,
      status: newSkillStatus,
    };

    setSkills((prev) => [...prev, newSkill]);
    setNewSkillName('');
  };

  const handleDeleteSkill = (id: string) => {
    setSkills((prev) => prev.filter((s) => s.id !== id));
  };

  const handleStatusChange = (id: string, status: SkillStatus) => {
    setSkills((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status } : s))
    );
  };

  const handleSaveChanges = async () => {
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(skills),
      });

      if (res.ok) {
        setSaveSuccess(true);
        router.refresh();
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert('Failed to save skills stack.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8 text-sm">
      {saveSuccess && (
        <div className="p-3.5 rounded border border-emerald-500/20 bg-emerald-500/5 text-emerald-800 dark:text-emerald-400 flex items-center space-x-2 font-mono text-xs">
          <CheckCircle className="h-4.5 w-4.5 text-emerald-500" />
          <span>Skills layout configuration successfully written to source files!</span>
        </div>
      )}

      {/* Add Skill Form Section */}
      <div className="p-5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950/20">
        <h3 className="font-bold text-xs font-mono text-zinc-400 uppercase tracking-wider mb-4">Add Tech Skill</h3>
        <form onSubmit={handleAddSkill} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="space-y-1.5 flex-1 w-full">
            <label className="text-xs font-mono text-zinc-400">Skill Name</label>
            <input
              ref={nameInputRef}
              type="text"
              placeholder="e.g. PyTorch"
              required
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="space-y-1.5 w-full sm:w-44">
            <label className="text-xs font-mono text-zinc-400">Category</label>
            <select
              value={newSkillCategory}
              onChange={(e) => setNewSkillCategory(e.target.value as SkillCategory)}
              className="w-full px-2 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5 w-full sm:w-40">
            <label className="text-xs font-mono text-zinc-400">Expertise</label>
            <select
              value={newSkillStatus}
              onChange={(e) => setNewSkillStatus(e.target.value as SkillStatus)}
              className="w-full px-2 py-2 border border-zinc-200 dark:border-zinc-800 rounded bg-white dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-emerald-600 dark:bg-emerald-500 hover:opacity-90 transition-opacity text-white font-bold rounded flex items-center justify-center space-x-1 w-full sm:w-auto text-xs font-mono h-[34px] cursor-pointer"
          >
            <Plus className="h-4 w-4" />
            <span>ADD</span>
          </button>
        </form>
      </div>

      {/* Categorized Skills list editing */}
      <div className="space-y-6">
        <h3 className="font-bold text-xs font-mono text-zinc-400 uppercase tracking-wider">Configure Current Stack</h3>
        <div className="space-y-6">
          {CATEGORIES.map((category) => {
            const categorySkills = skills.filter((s) => s.category === category);
            if (categorySkills.length === 0) return null;

            return (
              <div key={category} className="space-y-2 border-b border-zinc-100 dark:border-zinc-900 pb-5 last:border-b-0 last:pb-0">
                <h4 className="font-bold text-xs font-mono text-emerald-600 dark:text-emerald-400 tracking-tight">{category}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="p-3 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 flex items-center justify-between"
                    >
                      <span className="font-semibold text-xs text-zinc-800 dark:text-zinc-100">{skill.name}</span>
                      <div className="flex items-center space-x-2">
                        <select
                          value={skill.status}
                          onChange={(e) => handleStatusChange(skill.id, e.target.value as SkillStatus)}
                          className="px-1.5 py-0.5 border border-zinc-200 dark:border-zinc-800 rounded bg-zinc-50 dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-[10px] focus:outline-none focus:border-emerald-500 font-mono"
                        >
                          {STATUSES.map((stat) => (
                            <option key={stat} value={stat}>{stat}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleDeleteSkill(skill.id)}
                          className="p-1 rounded text-zinc-400 hover:text-red-500 hover:bg-zinc-50 dark:hover:bg-zinc-900 cursor-pointer"
                          title="Remove Skill"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
        <button
          onClick={handleSaveChanges}
          disabled={isSaving}
          className="inline-flex items-center space-x-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg transition-all disabled:opacity-50 cursor-pointer text-xs font-mono"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'PERSISTING CHANGES...' : 'SAVE STACK CONFIGURATION'}</span>
        </button>
      </div>
    </div>
  );
}
