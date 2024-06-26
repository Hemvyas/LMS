import { v2 as cloudinary } from 'cloudinary';
import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import userRouter from "./routes/userRoutes";
import courseRouter from './routes/courseRoutes';
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use("/api/user",userRouter);
app.use("/api/course", courseRouter);



cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

const DB_URL:string=process.env.DB_URL || '';

const DBConnection=async()=>{
  try {
    await mongoose.connect(DB_URL).
    then(()=>console.log("DB Connected")).
    catch((err)=>console.log(err))
  } catch (error) {
    console.log(error);
  }
}

const port = process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
  DBConnection();
});

app.get("/", (req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json("Test Route")
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err=new Error(`Route not found`) as any;
  err.statusCode=404;
  next(err)
});
