import { useMemo } from "preact/hooks";
import type Addon from "../helpers/addon";
import {
  COMMAND_PREFIX,
  FEATURE_PREFIX,
  HUD_PREFIX,
  MODULE_PREFIX,
  parseSearchQuery,
} from "../helpers/searchHelpers";

export interface SearchSuggestion {
  type: "addon" | "author" | "tag" | "hint" | "feature";
  value: string;
  label: string;
  prefix?: string;
}

const FEATURE_HINTS = [
  {
    type: "hint" as const,
    value: HUD_PREFIX,
    label: HUD_PREFIX,
    prefix: HUD_PREFIX,
  },
  {
    type: "hint" as const,
    value: MODULE_PREFIX,
    label: MODULE_PREFIX,
    prefix: MODULE_PREFIX,
  },
  {
    type: "hint" as const,
    value: COMMAND_PREFIX,
    label: COMMAND_PREFIX,
    prefix: COMMAND_PREFIX,
  },
  {
    type: "hint" as const,
    value: FEATURE_PREFIX,
    label: FEATURE_PREFIX,
    prefix: FEATURE_PREFIX,
  },
];

export function useSearchSuggestions(
  addons: Addon[],
  searchValue: string,
  featureSearch: boolean,
) {
  return useMemo(() => {
    const query = searchValue.toLowerCase().trim();
    if (query.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];

    const authors = new Set<string>();
    const tags = new Set<string>();

    addons.forEach((addon) => {
      addon.authors.forEach((author) => authors.add(author));
      addon.custom.tags?.forEach((tag) => tags.add(tag));
    });

    // Always show hints when search could be a prefix
    const matchingHints = FEATURE_HINTS.filter((h) =>
      h.value.startsWith(query),
    );
    suggestions.push(...matchingHints);

    const { prefix, query: searchQuery } = parseSearchQuery(query);
    const isFeatureMode = featureSearch || prefix !== null;
    const activePrefix = prefix || "";

    if (!isFeatureMode) {
      const matchingAddons = addons
        .filter((a) => a.name.toLowerCase().includes(query))
        .slice(0, 3)
        .map((a) => ({
          type: "addon" as const,
          value: a.name,
          label: a.name,
        }));
      suggestions.push(...matchingAddons);

      const matchingAuthors = Array.from(authors)
        .filter((a) => a.toLowerCase().includes(query))
        .slice(0, 2)
        .map((a) => ({
          type: "author" as const,
          value: a,
          label: a,
        }));
      suggestions.push(...matchingAuthors);

      const matchingTags = Array.from(tags)
        .filter((t) => t.toLowerCase().includes(query))
        .slice(0, 2)
        .map((t) => ({
          type: "tag" as const,
          value: t,
          label: t,
        }));
      suggestions.push(...matchingTags);
    }

    if (isFeatureMode) {
      const seenFeatures = new Set<string>();
      const lowerSearchQuery = searchQuery.toLowerCase();

      const shouldSearchFeatureType = (featurePrefix: string): boolean =>
        prefix === FEATURE_PREFIX ||
        prefix === featurePrefix ||
        prefix === null;

      addons.forEach((addon) => {
        if (!addon.features) return;

        const searchModules = shouldSearchFeatureType(MODULE_PREFIX);
        const searchCommands = shouldSearchFeatureType(COMMAND_PREFIX);
        const searchHud = shouldSearchFeatureType(HUD_PREFIX);

        if (searchModules && addon.features.modules) {
          addon.features.modules
            .filter((e) => e.name.toLowerCase().includes(lowerSearchQuery))
            .slice(0, 2)
            .forEach((e) => {
              if (!seenFeatures.has(e.name)) {
                seenFeatures.add(e.name);
                suggestions.push({
                  type: "feature",
                  value: activePrefix + e.name,
                  label: e.name,
                  prefix: activePrefix,
                });
              }
            });
        }

        if (searchCommands && addon.features.commands) {
          addon.features.commands
            .filter((e) => e.name.toLowerCase().includes(lowerSearchQuery))
            .slice(0, 2)
            .forEach((e) => {
              if (!seenFeatures.has(e.name)) {
                seenFeatures.add(e.name);
                suggestions.push({
                  type: "feature",
                  value: activePrefix + e.name,
                  label: e.name,
                  prefix: activePrefix,
                });
              }
            });
        }

        if (searchHud && addon.features.hud_elements) {
          addon.features.hud_elements
            .filter((e) => e.name.toLowerCase().includes(lowerSearchQuery))
            .slice(0, 2)
            .forEach((e) => {
              if (!seenFeatures.has(e.name)) {
                seenFeatures.add(e.name);
                suggestions.push({
                  type: "feature",
                  value: activePrefix + e.name,
                  label: e.name,
                  prefix: activePrefix,
                });
              }
            });
        }
      });
    }

    return suggestions.slice(0, 8);
  }, [addons, searchValue, featureSearch]);
}
