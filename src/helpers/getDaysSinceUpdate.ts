export default async function getDaysSinceUpdatedAddons(): Promise<
  string | null
> {
  const owner = "cqb13";
  const repo = "meteor-addon-scanner";

  const res = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/commits?sha=addons&commiter=github-actions[bot]&per_page=1`,
    {
      headers: {
        Accept: "application/vnd.github+json",
        "User-Agent": "website-script",
      },
    },
  );

  if (!res.ok) {
    console.error("GitHub API error:", res.status, await res.text());
    return null;
  }

  const commit = await res.json();

  if (commit.length === 0) return null;

  const commitDate = new Date(commit[0].commit.author.date);
  const now = new Date();
  const diffMs = now.getTime() - commitDate.getTime();

  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.round(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays > 1) return `Last Update: ${diffDays} days ago`;
  if (diffDays === 1) return `Last Update: 1 day ago`;

  if (diffHours >= 1)
    return diffHours === 1
      ? `Last Update: 1 hour ago`
      : `Last Update: ${diffHours} hours ago`;

  return diffMinutes < 1
    ? `Last Update: less than a minute ago`
    : `Last Update: ${diffMinutes} minutes ago`;
}
