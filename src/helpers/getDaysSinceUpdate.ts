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
      `https://api.github.com/repos/${owner}/${repo}/commits?per_page=${perPage}&page=${page}`,
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
        const commitDate: any = new Date(commit.commit.author.date);
        const now: any = new Date();
        const diffMs = now - commitDate;
        const daysAgo = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        if (daysAgo != 1 && daysAgo != 0) {
          return `Last Update: ${daysAgo} days ago`;
        } else if (daysAgo == 1) {
          return `Last Update: ${daysAgo} day ago`;
        } else {
          return `Last Update: Today`;
        }
      }
    }

    page++;
  }

  return null;
}
