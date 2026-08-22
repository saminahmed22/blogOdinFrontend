import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import Header from "./Header";

describe("Header component", () => {
  it("renders correct heading", () => {
    render(<Header />);

    expect(screen.getByRole("heading").textContent).toMatch(/BlogOdin/i);
  });
});
