import { it, expect, vi } from "vitest";

import expectExpressHandler from "@api/testUtilities/expectExpressHandler";
import { mockExpressArguments } from "@api/testUtilities/mockExpress";
import User from "@api/models/user";

import listUsers from "./listUsers";

vi.mock("@api/models/user");

expectExpressHandler(listUsers);

it("should return a list of users", async () => {
  const [req, res, next] = mockExpressArguments();
  const users = [
    { _id: "1", email: "user1@example.com" },
    { _id: "2", email: "user2@example.com" },
  ];
  User.find = vi.fn().mockResolvedValue(users);

  await listUsers(req, res, next);

  expect(User.find).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith(users);
});

it("should call next with error if an exception occurs", async () => {
  const [req, res, next] = mockExpressArguments();
  const error = new Error("Database error");
  User.find = vi.fn().mockRejectedValue(error);

  await listUsers(req, res, next);

  expect(User.find).toHaveBeenCalled();
  expect(next).toHaveBeenCalledWith(error);
});
