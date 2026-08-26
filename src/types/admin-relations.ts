export type RelationContractStatus = "aktif" | "selesai" | "dibatalkan";

export interface RelationTimelineStep {
  id: string;
  label: string;
  date: string;
}

export interface AdminRelationRow {
  id: string;
  umkmOwnerName: string;
  umkmBusinessName: string;
  talentName: string;
  talentInstitution: string;
  projectName: string;
  contractValue: string;
  status: RelationContractStatus;
  progressPercent?: number;
  rating?: number;
  timeline?: RelationTimelineStep[];
}
