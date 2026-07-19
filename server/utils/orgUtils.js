import prisma from "../lib/prisma.js";

// ─────────────────────────────────────────────
// Walks UP the manager chain starting from proposedManagerId.
// Returns true if employeeId is encountered — meaning the assignment
// would create a circular reporting loop.
//
// Example cycle:  A → B → C → A  (A assigned as manager of C)
// ─────────────────────────────────────────────
export async function wouldCreateCycle(employeeId, proposedManagerId) {
  let currentId = proposedManagerId;

  while (currentId) {
    // If we hit the target employee while walking up — it's a cycle
    if (currentId === employeeId) return true;

    // Move one level up the chain
    const current = await prisma.employee.findFirst({
      where: { id: currentId, isDeleted: false },
      select: { reportingManagerId: true },
    });

    // Chain ends (root node or deleted manager) — no cycle
    if (!current) break;
    currentId = current.reportingManagerId;
  }

  return false;
}
