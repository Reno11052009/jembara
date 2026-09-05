export interface ProjectDetailData {
  id: string;
  title: string;
  description: string;
  businessName: string;
  businessLocation: string;
  budgetLabel: string;
  deadlineLabel: string;
  workModeLabel: string;
  locationLabel: string;
  requiredSkills: string[];
  optionalSkills: string[];
  matchedSkills: string[];
  missingSkills: string[];
  skillMatchPercent: number;
  viewerRole: "STUDENT" | "UMKM" | "ADMIN";
  canApply: boolean;
  existingProposalStatus: string | null;
  applyDisabledReason: string | null;
}
