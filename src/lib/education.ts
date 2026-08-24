export const educationLevelOptions = [
  { value: "SMP", label: "SMP" },
  { value: "SMA", label: "SMA" },
  { value: "SMK", label: "SMK" },
  { value: "D3", label: "D3 (Diploma 3)" },
  { value: "D4", label: "D4 (Diploma 4)" },
  { value: "S1", label: "S1 (Sarjana)" },
  { value: "S2", label: "S2 (Magister)" },
  { value: "S3", label: "S3 (Doktor)" },
] as const;

const schoolEducationLevels = new Set(["SMP", "SMA", "SMK"]);

export function educationUsesSemester(level: string) {
  return !schoolEducationLevels.has(level.trim().toLocaleUpperCase("id-ID"));
}
