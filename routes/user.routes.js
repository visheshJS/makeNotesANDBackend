import { Router } from "express";
import { loginUser,registerUser,logOutUser } from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

//register route
userRouter.route("/signup").post(registerUser);

//login route
userRouter.route("/login").post(loginUser);

//logout route
userRouter.route("/logout").get(verifyJWT, logOutUser);


export {userRouter};