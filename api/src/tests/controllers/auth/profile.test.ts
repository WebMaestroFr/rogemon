import { describe } from "vitest";

import handleProfile from "../../../controllers/auth/profile";
import { expectValidHandler } from "../../mockExpress";

describe("handleProfile", () => {
  expectValidHandler(handleProfile);
});
