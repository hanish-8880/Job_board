// Computed server-side and rendered as plain text — never reformatted via
// toLocaleString on the client, which caused a real server/client
// timezone hydration mismatch elsewhere in this app.
export function formatPostedLabel(postedAt: string): string {
  const days = Math.floor((Date.now() - new Date(postedAt).getTime()) / (1000 * 60 * 60 * 24));
  if (days <= 0) return "Posted today";
  if (days === 1) return "Posted 1 day ago";
  return `Posted ${days} days ago`;
}
