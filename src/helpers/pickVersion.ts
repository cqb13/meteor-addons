import formatList from "./formatList";
import { sortVersionsDescending } from "./sortVersions";

export default function pickVersion(
  mcVersion: string,
  supportedVersions: string[] | null,
): string {
  if (supportedVersions == null || supportedVersions.length == 0) {
    return "For " + mcVersion;
  } else {
    // Sort versions in descending order so newest versions appear first
    const sortedVersions = sortVersionsDescending(supportedVersions);
    return "For " + formatList(sortedVersions);
  }
}
