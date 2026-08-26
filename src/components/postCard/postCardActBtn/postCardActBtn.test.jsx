import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import PostCardActBtn from "./PostCardActBtn.jsx";

describe("ProfileActionPopover component", async () => {
  it("Renders post card actions popover", () => {
    render(<PostCardActBtn />);

    expect(screen.getByRole("dialog", { hidden: true })).toBeInTheDocument();
  });

  it("Popover menu is not visible when button has not clicked", () => {
    render(<PostCardActBtn />);

    expect(screen.getByTestId("dialog")).not.toBeVisible();
  });
});
