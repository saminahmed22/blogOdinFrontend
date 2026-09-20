import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { createMemoryRouter, RouterProvider } from "react-router";
import { MemoryRouter } from "react-router";
import { routes } from "../../routes";

import Header from "../../components/header/Header";

describe("Header component", () => {
  it("should renders correct heading", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading")).toHaveTextContent("QuoteFork");
  });

  it("should redirect to homepage when header gets clicked", () => {
    const router = createMemoryRouter(routes, { initialEntries: ["/"] });

    render(<RouterProvider router={router} />);
  });
});
