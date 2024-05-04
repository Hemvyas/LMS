import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

interface CustomUserPayload extends JwtPayload {
  id: string; // assuming `id` is always included in your token
  role: string; // ensure the role is included in the JWT payload
}

declare global {
  namespace Express {
    interface Request {
      user?: CustomUserPayload;
    }
  }
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ auth: false, message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_KEY || "secret"
    ) as CustomUserPayload;
    req.user = decoded;
    next();
  } catch (error) {
    console.error(error);
    res.status(401).json({ auth: false, message: "Invalid token" });
  }
};

const authorize =
  (roles: string[]) => (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ auth: false, message: "Unauthorized" });
    }

    next();
  };

export { authenticate, authorize };
