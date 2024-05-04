import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload | string;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_KEY || "secret");
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ auth: false, message: "Invalid token" });
  }
};
