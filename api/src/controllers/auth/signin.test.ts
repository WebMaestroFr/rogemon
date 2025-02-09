import { describe, it, expect, vi, Mock } from "vitest";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import handleSignin from "./signin";
import User from "../../database/models/user";
import { validateRequestBody } from "../../utils/validator";

vi.mock("../../database/models/user");
vi.mock("../../middlewares/auth");
vi.mock("../../utils/validator");
vi.mock("jsonwebtoken");

describe("handleSignin", () => {
  const mockRequest = (body: { email: string; password: string }) =>
    ({
      body,
    } as Request);

  const mockResponse = () => {
    const res = {} as Response;
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };
  const mockNext = vi.fn() as NextFunction;

  it("should return 412 if request body validation fails", async () => {
    const req = mockRequest({ email: "invalid", password: "short" });
    const res = mockResponse();
    const validationError = "Validation error";

    (validateRequestBody as Mock).mockImplementation(() => {
      throw validationError;
    });

    await handleSignin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(412);
    expect(mockNext).toHaveBeenCalledWith(validationError);
  });

  it("should return 401 if user is not found", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();

    (User.findOne as Mock).mockResolvedValue(null);

    await handleSignin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith("Authentication failed");
  });

  it("should return 401 if password is incorrect", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();
    const mockUser = {
      comparePassword: vi.fn().mockReturnValue(false),
    };

    (User.findOne as Mock).mockResolvedValue(mockUser);

    await handleSignin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith("Authentication failed");
  });

  it("should return 201 and access token if authentication is successful", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();
    const mockUser = {
      _id: "userId",
      comparePassword: vi.fn().mockReturnValue(true),
    };
    const mockToken = "mockToken";

    (User.findOne as Mock).mockResolvedValue(mockUser);
    (jwt.sign as Mock).mockReturnValue(mockToken);

    await handleSignin(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockToken);
    expect(mockNext).toHaveBeenCalled();
  });

  it("should call next with error if an unexpected error occurs", async () => {
    const req = mockRequest({
      email: "test@example.com",
      password: "password123",
    });
    const res = mockResponse();
    const error = new Error("Unexpected error");

    (User.findOne as Mock).mockRejectedValue(error);

    await handleSignin(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(error);
  });
});
