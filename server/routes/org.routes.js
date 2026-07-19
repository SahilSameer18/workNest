import express from "express";
import { getOrgTree } from "../controller/org.controller.js";
import { authenticateToken, requireRoles } from "../middlewares/auth.middleware.js";

const router = express.Router();

// All org routes require authentication
router.use(authenticateToken);

// GET /api/organization/tree — full nested org hierarchy
router.get(
  "/tree",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  getOrgTree
);

export default router;
