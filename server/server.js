// Express server entry point
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

// Import route definitions
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import orgRoutes from "./routes/org.routes.js";

dotenv.config();

const app = express();

// Enable Cross-Origin Resource Sharing
app.use(cors());

// Parse JSON request payloads
app.use(express.json());

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/organization", orgRoutes);

// Root Route check
app.get("/", (req, res) => {
  res.json({ message: "EMS API Server running successfully." });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;
