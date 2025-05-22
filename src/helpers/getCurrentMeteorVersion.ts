export default async function getCurrentMeteorVersion(): Promise<
  string | null
> {
  const response = await fetch(
    "https://raw.githubusercontent.com/MeteorDevelopment/meteor-client/refs/heads/master/gradle.properties",
  );

  const text = await response.text();
  let lines = text.split("\n");

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];
    if (line.startsWith("minecraft_version=")) {
      line = line.replace("minecraft_version=", "");
      line = line.trim();
      return line;
    }
  }

  return null;
}
