import fs from 'fs';
import path from 'path';
import { Profile, Skill, Project, Experience, Education, Certification, JourneyEntry } from '@/types';
import { connectToDatabase } from '@/lib/mongodb';
import {
  ProfileModel,
  SkillModel,
  ProjectModel,
  ExperienceModel,
  EducationModel,
  CertificationModel,
  JourneyModel,
} from '@/lib/models';

const DATA_DIR = path.join(process.cwd(), 'src', 'data');
const GITHUB_REPO = process.env.GITHUB_REPOSITORY || 'bhavykumbhani/portfolio-app';

function ensureDirectoryExists() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (err) {
    // Ignore read-only dir errors
  }
}

const memoryCaches: Record<string, any> = {};

async function syncToGitHub(filename: string, data: any) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return;

  try {
    const url = `https://api.github.com/repos/${GITHUB_REPO}/contents/src/data/${filename}`;
    const headers = {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github.v3+json',
      'Content-Type': 'application/json',
      'User-Agent': 'Portfolio-App',
    };

    const getRes = await fetch(url, { headers, cache: 'no-store' });
    let sha = '';
    if (getRes.ok) {
      const fileInfo = await getRes.json();
      sha = fileInfo.sha;
    }

    const content = Buffer.from(JSON.stringify(data, null, 2)).toString('base64');
    await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        message: `Update ${filename} via Admin Console`,
        content,
        ...(sha ? { sha } : {}),
      }),
    });
  } catch (error) {
    console.error(`GitHub API sync error for ${filename}:`, error);
  }
}

function readDataFile<T>(filename: string, defaultValue: T): T {
  ensureDirectoryExists();
  const filePath = path.join(DATA_DIR, filename);

  if (memoryCaches[filename]) {
    return memoryCaches[filename] as T;
  }

  try {
    if (!fs.existsSync(filePath)) {
      return defaultValue;
    }
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(raw);
    memoryCaches[filename] = parsed;
    return parsed;
  } catch (error) {
    console.error(`Error reading file ${filename}:`, error);
    return defaultValue;
  }
}

function writeDataFile<T>(filename: string, data: T): boolean {
  ensureDirectoryExists();
  const filePath = path.join(DATA_DIR, filename);

  memoryCaches[filename] = data;

  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    // Read-only filesystem
  }

  if (process.env.GITHUB_TOKEN) {
    syncToGitHub(filename, data).catch((err) =>
      console.error('Failed to sync to GitHub:', err)
    );
  }

  return true;
}

/* ==========================================================================
   PROFILE DATA CRUD
   ========================================================================== */
export async function getProfile(): Promise<Profile> {
  const db = await connectToDatabase();
  const defaultProfile = readDataFile<Profile>('profile.json', {
    name: 'Bhavy Kumbhani',
    currentRole: 'Web Developer',
    exploring: 'AI/ML & Data Analytics',
    shortBio: 'I build modern web experiences.',
    longBio: 'I am a web developer.',
    email: 'bhavy.kumbhani@example.com',
    location: 'Gujarat, India',
    githubUrl: '',
    linkedinUrl: '',
    resumeUrl: '',
  });

  const rawResumeUrl = db ? (await ProfileModel.findOne({}).lean())?.resumeUrl : defaultProfile.resumeUrl;
  const sanitizedResumeUrl =
    rawResumeUrl && !rawResumeUrl.includes(':\\') && !rawResumeUrl.startsWith('"')
      ? rawResumeUrl
      : defaultProfile.resumeUrl || '/resume.pdf';

  if (db) {
    try {
      let doc = await ProfileModel.findOne({}).lean();
      if (!doc) {
        doc = await ProfileModel.create(defaultProfile);
      }
      return {
        name: doc.name,
        avatarUrl: doc.avatarUrl || '',
        currentRole: doc.currentRole,
        exploring: doc.exploring,
        shortBio: doc.shortBio,
        longBio: doc.longBio,
        email: doc.email,
        location: doc.location,
        githubUrl: doc.githubUrl || '',
        linkedinUrl: doc.linkedinUrl || '',
        resumeUrl: sanitizedResumeUrl,
        statusText: doc.statusText || '',
      };
    } catch (err) {
      console.error('Error fetching profile from MongoDB:', err);
    }
  }

  return {
    ...defaultProfile,
    resumeUrl: sanitizedResumeUrl,
  };
}

export async function updateProfile(data: Profile): Promise<Profile> {
  const db = await connectToDatabase();
  writeDataFile<Profile>('profile.json', data);

  if (db) {
    try {
      await ProfileModel.findOneAndUpdate({}, data, { upsert: true, new: true });
    } catch (err) {
      console.error('Error updating profile in MongoDB:', err);
    }
  }

  return data;
}

