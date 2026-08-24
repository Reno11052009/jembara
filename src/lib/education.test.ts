import { describe, expect, it } from "vitest";
import { educationUsesSemester } from "./education";

describe("educationUsesSemester", () => {
  it.each(["SMP", "SMA", "SMK", " smk "])(
    "hides semester for school level %s",
    (level) => {
      expect(educationUsesSemester(level)).toBe(false);
    },
  );

  it.each(["D3", "D4", "S1", "S2", "S3", ""])(
    "keeps semester for higher education level %s",
    (level) => {
      expect(educationUsesSemester(level)).toBe(true);
    },
  );
});
