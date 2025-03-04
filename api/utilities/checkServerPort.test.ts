import { it, expect, vi } from "vitest";

import mockNet, { mockNetServer } from "@api/testUtilities/mockNet";
import checkServerPort from "./checkServerPort";

const PORT = 4321;

mockNet();

it("should return false if the port is not in use", async () => {
  const mockServer = mockNetServer();
  const result = await checkServerPort(PORT);
  expect(result).toBe(false);
  expect(mockServer.close).toHaveBeenCalled();
});

it("should return true if the port is in use", async () => {
  const mockServer = mockNetServer({
    on: vi.fn((event, callback) => {
      if (event === "error") {
        callback(new Error("EADDRINUSE"));
      }
      return mockServer;
    }),
  });
  const result = await checkServerPort(PORT);
  expect(result).toBe(true);
});

it("should reject if an unexpected error occurs", async () => {
  const mockServer = mockNetServer({
    on: vi.fn((event, callback) => {
      if (event === "error") {
        callback(new Error("Test error"));
      }
      return mockServer;
    }),
  });

  await expect(checkServerPort(PORT)).rejects.toThrow("Test error");
});
