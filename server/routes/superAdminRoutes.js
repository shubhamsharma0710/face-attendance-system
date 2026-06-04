const express = require("express");
const router = express.Router();

const SuperAdmin = require("../models/SuperAdmin");
const Company = require("../models/Company");
const Employee = require("../models/Employee");
const Attendance = require("../models/Attendance");

// =================================
// SUPER ADMIN LOGIN
// =================================
router.post("/login", async (req, res) => {
  try {
    console.log(req.body);

    const { username, password } =
      req.body;

    const superAdmin =
      await SuperAdmin.findOne({
        username,
      });

    console.log(
      "FOUND:",
      superAdmin
    );

    if (!superAdmin) {
      return res.status(404).json({
        message:
          "Super Admin Not Found",
      });
    }

    if (
      superAdmin.password !==
      password
    ) {
      return res.status(401).json({
        message:
          "Invalid Password",
      });
    }

    res.json({
      success: true,
      message:
        "Login Successful",
      superAdmin,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =================================
// DASHBOARD STATS
// =================================
router.get("/dashboard", async (req, res) => {
  try {
    const totalCompanies =
      await Company.countDocuments();

    const activeCompanies =
      await Company.countDocuments({
        isActive: true,
      });

    const expiredCompanies =
      await Company.countDocuments({
        expiryDate: {
          $lt: new Date(),
        },
      });

    const totalEmployees =
      await Employee.countDocuments();

    const totalAttendance =
      await Attendance.countDocuments();

    res.json({
      totalCompanies,
      activeCompanies,
      expiredCompanies,
      totalEmployees,
      totalAttendance,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =================================
// GET ALL COMPANIES
// =================================
router.get("/companies", async (req, res) => {
  try {
    const companies =
      await Company.find().sort({
        createdAt: -1,
      });

    res.json(companies);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

// =================================
// DELETE COMPANY
// =================================
router.delete(
  "/company/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndDelete(
          req.params.id
        );

      if (!company) {
        return res.status(404).json({
          message:
            "Company Not Found",
        });
      }

      res.json({
        success: true,
        message:
          "Company Deleted Successfully",
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// DISABLE COMPANY
// =================================
router.put(
  "/disable/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            isActive: false,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Company Disabled",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// ENABLE COMPANY
// =================================
router.put(
  "/enable/:id",
  async (req, res) => {
    try {
      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            isActive: true,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Company Enabled",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

// =================================
// RENEW SUBSCRIPTION
// =================================
router.put(
  "/renew/:id",
  async (req, res) => {
    try {
      const { expiryDate } =
        req.body;

      const company =
        await Company.findByIdAndUpdate(
          req.params.id,
          {
            expiryDate,
            isActive: true,
          },
          {
            new: true,
          }
        );

      res.json({
        success: true,
        message:
          "Subscription Renewed",
        company,
      });
    } catch (error) {
      res.status(500).json({
        message:
          error.message,
      });
    }
  }
);

module.exports = router;