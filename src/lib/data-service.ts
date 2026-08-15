import fs from 'fs';
import path from 'path';
import { Profile, Skill, Project, Experience, Education, Certification, JourneyEntry } from '@/types';

// Central data directory path
const DATA_DIR = path.join(process.cwd(), 'src', 'data');

// Ensure directory exists (primarily for safety)
function ensureDirectoryExists() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// In-memory fallback caches for Vercel production environments (where files are read-only)
const memoryCaches: Record<string, any> = {};

// Helper to read JSON file
function readDataFile<T>(filename: string, defaultValue: T): T {
  ensureDirectoryExists();
  const filePath = path.join(DATA_DIR, filename);
  
  // If memory cache exists in production, return it
  if (process.env.NODE_ENV === 'production' && memoryCaches[filename]) {
    return memoryCaches[filename] as T;
  }

  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    
    // Cache in production
    if (process.env.NODE_ENV === 'production') {
      memoryCaches[filename] = parsed;
    }
    
    return parsed;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return defaultValue;
  }
}

// Helper to write JSON file
function writeDataFile<T>(filename: string, data: T): boolean {
  ensureDirectoryExists();
  const filePath = path.join(DATA_DIR, filename);

  // Always update memory cache
  memoryCaches[filename] = data;

  try {
    // Write to local disk (will fail on read-only environments like Vercel serverless)
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (error) {
    console.error(`Warning: Could not write file ${filename} (likely in read-only production environment):`, error);
    // Return true anyway because the memory cache was updated for the duration of the serverless runtime instance
    return true;
  }
}

/* ==========================================================================
   PROFILE DATA CRUD
   ========================================================================== */
export async function getProfile(): Promise<Profile> {
  return readDataFile<Profile>('profile.json', {
    name: 'Bhavy Kumbhani',
    currentRole: 'Web Developer',
    exploring: 'AI/ML & Data Analytics',
    shortBio: 'I build modern web experiences.',
    longBio: 'I am a web developer.',
    email: 'bhavy.kumbhani@example.com',
    location: 'Gujarat, India',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: ''
  });
}

export async function updateProfile(data: Profile): Promise<Profile> {
  writeDataFile<Profile>('profile.json', data);
  return data;
}

/* ==========================================================================
   SKILLS DATA CRUD
   ========================================================================== */
export async function getSkills(): Promise<Skill[]> {
  return readDataFile<Skill[]>('skills.json', []);
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  writeDataFile<Skill[]>('skills.json', skills);
  return skills;
}

/* ==========================================================================
   PROJECTS DATA CRUD
   ========================================================================== */
export async function getProjects(): Promise<Project[]> {
  return readDataFile<Project[]>('projects.json', []);
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  writeDataFile<Project[]>('projects.json', projects);
  return projects;
}

export async function addProject(project: Omit<Project, 'id' | 'slug'>): Promise<Project> {
  const projects = await getProjects();
  const id = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newProject: Project = {
    ...project,
    id,
    slug
  };
  
  projects.push(newProject);
  await saveProjects(projects);
  return newProject;
}

export async function updateProject(id: string, updatedData: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;

  // Re-generate slug if title changed
  const titleChanged = updatedData.title && updatedData.title !== projects[idx].title;
  const slug = titleChanged 
    ? updatedData.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : projects[idx].slug;

  projects[idx] = {
    ...projects[idx],
    ...updatedData,
    slug
  } as Project;

  await saveProjects(projects);
  return projects[idx];
}

export async function deleteProject(id: string): Promise<boolean> {
  const projects = await getProjects();
  const filtered = projects.filter(p => p.id !== id);
  if (filtered.length === projects.length) return false;
  await saveProjects(filtered);
  return true;
}

/* ==========================================================================
   EXPERIENCE DATA CRUD
   ========================================================================== */
export async function getExperience(): Promise<Experience[]> {
  return readDataFile<Experience[]>('experience.json', []);
}

export async function saveExperience(experience: Experience[]): Promise<Experience[]> {
  writeDataFile<Experience[]>('experience.json', experience);
  return experience;
}

export async function addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const experience = await getExperience();
  const newExp: Experience = {
    ...exp,
    id: 'exp-' + Date.now().toString()
  };
  experience.push(newExp);
  await saveExperience(experience);
  return newExp;
}

export async function updateExperience(id: string, updatedData: Partial<Experience>): Promise<Experience | null> {
  const experience = await getExperience();
  const idx = experience.findIndex(e => e.id === id);
  if (idx === -1) return null;
  
  experience[idx] = {
    ...experience[idx],
    ...updatedData
  } as Experience;
  
  await saveExperience(experience);
  return experience[idx];
}

