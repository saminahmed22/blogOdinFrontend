import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";

import PostCard from "./PostCard";

describe("PostCard component", () => {
  it("Should have a heading", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading")).toBeInTheDocument();
  });

  it("Should have author's profile picture", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("post-author-image")).toBeInTheDocument();
  });

  it("Should have author's name", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("post-author-name")).toBeInTheDocument();
  });

  it("Should have a upload date", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("post-upload-date")).toBeInTheDocument();
  });

  it("Should have a expiry date", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.queryByTestId("post-expiry-date")).toBeInTheDocument();
  });

  it("Should have a preview", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByTestId("post-preview")).toBeInTheDocument();
  });

  it("Should have a action button", () => {
    render(
      <MemoryRouter>
        <PostCard />
      </MemoryRouter>,
    );

    expect(screen.getByRole("button")).toBeInTheDocument();
  });
});
