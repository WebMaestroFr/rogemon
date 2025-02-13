import { describe, it, expect, vi, Mock } from "vitest";
import handleSignup from "../../../controllers/auth/signUp";
import { User } from "../../../database";
import { validateRequestBody } from "../../../middlewares/validateRequestBody";
import mockExpress from "../../mockExpress";

vi.mock("../../../database");
vi.mock("../../../middlewares/validateRequestBody");

describe("handleSignup", () => {
  it("should return 403 if email is already used", async () => {
    const [req, res] = mockExpress({
      body: {
        name: "John",
        email: "john@example.com",
        password: "password123",
      },
    });

    (validateRequestBody as Mock).mockImplementation(() => {});
    (User.findOne as Mock).mockResolvedValue(true);

    await handleSignup(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.send).toHaveBeenCalledWith("Email already used");
  });

  it("should create a new user and return 201", async () => {
    const [req, res] = mockExpress({
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

    await handleSignup(req, res);

    expect(mockUser.save).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith(expect.any(String));
    expect(res.send).toHaveBeenCalled();
  });
});
