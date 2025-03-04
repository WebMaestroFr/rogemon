import { describe, it, expect } from "vitest";
import jwt from "jsonwebtoken";

import { signToken, verifyToken, JWT_SECRET } from "./userToken";

describe("userToken utilities", () => {
  const userPayload = {
    userId: "a1b2c3d4e5f6a7b8c9d0e1f2",
    email: "test@example.com",
  };

  let token: string;

  it("should sign a token with the given payload", () => {
    token = signToken(userPayload);
    expect(token).toBeDefined();
    const decoded = jwt.verify(token, JWT_SECRET) as jwt.JwtPayload;
    expect(decoded.userId).toBe(userPayload.userId);
    expect(decoded.email).toBe(userPayload.email);
  });

  it("should verify a token and return the payload", () => {
    const decodedPayload = verifyToken(token);
    expect(decodedPayload.userId).toBe(userPayload.userId);
    expect(decodedPayload.email).toBe(userPayload.email);
  });

  it("should throw an error for an invalid token", () => {
    expect(() => verifyToken("invalidtoken")).toThrow();
  });
});
