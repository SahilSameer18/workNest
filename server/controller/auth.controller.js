import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

// Validates user credentials and sets a 2-hour JWT token in an httpOnly cookie
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Find active employee by email
    const employee = await prisma.employee.findFirst({
      where: { email, isDeleted: false }
    });

    if (!employee) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Reject inactive accounts before doing any further checks
    if (employee.status === "INACTIVE") {
      return res.status(403).json({ message: "Account is inactive. Contact HR." });
    }

    // Compare input password with database hash
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate JWT token containing employee ID and role
    const token = jwt.sign(
      { employeeId: employee.employeeId, role: employee.role },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    const isProd = process.env.NODE_ENV === "production";

    // Set secure cookie with the JWT token
    res.cookie("token", token, {
      httpOnly: true, // Prevents access via client-side JavaScript (XSS protection)
      secure: isProd,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: isProd ? "none" : "lax"
    });

    const { password: _, ...userWithoutPassword } = employee;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    next(error);
  }
};

// Clears the token cookie, effectively logging out the user
export const logout = async (req, res, next) => {
  try {
    const isProd = process.env.NODE_ENV === "production";
    res.clearCookie("token", {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax"
    });
    res.json({ message: "Logged out successfully." });
  } catch (error) {
    next(error);
  }
};

// Returns current authenticated user's profile details
export const getMe = async (req, res, next) => {
  try {
    const { password: _, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  } catch (error) {
    next(error);
  }
};
