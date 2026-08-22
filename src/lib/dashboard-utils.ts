const DAY_IN_MS = 24 * 60 * 60 * 1000;

export function calculateProfileCompletion(checks: readonly boolean[]) {
  if (checks.length === 0) return 0;

  const completed = checks.filter(Boolean).length;
  return Math.round((completed / checks.length) * 100);
}

export function calculateSkillMatch(
  studentSkills: readonly string[],
  requiredSkills: readonly string[],
) {
  if (requiredSkills.length === 0) return 0;

  const normalizedStudentSkills = new Set(
    studentSkills.map((skill) => skill.trim().toLocaleLowerCase("id-ID")),
  );
  const normalizedRequiredSkills = new Set(
    requiredSkills.map((skill) => skill.trim().toLocaleLowerCase("id-ID")),
  );
  const matchedSkills = [...normalizedRequiredSkills].filter((skill) =>
    normalizedStudentSkills.has(skill),
  ).length;

  return Math.round((matchedSkills / normalizedRequiredSkills.size) * 100);
}

export function formatBudget(budget: number | null) {
  if (budget === null) return "Dapat dinegosiasikan";

  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(budget);
}

export function formatDeadline(deadline: Date | null, now = new Date()) {
  if (!deadline) return "Fleksibel";

  const remainingDays = Math.ceil((deadline.getTime() - now.getTime()) / DAY_IN_MS);
  if (remainingDays < 0) return "Tenggat terlewat";
  if (remainingDays === 0) return "Hari ini";
  return `${remainingDays} hari lagi`;
}

export function formatRelativeDate(value: Date, now = new Date()) {
  const elapsedMinutes = Math.max(0, Math.floor((now.getTime() - value.getTime()) / 60_000));
  if (elapsedMinutes < 1) return "Baru saja";
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`;

  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 7) return `${elapsedDays} hari lalu`;

  return new Intl.DateTimeFormat("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(value);
}
