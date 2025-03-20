import { Router } from "express";
import { check, login, userRegistration } from "../controllers/user.controllers.js";
import verifyToken from "../middleware/verifyToken.middleware.js";

const userRouter = Router();

userRouter.post('/register', userRegistration)
userRouter.post('/login', login)
userRouter.get('/check', verifyToken, check)

export default userRouter;