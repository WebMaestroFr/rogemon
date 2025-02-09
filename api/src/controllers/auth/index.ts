import { Router } from "express";

import handleProfile from "./profile";
import handleSignin from "./signin";
import handleSignup from "./signup";

const authRouter = Router();

authRouter.get("/profile", handleProfile);
authRouter.post("/signin", handleSignin);
authRouter.post("/signup", handleSignup);

export default authRouter;
