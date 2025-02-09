import { describe, it, expect, vi } from "vitest";
import { Request, Response, NextFunction } from "express";
import handleProfile from "./profile";

describe("handleProfile", () => {
  it("should respond with user data if user is authenticated", async () => {
    const req = {} as Request;
    const res = {
      locals: { user: { id: 1, name: "John Doe" } },
      status: vi.fn().mockReturnThis(),
      json: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await handleProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(res.locals.user);
    expect(next).toHaveBeenCalled();
  });

  it("should respond with 401 if user is not authenticated", async () => {
    const req = {} as Request;
    const res = {
      locals: {},
      status: vi.fn().mockReturnThis(),
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await handleProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith("User is not authenticated");
  });
});
