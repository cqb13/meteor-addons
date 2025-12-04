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

        const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        const hours = Math.floor(diffMs / (1000 * 60 * 60));

        if (days > 1) {
          return `Last Update: ${days} days ago`;
        }

        if (days === 1) {
          return `Last Update: 1 day ago`;
        }

        if (hours >= 1) {
          return hours === 1
            ? `Last Update: 1 hour ago`
            : `Last Update: ${hours} hours ago`;
        }

        return `Last Update: less than an hour ago`;
      }
    }

    page++;
  }

  return null;
}
