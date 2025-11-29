/**
 * Parse a version string into an array of numbers
 * @example "1.21.10" => [1, 21, 10]
 */
export function parseVersion(v: string): number[] {
  return v?.match(/\d+/g)?.map(Number) ?? [];
}

/**
 * Compare two parsed version arrays
 * Returns positive if a > b, negative if a < b, 0 if equal
 */
export function compareParsedVersions(a: number[], b: number[]): number {
  const len = Math.max(a.length, b.length);
  for (let i = 0; i < len; i++) {
    const diff = (a[i] ?? 0) - (b[i] ?? 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

/**
 * Sort version strings in descending order (newest first)
 * @example ["1.20.4", "1.21.10", "1.21.1"] => ["1.21.10", "1.21.1", "1.20.4"]
 */
export function sortVersionsDescending(versions: string[]): string[] {
  if (!versions || versions.length === 0) return [];

  return [...versions].sort((a, b) => {
    const parsedA = parseVersion(a);
    const parsedB = parseVersion(b);
    return compareParsedVersions(parsedB, parsedA); // Reverse order for descending
  });
}
