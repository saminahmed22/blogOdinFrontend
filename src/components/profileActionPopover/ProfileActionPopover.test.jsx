import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import ProfileActionPopover from "./ProfileActionPopover";

describe("ProfileActionPopover component", async () => {
  it("Renders profile actions popover", () => {
    render(
      <MemoryRouter>
        <ProfileActionPopover />
      </MemoryRouter>,
    );

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
  });

  // JSDom doesn't support popover api as of Aug 24, 2026
});
