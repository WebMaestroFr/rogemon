import { Router } from "express";

import validateRequestBody from "../../middlewares/validateRequestBody";
import verifyAuth from "../../middlewares/verifyAuth";
import handleProfile from "./profile";
import handleSignInOrUp from "./signInOrUp";
import handleSignIn from "./signIn";
import handleSignUp from "./signUp";

const authRouter = Router();

authRouter.get("/profile", verifyAuth, handleProfile);

const validateSignBody = validateRequestBody({
  email: { label: "Email", required: true, email: true },
  password: { label: "Password", required: true, minLength: 6 },
});
authRouter.post("/signIn", validateSignBody, handleSignIn);
authRouter.post("/signUp", validateSignBody, handleSignUp);
authRouter.post("/signInOrUp", validateSignBody, handleSignInOrUp);

export default authRouter;
