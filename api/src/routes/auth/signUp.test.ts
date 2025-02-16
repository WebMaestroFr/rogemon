import { describe, it, expect, vi, Mock } from "vitest";

import { User } from "../../database";
import { signToken } from "../../middlewares/verifyUser";
import mockExpress from "../../tests/mockExpress";
import expectExpressHandler from "../../tests/expectExpressHandler";

import handleSignUp from "./signUp";

vi.mock("../../database");
vi.mock("../../middlewares/verifyUser");

describe("handleSignUp", () => {
  const _id = "a1b2c3d4e5f6a7b8c9d0e1f2";
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

  expectExpressHandler(handleSignUp, (req) => {
    req.body = { email, password };
    mockSuccess();
  });

  it("should return 409 if email is already used", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    (User.findOne as Mock).mockResolvedValueOnce({ _id });

    await handleSignUp(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(res.status).toHaveBeenCalledWith(409);
  });

  it("should create a new user and return access token", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    mockSuccess();

    await handleSignUp(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(User).toHaveBeenCalledWith({ email, password });
    expect(User.prototype.save).toHaveBeenCalled();
    expect(signToken).toHaveBeenCalledWith({ userId: _id.toString(), email });
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("fakeAccessToken");
  });
});
