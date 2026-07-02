export type WorkMode = "remote" | "hybrid" | "onsite";

export type ExperienceLevel = "junior" | "mid" | "senior" | "lead";

export interface Job {
  id: string;
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
  postedAt: string;
}
