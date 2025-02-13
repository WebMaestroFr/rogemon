import { describe, it, expect, vi, Mock } from "vitest";
import jwt from "jsonwebtoken";

import handleSignin from "../../../controllers/auth/signIn";
import { User } from "../../../database";
import mockExpress from "../../mockExpress";

vi.mock("../../../database");
vi.mock("../../../middlewares/verifyAuth");
vi.mock("../../../middlewares/validateRequestBody");
vi.mock("jsonwebtoken");

describe("handleSignin", () => {
  it("should return 401 if user is not found", async () => {
    const [req, res] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    (User.findOne as Mock).mockResolvedValue(null);

    await handleSignin(req, res);

    expect(res.send).toHaveBeenCalledWith("Invalid email or password");
  });

  it("should return 401 if password is incorrect", async () => {
    const [req, res] = mockExpress({
      body: {
        email: "test@example.com",
        password: "password123",
      },
    });

    const mockUser = {
      comparePassword: vi.fn().mockReturnValue(false),
    };

    (User.findOne as Mock).mockResolvedValue(mockUser);

    await handleSignin(req, res);

    expect(res.send).toHaveBeenCalledWith("Invalid email or password");
  });

  it("should return 200 and access token if authentication is successful", async () => {
    const [req, res] = mockExpress({
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

    await handleSignin(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockToken);
    expect(res.send).toHaveBeenCalled();
  });
});
