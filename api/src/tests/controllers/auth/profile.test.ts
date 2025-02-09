import { describe, it, expect } from "vitest";
import handleProfile from "../../../controllers/auth/profile";
import mockExpress from "../../mockExpress";

describe("handleProfile", () => {
  it("should respond with user data if user is authenticated", async () => {
    const [req, res, next] = mockExpress(
      {},
      { locals: { user: { id: 1, name: "John Doe" } } }
    );

    await handleProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(res.locals.user);
    expect(next).toHaveBeenCalled();
  });

  it("should respond with 401 if user is not authenticated", async () => {
    const [req, res, next] = mockExpress();

    await handleProfile(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).toHaveBeenCalledWith("User is not authenticated");
  });
});
