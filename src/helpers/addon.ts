export default interface Addon {
  name: string;
  description: string;
  mc_version: string;
  authors: string[];
  features: string[];
  featureCount: number;
  verified: boolean;
  repo: {
    id: string;
    owner: string;
    name: string;
    archived: boolean;
    fork: boolean;
    stars: number;
    downloads: number;
    lastUpdate: string;
    creationDate: string;
  };
  links: {
    github: string;
    download: string;
    discord: string;
    homepage: string;
    icon: string;
  };
}
