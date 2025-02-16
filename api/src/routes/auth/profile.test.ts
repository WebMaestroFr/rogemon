import { describe, vi } from "vitest";

import { ObjectId } from "../../database";
import expectExpressHandler from "../../tests/expectExpressHandler";

import handleProfile from "./profile";

describe("handleProfile", () => {
  const _id = new ObjectId("a1b2c3d4e5f6a7b8c9d0e1f2");
  const email = "test@example.com";
  const password = "password123";

  expectExpressHandler(handleProfile, (req) => {
    req.user = { _id, email, password, comparePassword: vi.fn() };
  });
});
