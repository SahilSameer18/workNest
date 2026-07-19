import { z } from "zod";

// Match exact Prisma Enums
const RoleEnum = z.enum(["SUPER_ADMIN", "HR_MANAGER", "EMPLOYEE"]);
const StatusEnum = z.enum(["ACTIVE", "INACTIVE"]);

// Zod schema to validate creating a new employee profile
export const createEmployeeSchema = z.object({
  employeeId: z
    .string({ required_error: "Employee ID is required." })
    .regex(/^EMP\d{3,5}$/, "Employee ID format must be EMPxxx.")
    .trim(),
  name: z
    .string({ required_error: "Name is required." })
    .min(1, "Name cannot be empty.")
    .trim(),
  email: z
    .string({ required_error: "Email is required." })
    .email("Invalid email format.")
    .trim()
    .toLowerCase(),
  password: z
    .string({ required_error: "Password is required." })
    .min(6, "Password must be at least 6 characters."),
  phone: z
    .string({ required_error: "Phone number is required." })
    .min(1, "Phone number is required.")
    .trim(),
  department: z
    .string({ required_error: "Department is required." })
    .min(1, "Department is required.")
    .trim(),
  designation: z
    .string({ required_error: "Designation is required." })
    .min(1, "Designation is required.")
    .trim(),
  salary: z.coerce
    .number({ required_error: "Salary is required." })
    .positive("Salary must be a positive number."),
  joiningDate: z.coerce
    .date({ required_error: "Joining Date is required." }),
  status: StatusEnum.default("ACTIVE"),
  role: RoleEnum.default("EMPLOYEE"),
  profileImage: z.string().optional().nullable(),
  reportingManagerId: z.string().uuid("Invalid manager ID format.").optional().nullable()
});

// Zod schema for update actions (all fields optional, omits immutable employeeId)
export const updateEmployeeSchema = createEmployeeSchema.partial().omit({
  employeeId: true // Employee ID cannot be changed once created
});

// Zod schema for PATCH /api/employees/:id/manager
// Accepts a valid UUID to assign a manager, or null to remove the manager
export const managerAssignSchema = z.object({
  managerId: z
    .string({ required_error: "Manager ID is required." })
    .uuid("Manager ID must be a valid UUID.")
    .nullable(),
});
