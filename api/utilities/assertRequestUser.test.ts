import { ObjectId } from "mongodb";
import { it, expect } from "vitest";
import assertRequestUser from "./assertRequestUser";
import { mockExpressArguments } from "@api/testUtilities/mockExpress";
import mockUser from "@api/testUtilities/mockUser";

const _id = new ObjectId("a1b2c3d4e5f6a7b8c9d0e1f2");

it("should throw an error and send a 401 response if user is not authenticated", () => {
  const [req, res] = mockExpressArguments({ user: null });

  expect(() => assertRequestUser(req.user, res)).toThrow(
    "User is not authenticated",
  );
  expect(res.status).toHaveBeenCalledWith(401);
});

it("should not throw an error if user is authenticated", () => {
  const [req, res] = mockExpressArguments({ user: mockUser() });

  expect(() => assertRequestUser(req.user, res)).not.toThrow();
});
