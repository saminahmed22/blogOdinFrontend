import { describe, it, expect, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";

import { MemoryRouter } from "react-router";

import Feed from "./Feed";

const posts = [
  {
    id: "mIBlQMk8pk",
    authorId: "01a035aa-b286-758f-a485-4e27441696e8",
    title: "This is a post title",
    description: "This is a post description",
    published: true,
    created_at: "2026-08-24T21:32:58.089Z",
    edited_at: "2026-08-24T21:32:58.089Z",
  },
  {
    id: "u4Uq8HgfOu",
    authorId: "01a035aa-b286-758f-a485-4e27441696e8",
    title: "This is another post title",
    description: "This is another post description",
    published: true,
    created_at: "2026-08-24T21:33:41.447Z",
    edited_at: "2026-08-24T21:33:41.447Z",
  },
  {
    id: "VIcl8u4H2-",
    authorId: "01a035aa-b286-758f-a485-4e27441696e8",
    title: "This is the third post title",
    description: "This is the third post description",
    published: true,
    created_at: "2026-08-24T21:34:47.746Z",
    edited_at: "2026-08-24T21:34:47.746Z",
  },
];

const response = {
  status: 200,
  json: () => Promise.resolve(posts),
};

const responseNotOk = {
  status: 401,
  json: () => Promise.resolve([]),
};

describe("Feed component", async () => {
  it("Call feed api once to fetch posts", async () => {
    window.fetch = vi.fn(() => {
      return response;
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Feed />
        </MemoryRouter>,
      );
    });

    expect(window.fetch).toHaveBeenCalledOnce();
  });

  it("Render posts cards based on post counts", async () => {
    window.fetch = vi.fn(() => {
      return response;
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Feed />
        </MemoryRouter>,
      );
    });

    const postCards = screen.queryAllByTestId("postCard");

    expect(postCards).toHaveLength(3);
  });

  // it("Render loading message while fetching", async () => {
  //   window.fetch = vi.fn(() => {
  //     return response;
  //   });

  //   await act(async () => {
  //     render(
  //       <MemoryRouter>
  //         <Feed />
  //       </MemoryRouter>,
  //     );
  //   });

  //   expect(screen.queryByTestId("feedLoadingMessage")).toBeInTheDocument();
  // });

  it("Render error message on fetching failure", async () => {
    window.fetch = vi.fn(() => {
      return responseNotOk;
    });

    await act(async () => {
      render(
        <MemoryRouter>
          <Feed />
        </MemoryRouter>,
      );
    });

    expect(screen.getByTestId("feedErrorMessage")).toBeInTheDocument();
  });
});
