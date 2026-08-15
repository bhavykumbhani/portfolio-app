import React from 'react';
import Link from 'next/link';
import { getProjects } from '@/lib/data-service';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getProfile } from '@/lib/data-service';
import { ArrowLeft, ExternalLink, Calendar, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { Github } from '@/components/icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 0; // Ensure live data updates are fetched

export default async function ProjectDetailPage({ params }: PageProps) {
  const { slug } = await params;
  
  const [profile, projects] = await Promise.all([
    getProfile(),
    getProjects()
  ]);

  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <>
        <Navbar profileName={profile.name} githubUrl={profile.githubUrl} linkedinUrl={profile.linkedinUrl} />
        <main className="flex-1 flex flex-col items-center justify-center py-20 text-center px-4 font-mono">
          <h1 className="text-3xl font-bold text-red-500 mb-4">&gt; 404: Project Not Found</h1>
          <p className="text-zinc-500 dark:text-zinc-400 mb-8">The project slug "{slug}" does not exist in the collection.</p>
          <Link
            href="/#projects"
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white text-sm font-semibold rounded-lg shadow-sm hover:shadow transition-all"
          >
            Return to Projects
          </Link>
        </main>
        <Footer profile={profile} />
      </>
    );
  }

  return (
    <>
      <Navbar profileName={profile.name} githubUrl={profile.githubUrl} linkedinUrl={profile.linkedinUrl} />

      <main className="flex-1 max-w-4xl mx-auto px-4 py-12 md:py-20 space-y-12">
        {/* Back navigation */}
        <Link
          href="/#projects"
          className="inline-flex items-center space-x-2 text-xs font-mono text-zinc-550 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Home</span>
        </Link>

        {/* Project Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-xs font-mono text-emerald-700 dark:text-emerald-400 font-medium">
              {project.category}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-500 dark:text-zinc-400">
              {project.status}
            </span>
            <span className="flex items-center space-x-1.5 text-xs text-zinc-500 font-mono">
              <Calendar className="h-3.5 w-3.5" />
              <span>{project.startDate} — {project.endDate}</span>
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 leading-tight">
            {project.title}
          </h1>

          <p className="text-lg text-zinc-600 dark:text-zinc-350 leading-relaxed font-sans border-l-2 border-emerald-500/60 pl-4 py-1">
            {project.description}
          </p>
        </div>

        {/* Large Image Visual Area */}
        <div className="relative h-64 sm:h-96 w-full rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/30 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 flex flex-col justify-center items-center p-6 text-center select-none font-mono">
            <Layers className="h-16 w-16 text-emerald-600/30 dark:text-emerald-500/30 mb-3" />
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 uppercase tracking-widest">{project.category} Core Showcase</span>
            <span className="text-sm font-bold text-zinc-700 dark:text-zinc-400 mt-2 truncate max-w-[80%]">{project.title}</span>
          </div>
        </div>

        {/* Action Links */}
        <div className="flex flex-wrap items-center gap-4 pt-2">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 font-medium border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-sm transition-all"
            >
              <Github className="h-4 w-4" />
              <span>GitHub Repo</span>
            </a>
          )}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-2 px-5 py-2.5 font-medium text-white bg-emerald-600 hover:bg-emerald-500 dark:bg-emerald-500 dark:hover:bg-emerald-400 rounded-lg text-sm shadow-sm hover:shadow transition-all"
            >
              <ExternalLink className="h-4 w-4" />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>

        {/* Detailed Write-Up Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pt-8 border-t border-zinc-150 dark:border-zinc-900">
          
          {/* Main Details (Col-span 8) */}
          <div className="md:col-span-8 space-y-8">
            {/* Long Description */}
            <div className="space-y-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
                <span className="text-emerald-600 dark:text-emerald-500 mr-1.5">#</span>Project Overview
              </h2>
              <p className="text-zinc-650 dark:text-zinc-400 leading-relaxed text-sm">
                {project.longDescription}
              </p>
            </div>

            {/* Features list */}
            {project.features && project.features.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-500 mr-1.5">#</span>Key Features
                </h2>
                <ul className="space-y-2.5 text-zinc-650 dark:text-zinc-400 text-sm">
                  {project.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start space-x-2">
                      <ShieldCheck className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Challenges faced */}
            {project.challenges && project.challenges.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-500 mr-1.5">#</span>Challenges &amp; Adaptations
                </h2>
                <ul className="space-y-3.5 text-zinc-650 dark:text-zinc-400 text-sm">
                  {project.challenges.map((challenge, idx) => (
                    <li key={idx} className="flex items-start space-x-3 p-4 rounded-lg border border-red-500/10 bg-red-500/5 dark:bg-red-500/2">
                      <HelpCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
                      <span>{challenge}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Learnings */}
            {project.learnings && project.learnings.length > 0 && (
              <div className="space-y-3">
                <h2 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100 font-mono">
                  <span className="text-emerald-600 dark:text-emerald-500 mr-1.5">#</span>Key Takeaways &amp; Learnings
                </h2>
                <ul className="space-y-2.5 text-zinc-650 dark:text-zinc-400 text-sm list-disc pl-5">
                  {project.learnings.map((learning, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {learning}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Sidebar Metadata (Col-span 4) */}
          <div className="md:col-span-4 space-y-6">
            {/* Tech stack card */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-4">
              <h3 className="text-xs font-mono text-zinc-450 uppercase tracking-widest">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="px-2.5 py-1 rounded bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 text-xs font-mono text-zinc-700 dark:text-zinc-300"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Category card */}
            <div className="p-5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20 space-y-2.5">
              <h3 className="text-xs font-mono text-zinc-450 uppercase tracking-widest">Classification</h3>
              <div className="text-sm font-semibold text-zinc-800 dark:text-zinc-150">
                {project.category} Development
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer profile={profile} />
    </>
  );
}
