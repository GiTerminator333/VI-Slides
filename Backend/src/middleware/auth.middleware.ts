import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import userModel from "../models/user.model";

export interface AuthRequest extends Request {
  user?: any; 
}

const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  let token = req.cookies?.token;

  // Also support Authorization header (Bearer token)
  if (!token && req.headers.authorization) {
    const authHeader = req.headers.authorization;
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.substring(7).trim();
    }
  }

  if (!token) {
    res.status(401).json({
      success: false,
      message: "Unauthorized: No token provided",
    });
    return;
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as JwtPayload;

    const user = await userModel
      .findById(decoded.id || decoded._id)
      .select("-password");

    if (!user) {
      res.status(401).json({
        success: false,
        message: "Unauthorized: User not found",
      });
      return;
    }

    req.user = user;

    next();
  } catch (err: any) {
    console.error("Auth Middleware Error:", err.message);

    if (err.name === "TokenExpiredError") {
      res
        .status(401)
        .json({ message: "Session expired, please login again" });
      return;
    }

    res.status(401).json({
      message: "Invalid token, authorization denied",
    });
  }
};

export default authMiddleware;