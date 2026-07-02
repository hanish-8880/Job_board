export interface JobDraft {
  title: string;
  company: string;
  location: string;
  salaryMin: string;
  salaryMax: string;
  description: string;
}

export type JobDraftErrors = Partial<Record<keyof JobDraft, string>>;

/**
 * Client-side validation for the Post a Role form. Every message names the
 * exact fix, not just that something's wrong — see CLAUDE.md's UX section.
 */
export function validateJobDraft(draft: JobDraft): JobDraftErrors {
  const errors: JobDraftErrors = {};

  if (!draft.title.trim()) {
    errors.title = "Enter a job title.";
  }

  if (!draft.company.trim()) {
    errors.company = "Enter a company name.";
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
