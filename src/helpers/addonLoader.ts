import type Addon from "./addon";

export default async function loadAddons(): Promise<Addon[]> {
  // const res = await fetch(
  //   `https://raw.githubusercontent.com/cqb13/meteor-addon-scanner/refs/heads/main/addons.json?v=${new Date().getTime()}`,
  // );
  //

  const res = await fetch("/assets/addons.json");

  const addons: Addon[] = await res.json();

  return addons;
}
