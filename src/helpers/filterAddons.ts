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

  if (featureSearch) {
    if (!addon.features) return false;

    const lowerSearch = searchValue.toLowerCase();
    const features = addon.features;

    if (lowerSearch.startsWith("hud:") && features.hud_elements) {
      const query = lowerSearch.slice(4);
      return features.hud_elements.some((e) =>
        e.name.toLowerCase().includes(query),
      );
    } else if (lowerSearch.startsWith("module:") && features.modules) {
      const query = lowerSearch.slice(7);
      return features.modules.some((e) => e.name.toLowerCase().includes(query));
    } else if (lowerSearch.startsWith("command:") && features.commands) {
      const query = lowerSearch.slice(8);
      return features.commands.some((e) =>
        e.name.toLowerCase().includes(query),
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
