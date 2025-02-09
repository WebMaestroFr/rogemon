import { afterAll, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  vi.clearAllMocks();
});
