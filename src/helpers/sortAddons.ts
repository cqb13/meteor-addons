import type Addon from "./addon";
import {
  parseVersion,
  compareParsedVersions,
} from "./sortVersions";

export enum SortMode {
  Stars,
  Downloads,
  Features,
  Age,
  LastUpdate,
  McVersion,
}

export function sortModeToString(sortMode: SortMode): string {
  switch (sortMode) {
    case SortMode.Stars:
      return "Stars";
    case SortMode.Downloads:
      return "Downloads";
    case SortMode.Features:
      return "Features";
    case SortMode.Age:
      return "Age";
    case SortMode.LastUpdate:
      return "Last Update";
    case SortMode.McVersion:
      return "Minecraft Version";
  }
}

export function sortAddons(addons: Addon[], mode: SortMode): Addon[] {
  switch (mode) {
    case SortMode.Stars:
      return sortAddonsByStars(addons);
    case SortMode.Downloads:
      return sortAddonsByDownloads(addons);
    case SortMode.Features:
      return sortAddonsByFeatures(addons);
    case SortMode.Age:
      return sortAddonsByAge(addons);
    case SortMode.LastUpdate:
      return sortAddonsByLastUpdate(addons);
    case SortMode.McVersion:
      return sortAddonsByMinecraftVersion(addons);
  }
}

function sortAddonsByStars(addons: Addon[]): Addon[] {
  return [...addons].sort(
    (a: Addon, b: Addon) => b.repo.stars - a.repo.stars,
  );
}

function sortAddonsByDownloads(addons: Addon[]): Addon[] {
  return [...addons].sort(
    (a: Addon, b: Addon) => b.repo.downloads - a.repo.downloads,
  );
}

function sortAddonsByFeatures(addons: Addon[]): Addon[] {
  return [...addons].sort(
    (a: Addon, b: Addon) =>
      b.features.feature_count - a.features.feature_count,
  );
}

function sortAddonsByAge(addons: Addon[]): Addon[] {
  return [...addons].sort(
    (a: Addon, b: Addon) =>
      new Date(a.repo.creation_date).getTime() -
      new Date(b.repo.creation_date).getTime(),
  );
}

function sortAddonsByLastUpdate(addons: Addon[]): Addon[] {
  return [...addons].sort(
    (a: Addon, b: Addon) =>
      new Date(a.repo.last_update).getTime() -
      new Date(b.repo.last_update).getTime(),
  );
}

function sortAddonsByMinecraftVersion(addons: Addon[]): Addon[] {
  const getVersions = (addon: Addon): string[] => {
    const sv = addon.custom?.supported_versions;
    if (sv && sv.length > 0) return sv;
    return addon.mc_version ? [addon.mc_version] : [];
  };

  const getBestVersion = (addon: Addon): number[] => {
    const parsed = getVersions(addon).map(parseVersion);
    parsed.sort((a, b) => compareParsedVersions(b, a));
    return parsed[0] ?? [];
  };

  return [...addons].sort((a, b) =>
    compareParsedVersions(getBestVersion(b), getBestVersion(a)),
  );
}