export async function deleteExperience(id: string): Promise<boolean> {
  const experience = await getExperience();
  const filtered = experience.filter(e => e.id !== id);
  if (filtered.length === experience.length) return false;
  await saveExperience(filtered);
  return true;
}

/* ==========================================================================
   EDUCATION DATA CRUD
   ========================================================================== */
export async function getEducation(): Promise<Education[]> {
  return readDataFile<Education[]>('education.json', []);
}

export async function saveEducation(education: Education[]): Promise<Education[]> {
  writeDataFile<Education[]>('education.json', education);
  return education;
}

export async function addEducation(edu: Omit<Education, 'id'>): Promise<Education> {
  const education = await getEducation();
  const newEdu: Education = {
    ...edu,
    id: 'edu-' + Date.now().toString()
  };
  education.push(newEdu);
  await saveEducation(education);
  return newEdu;
}

export async function updateEducation(id: string, updatedData: Partial<Education>): Promise<Education | null> {
  const education = await getEducation();
  const idx = education.findIndex(e => e.id === id);
  if (idx === -1) return null;
  
  education[idx] = {
    ...education[idx],
    ...updatedData
  } as Education;
  
  await saveEducation(education);
  return education[idx];
}

export async function deleteEducation(id: string): Promise<boolean> {
  const education = await getEducation();
  const filtered = education.filter(e => e.id !== id);
  if (filtered.length === education.length) return false;
  await saveEducation(filtered);
  return true;
}

/* ==========================================================================
   CERTIFICATIONS DATA CRUD
   ========================================================================== */
export async function getCertifications(): Promise<Certification[]> {
  return readDataFile<Certification[]>('certifications.json', []);
}

export async function saveCertifications(certs: Certification[]): Promise<Certification[]> {
  writeDataFile<Certification[]>('certifications.json', certs);
  return certs;
}

export async function addCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
  const certs = await getCertifications();
  const newCert: Certification = {
    ...cert,
    id: 'cert-' + Date.now().toString()
  };
  certs.push(newCert);
  await saveCertifications(certs);
  return newCert;
}

export async function updateCertification(id: string, updatedData: Partial<Certification>): Promise<Certification | null> {
  const certs = await getCertifications();
  const idx = certs.findIndex(c => c.id === id);
  if (idx === -1) return null;
  
  certs[idx] = {
    ...certs[idx],
    ...updatedData
  } as Certification;
  
  await saveCertifications(certs);
  return certs[idx];
}

export async function deleteCertification(id: string): Promise<boolean> {
  const certs = await getCertifications();
  const filtered = certs.filter(c => c.id !== id);
  if (filtered.length === certs.length) return false;
  await saveCertifications(filtered);
  return true;
}

/* ==========================================================================
   JOURNEY TIMELINE DATA CRUD
   ========================================================================== */
export async function getJourney(): Promise<JourneyEntry[]> {
  return readDataFile<JourneyEntry[]>('journey.json', []);
}

export async function saveJourney(journey: JourneyEntry[]): Promise<JourneyEntry[]> {
  writeDataFile<JourneyEntry[]>('journey.json', journey);
  return journey;
}

export async function addJourneyEntry(entry: Omit<JourneyEntry, 'id'>): Promise<JourneyEntry> {
  const journey = await getJourney();
  const newEntry: JourneyEntry = {
    ...entry,
    id: 'journey-' + Date.now().toString()
  };
  journey.push(newEntry);
  // Sort journey by year descending (newest first) or ascending as needed. Let's sort by year descending
  journey.sort((a, b) => b.year.localeCompare(a.year));
  await saveJourney(journey);
  return newEntry;
}

export async function updateJourneyEntry(id: string, updatedData: Partial<JourneyEntry>): Promise<JourneyEntry | null> {
  const journey = await getJourney();
  const idx = journey.findIndex(j => j.id === id);
  if (idx === -1) return null;
  
  journey[idx] = {
    ...journey[idx],
    ...updatedData
  } as JourneyEntry;
  
  journey.sort((a, b) => b.year.localeCompare(a.year));
  await saveJourney(journey);
  return journey[idx];
}

export async function deleteJourneyEntry(id: string): Promise<boolean> {
  const journey = await getJourney();
  const filtered = journey.filter(j => j.id !== id);
  if (filtered.length === journey.length) return false;
  await saveJourney(filtered);
  return true;
}
