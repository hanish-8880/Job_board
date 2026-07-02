export interface JobPostingDraft {
  title: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
}

export type JobPostingErrors = Partial<Record<keyof JobPostingDraft, string>>;

/**
 * Client-side validation for the employer Post a Role form. Every message
 * names the exact fix, not just that something's wrong — see CLAUDE.md's
 * UX section.
 */
export function validateJobPosting(draft: JobPostingDraft): JobPostingErrors {
  const errors: JobPostingErrors = {};

  if (!draft.title.trim()) {
    errors.title = "Enter a job title.";
  }

  if (!draft.location.trim()) {
    errors.location = 'Enter a location, e.g. "Remote" or a city.';
  }

  if (!draft.description.trim()) {
    errors.description =
      "Add a description so candidates know what the role actually involves.";
  } else if (draft.description.trim().split(/\s+/).length < 15) {
    errors.description =
      "Add a bit more detail — a one-line description won't score well and won't help candidates either.";
  }

  const minRaw = draft.salaryMin.trim();
  const maxRaw = draft.salaryMax.trim();

  if (minRaw || maxRaw) {
    if (!minRaw) {
      errors.salaryMin = "Enter a minimum, or clear the maximum too.";
    } else if (!/^\d+$/.test(minRaw)) {
      errors.salaryMin = "Enter a valid minimum (whole number, no symbols).";
    }

    if (!maxRaw) {
      errors.salaryMax = "Enter a maximum, or clear the minimum too.";
    } else if (!/^\d+$/.test(maxRaw)) {
      errors.salaryMax = "Enter a valid maximum (whole number, no symbols).";
    }

    if (!errors.salaryMin && !errors.salaryMax) {
      const min = Number(minRaw);
      const max = Number(maxRaw);
      if (min <= 0) {
        errors.salaryMin = "Minimum must be greater than 0.";
      } else if (max <= min) {
        errors.salaryMax = "Maximum must be greater than the minimum.";
      }
    }
  }

  return errors;
}

export interface SignupDraft {
  fullName: string;
  email: string;
  password: string;
  role: "candidate" | "employer" | "";
}

export type SignupErrors = Partial<Record<keyof SignupDraft, string>>;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateSignup(draft: SignupDraft): SignupErrors {
  const errors: SignupErrors = {};

  if (!draft.fullName.trim()) {
    errors.fullName = "Enter your name.";
  }

  if (!draft.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!EMAIL_PATTERN.test(draft.email.trim())) {
    errors.email = "Enter a valid email address.";
  }

  if (!draft.password) {
    errors.password = "Enter a password.";
  } else if (draft.password.length < 8) {
    errors.password = "Password must be at least 8 characters.";
  }

  if (!draft.role) {
    errors.role = "Choose whether you're hiring or job hunting.";
  }

  return errors;
}

export interface LoginDraft {
  email: string;
  password: string;
}

export type LoginErrors = Partial<Record<keyof LoginDraft, string>>;

export function validateLogin(draft: LoginDraft): LoginErrors {
  const errors: LoginErrors = {};

  if (!draft.email.trim()) {
    errors.email = "Enter your email address.";
  }

  if (!draft.password) {
    errors.password = "Enter your password.";
  }

  return errors;
}

export interface CompanyDraft {
  name: string;
  website: string;
  description: string;
}

export type CompanyErrors = Partial<Record<keyof CompanyDraft, string>>;

export function validateCompany(draft: CompanyDraft): CompanyErrors {
  const errors: CompanyErrors = {};

  if (!draft.name.trim()) {
    errors.name = "Enter a company name.";
  }

  const website = draft.website.trim();
  if (website && !/^https?:\/\/.+\..+/.test(website)) {
    errors.website = "Enter a full URL, e.g. https://example.com.";
  }

  return errors;
}
