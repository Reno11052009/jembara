export type RelationContractStatus = "aktif" | "review" | "selesai" | "dibatalkan";

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
  rating?: number;
}

export interface AdminRelationsData {
  adminName: string;
  adminAvatarUrl?: string;
  rows: AdminRelationRow[];
  activeFilter: string;
}
