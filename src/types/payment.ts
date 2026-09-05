export const PROJECT_PAYMENT_STATUSES = [
  "NOT_CREATED",
  "CREATING",
  "PENDING",
  "HELD",
  "RELEASED",
  "FAILED",
  "EXPIRED",
  "CANCELLED",
  "REFUNDED",
  "CHARGEBACK",
] as const;

export type ProjectPaymentStatus = (typeof PROJECT_PAYMENT_STATUSES)[number];

export interface ProjectPaymentData {
  projectId: string;
  projectTitle: string;
  studentName: string;
  amount: number;
  amountLabel: string;
  status: ProjectPaymentStatus;
  statusLabel: string;
  redirectUrl: string | null;
  snapToken?: string | null;
  clientKey?: string;
  snapScriptUrl?: string;
  environment?: "sandbox" | "production";
  orderId?: string | null;
  canPay: boolean;
  canSync: boolean;
}

export interface PaymentActionResult {
  success: boolean;
  error?: string;
  redirectUrl?: string;
  snapToken?: string;
  status?: ProjectPaymentStatus;
}
