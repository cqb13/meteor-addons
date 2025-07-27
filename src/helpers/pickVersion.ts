import formatList from "./formatList";

export default function pickVersion(
  mcVersion: string,
  supportedVersions: string[] | null,
): string {
  if (supportedVersions == null || supportedVersions.length == 0) {
    return "For " + mcVersion;
  } else {
    return "For " + formatList(supportedVersions);
  }
}
