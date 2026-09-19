import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import Navbar from "../../src/components/navbar/Navbar";

describe("Navbar", () => {
  it("should render Login/Sign up button and not render post and profile action button when user is not logged in", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("button", { name: /Login\/Sign up/i }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Post/i }),
    ).not.toBeInTheDocument();

    expect(screen.queryByTestId("profileActBtn")).not.toBeInTheDocument();
  });

  it("should render post and profile action button and not Login/Sign up button when user is logged in", () => {
    render(
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button", { name: /Post/i })).toBeInTheDocument();

    expect(screen.getByTestId("profileActBtn")).toBeInTheDocument();

    expect(
      screen.queryByRole("button", { name: /Login\/Sign up/i }),
    ).not.toBeInTheDocument();
  });
});
