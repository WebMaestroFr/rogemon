import { describe, vi, it, expect, Mock } from "vitest";

import handleSignIn from "../../../controllers/auth/signIn";
import { User } from "../../../database";
import { signToken } from "../../../middlewares/verifyUser";
import mockExpress, { expectValidHandler } from "../../mockExpress";

vi.mock("../../../database");
vi.mock("../../../middlewares/verifyUser");

describe("handleSignIn", () => {
  const _id = "12345";
  const email = "test@example.com";
  const password = "password123";

  function mockSuccess() {
    (User.findOne as Mock).mockResolvedValueOnce({
      _id,
      email,
      password,
      comparePassword: vi.fn().mockResolvedValueOnce(true),
    });
    (signToken as Mock).mockReturnValueOnce("fakeAccessToken");
  }

  expectValidHandler(handleSignIn, (req) => {
    req.body = { email, password };
    mockSuccess();
  });

  it("should return 401 if email is not found", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    await handleSignIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return 401 if password is incorrect", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    (User.findOne as Mock).mockResolvedValueOnce({
      comparePassword: vi.fn().mockResolvedValueOnce(false),
    });

    await handleSignIn(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
  });

  it("should return access token if email and password are correct", async () => {
    const [req, res, next] = mockExpress({ body: { email, password } });

    mockSuccess();

    await handleSignIn(req, res, next);

    expect(User.findOne).toHaveBeenCalledWith({ email });
    expect(signToken).toHaveBeenCalledWith({ userId: _id, email });
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith("fakeAccessToken");
  });
});
