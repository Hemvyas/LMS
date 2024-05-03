import express, { Request, Response, NextFunction } from "express";
import cors from "cors"
import cookieParser from "cookie-parser"
require("dotenv").config();


const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());


const port=process.env.PORT || 8000;
app.listen(port, () => {
  console.log(`Server started at ${port}`);
});

app.get("/", (req:Request,res:Response,next:NextFunction)=>{
    res.status(200).json("Test Route")
})

app.all("*", (req: Request, res: Response, next: NextFunction) => {
  const err=new Error(`Route not found`) as any;
  err.statusCode=404;
  next(err)
});
