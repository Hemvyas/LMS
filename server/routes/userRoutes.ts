import { getAllUser, getUser, login, logout, register, updateAvatar, updatePassword, updateUser, verifyOtp } from './../controllers/userControllers';
import express  from "express";
import {authenticate} from "../auth"
const userRouter=express.Router();

userRouter.post("/register",register);
userRouter.post("/verifyOtp", verifyOtp);
userRouter.post("/login",login);
userRouter.get("/logout",logout);
userRouter.put("/updateUser/:id", authenticate, updateUser);
userRouter.put("/updatePass/:id", authenticate, updatePassword);
userRouter.get("/:id",authenticate, getUser);
userRouter.get("/", getAllUser);
userRouter.put("/updateAvatar/:id",authenticate, updateAvatar);

export default userRouter;