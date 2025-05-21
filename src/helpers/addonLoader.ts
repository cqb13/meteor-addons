import type { Addon } from "./addon";

export async function loadAddons(): Promise<Addon[]> {
  const res = await fetch(
    `https://raw.githubusercontent.com/cqb13/anticope.ml/data/addons-all.json?v=${new Date().getTime()}`,
  );

  const data: any[] = await res.json();

  let addons: Addon[] = [];

  data.forEach((a: any) => {
    let parts = a.id.split("/");
    let owner = parts[0].trim();
    let name = parts[1].trim();

    let addon: Addon = {
      authors: a.authors,
      features: a.features,
      featureCount: a.feature_count,
      icon: a.icon,
      repo: {
        id: a.id,
        owner: owner,
        name: name,
        archived: a.status.archived,
      },
      links: {
        github: a.links.github,
        download: a.links.download || null,
        discord: a.links.discord || null,
        homepage: a.links.homepage || null,
      },
      name: a.name,
      summary: a.summary,
      stars: a.stars,
      downloads: a.downloads,
      lastUpdate: a.last_update,
      mcVersion: a.mc_version || null,
      verified: a.verified || null,
    };

    addons.push(addon);
  });

  return addons;
}
