import { describe, it, expect, vi, Mock } from "vitest";
import handleSignup from "../../../controllers/auth/signUp";
import { User } from "../../../database";
import validateRequestBody from "../../../utils/validateRequestBody";
import mockExpress from "../../mockExpress";

vi.mock("../../../database");
vi.mock("../../../utils/validateRequestBody");

describe("handleSignup", () => {
  it("should return 412 if request body validation fails", async () => {
    const [req, res, next] = mockExpress({
      body: { name: "", email: "", password: "" },
    });

    (validateRequestBody as Mock).mockImplementation(() => {
      throw "Validation error";
    });

    await handleSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(412);
    expect(next).toHaveBeenCalledWith("Validation error");
  });

  it("should return 403 if email is already used", async () => {
    const [req, res, next] = mockExpress({
      body: {
        name: "John",
        email: "john@example.com",
        password: "password123",
      },
    });

    (validateRequestBody as Mock).mockImplementation(() => {});
    (User.findOne as Mock).mockResolvedValue(true);

    await handleSignup(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).toHaveBeenCalledWith("Email already used.");
  });

  it("should create a new user and return 201", async () => {
    const [req, res, next] = mockExpress({
      body: {
        name: "John",
        email: "john@example.com",
        password: "password123",
      },
    });

    const mockUser = {
      save: vi
        .fn()
        .mockResolvedValue({ id: 1, name: "John", email: "john@example.com" }),
    };
    (validateRequestBody as Mock).mockImplementation(() => {});
    (User.findOne as Mock).mockResolvedValue(null);
    (User as unknown as Mock).mockImplementation(() => mockUser);

    await handleSignup(req, res, next);

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({
      id: 1,
      name: "John",
      email: "john@example.com",
    });
    expect(next).toHaveBeenCalled();
  });

  it("should call next with error if there is an exception", async () => {
    const [req, res, next] = mockExpress({
      body: {
        name: "John",
        email: "john@example.com",
        password: "password123",
      },
    });

    const error = new Error("Database error");
    (validateRequestBody as Mock).mockImplementation(() => {});
    (User.findOne as Mock).mockRejectedValue(error);

    await handleSignup(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
