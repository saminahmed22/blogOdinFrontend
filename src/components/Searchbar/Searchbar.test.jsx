import { render, screen } from "@testing-library/react";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";

import Searchbar from "./Searchbar";

const mockedFetch = vi.fn();

global.fetch = mockedFetch;

describe("Searchbar", () => {
  beforeEach(() => {
    mockedFetch.mockClear();
  });

  it("should do an API call on text input", async () => {
    render(<Searchbar />);

    const searchBox = screen.getByRole("searchbox");

    await userEvent.type(searchBox, "Hello");

    expect(searchBox).toHaveValue("Hello");

    expect(mockedFetch).toHaveBeenCalledTimes(5);
  });
});
