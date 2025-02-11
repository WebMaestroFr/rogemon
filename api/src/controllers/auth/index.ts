import { Router } from "express";

import handleProfile from "./profile";
import handleSignInOrUp from "./signInOrUp";
import useAuth from "../../middlewares/auth";

const authRouter = Router();

authRouter.get("/profile", useAuth, handleProfile);
// authRouter.post("/signIn", handleSignIn);
// authRouter.post("/signUp", handleSignUp);
authRouter.post("/signInOrUp", handleSignInOrUp);

export default authRouter;
