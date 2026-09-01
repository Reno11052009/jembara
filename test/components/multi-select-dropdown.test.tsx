// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { useState } from "react";
import { afterEach, describe, expect, it } from "vitest";
import MultiSelectDropdown from "@/components/ui/MultiSelectDropdown";

const options = [
  { code: "skill-1", name: "Web Development", group: "Teknologi" },
  { code: "skill-2", name: "UI/UX Design", group: "Desain" },
  { code: "skill-3", name: "Video Editing", group: "Kreatif" },
];

function SkillDropdown() {
  const [values, setValues] = useState<string[]>([]);

  return (
    <form>
      <MultiSelectDropdown
        id="requiredSkills"
        name="skillIds"
        values={values}
        onChange={setValues}
        options={options}
        placeholder="Pilih skill wajib"
        maxSelections={2}
      />
    </form>
  );
}

describe("MultiSelectDropdown", () => {
  afterEach(cleanup);

  it("submits multiple selected values and enforces the selection limit", () => {
    render(<SkillDropdown />);

    fireEvent.click(screen.getByRole("button", { name: "Pilih skill wajib" }));
    fireEvent.click(screen.getByRole("option", { name: "Web Development" }));
    fireEvent.click(screen.getByRole("option", { name: "UI/UX Design" }));

    expect(screen.getByRole("button", { name: "2 skill dipilih" })).toBeTruthy();
    expect(screen.getByRole("option", { name: "Video Editing" }).hasAttribute("disabled"))
      .toBe(true);
    expect(
      Array.from(document.querySelectorAll<HTMLInputElement>('input[name="skillIds"]')).map(
        (input) => input.value,
      ),
    ).toEqual(["skill-1", "skill-2"]);

    fireEvent.click(screen.getByRole("button", { name: "Hapus Web Development" }));
    expect(
      Array.from(document.querySelectorAll<HTMLInputElement>('input[name="skillIds"]')).map(
        (input) => input.value,
      ),
    ).toEqual(["skill-2"]);
  });

  it("filters options using the search field", () => {
    render(<SkillDropdown />);

    fireEvent.click(screen.getByRole("button", { name: "Pilih skill wajib" }));
    fireEvent.change(screen.getByPlaceholderText("Cari pilihan..."), {
      target: { value: "video" },
    });

    expect(screen.getByRole("option", { name: "Video Editing" })).toBeTruthy();
    expect(screen.queryByRole("option", { name: "Web Development" })).toBeNull();
  });
});
