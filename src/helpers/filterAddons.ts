import type Addon from "./addon";
import {
  COMMAND_PREFIX,
  FEATURE_PREFIX,
  HUD_PREFIX,
  MODULE_PREFIX,
  parseSearchQuery,
} from "./searchHelpers";

export interface FilterOptions {
  verifiedOnly: boolean;
  includeForks: boolean;
  includeArchived: boolean;
  onlyWithReleases: boolean;
  selectedVersion: string;
  searchValue: string;
  featureSearch: boolean;
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

  const { prefix, query } = parseSearchQuery(searchValue);
  const isFeatureMode = featureSearch || prefix !== null;

  if (isFeatureMode) {
    if (!addon.features) return false;

    const lowerQuery = query.toLowerCase();
    const features = addon.features;

    switch (prefix) {
      case HUD_PREFIX: {
        return (
          features.hud_elements?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) || false
        );
      }
      case MODULE_PREFIX: {
        return (
          features.modules?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) || false
        );
      }
      case COMMAND_PREFIX: {
        return (
          features.commands?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) || false
        );
      }
      case FEATURE_PREFIX: {
        return (
          features.modules?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) ||
          features.commands?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) ||
          features.hud_elements?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          )
        );
      }
      default: {
        return (
          features.modules?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) ||
          features.commands?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          ) ||
          features.hud_elements?.some((e) =>
            e.name.toLowerCase().includes(lowerQuery),
          )
        );
      }
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
  return parseSearchQuery(searchValue).prefix;
}
