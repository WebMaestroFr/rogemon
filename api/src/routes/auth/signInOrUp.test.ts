import { describe, it, expect, vi, Mock } from "vitest";

import { ObjectId, User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import mockExpress from "../../tests/mockExpress";
import expectExpressHandler from "../../tests/expectExpressHandler";

import handleSignInOrUp from "./signInOrUp";

vi.mock("../../database");
vi.mock("../../middlewares/verifyUser");

describe("handleSignInOrUp", () => {
  const _id = new ObjectId("a1b2c3d4e5f6a7b8c9d0e1f2");
  const email = "test@example.com";
  const password = "password123";

  function mockSuccess() {
    (User.findOne as Mock).mockResolvedValueOnce(null);
    (User.prototype.save as Mock).mockResolvedValueOnce({
      _id,
      email,
      password,
    });
    (signToken as Mock).mockReturnValueOnce("fakeAccessToken");
  }

  expectExpressHandler(handleSignInOrUp, (req) => {
    req.body = { email, password };
    mockSuccess();
  });

  it("should return 401 if email is already used and password is incorrect", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    (User.findOne as Mock).mockResolvedValueOnce({
      comparePassword: vi.fn().mockResolvedValueOnce(false),
    });

    await handleSignInOrUp(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return access token if email is already used and password is correct", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    (User.findOne as Mock).mockResolvedValueOnce({
      _id,
      email,
      password,
      comparePassword: vi.fn().mockResolvedValueOnce(true),
    });
    (signToken as Mock).mockReturnValueOnce("fakeAccessToken");

    await handleSignInOrUp(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(signToken).toHaveBeenCalledWith({ userId: _id.toString(), email });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("fakeAccessToken");
  });

  it("should create a new user and return access token", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    mockSuccess();

    await handleSignInOrUp(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User).toHaveBeenCalledWith({ email, password });
    expect(User.prototype.save).toHaveBeenCalled();
    expect(signToken).toHaveBeenCalledWith({ userId: _id.toString(), email });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("fakeAccessToken");
  });
});
