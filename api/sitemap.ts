const ADDONS_URL =
  "https://raw.githubusercontent.com/cqb13/meteor-addon-scanner/refs/heads/addons/addons.json";

const SITE_URL = "https://meteoraddons.com";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default async function handler(_req: unknown, res: any) {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader(
    "Cache-Control",
    "public, s-maxage=86400, stale-while-revalidate=604800",
  );

  const urls = [
    { loc: `${SITE_URL}/`, changefreq: "daily", priority: "1.0" },
    { loc: `${SITE_URL}/about`, changefreq: "monthly", priority: "0.6" },
  ];

  try {
    const res2 = await fetch(ADDONS_URL);
    if (!res2.ok) throw new Error(`addons fetch failed: ${res2.status}`);
    const addons = await res2.json();
    for (const addon of addons) {
      urls.push({
        loc: `${SITE_URL}/addon/${addon.repo.owner}/${addon.repo.name}`,
        changefreq: "daily",
        priority: "0.8",
      });
    }
  } catch (err) {
    console.error("Failed to fetch addons for sitemap", err);
  }

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) =>
      `  <url>
    <loc>${escapeXml(u.loc)}</loc>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`;

  res.send(body);
}
