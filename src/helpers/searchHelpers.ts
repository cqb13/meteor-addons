export const HUD_PREFIX = "hud:";
export const MODULE_PREFIX = "module:";
export const COMMAND_PREFIX = "command:";
export const FEATURE_PREFIX = "feature:";

/**
 * @example
 * parseSearchQuery("module:auto crystal") // returns { prefix: "module:", query: "auto crystal" }
 */
export function parseSearchQuery(searchValue: string): {
  prefix: string | null;
  query: string;
} {
  const lower = searchValue.toLowerCase();

  for (const prefix of [
    FEATURE_PREFIX,
    HUD_PREFIX,
    MODULE_PREFIX,
    COMMAND_PREFIX,
  ]) {
    if (lower.startsWith(prefix)) {
      return {
        prefix,
        query: searchValue.slice(prefix.length),
      };
    }
  }

  return { prefix: null, query: searchValue };
}
