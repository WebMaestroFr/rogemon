import { Router } from "express";

import handleProfile from "./profile";
import handleSignin from "./signin";
import handleSignup from "./signup";
import useAuth from "../../middlewares/auth";

const authRouter = Router();

authRouter.get("/profile", useAuth, handleProfile);
authRouter.post("/signin", handleSignin);
authRouter.post("/signup", handleSignup);

export default authRouter;
