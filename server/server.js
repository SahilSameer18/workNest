// Express server entry point
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dns from "dns";

//changing dns because of db not connected
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Import route definitions
import authRoutes from "./routes/auth.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import orgRoutes from "./routes/org.routes.js";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true // Allow cookies to pass through CORS
}));

// Parse cookies and JSON request payloads
app.use(cookieParser());
app.use(express.json());

// Register API Routes
app.use("/api/auth", authRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/organization", orgRoutes);

// Root Route check
app.get("/", (req, res) => {
  res.json({ message: "WorkNest API Server running successfully." });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error("Server Error:", err.stack);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error occurred."
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

export default app;


