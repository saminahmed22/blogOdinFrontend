import { expect, afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";
import * as matchers from "@testing-library/jest-dom/matchers";

export const getItemSpy = vi.spyOn(Storage.prototype, "getItem");
export const setItemSpy = vi.spyOn(Storage.prototype, "setItem");

expect.extend(matchers);

afterEach(() => {
  getItemSpy.mockClear();
  setItemSpy.mockClear();
  localStorage.clear();
  cleanup();
});
