'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Project, ProjectCategory, ProjectStatus } from '@/types';
import { Plus, Edit3, Trash2, ArrowLeft, Save, Star, Folder } from 'lucide-react';
import { FileUploadInput } from '@/components/admin/FileUploadInput';

interface ProjectsCrudPanelProps {
  initialProjects: Project[];
}

const CATEGORIES: ProjectCategory[] = ['Web', 'JavaScript', 'React', 'Next.js', 'Python', 'AI/ML', 'Data Analytics', 'Other'];
const STATUSES: ProjectStatus[] = ['Planning', 'In Progress', 'Completed', 'Maintained'];

const EMPTY_PROJECT: Omit<Project, 'id' | 'slug'> = {
  title: '',
  description: '',
  longDescription: '',
  image: '',
  screenshots: [],
  technologies: [],
  category: 'Web',
  githubUrl: '',
  liveUrl: '',
  status: 'Completed',
  featured: false,
  startDate: '',
  endDate: '',
  features: [],
  challenges: [],
  learnings: [],
};

export function ProjectsCrudPanel({ initialProjects }: ProjectsCrudPanelProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState<Omit<Project, 'id' | 'slug'>>(EMPTY_PROJECT);
  
  // Custom tag inputs
  const [techInput, setTechInput] = useState('');
  const [featureInput, setFeatureInput] = useState('');
  const [challengeInput, setChallengeInput] = useState('');
  const [learningInput, setLearningInput] = useState('');

  const router = useRouter();
  const searchParams = useSearchParams();

  // Listen to quick-action URL params
  useEffect(() => {
    const action = searchParams.get('action');
    if (action === 'new') {
      handleAddClick();
    }
  }, [searchParams]);

  const handleAddClick = () => {
    setFormData(EMPTY_PROJECT);
    setTechInput('');
    setFeatureInput('');
    setChallengeInput('');
    setLearningInput('');
    setView('add');
  };

  const handleEditClick = (project: Project) => {
    setCurrentProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      longDescription: project.longDescription,
      image: project.image,
      screenshots: project.screenshots || [],
      technologies: project.technologies || [],
      category: project.category,
      githubUrl: project.githubUrl || '',
      liveUrl: project.liveUrl || '',
      status: project.status,
      featured: project.featured || false,
      startDate: project.startDate || '',
      endDate: project.endDate || '',
      features: project.features || [],
      challenges: project.challenges || [],
      learnings: project.learnings || [],
    });
    setTechInput((project.technologies || []).join(', '));
    setFeatureInput((project.features || []).join('\n'));
    setChallengeInput((project.challenges || []).join('\n'));
    setLearningInput((project.learnings || []).join('\n'));
    setView('edit');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
        router.refresh();
      } else {
        alert('Failed to delete project.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map inputs to list arrays
    const formattedData = {
      ...formData,
      technologies: techInput.split(',').map(s => s.trim()).filter(Boolean),
      features: featureInput.split('\n').map(s => s.trim()).filter(Boolean),
      challenges: challengeInput.split('\n').map(s => s.trim()).filter(Boolean),
      learnings: learningInput.split('\n').map(s => s.trim()).filter(Boolean),
      image: formData.image || '/images/project-cms.jpg' // Default placeholder if empty
    };

    try {
      let res;
      if (view === 'add') {
        res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        });
      } else {
        res = await fetch(`/api/projects/${currentProject?.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formattedData),
        });
      }

      if (res.ok) {
        const savedProject = await res.json();
        if (view === 'add') {
          setProjects((prev) => [...prev, savedProject]);
        } else {
          setProjects((prev) => prev.map((p) => (p.id === savedProject.id ? savedProject : p)));
        }
        setView('list');
        router.refresh();
      } else {
        alert('Failed to publish project.');
      }
    } catch (err) {
      console.error(err);
      alert('An error occurred.');
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, checked } = e.target;
    setFormData((prev) => ({ ...prev, [id]: checked }));
  };

  if (view === 'list') {
    return (
      <div className="space-y-6 text-sm">
        {/* List Header */}
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-sm font-mono text-zinc-450">Active Projects ({projects.length})</h2>
          <button
            onClick={handleAddClick}
            className="inline-flex items-center space-x-1.5 px-3 py-1.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-md transition-colors cursor-pointer text-xs font-mono"
          >
            <Plus className="h-4 w-4" />
            <span>ADD PROJECT</span>
          </button>
        </div>

        {/* Project Table Grid */}
        {projects.length === 0 ? (
          <div className="py-12 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-zinc-50/20 dark:bg-zinc-950/20">
            <Folder className="h-10 w-10 text-zinc-300 dark:text-zinc-700 mx-auto mb-2" />
            <p className="text-zinc-450 dark:text-zinc-500 font-mono text-xs">No projects registered. Click Add Project to publish one.</p>
          </div>
        ) : (
          <div className="overflow-x-auto border border-zinc-200 dark:border-zinc-800 rounded-lg">
            <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800 text-left font-mono text-xs">
              <thead className="bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500">
                <tr>
                  <th className="px-4 py-3 font-semibold">TITLE</th>
                  <th className="px-4 py-3 font-semibold">CATEGORY</th>
                  <th className="px-4 py-3 font-semibold">STATUS</th>
                  <th className="px-4 py-3 font-semibold">FEATURED</th>
                  <th className="px-4 py-3 font-semibold text-right">ACTIONS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 bg-white dark:bg-zinc-900/10">
                {projects.map((project) => (
                  <tr key={project.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-950/30 text-zinc-750 dark:text-zinc-300">
                    <td className="px-4 py-3 font-semibold font-sans text-sm text-zinc-900 dark:text-zinc-100">
                      {project.title}
                    </td>
                    <td className="px-4 py-3">{project.category}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] border ${
                        project.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      }`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {project.featured ? (
                        <Star className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                      ) : (
                        <span className="text-zinc-500">-</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(project)}
                        className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-emerald-500 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="p-1 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-500 hover:text-red-500 cursor-pointer"
                        title="Delete Project"
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
      </div>
    );
  }

  // Add / Edit form layout
  return (
    <div className="space-y-6 text-sm">
      {/* Form Header */}
      <div className="flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('list')}
            className="p-1 rounded hover:bg-zinc-150 dark:hover:bg-zinc-800 text-zinc-500 cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h2 className="font-bold text-sm font-mono tracking-tight text-zinc-800 dark:text-zinc-200">
            {view === 'add' ? 'ADD NEW PROJECT' : `EDIT: ${currentProject?.title.toUpperCase()}`}
          </h2>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title, Category & Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="title" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Project Title *</label>
            <input
              type="text"
              id="title"
              required
              value={formData.title}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="category" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Category *</label>
            <select
              id="category"
              value={formData.category}
              onChange={handleFormChange}
              className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="status" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Project Status *</label>
            <select
              id="status"
              value={formData.status}
              onChange={handleFormChange}
              className="w-full px-3 py-2.5 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs font-mono"
            >
              {STATUSES.map((stat) => (
                <option key={stat} value={stat}>{stat}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Short Description */}
        <div className="space-y-1.5">
          <label htmlFor="description" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Short Summary *</label>
          <input
            type="text"
            id="description"
            required
            value={formData.description}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Long Description */}
        <div className="space-y-1.5">
          <label htmlFor="longDescription" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Detailed Narrative Overview *</label>
          <textarea
            id="longDescription"
            required
            rows={4}
            value={formData.longDescription}
            onChange={handleFormChange}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* URLs, Dates, & featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="githubUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">GitHub Repository URL</label>
            <input
              type="url"
              id="githubUrl"
              value={formData.githubUrl}
              onChange={handleFormChange}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="liveUrl" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">Live Demonstration URL</label>
            <input
              type="url"
              id="liveUrl"
              value={formData.liveUrl}
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

          <div className="md:col-span-2">
            <FileUploadInput
              id="image"
              label="Project Card Image"
              value={formData.image}
              onChange={(url) => setFormData((prev) => ({ ...prev, image: url }))}
              accept="image/*"
              fileType="image"
              description="Click to select & upload project cover photo from disk"
            />
          </div>

          <div className="flex items-center pt-6 space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-emerald-500 border-zinc-300 dark:border-zinc-800 rounded focus:ring-emerald-400 focus:outline-none"
            />
            <label htmlFor="featured" className="text-xs font-mono font-bold text-zinc-650 dark:text-zinc-400">
              FEATURED PROJECT (High priority display)
            </label>
          </div>
        </div>

        {/* Technologies List */}
        <div className="space-y-1.5">
          <label htmlFor="technologies" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">
            Technologies Stack (Comma-separated)
          </label>
          <input
            type="text"
            id="technologies"
            placeholder="e.g. React, Next.js, TypeScript, Tailwind CSS"
            value={techInput}
            onChange={(e) => setTechInput(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Features, Challenges & Learnings Lists */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1.5">
            <label htmlFor="features" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">
              Key Features (One per line)
            </label>
            <textarea
              id="features"
              rows={4}
              placeholder="e.g. Secure administrative console&#10;Dynamic file operations"
              value={featureInput}
              onChange={(e) => setFeatureInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="challenges" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">
              Challenges Faced (One per line)
            </label>
            <textarea
              id="challenges"
              rows={4}
              placeholder="e.g. Serverless filesystem permissions&#10;Token edge validation details"
              value={challengeInput}
              onChange={(e) => setChallengeInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="learnings" className="text-xs font-mono text-zinc-400 dark:text-zinc-550">
              Takeaways &amp; Learnings (One per line)
            </label>
            <textarea
              id="learnings"
              rows={4}
              placeholder="e.g. Solidified NextJS Server Actions&#10;TailwindCSS v4 theme variables configurations"
              value={learningInput}
              onChange={(e) => setLearningInput(e.target.value)}
              className="w-full px-3 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-zinc-50/50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 text-xs"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex space-x-3">
          <button
            type="submit"
            className="inline-flex items-center space-x-2 px-5 py-2.5 font-bold text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg transition-all cursor-pointer text-xs font-mono"
          >
            <Save className="h-4 w-4" />
            <span>{view === 'add' ? 'PUBLISH PROJECT' : 'SAVE CHANGES'}</span>
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            className="inline-flex items-center space-x-2 px-5 py-2.5 font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg transition-all cursor-pointer text-xs font-mono text-zinc-600 dark:text-zinc-350"
          >
            <span>CANCEL</span>
          </button>
        </div>
      </form>
    </div>
  );
}
