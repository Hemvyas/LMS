import express  from "express";
import { addCourse, updateCourse } from "../controllers/courseController";
import  {authenticate, authorize } from "../auth";
const courseRouter=express.Router();
courseRouter.post("/create",authenticate,authorize(["admin"]),addCourse);
courseRouter.put("/update/:id",authenticate,authorize(["admin"]),updateCourse);
export default courseRouter;