import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import { getItemSpy } from "../../../testsSetup";

import Header from "./Header";

describe("Header component", () => {
  it("Renders correct heading", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading").textContent).toMatch(/BlogOdin/i);
  });

  it("Calls localStorage to fetch JWT data", () => {
    getItemSpy.mockImplementationOnce((key) => {
      return key === "jwt" ? null : true;
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(getItemSpy).toHaveBeenCalledWith("jwt");
  });

  it("Renders Login/sign up button when user is not logged in", () => {
    getItemSpy.mockImplementationOnce((key) => {
      return key === "jwt" ? null : true;
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("loginBtn")).toBeInTheDocument();
  });

  it("Does not renders Login/sign up button when user is logged in", () => {
    getItemSpy.mockImplementationOnce((key) => {
      return key === "jwt" ? true : null;
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("loginBtn")).not.toBeInTheDocument();
  });

  it("Renders post button when user is logged in", () => {
    getItemSpy.mockImplementationOnce((key) => {
      return key === "jwt" ? true : null;
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("postBtn")).toBeInTheDocument();
  });

  it("Renders profile actions button when user is logged in", () => {
    getItemSpy.mockImplementationOnce((key) => {
      return key === "jwt" ? true : null;
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("profileActBtn")).toBeInTheDocument();
  });
});
