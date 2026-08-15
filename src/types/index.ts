export interface Profile {
  name: string;
  avatarUrl?: string;
  currentRole: string;
  exploring: string;
  shortBio: string;
  longBio: string;
  email: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  resumeUrl: string;
  statusText?: string; // e.g. "Building • Learning • Exploring"
}

export type SkillCategory = 'Web Development' | 'Programming' | 'AI / ML' | 'Data Analytics' | 'Tools';
export type SkillStatus = 'Learning' | 'Familiar' | 'Building With' | 'Advanced';

export interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  status: SkillStatus;
  order?: number;
}

export type ProjectCategory = 'Web' | 'JavaScript' | 'React' | 'Next.js' | 'Python' | 'AI/ML' | 'Data Analytics' | 'Other';
export type ProjectStatus = 'Planning' | 'In Progress' | 'Completed' | 'Maintained';

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  longDescription: string;
  image: string;
  screenshots: string[]; // array of URLs
  technologies: string[];
  category: ProjectCategory;
  githubUrl: string;
  liveUrl: string;
  status: ProjectStatus;
  featured: boolean;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or "Present"
  features: string[];
  challenges: string[];
  learnings: string[];
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or "Present"
  description: string;
  technologies: string[];
  website?: string;
  logo?: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string;
  startDate: string; // YYYY-MM
  endDate: string; // YYYY-MM or "Present"
  description: string;
  grade?: string;
}

export interface Certification {
  id: string;
  name: string;
  issuingOrganization: string;
  date: string; // YYYY-MM
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
}

export type JourneyType = 'Education' | 'Project' | 'Achievement' | 'Certification' | 'Internship' | 'Job' | 'Career Milestone' | 'Learning';

export interface JourneyEntry {
  id: string;
  year: string; // e.g. "2026"
  title: string;
  description: string;
  type: JourneyType;
  technologies?: string[];
  link?: string;
  status?: string; // e.g. "Completed", "In Progress"
}
