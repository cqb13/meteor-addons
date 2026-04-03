import type Addon from "./addon";

export interface FilterOptions {
  verifiedOnly: boolean;
  includeForks: boolean;
  includeArchived: boolean;
  onlyWithReleases: boolean;
  selectedVersion: string;
  searchValue: string;
  featureSearch: boolean;
}

function getActiveFeaturePrefix(searchValue: string): string | null {
  const lower = searchValue.toLowerCase();
  if (lower.startsWith("hud:")) return "hud:";
  if (lower.startsWith("module:")) return "module:";
  if (lower.startsWith("command:")) return "command:";
  if (lower.startsWith("feature:")) return "feature:";
  return null;
}

export function passesFilters(addon: Addon, filters: FilterOptions): boolean {
  const {
    verifiedOnly,
    includeForks,
    includeArchived,
    onlyWithReleases,
    selectedVersion,
    searchValue,
    featureSearch,
  } = filters;

  if (verifiedOnly && !addon.verified) return false;
  if (!includeForks && addon.repo.fork) return false;
  if (!includeArchived && addon.repo.archived) return false;
  if (onlyWithReleases && addon.links.downloads.length === 0) return false;

  if (selectedVersion !== "All") {
    const versionMatch =
      addon.mc_version === selectedVersion ||
      addon.custom.supported_versions?.includes(selectedVersion);
    if (!versionMatch) return false;
  }

  const activePrefix = getActiveFeaturePrefix(searchValue);
  const isFeatureMode = featureSearch || activePrefix !== null;

  if (isFeatureMode) {
    if (!addon.features) return false;

    const lowerSearch = searchValue.toLowerCase();
    const features = addon.features;

    if (activePrefix === "hud:") {
      const query = lowerSearch.slice(4);
      return (
        features.hud_elements?.some((e) =>
          e.name.toLowerCase().includes(query),
        ) || false
      );
    } else if (activePrefix === "module:") {
      const query = lowerSearch.slice(7);
      return (
        features.modules?.some((e) => e.name.toLowerCase().includes(query)) ||
        false
      );
    } else if (activePrefix === "command:") {
      const query = lowerSearch.slice(8);
      return (
        features.commands?.some((e) => e.name.toLowerCase().includes(query)) ||
        false
      );
    } else if (activePrefix === "feature:") {
      const query = lowerSearch.slice(8);
      return (
        features.modules?.some((e) => e.name.toLowerCase().includes(query)) ||
        features.commands?.some((e) => e.name.toLowerCase().includes(query)) ||
        features.hud_elements?.some((e) => e.name.toLowerCase().includes(query))
      );
    } else {
      return (
        features.modules?.some((e) =>
          e.name.toLowerCase().includes(lowerSearch),
        ) ||
        features.commands?.some((e) =>
          e.name.toLowerCase().includes(lowerSearch),
        ) ||
        features.hud_elements?.some((e) =>
          e.name.toLowerCase().includes(lowerSearch),
        )
      );
    }
  } else {
    const lowerSearch = searchValue.toLowerCase();
    return (
      addon.name.toLowerCase().includes(lowerSearch) ||
      addon.authors.some((author) =>
        author.toLowerCase().includes(lowerSearch),
      ) ||
      (addon.custom.tags != null &&
        addon.custom.tags.some((tag) =>
          tag.toLowerCase().includes(lowerSearch),
        )) ||
      addon.repo.owner.toLowerCase().includes(lowerSearch)
    );
  }
}

export function filterAddons(addons: Addon[], filters: FilterOptions): Addon[] {
  return addons.filter((addon) => passesFilters(addon, filters));
}

export interface FilterState {
  verifiedOnly: boolean;
  includeForks: boolean;
  includeArchived: boolean;
  onlyWithReleases: boolean;
  selectedVersion: string;
}

export function passesBaseFilters(addon: Addon, filters: FilterState): boolean {
  const {
    verifiedOnly,
    includeForks,
    includeArchived,
    onlyWithReleases,
    selectedVersion,
  } = filters;

  if (verifiedOnly && !addon.verified) return false;
  if (!includeForks && addon.repo.fork) return false;
  if (!includeArchived && addon.repo.archived) return false;
  if (onlyWithReleases && addon.links.downloads.length === 0) return false;

  if (selectedVersion !== "All") {
    const versionMatch =
      addon.mc_version === selectedVersion ||
      addon.custom.supported_versions?.includes(selectedVersion);
    if (!versionMatch) return false;
  }

  return true;
}

export function getFilteredAddons(
  addons: Addon[],
  filters: FilterState,
): Addon[] {
  return addons.filter((addon) => passesBaseFilters(addon, filters));
}

export function getActivePrefix(searchValue: string): string | null {
  return getActiveFeaturePrefix(searchValue);
}
