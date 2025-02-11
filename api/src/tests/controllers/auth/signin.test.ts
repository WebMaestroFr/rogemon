import { describe, it, expect, vi, Mock } from "vitest";
import jwt from "jsonwebtoken";

import handleSignin from "../../../controllers/auth/signIn";
import { User } from "../../../database";
import validateRequestBody from "../../../utils/validateRequestBody";
import mockExpress from "../../mockExpress";

vi.mock("../../../database");
vi.mock("../../../middlewares/auth");
vi.mock("../../../utils/validateRequestBody");
vi.mock("jsonwebtoken");

describe("handleSignin", () => {
  it("should return 412 if request body validation fails", async () => {
    const [req, res, next] = mockExpress({
      body: {
        email: "invalid",
        password: "short",
      },
    });

    (validateRequestBody as Mock).mockImplementation(() => {
      throw "Validation error";
    });

    await handleSignin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(412);
    expect(next).toHaveBeenCalledWith("Validation error");
  });

  it("should return 401 if user is not found", async () => {
    const [req, res, next] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    (User.findOne as Mock).mockResolvedValue(null);

    await handleSignin(req, res, next);

    expect(next).toHaveBeenCalledWith("Authentication failed");
  });

  it("should return 401 if password is incorrect", async () => {
    const [req, res, next] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    const mockUser = {
      comparePassword: vi.fn().mockReturnValue(false),
    };

    (User.findOne as Mock).mockResolvedValue(mockUser);

    await handleSignin(req, res, next);

    expect(next).toHaveBeenCalledWith("Authentication failed");
  });

  it("should return 201 and access token if authentication is successful", async () => {
    const [req, res, next] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    const mockUser = {
      _id: "userId",
      comparePassword: vi.fn().mockReturnValue(true),
    };
    const mockToken = "mockToken";

    (User.findOne as Mock).mockResolvedValue(mockUser);
    (jwt.sign as Mock).mockReturnValue(mockToken);

    await handleSignin(req, res, next);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(mockToken);
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if an unexpected error occurs", async () => {
    const [req, res, next] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    const error = new Error("Unexpected error");

    (User.findOne as Mock).mockRejectedValue(error);

    await handleSignin(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
