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
    download: string;
    discord: string;
    homepage: string;
    icon: string;
  };
}

export interface Features {
  modules: string[];
  commands: string[];
  hud_elements: string[];
  feature_count: number;
}
