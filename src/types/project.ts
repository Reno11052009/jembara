export interface Project {
  id: string;
  title: string;
  companyName: string;
  description: string;
  tags: string[];
  budgetLabel: string;
  deadlineLabel: string;
  locationLabel: string;
  matchPercent: number;
  skillMatchPercent: number;
}