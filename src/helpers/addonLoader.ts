import type Addon from "./addon";

export default async function loadAddons(): Promise<Addon[]> {
  const res = await fetch(
    `https://raw.githubusercontent.com/cqb13/meteor-addon-scanner/refs/heads/addons/addons.json`,
  );

  // const res = await fetch(`http://localhost:5173/addons.json`);

  const addons: Addon[] = await res.json();

  return addons;
}
