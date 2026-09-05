export const MATCHING_WEIGHTS = {
  skills: 0.4,
  portfolio: 0.2,
  rating: 0.15,
  budget: 0.1,
  availability: 0.1,
  location: 0.05,
} as const;

export const COLD_START_RATING_SCORE = 70;

export interface MatchingSkill {
  id: string;
  name: string;
  category?: string | null;
  required?: boolean;
}

export interface MatchingPortfolio {
  title: string;
  description?: string | null;
  evidenceSkillIds?: readonly string[];
}

export interface MatchingInput {
  project: {
    budget: number | null;
    workMode: string;
    location: string | null;
    skills: readonly MatchingSkill[];
  };
  student: {
    skills: readonly MatchingSkill[];
    portfolios: readonly MatchingPortfolio[];
    rating: number;
    reviewCount: number;
    available: boolean;
    expectedBudgetMin: number | null;
    expectedBudgetMax: number | null;
    provinceName: string | null;
    regencyName: string | null;
  };
}

export interface MatchingResult {
  eligible: boolean;
  totalScore: number;
  factors: {
    skills: number;
    portfolio: number;
    rating: number;
    budget: number;
    availability: number;
    location: number;
  };
  reasons: string[];
  inputs: Record<string, unknown>;
}

const clampScore = (value: number) => Math.max(0, Math.min(100, Math.round(value)));
const normalize = (value: string | null | undefined) =>
  value?.trim().toLocaleLowerCase("id-ID") ?? "";

function calculateBudgetScore(
  budget: number | null,
  expectedMin: number | null,
  expectedMax: number | null,
) {
  if (!budget || expectedMin === null || expectedMax === null) return 70;
  if (budget >= expectedMin && budget <= expectedMax) return 100;

  const nearest = budget < expectedMin ? expectedMin : expectedMax;
  const distanceRatio = Math.abs(budget - nearest) / Math.max(nearest, 1);
  return clampScore(100 - distanceRatio * 100);
}

function calculateLocationScore(input: MatchingInput) {
  if (input.project.workMode === "REMOTE") return 100;

  const location = normalize(input.project.location);
  if (!location) return 0;
  const regency = normalize(input.student.regencyName);
  const province = normalize(input.student.provinceName);

  if (regency && location.includes(regency)) return 100;
  if (province && location.includes(province)) return 60;
  return 0;
}

function calculatePortfolioScore(input: MatchingInput) {
  if (input.student.portfolios.length === 0) return 0;
  if (input.project.skills.length === 0) return 70;

  const relevantSkillIds = new Set<string>();
  for (const portfolio of input.student.portfolios) {
    for (const id of portfolio.evidenceSkillIds ?? []) relevantSkillIds.add(id);
    const searchable = normalize(`${portfolio.title} ${portfolio.description ?? ""}`);
    for (const skill of input.project.skills) {
      if (
        searchable.includes(normalize(skill.name)) ||
        (skill.category && searchable.includes(normalize(skill.category)))
      ) {
        relevantSkillIds.add(skill.id);
      }
    }
  }

  return clampScore((relevantSkillIds.size / input.project.skills.length) * 100);
}

export function calculateSmartMatch(input: MatchingInput): MatchingResult {
  const studentSkillIds = new Set(input.student.skills.map(({ id }) => id));
  const requiredSkills = input.project.skills.filter((skill) => skill.required !== false);
  const optionalSkills = input.project.skills.filter((skill) => skill.required === false);
  const matchedRequired = requiredSkills.filter(({ id }) => studentSkillIds.has(id));
  const matchedOptional = optionalSkills.filter(({ id }) => studentSkillIds.has(id));
  const missingRequired = requiredSkills.filter(({ id }) => !studentSkillIds.has(id));

  const requiredCoverage = requiredSkills.length
    ? matchedRequired.length / requiredSkills.length
    : 1;
  const optionalCoverage = optionalSkills.length
    ? matchedOptional.length / optionalSkills.length
    : 1;
  const factors = {
    skills: clampScore(
      optionalSkills.length
        ? requiredCoverage * 80 + optionalCoverage * 20
        : requiredCoverage * 100,
    ),
    portfolio: calculatePortfolioScore(input),
    rating:
      input.student.reviewCount > 0
        ? clampScore((input.student.rating / 5) * 100)
        : COLD_START_RATING_SCORE,
    budget: calculateBudgetScore(
      input.project.budget,
      input.student.expectedBudgetMin,
      input.student.expectedBudgetMax,
    ),
    availability: input.student.available ? 100 : 0,
    location: calculateLocationScore(input),
  };

  const eligible = missingRequired.length === 0;
  const totalScore = clampScore(
    factors.skills * MATCHING_WEIGHTS.skills +
      factors.portfolio * MATCHING_WEIGHTS.portfolio +
      factors.rating * MATCHING_WEIGHTS.rating +
      factors.budget * MATCHING_WEIGHTS.budget +
      factors.availability * MATCHING_WEIGHTS.availability +
      factors.location * MATCHING_WEIGHTS.location,
  );
  const reasons = [
    `${matchedRequired.length}/${requiredSkills.length} skill wajib cocok`,
    optionalSkills.length > 0
      ? `${matchedOptional.length}/${optionalSkills.length} skill opsional cocok`
      : "Tidak ada skill opsional",
    input.student.reviewCount > 0
      ? `Rating ${input.student.rating.toFixed(1)}/5`
      : "Rating baru memakai nilai netral 70%",
    input.project.workMode === "REMOTE"
      ? "Project remote cocok dari lokasi mana pun"
      : factors.location === 100
        ? "Lokasi kabupaten/kota cocok"
        : factors.location === 60
          ? "Lokasi provinsi cocok"
          : "Lokasi belum cocok",
  ];
  if (!eligible) {
    reasons.unshift(`Belum memenuhi: ${missingRequired.map(({ name }) => name).join(", ")}`);
  }

  return {
    eligible,
    totalScore,
    factors,
    reasons,
    inputs: {
      requiredSkillIds: requiredSkills.map(({ id }) => id),
      optionalSkillIds: optionalSkills.map(({ id }) => id),
      studentSkillIds: [...studentSkillIds],
      projectBudget: input.project.budget,
      expectedBudgetMin: input.student.expectedBudgetMin,
      expectedBudgetMax: input.student.expectedBudgetMax,
      workMode: input.project.workMode,
      projectLocation: input.project.location,
      studentProvince: input.student.provinceName,
      studentRegency: input.student.regencyName,
      reviewCount: input.student.reviewCount,
    },
  };
}
