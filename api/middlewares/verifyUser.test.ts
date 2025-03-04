import { it, expect, vi } from "vitest";

import { mockExpressArguments } from "@api/testUtilities/mockExpress";
import User from "@api/models/user";
import { verifyToken } from "@api/utilities/userToken";

import verifyUser from "./verifyUser";

vi.mock("@api/models/user");
vi.mock("@api/utilities/userToken");

const _id = "a1b2c3d4e5f6a7b8c9d0e1f2";
const email = "test@example.com";

const mockedUser = vi.mocked(User);
const mockedVerifyToken = vi.mocked(verifyToken);

it("should add user to request if authorization header is present", async () => {
  const [req, res, next] = mockExpressArguments({
    headers: {
      authorization: "Bearer validToken",
    },
  });

  const mockUser = { _id, email };

  mockedVerifyToken.mockReturnValue({ userId: _id, email });
  mockedUser.findById.mockResolvedValue(mockUser);

  await verifyUser(req, res, next);

  expect(verifyToken).toHaveBeenCalledWith("validToken");
  expect(User.findById).toHaveBeenCalledWith(_id);
  expect(req.user).toEqual(mockUser);
  expect(next).toHaveBeenCalled();
});

it("should call next with error if token verification fails", async () => {
  const [req, res, next] = mockExpressArguments({
    headers: {
      authorization: "Bearer validToken",
    },
  });

  const mockError = new Error("Invalid token");
  mockedVerifyToken.mockImplementation(() => {
    throw mockError;
  });

  await verifyUser(req, res, next);

  expect(next).toHaveBeenCalledWith(mockError);
});

it("should call next if no authorization header is present", async () => {
  const [req, res, next] = mockExpressArguments();

  await verifyUser(req, res, next);

  expect(next).toHaveBeenCalled();
});
