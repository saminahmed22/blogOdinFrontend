import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Header from "./Header";

describe("Header component", () => {
  // Tests for the heading
  describe("Heading", () => {
    it("Renders correct heading", () => {
      render(
        <MemoryRouter>
          <Header authStatus={false} />
        </MemoryRouter>,
      );

      expect(screen.getByRole("heading").textContent).toMatch(/BlogOdin/i);
    });
  });

  // Tests for the Navbar
  describe("Navbar", () => {
    it("Renders the navbar", () => {
      render(
        <MemoryRouter>
          <Header authStatus={false} />
        </MemoryRouter>,
      );

      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("Renders Login/sign up button when user is not logged in", () => {
      render(
        <MemoryRouter>
          <Header authStatus={false} />
        </MemoryRouter>,
      );
      expect(screen.getByRole("button").textContent).toMatch(/Login\/Sign up/i);
    });

    it("Does not renders Login/sign up button when user is logged in", () => {
      render(
        <MemoryRouter>
          <Header authStatus={true} />
        </MemoryRouter>,
      );

      expect(screen.queryByTitle("Login or Sign up")).not.toBeInTheDocument();
    });

    it("Renders post button when user is logged in", () => {
      render(
        <MemoryRouter>
          <Header authStatus={true} />
        </MemoryRouter>,
      );

      expect(screen.queryByTitle("Create a post")).toBeInTheDocument();
    });

    it("Renders profile actions button when user is logged in", () => {
      render(
        <MemoryRouter>
          <Header authStatus={true} />
        </MemoryRouter>,
      );

      expect(screen.queryByTitle("Profile actions")).toBeInTheDocument();
    });
  });
});
