import { Router } from "express";

import handleProfile from "./profile";
import handleSignInOrUp from "./signInOrUp";
import handleSignIn from "./signIn";
import handleSignUp from "./signUp";

const authRouter = Router();

authRouter.post("/signIn", handleSignIn);
authRouter.post("/signUp", handleSignUp);
authRouter.post("/signInOrUp", handleSignInOrUp);

authRouter.get("/profile", handleProfile);

export default authRouter;
