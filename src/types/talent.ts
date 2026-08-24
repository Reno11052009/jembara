export interface Talent {
  id: string;
  name: string;
  role: string;
  matchPercent: number;
  rating: number;
  rateLabel: string;
  ratePerHour: number;
  location: string;
  isRemote?: boolean;
  experienceLevel: string;
  skills: string[];
}

export interface TalentFilters {
  query: string;
  skill: string;
  location: string;
  rating: string;
  experience: string;
  budget: string;
}

export interface TalentFilterOption {
  label: string;
  value: string;
}
