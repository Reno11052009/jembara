export type ProjectPaymentStatus =
  | "NOT_CREATED"
  | "CREATING"
  | "PENDING"
  | "HELD"
  | "RELEASED"
  | "FAILED"
  | "EXPIRED"
  | "CANCELLED"
  | "REFUNDED"
  | "CHARGEBACK";

export interface ProjectPaymentData {
  projectId: string;
  projectTitle: string;
  studentName: string;
  amount: number;
  amountLabel: string;
  status: ProjectPaymentStatus;
  statusLabel: string;
  redirectUrl: string | null;
  canPay: boolean;
  canSync: boolean;
}

export interface PaymentActionResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  status?: ProjectPaymentStatus;
}
