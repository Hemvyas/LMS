require("dotenv").config();
import { NextFunction, Request, Response } from "express";
import User from "../models/userModel";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload as DefaultJwtPayload, Jwt } from "jsonwebtoken";
import ejs from "ejs"
import path from "path";
import nodemailer from "nodemailer"


//register
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json("User already exists");

    const otp = Math.floor(1000 + Math.random() * 9000).toString();

    const token = jwt.sign(
      { name, email, hashedPassword, otp },
      process.env.JWT_KEY || "secretKey",
      {
        expiresIn: "1h",
      }
    );

    const html=await ejs.renderFile(path.join(__dirname,"../email.ejs"),{name,otp})

    const transporter=nodemailer.createTransport({
        service:"gmail",
        auth:{
            user:process.env.EMAIL_ADDRESS,
            pass:process.env.EMAIL_PASS
        }
    })

    const mailOptions = {
      from: process.env.EMAIL_ADDRESS,
      to: email,
      subject: `Verify your LMS ACCount`,
      html: html,
    };

    transporter.sendMail(mailOptions,function(error,info){
        if (error) {
        console.log(error);
        res.status(500).send("Error sending email");
      } else {
        console.log("Email sent: " + info.response);
        res.json({ message: "Please check your email to verify your account",token });
      }
    })
  } catch (error) {
    console.error(error);
    res.status(500).send("Error registering the user");
  }
};


//verify-otp
interface JwtPayload extends DefaultJwtPayload {
  email: string;
  name: string;
  hashedPassword: string;
  otp: string; 
}
export const verifyOtp=async(req:Request,res:Response)=>{
    try {
        const { otp, token } = req.body;
        const decoded = jwt.verify(token, process.env.JWT_KEY || "secretkey") as JwtPayload
        if (decoded.otp !== otp) {
          return res.status(401).json({ message: "Invalid OTP" });
        }

        const { email, name, password } = decoded;
        const userExists = await User.findOne({ email });
        if (userExists) {
          return res.status(400).json({ message: "User already registered" });
        }
         const newUser = new User({
           name: decoded.name,
           email: decoded.email,
           password: decoded.hashedPassword,
         });
         await newUser.save();

         res.status(201).json({ message: "User registered successfully",newUser });
    } catch (error) {
         console.error("Verification error:", error);
         if (error instanceof jwt.JsonWebTokenError) {
           return res.status(401).json({ message: "Invalid Token" });
         }
         res.status(500).json({ message: "Internal server error" });
    }
}


//login
export const login=async(req:Request,res:Response)=>{
  const { email,password } = req.body;
  
  try {
    const user=await User.findOne({email}).select("+password");
   if (!user) {
     return res.status(404).json("User not found");
   }

   const isMatch=await bcrypt.compare(password,user.password);
    if (!isMatch) {
      return res.status(400).json("Invalid credentials");
    }
    let token = jwt.sign({ id: user._id }, process.env.JWT_KEY || "secret", {
      expiresIn: "1h",
    });

    res.cookie('token',token,{
      httpOnly:true,
    })
        const { password: _, ...userDetails } = user.toObject();
    res.status(200).json({
      message: "Logged in successfully",
      user: userDetails,
      token,
    });
    
  } catch (error) {
    console.error(error);
    res.status(500).send("Error logging in user");
  }
}

export const logout =async(req:Request,res:Response)=>{
  res.clearCookie("token");
  res.status(200).json({ message: "Logged out successfully" });
}