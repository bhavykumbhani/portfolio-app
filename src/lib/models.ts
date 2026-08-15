import mongoose, { Schema } from 'mongoose';

// Profile Schema
const ProfileSchema = new Schema({
  name: { type: String, required: true },
  avatarUrl: { type: String, default: '' },
  currentRole: { type: String, required: true },
  exploring: { type: String, required: true },
  shortBio: { type: String, required: true },
  longBio: { type: String, required: true },
  email: { type: String, required: true },
  location: { type: String, required: true },
  githubUrl: { type: String, default: '' },
  linkedinUrl: { type: String, default: '' },
  resumeUrl: { type: String, default: '' },
  statusText: { type: String, default: '' },
}, { timestamps: true, strict: false });

// Skill Schema
const SkillSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  order: { type: Number, default: 0 },
}, { timestamps: true, strict: false });

// Project Schema
const ProjectSchema = new Schema({
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: { type: String, required: true },
  longDescription: { type: String, default: '' },
  image: { type: String, default: '' },
  screenshots: [{ type: String }],
  technologies: [{ type: String }],
  category: { type: String, required: true },
  githubUrl: { type: String, default: '' },
  liveUrl: { type: String, default: '' },
  status: { type: String, default: 'Completed' },
  featured: { type: Boolean, default: false },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  features: [{ type: String }],
  challenges: [{ type: String }],
  learnings: [{ type: String }],
}, { timestamps: true, strict: false });

// Experience Schema
const ExperienceSchema = new Schema({
  id: { type: String, required: true, unique: true },
  company: { type: String, required: true },
  role: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, required: true },
  technologies: [{ type: String }],
  website: { type: String, default: '' },
  logo: { type: String, default: '' },
}, { timestamps: true, strict: false });

// Education Schema
const EducationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  degree: { type: String, required: true },
  institution: { type: String, required: true },
  location: { type: String, default: '' },
  startDate: { type: String, default: '' },
  endDate: { type: String, default: '' },
  description: { type: String, required: true },
  grade: { type: String, default: '' },
}, { timestamps: true, strict: false });

// Certification Schema
const CertificationSchema = new Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  issuingOrganization: { type: String, required: true },
  date: { type: String, default: '' },
  credentialId: { type: String, default: '' },
  credentialUrl: { type: String, default: '' },
  image: { type: String, default: '' },
}, { timestamps: true, strict: false });

// Journey Schema
const JourneySchema = new Schema({
  id: { type: String, required: true, unique: true },
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  technologies: [{ type: String }],
  link: { type: String, default: '' },
  status: { type: String, default: '' },
}, { timestamps: true, strict: false });

export const ProfileModel = mongoose.models.Profile || mongoose.model('Profile', ProfileSchema);
export const SkillModel = mongoose.models.Skill || mongoose.model('Skill', SkillSchema);
export const ProjectModel = mongoose.models.Project || mongoose.model('Project', ProjectSchema);
export const ExperienceModel = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);
export const EducationModel = mongoose.models.Education || mongoose.model('Education', EducationSchema);
export const CertificationModel = mongoose.models.Certification || mongoose.model('Certification', CertificationSchema);
export const JourneyModel = mongoose.models.Journey || mongoose.model('Journey', JourneySchema);
