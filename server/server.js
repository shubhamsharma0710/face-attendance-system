require("dotenv").config();

// Auto Delete Employees After 1 Year
// require("./cron/deleteOldEmployees");

// Auto Mark Absent After 10:31 AM
// require("./cron/attendanceCron");

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const employeeRoutes = require("./routes/employeeRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");
const adminRoutes = require("./routes/adminRoutes");

const superAdminRoutes = require(
  "./routes/superAdminRoutes"
);

const companyRoutes = require(
  "./routes/companyRoutes"
);

const app = express();

// =================================
// Middleware
// =================================

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(
  express.json({
    limit: "50mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "50mb",
  })
);

// =================================
// Debug Logs
// =================================

console.log(
  "PORT:",
  process.env.PORT
);

console.log(
  "MONGO_URI:",
  process.env.MONGO_URI
);

// =================================
// MongoDB Connection
// =================================

mongoose
  .connect(
    process.env.MONGO_URI
  )
  .then(() => {
    console.log(
      "✅ MongoDB Connected Successfully"
    );
  })
  .catch((err) => {
    console.error(
      "❌ MongoDB Connection Error"
    );

    console.error(err);
  });

// =================================
// API Routes
// =================================

// Super Admin
app.use(
  "/api/superadmin",
  superAdminRoutes
);

// Company
app.use(
  "/api/company",
  companyRoutes
);

// Old Admin (remove later if not needed)
app.use(
  "/api/admin",
  adminRoutes
);

// Employees
app.use(
  "/api/employees",
  employeeRoutes
);

// Attendance
app.use(
  "/api/attendance",
  attendanceRoutes
);

// =================================
// Home Route
// =================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Face Attendance API Running",
    version: "3.0.0",
  });
});

// =================================
// Health Check
// =================================

app.get(
  "/api/health",
  (req, res) => {
    res.json({
      success: true,
      status: "Server Running",
      database:
        mongoose.connection
          .readyState === 1
          ? "Connected"
          : "Disconnected",
      time:
        new Date().toISOString(),
    });
  }
);

// =================================
// 404 Route
// =================================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});

// =================================
// Global Error Handler
// =================================

app.use(
  (
    err,
    req,
    res,
    next
  ) => {
    console.error(err);

    res.status(500).json({
      success: false,
      message:
        "Internal Server Error",
    });
  }
);

// =================================
// Start Server
// =================================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server Running on Port ${PORT}`
  );

  console.log(
    "✅ Super Admin Module Loaded"
  );

  console.log(
    "✅ Company Module Loaded"
  );

  console.log(
    "✅ Employee Module Loaded"
  );

  console.log(
    "✅ Attendance Module Loaded"
  );
});