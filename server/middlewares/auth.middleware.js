import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Authenticates JWT from cookies and attaches active user to req.user
export const authenticateToken = async (req, res, next) => {
  try {
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: "Access denied. Token missing." });
    }

    // Verify token expiration and payload
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token." });
      }

      try {
        // Load active, non-deleted user details from database
        const employee = await prisma.employee.findFirst({
          where: { 
            employeeId: decoded.employeeId,
            isDeleted: false 
          }
        });

        if (!employee) {
          return res.status(401).json({ message: "User profile not found." });
        }

        if (employee.status === "INACTIVE") {
          return res.status(403).json({ message: "Your account is deactivated. Contact HR." });
        }

        req.user = employee;
        next();
      } catch (dbError) {
        next(dbError);
      }
    });
  } catch (error) {
    next(error);
  }
};

// Verifies if the authenticated user's role is in the allowed list
export const requireRoles = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized. Auth details missing." });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied. Insufficient permissions." });
    }

    next();
  };
};

