import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Header from "./Header";

describe("Header component", () => {
  it("Renders correct heading", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading")).toHaveTextContent("QuoteFork");
  });
});
