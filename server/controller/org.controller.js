import prisma from "../lib/prisma.js";
import { wouldCreateCycle } from "../utils/orgUtils.js";

// ─────────────────────────────────────────────
// GET /api/organization/tree
// Accessible by: SUPER_ADMIN, HR_MANAGER
// Builds and returns the full org hierarchy as a nested tree.
// Root nodes = employees with no reportingManagerId.
// ─────────────────────────────────────────────
export const getOrgTree = async (req, res, next) => {
  try {
    const employees = await prisma.employee.findMany({
      where: { isDeleted: false },
      select: {
        id: true,
        employeeId: true,
        name: true,
        designation: true,
        department: true,
        status: true,
        role: true,
        profileImage: true,
        reportingManagerId: true,
      },
      orderBy: { name: "asc" },
    });

    // Build an id → node map for O(n) tree construction (avoids nested loops)
    const nodeMap = {};
    employees.forEach((emp) => {
      nodeMap[emp.id] = { ...emp, children: [] };
    });

    // Wire up parent → children relationships
    const roots = [];
    employees.forEach((emp) => {
      if (emp.reportingManagerId && nodeMap[emp.reportingManagerId]) {
        // Attach as child of its manager
        nodeMap[emp.reportingManagerId].children.push(nodeMap[emp.id]);
      } else {
        // No manager, or manager was deleted — treat as root
        roots.push(nodeMap[emp.id]);
      }
    });

    res.json(roots);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// GET /api/employees/:id/reportees
// Accessible by: SUPER_ADMIN, HR_MANAGER
// Returns only DIRECT reports (one level deep) for the given employee.
// ─────────────────────────────────────────────
export const getReportees = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Verify the employee exists
    const employee = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    const reportees = await prisma.employee.findMany({
      where: { reportingManagerId: id, isDeleted: false },
      select: {
        id: true,
        employeeId: true,
        name: true,
        email: true,
        designation: true,
        department: true,
        status: true,
        role: true,
        profileImage: true,
      },
      orderBy: { name: "asc" },
    });

    res.json(reportees);
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// PATCH /api/employees/:id/manager
// Accessible by: SUPER_ADMIN only
// Assigns or removes a reporting manager for an employee.
// Body: { managerId: string | null }
//   - Pass null to make the employee a root node (no manager)
//   - Rejects if the assignment would create a circular loop
// ─────────────────────────────────────────────
export const assignManager = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { managerId } = req.body;

    // Verify the target employee exists
    const employee = await prisma.employee.findFirst({
      where: { id, isDeleted: false },
    });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found." });
    }

    // Only validate if a non-null managerId is provided
    if (managerId != null) {
      // Self-assignment check
      if (managerId === id) {
        return res.status(400).json({
          message: "An employee cannot be their own manager.",
        });
      }

      // Verify the proposed manager exists and is active
      const manager = await prisma.employee.findFirst({
        where: { id: managerId, isDeleted: false },
      });

      if (!manager) {
        return res.status(404).json({ message: "Manager not found." });
      }

      // Walk the chain upward to detect circular dependency
      const isCyclic = await wouldCreateCycle(id, managerId);
      if (isCyclic) {
        return res.status(400).json({
          message:
            "Circular reporting detected. This assignment would create a reporting loop.",
        });
      }
    }

    // Apply the manager assignment (null = remove manager / promote to root)
    const updated = await prisma.employee.update({
      where: { id },
      data: { reportingManagerId: managerId ?? null },
    });

    const { password: _, ...updatedWithoutPassword } = updated;
    res.json({
      message: "Manager assigned successfully.",
      employee: updatedWithoutPassword,
    });
  } catch (error) {
    next(error);
  }
};

