import { Router } from "express";

import handleProfile from "./profile";
import handleSignIn from "./signIn";
import handleSignInOrUp from "./signInOrUp";
import handleSignUp from "./signUp";

const authRouter = Router();

authRouter.get("/profile", handleProfile);
authRouter.post("/signIn", handleSignIn);
authRouter.post("/signInOrUp", handleSignInOrUp);
authRouter.post("/signUp", handleSignUp);

export default authRouter;
