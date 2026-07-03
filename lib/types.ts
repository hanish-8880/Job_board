export type WorkMode = "remote" | "hybrid" | "onsite";

export type ExperienceLevel = "junior" | "mid" | "senior" | "lead";

export type JobStatus = "draft" | "published";

export interface Job {
  id: string;
  companyId: string;
  title: string;
  company: string;
  location: string;
  mode: WorkMode;
  level: ExperienceLevel;
  salaryMin: number | null;
  salaryMax: number | null;
  currency: string;
  tags: string[];
  description: string;
  responsibilities: string[];
  requirements: string[];
  status: JobStatus;
  postedAt: string;
}

export type UserRole = "candidate" | "employer";

export interface ResumeMatch {
  jobId: string;
  matchScore: number;
}

export interface ResumeMatchResults {
  atsScore: number;
  matches: ResumeMatch[];
}

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string | null;
  resumeText: string | null;
  resumeMatchResults: ResumeMatchResults | null;
  resumeMatchComputedAt: string | null;
  createdAt: string;
}

export interface Company {
  id: string;
  ownerId: string;
  name: string;
  website: string | null;
  description: string | null;
  createdAt: string;
}

export type ApplicationStatus = "applied" | "reviewing" | "rejected" | "accepted";

export interface Application {
  id: string;
  jobId: string;
  candidateId: string;
  coverLetter: string | null;
  status: ApplicationStatus;
  createdAt: string;
}

export interface Bookmark {
  id: string;
  candidateId: string;
  jobId: string;
  createdAt: string;
}
