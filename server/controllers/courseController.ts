import cloudinary from "cloudinary";
import { Request, Response, NextFunction } from "express";
import Course from "../models/courseModel";
import { url } from "inspector";

export const addCourse = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { name, description, price, tags, level, demoUrl, courseData } =
      req.body;

    if (
      !name ||
      !description ||
      !price ||
      !tags ||
      !level ||
      !demoUrl ||
      !courseData
    ) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    let url = null;
    let id = null;

    if (req.body.thumbnail) {
      const cloudinaryResponse = await cloudinary.v2.uploader.upload(
        req.body.thumbnail,
        {
          folder: "courses",
        }
      );
      url = cloudinaryResponse.secure_url;
      id = cloudinaryResponse.public_id;
    }

    const newCourse = await Course.create({
      ...req.body,
      thumbnail: url
        ? { url: url, id: id }
        : undefined,
    });

    res.status(201).json({
      message: "Course created successfully",
      course: newCourse,
    });
  } catch (error) {
    console.error("Error creating course: ", error);
    res.status(500).json({ message: "Failed to create course" });
  }
};

//edit course
export const updateCourse=async(req:Request,res:Response,next:NextFunction)=>{
    try {
        const course=req.body;
        const thumbnail=course.thumbnail;

        if(thumbnail){
            //delete old image from Cloudinary
            await cloudinary.v2.uploader.destroy(thumbnail.public_id);
            const cloud=await cloudinary.v2.uploader.upload(thumbnail,{
                folder:"course"
            });
            course.thumbnail={
                id:cloud.public_id,
                url:cloud.secure_url
            }
        }

        const {id}=req.params;
        const updatedCourse=await Course.findByIdAndUpdate(id,
            {$set:course},
            {new:true}
        )
        res
          .status(201)
          .json({
            message: "Course created successfully",
            course: updatedCourse,
          });

    } catch (error) {
        console.error("Error creating course: ", error);
        res.status(500).json({ message: "Failed to create course" });
    }
}