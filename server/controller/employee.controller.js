import bcrypt from "bcryptjs";
import prisma from "../lib/prisma.js";

// ─────────────────────────────────────────────
// GET /api/employees
// Accessible by: SUPER_ADMIN, HR_MANAGER
// Supports: search (name/email), filter (department/role/status),
//           sort (name | joiningDate), pagination (page/limit)
// ─────────────────────────────────────────────
export const getAllEmployees = async (req, res, next) => {
  try {
    const {
      search,
      department,
      role,
      status,
      sortBy = "name",      // "name" | "joiningDate"
      order = "asc",        // "asc"  | "desc"
      page = 1,
      limit = 10,
    } = req.query;

    // Base filter — never return deleted records
    const where = { isDeleted: false };

    // Full-text search across name and email
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
      ];
    }

    // Exact-match filters
    if (department) where.department = department;
    if (role) where.role = role;
    if (status) where.status = status;

    // Only allow whitelisted sort fields to prevent injection
    const allowedSortFields = ["name", "joiningDate"];
    const resolvedSortBy = allowedSortFields.includes(sortBy) ? sortBy : "name";
    const resolvedOrder = order === "desc" ? "desc" : "asc";

    // Pagination — clamp to safe bounds
    const pageNum = Math.max(1, parseInt(page) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit) || 10));
    const skip = (pageNum - 1) * limitNum;

    // Run count and data queries in parallel for efficiency
    const [employees, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy: { [resolvedSortBy]: resolvedOrder },
        skip,
        take: limitNum,
        select: {
          id: true,
          employeeId: true,
          name: true,
          email: true,
          phone: true,
          department: true,
          designation: true,
          salary: true,
          joiningDate: true,
          status: true,
          role: true,
          profileImage: true,
          reportingManagerId: true,
          createdAt: true,
          updatedAt: true,
          // Include basic manager info for display in the list
          manager: {
            select: { id: true, name: true, designation: true },
          },
        },
      }),
      prisma.employee.count({ where }),
    ]);

    res.json({
      data: employees,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// POST /api/employees
// Accessible by: SUPER_ADMIN, HR_MANAGER
// HR_MANAGER cannot create an employee with role = SUPER_ADMIN
// ─────────────────────────────────────────────
export const createEmployee = async (req, res, next) => {
  try {
    const { password, ...rest } = req.body;

    // HR Managers are not permitted to assign the Super Admin role
    if (req.user.role === "HR_MANAGER" && rest.role === "SUPER_ADMIN") {
      return res.status(403).json({
        message: "HR Managers cannot assign the Super Admin role.",
      });
    }

    // Check for duplicate email or employeeId before attempting insert
    const duplicate = await prisma.employee.findFirst({
      where: {
        OR: [{ email: rest.email }, { employeeId: rest.employeeId }],
        isDeleted: false,
      },
    });

    if (duplicate) {
      const conflictField =
        duplicate.email === rest.email ? "email" : "employee ID";
      return res.status(409).json({
        message: `An employee with this ${conflictField} already exists.`,
      });
    }

    // Hash the plain-text password before persisting
    const hashedPassword = await bcrypt.hash(password, 10);

    const employee = await prisma.employee.create({
      data: { ...rest, password: hashedPassword },
    });

    // Strip password from the response
    const { password: _, ...employeeWithoutPassword } = employee;
    res.status(201).json(employeeWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/employees/:id
// Accessible by: SUPER_ADMIN, HR_MANAGER, EMPLOYEE
// EMPLOYEE role can only fetch their own profile
// ─────────────────────────────────────────────
export const getEmployeeById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Employees are restricted to viewing only their own record
    if (req.user.role === "EMPLOYEE" && req.user.id !== id) {
      return res.status(403).json({
        message: "Access denied. You can only view your own profile.",
      });
    }

    const employee = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
      include: {
        // Include reporting manager's basic details
        manager: {
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          },
        },
        // Include list of direct reports
        reportees: {
          where: { isDeleted: false },
          select: {
            id: true,
            name: true,
            designation: true,
            department: true,
          },
        },
      },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const { password: _, ...employeeWithoutPassword } = employee;
    res.json(employeeWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// PUT /api/employees/:id
// Accessible by: SUPER_ADMIN, HR_MANAGER
// HR_MANAGER cannot elevate any employee to SUPER_ADMIN role
// ─────────────────────────────────────────────
export const updateEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { password, ...rest } = req.body;

    // HR Managers are not permitted to assign the Super Admin role
    if (req.user.role === "HR_MANAGER" && rest.role === "SUPER_ADMIN") {
      return res.status(403).json({
        message: "HR Managers cannot assign the Super Admin role.",
      });
    }

    // Confirm the target employee exists and is not deleted
    const existing = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // If email is being changed, verify it is not taken by another active record
    if (rest.email && rest.email !== existing.email) {
      const emailConflict = await prisma.employee.findFirst({
        where: { email: rest.email, isDeleted: false, id: { not: id } },
      });
      if (emailConflict) {
        return res.status(409).json({
          message: "An employee with this email already exists.",
        });
      }
    }

    const updateData = { ...rest };

    // Re-hash the password only if a new one was supplied
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: updateData,
    });

    const { password: _, ...updatedWithoutPassword } = updated;
    res.json(updatedWithoutPassword);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// DELETE /api/employees/:id
// Accessible by: SUPER_ADMIN only
// Performs a soft delete (sets isDeleted = true)
// ─────────────────────────────────────────────
export const deleteEmployee = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Prevent a Super Admin from deleting their own account
    if (req.user.id === id) {
      return res.status(400).json({
        message: "You cannot delete your own account.",
      });
    }

    const existing = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
    });

    if (!existing) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Soft delete — record is retained in DB but hidden from all queries
    await prisma.employee.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.json({ message: "Employee deleted successfully." });
  } catch (error) {
    next(error);
  }
};

