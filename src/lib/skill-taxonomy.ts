export const skillTaxonomy = [
  { name: "Web Development", category: "Technology" },
  { name: "UI/UX Design", category: "Design" },
  { name: "Graphic Design", category: "Design" },
  { name: "Video Editing", category: "Creative" },
  { name: "Photography", category: "Creative" },
  { name: "Digital Marketing", category: "Marketing" },
  { name: "Social Media Management", category: "Marketing" },
  { name: "Content Creation", category: "Creative" },
  { name: "Copywriting", category: "Marketing" },
  { name: "SEO", category: "Marketing" },
  { name: "Figma", category: "Design" },
  { name: "React", category: "Technology" },
  { name: "Next.js", category: "Technology" },
  { name: "Product Photography", category: "Creative" },
] as const;

const canonicalSkills = new Map(
  skillTaxonomy.map((skill) => [skill.name.toLocaleLowerCase("id-ID"), skill.name]),
);

export function getCanonicalSkillName(value: string) {
  return canonicalSkills.get(value.toLocaleLowerCase("id-ID"));
}

