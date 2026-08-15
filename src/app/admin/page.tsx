import React from 'react';
import Link from 'next/link';
import {
  getProfile,
  getProjects,
  getSkills,
  getExperience,
  getEducation,
  getCertifications,
  getJourney,
} from '@/lib/data-service';
import { Folder, Wrench, Briefcase, Award, History, Plus, UserCog, GraduationCap } from 'lucide-react';

export const revalidate = 0; // Fresh stats on loading

export default async function AdminDashboardPage() {
  const [
    profile,
    projects,
    skills,
    experience,
    education,
    certifications,
    journey,
  ] = await Promise.all([
    getProfile(),
    getProjects(),
    getSkills(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getJourney(),
  ]);

  const stats = [
    { label: 'Projects', count: projects.length, icon: <Folder className="h-5 w-5" />, color: 'text-blue-500 bg-blue-500/10' },
    { label: 'Skills Stack', count: skills.length, icon: <Wrench className="h-5 w-5" />, color: 'text-amber-500 bg-amber-500/10' },
    { label: 'Work Experience', count: experience.length, icon: <Briefcase className="h-5 w-5" />, color: 'text-emerald-500 bg-emerald-500/10' },
    { label: 'Certifications', count: certifications.length, icon: <Award className="h-5 w-5" />, color: 'text-teal-500 bg-teal-500/10' },
    { label: 'Journey Timeline', count: journey.length, icon: <History className="h-5 w-5" />, color: 'text-purple-500 bg-purple-500/10' },
    { label: 'Education Nodes', count: education.length, icon: <GraduationCap className="h-5 w-5" />, color: 'text-pink-500 bg-pink-500/10' },
  ];

  return (
    <div className="space-y-10">
      {/* Welcome Heading */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold font-mono tracking-tight text-zinc-900 dark:text-zinc-50">
          &gt; SYSTEM_STATUS: ONLINE
        </h1>
        <p className="text-sm text-zinc-550 dark:text-zinc-400">
          Welcome back, <span className="font-semibold text-zinc-700 dark:text-zinc-350">{profile.name}</span>. You can modify your developer metadata and content layout parameters below.
        </p>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/30 flex items-center justify-between"
          >
            <div className="space-y-1">
              <span className="text-xs font-mono text-zinc-400 dark:text-zinc-500">{stat.label}</span>
              <p className="text-2xl font-bold font-mono text-zinc-850 dark:text-zinc-200">{stat.count}</p>
            </div>
            <div className={`p-2.5 rounded-lg ${stat.color}`}>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Quick actions panel */}
      <div className="space-y-4">
        <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-zinc-400">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/admin/projects?action=new"
            className="p-5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/30 transition-all flex items-center space-x-4 text-left group"
          >
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-250">Add Project</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Publish a new portfolio showcase project.</p>
            </div>
          </Link>

          <Link
            href="/admin/profile"
            className="p-5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/30 transition-all flex items-center space-x-4 text-left group"
          >
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 group-hover:scale-105 transition-transform">
              <UserCog className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-250">Edit Profile</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Update titles, bio information, and social links.</p>
            </div>
          </Link>

          <Link
            href="/admin/skills?action=add"
            className="p-5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/30 transition-all flex items-center space-x-4 text-left group"
          >
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-250">Add Skill</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Introduce a new technology stack node.</p>
            </div>
          </Link>

          <Link
            href="/admin/journey?action=new"
            className="p-5 rounded-xl border border-zinc-250 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 hover:border-emerald-500/30 transition-all flex items-center space-x-4 text-left group"
          >
            <div className="p-3 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-500 group-hover:scale-105 transition-transform">
              <Plus className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-zinc-800 dark:text-zinc-250">Add Journey Event</h3>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 mt-0.5">Record an educational or career milestone.</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
