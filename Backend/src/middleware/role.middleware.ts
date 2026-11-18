import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const allowRoles = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }

    const userRole = (req.user.role || "").toString().trim().toLowerCase();
    const normalizedRoles = roles.map((r) => r.trim().toLowerCase());

    if (!normalizedRoles.includes(userRole)) {
      res.status(403).json({ message: "Access denied: Insufficient permissions" });
      return;
    }

    next();
  };
};