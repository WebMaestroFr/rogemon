import { it, expect } from "vitest";

import { mockExpressArguments } from "@api/testUtilities/mockExpress";

import handleError from "./handleError";

it("should log error and send a 500 when an Error object is passed", () => {
  const [req, res, next] = mockExpressArguments();
  const error = new Error("Test error");

  handleError(error, req, res, next);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("Internal server error");
});

it("should log error and send a 500 when a string is passed", () => {
  const [req, res, next] = mockExpressArguments();
  const error = "Test error";

  handleError(error, req, res, next);

  expect(res.status).toHaveBeenCalledWith(500);
  expect(res.send).toHaveBeenCalledWith("Internal server error");
});

it("should not send a 500 if headers are already sent", () => {
  const [req, res, next] = mockExpressArguments({}, { headersSent: true });
  const error = new Error("Test error");

  handleError(error, req, res, next);

  expect(res.status).not.toHaveBeenCalled();
  expect(res.send).not.toHaveBeenCalled();
});
