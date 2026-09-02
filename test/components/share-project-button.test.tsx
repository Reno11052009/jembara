// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import ShareProjectButton from "@/components/projects/ShareProjectButton";

describe("ShareProjectButton", () => {
  afterEach(() => {
    cleanup();
    vi.restoreAllMocks();
  });

  it("uses the native share dialog with the public project URL", async () => {
    const share = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: share,
    });

    render(
      <ShareProjectButton projectId="project-1" projectTitle="Website Katalog" />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Bagikan project Website Katalog" }),
    );

    await waitFor(() => {
      expect(share).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Website Katalog | Jembara",
          url: "http://localhost:3000/projects/project-1",
        }),
      );
    });
  });

  it("copies the public project URL when native sharing is unavailable", async () => {
    Object.defineProperty(navigator, "share", {
      configurable: true,
      value: undefined,
    });
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText },
    });

    render(
      <ShareProjectButton projectId="project-2" projectTitle="Desain Kemasan" />,
    );
    fireEvent.click(
      screen.getByRole("button", { name: "Bagikan project Desain Kemasan" }),
    );

    await waitFor(() => {
      expect(writeText).toHaveBeenCalledWith(
        "http://localhost:3000/projects/project-2",
      );
      expect(screen.getByText("Tautan disalin")).toBeTruthy();
    });
  });
});
