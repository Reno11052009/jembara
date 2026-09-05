import { describe, expect, it } from "vitest";
import { canTransitionProject } from "@/lib/project-state-machine";
describe("project state machine", () => {
  it("allows only the canonical lifecycle and revision loop", () => {
    expect(canTransitionProject("OPEN", "PROPOSAL")).toBe(true);
    expect(canTransitionProject("PROPOSAL", "IN_PROGRESS")).toBe(true);
    expect(canTransitionProject("IN_PROGRESS", "REVIEW")).toBe(true);
    expect(canTransitionProject("REVIEW", "IN_PROGRESS")).toBe(true);
    expect(canTransitionProject("REVIEW", "COMPLETED")).toBe(true);
  });
  it("keeps terminal statuses terminal", () => {
    expect(canTransitionProject("COMPLETED", "OPEN")).toBe(false);
    expect(canTransitionProject("CANCELLED", "IN_PROGRESS")).toBe(false);
  });
});
