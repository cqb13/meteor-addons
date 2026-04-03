import { useMemo } from "preact/hooks";
import type Addon from "../helpers/addon";

export interface SearchSuggestion {
  type: "addon" | "author" | "tag" | "hint" | "feature";
  value: string;
  label: string;
  prefix?: string;
}

const FEATURE_HINTS = [
  { type: "hint" as const, value: "hud:", label: "hud:", prefix: "hud:" },
  {
    type: "hint" as const,
    value: "module:",
    label: "module:",
    prefix: "module:",
  },
  {
    type: "hint" as const,
    value: "command:",
    label: "command:",
    prefix: "command:",
  },
  {
    type: "hint" as const,
    value: "feature:",
    label: "feature:",
    prefix: "feature:",
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

    const specificPrefixes = ["hud:", "module:", "command:"];
    const hasSpecificPrefix = specificPrefixes.some((p) => query.startsWith(p));
    const hasFeaturePrefix = query.startsWith("feature:");

    const isFeatureMode =
      featureSearch || hasSpecificPrefix || hasFeaturePrefix;

    // Determine active prefix to prepend to feature suggestions
    let activePrefix = "";
    if (hasFeaturePrefix) {
      activePrefix = "feature:";
    } else if (query.startsWith("hud:")) {
      activePrefix = "hud:";
    } else if (query.startsWith("module:")) {
      activePrefix = "module:";
    } else if (query.startsWith("command:")) {
      activePrefix = "command:";
    }

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
      let searchQuery = query;
      let currentPrefix: string | null = null;

      if (hasFeaturePrefix) {
        searchQuery = query.slice(8);
      } else if (hasSpecificPrefix) {
        currentPrefix =
          specificPrefixes.find((p) => query.startsWith(p)) || null;
        if (currentPrefix) {
          searchQuery = query.slice(currentPrefix.length);
        }
      }

      const seenFeatures = new Set<string>();

      addons.forEach((addon) => {
        if (!addon.features) return;

        // if using specific prefix or generic feature prefix searching features.
        const searchModules =
          hasFeaturePrefix ||
          currentPrefix === "module:" ||
          (!currentPrefix && !hasSpecificPrefix);
        const searchCommands =
          hasFeaturePrefix ||
          currentPrefix === "command:" ||
          (!currentPrefix && !hasSpecificPrefix);
        const searchHud =
          hasFeaturePrefix ||
          currentPrefix === "hud:" ||
          (!currentPrefix && !hasSpecificPrefix);

        if (searchModules && addon.features.modules) {
          addon.features.modules
            .filter((e) => e.name.toLowerCase().includes(searchQuery))
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
            .filter((e) => e.name.toLowerCase().includes(searchQuery))
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
            .filter((e) => e.name.toLowerCase().includes(searchQuery))
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
