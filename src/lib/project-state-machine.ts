export const PROJECT_STATUSES = ["OPEN", "PROPOSAL", "IN_PROGRESS", "REVIEW", "COMPLETED", "CANCELLED"] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

const transitions: Record<ProjectStatus, readonly ProjectStatus[]> = {
  OPEN: ["PROPOSAL", "CANCELLED"],
  PROPOSAL: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["REVIEW", "CANCELLED"],
  REVIEW: ["IN_PROGRESS", "COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function canTransitionProject(from: string, to: string) {
  if (!PROJECT_STATUSES.includes(from as ProjectStatus) || !PROJECT_STATUSES.includes(to as ProjectStatus)) return false;
  return transitions[from as ProjectStatus].includes(to as ProjectStatus);
}

export function assertProjectTransition(from: string, to: string) {
  if (!canTransitionProject(from, to)) throw new Error(`Transisi status project tidak diizinkan: ${from} -> ${to}`);
}
