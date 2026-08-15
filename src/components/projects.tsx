'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Project, ProjectCategory } from '@/types';
import { ExternalLink, Search, Star, Folder } from 'lucide-react';
import { Github } from '@/components/icons';

interface ProjectsProps {
  projects: Project[];
}

type FilterTab = 'All' | 'Web' | 'AI/ML' | 'Data' | 'Python' | 'Other';

export function Projects({ projects }: ProjectsProps) {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Helper to determine if a project matches the active filter tab
  const matchesFilter = (project: Project, filter: FilterTab) => {
    const category = project.category;
    switch (filter) {
      case 'Web':
        return ['Web', 'React', 'Next.js', 'JavaScript'].includes(category);
      case 'AI/ML':
        return category === 'AI/ML';
      case 'Data':
        return category === 'Data Analytics';
      case 'Python':
        return category === 'Python';
      case 'Other':
        return category === 'Other';
      case 'All':
      default:
        return true;
    }
  };

  // Filter and search logic
  const filteredProjects = projects.filter((project) => {
    const matchesCategory = matchesFilter(project, activeFilter);
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  const filterTabs: FilterTab[] = ['All', 'Web', 'AI/ML', 'Data', 'Python', 'Other'];

  return (
    <section id="projects" className="py-20 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/50 dark:bg-zinc-900/10">
      <div className="max-w-6xl mx-auto px-4">
        {/* Section Heading */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
          <div className="flex flex-col items-start space-y-3">
            <h2 className="text-3xl font-bold tracking-tight font-mono">
              <span className="text-emerald-600 dark:text-emerald-500 mr-2">&gt;</span>Featured Projects
            </h2>
            <div className="h-1 w-12 bg-emerald-500 rounded" />
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-72">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-zinc-400">
              <Search className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder="Search by name or tech..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 rounded-lg bg-white dark:bg-zinc-950 text-sm font-mono text-zinc-800 dark:text-zinc-100 focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 mb-10">
          {filterTabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveFilter(tab)}
              className={`px-4 py-1.5 rounded-lg text-xs font-mono border transition-all cursor-pointer ${
                activeFilter === tab
                  ? 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500'
                  : 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-800 text-zinc-600 dark:text-zinc-400 hover:border-zinc-300 dark:hover:border-zinc-700'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        {filteredProjects.length === 0 ? (
          <div className="py-16 text-center border border-dashed border-zinc-200 dark:border-zinc-800 rounded-xl bg-white dark:bg-zinc-900/10">
            <Folder className="h-12 w-12 text-zinc-300 dark:text-zinc-700 mx-auto mb-4" />
            <p className="text-zinc-500 dark:text-zinc-500 font-mono text-sm">No projects found matching the criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="group relative flex flex-col rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 overflow-hidden hover:shadow-md hover:border-emerald-500/20 dark:hover:border-emerald-500/20 transition-all duration-300"
              >
                {/* Visual Area / Placeholder Image */}
                <div className="relative h-48 bg-zinc-100 dark:bg-zinc-900 overflow-hidden border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-center">
                  {/* Since we don't have actual uploads yet, we can render a beautiful stylized icon grid code mockup */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 group-hover:scale-105 transition-transform duration-500 flex flex-col justify-center items-center p-6 text-center select-none font-mono">
                    <Folder className="h-10 w-10 text-emerald-600/30 dark:text-emerald-500/30 mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{project.category} Project</span>
                    <span className="text-xs font-bold text-zinc-700 dark:text-zinc-400 mt-1 truncate max-w-[80%]">{project.title}</span>
                  </div>

                  {/* Featured Badge */}
                  {project.featured && (
                    <div className="absolute top-3 right-3 inline-flex items-center space-x-1 px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-[10px] font-bold text-emerald-700 dark:text-emerald-400">
                      <Star className="h-3 w-3 fill-emerald-500/30" />
                      <span>Featured</span>
                    </div>
                  )}

                  {/* Status Badge */}
                  <div className="absolute bottom-3 left-3 px-2 py-0.5 rounded bg-zinc-950/80 text-[10px] font-mono text-zinc-300 border border-zinc-800">
                    {project.status}
                  </div>
                </div>

                {/* Content Area */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-50 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                      {project.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 line-clamp-3 leading-relaxed">
                      {project.description}
                    </p>
                  </div>

                  {/* Tech stack */}
                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {project.technologies.slice(0, 5).map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-0.5 rounded bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-[10px] font-mono text-zinc-500 dark:text-zinc-400"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.technologies.length > 5 && (
                      <span className="px-2 py-0.5 text-[10px] font-mono text-zinc-400">
                        +{project.technologies.length - 5} more
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-zinc-900">
                    <Link
                      href={`/projects/${project.slug}`}
                      className="text-xs font-mono text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center space-x-1"
                    >
                      <span>View Details</span>
                      <span>→</span>
                    </Link>

                    <div className="flex items-center space-x-3 text-zinc-500 dark:text-zinc-400">
                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                          title="GitHub Repository"
                          aria-label="GitHub Repository"
                        >
                          <Github className="h-4.5 w-4.5" />
                        </a>
                      )}
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:text-zinc-900 dark:hover:text-white transition-colors"
                          title="Live Demo"
                          aria-label="Live Demo"
                        >
                          <ExternalLink className="h-4.5 w-4.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