/* ==========================================================================
   SKILLS DATA CRUD
   ========================================================================== */
export async function getSkills(): Promise<Skill[]> {
  const db = await connectToDatabase();
  const defaultSkills = readDataFile<Skill[]>('skills.json', []);

  if (db) {
    try {
      const docs = await SkillModel.find({}).lean();
      if (docs.length === 0 && defaultSkills.length > 0) {
        await SkillModel.insertMany(defaultSkills);
        return defaultSkills;
      }
      return docs.map((d: any) => ({
        id: d.id,
        name: d.name,
        category: d.category,
        status: d.status,
        order: d.order,
      }));
    } catch (err) {
      console.error('Error fetching skills from MongoDB:', err);
    }
  }

  return defaultSkills;
}

export async function saveSkills(skills: Skill[]): Promise<Skill[]> {
  const db = await connectToDatabase();
  writeDataFile<Skill[]>('skills.json', skills);

  if (db) {
    try {
      await SkillModel.deleteMany({});
      if (skills.length > 0) {
        await SkillModel.insertMany(skills);
      }
    } catch (err) {
      console.error('Error saving skills to MongoDB:', err);
    }
  }

  return skills;
}

/* ==========================================================================
   PROJECTS DATA CRUD
   ========================================================================== */
export async function getProjects(): Promise<Project[]> {
  const db = await connectToDatabase();
  const defaultProjects = readDataFile<Project[]>('projects.json', []);

  if (db) {
    try {
      const docs = await ProjectModel.find({}).lean();
      if (docs.length === 0 && defaultProjects.length > 0) {
        await ProjectModel.insertMany(defaultProjects);
        return defaultProjects;
      }
      return docs.map((d: any) => ({
        id: d.id,
        title: d.title,
        slug: d.slug,
        description: d.description,
        longDescription: d.longDescription,
        image: d.image || '',
        screenshots: d.screenshots || [],
        technologies: d.technologies || [],
        category: d.category,
        githubUrl: d.githubUrl || '',
        liveUrl: d.liveUrl || '',
        status: d.status || 'Completed',
        featured: d.featured || false,
        startDate: d.startDate || '',
        endDate: d.endDate || '',
        features: d.features || [],
        challenges: d.challenges || [],
        learnings: d.learnings || [],
      }));
    } catch (err) {
      console.error('Error fetching projects from MongoDB:', err);
    }
  }

  return defaultProjects;
}

export async function saveProjects(projects: Project[]): Promise<Project[]> {
  const db = await connectToDatabase();
  writeDataFile<Project[]>('projects.json', projects);

  if (db) {
    try {
      await ProjectModel.deleteMany({});
      if (projects.length > 0) {
        await ProjectModel.insertMany(projects);
      }
    } catch (err) {
      console.error('Error saving projects to MongoDB:', err);
    }
  }

  return projects;
}

export async function addProject(project: Omit<Project, 'id' | 'slug'>): Promise<Project> {
  const projects = await getProjects();
  const id = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now().toString().slice(-4);
  const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  
  const newProject: Project = {
    ...project,
    id,
    slug,
  };
  
  projects.push(newProject);
  await saveProjects(projects);
  return newProject;
}

