export default interface Addon {
  authors: string[];
  features: string[];
  featureCount: number;
  icon: string | null;
  repo: {
    id: string;
    owner: string;
    name: string;
    archived: boolean;
    fork: boolean;
  };
  links: {
    github: string;
    download: string;
    discord: string;
    homepage: string;
  };
  name: string;
  summary: string;
  stars: number;
  downloads: number;
  lastUpdate: string;
  mcVersion: string | null;
  verified: boolean;
}
