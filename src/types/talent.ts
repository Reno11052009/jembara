export interface Talent {
  id: string;
  name: string;
  role: string;
  matchPercent: number;
  rating: number | null;
  rateLabel?: string;
  ratePerHour?: number;
  location: string;
  isRemote?: boolean;
  experienceLevel?: string;
  skills: string[];
  completedProjectCount?: number;
  portfolioCount?: number;
  profileUrl?: string | null;
}

export interface TalentFilters {
  query: string;
  skill: string;
  location: string;
  rating: string;
}

export interface TalentFilterOption {
  label: string;
  value: string;
}

export interface TalentProjectOption {
  id: string;
  title: string;
}

export interface TalentSearchData {
  ownerName: string;
  ownerAvatarUrl: string;
  talents: Talent[];
  projects: TalentProjectOption[];
  selectedProjectId: string | null;
  selectedProjectTitle: string | null;
  skillOptions: TalentFilterOption[];
  locationOptions: TalentFilterOption[];
  ratingOptions: TalentFilterOption[];
}
