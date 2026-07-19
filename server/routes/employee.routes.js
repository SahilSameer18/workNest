import express from "express";
import {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controller/employee.controller.js";
import {
  getReportees,
  assignManager,
} from "../controller/org.controller.js";
import { authenticateToken, requireRoles } from "../middlewares/auth.middleware.js";
import { validate } from "../middlewares/validate.middleware.js";
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  managerAssignSchema,
} from "../validators/employee.validator.js";

const router = express.Router();

// All routes below require a valid JWT cookie
router.use(authenticateToken);

// GET /api/employees — list with search/filter/sort/pagination
router.get(
  "/",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  getAllEmployees
);

// POST /api/employees — create a new employee record
router.post(
  "/",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  validate(createEmployeeSchema),
  createEmployee
);

// GET /api/employees/:id — fetch single employee (EMPLOYEE sees own profile only)
router.get(
  "/:id",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER", "EMPLOYEE"]),
  getEmployeeById
);

// PUT /api/employees/:id — update employee details
router.put(
  "/:id",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  validate(updateEmployeeSchema),
  updateEmployee
);

// DELETE /api/employees/:id — soft delete (SUPER_ADMIN only)
router.delete(
  "/:id",
  requireRoles(["SUPER_ADMIN"]),
  deleteEmployee
);

// GET /api/employees/:id/reportees — direct reports of an employee
router.get(
  "/:id/reportees",
  requireRoles(["SUPER_ADMIN", "HR_MANAGER"]),
  getReportees
);

// PATCH /api/employees/:id/manager — assign or remove reporting manager
router.patch(
  "/:id/manager",
  requireRoles(["SUPER_ADMIN"]),
  validate(managerAssignSchema),
  assignManager
);

export default router;



