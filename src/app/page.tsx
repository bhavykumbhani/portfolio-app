import React from 'react';
import {
  getProfile,
  getSkills,
  getProjects,
  getExperience,
  getEducation,
  getCertifications,
  getJourney,
} from '@/lib/data-service';

import { Navbar } from '@/components/navbar';
import { Hero } from '@/components/hero';
import { About } from '@/components/about';
import { Skills } from '@/components/skills';
import { Projects } from '@/components/projects';
import { Experience } from '@/components/experience';
import { Journey } from '@/components/journey';
import { Education } from '@/components/education';
import { Certifications } from '@/components/certifications';
import { Contact } from '@/components/contact';
import { Footer } from '@/components/footer';

export const revalidate = 0; // Disable caching to reflect CMS changes instantly

export default async function Page() {
  // Fetch all centralized data on the server
  const [
    profile,
    skills,
    projects,
    experience,
    education,
    certifications,
    journey,
  ] = await Promise.all([
    getProfile(),
    getSkills(),
    getProjects(),
    getExperience(),
    getEducation(),
    getCertifications(),
    getJourney(),
  ]);

  return (
    <>
      {/* Dynamic Grid Background overlay */}
      <div className="absolute inset-0 -z-50 pointer-events-none opacity-[0.4] dark:opacity-[0.6]">
        <div className="absolute inset-0 bg-white dark:bg-[#09090b]" />
        <div className="absolute inset-0 grid-bg-light dark:grid-bg-dark [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <Navbar profileName={profile.name} githubUrl={profile.githubUrl} linkedinUrl={profile.linkedinUrl} />

      <main className="flex-1 flex flex-col">
        <Hero profile={profile} />
        
        <About profile={profile} education={education} />
        
        <Skills skills={skills} />
        
        <Projects projects={projects} />
        
        <Experience experience={experience} />
        
        <Journey journey={journey} />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border-t border-zinc-100 dark:border-zinc-900 bg-zinc-50/10 dark:bg-zinc-900/5">
          <Education education={education} />
          <Certifications certifications={certifications} />
        </div>
        
        <Contact
          email={profile.email}
          githubUrl={profile.githubUrl}
          linkedinUrl={profile.linkedinUrl}
          location={profile.location}
        />
      </main>

      <Footer profile={profile} />
    </>
  );
}
