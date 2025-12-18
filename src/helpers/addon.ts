export default interface Addon {
  name: string;
  description: string;
  mc_version: string;
  authors: string[];
  features: Features;
  verified: boolean;
  repo: {
    id: string;
    owner: string;
    name: string;
    archived: boolean;
    fork: boolean;
    stars: number;
    downloads: number;
    last_update: string;
    creation_date: string;
  };
  links: {
    github: string;
    downloads: string[];
    discord: string;
    latest_release: string;
    homepage: string;
    icon: string;
  };
  custom: {
    description: string;
    tags: string[];
    supported_versions: string[];
    latest_release: string;
    icon: string;
    discord: string;
    homepage: string;
  };
}

export interface Features {
  modules: string[];
  commands: string[];
  hud_elements: string[];
  feature_count: number;
}
