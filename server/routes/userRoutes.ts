import { register, verifyOtp } from './../controllers/userControllers';
import express  from "express";
const userRouter=express.Router();

userRouter.post("/register",register);
userRouter.post("/verifyOtp", verifyOtp);
export default userRouter;