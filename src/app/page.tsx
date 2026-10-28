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

export const revalidate = 60; // Cache at Vercel Edge CDN for super-fast loading, auto-revalidated on Admin edits

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

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://bhavy-kumbhani-portfolio.vercel.app';
  const avatarAbsoluteUrl = profile.avatarUrl?.startsWith('http')
    ? profile.avatarUrl
    : `${siteUrl}${profile.avatarUrl?.startsWith('/') ? '' : '/'}${profile.avatarUrl || 'images/bhavy-portrait.png'}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${siteUrl}/#person`,
        name: profile.name,
        alternateName: [
          'Bhavya Kumbhani',
          'Bhavya H Kumbhani',
          'Bhavy',
          'bhkumbhani',
        ],
        url: siteUrl,
        image: avatarAbsoluteUrl,
        jobTitle: profile.currentRole,
        description: profile.longBio || profile.shortBio,
        email: profile.email ? `mailto:${profile.email}` : undefined,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Ahmedabad',
          addressRegion: 'Gujarat',
          addressCountry: 'India',
        },
        alumniOf: education.map((edu) => ({
          '@type': 'EducationalOrganization',
          name: edu.institution,
          description: edu.degree,
        })),
        sameAs: [
          profile.githubUrl,
          profile.linkedinUrl,
          siteUrl,
        ].filter(Boolean),
        knowsAbout: skills.map((s) => s.name),
      },
      {
        '@type': 'WebSite',
        '@id': `${siteUrl}/#website`,
        url: siteUrl,
        name: `${profile.name} | Official Portfolio`,
        description: profile.shortBio,
        publisher: {
          '@id': `${siteUrl}/#person`,
        },
        inLanguage: 'en-US',
      },
      {
        '@type': 'ProfilePage',
        '@id': `${siteUrl}/#webpage`,
        url: siteUrl,
        name: `${profile.name} - Web Developer & AI/ML Explorer Portfolio`,
        isPartOf: {
          '@id': `${siteUrl}/#website`,
        },
        about: {
          '@id': `${siteUrl}/#person`,
        },
        mainEntity: {
          '@id': `${siteUrl}/#person`,
        },
      },
    ],
  };

  return (
    <>
      {/* Schema.org Structured Data for Google Search Engine Knowledge Graph */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
