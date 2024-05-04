import { login, logout, register, verifyOtp } from './../controllers/userControllers';
import express  from "express";
const userRouter=express.Router();

userRouter.post("/register",register);
userRouter.post("/verifyOtp", verifyOtp);
userRouter.post("/login",login);
userRouter.get("/logout",logout)
export default userRouter;