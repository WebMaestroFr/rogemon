import { afterAll, beforeEach, vi } from "vitest";

import debug from "./api/utilities/debug";

debug.error = debug.warn = debug.success = debug.info = vi.fn();

beforeEach(() => {
  vi.resetAllMocks();
});

afterAll(() => {
  vi.clearAllMocks();
});
