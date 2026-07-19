import express from "express";
import { login, logout, getMe } from "../controller/auth.controller.js";
import { validate } from "../middlewares/validate.middleware.js";
import { loginSchema } from "../validators/auth.validator.js";
import { authenticateToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// Route to handle login and set auth cookie
router.post("/login", validate(loginSchema), login);

// Route to clear auth cookie and terminate session
router.post("/logout", logout);

// Route to retrieve current user details using cookies
router.get("/me", authenticateToken, getMe);

export default router;