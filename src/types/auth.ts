export interface LoginFormData {
  email: string;
  password: string;
  twoFactorCode?: string;
}

export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  address: string;
}

export type LoginFormErrors = Partial<Record<keyof LoginFormData, string>>;
export type RegisterFormErrors = Partial<Record<keyof RegisterFormData, string>>;

export type FormStatus = "idle" | "submitting" | "success" | "error";
