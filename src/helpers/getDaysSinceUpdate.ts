export default async function getDaysSinceUpdatedAddons(): Promise<
  string | null
> {
  const owner = "cqb13";
  const repo = "meteor-addon-scanner";
  const searchText = "updated addons";
  const perPage = 100;

  let page = 1;

  while (true) {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/commits?sha=addons&per_page=${perPage}&page=${page}`,
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

    const commits = await res.json();

    if (commits.length === 0) break;

    for (const commit of commits) {
      if (
        commit.commit.message.toLowerCase().includes(searchText.toLowerCase())
      ) {
        const commitDate = new Date(commit.commit.author.date);
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
    }

    page++;
  }

  return null;
}
