import { it, expect, vi } from "vitest";

import expectExpressHandler from "@api/testUtilities/expectExpressHandler";
import { mockExpressArguments } from "@api/testUtilities/mockExpress";
import User from "@api/models/user";

import getUser from "./getUser";

vi.mock("@api/models/user");

const _id = "a1b2c3d4e5f6a7b8c9d0e1f2";
const email = "test@example.com";

expectExpressHandler(getUser, (req) => {
  req.params = { id: _id };
});

it("should return user data if user is found", async () => {
  const [req, res, next] = mockExpressArguments({ params: { id: _id } });
  const user = { _id, email };
  User.findById = vi.fn().mockResolvedValue(user);

  await getUser(req, res, next);

  expect(User.findById).toHaveBeenCalledWith(_id);
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(user);
});

it("should return 404 if user is not found", async () => {
  const [req, res, next] = mockExpressArguments({ params: { id: _id } });
  User.findById = vi.fn().mockResolvedValue(null);

  await getUser(req, res, next);

  expect(User.findById).toHaveBeenCalledWith(_id);
  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.send).toHaveBeenCalledWith("User not found");
});

it("should call next with error if an exception occurs", async () => {
  const [req, res, next] = mockExpressArguments({ params: { id: _id } });
  const error = new Error("Database error");
  User.findById = vi.fn().mockRejectedValue(error);

  await getUser(req, res, next);

  expect(User.findById).toHaveBeenCalledWith(_id);
  expect(next).toHaveBeenCalledWith(error);
});