export async function updateProject(id: string, updatedData: Partial<Project>): Promise<Project | null> {
  const projects = await getProjects();
  const idx = projects.findIndex(p => p.id === id);
  if (idx === -1) return null;

  const titleChanged = updatedData.title && updatedData.title !== projects[idx].title;
  const slug = titleChanged 
    ? updatedData.title!.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    : projects[idx].slug;

  projects[idx] = {
    ...projects[idx],
    ...updatedData,
    slug,
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
  const db = await connectToDatabase();
  const defaultExp = readDataFile<Experience[]>('experience.json', []);

  if (db) {
    try {
      const docs = await ExperienceModel.find({}).lean();
      if (docs.length === 0 && defaultExp.length > 0) {
        await ExperienceModel.insertMany(defaultExp);
        return defaultExp;
      }
      return docs.map((d: any) => ({
        id: d.id,
        company: d.company,
        role: d.role,
        location: d.location || '',
        startDate: d.startDate || '',
        endDate: d.endDate || '',
        description: d.description,
        technologies: d.technologies || [],
        website: d.website || '',
        logo: d.logo || '',
      }));
    } catch (err) {
      console.error('Error fetching experience from MongoDB:', err);
    }
  }

  return defaultExp;
}

export async function saveExperience(experience: Experience[]): Promise<Experience[]> {
  const db = await connectToDatabase();
  writeDataFile<Experience[]>('experience.json', experience);

  if (db) {
    try {
      await ExperienceModel.deleteMany({});
      if (experience.length > 0) {
        await ExperienceModel.insertMany(experience);
      }
    } catch (err) {
      console.error('Error saving experience to MongoDB:', err);
    }
  }

  return experience;
}

export async function addExperience(exp: Omit<Experience, 'id'>): Promise<Experience> {
  const experience = await getExperience();
  const newExp: Experience = {
    ...exp,
    id: 'exp-' + Date.now().toString(),
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
    ...updatedData,
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
  const db = await connectToDatabase();
  const defaultEdu = readDataFile<Education[]>('education.json', []);

  if (db) {
    try {
      const docs = await EducationModel.find({}).lean();
      if (docs.length === 0 && defaultEdu.length > 0) {
        await EducationModel.insertMany(defaultEdu);
        return defaultEdu;
      }
      return docs.map((d: any) => ({
        id: d.id,
        degree: d.degree,
        institution: d.institution,
        location: d.location || '',
        startDate: d.startDate || '',
        endDate: d.endDate || '',
        description: d.description,
        grade: d.grade || '',
      }));
    } catch (err) {
      console.error('Error fetching education from MongoDB:', err);
    }
  }

  return defaultEdu;
}

export async function saveEducation(education: Education[]): Promise<Education[]> {
  const db = await connectToDatabase();
  writeDataFile<Education[]>('education.json', education);

  if (db) {
    try {
      await EducationModel.deleteMany({});
      if (education.length > 0) {
        await EducationModel.insertMany(education);
      }
    } catch (err) {
      console.error('Error saving education to MongoDB:', err);
    }
  }

  return education;
}

export async function addEducation(edu: Omit<Education, 'id'>): Promise<Education> {
  const education = await getEducation();
  const newEdu: Education = {
    ...edu,
    id: 'edu-' + Date.now().toString(),
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
    ...updatedData,
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
  const db = await connectToDatabase();
  const defaultCerts = readDataFile<Certification[]>('certifications.json', []);

  if (db) {
    try {
      const docs = await CertificationModel.find({}).lean();
      if (docs.length === 0 && defaultCerts.length > 0) {
        await CertificationModel.insertMany(defaultCerts);
        return defaultCerts;
      }
      return docs.map((d: any) => ({
        id: d.id,
        name: d.name,
        issuingOrganization: d.issuingOrganization,
        date: d.date || '',
        credentialId: d.credentialId || '',
        credentialUrl: d.credentialUrl || '',
        image: d.image || '',
      }));
    } catch (err) {
      console.error('Error fetching certifications from MongoDB:', err);
    }
  }

  return defaultCerts;
}

export async function saveCertifications(certs: Certification[]): Promise<Certification[]> {
  const db = await connectToDatabase();
  writeDataFile<Certification[]>('certifications.json', certs);

  if (db) {
    try {
      await CertificationModel.deleteMany({});
      if (certs.length > 0) {
        await CertificationModel.insertMany(certs);
      }
    } catch (err) {
      console.error('Error saving certifications to MongoDB:', err);
    }
  }

  return certs;
}

export async function addCertification(cert: Omit<Certification, 'id'>): Promise<Certification> {
  const certs = await getCertifications();
  const newCert: Certification = {
    ...cert,
    id: 'cert-' + Date.now().toString(),
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
    ...updatedData,
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
  const db = await connectToDatabase();
  const defaultJourney = readDataFile<JourneyEntry[]>('journey.json', []);

  if (db) {
    try {
      const docs = await JourneyModel.find({}).lean();
      if (docs.length === 0 && defaultJourney.length > 0) {
        await JourneyModel.insertMany(defaultJourney);
        return defaultJourney;
      }
      return docs.map((d: any) => ({
        id: d.id,
        year: d.year,
        title: d.title,
        description: d.description,
        type: d.type,
        technologies: d.technologies || [],
        link: d.link || '',
        status: d.status || '',
      }));
    } catch (err) {
      console.error('Error fetching journey from MongoDB:', err);
    }
  }

  return defaultJourney;
}

export async function saveJourney(journey: JourneyEntry[]): Promise<JourneyEntry[]> {
  const db = await connectToDatabase();
  writeDataFile<JourneyEntry[]>('journey.json', journey);

  if (db) {
    try {
      await JourneyModel.deleteMany({});
      if (journey.length > 0) {
        await JourneyModel.insertMany(journey);
      }
    } catch (err) {
      console.error('Error saving journey to MongoDB:', err);
    }
  }

  return journey;
}

export async function addJourneyEntry(entry: Omit<JourneyEntry, 'id'>): Promise<JourneyEntry> {
  const journey = await getJourney();
  const newEntry: JourneyEntry = {
    ...entry,
    id: 'journey-' + Date.now().toString(),
  };
  journey.push(newEntry);
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
    ...updatedData,
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
