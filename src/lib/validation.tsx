export function validateEmail(email: string): string | undefined {
  if (!email) return "Email wajib diisi";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Format email tidak valid";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Password wajib diisi";
  if (password.length < 8) return "Password minimal 8 karakter";
  return undefined;
}

export function validateFullName(name: string): string | undefined {
  if (!name.trim()) return "Nama lengkap wajib diisi";
  if (name.trim().length < 3) return "Nama terlalu pendek";
  return undefined;
}

export function validateConfirmPassword(
  password: string,
  confirmPassword: string
): string | undefined {
  if (!confirmPassword) return "Konfirmasi password wajib diisi";
  if (password !== confirmPassword) return "Password tidak cocok";
  return undefined;
}

export function validateAddress(address: string): string | undefined {
  if (!address.trim()) return "Alamat wajib diisi";
  if (address.trim().length < 5) return "Alamat terlalu pendek";
  return undefined;
}