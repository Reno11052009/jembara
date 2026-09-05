export type WithdrawalStatus = "PENDING" | "COMPLETED" | "REJECTED";

export interface WithdrawalListItem {
  id: string;
  studentName: string;
  studentEmail: string;
  amount: number;
  amountLabel: string;
  provider: string;
  accountName: string;
  accountNumber: string;
  status: WithdrawalStatus;
  statusLabel: string;
  adminNote: string | null;
  createdAtLabel: string;
  processedAtLabel: string | null;
}

export interface PayoutMethodOption {
  id: string;
  label: string;
  isPrimary: boolean;
}

export type WithdrawalPageData =
  | {
      role: "STUDENT";
      balance: number;
      balanceLabel: string;
      payoutMethods: PayoutMethodOption[];
      requests: WithdrawalListItem[];
    }
  | {
      role: "ADMIN";
      pendingCount: number;
      requests: WithdrawalListItem[];
    };
